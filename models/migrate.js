#!/usr/bin/env node

var co = require('co');
var util = require('util');
var db = require('./index.js');
var pluck = require('arr-pluck');
var program = require('commander');
var sequelize = require('sequelize');
var shell = require('child_process');
var bCrypt = require('bcrypt-nodejs');
var api = require('../common/api.js');
var cfg = require('../instances/config.js');
var defines = require('../common/Defines.js');
var _ = require('lodash');
var pluck = require('arr-pluck');
var queryInterface = db.getQueryInterface();
var ROLE_USER_ID = defines.User.Type.user;
var ROLE_OWNER_ID = defines.User.Type.owner;
var ROLE_OPERATOR_ID = defines.User.Type.operator;
var SUPER_ADMINER_ROLE_ID = defines.User.Type.sysadmin;
// var SUPER_ADMINER_USER_ID = defines.User.UserId.admin;

var USER_USER_ID = defines.User.UserId.user;
var USER_USER01_ID = defines.User.UserId.user01;
var USER_ADMIN_ID = defines.User.UserId.userAdmin;

var MODULE_ACCOUNT_LIST_2_ID = 102;
var MODULE_ACCOUNT_LIST_3_ID = 103;
var MODULE_ACCOUNT_LIST_5_ID = 106;

var MODULE_DEVICE_LIST_1_ID = 201;
var MODULE_DEVICE_LIST_2_ID = 202;
var MODULE_DEVICE_LIST_4_ID = 204;
var MODULE_DEVICE_LIST_5_ID = 205;
var MODULE_DEVICE_LIST_7_ID = 207;

var MODULE_MANAGED_DEVICE_LIST_13_ID = 313;
var MODULE_MANAGED_DEVICE_LIST_14_ID = 314;
var MODULE_MANAGED_DEVICE_LIST_15_ID = 315;
var MODULE_MANAGED_DEVICE_LIST_16_ID = 316;
var MODULE_MANAGED_DEVICE_LIST_17_ID = 317;
var MODULE_MANAGED_DEVICE_LIST_18_ID = 318;

var MODULE_MANAGED_DEVICE_LIST_25_ID = 325;

var MODULE_USER_1_ID = 401;
var MODULE_USER_2_ID = 402;
var MODULE_USER_3_ID = 403;
var MODULE_USER_4_ID = 404;
var MODULE_USER_5_ID = 405;
var MODULE_USER_11_ID = 411;

var MODULE_USER_14_ID = 414;

var MODULE_USER_18_ID = 418;
var MODULE_USER_20_ID = 420;
var MODULE_USER_21_ID = 421;
var MODULE_USER_22_ID = 422;
var MODULE_USER_25_ID = 425;

var MODULE_USER_27_ID = 427;

var MODULE_PUBLIC_1_ID = 501;
var MODULE_PUBLIC_2_ID = 502;
var MODULE_PUBLIC_3_ID = 503;
var MODULE_PUBLIC_4_ID = 504;
var MODULE_PUBLIC_5_ID = 505;
var MODULE_PUBLIC_6_ID = 517;


var MODULE_SYSTEM_PROGRAM_ID = 512;

var MODULE_DISP_GROUP_SCREENS_2_ID = 602;
var MODULE_DISP_GROUP_SCREENS_3_ID = 603;
var MODULE_DISP_GROUP_SCREENS_4_ID = 604;
var MODULE_DISP_GROUP_SCREENS_5_ID = 605;
var MODULE_DISP_GROUP_SCREENS_6_ID = 606;

var MODULE_DISP_GROUP_SCREENS_8_ID = 608;

var MODULE_DISP_GROUP_SCREENS_13_ID = 613;

var MODULE_ADMIN_FORMAT_PROGS = 999;
// function* addSuperAdminer() {
//     yield db.models.b_user.upsert({
//         id: SUPER_ADMINER_USER_ID,
//         name: '超级管理员',
//         password: bCrypt.hashSync('H7BdY8qs8877'),
//         status: 0,
//         phone: '12345678901',
//         type: 0
//     });
// }

