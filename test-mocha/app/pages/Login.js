/// <reference path="../steps.d.ts" />
'use strict';

let I;

module.exports = {
    _init() {
        I = require('../custom_steps.js')();
    },

    ensureLoginPageIsLoaded() {
        I.waitForVisible('~登录', 5);
    },


    login(user, password) {
        this.ensureLoginPageIsLoaded();
        I.fillField('~手机号', user + '');
        I.fillField('~密码', password);

        // 密码键盘无法被屏幕抓取软件比如 Appium 抓取，所以使用在键盘外点击的方式来达到隐藏键盘的目的
        // I.hideDeviceKeyboard('pressKey', 'Done');
        I.click('~输入密码');

        I.click('~登录');
    }
};
