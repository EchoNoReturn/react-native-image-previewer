import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
  StyleSheet,
  StatusBar,
  ImageSourcePropType,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import ZoomableImage from './ZoomableImage';

const { width: screenWidth } = Dimensions.get('window');

export interface ImagePreviewerProps {
  /**
   * 图片URL数组
   */
  images: ImageSourcePropType[];
  /**
   * 初始显示的图片索引
   */
  initialIndex?: number;
  /**
   * 是否显示模态框
   */
  visible: boolean;
  /**
   * 关闭模态框的回调
   */
  onClose?: () => void;
  /**
   * 背景色
   */
  backgroundColor?: string;
  /**
   * 是否显示页码指示器
   */
  showPageIndicator?: boolean;
  /**
   * 自定义样式
   */
  style?: any;
  /**
   * 图片索引变化时的回调
   */
  onIndexChange?: (index: number) => void;
  /**
   * 自定义头部组件
   */
  renderHeader?: (props: {
    currentIndex: number;
    images: ImageSourcePropType[];
    onClose?: () => void;
  }) => React.ReactNode;
  /**
   * 自定义底部组件
   */
  renderFooter?: (props: {
    currentIndex: number;
    images: ImageSourcePropType[];
  }) => React.ReactNode;
  /**
   * 是否显示默认关闭按钮（当自定义头部时）
   */
  showDefaultCloseButton?: boolean;
}

export const ImagePreviewer: React.FC<ImagePreviewerProps> = ({
  images,
  initialIndex = 0,
  visible,
  onClose,
  backgroundColor = '#000000',
  showPageIndicator = true,
  style,
  onIndexChange,
  renderHeader,
  renderFooter,
  showDefaultCloseButton = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const scrollViewRef = React.useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);
    setCurrentIndex(index);
    onIndexChange?.(index);
  };

  useEffect(() => {
    if (
      initialIndex >= 0 &&
      initialIndex < images.length &&
      initialIndex !== currentIndex
    ) {
      setCurrentIndex(initialIndex);
    }
  }, [initialIndex, images.length, currentIndex]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <StatusBar hidden={true} />
      <View style={[styles.container, { backgroundColor }, style]}>
        {/* 自定义头部或默认关闭按钮 */}
        {renderHeader ? (
          <View style={styles.headerContainer}>
            {renderHeader({ currentIndex, images, onClose })}
          </View>
        ) : (
          showDefaultCloseButton && (
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          )
        )}

        <ScrollView
          horizontal
          pagingEnabled
          ref={scrollViewRef}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          scrollEventThrottle={16}
          contentOffset={{ x: initialIndex * screenWidth, y: 0 }}
        >
          {images.map((item, index) => (
            <ZoomableImage
              key={index}
              source={item}
              onDismiss={onClose}
              onSwitch={(direction) => {
                console.log(`Switched ${direction}`);
                // 根据方向切换图片
                if (direction === 'right' && currentIndex > 0) {
                  setCurrentIndex(currentIndex - 1);
                  scrollViewRef.current?.scrollTo({
                    x: (currentIndex - 1) * screenWidth,
                    animated: true,
                  });
                } else if (direction === 'left' && currentIndex < images.length - 1) {
                  setCurrentIndex(currentIndex + 1);
                  scrollViewRef.current?.scrollTo({
                    x: (currentIndex + 1) * screenWidth,
                    animated: true,
                  });
                }
              }}
            />
          ))}
        </ScrollView>

        {/* 自定义底部或默认页码指示器 */}
        {renderFooter ? (
          <View style={styles.footerContainer}>
            {renderFooter({ currentIndex, images })}
          </View>
        ) : (
          showPageIndicator && images.length > 1 && (
            <View style={styles.pageIndicator}>
              <Text style={styles.pageText}>
                {currentIndex + 1} / {images.length}
              </Text>
            </View>
          )
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pageIndicator: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  pageText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});

export default ImagePreviewer;
