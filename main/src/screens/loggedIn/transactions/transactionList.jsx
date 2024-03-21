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
import {getWalletTransactionForAddressFromMobula} from '../../../store/actions/portfolio';

const width = Dimensions.get('window').width;

const TransactionList = ({navigation, route}) => {
  const [state, setState] = useState([
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
  const [txType, setTxType] = useState('dln');
  const [showTxnReceiptModal, setShowTxnReceiptModal] = useState(false);
  const [transactionData, setTransactionData] = useState();
  const [page, setPage] = useState(0);
  const evmInfo = useSelector(x => x.portfolio.evmInfo);
  const dispatch = useDispatch();
  const handleCloseTransactionReceiptModal = () => {
    setShowTxnReceiptModal(false);
  };

  const getAllTxHistory = async () => {
    console.log('evm info.....', evmInfo);
    dispatch(getWalletTransactionForAddressFromMobula(page));
  };
  const getAllDLNTradeHistory = async () => {
    console.log('evm info.....', evmInfo);
    dispatch(getWalletTransactionForAddressFromMobula(page));
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
        {showTxnReceiptModal && (
          <TransactionReceipt
            transactionData={transactionData}
            onClose={handleCloseTransactionReceiptModal}
          />
        )}

        <View style={styles.transactionListContainer}>
          {state.length > 0 ? (
            state.slice(0, 20).map(json => {
              return (
                <TouchableOpacity
                  keyboardShouldPersistTaps={true}
                  // onPress={() => {
                  //   navigation.push('ViewTransaction', {json: json});
                  // }}
                  onPress={() => {
                    setTransactionData(json);
                    setShowTxnReceiptModal(true);
                  }}
                  style={styles.transactions}
                  key={state.indexOf(json)}>
                  <View style={styles.transactionLeft}>
                    <View
                      style={{
                        borderRadius: 50,
                        backgroundColor: '#333333',
                        width: 40,
                        height: 40,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <FastImage
                        style={{width: 20, height: 20, borderRadius: 5}}
                        source={
                          json.truth == 2
                            ? require('../payments/icon/pending.png')
                            : json.truth == 1
                            ? require('../payments/icon/positive.png')
                            : require('../payments/icon/negative.png')
                        }
                      />
                    </View>
                    <View style={styles.ttext}>
                      <TouchableHighlight
                        key={json.hash}
                        onPress={() => {
                          Clipboard.setString(json.truth ? json.from : json.to);
                          Snackbar.show({text: 'Copied address to clipboard'});
                          // Alert.alert('Copied Address To Clipboard');
                        }}>
                        <Text
                          style={{
                            color: '#e9e9e9',
                            fontFamily: `Satoshi-Regular`,
                            fontSize: 16,
                          }}>
                          {(json.truth
                            ? json.from ==
                              '0xc9DD6D26430e84CDF57eb10C3971e421B17a4B65'.toLowerCase()
                              ? 'RemmiteX V1'
                              : json.from.slice(0, 12) + '...'
                            : json.to ==
                              '0xc9DD6D26430e84CDF57eb10C3971e421B17a4B65'.toLowerCase()
                            ? 'RemmiteX V1'
                            : json.to
                          ).slice(0, 12) + '...'}
                        </Text>
                      </TouchableHighlight>

                      <Text
                        style={{
                          color: '#7f7f7f',
                          fontSize: 15,
                          fontFamily: `Satoshi-Regular`,
                        }}>
                        {json.date}, {json.time}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.transactionRight}>
                    <Text
                      style={{
                        color: json.truth ? '#A38CFF' : '#fff',
                        fontSize: 17,
                        fontFamily: `Satoshi-Regular`,
                        textAlign: 'right',
                        alignSelf: 'flex-end',
                        alignContent: 'flex-end',
                      }}>
                      {json.truth != 0 && json.truth != 2 ? '+' : '-'}$
                      {json.value.toFixed(3)}
                    </Text>
                    {/* <Icon
                                    // style={styles.tup}
                                    name={'chevron-small-right'}
                                    size={30}
                                    color={'#7f7f7f'}
                                    type="entypo"
                                /> */}
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <View>
              <Text style={styles.noTransaction}>No transaction found</Text>
            </View>
          )}
        </View>
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
