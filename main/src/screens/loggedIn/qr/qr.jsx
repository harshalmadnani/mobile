import React, {Component} from 'react';
import {Text, View, SafeAreaView, ScrollView, TouchableOpacity, Alert} from 'react-native';
import {Icon} from 'react-native-elements';
import Clipboard from '@react-native-clipboard/clipboard';
import QR from '../../../qr-generator'; // Ensure this path is correct for your QR generator
import styles from './qr-styles';

function QRCode() {
  let address, info;
  if (global.withAuth) {
    address = global.loginAccount.scw;
    info = global.loginAccount.name;
  } else {
    address = global.connectAccount?.publicAddress;
    info = global.connectAccount.name;
  }

  const qrUrl = String(address);

  return (
    <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
      <View style={styles.userInfo}>
        <Text style={styles.name}>{String(info)}</Text>
        <TouchableOpacity
          onPress={() => {
            Clipboard.setString(String(address).toLowerCase());
            Alert.alert('Copied Address To Clipboard');
          }}
          style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
          <Text style={styles.address}>
            {`${String(address).toLowerCase().substring(0, 8)}...${String(address).toLowerCase().slice(-8)} `}
          </Text>
          <Icon name="file-copy" size={14} color="#f0f0f0" type="materialicons"/>
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
      status: true, // Assuming this toggles QRCode and QRScanner components
    };
  }

  ShowQRScanner = () => {
    this.setState({status: !this.state.status});
  };

  render() {
    return (
      <SafeAreaView style={{backgroundColor:'#000', flex: 1}}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', width: '100%', marginTop: '5%' ,backgroundColor:'#000', marginLeft:'5%'}}>
            <Icon
                name={'navigate-before'}
                size={30}
                color={'#f0f0f0'}
                type="materialicons"
                onPress={() => this.props.navigation.goBack()}
            />
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginRight: '10%' }}>
                <Text style={{
                    color: '#F0F0F0',
                    fontFamily: 'Unbounded-Medium',
                    fontSize: 16,
                }}>Deposit Polygon USDC</Text>
            </View>
        </View>
        <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center', alignItems: 'center'}}>
          {this.state.status ? <QRCode /> : <QRScanner navigation={this.props.navigation} />}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default QRPage;
