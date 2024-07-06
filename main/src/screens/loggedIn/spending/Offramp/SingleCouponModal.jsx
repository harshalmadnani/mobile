import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Modal,
  Pressable,
  Dimensions,
  Image,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native';

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

const SingleCouponModal = ({modalVisible, setModalVisible, data}) => {
  const [selectedChip, setSelectedChip] = useState(null);
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
          <Text style={[styles.modalText, {marginTop: 0}]}>{data?.brand}</Text>
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
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModalVisible(!modalVisible)}>
            <Text style={styles.textStyle}>Hide Modal</Text>
          </Pressable>
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
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalText: {
    fontSize: 20,

    marginBottom: 10,
    textAlign: 'center',

    color: '#fff',
    //fontFamily: 'Unbounded-Bold',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginBottom: 10,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalImg: {
    width: Dimensions.get('window').width * 0.9, // Full width
    height: '40%', // Set a fixed height or adjust dynamically based on your needs
    borderRadius: 10,
    alignSelf: 'center',

    marginVertical: 10,
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
    borderColor: '#ccc',
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
});

export default SingleCouponModal;
