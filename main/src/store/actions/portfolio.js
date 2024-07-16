import axios from 'axios';
import {
  getAllSameChainTxs,
  getDLNTradeForAddress,
} from '../../utils/DLNTradeApi';
import {
  getCryptoHoldingForAddress,
  getNftsHoldingForAddress,
  getTransactionsByWallet,
} from '../../utils/cryptoWalletApi';
// import // getSmartAccountAddress,
// // getUserAddressFromAuthCoreSDK,
// ('../../utils/particleCoreSDK');
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
export const getWalletTransactionForAddressFromMobula = () => {
  return async (dispatch, getState) => {
    const allScw = getState().auth.scw;
    const data = await getTransactionsByWallet(
      allScw.map(x => x.address)?.toString(),
      0,
    );
    console.log('tx....', data);
    // dispatch(portfolioAction.setEvmTxList(data));
    dispatch(portfolioAction.setEvmTxList(data?.transactions));
  };
};
export const getWalletTransactionForAddressFromDLN = page => {
  return async (dispatch, getState) => {
    // const evmInfo = getState().portfolio.evmInfo;
    const allScw = getState().auth.scw;
    console.log('scw all....', allScw);
    let crossData = await Promise.all(
      allScw.map(
        async x =>
          await getDLNTradeForAddress(x.address, parseInt(x.chainId), page),
      ),
    );
    crossData = crossData
      ?.map(x => {
        return x?.orders.length > 0 ? {...x?.orders} : null;
      })
      ?.filter(x => x !== null);
    console.log('scw all....', crossData);
    const sameData = await getAllSameChainTxs(
      allScw?.filter(x => x.chainId === '137')?.[0]?.address,
    );
    console.log('scw all....1', [...crossData, ...sameData]);
    dispatch(
      portfolioAction.setEvmDLNTradeList({
        orders: [...crossData, ...sameData],
      }),
    );
    // return data;
  };
};
export const getEvmAddresses = () => {
  return async (dispatch, getState) => {
    // const eoaAddress = await getUserAddressFromAuthCoreSDK();
    // const smartAccount = await getSmartAccountAddress(eoaAddress);
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
    console.log('user infoooo(getEvmAddresses)', response?.data);
    dispatch(
      portfolioAction.setEvmWalletInfo({
        address: eoaAddress,
        smartAccount: smartAccount,
      }),
    );
    dispatch(portfolioAction.setUserInfo(response?.data));
  };
};
