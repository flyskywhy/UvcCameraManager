import React, {
    PureComponent
} from 'react';
import {
    Platform,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView
} from 'react-native';

import Nav from '../components/Nav';
import * as utils from '../utils';
import BindMobileView from './BindMobileView';
import config from '../configs';
import ActivityIndicatorModal from '../components/ActivityIndicatorModal';
import CheckBox from 'react-native-check-box';

const url = config.license;

class BindMobile extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            loadModalVisible: false
        };
        this.navs = {
            Left: {
                onPress: () => props.navigation.goBack()
            },
            Center: {
                text: '绑定手机号',
            }
        };
    }

    _onGetVcodePress = () => {
        const {
            actions
        } = this.props;
        let phone = this.registerView.getPhone();
        if (!phone) {
            actions.toast('手机号码不能为空');
            return;
        }
        if (!utils.checkPhone(phone)) {
            actions.toast('手机号码格式不正确');
            return;
        }
        actions.getBindPhoneSend({
            phone: phone,
            resolved: () => {
                this.dismissLoadingModal();
                actions.toast('验证码发送成功');
                this.registerView.startCountDown();
            },
            rejected: () => {
                this.dismissLoadingModal();
            }
        });
    }

    _onRegisterPress = () => {
        const {
            actions,
            navigation
        } = this.props;
        let phone = this.registerView.getPhone();
        let vCode = this.registerView.getVcode();
        if (!phone) {
            actions.toast('手机号码不能为空');
            return;
        }
        if (!vCode) {
            actions.toast('验证码不能为空');
            return;
        }
        if (!utils.checkPhone(phone)) {
            actions.toast('手机号码格式不正确');
            return;
        }
        if (this.checkBox.getChecked() === false) {
            actions.toast('绑定前先请阅读相关协议');
            return;
        }
        this.showLoadingModal();
        actions.getBindPhoneVerify({
            phone: phone,
            verifycode: vCode,
            resolved: () => {
                this.dismissLoadingModal();
                actions.toast('绑定成功');
                actions.updateUserPhonerLocal(phone);
                navigation.goBack();
            },
            rejected: () => {
                this.dismissLoadingModal();
            }
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

    refRegisterView = (view) => {
        this.registerView = view;
    }

    refCheckBox = (view) => {
        this.checkBox = view;
    }

    onCheckBoxClick = () => {

    }

    toWebView = () => this.props.navigation.navigate('WebViewLayout', {url, text: '协议'});

    render() {
        return (
            <View style={styles.container}>
                <Nav navs={this.navs}/>
                <ActivityIndicatorModal
                    visible={this.state.loadModalVisible}
                    onRequestClose={this.dismissLoadingModal}
                />
                <ScrollView keyboardShouldPersistTaps="handled">
                    <TouchableWithoutFeedback onPress={this.dismissKeyBoard}>
                        <View style={styles.registerView}>
                            <BindMobileView
                                ref={this.refRegisterView}
                                getVcodePress={this._onGetVcodePress}
                            />
                            <View style={styles.protocolContainer}>
                                <CheckBox
                                    style={styles.checkBoxContainer}
                                    isChecked={false}
                                    onClick={this.onCheckBoxClick}
                                    ref={this.refCheckBox}
                                />
                                <Text style={styles.inputHint}>
                                    我已阅读并同意
                                    <Text
                                        style={styles.protocolText}
                                        onPress={this.toWebView}>
                                        UvcCameraManager 软件许可及服务协议
                                    </Text>
                                </Text>
                            </View>
                            <View style={styles.button}>
                                <TouchableOpacity
                                    style={styles.registerButton}
                                    onPress={this._onRegisterPress}>
                                    <Text style={styles.registerButtonText}>
                                        绑定
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f1f1'
    },
    registerView: {
        paddingLeft: 30,
        paddingRight: 30,
        flex: 1
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20
    },
    registerButton: {
        backgroundColor: 'rgba(24,190,188,1.0)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 40,
        paddingRight: 40,
        borderRadius: 20
    },
    registerButtonText: {
        color: 'white',
        fontSize: 16
    },
    protocolContainer: {
        flexDirection: 'row',
        marginRight: 30
    },
    checkBoxContainer: {
        padding: 10,
        paddingLeft: 0,
        paddingRight: 5
    },
    inputHint: {
        fontSize: 13,
        alignSelf: 'center'
    },
    protocolButton: {
        alignSelf: 'center'
    },
    protocolText: {
        color: 'rgba(24,190,188,1.0)'
    }
});

export default BindMobile;
