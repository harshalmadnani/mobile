// import {PROJECT_ID, CLIENT_KEY} from '@env';
// import {
//   Polygon,
//   Ethereum,
//   BNBChain,
//   Avalanche,
//   Base,
//   ArbitrumOne,
//   ArbitrumNova,
// } from '@particle-network/chains';
// import {ethers} from 'ethers';
// import erc20 from '../screens/loggedIn/payments/USDC.json';
// import {Env, ParticleInfo} from '@particle-network/rn-auth';
// import Web3 from 'web3';
// import * as particleConnect from '@particle-network/rn-connect';
// import {DappMetaData, WalletType} from '@particle-network/rn-connect';
// import * as particleAuth from '@particle-network/rn-auth';
// import {chainInfoOnId, getEthereumTransaction} from './particleCoreSDK';
// // import BigNumber from 'bignumber.js';
// const projectId = PROJECT_ID;
// const clientKey = CLIENT_KEY;
// // Get your project id and client from dashboard,
// // https://dashboard.particle.network/
// let newWeb3;
// export const listOfWallet = [
//   {
//     name: WalletType.MetaMask,
//     url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/1200px-MetaMask_Fox.svg.png',
//   },
//   {
//     name: WalletType.Trust,
//     url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/1200px-MetaMask_Fox.svg.png',
//   },
//   {
//     name: WalletType.Rainbow,
//     url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/1200px-MetaMask_Fox.svg.png',
//   },
//   {
//     name: WalletType.ImToken,
//     url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/1200px-MetaMask_Fox.svg.png',
//   },
//   {
//     name: WalletType.Inch1,
//     url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/1200px-MetaMask_Fox.svg.png',
//   },
//   {
//     name: WalletType.WalletConnect,
//     url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/1200px-MetaMask_Fox.svg.png',
//   },
//   {
//     name: WalletType.Phantom,
//     url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/1200px-MetaMask_Fox.svg.png',
//   },
// ];
// export const initializedParticleConnect = () => {
//   // Get your project id and client from dashboard,
//   // https://dashboard.particle.network/

//   ParticleInfo.projectId = projectId; // your project id
//   ParticleInfo.clientKey = clientKey; // your client key

//   if (ParticleInfo.projectId == '' || ParticleInfo.clientKey == '') {
//     throw new Error(
//       'You need set project info, Get your project id and client from dashboard, https://dashboard.particle.network',
//     );
//   }

//   const chainInfo = Polygon;
//   const env = Env.Dev;
//   const metadata = new DappMetaData(
//     'cb6fc19a389caeab31f49d301b87ad73',
//     'https://xade.finance',
//     'https://connect.particle.network/icons/512.png',
//     'Xade Finance',
//     'Xade: The Crypto Neobank',
//     '',
//     '',
//   );

//   // the rpcUrl works for WalletType EvmPrivateKey and SolanaPrivakey
//   // we have default rpc url in native SDK
//   particleConnect.init(chainInfo, env, metadata);

//   const chainInfos = [
//     Ethereum,
//     Polygon,
//     BNBChain,
//     Avalanche,
//     Base,
//     ArbitrumOne,
//   ];
//   particleConnect.setWalletConnectV2SupportChainInfos(chainInfos);
// };

