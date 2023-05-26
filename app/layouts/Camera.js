import React, {PureComponent} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

if (Platform.OS !== 'web') {
  var {RNCamera} = require('react-native-camera');
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
        width: 480,
        quality: 0.5,
      };
      const data = await this.camera.takePictureAsync(options);
      console.warn(data.uri);
      CameraRoll.save(data.uri);
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
            <RNCamera
              ref={this.refCamera}
              style={styles.camera}
              type={RNCamera.Constants.Type.back}
              flashMode={RNCamera.Constants.FlashMode.off}
              androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}
              androidRecordAudioPermissionOptions={{
                title: 'Permission to use audio recording',
                message: 'We need your permission to use your audio',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}
              // onGoogleVisionBarcodesDetected={({ barcodes }) => {
              //   console.log(barcodes);
              // }}
            />
          )}
          <TouchableOpacity
            style={styles.captureButton}
            onPress={this.takePicture}
          >
            <Text style={styles.captureText}> Take a picture </Text>
          </TouchableOpacity>
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
  captureButton: {
    backgroundColor: 'green',
  },
  captureText: {
    color: 'white',
    fontSize: 30,
  },
});

export const LayoutComponent = Camera;
export function mapStateToProps(state) {
  return {
    width: state.utils.width,
  };
}
