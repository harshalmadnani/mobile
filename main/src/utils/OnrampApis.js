import axios from 'axios';

const UNIRAMP_API_BASE_URL = 'https://api.uniramp.io/v1/onramp';
// const UNIRAMP_API_BASE_URL = 'https://sandbox.api.uniramp.io/v1/onramp';
const unirampKey = 'pk_prod_eb0suFktOsnpthQYX5LXoMXIychV7Ofv';

export const fetchOnRampPaymentMethodsBasedOnIP = async () => {
  //   const params = new URLSearchParams({address: ipAddress});
  const url = `${UNIRAMP_API_BASE_URL}/supported/ip`;

  try {
    const response = await axios.get(url, {
      headers: {
        'x-api-key': unirampKey,
      },
    });
    console.log('uni ramp fetch api', response, response.data);
    const fetchedPaymentMethods = response.data.payment || []; // Default to an empty array if undefined
    const fetchedfiat = response.data.fiat || [];
    return {fetchedPaymentMethods, fetchedfiat};
  } catch (error) {
    console.log('There was an error fetching payment methods:', error);
  }
};
export const getQuoteForCefiOnRamps = async (
  fiatInfo,
  paymentInfo,
  fiatAmount,
  chain,
  tokenAddress,
) => {
  const url = `${UNIRAMP_API_BASE_URL}/quote/cefi?fiat=${
    fiatInfo?.id
  }&fiatAmount=${fiatAmount * 10 ** fiatInfo?.decimal}&payment=${
    paymentInfo?.id
  }&chain=${chain}`;
  console.log(
    `${UNIRAMP_API_BASE_URL}/quote/cefi?fiat=${fiatInfo?.id}&fiatAmount=${
      fiatAmount * 10 ** fiatInfo?.decimal
    }&payment=${paymentInfo?.id}&chain=${chain}&crypto=${tokenAddress}`,
  );
  try {
    const response = await axios.get(url, {
      headers: {
        'x-api-key': unirampKey,
      },
    });
    console.log('uni ramp fetch api', response, response);
    return response?.data;
  } catch (error) {
    console.log('There was an error fetching quote methods:', error?.code);
    return error;
  }
};
export const createTransactionOnRamp = async (
  gatewayInfo,
  fiat,
  fiatAmount,
  payment,
  crypto,
  smartAccount,
) => {
  try {
    const response = await axios.post(
      `${UNIRAMP_API_BASE_URL}/transaction`,
      {
        cefiGateway: gatewayInfo?.gateway,
        fiat,
        fiatAmount,
        payment,
        chain: gatewayInfo?.chain,
        crypto,
        wallet: smartAccount,
        defiGateway: 'lifi',
      },
      {
        headers: {
          'x-api-key': unirampKey,
          'content-type': 'application/json',
        },
      },
    );
    console.log('uni ramp transaction api', response.data);
    return response?.data;
  } catch (error) {
    console.log('There was an error fetching quote methods:', error.toString());
  }
};
