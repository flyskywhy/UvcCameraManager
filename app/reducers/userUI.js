import * as types from '../constants/ActionTypes';


const initialState = {
    registerPending: false,
    resetUserPasswdPending: false,
    loginPending: false,
    changeUserNamePending: false,
    changeUserPasswdPending: false,
    checkTokenPending: false,
    clientUserInfoPending: false,
    otherUserPending: false,
    changeUserHeadImagePending: false,
    changeUserAddrPending: false,
    changeUserEmailPending: false
};


export default function(state = initialState, action) {
    const {
        type,
        meta = {}
    } = action;
    const {
        sequence = {}
    } = meta;

    switch (type) {
        case types.REGISTER:
            return {
                ...state,
                registerPending: sequence.type === 'start',
            };
        case types.CHECK_USER:
            return {
                ...state,
            };
        case types.GET_VCODE:
            return {
                ...state,
            };
        case types.GET_LOGIN_VERIFICATION:
            return {
                ...state,
            };
        case types.LOGIN:
            return {
                ...state,
                loginPending: sequence.type === 'start',
            };
        case types.CHECK_TOKEN:
            return {
                ...state,
                checkTokenPending: sequence.type === 'start'
            };
        case types.UPDATE_CLIENT_USER_INFO:
            return {
                ...state,
                clientUserInfoPending: sequence.type === 'start'
            };
        case types.GET_USER_INFO:
            return {
                ...state,
                otherUserPending: sequence.type === 'start'
            };
        case types.CHANGE_USER_PASSWD:
            return {
                ...state,
                changeUserPasswdPending: sequence.type === 'start'
            };
        case types.RESET_USER_PASSWD:
            return {
                ...state,
                resetUserPasswdPending: sequence.type === 'start'
            };
        case types.CHANGE_USER_NAME:
            return {
                ...state,
                changeUserNamePending: sequence.type === 'start'
            };
        case types.CHANGE_USER_ADDR:
            return {
                ...state,
                changeUserAddrPending: sequence.type === 'start'
            };
        case types.CHANGE_USER_EMAIL:
            return {
                ...state,
                changeUserEmailPending: sequence.type === 'start'
            };
        case types.CHANGE_USER_HEADIMAGE:
            return {
                ...state,
                changeUserHeadImagePending: sequence.type === 'start'
            };
        case types.LOGOUT:
            return initialState;
        default:
            return state;
    }
}
