import axios from 'axios';
import {depositAction} from '../reducers/deposit';
const Crypto = require('crypto-js');

export const SABER_CONSTANTS = {
  client_id: 'b3e15eb9-3936-41c4-a3a7-2dbbf3f2781b',
  client_secret: 'ti6uE^Zcb2FavXN9UaZoUwL@lbK3ZE5SN7*Lk&ek',
};

export const getCurrentTimestampInSeconds = () => {
  return Math.floor(Date.now() / 1000).toString();
};

export const retrieveSaberUser = () => {
  return async (dispatch, getState) => {
    try {
      const saberUserId = getState().deposit.saberUser;
      const timeStampinSeconds = getCurrentTimestampInSeconds();
      const sigString = SABER_CONSTANTS.client_id + timeStampinSeconds;
      const secret = Crypto.HmacSHA256(
        sigString,
        SABER_CONSTANTS.client_secret,
      );

      // Define the headers
      const headers = {
        'X-Timestamp': timeStampinSeconds,
        'X-Client-Id': SABER_CONSTANTS.client_id, // Replace with your actual client ID
        'X-Secret-Key': secret, // Replace with your actual secret key (if needed)
        'X-Request-Id': '123456789876', // Replace with your actual request ID
        'X-User-Id': saberUserId, // taken from 1st user created, cant find what is userID in docs
      };

      const respone = await axios.get(
        'https://sandbox.mudrex.com/api/v1/user/client_user',
        {headers},
      );

      console.log('RETRIEVING SABER USER', respone.data);
      dispatch(depositAction.setSaberUser(respone.data?.data?.user_uuid));
    } catch (err) {
      console.log(err);
    }
  };
};

export const createSaberUser = () => {
  return async (dispatch, getState) => {
    console.log('###### USER CREATION DEPOSIT FLOW');
    try {
      const user = getState().offRamp.user;
      console.log('!!!!', user);
      const email = getState().auth.email;
      const userId = user?._id;
      const partnerUserId = user?.ref_partnerId;

      const timeStampinSeconds = getCurrentTimestampInSeconds();
      const sigString = SABER_CONSTANTS.client_id + timeStampinSeconds;
      const secret = Crypto.HmacSHA256(
        sigString,
        SABER_CONSTANTS.client_secret,
      );
      const headers = {
        'X-Timestamp': timeStampinSeconds,
        'X-Client-Id': SABER_CONSTANTS.client_id, // Replace with your actual client ID
        'X-Secret-Key': secret, // Replace with your actual secret key
        'X-Request-Id': '123456709876',
        'Content-Type': 'application/json', // Specify the content type for the request
      };
      //400 PE REPEAT.

      const data = {
        //  user_uuid: userId,
        client_user_id: email,
        email: email,
      };

      //USER CREATION RESPOSE => {"data": {"client_user_id": "", "user_id": "e139d82f-d688-4d64-abaa-7e19d7c684ef"}, "success": true}

      console.log('SABER CREATING USER headers:', headers, '\n Data: ', data);
      console.log(userId, email, partnerUserId);

      const response = await axios.post(
        'https://sandbox.mudrex.com/api/v1/user/client_user',

        data,
        {
          headers,
        },
      );

      console.log('USER CREATION RESPOSE =>', response.data);

      dispatch(depositAction.setSaberUser(response?.data?.data?.user_id));

      console.log('################');
    } catch (err) {
      console.log('DEPOSIT CREATE USER ERRROR: ', err);
    }
  };
};

export const fetchSaberBuyPrice = amount => {
  return async (dispatch, getState) => {
    try {
      const timeStampinSeconds = getCurrentTimestampInSeconds();
      const sigString = SABER_CONSTANTS.client_id + timeStampinSeconds;
      const secret = Crypto.HmacSHA256(
        sigString,
        SABER_CONSTANTS.client_secret,
      );

      const headers = {
        'X-Timestamp': timeStampinSeconds,
        'X-Client-Id': SABER_CONSTANTS.client_id,
        'X-Request-Id': '1234567',
        'X-User-Id': 'e139d82f-d688-4d64-abaa-7e19d7c684ef',
        'X-Secret-Key': secret,
      };
      const params = {
        from_currency: 'INR',
        to_currency: 'USDC',
        network: 'MATIC',
        from_amount: amount,
      };

      const response = await axios.get(
        'https://sandbox.mudrex.com/api/v2/wallet/w/quote',
        {headers, params},
      );
      dispatch(depositAction.setSaberBuyPrice(response.data.data.total_fee));
    } catch (err) {
      console.log('error while fetching buy price saber: ', err);
    }
  };
};

export const createSaberBuyOrder = amount => {
  return async (dispatch, getState) => {
    try {
      const saberUserId = getState().deposit.saberUser;
      const wallets = getState().auth.scw;

      const userWallet = wallets.filter(x => x?.chainId === '137');

      const timeStampinSeconds = getCurrentTimestampInSeconds();
      const sigString = SABER_CONSTANTS.client_id + timeStampinSeconds;
      const secret = Crypto.HmacSHA256(
        sigString,
        SABER_CONSTANTS.client_secret,
      );

      const headers = {
        'X-Timestamp': timeStampinSeconds,
        'X-Client-Id': SABER_CONSTANTS.client_id,
        'X-Request-Id': '1234567',
        'X-User-Id': saberUserId,
        'X-Secret-Key': secret,
      };
      const data = {
        from_currency: 'INR',
        to_currency: 'USDC',
        to_amount: amount,
        source_id: 'c41f7d27-781c-41da-b74c-278fe7202af5', //I Dont know where to get this from, it doesnt come when fetchingBuyPrice
        payment_method: 'upi_transfer',
        crypto_wallet_address: userWallet[0].address,
        network: 'MATIC',
      };

      const response = await axios.post(
        'https://sandbox.mudrex.com/api/v1/wallet/crypto/buy/',
        data,
        {headers},
      );
      dispatch(depositAction.setSaberBuyPrice(response.data.data.total_fee));
    } catch (err) {
      console.log('error while fetching buy price saber: ', err);
    }
  };
};
