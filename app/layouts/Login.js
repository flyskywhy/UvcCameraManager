import React, {PureComponent} from 'react';
import {
  Platform,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';

import * as utils from '../utils';
import ActivityIndicatorModal from '../components/ActivityIndicatorModal';

class Login extends PureComponent {
  constructor(props) {
    super(props);
    const {phone} = this.props;
    this.loginPhone = phone ? phone : '';
    this.loginPassword = '';
    this.state = {
      loadModalVisible: false,
    };
  }

  _login = () => {
    const {navigation, actions, callback} = this.props;
    actions.login(
      this.loginPhone,
      this.loginPassword,
      (data) => {
        this.dismissLoadingModal();
        actions.toast('登录成功');
        callback && callback(data.publicInfo.id);
        actions.updateDevices();
        actions.saveUserPhone(this.loginPhone);
        navigation.goBack();
      },
      (error) => {
        this.dismissLoadingModal();
      },
    );
  };

  _onLoginPress = () => {
    const {actions} = this.props;
    if (!this.loginPhone) {
      actions.toast('手机号码不能为空');
      return;
    }
    if (!this.loginPassword) {
      actions.toast('密码不能为空');
      return;
    }
    this.showLoadingModal();
    actions.logoutBackend({
      resolved: () => {
        this._login();
      },
      rejected: () => {
        this._login();
      },
    });
  };

  setPhone(phone) {
    this.loginPhone = phone;
  }

  setPassword(Password) {
    this.loginPassword = Password;
  }

  toLoginResetPasswd = () => {
    const {navigation, routerName} = this.props;
    this.dismissKeyBoard();
    navigation.navigate('LoginResetPasswd', {
      routerName,
    });
  };

  toRegister = () => {
    const {navigation, routerName} = this.props;
    this.dismissKeyBoard();
    navigation.navigate('Register', {
      routerName,
    });
  };

  showLoadingModal = () => {
    this.setState({
      loadModalVisible: true,
    });
  };

  dismissLoadingModal = () => {
    this.setState({
      loadModalVisible: false,
    });
  };

  dismissKeyBoard = () => {
    Platform.OS !== 'web' && Keyboard.dismiss();
  };

  onPhoneTextChange = (text) => {
    this.setPhone(utils.trim(text));
  };

  onPwdTextChange = (text) => {
    this.setPassword(text);
  };

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
                defaultValue={this.loginPhone}
                clearButtonMode={'while-editing'}
                placeholderTextColor={'#DADADA'}
              />
            </View>
            <View style={styles.inputContainer}>
              <Image
                source={require('../images/common/pic_passwprd.png')}
                style={styles.image}
              />
              <TextInput
                accessibilityLabel="密码"
                secureTextEntry={true}
                style={styles.input}
                onChangeText={this.onPwdTextChange}
                placeholder={'密码'}
                underlineColorAndroid={'transparent'}
                clearButtonMode={'while-editing'}
                placeholderTextColor={'#DADADA'}
              />
            </View>
            <TouchableOpacity
              accessibilityLabel="登录"
              style={styles.loginButton}
              onPress={this._onLoginPress}>
              <Text style={styles.loginButtonText}>登 录</Text>
            </TouchableOpacity>
            <View style={styles.textWrapper}>
              <TouchableOpacity
                onPress={this.toLoginResetPasswd}
                style={styles.forgotPwdBotton}>
                <Text style={styles.text}>忘记密码?</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.toRegister}
                style={styles.registerBotton}>
                <Text style={styles.text}>马上注册！</Text>
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
    backgroundColor: '#f1f1f1',
  },
  viewWrapper: {
    marginLeft: 30,
    marginRight: 30,
  },
  inputContainer: {
    borderRadius: 3,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    height: 40,
    marginTop: 25,
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
  textWrapper: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 10,
  },
  loginButton: {
    backgroundColor: '#18BEBC',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 3,
    marginTop: 25,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
  },
  forgotPwdBotton: {
    marginLeft: 10,
  },
  registerBotton: {
    marginRight: 10,
  },
  text: {
    color: '#666666',
    fontSize: 12,
  },
  image: {
    marginLeft: 10,
  },
});

export const LayoutComponent = Login;
export function mapStateToProps(state) {
  return {
    phone: state.localPersistence.userPhone,
  };
}
