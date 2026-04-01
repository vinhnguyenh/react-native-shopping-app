import EncryptedStorage from 'react-native-encrypted-storage';

const AUTH_TOKEN_KEY = 'auth_token';

export const encryptedStorageService = {
  authTokenKey: AUTH_TOKEN_KEY,
  getToken: (): Promise<string | null> =>
    EncryptedStorage.getItem(AUTH_TOKEN_KEY),
  setToken: (token: string): Promise<void> =>
    EncryptedStorage.setItem(AUTH_TOKEN_KEY, token),
  clearToken: (): Promise<void> => EncryptedStorage.removeItem(AUTH_TOKEN_KEY),
};
