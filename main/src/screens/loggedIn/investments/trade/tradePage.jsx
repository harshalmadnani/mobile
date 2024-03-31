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
  getDLNTradeCreateBuyOrderTxn,
} from '../../../../utils/DLNTradeApi';
import {switchAuthCoreChain} from '../../../../utils/particleCoreSDK';

const TradePage = ({route}) => {
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);

  const openBottomSheet = () => {
    setBottomSheetVisible(true);
  };

  const closeBottomSheet = () => {
    setBottomSheetVisible(false);
  };
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation();
  const [tradeType, setTradeType] = useState('buy');
  const [orderType, setOrderType] = useState('market');
  const [selectedDropDownValue, setSelectedDropDownValue] = useState('Spot');
  const [value, setValue] = useState('5');
  const [loading, setLoading] = useState(false);
  const [convertedValue, setConvertedValue] = useState('token');
  const [preparingTx, setPreparingTx] = useState(false);
  const [commingSoon, setCommingSoon] = useState(false);
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
  const tokensToSell = tradeAsset?.[0]?.contracts_balances;
  const getDisplayText = () => {
    if (loading) return <DotLoading loadingText="Calculating" />;
    if (!bestSwappingBuyTrades) return 'Calculating....';
    if (bestSwappingBuyTrades.length === 0) return 'Try Again';
    if (preparingTx) return <DotLoading loadingText="CONFIRMING" />;
    return 'CONFIRM';
  };
  useEffect(() => {
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
  }, [tradeType]);

  useEffect(() => {
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
  // Example of logging state changes
  useFocusEffect(
    useCallback(() => {
      getBestPrice();
      return () => {};
    }, []),
  );
  // Log when component mounts
  console.log(
    bestSwappingBuyTrades?.estimation?.costsDetails?.filter(
      x => x.type === 'DlnProtocolFee',
    )[0]?.payload?.feeAmount,
    Math.pow(10, bestSwappingBuyTrades?.estimation?.srcChainTokenIn?.decimals),
  );
  return (
    <SafeAreaView
      style={{
        backgroundColor: '#000',
        paddingBottom: 80,
        flex: 1,
      }}>
      {/* Top bar */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: '3%',
          width: width,
          marginBottom: 24,
        }}>
        <View
          style={{
            // position: 'absolute',
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
              {state.symbol.toUpperCase()}/USD
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

          <TouchableOpacity onPress={() => setIsDropDownOpen(!isDropDownOpen)}>
            <View></View>
            {/* Drop-down options go here */}
          </TouchableOpacity>
        </View>
      </View>
      {commingSoon ? (
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          {/* Market, Limit, Stop */}
          <View
            style={{
              flexDirection: 'row',
              borderRadius: 17,
              backgroundColor: '#151515',
              alignItems: 'center',
              justifyContent: 'space-between',
              margin: 8,
              marginTop: 12,
              padding: 6,
            }}>
            <TouchableOpacity
              style={{width: '30%'}}
              onPress={() => setOrderType('market')}>
              {orderType === 'market' ? (
                <LinearGradient
                  colors={['#5038e1', '#b961ff']}
                  useAngle={true}
                  angle={103.64}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 22,
                    borderRadius: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}></LinearGradient>
              ) : (
                <Text
                  style={{
                    color: '#848484',
                    fontWeight: 'bold',
                    fontSize: 16,
                    textAlign: 'center',
                  }}>
                  Market
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={{width: '30%'}}
              onPress={() => setOrderType('limit')}>
              {orderType === 'limit' ? (
                <LinearGradient
                  colors={['#5038e1', '#b961ff']}
                  useAngle={true}
                  angle={103.64}
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
                      fontWeight: 'bold',
                      color: '#ffffff',
                      fontSize: 16,
                      fontFamily: 'Benzin-Semibold',
                      textAlign: 'center',
                    }}>
                    Limit
                  </Text>
                </LinearGradient>
              ) : (
                <Text
                  style={{
                    color: '#848484',
                    fontWeight: 'bold',
                    fontSize: 16,
                    textAlign: 'center',
                  }}>
                  Limit
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={{width: '30%'}}
              onPress={() => setOrderType('stop')}>
              {orderType === 'stop' ? (
                <LinearGradient
                  colors={['#5038e1', '#b961ff']}
                  useAngle={true}
                  angle={103.64}
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
                      fontWeight: 'bold',
                      color: '#ffffff',
                      fontSize: 16,
                      fontFamily: 'Benzin-Semibold',
                      textAlign: 'center',
                    }}>
                    Stop
                  </Text>
                </LinearGradient>
              ) : (
                <Text
                  style={{
                    color: '#848484',
                    fontWeight: 'bold',
                    fontSize: 16,
                    textAlign: 'center',
                  }}>
                  Stop
                </Text>
              )}
            </TouchableOpacity>
          </View>
          <Image
            source={
              selectedDropDownValue === 'Margin'
                ? ImageAssets.commingSoonImg
                : selectedDropDownValue === 'Algo'
                ? ImageAssets.commingSoonImg
                : orderType === 'limit'
                ? ImageAssets.commingSoonImg
                : ImageAssets.commingSoonImg
            }
            style={{width: 300, height: 300}}
          />
          <Text
            style={{
              fontSize: 22,
              fontWeight: 'bold',
              textAlign: 'center',
              fontFamily: 'Benzin-Semibold',
            }}>
            Coming Soon
          </Text>
        </View>
      ) : (
        <>
          <ScrollView
            scrollEnabled
            contentContainerStyle={{flexGrow: 1}} // Add this line to allow scrolling
          >
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
                  {state.symbol.toUpperCase()}{' '}
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
                {/* image to allow btc input */}
                {/* <Image source={ImageAssets.arrowImg} /> */}
              </View>
            )}
            <View style={{marginVertical: '10%'}}>
              {/*Input Number */}
              {tradeType === 'sell' ? (
                <View
                  style={{
                    marginTop: '5%',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 8,
                    fontFamily: 'Unbounded-Medium',
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
                    }}
                    keyboardType="numeric"
                  />

                  <Text
                    style={{
                      fontSize: 56,
                      fontFamily: 'Unbounded-Bold',
                      color: '#252525',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                    }}>
                    {state.symbol.toUpperCase()}
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    marginTop: 25,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 8,
                  }}>
                  <Text
                    style={{
                      fontSize: 56,
                      color: '#fff',
                      textAlign: 'center',
                      fontFamily: 'Unbounded-Medium',
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
                    {isNaN(
                      bestSwappingBuyTrades?.estimation?.dstChainTokenOut
                        ?.amount /
                        Math.pow(
                          10,
                          bestSwappingBuyTrades?.estimation?.dstChainTokenOut
                            ?.decimals,
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
                            bestSwappingBuyTrades?.estimation?.dstChainTokenOut
                              ?.decimals,
                          )
                        ).toFixed(5)}
                    {' ' + state?.symbol.toUpperCase()}
                  </Text>

                  {/* image to allow btc input */}
                  {/* <Image source={ImageAssets.arrowImg} /> */}
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
                    $
                    {isNaN(
                      bestSwappingBuyTrades?.estimation?.dstChainTokenOut
                        ?.amount /
                        Math.pow(
                          10,
                          bestSwappingBuyTrades?.estimation?.dstChainTokenOut
                            ?.decimals,
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
                            bestSwappingBuyTrades?.estimation?.dstChainTokenOut
                              ?.decimals,
                          )
                        ).toFixed(5)}
                  </Text>
                  {/* image to allow btc input */}
                  {/* <Image source={ImageAssets.arrowImg} /> */}
                </View>
              )}
            </View>
            {/*order summary */}
            <View style={{marginTop: '25%'}}>
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
              {/* ? (
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
                        ).toFixed(6) || */}
              <View
                style={{
                  flex: 1,
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
                      ? bestSwappingBuyTrades?.action?.toToken?.priceUSD?.toFixed(
                          5,
                        ) ||
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

                        bestSwappingBuyTrades?.action?.toToken?.priceUSD || //when cross chain
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
                              bestSwappingBuyTrades?.estimation
                                ?.dstChainTokenOut?.decimals,
                            ))
                        ).toFixed(6)}
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
                    {bestSwappingBuyTrades?.estimation?.costsDetails
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
                      : bestSwappingBuyTrades?.estimate?.gasCosts?.[0]
                          ?.amountUSD}
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
                    {bestSwappingBuyTrades?.order
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
          </ScrollView>
          <View style={{marginTop: '10%', alignSelf: 'center'}}>
            <TouchableOpacity
              onPress={async () => {
                if (Platform.OS === 'ios') {
                  ReactNativeHapticFeedback.trigger('impactMedium', options);
                }
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
                    console.log('Final quote...', JSON.stringify(res));
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
              }}>
              <LinearGradient
                style={{
                  borderRadius: 17,
                  backgroundColor: 'transparent',
                  paddingVertical: 22,
                  paddingHorizontal: '30%',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  width: '105%',
                }}
                locations={[0, 1]}
                colors={['#fff', '#fff']}
                useAngle={true}
                angle={95.96}>
                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      letterSpacing: 0.2,
                      fontFamily: 'Unbounded-Bold',
                      color: '#000',
                      textAlign: 'center',
                    }}>
                    {getDisplayText()}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default TradePage;
