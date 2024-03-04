import React, {useState, useEffect, useCallback} from 'react';
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
  Dimensions,
  Linking,
  FlatList,
} from 'react-native';
import {Text, Icon, Image} from '@rneui/themed';

import styles from '../investment-styles';

import TradePage from './BuyForm';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {ImageAssets} from '../../../../../assets';

const screenWidth = Dimensions.get('window').width;

import LinearGradient from 'react-native-linear-gradient';
import {TradingViewChart} from '../../../../component/charts/TradingViewChart';
import moment from 'moment/moment';
import {useDispatch, useSelector} from 'react-redux';
import {
  getCryptoHoldingForMarketFromMobula,
  setAssetMetadata,
  setHistoricalDataOfSelectedTimeFrame,
} from '../../../../store/actions/market';
import {getCryptoHoldingForAddressFromMobula} from '../../../../store/actions/portfolio';

const MarketChart = props => {
  const availableTimeFrame = ['1D', '1W', '1M', '3M', '1Y'];
  const [timeFrameSelected, setTimeFrame] = useState('1D');
  const [scwAddress, setScwAddress] = useState();
  const [state, setState] = useState();
  const [news, setNews] = useState([]);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const currentItem = props.item;
  const selectedAssetWalletHolding = useSelector(
    x => x.market.selectedAssetWalletHolding,
  );
  const currentTimeFramePrice = useSelector(
    x => x.market.selectedTimeFramePriceInfo,
  );
  const fetchUserDetails = () => {
    if (global.withAuth) {
      authAddress = global.loginAccount.publicAddress;
      const scwAddress = global.loginAccount.scw;
      console.log(scwAddress);
      setScwAddress(scwAddress);
    } else {
      authAddress = global.connectAccount.publicAddress;
      const scwAddress = global.connectAccount.publicAddress;
      setScwAddress(scwAddress);
    }
  };
  const onTimeFrameChange = async index => {
    if (
      availableTimeFrame[index] === '1D' &&
      timeFrameSelected !== availableTimeFrame[index]
    ) {
      const date = moment().subtract(1, 'days').format('YYYY-MM-DD');
      const unix = moment(date).unix() * 1000;
      await dispatch(
        setHistoricalDataOfSelectedTimeFrame(
          currentItem?.name,
          currentItem.current_price,
          unix,
        ),
      );
    } else if (
      availableTimeFrame[index] === '1W' &&
      timeFrameSelected !== availableTimeFrame[index]
    ) {
      const date = moment().subtract(7, 'days').format('YYYY-MM-DD');
      const unix = moment(date).unix() * 1000;
      console.log(unix);
      dispatch(
        setHistoricalDataOfSelectedTimeFrame(
          currentItem?.name,
          currentItem?.current_price,
          unix,
        ),
      );
    } else if (
      availableTimeFrame[index] === '1M' &&
      timeFrameSelected !== availableTimeFrame[index]
    ) {
      const date = moment().subtract(1, 'months').format('YYYY-MM-DD');
      const unix = moment(date).unix() * 1000;
      console.log(unix);
      await dispatch(
        setHistoricalDataOfSelectedTimeFrame(
          currentItem?.name,
          currentItem.current_price,
          unix,
        ),
      );
    } else if (
      availableTimeFrame[index] === '3M' &&
      timeFrameSelected !== availableTimeFrame[index]
    ) {
      const date = moment().subtract(3, 'months').format('YYYY-MM-DD');
      const unix = moment(date).unix() * 1000;
      console.log(unix);
      await dispatch(
        setHistoricalDataOfSelectedTimeFrame(
          currentItem?.name,
          currentItem.current_price,
          unix,
        ),
      );
    } else if (
      availableTimeFrame[index] === '1Y' &&
      timeFrameSelected !== availableTimeFrame[index]
    ) {
      const date = moment().subtract(1, 'years').format('YYYY-MM-DD');
      const unix = moment(date).unix() * 1000;
      console.log(unix);
      await dispatch(
        setHistoricalDataOfSelectedTimeFrame(
          currentItem?.name,
          currentItem.current_price,
          unix,
        ),
      );
    }
    setTimeFrame(availableTimeFrame[index]);
  };

  const formatDate = timestamp => {
    const date = new Date(timestamp);

    // Get hours and minutes
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Format hours and minutes
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(
      minutes,
    ).padStart(2, '0')}`;

    // Get day, month, and year
    const day = date.getDate();
    const month = date.toLocaleString('default', {month: 'short'});

    // Format the final string
    return {
      time: formattedTime,
      date: `${day} ${month}`,
    };
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  const getRelativeTime = () => {
    if (timeFrameSelected === '1D') {
      return '24 h';
    } else if (timeFrameSelected === '1W') {
      return '1 Week';
    } else if (timeFrameSelected === '1M') {
      return '1 Month';
    } else if (timeFrameSelected === '3M') {
      return '3 Month';
    } else if (timeFrameSelected === '1Y') {
      return '1 Year';
    }
  };

  const onFocusFunction = async () => {
    const date = moment().subtract(1, 'days').format('YYYY-MM-DD');
    const unix = moment(date).unix() * 1000;
    dispatch(
      setHistoricalDataOfSelectedTimeFrame(
        currentItem?.name,
        currentItem.current_price,
        unix,
      ),
    );
    console.log('asset....calls');
    // dispatch(getCryptoHoldingForAddressFromMobula(currentItem?.name)); Harshal you have to call this and like address you will get value like const holdings=useSelector(x=>x.portfolio.holdings)
    dispatch(getCryptoHoldingForMarketFromMobula(currentItem?.name));
    dispatch(setAssetMetadata(currentItem?.name));
  };
  useFocusEffect(
    useCallback(() => {
      console.log('fired cleanup ======> focus');
      onFocusFunction();
      return () => {
        console.log('fired cleanup ======>');
        // Perform any clean-up tasks here, such as cancelling requests or clearing state
      };
    }, []),
  );

  return (
    <ScrollView contentContainerStyle={{flex: 1}}>
      <View style={styles.investmentsNav}>
        <View style={styles.longshortContainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              width: '100%',
              marginBottom: '10%',
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
              <Text style={styles.stockHead}>{currentItem?.name}</Text>
            </View>
          </View>

          <View style={styles.coinChart}>
            <View style={styles.marketInfo}>
              <View style={styles.stockName}>
                <View style={{flexDirection: 'row'}}></View>
              </View>
              <View style={styles.stockPriceContainer}>
                <Text style={styles.stockPrice}>
                  ${currentItem.current_price.toLocaleString()}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center', // Vertically center
                    justifyContent: 'center',
                    marginTop: '1%',
                  }}>
                  <Icon
                    name={
                      currentTimeFramePrice?.percentChange > 0
                        ? 'arrow-drop-up'
                        : 'arrow-drop-down'
                    }
                    type="materialicons"
                    color={
                      currentTimeFramePrice?.percentChange > 0
                        ? '#2FBE6A'
                        : '#E14C4C'
                    }
                    size={20}
                  />
                  <Text
                    style={{
                      color:
                        currentTimeFramePrice?.percentChange > 0
                          ? '#2FBE6A'
                          : '#E14C4C',
                      fontFamily: 'Unbounded-ExtraBold',
                      fontSize: 14,

                      textAlign: 'center',
                    }}>
                    {currentTimeFramePrice?.percentChange.toFixed(2)}%{' '}
                    {` ( ${getRelativeTime()} )`}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.chartContainer}>
              <TradingViewChart width={screenWidth} height={300} />
            </View>
            <FlatList
              horizontal
              keyExtractor={(x, i) => i.toString()}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  onPress={() => {
                    onTimeFrameChange(index);
                  }}
                  style={
                    timeFrameSelected === item
                      ? {
                          borderRadius: 1000,
                          backgroundColor: '#191024',
                          paddingHorizontal: 16,
                          paddingVertical: 8,
                        }
                      : {
                          borderRadius: 1000,
                          backgroundColor: 'transparent',
                          paddingHorizontal: 16,
                          paddingVertical: 8,
                        }
                  }>
                  <Text
                    style={
                      timeFrameSelected === item
                        ? {
                            color: '#BC88FF',
                            fontSize: 14,
                          }
                        : {
                            color: '#787878',
                            fontSize: 14,
                          }
                    }>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              data={availableTimeFrame}
            />
          </View>
        </View>
      </View>
      <View style={styles.longshortContainer}>
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
                fontFamily: 'Montreal-Medium',
                fontSize: 16,
              }}>
              Amount owned
            </Text>
            <Text
              style={{
                color: '#F0F0F0',
                fontSize: 24,
                fontFamily: `Unbounded-Bold`,
                marginTop: '1%',
              }}>
              $
              {selectedAssetWalletHolding?.total_wallet_balance?.toFixed(2) ||
                0.0}
            </Text>
            <Text
              style={{
                color: '#BC88FF',
                fontFamily: 'Unbounded-ExtraBold',
                textTransform: 'uppercase',
                fontSize: 14,
              }}>
              {(
                selectedAssetWalletHolding?.total_wallet_balance /
                currentItem?.current_price
              )?.toFixed(2) === 'Nan'
                ? 0
                : (
                    selectedAssetWalletHolding?.total_wallet_balance /
                    currentItem?.current_price
                  )?.toFixed(2)}
              {` ${currentItem.symbol}`}
            </Text>
          </View>
        </TouchableOpacity>
        <View
          style={{
            height: 50,
            marginHorizontal: '5%',
            justifyContent: 'space-evenly',
            flexDirection: 'row',
            borderRadius: 6,
            marginTop: '13%',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              height: '100%',
              width: '100%',
              borderRadius: 6,
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
            }}
            onPress={() => {
              navigation.navigate('TradePage', {state: currentItem});
              // <TradePage navigation={props.navigation} />;
            }}>
            <LinearGradient
              useAngle={true}
              angle={150}
              colors={['#BC88FF', '#BC88FF']}
              style={{
                width: '100%',
                borderRadius: 100,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: '#000',
                  fontSize: 14,
                  fontFamily: 'Unbounded-ExtraBold',
                }}>
                {/* TRADE {state.item.symbol.toUpperCase()} */}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            height: 50,
            borderRadius: 10,
            backgroundColor: '#1C1B20',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 4,
            marginVertical: 24,
            marginHorizontal: '5%',
          }}>
          <TouchableOpacity
            style={
              state?.section === 'news'
                ? {
                    padding: 9,
                    paddingHorizontal: 30,
                    fontWeight: 'bold',
                    backgroundColor: '#5B5A60',
                    borderRadius: 10,
                    color: '#FAF9FC',
                    fontSize: 0.85,
                    cursor: 'pointer',
                  }
                : {
                    color: '#ADADAF',
                    fontWeight: 'bold',
                    fontSize: 0.85,
                    padding: 12,
                    paddingHorizontal: 30,
                    cursor: 'pointer',
                  }
            }
            onPress={() => setState({...state, section: 'news'})}>
            <Text style={{color: '#FFFFFF'}}>News</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={
              state?.section === 'degenai'
                ? {
                    padding: 9,
                    paddingHorizontal: 30,
                    fontWeight: 'bold',
                    backgroundColor: '#5B5A60',
                    borderRadius: 10,
                    color: '#FAF9FC',
                    fontSize: 0.85,
                    cursor: 'pointer',
                  }
                : {
                    color: '#ADADAF',
                    fontWeight: 'bold',
                    fontSize: 0.85,
                    padding: 12,
                    paddingHorizontal: 30,
                    cursor: 'pointer',
                  }
            }>
            <Text style={{color: '#FFFFFF'}}>Degen AI</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={
              state?.section === 'about'
                ? {
                    padding: 9,
                    paddingHorizontal: 30,
                    fontWeight: 'bold',
                    backgroundColor: '#5B5A60',
                    borderRadius: 10,
                    color: '#FAF9FC',
                    fontSize: 0.85,
                    cursor: 'pointer',
                  }
                : {
                    color: '#ADADAF',
                    fontWeight: 'bold',
                    fontSize: 0.85,
                    padding: 12,
                    paddingHorizontal: 30,
                    cursor: 'pointer',
                  }
            }>
            <Text style={{color: '#FFFFFF'}}>About</Text>
          </TouchableOpacity>
        </View>

        <View style={{paddingHorizontal: '5%'}}>
          {state?.section === 'news' ? (
            news?.map((data, index) => (
              <View
                key={index}
                style={{
                  marginBottom: 50,
                  alignItems: 'flex-start',
                  gap: 10,
                }}>
                <TouchableOpacity onPress={() => Linking.openURL(data.url)}>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 5,
                      color: 'gray',
                      alignItems: 'center',
                    }}>
                    <Text style={{fontSize: 13, color: 'gray'}}>
                      {formatDate(data.published_at).time}
                    </Text>
                    <Text style={{marginHorizontal: 5, color: 'gray'}}>·</Text>
                    <Text style={{fontSize: 13, color: 'gray'}}>
                      {formatDate(data.published_at).date}
                    </Text>
                    <Text style={{marginHorizontal: 5, color: 'gray'}}>·</Text>
                    <Text style={{fontSize: 13, color: 'gray'}}>
                      {capitalizeFirstLetter(data.source.title)}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 24,
                      color: '#D1D2D9',
                      fontFamily: 'Satoshi-Bold',
                      textAlign: 'justify',
                    }}>
                    {data.title}
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          ) : state?.section === 'about' ? (
            <View
              style={{
                width: '100%',
                flexDirection: 'column',
              }}>
              <Text
                style={{
                  color: '#ffffff',
                  fontSize: 24,
                  fontFamily: 'Satoshi-Bold',
                  letterSpacing: 0.1,
                }}>
                About
              </Text>
              {/* ReadMoreLess component with inline styling */}
              {/* <ReadMoreLess text={state.about} maxChars={300} /> */}
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 15,
                }}></View>
              <View
                style={{
                  height: 1,
                  width: '100%',
                  backgroundColor: '#282A2F',
                  marginVertical: 12,
                }}></View>
              <Text
                style={{
                  color: '#ffffff',
                  fontSize: 24,
                  fontFamily: 'Satoshi-Bold',
                  letterSpacing: 0.1,
                }}>
                Market Stats
              </Text>
              <View style={{width: '100%', flexDirection: 'column'}}>
                {/* Market Cap */}
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}>
                  <Text
                    style={{
                      color: '#82828f',
                      textAlign: 'center',
                      borderBottomWidth: 0.5,
                      borderBottomColor: '#82828f',
                      fontSize: 14,
                    }}>
                    Market Cap
                  </Text>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      textAlign: 'center',
                      fontSize: 13,
                      color: 'white',
                    }}>
                    {/* $ {state.marketCap.toLocaleString()} */}
                  </Text>
                </View>

                {/* All Time High */}
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      color: '#82828f',
                      textAlign: 'center',
                      borderBottomWidth: 0.5,
                      borderBottomColor: '#82828f',
                      fontSize: 14,
                    }}>
                    All Time High
                  </Text>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      textAlign: 'center',
                      fontSize: 13,
                      color: 'white',
                    }}>
                    {/* $ {state.allTimeHigh.toLocaleString()} */}
                  </Text>
                </View>

                {/* All Time Low */}
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      color: '#82828f',
                      textAlign: 'center',
                      borderBottomWidth: 0.5,
                      borderBottomColor: '#82828f',
                      fontSize: 14,
                    }}>
                    All Time Low
                  </Text>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      textAlign: 'center',
                      fontSize: 13,
                      color: 'white',
                    }}>
                    {/* $ {state.allTimeLow} */}
                  </Text>
                </View>

                {/* Fully Diluted Value */}
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      color: '#82828f',
                      textAlign: 'center',
                      borderBottomWidth: 0.5,
                      borderBottomColor: '#82828f',
                      fontSize: 14,
                    }}>
                    Fully Diluted Value
                  </Text>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      textAlign: 'center',
                      fontSize: 13,
                      color: 'white',
                    }}>
                    {/* $ {state.fully_diluted_valuation.toLocaleString()} */}
                  </Text>
                </View>

                {/* Total Volume Locked */}
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 5,
                  }}></View>
              </View>
            </View>
          ) : (
            <View
              style={{
                height: 500,
                width: '100%',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View>
                <Image
                  source={ImageAssets.algoImg}
                  style={{height: 200, width: 200}}
                />
              </View>
              <View
                style={{
                  marginBottom: 50,
                  alignItems: 'flex-start',
                  gap: 10,
                }}>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: '#D1D2D9',
                    textAlign: 'justify',
                  }}>
                  Coming Soon
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
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
