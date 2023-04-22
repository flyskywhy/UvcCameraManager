import React, {PureComponent} from 'react';
import {
  Alert,
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Nav from '../components/Nav';
import ActivityIndicatorModal from '../components/ActivityIndicatorModal';

const {width} = Dimensions.get('window');

class Device extends PureComponent {
  constructor(props) {
    super(props);
    this.checkedLabel = [];
    this.state = {
      name: props.navigation.state.params.data.c_client_config
        ? props.navigation.state.params.data.c_client_config.name
        : '',
      loadModalVisible: false,
    };

    this.navs = {
      Left: {
        onPress: () => props.navigation.goBack(),
      },
      Center: {
        text: '配置设备',
      },
      // Right: {
      //     text: '转让',
      //     onPress: this.toModifyDeviceOwner
      // }
    };
  }

  _onDelete = () => {
    const {actions, id, navigation} = this.props;
    Alert.alert('提示', '确认删除该设备吗', [
      {
        text: '取消',
        onPress: () => {},
      },
      {
        text: '确认',
        onPress: () => {
          this.showLoadingModal();
          actions.unregisterDev({
            id,
            resolved: (responseText) => {
              this.dismissLoadingModal();
              actions.updateDevices();
              actions.toast('删除设备成功!');
              navigation.goBack();
            },
            rejected: () => {
              this.dismissLoadingModal();
            },
          });
        },
      },
    ]);
  };

  _onConfigPress = () => {
    const {id, navigation, actions} = this.props;
    if (!this.state.name) {
      actions.toast('名称不能为空');
      return;
    }
    this.showLoadingModal();
    actions.configDev(
      id,
      this.state,
      this.checkedLabel,
      (device) => {
        this.dismissLoadingModal();
        actions.updateDevices();
        actions.toast('配置成功');
        navigation.goBack();
      },
      () => {
        this.dismissLoadingModal();
      },
    );
  };

  showLoadingModal = () => {
    this.setState({
      loadModalVisible: true,
    });
  };

  dismissLoadingModal = () => {
    this.setState({
      loadModalVisible: false,
    });
  };

  toModifyDeviceOwner = () => {
    const {navigation, id} = this.props;
    navigation.navigate('ModifyDeviceOwner', {
      deviceId: id,
      data: navigation.state.params.data,
    });
  };

  setName = (text) => {
    this.setState({name: text});
  };

  render() {
    const {loadModalVisible, name} = this.state;

    return (
      <View style={styles.flexContainer}>
        <Nav navs={this.navs} />
        <ActivityIndicatorModal
          visible={loadModalVisible}
          onRequestClose={this.dismissLoadingModal}
        />

        <View style={styles.buttonRow}>
          <View style={styles.button}>
            <TouchableOpacity
              style={styles.deleteDeviceButton}
              onPress={this._onDelete}>
              <Text style={styles.deleteDeviceText}>删除设备</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            value={name}
            onChangeText={this.setName}
            underlineColorAndroid={'transparent'}
          />
          <View style={styles.button}>
            <TouchableOpacity
              style={styles.buttonTouch}
              onPress={this._onConfigPress}>
              <Text style={styles.buttonText}>保存</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  flexContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollableTab: {
    backgroundColor: 'white',
    height: 200,
  },
  itemContainer: {
    height: 80,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  buttonTouch: {
    backgroundColor: 'rgba(24,190,188,1.0)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  inputView: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  inputWrapper: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10,
  },
  inputHint: {
    marginRight: 10,
  },
  inputInput: {
    padding: 8,
    width: width - 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginRight: 10,
    height: 35,
  },
  deleteDeviceButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 20,
    backgroundColor: 'white',
    borderColor: 'rgba(24,190,188,1.0)',
    borderWidth: 1,
  },
  deleteDeviceText: {
    fontSize: 16,
    color: 'rgba(24,190,188,1.0)',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    padding: 8,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 10,
  },
});

export const LayoutComponent = Device;
export function mapStateToProps(state, props) {
  return {};
}
