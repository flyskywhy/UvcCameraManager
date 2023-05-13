import React, {Component} from 'react';
import {Platform, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Provider} from 'react-redux';
import configureStore from './store/configureStore';
import Navigation from './layouts/Navigation';
import config from './configs';
import UAParser from 'ua-parser-js';

const store = configureStore();
if (Platform.OS === 'web') {
  config.agentOS = new UAParser().getOS().name;
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prepared: false,
    };
    AsyncStorage.getItem('localPersistence')
      .then(
        (value) => {
          config.domain = JSON.parse(value).serverAddr;
          this.setState({
            prepared: true,
          });
        },
        () => {
          this.setState({
            prepared: true,
          });
        },
      )
      .catch(() => {
        this.setState({
          prepared: true,
        });
      });
  }

  render() {
    return this.state.prepared ? (
      <Provider store={store}>
        <Navigation />
      </Provider>
    ) : (
      <View />
    );
  }
}

export default App;
