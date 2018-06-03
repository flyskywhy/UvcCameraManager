import {
    combineReducers
} from 'redux';
import local from './local';
import user from './user';
import userUI from './userUI';
import utils from './utils';
import localPersistence from './localPersistence';
import nav from './nav';

export default combineReducers({
    local,
    user,
    userUI,
    utils,
    localPersistence,
    nav,
});