// export const connectWitParticleConnect = async walletType => {
//   const result = await particleConnect.connect(walletType);
//   if (result.status) {
//     console.log('connect success');
//     const account = result.data?.publicAddress;
//     console.log('pnaccount = ', account);
//     const provider = new particleConnect.ParticleConnectProvider({
//       projectId,
//       clientKey,
//       walletType,
//       account,
//     });
//     // @ts-ignore
//     newWeb3 = new Web3(provider);
//     return account;
//   } else {
//     const error = result.data;
//     console.log('Particle connect error......', error);
//   }
// };
// export const disconnectParticleConnect = async (publicAddress, walletType) => {
//   if (publicAddress == undefined) {
//     console.log('publicAddress is underfined, you need connect');
//     return;
//   }
//   const result = await particleConnect.disconnect(walletType, publicAddress);
//   if (result.status) {
//     console.log(result.data);
//   } else {
//     const error = result.data;
//     console.log(error);
//   }
// };
// export async function getEthereumTransaction(from, to, data, amount) {
//   // mock a evm native transaction,
//   // type is 0x2, should work in Ethereum, Polygon and other blockchains which support EIP1559
//   // send 0.01 native
//   try {
//     console.log('evm tx.....', from, to, data, amount);
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
// export const getConnectProvider = walletType => {
//   const provider = new particleConnect.ParticleConnectProvider({
//     projectId,
//     clientKey,
//     walletType,
//   });
//   // @ts-ignore
//   const web3 = new Web3(provider);
//   console.log('HEre....', web3);
//   return web3;
// };
// export const particleConnectGetChainId = async walletType => {
//   try {
//     const provider = new particleConnect.ParticleConnectProvider({
//       projectId,
//       clientKey,
//       walletType,
//     });
//     // @ts-ignore
//     const web3 = new Web3(provider);
//     const chainId = await web3?.eth.getChainId();
//     console.log('web3.eth.getChainId', chainId);
//     // Toast.show({
//     //   type: 'success',
//     //   text1: 'chainId',
//     //   text2: String(chainId),
//     // });
//   } catch (error) {
//     console.log('web3.eth.getChainId', error);
//     // if (error instanceof Error) {
//     //   Toast.show({type: 'error', text1: error.message});
//     // }
//   }
// };
// export const particleConnectWalletSwitchEthereumChain = async (
//   walletType,
//   id,
// ) => {
//   try {
//     const chainInfo = chainInfoOnId(id);
//     const chainId = '0x' + chainInfo.id.toString(16);
//     const provider = new particleConnect.ParticleConnectProvider({
//       projectId,
//       clientKey,
//       walletType,
//     });
//     // @ts-ignore
//     const web3 = new Web3(provider);
//     // @ts-ignore
//     const result = await web3?.currentProvider.request({
//       method: 'wallet_switchEthereumChain',
//       params: [{chainId: chainId}],
//     });
//     console.log('web3 wallet_switchEthereumChain', result);
//     // Toast.show({
//     //   type: 'success',
//     //   text1: 'Successfully switched',
//     // });
//   } catch (error) {
//     return error?.message;
//     // console.log('web3 wallet_switchEthereumChain', error);
//     // if (error instanceof Error) {
//     //   Toast.show({type: 'error', text1: error.message});
//     // }
//   }
// };

// export const particleConnectExecuteTxSameChain = async (
//   walletType,
//   address,
//   tokenAddress,
//   tx,
//   amount,
// ) => {
//   try {
//     const erc20Abi = new ethers.Interface(erc20);
//     const sendData = erc20Abi.encodeFunctionData('approve', [
//       tx?.to,
//       amount.toString(),
//     ]);
//     const approveTx = await getEthereumTransaction(
//       address,
//       tokenAddress,
//       sendData,
//       '0',
//     );
//     const executeDLNSap = await getEthereumTransaction(
//       address,
//       tx?.to,
//       tx?.data,
//       '0',
//     );
//     console.log('tx executing swapping part', address, tx?.to, tx?.data, '0');
//     // txs.push(executeDLNSap);
//     try {
//       const result = await particleConnect.signAndSendTransaction(
//         walletType,
//         address,
//         executeDLNSap,
//       );
//       console.log('web3.eth.sendTransaction', result);
//     } catch (error) {
//       console.log('web3.eth.sendTransaction error', error);
//     }

//     // Toast.show({
//     //   type: 'success',
//     //   text1: 'Successfully switched',
//     // });
//   } catch (error) {
//     return error?.message;
//     // console.log('web3 wallet_switchEthereumChain', error);
//     // if (error instanceof Error) {
//     //   Toast.show({type: 'error', text1: error.message});
//     // }
//   }
// };
// export const particleConnectExecuteTxCrossChain = async (
//   walletType,
//   address,
//   tokenAddress,
//   tx,
//   amount,
// ) => {
//   try {
//     const erc20Abi = new ethers.Interface(erc20);
//     console.log('started', tx?.to, amount);
//     const data = erc20Abi.encodeFunctionData('approve', [tx?.to, amount]);
//     // console.log('here.....', address, tokenAddress, data, '0');
//     const approveTx = await getEthereumTransaction(
//       address,
//       tokenAddress,
//       data,
//       '0',
//     );

