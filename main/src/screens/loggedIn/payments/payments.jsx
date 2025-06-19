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
import {useFocusEffect} from '@react-navigation/native';
import {
  useAccount,
  useBalance,
  useNetwork,
} from 'wagmi';
import {getCryptoHoldingForAddressFromMobula} from '../../../store/actions/portfolio';
import {marketSlice, marketsAction} from '../../../store/reducers/market';
const xusdContractAddress = '0xA3C957f5119eF3304c69dBB61d878798B3F239D9';
const usdcAddress = '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359';
var monthname = new Array(
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
);
var monthnameFull = new Array(
  'Jan',
  'Feb',
  'Mar',
  'April',
  'May',
  'June',
  'July',
  'August',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
);


const PaymentsComponent = ({navigation}) => {
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
  const dispatch = useDispatch();
  const {address} = useAccount();
  const {chain} = useNetwork();
  
  const isMainnet = chain?.id === 137;

  const { data: balanceData } = useBalance({
    address,
    token: isMainnet ? usdcAddress : xusdContractAddress,
    chainId: chain?.id,
  });

  const balance = balanceData?.formatted;

  const [transactionVisible, setTransactionVisible] = useState(false);
  const DEVICE_WIDTH = Dimensions.get('window').width;
  const nfts = useSelector(x => x.portfolio.nfts);

  const [showTxnReceiptModal, setShowTxnReceiptModal] = useState(false);
  const [transactionData, setTransactionData] = useState();

  const handleCloseTransactionReceiptModal = () => {
    setShowTxnReceiptModal(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      if (address) {
        // Fetch transaction history
        fetch(
          `https://api${
            isMainnet ? '' : '-testnet'
          }.polygonscan.com/api?module=account&action=tokentx&contractaddress=${
            isMainnet ? usdcAddress : xusdContractAddress
          }&address=${address}&sort=desc&apikey=${POLYGON_API_KEY}`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        )
          .then(response => response.json())
          .then(data => {
            if (data.message != 'NOTOK' && data.result) {
              const result = data.result;
              let arr = [];
              let date = [];
              let len = result.length;
              for (let i = 0; i < len; i++) {
                let res = result[i];
                let val = res.value;
                const decimals = isMainnet ? 6 : 18;
                const etherValue = parseInt(val) / 10 ** decimals;
                var pubDate = new Date(res.timeStamp * 1000);

                var formattedTime =
                  '0' +
                  (pubDate.getHours() / 12 > 1
                    ? pubDate.getHours() % 12
                    : pubDate.getHours()) +
                  ':' +
                  pubDate.getMinutes() +
                  (pubDate.getHours() / 12 > 1 ? ' pm' : ' am');

                var formattedDate =
                  monthname[pubDate.getMonth()] + ' ' + pubDate.getDate();

                var month = monthnameFull[pubDate.getMonth()];

                const truth = res.from.toLowerCase() == address.toLowerCase() ? false : true;
                const json = {
                  truth: truth,
                  to: res.to,
                  from: res.from,
                  value: etherValue,
                  date: formattedDate,
                  time: formattedTime,
                  hash: res.hash,
                  month: month,
                };
                date.push(formattedDate);
                arr.push(json);
              }
              setDates([...new Set(date)]);
              setState(arr);
            }
          });
      }
    }, [address, isMainnet]),
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
              ${balance?.split('.')[0]}
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
        <EventsCarousel
        images={images}
        navigation={navigation}
        address={address}
        />
        <BreakdownCarousel breakdowns={breakdowns} />
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

export default PaymentsComponent;
