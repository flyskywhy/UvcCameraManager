import React, {
    Component
} from 'react';
import {
    StyleSheet,
    TouchableOpacity
} from 'react-native';

const overlayButtonSize = 60;

class OverlayButton extends Component {
    render() {
        return (
            <TouchableOpacity
                onPress={this.props.onPress}
                  style={[this.props.position ? this.props.position : styles.defaultPosition, this.props.style]}>
                {this.props.children}
            </TouchableOpacity>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        height: overlayButtonSize,
        width: overlayButtonSize,
        position: 'absolute',
        borderRadius: overlayButtonSize / 2,
        backgroundColor: 'rgba(0,0,0,0.7)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    defaultPosition: {
        left: 30,
        bottom: 30
    }
});


export default OverlayButton;
