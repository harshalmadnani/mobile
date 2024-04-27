import authReducer from './auth';
import marketReducer from './market';
import portfolioReducer from './portfolio';
import depositReducer from './deposit';
const {combineReducers} = require('@reduxjs/toolkit');

export const reducers = combineReducers({
  auth: authReducer,
  market: marketReducer,
  portfolio: portfolioReducer,
  deposit: depositReducer,
});
