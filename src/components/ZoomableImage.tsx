import React from 'react';
import { Dimensions, StyleSheet, ImageSourcePropType } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ZoomableImageProps {
  source: ImageSourcePropType;
  onDismiss?: () => void;
  onSwitch?: (direction: 'left' | 'right') => void;
  style?: any;
}

const ZoomableImage: React.FC<ZoomableImageProps> = ({
  source,
  onDismiss = () => {},
  onSwitch = () => {},
  style,
}) => {
  const scale = useSharedValue(1);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const baseScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);
  const pinchScaleStart = useSharedValue(1); // 当前手势的起点缩放比例
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const isZoomed = useSharedValue(false);

  // ✅ 双击放大
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      // 如果已经放大，缩小到原始大小
      // 如果放大倍数不为1，则先还原
      const nextScale = isZoomed.value || scale.value !== 1 ? 1 : 2;
      if (nextScale === 1) {
        baseScale.value = 1;
      }
      scale.value = withTiming(nextScale);
    });

  // ✅ 双指缩放
  const pinch = Gesture.Pinch()
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
      scale.value = withTiming(clamped);
      // reset base for next gesture
      pinchScaleStart.value = clamped;
    });

  // ✅ 快速滑动关闭
  const pan = Gesture.Pan()
    .onStart(() => {
      startX.value = offsetX.value;
      startY.value = offsetY.value;
    })
    .onUpdate(e => {
      // ✅ 如果缩放过，就允许平移（包括左右）
      if (scale.value > 1.01) {
        offsetX.value = startX.value + e.translationX;
        offsetY.value = startY.value + e.translationY;
      } else {
        // 左右滑动触发切换的方法
        if (Math.abs(e.translationX) > 50) {
          // 如果左右滑动超过阈值，触发切换
          offsetY.value = 0; // 重置 Y 偏移
          runOnJS(onSwitch)(e.translationX > 0 ? 'right' : 'left');
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
        runOnJS(onDismiss)();
      } else {
        // ✅ 回弹到当前位置
        offsetY.value = withTiming(0);
        offsetX.value = withTiming(0);
      }
    });

  const composed = Gesture.Simultaneous(doubleTap, pinch, pan);

  const imageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offsetX.value },
        { translateY: offsetY.value },
        { scale: scale.value * baseScale.value },
      ],
    };
  });

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={composed}>
        <Animated.Image
          source={source}
          style={[styles.image, imageStyle]}
          resizeMode="contain"
        />
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

ZoomableImage.displayName = 'ZoomableImage';

const styles = StyleSheet.create({
  image: {
    width: screenWidth,
    height: screenHeight,
    backgroundColor: 'transparent', // Placeholder color
  },
});

export default ZoomableImage;
