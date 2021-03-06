import React from 'react';
import {
    Image,
    StyleSheet
} from 'react-native';

import {
    TabNavigator,
    StackNavigator,
    TabBarBottom,
} from 'react-navigation/src/react-navigation.js';

import HomeRenderIcon from '../images/pic/btn-homepage2.png';
import HomePressedIcon from '../images/pic/btn-homepage.png';
import UserCenterRenderIcon from '../images/common/tab_gerenzhongxini_n.png';
import UserCenterPressedIcon from '../images/common/tab_gerenzhongxini_h.png';

// 请按字母排序以方便人工检索
import * as About from '../layouts/About';
import * as Camera from '../layouts/Camera';
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
        // height: 23,
        // width: 23,
        resizeMode: 'cover'
    }
});

const TabRouteConfigs = {
    Home: {
        screen: connectComponent(Camera),
        navigationOptions: ({
            navigation
        }) => ({
            title: '首页',
            tabBarIcon: ({
                focused,
                tintColor
            }) => (
                <Image
                    source={focused ? HomePressedIcon : HomeRenderIcon}
                    style={styles.tabIcon}
                />
            ),
        }),
    },
    UserCenter: {
        screen: connectComponent(User),
        navigationOptions: ({
            navigation
        }) => ({
            title: '个人中心',
            tabBarIcon: ({
                focused,
                tintColor
            }) => (
                <Image
                    source={focused ? UserCenterPressedIcon : UserCenterRenderIcon}
                    style={styles.tabIcon}
                />
            ),
        }),
    }
};

const TabNavigatorConfigs = {
    initialRouteName: 'Home',
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    lazy: true,
    tabBarOptions: {
        activeTintColor: '#2562b4',
        // inactiveTintColor: '#999999',
        showIcon: true,                 // android 默认不显示 icon ，需要设置为 true 才会显示
        indicatorStyle: {
            height: 0
        },                              // android 中 TabBar 下面会显示一条线，高度设为 0 后就不显示线了，不知道还有没有其它方法隐藏？？？
        style: {
            backgroundColor: '#FFFFFF',
        },
        labelStyle: {
            fontSize: 11,
        },
    },
};

const TabBarNavigator = TabNavigator(TabRouteConfigs, TabNavigatorConfigs);

// 请按字母排序以方便人工检索
const StackRouteConfigs = {
    About: {
        screen: connectComponent(About),
        navigationOptions: {
            header: null
        }
    },
    Camera: {
        screen: connectComponent(Camera),
        navigationOptions: {
            header: null
        }
    },
    Login: {
        screen: connectComponent(Login),
        navigationOptions: {
            header: null
        }
    },
    LoginCode: {
        screen: connectComponent(LoginCode),
        navigationOptions: {
            header: null
        }
    },
    LoginPage: {
        screen: connectComponent(LoginPage),
        navigationOptions: {
            header: null
        }
    },
    LoginResetPasswd: {
        screen: connectComponent(LoginResetPasswd),
        navigationOptions: {
            header: null
        }
    },
    Main: {
        screen: TabBarNavigator,
        navigationOptions: {
            header: null
        }
    },
    QRCodes: {
        screen: connectComponent(QRCodes),
        navigationOptions: {
            header: null
        }
    },
    Register: {
        screen: connectComponent(Register),
        navigationOptions: {
            header: null
        }
    },
    Setting: {
        screen: connectComponent(Setting),
        navigationOptions: {
            header: null
        }
    },
    UserSetting: {
        screen: connectComponent(UserSetting),
        navigationOptions: {
            header: null
        }
    },
    UserSettingAddr: {
        screen: connectComponent(UserSettingAddr),
        navigationOptions: {
            header: null
        }
    },
    UserSettingEmail: {
        screen: connectComponent(UserSettingEmail),
        navigationOptions: {
            header: null
        }
    },
    UserSettingName: {
        screen: connectComponent(UserSettingName),
        navigationOptions: {
            header: null
        }
    },
    UserSettingPasswd: {
        screen: connectComponent(UserSettingPasswd),
        navigationOptions: {
            header: null
        }
    },
    WebViewLayout: {
        screen: connectComponent(WebViewLayout),
        navigationOptions: {
            header: null
        }
    },
};

const StackNavigatorConfigs = {
    initialRouteName: 'Main',   // 初始化哪个界面为根界面
    mode: 'card',               // 跳转方式：默认的 card ，在 iOS 上是从右到左跳转，在 Android 上是从下到上，都是使用原生系统的默认跳转方式
    headerMode: 'screen',       // 导航条动画效果： float 表示会渐变，类似于 iOS 的原生效果， screen 表示没有渐变， none 表示隐藏导航条
};

const AppNavigator = StackNavigator(StackRouteConfigs, StackNavigatorConfigs);

export {
    AppNavigator
};
