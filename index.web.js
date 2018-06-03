import 'babel-polyfill';
import 'fetch-detector';
import 'fetch-ie8';
import {
    AppRegistry
} from 'react-native';
import UvcCameraManager from './app/';


AppRegistry.registerComponent('UvcCameraManager', () => UvcCameraManager);

var app = document.createElement('div');
document.body.appendChild(app);

AppRegistry.runApplication('UvcCameraManager', {
    rootTag: app
});
