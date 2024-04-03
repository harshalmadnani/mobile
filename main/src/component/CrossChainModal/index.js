import React, {useCallback, useState, useMemo, useEffect} from 'react';
import {View, Text, StyleSheet, Modal, Pressable} from 'react-native';

import {listOfWallet} from '../../utils/particleConnectSDK';
import {Image} from 'react-native';
import {
  connectWitParticleConnect,
  initializedParticleConnect,
} from '../../utils/particleConnectSDK';
const CrossChainModal = ({modalVisible, setModalVisible}) => {
  // renders
  const [address, setAddress] = useState(false);
  const connectWithSelectedWallet = async walletType => {
    initializedParticleConnect();
    const address = await connectWitParticleConnect(walletType);
    if (address) {
      setAddress(address);
    }
  };
  useEffect(() => {
    if (address) {
      console.log('address changed!!!!!! Get Asset');
    }
  }, [address]);
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
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

          <View style={styles.listWrap}>
            {listOfWallet.map((wallets, i) => {
              return (
                <Pressable
                  style={{
                    width: '100%',
                    borderWidth: 1,
                    padding: 12,
                    borderColor: 'white',
                    borderRadius: 12,
                    marginBottom: 8,
                    backgroundColor: '#000',
                  }}
                  onPress={async () =>
                    connectWithSelectedWallet(wallets?.name)
                  }>
                  <Text
                    style={{
                      fontSize: 18,
                      color: '#fff',
                      textAlign: 'center',
                      fontFamily: 'Satoshi-Bold',
                    }}>
                    {wallets?.name}
                  </Text>
                  {/* <Image
                    source={{uri: wallets?.url}}
                    style={{width: 80, height: 80}}
                    //   resizeMode="contain"
                  /> */}
                </Pressable>
              );
            })}
          </View>
        </View>
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
    // height: '90%', // Make modal take full width at the bottom
    backgroundColor: '#fff',
    borderTopRightRadius: 16, // Only round the top corners
    borderTopLeftRadius: 16,
    padding: 10,
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  listWrap: {
    // flexDirection: 'row', // Align items in a row
    // flexWrap: 'wrap', // Allow items to wrap to the next line
    // justifyContent: 'center', // Align items to the start of the container
    // padding: 8, // Add some padding around the container
    marginTop: '4%',
  },
});

export default CrossChainModal;
