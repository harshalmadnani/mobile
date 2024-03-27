import React from 'react';
import {
  TouchableOpacity,
  Dimensions,
  TextInput,
  TouchableHighlight,
  SafeAreaView,
  StyleSheet,
  View,
  Linking,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import {useState, useMemo, useEffect} from 'react';
import {Text} from '@rneui/themed';
import {POINTS_KEY} from '@env';
import {Icon} from 'react-native-elements';
import {FloatingLabelInput} from 'react-native-floating-label-input';

const width = Dimensions.get('window').width;

const ReferralCode = ({navigation}) => {
  const [submitText, setSubmitText] = useState('Apply');
  const [country, setCountry] = useState('1');
  const [text, setText] = useState('');

  const validateAddress = text => {
    const emailRegex = /^0x[a-fA-F0-9]{40}$/;
    return emailRegex.test(text);
  };

  const handleSubmit = async () => {
    // setSubmitText('Processing...');
    navigation.navigate('EnterName', {code: text});
  };
  return (
    <SafeAreaView
      style={{
        width: '100%',
        height: '100%',
        // justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <View
        style={{
          paddingHorizontal: 12,
          paddingVertical: 12,
          width: '100%',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <Icon
          name={'keyboard-backspace'}
          size={30}
          color={'#f0f0f0'}
          type="materialicons"
          onPress={() => navigation.goBack()}
        />
      </View>
      <View style={styles.container}>
        <Text
          style={{
            fontSize: 30,
            fontFamily: `Montreal-Medium`,
            color: 'white',
            letterSpacing: 0.5,
          }}>
          Enter Referral Code
        </Text>
        <View style={styles.enter}>
          <FloatingLabelInput
            label="Referral Code"
            value={text}
            showCaret
            onChangeText={newText => setText(newText.toUpperCase())}
            containerStyles={{
              borderWidth: 1,
              borderColor: '#3E3E3E',
              borderRadius: 5,
              paddingLeft: '3%',
              paddingRight: '1%',
              paddingTop: '5%',
              paddingBottom: '3%',
            }}
            customLabelStyles={{
              colorBlurred: '#fff',
              colorFocused: '#A4A4A4',
              fontSizeBlurred: 23,
              fontSizeFocused: 15,
              width: '100%',
            }}
            labelStyles={{
              fontFamily: `Montreal-Medium`,
              color: '#fff',
              fontSize: 17,
              width: '100%',
              paddingBottom: 2,
            }}
            inputStyles={{
              fontFamily: `Montreal-Medium`,
              width: '100%',
              color: 'white',
              fontSize: 25,
              paddingTop: 10,
            }}
          />
        </View>
        <TouchableOpacity style={styles.confirmButton} onPress={handleSubmit}>
          <Text
            style={{
              color: '#000',
              fontFamily: `Montreal-Medium`,
              fontSize: 18,
            }}>
            {submitText}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  enterAmount: {
    flexDirection: 'row',
  },

  dropdown: {
    margin: 10,
    backgroundColor: 'transparent',
    paddingHorizontal: 10,
  },

  imageStyle: {
    width: 30,
    height: 30,
    backgroundColor: '#232E34',
  },

  container: {
    width: '80%',
    height: '80%',
    marginTop: '10%',
    justifyContent: 'space-between',
  },

  enterAmount: {
    width: '80%',
    borderRadius: 40,
    height: 50,
    backgroundColor: '#232E34',
    flexDirection: 'row',
  },

  confirmButton: {
    width: '100%',
    marginBottom: '0%',
    alignItems: 'center',
    marginTop: '100%',
    height: 55,
    borderColor: 'white',
    borderWidth: 1,
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },

  sendMobile: {
    width: '100%',
    marginTop: '10%',
    marginBottom: 20,
    height: 55,
    borderColor: 'white',
    borderWidth: 1,
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },

  sendWallet: {
    width: '100%',
    height: 55,
    borderColor: 'white',
    borderWidth: 1,
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },

  enter: {
    marginTop: '10%',
  },

  subText: {
    marginTop: 15,
  },
});

export default ReferralCode;
