import {Polygon} from '@particle-network/chains';
import {Env, ParticleInfo} from '@particle-network/rn-auth';
import * as particleConnect from '@particle-network/rn-connect';
import {DappMetaData} from '@particle-network/rn-connect';

export const initializeParticleConnect = () => {
  ParticleInfo.projectId = projectId; // your project id
  ParticleInfo.clientKey = clientKey; // your client key

  if (ParticleInfo.projectId === '' || ParticleInfo.clientKey === '') {
    throw new Error(
      'You need set project info, Get your project id and client from dashboard, https://dashboard.particle.network',
    );
  }

  const chainInfo = Polygon;
  const env = Env.Dev;
  const metadata = new DappMetaData(
    'cb6fc19a389caeab31f49d301b87ad73',
    'Particle Connect',
    'https://connect.particle.network/icons/512.png',
    'https://connect.particle.network',
    'Xade Finance',
    '',
    '',
  );

  particleConnect.init(chainInfo, env, metadata);
};
export const connectWalletFromSelectedType = async () => {
  const result = await particleConnect.connect(
    particleConnect.WalletType.MetaMask,
  );
  if (result.status) {
    console.log('connect success');
    const account = result.data;
    console.log('result.data', account);
  } else {
    const error = result.data;
    console.log('wallet connect error', error);
  }
};
export const getWalletConnectedChainInfo = async () => {
  const chainInfo = await particleAuth.getChainInfo();
  console.log('wallet connect chain info', chainInfo);
};
export const setChainInfo = async chainInfo => {
  const result = await particleAuth.setChainInfo(chainInfo);
  console.log('wallet connect chain info', chainInfo, result);
};
