import React from 'react';

import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Vibration,
} from 'react-native';

import {Text} from 'react-native-elements';
import {Icon} from 'react-native-elements';
import {color} from 'react-native-elements/dist/helpers';
import LinearGradient from 'react-native-linear-gradient';

import FastImage from 'react-native-fast-image';
import SvgUri from 'react-native-svg-uri';
import CardSvg from './navbar-images/cards.svg';
import SaveSvg from './navbar-images/dollar-circle.svg';
import TradeSvg from './navbar-images/graph.svg';
import YoSvg from './navbar-images/yo.svg';
import RedeemSvg from './navbar-images/cards.svg';
import HomeSelectedNavIcon from './navbar-images/home-selected';
import HomeNavIcon from './navbar-images/home';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
const windowHeight = Dimensions.get('window').height;
const selectedIcon = '#ffffff';
const icon = '#696969';
const BottomNavbar = ({navigation, selected}) => {
  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };
  return (
    // <View style = {{height: windowHeight * 0.3}}>
    <View style={[styles.container, {paddingBottom: 0}]}>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-around',
        }}>
        <View style={styles.navItem}>
          <TouchableOpacity
            onPress={() => {
              if (Platform.OS === 'ios') {
                ReactNativeHapticFeedback.trigger('impactMedium', options);
              }
              navigation.push('Portfolio');
            }}>
            {selected == 'Portfolio' ? (
              <FastImage
                source={require(`./navbar-images/home-selected.png`)}
                style={styles.icon}
              />
            ) : (
              <FastImage
                source={require(`./navbar-images/home.png`)}
                style={styles.icon}
              />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.navItem}>
          <TouchableOpacity
            onPress={() => {
              if (Platform.OS === 'ios') {
                ReactNativeHapticFeedback.trigger('impactMedium', options);
              }
              navigation.push('AI');
            }}>
            {selected == 'AI' ? (
              <FastImage
                source={{
                  uri: 'https://res.cloudinary.com/xade-finance/image/upload/v1710402530/eyybhybbljzq9tvnfxqn.png'
                }}
                style={styles.icon}
              />
            ) : (
              <FastImage
                source={{
                  uri: 'https://res.cloudinary.com/xade-finance/image/upload/v1710402530/eyybhybbljzq9tvnfxqn.png'
                }}
                style={[styles.icon, {opacity: 0.5}]}
              />
            )}
          </TouchableOpacity>
        </View>

        <View>
          <TouchableOpacity
            onPress={() => {
              if (Platform.OS === 'ios') {
                ReactNativeHapticFeedback.trigger('impactMedium', options);
              }
              navigation.push('Investments');
            }}>
            {selected == 'Investments' ? (
              <FastImage
                source={require(`./navbar-images/markets-selected.png`)}
                style={styles.icon}
              />
            ) : (
              <FastImage
                source={require(`./navbar-images/markets.png`)}
                style={styles.icon}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* <View> */}
        {/* <TouchableOpacity onPress={() => navigation.push('TransactionHistory')}>
            <View style={styles.navItem}>
              <SvgUri
                width="28"
                height="28"
                svgXmlData={SaveSvg}
                fill={selected == 'TransactionHistory' ? selectedIcon : icon}
              />

              <Text style={selected == 'TransactionHistory' ? styles.navItemLabelSelected : styles.navItemLabel}>History</Text>
            </View>
          </TouchableOpacity> */}
        {/* <TouchableOpacity onPress={() => navigation.push('TransactionHistory')}>
            {selected == 'TransactionHistory' ? (
              <FastImage
                source={require(`./navbar-images/history-selected.png`)}
                style={styles.icon}
              />
            ) : (
              <FastImage
                source={require(`./navbar-images/history.png`)}
                style={styles.icon}
              />
            )}
            <Text style={selected == 'TransactionHistory' ? styles.navItemLabelSelected : styles.navItemLabel}>History</Text>
          </TouchableOpacity>
        </View> */}

        <View>
          <TouchableOpacity
            onPress={() => {
              if (Platform.OS === 'ios') {
                ReactNativeHapticFeedback.trigger('impactMedium', options);
              }
              navigation.push('Settings');
            }}>
            {selected == 'Settings' ? (
              <FastImage
                source={require(`./navbar-images/profile-selected.png`)}
                style={styles.icon}
              />
            ) : (
              <FastImage
                source={require(`./navbar-images/profile.png`)}
                style={styles.icon}
              />
            )}
          </TouchableOpacity>
        </View>
        {/*         
        <View style={styles.navItem}>
          <TouchableOpacity onPress={() => navigation.push('Redeem')}>
            <SvgUri
                width="28"
                height="28"
                svgXmlData={RedeemSvg}
                fill={selected == 'Redeem' ? selectedIcon : icon}
            />
            <Text style={selected == 'Redeem' ? styles.navItemLabelSelected : styles.navItemLabel}>Shop</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </View>
    // </View>
  );
};

const styles = StyleSheet.create({
  top: {
    height: 1,
  },
  container: {
    backgroundColor: 'rgba(0, 0, 0.1,0.7 )',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    position: 'absolute',
    height: 60,
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: '2%',
  },
  navItem: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: '#9D9D9D',
    width: 24,
    height: 24,
  },
  iconSelected: {
    color: '#FE2C5E',
    width: 28,
    height: 28,
  },
  cardIcon: {
    color: '#9D9D9D',
    width: 24,
    height: 18,
    marginVertical: 3,
  },
  navIconSelected: {
    color: '#fff',
    // color: '#FE2C5E',
    width: 24,
    height: 24,
  },
  navIcon: {
    color: '#696969',
    width: 28,
    height: 28,
  },
  navItemLabel: {
    color: '#696969',
    fontSize: 11,
    fontFamily: 'Satoshi-Bold',
    fontWeight: '700',
    paddingTop: 4,
  },
  navItemLabelSelected: {
    color: '#FFF',
    // color: '#A38CFF',
    fontSize: 11,
    fontFamily: 'Satoshi-Bold',
    fontWeight: '700',
    paddingTop: 4,
  },
});

export default BottomNavbar;
