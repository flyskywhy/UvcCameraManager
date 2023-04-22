var Acl = require('acl');
var log = require('./log.js');
var pluck = require('arr-pluck');

// var globalConfig = require('./config');

// var redisDB = globalConfig.redis.db || 0;
// var client = require('redis').createClient(
//     globalConfig.redis.port,
//     globalConfig.redis.host, {
//         no_ready_check: true,
//         auth_pass: globalConfig.redis.password,
//         db:redisDB
//     });
//var backend = new Acl.redisBackend(client);
var backend = new Acl.memoryBackend();
var acl = new Acl(backend);
var db = require('../models/index');
var roleTbl = db.models.b_role;
var modulesTbl = db.models.b_module;
var roleModulesTbl = db.models.b_role_module;

var createUserRole = function* (user, roleName) {
  var mod = yield modulesTbl.findAll({
    where: {
      name: roleName,
    },
    raw: true,
  });

  for (var i = 0; i < mod.length; i++) {
    var string = mod[i].method.replace(/\s+/g, '');
    var method = string.split(',');
    yield acl.allow(roleName, mod[i].program_addr, method);
  }
  yield acl.addUserRoles(user, roleName);
};

var getRoleModules = function* (roleName) {
  var roles = yield roleTbl.findOne({
    where: {
      name: roleName,
    },
  });

  var module_ids = yield roleModulesTbl
    .findAll({
      where: {
        b_role_id: roles.id,
      },
    })
    .then(function (data) {
      return pluck(data, 'b_module_id');
    });

  return yield modulesTbl.findAll({
    where: {
      id: module_ids,
    },
    raw: true,
  });
};

var checkAclUserRole = function* (user, roleName, rolesParentName) {
  var res = 0;
  var userId = user.id;
  var hasRole = yield acl.hasRole(userId, roleName);
  var users = yield acl.roleUsers(roleName);
  //role不存在，创建role并关联userId
  if (!users.length) {
    yield acl.addRoleParents(roleName, rolesParentName);
    var modules = yield getRoleModules(roleName);
    for (var i = 0; i < modules.length; i++) {
      var string = modules[i].method.replace(/\s+/g, '');
      var method = string.split(',');
      acl.allow(roleName, modules[i].program_addr, method);
    }
    acl.addUserRoles(userId, roleName);
    log.trace(`Role: ${roleName} is not exist, so create it !`);
    res = 1;
  } else {
    //role存在，但不存在userId关联
    if (!hasRole) {
      acl.addUserRoles(userId, roleName);
      log.debug('this is a ' + roleName);
      res = 2;
    }
  }
  //role存在，并存在userId关联
  log.trace(`UserId: ${userId} is ${roleName}`);
  return res;
};

var delAclRole = function* (roleName) {
  var users = yield acl.roleUsers(roleName);
  for (var user of users) {
    yield acl.removeUserRoles(user, roleName);
  }
  yield acl.removeRole(roleName);
};

var getAclRoleResource = function* (roleName) {
  return yield acl.whatResources(roleName);
};

module.exports = {
  acl,
  backend,
  checkAclUserRole,
  getAclRoleResource,
  createUserRole,
  delAclRole,
};
