// Import the createSlice API from Redux Toolkit
import {createSlice} from '@reduxjs/toolkit';

// This is the initial state of the slice
const initialState = {
  listOfCrypto: [],
  selectedAssetMetaData: null,
  selectedTimeFramePriceInfo: null,
  selectedAssetWalletHolding: null,
};

export const marketSlice = createSlice({
  name: 'market', // This is the name of the slice, we will later use this name to access the slice from the store
  initialState: initialState, // This is the initial state of the slice
  reducers: {
    // All the reducers go here
    setListOfCrypto: (state, action) => {
      state.listOfCrypto = action.payload;
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
  },
});

// Action creators are generated for each case reducer function
export const marketsAction = marketSlice.actions;

// We export the reducer function so that it can be added to the store
export default marketSlice.reducer;
