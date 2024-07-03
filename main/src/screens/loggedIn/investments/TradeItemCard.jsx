import React, {useState, Component, useEffect, memo} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {Icon} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import MarketInfo from './marketInfo';
import {useDispatch, useSelector} from 'react-redux';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { getCurrencyIcon } from '../../../utils/currencyicon';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};
import {useNavigation} from '@react-navigation/native';
import {SvgUri} from 'react-native-svg';
import {marketsAction} from '../../../store/reducers/market';
const TradeItemCard = memo(({onlyMeta = false, item}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isUsd = useSelector(x => x.auth.isUsd);
  const exchRate = useSelector(x => x.auth.exchRate);
  const currency_name = useSelector(x => x.auth.currency);
  const currency_icon = getCurrencyIcon(currency_name);

  return (
    <Pressable
      onPress={() => {
        if (item?.stock) {
          dispatch(marketsAction.setStockTradeMode(true));
          console.log('Entering... stock mode');
        } else {
          dispatch(marketsAction.setStockTradeMode(false));
        }
        navigation.navigate('MarketInfo', {item: item});
        if (Platform.OS === 'ios') {
          ReactNativeHapticFeedback.trigger('impactMedium', options);
        }
      }}
      style={{
        width: '100%',
        alignSelf: 'flex-start',
        paddingVertical: '2%',
        // paddingHorizontal: '1%',
      }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginHorizontal: 10,
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{paddingHorizontal: 10}}>
            {item?.stock?.logo_url?.includes('svg') ||
            item?.token?.image_url?.includes('svg') ? (
              <View
                style={{
                  width: 42,
                  height: 42,
                  backgroundColor: 'white',
                  borderRadius: 250,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <SvgUri
                  width="26"
                  height="26"
                  uri={item?.stock?.logo_url || item?.token?.image_url}
                />
              </View>
            ) : (
              <FastImage
                style={{width: 42, height: 42, borderRadius: 250}}
                source={{
                  uri: `${
                    item?.image ||
                    item?.logo ||
                    item?.stock?.logo_url ||
                    item?.token?.image_url
                  }`,
                }}
              />
            )}
          </View>

          <View style={{paddingHorizontal: 10}}>
            <View>
              <Text style={styles.text1}>
                {item?.symbol?.toUpperCase() ||
                  item?.stock?.symbol?.toUpperCase()}
              </Text>
            </View>
            <View>
              <Text numberOfLines={1} style={[styles.text2, {width: 100}]}>
                {item?.name || item?.stock?.name}
              </Text>
            </View>
          </View>
        </View>

        {!onlyMeta && (
          <View
            style={{
              paddingHorizontal: 10,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}>
            <View>
              <Text style={styles.text1}>
                {isUsd ? `$` : `${currency_icon}`}
                {item?.price
                  ? (isUsd
                      ? parseFloat(item?.price)
                      : parseFloat(item?.price) * exchRate
                    )?.toLocaleString()
                  : (isUsd
                      ? item?.priceInfo?.price
                      : item?.priceInfo?.price * exchRate
                    )?.toLocaleString()}
              </Text>
            </View>
            <View>
              {(item?.price_change_24h >= 0 ||
                item?.price_change_percentage_24h >= 0 ||
                item?.priceInfo?.change_percent >= 0) && (
                <Text style={styles.text3}>
                  +{' '}
                  {item?.price_change_percentage_24h?.toFixed(2) ||
                    item?.price_change_24h?.toFixed(2) ||
                    item?.priceInfo?.change_percent?.toFixed(2) ||
                    0.0}{' '}
                  %
                </Text>
              )}
              {(item?.price_change_24h < 0 ||
                item?.price_change_percentage_24h < 0 ||
                item?.priceInfo?.change_percent < 0) && (
                <Text style={styles.text4}>
                  {item?.price_change_percentage_24h?.toFixed(2) ||
                    item?.price_change_24h?.toFixed(2) ||
                    item?.priceInfo?.change_percent?.toFixed(2) ||
                    0.0}{' '}
                  %
                </Text>
              )}
            </View>
          </View>
        )}
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    color: '#ffffff',
    fontFamily: `Satoshi-Bold`,
    fontWeight: '500',
    marginLeft: 30,
  },
  text1: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Unbounded-Bold',
    color: '#ffffff',
  },
  text2: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Satoshi-Regular',
    color: '#999999',
  },
  text3: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Unbounded-Bold',
    color: '#ADFF6C',
  },
  text4: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Unbounded-Bold',
    color: '#ff6c6c',
  },
});

export default TradeItemCard;
