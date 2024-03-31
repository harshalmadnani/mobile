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
import FastImage from 'react-native-fast-image';
import {Icon, Image} from '@rneui/themed';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false
};
const MyInvestmentItemCard = ({navigation, item}) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <TouchableOpacity
      onPress={e => {
        if (Platform.OS === 'ios') {
      ReactNativeHapticFeedback.trigger("impactMedium", options);
    }
        setModalVisible(true);
      }}
      style={{
        width: '100%',
        alignSelf: 'flex-start',
        paddingVertical: '5%',
        // backgroundColor: 'red',
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
            // backgroundColor: 'red',
          }}>
          <View style={{paddingHorizontal: 5}}>
            <FastImage
              style={{width: 42, height: 42}}
              source={{
                uri: `${item.image}`,
              }}
            />
          </View>

          <View style={{paddingHorizontal: 10}}>
            <View>
              <Text style={styles.text1}>{item.symbol.toUpperCase()}</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
              <View style={{paddingRight: 10}}>
                <Text style={styles.text5}>{item.balance}</Text>
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
              // backgroundColor: 'red'
            }}>
            <View>
              <Text style={styles.text2}>
                ${(item.current_price * item.balance)?.toFixed(3)}
              </Text>
            </View>
            <View>
              {item.unrealized_pnl >= 0 && (
                <Text style={styles.text3}>
                  +
                  {(
                    (item.unrealized_pnl + item.realized_pnl) /
                    item.price_bought
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
                  paddingTop: 60, // Add more padding at the top for the icon
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5,
                  width: '100%',
                  height: '80%',
                  position: 'relative', // To absolutely position the close icon
                }}>
                {/* Close Icon */}
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    top: 25, // Adjust as needed
                    left: 15, // Adjust as needed
                    zIndex: 1, // Ensure it's above other content
                  }}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Icon name="close" size={35} color="#fff" />
                </TouchableOpacity>

                {/* Image */}
                <Image
                  source={{uri: item.image}}
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
                  ${item?.current_price?.toFixed(2)}
                </Text>
                <Text
                  style={{
                    color: '#A4A4A4',
                    fontSize: 16,
                    fontFamily: 'NeueMontreal-Medium',
                    marginTop: '0.5%',
                  }}>
                  {item.name} ({item.symbol})
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
                      ${(item?.current_price * item?.balance)?.toFixed(2)}
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
                    {' '}
                    $
                    {(
                      item?.current_price * item?.balance -
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
                    ${item?.price_bought?.toFixed(2)}
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
                      color: item.unrealized_pnl >= 0 ? '#ADFF6C' : 'red',
                      textAlign: 'right',
                      flex: 1,
                      fontFamily: 'Unbounded-Medium',
                    }}>
                    ${item?.unrealized_pnl?.toFixed(2)}
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
                      color: item.realized_pnl >= 0 ? '#ADFF6C' : 'red',
                      textAlign: 'right',
                      flex: 1,
                      fontFamily: 'Unbounded-Medium',
                    }}>
                    ${item?.realized_pnl?.toFixed(2)}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={{
                  position: 'absolute', // Positions the button over the content
                  width: '95%',
                  marginTop: '10%',
                  height: 56, // Button height
                  borderRadius: 28, // Circular button
                  backgroundColor: '#FFF', // Button color
                  justifyContent: 'center', // Center the icon or text inside the button
                  alignItems: 'center', // Center the icon or text inside the button
                  shadowColor: '#C68DFF', // Shadow for the button
                  shadowOffset: {
                    width: 0,
                  },
                  shadowOpacity: 0.5,
                  shadowRadius: 10,
                }}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate('TradePage', {
                    state: item,
                    asset: item.name,
                  });
                  // }
                }}>
                <Text
                  style={{
                    color: '#000',
                    fontSize: 16,
                    fontFamily: 'Unbounded-Medium',
                  }}>
                  TRADE {item.symbol}
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
    color: '#ff6c6c',
  },
  text5: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'NeueMontreal-Medium',
    color: '#787878',
  },
});

export default MyInvestmentItemCard;
