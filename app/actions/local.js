import {
    createAction
} from 'redux-actions';
import * as types from '../constants/ActionTypes';


export const saveServerAddressChangeable = createAction(types.SAVE_SERVER_ADDRESS_CHANGEABLE, changeable => {
    return changeable;
}, () => {
    return {
        sync: 'localPersistence'
    };
});

export const saveServerAddress = createAction(types.SAVE_SERVER_ADDRESS, addr => {
    return addr;
}, () => {
    return {
        sync: 'localPersistence'
    };
});

export const saveUserPhone = createAction(types.SAVE_USER_PHONE, phone => {
    return phone;
}, () => {
    return {
        sync: 'localPersistence'
    };
});

export const saveMode = createAction(types.SAVE_MODE, mode => {
    return mode;
}, () => {
    return {
        sync: 'local'
    };
});
