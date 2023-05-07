import React, {PureComponent} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Platform,
} from 'react-native';

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
            <Animated.Text accessibilityLabel={nav.text} style={text}>
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
              key={position}
              onPress={nav.onPress}
              style={[
                styles['textFlex' + position],
                {paddingTop: 0, paddingBottom: 0},
              ]}>
              {navView}
            </TouchableOpacity>
          );
        } else {
          return (
            <View key={position} style={styles['textFlex' + position]}>
              {navView}
            </View>
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
    backgroundColor: '#2D343B',
    borderBottomColor: 'rgba(0,0,0,0.03)',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: Platform.OS === 'ios' ? 64 : 44,
    paddingTop: Platform.OS === 'ios' ? 15 : 0,
  },
  navText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
  },
  textFlexLeft: {
    flex: 3,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingLeft: 15,
  },
  textFlexCenter: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textFlexRight: {
    flex: 3,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingRight: 10,
    marginRight: 5,
  },
});

export default Nav;
