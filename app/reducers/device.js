import * as types from '../constants/ActionTypes';

const initialState = {
    num: 0,
    devicesCount: 0,
    ndata: [],
    device: [],
    detail: {},
    moduleNames: [],
    displayModes: [],
    labelModes: [],
    playerTypes: [],
    matchMethods: [],
    cycles: [],
    businessHours: []
};


export default function(state = initialState, action) {
    const {
        payload,
        error,
        meta = {},
        type
    } = action;
    const {
        sequence = {}, id = '0',
        ndata
    } = meta;

    if (sequence.type === 'start' || error) {
        return state;
    }

    switch (type) {
        case types.GET_DEVICES:
            return {
                ...state,
                ndata: state.ndata.concat(payload.ndata)
            };
        case types.UPDATE_DEVICES:
            return {
                ...state,
                devicesCount: payload.num,
                ndata: payload.ndata
            };
        case types.GET_DEVICES_CONFIG:
            return {
                ...state,
                device: payload
            };
        case types.CHANGE_BUSINESSHOURS:
            return {
                ...state,
                businessHours: ndata
            };
        case types.GET_DEVICES_CONFIG_PARAMS:
            return {
                ...state,
                moduleNames: payload.moduleLists,
                displayModes: payload.dispModeLists,
                labelModes: payload.labelLists,
                playerTypes: payload.playerLists,
                matchMethods: payload.matchMethods,
                cycles: payload.cycle,
            };
        case types.GET_DEVICE_BY_ID:
            return {
                ...state,
                detail: {
                    ...state.detail,
                    [id]: payload
                }
            };
        case types.REMOVE_DEVICE_CACHE_BY_ID:
            delete state.detail[id];
            return {
                ...state,
                detail: {
                    ...state.detail,
                    [id]: undefined
                }
            };
        case types.LOGOUT:
            return initialState;
        default:
            return state;
    }
}
