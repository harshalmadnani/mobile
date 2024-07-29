import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, AppState} from 'react-native';
import {WebView} from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import Icon component
export const Kyc = ({route, navigation}) => {
  const webViewRef = useRef(null);
  const refresh = () => {
    if (webViewRef.current) webViewRef.current.reload();
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{
          uri: 'https://app.sandbox.saber.money/kyc',
        }}
        style={styles.webView}
      />
      <View style={styles.overlay}>
        <TouchableOpacity
          onPress={() => {
            console.log('Go back pressed');
            navigation.goBack();
          }}
          style={styles.iconButton}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
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

export default Kyc;
