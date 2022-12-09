"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageZoomState = exports.ImageZoomProps = void 0;
class ImageZoomProps {
    children;
    /**
     * 操作区域宽度
     */
    cropWidth = 100;
    /**
     * 操作区域高度
     */
    cropHeight = 100;
    /**
     * 图片宽度
     */
    imageWidth = 100;
    /**
     * 图片高度
     */
    imageHeight = 100;
    /**
     * 单手是否能移动图片
     */
    panToMove = true;
    /**
     * 多手指是否能缩放
     */
    pinchToZoom = true;
    /**
     * 双击能否放大
     */
    enableDoubleClickZoom = true;
    /**
     * 单击最大位移
     */
    clickDistance = 10;
    /**
     * 最大滑动阈值
     */
    maxOverflow = 100;
    /**
     * 长按的阈值（毫秒）
     */
    longPressTime = 800;
    /**
     * 双击计时器最大间隔
     */
    doubleClickInterval = 175;
    /**
     * If provided this will cause the view to zoom and pan to the center point
     * Duration is optional and defaults to 300 ms.
     */
    centerOn;
    style = {};
    /**
     * threshold for firing swipe down function
     */
    swipeDownThreshold = 230;
    /**
     * for enabling vertical movement if user doesn't want it
     */
    enableSwipeDown = false;
    /**
     * for disabling focus on image center if user doesn't want it
     */
    enableCenterFocus = true;
    /**
     * for disabling rendering to hardware texture on Android
     */
    useHardwareTextureAndroid = true;
    /**
     * minimum zoom scale
     */
    minScale = 0.6;
    /**
     * maximum zoom scale
     */
    maxScale = 10;
    /**
     * 是否启用原生动画驱动
     * Whether to use native code to perform animations.
     */
    useNativeDriver = false;
    /**
     * 单击的回调
     */
    onClick = () => {
        //
    };
    /**
     * 双击的回调
     */
    onDoubleClick = () => {
        //
    };
    /**
     * 长按的回调
     */
    onLongPress = () => {
        //
    };
    /**
     * 横向超出的距离，父级做图片切换时，可以监听这个函数
     * 当此函数触发时，可以做切换操作
     */
    horizontalOuterRangeOffset = () => {
        //
    };
    /**
     * 触发想切换到左边的图，向左滑动速度超出阈值时触发
     */
    onDragLeft = () => {
        //
    };
    /**
     * 松手但是没有取消看图的回调
     */
    responderRelease = () => {
        //
    };
    /**
     * If provided, this will be called everytime the map is moved
     */
    onMove = () => {
        //
    };
    /**
     * If provided, this method will be called when the onLayout event fires
     */
    layoutChange = () => {
        //
    };
    /**
     * function that fires when user swipes down
     */
    onSwipeDown = () => {
        //
    };
    /**
     * Allows defining the onMoveShouldSetResponder behavior.
     */
    onMoveShouldSetPanResponder;
    /**
     * Allows overriding the default onStartShouldSetPanResponder behavior.
     * By default, always becomes the responder
     */
    onStartShouldSetPanResponder = () => true;
    /**
     * Allows overriding the default onPanResponderTerminationRequest behavior.
     * By default, doesn't terminate until the press ends
     */
    onPanResponderTerminationRequest = () => false;
}
exports.ImageZoomProps = ImageZoomProps;
class ImageZoomState {
    /**
     * 中心 x 坐标
     */
    centerX = 0.5;
    /**
     * 中心 y 坐标
     */
    centerY = 0.5;
}
exports.ImageZoomState = ImageZoomState;
//# sourceMappingURL=zoom.type.js.map