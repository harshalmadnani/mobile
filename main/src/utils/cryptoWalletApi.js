import axios from 'axios';

const mobulaBaseURL = 'https://api.mobula.io/api/1/';
const marketRoutes = {getNFTs: '/nft', getWallets: 'wallet/portfolio'};

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
    console.log(
      'crypto url....',
      `${mobulaBaseURL}${marketRoutes.getWallets}?wallet=${address}&asset=${asset}`,
    );
    
    const response = await axios.get(
      asset
        ? `${mobulaBaseURL}${marketRoutes.getWallets}?wallet=0x6dD0D673c0C434839A344328B4CdCFf53a53FB9b&asset=${asset}`
        : `${mobulaBaseURL}${marketRoutes.getWallets}?wallet=0x6dD0D673c0C434839A344328B4CdCFf53a53FB9b`,
    );
    return response?.data?.data;
  } catch (error) {
    console.log('error  from asset api:', error);
    return [];
  }
};
