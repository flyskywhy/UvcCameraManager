import React, {
    PureComponent
} from 'react';
import {
    View,
    Platform,
    TouchableOpacity,
    Text,
    TextInput,
    Dimensions,
    StyleSheet,
} from 'react-native';
import Nav from '../components/Nav';
import * as DeviceListComponent from './DeviceList';
import connectComponent from '../utils/connectComponent';
import * as utils from '../utils';

const DeviceList = connectComponent(DeviceListComponent);
const {
    width
} = Dimensions.get('window');


class ConnectDevice extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            ssid: ''
        };
        this.password = '';
        this.id2 = 'Y00F340077ECC5507';
        this.sign = 'W9zdjDuBpv9Dx0VKpL7/0uT0B7fL/MUW';
        if (Platform.OS !== 'web') {
            this.navs = {
                Left: {
                    onPress: () => props.navigation.goBack()
                },
                Center: {
                    text: '连接设备'
                },
                Right: {
                    image: Platform.OS === 'web' ? '' : require('../images/common/icon_saoyisao.png'),
                    onPress: () => Platform.OS !== 'web' && props.navigation.navigate('QRCodes', {isConnectDevice: true})
                }
            };
        } else {
            this.navs = {
                Left: {
                    onPress: () => props.navigation.goBack()
                },
                Center: {
                    text: '连接设备'
                }
            };
        }
    }

    componentDidMount() {
        this.getSsid();
    }

    getSsid = () => {

    }

    onSsidChangeText = (text) => {
        this.setState({
            ssid: utils.trim(text)
        });
    }

    onPwdChangeText = (text) => {
        this.password = text;
    }

    _renderSsid() {
        return (
            <View style={styles.inputWrapper}>
                <View style={styles.inputRow}>
                    <Text style={styles.inputHint}>
                        输入 ssid:
                    </Text>
                    <TextInput
                        ref={view => {this.textInput = view;}}
                        style={styles.inputInput}
                        placeholder={'在此输入ssid'}
                        defaultValue={this.state.ssid}
                        onChangeText={this.onSsidChangeText}
                    />
                </View>
                <View style={styles.inputRow}>
                    <Text style={styles.inputHint}>
                        输入 passwd:
                    </Text>
                    <TextInput
                        ref={view => {this.textInput = view;}}
                        secureTextEntry = {true}
                        style={styles.inputInput}
                        placeholder={'在此输入密码'}
                        defaultValue={this.password}
                        onChangeText={this.onPwdChangeText}
                    />
                </View>
            </View>
        );
    }

    _renderId2() {
        return (
            <View style={styles.inputWrapper}>
                <View style={styles.inputRow}>
                    <Text style={styles.inputHint}>
                        输入 id2:
                    </Text>
                    <TextInput
                        ref={view => {this.textInput = view;}}
                        style={styles.inputInput}
                        placeholder={this.id2}
                        onChangeText={(text) => {
                            this.id2 = text;
                        }}
                    />
                </View>
                <View style={styles.inputRow}>
                    <Text style={styles.inputHint}>
                        输入 sign:
                    </Text>
                    <TextInput
                        ref={view => {this.textInput = view;}}
                        style={styles.inputInput}
                        placeholder={this.sign}
                        onChangeText={(text) => {
                            this.sign = text;
                        }}
                    />
                </View>
                <View style={styles.row}>
                    <TouchableOpacity
                        style={styles.registerButton}
                        onPress={this._onWifiBroadcast.bind(this)}>
                        <Text style={styles.buttonText}>
                            连接设备
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    _onWifiBroadcast() {
        const {
            actions
        } = this.props;

        actions.registerDev(this.id2, this.sign, '', () => {
            actions.updateDevices();
            actions.toast('注册成功');
        });
    }

    distribution() {

    }

    registerDev(id2, sign) {
        const {
            actions
        } = this.props;
        if (id2) {
            actions.toast('连接设备成功');
            actions.registerDev(id2, sign, '', () => {
                actions.updateDevices();
                actions.toast('注册成功');
            });
        } else {
            actions.toast('连接设备失败，请重试');
        }
    }

    render() {
        const {
            navigation
        } = this.props;
        return (
            <View style={styles.container}>
                <Nav navs={this.navs}/>

                {Platform.OS === 'web' && this._renderId2()}
                <DeviceList navigation={navigation}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#2D343B',
        flex: 1
    },
    row: {
        flexDirection: 'row'
    },
    registerButton: {
        flex: 1
    },
    buttonText: {
        fontSize: 17,
        color: '#FFFFFF',
        textAlign: 'center',
        margin: 10,
        padding: 5,
        backgroundColor: '#16AFAD'
    },
    inputWrapper: {
        backgroundColor: 'white',
        alignItems: 'flex-end',
        justifyContent: 'space-around'
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    inputHint: {
        paddingRight: 10
    },
    inputInput: {
        width: width - 100
    }
});


export const LayoutComponent = ConnectDevice;
export function mapStateToProps(state) {
    return {
        devices: state.device.ndata,
    };
}