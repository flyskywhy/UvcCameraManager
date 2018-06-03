import {
    createAction
} from 'redux-actions';
import * as types from '../constants/ActionTypes';
import * as deviceService from '../services/deviceService';

export const registerDev = createAction(types.REGISTER_DEV, deviceService.registerDev, (id2, sign, key, resolved, rejected) => {
    return {
        resolved,
        rejected,
        sync: 'device'
    };
});


export const unregisterDev = createAction(types.UNREGISTER_DEV, deviceService.unregisterDev, ({
    resolved,
    rejected
}) => {
    return {
        resolved,
        rejected
    };
});


export const configDev = createAction(types.CONFIG_DEV, deviceService.configDev, (id, cfg, checkedLabel, resolved, rejected) => {
    return {
        resolved,
        rejected
    };
});

export const getDevConfig = createAction(types.GET_DEVICES_CONFIG, async (id) => {
    return await deviceService.getDevConfig(id);
}, (id, resolved, rejected) => {
    return {
        resolved,
        rejected
    };
});

export const getDevices = createAction(types.GET_DEVICES, async (query) => {
    return await deviceService.getDevices(query);
}, ({
    resolved,
    rejected
}) => {
    return {
        resolved,
        rejected
    };
});


export const updateDevices = createAction(types.UPDATE_DEVICES, async (query) => {
    return await deviceService.getDevices(query);
}, () => {
    return {
        sync: 'device'
    };
});


export const removeDeviceCacheById = createAction(types.REMOVE_DEVICE_CACHE_BY_ID, () => {
    return;
}, id => {
    return {
        id,
        sync: 'device'
    };
});


export const share = createAction(types.SHARE, deviceService.share, ({
    resolved,
    rejected
}) => {
    return {
        resolved,
        rejected
    };
});


export const modifyDeviceOwner = createAction(types.MODIFY_DEVICE_OWNER, deviceService.modifyDeviceOwner, ({
    resolved,
    rejected
}) => {
    return {
        resolved,
        rejected
    };
});