function* b_user_seed(t) {
    var users = [{
        id: USER_ADMIN_ID,
        name: 'admin',
        password: bCrypt.hashSync('T7GcH8kn7788'),
        status: 0,
        phone: '15990007788',
        email: 'flyskywhy@gmail.com',
        addr: '飞天何路7号',
        tdate: '2017-05-12 16:33:29',
        type: 1,
    }, {
        id: USER_USER_ID,
        name: 'user0',
        password: bCrypt.hashSync('D7A8id787788'),
        status: 0,
        phone: '13912345678',
        headimage: USER_USER_ID + '/headimage/icon.jpg',
        tdate: '2016-06-12 16:33:29',
        type: 1,
    }, {
        id: USER_USER01_ID,
        name: 'user1',
        password: bCrypt.hashSync('S7pa56087788'),
        status: 0,
        phone: '13912345679',
        tdate: '2016-06-12 16:33:29',
        type: 1,
    }];

    for (var i = 0; i < users.length; i++) {
        yield db.models.b_user.findCreateFind({
            where: users[i],
            transaction: t
        });
    }
}

function* b_role_seed(t) {
    var roles = [{
        id: ROLE_OWNER_ID,
        name: 'owner',
        explain: '屏所有者'
    }, {
        id: ROLE_OPERATOR_ID,
        name: 'operator',
        explain: '设备运营商'

    }, {
        id: ROLE_USER_ID,
        name: 'user',
        explain: '普通用户'
    }, {
        id: SUPER_ADMINER_ROLE_ID,
        name: 'sysadmin',
        explain: '系统管理员'
    }];

    for (var i = 0; i < roles.length; i++) {
        yield db.models.b_role.upsert(roles[i], {
            transaction: t
        });
    }
}

function* b_user_role_seed(t) {
    // yield db.models.b_user_role.findCreateFind({
    //     where: {
    //         b_user_id: SUPER_ADMINER_USER_ID,
    //         b_role_id: SUPER_ADMINER_ROLE_ID
    //     }
    // });
    var user_roles = [{
        id: 1,
        b_user_id: USER_ADMIN_ID,
        b_role_id: SUPER_ADMINER_ROLE_ID
    }, {
        id: 2,
        b_user_id: USER_USER_ID,
        b_role_id: ROLE_OWNER_ID
    }, {
        id: 3,
        b_user_id: USER_USER01_ID,
        b_role_id: ROLE_OWNER_ID
    }];

    for (var i = 0; i < user_roles.length; i++) {
        yield db.models.b_user_role.upsert(user_roles[i], {
            transaction: t
        });
    }
}

