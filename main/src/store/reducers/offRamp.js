// Import the createSlice API from Redux Toolkit
import {createSlice} from '@reduxjs/toolkit';

// This is the initial state of the slice
const initialState = {
  user: null,
  giftCards: null,
  quoteDetail: null,
  acceptedQuote: null,
  token: null,
};

export const offRampSlice = createSlice({
  name: 'offRamp', // This is the name of the slice, we will later use this name to access the slice from the store
  initialState: initialState, // This is the initial state of the slice
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setGiftCards: (state, action) => {
      state.giftCards = action.payload;
    },
    setQuoteDetail: (state, action) => {
      state.quoteDetail = action.payload;
    },
    acceptQuote: (state, action) => {
      state.acceptedQuote = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const offRampAction = offRampSlice.actions;

// We export the reducer function so that it can be added to the store
export default offRampSlice.reducer;
