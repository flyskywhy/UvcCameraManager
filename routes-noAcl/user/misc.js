var api = require('../../common/api.js');
var defines = require('../../common/Defines.js');
var aliyun_mts = require('../../instances/config.js').aliyun_mts;

module.exports = (router) => {
    router.get(api.apiPath + api.commonCfgGET.path, function*() {

        this.body = {
            'oss': {
                'Bucket': aliyun_mts.input.bucket,
                'location': aliyun_mts.input.location,
                'mtsOutputBucket': aliyun_mts.output.bucket,
                'mtsOutputlocation': aliyun_mts.output.location,
            },
            'videoLimit': {
                time: 180 //s
            }
        };

    });

    router.get(api.apiPath + api.devConfGeneralOptionsGET.path, function*() {

        var mode = [];
        mode.push(defines.mode[3]);
        this.body = {
            mode
        };

        this.status = 200;
    });
};
