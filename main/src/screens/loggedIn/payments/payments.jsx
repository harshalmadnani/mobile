import React, {useState, Component} from 'react';
import {
  TouchableOpacity,
  TouchableHighlight,
  SafeAreaView,
  View,
  Image,
  ScrollView,
  Clipboard,
  Alert,
  Modal,
  Linking,
  Dimensions,
  RefreshControl,
  Platform,
  StyleSheet,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Text} from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';
import styles from './payments-styles';
import {Icon} from 'react-native-elements';
import {useEffect} from 'react';
// import * as particleAuth from 'react-native-particle-auth';
// import * as particleConnect from 'react-native-particle-connect';
import createProvider from '../../../particle-auth';
import getOnlyProvider from '../../../particle-auth';
import createConnectProvider from '../../../particle-connect';
import {EventsCarousel} from './eventsCarousel';
import TradeCollection from '../investments/tradeCollection';
import Ramper from './Ramps/ramper';
import {BreakdownCarousel} from './breakdownCarousel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import XUSD_ABI from './XUSD';
import USDC_ABI from './USDC';
import {SABEX_LP} from '@env';

import {
  BICONOMY_API_KEY,
  BICONOMY_API_KEY_MUMBAI,
  SECRET_KEY_REMMITEX,
} from '@env';
import {paymentsLoad, addXUSD, txHistoryLoad} from './utils';
// const Web3 = require('web3');

import 'react-native-get-random-values';

import '@ethersproject/shims';

import {ethers} from 'ethers';

import {transferUSDC} from './remmitexv1';

import images from './img/images';
import breakdowns from './breakdown/breakdown';

// let web3;
const REMMITEX_CONTRACT = '0xf1Ff5c85df29f573003328c783b8c6f8cC326EB7';
const windowHeight = Dimensions.get('window').height;
import {POLYGON_API_KEY} from '@env';
import {registerFcmToken} from '../../../utils/push';
import TransactionReceipt from '../transactions/transactionReceipt';
import Snackbar from 'react-native-snackbar';
import ExternalLinkModal from '../externalLink/widget';
import {useDispatch, useSelector} from 'react-redux';
// import {LoginType} from '@particle-network/rn-auth';
// import {getAuthCoreProvider} from '../../../utils/particleCoreSDK';
import {useFocusEffect} from '@react-navigation/native';
import {getCryptoHoldingForAddressFromMobula} from '../../../store/actions/portfolio';
import {marketSlice, marketsAction} from '../../../store/reducers/market';
import {getCurrencyIcon} from '../../../utils/currencyicon';
const contractAddress = '0xA3C957f5119eF3304c69dBB61d878798B3F239D9';
const usdcAddress = '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359';

// import {transferUSDC} from './remmitexv1';

