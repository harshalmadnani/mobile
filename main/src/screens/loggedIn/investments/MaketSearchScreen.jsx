import React, {useState, useEffect, useCallback} from 'react';
import {FlatList, KeyboardAvoidingView, Text} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import TradeItemCard from './TradeItemCard';
import {
  Dimensions,
  SafeAreaView,
  Pressable,
  StyleSheet,
  View,
  Image,
  TextInput,
} from 'react-native';
import {searchCryptoByName} from '../../../utils/cryptoMarketsApi';
import {useDispatch, useSelector} from 'react-redux';

const MarketSearchScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {width, height} = Dimensions.get('window');
  const [textInputStyleObj, setTextInputStyleObj] = useState({
    placeholderTextColor: 'white',
    textColor: 'white',
    backgroundColor: '#272B30',
  });
  const [searchResult, setSearchResult] = useState([]);
  return (
    <SafeAreaView
      style={{
        width,
        height: height,
      }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <View style={{position: 'absolute'}}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Search</Text>
          </View>
          <Text style={styles.secondaryHeaderTitle}>Recent Searches</Text>
          {searchResult && (
            <FlatList
              data={searchResult}
              style={{marginBottom: 64}}
              renderItem={({item}) => (
                <TradeItemCard navigation={navigation} item={item} />
              )}
              keyExtractor={(item, i) => i.toString()}
            />
          )}
        </View>
        <View />
        <View
          style={{
            height: 54,
            width: '90%',
            backgroundColor: textInputStyleObj.backgroundColor,
            alignSelf: 'center',
            alignItems: 'center',
            borderRadius: 32,
            flexDirection: 'row',
            paddingHorizontal: 16,
            marginBottom: 64,
          }}>
          <AntDesign
            name="search1"
            size={16}
            color={textInputStyleObj.placeholderTextColor}
          />
          <TextInput
            style={{
              flex: 1,
              height: '100%',
              width: '100%',
              fontFamily: 'Unbounded-Thin',
              fontSize: 14,
              color: textInputStyleObj.textColor,
              marginLeft: 16,
            }}
            onChangeText={async text => {
              const result = await searchCryptoByName(text);
              console.log('text.......', result.length, text);
              setSearchResult(result);
            }}
            onFocus={() => {
              setTextInputStyleObj({
                placeholderTextColor: 'black',
                textColor: 'black',
                backgroundColor: 'white',
              });
            }}
            autoFocus
            placeholderTextColor={textInputStyleObj.placeholderTextColor}
            placeholder="Search crypto"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    marginTop: '8%',
    marginLeft: '5%',
    marginRight: '5%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerTitle: {fontFamily: 'Unbounded-Medium', color: '#fff', fontSize: 20},
  secondaryHeaderTitle: {
    fontFamily: 'Unbounded-Thin',
    color: '#fff',
    fontSize: 20,
    marginLeft: '5%',
    marginTop: '5%',
  },
});

export default MarketSearchScreen;
