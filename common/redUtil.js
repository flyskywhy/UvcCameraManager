var redis = require('redis');
var Redlock = require('redlock');
var log = require('../instances/log.js');
var globalConfig = require('../instances/config');

module.exports.redisConnection = function (redisDb) {
  var client;
  client = redis.createClient(
    globalConfig.redis.port,
    globalConfig.redis.host,
    {
      auth_pass: globalConfig.redis.pwd,
      db: redisDb,
    },
  );

  client.on('connect', function () {
    log.info(
      'Redis default connection open to ' +
        globalConfig.redis.host +
        ':' +
        globalConfig.redis.port,
    );
  });

  client.on('error', function (err) {
    log.info('Redis default connection error ' + err);
    log.info(
      'Redis Path : ' + globalConfig.redis.host + ':' + globalConfig.redis.port,
    );
  });

  process.on('SIGINT', function () {
    client.quit();
    log.info('Redis default connection disconnected');
    process.exit(0);
  });

  return client;
};

module.exports.redisLock = function (client) {
  var redlock;

  redlock = new Redlock([client], {
    driftFactor: 0.01,
    retryCount: 2,
    retryDelay: 200,
  });
  redlock.on('clientError', function (err) {
    log.info('A Redis Error Has Occurred : ' + err);
  });
  return redlock;
};
