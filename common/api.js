// status 和 body 代表返回的数据
// status 如果是 200 的话都是代表正常返回，因此下面皆未重复描述
// 以下除 apiPath 外，皆按字母排序以方便查找
// http访问错误类型 ：
// 200正常
// 400错误（具体错误信息在 ../locale/*.js 的各API中描述）
// 403无权限访问
// 404访问路径不存在
// 408请求超时
// 503服务器无法访问

module.exports = {

    appLoginPOST: {
        path: '/login/',
        // params: {},
        // query: {},
        // request: {
        //     body: {
        //         username: '',
        //         password: '',
        //     }
        // },
        // status: {
        //     400: '输入参数有误'
        // },
        // body: {
        //     data: '',
        // }
    },

    appLogoutGET: {
        path: '/logout',
        // params: {},
        // query: {},
        // request: {
        //     body: {}
        // },
        // status: {
        //     200: '正常'
        // },
        // body: {}
    },

    changeUserPasswdPOST: {
        method: 'post',
        path: '/changeUserPasswd',
        // params: {},
        // query: {},
        // request: {
        //     body: {
        //         oldpasswd: '',
        //         newpasswd: ''
        //     }
        // },
        // status: {
        //     400: '输入参数有误'
        // },
        // body: {}
    },

    changeUserNamePOST: {
        method: 'post',
        path: '/changeUserName',
        // params: {},
        // query: {},
        // request: {
        //     body: {
        //         name: ''
        //     }
        // },
        // status: {
        //     400: '输入参数有误'
        // },
        // body: {}
    },

    checkLoginGET: { //  确认是否登录
        path: '/usr/:userDbid/checkLogin',
        // params: {
        //     userDbid: ''
        // },
        // query: {},
        // request: {
        //     body: {}
        // },
        // status: {
        //     400: '输入参数有误'
        // },
        // body: {
        //     data: '',
        //     code: '200 代表正常， 400 反之'
        // },
        // bodyError: {
        //     data: '错误的具体原因',
        //     code: ''
        // }
    },

    checkUserExistenceGET: { //检查该用户是否已经存在
        path: '/usrExistence',
    },

    currentUserIdGET: {
        method: 'get',
        path: '/usr/currentUserId',
    },

    registerPOST: {
        path: '/regUserVerification',
        // params: {},
        // query: {},
        // request: {
        //     body: {
        //         phone: '',
        //         password: ''
        //         verifCode: ''
        //     }
        // },
        // status: {
        //     400: '输入参数有误'
        // },
        // body: {}
    },

    userInfoGET: { // 用户信息的获取
        path: '/usr/',
        // params: {
        //     userDbid: ''
        // },
        // query: {},
        // request: {},
        // status: {
        //     400: '输入参数有误'
        // },
        // body: {},
        // }
    },

    userInfoPOST: { // 用户信息的添加，修改
        path: '/usr/',
        // params: {
        //     userDbid: ''
        // },
        // query: {},
        // request: {
        //     body: {
        //         phone: '',
        //         name: '',
        //         password: '',
        //         email: '',
        //         addr: '',
        //         headimage: ''
        //     }
        // },
        // status: {
        //     400: '输入参数有误'
        // },
        // body: {},
        // }
    },

    userVerificationPUT: { // 用户通过手机号码获取验证码
        path: '/usrVeri/mobile/',
        // params: {
        //     mobile: ''
        // },
        // query: {},
        // request: {
        //     body: {
        //     }
        // },
        // status: {
        //     400: '输入参数有误'
        // },
        // body: {}
    },

    userForgetPasswdVerificationPUT: { // 用户通过手机号码获取忘记密码验证码
        path: '/usrForgetPwdVeri/mobile/',
        // params: {
        //     mobile: ''
        // },
        // query: {},
        // request: {
        //     body: {
        //     }
        // },
        // status: {
        //     400: '输入参数有误'
        // },
        // body: ''
    },

    userResetPasswdPOST: { // 用户重置密码
        path: '/usrResetPwd',
        // params: {},
        // query: {},
        // request: {
        //     body: {
        //         phone: '',
        //         password: ''
        //         verifCode: ''
        //     }
        // },
        // status: {
        //     400: '输入参数有误'
        // },
        // body: userId
    },

    versionGET: {
        method: 'get',
        path: '/ver', //获得版本号
        // params: {},
        // query: {},
        // request: {
        //     body: {}
        // },
        // status: {
        // },
        // body: {}
    },

    bindPhoneSendGET: {
        method: 'get',
        path: '/bindMobile/send',
        // query: {
        //     phone: ''
        // },
        // status: {
        //     400: '输入参数有误'
        // },
        // body: {}
    },

    bindPhoneVerifyGET: {
        method: 'get',
        path: '/bindMobile/veri',
        // query: {
        //     phone: '',
        //     verifycode: ''
        // },
        // status: {
        //     400: '输入参数有误'
        // },
        // body: {}
    },

    loginVerificationPUT: { // 用户通过手机号码获取登录验证码
        path: '/loginVeri/mobile/',
        // params: {
        //     mobile: ''
        // },
        // query: {},
        // request: {
        //     body: {
        //     }
        // },
        // status: {
        //     400: '参数错误'
        // },
        // body: {}
    },

    loginVerificationPOST: { // 通过验证码登录
        path: '/loginVeri/',
        // params: {},
        // query: {},
        // request: {
        //     body: {
        //         username: '',
        //         verifycode: ''
        //     }
        // },
        // status: {
        //     400: '参数错误'
        // },
        // body: {}
    },

    apiPath: '/apiv1',
    apiErrParse: function(message, type) {
        var errCode = 'systemUnkownError';

        if (Object.prototype.toString.call(message) !== '[object String]' ||
            Object.prototype.toString.call(type) !== '[object String]') {
            return errCode;
        }

        if (message.substr(0, type.length) === type) {
            errCode = message;
        }
        return errCode;
    }
};
