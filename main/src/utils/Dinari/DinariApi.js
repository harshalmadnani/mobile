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
import {signFromSmartAccountWallet} from '../SASigning';
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
export const getAllDinariNewsForSpecificStock = async stockId => {
  try {
    const response = await axios.get(
      `${dinariBaseURL}/api/v1/stocks/${stockId}/news_articles`,
      {
        headers: {
          Authorization: 'Bearer bnod0_h-1dFU_nq5BVZZIXkDmqpXbsrc-8KxT4Gp-w8',
        },
      },
    );
    console.log('response from dinari get news api:', response?.data);
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
  // try {
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
    console.log('started sign......', response?.data?.message);
    const signature = await signFromSmartAccountWallet(
      response?.data?.message,
      evmAddress,
    );
    console.log('personal sign......', evmAddress, signature?.signature);
    if (signature) {
      const kycInfORes = await requestKYCWalletURLForDinari(
        evmAddress,
        signature?.signature,
        response?.data?.nonce,
      );
      return kycInfORes?.embed_url;
    } else {
      return false;
    }
  } else {
    return false;
  }
  // return true;
  // } catch (error) {
  //   console.log(
  //     'error from dinari get kyc/managed/nonc price api:',
  //     evmAddress,
  //     error?.response?.data,
  //   );
  //   return false;
  // }
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

  console.log(`Order Processor Address: ${orderProcessorARBContractAddress}`);

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
  // buy order (Change to true for Sell Order)
  const sellOrder = isSell;
  // market order
  const orderType = Number(1);

  // check the order precision doesn't exceed max decimals
  // applicable to sell and limit orders only
  // if (sellOrder || orderType === 1) {
  // const maxDecimals = await orderProcessor.maxOrderDecimals(
  //   assetTokenAddress,
  // );
  // const assetTokenDecimals = await assetToken.decimals();
  // console.log(
  //   'assetTokenDecimals.....',
  //   Number(paymentAmount),
  //   assetTokenDecimals,
  // );
  // const allowablePrecision = 10 ** (assetTokenDecimals - maxDecimals);
  // if (Number(paymentAmount) % allowablePrecision != 0) {
  //   throw new Error(
  //     `Order amount precision exceeds max decimals of ${maxDecimals}`,
  //   );
  // }
  // }
  console.log(
    'hereeeee.....',
    signer.address,
    false,
    paymentTokenAddress,
    paymentAmount,
  );
  // get fees, fees will be added to buy order deposit or taken from sell order proceeds
  const fees = await orderProcessor.estimateTotalFeesForOrder(
    signer.address,
    sellOrder,
    paymentTokenAddress,
    paymentAmount,
  );
  console.log('fees.....', parseInt(fees?.toString()));
  return parseInt(fees?.toString());
};
export const placeMarketOrderToDinariBuy = async (
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
  const totalSpendAmount = parseInt(fees?.toString()) + parseInt(paymentAmount);
  console.log('final fees.....', parseInt(fees?.toString()), totalSpendAmount);
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
        totalSpendAmount, // Payment amount to spend. Ignored for sells. Fees will be added to this amount for buys.
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
};
// export const placeMarketOrderToDinariSell = async (
//   assetTokenAddress,
//   paymentTokenAddress,
//   signer,
//   paymentAmount,
//   isSell,
//   smartAccount,
// ) => {
//   console.log(`Order Processor Address: ${orderProcessorARBContractAddress}`);

//   // connect signer to payment token contract
//   const paymentToken = new ethers.Contract(
//     paymentTokenAddress,
//     tokenAbi,
//     signer,
//   );

//   // connect signer to asset token contract
//   const assetToken = new ethers.Contract(assetTokenAddress, tokenAbi, signer);

//   // connect signer to buy processor contract
//   const orderProcessor = new ethers.Contract(
//     orderProcessorARBContractAddress,
//     orderProcessorAbi,
//     signer,
//   );

//   // ------------------ Configure Order ------------------

//   // order amount (1000 USDC)
//   // const orderAmount = BigInt(100_000_000);
//   console.log('Done.....', signer.address);
//   const sellOrder = isSell;
//   // market order
//   const orderType = Number(0);

