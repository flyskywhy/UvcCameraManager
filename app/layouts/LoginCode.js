import React, {
    PureComponent
} from 'react';
import {
    Platform,
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Keyboard,
    TouchableWithoutFeedback,
    Image
} from 'react-native';

import * as utils from '../utils';
import ActivityIndicatorModal from '../components/ActivityIndicatorModal';
import CountDown from '../components/CountDown';

class Login extends PureComponent {

    constructor(props) {
        super(props);
        const {
            phone
        } = this.props;
        this.loginPhone = phone ? phone : '';
        this.loginVCode = '';
        this.state = {
            loadModalVisible: false
        };
    }

    startCountDown = () => {
        this.countDown && this.countDown.setCountdown(120);
        this.countDown && this.countDown.startCountDown();
    }

    setPhone(phone) {
        this.loginPhone = phone;
    }

    setVCode(vCode) {
        this.loginVCode = vCode;
    }

    toLoginResetPasswd = () => {
        const {
            navigation,
            routerName
        } = this.props;
        this.dismissKeyBoard();
        navigation.navigate('LoginResetPasswd', {
            routerName
        });
    }

    toRegister = () => {
        const {
            navigation,
            routerName
        } = this.props;
        this.dismissKeyBoard();
        navigation.navigate('Register', {
            routerName
        });
    }

    _onGetVcodePress = () => {
        const {
            actions
        } = this.props;
        let mobile = this.loginPhone;
        if (!mobile) {
            actions.toast('手机号码不能为空');
            return;
        }
        if (!utils.checkPhone(mobile)) {
            actions.toast('手机号码格式不正确');
            return;
        }
        actions.getLoginVerification(mobile, () => {
            this.dismissLoadingModal();
            actions.toast('验证码发送成功');
            this.startCountDown();
        }, () => {
            this.dismissLoadingModal();
            actions.toast('验证码发送失败');
        });
    }

    _onLoginPress = () => {
        const {
            actions,
            navigation,
        } = this.props;
        let username = this.loginPhone;
        let verifycode = this.loginVCode;
        if (!username) {
            actions.toast('手机号码不能为空');
            return;
        }
        if (!verifycode) {
            actions.toast('验证码不能为空');
            return;
        }
        if (!utils.checkPhone(username)) {
            actions.toast('手机号码格式不正确');
            return;
        }
        this.showLoadingModal();
        actions.loginCode(username, verifycode, () => {
            this.dismissLoadingModal();
            actions.toast('登录成功');
            actions.updateDevices();
            actions.saveUserPhone(username);
            navigation.goBack();
        }, error => {
            this.dismissLoadingModal();
        });
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

    dismissKeyBoard = () => {
        Platform.OS !== 'web' && Keyboard.dismiss();
    }

    onPhoneTextChange = (text) => {
        this.setPhone(utils.trim(text));
    }

    onVCodeTextChange = (text) => {
        this.setVCode(utils.trim(text));
    }

    refCountDown = (view) => {
        this.countDown = view;
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={this.dismissKeyBoard}>
                <View style={styles.loginView}>
                    <ActivityIndicatorModal
                        visible={this.state.loadModalVisible}
                        onRequestClose={this.dismissLoadingModal}
                    />
                    <View style={styles.viewWrapper}>
                        <View style={styles.inputContainer}>
                            <Image
                                source={require('../images/common/pic_phone.png')}
                                style={styles.image}
                            />
                            <TextInput
                                accessibilityLabel="手机号"
                                onChangeText={this.onPhoneTextChange}
                                keyboardType={'phone-pad'}
                                placeholder={'手机号'}
                                style={styles.input}
                                underlineColorAndroid={'transparent'}
                                placeholderTextColor={'#aaa'}
                                defaultValue={this.loginPhone}
                                clearButtonMode={'while-editing'}
                                placeholderTextColor={'#DADADA'}
                            />
                        </View>
                        <View style={styles.vcodeContainer}>
                            <View style={styles.vcodeInputContainer}>
                                <Image
                                    source={require('../images/common/icon_identifying_code.png')}
                                    style={styles.image}
                                />
                                <TextInput
                                    accessibilityLabel="验证码"
                                    secureTextEntry={true}
                                    style={styles.input}
                                    onChangeText={this.onVCodeTextChange}
                                    placeholder={'验证码'}
                                    underlineColorAndroid={'transparent'}
                                    clearButtonMode={'while-editing'}
                                    placeholderTextColor={'#DADADA'}
                                />
                            </View>
                            <CountDown
                                ref={this.refCountDown}
                                onPress={this._onGetVcodePress}
                                style={styles.vcode}
                                vcodeTextStyle={styles.vcodeText}
                           />
                        </View>
                        <TouchableOpacity
                            accessibilityLabel="登录"
                            style={styles.loginButton}
                            onPress={this._onLoginPress}>
                            <Text style={styles.loginButtonText}>
                                登 录
                            </Text>
                        </TouchableOpacity>
                        <View style={styles.textWrapper}>
                            <TouchableOpacity
                                onPress={this.toLoginResetPasswd}
                                style={styles.forgotPwdBotton}>
                                <Text style={styles.text}>
                                    忘记密码?
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={this.toRegister}
                                style={styles.registerBotton}>
                                <Text style={styles.text}>
                                    马上注册！
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    loginView: {
        flex: 1,
        backgroundColor: '#f1f1f1'
    },
    viewWrapper: {
        marginLeft: 30,
        marginRight: 30
    },
    inputContainer: {
        borderRadius: 3,
        borderColor: '#CCCCCC',
        borderWidth: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        height: 40,
        marginTop: 25,
        flexDirection: 'row'
    },
    vcodeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 25,
    },
    vcodeInputContainer: {
        borderRadius: 3,
        borderColor: '#CCCCCC',
        borderWidth: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        height: 40,
        flexDirection: 'row',
        flex: 5
    },
    input: {
        flex: 1,
        fontSize: 14
    },
    textWrapper: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: 10
    },
    loginButton: {
        backgroundColor: '#18BEBC',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 3,
        marginTop: 25
    },
    loginButtonText: {
        color: 'white',
        fontSize: 18
    },
    forgotPwdBotton: {
        marginLeft: 10
    },
    registerBotton: {
        marginRight: 10
    },
    text: {
        color: '#666666',
        fontSize: 12
    },
    image: {
        marginLeft: 10
    },
    vcode: {
        borderRadius: 3,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        paddingHorizontal: 15,
        backgroundColor: '#18BEBC',
        flex: 2,
        alignSelf: 'center'
    },
    vcodeText: {
        color: 'white',
    },
});

export const LayoutComponent = Login;
export function mapStateToProps(state) {
    return {
        phone: state.localPersistence.userPhone
    };
}
