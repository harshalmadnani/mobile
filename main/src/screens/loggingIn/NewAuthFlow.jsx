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
  Linking,
  Platform,
} from 'react-native';
import {Text} from '@rneui/themed';
import {Icon} from 'react-native-elements';

import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';
import axios from 'axios';
import {getEvmAddresses} from '../../store/actions/portfolio';
import {
  signInWithEmailOtp,
  signUpWithEmail,
  verifyEmailOtp,
} from '../../utils/supabase/authUtils';
import {registerUsernameToDFNS} from '../../utils/DFNS/registerFlow';
const bg = require('../../../assets/bg.png');
const windowHeight = Dimensions.get('window').height;

const NewAuthLoginFLow = ({navigation, route}) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isError, setIsError] = useState(false);
  const [userInfo, setUserInfo] = useState(false);
  return (
    <View style={styles.black}>
      <ScrollView>
        <View style={styles.mainContent}>
          <View style={styles.mainPrompt}>
            <Text style={styles.mainText}>What shall we call{'\n'}you?</Text>
            <Text style={styles.subText}>Enter your name to continue</Text>
          </View>

          <View style={styles.input}>
            <Text style={styles.inputText}>{otpSent ? 'Otp' : 'Email'}</Text>
            <TextInput
              style={styles.mainInput}
              placeholderTextColor={'grey'}
              placeholder={!otpSent ? 'Tap to add email' : 'Tap to add otp'}
              value={otpSent ? otp : email}
              onChangeText={newText => {
                otpSent ? setOtp(newText) : setEmail(newText);
              }}
            />
            {!otpSent && (
              <View>
                <Text style={[{...styles.inputText}, {marginTop: 12}]}>
                  Password
                </Text>
                <TextInput
                  style={styles.mainInput}
                  placeholderTextColor={'grey'}
                  secureTextEntry
                  placeholder={'Tap to add password'}
                  value={password}
                  onChangeText={newText => {
                    setPassword(newText);
                  }}
                />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottom}>
        <TouchableOpacity
          style={styles.continue}
          onPress={async e => {
            otpSent
              ? await verifyEmailOtp(
                  otp,
                  email,
                  () => setIsError(true),
                  session => setUserInfo(session),
                )
              : await signInWithEmailOtp(
                  email,
                  password,
                  () => setIsError(true),
                  () => setOtpSent(true),
                );
            console.log(userInfo, otpSent);
            if (otpSent) {
              const dfnsData = await registerUsernameToDFNS(e, email);
              console.log('user.....', dfnsData);
              //save email address
            }
            // console.log('otp status...', status);
            // navigation.navigate('Portfolio');
            // await registerDB({navigation, name, code});
          }}>
          <Text style={styles.continueText}>Let's go!</Text>
        </TouchableOpacity>
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

  mainContent: {
    width: '100%',
    marginTop: '15%',
  },

  mainPrompt: {
    marginLeft: '5%',
  },

  mainText: {
    color: '#fff',
    fontFamily: `EuclidCircularA-Regular`,
    fontSize: 35,
  },

  subText: {
    marginTop: '5%',
    color: '#D4D4D4',
    fontFamily: `EuclidCircularA-Medium`,
    fontSize: 17,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 100,
  },

  avatarSecondary: {
    width: 70,
    height: 70,
    borderRadius: 100,
  },

  avatarMain: {
    width: 90,
    height: 90,
    borderRadius: 100,
  },

  input: {
    marginLeft: '5%',
    width: '100%',
    marginTop: '10%',
  },

  inputText: {
    fontSize: 17,
    fontFamily: `EuclidCircularA-Medium`,
    color: '#D4D4D4',
  },

  mainInput: {
    fontSize: 30,
    marginTop: '3%',
    fontFamily: `EuclidCircularA-Regular`,
    color: '#D4D4D4',
  },

  tos: {
    color: '#B9B9B9',
    fontFamily: 'VelaSans-Bold',
    textAlign: 'center',
    fontSize: 10,
    marginTop: '8%',
  },

  bottom: {
    marginBottom: '15%',
  },

  continue: {
    width: '88%',
    marginLeft: '6%',
    backgroundColor: '#D4D4D4',
    paddingTop: '3.5%',
    paddingBottom: '3.5%',
    marginTop: '5%',
    borderRadius: 100,
  },

  continueText: {
    color: '#0C0C0C',
    fontFamily: `EuclidCircularA-Medium`,
    fontSize: 18,
    textAlign: 'center',
  },

  skip: {
    width: '88%',
    marginLeft: '6%',
    paddingTop: '3.5%',
    paddingBottom: '3.5%',
    marginTop: '2%',
    borderRadius: 100,
  },

  skipText: {
    color: '#F0F0F0',
    fontFamily: `EuclidCircularA-Medium`,
    fontSize: 18,
    textAlign: 'center',
  },
});

export default NewAuthLoginFLow;