//   // check the order precision doesn't exceed max decimals
//   // applicable to sell and limit orders only
//   if (sellOrder || orderType === 1) {
//     // const maxDecimals = await orderProcessor.maxOrderDecimals(
//     //   assetTokenAddress,
//     // );
//     // console.log('maxDecimals.....', maxDecimals);
//     // const assetTokenDecimals = await assetToken.decimals();
//     // const allowablePrecision = 10 ** (assetTokenDecimals - maxDecimals);
//     // console.log('maxDecimals.....', maxDecimals);
//     // if (Number(paymentAmount) % allowablePrecision != 0) {
//     //   console.log(
//     //     'assetTokenDecimals.....',
//     //     Number(paymentAmount) % allowablePrecision != 0,
//     //     assetTokenDecimals,
//     //   );
//     //   throw new Error(
//     //     `Order amount precision exceeds max decimals of ${maxDecimals}`,
//     //   );
//     // }
//   }
//   // get fees, fees will be added to buy order deposit or taken from sell order proceeds
//   // const fees = await orderProcessor.estimateTotalFeesForOrder(
//   //   signer.address,
//   //   sellOrder,
//   //   paymentTokenAddress,
//   //   paymentAmount,
//   // );
//   // const totalSpendAmount = parseInt(fees?.toString()) + parseInt(paymentAmount);
//   // console.log('final fees.....', parseInt(fees?.toString()), totalSpendAmount);
//   // return parseInt(fees?.toString());
//   let txs = [];
//   // ------------------ Approve Spend ------------------
//   const erc20Abi = new ethers.Interface(tokenAbi);
//   const orderProcessorInterface = new ethers.Interface(orderProcessorAbi);
//   console.log('abi loaded.....', [
//     signer.address,
//     assetTokenAddress,
//     paymentTokenAddress,
//     sellOrder,
//     orderType,
//     paymentAmount, // Asset amount to sell. Ignored for buys. Fees will be taken from proceeds for sells.
//     0, // Payment amount to spend. Ignored for sells. Fees will be added to this amount for buys.
//     0, // Unused limit price
//     1, // GTC
//     ethers.ZeroAddress, // split recipient
//     0, // split amount
//   ]); // split amount);
//   const approveData = erc20Abi.encodeFunctionData('approve', [
//     orderProcessorARBContractAddress,
//     paymentAmount,
//   ]);
//   console.log('approve data loaded.....');
//   const approveTX = await getEthereumTransaction(
//     signer.address,
//     assetTokenAddress,
//     approveData,
//     '0',
//   );
//   txs.push(approveTX);
//   const executeData = orderProcessorInterface.encodeFunctionData(
//     'requestOrder',
//     [
//       [
//         signer.address,
//         assetTokenAddress,
//         paymentTokenAddress,
//         sellOrder,
//         orderType,
//         paymentAmount, // Asset amount to sell. Ignored for buys. Fees will be taken from proceeds for sells.
//         0, // Payment amount to spend. Ignored for sells. Fees will be added to this amount for buys.
//         0, // Unused limit price
//         1, // GTC
//         ethers.ZeroAddress, // split recipient
//         0, // split amount
//       ],
//     ],
//   );
//   console.log('execute data loaded.....');
//   const executeTx = await getEthereumTransaction(
//     signer.address,
//     orderProcessorARBContractAddress,
//     executeData,
//     '0',
//   );
//   console.log('executeTx.....', executeTx);
//   // txs.push(executeTx);
//   const signature = await signAndSendBatchTransactionWithGasless(
//     signer.address,
//     signer.address,
//     txs,
//   );
//   console.log('Final ARB TX', signature);

