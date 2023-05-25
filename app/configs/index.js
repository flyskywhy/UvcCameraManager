import {Platform} from 'react-native';
import packageJson from '../../package.json';
import api from '../../common/api.js';
import {localeGet} from '../../common/locale';
import locale from '@flyskywhy/react-native-locale-detector';
export default {
  backgroundColor: '#05050d', // the flashed background color for navigation between pages
  domain: __DEV__
    ? Platform.OS === 'web'
      ? 'http://' + location.hostname + ':8765'
      : 'http://UvcCameraManager.com:447'
    : Platform.OS === 'web'
    ? ''
    : 'http://UvcCameraManager.com',
  api,
  locale:
    Platform.OS === 'web'
      ? navigator.language || 'en-US'
      : locale.slice(0, 5) || 'en-US',
  localeGet,
  uploadMax: 100 * 1024 * 1024, // related to client_max_body_size in scripts/nginx.conf
  replySuffix: '\nFrom ' + Platform.OS,
  package: packageJson,
  license: 'http://UvcCameraManager.com/xieyi.html',
};
