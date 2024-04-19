import axios from 'axios';

const baseUrl = 'https://v2.api.squidrouter.com/v2';

// get an integrator-id https://form.typeform.com/to/cqFtqSvX
const integratorId = 'xade-finance-43c5b3d3-3500-483b-bf02-aa795f3e0495';

export const getChainsSupportedFromSquid = async () => {
  const result = await axios.get('https://v2.api.squidrouter.com/v2/chains', {
    headers: {
      'x-integrator-id': integratorId,
    },
  });
  return result.data;
};

export const getTokensSupportedFromSquid = async () => {
  const result = await axios.get('https://v2.api.squidrouter.com/v2/tokens', {
    headers: {
      'x-integrator-id': integratorId,
    },
  });
  return result.data;
};
export const getRouteFromSquid = async (
  fromAddress,
  fromChain,
  fromToken,
  fromAmount,
  toChain,
  toToken,
  toAddress,
  slippage,
  autoMode,
  quoteOnly,
) => {
  console.log(
    'squid paramss',
    fromAddress,
    fromChain,
    fromToken,
    fromAmount,
    toChain,
    toToken,
    toAddress,
    slippage,
    autoMode,
    quoteOnly,
  );
  const params = {
    fromAddress,
    fromChain,
    fromToken,
    fromAmount,
    toChain,
    toToken,
    toAddress,
    slippage,
    slippageConfig: {
      autoMode,
    },
    quoteOnly,
  };
  try {
    const result = await axios.post(
      'https://api.0xsquid.com/v1/route',
      params,
      {
        headers: {
          'x-integrator-id': integratorId,
          'Content-Type': 'application/json',
        },
      },
    );
    const requestId = result.headers['x-request-id'];
    console.log('routes data.....', result.data);
    return {data: result.data, requestId: requestId};
  } catch (error) {
    // Log the error response if it's available.
    if (error.response) {
      console.error('API error:', error.response.data);
    }
    console.error('Error with parameters:', params);
    // throw error;
  }
};
// export const getValidQuotesFromSquid = async (
//   fromAddress,
//   fromChain,
//   fromToken,
//   fromAmount,
//   toChain,
//   toToken,
//   toAddress,
//   slippage,
//   autoMode,
//   quoteOnly,
// ) => {};
