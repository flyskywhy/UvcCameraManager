import React, {PureComponent} from 'react';
import {View, StyleSheet, ActivityIndicator, Modal, Text} from 'react-native';

import PropTypes from 'prop-types';

const noop = () => {};

class ActivityIndicatorModal extends PureComponent {
  static propTypes = {
    ...Modal.propTypes,
    ...ActivityIndicator.propTypes,
    text: PropTypes.string,
  };

  static defaultProps = {
    animationType: 'none',
    transparent: true,
    visible: false,
    animating: true,
    size: 'large',
    color: 'white',
    onShow: noop,
    onRequestClose: noop,
    text: '',
  };

  render() {
    const {
      animationType,
      transparent,
      visible,
      animating,
      size,
      color,
      onShow,
      onRequestClose,
      text,
      textStyle,
    } = this.props;
    return (
      <Modal
        animationType={animationType}
        transparent={transparent}
        visible={visible}
        onShow={onShow}
        onRequestClose={onRequestClose}>
        <View style={styles.activityIndicatorModal}>
          <View
            style={[styles.loadingContainer, {paddingBottom: text ? 15 : 30}]}>
            <ActivityIndicator
              animating={animating}
              size={size}
              color={color}
            />
            {text ? <Text style={[styles.text, textStyle]}>{text}</Text> : null}
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  activityIndicatorModal: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  loadingContainer: {
    padding: 30,
    paddingBottom: 15,
    backgroundColor: '#000',
    borderRadius: 5,
    opacity: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
    marginTop: 20,
  },
});

export default ActivityIndicatorModal;
