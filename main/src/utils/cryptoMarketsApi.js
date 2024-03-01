import axios from 'axios';

const coingeckoBaseURL = 'https://api.coingecko.com/api/v3';
const mobulaBaseURL = 'https://api.mobula.io/api/1';
const marketRoutes = {
  getMarket: '/coins/markets',
  getAsset: '/metadata',
  getHistorical: '/market/history',
};
export const getMarketAssetData = async page => {
  try {
    const response = await axios.get(
      `${coingeckoBaseURL}${marketRoutes.getMarket}?vs_currency=usd&order=market_cap_desc&per_page=50&page=${page}&sparkline=false&locale=en`,
    );
    console.log('response from market investment api:', response?.data?.length);
    return response?.data;
  } catch (error) {
    console.log('error from market investment api:', error);
    return [];
  }
};
export const getAssetMetadata = async assetName => {
  try {
    const response = await axios.get(
      `${mobulaBaseURL}${marketRoutes.getAsset}?asset=${assetName}`,
    );
    console.log('response from asset api:', response?.data?.length);
    return response?.data?.data;
  } catch (error) {
    console.log('error  from asset api:', error);
    return [];
  }
};
export const getHistoricalData = async (assetName, from) => {
  try {
    const response = await axios.get(
      `${mobulaBaseURL}${marketRoutes.getHistorical}?asset=${assetName}&from=${from}`,
    );
    console.log('response from historical api:', response?.data?.length);
    return response?.data?.data;
  } catch (error) {
    console.log('error  from asset api:', error);
    return [];
  }
};
