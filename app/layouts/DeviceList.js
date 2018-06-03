import React, {
    PureComponent
} from 'react';
import {
    View,
    StyleSheet,
    Text,
    InteractionManager
} from 'react-native';
import DeviceRow from './../components/DeviceRow';
import PageList from '../components/PageList';

class DeviceList extends PureComponent {

    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            InteractionManager.runAfterInteractions(() => {
                this.pageList && this.pageList.setData(nextProps.data, {
                    allLoaded: nextProps.data && nextProps.data.length >= nextProps.num
                });
            });
        }
    }

    componentDidMount() {
        this.updateDevices();
    }

    updateDevices = () => {
        const {
            actions
        } = this.props;
        InteractionManager.runAfterInteractions(() => {
            actions.updateDevices();
        });
    }

    _onEndReached = () => {
        const {
            perpage,
            page,
            actions,
        } = this.props;
        actions.getDevices({
            perpage,
            page: page + 1,
            resolved: ( ) => {
            },
            rejected: ( ) => {
                this.pageList && this.pageList.loadedFail();
            }
        });
    }

    toDevice = data => this.props.navigation.navigate('Device', {
        id: data.id,
        data
    })

    _renderRowFooter(item) {
        var renderArr = [];

        if (item) {
            renderArr.push(
                <Text
                    key="statusText"
                    style={styles['rowFooter status']}>
                    {'状态: ' + item.status}
                </Text>
            );
        }
        return renderArr;

    }

    _renderItem = ({item, index}) => {
        return (
            <View style={styles.row}>
                <DeviceRow
                    key={item.id}
                    data={item}
                    onPress={this.toDevice}
                    footer={this._renderRowFooter(item)}/>
            </View>
        );
    }

    refPageList = (view) => {
        this.pageList = view;
    }

    render() {
        const {
            pullRefreshPending
        } = this.props;
        return (
            <PageList
                ref={this.refPageList}
                refreshing={pullRefreshPending}
                renderItem={this._renderItem}
                onEndReached={this._onEndReached}
                onRefresh={this.updateDevices}
            />
        );
    }
}


const styles = StyleSheet.create({
    row: {
        backgroundColor: 'white',
    },
    'rowFooter status': {
        fontSize: 11,
        color: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'flex-end',
        alignSelf: 'flex-end'
    }
});

export const LayoutComponent = DeviceList;
export function mapStateToProps(state, props) {
    return {
        num: state.device.devicesCount,
        data: state.device.ndata,
        pullRefreshPending: state.deviceUI.pullRefreshPending,
        perpage: state.deviceUI.perpage,
        page: state.deviceUI.page
    };
}
