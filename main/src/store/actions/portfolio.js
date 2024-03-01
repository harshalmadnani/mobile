import {
  getCryptoHoldingForAddress,
  getNftsHoldingForAddress,
} from '../../utils/cryptoWalletApi';
import {portfolioAction} from '../reducers/portfolio';

export const getNFTHoldingForAddressFromMobula = () => {
  return async (dispatch, getState) => {
    const address = getState().auth.address;
    const data = await getNftsHoldingForAddress(address);
    console.log('updated:=========>', data);
    dispatch(portfolioAction.setNftHoldings(data));
  };
};
export const getCryptoHoldingForAddressFromMobula = () => {
  return async (dispatch, getState) => {
    const address = getState().auth.address;
    const data = await getCryptoHoldingForAddress(address);
    console.log('updated:=========>', data);
    dispatch(portfolioAction.setHoldings(data));
  };
};
