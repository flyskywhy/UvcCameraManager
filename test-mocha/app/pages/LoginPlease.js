/// <reference path="../steps.d.ts" />
'use strict';

let I;

module.exports = {
    _init() {
        I = require('../custom_steps.js')();
    },

    ensureLoginPleasePageIsLoaded() {
        I.waitForVisible('~请先登录', 5);
    },

    toLogin() {
        this.ensureLoginPleasePageIsLoaded();
        I.click('~请先登录');
    }
};
