// import {PROJECT_ID, CLIENT_KEY} from '@env';
// import {Polygon, BNBChain, ArbitrumOne} from '@particle-network/chains';
// import * as particleAuth from '@particle-network/rn-auth';
// import {Env, ParticleInfo} from '@particle-network/rn-auth';
// import * as particleAuthCore from '@particle-network/rn-auth-core';
// import * as particleAA from '@particle-network/rn-aa';
// import {
//   LoginType,
//   SocialLoginPrompt,
//   SupportAuthType,
// } from '@particle-network/rn-auth';
// import Web3 from 'web3';
import {ethers} from 'ethers';
// const projectId = PROJECT_ID;
// const clientKey = CLIENT_KEY;
// Get your project id and client from dashboard,
// https://dashboard.particle.network/
// const accountName = particleAuth.AccountName.BICONOMY_V1();
const biconomyApiKeys = {
  1: 'your ethereum mainnet key',
  5: 'your ethereum goerli key',
  137: 'Tooya3Rgo.1b5a0b68-a83c-4fe3-9ae9-9a5cb57fa809',
  80001: 'hYZIwIsf2.e18c790b-cafb-4c4e-a438-0289fc25dba1',
};
// export const initializedAuthCore = () => {
//   ParticleInfo.projectId = projectId; // your project id
//   ParticleInfo.clientKey = clientKey; // your client key
//   if (ParticleInfo.projectId === '' || ParticleInfo.clientKey === '') {
//     throw new Error(
//       'You need set project info, get your project id and client from dashboard, https://dashboard.particle.network',
//     );
//   }
//   const chainInfo = Polygon;
//   const env = Env.Dev;
//   particleAuth.init(chainInfo, env);
//   particleAuth.setModalPresentStyle(
//     particleAuth.iOSModalPresentStyle.FullScreen,
//   );
//   particleAuth.setAppearance(particleAuth.Appearance.Dark);
//   particleAuthCore.init();
//   console.log('init auth core....');
//   particleAA.init(particleAuth.AccountName.BICONOMY_V1(), {});
//   console.log('init AA sdk.....');
// };
// const chainInfoOnId = chainId => {
//   switch (chainId) {
//     case 137:
//       return Polygon;
//     case 56:
//       return BNBChain;
//     case 42161:
//       return ArbitrumOne;
//   }
// };

