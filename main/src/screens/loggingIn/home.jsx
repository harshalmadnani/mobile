import React, {Component, useEffect, useRef} from 'react';
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
} from 'react-native';
import {Text} from '@rneui/themed';
import BouncyIcon from './BouncyIcon';
import {Icon} from 'react-native-elements';
// const Web3 = require('web3');
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
// import * as particleAuth from 'react-native-particle-auth';

import LinearGradient from 'react-native-linear-gradient';
const DEVICE_WIDTH = Dimensions.get('window').width;
import Clipboard from '@react-native-clipboard/clipboard';
import {useDispatch} from 'react-redux';
import {onAuthCoreLogin} from '../../store/actions/auth';

const windowHeight = Dimensions.get('window').height;

const images = [
  {
    name: `THE ULTIMATE${'\n'}TRADING ${'\n'} EXPERIENCE`,
    details: `Trade everything with aggregated ${'\n'}liqudity and advanced tools`,
    image:
      'https://res.cloudinary.com/xade-finance/image/upload/v1709711984/fmyptuhb2wi1yln7e9v4.png',
  },
  {
    name: `TRADE 10,000+ ${'\n'}MARKETS AT${'\n'}ONE PLACE `,
    details: `Trade stocks, crypto, commodities,${'\n'}forex & more at one place`,
    image:
      'https://res.cloudinary.com/xade-finance/image/upload/v1709734131/dmnvsv7hienduv5mkvqm.png',
  },
  {
    name: `OMNI-CHAIN${'\n'}LIQUIDITY ${'\n'} AGGREGATION`,
    details: `Get the best liquidity aggregated ${'\n'} across all chains and protocols`,
    image:
      'https://res.cloudinary.com/xade-finance/image/upload/v1709733466/keimprxade9tyockzicf.png',
  },
  {
    name: `O COMMISSION${'\n'}& INSTANT ${'\n'} SETTLEMENTS`,
    details: `Trade with <10s execution time in a${'\n'}gasless manner with 0 fees from Xade`,
    image:
      'https://res.cloudinary.com/xade-finance/image/upload/v1709737648/gvzbzieuat6wfi0o4gws.png',
  },
  {
    name: `ADVANCED AI${'\n'}POWERED ${'\n'} ANALYSIS TOOLS`,
    details: `Trade like a pro with advanced${'\n'} charts, news, research and Degen AI`,
    image:
      'https://res.cloudinary.com/xade-finance/image/upload/v1709733465/nairzdjcol25nu0kroh4.png',
  },
  {
    name: `500+ DEPOSIT${'\n'}& WITHDRAWAL ${'\n'} METHODS`,
    details: `Deposit or Withdraw funds${'\n'} seamlessly from 120+ countries`,
    image:
      'https://res.cloudinary.com/xade-finance/image/upload/v1709733554/je8eqvw76ea9tza6ncsx.png',
  },
];

const StaticHomeScreen = ({navigation}) => {
  const [selectedButton, setSelectedButton] = React.useState(
    `THE ULTIMATE${'\n'}TRADING ${'\n'} EXPERIENCE`,
  );
  const dispatch = useDispatch();
  useEffect(() => {
    i = 0;
    setInterval(() => {
      if (i < 4) {
        i += 1;
      } else {
        i = -1;
      }
      setSelectedButton(images[Math.abs(Math.ceil(i))].name);
    }, 3000);
  }, []);

  const handleSwipeUp = ({nativeEvent}) => {
    if (nativeEvent.oldState === State.BEGAN) {
      // Trigger haptic feedback
      const options = {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      };
      ReactNativeHapticFeedback.trigger('impactHeavy', options);
      navigation.navigate('NewAuthFlow');
      // dispatch(onAuthCoreLogin(navigation));
    }
  };
  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.bg}>
        <FlingGestureHandler
          direction={Directions.UP}
          onHandlerStateChange={handleSwipeUp}>
          <ScrollView>
            <View style={styles.container}>
              <View style={styles.topbar}>
                <View
                  style={
                    selectedButton == `Introducing a new${'\n'}era of finance`
                      ? styles.selected
                      : styles.carouselIndicator
                  }></View>
                <View
                  style={
                    selectedButton ==
                    `Pay globally with${'\n'}close to zero fees`
                      ? styles.selected
                      : styles.carouselIndicator
                  }></View>
                <View
                  style={
                    selectedButton == `Save with Xade to${'\n'}beat inflation`
                      ? styles.selected
                      : styles.carouselIndicator
                  }></View>
                <View
                  style={
                    selectedButton == `Trade anything${'\n'}with 10x leverage`
                      ? styles.selected
                      : styles.carouselIndicator
                  }></View>
                <View
                  style={
                    selectedButton == `Finance your loans${'\n'}fast and easily`
                      ? styles.selected
                      : styles.carouselIndicator
                  }></View>
              </View>
              <View style={styles.mainContent}>
                <LoginCarousel
                  images={images}
                  navigation={navigation}
                  address={'0x'}
                  key={images}
                />
                <View style={{marginTop: '0%'}}>
                  <BouncyIcon />
                  <Text style={styles.getStartedText}>
                    SWIPE UP TO GET STARTED
                  </Text>
                </View>

                {/* <TouchableOpacity onPress={() => navigation.push('ChooseConnect')}>
              <Text style={styles.connectText}>
                Have an existing wallet?{' '}
                <Text
                  style={
                    (styles.connectText,
                    {
                      textDecorationLine: 'underline',
                      color: '#fff',
                      fontFamily: `EuclidCircularA-Regular`,
                      fontSize: 15,
                      marginTop: '4%',
                      textAlign: 'center',
                    })
                  }>
                  Connect Wallet
                </Text>
              </Text>
            </TouchableOpacity> */}
              </View>
            </View>
          </ScrollView>
        </FlingGestureHandler>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  bg: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },

  container: {
    width: '100%',
    height: '100%',
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

  logo: {
    fontFamily: 'LemonMilk-Regular',
    color: '#fff',
    fontSize: 30,
    marginLeft: '8%',
    marginTop: '2%',
  },

  mainContent: {
    width: '100%',
    backgroundColor: 'transparent',
    marginTop: '15%',
  },

  mainText: {
    color: '#fff',
    fontFamily: 'VelaSans-Bold',
    fontSize: 54,
    width: '100%',
    marginTop: windowHeight / 8.0,
    marginLeft: '10%',
  },

  subText: {
    color: '#979797',
    fontFamily: 'NeueMontreal-Medium',
    fontSize: 16,
    width: '100%',
    marginLeft: '10%',
    marginTop: '12%',
  },

  button: {
    width: '75%',
    color: '#000',
    borderRadius: 15,
    marginLeft: '12%',
    marginTop: '15%',
    padding: '5%',
    backgroundColor: '#E8FF59',
    marginBottom: '1%',
  },

  buttonText: {
    color: '#000',
    fontFamily: `EuclidCircularA-Regular`,
    fontSize: 20,
    marginTop: '-11.7%',
    marginLeft: '2%',
  },

  buttonIcon: {
    marginLeft: '80%',
  },

  getStarted: {
    width: '80%',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 23,
    borderRadius: 6,
    marginTop: '2%',
  },

  getStartedText: {
    color: '#A1A1A1',
    fontFamily: `Unbounded-Medium`,
    textAlign: 'center',
    fontSize: 11,
    marginTop: '1%',
  },

  connectText: {
    color: '#fff',
    fontFamily: `EuclidCircularA-Regular`,
    fontSize: 15,
    textAlign: 'center',
    marginTop: '4%',
  },
});

export default StaticHomeScreen;
