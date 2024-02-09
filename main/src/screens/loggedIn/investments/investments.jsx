import React, { useState, Component, useEffect } from 'react';
import {
  TouchableOpacity,
  TouchableHighlight,
  SafeAreaView,
  Text,
  View,
  Image,
  ScrollView,
  Clipboard,
  Alert,
  Modal,
  Linking,
  Dimensions,
  RefreshControl,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { CRYPTO_LIST } from './data/crypto';
import { ImageAssets } from '../../../../assets';
import TradeItemCard from './TradeItemCard';

const idToChain = {
  "btc": {
    "tokenAddress": "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
    "chain": "polygon"
  },
  "eth": {
    "tokenAddress": "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    "chain": "polygon"
  },
  "matic": {
    "tokenAddress": "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    "chain": "polygon"
  }

};
const Investments = ({ navigation }) => {
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;

  const [cryptoData, setCryptoData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [section, setSection] = useState('crypto');

  useEffect(() => {

    async function fetchCryptoData() {
      setIsLoading(true);
      try {
        const data = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=150&page=1&sparkline=false&locale=en', {
          method: 'GET',
          
          // body: json,
          headers: {
            'Content-Type': 'application/json',
            'x-cg-demo-api-key': 'CG-vwTDdcvqR2QNrytke2e4WKVR',
          },
        });
        let json = await data.json()
        console.log(json);
        setCryptoData(json.filter(item => {
          if (["btc","eth","bnb",'sol','xrp','ada','avax','doge','trx','dot','link','ton','matic','shib','ltc','bch','uni','atom','etc','op','near','fil','ldo','imx','arb','mkr','rndr','grt','egld','aave','snx','sand','axs','ftm','beam','mana','xtz','eos','rose','cake','crv','uma','gmt','comp','1inch','gmx'].includes(item.symbol)) 
          return true;
          else
          return false;
                  }).map(item => {
if(['btc', 'eth', 'matic'].includes(item.symbol))
            return {
                ...item,
                tokenAddress: idToChain[item.symbol].tokenAddress,
                chain: idToChain[item.symbol].chain
            };
else
return item
        })

        )

      }catch (e) {
        console.log(e);
      }
      setIsLoading(false);
    }

    fetchCryptoData();
  }, []);

  return (
    <SafeAreaView
      style={{
        width: width,
        height: height,
        alignSelf: 'flex-start',
        backgroundColor: '#000000',
        paddingBottom: 80
        // backgroundColor: 'red'
      }}>

      <View
        style={{
        }}
      >
        <View
          style={{
            // position: 'absolute',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            paddingLeft: '5%',
            width: width * 0.9,
          }} >
          {/* <Icon
            name={'keyboard-backspace'}
            size={30}
            color={'#f0f0f0'}
            type="materialicons"
            onPress={() => navigation.goBack()}
          /> */}

          {/* <Text style={styles.heading}>
            Trade
          </Text> */}

        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 4, marginTop: 24, paddingBottom: -8, paddingHorizontal: "4%", borderBottomWidth: 2, borderBottomColor: "#1C1C1C",
          // paddingHorizontal: -16
        }}>
          <TouchableOpacity
            style={{
              borderBottomWidth: section === 'crypto' ? 2 : 0,
              borderBottomColor: section === 'crypto' ? '#ffffff' : '#1C1C1C',
              paddingBottom: 16,
              paddingHorizontal: 16,
              marginBottom: section === 'crypto' ? -2 : 0,
            }}
            onPress={() => setSection('crypto')}
          >
            <Text style={{
              fontFamily: `Satoshi-Bold`,
              fontSize: 14,
              color: section === 'crypto' ? '#ffffff' : '#717171',
              fontWeight: "500",
            }}>
              CRYPTO
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderBottomWidth: section === 'stocks' ? 2 : 0,
              borderBottomColor: section === 'stocks' ? '#ffffff' : '#1C1C1C',
              paddingBottom: 16,
              marginBottom: section === 'stocks' ? -2 : 0,
            }}
            onPress={() => setSection('stocks')}
          >
            <Text style={{
              fontFamily: 'Satoshi-Bold',
              fontSize: 14,
              color: section === 'stocks' ? '#ffffff' : '#717171',
              fontWeight: "500",
            }}>
              STOCKS
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderBottomWidth: section === 'commodities' ? 2 : 0,
              borderBottomColor: section === 'commodities' ? '#ffffff' : '#1C1C1C',
              paddingBottom: 16,
              marginBottom: section === 'commodities' ? -2 : 0,
            }}
            onPress={() => setSection('commodities')}
          >
            <Text style={{
              fontFamily: 'Satoshi-Bold',
              fontSize: 14,
              color: section === 'commodities' ? '#ffffff' : '#717171',
              fontWeight: "500",
            }}>
              COMMODITIES
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderBottomWidth: section === 'forex' ? 2 : 0,
              borderBottomColor: section === 'forex' ? '#ffffff' : '#1C1C1C',
              paddingBottom: 16,
              paddingHorizontal: 16,
              marginBottom: section === 'forex' ? -2 : 0,
            }}
            onPress={() => setSection('forex')}
          >
            <Text style={{
              fontFamily: 'Satoshi-Bold',
              fontSize: 14,
              color: section === 'forex' ? '#ffffff' : '#717171',
              fontWeight: "500",
            }}>
              FOREX
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {
        isLoading &&
        <View style={{ height: '100%' }}>
          <ActivityIndicator size={30} style={{ marginTop: '40%' }} color="#fff" />
        </View>
      }

      {!isLoading && 
      section === 'crypto' ?
        <ScrollView
          scrollEnabled
          style={{
            // paddingTop:'15%',
            marginTop: '1%',
            // backgroundColor: 'blue',
          }}>
          {
            cryptoData && cryptoData.map((e) => {
              return <TradeItemCard navigation={navigation} item={e} />
            })
          }
        </ScrollView>
        :
        section === 'forex' ?
        <View
          style={{
            height: height * 0.8,
            width: '100%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            // paddingHorizontal: 20,
            // paddingVertical: 12,
          }}
        >
          <View>
            <Image source={ImageAssets.forexImg} style={{ height: 200, width: 200 }} />
          </View>
          <View style={{ marginBottom: 50, alignItems: 'flex-start', gap: 10 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#D1D2D9', textAlign: 'justify', fontFamily: 'Satoshi-Regular' }}>
              Coming Soon
            </Text>
          </View>
        </View>
        :
        section === 'stocks' ?
        <View
        style={{
          height: height * 0.8,
          width: '100%',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          // paddingHorizontal: 20,
          // paddingVertical: 12,
        }}
      >
        <View>
          <Image source={ImageAssets.stocksImg} style={{ height: 200, width: 200 }} />
        </View>
        <View style={{ marginBottom: 50, alignItems: 'flex-start', gap: 10 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#D1D2D9', textAlign: 'justify', fontFamily: 'Satoshi-Regular' }}>
            Coming Soon
          </Text>
        </View>
      </View>
      :
      <View
      style={{
        height: height * 0.8,
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // paddingHorizontal: 20,
        // paddingVertical: 12,
      }}
    >
      <View>
        <Image source={ImageAssets.commodotiesImg} style={{ height: 200, width: 200 }} />
      </View>
      <View style={{ marginBottom: 50, alignItems: 'flex-start', gap: 10 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#D1D2D9', textAlign: 'justify', fontFamily: 'Satoshi-Regular' }}>
          Coming Soon
        </Text>
      </View>
    </View>
      }



    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    color: '#ffffff',
    fontFamily: `Satoshi-Bold`,
    fontWeight: "500",
    marginLeft: 30
  },
})

export default Investments;
