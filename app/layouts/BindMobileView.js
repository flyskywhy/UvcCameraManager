import React, {PureComponent} from 'react';
import {View, Text, TextInput, StyleSheet, Platform} from 'react-native';
import PropTypes from 'prop-types';

import * as utils from '../utils';
import CountDown from '../components/CountDown';

class BindMobileView extends PureComponent {
  constructor(props) {
    super(props);
    this.phone = '';
    this.vCode = '';
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

  startCountDown = () => {
    this.countDown && this.countDown.setCountdown(120);
    this.countDown && this.countDown.startCountDown();
  };

  static propTypes = {
    getVcodePress: PropTypes.func,
  };

  onPhoneChangeText = (text) => {
    this.setPhone(utils.trim(text));
  };

  onVcodeChangeText = (text) => {
    this.setVcode(utils.trim(text));
  };

  refCountDown = (view) => {
    this.countDown = view;
  };

  render() {
    return (
      <View>
        <Text style={styles.inputHint}>输入手机号</Text>
        <TextInput
          onChangeText={this.onPhoneChangeText}
          keyboardType={'phone-pad'}
          placeholder={'在此输入您的手机号'}
          underlineColorAndroid={'transparent'}
          placeholderTextColor={'#aaa'}
          style={styles.phoneInput}
          autoFocus={Platform.OS === 'web' ? false : true}
          clearButtonMode={'while-editing'}
        />
        <Text style={styles.inputHint}>输入验证码</Text>
        <View style={styles.countDownView}>
          <TextInput
            onChangeText={this.onVcodeChangeText}
            keyboardType={'phone-pad'}
            placeholder={'在此输入您的验证码'}
            underlineColorAndroid={'transparent'}
            placeholderTextColor={'#aaa'}
            style={styles.vcodeInput}
            clearButtonMode={'while-editing'}
          />
          <CountDown
            ref={this.refCountDown}
            onPress={this.props.getVcodePress}
            style={styles.vcode}
            vcodeTextStyle={styles.vcodeText}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputHint: {
    textAlign: 'left',
    fontSize: 14,
    marginTop: 15,
  },
  phoneInput: {
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
    height: 40,
    padding: 5,
    justifyContent: 'center',
    backgroundColor: 'white',
    marginTop: 15,
  },
  vcodeInput: {
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
    height: 40,
    padding: 5,
    justifyContent: 'center',
    backgroundColor: 'white',
    flex: 5,
  },
  vcode: {
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    backgroundColor: 'white',
    alignItems: 'center',
    marginLeft: 5,
    flex: 2,
  },
  vcodeText: {
    color: 'rgba(255,165,0,1.0)',
  },
  countDownView: {
    marginTop: 15,
    flexDirection: 'row',
  },
});

export default BindMobileView;
