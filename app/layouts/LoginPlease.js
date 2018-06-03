import React, {
    PureComponent
} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import config from '../configs';
import * as utils from '../utils';

class LoginPlease extends PureComponent {

    constructor(props) {
        super(props);
        this.inputAddr = props.addr;
        this.state = {
            addr: props.addr
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.addr !== this.props.addr) {
            this.inputAddr = nextProps.addr;
            this.setState({addr: nextProps.addr});
        }
    }


    _onSave() {
        const {
            actions
        } = this.props;
        this.setState({addr: this.inputAddr});
        actions.saveServerAddress(this.inputAddr);
        actions.toast('保存服务器地址成功');
    }

    onServrtTextChange = (text) => {
        this.inputAddr = utils.trim(text);
    }

    toLoginPage = () => {
        this.inputAddr !== this.state.addr && this._onSave();
        this.props.navigation.navigate('LoginPage');
    }

    onInputAddrChangeText = (text) => {
        this.inputAddr = text;
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.versionText}>
                    UvcCameraManager v{config.package.version}
                </Text>
                {Platform.OS !== 'web' && (__DEV__ || this.props.addrChangeable) && (
                    <View>
                        <TextInput
                            style={styles.inputInput}
                            defaultValue={this.state.addr}
                            onChangeText={this.onInputAddrChangeText}
                            underlineColorAndroid={'#666666'}
                        />
                        <View style={styles.button}>
                            <TouchableOpacity
                                style={styles.buttonTouch}
                                onPress={this._onSave.bind(this)}>
                                <Text style={styles.buttonText}>
                                    保存服务器地址
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                <View style={styles.button}>
                    <TouchableOpacity
                        accessibilityLabel="请先登录"
                        style={styles.buttonTouch}
                        onPress={this.toLoginPage}>
                        <Text style={styles.buttonText}>
                            请先登录
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    inputInput: {
        height: 40,
    },
    button: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10
    },
    buttonTouch: {
        backgroundColor: 'rgba(24,190,188,1.0)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 20
    },
    buttonText: {
        color: 'white',
        fontSize: 16
    },
    versionText: {
        fontSize: 30
    }
});


export const LayoutComponent = LoginPlease;
export function mapStateToProps(state, props) {
    return {
        addrChangeable: state.localPersistence.serverAddrChangeable,
        addr: state.localPersistence.serverAddr
    };
}
