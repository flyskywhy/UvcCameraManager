import React from 'react';
import {Image, StyleSheet} from 'react-native';

import {createAppContainer} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';

import config from '../configs';

import HomeRenderIcon from '../images/pic/btn-homepage2.png';
import HomePressedIcon from '../images/pic/btn-homepage.png';
import UserCenterRenderIcon from '../images/common/tab_gerenzhongxini_n.png';
import UserCenterPressedIcon from '../images/common/tab_gerenzhongxini_h.png';

// 请按字母排序以方便人工检索
import * as About from '../layouts/About';
import * as Camera from '../layouts/Camera';
import * as ConnectDevice from '../layouts/ConnectDevice';
import * as Drawer from '../layouts/Drawer';
import * as Device from '../layouts/Device';
import * as Login from '../layouts/Login';
import * as LoginCode from '../layouts/LoginCode';
import * as LoginPage from '../layouts/LoginPage';
import * as LoginResetPasswd from '../layouts/LoginResetPasswd';
import * as QRCodes from '../layouts/QRCodes';
import * as Register from '../layouts/Register';
import * as Setting from '../layouts/Setting';
import * as User from '../layouts/User';
import * as UserSetting from '../layouts/UserSetting';
import * as UserSettingAddr from '../layouts/UserSettingAddr';
import * as UserSettingEmail from '../layouts/UserSettingEmail';
import * as UserSettingName from '../layouts/UserSettingName';
import * as UserSettingPasswd from '../layouts/UserSettingPasswd';
import * as WebViewLayout from '../layouts/WebViewLayout';

import connectComponent from '../utils/connectComponent';

const styles = StyleSheet.create({
  tabIcon: {
    height: 23,
    width: 23,
    resizeMode: 'cover',
  },
});

// 请按字母排序以方便人工检索
const StackRouteConfigs = {
  About: {
    screen: connectComponent(About),
  },
  ConnectDevice: {
    screen: connectComponent(ConnectDevice),
  },
  Camera: {
    screen: connectComponent(Camera),
  },
  Device: {
    screen: connectComponent(Device),
  },
  Login: {
    screen: connectComponent(Login),
  },
  LoginCode: {
    screen: connectComponent(LoginCode),
  },
  LoginPage: {
    screen: connectComponent(LoginPage),
  },
  LoginResetPasswd: {
    screen: connectComponent(LoginResetPasswd),
  },
  QRCodes: {
    screen: connectComponent(QRCodes),
  },
  Register: {
    screen: connectComponent(Register),
  },
  Setting: {
    screen: connectComponent(Setting),
  },
  UserSetting: {
    screen: connectComponent(UserSetting),
  },
  UserSettingAddr: {
    screen: connectComponent(UserSettingAddr),
  },
  UserSettingEmail: {
    screen: connectComponent(UserSettingEmail),
  },
  UserSettingName: {
    screen: connectComponent(UserSettingName),
  },
  UserSettingPasswd: {
    screen: connectComponent(UserSettingPasswd),
  },
  WebViewLayout: {
    screen: connectComponent(WebViewLayout),
  },
};

const StackNavigatorConfigs = {
  initialRouteName: 'Camera', // 初始化哪个界面为根界面
  mode: 'card', // 跳转方式：默认的 card ，在 iOS 上是从右到左跳转，在 Android 上是从下到上，都是使用原生系统的默认跳转方式
  headerMode: 'screen', // 导航条动画效果： float 表示会渐变，类似于 iOS 的原生效果， screen 表示没有渐变， none 表示隐藏导航条
  defaultNavigationOptions: {
    headerShown: false,
    // animationEnabled: false,
    cardStyle: {
      backgroundColor: config.backgroundColor,
    },
  },
};

const StackNavigator = createStackNavigator(
  StackRouteConfigs,
  StackNavigatorConfigs,
);

const TabRouteConfigs = {
  Home: {
    screen: StackNavigator,
    navigationOptions: ({navigation}) => ({
      title: '首页',
      tabBarIcon: ({focused, tintColor}) => (
        <Image
          source={focused ? HomePressedIcon : HomeRenderIcon}
          style={styles.tabIcon}
        />
      ),
    }),
  },
  UserCenter: {
    screen: connectComponent(User),
    navigationOptions: ({navigation}) => ({
      title: '个人中心',
      tabBarIcon: ({focused, tintColor}) => (
        <Image
          source={focused ? UserCenterPressedIcon : UserCenterRenderIcon}
          style={styles.tabIcon}
        />
      ),
    }),
  },
};

const TabNavigatorConfigs = {
  initialRouteName: 'Home',
  tabBarPosition: 'bottom',
  // swipeEnabled: false,
  // animationEnabled: false,
  lazy: true,
  tabBarOptions: {
    activeTintColor: '#2562b4',
    // inactiveTintColor: '#999999',
    showIcon: true, // android 默认不显示 icon ，需要设置为 true 才会显示
    // showLabel: false,
    indicatorStyle: {
      height: 0,
    }, // android 中 TabBar 下面会显示一条线，高度设为 0 后就不显示线了，不知道还有没有其它方法隐藏？？？
    style: {
      backgroundColor: '#FFFFFF',
    },
    labelStyle: {
      fontSize: 11,
    },
  },
};

const TabBarNavigator = createMaterialTopTabNavigator(
  TabRouteConfigs,
  TabNavigatorConfigs,
);

const DrawerRouteConfigs = {
  // 如果 Drawer 中内嵌 Stack ，即比如不是
  // screen: connectComponent(Home) 而是
  // screen: AppStack ，则
  // DrawerRouteConfigs 中的 key 不能与
  // StackRouteConfigs 中的相同，比如 DrawerHome 就与 Home 不相同，否则有时导航会乱掉

  DrawerHome: {
    screen: TabBarNavigator,
    navigationOptions: {
      drawerLabel: config.localeGet(config.locale, 'Home'),
      drawerIcon: ({focused, tintColor}) => (
        <Image
          source={HomePressedIcon}
          style={{width: 25, height: 25, tintColor: tintColor}}
        />
      ),
    },
  },
  DrawerAbout: {
    screen: connectComponent(About),
    navigationOptions: {
      drawerLabel: config.localeGet(config.locale, 'About'),
      drawerIcon: ({tintColor}) => (
        <Image
          source={UserCenterPressedIcon}
          style={{width: 25, height: 25, tintColor: tintColor}}
        />
      ),
    },
  },
};

const drawerWidth = 252; // drawerWidth 要和 ../layouts/Drawer.js 中的 ImageBackground 的 width 相同

const DrawerNavigatorConfigs = {
  drawerWidth,
  drawerBackgroundColor: '#204A87',
  contentComponent: connectComponent(Drawer),
  contentOptions: {
    activeTintColor: '#83B5F7',
    inactiveTintColor: 'white',
    itemStyle: {
      paddingVertical: 5,
      paddingHorizontal: drawerWidth * 0.2,
    },
    labelStyle: {
      marginLeft: 0,
    },
  },
};

const AppNavigator = createAppContainer(
  createDrawerNavigator(DrawerRouteConfigs, DrawerNavigatorConfigs),
);

export {AppNavigator};
