var db = require('../../models/index.js');
var dayu = require('../../common/alidayu.js');
var auth = require('../../common/auth.js');
var bCrypt = require('bcrypt-nodejs');
var getUserById = require('../../common/getUserById.js');
var api = require('../../common/api.js');

module.exports = (router) => {

    var usersTbl = db.models.b_user;
    var usersRoleTbl = db.models.b_user_role;

    router.post('/api/v0001/updateUserVerification', function*() {
        this.checkBody('phone').notEmpty();
        // this.checkBody('phone').match(/^1[3-8]+\d{9}$/);
        this.checkBody('code').notEmpty();
        this.checkBody('code').optional().len(6);
        if (this.errors) {
            this.body = this.errors;
            this.status = 400;
            return;
        }
        var phone = this.request.body.phone;
        var code = this.request.body.code;

        var result = yield dayu.verify(phone, code);
        if (result) {
            yield usersTbl.update({
                phone: phone
            }, {
                where: {
                    id: (yield auth.user(this)).id
                }
            });
            this.status = 200;
        } else {
            this.body = [{
                errCode: 'updateUserVerification_0',
                'err': '更换手机号码失败'
            }];
            this.status = 400;
        }
    });

    router.post(api.apiPath + api.changeUserNamePOST.path, function*() {
        var name = this.request.body.name;
        var changed = 0;
        yield usersTbl.update({
            name: name
        }, {
            where: {
                id: (yield auth.user(this)).id
            }
        }).then(function(data) {
            changed = data[0];
        });

        if (changed === 1) {
            this.current.user.name = name;
            yield auth.userset(this);
            this.body = {};
            this.status = 200;
        } else {
            this.body = [{
                errCode: 'changeUserNamePOST_0',
                'err': '更换姓名失败'
            }];
            this.status = 400;
        }
    });

    router.post(api.apiPath + api.changeUserPasswdPOST.path, function*() {
        this.params.userDbid = 0;
        var user = yield * getUserById.apply(this);

        bCrypt.compare(this.request.body.oldpasswd, user.getDataValue('password'), (err, res) => {
            if (res) {
                user.setDataValue('password', bCrypt.hashSync(this.request.body.newpasswd));
                user.save();
                this.body = {};
                this.status = 200;
            } else {
                this.body = [{
                    errCode: 'changeUserPasswdPOST_0',
                    'err': '更换密码失败'
                }];
                this.status = 400;
            }
        });
    });

    router.post('/api/v0001/updateUserEmail', function*() {
        var email = this.request.body.email;
        var changed = 0;
        yield usersTbl.update({
            email: email
        }, {
            where: {
                id: (yield auth.user(this)).id
            }
        }).then(function(data) {
            changed = data[0];
        });

        if (changed === 1) {
            this.current.user.email = email;
            yield auth.userset(this);
            this.status = 200;
        } else {
            this.body = [{
                errCode: 'updateUserEmail_0',
                'err': '更换电邮地址失败'
            }];
            this.status = 400;
        }
    });
};
