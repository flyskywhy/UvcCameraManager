var fs = require('fs');
var co = require('co');
var path = require('path');
var crypto = require('crypto');
var utilx = require('../../lib/util');
var im = require('imagemagick');
var fileParse = require('co-busboy');
var api = require('../../common/api.js');
var db = require('../../models/index.js');
var log = require('../../instances/log.js');
var uploadCfg = require('../../instances/config.js').upload;
var currentUserId = require('../../common/currentUserId.js');
/* ____________________________________________

   api.userUploadGET:
   返回该文件的materialId，md5, offset，url，snap，status

   api.userUploadPOST:
   status转化:
       新上传:
       UPLOADING -------success----> READY (offset = filesize)
                   |
                   ------failed----> INVAILD (offset = 0)
                   |
                   ----exception---> UPLOADING (offset = x)

       断点续传同上:
       UPLOADING -------success----> READY (offset = filesize)
           ^       |
           |       ------failed----> INVAILD (offset = 0) -----
           |       |                                          |
           |       ----exception---> UPLOADING (offset = x)   |
           |                                       |          |
           |                                       |          |
           ----api.userUploadGET: get offset(x)----------------

       删除后秒传:
       REMOVE --> READY

   api.userUploadDEL:
        判断offset是否等于filesize，等于的情况下,
        b_resource status转化 READY --> REMOVE

   ____________________________________________ */

var STATUS_FILE_INVALID = 0;
var STATUS_FILE_READY = 1;
var STATUS_FILE_REMOVE = 2;
var STATUS_FILE_UPLOADING = 3;

var vidDir = uploadCfg.videoPath;
var picDir = uploadCfg.picturePath;
var thumbnailDir = uploadCfg.thumbnailPath;

var uploadServer = uploadCfg.uploadServer || '0.0.0.0';
var uploadServerPort = uploadCfg.uploadServerPort || '8765';
var fileServer = uploadCfg.fileServer || '0.0.0.0';
var fileServerPort = uploadCfg.fileServerPort || '8765';
var maxFileSize = uploadCfg.maxFileSize || 100 * 1024 * 1024;
var maxFileCnt = uploadCfg.maxFileCnt || 1000;

