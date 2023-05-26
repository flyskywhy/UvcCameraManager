import React, {PureComponent} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

if (Platform.OS !== 'web') {
  var {UvcCamera} = require('react-native-uvc-camera');
  var {CameraRoll} = require('@react-native-camera-roll/camera-roll');
  var ImagePicker = require('react-native-image-crop-picker');
}

import Nav from '../components/Nav';

class Camera extends PureComponent {
  constructor(props) {
    super(props);
    this.navs = {
      Left: {
        image: require('../images/common/drawer.png'),
        onPress: props.navigation.toggleDrawer,
      },
      Center: {
        text: 'UVC Camera',
      },
      Right: {
        text: 'all',
        onPress: this.pickPicture,
      },
    };
    this.state = {
      isRecording: false,
    };
  }

  pickPicture = () => {
    if (Platform.OS !== 'web') {
      ImagePicker.openPicker({
        cropping: true,
      }).then(
        image => {
          console.warn(image);
        },
        error => {
          console.log(error.message);
        },
      );
    }
  };

  takePicture = async () => {
    if (this.camera) {
      const options = {
        width: 288, // this width can be debugged from getNearestSize() of react-native-uvc-camera/libuvccamera/src/main/java/com/serenegiant/usb/UVCCamera.java
        quality: 1,
      };
      const data = await this.camera.takePictureAsync(options);
      console.warn(data.uri);
      CameraRoll.save(data.uri);
    }
  };

  record = async () => {
    if (this.camera) {
      if (this.state.isRecording) {
        this.camera.stopRecording();
      } else {
        this.setState({
          isRecording: true,
        });
        const data = await this.camera.recordAsync();
        this.setState({
          isRecording: false,
        });
        console.warn(data.uri);
      }
    }
  };

  refCamera = view => {
    this.camera = view;
  };

  render() {
    return (
      <View style={styles.container}>
        <Nav navs={this.navs} />
        <View style={styles.container}>
          {Platform.OS === 'web' ? (
            <View style={styles.camera} />
          ) : (
            <UvcCamera
              ref={this.refCamera}
              style={styles.camera}
              rotation={270}
              type={UvcCamera.Constants.Type.back}
              permissionDialogTitle={'Permission to use camera'}
              permissionDialogMessage={
                'We need your permission to use your camera phone'
              }
            />
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: 'green'}]}
              onPress={this.takePicture}
            >
              <Text style={styles.buttonText}> Take a picture </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                {backgroundColor: this.state.isRecording ? 'red' : 'blue'},
              ]}
              onPress={this.record}
            >
              <Text style={styles.buttonText}>
                {' '}
                {this.state.isRecording ? 'Recording' : 'Record stopped'}{' '}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttonContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 23,
  },
});

export const LayoutComponent = Camera;
export function mapStateToProps(state) {
  return {
    width: state.utils.width,
  };
}
