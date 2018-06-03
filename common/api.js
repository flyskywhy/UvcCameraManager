// status 和 body 代表返回的数据
// status 如果是 200 的话都是代表正常返回，因此下面皆未重复描述
// 以下除 apiPath 外，皆按字母排序以方便查找
// http访问错误类型 ：
// 200正常
// 400错误（具体错误信息在 ../locale/*.js 的各API中描述）
// 403无权限访问
// 404访问路径不存在
// 408请求超时
// 503服务器无法访问
var defines = require('../common/Defines.js');

var ROLE_USER_ID = defines.User.Type.user;
var ROLE_OWNER_ID = defines.User.Type.owner;
var ROLE_OPERATOR_ID = defines.User.Type.operator;
var SUPER_ADMINER_ROLE_ID = defines.User.Type.sysadmin;

module.exports = {

    accountGET: {
        method: 'get',
        name: '获取用户列表',
        path: '/adminer-super/getaccount',
        roles: [SUPER_ADMINER_ROLE_ID],
        // params: {},
        // query: {},
        // request: {
        //     body: {}
        // },
        // status: {
        //     400: '输入参数有误'
        // },
        // body:[{
        //     "id":1,
        //     "name":"xxxxx",
        //     "status":"正常",
        //     "phone":13900000000,
        //     "id_number":null,
        //     "email":"xxxx@xxx.com",
        //     "addr":"xxxxx",
        //     "freeCnt":0,
        //     "push_id":null,
        //     "push_tag":[{\"tag\":\"user\"}, ...],
        //     "b_roles":[],
        //     "index":0,
        //     "roles":[]
        //     },
        //     ...
        // ]
    },

    addScreensToGroupsPUT: { /*添加逻辑显示屏到分组*/
        method: 'put',
        name: '屏显示资源分组7-添加逻辑显示屏到分组',
        path: '/users/:userDbid/dispGroups/:groupDbid/screens/addition',
        roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID],
        // params: {
        //     userDbid: '0 代表当前用户'
        //     groupDbid: '' //组id
        // },
        // request: {
        //      body: {
        //          screens: ['屏id's']
        //      }
        // }
        // status: {
        //     400: '输入参数有误'
        //     1 组id不能为空
        //     2 组id不存在
        // },
        // body: {
        //    addition:[' 更新记录数']
        // }
    },

    /*
    为方便管理我们的oss目录约定如下
    用户目录为： 用户ID/
    用户上传图片目录为： 用户ID/pic/
    用户上传屏幕本地图片目录为： 用户ID/locate-image/
    用户上传视频目录为： 用户ID/vid/

    关于缩略图功能
    用户上传图片缩略图与屏幕本地图片缩略图为
    调用alioss动态生成url

    用户上传视频缩略图为
    前端自行生成
    或
    上传video时，需要使用callback，
    通知应用服务器去生成缩略图上传到用户ID/vid-snap目录，缩略图和原视频同名，后缀为png

    关于鉴黄功能
    图片：
    目前OSS鉴黄功能会自动删除分数为99分以上的图片
    视频：
    前端解码生成N张图片通过green接口鉴黄
    或
    上传video时，需要使用callback，
    通知应用服务器去解码N张图片通过green接口鉴黄
    */
    aliOSSTokenGET: { // 获得ali-OSS 用户目录口令
        method: 'get',
        name: '获得ali-OSS 用户目录口令',
        path: '/users/:userDbid/aliOSSToken',
        roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID],
        // params: {
        //     userDbid: '0 代表当前用户'
        // },
        // query: {
        //      type: 'input',//选配'input' or 'output';默认input
        // }
        // request: {
        //      body: {}
        // }
        // status: {
        //     400: '输入参数有误'
        // },
        // body: {
        //    region: 'oss-cn-hangzhou',
        //    accessKeyId: AccessKeyId,
        //    accessKeySecret: AccessKeySecret,
        //    stsToken: SecurityToken,
        //    bucket: 'ReactWebNative8Koa-oss'
        // }
    },

    appLoginPOST: { // 从 APP 登录
        path: '/app-login/',
        // params: {},
        // query: {},
        // request: {
        //     body: {
        //         username: '',
        //         password: '',
        //         auid:'支付宝USER ID' //可选
        //     }
        // },
        // status: {
        //     400: '输入参数有误'
        // },
        // body: {
        //     data: '',
        //     code: '200 代表正常'
        // }
    },

    appLogoutGET: { // 从 APP 登出
        path: '/app-logout',
        // params: {},
        // query: {},
        // request: {
        //     body: {}
        // },
        // status: {
        //     200: '正常'
        // },
        // body: {}
    },


    appStrategyPOST: {
        path: '/app/strategy',
        // params: {},
        // query: {},
        // request: {
        //     body: {
        //         version: '',
        //         osType: 'IOS-, Android'
        //     }
        // },
        // status: {
        //     400: '输入参数有误'
        //     1 version不能为空
        //     2 请输入正确的 version
        //     3 osType不能为空
        //     4 请输入正确的 osType
        // },
        // body: {
        //     strategy: '1,有新版本，当前版本可以选择升级,
        //     2，必须强制升级到最高版本;3，当前版本为最新版本',
        //     version: 'version '
        //     comment: ''
        // },
    },


    changeUserPasswdPOST: {
        method: 'post',
        name: '显示发布13',
        path: '/updateUserPasswd',
        roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID],
        // params: {},
        // query: {},
        // request: {
        //     body: {
        //         oldpasswd: '',
        //         newpasswd: ''
        //     }
        // },
        // status: {
        //     400: '输入参数有误'
        //     1 原密码不能为空
        //     2 原密码长度必须大于6位
        //     3 新密码不能为空
        //     4 新密码长度必须大于6位
        //     5 新密码和原密码相同
        // },
        // body: {}
    },

    changeUserNamePOST: {
        method: 'post',
        name: '显示发布12',
        path: '/updateUserName',
        roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID],
        // params: {},
        // query: {},
        // request: {
        //     body: {
        //         name: ''
        //     }
        // },
        // status: {
        //     400: '输入参数有误'
        //     1 昵称不能为空
        //     2 昵称含有非法字符
        //     3 昵称不能大于20个字符
        // },
        // body: {}
    },

    changeDeviceOwnerPUT: { // 修改设备的所有者
        method: 'put',
        name: '修改设备的所有者',
        path: '/users/:userDbid/device/:devDbid/owner',
        roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID],
        // params: {
        //     userDbid: '0 代表当前用户'
        //     devDbid: '设备id'
        // },
        // request: {
        //     body: {
        //         phone: '新所有者电话'
        //         code: '短信验证码'
        //     }
        // },
        // status: {
        //     400: '输入参数有误'
        // },
        // body: {}
    },

    checkLoginGET: { //  确认是否登录
        path: '/users/:userDbid/checkLogin',
        // params: {
        //     userDbid: '0 代表当前用户'
        // },
        // query: {},
        // request: {
        //     body: {}
        // },
        // status: {
        //     400: '输入参数有误'
        // },
        // body: {
        //     data: '',
        //     code: '200 代表正常， 400 反之'
        // },
        // bodyError: {
        //     data: '错误的具体原因',
        //     code: ''
        // }
    },

    checkUserExistenceGET: { //检查该用户是否已经存在
        path: '/userExistence',
    },

    commonCfgGET: { //获得配置参数
        path: '/common/config',
        // params: {
        // },
        // query: {},
        // request: {
        //     body: {
        //     }
        // }
        // status: {
        //     400: '输入参数有误'
        // },
        // body: {
        //      "oss":{
        //          "Bucket":"ReactWebNative8Koa-xxx",
        //          "location":"oss-cn-hangzhou"
        //          "mtsOutputBucket":"ReactWebNative8Koa-xxx",
        //          "mtsOutputlocation":"oss-cn-hangzhou"
        //      },
        //      'videoLimit':{
        //          'time': 180 //s
        //      }
        // }
    },

    createDispGroupPOST: { // 添加分组:创建新的组名
        method: 'post',
        name: '屏显示资源分组1-添加分组:创建新的组名',
        path: '/users/:userDbid/dispGroups',
        roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID],
        // params: {
        //     userDbid: '0 代表当前用户'
        // },
        // query: {},
        // request: {
        //     body: {
        //     }
        // }
        // status: {
        //     400: '输入参数有误'
        // },
        // body: {
        //     name: '组名'
        //     id: ' 组id'
        // }
    },

    currentUserIdGET: {
        method: 'get',
        name: '获取当前用户',
        path: '/users/currentUserId',
        roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID]
    },

    destroyDevDELETE: { //用户删除自己的设备
        method: 'delete',
        name: '上线设备6',
        path: '/users/:userDbid/destroyDevices/devId/:devId',
        roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID],
        // params: {
        //     userDbid: '0 代表当前用户'
        //     devId: '设备'
        // },
        // query: {
        //     forced: '1-强制清除关联关系,''
        // },
        // request: {
        //     body: {}
        // },
        // status: {
        //     400: '输入参数有误'
        // },
        // body: {}
    },

    deviceListGET: { // 查询用户自己拥有的设备列表
        method: 'get',
        name: '上线设备4',
        path: '/users/:userDbid/managedDevices',
        roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID],
        // params: {
        //     userDbid: '0 代表当前用户'
        // },
        // query: {
        //     perpage: '每页多少个设备',
        //     page: '第 n 页, n>=1'
        // },
        // request: {
        //     body: {}
        // },
        // status: {
        //     400: '输入参数有误'
        // },
        // body: {
        //     num: '第 1 页查询时返回所有符合条件的设备的数量，后续查询时返回 0',
        //     ndata: [{
        //         id: 1,
        //         '...': ''
        //         c_client_config: {
        //             location_image: '2/headimage/icon.jpg'
        //         }
        //     }]
        // }
    },

    devCfgGET: { // 查询设备配置详情
        method: 'get',
        name: '上线设备22',
        path: '/devices/:devDbid/devCfg',
        roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID],
        // params: {
        //     devDbid: 'device id'
        // },
        // query: {},
        // request: {
        //     body: {}
        // },
        // status: {
        //     400: '输入参数有误'
        //     1 设备id不能为空
        //     2 设备不存在
        // },
        // body: {
        // c_client_list_id: 1,
        // width: 128,
        // height: 16,
        // physical_width:234,//物理屏宽度，单位为厘米
        // physical_height:388,//物理屏长度，单位为厘米
        // flowrate:20000,//人流量，整数
        // province: '浙江',
        // city: '杭州',
        // district: '西湖区',
        // location: '黄姑山路4号',
        // location_image: '屏幕图片url'
        // name: '测试屏3号',
        // b_player_list_id: 2, //播放器ID
        // lng: null,
        // lat: null,
        // b_screen_led: { b_module_list_id: 1 }, //模块型号ID
        // disp_mode_id: 1, //显示模式ID
        // labels: [ { id: 1 }, { id: 2 } ] //已选标签ID
        //  remark: 'just remark', //备注
        //  contract: null,  // 合同
        //  sys_interest: 9, //系统分成
        //  offLineMode: // 1- 离线设备 0 -实时设备
        // }
    },

    devCfgParamsGET: { // 查询设备配置选项列表
        method: 'get',
        name: '上线设备23',
        path: '/params/devCfg',
        roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID],
        // params: {},
        // query: {},
        // request: {
        //     body: {}
        // },
        // status: {
        //     400: '数据库内容不存在'
        // },
        // body: {
        // moduleLists:
        //    [ { id: 1,
        //        module_name: 'P10-X-X4S-1M3S00048',
        //        width: 32,
        //        height: 32 },
        //      { id: 2, module_name: 'P10-VB01B', width: 32, height: 16 } ],
        // playerLists:
        //    [ { id: 1, player_name: '' },
        //      { id: 2, player_name: '' },
        //      { id: 3, player_name: '' } ],
        // labelLists:
        //    [ { id: 1, name: '书店' },
        //      { id: 2, name: '酒店' },
        //      { id: 3, name: '超市' },
        //      { id: 4, name: '其它' } ],
        // dispModeLists:
        //    [ { id: 1, mode_name: '全屏', mode_desc: '全屏分享' },
        //      { id: 2, mode_name: '左右', mode_desc: '左右分享' },
        //      { id: 3, mode_name: '上下', mode_desc: '上下分享' } ]
        // matchMethods:
        //    [ { id: 1, val: 1, name: '全屏'},
        //      { id: 2, val: 2, name: '拉伸'},
        //      { id: 3, val: 3, name: '截取'},
        //      { id: 4, val: 4, name: '原画'} ],        //
        // cycle: [ { id: 1, val: 180, unit: '秒' },
        // { id: 2, val: 300, unit: '秒' },
        // { id: 3, val: 600, unit: '秒' },
        // { id: 4, val: 900, unit: '秒' },
        // { id: 5, val: 1800, unit: '秒' } ]
        // }

    },

    devCfgPUT: { // 设置设备配置
        method: 'put',
        name: '上线设备22',
        path: '/devices/:devDbid/devCfg',
        roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID],
        // params: {
        //     devDbid: 'device id'
        // },
        // query: {},
        // request: {
        //     body: {
        //         name: 'Home',
        //         module_id: 'sl2c',
        //         location_image: '2/headimage/icon.jpg'
        //      }
        // },
        // status: {
        //     400: '输入参数有误'
        //      1 name不能为空
        //      2 name含有非法字符
        //      3 name不能超过20个字符
        //      4 其他参数同上。。。
        // },
        // body: {}

    },

    devOwnerPunitGet: { // owner获得自用punit数量
        method: 'get',
        name: '上线设备19',
        path: '/devices/:vsDbid/ownerPunits',
        roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID],
        // params: {
        //     vsDbid: 'virtul screen id'
        // },
        // query: {},
        // request: {
        //     body: {}
        // },
        // status: {
        //     400: '输入参数有误'
        //     1 设备id不能为空
        //     2 设备不存在
        // },
        // body: {
        //      b_user_id: 2, // '用户ID',
        //      modeId: 1,    // '模式ID： 0 or 1',
        //      punits: 100,  // '0-360'
        //      price: 12.34,  //屏主定价
        //      rent_price: 14.30 //出租价格
        //      rentTimeUnit: 0        //0：按小时， 1：按天
        //      rentSetting:   [{
        //          'circle_type': 1,         // 1：按天，2:按周（暂不支持） 3：按月（暂不支持）
        //          'start_time': '8:00',
        //          'end_time': '20:00',
        //          'val': null,               //按天，该字段无意义
        //          'punits': 20,             //自用
        //          'rentable_punits'：16,    //可租
        //          'max_punits': 36,         //总Punits（暂不支持，各时段不同）
        //          'price': 0.1,             // 该时段价格（暂不支持，各时段不同）
        //          'type': 1                 //短租（现固定为短租）
        //      }
        //      ...
        //      ]
        // }
    },

    devOwnerPunitPUT: { // owner设置自用punit数量
        method: 'put',
        name: '上线设备19',
        path: '/devices/:vsDbid/ownerPunits',
        roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID],
        // params: {
        //     vsDbid: 'virtul screen id'
        // },
        // query: {},
        // request: {
        //     body: {
        //          name: 'user1',         // ''
        //          phone: 13900000001,    // '该用户手机号码'
        //          modeId: 4,             // '模式ID： 目前都是模式4,时段租
        //          punits: 20,            // '0 - max_punits'
        //          circleType: 1,         // 1：按天，2:按周（暂不支持） 3：按月（暂不支持）
        //          price: 0.3,            // 屏主定价（暂不支持，各时段不同）
        //          rentTimeUnit: 0        //0：按小时， 1：按天
        //          businessHours: [{
        //             start_time: '8:00',
        //             end_time: '20:00',
        //             val: 0,              // 按天，该字段无意义
        //             rentable_punits: 16, // 目前要求该字段和上面的punits相加等于全部punits
        //             price: 0.3,          // 该时段价格（暂不支持，各时段不同）
        //             type: 1              // 1：短租， 2： 长租（暂不支持）
        //          }]
        //     }
        // },
        // status: {
        //     400: '输入参数有误'
        // },
        // body: {}
    },

    dispGroupsGET: { /*获取分组信息:分组名字及组下逻辑屏数目*/
        method: 'get',
        path: '/users/:userDbid/dispGroups/screens',
        name: '屏显示资源分组9-获取分组名字及组下逻辑屏数目',
        roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID],
        // query: {
        //     perpage: '每页多少个分组',
        //     page: '第 n 页, n>=1',
        // },
        // params: {
        //     userDbid: '0 代表当前用户'
        // },
        // status: {
        //     400: '输入参数有误'
        // },
        // body: {
        //      count: '//第一页返回节目总数，其余页返回0s'
        //      groups: [{
        //      id: '分组id'
        //      name: '分组名字'
        //      count: '组下逻辑屏数目'
        //     }]
        // }]
        // }
    },


    dispGroupsScreensGET: { /*获取组的具体逻辑屏信息*/
        method: 'get',
        name: '屏显示资源分组10-获取组的具体逻辑屏信息',
        path: '/users/:userDbid/dispGroups/:groupDbid/screens',
        roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID],
        // params: {
        //     userDbid: '0 代表当前用户'
        //     groupDbid: '' //组id
        // },
        // query: {
        //     perpage: '每页多少个分组',
        //     page: '第 n 页, n>=1',
        // },
        // status: {
        //     400: '输入参数有误'
        // },
        // body: {
        //      count: '//第一页返回节目总数，其余页返回0s'
        //      screens: [{ //屏信息
        //    id: '屏id'
        //    c_client_list_id: 'client id'
        //    x0: 0,
        //    y0: 0,
        //    width: 128,
        //    height: 16,
        //    c_client_list: { //物理屏信息
        //    }
        //    end_datetime: '屏幕到期时间'
        //    published: '屏幕是否进行发布，1-发布，0-未发布'
        // }]
        // }
    },


    dispGroupsScreensDetailsGET: { /*获取组的逻辑屏下的显示槽信息*/
        method: 'get',
        name: '屏显示资源分组11-获取组的逻辑屏下的显示槽信息',
        path: '/users/:userDbid/dispGroups/:groupDbid/screens/:screenDbid',
        roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID],
        // params: {
        //     userDbid: '0 代表当前用户'
        //     groupDbid: '' //组id
        // },
        // status: {
        //     400: '输入参数有误'
        // },
        // body: [{//显示槽2信息
        //       id: '显示槽 id'
        //       start_datetime: '租用起始时'
        //       end_datetime: '租用结束时间'
        //       type: '租用类型，长租短租',
        //       b_virtual_screen_user_rent_mode_01: { punits: '租用占比' },
        // }, {}
        // ]
        //
    },

    modifyDispGroupNamePUT: { // 修改组名
        method: 'put',
        name: '屏显示资源分组12-修改组名',
        path: '/users/:userDbid/dispGroups/:groupDbid/name',
        roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID],
        // params: {
        //     userDbid: '0 代表当前用户'
        //     groupDbid: '' //组名
        // },
        // request: {
        //     body: {
        //         name: '新组名'
        //     }
        // }
        // status: {
        //     400: '输入参数有误'
        // },
        // body: {
        //   update:[' 更新记录数']
        //   groupid: 'groupid'
        // }
    },

    ownScreensGET: { //屏所有者的所有屏
        method: 'get',
        name: '所有者的所有屏',
        path: '/owners/:userDbid/screens',
        roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID],
        // params: {
        //     userDbid: '0 代表当前用户'
        // },
        // query: {
        //     perpage: '每页多少个订单',
        //     page: '第 n 页, n>=1',
        // },
        // status: {
        //     400: '输入参数有误'
        // },
        // body: {
        //     count: '第一页返回节目总数，其余页返回0s',
        //     screens: [{
        //      id: 1,
        //      c_client_list_id: 1,
        //      x0: 0,
        //      y0: 0,
        //      width: 128,
        //      height: 16,
        //      end_datetime: '2116-12-08T07:17:58.000Z',
        //      published: 0,
        //      c_client_list: {
        //          c_client_config: {
        //              name: '',
        //              location: ''
        //          }
        //      }
        //     }]
        // }
    },


    publishedScreensGET: { //正在发布的逻辑屏
        method: 'get',
        name: '正在发布的逻辑屏',
        path: '/users/:userDbid/publication/screens',
        roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID]
        // params: {
        //     userDbid: '0 代表当前用户'
        // },
        // query: {
        //     perpage: '每页多少个节目',
        //     page: '第 n 页, n>=1'
        // },
        // status: {
        //     400: '输入参数有误'
        // },
        // body: {
        //  count: ''//第一页返回节目总数，其余页返回0s
        //  rows:[{
        //      id: '',
        //      name: ''
        //      own: 1-自拥有,0-租用
        //   }]
        // }
    },

    registerPOST: { // 注册用户
        path: '/addUserVerification',
        // params: {},
        // query: {},
        // request: {
        //     body: {
        //         phone: '',
        //         password: ''
        //         verifCode: ''
        //     }
        // },
        // status: {
        //     400: '输入参数有误'
        //     1 手机号码不能为空
        //     2 手机号码格式错误
        //     3 密码不能为空
        //     4 密码长度必须为6-12位
        //     5 验证码不能为空
        //     6 验证码错误
        // },
        // body: userId
    },


    registerDevPOST: { // 注册设备
        method: 'post',
        name: '上线设备5',
        path: '/users/:userDbid/managedDevices/devId/:devId',
        roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID],
        // params: {
        //     devId: 'yid （在无法获取 yid 的情况下可以 0 代替）或 product id'
        // },
        // query: {},
        // request: {
        //     body: {
        //         id2: '',
        //         sign: '',
        //         key: '' //扫码注册必须
        //     }
        // },
        // status: {
        //     400: '输入参数有误'
        // },
        // body: {
        //     id: //b_client_id
        //     product_id: //'product_id';
        //     status: //'status';
        // }
    },

    rmDispGroupsDELETE: { //删除屏分组
        path: '/users/:userDbid/dispGroups/:groupDbid',
        // params: {
        //     userDbid: '0 代表当前用户'
        //     groupDbid: '' //组id
        // },
        // status: {
        //     400: '输入参数有误'
        // },
        // body: {
        //  groupid: '删除组id'
        //  ret:[' 更新记录数']
        // }
    },


    rmScreensFromGroupsPUT: { /*从组中移除逻辑显示屏*/
        path: '/users/:userDbid/dispGroups/:groupDbid/screens/deletion',
        // params: {
        //     userDbid: '0 代表当前用户'
        //     groupDbid: '' //组id
        // },
        // request: {
        //      body: {
        //          screens: ['屏id's']
        //      }
        // }
        // status: {
        //     400: '输入参数有误'
        // },
        // body: {
        //    deletion:[' 更新记录数'],
        //    deleted_screen_ids:['删除的屏id组成的数组，若没有删除任意一个屏，则是空数组']
        // }
    },

    screenDetailGET: { // 查询逻辑显示屏的详情
        path: '/virtualScreen/:id',
        // params: {
        //     id: '逻辑显示屏的 id'
        // },
        // query: {
        //  unit: 'days' or 'hours',
        //  begin_time: '2017-06-24T16:00:00.000Z',
        //  end_time: '2017-06-24T19:00:00.000Z'
        //  ids: [3, 4, 5] //虚拟屏id数组，使用该参数，id参数将不被使用，同时返回body转变为数组
        //  },
        // request: {
        //     body: {}
        // },
        // status: {
        //     400: '输入参数有误'
        // },
        // body: {
        //     cycle: 180, //循环周期，单位秒
        //     secondsPerPunit: 5, //一个punit等于多少秒
        //     data: {
        //         punits: '用于显示详情中的曲线 。punits[] 中的每个元素是当天剩余 punits 的值，数组范围是从当天到第 2（短租）/ 3（长租）个月的月底。',
        //         '...': ''
        //     },
        // }
    },

    devConfGeneralOptionsGET: {
        path: '/device/configuration/options',
        // body: {
        //      mode: [
        //      { name: '时租',
        //           explain: '至少租 5 秒，循环周期可设置，默认三分钟',
        //           mode: 3,
        //           eqPlayerMode: 1,
        //           secondsPerPunit: 5
        //           playlistDurationMax: 1800,
        //           } ]
        // }]
    },

    unpublishedScreensGET: { //未发布的逻辑屏
        path: '/users/:userDbid/unpublication/screens',
        // params: {
        //     userDbid: '0 代表当前用户'
        // },
        // query: {
        //     perpage: '每页多少个节目',
        //     page: '第 n 页, n>=1'
        // },
        // status: {
        //     400: '输入参数有误'
        // },
        // body: {
        //  count: ''//第一页返回节目总数，其余页返回0s
        //  rows:[{
        //      id: '',
        //      name: ''
        //   }]
        // }
    },

    userInfoDEL: { //删除用户，不删除数据表，修改用户状态
        path: '/users/',
        // params: {
        //     userDbid: ''
        // },
        // request: {
        // },
        // status: {
        //     200
        // },
        // body: {
        // }
    },

    userInfoGET: { // 用户信息的获取
        path: '/users/',
        // params: {
        //     userDbid: ''
        // },
        // query: {},
        // request: {},
        // status: {
        //     400: '输入参数有误'
        // },
        // body: '用户信息',
        // }
    },

    userInfoPOST: { // 用户信息的添加，修改
        path: '/users/',
        // params: {
        //     userDbid: ''
        // },
        // query: {},
        // request: {
        //     body: {
        //         phone: '',
        //         name: '',
        //         password: '',
        //         email: '',
        //         addr: '',
        //         headimage: ''
        //     }
        // },
        // status: {
        //     400: '输入参数有误'
        //     1 请输入正确的手机号
        //     2 请输入正确的昵称
        //     3 请输入正确的密码
        //     4 请输入正确的email
        //     5 请输入正确的地址
        //
        // },
        // body: 'user.id',
        // }
    },

    materialListGET: { //用户获得素材列表
        path: '/users/:userDbid/material',
        // params: {
        //     userDbid: '0 代表当前用户'
        // },
        // query: {
        //     perpage: '每页多少个素材',
        //     page: '第 n 页, n>=1'
        //},
        // status: {
        //     400: '输入参数有误'
        // },
        // body: '{
        //      count: '用户素材总数'
        //      rows:
        //      [ {
        //               id: 6,
        //               filename: 'test.JPG',
        //               tdate: '2016-12-22T08:40:35.000Z',
        //               status: 1,
        //               b_resource: {
        //                  path: ' 上传图片的URL',
        //                  thumbnailPath: '缩略图的URL',
        //              };
        //          },
        //          ...
        //      ]
        //   }'
    },


    materialServerGET: { //用户获得素材服务器列表
        path: '/users/:userDbid/materialServer',
        // params: {
        //     userDbid: '0 代表当前用户'
        // },
        // query: {
        //},
        // status: {
        //     400: '输入参数有误'
        // },
        // body: '{
        //  'uploadServer': ...,
        //  'uploadServerPort': ...,
        //  'fileServer': ...,
        //  'fileServerPort': ..,
        //  'maxFileSize': ..
        //   }'
    },


    userScreenListGET: { // 获取租用的所有逻辑屏
        path: '/users/:userDbid/screens',
        // params: {
        //     userDbid: '0 代表当前用户'
        // },
        // query: {
        //     perpage: '每页多少个逻辑屏',
        //     page: '第 n 页, n>=1'
        //     notInGroup: '用于屏分组，同一个屏只能存在一个组中'
        // },
        // request: {
        //     body: {}
        // },
        // status: {
        //     400: '输入参数有误'
        // },
        // body: {
        //     count: '第 1 页查询时返回所有符合条件的显示槽的数量，后续查询时返回 0',
        //     screens: [{ id: 1,
        // c_client_list_id: 1,
        // x0: 0,
        // y0: 0,
        // width: 128,
        // height: 16,
        // own: 1-自拥有,0-租用
        // end_datetime: '2116-12-08T07:17:58.000Z',
        // published: 0,
        // c_client_list: {
        //      "id":41,
        //      "c_client_config":{
        //          "name":"test41",
        //          "location":"黄姑山路4号",
        //          "physical_width":1,
        //          "physical_height":1,
        //          "flowrate":100
        //       }
        // },
        // b_virtual_screen_user_rents: [{}], //显示租用时间
        // "b_rent_settings":[{
        //       "start_time":"00:00:00",
        //       "end_time":"24:00:00"
        //       }],
        // }]
        // }
    },


    userUploadDEL: { //删除素材
        path: '/upload/MD5/:md5',
        // status: {
        //     400: '输入参数有误'
        // },
        // body: ''
    },


    userUploadGET: { // 通过MD5 获得当前文件的状态，要求userUploadPOST之前调用
        path: '/upload/MD5/:md5',
        // params: {
        //     md5: ''
        // },
        // query: {
        //    filename: ''
        //},
        // status: {
        //     400: '输入参数有误'
        // },
        // body: '{
        // 'materialId': '素材Id',
        // 'md5': 'md5值',
        // 'offset': '文件上传offset',
        // 'url': '原文件url',
        // 'snap': '缩略图url',
        // 'status': 0: INVALID; 1: READY; 2: REMOVE; 3: UPLOADING;
        // };'
    },


    userUploadPOST: { //上传素材
        path: '/upload/MD5/:md5',
        // status: {
        //     400: '输入参数有误'
        // },
        // query: {
        //    filesize: '文件大小',
        //    filename: '文件名，默认为unnamed-file.mov',
        //    type: 1代表素材,0代表屏幕现场照片,默认为1
        //},
        // body: '{
        //     materialId: IDNumber
        //     success: true,
        //     md5:  '718ef2b1c8a65f065fd85c7fe30e0f78',
        //     url: '/upload/video/33323433-test.mp4',
        //     snap: '/upload/thumbnail/15058333-test-small.png'
        // };'
    },


    userVerificationPUT: { // 用户通过手机号码获取验证码
        path: '/userVerification/mobile/',
        // params: {
        //     mobile: ''
        // },
        // query: {},
        // request: {
        //     body: {
        //     }
        // },
        // status: {
        //     400: '输入参数有误'
        //     1 手机号码不能为空
        //     2 请输入正确的手机号码
        // },
        // body: ''
    },


    userChangeDevOwnerVerificationPUT: { // 用户转让设备所有者获取短信验证码
        path: '/userChangeDevOwnerVerificationPUT/mobile/',
        // params: {
        //     mobile: ''
        // },
        // query: {},
        // request: {
        //     body: {
        //     }
        // },
        // status: {
        //     400: '输入参数有误'
        //     1 手机号码不能为空
        //     2 请输入正确的手机号码
        // },
        // body: ''
    },


    userForgetPasswdVerificationPUT: { // 用户通过手机号码获取忘记密码验证码
        path: '/userForgetPasswdVerification/mobile/',
        // params: {
        //     mobile: ''
        // },
        // query: {},
        // request: {
        //     body: {
        //     }
        // },
        // status: {
        //     400: '输入参数有误'
        //     1 手机号码不能为空
        //     2 请输入正确的手机号码
        // },
        // body: ''
    },


    userResetPasswdPOST: { // 用户重置密码
        path: '/userResetPasswd',
        // params: {},
        // query: {},
        // request: {
        //     body: {
        //         phone: '',
        //         password: ''
        //         verifCode: ''
        //     }
        // },
        // status: {
        //     400: '输入参数有误'
        //     1 手机号码不能为空
        //     2 请输入正确的手机号码
        //     3 新密码不能为空
        //     4 新密码长度为6-12位
        //     5 验证码不能为空
        //     6 验证码错误
        // },
        // body: userId
    },

    versionGET: {
        method: 'get',
        name: '获得版本号',
        path: '/version', //获得版本号
        roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID],
        // params: {},
        // query: {},
        // request: {
        //     body: {}
        // },
        // status: {
        // },
        // body: {
        //      name: 'ReactWebNative8Koa', //后台名称
        //      version: '2.2.1-rc.0', //后台版本
        //      longRevision: '7771d986d8fcc2b936be1d43d6aad64e8367d82d', //后台Git提交版本
        //      branch: 'master',//后台Git分支
        //      tag: null, //后台Git Tag
        //      committer: 'Li Zheng <flyskywhy@gmail.com>', //后台Git提交人
        //      committerDate: '2017-07-17T09:13:29.000Z', //后台Git提交时间
        //      commitMessage: 'typo', //后台Git提交说明
        //      root: '/home/lizheng/ReactWebNative8Koa/ReactWebNative8Koa'  //后台路径
        // }

    },

    bindPhoneSendGET: {
        method: 'get',
        name: '第三方登陆用户绑定手机--发送验证码',
        path: '/bindphone/send',
        roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID],
        // query: {
        //     phone: 13900000001 //phone
        // },
        // status: {
        //     400: '输入参数有误'
        //     1 手机号码不能为空
        //     2 请输入正确的手机号码
        // },
        // resbody: {
        //     success: true | false
        // }
    },

    bindPhoneVerifyGET: {
        method: 'get',
        name: '第三方登陆用户绑定手机--验证并绑定手机',
        path: '/bindphone/verify',
        roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID],
        // query: {
        //     phone: 13900000001, //phone,
        //     verifycode: 123456 //验证码
        // },
        // status: {
        //     400: '输入参数有误'
        //     1 手机号码不能为空
        //     2 请输入正确的手机号码
        //     3 验证码不能为空
        //     4 验证码错误
        // },
        // resbody: {
        //     success: true | false
        // }
    },

    wxsignGET: {
        method: 'get',
        name: '前台获取微信签名？',
        path: '/weixin/getsign',
        roles: [SUPER_ADMINER_ROLE_ID, ROLE_OWNER_ID, ROLE_OPERATOR_ID, ROLE_USER_ID],
        resbody: {
            jsapi_ticket: 'jsapi_ticket',
            noncestr: 'noncestr',
            timestamp: 'timestamp',
            url: 'url',
            sign: 'sign'
        }
    },

    loginVerificationPUT: { // 用户通过手机号码获取登录验证码
        path: '/loginVerification/mobile/',
        // params: {
        //     mobile: ''
        // },
        // query: {},
        // request: {
        //     body: {
        //     }
        // },
        // status: {
        //     400: '参数错误'
        //     1 手机号码不能为空
        //     2 手机号码格式错误
        // },
        // body: 错误码
    },

    loginVerificationPOST: { // 通过验证码登录
        path: '/loginVerification/',
        // params: {},
        // query: {},
        // request: {
        //     body: {
        //         username: '',
        //         verifycode: ''
        //     }
        // },
        // status: {
        //     400: '参数错误'
        // },
        // body: {}
    },

    emailSendPost: {
        method: 'post',
        name: '用户发送邮件给系统指定邮箱',
        path: '/emial/send',
        // body: {
        //     subject: '标题，必填，字符串',
        //     text: '文本，必填，字符串',
        //     phone: 13900000001, //选填
        //     email: '用户邮箱，选填'
        // },
        // resbody: {
        //     error: ''
        // }
    },

    logControlGET: {
        method: 'get',
        name: '获得打印记录log的等级',
        path: '/control/dbglevel',
        roles: [SUPER_ADMINER_ROLE_ID],
        // resbody: {
        //     'logLevel': debug
        // };
    },

    logControlPOST: {
        method: 'post',
        name: '调整打印记录log的等级',
        path: '/control/dbglevel',
        roles: [SUPER_ADMINER_ROLE_ID],
        //reqbody：{
        //    dbgLevel：trace|debug|info|warn|error|fatal
        //}
        // resbody: {
        // };
    },

    apiPath: '/api/v0001',
    apiErrParse: function(message, type) {
        var errCode = 'systemUnkownError';

        if (Object.prototype.toString.call(message) !== '[object String]' ||
            Object.prototype.toString.call(type) !== '[object String]') {
            return errCode;
        }

        if (message.substr(0, type.length) === type) {
            errCode = message;
        }
        return errCode;
    }
};
