import axios from 'axios';
import {ethers} from 'ethers';
import erc20 from '../screens/loggedIn/payments/USDC.json';
import ProxyDLNAbi from './abis/ProxyDLNAbi.json';
import {
  getEthereumTransaction,
  signAndSendBatchTransactionWithGasless,
} from './particleCoreSDK';
import {getRouteFromSquid} from './SquidCrossChainTradeApi';
import {getSmartAccountAddress, tradeTokenGasless} from './DFNS/walletFLow';
const DLNBaseURL = 'https://api.dln.trade/v1.0/dln';
const tradeRoutes = {
  createOrder: '/order/create-tx',
  getWallets: 'wallet/portfolio',
};
export const getUSDCTokenOnChain = chainName => {
  if (chainName === 1) {
    return null;
  } else if (chainName === 137) {
    return '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359';
  } else if (chainName === 56) {
    return '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d';
  } else if (chainName === 43114) {
    return '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E';
  } else if (chainName === 42161) {
    return '0xaf88d065e77c8cC2239327C5EDb3A432268e5831';
  }
};
export const getXadeFeePayerAddressOnChain = chainName => {
  if (chainName === 1) {
    return null;
  } else if (chainName === 137) {
    return '0xd1cb82a4d5c9086a2a7fdeef24fdb1c0a55bba58';
  } else if (chainName === 56) {
    return '0xc5acad1d0b4e22f60083c0575e8b15220c00ecdf';
  } else if (chainName === 43114) {
    return '0xAE7E2dB2146a5cdEd4a5A40E3901f371fC57540e';
  } else if (chainName === 42161) {
    return '0xAE7E2dB2146a5cdEd4a5A40E3901f371fC57540e';
  }
};
export const getDLNTradeCreateBuyOrder = async (
  srcChainId,
  srcChainTokenIn,
  srcChainTokenInAmount,
  dstChainId,
  dstChainTokenOut,
  smartAccount,
  isLifi = false,
) => {
  try {
    let response;
    if (dstChainId === srcChainId && !isLifi) {
      console.log('buy same chain............>');
      response = await getQuoteFromUnizen(
        srcChainId,
        dstChainId,
        srcChainTokenIn === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
          ? '0x0000000000000000000000000000000000000000'
          : srcChainTokenIn,
        dstChainTokenOut === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
          ? '0x0000000000000000000000000000000000000000'
          : dstChainTokenOut,
        srcChainTokenInAmount,
        smartAccount,
      );
      console.log('unizen trade.....', JSON.stringify(response));
    } else if (dstChainId === srcChainId && isLifi) {
      response = await getQuoteFromLifi(
        srcChainId,
        dstChainId,
        srcChainTokenIn === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
          ? '0x0000000000000000000000000000000000000000'
          : srcChainTokenIn,
        dstChainTokenOut === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
          ? '0x0000000000000000000000000000000000000000'
          : dstChainTokenOut,
        srcChainTokenInAmount,
        smartAccount,
      );
      console.log('lifi.....', JSON.stringify(response?.data));
    } else {
      response = await axios.get(
        `${DLNBaseURL}${
          tradeRoutes.createOrder
        }?srcChainId=${srcChainId}&srcChainTokenIn=${
          srcChainTokenIn === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
            ? '0x0000000000000000000000000000000000000000'
            : srcChainTokenIn
        }&srcChainTokenInAmount=${srcChainTokenInAmount}&dstChainId=${dstChainId}&dstChainTokenOut=${
          dstChainTokenOut === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
            ? '0x0000000000000000000000000000000000000000'
            : dstChainTokenOut
        }&dstChainTokenOutAmount=auto&prependOperatingExpenses=false&referralCode=8002&affiliateFeePercent=0.15&affiliateFeeRecipient=0xA4f5C2781DA48d196fCbBD09c08AA525522b3699`,
      );
    }
    return response?.data ?? response;
  } catch (error) {
    console.log(
      'error from Trade Quote api:',
      `${DLNBaseURL}${
        tradeRoutes.createOrder
      }?srcChainId=${srcChainId}&srcChainTokenIn=${
        srcChainTokenIn === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
          ? '0x0000000000000000000000000000000000000000'
          : srcChainTokenIn
      }&srcChainTokenInAmount=${srcChainTokenInAmount}&dstChainId=${dstChainId}&dstChainTokenOut=${
        dstChainTokenOut === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
          ? '0x0000000000000000000000000000000000000000'
          : dstChainTokenOut
      }&dstChainTokenOutAmount=auto&prependOperatingExpenses=false&referralCode=8002&affiliateFeePercent=0.15&affiliateFeeRecipient=0xA4f5C2781DA48d196fCbBD09c08AA525522b3699`,
      dstChainId,
      srcChainId,
      error.response?.data,
    );
    return null;
  }
};
export const getDLNTradeCreateSellOrder = async (
  srcChainId,
  srcChainTokenIn,
  srcChainTokenInAmount,
  dstChainId,
  dstChainTokenOut,
  smartAccount,
) => {
  try {
    let response;
    if (dstChainId === srcChainId) {
      response = await getQuoteFromLifi(
        srcChainId,
        dstChainId,
        srcChainTokenIn === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
          ? '0x0000000000000000000000000000000000000000'
          : srcChainTokenIn,
        dstChainTokenOut === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
          ? '0x0000000000000000000000000000000000000000'
          : dstChainTokenOut,
        srcChainTokenInAmount,
        smartAccount,
      );
    } else {
      response = await getRouteFromSquid(
        smartAccount,
        srcChainId,
        srcChainTokenIn === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
          ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
          : srcChainTokenIn,
        srcChainTokenInAmount,
        dstChainId,
        dstChainTokenOut === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
          ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
          : dstChainTokenOut,
        smartAccount,
        1,
        1,
        false,
      );
    }
    return response?.data;
  } catch (error) {
    console.log(
      'error from Trade Quote api:',
      dstChainId,
      srcChainId,
      error.response?.data,
    );
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
  } else if (chainName === 'Arbitrum') {
    return 42161;
  } else if (chainName === 'Base') {
    return 8453;
  }
};
export const getBestCrossSwapRateBuy = async (
  blockchains,
  contractAddress,
  value,
  smartAccount,
) => {
  let blockchainsContractAddress = blockchains.map((x, i) => {
    return {blockchains: blockchains[i], contractAddress: contractAddress[i]};
  });

  blockchainsContractAddress = blockchainsContractAddress.filter(
    x =>
      x.blockchains === 'Ethereum' ||
      x.blockchains === 'BNB Smart Chain (BEP20)' ||
      x.blockchains === 'Polygon' ||
      x.blockchains === 'Base' ||
      x.blockchains === 'Arbitrum',
  );

  const ratesOfDifferentChainOut = blockchainsContractAddress.map(async x => {
    const res = await getDLNTradeCreateBuyOrder(
      137,
      '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
      value,
      getChainIdOnChainName(x?.blockchains),
      x?.contractAddress,
      smartAccount,
    );
    return res;
  });
  let results = await Promise.all(ratesOfDifferentChainOut);
  console.log('trade......', results);
  // const listOfRoutes = [];
  // best rate calculation
  results = results.filter(x => x !== null);
  const bestTradingPrice = results.map(x => {
    return {
      fee: isNaN(
        parseInt(
          x?.estimation?.dstChainTokenOut?.amount ||
            x?.estimate?.toAmountMin ||
            x?.transactionData?.info?.amountOutMin,
        ),
      )
        ? 0
        : parseInt(
            x?.estimation?.dstChainTokenOut?.amount ||
              x?.estimate?.toAmountMin ||
              x?.transactionData?.info?.amountOutMin,
          ),
      estimation: x?.estimation ?? x,
      chainId: x?.estimation?.dstChainTokenOut?.chainId || 137,
    };
  });
  console.log('trade list........', bestTradingPrice);
  const bestPrice = Math.max(...bestTradingPrice.map(x => x.fee));

  results =
    bestTradingPrice.filter(x => x.fee === bestPrice)[0]?.chainId === 137
      ? results
      : results.filter(
          x =>
            x?.estimation?.dstChainTokenOut?.chainId ===
            bestTradingPrice.filter(x => x.fee === bestPrice)[0]?.chainId,
        );
  console.log('after filter', results);
  if (results.length > 0) {
    return {
      bestRate: results[0],
      allRates: [
        {
          fee: isNaN(
            parseInt(
              results[0]?.estimation?.dstChainTokenOut?.amount ||
                results[0]?.estimate?.toAmountMin ||
                results[0]?.transactionData?.info?.amountOutMin,
            ),
          )
            ? 0
            : parseInt(
                results[0]?.estimation?.dstChainTokenOut?.amount ||
                  results[0]?.estimate?.toAmountMin ||
                  results[0]?.transactionData?.info?.amountOutMin,
              ),
          estimation:
            results[0]?.estimation ?? results[0]?.estimate ?? results[0],
          chainId: results[0]?.estimation?.dstChainTokenOut?.chainId || 137,
        },
      ],
    };
  } else {
    return {};
  }
};

