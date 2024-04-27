// Import the createSlice API from Redux Toolkit
import {createSlice} from '@reduxjs/toolkit';

// This is the initial state of the slice
const initialState = {
  txToBeExecuted: false,
};

export const depositSlice = createSlice({
  name: 'deposit', // This is the name of the slice, we will later use this name to access the slice from the store
  initialState: initialState, // This is the initial state of the slice
  reducers: {
    // All the reducers go here
    setTxToBeExecuted: (state, action) => {
      state.txToBeExecuted = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const depositAction = depositSlice.actions;

// We export the reducer function so that it can be added to the store
export default depositSlice.reducer;
