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
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXRhZGF0YSI6eyJpdiI6ImNjYzRhN2UzNThmYjQ3MDNjMTg1MzkwMDRmMjY2YWE2IiwiY29udGVudCI6Ijk4YzhlMTY3ZGE1MGEwMzhiYmMwMDBkMDcxN2Y0MmUxNjY3NDcwOGQ2NGYwY2Y5ODQzNGY0NzQ3MDQxNmI4ZmJkYjk2YTI2NTQ4ODk2YTg2ZDJlZDdjMDA5MzJjODNlZjAwYTc5OGQ1YzIxNTRiNjc0OWVmMmQ1ZDBjMDRiYTNmMDg5MWRmODZmYzk5ODI3OGIzZGQ5Nzk0NmZmNmEwYzE2NGEzYTYzZjQyZTZmZWE1NmU4ODA2MjFjMTlkNzZlOWRhN2U3OGIwYzc3NjZkYTQwM2Q0ODVmNDNjZDZmZjhjMzI1ZjhjMzFlYjc0MTI2YmFhMzczZTg2MmJlNWQzYzIwMWY2ODE1N2U2ZGNjOTUwIn0sImlhdCI6MTcyMDU1NzA1NCwiZXhwIjoxNzIwNjQzNDU0fQ.OTk9fMb7oyVO7jUpbKkvqNc6tjWm9vkeRq9Jb1WpibQ';

export const fetchOnboardedUser = email => {
  console.log('fetching onboarded users');
  return async dispatch => {
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

export const getCountry = async () => {
  try {
    console.log(
      'Removing the console log makes the getCountryBasedGiftCard not wait for getCountry',
    );
    const response = await axios.get('https://ipapi.co/json/');
    return response.data.country_name;
  } catch (err) {
    console.log('Error in actions/offRamp/getCountry function.');
    return null;
  }
};

export const getCountryBasedGiftCard = () => {
  return async dispatch => {
    // const countryName = await getCountry();
    // console.log('Country name', countryName);
    //if (countryName != null)
    if (1 == 1) {
      //REMOVE THIS BEFORE PUSHING
      try {
        const response = await axios.get(URL.GET_GIFT_CARD, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            // country: countryName,
            country: 'India',
            //  deliveryType: '',
            //  currencyCode: '',
          },
        });

        if (response.status === 200) {
          console.log('Gift cards:', response?.data?.data?.vouchers);
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
    console.log('user!!!!!', user);

    const requestBody = {
      country: 'India',
      productId: parseInt(productId),
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
        console.log('Quote created:', response.data);
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
        dispatch(offRampAction.acceptQuote(response));
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
