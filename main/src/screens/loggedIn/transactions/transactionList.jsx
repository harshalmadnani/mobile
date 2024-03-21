import {useEffect, useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  View,
  FlatList,
  SectionList,
} from 'react-native';
import {Icon, Text} from 'react-native-elements';
import WalletTransactionTransferCard from '../../../component/Transaction/WalletTransactionTransferCard';
import WalletTransactionTradeCard from '../../../component/Transaction/WalletTransactionTradeCard';
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
  const evmTxListInfo = useSelector(x => x.portfolio.evmTxListInfo);
  const getAllTxHistory = async () => {
    dispatch(getWalletTransactionForAddressFromMobula(page));
  };
  const getAllDLNTradeHistory = async () => {
    dispatch(getWalletTransactionForAddressFromDLN(page));
  };
  const onEndReachedFetch = async () => {
    // dispatch(getWalletTransactionForAddressFromDLN(page));
  };
  useEffect(() => {
    // if (txType !== 'dln') {
    getAllDLNTradeHistory();
    // } else {
    getAllTxHistory();
    // }
  }, [txType, evmInfo]);

  return (
    <SafeAreaView
      style={{
        width: '100%',
        height: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}>
      {evmTxListInfo?.transactions?.length > 0 &&
      evmDLNTradesTxListInfo?.orders.length > 0 ? (
        <FlatList
          style={{width: '100%', marginBottom: 64}}
          data={[
            ...evmDLNTradesTxListInfo?.orders,
            ...evmTxListInfo?.transactions,
          ]}
          renderItem={({item}) =>
            item?.type ? (
              <WalletTransactionTransferCard item={item} />
            ) : (
              <WalletTransactionTradeCard item={item} />
            )
          }
          onEndReached={async () => await onEndReachedFetch()}
          keyExtractor={(item, i) => i.toString()}
          stickySectionHeadersEnabled={true}
          ListHeaderComponent={() => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  width: '100%',
                  paddingVertical: 16,
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
            );
          }}
        />
      ) : null}
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
  },
});

export default TransactionList;
