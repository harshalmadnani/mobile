import axios from 'axios';

const coingeckoBaseURL = 'https://api.coingecko.com/api/v3';
const marketRoutes = {getAsset: '/coins/markets'};
export const getMarketAssetData = async page => {
  try {
    const response = await axios.get(
      `${coingeckoBaseURL}${marketRoutes.getAsset}?vs_currency=usd&order=market_cap_desc&per_page=50&page=${page}&sparkline=false&locale=en`,
    );
    console.log('response from market investment api:', response?.data?.length);
    return response?.data;
  } catch (error) {
    console.log('error from market investment api:', error);
    return [];
  }
};