export const getDLNTradeCreateBuyOrderTxn = async (
  srcChainId,
  srcChainTokenIn,
  srcChainTokenInAmount,
  dstChainId,
  dstChainTokenOut,
  dstChainTokenOutAmount,
  smartAccountSrc,
  smartAccountDst,
) => {
  try {
    let response;
    if (dstChainId === srcChainId) {
      // same chain
    } else {
      response = await axios.get(
        `${DLNBaseURL}${
          tradeRoutes.createOrder
        }?srcChainId=${srcChainId}&srcChainTokenIn=${
          srcChainTokenIn === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
            ? '0x0000000000000000000000000000000000000000'
            : srcChainTokenIn
        }&srcChainTokenInAmount=${srcChainTokenInAmount}&dstChainId=${dstChainId}&dstChainTokenOut=${
          dstChainTokenOut === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
            ? '0x0000000000000000000000000000000000000000'
            : dstChainTokenOut
        }&dstChainTokenOutAmount=${dstChainTokenOutAmount}&dstChainTokenOutRecipient=${smartAccountDst}&srcChainOrderAuthorityAddress=${smartAccountSrc}&dstChainOrderAuthorityAddress=${smartAccountSrc}&prependOperatingExpenses=false&referralCode=8002&affiliateFeePercent=0.15&affiliateFeeRecipient=0xA4f5C2781DA48d196fCbBD09c08AA525522b3699`,
      );
    }
    console.log(dstChainId, response?.data);
    return response?.data;
  } catch (error) {
    console.log('error  from DLN api:', error?.response?.data);
    return null;
  }
};
export const confirmDLNTransaction = async (
  tradeType,
  quoteTxReciept,
  amount,
  tokenAddress,
  txData,
  smartAccountLegacy,
  eoaAddress,
  onlyTransaction = false,
  externalTx,
  dfnsToken,
  walletIdSrc,
  walletIdDst,
  smartAccountSrc,
  smartAccountDst,
) => {
  let txs = externalTx.length > 0 ? externalTx : [];
  let chainId = 137;
  let smartAccount = smartAccountLegacy;
  // if (
  //   tradeType === 'buy' &&
  //   quoteTxReciept?.estimation?.srcChainTokenIn?.chainId !==
  //     quoteTxReciept?.estimation?.dstChainTokenOut?.chainId &&
  //   !quoteTxReciept?.tokenIn?.address
  // ) {
  if (
    tradeType === 'buy' &&
    quoteTxReciept?.estimation?.srcChainTokenIn?.chainId !==
      quoteTxReciept?.estimation?.dstChainTokenOut?.chainId &&
    !quoteTxReciept?.tokenIn?.address
  ) {
    chainId = quoteTxReciept?.estimation?.srcChainTokenIn?.chainId;
    smartAccount = smartAccountSrc;
    const erc20Abi = new ethers.Interface(erc20);
    const proxyDlnAbi = new ethers.Interface(ProxyDLNAbi);
    console.log(
      getXadeFeePayerAddressOnChain(
        quoteTxReciept?.estimation?.srcChainTokenIn?.chainId,
      ),
      chainId,
      smartAccount,
      amount,
      tokenAddress,
    );
    const sendData = erc20Abi.encodeFunctionData('transfer', [
      getXadeFeePayerAddressOnChain(
        quoteTxReciept?.estimation?.srcChainTokenIn?.chainId,
      ),
      amount,
    ]);

    // const sendTX = await getEthereumTransaction(
    //   smartAccount,
    //   tokenAddress,
    //   sendData,
    //   '0',
    // );
    const sendTX = {
      to: tokenAddress,
      data: sendData,
    };
    txs.push(sendTX);
    const dlnProxyTxData = proxyDlnAbi.encodeFunctionData('placeOrder', [
      quoteTxReciept?.estimation?.srcChainTokenIn?.address, // USDC
      quoteTxReciept?.estimation?.srcChainTokenIn?.amount, // 25,000 USDC
      quoteTxReciept?.estimation?.dstChainTokenOut?.address,
      quoteTxReciept?.estimation?.dstChainTokenOut?.amount, // 249,740 DOGE
      quoteTxReciept?.estimation?.dstChainTokenOut?.chainId, // BNB Chain
      smartAccountDst,
      smartAccount,
      smartAccountDst,
    ]);

    const executeProxyDLN = {
      to: getXadeFeePayerAddressOnChain(
        quoteTxReciept?.estimation?.srcChainTokenIn?.chainId,
      ),
      data: dlnProxyTxData,
    };
    txs.push(executeProxyDLN);
    console.log('smartAccountDst...........', smartAccountDst);
  } else {
    chainId =
      quoteTxReciept?.estimation?.srcChainTokenIn?.chainId ??
      quoteTxReciept?.action?.fromChainId ??
      '137';
    smartAccount = smartAccountSrc;
    const erc20Abi = new ethers.Interface(erc20);
    console.log('chain info', tokenAddress, smartAccount, chainId);
    const approvalData = erc20Abi.encodeFunctionData('approve', [
      txData?.to,
      amount,
    ]);
    const approvalTx = {
      to: tokenAddress,
      data: approvalData,
    };
    txs.push(approvalTx);
    const executeTx = {
      to: txData?.to,
      data: txData?.data,
    };
    txs.push(executeTx);
    console.log('same chain tx......', amount, walletIdSrc, chainId, txs);
  }
  if (!onlyTransaction) {
    const txnHash = await tradeTokenGasless(
      dfnsToken,
      walletIdSrc,
      chainId,
      txs,
      smartAccountSrc,
    );
    console.log('Signature Signed...........', txnHash);
    if (txnHash) {
      console.log('Signature Signed confirmed...........', txnHash);
      return txnHash;
    } else {
      return false;
    }
  } else {
    return txs;
  }

  //   const erc20Abi = new ethers.Interface(erc20);
  //   const proxyDlnAbi = new ethers.Interface(ProxyDLNAbi);
  //   const sendData = erc20Abi.encodeFunctionData('transfer', [
  //     getXadeFeePayerAddressOnChain(
  //       quoteTxReciept?.estimation?.srcChainTokenIn?.chainId,
  //     ),
  //     amount,
  //   ]);
  //   // const sendTX = await getEthereumTransaction(
  //   //   smartAccount,
  //   //   tokenAddress,
  //   //   sendData,
  //   //   '0',
  //   // );
  //   // txs.push(sendTX);
  //   // const dlnProxyTxData = proxyDlnAbi.encodeFunctionData('placeOrder', [
  //   //   quoteTxReciept?.estimation?.srcChainTokenIn?.address, // USDC
  //   //   quoteTxReciept?.estimation?.srcChainTokenIn?.amount, // 25,000 USDC
  //   //   quoteTxReciept?.estimation?.dstChainTokenOut?.address,
  //   //   quoteTxReciept?.estimation?.dstChainTokenOut?.amount, // 249,740 DOGE
  //   //   quoteTxReciept?.estimation?.dstChainTokenOut?.chainId, // BNB Chain
  //   //   smartAccount,
  //   //   smartAccount,
  //   //   smartAccount,
  //   // ]);
  //   // const executeProxyDLN = await getEthereumTransaction(
  //   //   smartAccount,
  //   //   getXadeFeePayerAddressOnChain(
  //   //     quoteTxReciept?.estimation?.srcChainTokenIn?.chainId,
  //   //   ),
  //   //   dlnProxyTxData,
  //   //   '0',
  //   // );
  //   // txs.push(executeProxyDLN);
  // } else {
  //   // console.log('approval address....', smartAccount, txData, tokenAddress);
  //   // const erc20Abi = new ethers.Interface(erc20);
  //   // const sendData = erc20Abi.encodeFunctionData('approve', [
  //   //   txData?.to,
  //   //   amount,
  //   // ]);
  //   // const sendTX = await getEthereumTransaction(
  //   //   smartAccount,
  //   //   tokenAddress,
  //   //   sendData,
  //   //   '0',
  //   // );
  //   // txs.push(sendTX);
  //   // console.log('Tx send started amount !!!', amount);
  //   // const executeDLNSap = await getEthereumTransaction(
  //   //   smartAccount,
  //   //   txData?.to,
  //   //   txData?.data,
  //   //   '0',
  //   // );
  //   // console.log('tx executing swapping part', executeDLNSap);
  //   // txs.push(executeDLNSap);
  // }
  // if (!onlyTransaction) {
  //   const signature = await signAndSendBatchTransactionWithGasless(
  //     eoaAddress,
  //     smartAccount,
  //     txs,
  //   );
  //   console.log('Signature Signed...........', signature);
  //   if (signature) {
  //     console.log('Signature Signed confirmed...........', signature);
  //     return signature;
  //   } else {
  //     return false;
  //   }
  // } else {
  //   return txs;
  // }
};
export const confirmDLNTransactionPolToArb = async (
  tradeType,
  quoteTxReciept,
  amount,
  tokenAddress,
  txData,
  smartAccount,
  eoaAddress,
) => {
  // let txs = [];
  // console.log(tradeType);
  // if (
  //   tradeType === 'buy' &&
  //   quoteTxReciept?.estimation?.srcChainTokenIn?.chainId !==
  //     quoteTxReciept?.estimation?.dstChainTokenOut?.chainId &&
  //   !quoteTxReciept?.tokenIn?.address
  // ) {
  //   const erc20Abi = new ethers.Interface(erc20);
  //   const proxyDlnAbi = new ethers.Interface(ProxyDLNAbi);
  //   const sendData = erc20Abi.encodeFunctionData('transfer', [
  //     getXadeFeePayerAddressOnChain(
  //       quoteTxReciept?.estimation?.srcChainTokenIn?.chainId,
  //     ),
  //     amount,
  //   ]);
  //   // const sendTX = await getEthereumTransaction(
  //   //   smartAccount,
  //   //   tokenAddress,
  //   //   sendData,
  //   //   '0',
  //   // );
  //   // txs.push(sendTX);
  //   // const dlnProxyTxData = proxyDlnAbi.encodeFunctionData('placeOrder', [
  //   //   quoteTxReciept?.estimation?.srcChainTokenIn?.address, // USDC
  //   //   quoteTxReciept?.estimation?.srcChainTokenIn?.amount, // 25,000 USDC
  //   //   quoteTxReciept?.estimation?.dstChainTokenOut?.address,
  //   //   quoteTxReciept?.estimation?.dstChainTokenOut?.amount, // 249,740 DOGE
  //   //   quoteTxReciept?.estimation?.dstChainTokenOut?.chainId, // BNB Chain
  //   //   smartAccount,
  //   //   smartAccount,
  //   //   smartAccount,
  //   // ]);
  //   // const executeProxyDLN = await getEthereumTransaction(
  //   //   smartAccount,
  //   //   getXadeFeePayerAddressOnChain(
  //   //     quoteTxReciept?.estimation?.srcChainTokenIn?.chainId,
  //   //   ),
  //   //   dlnProxyTxData,
  //   //   '0',
  //   // );
  //   txs.push(executeProxyDLN);
  // }
  // // const signature = await signAndSendBatchTransactionWithGasless(
  // //   eoaAddress,
  // //   smartAccount,
  // //   txs,
  // // );
  // // console.log('Signature Signed...........', eoaAddress, signature);
  // // if (signature) {
  // //   console.log('Signature Signed confirmed...........', signature);
  // //   return signature;
  // // } else {
  // //   return false;
  // // }
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
export const getDLNTradeForAddress = async (smartAccount, chainId, page) => {
  const res = await axios.post(
    'https://stats-api.dln.trade/api/Orders/filteredList',
    {
      giveChainIds: [chainId],
      takeChainIds: [chainId],
      orderStates: ['ClaimedUnlock', 'Created', 'Fulfilled', 'SentUnlock'],
      externalCallStates: [],
      filter: '',
      skip: page * 50,
      take: 50,
      blockTimestampFrom: null,
      blockTimestampTo: null,
      fulfiller: null,
      unlockAuthorities: null,
      maker: null,
      creator: null,
      referralCode: null,
      orderAuthorityInSourceChain: smartAccount,
      orderAuthorityInDestinationChain: smartAccount,
    },
  );
  console.log('dln stats api....', res.data);
  return res.data;
};
export const getQuoteFromLifi = async (
  fromChain,
  toChain,
  fromToken,
  toToken,
  fromAmount,
  fromAddress,
) => {
  try {
    const result = await axios.get('https://li.quest/v1/quote', {
      params: {
        fromChain,
        toChain,
        fromToken,
        toToken,
        fromAmount,
        fromAddress,
        integrator: 'xade-finance',
      },
    });
    return result;
  } catch (error) {
    console.log('lifi error.....', error?.response?.data);
  }
};
export const getQuoteFromUnizen = async (
  fromChain,
  toChain,
  fromToken,
  toToken,
  fromAmount,
  fromAddress,
) => {
  try {
    console.log('unizen data.....', fromAmount);
    const result = await axios.get(
      `https://api.zcx.com/trade/v1/${fromChain}/quote/single?fromTokenAddress=${fromToken}&toTokenAddress=${toToken}&amount=${fromAmount}&sender=${fromAddress}&slippage=0.005`,
      {
        headers: {
          Authorization: `Bearer af0e50ed-6636-414f-afa3-2626db5c6acf`,
          // accept: 'application/json',
        },
      },
    );

    const allMinAmount = result?.data?.map(x =>
      parseInt(x?.transactionData?.info?.amountOutMin),
    );
    const maxAmountOut = Math.max(...allMinAmount);
    const index = allMinAmount.indexOf(maxAmountOut);
    console.log('unizen result.....', maxAmountOut, index);
    return result?.data[index];
  } catch (error) {
    console.log('unizen error.....', error?.response?.data);
  }
};
export const getTxFromUnizen = async (
  fromChain,
  transactionData,
  nativeValue,
  account,
  tradeType,
) => {
  try {
    console.log('unizen data.....');
    const result = await axios.post(
      `https://api.zcx.com/trade/v1/${fromChain}/swap/single`,
      {transactionData, nativeValue, account, tradeType, receiver: account},
      {
        headers: {
          Authorization: `Bearer af0e50ed-6636-414f-afa3-2626db5c6acf`,
          // accept: 'application/json',
        },
      },
    );
    return result?.data;
  } catch (error) {
    console.log('unizen error.....', error?.response?.data);
  }
};
export const executeSameChainSellForUSDC = async (
  tokenInfo,
  smartAccount,
  value,
) => {
  const usdcNativeToken = getUSDCTokenOnChain(parseInt(tokenInfo?.chainId));
  console.log(
    'lifi quote : ',
    tokenInfo?.chainId,
    tokenInfo?.address,
    value,
    tokenInfo?.chainId,
    usdcNativeToken,
    smartAccount,
  );
  const uSDCTxnRate = await getDLNTradeCreateBuyOrder(
    tokenInfo?.chainId,
    tokenInfo?.address,
    value,
    tokenInfo?.chainId,
    usdcNativeToken,
    smartAccount,
    true,
  );
  return uSDCTxnRate;
};
export const executeCrossChainSellForUSDC = async (
  srcChainId,
  smartAccountSrc,
  value,
  smartAccountDst,
) => {
  const usdcNativeToken = getUSDCTokenOnChain(parseInt(srcChainId));
  const usdcNativePolyToken = getUSDCTokenOnChain(parseInt(137));
  const uSDCTxnRate = await getDLNTradeCreateBuyOrder(
    srcChainId,
    usdcNativeToken,
    value,
    137,
    usdcNativePolyToken,
    smartAccountSrc,
  );

  if (uSDCTxnRate) {
    console.log(
      'tx data.......2',
      srcChainId,
      usdcNativeToken,
      value,
      137,
      usdcNativePolyToken,
      uSDCTxnRate?.estimation?.dstChainTokenOut?.amount,
      smartAccountSrc,
      smartAccountDst,
    );
    const res = await getDLNTradeCreateBuyOrderTxn(
      srcChainId,
      usdcNativeToken,
      value,
      137,
      usdcNativePolyToken,
      uSDCTxnRate?.estimation?.dstChainTokenOut?.amount,
      smartAccountSrc,
      smartAccountDst,
    );
    return res;
  }
  // return uSDCTxnRate;
};
//https://li.quest/v1/analytics/transfers?integrator=xade-finace&wallet=ds
export const getAllSameChainTxs = async address => {
  const result = await axios.get(
    `https://li.quest/v1/analytics/transfers?integrator=xade-finace&wallet=${address}&status=DONE`,
  );
  console.log('same chain result', result?.data?.transfers);
  return result?.data?.transfers;
};