module.exports = (router) => {
  var uploadListTbl = db.models.b_material;
  var uploadResourceTbl = db.models.b_resource;

  if (vidDir) {
    utilx.mkdirsSync(vidDir);
  }
  if (picDir) {
    utilx.mkdirsSync(picDir);
  }
  if (thumbnailDir) {
    utilx.mkdirsSync(thumbnailDir);
  }

  var newFileName = (filename, uploadDir) => {
    var ret;
    var pattern = new RegExp('[-;=]');
    do {
      filename = filename.replace(pattern, 'x');
    } while (pattern.test(filename));

    do {
      var randomNum = utilx.randomNum(8);
      var newfilename = `${randomNum}_${filename}`;
      ret = path.join(uploadDir, newfilename);
    } while (fs.exists(ret));
    return ret;
  };

  function writeBuffer(bf, thePath, pos) {
    var fd = fs.openSync(thePath, 'a+');
    fs.writeSync(fd, bf, 0, bf.length, Number(pos) || 0);
    console.log(
      `write buffer, pos: ${pos}, path: ${thePath}, length: ${bf.length}`,
    );
  }

  var uploadSuccess = function (fileInfo, userId, fileName) {
    fileInfo.status = STATUS_FILE_READY;
    fileInfo.save();
    uploadListTbl.update(
      {
        status: STATUS_FILE_READY,
      },
      {
        where: {
          b_resource_id: fileInfo.id,
          b_user_id: userId,
          filename: fileName,
        },
      },
    );
    log.debug(
      fileInfo.path + ' offset ' + fileInfo.offset + ': end............',
    );
    im.convert(
      [fileInfo.path + '[1]', '-resize', '256x256', fileInfo.thumbnailPath],
      function (err, stdout) {
        if (err) {
          log.error(api.apiPath + api.userUploadPOST.path, 'convert...', err);
          return;
        }
      },
    );
  };

  var uploadFailed = function (fileInfo) {
    fs.exists(fileInfo.path, function (exists) {
      if (exists) {
        fs.unlink(fileInfo.path);
      }
    });
    fileInfo.offset = 0;
    fileInfo.status = STATUS_FILE_INVALID;
    fileInfo.save();
  };

  var checkData = function (
    fileInfo,
    userId,
    filename,
    successCallback,
    failedCallback,
  ) {
    var stream = fs.createReadStream(fileInfo.path);
    var md5sum = crypto.createHash('md5');
    stream.on('data', function (chunk) {
      md5sum.update(chunk);
    });
    stream.on('end', function () {
      var str = md5sum.digest('hex');
      if (str === fileInfo.md5) {
        successCallback(fileInfo, userId, filename);
      } else {
        log.debug('file: ' + fileInfo.path + ' invalid md5');
        failedCallback(fileInfo);
      }
    });
  };

  function* getUploadInfo(md5, fileName, userId) {
    var url;
    var snap;
    var offset = 0;
    var materialId = 0;
    var status = STATUS_FILE_INVALID;
    var uploadResource = yield uploadResourceTbl.findOne({
      where: {
        md5: md5,
      },
    });

    if (uploadResource) {
      offset = uploadResource.offset;
      url = uploadResource.path.substr(
        uploadResource.path.lastIndexOf('/upload/'),
      );
      snap = uploadResource.thumbnailPath.substr(
        uploadResource.thumbnailPath.lastIndexOf('/upload/'),
      );
      var uploadList = yield uploadListTbl.findOne({
        where: {
          b_user_id: userId,
          filename: fileName,
          b_resource_id: uploadResource.id,
        },
      });
      if (uploadList) {
        materialId = uploadList.id;
        status = uploadList.status;
      }
    }

    return {
      materialId: materialId,
      md5: md5,
      offset: offset,
      url: url,
      snap: snap,
      status: status,
    };
  }

  function checkFileType(fileName) {
    var extList = [
      {
        ext: '.jpg',
        type: 'IMG/JPG',
      },
      {
        ext: '.jpeg',
        type: 'IMG/JPG',
      },
      {
        ext: '.png',
        type: 'IMG/PNG',
      },
      {
        ext: '.gif',
        type: 'IMG/GIF',
      },
      {
        ext: '.mp4',
        type: 'VID/MP4',
      },
      {
        ext: '.avi',
        type: 'VID/AVI',
      },
      {
        ext: '.mov',
        type: 'VID/MOV',
      },
    ];

    var fileType;
    var pattern = new RegExp('[`!*|/\\?]');
    if (pattern.test(fileName)) {
      return null;
    }
    var fileExt = fileName.substr(fileName.lastIndexOf('.')).toLowerCase();
    for (var i = 0; i < extList.length; i++) {
      if (fileExt === extList[i].ext) {
        fileType = extList[i].type;
      }
    }

    return fileType;
  }

  router.get(api.apiPath + api.userUploadGET.path, function* () {
    this.checkParams('md5').notEmpty();
    this.checkQuery('filename').notEmpty();
    if (this.errors) {
      this.body = this.errors;
      this.status = 400;
      return;
    }

    var md5 = this.params.md5;
    var fileName = this.query.filename;
    var userId = yield currentUserId.apply(this);
    this.body = yield getUploadInfo(md5, fileName, userId);
    this.status = 200;

    return;
  });

  var exception_process = (fileInfo) => {
    fs.stat(fileInfo.path, function (err, stats) {
      if (err) {
        log.error(
          api.apiPath + api.userUploadPOST.path,
          'connect aborted...',
          err,
        );
        return;
      }
      co(function* () {
        fileInfo.offset = stats.size;
        log.debug(
          fileInfo.path +
            ' offset ' +
            fileInfo.offset +
            ': aborted............',
        );
        yield fileInfo.save();
        return;
      });
      return;
    });
  };

  router.post(api.apiPath + api.userUploadPOST.path, function* () {
    this.checkParams('md5').notEmpty();
    this.checkQuery('filesize').notEmpty().toInt();
    if (this.errors) {
      this.body = this.errors;
      this.status = 400;
      return;
    }

    var md5 = this.params.md5;
    var filesize = parseInt(this.query.filesize, 10);
    var filename =
      decodeURIComponent(this.query.filename) || 'unnamed-file.mov';
    var type = this.query.type || 1;
    var isTransmission = true;
    var fileType = checkFileType(filename);
    if (!fileType) {
      this.body = [
        {
          error: filename + ': file is not support!',
        },
      ];
      this.status = 400;
      return;
    }

    var userId = yield currentUserId.apply(this);
    var cnt = yield uploadListTbl.count({
      where: {
        b_user_id: userId,
      },
    });
    if (cnt >= maxFileCnt) {
      this.body = [
        {
          error: filename + ' ' + cnt + ': user have too much material!',
        },
      ];
      this.status = 400;
      return;
    }
    if (filesize >= maxFileSize) {
      this.body = [
        {
          error: filename + ' ' + filesize + ': file is too big!',
        },
      ];
      this.status = 400;
      return;
    }

    var fileInfo = yield db
      .transaction(function (t) {
        return co(function* () {
          var resource = yield uploadResourceTbl.findOne({
            where: {
              md5: md5,
            },
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          if (resource) {
            // 注释部分为关闭断点续传功能
            // if (resource.status === STATUS_FILE_UPLOADING) {
            //     isTransmission = false;
            // } else

            if (resource.status === STATUS_FILE_INVALID) {
              resource.status = STATUS_FILE_UPLOADING;
              yield resource.save({
                transaction: t,
              });
            }
          }

          return resource;
        });
      })
      .catch((err) => {
        log.error(err.toString());
        this.body = [
          {
            error: 'md5 is not exist',
          },
        ];
        this.status = 400;
        return null;
      });

    if (fileInfo === null) {
      var filePath = newFileName(
        filename,
        fileType.split('/')[0] === 'IMG' ? picDir : vidDir,
      );
      var thumbnailName = newFileName(
        filename.substr(0, filename.lastIndexOf('.')) + '-small.png',
        thumbnailDir,
      );
      fileInfo = yield uploadResourceTbl.create({
        path: filePath,
        offset: 0,
        tdate: new Date(),
        type: fileType,
        thumbnailPath: thumbnailName,
        md5: md5,
        status: STATUS_FILE_UPLOADING,
      });
    }

    var uploadList = yield uploadListTbl.findOne({
      where: {
        b_resource_id: fileInfo.id,
        b_user_id: userId,
        filename: filename,
      },
    });

    if (uploadList === null) {
      uploadList = yield uploadListTbl.create({
        b_user_id: userId,
        filename: filename,
        b_resource_id: fileInfo.id,
        tdate: new Date(),
        status: STATUS_FILE_UPLOADING,
        type: type,
      });
    }

    if (fileInfo.offset < filesize && isTransmission) {
      this.req.on('aborted', () => {
        if (fileInfo === undefined) {
          return;
        }
        exception_process(fileInfo);
        return;
      });

      var part;
      var parts = fileParse(this);
      try {
        while ((part = yield parts)) {
          if (part.length) {
          } else {
            var stream = fs.createWriteStream(fileInfo.path, {
              flags: 'a',
            });
            part.pipe(stream).on('finish', function () {
              fs.stat(fileInfo.path, function (err, stats) {
                if (err) {
                  log.error(
                    api.apiPath + api.userUploadPOST.path,
                    'pipe finish...',
                    err,
                  );
                  return;
                }
                if (filesize === stats.size) {
                  fileInfo.offset = filesize;
                  checkData(
                    fileInfo,
                    userId,
                    filename,
                    uploadSuccess,
                    uploadFailed,
                  );
                } else if (filesize < stats.size) {
                  log.debug('file :' + fileInfo.path + ' size is too big ');
                  uploadFailed(fileInfo);
                }
                return;
              });
            });
            log.debug(
              fileInfo.path +
                ' offset ' +
                fileInfo.offset +
                ': writing............',
            );
          }
        }
      } catch (err) {
        log.error('catch :' + err);
        exception_process(fileInfo);
        this.body = [
          {
            success: false,
            file_path: fileInfo.path,
          },
        ];
        this.status = 400;
        return;
      }
    } else if (filesize === fileInfo.offset) {
      if (fileInfo.status !== STATUS_FILE_READY) {
        //极小概率进入
        fileInfo.status = STATUS_FILE_READY;
        yield fileInfo.save();
      }
      if (uploadList.status !== STATUS_FILE_READY) {
        //删除后恢复
        uploadList.status = STATUS_FILE_READY;
        yield uploadList.save();
      }
    } else {
      //只有在异常(fileInfo.offset > filesize)和关闭断点续传功能才进入
      uploadFailed(fileInfo);
    }
    var url = fileInfo.path.substr(fileInfo.path.lastIndexOf('/upload/'));
    var snap = fileInfo.thumbnailPath.substr(
      fileInfo.thumbnailPath.lastIndexOf('/upload/'),
    );

    this.body = {
      materialId: uploadList.id,
      success: true,
      md5: md5,
      url: url,
      snap: snap,
    };
    this.status = 200;
    return;
  });

  router.delete(api.apiPath + api.userUploadDEL.path, function* () {
    //TODO 根据materialId删除
    this.checkParams('md5').notEmpty();
    if (this.errors) {
      this.body = this.errors;
      this.status = 400;
      return;
    }

    var md5 = this.params.md5;
    var userId = yield currentUserId.apply(this);
    var fileInfo = yield uploadResourceTbl.findOne({
      where: {
        md5: md5,
      },
    });
    if (fileInfo === null) {
      this.body = [
        {
          error: 'md5 is not exist',
        },
      ];
      this.status = 400;
      return;
    }

    var uploadList = yield uploadListTbl.update(
      {
        status: STATUS_FILE_REMOVE,
      },
      {
        where: {
          b_resource_id: fileInfo.id,
          b_user_id: userId,
          status: STATUS_FILE_READY,
        },
      },
    );

    if (uploadList === null) {
      this.body = [
        {
          error: 'file is not exist',
        },
      ];
      this.status = 400;
      return;
    }

    this.status = 200;
    this.body = {};
    return;
  });

  router.get(api.apiPath + api.materialListGET.path, function* () {
    this.checkQuery('perpage').notEmpty().isInt().toInt();
    this.checkQuery('page').notEmpty().isInt().toInt();
    this.checkParams('userDbid').notEmpty();
    if (this.errors) {
      this.body = this.errors;
      this.status = 400;
      return;
    }

    var perpage = this.query.perpage;
    var page = this.query.page;
    var userId = yield currentUserId.apply(this);
    var uploadList = yield uploadListTbl.findAndCountAll({
      where: {
        b_user_id: userId,
        status: STATUS_FILE_READY,
        type: 1,
      },
      attributes: ['id', 'filename', 'tdate', 'status'],
      limit: perpage,
      offset: (page - 1) * perpage,
      order: [['id', 'DESC']],
      include: [
        {
          model: uploadResourceTbl,
          attributes: ['path', 'thumbnailPath', 'md5'],
        },
      ],
    });

    uploadList.rows.map((data) => {
      var tmp = data.b_resource.thumbnailPath;
      data.b_resource.thumbnailPath = tmp.substr(tmp.lastIndexOf('/upload/'));
      tmp = data.b_resource.path;
      data.b_resource.path = tmp.substr(tmp.lastIndexOf('/upload/'));
    });

    this.status = 200;
    this.body = uploadList;
    return;
  });

  router.get(api.apiPath + api.materialServerGET.path, function* () {
    this.body = {
      uploadServer: uploadServer,
      uploadServerPort: uploadServerPort,
      fileServer: fileServer,
      fileServerPort: fileServerPort,
      maxFileSize: maxFileSize,
    };
    this.status = 200;
    return;
  });
};
