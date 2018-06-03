import * as types from '../constants/ActionTypes';

const initialState = {
    mode: 3
};


export default function(state = initialState, action) {
    const {
        payload,
        error,
        meta = {}
    } = action;
    const {
        sequence = {}
    } = meta;
    if (sequence.type === 'start' || error) {
        return state;
    }

    switch (action.type) {
        case types.SAVE_MODE:
            return {
                ...state,
                mode: payload
            };
        case types.GET_REDUCER_FROM_ASYNC_STORAGE:
            return {
                ...state,
                ...(payload.local || initialState)
            };
        default:
            return state;
    }
}
