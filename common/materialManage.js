var aliyun = require('./aliyun.js');
var cfg = require('../instances/config.js');
var log = require('../instances/log.js');
var crypto = require('crypto');
var fs = require('fs');
var co = require('co');
var db = require('../models/index.js');
var materialsDef = require('./Defines.js').moduleStatus.materialOss;
var materialOssDesc = require('./Defines.js').materialOssDesc;
var events = require('events');

var MaterialOss = db.models.b_material_oss;

var localPath = '/tmp/';

var emitter = new events.EventEmitter();

function calcFileMd5(filename, callback) {

    var fsHash = crypto.createHash('md5');
    var filestream = fs.createReadStream(filename);
    filestream.on('data', function(chunk) {
        fsHash.update(chunk);
    });

    filestream.on('end', function() {
        var file_md5 = fsHash.digest('hex');
        callback(file_md5, filename);
    });
}

function calcStreamMd5(fstream, callback) {

    // for test
    // var fileres = fstream.pipe(fs.createWriteStream('/tmp/tmp00.log'));

    var fsHash = crypto.createHash('md5');

    fsHash.setEncoding('hex');
    fstream.pipe(fsHash);

    fstream.on('end', function() {
        fsHash.end();
        // calcFileMd5('/tmp/tmp00.log', function(data, res) {
        //     log.debug('========== tmp00.log md5:', data);
        // });
        callback(fsHash.read());
    });
}


function* resizeImage(userid, bucket, object, t) {

    for (var i = 0; i < cfg.aliyun_mts.input.imageStyle.length; i++) {

        var imgObj = '/' + object + '@!' + cfg.aliyun_mts.input.imageStyle[i];
        var filename = cfg.aliyun_mts.input.imageStyle[i] + '_' + object.substr(object.lastIndexOf('/') + 1);
        var localFile = localPath + filename;
        var imageRes = yield aliyun.OSSGetObject(bucket, imgObj, localFile);

        if (imageRes.res.status != 200) {
            log.info('Get Object', imgObj, ' failed,', imageRes.res.status);
            return;
        }

        calcFileMd5(localFile, function(data, res) {
            co(function*() {
                    var imgResize = object.substr(0, object.lastIndexOf('/') + 1) +
                        res.substr(res.lastIndexOf('/') + 1);
                    var uploadRes = yield aliyun.OSSPutObject(cfg.aliyun_mts.output.bucket, imgResize, res);

                    if (uploadRes.res.status != 200) {
                        log.info(' uplaod %s, faield, %d', imgResize, uploadRes.res.status);
                        return;
                    }

                    var material_oss = {
                        b_user_id: userid,
                        filename: imgResize,
                        etag: uploadRes.res.headers.etag,
                        md5: data,
                        md5_type: materialOssDesc.md5_type.overall.val,
                        status: materialsDef.valid.val,
                        type: materialOssDesc.type.resize.val,
                        last_modified: new Date(uploadRes.res.headers.date)
                    };

                    fs.unlink(res, (err) => {
                        if (err) {
                            log.info('remove local file failed', res);
                        }
                    });

                    log.info(' OK! upload materials ', uploadRes.res.requestUrls, 'md5 is:', data);

                    yield db.transaction(function(t) {
                            return co(function*() {
                                yield MaterialOss.upsert(material_oss, {
                                    transaction: t
                                });

                            });
                        })
                        .catch(err => {
                            log.error(' resize Image:', imgResize, 'failed,', err.toString());
                        });

                })
                .catch(function(err) {
                    log.error(' uplaod object:', res, ' failed,', err.toString());
                });
        });

    }
}

function* materialOssStreamMd5(userid, bucket, object, t) {

    var bytesnum = materialOssDesc.md5_type.partial.from +
        materialOssDesc.md5_type.partial.length - 1;

    var streamRes = yield aliyun.OSSGetStream(bucket, object, {
        headers: {
            Range: 'bytes=' + materialOssDesc.md5_type.partial.from + '-' + bytesnum,
        }
    });

    calcStreamMd5(streamRes.stream, function(data) {

        co(function*() {

            var material_oss = {
                b_user_id: userid,
                filename: object,
                etag: streamRes.res.headers.etag,
                md5: data,
                md5_type: materialOssDesc.md5_type.partial.val,
                status: materialsDef.valid.val,
                type: materialOssDesc.type.original.val,
                last_modified: new Date(streamRes.res.headers['last-modified']),
            };
            log.info(' File:', object, 'partial md5 is:', data);
            yield MaterialOss.upsert(material_oss, {
                transaction: t
            });

        });
    });
}

