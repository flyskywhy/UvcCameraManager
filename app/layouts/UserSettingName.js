import React, {PureComponent} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  Animated,
} from 'react-native';
import Nav from '../components/Nav';
import * as utils from '../utils';
import ActivityIndicatorModal from '../components/ActivityIndicatorModal';

class UserSettingName extends PureComponent {
  constructor(props) {
    super(props);
    this.name = props.userInfo.name;
    this.state = {
      loadModalVisible: false,
      disabled: true,
    };
    this.navs = {
      Left: {
        onPress: () => props.navigation.goBack(),
      },
      Center: {
        text: '修改姓名',
      },
    };
    this.confirmColor = new Animated.Value(0);
  }

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

  _onConfirm = () => {
    const {actions, navigation, userInfo} = this.props;
    let name = this.name;
    if (!name) {
      actions.toast('名字不能为空');
      return;
    }
    if (name === userInfo.name) {
      actions.toast('名字修改前后相同');
      return;
    }
    this.showLoadingModal();
    actions.changeUserName({
      name: name,
      resolved: (data) => {
        this.dismissLoadingModal();
        actions.updateUserNameLocal(name);
        actions.toast('更换成功');
        navigation.goBack();
      },
      rejected: () => {
        this.dismissLoadingModal();
      },
    });
  };

  onNameChangeText = (text) => {
    this.name = utils.trim(text);
    this.checkCanModify();
  };

  checkCanModify = () => {
    const {disabled} = this.state;
    const {userInfo} = this.props;
    let name = this.name;
    if (name && name !== userInfo.name) {
      if (disabled) {
        this.setState({
          disabled: false,
        });
        Animated.timing(this.confirmColor, {
          toValue: 1,
        }).start();
      }
    } else {
      if (!disabled) {
        this.setState({
          disabled: true,
        });
        Animated.timing(this.confirmColor, {
          toValue: 0,
        }).start();
      }
    }
  };

  render() {
    const {disabled} = this.state;
    const color = this.confirmColor.interpolate({
      inputRange: [0, 1],
      outputRange: ['#999999', '#18BEBC'],
    });
    return (
      <View style={styles.container}>
        <ActivityIndicatorModal
          visible={this.state.loadModalVisible}
          onRequestClose={this.dismissLoadingModal}
        />
        <Nav navs={this.navs} />
        <View style={styles.inputWrapper}>
          <Text style={styles.inputHint}>姓名</Text>
          <TextInput
            style={styles.input}
            defaultValue={this.name}
            underlineColorAndroid={'transparent'}
            placeholderTextColor={'#aaa'}
            placeholder={'在此输入您的名字'}
            onChangeText={this.onNameChangeText}
            maxLength={12}
            autoFocus={Platform.OS === 'web' ? false : true}
            clearButtonMode={'while-editing'}
          />
        </View>
        <View style={styles.wrapper}>
          <TouchableOpacity disabled={disabled} onPress={this._onConfirm}>
            <Animated.View style={[styles.button, {backgroundColor: color}]}>
              <Text style={styles.buttonText}>确认</Text>
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },
  button: {
    backgroundColor: '#18BEBC',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 30,
    paddingRight: 30,
    borderRadius: 30,
    marginTop: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
    height: 40,
    padding: 5,
    justifyContent: 'center',
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  inputWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    marginTop: 10,
  },
  inputHint: {
    marginLeft: 10,
  },
});

export const LayoutComponent = UserSettingName;
export function mapStateToProps(state, props) {
  return {
    userInfo: state.user.publicInfo,
  };
}
