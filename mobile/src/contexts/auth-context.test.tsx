import React from 'react';
import { Button, Text, View } from 'react-native';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { apiService } from '@/services/api-service';
import { encryptedStorageService } from '@/services/encrypted-storage-service';
import { productSyncService } from '@/services/product-sync-service';
import { sessionCacheService } from '@/services/session-cache-service';
import { userProfileSyncService } from '@/services/user-profile-sync-service';
import store from '@/stores/store';

jest.mock('@/services/api-service', () => ({
  apiService: {
    client: {
      defaults: {
        headers: {
          common: {},
        },
      },
    },
    login: jest.fn(),
    setForbiddenHandler: jest.fn(),
  },
}));

jest.mock('@/services/encrypted-storage-service', () => ({
  encryptedStorageService: {
    getToken: jest.fn(),
    setToken: jest.fn(),
    clearToken: jest.fn(),
  },
}));

jest.mock('@/services/product-sync-service', () => ({
  productSyncService: {
    configureForCurrentSession: jest.fn(),
    clearProducts: jest.fn(),
  },
}));

jest.mock('@/services/session-cache-service', () => ({
  sessionCacheService: {
    deleteSessionCache: jest.fn(),
  },
}));

jest.mock('@/services/user-profile-sync-service', () => ({
  userProfileSyncService: {
    getUserProfile: jest.fn(),
    setUserProfile: jest.fn(),
    clearUserProfile: jest.fn(),
  },
}));

jest.mock('@/stores/store', () => ({
  __esModule: true,
  default: {
    dispatch: jest.fn(),
  },
}));

const mockedApiService = jest.mocked(apiService);
const mockedEncryptedStorageService = jest.mocked(encryptedStorageService);
const mockedProductSyncService = jest.mocked(productSyncService);
const mockedSessionCacheService = jest.mocked(sessionCacheService);
const mockedUserProfileSyncService = jest.mocked(userProfileSyncService);
const mockedStore = jest.mocked(store);

const userFixture = {
  id: 1,
  username: 'johndoe',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
};

const AuthProbe: React.FC = () => {
  const { initializing, login, logout, token, user } = useAuth();
  const [loginError, setLoginError] = React.useState('');

  return (
    <View>
      <Text>{initializing ? 'initializing' : 'ready'}</Text>
      <Text>{token ?? 'no-token'}</Text>
      <Text>{user?.username ?? 'no-user'}</Text>
      <Text>{loginError || 'no-error'}</Text>
      <Button
        title="login"
        onPress={async () => {
          try {
            await login(' shopper ', 'secret123');
            setLoginError('');
          } catch (error) {
            setLoginError(
              error instanceof Error ? error.message : 'Unknown login error',
            );
          }
        }}
      />
      <Button
        title="logout"
        onPress={() => {
          void logout();
        }}
      />
    </View>
  );
};

describe('auth-context', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedApiService.client.defaults.headers.common = {};
    mockedEncryptedStorageService.getToken.mockResolvedValue(null);
    mockedEncryptedStorageService.setToken.mockResolvedValue(undefined);
    mockedEncryptedStorageService.clearToken.mockResolvedValue(undefined);
    mockedProductSyncService.configureForCurrentSession.mockImplementation(() => {});
    mockedProductSyncService.clearProducts.mockResolvedValue(undefined);
    mockedSessionCacheService.deleteSessionCache.mockResolvedValue(undefined);
    mockedUserProfileSyncService.getUserProfile.mockResolvedValue(null);
    mockedUserProfileSyncService.setUserProfile.mockResolvedValue(undefined);
    mockedUserProfileSyncService.clearUserProfile.mockResolvedValue(undefined);
    mockedApiService.login.mockResolvedValue({
      data: {
        status: true,
        data: {
          token: 'fresh-token',
          user: userFixture,
        },
      },
    } as never);
  });

  it('restores a persisted session on mount', async () => {
    mockedEncryptedStorageService.getToken.mockResolvedValue('stored-token');
    mockedUserProfileSyncService.getUserProfile.mockResolvedValue(userFixture);

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    );

    expect(await screen.findByText('ready')).toBeOnTheScreen();
    expect(screen.getByText('stored-token')).toBeOnTheScreen();
    expect(screen.getByText('johndoe')).toBeOnTheScreen();
    expect(
      mockedApiService.client.defaults.headers.common.Authorization,
    ).toBe('Bearer stored-token');
    expect(
      mockedProductSyncService.configureForCurrentSession,
    ).toHaveBeenLastCalledWith('stored-token');
    expect(mockedApiService.setForbiddenHandler).toHaveBeenCalledTimes(1);
  });

  it('logs in and persists the authenticated token and Room profile', async () => {
    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    );

    expect(await screen.findByText('ready')).toBeOnTheScreen();

    fireEvent.press(screen.getByText('login'));

    await waitFor(() => {
      expect(mockedApiService.login).toHaveBeenCalledWith({
        username: ' shopper ',
        password: 'secret123',
      });
    });

    expect(screen.getByText('fresh-token')).toBeOnTheScreen();
    expect(screen.getByText('johndoe')).toBeOnTheScreen();
    expect(mockedEncryptedStorageService.setToken).toHaveBeenCalledWith(
      'fresh-token',
    );
    expect(mockedUserProfileSyncService.setUserProfile).toHaveBeenCalledWith(
      userFixture,
    );
    await waitFor(() => {
      expect(
        mockedProductSyncService.configureForCurrentSession,
      ).toHaveBeenLastCalledWith('fresh-token');
    });
  });

  it('surfaces a failed login response without persisting auth state', async () => {
    mockedApiService.login.mockResolvedValue({
      data: {
        status: false,
        data: {
          token: 'ignored-token',
          user: userFixture,
        },
      },
    } as never);

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    );

    expect(await screen.findByText('ready')).toBeOnTheScreen();

    fireEvent.press(screen.getByText('login'));

    await waitFor(() => {
      expect(screen.getByText('Login failed.')).toBeOnTheScreen();
    });
    expect(screen.getByText('no-token')).toBeOnTheScreen();
    expect(screen.getByText('no-user')).toBeOnTheScreen();
    expect(mockedEncryptedStorageService.setToken).not.toHaveBeenCalled();
    expect(mockedUserProfileSyncService.setUserProfile).not.toHaveBeenCalled();
  });

  it('logs out and clears persisted auth state', async () => {
    mockedEncryptedStorageService.getToken.mockResolvedValue('stored-token');
    mockedUserProfileSyncService.getUserProfile.mockResolvedValue(userFixture);

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    );

    expect(await screen.findByText('ready')).toBeOnTheScreen();

    fireEvent.press(screen.getByText('logout'));

    await waitFor(() => {
      expect(mockedSessionCacheService.deleteSessionCache).toHaveBeenCalledTimes(1);
    });

    expect(mockedProductSyncService.clearProducts).not.toHaveBeenCalled();
    expect(mockedUserProfileSyncService.clearUserProfile).not.toHaveBeenCalled();
    expect(mockedEncryptedStorageService.clearToken).toHaveBeenCalledTimes(1);
    expect(mockedStore.dispatch).toHaveBeenCalledTimes(1);
    expect(screen.getByText('no-token')).toBeOnTheScreen();
    expect(screen.getByText('no-user')).toBeOnTheScreen();
    expect(
      mockedApiService.client.defaults.headers.common.Authorization,
    ).toBeUndefined();
  });
});
