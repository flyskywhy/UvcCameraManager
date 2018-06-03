/// <reference path="../steps.d.ts" />
'use strict';

let I;

module.exports = {
    _init() {
        I = require('../custom_steps.js')();
    },

    ensureManageScreenPageIsNotOpen() {
        I.dontSeeElement('~屏幕管理');
    },

    ensureManageScreenPageIsOpen() {
        I.seeElement('~屏幕管理');
    }
};
