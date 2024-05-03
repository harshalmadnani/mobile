import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Image,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Icon} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-root-toast';
import {useWeb3Modal} from '@web3modal/wagmi-react-native';
import {
  createTransactionOnRamp,
  fetchOnRampPaymentMethodsBasedOnIP,
  getQuoteForCefiOnRamps,
} from '../../../../utils/OnrampApis';
import CrossChainModal from '../../../../component/CrossChainModal/index';
import {
  useAccount,
  useSendTransaction,
  useWaitForTransaction,
  usePrepareSendTransaction,
} from 'wagmi';
import {useWeb3Modal} from '@web3modal/wagmi-react-native';
import {SvgUri} from 'react-native-svg';
import {Keyboard} from 'react-native';
import {depositAction} from '../../../../store/reducers/deposit';

const Ramper = ({navigation}) => {
  const getCurrencySymbol = currencyCode => {
    const format = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
    });
    const parts = format.formatToParts(0);
    const symbol = parts.find(part => part.type === 'currency').value;
    return symbol;
  };
  const {address} = useAccount();
  // const {open} = useWeb3Modal();
  const [value, setValue] = useState('1');
  const walletConnect = useSelector(x => x.deposit.walletConnectModal);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const {open, close} = useWeb3Modal();
  const [fiat, setFiat] = useState([]);
  const [selectedId, setSelectedId] = useState('wallet');
  const [modalVisible, setModalVisible] = useState(false);
  const [buttonTitle, setButtonTitle] = useState('Continue');
  const dispatch = useDispatch();
  const handleTextChange = text => {
    // Optional: Add validation or formatting for numeric input if needed
    const numericText = text.replace(/[^0-9]/g, ''); // This will strip non-numeric characters
    setValue(numericText);
  };
  const handlePress = () => {
    if (selectedId === 'wallet') {
      // setModalVisible(true);
      // navigation.push('QRScreen');
    }
    // Additional actions based on other selectedId values or conditions
  };
  const evmInfo = useSelector(x => x.portfolio.evmInfo);

  useEffect(() => {
    fetchPaymentMethodsBasedOnIP();
  }, []);
  // useEffect(() => {
  //   console.log('firedddddd wallet handler....', address, walletConnect);
  //   const depositModalOpener = async () => {
  //     if (walletConnect && address) {
  //       await close();
  //       setModalVisible(true);
  //       dispatch(depositAction.setWalletConnectModal(false));
  //     }
  //   };
  //   depositModalOpener();
  // }, [address]);
  const bottomSheetModalRef = useRef(null);
  const onWalletConnectOpen = async () => {
    navigation.push('QRScreen');
    // console.log('fired');
    // dispatch(depositAction.setTxLoading(false));
    // setModalVisible(true);
    // dispatch(depositAction.setWalletConnectModal(true));
  };
  const fetchPaymentMethodsBasedOnIP = async () => {
    try {
      const {fetchedPaymentMethods, fetchedfiat} =
        await fetchOnRampPaymentMethodsBasedOnIP();
      // Optionally, add a custom payment method
      fetchedPaymentMethods.push({
        id: 'wallet',
        name: 'Wallet',
        image:
          'https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://walletconnect.com&size=64', // Ensure you have permission to use this image
      });
      setFiat(fetchedfiat);
      setPaymentMethods(fetchedPaymentMethods);
    } catch (error) {
      setPaymentMethods([
        {
          id: 'wallet',
          name: 'Wallet',
          image:
            'https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://walletconnect.com&size=64', // Ensure you have permission to use this image
        },
      ]);
      console.error('There was an error fetching payment methods:', error);
    }
  };
  const onRampContinue = async () => {
    console.log(fiat, paymentMethods);
    setButtonTitle('Getting Quotes...');
    const quote = await getQuoteForCefiOnRamps(
      fiat,
      paymentMethods.filter(x => x.id === selectedId)?.[0],
      value,
      'poly',
      '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
    );
    if (quote?.gateways) {
      const listAllTransactionFee = quote?.gateways?.map(x =>
        parseInt(x?.transactionFee),
      );
      const minTransactionFee = Math.min(...listAllTransactionFee);
      setButtonTitle('Creating Tx...');
      const txInfo = await createTransactionOnRamp(
        quote?.gateways?.[0],
        quote?.fiat,
        quote?.fiatAmount,
        quote?.payment,
        '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
        evmInfo?.smartAccount,
      );
      console.log('ramp tx error', txInfo);
      if (!txInfo?.error) {
        setButtonTitle('Continue');
        navigation.push('Uniramp', {txInfo});
      } else {
        setButtonTitle('Error');
        Toast.show(txInfo?.message, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
        setButtonTitle('Continue');
      }
    } else {
      setButtonTitle('Error');
      Toast.show(
        quote?.data?.type === 'minimum_gateway_error'
          ? `This Payment Type Requires Minimum ${
              quote?.data?.amount / Math.pow(10, fiat?.decimal)
            }`
          : 'This is a message',
        {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        },
      );
      setButtonTitle('Continue');
    }
  };
  const getDynamicFontSize = inputLength => {
    const baseSize = 56; // Base font size
    if (inputLength < 3) return baseSize;
    return Math.max(baseSize - (inputLength - 5) * 5, 30); // Decrease font size as input length increases, with a minimum size
  };
  const handleValueChange = text => {
    // Regular expression to allow only numbers and up to 6 decimal places
    const regex = /^\d{0,6}$/;
    // Check if the new text matches the regular expression
    if (regex.test(text)) {
      setValue(text);
      console.log(text, regex.test(text));
    }
  };
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
      style={{padding: 8, flex: 1, backgroundColor: '#000'}}>
      <SafeAreaView style={{flex: 1, backgroundColor: '#000'}}>
        <View style={{flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              width: '100%',
              marginBottom: '10%',
              marginTop: '5%',
            }}>
            <Icon
              name={'navigate-before'}
              size={30}
              color={'#f0f0f0'}
              type="materialicons"
              onPress={() => navigation.push('Portfolio')}
              style={{marginLeft: '2%'}}
            />
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 30,
              }}>
              <Text
                style={{
                  color: '#F0F0F0',
                  fontFamily: 'NeueMontreal-Medium',
                  fontSize: 16,
                  alignItems: 'center',
                }}>
                Deposit Funds
              </Text>
            </View>
          </View>
          <View
            style={{
              marginTop: 80,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              // backgroundColor: 'blue',
            }}>
            {selectedId === 'wallet' ? (
              <Text
                style={{
                  fontSize: getDynamicFontSize(value?.length ?? 0),
                  color: '#fff',
                  textAlign: 'center',
                  fontFamily: 'Unbounded-Medium',
                }}>
                $
              </Text>
            ) : (
              <Text
                style={{
                  fontSize: getDynamicFontSize(value?.length ?? 0),
                  color: '#fff',
                  textAlign: 'center',

                  fontFamily: 'Unbounded-Medium',
                  maxWidth: '80%',
                  alignSelf: 'center',
                }}>
                {getCurrencySymbol(fiat.id)}
              </Text>
            )}
            <TextInput
              style={{
                fontSize: getDynamicFontSize(value?.length ?? 0),
                color: '#fff',
                textAlign: 'center',
                fontFamily: 'Unbounded-Medium',
                // backgroundColor: 'red',
                minWidth: value.length === 6 ? '80%' : 0,
              }}
              value={value}
              onChangeText={text => {
                handleValueChange(text);
              }}
              keyboardType="numeric"
            />
          </View>
          {selectedId === 'wallet' ? (
            <View
              style={{
                marginTop: '2%',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 8,
              }}>
              <TouchableOpacity style={styles.button}>
                <View style={styles.imagePlaceholder}>
                  <Image
                    source={{
                      uri: 'https://static.debank.com/image/coin/logo_url/usdc/e87790bfe0b3f2ea855dc29069b38818.png',
                    }}
                    style={{width: 24, height: 24, borderRadius: 12}} // Make image rounded
                  />
                </View>
                <Text style={styles.text}>USDC</Text>
                {/* <Icon
                                name={'expand-more'}
                                size={16}
                                color={'#f0f0f0'}
                                type="materialicons"
                                onPress={() => navigation.goBack()}
                                style={{ marginLeft: 120 }}
                            /> */}
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                marginTop: '2%',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 8,
              }}>
              <TouchableOpacity style={styles.button}>
                <SvgUri
                  width="26"
                  height="26"
                  uri={fiat.image}
                  style={{
                    marginRight: 10,
                  }}
                />
                <Text style={styles.text}>{fiat.id.toUpperCase()}</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={{marginTop: '9%'}}>
            <Text
              style={{
                fontSize: 16,
                color: '#7e7e7e',
                textAlign: 'center',
                fontFamily: 'NeueMontreal-Medium',
              }}>
              Choose your preferred deposit method
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: '#fff',
                textAlign: 'center',
                fontFamily: 'Satoshi-Bold',
              }}>
              to enter a new era of finance
            </Text>
          </View>
          <View style={styles.wrapContainer}>
            {paymentMethods.map(item => (
              <TouchableOpacity
                key={item.id}
                onPress={() => setSelectedId(item.id)}
                style={[
                  styles.button,
                  {
                    borderColor:
                      item.id === selectedId ? '#fff' : 'transparent',
                  },
                  {color: item.id === selectedId ? '#fff' : 'transparent'},
                ]}>
                <Image
                  source={{uri: item.image}}
                  style={{
                    backgroundColor: '#fff',
                    width: 26,
                    height: 26,
                    borderRadius: 13, // Make the image round
                    marginRight: 10,
                  }}
                />
                <Text
                  style={{
                    color: item.id === selectedId ? '#FFF' : '#8D8D8D',
                    fontFamily: 'Satoshi-Regular',
                  }}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {/* Footer: Trade button sticky at the bottom */}
        <View
          style={{
            height: 50,
            marginHorizontal: '5%',
            justifyContent: 'center',
            flexDirection: 'row',
            borderRadius: 6,
            marginBottom: '5%', // Adjust this for spacing from the bottom edge
          }}>
          <TouchableOpacity
            style={{
              height: '100%',
              width: '100%',
              borderRadius: 30,
            }}
            onPress={async () => {
              if (buttonTitle.toLocaleLowerCase() === 'continue') {
                selectedId === 'wallet'
                  ? onWalletConnectOpen()
                  : await onRampContinue();
              }
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
                  fontFamily: 'Unbounded-ExtraBold',
                }}>
                {buttonTitle}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <CrossChainModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          value={value}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  imagePlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 12, // Half of width/height to make it a circle
    backgroundColor: '#fff', // Placeholder color
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5, // Add some margin to the right of the circle
  },
  text: {
    color: '#fff', // Text color
    fontSize: 14,
    fontFamily: 'Satoshi-Black', // Make sure you have this font loaded
  },
  text1: {
    color: '#fff', // Text color
    fontSize: 16,
    fontFamily: 'Satoshi-Black', // Make sure you have this font loaded
  },
  wrapContainer: {
    flexDirection: 'row', // Align items in a row
    flexWrap: 'wrap', // Allow items to wrap to the next line
    justifyContent: 'center', // Align items to the start of the container
    padding: 8, // Add some padding around the container
    marginTop: '10%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1d1d1d',
    borderWidth: 2,
    borderRadius: 100,
    height: 36,
    paddingHorizontal: 10,
    justifyContent: 'center',
    margin: 1.5, // Space around each button
  },
  image: {
    backgroundColor: '#fff',
    width: 26,
    height: 26,
    borderRadius: 13, // Make the image round
    marginRight: 10,
  },
  buttonOpen: {
    backgroundColor: '#000',
  },
  buttonClose: {
    backgroundColor: '#FFF',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalTextStyle: {
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end', // Align modal at the bottom
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: '100%', // Make modal take full width at the bottom
    backgroundColor: '#000',
    borderTopRightRadius: 20, // Only round the top corners
    borderTopLeftRadius: 20,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button1: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderRadius: 100,
    padding: '5%',
    paddingHorizontal: 10,
    justifyContent: 'center',
    margin: 1.5, // Space around each button
    width: '95%',
  },
});

export default Ramper;
