var Locale = require('../locale');

// 这里的 x 与比如 locale/zh-CN.js 中的 x 都称呼为 x 以便让 eval() 能够正常调用。
// 这里的 x 必须是二维数组，就是象 [['情景1', '情景2', '情景3'], ['设备1', '设备2', '设备3']] 这样的形式，
// 以便与比如 locale/zh-CN.js 中的 x[0][0] （也就是调用了前面例子中的 '情景1' ）对应起来。
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
