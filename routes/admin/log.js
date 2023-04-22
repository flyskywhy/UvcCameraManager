var api = require('../../common/api.js');
var log = require('../../instances/log.js');

module.exports = (router) => {
  router.post(api.apiPath + api.logControlPOST.path, function () {
    var body = this.request.body;
    this.checkBody('dbgLevel').notEmpty();
    if (this.errors) {
      this.body = this.errors;
      return;
    }

    var dbgLevel = log.levelFromName[body.dbgLevel];
    if (dbgLevel === undefined) {
      this.body = 'PARAMS ERROR!\n';
      this.body += 'Usage :\n';
      this.body +=
        '  POST ${IP}:${PORT}/api/v0001/control/dbglevel  {dbgLevel : ${level}}\n';
      this.body += '  ${level} : trace|debug|info|warn|error|fatal\n';
      this.status = 400;
      return;
    }

    this.log.info('admin: modify the level of log to ', dbgLevel);
    log.levels('console', dbgLevel);
    log.levels('dbgFile', dbgLevel);
    this.body = {};
    this.status = 200;
    return;
  });

  router.get(api.apiPath + api.logControlGET.path, function () {
    var dbgLevel = log.levels('dbgFile');
    this.status = 200;
    this.body = {
      logLevel: log.nameFromLevel[dbgLevel],
    };
    return;
  });
};
