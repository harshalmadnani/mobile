import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, StyleSheet, Image, FlatList, Modal,Navigation, ScrollView} from 'react-native';
import LineChart from '../../../../component/charts/LineChart';
import Svg, { Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import styles from '../investment-styles';
import MyInvestment from '../tradeCollection/myInvestment';
import {POINTS_KEY} from '@env';
import {useDispatch, useSelector} from 'react-redux';
import {getCryptoHoldingForAddressFromMobula} from '../../../../store/actions/portfolio';
import { getCryptoHoldingForAddress } from '../../../../utils/cryptoWalletApi';
const Portfolio = ({navigation}) => {
const dispatch = useDispatch();
const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};
  const addPoints = async () => {
    try {
      const address = global.withAuth
        ? global.loginAccount.scw
        : global.connectAccount.publicAddress;
      // const address = ''
      
      const inputValue = {
        userId: address,
        // userId: address.toLowerCase(),
        transactionAmount: 0,
        key: POINTS_KEY,
      };
      const response = await fetch('https://refer.xade.finance/points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': POINTS_KEY,
        },
        body: JSON.stringify(inputValue),
      });
      const data = await response.json();
      if (data.points > 0) return data.points.toFixed(0).toLocaleString();
      else return 0;
    } catch (err) {
      console.error(err);
    }
  };
  console.log({points})
  const [points, setPoints] = useState('...');
  useEffect(() => {
    async function logic() {
      const _points = await addPoints();
      global.points = _points;
      setPoints(_points);
    }
    logic();
  });
  dispatch(getCryptoHoldingForAddressFromMobula());
    return (
      
  <SafeAreaView style={{backgroundColor: '#000',flex: 1}}>
   <View style={{
    marginTop: '8%',
    marginBottom: '2%',
    marginLeft: '5%',
    marginRight: '5%', // Added marginRight to ensure space is maintained from the right edge
    flexDirection: 'row',
    justifyContent: 'space-between', // This line positions items on opposite ends
  }}>
    <Text style={{fontFamily:'Unbounded-Medium', color:'#fff', fontSize: 20}}>
      PORTFOLIO
    </Text>
    <TouchableOpacity 
         onPress={() => navigation.push('TransactionHistory')}>
      <Image
        source={{ uri: 'https://res.cloudinary.com/dcrfpsiiq/image/upload/v1709493378/x8e21kt9laz3hblka91g.png' }} // Replace with your image URI
        style={{
          width: 40,
          height: 40,
          bottom: 3
        }}
      />
    </TouchableOpacity>
  </View>

      <ScrollView>
        <View
              style={{
                alignItems: 'center',
                marginTop: '8%'
              }}>

              <Text style={styles.portfolioHead}>Portfolio Value</Text>
            </View>
            <View style={styles.portfoioPriceContainer}>
                <Text style={styles.stockPrice}>
                  $100
                  {/* {currentItem.current_price.toLocaleString()} */}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center', // Vertically center
                    justifyContent: 'center',
                    marginTop: '1%',
                  }}>
                  <Text
                    style={{
                      color:
                      '#C68DFF',
                      fontFamily: 'Unbounded-Medium',
                      fontSize: 14,
                      textAlign: 'center',
                    }}>
+$198.8 (+10% today)
                  </Text>
                </View>
              </View>


      <View style={{  alignItems: 'center' }}>

        <LineChart/>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8  }}>
  <View style={{ flex: 1, height: 1,marginLeft:'5%',marginRight:'5%', backgroundColor: '#292929' }} />
</View>
<View style={{
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: '3%',
    marginRight:'5%',
    marginLeft:'3%',
    marginBottom:'3%'

  }}>
    <Text style={{fontFamily:'Montreal-Medium', color:'#fff', fontSize: 16,}}>
      Cash Balance
    </Text>
    <Text style={{fontFamily:'Unbounded-Medium', color:'#fff', fontSize: 16}}>
$100
    </Text>
  </View>
  {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: '1%', alignItems: 'center', height: 85, marginBottom: '5%',marginTop:'8%' }}>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 27, marginRight: '1%',backgroundColor:'#121212' , borderRadius: 30}}>
        <Text style={{ fontSize: 12, color: '#fff', marginBottom: 5 ,fontFamily:'Montreal-Bold'}}>Total Invested</Text>
        <Svg height="28" width="60" style={{justifyContent: 'center', alignItems: 'center'}}>
    <Defs>
    <LinearGradient id="gradient" x1="0" y1="0" x2="0" y2="100%">
  <Stop offset="0" stopColor="#fff" />
  <Stop offset="1" stopColor="#C0C0C0" />
