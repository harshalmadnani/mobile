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
import Modal from 'react-native-modal';
import '@ethersproject/shims';
import {useDispatch, useSelector} from 'react-redux';
import {
  getBestDLNCrossSwapRateBuy,
  getUSDCHoldingForAddressFromMobula,
} from '../../../../store/actions/market';
import {useFocusEffect} from '@react-navigation/native';

import {
  confirmDLNTransaction,
  getDLNTradeCreateBuyOrderTxn,
} from '../../../../utils/DLNTradeApi';

const TradePage = ({route, navigation}) => {
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);

  const openBottomSheet = () => {
    setBottomSheetVisible(true);
  };

  const closeBottomSheet = () => {
    setBottomSheetVisible(false);
  };

  const [tradeType, setTradeType] = useState('buy');
  const [orderType, setOrderType] = useState('market');
  const [selectedDropDownValue, setSelectedDropDownValue] = useState('Spot');
  const [value, setValue] = useState('8');
  const [convertedValue, setConvertedValue] = useState('token');
  const [commingSoon, setCommingSoon] = useState(false);
  const width = Dimensions.get('window').width;
  const state = route.params.state;
  const dispatch = useDispatch();
  const selectedAssetMetaData = useSelector(
    x => x.market.selectedAssetMetaData,
  );
  const holdings = useSelector(x => x.portfolio.holdings);
  const usdcValue = holdings?.assets.filter(x => x.asset?.symbol === 'USDC');
  const bestSwappingBuyTrades = useSelector(x => x.market.bestSwappingTrades);
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
    if (bestSwappingBuyTrades) {
      const res = await getDLNTradeCreateBuyOrderTxn(
        bestSwappingBuyTrades?.estimation?.srcChainTokenIn?.chainId,
        bestSwappingBuyTrades?.estimation?.srcChainTokenIn?.address,
        bestSwappingBuyTrades?.estimation?.srcChainTokenIn?.amount,
        bestSwappingBuyTrades?.estimation?.dstChainTokenOut?.chainId,
        bestSwappingBuyTrades?.estimation?.dstChainTokenOut?.address,
        bestSwappingBuyTrades?.estimation?.dstChainTokenOut?.amount,
      );
      return res;
    } else {
      console.log('Here... no tx data');
    }
  };
  const getBestPrice = async () => {
    dispatch(
      getBestDLNCrossSwapRateBuy(
        selectedAssetMetaData?.blockchains,
        selectedAssetMetaData?.contracts,
        value * 1000000, //USDC
      ),
    );
  };
  // Example of logging state changes
  useFocusEffect(
    useCallback(() => {
      getBestPrice();
      return () => {};
    }, []),
  );
  // Log when component mounts
  console.log('state.......', JSON.stringify(bestSwappingBuyTrades));
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
                marginLeft: '40%',
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
                onPress={() => setTradeType('sell')}>
                {tradeType === 'sell' ? (
                  <LinearGradient
                    colors={['#292929', '#292929']}
                    useAngle={true}
                    angle={93.68}
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 22,
                      borderRadius: 5,
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
                  ${usdcValue?.[1]?.estimated_balance?.toFixed(2)}{' '}
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
            {/*Input Number */}
            {tradeType === 'sell' ? (
              <View
                style={{
                  marginTop: 25,
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
                    marginTop: 10,
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

                    color: '#252525',
                    textAlign: 'center',
                    marginTop: 10,
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
                    (bestSwappingBuyTrades?.estimation?.dstChainTokenOut
                      ?.amount *
                      value) /
                    Math.pow(
                      10,
                      bestSwappingBuyTrades?.estimation?.dstChainTokenOut
                        ?.decimals,
                    )
                  ).toFixed(5) || '...'}{' '}
                  {state?.symbol.toUpperCase()}{' '}
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
                      fontFamily: 'Montreal-Medium',
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
                    ${state?.current_price}
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
                      fontFamily: 'Montreal-Medium',
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
                    $0.01
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
                      fontFamily: 'Montreal-Medium',
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
                      ?.approximateFulfillmentDelay || '...'}
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
          <View
            style={{flexDirection: 'row', marginTop: '10%', marginRight: '5%'}}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                width: '20%',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  padding: 10,
                  borderRadius: 5,
                  flexDirection: 'row',
                }}
                // onPress={openBottomSheet}
              >
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

              <Modal
                isVisible={isBottomSheetVisible}
                onBackdropPress={closeBottomSheet}
                style={{
                  justifyContent: 'flex-end',
                  margin: 0,
                }}
                animationIn="slideInUp"
                animationOut="slideOutDown">
                <View
                  style={{
                    backgroundColor: 'white',
                    padding: 16,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                  }}>
                  <Text>This is the content of the Bottom Sheet</Text>
                  <TouchableOpacity
                    onPress={closeBottomSheet}
                    style={{
                      marginTop: 16,
                      padding: 10,
                      backgroundColor: 'blue',
                      borderRadius: 5,
                    }}>
                    <Text style={{color: 'white', fontSize: 16}}>Close</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            </View>
            {tradeType === 'sell' ? (
              <LinearGradient
                style={{
                  borderRadius: 17,
                  backgroundColor: 'transparent',
                  paddingVertical: 22,
                  paddingHorizontal: '10%',
                }}
                locations={[0, 1]}
                colors={['#fff', '#fff']}
                useAngle={true}
                angle={95.96}>
                <Text
                  style={{
                    fontSize: 14,
                    letterSpacing: 0.2,
                    fontFamily: 'Unbounded-Bold',
                    color: '#000',
                    textAlign: 'center',
                  }}>
                  CONFIRM
                </Text>
              </LinearGradient>
            ) : (
              <TouchableOpacity
                onPress={async () => {
                  console.log(
                    bestSwappingBuyTrades,
                    value <= usdcValue?.[1]?.estimated_balance,
                  );
                  if (value <= usdcValue?.[1]?.estimated_balance) {
                    const res = await getTradeSigningData();
                    const signature = await confirmDLNTransaction(
                      res?.estimation?.srcChainTokenIn?.amount,
                      res?.estimation?.srcChainTokenIn?.address,
                      res?.tx,
                    );
                    if (signature) {
                      console.log('txn hash', signature);
                      navigation.navigate('PendingTxStatusPage', {
                        state: currentItem,
                      });
                    }
                  } else if (bestSwappingBuyTrades !== null) {
                    await getBestPrice();
                  }
                }}>
                <LinearGradient
                  style={{
                    borderRadius: 17,
                    backgroundColor: 'transparent',
                    paddingVertical: 22,
                    paddingHorizontal: '10%',
                  }}
                  locations={[0, 1]}
                  colors={['#fff', '#fff']}
                  useAngle={true}
                  angle={95.96}>
                  <Text
                    style={{
                      fontSize: 14,
                      letterSpacing: 0.2,
                      fontFamily: 'Unbounded-Bold',
                      color: '#000',
                      textAlign: 'center',
                    }}>
                    {!bestSwappingBuyTrades
                      ? 'Calculating....'
                      : bestSwappingBuyTrades.length === 0
                      ? 'Try Again'
                      : 'CONFIRM'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default TradePage;
