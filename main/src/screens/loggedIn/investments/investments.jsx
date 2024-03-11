import React, {useState, useEffect, useCallback} from 'react';
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
  ScrollView,
  Button,
} from 'react-native';
import {ImageAssets} from '../../../../assets';
import TradeItemCard from './TradeItemCard';
import {useDispatch, useSelector} from 'react-redux';
import {
  getListFilteredFromCoinGeckoApi,
  getListOfCryptoFromCoinGeckoApi,
  getListOfCryptoFromMobulaApi,
} from '../../../store/actions/market';
import {useFocusEffect} from '@react-navigation/native';
import {getMarketData} from '../../../utils/cryptoMarketsApi';
import Icon from 'react-native-vector-icons/MaterialIcons';
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
  const [marketData, setMarketData] = useState(null);

  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;

  const cryptoData = useSelector(x => x.market.listOfCrypto);
  const cryptoFilteredData = useSelector(x => x.market.listOfFilteredCrypto);
  const [isLoading, setIsLoading] = useState(false);
  const [section, setSection] = useState('crypto');
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      dispatch(getListOfCryptoFromCoinGeckoApi(page));
      setPage(2);
      setIsLoading(false);

      return () => {
        setIsLoading(false);
        // Perform any clean-up tasks here, such as cancelling requests or clearing state
      };
    }, []),
  );
  //
  const onPressFilters = type => {
    dispatch(getListFilteredFromCoinGeckoApi(type));
  };
  const onEndReachedFetch = async () => {
    if (page <= 3) {
      dispatch(getListOfCryptoFromCoinGeckoApi(page));
      setPage(page + 1);
    }
  };

  const buttons = [
    {
      id: '1',
      text: 'Top 100',
      iconName: 'bar-chart', // Example icon, replace with actual icons you want
    },
    {
      id: '2',
      text: 'Trending',
      iconName: 'trending-up', // Example icon
    },
    {
      id: '3',
      text: 'Gainers',
      iconName: 'arrow-upward', // Example icon
    },
    {
      id: '4',
      text: 'More',
      iconName: 'more-horiz', // Example icon
    },
  ];

  const [selectedButton, setSelectedButton] = useState("1");

  const handleButtonPress = buttonId => {
    switch (buttonId) {
      case '1':
        // Action for Top 100 button
        break;
      case '2':
        // Action for Trending button
        break;
      case '3':
        // Action for Gainers button
        break;
      case '4':
        // Action for More button
        break;
      default:
        break;
    }
    setSelectedButton(buttonId);
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
              uri: 'https://res.cloudinary.com/dcrfpsiiq/image/upload/v1709493378/euhlvs3wvgzdovdj7gxg.png',
            }}
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
        <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{paddingVertical: 10, marginLeft: 10}}>
      {buttons.map((button) => (
        <TouchableOpacity
          key={button.id}
          onPress={() => handleButtonPress(button.id)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#222',
            borderRadius: 100,
            borderWidth: 1,
            borderColor: selectedButton === button.id ? '#fff' : null,
            marginRight: 10,
            paddingHorizontal: 10,
            height: 34,
          }}>
          <Icon
            name={button.iconName}
            size={24}
            color={selectedButton === button.id ? '#fff' : '#999'}
            style={{marginRight: 5}}
          />
          <Text
            style={{
              color: selectedButton === button.id ? '#fff' : '#999',
              fontSize: 14,
              fontFamily: 'Montserrat-Bold', // Check the font family name
            }}>
            {button.text}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
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
      {!isLoading && section === 'stocks' && (
        <View
          scrollEnabled
          style={{
            marginTop: '1%',
          }}>
          {stocksData && (
            <FlatList
              data={stocksData}
              removeClippedSubviews
              maxToRenderPerBatch={10}
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
