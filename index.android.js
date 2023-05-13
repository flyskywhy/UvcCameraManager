// 之前发现需要 index.android.js 而非 index.native.js 才能让
// react-native-code-push@5.2.0 和 bugsnag-react-native@2.5.1
// 正常工作

import {AppRegistry} from 'react-native';
import App from './app/index';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
