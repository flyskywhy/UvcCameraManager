exports.User = {};
exports.User.Type = {
  owner: 105,
  operator: 106,
  user: 107,
  sysadmin: 112,
};

var USER_ADMIN_ID = 88;
exports.User.UserId = {
  admin: 77,
  userAdmin: USER_ADMIN_ID,
  user: 2,
  user01: 3,
};

exports.smsSignName = 'ReactWebNative8Koa';
exports.smsTemplateCode = {
  authenticationVerify: 'SMS_121977018', // 身份验证验证码
  smsTest: 'SMS_121977017', // 短信测试
  loginConfirmVerify: 'SMS_121977016', // 登录确认验证码
  loginAbnormalVerify: 'SMS_121977015', // 登录异常验证码
  userRegisterVerify: 'SMS_121977014', // 用户注册验证码
  changePasswordVerify: 'SMS_121977013', // 修改密码验证码
  infoChangeVerify: 'SMS_121977012', // 信息变更验证码

  custom1: 'SMS_111111111', // 自定义 1
  custom2: 'SMS_111111112', // 自定义 2
};

exports.cookiePassportName = 'ReactWebNative8KoaPassport';
exports.cookieCacheTimeout = 60 * 60 * 24 * 30; // cookie 在redis内过期时间
exports.cookieTimeout = 60 * 60 * 24 * 365; // cookie 过期时间

exports.thirdpartycertifier = {
  type: {
    alipay: {
      val: 1,
      explain: '阿里平台第三方登陆',
    },
    weixin: {
      val: 2,
      explain: '微信开放平台第三方登陆',
    },
  },
  status: {
    available: {
      val: 1,
      explain: '正常可用',
    },
  },
};

exports.devStatus = [
  {
    name: '正常', //0
  },
  {
    name: '等待', //1
  },
  {
    name: '无效', //2
  },
];

