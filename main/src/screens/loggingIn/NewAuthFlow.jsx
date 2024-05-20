import React, {Component, useEffect, useState, useCallback, useRef} from 'react';
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
} from 'react-native';
import {Text} from '@rneui/themed';
import {Icon} from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';
import axios from 'axios';
import {getEvmAddresses} from '../../store/actions/portfolio';
import {
  signInWithEmailOtp,
  signUpWithEmail,
  verifyEmailOtp,
} from '../../utils/supabase/authUtils';
import {
  checkUserIsDFNSSignedUp,
  getDfnsJwt,
  registerUsernameToDFNS,
} from '../../utils/DFNS/registerFlow';
import {getScwAddress} from '../../utils/DFNS/walletFLow.js';
import AuthTextInput from '../../component/Input/AuthTextInputs';
const bg = require('../../../assets/bg.png');
const windowHeight = Dimensions.get('window').height;
import {useDispatch} from 'react-redux';
import {authActions} from '../../store/reducers/auth';
import {autoLogin} from '../../store/actions/auth';

const NewAuthLoginFLow = ({navigation, route}) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isError, setIsError] = useState(false);
  const [userInfo, setUserInfo] = useState(false);
  const [stages, setStages] = useState('email');
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const getHeadingOnStages = () => {
    switch (stages) {
      case 'email':
        return 'Get started with your email';
      case 'password':
        return 'Set up a strong password';
      case 'otp':
        return `Confirm the code`;
    }
  };
  const onPressBack = () => {
    switch (stages) {
      case 'email':
        navigation.navigate('LoggedOutHome');
      case 'password':
        setStages('email');
      case 'otp':
        setStages('email');
    }
  };
  const getSubHeadingOnStages = () => {
    switch (stages) {
      case 'email':
        return 'Enter your email address to sign in';
      case 'password':
        return 'You\'ll be able to use it to recover the access into your account';
      case 'otp':
        return 'Enter the confirmation code that we sent to ' + email;
    }
  };
  const validateEmail = email => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  };
  const validateSpecialCharacter = password => {
    return String(password)
      .toLowerCase()
      .match(/^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{6,}$/g);
  };
  const getConfirmationOnInput = () => {
    switch (stages) {
      case 'email':
        return validateEmail(email);
      case 'password':
        return (
          password === confirmPassword &&
          validateSpecialCharacter(password) &&
          password.length > 8
        );
      case 'otp':
        return otp.join('').length === 6;
    }
  };
  const getButtonTitle = () => {
    switch (stages) {
      case 'email':
        return 'Setup password';
      case 'password':
        return 'Send code';
      case 'otp':
        return 'Confirm code';
    }
  };
  const checkOnEmail = async () => {
    //check whether it's a user
    setLoading(true);
    const status = await checkUserIsDFNSSignedUp(email);
    if (status) {
      setIsLogin(true);
      dispatch(autoLogin(navigation, email));
      setLoading(false);
    } else {
      setStages('password');
      setLoading(false);
      setIsLogin(false);
    }
    // setStages('password');
  };
  const updateAccountInfoInRedux = async (email, response) => {
    try {
      const token = await getDfnsJwt(email);
      const scw = await getScwAddress(
        token,
        response?.wallets.filter(x => x.network === 'Polygon')?.[0]?.id,
      );
      console.log('redux update.....', scw, response?.wallets, email);
      dispatch(authActions.setEmail(email));
      dispatch(authActions.setDfnsToken(token));
      dispatch(authActions.setScw(scw));
      dispatch(authActions.setWallet(response?.wallets));
    } catch (error) {
      console.log('error on final login', error);
    }
  };
  const confirmOtp = async () => {
    // setLoading(true);
    const user = await verifyEmailOtp(otp.join(''), email);
    console.log('status from signup.....', user);
    if (user && !isLogin) {
      try {
        const response = await registerUsernameToDFNS(email);
        if (response) {
          await updateAccountInfoInRedux(email, response);
          navigation.navigate('EnterName');
        }
        // const scw = await getSmartAccountAddress(
        //   response?.wallets.filter(x => x.network === 'Polygon'),
        // );
        // console.log('redux setup signup', scw);
        // if (response) {
        //   navigation.navigate('EnterName');
        // }
      } catch (error) {
        console.log('error on signup....', error);
        setLoading(false);
      }
    }
  };

  const registerYourPassword = async () => {
    setLoading(true);
    const status = await signInWithEmailOtp(email, password);
    console.log('status from signup.....', status);
    if (status) {
      setLoading(false);
      // signInWithEmailOtp(email);
      setStages('otp');
    }
  };
  const SignupFlow = () =>
    stages === 'password' ? (
      <View>
        <View style={{marginTop: 16}}>
          <Text style={styles.subHeading}>{getSubHeadingOnStages()}</Text>
          <View style={{marginTop: 16}}>
            <AuthTextInput
              value={password}
              onChange={x => setPassword(x)}
              placeholder="Set up your new password"
              width={'100%'}
              isPassword={true}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 8,
            }}>
            <View
              style={{
                height: 10,
                width: 10,
                borderRadius: 10,
                borderWidth: password.length > 8 ? 0 : 1,
                borderColor: '#A6A6A6',
                backgroundColor: validateSpecialCharacter(password)
                  ? '#B0F291'
                  : 'transparent',
              }}></View>
            <Text
              style={[
                styles.passwordInstruction,
                {
                  color: validateSpecialCharacter(password)
                    ? '#B0F291'
                    : '#A6A6A6',
                },
              ]}>
              Include special characters or numbers
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
            }}>
            <View
              style={{
                height: 10,
                width: 10,
                borderRadius: 10,
                borderWidth: password.length > 8 ? 0 : 1,
                borderColor: '#A6A6A6',
                backgroundColor:
                  password.length > 8 ? '#B0F291' : 'transparent',
              }}></View>
            <Text
              style={[
                styles.passwordInstruction,
                {
                  color: password.length > 8 ? '#B0F291' : '#A6A6A6',
                },
              ]}>
              more than 8 characters
            </Text>
          </View>
        </View>
        <View style={{marginTop: 12}}>
          <AuthTextInput
            value={confirmPassword}
            onChange={x => setConfirmPassword(x)}
            placeholder="Confirm your new password"
            width={'100%'}
            isPassword={true}
          />
        </View>
      </View>
    ) : (
      <View>
        <Text style={styles.subHeading}>{getSubHeadingOnStages()}</Text>
        <View style={{marginTop: 16}}>
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                value={digit}
                onChangeText={text => {
                  const newOtp = [...otp];
                  newOtp[index] = text;
                  setOtp(newOtp);
                  if (text && index < 5) {
                    otpRefs.current[index + 1].focus();
                  }
                }}
                onKeyPress={e => {
                  if (e.nativeEvent.key === 'Backspace' && index > 0 && !otp[index]) {
                    otpRefs.current[index - 1].focus();
                  }
                }}
                style={styles.otpInput}
                keyboardType="numeric"
                maxLength={1}
                ref={ref => otpRefs.current[index] = ref}
              />
            ))}
          </View>
        </View>
      </View>
    );

  const otpRefs = useRef([]);

  return (
    <SafeAreaView style={styles.black}>
      <ImageBackground
        source={{ uri: 'https://res.cloudinary.com/xade-finance/image/upload/v1715937669/hg82c0askzxxrond4yrz.png' }}
        style={{width:'100%',flex:0,paddingVertical:'5%'}}
      >
        <View style={{marginLeft:'2%'}}>
        <MaterialIcons
          onPress={() => onPressBack()}
          name="arrow-back"
          color={'white'}
          size={24}
          
        />
        <Text style={styles.heading}>{getHeadingOnStages()}</Text>
        </View>
      </ImageBackground>
      <View style={styles.mainContent}>
        {stages === 'email' ? (
          <View>
            <Text style={styles.subHeading}>
              Enter your email address to sign in
            </Text>
            <View style={{marginTop: 16}}>
              <AuthTextInput
                value={email}
                onChange={x => setEmail(x.toLowerCase())}
                placeholder="Your email"
                width={'100%'}
              />
            </View>
          </View>
        ) : (
          !isLogin && <SignupFlow />
        )}
        <TouchableOpacity
          style={[
            styles.confirmButton,
            {backgroundColor: getConfirmationOnInput() ? '#FFFFFF' : '#1C1C1C'},
          ]}
          onPress={async () => {
            if (stages === 'email') {
              await checkOnEmail();
            } else if (stages === 'password') {
              await registerYourPassword();
            } else if (stages === 'otp') {
              await confirmOtp();
            }
          }}>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text
              style={[
                styles.confirmButtonTitle,
                {color: getConfirmationOnInput() ? '#0B0B0B' : '#4A4A4A'},
              ]}>
              {getButtonTitle()}
            </Text>
          )}
        </TouchableOpacity>
      </View>
      <ImageBackground
        source={{ uri: 'https://res.cloudinary.com/xade-finance/image/upload/v1716199179/k5bchkiquf3uzdawmdf1.png' }}
        style={styles.backgroundImage}
        resizeMode="contain"
      />
    </SafeAreaView>
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
    fontWeight: 700,
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
    marginTop:'6%'
  },
  passwordInstruction: {
    fontSize: 16,
    fontWeight: 400,
    lineHeight: 24,
    marginLeft: 12,
  },
  confirmButton: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonTitle: {
    // font-family: Sk-Modernist;
    fontSize: 16,
    fontWeight: 700,
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

export default NewAuthLoginFLow;





