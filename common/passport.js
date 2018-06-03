var co = require('co');
var db = require('../models/index');
var bCrypt = require('bcrypt-nodejs');
var passport = require('koa-passport');
var auth = require('../common/auth.js');
var log = require('../instances/log.js');
var cfg = require('../instances/config.js');
var defines = require('../common/Defines.js');
var localStrategy = require('passport-local').Strategy;
var alipayStrategy = require('passport-alipay-oauth2').Strategy;
var WeixinStrategy = require('passport-weixin');
var dayu = require('../common/alidayu.js');
var userType = require('../common/Defines.js').User.Type;

var Users = db.models.b_user;
var userRole = db.models.b_user_role;

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    co(function*() {
        var user = yield Users.findById(id);
        done(null, user);
    });
});

passport.use(new localStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, function(username, password, done) {

    co(function*() {
        var user = yield Users.findOne({
            where: {
                phone: username,
                status: 0
            },
            raw: true
        });

        if (!user) {
            return done(null, false, {
                message: 'Incorrect username.'
            });
        }

        bCrypt.compare(password, user.password, function(err, res) {
            if (!res) {
                return done(null, false, {
                    message: 'Incorrect password.'
                });
            }
        });

        return user;
    }).then(function(user) {
        done(null, user);
    }, function(err) {
        done(err);
    });

}));

passport.use('local-vcode', new localStrategy({
    usernameField: 'username',
    passwordField: 'verifycode'
}, function(username, verifycode, done) {

    co(function*() {
        var result = yield dayu.verify(username, verifycode);
        if (!result) {
            return done(null, false, {
                message: 'Incorrect verifycode.'
            });
        }

        var user = yield Users.findOne({
            where: {
                phone: username,
                status: 0
            },
            raw: true
        });

        if (!user) {
            user = yield Users.create({
                phone: username,
                status: 0
            });
            yield userRole.create({
                b_user_id: user.id,
                b_role_id: userType.user,
            });

            user = user.dataValues;
        }

        return user;
    }).then(function(user) {
        done(null, user);
    }, function(err) {
        done(err);
    });

}));

var tpUsers = db.models.b_third_party_certifier;
passport.use(new alipayStrategy({
        app_id: cfg.alipay.appId,
        callbackURL: cfg.alipay.server + '/auth/alipay/callback',
        scope: 'auth_user',
        state: 'init',
        private_key: cfg.alipay.privateKey,
        alipay_public_key: cfg.alipay.alipayPublicKey
    },
    function(token, tokenSecret, profile, done) {
        // retrieve user ...
        log.info(token, tokenSecret, profile);
        co(function*() {
            var t = yield db.transaction();
            try {
                var alipay_uid = profile.user_id;
                var tpUser = yield tpUsers.findOne({
                    where: {
                        account: alipay_uid
                    },
                    transaction: t
                });
                if (tpUser === null) {
                    tpUser = yield tpUsers.create({
                        b_user_id: null,
                        account: alipay_uid,
                        tdate: new Date(),
                        type: defines.thirdpartycertifier.type.alipay.val,
                        status: defines.thirdpartycertifier.status.available.val,
                        name: profile.nick_name,
                        headimage: profile.avatar,
                        province: profile.province,
                        city: profile.city,
                        gender: profile.gender,
                        explain: JSON.stringify(profile),
                        token: null
                    }, {
                        transaction: t
                    });
                }
                var user;
                if (tpUser.b_user_id === null) {
                    user = yield auth.register(null, null, profile.nick_name, profile.avatar, t);
                    tpUser.b_user_id = user.id;
                    yield tpUser.save({
                        transaction: t
                    });
                } else {
                    user = yield Users.findById(tpUser.b_user_id, {
                        transaction: t
                    });
                }
                yield t.commit();
            } catch (e) {
                yield t.rollback();
                done(null, false);
            }

            done(null, user.dataValues);
        });

    }));

