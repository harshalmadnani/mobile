import React, { useEffect, useRef, useState } from 'react';
// import * as React from 'react'
import {
    PanResponder,
    Dimensions,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styles from '../../screens/loggedIn/investments/investment-styles';
import { AreaChart, XAxis, YAxis } from 'react-native-svg-charts';
import {
    Circle,
    Defs,
    G,
    Line,
    LinearGradient,
    Path,
    Rect,
    Stop,
    Text as SvgText,
} from 'react-native-svg';
import * as shape from 'd3-shape';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { getWalletHistoricalData } from '../../utils/cryptoWalletApi';
export default InteractiveChart;

function InteractiveChart() {
    const dispatch = useDispatch();
const [history, setHistory] = useState();
const [divisionResult , setDivisionResult ] = useState('0');
const [currentPrice, setcurrentPrice] = useState('0');
const address = useSelector(x => x.auth.address);
    const apx = (size = 0) => {
        let width = Dimensions.get('window').width;
        return (width / 750) * size;
    };
    useEffect(() => {
        async function init() {
          try {
            const data = await getWalletHistoricalData(address,from);
            console.log("Data from API",data);
            setHistory(data);
          } catch (e) {
            console.log(e);
          }
        }
        init();
      }, []);
    
    const initialState = {
        holdings: 0,
        balanceHistory: [],
        loading: false,
        error: null,
      };
    const [dateList, setDateList] = useState([
        '08-31 15:09',
        '08-31 15:10',
        '08-31 15:11',
        '08-31 15:12',
        '08-31 15:13',
    ]);
    const [priceList, setPriceList] = useState([
0,
0,
0,
0,
0
    ]);
    const now = new Date();
    const genesis = new Date(now.getFullYear(), 0, 1); // Start of the current year
    const oneHourAgo = new Date(now.getTime() - (1 * 60 * 60 * 1000));
    const oneDayAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    const oneMinuteAgo = new Date(now.getTime() - (5 * 60 * 1000));
    const timeframes = [
      { label: '1M', value: '1M', timestamp: oneMinuteAgo.getTime()},
      { label: '1H', value: '1H', timestamp: oneHourAgo.getTime() },
      { label: '1D', value: '1D', timestamp: oneDayAgo.getTime() },
      { label: '7D', value: '7D', timestamp: sevenDaysAgo.getTime() },
      { label: '30D', value: '30D', timestamp: thirtyDaysAgo.getTime() },
      { label: '1Y', value: '1Y', timestamp: oneYearAgo.getTime() },
      { label: 'All', value: '', timestamp: genesis.getTime() },
    ];
      const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
      useEffect(() => {
        const selectedTimeframeObject = timeframes.find(timeframe => timeframe.value === selectedTimeframe);
        const from = selectedTimeframeObject ? selectedTimeframeObject.timestamp : null;
        async function init() {
          if (from === null) return; // Early exit if timestamp is not found
      
          try {
            const data = await getWalletHistoricalData(address, from);
            console.log("Data from API", data);
            // Assuming data.balance_history is an array of [timestamp, price] pairs
            const prices = data.balance_history.map(entry => entry[1]); // Extracting the price part
            setPriceList(prices);
            setcurrentPrice(data.balance_usd);
          } catch (e) {
            console.log(e);
          }
        }
        init();
      }, [selectedTimeframe]);
    const size = useRef(dateList.length);
    const [positionX, setPositionX] = useState(-1);// The currently selected X coordinate position
    const [priceChange, setpriceChange] = useState('0');// The currently selected X coordinate position
    useEffect(() => {
        if (priceList.length > 1 || priceList[0]=='0') {
            const result = ((priceList[priceList.length - 1] - priceList[0]) / priceList[priceList.length - 1]) * 100;
            const test = (priceList[priceList.length - 1] - priceList[0]);
            setDivisionResult(result);
            setpriceChange(test); // Use the correct function name for setting state
        }
        else{
          setDivisionResult('0');
          setpriceChange('0'); // Use the correct function name for setting state
        }
    }, [priceList]);
    console.log('JMD',divisionResult);
    console.log('JMD',priceChange);
    const panResponder = useRef(
        PanResponder.create({
            // 要求成为响应者：
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderTerminationRequest: (evt, gestureState) => true,

            onPanResponderGrant: (evt, gestureState) => {
                updatePosition(evt.nativeEvent.locationX);
                return true;
            },
            onPanResponderMove: (evt, gestureState) => {
                updatePosition(evt.nativeEvent.locationX);
                return true;
            },
            onPanResponderRelease: () => {
                setPositionX(-1);
            },
        })
    );
    const updatePosition = (x) => {
        const YAxisWidth = apx(130);
        const x0 = apx(0);// x0 position
        const chartWidth = apx(750) - YAxisWidth - x0;
        const xN = x0 + chartWidth;//xN position
        const xDistance = chartWidth / size.current;// The width of each coordinate point
        if (x <= x0) {
            x = x0;
        }
        if (x >= xN) {
            x = xN;
        }

        // console.log((x - x0) )

        // The selected coordinate x :
        // (x - x0)/ xDistance = value
        let value = ((x - x0) / xDistance).toFixed(0);
        if (value >= size.current - 1) {
            value = size.current - 1; // Out of chart range, automatic correction
        }

        setPositionX(Number(value));
    };

    const CustomGrid = ({ x, y, ticks }) => (
        <G>

        </G>
    );

    const CustomLine = ({ line }) => (
        <Path
            key="line"
            d={line}
            stroke="#FFF"
            strokeWidth={apx(6)}
            fill="none"
        />
    );

    const CustomGradient = () => (
        <Defs key="gradient">
            <LinearGradient id="gradient" x1="0" y="0%" x2="0%" y2="100%">
                {/* <Stop offset="0%" stopColor="rgb(134, 65, 244)" /> */}
                {/* <Stop offset="100%" stopColor="rgb(66, 194, 244)" /> */}

                <Stop offset="0%" stopColor="#000" stopOpacity={0.25} />
                <Stop offset="100%" stopColor="#000" stopOpacity={0} />
            </LinearGradient>
        </Defs>
    );

    const Tooltip = ({ x, y, ticks }) => {
        if (positionX < 0) {
            return null;
        }

        const date = dateList[positionX];
        return (
            <G x={x(positionX)} key="tooltip">
                {/* <G
                    x={positionX > size.current / 2 ? -apx(300 + 10) : apx(10)}
                    y={y(priceList[positionX]) - apx(10)}>
                    <Rect
                        y={-apx(24 + 24 + 20) / 2}
                        rx={apx(12)} // borderRadius
                        ry={apx(12)} // borderRadius
                        width={apx(200)}
                        height={apx(96)}
                        fill="#787878"
                    />

                    <SvgText x={apx(20)} fill="#000" opacity={0.65} fontSize={apx(24)}>
                        {date}
                    </SvgText>
                    <SvgText
                        x={apx(20)}
                        y={apx(24 + 20)}
                        fontSize={apx(24)}
                        fontWeight="bold"
                        fontFamily='Unbounded-Medium'
                        fill="#fff">
                        ${priceList[positionX]}
                    </SvgText>
                </G> */}

                <G x={x}>
                    <Line
                        y1={ticks[0]}
                        y2={ticks[Number(ticks.length)]}
                        stroke="#787878"
                        strokeWidth={apx(4)}
                        strokeDasharray={[6, 3]}
                    />

                    <Circle
                        cy={y(priceList[positionX])}
                        r={apx(20 / 2)}
                        stroke="#000"
                        strokeWidth={apx(2)}
                        fill="#FFF"
                    />
                </G>
            </G>
        );
    };

    const verticalContentInset = { top: apx(40), bottom: apx(40) };

    return (
        <View
            style={{
                backgroundColor: '#000',
                alignItems: 'stretch',
            }}>
                            <View style={styles.portfoioPriceContainer}>
                <Text style={styles.stockPrice}>
                {/* ${Number(holdings?.total_wallet_balance || 'Loading...').toFixed(2).toLocaleString('en-US')} */}
                  {/* {currentItem.current_price.toLocaleString()} */}
                  ${Number(currentPrice || '0').toFixed(2).toLocaleString('en-US')}
                </Text>
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
  }}
>
  ${Number(priceChange || 0).toFixed(2).toLocaleString('en-US')} ({Number(divisionResult || 0).toFixed(2).toLocaleString('en-US')}%)
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
                <View style={{ flex: 1 }} {...panResponder.current.panHandlers}>
                    <AreaChart
                        style={{ flex: 1 }}
                        data={priceList}
                        // curve={shape.curveNatural}
                        curve={shape.curveMonotoneX}
                        contentInset={{ ...verticalContentInset }}
                        svg={{ fill: 'url(#gradient)' }}>
                        <CustomLine />
                        <CustomGrid />
                        <CustomGradient />
                        <Tooltip />
                    </AreaChart>
                </View>

            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: apx(20) }}>
  {timeframes.map((timeframe) => (
    <TouchableOpacity
      key={timeframe.value}
      style={{
        padding: apx(15),
        backgroundColor: selectedTimeframe === timeframe.value ? '#343434' : 'transparent',
        borderRadius: apx(20),
      }}
      onPress={() => {        const options = {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      }; ReactNativeHapticFeedback.trigger("impactHeavy", options); setSelectedTimeframe(timeframe.value)}}>
      <Text style={{ color: selectedTimeframe === timeframe.value ? '#FFF' : '#787878' }}>
        {timeframe.label}
      </Text>
    </TouchableOpacity>
  ))}
</View>

        </View>
    );
}