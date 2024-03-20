import React, {useState, useCallback} from 'react';
import {ScrollView, TouchableOpacity, View, Dimensions} from 'react-native';
import {Text, Icon, Image} from '@rneui/themed';
import styles from '../investment-styles';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import InvestmentChart from '../../../../component/charts/InvestmentChart';
import {useDispatch, useSelector} from 'react-redux';
import {setAssetMetadata} from '../../../../store/actions/market';

const MarketChart = props => {
  const [scwAddress, setScwAddress] = useState();
  const [state, setState] = useState();
  const [news, setNews] = useState([]);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const currentItem = props.item;
  const holdings = useSelector(x => x.portfolio.holdings);
  const currentAsset = holdings?.assets.filter(
    x => x.asset?.symbol.toLowerCase() === currentItem?.symbol.toLowerCase(),
  );
  const currentTimeFramePrice = useSelector(
    x => x.market.selectedTimeFramePriceInfo,
  );
  const fetchUserDetails = () => {
    if (global.withAuth) {
      authAddress = global.loginAccount.publicAddress;
      const scwAddress = global.loginAccount.scw;
      setScwAddress(scwAddress);
    } else {
      authAddress = global.connectAccount.publicAddress;
      const scwAddress = global.connectAccount.publicAddress;
      setScwAddress(scwAddress);
    }
  };

  const onFocusFunction = async () => {
    dispatch(setAssetMetadata(currentItem?.name));
  };

  useFocusEffect(
    useCallback(() => {
      async function onFocusFunction() {
        dispatch(setAssetMetadata(currentItem?.name));
      }
      onFocusFunction();
      fetchUserDetails();
      return () => {
        // Perform any clean-up tasks here, such as cancelling requests or clearing state
      };
    }, []),
  );
  console.log('current holdings', JSON.stringify(currentAsset));
  const {width, height} = Dimensions.get('window');
  return (
    <View style={{flex: 1}}>
      <ScrollView contentContainerStyle={{minHeight: height, minWidth: width}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
          }}>
          <Icon
            name={'navigate-before'}
            size={30}
            color={'#f0f0f0'}
            type="materialicons"
            onPress={() => navigation.goBack()}
            style={{marginLeft: 20}}
          />
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={styles.stockHead}>{currentItem?.name}</Text>
          </View>
        </View>

        <View style={styles.coinChart}>
          <View style={styles.chartContainer}>
            {/* <TradingViewChart width={screenWidth} height={300} /> */}
            <InvestmentChart assetName={currentItem?.name} />
          </View>
        </View>
        <TouchableOpacity
          style={{
            paddingHorizontal: '5%',
            marginTop: '8%',
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View>
            <Text
              style={{
                color: '#747474',
                fontFamily: 'Montreal-Bold',
                fontSize: 16,
              }}>
              Amount owned
            </Text>
            <Text
              style={{
                color: '#F0F0F0',
                fontSize: 24,
                fontFamily: `Unbounded-Bold`,
                marginTop: '2%',
              }}>
              $ {currentAsset?.[0]?.estimated_balance?.toFixed(2) ?? 0.0}
            </Text>
            <Text
              style={{
                color: '#747474',
                fontFamily: 'Unbounded-ExtraBold',
                textTransform: 'uppercase',
                fontSize: 14,
              }}>
              {currentAsset?.[0]?.token_balance?.toFixed(6) ?? 0.0}
              {` ${currentItem.symbol}`}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          height: 52,
          width: '100%',
          borderRadius: 6,
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          marginTop: '30%',
          position: 'absolute',
          bottom: 60, // Adjust the bottom spacing as needed
          left: 0,
          right: 0,
        }}
        onPress={() => {
          // if (holdings) {
          navigation.navigate('TradePage', {
            state: currentItem,
            asset: currentAsset,
          });
          // }
        }}>
        <LinearGradient
          useAngle={true}
          angle={150}
          colors={['#fff', '#fff']}
          style={{
            width: '100%',
            borderRadius: 100,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: '#000',
              fontSize: 14,
              fontFamily: 'Unbounded-ExtraBold',
            }}>
            TRADE {currentItem.symbol.toUpperCase()}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const ReadMoreLess = ({text, maxChars}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const displayText = isExpanded ? text : `${text.slice(0, maxChars)}`;

  return (
    <View>
      <Text style={{margin: 0, marginTop: 10, marginBottom: 8, color: 'white'}}>
        {displayText}
      </Text>
      {text.length > maxChars && (
        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
          <Text
            style={{
              color: '#4F9CD9',
              fontWeight: 'bold',
              fontSize: 12,
              cursor: 'pointer',
            }}>
            {isExpanded ? 'Read Less' : 'Read More'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default MarketChart;
