// parties
var co = require('co');
var koa = require('koa');
var path = require('path');
var cors = require('kcors');
var ACL = require('koa-acl');
var cron = require('node-cron');
var mount = require('koa-mount');
var koaBody = require('koa-body');
var favicon = require('koa-favicon');
var compress = require('koa-compress');
var passport = require('koa-passport');
var staticServer = require('koa-static');
var koaValidate = require('koa-validate');
var session = require('koa-session-redis');
var koaBunyanLogger = require('koa-bunyan-logger');

// local module

// my module
var task = require('./ctrl/taskSched.js');
var db = require('./models/index');
var acl = require('./instances/acl');
var auth = require('./common/auth.js');
var router = require('./routes/index');
var log = require('./instances/log.js');
var cfg = require('./instances/config.js');
var cache = require('./instances/cache');
var version = require('./common/version.js');
var defines = require('./common/Defines.js');
var routerNoAcl = require('./routes-noAcl/index');
var server = require('./instances/config.js').server;
var backend = acl.backend;
var role = db.models.b_role;
var slbCheckPath = defines.defaultSLBCheck;

co(function* () {
  var roles = yield role.findAll();
  for (var item of roles) {
    yield acl.delAclRole(item.name);
  }
  yield acl.delAclRole('public');
  yield acl.createUserRole('guest', 'public');

  if (process.env.FLUSHCACHE && process.env.FLUSHCACHE !== 'N') {
    cache.flushdb();
    log.debug('flush redis db!');
  }
});

var app = koa();
var port = server.port;

app.env = 'development';
app.proxy = true;

// reduce response content size
app.use(compress());

// static file
app.use(staticServer(path.join(__dirname, 'build')));

// favicon
app.use(favicon(__dirname + '/build/favicon.ico'));

// http parse
app.use(koaBody());

// session
app.keys = ['your-session-secret'];
app.use(
  session({
    key: defines.cookiePassportName,
    store: {
      host: cfg.redis.host,
      port: cfg.redis.port,
      options: {
        auth_pass: cfg.redis.pwd,
        db: cfg.redis.db,
      },
      db: cfg.redis.db,
      ttl: defines.cookieTimeout,
    },
  }),
);

// authentication
require('./common/passport.js');
app.use(passport.initialize());
app.use(passport.session());

app.use(koaValidate());

if (process.env.DEBUG) {
  app.use(
    cors({
      credentials: true,
    }),
  );
}

app.use(function* (next) {
  var user = yield auth.user(this);
  var userId;

  if (user !== null) {
    userId = user.id;
    for (var i = 0; i < user.role_list.length; i++) {
      yield acl.checkAclUserRole(user, user.role_list[i].name, 'public');
    }
  } else {
    userId = 'guest';
  }

  this.state.user = {
    _id: userId,
  };

  yield next;
  if (this.url !== slbCheckPath) {
    if (this.status >= 400) {
      this.log.warn(`Status: ${this.status} ${JSON.stringify(this.body)}`);
    } else {
      this.log.trace(`Status: ${this.status} ${JSON.stringify(this.body)}`);
    }
  }
});

app.use(
  ACL({
    user: (ctx) => {
      return ctx.state.user._id;
    },
    backend: (ctx) => {
      return Promise.resolve(backend);
    },
  }),
);

app.use(function* (next) {
  if (this.url === slbCheckPath) {
    this.body = {};
    this.status = 200;
    return;
  } else {
    yield next;
  }
});

app.use(koaBunyanLogger(log));
app.use(koaBunyanLogger.requestIdContext());
app.use(koaBunyanLogger.timeContext());
app.use(
  koaBunyanLogger.requestLogger({
    levelFn: function (status, err) {
      if (status >= 500) {
        return 'error';
      } else if (status >= 400) {
        return 'warn';
      } else {
        return 'info';
      }
    },
    updateLogFields: function (fields) {},
    updateRequestLogFields: function (fields, err) {},
    updateResponseLogFields: function (fields, err) {
      if (this.current && this.current.user) {
        fields.authorized_user = this.current.user.name;
        fields.authorized_phone = this.current.user.phone;
      } else {
        fields.authorized_user = 'unknown';
      }
      var userAgent = this.header['user-agent'];
      if (userAgent.indexOf('okhttp') >= 0) {
        fields.platform = 'Android-App';
      } else if (userAgent.indexOf('CFNetwork') >= 0) {
        fields.platform = 'iOS-App';
      } else {
        fields.platform = 'Web';
      }
    },
  }),
);

app.use(routerNoAcl);
app.use(ACL.middleware());
app.use(function* (next) {
  if (this.isAuthenticated()) {
    yield next;
  } else {
    this.log.error(`passport: ${this.method} ${this.url} ${this.request.ip}`);
    this.status = 403; //前台判断403状态跳转登录界面
  }
});
app.use(router);

app.on('error', (err, ctx) => {
  ctx.log.error(
    {
      user: ctx,
    },
    'Error:--->',
    ctx.method,
    ctx.url,
    err.stack,
  );
});

app = app.listen(process.env.PORT || port);
module.exports = app;

log.info(version().name, version().version);
log.info('git:', version().longRevision, version().branch, version().tag);
