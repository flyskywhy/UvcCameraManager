import {
    AppNavigator
} from '../configs/Router';
import {
    createNavigationReducer,
} from 'react-navigation-redux-helpers';

export default createNavigationReducer(AppNavigator);

// 上面是 react-navigation 2.x 的做法，如果想要防抖功能的，则可以考虑下面 1.x 的做法

// const recentlyVisitedRoutes = new Set();    // 防抖

// export default function(state, action) {
//     if (action.type === 'Navigation/NAVIGATE') {
//         if (recentlyVisitedRoutes.has(action.routeName)) {
//             return state;
//         }
//         recentlyVisitedRoutes.add(action.routeName);
//         setTimeout(() => {
//             recentlyVisitedRoutes.delete(action.routeName);
//         }, 400);
//     }
//     const newState = AppNavigator.router.getStateForAction(action, state);
//     return newState || state;
// }
