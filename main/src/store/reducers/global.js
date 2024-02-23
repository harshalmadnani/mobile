// Import the createSlice API from Redux Toolkit
import {createSlice} from '@reduxjs/toolkit';

// This is the initial state of the slice
const initialState = {
  withAuth: false,
  loginAccount: null,
  connectAccount: null,
  walletType: null,
  mainnet: false,
  faceID: null,
  balance: 0,
  points: 0,
};

export const global = createSlice({
  name: 'global', // This is the name of the slice, we will later use this name to access the slice from the store
  initialState: initialState, // This is the initial state of the slice
  reducers: {
    // All the reducers go here
    setMainnent: (state, action) => {
      state.mainnet = action.payload;
    },
    setLoginAccount: (state, action) => {
      state.loginAccount = action.payload;
    },
    setConnectAccount: (state, action) => {
      state.connectAccount = action.payload;
    },
    setWalletTpe: (state, action) => {
      state.walletType = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const globalActions = global.actions;

// We export the reducer function so that it can be added to the store
export default global.reducer;