var modulesList = [{
    id: MODULE_ACCOUNT_LIST_5_ID,
    name: '账户管理5',
    program_addr: api.apiPath + api.accountGET.path,
    method: 'get',
    roles: [SUPER_ADMINER_ROLE_ID]
}, {
    id: MODULE_ACCOUNT_LIST_2_ID,
    name: '账户管理2',
    program_addr: '/api/v0001/users',
    method: 'post,get',
    roles: [SUPER_ADMINER_ROLE_ID]
}, {
    id: MODULE_ACCOUNT_LIST_3_ID,
    name: '账户管理3',
    program_addr: '/api/v0001/users/[0-9]*',
    method: 'post,delete,get',
    roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID]
}, {
    id: MODULE_DEVICE_LIST_1_ID,
    name: '出厂设备1',
    program_addr: '/api/v0001/devices',
    method: 'get,post',
    roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID]
}, {
    id: MODULE_DEVICE_LIST_2_ID,
    name: '出厂设备2',
    program_addr: '/api/v0001/devices/sn/.*',
    method: 'put',
    roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID]
}, {
    id: MODULE_DEVICE_LIST_4_ID,
    name: '系统管理员终止节目发布',
    program_addr: '/api/v0001/admin/programs/[0-9]*/publication/deletion',
    method: 'post',
    roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID]
}, {
    id: MODULE_DEVICE_LIST_5_ID,
    name: '出厂设备5',
    program_addr: '/api/v0001/distributionBenefit',
    method: 'get',
    roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID]
}, {
    id: MODULE_DEVICE_LIST_7_ID,
    name: '出厂设备7',
    program_addr: '/api/v0001/devices/[0-9]*/topInterest',
    method: 'get',
    roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID]
}, {
    id: MODULE_MANAGED_DEVICE_LIST_13_ID,
    name: '上线设备13',
    program_addr: '/api/v0001/params/roleList',
    method: 'get',
    roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID]
}, {
    id: MODULE_MANAGED_DEVICE_LIST_14_ID,
    name: '上线设备14',
    program_addr: '/api/v0001/devices/[0-9]*/users',
    method: 'get',
    roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID]
}, {
    id: MODULE_MANAGED_DEVICE_LIST_15_ID,
    name: '上线设备15',
    program_addr: '/api/v0001/devices/[0-9]*/users/phone/.*',
    method: 'put',
    roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID]
}, {
    id: MODULE_MANAGED_DEVICE_LIST_16_ID,
    name: '上线设备16',
    program_addr: '/api/v0001/devices/[0-9]*',
    method: 'delete',
    roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID]
}, {
    id: MODULE_MANAGED_DEVICE_LIST_17_ID,
    name: '上线设备17',
    program_addr: '/api/v0001/params/rentMode',
    method: 'get',
    roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID]
}, {
    id: MODULE_MANAGED_DEVICE_LIST_18_ID,
    name: '上线设备18',
    program_addr: '/api/v0001/devices/[0-9]*/displays',
    method: 'get',
    roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID]
}, {
    id: MODULE_MANAGED_DEVICE_LIST_25_ID,
    name: '修改设备的所有者获取短信验证码',
    program_addr: api.apiPath + api.userChangeDevOwnerVerificationPUT.path + '.*',
    method: 'put',
    roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID]
}, {
    id: MODULE_USER_1_ID,
    name: '显示发布1',
    program_addr: '/api/v0001/dispSlots/free/[0-9]*',
    method: 'get',
    roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID]
}, {
    id: MODULE_USER_2_ID,
    name: '显示发布2',
    program_addr: '/api/v0001/users/[0-9]*/dispSlots/[0-9]*',
    method: 'get,post',
    roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID]
}, {
    id: MODULE_USER_3_ID,
    name: '显示发布3',
    program_addr: '/user/programs',
    method: 'get',
    roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID]
}, {
    id: MODULE_USER_4_ID,
    name: '显示发布4',
    program_addr: '/api/v0001/users/[0-9]*/programs/[0-9]*',
    method: 'get,post,put',
    roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID]
}, {
    id: MODULE_USER_5_ID,
    name: '显示发布5',
    program_addr: '/api/v0001/users/[0-9]*/programs/[0-9]*/dispSlots',
    method: 'get,put',
    roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID]
}, {
    id: MODULE_USER_11_ID,
    name: '显示发布11',
    program_addr: '/api/v0001/updateUserVerification',
    method: 'post',
    roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID]
}, {
    id: MODULE_USER_14_ID,
    name: '显示发布14',
    program_addr: '/api/v0001/users/[0-9]*/dispSlots/[0-9]*/programs',
    method: 'get,put',
    roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID]
}, {
    id: MODULE_USER_18_ID,
    name: '显示发布18',
    program_addr: '/api/v0001/updateUserEmail',
    method: 'post',
    roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID]
}, {
    id: MODULE_USER_20_ID,
    name: '终止节目分组发布或发布到屏',
    program_addr: '/api/v0001/users/[0-9]*/programs/[0-9]*/publication/deletion',
    method: 'post',
    roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID]
}, {
    id: MODULE_USER_21_ID,
    name: '逻辑屏全部发布节目',
    program_addr: '/api/v0001/users/[0-9]*/screens/[0-9]*/programs',
    method: 'get',
    roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID]
}, {
    id: MODULE_USER_22_ID,
    name: '节目关联的所有屏',
    program_addr: '/api/v0001/users/[0-9]*/programs/[0-9]*/screens',
    method: 'get',
    roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID]
}, {
    id: MODULE_USER_25_ID,
    name: '未进行发布的逻辑屏',
    program_addr: '/api/v0001/users/[0-9]*/unpublication/screens',
    method: 'get',
    roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID]
}, {
    id: MODULE_USER_27_ID,
    name: '节目关联的所有屏组',
    program_addr: '/api/v0001/users/[0-9]*/programs/[0-9]*/dispGroups',
    method: 'get',
    roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID]
}, {
    id: MODULE_PUBLIC_1_ID,
    name: 'public',
    program_addr: '/api/v0001/test/perform',
    method: 'get,put',
    roles: [SUPER_ADMINER_ROLE_ID]
}, {
    id: MODULE_PUBLIC_2_ID,
    name: 'public',
    program_addr: '/api/v0001/acl_role/.*',
    method: 'delete',
    roles: [SUPER_ADMINER_ROLE_ID]
}, {
    id: MODULE_PUBLIC_3_ID,
    name: 'public',
    program_addr: '/api/v0001/acl_role',
    method: 'get',
    roles: [SUPER_ADMINER_ROLE_ID]
}, {
    id: MODULE_PUBLIC_4_ID,
    name: 'public',
    program_addr: '/api/v0001/upload/MD5/.*',
    method: 'get,post,delete',
    roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID]
}, {
    id: MODULE_PUBLIC_5_ID,
    name: 'public',
    program_addr: '/api/v0001/users/[0-9]*/material',
    method: 'get',
    roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID]
}, {
    id: MODULE_PUBLIC_6_ID,
    name: 'public',
    program_addr: '/api/v0001/users/[0-9]*/materialServer',
    method: 'get',
    roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID]
}, {
    id: MODULE_SYSTEM_PROGRAM_ID,
    name: '发布系统节目',
    program_addr: '/api/v0001/system/programs/[0-9]*/dispSlots',
    method: 'put',
    roles: [SUPER_ADMINER_ROLE_ID]
}, {
    id: MODULE_DISP_GROUP_SCREENS_2_ID,
    name: '屏显示资源分组2-添加显示槽到组',
    program_addr: '/api/v0001/users/[0-9]*/dispGroups/[0-9]*/dispSlots/addition',
    method: 'put',
    roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID]
}, {
    id: MODULE_DISP_GROUP_SCREENS_3_ID,
    name: '屏显示资源分组3-从组移出显示槽',
    program_addr: '/api/v0001/users/[0-9]*/dispGroups/[0-9]*/dispSlots/deletion',
    method: 'put',
    roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID]
}, {
    id: MODULE_DISP_GROUP_SCREENS_4_ID,
    name: '屏显示资源分组4-分组名字及组下显示槽数目',
    program_addr: '/api/v0001/users/[0-9]*/dispGroups/dispSlots',
    method: 'get',
    roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID]
}, {
    id: MODULE_DISP_GROUP_SCREENS_5_ID,
    name: '屏显示资源分组5-获取组的屏显示槽信息',
    program_addr: '/api/v0001/users/[0-9]*/dispGroups/[0-9]*/dispSlots',
    method: 'get',
    roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID]
}, {
    id: MODULE_DISP_GROUP_SCREENS_6_ID,
    name: '屏显示资源分组6-删除屏分组',
    program_addr: '/api/v0001/users/[0-9]*/dispGroups/[0-9]*',
    method: 'delete',
    roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID]
}, {
    id: MODULE_DISP_GROUP_SCREENS_8_ID,
    name: '屏显示资源分组8-从组中移除逻辑显示屏',
    program_addr: '/api/v0001/users/[0-9]*/dispGroups/[0-9]*/screens/deletion',
    method: 'put',
    roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID]
}, {
    id: MODULE_DISP_GROUP_SCREENS_13_ID,
    name: '屏显示资源分组12-获取租用的所有逻辑屏',
    program_addr: '/api/v0001/users/[0-9]*/screens',
    method: 'get',
    roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID]
}, {
    id: MODULE_ADMIN_FORMAT_PROGS,
    name: '格式化节目',
    program_addr: '/api/v0001/admin/[0-9]*/programs/formatting',
    method: 'put',
    roles: [SUPER_ADMINER_ROLE_ID]
}];


