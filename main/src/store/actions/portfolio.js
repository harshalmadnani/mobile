import {
  getCryptoHoldingForAddress,
  getNftsHoldingForAddress,
} from '../../utils/cryptoWalletApi';
import {
  getSmartAccountAddress,
  getUserAddressFromAuthCoreSDK,
} from '../../utils/particleCoreSDK';
import {portfolioAction} from '../reducers/portfolio';

export const getCryptoHoldingForAddressFromMobula = asset => {
  return async (dispatch, getState) => {
    const eoaAddress = await getUserAddressFromAuthCoreSDK();
    const smartAccount = await getSmartAccountAddress(eoaAddress);
    const data = await getCryptoHoldingForAddress(smartAccount, asset);
    console.log('wallet holding......', data);
    dispatch(portfolioAction.setHoldings(data?.data));
    return data;
  };
};
