import {StyleSheet, View, Text, Image} from 'react-native';
import moment from 'moment';

const WalletTransactionTradeCard = ({item}) => {
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
    } else {
      return null;
    }
  }
  console.log(mainSwapToken?.amount?.stringValue, 'main swap token');
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#000',
        width: '90%',
        borderRadius: 12,
        marginVertical: '2%',
        paddingHorizontal: '2%',
        paddingVertical: '5%',
        marginBottom: '0%',
        marginVertical: '2%',
        alignSelf: 'center',
        marginHorizontal: '10%',
      }}>
      <View
        style={{
          flexDirection: 'row',
        }}>
        <Image
          style={{width: 42, height: 42}}
          source={{
            uri: `${mainSwapToken.logoURI}`,
          }}
        />
        <View
          style={{
            marginLeft: '5%',
            alignSelf:'center'
          }}>
          <Text style={styles.primaryTitle}>
            {`${
              item?.giveOfferWithMetadata?.metadata?.symbol === 'USDC'
                ? 'Bought'
                : 'Sold'
            } ${mainSwapToken?.metadata?.symbol}`}
          </Text>
          <Text style={{color:'#8e8e8e',fontSize:14,fontFamily:'NeueMontreal-Medium'}}>
          {moment.unix(item?.creationTimestamp).format('MMM Do ')} {moment.unix(item?.creationTimestamp).format('h:mm a')
}
          </Text>
        </View>
      </View>

      <View style={{alignItems: 'flex-end'}}>
        <Text style={[styles.secondaryTitle, {color: '#07F70F', opacity: 1}]}>
          {'+ '}
          {(
            mainSwapToken?.amount?.stringValue /
            Math.pow(10, mainSwapToken?.decimals)
          )?.toFixed(2)}
          {` ${mainSwapToken?.metadata?.symbol?.substring(0, 7)}`}
        </Text>
        <Text style={[styles.secondaryTitle, {opacity: 1}]}>
          {'- '}
          {formatCompactNumber(
            secondarySwapToken?.amount?.stringValue /
              Math.pow(10, secondarySwapToken?.decimals),
          )?.toFixed(2)}

          {` ${secondarySwapToken?.metadata?.symbol?.substring(0, 7)}`}
        </Text>
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
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.5,
    fontFamily: 'Unbounded-Regular',
    color: '#ffffff',
  },
});

export default WalletTransactionTradeCard;
