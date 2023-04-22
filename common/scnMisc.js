var pluck = require('arr-pluck');
var defines = require('./Defines.js');
var db = require('../models/index.js');
var log = require('../instances/log.js');
var extend = require('./extend.js');
var _ = require('lodash');
var moduleStatus = require('./Defines.js').moduleStatus;

function screenEndDatetime(slots) {
  var max_end;
  max_end = slots[0].end_datetime;
  for (var i = 0; i < slots.length; i++) {
    if (slots[i].end_datetime > max_end) {
      max_end = slots[i].end_datetime;
    }
  }
  return max_end;
}

var scn_query = {
  unpublishedScns: {
    val: 0,
    explain: 'unpublished screens',
  },
  publishedScns: {
    val: 1,
    explain: 'published screens',
  }, //rented published
  rentedScns: {
    val: 2,
    explain: 'rented screens',
  }, //rented all(include published status)
  scnsAssociatedProg: {
    val: 3,
    explain: 'screens associated program',
  }, //
  scnsUnassocaiatedProg: {
    val: 4,
    explain: 'screens Unassociated program',
  },
  scnsOwned: {
    val: 5,
    explain: 'owned screens',
  },
  scngroupsAssociatedProg: {
    val: 6,
    explain: 'screenGroup associated program',
  },
  scngroupsUnassociatedProg: {
    val: 7,
    explain: 'screenGroup Unassociated program',
  },
  scnsInGroups: {
    val: 8,
    explain: 'screens in group',
  },
  ownScnsAssociatedProg: {
    val: 9,
    explain: 'Owned screens associated prog',
  },
  allScnsAssociatedProg: {
    val: 10,
    explain: 'All screens associated prog',
  },
};

// Just for API: 'programAssociatedScreensGET'
var scn_flags = [
  {
    name: 'rented',
    flag: 0,
    query: scn_query.scnsAssociatedProg,
  },
  {
    name: 'owned',
    flag: 1,
    query: scn_query.ownScnsAssociatedProg,
  },
  {
    name: 'all',
    flag: 2,
    query: scn_query.allScnsAssociatedProg,
  },
];

var ScreenUserRent = db.models.b_virtual_screen_user_rent;
var VirtualScreenUserRent01 = db.models.b_virtual_screen_user_rent_mode_01;
var VirtualScreenUserRent02 = db.models.b_virtual_screen_user_rent_mode_02;
var VirtualScreens = db.models.b_virtual_screen;
var ClientLists = db.models.c_client_list;
var ClientConfigs = db.models.c_client_config;
var VirtualScreenGroup = db.models.b_virtual_screen_group;
var ScreenGroups = db.models.b_screen_group;
var ProgramPreComposes = db.models.b_program_precompose;
var Programs = db.models.b_program_list;
var rentSettingTbl = db.models.b_rent_setting;

function orgScnsInfo(screens, flag, pubedIds) {
  log.trace('orgInfo, pubedIds:', pubedIds);
  for (var i = 0; i < screens.length; i++) {
    if (
      flag === scn_query.publishedScns.val ||
      flag === scn_query.scnsAssociatedProg.val ||
      flag === scn_query.scngroupsAssociatedProg.val
    ) {
      screens[i].dataValues.published = 1;
    } else {
      screens[i].dataValues.published = 0;
      if (_.includes(pubedIds, screens[i].id) === true) {
        screens[i].dataValues.published = 1;
      }
    }
    var slots = screens[i].b_virtual_screen_user_rents;

    screens[i].dataValues.start_datetime = _.min(
      pluck(slots, 'start_datetime'),
    );
    screens[i].dataValues.end_datetime = screenEndDatetime(slots);

    if (_.indexOf(pluck(slots, 'type'), defines.rentType.privateUse.val) >= 0) {
      screens[i].dataValues.own = 1;
    } else {
      screens[i].dataValues.own = 0;
    }
  }
}

