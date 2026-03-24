import Config from 'react-native-config';

const apiUrl = Config.API_URL?.trim();

if (!apiUrl) {
  throw new Error(
    'Missing API_URL configuration. Define it in the active .env file.',
  );
}

export const env = {
  apiUrl,
};
