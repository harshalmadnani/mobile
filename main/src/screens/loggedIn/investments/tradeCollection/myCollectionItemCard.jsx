import React, {useState, Component, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Icon} from 'react-native-elements';
import FastImage from 'react-native-fast-image';

const MyCollectionItemCard = ({navigation, item}) => {
  return (
    <TouchableOpacity
      onPress={e => {
        // navigation.push('MarketInfo');
      }}
      style={{
        width: '100%',
        alignSelf: 'flex-start',
        paddingVertical: '2%',
        // backgroundColor: 'red'
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
            // backgroundColor: 'red',
          }}>
          <View style={{paddingHorizontal: 10}}>
            <FastImage
              style={{width: 42, height: 42}}
              source={{
                uri: `${item.image}`,
              }}
            />
          </View>

          <View style={{paddingHorizontal: 10}}>
            <View>
              <Text style={styles.text1}>{item.symbol}</Text>
            </View>
            <View>
              <Text style={styles.text2}>{item.name}</Text>
            </View>
          </View>
        </View>

        <View
          style={{
            paddingHorizontal: 10,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-end',
            // backgroundColor: 'red'
          }}>
          <View>
            <Text style={styles.text1}>${item.current_price}</Text>
          </View>
          <View>
            {item.price_change_percentage_24h >= 0 && (
              <Text style={styles.text3}>
                {item?.price_change_percentage_24h?.toFixed(2)}
              </Text>
            )}
            {item.price_change_percentage_24h < 0 && (
              <Text style={styles.text4}>
                {item?.price_change_percentage_24h?.toFixed(2)} %
              </Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
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
  text1: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Satoshi-Bold',
    color: '#ffffff',
  },
  text2: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Satoshi-Regular',
    color: '#999999',
  },
  text3: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Satoshi-Bold',
    color: '#ADFF6C',
  },
  text4: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Satoshi-Bold',
    color: '#ff6c6c',
  },
});

export default MyCollectionItemCard;
