import React from 'react';
import { ImageSourcePropType } from 'react-native';
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
export declare const ImagePreviewer: React.FC<ImagePreviewerProps>;
export default ImagePreviewer;
//# sourceMappingURL=ImagePreviewer.d.ts.map