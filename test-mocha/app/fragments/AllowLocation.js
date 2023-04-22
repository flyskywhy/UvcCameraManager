/// <reference path="../steps.d.ts" />
'use strict';

let I;

module.exports = {
  _init() {
    I = require('../custom_steps.js')();
  },

  permissionOkButton: {
    android: {
      id: 'com.android.packageinstaller:id/permission_allow_button',
    },
  },

  permissionAllow() {
    this.permissionOkButton[process.profile] &&
      I.click(this.permissionOkButton[process.profile]);
  },
};
