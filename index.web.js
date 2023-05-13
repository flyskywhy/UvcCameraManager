import 'babel-polyfill';
import 'fetch-detector';
import 'fetch-ie8';
import {AppRegistry} from 'react-native';
import App from './app/';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

AppRegistry.runApplication(appName, {
  rootTag: document.getElementById('root'),
});