</LinearGradient>

    </Defs>
    <SvgText
      fill="url(#gradient)"
      x="0"
      y="20"
      fontSize="16"
      fontFamily='Unbounded-Bold'
    >
$800
    </SvgText>
  </Svg>
      </View>


      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 27, marginLeft: '1%' , borderRadius: 30,backgroundColor:'#121212'}}>
        <Text style={{ fontSize: 12, color: '#fff', marginBottom: 5,fontFamily:'Montreal-Bold' }}>Total Returns</Text>
        <Svg height="28" width="60" style={{justifyContent: 'center', alignItems: 'center'}}>
    <Defs>
    <LinearGradient id="gradient" x1="0" y1="0" x2="0" y2="100%">
  <Stop offset="0" stopColor="#fff" />
  <Stop offset="1" stopColor="#C0C0C0" />
</LinearGradient>

    </Defs>
    <SvgText
      fill="url(#gradient)"
      x="0"
      y="20"
      fontSize="16"
      fontFamily='Unbounded-Bold'
      justifyContent='center'
    >
$800
    </SvgText>
  </Svg>
      </View>
    </View> */}
          <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      height: 72,
      width:'95%',
      margin:'5%',
      borderRadius: 20,
      backgroundColor: '#121212',
      padding: 16,
      overflow: 'hidden',
    }}>
      <Image
        source={{ uri: 'https://res.cloudinary.com/dcrfpsiiq/image/upload/v1709489668/f2gqkcuheacirjnusuz9.png' }} // Replace with your image URI
        style={{
          width: 40,
          height: 40,
          marginRight: 12,
        }}
      />
      <View style={{
        // This container can hold additional styling if necessary for text layout
      }}>
 <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#121212' }}>
      <Text style={{ fontSize: 16, color: '#fff' ,fontFamily:'Montreal-Medium'}}>You have </Text>
  {/* <Svg height="28" width="38" style={{justifyContent: 'center', alignItems: 'center'}}>
    <Defs>
    <LinearGradient id="gradient" x1="0" y1="0" x2="0" y2="100%">
  <Stop offset="0" stopColor="#fff" />
  <Stop offset="1" stopColor="#C0C0C0" />
</LinearGradient>

    </Defs>
    <SvgText
      fill="url(#gradient)"
      x="0"
      y="20"
      fontSize="16"
      fontFamily='Montreal-Bold'
    >
  {points !== undefined ? points : '0'}
    </SvgText>
  </Svg> */}
    <Text style={{ fontSize: 16, color: '#fff' ,fontFamily:'Montreal-Bold' ,textShadowColor: '#C68DFF',
  textShadowOffset: {width: -1, height: 1},
  textShadowRadius:10}}>200 </Text>
      <Text style={{ fontSize: 16, color: '#fff' }}>coins</Text>
    </View>
        <Text style={{
          fontSize: 14,
          color: '#9C9C9C', 
          fontFamily:'Montreal-Medium'
        }}>Xade Coins can be redeemed </Text>
      </View>
    </View>
    <Text style={{
    fontSize: 16,
    color: '#787878', // Assuming you want white text color
    textAlign: 'left', // Aligns text to the left
    alignSelf: 'flex-start', // Aligns the Text component to the start of the flex container
    width: '75%', // Match the width of your other content for consistency
    paddingLeft: 30,
    marginTop: '2%' ,
    marginBottom: '2%' // Optional: if you want some space from the left edge
  }}>
    My Investments
  </Text>
    <MyInvestment navigation={navigation} />
      </View>
      </ScrollView>
      <TouchableOpacity 
        onPress={() => {navigation.push('Ramper')}}
        style={{
          position: 'absolute', // Positions the button over the content
          bottom: 60, // Distance from the bottom of the screen
          width:'95%',
          height: 56, // Button height
          borderRadius: 28, // Circular button
          backgroundColor: '#C68DFF', // Button color
          justifyContent: 'center', // Center the icon or text inside the button
          alignItems: 'center', // Center the icon or text inside the button
          shadowColor: "#C68DFF", // Shadow for the button
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.5,
          shadowRadius: 10,
          elevation: 5, // Elevation for Android
        }}
      >
        {/* Add Icon or Text inside the TouchableOpacity as needed */}
        <Text style={{ color: '#000', fontSize: 16,fontFamily:'Unbounded-Medium' }}>ADD FUNDS</Text>
      </TouchableOpacity>
      </SafeAreaView>
    );
  };
  
  export default Portfolio;