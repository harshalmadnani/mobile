import React, {useRef} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {WebView} from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import Icon component
import {useSelector} from 'react-redux';
const Uniramp = ({route, navigation}) => {
  const webViewRef = useRef(null);

  const address = useSelector(x => x.auth.address);

  const refresh = () => {
    if (webViewRef.current) webViewRef.current.reload();
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{
          uri: `https://widget.uniramp.com/?theme_mode=dark&onramp_chain=poly&onramp_crypto=0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359&onramp_hybrid=true&onramp_wallet=${address}&api_key=pk_prod_eb0suFktOsnpthQYX5LXoMXIychV7Ofv`,
        }}
        style={styles.webView}
      />
      {/* Adjusted Overlay View */}
      <View style={styles.overlay}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
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
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000',
    flexDirection: 'row', // Align children horizontally
    alignItems: 'center', // Align items vertically
    height: '8%',
    paddingHorizontal: 10, // Add some padding on the sides
  },
  overlayText: {
    color: '#fff',
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
