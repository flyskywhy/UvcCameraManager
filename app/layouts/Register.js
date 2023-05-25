import React, {PureComponent} from 'react';
import {
  Platform,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';

import Nav from '../components/Nav';
import * as utils from '../utils';
import RegisterOrForgetPwd from './RegisterOrForgetPwd';
import ActivityIndicatorModal from '../components/ActivityIndicatorModal';
import config from '../configs';
import CheckBox from '@chainsoft/react-native-checkbox';

const url = config.license;

class Register extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loadModalVisible: false,
      qrCode: '',
    };
    this.navs = {
      Left: {
        onPress: () => props.navigation.goBack(),
      },
      Center: {
        text: '注册',
      },
    };
  }

  _onGetVcodePress = () => {
    const {actions} = this.props;
    let phone = this.registerView.getPhone();
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
        actions.toast('账户已经存在，请不要重复注册');
        this.dismissLoadingModal();
      },
      (error) => {
        if (error.res.status === 400) {
          //用户不存在
          actions.getVcode(
            phone,
            () => {
              this.dismissLoadingModal();
              actions.toast('验证码发送成功');
              this.registerView.startCountDown();
            },
            () => {
              this.dismissLoadingModal();
              actions.toast('验证码发送失败');
            },
          );
        } else {
          this.dismissLoadingModal();
        }
      },
    );
  };

  _onRegisterPress = () => {
    const {actions, navigation, routes} = this.props;
    let phone = this.registerView.getPhone();
    let vCode = this.registerView.getVcode();
    let password = this.registerView.getPassword();
    let surePassword = this.registerView.getSurePassword();
    let qrCode = utils.trim(this.state.qrCode);
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
    if (!qrCode) {
      actions.toast('产品编码不能为空');
      return;
    }
    if (this.checkBox.getChecked() === false) {
      actions.toast('注册前先请阅读相关协议');
      return;
    }
    this.showLoadingModal();
    actions.checkUserExistence(
      phone,
      () => {
        actions.toast('账户已经存在，请不要重复注册');
        this.dismissLoadingModal();
      },
      (error) => {
        if (error.res.status === 400) {
          actions.checkUserExistence(
            qrCode,
            () => {
              // 分享码
              actions.toast('TODO: 分享码');
              this.dismissLoadingModal();
            },
            (err) => {
              // 产品编码
              if (err.res.status === 400) {
                actions.register(
                  phone,
                  password,
                  vCode,
                  () => {
                    this.dismissLoadingModal();
                    actions.toast('注册成功');
                    actions.login(
                      phone,
                      password,
                      () => {
                        actions.saveUserPhone(phone);
                        actions.registerDev(
                          qrCode,
                          'foobar',
                          '',
                          (device) => {
                            actions.configDev(
                              device.id,
                              {
                                moduleId: qrCode,
                                name: 'Home',
                              },
                              '',
                              () => actions.updateDevices(),
                              () => actions.updateDevices(),
                            );
                          },
                          () => {},
                        );
                        navigation.goBack(routes[routes.length - 2].key);
                      },
                      (e) => {
                        e.res.json &&
                          e.res
                            .json()
                            .then((result) => actions.toast(result.data))
                            .catch(() => {});
                      },
                    );
                  },
                  () => {
                    this.dismissLoadingModal();
                    actions.toast('注册失败');
                  },
                );
              } else {
                this.dismissLoadingModal();
              }
            },
          );
        } else {
          this.dismissLoadingModal();
        }
      },
    );
  };

  onQrCodeChangeText = (qrCode) => {
    this.setState({
      qrCode,
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

  refRegisterView = (view) => {
    this.registerView = view;
  };

  refCheckBox = (view) => {
    this.checkBox = view;
  };

  onCheckBoxClick = () => {};

  toWebView = () =>
    this.props.navigation.navigate('WebViewLayout', {
      url,
      text: '协议',
    });

  toQRCode = () => {
    const {navigation} = this.props;
    navigation.navigate('QRCode', {
      isRegister: true,
      callback: (qrcode) => {
        this.setState({
          qrCode: utils.trim(qrcode),
        });
      },
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Nav navs={this.navs} />
        <ActivityIndicatorModal
          visible={this.state.loadModalVisible}
          onRequestClose={this.dismissLoadingModal}
        />
        <ScrollView style={{flex: 1}} keyboardShouldPersistTaps="handled">
          <TouchableWithoutFeedback onPress={this.dismissKeyBoard}>
            <View style={styles.container}>
              <View style={styles.registerView}>
                <RegisterOrForgetPwd
                  ref={this.refRegisterView}
                  getVcodePress={this._onGetVcodePress}
                />
                <View style={styles.inputContainer}>
                  <Image
                    source={require('../images/common/icon-Recommend.png')}
                    style={styles.image}
                  />
                  <TextInput
                    accessibilityLabel="产品编码"
                    onChangeText={this.onQrCodeChangeText}
                    keyboardType={'phone-pad'}
                    placeholder={'产品编码'}
                    style={styles.input}
                    value={this.state.qrCode}
                    underlineColorAndroid={'transparent'}
                    clearButtonMode={'while-editing'}
                    placeholderTextColor={'#DADADA'}
                  />
                  {Platform.OS !== 'web' ? (
                    <TouchableOpacity onPress={this.toQRCode}>
                      <Image
                        source={require('../images/common/btn-scan-code.png')}
                        style={styles.qrcodeImage}
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>
                <View style={styles.protocolContainer}>
                  <CheckBox
                    style={styles.checkBoxContainer}
                    isChecked={false}
                    onClick={this.onCheckBoxClick}
                    ref={this.refCheckBox}
                  />
                  <Text style={styles.inputHint}>
                    我已阅读并同意
                    <Text style={styles.protocolText} onPress={this.toWebView}>
                      UvcCameraManager 软件许可及服务协议
                    </Text>
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={this._onRegisterPress}>
                  <Text style={styles.registerButtonText}>注 册</Text>
                </TouchableOpacity>
                <View style={styles.textWrapper}>
                  <TouchableOpacity onPress={this.routerPop}>
                    <Text style={styles.text}>已有账号？返回登录</Text>
                  </TouchableOpacity>
                </View>
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
    backgroundColor: '#f2f2f2',
  },
  registerView: {
    paddingLeft: 30,
    paddingRight: 30,
    flex: 1,
  },
  registerButton: {
    backgroundColor: '#18BEBC',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 3,
    marginTop: 20,
    marginBottom: 10,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
  },
  protocolContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  checkBoxContainer: {
    paddingLeft: 3,
    paddingRight: 3,
  },
  inputHint: {
    fontSize: 13,
    flex: 1,
  },
  protocolButton: {},
  protocolText: {
    color: '#18BEBC',
  },
  text: {
    fontSize: 12,
    color: '#666666',
  },
  textWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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
  image: {
    marginLeft: 10,
  },
  qrcodeImage: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
});

export const LayoutComponent = Register;
export function mapStateToProps(state) {
  return {
    routes: state.nav.routes,
    ui: state.userUI,
  };
}
