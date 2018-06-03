import React, {
    PureComponent
} from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert
} from 'react-native';
import Nav from '../components/Nav';

class Setting extends PureComponent {
    constructor(props) {
        super(props);
        this.navs = {
            Left: {
                onPress: () => {
                    props.navigation.goBack();
                }
            },
            Center: {
                text: '设置'
            }
        };
    }

    onAboutPress = () => {
        this.props.navigation.navigate('About');
    }


    onLogoutPress = () => {
        const {
            actions,
            navigation,
            routes,
        } = this.props;
        Alert.alert(
            '提示',
            '确定退出登录', [{
                text: '取消',
                onPress: () => {}
            }, {
                text: '确认',
                onPress: () => {
                    actions.logout();
                    actions.logoutBackend({});
                    actions.clear();
                    navigation.goBack(routes[1] && routes[1].key);
                }
            }]
        );
    }


    onClearPress = () => {
        const {
            actions
        } = this.props;
        actions.clearCache();
        actions.toast('缓存清除成功');
    }

    isWeixin = () => {
        if (typeof WeixinJSBridge === 'undefined') {
            return false;
        } else {
            return true;
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View>
                    <Nav navs={this.navs}/>

                    <TouchableOpacity
                        style={styles.row}
                        onPress={this.onClearPress}>
                        <Text style={styles.rowText}>
                            清除缓存
                        </Text>
                        <Image
                            source={require('../images/common/icon_tiaozhuan.png')}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.row}
                        onPress={this.onAboutPress}>
                        <Text style={styles.rowText}>
                            关于
                        </Text>
                        <Image
                            source={require('../images/common/icon_tiaozhuan.png')}
                        />
                    </TouchableOpacity>
                </View>
                {this.isWeixin() ?
                <View/>
                :
                <TouchableOpacity
                    style={styles.button}
                    onPress={this.onLogoutPress}>
                    <Text style={styles.buttonText}>
                        退出登录
                    </Text>
                </TouchableOpacity>
                }
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: 'white'
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: 'rgba(24,190,188,1.0)',
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 20,
        marginBottom: 40
    },
    buttonText: {
        color: 'white',
        fontSize: 16
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
    }
});


export const LayoutComponent = Setting;
export function mapStateToProps(state, props) {
    return {
        routes: state.nav.routes,
    };
}
