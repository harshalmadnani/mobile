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
      return (number / 1000).toFixed(1) + 'K';
    } else if (number >= 1000000 && number < 1000000000) {
      return (number / 1000000).toFixed(1) + 'M';
    } else if (number >= 1000000000 && number < 1000000000000) {
      return (number / 1000000000).toFixed(1) + 'B';
    } else if (number >= 1000000000000 && number < 1000000000000000) {
      return (number / 1000000000000).toFixed(1) + 'T';
    }
  }
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#161B22',
        width: '98%',
        borderRadius: 12,
        marginVertical: '2%',
        paddingHorizontal: 8,
        paddingVertical: 18,
        marginBottom: '0%',
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
            marginLeft: 8,
          }}>
          <Text style={styles.primaryTitle}>
            {item?.type === 'buy' ? 'Received' : 'Sent'}
          </Text>
          <Text style={styles.secondaryTitle}>
            {item?.type === 'buy'
              ? `from ${item?.from?.substr(0, 4)}....${item?.from?.substr(-4)}`
              : `to ${item?.to?.substr(0, 4)}....${item?.to?.substr(-4)}`}
          </Text>
        </View>
      </View>

      <View style={{alignItems: 'flex-end'}}>
        {item?.type === 'buy' ? (
          <Text style={[styles.secondaryTitle, {color: '#07F70F', opacity: 1}]}>
            + {formatCompactNumber(item?.amount)?.toFixed(2)} USDC
          </Text>
        ) : (
          <Text style={[styles.secondaryTitle, {color: '#fff', opacity: 1}]}>
            - {formatCompactNumber(item?.amount)?.toFixed(2)} USDC
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  primaryTitle: {
    fontSize: 16,
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
