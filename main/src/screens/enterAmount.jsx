import React, {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  Dimensions,
  ScrollView,
} from 'react-native';
// import * as particleAuth from 'react-native-particle-auth';
import {enableScreens} from 'react-native-screens';
import {Icon} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import createProvider from '../particle-auth';
import {useDispatch, useSelector} from 'react-redux';
import {transferAction} from '../store/reducers/transfer';

const buttons = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['.', '0', '⌫'],
];

let web3;

const width = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function renderButtons() {
  return buttons.map((row, i) => {
    return (
      <View key={`row-${i}`} style={styles.row}>
        {row.map(button => {
          return (
            <TouchableOpacity key={`button-${button}`} style={styles.button}>
              <Text style={styles.buttonText}>{button}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  });
}
export default function EnterAmountComponent({navigation, route}) {
  let params = route.params;
  let [amount, setAmount] = React.useState('0');
  let [name, setName] = React.useState('Unregistered User');
  const json = {mobileNumber: 0, emailAddress: 0, walletAddress: 0, ...params};
  const recipientAddress = useSelector(x => x.transfer.recipientAddress);
  const assetInfo = useSelector(x => x.transfer.assetInfo);
  const dispatch = useDispatch();
  function handleButtonPress(button) {
    if (button !== '' && button !== '⌫' && button !== '.') {
      if (amount != '0') setAmount(amount + button);
      else setAmount(button);
    } else if (button === '⌫') {
      setAmount(amount.slice(0, -1));
    } else if (button === '.') {
      if (!amount.includes('.')) setAmount(amount + '.');
    }
  }

  // useEffect(() => {
  //   if (route.params.type == 'email') {
  //     fetch(
  //       `https://user.api.xade.finance/polygon?address=${route.params.walletAddress?.toLowerCase()}`,
  //       {
  //         method: 'GET',
  //       },
  //     )
  //       .then(response => {
  //         if (response.status == 200) {
  //           console.log(response);
  //           return response.text();
  //         } else return '';
  //       })
  //       .then(data => {
  //         setName(data);
  //       });
  //   }

  //   if (route.params.type == 'wallet') {
  //     route.params.emailAddress = 'Not Set';
  //   }

  //   calculateGas();
  // }, []);

  return (
    <SafeAreaView
      style={{
        width: '100%',
        height: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <View
        style={{
          top: '1%',
          width: width * 0.8,
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
            fontFamily: `EuclidCircularA-Regular`,
            color: 'white',
            letterSpacing: 0.5,
          }}>
          Transfer
        </Text>
        <View style={styles.send}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: `EuclidCircularA-Regular`,
              color: 'white',
            }}>
            Send to
          </Text>
          <View style={styles.details}>
            <FastImage
              style={{width: 50, height: 50}}
              source={{
                uri: `https://ui-avatars.com/api/?name=${name}&format=png&rounded=true&bold=true&background=FFF&color=0C0C0C`,
              }}
            />
            <View style={{width: '80%', marginLeft: '0%'}}>
              <Text
                style={{
                  color: 'white',
                  fontSize: route.params.type == 'email' ? 25 : 18,
                  fontFamily: `EuclidCircularA-Regular`,
                }}>
                {route.params.type == 'email'
                  ? name
                  : route.params.emailAddress}
              </Text>
              <Text
                style={{
                  color: '#A4A4A4',
                  fontFamily: `EuclidCircularA-Regular`,
                  fontSize: 13,
                }}>
                {route.params.type == 'email'
                  ? route.params.emailAddress
                  : name}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.enterAmount}>
          <Text
            style={{
              fontSize: 22,
              fontFamily: `EuclidCircularA-Regular`,
              color: 'white',
            }}>
            Enter amount
          </Text>
        </View>
        <View style={styles.amountInfo}>
          <View style={styles.amount}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                textAlign: 'center',
                alignItems: 'center',
              }}>
              {/* <Text
                style={{
                  fontSize: 35,
                  color: 'white',
                  fontFamily: `EuclidCircularA-Regular`,
                  textAlign: 'center',
                }}>
                $
              </Text> */}
              <Text
                style={{
                  fontSize: 40,
                  color: 'white',
                  fontFamily: `EuclidCircularA-Regular`,
                  textAlign: 'center',
                }}>
                {amount}
              </Text>
            </View>
          </View>
          <View>
            <Text
              style={{
                marginTop: '2%',
                fontSize: 20,
                fontFamily: `EuclidCircularA-Regular`,
                color: 'white',
              }}>
              {assetInfo?.asset?.symbol}
            </Text>
          </View>
        </View>
        <View style={styles.extradeets}>
          <Text
            style={{
              fontSize: 15,
              fontFamily: `EuclidCircularA-Regular`,
              color: '#898989',
            }}>
            Token Balance:{' '}
            <Text
              style={{
                fontSize: 15,
                fontFamily: `EuclidCircularA-Regular`,
                color: 'white',
              }}>
              {assetInfo?.token_balance}
            </Text>
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontFamily: `EuclidCircularA-Regular`,
              color: '#898989',
            }}>
            Wallet address:{' '}
            <Text
              style={{
                fontSize: 15,
                fontFamily: `EuclidCircularA-Regular`,
                color: 'white',
              }}>
              {route.params.walletAddress.slice(0, 20)}...
            </Text>
          </Text>
        </View>
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '10%',
          }}>
          {buttons.map((row, i) => {
            return (
              <View key={`row-${i}`} style={styles.row}>
                {row.map(button => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        handleButtonPress(button);
                      }}
                      key={`button-${button}`}
                      style={styles.button}>
                      <Text style={styles.buttonText}>{button}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            );
          })}
          <TouchableOpacity
            onPress={() => {
              if (
                amount !== '' &&
                amount != '0' &&
                parseFloat(amount) < parseFloat(assetInfo?.token_balance)
              ) {
                console.log(assetInfo?.contracts_balances);
                console.log(
                  'amount to be sent....',
                  parseFloat(amount) *
                    Math.pow(10, assetInfo?.contracts_balances[0]?.decimals),
                );
                dispatch(
                  transferAction.setTransferAmount(
                    parseFloat(amount) *
                      Math.pow(10, assetInfo?.contracts_balances[0]?.decimals),
                  ),
                );
                navigation.navigate('Pending');
              }
            }}
            style={styles.confirmButton}>
            <Text
              style={{
                color: '#000',
                fontFamily: `EuclidCircularA-Medium`,
                fontSize: 18,
              }}>
              Send money
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flex: 1,
    width: '85%',
    marginTop: '5%',
    height: windowHeight,
  },
  send: {
    marginTop: '10%',
  },
  details: {
    marginTop: '3%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  enterAmount: {
    marginTop: '12%',
  },
  amount: {
    alignItems: 'center',
  },
  amountInfo: {
    width: '100%',
    marginTop: '3%',
    flexDirection: 'row',
    paddingBottom: 5,
    justifyContent: 'space-between',
    alignItems: 'baseline',
    borderBottomWidth: 1,
    borderBottomColor: '#727272',
  },
  row: {
    flexDirection: 'row',
    borderColor: 'grey',
  },
  button: {
    width: 90,
    height: 65,
    borderRadius: 25,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 25,
    fontFamily: `EuclidCircular${Platform.OS === 'ios' ? 'A' : ''}-Medium`,
  },
  confirmButton: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
    height: 55,
    borderWidth: 1,
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: '#F0F0F0',
  },
  extradeets: {
    marginTop: '7%',
  },
});
