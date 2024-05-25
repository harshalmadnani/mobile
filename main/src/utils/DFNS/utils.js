// import {DfnsApiClient, DfnsDelegatedApiClient} from '@dfns/sdk';
import {DfnsApiClient} from '@dfns/sdk';
import {PasskeysSigner} from '@dfns/sdk-react-native';
import {Platform} from 'react-native';

export const iosStagingAppId = 'ap-1mqsr-liih4-9k7raqgdjt2a14nm';
export const androidStagingAppId = 'ap-6c503-5r4h6-87o88tblipre4sop';
export const dfnsProviderClient = authToken => {
  const passkey = new PasskeysSigner();
  return new DfnsApiClient({
    appId: Platform.OS === 'ios' ? iosStagingAppId : androidStagingAppId,
    authToken: authToken,
    baseUrl: 'https://api.dfns.io',
    signer: passkey,
  });
};
