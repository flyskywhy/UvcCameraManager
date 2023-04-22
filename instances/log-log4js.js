var fs = require('fs');
var log4js = require('log4js');
var globalConfig = require('./config.js');

var serverIP = globalConfig.server.ip;
var logConfig = globalConfig.log;
var appName = logConfig.appName || 'ReactWebNative8Koa';
var accessPath = logConfig.access();
var errorPath = logConfig.error();
var logPort = 5001;

if (!fs.existsSync(logConfig.dir())) {
  fs.mkdirSync(logConfig.dir());
}

log4js.configure({
  appenders: [
    {
      type: 'console',
      // 'category': appName
    },
    {
      type: 'logLevelFilter',
      level: 'DEBUG',
      appender: {
        type: 'multiprocess',
        // 'category': appName,
        mode: 'master',
        loggerPort: logPort,
        loggerHost: serverIP,
        appender: {
          type: 'file',
          filename: accessPath,
          maxLogSize: 104857600, //100M
          backups: 10,
          pollInterval: 15,
          // 'category': appName,
        },
      },
    },
  ],
  replaceConsole: true,
});
var logger = log4js.getLogger(appName);
// logger.setLevel('INFO');
logger.info('this is test');
console.log('this is test');
module.exports = logger;
