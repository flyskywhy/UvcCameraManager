import * as types from '../constants/ActionTypes';
import {
    Dimensions,
    StyleSheet
} from 'react-native';
import NativeTachyons from 'react-native-style-tachyons';


NativeTachyons.build({
    /* REM parameter is optional, default is 16 */
    rem: Dimensions.get('window').width > 420 ? 18 : 10
}, StyleSheet);


const initialState = {
    toast: {
        text: null,
        timeout: 2000,
        id: null
    },
    forbidden403: null,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    isPortrait: Dimensions.get('window').width < Dimensions.get('window').height
};


export default function(state = initialState, action) {
    const {
        payload = {}
    } = action;
    switch (action.type) {
        case types.TOAST:
            return {
                ...state,
                toast: {
                    ...state.toast,
                    ...payload
                }
            };
        case types.FORBIDDEN403:
            return {
                ...state,
                forbidden403: payload
            };
        case types.LAYOUT:
            let {
                width,
                height
            } = Dimensions.get('window');
            NativeTachyons.build({
                rem: width > 420 ? 18 : 10
            }, StyleSheet);

            return {
                ...state,
                width,
                height,
                isPortrait: width < height
            };
        default:
            return state;
    }
}
