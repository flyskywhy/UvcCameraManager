/// <reference path="../steps.d.ts" />
'use strict';

let I;

module.exports = {
  _init() {
    I = require('../custom_steps.js')();
  },

  clickStart() {
    I.click('~马上启动');
  },
};
