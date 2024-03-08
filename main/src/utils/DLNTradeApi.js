import axios from 'axios';
import {ethers} from 'ethers';
import usdAbi from '../screens/loggedIn/payments/USDC.json';
import {
  getEthereumTransaction,
  getSmartAccountAddress,
  getUserAddressFromAuthCoreSDK,
  signAndSendBatchTransactionWithGasless,
} from './particleCoreSDK';
import BigNumber from 'bignumber.js';
const DLNBaseURL = 'https://api.dln.trade/v1.0/dln';
const tradeRoutes = {
  createOrder: '/order/create-tx',
  getWallets: 'wallet/portfolio',
};

export const getDLNTradeCreateBuyOrder = async (
  srcChainId,
  srcChainTokenIn,
  srcChainTokenInAmount,
  dstChainId,
  dstChainTokenOut,
) => {
  try {
    const response = await axios.get(
      `${DLNBaseURL}${tradeRoutes.createOrder}?srcChainId=${srcChainId}&srcChainTokenIn=${srcChainTokenIn}&srcChainTokenInAmount=${srcChainTokenInAmount}&dstChainId=${dstChainId}&dstChainTokenOut=${dstChainTokenOut}&dstChainTokenOutAmount=auto&prependOperatingExpenses=false`,
    );
    console.log('response from DLN api:', dstChainId);
    return response?.data;
  } catch (error) {
    console.log('error  from DLN api:', dstChainId, error);
    return null;
  }
};
const getChainIdOnChainName = chainName => {
  if (chainName === 'Ethereum') {
    return 1;
  } else if (chainName === 'BNB Smart Chain (BEP20)') {
    return 56;
  } else if (chainName === 'Polygon') {
    return 137;
  } else if (chainName === 'Avalanche C-Chain') {
    return 43114;
  }
};
export const getBestCrossSwapRateBuy = async (
  blockchains,
  contractAddress,
  value,
) => {
  let blockchainsContractAddress = blockchains.map((x, i) => {
    return {blockchains: blockchains[i], contractAddress: contractAddress[i]};
  });
  blockchainsContractAddress = blockchainsContractAddress.filter(
    x =>
      x.blockchains === 'Ethereum' ||
      x.blockchains === 'BNB Smart Chain (BEP20)' ||
      x.blockchains === 'Polygon' ||
      x.blockchains === 'Avalanche C-Chain',
  );

  const ratesOfDifferentChainOut = blockchainsContractAddress.map(async x => {
    console.log(
      'block chain to be called',
      getChainIdOnChainName(x?.blockchains),
    );
    const res = await getDLNTradeCreateBuyOrder(
      137,
      '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
      value,
      getChainIdOnChainName(x?.blockchains),
      x?.contractAddress,
    );
    return res;
  });
  let results = await Promise.all(ratesOfDifferentChainOut);
  // best rate calculation
  results = results.filter(x => x !== null);
  const bestTradingPrice = results.map(x => {
    return {
      fee: isNaN(
        parseInt(x?.estimation?.dstChainTokenOut?.amount) -
          parseInt(x?.estimation?.costsDetails?.[0]?.payload?.feeAmount),
      )
        ? 0
        : parseInt(x?.estimation?.dstChainTokenOut?.amount) -
          parseInt(x?.estimation?.costsDetails?.[0]?.payload?.feeAmount),
      chainId: x?.estimation?.dstChainTokenOut?.chainId,
    };
  });
  const bestPrice = Math.max(...bestTradingPrice.map(x => x.fee));
  results = results.filter(
    x =>
      x.estimation?.dstChainTokenOut?.chainId ===
      bestTradingPrice.filter(x => x.fee === bestPrice)[0]?.chainId,
  );
  if (results.length > 0) {
    console.log(
      'Best trading price',
      results[0]?.estimation?.dstChainTokenOut?.chainId,
      bestPrice,
      bestTradingPrice,
    );
    return results[0];
  } else {
    return [];
  }
};
export const getDLNTradeCreateBuyOrderTxn = async (
  srcChainId,
  srcChainTokenIn,
  srcChainTokenInAmount,
  dstChainId,
  dstChainTokenOut,
  dstChainTokenOutAmount,
) => {
  try {
    const eoaAddress = await getUserAddressFromAuthCoreSDK();
    const smartAccount = await getSmartAccountAddress(eoaAddress);
    const response = await axios.get(
      `${DLNBaseURL}${tradeRoutes.createOrder}?srcChainId=${srcChainId}&srcChainTokenIn=${srcChainTokenIn}&srcChainTokenInAmount=${srcChainTokenInAmount}&dstChainId=${dstChainId}&dstChainTokenOut=${dstChainTokenOut}&dstChainTokenOutAmount=${dstChainTokenOutAmount}&dstChainTokenOutRecipient=${smartAccount}&srcChainOrderAuthorityAddress=${smartAccount}&dstChainOrderAuthorityAddress=${smartAccount}&prependOperatingExpenses=false`,
    );
    return response?.data;
  } catch (error) {
    console.log('error  from DLN api:', error);
    return null;
  }
};
export const confirmDLNTransaction = async (amount, tokenAddress, txData) => {
  let txs = [];
  console.log('inside execution.......', amount, tokenAddress, txData);
  const eoaAddress = await getUserAddressFromAuthCoreSDK();
  const smartAccount = await getSmartAccountAddress(eoaAddress);
  console.log('smart contract address.......', smartAccount);
  const usdcAbi = new ethers.utils.Interface(usdAbi);
  const approveData = usdcAbi.encodeFunctionData('approve', [
    txData?.to,
    amount,
  ]);
  const approveTX = await getEthereumTransaction(
    smartAccount,
    tokenAddress,
    approveData,
    '0',
  );
  console.log('tx approval part', approveTX);
  txs.push(approveTX);

  const sendTX = await getEthereumTransaction(
    smartAccount,
    txData?.to,
    txData?.data,
    BigNumber(txData?.value).toString(16),
  );
  console.log('tx sendTX part', sendTX);
  txs.push(sendTX);
  const signature = await signAndSendBatchTransactionWithGasless(
    eoaAddress,
    smartAccount,
    txs,
  );
  console.log('Signature Signed...........', signature);
  if (signature) {
    console.log('Signature Signed confirmed...........', signature);
    return signature;
  } else {
    return false;
  }
};
export const getOrderIdFromDLNTxn = async hash => {
  try {
    const response = await axios.get(
      `https://stats-api.dln.trade/api/Transaction/${hash}/orderIds`,
    );
    console.log('response.........', response?.data?.orderIds);
  } catch (error) {}
};
export const getStatusFromDLNOrderId = async id => {
  try {
    const response = await axios.get(
      `https://stats-api.dln.trade/api/Order/${id}`,
    );
    console.log('response.........', response?.data?.state);
  } catch (error) {}
};
