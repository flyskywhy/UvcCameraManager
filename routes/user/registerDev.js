var co = require('co');
var utilx = require('../../lib/util.js');
var api = require('../../common/api.js');
var db = require('../../models/index.js');
var auth = require('../../common/auth.js');
var defines = require('../../common/Defines.js');
var devCtrl = require('../../common/devCtrl.js');
var currentUserId = require('../../common/currentUserId.js');
var registerKey = require('../../instances/config.js').device.registerKey;

var devStatus = defines.devStatus;
var moduleStatus = defines.moduleStatus;
var basePrice = defines.defaultBasePrice;
var sysInterest = defines.defaultSysInterest;
var sysInterestUserId = defines.defaultSysInterestUserId;

module.exports = (router) => {
  var statusesTbl = db.models.b_status;
  var userRoleTbl = db.models.b_user_role;
  var clientsTbl = db.models.c_client_list;
  var clientConfigTbl = db.models.c_client_config;
  var userInterestsTbl = db.models.b_user_interest;
  var virtualScreenTbl = db.models.b_virtual_screen;
  var clientOfflineTbl = db.models.c_client_offline;
  var clientAttributesTbl = db.models.c_client_attribute;
  var rentCountMode01Tbl = db.models.b_rent_count_mode_01;
  // var rentedCountMode01Tbl = db.models.b_rented_count_mode_01;
  var userInterestNextLevelTbl = db.models.b_user_interest_next_level;
  var virtualScreenUserRentTbl = db.models.b_virtual_screen_user_rent;
  var virtualScreenUserRent01Tbl = db.models.b_virtual_screen_user_rent_mode_01;

  //POST: /api/v0001/users/${userDbid}/managedDevices/devId/${devId}
  //Product_id = YID = devId
  //password = sign
  router.post(api.apiPath + api.registerDevPOST.path, registerDevice);

  function* _registerDevice(userId, params, body, t) {
    var res = {};
    var devId = params.devId;

    var findClient = yield clientAttributesTbl.findOne({
      where: {
        fpga_id: body.id2,
      },
      attributes: ['fpga_id', 'device_type'],
      include: [
        {
          model: clientsTbl,
          attributes: ['id', 'product_id', 'status', 'b_user_id'],
        },
      ],
      transaction: t,
    });

    if (
      findClient &&
      findClient.c_client_list.status === moduleStatus.clients.pending.val
    ) {
      throw new Error('registerDevPOST_3');
    }

    var b_client_id;
    var t_client = yield clientsTbl.create(
      {
        product_id: devId,
        status: 1,
        tdate: new Date(),
        b_user_id: userId,
      },
      {
        transaction: t,
      },
    );

    b_client_id = t_client.id;
    res.id = b_client_id;
    res.product_id = t_client.product_id;
    res.status = devStatus[t_client.status].name;
    res.id2 = body.id2;

    //无效设备
    if (findClient === null) {
      yield clientAttributesTbl.create(
        {
          c_client_list_id: b_client_id,
          password: body.sign,
          fpga_id: body.id2,
          b_phone_list_id: null,
          b_screen_classify_id: null,
          b_distribution_benefit_id: null,
          device_type: 'taobao',
        },
        {
          transaction: t,
        },
      );
    }
    //无效设备
    else if (
      findClient &&
      findClient.c_client_list.status === moduleStatus.clients.deleted.val
    ) {
      yield clientAttributesTbl.update(
        {
          c_client_list_id: b_client_id,
          password: body.sign,
          b_phone_list_id: null,
          b_screen_classify_id: null,
          b_distribution_benefit_id: null,
          device_type: 'taobao',
        },
        {
          where: {
            fpga_id: body.id2,
          },
          transaction: t,
        },
      );
    } else {
      throw new Error('registerDevPOST_4');
    }

    var Interest = 100;
    var interests = yield userInterestsTbl.create(
      {
        c_client_list_id: b_client_id,
        b_user_id: userId,
        punits: Interest,
        type: moduleStatus.userInterests.owner.val, //所有者 1
        fixed_amount: 0,
        is_next_level: 1, ////有下级
        status: 1,
      },
      {
        transaction: t,
      },
    );

    yield userInterestNextLevelTbl.create(
      {
        b_user_interest_id: interests.id,
        b_user_id: userId,
        type: moduleStatus.userInterests.owner.val, //所有者
        punits: Interest - sysInterest, // 减去默认系统分成比例
      },
      {
        transaction: t,
      },
    );

    yield userInterestNextLevelTbl.create(
      {
        b_user_interest_id: interests.id,
        b_user_id: sysInterestUserId,
        type: moduleStatus.userInterests.partner.val, //分成者
        punits: sysInterest, //默认系统分成比例
      },
      {
        transaction: t,
      },
    );

    yield userRoleTbl.findCreateFind({
      where: {
        b_user_id: userId,
        b_role_id: defines.User.Type.owner, //105 屏所有者
      },
      attributes: ['b_user_id'],
      transaction: t,
    });

    var modeId = 3; //模式3
    var punits = 36; //36为全部自用显示单元
    var shortRentPercent = 1; //短租比例，目前不考虑长租
    var shortRentPunits = Math.round((36 - punits) * shortRentPercent);
    var virtualScreen = yield virtualScreenTbl.create(
      {
        c_client_list_id: b_client_id,
        b_mode_id: modeId, //设置该虚拟屏的分享模式
        status: moduleStatus.virtualScreen.invalid.val, //无效
        cycle: 180, // seconds
      },
      {
        transaction: t,
      },
    );

    var vsDbid = virtualScreen.id;
    var time = new Date();
    var year = time.getFullYear();
    var month = time.getMonth();
    var day = time.getDate();
    var startTime = new Date(year, month, day);
    var shortRentTime = new Date();

    shortRentTime.setMonth(shortRentTime.getMonth() + 2);
    shortRentTime.setDate(1);
    shortRentTime.setHours(0);
    shortRentTime.setMinutes(0);
    shortRentTime.setSeconds(0, 0);
    shortRentTime.setYear(shortRentTime.getFullYear() + 100);

    var vsur = yield virtualScreenUserRentTbl.create(
      {
        b_virtual_screen_id: vsDbid,
        b_user_id: userId,
        type: 3, //自用
        status: null, //无效
        start_datetime: startTime,
        end_datetime: shortRentTime,
        published: 0, //默认未发布
      },
      {
        transaction: t,
      },
    );

    yield virtualScreenUserRent01Tbl.create(
      {
        b_virtual_screen_user_rent_id: vsur.id,
        punits: punits,
      },
      {
        transaction: t,
      },
    );

    yield rentCountMode01Tbl.create(
      {
        b_virtual_screen_id: vsDbid,
        type: 1, //短租
        status: 2, //无效
        start_datetime: startTime,
        end_datetime: shortRentTime,
        punits: shortRentPunits,
        price: basePrice,
      },
      {
        transaction: t,
      },
    );

    yield clientOfflineTbl.create(
      {
        c_client_list_id: b_client_id,
        status: defines.moduleStatus.rentSetting.valid.val,
        tdate: new Date(),
      },
      {
        transaction: t,
      },
    );

    // yield rentedCountMode01Tbl.create({
    //     'b_virtual_screen_id': vsDbid,
    //     'type': 1, //短租
    //     'status': defines.moduleStatus.rentedCountMode01.invalid.val, //无效
    //     'start_datetime': startTime,
    //     'end_datetime': shortRentTime,
    //     'start_time': '00:00:00',
    //     'end_time': '24:00:00',
    //     'punits': shortRentPunits
    // }, {
    //     transaction: t
    // });
    return res;
  }

  function* registerDevice() {
    if (this.errors) {
      this.errors[0].errCode = 'registerDevPOST_0';
      this.body = this.errors;
      this.status = 400;
      return;
    }
    var hasEncrypted = false;
    var body = this.request.body;
    if (!body.sign) {
      hasEncrypted = true;
      this.checkBody('key').notEmpty();
    }
    if (this.errors) {
      this.errors[0].errCode = 'registerDevPOST_1';
      this.body = this.errors;
      this.status = 400;
      return;
    }

    var params = this.params;
    var userId = yield currentUserId.apply(this);
    this.log.info(
      'registerDevPOST: From',
      this.request.host,
      'params: ',
      params,
      'body:',
      body,
    );

    if (hasEncrypted === true) {
      var encryptedId2 = body.key;

      var encId2 = utilx.md5(body.id2 + registerKey);
      if (encId2 !== encryptedId2) {
        this.body = [
          {
            errCode: 'registerDevPOST_2',
            error: 'Invalid id2',
          },
        ];
        this.status = 400;
        return;
      }
    }
    //TODO: 验证id2 sign
    //...
    yield db
      .transaction(function (t) {
        return co(_registerDevice(userId, params, body, t));
      })
      .then((res) => {
        this.body = res;
        this.status = 200;
      })
      .catch((err) => {
        this.log.error(err.toString());
        var errCode = api.apiErrParse(err.message, 'registerDevPOST');
        this.body = [
          {
            errCode: errCode,
            error: err.toString(),
          },
        ];
        this.status = 400;
      });

    return;
  }

  router.delete(api.apiPath + api.destroyDevDELETE.path, destroyDevice);

  function* destroyDevice() {
    var devId = this.params.devId;
    var user = yield auth.user(this);
    if (user === null) {
      this.body = [
        {
          errCode: 'destroyDevDELETE_0',
          userId: 'never login',
        },
      ];
      this.status = 400;
      return;
    }
    this.log.info(
      'destroyDevDELETE: From',
      this.request.host,
      'params: ',
      this.params,
    );

    var forced = 0; // 1- 强制清除关联关系
    try {
      if (this.query.forced) {
        forced = parseInt(this.query.forced, 10);
      }
      if (forced && user.role_name !== 'sysadmin') {
        throw new Error('destroyDevDELETE_1');
      }
    } catch (err) {
      this.body = [
        {
          errCode: api.apiErrParse(err.message, 'destroyDevDELETE'),
          error: err.toString(),
        },
      ];
      this.status = 400;
      return;
    }

    var cli = yield clientsTbl.findOne({
      where: {
        id: devId,
        status: moduleStatus.clients.normal.val,
      },
      attributes: ['b_user_id'],
    });
    if (cli && cli.b_user_id !== user.id && user.role_name !== 'sysadmin') {
      this.body = [
        {
          errCode: 'destroyDevDELETE_1',
          userId: 'invalid userId',
        },
      ];
      this.status = 400;
      return;
    }

    var res = yield devCtrl.destroyDev(devId, forced);
    if (res !== null) {
      this.body = res;
      this.status = 400;
      return;
    }

    this.body = {};
    this.status = 200;
    return;
  }

  //GET: /api/v0001/users/${userDbid}/managedDevices?perpage=100&page=1
  router.get(api.apiPath + api.deviceListGET.path, getDeviceList);

  function* getDeviceList() {
    this.checkQuery('perpage').notEmpty().isInt().toInt();
    this.checkQuery('page').notEmpty().isInt().toInt();
    if (this.errors) {
      this.errors[0].errCode = 'deviceListGET_0';
      this.body = this.errors;
      this.status = 400;
      return;
    }
    var perpage = 10;
    var page = 1;
    var sort = ['id', 'DESC'];
    var uid = this.params.userDbid;

    if (this.query.sort) {
      sort = this.query.sort;
    }
    if (this.query.perpage) {
      perpage = this.query.perpage;
    }
    if (this.query.page) {
      page = this.query.page;
    }

    try {
      var user = yield auth.user(this);
      if (user !== null) {
        uid = user.id;
        if (user.role_name === 'sysadmin') {
          uid = {
            $like: '%',
          };
        }
      }
      //}
    } catch (err) {
      this.log.error('______get uid error:_______' + err);
    }
    var conditions = {};

    if (this.query.status) {
      var status = this.query.status;
      conditions.status = status;
    } else {
      //默认返回 等待 和 正常
      conditions.status = {
        $in: moduleStatus.clients.normal.val,
      };
    }

    if (this.query.sn) {
      var sn = '%' + this.query.sn + '%';
      conditions.product_id = {
        $like: sn,
      };
    }

    var conditions_num = conditions;
    conditions_num.b_user_id = uid;

    var num = 0;
    if (page === 1) {
      num = yield clientsTbl.count({
        where: conditions_num,
      });
    }

    var ndata = yield clientsTbl.findAll({
      where: conditions_num,
      attributes: [['id', 'id1'], 'id', 'product_id', 'tdate', 'status'],
      limit: perpage,
      offset: (page - 1) * perpage,
      order: [['id', 'DESC'], 'product_id'],
      include: [
        {
          model: clientAttributesTbl,
        },
        {
          model: clientConfigTbl,
          attributes: ['name', 'location_image'],
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
            'b_mode_id',
            'match_method',
            'cycle',
          ],
        },
      ],
    });

    var len = ndata.length;
    var i1 = 0;
    var nstatus = yield statusesTbl.findAll({
      where: {
        b_status_main_id: 2,
        language_id: 0,
      },
      attributes: ['name', 'val'],
    });
    for (; i1 < len; ++i1) {
      ndata[i1].dataValues.id1 = i1 + 1;
      if (ndata[i1].dataValues.c_client_attribute !== null) {
        ndata[i1].dataValues.passward =
          ndata[i1].dataValues.c_client_attribute.dataValues.password;
      } else {
        ndata[i1].dataValues.passward = '-';
      }
      for (var i = 0; i < nstatus.length; i++) {
        if (nstatus[i].val === ndata[i1].dataValues.status) {
          ndata[i1].dataValues.status = nstatus[i].name;
          i = nstatus.length;
        }
      }
      ndata[i1].dataValues.active = yield devCtrl.getDevActiveStatus(
        ndata[i1].id,
      );
    }

    this.body = {
      num,
      ndata,
    };
  }
};