var getACLUrl = (path) => {
    return path.replace(/:userDbid/, '[0-9]*')
        .replace(/:progDbid/, '[0-9]*')
        .replace(/:screenDbid/, '[0-9]*')
        .replace(/:devDbid/, '[0-9]*')
        .replace(/:vsDbid/, '[0-9]*')
        .replace(/:msgDbid/, '[0-9]*')
        .replace(/:groupDbid/, '[0-9]*')
        .replace(/:devId/, '.*')
        .replace(/:ratioValue/, '.*')
        .replace(/:c_client_list_id/, '[0-9]*');
};

function* cleanModuleListDB(t) {
    yield db.models.b_role_module.destroy({
        where: {},
        transaction: t
    });
    yield db.models.b_module.destroy({
        where: {},
        transaction: t
    });
}

function* b_module_seed(t) {
    var modules = [];
    for (var i = 0; i < modulesList.length; i++) {
        var m = modulesList[i];
        modules.push({
            id: m.id,
            name: m.name,
            program_addr: m.program_addr,
            method: m.method,
        });
    }
    var id = 1000;
    for (var a in api) {
        var m = api[a];
        if (m.roles && m.roles.length) {
            m.id = id++;
            modules.push({
                id: m.id,
                name: m.name,
                program_addr: getACLUrl(api.apiPath + m.path),
                method: m.method,
            });
        }
    }
    for (var i = 0; i < modules.length; i++) {
        yield db.models.b_module.upsert(modules[i], {
            transaction: t
        });
    }

}

