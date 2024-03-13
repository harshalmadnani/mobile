import React, {useState, Component, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Button
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Icon, Image} from '@rneui/themed';
const MyInvestmentItemCard = ({navigation, item}) => {
  console.log('Image', item.unrealized_pnl);
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <TouchableOpacity
      onPress={e => {
        setModalVisible(true)
      }}
      style={{
        width: '100%',
        alignSelf: 'flex-start',
        paddingVertical: '5%',
        // backgroundColor: 'red',
      }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            // backgroundColor: 'red',
          }}>
          <View style={{paddingHorizontal: 5}}>
            <FastImage
              style={{width: 42, height: 42}}
              source={{
                uri: `${item.image}`,
              }}
            />
          </View>

          <View style={{paddingHorizontal: 10}}>
            <View>
              <Text style={styles.text1}>{item.symbol.toUpperCase()}</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
              <View style={{paddingRight: 10}}>
                <Text style={styles.text5}>{item.balance}</Text>
              </View>
            </View>
          </View>
        </View>
<View style={{flexDirection:'row'}}>
        <View
          style={{
            paddingHorizontal: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            // backgroundColor: 'red'
          }}>
          <View>
            <Text style={styles.text2}>
              ${(item.current_price * item.balance).toFixed(3)}
            </Text>
          </View>
          <View>
            {item.unrealized_pnl >= 0 && (
              <Text style={styles.text3}>
                +
                {((item.unrealized_pnl+item.realized_pnl)/item.price_bought).toFixed(2)}%
           
              </Text>
            )}
            {item.unrealized_pnl < 0 && (
              <Text style={styles.text4}>
              
                {((item.unrealized_pnl+item.realized_pnl)/item.price_bought).toFixed(2)}%
              </Text>
            )}
          </View>
        </View>
        <Icon
            name={'expand-more'}
            size={24}
            color={'#f0f0f0'}
            type="materialicons"
            onPress={() => navigation.goBack()}
          />
            <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', marginTop: 22 }}>
          <View style={{
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 35,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            width: '100%',
          }}>
            <Text style={{ marginBottom: 15, textAlign: 'center' }}>
              This is a modal!
            </Text>
            <Button title="Hide Modal" onPress={() => setModalVisible(!modalVisible)} />
          </View>
        </View>
      </Modal>
          </View>
      </View>
    </TouchableOpacity>
    
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    color: '#ffffff',
    fontFamily: `Satoshi-Bold`,
    fontWeight: '500',
  },
  text1: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Montreal-Bold',
    color: '#ffffff',
  },
  text2: {
    fontSize: 16,
    fontFamily: 'Unbounded-Bold',
    color: '#fff',
  },
  text3: {
    fontSize: 14,
    fontFamily: 'Unbounded-Medium',
    color: '#ADFF6C',
  },
  text4: {
    fontSize: 14,
    fontFamily: 'Unbounded-Medium',
    color: '#ff6c6c',
  },
  text5: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Montreal-Medium',
    color: '#787878',
  },
});

export default MyInvestmentItemCard;
