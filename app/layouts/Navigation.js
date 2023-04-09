import React, {
    PureComponent
} from 'react';
import {
    BackHandler,
    StyleSheet,
    View,
    StatusBar,
    ToastAndroid,
} from 'react-native';
import {
    connect
} from 'react-redux';
import * as UtilsComponent from './Utils';
import {
    NavigationActions,
} from 'react-navigation';
import {
    createReduxContainer,
} from 'react-navigation-redux-helpers';
import {
    AppNavigator
} from '../configs/Router';
import connectComponent from '../utils/connectComponent';

const Utils = connectComponent(UtilsComponent);
let lastBackPressed = null;

const AppNavigatorWithNavState = connect(state => ({
    state: state.nav,
}))(createReduxContainer(AppNavigator, 'root'));

class Navigation extends PureComponent {
    componentDidUpdate(prevProps, prevState) {
        if (this.props.forbidden403 !== prevProps.forbidden403) {
            this.navigator.props.navigation.navigate('LoginPage');
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
        lastBackPressed = null;
    }

    onBackPress = () => {
        const {
            dispatch,
            nav
        } = this.props;
        if (nav.index > 0) {
            dispatch(NavigationActions.back());
            return true;
        }
        if (lastBackPressed && lastBackPressed + 2000 >= Date.now()) {
            return false;
        }
        lastBackPressed = Date.now();
        ToastAndroid.show('再按一次退出程序', ToastAndroid.SHORT);
        return true;
    };

    refNavigator = view => {
        this.navigator = view;
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    backgroundColor="black"
                    barStyle="light-content"
                    hidden={false}
                />
                <AppNavigatorWithNavState/>
                <Utils/>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
});

const mapStateToProps = state => ({
    nav: state.nav,
    forbidden403: state.utils.forbidden403,
});

export default connect(mapStateToProps)(Navigation);
