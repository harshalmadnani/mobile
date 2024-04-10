import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {WebView} from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {checkKYCAvailableOrNotForDinari} from '../../../utils/Dinari/DinariApi';
// Import Icon component
const DinariKycWebview = ({route, navigation}) => {
  const webViewRef = useRef(null);
  const [timer, setTimer] = useState(false);
  const [count, setCount] = useState(0);
  const refresh = () => {
    if (webViewRef.current) webViewRef.current.reload();
  };
  const {url, address} = route?.params;
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await checkKYCAvailableOrNotForDinari(address);
        console.log(response);
        if (response === 'PASS') {
          clearInterval(interval);
          navigation.navigate('Portfolio');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{
          uri: url,
        }}
        style={styles.webView}
      />
      <View style={styles.overlay}>
        <TouchableOpacity
          onPress={() => navigation.push('Portfolio')}
          style={styles.iconButton}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.overlayText}>Dinari KYC</Text>
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
  },
  overlay: {
    position: 'absolute',
    top: 0,
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

export default DinariKycWebview;
