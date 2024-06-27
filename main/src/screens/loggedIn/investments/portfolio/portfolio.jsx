import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  Modal,
  Platform,
  Pressable,
} from 'react-native';
import InteractiveChart from '../../../../component/charts/Chart';
import styles from '../investment-styles';
import {useDispatch, useSelector} from 'react-redux';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {w3cwebsocket as W3CWebSocket} from 'websocket';
const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};
import MyInvestmentItemCard from '../tradeCollection/myInvestmentItemCard'; // Assuming this is the path to your component

import {Icon} from '@rneui/base';
import {portfolioAction} from '../../../../store/reducers/portfolio';
import {
  GestureHandlerRootView,
  NativeViewGestureHandler,
  RefreshControl,
} from 'react-native-gesture-handler';
const Portfolio = ({navigation}) => {
  const dispatch = useDispatch();
  const holdings = useSelector(x => x.portfolio.holdings);
  const portfolioHoldingFetch = useSelector(
    x => x.portfolio.portfolioHoldingFetch,
  );
  const allScw = useSelector(x => x.auth.scw);
  const userInfo = useSelector(x => x.portfolio.userInfo);

  const [modalVisible, setModalVisible] = useState(false);
  const [portfolioValue, setPortfolioValue] = useState(null);
  let info;
  let imageUrl;
  // info = global.loginAccount.name;
  // imageUrl = `https://ui-avatars.com/api/?name=${info}&format=png&rounded=true&bold=true&background=ffffff&color=000`;
  const [points, setPoints] = useState('0');
  const [modal2Visible, setModal2Visible] = useState(false);
  useEffect(() => {
    const ws = new W3CWebSocket(
      'wss://portfolio-api-wss-fgpupeioaa-uc.a.run.app',
    );
    if (allScw?.length) {
      const scwWallets = allScw.map(x => x.address);
      ws.onopen = () => {
        const payload = {
          type: 'wallet',
          authorization: 'e26c7e73-d918-44d9-9de3-7cbe55b63b99',
          payload: {
            wallets: `${scwWallets.toString()}`,
            // wallet: '0xce3bc7500c88d0bdd0ef3d9152b82188d683fb3c',
            type: 'portfolio',
            interval: 2,
            unlistedAssets: false,
            blockchains: `137,42161,8453,1`,
          },
        };
        ws.send(JSON.stringify(payload));
      };

      ws.onmessage = event => {
        const parsedData = JSON.parse(event?.data);
        const manipulatedHoldingsData = [];
        setPortfolioValue(parsedData);
        if (parsedData.assets?.length > 0) {
          parsedData.assets?.forEach((asset, i) => {
            asset?.contracts_balances?.forEach(contractBalance =>
              manipulatedHoldingsData.push({
                ...asset,
                token_balance: contractBalance?.balance,
                estimated_balance: contractBalance?.balance * asset?.price,
                contracts_balances: [contractBalance],
              }),
            );
          });
          dispatch(
            portfolioAction.setHoldings({assets: manipulatedHoldingsData}),
          );
        }
      };

      ws.onerror = event => {
        try {
          console.log('WebSocket error:', event);
        } catch (error) {
          console.log('WebSocket error:', event);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
      };
    }
    return () => {
      ws.close();
    };
  }, [allScw]);
  const extractUSDCBalanceOnPolygon = holdings => {
    if (!holdings || !holdings?.assets) {
      return '0'; // Return a default value indicating that the balance couldn't be extracted
    }
    const usdcAsset = holdings?.assets?.find(
      asset =>
        asset?.asset?.symbol === 'USDC' &&
        asset?.cross_chain_balances?.Polygon &&
        asset?.cross_chain_balances?.Polygon?.address?.toLowerCase() ===
          '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359'?.toLowerCase(),
    );

    // Check if the USDC asset on Polygon was found
    if (!usdcAsset) {
      return '0'; // Return a default value if the USDC asset isn't found
    }
    // Assuming the balance is directly available on usdcAsset (or adapt based on actual structure)
    return usdcAsset?.cross_chain_balances?.Polygon.balance || 0;
  };
  const [refreshing, setRefreshing] = React.useState(false);
  const usdcBalance = extractUSDCBalanceOnPolygon(holdings);

  const onRefresh = async () => {
    const ws = new W3CWebSocket(
      'wss://portfolio-api-wss-fgpupeioaa-uc.a.run.app',
    );
    if (allScw?.length) {
      const scwWallets = allScw.map(x => x.address);
      console.log('portfolio all scw', scwWallets);
      ws.onopen = () => {
        const payload = {
          type: 'wallet',
          authorization: 'e26c7e73-d918-44d9-9de3-7cbe55b63b99',
          payload: {
            wallets: `${scwWallets.toString()}`,
            // wallets: '0xce3bc7500c88d0bdd0ef3d9152b82188d683fb3c',
            type: 'portfolio',
            interval: 2,
            unlistedAssets: false,
            blockchains: `137,42161,8453,1`,
          },
        };
        setRefreshing(true);
        ws.send(JSON.stringify(payload));
      };

      ws.onmessage = event => {
        const parsedData = JSON.parse(event?.data);
        const manipulatedHoldingsData = [];
        setPortfolioValue(parsedData);
        if (parsedData.assets?.length > 0) {
          parsedData.assets?.forEach((asset, i) => {
            asset?.contracts_balances?.forEach(contractBalance =>
              manipulatedHoldingsData.push({
                ...asset,
                token_balance: contractBalance?.balance,
                estimated_balance: contractBalance?.balance * asset?.price,
                contracts_balances: [contractBalance],
              }),
            );
          });
          dispatch(
            portfolioAction.setHoldings({assets: manipulatedHoldingsData}),
          );
          setRefreshing(false);
        }
      };

      ws.onerror = event => {
        try {
          console.log('WebSocket error:', event);
          setRefreshing(false);
        } catch (error) {
          console.log('WebSocket error:', event);
          setRefreshing(false);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
        setRefreshing(false);
      };
    }
    setTimeout(() => {
      setRefreshing(false);
    }, 5000);
    return () => {
      ws.close();
      setRefreshing(false);
    };
  };
  return (
    <SafeAreaView style={{backgroundColor: '#000', flex: 1}}>
      <GestureHandlerRootView>
        <ScrollView
          refreshControl={
            <RefreshControl
              tintColor={'#fff'}
              colors={['#f0f8ff']}
              progressBackgroundColor={'black'}
              enabled={true}
              refreshing={refreshing}
              onRefresh={onRefresh}
              size="default"
            />
          }>
          <View
            style={{
              marginTop: '8%',
              marginBottom: '2%',
              marginLeft: '5%',
              marginRight: '5%', // Added marginRight to ensure space is maintained from the right edge
              flexDirection: 'row',
              justifyContent: 'space-between', // This line positions items on opposite ends
            }}>
            <Text
              style={{
                fontFamily: 'Unbounded-Medium',
                color: '#fff',
                fontSize: 20,
              }}>
              PORTFOLIO
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (Platform.OS === 'ios') {
                  ReactNativeHapticFeedback.trigger('impactMedium', options);
                }
                navigation.push('TransactionHistory');
              }}>
              <Image
                source={{
                  uri: 'https://res.cloudinary.com/dcrfpsiiq/image/upload/v1709493378/x8e21kt9laz3hblka91g.png',
                }}
                style={{
                  width: 40,
                  height: 40,
                  bottom: 3,
                }}
              />
            </TouchableOpacity>
          </View>

          <ScrollView>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                marginTop: '8%',
                flexDirection: 'row',
                alignSelf: 'center',
              }}
              onPress={() => {
                setModalVisible(true); // Set the modal visibility to true
                if (Platform.OS === 'ios') {
                  ReactNativeHapticFeedback.trigger('impactMedium', options);
                }
              }}>
              <Text style={styles.portfolioHead}>Portfolio Value</Text>
              <Icon
                name={'expand-more'}
                size={20}
                color={'#989898'}
                type="materialicons"
              />
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
                  flex: 1,
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  marginTop: 22,
                }}>
                <View
                  style={{
                    backgroundColor: '#090909',
                    borderRadius: 20,
                    padding: 35,
                    paddingTop: 60,
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5,
                    width: '100%',
                    height: '60%',
                    position: 'relative',
                  }}>
                  {/* Close Icon */}
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      top: 25,
                      left: 15,
                      zIndex: 1,
                    }}
                    onPress={() => setModalVisible(!modalVisible)}>
                    <Icon name="close" size={35} color="#fff" />
                  </TouchableOpacity>

                  {/* Image */}

                  {/* Price */}
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 24,
                      fontFamily: 'Unbounded-Medium',
                      marginVertical: 10,
                    }}>
                    {info?.toUpperCase()}
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '10%',
                      marginTop: '10%',
                      marginHorizontal: '-8%',
                    }}>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: 10,
                        paddingVertical: 40,
                        marginRight: '1%',
                        backgroundColor: '#121212',
                        borderRadius: 30,
                      }}>
                      <Text
                        style={{
                          fontSize: 12,
                          color: '#fff',
                          marginBottom: 5,
                          fontFamily: 'NeueMontreal-Bold',
                        }}>
                        Current Value
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          color: '#fff',
                          fontFamily: 'Unbounded-Bold',
                        }}>
                        ${portfolioValue?.total_wallet_balance?.toFixed(2)}
                      </Text>
                    </View>

                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: 10,
                        paddingVertical: 40,
                        marginLeft: '1%',
                        borderRadius: 30,
                        backgroundColor: '#121212',
                      }}>
                      <Text
                        style={{
                          fontSize: 12,
                          color: '#fff',
                          marginBottom: 5,
                          fontFamily: 'NeueMontreal-Bold',
                        }}>
                        Total Returns
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          color:
                            portfolioValue?.total_unrealized_pnl >= 0
                              ? '#ADFF6C'
                              : 'red',
                          fontFamily: 'Unbounded-Bold',
                        }}>
                        {(isNaN(
                          (portfolioValue?.total_unrealized_pnl /
                            (portfolioValue?.total_wallet_balance -
                              portfolioValue?.total_unrealized_pnl -
                              portfolioValue?.total_realized_pnl)) *
                            100,
                        )
                          ? 0
                          : (portfolioValue?.total_unrealized_pnl /
                              (portfolioValue?.total_wallet_balance -
                                portfolioValue?.total_unrealized_pnl -
                                portfolioValue?.total_realized_pnl)) *
                            100
                        )?.toFixed(2)}
                        %
                      </Text>
                    </View>
                  </View>

                  {/* ... additional content ... */}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 10,
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        color: '#ADADAD',
                        textAlign: 'left',
                        flex: 1,
                        fontFamily: 'NeueMontreal-Medium',
                      }}>
                      Total Invested:
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        color: '#fff',
                        textAlign: 'right',
                        flex: 1,
                        fontFamily: 'Unbounded-Medium',
                      }}>
                      {' '}
                      $
                      {(
                        portfolioValue?.total_wallet_balance -
                        portfolioValue?.total_unrealized_pnl -
                        portfolioValue?.total_realized_pnl
                      )?.toFixed(2)}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 10,
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        color: '#ADADAD',
                        textAlign: 'left',
                        flex: 1,
                        fontFamily: 'NeueMontreal-Medium',
                      }}>
                      Unrealized PnL:
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        color:
                          portfolioValue?.total_unrealized_pnl >= 0
                            ? '#ADFF6C'
                            : 'red',
                        textAlign: 'right',
                        flex: 1,
                        fontFamily: 'Unbounded-Medium',
                      }}>
                      ${portfolioValue?.total_unrealized_pnl?.toFixed(2)}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: '10%',
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        color: '#ADADAD',
                        textAlign: 'left',
                        flex: 1,
                        fontFamily: 'NeueMontreal-Medium',
                      }}>
                      Realized PnL:
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        color:
                          portfolioValue?.total_realized_pnl >= 0
                            ? '#ADFF6C'
                            : 'red',
                        textAlign: 'right',
                        flex: 1,
                        fontFamily: 'Unbounded-Medium',
                      }}>
                      ${portfolioValue?.total_realized_pnl?.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            </Modal>

            <View style={{alignItems: 'center'}}>
              <InteractiveChart />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 8,
                }}>
                <View
                  style={{
                    flex: 1,
                    height: 1,
                    marginLeft: '5%',
                    marginRight: '5%',
                    backgroundColor: '#292929',
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '88%',
                  marginTop: '3%',
                  marginRight: '5%',
                  marginLeft: '3%',
                  marginBottom: '3%',
                }}>
                <Text
                  style={{
                    fontFamily: 'NeueMontreal-Medium',
                    color: '#fff',
                    fontSize: 16,
                  }}>
                  Cash Balance
                </Text>
                <View style={{}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      alignSelf: 'center',
                    }}>
                    <TouchableOpacity
                      onPress={() => setModal2Visible(true)}
                      style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          fontFamily: 'Unbounded-Medium',
                          color: '#fff',
                          fontSize: 16,
                          marginRight: '2%',
                        }}>
                        $
                        {Number(usdcBalance)
                          ?.toFixed(2)
                          ?.toLocaleString('en-US')}
                      </Text>
                      <View style={{alignSelf: 'center'}}>
                        <Icon
                          name={'expand-more'}
                          size={18}
                          color={'#f0f0f0'}
                          type="materialicons"
                          alignSelf="center"
                        />
                      </View>
                    </TouchableOpacity>
                  </View>

                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modal2Visible}
                    onRequestClose={() => setModal2Visible(!modal2Visible)}>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        marginTop: 22,
                        width: '100%',
                      }}>
                      <View
                        style={{
                          backgroundColor: '#010101',
                          padding: 35,
                          alignItems: 'center',
                          shadowColor: '#000',
                          width: '100%',
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                          shadowOpacity: 0.25,
                          shadowRadius: 4,
                          elevation: 5,
                        }}>
                        {/* Image component added here */}
                        <Image
                          source={{
                            uri: 'https://res.cloudinary.com/xade-finance/image/upload/v1712474035/hnjacvonwztzamqzibpt.png',
                          }}
                          style={{width: 200, height: 200, alignSelf: 'center'}} // Adjust size as needed
                          resizeMode="contain" // Adjust resizeMode as needed
                        />
                        <Text
                          style={{
                            marginBottom: 15,
                            textAlign: 'center',
                            fontFamily: 'Unbounded-Medium',
                            fontSize: 20,
                            color: '#fff',
                          }}>
                          CASH BALANCE
                        </Text>
                        <Text
                          style={{
                            marginBottom: 15,
                            textAlign: 'center',
                            color: '#666',
                            fontSize: 16,
                          }}>
                          Your Cash Balance is the USDC you hold on the Polygon
                          POS chain and is the base currency to settle all
                          transactions on Xade.
                        </Text>
                        <Pressable
                          onPress={() => setModal2Visible(!modal2Visible)}
                          style={{
                            borderRadius: 30,
                            paddingHorizontal: '40%',
                            paddingVertical: '6%',
                            elevation: 2,
                            marginTop: 10,
                            backgroundColor: '#fff',
                          }}>
                          <Text
                            style={{
                              color: 'black',
                              fontWeight: 'bold',
                              textAlign: 'center',
                              fontSize: 14,
                            }}>
                            Close
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  </Modal>
                </View>

                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modal2Visible}
                  onRequestClose={() => setModal2Visible(!modal2Visible)}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 22,
                    }}></View>
                </Modal>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: 72,
                  width: '92%',
                  margin: '5%',
                  borderRadius: 20,
                  backgroundColor: '#121212',
                  padding: 16,
                  overflow: 'hidden',
                }}>
                <Image
                  source={{
                    uri: 'https://res.cloudinary.com/dcrfpsiiq/image/upload/v1709489668/f2gqkcuheacirjnusuz9.png',
                  }} // Replace with your image URI
                  style={{
                    width: 40,
                    height: 40,
                    marginRight: 12,
                  }}
                />
                <View
                  style={
                    {
                      // This container can hold additional styling if necessary for text layout
                    }
                  }>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: '#121212',
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        color: '#fff',
                        fontFamily: 'NeueMontreal-Medium',
                      }}>
                      You have{' '}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        color: '#fff',
                        fontFamily: 'NeueMontreal-Bold',
                        textShadowColor: '#C68DFF',
                        textShadowOffset: {width: -1, height: 1},
                        textShadowRadius: 10,
                      }}>
                      {userInfo?.[0]?.points ?? 0}{' '}
                    </Text>
                    <Text style={{fontSize: 16, color: '#fff'}}>
                      Xade Shards
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#9C9C9C',
                      fontFamily: 'NeueMontreal-Medium',
                    }}>
                    Distributed at the end of every week
                  </Text>
                </View>
              </View>
              <Text
                style={{
                  fontSize: 16,
                  color: '#787878', // Assuming you want white text color
                  textAlign: 'left', // Aligns text to the left
                  alignSelf: 'flex-start', // Aligns the Text component to the start of the flex container
                  width: '75%', // Match the width of your other content for consistency
                  paddingLeft: 30,
                  marginTop: '2%',
                  marginBottom: '2%', // Optional: if you want some space from the left edge
                }}>
                My Investments
              </Text>
              {/* {portfolioHoldingFetch && !holdings?.assets && (
            <CustomSkeleton element={5} width={'98%'} height={80} />
          )} */}
              {!holdings || !holdings?.assets ? (
                <View
                  style={{
                    flex: 1,
                    backgroundColor: '#000',
                    width: '100%',
                    paddingBottom: '50%',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontFamily: 'Unbounded-Medium',
                      justifyContent: 'center',
                      marginTop: '10%',
                    }}>
                    No data available...
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    width: '90%',
                    backgroundColor: '#000',
                    paddingBottom: '30%',
                  }}>
                  {/* && item?.cross_chain_balances?.Polygon?.address !==
              '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359', */}
                  {holdings?.assets?.filter(item => item.token_balance > 0)
                    ?.length > 0
                    ? holdings?.assets
                        ?.filter(item => item?.token_balance > 0)
                        ?.map((item, i) => (
                          <MyInvestmentItemCard
                            key={i.toString()}
                            navigation={navigation}
                            item={{
                              ...item?.asset,
                              balance: item?.token_balance,
                              current_price: item?.price,
                              unrealized_pnl: item?.unrealized_pnl,
                              realized_pnl: item?.realized_pnl,
                              image: item?.asset?.logo,
                              price_bought: item?.price_bought,
                              contracts_balances: item?.contracts_balances,
                            }}
                          />
                        ))
                    : null}
                </View>
              )}
            </View>
          </ScrollView>
        </ScrollView>
        <TouchableOpacity
          onPress={async e => {
            navigation.push('Ramper');
            ReactNativeHapticFeedback.trigger('impactHeavy', options);
          }}
          style={{
            position: 'absolute',
            bottom: Platform.OS === 'ios' ? '0%' : '0%',
            width: '95%',
            height: 56,
            borderRadius: 28,
            backgroundColor: '#FFF',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',

            shadowOffset: {
              width: 2,
              height: 5,
            },
            shadowOpacity: 0.5,
            shadowRadius: 10,
            elevation: 5,
            // position: 'fixed',
          }}>
          <Text
            style={{
              color: '#000',
              fontSize: 16,
              fontFamily: 'Unbounded-Bold',
            }}>
            ADD FUNDS
          </Text>
        </TouchableOpacity>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default Portfolio;
