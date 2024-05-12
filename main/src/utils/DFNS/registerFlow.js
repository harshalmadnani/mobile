import {apiClient} from './utils';
import axios from 'axios';
import {PasskeysSigner} from '@dfns/sdk-react-native';

export const registerUsernameToDFNS = async (event, username) => {
  try {
    // setLoading(true)
    // event.preventDefault();

    // Start delegated registration flow. Server needs to obtain the challenge with the appId
    // and appOrigin of the mobile application. For simplicity, they are included as part of
    // the request body. Alternatively, they can be sent as headers or with other approaches.

    // try {
    const initRes = await axios.post(
      `https://gull-relevant-secretly.ngrok-free.app/register/init`,
      {
        appId: 'ap-572qi-hq31j-8ehbm3773si3lck2',
        username,
      },
      {
        headers: {
          'content-type': 'application/json',
        },
      },
    );
    const challenge = initRes.data;
    console.log('challenge api call done.....', challenge);
    const passkeys = new PasskeysSigner();
    console.log('pass key initialized........');
    const attestation = await passkeys.create(challenge);
    console.log(
      'attestation==========',
      JSON.stringify({
        appId: 'ap-572qi-hq31j-8ehbm3773si3lck2',
        signedChallenge: {firstFactorCredential: attestation},
        temporaryAuthenticationToken: challenge.temporaryAuthenticationToken,
      }),
    );

    // // Finish delegated registration
    const completeRes = await axios.post(
      `https://gull-relevant-secretly.ngrok-free.app/register/complete`,
      {
        appId: 'ap-572qi-hq31j-8ehbm3773si3lck2',
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
    // setResponse(await completeRes.json());
    // setError(undefined);
  } catch (error) {
    console.log('error on registering..........', error);
    // setResponse(undefined);
    // setError(error);
  } finally {
    // setLoading(false);
  }
};
