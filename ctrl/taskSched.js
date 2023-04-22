var co = require('co');

var log = require('../instances/log.js');

var taskQueue = [];

exports.register = function (fn, interval, immediate) {
  log.debug('schedule recurring task', fn.name, interval, immediate);

  if (immediate) {
    setInterval(function () {
      co(fn);
    }, 1000 * 60 * 5);
  }

  var timer = setInterval(function () {
    co(fn);
  }, interval);

  taskQueue.push(timer);

  log.debug('total recurring tasks', taskQueue.length);

  return taskQueue.lenght;
};
