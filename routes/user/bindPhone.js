var api = require('../../common/api.js');
var db = require('../../models/index.js');
var log = require('../../instances/log.js');
var defines = require('../../common/Defines.js');
var dayu = require('../../common/alidayu.js');
var checkPhone = require('../../common/checkPhoneNum.js');
var currentUserId = require('../../common/currentUserId.js');
var auth = require('../../common/auth.js');
var userDB = db.models.b_user;
var thirdpartycertifierDB = db.models.b_third_party_certifier;


module.exports = (router) => {
    router.get(api.apiPath + api.bindPhoneSendGET.path, function*() {

        this.checkQuery('phone').notEmpty();

        if (this.errors) {
            this.errors[0] = 'bindPhoneSendGET_3';
            this.body = this.errors;
            this.status = 400;
            return;
        }

        var phone = this.query.phone;
        if (!checkPhone(phone)) {
            this.body = [{
                errCode: 'bindPhoneSendGET_0',
                error: '手机号不符合要求'
            }];
            this.status = 400;
            return;
        }

        var userId = yield currentUserId.apply(this);

        var third_user = yield thirdpartycertifierDB.findAll({
            where: {
                b_user_id: userId
            }
        });

        if (third_user.length === 0) {
            this.body = [{
                errCode: 'bindPhoneSendGET_1',
                error: '该用户不是第三方登陆用户!'
            }];
            this.status = 400;
            return;
        }

        var ret = yield dayu.send(phone, defines.smsTemplateCode.loginConfirmVerify);
        if (ret === true) {
            this.body = {
                success: true
            };
            this.status = 200;
        } else {
            this.body = [{
                errCode: 'bindPhoneSendGET_2',
                error: '获取验证码失败'
            }];
            this.status = 400;
        }
    });



    router.get(api.apiPath + api.bindPhoneVerifyGET.path, function*() {

        this.checkQuery('phone').notEmpty();
        this.checkQuery('verifycode').notEmpty();

        if (this.errors) {
            this.errors[0].errCode = 'bindPhoneVerifyGET_0';
            this.body = this.errors;
            this.status = 400;
            return;
        }

        var phone = this.query.phone;
        var verifycode = this.query.verifycode;

        if (!checkPhone(phone)) {
            this.body = [{
                errCode: 'bindPhoneVerifyGET_1',
                error: '手机号不符合要求'
            }];
            this.status = 400;
            return;
        }

        var result = yield dayu.verify(phone, verifycode);
        if (!result) {
            this.body = [{
                errCode: 'bindPhoneVerifyGET_2',
                error: '验证码错误'
            }];
            this.status = 400;
            return;
        }

        log.debug('第三方用户绑定手机验证通过');

        var userId = yield currentUserId.apply(this);

        var third_user = yield thirdpartycertifierDB.findAll({
            where: {
                b_user_id: userId
            }
        });

        if (third_user.length === 0) {
            this.body = [{
                errCode: 'bindPhoneVerifyGET_3',
                error: '该用户不是第三方登陆用户!'
            }];
            this.status = 400;
            return;
        }

        var user = yield userDB.findOne({
            where: {
                phone: phone
            },
            attributes: ['id', 'name', 'phone']
        });

        var now_user = yield userDB.findOne({
            where: {
                id: userId
            },
            attributes: ['id', 'name', 'phone']
        });

        if (!user) {
            log.debug('用户绑定的手机之前不存在，直接绑定');
            var t = yield db.transaction();
            try {
                yield userDB.update({
                    phone: phone
                }, {
                    where: {
                        id: userId
                    },
                    transaction: t
                });
                yield t.commit();
                log.debug('userId=' + userId + '的用户已经绑定手机' + phone);
            } catch (e) {
                yield t.rollback();
                log.error(e);
                this.body = [{
                    errCode: api.apiErrParse(e.message, 'bindPhoneVerifyGET'),
                    error: e,
                    success: false
                }];
                this.status = 400;
                return;

            }



            this.body = {
                success: true
            };
            this.status = 200;
            return;

        }



        //如果之前已经存在手机，需要将之前已经存在的账户和现有的第三方账户绑定，并将user表中第三方账户的status设置为无效
        log.debug('该手机之前已经存在，将现在的第三方登陆账户和该手机关联');


        if (now_user.phone === phone) {
            this.body = [{
                errCode: 'bindPhoneVerifyGET_4',
                error: '将要绑定的手机号和当前帐号的手机号相同，无需重复操作',
                success: false
            }];
            this.status = 400;
            return;
        }

        var t = yield db.transaction();



        try {

            //之前存在的账户绑定第三方账户
            yield thirdpartycertifierDB.update({
                b_user_id: user.id
            }, {
                where: {
                    b_user_id: userId
                },
                transaction: t
            });

            //现有的账户status 设置为无效
            yield userDB.update({
                status: -1
            }, {
                where: {
                    id: userId
                },
                transaction: t
            });

            yield t.commit();

            log.debug('用户绑定新手机，并修改之前帐号数据成功');
            log.debug('userId=' + userId + '的用户已经绑定手机' + phone + ',新的用户ID为' + user.id);
        } catch (e) {
            yield t.rollback();
            log.error(e);
            this.body = [{
                errCode: api.apiErrParse(e.message, 'bindPhoneVerifyGET'),
                error: e,
                success: false
            }];
            this.status = 400;
            return;

        }

        yield auth.logout(this);
        this.logout();

        var user_relogin = yield userDB.findById(user.id);

        yield auth.login(this, user_relogin.dataValues, 0);
        yield this.login(user_relogin.dataValues);

        this.body = {
            success: true,
        };
        this.status = 200;
        return;

    });



}