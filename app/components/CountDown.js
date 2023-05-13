import React, {PureComponent} from 'react';
import {TouchableOpacity, Text, AppState, View} from 'react-native';

import * as utils from '../utils';
import config from '../configs';

class CountDown extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      countdown: -1,
      disabled: false,
    };
    this.backgroundTime = 0;
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    this.interval && clearInterval(this.interval);
  }

  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState === 'active' &&
      nextAppState.match(/inactive|background/)
    ) {
      this.backgroundTime = new Date().getTime() / 1000;
    }
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this.backgroundTime = utils.fomatFloat(
        new Date().getTime() / 1000 - this.backgroundTime,
        0,
      );
    }
    this.setState({
      appState: nextAppState,
    });
  };

  setCountdown(countdown) {
    this.setState({
      countdown: countdown,
    });
  }

  getCountdown() {
    return this.state.countdown;
  }

  startCountDown() {
    this.interval = setInterval(() => {
      if (this.backgroundTime < this.getCountdown()) {
        this.setState(
          {
            countdown: this.getCountdown() - this.backgroundTime - 1,
          },
          () => {
            this.backgroundTime = 0;
            if (this.getCountdown() < 0) {
              this.interval && clearInterval(this.interval);
            }
            if (this.getCountdown() >= 0) {
              this.setButtonClickDisable(true);
            } else {
              this.setButtonClickDisable(false);
            }
          },
        );
      } else {
        this.setCountdown(-1);
        this.setButtonClickDisable(false);
        this.interval && clearInterval(this.interval);
      }
    }, 1000);
    this.setButtonClickDisable(true);
  }

  setButtonClickDisable(enable) {
    this.setState({
      disabled: enable,
    });
  }

  render() {
    const {onPress, style, vcodeTextStyle} = this.props;
    return (
      <View style={style}>
        {this.state.disabled ? (
          <View>
            <Text style={vcodeTextStyle}>
              {`${this.state.countdown}`}
              {config.localeGet(config.locale, 'Second')}
            </Text>
          </View>
        ) : (
          <TouchableOpacity onPress={onPress}>
            <Text style={vcodeTextStyle}>
              {config.localeGet(config.locale, 'GetVerificationCode')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

export default CountDown;
