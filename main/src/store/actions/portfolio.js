import axios from 'axios';
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
    dispatch(portfolioAction.setPortfolioHoldingFetch(true));
    const data = await getCryptoHoldingForAddress(smartAccount, asset);
    dispatch(portfolioAction.setPortfolioHoldingFetch(false));
    dispatch(portfolioAction.setHoldings(data?.data));
    return data;
  };
};
export const getWalletTransactionForAddressFromMobula = page => {
  return async (dispatch, getState) => {
    const evmInfo = getState().portfolio.evmInfo;
    const data = await getTransactionsByWallet(evmInfo.smartAccount, page);
    dispatch(portfolioAction.setEvmTxList(data));
  };
};
export const getWalletTransactionForAddressFromDLN = page => {
  return async (dispatch, getState) => {
    const evmInfo = getState().portfolio.evmInfo;
    const data = await getDLNTradeForAddress(evmInfo.smartAccount, page);
    dispatch(portfolioAction.setEvmDLNTradeList(data));
    return data;
  };
};
export const getEvmAddresses = () => {
  return async (dispatch, getState) => {
    const eoaAddress = await getUserAddressFromAuthCoreSDK();
    const smartAccount = await getSmartAccountAddress(eoaAddress);
    console.log(
      'user infoooo.....',
      `https://srjnswibpbnrjufgqbmq.supabase.co/rest/v1/users?evmSmartAccount=eq.${smartAccount}`,
    );
    const response = await axios.get(
      `https://srjnswibpbnrjufgqbmq.supabase.co/rest/v1/users?evmSmartAccount=eq.${smartAccount}`,
      {
        headers: {
          apiKey:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyam5zd2licGJucmp1ZmdxYm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEyOTE0NjgsImV4cCI6MjAyNjg2NzQ2OH0.w_WrPPnSX2j4tnAFxV1y2XnU0ffWpZkrkPLmNMsSmko',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyam5zd2licGJucmp1ZmdxYm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEyOTE0NjgsImV4cCI6MjAyNjg2NzQ2OH0.w_WrPPnSX2j4tnAFxV1y2XnU0ffWpZkrkPLmNMsSmko',
        },
      },
    );
    console.log('user infoooo.....user', response?.data);
    dispatch(
      portfolioAction.setEvmWalletInfo({
        address: eoaAddress,
        smartAccount: smartAccount,
      }),
    );
    dispatch(portfolioAction.setUserInfo(response?.data));
  };
};
