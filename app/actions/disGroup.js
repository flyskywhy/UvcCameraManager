import {
    createAction
} from 'redux-actions';
import * as types from '../constants/ActionTypes';
import * as disGroupService from '../services/disGroupService';

export const updateDisGroup = createAction(types.UPDATE_MY_DISGROUP, async query => {
    return await disGroupService.getDisGroup(query);
}, () => {
    return {};
});

export const getDisGroup = createAction(types.GET_MY_DISGROUP, disGroupService.getDisGroup, ({
    resolved,
    rejected
}) => {
    return {
        resolved,
        rejected
    };
});

export const deleteDisGroup = createAction(types.DELETE_DISGROUP, disGroupService.deleteDisGroup, ({
    resolved,
    rejected
}) => {
    return {
        resolved,
        rejected
    };
});

export const updateGroupScreen = createAction(types.UPDATA_GROUP_SCREEN, async query => {
    return await disGroupService.getGroupScreen(query);
}, () => {
    return {};
});

export const getGroupScreen = createAction(types.GET_GROUP_SCREEN, disGroupService.getGroupScreen, ({
    resolved,
    rejected
}) => {
    return {
        resolved,
        rejected
    };
});

