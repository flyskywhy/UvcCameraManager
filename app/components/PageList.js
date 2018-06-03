import React from 'react';
import {
    Animated,
    Image,
    FlatList,
    Platform,
    View,
    StyleSheet,
    ActivityIndicator,
    Text,
    TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import OverlayButton from './base/OverlayButton';
import BaseComponent from '../BaseComponent';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const HORIZ_WIDTH = 200;
const ITEM_HEIGHT = 72;

const HEADER = {height: 30, width: 100};
const SEPARATOR_HEIGHT = StyleSheet.hairlineWidth;

const VIEWABILITY_CONFIG = {
    minimumViewTime: 3000,
    viewAreaCoveragePercentThreshold: 100,
    waitForInteraction: true,
};

class PageList extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            debug: false,
            data: props.data || [],
            dataCount: 0,
            virtualized: true,
            horizontal: false,
            paginationStatus: props.allLoaded ? 'allLoaded' : 'firstLoad',
            rotation: new Animated.Value(0)
        };
    }

    _scrollPos = new Animated.Value(0);
    _scrollSinkX = Animated.event(
        [{nativeEvent: { contentOffset: { x: this._scrollPos } }}],
        {useNativeDriver: true},
    );
    _scrollSinkY = Animated.event(
        [{nativeEvent: { contentOffset: { y: this._scrollPos } }}],
        {useNativeDriver: true},
    );

    setDebug(debug) { //开启开发模式
        this.setState({
            debug: debug
        });
    }

    setvirtualized(virtualized) { //只有在debug模式下才打开
        this.setState({
            virtualized: virtualized
        });
    }

    componentWillUnmount() {
        this.time && clearTimeout(this.time);
    }

    setData(data, options) {
        this.setState({
            data: data
        }, () => {
            if (!options) {

            } else {
                this.setState({
                    paginationStatus: (options && options.allLoaded === true ? 'allLoaded' : 'loaded')
                });
            }
        });
    }

    getData() {
        return this.state.data;
    }

    getExterData() {
        return this.props.extraData;
    }

    getAllData() {
        let allData = this.state.data.concat(this.props.extraData);
        return allData;
    }

    static propTypes = {
        isItemSeparator: PropTypes.bool,
        isEmpty: PropTypes.bool,
        isFoot: PropTypes.bool,
        fixedHeight: PropTypes.bool,
        numColumns: PropTypes.number,
        itemCount: PropTypes.number,
        onEndReached: PropTypes.func,
        onRefresh: PropTypes.func,
        renderItem: PropTypes.func,
        onEndReachedThreshold: PropTypes.number,
        refreshing: PropTypes.bool,
        isLoadMore: PropTypes.bool,
        initialNumToRender: PropTypes.number
    };

    static defaultProps = {
        isItemSeparator: true,
        isFoot: true,
        fixedHeight: false,
        numColumns: 1,
        itemCount: 0,
        onEndReachedThreshold: 0.1,
        refreshing: false,
        isLoadMore: true,
        isEmpty: false,
        initialNumToRender: 20
    };

    itemSeparatorComponent = () => {
        const {
            isItemSeparator,
            itemSeparator
        } = this.props;
        if (itemSeparator) {
            return itemSeparator;
        }
        if (isItemSeparator) {
            return (
                <View style={styles.itemSeparator}/>
            );
        } else {
            return null;
        }
    }

    listEmptyComponent = () => {
        const {
            isEmpty,
            emptyView
        } = this.props;
        if (emptyView) {
            return emptyView;
        }
        if (isEmpty) {
            return (
                <View style={styles.emptyView}>
                    <Text style={styles.emptyText}>
                        没有任何数据
                    </Text>
                </View>
            );
        } else {
            return null;
        }
    }

    loadedFail() {
        this.setState({
            paginationStatus: 'loadFail'
        });
    }

    footComponent() {
        const {
            paginationStatus,
            data
        } = this.state;
        const {
            isLoadMore
        } = this.props;
        if (paginationStatus === 'loaded' || paginationStatus === 'firstLoad') {
            return null;
        } else if (paginationStatus === 'waiting' && isLoadMore === true && (data.length > 0)) {
            return this.paginationWaitingView();
        } else if (paginationStatus === 'allLoaded' && isLoadMore === true) {
            return this.paginationAllLoadedView();
        } else if (paginationStatus === 'loadFail' && isLoadMore === true) {
            return this.paginationLoadedFailView();
        } else {
            return null;
        }
    }

    paginationWaitingView(paginateCallback) {
        if (this.props.paginationWaitingView) {
            return this.props.paginationWaitingView(paginateCallback);
        }

        return (
            <View style={styles.foot}>
                <ActivityIndicator
                    animating={true}
                    color="#666666"
                    size="small"
                />
                <Text style={styles.loadingText}>
                    正在加载...
                </Text>
            </View>
        );
    }

    paginationAllLoadedView() {
        if (this.props.paginationAllLoadedView) {
            return this.props.paginationAllLoadedView();
        }

        return (
            <View style={styles.foot}>
                <Text style={styles.footText}>
                    已经到底了
                </Text>
            </View>
        );
    }

    paginationLoadedFailView() {
        if (this.props.paginationAllLoadedView) {
            return this.props.paginationAllLoadedView();
        }
        return (
            <TouchableOpacity style={styles.foot} onPress={this.loadFailOnPress}>
                <Text style={styles.footText}>
                    加载失败,点击重新加载
                </Text>
            </TouchableOpacity>
        );
    }

    loadFailOnPress = () => {
        const {
            onEndReached
        } = this.props;
        this.setState({
            paginationStatus: 'waiting'
        }, () => {
            if (onEndReached) {
                onEndReached();
            }
        });
    }

    _getItemLayout = (data: any, index: number) => {
        return this.getItemLayout(data, index, this.state.horizontal);
    }

    getItemLayout(data: any, index: number, horizontal?: boolean) {
        const [length, separator, header] = horizontal ?
        [HORIZ_WIDTH, 0, HEADER.width] : [ITEM_HEIGHT, SEPARATOR_HEIGHT, HEADER.height];
        return {length, offset: (length + separator) * index + header, index};
    }

    _shouldItemUpdate(prev, next) {
        return prev.item !== next.item;
    }

    _captureRef = (ref) => { this._listRef = ref; };

    _keyExtractor = (item, index) => {
        return String(index);
    }

    onEndReached = () => {
        const {
            onEndReached
        } = this.props;
        const {
            paginationStatus
        } = this.state;
        if (paginationStatus === 'firstLoad' || paginationStatus === 'allLoaded' || paginationStatus === 'waiting' || paginationStatus === 'loadFail') {
            return;
        }
        this.setState({
            paginationStatus: 'waiting'
        });
        if (onEndReached) {
            onEndReached();
        }
    }

    _renderOverlayContent() {
        return (
            <Image
                source={require('../images/common/refresh.png')}
            />
        );
    }

    render() {
        const {
            header,
            fixedHeight,
            numColumns,
            onRefresh,
            renderItem,
            style,
            containerStyle,
            onEndReachedThreshold,
            refreshing,
            extraData,
            footer,
            columnWrapperStyle,
            initialNumToRender
        } = this.props;
        const {
            horizontal
        } = this.state;
        return (
            <View style={[styles.container, style, containerStyle]}>
                <AnimatedFlatList
                    ItemSeparatorComponent={this.itemSeparatorComponent}
                    ListEmptyComponent={this.listEmptyComponent}
                    ListFooterComponent={footer ? footer : this.footComponent.bind(this)}
                    ListHeaderComponent={header}
                    columnWrapperStyle={columnWrapperStyle}
                    initialNumToRender={initialNumToRender}
                    data={extraData ? this.state.data.concat(extraData) : this.state.data}
                    debug={this.state.debug}
                    disableVirtualization={this.state.virtualized}
                    getItemLayout={fixedHeight ? this._getItemLayout : undefined}
                    horizontal={horizontal}
                    key={(horizontal ? 'h' : 'v') +
                        (fixedHeight ? 'f' : 'd')
                    }
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                    legacyImplementation={false}
                    numColumns={numColumns}
                    onEndReached={this.onEndReached}
                    onRefresh={onRefresh}
                    onScroll={horizontal ? this._scrollSinkX : this._scrollSinkY}
                    ref={this._captureRef}
                    refreshing={refreshing}
                    renderItem={renderItem}
                    contentContainerStyle={style}
                    viewabilityConfig={VIEWABILITY_CONFIG}
                    onEndReachedThreshold={onEndReachedThreshold}
                    keyExtractor={this._keyExtractor}
                />
                {Platform.OS === 'web' && onRefresh && (
                    <OverlayButton
                        position={styles.imgPosition}
                        onPress={onRefresh}>
                        {this._renderOverlayContent()}
                    </OverlayButton>
                )}
            </View>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F2'
    },
    imgPosition: {
        height: 50,
        width: 50,
        position: 'absolute',
        borderRadius: 50 / 2,
        borderColor: 'white',
        borderWidth: 3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        right: 10,
        bottom: 15
    },
    itemSeparator: {
        backgroundColor: '#dddddd',
        height: SEPARATOR_HEIGHT
    },
    emptyView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyText: {
        color: '#666666',
        fontSize: 20
    },
    foot: {
        backgroundColor: '#F1F1F1',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingTop: 5,
        paddingBottom: 5
    },
    footText: {
        fontSize: 14,
        color: '#999999'
    },
    loadingText: {
        fontSize: 14,
        color: '#999999',
        marginLeft: 5
    }
});
export default PageList;
