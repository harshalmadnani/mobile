import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Dimensions, SafeAreaView, ScrollView } from 'react-native';
import { ImageAssets } from '../../../../../assets';
import { Icon } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import '@ethersproject/shims';
import {ethers} from 'ethers';
const TradePage = ({ route, navigation }) => {
  const [tradeType, setTradeType] = useState("buy");
  const [orderType, setOrderType] = useState("market");
  const [selectedDropDownValue, setSelectedDropDownValue] = useState("spot");
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [value, setValue] = useState("1");
  const [convertedValue, setConvertedValue] = useState("token");
  const [commingSoon, setCommingSoon] = useState(false);
  const [changeSlipage, setChangeSlipage] = useState(false);
  const [slipageValue, setSlipageValue] = useState("1");
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  const idToChain = {
    "bitcoin": {
      "tokenAddress": "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
      "chain": "polygon"
    },
    "ethereum": {
      "tokenAddress": "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
      "chain": "polygon"
    }
  };
  

  
console.log (route,"Mad")
  return (
    <SafeAreaView
      style={{ 
        backgroundColor: '#000000',
        paddingBottom: 80,
        flex: 1, 
      }}> 
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: "3%", width: width, marginBottom: 24 }}>
        <View
          style={{ 
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingLeft: '5%',
            width: width * 0.9,
          }} >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon
              name={'keyboard-backspace'}
              size={30}
              color={'#f0f0f0'}
              type="materialicons"
              onPress={() => navigation.goBack()}
            />

            <Text
              style={{
                fontSize: 20,
                color: '#ffffff',
                fontFamily: `Satoshi-Bold`,
               fontWeight: "500" ,
                marginLeft: 30
              }}>
              Trade
            </Text>
          </View>

        </View>
      </View>
      <View
        style={{
          height: 500,
          width: '100%',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          // paddingHorizontal: 20,
          // paddingVertical: 12,
        }}
      >
        <View>
          <Image source={ImageAssets.algoImg} style={{height: 200, width: 200}} />
        </View>
        <View style={{ marginBottom: 50, alignItems: 'flex-start', gap: 10 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#D1D2D9', textAlign: 'justify' }}>
       Coming Soon
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}; export default TradePage;
// const idToChain = {
//   "btc": {
//     "tokenAddress": "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
//     "chain": "polygon",
//     "decimal": "18"
//   },
//   "eth": {
//     "tokenAddress": "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
//     "chain": "polygon"
//   },
//   "matic": {
//     "tokenAddress": "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
//     "chain": "polygon"
//   }

// };
// const TradePage = ({ route, navigation }) => {
//   const [quote, setQuote] = useState(null);
//   const [tradeData, setTradeData] = useState(null);
//   const [resultPrice, setResultPrice] = useState(null);
//   const [entryPrice, setEntryPrice] = useState(null);
//   const [tradeType, setTradeType] = useState("buy");
//   const [orderType, setOrderType] = useState("market");
//   const [selectedDropDownValue, setSelectedDropDownValue] = useState("Spot");
//   const [isModalOpen, setIsModalOpen] = useState(true);
//   const [value, setValue] = useState("1");
//   const [convertedValue, setConvertedValue] = useState("token");
//   const [commingSoon, setCommingSoon] = useState(false);
//   const [changeSlipage, setChangeSlipage] = useState(false);
//   const [slipageValue, setSlipageValue] = useState("2");
//   const width = Dimensions.get('window').width;
//   const height = Dimensions.get('window').height;
//   const state = route.params.state;
//   const [isLoading, setIsLoading] = useState(true);
//   const fromChain = 'polygon';
//   const toChain = 'polygon';
//   const maxSlippage = '0.0'+slipageValue.toString();
//   const fromUserAddress = authAddress.toLowerCase();
//   const toUserAddress = authAddress.toLowerCase();
//   const projectId = 'xade';
//   const { tokenSymbol, toTokenSymbol, fromTokenAddress, toTokenAddress, tokenAmount } = (tradeType === "buy") ? {
//     tokenSymbol: "USDC.e",
//     fromTokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
//     tokenAmount : (value * Math.pow(10,6)).toString(),
//     toTokenSymbol: state.item.symbol.toString().toUpperCase(),
//     toTokenAddress: idToChain[state.item.symbol].tokenAddress.toString().toLowerCase()
// } : {
//     tokenSymbol: state.item.symbol.toString().toUpperCase(),
//     fromTokenAddress: idToChain[state.item.symbol].tokenAddress.toString().toLowerCase(),
//     toTokenSymbol: "USDC.e",
//     tokenAmount : (value * Math.pow(10,8)).toString(),
//     toTokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
// };
// console.log(tokenSymbol);
// console.log(fromTokenAddress);
// console.log(toTokenAddress);
// console.log(toTokenSymbol);
// console.log('token amount:',tokenAmount);
// console.log(maxSlippage);
//   // Construct URL with variables
//   const url = `https://swap.prod.swing.xyz/v0/transfer/quote?tokenSymbol=${tokenSymbol}&toTokenSymbol=${toTokenSymbol}&tokenAmount=${tokenAmount}&fromTokenAddress=${fromTokenAddress}&fromChain=${fromChain}&toChain=${toChain}&fromUserAddress=${fromUserAddress}&toUserAddress=${toUserAddress}&toTokenAddress=${toTokenAddress}&maxSlippage=${slipageValue}&projectId=${projectId}`;
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(url);
//         setQuote(response.data.routes[0].quote);
//         setIsLoading(false);
//       } catch (error) {
//         setError(error);
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [url]); // Now this effect depends on url, so it will refetch data if url changes

