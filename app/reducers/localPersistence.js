import * as types from '../constants/ActionTypes';
import config from '../configs';

const initialState = {
  userPhone: '',
  city: '',
  searchHistorys: [],
  serverAddrChangeable: false,
  serverAddr: config.domain,
};

export default function (state = initialState, action) {
  const {payload, error, meta = {}} = action;
  const {sequence = {}} = meta;
  if (sequence.type === 'start' || error) {
    return state;
  }

  switch (action.type) {
    case types.SAVE_USER_PHONE:
      return {
        ...state,
        userPhone: payload,
      };
    case types.SAVE_CITY:
      return {
        ...state,
        city: payload,
      };
    case types.GET_REDUCER_FROM_ASYNC_STORAGE:
      if (payload.localPersistence) {
        return {
          ...state,
          userPhone: payload.localPersistence.userPhone,
          searchHistorys: payload.localPersistence.searchHistorys,
          serverAddrChangeable: payload.localPersistence.serverAddrChangeable,
          serverAddr: payload.localPersistence.serverAddr,
        };
      } else {
        return state;
      }
    case types.SAVE_SEARCHER_HISTORYS:
      return {
        ...state,
        searchHistorys: payload,
      };
    case types.SAVE_SERVER_ADDRESS_CHANGEABLE:
      return {
        ...state,
        serverAddrChangeable: payload,
      };
    case types.SAVE_SERVER_ADDRESS:
      config.domain = payload;
      return {
        ...state,
        serverAddr: payload,
      };
    default:
      return state;
  }
}
