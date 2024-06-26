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
import {getEvmAddresses} from '../../store/actions/portfolio';
import {
  signInWithEmailOtp,
  signUpWithEmail,
  supabase,
  verifyEmailOtp,
} from '../../utils/supabase/authUtils';
import {
  checkUserIsDFNSSignedUp,
  getDfnsJwt,
  registerUsernameToDFNS,
} from '../../utils/DFNS/registerFlow';
import {getAllScwAddress, getScwAddress} from '../../utils/DFNS/walletFLow.js';
import AuthTextInput from '../../component/Input/AuthTextInputs';
const bg = require('../../../assets/bg.png');
const windowHeight = Dimensions.get('window').height;
import {useDispatch} from 'react-redux';
import {authActions} from '../../store/reducers/auth';
import {autoLogin} from '../../store/actions/auth';
import {Passkey} from 'react-native-passkey';
import Toast from 'react-native-root-toast';

const NewAuthLoginFLow = ({navigation, route}) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isError, setIsError] = useState(false);
  const [userInfo, setUserInfo] = useState(false);
  const [stages, setStages] = useState('email');
  const [isSignIn, setIsSignIn] = useState(false);
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
        return "You'll be able to use it to recover the access into your account";
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
        return 'Enter';
      case 'password':
        return 'Send code';
      case 'otp':
        return 'Confirm code';
    }
  };
  const checkOnEmail = async () => {
    //check whether it's a user
    const isSupported = Passkey.isSupported();
    if (isSupported) {
      setLoading(true);
      const status = await checkUserIsDFNSSignedUp(email);
      if (status && status !== 'no-passkey') {
        // setIsLogin(false);
        // const {error, data} = await supabase.auth.signInWithOtp({
        //   email: email,
        //   options: {
        //     // set this to false if you do not want the user to be automatically signed up
        //     shouldCreateUser: false,
        //   },
        // });
        // if (error) {
        //   setLoading(false);
        // }
        // if (data) {
        //   setStages('otp');
        //   setIsSignIn(true);
        // }
        // setLoading(false);
         dispatch(autoLogin(navigation, email));
      } else if (status && status === 'no-passkey') {
        console.log('register again!!!!!');
        const {error, data} = await supabase.auth.signInWithOtp({
          email: email,
          options: {
            shouldCreateUser: false,
          },
        });
        if (error) {
          setLoading(false);
        }
        if (data) {
          console.log('Otp sent successfully');
          setStages('otp');
          setLoading(false);
          setIsLogin(false);
        }
      } else {
        setStages('password');
        setLoading(false);
        setIsLogin(false);
      }
    } else {
      console.log('false.........no passkeys');
    }
  };
  const updateAccountInfoInRedux = async (email, response) => {
    try {
      const token = await getDfnsJwt(email);
      console.log('wallets created.....', response?.wallets);
      const scw = await getAllScwAddress(token, response?.wallets);
      dispatch(authActions.setEmail(email));
      dispatch(authActions.setDfnsToken(token));
      dispatch(authActions.setScw(scw));
      dispatch(authActions.setWallet(response?.wallets));
    } catch (error) {
      console.log('error on final login', error);
    }
  };
  const confirmOtp = async () => {
    setLoading(true);
    const user = await verifyEmailOtp(otp.join(''), email);
    if (isSignIn) {
      if (user) {
        dispatch(autoLogin(navigation, email));
      } else {
        Toast.show('OTP input is incorrect', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
        console.log('inside OTP fail', user, isSignIn);
        setLoading(false);
      }
    } else {
      if (user && !isLogin) {
        console.log('On final register');
        Toast.show('On final register', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
        try {
          const response = await registerUsernameToDFNS(email);
          if (response) {
            await updateAccountInfoInRedux(email, response);
            navigation.navigate('EnterName');
          }
        } catch (error) {
          console.log('error on signup....', error);
          Toast.show('Fail to fetch passkey', {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
          setLoading(false);
        }
      } else {
        Toast.show('OTP input is incorrect', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
        console.log('inside OTP fail', user, isSignIn);
        setLoading(false);
      }
    }
  };
  const registerDB = async () => {
    try {
      await axios.post(
        'https://srjnswibpbnrjufgqbmq.supabase.co/rest/v1/dfnsUsers',
        {
          email: email,
          referalCode: '',
          dfnsScw: [],
          dfnsWallet: [],
          points: 0,
          name: '',
          isDLNSignedUp: false,
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
      return true;
      // galaxy register
      // dispatch(authActions.setName(name));
      // await appendToGalaxeList(email);
      // navigation.push('Portfolio');
    } catch (err) {
      return false;
      // console.log('register final start', wallets, scw, email, err);
    }
  };
  const registerYourPassword = async () => {
    setLoading(true);
    const status = await signInWithEmailOtp(email, password);
    if (status) {
      setLoading(false);
      const res = await registerDB();
      if (res) {
        setStages('otp');
      }
    }
  };
  const signupFlow = () => {
    return (
      <View>
        {stages === 'password' ? (
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
                      if (
                        e.nativeEvent.key === 'Backspace' &&
                        index > 0 &&
                        !otp[index]
                      ) {
                        otpRefs.current[index - 1].focus();
                      }
                    }}
                    style={styles.otpInput}
                    keyboardType="numeric"
                    maxLength={1}
                    ref={ref => (otpRefs.current[index] = ref)}
                  />
                ))}
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  const otpRefs = useRef([]);

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
            !isLogin && signupFlow()
          )}
          <TouchableOpacity
            style={[
              styles.confirmButton,
              {
                backgroundColor: getConfirmationOnInput()
                  ? '#FFFFFF'
                  : '#1C1C1C',
              },
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

export default NewAuthLoginFLow;
