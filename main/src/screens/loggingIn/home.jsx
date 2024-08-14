import React, {Component, useEffect, useRef, useState} from 'react';
import {
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  View,
  Dimensions,
  Button,
  Platform,
  Animated,
  Image
} from 'react-native';
import {Text} from '@rneui/themed';
import BouncyIcon from './BouncyIcon';
import {Icon} from 'react-native-elements';
import {PNAccount} from '../../Models/PNAccount';
import FastImage from 'react-native-fast-image';
import {
  FlingGestureHandler,
  Directions,
  State,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {LoginCarousel} from './loginCarousel';
import {onClickLogin} from '../../particle-auth';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import LinearGradient from 'react-native-linear-gradient';
const DEVICE_WIDTH = Dimensions.get('window').width;
import Clipboard from '@react-native-clipboard/clipboard';
import {useDispatch} from 'react-redux';
import {onAuthCoreLogin} from '../../store/actions/auth';
import img1 from '../../../assets/1.png'; // Import the local image
import img2 from '../../../assets/2.png';
import img3 from '../../../assets/3.png';
import img4 from '../../../assets/4.png';
import img5 from '../../../assets/5.png';
import img6 from '../../../assets/6.png';
const windowHeight = Dimensions.get('window').height;

const images = [
  {
    name: `THE ULTIMATE${'\n'}TRADING ${'\n'} EXPERIENCE`,
    details: `Trade everything with aggregated ${'\n'}liqudity and advanced tools`,
    image: img1, // Use the imported image directly
  },
  {
    name: `TRADE 10,000+ ${'\n'}MARKETS AT${'\n'}ONE PLACE `,
    details: `Trade stocks, crypto, commodities,${'\n'}forex & more at one place`,
    image: img4, // Use the imported image directly
  },
  {
    name: `OMNI-CHAIN${'\n'}LIQUIDITY ${'\n'} AGGREGATION`,
    details: `Get the best liquidity aggregated ${'\n'} across all chains and protocols`,
    image: img3, // Use the imported image directly
  },
  {
    name: `O COMMISSION${'\n'}& INSTANT ${'\n'} SETTLEMENTS`,
    details: `Trade with <10s execution time in a${'\n'}gasless manner with 0 fees from Xade`,
    image: img5, // Use the imported image directly
  },
  {
    name: `ADVANCED AI${'\n'}POWERED ${'\n'} ANALYSIS TOOLS`,
    details: `Trade like a pro with advanced${'\n'} charts, news, research and Degen AI`,
    image: img2,
  },
  {
    name: `500+ DEPOSIT${'\n'}& WITHDRAWAL ${'\n'} METHODS`,
    details: `Deposit or Withdraw funds${'\n'} seamlessly from 120+ countries`,
    image: img6,
  },
];

const StaticHomeScreen = ({navigation}) => {
  const [selectedButton, setSelectedButton] = useState(
    `THE ULTIMATE${'\n'}TRADING ${'\n'} EXPERIENCE`,
  );
  const dispatch = useDispatch();

  const handleSwipeUp = ({nativeEvent}) => {
    if (nativeEvent.oldState === State.ACTIVE) {
      // Trigger haptic feedback
      const options = {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      };
      ReactNativeHapticFeedback.trigger('impactHeavy', options);
      navigation.navigate('NewAuthFlow');
    }
  };

  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      <SafeAreaView style={styles.bg}>
        <FlingGestureHandler
          direction={Directions.UP}
          onHandlerStateChange={handleSwipeUp}>
          <View style={styles.container}>
            <View style={styles.topbar}>
              {images.map((image, index) => (
                <View
                  key={index}
                  style={
                    selectedButton === image.name
                      ? styles.selected
                      : styles.carouselIndicator
                  }
                />
              ))}
            </View>
            <View style={styles.carouselContainer}>
              <LoginCarousel
                images={images}
                navigation={navigation}
                address={'0x'}
                selectedImage={selectedButton}
                onImageChange={(newImage) => setSelectedButton(newImage)}
              />
            </View>
            <LinearGradient
              colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0.5)']}
              style={styles.swipeUpContainer}>
              <BouncyIcon />
              <Text style={styles.getStartedText}>
                SWIPE UP TO GET STARTED
              </Text>
            </LinearGradient>
          </View>
        </FlingGestureHandler>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
  },
  bg: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
  },

  carouselIndicator: {
    backgroundColor: '#817c89',
    opacity: 0.3,
    width: 58,
    height: 4, 
    borderRadius: 15,
    marginHorizontal: 8,
  },

  selected: {
    backgroundColor: '#fff',
    width: 58,
    height: 4,
    borderRadius: 15,
    marginHorizontal: 8,
  },

  topbar: {
    width: '100%',
    marginTop: '5%',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  carouselContainer: {
    flex: 1,
    marginTop:'15%',
    height:'120%' // This ensures the carousel takes up all available space
  },

  swipeUpContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    zIndex: 1000,
  },

  getStartedText: {
    color: '#A1A1A1',
    fontFamily: 'Unbounded-Medium',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 10,
  },

  // ... other existing styles ...
});

export default StaticHomeScreen;