import {useEffect, useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Linking,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Clipboard,
  ScrollView,
} from 'react-native';
import {Icon, Text} from 'react-native-elements';
import FastImage from 'react-native-fast-image';

import TransactionReceipt from './transactionReceipt';
import Snackbar from 'react-native-snackbar';
import {useDispatch, useSelector} from 'react-redux';
import {
  getWalletTransactionForAddressFromDLN,
  getWalletTransactionForAddressFromMobula,
} from '../../../store/actions/portfolio';

const width = Dimensions.get('window').width;

const TransactionList = ({navigation, route}) => {
  const [txType, setTxType] = useState('dln');
  const [page, setPage] = useState(0);
  const evmInfo = useSelector(x => x.portfolio.evmInfo);
  const dispatch = useDispatch();
  const evmDLNTradesTxListInfo = useSelector(
    x => x.portfolio.evmDLNTradesTxListInfo,
  );
  const getAllTxHistory = async () => {
    dispatch(getWalletTransactionForAddressFromMobula(page));
  };
  const getAllDLNTradeHistory = async () => {
    dispatch(getWalletTransactionForAddressFromDLN(page));
  };
  useEffect(() => {
    if (txType === 'dln') {
      getAllDLNTradeHistory();
    } else {
      getAllTxHistory();
    }
  }, [txType, evmInfo]);

  return (
    <SafeAreaView
      style={{
        width: '100%',
        height: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          width: '100%',
          margin: '5%',
          marginBottom: '0%',
        }}>
        <Icon
          name={'navigate-before'}
          size={30}
          color={'#f0f0f0'}
          type="materialicons"
          onPress={() => navigation.goBack()}
        />
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: '#F0F0F0',
              fontFamily: 'Unbounded-Regular',
              fontSize: 16,
              right: 30,
            }}>
            Transaction History
          </Text>
        </View>
      </View>
      <ScrollView>
        <View style={styles.transactionListContainer}></View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    color: '#ffffff',
    fontFamily: `Satoshi-Regular`,
    fontWeight: 500,
    marginLeft: 30,
  },
  transactionListContainer: {
    margin: '3%',
    // backgroundColor: 'blue',
    top: '0%',
  },

  transactions: {
    width: width - 30,
    marginHorizontal: 15,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 6,
    backgroundColor: 'red',
    backgroundColor: '#080808',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '30%',
    justifyContent: 'flex-end',
    textAlign: 'center',
    alignContent: 'flex-end',
  },
  noTransaction: {
    color: '#d9d9d9',
    marginTop: '7%',
    textAlign: 'center',
    fontFamily: `Satoshi-Regular`,
    fontSize: 17,
  },
  ttext: {
    marginLeft: 15,
    marginTop: 5,
  },
});

export default TransactionList;
