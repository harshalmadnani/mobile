// Import the createSlice API from Redux Toolkit
import {createSlice} from '@reduxjs/toolkit';

// This is the initial state of the slice
const initialState = {
  listOfCrypto: [],
  listOfFilteredCrypto: [],
  selectedAssetMetaData: null,
  selectedTimeFramePriceInfo: null,
  selectedAssetWalletHolding: null,
  bestSwappingTrades: null,
  tokenBalanceUSD: null,
  availableBlockchain: [
    'BNB Smart Chain (BEP20)',
    'Polygon',
    'Avalanche C-Chain',
    'Arbitrum',
  ],
};

export const marketSlice = createSlice({
  name: 'market', // This is the name of the slice, we will later use this name to access the slice from the store
  initialState: initialState, // This is the initial state of the slice
  reducers: {
    // All the reducers go here
    setListOfCrypto: (state, action) => {
      state.listOfCrypto = action.payload;
    },
    setFilteredListOfCrypto: (state, action) => {
      state.listOfFilteredCrypto = action.payload;
    },
    setSelectedAssetData: (state, action) => {
      state.selectedAssetMetaData = action.payload;
    },
    setSelectedTimeFramePriceInfo: (state, action) => {
      state.selectedTimeFramePriceInfo = action.payload;
    },
    setSelectedAssetWalletHolding: (state, action) => {
      state.selectedAssetWalletHolding = action.payload;
    },
    setBestSwappingRates: (state, action) => {
      console.log('best rates.....swapping', action.payload);
      state.bestSwappingTrades = action.payload;
    },
    setTokenUsdcBalance: (state, action) => {
      console.log('best rates.....swapping', action.payload);
      state.tokenBalanceUSD = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const marketsAction = marketSlice.actions;

// We export the reducer function so that it can be added to the store
export default marketSlice.reducer;
