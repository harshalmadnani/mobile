import authReducer from './auth';

const {combineReducers} = require('@reduxjs/toolkit');

export const reducers = combineReducers({
  auth: authReducer,
});
