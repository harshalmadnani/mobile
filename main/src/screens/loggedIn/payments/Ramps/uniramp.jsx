import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, AppState} from 'react-native';
import {WebView} from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import Icon component
import {PollStatusFromUniRamps} from '../../../../utils/OnrampApis';
import Toast from 'react-native-root-toast';
import {useFocusEffect} from '@react-navigation/native';
const Uniramp = ({route, navigation}) => {
  const webViewRef = useRef(null);
  const [timer, setTimer] = useState(false);
  const [count, setCount] = useState(0);
  const refresh = () => {
    if (webViewRef.current) webViewRef.current.reload();
  };
  const {txInfo} = route?.params;
  // useFocusEffect(
  //   React.useCallback(() => {
  //     // This code runs when the screen gains focus
  //     const onBlurSubscription = AppState.addEventListener('blur', () =>
  //       console.log('blur'),
  //     );

  //     return () => {
  //       console.log('Loosing focus.', timer);
  //       setTimer(false);
  //       // This code runs when the screen loses focus
  //       onBlurSubscription.remove();
  //     };
  //   }, []),
  // );

  // useEffect(async () => {
  //   async function pollStatus() {
  //     try {
  //       const response = await PollStatusFromUniRamps(txInfo?.id);
  //       if (
  //         response === 'failed' ||
  //         response === 'success' ||
  //         response === 'invalid'
  //       ) {
  //         clearInterval(interval);
  //         setTimer(false);
  //         Toast.show(response, {
  //           duration: Toast.durations.SHORT,
  //           position: Toast.positions.BOTTOM,
  //           shadow: true,
  //           animation: true,
  //           hideOnPress: true,
  //           delay: 0,
  //         });
  //         navigation.push('Portfolio');
  //         // Do something when status is finished
  //       }
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //       // Handle error here
  //     }
  //   }

  //   // Fetch the status of the task
  //   // Poll every 1000 milliseconds
  //   if (timer) {
  //     pollStatus();
  //   } else {
  //     if (count === 0) {
  //       setTimer(true);
  //     }
  //   }
  // }, [count]);
  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{
          uri: txInfo?.cefiInitiate?.url,
        }}
        style={styles.webView}
      />
      <View style={styles.overlay}>
        <TouchableOpacity
          onPress={() => navigation.push('Ramper')}
          style={styles.iconButton}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.overlayText}>Deposit Funds</Text>
        {/* <TouchableOpacity onPress={refresh} style={styles.iconButton}>
          <Icon name="refresh" size={24} color="#000" />
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    flex: 1,
    marginTop:'5%'
  },
  overlay: {
    position: 'absolute',
    top: '2%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row', // Align children horizontally
    alignItems: 'center', // Align items vertically
    height: '7%',
    paddingHorizontal: 10, // Add some padding on the sides
  },
  overlayText: {
    color: '#000',
    fontSize: 18,
    justifyContent: 'center',
    fontFamily: 'Unbounded-Medium',
    marginLeft: '18%',
  },
  iconButton: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: '2%',
  },
});

export default Uniramp;
