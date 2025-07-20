# react-native-image-previewer

实现快速的图片预览组件。

头部和底部组件支持自定义。

**兼容情况：**

​    "react": ">=19.1.0"

​    "react-native": ">=0.80.1"

---

本组件依赖于 `react-native-gesture-handler`和 `react-native-reanimated`

> 另外值得注意的是：`react-native-reanimated`安装后需要在`babel.config.js`中增加插件配置`react-native-reanimated/plugin`，并确保在 babel 插件配置的最后一个。
>
> ```json
> module.exports = {
>   presets: ['module:@react-native/babel-preset'],
>   plugins: ['react-native-reanimated/plugin'], // 增加此配置
> };
> ```
>
> 

# 安装

```shell
npm install react_native_image_previewer react-native-gesture-handler react-native-reanimated
```



# 使用

```tsx
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

	// 示例图片资源
  const SAMPLE_IMAGES = [
    { uri: 'https://picsum.photos/400/400?random=1' },
    { uri: 'https://picsum.photos/400/400?random=2' },
    { uri: 'https://picsum.photos/400/400?random=3' },
    { uri: 'https://picsum.photos/400/400?random=4' },
    { uri: 'https://picsum.photos/400/400?random=5' },
    { uri: 'https://picsum.photos/400/400?random=6' },
    { uri: 'https://picsum.photos/400/400?random=7' },
    { uri: 'https://picsum.photos/400/400?random=8' },
    { uri: 'https://picsum.photos/400/400?random=9' },
  ];

// ... 其他代码

  return ( Ï
    // ...其他代码
    <ImagePreviewer
        images={SAMPLE_IMAGES}
        initialIndex={currentIndex}
        visible={visible}
        onClose={() => setVisible(false)}
        backgroundColor="#000"
        showPageIndicator={true}
        onIndexChange={index => setCurrentIndex(index)}
      />
  // ...
  )
```

# 属性说明

比较简单，直接看类型定义吧。

```ts
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
```

