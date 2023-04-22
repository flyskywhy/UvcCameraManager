import React, {PureComponent} from 'react';
import {
  Platform,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ScrollView,
} from 'react-native';

import Nav from '../components/Nav';
import * as utils from '../utils';
import RegisterOrForgetPwd from './RegisterOrForgetPwd';
import ActivityIndicatorModal from '../components/ActivityIndicatorModal';

class LoginResetPasswd extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loadModalVisible: false,
    };
    this.navs = {
      Left: {
        onPress: () => props.navigation.goBack(),
      },
      Center: {
        text: '忘记密码',
      },
    };
  }

  _onGetVcodePress = () => {
    const {actions} = this.props;
    let phone = this.forgetPwdView.getPhone();
    if (!phone) {
      actions.toast('手机号码不能为空');
      return;
    }
    if (!utils.checkPhone(phone)) {
      actions.toast('手机号码格式不正确');
      return;
    }
    this.showLoadingModal();
    actions.checkUserExistence(
      phone,
      () => {
        actions.getUserForgetPasswdVerification(
          phone,
          () => {
            this.dismissLoadingModal();
            actions.toast('验证码发送成功');
            this.forgetPwdView.startCountDown();
          },
          () => {
            this.dismissLoadingModal();
            actions.toast('验证码发送失败');
          },
        );
      },
      (error) => {
        this.dismissLoadingModal();
        if (error.res.status === 400) {
          actions.toast('账户不存在，请先去注册');
        }
      },
    );
  };

  _onResetUserPwd = () => {
    const {actions} = this.props;
    let phone = this.forgetPwdView.getPhone();
    let vCode = this.forgetPwdView.getVcode();
    let password = this.forgetPwdView.getPassword();
    let surePassword = this.forgetPwdView.getSurePassword();
    if (!phone) {
      actions.toast('手机号码不能为空');
      return;
    }
    if (!vCode) {
      actions.toast('验证码不能为空');
      return;
    }
    if (!password) {
      actions.toast('密码不能为空');
      return;
    }
    if (!surePassword) {
      actions.toast('确认密码不能为空');
      return;
    }
    if (!utils.checkPhone(phone)) {
      actions.toast('手机号码格式不正确');
      return;
    }
    if (password.length < 6) {
      actions.toast('密码长度不能小于6位');
      return;
    }
    if (password !== surePassword) {
      actions.toast('两次密码不一致，请检查密码填写是否正确');
      return;
    }
    this.showLoadingModal();
    actions.resetUserPasswd({
      phone: phone,
      password: password,
      verifCode: vCode,
      resolved: () => {
        this.dismissLoadingModal();
        actions.toast('重置成功');
        setTimeout(() => {
          this.alertLogin();
        }, 1000);
      },
      rejected: (error) => {
        this.dismissLoadingModal();
        error.res.json &&
          error.res
            .json()
            .then((result) => actions.toast(result.err))
            .catch(() => {});
      },
    });
  };

  _onLoginPress = () => {
    const {actions, navigation, routes} = this.props;
    let phone = this.forgetPwdView.getPhone();
    let password = this.forgetPwdView.getPassword();
    if (!phone) {
      actions.toast('手机号码不能为空');
      return;
    }
    if (!password) {
      actions.toast('密码不能为空');
      return;
    }
    this.showLoadingModal();
    actions.login(
      this.forgetPwdView.getPhone(),
      this.forgetPwdView.getPassword(),
      () => {
        this.dismissLoadingModal();
        actions.toast('登录成功');
        actions.saveUserPhone(this.forgetPwdView.getPhone());
        navigation.goBack(routes[routes.length - 2].key);
      },
      (error) => {
        this.dismissLoadingModal();
        error.res.json &&
          error.res
            .json()
            .then((result) => actions.toast(result.data))
            .catch(() => {});
      },
    );
  };

  alertLogin = () => {
    Alert.alert(
      '提示',
      '密码重置成功，是否现在登录',
      [
        {text: '取消', onPress: () => {}},
        {text: '确认', onPress: this._onLoginPress},
      ],
      {cancelable: true},
    );
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

  refForgetPwdView = (view) => {
    this.forgetPwdView = view;
  };

  render() {
    return (
      <View style={styles.container}>
        <Nav navs={this.navs} />
        <ActivityIndicatorModal
          visible={this.state.loadModalVisible}
          onRequestClose={this.dismissLoadingModal}
        />
        <ScrollView keyboardShouldPersistTaps="handled">
          <TouchableWithoutFeedback onPress={this.dismissKeyBoard}>
            <View style={styles.container}>
              <View style={styles.loginResetPwdView}>
                <RegisterOrForgetPwd
                  ref={this.refForgetPwdView}
                  getVcodePress={this._onGetVcodePress}
                />
                <TouchableOpacity
                  style={styles.resetUserPwdButton}
                  onPress={this._onResetUserPwd}>
                  <Text style={styles.resetUserPwdButtonText}>确 认</Text>
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
    backgroundColor: '#f1f1f1',
  },
  loginResetPwdView: {
    paddingLeft: 30,
    paddingRight: 30,
    flex: 1,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  resetUserPwdButton: {
    backgroundColor: '#18BEBC',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 3,
    marginTop: 20,
    marginBottom: 10,
  },
  resetUserPwdButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export const LayoutComponent = LoginResetPasswd;
export function mapStateToProps(state) {
  return {
    routes: state.nav.routes,
  };
}
