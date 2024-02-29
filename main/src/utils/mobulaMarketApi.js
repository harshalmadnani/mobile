import axios from 'axios';

const baseURL = 'https://api.mobula.io/api/1';
const mobulaRoutes = {marketBatch: '/market/query'};
export const getMarketAssetData = async () => {
  try {
    const response = await axios.get(
      `${baseURL}${mobulaRoutes.marketBatch}?filters=volume:10000:&sortBy=market_cap&limit=50`,
    );
    console.log('response from market investment api:', response?.data?.length);
    return response?.data;
  } catch (error) {
    console.log('error from market investment api:', error);
  }
};
