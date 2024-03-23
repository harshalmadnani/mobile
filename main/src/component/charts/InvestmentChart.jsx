import React, {useCallback, useEffect, useRef, useState} from 'react';
// import * as React from 'react'
import {LineChart} from 'react-native-wagmi-charts';
import {
  PanResponder,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styles from '../../screens/loggedIn/investments/investment-styles';
import {getHistoricalData} from '../../utils/cryptoMarketsApi';
import {useFocusEffect} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
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

function InteractiveChart({assetName}) {
  const dispatch = useDispatch();
  const [divisionResult, setDivisionResult] = useState(0);
  const [currentPrice, setcurrentPrice] = useState(0);
  const [touchActive, setTouchActive] = useState(false);
  const apx = (size = 0) => {
    let width = Dimensions.get('window').width;
    return (width / 750) * size;
  };

  const [priceList, setPriceList] = useState([]);
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
  const oneMinuteAgo = new Date(now.getTime() - 1 * 60 * 1000);
  const timeframes = [
    {label: '1H', value: '1H', timestamp: oneHourAgo.getTime()},
    {label: '1D', value: '1D', timestamp: oneDayAgo.getTime()},
    {label: '7D', value: '7D', timestamp: sevenDaysAgo.getTime()},
    {label: '30D', value: '30D', timestamp: thirtyDaysAgo.getTime()},
    {label: '1Y', value: '1Y', timestamp: oneYearAgo.getTime()},
    {label: 'All', value: '', timestamp: genesis.getTime()},
  ];
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  useEffect(() => {
    const selectedTimeframeObject = timeframes.find(
      timeframe => timeframe.value === selectedTimeframe,
    );
    const from = selectedTimeframeObject
      ? selectedTimeframeObject.timestamp
      : null;
    async function init() {
      if (from === null) return; // Early exit if timestamp is not found
      try {
        const data = await getHistoricalData(assetName, from);
        const historicalPriceXYPair = data.price_history.map(entry => {
          return {timestamp: entry[0], value: entry[1]};
        });

        setPriceList(historicalPriceXYPair);
        setcurrentPrice(data?.price_history[data?.price_history.length - 1][1]);
      } catch (e) {
        console.log(e);
      }
    }
    init();
  }, [selectedTimeframe]);

  useFocusEffect(
    useCallback(async () => {
      async function initialHistoryFetch() {
        try {
          const selectedTimeframeObject = timeframes.find(
            timeframe => timeframe.value === selectedTimeframe,
          );
          const from = selectedTimeframeObject
            ? selectedTimeframeObject.timestamp
            : null;

          const data = await getHistoricalData(assetName, from);
          const historicalPriceXYPair = data.price_history.map(entry => {
            return {timestamp: entry[0], value: entry[1]};
          });
          setPriceList(historicalPriceXYPair);
          // Extracting the price part
          setcurrentPrice(
            data?.price_history[data?.price_history.length - 1][1],
          );
        } catch (e) {
          console.log(e);
        }
      }
      await initialHistoryFetch();
      return () => {
        // Perform any clean-up tasks here, such as cancelling requests or clearing state
      };
    }, []),
  );

  // The currently selected X coordinate position
  const [priceChange, setpriceChange] = useState(0); // The currently selected X coordinate position

  useEffect(() => {
    if (priceList.length > 1 || priceList?.[0]?.value === '0') {
      const result =
        ((priceList?.[priceList.length - 1]?.value - priceList?.[0]?.value) /
          priceList[priceList.length - 1]?.value) *
        100;
      const test = priceList[priceList.length - 1]?.value - priceList[0]?.value;
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
                maxHeight: 50,
              }}>
              <Text style={styles.stockPrice}>$</Text>
              <Text style={styles.stockPrice}>
                {Number(currentPrice || '0')
                  .toFixed(2)
                  .toLocaleString('en-US')}
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
                .toFixed(2)
                .toLocaleString('en-US')}{' '}
              (
              {Number(divisionResult || 0)
                .toFixed(2)
                .toLocaleString('en-US')}
              %)
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: apx(750),
            height: apx(500),
            alignSelf: 'stretch',
          }}>
          {priceList.length > 0 ? (
            <GestureHandlerRootView>
              <LineChart width={apx(750)} height={apx(500)}>
                <LineChart.Path color="white">
                  <LineChart.Gradient />
                </LineChart.Path>
                <LineChart.Tooltip>
                  <LineChart.DatetimeText />
                </LineChart.Tooltip>
                <LineChart.CursorCrosshair
                  color="white"
                  onActivated={() => {
                    const options = {
                      enableVibrateFallback: true,
                      ignoreAndroidSystemSettings: false,
                    };
                    ReactNativeHapticFeedback.trigger('impactHeavy', options);
                    setTouchActive(true);
                  }}
                  onEnded={() => {
                    setTouchActive(false);
                  }}
                />
              </LineChart>
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
              key={timeframe.value}
              style={{
                padding: apx(15),
                backgroundColor:
                  selectedTimeframe === timeframe.value
                    ? '#343434'
                    : 'transparent',
                borderRadius: apx(20),
              }}
              onPress={() => {
                const options = {
                  enableVibrateFallback: true,
                  ignoreAndroidSystemSettings: false,
                };
                ReactNativeHapticFeedback.trigger('impactHeavy', options);
                setSelectedTimeframe(timeframe.value);
              }}>
              <Text
                style={{
                  color:
                    selectedTimeframe === timeframe.value ? '#FFF' : '#787878',
                }}>
                {timeframe.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </LineChart.Provider>
  );
}
