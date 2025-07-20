import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { ImagePreviewer } from './src';

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

const App: React.FC = () => {
  const [showExample2, setShowExample2] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);


  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>React Native Image Previewer</Text>
      <Text style={styles.subtitle}>组件库示例</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowExample2(true)}
        >
          <Text style={styles.buttonText}>仅预览器</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>图片预览器示例</Text>
      <View style={styles.gridContainer}>
        {SAMPLE_IMAGES.map((imageSource, index) => (
          <TouchableOpacity
            style={styles.imageContainer}
            key={index}
            onPress={() => {
              setShowExample2(true);
              setCurrentIndex(index);
            }}
          >
            <Image source={imageSource} style={styles.image} />
          </TouchableOpacity>
        ))}
      </View>

      <ImagePreviewer
        images={SAMPLE_IMAGES}
        visible={showExample2}
        onClose={() => setShowExample2(false)}
        backgroundColor="#000066"
        showPageIndicator={true}
        initialIndex={currentIndex}
        onIndexChange={(index) => setCurrentIndex(index)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  gridContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  imageContainer: {
    height: (Dimensions.get('window').width - 32) / 3, // (Dimensions.get('window').width - 32) /3
    width: (Dimensions.get('window').width - 32) / 3,
    marginVertical: 5,
    borderRadius: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
});

export default App;
