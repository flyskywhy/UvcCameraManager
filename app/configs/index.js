import {Platform} from 'react-native';
import packageJson from '../../package.json';
import api from '../../common/api.js';
import {localeGet} from '../../common/locale';

export default {
  domain: __DEV__
    ? Platform.OS === 'web'
      ? 'http://' + location.hostname + ':8765'
      : 'http://ReactWebNative8Koa.com:447'
    : Platform.OS === 'web'
    ? ''
    : 'http://ReactWebNative8Koa.com',
  api,
  locale: 'zh-CN',
  localeGet,
  uploadMax: 100 * 1024 * 1024, // related to client_max_body_size in scripts/nginx.conf
  replySuffix: '\nFrom ' + Platform.OS,
  package: packageJson,
  license: 'http://ReactWebNative8Koa.com/xieyi.html',
};