exports.status = [
  {
    b_status_main: {
      id: 1,
      name: '用户状态',
    },
    b_status: [
      {
        val: 0,
        name: '正常',
        language_id: 0,
      },
      {
        val: 1,
        name: '验证',
        language_id: 0,
      },
      {
        val: 2,
        name: '无效',
        language_id: 0,
      },
      {
        val: -1,
        name: '已删除',
        language_id: 0,
      },
    ],
  },
  {
    b_status_main: {
      id: 2,
      name: '终端状态',
    },
    b_status: [
      {
        val: 0,
        name: '正常',
        language_id: 0,
      },
      {
        val: 1,
        name: '等待',
        language_id: 0,
      },
      {
        val: 2,
        name: '无效',
        language_id: 0,
      },
    ],
  },
  {
    b_status_main: {
      id: 3,
      name: '终端工作状态',
    },
    b_status: [
      {
        val: 0,
        name: '正常',
        language_id: 0,
      },
      {
        val: 1,
        name: '异常',
        language_id: 0,
      },
      {
        val: 2,
        name: '离线',
        language_id: 0,
      },
    ],
  },
  {
    b_status_main: {
      id: 4,
      name: '租用类型',
    },
    b_status: [
      {
        val: 1,
        name: '短租',
        language_id: 0,
      },
      {
        val: 2,
        name: '长租',
        language_id: 0,
      },
      {
        val: 3,
        name: '自用',
        language_id: 0,
      },
    ],
  },
  {
    b_status_main: {
      id: 5,
      name: '关联类型',
    },
    b_status: [
      {
        val: 1,
        name: '所有者',
        language_id: 0,
      },
      {
        val: 2,
        name: '分成者',
        language_id: 0,
      },
      {
        val: 3,
        name: '设备商',
        language_id: 0,
      },
    ],
  },
  {
    b_status_main: {
      id: 6,
      name: '订单状态',
    },
    b_status: [
      {
        val: 1,
        name: '待支付',
        language_id: 0,
      },
      {
        val: 2,
        name: '已支付',
        language_id: 0,
      },
      {
        val: 3,
        name: '已取消',
        language_id: 0,
      },
    ],
  },
  {
    // b_publish_precompose status
    b_status_main: {
      id: 7,
      name: '节目发布状态',
    },
    b_status: [
      {
        val: 0,
        name: '节目待转换',
        language_id: 0,
      },
      {
        val: 1,
        name: '节目转换成功',
        language_id: 0,
      },
      {
        val: 2,
        name: '节目待发布',
        language_id: 0,
      },
      {
        val: 3,
        name: '节目发布取消',
        language_id: 0,
      },
      {
        val: 4,
        name: '节目转换失败',
        language_id: 0,
      },
      {
        val: 8,
        name: '节目播放中',
        language_id: 0,
      },
      {
        val: 9,
        name: '节目被禁止',
        language_id: 0,
      },
      {
        val: 10,
        name: '节目被删除',
        language_id: 0,
      },
      {
        val: 11,
        name: '节目审核中', //和val1,9配合使用
        language_id: 0,
      },
    ],
  },
  {
    b_status_main: {
      id: 8,
      name: '节目状态',
    },
    b_status: [
      {
        val: 1,
        name: '空闲',
        language_id: 0,
      },
      {
        val: 2,
        name: '已发布',
        language_id: 0,
        // }, {
        //     val: 3,
        //     name: '审核通过', // maybe unnecessary
        //     language_id: 0
      },
      {
        val: -1,
        name: '已删除',
        language_id: 0,
      },
      {
        val: -2,
        name: '待审核',
        language_id: 0,
      },
      {
        val: -3,
        name: '审核未通过',
        language_id: 0,
      },
      {
        val: -4,
        name: '已修改无效',
        language_id: 0,
      },
    ],
  },
  {
    b_status_main: {
      id: 9,
      name: '显示槽状态',
    },
    b_status: [
      {
        val: 0,
        name: '等待确认',
        language_id: 0,
      },
      {
        val: 1,
        name: '正常',
        language_id: 0,
      },
      {
        val: 2,
        name: '已删除',
        language_id: 0,
      },
      {
        val: 4,
        name: '已退款&删除',
        language_id: 0,
      },
      {
        val: 9,
        name: '超时删除',
        language_id: 0,
      },
    ],
  },
  {
    b_status_main: {
      id: 10,
      name: '收益批量支付订单状态',
    },
    b_status: [
      {
        val: 1,
        name: '待支付',
        language_id: 0,
      },
      {
        val: 2,
        name: '已支付',
        language_id: 0,
      },
      {
        val: 3,
        name: '支付失败',
        language_id: 0,
      },
    ],
  },
  {
    b_status_main: {
      id: 11,
      name: '终端命令状态状态',
    },
    b_status: [
      {
        val: 0,
        name: '等待列表生成',
        language_id: 0,
      },
      {
        val: 1,
        name: '正常',
        language_id: 0,
      },
      {
        val: 3,
        name: '设备终端已反馈（完成或者出错）',
        language_id: 0,
      },
      {
        val: 4,
        name: '无效命令',
        language_id: 0,
      },
    ],
  },
];

exports.rentType = {
  shortRent: {
    explain: '短租',
    val: 1,
  },
  longRent: {
    explain: '长租',
    val: 2,
  },
  privateUse: {
    explain: '自用',
    val: 3,
  },
  isRent: {
    explain: '出租',
    val: [1, 2],
  },
};

exports.clientVideoConfigType = {
  IP: {
    val: 0,
    explain: 'IP摄像头',
  },
  USB: {
    val: 1,
    explain: 'USB摄像头',
  },
  virtual: {
    val: 2,
    explain: '虚拟摄像头',
  },
};

