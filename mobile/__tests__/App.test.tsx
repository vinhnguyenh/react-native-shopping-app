/**
 * @format
 */

import 'react-native';
import React from 'react';
import {render} from '@testing-library/react-native';
import App from '../App';

// Note: import explicitly to use the types shipped with jest.
import {it} from '@jest/globals';

jest.mock('react-native-config', () => ({
  __esModule: true,
  default: {
    API_URL: 'https://example.com',
  },
}));

jest.mock('react-native-encrypted-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn().mockResolvedValue(undefined),
    removeItem: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('@react-native-vector-icons/material-design-icons', () => ({
  MaterialDesignIcons: 'MaterialDesignIcons',
}));

jest.mock('@/contexts/auth-context', () => ({
  AuthProvider: ({children}: {children: React.ReactNode}) => children,
  useAuth: () => ({
    initializing: false,
    token: null,
    user: null,
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));

it('renders correctly', () => {
  render(<App />);
});
