import axios from 'axios';
import {depositAction} from '../reducers/deposit';
import {resolve} from 'path';
const Crypto = require('crypto-js');

export const SABER_CONSTANTS = {
  client_id: 'b3e15eb9-3936-41c4-a3a7-2dbbf3f2781b',
  client_secret: 'ti6uE^Zcb2FavXN9UaZoUwL@lbK3ZE5SN7*Lk&ek',
};

export const getCurrentTimestampInSeconds = () => {
  return Math.floor(Date.now() / 1000).toString();
};

const isUserExistsForSaber = async email => {
  const response = await axios.get(
    `https://srjnswibpbnrjufgqbmq.supabase.co/rest/v1/dfnsUsers?email=eq.${email}`,
    {
      headers: {
        apiKey:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyam5zd2licGJucmp1ZmdxYm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEyOTE0NjgsImV4cCI6MjAyNjg2NzQ2OH0.w_WrPPnSX2j4tnAFxV1y2XnU0ffWpZkrkPLmNMsSmko',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyam5zd2licGJucmp1ZmdxYm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEyOTE0NjgsImV4cCI6MjAyNjg2NzQ2OH0.w_WrPPnSX2j4tnAFxV1y2XnU0ffWpZkrkPLmNMsSmko',
      },
    },
  );

  const saberUserId = await response?.data[0]?.saberUserId;
  console.log('User dAT@@@', saberUserId);
  //Returns true if userId exists (if there is length)
  return saberUserId;
};

export const isKycVerified = async email => {
  try {
    const Saberconfig = {
      headers: {
        apikey:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyam5zd2licGJucmp1ZmdxYm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEyOTE0NjgsImV4cCI6MjAyNjg2NzQ2OH0.w_WrPPnSX2j4tnAFxV1y2XnU0ffWpZkrkPLmNMsSmko',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyam5zd2licGJucmp1ZmdxYm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEyOTE0NjgsImV4cCI6MjAyNjg2NzQ2OH0.w_WrPPnSX2j4tnAFxV1y2XnU0ffWpZkrkPLmNMsSmko',
        'Content-Type': 'application/json',
      },
    };
    const response = await axios.get(
      `https://srjnswibpbnrjufgqbmq.supabase.co/rest/v1/dfnsUsers?email=eq.${email}`,
      Saberconfig,
    );
    const saberUserId = response.data[0].saberUserId;
    console.log('saber User id FOR KYC =>', saberUserId);
    const timeStampinSeconds = getCurrentTimestampInSeconds();
    const sigString =
      SABER_CONSTANTS.client_id + timeStampinSeconds + saberUserId;
    const secret = Crypto.HmacSHA256(sigString, SABER_CONSTANTS.client_secret);

    // Define the headers
    const headers = {
      'X-Timestamp': timeStampinSeconds,
      'X-Client-Id': SABER_CONSTANTS.client_id, // Replace with your actual client ID
      'X-Secret-Key': secret, // Replace with your actual secret key (if needed)
      'X-Request-Id': '123456789876', // Replace with your actual request ID
      'X-User-Id': saberUserId,
    };

    const respone = await axios.get(
      'https://sandbox.mudrex.com/api/v1/user/client_user',
      {headers},
    );
    const kycStatus = respone.data?.data?.kyc_status;
    // console.log('KYC =>', respone.data);
    console.log(`RETRIEVING KYC STATUS FOR ${saberUserId} : `, kycStatus);
    if (kycStatus === 'Unverified') {
      return false;
    } else {
      return true;
    }
  } catch (err) {
    console.log(err);
  }
};

export const createSaberUser = () => {
  return async (dispatch, getState) => {
    try {
      const email = getState().auth.email;
      console.log('emaaaail from getState.auth.email=>', email);

      const timeStampinSeconds = getCurrentTimestampInSeconds();
      const sigString = SABER_CONSTANTS.client_id + timeStampinSeconds;
      const secret = Crypto.HmacSHA256(
        sigString,
        SABER_CONSTANTS.client_secret,
      );
      const headers = {
        'X-Timestamp': timeStampinSeconds,
        'X-Client-Id': SABER_CONSTANTS.client_id,
        'X-Secret-Key': secret,
        'X-Request-Id': '123456709876',
        'Content-Type': 'application/json',
      };
      //400 error means it already exists.
      const data = {
        //  user_uuid: userId,
        client_user_id: email,
        email: email,
      };

      //USER CREATION RESPOSE => {"data": {"client_user_id": "", "user_id": "e139d82f-d688-4d64-abaa-7e19d7c684ef"}, "success": true}
      //{"data": {"client_user_id": "jopilis382@atebin.com", "user_id": "299ff36e-198b-4190-8fa8-09c8cd720b88"}, "success": true}

      const saberId = await isUserExistsForSaber(email);

      if (saberId.length === 0) {
        console.log('SABER CREATING USER headers:', headers, '\n Data: ', data);

        const response = await axios.post(
          'https://sandbox.mudrex.com/api/v1/user/client_user',

          data,
          {
            headers,
          },
        );

        //UPDATING SUPABASE WITH SABER USER ID AFTER CREATION.

        const SaberData = {
          saberUserId: response?.data?.data?.user_id,
        };
        const Saberconfig = {
          headers: {
            apikey:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyam5zd2licGJucmp1ZmdxYm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEyOTE0NjgsImV4cCI6MjAyNjg2NzQ2OH0.w_WrPPnSX2j4tnAFxV1y2XnU0ffWpZkrkPLmNMsSmko',
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyam5zd2licGJucmp1ZmdxYm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEyOTE0NjgsImV4cCI6MjAyNjg2NzQ2OH0.w_WrPPnSX2j4tnAFxV1y2XnU0ffWpZkrkPLmNMsSmko',
            'Content-Type': 'application/json',
          },
        };

        await axios.patch(
          `https://srjnswibpbnrjufgqbmq.supabase.co/rest/v1/dfnsUsers?email=eq.${email}`,
          SaberData,
          Saberconfig,
        );

        console.log('Saber user ID updated in supabase');
        console.log('USER CREATION RESPOSE =>', response.data);

        dispatch(depositAction.setSaberUser(response?.data?.data?.user_id));

        console.log('################');
      } else {
        console.log('User is already registered for SABER : ', saberId);
      }
    } catch (err) {
      console.log('DEPOSIT CREATE USER ERRROR: ', err);
      if (err.response.status === 400) {
        console.log('User already exists');
      }
    }
  };
};

