var auth = require('./auth.js');

module.exports = function* () {
  var userid;
  try {
    var user = yield auth.user(this);
    if (user !== null) {
      userid = user.id;
    }
  } catch (err) {
    this.throw('Get current user error!', 400);
  }

  return userid;
};
