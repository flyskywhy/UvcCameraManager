import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';
import * as utils from '../utils';

const DeviceRow = (props) => {
    const {
        data,
        onPress,
        footer
    } = props;
    return (
        <TouchableOpacity
            onPress={() => {
                onPress && onPress(data);
            }}
            key={data.id}
            style={styles.row}>
            <View>
                <View style={styles.ViewContainer}>
                    <Text
                        numberOfLines={1}
                        style={styles.title}>
                        { data.c_client_config ?
                            utils.subString(data.c_client_config.name, 30, true)
                            : utils.subString(data.product_id, 20, true)
                        }
                    </Text>

                    {data.active.status === 0 ?
                        <View style={styles.ownBg}>
                            <Text style={styles.ownText}>
                                离线
                            </Text>
                        </View> : null
                    }
                    {data.active.status === 1 ?
                        <View style={styles.onLineBg}>
                            <Text style={styles.ownText}>
                                在线
                            </Text>
                        </View> : null
                    }
                </View>
                <Text style={styles['rowFooter id']}>
                    {'id2: ' + data.c_client_attribute.fpga_id}
                </Text>
            </View>
            <View style={styles.dataFooter}>
                {footer}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    ViewContainer: {
        flexDirection: 'row'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: 'rgba(0, 0, 0, 0.02)',
        borderBottomWidth: 1,
        padding: 10,
        height: 60
    },
    title: {
        fontSize: 15
    },
    ownBg: {
        marginLeft: 5,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 3,
        paddingRight: 3,
        borderRadius: 2,
        backgroundColor: 'gray',
    },
    onLineBg: {
        marginLeft: 5,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 3,
        paddingRight: 3,
        borderRadius: 2,
        backgroundColor: 'green',
    },
    ownText: {
        color: 'white',
        fontSize: 12
    },
    dataFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignSelf: 'flex-end',
        flex: 1
    },
    'rowFooter id': {
        fontSize: 11,
        color: 'rgba(0, 0, 0, 0.5)',
        marginTop: 5
    },
});


export default DeviceRow;
