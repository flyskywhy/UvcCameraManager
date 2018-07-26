upgrade_react_header_to_rn0_40() {
    find node_modules/$1 -name *.[hm] | xargs grep $2 | sed "s/:.*$//" | xargs sed -i -e "s/#import \"$2\"/#import <React\/$2>/"
}

# echo patching react-native-video
# mkdir -p node_modules/ReactWeb/Libraries/Image
# touch node_modules/ReactWeb/Libraries/Image/resolveAssetSource.js
# mkdir -p node_modules/react-web/Libraries/Image
# touch node_modules/react-web/Libraries/Image/resolveAssetSource.js

echo patching rmc-date-picker
sed -i -e "s/, { key: 'minutes', props: { children: minutes } }//" node_modules/rmc-date-picker/lib/DatePicker.js
sed -i -e "s/'rmc-picker\/lib\/MultiPicker'/'rmc-picker\/lib\/MultiPicker.native'/" node_modules/rmc-date-picker/lib/DatePicker.js
sed -i -e "s/'rmc-picker\/lib\/Picker'/'rmc-picker\/lib\/Picker.native'/" node_modules/rmc-date-picker/lib/DatePicker.js
sed -i -e "s/'rmc-picker\/lib\/Popup'/'rmc-picker\/lib\/Popup.native'/" node_modules/rmc-date-picker/lib/Popup.js

echo patching react-navigation
sed -i -e "s/PlatformHelpers'/PlatformHelpers.native'/" node_modules/react-navigation/src/createNavigationContainer.js

echo patching webdriver-manager
sed -i -e "s/outputDir]);/outputDir], { stdio: 'inherit' });/" node_modules/webdriver-manager/built/lib/cmds/update.js

echo patching react-native-image-crop-picker
sed -i -e "s/'com.facebook.react:react-native:+'/('com.facebook.react:react-native:0.51.0') { force = true }/" node_modules/react-native-image-crop-picker/android/build.gradle

echo patching react-native-smart-barcode
sed -i -e "s/'com.facebook.react:react-native:+'/('com.facebook.react:react-native:0.51.0') { force = true }/" node_modules/react-native-smart-barcode/android/build.gradle

# echo patching video.js
# sed -i -e "s/(browser.ANDROID_VERSION/(!(\/UCBrowser\/i.test(window.navigator.userAgent)) \&\& browser.ANDROID_VERSION/" node_modules/video.js/es5/tech/html5.js
