import React, {Component} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import PropTypes from 'prop-types';
import config from '../../configs';

class ErrorHandle extends Component {
  static propTypes = {
    infoText: PropTypes.string,
    onPress: PropTypes.func,
    buttonText: PropTypes.string,
  };

  static defaultProps = {
    infoText: config.localeGet(config.locale, 'NetworkError'),
    buttonText: config.localeGet(config.locale, 'Recapture'),
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.infoText}>{this.props.infoText}</Text>
        <TouchableOpacity onPress={this.props.onPress}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>{this.props.buttonText}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 130,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  button: {
    width: 150,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#E74C3C',
  },
  infoText: {
    fontSize: 20,
  },
  buttonText: {
    color: 'white',
  },
});

export default ErrorHandle;
