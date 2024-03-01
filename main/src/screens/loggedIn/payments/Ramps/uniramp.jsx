import React, { useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import Icon component

const Uniramp = ({ route, navigation }) => {
  const webViewRef = useRef(null);



  const refresh = () => {
    if (webViewRef.current) webViewRef.current.reload();
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: 'https://widget.uniramp.com/' }}
        style={styles.webView}
      />
      {/* Adjusted Overlay View */}
      <View style={styles.overlay}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.overlayText}>Deposit Funds</Text>
        <TouchableOpacity onPress={refresh} style={styles.iconButton}>
          <Icon name="refresh" size={24} color="#000" />
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
    backgroundColor: '#fff',
    flexDirection: 'row', // Align children horizontally
    justifyContent: 'center', // Center children
    alignItems: 'center', // Align items vertically
    height: '8%',
    paddingHorizontal: 10, // Add some padding on the sides
  },
  overlayText: {
    color: '#000',
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

export default Uniramp;
