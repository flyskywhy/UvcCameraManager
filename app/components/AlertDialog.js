import React, {
    PureComponent
} from 'react';
import {
    View,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Text,
    TouchableWithoutFeedback,
    ScrollView,
    Dimensions
} from 'react-native';
import PropTypes from 'prop-types';

const SEPARATOR_HEIGHT = StyleSheet.hairlineWidth;
const MARGIN = 30;

const noop = () => {};

const Item = (props) => {
    const {
        item,
        index
    } = props;
    return (
        <TouchableOpacity
            style={[styles.itemContainer, item.style]}
            onPress={() => {item.onPress({item, index});}}>
            <Text style={[styles.itemText, item.textStyle]}>
                {item.text}
            </Text>
        </TouchableOpacity>
    );
};

class AlertDialog extends PureComponent {

    static propTypes = {
        ...Modal.propTypes,
        data: PropTypes.array
    };

    static defaultProps = {
        animationType: 'none',
        transparent: true,
        visible: false,
        data: [],
        onShow: noop,
        onRequestClose: noop,
        onOutSidePress: noop
    }

    state = {
        height: 0,
        titleHeght: 0
    }

    _handleLayout = ({nativeEvent: {layout: {height}}}) => {
        this.setState({
            height
        });
    }

    _handleLayoutTitle = ({nativeEvent: {layout: {height}}}) => {
        this.setState({
            titleHeght: height
        });
    }

    render() {
        const {
            animationType,
            transparent,
            visible,
            onShow,
            onRequestClose,
            onOutSidePress,
            data,
            style,
            title,
            titleStyle,
            titleTextStyle
        } = this.props;
        this.alertItem = this.data || (
            data.map((dt, index) =>
                <Item
                    item={dt}
                    key={index}
                    index={index}
                />
            )
        );
        let viewStyle = {};
        const viewHeight = this.state.height + this.state.titleHeght;
        if (viewHeight < Dimensions.get('window').height - MARGIN * 2) {
            viewStyle = {
                height: viewHeight,
                margin: MARGIN
            };
        } else {
            viewStyle = {
                flex: 1,
                margin: MARGIN
            };
        }
        return (
            <Modal
                animationType={animationType}
                transparent={transparent}
                visible={visible}
                onShow={onShow}
                onRequestClose={onRequestClose}>
                <TouchableWithoutFeedback onPress={onOutSidePress}>
                    <View style={styles.container}>
                        <View style={viewStyle}>
                            {title && <View
                                onLayout={this._handleLayoutTitle}
                                style={[styles.title, titleStyle]}>
                                <Text style={[styles.titleText, titleTextStyle]}>
                                    {title}
                                </Text>
                            </View>}
                            {title ? <View style={styles.line}/> : null}
                            <ScrollView style={styles.scrollViewContainer}>
                                <View
                                    onLayout={this._handleLayout}
                                    style={[styles.subView, style, title && {borderTopLeftRadius: 0, borderTopRightRadius: 0}]}>
                                    {this.alertItem}
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        flex: 1,
        justifyContent: 'center',
    },
    scrollViewContainer: {
        flex: 1
    },
    subView: {
        backgroundColor: '#fff',
        alignSelf: 'stretch',
        justifyContent: 'center',
        borderRadius: 3,
    },
    title: {
        borderBottomColor: '#dddddd',
        borderBottomWidth: SEPARATOR_HEIGHT,
        padding: 15,
        backgroundColor: 'white',
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3
    },
    titleText: {
        fontSize: 16,
        color: '#333333',
        fontWeight: 'bold'
    },
    itemContainer: {
        borderBottomColor: '#dddddd',
        borderBottomWidth: SEPARATOR_HEIGHT,
        padding: 15
    },
    itemText: {
        fontSize: 16,
        color: '#333333'
    },
    line: {
        backgroundColor: '#dddddd',
        height: SEPARATOR_HEIGHT
    }
});

export default AlertDialog;
