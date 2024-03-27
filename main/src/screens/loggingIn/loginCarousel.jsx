import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  useWindowDimensions,
  useD,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import FastImage from 'react-native-fast-image';

const LoginCarousel = ({images}) => {
  const scrollRef = React.useRef(null);
  const {height, scale, fontScale} = useWindowDimensions();
  const {width} = Dimensions.get('screen');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedIndex(prevIndex =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1,
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [images]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        animated: true,
        x: width * selectedIndex,
        y: 0,
      });
    }
  }, [selectedIndex]);

  const handleScroll = event => {
    const {contentOffset, layoutMeasurement} = event.nativeEvent;
    const newSelectedIndex = Math.floor(
      contentOffset.x / layoutMeasurement.width,
    );
    setSelectedIndex(newSelectedIndex);
  };

  return (
    <ScrollView
      horizontal
      pagingEnabled
      ref={scrollRef}
      onScroll={handleScroll}>
      {images.map(image => (
        <View
          style={{
            flexDirection: 'column',
            width: width,
            height: height,
            alignItems: 'center',
          }}
          key={image.name}>
          <Text style={styles.xade}>XADE</Text>
          <Text style={styles.header}>{image.name}</Text>
          <Text style={styles.subheader}>{image.details}</Text>
          <FastImage
            source={{
              uri: image.image,
            }}
            resizeMode="cover"
            style={{
              width: '100%',
              height: 300,
              borderRadius: 50,
            }}
          />
        </View>
      ))}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  header: {
    color: '#fff',
    fontFamily: `Unbounded-Bold`,
    textAlign: 'center',
    fontSize: 32,
    marginTop: '2%',
  },
  xade: {
    color: '#fff',
    fontFamily: `LemonMilk-Bold`,
    textAlign: 'center',
    fontSize: 28,
    marginTop: '12%',
  },

  subheader: {
    color: '#817C89',
    fontFamily: `NeueMontreal-Medium`,
    textAlign: 'center',
    fontSize: 20,
    marginTop: '4%',
    marginBottom: '10%',
  },
});
export default LoginCarousel;
