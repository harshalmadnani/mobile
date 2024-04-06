import React, {useCallback, useEffect, useRef, useState} from 'react';
// import * as React from 'react'
import {Dimensions, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styles from '../../screens/loggedIn/investments/investment-styles';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {getWalletHistoricalData} from '../../utils/cryptoWalletApi';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {LineChart} from 'react-native-wagmi-charts';
import {useFocusEffect} from '@react-navigation/native';
import {getEvmAddresses} from '../../store/actions/portfolio';
export default InteractiveChart;
function CustomPriceText() {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text style={styles.stockPrice}>$</Text>
      <LineChart.PriceText style={styles.stockPrice} />
    </View>
  );
}
function InteractiveChart() {
  const dispatch = useDispatch();

  const [divisionResult, setDivisionResult] = useState('0');
  const [currentPrice, setcurrentPrice] = useState('0');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [priceChange, setpriceChange] = useState('0');
  const [touchActive, setTouchActive] = useState(false);
  const apx = (size = 0) => {
    let width = Dimensions.get('window').width;
    return (width / 750) * size;
  };
  const evmInfo = useSelector(x => x.portfolio.evmInfo);
  const [priceList, setPriceList] = useState([
    {timestamp: 0, value: 0},
    {timestamp: 0, value: 0},
  ]);
  const now = new Date();
  const genesis = new Date(now.getFullYear(), 0, 1); // Start of the current year
  const oneHourAgo = new Date(now.getTime() - 1 * 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const oneYearAgo = new Date(
    now.getFullYear() - 1,
    now.getMonth(),
    now.getDate(),
  );
  const oneMinuteAgo = new Date(now.getTime() - 5 * 60 * 1000);
  const timeframes = [
    {label: '1H', value: '1H', timestamp: oneHourAgo.getTime()},
    {label: '1D', value: '1D', timestamp: oneDayAgo.getTime()},
    {label: '7D', value: '7D', timestamp: sevenDaysAgo.getTime()},
    {label: '30D', value: '30D', timestamp: thirtyDaysAgo.getTime()},
    {label: '1Y', value: '1Y', timestamp: oneYearAgo.getTime()},
    {label: 'All', value: '', timestamp: genesis.getTime()},
  ];

  useEffect(() => {
    const selectedTimeframeObject = timeframes.find(
      timeframe => timeframe?.value === selectedTimeframe,
    );
    const from = selectedTimeframeObject
      ? selectedTimeframeObject?.timestamp
      : null;
    async function init() {
      if (from === null) return; // Early exit if timestamp is not found

      try {
        console.log('wallet history fetch...');
        const data = await getWalletHistoricalData(evmInfo?.smartAccount, from);
        const historicalPriceXYPair = data?.balance_history?.map(entry => {
          return {timestamp: entry[0], value: entry[1]};
        });
        console.log('wallet history......', historicalPriceXYPair.length);
        if (historicalPriceXYPair?.length > 0) {
          setPriceList(historicalPriceXYPair);
        }
        setcurrentPrice(data?.balance_usd ?? 0);
      } catch (e) {
        console.log(e);
      }
    }
    init();
  }, [selectedTimeframe]);
  useFocusEffect(
    useCallback(() => {
      async function initialHistoryFetch() {
        try {
          const selectedTimeframeObject = timeframes.find(
            timeframe => timeframe?.value === selectedTimeframe,
          );
          const from = selectedTimeframeObject
            ? selectedTimeframeObject.timestamp
            : null;
          const data = await getWalletHistoricalData(
            evmInfo?.smartAccount,
            from,
          );
          const historicalPriceXYPair = data?.balance_history?.map(entry => {
            return {timestamp: entry[0], value: entry[1]};
          });
          if (historicalPriceXYPair?.length > 0) {
            setPriceList(historicalPriceXYPair);
          }
          setcurrentPrice(data?.balance_usd ?? 0);
        } catch (e) {
          console.log(e);
        }
      }
      if (evmInfo?.smartAccount) {
        initialHistoryFetch();
      } else {
        dispatch(getEvmAddresses());
      }
      return () => {
        // Perform any clean-up tasks here, such as cancelling requests or clearing state
      };
    }, [evmInfo]),
  );
  // The currently selected X coordinate position
  useEffect(() => {
    if (priceList?.length > 1 || priceList?.[0]?.value === '0') {
      const result =
        ((priceList?.[priceList.length - 1]?.value - priceList?.[0]?.value) /
          priceList[priceList.length - 1]?.value) *
        100;
      const test =
        priceList[priceList?.length - 1]?.value - priceList[0]?.value;
      setDivisionResult(result);
      setpriceChange(test); // Use the correct function name for setting state
    } else {
      setDivisionResult('0');
      setpriceChange('0'); // Use the correct function name for setting state
    }
  }, [priceList]);

  return (
    <LineChart.Provider data={priceList}>
      <View
        style={{
          backgroundColor: '#000',
          alignItems: 'stretch',
        }}>
        <View style={styles.portfoioPriceContainer}>
          {touchActive ? (
            <CustomPriceText />
          ) : (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={styles.stockPrice}>
                $
                {Number(currentPrice || '0')
                  ?.toFixed(2)
                  ?.toLocaleString('en-US')}
              </Text>
            </View>
          )}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center', // Vertically center
              justifyContent: 'center',
              marginTop: '1%',
            }}>
            <Text
              style={{
                color: divisionResult < 0 ? '#FF5050' : '#ADFF6C',
                fontFamily: 'Unbounded-Medium',
                fontSize: 14,
                textAlign: 'center',
              }}>
              $
              {Number(priceChange || 0)
                ?.toFixed(2)
                ?.toLocaleString('en-US')}{' '}
              (
              {Number(divisionResult || 0)
                ?.toFixed(2)
                ?.toLocaleString('en-US')}
              %)
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: apx(750),
            height: apx(350),
            alignSelf: 'stretch',
          }}>
          {priceList?.length > 0 ? (
            <GestureHandlerRootView>
              <LineChart width={apx(750)} height={apx(350)}>
                <LineChart.Path
                  color={divisionResult < 0 ? '#FF5050' : '#ADFF6C'}>
                  <LineChart.Gradient />
                </LineChart.Path>
                <LineChart.CursorCrosshair
                  color={divisionResult < 0 ? '#FF5050' : '#ADFF6C'}
                  onActivated={() => {
                    setTouchActive(true);
                    const options = {
                      enableVibrateFallback: true,
                      ignoreAndroidSystemSettings: false,
                    };
                    ReactNativeHapticFeedback.trigger('impactHeavy', options);
                  }}
                  onEnded={() => {
                    setTouchActive(false);
                  }}
                />
              </LineChart>
              {/* </LineChart.Provider> */}
            </GestureHandlerRootView>
          ) : null}
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            padding: apx(20),
          }}>
          {timeframes.map(timeframe => (
            <TouchableOpacity
              key={timeframe?.value}
              style={{
                padding: apx(15),
                backgroundColor:
                  selectedTimeframe === timeframe?.value
                    ? divisionResult < 0
                      ? '#FF5050'
                      : '#ADFF6C'
                    : 'transparent',
                borderRadius: apx(20),
                opacity: 0.3,
              }}
              onPress={() => {
                const options = {
                  enableVibrateFallback: true,
                  ignoreAndroidSystemSettings: false,
                };
                ReactNativeHapticFeedback.trigger('impactHeavy', options);
                setSelectedTimeframe(timeframe?.value);
              }}>
              <Text
                style={{
                  color:
                    selectedTimeframe === timeframe.value
                      ? divisionResult < 0
                        ? '#FF5050'
                        : '#ADFF6C'
                      : '#787878',
                }}>
                {timeframe?.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </LineChart.Provider>
  );
}
