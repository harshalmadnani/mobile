import Axios from 'axios';
import {Wallet, utils} from 'ethers';

const chainId = 80001;
const PARTICLE_RPC = `https://rpc.particle.network/evm-chain/public?chainId=${chainId}`;
const scanUrl = 'https://mumbai.polygonscan.com';
const nft1155ContractAddress = '0x909E30bdBCb728131E3F8d17150eaE740C904649';
const customValidationContractAddress =
  '0x8E09744b738e9Fec4A4df7Ab5621f1857F6Fa175';

const mainSigner = Wallet.createRandom();
const sessionSigner = Wallet.createRandom();
const smartAccount = {
  name: 'BICONOMY',
  version: '2.0.0',
  ownerAddress: mainSigner.address,
};

(async () => {
  let sessions = [
    {
      validUntil: 0, // 0 means no expiry
      validAfter: 0, // 0 means no start time
      sessionValidationModule: customValidationContractAddress,
      // you can use `sessionKeyData` to replace `sessionKeyDataInAbi`
      // sessionKeyData: abi.encode(...)
      sessionKeyDataInAbi: [
        ['address', 'address', 'uint256'],
        [
          sessionSigner.address, // session signer address
          sessionSigner.address, // receiver address
          1, // nft token id
        ],
      ],
    },
  ];

  const resCreateSessions = await Axios.post(PARTICLE_RPC, {
    method: 'particle_aa_createSessions',
    params: [smartAccount, sessions],
  });

  // we use gasless mode
  const userOp = resCreateSessions.data.result.verifyingPaymasterGasless.userOp;
  const userOpHash =
    resCreateSessions.data.result.verifyingPaymasterGasless.userOpHash;
  sessions = resCreateSessions.data.result.sessions; // the sessions you need to store locally
  userOp.signature = await mainSigner.signMessage(utils.arrayify(userOpHash));

  const resSendUserOp = await Axios.post(PARTICLE_RPC, {
    method: 'particle_aa_sendUserOp',
    params: [smartAccount, userOp],
  });

  console.log(`${scanUrl}/tx/${resSendUserOp.data}`);
})();
