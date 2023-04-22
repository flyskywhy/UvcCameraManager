var Locale = require('../locale');

// 这里的 x 与比如 locale/zh-CN.js 中的 x 都称呼为 x 以便让 eval() 能够正常调用。
// 这里的 x 必须是二维数组，就是象 [['节目1', '节目2', '节目3'], ['屏幕1', '屏幕2', '屏幕3']] 这样的形式，
// 以便与比如 locale/zh-CN.js 中的 x[0][0] （也就是调用了前面例子中的 '节目1' ）对应起来。
exports.localeGet = function (locale, key, x) {
  var l = Locale['en-US'];
  if (Locale.hasOwnProperty(locale)) {
    l = Locale[locale];
  } else if (locale.length >= 2) {
    for (let loc of Object.keys(Locale)) {
      if (loc.slice(0, 2) === locale.slice(0, 2)) {
        l = Locale[loc];
        break;
      }
    }
  }

  if (l) {
    if (x) {
      // eval() 在 react-native 0.60 开始可选采用的 JS 引擎 hermes 中不再支持
      // https://github.com/facebook/hermes/blob/master/doc/Features.md
      // 所以这里以 Function 代替
      /* eslint-disable no-new-func */
      var EVAL = new Function('lKey', 'return lKey');
      return EVAL(l[key] || key);
      /* eslint-enable no-new-func */
    } else {
      return l[key] || key;
    }
  } else {
    return key;
  }
};