function* b_role_module_seed(t) {
    var id = 1;
    var role_modules = [];
    for (var i = 0; i < modulesList.length; i++) {
        var m = modulesList[i];
        for (var ii = 0; ii < m.roles.length; ii++) {
            role_modules.push({
                id: id++,
                b_role_id: m.roles[ii],
                b_module_id: m.id
            });
        }
    }

    for (var a in api) {
        var m = api[a];
        if (m.roles && m.roles.length) {
            for (var ii = 0; ii < m.roles.length; ii++) {
                role_modules.push({
                    id: id++,
                    b_role_id: m.roles[ii],
                    b_module_id: m.id
                });
            }
        }
    }

    for (var i = 0; i < role_modules.length; i++) {
        yield db.models.b_role_module.upsert(role_modules[i], {
            transaction: t
        });
    }

}

function* b_default_program_effect_seed(t) {
    yield db.models.b_default_program_effect.upsert({
        id: 1,
        screen_classify_id: 1,
        direction: 1,
        speed: 1,
        max_words: 160,
        font_size: 16,
        font: '宋体',
        in_effect: 0,
        out_effect: 0,
        stop_times: 0
    }, {
        transaction: t
    });
}

function* b_location_type_seed(t) {
    var id = 1;
    var locations = [{
        id: id++,
        status: 1,
        name: '书店',
        fid: 0
    }, {
        id: id++,
        status: 1,
        name: '酒店',
        fid: 0
    }, {
        id: id++,
        status: 1,
        name: '超市',
        fid: 0
    }, {
        id: id++,
        status: 1,
        name: '其它',
        fid: 0
    }];
    for (var i = 0; i < locations.length; i++) {
        yield db.models.b_location_type.upsert(locations[i], {
            transaction: t
        });
    }
}

function* b_mode_seed(t) {
    var id = 1;
    var modes = [{
        id: id++,
        name: defines.mode[1].name,
        status: 1,
        explain: defines.mode[1].explain
    }, {
        id: id++,
        name: defines.mode[2].name,
        status: 1,
        explain: defines.mode[2].explain
    }, {
        id: id++,
        name: defines.mode[3].name,
        status: 1,
        explain: defines.mode[3].explain
    }];

    for (var i = 0; i < modes.length; i++) {
        yield db.models.b_mode.upsert(modes[i], {
            transaction: t
        });
    }
}

function* b_module_list_seed(t) {
    var id = 1;
    var modules_list = [{
        id: id++,
        width: 32,
        height: 32,
        module_name: 'P10-X-X4S-1M3S00048',
        discount: 10, //TODO 临时作为点间距的属性，待修改
        cable: ''
    }, {
        id: id++,
        width: 32,
        height: 16,
        module_name: 'P10-VB01B',
        discount: 10, //TODO 临时作为点间距的属性，待修改
        cable: ''
    }];

    for (var i = 0; i < modules_list.length; i++) {
        yield db.models.b_module_list.upsert(modules_list[i], {
            transaction: t
        });
    }

}

