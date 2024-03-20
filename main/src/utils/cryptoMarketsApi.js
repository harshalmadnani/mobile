import axios from 'axios';

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
      'https://api.mobula.io/api/1/market/query?filters=volume:10000:&sortBy=market_cap&limit=100',
    );
    console.log('market data.....', response?.data?.length);
    return response?.data;
  } catch (error) {
    console.log('error from market investment api:', error);
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
      `${mobulaBaseURL}/market/multi-data?assets=0xC891EB4cbdEFf6e073e859e987815Ed1505c2ACD,0xdc3326e71d45186f113a2f448984ca0e8d201995,0xcdb3867935247049e87c38ea270edd305d84c9ae,0xe4095d9372e68d108225c306a4491cacfb33b097`,
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
export const getCommoditiesListData = async assets => {
  try {
    const response = await axios.get(
      `${mobulaBaseURL}/market/multi-data?assets=0xA6da8C8999c094432c77E7d318951D34019AF24B,0x57fCbd6503C8BE3B1AbAD191Bc7799ef414A5b31,0x2e6978ceea865948f4c5685e35aec72652e3cb88`,
      {
        headers: {Authorization: 'e26c7e73-d918-44d9-9de3-7cbe55b63b99'},
      },
    );
    console.log('commodities data....', response.data);
    return response?.data?.data;
  } catch (error) {
    console.log('error  from asset api:', error);
    return [];
  }
};
export const getStocksListData = async assets => {
  try {
    const response = await axios.get(
      `${mobulaBaseURL}/market/multi-data?assets=0x407274abb9241da0a1889c1b8ec65359dd9d316d`,
      {
        headers: {Authorization: 'e26c7e73-d918-44d9-9de3-7cbe55b63b99'},
      },
    );
    console.log('commodities data....', response.data);
    return response?.data?.data;
  } catch (error) {
    console.log('error  from asset api:', error);
    return [];
  }
};
export const searchCryptoByName = async text => {
  try {
    const response = await axios.get(`${mobulaBaseURL}/search?input=${text}`, {
      headers: {Authorization: 'e26c7e73-d918-44d9-9de3-7cbe55b63b99'},
    });
    console.log('search data....', response.data);
    return response?.data?.data;
  } catch (error) {
    console.log('error  from asset api:', error);
    return [];
  }
};