const PaymentsComponent = ({navigation}) => {
  const isUsd = useSelector(x => x.auth.isUsd);
  const exchRate = useSelector(x => x.auth.exchRate);
  const currency_name = useSelector(x => x.auth.currency);

  const [state, setState] = React.useState([
    {
      truth: true,
      to: 'Loading',
      from: 'Loading',
      value: 0,
      hash: '',
      date: 'Loading',
      time: 'Loading...',
      month: 'Loading...',
    },
  ]);
  const [dates, setDates] = React.useState([]);
  // const [address, setAddress] = useState('0x');
  const dispatch = useDispatch();
  const [balance, setBalance] = useState('0');
  const [transactionVisible, setTransactionVisible] = useState(false);
  const DEVICE_WIDTH = Dimensions.get('window').width;
  const address = useSelector(x => x.auth.address);
  const mainnet = useSelector(x => x.auth.mainnet);
  const nfts = useSelector(x => x.portfolio.nfts);
  // const web3 = getAuthCoreProvider(LoginType.Email);

  const [showTxnReceiptModal, setShowTxnReceiptModal] = useState(false);
  const [transactionData, setTransactionData] = useState();

  const [currency, setCurrency] = useState(' ');
  const handleCloseTransactionReceiptModal = () => {
    setShowTxnReceiptModal(false);
  };
  const call = async () => {
    //   console.log('Auth Type....', address, global.withAuth);
    //   // dispatch(getCryptoHoldingForAddressFromMobula());
    //   const {tokenBalance} = await paymentsLoad(web3, mainnet, address);
    //   dispatch(marketsAction.setTokenUsdcBalance(tokenBalance));
    //   console.log('token balance.....', tokenBalance);
    //   setBalance(tokenBalance || '0.00');
    //   const {txDates, txs} = await txHistoryLoad(address);
    //   console.log('txdatess balance.....', txs, txDates);
    //   setDates(txDates);
    //   setState(txs);
    //   console.log('Request being sent for registration');
    //   await registerFcmToken(global.withAuth ? global.loginAccount.scw : address);
    //   console.log('Smart Account Needs To Be Loaded:', !global.smartAccount);

    //   if (global.withAuth) {
    //     if (!global.smartAccount) {
    //       let options = {
    //         activeNetworkId: mainnet
    //           ? ChainId.POLYGON_MAINNET
    //           : ChainId.POLYGON_MUMBAI,
    //         supportedNetworksIds: [
    //           ChainId.POLYGON_MAINNET,
    //           ChainId.POLYGON_MUMBAI,
    //         ],

    //         networkConfig: [
    //           {
    //             chainId: ChainId.POLYGON_MAINNET,
    //             dappAPIKey: BICONOMY_API_KEY,
    //           },
    //           {
    //             chainId: ChainId.POLYGON_MUMBAI,
    //             dappAPIKey: BICONOMY_API_KEY_MUMBAI,
    //           },
    //         ],
    //       };
    //       // const particleProvider = this.getOnlyProvider();
    //       // const provider = new ethers.providers.Web3Provider(
    //       //   particleProvider,
    //       //   'any',
    //       // );

    //       // let smartAccount = new SmartAccount(provider, options);
    //       // smartAccount = await smartAccount.init();
    //       // global.smartAccount = smartAccount;
    //     }
    //   }
    // };
    // useFocusEffect(async () => {
    //   console.log('Is Auth:', global.withAuth);
    //   await call();
    // }, []);
    useFocusEffect(
      React.useCallback(() => {
        let curr = getCurrencyIcon(currency_name);
        setCurrency(curr);
        call();
        // Cleanup function (optional)
        return () => {
          // You can perform cleanup tasks here if needed
        };
      }, []),
    );
    console.log('NFTS heree....', nfts);
    const t = true;
    return (
      <SafeAreaView
        style={{
          width: '100%',
          height: '100%',
          alignSelf: 'flex-start',
        }}>
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 32,
          }}>
          <Text
            style={{
              fontFamily: 'Satoshi-Bold',
              fontSize: 20,
              color: '#fff',
              fontWeight: '700',
            }}>
            Accounts
          </Text>
        </View>
        <View style={styles.balanceContainer}>
          <View>
            <Text
              style={{
                fontSize: 15,
                fontWeight: 400,
                fontFamily: 'Satoshi-Regular',
                color: '#a1a1a1',
              }}>
              Checkings
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
              <Text
                style={{
                  color: '#fff',
                  fontFamily: 'Satoshi-Regular',
                  fontSize: 24,
                  fontWeight: '700',
                  marginTop: '1%',
                }}>
                {isUsd ? '$' : currency} {balance?.split('.')[0] * exchRate}
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'Satoshi-Regular',
                    fontSize: 24,
                    fontWeight: '700',
                    marginTop: '1%',
                  }}>
                  {'.'}
                  {balance?.split('.')[1] ? balance?.split('.')[1] : '00'}
                </Text>
              </Text>
            </View>
          </View>

          {/* <View style={{
          borderRadius: 50,
          backgroundColor: '#5038E1',
          height: 50,
          width: 50,
          justifyContent: 'center',
          alignItems: 'center',
          // padding:10
        }}> */}
          <FastImage
            source={require('./icon/commodities.png')}
            // resizeMode="cover"
            style={{
              width: 52,
              height: 52,
              // borderRadius: 10,
              // margin: 5
            }}
          />
          {/* </View> */}
        </View>

        <View
          style={{
            flexDirection: 'row',
            // width: '80%',
            height: 50,
            justifyContent: 'space-evenly',
            flexDirection: 'row',
            marginTop: '1%',
            marginHorizontal: 10,
          }}>
          <TouchableOpacity
            style={styles.depWith}
            onPress={() => {
              navigation.push('Ramper');
            }}>
            <View style={[styles.innerDep, styles.innerDepColored]}>
              <Icon
                // style={styles.tup}
                name={'arrow-down-circle'}
                color={'#fff'}
                size={24}
                // color={t?'green': 'red'}
                type="feather"
              />
              <Text
                style={{
                  color: '#fff',
                  fontSize: 14,
                  paddingLeft: '5%',
                  fontFamily: 'Satoshi-Regular',
                  fontWeight: '700',
                }}>
                Add cash
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.depWith}
            onPress={() => {
              navigation.push('SendEmail');
            }}>
            <View style={styles.innerDep}>
              <Icon
                // style={styles.tup}
                name={'arrow-right-circle'}
                size={24}
                color={'#fff'}
                type="feather"
              />
              <Text
                style={{
                  color: '#fff',
                  fontSize: 14,
                  paddingLeft: '5%',
                  fontFamily: 'Satoshi-Regular',
                  fontWeight: '700',
                }}>
                Transfer
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.exploreContainer}>
          {/* <EventsCarousel
          images={images}
          navigation={navigation}
          address={
            address
            // global.withAuth
            //   ? global.loginAccount.scw
            //   : global.connectAccount.publicAddress
          }
          key={images}
        /> */}
        </View>
        <View
          style={{
            marginTop: 10,
            // marginHorizontal:10
          }}>
          <TradeCollection navigation={navigation} />
        </View>
      </SafeAreaView>
    );
  };
};

export default PaymentsComponent;
