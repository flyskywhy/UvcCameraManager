import React, {
    PureComponent
} from 'react';
import {
    View,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';

class LoadActivityIndicator extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            animating: true
        };
    }

    static propTypes = {
        ...ActivityIndicator.propTypes
    };

    static defaultProps = {
        animating: true,
        size: 'large',
        color: 'white',
    }

    setAnimating(animating) {
        this.setState({
            animating: animating
        });
    }

    getAnimating() {
        return this.state.animating;
    }

    render() {
        const {
            size,
            color
        } = this.props;
        return (
            <View style={styles.activityIndicator}>
                <ActivityIndicator
                    animating={this.state.animating}
                    color={color}
                    size={size}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    activityIndicator: {
        alignItems: 'center',
        justifyContent: 'center',
        flex:1
    },
});

export default LoadActivityIndicator;
