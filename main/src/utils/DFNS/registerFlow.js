import {androidStagingAppId, apiClient, iosStagingAppId} from './utils';
import {XadePasskeysSigner} from './XadePassKeySigner';
import axios from 'axios';
import {PasskeysSigner} from '@dfns/sdk-react-native';
import {BrowserKeySigner, WebAuthnSigner} from '@dfns/sdk-browser';
import {Platform} from 'react-native';

const BASE_URL = 'https://gull-relevant-secretly.ngrok-free.app';

export const checkUserIsDFNSSignedUp = async email => {
  try {
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
    const userInfo = response.data;
    console.log('wallets....', userInfo);
    return userInfo.length > 0
      ? userInfo?.[0]?.isDLNSignedUp
        ? userInfo?.[0]?.isDLNSignedUp
        : 'no-passkey'
      : userInfo?.[0]?.isDLNSignedUp;
  } catch (error) {
    console.log('error on getting wallet', error);
  }
};
export const getUserInfoFromDB = async email => {
  try {
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
    const userInfo = response.data;
    console.log('wallets(from db)....', userInfo);
    return userInfo?.[0];
  } catch (error) {
    console.log('error on getting wallet', error);
  }
};
export const registerUsernameToDFNS = async username => {
  try {
    // Start delegated registration flow. Server needs to obtain the challenge with the appId
    // and appOrigin of the mobile application. For simplicity, they are included as part of
    // the request body. Alternatively, they can be sent as headers or with other approaches.

    const initRes = await axios.post(
      `${BASE_URL}/register/init`,
      {
        appId: Platform.OS === 'ios' ? iosStagingAppId : androidStagingAppId,
        username: username,
      },
      {
        headers: {
          'content-type': 'application/json',
        },
      },
    );
    const challenge = initRes.data;
    console.log('challenge api call done.....1', challenge);
    const passkeys = new PasskeysSigner();
    console.log('pass key initialized........');
    const attestation = await passkeys.create(challenge);
    console.log('attestation==========');

    // // // Finish delegated registration
    const completeRes = await axios.post(
      `${BASE_URL}/register/complete`,
      {
        appId: Platform.OS === 'ios' ? iosStagingAppId : androidStagingAppId,
        signedChallenge: {firstFactorCredential: attestation},
        temporaryAuthenticationToken: challenge.temporaryAuthenticationToken,
      },
      {
        headers: {
          'content-type': 'application/json',
        },
      },
    );
    console.log(
      'signup confirmed==========',
      JSON.stringify(attestation, null, 2),
    );
    return completeRes.data;
  } catch (error) {
    console.log(
      'error on registering(registerUsernameToDFNS)..........',
      error,
    );
    return false;
  } finally {
  }
};
export const getDfnsJwt = async username => {
  try {
    // Start delegated registration flow. Server needs to obtain the challenge with the appId
    // and appOrigin of the mobile application. For simplicity, they are included as part of
    // the request body. Alternatively, they can be sent as headers or with other approaches.

    const res = await axios.post(
      `${BASE_URL}/login`,
      {
        appId: Platform.OS === 'ios' ? iosStagingAppId : androidStagingAppId,
        username: username,
      },
      {
        headers: {
          'content-type': 'application/json',
        },
      },
    );
    const jwt = res.data;
    console.log('jwt.....', jwt);
    return jwt?.token;
  } catch (error) {
    console.log('error on registering(getDfnsJwt)..........', error);
  } finally {
  }
};
