import axios from 'axios';
import {
  connectWithAuthCore,
  depolyAAAndGetSCAddress,
  getUserAddressFromAuthCoreSDK,
  getUserInfoFromAuthCore,
  initializedAuthCore,
  isLoggedIn,
} from '../../utils/particleCoreSDK';
import {globalActions} from '../reducers/global';
import {PNAccount} from '../../Models/PNAccount';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authActions} from '../reducers/auth';
import {getEvmAddresses} from '../actions/portfolio';

export const registerUserToDB = () => {
  return async dispatch => {};
};
export const checkNameOnSCWAddress = async (navigation, scwAddress, email) => {
  // return async dispatch => {
  global.withAuth = true;
  const isConnected = await isLoggedIn();
  if (isConnected) {
    try {
      // const scwAddress = response?.data?.toLowerCase();
      console.log('name look up data......', scwAddress);
      const nameResponse = await axios.get(
        `https://user.api.xade.finance/polygon?address=${scwAddress}`,
      );
      const userResponse = await nameResponse?.data;
      console.log('name look up data......', userResponse);
      if (
        userResponse === '' ||
        userResponse.length === 0 ||
        userResponse.toLowerCase() === email.toLowerCase() ||
        userResponse === 'Not Set'
      ) {
        console.log('Here....', userResponse);
        navigation.push('EnterName');
        return;
      } else {
        global.loginAccount.name = userResponse;
        return true;
      }
    } catch (error) {
      console.log('Here....Error', error?.response?.data);
      if (error?.response?.data === 'wallet address was not found') {
        navigation.push('EnterName');
        return;
      }
    }
  } else {
    navigation.navigate('Error');
    return;
  }
  // };
};
export const onAuthCoreLogin = navigation => {
  return async dispatch => {
    global.mainnet = true;
    dispatch(globalActions.setMainnent(true));
    initializedAuthCore();
    navigation.push('Loading');
    try {
      const userInfo = await connectWithAuthCore();
      if (userInfo) {
        console.log('user info......', userInfo);
        let email = userInfo.email?.toLowerCase()
          ? userInfo.email.toLowerCase()
          : userInfo.googleEmail
          ? userInfo.googleEmail
          : userInfo.phone;
        const name = userInfo.name ? userInfo.name : 'Not Set';
        const address = await getUserAddressFromAuthCoreSDK();
        let mobileLogin = false;
        if (email[0] === '+') {
          mobileLogin = true;
        }
        console.log(
          'user address......',
          mobileLogin,
          email,
          name,
          `https://email-lookup.api.xade.finance/polygon?email=${email}`,
          address,
        );
        try {
          const response = await axios.get(
            `https://email-lookup.api.xade.finance/polygon?email=${email}`,
          );
          console.log('look up data......', response?.data);
          if (response?.data) {
            global.loginAccount = new PNAccount(
              email,
              name,
              address,
              response?.data,
              userInfo.wallets[0].uuid
                ? userInfo.wallets[0].uuid
                : userInfo.uuid,
            );
            const status = await checkNameOnSCWAddress(
              navigation,
              response?.data,
              email,
            );
            if (status) {
              dispatch(getEvmAddresses());
              navigation.navigate('Portfolio');
            }
          }
        } catch (error) {
          console.log('error in lookup.....', error?.response);
          if (error?.response?.data === 'Email Address was not found') {
            console.log('Create a new once AA flow........');
            const scw = await depolyAAAndGetSCAddress();
            if (scw) {
              global.loginAccount = new PNAccount(
                email,
                name,
                address,
                scw,
                userInfo.wallets[0].uuid
                  ? userInfo.wallets[0].uuid
                  : userInfo.uuid,
              );

              const status = await checkNameOnSCWAddress(
                navigation,
                scw,
                email,
              );
              if (status) {
                dispatch(getEvmAddresses());
                navigation.navigate('Portfolio');
              }
            } else {
              navigation.navigate('Error');
            }
          }
        }
      }
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
    initializedAuthCore();
    const isConnected = await isLoggedIn();
    console.log(
      isConnected ? 'Logged In' : 'Not Logged In',
      isConnected,
      faceID,
    );
    if (isConnected) {
      if (faceID) {
        // faceId flow
      } else {
        let userInfo = await getUserInfoFromAuthCore();
        userInfo = JSON.parse(userInfo);
        console.log('user...!', userInfo?.email);
        let email = userInfo?.email
          ? userInfo.email.toLowerCase()
          : userInfo.phone
          ? userInfo.phone
          : userInfo.googleEmail.toLowerCase();
        console.log('Phone/Email:', email);
        const uuid = userInfo.wallets[0].uuid;
        const address = await getUserAddressFromAuthCoreSDK();
        console.log('address ====:', address);
        await AsyncStorage.setItem('address', address);
        dispatch(authActions.setEOAAddress(address));
        setLoadingText('Fetching User Info...');
        if (email.includes('@')) {
          try {
            const emailResponse = await axios.get(
              `https://email-lookup.api.xade.finance/polygon?email=${email.toLowerCase()}`,
            );
            if (emailResponse?.status === 200) {
              console.log('here', emailResponse?.data);
              if (emailResponse?.data === 0) {
                navigation.push('LoggedOutHome');
              }
              const name = await axios.get(
                `https://user.api.xade.finance/polygon?address=${emailResponse?.data.toLowerCase()}`,
              );
              if (name?.status === 200) {
                console.log('here', name?.data);
                if (name?.data === 0) {
                  navigation.push('LoggedOutHome');
                }
                global.loginAccount = new PNAccount(
                  email,
                  name?.data,
                  address,
                  emailResponse?.data,
                  uuid,
                );
                global.withAuth = true;
                dispatch(getEvmAddresses());
                navigation.navigate('Portfolio');
              } else {
                navigation.push('LoggedOutHome');
              }
            } else {
              navigation.push('LoggedOutHome');
            }
          } catch (error) {
            console.log('error', error?.response?.data);
            navigation.push('LoggedOutHome');
          }
        } else {
          // email = email.slice(1);
          // await fetch(
          //   `https://mobile.api.xade.finance/polygon?phone=${email.toLowerCase()}`,
          //   {
          //     method: 'GET',
          //   },
          // )
          //   .then(response => {
          //     if (response.status == 200) {
          //       return response.text();
          //     } else return 0;
          //   })
          //   .then(data => {
          //     console.log('SCW:', data);
          //     if (data == 0) {
          //       navigation.push('LoggedOutHome');
          //     }
          //     scwAddress = data;
          //   });
        }
      }
    } else {
      console.log('Third Nav');
      console.log('Not Connected Either');
      navigation.push('LoggedOutHome');
      console.log('Navigating To Home');
    }
  };
};
