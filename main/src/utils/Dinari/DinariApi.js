import axios from 'axios';
import // getSmartAccountAddress,
// getUserAddressFromAuthCoreSDK,
'../particleCoreSDK';
import {
  getEthereumTransaction,
  getSignedMessage,
  signAndSendBatchTransactionWithGasless,
} from '../particleCoreSDK';
import {
  orderProcessorARBContractAddress,
  orderProcessorAbi,
} from './utilsDinari';
import tokenAbi from '../../screens/loggedIn/payments/USDC.json';
import {ethers} from 'ethers';
const dinariBaseURL = 'https://api-enterprise.sbt.dinari.com';
const dinariRoutes = {
  getStockTokens: '/api/v1/tokens/',
  getStockQuotes: '/api/v1/stocks/quote',
};

export const getAllDinariStocks = async chainId => {
  try {
    const response = await axios.get(
      `${dinariBaseURL}${dinariRoutes.getStockTokens}${chainId}`,
      {
        headers: {
          Authorization: 'Bearer bnod0_h-1dFU_nq5BVZZIXkDmqpXbsrc-8KxT4Gp-w8',
        },
      },
    );
    console.log('response from dinari get stock api:', response?.data);
    return response?.data;
  } catch (error) {
    console.log('error  from asset api:', error);
    return [];
  }
};
export const getAllDinariStocksPriceChange = async stockIds => {
  const queryString = stockIds.map(id => `stock_ids=${id}`).join('&');
  console.log('stockids queryString.....', queryString);
  try {
    const response = await axios.get(
      `${dinariBaseURL}${dinariRoutes.getStockQuotes}?${queryString}`,
      {
        headers: {
          Authorization: 'Bearer bnod0_h-1dFU_nq5BVZZIXkDmqpXbsrc-8KxT4Gp-w8',
        },
      },
    );
    console.log('response from dinari get stock price api:', response?.data);
    return response?.data;
  } catch (error) {
    console.log(
      'error from dinari get stock price api:',
      error?.response?.data,
    );
    return [];
  }
};
export const getStockMapDataPointsFromDinari = async (stockId, timeFilter) => {
  try {
    const response = await axios.get(
      `${dinariBaseURL}/api/v1/stocks/${stockId}/price_chart_data?timespan=${timeFilter}`,
      {
        headers: {
          Authorization: 'Bearer bnod0_h-1dFU_nq5BVZZIXkDmqpXbsrc-8KxT4Gp-w8',
        },
      },
    );
    console.log(
      'response from dinari get stock chart api:',
      response?.data?.length,
    );
    return response?.data;
  } catch (error) {
    console.log(
      'error from dinari get stock price api:',
      error?.response?.data,
    );
    return [];
  }
};
export const checkKYCAvailableOrNotForDinari = async evmAddress => {
  try {
    const response = await axios.get(
      `${dinariBaseURL}/api/v1/web3/wallet/${evmAddress}/kyc/managed/status`,
      {
        headers: {
          Authorization: 'Bearer bnod0_h-1dFU_nq5BVZZIXkDmqpXbsrc-8KxT4Gp-w8',
        },
      },
    );
    console.log('response from dinari get stock chart api:', response?.data);
    return response?.data?.status;
  } catch (error) {
    console.log('error from dinari get stock kyc api:', error?.response?.data);
    return false;
  }
};
export const requestKYCWalletSignatureForDinari = async evmAddress => {
  try {
    const response = await axios.post(
      `${dinariBaseURL}/api/v1/web3/wallet/${evmAddress}/kyc/managed/nonce`,
      {},
      {
        headers: {
          Authorization: 'Bearer bnod0_h-1dFU_nq5BVZZIXkDmqpXbsrc-8KxT4Gp-w8',
        },
      },
    );
    console.log('response from dinari get message chart api:', response?.data);
    if (response?.data) {
      const signature = await getSignedMessage(response?.data?.message);
      const kycInfORes = await requestKYCWalletURLForDinari(
        evmAddress,
        signature?.data?.signature,
        response?.data?.nonce,
      );
      return kycInfORes?.embed_url;
    }
    // return true;
  } catch (error) {
    console.log(
      'error from dinari get kyc/managed/nonc price api:',
      evmAddress,
      error?.response?.data,
    );
    return false;
  }
};
export const requestKYCWalletURLForDinari = async (
  evmAddress,
  signature,
  nonce,
) => {
  try {
    const response = await axios.post(
      `${dinariBaseURL}/api/v1/web3/wallet/${evmAddress}/kyc/managed`,
      {
        signature,
        nonce,
      },
      {
        headers: {
          Authorization: 'Bearer bnod0_h-1dFU_nq5BVZZIXkDmqpXbsrc-8KxT4Gp-w8',
        },
      },
    );
    console.log(
      'response from dinari get wallet url chart api:',
      response?.data,
    );
    if (response?.data) {
      return response?.data;
    }
    // return true;
  } catch (error) {
    console.log(
      'error from dinari get kyc/managed/nonc price api:',
      evmAddress,
      error?.response?.data,
    );
    return false;
  }
};
export const getMarketOrderFeesEstimationFromDinari = async (
  assetTokenAddress,
  paymentTokenAddress,
  signer,
  paymentAmount,
  isSell,
) => {
  // ------------------ Setup ------------------

  // permit EIP712 signature data type
  const permitTypes = {
    Permit: [
      {
        name: 'owner',
        type: 'address',
      },
      {
        name: 'spender',
        type: 'address',
      },
      {
        name: 'value',
        type: 'uint256',
      },
      {
        name: 'nonce',
        type: 'uint256',
      },
      {
        name: 'deadline',
        type: 'uint256',
      },
    ],
  };

  // setup values
  //   const privateKey = process.env.PRIVATE_KEY;
  //   if (!privateKey) throw new Error('empty key');
  //   const RPC_URL = process.env.RPC_URL;
  //   if (!RPC_URL) throw new Error('empty rpc url');
  // const assetTokenAddress = '0xed12e3394e78C2B0074aa4479b556043cC84503C'; // SPY
  // const paymentTokenAddress = '0x709CE4CB4b6c2A03a4f938bA8D198910E44c11ff';

  // setup provider and signer
  //   const provider = ethers.getDefaultProvider(RPC_URL);
  //   const signer = new ethers.Wallet(privateKey, provider);
  // const chainId = Number((await provider.getNetwork()).chainId); //42161
  // const orderProcessorAddress = '0x4c3bD1Ac4F62F25388c02caf8e3e0D32d09Ff8B3'; //For ARB
  console.log(`Order Processor Address: ${orderProcessorARBContractAddress}`);

  // connect signer to payment token contract
  const paymentToken = new ethers.Contract(
    paymentTokenAddress,
    tokenAbi,
    signer,
  );

  // connect signer to asset token contract
  const assetToken = new ethers.Contract(assetTokenAddress, tokenAbi, signer);

  // connect signer to buy processor contract
  const orderProcessor = new ethers.Contract(
    orderProcessorARBContractAddress,
    orderProcessorAbi,
    signer,
  );

  // ------------------ Configure Order ------------------

  // order amount (1000 USDC)
  // const orderAmount = BigInt(100_000_000);
  console.log('Done.....', signer.address);
  // buy order (Change to true for Sell Order)
  const sellOrder = isSell;
  // market order
  const orderType = Number(0);

  // check the order precision doesn't exceed max decimals
  // applicable to sell and limit orders only
  if (sellOrder || orderType === 1) {
    const maxDecimals = await orderProcessor.maxOrderDecimals(
      assetTokenAddress,
    );
    console.log('maxDecimals.....', maxDecimals);
    const assetTokenDecimals = await assetToken.decimals();
    console.log('assetTokenDecimals.....', assetTokenDecimals);
    const allowablePrecision = 10 ** (assetTokenDecimals - maxDecimals);
    if (Number(paymentAmount) % allowablePrecision != 0) {
      throw new Error(
        `Order amount precision exceeds max decimals of ${maxDecimals}`,
      );
    }
  }
  // get fees, fees will be added to buy order deposit or taken from sell order proceeds
  const fees = await orderProcessor.estimateTotalFeesForOrder(
    signer.address,
    false,
    paymentTokenAddress,
    paymentAmount,
  );
  console.log('fees.....', parseInt(fees?.toString()));
  return parseInt(fees?.toString());

  // ------------------ Approve Spend ------------------

  // approve buy processor to spend payment token
  // const approveTx = await paymentToken.approve(
  //   orderProcessorAddress,
  //   totalSpendAmount,
  // );
  // await approveTx.wait();
  // console.log(`approve tx hash: ${approveTx.hash}`);

  // // ------------------ Submit Order ------------------

  // // submit request order transaction
  // // see IOrderProcessor.Order struct for order parameters
  // const tx = await orderProcessor.requestOrder([
  //   signer.address,
  //   assetTokenAddress,
  //   paymentTokenAddress,
  //   sellOrder,
  //   orderType,
  //   0, // Asset amount to sell. Ignored for buys. Fees will be taken from proceeds for sells.
  //   orderAmount, // Payment amount to spend. Ignored for sells. Fees will be added to this amount for buys.
  //   0, // Unused limit price
  //   1, // GTC
  //   ethers.ZeroAddress, // split recipient
  //   0, // split amount
  // ]);
  // const receipt = await tx.wait();
  // console.log(`tx hash: ${tx.hash}`);

  // // get order id from event
  // const events = receipt.logs.map((log: any) =>
  //   orderProcessor.interface.parseLog(log),
  // );
  // if (!events) throw new Error('no events');
  // const orderEvent = events.find(
  //   (event: any) => event && event.name === 'OrderRequested',
  // );
  // if (!orderEvent) throw new Error('no order event');
  // const orderId = orderEvent.args[0];
  // const orderAccount = orderEvent.args[1];
  // console.log(`Order ID: ${orderId}`);
  // console.log(`Order Account: ${orderAccount}`);

  // // use order id to get order status (ACTIVE, FULFILLED, CANCELLED)
  // const orderStatus = await orderProcessor.getOrderStatus(orderId);
  // console.log(`Order Status: ${orderStatus}`);
};
export const placeMarketOrderToDinari = async (
  assetTokenAddress,
  paymentTokenAddress,
  signer,
  paymentAmount,
  isSell,
  smartAccount,
) => {
  // ------------------ Setup ------------------

  // permit EIP712 signature data type
  const permitTypes = {
    Permit: [
      {
        name: 'owner',
        type: 'address',
      },
      {
        name: 'spender',
        type: 'address',
      },
      {
        name: 'value',
        type: 'uint256',
      },
      {
        name: 'nonce',
        type: 'uint256',
      },
      {
        name: 'deadline',
        type: 'uint256',
      },
    ],
  };

  // setup values
  //   const privateKey = process.env.PRIVATE_KEY;
  //   if (!privateKey) throw new Error('empty key');
  //   const RPC_URL = process.env.RPC_URL;
  //   if (!RPC_URL) throw new Error('empty rpc url');
  // const assetTokenAddress = '0xed12e3394e78C2B0074aa4479b556043cC84503C'; // SPY
  // const paymentTokenAddress = '0x709CE4CB4b6c2A03a4f938bA8D198910E44c11ff';

  // setup provider and signer
  //   const provider = ethers.getDefaultProvider(RPC_URL);
  //   const signer = new ethers.Wallet(privateKey, provider);
  // const chainId = Number((await provider.getNetwork()).chainId); //42161
  // const orderProcessorAddress = '0x4c3bD1Ac4F62F25388c02caf8e3e0D32d09Ff8B3'; //For ARB
  console.log(`Order Processor Address: ${orderProcessorARBContractAddress}`);

  // connect signer to payment token contract
  const paymentToken = new ethers.Contract(
    paymentTokenAddress,
    tokenAbi,
    signer,
  );

  // connect signer to asset token contract
  const assetToken = new ethers.Contract(assetTokenAddress, tokenAbi, signer);

  // connect signer to buy processor contract
  const orderProcessor = new ethers.Contract(
    orderProcessorARBContractAddress,
    orderProcessorAbi,
    signer,
  );

  // ------------------ Configure Order ------------------

  // order amount (1000 USDC)
  // const orderAmount = BigInt(100_000_000);
  console.log('Done.....', signer.address);
  // buy order (Change to true for Sell Order)
  const sellOrder = isSell;
  // market order
  const orderType = Number(0);

  // check the order precision doesn't exceed max decimals
  // applicable to sell and limit orders only
  if (sellOrder || orderType === 1) {
    const maxDecimals = await orderProcessor.maxOrderDecimals(
      assetTokenAddress,
    );
    console.log('maxDecimals.....', maxDecimals);
    const assetTokenDecimals = await assetToken.decimals();
    console.log('assetTokenDecimals.....', assetTokenDecimals);
    const allowablePrecision = 10 ** (assetTokenDecimals - maxDecimals);
    if (Number(paymentAmount) % allowablePrecision != 0) {
      throw new Error(
        `Order amount precision exceeds max decimals of ${maxDecimals}`,
      );
    }
  }
  // get fees, fees will be added to buy order deposit or taken from sell order proceeds
  const fees = await orderProcessor.estimateTotalFeesForOrder(
    signer.address,
    false,
    paymentTokenAddress,
    paymentAmount,
  );
  const totalSpendAmount = parseInt(fees?.toString()) + paymentAmount / 1000000;
  console.log('final fees.....', totalSpendAmount);
  // return parseInt(fees?.toString());
  let txs = [];
  // ------------------ Approve Spend ------------------
  const erc20Abi = new ethers.Interface(tokenAbi);
  const orderProcessorInterface = new ethers.Interface(orderProcessorAbi);
  console.log('abi loaded.....');
  const approveData = erc20Abi.encodeFunctionData('approve', [
    orderProcessorARBContractAddress,
    totalSpendAmount * 1000000,
  ]);
  console.log('approve data loaded.....');
  const approveTX = await getEthereumTransaction(
    signer.address,
    paymentTokenAddress,
    approveData,
    '0',
  );
  console.log('approveTX.....', approveTX);
  txs.push(approveTX);
  const executeData = orderProcessorInterface.encodeFunctionData(
    'requestOrder',
    [
      [
        signer.address,
        assetTokenAddress,
        paymentTokenAddress,
        sellOrder,
        orderType,
        0, // Asset amount to sell. Ignored for buys. Fees will be taken from proceeds for sells.
        totalSpendAmount * 1000000, // Payment amount to spend. Ignored for sells. Fees will be added to this amount for buys.
        0, // Unused limit price
        1, // GTC
        ethers.ZeroAddress, // split recipient
        0, // split amount
      ],
    ],
  );
  console.log('execute data loaded.....');
  const executeTx = await getEthereumTransaction(
    signer.address,
    orderProcessorARBContractAddress,
    executeData,
    '0',
  );
  console.log('executeTx.....', executeTx);
  txs.push(executeTx);
  const signature = await signAndSendBatchTransactionWithGasless(
    signer.address,
    smartAccount,
    txs,
  );
  console.log('Final ARB TX', signature);
  return signature;

  // approve buy processor to spend payment token
  // const approveTx = await paymentToken.approve(
  //   orderProcessorARBContractAddress,
  //   totalSpendAmount,
  // );
  // await approveTx.wait();
  // console.log(`approve tx hash: ${approveTx.hash}`);

  // ------------------ Submit Order ------------------

  // submit request order transaction
  // see IOrderProcessor.Order struct for order parameters
  // const tx = await orderProcessor.requestOrder([
  //   signer.address,
  //   assetTokenAddress,
  //   paymentTokenAddress,
  //   sellOrder,
  //   orderType,
  //   0, // Asset amount to sell. Ignored for buys. Fees will be taken from proceeds for sells.
  //   orderAmount, // Payment amount to spend. Ignored for sells. Fees will be added to this amount for buys.
  //   0, // Unused limit price
  //   1, // GTC
  //   ethers.ZeroAddress, // split recipient
  //   0, // split amount
  // ]);
  // const receipt = await tx.wait();
  // console.log(`tx hash: ${tx.hash}`);

  // get order id from event
  // const events = receipt.logs.map(log =>
  //   orderProcessor.interface.parseLog(log),
  // );
  // if (!events) throw new Error('no events');
  // const orderEvent = events.find(
  //   event => event && event.name === 'OrderRequested',
  // );
  // if (!orderEvent) throw new Error('no order event');
  // const orderId = orderEvent.args[0];
  // const orderAccount = orderEvent.args[1];
  // console.log(`Order ID: ${orderId}`);
  // console.log(`Order Account: ${orderAccount}`);

  // // use order id to get order status (ACTIVE, FULFILLED, CANCELLED)
  // const orderStatus = await orderProcessor.getOrderStatus(orderId);
  // console.log(`Order Status: ${orderStatus}`);
};
