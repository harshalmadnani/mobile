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

const bg = require('../../../assets/bg.png');
const windowHeight = Dimensions.get('window').height;

const Name = ({navigation, route}) => {
  const [name, setName] = useState('');
  let code = route.params?.code;
  console.log('code.....', code);
  const registerDB = async ({navigation, name, code}) => {
    console.log('Here set name', name);
    console.log('Hereee', global.loginAccount);
    if (global.withAuth) {
      global.loginAccount.name = name;
      const address = global.loginAccount?.publicAddress;
      const scwAddress = global.loginAccount.scw;
      const email = global.loginAccount.phoneEmail;
      const uuid = global.loginAccount.uiud;

      let object;

      if (email.includes('@')) {
        object = {
          email: email.toLowerCase(),
          phone: 'NULL',
          name: name,
          typeOfLogin: 'auth',
          eoa: address.toLowerCase(),
          scw: scwAddress.toLowerCase(),
          id: uuid,
        };
      } else {
        object = {
          email: 'NULL',
          phone: email.toLowerCase(),
          name: name,
          typeOfLogin: 'auth',
          eoa: address.toLowerCase(),
          scw: scwAddress.toLowerCase(),
          id: uuid,
        };
      }
      console.log('New OBJ', object);
      const json = JSON.stringify(object || {}, null, 2);
      console.log('Request Being Sent:', json);
      console.log('New OBJ', {
        email: email,
        referalCode: code,
        evmSmartAccount: scwAddress,
        evmPublicAddress: address,
        points: 0,
      });

      try {
        await axios.post(
          'https://srjnswibpbnrjufgqbmq.supabase.co/rest/v1/users',
          {
            email: email,
            referalCode: code,
            evmSmartAccount: scwAddress,
            evmPublicAddress: address,
            points: 0,
            name: name,
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
        await fetch('https://mongo.api.xade.finance/polygon', {
          method: 'POST',
          body: json,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        dispatch(getEvmAddresses());
        navigation.push('Portfolio');
      } catch (error) {
        console.log(error?.response?.data);
      }
    } else {
      global.connectAccount.name = name;
      const address = global.connectAccount?.publicAddress;
      const email = global.connectAccount.phoneEmail;
      const uuid = global.connectAccount.uiud;

      console.log(email);
      try {
        const object = {
          email: email.toLowerCase(),
          phone: 'NULL',
          name: name,
          typeOfLogin: 'connect',
          eoa: address.toLowerCase(),
          scw: address.toLowerCase(),
          id: uuid,
        };
        const json = JSON.stringify(object || {}, null, 2);
        console.log('Request Being Sent:', json);

        await fetch('https://mongo.api.xade.finance/polygon', {
          method: 'POST',
          body: json,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        dispatch(getEvmAddresses());
        navigation.push('Portfolio');
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <View style={styles.black}>
      <ScrollView>
        <View style={styles.mainContent}>
          <View style={styles.mainPrompt}>
            <Text style={styles.mainText}>What shall we call{'\n'}you?</Text>
            <Text style={styles.subText}>Enter your name to continue</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              marginTop: '5%',
            }}>
            <FastImage
              style={styles.avatar}
              source={require('../../../assets/avatar.png')}
            />
            <FastImage
              style={styles.avatarSecondary}
              source={require('../../../assets/avatar2.png')}
            />
            <FastImage
              style={styles.avatarMain}
              source={require('../../../assets/avatar3.png')}
            />
            <FastImage
              style={styles.avatarSecondary}
              source={require('../../../assets/avatar4.png')}
            />
            <FastImage
              style={styles.avatar}
              source={require('../../../assets/avatar5.png')}
            />
          </View>
          <View style={styles.input}>
            <Text style={styles.inputText}>Username</Text>
            <TextInput
              style={styles.mainInput}
              placeholderTextColor={'grey'}
              placeholder={'Tap to add name'}
              value={name}
              onChangeText={newText => {
                setName(newText);
              }}
            />
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottom}>
        <TouchableOpacity
          onPress={() => {
            navigation.push('ReferralCode');
          }}>
          <Text
            style={{
              color: '#fff',
              fontFamily: 'EuclidCircularA-Regular',
              textAlign: 'center',
              fontSize: 20,
              paddingBottom: 10,
            }}>
            Have A Refer Code?
          </Text>
        </TouchableOpacity>
        <Text style={styles.tos}>
          By tapping the button(s) below, you agree to the{' '}
          <Text
            style={{color: '#fff', fontFamily: 'VelaSans-Bold'}}
            onPress={() => {
              Linking.openURL(`https://www.xade.finance/terms-of-service`);
            }}>
            Terms Of Service
          </Text>{' '}
          &
          <Text
            style={{color: '#fff', fontFamily: 'VelaSans-Bold'}}
            onPress={() => {
              Linking.openURL(`https://www.xade.finance/privacy-policy`);
            }}>
            {'\n'}Privacy Policy
          </Text>
        </Text>
        <TouchableOpacity
          style={styles.continue}
          onPress={async () => {
            navigation.navigate('Portfolio');
            await registerDB({navigation, name, code});
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

export default Name;
