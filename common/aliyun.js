var ALY = require('aliyun-sdk');
var OSS = require('ali-oss');
var aliyuncfg = require('../instances/config.js').aliyun_sdk;
var aliyun_mts = require('../instances/config.js').aliyun_mts.cfg;
var aliyun_oss = require('../instances/config.js').aliyun_oss;
var mtsCfg = require('../instances/config.js').aliyun_mts;
var utilx = require('../lib/util');
var request = require('co-request');
var log = require('../instances/log');
var aliUtil = require('aliyun-sdk/lib/util.js');

var green = new ALY.GREEN(aliyuncfg);
var mts = new ALY.MTS(aliyun_mts);

var imageDetection = function (body, callback) {
  green.imageDetection(body, callback);
};

var imageResults = function (body, callback) {
  green.imageResults(body, callback);
};

var textKeywordFilterSDK = function (text, callback) {
  green.textKeywordFilter(text, callback);
};

var textKeywordFilter = function* (text) {
  var date = aliUtil.date.getDate();
  var body = {};
  body.Text = text;
  body.Action = 'TextKeywordFilter';
  body.Format = 'JSON';
  body.Version = aliyuncfg.apiVersion;
  body.AccessKeyId = aliyuncfg.accessKeyId;
  body.SignatureVersion = '1.0';
  body.SignatureMethod = 'HMAC-SHA1';
  body.SignatureNonce = String(date.getTime()) + utilx.randomNum(4);
  body.Timestamp = aliUtil.date.iso8601(date);

  // sign
  var headers = [];

  ALY.util.each(body, function (name) {
    headers.push(name);
  });

  headers.sort(function (a, b) {
    return a < b ? -1 : 1;
  });

  var canonicalizedQueryString = '';
  aliUtil.arrayEach.call(this, headers, function (name) {
    canonicalizedQueryString +=
      '&' + name + '=' + aliUtil.popEscape(body[name]);
  });

  var stringToSign =
    'POST&%2F&' + aliUtil.popEscape(canonicalizedQueryString.substr(1));

  body.Signature = aliUtil.crypto.hmac(
    aliyuncfg.secretAccessKey + '&',
    stringToSign,
    'base64',
    'sha1',
  );

  // body
  var bodyString = aliUtil.queryParamsToString(body);
  var requrl = 'http://green.cn-hangzhou.aliyuncs.com/?' + bodyString;
  var req = yield request({
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    host: 'green.cn-hangzhou.aliyuncs.com',
    uri: requrl,
  });

  if (req.statusCode === 200) {
    try {
      var keyret = JSON.parse(req.body);
      if (keyret.hasOwnProperty('KeywordResults')) {
        log.trace('key:', keyret.KeywordResults.KeywordResult);
        return keyret.KeywordResults.KeywordResult;
      }
    } catch (err) {
      log.warn(err);
    }
  } else {
    log.debug('status:', req.statusCode, '..body:', req.body);
  }

  return null;
};

var submitSnapshotJob = function (body, callback) {
  mts.submitSnapshotJob(body, callback);
};

var querySnapshotJobList = function (body, callback) {
  mts.querySnapshotJobList(body, callback);
};

var newOssClient = function (location) {
  return new OSS({
    region: location,
    accessKeyId: aliyun_oss.accessKeyId,
    accessKeySecret: aliyun_oss.accessKeySecret,
  });
};
var clientDef = newOssClient('oss-cn-hangzhou');

var signatureUrl = function (bucketName, objectKey, client) {
  var cli = client === undefined ? clientDef : client;
  cli.useBucket(bucketName);
  return cli.signatureUrl(objectKey);
};

var OSSDeleteObject = function* (bucketName, objectKey, client) {
  var cli = client === undefined ? clientDef : client;
  cli.useBucket(bucketName);
  yield cli.delete(objectKey);
};

var OSSDeleteObjectMulti = function* (bucketName, objectKey, client) {
  var cli = client === undefined ? clientDef : client;
  cli.useBucket(bucketName);
  yield cli.deleteMulti(objectKey, {
    quiet: true,
  });
};

