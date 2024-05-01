// Import the createSlice API from Redux Toolkit
import {createSlice} from '@reduxjs/toolkit';

// This is the initial state of the slice
const initialState = {
  recipientAddress: null,
  assetInfo: null,
  transferAmount: 0,
};

export const transferSlice = createSlice({
  name: 'transfer', // This is the name of the slice, we will later use this name to access the slice from the store
  initialState: initialState, // This is the initial state of the slice
  reducers: {
    setRecipientAddress: (state, action) => {
      state.recipientAddress = action.payload;
    },
    setAssetToTransfer: (state, action) => {
      state.assetInfo = action.payload;
    },
    setTransferAmount: (state, action) => {
      state.transferAmount = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const transferAction = transferSlice.actions;

// We export the reducer function so that it can be added to the store
export default transferSlice.reducer;
