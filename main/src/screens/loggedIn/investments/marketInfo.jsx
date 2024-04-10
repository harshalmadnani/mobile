import React, {useState, Component, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import MarketChart from './marketInfo/MarketChart';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector} from 'react-redux';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {
  checkKYCAvailableOrNotForDinari,
  requestKYCWalletSignatureForDinari,
} from '../../../utils/Dinari/DinariApi';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};
const MarketInfo = ({route, navigation, item}) => {
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  const evmInfo = useSelector(x => x.portfolio.evmInfo);
  const holdings = useSelector(x => x.portfolio.holdings);
  let currentAsset;
  const isStockTrade = useSelector(x => x.market.isStockTrade);
  if (!isStockTrade) {
    currentAsset = holdings?.assets?.filter(
      x => x.asset?.symbol?.toLowerCase() === item?.symbol?.toLowerCase(),
    );
  }
  return (
    <SafeAreaView
      style={{
        width: width,
        height: height,
        alignSelf: 'flex-start',
      }}>
      <ScrollView
        scrollEnabled
        style={{
          marginTop: '10%',
        }}>
        <View>
          <MarketChart item={item} scwAddress={evmInfo?.smartAccount} />
        </View>
      </ScrollView>

      <TouchableOpacity
        style={{
          flexDirection: 'row',
          height: 52,
          width: '100%',
          borderRadius: 6,
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          marginTop: '30%',
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? '10%' : '2%',
          shadowColor: '#000', // Adjust the bottom spacing as needed
          left: 0,
          right: 0,
        }}
        onPress={async () => {
          if (Platform.OS === 'ios') {
            ReactNativeHapticFeedback.trigger('impactMedium', options);
          }
          if (!isStockTrade) {
            navigation.navigate('TradePage', {
              state: item,
              asset: currentAsset,
            });
          } else {
            // navigation.navigate('TradePage', {
            //   state: item,
            //   asset: [],
            // });
            const status = await checkKYCAvailableOrNotForDinari(
              evmInfo?.address,
            );
            console.log('kyc status', status);
            if (status === 'PASS' && status) {
              navigation.navigate('TradePage', {
                state: item,
                asset: [],
              });
            } else {
              const url = await requestKYCWalletSignatureForDinari(
                evmInfo?.address,
              );
              if (url) {
                console.log('redirecting url kyc message......', url);
                navigation.navigate('DinariKycWebview', {
                  url,
                  address: evmInfo?.address,
                });
              }
            }
          }
        }}>
        <LinearGradient
          useAngle={true}
          angle={150}
          colors={['#fff', '#fff']}
          style={{
            width: '100%',
            borderRadius: 100,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: '#000',
              fontSize: 14,
              fontFamily: 'Unbounded-ExtraBold',
            }}>
            TRADE{' '}
            {item?.stock?.symbol.toUpperCase() ?? item?.symbol?.toUpperCase()}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    color: '#ffffff',
    fontFamily: `Satoshi-Bold`,
    fontWeight: '500',
    marginLeft: 30,
  },
  depWith: {
    flexDirection: 'row',
    height: '100%',
    width: '47%',
    borderRadius: 6,
  },

  innerDepColored: {
    backgroundColor: '#1D1D1D',
  },

  innerDep: {
    width: '100%',
    flexDirection: 'row',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '1%',
    // backgroundColor: '#141414',
  },
});

export default MarketInfo;
