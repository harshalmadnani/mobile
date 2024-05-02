import React, {useState, useEffect, useCallback} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  TouchableOpacity,
  SafeAreaView,
  Text,
  View,
  Image,
  Dimensions,
  StyleSheet,
  FlatList,
  Pressable,
  Modal,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {transferAction} from '../../../store/reducers/transfer';
import {useNavigation} from '@react-navigation/native';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

const AnyTokenListScreen = ({modalVisible, setModalVisible}) => {
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  const dispatch = useDispatch();
  const holdings = useSelector(x => x.portfolio.holdings);
  const recipientAddress = useSelector(x => x.transfer.recipientAddress);
  const navigation = useNavigation();
  //   const manipulatedHoldingsData = [];

  //   if (holdings.assets?.length > 0) {
  //     holdings.assets?.forEach((asset, i) => {
  //       asset?.contracts_balances?.forEach(contractBalance =>
  //         manipulatedHoldingsData.push({
  //           ...asset,
  //           token_balance: contractBalance?.balance,
  //           estimated_balance: contractBalance?.balance * asset?.price,
  //           contracts_balances: [contractBalance],
  //         }),
  //       );
  //     });
  //   }
  return (
    <Modal
      animationType="slide"
      // transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>
      <View
        style={{
          width: width,
          height,
          alignSelf: 'flex-start',
          backgroundColor: '#000000',
          paddingBottom: 80,
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
            Holdings
          </Text>
          {/* <TouchableOpacity onPress={() => navigation.push('TransactionHistory')}>
          <MyInvestmentItemCard
                navigation={navigation}
                item={{
                  ...item?.asset,
                  balance: item?.token_balance,
                  current_price: item?.price,
                  unrealized_pnl: item?.unrealized_pnl,
                  realized_pnl: item?.realized_pnl,
                  image: item?.asset?.logo,
                  price_bought: item?.price_bought,
                }}
              />
          <Image
            source={{
              uri: 'https://res.cloudinary.com/dcrfpsiiq/image/upload/v1709493378/x8e21kt9laz3hblka91g.png',
            }}
            style={{
              width: 40,
              height: 40,
              bottom: 10,
              alignSelf: 'center',
            }}
          />
        </TouchableOpacity> */}
        </View>
        <FlatList
          data={holdings?.assets}
          style={{
            marginTop: 64,
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
                <Text
                  style={{
                    fontFamily: `NeueMontreal-Medium`,
                    color: 'white',
                    opacity: 0.5,
                    fontSize: 16,
                  }}>
                  {item?.token_balance?.toString()?.slice(0, 10)}
                </Text>
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
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    color: '#ffffff',
    fontFamily: `NeueNeueMontreal-Medium`,
    fontWeight: '500',
    marginLeft: 30,
  },
});

export default AnyTokenListScreen;
