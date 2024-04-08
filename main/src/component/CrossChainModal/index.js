import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Modal, Pressable} from 'react-native';

import {listOfWallet} from '../../utils/particleConnectSDK';

import {
  connectWitParticleConnect,
  initializedParticleConnect,
} from '../../utils/particleConnectSDK';
import {
  getCryptoHoldingForAddress,
  getCryptoHoldingForSwapAddress,
} from '../../utils/cryptoWalletApi';
import LottieView from 'lottie-react-native';
import {w3cwebsocket as W3CWebSocket} from 'websocket';
const CrossChainModal = ({modalVisible, setModalVisible}) => {
  // renders
  const [address, setAddress] = useState(false);
  const [assets, setAssets] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [step, setStep] = useState('wallet');
  const connectWithSelectedWallet = async walletType => {
    initializedParticleConnect();
    const address = await connectWitParticleConnect(walletType);
    if (address) {
      setAddress(address);
    }
  };
  useEffect(() => {
    const ws = new W3CWebSocket(
      'wss://portfolio-api-wss-fgpupeioaa-uc.a.run.app',
    );
    if (address) {
      ws.onopen = () => {
        const payload = {
          type: 'wallet',
          authorization: 'e26c7e73-d918-44d9-9de3-7cbe55b63b99',
          payload: {
            wallet: address,
            interval: 15,
          },
        };

        ws.send(JSON.stringify(payload));
      };

      ws.onmessage = event => {
        setAssets(JSON.parse(event?.data)?.assets);
        setStep('asset');
      };

      ws.onerror = event => {
        console.error('WebSocket error:', event);
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
      };
    }
    return () => {
      ws.close();
    };
  }, [address]);
  console.log('address changed!!!!!! Get Asset', assets, isLoading);
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>
      <View style={styles.centeredView}>
        <View
          style={[
            styles.modalView,
            {backgroundColor: isLoading ? '#000' : '#fff'},
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
          {isLoading && (
            <View
              style={{
                justifyContent: 'center',
                height: '80%',
                width: '100%',
                backgroundColor: isLoading ? '#000' : '#fff',
              }}>
              <LottieView
                source={require('../../../assets/lottie/iosLottieLoader.json')}
                style={{
                  width: 20,
                  height: 20,
                  alignSelf: 'center',
                }}
                autoPlay
                loop
              />
            </View>
          )}
          {!isLoading && step === 'wallet' && (
            <View style={styles.listWrap}>
              {listOfWallet.map((wallets, i) => {
                return (
                  <Pressable
                    key={i}
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
          )}
          {!isLoading && step === 'asset' && (
            <View style={styles.listWrap}>
              {assets.map((asset, i) => {
                return (
                  <Pressable
                    key={i}
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
                      connectWithSelectedWallet(asset?.name)
                    }>
                    <Text
                      style={{
                        fontSize: 18,
                        color: '#fff',
                        textAlign: 'center',
                        fontFamily: 'Satoshi-Bold',
                      }}>
                      {asset?.name}
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
          )}
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
