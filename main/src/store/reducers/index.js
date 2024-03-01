import authReducer from './auth';
import marketReducer from './market';
const {combineReducers} = require('@reduxjs/toolkit');

export const reducers = combineReducers({
  auth: authReducer,
  market: marketReducer,
});
