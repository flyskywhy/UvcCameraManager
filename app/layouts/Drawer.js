import React from 'react';
import {ImageBackground, ScrollView, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-navigation';
import {DrawerNavigatorItems} from 'react-navigation-drawer';
import BaseComponent from '../BaseComponent';

class Drawer extends BaseComponent {
  render() {
    const {height} = this.props;

    // 这里 ImageBackground 的 width 要和 ../configs/Router.js 中的 drawerWidth 相同
    return (
      <ImageBackground
        source={require('../images/common/launch_screen.png')}
        style={[styles.container, {height, width: 252}]}
        resizeMode="stretch">
        <View style={styles.viewContainer}>
          <ScrollView>
            <SafeAreaView
              style={styles.container}
              forceInset={{top: 'always', horizontal: 'never'}}>
              <DrawerNavigatorItems {...this.props} />
            </SafeAreaView>
          </ScrollView>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 35,
  },
  viewContainer: {
    alignItems: 'center',
  },
});

export const LayoutComponent = Drawer;
export function mapStateToProps(state) {
  return {
    height: state.utils.height,
    width: state.utils.width,
  };
}
