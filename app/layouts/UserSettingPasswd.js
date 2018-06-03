import React, {
    PureComponent
} from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Platform,
    Animated
} from 'react-native';
import Nav from '../components/Nav';
import ActivityIndicatorModal from '../components/ActivityIndicatorModal';

const {
    width
} = Dimensions.get('window');

class UserSettingPasswd extends PureComponent {

    constructor(props) {
        super(props);
        this.oldPasswd = '';
        this.newPasswd = '';
        this.newPasswdAgain = '';
        this.state = {
            loadModalVisible: false,
            disabled: true
        };
        this.confirmColor = new Animated.Value(0);
        this.navs = {
            Left: {
                onPress: () => props.navigation.goBack()
            },
            Center: {
                text: '修改登录密码'
            }
        };
    }

    showLoadingModal = () => {
        this.setState({
            loadModalVisible: true
        });
    }

    dismissLoadingModal = () => {
        this.setState({
            loadModalVisible: false
        });
    }

    _onConfirm = () => {
        const {
            actions,
            navigation,
            routes,
        } = this.props;
        let oldPasswd = this.oldPasswd;
        let newPasswd = this.newPasswd;
        let newPasswdAgain = this.newPasswdAgain;
        if (!oldPasswd) {
            actions.toast('旧密码不能为空');
            return;
        }
        if (!newPasswd) {
            actions.toast('新密码不能为空');
            return;
        }
        if (!newPasswdAgain) {
            actions.toast('确认新密码不能为空');
            return;
        }
        if (newPasswd.length < 6) {
            actions.toast('密码长度不能小于6位');
            return;
        }
        if (oldPasswd === newPasswd) {
            actions.toast('新旧密码不能相同');
            return;
        }
        if (newPasswd !== newPasswdAgain) {
            actions.toast('两次输入的新密码不相同');
            return;
        }
        this.showLoadingModal();
        actions.changeUserPasswd({
            oldpasswd: oldPasswd,
            newpasswd: newPasswd,
            resolved: () => {
                this.dismissLoadingModal();
                actions.toast('更换成功，请重新登录!');
                actions.logout();
                actions.logoutBackend({});
                navigation.goBack(routes[1] && routes[1].key);
            },
            rejected: () => {
                this.dismissLoadingModal();
            }
        });
    }

    onOldPwdChangeText = (text) => {
        this.oldPasswd = text;
        this.checkCanModify();
    }

    onNewPwdChangeText = (text) => {
        this.newPasswd = text;
        this.checkCanModify();
    }

    onNewSurePwdChangeText = (text) => {
        this.newPasswdAgain = text;
        this.checkCanModify();
    }

    checkCanModify = () => {
        const {
            disabled
        } = this.state;
        if (this.oldPasswd && this.newPasswd && this.newPasswdAgain) {
            if (disabled) {
                this.setState({
                    disabled: false
                });
                Animated.timing(this.confirmColor, {
                    toValue: 1
                }).start();
            }
        } else {
            if (!disabled) {
                this.setState({
                    disabled: true
                });
                Animated.timing(this.confirmColor, {
                    toValue: 0
                }).start();
            }
        }
    }

    render() {
        const {
            disabled
        } = this.state;
        const color = this.confirmColor.interpolate({
            inputRange: [0, 1],
            outputRange: ['#999999', '#18BEBC']
        });
        return (
            <View style={styles.container}>
                <ActivityIndicatorModal
                    visible={this.state.loadModalVisible}
                    onRequestClose={this.dismissLoadingModal}
                />
                <Nav navs={this.navs}/>
                <View style={styles.inputWrapper}>
                    <Text style={styles.inputHint}>
                        原密码
                    </Text>
                    <TextInput
                        style={styles.inputInput}
                        underlineColorAndroid={'transparent'}
                        placeholder={'在此输入旧密码'}
                        placeholderTextColor={'#aaa'}
                        secureTextEntry={true}
                        onChangeText={this.onOldPwdChangeText}
                        autoFocus={Platform.OS === 'web' ? false : true}
                        clearButtonMode={'while-editing'}
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <Text style={styles.inputHint}>
                        新密码
                    </Text>
                    <TextInput
                        style={styles.inputInput}
                        underlineColorAndroid={'transparent'}
                        placeholder={'新密码长度不得小于6位'}
                        placeholderTextColor={'#aaa'}
                        secureTextEntry = {true}
                        onChangeText={this.onNewPwdChangeText}
                        clearButtonMode={'while-editing'}
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <Text style={styles.inputHint}>
                        重复新密码
                    </Text>
                    <TextInput
                        style={styles.inputInput}
                        underlineColorAndroid={'transparent'}
                        placeholder={'在此再次输入新密码'}
                        placeholderTextColor={'#aaa'}
                        secureTextEntry = {true}
                        onChangeText={this.onNewSurePwdChangeText}
                        clearButtonMode={'while-editing'}
                    />
                </View>
                <View style={styles.wrapper}>
                    <TouchableOpacity
                        disabled={disabled}
                        onPress={this._onConfirm}>
                        <Animated.View
                            style={[styles.button, {backgroundColor: color}]}>
                            <Text style={styles.buttonText}>
                                确认
                            </Text>
                        </Animated.View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f1f1',
    },
    button: {
        backgroundColor: 'rgba(24,190,188,1.0)',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 30,
        paddingRight: 30,
        borderRadius: 30,
        marginTop: 30
    },
    buttonText: {
        color: 'white',
        fontSize: 16
    },
    wrapper: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputWrapper: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection: 'row',
        marginTop: 10,
        width: width
    },
    inputHint: {
        marginLeft: 10
    },
    inputInput: {
        width: width - 100,
        borderRadius: 5,
        borderColor: '#ccc',
        borderWidth: 1,
        height: 40,
        padding: 5,
        justifyContent: 'center',
        marginLeft: 10,
        marginRight: 10
    }
});


export const LayoutComponent = UserSettingPasswd;
export function mapStateToProps(state, props) {
    return {
        routes: state.nav.routes,
        userInfo: state.user.publicInfo
    };
}
