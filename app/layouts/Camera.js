import React, {
    PureComponent
} from 'react';
import {
    CameraRoll,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

if (Platform.OS !== 'web') {
    var {
        UvcCamera,
    } = require('react-native-uvc-camera');
}

import ImagePicker from 'react-native-image-crop-picker';
import Nav from '../components/Nav';

class Camera extends PureComponent {
    constructor(props) {
        super(props);
        this.navs = {
            Left: {
                text: 'recent',
                // onPress: () => props.navigation.navigate('recentCaptured')
                onPress: () => props.actions.toast('TODO')
            },
            Center: {
                text: 'UVC Camera',
            },
            Right: {
                text: 'all',
                onPress: this.pickPicture
            },
        };
    }

    pickPicture = () => {
        ImagePicker.openPicker({
            cropping: true,
        }).then(image => {
            console.warn(image);
        }, error => {
            console.log(error.message);
        });
    }

    takePicture = async () => {
        if (this.camera) {
            const options = {
                width: 288, // this width can be debugged from getNearestSize() of react-native-uvc-camera/libuvccamera/src/main/java/com/serenegiant/usb/UVCCamera.java
                quality: 0.5,
            };
            const data = await this.camera.takePictureAsync(options);
            console.warn(data.uri);
            CameraRoll.saveToCameraRoll(data.uri);
        }
    };

    refCamera = view => {
        this.camera = view;
    }

    render() {
        return (
            <View style={styles.container}>
                <Nav navs={this.navs}/>
                <View style={styles.container}>
                    {Platform.OS === 'web' ? <View style= {styles.camera}/> :
                    <UvcCamera
                        ref={this.refCamera}
                        style={styles.camera}
                        type={UvcCamera.Constants.Type.back}
                        permissionDialogTitle={'Permission to use camera'}
                        permissionDialogMessage={'We need your permission to use your camera phone'}
                    />
                    }
                    <TouchableOpacity style={styles.captureButton} onPress={this.takePicture}>
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
        width: state.utils.width
    };
}
