import React, {useEffect, useState} from 'react';
import {Dimensions, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styles from '../../screens/loggedIn/investments/investment-styles';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {LineChart} from 'react-native-wagmi-charts';
import {useFocusEffect} from '@react-navigation/native';
import {w3cwebsocket as W3CWebSocket} from 'websocket';
import { getCurrencyIcon } from '../../utils/currencyicon';
function InteractiveChart() {
  const dispatch = useDispatch();

  const [divisionResult, setDivisionResult] = useState('0');
  const [estimatedHistory, setEstimatedHistory] = useState([
    {timestamp: 0, value: 0},
    {timestamp: 0, value: 0},
  ]);
  const isUsd = useSelector(x => x.auth.isUsd);
  const exchRate = useSelector(x => x.auth.exchRate);
  const currency_name = useSelector(x => x.auth.currency);
  const [currentPrice, setCurrentPrice] = useState('0');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [priceChange, setPriceChange] = useState('0');
  const [touchActive, setTouchActive] = useState(false);
  const apx = (size = 0) => {
    let width = Dimensions.get('window').width;
    return (width / 750) * size;
  };
  const evmInfo = useSelector(x => x.portfolio.evmInfo);
  const allScw = useSelector(x => x.auth.scw);
  const [priceList, setPriceList] = useState([
    {timestamp: 0, value: 0},
    {timestamp: 0, value: 0},
  ]);
  const now = new Date();
  const currency_icon = getCurrencyIcon(currency_name);
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
    if (from === null) return; // Early exit if timestamp is not found

    let historicalPriceXYPair = estimatedHistory?.map(entry => {
      return {timestamp: entry[0], value: entry[1]};
    });
    historicalPriceXYPair = historicalPriceXYPair.filter(
      x => x.timestamp >= from,
    );

    if (historicalPriceXYPair?.length > 0) {
      setPriceList(historicalPriceXYPair);
      setCurrentPrice(
        historicalPriceXYPair[historicalPriceXYPair.length - 1]?.value ?? 0,
      );
    }
  }, [selectedTimeframe]);

  useEffect(() => {
    if (estimatedHistory.length) {
      const selectedTimeframeObject = timeframes.find(
        timeframe => timeframe?.value === selectedTimeframe,
      );
      const from = selectedTimeframeObject
        ? selectedTimeframeObject.timestamp
        : null;

      let historicalPriceXYPair = estimatedHistory?.map(entry => {
        return {timestamp: entry[0], value: entry[1]};
      });
      historicalPriceXYPair = historicalPriceXYPair.filter(
        x => x.timestamp >= from,
      );
      if (historicalPriceXYPair?.length > 0) {
        setPriceList(historicalPriceXYPair);
      }
    }
  }, [estimatedHistory]);

  useEffect(() => {
    const ws = new W3CWebSocket(
      'wss://portfolio-api-wss-fgpupeioaa-uc.a.run.app',
    );
    if (allScw?.length) {
      const scwWallets = allScw.map(x => x.address);
      ws.onopen = () => {
        try {
          const payload = {
            explorer: {
              // wallet: `${scwWallets[0]}`,
              wallets: `${scwWallets.toString()}`,
            },
          };
          ws.send(JSON.stringify(payload));
        } catch (error) {
          console.log('Error on sending parsing.....', error);
        }
      };

      ws.onmessage = event => {
        try {
          const parsedData = JSON.parse(event?.data);
          setCurrentPrice(parsedData?.analysis?.estimated_balance);
          setEstimatedHistory(parsedData?.analysis?.estimated_history);
        } catch (error) {
          setEstimatedHistory([
            {timestamp: 0, value: 0},
            {timestamp: 0, value: 0},
          ]);
          console.log('Error on parsing.....charts', error);
        }
      };

      ws.onerror = event => {
        console.log('WebSocket error:', event);
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
      };
    }
    return () => {
      ws.close();
    };
  }, [allScw]);

  useEffect(() => {
    if (priceList?.length > 1 || priceList?.[0]?.value === '0') {
      const result =
        ((priceList?.[priceList.length - 1]?.value - priceList?.[0]?.value) /
          priceList[priceList.length - 1]?.value) *
        100;
      const test =
        priceList[priceList?.length - 1]?.value - priceList[0]?.value;
      setDivisionResult(result);
      setPriceChange(test);
    } else {
      setDivisionResult('0');
      setPriceChange('0');
    }
  }, [priceList]);

  return (
    <LineChart.Provider
      data={
        priceList.length > 0
          ? priceList
          : [
              {timestamp: 0, value: 0},
              {timestamp: 0, value: 0},
            ]
      }>
      <View style={{backgroundColor: '#000', alignItems: 'stretch'}}>
        <View style={styles.portfoioPriceContainer}>
          {touchActive ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={styles.stockPrice}>$</Text>
              <LineChart.PriceText style={styles.stockPrice} />
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={styles.stockPrice}>
                {isUsd ? `$` : `${currency_icon}`}
                {Number(isUsd ? currentPrice : currentPrice * exchRate || '0')
                  ?.toFixed(2)
                  ?.toLocaleString('en-US')}
              </Text>
            </View>
          )}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
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
              {isUsd ? `$` : `${currency_icon}`}
              {Number(isUsd ? priceChange : priceChange * exchRate || 0)
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
                <LineChart.Path color="white">
                  <LineChart.Gradient />
                </LineChart.Path>
                <LineChart.CursorCrosshair
                  color="white"
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
                setSelectedTimeframe(timeframe?.value);
              }}>
              <Text
                style={{
                  color:
                    selectedTimeframe === timeframe.value ? '#FFF' : '#787878',
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

export default InteractiveChart;
