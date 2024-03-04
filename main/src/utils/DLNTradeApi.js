import axios from 'axios';

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
    return [];
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
  console.log('txn quote results:::::::', results);
};
export const confirmDLNTransaction = async (from, txData) => {};
