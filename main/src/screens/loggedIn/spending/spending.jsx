import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import WebView from 'react-native-webview';
import CouponModal from '../../../component/CouponModal';
import {useDispatch, useSelector} from 'react-redux';
import {fetchOnboardedUser, getCountryBasedGiftCard} from '../../../store/actions/offRamp';
const Spending = () => {
  const url = 'https://sandbox.encryptus.co/v1/partners/create/user';
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const email = useSelector(x => x.auth.email);
  const enterUserForCoupon = async () => {
    await dispatch(fetchOnboardedUser(email));
    await dispatch(getCountryBasedGiftCard());
  };
  const closeWebView = () => {
    setShowWebView(false);
  };
  const ImageTextRow = () => {
    return (
      <View style={styles.row}>
        <Image
          source={{
            uri: 'https://res.cloudinary.com/xade-finance/image/upload/v1712667639/n6bg9u0bn6jixqk8utlr.png',
          }}
          style={styles.imageStyle}
        />
        <View style={styles.textContainer}>
          <Text style={styles.firstLine}>First Line of Text</Text>
          <Text style={styles.secondLine}>Second Line of Text</Text>
        </View>
      </View>
    );
  };
  const data = {
    email: global?.loginAccount?.phoneEmail,
  };
  const [showWebView, setShowWebView] = useState(false);
  // console.log(data);
  // fetch(url, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(data),
  // })
  //   .then(response => {
  //     if (response.ok) {
  //       return response.json();
  //     }
  //     throw new Error('Network response was not ok.');
  //   })
  //   .then(data => console.log(data))
  //   .catch(error => console.error('Error:', error));
  const [couponModal, setCouponModal] = useState(false);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
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
          SPENDING
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
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Image
          source={{
            uri: 'https://res.cloudinary.com/xade-finance/image/upload/v1712760320/rnpptbg911dxaayttvca.png',
          }}
          style={{width: 280, height: 280, marginTop: '10%'}}
        />
      </View>
      <View
        style={{
          alignSelf: 'flex-start',
          marginLeft: '5%',
          justifyContent: 'flex-end',
          marginBottom: '-50%',
          flex: 1,
        }}>
        <View style={styles.row}>
          <Image
            source={{
              uri: 'https://res.cloudinary.com/xade-finance/image/upload/v1712759373/kpsqcixtiabwkferzpri.png',
            }}
            style={styles.imageStyle}
          />
          <View style={styles.textContainer}>
            <Text style={styles.firstLine}>Available globally</Text>
            <Text style={styles.secondLine}>
              Available across 98+ countries to spend with no limits
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <Image
            source={{
              uri: 'https://res.cloudinary.com/xade-finance/image/upload/v1712760002/i8kosnd5t1biiuhe3sg8.png',
            }}
            style={styles.imageStyle}
          />
          <View style={styles.textContainer}>
            <Text style={styles.firstLine}>Spend across 1000+ brands</Text>
            <Text style={styles.secondLine}>
              Buy giftcards in a single click with no document upload
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <Image
            source={{
              uri: 'https://res.cloudinary.com/xade-finance/image/upload/v1712759983/s81pfoh8z7pcmnfawqyy.png',
            }}
            style={styles.imageStyle}
          />
          <View style={styles.textContainer}>
            <Text style={styles.firstLine}>Get your own personalised card</Text>
            <Text style={styles.secondLine}>
              Get your own customisable virtual or physical metal card{' '}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          marginBottom: '1%',
          paddingHorizontal: '1%',
        }}>
        <TouchableOpacity
          onPress={async () => {
            await enterUserForCoupon();

            // setCouponModal(true);
          }}
          style={{
            backgroundColor: '#fff',
            paddingVertical: '5%',
            borderRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.23,
            shadowRadius: 2.62,
            alignSelf: 'stretch',
          }}>
          <Text
            style={{
              fontSize: 16,
              color: 'black',
              fontFamily: 'Unbounded-Bold',
            }}>
            START SPENDING
          </Text>
        </TouchableOpacity>
      </View>
      <CouponModal
        modalVisible={couponModal}
        setModalVisible={setCouponModal}
        value={5000}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: '2%',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    alignSelf: 'stretch',
  },
  buttonText: {
    fontSize: 14,
    color: 'black',
    fontFamily: 'Unbounded-Bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15, // Add spacing between rows
  },
  imageStyle: {
    width: 50, // Adjust the size as needed
    height: 50, // Adjust the size as needed
    marginRight: 10,
  },
  textContainer: {
    flexDirection: 'column',
  },
  firstLine: {
    fontSize: 16,
    color: 'white',
    marginBottom: 4, // Spacing between the two lines of text
  },
  secondLine: {
    fontSize: 12,
    color: '#969696',
    width: '80%',
  },
  // ... rest of your styles ...
});
export default Spending;
