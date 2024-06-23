import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  Component,
} from 'react';
import {Picker} from '@react-native-picker/picker';
import {
  Text,
  Modal,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  Image,
  Pressable,
} from 'react-native';
import {Icon} from 'react-native-elements';
import Clipboard from '@react-native-clipboard/clipboard';
import QR from '../../../qr-generator'; // Ensure this path is correct for your QR generator
import styles from './qr-styles';
import {useDispatch, useSelector} from 'react-redux';
import {getNameChainId} from '../../../store/actions/market';
import {useNavigation} from '@react-navigation/native';
import {NetworkChainInfo} from '../../../utils/constants';

function QRCode({scw}) {
  // let address, info;
  // if (global.withAuth) {
  //   address = global.loginAccount.scw;
  //   info = global.loginAccount.name;
  // } else {
  //   address = global.connectAccount?.publicAddress;
  //   info = global.connectAccount.name;
  // }
  const name = useSelector(x => x.auth.name);

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
const NetworkListPicker = ({
  modalVisible,
  setCurrentWallet,
  setModalVisible,
}) => {
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  const allScw = useSelector(x => x.auth.scw);
  return (
    <Modal
      animationType="slide"
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>
      <View
        style={{
          width: width,
          height: height,
          alignSelf: 'flex-end',
          backgroundColor: '#000000',
          paddingBottom: '1%',
        }}>
        <View
          style={{
            marginTop: '8%',
            marginLeft: '5%',
            marginRight: '5%',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontFamily: 'Unbounded-Medium',
              color: '#fff',
              fontSize: 20,
            }}>
            Networks
          </Text>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
              // navigation.goBack(); // Assuming you're using something like React Navigation
            }}>
            <Icon
              name={'close'}
              size={24}
              color={'#f0f0f0'}
              type="materialicons"
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: 16,
            width: '98%',
          }}>
          {allScw.length > 0
            ? allScw?.map((item, i) => (
                <Pressable
                  key={i}
                  onPress={() => {
                    setCurrentWallet(item);
                    // dispatch(transferAction.setAssetToTransfer(item));
                    setModalVisible(!modalVisible);
                  }}
                  style={{width: '100%', padding: 12}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        fontFamily: `NeueMontreal-Medium`,
                        color: 'white',
                        fontSize: 20,
                      }}>
                      {getNameChainId(item?.chainId)}
                    </Text>
                    {/* <View style={{marginRight: 8}}>
                      <Image
                        source={{
                          uri: NetworkChainInfo.filter(
                            x => x.chainId === item?.chainId,
                          )?.[0]?.logo,
                        }}
                        style={{
                          width: 18,
                          height: 18,
                          alignSelf: 'center',
                          tintColor: 'gray',
                        }}
                      />
                      <Image
                        source={{
                          uri: NetworkChainInfo.filter(
                            x => x.chainId === item?.chainId,
                          )?.[0]?.logo,
                        }}
                        style={{
                          width: 18,
                          height: 18,
                          alignSelf: 'center',
                          position: 'absolute',
                          opacity: 0.5,
                        }}
                      />
                    </View> */}
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontFamily: `NeueMontreal-Medium`,
                          color: 'white',
                          fontSize: 16,
                          paddingTop: 10,
                        }}>
                        {`${String(item?.address)
                          .toLowerCase()
                          .substring(0, 8)}...${String(item?.address)
                          .toLowerCase()
                          .slice(-8)} `}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              ))
            : null}
        </View>
        {/* <FlatList
          data={holdings?.assets.length > 0 ? holdings?.assets : []}
          style={{
            marginTop: 16,
            width: '98%',
          }}
          renderItem={({item}) => (
            <Pressable
              onPress={() => {
                dispatch(transferAction.setAssetToTransfer(item));
                setModalVisible(!modalVisible);
              }}
              style={{width: '100%', padding: 12}}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text
                  style={{
                    fontFamily: `NeueMontreal-Medium`,
                    color: 'white',
                    fontSize: 20,
                  }}>
                  {item?.asset?.name}
                </Text>
                <Text
                  style={{
                    fontFamily: `NeueMontreal-Medium`,
                    color: 'white',
                    fontSize: 16,
                    paddingTop: 10,
                  }}>
                  ${item?.estimated_balance?.toString()?.slice(0, 5)}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={{marginRight: 8}}>
                    <Image
                      source={{
                        uri: NetworkChainInfo.filter(
                          x =>
                            x.chainId ===
                            item?.contracts_balances?.[0]?.chainId,
                        )?.[0]?.logo,
                      }}
                      style={{
                        width: 18,
                        height: 18,
                        alignSelf: 'center',
                        tintColor: 'gray',
                      }}
                    />
                    <Image
                      source={{
                        uri: NetworkChainInfo.filter(
                          x =>
                            x.chainId ===
                            item?.contracts_balances?.[0]?.chainId,
                        )?.[0]?.logo,
                      }}
                      style={{
                        width: 18,
                        height: 18,
                        alignSelf: 'center',
                        position: 'absolute',
                        opacity: 0.5,
                      }}
                    />
                  </View>
                  <Text
                    style={{
                      fontFamily: `NeueMontreal-Medium`,
                      color: 'white',
                      opacity: 0.5,
                      fontSize: 16,
                    }}>
                    {item?.token_balance?.toString()?.slice(0, 10)}
                  </Text>
                </View>
                <Text
                  style={{
                    fontFamily: `NeueMontreal-Medium`,
                    color: 'white',
                    opacity: 0.5,
                    fontSize: 16,
                  }}>
                  {` ${item?.asset?.symbol}`}
                </Text>
              </View>
            </Pressable>
          )}
          keyExtractor={(item, i) => i.toString()}
        /> */}
      </View>
    </Modal>
  );
};
function QRPage() {
  // constructor() {
  //   super();
  //   this.state = {
  //     status: true,
  //     modalVisible: false, // Added this line for modal management
  //   };
  // }
  const [state, setState] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const showQRScanner = () => {
    setState(!state);
  };

  // if (allScw.length > 0) {
  //   allScw = allScw.map(x => {
  //     return {label: getNameChainId(x?.chainId), value: x?.address};
  //   });
  // }
  const allScw = useSelector(x => x.auth.scw);
  const [selected, setSelected] = useState(
    allScw?.filter(x => x.chainId === '137')?.[0],
  );

  const navigation = useNavigation();
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
          onPress={() => navigation.goBack()}
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
            Deposit {getNameChainId(selected?.chainId)} USDC
          </Text>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {state ? (
          <QRCode scw={selected?.address} />
        ) : (
          <QRScanner navigation={this.props.navigation} />
        )}
        <Pressable
          style={{
            padding: 20,
            width: '60%',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderRadius: 10,
            borderColor: '#707070',
          }}
          onPress={() => setModalVisible(true)}>
          <Text style={[{...styles.address}, {marginTop: 0}]}>
            {getNameChainId(selected?.chainId)}
          </Text>
        </Pressable>
        <NetworkListPicker
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          setCurrentWallet={setSelected}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
// }

export default QRPage;
