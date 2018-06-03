import React, {
    PureComponent
} from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Nav from '../components/Nav';
import ActivityIndicatorModal from '../components/ActivityIndicatorModal';

class UserSetting extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            loadModalVisible: false
        };
        this.navs = {
            Left: {
                onPress: () => props.navigation.goBack()
            },
            Center: {
                text: '用户设置'
            }
        };
    }

    showLoadingModal = () => {
        this.setState({
            loadModalVisible: true
        });
    }

    dismissLoadingModal = () => {
        this.setState({
            loadModalVisible: false
        });
    }

    toUserSettingPasswd = () => this.props.navigation.navigate('UserSettingPasswd')

    toUserSettingName = () => this.props.navigation.navigate('UserSettingName')

    toUserSettingAddr = () => this.props.navigation.navigate('UserSettingAddr')

    toUserSettingEmail = () => this.props.navigation.navigate('UserSettingEmail')

    render() {
        const {
            loadModalVisible
        } = this.state;
        return (
            <View style={styles.container}>
                <Nav navs={this.navs}/>
                <ActivityIndicatorModal
                    visible={loadModalVisible}
                    onRequestClose={this.dismissLoadingModal}
                />
                <TouchableOpacity
                    style={styles.row}
                    onPress={this.toUserSettingName}>
                    <Text style={styles.rowText}>
                        修改姓名
                    </Text>
                    <Image
                        source={require('../images/common/icon_tiaozhuan.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.row}
                    onPress={this.toUserSettingPasswd}>
                    <Text style={styles.rowText}>
                        修改登录密码
                    </Text>
                    <Image
                        source={require('../images/common/icon_tiaozhuan.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.row}
                    onPress={this.toUserSettingAddr}>
                    <Text style={styles.rowText}>
                        所在城市
                    </Text>
                    <Image
                        source={require('../images/common/icon_tiaozhuan.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.row}
                    onPress={this.toUserSettingEmail}>
                    <Text style={styles.rowText}>
                        邮箱
                    </Text>
                    <Image
                        source={require('../images/common/icon_tiaozhuan.png')}
                    />
                </TouchableOpacity>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F1F1'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        padding: 13,
        paddingLeft: 10,
        paddingRight: 10
    },
    rowText: {
        fontSize: 14
    },
});


export const LayoutComponent = UserSetting;
export function mapStateToProps(state, props) {
    return {};
}
