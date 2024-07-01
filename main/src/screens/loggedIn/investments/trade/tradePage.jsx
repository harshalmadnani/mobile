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
import Toast from 'react-native-root-toast';
import {Icon} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import '@ethersproject/shims';
import {useDispatch, useSelector} from 'react-redux';
import {
  getBestDLNCrossSwapRateBuy,
  getBestDLNCrossSwapRateSell,
  getNameChainId,
  getNetworkOnChainId,
} from '../../../../store/actions/market';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};
import {
  confirmDLNTransaction,
  confirmDLNTransactionPolToArb,
  executeCrossChainSell,
  executeCrossChainSellForUSDC,
  executeSameChainSellForUSDC,
  getDLNTradeCreateBuyOrder,
  getDLNTradeCreateBuyOrderTxn,
  getTxFromUnizen,
  getUSDCTokenOnChain,
} from '../../../../utils/DLNTradeApi';
import contractAddress from '@unizen-io/unizen-contract-addresses/production.json';
// import // getAuthCoreProviderEthers,
// // switchAuthCoreChain,
// '../../../../utils/particleCoreSDK';
import {
  getMarketOrderFeesEstimationFromDinari,
  placeMarketOrderToDinari,
} from '../../../../utils/Dinari/DinariApi';
import {
  getChainOnId,
  getSmartAccountAddress,
} from '../../../../utils/DFNS/walletFLow';
import {getRouteOnNetwork} from '../../../../utils/constants';
import {ActivityIndicator} from 'react-native';
// import {LoginType} from '@particle-network/rn-auth';

