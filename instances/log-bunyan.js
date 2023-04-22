var bunyan = require('bunyan');
var fs = require('fs');

var globalConfig = require('./config.js');
var logConfig = globalConfig.log,
  accessPath = logConfig.access(),
  errorPath = logConfig.error();

var appName = logConfig.appName || 'ReactWebNative8Koa';
var server = globalConfig.server.ip + ':' + globalConfig.server.port;

if (!fs.existsSync(logConfig.dir())) {
  fs.mkdirSync(logConfig.dir());
}

var streams = [
  {
    name: 'console',
    level: 'debug',
    stream: process.stdout,
  },
  {
    type: 'rotating-file',
    period: '1d', // daily rotation
    count: logConfig.count,
    name: 'dbgFile',
    level: 'debug',
    path: accessPath,
  },
  {
    type: 'rotating-file',
    period: '1d', // daily rotation
    count: logConfig.count,
    name: 'errFile',
    level: 'error',
    path: errorPath,
  },
];

var logger = bunyan.createLogger({
  name: appName,
  streams: streams,
  server: server,
  // src: true, //Never use in production as this is really slow
});

logger.addSerializers({
  user: function (ctx) {
    if (ctx && ctx.current && ctx.current.user) {
      var user = {};
      user.authorized_user = ctx.current.user.name;
      user.authorized_phone = ctx.current.user.phone;
      var userAgent = ctx.header['user-agent'];
      if (userAgent.indexOf('okhttp') >= 0) {
        user.platform = 'Android-App';
      } else if (userAgent.indexOf('CFNetwork') >= 0) {
        user.platform = 'iOS-App';
      } else {
        user.platform = 'Web';
      }
      return user;
    } else {
      return 'unknown';
    }
  },
});

logger.addSerializers({
  req: function (req) {},
});

logger.addSerializers({
  res: function (res) {},
});

logger._error = logger.error;
logger.error = function () {
  logger._error.apply(this, arguments);
};

module.exports = logger;

module.exports.TRACE = bunyan.TRACE;
module.exports.DEBUG = bunyan.DEBUG;
module.exports.INFO = bunyan.INFO;
module.exports.WARN = bunyan.WARN;
module.exports.ERROR = bunyan.ERROR;
module.exports.FATAL = bunyan.FATAL;

module.exports.resolveLevel = bunyan.resolveLevel;
module.exports.levelFromName = bunyan.levelFromName;
module.exports.nameFromLevel = bunyan.nameFromLevel;

Object.defineProperty(global, '__stack', {
  get: function () {
    var orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function (_, stack) {
      return stack;
    };
    var err = new Error();
    Error.captureStackTrace(err, arguments.callee);
    var stack = err.stack;
    Error.prepareStackTrace = orig;
    return stack;
  },
});

Object.defineProperty(global, '__line__', {
  get: function () {
    return __stack[1].getLineNumber();
  },
});

Object.defineProperty(global, '__file__', {
  get: function () {
    return __stack[1].getFileName();
  },
});
