import React, {useState} from 'react';
import {
  TouchableOpacity,
  SafeAreaView,
  View,
  Image,
  ScrollView,
  Clipboard,
  Dimensions,
  Alert,
  StyleSheet,
  Linking,
  Modal,
  ImageBackground,
  Switch,
} from 'react-native';
import Snackbar from 'react-native-snackbar';
const bg = require('../../../assets/choose.png');
const windowHeight = Dimensions.get('window').height;
import {Text} from '@rneui/themed';
import styles from './settings-styles';
import {Icon} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';
import {useDispatch} from 'react-redux';
import {logoutRefresh} from '../../store/actions/auth';
// import {EventsCarousel} from './eventsCarousel';
const HorizontalRule = () => {
  return <View style={ruleStyles.hr} />;
};

const ruleStyles = StyleSheet.create({
  hr: {
    borderBottomColor: '#101010',
    borderBottomWidth: 1,
    marginVertical: 10,
    width: '100%',
    // marginTop: '0%',
  },
});
func = () => {
  Clipboard.setString(
    `
Xade is reshaping finance with its super decentralised bank powered by DeFi where you can help us both earn Xade Coins by joining Xade using my refer code: ${
      global.withAuth
        ? global.loginAccount.scw
        : global.connectAccount.publicAddress
    }

Download Now: https://bit.ly/xadefinance
`,
  );

  Snackbar.show({text: 'Referral link copied'});

  // Alert.alert('Referral link copied');
};
this.state = {
  selectedIndex: 0,
  externalLinkHeading: '',
  externalLinkUri: '',
  showExternalLinkModal: false,
};
// import {signAndSendTransactionConnect} from '../../particle-connect';
let address;
let info;
let imageUrl;
const Component = ({navigation}) => {
  const dispatch = useDispatch();
  if (global.withAuth) {
    address = global.loginAccount.scw;
    info = global.loginAccount.name;
    imageUrl = `https://ui-avatars.com/api/?name=${info}&format=png&rounded=true&bold=true&background=000&color=ffbd59`;
  } else {
    address = global.connectAccount.publicAddress;
    info = global.connectAccount.name;
    imageUrl = `https://ui-avatars.com/api/?name=${info}&format=png&rounded=true&bold=true&background=000&color=ffbd59`;
  }
  const [amount, setAmount] = React.useState(0);
  const [networksVisible, setNetworksVisible] = React.useState(false);
  const [faceID, setFaceID] = useState(global.faceID);
  const toggleSwitch = async () => {
    await AsyncStorage.setItem('faceID', JSON.stringify(!faceID));
    setFaceID(previousState => !previousState);
    const id = JSON.parse(await AsyncStorage.getItem('faceID'));
    console.log('FaceID Enabled:', id);
  };

  return (
    <SafeAreaView style={{flex: 1, paddingBottom: '10%'}}>
      <View
        style={{
          marginTop: '8%',
          marginBottom: '2%',
          marginLeft: '5%',
          marginRight: '5%', // Added marginRight to ensure space is maintained from the right edge
          flexDirection: 'row',
          justifyContent: 'space-between', // This line positions items on opposite ends
        }}>
        <Text
          style={{fontFamily: 'Unbounded-Medium', color: '#fff', fontSize: 20}}>
          PROFILE
        </Text>
        <TouchableOpacity onPress={() => navigation.push('TransactionHistory')}>
          <Image
            source={{
              uri: 'https://res.cloudinary.com/dcrfpsiiq/image/upload/v1709493378/x8e21kt9laz3hblka91g.png',
            }} // Replace with your image URI
            style={{
              width: 40,
              height: 40,
              bottom: 3,
            }}
          />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.nameSettings}>
          <View style={{marginBottom: '5%'}}>
            <Text
              style={{
                color: 'white',
                fontSize: 23,
                fontFamily: `Unbounded-Medium`,
                textAlign: 'center',
              }}>
              {info.toUpperCase()}
            </Text>
            <Text
              style={{
                color: 'grey',
                fontFamily: `NeueMontreal-Medium`,
                fontSize: 15,
                textAlign: 'center',
              }}>
              {global.withAuth
                ? global.loginAccount.phoneEmail.includes('@')
                  ? '' + global.loginAccount.phoneEmail
                  : '+' + global.loginAccount.phoneEmail
                : global.connectAccount.publicAddress.slice(0, 15) + '...'}
            </Text>
          </View>
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL('https://zealy.io/cw/xadefinance/questboard');
            }}
            style={{
              justifyContent: 'center',
              borderRadius: 30,
              padding: 20,
              backgroundColor: '#1a1a1a',
              marginLeft: '3%',
              width: '45%',
            }}>
            <Image
              source={{
                uri: 'https://res.cloudinary.com/xade-finance/image/upload/v1710402529/du6fpp6plx9fhp6qdv1l.png',
              }}
              style={{height: 60, width: 60}}
            />
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Unbounded-Medium',
                color: '#fff',
                marginVertical: '5%',
                textAlign: 'left',
              }}>
              QUESTS
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'NeueMontreal-Medium',
                color: '#949494',
                marginBottom: '10%',
              }}>
              Get exclusive rewards such as Xade Shards & more
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              Linking.openURL('https://app.komet.me/nfts/Xade_Explorers/346');
            }}
            style={{
              justifyContent: 'center',
              borderRadius: 30,
              padding: 20,
              backgroundColor: '#1a1a1a',
              width: '45%',
              marginRight: '3%',
            }}>
            <Image
              source={{
                uri: 'https://res.cloudinary.com/xade-finance/image/upload/v1710402530/eyybhybbljzq9tvnfxqn.png',
              }}
              style={{height: 60, width: 60}}
            />
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Unbounded-Medium',
                color: '#fff',
                marginVertical: '5%',
              }}>
              EXPLORERS
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'NeueMontreal-Medium',
                color: '#949494',
                marginBottom: '10%',
              }}>
              Become a Xade Explorer to get the best that we have
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.otherSettings, {marginTop: 20, marginBottom: 10}]}>
          <TouchableOpacity
            style={styles.innerSettings}
            onPress={() => Linking.openURL('mailto:support@xade.finance')}>
            <FastImage
              style={{width: 28, height: 28, borderRadius: 10}}
              source={require('./face-id.png')}
            />
            <View style={styles.actualSetting}>
              <Text style={styles.settingsText}>FaceID</Text>
              <Switch
                trackColor={{false: '#767577', true: '#fff'}}
                thumbColor={'#fff'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={faceID}
              />
            </View>
          </TouchableOpacity>

          <HorizontalRule />
          <TouchableOpacity
            style={styles.innerSettings}
            onPress={() => {
              Linking.openURL('https://docs.xade.finance/');
            }}>
            <FastImage
              style={{width: 28, height: 28, borderRadius: 10}}
              source={require('./wallet.png')}
            />
            <View style={styles.actualSetting}>
              <Text style={styles.settingsText}>Wallets</Text>
              <Icon
                name={'angle-right'}
                size={20}
                color={'#86969A'}
                type="font-awesome"
              />
            </View>
          </TouchableOpacity>
          <HorizontalRule />

          <TouchableOpacity
            style={styles.innerSettings}
            onPress={() => {
              Linking.openURL('https://docs.xade.finance/');
            }}>
            <FastImage
              style={{width: 28, height: 28, borderRadius: 10}}
              source={require('./book-open.png')}
            />
            <View style={styles.actualSetting}>
              <Text style={styles.settingsText}>About Xade</Text>
              <Icon
                // style={styles.tup}
                name={'angle-right'}
                size={20}
                color={'#86969A'}
                type="font-awesome"
                // style = {{marginRight: '1%'}}
              />
            </View>
          </TouchableOpacity>
          {/* <HorizontalRule /> */}
        </View>
        <View style={[styles.otherSettings, {marginBottom: 20}]}>
          <TouchableOpacity
            style={styles.innerSettings}
            onPress={() => {
              Linking.openURL('https://xade.finance/privacy-policy');
            }}>
            <FastImage
              style={{width: 28, height: 28, borderRadius: 10}}
              source={require('./lock.png')}
            />
            <View style={styles.actualSetting}>
              <Text style={styles.settingsText}>Privacy Policy</Text>
              <Icon
                // style={styles.tup}
                name={'angle-right'}
                size={20}
                color={'#86969A'}
                type="font-awesome"
                // style = {{marginRight: '1%'}}
              />
            </View>
          </TouchableOpacity>
          <HorizontalRule />
          <TouchableOpacity
            style={styles.innerSettings}
            onPress={() => {
              Linking.openURL('https://xade.finance/terms-of-service');
            }}>
            <FastImage
              style={{width: 28, height: 28, borderRadius: 10}}
              source={require('./document-duplicate.png')}
            />
            <View style={styles.actualSetting}>
              <Text style={styles.settingsText}>Terms of Service</Text>
              <Icon
                // style={styles.tup}
                name={'angle-right'}
                size={20}
                color={'#86969A'}
                type="font-awesome"
                // style = {{marginRight: '1%'}}
              />
            </View>
          </TouchableOpacity>
          <HorizontalRule />
          <TouchableOpacity
            style={styles.innerSettings}
            onPress={async () => {
              dispatch(logoutRefresh());
              await AsyncStorage.setItem('isConnected', JSON.stringify(false));
              navigation.navigate('LoggedOutHome');
            }}>
            <FastImage
              style={{width: 28, height: 28, borderRadius: 10}}
              source={require('./logout.png')}
            />
            <View style={styles.actualSetting}>
              <Text style={styles.settingsText}>Logout</Text>
            </View>
          </TouchableOpacity>
          <Modal
            animationType="slide"
            visible={networksVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setNetworksVisible(!networksVisible);
            }}>
            <ImageBackground source={bg} style={modalStyles.bg}>
              <SafeAreaView>
                <ScrollView>
                  <View style={modalStyles.container}>
                    <View style={modalStyles.topbar}>
                      <Text style={modalStyles.logo}>XADE</Text>
                      <TouchableOpacity
                        style={{marginTop: '1%'}}
                        onPress={() => setNetworksVisible(!networksVisible)}>
                        <Icon
                          name={'close'}
                          size={30}
                          color={'#f0f0f0'}
                          type="materialicons"
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={modalStyles.mainContent}>
                      <Text style={modalStyles.mainText}>Choose Network:</Text>
                      <View style={modalStyles.buttonContent}>
                        <TouchableOpacity
                          style={modalStyles.button}
                          onPress={async () => {
                            global.mainnet = true;

                            await AsyncStorage.setItem(
                              'mainnet',
                              JSON.stringify(true),
                            );
                            console.log('Switching To Mainnet');
                            if (global.withAuth) {
                              // console.log(
                              //   await particleAuth.setChainInfoAsync(
                              //     particleAuth.ChainInfo.PolygonMainnet,
                              //   ),
                              //   await particleAuth.setChainInfoAsync(
                              //     particleAuth.ChainInfo.PolygonMainnet,
                              //   ),
                              //   await global.smartAccount.setActiveChain(
                              //     ChainId.POLYGON_MAINNET,
                              //   ),
                              // );
                            } else {
                              console.log();
                              // await particleConnect.switchEthereumChain(
                              //   global.walletType,
                              //   global.connectAccount.publicAddress,
                              //   particleConnect.ChainInfo.PolygonMainnet,
                              // ),
                            }
                            setNetworksVisible(!networksVisible);
                            navigation.push('Home');
                          }}>
                          <Text style={modalStyles.buttonText}>
                            Switch To Mainnet
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={modalStyles.buttonAlt}
                          onPress={async () => {
                            global.mainnet = false;
                            await AsyncStorage.setItem(
                              'mainnet',
                              JSON.stringify(false),
                            );
                            console.log('Switching To Testnet');
                            if (global.withAuth) {
                            } else {
                              // console.log(
                              //   await particleConnect.switchEthereumChain(
                              //     global.walletType,
                              //     global.connectAccount.publicAddress,
                              //     particleConnect.ChainInfo.PolygonMumbai,
                              //   ),
                              // );
                            }
                            setNetworksVisible(!networksVisible);
                            navigation.push('Home');
                          }}>
                          <Text style={modalStyles.buttonTextAlt}>
                            Switch To Testnet
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </ScrollView>
              </SafeAreaView>
            </ImageBackground>
          </Modal>
        </View>

        <View style={styles.socialMedia}>
          <View style={styles.innerMedia}>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL('https://xade.finance');
              }}>
              <Icon
                name={'web'}
                size={35}
                color={'#808080'}
                type="material-community"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.innerMedia}>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL('https://twitter.com/XadeFinance');
              }}>
              <Icon
                name={'twitter'}
                size={30}
                color={'#808080'}
                type="antdesign"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.innerMedia}>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL('https://discord.gg/VxuKdRRzmN');
              }}>
              <Icon
                name={'discord'}
                size={30}
                color={'#808080'}
                type="material-community"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.innerMedia}>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL('https://youtube.com/@xadefinance');
              }}>
              <Icon
                name={'youtube'}
                size={40}
                color={'#808080'}
                type="material-community"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.innerMedia}>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL('https://www.reddit.com/r/XadeFinance/');
              }}>
              <Icon
                name={'reddit'}
                size={35}
                color={'#808080'}
                type="material-community"
              />
            </TouchableOpacity>
          </View>
        </View>
        <Text
          style={{
            color: '#898989',
            marginBottom: '15%',
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          v1.1.3 (5) - beta
        </Text>
      </ScrollView>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          height: 52,
          width: '95%',
          borderRadius: 30,
          backgroundColor: '#fff', // Set background color to white
          position: 'absolute',
          bottom: 30, // Adjust the bottom spacing as needed
          left: 0,
          right: 0,
          alignItems: 'center', // Center the text vertically
          justifyContent: 'center', // Center the text horizontally
        }}
        onPress={() => {
          navigation.push('SendEmail');
        }}>
        <Text
          style={{
            color: '#000', // Set text color to black
            fontSize: 14,
            fontFamily: 'Unbounded-ExtraBold',
          }}>
          TRANSFER FUNDS
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Component;