const TradePage = ({route}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const [tradeType, setTradeType] = useState('buy');
  const [value, setValue] = useState(tradeType !== 'sell' ? '4' : '0.1');
  const [stockOrderStages, setStockOrderStages] = useState('Place Order');
  const [sellOrderStages, setSellOrderStages] = useState('Place Order');
  const [buyTradeStages, setBuyTradeStages] = useState('Place Order');
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
  const allScw = useSelector(x => x.auth.scw);
  const items = [
    {left: 'SPOT MARKET', right: ' '},
    {left: 'SPOT LIMIT', right: 'COMING SOON'},
    {left: 'FUTURES MARKET', right: 'COMING SOON'},
    {left: 'FUTURES LIMIT', right: 'COMING SOON'},
    {left: 'BOTS', right: 'COMING SOON'},
  ];
  const holdings = useSelector(x => x.portfolio.holdings);
  const usdcValue = holdings?.assets?.filter(
    x =>
      x.asset?.symbol === 'USDC' && x?.contracts_balances[0]?.chainId === '137',
  );
  const bestSwappingBuyTrades = useSelector(x => x.market.bestSwappingTrades);
  const allSwappingTradesQuotes = useSelector(
    x => x.market.allSwappingTradesQuotes,
  );
  const dfnsToken = useSelector(x => x.auth.DFNSToken);
  const wallets = useSelector(x => x.auth.wallets);
  const chainNames = {
    1: 'Ethereum',
    56: 'BSC',
    137: 'Polygon',
    43114: 'Avalanche',
    250: 'Fantom Opera',
    42161: 'Arbitrum',
    10: 'Optimism',
    42220: 'Celo',
    1666600000: 'Harmony',
    128: 'Heco',
    8453: 'Base',
    // add other chains as necessary
  };

  // Retrieve the first item's chainId and find the chain name
  const firstItem =
    Array.isArray(allSwappingTradesQuotes) && allSwappingTradesQuotes.length > 0
      ? allSwappingTradesQuotes[0]
      : null;
  const firstItemChainId = firstItem ? firstItem.chainId : undefined;
  const chainName = firstItemChainId
    ? chainNames[firstItemChainId]
    : 'Not Found';
  const isStockTrade = useSelector(x => x.market.isStockTrade);

  const tokensToSell = !isStockTrade ? tradeAsset?.[0]?.contracts_balances : [];

  useEffect(() => {
    const fetchNewQuotes = async () => {
      if (!isStockTrade) {
        if (tradeType === 'sell' && parseFloat(value) > 0) {
          setLoading(true);
          await dispatch(
            getBestDLNCrossSwapRateSell(
              tokensToSell?.[0],
              parseFloat(value) * Math.pow(10, tokensToSell?.[0]?.decimals),
              allScw.filter(x => x.chainId === tokensToSell?.[0]?.chainId)?.[0]
                ?.address,
            ),
          );
          setLoading(false);
        } else {
          getBestPrice();
        }
      } else {
        getCurrentStockTradingPrice();
      }
    };
    fetchNewQuotes();
  }, [tradeType]);

  useEffect(() => {
    const fetchNewQuotes = async () => {
      setLoading(true);
      if (!isStockTrade) {
        if (tradeType === 'sell' && parseFloat(value) > 0) {
          console.log(
            'fired when value changes',
            parseInt(
              parseFloat(value) * Math.pow(10, tokensToSell?.[0]?.decimals),
            ),
          );
          dispatch(
            getBestDLNCrossSwapRateSell(
              tokensToSell?.[0],
              parseInt(
                parseFloat(value) * Math.pow(10, tokensToSell?.[0]?.decimals),
              ),
              allScw.filter(x => x.chainId === tokensToSell?.[0]?.chainId)?.[0]
                ?.address,
            ),
          );
        } else {
          getBestPrice();
        }
      } else {
        if (value !== '0' && value > '5' && value) {
          getCurrentStockTradingPrice();
        }
      }
      setLoading(false);
    };
    fetchNewQuotes();
  }, [value]);

  useEffect(() => {
    const fetchNewQuotes = async () => {
      setLoading(true);
      if (!isStockTrade) {
        if (tradeType === 'sell' && parseFloat(value) > 0) {
          console.log('fired when meta changes');
          dispatch(
            getBestDLNCrossSwapRateSell(
              tokensToSell?.[0],
              parseFloat(value) * Math.pow(10, tokensToSell?.[0]?.decimals),
              allScw.filter(x => x.chainId === tokensToSell?.[0]?.chainId)?.[0]
                ?.address,
            ),
          );
        } else {
          getBestPrice();
        }
      } else {
        if (value !== '0' && value > '5' && value) {
          getCurrentStockTradingPrice();
        }
      }
      setLoading(false);
    };
    fetchNewQuotes();
  }, [selectedAssetMetaData]);
  const evmInfo = useSelector(x => x.portfolio.evmInfo);

  const getTradeSigningData = async (smartAccountSrc, smartAccountDst) => {
    if (bestSwappingBuyTrades) {
      console.log('here....', smartAccountSrc, smartAccountDst);
      const res = await getDLNTradeCreateBuyOrderTxn(
        bestSwappingBuyTrades?.estimation?.srcChainTokenIn?.chainId ?? 137,
        bestSwappingBuyTrades?.estimation?.srcChainTokenIn?.address ??
          bestSwappingBuyTrades?.estimation?.tokenIn?.address,
        parseFloat(value) *
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
        smartAccountSrc,
        smartAccountDst,
      );
      return res;
    } else {
      console.log('Here... no tx data');
    }
  };

  const getBestPrice = async () => {
    if (selectedAssetMetaData) {
      setLoading(true);
      setBuyTradeStages('Calculating Routes...');
      const getAllottedBlockchain = getRouteOnNetwork(
        selectedAssetMetaData?.symbol,
      );
      dispatch(
        getBestDLNCrossSwapRateBuy(
          tokensToSell?.length > 0
            ? [getNetworkOnChainId(tokensToSell?.[0]?.chainId)]
            : selectedAssetMetaData?.blockchains?.length > 0
            ? getAllottedBlockchain
              ? [getAllottedBlockchain]
              : selectedAssetMetaData?.blockchains
            : [selectedAssetMetaData?.blockchain],
          tokensToSell?.length > 0
            ? [tokensToSell?.[0]?.address]
            : selectedAssetMetaData?.contracts?.length > 0
            ? getAllottedBlockchain
              ? [
                  selectedAssetMetaData?.contracts[
                    selectedAssetMetaData?.blockchains?.indexOf(
                      getAllottedBlockchain,
                    )
                  ],
                ]
              : selectedAssetMetaData?.contracts
            : [selectedAssetMetaData?.address],
          value * 1000000, //USDC
        ),
      );
      setBuyTradeStages('Finalizing Routes...');
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!isStockTrade && tradeType === 'buy') {
      if (bestSwappingBuyTrades) {
        setBuyTradeStages('Place Order');
      } else if (!loading) {
        // Toast.show('Amount too low', {
        //   duration: Toast.durations.LONG,
        //   position: Toast.positions.BOTTOM,
        //   shadow: true,
        //   animation: true,
        //   hideOnPress: true,
        //   delay: 0,
        // });
        setBuyTradeStages('Amount too low');
      }
    }
  }, [bestSwappingBuyTrades]);

  const getCurrentStockTradingPrice = async () => {
    setStockOrderStages('Getting Quotes...');
    // const ethersProvider = getAuthCoreProviderEthers(LoginType.Email);
    const signerObj = await ethersProvider.getSigner();
    const res = await getDLNTradeCreateBuyOrder(
      137,
      '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
      parseInt(value) * 1000000,
      42161,
      '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      signerObj.address,
    );
    // await switchAuthCoreChain(42161);
    const feesDinari = await getMarketOrderFeesEstimationFromDinari(
      state?.token?.address,
      '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      signerObj,
      parseInt(value - 2.5) * 1000000,
      false,
    );
    // await switchAuthCoreChain(137);
    setStockFee(
      feesDinari / 1000000 +
        res?.estimation?.costsDetails?.filter(
          x => x.type === 'DlnProtocolFee',
        )[0]?.payload?.feeAmount /
          Math.pow(10, res?.estimation?.dstChainTokenOut?.decimals),
    );
    setStockDLNRes(res);
    setStockOrderStages('Execute Order');
  };

  const orderStockPrice = async () => {
    setStockOrderStages('Trading ARB USDC...');
    const res = await confirmDLNTransactionPolToArb(
      tradeType,
      stockDLNRes,
      parseInt(value) * 1000000,
      stockDLNRes?.estimation?.srcChainTokenIn?.address,
      null,
      evmInfo?.smartAccount,
      evmInfo?.address,
    );
    setStockOrderStages('Confirming TXN...');
    if (res) {
      //after polling from Poly
      setTimeout(async () => {
        console.log('run........');
        setStockOrderStages('Placing Stock Order...');
        // await switchAuthCoreChain(42161);
        // const ethersProvider = getAuthCoreProviderEthers(LoginType.Email);
        const signerObj = await ethersProvider.getSigner();
        const feesDinari = await placeMarketOrderToDinari(
          state?.token?.address,
          '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
          signerObj,
          (parseInt(value) - 2.5) * 1000000,
          false,
          evmInfo?.smartAccount,
        );
        setStockOrderStages('Stock Order Placed');
        // await switchAuthCoreChain(137);
        if (feesDinari) {
          navigation.navigate('PendingTxStatus', {
            state: stockDLNRes,
            tradeType,
            isStockTrade,
            stockInfo: state,
          });
        }
      }, 8000);
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
        <ScrollView>
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
                if (!isStockTrade && tokensToSell?.length > 0) {
                  setTradeType('sell');
                } else if (!isStockTrade && !tokensToSell?.length) {
                  Toast.show('No asset to sell!', {
                    duration: Toast.durations.SHORT,
                    position: Toast.positions.BOTTOM,
                    shadow: true,
                    animation: true,
                    hideOnPress: true,
                    delay: 0,
                  });
                } else {
                  Toast.show('Sell of socks coming soon!', {
                    duration: Toast.durations.SHORT,
                    position: Toast.positions.BOTTOM,
                    shadow: true,
                    animation: true,
                    hideOnPress: true,
                    delay: 0,
                  });
                }
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
                {tokensToSell?.[0]?.balance?.toFixed(7)}{' '}
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
                            parseInt(bestSwappingBuyTrades?.toTokenAmount) /
                            Math.pow(
                              10,
                              bestSwappingBuyTrades?.tokenTo?.decimals,
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
                            parseInt(bestSwappingBuyTrades?.toTokenAmount) /
                            Math.pow(
                              10,
                              bestSwappingBuyTrades?.tokenTo?.decimals,
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
                    ? bestSwappingBuyTrades?.action?.fromToken?.priceUSD ||
                      (
                        parseInt(bestSwappingBuyTrades?.toTokenAmount) /
                        Math.pow(10, bestSwappingBuyTrades?.tokenTo?.decimals)
                      ).toFixed(5) / parseFloat(value) ||
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
                      ).toFixed(3)
                    : //when same chain

                    !isStockTrade
                    ? parseFloat(value) /
                        (
                          parseInt(
                            bestSwappingBuyTrades?.transactionData?.info
                              ?.amountOutMin,
                          ) /
                          Math.pow(
                            10,
                            parseInt(bestSwappingBuyTrades?.tokenTo?.decimals),
                          )
                        ).toFixed(5) || //when cross chain
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
                    ? 2.5
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
                    : bestSwappingBuyTrades?.estimate?.gasCosts?.[0]
                        ?.amountUSD ?? 0}
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
                        ?.approximateFulfillmentDelay ?? 6}
                  s
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
                  Route
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'Unbounded-Medium',
                    alignSelf: 'flex-end',
                    color: '#fff',
                  }}>
                  {tradeType === 'buy'
                    ? chainName
                    : chainNames[parseInt(tokensToSell?.[0]?.chainId)]}
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
                    setLoading(true);
                    setPreparingTx(true);
                    let smartAccountSrc;
                    let smartAccountDst;
                    let walletDstId;
                    let walletSrcId;
                    let res;
                    if (bestSwappingBuyTrades?.transactionData) {
                      smartAccountSrc = allScw.filter(
                        x => x.chainId === '137',
                      )?.[0]?.address;
                      res = await getTxFromUnizen(
                        137,
                        bestSwappingBuyTrades?.transactionData,
                        bestSwappingBuyTrades?.nativeValue,
                        smartAccountSrc,
                        bestSwappingBuyTrades?.tradeType,
                      );
                      console.log(
                        'same chain response..........',
                        contractAddress[res?.contractVersion]?.polygon,
                        res,
                        JSON.stringify(bestSwappingBuyTrades),
                      );
                    } else {
                      const dstChainName = getNameChainId(
                        (
                          bestSwappingBuyTrades?.estimation?.dstChainTokenOut
                            ?.chainId ?? '137'
                        )?.toString(),
                      );
                      walletDstId = wallets.filter(
                        x => x.network === dstChainName,
                      )?.[0]?.id;
                      const srcChainName = getNameChainId(
                        (
                          bestSwappingBuyTrades?.estimation?.srcChainTokenIn
                            ?.chainId ?? '137'
                        )?.toString(),
                      );
                      walletSrcId = wallets.filter(
                        x => x.network === srcChainName,
                      )?.[0]?.id;
                      smartAccountDst = allScw.filter(
                        x =>
                          x.chainId ===
                            bestSwappingBuyTrades?.estimation?.dstChainTokenOut?.chainId?.toString() ??
                          '137',
                      )?.[0]?.address;
                      smartAccountSrc = allScw.filter(
                        x =>
                          x.chainId ===
                            bestSwappingBuyTrades?.estimation?.srcChainTokenIn?.chainId?.toString() ??
                          '137',
                      )?.[0]?.address;
                      res = await getTradeSigningData(
                        smartAccountSrc,
                        smartAccountDst,
                      );
                    }
                    setBuyTradeStages('Confirming tx ...');
                    const signature = await confirmDLNTransaction(
                      tradeType,
                      bestSwappingBuyTrades?.transactionData
                        ? bestSwappingBuyTrades
                        : res,
                      res?.estimation?.srcChainTokenIn?.amount ||
                        res?.action?.fromAmount ||
                        bestSwappingBuyTrades?.fromTokenAmount,
                      res?.estimation?.srcChainTokenIn?.address ||
                        res?.action?.fromToken?.address ||
                        bestSwappingBuyTrades?.tokenFrom?.contractAddress,
                      res?.tx ??
                        res?.transactionRequest ?? {
                          data: res?.data,
                          from: smartAccountSrc,
                          to: contractAddress[res?.contractVersion]?.polygon,
                          value: res?.nativeValue,
                        },
                      evmInfo?.smartAccount,
                      wallets?.filter(x => x.network === 'Polygon')[0]?.address,
                      false,
                      [],
                      dfnsToken,
                      walletSrcId ??
                        wallets?.filter(x => x.network === 'Polygon')[0]?.id,
                      walletDstId ??
                        wallets?.filter(x => x.network === 'Polygon')[0]?.id,
                      smartAccountSrc,
                      smartAccountDst,
                    );
                    setBuyTradeStages('Confirmed tx...');
                    setPreparingTx(false);
                    setLoading(false);
                    if (signature) {
                      navigation.navigate('PendingTxStatus', {
                        state: bestSwappingBuyTrades?.transactionData
                          ? bestSwappingBuyTrades
                          : res,
                        tradeType,
                      });
                    }
                  } else if (tradeType === 'sell' && bestSwappingBuyTrades) {
                    setPreparingTx(true);
                    setLoading(true);
                    let res;
                    if (bestSwappingBuyTrades?.transactionData) {
                      //same chain
                      // res = bestSwappingBuyTrades;
                      // setSellOrderStages('Preparing Tx...');
                      const smartAccountSrc = allScw.filter(
                        x => x.chainId === '137',
                      )?.[0]?.address;
                      res = await getTxFromUnizen(
                        137,
                        bestSwappingBuyTrades?.transactionData,
                        bestSwappingBuyTrades?.nativeValue,
                        smartAccountSrc,
                        bestSwappingBuyTrades?.tradeType,
                      );
                      console.log(
                        'same chain response..........',
                        contractAddress[res?.contractVersion]?.polygon,
                        res,
                        JSON.stringify(bestSwappingBuyTrades),
                      );
                      const signature = await confirmDLNTransaction(
                        tradeType,
                        bestSwappingBuyTrades?.transactionData
                          ? bestSwappingBuyTrades
                          : res,
                        res?.estimation?.srcChainTokenIn?.amount ||
                          res?.action?.fromAmount ||
                          bestSwappingBuyTrades?.fromTokenAmount,
                        res?.estimation?.srcChainTokenIn?.address ||
                          res?.action?.fromToken?.address ||
                          bestSwappingBuyTrades?.tokenFrom?.contractAddress,
                        res?.tx ??
                          res?.transactionRequest ?? {
                            data: res?.data,
                            from: smartAccountSrc,
                            to: contractAddress[res?.contractVersion]?.polygon,
                            value: res?.nativeValue,
                          },
                        evmInfo?.smartAccount,
                        wallets?.filter(x => x.network === 'Polygon')[0]
                          ?.address,
                        false,
                        [],
                        dfnsToken,
                        wallets?.filter(x => x.network === 'Polygon')[0]?.id,
                        smartAccountSrc,
                        smartAccountSrc,
                      );
                      // setSellOrderStages('Confirming Tx...');
                      ReactNativeHapticFeedback.trigger('impactHeavy', options);
                      setPreparingTx(false);
                      if (signature) {
                        navigation.navigate('PendingTxStatus', {
                          state: bestSwappingBuyTrades?.transactionData
                            ? bestSwappingBuyTrades
                            : res,
                          tradeType,
                        });
                      }
                    } else {
                      let sameChainTx = [];
                      let txReceiptOfSameChain;
                      let smartAccountSrc;
                      let smartAccountDst;
                      let walletDstId;
                      let walletSrcId;
                      const dstChainName = getNameChainId(
                        (
                          bestSwappingBuyTrades?.estimation?.dstChainTokenOut
                            ?.chainId ?? '137'
                        )?.toString(),
                      );
                      walletDstId = wallets.filter(
                        x => x.network === dstChainName,
                      )?.[0]?.id;
                      const srcChainName = getNameChainId(
                        (
                          bestSwappingBuyTrades?.estimation?.srcChainTokenIn
                            ?.chainId ?? 137
                        )?.toString(),
                      );
                      walletSrcId = wallets.filter(
                        x => x.network === srcChainName,
                      )?.[0]?.id;
                      smartAccountDst = allScw.filter(
                        x =>
                          x.chainId ===
                            bestSwappingBuyTrades?.estimation?.dstChainTokenOut?.chainId?.toString() ??
                          '137',
                      )?.[0]?.address;
                      smartAccountSrc = allScw.filter(
                        x =>
                          x.chainId ===
                            bestSwappingBuyTrades?.estimation?.srcChainTokenIn?.chainId?.toString() ??
                          '137',
                      )?.[0]?.address;
                      console.log(
                        'Cross info.........',
                        dstChainName,
                        srcChainName,
                        smartAccountDst,
                        smartAccountSrc,
                        getUSDCTokenOnChain(
                          parseInt(tokensToSell?.[0]?.chainId),
                        ).toLowerCase(),
                      );
                      if (
                        tokensToSell?.[0]?.address?.toLowerCase() !==
                        getUSDCTokenOnChain(
                          parseInt(tokensToSell?.[0]?.chainId),
                        ).toLowerCase()
                      ) {
                        setSellOrderStages('Preparing Tx...');
                        ReactNativeHapticFeedback.trigger(
                          'impactHeavy',
                          options,
                        );
                        txReceiptOfSameChain =
                          await executeSameChainSellForUSDC(
                            tokensToSell?.[0],
                            smartAccountSrc,
                            value * Math.pow(10, tokensToSell?.[0]?.decimals),
                          );
                        console.log(
                          'same chain tx',
                          txReceiptOfSameChain?.transactionRequest,
                        );
                        if (txReceiptOfSameChain?.transactionRequest) {
                          sameChainTx = await confirmDLNTransaction(
                            tradeType,
                            txReceiptOfSameChain,
                            txReceiptOfSameChain?.estimation?.srcChainTokenIn
                              ?.amount ||
                              txReceiptOfSameChain?.action?.fromAmount,
                            txReceiptOfSameChain?.estimation?.srcChainTokenIn
                              ?.address ||
                              txReceiptOfSameChain?.action?.fromToken?.address,
                            txReceiptOfSameChain?.tx ??
                              txReceiptOfSameChain?.transactionRequest,
                            smartAccountSrc,
                            evmInfo?.address,
                            true,
                            [],
                            dfnsToken,
                            walletSrcId,
                            walletDstId,
                            smartAccountSrc,
                            smartAccountSrc,
                          );
                        }
                      }
                      if (sameChainTx) {
                        // setTimeout(async () => {
                        setSellOrderStages('Executing Tx...');
                        ReactNativeHapticFeedback.trigger(
                          'impactHeavy',
                          options,
                        );
                        //await switchAuthCoreChain(
                        //parseInt(tokensToSell?.[0].chainId),
                        //)
                        const crossChainSwapTx =
                          await executeCrossChainSellForUSDC(
                            tokensToSell?.[0].chainId,
                            smartAccountSrc,
                            sameChainTx.length > 0
                              ? txReceiptOfSameChain?.estimate?.toAmountMin
                              : value *
                                  Math.pow(10, tokensToSell?.[0]?.decimals),
                            smartAccountDst,
                          );
                        if (crossChainSwapTx) {
                          const finalSignature = await confirmDLNTransaction(
                            'buy',
                            crossChainSwapTx,
                            crossChainSwapTx?.estimation?.srcChainTokenIn
                              ?.amount || crossChainSwapTx?.action?.fromAmount,
                            crossChainSwapTx?.estimation?.srcChainTokenIn
                              ?.address ||
                              crossChainSwapTx?.action?.fromToken?.address,
                            crossChainSwapTx?.tx ??
                              crossChainSwapTx?.transactionRequest,
                            smartAccountDst,
                            evmInfo?.address,
                            false,
                            sameChainTx,
                            dfnsToken,
                            walletSrcId,
                            walletDstId,
                            smartAccountSrc,
                            smartAccountDst,
                          );

                          if (finalSignature) {
                            // await switchAuthCoreChain(137);
                            navigation.navigate('PendingTxStatus', {
                              state: crossChainSwapTx,
                              tradeType,
                            });
                          }
                        }
                        // }, 2000);
                      }
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
          {loading ? (
            <ActivityIndicator size={12} color="#000" />
          ) : (
            <Text
              style={{
                fontSize: 14,
                letterSpacing: 0.2,
                fontFamily: 'Unbounded-Bold',
                color: '#000',
                textAlign: 'center',
              }}>
              {isStockTrade
                ? stockOrderStages
                : tradeType === 'sell'
                ? sellOrderStages
                : 'Place Order'}
            </Text>
          )}
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
