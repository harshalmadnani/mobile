import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {ImageAssets} from '../../../../../assets';
import {Icon} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import '@ethersproject/shims';
import {useDispatch, useSelector} from 'react-redux';
import {
  getBestDLNCrossSwapRateBuy,
  getBestDLNCrossSwapRateSell,
} from '../../../../store/actions/market';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
const DotLoading = ({loadingText}) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prevDots => (prevDots.length < 3 ? prevDots + '.' : ''));
    }, 500); // Change dot every 500 ms

    return () => clearInterval(interval);
  }, []);

  return <Text>{loadingText + dots}</Text>;
};
const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};
import {
  confirmDLNTransaction,
  confirmDLNTransactionPolToArb,
  getDLNTradeCreateBuyOrder,
  getDLNTradeCreateBuyOrderTxn,
} from '../../../../utils/DLNTradeApi';
import {
  getAuthCoreProviderEthers,
  switchAuthCoreChain,
} from '../../../../utils/particleCoreSDK';
import {
  getMarketOrderFeesEstimationFromDinari,
  placeMarketOrderToDinari,
} from '../../../../utils/Dinari/DinariApi';
import {LoginType} from '@particle-network/rn-auth';

const TradePage = ({route}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const [tradeType, setTradeType] = useState('buy');
  const [value, setValue] = useState('2');
  const [stockOrderStages, setStockOrderStages] = useState('Place Order');
  const [loading, setLoading] = useState(false);
  const [convertedValue, setConvertedValue] = useState('token');
  const [stockFee, setStockFee] = useState(0);
  const [stockDLNRes, setStockDLNRes] = useState(0);
  const [preparingTx, setPreparingTx] = useState(false);
  const width = Dimensions.get('window').width;
  const state = route.params.state;
  const tradeAsset = route.params.asset;
  const dispatch = useDispatch();
  const selectedAssetMetaData = useSelector(
    x => x.market.selectedAssetMetaData,
  );
  const items = [
    {left: 'SPOT MARKET', right: ' '},
    {left: 'SPOT LIMIT', right: 'COMING SOON'},
    {left: 'FUTURES MARKET', right: 'COMING SOON'},
    {left: 'FUTURES LIMIT', right: 'COMING SOON'},
    {left: 'BOTS', right: 'COMING SOON'},
  ];
  const holdings = useSelector(x => x.portfolio.holdings);
  const usdcValue = holdings?.assets?.filter(x => x.asset?.symbol === 'USDC');
  const bestSwappingBuyTrades = useSelector(x => x.market.bestSwappingTrades);
  const isStockTrade = useSelector(x => x.market.isStockTrade);
  const tokensToSell = isStockTrade ? tradeAsset?.[0]?.contracts_balances : [];
  const getDisplayText = () => {
    if (loading) return <DotLoading loadingText="Calculating" />;
    if (!bestSwappingBuyTrades) return 'Calculating....';
    if (bestSwappingBuyTrades.length === 0) return 'Try Again';
    if (preparingTx) return <DotLoading loadingText="CONFIRMING" />;
    return 'CONFIRM';
  };
  useEffect(() => {
    if (!isStockTrade) {
      if (tradeType === 'sell') {
        setLoading(true);
        console.log(tokensToSell);
        dispatch(
          getBestDLNCrossSwapRateSell(
            tokensToSell?.[0],
            value * Math.pow(10, tokensToSell?.[0]?.decimals),
          ),
        );
        setLoading(false);
      } else {
        getBestPrice();
      }
    } else {
      getCurrentStockTradingPrice();
    }
  }, [tradeType]);

  useEffect(() => {
    if (!isStockTrade) {
      if (tradeType === 'sell') {
        dispatch(
          getBestDLNCrossSwapRateSell(
            tokensToSell?.[0],
            value * Math.pow(10, tokensToSell?.[0]?.decimals),
          ),
        );
      } else {
        getBestPrice();
      }
    } else {
      if (value !== '0' && value) {
        getCurrentStockTradingPrice();
      }
    }
  }, [value]);

  const evmInfo = useSelector(x => x.portfolio.evmInfo);

  const getTradeSigningData = async () => {
    if (bestSwappingBuyTrades) {
      const res = await getDLNTradeCreateBuyOrderTxn(
        bestSwappingBuyTrades?.estimation?.srcChainTokenIn?.chainId ?? 137,
        bestSwappingBuyTrades?.estimation?.srcChainTokenIn?.address ??
          bestSwappingBuyTrades?.estimation?.tokenIn?.address,
        value *
          Math.pow(
            10,
            bestSwappingBuyTrades?.estimation?.tokenIn?.decimals ||
              bestSwappingBuyTrades?.estimation?.srcChainTokenIn?.decimals,
          ),
        bestSwappingBuyTrades?.estimation?.dstChainTokenOut?.chainId ?? 137,
        bestSwappingBuyTrades?.estimation?.dstChainTokenOut?.address ??
          bestSwappingBuyTrades?.estimation?.tokenOut?.address,
        bestSwappingBuyTrades?.estimation?.dstChainTokenOut?.amount ??
          bestSwappingBuyTrades?.estimation?.tokenOut?.minAmount,
        evmInfo?.smartAccount,
      );
      return res;
    } else {
      console.log('Here... no tx data');
    }
  };
  const getBestPrice = async () => {
    setLoading(true);
    dispatch(
      getBestDLNCrossSwapRateBuy(
        selectedAssetMetaData?.blockchains?.length > 0
          ? selectedAssetMetaData?.blockchains
          : [selectedAssetMetaData?.blockchain],
        selectedAssetMetaData?.contracts?.length > 0
          ? selectedAssetMetaData?.contracts
          : [selectedAssetMetaData?.address],
        value * 1000000, //USDC
      ),
    );
    setLoading(false);
  };
  const getCurrentStockTradingPrice = async () => {
    setStockOrderStages('Getting Quotes...');
    await switchAuthCoreChain(42161);
    const ethersProvider = getAuthCoreProviderEthers(LoginType.Email);
    const signerObj = await ethersProvider.getSigner();
    const res = await getDLNTradeCreateBuyOrder(
      137,
      '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
      (parseInt(value) + 2) * 1000000,
      42161,
      '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      signerObj.address,
    );
    const feesDinari = await getMarketOrderFeesEstimationFromDinari(
      state?.token?.address,
      '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      signerObj,
      res?.estimation?.dstChainTokenOut?.recommendedAmount,
      false,
    );
    await switchAuthCoreChain(137);
    setStockFee(
      feesDinari / 1000000 +
        res?.estimation?.costsDetails?.filter(
          x => x.type === 'DlnProtocolFee',
        )[0]?.payload?.feeAmount /
          Math.pow(10, res?.estimation?.dstChainTokenOut?.decimals),
    );
    setStockDLNRes(res);
    setStockOrderStages('Execute Order');
    console.log(
      'Feeessss.......',
      feesDinari,
      res?.estimation?.costsDetails?.filter(x => x.type === 'DlnProtocolFee')[0]
        ?.payload?.feeAmount /
        Math.pow(10, res?.estimation?.dstChainTokenOut?.decimals),
    );
  };
  const orderStockPrice = async () => {
    setStockOrderStages('Trading ARB USDC...');
    const res = await confirmDLNTransactionPolToArb(
      tradeType,
      stockDLNRes,
      (parseInt(value) + 2) * 1000000,
      stockDLNRes?.estimation?.srcChainTokenIn?.address,
      null,
      evmInfo?.smartAccount,
      evmInfo?.address,
    );
    // const res = true;
    if (res) {
      //after polling from Poly
      setTimeout(async () => {
        console.log('run........');
        setStockOrderStages('Placing Stock Order...');
        await switchAuthCoreChain(42161);
        const ethersProvider = getAuthCoreProviderEthers(LoginType.Email);
        const signerObj = await ethersProvider.getSigner();
        const feesDinari = await placeMarketOrderToDinari(
          state?.token?.address,
          '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
          signerObj,
          value * 1000000,
          false,
          evmInfo?.smartAccount,
        );
        setStockOrderStages('Stock Order Placed');
        await switchAuthCoreChain(137);
        if (feesDinari) {
          navigation.navigate('PendingTxStatus', {
            state: stockDLNRes,
            tradeType,
            isStockTrade,
            stockInfo: state,
          });
        }
      }, 6000);
    }
  };
  // Example of logging state changes
  useFocusEffect(
    useCallback(() => {
      if (isStockTrade) {
        getCurrentStockTradingPrice();
      } else {
        getBestPrice();
      }
      return () => {};
    }, []),
  );
  // Log when component mounts
  const {height} = Dimensions.get('window');
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
      style={{padding: 8, flex: 1, backgroundColor: '#000'}}>
      <SafeAreaView
        style={{
          backgroundColor: '#000',
          paddingBottom: 80,
          height: height,
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
        <View>
          {/* Top bar */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: '2%',
              width: width,
              marginBottom: 16,
            }}>
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingLeft: '5%',
                width: width * 0.9,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon
                  name={'navigate-before'}
                  size={30}
                  color={'#f0f0f0'}
                  type="materialicons"
                  onPress={() => navigation.goBack()}
                />

                <Text
                  style={{
                    fontSize: 16,
                    color: '#ffffff',
                    fontFamily: `Unbounded-Medium`,
                    marginLeft: '5%',
                  }}>
                  {state?.symbol?.toUpperCase() ??
                    state?.stock?.symbol?.toUpperCase()}
                  /USD
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  padding: 10,
                  borderRadius: 5,
                  flexDirection: 'row',
                  marginLeft: '30%',
                }}
                onPress={() => setModalVisible(true)}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 12,
                    fontFamily: 'Unbounded-Medium',
                  }}>
                  MARKET
                </Text>
                <Icon
                  name={'expand-more'}
                  size={20}
                  color={'#f0f0f0'}
                  type="materialicons"
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setIsDropDownOpen(!isDropDownOpen)}>
                <View></View>
                {/* Drop-down options go here */}
              </TouchableOpacity>
            </View>
          </View>

          {/* <ScrollView
        scrollEnabled
        // contentContainerStyle={{flexGrow: 1}} // Add this line to allow scrolling
      > */}
          {/* Market, Limit, Stop */}

          {/*Buy and Sell */}
          <View
            style={{
              flexDirection: 'row',
              borderRadius: 17,
              backgroundColor: '#151515',
              alignItems: 'center',
              height: 56,
              justifyContent: 'space-between',
              margin: 8,
              padding: 6,
              width: '90%',
              alignSelf: 'center',
            }}>
            <TouchableOpacity
              style={{width: '50%'}}
              onPress={() => {
                ReactNativeHapticFeedback.trigger('impactHeavy', options);
                setTradeType('buy');
                setConvertedValue('token');
              }}>
              {tradeType === 'buy' ? (
                <LinearGradient
                  colors={['#292929', '#292929']}
                  useAngle={true}
                  angle={93.68}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 22,
                    borderRadius: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 14,
                      fontFamily: 'Unbounded-Bold',
                      width: '40%',
                      textAlign: 'center',
                    }}>
                    BUY
                  </Text>
                </LinearGradient>
              ) : (
                <Text
                  style={{
                    color: '#848484',
                    fontFamily: 'Unbounded-Bold',
                    fontSize: 14,
                    textAlign: 'center',
                  }}>
                  BUY
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={{width: '50%'}}
              onPress={() => {
                if (Platform.OS === 'ios') {
                  ReactNativeHapticFeedback.trigger('impactMedium', options);
                }
                setTradeType('sell');
              }}>
              {tradeType === 'sell' ? (
                <LinearGradient
                  colors={['#292929', '#292929']}
                  useAngle={true}
                  angle={93.68}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 22,
                    borderRadius: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Unbounded-Medium',
                      color: '#fff',
                      fontSize: 14,
                      width: '40%',
                      textAlign: 'center',
                    }}>
                    SELL
                  </Text>
                </LinearGradient>
              ) : (
                <Text
                  style={{
                    color: '#848484',
                    fontFamily: 'Unbounded-Medium',
                    fontSize: 14,
                    textAlign: 'center',
                  }}>
                  SELL
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {tradeType === 'buy' ? (
            <View
              style={{
                marginTop: '5%',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: '#9d9d9d',
                  textAlign: 'center',
                  fontFamily: 'NeueMontreal-Medium',
                }}>
                Available to invest:{' '}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: '#fff',
                  textAlign: 'center',
                  fontFamily: 'Unbounded-Medium',
                }}>
                ${usdcValue?.[0]?.estimated_balance?.toFixed(2)}{' '}
              </Text>
            </View>
          ) : (
            <View
              style={{
                marginTop: '5%',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: '#fff',
                  textAlign: 'center',
                  fontFamily: 'Unbounded-Bold',
                }}>
                {tokensToSell?.[0]?.balance?.toFixed(2)}{' '}
                {state?.symbol?.toUpperCase() ??
                  state?.stock?.symbol?.toUpperCase()}{' '}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: '#7e7e7e',
                  textAlign: 'center',
                  fontFamily: 'NeueMontreal-Medium',
                }}>
                is available{' '}
              </Text>
            </View>
          )}
          <View style={{marginTop: '20%', marginBottom: '30%'}}>
            <View>
              {tradeType === 'sell' ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 8,
                  }}>
                  <TextInput
                    style={{
                      fontSize: 56,
                      color: '#ffffff',
                      textAlign: 'center',
                      fontFamily: 'Unbounded-Medium',
                    }}
                    value={value}
                    onChangeText={text => {
                      setValue(text);
                      ReactNativeHapticFeedback.trigger(
                        'impactMedium',
                        options,
                      );
                    }}
                    keyboardType="numeric"
                  />
                  <Text
                    style={{
                      fontSize: 56,
                      color: '#fff',
                      textAlign: 'center',
                      fontFamily: 'Unbounded-Medium',
                      alignSelf: 'center',
                    }}>
                    {state?.symbol?.toUpperCase() ||
                      state?.stock?.symbol?.toUpperCase()}
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 8,
                    // backgroundColor: 'red',
                  }}>
                  <Text
                    style={{
                      fontSize: 56,
                      color: '#fff',
                      textAlign: 'center',
                      fontFamily: 'Unbounded-Medium',
                      alignSelf: 'center',
                    }}>
                    $
                  </Text>
                  <TextInput
                    style={{
                      fontSize: 56,
                      color: '#ffffff',
                      textAlign: 'center',
                      fontFamily: 'Unbounded-Medium',
                    }}
                    value={value}
                    onChangeText={text => {
                      setValue(text);
                      ReactNativeHapticFeedback.trigger(
                        'impactMedium',
                        options,
                      );
                    }}
                    keyboardType="numeric"
                  />
                </View>
              )}
              <View>
                {tradeType === 'buy' ? (
                  <View
                    style={{
                      marginTop: 10,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        color: '#5C5C5C',
                        textAlign: 'center',
                        fontFamily: 'NeueMontreal-Medium',
                      }}>
                      You'll get{' '}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        color: '#b3b3b3',
                        textAlign: 'center',
                        fontFamily: 'Unbounded-Bold',
                      }}>
                      {isStockTrade
                        ? (value / state?.priceInfo?.price)?.toFixed(4)
                        : isNaN(
                            bestSwappingBuyTrades?.estimation?.dstChainTokenOut
                              ?.amount /
                              Math.pow(
                                10,
                                bestSwappingBuyTrades?.estimation
                                  ?.dstChainTokenOut?.decimals,
                              ),
                          )
                        ? (
                            bestSwappingBuyTrades?.estimate?.toAmountMin /
                            Math.pow(
                              10,
                              bestSwappingBuyTrades?.action?.toToken?.decimals,
                            )
                          ).toFixed(5)
                        : (
                            bestSwappingBuyTrades?.estimation?.dstChainTokenOut
                              ?.amount /
                            Math.pow(
                              10,
                              bestSwappingBuyTrades?.estimation
                                ?.dstChainTokenOut?.decimals,
                            )
                          ).toFixed(5)}
                      {` ${
                        state?.symbol?.toUpperCase() ??
                        state?.stock?.symbol?.toUpperCase()
                      }`}
                    </Text>
                  </View>
                ) : (
                  <View
                    style={{
                      marginTop: 1,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        color: '#5c5c5c',
                        textAlign: 'center',
                        fontFamily: 'NeueMontreal-Medium',
                      }}>
                      You'll get{' '}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        color: '#7e7e7e',
                        textAlign: 'center',
                        fontFamily: 'Unbounded-Bold',
                      }}>
                      {`${'$ '}`}
                      {isStockTrade
                        ? 0.0
                        : isNaN(
                            bestSwappingBuyTrades?.estimation?.dstChainTokenOut
                              ?.amount /
                              Math.pow(
                                10,
                                bestSwappingBuyTrades?.estimation
                                  ?.dstChainTokenOut?.decimals,
                              ),
                          )
                        ? (
                            bestSwappingBuyTrades?.estimate?.toAmountMin /
                            Math.pow(
                              10,
                              bestSwappingBuyTrades?.action?.toToken?.decimals,
                            )
                          ).toFixed(5)
                        : (
                            bestSwappingBuyTrades?.estimation?.dstChainTokenOut
                              ?.amount /
                            Math.pow(
                              10,
                              bestSwappingBuyTrades?.estimation
                                ?.dstChainTokenOut?.decimals,
                            )
                          ).toFixed(5)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/*order summary */}
          <View style={{marginTop: 0}}>
            <View
              style={{
                flex: 1,
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
                    ? bestSwappingBuyTrades?.action?.toToken?.priceUSD ||
                      (
                        bestSwappingBuyTrades?.estimation?.dstChainTokenOut
                          ?.amount /
                        Math.pow(
                          10,
                          bestSwappingBuyTrades?.estimation?.dstChainTokenOut
                            ?.decimals,
                        ) /
                        (bestSwappingBuyTrades?.estimation?.srcChainTokenIn
                          ?.amount /
                          Math.pow(
                            10,
                            bestSwappingBuyTrades?.estimation?.srcChainTokenIn
                              ?.decimals,
                          ))
                      ).toFixed(6)
                    : //when same chain

                    !isStockTrade
                    ? bestSwappingBuyTrades?.action?.toToken?.priceUSD || //when cross chain
                      (
                        bestSwappingBuyTrades?.estimation?.srcChainTokenIn
                          ?.amount /
                        Math.pow(
                          10,
                          bestSwappingBuyTrades?.estimation?.srcChainTokenIn
                            ?.decimals,
                        ) /
                        (bestSwappingBuyTrades?.estimation?.dstChainTokenOut
                          ?.amount /
                          Math.pow(
                            10,
                            bestSwappingBuyTrades?.estimation?.dstChainTokenOut
                              ?.decimals,
                          ))
                      ).toFixed(6)
                    : state?.priceInfo?.price}
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
                  {isStockTrade
                    ? stockFee
                    : bestSwappingBuyTrades?.estimation?.costsDetails
                    ? tradeType === 'sell'
                      ? (
                          bestSwappingBuyTrades?.estimation?.costsDetails?.filter(
                            x => x.type === 'DlnProtocolFee',
                          )[0]?.payload?.feeAmount /
                          Math.pow(
                            10,
                            bestSwappingBuyTrades?.estimation?.srcChainTokenIn
                              ?.decimals,
                          )
                        ).toFixed(2)
                      : bestSwappingBuyTrades?.estimation?.costsDetails?.filter(
                          x => x.type === 'DlnProtocolFee',
                        )[0]?.payload?.feeAmount /
                        Math.pow(
                          10,
                          bestSwappingBuyTrades?.estimation?.dstChainTokenOut
                            ?.decimals,
                        )
                    : bestSwappingBuyTrades?.estimate?.gasCosts?.[0]?.amountUSD}
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
                  Transaction will take:
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'Unbounded-Medium',
                    alignSelf: 'flex-end',
                    color: '#fff',
                  }}>
                  {' '}
                  {isStockTrade
                    ? '8 '
                    : bestSwappingBuyTrades?.order
                        ?.approximateFulfillmentDelay ??
                      bestSwappingBuyTrades?.estimate?.executionDuration}
                  s
                </Text>
              </View>
            </View>
            <View
              style={{
                flex: 1,
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
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: 'white',
            borderRadius: 17,
            paddingVertical: 22,
            paddingHorizontal: '30%',
            justifyContent: 'center',
            position: 'absolute',
            alignSelf: 'center',
            width: '90%',
            bottom: Platform.OS === 'ios' ? '10%' : '2%',
          }}
          onPress={async () => {
            try {
              if (Platform.OS === 'ios') {
                ReactNativeHapticFeedback.trigger('impactMedium', options);
              }
              if (isStockTrade) {
                await orderStockPrice();
              } else {
                if (!loading && bestSwappingBuyTrades && !preparingTx) {
                  if (tradeType === 'buy' && bestSwappingBuyTrades) {
                    setPreparingTx(true);

                    let res;
                    if (bestSwappingBuyTrades?.transactionRequest) {
                      res = bestSwappingBuyTrades;
                    } else {
                      res = await getTradeSigningData();
                    }

                    const signature = await confirmDLNTransaction(
                      tradeType,
                      res,
                      res?.estimation?.srcChainTokenIn?.amount ||
                        res?.action?.fromAmount,
                      res?.estimation?.srcChainTokenIn?.address ||
                        res?.action?.fromToken?.address,
                      res?.tx ?? res?.transactionRequest,
                      evmInfo?.smartAccount,
                      evmInfo?.address,
                    );
                    setPreparingTx(false);
                    if (signature) {
                      console.log(
                        'txn hash....',
                        JSON.stringify(res),
                        signature,
                      );
                      navigation.navigate('PendingTxStatus', {
                        state: res,
                        tradeType,
                      });
                    }
                  } else if (tradeType === 'sell' && bestSwappingBuyTrades) {
                    setPreparingTx(true);
                    let res;
                    if (bestSwappingBuyTrades?.transactionRequest) {
                      res = bestSwappingBuyTrades;
                    } else {
                      res = await getTradeSigningData();
                    }
                    if (
                      res?.estimation?.srcChainTokenIn?.chainId !== 137 &&
                      res?.estimation?.srcChainTokenIn?.chainId !== undefined
                    ) {
                      await switchAuthCoreChain(
                        res?.estimation?.srcChainTokenIn?.chainId,
                      );
                    }
                    const signature = await confirmDLNTransaction(
                      tradeType,
                      res,
                      res?.estimation?.srcChainTokenIn?.amount ||
                        res?.action?.fromAmount,
                      res?.estimation?.srcChainTokenIn?.address ||
                        res?.action?.fromToken?.address,
                      res?.tx ?? res?.transactionRequest,
                      evmInfo?.smartAccount,
                      evmInfo?.address,
                    );
                    setPreparingTx(false);
                    if (signature) {
                      console.log('txn hash', res, signature);
                      navigation.navigate('PendingTxStatus', {
                        state: res,
                        tradeType,
                      });
                    }
                  } else if (
                    bestSwappingBuyTrades !== null &&
                    bestSwappingBuyTrades.length === 0
                  ) {
                    await getBestPrice();
                  }
                }
              }
            } catch (err) {
              setPreparingTx(false);
            }
          }}>
          <Text
            style={{
              fontSize: 14,
              letterSpacing: 0.2,
              fontFamily: 'Unbounded-Bold',
              color: '#000',
              textAlign: 'center',
            }}>
            {isStockTrade ? stockOrderStages : getDisplayText()}
          </Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              backgroundColor: '#010101',
              padding: 20,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}>
            <View
              style={{
                paddingBottom: '20%',
              }}>
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  left: '-5%',
                  zIndex: 1,
                }}
                onPress={() => setModalVisible(!modalVisible)}>
                <Icon name="close" size={35} color="#fff" />
              </TouchableOpacity>
            </View>
            {items.map((item, index) => (
              <View
                key={index}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10%',
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 16,
                    fontFamily: 'Unbounded-Medium',
                  }}>
                  {item.left}
                </Text>
                {item.right !== ' ' && (
                  <View
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: 5,
                      padding: 5,
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 8,
                        fontFamily: 'Unbounded-Medium',
                      }}>
                      {item.right}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </Modal>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default TradePage;
