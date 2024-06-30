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
  onIsLoginCheckAuthCore,
  storeCountryCurrency,
} from '../../store/actions/auth';
import {authActions} from '../../store/reducers/auth';
import axios from 'axios';

var DeviceInfo = require('react-native-device-info');

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
      const response = await axios.get('https://ipapi.co/json');

      const {country_name, currency, currency_name} = await response.data;

      dispatch(storeCountryCurrency(country_name, currency, currency_name));
    } catch (err) {
      console.log('Error in getCountry.');
    }
  };

  const email = useSelector(state => state.auth.email);
  console.log('here...start', email);

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
    getCountry();
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
