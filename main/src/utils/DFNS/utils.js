import {DfnsApiClient, DfnsDelegatedApiClient} from '@dfns/sdk';
import {PasskeysSigner} from '@dfns/sdk-react-native';

export const dfnsProviderClient = authToken => {
  const passkey = new PasskeysSigner();
  return new DfnsApiClient({
    appId: 'ap-35g4l-pmp4e-8h8afn39lfupofch',
    authToken: authToken,
    baseUrl: 'https://api.dfns.io',
    signer: passkey,
  });
};
