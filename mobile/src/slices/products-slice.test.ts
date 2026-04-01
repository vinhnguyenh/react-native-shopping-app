import { configureStore } from '@reduxjs/toolkit';

import productsReducer, {
  clearProducts,
  fetchProducts,
  selectProducts,
  selectProductsError,
  selectProductsLoading,
} from '@/slices/products-slice';
import { productSyncService } from '@/services/product-sync-service';

jest.mock('@/services/product-sync-service', () => ({
  productSyncService: {
    getProducts: jest.fn(),
    syncProducts: jest.fn(),
  },
}));

const mockedProductSyncService = jest.mocked(productSyncService);

const cachedProducts = [
  {
    id: 1,
    name: 'Cached Speaker',
    description: 'Portable audio speaker',
    image: '',
    price: 99,
    priceUnit: 'dollar' as const,
  },
];

const syncedProducts = [
  {
    id: 2,
    name: 'Synced Mug',
    description: 'Kitchen home mug',
    image: '',
    price: 19,
    priceUnit: 'dollar' as const,
  },
];

const createStore = () =>
  configureStore({
    reducer: {
      products: productsReducer,
    },
  });

describe('products-slice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the initial state and clears existing products', () => {
    const previousState = {
      data: cachedProducts,
      loading: true,
      error: 'Oops',
    };

    const state = productsReducer(previousState, clearProducts());

    expect(state).toEqual({
      data: [],
      loading: false,
      error: null,
    });
  });

  it('fetches fresh products after hydrating cached data', async () => {
    mockedProductSyncService.getProducts.mockResolvedValue(cachedProducts);
    mockedProductSyncService.syncProducts.mockResolvedValue(syncedProducts);

    const store = createStore();
    await store.dispatch(fetchProducts());

    const state = store.getState();
    expect(selectProducts(state as never)).toEqual(syncedProducts);
    expect(selectProductsLoading(state as never)).toBe(false);
    expect(selectProductsError(state as never)).toBeNull();
    expect(mockedProductSyncService.getProducts).toHaveBeenCalledTimes(1);
    expect(mockedProductSyncService.syncProducts).toHaveBeenCalledTimes(1);
  });

  it('falls back to cached products when sync fails', async () => {
    mockedProductSyncService.getProducts.mockResolvedValue(cachedProducts);
    mockedProductSyncService.syncProducts.mockRejectedValue(
      new Error('Sync failed'),
    );

    const store = createStore();
    await store.dispatch(fetchProducts());

    expect(store.getState().products.data).toEqual(cachedProducts);
    expect(store.getState().products.error).toBeNull();
  });

  it('stores an error when cache is empty and sync fails', async () => {
    mockedProductSyncService.getProducts.mockResolvedValue([]);
    mockedProductSyncService.syncProducts.mockRejectedValue(
      new Error('Network unavailable'),
    );

    const store = createStore();
    await store.dispatch(fetchProducts());

    expect(store.getState().products.data).toEqual([]);
    expect(store.getState().products.error).toBe('Network unavailable');
    expect(store.getState().products.loading).toBe(false);
  });
});
