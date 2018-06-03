// 此 Object 中的 value 一般来说是纯字符串格式比如 '示例' ，也可以内置变量的格式比如 '\'示例\' + x[0][0]' 。
// 使用变量比如 x[0][0] 和 JS 代码（会被 common/locale.js 中的 eval()执行）可以让翻译更准确，比如“注资11亿美金”可以被翻译为“$1.1b investment”。
// 这里的 x 与 common/locale.js 中的 x 都称呼为 x 以便让 common/locale.js 中的 eval() 能够正常调用。

// 注意：此 Object 中带有变量的 value 的写法不要使用 '示例`${x[0][0]}`' 而只能 '\'示例\' + x[0][0]' ，
// 因为虽然浏览器中的 eval() 支持前一种写法但是 react-native 中的 eval() 不支持。

var NameContainIllegalCharacters = '名字含有非法字符';
var PaginationInvalid = '分页参数非法';
var RequestParameterInvalid = '请求参数错误';
var ScreenModeInvalid = '不支持的业务模式';
var NoPermissionToPerformOperation = '没有权限执行该操作';

module.exports = {
    appLoginPOST_0: '手机号不能为空',
    appLoginPOST_1: '密码不能为空',
    appLoginPOST_2: '手机号或密码不正确',
    appLoginPOST_3: '支付宝帐号无效',
    loginVerificationPOST_0: '手机号不能为空',
    loginVerificationPOST_1: '验证码不能为空',
    loginVerificationPOST_2: '手机号或验证码不正确',

    // registerDev.js
    registerDevPOST_0: 'communication_mode不能为空',
    registerDevPOST_1: '参数key不能为空',
    registerDevPOST_2: '设备id2无效',
    registerDevPOST_3: '设备id2已注册',
    registerDevPOST_4: '该设备已存在',

    destroyDevDELETE_0: '用户未登录',
    destroyDevDELETE_1: NoPermissionToPerformOperation,
    destroyDevDELETE_2: '该设备不存在',
    destroyDevDELETE_3: '已租用设备不能被删除',

    deviceListGET_0: PaginationInvalid,
    // configDev.js
    devCfgParamsGET_0: '模组列表不存在',
    devCfgParamsGET_1: '播放器列表不存在',
    devCfgParamsGET_2: '标签列表不存在',

    devCfgPUT_0: '未找到该注册设备',
    devCfgPUT_1: '设备已被租用，不能修改循环周期',

    devOwnerPunitGet_0: ScreenModeInvalid,
    devOwnerPunitPUT_0: RequestParameterInvalid,
    devOwnerPunitPUT_1: ScreenModeInvalid,
    devOwnerPunitPUT_2: '未找到该屏幕',
    devOwnerPunitPUT_3: '设置的自用时间超出最大可分享时间',
    devOwnerPunitPUT_4: '请绑定支付账户',
    devOwnerPunitPUT_5: '已有订单，且已不能满足当前的自用时间修改',
    devOwnerPunitPUT_6: '设置开关机开始时间错误',
    devOwnerPunitPUT_7: '没有设置用户分成比例',

    // register.js
    updateUserVerification_0: '更换手机号码失败',
    changeUserNamePOST_0: '更换姓名失败',
    changeUserPasswdPOST_0: '更换密码失败',
    updateUserEmail_0: '更换电邮地址失败',

    // screenGroup.js
    createDispGroupPOST_0: NameContainIllegalCharacters,
    createDispGroupPOST_1: '分组名已存在',

    modifyDispGroupNamePUT_0: '该用户下没有此分组',
    modifyDispGroupNamePUT_1: NameContainIllegalCharacters,
    modifyDispGroupNamePUT_2: '分组名已存在',

    rmScreensFromGroupsPUT_0: '该用户下没有此分组',

    dispGroupsScreensGET_0: '该用户下没有此分组',

    dispGroupsScreensDetailsGET_0: '该分组下没有此屏幕',

    // sreens.js
    userScreenListGET_0: PaginationInvalid,
    userScreenListGET_1: '参数notInGroup非法',

    publishedScreensGET_0: PaginationInvalid,
    unpublishedScreensGET_0: '分页参数非法',
    ownScreensGET_0: PaginationInvalid,

    //bindPhone.js
    bindPhoneSendGET_0: '手机号不符合要求',
    bindPhoneSendGET_1: '该用户不是第三方登陆用户!',
    bindPhoneSendGET_2: '获取验证码失败',
    bindPhoneSendGET_3: '参数错误，请检查参数',
    bindPhoneVerifyGET_0: '参数错误，请检查参数',
    bindPhoneVerifyGET_1: '手机号不符合要求',
    bindPhoneVerifyGET_2: '验证码错误',
    bindPhoneVerifyGET_3: '该用户不是第三方登陆用户!',
    bindPhoneVerifyGET_4: '将要绑定的手机号和当前帐号的手机号相同，无需重复操作',

    systemUnkownError: '系统未知错误'
};
