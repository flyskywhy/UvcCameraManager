import {
    createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';

export default createReactNavigationReduxMiddleware(
    'root',
    state => state.nav,
);
