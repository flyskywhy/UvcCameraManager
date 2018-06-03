import React, {
    PureComponent
} from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    Image
} from 'react-native';
import PropTypes from 'prop-types';

import * as utils from '../utils';
import CountDown from '../components/CountDown';

class RegisterOrForgetPwd extends PureComponent {

    constructor(props) {
        super(props);
        this.phone = '';
        this.vCode = '';
        this.password = '';
        this.surePassword = '';
    }

    getPhone() {
        return this.phone;
    }

    setPhone(phone) {
        this.phone = phone;
    }

    getVcode() {
        return this.vCode;
    }

    setVcode(vCode) {
        this.vCode = vCode;
    }

    getPassword() {
        return this.password;
    }

    setPassword(password) {
        this.password = password;
    }

    getSurePassword() {
        return this.surePassword;
    }

    setSurePassword(surePassword) {
        this.surePassword = surePassword;
    }

    startCountDown = () => {
        this.countDown && this.countDown.setCountdown(120);
        this.countDown && this.countDown.startCountDown();
    }

    onPhoneChangeText = (text) => {
        this.setPhone(utils.trim(text));
    }

    onVcodeChangeText = (text) => {
        this.setVcode(utils.trim(text));
    }

    onPwdChangeText = (text) => {
        this.setPassword(text);
    }

    onSurePwdChangeText = (text) => {
        this.setSurePassword(text);
    }

    refCountDown = (view) => {
        this.countDown = view;
    }

    render() {
        return (
            <View>
                <View style={styles.inputContainer}>
                    <Image
                        source={require('../images/common/pic_phone.png')}
                        style={styles.image}
                    />
                    <TextInput
                        accessibilityLabel="手机号"
                        onChangeText={this.onPhoneChangeText}
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
                            keyboardType={'phone-pad'}
                            style={styles.input}
                            onChangeText={this.onVcodeChangeText}
                            placeholder={'验证码'}
                            placeholderTextColor={'#aaa'}
                            underlineColorAndroid={'transparent'}
                            clearButtonMode={'while-editing'}
                            placeholderTextColor={'#DADADA'}
                        />
                    </View>
                    <CountDown
                        ref={this.refCountDown}
                        onPress={this.props.getVcodePress}
                        style={styles.vcode}
                        vcodeTextStyle={styles.vcodeText}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Image
                        source={require('../images/common/pic_passwprd.png')}
                        style={styles.image}
                    />
                    <TextInput
                        accessibilityLabel="设置密码"
                        onChangeText={this.onPwdChangeText}
                        placeholder={'设置密码'}
                        style={styles.input}
                        underlineColorAndroid={'transparent'}
                        placeholderTextColor={'#aaa'}
                        clearButtonMode={'while-editing'}
                        placeholderTextColor={'#DADADA'}
                        secureTextEntry={true}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Image
                        source={require('../images/common/pic_cPasswprd.png')}
                        style={styles.image}
                    />
                    <TextInput
                        accessibilityLabel="确认密码"
                        onChangeText={this.onSurePwdChangeText}
                        placeholder={'确认密码'}
                        style={styles.input}
                        underlineColorAndroid={'transparent'}
                        placeholderTextColor={'#aaa'}
                        clearButtonMode={'while-editing'}
                        placeholderTextColor={'#DADADA'}
                        secureTextEntry={true}
                    />
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
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
    image: {
        marginLeft: 10
    },
    input: {
        flex: 1,
        fontSize: 14
    },
});

export default RegisterOrForgetPwd;
