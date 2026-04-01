import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { useAuth } from '@/contexts/auth-context';
import { SignInScreen } from '@/screens/signin/SignInScreen';

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

const renderScreen = (): ReturnType<typeof render> =>
  render(
    <SafeAreaProvider>
      <SignInScreen />
    </SafeAreaProvider>,
  );

describe('signin-screen', () => {
  const loginMock = jest.fn<Promise<void>, [string, string]>();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseAuth.mockReturnValue({
      user: null,
      token: null,
      initializing: false,
      login: loginMock,
      logout: jest.fn(),
    });
  });

  it('renders the sign-in form with defaults', () => {
    renderScreen();

    expect(screen.getByText('Welcome Back')).toBeOnTheScreen();
    expect(screen.getByDisplayValue('johndoe')).toBeOnTheScreen();
    expect(screen.getByDisplayValue('secret123')).toBeOnTheScreen();
    expect(screen.queryByText('Use biometrics for faster login')).not.toBeOnTheScreen();
    expect(screen.queryByText('Sign in with Biometrics')).not.toBeOnTheScreen();
  });

  it('shows validation errors when username or password are empty', async () => {
    renderScreen();

    fireEvent.changeText(screen.getByDisplayValue('johndoe'), '');
    fireEvent.press(screen.getByText('Sign In'));

    expect(await screen.findByText('Username is required.')).toBeOnTheScreen();
    expect(loginMock).not.toHaveBeenCalled();

    fireEvent.changeText(screen.getByPlaceholderText('johndoe'), 'janedoe');
    fireEvent.changeText(screen.getByPlaceholderText('Password'), '');
    fireEvent.press(screen.getByText('Sign In'));

    expect(await screen.findByText('Password is required.')).toBeOnTheScreen();
    expect(loginMock).not.toHaveBeenCalled();
  });

  it('submits trimmed credentials', async () => {
    loginMock.mockResolvedValue(undefined);

    renderScreen();

    fireEvent.changeText(screen.getByDisplayValue('johndoe'), '  shopper  ');
    fireEvent.changeText(screen.getByDisplayValue('secret123'), 'secret456');
    fireEvent.press(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith('shopper', 'secret456');
    });
  });

  it('shows an API error message and clears it after input changes', async () => {
    loginMock.mockRejectedValue({
      response: {
        data: {
          error: {
            message: 'Invalid username or password.',
          },
        },
      },
      message: 'Request failed',
    });

    renderScreen();

    fireEvent.press(screen.getByText('Sign In'));

    expect(
      await screen.findByText('Invalid username or password.'),
    ).toBeOnTheScreen();

    fireEvent.changeText(screen.getByDisplayValue('johndoe'), 'janedoe');

    await waitFor(() => {
      expect(
        screen.queryByText('Invalid username or password.'),
      ).not.toBeOnTheScreen();
    });
  });
});
