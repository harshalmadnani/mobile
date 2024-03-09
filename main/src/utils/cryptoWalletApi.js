import axios from 'axios';

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
    const response = await axios.get(
      asset
        ? `${mobulaBaseURL}${marketRoutes.getWallets}?wallet=${address}&asset=${asset}`
        : `${mobulaBaseURL}${marketRoutes.getWallets}?wallet=${address}`,
    );
    console.log(
      'response from wallet holding asset::::::::: getCryptoHoldingForAddress',
      JSON.stringify(response.data),
    );
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

export const getWalletHistoricalData = async (address, from) => {
  try {
    console.log(
      'crypto url....',
      `${mobulaBaseURL}${marketRoutes.getHistory}?wallet=${address}&from=${from}`,
    );

    const response = await axios.get(
      from
        ? `${mobulaBaseURL}${marketRoutes.getHistory}?wallet=${address}&from=${from}`
        : `${mobulaBaseURL}${marketRoutes.getHistory}?wallet=${address}`,
    );
    return response?.data?.data;
  } catch (error) {
    console.log('error  from history api:', error);
    return [];
  }
};