//   // Calculate resultAmount when quote changes
//   useEffect(() => {
//     if (quote && quote.amount) {
// setResultPrice(quote.amount/ Math.pow(10,quote.decimals));
//     }
//   }, [quote, value]);


//     // Calculate entryPrice when quote changes
//   useEffect(() => {
//     if (quote && quote.amount) {
//       const parsedValue = parseInt(value, 10);
//       const parsedQuoteAmount = parseInt(resultPrice, 10);
//       if (!isNaN(parsedValue) && !isNaN(parsedQuoteAmount)) {
//         setEntryPrice(parsedQuoteAmount/parsedValue);
//       }
//     }
//   }, [quote, value]);
  

// console.log('result amount', resultPrice);
// //Approval(main api)
// // useEffect(() => {
// //   const callApprovalApi = async () => {
// //     if (quote && quote.integration) {
// //       console.log('integartion',quote.integration);
// //       // Construct the new API endpoint
// //       const allowUrl = `https://swap.prod.swing.xyz/v0/transfer/allowance?tokenSymbol=${tokenSymbol}&toTokenSymbol=${toTokenSymbol}&tokenAddress=${fromTokenAddress}&fromChain=${fromChain}&toChain=${toChain}&fromAddress=${fromUserAddress}&toTokenAddress=${toTokenAddress}&bridge=${quote.integration}`;
// //       try {
// //         // Make the API call with axios
// //         const response = await axios.get(allowUrl);
// //         setIsLoading(false);
// //         // Do something with the response
// //         console.log('Response from allowance API call:', response.data);
// //       } catch (error) {
// //         // Handle any errors from the second API call
// //         console.error('Error in second API call:', error);
// //         setIsLoading(false);
// //       }
// //     }
// //   };
// //   callApprovalApi(); // Call the function
// // }, [quote]);

// //Allowance(not required api)
// useEffect(() => {
//   const callAllowanceApi = async () => {
//     if (quote && quote.integration) {
//       // Construct the new API endpoint
//       const approveUrl = `https://swap.prod.swing.xyz/v0/transfer/approve?tokenSymbol=${tokenSymbol}&tokenAmount=${tokenAmount}&toTokenSymbol=${toTokenSymbol}&tokenAddress=${fromTokenAddress}&fromChain=${fromChain}&toChain=${toChain}&fromAddress=${fromUserAddress}&toTokenAddress=${toTokenAddress}&bridge=${quote.integration}`;
//       try {
//         // Make the API call with axios
//         const response = await axios.get(approveUrl);
//         setTradeData(response.data.tx);
//         console.log('TRADE DATA IS ',tradeData);
//         // Do something with the response
//         console.log('Response from approval API call:', response.data);
//       } catch (error) {
//         // Handle any errors from the second API call
//         console.error('Error in approval API call:', error);
//       }
//     }
//   };
//   callAllowanceApi(); // Call the function
// }, [quote]);


