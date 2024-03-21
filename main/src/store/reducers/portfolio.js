// Import the createSlice API from Redux Toolkit
import {createSlice} from '@reduxjs/toolkit';

// This is the initial state of the slice
const initialState = {
  holdings: null,
  evmInfo: {address: null, smartAccount: null},
  evmTxListInfo: null,
  evmDLNTradesTxListInfo: null,
};

export const portfolioSlice = createSlice({
  name: 'portfolio', // This is the name of the slice, we will later use this name to access the slice from the store
  initialState: initialState, // This is the initial state of the slice
  reducers: {
    // All the reducers go here
    setHoldings: (state, action) => {
      state.holdings = action.payload;
    },
    setEvmWalletInfo: (state, action) => {
      state.evmInfo = action.payload;
    },
    setEvmTxList: (state, action) => {
      state.evmTxListInfo = action.payload;
    },
    setEvmDLNTradeList: (state, action) => {
      state.evmDLNTradesTxListInfo = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const portfolioAction = portfolioSlice.actions;

// We export the reducer function so that it can be added to the store
export default portfolioSlice.reducer;
