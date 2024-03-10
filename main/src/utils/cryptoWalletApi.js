import axios from 'axios';
import {
  getSmartAccountAddress,
  getUserAddressFromAuthCoreSDK,
} from './particleCoreSDK';

const mobulaBaseURL = 'https://api.mobula.io/api/1/';
const marketRoutes = {
  getNFTs: '/nft',
  getWallets: 'wallet/portfolio',
  getHistory: '/wallet/history',
};

export const getNftsHoldingForAddress = async address => {
  try {
    const response = await axios.get(
      `${mobulaBaseURL}${marketRoutes.getNFTs}?wallet=${address}`,
    );
    console.log('response from nft api:', response?.data?.length);
    return response?.data?.data;
  } catch (error) {
    console.log('error  from asset api:', error);
    return [];
  }
};
export const getCryptoHoldingForAddress = async (address, asset) => {
  try {
    const url = asset
      ? `${mobulaBaseURL}${marketRoutes.getWallets}?wallet=${address}&asset=${asset}`
      : `${mobulaBaseURL}${marketRoutes.getWallets}?wallet=${address}`;
    const response = await axios.get(url, {
      headers: {Authorization: 'e26c7e73-d918-44d9-9de3-7cbe55b63b99'},
    });
    return response?.data;
  } catch (error) {
    console.log(
      'error from asset api:',
      `${mobulaBaseURL}${marketRoutes.getWallets}?wallet=${address}`,
      error,
    );
    return [];
  }
};

export const getWalletHistoricalData = async from => {
  try {
    const eoaAddress = await getUserAddressFromAuthCoreSDK();
    const smartAccount = await getSmartAccountAddress(eoaAddress);
    const response = await axios.get(
      from
        ? `${mobulaBaseURL}${marketRoutes.getHistory}?wallet=${smartAccount}&from=${from}`
        : `${mobulaBaseURL}${marketRoutes.getHistory}?wallet=${smartAccount}`,
      {
        headers: {Authorization: 'e26c7e73-d918-44d9-9de3-7cbe55b63b99'},
      },
    );
    return response?.data?.data;
  } catch (error) {
    console.log('error  from history api:', error);
    return [];
  }
};
