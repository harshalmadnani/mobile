import axios from 'axios';
import {transferAction} from '../reducers/transfer';

export const setAddressOnEmail = email => {
  return async (dispatch, getState) => {
    const response = await axios.get(
      `https://srjnswibpbnrjufgqbmq.supabase.co/rest/v1/users?email=eq.${email}`,
      {
        headers: {
          apiKey:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyam5zd2licGJucmp1ZmdxYm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEyOTE0NjgsImV4cCI6MjAyNjg2NzQ2OH0.w_WrPPnSX2j4tnAFxV1y2XnU0ffWpZkrkPLmNMsSmko',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyam5zd2licGJucmp1ZmdxYm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEyOTE0NjgsImV4cCI6MjAyNjg2NzQ2OH0.w_WrPPnSX2j4tnAFxV1y2XnU0ffWpZkrkPLmNMsSmko',
        },
      },
    );
    if (response.data?.length) {
      dispatch(
        transferAction.setRecipientAddress(response?.data[0]?.evmSmartAccount),
      );
      return true;
    } else {
      dispatch(transferAction.setRecipientAddress(null));
      return false;
    }
  };
};
