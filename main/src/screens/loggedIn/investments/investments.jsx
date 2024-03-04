import React, {useState, useCallback} from 'react';
import {
  TouchableOpacity,
  SafeAreaView,
  Text,
  View,
  Image,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {ImageAssets} from '../../../../assets';
import TradeItemCard from './TradeItemCard';
import {useDispatch, useSelector} from 'react-redux';
import {
  getListOfCryptoFromCoinGeckoApi,
  getListOfCryptoFromMobulaApi,
} from '../../../store/actions/market';
import {useFocusEffect} from '@react-navigation/native';

const idToChain = {
  btc: {
    tokenAddress: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
    chain: 'polygon',
  },
  eth: {
    tokenAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    chain: 'polygon',
  },
  matic: {
    tokenAddress: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    chain: 'polygon',
  },
};
const ComingSoonView = () => (
  <View
    style={{
      height: '80%',
      width: '100%',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    <View>
      <Image source={ImageAssets.forexImg} style={{height: 200, width: 200}} />
    </View>
    <View style={{marginBottom: 50, alignItems: 'flex-start', gap: 10}}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: '#D1D2D9',
          textAlign: 'justify',
          fontFamily: 'Montreal-Medium',
        }}>
        Coming Soon
      </Text>
    </View>
  </View>
);
const Investments = ({navigation}) => {
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;

  const cryptoData = useSelector(x => x.market.listOfCrypto);

  const [isLoading, setIsLoading] = useState(false);
  const [section, setSection] = useState('crypto');
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  useFocusEffect(
    useCallback(() => {
      console.log('Here....fired');
      setIsLoading(true);
      dispatch(getListOfCryptoFromCoinGeckoApi(page));
      setPage(2);
      setIsLoading(false);

      return () => {
        console.log('firedd cleanup ======>');
        setIsLoading(false);
        // Perform any clean-up tasks here, such as cancelling requests or clearing state
      };
    }, []),
  );
  const onEndReachedFetch = async () => {
    console.log('firedd on end ======>');
    if (page <= 3) {
      dispatch(getListOfCryptoFromCoinGeckoApi(page));
      setPage(page + 1);
    }
  };
  return (
    <SafeAreaView
      style={{
        width: width,
        height: height,
        alignSelf: 'flex-start',
        backgroundColor: '#000000',
        paddingBottom: 80,
      }}>
                <View style={{marginTop: '8%', marginLeft: '5%', marginRight:'5%',flexDirection: 'row', justifyContent: 'space-between',}}>
          <Text style={{fontFamily:'Unbounded-Medium',color:'#fff',fontSize: 20}}>MARKETS</Text>
           <TouchableOpacity 
         onPress={() => navigation.push('TransactionHistory')}>
      <Image
        source={{ uri: 'https://res.cloudinary.com/dcrfpsiiq/image/upload/v1709493378/euhlvs3wvgzdovdj7gxg.png' }} // Replace with your image URI
        style={{
          width: 40,
          height: 40,
          bottom: 3,
        }}
      />
    </TouchableOpacity>
        </View>
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 4,
            marginTop: 15,
            paddingBottom: -8,
            paddingHorizontal: '4%',
            borderBottomWidth: 2,
            borderBottomColor: '#1C1C1C',
            // paddingHorizontal: -16
          }}>
          <TouchableOpacity
            style={{
              borderBottomWidth: section === 'crypto' ? 2 : 0,
              borderBottomColor: section === 'crypto' ? '#ffffff' : '#1C1C1C',
              paddingBottom: 16,
              paddingHorizontal: 16,
              marginBottom: section === 'crypto' ? -2 : 0,
            }}
            onPress={() => setSection('crypto')}>
            <Text
              style={{
                fontFamily: `Montreal-Medium`,
                fontSize: 12,
                color: section === 'crypto' ? '#ffffff' : '#717171',
                fontWeight: '500',
              }}>
              CRYPTO
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderBottomWidth: section === 'stocks' ? 2 : 0,
              borderBottomColor: section === 'stocks' ? '#ffffff' : '#1C1C1C',
              paddingBottom: 16,
              marginBottom: section === 'stocks' ? -2 : 0,
            }}
            onPress={() => setSection('stocks')}>
            <Text
              style={{
                fontFamily: 'Montreal-Medium',
                fontSize: 12,
                color: section === 'stocks' ? '#ffffff' : '#717171',
                fontWeight: '500',
              }}>
              STOCKS
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderBottomWidth: section === 'commodities' ? 2 : 0,
              borderBottomColor:
                section === 'commodities' ? '#ffffff' : '#1C1C1C',
              paddingBottom: 16,
              marginBottom: section === 'commodities' ? -2 : 0,
            }}
            onPress={() => setSection('commodities')}>
            <Text
              style={{
                fontFamily: 'Montreal-Medium',
                fontSize: 12,
                color: section === 'commodities' ? '#ffffff' : '#717171',
                fontWeight: '500',
              }}>
              COMMODITIES
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderBottomWidth: section === 'forex' ? 2 : 0,
              borderBottomColor: section === 'forex' ? '#ffffff' : '#1C1C1C',
              paddingBottom: 16,
              paddingHorizontal: 16,
              marginBottom: section === 'forex' ? -2 : 0,
            }}
            onPress={() => setSection('forex')}>
            <Text
              style={{
                fontFamily: 'Montreal-Medium',
                fontSize: 12,
                color: section === 'forex' ? '#ffffff' : '#717171',
                fontWeight: '500',
              }}>
              FOREX
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {isLoading && (
        <View style={{height: '100%'}}>
          <ActivityIndicator
            size={30}
            style={{marginTop: '40%'}}
            color="#fff"
          />
        </View>
      )}

      {!isLoading && section === 'crypto' && (
        <View
          scrollEnabled
          style={{
            marginTop: '1%',
          }}>
          {cryptoData && (
            <FlatList
              data={cryptoData}
              style={{marginBottom: 64}}
              renderItem={({item}) => (
                <TradeItemCard navigation={navigation} item={item} />
              )}
              onEndReached={async () => await onEndReachedFetch()}
              keyExtractor={(item, i) => i.toString()}
            />
          )}
        </View>
      )}

      {section !== 'crypto' && <ComingSoonView />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    color: '#ffffff',
    fontFamily: `Montreal-Medium`,
    fontWeight: '500',
    marginLeft: 30,
  },
});

export default Investments;
