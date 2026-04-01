import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { useAuth } from '@/contexts/auth-context';
import type { User } from '@/models/user';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';

jest.mock('@/contexts/auth-context', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@react-native-vector-icons/material-design-icons', () => ({
  MaterialDesignIcons: 'MaterialDesignIcons',
}));

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => (
      <View>{children}</View>
    ),
    SafeAreaView: ({ children }: { children: React.ReactNode }) => (
      <View>{children}</View>
    ),
  };
});

const mockedUseAuth = jest.mocked(useAuth);
const { SafeAreaProvider } = jest.requireMock('react-native-safe-area-context');

const authUserFixture: User = {
  id: 1,
  username: 'auth-user',
  firstName: 'Auth',
  lastName: 'User',
  email: 'auth.user@example.com',
  age: 31,
};

const navigationMock = {
  navigate: jest.fn<(screen: string) => void>(),
};

const renderScreen = (): ReturnType<typeof render> =>
  render(
    <SafeAreaProvider>
      <ProfileScreen navigation={navigationMock} />
    </SafeAreaProvider>,
  );

describe('profile-screen', () => {
  const loginMock = jest.fn<Promise<void>, [string, string]>();
  const logoutMock = jest.fn<Promise<void>, []>();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseAuth.mockReturnValue({
      user: authUserFixture,
      token: 'token',
      initializing: false,
      login: loginMock,
      logout: logoutMock,
    });
  });

  it('renders authenticated profile details from auth state', () => {
    renderScreen();

    expect(screen.getByText('Auth User')).toBeOnTheScreen();
    expect(screen.getByText('@auth-user')).toBeOnTheScreen();
  });

  it('navigates back to home from header and order history actions', () => {
    renderScreen();

    fireEvent.press(screen.getAllByRole('button')[0]);
    fireEvent.press(screen.getByText('Order History'));

    expect(navigationMock.navigate).toHaveBeenNthCalledWith(1, 'Home');
    expect(navigationMock.navigate).toHaveBeenNthCalledWith(2, 'Home');
  });

  it('logs out when an authenticated user presses the auth action', async () => {
    renderScreen();

    fireEvent.press(screen.getByText('Logout'));

    await waitFor(() => {
      expect(logoutMock).toHaveBeenCalledTimes(1);
    });
    expect(loginMock).not.toHaveBeenCalled();
  });

  it('navigates to sign in when no user is available', async () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      token: null,
      initializing: false,
      login: loginMock,
      logout: logoutMock,
    });

    renderScreen();

    fireEvent.press(screen.getByText('Login'));

    await waitFor(() => {
      expect(navigationMock.navigate).toHaveBeenCalledWith('SignIn');
    });
    expect(logoutMock).not.toHaveBeenCalled();
    expect(loginMock).not.toHaveBeenCalled();
  });

  it('does not treat a missing auth token as authenticated', () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      token: null,
      initializing: false,
      login: loginMock,
      logout: logoutMock,
    });

    renderScreen();

    expect(screen.getByText('Login')).toBeOnTheScreen();
    expect(screen.queryByText('Logout')).not.toBeOnTheScreen();
    expect(screen.queryByText('Auth User')).not.toBeOnTheScreen();
  });
});
