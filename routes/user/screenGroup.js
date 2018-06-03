var db = require('../../models/index.js');
var log = require('../../instances/log');
var pluck = require('arr-pluck');
var _ = require('lodash');
var api = require('../../common/api.js');
var paging = require('../../common/paging.js');
var getUserById = require('../../common/getUserById.js');
var extend = require('../../common/extend.js');
var scnMisc = require('../../common/scnMisc');
var moduleStatus = require('../../common/Defines.js').moduleStatus;

module.exports = (router) => {
    var ScreenGroups = db.models.b_screen_group;
    var VirtualScreenGroup = db.models.b_virtual_screen_group;
    var ScreenUserRent = db.models.b_virtual_screen_user_rent;
    var ScreenUserRentMode01 = db.models.b_virtual_screen_user_rent_mode_01;
    var ScreenUserRentMode02 = db.models.b_virtual_screen_user_rent_mode_02;

    function isGroupNameInvalid(name) {
        if (!name || name.length === 0 ||
            name.replace(/(^\s*)|(\s*$)/g, "").length === 0) {
            log.warn(' Invalid group name. ignore!');
            return true;
        }
        return false;
    }

    //添加分组:创建新的组名
    router.post(api.apiPath + api.createDispGroupPOST.path, function*() {

        var group = this.request.body;
        if (isGroupNameInvalid(group.name) === true) {
            this.body = [{
                errCode: 'createDispGroupPOST_0',
                'name': 'Invalid name'
            }];
            this.status = 400;
            return;
        }

        var user = yield getUserById.apply(this);

        //判断有否重名
        var finds = null;
        finds = yield ScreenGroups.findAll({
            where: {
                name: group.name,
                b_user_id: user.id,
                status: moduleStatus.screenGroup.valid.val
            }
        });
        if (finds && finds.length > 0) {
            log.warn(' Had exist the same group name.');
            this.body = [{
                errCode: 'createDispGroupPOST_1',
                errors: 'Duplicate group name'
            }];
            this.status = 400;
            return;
        }

        // log.debug(" >> userid = " + userid);
        var newgroup = yield ScreenGroups.create({
            name: group.name,
            b_user_id: user.id,
            status: moduleStatus.screenGroup.valid.val
        });

        log.debug(" newgroup  = " + JSON.stringify(newgroup));
        this.status = 200;
        this.body = {
            id: newgroup.id,
            name: newgroup.name
        };
    });

    // 修改组名
    router.put(api.apiPath + api.modifyDispGroupNamePUT.path, function*() {

        var user = yield getUserById.apply(this);

        var groupid = parseInt(this.params.groupDbid);

        var isValid = yield isValidGroup(user.id, groupid);
        if (isValid === false) {
            this.status = 400;
            this.body = [{
                errCode: 'modifyDispGroupNamePUT_0',
                groupDbid: 'Invalid group id'
            }];
            return;
        }

        var group = this.request.body;
        if (isGroupNameInvalid(group.name) === true) {
            this.body = [{
                errCode: 'modifyDispGroupNamePUT_1',
                name: 'Invalid name'
            }];
            this.status = 400;
            return;
        }


        //判断有否重名
        //组名跟用户id设置联合唯一索引,删除的话就只能是从表格里彻底删除 TODO
        var finds = null;
        finds = yield ScreenGroups.findAll({
            where: {
                id: {
                    $ne: groupid
                },
                name: group.name,
                b_user_id: user.id,
                status: moduleStatus.screenGroup.valid.val
            }
        });
        if (finds && finds.length > 0) {
            log.warn(' Had exist the same group name.');
            this.body = [{
                errCode: 'modifyDispGroupNamePUT_2',
                errors: 'Group name existed'
            }];
            this.status = 400;
            return;
        }

        var update = yield ScreenGroups.update({
            name: group.name
        }, {
            where: {
                id: groupid,
                b_user_id: user.id,
                status: moduleStatus.screenGroup.valid.val
            }
        });

        this.status = 200;
        this.body = {
            update,
            groupid
        };
    });


    //删除屏分组
    router.delete(api.apiPath + api.rmDispGroupsDELETE.path, function*() {

        var groupid = parseInt(this.params.groupDbid);

        var user = yield getUserById.apply(this);

        //remove b_virtual_screen_group
        yield VirtualScreenGroup.destroy({
            where: {
                b_screen_group_id: groupid
            }
        });

        //remove group @ b_screen_group, just update status.
        var ret = yield ScreenGroups.update({
            status: moduleStatus.screenGroup.deleted.val
        }, {
            where: {
                id: groupid,
                b_user_id: user.id
            }
        });

        this.status = 200;
        this.body = {
            groupid,
            ret
        };
    });

    function* isValidGroup(userDbid, groupDbid) {

        /*检查group的是否有效 */
        var group = null;
        group = yield ScreenGroups.findOne({
            where: {
                id: groupDbid,
                b_user_id: userDbid,
                status: moduleStatus.screenGroup.valid.val
            }
        });

        // log.debug('>> valid group:' + JSON.stringify(group))
        if (!group) {
            log.debug(' invalid group id');
            return false;
        }
        return true;
    }

    /*添加逻辑显示屏到分组*/
    router.put(api.apiPath + api.addScreensToGroupsPUT.path, function*() {

        var groupid = parseInt(this.params.groupDbid);

        var user = yield getUserById.apply(this);

        var screens = this.request.body.screens;
        log.debug(' screens : ' + screens);

        //移除组中已经存在的待添加屏
        var existed = yield VirtualScreenGroup.findAll({
            where: {
                b_screen_group_id: groupid,
                b_virtual_screen_id: {
                    $in: screens
                },
            },
            include: {
                model: ScreenGroups,
                where: {
                    b_user_id: user.id
                }
            }
        }).then(function(data) {
            return pluck(data, 'b_virtual_screen_id');
        });

        screens = _.difference(screens, existed);
        if (screens.length === 0) {
            log.debug(' >>> screens has exiested in group');
            this.body = {
                addition: screens
            };
            this.status = 200;
            return;
        }

        var rentgroups = [];
        for (var scn of screens) {
            var rentgroup = {
                b_screen_group_id: groupid,
                b_virtual_screen_id: scn
            };
            rentgroups.push(rentgroup);
        }

        log.debug(' rentgroup :' + JSON.stringify(rentgroups));

        var ret = yield VirtualScreenGroup.bulkCreate(rentgroups);
        this.body = {
            addition: screens
        };
        this.status = 200;
    });

    /*从组中移除逻辑显示屏*/
    router.put(api.apiPath + api.rmScreensFromGroupsPUT.path, function*() {

        var groupid = parseInt(this.params.groupDbid);

        var user = yield getUserById.apply(this);

        var isValid = yield isValidGroup(user.id, groupid);
        if (isValid === false) {
            this.status = 400;
            this.body = [{
                errCode: 'rmScreensFromGroupsPUT_0',
                groupDbid: 'Invalid group id'
            }];
            return;
        }
        //zaib_virtual_screen_group找到所有的屏的id的集合
        var screen_data = yield VirtualScreenGroup.findAll({
            where: {
                b_screen_group_id: groupid
            }
        });
        var screen_ids = [];

        screen_data.forEach(function(note) {
            screen_ids.push(note.b_virtual_screen_id);
        });
        //求屏ids结束 需要求screen_ids和screens的交集

        var screens = this.request.body.screens;
        var ret = yield VirtualScreenGroup.destroy({
            where: {
                b_screen_group_id: groupid,
                b_virtual_screen_id: {
                    $in: screens
                }
            }
        });
        //求传入的要删除的屏idscsacsda和表中现有的同一屏组的屏ids的交集,就是被删除的ids
        var deleted_screen_ids = _.intersection(screen_ids, screens);
        this.body = {
            deletion: ret,
            deleted_screen_ids: deleted_screen_ids
        };
        this.status = 200;
    });

    /*获取分组信息:分组名字及组下逻辑屏数目*/
    router.get(api.apiPath + api.dispGroupsGET.path, function*() {
        var user = yield getUserById.apply(this);
        var pagination = {};
        if (this.query.perpage) {
            pagination = paging.apply(this);
        }

        var queryCond = {
            where: {
                b_user_id: user.id,
                status: moduleStatus.screenGroup.valid.val
            },
            attributes: ['id', ['id', 'count'], 'b_user_id', 'name'],
            order: [['id', 'DESC']]
        };

        extend(queryCond, pagination);
        var groups;
        var count;
        if (pagination.offset === 0) {
            var agroups = yield ScreenGroups.findAndCountAll(queryCond);
            groups = agroups.rows;
            count = agroups.count;
        } else {
            groups = yield ScreenGroups.findAll(queryCond);
            count = 0;
        }

        var curtime = new Date();
        for (var group of groups) {
            group.dataValues.count = yield scnMisc.screenNumInGroup(group.id, user.id);
        }

        log.debug('groups :' + JSON.stringify(groups), ',count', count);
        this.status = 200;
        this.body = {
            count: count,
            groups: groups
        };
    });


    /*获取组的具体逻辑屏信息*/
    router.get(api.apiPath + api.dispGroupsScreensGET.path, function*() {

        log.debug('>>> Get groups associated screens ');
        var groupid = parseInt(this.params.groupDbid);

        var user = yield getUserById.apply(this);
        var isValid = yield isValidGroup(user.id, groupid);
        if (isValid === false) {
            this.status = 400;
            this.body = [{
                errCode: 'dispGroupsScreensGET_0',
                groupDbid: 'Invalid group id'
            }];
            return;
        }

        var screens = yield VirtualScreenGroup.findAll({
            where: {
                b_screen_group_id: groupid,
            },
        }).then(function(data) {
            return pluck(data, 'b_virtual_screen_id');
        });

        if (screens.length === 0) {
            log.debug('Group not associated screens');
            this.status = 200;
            this.body = {
                count: 0,
                screens: []
            };
            return;
        }

        var cond = {
            slotsCond: {
                b_virtual_screen_id: {
                    $in: screens
                }
            }
        };
        var pagination = null;
        if (this.query.perpage) {

            pagination = paging.apply(this);
            cond.pagination = pagination;
        }

        var ret = yield scnMisc.queryScreens(user,
            scnMisc.scn_query.scnsInGroups, cond);

        this.status = 200;

        this.body = {
            count: ret.count,
            screens: ret.screens
        };

    });

    /*获取组的逻辑屏下的显示槽信息*/
    router.get(api.apiPath + api.dispGroupsScreensDetailsGET.path, function*() {
        log.debug('### screen dispslot');
        var groupid = parseInt(this.params.groupDbid);
        var screenid = parseInt(this.params.screenDbid);

        var user = yield getUserById.apply(this);

        var scn = yield VirtualScreenGroup.findOne({
            where: {
                b_virtual_screen_id: screenid,
                b_screen_group_id: groupid
            },
            include: {
                model: ScreenGroups,
                where: {
                    b_user_id: user.id,
                    status: moduleStatus.screenGroup.valid.val
                }
            }
        });

        if (!scn) {
            log.debug('invalid screen or group id');
            this.body = [{
                errCode: 'dispGroupsScreensDetailsGET_0',
                error: 'Invalid screen or  group id'
            }];
            return;
        }

        var dispSlots = yield ScreenUserRent.findAll({
            where: {
                status: moduleStatus.screenUserRent.valid.val,
                end_datetime: {
                    $gt: new Date()
                },
                b_user_id: user.id,
                b_virtual_screen_id: screenid
            },
            attributes: ['id', 'start_datetime', 'end_datetime', 'type'],
            include: [{
                model: ScreenUserRentMode01,
                attributes: ['punits']
            }, {
                model: ScreenUserRentMode02
            }]
        });

        log.debug(' dispSlots:' + JSON.stringify(dispSlots));
        this.status = 200;
        this.body = dispSlots;
    });

};

