import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createClient} from '@supabase/supabase-js';
import {AppState} from 'react-native';

const supabaseUrl = 'https://srjnswibpbnrjufgqbmq.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyam5zd2licGJucmp1ZmdxYm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEyOTE0NjgsImV4cCI6MjAyNjg2NzQ2OH0.w_WrPPnSX2j4tnAFxV1y2XnU0ffWpZkrkPLmNMsSmko';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
export const signUpWithEmail = async (email, password) => {
  const {error, data} = await supabase.auth.signUp({
    email: email,
    password: password,
  });
  console.log('response...', error, data);
  if (error) return false;
  if (data?.session) return data?.session;
};
export const signInWithEmailOtp = async (
  email,
  password,
  errorCallback,
  verificationCallback,
) => {
  const session = await signUpWithEmail(email, password);
  console.log('user registered!!!!!!', session);
  if (session) {
    const {error, data} = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        // set this to false if you do not want the user to be automatically signed up
        shouldCreateUser: false,
      },
    });
    if (error) {
      console.log('error on signing up.....', error);
      errorCallback();
      return false;
    }
    if (data?.session === null && data?.user === null) {
      verificationCallback();
      return true;
    }
  } else {
    errorCallback();
  }
};
export const verifyEmailOtp = async (
  otp,
  email,
  errorCallback,
  verificationCallback,
) => {
  const {
    data: {session},
    error,
  } = await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: 'email',
  });
  if (error) {
    errorCallback();
  }
  if (session) {
    verificationCallback(data);
  }
};

AppState.addEventListener('change', state => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
