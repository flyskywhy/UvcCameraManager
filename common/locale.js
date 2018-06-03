var Locale = require('../locale');

// 这里的 x 与比如 locale/zh-CN.js 中的 x 都称呼为 x 以便让 eval() 能够正常调用。
// 这里的 x 必须是二维数组，就是象 [['节目1', '节目2', '节目3'], ['屏幕1', '屏幕2', '屏幕3']] 这样的形式，
// 以便与比如 locale/zh-CN.js 中的 x[0][0] （也就是调用了前面例子中的 '节目1' ）对应起来。
exports.localeGet = function(locale, key, x) {
    var l = Locale[locale];

    if (l) {
        if (x) {
            return eval(l[key]);
        } else {
            return l[key];
        }
    } else {
        return '';
    }
};
