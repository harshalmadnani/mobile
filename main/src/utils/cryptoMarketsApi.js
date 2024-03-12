import axios from 'axios';

const coingeckoBaseURL = 'https://api.coingecko.com/api/v3';
const mobulaBaseURL = 'https://api.mobula.io/api/1';
const marketRoutes = {
  getMarket: '/coins/markets',
  getAsset: '/metadata',
  getHistorical: '/market/history',
  getMarketData: '/market/multi-data',
};
export const getMarketAssetData = async page => {
  try {
    const response = await axios.get(
      `${coingeckoBaseURL}${marketRoutes.getMarket}?vs_currency=usd&order=market_cap_desc&per_page=50&page=${page}&sparkline=false&locale=en`,
    );
    return response?.data;
  } catch (error) {
    console.log(
      'error from market investment api:',
      `${coingeckoBaseURL}${marketRoutes.getMarket}?vs_currency=usd&order=market_cap_desc&per_page=50&page=${page}&sparkline=false&locale=en`,
      error,
    );
    return [];
  }
};
// First create an api call to get the desired data in utils/CryptoMarketsApi.js

export const getAssetMetadata = async assetName => {
  try {
    const response = await axios.get(
      `${mobulaBaseURL}${marketRoutes.getAsset}?asset=${assetName}`,
      {
        headers: {Authorization: 'e26c7e73-d918-44d9-9de3-7cbe55b63b99'},
      },
    );
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
      {
        headers: {Authorization: 'e26c7e73-d918-44d9-9de3-7cbe55b63b99'},
      },
    );
    return response?.data?.data;
  } catch (error) {
    console.log('error  from asset api:', error);
    return [];
  }
};
export const getMarketData = async assets => {
  try {
    const response = await axios.get(
      `${mobulaBaseURL}${marketRoutes.getMarketData}?assets=${assets}`,
      {
        headers: {Authorization: 'e26c7e73-d918-44d9-9de3-7cbe55b63b99'},
      },
    );
    return response?.data?.data;
  } catch (error) {
    console.log('error  from asset api:', error);
    return [];
  }
};
export const getForexListData = async assets => {
  try {
    const response = await axios.get(
      `${mobulaBaseURL}/market/multi-data?assets=0xdc3326e71d45186f113a2f448984ca0e8d201995,0xcdb3867935247049e87c38ea270edd305d84c9ae,0xe6a537a407488807f0bbeb0038b79004f19dddfb`,
      {
        headers: {Authorization: 'e26c7e73-d918-44d9-9de3-7cbe55b63b99'},
      },
    );
    console.log('forex data....', response.data);
    return response?.data?.data;
  } catch (error) {
    console.log('error  from asset api:', error);
    return [];
  }
};
