import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {Dimensions, SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {useSelector} from 'react-redux';
import {BigNumber} from 'bignumber.js';
import LinearGradient from 'react-native-linear-gradient';

const SuccessTxComponent = ({ txQuoteInfo, normalAmount, tradeType, isStockTrade, stockInfo, isDLN }) => {
  const navigation = useNavigation();

  const getChainName = (chainId) => {
    switch (chainId) {
      case 1: return 'Ethereum';
      case 137: return 'Polygon';
      case 56: return 'Binance Smart Chain';
      case 42161: return 'Arbitrum';
      case 10: return 'Optimism';
      case 8453: return 'Base';
      case 43114: return 'Avalanche';
      case 250: return 'Fantom';
      case 42220: return 'Celo';
      case 1666600000: return 'Harmony';
      case 128: return 'Huobi ECO Chain';
      default: return 'Unknown Chain';
    }
  };

  const tokenSymbol = isDLN ? txQuoteInfo?.estimation?.dstChainTokenOut?.symbol : txQuoteInfo?.tokenTo?.symbol || 'Unknown';
  const tokenAmount = parseFloat(normalAmount).toFixed(6);

  const amountPaid = txQuoteInfo?.fromTokenAmount || '0';
  const amountPaidSymbol = txQuoteInfo?.tokenFrom?.symbol || 'Unknown';
  const amountPaidDecimals = txQuoteInfo?.tokenFrom?.decimals || 18;

  const formattedAmountPaid = isDLN
    ? parseFloat(txQuoteInfo?.estimation?.srcChainTokenIn?.amount) / Math.pow(10, txQuoteInfo?.estimation?.srcChainTokenIn?.decimals)
    : parseFloat(amountPaid) / Math.pow(10, amountPaidDecimals);

  // Determine if it's a cross-chain trade
  const isCrossChainTrade = txQuoteInfo?.tokenFrom?.chainId !== txQuoteInfo?.tokenTo?.chainId;

  // Get chain names for both source and destination chains
  let sourceChainName = getChainName(txQuoteInfo?.tokenFrom?.chainId);
  let destChainName = getChainName(txQuoteInfo?.tokenTo?.chainId);

  // DLN specific calculations
  let slippage, estimatedDelay;
  if (isDLN) {
    sourceChainName = getChainName(txQuoteInfo?.estimation?.srcChainTokenIn?.chainId);
    destChainName = getChainName(txQuoteInfo?.estimation?.dstChainTokenOut?.chainId);
    slippage = txQuoteInfo?.estimation?.recommendedSlippage || 0;
    estimatedDelay = txQuoteInfo?.order?.approximateFulfillmentDelay || 0;
  }

  // Calculate fee
  const fee = isCrossChainTrade 
    ? txQuoteInfo?.estimation?.gasCost || 0 
    : formattedAmountPaid * 0.002;
  const txFee = `${fee.toFixed(6)}`;

  // Calculate entry price
  const entryPrice = tradeType === 'buy' ? formattedAmountPaid / parseFloat(tokenAmount) : parseFloat(tokenAmount) / formattedAmountPaid;

  return (
    <View style={{ width: '100%' }}>
      <View style={{ justifyContent: 'flex-start' }}>
        <View style={{
          justifyContent: 'center',
          alignSelf: 'center',
          marginTop: '0%',
        }}>
          <Image
            source={require('../../../../../assets/success.png')}
            style={{ width: 200, height: 200 }}
          />
        </View>
        <Text style={{
          fontFamily: 'Unbounded-Bold',
          fontSize: 24,
          textAlign: 'center',
          marginTop: 24,
          color: '#fff',
        }}>
          {isStockTrade ? 'Order is Booked' : 'IT\'S A SUCCESS!'}
        </Text>
        <Text style={{
          fontFamily: 'Unbounded-Medium',
          fontSize: 14,
          textAlign: 'center',
          marginTop: 24,
          color: '#949494',
        }}>
          You have successfully placed a {isStockTrade ? 'placed order for' : tradeType === 'buy' ? `buy order` : `sell order`} for {tokenAmount} {tokenSymbol} by {tradeType === 'buy' ? `paying $${formattedAmountPaid.toFixed(6)}` : `selling ${formattedAmountPaid.toFixed(6)} ${amountPaidSymbol}`}
        </Text>
      
      </View>
      <View style={{ marginTop: '15%' }}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <LinearGradient
            colors={['#000', '#191919', '#fff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ height: 2, width: '80%' }}
          />
        </View>
        <View style={{
          justifyContent: 'flex-start',
          marginVertical: '5%',
          paddingHorizontal: '8%',
        }}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Entry Price:</Text>
            <Text style={styles.infoValue}>${entryPrice.toFixed(6)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Estimated Fees:</Text>
            <Text style={styles.infoValue}>${txFee}</Text>
          </View>
          {isDLN && (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Estimated Time:</Text>
                <Text style={styles.infoValue}>{estimatedDelay}s</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Chain:</Text>
                <Text style={styles.infoValue}>{destChainName}</Text>
              </View>
            </>
          )}
          {!isDLN && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Chain:</Text>
              <Text style={styles.infoValue}>{sourceChainName}</Text>
            </View>
          )}
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <LinearGradient
            colors={['#fff', '#191919', '#000']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ height: 2, width: '80%' }}
          />
        </View>
      </View>
      <TouchableOpacity
        style={{
          height: 50,
          backgroundColor: 'white',
          width: '90%',
          borderRadius: 16,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          marginTop: '20%',
        }}
        onPress={() => navigation.navigate('Portfolio')}
      >
        <Text style={{
          fontSize: 14,
          letterSpacing: 0.2,
          fontFamily: 'Unbounded-Bold',
          color: '#000',
          textAlign: 'center',
        }}>
          GO BACK
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingVertical: '5%',
  },
  contentContainer: {
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: '6%',
    fontWeight: 'bold',
    marginBottom: '5%',
  },
  successMessage: {
    color: '#fff',
    fontSize: '4%',
    textAlign: 'center',
    marginBottom: '5%',
  },
  text: {
    color: '#fff',
    fontSize: '4.5%',
    marginBottom: '2.5%',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: '3%',
    paddingHorizontal: '6%',
    borderRadius: '2%',
    marginTop: '5%',
  },
  buttonText: {
    color: '#000',
    fontSize: '4.5%',
    fontWeight: 'bold',
  },
  successImage: {
    width: 100,
    height: 100,
    marginBottom: '5%',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '2%',
    marginBottom: '4%',
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'NeueMontreal-Medium',
    alignSelf: 'flex-start',
    color: '#fff',
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Unbounded-Medium',
    alignSelf: 'flex-end',
    color: '#fff',
  },
});

const PendingTxStatusPage = ({route}) => {
  const {state, tradeType, isStockTrade, stockInfo} = route.params;
  const txQuoteInfo = state;

  console.log('DLN Quote Info:', JSON.stringify(txQuoteInfo, null, 2));

  const exchRate = useSelector(x => x.auth.exchRate);

  const weiAmount = new BigNumber(
    txQuoteInfo?.estimation?.dstChainTokenOut?.amount ||
      txQuoteInfo?.estimate?.toAmountMin ||
      txQuoteInfo?.transactionData?.info?.amountOutMin,
  );

  const normalAmount = weiAmount
    .div(
      10 **
        (txQuoteInfo?.estimation?.dstChainTokenOut?.decimals ||
          txQuoteInfo?.action?.toToken?.decimals ||
          txQuoteInfo?.tokenTo?.decimals),
    )
    .toNumber();

  const isDLN = txQuoteInfo?.estimation?.srcChainTokenIn?.chainId !== txQuoteInfo?.estimation?.dstChainTokenOut?.chainId;

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#000',
        paddingBottom: '5%',
        marginBottom:'5%',
        flex: 1,
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <SuccessTxComponent
        txQuoteInfo={txQuoteInfo}
        normalAmount={normalAmount}
        tradeType={tradeType}
        isStockTrade={isStockTrade}
        stockInfo={stockInfo}
        isDLN={isDLN}
      />
    </SafeAreaView>
  );
};

export default PendingTxStatusPage;