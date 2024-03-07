import React, {useState, Component, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-elements';
import FastImage from 'react-native-fast-image';

const MyInvestmentItemCard = ({navigation, item}) => {
console.log("Image",item.price_change_percentage_24h);

    return (
        <TouchableOpacity
            onPress={ (e) => {
                // navigation.push('MarketInfo');
            }}
            style={{
                width: '100%',
                alignSelf: 'flex-start',
                paddingVertical: '5%'
                // backgroundColor: 'red'
            }}>
        
            <View style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent:'space-between',
                alignItems: 'center',
            }}>
                <View style={{
                    display: 'flex', 
                    flexDirection: 'row',
                    justifyContent:'space-between',
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

                <View style={{
                    paddingHorizontal: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent : 'center',
                    alignItems: 'flex-end',
                    // backgroundColor: 'red'
                }}>
                    <View>
                    <Text style={styles.text2}>${(item.current_price * item.balance).toFixed(3)}</Text>
                    </View>
                    <View>
                                {
                                    item.price_change_percentage_24h >= 0 && <Text style={styles.text3}>+ {item.price_change_percentage_24h/(item.current_price-item.price_change_percentage_24h)} %</Text>
                                }
                                {
                                    item.price_change_percentage_24h < 0 && <Text style={styles.text4}> {item.price_change_percentage_24h.toFixed(2)} %</Text>
                                }
                            </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}



const styles = StyleSheet.create({
    heading : { 
        fontSize: 20,
        color: '#ffffff',
        fontFamily: `Satoshi-Bold`,
       fontWeight: "500" ,
        marginLeft: 30
    },
    text1: {
        fontSize: 16,
       fontWeight: "500" ,
        fontFamily: 'Montreal-Bold',
        color: '#ffffff',
    },
    text2 :{
        fontSize: 16,
        fontFamily: 'Unbounded-Bold',
        color: '#fff',

    },
    text3: {
        fontSize: 14,
       fontWeight: "500" ,
        fontFamily: 'Unbounded-Medium',
        color: '#ADFF6C',

    },
    text4: {
        fontSize: 14,
       fontWeight: "500" ,
        fontFamily: 'Unbounded-Medium',
        color: '#ff6c6c',

    },
    text5: {
        fontSize: 14,
       fontWeight: "500" ,
        fontFamily: 'Montreal-Medium',
        color: '#787878',

    }
})

export default MyInvestmentItemCard;
