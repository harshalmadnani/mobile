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
import {
  getScwAddress,
  getSmartAccountAddress,
} from '../../utils/DFNS/walletFLow';
import AuthTextInput from '../../component/Input/AuthTextInputs';
const bg = require('../../../assets/bg.png');
const windowHeight = Dimensions.get('window').height;
import {useDispatch} from 'react-redux';
import {authActions} from '../../store/reducers/auth';

const NewAuthLoginFLow = ({navigation, route}) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
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
        return 'Get started with email';
      case 'password':
        return 'Set up a strong password';
      case 'otp':
        return `Confirm`;
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
        return 'You’ll be able to use it to recover the access\nto your account ';
      case 'otp':
        return `Enter the confirmation code that we sent to ${email}`;
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
        return otp.length === 6;
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
      setLoading(false);
      setIsLogin(true);
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
      dispatch(authActions.setEmail(email));
      dispatch(authActions.setScw(scw));
      dispatch(authActions.setWallet(response?.wallets));
    } catch (error) {
      console.log('error on final login', error);
    }
  };
  const confirmOtp = async () => {
    // setLoading(true);
    const user = await verifyEmailOtp(otp, email);
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
                backgroundColor:
                  password.length > 8 ? '#B0F291' : 'transparent',
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
        <Text style={styles.subHeading}>{getHeadingOnStages()}</Text>
        <View style={{marginTop: 16}}>
          <AuthTextInput
            value={otp}
            onChange={x => setOtp(x)}
            placeholder="Your otp"
            width={'100%'}
          />
        </View>
      </View>
    );

  return (
    <SafeAreaView style={styles.black}>
      <View style={styles.topContent}>
        <MaterialIcons
          onPress={() => onPressBack()}
          name="arrow-back"
          color={'white'}
          size={24}
        />
        <Text style={styles.heading}>{getHeadingOnStages()}</Text>
      </View>
      <View style={styles.mainContent}>
        {stages === 'email' ? (
          <View>
            <Text style={styles.subHeading}>
              Enter your email address to sign in
            </Text>
            <View style={{marginTop: 16}}>
              <AuthTextInput
                value={email}
                onChange={x => setEmail(x)}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  black: {
    width: '100%',
    backgroundColor: '#0A0A0A',
    height: '100%',
  },
  topContent: {
    width: '100%',
    paddingHorizontal: 12,
    height: '20%',
    backgroundColor: '#161616',
    paddingTop: '16%',
  },
  heading: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 700,
    lineHeight: 28.8,
    marginTop: 8,
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
    marginTop: 12,
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
});

export default NewAuthLoginFLow;