// //signing and approving transaction
// const Web3 = require('web3');
// let web3;
// async function executeTrade(
//   smartAccount,
//   tradeDetails,
//   navigation,
//   setStatus,
// ) {
//   setStatus('Preparing Trade...');
//   web3 = this.createProvider();
//   setStatus('Creating Trade Transactions...');
//   try {
//     if (response.data.tx.data && quote.integration) {
//       const tradeData= response.data.tx.data;
//       console.log('tradeData',tradeData);
//   }
// }
// catch (e) {
//   console.error(e);
// }
// }
// if (tradeData && quote) {
// console.log('tradeData', tradeData.data)
// console.log(/)
// }






//   useEffect(() => {
//     console.log('Selected dropdown value:', selectedDropDownValue);
//     console.log('Order type:', orderType);

//     if (selectedDropDownValue === "Margin" || selectedDropDownValue === "Algo" || orderType === "limit" || orderType === "stop") {
//       console.log('Setting commingSoon to true');
//       setCommingSoon(true);
//     } else {
//       console.log('Setting commingSoon to false');
//       setCommingSoon(false);
//     }
//   }, [selectedDropDownValue, orderType]);

//   // Example of logging state changes
//   useEffect(() => {
//     console.log('Trade type:', tradeType);
//   }, [tradeType]);

//   // Log when component mounts
//   useEffect(() => {
//     console.log('TradePage component mounted');
//     return () => {
//       // Log when component unmounts
//       console.log('TradePage component will unmount');
//     };
//   }, []);
//   return (
//     <SafeAreaView
//       style={{
//         backgroundColor: '#000',
//         paddingBottom: 80,
//         flex: 1, 
//       }}>
//               {/* Top bar */}
//       <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: "3%", width: width, marginBottom: 24 }}>
//         <View
//           style={{
//             // position: 'absolute',
//             alignItems: 'center',
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             paddingLeft: '5%',
//             width: width * 0.9,
//           }} >
//           <View style={{ flexDirection: "row", alignItems: "center" }}>
//             <Icon
//               name={'keyboard-backspace'}
//               size={30}
//               color={'#f0f0f0'}
//               type="materialicons"
//               onPress={() => navigation.goBack()}
//             />

