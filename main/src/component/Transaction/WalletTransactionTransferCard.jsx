import {StyleSheet, View, Text, Image} from 'react-native';
import moment from 'moment';

const WalletTransactionTransferCard = ({item}) => {
  console.log('inside card', item);
  const mainSwapToken =
    item?.giveOfferWithMetadata?.metadata?.symbol === 'USDC'
      ? item?.takeOfferWithMetadata
      : item?.giveOfferWithMetadata;
  const secondarySwapToken =
    item?.giveOfferWithMetadata?.metadata?.symbol === 'USDC'
      ? item?.giveOfferWithMetadata
      : item?.takeOfferWithMetadata;

  function formatCompactNumber(number) {
    if (number < 1000) {
      return number;
    } else if (number >= 1000 && number < 1000000) {
      return (number / 1000)?.toFixed(1) + 'K';
    } else if (number >= 1000000 && number < 1000000000) {
      return (number / 1000000)?.toFixed(1) + 'M';
    } else if (number >= 1000000000 && number < 1000000000000) {
      return (number / 1000000000)?.toFixed(1) + 'B';
    } else if (number >= 1000000000000 && number < 1000000000000000) {
      return (number / 1000000000000)?.toFixed(1) + 'T';
    }
  }
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#000',
        width: '98%',
        borderRadius: 12,
        marginVertical: '2%',
        paddingHorizontal: 8,
        paddingVertical: 18,
        marginBottom: '0%',
        marginVertical: '5%',
        alignSelf: 'center',
        marginHorizontal: '2%',
      }}>
      <View
        style={{
          flexDirection: 'row',
        }}>
        <Image
          style={{width: 50, height: 50}}
          source={{
            uri: `${item?.asset?.logo}`,
          }}
        />
        <View
          style={{
            marginLeft: '3%',
            alignSelf:'center'
          }}>
          <Text style={styles.primaryTitle}>
          {item?.type === 'buy'
              ? ` ${item?.from?.substr(0, 6)}....${item?.from?.substr(-3)}`
              : `${item?.to?.substr(0, 4)}....${item?.to?.substr(-4)}`}
          </Text>
          <Text style={{fontFamily:'NeueMontreal-Medium',color:'#8e8e8e'}}>
          {moment.unix(item?.creationTimestamp).format('h:mm a')}
          </Text>
        </View>
      </View>
      <View></View>
      <View style={{alignItems: 'flex-end'}}>
        {item?.type === 'buy' ? (
          <View>
          <Text style={[styles.secondaryTitle, {color: '#fff', opacity: 1,alignSelf:'flex-end'}]}>
            {/* - {formatCompactNumber(item?.amount)?.toFixed(2)} USDC */}
            +{item?.amount} USD
          </Text>
            <Text style={[styles.secondaryTitle, {color: '#62FFA1', opacity: 1,fontFamily:'NeueMontreal-Medium',alignSelf:'flex-end'}]}>
           Added
          </Text>
          </View>
          
        ) : (
          <View>
          <Text style={[styles.secondaryTitle, {color: '#fff', opacity: 1,alignSelf:'flex-end'}]}>
            {/* - {formatCompactNumber(item?.amount)?.toFixed(2)} USDC */}
            -{item?.amount} USD
          </Text>
            <Text style={[styles.secondaryTitle, {color: '#FFB762', opacity: 1,fontFamily:'NeueMontreal-Medium',alignSelf:'flex-end'}]}>
           Withdrawn
          </Text>
          </View>
        )}
       
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  primaryTitle: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Unbounded-Bold',
    color: '#ffffff',
  },
  secondaryTitle: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.5,
    fontFamily: 'Unbounded-Regular',
    color: '#ffffff',
  
  },
});

export default WalletTransactionTransferCard;
