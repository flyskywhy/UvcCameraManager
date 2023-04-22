var qr = require('qr-image');
var serverConfig = require('../instances/config.js').server;
var registerKey = require('../instances/config.js').device.registerKey;
var log = require('../instances/log.js');
var utilx = require('../lib/util');
var OSS = require('ali-oss');
var aliyun_oss = require('../instances/config.js').aliyun_oss;
var aliyun_mts = require('../instances/config.js').aliyun_mts;

var ossClient = new OSS({
  region: aliyun_mts.input.location,
  accessKeyId: aliyun_oss.accessKeyId,
  accessKeySecret: aliyun_oss.accessKeySecret,
  bucket: aliyun_mts.input.bucket,
});

function qrImageText(id2) {
  var text;
  //eg: https://ReactWebNative8Koa.com:447/QrCode.html?id2=1&key=111
  var ext = '/QrCode.html?';

  var path;
  if (serverConfig.slb) {
    path = serverConfig.slb;
  } else {
    path = 'http://' + serverConfig.ip + ':' + serverConfig.port;
  }

  if (arguments.length === 0) {
    return path;
  }

  var qrKey = utilx.md5(id2 + registerKey);
  text = path + ext + 'id2=' + id2 + '&key=' + qrKey;
  log.debug('  Qr code text:', text);
  return text;
}

function* putQrImage(vsDbid, id2) {
  var filename;
  var objKey;
  var qrStream;

  if (arguments.length === 0) {
    // create system qr code image
    filename = 'sys_qr_image.png';
    objKey = 'system-template/model1/' + filename;
    qrStream = qr.image(qrImageText());
  } else {
    filename = 'qr_image_vs_' + vsDbid + '.png';
    objKey = 'screen/' + vsDbid + '/' + filename;
    qrStream = qr.image(qrImageText(id2));
  }

  var result = yield ossClient.putStream(objKey, qrStream);
  if (result.res.status !== 200) {
    log.info(' put sys Qr image failed! ', objKey);
    return null;
  }

  console.log(' upload ', objKey, ' success');
  return objKey;
}

module.exports = {
  putQrImage,
};