function* queryScreens(user, queryflag, condition) {
  log.trace('queryScreen, flag:', queryflag, '...cond:', condition);

  var Programs = db.models.b_program_list;
  var curtime = new Date();

  // b_virtual_screen_user_rent
  var slotsCond = {
    status: moduleStatus.screenUserRent.valid.val,
    end_datetime: {
      $gt: curtime,
    },
  };

  var userCond = {
    b_user_id: user.id,
  };

  // b_virtaul_screen
  var scnCond = {
    status: moduleStatus.virtualScreen.valid.val,
  };

  // b_program_precompose
  var composeCond = {
    status: {
      $in: moduleStatus.preCompose.existing.val,
    },
    $or: [
      {
        edate: null,
      },
      {
        edate: {
          $gt: curtime,
        },
      },
    ],
  };

  var programCond = {
    status: {
      $in: moduleStatus.program.existing.val,
    },
  };

  var scnAttr = {
    include: [
      ['tdate', 'end_datetime'],
      ['coefficient', 'published'],
      ['status', 'own'],
    ],
    exclude: ['coefficient', 'status', 'tdate'],
  };

  var cliCond = {
    status: moduleStatus.clients.valid.val,
  };

  var idConds = {};
  var pubedScnIds = [];

  var flag = queryflag.val;
  switch (flag) {
    case scn_query.unpublishedScns.val:
    case scn_query.scnsUnassocaiatedProg.val:
    case scn_query.scngroupsUnassociatedProg.val:
    case scn_query.rentedScns.val:
    case scn_query.scnsInGroups.val:
      if (condition && condition.hasOwnProperty('slotsCond')) {
        extend(slotsCond, condition.slotsCond);
      }
      if (condition.hasOwnProperty('scnCond')) {
        extend(scnCond, condition.scnCond);
      }

    case scn_query.scnsOwned.val:
    case scn_query.scnsAssociatedProg.val:
    case scn_query.scngroupsAssociatedProg.val:
    case scn_query.publishedScns.val:
      extend(slotsCond, userCond);
      extend(programCond, userCond);
    case scn_query.ownScnsAssociatedProg.val:
      if (condition.hasOwnProperty('cliCond')) {
        extend(cliCond, userCond);
      }
    case scn_query.allScnsAssociatedProg.val:
      if (condition && condition.hasOwnProperty('composeCond')) {
        log.debug(' program associated, extend condition');
        extend(composeCond, condition.composeCond);
      }

      console.log('compose:', composeCond);
      console.log('slots:', slotsCond);
      var composes = yield ProgramPreComposes.findAll({
        where: composeCond,
        attributes: ['id', 'b_virtual_screen_id', 'b_program_list_id'],
        include: [
          {
            model: VirtualScreens,
            where: {
              status: moduleStatus.virtualScreen.valid.val,
            },
            attributes: ['id'],
            include: [
              {
                model: ScreenUserRent,
                where: slotsCond,
                attributes: ['id'],
              },
            ],
          },
          {
            model: Programs,
            where: programCond,
            attributes: [],
          },
        ],
        // logging: console.log, // just for debug
        // benchmark: true
      });

      pubedScnIds = _.uniq(pluck(composes, 'b_virtual_screen_id'));
      log.debug('User %d pubedScnIds:', user.id, pubedScnIds);

      if (pubedScnIds.length === 0) {
        break;
      }

      if (
        flag === scn_query.publishedScns.val ||
        flag === scn_query.scnsAssociatedProg.val ||
        flag === scn_query.scngroupsAssociatedProg.val ||
        flag === scn_query.allScnsAssociatedProg.val ||
        flag === scn_query.ownScnsAssociatedProg.val
      ) {
        idConds = {
          b_virtual_screen_id: {
            $in: pubedScnIds,
          },
        };
        extend(slotsCond, idConds);
      } else {
        if (
          flag === scn_query.rentedScns.val ||
          flag === scn_query.scnsOwned.val ||
          flag === scn_query.scnsInGroups.val
        ) {
          break;
        }
        idConds = {
          id: {
            $notIn: pubedScnIds,
          },
        };

        extend(scnCond, idConds);
        if (flag === scn_query.scngroupsUnassociatedProg.val) {
          extend(slotsCond, {
            b_virtual_screen_id: {
              $notIn: pubedScnIds,
            },
          });
        }
      }
      break;
  }

  if (pubedScnIds.length === 0) {
    if (
      flag === scn_query.publishedScns.val ||
      flag === scn_query.scnsAssociatedProg.val ||
      flag === scn_query.ownScnsAssociatedProg.val ||
      flag === scn_query.allScnsAssociatedProg.val
    ) {
      return {
        count: 0,
        screens: [],
      };
    }

    if (flag === scn_query.scngroupsAssociatedProg.val) {
      return {
        count: 0,
        groups: [],
      };
    }
  }

  var queryCond;
  var ret;

  var notCount = 1;

  if (
    flag === scn_query.scngroupsAssociatedProg.val ||
    flag === scn_query.scngroupsUnassociatedProg.val
  ) {
    log.trace(' scnCond:', scnCond);
    log.trace(' slotsCond:', slotsCond);

    var scnids = yield VirtualScreens.findAll({
      where: scnCond,
      include: [
        {
          model: ScreenUserRent,
          where: slotsCond,
          attributes: [],
        },
      ],
    }).then(function (data) {
      return pluck(data, 'id');
    });

    queryCond = {
      where: {
        status: moduleStatus.screenGroup.valid.val,
        b_user_id: user.id,
      },
      attributes: ['id', 'name'],
      include: [
        {
          model: VirtualScreenGroup,
          where: {
            b_virtual_screen_id: {
              $in: scnids,
            },
          },
        },
      ],
      distinct: true,
      // logging: console.log
    };

    if (condition && condition.hasOwnProperty('pagination')) {
      extend(queryCond, condition.pagination);
      notCount = condition.pagination.offset;
    }

    var targetGroups;
    if (notCount === 0) {
      targetGroups = yield ScreenGroups.findAndCountAll(queryCond);
      ret = {
        count: targetGroups.count,
        groups: targetGroups.rows,
      };
    } else {
      targetGroups = yield ScreenGroups.findAll(queryCond);
      ret = {
        count: 0,
        groups: targetGroups,
      };
    }
    log.info(
      "User %d query '%s',  count:",
      user.id,
      queryflag.explain,
      ret.count,
      pluck(ret.groups, 'id'),
    );

    return ret;
  }

  var incs = [
    {
      model: ClientLists,
      where: cliCond,
      attributes: ['id'],
      include: [
        {
          model: ClientConfigs,
          attributes: [
            'name',
            'location',
            'physical_width',
            'physical_height',
            'flowrate',
            'location_image',
            'province',
            'city',
            'district',
            'offLineMode',
          ],
        },
      ],
    },
    {
      model: ScreenUserRent,
      where: slotsCond,
      attributes: ['id', 'start_datetime', 'end_datetime', 'type'],
    },
    {
      model: rentSettingTbl,
      where: {
        status: defines.moduleStatus.rentSetting.valid.val,
      },
      attributes: ['start_time', 'end_time', 'price'],
    },
  ];

  queryCond = {
    where: scnCond,
    attributes: scnAttr,
    include: incs,
    distinct: true,
    order: [
      [ScreenUserRent, 'id', 'DESC'],
      ['id', 'DESC'],
    ],
    subQuery: false,
  };

  log.debug(' slotsCond:', slotsCond);
  log.debug(' cli:', cliCond);
  log.debug('scnCond:', scnCond);
  var targetScn;
  if (condition && condition.hasOwnProperty('pagination')) {
    extend(queryCond, condition.pagination);
    notCount = condition.pagination.offset;
  }

  if (notCount === 0) {
    targetScn = yield VirtualScreens.findAndCountAll(queryCond);
    ret = {
      count: targetScn.count,
      screens: targetScn.rows,
    };
  } else {
    targetScn = yield VirtualScreens.findAll(queryCond);
    ret = {
      count: 0,
      screens: targetScn,
    };
  }

  // screen info
  orgScnsInfo(ret.screens, flag, pubedScnIds);
  log.info(
    "User %d query '%s',  count:",
    user.id,
    queryflag.explain,
    ret.count,
    pluck(ret.screens, 'id'),
  );
  log.trace('... scn:', JSON.stringify(ret.screens));

  return ret;
}

function* screenNumInGroup(groupDbid, userDbid) {
  var scnNum = 0;
  var curtime = new Date();

  var screens = yield VirtualScreenGroup.findAll({
    where: {
      b_screen_group_id: groupDbid,
    },
  }).then(function (data) {
    return pluck(data, 'b_virtual_screen_id');
  });

  if (screens.length === 0) {
    return 0;
  }

  scnNum = yield ScreenUserRent.aggregate('b_virtual_screen_id', 'count', {
    where: {
      b_user_id: userDbid,
      status: moduleStatus.screenUserRent.valid.val,
      end_datetime: {
        $gt: curtime,
      },
      b_virtual_screen_id: {
        $in: screens,
      },
    },
    distinct: true,
  });
  return scnNum;
}

module.exports = {
  screenEndDatetime,
  queryScreens,
  scn_query,
  scn_flags,
  screenNumInGroup,
};