exports.moduleStatus = {
  preCompose: {
    active: {
      explain: '节目发布中',
      val: 1,
    },
    deleted: {
      explain: '发布已删除',
      val: 3,
    },
    unapproved: {
      explain: '发布被禁止',
      val: 9,
    },
    ownerDeleted: {
      explain: '发布被所有者删除',
      val: 10,
    },
    valid: {
      explain: '有效发布',
      val: [1, 11],
    },
    existing: {
      explain: '当前所有发布',
      val: [1, 9, 11, 10],
    },
  },

  program: {
    deleted: {
      explain: '已删除',
      val: -1,
    },
    mod2del: {
      explain: '已修改无效',
      val: -4,
    },
    idle: {
      explain: '空闲',
      val: 1,
    },
    active: {
      explain: '已发布', //- 数据库中未体现，给前台使用
      val: 2,
    },
    unapproved: {
      explain: '审核未通过',
      val: -3,
    },
    pubDeleted: {
      explain: '发布被删除',
      val: -5, // 数据库中未体现，给前台使用/前台暂未处理
    },
    valid: {
      explain: '有效',
      val: [1, 2],
    },
    invalid: {
      explain: '无效或删除的',
      val: [-1, -3, -4],
    },
    existing: {
      explain: '当前所有节目',
      val: [1, 2, -2, -3],
    },
  },

  virtualScreen: {
    valid: {
      explain: '有效',
      val: 1,
    },
    invalid: {
      explain: '无效',
      val: 2,
    },
  },

  screenUserRent: {
    pending: {
      explain: '等待确认',
      val: 0,
    },
    valid: {
      //可能存在部分退款
      explain: '有效',
      val: 1,
    },
    deleted: {
      explain: '已删除',
      val: 2,
    },
    refund2del: {
      explain: '等待退款&删除', //全部Punits等待退款
      val: 4,
    },
    timeout2del: {
      explain: '超时删除',
      val: 9,
    },
    refundOK: {
      //全部Punits已退款
      explain: '已退款',
      val: 10,
    },
    normal: {
      explain: '正常',
      val: [0, 1],
    },
    refundAgain: {
      explain: '可被退款的',
      val: [1, 4, 10],
    },
  },

  clients: {
    pending: {
      explain: '等待配置',
      val: 1,
    },
    valid: {
      explain: '有效',
      val: 0,
    },
    deleted: {
      explain: '已删除',
      val: 2,
    },
    normal: {
      explain: '正常',
      val: [0, 1],
    },
  },

  screenGroup: {
    valid: {
      explain: '有效',
      val: 1,
    },
    deleted: {
      explain: '已删除',
      val: 3,
    },
  },

  publishs: {
    valid: {
      explain: '有效',
      val: 1,
    },
  },

  userInterests: {
    owner: {
      val: 1,
      explain: '所有者',
    },
    partner: {
      val: 2,
      explain: '分成者',
    },
    businessman: {
      val: 3,
      explain: '设备商',
    },
  },

  materialOss: {
    valid: {
      val: 1,
      explain: '有效',
    },
    invalid: {
      val: 0,
      explain: '无效',
    },
  },

  rentCountMode01: {
    valid: {
      val: 1,
      explain: '有效',
    },
    invalid: {
      val: 2,
      explain: '无效',
    },
  },

  rentedCountMode01: {
    valid: {
      val: 1,
      explain: '有效',
    },
    invalid: {
      val: 2,
      explain: '无效',
    },
  },

  rentSetting: {
    valid: {
      val: 1,
      explain: '有效',
    },
    invalid: {
      val: 2,
      explain: '无效',
    },
  },

  rentSettingCircleType: {
    day: {
      val: 1,
      explain: '按天',
    },
    week: {
      val: 2,
      explain: '按周',
    },
    month: {
      val: 3,
      explain: '按月',
    },
  },

  cmdList: {
    ready: {
      val: 0,
      explain: '等待列表生成', // 转换服务器转换成功后，更新为有效
    },
    valid: {
      val: 1,
      explain: '有效',
    },
    processed: {
      val: 3,
      explain: '设备终端已反馈（完成或者出错）', //下载完成或失败
    },
    removed: {
      val: 4,
      explain: '无效命令/已删除',
    },
    canberm: {
      val: [0, 1],
      explain: '可以被删除/无效的命令状态',
    },
  },

  publishCompose: {
    ready: {
      val: 0,
      explain: '等待生成给播放器的节目信息文件',
    },
    valid: {
      val: 1,
      explain: '节目已经下发到终端',
    },
    failed: {
      val: 4,
      explain: '生成节目信息失败', //转换服务失败或者上传节目信息失败
    },
  },
};

