import * as utilsActions from '../actions/utils';
import config from '../configs';

export default function utilsMiddleware({
    dispatch
}) {
    return next => action => {
        const {
            payload,
            error,
            meta = {}
        } = action;

        const dispatchToast = (...args) => {
            dispatch(utilsActions.toast(...args));
        };

        // error handle
        if (error && payload.type === 'http') {
            if (payload.res.status === 451) {
            } else if (payload.res.status === 403) {
                dispatch(utilsActions.forbidden403());
                dispatchToast('登录已过期，请重新登录');
            } else {
                if (payload.res) {
                    if (payload.res.json) {
                        payload.res.json().then(result => {
                            if (result[0] && result[0].errCode) {
                                dispatchToast(config.localeGet(config.locale, result[0].errCode, result[0].keyWord));
                            } else {
                                dispatchToast(JSON.stringify(result));
                            }
                        }).catch(() => {});
                    } else {
                        dispatchToast(`网络连接错误【${payload.res.status}】`);
                    }
                }
            }
        }
        next(action);
    };
}
