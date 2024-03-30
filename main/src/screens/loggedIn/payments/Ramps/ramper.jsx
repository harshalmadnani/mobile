import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, StyleSheet, Image, FlatList, Modal } from 'react-native';
import { Icon } from 'react-native-elements';
import { color } from 'react-native-elements/dist/helpers';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-root-toast';
import {
  createTransactionOnRamp,
  fetchOnRampPaymentMethodsBasedOnIP,
  getQuoteForCefiOnRamps,
} from '../../../../utils/OnrampApis';

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

  const [value, setValue] = useState('1');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [fiat, setFiat] = useState([]);
  const [selectedId, setSelectedId] = useState('wallet');
  const [modalVisible, setModalVisible] = useState(false);
  const [buttonTitle, setButtonTitle] = useState('Continue');
  const handleTextChange = text => {
    // Optional: Add validation or formatting for numeric input if needed
    const numericText = text.replace(/[^0-9]/g, ''); // This will strip non-numeric characters
    setValue(numericText);
  };
  const handlePress = () => {
    if (selectedId === 'wallet') {
      setModalVisible(true);
    }
    // Additional actions based on other selectedId values or conditions
  };
  const evmInfo = useSelector(x => x.portfolio.evmInfo);

  useEffect(() => {
    fetchPaymentMethodsBasedOnIP();
  }, []);

  const onWalletConnectOpen = async () => {
    navigation.push('QRScreen');
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
        console.log('error....', txInfo);
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

    return (
        <LinearGradient  start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={['#000', '#000', '#000']}
        locations={[0.17, 0.99, 1.0]} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                {/* Use a wrapper View with flex: 1 to fill available space and push the footer to the bottom */}
                <View style={{ flex: 1 }}>
                    {/* Header and content here */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', width: '100%', marginBottom: '10%', marginTop: '5%' }}>
                        <Icon
                            name={'navigate-before'}
                            size={30}
                            color={'#f0f0f0'}
                            type="materialicons"
                            onPress={() => navigation.push('Portfolio')}
                            style={{ marginLeft: '10%' }}
                        />
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginRight: 30 }}>
                            <Text style={{
                                color: '#F0F0F0',
                                fontFamily: 'Unbounded-Medium',
                                fontSize: 16,
                            }}>Deposit Funds</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 80, flexDirection: "row", justifyContent: "center", gap: 8 }}>
                        {selectedId === 'wallet' ? (
                            <Text style={{ fontSize: 80, color: "#fff", textAlign: "center", marginTop: 10, fontFamily: 'Unbounded-Medium' }}>$</Text>)
                            :
                            (
                                <Text style={{ fontSize: 80,  color: "#fff", textAlign: "center", marginTop: 10, fontFamily: 'Unbounded-Medium' }}>{getCurrencySymbol(fiat.id)}</Text>
                            )}
                        <TextInput
                            style={{ fontSize: 80, color: "#fff", textAlign: "center", fontFamily: "Unbounded-Medium", }}
                            value={value}
                            onChangeText={(text) => {
                                setValue(text)
                            }}
                            keyboardType='numeric'

                        />
                    </View>
                    {selectedId === "wallet" ? (
                        <View style={{ marginTop: '2%', flexDirection: "row", justifyContent: "center", gap: 8 }}>
                            <TouchableOpacity style={styles.button}>
                                <View style={styles.imagePlaceholder}>
                                    <Image
                                        source={{ uri: 'https://static.debank.com/image/coin/logo_url/usdc/e87790bfe0b3f2ea855dc29069b38818.png' }}
                                        style={{ width: 24, height: 24, borderRadius: 12 }} // Make image rounded
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
                        <View style={{ marginTop: '2%', flexDirection: "row", justifyContent: "center", gap: 8 }}>
                            <TouchableOpacity style={styles.button}>
                                {/* <Image source={{ uri: fiat.image }} style={{
                                    width: 26,
                                    height: 26,
                                    borderRadius: 13, // Make the image round
                                    marginRight: 10,
                                }} /> */}

                                <Text style={styles.text1}>{getCurrencySymbol(fiat.id)} </Text>
                                <Text style={styles.text}>{fiat.id.toUpperCase()}</Text>
                            </TouchableOpacity>
                        </View>
                    )
                    }



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
        {/* <W3mNetworkButton /> */}
        {/* Modal Component */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View>
                <TouchableOpacity
                  style={{
                    alignSelf: 'flex-start',
                  }}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Icon name="expand-more" size={35} color="#999" />
                </TouchableOpacity>
              </View>
              {/* Button 1 */}
              <TouchableOpacity
                style={[styles.button1, styles.buttonClose]}
                onPress={() => {
                  navigation.push('LiFi', {value: value});
                }}>
                <Text
                  style={{color: '#000', fontFamily: 'NeueMontreal-Medium'}}>
                  Deposit from wallet
                </Text>
              </TouchableOpacity>
                        </View>
                            {/* Button 1 */}
                            <TouchableOpacity
                                style={[styles.button1, styles.buttonClose,]}
                                onPress={() => {
                                    navigation.push('LiFi', { value: value });
                                }}>
                                <Text style={{ color: '#000',fontFamily:'NeueMontreal-Medium' }}>Deposit from wallet</Text>
                            </TouchableOpacity>
                            {/* Button 2 */}
                            <TouchableOpacity
                                style={[styles.button, styles.buttonOpen, padding = '1%']}
                                onPress={() => navigation.push('QRScreen')}>
                                <Text style={{ fontFamily: 'NeueMontreal-Medium',color:'#fff' }}>Deposit via QR code</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </LinearGradient>
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
});

export default Ramper;
