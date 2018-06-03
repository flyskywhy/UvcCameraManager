var bCrypt = require('bcrypt-nodejs');
var api = require('../../common/api.js');
var db = require('../../models/index.js');
var auth = require('../../common/auth.js');
var defines = require('../../common/Defines.js');
var dayu = require('../../common/alidayu.js');

module.exports = (router) => {

    var usersTbl = db.models.b_user;

    router.get('/api/v0001/userExistence', function*() {

        var phone = this.query.phone;
        var name = this.query.name;
        var user = yield usersTbl.findOne({
            where: {
                $or: [{
                    'name': [name]
                }, {
                    'phone': [phone]
                }]
            }
        });

        if (user !== null) {
            this.body = user.id;
            this.status = 200;
        } else {
            this.status = 400;
        }
    });

    router.put(api.apiPath + api.userVerificationPUT.path + ':mobile', function*() {

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

        ret = yield dayu.send(this.params.mobile, defines.smsTemplateCode.userRegisterVerify);
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

    router.put(api.apiPath + api.userForgetPasswdVerificationPUT.path + ':mobile', function*() {

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

        ret = yield dayu.send(this.params.mobile, defines.smsTemplateCode.changePasswordVerify);
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

    router.post(api.apiPath + api.registerPOST.path, function*() {

        var ret;
        this.checkBody('phone').notEmpty();
        this.checkBody('password').notEmpty();
        if (this.errors) {
            ret = {
                err: '手机号或密码不能为空',
            };
            this.body = JSON.stringify(ret);
            this.status = 400;
            return;
        }

        var code = this.request.body.verifCode;
        var phone = this.request.body.phone;
        var hash = bCrypt.hashSync(this.request.body.password);

        var result = yield dayu.verify(phone, code);
        if (result) {
            // 注册用户
            yield auth.register(phone, hash);

            ret = {
                err: '注册成功'
            };
            this.body = JSON.stringify(ret);
            this.status = 200;

        } else {
            ret = {
                err: '验证码错误'
            };
            this.body = JSON.stringify(ret);
            this.status = 400;
        }
    });

    router.post(api.apiPath + api.userResetPasswdPOST.path, function*() {

        this.checkBody('phone').notEmpty();
        this.checkBody('verifCode').notEmpty();
        this.checkBody('verifCode').optional().len(6);

        if (this.errors) {
            ret = {
                err: '手机号或验证码错误',
            };
            this.body = JSON.stringify(ret);
            this.status = 400;
            return;
        }

        var ret;
        var phone = this.request.body.phone;
        var verifCode = this.request.body.verifCode;

        var result = yield dayu.verify(phone, verifCode);
        if (result) {
            var user = yield usersTbl.findOne({
                where: {
                    'phone': [phone]
                }
            });

            if (user !== null) {
                user.setDataValue('password', bCrypt.hashSync(this.request.body.password));
                user.save();
                this.body = {};
                this.status = 200;
            } else {
                ret = {
                    err: '该手机号未注册',
                };
                this.body = JSON.stringify(ret);
                this.status = 400;
            }
        } else {
            ret = {
                err: '验证码错误',
            };
            this.body = JSON.stringify(ret);
            this.status = 400;
        }
    });
};
