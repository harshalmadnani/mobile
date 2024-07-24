import React, {
  Component,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import {
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  View,
  Dimensions,
  Button,
  Image,
  TextInput,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {Text} from '@rneui/themed';
import {Icon} from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';
import {getFlagImageSource} from './getFlag.js';
import axios from 'axios';
import {getEvmAddresses} from '../../store/actions/portfolio.js';
import {
  signInWithEmailOtp,
  signUpWithEmail,
  supabase,
  verifyEmailOtp,
} from '../../utils/supabase/authUtils.js';
import {
  checkUserIsDFNSSignedUp,
  getDfnsJwt,
  registerUsernameToDFNS,
} from '../../utils/DFNS/registerFlow.js';
import {getAllScwAddress, getScwAddress} from '../../utils/DFNS/walletFLow.js';
import AuthTextInput from '../../component/Input/AuthTextInputs.jsx';
const bg = require('../../../assets/bg.png');
const windowHeight = Dimensions.get('window').height;
import {useDispatch, useSelector} from 'react-redux';
import {authActions} from '../../store/reducers/auth.js';
import {
  autoLogin,
  convertCurrency,
  storeCountryCurrency,
} from '../../store/actions/auth.js';
import {Passkey} from 'react-native-passkey';
import Toast from 'react-native-root-toast';
import getCurrencyCode from '../loggingIn/getCurrencyCode.js';

const ChangeCurrency = ({navigation, route}) => {
  // const store_currency = useSelector(x => x.auth.currency);
  // const store_currency_name = useSelector(x => x.auth.currency_name);
  // const store_country = useSelector(x => x.auth.country);
  // const store_countryCode = useSelector(x => x.auth.countryCode);

  const [store_currency, setStoreCurrency] = useState(' ');
  const [store_currency_name, setStoreCurrencyName] = useState(' ');
  const [store_country, setStoreCountry] = useState(' ');
  const [store_countryCode, setStoreCountryCode] = useState(' ');

  const email = useSelector(x => x.auth.email);
  const BASE_CURRENCY = 'USD';
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [fetchingCountry, setFetchingCountry] = useState(false);

  const [currency, setCurrency] = useState('the currency');

  const onPressBack = () => {
    navigation.navigate('Settings');
  };
  const getConfirmationOnInput = () => {
    return currency != 'the currency';
  };

  useEffect(() => {
    getCountry();
  }, []);

  const onSubmit = async () => {
    if (currency != 'the currency') {
      setLoading(true);
      try {
        const ipRes = await axios.get('https://api.ipify.org?format=json');
        const ipAddress = ipRes.data.ip;
        await axios.patch(
          `https://srjnswibpbnrjufgqbmq.supabase.co/rest/v1/dfnsUsers?email=eq.${email}`,
          {
            isUsd: currency === BASE_CURRENCY,
          },
          {
            headers: {
              apiKey:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyam5zd2licGJucmp1ZmdxYm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEyOTE0NjgsImV4cCI6MjAyNjg2NzQ2OH0.w_WrPPnSX2j4tnAFxV1y2XnU0ffWpZkrkPLmNMsSmko',
              Authorization:
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyam5zd2licGJucmp1ZmdxYm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEyOTE0NjgsImV4cCI6MjAyNjg2NzQ2OH0.w_WrPPnSX2j4tnAFxV1y2XnU0ffWpZkrkPLmNMsSmko',
            },
          },
        );

        if (currency === 'USD') {
          dispatch(
            storeCountryCurrency(
              store_country,
              'USD',
              'USD',
              1,
              ipAddress,
              store_countryCode,
            ),
          );
          dispatch(authActions.setIsUsd(true));
        } else {
          const exRate = await convertCurrency(currency); //has to be capital
          console.log(
            'firedddd',
            store_country,
            store_currency,
            store_currency_name,
            exRate,
            ipAddress,
            store_countryCode,
          );
          dispatch(authActions.setIsUsd(false));
          dispatch(
            storeCountryCurrency(
              store_country,
              store_currency,
              store_currency_name,
              exRate,
              ipAddress,
              store_countryCode,
            ),
          );
        }
        setLoading(false);
        navigation.navigate('Portfolio');
        //  onPressBack();
      } catch (err) {
        console.log(
          'error submitting in supabase, from changeCurrency Screen',
          err,
        );
        setLoading(false);
      }
    }
  };
  const getCountry = async () => {
    try {
      setFetchingCountry(true);
      const ipRes = await axios.get('https://api.ipify.org?format=json');
      const ipAddress = ipRes.data.ip;

      console.log('IP PUBLIC ADDRESS =>', ipAddress);

      const response = await axios.get(
        `http://api.ipstack.com/${ipAddress}?access_key=5e8f2dab92e14daa9b485db62a28f128`,
      );

      const {country_name, country_code} = response.data;
      const code = getCurrencyCode(country_code);
      const exRate = await convertCurrency(code); //has to be capital

      console.log(
        '!from change currency page" ex rate.............',
        country_name,
        code,
        //name,
        code,
        exRate,
        ipAddress,
        country_code,
      );

      setStoreCurrencyName(code);
      setStoreCurrency(code);
      setStoreCountry(country_name);
      setStoreCountryCode(country_code);
      setFetchingCountry(false);
    } catch (err) {
      console.log('Error in getCountry.', err);
      setFetchingCountry(false);
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
      style={{padding: 8, flex: 1, backgroundColor: '#000'}}>
      <SafeAreaView style={styles.black}>
        <ImageBackground
          source={{
            uri: 'https://res.cloudinary.com/xade-finance/image/upload/v1715937669/hg82c0askzxxrond4yrz.png',
          }}
          style={{width: '100%', flex: 0, paddingVertical: '5%'}}>
          <View style={{marginLeft: '2%'}}>
            <MaterialIcons
              onPress={() => onPressBack()}
              name="arrow-back"
              color={'white'}
              size={24}
            />
            <Text style={styles.heading}>Choose the currency</Text>
          </View>
        </ImageBackground>
        <View style={styles.mainContent}>
          <View>
            <Text style={styles.subHeading}>
              Choose the currency you want to have your balance displayed in
            </Text>
          </View>

          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              marginTop: '5%',
            }}>
            <TouchableOpacity
              onPress={() => setCurrency(BASE_CURRENCY)}
              style={[
                styles.regionContainer,
                {borderColor: currency === BASE_CURRENCY ? '#ffffff' : '#000'},
              ]}>
              <Image
                source={{
                  uri: 'https://cdn.britannica.com/79/4479-050-6EF87027/flag-Stars-and-Stripes-May-1-1795.jpg',
                }}
                style={styles.image}
              />
              <Text style={styles.des}>{BASE_CURRENCY}</Text>
              <Text style={styles.subdes}>US Dollar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setCurrency(store_currency)}
              style={[
                styles.regionContainer,
                {
                  borderColor: currency === store_currency ? '#ffffff' : '#000',
                },
              ]}>
              <Image
                source={getFlagImageSource(store_countryCode)}
                style={styles.image}
              />
              <Text style={styles.des}>
                {store_currency === ' ' ? '...' : store_currency}
              </Text>
              <Text style={styles.subdes}>
                {store_country} {store_currency_name}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            disabled={currency === 'the currency' || loading === true}
            style={[
              styles.confirmButton,
              {
                backgroundColor: getConfirmationOnInput() ? '#fff' : '#1C1C1C',
              },
            ]}
            onPress={async () => {
              onSubmit();
            }}>
            {loading ? (
              <ActivityIndicator color={'#000'} />
            ) : (
              <Text
                style={[
                  styles.confirmButtonTitle,
                  {color: getConfirmationOnInput() ? '#0B0B0B' : '#4A4A4A'},
                ]}>
                {`Choose ${currency}`}
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <ImageBackground
          source={{
            uri: 'https://res.cloudinary.com/xade-finance/image/upload/v1716199179/k5bchkiquf3uzdawmdf1.png',
          }}
          style={styles.backgroundImage}
          resizeMode="contain"
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  black: {
    width: '100%',
    backgroundColor: '#000',
    height: '100%',
  },
  topContent: {
    width: '100%',
    paddingHorizontal: 12,
    height: '20%',
    backgroundColor: '#161616',
  },
  heading: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Sk-Modernist-Bold',
    lineHeight: 28.8,
    marginTop: '5%',
  },
  mainContent: {
    width: '100%',
    paddingHorizontal: 12,
    flex: 1,
  },
  subHeading: {
    color: '#A6A6A6',
    fontSize: 16,
    fontWeight: 400,
    lineHeight: 24,
    marginTop: '6%',
    fontFamily: 'Sk-Modernist-Regular',
  },
  passwordInstruction: {
    fontSize: 16,
    fontWeight: 400,
    lineHeight: 24,
    marginLeft: 12,
    fontFamily: 'Sk-Modernist-Regular',
  },
  confirmButton: {
    width: '100%',
    height: '10%',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
  },
  confirmButtonTitle: {
    fontFamily: 'Sk-Modernist-Bold',
    fontSize: 16,

    lineHeight: 19.2,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    backgroundColor: '#1C1C1C',
    fontFamily: 'Sk-Modernist-Bold',
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    borderRadius: 8,
  },
  button: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#000',
  },
  backgroundImage: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 300, // Increased height for a bigger image
    zIndex: -1, // Ensure background image is behind content
  },
  regionContainer: {
    width: '45%',
    alignItems: 'center',
    backgroundColor: '#1d1d1d', // Background color of the item
    borderRadius: 20, // Rounded corners
    paddingHorizontal: 15, // Padding inside the item
    paddingVertical: '10%',
    justifyContent: 'center',
    elevation: 2, // Elevation for Android shadow
    shadowColor: '#000', // Shadow color for iOS shadow
    shadowOffset: {width: 0, height: 2}, // Shadow offset for iOS shadow
    shadowOpacity: 0.2, // Shadow opacity for iOS shadow
    shadowRadius: 2, // Shadow radius for iOS shadow,
    borderWidth: 1,
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 100,
    alignSelf: 'center',
  },

  des: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    fontFamily: 'NeueMontreal-Medium',
    marginTop: '10%',
    textAlign: 'center',
    maxWidth: '100%', // Adjust maximum width as needed
  },
  subdes: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
    fontFamily: 'NeueMontreal-Light',
    marginTop: 10,
    textAlign: 'center',
    maxWidth: '100%', // Adjust maximum width as needed
  },
});

export default ChangeCurrency;
