import axios from 'axios';
const BASE_URL = 'https://bridge-swap.aarc.xyz';
export const addFundsAarcApiFundKit = async (
  smartAccount,
  fromChainId,
  fromTokenAddress,
  fromAmount,
  userAddress,
) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/deposit-calldata?recipient=${smartAccount}&fromChainId=${fromChainId}&fromTokenAddress=${fromTokenAddress}&toChainId=137&toTokenAddress=0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359&fromAmount=${fromAmount}&userAddress=${userAddress}`,
      {
        headers: {'x-api-key': '6502897f-1ad6-42c0-8de6-c39f19d7401f'},
      },
    );
    console.log('arrch call data', response);
    return response?.data?.data;
  } catch (error) {
    console.log(
      'error  from aarc api:',
      `${BASE_URL}/deposit-calldata?recipient=${smartAccount}&fromChainId=${fromChainId}&fromTokenAddress=${fromTokenAddress}&toChainId=137&toTokenAddress=0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359&fromAmount=${fromAmount}&userAddress=${userAddress}`,
      error,
    );
    return [];
  }
};
