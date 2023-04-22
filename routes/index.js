// parties
var Router = require('koa-router');

// local
var fs = require('fs');
var path = require('path');
var router = new Router();

var loadDir = (dir) => {
  fs.readdirSync(dir).forEach((file) => {
    var nextPath = path.join(dir, file);
    var stat = fs.statSync(nextPath);
    if (stat.isDirectory()) {
      loadDir(nextPath);
    } else if (
      stat.isFile() &&
      file.indexOf('.') !== 0 &&
      file !== 'index.js'
    ) {
      require(nextPath)(router);
    }
  });
};

loadDir(__dirname);

module.exports = router.middleware();
