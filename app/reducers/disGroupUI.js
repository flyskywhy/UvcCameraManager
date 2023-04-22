import * as types from '../constants/ActionTypes';

const initialState = {
  pullRefreshPending: false,
  reachedEndPending: false,
  perpage: 20,
  page: 1,
  flag: 0,

  createDisGroupPending: false,
  modifyDisGroupNamePending: false,
  deleteDisGroupPending: false,
  deleteScreenFromGroupPending: false,
  addScreenToGroupPending: false,

  pullRefreshPendingGroupScreen: false,
  reachedEndPendingGroupScreen: false,
  pageGroupScreen: 1,
  flagGroupScreen: 0,
};

export default function (state = initialState, action) {
  const {error, type, meta = {}} = action;
  const {sequence = {}} = meta;
  const pending = sequence.type === 'start';

  switch (type) {
    case types.UPDATE_MY_DISGROUP:
      return {
        ...state,
        pullRefreshPending: pending,
        page: initialState.page,
        flag: !error && !pending ? state.flag + 1 : state.flag,
      };
    case types.GET_MY_DISGROUP:
      return {
        ...state,
        reachedEndPending: pending,
        page: !error && !pending ? state.page + 1 : state.page,
      };
    case types.DELETE_DISGROUP:
      return {
        ...state,
        deleteDisGroupPending: pending,
      };
    case types.UPDATA_GROUP_SCREEN:
      return {
        ...state,
        pullRefreshPendingGroupScreen: pending,
        pageGroupScreen: initialState.pageGroupScreen,
        flagGroupScreen:
          !error && !pending
            ? state.flagGroupScreen + 1
            : state.flagGroupScreen,
      };
    case types.GET_GROUP_SCREEN:
      return {
        ...state,
        reachedEndPendingGroupScreen: pending,
        pageGroupScreen:
          !error && !pending
            ? state.pageGroupScreen + 1
            : state.pageGroupScreen,
      };
    case types.DELETE_SCREEN_FROM_DIGROUP:
      return {
        ...state,
        deleteScreenFromGroupPending: pending,
      };
    case types.LOGOUT:
      return initialState;
    default:
      return state;
  }
}
