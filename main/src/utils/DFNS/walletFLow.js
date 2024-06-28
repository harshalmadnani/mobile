import axios from 'axios';
import {dfnsProviderClient, iosStagingAppId} from './utils';
import {DfnsWallet} from '@dfns/lib-viem';
import {PaymasterMode, createSmartAccountClient} from '@biconomy/account';
import {
  createPublicClient,
  createWalletClient,
  encodeFunctionData,
  http,
  parseAbi,
} from 'viem';
import {arbitrum, base, bsc, mainnet, polygon} from 'viem/chains';
import {toAccount} from 'viem/accounts';
import {entryPointAbi} from './entryPointAbi';
import {Platform} from 'react-native';
export const getPaymasterKeyOnName = chain => {
  switch (chain) {
    case 'Polygon':
      return 'UfZhdqxYR.528b38b4-89d7-4b33-9006-6856b9c82d64';
    case 'Bsc':
      return 'PtenFME78.7ec6feef-5f51-4cfd-ae5a-a2efe0ae712d';
    case 'Base':
      return 'PsoPGd6TZ.7cfbc00c-7cee-4bf8-815c-2cab0db4a8e1';
    case 'ArbitrumOne':
      return '3OjDX_U5v.7a176ce5-e0bb-4906-8186-729255e8ef7c';
    default:
      return 'UfZhdqxYR.528b38b4-89d7-4b33-9006-6856b9c82d64';
  }
};
export const getPaymasterKeyOnId = chain => {
  switch (chain) {
    case '137':
      return 'UfZhdqxYR.528b38b4-89d7-4b33-9006-6856b9c82d64';
    case '56':
      return 'PtenFME78.7ec6feef-5f51-4cfd-ae5a-a2efe0ae712d';
    case '8453':
      return 'PsoPGd6TZ.7cfbc00c-7cee-4bf8-815c-2cab0db4a8e1';
    case '42161':
      return '3OjDX_U5v.7a176ce5-e0bb-4906-8186-729255e8ef7c';
    default:
      return 'UfZhdqxYR.528b38b4-89d7-4b33-9006-6856b9c82d64';
  }
};

export const getIdOnChain = chain => {
  switch (chain) {
    case 'Polygon':
      return '137';
    case 'Bsc':
      return '56';
    case 'ArbitrumOne':
      return '42161';
    case 'Base':
      return '8453';
  }
};
export const getProviderOnName = chain => {
  switch (chain) {
    case 'Polygon':
      return polygon;
    case 'Bsc':
      return bsc;
    case 'Base':
      return base;
    case 'ArbitrumOne':
      return arbitrum;
    default:
      return polygon;
  }
};
export const getScwAddress = async (authToken, walletId) => {
  try {
    // Start delegated registration flow. Server needs to obtain the challenge with the appId
    // and appOrigin of the mobile application. For simplicity, they are included as part of
    // the request body. Alternatively, they can be sent as headers or with other approaches.
    const res = await axios.post(
      `http://api-dfns.xade.finance/wallets/scw`,
      {
        appId: Platform.OS === 'ios' ? iosStagingAppId : androidStagingAppId,
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
export const getAllScwAddress = async (authToken, walletIds) => {
  const result = await Promise.all(
    walletIds.map(async (x, i) => {
      let client = dfnsProviderClient(authToken);
      let dfnsWWalletSigner = await DfnsWallet.init({
        walletId: x?.id,
        dfnsClient: client,
      });
      const walletClient = createWalletClient({
        account: toAccount(dfnsWWalletSigner),
        chain: getProviderOnName(x?.network),
        transport:
          x?.network === 'Polygon'
            ? http(
                'https://polygon-mainnet.g.alchemy.com/v2/TjxOaj0jbq-FVA2jFK2p_h_KnrooFuHg',
              )
            : http(),
      });
      const smartAccountClient = await createSmartAccountClient({
        signer: walletClient,
        biconomyPaymasterApiKey: getPaymasterKeyOnName(x?.network),
        bundlerUrl: `https://bundler.biconomy.io/api/v2/${getIdOnChain(
          x?.network,
        )}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f444`,
      });
      console.log(
        'smart account client created =====',
        x?.network,
        smartAccountClient,
      );

      const scwAddress = await smartAccountClient.getAccountAddress();
      console.log('smart account address created =====', scwAddress);
      return {
        address: scwAddress,
        chainId: getIdOnChain(x?.network),
      };
    }),
  );
  console.log('smart account address all........', result);
  return result;
};
export const getChainOnId = chainId => {
  switch (chainId) {
    case 137:
      return polygon;
    case 56:
      return bsc;
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
    chain: getChainOnId(parseInt(chainId)),
    transport:
      parseInt(chainId) === 137
        ? http(
            'https://polygon-mainnet.g.alchemy.com/v2/TjxOaj0jbq-FVA2jFK2p_h_KnrooFuHg',
          )
        : http(),
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
  scwAddress,
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
    console.log(
      'chain id',
      getChainOnId(parseInt(chainId)),
      chainId,
      getPaymasterKeyOnId(chainId?.toString()),
    );
    const walletClient = createWalletClient({
      account: toAccount(dfnsWalletSigner),
      chain: getChainOnId(parseInt(chainId)),
      transport:
        parseInt(chainId) === 137
          ? http(
              'https://polygon-mainnet.g.alchemy.com/v2/TjxOaj0jbq-FVA2jFK2p_h_KnrooFuHg',
            )
          : http(),
    });
    const smartAccountClient = await createSmartAccountClient({
      signer: walletClient,
      provider: walletClient,
      biconomyPaymasterApiKey: getPaymasterKeyOnId(chainId?.toString()),
      bundlerUrl: `https://bundler.biconomy.io/api/v2/${chainId?.toString()}/dewj2189.wh1289hU-7E49-45ic-af80-yQ1n8Km3S`,
    });
    // const scwAddress = await smartAccountClient.getAccountAddress();
    const nonce = await readEntryPointContract(
      'getNonce',
      [scwAddress, '0'],
      chainId,
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
      transport:
        parseInt(chainId) === 137
          ? http(
              'https://polygon-mainnet.g.alchemy.com/v2/TjxOaj0jbq-FVA2jFK2p_h_KnrooFuHg',
            )
          : http(),
    });
    const smartAccountClient = await createSmartAccountClient({
      signer: walletClient,
      provider: walletClient,
      biconomyPaymasterApiKey: getPaymasterKeyOnId(chainId?.toString()),
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
      chain: getChainOnId(parseInt(chainId)),
      transport:
        parseInt(chainId) === 137
          ? http(
              'https://polygon-mainnet.g.alchemy.com/v2/TjxOaj0jbq-FVA2jFK2p_h_KnrooFuHg',
            )
          : http(),
    });
    console.log('here....chain id', chainId);
    const smartAccountClient = await createSmartAccountClient({
      signer: walletClient,
      provider: walletClient,
      biconomyPaymasterApiKey: getPaymasterKeyOnId(chainId?.toString()),
      bundlerUrl: `https://bundler.biconomy.io/api/v2/${chainId?.toString()}/dewj2189.wh1289hU-7E49-45ic-af80-yQ1n8Km3S`,
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
