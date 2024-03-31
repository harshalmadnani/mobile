import {
  getAssetMetadata,
  getCommoditiesListData,
  getForexListData,
  getHistoricalData,
  getMarketAssetData,
  getStocksListData,
} from '../../utils/cryptoMarketsApi';
import {getCryptoHoldingForAddress} from '../../utils/cryptoWalletApi';
import {
  getBestCrossSwapRateBuy,
  getDLNTradeCreateBuyOrder,
} from '../../utils/DLNTradeApi';
import {marketsAction} from '../reducers/market';

export const getListOfCryptoFromMobulaApi = () => {
  return async (dispatch, getState) => {
    dispatch(marketsAction.setMarketListFetchLoading(true));
    const listOfCrypto = getState().market.listOfCrypto ?? [];
    const data = await getMarketAssetData();
    if (data.length > 0) {
      dispatch(marketsAction.setMarketListFetchLoading(true));
      dispatch(marketsAction.setListOfCrypto(data));
      dispatch(marketsAction.setMarketListFetchLoading(false));
    } else {
      console.log(data);
      dispatch(marketsAction.setListOfCrypto([]));
    }
    dispatch(marketsAction.setMarketListFetchLoading(false));
  };
};
export const getListOfForexFromMobulaApi = () => {
  return async (dispatch, getState) => {
    dispatch(marketsAction.setMarketListFetchLoading(true));
    const data = await getForexListData();
    const forexList = [];
    Object.keys(data).forEach(function (key, index) {
      console.log('index', index);
      forexList.push(data[key]);
    });
    console.log('key object', forexList.length, forexList);
    dispatch(marketsAction.setListOfCrypto(forexList));
    dispatch(marketsAction.setMarketListFetchLoading(false));
  };
};
export const getListOfCommoditiesFromMobulaApi = () => {
  return async (dispatch, getState) => {
    dispatch(marketsAction.setMarketListFetchLoading(true));
    const data = await getCommoditiesListData();

    const commodityList = [];
    Object.keys(data).forEach(function (key, index) {
      console.log('index', index);
      commodityList.push(data[key]);
    });
    console.log('key object commodity', commodityList.length, commodityList);
    dispatch(marketsAction.setListOfCrypto(commodityList));
    dispatch(marketsAction.setMarketListFetchLoading(false));
  };
};
export const getListOfStocksFromMobulaApi = () => {
  return async (dispatch, getState) => {
    dispatch(marketsAction.setMarketListFetchLoading(true));
    const data = await getStocksListData();

    const stockList = [];
    Object.keys(data).forEach(function (key, index) {
      console.log('index', index);
      if (key === '0x407274abb9241da0a1889c1b8ec65359dd9d316d') {
        stockList.push({
          ...data[key],
          symbol: 'Coin',
          name: 'Coinbase Global Inc',
          logo: 'https://res.cloudinary.com/xade-finance/image/upload/v1711428857/s6och6simtaaau32xjq3.png',
        });
      } else {
        stockList.push(data[key]);
      }
    });
    console.log('key object commodity', stockList.length, stockList);
    dispatch(marketsAction.setListOfCrypto(stockList));
    dispatch(marketsAction.setMarketListFetchLoading(false));
  };
};
export const setAssetMetadata = assetName => {
  return async (dispatch, getState) => {
    const data = await getAssetMetadata(
      assetName === 'Coinbase Global Inc'
        ? 'Wrapped Coinbase Global, Inc. Class A Common Stock - Dinari'
        : assetName,
    );
    console.log('coinbase asset data', assetName, data);
    dispatch(marketsAction.setSelectedAssetData(data));
  };
};
export const setHistoricalDataOfSelectedTimeFrame = (
  assetName,
  currentPrice,
  from,
) => {
  return async (dispatch, getState) => {
    const data = await getHistoricalData(assetName, from);
    const priceOnFromDate = data?.price_history[0][1];

    const percentChange =
      ((currentPrice - priceOnFromDate) * 100) / currentPrice;
    dispatch(
      marketsAction.setSelectedTimeFramePriceInfo({
        percentChange,
        from,
        priceOnSelectedDate: priceOnFromDate,
      }),
    );
  };
};

export const getBestDLNCrossSwapRateBuy = (
  blockchains,
  contractAddress,
  value,
) => {
  return async (dispatch, getState) => {
    const evmInfo = getState().portfolio.evmInfo;
    const bestRate = await getBestCrossSwapRateBuy(
      blockchains,
      contractAddress,
      value,
      evmInfo?.smartAccount,
    );

    dispatch(marketsAction.setBestSwappingRates(bestRate));
  };
};
export const getBestDLNCrossSwapRateSell = (tokenInfo, value) => {
  return async (dispatch, getState) => {
    console.log(
      'Same Chain sell.....',
      tokenInfo?.chainId,
      tokenInfo?.address,
      value,
      tokenInfo?.chainId === '137',
      '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
    );
    const bestRate = await getDLNTradeCreateBuyOrder(
      tokenInfo?.chainId,
      tokenInfo?.address,
      value,
      '137',
      '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
    );
    console.log('best rates.....sell', JSON.stringify(bestRate));
    dispatch(marketsAction.setBestSwappingRates(bestRate));
  };
};
