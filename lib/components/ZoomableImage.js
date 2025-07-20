"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_native_1 = require("react-native");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const react_native_reanimated_1 = __importStar(require("react-native-reanimated"));
const { width: screenWidth, height: screenHeight } = react_native_1.Dimensions.get('window');
const ZoomableImage = ({ source, onDismiss = () => { }, onSwitch = () => { }, style, }) => {
    const scale = (0, react_native_reanimated_1.useSharedValue)(1);
    const offsetX = (0, react_native_reanimated_1.useSharedValue)(0);
    const offsetY = (0, react_native_reanimated_1.useSharedValue)(0);
    const baseScale = (0, react_native_reanimated_1.useSharedValue)(1);
    const translateX = (0, react_native_reanimated_1.useSharedValue)(0);
    const translateY = (0, react_native_reanimated_1.useSharedValue)(0);
    const focalX = (0, react_native_reanimated_1.useSharedValue)(0);
    const focalY = (0, react_native_reanimated_1.useSharedValue)(0);
    const pinchScaleStart = (0, react_native_reanimated_1.useSharedValue)(1); // 当前手势的起点缩放比例
    const startX = (0, react_native_reanimated_1.useSharedValue)(0);
    const startY = (0, react_native_reanimated_1.useSharedValue)(0);
    const isZoomed = (0, react_native_reanimated_1.useSharedValue)(false);
    // ✅ 双击放大
    const doubleTap = react_native_gesture_handler_1.Gesture.Tap()
        .numberOfTaps(2)
        .onEnd(() => {
        // 如果已经放大，缩小到原始大小
        // 如果放大倍数不为1，则先还原
        const nextScale = isZoomed.value || scale.value !== 1 ? 1 : 2;
        if (nextScale === 1) {
            baseScale.value = 1;
        }
        scale.value = (0, react_native_reanimated_1.withTiming)(nextScale);
    });
    // ✅ 双指缩放
    const pinch = react_native_gesture_handler_1.Gesture.Pinch()
        .onStart(e => {
        // 固定缩放起点，防止 scale 回弹
        pinchScaleStart.value = scale.value;
        focalX.value = e.focalX;
        focalY.value = e.focalY;
    })
        .onUpdate(e => {
        scale.value = pinchScaleStart.value * e.scale;
        // focal 缩放中心补偿
        translateX.value = focalX.value - focalX.value * e.scale;
        translateY.value = focalY.value - focalY.value * e.scale;
    })
        .onEnd(e => {
        // 🚨 只接受合理范围的缩放值
        const clamped = Math.max(0.5, Math.min(scale.value, 4)); // 限制缩放在 0.5 ~ 4
        scale.value = (0, react_native_reanimated_1.withTiming)(clamped);
        // reset base for next gesture
        pinchScaleStart.value = clamped;
    });
    // ✅ 快速滑动关闭
    const pan = react_native_gesture_handler_1.Gesture.Pan()
        .onStart(() => {
        startX.value = offsetX.value;
        startY.value = offsetY.value;
    })
        .onUpdate(e => {
        // ✅ 如果缩放过，就允许平移（包括左右）
        if (scale.value > 1.01) {
            offsetX.value = startX.value + e.translationX;
            offsetY.value = startY.value + e.translationY;
        }
        else {
            // 左右滑动触发切换的方法
            if (Math.abs(e.translationX) > 50) {
                // 如果左右滑动超过阈值，触发切换
                offsetY.value = 0; // 重置 Y 偏移
                (0, react_native_reanimated_1.runOnJS)(onSwitch)(e.translationX > 0 ? 'right' : 'left');
                return;
            }
            // ✅ 否则只允许上下滑动用于关闭
            offsetX.value = 0;
            offsetY.value = e.translationY;
        }
    })
        .onEnd(e => {
        const velocityY = e.velocityY;
        if (Math.abs(velocityY) > 1000 && scale.value <= 1.1) {
            (0, react_native_reanimated_1.runOnJS)(onDismiss)();
        }
        else {
            // ✅ 回弹到当前位置
            offsetY.value = (0, react_native_reanimated_1.withTiming)(0);
            offsetX.value = (0, react_native_reanimated_1.withTiming)(0);
        }
    });
    const composed = react_native_gesture_handler_1.Gesture.Simultaneous(doubleTap, pinch, pan);
    const imageStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => {
        return {
            transform: [
                { translateX: offsetX.value },
                { translateY: offsetY.value },
                { scale: scale.value * baseScale.value },
            ],
        };
    });
    return ((0, jsx_runtime_1.jsx)(react_native_gesture_handler_1.GestureHandlerRootView, { children: (0, jsx_runtime_1.jsx)(react_native_gesture_handler_1.GestureDetector, { gesture: composed, children: (0, jsx_runtime_1.jsx)(react_native_reanimated_1.default.Image, { source: source, style: [styles.image, imageStyle], resizeMode: "contain" }) }) }));
};
ZoomableImage.displayName = 'ZoomableImage';
const styles = react_native_1.StyleSheet.create({
    image: {
        width: screenWidth,
        height: screenHeight,
        backgroundColor: 'transparent', // Placeholder color
    },
});
exports.default = ZoomableImage;
