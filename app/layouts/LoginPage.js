import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';

import connectComponent from '../utils/connectComponent';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import * as LoginComponent from './Login';
import * as LoginCodeComponent from './LoginCode';
import Nav from '../components/Nav';

const Login = connectComponent(LoginComponent);
const LoginCode = connectComponent(LoginCodeComponent);

class LoginPage extends PureComponent {
  constructor(props) {
    super(props);
    this.navs = {
      Left: {
        onPress: () => props.navigation.goBack(),
      },
      Center: {
        text: '登录',
      },
    };
  }

  render() {
    const {navigation, callback, routerName} = this.props;
    return (
      <View style={styles.container}>
        <Nav navs={this.navs} />
        <ScrollableTabView
          tabBarBackgroundColor="white"
          tabBarUnderlineStyle={{backgroundColor: '#18BEBC'}}
          tabBarActiveTextColor="#18BEBC"
          tabBarInactiveTextColor="#666666">
          <Login
            tabLabel="账号密码登录"
            navigation={navigation}
            callback={callback}
            routerName={routerName}
          />
          <LoginCode
            tabLabel="验证码登录"
            navigation={navigation}
            routerName={routerName}
          />
        </ScrollableTabView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F2F2',
    flex: 1,
  },
});

export const LayoutComponent = LoginPage;
export function mapStateToProps(state) {
  return {
    width: state.utils.width,
  };
}
