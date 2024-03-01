import {
  getAssetMetadata,
  getHistoricalData,
  getMarketAssetData,
} from '../../utils/cryptoMarketsApi';
import {marketsAction} from '../reducers/market';

export const getListOfCryptoFromCoinGeckoApi = page => {
  return async (dispatch, getState) => {
    const listOfCrypto = getState().market.listOfCrypto ?? [];
    const data = await getMarketAssetData(page);
    console.log('updated:=========>', page, listOfCrypto.concat(data).length);
    dispatch(marketsAction.setListOfCrypto(listOfCrypto.concat(data)));
  };
};
export const setAssetMetadata = assetName => {
  return async (dispatch, getState) => {
    const data = await getAssetMetadata(assetName);
    console.log('updated:=========>', data);
    dispatch(marketsAction.setSelectedAssetData(data));
  };
};
export const setHistoricalDataofSelectedTimeFrame = (assetName, from) => {
  return async (dispatch, getState) => {
    const currentSelectedAsset = getState().market.selectedTimeFramePriceInfo;
    const data = await getHistoricalData(assetName, from);
    console.log('updated:=========>', currentSelectedAsset, data[0]);
    dispatch(marketsAction.setSelectedTimeFramePriceInfo(data));
  };
};
