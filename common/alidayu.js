var utilx = require('../lib/util.js');
var cache = require('../instances/cache.js');
var log = require('../instances/log');
var kitx = require('kitx');
var request = require('co-request');

var cfg = require('../instances/config.js');
var defines = require('./Defines.js');
const smsAccessKeyId = cfg.alidayu.accessKeyId;
const smsAccessKeySecret = cfg.alidayu.accessKeySecret;
const smsHost = 'dysmsapi.aliyuncs.com';

function firstLetterUpper(str) {
    return str.slice(0, 1).toUpperCase() + str.slice(1);
}

function formatParams(params) {
    var keys = Object.keys(params);
    var newParams = {};
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        newParams[firstLetterUpper(key)] = params[key];
    }
    return newParams;
}

function timestamp() {
    var date = new Date();
    var YYYY = date.getUTCFullYear();
    var MM = kitx.pad2(date.getUTCMonth() + 1);
    var DD = kitx.pad2(date.getUTCDate());
    var HH = kitx.pad2(date.getUTCHours());
    var mm = kitx.pad2(date.getUTCMinutes());
    var ss = kitx.pad2(date.getUTCSeconds());

    return `${YYYY}-${MM}-${DD}T${HH}:${mm}:${ss}Z`;
}

function encode(str) {
    var result = encodeURIComponent(str);

    return result.replace(/\!/g, '%21')
        .replace(/\'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/\*/g, '%2A');
}

function repeatList(list, key, repeat) {
    for (var i = 0; i < repeat.length; i++) {
        var item = repeat[i];
        var prefix = `${key}.${i + 1}`;
        list.push([encode(prefix), encode(item)]);
    }
}

function normalize(params) {
    var list = [];
    var keys = Object.keys(params).sort();
    for (let i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = params[key];
        if (Array.isArray(value)) {
            repeatList(list, key, value);
        } else {
            list.push([encode(key), encode(value)]); //push []
        }
    }

    return list;
}

function canonicalize(normalized) {
    var fields = [];
    for (var i = 0; i < normalized.length; i++) {
        var [key, value] = normalized[i];
        fields.push(key + '=' + value);
    }
    return fields.join('&');
}

module.exports = {
    send: function*(phone, templateCode, data) {
        var code = utilx.randomNum(6);
        cache.setex(`verifyCode/${phone}`, 60 * 30, code);

        var params = {
            PhoneNumbers: phone,
            SignName: defines.smsSignName,
            TemplateCode: templateCode,
            TemplateParam: '{\"code\":' + JSON.stringify(code) + '}'
        };

        if ((templateCode === defines.smsTemplateCode.custom1) || (templateCode === defines.smsTemplateCode.custom2)) {
            params.TemplateParam = '{\"code\":' + JSON.stringify(data.code) + ',\"time\":' + JSON.stringify(data.time) + '}';
        }
        params = formatParams(params);

        var defaults = {
            Format: 'JSON',
            SignatureMethod: 'HMAC-SHA1',
            SignatureNonce: kitx.makeNonce(),
            SignatureVersion: '1.0',
            Timestamp: timestamp(),
            AccessKeyId: smsAccessKeyId,
            Version: '2017-05-25',
        };

        params = Object.assign({Action: 'SendSms'}, defaults, params);
        log.debug('sms', params);

        var normalized = normalize(params);
        var canonicalized = canonicalize(normalized);

        var stringToSign = `GET&${encode('/')}&${encode(canonicalized)}`;

        const key = smsAccessKeySecret + '&';
        var signature = kitx.sha1(stringToSign, key, 'base64');

        normalized.push(['Signature', encode(signature)]);

        const url = `http://${smsHost}/?${canonicalize(normalized)}`;

        var ret = yield request({
            method: 'GET',
            headers: {
                'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            host: smsHost,
            uri: url
        });

        if (ret.statusCode === 200) {
            try {
                var res = JSON.parse(ret.body);
                log.debug('res', res);
                if (res.Code === 'OK') {
                    return true;
                }
            } catch (err) {
                log.warn(err);
            }
        } else {
            log.debug(url, ' ret:', ret.statusCode, ', ', ret.body);
        }

        return false;
    },
    verify: function*(phone, code) {
        var data = yield cache.get(`verifyCode/${phone}`);
        if (code === data) {
            yield cache.setex(`verifyCode/${phone}`, 30, 'ffffff');
        }

        return code === data;
    }
};
