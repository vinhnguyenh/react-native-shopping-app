import EncryptedStorage from 'react-native-encrypted-storage';

import { User } from '../models/user';

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';

export const encryptedStorageService = {
  authTokenKey: AUTH_TOKEN_KEY,
  authUserKey: AUTH_USER_KEY,
  getToken: (): Promise<string | null> =>
    EncryptedStorage.getItem(AUTH_TOKEN_KEY),
  setToken: (token: string): Promise<void> =>
    EncryptedStorage.setItem(AUTH_TOKEN_KEY, token),
  clearToken: (): Promise<void> => EncryptedStorage.removeItem(AUTH_TOKEN_KEY),
  getUser: async (): Promise<User | null> => {
    const rawUser = await EncryptedStorage.getItem(AUTH_USER_KEY);
    return rawUser ? (JSON.parse(rawUser) as User) : null;
  },
  setUser: (user: User): Promise<void> =>
    EncryptedStorage.setItem(AUTH_USER_KEY, JSON.stringify(user)),
  clearUser: (): Promise<void> => EncryptedStorage.removeItem(AUTH_USER_KEY),
};
