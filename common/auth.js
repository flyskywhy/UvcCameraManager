var util = require('util');
var pluck = require('arr-pluck');
var db = require('../models/index');
var utilx = require('../lib/util.js');
var defines = require('./Defines.js');
var cache = require('../instances/cache.js');

var usersTbl = db.models.b_user;
var rolesTbl = db.models.b_role;
var usersRoleTbl = db.models.b_user_role;

var cookieName = 'ReactWebNative8KoaUser';
var userType = defines.User.Type;
var cookieCacheTimeout = defines.cookieCacheTimeout;

var insertRoleModules = function* (user) {
  var role_ids = yield usersRoleTbl
    .findAll({
      where: {
        b_user_id: user.id,
      },
      attributes: ['b_role_id'],
    })
    .then(function (data) {
      return pluck(data, 'b_role_id');
    });

  var roles = yield rolesTbl.findAll({
    where: {
      id: role_ids,
    },
    attributes: ['id', 'name'],
  });

  var role_name;
  for (var i = 0; i < roles.length; i++) {
    role_name = roles[i];
    if (roles[i].name === 'sysadmin') {
      break;
    }
  }
  user.role_name = role_name.name;
  user.role_list = roles;
};

module.exports = {
  /**
   * 登录
   * @param ctx
   * @param user
   * @param type
   */
  login: function* (ctx, user, type) {
    yield insertRoleModules(user);
    ctx.current = ctx.current || {};
    ctx.current.user = user;

    var token = utilx.md5(`${user.id}#${Date.now()}`);
    var nextYear = new Date();
    nextYear.setYear(nextYear.getFullYear() + 1);
    ctx.cookies.set(cookieName, token, {
      expires: nextYear,
    });
    cache.jsetex(token, cookieCacheTimeout, {
      id: user.id,
      type,
    });
    cache.jsetex(`/${type}/${user.id}`, cookieCacheTimeout, user);
  },
  logout: function* (ctx) {
    var user = yield this.user(ctx);
    ctx.current = ctx.current || {};
    if (user) {
      var token = ctx.cookies.get(cookieName);
      if (util.isNullOrUndefined(token)) {
        return null;
      }
      cache.del(token);
    }
    var lastYear = new Date();
    lastYear.setYear(lastYear.getFullYear() - 1);
    ctx.cookies.set(cookieName, null, {
      expires: lastYear,
    });
    ctx.cookies.set(defines.cookiePassportName, null, {
      expires: lastYear,
    });
    ctx.current.user = null;
  },
  /**
   * 获取当前用户
   * @param ctx
   * @returns {user || null}
   */
  user: function* (ctx) {
    var user;
    ctx.current = ctx.current || {};
    user = ctx.current.user;
    if (util.isNullOrUndefined(user)) {
      var token = ctx.cookies.get(cookieName);
      if (util.isNullOrUndefined(token)) {
        return null;
      }
      var userInfo = yield cache.jget(token);
      if (util.isNullOrUndefined(userInfo)) {
        return null;
      }
      //flush timeout
      cache.jsetex(token, cookieCacheTimeout, userInfo);

      var userCacheKey = `/${userInfo.type}/${userInfo.id}`;
      user = yield cache.jget(userCacheKey);
      if (util.isNullOrUndefined(user)) {
        // user is empty
        //token is exist but the modules info of user is deleted by opr.
        user = yield usersTbl.findById(userInfo.id);
        if (user) {
          user = user.dataValues;
          yield insertRoleModules(user);
        } else {
          return null;
        }
      }

      //flush timeout
      cache.jsetex(userCacheKey, cookieCacheTimeout, user);
      var passport = ctx.cookies.get(defines.cookiePassportName);
      if (passport) {
        cache.expire(passport, cookieCacheTimeout);
      }
    }
    ctx.current.user = user;

    return user;
  },
  userset: function* (ctx) {
    var user;
    ctx.current = ctx.current || {};
    user = ctx.current.user;
    if (!!user) {
      var token = ctx.cookies.get(cookieName);
      if (util.isNullOrUndefined(token)) {
        return;
      }
      var userInfo = yield cache.jget(token);
      if (util.isNullOrUndefined(userInfo)) {
        return;
      }

      cache.jsetex(token, cookieCacheTimeout, userInfo);
      cache.jsetex(
        `/${userInfo.type}/${userInfo.id}`,
        cookieCacheTimeout,
        user,
      );
      var passport = ctx.cookies.get(defines.cookiePassportName);
      cache.expire(passport, cookieCacheTimeout);
    }
  },
  register: function* (phone, hash, name, headimage, t) {
    var user = yield usersTbl.create(
      {
        name: name,
        phone: phone,
        password: hash,
        headimage: headimage,
        type: 0,
        status: 0,
      },
      {
        transaction: t,
      },
    );
    yield usersRoleTbl.create(
      {
        b_user_id: user.id,
        b_role_id: userType.owner,
      },
      {
        transaction: t,
      },
    );

    return user;
  },
};
