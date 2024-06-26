import axios from 'axios';
import {offRampAction} from '../reducers/offRamp';

//TODO(change payload here based on required response for reducers)

const URL = {
  FETCH_USER: 'https://sandbox.encryptus.co/v1/partners/fetchall/user',
  CREATE_USER: 'https://sandbox.encryptus.co/v1/partners/create/user',
  GET_GIFT_CARD: 'https://sandbox.encryptus.co/v1/payout/giftcard/filters',
  SUBMIT_DETAIL_GIFT_CARD:
    'https://sandbox.encryptus.co/v1/payout/giftcard/quote',
  ACCEPT_GIFT_CARD: 'https://sandbox.encryptus.co/v1/payout/giftcard/order',
};

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXRhZGF0YSI6eyJpdiI6IjVhMTdjMmIzYmVhZGVhMzFhYmI0YWRhYmNjYzQ1MTAyIiwiY29udGVudCI6IjgzYzgwNjI2NzM0MzljMDNkNzBkZDhlOTU0MmY0NjIwNGU4MDdkMmEwMGNhZjMwZTBkYjI4ZDMwOWNkZTJkNjU1NTk3OWZkN2NiMzAzZmY3OTAxNGYzMGIzYzMyNDgwYzlhOTAyZWI3YzVlYzM5NGQzYjYwODg0NGE2Yzc2ZjI2MWU2NjBkMzE4MGRlMGQ2ZTY5NWVmOWMxYjEwZTRlOWMzMzBiMWY3Yjc3NDdhNWUwMmE3NWFiZTdlZTE3YzBmNGE4NGM3ZDE1MzdmMDQ0ZDYzOTJiNTE4MGVmMWIxYjI2NmFmOTdjYjQ5MTRhOGFmOTNmOWMzY2ZkZWIxYzFlYjAwOTc2OTg0ODc4ZTk5NiJ9LCJpYXQiOjE3MTM4NDY3NzUsImV4cCI6MTcxMzkzMzE3NX0.FZlP5jDRMyDoXpb-2I-CNQ_ywlxjxqtbEg7ts5m8X-E';

const fetchOnboardedUser = () => {
  return async dispatch => {
    try {
      const response = await axios.get(URL.FETCH_USER, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        console.log('Onboarded users:', response);

        if (/* check existing user DOES NOT CONTAINS in userList */ 1 == 1) {
          try {
            const createUserResponse = await axios.post(
              URL.CREATE_USER,
              {
                email: email,
              },
              {
                headers: {
                  Accept: '*/*',
                  Authorization: `Bearer ${token}`,
                },
              },
            );

            if (response.status === 201) {
              console.log('User created successfully');
              console.log('Response:', createUserResponse);
              dispatch(offRampAction.setUser(createUserResponse));
            } else {
              console.error('Failed to create user');
            }
          } catch (error) {
            console.error(
              'Error in actions/offRamp/fetchOnboardedUser while creating user',
              error,
            );
          }
        }
      } else {
        console.error('Failed to fetch onboarded users');
      }
    } catch (error) {
      console.error(
        'Error in actions/offRamp/fetchOnboardedUser while fetching:',
        error,
      );
    }
  };
};

const getCountry = async () => {
  try {
    const response = await axios.get('https://ipapi.co/json/');
    return response.data.country_name;
  } catch (err) {
    console.log('Error in actions/offRamp/getCountry function.');
    return null;
  }
};

const getCountryBasedGiftCard = () => {
  return async dispatch => {
    const countryName = await getCountry();
    if (countryName != null) {
      try {
        const response = await axios.get(GET_GIFT_CARD, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            country: country,
            //  deliveryType: '',
            //  currencyCode: '',
          },
        });

        if (response.status === 200) {
          console.log('Gift cards:', response);
          dispatch(offRampAction.setGiftCards(response));
        } else {
          console.error('Failed to fetch gift cards');
        }
      } catch (error) {
        console.error(
          'Error actions/offRamp/filterOutCountryBasedGiftCard function :',
          error,
        );
      }
    }
  };
};

const submitDetailsForQuote = requestBody => {
  return async dispatch => {
    //raw data
    const requestBody = {
      country: 'India',
      productId: 1007,
      brand: 'Flipkart',
      denominator: '5000.0000',
      cryptoCoin: 'USDC',
      selectedFiat: 'INR',
      encryptus_userID: '66273b45c58db4f1f3da8692',
      quantity: 1,
      partner_userID: '6d05f4d1-3d93-4b54-8682-88bd0d31e510',
    };

    try {
      const response = await axios.post(
        URL.SUBMIT_DETAIL_GIFT_CARD,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status === 201) {
        console.log('Quote created:', response);
        dispatch(offRampAction.setQuoteDetail(response));
      } else {
        console.error('Failed to create quote');
      }
    } catch (error) {
      console.error(
        'Error actions/offRamp/submitGiftCardQuote function',
        error,
      );
    }
  };
};

const acceptGiftCardOrder = quoteID => {
  return async dispatch => {
    //raw data
    const quoteID = '62547d0a-a023-4921-bfc6-ac9b0b425851';

    try {
      const response = await axios.post(
        API_URL,
        {
          quoteID: quoteID,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status === 201) {
        console.log('Order submitted successfully:', response.data);
        dispatch(offRampAction.acceptQuote(response));
      } else {
        console.error('Failed to submit order');
      }
    } catch (error) {
      console.error(
        'Error actions/offRamp/submitGiftCardOrder function:',
        error,
      );
    }
  };
};