//     console.log('tx to approve....', approveTx);

//     try {
//       const result = await particleConnect.signAllTransactions(
//         walletType,
//         address,
//         [approveTx],
//       );
//       console.log('web3.eth.sendTransaction', result);
//     } catch (error) {
//       console.log('web3.eth.sendTransaction error', error);
//     }

//     // Toast.show({
//     //   type: 'success',
//     //   text1: 'Successfully switched',
//     // });
//   } catch (error) {
//     return error?.message;
//     // console.log('web3 wallet_switchEthereumChain', error);
//     // if (error instanceof Error) {
//     //   Toast.show({type: 'error', text1: error.message});
//     // }
//   }
// };
// // export const isLoggedIn = async () => {
// //   try {
// //     const result = await particleAuthCore.isConnected();
// //     return result;
// //   } catch (error) {
// //     return 0;
// //   }
// // };
// // export const particleAuthCoreLogout = async () => {
// //   try {
// //     await particleAuthCore.disconnect();
// //   } catch (error) {
// //     return 0;
// //   }
// // };
// // export const getUserInfoFromAuthCore = async () => {
// //   try {
// //     const result = await particleAuthCore.getUserInfo();
// //     return result;
// //   } catch (error) {
// //     return 0;
// //   }
// // };
// // export const getUserAddressFromAuthCoreSDK = async () => {
// //   try {
// //     const result = await particleAuthCore.evm.getAddress();
// //     return result;
// //   } catch (error) {
// //     return 0;
// //   }
// // };
// // export const getUserSolanaAddressFromAuthCoreSDK = async () => {
// //   try {
// //     const result = await particleAuthCore.solana.getAddress();
// //     return result;
// //   } catch (error) {
// //     return 0;
// //   }
// // };
// // export const getSmartAccountAddress = async eoaAddress => {
// //   try {
// //     const smartAccountParam = {
// //       name: accountName.name,
// //       version: accountName.version,
// //       ownerAddress: eoaAddress,
// //     };
// //     const result = await particleAuth.EvmService.getSmartAccount([
// //       smartAccountParam,
// //     ]);
// //     const smartAccountAddress = result[0]?.smartAccountAddress;
// //     console.log('smartAccountAddress', result);
// //     return smartAccountAddress;
// //   } catch (error) {
// //     console.log('error in scw', error);
// //   }
// // };
// // export const depolyAAAndGetSCAddress = async () => {
// //   const eoaAddress = await getUserAddressFromAuthCoreSDK();
// //   const result = await particleAA.isDeploy(eoaAddress);
// //   console.log('AA Deployed result', eoaAddress, result);
// //   if (result.status) {
// //     const isDeploy = result.data;
// //     console.log('isDeploy result', isDeploy);
// //     const scw = await getSmartAccountAddress(eoaAddress);
// //     console.log('scw address........', scw);
// //     let isAAModeEnable = await particleAA.isAAModeEnable();
// //     console.log('is enabled result', eoaAddress, isAAModeEnable);
// //     if (!isAAModeEnable) {
// //       particleAA.enableAAMode();
// //     }
// //     console.log('is enabled after result', scw, eoaAddress, isAAModeEnable);
// //     return scw;
// //   } else {
// //     const error = result.data;
// //     console.log('isDeploy result', error);
// //     return 0;
// //   }
// // };
// // export async function getEthereumTransaction(from, to, data, amount) {
// //   // mock a evm native transaction,
// //   // type is 0x2, should work in Ethereum, Polygon and other blockchains which support EIP1559
// //   // send 0.01 native
// //   try {
// //     return await particleAuth.EvmService.createTransaction(
// //       from,
// //       data,
// //       amount,
// //       to,
// //     );
// //   } catch (error) {
// //     console.log('approve tx', error);
// //   }
// // }
// // export const signAndSendBatchTransactionWithGasless = async (
// //   eoaAddress,
// //   smartAccountAddress,
// //   transactions,
// // ) => {
// //   console.log(
// //     'Eoa address inside function',
// //     eoaAddress,
// //     smartAccountAddress,
// //     transactions,
// //   );