var newOssImageClient = function (bucket, imageHost) {
  var imgClient = OSS.ImageClient({
    accessKeyId: aliyun_oss.accessKeyId,
    accessKeySecret: aliyun_oss.accessKeySecret,
    bucket: bucket,
    imageHost: imageHost,
  });
  return imgClient;
};

var OSSListImageStyle = function* (bucketName, imageHost, client) {
  var cli = client === undefined ? clientDef : client;
  var result = yield cli.listStyle({
    accessKeyId: aliyun_oss.accessKeyId,
    accessKeySecret: aliyun_oss.accessKeySecret,
    bucket: bucketName,
    imageHost: imageHost,
  });
  return result;
};

var OSSGetObject = function* (bucketName, object, filepath, client) {
  var cli = client === undefined ? clientDef : client;
  cli.useBucket(bucketName);
  var result = yield cli.get(object, filepath);
  return result;
};

var OSSGetStream = function* (bucketName, object, options, client) {
  var cli = client === undefined ? clientDef : client;
  cli.useBucket(bucketName);
  var result = yield cli.getStream(object, options);
  return result;
};

var OSSPutObject = function* (bucketName, objectKey, file, client) {
  var cli = client === undefined ? clientDef : client;
  cli.useBucket(bucketName);
  var result = yield cli.put(objectKey, file);
  return result;
};

var OSSHeadObject = function* (bucketName, objectKey, client) {
  var cli = client === undefined ? clientDef : client;
  cli.useBucket(bucketName);
  var result = yield cli.head(objectKey);
  return result;
};

var OSSListObject = function* (bucketName, prefix, client) {
  var cli = client === undefined ? clientDef : client;

  cli.useBucket(bucketName);
  var list = yield cli.list({
    prefix: prefix,
  });
  var result = list.objects;

  if (list.isTruncated) {
    do {
      var list_next = yield cli.list({
        prefix: prefix,
        marker: list.nextMarker,
      });
      result.push.apply(result, list_next.objects);
      list.nextMarker = list_next.nextMarker;
    } while (list_next.isTruncated);
  }

  return result;
};

var submitMediaInfoJobSDK = function (key, callback) {
  var cmd = {
    Input: JSON.stringify({
      Bucket: mtsCfg.input.bucket,
      Location: mtsCfg.input.location,
      Object: key,
    }),
  };
  mts.submitMediaInfoJob(cmd, callback);
};

var submitMediaInfoJob = function* (filekey) {
  var vstreams = {};

  var input = JSON.stringify({
    Bucket: mtsCfg.input.bucket,
    Location: mtsCfg.input.location,
    Object: filekey,
  });

  var curtime = new Date();
  var body = {};
  body.Action = 'SubmitMediaInfoJob';
  body.Input = input;
  body.Format = 'JSON';
  body.Version = mtsCfg.cfg.apiVersion;
  body.AccessKeyId = mtsCfg.cfg.accessKeyId;
  body.SignatureVersion = mtsCfg.SignatureVersion;
  body.SignatureMethod = mtsCfg.SignatureMethod;
  body.SignatureNonce = String(curtime.getTime()) + utilx.randomNum(4);
  body.Timestamp = aliUtil.date.iso8601(curtime);

  var headers = [];
  aliUtil.each(body, function (name) {
    headers.push(name);
  });

  headers.sort(function (a, b) {
    return a < b ? -1 : 1;
  });
  var canonicalizedQueryString = '';
  aliUtil.arrayEach.call(this, headers, function (name) {
    canonicalizedQueryString +=
      '&' + name + '=' + aliUtil.popEscape(body[name]);
  });
  var stringToSign =
    'POST&%2F&' + aliUtil.popEscape(canonicalizedQueryString.substr(1));

  body.Signature = aliUtil.crypto.hmac(
    mtsCfg.cfg.secretAccessKey + '&',
    stringToSign,
    'base64',
    'sha1',
  );

  var newquer = aliUtil.queryParamsToString(body);

  var requrl = 'http://mts.aliyuncs.com/?' + newquer;
  log.debug('>>> req:', newquer);

  var req = yield request({
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    host: 'mts.cn-hangzhou.aliyuncs.com',
    uri: requrl,
  });

  if (req.statusCode === 200) {
    try {
      var data = JSON.parse(req.body);
      vstreams = data.MediaInfoJob.Properties.Streams.VideoStreamList;
    } catch (err) {
      log.warn(err);
      vstreams = null;
    }
  } else {
    log.debug(requrl, ' ret:', req.statusCode, ', ', req.body);
    vstreams = null;
  }

  return vstreams;
};

