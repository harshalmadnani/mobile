import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native';
import {Text, View} from 'react-native';
import {Svg, Circle, Text as SvgText} from 'react-native-svg';
// import { View } from 'react-native-reanimated/lib/typescript/Animated';
const {BigNumber} = require('bignumber.js');
const SuccessTxStatusPage = ({route, navigation}) => {
  //   const txQuoteInfo = route.params.state;
  console.log('Pending Page');
  const txQuoteInfo = {
    estimation: {
      srcChainTokenIn: {
        address: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
        chainId: 137,
        decimals: 6,
        name: 'USD Coin',
        symbol: 'USDC',
        amount: '1000000',
        approximateOperatingExpense: '889937',
        mutatedWithOperatingExpense: false,
      },
      dstChainTokenOut: {
        address: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
        chainId: 56,
        decimals: 18,
        name: 'BTCB Token',
        symbol: 'BTCB',
        amount: '1601934437524',
        recommendedAmount: '1588405839425',
        maxTheoreticalAmount: '1613413752590',
      },
      costsDetails: [
        {
          chain: '137',
          tokenIn: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
          tokenOut: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
          amountIn: '1000000',
          amountOut: '999600',
          type: 'DlnProtocolFee',
          payload: {feeAmount: '400', feeBps: '4'},
        },
        {
          chain: '56',
          tokenIn: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
          tokenOut: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
          amountIn: '999600000000000000',
          amountOut: '999200160000000000',
          type: 'TakerMargin',
          payload: {feeAmount: '399840000000000', feeBps: '4'},
        },
        {
          chain: '56',
          tokenIn: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
          tokenOut: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
          amountIn: '999200160000000000',
          amountOut: '109262991824830256',
          type: 'EstimatedOperatingExpenses',
          payload: {feeAmount: '889937168175169744'},
        },
        {
          chain: '56',
          tokenIn: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
          tokenOut: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
          amountIn: '109262991824830256',
          amountOut: '1613413752590',
          type: 'AfterSwap',
        },
        {
          chain: '56',
          tokenIn: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
          tokenOut: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
          amountIn: '1613413752590',
          amountOut: '1588405839425',
          type: 'AfterSwapEstimatedSlippage',
          payload: {
            feeAmount: '25007913165',
            feeBps: '155',
            estimatedPriceDropBps: '155',
          },
        },
      ],
      recommendedSlippage: 1.55,
    },
    tx: {
      data: '0xb930370100000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000018e1a7fef7d00000000000000000000000000000000000000000000000000000000000003400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000036000000000000000000000000000000000000000000000000000000000000003800000000000000000000000003c499c542cef5e3811e1192ce70d8cc03d5c335900000000000000000000000000000000000000000000000000000000000f4240000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000174fabbac94000000000000000000000000000000000000000000000000000000000000003800000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000040042bf6f5bf12819e49336ac19bcb982919e600000000000000000000000000000000000000000000000000000000000001e000000000000000000000000000000000000000000000000000000000000002200000000000000000000000000000000000000000000000000000000000000240000000000000000000000000000000000000000000000000000000000000026000000000000000000000000000000000000000000000000000000000000000147130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000140040042bf6f5bf12819e49336ac19bcb982919e600000000000000000000000000000000000000000000000000000000000000000000000000000000000000140040042bf6f5bf12819e49336ac19bcb982919e6000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000041010400000051940d000000000000000000000000000000000041a65dd471010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      to: '0xeF4fB24aD0916217251F553c0596F8Edc630EB66',
      value: '500000000000000000',
    },
    order: {approximateFulfillmentDelay: 6},
    orderId:
      '0x39bd1fb15349b03010a80264e3ed9df698aa82ce5552e9191dc3ad01b728ea96',
    fixFee: '500000000000000000',
    userPoints: 0.59,
  };

  const [countdown, setCountdown] = useState(
    txQuoteInfo.order.approximateFulfillmentDelay,
  );
  useEffect(() => {
    const timer = setInterval(() => {
      // Decrement countdown every second until it reaches 0
      setCountdown(prevCountdown =>
        prevCountdown > 0 ? prevCountdown - 1 : 0,
      );
    }, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(timer);
  }, []);

  const calculatePercentage = () => {
    const totalDuration = txQuoteInfo.order.approximateFulfillmentDelay;
    const circumference = 2 * Math.PI * 40; // 40 is the radius of the circle
    return (countdown / totalDuration) * circumference;
  };

  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  const weiAmount = new BigNumber(
    txQuoteInfo.estimation.dstChainTokenOut.amount,
  );
  const percent =
    ((txQuoteInfo.order.approximateFulfillmentDelay - countdown) /
      txQuoteInfo.order.approximateFulfillmentDelay) *
    100;
  const formattedPercent = Math.round(percent) + '%';
  const normalAmount = weiAmount
    .div(10 ** txQuoteInfo.estimation.dstChainTokenOut.decimals)
    .toNumber();
  return (
    <SafeAreaView
      style={{
        backgroundColor: '#000',
        paddingBottom: 80,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Svg height="300" width="300">
        <Circle
          cx="150"
          cy="150"
          r="147"
          stroke="#fff"
          strokeWidth="4"
          fill="transparent"
        />

        <Circle
          cx="150"
          cy="150"
          r="120"
          stroke="#fff"
          strokeWidth="8"
          fill="transparent"
        />

        {/* Inner border circle */}
        <Circle
          cx="150"
          cy="150"
          r="99"
          stroke="#fff"
          strokeWidth="4"
          fill="transparent"
        />

        {/* Animated dash array circle */}
        <Circle
          cx="150"
          cy="150"
          r="120"
          stroke="#000"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={[calculatePercentage(), 256]}
          strokeDashoffset="0"
        />

        <SvgText
          x="50%"
          y="50%"
          textAnchor="middle"
          alignmentBaseline="middle"
          fontFamily="Unbounded-Medium"
          fontSize="48"
          fill="#fff">
          {formattedPercent}
        </SvgText>
      </Svg>

      <View style={{justifyContent: 'center', marginTop: '10%'}}>
        <Text
          style={{
            fontFamily: 'Unbounded-Medium',
            fontSize: 16,
            textAlign: 'center',
            color: '#fff',
          }}>
          TRANSACTION IS PENDING
        </Text>
        <Text
          style={{
            fontFamily: 'Unbounded-Medium',
            fontSize: 16,
            textAlign: 'center',
            marginTop: 10,
            color: '#fff',
          }}>
          Time remaining: {formatTime(countdown)}
        </Text>
        <Text
          style={{
            fontFamily: 'Unbounded-Medium',
            fontSize: 12,
            textAlign: 'center',
            marginTop: '20%',
            color: '#949494',
          }}>
          {normalAmount} {txQuoteInfo.estimation.dstChainTokenOut.name} {'\n'}
          are on the way
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default SuccessTxStatusPage;