// //   const resultDeploy = await particleAA.isDeploy(eoaAddress);

// //   if (resultDeploy.status) {
// //     const isDeploy = resultDeploy.data;
// //     console.log('isDeploy result', isDeploy);
// //   } else {
// //     const error = resultDeploy.data;
// //     console.log('isDeploy result', error);
// //   }
// //   const resultAAEnableMode = await particleAA.isAAModeEnable();
// //   console.log('Enable result', transactions.length, eoaAddress);
// //   try {
// //     const wholeFeeQuote = await particleAA.rpcGetFeeQuotes(
// //       eoaAddress,
// //       transactions,
// //     );
// //     console.log('whole fee  result', wholeFeeQuote);
// //     if (!resultAAEnableMode) {
// //       particleAA.enableAAMode();
// //     }
// //     // if (smartAccountAddress === undefined) {
// //     //   return;
// //     // }

// //     const verifyingPaymasterGasless = wholeFeeQuote.verifyingPaymasterGasless;
// //     if (verifyingPaymasterGasless === undefined) {
// //       console.log('gasless is not available');
// //       return;
// //     }
// //     console.log('startedddd.....verifying', verifyingPaymasterGasless);
// //     if (verifyingPaymasterGasless === undefined) {
// //       console.log('gasless is not available');
// //       return;
// //     }
// //     const result = await particleAuthCore.evm.batchSendTransactions(
// //       transactions,
// //       particleAuth.AAFeeMode.gasless(wholeFeeQuote),
// //     );
// //     if (result.status) {
// //       const signature = result.data;
// //       console.log('signAndSendTransactionWithGasless result', signature);
// //       return signature;
// //     } else {
// //       const error = result.data;
// //       console.log('signAndSendTransactionWithGasless result error', error);
// //     }
// //   } catch (error) {
// //     console.log('error....', error);
// //   }
// // };
// // export const encodeFunctionForDLN = params => {
// //   // const contractInterface = new Web3().eth.Contract();
// //   const proxyDLN = new ethers.Contract(
// //     '0xd1cb82a4d5c9086a2a7fdeef24fdb1c0a55bba58',
// //     [
// //       {
// //         inputs: [
// //           {
// //             internalType: 'address',
// //             name: '_dlnSourceAddress',
// //             type: 'address',
// //           },
// //         ],
// //         stateMutability: 'nonpayable',
// //         type: 'constructor',
// //       },
// //       {
// //         anonymous: false,
// //         inputs: [
// //           {
// //             indexed: false,
// //             internalType: 'bytes32',
// //             name: 'orderId',
// //             type: 'bytes32',
// //           },
// //           {
// //             components: [
// //               {
// //                 internalType: 'address',
// //                 name: 'giveTokenAddress',
// //                 type: 'address',
// //               },
// //               {
// //                 internalType: 'uint256',
// //                 name: 'giveAmount',
// //                 type: 'uint256',
// //               },
// //               {
// //                 internalType: 'bytes',
// //                 name: 'takeTokenAddress',
// //                 type: 'bytes',
// //               },
// //               {
// //                 internalType: 'uint256',
// //                 name: 'takeAmount',
// //                 type: 'uint256',
// //               },
// //               {
// //                 internalType: 'uint256',
// //                 name: 'takeChainId',
// //                 type: 'uint256',
// //               },
// //               {
// //                 internalType: 'bytes',
// //                 name: 'receiverDst',
// //                 type: 'bytes',
// //               },
// //               {
// //                 internalType: 'address',
// //                 name: 'givePatchAuthoritySrc',
// //                 type: 'address',
// //               },
// //               {
// //                 internalType: 'bytes',
// //                 name: 'orderAuthorityAddressDst',
// //                 type: 'bytes',
// //               },
// //               {
// //                 internalType: 'bytes',
// //                 name: 'allowedTakerDst',
// //                 type: 'bytes',
// //               },
// //               {
// //                 internalType: 'bytes',
// //                 name: 'externalCall',
// //                 type: 'bytes',
// //               },
// //               {
// //                 internalType: 'bytes',
// //                 name: 'allowedCancelBeneficiarySrc',
// //                 type: 'bytes',
// //               },
// //             ],
// //             indexed: false,
// //             internalType: 'struct OrderCreation',
// //             name: 'orderCreation',
// //             type: 'tuple',
// //           },
// //         ],
// //         name: 'OrderCallOrder',
// //         type: 'event',
// //       },
// //       {
// //         inputs: [],
// //         name: 'deposit',
// //         outputs: [],
// //         stateMutability: 'payable',
// //         type: 'function',
// //       },
// //       {
// //         inputs: [],
// //         name: 'dlnSourceAddress',
// //         outputs: [
// //           {
// //             internalType: 'address',
// //             name: '',
// //             type: 'address',
// //           },
// //         ],
// //         stateMutability: 'view',
// //         type: 'function',
// //       },
// //       {
// //         inputs: [],
// //         name: 'globalFixedNativeFee',
// //         outputs: [
// //           {
// //             internalType: 'uint88',
// //             name: '',
// //             type: 'uint88',
// //           },
// //         ],
// //         stateMutability: 'view',
// //         type: 'function',
// //       },
// //       {
// //         inputs: [],
// //         name: 'ownerAddress',
// //         outputs: [
// //           {
// //             internalType: 'address',
// //             name: '',
// //             type: 'address',
// //           },
// //         ],
// //         stateMutability: 'view',
// //         type: 'function',
// //       },
// //       {
// //         inputs: [
// //           {
// //             internalType: 'address',
// //             name: 'giveTokenAddress',
// //             type: 'address',
// //           },
// //           {
// //             internalType: 'uint256',
// //             name: 'giveAmount',
// //             type: 'uint256',
// //           },
// //           {
// //             internalType: 'address',
// //             name: 'takeTokenAddress',
// //             type: 'address',
// //           },
// //           {
// //             internalType: 'uint256',
// //             name: 'takeAmount',
// //             type: 'uint256',
// //           },
// //           {
// //             internalType: 'uint256',
// //             name: 'takeChainId',
// //             type: 'uint256',
// //           },
// //           {
// //             internalType: 'address',
// //             name: 'receiverDst',
// //             type: 'address',
// //           },
// //           {
// //             internalType: 'address',
// //             name: 'givePatchAuthoritySrc',
// //             type: 'address',
// //           },
// //           {
// //             internalType: 'address',
// //             name: 'orderAuthorityAddressDst',
// //             type: 'address',
// //           },
// //         ],
// //         name: 'placeOrder',
// //         outputs: [],
// //         stateMutability: 'nonpayable',
// //         type: 'function',
// //       },
// //       {
// //         inputs: [
// //           {
// //             internalType: 'address payable',
// //             name: '_to',
// //             type: 'address',
// //           },
// //         ],
// //         name: 'transferAllNativeToken',
// //         outputs: [],
// //         stateMutability: 'nonpayable',
// //         type: 'function',
// //       },
// //       {
// //         inputs: [
// //           {
// //             internalType: 'address',
// //             name: '_tokenAddress',
// //             type: 'address',
// //           },
// //           {
// //             internalType: 'address',
// //             name: '_to',
// //             type: 'address',
// //           },
// //           {
// //             internalType: 'uint256',
// //             name: 'value',
// //             type: 'uint256',
// //           },
// //         ],
// //         name: 'transferAnyToken',
// //         outputs: [],
// //         stateMutability: 'nonpayable',
// //         type: 'function',
// //       },
// //     ],
// //   );
// //   return proxyDLN.interface.encodeFunctionData('placeOrder', params);
// // };
