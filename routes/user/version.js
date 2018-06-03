var api = require('../../common/api.js');
var version = require('../../common/version.js');

module.exports = (router) => {
    router.get(api.apiPath + api.versionGET.path, function*() {
        this.body = version();
        this.status = 200;
    });
};
