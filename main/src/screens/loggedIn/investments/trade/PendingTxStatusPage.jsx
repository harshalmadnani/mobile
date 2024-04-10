import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {Dimensions, SafeAreaView, TouchableOpacity} from 'react-native';
import {Text, View, Image} from 'react-native';
// import {TouchableOpacity} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import {Svg, Circle, Text as SvgText} from 'react-native-svg';
// import { View } from 'react-native-reanimated/lib/typescript/Animated';
const {BigNumber} = require('bignumber.js');
const PendingTxComponent = ({
  txQuoteInfo,
  formattedPercent,
  formattedCountdown,
  normalAmount,
  calculatePercentage,
}) => {
  return (
    <View style={{justifyContent: 'center'}}>
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
        <Circle
          cx="150"
          cy="150"
          r="99"
          stroke="#fff"
          strokeWidth="4"
          fill="transparent"
        />
        <Circle
          cx="150"
          cy="150"
          r="120"
          stroke="#000"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={[calculatePercentage, 256]}
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
          Time remaining: {formattedCountdown}
        </Text>
        <Text
          style={{
            fontFamily: 'Unbounded-Medium',
            fontSize: 12,
            textAlign: 'center',
            marginTop: '20%',
            color: '#949494',
          }}>
          {normalAmount?.toFixed(6)}{' '}
          {txQuoteInfo?.estimation?.dstChainTokenOut?.name ||
            txQuoteInfo?.action?.toToken?.name}{' '}
          {'\n'}
          are on the way
        </Text>
      </View>
    </View>
  );
};
const SuccessTxComponent = ({
  txQuoteInfo,
  tradeType,
  normalAmount,
  isStockTrade,
  stockInfo,
}) => {
  const navigation = useNavigation();
  return (
    <View style={{width: '100%'}}>
      <View style={{justifyContent: 'flex-start'}}>
        <View
          style={{
            justifyContent: 'center',
            alignSelf: 'center',
            marginTop: '20%',
          }}>
          <Image
            source={{
              uri: 'https://res.cloudinary.com/xade-finance/image/upload/v1710094353/ucvuadhlnkmbfn44aroo.png',
            }}
            style={{width: 200, height: 200}}
            // Replace with the URL of your image
          />
        </View>
        <Text
          style={{
            fontFamily: 'Unbounded-Bold',
            fontSize: 24,
            textAlign: 'center',
            marginTop: 24,
            color: '#fff',
          }}>
          {isStockTrade ? 'Order is Booked' : 'IT’S A SUCCESS!'}
        </Text>
        <Text
          style={{
            fontFamily: 'Unbounded-Medium',
            fontSize: 14,
            textAlign: 'center',
            marginTop: 24,
            color: '#949494',
          }}>
          You have successfully {isStockTrade ? 'placed order for' : 'bought'}{' '}
          {isStockTrade
            ? (parseFloat(normalAmount) - 2.5).toFixed(6)
            : normalAmount?.toFixed(6)}
          {isStockTrade
            ? ` USDC of ${stockInfo?.stock?.symbol} stocks`
            : txQuoteInfo?.estimation?.dstChainTokenOut?.name ||
              txQuoteInfo?.action?.toToken?.name}
        </Text>
      </View>
      <View style={{marginTop: '15%'}}>
        <View
          style={{
            // flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <LinearGradient
            colors={['#000', '#191919', '#fff']} // Replace with your desired gradient colors
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={{height: 2, width: '80%'}} // Adjust the height and width as needed
          />
        </View>
        <View
          style={{
            justifyContent: 'flex-start',
            marginVertical: '5%',
            paddingHorizontal: '8%',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              marginBottom: 16,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'NeueMontreal-Medium',
                alignSelf: 'flex-start',
                color: '#fff',
              }}>
              Entry Price:
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Unbounded-Medium',
                alignSelf: 'flex-end',
                color: '#fff',
              }}>
              $
              {tradeType === 'sell'
                ? txQuoteInfo?.action?.toToken?.priceUSD ||
                  (
                    txQuoteInfo?.estimation?.dstChainTokenOut?.amount /
                    Math.pow(
                      10,
                      txQuoteInfo?.estimation?.dstChainTokenOut?.decimals,
                    ) /
                    (txQuoteInfo?.estimation?.srcChainTokenIn?.amount /
                      Math.pow(
                        10,
                        txQuoteInfo?.estimation?.srcChainTokenIn?.decimals,
                      ))
                  ).toFixed(6)
                : //when same chain
                !isStockTrade
                ? txQuoteInfo?.action?.toToken?.priceUSD || //when cross chain
                  (
                    txQuoteInfo?.estimation?.srcChainTokenIn?.amount /
                    Math.pow(
                      10,
                      txQuoteInfo?.estimation?.srcChainTokenIn?.decimals,
                    ) /
                    (txQuoteInfo?.estimation?.dstChainTokenOut?.amount /
                      Math.pow(
                        10,
                        txQuoteInfo?.estimation?.dstChainTokenOut?.decimals,
                      ))
                  ).toFixed(6)
                : stockInfo?.priceInfo?.price}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              marginBottom: 16,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'NeueMontreal-Medium',
                alignSelf: 'flex-start',
                color: '#fff',
              }}>
              Estimated Fees:
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Unbounded-Medium',
                alignSelf: 'flex-end',
                color: '#fff',
              }}>
              $
              {txQuoteInfo?.estimation?.costsDetails
                ? tradeType === 'sell'
                  ? (
                      txQuoteInfo?.estimation?.costsDetails?.filter(
                        x => x.type === 'DlnProtocolFee',
                      )[0]?.payload?.feeAmount /
                      Math.pow(
                        10,
                        txQuoteInfo?.estimation?.srcChainTokenIn?.decimals,
                      )
                    ).toFixed(2)
                  : isStockTrade
                  ? 2.5
                  : txQuoteInfo?.estimation?.costsDetails?.filter(
                      x => x.type === 'DlnProtocolFee',
                    )[0]?.payload?.feeAmount /
                    Math.pow(
                      10,
                      txQuoteInfo?.estimation?.dstChainTokenOut?.decimals,
                    )
                : txQuoteInfo?.estimate?.gasCosts?.[0]?.amountUSD}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              marginBottom: 16,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'NeueMontreal-Medium',
                alignSelf: 'flex-start',
                color: '#fff',
              }}>
              Transaction took:
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Unbounded-Medium',
                alignSelf: 'flex-end',
                color: '#fff',
              }}>
              {' '}
              {txQuoteInfo?.order?.approximateFulfillmentDelay ||
                txQuoteInfo?.estimate?.executionDuration}
              s
            </Text>
          </View>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <LinearGradient
            colors={['#fff', '#191919', '#000']} // Replace with your desired gradient colors
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={{height: 2, width: '80%'}} // Adjust the height and width as needed
          />
        </View>
      </View>
      <TouchableOpacity
        style={{
          height: 50,
          marginTop: 24,
          backgroundColor: 'white',
          width: '90%',
          borderRadius: 16,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          marginTop: '20%',
        }}
        onPress={() => navigation.navigate('Portfolio')}>
        <Text
          style={{
            fontSize: 14,
            letterSpacing: 0.2,
            fontFamily: 'Unbounded-Bold',
            color: '#000',
            textAlign: 'center',
          }}>
          GO BACK
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const PendingTxStatusPage = ({route, navigation}) => {
  const {state, tradeType, isStockTrade, stockInfo, signature} = route.params;
  const txQuoteInfo = state;

  const [countdown, setCountdown] = useState(
    txQuoteInfo?.order?.approximateFulfillmentDelay ||
      txQuoteInfo?.estimate?.executionDuration,
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
    const totalDuration =
      txQuoteInfo?.order?.approximateFulfillmentDelay ||
      txQuoteInfo?.estimate?.executionDuration;
    const circumference = 2 * Math.PI * 40; // 40 is the radius of the circle
    return (countdown / totalDuration) * circumference;
  };
  const {width, height} = Dimensions.get('window');
  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  const weiAmount = new BigNumber(
    txQuoteInfo?.estimation?.dstChainTokenOut?.amount ||
      txQuoteInfo?.estimate?.toAmountMin,
  );
  const percent =
    (((txQuoteInfo?.order?.approximateFulfillmentDelay ||
      txQuoteInfo?.estimate?.executionDuration) -
      countdown) /
      (txQuoteInfo?.order?.approximateFulfillmentDelay ||
        txQuoteInfo?.estimate?.executionDuration)) *
    100;
  const formattedPercent = Math.round(percent) + '%';
  const normalAmount = weiAmount
    .div(
      10 **
        (txQuoteInfo?.estimation?.dstChainTokenOut.decimals ||
          txQuoteInfo?.action?.toToken?.decimals),
    )
    .toNumber();
  // {
  // }
  return (
    <SafeAreaView
      style={{
        backgroundColor: '#000',
        paddingBottom: 80,
        flex: 1,
        height,
        width,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {formattedPercent === '100%' ? (
        <SuccessTxComponent
          txQuoteInfo={txQuoteInfo}
          normalAmount={normalAmount}
          tradeType={tradeType}
          isStockTrade={isStockTrade}
          stockInfo={stockInfo}
        />
      ) : (
        <PendingTxComponent
          txQuoteInfo={txQuoteInfo}
          normalAmount={normalAmount}
          formattedPercent={formattedPercent}
          formattedCountdown={formatTime(countdown)}
          calculatePercentage={calculatePercentage()}
        />
      )}
    </SafeAreaView>
  );
};

export default PendingTxStatusPage;
