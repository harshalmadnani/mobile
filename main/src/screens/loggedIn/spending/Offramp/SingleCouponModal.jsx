import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Modal,
  Pressable,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native';
import {TextInput} from 'react-native';
import {
  acceptGiftCardOrder,
  fetchOnboardedUser,
  submitDetailsForQuote,
} from '../../../../store/actions/offRamp';
import {transferTokenGassless} from '../../../../utils/DFNS/walletFLow';
import {getNameChainId} from '../../../../store/actions/market';

const Chip = ({label, isSelected, onPress}) => {
  return (
    <TouchableOpacity
      style={[styles.chip, isSelected ? styles.selectedChip : null]}
      onPress={onPress}>
      <Text
        style={[styles.chipText, isSelected ? styles.selectedChipText : null]}>
        {label} USD
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
}) => {
  const [selectedChip, setSelectedChip] = useState(null);
  const [quantity, setQuantity] = useState();
  const [isFocused, setIsFocused] = useState(false);

  const [gotQuote, setGotQuote] = useState(false);
  const [isAccepted, setisAccepted] = useState(false);
  const dfnsToken = useSelector(x => x.auth.DFNSToken);
  const wallets = useSelector(x => x.auth.wallets);
  const allScw = useSelector(x => x.auth.scw);
  const dispatch = useDispatch();

  const getQuote = async () => {
    if (quantity > 0 && selectedChip !== null) {
      await dispatch(
        submitDetailsForQuote(
          country,
          data?.productId,
          data?.brand,
          selectedChip,
          quantity,
        ),
      );

      setGotQuote(true);
    }
  };

  const onAccept = async () => {
    const txnHash = await transferTokenGassless(
      dfnsToken,
      wallets?.filter(
        x =>
          x.network ===
          getNameChainId(assetInfo?.contracts_balances[0]?.chainId?.toString()),
      )[0]?.id,
      '137',
      false,
      '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
      '0xDE690120f059046c1f9b2d01c1CA18A6fe51070E',
      amount,
      allScw?.filter(
        x =>
          x.chainId === assetInfo?.contracts_balances[0]?.chainId?.toString(),
      )?.[0]?.address,
    );
    if (txnHash) {
      await dispatch(acceptGiftCardOrder());
      setisAccepted(true);
      setGotQuote(false);
      setQuantity('');
      setModalVisible(false);
      navigation.navigate('Success');
    } else {
      console.log('Failed buy');
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
  const [isLoading, setIsLoading] = useState(false);
  const {height, width} = Dimensions.get('window');

  const giftCards = useSelector(x => x.offRamp.giftCards);
  const [qty, setQty] = useState(1);

  return (
    <Modal
      statusBarTranslucent={false}
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
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
                {selectedChip} USD
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
                {data?.denominations.map((chip, index) => (
                  <Chip
                    key={index}
                    label={chip}
                    // isSelected={selectedChips.has(chip)}
                    isSelected={chip === selectedChip}
                    onPress={() => toggleChipSelection(chip)}
                  />
                ))}
              </View>
            </ScrollView>
          ) : (
            <View style={styles.container}>
              {data?.denominations.map((chip, index) => (
                <Chip
                  key={index}
                  label={chip}
                  // isSelected={selectedChips.has(chip)}
                  isSelected={chip === selectedChip}
                  onPress={() => toggleChipSelection(chip)}
                />
              ))}
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
              onPress={gotQuote ? onAccept : getQuote}>
              <Text style={styles.textStyle}>
                {gotQuote ? 'Confirm' : 'GET QUOTES'}
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
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

    paddingHorizontal: 20,
    backgroundColor: '#000',
    color: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    alignSelf: 'center',
    fontSize: 12,
    opacity: 0.7,
    marginVertical: 20,
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
