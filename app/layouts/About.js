import React, {
    PureComponent
} from 'react';
import {
    View,
    Text,
    StyleSheet,
    InteractionManager
} from 'react-native';
import Nav from '../components/Nav';
import config from '../configs';

class About extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            backendVer: ''
        };
        this.navs = {
            Left: {
                onPress: () => props.navigation.goBack()
            },
            Center: {
                text: '关于'
            }
        };
        this.tapCount = 0;
    }


    componentDidMount() {
        this.getBackendVersion();
    }

    getBackendVersion = () => {
        const {
            actions
        } = this.props;
        InteractionManager.runAfterInteractions(() => {
            actions.getBackendVersion({
                resolved: res => {
                    this.setState({
                        backendVer: res.longRevision
                    });
                },
                rejected: () => {

                }
            });
        });
    }

    tap = () => {
        const {
            actions
        } = this.props;
        this.tapCount ++;
        if (this.tapCount === 7) {
            actions.saveServerAddressChangeable(true);
            actions.toast('首页已可更改服务器登录地址');
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View>
                    <Nav navs={this.navs}/>
                    <View style={styles.content}>
                        <Text style={styles.title}>
                            ReactWebNative8Koa
                            <Text
                                onPress={this.tap}
                                style={styles.versionText}>
                                {' v' + config.package.version}
                            </Text>
                        </Text>
                        <Text style={styles.title}>
                            sha
                            <Text style={styles.gitShaText}>
                                {config.package.gitSha}
                            </Text>
                        </Text>
                        <Text style={styles.subTitle}>
                            ReactWebNative8Koa
                        </Text>
                        <Text style={styles.subTitle}>
                            {this.state.backendVer}
                        </Text>
                        <Text style={styles.subTitle}>
                            {config.domain}
                        </Text>
                    </View>
                </View>
                <View style={styles.footer}>
                    <Text style={styles.reactNative}>
                        Power By React-Native
                    </Text>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#2D343B',
        flex: 1,
        justifyContent: 'space-between',
    },
    content: {
        alignItems: 'center'
    },
    logo: {
        height: 80,
        width: 80,
    },
    title: {
        marginTop: 20,
        fontSize: 30,
        color: 'rgba(255,255,255,0.7)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',

    },
    subTitle: {
        marginTop: 10,
        fontSize: 16,
        color: 'rgba(255,255,255,0.5)'
    },
    footer: {
        alignItems: 'center',
        paddingBottom: 40
    },
    reactNative: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.3)'
    },
    versionText: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.6)'
    },
    gitShaText: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.6)'
    }
});


export const LayoutComponent = About;
export function mapStateToProps(state) {
    return {};
}
