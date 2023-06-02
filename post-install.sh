upgrade_react_header_to_rn0_40() {
    find node_modules/$1 -name *.[hm] | xargs grep $2 | sed "s/:.*$//" | xargs sed -i -e "s/#import \"$2\"/#import <React\/$2>/"
}

echo patching rmc-date-picker
sed -i -e "s/, { key: 'minutes', props: { children: minutes } }//" node_modules/rmc-date-picker/lib/DatePicker.js
sed -i -e "s/'rmc-picker\/lib\/MultiPicker'/'rmc-picker\/lib\/MultiPicker.native'/" node_modules/rmc-date-picker/lib/DatePicker.js
sed -i -e "s/'rmc-picker\/lib\/Picker'/'rmc-picker\/lib\/Picker.native'/" node_modules/rmc-date-picker/lib/DatePicker.js
sed -i -e "s/'rmc-picker\/lib\/Popup'/'rmc-picker\/lib\/Popup.native'/" node_modules/rmc-date-picker/lib/Popup.js

echo patching webdriver-manager
sed -i -e "s/outputDir]);/outputDir], { stdio: 'inherit' });/" node_modules/webdriver-manager/built/lib/cmds/update.js

echo patching passport-alipay-oauth2
sed -i -e "s/fs.readFileSync(this._options.alipay_public_key)/this._options.alipay_public_key/g" node_modules/passport-alipay-oauth2/lib/alipay.js
sed -i -e "s/fs.readFileSync(this._options.private_key)/this._options.private_key/g" node_modules/passport-alipay-oauth2/lib/alipay.js

echo patching react-native-root-view-background
sed -i -e "s/compile /implementation /g" node_modules/@kingstinct/react-native-root-view-background/android/build.gradle

echo patching react-navigation-drawer
# ref to https://stackoverflow.com/a/69690914
# TODO: remove this after upgrade react-navigation
sed -i -e "s/interpolate,/interpolateNode,/g" -e "s/interpolate(/interpolateNode(/g" node_modules/react-navigation-drawer/lib/module/views/Drawer.js

echo patching passport-weixin
sed -i -e "s/openid;/openid + \'\&lang=zh_CN\';/g" node_modules/passport-weixin/lib/strategy.js

# echo patching video.js
# sed -i -e "s/(browser.ANDROID_VERSION/(!(\/UCBrowser\/i.test(window.navigator.userAgent)) \&\& browser.ANDROID_VERSION/" node_modules/video.js/es5/tech/html5.js
