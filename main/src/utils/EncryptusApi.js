import axios from 'axios';

const baseUrl = 'https://sandbox.encryptus.co/v1';
const CLIENT_ID = '';
const CLIENT_SECRET = '';

export const createAuthenticationTokenEncryptus = async () => {
  const result = await axios.post(
    `${baseUrl}/partners/generate/token`,
    {
      partnerEmail: '',
      partnerPassword: '',
      grant_services: ['FORENSIC'],
      clientSecret: CLIENT_SECRET,
      clientID: CLIENT_ID,
    },
    {headers: {Accept: '*/*', 'Content-Type': 'application/json'}},
  );
  return result.data;
};

export const generateNewRefreshTokenEncryptus = async jwt => {
  const result = await axios.post(
    `${baseUrl}/partners/refresh/token`,
    {
      partnerEmail: '',
    },
    {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${jwt}`,
      },
    },
  );
  return result.data;
};