//             <Text
//               style={{
//                 fontSize: 20,
//                 color: '#ffffff',
//                 fontFamily: `Satoshi-Bold`,
//                 fontWeight: 500,
//                 marginLeft: 30
//               }}>
//               Trade
//             </Text>
//           </View>
//           <TouchableOpacity
//           // onPress={() => setIsDropDownOpen(!isDropDownOpen)}
//           >
//             <View>
//               <LinearGradient
//                 colors={['#5038e1', '#b961ff']}
//                 useAngle={true}
//                 angle={103.64}
//                 style={{
//                   paddingVertical: 8,
//                   paddingHorizontal: 22,
//                   borderRadius: 20,
//                   flexDirection: "row",
//                   alignItems: "center",
//                   justifyContent: "center"
//                 }}
//               >
//                 <Text style={{ fontSize: 16, fontWeight: "bold" }}>{selectedDropDownValue}</Text>
//               </LinearGradient>
//               {/* <Image source={require('./path-to-your-arrow-image.png')} style={{ width: 24, height: 24 }} /> */}
//             </View>
//             {/* Drop-down options go here */}
//           </TouchableOpacity>
//         </View>
//       </View>
//       {commingSoon ? (
//         <View style={{ alignItems: "center", justifyContent: "center" }}>
//                             {/* Market, Limit, Stop */}
//                             <View style={{ flexDirection: "row", borderRadius: 100, backgroundColor: "#151515", alignItems: "center", justifyContent: "space-between", margin: 8, marginTop: 12, padding: 6 }}>
//               <TouchableOpacity
//                 style={{ width: "30%" }}
//                 onPress={() => setOrderType("market")}
//               >
//                 {
//                   orderType === "market" ?
//                     <LinearGradient
//                       colors={['#5038e1', '#b961ff']}
//                       useAngle={true}
//                       angle={103.64}
//                       style={{
//                         paddingVertical: 10,
//                         paddingHorizontal: 22,
//                         borderRadius: 20,
//                         flexDirection: "row",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                     >
//                       <Text
//                         style={{ fontWeight: "bold", color: "#ffffff", fontSize: 16, fontFamily: "Benzin-Semibold", textAlign: "center" }}
//                       >
//                         Market
//                       </Text>
//                     </LinearGradient>
//                     :
//                     <Text
//                       style={{ color: "#848484", fontWeight: "bold", fontSize: 16, textAlign: "center" }}
//                     >
//                       Market
//                     </Text>
//                 }
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={{ width: "30%" }}
//                 onPress={() => setOrderType("limit")}
//               >
//                 {
//                   orderType === "limit" ?
//                     <LinearGradient
//                       colors={['#5038e1', '#b961ff']}
//                       useAngle={true}
//                       angle={103.64}
//                       style={{
//                         paddingVertical: 10,
//                         paddingHorizontal: 22,
//                         borderRadius: 20,
//                         flexDirection: "row",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                     >
//                       <Text
//                         style={{ fontWeight: "bold", color: "#ffffff", fontSize: 16, fontFamily: "Benzin-Semibold", textAlign: "center" }}
//                       >
//                         Limit
//                       </Text>
//                     </LinearGradient>
//                     :
//                     <Text
//                       style={{ color: "#848484", fontWeight: "bold", fontSize: 16, textAlign: "center" }}
//                     >
//                       Limit
//                     </Text>
//                 }
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={{ width: "30%" }}
//                 onPress={() => setOrderType("stop")}
//               >
//                 {
//                   orderType === "stop" ?
//                     <LinearGradient
//                       colors={['#5038e1', '#b961ff']}
//                       useAngle={true}
//                       angle={103.64}
//                       style={{
//                         paddingVertical: 10,
//                         paddingHorizontal: 22,
//                         borderRadius: 20,
//                         flexDirection: "row",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                     >
//                       <Text
//                         style={{ fontWeight: "bold", color: "#ffffff", fontSize: 16, fontFamily: "Benzin-Semibold", textAlign: "center" }}
//                       >
//                         Stop
//                       </Text>
//                     </LinearGradient>
//                     :
//                     <Text
//                       style={{ color: "#848484", fontWeight: "bold", fontSize: 16, textAlign: "center" }}
//                     >
//                       Stop
//                     </Text>
//                 }
//               </TouchableOpacity>
//             </View>
//           <Image
//             source={
//               selectedDropDownValue === "Margin" ?
//                 ImageAssets.commingSoonImg :
//                 selectedDropDownValue === "Algo" ?
//                   ImageAssets.commingSoonImg :
//                   orderType === "limit" ?
//                     ImageAssets.commingSoonImg :
//                     ImageAssets.commingSoonImg
//             }
//             style={{ width: 300, height: 300 }}
//           />
//           <Text style={{ fontSize: 22, fontWeight: "bold", textAlign: "center", fontFamily: "Benzin-Semibold" }}>Coming Soon</Text>
//         </View>
//       ) : (        <>
//        <ScrollView
//             scrollEnabled
//             contentContainerStyle={{ flexGrow: 1 }} // Add this line to allow scrolling    
//     >
//                   {/* Market, Limit, Stop */}
//                   <View style={{ flexDirection: "row", borderRadius: 100, backgroundColor: "#151515", alignItems: "center", justifyContent: "space-between", margin: 8, marginTop: 12, padding: 6 }}>
//               <TouchableOpacity
//                 style={{ width: "30%" }}
//                 onPress={() => setOrderType("market")}
//               >
//                 {
//                   orderType === "market" ?
//                     <LinearGradient
//                       colors={['#5038e1', '#b961ff']}
//                       useAngle={true}
//                       angle={103.64}
//                       style={{
//                         paddingVertical: 10,
//                         paddingHorizontal: 22,
//                         borderRadius: 20,
//                         flexDirection: "row",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                     >
//                       <Text
//                         style={{ fontWeight: "bold", color: "#ffffff", fontSize: 16, fontFamily: "Benzin-Semibold", textAlign: "center" }}
//                       >
//                         Market
//                       </Text>
//                     </LinearGradient>
//                     :
//                     <Text
//                       style={{ color: "#848484", fontWeight: "bold", fontSize: 16, textAlign: "center" }}
//                     >
//                       Market
//                     </Text>
//                 }
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={{ width: "30%" }}
//                 onPress={() => setOrderType("limit")}
//               >
//                 {
//                   orderType === "limit" ?
//                     <LinearGradient
//                       colors={['#5038e1', '#b961ff']}
//                       useAngle={true}
//                       angle={103.64}
//                       style={{
//                         paddingVertical: 10,
//                         paddingHorizontal: 22,
//                         borderRadius: 20,
//                         flexDirection: "row",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                     >
//                       <Text
//                         style={{ fontWeight: "bold", color: "#ffffff", fontSize: 16, fontFamily: "Benzin-Semibold", textAlign: "center" }}
//                       >
//                         Limit
//                       </Text>
//                     </LinearGradient>
//                     :
//                     <Text
//                       style={{ color: "#848484", fontWeight: "bold", fontSize: 16, textAlign: "center" }}
//                     >
//                       Limit
//                     </Text>
//                 }
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={{ width: "30%" }}
//                 onPress={() => setOrderType("stop")}
//               >
//                 {
//                   orderType === "stop" ?
//                     <LinearGradient
//                       colors={['#5038e1', '#b961ff']}
//                       useAngle={true}
//                       angle={103.64}
//                       style={{
//                         paddingVertical: 10,
//                         paddingHorizontal: 22,
//                         borderRadius: 20,
//                         flexDirection: "row",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                     >
//                       <Text
//                         style={{ fontWeight: "bold", color: "#ffffff", fontSize: 16, fontFamily: "Benzin-Semibold", textAlign: "center" }}
//                       >
//                         Stop
//                       </Text>
//                     </LinearGradient>
//                     :
//                     <Text
//                       style={{ color: "#848484", fontWeight: "bold", fontSize: 16, textAlign: "center" }}
//                     >
//                       Stop
//                     </Text>
//                 }
//               </TouchableOpacity>
//             </View>




