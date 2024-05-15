import {createSmartAccountClient, LightSigner} from '@biconomy/account';
import {DfnsWallet} from '@dfns/lib-ethersjs6';
import {DfnsApiClient} from '@dfns/sdk';
import {AsymmetricKeySigner} from '@dfns/sdk-keysigner';
import {Interface} from '@ethersproject/abi';
import {JsonRpcProvider} from '@ethersproject/providers';

const privatekey = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA5tm93Y//6fRnMEACHc1ymDxBL7bUCgORGUn9TsuU/PorEL9e
Zsd+/Hq7nqnjsktU1o2f8xtpE9Qbbzdkf1EZMqDMVKZKOABEEj/cGUyz6g5jd6bl
48nEjIyiwu/TtIWEslzkJv0Q9V3u/e0qetUx6G6xxXR1UeNl5jKRHtr1RVzQndge
xWiYi7RAID3OCl0j0a8DJdTcqQuxGHlU0rUO8QYg34oJKMd2VibBufOHwKLKM3kY
SGhfodIOxtIoWWSCm8BsFW1Db4ETFDsOcizpy7zxh+3D2Vx0qBOMgluFDWZoZTCd
GEjWjsoCpZkktyt5svPalUxnciu4H8c2g47uIwIDAQABAoIBACkIcRAt5V4vfBv+
dKHZf9IBe9DAXaY+Bg+JsEXON/hTe04pxdzc/vxf0HOeXQO3Eihk2hZ7O80zeYDm
Rq2+u4zdOhSdzjlwCql3wmaY1K34ysNc3iYEGjSlVtTxjh7bUL/ndQJdHyOOA8oM
2u0kcg+PhXfEgIoCsn0dZeAnKUufomRwDCQq8KeZXSjVsnzjL+DzVft/lKYVegMa
wHqXM0+1YlQ7KIgrryp8HUVk22LhFLaNV43xFH7clzwb2broWpWUV56upJ4ZL0tr
wJYaWP5Dc37rdR8bx2sbCToEIbR4EphftSYIsuzxlTOxLcA52AWndgXvJM5je+6p
yHpKCkECgYEA9SQz/4DaOC+Hvyt1i+1yjIhNg61RxB/HwqwSKZLp2nur9bsvpogq
3PBPCAmmpmrHzGz1wjbBP/oWyodxXqwdvoulAqidp9Nm1ndEzDk8of99Jo9woatU
oTByV3nivmNu4RGLEfPYNw+SHkoeq4UD+eEtXxLmKMiVIECPl/IB+sMCgYEA8RN8
gifagXG7ZdrxBFM/nyxNPMbd2qMExRLVXc8KkHPXsgSb230o0k/ywuhQjhh3QCbE
bVuALB3wclwv2bmJimCE9XTZNHAAL7jIX1Jur2FCdQ7LrOF3yGp0vfy6iOXVtLg5
ipOe3Jk0deY0lF8aucgSvypLHCXx4AQv9/dESSECgYA+y6tWRBeiVOqdGfDei1DQ
lwnkNT3A07NENvfgFnY5NXzzUaP/MNpqBlT4ZiB+eNP9ldvOiGAwl0vHTbLI4aYs
7XCzoaXhG9I4Fg1Vk0Po652Phyb/AviG4fYoWlyvEKGSnf/V9XTphd+USsBYh5Zh
KEGLHThAMkGhJWijL6c6KQKBgFnn04JSzJmDyciVm1bqmQqKog9tduWH8Epy2KHQ
ifcPTLy2HU4A4k10xWtM6mXj1+1Tx+OkwSsyyy5LFQlUuWei0VMdDbgRoPArMIbk
HiVH11oCd5D00RAsK3eDHinZ1RY9si/tF8zbUgY6IRfIVBY++EbUxggsWoUZ6q3G
SHAhAoGBAIeqMSBrDaRZrYT9dbXGiRFulksj+qUG45bDXANPkDwVb1fpmdXWXRyA
W6ux1VER2uyP7hcqJe94PwE4QDt8sWiLlAix+laj/2/gogYja/IeUwafLB1hcrNg
jb2CLkZCJAocqC/ebl9EZFF7qLk5A10CBrMkKqGlG65KCyOUbbOW
-----END RSA PRIVATE KEY-----`;

const initDfnsWallet = async (walletId, authToken, chainId) => {
  const signer = new AsymmetricKeySigner({
    privateKey: privatekey,
    credId: `Y2ktMm9uOHQtNzZrZjctOWVxcWUzMG1tbGk2N3ZtNQ`,
  });

  const dfnsClient = new DfnsApiClient({
    appId: 'ap-5hqp7-rmdlh-9nkr1dq8acp2bu54',
    authToken,
    baseUrl: 'https://app.dfns.io',
    signer,
  });

  return new DfnsWallet.init({walletId, dfnsClient});
};

const getSmartAccountAddress = async (walletId, authToken, chainId) => {
  const provider = new JsonRpcProvider(
    'https://polygon-mainnet.g.alchemy.com/v2/gBoo6ihGnSUa3ObT49K36yHG6BdtyuVo',
  );
  const dfnsWWalletSigner = (
    await initDfnsWallet(walletId, authToken, chainId)
  ).connect(provider);
  const smartAccountClient = await createSmartAccountClient({
    signer: dfnsWWalletSigner,
    biconomyPaymasterApiKey: 'UfZhdqxYR.528b38b4-89d7-4b33-9006-6856b9c82d64',
    bundlerUrl: `https://paymaster.biconomy.io/api/v1/137/UfZhdqxYR.528b38b4-89d7-4b33-9006-6856b9c82d64`,
  });
  const scwAddress = await smartAccountClient.getAccountAddress();
  return scwAddress;
};
