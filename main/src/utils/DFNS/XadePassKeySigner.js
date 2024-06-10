import {toBase64Url} from '@dfns/sdk/utils';
import {Platform} from 'react-native';
import {Passkey} from 'react-native-passkey';

export const DEFAULT_WAIT_TIMEOUT = 60000;

const b64StandardToUrlSafe = standard => {
  return standard.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

const b64UrlSafeToStandard = urlSafe => {
  return (urlSafe + '==='.slice((urlSafe.length + 3) % 4))
    .replace(/-/g, '+')
    .replace(/_/g, '/');
};

//   export type PasskeysOptions = {
//     timeout?: number
//   }

// react-native-passkey is incorrect encoding the credId with standard base64 for
// some reason. we have to undo that.
class AndroidPasskeys {
  constructor(options) {}

  async sign(challenge) {
    const request = {
      challenge: challenge.challenge,
      allowCredentials: challenge.allowCredentials.webauthn,
      rpId: challenge.rp.id,
      userVerification: challenge.userVerification,
      timeout: this.options?.timeout ?? DEFAULT_WAIT_TIMEOUT,
    };

    const credential = await Passkey.authenticate(request);

    return {
      kind: 'Fido2',
      credentialAssertion: {
        credId: b64StandardToUrlSafe(credential.id),
        clientData: credential.response.clientDataJSON,
        authenticatorData: credential.response.authenticatorData,
        signature: credential.response.signature,
        userHandle: credential.response.userHandle,
      },
    };
  }

  async create(challenge) {
    const request = {
      challenge: challenge.challenge,
      pubKeyCredParams: challenge.pubKeyCredParams,
      rp: challenge.rp,
      user: {
        displayName: challenge.user.displayName,
        id: toBase64Url(challenge.user.id),
        name: challenge.user.name,
      },
      attestation: challenge.attestation,
      excludeCredentials: challenge.excludeCredentials,
      authenticatorSelection: challenge.authenticatorSelection,
      timeout: this.options?.timeout ?? DEFAULT_WAIT_TIMEOUT,
    };
    try {
      const result = await Passkey.register(request);
      return {
        credentialKind: 'Fido2',
        credentialInfo: {
          credId: b64StandardToUrlSafe(result.id),
          attestationData: result.response.attestationObject,
          clientData: result.response.clientDataJSON,
        },
      };
    } catch (error) {
      console.log('error passkey', error);
    }
  }
}

// react-native-passkey's iOS implementation is not WebAuthn spec compliant. all values
// are standard base64 encoded instead of base64url encoded. we have to convert the
// encoding in both directions.
class iOSPasskeys {
  constructor(options) {}

  async sign(challenge) {
    const request = {
      challenge: b64UrlSafeToStandard(challenge.challenge),
      allowCredentials: challenge.allowCredentials.webauthn.map(
        ({id, type}) => ({
          id: b64UrlSafeToStandard(id),
          type,
        }),
      ),
      rpId: challenge.rp.id,
      userVerification: 'preferred',
      timeout: this.options?.timeout ?? DEFAULT_WAIT_TIMEOUT,
    };

    const credential = await Passkey.authenticate(request);

    return {
      kind: 'Fido2',
      credentialAssertion: {
        credId: b64StandardToUrlSafe(credential.id),
        clientData: b64StandardToUrlSafe(credential.response.clientDataJSON),
        authenticatorData: b64StandardToUrlSafe(
          credential.response.authenticatorData,
        ),
        signature: b64StandardToUrlSafe(credential.response.signature),
        userHandle: b64StandardToUrlSafe(credential.response.userHandle),
      },
    };
  }

  async create(challenge) {
    const request = {
      challenge: b64UrlSafeToStandard(challenge.challenge),
      pubKeyCredParams: challenge.pubKeyCredParams,
      rp: challenge.rp,
      user: {
        displayName: challenge.user.displayName,
        id: toBase64Url(challenge.user.id),
        name: challenge.user.name,
      },
      attestation: challenge.attestation,
      excludeCredentials: challenge.excludeCredentials.map(({id, type}) => ({
        id: b64UrlSafeToStandard(id),
        type,
      })),
      authenticatorSelection: challenge.authenticatorSelection,
      timeout: this.options?.timeout ?? DEFAULT_WAIT_TIMEOUT,
    };

    const result = await Passkey.register(request);

    return {
      credentialKind: 'Fido2',
      credentialInfo: {
        credId: b64StandardToUrlSafe(result.id),
        attestationData: b64StandardToUrlSafe(
          result.response.attestationObject,
        ),
        clientData: b64StandardToUrlSafe(result.response.clientDataJSON),
      },
    };
  }
}

export class XadePasskeysSigner {
  platform;

  constructor(options) {
    switch (Platform.OS) {
      case 'android':
        this.platform = new AndroidPasskeys(options);
        break;
      case 'ios':
        this.platform = new iOSPasskeys(options);
        break;
      default:
        throw 'not supported';
    }
  }

  async sign(challenge) {
    return this.platform.sign(challenge);
  }

  async create(challenge) {
    return this.platform.create(challenge);
  }
}
