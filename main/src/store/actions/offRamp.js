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
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXRhZGF0YSI6eyJpdiI6IjU5ZDMxZGEwZTFkNzM5NmRhMmExYTE4YjNjZWNjODAwIiwiY29udGVudCI6ImVjNDg3OGVjNmYwMGMyMjc4Zjc1NTA1NjRhMjkyNmE5NjMzODMyODI0YzFhYTBhMTg2NWFmNjNkZjVkOTFmZmQ2ZmY2MWFiZGEyNjJlOTE3YmMyNGZiOTZkM2FhOTY5MGQyZGY2NzQ1NjExY2Y1OTI0YjI4Nzg5ZDVhZDM5Y2MyY2Q0NWVhYzIzMzIzNDk3ZDM0OTQzOGY3YTYxZDc0NmRlOGJmYzZiMWNmZDhmZmUwODM2OTk5Y2MyMTc0Y2RjYjhjZTEwNjIyZjk4ZTBiMTMwNTMwODkxMTRhYTFmMTg2NDhmMWU2OGQwNDYxOTAzN2IyMTU5YWU1YzZiMDRjMTFkMTBkNDViMWYyNDFkZjg4In0sImlhdCI6MTcxOTU4NzczMCwiZXhwIjoxNzE5Njc0MTMwfQ.N7BHsxGt48PQ6K1fvlBBTHemI4yH3g9f0n3MM7Ztt1w';

export const fetchOnboardedUser = email => {
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
          response?.data?.data?.usersList?.filter(x => x.email === email)
            ?.length === 0,
          email,
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
    const countryName = await getCountry();
    console.log('Country name', countryName);
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

export const submitDetailsForQuote = requestBody => {
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

export const acceptGiftCardOrder = quoteID => {
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
