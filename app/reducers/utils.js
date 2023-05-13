import * as types from '../constants/ActionTypes';
import {Dimensions} from 'react-native';

const initialState = {
  toast: {
    text: null,
    timeout: 2000,
    id: null,
  },
  forbidden403: null,
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
  is18x9: is18x9(
    Dimensions.get('window').width,
    Dimensions.get('window').height,
  ),
  isPortrait: Dimensions.get('window').width < Dimensions.get('window').height,
};

// 是否是全面屏手机
function is18x9(x, y) {
  if (x < y) {
    return y / x > 17 / 9;
  } else {
    return x / y > 17 / 9;
  }
}

export default function (state = initialState, action) {
  const {payload = {}} = action;
  switch (action.type) {
    case types.TOAST:
      return {
        ...state,
        toast: {
          ...state.toast,
          ...payload,
        },
      };
    case types.FORBIDDEN403:
      return {
        ...state,
        forbidden403: payload,
      };
    case types.LAYOUT:
      let {width, height} = Dimensions.get('window');

      return {
        ...state,
        width,
        height,
        isPortrait: width < height,
      };
    default:
      return state;
  }
}
