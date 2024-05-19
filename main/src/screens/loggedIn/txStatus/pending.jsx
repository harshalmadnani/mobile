import React, {useEffect, useState} from 'react';
import {View, Platform, ActivityIndicator} from 'react-native';
import {Text} from 'react-native-elements';
import Video from 'react-native-video';

// import {transferAnyTokenWithParticleAAGasless} from '../';
import {useSelector} from 'react-redux';
import {transferTokenGassless} from '../../../utils/DFNS/walletFLow.js';

let web3;
const successVideo = require('./pending.mp4');

const Component = ({route, navigation}) => {
  // Params
  let [status, setStatus] = useState('Processing Transaction...');
  const recipientAddress = useSelector(x => x.transfer.recipientAddress);
  const assetInfo = useSelector(x => x.transfer.assetInfo);
  const amount = useSelector(x => x.transfer.transferAmount);
  const dfnsToken = useSelector(x => x.auth.DFNSToken);
  const wallets = useSelector(x => x.auth.wallets);
  // const {emailAddress} = route.params;

  // console.log('Params:', route.params);

  // const weiVal = Web3.utils.toWei(amount.toString(), 'ether');

  useEffect(() => {
    const transaction = async () => {
      try {
        console.log(assetInfo);
        console.log(
          'Here....',
          dfnsToken,
          wallets?.filter(x => x.network === 'Polygon')[0]?.id,
          'wa-5l9lm-9l7gl-8p8psglcvh5jsdrm',
          137,
          assetInfo?.contracts_balances[0] ===
            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
            ? true
            : false,
          assetInfo?.contracts_balances[0]?.address,
          recipientAddress,
          amount,
        );
        const txnHash = await transferTokenGassless(
          dfnsToken,
          wallets?.filter(x => x.network === 'Polygon')[0]?.id,
          137,
          assetInfo?.contracts_balances[0] ===
            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
            ? true
            : false,
          assetInfo?.contracts_balances[0]?.address,
          recipientAddress,
          amount,
        );
        if (txnHash) {
          navigation.push('Successful', {
            status,
            type: 'v2',
            emailAddress: 's',
            recipientAddress,
            amount,
            fees: 0,
          });
        } else {
          navigation.push('Unsuccessful', {error: 0});
        }
      } catch (err) {
        console.log(err);
      }
    };
    transaction();
  }, []);

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        flex: 1,
      }}
      contentContainerStyle={{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View style={{width: '100%', marginTop: '5%'}}>
        <Video
          source={successVideo}
          style={{
            width: Platform.OS == 'ios' ? '100%' : '100%',
            height: Platform.OS == 'ios' ? 300 : 300,
          }}
          resizeMode={'cover'}
          controls={false}
          muted={true}
          repeat={true}
          ref={ref => {
            this.player = ref;
          }}
        />
      </View>
      <View
        style={{
          marginTop: '7%',
          marginLeft: '10%',
        }}>
        <Text
          style={{
            fontSize: 20,
            fontFamily: `EuclidCircularA-Regular`,
            color: '#898989',
          }}>
          Amount:{' '}
          <Text
            style={{
              fontSize: 20,
              fontFamily: `EuclidCircularA-Regular`,
              color: 'white',
            }}>
            {'\n' +
              amount /
                Math.pow(10, assetInfo?.contracts_balances[0]?.decimals) +
              ' '}
            {assetInfo?.asset?.symbol}
          </Text>
        </Text>
        <Text
          style={{
            fontSize: 20,
            fontFamily: `EuclidCircularA-Regular`,
            color: '#898989',
            marginTop: '5%',
          }}>
          Wallet address:{' '}
          <Text
            style={{
              fontSize: 20,
              fontFamily: `EuclidCircularA-Regular`,
              color: 'white',
            }}>
            {'\n' + recipientAddress.slice(0, 20)}...
          </Text>
        </Text>
        <Text
          style={{
            fontSize: 20,
            fontFamily: `EuclidCircularA-Regular`,
            color: '#898989',
            marginTop: '5%',
          }}>
          Transaction Type:{' '}
          <Text
            style={{
              fontSize: 20,
              fontFamily: `EuclidCircularA-Regular`,
              color: 'white',
            }}>
            {'\n'}
            {'RemmiteX V2'}
          </Text>
        </Text>
      </View>
      <View style={{marginTop: '20%'}}>
        <ActivityIndicator size={30} color="#fff" />
        <Text
          style={{
            fontSize: 20,
            fontFamily: `EuclidCircularA-Medium`,
            color: '#fff',
            textAlign: 'center',
            marginTop: '2%',
          }}>
          {status}
        </Text>
      </View>
    </View>
  );
};

export default Component;
