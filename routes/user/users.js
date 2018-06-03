var api = require('../../common/api.js');
var db = require('../../models/index.js');
var log = require('../../instances/log');
var paging = require('../../common/paging.js');
var extend = require('../../common/extend.js');
var currentUserId = require('../../common/currentUserId.js');
var getUserById = require('../../common/getUserById.js');
var getUserRoleById = require('../../common/getUserRole').byId;
var bCrypt = require('bcrypt-nodejs');
var _ = require('lodash');
var defines = require('../../common/Defines.js');

module.exports = (router) => {

    var usersTbl = db.models.b_user;
    var rolesTbl = db.models.b_role;
    var thirdpartyTbl = db.models.b_third_party_certifier;

    router.get('/api/v0001/users', function*() {

        var pagination = paging.apply(this);

        var queryCond = {
            include: [{
                model: rolesTbl,
                attributes: ['name'],
                through: {
                    attributes: []
                },
            }],
            where: {
                'status': {
                    '$gte': 0
                }
            },
            attributes: {
                exclude: ['headimage', 'tdate']
            }
        };

        extend(queryCond, pagination);

        var users = yield usersTbl.findAndCountAll(queryCond);

        this.body = users;
    });

    router.get(api.apiPath + api.userInfoGET.path + ':userDbid', function*() {

        var userDbid = parseInt(this.params.userDbid, 10);


        if (isNaN(userDbid)) {
            this.status = 400;
            this.body = [{
                error: 'invalid user database id'
            }];
            return;
        }

        var userId = yield currentUserId.apply(this);


        if (userDbid === 0) {
            // current user
            userDbid = userId;
        } else {
            // check authority
            var _auth = yield getUserRoleById(userId);
            if (_.includes(_auth, 'sysadmin') !== true) {
                if (userDbid !== userId) {
                    log.error('invalid user id');
                    this.status = 400;
                    this.body = [{
                        error: 'invalid user id'
                    }];
                    return;
                }
            }
        }

        log.debug('get user database id', userDbid);

        var user = yield usersTbl.findOne({
            include: [{
                model: rolesTbl,
                attributes: ['name'],
                through: {
                    attributes: []
                },
            }],
            attributes: {
                exclude: ['password', 'tdate', 'id_number']
            },
            where: {
                id: [userDbid],
                status: {
                    '$gte': 0
                }
            }
        });

        var tlogin = yield thirdpartyTbl.findOne({
            where: {
                type: defines.thirdpartycertifier.type.weixin.val,
                b_user_id: userDbid
            }
        });


        if (tlogin) {
            var k = JSON.parse(tlogin.explain);
            if (k) {
                user.dataValues.wxgzh_openid = k.gzh_openid || '';
            }
        }

        this.body = user;
        this.status = 200;
        return;
    });

    router.post('/api/v0001/users', function*() {

        this.checkBody('phone').notEmpty();
        this.checkBody('password').notEmpty();
        if (this.errors) {
            this.status = 400;
            this.body = [{
                error: 'both phone and password are required'
            }];
            return;
        }

        var phone = this.request.body.phone;
        var searchCond = {
            where: {
                'status': {
                    '$gte': 0
                },
                'phone': [phone]
            }
        };

        if (this.request.body.hasOwnProperty('name')) {
            var name = this.request.body.name;
            searchCond = {
                where: {
                    'status': {
                        '$gte': 0
                    },
                    $or: [{
                        'name': [name]
                    }, {
                        'phone': [phone]
                    }]
                }
            };
        }

        var user = yield usersTbl.findAll(searchCond);
        if (user.length) {
            this.status = 400;
            this.body = [{
                error: 'phone or name been used'
            }];
            return;
        }

        var hash = bCrypt.hashSync(this.request.body.password);
        this.request.body.password = hash;

        var newUser = yield usersTbl.create(this.request.body);

        var roleNames = [];
        if (this.request.body.hasOwnProperty('b_roles')) {
            for (var i = 0; i < this.request.body.b_roles.length; i++) {
                if (!this.request.body.b_roles[i].hasOwnProperty('name')) {
                    continue;
                }
                roleNames.push(this.request.body.b_roles[i].name);
            }
        }

        if (roleNames.length) {
            var roles = yield rolesTbl.findAll({
                where: {
                    name: [roleNames]
                }
            });

            yield newUser.setB_roles(roles);
        }

        if (!newUser.get('status')) {
            newUser.set('status', 0);
        }

        yield newUser.save();
        this.status = 200;
        this.body = newUser.getDataValue('id');
    });

    // '/api/v0001/users/:userDbid'
    router.post(api.apiPath + api.userInfoPOST.path + ':userDbid', function*() {

        var user = yield * getUserById.apply(this);

        var queryCond = {
            where: {
                'status': {
                    '$gte': 0
                },
                'id': {
                    $ne: user.getDataValue('id')
                }
            }
        };

        if (this.request.body.hasOwnProperty('phone')) {
            var phone = this.request.body.phone;
            queryCond.where.$or = [{
                'phone': [phone]
            }];
        }

        if (this.request.body.hasOwnProperty('name')) {
            var name = this.request.body.name;
            if (queryCond.where.hasOwnProperty('$or')) {
                queryCond.where.$or.push({
                    'name': [name]
                });
            } else {
                queryCond.where.$or = [{
                    'name': [name]
                }];
            }
        }

        log.debug(queryCond);
        if (queryCond.where.hasOwnProperty('$or')) {
            var otherUser = yield usersTbl.findOne(queryCond);
            if (otherUser) {
                this.status = 400;
                this.body = [{
                    error: 'name or phone used by other user'
                }];
                return;
            }
        }

        if (this.request.body.hasOwnProperty('password')) {
            var hash = bCrypt.hashSync(this.request.body.password);
            this.request.body.password = hash;
        }

        var updates = this.request.body;
        for (var i in updates) {
            if (i === 'b_roles') {
                var roleNames = [];

                var updateRoles = updates[i];
                for (var j in updateRoles) {
                    if (updateRoles[j].hasOwnProperty('name')) {
                        roleNames.push(updateRoles[j].name);
                    }
                }
                log.debug(roleNames);

                var roles = yield rolesTbl.findAll({
                    where: {
                        name: [roleNames]
                    }
                });

                yield user.setB_roles(roles);
                continue;
            }

            if (user.dataValues.hasOwnProperty(i)) {
                log.debug('update user', i, updates[i]);
                user.setDataValue(i, updates[i]);
            }
        }

        yield user.save();
        this.status = 200;
        this.body = user.id;
    });

    // '/api/v0001/users/:userDbid'
    router.del(api.apiPath + api.userInfoDEL.path + ':userDbid', function*() {

        var user = yield * getUserById.apply(this);

        yield user.update({
            status: -1
        });
        this.status = 200;
    });
};
