"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_native_1 = require("react-native");
const zoom_style_1 = require("./zoom.style");
const zoom_type_1 = require("./zoom.type");
class ImageViewer extends React.Component {
    static defaultProps = new zoom_type_1.ImageZoomProps();
    state = new zoom_type_1.ImageZoomState();
    // 上次/当前/动画 x 位移
    lastPositionX = null;
    positionX = 0;
    animatedPositionX = new react_native_1.Animated.Value(0);
    // 上次/当前/动画 y 位移
    lastPositionY = null;
    positionY = 0;
    animatedPositionY = new react_native_1.Animated.Value(0);
    // 缩放大小
    scale = 1;
    animatedScale = new react_native_1.Animated.Value(1);
    zoomLastDistance = null;
    zoomCurrentDistance = 0;
    // 上次手按下去的时间
    lastTouchStartTime = 0;
    // 滑动过程中，整体横向过界偏移量
    horizontalWholeOuterCounter = 0;
    // 滑动过程中，swipeDown 偏移量
    swipeDownOffset = 0;
    // 滑动过程中，x y的总位移
    horizontalWholeCounter = 0;
    verticalWholeCounter = 0;
    // 两手距离中心点位置
    centerDiffX = 0;
    centerDiffY = 0;
    // 触发单击的 timeout
    singleClickTimeout;
    // 计算长按的 timeout
    longPressTimeout;
    // 上一次点击的时间
    lastClickTime = 0;
    // 双击时的位置
    doubleClickX = 0;
    doubleClickY = 0;
    // 是否双击了
    isDoubleClick = false;
    // 是否是长按
    isLongPress = false;
    // 是否在左右滑
    isHorizontalWrap = false;
    // 图片手势处理
    imagePanResponder = react_native_1.PanResponder.create({
        // 要求成为响应者：
        onStartShouldSetPanResponder: this.props.onStartShouldSetPanResponder,
        onPanResponderTerminationRequest: this.props.onPanResponderTerminationRequest,
        onMoveShouldSetPanResponder: this.props.onMoveShouldSetPanResponder,
        onPanResponderGrant: (evt) => {
            // 开始手势操作
            this.lastPositionX = null;
            this.lastPositionY = null;
            this.zoomLastDistance = null;
            this.horizontalWholeCounter = 0;
            this.verticalWholeCounter = 0;
            this.lastTouchStartTime = new Date().getTime();
            this.isDoubleClick = false;
            this.isLongPress = false;
            this.isHorizontalWrap = false;
            // 任何手势开始，都清空单击计时器
            if (this.singleClickTimeout) {
                clearTimeout(this.singleClickTimeout);
            }
            if (evt.nativeEvent.changedTouches.length > 1) {
                const centerX = (evt.nativeEvent.changedTouches[0].pageX + evt.nativeEvent.changedTouches[1].pageX) / 2;
                this.centerDiffX = centerX - this.props.cropWidth / 2;
                const centerY = (evt.nativeEvent.changedTouches[0].pageY + evt.nativeEvent.changedTouches[1].pageY) / 2;
                this.centerDiffY = centerY - this.props.cropHeight / 2;
            }
            // 计算长按
            if (this.longPressTimeout) {
                clearTimeout(this.longPressTimeout);
            }
            const { locationX, locationY, pageX, pageY } = evt.nativeEvent;
            this.longPressTimeout = window.setTimeout(() => {
                this.isLongPress = true;
                if (this.props.onLongPress) {
                    this.props.onLongPress({ locationX, locationY, pageX, pageY });
                }
            }, this.props.longPressTime);
            if (evt.nativeEvent.changedTouches.length <= 1) {
                // 一个手指的情况
                if (new Date().getTime() - this.lastClickTime < (this.props.doubleClickInterval || 0)) {
                    // 认为触发了双击
                    this.lastClickTime = 0;
                    // 因为可能触发放大，因此记录双击时的坐标位置
                    this.doubleClickX = evt.nativeEvent.changedTouches[0].pageX;
                    this.doubleClickY = evt.nativeEvent.changedTouches[0].pageY;
                    if (this.props.onDoubleClick) {
                        this.props.onDoubleClick({
                            locationX: evt.nativeEvent.changedTouches[0].locationX,
                            locationY: evt.nativeEvent.changedTouches[0].locationY,
                            pageX: this.doubleClickX,
                            pageY: this.doubleClickY,
                        });
                    }
                    // 取消长按
                    clearTimeout(this.longPressTimeout);
                    // 缩放
                    this.isDoubleClick = true;
                    if (this.props.enableDoubleClickZoom) {
                        if (this.scale > 1 || this.scale < 1) {
                            // 回归原位
                            this.scale = 1;
                            this.positionX = 0;
                            this.positionY = 0;
                        }
                        else {
                            // 开始在位移地点缩放
                            // 记录之前缩放比例
                            // 此时 this.scale 一定为 1
                            const beforeScale = this.scale;
                            // 开始缩放
                            this.scale = 2;
                            // 缩放 diff
                            const diffScale = this.scale - beforeScale;
                            // 找到两手中心点距离页面中心的位移
                            // 移动位置
                            this.positionX = ((this.props.cropWidth / 2 - this.doubleClickX) * diffScale) / this.scale;
                            this.positionY = ((this.props.cropHeight / 2 - this.doubleClickY) * diffScale) / this.scale;
                        }
                        this.imageDidMove('centerOn');
                        react_native_1.Animated.parallel([
                            react_native_1.Animated.timing(this.animatedScale, {
                                toValue: this.scale,
                                duration: 100,
                                useNativeDriver: !!this.props.useNativeDriver,
                            }),
                            react_native_1.Animated.timing(this.animatedPositionX, {
                                toValue: this.positionX,
                                duration: 100,
                                useNativeDriver: !!this.props.useNativeDriver,
                            }),
                            react_native_1.Animated.timing(this.animatedPositionY, {
                                toValue: this.positionY,
                                duration: 100,
                                useNativeDriver: !!this.props.useNativeDriver,
                            }),
                        ]).start();
                    }
                }
                else {
                    this.lastClickTime = new Date().getTime();
                }
            }
        },
        onPanResponderMove: (evt, gestureState) => {
            if (this.isDoubleClick) {
                // 有时双击会被当做位移，这里屏蔽掉
                return;
            }
            if (evt.nativeEvent.changedTouches.length <= 1) {
                // x 位移
                let diffX = gestureState.dx - (this.lastPositionX || 0);
                if (this.lastPositionX === null) {
                    diffX = 0;
                }
                // y 位移
                let diffY = gestureState.dy - (this.lastPositionY || 0);
                if (this.lastPositionY === null) {
                    diffY = 0;
                }
                // 保留这一次位移作为下次的上一次位移
                this.lastPositionX = gestureState.dx;
                this.lastPositionY = gestureState.dy;
                this.horizontalWholeCounter += diffX;
                this.verticalWholeCounter += diffY;
                if (Math.abs(this.horizontalWholeCounter) > 5 || Math.abs(this.verticalWholeCounter) > 5) {
                    // 如果位移超出手指范围，取消长按监听
                    clearTimeout(this.longPressTimeout);
                }
                if (this.props.panToMove) {
                    // 处理左右滑，如果正在 swipeDown，左右滑失效
                    if (this.swipeDownOffset === 0) {
                        if (Math.abs(diffX) > Math.abs(diffY)) {
                            this.isHorizontalWrap = true;
                        }
                        // diffX > 0 表示手往右滑，图往左移动，反之同理
                        // horizontalWholeOuterCounter > 0 表示溢出在左侧，反之在右侧，绝对值越大溢出越多
                        if (this.props.imageWidth * this.scale > this.props.cropWidth) {
                            // 如果图片宽度大图盒子宽度， 可以横向拖拽
                            // 没有溢出偏移量或者这次位移完全收回了偏移量才能拖拽
                            if (this.horizontalWholeOuterCounter > 0) {
                                // 溢出在右侧
                                if (diffX < 0) {
                                    // 从右侧收紧
                                    if (this.horizontalWholeOuterCounter > Math.abs(diffX)) {
                                        // 偏移量还没有用完
                                        this.horizontalWholeOuterCounter += diffX;
                                        diffX = 0;
                                    }
                                    else {
                                        // 溢出量置为0，偏移量减去剩余溢出量，并且可以被拖动
                                        diffX += this.horizontalWholeOuterCounter;
                                        this.horizontalWholeOuterCounter = 0;
                                        if (this.props.horizontalOuterRangeOffset) {
                                            this.props.horizontalOuterRangeOffset(0);
                                        }
                                    }
                                }
                                else {
                                    // 向右侧扩增
                                    this.horizontalWholeOuterCounter += diffX;
                                }
                            }
                            else if (this.horizontalWholeOuterCounter < 0) {
                                // 溢出在左侧
                                if (diffX > 0) {
                                    // 从左侧收紧
                                    if (Math.abs(this.horizontalWholeOuterCounter) > diffX) {
                                        // 偏移量还没有用完
                                        this.horizontalWholeOuterCounter += diffX;
                                        diffX = 0;
                                    }
                                    else {
                                        // 溢出量置为0，偏移量减去剩余溢出量，并且可以被拖动
                                        diffX += this.horizontalWholeOuterCounter;
                                        this.horizontalWholeOuterCounter = 0;
                                        if (this.props.horizontalOuterRangeOffset) {
                                            this.props.horizontalOuterRangeOffset(0);
                                        }
                                    }
                                }
                                else {
                                    // 向左侧扩增
                                    this.horizontalWholeOuterCounter += diffX;
                                }
                            }
                            else {
                                // 溢出偏移量为0，正常移动
                            }
                            // 产生位移
                            this.positionX += diffX / this.scale;
                            // 但是横向不能出现黑边
                            // 横向能容忍的绝对值
                            const horizontalMax = (this.props.imageWidth * this.scale - this.props.cropWidth) / 2 / this.scale;
                            if (this.positionX < -horizontalMax) {
                                // 超越了左边临界点，还在继续向左移动
                                this.positionX = -horizontalMax;
                                // 让其产生细微位移，偏离轨道
                                this.horizontalWholeOuterCounter += -1 / 1e10;
                            }
                            else if (this.positionX > horizontalMax) {
                                // 超越了右侧临界点，还在继续向右移动
                                this.positionX = horizontalMax;
                                // 让其产生细微位移，偏离轨道
                                this.horizontalWholeOuterCounter += 1 / 1e10;
                            }
                            this.animatedPositionX.setValue(this.positionX);
                        }
                        else {
                            // 不能横向拖拽，全部算做溢出偏移量
                            this.horizontalWholeOuterCounter += diffX;
                        }
                        // 溢出量不会超过设定界限
                        if (this.horizontalWholeOuterCounter > (this.props.maxOverflow || 0)) {
                            this.horizontalWholeOuterCounter = this.props.maxOverflow || 0;
                        }
                        else if (this.horizontalWholeOuterCounter < -(this.props.maxOverflow || 0)) {
                            this.horizontalWholeOuterCounter = -(this.props.maxOverflow || 0);
                        }
                        if (this.horizontalWholeOuterCounter !== 0) {
                            // 如果溢出偏移量不是0，执行溢出回调
                            if (this.props.horizontalOuterRangeOffset) {
                                this.props.horizontalOuterRangeOffset(this.horizontalWholeOuterCounter);
                            }
                        }
                    }
                    // 如果图片高度大于盒子高度， 可以纵向弹性拖拽
                    if (this.props.imageHeight * this.scale > this.props.cropHeight) {
                        this.positionY += diffY / this.scale;
                        this.animatedPositionY.setValue(this.positionY);
                        // 如果图片上边缘脱离屏幕上边缘，则进入 swipeDown 动作
                        // if (
                        //   (this.props.imageHeight / 2 - this.positionY) * this.scale <
                        //   this.props.cropHeight / 2
                        // ) {
                        //   if (this.props.enableSwipeDown) {
                        //     this.swipeDownOffset += diffY
                        //     // 只要滑动溢出量不小于 0，就可以拖动
                        //     if (this.swipeDownOffset > 0) {
                        //       this.positionY += diffY / this.scale
                        //       this.animatedPositionY.setValue(this.positionY)
                        //       // 越到下方，缩放越小
                        //       this.scale = this.scale - diffY / 1000
                        //       this.animatedScale.setValue(this.scale)
                        //     }
                        //   }
                        // }
                    }
                    else {
                        // swipeDown 不允许在已经有横向偏移量时触发
                        if (this.props.enableSwipeDown && !this.isHorizontalWrap) {
                            // 图片高度小于盒子高度，只能向下拖拽，而且一定是 swipeDown 动作
                            this.swipeDownOffset += diffY;
                            // 只要滑动溢出量不小于 0，就可以拖动
                            if (this.swipeDownOffset > 0) {
                                this.positionY += diffY / this.scale;
                                this.animatedPositionY.setValue(this.positionY);
                                // 越到下方，缩放越小
                                this.scale = this.scale - diffY / 1000;
                                this.animatedScale.setValue(this.scale);
                            }
                        }
                    }
                }
            }
            else {
                // 多个手指的情况
                // 取消长按状态
                if (this.longPressTimeout) {
                    clearTimeout(this.longPressTimeout);
                }
                if (this.props.pinchToZoom) {
                    // 找最小的 x 和最大的 x
                    let minX;
                    let maxX;
                    if (evt.nativeEvent.changedTouches[0].locationX > evt.nativeEvent.changedTouches[1].locationX) {
                        minX = evt.nativeEvent.changedTouches[1].pageX;
                        maxX = evt.nativeEvent.changedTouches[0].pageX;
                    }
                    else {
                        minX = evt.nativeEvent.changedTouches[0].pageX;
                        maxX = evt.nativeEvent.changedTouches[1].pageX;
                    }
                    let minY;
                    let maxY;
                    if (evt.nativeEvent.changedTouches[0].locationY > evt.nativeEvent.changedTouches[1].locationY) {
                        minY = evt.nativeEvent.changedTouches[1].pageY;
                        maxY = evt.nativeEvent.changedTouches[0].pageY;
                    }
                    else {
                        minY = evt.nativeEvent.changedTouches[0].pageY;
                        maxY = evt.nativeEvent.changedTouches[1].pageY;
                    }
                    const widthDistance = maxX - minX;
                    const heightDistance = maxY - minY;
                    const diagonalDistance = Math.sqrt(widthDistance * widthDistance + heightDistance * heightDistance);
                    this.zoomCurrentDistance = Number(diagonalDistance.toFixed(1));
                    if (this.zoomLastDistance !== null) {
                        const distanceDiff = (this.zoomCurrentDistance - this.zoomLastDistance) / 200;
                        let zoom = this.scale + distanceDiff;
                        if (zoom < (this.props.minScale || 0)) {
                            zoom = this.props.minScale || 0;
                        }
                        if (zoom > (this.props.maxScale || 0)) {
                            zoom = this.props.maxScale || 0;
                        }
                        // 记录之前缩放比例
                        const beforeScale = this.scale;
                        // 开始缩放
                        this.scale = zoom;
                        this.animatedScale.setValue(this.scale);
                        // 图片要慢慢往两个手指的中心点移动
                        // 缩放 diff
                        const diffScale = this.scale - beforeScale;
                        // 找到两手中心点距离页面中心的位移
                        // 移动位置
                        this.positionX -= (this.centerDiffX * diffScale) / this.scale;
                        this.positionY -= (this.centerDiffY * diffScale) / this.scale;
                        this.animatedPositionX.setValue(this.positionX);
                        this.animatedPositionY.setValue(this.positionY);
                    }
                    this.zoomLastDistance = this.zoomCurrentDistance;
                }
            }
            this.imageDidMove('onPanResponderMove');
        },
        onPanResponderRelease: (evt, gestureState) => {
            // 取消长按
            if (this.longPressTimeout) {
                clearTimeout(this.longPressTimeout);
            }
            // 双击结束，结束尾判断
            if (this.isDoubleClick) {
                return;
            }
            // 长按结束，结束尾判断
            if (this.isLongPress) {
                return;
            }
            // 如果是单个手指、距离上次按住大于预设秒、滑动距离小于预设值, 则可能是单击（如果后续双击间隔内没有开始手势）
            // const stayTime = new Date().getTime() - this.lastTouchStartTime!
            const moveDistance = Math.sqrt(gestureState.dx * gestureState.dx + gestureState.dy * gestureState.dy);
            const { locationX, locationY, pageX, pageY } = evt.nativeEvent;
            if (evt.nativeEvent.changedTouches.length === 1 && moveDistance < (this.props.clickDistance || 0)) {
                this.singleClickTimeout = window.setTimeout(() => {
                    if (this.props.onClick) {
                        this.props.onClick({ locationX, locationY, pageX, pageY });
                    }
                }, this.props.doubleClickInterval);
            }
            else {
                // 多手势结束，或者滑动结束
                if (this.props.responderRelease) {
                    this.props.responderRelease(gestureState.vx, this.scale);
                }
                this.panResponderReleaseResolve();
            }
        },
        onPanResponderTerminate: () => {
            //
        },
    });
    resetScale = () => {
        this.positionX = 0;
        this.positionY = 0;
        this.scale = 1;
        this.animatedScale.setValue(1);
    };
    panResponderReleaseResolve = () => {
        // 判断是否是 swipeDown
        if (this.props.enableSwipeDown && this.props.swipeDownThreshold) {
            if (this.swipeDownOffset > this.props.swipeDownThreshold) {
                if (this.props.onSwipeDown) {
                    this.props.onSwipeDown();
                }
                // Stop reset.
                return;
            }
        }
        if (this.props.enableCenterFocus && this.scale < 1) {
            // 如果缩放小于1，强制重置为 1
            this.scale = 1;
            react_native_1.Animated.timing(this.animatedScale, {
                toValue: this.scale,
                duration: 100,
                useNativeDriver: !!this.props.useNativeDriver,
            }).start();
        }
        if (this.props.imageWidth * this.scale <= this.props.cropWidth) {
            // 如果图片宽度小于盒子宽度，横向位置重置
            this.positionX = 0;
            react_native_1.Animated.timing(this.animatedPositionX, {
                toValue: this.positionX,
                duration: 100,
                useNativeDriver: !!this.props.useNativeDriver,
            }).start();
        }
        if (this.props.imageHeight * this.scale <= this.props.cropHeight) {
            // 如果图片高度小于盒子高度，纵向位置重置
            this.positionY = 0;
            react_native_1.Animated.timing(this.animatedPositionY, {
                toValue: this.positionY,
                duration: 100,
                useNativeDriver: !!this.props.useNativeDriver,
            }).start();
        }
        // 横向肯定不会超出范围，由拖拽时控制
        // 如果图片高度大于盒子高度，纵向不能出现黑边
        if (this.props.imageHeight * this.scale > this.props.cropHeight) {
            // 纵向能容忍的绝对值
            const verticalMax = (this.props.imageHeight * this.scale - this.props.cropHeight) / 2 / this.scale;
            if (this.positionY < -verticalMax) {
                this.positionY = -verticalMax;
            }
            else if (this.positionY > verticalMax) {
                this.positionY = verticalMax;
            }
            react_native_1.Animated.timing(this.animatedPositionY, {
                toValue: this.positionY,
                duration: 100,
                useNativeDriver: !!this.props.useNativeDriver,
            }).start();
        }
        if (this.props.imageWidth * this.scale > this.props.cropWidth) {
            // 纵向能容忍的绝对值
            const horizontalMax = (this.props.imageWidth * this.scale - this.props.cropWidth) / 2 / this.scale;
            if (this.positionX < -horizontalMax) {
                this.positionX = -horizontalMax;
            }
            else if (this.positionX > horizontalMax) {
                this.positionX = horizontalMax;
            }
            react_native_1.Animated.timing(this.animatedPositionX, {
                toValue: this.positionX,
                duration: 100,
                useNativeDriver: !!this.props.useNativeDriver,
            }).start();
        }
        // 拖拽正常结束后,如果没有缩放,直接回到0,0点
        if (this.props.enableCenterFocus && this.scale === 1) {
            this.positionX = 0;
            this.positionY = 0;
            react_native_1.Animated.timing(this.animatedPositionX, {
                toValue: this.positionX,
                duration: 100,
                useNativeDriver: !!this.props.useNativeDriver,
            }).start();
            react_native_1.Animated.timing(this.animatedPositionY, {
                toValue: this.positionY,
                duration: 100,
                useNativeDriver: !!this.props.useNativeDriver,
            }).start();
        }
        // 水平溢出量置空
        this.horizontalWholeOuterCounter = 0;
        // swipeDown 溢出量置空
        this.swipeDownOffset = 0;
        this.imageDidMove('onPanResponderRelease');
    };
    componentDidMount() {
        if (this.props.centerOn) {
            this.centerOn(this.props.centerOn);
        }
    }
    componentDidUpdate(prevProps) {
        // Either centerOn has never been called, or it is a repeat and we should ignore it
        if ((this.props.centerOn && !prevProps.centerOn) ||
            (this.props.centerOn && prevProps.centerOn && this.didCenterOnChange(prevProps.centerOn, this.props.centerOn))) {
            this.centerOn(this.props.centerOn);
        }
    }
    imageDidMove(type) {
        if (this.props.onMove) {
            this.props.onMove({
                type,
                positionX: this.positionX,
                positionY: this.positionY,
                scale: this.scale,
                zoomCurrentDistance: this.zoomCurrentDistance,
            });
        }
    }
    didCenterOnChange(params, paramsNext) {
        return params.x !== paramsNext.x || params.y !== paramsNext.y || params.scale !== paramsNext.scale;
    }
    centerOn(params) {
        this.positionX = params.x;
        this.positionY = params.y;
        this.scale = params.scale;
        const duration = params.duration || 300;
        react_native_1.Animated.parallel([
            react_native_1.Animated.timing(this.animatedScale, {
                toValue: this.scale,
                duration,
                useNativeDriver: !!this.props.useNativeDriver,
            }),
            react_native_1.Animated.timing(this.animatedPositionX, {
                toValue: this.positionX,
                duration,
                useNativeDriver: !!this.props.useNativeDriver,
            }),
            react_native_1.Animated.timing(this.animatedPositionY, {
                toValue: this.positionY,
                duration,
                useNativeDriver: !!this.props.useNativeDriver,
            }),
        ]).start(() => {
            this.imageDidMove('centerOn');
        });
    }
    /**
     * 图片区域视图渲染完毕
     */
    handleLayout(event) {
        if (this.props.layoutChange) {
            this.props.layoutChange(event);
        }
    }
    /**
     * 重置大小和位置
     */
    reset() {
        this.scale = 1;
        this.animatedScale.setValue(this.scale);
        this.positionX = 0;
        this.animatedPositionX.setValue(this.positionX);
        this.positionY = 0;
        this.animatedPositionY.setValue(this.positionY);
    }
    render() {
        const animateConf = {
            transform: [
                {
                    scale: this.animatedScale,
                },
                {
                    translateX: this.animatedPositionX,
                },
                {
                    translateY: this.animatedPositionY,
                },
            ],
        };
        const parentStyles = react_native_1.StyleSheet.flatten(this.props.style);
        return (<react_native_1.View style={{
                ...zoom_style_1.default.container,
                ...parentStyles,
                width: this.props.cropWidth,
                height: this.props.cropHeight,
            }} {...this.imagePanResponder.panHandlers}>
        <react_native_1.Animated.View style={animateConf} renderToHardwareTextureAndroid={this.props.useHardwareTextureAndroid}>
          <react_native_1.View onLayout={this.handleLayout.bind(this)} style={{
                width: this.props.imageWidth,
                height: this.props.imageHeight,
            }}>
            {this.props.children}
          </react_native_1.View>
        </react_native_1.Animated.View>
      </react_native_1.View>);
    }
}
exports.default = ImageViewer;
//# sourceMappingURL=zoom.component.js.map