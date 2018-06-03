import * as types from '../constants/ActionTypes';


const initialState = {
    secret: null,
    publicInfo: null,
    updatePending: false,
    users: {},
    user: {}
};


export default function(state = initialState, action) {
    const {
        payload,
        error,
        meta = {},
        type
    } = action;
    const {
        sequence = {},
        name,
        addr,
        email,
        headImage,
        phone
    } = meta;
    if (sequence.type === 'start' || error) {
        return state;
    }


    switch (type) {
        case types.LOGIN:
            return {
                ...state,
                ...payload,
                user: payload.secret
            };
        case types.LOGIN_CODE:
            return {
                ...state,
                ...payload,
                user: payload.secret
            };
        case types.CHECK_LOGIN:
            return {
                ...state,
                ...payload,
                user: payload.secret
            };
        case types.CHECK_TOKEN:
            return {
                ...state,
                result: payload
            };
        case types.CHECK_USER:
            return {
                ...state,
                ...payload
            };
        case types.GET_BIND_PHONE_SEND:
            return {
                ...state,
                ...payload
            };
        case types.GET_BIND_PHONE_VERIFY:
            return {
                ...state,
                ...payload
            };
        case types.GET_REDUCER_FROM_ASYNC_STORAGE:
            return {
                ...state,
                ...(payload.user || initialState)
            };
        case types.EMAIL_SEND:
            return {
                ...state,
                ...payload
            };
        case types.UPDATE_CLIENT_USER_INFO:
            return {
                ...state,
                publicInfo: payload
            };
        case types.GET_USER_INFO:
            let {
                userId = 'flyskywhy'
            } = meta;
            return {
                ...state,
                publicInfo: userId === state.publicInfo.id ? payload : state.publicInfo,
                users: {
                    ...state.users,
                    [userId]: payload
                }
            };
        case types.UPDATE_USER_NAME_LOCAL:
            let newUserAfterUpdate = updateUserName(state, name);
            return {
                ...state,
                publicInfo: newUserAfterUpdate
            };
        case types.UPDATE_USER_PHONE_LOCAL:
            let newUserAfterUpdatePhone = updateUserPhone(state, phone);
            return {
                ...state,
                publicInfo: newUserAfterUpdatePhone
            };
        case types.UPDATE_USER_ADDR_LOCAL:
            let newUserAddrAfterUpdate = updateUserAddr(state, addr);
            return {
                ...state,
                publicInfo: newUserAddrAfterUpdate
            };
        case types.UPDATE_USER_EMAIL_LOCAL:
            let newUserEmailAfterUpdate = updateUserEmail(state, email);
            return {
                ...state,
                publicInfo: newUserEmailAfterUpdate
            };
        case types.UPDATE_USER_HEAD_IMAGE_LOCAL:
            let newUserHeadImageAfterUpdate = updataUserHeadImage(state, headImage);
            return {
                ...state,
                publicInfo: newUserHeadImageAfterUpdate
            };
        case types.LOGOUT:
            return initialState;
        default:
            return state;
    }
}

function updateUserName(state, name) {
    let newData = Object.assign({}, state.publicInfo, {
        'name': name
    });
    return newData;
}

function updateUserAddr(state, addr) {
    let newData = Object.assign({}, state.publicInfo, {
        'addr': addr
    });
    return newData;
}

function updateUserPhone(state, phone) {
    let newData = Object.assign({}, state.publicInfo, {
        'phone': phone
    });
    return newData;
}

function updateUserEmail(state, email) {
    let newData = Object.assign({}, state.publicInfo, {
        'email': email
    });
    return newData;
}

function updataUserHeadImage(state, headImage) {
    let newData = Object.assign({}, state.publicInfo, {
        'headimage': headImage
    });
    return newData;
}
