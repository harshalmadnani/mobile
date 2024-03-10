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
import InvestmentChart from '../../../../component/charts/InvestmentChart';
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
  const holdings = useSelector(x => x.portfolio.holdings);
  const currentAsset = holdings?.assets.filter(
    x => x.asset?.symbol === currentItem?.symbol.toUpperCase(),
  );
  const currentTimeFramePrice = useSelector(
    x => x.market.selectedTimeFramePriceInfo,
  );
  const fetchUserDetails = () => {
    if (global.withAuth) {
      authAddress = global.loginAccount.publicAddress;
      const scwAddress = global.loginAccount.scw;
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
      dispatch(
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

      dispatch(
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

      dispatch(
        setHistoricalDataOfSelectedTimeFrame(
          currentItem?.name,
          currentItem.current_price,
          unix,
        ),
      );
    }
    setTimeFrame(availableTimeFrame[index]);
  };

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
    dispatch(getCryptoHoldingForAddressFromMobula());
    dispatch(setAssetMetadata(currentItem?.name));
    const date = moment().subtract(1, 'days').format('YYYY-MM-DD');
    const unix = moment(date).unix() * 1000;
    dispatch(
      setHistoricalDataOfSelectedTimeFrame(
        currentItem?.name,
        currentItem.current_price,
        unix,
      ),
    );
  };
  useFocusEffect(
    useCallback(() => {
      onFocusFunction();
      return () => {
        // Perform any clean-up tasks here, such as cancelling requests or clearing state
      };
    }, []),
  );
  console.log('asset value', JSON.stringify(holdings));
  const {width, height} = Dimensions.get('window');
  return (
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
          {/* <TradingViewChart width={screenWidth} height={300} /> */}
          <InvestmentChart />
        </View>
        {/* <FlatList
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
                      backgroundColor: '#232323',
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
                        color: 'white',
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
        /> */}
      </View>
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
              fontFamily: 'Montreal-Bold',
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
            $ {currentAsset?.[0]?.estimated_balance?.toFixed(2) ?? 0.0}
          </Text>
          <Text
            style={{
              color: '#747474',
              fontFamily: 'Unbounded-ExtraBold',
              textTransform: 'uppercase',
              fontSize: 14,
            }}>
            {currentAsset?.[0]?.token_balance?.toFixed(6) ?? 0.0}
            {` ${currentItem.symbol}`}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          height: 52,
          width: '100%',
          borderRadius: 6,
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          marginTop: '30%',
        }}
        onPress={() => {
          if (holdings) {
            navigation.navigate('TradePage', {
              state: currentItem,
              asset: currentAsset,
            });
          }
        }}>
        <LinearGradient
          useAngle={true}
          angle={150}
          colors={['#fff', '#fff']}
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
            TRADE {currentItem.symbol.toUpperCase()}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
      <View style={styles.longshortContainer}></View>
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
