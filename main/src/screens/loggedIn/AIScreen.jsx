import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';

const AIScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <WebView 
        source={{ uri: 'https://ai.xade.finance' }}
        style={styles.webview}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  webview: {
    flex: 1,
  }
});

export default AIScreen; 