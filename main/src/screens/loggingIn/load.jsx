import React, {Component, useEffect, useState} from 'react';
import {
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  View,
  Dimensions,
  Button,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import {Text} from '@rneui/themed';

import {PNAccount} from '../../Models/PNAccount';

import AsyncStorage from '@react-native-async-storage/async-storage';

import TouchID from 'react-native-touch-id';

import 'react-native-get-random-values';
import '@ethersproject/shims';
import {ethers} from 'ethers';
import {err} from 'react-native-svg/lib/typescript/xml';
import {useDispatch, useSelector} from 'react-redux';
import {
  autoLogin,
  convertCurrency,
  onIsLoginCheckAuthCore,
  storeCountryCurrency,
} from '../../store/actions/auth';
import {authActions} from '../../store/reducers/auth';
import axios from 'axios';
var DeviceInfo = require('react-native-device-info');
import getCurrencyCode from './getCurrencyCode';

global.TextEncoder = require('text-encoding').TextEncoder;

// const optionalConfigObject = {
//   title: 'Authentication Required To Login',
//   sensorErrorDescription: 'Failed', // Android
//   fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
//   unifiedErrors: false, // use unified error messages (default false)
//   passcodeFallback: true, //
// };

const PreLoad = ({navigation}) => {
  const dispatch = useDispatch();
  const [loadingText, setLoadingText] = useState(
    'Prepare to enter a new era of finance...',
  );

  const getCountry = async () => {
    try {
      const ipRes = await axios.get('https://api.ipify.org?format=json');
      const ipAddress = ipRes.data.ip;

      console.log('IP PUBLIC ADDRESS =>', ipAddress);

      const response = await axios.get(
        `http://api.ipstack.com/${ipAddress}?access_key=5e8f2dab92e14daa9b485db62a28f128`,
      );

      //PAID
      // const response = {
      //   data: {
      //     ip: '182.28.399.235',
      //     type: 'ipv4',
      //     continent_code: 'AS',
      //     continent_name: 'Asia',
      //     country_code: 'IN',
      //     country_name: 'India',
      //     region_code: 'MH',
      //     region_name: 'Maharashtra',
      //     city: 'Kharghar',
      //     zip: '402710',
      //     latitude: 90.10090637207,
      //     longitude: 22.02279663085938,
      //     location: {
      //       geoname_id: 1260734,
      //       capital: 'New Delhi',
      //       languages: [
      //         {
      //           code: 'hi',
      //           name: 'Hindi',
      //           native: '\u0939\u093f\u0928\u094d\u0926\u0940',
      //         },
      //         {
      //           code: 'en',
      //           name: 'English',
      //           native: 'English',
      //         },
      //       ],
      //       country_flag: 'https://assets.ipstack.com/flags/in.svg',
      //       country_flag_emoji: '\ud83c\uddee\ud83c\uddf3',
      //       country_flag_emoji_unicode: 'U+1F1EE U+1F1F3',
      //       calling_code: '91',
      //       is_eu: false,
      //     },
      //     time_zone: {
      //       id: 'Asia/Kolkata',
      //       current_time: '2024-07-11T00:46:09+05:30',
      //       gmt_offset: 19600,
      //       code: 'IST',
      //       is_daylight_saving: false,
      //     },
      //     currency: {
      //       code: 'INR',
      //       name: 'Indian Rupee',
      //       plural: 'Indian rupees',
      //       symbol: 'Rs',
      //       symbol_native: '\u099f\u0995\u09be',
      //     },
      //     connection: {
      //       asn: 49769,
      //       isp: 'S-Vois',
      //     },
      //   },
      // };

      //HTTP

      // const response = {
      //   data: {
      //     ip: '180.48.257.235',
      //     type: 'ipv4',
      //     continent_code: 'AS',
      //     continent_name: 'Asia',
      //     country_code: 'IN',
      //     country_name: 'India',
      //     region_code: 'MH',
      //     region_name: 'Maharashtra',
      //     city: 'Kharghar',
      //     zip: '420410',
      //     latitude: 27.10460090637207,
      //     longitude: 92.02279663085938,
      //     location: {
      //       geoname_id: 1260434,
      //       capital: 'New Delhi',
      //       languages: [
      //         {
      //           code: 'hi',
      //           name: 'Hindi',
      //           native: '\u0939\u093f\u0928\u094d\u0926\u0940',
      //         },
      //         {
      //           code: 'en',
      //           name: 'English',
      //           native: 'English',
      //         },
      //       ],
      //       country_flag: 'https://assets.ipstack.com/flags/in.svg',
      //       country_flag_emoji: '\ud83c\uddee\ud83c\uddf3',
      //       country_flag_emoji_unicode: 'U+1F1EE U+1F1F3',
      //       calling_code: '91',
      //       is_eu: false,
      //     },
      //   },
      // };

      //Starter plan doesn't provide currency and https, only country name
      // const {country_name, currency, country_code} = response.data;
      // const {code, name, symbol} = currency;

      const {country_name, country_code} = response.data;
      const code = getCurrencyCode(country_code);
      const exRate = await convertCurrency(code); //has to be capital

      console.log(
        '!!!!!!!!!!!!!!!!!ex rate.............',
        country_name,
        code,
        //name,
        code,
        exRate,
        ipAddress,
        country_code,
      );
      dispatch(
        storeCountryCurrency(
          country_name,
          code,
          //  name,
          code,
          exRate,
          ipAddress,
          country_code,
        ),
      );
    } catch (err) {
      console.log('Error in getCountry.', err);
    }
  };

  const email = useSelector(state => state.auth.email);
  const isUsd = useSelector(state => state.auth.isUsd);
  console.log('here...start', email);
  console.log('isUsd:', isUsd);

  useEffect(() => {
    getCountry();
  }, []);

  useEffect(() => {
    async function preLoadLog() {
      if (email) {
        dispatch(autoLogin(navigation, email));
      } else {
        dispatch(authActions.setEmail(null));
        dispatch(authActions.setScw([]));
        dispatch(authActions.setWallet([]));
        navigation.push('LoggedOutHome');
      }
    }

    preLoadLog();
  }, [dispatch]);
  return (
    <View style={styles.black}>
      <Text style={styles.logo}>XADE</Text>
      <View
        style={{
          marginTop: '90%',
          justifyContent: 'center',
        }}>
        <ActivityIndicator size={30} style={styles.loader} color="#fff" />
        <Text style={styles.logging}>
          {'  '}
          {loadingText}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  black: {
    width: '100%',
    backgroundColor: '#0C0C0C',
    height: '100%',
  },

  logo: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: '63%',
    fontSize: 50,
    fontFamily: 'LemonMilk-Regular',
  },

  logging: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 18,
    marginTop: '5%',
    fontFamily: `EuclidCircularA-Medium`,
  },
});
export default PreLoad;
