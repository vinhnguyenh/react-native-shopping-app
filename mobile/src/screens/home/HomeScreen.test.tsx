import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import type { Product } from '@/models/product';
import useProducts from '@/hooks/use-products';
import { HomeScreen } from '@/screens/home/HomeScreen';

jest.mock('@/hooks/use-products', () => ({
  __esModule: true,
  default: jest.fn(),
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

const mockedUseProducts = jest.mocked(useProducts);
const { SafeAreaProvider } = jest.requireMock('react-native-safe-area-context');

const productFixtures: Product[] = [
  {
    id: 1,
    name: 'Wireless Speaker',
    description: 'Portable audio speaker',
    image: '',
    price: 149.99,
    priceUnit: 'dollar',
  },
  {
    id: 2,
    name: 'Ceramic Mug',
    description: 'Home kitchen mug',
    image: '',
    price: 19.99,
    priceUnit: 'dollar',
  },
];

const renderScreen = (): ReturnType<typeof render> =>
  render(
    <SafeAreaProvider>
      <HomeScreen />
    </SafeAreaProvider>,
  );

describe('home-screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders a loading state while products are being fetched', () => {
    mockedUseProducts.mockReturnValue({
      products: [],
      loading: true,
      error: null,
    });

    renderScreen();

    expect(screen.getByText('Loading products...')).toBeOnTheScreen();
  });

  it('keeps cached products visible while a background refresh is running', () => {
    mockedUseProducts.mockReturnValue({
      products: productFixtures,
      loading: true,
      error: null,
    });

    renderScreen();

    expect(screen.getByText('Wireless Speaker')).toBeOnTheScreen();
    expect(screen.getByText('Ceramic Mug')).toBeOnTheScreen();
    expect(screen.getByText('Refreshing products...')).toBeOnTheScreen();
    expect(screen.queryByText('Loading products...')).not.toBeOnTheScreen();
  });

  it('renders an error state when the products request fails', () => {
    mockedUseProducts.mockReturnValue({
      products: [],
      loading: false,
      error: 'Network unavailable',
    });

    renderScreen();

    expect(screen.getByText('Unable to load products')).toBeOnTheScreen();
    expect(screen.getByText('Network unavailable')).toBeOnTheScreen();
  });

  it('filters products by search text and category', async () => {
    mockedUseProducts.mockReturnValue({
      products: productFixtures,
      loading: false,
      error: null,
    });

    renderScreen();

    expect(screen.getByText('2 items')).toBeOnTheScreen();
    expect(screen.getByText('Wireless Speaker')).toBeOnTheScreen();
    expect(screen.getByText('Ceramic Mug')).toBeOnTheScreen();

    fireEvent.changeText(
      screen.getByPlaceholderText('Search products, brands...'),
      'wireless',
    );

    expect(screen.getByText('1 item')).toBeOnTheScreen();
    expect(screen.getByText('Wireless Speaker')).toBeOnTheScreen();
    expect(screen.queryByText('Ceramic Mug')).not.toBeOnTheScreen();

    fireEvent.changeText(
      screen.getByPlaceholderText('Search products, brands...'),
      '',
    );
    fireEvent.press(screen.getAllByText('Home')[0]);

    await waitFor(() => {
      expect(screen.getByText('1 item')).toBeOnTheScreen();
    });
    expect(screen.getByText('Ceramic Mug')).toBeOnTheScreen();
    expect(screen.queryByText('Wireless Speaker')).not.toBeOnTheScreen();
  });

  it('shows an empty state when no products match the selected filters', () => {
    mockedUseProducts.mockReturnValue({
      products: productFixtures,
      loading: false,
      error: null,
    });

    renderScreen();

    fireEvent.press(screen.getByText('Beauty'));

    expect(screen.getByText('No products found')).toBeOnTheScreen();
    expect(
      screen.getByText('Try a different search or choose another filter.'),
    ).toBeOnTheScreen();
  });
});