// export const switchAuthCoreChain = async chainId => {
//   const chainInfo = chainInfoOnId(chainId);
//   const result = await particleAuthCore.switchChain(chainInfo);
//   return result;
// };
// export const getAuthCoreProvider = loginType => {
//   const provider = new particleAuthCore.ParticleAuthCoreProvider({
//     projectId,
//     clientKey,
//     loginType,
//   });
//   // @ts-ignore
//   const web3 = new Web3(provider);
//   return web3;
// };
// export const getAuthCoreProviderEthers = loginType => {
//   const provider = new particleAuthCore.ParticleAuthCoreProvider({
//     projectId,
//     clientKey,
//     loginType,
//   });
//   // @ts-ignore
//   const ether = new ethers.BrowserProvider(provider);
//   console.log('start....');
//   return ether;
// };
// export const connectWithAuthCore = async navigation => {
//   const supportAuthType = [SupportAuthType.Email];
//   const result = await particleAuthCore.connect(
//     LoginType.Email,
//     null,
//     supportAuthType,
//     SocialLoginPrompt.SelectAccount,
//     {
//       projectName: 'Enter a new era of finance',
//       imagePath:
//         'https://res.cloudinary.com/xade-finance/image/upload/v1711467035/mxhgrkatrattznnzkuif.jpg',
//     },
//   );
//   if (result.status) {
//     const userInfo = result.data;
//     console.log('connect', userInfo);
//     return userInfo;
//   } else {
//     const error = result.data;
//     console.log('connect', error);
//     navigation.navigate('LoggedOutHome');
//     return 0;
//   }
// };
// export const isLoggedIn = async () => {
//   try {
//     const result = await particleAuthCore.isConnected();
//     return result;
//   } catch (error) {
//     return 0;
//   }
// };
// export const particleAuthCoreLogout = async () => {
//   try {
//     await particleAuthCore.disconnect();
//   } catch (error) {
//     return 0;
//   }
// };
// export const getUserInfoFromAuthCore = async () => {
//   try {
//     const result = await particleAuthCore.getUserInfo();
//     return result;
//   } catch (error) {
//     return 0;
//   }
// };
// export const getUserAddressFromAuthCoreSDK = async () => {
//   try {
//     const result = await particleAuthCore.evm.getAddress();
//     return result;
//   } catch (error) {
//     return 0;
//   }
// };
// export const getUserSolanaAddressFromAuthCoreSDK = async () => {
//   try {
//     const result = await particleAuthCore.solana.getAddress();
//     return result;
//   } catch (error) {
//     return 0;
//   }
// };
// export const getSmartAccountAddress = async eoaAddress => {
//   try {
//     const smartAccountParam = {
//       name: accountName.name,
//       version: accountName.version,
//       ownerAddress: eoaAddress,
//     };
//     const result = await particleAuth.EvmService.getSmartAccount([
//       smartAccountParam,
//     ]);
//     const smartAccountAddress = result[0]?.smartAccountAddress;
//     console.log('smartAccountAddress', result);
//     return smartAccountAddress;
//   } catch (error) {
//     console.log('error in scw', error);
//   }
// };
// export const depolyAAAndGetSCAddress = async () => {
//   const eoaAddress = await getUserAddressFromAuthCoreSDK();
//   const result = await particleAA.isDeploy(eoaAddress);
//   console.log('AA Deployed result', eoaAddress, result);
//   if (result.status) {
//     const isDeploy = result.data;
//     console.log('isDeploy result', isDeploy);
//     const scw = await getSmartAccountAddress(eoaAddress);
//     console.log('scw address........', scw);
//     let isAAModeEnable = await particleAA.isAAModeEnable();
//     console.log('is enabled result', eoaAddress, isAAModeEnable);
//     if (!isAAModeEnable) {
//       particleAA.enableAAMode();
//     }
//     console.log('is enabled after result', scw, eoaAddress, isAAModeEnable);
//     return scw;
//   } else {
//     const error = result.data;
//     console.log('isDeploy result', error);
//     return 0;
//   }
// };
// export async function getEthereumTransaction(from, to, data, amount) {
//   // mock a evm native transaction,
//   // type is 0x2, should work in Ethereum, Polygon and other blockchains which support EIP1559
//   // send 0.01 native
//   try {
//     return await particleAuth.EvmService.createTransaction(
//       from,
//       data,
//       amount,
//       to,
//     );
//   } catch (error) {
//     console.log('approve tx', error);
//   }
// }
// export async function getSignedMessage(message) {
//   // mock a evm native transaction,
//   // type is 0x2, should work in Ethereum, Polygon and other blockchains which support EIP1559
//   // send 0.01 native
//   try {
//     return await particleAuthCore.evm.personalSign(message);
//   } catch (error) {
//     console.log('approve tx', error?.response?.data);
//   }
// }
// export async function getSignerObjectParticleAuthCore() {
//   return particleAuthCore.evm;
// }
// export const signAndSendBatchTransactionWithGasless = async (
//   eoaAddress,
//   smartAccountAddress,
//   transactions,
// ) => {
//   const resultDeploy = await particleAA.isDeploy(eoaAddress);
//   console.log('deploy result....', resultDeploy);
//   if (resultDeploy.status) {
//     const isDeploy = resultDeploy.data;
//     if (resultDeploy.data) {
//       const resultAAEnableMode = await particleAA.isAAModeEnable();
//       try {
//         const wholeFeeQuote = await particleAA.rpcGetFeeQuotes(
//           eoaAddress,
//           transactions,
//         );

