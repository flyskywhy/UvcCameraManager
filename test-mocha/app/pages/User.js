/// <reference path="../steps.d.ts" />
'use strict';

let I;

module.exports = {
    _init() {
        I = require('../custom_steps.js')();
    },

    ensureHomePageIsOpen() {
        console.log('ensureHomePageIsOpen');
    }
};
