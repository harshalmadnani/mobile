import React, {useRef} from 'react';
import {Platform, SafeAreaView, View} from 'react-native';
import {WebView} from 'react-native-webview';

export const TradingViewChart = ({height, width}) => {
  //   const setChartType = () => {
  //     this.webref.injectJavaScript(
  //       `tvWidget.applyOverrides({ "mainSeriesProperties.style": 1 });`,
  //     );
  //     this.webref.injectJavaScript(run);
  //   };
  //   setTimeout(() => {
  //     console.log('fireeddd');
  //     this.webref.injectJavaScript(
  //       `tvWidget.applyOverrides({ "mainSeriesProperties.style": 1 });`,
  //     );
  //   }, 13000);
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
          }?height=${height}&&width=${width}`,
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
