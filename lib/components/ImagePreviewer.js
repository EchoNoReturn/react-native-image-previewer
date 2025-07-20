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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagePreviewer = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const ZoomableImage_1 = __importDefault(require("./ZoomableImage"));
const { width: screenWidth } = react_native_1.Dimensions.get('window');
const ImagePreviewer = ({ images, initialIndex = 0, visible, onClose, backgroundColor = '#000000', showPageIndicator = true, style, onIndexChange, renderHeader, renderFooter, showDefaultCloseButton = true, }) => {
    const [currentIndex, setCurrentIndex] = (0, react_1.useState)(initialIndex);
    const scrollViewRef = react_1.default.useRef(null);
    const handleScroll = (event) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / screenWidth);
        setCurrentIndex(index);
        onIndexChange === null || onIndexChange === void 0 ? void 0 : onIndexChange(index);
    };
    (0, react_1.useEffect)(() => {
        if (initialIndex >= 0 &&
            initialIndex < images.length &&
            initialIndex !== currentIndex) {
            setCurrentIndex(initialIndex);
        }
    }, [initialIndex, images.length, currentIndex]);
    return ((0, jsx_runtime_1.jsxs)(react_native_1.Modal, { visible: visible, transparent: true, animationType: "fade", onRequestClose: onClose, children: [(0, jsx_runtime_1.jsx)(react_native_1.StatusBar, { hidden: true }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { style: [styles.container, { backgroundColor }, style], children: [renderHeader ? ((0, jsx_runtime_1.jsx)(react_native_1.View, { style: styles.headerContainer, children: renderHeader({ currentIndex, images, onClose }) })) : (showDefaultCloseButton && ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: styles.closeButton, onPress: onClose, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.closeText, children: "\u2715" }) }))), (0, jsx_runtime_1.jsx)(react_native_1.ScrollView, { horizontal: true, pagingEnabled: true, ref: scrollViewRef, showsHorizontalScrollIndicator: false, onMomentumScrollEnd: handleScroll, scrollEventThrottle: 16, contentOffset: { x: initialIndex * screenWidth, y: 0 }, children: images.map((item, index) => ((0, jsx_runtime_1.jsx)(ZoomableImage_1.default, { source: item, onDismiss: onClose, onSwitch: (direction) => {
                                var _a, _b;
                                console.log(`Switched ${direction}`);
                                // 根据方向切换图片
                                if (direction === 'right' && currentIndex > 0) {
                                    setCurrentIndex(currentIndex - 1);
                                    (_a = scrollViewRef.current) === null || _a === void 0 ? void 0 : _a.scrollTo({
                                        x: (currentIndex - 1) * screenWidth,
                                        animated: true,
                                    });
                                }
                                else if (direction === 'left' && currentIndex < images.length - 1) {
                                    setCurrentIndex(currentIndex + 1);
                                    (_b = scrollViewRef.current) === null || _b === void 0 ? void 0 : _b.scrollTo({
                                        x: (currentIndex + 1) * screenWidth,
                                        animated: true,
                                    });
                                }
                            } }, index))) }), renderFooter ? ((0, jsx_runtime_1.jsx)(react_native_1.View, { style: styles.footerContainer, children: renderFooter({ currentIndex, images }) })) : (showPageIndicator && images.length > 1 && ((0, jsx_runtime_1.jsx)(react_native_1.View, { style: styles.pageIndicator, children: (0, jsx_runtime_1.jsxs)(react_native_1.Text, { style: styles.pageText, children: [currentIndex + 1, " / ", images.length] }) })))] })] }));
};
exports.ImagePreviewer = ImagePreviewer;
const styles = react_native_1.StyleSheet.create({
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
exports.default = exports.ImagePreviewer;
