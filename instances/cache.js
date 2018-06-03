var redis = require('redis');
var redisCoWrapper = require('co-redis');

var log = require('./log');
var globalConfig = require('./config');
var util = require('util');

var redisDB = globalConfig.redis.db || 0;
var client = redis.createClient(
    globalConfig.redis.port,
    globalConfig.redis.host,
    {
        auth_pass: globalConfig.redis.pwd,
        db:redisDB
    }
);

client.on('error', function (err) {
    log.error('Error', err, new Date());
});

// add key prefix
var commands = ['set', 'setex', 'get', 'del'];

commands.forEach( function (cmd)  {
    var oldCmd = `_${cmd}`;
    client[oldCmd] = client[cmd];
    client[cmd] = function (key, arg, cb) {
        arguments[0] = `ReactWebNative8Koa/${arguments[0]}`;
        return client[oldCmd].apply(this, arguments);
    };
});

client.jsetex = (key, expire, val, callback) => {
    return client.setex(key, expire, JSON.stringify(val), callback);
};

client.jset = (key, val, callback) => {
    return client.set(key, JSON.stringify(val), callback);
};

var redisCo = redisCoWrapper(client);
// json get
redisCo.jget = function *(key) {
    var val = yield redisCo.get(key);
    return util.isNullOrUndefined(val) ? val : JSON.parse(val);
};

redisCo._client = client;

module.exports = redisCo;
