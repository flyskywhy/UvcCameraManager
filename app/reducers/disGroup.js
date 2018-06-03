import * as types from '../constants/ActionTypes';
import Immutable, {
    Map,
    List
} from 'immutable';

const initialState = Map({
    count: 0,
    disGroupsCount: 0,
    groupScreenCount: 0,
    disGroups: Immutable.fromJS([]),
    groupScreen: List([])
});

export default function(state = initialState, action) {
    const {
        payload,
        error,
        meta = {},
        type
    } = action;
    const {
        sequence = {},
    } = meta;
    if (sequence.type === 'start' || error) {
        return state;
    }
    switch (type) {
        case types.UPDATE_MY_DISGROUP:
            return state
                .set('disGroupsCount', payload.count)
                .set('disGroups', Immutable.fromJS(payload.groups));
        case types.GET_MY_DISGROUP:
            return state
                .update('disGroups', (value) => {
                    return value.concat(Immutable.fromJS(payload.groups));
                });
        case types.UPDATA_GROUP_SCREEN:
            return state
                .set('groupScreenCount', payload.count)
                .set('groupScreen', List(payload.screens));
        case types.GET_GROUP_SCREEN:
            return state
                .set('groupScreenCount', payload.count)
                .update('groupScreen', (value) => {
                    return value.concat(List(payload.screens));
                });
        case types.LOGOUT:
            return initialState;
        default:
            return state;
    }
}
