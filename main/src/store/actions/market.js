import {getMarketAssetData} from '../../utils/mobulaMarketApi';
import {marketsAction} from '../reducers/market';

export const getListOfCryptoFromMobulaApi = () => {
  return async dispatch => {
    const data = await getMarketAssetData();
    dispatch(
      marketsAction.setListOfCrypto(
        data?.filter(
          x =>
            x.name !== 'f(x) Protocol' &&
            x.name !== 'Bridged Wrapped Lido Staked Ether (Scroll)',
        ),
      ),
    );
  };
};
