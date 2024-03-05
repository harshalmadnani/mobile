import axios from 'axios';
import {ethers} from 'ethers';
import usdAbi from '../screens/loggedIn/payments/USDC.json';
import {
  getEthereumTransaction,
  getSmartAccountAddress,
  getUserAddressFromAuthCoreSDK,
  signAndSendBatchTransactionWithGasless,
} from './particleCoreSDK';
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
    console.log(
      'URL========',
      `${DLNBaseURL}${tradeRoutes.createOrder}?srcChainId=${srcChainId}&srcChainTokenIn=${srcChainTokenIn}&srcChainTokenInAmount=${srcChainTokenInAmount}&dstChainId=${dstChainId}&dstChainTokenOut=${dstChainTokenOut}&dstChainTokenOutAmount=auto&prependOperatingExpenses=false`,
    );
    const response = await axios.get(
      `${DLNBaseURL}${tradeRoutes.createOrder}?srcChainId=${srcChainId}&srcChainTokenIn=${srcChainTokenIn}&srcChainTokenInAmount=${srcChainTokenInAmount}&dstChainId=${dstChainId}&dstChainTokenOut=${dstChainTokenOut}&dstChainTokenOutAmount=auto&prependOperatingExpenses=false`,
    );
    console.log(
      'response from DLN api:',
      response?.data?.estimation?.dstChainTokenOut,
    );
    return response?.data;
  } catch (error) {
    console.log('error  from DLN api:', error);
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
export const getBestCrossSwapRate = async (
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
  console.log(
    'txn quote results:::::::',
    JSON.stringify(results.filter(x => x !== null)[0]),
  );
  return results.filter(x => x !== null)[0];
};
export const getDLNTradeCreateBuyOrderTxn = async (
  srcChainId,
  srcChainTokenIn,
  srcChainTokenInAmount,
  dstChainId,
  dstChainTokenOut,
  dstChainTokenOutAmount,
  authorityAddress,
) => {
  try {
    const eoaAddress = await getUserAddressFromAuthCoreSDK();
    const smartAccount = await getSmartAccountAddress(eoaAddress);
    console.log(
      'URL========',
      `${DLNBaseURL}${tradeRoutes.createOrder}?srcChainId=${srcChainId}&srcChainTokenIn=${srcChainTokenIn}&srcChainTokenInAmount=${srcChainTokenInAmount}&dstChainId=${dstChainId}&dstChainTokenOut=${dstChainTokenOut}&dstChainTokenOutAmount=${dstChainTokenOutAmount}&dstChainTokenOutRecipient=${smartAccount}&srcChainOrderAuthorityAddress=${smartAccount}&dstChainOrderAuthorityAddress=${smartAccount}&prependOperatingExpenses=false`,
    );
    const response = await axios.get(
      `${DLNBaseURL}${tradeRoutes.createOrder}?srcChainId=${srcChainId}&srcChainTokenIn=${srcChainTokenIn}&srcChainTokenInAmount=${srcChainTokenInAmount}&dstChainId=${dstChainId}&dstChainTokenOut=${dstChainTokenOut}&dstChainTokenOutAmount=${dstChainTokenOutAmount}&dstChainTokenOutRecipient=${smartAccount}&srcChainOrderAuthorityAddress=${smartAccount}&dstChainOrderAuthorityAddress=${smartAccount}&prependOperatingExpenses=false`,
    );
    console.log('response from DLN api tx:', JSON.stringify(response?.data));
    return response?.data;
  } catch (error) {
    console.log('error  from DLN api:', error);
    return null;
  }
};
export const confirmDLNTransaction = async (amount, tokenAddress, txData) => {
  let txs = [];
  const eoaAddress = await getUserAddressFromAuthCoreSDK();
  const smartAccount = await getSmartAccountAddress(eoaAddress);
  console.log(
    'address .......... tx daata',
    eoaAddress,
    smartAccount,
    amount,
    tokenAddress,
    txData,
  );
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
    txData?.value,
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
    console.log('Signature Signed confirmwd...........', signature);
    // const signature2 = await signAndSendBatchTransactionWithGasless(
    //   eoaAddress,
    //   smartAccount,
    //   [txs[1]],
    // );
    // console.log('Signature Signed confirmwd...........', signature2);
    // return {
    //   status: true,
    //   fees: null,
    // };
  } else {
    // return {
    //   status: false,
    //   fees: JSON.stringify('fail'),
    // };
  }
};
