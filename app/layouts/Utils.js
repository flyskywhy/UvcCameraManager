import React, {
    PureComponent
} from 'react';
import {
    Platform,
    View,
    StyleSheet,
    StatusBar,
    AppState
} from 'react-native';
import Toast from '../components/base/Toast';
import config from '../configs';

class Utils extends PureComponent {

    componentDidMount() {
        const {
            actions,
        } = this.props;
        actions.getReducerFromAsyncStorage(({
            user
        }) => {
            if (user && user.secret) {
                // actions.getUnreadMessageCount();
            }
        });
        if (Platform.OS !== 'web') {
            AppState.addEventListener('change', (newState) => {
                if (newState === 'active') {
                    // this.props.user.secret && actions.getUnreadMessageCount();
                }
            });
        } else {
            window.addEventListener('resize', actions.layout);
            actions.checkLogin();
        }

        // if (__DEV__) {
        //  actions.checkToken('your secretKey', () => {
        //      actions.toast('登陆成功');
        //  });
        // }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.toast.id !== prevProps.toast.id) {
            this.toast.show(this.props.toast.text, this.props.toast.timeout);
        }
    }

    refToast = (view) => {
        this.toast = view;
    }

    render() {
        if (Platform.OS === 'web') {
            return (
                <View style={styles.container}>
                    <Toast ref={this.refToast}/>
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                    <StatusBar barStyle="light-content"/>
                    <Toast ref={this.refToast}/>
                </View>
            );
        }
    }
}


const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0
    }
});


export const LayoutComponent = Utils;
export function mapStateToProps(state) {
    const {
        utils = {}, user
    } = state;
    return {
        ...utils,
        user
    };
}
