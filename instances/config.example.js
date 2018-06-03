module.exports = {
    root: __dirname + '/../',
    db: {
        name: 'mysql',
        username: 'DB_USERNAME',
        pwd: 'DB_PWD',
        host: 'DB_HOST',
        port: 'DB_PORT',
        database: 'DB_DATABASE',
        toString() {
            return `${this.name}://${this.username}:${this.pwd}@${this.host}:${this.port}/${this.database}`;
        }
    },
    log: {
        access() {
            return __dirname + '/../log/access.log';
        },
        error() {
            return __dirname + '/../log/error.log';
        },
        dir() {
            return 'log';
        },
        count: 7 // keep 7 back copies
    },
    redis: {
        host: 'REDIS_HOST',
        port: 'REDIS_PORT',
        pwd: 'REDIS_PWD',
        db: 0,
        devDb: 5,
        eventDb: 8,
        pubDb: 10,
    },
    wxpay: {
        appid: 'WXPAY_APPID',
        app_secret: 'WXPAY_APP_SECRET',
        mch_id: 'WXPAY_MCH_ID',
        key: 'WXPAY_KEY',
        // 此处根据服务器的不同需要配置不同的域名，同时在微信商户——产品中心——开发配置——公众号支付——授权目录设置允许微信支付的域名
        weburl: 'http://ReactWebNative8Koa.com'
    },
    wx_login_web: {
        AppID: 'WX_LOGIN_WEB_APPID',
        AppSecret: 'WX_LOGIN_WEB_APPSECRET'
    },
    alipay: {
        partner: 'ALIPAY_PARTNER',
        key: 'ALIPAY_KEY',
        seller_email: 'ALIPAY_SELLER_EMAIL',
        account_name: 'ALIPAY_ACCOUNT_NAME',

        appId: 'ALIPAY_APPID',
        privateKey: 'ALIPAY_PRIVATEKEY',
        alipayPublicKey: 'ALIPAY_ALIPAYPUBLICKEY',

        server: 'https://ReactWebNative8Koa.com',

        alipayMapiGateWay: 'mapi.alipay.com/gateway.do?',
        alipayVerifyPath: '/gateway.do?service=notify_verify&',
        aplipayOpenAPIsGateWay: 'https://openapi.alipay.com/gateway.do?'
    },
    upload: {
        videoPath: __dirname + '/../public/upload/video/',
        picturePath: __dirname + '/../public/upload/picture/',
        thumbnailPath: __dirname + '/../public/upload/thumbnail/',
        uploadServer: '127.0.0.1',
        uploadServerPort: '8765',
        fileServer: '127.0.0.1',
        fileServerPort: '8765',
        maxFileSize: (100 * 1024 * 1024),
        maxFileCnt: 1000
    },
    programTemplate: {
        imgDuration: 3,
        playlistDuration: 3600, // seconds
        defaultDuration: 3, // TODO
        vgaExt: 'vga-',
        qvgaExt: 'qvga-',
        suffixExt: '.mp4',
        imgSuffix: ['jpg', 'png', 'gif', 'bmp', 'ico', 'jpeg'],
        vidSuffix: ['mp4', 'divx', 'avi', 'mov', 'mpeg']
    },
    server: {
        ip: 'http://ReactWebNative8Koa.com',
        port: '8765',
        slb: 'https://ReactWebNative8Koa.com:447',
    },
    aliyun_sdk: {
        accessKeyId: 'ALIYUN_SDK_ACCESSKEYID',
        secretAccessKey: 'ALIYUN_SDK_SECRETACCESSKEY',
        endpoint: 'http://green.cn-hangzhou.aliyuncs.com',
        apiVersion: '2016-12-16'
    },
    aliyun_mts: {
        cfg: {
            accessKeyId: 'ALIYUN_MTS_CFG_ACCESSKEYID',
            secretAccessKey: 'ALIYUN_MTS_CFG_SECRETACCESSKEY',
            endpoint: 'http://mts.cn-hangzhou.aliyuncs.com',
            apiVersion: '2014-06-18'
        },
        input: {
            bucket: 'ReactWebNative8Koa-oss',
            location: 'oss-cn-hangzhou',
            imageStyle: ['fit_h240', 'fit_h480'],
        },
        output: {
            bucket: 'ReactWebNative8Koa-snapshot',
            location: 'oss-cn-hangzhou',
            time: 10, //ms
            num: 5,
            interval: 10 //s
        },
        liveVideo: {
            bucket: 'ReactWebNative8Koa-live-product',
            location: 'oss-cn-shanghai'
        },
        pipelineId: 'ALIYUN_MTS_PIPELINEID',
        SignatureMethod: 'Hmac-SHA1',
        SignatureVersion: '1.0'
    },
    aliyun_oss: {
        accessKeyId: 'ALIYUN_OSS_ACCESSKEYID',
        accessKeySecret: 'ALIYUN_OSS_ACCESSKEYSECRET',
        RoleArn: 'ALIYUN_OSS_ROLEARN',
        RoleSessionName: 'external-username',
    },
    alidayu: {
        accessKeyId: 'ALIDAYU_ACCESSKEYID',
        accessKeySecret: 'ALIYUN_OSS_ACCESSKEYSECRET',
    },
    device: {
        maxInterval: 1800, //seconds
        segmentLen: 1024,
        pubDelay: 2,
        registerKey: 'DEVICE_REGISTERKEY'
    },
};
