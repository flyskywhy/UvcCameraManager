var db = require('../../models/index.js');
var log = require('../../instances/log.js');
var pluck = require('arr-pluck');
var getUserById = require('../../common/getUserById.js');
var paging = require('../../common/paging.js');
var _ = require('lodash');
var api = require('../../common/api.js');
var scnMisc = require('../../common/scnMisc.js');
var moduleStatus = require('../../common/Defines.js').moduleStatus;

module.exports = (router) => {
    var VirtualScreenGroup = db.models.b_virtual_screen_group;
    var ScreenGroups = db.models.b_screen_group;

    /* 获取租用的所有逻辑屏*/
    router.get(api.apiPath + api.userScreenListGET.path, function*() {
        log.debug('>> get all rented screens');

        this.checkQuery('perpage').notEmpty().isInt().toInt();
        this.checkQuery('page').notEmpty().isInt().toInt();
        if (this.errors) {
            this.errors[0].errCode = 'userScreenListGET_0';
            this.body = this.errors;
            this.status = 400;
            return;
        }

        var pagination = paging.apply(this);
        var user = yield getUserById.apply(this);

        var notInGroup = 0;
        var scnsInGroups = [];
        try {
            if (this.query.notInGroup) {
                notInGroup = parseInt(this.query.notInGroup, 10);
                if (isNaN(notInGroup)) {
                    throw new Error('userScreenListGET_1');
                }
            }

            if (notInGroup === 1) {
                //用于屏分组，同一个屏只能存在一个组中
                scnsInGroups = yield VirtualScreenGroup.findAll({
                    include: [{
                        model: ScreenGroups,
                        where: {
                            status: moduleStatus.screenGroup.valid.val,
                            b_user_id: user.id
                        }
                    }]
                }).then(function (data) {
                    return pluck(data, 'b_virtual_screen_id');
                });
            }
            scnsInGroups = _.uniq(scnsInGroups);
            log.debug(' scns in groups:' + scnsInGroups, ' len=' + scnsInGroups.length);

        } catch (err) {
            log.warn(' parse query info err:' + err);
            this.body = [{
                errCode: api.apiErrParse(err.message, 'userScreenListGET'),
                error: 'failed to parse query info.'
            }];
            this.status = 400;
            return;
        }

        var cond = {
            scnCond: {
                id: {
                    $notIn: scnsInGroups
                }
            },
            pagination: pagination
        };
        var ret = yield scnMisc.queryScreens(user,
            scnMisc.scn_query.rentedScns, cond);

        this.status = 200;
        this.body = ret;
        return;
    });

    //正在发布的逻辑屏
    router.get(api.apiPath + api.publishedScreensGET.path, function*() {
        log.debug(' >>>> get all publication screens');
        this.checkQuery('perpage').notEmpty().isInt().toInt();
        this.checkQuery('page').notEmpty().isInt().toInt();
        if (this.errors) {
            this.errors[0].errCode = 'publishedScreensGET_0';
            this.body = this.errors;
            this.status = 400;
            return;
        }
        var pagination = paging.apply(this);

        var user = yield getUserById.apply(this);

        var cond = {
            pagination: pagination
        };

        var ret = yield scnMisc.queryScreens(user,
            scnMisc.scn_query.publishedScns, cond);

        this.status = 200;
        this.body = ret;
    });


    //未进行发布的逻辑屏
    router.get(api.apiPath + api.unpublishedScreensGET.path, function*() {
        log.debug(' >>>> get all unpublished screens');
        this.checkQuery('perpage').notEmpty().isInt().toInt();
        this.checkQuery('page').notEmpty().isInt().toInt();
        if (this.errors) {
            this.errors[0].errCode = 'unpublishedScreensGET_0';
            this.body = this.errors;
            this.status = 400;
            return;
        }
        var pagination = paging.apply(this);

        var user = yield getUserById.apply(this);

        var cond = {
            pagination: pagination
        };

        var ret = yield scnMisc.queryScreens(user,
            scnMisc.scn_query.unpublishedScns, cond);

        this.status = 200;
        this.body = ret;

    });

    // owners/:userDbid/screens屏所有者的所有屏
    router.get(api.apiPath + api.ownScreensGET.path, function* () {
        this.checkQuery('perpage').notEmpty().isInt().toInt();
        this.checkQuery('page').notEmpty().isInt().toInt();
        log.debug(' >>> owner all screens');

        if (this.errors) {
            this.errors[0].errCode = 'ownScreensGET_0';
            this.body = this.errors;
            this.status = 400;
            return;
        }

        var pagination = paging.apply(this);
        var user = yield getUserById.apply(this);

        var cond = {
            pagination: pagination,
            cliCond: {
                b_user_id: user.id
            }
        };

        var ret = yield scnMisc.queryScreens(user,
            scnMisc.scn_query.scnsOwned, cond);

        this.status = 200;
        this.body = ret;

    });
};
