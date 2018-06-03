var db = require('../../models/index');
var passport = require('koa-passport');
var acl = require('../../instances/acl');
var api = require('../../common/api.js');
var auth = require('../../common/auth.js');
var log = require('../../instances/log.js');
var defines = require('../../common/Defines.js');
var dayu = require('../../common/alidayu.js');

var role = db.models.b_role;
var tpUsers = db.models.b_third_party_certifier;

module.exports = (router) => {
    router.delete('/api/v0001/acl_role/:role', function*() {
        this.checkParams('role').notEmpty();
        if (this.errors) {
            return this.throw('invalid user role!\n', 400);
        }
        var roles;
        var roleName = this.params.role;

        if (roleName === 'all') {
            roles = yield role.findAll();
            for (var item of roles)
                yield acl.delAclRole(item.name);
        } else {
            roles = yield role.findOne({
                where: {
                    name: roleName
                },
                raw: true
            });
            if (roles === null) {
                return this.throw('invalid user role!\n', 400);
            }
            yield acl.delAclRole(roles.name);
        }

        this.status = 200;
    });
    router.get('/api/v0001/acl_role', function*() {
        var info;

        this.body = '';
        info = yield acl.getAclRoleResource('public');
        this.body += 'public: ';
        this.body += JSON.stringify(info);
        this.body += ('\n');

        var roles = yield role.findAll();
        for (var item of roles) {
            info = yield acl.getAclRoleResource(item.name);
            this.body += item.name + ': ';
            this.body += JSON.stringify(info);
            this.body += ('\n');
        }
        this.status = 200;
    });

    router.post(api.apiPath + api.appLoginPOST.path, function*() {
        var ctx = this;

        this.checkBody('username').notEmpty();
        if (this.errors) {
            this.errors[0].errCode = 'appLoginPOST_0';
            ctx.status = 400;
            ctx.body = this.errors;
            return;
        }
        this.checkBody('password').notEmpty();
        if (this.errors) {
            this.errors[0].errCode = 'appLoginPOST_1';
            ctx.status = 400;
            ctx.body = this.errors;
            return;
        }
        var auid = this.request.body.auid;

        yield passport.authenticate('local', function*(err, user, info) {
            if (err) {
                throw err;
            }
            if (user === false) {
                ctx.status = 400;
                ctx.body = [{
                    errCode: 'appLoginPOST_2'
                }];
            } else {
                yield auth.login(ctx, user, 0);
                delete user.modules;
                yield ctx.login(user);

                if (auid) {
                    auid = auid.substring(6);
                    var tpUser = yield tpUsers.findOne({
                        where: {
                            account: auid
                        }
                    });
                    log.debug(JSON.stringify(tpUser));
                    if (tpUser) {
                        tpUser.b_user_id = user.id;
                        yield tpUser.save();
                    } else {
                        // yield auth.logout(this);
                        ctx.status = 400;
                        ctx.body = [{
                            errCode: 'appLoginPOST_3'
                        }];
                        return;
                    }
                }
                ctx.status = 200;
                delete user.password;
                ctx.body = JSON.stringify(user);
            }
        });
    });

    router.get(api.apiPath + api.checkLoginGET.path, function*() {
        var user = yield auth.user(this);
        if (user) {
            delete user.modules;
            var ret = {
                data: user,
                code: 200
            };

            this.status = 200;
            this.body = JSON.stringify(ret);
        } else {
            this.status = 400;
            this.body = [{
                'Error': 'nerver login!'
            }];
        }

    });


    router.get(api.apiPath + api.appLogoutGET.path, function*() {
        yield auth.logout(this);
        this.logout();
        this.session = null;
        this.body = [];
        this.status = 200;
    });

    router.get(api.apiPath + api.currentUserIdGET.path, function*() {
        var user = yield auth.user(this);
        if (user) {
            this.body = {
                id: user.id
            };
            this.status = 200;
            return;
        }
        this.body = [{
            'errInfo': 'ForbiddenError'
        }];
        this.status = 451;
    });

    var redirectCookieName = 'redirect_uri';
    router.get('/auth/alipay/callback', function*() {
        var ctx = this;
        yield passport.authenticate('Alipay', function*(err, user, info) {
            if (err) {
                ctx.status = 400;
                ctx.body = {
                    error: err
                };
                return;
            }
            if (user === false) {
                ctx.status = 400;
                ctx.body = {
                    error: 'authenticate failed'
                };
            } else {
                yield auth.login(ctx, user, 0);
                yield ctx.login(user);
                var redirect = ctx.cookies.get(redirectCookieName);
                ctx.redirect(redirect);
            }
        });

    });

    router.get('/api/v0001/alipayLogin', function*() {
        var id2 = this.query.id2;
        var redirect;
        yield passport.authenticate('Alipay', function*(err, user, info) {});
        if (!id2) {
            redirect = '/';
        } else {
            redirect = '/#/?_k=emevbv&id2=' + id2;
        }
        var nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        this.cookies.set(redirectCookieName, redirect, {
            expires: nextMonth
        });

    });



    router.get('/api/v0001/wxwebLogin', function*() {
        yield passport.authenticate('loginByWeixin');
    });


    router.get('/auth/wxweb/callback', function*() {

        var ctx = this;
        yield passport.authenticate('loginByWeixin', function*(err, user, info) {

            log.debug('微信web第三方登陆成功:user:' + JSON.stringify(user));
            if (err) {
                log.error('err:' + err);
                ctx.status = 400;
                ctx.body = {
                    error: err
                };
                return;
            }
            if (user === false) {
                ctx.status = 400;
                ctx.body = {
                    error: 'authenticate failed'
                };
            } else {
                yield auth.login(ctx, user, 0);
                yield ctx.login(user);
                ctx.redirect('/');
            }
        });
    });


    router.get('/api/v0001/wxLogin', function*() {
        var id2 = this.query.id2;
        var redirect;
        yield passport.authenticate('loginByWeixinClient');
        if (!id2) {
            redirect = '/';
        } else {
            redirect = '/#/?_k=emevbv&id2=' + id2;
        }
        var nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        this.cookies.set(redirectCookieName, redirect, {
            expires: nextMonth
        });
    });


    router.get('/auth/wx/callback', function*() {

        var ctx = this;
        yield passport.authenticate('loginByWeixinClient', function*(err, user, info) {

            log.debug('微信公众号第三方登陆成功:user:' + JSON.stringify(user));
            if (err) {
                log.error('err:' + err);
                ctx.status = 400;
                ctx.body = {
                    error: err
                };
                return;
            }
            if (user === false) {
                ctx.status = 400;
                ctx.body = {
                    error: 'authenticate failed'
                };
            } else {
                yield auth.login(ctx, user, 0);
                yield ctx.login(user);
                var redirect = ctx.cookies.get(redirectCookieName);
                ctx.redirect(redirect);
            }
        });
    });

    // 验证码登录，获取短信验证码
    router.put(api.apiPath + api.loginVerificationPUT.path + ':mobile', function*() {

        var ret;
        this.checkParams('mobile').notEmpty();
        if (this.errors) {
            ret = {
                err: '手机号不能为空',
            };
            this.body = JSON.stringify(ret);
            this.status = 400;
            return;
        }

        ret = yield dayu.send(this.params.mobile, defines.smsTemplateCode.loginConfirmVerify);
        if (ret === true) {
            ret = {
                err: '获取验证码成功',
            };
            this.body = JSON.stringify(ret);
            this.status = 200;
        } else {
            ret = {
                err: '获取验证码失败',
            };
            this.body = JSON.stringify(ret);
            this.status = 400;
        }
    });

    // 验证码登录
    router.post(api.apiPath + api.loginVerificationPOST.path, function*() {
        var ctx = this;

        this.checkBody('username').notEmpty();
        if (this.errors) {
            this.errors[0].errCode = 'loginVerificationPOST_0';
            ctx.status = 400;
            ctx.body = this.errors;
            return;
        }
        this.checkBody('verifycode').notEmpty();
        if (this.errors) {
            this.errors[0].errCode = 'loginVerificationPOST_1';
            ctx.status = 400;
            ctx.body = this.errors;
            return;
        }

        yield passport.authenticate('local-vcode', function*(err, user, info) {
            if (err) {
                throw err;
            }
            if (user === false) {
                ctx.status = 400;
                ctx.body = [{
                    errCode: 'loginVerificationPOST_2'
                }];
            } else {
                yield auth.login(ctx, user, 0);
                delete user.modules;
                yield ctx.login(user);

                ctx.status = 200;
                delete user.password;
                ctx.body = JSON.stringify(user);
            }
        });
    });
};
