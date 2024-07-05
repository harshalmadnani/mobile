import React, {useState, Component, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Button,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import FastImage from 'react-native-fast-image';
import {Icon, Image} from '@rneui/themed';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {setAssetMetadata} from '../../../../store/actions/market';
import {NetworkChainInfo} from '../../../../utils/constants';
import {getCurrencyIcon} from '../../../../utils/currencyicon';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};
const MyInvestmentItemCard = ({navigation, item}) => {
  const [modalVisible, setModalVisible] = useState(false);
  let currentAsset;
  const holdings = useSelector(x => x.portfolio.holdings);
  const isUsd = useSelector(x => x.auth.isUsd);
  const exchRate = useSelector(x => x.auth.exchRate);
  const currency_name = useSelector(x => x.auth.currency);
  const currency_icon = getCurrencyIcon(currency_name);
  // console.log('currency', isUsd, currency_icon, exchRate);
  currentAsset = holdings?.assets?.filter(
    x => x.asset?.symbol?.toLowerCase() === item?.symbol?.toLowerCase(),
  );
  const dispatch = useDispatch();

  return (
    <TouchableOpacity
      onPress={e => {
        if (Platform.OS === 'ios') {
          ReactNativeHapticFeedback.trigger('impactMedium', options);
        }
        setModalVisible(true);
      }}
      style={{
        width: '100%',
        alignSelf: 'flex-start',
        paddingVertical: '5%',
      }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{paddingHorizontal: 5}}>
            <FastImage
              style={{width: 42, height: 42}}
              source={{
                uri: `${item?.image}`,
              }}
            />
          </View>

          <View style={{paddingHorizontal: 10}}>
            <View>
              <Text style={styles.text1}>{item?.symbol?.toUpperCase()}</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
              <View style={{flexDirection: 'row', paddingRight: 10}}>
                <Text style={styles.text5}>{item?.balance?.toFixed(5)}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              paddingHorizontal: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}>
            <View>
              <Text style={styles.text2}>
                {isUsd ? `$` : `${currency_icon}`}
                {(
                  item?.current_price *
                  item?.balance *
                  (isUsd ? 1 : parseFloat(exchRate))
                )?.toFixed(3)}
              </Text>
            </View>
            <View>
              {item.unrealized_pnl >= 0 && (
                <Text style={styles.text3}>
                  +
                  {(
                    (item?.unrealized_pnl + item?.realized_pnl) /
                    item?.price_bought
                  )?.toFixed(2)}
                  %
                </Text>
              )}
              {item.unrealized_pnl < 0 && (
                <Text style={styles.text4}>
                  {(
                    (item?.unrealized_pnl + item?.realized_pnl) /
                    item?.price_bought
                  )?.toFixed(2)}
                  %
                </Text>
              )}
            </View>
          </View>
          <View style={{alignSelf: 'center'}}>
            <Icon
              name={'expand-more'}
              size={24}
              color={'#f0f0f0'}
              type="materialicons"
            />
          </View>
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
                  height: '80%',
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
                <Image
                  source={{uri: item?.image}}
                  style={{width: 48, height: 48}}
                  resizeMode="contain"
                />

                {/* Price */}
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 24,
                    fontFamily: 'Unbounded-Medium',
                    marginVertical: 10,
                  }}>
                  {isUsd ? `$` : `${currency_icon}`}
                  {(
                    item?.current_price * (isUsd ? 1 : parseFloat(exchRate))
                  )?.toFixed(2)}
                </Text>
                <Text
                  style={{
                    color: '#A4A4A4',
                    fontSize: 16,
                    fontFamily: 'NeueMontreal-Medium',
                    marginTop: '0.5%',
                  }}>
                  {item?.name} ({item?.symbol})
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
                      {isUsd ? `$` : `${currency_icon}`}
                      {(
                        item?.current_price *
                        item?.balance *
                        (isUsd ? 1 : parseFloat(exchRate))
                      )?.toFixed(2)}
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
                        color: item.unrealized_pnl >= 0 ? '#ADFF6C' : 'red',
                        fontFamily: 'Unbounded-Bold',
                      }}>
                      {(
                        (item?.realized_pnl + item?.unrealized_pnl) /
                        (item?.current_price * item?.balance -
                          item?.unrealized_pnl -
                          item?.realized_pnl)
                      )?.toFixed(2)}
                      %
                    </Text>
                  </View>
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
                    {isUsd ? `$` : `${currency_icon}`}
                    {(
                      item?.current_price *
                        item?.balance *
                        (isUsd ? 1 : parseFloat(exchRate)) -
                      item?.unrealized_pnl -
                      item?.realized_pnl
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
                    Entry Price:
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#fff',
                      textAlign: 'right',
                      flex: 1,
                      fontFamily: 'Unbounded-Medium',
                    }}>
                    {isUsd ? `$` : `${currency_icon}`}
                    {(
                      item?.price_bought * (isUsd ? 1 : parseFloat(exchRate))
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
                      color: item?.unrealized_pnl >= 0 ? '#ADFF6C' : 'red',
                      textAlign: 'right',
                      flex: 1,
                      fontFamily: 'Unbounded-Medium',
                    }}>
                    {isUsd ? `$` : `${currency_icon}`}
                    {(
                      item?.unrealized_pnl * (isUsd ? 1 : parseFloat(exchRate))
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
                    Realized PnL:
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: item?.realized_pnl >= 0 ? '#ADFF6C' : 'red',
                      textAlign: 'right',
                      flex: 1,
                      fontFamily: 'Unbounded-Medium',
                    }}>
                    {isUsd ? `$` : `${currency_icon}`}
                    {(
                      item?.realized_pnl * (isUsd ? 1 : parseFloat(exchRate))
                    )?.toFixed(2)}
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
                    Chain:
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      source={{
                        uri: NetworkChainInfo.filter(
                          x =>
                            x.chainId ===
                            item?.contracts_balances?.[0]?.chainId,
                        )?.[0]?.logo,
                      }}
                      style={{
                        width: 18,
                        height: 18,
                        marginRight: 8,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        color: '#fff',
                        fontFamily: 'Unbounded-Medium',
                      }}>
                      {
                        NetworkChainInfo.find(
                          x =>
                            x.chainId ===
                            item?.contracts_balances?.[0]?.chainId,
                        )?.name
                      }
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  width: '95%',
                  marginTop: '10%',
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: '#FFF',
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: '#C68DFF',
                  shadowOffset: {
                    width: 0,
                  },
                  shadowOpacity: 0.5,
                  shadowRadius: 10,
                }}
                onPress={() => {
                  setModalVisible(false);
                  dispatch(setAssetMetadata(item?.name));
                  navigation.navigate('TradePage', {
                    state: item,
                    asset: currentAsset,
                  });
                }}>
                <Text
                  style={{
                    color: '#000',
                    fontSize: 16,
                    fontFamily: 'Unbounded-Medium',
                  }}>
                  TRADE {item?.symbol}
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    color: '#ffffff',
    fontFamily: `Satoshi-Bold`,
    fontWeight: '500',
  },
  text1: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'NeueMontreal-Bold',
    color: '#ffffff',
  },
  text2: {
    fontSize: 16,
    fontFamily: 'Unbounded-Bold',
    color: '#fff',
  },
  text3: {
    fontSize: 14,
    fontFamily: 'Unbounded-Medium',
    color: '#ADFF6C',
  },
  text4: {
    fontSize: 14,
    fontFamily: 'Unbounded-Medium',
    color: 'red',
  },
  text5: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'NeueMontreal-Medium',
    color: '#787878',
  },
});

export default MyInvestmentItemCard;
