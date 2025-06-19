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
    const evmInfo = getState().portfolio.evmInfo;
    const data = await getTransactionsByWallet(evmInfo.smartAccount, 0);
    dispatch(portfolioAction.setEvmTxList(data));
  };
};
export const getWalletTransactionForAddressFromDLN = page => {
  return async (dispatch, getState) => {
    const evmInfo = getState().portfolio.evmInfo;
    const crossData = await getDLNTradeForAddress(evmInfo.smartAccount, page);
    const sameData = await getAllSameChainTxs(evmInfo.smartAccount);
    dispatch(
      portfolioAction.setEvmDLNTradeList({
        orders: [...crossData?.orders, ...sameData],
      }),
    );
    return data;
  };
};
