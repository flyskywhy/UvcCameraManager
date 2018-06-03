import {
    Platform
} from 'react-native';
import packageJson from '../../package.json';
import api from '../../common/api.js';
import {
    localeGet
} from '../../common/locale';

export default {
    domain: __DEV__ ? (Platform.OS === 'web' ? (__WEBPACK_WATCH__ ? '' : 'http://' + location.hostname + ':8765') : 'http://ReactWebNative8Koa.com:447') : (Platform.OS === 'web' ? '' : 'http://ReactWebNative8Koa.com'),
    api,
    locale: 'zh-CN',
    localeGet,
    replySuffix: '\nFrom ' + Platform.OS,
    package: packageJson,
    license: 'http://ReactWebNative8Koa.com/xieyi.html',
};
