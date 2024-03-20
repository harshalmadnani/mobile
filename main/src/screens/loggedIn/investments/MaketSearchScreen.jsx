import React, {useState, useEffect, useCallback} from 'react';
import {FlatList, KeyboardAvoidingView, Text} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import TradeItemCard from './TradeItemCard';
import {Icon} from '@rneui/themed';
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

const MarketSearchScreen = ({route, navigation}) => {
  const dispatch = useDispatch();
  const {width, height} = Dimensions.get('window');
  const [searchTerm, setSearchTerm] = useState('');
  const {cryptoData} = route.params;
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
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
          }}>
          <View style={styles.headerContainer}>
            <Icon
              name="close"
              size={30}
              color="#fff"
              onPress={() => navigation.goBack()}
            />
            <Text style={styles.headerTitle}>Search</Text>
          </View>
          <Text style={styles.secondaryHeaderTitle}>
            {searchTerm?.length === 0 && searchResult?.length === 0
              ? 'Trending'
              : 'Top Results'}
          </Text>
          {searchResult?.length > 0 && (
            <FlatList
              data={searchResult}
              style={{
                marginBottom: 64,
                width: '100%',
              }}
              renderItem={({item}) => (
                <TradeItemCard navigation={navigation} item={item} />
              )}
              keyExtractor={(item, i) => i.toString()}
            />
          )}
          {searchTerm?.length === 0 &&
            searchResult?.length === 0 &&
            cryptoData?.length > 0 && (
              <FlatList
                data={cryptoData}
                style={{
                  marginBottom: 64,
                  width: '100%',
                }}
                renderItem={({item}) => (
                  <TradeItemCard
                    onlyMeta={true}
                    navigation={navigation}
                    item={item}
                  />
                )}
                keyExtractor={(item, i) => i.toString()}
              />
            )}
        </View>
        <View />
        <View
          style={{
            height: 54,
            width: '95%',
            backgroundColor: textInputStyleObj.backgroundColor,
            alignSelf: 'center',
            alignItems: 'center',
            borderRadius: 32,
            flexDirection: 'row',
            paddingHorizontal: 16,
            marginBottom: 55,
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
            value={searchTerm}
            onChangeText={async text => {
              setSearchTerm(text);
              const result = await searchCryptoByName(text);
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
            placeholder="Search crypto, stocks, forex & more"
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
    marginTop: '2%',
    marginLeft: '5%',
    marginRight: '10%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  headerTitle: {
    fontFamily: 'Montreal-Medium',
    color: '#fff',
    fontSize: 16,
    alignSelf: 'center',
    marginLeft: '33%',
  },
  secondaryHeaderTitle: {
    fontFamily: 'Unbounded-Medium',
    color: '#fff',
    fontSize: 16,
    marginLeft: '5%',
    marginVertical: '8%',
  },
});

export default MarketSearchScreen;
