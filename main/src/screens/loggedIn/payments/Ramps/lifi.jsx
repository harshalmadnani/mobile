import React, { useRef } from 'react';
import { View, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import Icon component
import { useSelector } from 'react-redux';
const LiFi = ({ route, navigation }) => {
  const webViewRef = useRef(null);
  const { value } = route.params;
  const address = useSelector(x => x.auth.address)

  const refresh = () => {
    if (webViewRef.current) webViewRef.current.reload();
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{
          uri: `https://jumper.exchange/?fromAmount=${value}&fromChain=42161&fromToken=0xaf88d065e77c8cC2239327C5EDb3A432268e5831&toAddress=${address}&toChain=137&toToken=0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359`
        }}
        style={styles.webView}
      />
      {/* Overlay View */}
      <View style={styles.overlay}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.overlayText}>Deposit Funds</Text>
        <TouchableOpacity onPress={refresh} style={styles.iconButton}>
          <Icon name="refresh" size={24} color="#fff" />
        </TouchableOpacity>
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
    backgroundColor: '#110F27',
    flexDirection: 'row', // Align children horizontally
    justifyContent: 'center', // Center children
    alignItems: 'center', // Align items vertically
    height: '18.5%',
    paddingHorizontal: 10, // Add some padding on the sides
  },
  overlayText: {
    color: '#fff',
    fontSize: 18,
    marginHorizontal: 20, // Space out the text from the icons
    justifyContent: 'center',
    fontFamily: 'Satoshi-Bold'
  },
  iconButton: {
    padding: 10, // Make it easier to tap the icons
    paddingLeft: 60,
    paddingRight: 60,
  },
});

export default LiFi;
