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
    addNavigationHelpers,
    NavigationActions,
} from 'react-navigation';
import {
    createReduxBoundAddListener,
    initializeListeners,
} from 'react-navigation-redux-helpers';
import {
    AppNavigator
} from '../configs/Router';
import connectComponent from '../utils/connectComponent';

const Utils = connectComponent(UtilsComponent);
let lastBackPressed = null;

class Navigation extends PureComponent {
    componentWillReceiveProps(nextProps) {
        if (this.props.forbidden403 !== nextProps.forbidden403) {
            this.navigator.props.navigation.navigate('LoginPage');
        }
    }

    componentDidMount() {
        initializeListeners('root', this.props.nav);
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
        const {
            dispatch,
            nav
        } = this.props;
        return (
            <View style={styles.container}>
                <StatusBar
                    backgroundColor="black"
                    barStyle="light-content"
                    hidden={false}
                />
                <AppNavigator
                    ref={this.refNavigator}
                    navigation={addNavigationHelpers({
                        dispatch: dispatch,
                        state: nav,
                        addListener: createReduxBoundAddListener('root'),
                    })}
                />
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