exports.materialOssDesc = {
  type: {
    original: {
      val: 0,
      explain: '用户数据',
    },
    resize: {
      val: 1,
      explain: '转码后数据',
    },
  },
  md5_type: {
    overall: {
      val: 0,
      explain: '全部数据做的md5',
    },
    partial: {
      val: 1,
      from: 0,
      length: 1024,
      explain: '从from字节开始的length长度数据做的md5',
    },
  },
};

exports.devCfgParams = {
  offlineModes: {
    realtime: {
      val: 0,
      explain: '实时设备',
    },
    offline: {
      val: 1,
      explain: '离线设备',
    },
  },
};

exports.screen_pb_cycle_list = [
  {
    id: 1,
    val: 180,
    unit: '秒',
  },
  {
    id: 2,
    val: 300,
    unit: '秒',
  },
  {
    id: 3,
    val: 600,
    unit: '秒',
  },
  {
    id: 4,
    val: 900,
    unit: '秒',
  },
  {
    id: 5,
    val: 1800,
    unit: '秒',
  },
  {
    id: 6,
    val: 3600,
    unit: '秒',
  },
];

//待实际显示效果更新
exports.screen_match_method_list = [
  {
    id: 1,
    val: 1,
    name: '比例缩放',
    type: 'contain',
    language_id: 0,
    explain: '按比例缩放，留黑边',
    eqval: 0,
  },
  {
    id: 2,
    val: 2,
    name: '拉伸',
    type: 'stretch',
    language_id: 0,
    explain: '拉伸全屏',
    eqval: 1,
  },
  {
    id: 3,
    val: 3,
    name: '截取',
    type: 'cover',
    language_id: 0,
    explain: '按比例缩放，截取部分图片',
    eqval: 2,
  },
];

exports.mode = [
  {
    name: 'foo',
    explain: 'bar',
    brief1: 'b',
    brief2: 'ar',
    mode: 0,
    secondsPerPunit: 10,
    punitsMax: 360,
    playlistDuration: 3600,
  },
  {
    name: '日租',
    explain: '每小时至少租 10 秒，每天播放 24 次',
    brief1: '/小时',
    brief2: '24次/天',
    mode: 1,
    eqPlayerMode: 0,
    secondsPerPunit: 10,
    punitsMax: 360,
    playlistDuration: 3600,
    playlistDurationMax: 3600,
  },
  {
    name: '日租模式二',
    explain: '按小时为单位时间段出租',
    brief1: 'b',
    brief2: 'ar',
    mode: 2,
    eqPlayerMode: 0,
    secondsPerPunit: 10,
    punitsMax: 360,
    playlistDuration: 3600,
    playlistDurationMax: 3600,
  },
  {
    name: '时租',
    explain: '至少租 5 秒，循环周期可设置，默认三分钟',
    // brief1: '/3分钟',
    // brief2: '20次/小时',
    mode: 3,
    eqPlayerMode: 1,
    secondsPerPunit: 5,
    playlistDurationMax: 1800,
    // punitsMax: 36,
    // playlistDuration: 180
  },
];

exports.defaultBasePrice = 1.0;

exports.defaultSLBCheck = '/slb/check';

exports.defaultSysInterest = 10; //默认系统分成比例 10%
exports.defaultSysInterestUserId = USER_ADMIN_ID; //默认系统分成用户
