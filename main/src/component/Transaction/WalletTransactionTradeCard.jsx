import { StyleSheet, View, Text, Image } from 'react-native';
import moment from 'moment';

const WalletTransactionTradeCard = ({ item }) => {
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
          style={{ width: 50, height: 50 }}
          source={{
            uri: `${mainSwapToken.logoURI}`,
          }}
        />
        <View
          style={{
            marginLeft: 8,
          }}>
          <Text style={styles.primaryTitle}>
            {`${item?.giveOfferWithMetadata?.metadata?.symbol === 'USDC'
              ? 'Bought'
              : 'Sold'
              } ${mainSwapToken?.metadata?.symbol}`}
          </Text>
          <Text style={styles.secondaryTitle}>
            {moment.unix(item?.creationTimestamp).format('MMM Do YY')}
          </Text>
        </View>
      </View>

      <View style={{ alignItems: 'flex-end' }}>
        <Text style={[styles.secondaryTitle, { color: '#07F70F', opacity: 1 }]}>
          {'+ '}

          {` ${mainSwapToken?.metadata?.symbol?.substring(0, 7)}`}
        </Text>
        <Text style={[styles.secondaryTitle, { opacity: 1 }]}>
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

export default WalletTransactionTradeCard;