function* b_status_main_seed(t) {
    for (var seed of defines.status) {
        yield db.models.b_status_main.findCreateFind({
            where: seed.b_status_main,
            transaction: t
        });
    }
}

function* b_status_seed(t) {
    for (var seed of defines.status) {
        for (var status of seed.b_status) {
            yield db.models.b_status.findCreateFind({
                where: {
                    b_status_main_id: seed.b_status_main.id,
                    val: status.val,
                    name: status.name,
                    language_id: status.language_id
                },
                transaction: t
            });
        }
    }
}

function* b_distribution_benefit_seed(t) {
    yield db.models.b_distribution_benefit.upsert({
        id: 1,
        name: '默认分享模式',
        start_date: '2016-01-01 00:00:00',
        end_date: '2116-01-01 00:00:00',
        explain: '所有未规定的设备商，均按此规则'
    }, {
        transaction: t
    });
}

function* b_screen_match_method_seed(t) {
    var match_method_list = defines.screen_match_method_list;
    for (var i = 0; i < match_method_list.length; i++) {
        yield db.models.b_screen_match_method.upsert(match_method_list[i], {
            transaction: t
        });
    }
}

function* c_client_list() {
    var tbl = 'c_client_list';
    var cols = yield queryInterface.describeTable(tbl);

    if (!cols.remove_date) {
        yield queryInterface.addColumn(tbl, 'remove_date', {
            type: sequelize.DATE,
            allowNull: true,
            autoIncrement: false,
            primaryKey: false,
            defaultValue: null
        });
    }

}


function* c_client_list_seed(t) {
    // yield db.models.c_client_list.findCreateFind({
    //     where: {
    //         product_id: 'DEMOPN0001',
    //         status: 1,
    //         tdate: '2016-05-12 15:00:56'
    //     },
    //     transaction: t
    // });
    // yield db.models.c_client_list.findCreateFind({
    //     where: {
    //         product_id: '100100502',
    //         status: 2,
    //         tdate: '2016-04-13 09:24:30'
    //     },
    //     transaction: t
    // });
    // yield db.models.c_client_list.findCreateFind({
    //     where: {
    //         product_id: '100100507',
    //         status: 0,
    //         tdate: '2016-04-20 09:02:43'
    //     },
    //     transaction: t
    // });

    var clients = yield db.models.c_client_list.findAll({
        where: {
            status: 2, //已注销的屏幕
            remove_date: null
        },
        transaction: t
    });

    var remove_date = new Date();
    for (var client of clients) {

        client.remove_date = remove_date;

        yield client.save({
            transaction: t
        });
    }


}

function* b_user_interest() {
    var tbl = 'b_user_interest';
    var cols = yield queryInterface.describeTable(tbl);

    if (!cols.status) {
        yield queryInterface.addColumn(tbl, 'status', {
            type: sequelize.INTEGER(11),
            allowNull: false,
            autoIncrement: false,
            primaryKey: false,
            defaultValue: 1
        });
    }

    if (!cols.rdate) {
        yield queryInterface.addColumn(tbl, 'rdate', {
            type: sequelize.DATE,
            allowNull: true,
            autoIncrement: false,
            primaryKey: false,
            defaultValue: null
        });
    }
}

function* showForeignKey(database, tableName, columnName, t) {
    var query = queryInterface.QueryGenerator.getForeignKeysQuery(
        tableName,
        database
    );
    var tmp = query.substring(0, query.length - 1) + ' AND COLUMN_NAME = "' + columnName + '";';
    var ret = yield db.query(tmp, {
        transaction: t
    });

    var constraint = {};
    if (ret[0].length) {
        constraint = JSON.parse(JSON.stringify(ret[0][0]));
    }
    return constraint;
}

