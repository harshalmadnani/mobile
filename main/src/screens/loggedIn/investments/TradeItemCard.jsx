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
import {useDispatch} from 'react-redux';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false
};
import {useNavigation} from '@react-navigation/native';
const TradeItemCard = memo(({onlyMeta = false, item}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  return (
    <Pressable
      onPress={() => {
        navigation.navigate('MarketInfo', {item: item});
        if (Platform.OS === 'ios') {
      ReactNativeHapticFeedback.trigger("impactMedium", options);
    }
      }}
      style={{
        width: '100%',
        alignSelf: 'flex-start',
        paddingVertical: '2%',
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
            <FastImage
              style={{width: 42, height: 42, borderRadius: 250}}
              source={{
                uri: `${item.image || item.logo}`,
              }}
            />
          </View>

          <View style={{paddingHorizontal: 10}}>
            <View>
              <Text style={styles.text1}>{item.symbol.toUpperCase()}</Text>
            </View>
            <View>
              <Text style={styles.text2}>{item.name}</Text>
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
                $
                {item.current_price?.toLocaleString() ||
                  item.price?.toLocaleString()}
              </Text>
            </View>
            <View>
              {(item.price_change_24h >= 0 ||
                item.price_change_percentage_24h >= 0) && (
                <Text style={styles.text3}>
                  +{' '}
                  {item.price_change_percentage_24h?.toFixed(2) ||
                    item?.price_change_24h?.toFixed(2) ||
                    0.0}{' '}
                  %
                </Text>
              )}
              {(item.price_change_24h < 0 ||
                item.price_change_percentage_24h < 0) && (
                <Text style={styles.text4}>
                  {item.price_change_percentage_24h?.toFixed(2) ||
                    item?.price_change_24h?.toFixed(2) ||
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
