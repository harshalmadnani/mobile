import React, {useState, Component, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  Dimensions,
  Platform,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import MarketChart from './marketInfo/MarketChart';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false
};
const MarketInfo = ({route, navigation, item}) => {
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;

  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState();

  const [showSellModal, setShowSellModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);

  const handleCloseBuyModal = () => {
    setShowBuyModal(false);
  };

  const handleCloseSellModal = () => {
    setShowSellModal(false);
  };
  const holdings = useSelector(x => x.portfolio.holdings);
  const currentAsset = holdings?.assets.filter(
    x => x.asset?.symbol.toLowerCase() === item?.symbol.toLowerCase(),
  );
  // console.log(route.params);

  const uri =
    Platform.OS === 'android'
      ? `file:///android_asset/index.html?theme=dark&symbol=BINANCE:BTCUSDT&hide_top_toolbar=true&hide_legend=true&save_image=false&hide_volume=true`
      : // ? `file:///android_asset/index.html?theme=dark&symbol=${item.symbol}&hide_top_toolbar=true&hide_legend=true&save_image=false&hide_volume=true`
        'index.html';

  console.log(uri);

  useEffect(() => {
    async function init() {
      try {
        setIsLoading(true);

        if (global.withAuth) {
          authAddress = global.loginAccount?.publicAddress;
          const scwAddress = global.loginAccount.scw;
          setAddress(scwAddress);
        } else {
          authAddress = global.connectAccount?.publicAddress;
          const scwAddress = global.connectAccount?.publicAddress;
          setAddress(scwAddress);
        }

        // fetch selected coin contract address
      } catch (e) {
        console.log(e);
      }
      setIsLoading(false);
    }

    init();
  }, []);

  return (
    <SafeAreaView
      style={{
        width: width,
        height: height,
        alignSelf: 'flex-start',
        // backgroundColor: '#000000',

        // backgroundColor: 'red'
      }}>
      {/* {isLoading && (
        <View style={{height: '100%'}}>
          <ActivityIndicator
            size={30}
            style={{marginTop: '40%'}}
            color="#fff"
          />
        </View>
      )} */}

      {
        <ScrollView
          scrollEnabled
          style={{
            marginTop: '10%',
          }}>
          <View>
            <View style={{}}>
              <MarketChart item={item} scwAddress={address} />
            </View>
          </View>

          <View margin={4} />

          {showBuyModal && (
            <BuyModal marketData={{}} onClose={handleCloseBuyModal} />
          )}

          {showSellModal && <SellModal onClose={handleCloseSellModal} />}
          {/*
                    <View>
                        <View style={{
                            marginHorizontal:20,
                            marginTop: 16
                        }}>
                            <Text
                                style={{
                                    fontFamily: 'Satoshi-Regular',
                                    fontSize: 16,
                                    color: "#fff",
                                    fontWeight: "400",
                                }}>
                                Your total balance
                            </Text>
                        </View>

                        <View style={{
                            marginHorizontal:20,
                            }}>
                            <Text
                                style={{
                                    fontFamily: 'Satoshi-Bold',
                                    fontSize: 32,
                                    color: "#fff",
                                    fontWeight: "700",
                                }}>
                                {item.balance}
                            </Text>
                        </View>
                    </View> */}

          {/* <Tabs.Container
                        // renderTabBar={renderTabBar}
                        containerStyle={{ minHeight: 400, fontSize: '14px', fontFamily: 'Satoshi-Bold'}}
                        onIndexChange={setIndex}
                        initialLayout={{ width: layout.width }}
                        style={{backgroundColor: '#000000'}}
                        renderTabBar={props => <MaterialTabBar {...props} pressColor={'transparent'} activeColor={'#fff'}  inactiveColor={'#ffffffcc'} indicatorStyle={{ backgroundColor: '#fff' }} labelStyle={{fontSize: 14, fontFamily: 'Satoshi-Bold', }} />}
                        headerContainerStyle={{ backgroundColor : '#000'}}
                    >
                        <Tabs.Tab name="Buy" label={"Buy"} key={1} >
                            <Tabs.ScrollView>
                                <BuyForm navigation={navigation} />
                            </Tabs.ScrollView>
                        </Tabs.Tab>
                        <Tabs.Tab name="Sell" label={"Sell"} key={2}>
                            <Tabs.ScrollView>
                                <SellForm navigation={navigation} />
                            </Tabs.ScrollView>
                        </Tabs.Tab>
                    </Tabs.Container> */}

          {/* <View
                        style={{
                            flexDirection: 'row',
                            // width: '80%',
                            height: 50,
                            justifyContent: 'space-evenly',
                            flexDirection: 'row',
                            marginTop: 30,
                            marginHorizontal:10
                        }}>

                        <TouchableOpacity
                            style={styles.depWith}
                            onPress={() => {
                                setShowBuyModal(true);
                            }}>

                            <LinearGradient useAngle={true} angle={150} colors={['#5038E1','#B961FF']} style={[styles.innerDep]}>

                                    <Text style={{color: '#fff', fontSize: 14, paddingLeft:'5%', fontFamily: 'Satoshi-Bold', fontWeight: 300}}>
                                        Buy
                                    </Text>

                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.depWith}
                            onPress={() => {
                                setShowSellModal(true);
                            }}>
                            <View
                                style={[styles.innerDep, styles.innerDepColored]}>
                                <Text style={{color: '#fff', fontSize: 14,paddingLeft:'5%', fontFamily: 'Satoshi-Bold', fontWeight: 300}}>
                                    Sell
                                </Text>
                            </View>
                        </TouchableOpacity>

                    </View> */}
        </ScrollView>
      }
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          height: 52,
          width: '100%',
          borderRadius: 6,
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          marginTop: '30%',
          position: 'absolute',
          bottom: 70,
          shadowColor: '#000', // Adjust the bottom spacing as needed
          left: 0,
          right: 0,
        }}
        onPress={() => {
          if (Platform.OS === 'ios') {
      ReactNativeHapticFeedback.trigger("impactMedium", options);
    }
          // if (holdings) {
          navigation.navigate('TradePage', {
            state: item,
            asset: currentAsset,
          });
          // }
        }}>
        <LinearGradient
          useAngle={true}
          angle={150}
          colors={['#fff', '#fff']}
          style={{
            width: '100%',
            borderRadius: 100,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: '#000',
              fontSize: 14,
              fontFamily: 'Unbounded-ExtraBold',
            }}>
            TRADE {item.symbol.toUpperCase()}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    color: '#ffffff',
    fontFamily: `Satoshi-Bold`,
    fontWeight: '500',
    marginLeft: 30,
  },
  depWith: {
    flexDirection: 'row',
    height: '100%',
    width: '47%',
    borderRadius: 6,
  },

  innerDepColored: {
    backgroundColor: '#1D1D1D',
  },

  innerDep: {
    width: '100%',
    flexDirection: 'row',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '1%',
    // backgroundColor: '#141414',
  },
});

export default MarketInfo;
