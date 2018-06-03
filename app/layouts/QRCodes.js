import React, {
    PureComponent
} from 'react';
import {
    Image,
    StyleSheet,
    View,
    Text,
    Platform,
    TouchableOpacity,
    Alert
} from 'react-native';

import * as utils from '../utils';
if (Platform.OS !== 'web') {
    var Permissions = require('react-native-permissions').default;
    var Barcode = require('react-native-smart-barcode').default;
}

class QRCodes extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            viewAppear: false,
        };
        this.getData = true;
    }

    componentDidMount() {
        this.requestCameraPermission();
        this.timer = setTimeout(() => {
            this.setState({
                viewAppear: true,
            });
        }, 255);
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    _startScan = (e) => {
        this._barCode.startScan();
    }

    _stopScan = (e) => {
        this._barCode.stopScan();
    }

    requestCameraPermission = () => {
        const {
            navigation,
        } = this.props;
        Permissions.request('camera')
            .then(response => {
                if (response !== 'authorized') {
                    Alert.alert(
                        '提示',
                        '无法获得摄像头数据，请检查是否已经打开摄像头权限', [{
                            text: '确定',
                            onPress: () => navigation.goBack()
                        }, ], {
                            cancelable: false
                        }
                    );
                }
            });
    }

    _onBarCodeRead = (e) => {
        const {
            actions,
            navigation,
        } = this.props;
        this._stopScan();
        if (!this.getData) {
            return;
        }
        if (navigation.state.params.isRegister) {
            navigation.state.params.callback && navigation.state.params.callback(e.nativeEvent.data.code);
            navigation.goBack();
            return;
        }
        let data = e.nativeEvent.data.code;
        if (utils.isJson(data)) {
            data = JSON.parse(data);
        } else {
        }
        let id2 = '';
        let key = '';
        if (data.id2 && data.key) {
            id2 = data.id2;
            key = data.key;
        } else {
            let request = this.getRequest(data);
            id2 = request.id2;
            key = request.key;
        }
        if (!(id2 && key)) {
            actions.toast('该二维码不可用');
            this._startScan();
            return;
        }
        if (navigation.state.params.isConnectDevice && id2 && key) {
            this.registerDev(id2, key);
        }

        this.getData = false;
    }

    getRequest(data, name) {
        let url = data + '';
        let theRequest = {};
        let index = url.indexOf('?');
        if (index !== -1) {
            let str = url.substr(index + 1, url.length - index - 1);
            let strs = str.split('&');
            for (let i = 0; i < strs.length; i++ ) {
                theRequest[strs[i].split('=')[0]] = unescape(strs[i].substr(strs[i].indexOf('=') + 1, strs[i].length - strs[i].indexOf('=') - 1));
            }
        }
        return theRequest;
    }

    registerDev = (id2, key) => {
        const {
            actions,
            navigation,
        } = this.props;
        actions.registerDev(id2, '', key, (device) => {
            actions.updateDevices();
            actions.toast('注册成功');
            this._startScan();
            navigation.goBack();
        }, () => {
            this._startScan();
            navigation.goBack();
        });
    }

    _onClosePress = () => this.props.navigation.goBack()

    _renderTitleBar = () => {
        return (
            <TouchableOpacity style={styles.back} onPress={this._onClosePress}>
                <Image
                    source={require('../images/common/btn_fanhui.png')}
                />
            </TouchableOpacity>
        );
    }

    refBarcode = (view) => {
        this._barCode = view;
    }

    render() {
        const {
            viewAppear
        } = this.state;
        if (Platform.OS === 'web') {
            return (
                <View style={styles.camera}>
                    <Text style={styles.infoText}>
                        只有原生 APP 才支持二维码
                    </Text>
                </View>
            );
        }
        return (
            <View style={styles.container}>
                {viewAppear ? <Barcode
                    style={{flex: 1}}
                    ref={this.refBarcode}
                    onBarCodeRead={this._onBarCodeRead}/>
                    : null}
                {this._renderTitleBar()}
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    back: {
        left: 10,
        top: 20,
        position: 'absolute',
        padding: 20,
        height: 40,
        width: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(00,00,00,0.8)',
    },
});

export const LayoutComponent = QRCodes;
export function mapStateToProps(state, props) {
    return {
    };
}
