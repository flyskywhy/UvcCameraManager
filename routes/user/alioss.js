var _ = require('lodash');
var OSS = require('ali-oss');
var api = require('../../common/api.js');
var log = require('../../instances/log.js');
var currentUserId = require('../../common/currentUserId.js');
var aliyun_oss = require('../../instances/config.js').aliyun_oss;
var aliyunMtsCfg = require('../../instances/config.js').aliyun_mts;
var getUserRoleById = require('../../common/getUserRole').byId;
var inputBucket = aliyunMtsCfg.input.bucket;
var inputLocation = aliyunMtsCfg.input.location;
var outputBucket = aliyunMtsCfg.output.bucket;
var outputLocation = aliyunMtsCfg.output.location;
var STS = OSS.STS;
var sts = new STS({
  accessKeyId: aliyun_oss.accessKeyId,
  accessKeySecret: aliyun_oss.accessKeySecret,
});

module.exports = (router) => {
  router.get(api.apiPath + api.aliOSSTokenGET.path, function* () {
    this.checkParams('userDbid').notEmpty();
    if (this.errors) {
      this.body = this.errors;
      this.status = 400;
      return;
    }
    var userId = yield currentUserId.apply(this);
    if (isNaN(userId)) {
      this.body = [
        {
          UserId: 'invalid userId',
        },
      ];
      this.status = 400;
      return;
    }

    var userRole = yield getUserRoleById(userId);
    if (!userRole) {
      this.body = [
        {
          error: 'Unknow user role',
        },
      ];
      this.status = 400;
      return;
    }

    var bucketName;
    var locationName;
    if (this.query.type === 'output') {
      bucketName = outputBucket;
      locationName = outputLocation;
    } else {
      //'undefined', default is 'input'
      bucketName = inputBucket;
      locationName = inputLocation;
    }

    var Resource;
    if (_.includes(userRole, 'sysadmin')) {
      Resource = 'acs:oss:*:*:' + bucketName + '/*';
    } else {
      Resource = 'acs:oss:*:*:' + bucketName + '/' + userId + '/*';
    }
    var policy = {
      Statement: [
        {
          Action: [
            'oss:ListObjects',
            'oss:GetObject',
            'oss:DeleteObject',
            'oss:ListParts',
            'oss:AbortMultipartUpload',
            'oss:PutObject',
          ],
          Effect: 'Allow',
          Resource: ['acs:oss:*:*:' + bucketName, Resource],
        },
      ],
      Version: '1',
    };

    var token = yield sts.assumeRole(
      aliyun_oss.RoleArn,
      policy,
      15 * 60,
      aliyun_oss.RoleSessionName,
    );

    this.body = {
      region: locationName, //'oss-cn-hangzhou',
      accessKeyId: token.credentials.AccessKeyId,
      accessKeySecret: token.credentials.AccessKeySecret,
      stsToken: token.credentials.SecurityToken,
      bucket: bucketName,
    };
    log.debug(this.body);
  });
};
