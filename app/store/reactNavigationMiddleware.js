import {
    createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';

export default createReactNavigationReduxMiddleware(
    state => state.nav,
    'root',
);