//              {/*Buy and Sell */}
//                   <View style={{ flexDirection: "row", borderRadius: 100, backgroundColor: "#151515", alignItems: "center", justifyContent: "space-between", margin: 8, padding: 6 }}>
//               <TouchableOpacity
//                 style={{ width: "50%" }}
//                 onPress={() => { setTradeType("buy"); setConvertedValue("token") }}
//               >
//                 {
//                   tradeType === "buy" ?
//                     <LinearGradient
//                       colors={['#183e27', '#1d5433']}
//                       useAngle={true}
//                       angle={93.68}
//                       style={{
//                         paddingVertical: 10,
//                         paddingHorizontal: 22,
//                         borderRadius: 20,
//                         flexDirection: "row",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                     >
//                       <Text
//                         style={{ fontWeight: "bold", color: "#ACFF8E", fontSize: 16, fontFamily: "Benzin-Semibold", width: "40%", textAlign: "center" }}
//                       >
//                         Buy
//                       </Text>
//                     </LinearGradient>
//                     :
//                     <Text
//                       style={{ color: "#848484", fontWeight: "bold", fontSize: 16, textAlign: "center" }}
//                     >
//                       Buy
//                     </Text>
//                 }
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={{ width: "50%" }}
//                 onPress={() => setTradeType("sell")}
//               >
//                 {
//                   tradeType === "sell" ?
//                     <LinearGradient
//                       colors={['#3E1818', '#541D1D']}
//                       useAngle={true}
//                       angle={93.68}
//                       style={{
//                         paddingVertical: 10,
//                         paddingHorizontal: 22,
//                         borderRadius: 20,
//                         flexDirection: "row",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                     >
//                       <Text
//                         style={{ fontWeight: "bold", color: "#FF4444", fontSize: 16, fontFamily: "Benzin-Semibold", width: "40%", textAlign: "center" }}
//                       >
//                         Sell
//                       </Text>
//                     </LinearGradient>
//                     :
//                     <Text
//                       style={{ color: "#848484", fontWeight: "bold", fontSize: 16, textAlign: "center" }}
//                     >
//                       Sell
//                     </Text>
//                 }
//               </TouchableOpacity>
//             </View>
//             {
//               tradeType === "buy" ?
//             <View style={{ marginTop: 40 }}>
//               {/*Investment Section */}
//               <Text style={{ fontSize: 16, color: "#7e7e7e", textAlign: "center" }}>How much would you like to invest?</Text>
//             </View>
//             :
//             <View style={{ marginTop: 40 }}>
//             {/*Investment Section */}
//             <Text style={{ fontSize: 16, color: "#7e7e7e", textAlign: "center" }}>How much would you like to sell?</Text>
//           </View>
// }
// {/*Input Number */}
// { tradeType === "sell" ?
//             <View style={{ marginTop: 25, flexDirection: "row", justifyContent: "center", gap: 8 }}>
//               <TextInput
//                 style={{ fontSize: 56, fontWeight: "900", color: "#ffffff", textAlign: "center"}}
//                 value={value}
//                 onChangeText={(text) => {
//                   setValue(text)
//               }}
//                 keyboardType='numeric'
//               />
              
