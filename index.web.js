import 'babel-polyfill';
import 'fetch-detector';
import 'fetch-ie8';
import {AppRegistry} from 'react-native';
import ReactWebNative8Koa from './app/';

AppRegistry.registerComponent('ReactWebNative8Koa', () => ReactWebNative8Koa);

AppRegistry.runApplication('ReactWebNative8Koa', {
  rootTag: document.getElementById('root'),
});
