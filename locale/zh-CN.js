// 此 Object 中的 value 一般来说是纯字符串格式比如 '示例' ，也可以内置变量的格式比如 '\'示例\' + x[0][0]' 。
// 使用变量比如 x[0][0] 和 JS 代码（会被 common/locale.js 中的 eval()执行）可以让翻译更准确，比如“注资11亿美金”可以被翻译为“$1.1b investment”。
// 这里的 x 与 common/locale.js 中的 x 都称呼为 x 以便让 common/locale.js 中的 eval() 能够正常调用。

// 注意：此 Object 中带有变量的 value 的写法不要使用 '示例`${x[0][0]}`' 而只能 '\'示例\' + x[0][0]' ，
// 因为虽然浏览器中的 eval() 支持前一种写法但是 react-native 中的 eval() 不支持。

module.exports = {
    appLoginPOST_0: '手机号不能为空',
    appLoginPOST_1: '密码不能为空',
    appLoginPOST_2: '手机号或密码不正确',
    loginVerificationPOST_0: '手机号不能为空',
    loginVerificationPOST_1: '验证码不能为空',
    loginVerificationPOST_2: '手机号或验证码不正确',

    systemUnkownError: '系统未知错误'
};
