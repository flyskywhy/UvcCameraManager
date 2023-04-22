/// <reference path="../steps.d.ts" />
'use strict';

let I;

module.exports = {
  _init() {
    I = require('../custom_steps.js')();
  },

  toLoginPlease() {
    // 这里不能用 ~个人中心 ，因为在 Native 上是抓取屏幕因而只抓取到 1 个“请先登录”而没有问题，但是在
    // Web 上不是抓取屏幕而是获取 DOM 数据，而此时 DOM 中存在 3 个 “请先登录”， I.click 会默认点击
    // 抓取到的第一个元素，但此时这第一个来自“屏幕管理”页面的“请先登录”是处于屏幕之外的，这会导致
    // chromedriver 报 element not visible 的错误。
    I.click('~屏幕管理');
  },
};
