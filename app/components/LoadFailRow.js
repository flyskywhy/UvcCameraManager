import React, {PureComponent} from 'react';
import {View, StyleSheet, Text, TouchableWithoutFeedback} from 'react-native';
import PropTypes from 'prop-types';

class LoadFailRow extends PureComponent {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    color: PropTypes.string,
  };

  static defaultProps = {
    color: 'white',
  };

  render() {
    const {onPress, color} = this.props;
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={styles.loadFail}>
          <Text style={{fontSize: 14, color: color}}>加载失败</Text>
          <Text style={{fontSize: 14, color: color}}>
            尝试点击空白处重新加载
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  loadFail: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadFailRow;
