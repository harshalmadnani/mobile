import axios from 'axios';
import // getSmartAccountAddress,
// getUserAddressFromAuthCoreSDK,
'./particleCoreSDK';

const mobulaBaseURL = 'https://api.mobula.io/api/1/';
const marketRoutes = {
  getNFTs: '/nft',
  getWallets: 'wallet/portfolio',
  getWalletHistory: '/wallet/history',
  getWalletTransactions: '/wallet/transactions',
};

export const getNftsHoldingForAddress = async address => {
  try {
    const response = await axios.get(
      `${mobulaBaseURL}${marketRoutes.getNFTs}?wallet=${address}`,
      {
        headers: {Authorization: 'e26c7e73-d918-44d9-9de3-7cbe55b63b99'},
      },
    );
    console.log('response from nft api:', response?.data?.length);
    return response?.data?.data;
  } catch (error) {
    console.log('error  from asset api:', error);
    return [];
  }
};
export const getCryptoHoldingForAddress = async (address, asset) => {
  const url = asset
    ? `${mobulaBaseURL}${marketRoutes.getWallets}?wallet=${address}&asset=${asset}&cache=true`
    : `${mobulaBaseURL}${marketRoutes.getWallets}?wallet=${address}&cache=true`;
  try {
    console.log('data from wallet holding api:', url);
    const response = await axios.get(url, {
      headers: {Authorization: 'e26c7e73-d918-44d9-9de3-7cbe55b63b99'},
    });
    console.log('data from wallet holding api:', url, response?.data);
    return response?.data;
  } catch (error) {
    console.log('error from wallet holding api:', url, error);
    return [];
  }
};
export const getCryptoHoldingForSwapAddress = async (address, asset) => {
  const url = asset
    ? `${mobulaBaseURL}${marketRoutes.getWallets}?wallet=${address}&asset=${asset}&pnl=false`
    : `${mobulaBaseURL}${marketRoutes.getWallets}?wallet=${address}&pnl=false&cache=true`;
  try {
    console.log('data from wallet holding api:', url);
    const response = await axios.get(url, {
      headers: {Authorization: 'e26c7e73-d918-44d9-9de3-7cbe55b63b99'},
    });
    console.log('data from wallet holding api:', url, response?.data);
    return response?.data;
  } catch (error) {
    console.log('error from wallet holding api:', url, error);
    return [];
  }
};
export const getWalletHistoricalData = async (smartAccount, from) => {
  try {
    const response = await axios.get(
      from
        ? `${mobulaBaseURL}${marketRoutes.getWalletHistory}?wallet=${smartAccount}&from=${from}`
        : `${mobulaBaseURL}${marketRoutes.getWalletHistory}?wallet=${smartAccount}`,
      {
        headers: {Authorization: 'e26c7e73-d918-44d9-9de3-7cbe55b63b99'},
      },
    );
    return response?.data?.data;
  } catch (error) {
    console.log('error  from history api:', error?.response?.data);
    return [];
  }
};
export const getTransactionsByWallet = async (address, page) => {
  try {
    const response = await axios.get(
      `${mobulaBaseURL}${
        marketRoutes.getWalletTransactions
      }?asset=USDC&wallet=${address}&order=asc&limit=${50}&offset=${0}`,
      {
        headers: {Authorization: 'e26c7e73-d918-44d9-9de3-7cbe55b63b99'},
      },
    );
    console.log('all tx historyy....', response?.data?.data);
    return response?.data?.data;
  } catch (error) {
    console.log('error tx history from history api:', error?.response?.data);
    return [];
  }
};
