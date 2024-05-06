import Web3 from 'web3';
import {ethers} from 'ethers';
import {getAuthCoreProviderEthers} from './particleCoreSDK';
import {LoginType} from '@particle-network/rn-auth';
// Define the message to sign
// const message = 'Hello, World!';
const contractWalletInterface = new ethers.Interface([
  'function isValidSignature(bytes32 _messageHash, bytes _signature) external view returns (bytes4)',
]);
export const signFromSmartAccountWallet = async (message, smartAccount) => {
  // Define the ERC-4337 contract wallet address
  const contractWalletAddress = smartAccount; // Replace with the actual contract wallet address
  const messageHash = ethers.keccak256(ethers.toUtf8Bytes(message));
  // Define the entryPoint address
  const entryPointAddress = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789'; // Replace with the actual entryPoint address
  const provider = getAuthCoreProviderEthers(LoginType.Email);
  const contractWallet = new ethers.Contract(
    contractWalletAddress,
    contractWalletInterface,
    provider,
  );
  const signature = await provider.send('personal_sign', [
    '0x7E1ed373F20b980837569b9aaCf5e860C4b304d6',
    ethers.hexlify(ethers.toUtf8Bytes(message)),
    {
      entryPoint: entryPointAddress,
      sender: contractWalletAddress,
    },
  ]);
  const isValidSignature = await contractWallet.isValidSignature(
    messageHash,
    signature?.signature,
  );
  console.log('Message:', isValidSignature);
  console.log('Signature:', signature);
  return signature;
};
