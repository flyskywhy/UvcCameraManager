var sequelize = require('sequelize');
var api = require('../../common/api.js');
var db = require('../../models/index.js');
var auth = require('../../common/auth.js');
var log = require('../../instances/log.js');
var qrImage = require('../../common/qrimage');
var defines = require('../../common/Defines.js');

var mode = defines.mode;
var moduleStatus = defines.moduleStatus;

module.exports = (router) => {
  var usersTbl = db.models.b_user;
  var statusTbl = db.models.b_status;
  var rentModeTbl = db.models.b_mode;
  var userRoleTbl = db.models.b_user_role;
  var screenLedTbl = db.models.b_screen_led;
  var clientListTbl = db.models.c_client_list;
  var playerListTbl = db.models.b_player_list;
  var statusMainTbl = db.models.b_status_main;
  var modouleListTbl = db.models.b_module_list;
  var rentSettingTbl = db.models.b_rent_setting;
  var locationTypeTbl = db.models.b_location_type;
  var userInterestTbl = db.models.b_user_interest;
  var clientConfigTbl = db.models.c_client_config;
  var clientAttrTbl = db.models.c_client_attribute;
  var virtualScreenTbl = db.models.b_virtual_screen;
  var screenMatchMethodTbl = db.models.b_screen_match_method;
  // var rentedCountMode01Tbl = db.models.b_rented_count_mode_01;
  var rentCountMode01Tbl = db.models.b_rent_count_mode_01;
  var clientLocationTypeTbl = db.models.c_client_location_type;
  var virtualScreenUserRentTbl = db.models.b_virtual_screen_user_rent;
  var userInterestNextLevelTbl = db.models.b_user_interest_next_level;
  var virtualScreenUserRent01Tbl = db.models.b_virtual_screen_user_rent_mode_01;

  //用户获得设备所有配置信息
  router.get(api.apiPath + api.devCfgGET.path, function* () {
    this.checkParams('devDbid').notEmpty().toInt();
    if (this.errors) {
      this.body = this.errors;
      this.status = 400;
      return;
    }

    //用户通过devDbId得到模组型号,分辨率,地址,名称,播放器ID
    var devDbid = this.params.devDbid;
    var clientConfig = yield clientConfigTbl.findById(devDbid, {
      attributes: {
        include: [
          [sequelize.col('match_method'), 'match_method'],
          [sequelize.col('b_mode_id'), 'b_mode_id'],
          [sequelize.col('cycle'), 'cycle'],
        ],
        exclude: [
          'program_file',
          'display_file',
          'addr_file',
          'hardware_file',
          'server_url',
          'spare_url',
          'manage_url',
          'file_url',
          'is_tcpip',
          'key',
          'coordinate',
        ],
      },
      include: [
        {
          model: screenLedTbl,
          attributes: ['b_module_list_id'],
        },
        {
          model: clientListTbl,
          attributes: ['id'],
          include: [
            {
              model: virtualScreenTbl,
              attributes: ['id', 'refund_per'],
            },
          ],
        },
      ],
    });
    if (clientConfig === null) {
      this.body = {};
      return;
    }

    clientConfig.dataValues.disp_mode_id = 1; //'全屏';

    var labelSelected = yield clientLocationTypeTbl.findAll({
      where: {
        c_client_list_id: devDbid,
      },
      attributes: [['b_location_type_id', 'id']],
    });
    clientConfig.dataValues.labels = labelSelected;

    this.body = clientConfig;
    return;
  });

  // 查询设备配置选项列表
  router.get(api.apiPath + api.devCfgParamsGET.path, function* () {
    var body = {};
    var moduleLists = yield modouleListTbl.findAll({
      attributes: ['id', 'module_name', 'width', 'height'],
    });

    if (!moduleLists.length) {
      this.body = [
        {
          errCode: 'devCfgParamsGET_0',
          moduleLists: 'modouleListTbl is not exist',
        },
      ];
      this.status = 400;
      return;
    }

    var playerLists = yield playerListTbl.findAll({
      where: {
        player_name: {
          $ne: '诣阔',
        },
      },
      attributes: ['id', 'player_name'],
    });

    if (!playerLists.length) {
      this.body = [
        {
          errCode: 'devCfgParamsGET_1',
          playerListTbl: 'playerListTbl is not exist',
        },
      ];
      this.status = 400;
      return;
    }

    var labelLists = yield locationTypeTbl.findAll({
      attributes: ['id', 'name'],
    });

    if (!labelLists.length) {
      this.body = [
        {
          errCode: 'devCfgParamsGET_2',
          locationTypeTbl: 'locationTypeTbl is not exist',
        },
      ];
      this.status = 400;
      return;
    }

    var matchMethods = yield screenMatchMethodTbl.findAll({
      attributes: {
        exclude: ['language_id'],
      },
    });

    if (!matchMethods.length) {
      log.warn('match method is not exist');
      matchMethods = [
        {
          id: 1,
          val: 1,
          name: '全屏',
        },
      ];
    }

    //没有数据库，暂时内部处理
    var displayModes = [
      {
        id: 1,
        mode_name: '全屏',
        mode_desc: '全屏分享',
      },
      {
        id: 2,
        mode_name: '左右',
        mode_desc: '左右分享',
      },
      {
        id: 3,
        mode_name: '上下',
        mode_desc: '上下分享',
      },
    ];

    body.moduleLists = moduleLists;
    body.playerLists = playerLists;
    body.labelLists = labelLists;
    body.dispModeLists = displayModes;
    body.matchMethods = matchMethods;
    body.cycle = defines.screen_pb_cycle_list;
    body.offlineModes = defines.devCfgParams.offlineModes;
    body.updateCircleTypes = moduleStatus.rentSettingCircleType;
    this.body = body;
    return;
  });

  router.put(api.apiPath + api.devCfgPUT.path, function* () {
    var devDbid = parseInt(this.params.devDbid);

    var body = this.request.body;
    var lng = body.lng;
    var lat = body.lat;
    var name = body.name;
    var city = body.city;
    var width = body.width;
    var height = body.height;
    var labels = body.labels;
    var province = body.province;
    var district = body.district;
    var location = body.location;
    var module_id = body.module_id;
    var player_id = body.player_id;
    var match_method = body.match_method;
    var location_image = body.location_image;
    var cycle = parseInt(body.cycle, 10);
    var mode_id = null;
    var offLineMode = parseInt(body.offLineMode, 10);

    var physical_height = body.physical_height;
    var physical_width = body.physical_width;
    var flowrate = body.flowrate;

    if (body.mode_id) {
      mode_id = body.mode_id;
    }

    this.log.info(
      'devCfgPUT: From ',
      this.request.host,
      'params:',
      this.params,
      'body:',
      body,
    );

    var userDbid;
    var cond_cl = {
      id: devDbid,
      status: {
        $in: moduleStatus.clients.normal.val,
      },
    };
    var isAdmin = false;
    var user = yield auth.user(this);
    if (user !== null) {
      if (user.role_name !== 'sysadmin') {
        userDbid = user.id;
        cond_cl.b_user_id = userDbid;
      } else {
        isAdmin = true;
      }
    } else {
      this.body = [
        {
          errCode: 'systemUnkownError',
        },
      ];
      this.status = 400;
      return;
    }

    var client = yield clientListTbl.findOne({
      attributes: ['id', 'status', 'b_user_id'],
      where: cond_cl,
      include: [
        {
          model: clientAttrTbl,
          attributes: ['device_type'],
          required: true,
        },
        {
          model: virtualScreenTbl,
          attributes: [
            'id',
            'x0',
            'y0',
            'width',
            'height',
            'status',
            'tdate',
            'coefficient',
            'b_mode_id',
            'match_method',
            'cycle',
          ],
          required: true,
        },
      ],
    });
    if (client === null) {
      this.body = [
        {
          errCode: 'devCfgPUT_0',
          devDbid: 'Invalid devDbid',
        },
      ];
      this.status = 400;
      return;
    }
    if (isAdmin) {
      userDbid = client.b_user_id;
    }

    var cond = {
      c_client_list_id: devDbid,
    };

    if (client.status === moduleStatus.clients.pending.val) {
      cond.sys_interest = defines.defaultSysInterest;
    }

    if (width) {
      cond.width = width;
    }

    if (height) {
      cond.height = height;
    }

    if (player_id) {
      cond.b_player_list_id = player_id;
    }

    if (name) {
      cond.name = name;
    }

    if (province) {
      cond.province = province;
    }

    if (city) {
      cond.city = city;
    }

    if (district) {
      cond.district = district;
    }

    if (location) {
      cond.location = location;
    }

    if (location_image) {
      cond.location_image = JSON.stringify(location_image);
    } else {
      cond.location_image = '2/headimage/icon.jpg'; // TODO: 根据 moduleId 获取代理商的 LOGO
    }

    if (lng) {
      cond.lng = lng;
    }

    if (lat) {
      cond.lat = lat;
    }

    if (physical_height) {
      cond.physical_height = physical_height;
    }

    if (physical_width) {
      cond.physical_width = physical_width;
    }

    if (flowrate) {
      cond.flowrate = flowrate;
    }

    if (!isNaN(offLineMode)) {
      cond.offLineMode = offLineMode;
    }

    var t = yield db.transaction();
    try {
      if (module_id && width && height) {
        var screenLed = yield screenLedTbl.findCreateFind({
          where: {
            width: width,
            height: height,
            b_module_list_id: module_id,
          },
          transaction: t,
        });
        cond.b_screen_led_id = screenLed[0].id;
      }
      yield clientConfigTbl.upsert(cond, {
        transaction: t,
      });

      if (!labels) {
        labels = [];
      }

      for (var label of labels) {
        if (label.selected) {
          clientLocationTypeTbl.findCreateFind({
            attributes: ['c_client_list_id'],
            where: {
              c_client_list_id: devDbid,
              b_location_type_id: label.id,
            },
            transaction: t,
          });
        } else {
          clientLocationTypeTbl.destroy({
            where: {
              c_client_list_id: devDbid,
              b_location_type_id: label.id,
            },
            transaction: t,
          });
        }
      }

      var virtualScreen = client.b_virtual_screens[0];
      var virtualScreenData = {
        x0: 0,
        y0: 0,
        status: moduleStatus.virtualScreen.valid.val, // 1
        tdate: new Date(),
        coefficient: 1,
      };

      if (mode_id) {
        virtualScreenData.b_mode_id = mode_id;
      } else {
        virtualScreenData.b_mode_id = virtualScreen.b_mode_id;
      }

      if (width) {
        virtualScreenData.width = width;
      }

      if (height) {
        virtualScreenData.height = height;
      }

      if (match_method) {
        virtualScreenData.match_method = match_method;
      }

      yield virtualScreenTbl.update(virtualScreenData, {
        where: {
          c_client_list_id: devDbid,
        },
        transaction: t,
      });

      if (!cycle) {
        cycle = virtualScreen.cycle;
      }
      virtualScreenData.cycle = virtualScreen.cycle;
      virtualScreenData.id = virtualScreen.id;

      this.body = {};
      this.status = 200;

      yield t.commit();
    } catch (e) {
      log.error(' device config err:', e.toString());
      yield t.rollback();
      this.body = [
        {
          errCode: api.apiErrParse(e.message, 'devCfgPUT'),
          error: e.toString(),
        },
      ];
      this.status = 400;
      return;
    }
  });

  //7.1.列表形式表达设备所有相关子利益分成   //by zcm 20160623
  router.get(
    '/api/v0001/devices/:devDbid/interests/:userInterestDbid',
    function* () {
      this.checkParams('devDbid').notEmpty().toInt();
      this.checkParams('userInterestDbid').notEmpty().toInt();
      if (this.errors) {
        this.body = this.errors;
        this.status = 400;
        return;
      }

      // var devDbid = parseInt(this.params.devDbid, 10);
      var usDbid = parseInt(this.query.userInterestDbid, 10);

      var ndata = yield userInterestNextLevelTbl.findAll({
        where: {
          b_user_interest_id: usDbid,
        },
        include: [
          {
            model: usersTbl,
            attributes: ['name', 'phone'],
          },
        ],
      });
      this.body = ndata;
    },
  );

  //7.2.列表形式表达设备所有顶层利益分成   //by zcm 20160623
  router.get('/api/v0001/devices/:devDbid/topInterest', function* () {
    this.checkParams('devDbid').notEmpty().toInt();
    if (this.errors) {
      this.body = this.errors;
      this.status = 400;
      return;
    }

    var devDbid = parseInt(this.params.devDbid, 10);

    var ndata = yield userInterestTbl.findAll({
      where: {
        c_client_list_id: devDbid,
      },
      include: [
        {
          model: usersTbl,
          attributes: ['name', 'phone'],
        },
        {
          model: userInterestNextLevelTbl,
          include: [
            {
              model: usersTbl,
              attributes: ['name', 'phone'],
            },
          ],
        },
      ],
    });
    this.body = ndata;
  });

  //8.查询设备相关的显示信息
  router.get('/api/v0001/devices/:devDbid/displays', function* () {
    this.checkParams('devDbid').notEmpty().toInt();
    if (this.errors) {
      this.body = this.errors;
      this.status = 400;
      return;
    }

    var virtualScreens = yield clientListTbl.findOne({
      include: [
        {
          model: virtualScreenTbl,
          attributes: ['id', 'x0', 'y0', 'width', 'height'],
        },
        {
          model: clientConfigTbl,
          attributes: ['name'],
        },
        {
          model: userInterestTbl, //////用在哪？暂不修改
          attributes: ['type', 'punits'],
        },
      ],
      where: {
        id: this.params.devDbid,
        status: {
          $ne: 2,
        },
      },
      attributes: ['product_id'],
    });

    this.body = virtualScreens;
    this.status = 200;
  });
  //8.查询关联类型
  router.get('/api/v0001/params/roleList', function* () {
    var statusMain = yield statusMainTbl.findOne({
      attributes: ['id'],
      where: {
        name: '关联类型',
      },
    });

    if (statusMain === null) {
      this.body = [
        {
          statusMainTbl: 'statusMainTbl is not exist',
        },
      ];
      this.status = 400;
      return;
    }

    var status = yield statusTbl.findAll({
      where: {
        b_status_main_id: statusMain.id,
      },
      attributes: ['val', 'name'],
    });

    this.body = status;
    this.status = 200;
  });

  //8.通过virtualScreenDbId查询自用punits
  //GET '/api/v0001/devices/:vsDbId/ownerPunits'
  router.get(api.apiPath + api.devOwnerPunitGet.path, function* () {
    var vsDbId = this.params.vsDbid;
    var vsInfo = yield virtualScreenTbl.findOne({
      include: [
        {
          model: clientListTbl,
          attributes: ['id', 'b_user_id'],
          required: true,
        },
      ],
      where: {
        id: vsDbId,
      },
      attributes: ['b_mode_id', 'cycle', 'match_method', 'rentTimeUnit'],
    });

    var cl = vsInfo.c_client_list;
    if (
      vsInfo.b_mode_id === 1 ||
      vsInfo.b_mode_id === 3 ||
      vsInfo.b_mode_id === 4
    ) {
      var rs = yield rentSettingTbl.findAll({
        where: {
          b_virtual_screen_id: vsDbId,
          status: defines.moduleStatus.rentSetting.valid.val,
        },
        attributes: [
          'circle_type',
          'start_time',
          'end_time',
          'val',
          'punits',
          'rentable_punits',
          'max_punits',
          'price',
          'owner_price',
          'type',
        ],
      });
      this.body = {
        b_user_id: cl.b_user_id,
        modeId: vsInfo.b_mode_id,
        cycle: vsInfo.cycle,
        match_method: vsInfo.match_method,
        punits: rs[0].punits,
        price: rs[0].owner_price,
        rent_price: rs[0].price,
        secondsPerPunit: defines.mode[vsInfo.b_mode_id].secondsPerPunit,
        rentSetting: rs,
        rentTimeUnit: vsInfo.rentTimeUnit,
      };
    } else {
      log.error('不支持的业务模式');
      this.body = [
        {
          errCode: 'devOwnerPunitGet_0',
          params: 'bad request',
        },
      ];
      this.status = 400;
    }

    return;
  });

  //8.通过virtualScreenDbId设置修改自用punits
  // PUT '/api/v0001/devices/:vsDbid/ownerPunits'
  router.put(api.apiPath + api.devOwnerPunitPUT.path, function* () {
    this.checkBody('punits').toInt();
    this.checkBody('phone').notEmpty();
    this.checkBody('price').notEmpty();
    this.checkBody('modeId').notEmpty().toInt();
    this.checkParams('vsDbid').notEmpty().toInt();
    this.checkBody('businessHours').notEmpty();
    this.checkBody('circleType').notEmpty().toInt();
    if (this.errors && !business_hours.length) {
      this.errors[0].errCode = 'devOwnerPunitPUT_0';
      this.status = 400;
      this.body = this.errors;
      return;
    }

    var body = this.request.body;
    var vsDbid = this.params.vsDbid;
    var price = body.price;
    var phone = body.phone;
    var modeId = body.modeId;
    var punits = body.punits;
    var circle_type = body.circleType;
    var business_hours = body.businessHours;
    var rentTimeUnit = body.rentTimeUnit || 0;

    if (modeId !== 1 && modeId !== 3 && modeId !== 4) {
      this.body = [
        {
          errCode: 'devOwnerPunitPUT_1',
          ModeId: 'invalid ModeId!',
        },
      ];
      this.status = 400;
      return;
    }

    this.log.info(
      'devOwnerPunitPUT: From ',
      this.request.host,
      'params:',
      this.params,
      'body:',
      body,
    );

    var vscreen = yield virtualScreenTbl.findOne({
      where: {
        status: moduleStatus.virtualScreen.valid.val, // 1
        id: vsDbid,
      },
      attributes: {
        include: [
          [sequelize.col('fpga_id'), 'id2'],
          [sequelize.col('sys_interest'), 'sys_interest'],
        ],
      },
      include: [
        {
          model: clientListTbl,
          where: {
            status: moduleStatus.clients.valid.val, // 0
          },
          attributes: ['id', 'b_user_id'],
          include: [
            {
              model: clientAttrTbl,
              attributes: [],
            },
            {
              model: clientConfigTbl,
              attributes: [],
            },
          ],
        },
      ],
    });
    //判断屏幕存在并已配置
    if (!vscreen) {
      log.error(' set Owner Punits for Invalid vsDbid ', vsDbid);
      this.body = [
        {
          errCode: 'devOwnerPunitPUT_2',
          error: 'Invalid vsDbid',
        },
      ];
      this.status = 400;
      return;
    }

    var interests = yield userInterestTbl.findOne({
      where: {
        c_client_list_id: vscreen.c_client_list.id,
        type: moduleStatus.userInterests.owner.val, //所有者 1
        is_next_level: 1, ////有下级
      },
      include: [
        {
          model: userInterestNextLevelTbl,
          where: {
            b_user_id: defines.defaultSysInterestUserId,
            type: moduleStatus.userInterests.partner.val, //分成者
          },
          attributes: ['punits'],
        },
      ],
      attributes: ['id'],
    });

    if (!interests) {
      log.error('没有设置用户分成比例', vsDbid);
      this.body = [
        {
          errCode: 'devOwnerPunitPUT_7',
          error: '没有设置用户分成比例',
        },
      ];
      this.status = 400;
      return;
    }
    var sysInterest = interests.b_user_interest_next_levels[0].punits;
    var ownerInterest = (100 - sysInterest) / 100; // 减去默认系统分成比例
    var owner_price = price;
    var rent_price = Math.ceil((price * 100) / ownerInterest) / 100;

    var max_punits;
    if (modeId === 3 || modeId === 4) {
      max_punits = vscreen.cycle / mode[modeId].secondsPerPunit;
    } else {
      max_punits = mode[modeId].punitsMax;
    }
    //判断punits值合法
    if (punits > max_punits) {
      this.body = [
        {
          errCode: 'devOwnerPunitPUT_3',
          ModeId: 'invalid punits!',
        },
      ];
      this.status = 400;
      return;
    }

    var userId;
    var user = yield auth.user(this);
    if (user && user.role_name === 'sysadmin') {
      userId = vscreen.c_client_list.b_user_id;
    } else {
      var u = yield usersTbl.findOne({
        where: {
          phone: phone,
        },
        attributes: ['id'],
      });
      //判断user合法
      if (u === null) {
        this.body = [
          {
            errCode: 'devOwnerPunitPUT_4',
            user: 'invalid user!',
          },
        ];
        this.status = 400;
        return;
      }
      userId = u.id;
    }

    var now = new Date();
    var rentSetting = [];
    if (business_hours) {
      var bh = business_hours;
      if (bh) {
        for (var i = 0; i < bh.length; i++) {
          var data = {
            b_virtual_screen_id: vsDbid,
            circle_type: circle_type,
            rdate: now,
            status: moduleStatus.rentSetting.valid.val,
            punits: punits,
            max_punits: max_punits,
            rentable_punits: max_punits - punits,
            price: rent_price,
            owner_price: owner_price,
          };
          var b = bh[i];
          if (b.start_time) {
            data.start_time = b.start_time;
          }
          if (b.end_time) {
            data.end_time = b.end_time;
          }
          if (b.val) {
            data.val = b.val;
          }
          // 暂不支持
          // if (b.punits) { //self punits
          //     data.punits = b.punits;
          // }
          // if (b.rentable_punits) {
          //     data.rentable_punits = b.rentable_punits;
          // }
          // 暂不支持
          // if (b.price) {
          //     data.price = b.price;
          // }
          if (b.type) {
            data.type = b.type;
          }

          if (data.start_time >= data.end_time) {
            this.body = [
              {
                errCode: 'devOwnerPunitPUT_6',
                user: 'invalid time!',
              },
            ];
            this.status = 400;
            return;
          }
          for (var rs of rentSetting) {
            //开关机时间重合
            if (
              data.start_time >= data.end_time ||
              (data.start_time < rs.end_time && data.end_time > rs.start_time)
            ) {
              this.body = [
                {
                  errCode: 'devOwnerPunitPUT_6',
                  user: 'invalid time!',
                },
              ];
              this.status = 400;
              return;
            }
          }
          rentSetting.push(data);
        }
      }
    }

    var t = yield db.transaction();
    try {
      if (vscreen.rentTimeUnit !== rentTimeUnit) {
        vscreen.rentTimeUnit = rentTimeUnit;
        yield vscreen.save({
          transaction: t,
        });
      }
      if (!vscreen.qr_image) {
        // need create qr_image
        vscreen.qr_image = yield qrImage.putQrImage(
          vscreen.id,
          vscreen.dataValues.id2,
        );
        log.debug(
          '>>> upload qr image of vs:',
          vscreen.id,
          ', ',
          vscreen.qr_image,
        );
        yield vscreen.save({
          transaction: t,
        });
      }

      //添加owner
      yield userRoleTbl.findCreateFind({
        where: {
          b_user_id: userId,
          b_role_id: 105, // 屏所有者
        },
        attributes: ['b_user_id'],
        transaction: t,
      });

      //更改分享模式，还不完善
      yield virtualScreenTbl.update(
        {
          b_mode_id: modeId,
        },
        {
          where: {
            id: vsDbid,
          },
          transaction: t,
        },
      );

      if (vscreen.c_client_list.b_user_id !== userId) {
        vscreen.c_client_list.b_user_id = userId;
        yield vscreen.c_client_list.save({
          transaction: t,
        });
      }
      var org_punits = yield rentSettingTbl.findOne({
        where: {
          b_virtual_screen_id: vsDbid,
          status: defines.moduleStatus.rentSetting.valid.val,
        },
        attributes: ['punits'],
        transaction: t,
      });

      // var rcm01 = yield rentCountedMode01Tbl.findAll({
      //     where: {
      //         'b_virtual_screen_id': vsDbid,
      //         //'type': 1, //短租
      //         'end_datetime': {
      //             '$gte': new Date()
      //         },
      //     },
      //     attributes: ['id', 'punits'],
      //     transaction: t,
      //     lock: t.LOCK.UPDATE
      // });

      var cfgDate = new Date();
      cfgDate.setMinutes(0);
      cfgDate.setSeconds(0, 0);
      var rent01s = yield virtualScreenUserRent01Tbl.findAll({
        include: [
          {
            model: virtualScreenUserRentTbl,
            where: {
              status: {
                $in: moduleStatus.screenUserRent.normal.val, // [0, 1]
              },
              b_virtual_screen_id: vsDbid,
              b_user_id: {
                $ne: userId,
              },
              end_datetime: {
                $gt: cfgDate,
              },
            },
          },
        ],
        transaction: t,
      });

      if (rent01s.length > 0) {
        var vsur01Punits = org_punits.punits; //原自用Punits
        //自用调少，直接调整
        //自用调多，分两种情况,
        if (punits > vsur01Punits) {
          var rentable_punits = max_punits - punits;
          for (var i = 0; i < rent01s.length; i++) {
            if (rent01s[i].punits > rentable_punits) {
              break;
            }
          }
          if (i !== rent01s.length) {
            //&& !isForce) {
            log.error('已有订单，且已不能满足当前的自用punit修改');
            throw new Error('devOwnerPunitPUT_5');
          }
        }
      }

      var startTime = new Date();
      startTime.setHours(0);
      startTime.setMinutes(0);
      startTime.setSeconds(0, 0);

      var endTime = new Date();
      var shortRentTime = new Date();
      shortRentTime.setMonth(shortRentTime.getMonth() + 2);
      shortRentTime.setDate(1);
      shortRentTime.setHours(0);
      shortRentTime.setMinutes(0);
      shortRentTime.setSeconds(0, 0);
      // shortRentTime.setSeconds(shortRentTime.getSeconds() - 1);
      shortRentTime.setYear(endTime.getFullYear() + 100);
      endTime.setYear(endTime.getFullYear() + 100);

      var price01 = rent_price;

      var vsur01 = yield virtualScreenUserRent01Tbl.findOne({
        include: [
          {
            model: virtualScreenUserRentTbl,
            where: {
              b_virtual_screen_id: vsDbid,
              type: 3, //自用
            },
          },
        ],
        attributes: ['b_virtual_screen_user_rent_id', 'punits'],
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      var vsur01Punits = vsur01.punits;
      var rcm01 = yield rentCountMode01Tbl.findAll({
        where: {
          b_virtual_screen_id: vsDbid,
          //'type': 1, //短租
          end_datetime: {
            $gte: new Date(),
          },
        },
        attributes: ['id', 'punits', 'price'],
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      //自用调少
      if (punits <= vsur01Punits) {
        var rentPunits = vsur01Punits - punits;
        for (var i = 0; i < rcm01.length; i++) {
          rcm01[i].punits += rentPunits;
          this.log.debug('case 1: punits ', rcm01[i].punits);
          rcm01[i].price = price01;
          yield rcm01[i].save({
            transaction: t,
          });
        }
      } //自用调多，分两种情况,
      else if (punits > vsur01Punits) {
        var rentPunits = punits - vsur01Punits;
        for (var i = 0; i < rcm01.length; i++) {
          if (rcm01[i].punits < rentPunits) {
            break;
          }
        }

        if (i === rcm01.length) {
          //|| isForce) {
          for (var ii = 0; ii < rcm01.length; ii++) {
            rcm01[ii].punits -= rentPunits;
            log.debug('case 2:', rcm01[ii].punits);
            rcm01[ii].price = price01;
            yield rcm01[ii].save({
              transaction: t,
            });
          }
        } else {
          log.error('已有订单，且已不能满足当前的自用punit修改!');
          throw new Error('devOwnerPunitPUT_5');
        }
      }

      vsur01.punits = punits;
      yield vsur01.save({
        transaction: t,
      });

      yield rentSettingTbl.update(
        {
          status: defines.moduleStatus.rentSetting.invalid.val,
        },
        {
          where: {
            b_virtual_screen_id: vsDbid,
            status: defines.moduleStatus.rentSetting.valid.val,
          },
          transaction: t,
        },
      );

      yield rentSettingTbl.bulkCreate(rentSetting, {
        transaction: t,
      });

      var ur = yield virtualScreenUserRentTbl.findOne({
        where: {
          b_virtual_screen_id: vsDbid,
          status: 1,
          type: 3,
        },
        transaction: t,
      });

      yield virtualScreenUserRent01Tbl.update(
        {
          punits: rentSetting[0].punits,
        },
        {
          where: {
            b_virtual_screen_user_rent_id: ur.id,
          },
          transaction: t,
        },
      );

      yield t.commit();
    } catch (e) {
      yield t.rollback();
      this.body = [
        {
          errCode: api.apiErrParse(e.message, 'devOwnerPunitPUT'),
          error: e.toString(),
        },
      ];
      this.status = 400;
      return;
    }

    this.body = {};
    this.status = 200;
  });

  ////by zcm 2016/6/23
  router.delete('/api/v0001/devices/:usrInterestDbid', function* () {
    this.checkParams('usrInterestDbid').notEmpty().toInt();
    if (this.errors) {
      this.status = 400;
      this.body = this.errors;
      return;
    }

    var usrInterestDbid = this.params.usrInterestDbid;
    var users = yield userInterestNextLevelTbl.findOne({
      where: {
        id: usrInterestDbid,
      },
      attributes: ['id'],
    });

    if (users === null) {
      this.body = [
        {
          usrInterestDbid: 'invalid usrInterestDbid!',
        },
      ];
      this.status = 400;
      return;
    }

    try {
      yield users.destroy();
    } catch (err) {
      //删除失败
      this.body = [
        {
          users: 'Delete failed!',
        },
      ];
      this.status = 400;
      return;
    }

    this.status = 200;
    return;
  });

  router.get('/api/v0001/params/rentMode', function* () {
    var rentModes = yield rentModeTbl.findAll();

    if (!rentModes.length) {
      this.body = [
        {
          rentModes: 'rentModes.length = 0!',
        },
      ];
      this.status = 400;
      return;
    }

    this.body = rentModes;
    return;
  });
};
