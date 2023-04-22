var api = require('../../common/api.js');
var request = require('co-request');
var log = require('../../instances/log');

module.exports = (router) => {
  router.post(api.apiPath + api.appStrategyPOST.path, function* () {
    log.debug('enter .... app strategy', this.request.body);
    var ret = {
      strategy: 1,
    };

    this.checkBody('version').notEmpty();
    if (this.errors) {
      this.body = this.errors;
      this.status = 400;
      return;
    }

    var appInfo = this.request.body;
    log.trace('.... get app strategy, body:', appInfo);
    var appVersion = parseFloat(appInfo.version);
    if (appInfo.osType === 'IOS') {
      // get latest version from itunes
      var req = yield request({
        method: 'GET',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
        uri: 'http://itunes.apple.com/lookup?id= 1197951966',
      });

      var version;
      if (req.statusCode === 200) {
        log.trace(req.body);
        try {
          version = parseFloat(JSON.parse(req.body).results[0].version);
          log.debug('..version:', version);
        } catch (err) {
          log.debug(' get version err, ', err);
          this.status = 400;
          this.body = [
            {
              error: 'Couldnot get the latest version.',
            },
          ];
          return;
        }

        if (appVersion < version) {
          ret.strategy = 2;
          ret.comment = 'need upgrade';
        } else if (appVersion >= version) {
          ret.strategy = 3;
          ret.comment = '当前为最新版本';
        }
        ret.version = version;
      } else {
        log.debug('get APP version err:', req.body);
        this.status = 400;
        this.body = [
          {
            error: 'Couldnot get the latest version.',
          },
        ];
        return;
      }
    }

    this.status = 200;
    this.body = ret;
  });
};