//               <Text style={{ fontSize: 56, fontWeight: "900", color: "#252525", textAlign: "center",  textTransform: 'uppercase', marginTop: 10}}>{state.item.symbol}</Text>
//             </View>
//             :
//             <View style={{ marginTop: 30, flexDirection: "row", justifyContent: "center", gap: 8 }}>
//             <TextInput
//               style={{ fontSize: 56, fontWeight: "900", color: "#ffffff", textAlign: "center" }}
//               value={value}
//               onChangeText={(text) => {
//                 setValue(text)
//              }}
//               keyboardType='numeric'
//             />
      
            
//             <Text style={{ fontSize: 56, fontWeight: 900, color: "#252525", textAlign: "center", marginTop: 10 }}>$</Text>
//           </View>
// }
// { tradeType === "buy" ?
// <View style={{ marginTop: 40, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
//               <Text style={{ fontSize: 16, color: "#7e7e7e", textAlign: "center" }}>You'll get </Text>
//               {quote && (
//   <Text style={{ fontSize: 16, fontWeight: "900", color: "#7e7e7e", textAlign: "center" }}>{resultPrice} {state.item.symbol.toUpperCase()}</Text>
// )
// }

               
//                     {/* image to allow btc input */}
//               {/* <Image source={ImageAssets.arrowImg} /> */}
//             </View>
//             :
//             <View style={{ marginTop: 40, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
//               <Text style={{ fontSize: 16, color: "#7e7e7e", textAlign: "center" }}>You'll get </Text>
//               {quote && (
//   <Text style={{ fontSize: 16, fontWeight: "900", color: "#7e7e7e", textAlign: "center" }}>$ {resultPrice} </Text>
// )}
//                     {/* image to allow btc input */}
//               {/* <Image source={ImageAssets.arrowImg} /> */}
//             </View> }



// {/*order summary */}
// <View
//               style={{
//                 marginTop: 40,
//                 margin: 8,
//               }}
//             >
//               <TouchableOpacity
//                 onPress={() => setIsModalOpen(!isModalOpen)}
//                 style={{
//                   flexDirection: "row",
//                   justifyContent: "space-between",
//                 }}
//               >
//                 <Text
//                   style={{
//                     fontSize: 16,
//                     fontWeight: "700",
//                     fontFamily: "Satoshi-Bold",
//                     color: "#ffffff",
//                   }}
//                 >
//                   Order summary
//                 </Text>
//                 <Icon
//                   name={'keyboard-arrow-down'}
//                   size={30}
//                   color={'#ffffff'}
//                   type="materialicons"
//                   style={{
//                     transform: [{ rotate: isModalOpen ? "180deg" : "0deg" }],
//                   }}
//                 />
//               </TouchableOpacity>
//             </View>



//             {
//               isModalOpen && (
//                 <View
//                   style={{
//                     margin: 8,
//                     marginTop: 10
//                   }}
//                 >
//                   <View
//                     style={{
//                       flexDirection: "row",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       marginBottom: 34
//                     }}
//                   >
                    
//                     <View
//                       style={{
//                         flexDirection: "row",
//                         alignItems: "center",
//                         gap: 24
//                       }}
//                     >
//                       <Image
//                         source={ImageAssets.dollarImg}
//                         style={{
//                           width: 40,
//                           height: 40,
//                         }}
//                       />
//                       <View>
//                         <Text
//                           style={{
//                             fontSize: 14,
//                             fontFamily: "Satoshi-Bold",
//                             color: "#7e7e7e",
//                           }}
//                         >
//                           Entry price
//                         </Text>                       
//                         <Text
//                           style={{
//                             fontSize: 16,
//                             fontWeight: "700",
//                             fontFamily: "Satoshi-Bold",
//                             color: "#fff",
//                           }}
//                         >
//                           ${entryPrice}
//                         </Text>
//                       </View>
//                     </View>
//                     <Image
//                       source={ImageAssets.infoImg}
//                       style={{
//                         width: 24,
//                         height: 24,
//                       }}
//                     />
//                   </View>
//                   <View
//                     style={{
//                       flexDirection: "row",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       marginBottom: 34
//                     }}
//                   >
//                     <View
//                       style={{
//                         flexDirection: "row",
//                         alignItems: "center",
//                         gap: 24
//                       }}
//                     >
//                       <Image
//                         source={ImageAssets.slippageImg}
//                         style={{
//                           width: 40,
//                           height: 40,
//                         }}
//                       />
//                       <View>
//                         <Text
//                           style={{
//                             fontSize: 14,
//                             fontFamily: "Satoshi-Bold",
//                             color: "#7e7e7e",
//                           }}
//                         >
//                           Slippage
//                         </Text>
//                         {
//                           changeSlipage ?
//                             (
//                               <TextInput
//                                 style={{
//                                   fontSize: 16,
//                                   fontWeight: "700",
//                                   fontFamily: "Satoshi-Bold",
//                                   color: "#fff",
//                                 }}
//                                 value={`${slipageValue} %`}
//                                 onChangeText={(text) => setSlipageValue(text)}
//                                 keyboardType='numeric'
//                               />
//                             )
//                             :
//                             (
//                               <Text
//                                 style={{
//                                   fontSize: 16,
//                                   fontWeight: "700",
//                                   fontFamily: "Satoshi-Bold",
//                                   color: "#fff",
//                                 }}
                                
