var co = require('co');
var db = require('../models/index.js');
var log = require('../instances/log.js');
var pluck = require('arr-pluck');
var moduleStatus = require('./Defines.js').moduleStatus;
var mode = require('./Defines.js').mode;
var api = require('./api.js');
var defines = require('./Defines');

var clientsTbl = db.models.c_client_list;
var rentSettingTbl = db.models.b_rent_setting;
var clientAttributesTbl = db.models.c_client_attribute;
var clientConfigTbl = db.models.c_client_config;
var virtualScreenTbl = db.models.b_virtual_screen;
var programPreComposesTbl = db.models.b_program_precompose;
var clientPlaytimeTbl = db.models.c_client_playtime;
var screenUserRentTbl = db.models.b_virtual_screen_user_rent;
var VirtualScreenGroups = db.models.b_virtual_screen_group;
var rentCountMode01Tbl = db.models.b_rent_count_mode_01;

function* _destroyDevice(devId, forced, c_client_list, t) {
  var curtime = new Date();
  // 判断是否有用户已租用
  var rented = yield screenUserRentTbl.findAll({
    where: {
      status: {
        $in: [0, 1], //0为等待，1为有效，9为删除
      },
      end_datetime: {
        $gt: curtime,
      },
    },
    attributes: ['id', 'b_virtual_screen_id', 'type', 'status'],
    include: [
      {
        model: virtualScreenTbl,
        where: {
          c_client_list_id: c_client_list.id,
          status: 1,
        },
        attributes: ['c_client_list_id'],
      },
    ],
    transaction: t,
  });

  var vs = yield virtualScreenTbl.findAll({
    where: {
      c_client_list_id: devId,
      status: 1,
    },
    transaction: t,
  });

  var vsIds = pluck(vs, 'id');
  // 找到已经租用设备的用户,消息通知，退款结算
  if (forced) {
    if (vsIds.length > 0) {
      yield VirtualScreenGroups.destroy({
        where: {
          b_virtual_screen_id: {
            $in: vsIds,
          },
        },
        transaction: t,
      });
    }
  }

  for (var i = 0; i < rented.length; i++) {
    if (rented[i].type === 2 || rented[i].type === 1) {
      // 租用
      if (!forced) {
        log.debug('been rented:' + JSON.stringify(rented));
        var error = 'destroyDevDELETE_3';

        return error;
      } else {
        if (rented[i].status === 1) {
          rented[i].status = 4; //退款结算
          yield rented[i].save({
            transaction: t,
          });
        }
      }
    }
  }

  for (var i = 0; i < rented.length; i++) {
    if (rented[i].type === 3) {
      // 自用
      rented[i].status = 9;
      yield rented[i].save({
        transaction: t,
      });
    }
  }

  c_client_list.status = 2;
  c_client_list.remove_date = new Date();

  yield c_client_list.save({
    transaction: t,
  });

  for (var i = 0; i < vs.length; i++) {
    vs[i].status = 2;
    yield vs[i].save({
      transaction: t,
    });
    yield rentCountMode01Tbl.update(
      {
        status: 2,
      },
      {
        where: {
          b_virtual_screen_id: vs[i].id,
        },
        transaction: t,
      },
    );
    yield rentSettingTbl.update(
      {
        status: moduleStatus.rentSetting.invalid.val,
      },
      {
        where: {
          b_virtual_screen_id: vs[i].id,
        },
        transaction: t,
      },
    );
  }

  yield programPreComposesTbl.update(
    {
      status: defines.moduleStatus.preCompose.deleted.val,
      rdate: curtime,
    },
    {
      where: {
        c_client_list_id: devId,
      },
      transaction: t,
    },
  );

  /* update playtime of clients */
  yield clientPlaytimeTbl.update(
    {
      endtime: curtime,
    },
    {
      where: {
        c_client_list_id: devId,
      },
      transaction: t,
    },
  );

  return null;
}

