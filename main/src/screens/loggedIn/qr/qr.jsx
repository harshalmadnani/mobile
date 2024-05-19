import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  Component,
} from 'react';
import {
  Text,
  Modal,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Icon} from 'react-native-elements';
import Clipboard from '@react-native-clipboard/clipboard';
import QR from '../../../qr-generator'; // Ensure this path is correct for your QR generator
import styles from './qr-styles';
import {useSelector} from 'react-redux';

function QRCode() {
  // let address, info;
  // if (global.withAuth) {
  //   address = global.loginAccount.scw;
  //   info = global.loginAccount.name;
  // } else {
  //   address = global.connectAccount?.publicAddress;
  //   info = global.connectAccount.name;
  // }
  const name = useSelector(x => x.auth.name);
  const scw = useSelector(x => x.auth.scw).filter(x => x.chainId === 137)?.[0]
    ?.address;
  const qrUrl = String(scw);

  return (
    <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
      <View style={styles.userInfo}>
        <Text style={styles.name}>{String(name)}</Text>
        <TouchableOpacity
          onPress={() => {
            Clipboard.setString(String(scw).toLowerCase());
            Alert.alert('Copied Address To Clipboard');
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={styles.address}>
            {`${String(scw).toLowerCase().substring(0, 8)}...${String(scw)
              .toLowerCase()
              .slice(-8)} `}
          </Text>
          <Icon
            name="file-copy"
            size={14}
            color="#f0f0f0"
            type="materialicons"
          />
        </TouchableOpacity>
      </View>
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <View style={styles.qr}>
          <QR value={qrUrl} />
        </View>
      </View>
    </View>
  );
}

class QRPage extends Component {
  constructor() {
    super();
    this.state = {
      status: true,
      modalVisible: false, // Added this line for modal management
    };
  }

  ShowQRScanner = () => {
    this.setState({status: !this.state.status});
  };

  setModalVisible = visible => {
    this.setState({modalVisible: visible});
  };

  render() {
    const {modalVisible} = this.state;
    return (
      <SafeAreaView style={{backgroundColor: '#000', flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            marginTop: '5%',
            backgroundColor: '#000',
            marginLeft: '5%',
          }}>
          <Icon
            name={'navigate-before'}
            size={30}
            color={'#f0f0f0'}
            type="materialicons"
            onPress={() => this.props.navigation.goBack()}
          />
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '10%',
            }}>
            <Text
              style={{
                color: '#F0F0F0',
                fontFamily: 'Unbounded-Medium',
                fontSize: 16,
              }}>
              Deposit Polygon USDC
            </Text>
          </View>
        </View>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {this.state.status ? (
            <QRCode />
          ) : (
            <QRScanner navigation={this.props.navigation} />
          )}
          <TouchableOpacity onPress={() => this.setModalVisible(true)}>
            <Text style={{fontSize: 20, color: '#999', padding: 10}}>
              Don't have Polygon USDC?
            </Text>
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              this.setModalVisible(!modalVisible);
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,,0.5)',
                width: '100%',
              }}>
              <View
                style={{
                  margin: 20,
                  backgroundColor: '#000',
                  borderRadius: 30,
                  padding: '5%',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}>
                <Text
                  style={{
                    marginBottom: 15,
                    textAlign: 'center',
                    color: '#fff',
                    fontSize: 14,
                    fontFamily: 'Unbounded-Medium',
                  }}>
                  DEPOSIT OTHER ASSETS
                </Text>
                <Text
                  style={{
                    marginBottom: '10%',
                    textAlign: 'center',
                    color: '#999',
                    fontSize: 14,
                    fontFamily: 'NeueMontreal-Medium',
                  }}>
                  You can deposit assets on any EVM chains using the qr code and
                  sell it on Xade to get cash
                </Text>
                <TouchableOpacity
                  onPress={() => this.setModalVisible(!modalVisible)}
                  style={{
                    backgroundColor: 'white', // Changed background color to white
                    borderRadius: 30,
                    paddingVertical: '5%',
                    paddingHorizontal: '40%', // Adjust padding to be more visually balanced
                    elevation: 2,
                    width: '100%', // Makes the button longer
                    alignSelf: 'center', // Centers button in its container
                  }}>
                  <Text
                    style={{
                      color: 'black', // Changed text color for contrast against white
                      textAlign: 'center',
                      fontWeight: 'bold', // Optional: makes the text bold
                    }}>
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default QRPage;