//微信web第三方登陆
passport.use('loginByWeixin', new WeixinStrategy({
    clientID: cfg.wx_login_web.AppID,
    clientSecret: cfg.wx_login_web.AppSecret,
    callbackURL: cfg.wxpay.weburl + '/auth/wxweb/callback',
    requireState: false,
    scope: 'snsapi_login'
}, function(accessToken, refreshToken, profile, done) {

    co(function*() {
        var t = yield db.transaction();
        try {
            var wx_login_account = profile._json.unionid;
            var sex;
            if (profile._json.sex == 1) {
                sex = 'm';
            } else if (profile._json.sex == 2) {
                sex = 'f';
            };

            var tpUser = yield tpUsers.findOne({
                where: {
                    account: wx_login_account
                },
                transaction: t
            });
            if (tpUser === null) {
                tpUser = yield tpUsers.create({
                    b_user_id: null,
                    account: wx_login_account,
                    tdate: new Date(),
                    type: defines.thirdpartycertifier.type.weixin.val,
                    status: defines.thirdpartycertifier.status.available.val,
                    name: profile._json.nickname,
                    headimage: profile._json.headimgurl,
                    province: profile._json.province,
                    city: profile._json.city,
                    gender: sex,
                    token: null
                }, {
                    transaction: t
                });
            }
            var user;
            if (tpUser.b_user_id === null) {
                user = yield auth.register(null, null, profile._json.nickname, profile._json.headimgurl, t);
                tpUser.b_user_id = user.id;
                yield tpUser.save({
                    transaction: t
                });
            } else {
                user = yield Users.findById(tpUser.b_user_id, {
                    transaction: t
                });
            }
            yield t.commit();
        } catch (e) {
            log.error(e);
            yield t.rollback();
            done(null, false);
        }



        done(null, user.dataValues, 'success');
    });
}));



//微信公众号第三方登陆
//需要记录openid
passport.use('loginByWeixinClient', new WeixinStrategy({
    clientID: cfg.wxpay.appid,
    clientSecret: cfg.wxpay.app_secret,
    callbackURL: cfg.wxpay.weburl + '/auth/wx/callback',
    requireState: false,
    authorizationURL: 'https://open.weixin.qq.com/connect/oauth2/authorize',
    //[公众平台-网页授权获取用户基本信息]的授权URL 不同于[开放平台-网站应用微信登录]的授权URL
    scope: 'snsapi_userinfo' //[公众平台-网页授权获取用户基本信息]的应用授权作用域 不同于[开放平台-网站应用微信登录]的授权URL
}, function(accessToken, refreshToken, profile, done) {

    co(function*() {
        var t = yield db.transaction();
        try {
            var wx_login_account = profile._json.unionid;
            var sex;
            if (profile._json.sex == 1) {
                sex = 'm';
            } else if (profile._json.sex == 2) {
                sex = 'f';
            };

            var tpUser = yield tpUsers.findOne({
                where: {
                    account: wx_login_account
                },
                transaction: t
            });
            var gzh_openid = {
                gzh_openid: profile._json.openid
            };
            if (tpUser === null) {
                tpUser = yield tpUsers.create({
                    b_user_id: null,
                    account: wx_login_account,
                    tdate: new Date(),
                    type: defines.thirdpartycertifier.type.weixin.val,
                    status: defines.thirdpartycertifier.status.available.val,
                    name: profile._json.nickname,
                    headimage: profile._json.headimgurl,
                    province: profile._json.province,
                    city: profile._json.city,
                    gender: sex,
                    explain: JSON.stringify(gzh_openid),
                    token: null
                }, {
                    transaction: t
                });
            }
            //用户在微信公众号登陆时 需要更新explain字段以存储openid
            if (!tpUser.explain) {

                yield tpUsers.update({
                    explain: JSON.stringify(gzh_openid)
                }, {
                    where: {
                        id: tpUser.id
                    }
                }, {
                    transaction: t
                });
            }

            var user;
            if (tpUser.b_user_id === null) {
                user = yield auth.register(null, null, profile._json.nickname, profile._json.headimgurl, t);
                tpUser.b_user_id = user.id;
                yield tpUser.save({
                    transaction: t
                });
            } else {
                user = yield Users.findById(tpUser.b_user_id, {
                    transaction: t
                });
            }
            yield t.commit();
        } catch (e) {
            log.error(e);
            yield t.rollback();
            done(null, false);
        }



        done(null, user.dataValues, 'success');
    });

}));