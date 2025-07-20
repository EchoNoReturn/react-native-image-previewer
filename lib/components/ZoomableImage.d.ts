import React from 'react';
import { ImageSourcePropType } from 'react-native';
interface ZoomableImageProps {
    source: ImageSourcePropType;
    onDismiss?: () => void;
    onSwitch?: (direction: 'left' | 'right') => void;
    style?: any;
}
declare const ZoomableImage: React.FC<ZoomableImageProps>;
export default ZoomableImage;
//# sourceMappingURL=ZoomableImage.d.ts.map