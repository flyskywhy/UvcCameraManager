import {
    createAction
} from 'redux-actions';
import * as types from '../constants/ActionTypes';
import * as storageService from '../services/storage';
import * as requestService from '../services/request';


const syncReducer = ['local', 'user', 'message', 'topic', 'localPersistence'];


export const toast = createAction(types.TOAST, (text, timeout) => {
    return {
        text,
        timeout,
        id: new Date().getTime()
    };
});


export const forbidden403 = createAction(types.FORBIDDEN403, () => new Date().getTime());


export const getReducerFromAsyncStorage = createAction(types.GET_REDUCER_FROM_ASYNC_STORAGE, async() => {
    return storageService.multiGet(syncReducer)
        .then(arr => {
            let ob = {};
            arr.forEach(item => {
                ob[item[0]] = item[1];
            });
            if (ob.user && ob.user.secret) {
                global.token = ob.user.secret.token;
            }
            return ob;
        })
        .catch(err => {

        });
}, (resolved, rejected) => {
    return {
        resolved,
        rejected
    };
});


export const canOpenURL = createAction(types.CAN_OPEN_URL, async({
    url,
    resolved,
    rejected
}) => {
    return await requestService.canOpenURL(url);
}, ({
    url,
    resolved,
    rejected
}) => {
    return {
        resolved,
        rejected
    };
});


export const layout = function() {
    return {
        type: types.LAYOUT
    };
};
