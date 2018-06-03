/// <reference path="../steps.d.ts" />
'use strict';

let I, AllowLocationFragment, generalPage, WelcomePage;

module.exports = {
    _init() {
        I = require('../custom_steps.js')();
        AllowLocationFragment = require('../fragments/AllowLocation');
        AllowLocationFragment._init();
        generalPage = require('../pages/general');
        generalPage._init();
        WelcomePage = require('../pages/Welcome');
        WelcomePage._init();
    },

    workaroundOfStartNative() {
        // 发现在 Android 上测试时，必须先弹出这种比如位置权限的对话框，然后返回，
        AllowLocationFragment.permissionAllow();

        // 再配合一些 APP 画面的改变比如这里对 Welcome 也就是引导页面的滑动，才能
        // 让后续的比如 ~ 符号开头的 accessibilityLabel 表示的页面元素被顺利抓取
        // 以开始正常测试。
        // 这里实际上只需要滑动 1 次就可以让测试正常了，不过为了配合 4 幅引导页，简
        // 便起见，直接滑动了 3 次。
        // 另外，如果 APP 一开始能自己做一些画面的改变比如 toast 显示一个字符，则这
        // 里的滑动操作就不再需要了。
        I.runOnAndroid(() => {
            generalPage.swipeLeft(3);
        });
        I.runOnIOS(() => {
            generalPage.swipeLeft(3);
        });
    },

    toHome() {
        I.runInWeb(() => {
            I.amOnPage('/');
        });

        this.workaroundOfStartNative();

        I.runOnAndroid(() => {
            WelcomePage.clickStart();
        });
        I.runOnIOS(() => {
            WelcomePage.clickStart();
        });
    }
};
