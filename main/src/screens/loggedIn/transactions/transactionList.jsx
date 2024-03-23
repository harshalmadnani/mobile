import {useEffect, useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  View,
  FlatList,
  SectionList,
  Pressable,
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
const TransactionFilterButton = ({title, onFilterPressed, isActive}) => {
  return (
    <Pressable
      onPress={() => onFilterPressed()}
      style={{
        width: '48%',
        paddingVertical: 12,
        paddingHorizontal: 6,
        borderRadius: 100,
        borderColor: 'white',
        borderWidth: isActive ? 1 : 0,
        backgroundColor: isActive ? '#000' : '#1F1C25',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text
        style={{
          color: isActive ? '#fff' : '#776F94',
          fontFamily: 'NeueMontreal-Bold',
          fontSize: 14,
        }}>
        {title}
      </Text>
    </Pressable>
  );
};

const TransactionList = ({navigation, route}) => {
  const [txType, setTxType] = useState('transfers');
  const [page, setPage] = useState(0);
  const evmInfo = useSelector(x => x.portfolio.evmInfo);
  const dispatch = useDispatch();
  const evmDLNTradesTxListInfo = useSelector(
    x => x.portfolio.evmDLNTradesTxListInfo,
  );
  const evmTxListInfo = useSelector(x => x.portfolio.evmTxListInfo);
  const getAllTxHistory = async () => {
    dispatch(getWalletTransactionForAddressFromMobula(page));
    // setPage(page + 1);
  };
  const getAllDLNTradeHistory = async () => {
    dispatch(getWalletTransactionForAddressFromDLN(page));
    // setPage(page + 1);
  };
  const onEndReachedFetch = async () => {
    // if (txType === 'dln') {
    //   getAllDLNTradeHistory();
    // } else {
    //   getAllTxHistory();
    // }
  };
  useEffect(() => {
    if (txType === 'dln') {
      // setPage(0);
      getAllDLNTradeHistory();
    } else {
      // setPage(0);
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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: '4%',
          width: '100%',
        }}>
        <TransactionFilterButton
          title={'Transfers'}
          isActive={txType === 'transfers'}
          onFilterPressed={() => setTxType('transfers')}
        />
        <TransactionFilterButton
          title={'Trade'}
          isActive={txType === 'dln'}
          onFilterPressed={() => setTxType('dln')}
        />
      </View>
      {evmTxListInfo?.transactions?.length > 0 ||
      evmDLNTradesTxListInfo?.orders.length > 0 ? (
        <FlatList
          style={{width: '100%', marginBottom: 64}}
          data={
            txType === 'dln'
              ? evmDLNTradesTxListInfo?.orders
              : evmTxListInfo?.transactions
          }
          renderItem={({item}) =>
            txType === 'transfers' ? (
              <WalletTransactionTransferCard item={item} />
            ) : (
              <WalletTransactionTradeCard item={item} />
            )
          }
          onEndReached={async () => await onEndReachedFetch()}
          keyExtractor={(item, i) => i.toString()}
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
