import * as types from '../constants/ActionTypes';

const initialState = {
  pullRefreshPending: false,
  reachedEndPending: false,
  perpage: 20,
  page: 1,
  flag: 0,
  registerDevPending: false,
  unregisterDevPending: false,
  configDevPending: false,
  loadPending: false,
};

export default function (state = initialState, action) {
  const {error, type, meta = {}} = action;
  const {sequence = {}} = meta;
  const pending = sequence.type === 'start';

  switch (type) {
    case types.REGISTER_DEV:
      return {
        ...state,
        registerDevPending: pending,
      };
    case types.UNREGISTER_DEV:
      return {
        ...state,
        unregisterDevPending: pending,
      };
    case types.CONFIG_DEV:
      return {
        ...state,
        configDevPending: pending,
      };
    case types.GET_DEVICES:
      return {
        ...state,
        reachedEndPending: pending,
        page: !error && !pending ? state.page + 1 : state.page,
      };
    case types.UPDATE_DEVICES:
      return {
        ...state,
        pullRefreshPending: pending,
        page: initialState.page,
        flag: !error && !pending ? state.flag + 1 : state.flag,
      };
    case types.GET_DEVICE_BY_ID:
      return {
        ...state,
        loadPending: pending,
      };
    case types.LOGOUT:
      return initialState;
    default:
      return state;
  }
}
