import axios from 'axios';
import {ethers} from 'ethers';
import erc20 from '../screens/loggedIn/payments/USDC.json';
import ProxyDLNAbi from './abis/ProxyDLNAbi.json';
import {
  getEthereumTransaction,
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
    let response;
    if (dstChainId === srcChainId) {
      response = await axios.get(
        `https://api.dln.trade/v1.0/chain/estimation?chainId=${srcChainId}&tokenIn=${
          srcChainTokenIn === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
            ? '0x0000000000000000000000000000000000000000'
            : srcChainTokenIn
        }&tokenInAmount=${srcChainTokenInAmount}&tokenOut=${
          dstChainTokenOut === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
            ? '0x0000000000000000000000000000000000000000'
            : dstChainTokenOut
        }&prependOperatingExpenses=false&referralCode=8002&affiliateFeePercent=0.15&affiliateFeeRecipient=0xA4f5C2781DA48d196fCbBD09c08AA525522b3699`,
      );
    } else {
      console.log('hereeee...........');
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
    return response?.data;
  } catch (error) {
    console.log(
      'error from DLN same api: matic same',
      `https://api.dln.trade/v1.0/chain/estimation?chainId=${srcChainId}&tokenIn=${
        srcChainTokenIn === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
          ? '0x0000000000000000000000000000000000000000'
          : srcChainTokenIn
      }&tokenInAmount=${srcChainTokenInAmount}&tokenOut=${
        dstChainTokenOut === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
          ? '0x0000000000000000000000000000000000000000'
          : dstChainTokenOut
      }&prependOperatingExpenses=false&referralCode=8002&affiliateFeePercent=0.15&affiliateFeeRecipient=0xA4f5C2781DA48d196fCbBD09c08AA525522b3699`,
      error.toString(),
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
) => {
  try {
    let response;
    if (dstChainId === 137) {
      response = await axios.get(
        `https://api.dln.trade/v1.0/chain/estimation?chainId=${srcChainId}&tokenIn=${
          srcChainTokenIn === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
            ? '0x0000000000000000000000000000000000000000'
            : srcChainTokenIn
        }&tokenInAmount=${srcChainTokenInAmount}&tokenOut=${
          dstChainTokenOut === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
            ? '0x0000000000000000000000000000000000000000'
            : dstChainTokenOut
        }&prependOperatingExpenses=false&referralCode=8002&affiliateFeePercent=0.15&affiliateFeeRecipient=0xA4f5C2781DA48d196fCbBD09c08AA525522b3699`,
      );
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

    console.log('response from DLN api: sell', dstChainId, response?.data);
    return response?.data;
  } catch (error) {
    console.log('error  from DLN api:', dstChainId, error.toString());
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
  console.log('block chain to be called call', blockchains);
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
      '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
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
        parseInt(
          x?.estimation?.dstChainTokenOut?.amount ||
            x?.estimation?.tokenOut?.amount,
        ),
      )
        ? 0
        : parseInt(
            x?.estimation?.dstChainTokenOut?.amount ||
              x?.estimation?.tokenOut?.amount,
          ),
      chainId: x?.estimation?.dstChainTokenOut?.chainId || 137,
    };
  });
  const bestPrice = Math.max(...bestTradingPrice.map(x => x.fee));
  console.log(
    'before filter',
    bestTradingPrice.filter(x => x.fee === bestPrice)[0]?.chainId,
    results,
  );
  results =
    bestTradingPrice.filter(x => x.fee === bestPrice)[0]?.chainId === 137
      ? results.filter(x => x.estimation?.tokenOut !== undefined)
      : results.filter(
          x =>
            x.estimation?.dstChainTokenOut?.chainId ===
            bestTradingPrice.filter(x => x.fee === bestPrice)[0]?.chainId,
        );
  console.log('after filter', results);
  if (results.length > 0) {
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
  smartAccount,
) => {
  try {
    let response;
    if (dstChainId === srcChainId) {
      response = await axios.get(
        `https://api.dln.trade/v1.0/chain/transaction?chainId=${srcChainId}&tokenIn=${
          srcChainTokenIn === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
            ? '0x0000000000000000000000000000000000000000'
            : srcChainTokenIn
        }&tokenInAmount=${srcChainTokenInAmount}&tokenOut=${
          dstChainTokenOut === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
            ? '0x0000000000000000000000000000000000000000'
            : dstChainTokenOut
        }&tokenOutRecipient=${smartAccount}&prependOperatingExpenses=false&referralCode=8002&affiliateFeePercent=0.15&affiliateFeeRecipient=0xA4f5C2781DA48d196fCbBD09c08AA525522b3699`,
      );
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
        }&dstChainTokenOutAmount=${dstChainTokenOutAmount}&dstChainTokenOutRecipient=${smartAccount}&srcChainOrderAuthorityAddress=${smartAccount}&dstChainOrderAuthorityAddress=${smartAccount}&prependOperatingExpenses=false&referralCode=8002&affiliateFeePercent=0.15&affiliateFeeRecipient=0xA4f5C2781DA48d196fCbBD09c08AA525522b3699`,
      );
    }
    console.log(dstChainId, response?.data);
    return response?.data;
  } catch (error) {
    console.log('error  from DLN api:', error);
    return null;
  }
};
export const confirmDLNTransaction = async (
  tradeType,
  quoteTxReciept,
  amount,
  tokenAddress,
  txData,
  smartAccount,
) => {
  let txs = [];
  console.log(quoteTxReciept);
  if (
    tradeType === 'buy' &&
    quoteTxReciept?.estimation?.srcChainTokenIn?.chainId !==
      quoteTxReciept?.estimation?.dstChainTokenOut?.chainId &&
    !quoteTxReciept?.tokenIn?.address
  ) {
    console.log('Tx confirming started!!!');
    const erc20Abi = new ethers.utils.Interface(erc20);
    const proxyDlnAbi = new ethers.utils.Interface(ProxyDLNAbi);
    const sendData = erc20Abi.encodeFunctionData('transfer', [
      '0x2c4bac6ded5082ec95930c512aba7e098ea9037a',
      amount,
    ]);

    const sendTX = await getEthereumTransaction(
      smartAccount,
      tokenAddress,
      sendData,
      '0',
    );
    txs.push(sendTX);
    console.log(
      'Tx send started!!!',
      quoteTxReciept?.estimation?.srcChainTokenIn?.chainId,
      quoteTxReciept?.estimation?.dstChainTokenOut?.chainId,
      quoteTxReciept?.estimation?.tokenIn?.chainId,
      quoteTxReciept?.estimation?.tokenOut?.chainId,
    );

    const dlnProxyTxData = proxyDlnAbi.encodeFunctionData('placeOrder', [
      quoteTxReciept?.estimation?.srcChainTokenIn?.address, // USDC
      quoteTxReciept?.estimation?.srcChainTokenIn?.amount, // 25,000 USDC
      quoteTxReciept?.estimation?.dstChainTokenOut?.address,
      quoteTxReciept?.estimation?.dstChainTokenOut?.amount, // 249,740 DOGE
      quoteTxReciept?.estimation?.dstChainTokenOut?.chainId, // BNB Chain
      smartAccount,
      smartAccount,
      smartAccount,
    ]);
    const executeProxyDLN = await getEthereumTransaction(
      smartAccount,
      '0x2c4bac6ded5082ec95930c512aba7e098ea9037a',
      dlnProxyTxData,
      '0',
    );
    console.log('tx executing swapping part', dlnProxyTxData);
    txs.push(executeProxyDLN);
  } else {
    const erc20Abi = new ethers.utils.Interface(erc20);
    const sendData = erc20Abi.encodeFunctionData('approve', [
      txData?.to,
      amount,
    ]);

    const sendTX = await getEthereumTransaction(
      smartAccount,
      tokenAddress,
      sendData,
      '0',
    );
    txs.push(sendTX);
    console.log('Tx send started amount !!!', amount);

    const executeDLNSap = await getEthereumTransaction(
      smartAccount,
      txData?.to,
      txData?.data,
      '0',
    );
    console.log('tx executing swapping part', executeDLNSap);
    txs.push(executeDLNSap);
  }
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
export const getDLNTradeForAddress = async (smartAccount, page) => {
  const res = await axios.post(
    'https://stats-api.dln.trade/api/Orders/filteredList',
    {
      giveChainIds: [137, 56, 43114, 1],
      takeChainIds: [137, 56, 43114, 1],
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