//   return signature;
// };
async function getContractVersion(contract) {
  let contractVersion = '1';
  try {
    contractVersion = await contract.version();
  } catch {
    // do nothing
  }
  return contractVersion;
}
export const placeMarketOrderToDinariSell = async () => {
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
  // const privateKey = process.env.PRIVATE_KEY;
  // if (!privateKey) throw new Error('empty key');
  // const RPC_URL = process.env.RPC_URL;
  // if (!RPC_URL) throw new Error('empty rpc url');
  const assetTokenAddress = '0xed12e3394e78C2B0074aa4479b556043cC84503C'; // SPY
  const paymentTokenAddress = '0x709CE4CB4b6c2A03a4f938bA8D198910E44c11ff';

  // setup provider and signer
  const ethersProvider = getAuthCoreProviderEthers(LoginType.Email);
  const signerObj = await ethersProvider.getSigner();
  const chainId = Number((await provider.getNetwork()).chainId);
  const orderProcessorAddress = '';
  console.log(`Order Processor Address: ${orderProcessorAddress}`);

  // connect signer to payment token contract
  const paymentToken = new ethers.Contract(
    paymentTokenAddress,
    tokenAbi,
    signerObj,
  );

  // connect signer to asset token contract
  const assetToken = new ethers.Contract(assetTokenAddress, tokenAbi, signer);

  // connect signer to buy processor contract
  const orderProcessor = new ethers.Contract(
    orderProcessorAddress,
    orderProcessorAbi,
    signerObj,
  );

  // ------------------ Configure Order ------------------

  // buy order amount (1000 USDC)
  // const orderAmount = BigInt(1000_000_000);
  // sell order amount (10 dShares)
  const orderAmount = '';
  // buy order (Change to true for Sell Order)
  const sellOrder = true;
  // market order
  const orderType = Number(0);

  // check the order precision doesn't exceed max decimals
  // applicable to sell and limit orders only
  if (sellOrder || orderType === 1) {
    const maxDecimals = await orderProcessor.maxOrderDecimals(
      assetTokenAddress,
    );
    const assetTokenDecimals = await assetToken.decimals();
    const allowablePrecision = 10 ** (assetTokenDecimals - maxDecimals);
    if (Number(orderAmount) % allowablePrecision != 0) {
      throw new Error(
        `Order amount precision exceeds max decimals of ${maxDecimals}`,
      );
    }
  }

  // get fees, fees will be added to buy order deposit or taken from sell order proceeds
  // const fees = await orderProcessor.estimateTotalFeesForOrder(
  //   signer.address,
  //   true,
  //   paymentTokenAddress,
  //   orderAmount,
  // );
  // const totalSpendAmount = orderAmount + fees;
  // console.log(`fees: ${ethers.formatUnits(fees, 6)}`);

  // ------------------ Configure Permit ------------------

  // permit nonce for user
  const nonce = await paymentToken.nonces(signer.address);
  // 5 minute deadline from current blocktime
  const blockNumber = await provider.getBlockNumber();
  const blockTime = (await provider.getBlock(blockNumber))?.timestamp;
  if (!blockTime) throw new Error('no block time');
  const deadline = blockTime + 60 * 5;

  // unique signature domain for payment token
  const permitDomain = {
    name: await paymentToken.name(),
    version: await getContractVersion(paymentToken),
    chainId: chainId,
    verifyingContract: paymentTokenAddress,
  };

  // permit message to sign
  const permitMessage = {
    owner: signer.address,
    spender: orderProcessorAddress,
    value: totalSpendAmount,
    nonce: nonce,
    deadline: deadline,
  };

  // sign permit to spend payment token
  const permitSignatureBytes = await signerObj.signTypedData(
    permitDomain,
    permitTypes,
    permitMessage,
  );
  const permitSignature = ethers.Signature.from(permitSignatureBytes);

  // create selfPermit call data
  const selfPermitData = orderProcessor.interface.encodeFunctionData(
    'selfPermit',
    [
      paymentTokenAddress,
      permitMessage.owner,
      permitMessage.value,
      permitMessage.deadline,
      permitSignature.v,
      permitSignature.r,
      permitSignature.s,
    ],
  );

  // ------------------ Submit Order ------------------

  // create requestOrder call data
  // see IOrderProcessor.Order struct for order parameters
  const requestOrderData = orderProcessor.interface.encodeFunctionData(
    'requestOrder',
    [
      [
        signer.address,
        assetTokenAddress,
        paymentTokenAddress,
        sellOrder,
        orderType,
        0, // Asset amount to sell. Ignored for buys. Fees will be taken from proceeds for sells.
        orderAmount, // Payment amount to spend. Ignored for sells. Fees will be added to this amount for buys.
        0, // Unused limit price
        1, // GTC
        ethers.ZeroAddress, // split recipient
        0, // split amount
      ],
    ],
  );

  // submit permit + request order multicall transaction
  const tx = await orderProcessor.multicall([selfPermitData, requestOrderData]);
  const receipt = await tx.wait();
  console.log(tx.hash);

  // get order id from event
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