const modalStyles = StyleSheet.create({
  bg: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
  },

  container: {
    width: '100%',
    height: windowHeight,
  },

  topbar: {
    width: '90%',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  logo: {
    fontFamily: 'LemonMilk-Regular',
    color: '#fff',
    fontSize: 30,
    marginLeft: '8%',
  },

  mainContent: {
    width: '100%',
    backgroundColor: 'transparent',
    marginTop: '15%',
  },

  mainText: {
    color: '#fff',
    fontFamily: 'VelaSans-ExtraBold',
    fontSize: 25,
    width: '100%',
    textAlign: 'center',
  },

  buttonContent: {
    width: '100%',
    backgroundColor: 'transparent',
    marginTop: '30%',
  },

  button: {
    width: '70%',
    color: '#0C0C0C',
    borderRadius: 50,
    marginLeft: '15%',
    marginTop: '7%',
    padding: '4%',
    backgroundColor: 'white',
    borderWidth: 2.5,
  },

  buttonText: {
    color: '#0C0C0C',
    fontFamily: 'VelaSans-Bold',
    fontSize: 15,
    textAlign: 'center',
  },

  buttonAlt: {
    width: '70%',
    color: '#fff',
    borderRadius: 50,
    marginLeft: '15%',
    marginTop: '10%',
    padding: '4%',
    backgroundColor: '#0C0C0C',
    borderWidth: 2.5,
  },

  buttonTextAlt: {
    color: '#fff',
    fontFamily: 'VelaSans-Bold',
    fontSize: 15,
    textAlign: 'center',
  },

  buttonIcon: {
    marginLeft: '80%',
  },
});
