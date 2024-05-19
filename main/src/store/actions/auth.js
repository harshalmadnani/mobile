import axios from 'axios';
// import {
//   // connectWithAuthCore,
//   // depolyAAAndGetSCAddress,
//   // getUserAddressFromAuthCoreSDK,
//   // getUserInfoFromAuthCore,
//   // initializedAuthCore,
//   isLoggedIn,
//   particleAuthCoreLogout,
// } from '../../utils/particleCoreSDK';
import {globalActions} from '../reducers/global';
import {PNAccount} from '../../Models/PNAccount';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authActions} from '../reducers/auth';
import {getEvmAddresses} from '../actions/portfolio';
import {
  checkUserIsDFNSSignedUp,
  getDfnsJwt,
  getUserInfoFromDB,
} from '../../utils/DFNS/registerFlow';

export const registerUserToDB = () => {
  return async dispatch => {};
};
export const checkNameOnSCWAddress = async (navigation, scwAddress, email) => {
  // return async dispatch => {
  global.withAuth = true;
  // const isConnected = await isLoggedIn();
  // if (isConnected) {
  //   try {
  //     // const scwAddress = response?.data?.toLowerCase();
  //     console.log('name look up data......', scwAddress);
  //     const nameResponse = await axios.get(
  //       `https://srjnswibpbnrjufgqbmq.supabase.co/rest/v1/users?evmSmartAccount=eq.${scwAddress}`,
  //       {
  //         headers: {
  //           apiKey:
  //             'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyam5zd2licGJucmp1ZmdxYm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEyOTE0NjgsImV4cCI6MjAyNjg2NzQ2OH0.w_WrPPnSX2j4tnAFxV1y2XnU0ffWpZkrkPLmNMsSmko',
  //           Authorization:
  //             'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyam5zd2licGJucmp1ZmdxYm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEyOTE0NjgsImV4cCI6MjAyNjg2NzQ2OH0.w_WrPPnSX2j4tnAFxV1y2XnU0ffWpZkrkPLmNMsSmko',
  //         },
  //       },
  //     );
  //     const userResponse = await nameResponse?.data;
  //     console.log(
  //       'name look up data...... scw name...',
  //       nameResponse?.data,
  //       userResponse[0]?.name,
  //     );
  //     if (
  //       // userResponse === '' ||
  //       // userResponse.length === 0 ||
  //       // userResponse.toLowerCase() === email.toLowerCase() ||
  //       userResponse[0]?.name
  //     ) {
  //       global.loginAccount.name = userResponse[0]?.name;
  //       return true;
  //     } else {
  //       console.log('Here....', userResponse);
  //       navigation.push('EnterName');
  //       return;
  //     }
  //   } catch (error) {
  //     console.log('Here....Error', error?.response?.data);
  //     if (error?.response?.data === 'wallet address was not found') {
  //       navigation.push('EnterName');
  //       return;
  //     }
  //   }
  // } else {
  //   navigation.navigate('Error');
  //   return;
  // }
  // };
};
export const onAuthCoreLogin = navigation => {
  return async dispatch => {
    global.mainnet = true;
    dispatch(globalActions.setMainnent(true));
    // initializedAuthCore();
    navigation.navigate('Loading');
    try {
      // const userInfo = await connectWithAuthCore(navigation);
      // if (userInfo) {
      //   console.log('user info......', userInfo);
      //   let email = userInfo.email?.toLowerCase()
      //     ? userInfo.email?.toLowerCase()
      //     : userInfo.googleEmail
      //     ? userInfo.googleEmail
      //     : userInfo.phone;
      //   const name = userInfo.name ? userInfo.name : 'Not Set';
      //   const address = await getUserAddressFromAuthCoreSDK();
      //   let mobileLogin = false;
      //   if (email[0] === '+') {
      //     mobileLogin = true;
      //   }
      //   try {
      //     const response = await axios.get(
      //       `https://srjnswibpbnrjufgqbmq.supabase.co/rest/v1/users?email=eq.${email}`,
      //       {
      //         headers: {
      //           apiKey:
      //             'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyam5zd2licGJucmp1ZmdxYm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEyOTE0NjgsImV4cCI6MjAyNjg2NzQ2OH0.w_WrPPnSX2j4tnAFxV1y2XnU0ffWpZkrkPLmNMsSmko',
      //           Authorization:
      //             'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyam5zd2licGJucmp1ZmdxYm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEyOTE0NjgsImV4cCI6MjAyNjg2NzQ2OH0.w_WrPPnSX2j4tnAFxV1y2XnU0ffWpZkrkPLmNMsSmko',
      //         },
      //       },
      //     );
      //     console.log('look up data......supa base', response?.data?.[0]);
      //     if (response?.data?.length) {
      //       global.loginAccount = new PNAccount(
      //         email,
      //         name,
      //         address,
      //         response?.data?.[0]?.evmSmartAccount,
      //         userInfo.wallets[0].uuid
      //           ? userInfo.wallets[0].uuid
      //           : userInfo.uuid,
      //       );
      //       const status = await checkNameOnSCWAddress(
      //         navigation,
      //         response?.data?.[0]?.evmSmartAccount,
      //         email,
      //       );
      //       console.log('look up data......supa base status', status);
      //       if (status) {
      //         dispatch(getEvmAddresses());
      //         navigation.navigate('Portfolio');
      //       }
      //     } else {
      //       const scw = await depolyAAAndGetSCAddress();
      //       console.log('scw address.....', scw);
      //       if (scw) {
      //         global.loginAccount = new PNAccount(
      //           email,
      //           name,
      //           address,
      //           scw,
      //           userInfo.wallets[0].uuid
      //             ? userInfo.wallets[0].uuid
      //             : userInfo.uuid,
      //         );
      //         const status = await checkNameOnSCWAddress(
      //           navigation,
      //           scw,
      //           email,
      //         );
      //         if (status) {
      //           dispatch(getEvmAddresses());
      //           navigation.navigate('Portfolio');
      //         }
      //       } else {
      //         navigation.navigate('Error');
      //       }
      //     }
      //   } catch (error) {
      //     console.log('error in lookup.....', error?.response);
      //     if (error?.response?.data === 'Email Address was not found') {
      //       console.log('Create a new once AA flow........');
      //       const scw = await depolyAAAndGetSCAddress();
      //       if (scw) {
      //         global.loginAccount = new PNAccount(
      //           email,
      //           name,
      //           address,
      //           scw,
      //           userInfo.wallets[0].uuid
      //             ? userInfo.wallets[0].uuid
      //             : userInfo.uuid,
      //         );
      //         const status = await checkNameOnSCWAddress(
      //           navigation,
      //           scw,
      //           email,
      //         );
      //         if (status) {
      //           dispatch(getEvmAddresses());
      //           navigation.navigate('Portfolio');
      //         }
      //       } else {
      //         navigation.navigate('Error');
      //       }
      //     }
      //   }
      // }
    } catch (error) {
      console.log('here cancel error');
      navigation.navigate('LoggedOutHome');
    }
  };
};
export const onIsLoginCheckAuthCore = (
  navigation,
  mainnet,
  faceID,
  connected,
  setLoadingText,
) => {
  return async dispatch => {
    if (!mainnet) {
      await AsyncStorage.setItem('mainnet', JSON.stringify(true));
      dispatch(authActions.setMainnet(true));
    }
    if (!faceID) {
      await AsyncStorage.setItem('faceID', JSON.stringify(false));
      dispatch(authActions.setFaceID(false));
    }
    if (!connected) {
      await AsyncStorage.setItem('isConnected', JSON.stringify(false));
      dispatch(authActions.setIsConnected(true));
    }
    global.faceID = faceID;
    console.log('FaceID Enabled:', faceID);
    global.mainnet = mainnet;
    // initializedAuthCore();
    // const isConnected = await isLoggedIn();
    // console.log(
    //   isConnected ? 'Logged In' : 'Not Logged In',
    //   isConnected,
    //   faceID,
    // );
    // if (isConnected) {
    //   if (faceID) {
    //     // faceId flow
    //   } else {
    //     let userInfo = await getUserInfoFromAuthCore();
    //     userInfo = JSON.parse(userInfo);
    //     console.log('user...!', userInfo?.email);
    //     let email = userInfo?.email
    //       ? userInfo.email?.toLowerCase()
    //       : userInfo.phone
    //       ? userInfo.phone
    //       : userInfo.googleEmail?.toLowerCase();
    //     console.log('Phone/Email:', email);
    //     const uuid = userInfo.wallets[0].uuid;
    //     const address = await getUserAddressFromAuthCoreSDK();
    //     console.log('address ====:', address);
    //     if (address) {
    //       await AsyncStorage.setItem('address', address);
    //     }
    //     dispatch(authActions.setEOAAddress(address));
    //     setLoadingText('Fetching User Info...');
    //     if (email.includes('@')) {
    //       try {
    //         const response = await axios.get(
    //           `https://srjnswibpbnrjufgqbmq.supabase.co/rest/v1/users?email=eq.${email}`,
    //           {
    //             headers: {
    //               apiKey:
    //                 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyam5zd2licGJucmp1ZmdxYm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEyOTE0NjgsImV4cCI6MjAyNjg2NzQ2OH0.w_WrPPnSX2j4tnAFxV1y2XnU0ffWpZkrkPLmNMsSmko',
    //               Authorization:
    //                 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyam5zd2licGJucmp1ZmdxYm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEyOTE0NjgsImV4cCI6MjAyNjg2NzQ2OH0.w_WrPPnSX2j4tnAFxV1y2XnU0ffWpZkrkPLmNMsSmko',
    //             },
    //           },
    //         );
    //         console.log('check user...', response?.data, response?.data.length);
    //         if (response?.data.length) {
    //           // console.log('here', emailResponse?.data);
    //           // if (emailResponse?.data === 0) {
    //           //   navigation.push('LoggedOutHome');
    //           // }
    //           // const name = await axios.get(
    //           //   `https://user.api.xade.finance/polygon?address=${emailResponse?.data.toLowerCase()}`,
    //           // );
    //           if (response?.data?.[0]?.name) {
    //             console.log('here', response?.data?.[0]?.name);
    //             global.loginAccount = new PNAccount(
    //               email,
    //               response?.data?.[0]?.name,
    //               address,
    //               response?.data?.[0]?.evmSmartAccount,
    //               uuid,
    //             );
    //             global.withAuth = true;
    //             dispatch(getEvmAddresses());
    //             navigation.navigate('Portfolio');
    //           } else {
    //             navigation.push('LoggedOutHome');
    //           }
    //         } else {
    navigation.push('LoggedOutHome');
    //         }
    //       } catch (error) {
    //         console.log('error', error?.response?.data);
    //         navigation.push('LoggedOutHome');
    //       }
    //     } else {
    //     }
    //   }
    // } else {
    //   console.log('Third Nav');
    //   console.log('Not Connected Either');
    //   navigation.push('LoggedOutHome');
    //   console.log('Navigating To Home');
    // }
  };
};

export const autoLogin = (navigation, email) => {
  return async dispatch => {
    const status = await checkUserIsDFNSSignedUp(email);
    if (status) {
      const token = await getDfnsJwt(email);
      const user = await getUserInfoFromDB(email);
      console.log('info from db......', token, user);
      dispatch(authActions.setEmail(email));
      dispatch(authActions.setScw(user?.dfnsScw));
      dispatch(authActions.setWallet(user?.dfnsWallet));
      navigation.navigate('Portfolio');
    } else {
      dispatch(authActions.setEmail(null));
      dispatch(authActions.setScw([]));
      dispatch(authActions.setWallet([]));
      navigation.push('LoggedOutHome');
    }
  };
};
export const logoutRefresh = () => {
  return async dispatch => {
    // await particleAuthCoreLogout();
    dispatch(authActions.setMainnet(true));
    dispatch(authActions.setFaceID(false));
    dispatch(authActions.setIsConnected(true));
    dispatch(authActions.setEOAAddress(null));
  };
};
