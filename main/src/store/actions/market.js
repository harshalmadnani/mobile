import {
  getAssetMetadata,
  getCommoditiesListData,
  getForexListData,
  getHistoricalData,
  getMarketAssetData,
} from '../../utils/cryptoMarketsApi';
import {getCryptoHoldingForAddress} from '../../utils/cryptoWalletApi';
import {getSmartAccountAddress} from '../../utils/DFNS/walletFLow';
import {
  getAllDinariStocks,
  getAllDinariStocksPriceChange,
} from '../../utils/Dinari/DinariApi';
import {
  getBestCrossSwapRateBuy,
  getDLNTradeCreateBuyOrder,
  getDLNTradeCreateSellOrder,
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
    const data = await getAllDinariStocks(42161);
    const stockIDs = data.map(x => parseInt(x?.stock?.id));
    const stockPriceData = await getAllDinariStocksPriceChange(stockIDs);
    console.log('stocks queryString....', stockPriceData);
    const stockWithPriceChange = data?.map(stock => {
      console.log('stock filter', stockPriceData[0]?.stock_id, stock);
      return {
        ...stock,
        priceInfo: stockPriceData?.filter(
          price => price?.stock_id === stock?.stock?.id,
        )?.[0],
      };
    });
    dispatch(marketsAction.setListOfCrypto(stockWithPriceChange));
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
export const getNameChainId = chain => {
  switch (chain) {
    case '137':
      return 'Polygon';
    case '56':
      return 'Bsc';
    case '42161':
      return 'ArbitrumOne';
    case '8453':
      return 'Base';
  }
};
export const getNetworkOnChainId = chain => {
  switch (chain) {
    case '137':
      return 'Polygon';
    // case '1':
    //   return 'Ethereum';
    case '56':
      return 'BNB Smart Chain (BEP20)';
    case '42161':
      return 'Arbitrum';
    case '8453':
      return 'Base';
  }
};
export const getBestDLNCrossSwapRateBuy = (
  blockchains,
  contractAddress,
  value,
) => {
  return async (dispatch, getState) => {
    const allScw = getState().auth.scw;
    const {bestRate, allRates} = await getBestCrossSwapRateBuy(
      blockchains,
      contractAddress,
      value,
      allScw?.filter(x => x.chainId === '137')?.[0]?.address, //used for same chain
    );

    dispatch(marketsAction.setBestSwappingRates(bestRate));
    dispatch(marketsAction.setAllSwappingTradesQuotes(allRates));
  };
};

export const getBestDLNCrossSwapRateSell = (tokenInfo, value, scw) => {
  return async (dispatch, getState) => {
    console.log('scw....', tokenInfo?.chainId, tokenInfo?.address, scw);
    const bestRate = await getDLNTradeCreateBuyOrder(
      tokenInfo?.chainId,
      tokenInfo?.address,
      value,
      '137',
      '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
      scw,
    );
    console.log('sell to token', bestRate);
    dispatch(marketsAction.setBestSwappingRates(bestRate ?? []));
  };
};
