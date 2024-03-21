import {getDLNTradeForAddress} from '../../utils/DLNTradeApi';
import {
  getCryptoHoldingForAddress,
  getNftsHoldingForAddress,
  getTransactionsByWallet,
} from '../../utils/cryptoWalletApi';
import {
  getSmartAccountAddress,
  getUserAddressFromAuthCoreSDK,
} from '../../utils/particleCoreSDK';
import {portfolioAction} from '../reducers/portfolio';

// getTransactionsByWallet;
export const getCryptoHoldingForAddressFromMobula = (smartAccount, asset) => {
  return async (dispatch, getState) => {
    // const eoaAddress = await getUserAddressFromAuthCoreSDK();
    // const smartAccount = await getSmartAccountAddress(eoaAddress);
    console.log('api fireddd holding', smartAccount);
    const data = await getCryptoHoldingForAddress(smartAccount, asset);
    dispatch(portfolioAction.setHoldings(data?.data));
    return data;
  };
};
export const getWalletTransactionForAddressFromMobula = page => {
  return async (dispatch, getState) => {
    const evmInfo = getState().portfolio.evmInfo;
    // console.log('api fireddd holding', smartAccount);
    const data = await getTransactionsByWallet(evmInfo.smartAccount, page);
    console.log('data.....tx wallet history', data?.data.transactions?.length);
    dispatch(portfolioAction.setEvmTxList(data?.data));
    return data;
  };
};
export const getWalletTransactionForAddressFromDLN = page => {
  return async (dispatch, getState) => {
    const evmInfo = getState().portfolio.evmInfo;
    const data = await getDLNTradeForAddress(evmInfo.smartAccount, page);
    console.log('data.....tx wallet history', data);
    dispatch(portfolioAction.setEvmTxList(data?.data));
    return data;
  };
};
export const getEvmAddresses = () => {
  return async (dispatch, getState) => {
    const eoaAddress = await getUserAddressFromAuthCoreSDK();
    const smartAccount = await getSmartAccountAddress(eoaAddress);
    console.log('eoa address.....', eoaAddress, smartAccount);
    dispatch(
      portfolioAction.setEvmWalletInfo({
        address: eoaAddress,
        smartAccount: smartAccount,
      }),
    );
  };
};