var destroyDev = function* (devId, forced) {
  var client = yield clientsTbl.findOne({
    where: {
      id: devId,
      status: {
        $ne: 2,
      },
    },
  });
  if (client === null) {
    return [
      {
        errCode: 'destroyDevDELETE_2',
        devId: 'invalid devId',
      },
    ];
  }

  var res = yield db
    .transaction(function (t) {
      return co(_destroyDevice(devId, forced, client, t));
    })
    .catch(function (err) {
      log.debug(err);
      return api.apiErrParse(err.message, 'destroyDevDELETE');
    });

  if (res !== null) {
    return [
      {
        errCode: res,
        error: res,
      },
    ];
  }

  return null;
};

// API used @yoc 5.5
var updateYid = function* (id2, yid) {
  var clientAttr = yield findId2(id2);
  if (clientAttr) {
    return clientAttr;
  }

  clientAttr.c_client_list.product_id = yid;
  yield clientAttr.c_client_list.save();

  return null;
};

// add for yoc-5.6
var findId2 = function* (id2) {
  var clientAttr = yield clientAttributesTbl.findOne({
    include: {
      model: clientsTbl,
      where: {
        status: 0,
      },
    },
    where: {
      fpga_id: id2,
    },
  });

  if (clientAttr === null) {
    return [
      {
        id2: 'invalid id2',
      },
    ];
  }

  return null;
};

var findDevById2 = function* (id2) {
  var client = yield clientsTbl.findOne({
    where: {
      status: 0,
    },
    include: [
      {
        model: clientAttributesTbl,
        where: {
          fpga_id: id2,
        },
        attributes: ['fpga_id'],
      },
      {
        model: clientConfigTbl,
        attributes: ['hardware_file', 'b_player_list_id'],
      },
    ],
  });

  return client;
};

function* getDevActiveStatus(devDbid) {
  var clientActiveLogTbl = db.models.c_client_active_log;
  var ret = {
    status: 1,
  };
  var dev = yield clientActiveLogTbl.findOne({
    where: {
      c_client_list_id: devDbid,
      edate: null,
    },
  });

  if (!dev) {
    ret.status = 0;
    var offdev = yield clientActiveLogTbl.findAll({
      where: {
        c_client_list_id: devDbid,
      },
      order: [['edate', 'DESC']],
    });

    if (offdev.length) {
      ret.offlineTime = offdev[0].edate;
    } else {
      ret.offlineTime = null;
    }
  }

  return ret;
}

function* initScreenMaxPunits() {
  var sequelize = require('sequelize');

  var initDate = new Date();
  initDate.setMinutes(0);
  initDate.setSeconds(0, 0);

  function* _doInit(t) {
    var rentCounts = yield rentCountMode01Tbl.findAll({
      where: {
        status: 1,
        end_datetime: {
          $gt: initDate,
        },
        max_punits: null,
      },
      attributes: {
        include: [
          [sequelize.col('b_mode_id'), 'b_mode_id'],
          [sequelize.col('cycle'), 'cycle'],
        ],
        exclude: ['type', 'price', 'status', 'end_datetime'],
      },
      include: [
        {
          model: virtualScreenTbl,
          where: {
            status: moduleStatus.virtualScreen.valid.val,
          },
          attributes: [],
        },
      ],
      transaction: t,
    });

    for (var rc of rentCounts) {
      var max_punits = null;
      if (rc.dataValues.b_mode_id === 3) {
        max_punits =
          rc.dataValues.cycle / mode[rc.dataValues.b_mode_id].secondsPerPunit;
      } else {
        max_punits = mode[rc.dataValues.b_mode_id].punitsMax;
      }
      rc.max_punits = max_punits;
      log.trace('rc', JSON.stringify(rc), ' rc_max:', rc.max_punits);
      yield rc.save({
        transaction: t,
      });
    }
  }

  var ret = yield db
    .transaction(function (t) {
      return co(_doInit(t));
    })
    .catch(function (err) {
      log.warn('Init screen max punit err:', err.toString());
    });
}

module.exports = {
  destroyDev,
  // HandleLeasingRights,
  // updateYid,
  findId2,
  findDevById2,
  getDevActiveStatus,
  initScreenMaxPunits,
};
