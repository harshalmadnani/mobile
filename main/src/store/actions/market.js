import {getMarketAssetData} from '../../utils/cryptoMarketsApi';
import {marketsAction} from '../reducers/market';

export const getListOfCryptoFromCoinGeckoApi = page => {
  return async (dispatch, getState) => {
    const listOfCrypto = getState().market.listOfCrypto ?? [];
    const data = await getMarketAssetData(page);
    console.log('updated:=========>', page, listOfCrypto.concat(data).length);
    dispatch(marketsAction.setListOfCrypto(listOfCrypto.concat(data)));
  };
};
