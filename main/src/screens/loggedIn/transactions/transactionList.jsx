import {useEffect, useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  View,
  FlatList,
  SectionList,
  Pressable,
  ImageBackground,
} from 'react-native';

import {Icon, Text} from 'react-native-elements';
import WalletTransactionTransferCard from '../../../component/Transaction/WalletTransactionTransferCard';
import WalletTransactionTradeCard from '../../../component/Transaction/WalletTransactionTradeCard';
import {useDispatch, useSelector} from 'react-redux';
import {
  getWalletTransactionForAddressFromDLN,
  getWalletTransactionForAddressFromMobula,
} from '../../../store/actions/portfolio';
import {SceneMap, TabView} from 'react-native-tab-view';
import LottieView from 'lottie-react-native';

const width = Dimensions.get('window').width;
const TransactionFilterButton = ({title, onFilterPressed, isActive}) => {
  return (
    <Pressable
      onPress={() => onFilterPressed()}
      style={{
        width: '48%',
        paddingVertical: '3%',
        paddingHorizontal: '10%',
        borderRadius: 100,

        backgroundColor: isActive ? '#303030' : '#1d1d1d',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text
        style={{
          color: isActive ? '#fff' : '#cdcdcd',
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
  const [loading, setLoading] = useState(false);
  const evmInfo = useSelector(x => x.portfolio.evmInfo);
  const dispatch = useDispatch();
  const evmDLNTradesTxListInfo = useSelector(
    x => x.portfolio.evmDLNTradesTxListInfo,
  );
  const evmTxListInfo = useSelector(x => x.portfolio.evmTxListInfo);
  const getAllTxHistory = async () => {
    setLoading(true);
    await dispatch(getWalletTransactionForAddressFromMobula(page));
    setLoading(false);
  };
  const getAllDLNTradeHistory = async () => {
    setLoading(true);
    await dispatch(getWalletTransactionForAddressFromDLN(page));
    setLoading(false);
  };
  const onEndReachedFetch = async () => {};
  useEffect(() => {
    if (txType === 'dln') {
      getAllDLNTradeHistory();
    } else {
      // setPage(0);
      getAllTxHistory();
    }
  }, [txType, evmInfo]);
  console.log('evmDLNTradesTxListInfo', evmDLNTradesTxListInfo);
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
              fontFamily: 'NeueMontreal-Medium',
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
          width: '90%',
          backgroundColor: '#1d1d1d',
          padding: '2%',
          borderRadius: 100,
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
      {!loading ? (
        <FlatList
          style={{width: '100%', marginBottom: 30, flex: 1}}
          data={
            txType === 'dln' ? evmDLNTradesTxListInfo?.orders : evmTxListInfo
          }
          renderItem={({item}) =>
            txType === 'transfers' ? (
              <WalletTransactionTransferCard item={item} />
            ) : (
              <WalletTransactionTradeCard item={item} />
            )
          }
          onEndReached={async () => await onEndReachedFetch()}
          keyExtractor={(item, i) => i?.toString()}
        />
      ) : (
        <View
          style={{
            justifyContent: 'center',
            height: '80%',
            width: '100%',
          }}>
          <LottieView
            source={require('../../../../assets/lottie/iosLottieLoader.json')}
            style={{
              width: 20,
              height: 20,
              alignSelf: 'center',
            }}
            autoPlay
            loop
          />
        </View>
      )}
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
