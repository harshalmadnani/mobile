// Import the createSlice API from Redux Toolkit
import {createSlice} from '@reduxjs/toolkit';

// This is the initial state of the slice
const initialState = {
  mainnet: false,
  faceID: false,
  isConnected: false,
  address: null,
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
    logout: (state, action) => {
      state.isConnected = false;
      state.address = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const authActions = authSlice.actions;

// We export the reducer function so that it can be added to the store
export default authSlice.reducer;