export const fetchSaberBuyPrice = amount => {
  return async (dispatch, getState) => {
    const email = getState().auth.email;
    try {
      const Saberconfig = {
        headers: {
          apikey:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyam5zd2licGJucmp1ZmdxYm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEyOTE0NjgsImV4cCI6MjAyNjg2NzQ2OH0.w_WrPPnSX2j4tnAFxV1y2XnU0ffWpZkrkPLmNMsSmko',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyam5zd2licGJucmp1ZmdxYm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEyOTE0NjgsImV4cCI6MjAyNjg2NzQ2OH0.w_WrPPnSX2j4tnAFxV1y2XnU0ffWpZkrkPLmNMsSmko',
          'Content-Type': 'application/json',
        },
      };
      const saberResponse = await axios.get(
        `https://srjnswibpbnrjufgqbmq.supabase.co/rest/v1/dfnsUsers?email=eq.${email}`,
        Saberconfig,
      );
      const saberUserId = saberResponse.data[0].saberUserId;
      const timeStampinSeconds = getCurrentTimestampInSeconds();
      const sigString =
        SABER_CONSTANTS.client_id + timeStampinSeconds + saberUserId;

      const secret = Crypto.HmacSHA256(
        sigString,
        SABER_CONSTANTS.client_secret,
      );

      const headers = {
        'X-Timestamp': timeStampinSeconds,
        'X-Client-Id': SABER_CONSTANTS.client_id,
        'X-Request-Id': '3456',
        'X-User-Id': saberUserId,
        'X-Secret-Key': secret,
      };

      const response = await axios.get(
        `https://sandbox.mudrex.com/api/v2/wallet/w/quote?from_currency=INR&to_currency=USDT&network=MATIC&from_amount=${amount}`,
        {headers},
      );
      console.log(response.data);
      dispatch(depositAction.setSaberBuyPrice(response.data.data.total_fee));
    } catch (err) {
      console.log('error while fetching buy price saber: ', err);
    }
  };
};

export const fetchBeneficiary = () => {
  //X-SECRET FAILING FOR BOTH
  return async (dispatch, getState) => {
    const email = getState().auth.email;
    try {
      const Saberconfig = {
        headers: {
          apikey:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyam5zd2licGJucmp1ZmdxYm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEyOTE0NjgsImV4cCI6MjAyNjg2NzQ2OH0.w_WrPPnSX2j4tnAFxV1y2XnU0ffWpZkrkPLmNMsSmko',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyam5zd2licGJucmp1ZmdxYm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEyOTE0NjgsImV4cCI6MjAyNjg2NzQ2OH0.w_WrPPnSX2j4tnAFxV1y2XnU0ffWpZkrkPLmNMsSmko',
          'Content-Type': 'application/json',
        },
      };
      const saberResponse = await axios.get(
        `https://srjnswibpbnrjufgqbmq.supabase.co/rest/v1/dfnsUsers?email=eq.${email}`,
        Saberconfig,
      );
      const saberUserId = saberResponse.data[0].saberUserId;

      const timeStampinSeconds = getCurrentTimestampInSeconds();
      const sigString =
        SABER_CONSTANTS.client_id + timeStampinSeconds + saberUserId;

      console.log(sigString);
      const secret = Crypto.HmacSHA256(
        sigString,
        SABER_CONSTANTS.client_secret,
      );
      const headers = {
        'X-Timestamp': timeStampinSeconds,
        'X-Client-Id': SABER_CONSTANTS.client_id,
        'X-Request-Id': '4',
        'X-Secret-Key': secret,
      };

      const respone = await axios.get(
        'https://sandbox.mudrex.com/api/v1/wallet/conversion/fiat/methods/UPI/beneficiary?type=buy&fiat=INR&crypto=USDT',
        {headers},
      );

      console.log('fetchBeneficiary => ', respone.data);
    } catch (err) {
      console.log('fetchBeneficiary error', err);
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
      const sigString =
        SABER_CONSTANTS.client_id +
        timeStampinSeconds +
        '299ff36e-198b-4190-8fa8-09c8cd720b88';
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
        payment_method: 'bank_transfer',
        crypto_wallet_address: userWallet[0].address,
        network: 'MATIC',
      };

      const response = await axios.post(
        'https://sandbox.mudrex.com/api/v1/wallet/crypto/buy/',
        data,
        {headers},
      );
      console.log(response.data);
      dispatch(depositAction.setSaberBuyPrice(response.data.data));
    } catch (err) {
      console.log('error while creating buy price saber: ', err);
    }
  };
};
