import React, {useRef} from 'react';
import {Platform, SafeAreaView, View} from 'react-native';
import {WebView} from 'react-native-webview';

export const TradingViewChart = ({height, width}) => {
  return (
    <View style={{width, height}}>
      <WebView
        ref={r => (this.webref = r)}
        style={{flex: 1}}
        source={{
          uri: `${
            Platform.OS === 'ios'
              ? `index.html`
              : `file:///android_asset/index.html`
          }?height=${height}&width=${width}`,
        }}
        onMessage={event => {
          console.log(JSON.parse(event?.nativeEvent.data));
        }}
        allowFileAccessFromFileURLs={true}
        domStorageEnabled={true}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        originWhitelist={['*']}
        onShouldStartLoadWithRequest={() => true}
      />
    </View>
  );
};
