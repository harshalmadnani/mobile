import React from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import WebView from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
const FullScreenWebView = () => {
  const navigation = useNavigation(); // Use the useNavigation hook to get access to navigation

  return (
    <SafeAreaView style={styles.flexContainer}>
      <WebView
        source={{ uri: 'https://tally.so/r/nr6455' }}
        style={styles.flexContainer}
      />
      
      <View style={styles.topOverlay}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-back" size={24} color="#FFF" />
      </TouchableOpacity>
      
      <Text style={styles.overlayTitle}>Xade Spend</Text>
    </View>

      {/* Bottom Overlay */}
      <View style={styles.bottomOverlay}>
        {/* You can place additional content here */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignSelf:'center',
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center', // Center items vertically in the container
    justifyContent: 'space-between', // Distribute space between and around content items
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent black
    padding: '3%',
  },
  backButton: {
  },
  overlayTitle: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'NeueMontreal-Medium', // Ensure the font is correctly linked
    textAlign: 'center', // Center the title text
    flex: 1, 
    marginRight:24,
    alignSelf:'center'
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000', 
    padding: '5%',
  },
  backButton: {
    // Style your back button
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 18,
  },
});

export default FullScreenWebView;
