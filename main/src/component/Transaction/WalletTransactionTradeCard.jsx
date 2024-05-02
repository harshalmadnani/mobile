import {StyleSheet, View, Text, Image} from 'react-native';
import moment from 'moment';

const WalletTransactionTradeCard = ({item}) => {
  const mainSwapToken = item?.lifiExplorerLink
    ? item?.sending?.token?.symbol === 'USDC'
      ? item?.receiving
      : item?.sending
    : item?.giveOfferWithMetadata?.metadata?.symbol === 'USDC'
    ? item?.takeOfferWithMetadata
    : item?.giveOfferWithMetadata;
  const secondarySwapToken = item?.lifiExplorerLink
    ? item?.sending?.token?.symbol === 'USDC'
      ? item?.sending
      : item?.receiving
    : item?.giveOfferWithMetadata?.metadata?.symbol === 'USDC'
    ? item?.giveOfferWithMetadata
    : item?.takeOfferWithMetadata;

  function formatCompactNumber(number) {
    if (number < 1000) {
      return parseFloat(number)?.toFixed(3);
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
  console.log(
    formatCompactNumber(
      secondarySwapToken?.amount?.stringValue ??
        secondarySwapToken?.amount /
          Math.pow(
            10,
            secondarySwapToken?.decimals ?? secondarySwapToken?.token?.decimals,
          ),
    ),

    'main swap token',
  );
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
        {mainSwapToken?.logoURI ?? mainSwapToken?.token?.logoURI ? (
          <Image
            style={{width: 42, height: 42}}
            source={{
              uri: `${mainSwapToken?.logoURI ?? mainSwapToken?.token?.logoURI}`,
            }}
          />
        ) : null}
        <View
          style={{
            marginLeft: '5%',
            alignSelf: 'center',
          }}>
          <Text style={styles.primaryTitle}>
            {`${
              item?.giveOfferWithMetadata?.metadata?.symbol === 'USDC' ||
              item?.sending?.token?.symbol === 'USDC'
                ? 'Bought'
                : 'Sold'
            } ${
              mainSwapToken?.metadata?.symbol ?? mainSwapToken?.token?.symbol
            }`}
          </Text>
          <Text
            style={{
              color: '#8e8e8e',
              fontSize: 14,
              fontFamily: 'NeueMontreal-Medium',
            }}>
            {moment
              .unix(item?.creationTimestamp ?? item?.sending?.timestamp)
              .format('MMM Do ')}{' '}
            {moment
              .unix(item?.creationTimestamp ?? item?.sending?.timestamp)
              .format('h:mm a')}
          </Text>
        </View>
      </View>

      <View style={{alignItems: 'flex-end'}}>
        <Text style={[styles.secondaryTitle, {color: '#07F70F', opacity: 1}]}>
          {'+ '}
          {formatCompactNumber(
            parseFloat(
              mainSwapToken?.amount?.stringValue ??
                mainSwapToken?.amount /
                  Math.pow(
                    10,
                    mainSwapToken?.decimals ?? mainSwapToken?.token?.decimals,
                  ),
            )?.toFixed(2),
          )}
          {` ${
            mainSwapToken?.metadata?.symbol?.substring(0, 7) ??
            mainSwapToken?.token?.symbol?.substring(0, 7)
          }`}
        </Text>
        <Text style={[styles.secondaryTitle, {opacity: 1}]}>
          {'- '}
          {formatCompactNumber(
            parseFloat(
              secondarySwapToken?.amount?.stringValue ??
                secondarySwapToken?.amount /
                  Math.pow(
                    10,
                    secondarySwapToken?.decimals ??
                      secondarySwapToken?.token?.decimals,
                  ),
            )?.toFixed(2),
          )}

          {` ${
            secondarySwapToken?.metadata?.symbol?.substring(0, 7) ??
            secondarySwapToken?.token?.symbol?.substring(0, 7)
          }`}
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
