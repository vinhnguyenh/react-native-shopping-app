import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { User } from '../models/user';
import {
  apiService,
  ILoginPayload,
  ILoginResponse,
} from '../services/api-service';
import { encryptedStorageService } from '../services/encrypted-storage-service';

interface AuthContextProps {
  user: User | null;
  token: string | null;
  initializing: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [initializing, setInitializing] = useState<boolean>(true);

  useEffect(() => {
    const restoreSession = async (): Promise<void> => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          encryptedStorageService.getToken(),
          encryptedStorageService.getUser(),
        ]);
        if (storedToken) {
          setToken(storedToken);
          apiService.client.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
        }
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (error) {
        console.warn('Failed to restore auth token', error);
      } finally {
        setInitializing(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    const payload: ILoginPayload = { username, password };
    const response = await apiService.login(payload);
    const responseData: ILoginResponse = response.data;

    if (!responseData.status) {
      throw new Error('Login failed.');
    }

    setUser(responseData.data.user);
    setToken(responseData.data.token);
    apiService.client.defaults.headers.common.Authorization = `Bearer ${responseData.data.token}`;
    await Promise.all([
      encryptedStorageService.setToken(responseData.data.token),
      encryptedStorageService.setUser(responseData.data.user),
    ]);
  };

  const logout = async (): Promise<void> => {
    setUser(null);
    setToken(null);
    delete apiService.client.defaults.headers.common.Authorization;
    await Promise.all([
      encryptedStorageService.clearToken(),
      encryptedStorageService.clearUser(),
    ]);
  };

  const contextValue: AuthContextProps = {
    user,
    token,
    initializing,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
