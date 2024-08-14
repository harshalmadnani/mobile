import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
const Sucess = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image
          source={{
            uri: 'https://res.cloudinary.com/xade-finance/image/upload/v1710094353/ucvuadhlnkmbfn44aroo.png',
          }}
          resizeMode="cover"
          style={styles.imageStyle}
        />
        <Text style={styles.headingText}>IT'S A SUCCESS!</Text>
        <Text style={styles.confirmationText}>
   
        </Text>
      </View>
      <Pressable
        style={[styles.button]}
        onPress={() => {
          navigation.navigate('Portfolio');
        }}>
        <Text style={styles.textStyle}>CLOSE</Text>
      </Pressable>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    marginHorizontal: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    position: 'absolute',
    bottom: '5%',
    alignSelf: 'center',
    width: '90%',
  },
  imageStyle: {
    width: 250, // Full width
    height: 250, // Set a fixed height or adjust dynamically based on your needs
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 10,
  },
  textStyle: {
    color: '#000000',
    textAlign: 'center',
    fontFamily: 'Unbounded-Bold',
  },
  confirmationText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#727272',
  },
  headingText: {
    fontSize: 22,
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Unbounded-Bold',
    marginBottom: '5%',
  },
});
export default Sucess;
