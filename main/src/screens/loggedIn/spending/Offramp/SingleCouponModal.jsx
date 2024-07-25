import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Dimensions,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native';
import {TextInput} from 'react-native';
import {
  acceptGiftCardOrder,
  CouponCurrencyToCurrentCurrency,
  submitDetailsForQuote,
} from '../../../../store/actions/offRamp';
import {transferTokenGassless} from '../../../../utils/DFNS/walletFLow';
import {getNameChainId} from '../../../../store/actions/market';
import {getCurrencyIcon} from '../../../../utils/currencyicon';
import Modal from 'react-native-modal';
import Toast from 'react-native-root-toast';
import {Icon} from 'react-native-elements';

const Chip = ({label, isSelected, onPress, currencyIcon}) => {
  return (
    <TouchableOpacity
      style={[styles.chip, isSelected ? styles.selectedChip : null]}
      onPress={onPress}>
      <Text
        style={[styles.chipText, isSelected ? styles.selectedChipText : null]}>
        {currencyIcon}
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const SingleCouponModal = ({
  modalVisible,
  setModalVisible,
  data,
  country,
  email,
  isUsd,
  couponCurrencyExchangeRate,
}) => {
  const [selectedChip, setSelectedChip] = useState(null);
  const [quantity, setQuantity] = useState();
  const [isFocused, setIsFocused] = useState(false);
  const [loader, setLoader] = useState(false);

  const [gotQuote, setGotQuote] = useState(false);
  const [isAccepted, setisAccepted] = useState(false);
  const dfnsToken = useSelector(x => x.auth.DFNSToken);
  const wallets = useSelector(x => x.auth.wallets);
  const allScw = useSelector(x => x.auth.scw);
  const quoteDetail = useSelector(x => x.offRamp.quoteDetail);
  const dispatch = useDispatch();

  const getQuote = async faitCurrency => {
    if (quantity > 0 && selectedChip !== null) {
      let newChip = selectedChip;
      if (isUsd) {
        newChip = selectedChip * couponCurrencyExchangeRate; // To convert it into the original currency, to get the quote
      }

      await dispatch(
        submitDetailsForQuote(
          country,
          data?.productId,
          data?.brand,
          Math.floor(newChip),
          quantity,
          faitCurrency,
        ),
      );

      setGotQuote(true);
    }
  };

  const onAccept = async currencyCode => {
    try {
      setLoader(true);
      // let amountInDollars = selectedChip;

      //FOR LOCAL CURRENCY
      // amountInDollars =
      //   selectedChip / (await CouponCurrencyToCurrentCurrency(currencyCode)); // To convert back to USD.
      // console.log('Selected coupon in dollars:', amountInDollars);

      let cryptoAmount = quoteDetail.crypto_amount;
      console.log(
        'Amount to be transfered........',
        parseInt(cryptoAmount * 1000000),
      );
      const txnHash = await transferTokenGassless(
        dfnsToken,
        wallets?.filter(x => x.network === 'Polygon')[0]?.id,
        '137',
        false,
        '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
        '0xd1E090E590FB0c5e8F2C0B7c39053c387c65d919',
        parseInt(cryptoAmount * 1000000), //USD Amount*1000000*Qty
        allScw?.filter(x => x.chainId === '137')?.[0]?.address,
      );
      if (txnHash) {
        const status = await dispatch(acceptGiftCardOrder());
        if (status) {
          setLoader(false);
          setisAccepted(true);
          setGotQuote(false);
          setQuantity('');
          setModalVisible(false);
          navigation.navigate('Success');
        } else {
          Toast.show('Insufficient Encryptus balance', {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 1,
          });
          navigation.navigate('Portfolio');
        }
      } else {
        setLoader(false);
        setGotQuote(false);
        setQuantity('');
        setModalVisible(false);
        setLoader(false);
        Toast.show('Insufficient wallet balance', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 1,
        });
        navigation.navigate('Portfolio');
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
      Toast.show('Insufficient wallet balance', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 1,
      });
      navigation.navigate('Portfolio');
    }
  };

  const toggleChipSelection = chip => {
    setSelectedChip(chip === selectedChip ? null : chip);
  };

  const navigation = useNavigation();

  return (
    <Modal
      hideModalContentWhileAnimating={true}
      backdropColor="black"
      useNativeDriverForBackdrop={true}
      style={styles.modal}
      isVisible={modalVisible}
      onBackButtonPress={() => {
        setModalVisible(false);
        setGotQuote(false);
        setQuantity('');
        setLoader(false);
      }}
      onBackdropPress={() => {
        setModalVisible(false);
        setGotQuote(false);
        setQuantity('');
        setLoader(false);
      }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Close Icon */}
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => {
                setModalVisible(false);
                setGotQuote(false);
                setQuantity('');
                setLoader(false);
              }}>
              <Icon name="close" size={32} color="#fff" />
            </TouchableOpacity>

            <Image
              source={{
                uri: data?.vouchersImg,
              }}
              style={styles.modalImg}
              resizeMode="cover"
            />
            <Text style={[styles.modalText, {marginTop: 10}]}>
              {data?.brand}
            </Text>

            {gotQuote ? (
              <Text style={[styles.confirmationText, {marginTop: 10}]}>
                You are paying{' '}
                <Text style={styles.confirmationTextWhite}>
                  {/* {getCurrencyIcon(isUsd ? 'USD' : data?.currencyCode)}{' '}  FOR DYNAMIC CURRENCY*/}
                  {(quoteDetail?.crypto_amount).toFixed(2)} USDC
                </Text>{' '}
                for{' '}
                <Text style={styles.confirmationTextWhite}>
                  {quantity} {'x'} {selectedChip} {data?.brand}
                </Text>{' '}
                gift cards
              </Text>
            ) : data?.denominations.length > 10 ? (
              <ScrollView
                contentContainerStyle={{flexGrow: 1}}
                style={{maxHeight: 200}}>
                <View style={styles.container}>
                  {data?.denominations.map((chip, index) => {
                    const newChip = chip / couponCurrencyExchangeRate;

                    return (
                      <Chip
                        key={index}
                        label={Math.floor(newChip)}
                        currencyIcon={getCurrencyIcon(data?.currencyCode)}
                        isSelected={newChip === selectedChip}
                        onPress={() => toggleChipSelection(newChip)}
                      />
                    );
                  })}
                </View>
              </ScrollView>
            ) : (
              <View style={styles.container}>
                {data?.denominations.map((chip, index) => {
                  const newChip = chip / couponCurrencyExchangeRate;

                  return (
                    <Chip
                      key={index}
                      label={Math.floor(newChip)}
                      currencyIcon={getCurrencyIcon(data?.currencyCode)}
                      isSelected={newChip === selectedChip}
                      onPress={() => toggleChipSelection(newChip)}
                    />
                  );
                })}
              </View>
            )}
            <View style={{justifyContent: 'flex-end'}}>
              {!gotQuote && (
                <TextInput
                  value={quantity}
                  onChangeText={setQuantity}
                  placeholder="How many to purchase"
                  placeholderTextColor={'#cccccc'}
                  style={[
                    styles.input,
                    {
                      borderColor: isFocused ? '#fff' : '#000',
                    },
                  ]}
                  keyboardType="numeric"
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
              )}

              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={
                  gotQuote
                    ? () => {
                        onAccept(data?.currencyCode);
                      }
                    : () => {
                        getQuote(data?.currencyCode);
                      }
                }>
                <Text style={styles.textStyle}>
                  {gotQuote ? (
                    loader ? (
                      <ActivityIndicator
                        style={{
                          alignSelf: 'center',
                          justifyContent: 'center',
                          padding: 1,
                        }}
                        color="#000000"
                      />
                    ) : (
                      'Confirm'
                    )
                  ) : (
                    'GET QUOTES'
                  )}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#1d1d1d',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'center',
  },
  modalText: {
    fontSize: 20,

    marginBottom: 10,
    textAlign: 'center',

    color: '#fff',
  },
  button: {
    borderRadius: 10,
    padding: '5%',
    elevation: 2,
    marginBottom: 10,
  },
  buttonClose: {
    backgroundColor: '#fff',
  },
  textStyle: {
    color: '#000000',
    textAlign: 'center',
    fontFamily: 'Unbounded-Bold',
  },
  modalImg: {
    width: Dimensions.get('window').width * 0.9, // Full width
    height: '30%', // Set a fixed height or adjust dynamically based on your needs
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 10,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
    alignSelf: 'center',
    justifyContent: 'center', // Center items horizontally
  },
  chip: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    margin: 5,
    borderColor: '#303030',
    opacity: 0.8,
  },
  chipText: {
    color: '#ccc', // Text color
    fontSize: 14,
    fontFamily: 'Unbounded-Regular',
    opacity: 0.8,
  },
  selectedChip: {
    borderColor: '#fff',
  },
  selectedChipText: {
    color: '#fff', // Selected text color
  },
  input: {
    width: Dimensions.get('window').width * 0.9,
    fontSize: 14,
    lineHeight: 19.2,
    paddingHorizontal: 20,
    backgroundColor: '#000',
    color: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    alignSelf: 'center',
    opacity: 0.7,
    marginVertical: 20,
    height: 55,
  },
  confirmationText: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
    color: '#ccc',
    paddingVertical: 10,
  },
  confirmationTextWhite: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
    color: '#fff',
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
});

export default SingleCouponModal;
