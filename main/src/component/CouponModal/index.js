import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useWeb3Modal} from '@web3modal/wagmi-react-native';
import AuthTextInput from '../../component/Input/AuthTextInputs';
import erc20 from '../../screens/loggedIn/payments/USDC.json';
import LinearGradient from 'react-native-linear-gradient';
import {
  useAccount,
  useSendTransaction,
  useWaitForTransaction,
  usePrepareSendTransaction,
} from 'wagmi';
import {ethers} from 'ethers';
import {getQuoteFromLifi} from '../../utils/DLNTradeApi';
import {
  getAllSupportedChainsFromSwing,
  getApprovalCallDataFromSwing,
  getQuoteFromSwing,
  getTxCallDataFromSwing,
} from '../../utils/SwingCrossDepositsApi';
import LottieView from 'lottie-react-native';
import {w3cwebsocket as W3CWebSocket} from 'websocket';
import {useDispatch, useSelector} from 'react-redux';
import {Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {depositAction} from '../../store/reducers/deposit';
import Toast from 'react-native-root-toast';
import {disconnect} from '@wagmi/core';

const SingleCouponItem = ({onSelect, name}) => {
  return (
    <Pressable onPress={async () => await onSelect()} style={{margin: 12}}>
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 100,
          backgroundColor: 'white',
        }}></View>
      <Text
        style={{
          fontSize: 14,
          color: '#fff',
          fontWeight: 500,
          textAlign: 'center',
          fontFamily: 'NeueMontreal-Medium',
          marginTop: 8,
        }}>
        {name}
      </Text>
    </Pressable>
  );
};
const CouponModal = ({modalVisible, setModalVisible, value}) => {
  // renders

  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState();
  const {height} = Dimensions.get('window');
  const [coupons, setCoupons] = useState([
    {name: 'Amazon'},
    {name: 'Flipkart'},
    {name: 'Myntra'},
    {name: 'Paypal'},
    {name: 'PS Store'},
  ]);
  const [qty, setQty] = useState(1);
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>
      <View style={styles.centeredView}>
        {selected ? (
          <View
            style={[
              styles.modalView,
              {height: height * 0.5, backgroundColor: '#1D1D1D'},
            ]}>
            <View
              style={{
                height: 6,
                width: '20%',
                backgroundColor: '#000',
                borderRadius: 12,
                alignSelf: 'center',
                opacity: 0.7,
              }}
            />
            <Pressable
              style={{
                alignItems: 'center',
                flex: 1,
                justifyContent: 'space-between',
                marginTop: '2%',
              }}>
              <View
                style={{
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 100,
                    backgroundColor: 'white',
                  }}></View>
                <Text
                  style={{
                    fontSize: 24,
                    color: '#fff',
                    fontWeight: 500,
                    textAlign: 'center',
                    fontFamily: 'NeueMontreal-Medium',
                    marginTop: 12,
                  }}>
                  {selected}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: '#fff',
                    fontWeight: 500,
                    textAlign: 'center',
                    fontFamily: 'NeueMontreal-Medium',
                    marginTop: 20,
                  }}>
                  {`Amazon Gift Cards are redeemable towards the purchase of millions of eligible goods and services provided by Amazon.com Services LLC and its affiliates on www.amazon.com`}
                </Text>
              </View>
            </Pressable>
            <View style={{marginBottom: 12}}>
              <AuthTextInput
                value={qty}
                onChange={x => setQty(x)}
                placeholder="How many to purchase..."
                width={'100%'}
                backgroundColor={'#000000'}
              />
            </View>
            <TouchableOpacity
              style={{
                height: 45,
                width: '100%',
                borderRadius: 30,
                marginBottom: 16,
              }}
              onPress={async () => {
                navigation.push('Portfolio');
                setModalVisible(false);
              }} // Open modal on press
            >
              <LinearGradient
                useAngle={true}
                angle={150}
                colors={['#fff', '#fff']}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 30,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: '#000',
                    fontSize: 14,
                    fontFamily: 'NeueMontreal-Medium',
                  }}>
                  PURCHASE NOW
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={[
              styles.modalView,
              {height: height * 0.45, backgroundColor: '#1D1D1D'},
            ]}>
            <View
              style={{
                height: 6,
                width: '20%',
                backgroundColor: '#000',
                borderRadius: 12,
                alignSelf: 'center',
                opacity: 0.7,
              }}
            />
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  marginTop: 12,
                  color: 'white',
                  fontFamily: `NeueMontreal-Bold`,
                  fontSize: 20,
                  lineHeight: 24,
                  padding: 8,
                }}>
                Select the gift card
              </Text>
            </View>
            <View style={styles.wrapContainer}>
              {coupons.map(x => (
                <SingleCouponItem
                  onSelect={() => setSelected(x?.name)}
                  key={x.name}
                  name={x.name}
                />
              ))}
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end', // Align modal at the bottom
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: '100%',
    backgroundColor: '#1D1D1D',
    borderTopRightRadius: 16, // Only round the top corners
    borderTopLeftRadius: 16,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  wrapContainer: {
    flexDirection: 'row', // Align items in a row
    flexWrap: 'wrap', // Allow items to wrap to the next line
    //justifyContent: 'center', // Align items to the start of the container
    padding: 8, // Add some padding around the container
    marginTop: '2%',
  },
});

export default CouponModal;
