// Import the createSlice API from Redux Toolkit
import {createSlice} from '@reduxjs/toolkit';

// This is the initial state of the slice
const initialState = {
  mainnet: false,
  faceID: false,
  isConnected: false,
  address: null,
  //new flow setup
  email: null,
  scw: [],
  wallets: [],
  name: '',
  DFNSToken: '',
  currency: null,
  country: null,
  currency_name: null,
  exchRate: 0,
};

export const authSlice = createSlice({
  name: 'auth', // This is the name of the slice, we will later use this name to access the slice from the store
  initialState: initialState, // This is the initial state of the slice
  reducers: {
    // All the reducers go here
    setMainnet: (state, action) => {
      state.mainnet = action.payload;
    },
    setFaceID: (state, action) => {
      state.faceID = action.payload;
    },
    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },
    setEOAAddress: (state, action) => {
      state.address = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setScw: (state, action) => {
      state.scw = action.payload;
    },
    setWallet: (state, action) => {
      state.wallets = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setDfnsToken: (state, action) => {
      state.DFNSToken = action.payload;
    },
    setCurrency: (state, action) => {
      state.currency = action.payload;
    },
    setCountry: (state, action) => {
      state.country = action.payload;
    },
    setCurrencyName: (state, action) => {
      state.currency_name = action.payload;
    },
    setExchangeRate: (state, action) => {
      state.exchRate = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const authActions = authSlice.actions;

// We export the reducer function so that it can be added to the store
export default authSlice.reducer;
