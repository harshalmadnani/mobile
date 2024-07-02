import React, {useState, useCallback, useEffect} from 'react';
import {
  Linking,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
  Dimensions,
  FlatList,
} from 'react-native';
import {Text, Icon, Image} from '@rneui/themed';
import styles from '../investment-styles';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

import InvestmentChart from '../../../../component/charts/InvestmentChart';
import {useDispatch, useSelector} from 'react-redux';
import {setAssetMetadata} from '../../../../store/actions/market';
import {WebView} from 'react-native-webview';
import axios from 'axios';
import {getAllDinariNewsForSpecificStock} from '../../../../utils/Dinari/DinariApi';
const MarketChart = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const currentItem = props.item;

  const [selectedTab, setSelectedTab] = useState('News');
  const selectedAssetMetaData = useSelector(
    x => x.market.selectedAssetMetaData,
  );
  const isUsd = useSelector(x => x.auth.isUsd);
  const exchRate = useSelector(x => x.auth.exchRate);
  const currency_name = useSelector(x => x.auth.currency_name);
  const isStockTrade = useSelector(x => x.market.isStockTrade);
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
  const holdings = useSelector(x => x.portfolio.holdings);
  let currentAsset;
  if (!isStockTrade) {
    currentAsset = holdings?.assets?.filter(
      x =>
        x?.asset?.symbol?.toLowerCase() === currentItem?.symbol?.toLowerCase(),
    );
  }

  useFocusEffect(
    useCallback(() => {
      if (!isStockTrade) {
        dispatch(setAssetMetadata(currentItem?.name));
      }
      return () => {
        // Perform any clean-up tasks here, such as cancelling requests or clearing state
      };
    }, []),
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
  const [newsData, setNewsData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://cryptopanic.com/api/v1/posts/?auth_token=14716ecd280f741e4db8efc471b738351688f439',
        );
        setNewsData(response?.data?.results);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    const fetchStockNewsData = async () => {
      try {
        const data = await getAllDinariNewsForSpecificStock(
          currentItem?.stock?.id,
        );
        setNewsData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (!isStockTrade) {
      fetchData();
    } else {
      fetchStockNewsData();
    }
  }, []);

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
                      ? '$'
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
              {isUsd ? '$' : currency_name}{' '}
              {currentAsset?.[0]?.estimated_balance?.toFixed(2) * exchRate ??
                0.0}
            </Text>
            <Text
              style={{
                color: '#747474',
                fontFamily: 'Unbounded-ExtraBold',
                textTransform: 'uppercase',
                fontSize: 14,
              }}>
              {currentAsset?.[0]?.token_balance?.toFixed(6) ?? 0.0}
              {` ${currentItem?.symbol ?? currentItem?.stock?.symbol}`}
            </Text>
          </View>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            backgroundColor: '#222',
            paddingVertical: 5,
            margin: '0.5%',
            borderRadius: 30,
            marginVertical: '6%',
          }}>
          {renderTabItem('News')}
          {renderTabItem('Degen AI')}
          {renderTabItem('Analytics')}
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
                      onPress={() =>
                        Linking.openURL(item?.url ?? item?.article_url)
                      }>
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
                          fontWeight: 'bold',
                          color: '#D1D2D9',
                          textAlign: 'justify',
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
          {selectedTab === 'Analytics' && (
            <>
              {isLoading && (
                <ActivityIndicator
                  size="large"
                  color="#0000ff"
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                />
              )}
              <WebView
                originWhitelist={['*']}
                source={{
                  html: `
                <style>
                  body { background-color: black; margin: 0; padding: 0; color: white; }
                </style>
                ${tradingViewWidgetHTML}`,
                }}
                style={{width: width, height: 400}}
                onLoadStart={() => setLoading(true)}
                onLoad={() => {
                  setLoading(false);
                }}
              />
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const ReadMoreLess = ({text, maxChars}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const displayText = isExpanded ? text : `${text.slice(0, maxChars)}`;

  return (
    <View>
      <Text style={{margin: 0, marginTop: 10, marginBottom: 8, color: 'white'}}>
        {displayText}
      </Text>
      {text.length > maxChars && (
        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
          <Text
            style={{
              color: '#4F9CD9',
              fontWeight: 'bold',
              fontSize: 12,
              cursor: 'pointer',
            }}>
            {isExpanded ? 'Read Less' : 'Read More'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default MarketChart;
