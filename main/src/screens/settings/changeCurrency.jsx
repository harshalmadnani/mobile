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
import {useDispatch} from 'react-redux';
import {authActions} from '../../store/reducers/auth.js';
import {autoLogin} from '../../store/actions/auth.js';
import {Passkey} from 'react-native-passkey';
import Toast from 'react-native-root-toast';

const ChangeCurrency = ({navigation, route}) => {
  const [loading, setLoading] = useState(false);

  const [currency, setCurrency] = useState('the currency');
  const dispatch = useDispatch();

  const onPressBack = () => {
    navigation.navigate('Settings');
  };
  const getConfirmationOnInput = () => {
    return currency != 'the currency';
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
            <View style={{marginTop: 16}}></View>
          </View>

          <TouchableOpacity
            disabled={currency != 'the currency'}
            style={[
              styles.confirmButton,
              {
                backgroundColor: getConfirmationOnInput()
                  ? '#FFFFFF'
                  : '#1C1C1C',
              },
            ]}
            onPress={async () => {
              console.log('Dispatch action');
            }}>
            {loading ? (
              <ActivityIndicator />
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
    justifyContent: 'space-between',
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
});

export default ChangeCurrency;
