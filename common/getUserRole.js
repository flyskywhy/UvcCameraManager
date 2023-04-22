var db = require('../models/index.js');
var pluck = require('arr-pluck');

function* byId(userId) {
  var Users = db.models.b_user;
  var Roles = db.models.b_role;

  var userRole = yield Users.findOne({
    where: {
      id: userId,
    },
    attributes: ['id', 'name'],
    include: [
      {
        model: Roles,
        attributes: ['name'],
      },
    ],
  });

  // console.log('=== userRole:' + JSON.stringify(userRole))
  if (!userRole) {
    return null;
  }
  var _auth = [];
  _auth = pluck(userRole.b_roles, 'name');

  return _auth;
}

module.exports = {
  byId,
};