var reqURL = function (bucket, location) {
  var baseDomain = 'aliyuncs.com/';
  var requrl = 'http://' + bucket + '.' + location + '.' + baseDomain;
  return requrl;
};

var queryImageInfo = function* (filekey) {
  var requrl =
    reqURL(mtsCfg.input.bucket, mtsCfg.input.location) +
    filekey.substr(0, filekey.lastIndexOf('/') + 1) +
    encodeURIComponent(filekey.substr(filekey.lastIndexOf('/') + 1)) +
    '?x-oss-process=image/info';
  var req = yield request({
    method: 'GET',
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    uri: requrl,
  });

  var minfo = {};
  if (req.statusCode === 200) {
    minfo = JSON.parse(req.body);
  } else {
    log.debug(requrl, ' ret:', req.statusCode, ', ', req.body);
    minfo = null;
  }

  return minfo;
};

var updateMediaPublishState = function* (MediaId, Publish) {
  var vstreams = {};

  var curtime = new Date();
  var body = {};
  body.Action = 'UpdateMediaPublishState';
  body.MediaId = MediaId;
  body.Publish = Publish;
  body.Format = 'JSON';
  body.Version = mtsCfg.cfg.apiVersion;
  body.AccessKeyId = mtsCfg.cfg.accessKeyId;
  body.SignatureVersion = mtsCfg.SignatureVersion;
  body.SignatureMethod = mtsCfg.SignatureMethod;
  body.SignatureNonce = String(curtime.getTime()) + utilx.randomNum(4);
  body.Timestamp = aliUtil.date.iso8601(curtime);

  var headers = [];
  aliUtil.each(body, function (name) {
    headers.push(name);
  });

  headers.sort(function (a, b) {
    return a < b ? -1 : 1;
  });
  var canonicalizedQueryString = '';
  aliUtil.arrayEach.call(this, headers, function (name) {
    canonicalizedQueryString +=
      '&' + name + '=' + aliUtil.popEscape(body[name]);
  });
  var stringToSign =
    'POST&%2F&' + aliUtil.popEscape(canonicalizedQueryString.substr(1));

  body.Signature = aliUtil.crypto.hmac(
    mtsCfg.cfg.secretAccessKey + '&',
    stringToSign,
    'base64',
    'sha1',
  );

  var newquer = aliUtil.queryParamsToString(body);

  var requrl = 'http://mts.aliyuncs.com/?' + newquer;
  log.debug('>>> req:', newquer);

  var req = yield request({
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    host: 'mts.cn-hangzhou.aliyuncs.com',
    uri: requrl,
  });

  if (req.statusCode === 200) {
    try {
      var data = JSON.parse(req.body);
      log.debug(data);
    } catch (err) {
      log.warn(err);
    }
  } else {
    log.debug(requrl, ' ret:', req.statusCode, ', ', req.body);
  }

  return vstreams;
};

module.exports = {
  imageDetection,
  imageResults,
  textKeywordFilter,
  submitSnapshotJob,
  querySnapshotJobList,
  newOssClient,
  signatureUrl,
  OSSDeleteObject,
  OSSDeleteObjectMulti,
  submitMediaInfoJob,
  submitMediaInfoJobSDK,
  queryImageInfo,
  reqURL,
  updateMediaPublishState,
  OSSListObject,
  OSSGetObject,
  OSSPutObject,
  OSSGetStream,
  OSSHeadObject,
};
