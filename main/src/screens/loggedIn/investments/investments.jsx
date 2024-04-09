import React, {useState, useEffect, useCallback} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  TouchableOpacity,
  SafeAreaView,
  Text,
  View,
  Image,
  Dimensions,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import TradeItemCard from './TradeItemCard';
import LottieView from 'lottie-react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  getListOfCommoditiesFromMobulaApi,
  getListOfCryptoFromMobulaApi,
  getListOfForexFromMobulaApi,
  getListOfStocksFromMobulaApi,
} from '../../../store/actions/market';
import {useFocusEffect} from '@react-navigation/native';
import {marketsAction} from '../../../store/reducers/market';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

const Investments = ({navigation}) => {
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;

  const cryptoData = useSelector(x => x.market.listOfCrypto);

  const marketListFetchLoading = useSelector(
    x => x.market.marketListFetchLoading,
  );

  const [section, setSection] = useState('crypto');
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      setSection('crypto');
      dispatch(getListOfCryptoFromMobulaApi());
      setPage(2);
      return () => {};
    }, []),
  );
  console.log(cryptoData, marketListFetchLoading);

  const onEndReachedFetch = async () => {};

  return (
    <SafeAreaView
      style={{
        width: width,
        height: height,
        alignSelf: 'flex-start',
        backgroundColor: '#000000',
        paddingBottom: 80,
      }}>
      <View
        style={{
          marginTop: '8%',
          marginLeft: '5%',
          marginRight: '5%',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{fontFamily: 'Unbounded-Medium', color: '#fff', fontSize: 20}}>
          MARKETS
        </Text>
        <TouchableOpacity onPress={() => navigation.push('TransactionHistory')}>
          <Image
            source={{
              uri: 'https://res.cloudinary.com/dcrfpsiiq/image/upload/v1709493378/x8e21kt9laz3hblka91g.png',
            }}
            style={{
              width: 40,
              height: 40,
              bottom: 10,
              alignSelf: 'center',
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
            onPress={() => {
              dispatch(marketsAction.setListOfCrypto([]));
              setSection('crypto');
              dispatch(getListOfCryptoFromMobulaApi());
              if (Platform.OS === 'ios') {
                ReactNativeHapticFeedback.trigger('impactMedium', options);
              }
            }}>
            <Text
              style={{
                fontFamily: `NeueMontreal-Medium`,
                fontSize: 12,
                color: section === 'crypto' ? '#ffffff' : '#717171',
                fontWeight: '500',
              }}>
              CRYPTO
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
            onPress={() => {
              setSection('forex');
              dispatch(getListOfForexFromMobulaApi());
              if (Platform.OS === 'ios') {
                ReactNativeHapticFeedback.trigger('impactMedium', options);
              }
            }}>
            <Text
              style={{
                fontFamily: 'NeueMontreal-Medium',
                fontSize: 12,
                color: section === 'forex' ? '#ffffff' : '#717171',
                fontWeight: '500',
              }}>
              FOREX
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderBottomWidth: section === 'stocks' ? 2 : 0,
              borderBottomColor: section === 'stocks' ? '#ffffff' : '#1C1C1C',
              paddingBottom: 16,
              marginBottom: section === 'stocks' ? -2 : 0,
            }}
            onPress={async () => {
              setSection('stocks');
              if (Platform.OS === 'ios') {
                ReactNativeHapticFeedback.trigger('impactMedium', options);
              }
              // await getAllDinariStocks();
              dispatch(getListOfStocksFromMobulaApi());
            }}>
            <Text
              style={{
                fontFamily: 'NeueMontreal-Medium',
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
            onPress={() => {
              setSection('commodities');
              if (Platform.OS === 'ios') {
                ReactNativeHapticFeedback.trigger('impactMedium', options);
              }
              dispatch(getListOfCommoditiesFromMobulaApi());
            }}>
            <Text
              style={{
                fontFamily: 'NeueMontreal-Medium',
                fontSize: 12,
                color: section === 'commodities' ? '#ffffff' : '#717171',
                fontWeight: '500',
              }}>
              COMMODITIES
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {marketListFetchLoading && (
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

      {!marketListFetchLoading && section === 'crypto' && (
        <View
          scrollEnabled
          style={{
            marginTop: '1%',
          }}>
          {cryptoData && (
            <FlatList
              data={cryptoData}
              style={{marginBottom: 100}}
              renderItem={({item}) => (
                <TradeItemCard navigation={navigation} item={item} />
              )}
              onEndReached={async () => await onEndReachedFetch()}
              keyExtractor={(item, i) => i.toString()}
            />
          )}
        </View>
      )}
      {!marketListFetchLoading && section === 'forex' && (
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
      {!marketListFetchLoading && section === 'commodities' && (
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
      {!marketListFetchLoading && section === 'stocks' && (
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
      <Pressable
        onPress={() => {
          console.log(cryptoData.length);
          navigation.navigate('MarketSearch', {cryptoData});
          if (Platform.OS === 'ios') {
            ReactNativeHapticFeedback.trigger('impactMedium', options);
          }
        }}
        style={{
          height: 60,
          width: '95%',
          backgroundColor: '#1d1d1d',
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? '10%' : '7.8%',
          alignSelf: 'center',
          alignItems: 'center',
          borderRadius: 32,
          flexDirection: 'row',
          padding: 16,
          shadowRadius: 10,
        }}>
        <AntDesign name="search1" size={16} color={'#999'} />
        <Text
          style={{
            fontFamily: 'NeueMontreal-Medium',
            color: '#999',
            fontSize: 14,
            marginLeft: 16,
          }}>
          Search crypto, stocks, forex & more
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    color: '#ffffff',
    fontFamily: `NeueMontreal-Medium`,
    fontWeight: '500',
    marginLeft: 30,
  },
});

export default Investments;
