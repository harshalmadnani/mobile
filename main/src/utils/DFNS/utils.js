import {DfnsApiClient, DfnsDelegatedApiClient} from '@dfns/sdk';
import {PasskeysSigner} from '@dfns/sdk-react-native';
import {Platform} from 'react-native';

export const iosStagingAppId = 'ap-7ajlt-h8pkp-9klr9k7dgt4tmhj9';
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
