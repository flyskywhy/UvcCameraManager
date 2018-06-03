import React, {
    PureComponent
} from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Nav from '../components/Nav';
import ErrorHandle from '../components/base/ErrorHandle';
import * as LoginPleaseComponent from './LoginPlease';
import * as BindMobile from './BindMobile';
import LoginPleaseMixin from './LoginPleaseMixin';
import connectComponent from '../utils/connectComponent';

const LoginPlease = connectComponent(LoginPleaseComponent);

class User extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            modeDialogVisible: false,
            avatarSource: null,
            originalUrl: null
        };
        this.navs = {
            Center: {
                text: '个人中心'
            }
        };
    }

    componentDidMount() {
        this._getUserInfo();
    }

    _getUserInfo = () => {
        const {
            actions,
            user,
        } = this.props;
        actions.updateClientUserInfo(user);
    }

    toUserSetting = () => this.props.navigation.navigate('UserSetting')

    toConnectDevice = () => this.props.navigation.navigate('ConnectDevice')

    showAlertDialog = () => {
        this.setState({
            modeDialogVisible: true
        });
    }

    dismissAlertDialog = () => {
        this.setState({
            modeDialogVisible: false
        });
    }

    render() {
        const {
            navigation,
            userInfo,
        } = this.props;

        this.navs.Right = {
            image: require('../images/user/gear.png'),
            onPress: () => navigation.navigate('Setting')
        };

        // 如果用户信息获取失败
        if (!userInfo) {
            return (
                <View style={styles.container}>
                    <ErrorHandle onPress={this._getUserInfo}/>
                </View>
            );
        }

        return (
            <View style={styles.viewContainer}>
                <Nav navs={this.navs}/>
                <View style={styles.bgWall}>
                    <TouchableOpacity
                        style={styles.userInfoContainer}
                        onPress={this.toUserSetting}>
                        <Text style={styles.userInfoNameText}>
                            {userInfo.name || userInfo.phone}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.space}/>
                <View style={styles.container}>
                    <TouchableOpacity
                        style={[styles.row]}
                        onPress={this.toConnectDevice}>
                        <View>
                            <Text style={styles.rowText}>
                                设备管理
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    viewContainer: {
        flex: 1
    },
    userInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        flex: 1
    },
    userInfoNameText: {
        fontSize: 14,
        color: 'white'
    },
    orderItem: {
        alignItems: 'center'
    },
    bgWall: {
        backgroundColor: '#2D343B',
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    iconWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    iconTouchable: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20
    },
    loading: {
        flex: 1,
        width: 50
    },
    space: {
        height: 10,
        backgroundColor: '#f1f1f1'
    },
    loadingWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        padding: 15
    },
    rowText: {
        fontSize: 14
    },
    title: {
        fontSize: 16
    },
    titleWrapper: {
        paddingLeft: 10,
        paddingTop: 10,
        paddingBottom: 10
    }
});


export const LayoutComponent = LoginPleaseMixin(User, BindMobile, LoginPlease);
export function mapStateToProps(state, props) {
    return {
        user: state.user,
        userInfo: state.user.publicInfo,
    };
}
