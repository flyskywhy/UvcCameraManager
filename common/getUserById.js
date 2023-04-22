var db = require('../models/index.js');
var auth = require('./auth.js');

module.exports = function* () {
  var usersTbl = db.models.b_user;

  var userDbid = parseInt(this.params.userDbid, 10);
  if (isNaN(userDbid)) {
    this.throw('invalid user database id', 400);
  }

  if (userDbid === 0) {
    userDbid = (yield auth.user(this)).id;
  }

  var user = null;
  yield usersTbl.findById(userDbid).then(function (u) {
    user = u;
  });

  if (!user || user.getDataValue('status') < 0) {
    this.throw('could not find user', 400);
  }

  return user;
};