//                               >
//                                 {slipageValue}%
//                               </Text>
//                             )
//                         }
//                       </View>
//                     </View>
//                     <Text
//                       style={{
//                         fontSize: 14,
//                         fontWeight: "700",
//                         fontFamily: "Satoshi",
//                         color: "#c397ff",
//                       }}
//                       onPress={() => setChangeSlipage(!changeSlipage)}
//                     >
//                       Change
//                     </Text>
//                   </View>
//                   <View
//                     style={{
//                       flexDirection: "row",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       marginBottom: 34
//                     }}
//                   >
//                     <View
//                       style={{
//                         flexDirection: "row",
//                         alignItems: "center",
//                         gap: 24
//                       }}
//                     >
//                       <Image
//                         source={ImageAssets.feeImg}
//                         style={{
//                           width: 40,
//                           height: 40,
//                         }}
//                       />
//                       <View>
//                         <Text
//                           style={{
//                             fontSize: 14,
//                             fontFamily: "Satoshi",
//                             color: "#7e7e7e",
//                           }}
//                         >
//                           Estimated fee
//                         </Text>
//                         {quote &&  (
//                         <Text
//                           style={{
//                             fontSize: 16,
//                             fontWeight: "700",
//                             fontFamily: "Satoshi",
//                             color: "#fff",
//                           }}
//                         >
//                           ${(quote.fees.map(fee => fee.amountUSD))}
//                         </Text>
                       
//                         )
//                         }
                        
//                       </View>
//                     </View>
//                     <Image
//                       source={ImageAssets.infoImg}
//                       style={{
//                         width: 24,
//                         height: 24,
//                       }}
//                     />
//                   </View>
//                 </View>
//               )
//             }
//                 </ScrollView>
//                 {tradeType === "sell" ?
//               <LinearGradient
//                 style={{
//                   borderRadius: 100,
//                   backgroundColor: "transparent",
//                   paddingVertical: 22,
//                   paddingHorizontal: 100
//                 }}
//                 locations={[0, 1]}
//                 colors={["#3E1818", "#541D1D"]}
//                 useAngle={true}
//                 angle={95.96}
//               >
//                 <Text
//                   style={{
                    
//                     fontSize: 16,
//                     letterSpacing: 0.2,
//                     fontWeight: "700",
//                     fontFamily: "Satoshi-Bold",
//                     color: "#FF4444",
//                     textAlign: "center",
//                   }}
//                 >
//                   Confirm order
//                 </Text>
//               </LinearGradient>
//               :
//               <LinearGradient
//               style={{
//                 borderRadius: 100,
//                 backgroundColor: "transparent",
//                 paddingVertical: 22,
//                 paddingHorizontal: 100
//               }}
//               locations={[0, 1]}
//               colors={["#1b4d30", "#328454"]}
//               useAngle={true}
//               angle={95.96}
//             >
//               <Text
//                 style={{
//                   fontSize: 16,
//                   letterSpacing: 0.2,
//                   fontWeight: "700",
//                   fontFamily: "Satoshi-Bold",
//                   color: "#acff8e",
//                   textAlign: "center",
//                 }}
//               >
//                 Coming Soon
//               </Text>
//             </LinearGradient>
// }



      
      
      
      
      
      
//       </>)}
//       </SafeAreaView>

//   )
// };

// export default TradePage;