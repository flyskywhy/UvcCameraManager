import React, {PureComponent} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Platform,
} from 'react-native';
import * as utils from '../utils';

class Nav extends PureComponent {
  _renderNavContent() {
    let navs = this.props.navs || {};

    return ['Left', 'Center', 'Right'].map((position) => {
      let nav = navs[position];
      if (nav) {
        const text = {
          color: nav.color ? nav.color : 'white',
          fontSize: nav.fontSize
            ? nav.fontSize
            : position === 'Center'
            ? 18
            : 16,
          alignItems: 'center',
        };
        let navView = null;
        if (nav.text || nav.text === '') {
          navView = (
            <Animated.Text
              accessibilityLabel={nav.text}
              style={text}
              numberOfLines={1}>
              {nav.text}
            </Animated.Text>
          );
        } else {
          navView = (
            <Image
              source={nav.image || require('../images/common/btn_fanhui.png')}
              style={styles.image}
            />
          );
        }
        if (nav.onPress) {
          return (
            <TouchableOpacity
              accessibilityLabel={
                '标题栏' + (position === 'Left' ? '左' : '右') + '按钮'
              }
              key={position}
              onPress={nav.onPress}
              style={styles['textFlex' + position]}>
              {navView}
            </TouchableOpacity>
          );
        } else {
          return (
            <TouchableOpacity
              key={position}
              style={styles['textFlex' + position]}>
              {navView}
            </TouchableOpacity>
          );
        }
      } else {
        return <View key={position} style={styles['textFlex' + position]} />;
      }
    });
  }

  render() {
    return <View style={styles.nav}>{this._renderNavContent()}</View>;
  }
}

const styles = StyleSheet.create({
  image: {
    width: 20,
    height: 20,
  },
  nav: {
    backgroundColor: 'rgba(256,256,256,0.05)',
    borderBottomColor: 'rgba(45,52,59,0.03)',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height:
      utils.isIphoneX() || utils.isIphoneXR()
        ? 88
        : Platform.OS === 'ios'
        ? 64
        : 44,
    paddingTop:
      utils.isIphoneX() || utils.isIphoneXR()
        ? 44
        : Platform.OS === 'ios'
        ? 20
        : 0,
  },
  navText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
  },
  textFlexLeft: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 15,
    height:
      utils.isIphoneX() || utils.isIphoneXR()
        ? 44
        : Platform.OS === 'ios'
        ? 64
        : 44,
  },
  textFlexCenter: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
    height:
      utils.isIphoneX() || utils.isIphoneXR()
        ? 44
        : Platform.OS === 'ios'
        ? 64
        : 44,
  },
  textFlexRight: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 10,
    marginRight: 5,
    height:
      utils.isIphoneX() || utils.isIphoneXR()
        ? 44
        : Platform.OS === 'ios'
        ? 64
        : 44,
  },
});

export default Nav;