function transcodedVideosName(object) {
    var filename = object.substr(object.lastIndexOf('/') + 1);

    var prePath = object.substr(0, object.lastIndexOf('/') + 1);
    var transFname = [];
    transFname.push(prePath + cfg.programTemplate.vgaExt + filename + cfg.programTemplate.suffixExt);
    transFname.push(prePath + cfg.programTemplate.qvgaExt + filename + cfg.programTemplate.suffixExt);
    transFname.push(prePath + filename + cfg.programTemplate.suffixExt);
    return transFname;
}

function* mediaTranscoded(userid, bucket, object) {

    log.debug(' transcoded media:', bucket, object);
    // 判断下是否存在原始视频
    try {
        var headRes = yield aliyun.OSSHeadObject(bucket, object);
        log.trace(' headRes:', headRes);

        if (headRes.res.status !== 200 &&
            headRes.res.status !== 304) {
            log.info('Donot exist ', object);
            return;
        }

    } catch (err) {
        log.info(err.toString(), object);
        return;
    }

    var transFname = transcodedVideosName(object);
    for (var i = 0; i < transFname.length; i++) {
        yield materialOssStreamMd5(userid, cfg.aliyun_mts.output.bucket, transFname[i]);

    }
}

function getMediaTypeFromObject(object) {
    var material_type = object.substr(object.indexOf('/') + 1);
    var mediaType = material_type.substr(0, material_type.indexOf('/'));
    return mediaType;
}

function* materialFormat(object) {
    var material = yield MaterialOss.findOne({
        where: {
            filename: object,
            status: materialsDef.valid.val,
        }
    });

    if (material && material.md5) {
        log.info(' material', object, ' has do md5! No nedd format');
        return;
    }

    var mediaType = getMediaTypeFromObject(object);

    var userid = object.substr(0, object.indexOf('/'));
    var is_template = 0;
    if (isNaN(parseInt(userid))) {
        if (Object.prototype.toString.call(userid) === '[object String]') {
            if (userid.substr(0, userid.indexOf('-')) === 'templet') {
                log.info('templet uploaded,', object);
                is_template = 1;
                userid = null;
            }
        }
    }

    var bucket = cfg.aliyun_mts.input.bucket;
    if (mediaType === 'vid') {
        //
        yield mediaTranscoded(userid, bucket, object);

    } else if (mediaType === 'pic') {
        yield materialOssStreamMd5(userid, bucket, object);

        yield resizeImage(userid, bucket, object);
    }
}

emitter.on('materialCreated', function(bucket, object, vidflag) {

    log.info('          materialCretaed', bucket, object, vidflag);

    var mediaType = getMediaTypeFromObject(object);

    if (!vidflag && mediaType === 'vid') {
        log.debug(' video %s created, wait ', object);
        return;
    }
    var userid = object.substr(0, object.indexOf('/'));

    var is_template = 0;
    if (isNaN(parseInt(userid))) {
        if (Object.prototype.toString.call(userid) === '[object String]') {
            if (userid.substr(0, userid.indexOf('-')) === 'templet') {
                log.info('templet uploaded,', object);
                is_template = 1;
                userid = null;
            }
        }
    }

    if (mediaType === 'vid') {
        //
        co(function*() {
            yield mediaTranscoded(userid, bucket, object);
        });

    } else if (mediaType === 'pic') {
        co(function*() {
            yield materialOssStreamMd5(userid, bucket, object);

            yield resizeImage(userid, bucket, object);
        });
    }

});

var materialCreated = function(bucket, object, vidflag) {

    emitter.emit('materialCreated', bucket, object, vidflag);

    return;
};

var removeMaterial = function*(object, t) {

    var mediaType = getMediaTypeFromObject(object);

    var fnames = [];
    if (mediaType === 'vid') {
        fnames = transcodedVideosName(object);
    } else if (mediaType === 'pic') {
        fnames.push(object);
        var prePath = object.substr(0, object.lastIndexOf('/') + 1);
        for (var style of cfg.aliyun_mts.input.imageStyle) {
            fnames.push(prePath + style + '_' + object.substr(object.lastIndexOf('/') + 1));
        }
    }

    var materials = yield MaterialOss.findAll({
        where: {
            status: materialsDef.valid.val,
            filename: {
                $in: fnames
            }
        },
        transaction: t
    });

    if (!materials.length) {
        log.info('Couldnot find the removed file.', object, fnames);
        return;
    }

    console.log(' .. remove fnames:', fnames);
    for (var material of materials) {
        material.status = materialsDef.invalid.val;
        material.last_modified = new Date();

        yield material.save({
            transaction: t
        });

    }

};

module.exports = {
    materialCreated,
    removeMaterial,
    materialFormat,
};
