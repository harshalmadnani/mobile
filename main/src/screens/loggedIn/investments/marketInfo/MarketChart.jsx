import React, {useState, useCallback, useEffect} from 'react';
import {
  Linking,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
  Dimensions,
  FlatList,
  Modal,
} from 'react-native';
import {Text, Icon, Image} from '@rneui/themed';
import styles from '../investment-styles';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {TradingViewChart} from '../../../../component/charts/TradingViewChart';
import InvestmentChart from '../../../../component/charts/InvestmentChart';
import {useDispatch, useSelector} from 'react-redux';
import {setAssetMetadata} from '../../../../store/actions/market';
import {WebView} from 'react-native-webview';
import axios from 'axios';
import {getAllDinariNewsForSpecificStock} from '../../../../utils/Dinari/DinariApi';
import {getCurrencyIcon} from '../../../../utils/currencyicon';

const MarketChart = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('News');
  const [newsData, setNewsData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState('');

  const currentItem = props.item;
  const selectedAssetMetaData = useSelector(x => x.market.selectedAssetMetaData);
  const isUsd = useSelector(x => x.auth.isUsd);
  const exchRate = useSelector(x => x.auth.exchRate);
  const currency_name = useSelector(x => x.auth.currency);
  const isStockTrade = useSelector(x => x.market.isStockTrade);
  const holdings = useSelector(x => x.portfolio.holdings);

  const tradingViewWidgetHTML = !isStockTrade
    ? `
  <!-- TradingView Widget BEGIN -->
<div class="tradingview-widget-container">
  <div class="tradingview-widget-container__widget"></div>
  <div class="tradingview-widget-copyright"><a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span class="blue-text">Track all markets on TradingView</span></a></div>
  <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js" async>
  {
  "interval": "1m",
  "width": "100%",
  "isTransparent": true,
  "height": "100%",
  "symbol": "BINANCE:${currentItem.symbol.toUpperCase()}USDT",
  "showIntervalTabs": true,
  "displayMode": "multiple",
  "locale": "en",
  "colorTheme": "dark"
}
  </script>
</div>
<!-- TradingView Widget END -->
`
    : null;
  // Function to render a single tab item

  const renderTabItem = tabName => (
    <TouchableOpacity
      style={{
        paddingVertical: '3%',
        paddingHorizontal: '8%',
        borderRadius: 30,
        backgroundColor: selectedTab === tabName ? '#444' : 'transparent',
        margin: 5,
      }}
      onPress={() => setSelectedTab(tabName)}>
      <Text
        style={{
          color: selectedTab === tabName ? 'white' : 'grey',
          fontSize: 14,
        }}>
        {tabName}
      </Text>
    </TouchableOpacity>
  );
  let currentAsset;
  if (!isStockTrade) {
    currentAsset = holdings?.assets?.filter(
      x =>
        x?.asset?.symbol?.toLowerCase() === currentItem?.symbol?.toLowerCase(),
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isStockTrade) {
          const response = await axios.get(
            `https://cryptopanic.com/api/v1/posts/?auth_token=14716ecd280f741e4db8efc471b738351688f439&currencies=${currentItem?.symbol}`,
          );
          setNewsData(response?.data?.results);
        } else {
          const data = await getAllDinariNewsForSpecificStock(currentItem?.stock?.id);
          setNewsData(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isStockTrade, currentItem]);

  useFocusEffect(
    useCallback(() => {
      if (!isStockTrade) {
        dispatch(setAssetMetadata(currentItem?.name));
      }
      return () => {
        // Perform any clean-up tasks here, such as cancelling requests or clearing state
      };
    }, [isStockTrade, currentItem, dispatch])
  );
  const {width, height} = Dimensions.get('window');
  const formatNumber = numString => {
    const num = parseFloat(numString);
    if (!isNaN(num)) {
      if (num >= 1e12) {
        return (num / 1e12).toFixed(2) + 'T';
      } else if (num >= 1e9) {
        return (num / 1e9).toFixed(2) + 'B';
      } else if (num >= 1e6) {
        return (num / 1e6).toFixed(2) + 'M';
      } else if (num >= 1e3) {
        return (num / 1e3).toFixed(2) + 'K';
      } else {
        return num.toString();
      }
    }
    return 'Invalid Number'; // Return this or handle it as per your requirement
  };

  const data = [];

  if (selectedAssetMetaData && !isStockTrade) {
    selectedAssetMetaData?.market_cap &&
      data.push({
        label: 'Market Cap',
        value: selectedAssetMetaData.market_cap,
      });
    selectedAssetMetaData?.volume &&
      data?.push({label: 'Volume', value: selectedAssetMetaData.volume});
    selectedAssetMetaData?.total_supply &&
      data?.push({
        label: 'Circulating Supply',
        value: selectedAssetMetaData?.total_supply,
      });
    selectedAssetMetaData?.max_supply &&
      data?.push({
        label: 'Total Supply',
        value: selectedAssetMetaData?.max_supply,
      });
  }

  if (!selectedAssetMetaData && !isStockTrade) {
    return null; // or <PlaceholderComponent />;
  }

  const currency_icon = getCurrencyIcon(currency_name);

  const openWebViewModal = (url) => {
    setSelectedUrl(url);
    setModalVisible(true);
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView contentContainerStyle={{minHeight: height, minWidth: width}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
          }}>
          <Icon
            name={'navigate-before'}
            size={30}
            color={'#f0f0f0'}
            type="materialicons"
            onPress={() => navigation.goBack()}
            style={{marginLeft: 20}}
          />
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={styles.stockHead}>
              {currentItem?.name?.includes('Coinbase') //Temporary Fix
                ? 'Coinbase'
                : currentItem?.name || currentItem?.stock?.symbol}
            </Text>
          </View>
        </View>

        <View style={styles.coinChart}>
          <View style={styles.chartContainer}>
            <InvestmentChart
              assetName={currentItem?.name || currentItem?.stock?.id}
            />
          </View>
        </View>
        {isStockTrade ? null : (
          <View
            style={{
              backgroundColor: '#1414141',
              marginTop: '3%',
              borderBottomColor: '#333',
              borderBottomWidth: 1,
              borderTopColor: '#333',
              borderTopWidth: 1,
              paddingVertical: '5%',
            }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                alignItems: 'center',
                paddingStart: 20,
                paddingEnd: 20,
              }}>
              {data.map((item, index) => (
                <View
                  key={index}
                  style={{alignItems: 'center', marginRight: 40}}>
                  <Text
                    style={{
                      color: 'white',
                      marginBottom: 5,
                      fontFamily: 'NeueMontreal-Bold',
                    }}>
                    {item?.label}
                  </Text>
                  <Text
                    style={{color: 'grey', fontFamily: 'NeueMontreal-Medium'}}>
                    {item?.label === 'Market Cap' || item?.label === 'Volume'
                      ? isUsd
                        ? '$'
                        : currency_icon
                      : ''}
                    {formatNumber(item?.value)}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
        <TouchableOpacity
          style={{
            paddingHorizontal: '5%',
            marginTop: '8%',
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View>
            <Text
              style={{
                color: '#747474',
                fontFamily: 'NeueMontreal-Bold',
                fontSize: 16,
              }}>
              Amount owned
            </Text>
            <Text
              style={{
                color: '#F0F0F0',
                fontSize: 24,
                fontFamily: `Unbounded-Bold`,
                marginTop: '2%',
              }}>
              {isUsd ? '$' : currency_icon}
              {isNaN(currentAsset?.[0]?.estimated_balance * exchRate)
                ? '0.00'
                : isUsd
                ? currentAsset?.[0]?.estimated_balance?.toFixed(2)
                : (currentAsset?.[0]?.estimated_balance * exchRate).toFixed(2)}
            </Text>
            <Text
              style={{
                color: '#747474',
                fontFamily: 'Unbounded-ExtraBold',
                textTransform: 'uppercase',
                fontSize: 14,
              }}>
              {currentAsset?.[0]?.token_balance?.toFixed(6) || '0.00'}
              {` ${currentItem?.symbol ?? currentItem?.stock?.symbol}`}
            </Text>
          </View>
        </TouchableOpacity>

        {/* About Section */}
        {selectedAssetMetaData?.description && (
          <View style={{padding: '4%', marginTop: '5%'}}>
            <Text style={{color: 'white', fontSize: 18, fontFamily: 'Benzin-Medium'}}>
              About {currentItem?.symbol}
            </Text>
            <Text style={{color: 'grey', fontSize: 14, marginTop: 10, fontFamily: 'Sk-Modernist-Regular'}}>
              {selectedAssetMetaData.description}
            </Text>
          </View>
        )}

        {/* Social Links Section */}
        <View style={{flexDirection: 'row', justifyContent: 'flex-start', marginTop: '2%',  marginLeft:'4%'}}>
          {selectedAssetMetaData?.discord && (
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: 'white',
                borderRadius: 50,
                paddingVertical: '2%',
                paddingHorizontal: '5%',
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onPress={() => Linking.openURL(selectedAssetMetaData.discord)}>
              <Text style={{color: 'white', fontSize: 12, fontFamily: 'NeueMontreal-Bold'}}>Discord</Text>
              <Icon name="arrow-up-right" type="feather" size={14} color="white" style={{marginLeft: 2}} />
            </TouchableOpacity>
          )}
          {selectedAssetMetaData?.twitter && (
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: 'white',
                borderRadius: 50,
                paddingVertical: '2%',
                paddingHorizontal: '5%',
                marginLeft: 5,
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onPress={() => Linking.openURL(selectedAssetMetaData.twitter)}>
              <Text style={{color: 'white', fontSize: 12, fontFamily: 'NeueMontreal-Bold'}}>Twitter</Text>
              <Icon name="arrow-up-right" type="feather" size={14} color="white" style={{marginLeft: 2}} />
            </TouchableOpacity>
          )}
          {selectedAssetMetaData?.website && (
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: 'white',
                borderRadius: 50,
                paddingVertical: '2%',
                paddingHorizontal: '5%',
                marginLeft: 5,
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onPress={() => Linking.openURL(selectedAssetMetaData.website)}>
              <Text style={{color: 'white', fontSize: 12, fontFamily: 'NeueMontreal-Bold'}}>Website</Text>
              <Icon name="arrow-up-right" type="feather" size={14} color="white" style={{marginLeft: 2}} />
            </TouchableOpacity>
          )}
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            backgroundColor: '#222',
            paddingVertical: 5,
            margin: '2%',
            borderRadius: 30,
            marginVertical: '6%',
          }}>
          {renderTabItem('News')}
          {renderTabItem('Degen AI')}
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000',
          }}>
          {selectedTab === 'News' && (
            <View>
              {isLoading ? (
                <View
                  scrollEnabled
                  style={{
                    width: width,
                    // height: 200,
                    backgroundColor: 'red',
                  }}>
                  {/* <CustomSkeleton element={5} width={'98%'} height={120} /> */}
                </View>
              ) : newsData?.length > 0 ? (
                newsData.map((item, i) => (
                  <View
                    key={i.toString()}
                    style={{
                      marginVertical: '5%',
                      alignItems: 'flex-start',
                      marginHorizontal: '5%',
                    }}>
                    <TouchableOpacity
                      onPress={() => openWebViewModal(item?.url ?? item?.article_url)}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginBottom: 10,
                        }}>
                        <Text
                          style={{
                            fontSize: 13,
                            color: 'gray',
                            marginRight: 5,
                          }}>
                          {new Date(
                            item?.published_at ?? item?.published_utc,
                          )?.toLocaleTimeString()}
                        </Text>
                        <Text style={{marginHorizontal: 5, color: 'gray'}}>
                          ·
                        </Text>
                        <Text
                          style={{
                            fontSize: 13,
                            color: 'gray',
                            marginRight: 5,
                          }}>
                          {new Date(
                            item?.published_at ?? item?.published_utc,
                          ).toLocaleDateString()}
                        </Text>
                        <Text style={{marginHorizontal: 5, color: 'gray'}}>
                          ·
                        </Text>
                        <Text style={{fontSize: 13, color: 'gray'}}>
                          {item?.source?.title ?? item?.publisher}
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontSize: 24,
                          fontFamily: 'Sk-Modernist-Bold',
                          color: '#D1D2D9',
                          textAlign: 'justify',
                          letterSpacing: 0.5, // Adjust this value as needed
                        }}>
                        {item?.title ?? item?.description}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : null}
            </View>
          )}
          {selectedTab === 'Degen AI' && (
            <>
              <Image
                source={{
                  uri: 'https://res.cloudinary.com/xade-finance/image/upload/v1710949855/lv9al2binq8dw6qpjrm0.png',
                }}
                style={{width: 300, height: 300}} // Adjust size as needed
              />
              <Text
                style={{
                  color: 'white',
                  fontSize: 20,
                  marginTop: 20,
                  fontFamily: 'Unbounded-Bold',
                }}>
                Coming Soon
              </Text>
            </>
          )}
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
          <View style={{
            height: '80%',
            backgroundColor: 'black',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            overflow: 'hidden',
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              padding: 10,
              backgroundColor: 'black',
            }}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <WebView
              source={{ uri: selectedUrl }}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MarketChart;