function* removeForeignKey(tableName, columnName, t) {
    var constraint = yield showForeignKey(cfg.db.database, tableName, columnName, t);
    if (constraint.constraint_name) {
        var q = queryInterface.QueryGenerator.dropForeignKeyQuery(
            tableName,
            constraint.constraint_name);
        yield db.query(q, {
            transaction: t
        });
        console.log(tableName, '.', columnName + ': remove ForeignKey', constraint.constraint_name);
    }
}

function* removeIndex(tableName, columnName) {
    var idx = yield queryInterface.showIndex(tableName);
    for (var i = 0; i < idx.length; i++) {
        if (idx[i].name === columnName) {
            yield queryInterface.removeIndex(
                tableName,
                columnName);
            console.log(tableName, '.', columnName + ': remove INDEX');
        }
    }
}

function* b_user() {
    var tbl = 'b_user';
    var cols = yield queryInterface.describeTable(tbl);

    if (!cols.referral_code) {
        yield queryInterface.addColumn(tbl, 'referral_code', {
            type: sequelize.STRING(5),
            allowNull: true,
            defaultValue: null,
            unique: true
        });
    }

}

function* b_virtual_screen() {
    var tbl = 'b_virtual_screen';
    var cols = yield queryInterface.describeTable(tbl);

    if (!cols.rentTimeUnit) {
        yield queryInterface.addColumn(tbl, 'rentTimeUnit', {
            type: sequelize.INTEGER(11),
            allowNull: true,
            defaultValue: 0
        });
    }
}

function* c_client_config() {
    var tbl = 'c_client_config';
    var cols = yield queryInterface.describeTable(tbl);

    if (!cols.offLineMode) {
        yield queryInterface.addColumn(tbl, 'offLineMode', {
            type: sequelize.INTEGER(11),
            allowNull: true,
            defaultValue: 0
        });
    }
}

function* b_rent_setting() {
    var tbl = 'b_rent_setting';
    var cols = yield queryInterface.describeTable(tbl);

    if (!cols.owner_price) {
        yield queryInterface.addColumn(tbl, 'owner_price', {
            type: sequelize.DECIMAL(10, 2),
            allowNull: true,
            defaultValue: null
        });
    }
}

function* c_client_offline() {
    var tbl = 'c_client_offline';
    var cols = yield queryInterface.describeTable(tbl);

    if (!cols.reminder) {
        yield queryInterface.addColumn(tbl, 'reminder', {
            type: sequelize.INTEGER(11),
            allowNull: true,
            defaultValue: 0
        });
    }
}

function* c_client_offline_seed(t) {
    var cls = yield db.models.c_client_list.findAll({
        include: [{
            model: db.models.c_client_offline,
            required: false
        }],
        transaction: t
    });

    var now = new Date();
    for (var cl of cls) {
        if (!cl.c_client_offlines.length) {
            yield db.models.c_client_offline.create({
                c_client_list_id: cl.id,
                status: defines.moduleStatus.rentSetting.valid.val,
                tdate: now
            }, {
                transaction: t
            });
        }
    }
}

