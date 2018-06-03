import {
    createAction
} from 'redux-actions';
import * as types from '../constants/ActionTypes';
import * as userService from '../services/userService';
import * as tokenService from '../services/token';
import * as storageService from '../services/storage';

export const login = createAction(types.LOGIN, async(username, password) => {
    const userLoginInfo = await userService.login(username, password);
    const user = await userService.getUserInfo(userLoginInfo.id)
        .then(userInfo => {
            return {
                secret: userLoginInfo,
                publicInfo: userInfo
            };
        });
    return user;
}, (username, password, resolved, rejected) => {
    return {
        resolved,
        rejected,
        sync: 'user'
    };
});

export const loginCode = createAction(types.LOGIN_CODE, async(username, verifycode) => {
    const userLoginInfo = await userService.loginCode(username, verifycode);
    const user = await userService.getUserInfo(userLoginInfo.id)
        .then(userInfo => {
            return {
                secret: userLoginInfo,
                publicInfo: userInfo
            };
        });
    return user;
}, (username, verifycode, resolved, rejected) => {
    return {
        resolved,
        rejected,
        sync: 'user'
    };
});

export const checkUserExistence = createAction(types.CHECK_USER, async(phone) => {
    return await userService.checkUserExistence(phone);
}, (phone, resolved, rejected) => {
    return {
        resolved,
        rejected
    };
});

export const getVcode = createAction(types.GET_VCODE, async(phone) => {
    return await userService.getVcode(phone);
}, (phone, resolved, rejected) => {
    return {
        resolved,
        rejected
    };
});

export const getLoginVerification = createAction(types.GET_LOGIN_VERIFICATION, async(mobile) => {
    return await userService.getLoginVerification(mobile);
}, (mobile, resolved, rejected) => {
    return {
        resolved,
        rejected
    };
});

export const getBindPhoneSend = createAction(types.GET_BIND_PHONE_SEND, userService.getBindPhoneSend, ({
    resolved,
    rejected
}) => {
    return {
        resolved,
        rejected
    };
});

export const getUserChangeDevOwnerVerification = createAction(types.GET_USER_CHANGE_DEV_OWNER_VERIFICATION, async(phone) => {
    return await userService.getUserChangeDevOwnerVerification(phone);
}, (phone, resolved, rejected) => {
    return {
        resolved,
        rejected
    };
});

export const getUserForgetPasswdVerification = createAction(types.GET_USER_FORGETPASSWD_VERIFICATION, async(phone) => {
    return await userService.getUserForgetPasswdVerification(phone);
}, (phone, resolved, rejected) => {
    return {
        resolved,
        rejected
    };
});

export const register = createAction(types.REGISTER, async(phone, password, verifCode) => {
    return await userService.register(phone, password, verifCode);
}, (phone, password, verifCode, resolved, rejected) => {
    return {
        resolved,
        rejected
    };
});

export const getBindPhoneVerify = createAction(types.GET_BIND_PHONE_VERIFY, userService.getBindPhoneVerify, ({
    resolved,
    rejected
}) => {
    return {
        resolved,
        rejected
    };
});


export const checkLogin = createAction(types.CHECK_LOGIN, async() => {
    const userId = await userService.getCurrentUserId();
    const userLoginInfo = await userService.getUserLoginInfo();
    const user = await userService.getUserInfo(userId.id)
        .then(userInfo => {
            return {
                secret: userLoginInfo.data,
                publicInfo: userInfo
            };
        });
    return user;
}, () => {
    return {
        sync: 'user'
    };
});


export const checkToken = createAction(types.CHECK_TOKEN, async(token) => {
    const userLoginInfo = await userService.checkToken(token);
    const user = await userService.getUserInfo(userLoginInfo.id)
        .then(userInfo => {
            return {
                secret: userLoginInfo,
                publicInfo: userInfo
            };
        });
    tokenService.setToken(token);
    return user;
}, (token, resolved) => {
    return {
        resolved: resolved,
        sync: 'user'
    };
});


export const updateClientUserInfo = createAction(types.UPDATE_CLIENT_USER_INFO, async(user) => {
    return await userService.getUserInfo(user.secret.id)
        .then(userInfo => {
            if (userInfo) {
                return userInfo;
            } else {
                throw 'getUserInfoError';
            }
        });
}, () => {
    return {
        sync: 'user'
    };
});


export const getUserInfo = createAction(types.GET_USER_INFO, async userId => {
    return await userService.getUserInfo(userId)
        .then(userInfo => {
            if (userInfo) {
                return userInfo;
            } else {
                throw 'getUserInfoError';
            }
        });
}, userId => {
    return {
        userId,
        sync: 'user'
    };
});


export const changeUserPasswd = createAction(types.CHANGE_USER_PASSWD, userService.changeUserPasswd, ({
    resolved,
    rejected
}) => {
    return {
        resolved,
        rejected
    };
});


export const resetUserPasswd = createAction(types.RESET_USER_PASSWD, userService.resetUserPasswd, ({
    resolved,
    rejected
}) => {
    return {
        resolved,
        rejected
    };
});


export const changeUserName = createAction(types.CHANGE_USER_NAME, userService.changeUserName, ({
    resolved,
    rejected
}) => {
    return {
        resolved,
        rejected
    };
});

export const changeUserAddr = createAction(types.CHANGE_USER_ADDR, userService.changeUserAddr, ({
    resolved,
    rejected
}) => {
    return {
        resolved,
        rejected
    };
});

export const changeUserEmail = createAction(types.CHANGE_USER_EMAIL, userService.changeUserEmail, ({
    resolved,
    rejected
}) => {
    return {
        resolved,
        rejected
    };
});

export const changeUserInfo = createAction(types.CHANGE_USER_INFO, userService.changeUserInfo, ({
    resolved,
    rejected
}) => {
    return {
        resolved,
        rejected
    };
});

export const logout = function() {
    return {
        type: types.LOGOUT,
        meta: {
            sync: 'user'
        }
    };
};


export const logoutBackend = createAction(types.LOGOUT_BACKEND, userService.logoutBackend, ({
    resolved,
    rejected
}) => {
    return {
        resolved,
        rejected
    };
});


export const getBackendVersion = createAction(types.GET_BACKEND_VERSION, userService.getBackendVersion, ({
    resolved,
    rejected
}) => {
    return {
        resolved,
        rejected
    };
});


export const clear = function() {
    try {
        storageService.removeItem('device');
        storageService.removeItem('local');
        storageService.removeItem('user');
    } catch (err) {
        console.warn(err);
    }
    return {
        type: types.CLEAR
    };
};

export const clearCache = function() {
    try {
        storageService.removeItem('device');
    } catch (err) {
        console.warn(err);
    }
    return {
        type: types.CLEAR
    };
};

export const updateUserNameLocal = function(name) {
    return {
        type: types.UPDATE_USER_NAME_LOCAL,
        meta: {
            name
        }
    };
};

export const updateUserAddrLocal = function(addr) {
    return {
        type: types.UPDATE_USER_ADDR_LOCAL,
        meta: {
            addr
        }
    };
};

export const updateUserPhonerLocal = function(phone) {
    return {
        type: types.UPDATE_USER_PHONE_LOCAL,
        meta: {
            phone
        }
    };
};

export const updateUserEmailLocal = function(email) {
    return {
        type: types.UPDATE_USER_EMAIL_LOCAL,
        meta: {
            email
        }
    };
};
