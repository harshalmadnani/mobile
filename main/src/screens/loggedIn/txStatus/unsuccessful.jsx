import React from 'react';
import {
  TouchableOpacity,
  Dimensions,
  TextInput,
  FlatList,
  TouchableHighlight,
  SafeAreaView,
  StyleSheet,
  View,
  Linking,
  ScrollView,
  Platform,
} from 'react-native';
import {Text} from '@rneui/themed';
import Video from 'react-native-video';
const successVideo = require('./failed.mov');

export default function Component({navigation, route}) {
  error = route.params.error;
  console.log('Err:', error);
  return (
    <View style={{width: '100%', height: '100%', backgroundColor: '#000'}}>
      <View style={{ width: 400, height: 400, alignItems: 'center', justifyContent: 'center',marginTop:'30%' }}>
        <Video
          source={successVideo}
          style={{ width: 600, height: 600 }}
          resizeMode={'cover'}
          controls={false}
          repeat={true}
          muted={true}
          ref={ref => {
            this.player = ref;
          }}
        />
      </View>
      <TouchableOpacity onPress={() => navigation.push('Settings')}>
        <Text
          style={{
            color: '#fff',
            fontSize: 22,
            marginTop: '10%',
            textAlign: 'center',
            fontFamily: `Unbounded-Medium`,
          }}>
          GO BACK
        </Text>
      </TouchableOpacity>
    </View>
  );
}