import {
    AppNavigator
} from '../configs/Router';

const recentlyVisitedRoutes = new Set();    // 防抖


export default function(state, action) {
    if (action.type === 'Navigation/NAVIGATE') {
        if (recentlyVisitedRoutes.has(action.routeName)) {
            return state;
        }
        recentlyVisitedRoutes.add(action.routeName);
        setTimeout(() => {
            recentlyVisitedRoutes.delete(action.routeName);
        }, 400);
    }
    const newState = AppNavigator.router.getStateForAction(action, state);
    return newState || state;
}
