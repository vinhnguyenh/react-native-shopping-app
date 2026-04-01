describe('product-sync-service', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('falls back to the API client when native sync is unavailable', async () => {
    const apiProducts = [
      {
        id: 1,
        name: 'API Product',
        description: 'Fallback product',
        image: '',
        price: 40,
        priceUnit: 'dollar',
      },
    ];

    jest.doMock('react-native', () => ({
      Platform: { OS: 'ios' },
    }));
    jest.doMock('@/native/NativeProductSync', () => null);
    jest.doMock('@/config/env', () => ({
      env: {
        apiUrl: 'https://example.com',
      },
    }));
    jest.doMock('@/services/api-service', () => ({
      apiService: {
        getProducts: jest.fn().mockResolvedValue({
          data: {
            data: apiProducts,
          },
        }),
      },
    }));

    const { productSyncService } = require('@/services/product-sync-service');
    const { apiService } = require('@/services/api-service');

    await expect(productSyncService.getProducts()).resolves.toEqual(apiProducts);
    await expect(productSyncService.syncProducts()).resolves.toEqual(apiProducts);
    expect(apiService.getProducts).toHaveBeenCalledTimes(2);
  });

  it('uses the native turbo module on android and parses the payload', async () => {
    const nativeModule = {
      configure: jest.fn(),
      getProducts: jest.fn().mockResolvedValue(
        JSON.stringify([
          {
            id: 3,
            name: 'Native Product',
            description: 'From android cache',
            image: '',
            price: 18,
            priceUnit: 'dollar',
          },
        ]),
      ),
      syncProducts: jest.fn().mockResolvedValue(
        JSON.stringify([
          {
            id: 4,
            name: 'Native Sync Product',
            description: 'From android sync',
            image: '',
            price: 55,
            priceUnit: 'dollar',
          },
        ]),
      ),
      clearProducts: jest.fn().mockResolvedValue(undefined),
    };

    jest.doMock('react-native', () => ({
      Platform: { OS: 'android' },
    }));
    jest.doMock('@/native/NativeProductSync', () => ({
      __esModule: true,
      default: nativeModule,
    }));
    jest.doMock('@/config/env', () => ({
      env: {
        apiUrl: 'https://example.com',
      },
    }));
    jest.doMock('@/services/api-service', () => ({
      apiService: {
        getProducts: jest.fn(),
      },
    }));

    const { productSyncService } = require('@/services/product-sync-service');

    await expect(productSyncService.getProducts()).resolves.toEqual([
      expect.objectContaining({ id: 3, name: 'Native Product' }),
    ]);
    await expect(productSyncService.syncProducts()).resolves.toEqual([
      expect.objectContaining({ id: 4, name: 'Native Sync Product' }),
    ]);

    productSyncService.configureForCurrentSession('token-123');
    await productSyncService.clearProducts();

    expect(nativeModule.configure).toHaveBeenCalledWith(
      JSON.stringify({
        apiBaseUrl: 'https://example.com',
        authToken: 'token-123',
      }),
    );
    expect(nativeModule.clearProducts).toHaveBeenCalledTimes(1);
  });

  it('throws when the native module returns an invalid payload', async () => {
    const nativeModule = {
      configure: jest.fn(),
      getProducts: jest.fn().mockResolvedValue(JSON.stringify({ invalid: true })),
      syncProducts: jest.fn(),
      clearProducts: jest.fn(),
    };

    jest.doMock('react-native', () => ({
      Platform: { OS: 'android' },
    }));
    jest.doMock('@/native/NativeProductSync', () => ({
      __esModule: true,
      default: nativeModule,
    }));
    jest.doMock('@/config/env', () => ({
      env: {
        apiUrl: 'https://example.com',
      },
    }));
    jest.doMock('@/services/api-service', () => ({
      apiService: {
        getProducts: jest.fn(),
      },
    }));

    const { productSyncService } = require('@/services/product-sync-service');

    await expect(productSyncService.getProducts()).rejects.toThrow(
      'Invalid product payload returned from native sync.',
    );
  });
});
