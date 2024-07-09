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
        'X-User-Id': 'e139d82f-d688-4d64-abaa-7e19d7c684ef', // taken from 1st user created, cant find user ID
      };

      const respone = await axios.get(
        'https://sandbox.mudrex.com/api/v1/user/client_user?user_uuid=e139d82f-d688-4d64-abaa-7e19d7c684ef',
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
      // console.log("!!!!",user)
      const user = getState().offRamp.user;
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

      const data = {
        user_uuid: userId,
        client_user_id: partnerUserId,
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

export const acceptGiftCardOrder = () => {
  return async (dispatch, getState) => {
    //raw data

    const quoteId = getState().offRamp.quoteDetail;
    console.log('QUOTE ID =>', quoteId);
    try {
      const response = await axios.post(
        URL.ACCEPT_GIFT_CARD,
        {
          quoteId: quoteId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('accept status =>', response.status);

      if (response.status === 201) {
        console.log('Order submitted successfully:', response.data);
      } else {
        console.error('Failed to submit order');
        console.log('Status =>->', response);
        console.log('accept status =>', response.status);
      }
    } catch (error) {
      console.error(
        'Error actions/offRamp/submitGiftCardOrder function:',
        error,
      );
    }
  };
};
