import axios from 'axios';
import {offRampAction} from '../reducers/offRamp';

//TODO(change payload here based on required response for reducers)

const URL = {
  FETCH_USER: 'https://hub.encryptus.co/v1/partners/fetchall/user',
  CREATE_USER: 'https://hub.encryptus.co/v1/partners/create/user',
  GET_GIFT_CARD: 'https://hub.encryptus.co/v1/payout/giftcard/filters',
  SUBMIT_DETAIL_GIFT_CARD: 'https://hub.encryptus.co/v1/payout/giftcard/quote',
  ACCEPT_GIFT_CARD: 'https://hub.encryptus.co/v1/payout/giftcard/order',
  GEN_TOKEN: 'https://hub.encryptus.co/v1/partners/generate/token',
};

export const genrateToken = () => {
  return async dispatch => {
    const requestBody = {
      partnerEmail: 'development@xade.finance',
      partnerPassword: 'f@qa7WLaQ7NK-Wkk',
      grant_services: ['FORENSICS'],
      clientSecret: '67764c70-488b-4389-94be-6990e4e5fe93',
      clientID: '795ce954-4a85-40f1-b1c8-2746cb302451',
    };

    const headers = {
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios.post(URL.GEN_TOKEN, requestBody, {headers});

      if (response.status === 200 || response.status === 201) {
        console.log('Generated Token =>', response.data?.access_token);
        dispatch(offRampAction.setToken(response.data?.access_token));
      } else {
        console.log('Unexpected response:', response.status);
      }
    } catch (error) {
      console.error('Error in generating token:', error);
    }
  };
};

export const fetchOnboardedUser = email => {
  console.log('fetching onboarded users');
  return async (dispatch, getState) => {
    const token = getState().offRamp.token;
    try {
      const response = await axios.get(URL.FETCH_USER, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        console.log(
          'Onboarded users:',
          response?.data?.data?.usersList?.filter(x => x.email === email)[0],
        );

        if (
          response?.data?.data?.usersList?.filter(x => x.email === email)
            ?.length === 0
        ) {
          try {
            const createUserResponse = await axios.post(
              URL.CREATE_USER,
              {
                email: email,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );

            if (response.status === 200) {
              console.log('User created successfully');
              console.log('Response:', createUserResponse);
              dispatch(offRampAction.setUser(createUserResponse?.data?.data));
            } else {
              console.error('Failed to create user');
            }
          } catch (error) {
            console.error(
              'Error in actions/offRamp/fetchOnboardedUser while creating user',
              error,
            );
          }
        } else {
          console.log('setting user...');
          dispatch(
            offRampAction.setUser(
              response?.data?.data?.usersList?.filter(
                x => x.email === email,
              )[0],
            ),
          );
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

export const getCountryBasedGiftCard = () => {
  return async (dispatch, getState) => {
    let countryName = await getState().auth.country;
    const token = getState().offRamp.token;
    console.log('🎁--> Getting gift cards based on country :', countryName);

    if (countryName != null) {
      try {
        const response = await axios.get(URL.GET_GIFT_CARD, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            country: countryName,

            //  deliveryType: '',
            //  currencyCode: '',
          },
        });

        if (response.status === 200) {
          console.log('🎁Gift cards:', response?.data?.data?.vouchers);
          dispatch(offRampAction.setGiftCards(response?.data?.data?.vouchers));
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

//creates quote, this running every 10 second in coupon modal
export const submitDetailsForQuote = (
  country,
  productId,
  brand,
  denominator,
  quantity,
) => {
  return async (dispatch, getState) => {
    const user = getState().offRamp.user;
    const token = getState().offRamp.token;
    console.log('user!!!!!', user);

    const requestBody = {
      country: country,
      productId: productId,
      brand: brand,
      denominator: denominator,
      cryptoCoin: 'USDC',
      selectedFiat: 'INR',
      encryptus_userID: user?._id,
      quantity: parseInt(quantity),
      partner_userID: user?.ref_partnerId,
    };
    console.log('req giftcard for =>', requestBody);

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
        console.log('🎁 Quote created:', response.data);
        dispatch(offRampAction.setQuoteDetail(response.data.quote.quoteId));
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

export const acceptGiftCardOrder = () => {
  return async (dispatch, getState) => {
    //raw data

    const quoteId = getState().offRamp.quoteDetail;
    const token = getState().offRamp.token;
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

      console.log('🎁 accept status =>', response.status);

      if (response.status === 201) {
        console.log('🎁 Order submitted successfully:', response.data);
        dispatch(offRampAction.acceptQuote(response?.data?.order));
      } else {
        console.error('Failed to submit order');
        console.log('accept status =>', response.status);
      }
    } catch (error) {
      console.error(
        'Error actions/offRamp/acceptGiftCardOrder function:',
        error,
      );
    }
  };
};
