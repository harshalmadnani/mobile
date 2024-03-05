import React, {useCallback, useEffect, useState} from 'react';
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
import '@ethersproject/shims';
import {useDispatch, useSelector} from 'react-redux';
import {getBestDLNCrossSwapRate} from '../../../../store/actions/market';
import {useFocusEffect} from '@react-navigation/native';
import {
  confirmDLNTransaction,
  getBestCrossSwapRate,
  getDLNTradeCreateBuyOrder,
  getDLNTradeCreateBuyOrderTxn,
} from '../../../../utils/DLNTradeApi';
const idToChain = {
  btc: {
    tokenAddress: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
    chain: 'polygon',
    decimal: '18',
  },
  eth: {
    tokenAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    chain: 'polygon',
  },
  matic: {
    tokenAddress: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    chain: 'polygon',
  },
};
const TradePage = ({route, navigation}) => {
  const [tradeType, setTradeType] = useState('buy');
  const [orderType, setOrderType] = useState('market');
  const [selectedDropDownValue, setSelectedDropDownValue] = useState('Spot');
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [value, setValue] = useState('100');
  const [convertedValue, setConvertedValue] = useState('token');
  const address = useSelector(x => x.auth.address);
  const [commingSoon, setCommingSoon] = useState(false);
  const width = Dimensions.get('window').width;
  const state = route.params.state;
  const dispatch = useDispatch();
  const selectedAssetMetaData = useSelector(
    x => x.market.selectedAssetMetaData,
  );
  const tokenBalanceUSD = useSelector(x => x.market.tokenBalanceUSD);
  const [finalTxQuote, setFinalTxQuote] = useState(null);
  const bestSwappingTrades = useSelector(x => x.market.bestSwappingTrades);
  useEffect(() => {
    console.log('Selected dropdown value:', selectedDropDownValue);
    console.log('Order type:', orderType);

    if (
      selectedDropDownValue === 'Margin' ||
      selectedDropDownValue === 'Algo' ||
      orderType === 'limit' ||
      orderType === 'stop'
    ) {
      console.log('Setting commingSoon to true');
      setCommingSoon(true);
    } else {
      console.log('Setting commingSoon to false');
      setCommingSoon(false);
    }
  }, [selectedDropDownValue, orderType]);
  // useEffect(() => {
  const getTradeSigningData = async () => {
    console.log('best rate ......', bestSwappingTrades);
    if (bestSwappingTrades) {
      const res = await getDLNTradeCreateBuyOrderTxn(
        bestSwappingTrades?.estimation?.srcChainTokenIn?.chainId,
        bestSwappingTrades?.estimation?.srcChainTokenIn?.address,
        bestSwappingTrades?.estimation?.srcChainTokenIn?.amount,
        bestSwappingTrades?.estimation?.dstChainTokenOut?.chainId,
        bestSwappingTrades?.estimation?.dstChainTokenOut?.address,
        bestSwappingTrades?.estimation?.dstChainTokenOut?.amount,
        address,
      );
      console.log('Here....tx data');
      console.log(res?.tx);
      setFinalTxQuote(res);
      return res;
    } else {
      console.log('Here... no tx data');
    }
  };
  //   getTradeSigningData();
  // }, [bestSwappingTrades]);
  // Example of logging state changes
  useFocusEffect(
    useCallback(() => {
      dispatch(
        getBestDLNCrossSwapRate(
          selectedAssetMetaData?.blockchains,
          selectedAssetMetaData?.contracts,
          value * 1000000,
        ),
      );

      return () => {
        console.log('firedd cleanup ======>');
        // Perform any clean-up tasks here, such as cancelling requests or clearing state
      };
    }, []),
  );
  // Log when component mounts
  console.log('state.......', state?.decimals);
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
                fontFamily: `Satoshi-Bold`,
                fontWeight: 500,
                marginLeft: 30,
              }}>
              {state.symbol.toUpperCase()}/USD
            </Text>
          </View>
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
              borderRadius: 100,
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
                  }}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: '#ffffff',
                      fontSize: 16,
                      fontFamily: 'Benzin-Semibold',
                      textAlign: 'center',
                    }}>
                    Market
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
            <View
              style={{
                flexDirection: 'row',
                borderRadius: 100,
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
                    }}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: '#ffffff',
                        fontSize: 16,
                        fontFamily: 'Benzin-Semibold',
                        textAlign: 'center',
                      }}>
                      Market
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

            {/*Buy and Sell */}
            <View
              style={{
                flexDirection: 'row',
                borderRadius: 100,
                backgroundColor: '#151515',
                alignItems: 'center',
                justifyContent: 'space-between',
                margin: 8,
                padding: 6,
              }}>
              <TouchableOpacity
                style={{width: '50%'}}
                onPress={() => {
                  setTradeType('buy');
                  setConvertedValue('token');
                }}>
                {tradeType === 'buy' ? (
                  <LinearGradient
                    colors={['#183e27', '#1d5433']}
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
                        fontWeight: 'bold',
                        color: '#ACFF8E',
                        fontSize: 16,
                        fontFamily: 'Benzin-Semibold',
                        width: '40%',
                        textAlign: 'center',
                      }}>
                      Buy
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
                    Buy
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={{width: '50%'}}
                onPress={() => setTradeType('sell')}>
                {tradeType === 'sell' ? (
                  <LinearGradient
                    colors={['#3E1818', '#541D1D']}
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
                        fontWeight: 'bold',
                        color: '#FF4444',
                        fontSize: 16,
                        fontFamily: 'Benzin-Semibold',
                        width: '40%',
                        textAlign: 'center',
                      }}>
                      Sell
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
                    Sell
                  </Text>
                )}
              </TouchableOpacity>
            </View>
            {tradeType === 'buy' ? (
              <View
                style={{
                  marginTop: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {/*Investment Section */}
                <Text
                  style={{
                    fontSize: 16,
                    color: '#7e7e7e',
                    textAlign: 'center',
                    fontFamily: 'Satoshi-Regular',
                  }}>
                  How much would you like to invest?{' '}
                </Text>
                <TouchableOpacity onPress={() => console.log('MAX pressed')}>
                  <Text
                    style={{
                      color: '#C397FF', // Text color as specified
                      fontFamily: 'Satoshi-Black', // Ensure this font is linked in your project
                      fontSize: 12, // Font size as specified
                      // Any additional text styling here
                    }}>
                    MAX
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={{
                  marginTop: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {/*Investment Section */}
                <Text
                  style={{
                    fontSize: 16,
                    color: '#7e7e7e',
                    textAlign: 'center',
                    fontFamily: 'Satoshi-Regular',
                  }}>
                  How much would you like to sell?{' '}
                </Text>
                <TouchableOpacity onPress={() => console.log('MAX pressed')}>
                  <Text
                    style={{
                      color: '#C397FF', // Text color as specified
                      fontFamily: 'Satoshi-Black', // Ensure this font is linked in your project
                      fontSize: 12, // Font size as specified
                      // Any additional text styling here
                    }}>
                    MAX
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {/*Input Number */}
            {tradeType === 'sell' ? (
              <View
                style={{
                  marginTop: 25,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 8,
                  fontFamily: 'Unbounded-Bold',
                }}>
                <TextInput
                  style={{
                    fontSize: 56,
                    fontWeight: '900',
                    color: '#ffffff',
                    textAlign: 'center',
                    fontFamily: 'Unbounded-Bold',
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
                    fontWeight: '900',
                    color: '#252525',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    marginTop: 10,
                  }}>
                  {state.symbol}
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
                    fontWeight: 900,
                    color: '#252525',
                    textAlign: 'center',
                    marginTop: 10,
                    fontFamily: 'Unbounded-Bold',
                  }}>
                  $
                </Text>
                <TextInput
                  style={{
                    fontSize: 56,
                    fontWeight: '900',
                    color: '#ffffff',
                    textAlign: 'center',
                    fontFamily: 'Unbounded-ExtraBold',
                  }}
                  value={value}
                  onChangeText={text => {
                    setValue(text);
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
                    color: '#7e7e7e',
                    textAlign: 'center',
                    fontFamily: 'Unbounded-Regular',
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
                  {(
                    bestSwappingTrades?.estimation?.dstChainTokenOut?.amount /
                    1e18
                  ).toFixed(5) || '...'}{' '}
                  {state?.symbol}{' '}
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
                    color: '#7e7e7e',
                    textAlign: 'center',
                    fontFamily: 'Unbounded-Regular',
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
                  $55,000{' '}
                </Text>
                {/* image to allow btc input */}
                {/* <Image source={ImageAssets.arrowImg} /> */}
              </View>
            )}
            {tradeType === 'buy' ? (
              <View
                style={{
                  marginTop: 25,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#fff',
                    textAlign: 'center',
                    fontFamily: 'Unbounded-ExtraBold',
                  }}>
                  ${tokenBalanceUSD}{' '}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#7e7e7e',
                    textAlign: 'center',
                    fontFamily: 'Unbounded-Regular',
                  }}>
                  available to invest{' '}
                </Text>

                {/* image to allow btc input */}
                {/* <Image source={ImageAssets.arrowImg} /> */}
              </View>
            ) : (
              <View
                style={{
                  marginTop: 25,
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
                  0.006 BTC{' '}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#7e7e7e',
                    textAlign: 'center',
                    fontFamily: 'Unbounded-Regular',
                  }}>
                  available to sell{' '}
                </Text>
                {/* image to allow btc input */}
                {/* <Image source={ImageAssets.arrowImg} /> */}
              </View>
            )}

            {/*order summary */}
            <View
              style={{
                marginTop: 40,
                margin: 8,
              }}>
              <TouchableOpacity
                onPress={() => setIsModalOpen(!isModalOpen)}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    fontFamily: 'Satoshi-Bold',
                    color: '#ffffff',
                  }}>
                  Order summary
                </Text>
                <Icon
                  name={'keyboard-arrow-down'}
                  size={30}
                  color={'#ffffff'}
                  type="materialicons"
                  style={{
                    transform: [{rotate: isModalOpen ? '180deg' : '0deg'}],
                  }}
                />
              </TouchableOpacity>
            </View>

            {isModalOpen && (
              <View
                style={{
                  margin: 8,
                  marginTop: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 34,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 24,
                    }}>
                    <Image
                      source={ImageAssets.dollarImg}
                      style={{
                        width: 40,
                        height: 40,
                      }}
                    />
                    <View>
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: 'Satoshi-Bold',
                          color: '#7e7e7e',
                        }}>
                        Entry price
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: '700',
                          fontFamily: 'Unbounded-ExtraBold',
                          color: '#fff',
                        }}>
                        ${state?.current_price}
                      </Text>
                    </View>
                  </View>
                  <Image
                    source={ImageAssets.infoImg}
                    style={{
                      width: 24,
                      height: 24,
                    }}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 34,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 24,
                    }}>
                    <Image
                      source={ImageAssets.feeImg}
                      style={{
                        width: 40,
                        height: 40,
                      }}
                    />
                    <View>
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: 'Satoshi-Bold',
                          color: '#7e7e7e',
                        }}>
                        Estimated Fees
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: '700',
                          fontFamily: 'Unbounded-ExtraBold',
                          color: '#fff',
                        }}>
                        $0.01
                      </Text>
                    </View>
                  </View>
                  <Image
                    source={ImageAssets.infoImg}
                    style={{
                      width: 24,
                      height: 24,
                    }}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 34,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 24,
                    }}>
                    <Image
                      source={ImageAssets.timeImg}
                      style={{
                        width: 40,
                        height: 40,
                      }}
                    />
                    <View>
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: 'Satoshi-Bold',
                          color: '#7e7e7e',
                        }}>
                        Execution Time
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: '700',
                          fontFamily: 'Unbounded-ExtraBold',
                          color: '#fff',
                        }}>
                        {bestSwappingTrades?.order
                          ?.approximateFulfillmentDelay || '...'}
                        s
                      </Text>
                    </View>
                  </View>
                  <Image
                    source={ImageAssets.infoImg}
                    style={{
                      width: 24,
                      height: 24,
                    }}
                  />
                </View>
              </View>
            )}
          </ScrollView>
          {tradeType === 'sell' ? (
            <LinearGradient
              style={{
                borderRadius: 100,
                backgroundColor: 'transparent',
                paddingVertical: 22,
                paddingHorizontal: 100,
              }}
              locations={[0, 1]}
              colors={['#3E1818', '#541D1D']}
              useAngle={true}
              angle={95.96}>
              <Text
                style={{
                  fontSize: 16,
                  letterSpacing: 0.2,
                  fontWeight: '700',
                  fontFamily: 'Satoshi-Bold',
                  color: '#FF4444',
                  textAlign: 'center',
                }}>
                Confirm order
              </Text>
            </LinearGradient>
          ) : (
            <TouchableOpacity
              onPress={async () => {
                const res = await getTradeSigningData();
                await confirmDLNTransaction(
                  res?.estimation?.srcChainTokenIn?.amount,
                  res?.estimation?.srcChainTokenIn?.address,
                  res?.tx,
                );
              }}>
              <LinearGradient
                style={{
                  borderRadius: 100,
                  backgroundColor: 'transparent',
                  paddingVertical: 22,
                  paddingHorizontal: 100,
                }}
                locations={[0, 1]}
                colors={['#1b4d30', '#328454']}
                useAngle={true}
                angle={95.96}>
                <Text
                  style={{
                    fontSize: 16,
                    letterSpacing: 0.2,
                    fontWeight: '700',
                    fontFamily: 'Satoshi-Bold',
                    color: '#acff8e',
                    textAlign: 'center',
                  }}>
                  Coming Soon
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default TradePage;