//         if (!resultAAEnableMode) {
//           particleAA.enableAAMode();
//         }

//         if (smartAccountAddress === undefined) {
//           return;
//         }

//         const verifyingPaymasterGasless =
//           wholeFeeQuote.verifyingPaymasterGasless;
//         if (verifyingPaymasterGasless === undefined) {
//           console.log('gasless is not available');
//           return;
//         }

//         if (verifyingPaymasterGasless === undefined) {
//           console.log('gasless is not available');
//           return;
//         }
//         const result = await particleAuthCore.evm.batchSendTransactions(
//           transactions,
//           particleAuth.AAFeeMode.gasless(wholeFeeQuote),
//         );
//         if (result.status) {
//           const signature = result.data;
//           console.log('signAndSendTransactionWithGasless result', signature);
//           return signature;
//         } else {
//           const error = result.data;
//           console.log('signAndSendTransactionWithGasless result error', error);
//         }
//       } catch (error) {
//         console.log('error....', error);
//       }
//     } else if (resultDeploy.data === false) {
//       const error = resultDeploy.data;
//       console.log('isDeploy result error', transactions, error);
//       const wholeFeeQuote = await particleAA.rpcGetFeeQuotes(
//         eoaAddress,
//         transactions,
//       );
//       const deploySmartAccount =
//         await particleAuthCore.evm.batchSendTransactions(
//           transactions,
//           particleAuth.AAFeeMode.gasless(wholeFeeQuote),
//         );
//       console.log('here........', deploySmartAccount);
//       return deploySmartAccount.data;
//     }
//   }
// };
export const encodeFunctionForDLN = params => {
  const proxyDLN = new ethers.Contract(
    '0xd1cb82a4d5c9086a2a7fdeef24fdb1c0a55bba58',
    [
      {
        inputs: [
          {
            internalType: 'address',
            name: '_dlnSourceAddress',
            type: 'address',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'bytes32',
            name: 'orderId',
            type: 'bytes32',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'giveTokenAddress',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'giveAmount',
                type: 'uint256',
              },
              {
                internalType: 'bytes',
                name: 'takeTokenAddress',
                type: 'bytes',
              },
              {
                internalType: 'uint256',
                name: 'takeAmount',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'takeChainId',
                type: 'uint256',
              },
              {
                internalType: 'bytes',
                name: 'receiverDst',
                type: 'bytes',
              },
              {
                internalType: 'address',
                name: 'givePatchAuthoritySrc',
                type: 'address',
              },
              {
                internalType: 'bytes',
                name: 'orderAuthorityAddressDst',
                type: 'bytes',
              },
              {
                internalType: 'bytes',
                name: 'allowedTakerDst',
                type: 'bytes',
              },
              {
                internalType: 'bytes',
                name: 'externalCall',
                type: 'bytes',
              },
              {
                internalType: 'bytes',
                name: 'allowedCancelBeneficiarySrc',
                type: 'bytes',
              },
            ],
            indexed: false,
            internalType: 'struct OrderCreation',
            name: 'orderCreation',
            type: 'tuple',
          },
        ],
        name: 'OrderCallOrder',
        type: 'event',
      },
      {
        inputs: [],
        name: 'deposit',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'dlnSourceAddress',
        outputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'globalFixedNativeFee',
        outputs: [
          {
            internalType: 'uint88',
            name: '',
            type: 'uint88',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'ownerAddress',
        outputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'giveTokenAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'giveAmount',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'takeTokenAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'takeAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'takeChainId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'receiverDst',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'givePatchAuthoritySrc',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'orderAuthorityAddressDst',
            type: 'address',
          },
        ],
        name: 'placeOrder',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address payable',
            name: '_to',
            type: 'address',
          },
        ],
        name: 'transferAllNativeToken',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: '_tokenAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: '_to',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
        ],
        name: 'transferAnyToken',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
  );
  return proxyDLN.interface.encodeFunctionData('placeOrder', params);
};
