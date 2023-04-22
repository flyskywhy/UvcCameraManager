import * as requestService from './request';
import config from '../configs';

export function login(username, password) {
  return requestService.post(config.api.appLoginPOST.path, {
    username,
    password,
  });
}

export function loginCode(username, verifycode) {
  return requestService.post(config.api.loginVerificationPOST.path, {
    username,
    verifycode,
  });
}

export function getVcode(phone) {
  return requestService.put(config.api.userVerificationPUT.path + phone, {});
}

export function getLoginVerification(mobile) {
  return requestService.put(config.api.loginVerificationPUT.path + mobile, {});
}

export function getBindPhoneSend({phone}) {
  return requestService.get(config.api.bindPhoneSendGET.path, {
    phone,
  });
}

export function getUserChangeDevOwnerVerification(phone) {
  return requestService.put(
    config.api.userChangeDevOwnerVerificationPUT.path + phone,
    {},
  );
}

export function getUserForgetPasswdVerification(phone) {
  return requestService.put(
    config.api.userForgetPasswdVerificationPUT.path + phone,
    {},
  );
}

export function checkUserExistence(phone) {
  return requestService.get(config.api.checkUserExistenceGET.path, {
    phone,
  });
}

export function register(phone, password, verifCode) {
  return requestService.post(config.api.registerPOST.path, {
    phone,
    password,
    verifCode,
  });
}

export function getCurrentUserId() {
  return requestService.get(config.api.currentUserIdGET.path);
}

export function getBindPhoneVerify({phone, verifycode}) {
  return requestService.get(config.api.bindPhoneVerifyGET.path, {
    phone,
    verifycode,
  });
}

export function checkToken(token) {
  return requestService
    .post('/accesstoken', {
      accesstoken: token,
    })
    .then((data) => {
      if (data.success) {
        data.token = token;
        return data;
      }
      throw 'wrong token';
    });
}

export function getUserLoginInfo() {
  return requestService.get(
    config.api.checkLoginGET.path.replace(/:userDbid/, 0),
  );
}

export function getUserInfo(id) {
  return requestService.get(config.api.userInfoGET.path + id);
}

export function changeUserPasswd({oldpasswd, newpasswd}) {
  return requestService.post(config.api.changeUserPasswdPOST.path, {
    oldpasswd,
    newpasswd,
  });
}

export function resetUserPasswd({phone, password, verifCode}) {
  return requestService.post(config.api.userResetPasswdPOST.path, {
    phone,
    password,
    verifCode,
  });
}

export function changeUserName({name}) {
  return requestService.post(config.api.changeUserNamePOST.path, {
    name,
  });
}

export function getBackendVersion(query = {}) {
  return requestService.get(config.api.versionGET.path);
}

export function logoutBackend() {
  return requestService.get(config.api.appLogoutGET.path, {});
}

export function changeUserAddr({addr, id}) {
  return requestService.post(config.api.userInfoPOST.path + id, {
    addr,
  });
}

export function changeUserEmail({email, id}) {
  return requestService.post(config.api.userInfoPOST.path + id, {
    email,
  });
}

export function changeUserInfo({id, name, phone, email, addr}) {
  return requestService.post(config.api.userInfoPOST.path + id, {
    name,
    phone,
    email,
    addr,
  });
}
