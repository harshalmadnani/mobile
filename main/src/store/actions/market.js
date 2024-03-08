import {
  getAssetMetadata,
  getHistoricalData,
  getMarketAssetData,
  getTop100MarketAssetData,
} from '../../utils/cryptoMarketsApi';
import {getCryptoHoldingForAddress} from '../../utils/cryptoWalletApi';
import {getBestCrossSwapRate} from '../../utils/DLNTradeApi';
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
export const getBestDLNCrossSwapRate = (
  blockchains,
  contractAddress,
  value,
) => {
  return async (dispatch, getState) => {
    const bestRate = await getBestCrossSwapRate(
      blockchains,
      contractAddress,
      value,
    );
    console.log('best rates.....', bestRate);
    dispatch(marketsAction.setBestSwappingRates(bestRate));
  };
};
