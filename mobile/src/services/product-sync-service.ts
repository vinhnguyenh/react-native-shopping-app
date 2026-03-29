import { Platform } from 'react-native';

import type { Product } from '../models/product';
import { env } from '../config/env';
import ProductSyncTurboModule from '../native/NativeProductSync';
import { apiService } from './api-service';

interface ProductSyncConfiguration {
  apiBaseUrl: string;
  authToken: string | null;
}

const isAndroidNativeSyncAvailable =
  Platform.OS === 'android' && ProductSyncTurboModule != null;

const parseProductsPayload = (productsJson: string): Product[] => {
  const parsedValue: unknown = JSON.parse(productsJson);

  if (!Array.isArray(parsedValue)) {
    throw new Error('Invalid product payload returned from native sync.');
  }

  return parsedValue as Product[];
};

export const productSyncService = {
  configure(configuration: ProductSyncConfiguration): void {
    if (!isAndroidNativeSyncAvailable || !ProductSyncTurboModule) {
      return;
    }

    ProductSyncTurboModule.configure(JSON.stringify(configuration));
  },

  async getProducts(): Promise<Product[]> {
    if (isAndroidNativeSyncAvailable && ProductSyncTurboModule) {
      const productsJson = await ProductSyncTurboModule.getProducts();
      return parseProductsPayload(productsJson);
    }

    const response = await apiService.getProducts();
    return response.data.data;
  },

  async syncProducts(): Promise<Product[]> {
    if (isAndroidNativeSyncAvailable && ProductSyncTurboModule) {
      const productsJson = await ProductSyncTurboModule.syncProducts();
      return parseProductsPayload(productsJson);
    }

    const response = await apiService.getProducts();
    return response.data.data;
  },

  async clearProducts(): Promise<void> {
    if (isAndroidNativeSyncAvailable && ProductSyncTurboModule) {
      await ProductSyncTurboModule.clearProducts();
    }
  },

  configureForCurrentSession(authToken: string | null): void {
    productSyncService.configure({
      apiBaseUrl: env.apiUrl,
      authToken,
    });
  },
};
