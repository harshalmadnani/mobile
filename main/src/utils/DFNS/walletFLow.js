import axios from 'axios';
import {dfnsProviderClient} from './utils';
import {DfnsWallet} from '@dfns/lib-viem';
import {PaymasterMode, createSmartAccountClient} from '@biconomy/account';
import {
  createPublicClient,
  createWalletClient,
  encodeFunctionData,
  http,
  parseAbi,
} from 'viem';
import {arbitrum, base, mainnet, polygon} from 'viem/chains';
import {toAccount} from 'viem/accounts';
import {entryPointAbi} from './entryPointAbi';

export const getScwAddress = async (authToken, walletId) => {
  try {
    // Start delegated registration flow. Server needs to obtain the challenge with the appId
    // and appOrigin of the mobile application. For simplicity, they are included as part of
    // the request body. Alternatively, they can be sent as headers or with other approaches.

    const res = await axios.post(
      `https://gull-relevant-secretly.ngrok-free.app/wallets/scw`,
      {
        appId: 'ap-35g4l-pmp4e-8h8afn39lfupofch',
        walletId,
        authToken,
      },
      {
        headers: {
          'content-type': 'application/json',
        },
      },
    );
    const jwt = res.data;
    console.log('scw address.....', jwt);
    return jwt?.scw;
  } catch (error) {
    console.log('error on registering..........', error);
  } finally {
  }
};
export const getChainOnId = chainId => {
  switch (chainId) {
    case 137:
      return polygon;
    case 1:
      return mainnet;
    case 8453:
      return base;
    case 42161:
      return arbitrum;
    default:
      return polygon;
  }
};
const readEntryPointContract = async (functionName, args, chainId) => {
  const instanceClient = createPublicClient({
    chain: getChainOnId(chainId),
    transport: http(),
  });
  const data = await instanceClient.readContract({
    address: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
    abi: entryPointAbi,
    functionName,
    args,
  });
  console.log('data.....', data);
  return data;
};
export const transferTokenGassless = async (
  authToken,
  walletId,
  chainId,
  isNative,
  tokenAddress,
  to,
  amount,
) => {
  try {
    // Start delegated registration flow. Server needs to obtain the challenge with the appId
    // and appOrigin of the mobile application. For simplicity, they are included as part of
    // the request body. Alternatively, they can be sent as headers or with other approaches.
    let client = dfnsProviderClient(authToken);
    let dfnsWalletSigner = await DfnsWallet.init({
      walletId,
      dfnsClient: client,
    });
    const walletClient = createWalletClient({
      account: toAccount(dfnsWalletSigner),
      chain: getChainOnId(chainId),
      transport: http(),
    });
    const smartAccountClient = await createSmartAccountClient({
      signer: walletClient,
      provider: walletClient,
      biconomyPaymasterApiKey: 'UfZhdqxYR.528b38b4-89d7-4b33-9006-6856b9c82d64',
      rpcUrl:
        'https://polygon-mainnet.g.alchemy.com/v2/gBoo6ihGnSUa3ObT49K36yHG6BdtyuVo',
      bundlerUrl: `https://bundler.biconomy.io/api/v2/137/dewj2189.wh1289hU-7E49-45ic-af80-yQ1n8Km3S`,
    });
    const scwAddress = await smartAccountClient.getAccountAddress();
    const nonce = await readEntryPointContract(
      'getNonce',
      [scwAddress, '0'],
      chainId,
    );
    console.log(
      'smart account address created =====',
      nonce?.toString(),
      scwAddress,
    );
    if (isNative) {
      const userOpResponse = await smartAccountClient.sendTransaction(
        {
          to: to,
          value: amount,
          data: 0,
        },
        {
          paymasterServiceData: {mode: PaymasterMode.SPONSORED},
          nonceOptions: {nonceOverride: parseInt(nonce?.toString())},
        },
      );
      console.log(`User operation hash: ${userOpResponse.userOpHash}`);
      const {transactionHash} = await userOpResponse.waitForTxHash();
      const userOpReceipt = await userOpResponse.wait();
      if (userOpReceipt.success == 'true') {
        console.log('UserOp receipt', userOpReceipt);
        console.log('Transaction receipt', userOpReceipt.receipt);
        return transactionHash;
      }
    } else {
      const userOpResponse = await smartAccountClient.sendTransaction(
        {
          to: tokenAddress,
          data: encodeFunctionData({
            abi: parseAbi(['function transfer(address _to, uint256 _value)']),
            functionName: 'transfer',
            args: [to, amount],
          }),
        },
        {
          paymasterServiceData: {mode: PaymasterMode.SPONSORED},
          nonceOptions: {nonceOverride: parseInt(nonce?.toString())},
        },
      );
      console.log(`User operation hash: ${userOpResponse.userOpHash}`);
      const {transactionHash} = await userOpResponse.waitForTxHash();
      const userOpReceipt = await userOpResponse.wait();
      if (userOpReceipt.success == 'true') {
        console.log('UserOp receipt', userOpReceipt);
        console.log('Transaction receipt', userOpReceipt.receipt);
        return transactionHash;
      }
    }
  } catch (error) {
    console.log('error on registering..........', error);
  } finally {
  }
};
export const getSmartAccountAddress = async (authToken, walletId, chainId) => {
  try {
    // Start delegated registration flow. Server needs to obtain the challenge with the appId
    // and appOrigin of the mobile application. For simplicity, they are included as part of
    // the request body. Alternatively, they can be sent as headers or with other approaches.
    let client = dfnsProviderClient(authToken);
    let dfnsWalletSigner = await DfnsWallet.init({
      walletId,
      dfnsClient: client,
    });
    const walletClient = createWalletClient({
      account: toAccount(dfnsWalletSigner),
      chain: getChainOnId(parseInt(chainId)),
      transport: http(),
    });
    const smartAccountClient = await createSmartAccountClient({
      signer: walletClient,
      provider: walletClient,
      biconomyPaymasterApiKey: 'UfZhdqxYR.528b38b4-89d7-4b33-9006-6856b9c82d64',
      // rpcUrl:
      //   'https://polygon-mainnet.g.alchemy.com/v2/gBoo6ihGnSUa3ObT49K36yHG6BdtyuVo',
      bundlerUrl: `https://bundler.biconomy.io/api/v2/${chainId}/dewj2189.wh1289hU-7E49-45ic-af80-yQ1n8Km3S`,
    });
    const scwAddress = await smartAccountClient.getAccountAddress();
    return scwAddress;
  } catch (error) {
    console.log('error on registering..........', error);
  }
};
export const tradeTokenGasless = async (authToken, walletId, chainId, txns) => {
  try {
    // Start delegated registration flow. Server needs to obtain the challenge with the appId
    // and appOrigin of the mobile application. For simplicity, they are included as part of
    // the request body. Alternatively, they can be sent as headers or with other approaches.
    let client = dfnsProviderClient(authToken);
    let dfnsWalletSigner = await DfnsWallet.init({
      walletId,
      dfnsClient: client,
    });
    const walletClient = createWalletClient({
      account: toAccount(dfnsWalletSigner),
      chain: getChainOnId(chainId),
      transport: http(),
    });
    const smartAccountClient = await createSmartAccountClient({
      signer: walletClient,
      provider: walletClient,
      biconomyPaymasterApiKey: 'UfZhdqxYR.528b38b4-89d7-4b33-9006-6856b9c82d64',
      rpcUrl:
        'https://polygon-mainnet.g.alchemy.com/v2/gBoo6ihGnSUa3ObT49K36yHG6BdtyuVo',
      bundlerUrl: `https://bundler.biconomy.io/api/v2/137/dewj2189.wh1289hU-7E49-45ic-af80-yQ1n8Km3S`,
    });
    const scwAddress = await smartAccountClient.getAccountAddress();
    const nonce = await readEntryPointContract(
      'getNonce',
      [scwAddress, '0'],
      chainId,
    );
    console.log(
      'smart account address created =====',
      nonce?.toString(),
      scwAddress,
    );
    const userOpResponse = await smartAccountClient.sendTransaction(txns, {
      paymasterServiceData: {mode: PaymasterMode.SPONSORED},
      nonceOptions: {nonceOverride: parseInt(nonce?.toString())},
    });
    console.log(`User operation hash: ${userOpResponse.userOpHash}`);
    const {transactionHash} = await userOpResponse.waitForTxHash();
    const userOpReceipt = await userOpResponse.wait();
    if (userOpReceipt.success == 'true') {
      console.log('UserOp receipt', userOpReceipt);
      console.log('Transaction receipt', userOpReceipt.receipt);
      return transactionHash;
    }
  } catch (error) {
    console.log('error on registering..........', error);
  } finally {
  }
};