function* b_rent_setting_seed(t) {
    var rss = yield db.models.b_rent_setting.findAll({
        where: {
            owner_price: null
        },
        include: [{
            model: db.models.b_virtual_screen,
            attributes: ['c_client_list_id'],
            required: true,
        }],
        transaction: t
    });

    for (var rs of rss) {
        var interests = yield db.models.b_user_interest.findOne({
            where: {
                c_client_list_id: rs.b_virtual_screen.c_client_list_id,
                type: defines.moduleStatus.userInterests.owner.val, //所有者 1
                is_next_level: 1 ////有下级
            },
            include: [{
                model: db.models.b_user_interest_next_level,
                where: {
                    b_user_id: defines.defaultSysInterestUserId,
                    type: defines.moduleStatus.userInterests.partner.val, //分成者
                },
                attributes: ['punits']
            }],
            attributes: ['id'],
            transaction: t
        });
        if (interests) {
            var sysInterest = interests.b_user_interest_next_levels[0].punits;
            var ownerInterest = (100 - sysInterest); // 减去默认系统分成比例
            var rent_price = parseFloat(rs.price);
            var owner_price = Math.floor(rent_price * ownerInterest) / 100;
            rs.owner_price = owner_price;
            yield rs.save({
                transaction: t
            });
        } else {
            console.log('b_rent_setting_id %d is invalid!', rs.id);
            var cl = yield db.models.c_client_list.findOne({
                where: {
                    id: rs.b_virtual_screen.c_client_list_id,
                },
                attributes: ['b_user_id'],
                transaction: t
            });

            var Interest = 100;
            var sysInterest = defines.defaultSysInterest;
            var interests = yield db.models.b_user_interest.create({
                'c_client_list_id': rs.b_virtual_screen.c_client_list_id,
                'b_user_id': cl.b_user_id,
                'punits': Interest,
                'type': defines.moduleStatus.userInterests.owner.val, //所有者 1
                'fixed_amount': 0,
                'is_next_level': 1 ////有下级
            }, {
                transaction: t
            });

            yield db.models.b_user_interest_next_level.create({
                'b_user_interest_id': interests.id,
                'b_user_id': cl.b_user_id,
                'type': defines.moduleStatus.userInterests.owner.val, //所有者
                'punits': Interest - sysInterest, // 减去默认系统分成比例
            }, {
                transaction: t
            });

            yield db.models.b_user_interest_next_level.create({
                'b_user_interest_id': interests.id,
                'b_user_id': defines.defaultSysInterestUserId,
                'type': defines.moduleStatus.userInterests.partner.val, //分成者
                'punits': sysInterest, //默认系统分成比例
            }, {
                transaction: t
            });
        }
    }

}

function* cleanRedisACL() {
    var redisCfg = cfg.redis;
    var pwd = redisCfg.pwd || "''";
    var redis_cli = `redis-cli -h ${redisCfg.host} -p ${redisCfg.port} -a ${pwd} -n ${redisCfg.db}`;
    var subCmd = `${redis_cli} keys "ReactWebNative8Koa//[0-9]*/[0-9]*"`;
    var cmd = `${redis_cli} del ` + '`' + `${subCmd}` + '`';

    shell.exec(cmd, function(error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });
}

function* production(t) {
    yield queryInterface.dropAllTables();
    yield db.sync({
        force: true, // 注意， {force: true} 将会先删除数据表然后重建
    });

    yield cleanModuleListDB(t);

    // yield addSuperAdminer();
    yield b_user_seed(t);
    yield b_role_seed(t);
    yield b_user_role_seed(t);
    yield b_module_seed(t);
    yield b_role_module_seed(t);
    yield b_default_program_effect_seed(t);
    yield b_location_type_seed(t);
    yield b_mode_seed(t);
    yield b_module_list_seed(t);
    yield b_status_main_seed(t);
    yield b_status_seed(t);
    yield b_distribution_benefit_seed(t);
    yield b_screen_match_method_seed(t);
    // b_filter_dictionary_seed();

    yield cleanRedisACL();

}

function* development(t) {
    yield db.sync();

    //fix
    yield b_virtual_screen();
    yield c_client_config();
    yield b_user_interest();
    yield c_client_list();
    yield b_rent_setting();
    yield c_client_offline();
    yield b_user();

    // yield b_virtual_screen_user_rent_seed(t);
    //restore acl table
    yield cleanModuleListDB(t);
    yield b_module_seed(t);
    yield b_role_module_seed(t);
    yield b_rent_setting_seed(t);
    yield c_client_offline_seed(t);

    //seed
    yield c_client_list_seed(t);
    yield cleanRedisACL();
}

function* migration() {
    yield queryInterface.dropAllTables();
    yield db.sync({
        force: true, // 注意， {force: true} 将会先删除数据表然后重建
    });
}

program
    .option('-p, --production', 'Delete!!! and create a new db for production')
    .option('-m, --migration', 'Delete!!! and create a empty db for migration')
    .parse(process.argv);

co(function*() {
    try {
        var t = yield db.transaction({
            autocommit: false
        });
        if (program.migration) {
            yield migration();
        } else if (program.production) {
            yield production(t);
        } else {
            yield development(t);
        }
        yield t.commit();
        console.log('finished ...');
    } catch (e) {
        yield t.rollback();
        console.log(e);
        console.log('rollback!...');
        process.exit(1);
    }
    db.close();
    process.exit(0);
});
