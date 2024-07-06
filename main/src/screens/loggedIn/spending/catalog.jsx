import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import WebView from 'react-native-webview';
import CouponModal, {SingleCouponItem} from '../../../component/CouponModal';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchOnboardedUser,
  getCountryBasedGiftCard,
} from '../../../store/actions/offRamp';
import {Icon} from 'react-native-elements';
import {ScrollView} from 'react-native';
import SingleCouponModal from './Offramp/SingleCouponModal';

const Catelog = () => {
  const [loading, setLoading] = useState(false);
  const [showWebView, setShowWebView] = useState(false);

  const url = 'https://sandbox.encryptus.co/v1/partners/create/user';
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const email = useSelector(x => x.auth.email);
  const [selected, setSelected] = useState();

  const [couponModal, setCouponModal] = useState(false);

  const giftCards = useSelector(x => x.offRamp.giftCards);

  const onSelect = x => {
    setSelected(x);
    console.log('selecteeeeed', x);
    setCouponModal(true);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
      <View
        style={{
          backgroundColor: '#333333',
          borderRadius: 100,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          left: '5%',
          top: '5%',
        }}>
        <Icon
          name={'navigate-before'}
          size={30}
          style={{backgroundColor: 'red'}}
          color={'#f0f0f0'}
          type="materialicons"
          onPress={() => navigation.goBack()}
        />
      </View>

      <Text
        style={{
          alignSelf: 'center',
          color: '#fff',
          fontSize: 16,
          marginTop: '10%',
        }}>
        Gift Cards
      </Text>

      <View style={{marginTop: '10%', marginLeft: '5%'}}>
        <Text
          style={{
            color: '#fff',
            fontSize: 22,
            marginTop: '5%',
            paddingBottom: '5%',
          }}>
          Select the Gift card
        </Text>

        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-around',
            }}>
            {giftCards?.length > 0 &&
              giftCards.map((x, index) => (
                <SingleCouponItem
                  key={x?.productId}
                  info={x}
                  onSelect={() => onSelect(x)}
                  style={{width: '30%', margin: 5}} // Adjust width and margin as needed
                />
              ))}
          </View>
        </ScrollView>
      </View>

      <SingleCouponModal
        data={selected}
        modalVisible={couponModal}
        setModalVisible={setCouponModal}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: '2%',
    paddingHorizontal: 20,
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
    alignSelf: 'stretch',
  },
  buttonText: {
    fontSize: 14,
    color: 'black',
    fontFamily: 'Unbounded-Bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15, // Add spacing between rows
  },
  imageStyle: {
    width: 50, // Adjust the size as needed
    height: 50, // Adjust the size as needed
    marginRight: 10,
  },
  textContainer: {
    flexDirection: 'column',
  },
  firstLine: {
    fontSize: 16,
    color: 'white',
    marginBottom: 4, // Spacing between the two lines of text
  },
  secondLine: {
    fontSize: 12,
    color: '#969696',
    width: '80%',
  },
  // ... rest of your styles ...
});
export default Catelog;
