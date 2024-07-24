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
      let amountInDollars = selectedChip;

      //FOR DYNAMIC CURRENCY (if isUSD is true, chips are already converted to dollars)
      // if (!isUsd) {
      //   amountInDollars =
      //     selectedChip / (await CouponCurrencyToCurrentCurrency(currencyCode)); // To convert back to USD.
      // }

      //FOR LOCAL CURRENCY
      amountInDollars =
        selectedChip / (await CouponCurrencyToCurrentCurrency(currencyCode)); // To convert back to USD.
      console.log('Selected coupon in dollars:', amountInDollars);

      // console.log(
      //   'Amount to be transfered........',
      //   amountInDollars * 1000000 * parseInt(quantity),
      // );
      console.log(
        'amount in dollar',
        parseInt(Math.round(amountInDollars)) * 1000000 * parseInt(quantity),
      );
      const txnHash = await transferTokenGassless(
        dfnsToken,
        wallets?.filter(x => x.network === 'Polygon')[0]?.id,
        '137',
        false,
        '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
        '0xc919926ceb1da03087Cb02ae9b5AF93DdE1D2334',
        parseInt(Math.round(amountInDollars)) * 1000000 * parseInt(quantity), //USD Amount*1000000*Qty
        allScw?.filter(x => x.chainId === '137')?.[0]?.address,
      );
      if (txnHash) {
        await dispatch(acceptGiftCardOrder());
        setLoader(false);
        setisAccepted(true);
        setGotQuote(false);
        setQuantity('');
        setModalVisible(false);
        navigation.navigate('Success');
      } else {
        console.log('Failed buy');
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
      navigation.navigate('Portfolio');
    }
  };

  //const [selectedChips, setSelectedChips] = useState(new Set());

  const toggleChipSelection = chip => {
    setSelectedChip(chip === selectedChip ? null : chip);
    //----for multiple chips--
    // const updatedSelection = new Set(selectedChips);
    // if (updatedSelection.has(chip)) {
    //   updatedSelection.delete(chip);
    // } else {
    //   updatedSelection.add(chip);
    // }
    // setSelectedChips(updatedSelection);
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
        setModalVisible(!modalVisible);
        setGotQuote(false);
        setQuantity('');
        setModalVisible(false);
        setLoader(false);
      }}
      onBackdropPress={() => {
        setModalVisible(!modalVisible);
        setGotQuote(false);
        setQuantity('');
        setModalVisible(false);
        setLoader(false);
      }}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Image
            source={{
              uri: data?.vouchersImg,
            }}
            style={styles.modalImg}
            resizeMode="cover"
          />
          <Text style={[styles.modalText, {marginTop: 10}]}>{data?.brand}</Text>

          {gotQuote ? (
            <Text style={[styles.confirmationText, {marginTop: 10}]}>
              You are paying{' '}
              <Text style={styles.confirmationTextWhite}>
                {/* {getCurrencyIcon(isUsd ? 'USD' : data?.currencyCode)}{' '}  FOR DYNAMIC CURRENCY*/}
                {getCurrencyIcon(data?.currencyCode)}
                {selectedChip?.toFixed(2) * quantity}
              </Text>{' '}
              for{' '}
              <Text style={styles.confirmationTextWhite}>
                {quantity} {data?.brand}
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
                      //FOR DYNAMIC CURRENCY
                      // currencyIcon={getCurrencyIcon(
                      //   isUsd ? 'USD' : data?.currencyCode,
                      // )}
                      currencyIcon={getCurrencyIcon(data?.currencyCode)}
                      // isSelected={selectedChips.has(chip)}
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
                    //FOR DYNAMIC CURRENCY
                    // currencyIcon={getCurrencyIcon(
                    //   isUsd ? 'USD' : data?.currencyCode,
                    // )}
                    currencyIcon={getCurrencyIcon(data?.currencyCode)}
                    // isSelected={selectedChips.has(chip)}
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
    //fontFamily: 'Unbounded-Bold',
  },
  button: {
    borderRadius: 10,
    padding: 10,
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
});

export default SingleCouponModal;
