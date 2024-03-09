import {
  getCryptoHoldingForAddress,
  getNftsHoldingForAddress,
} from '../../utils/cryptoWalletApi';
import {
  getSmartAccountAddress,
  getUserAddressFromAuthCoreSDK,
} from '../../utils/particleCoreSDK';
import {portfolioAction} from '../reducers/portfolio';

export const getNFTHoldingForAddressFromMobula = () => {
  return async (dispatch, getState) => {
    const eoaAddress = await getUserAddressFromAuthCoreSDK();
    const smartAccount = await getSmartAccountAddress(eoaAddress);
    console.log('address', smartAccount);
    const data = await getNftsHoldingForAddress(smartAccount);
    console.log('updated:=========>', data);
    dispatch(portfolioAction.setNftHoldings(data));
  };
};
export const getCryptoHoldingForAddressFromMobula = asset => {
  return async (dispatch, getState) => {
    const eoaAddress = await getUserAddressFromAuthCoreSDK();
    const smartAccount = await getSmartAccountAddress(eoaAddress);
    const data = await getCryptoHoldingForAddress(smartAccount, asset);
    dispatch(portfolioAction.setHoldings(data?.data));
    return data;
  };
};
