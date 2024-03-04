import React, { useEffect, useRef, useState } from 'react';
// import * as React from 'react'
import {
    PanResponder,
    Dimensions,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
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

export default InteractiveChart;

function InteractiveChart() {
    const apx = (size = 0) => {
        let width = Dimensions.get('window').width;
        return (width / 750) * size;
    };

    const [dateList, setDateList] = useState([
        '08-31 15:09',
        '08-31 15:10',
        '08-31 15:11',
        '08-31 15:12',
        '08-31 15:13',
    ]);
    const [priceList, setPriceList] = useState([
       444,
        454,
       678,
       567,
   456,
    ]);
    const timeframes = [
        { label: 'LIVE', value: '1M' },
        { label: '1H', value: '1H' },
        { label: '1D', value: '1D' },
        { label: '7D', value: '7D' },
        { label: '30D', value: '30D' },
        { label: '1Y', value: '1Y' },
        { label: '5Y', value: '5Y' },
        { label: 'All', value: '' },
      ];
      const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
      
    const size = useRef(dateList.length);

    const [positionX, setPositionX] = useState(-1);// The currently selected X coordinate position

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
            stroke="#BC88FF"
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
                        fill="#BC88FF"
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
        backgroundColor: selectedTimeframe === timeframe.value ? '#191024' : 'transparent',
        borderRadius: apx(20),
      }}
      onPress={() => setSelectedTimeframe(timeframe.value)}>
      <Text style={{ color: selectedTimeframe === timeframe.value ? '#BC88FF' : '#787878' }}>
        {timeframe.label}
      </Text>
    </TouchableOpacity>
  ))}
</View>

        </View>
    );
}