import {
  getAssetMetadata,
  getHistoricalData,
  getMarketAssetData,
  getTop100MarketAssetData,
} from '../../utils/cryptoMarketsApi';
import {getCryptoHoldingForAddress} from '../../utils/cryptoWalletApi';
import {
  getBestCrossSwapRateBuy,
  getDLNTradeCreateBuyOrder,
} from '../../utils/DLNTradeApi';
import {
  getSmartAccountAddress,
  getUserAddressFromAuthCoreSDK,
} from '../../utils/particleCoreSDK';
import {marketsAction} from '../reducers/market';

export const getListOfCryptoFromCoinGeckoApi = page => {
  return async (dispatch, getState) => {
    const listOfCrypto = getState().market.listOfCrypto ?? [];
    const data = await getMarketAssetData(page);
    dispatch(marketsAction.setListOfCrypto(listOfCrypto.concat(data)));
  };
};
// First create an api call to get the desired data in actions/market.js
//100, featured and etc.
export const getListFilteredFromCoinGeckoApi = type => {
  return async (dispatch, getState) => {
    if (type === 'top') {
      const data = await getTop100MarketAssetData();
      dispatch(marketsAction.setListOfCrypto(data));
    } else if (type === 'featured') {
      const data = await getTop100MarketAssetData();
      dispatch(marketsAction.setListOfCrypto(data));
    }
  };
};
export const setAssetMetadata = assetName => {
  return async (dispatch, getState) => {
    const data = await getAssetMetadata(assetName);
    dispatch(marketsAction.setSelectedAssetData(data));
  };
};
export const setHistoricalDataOfSelectedTimeFrame = (
  assetName,
  currentPrice,
  from,
) => {
  return async (dispatch, getState) => {
    const data = await getHistoricalData(assetName, from);
    const priceOnFromDate = data?.price_history[0][1];

    const percentChange =
      ((currentPrice - priceOnFromDate) * 100) / currentPrice;
    dispatch(
      marketsAction.setSelectedTimeFramePriceInfo({
        percentChange,
        from,
        priceOnSelectedDate: priceOnFromDate,
      }),
    );
  };
};
export const getCryptoHoldingForMarketFromMobula = asset => {
  return async (dispatch, getState) => {
    const address = getState().auth.address;
    const data = await getCryptoHoldingForAddress(address, asset);
    dispatch(marketsAction.setSelectedAssetWalletHolding(data));
  };
};
export const getBestDLNCrossSwapRateBuy = (
  blockchains,
  contractAddress,
  value,
) => {
  return async (dispatch, getState) => {
    const bestRate = await getBestCrossSwapRateBuy(
      blockchains,
      contractAddress,
      value,
    );
    console.log('best rates.....reducer', bestRate);
    dispatch(marketsAction.setBestSwappingRates(bestRate));
  };
};
export const getBestDLNCrossSwapRateSell = (tokenInfo, value) => {
  return async (dispatch, getState) => {
    const bestRate = await getDLNTradeCreateBuyOrder(
      tokenInfo?.chainId,
      tokenInfo?.address,
      value,
      137,
      '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
    );
    console.log('best rates.....reducer', JSON.stringify(bestRate));
    dispatch(marketsAction.setBestSwappingRates(bestRate));
  };
};
export const getUSDCHoldingForAddressFromMobula = () => {
  return async (dispatch, getState) => {
    const eoaAddress = await getUserAddressFromAuthCoreSDK();
    const smartAccount = await getSmartAccountAddress(eoaAddress);
    console.log('smart account address holding', eoaAddress);
    const data = await getCryptoHoldingForAddress(eoaAddress, 'USDC');
    console.log('Reducer Portfolio USDC', JSON.stringify(data));
    dispatch(marketsAction.setTokenUsdcBalance(data));
    return data;
  };
};
