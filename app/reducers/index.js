import {
    combineReducers
} from 'redux';
import local from './local';
import user from './user';
import userUI from './userUI';
import utils from './utils';
import device from './device';
import deviceUI from './deviceUI';
import disGroup from './disGroup';
import disGroupUI from './disGroupUI';
import localPersistence from './localPersistence';
import nav from './nav';

export default combineReducers({
    local,
    user,
    userUI,
    utils,
    device,
    deviceUI,
    disGroup,
    disGroupUI,
    localPersistence,
    nav,
});
