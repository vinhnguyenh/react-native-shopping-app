import { Platform } from 'react-native';

import SessionCacheTurboModule from '@/native/NativeSessionCache';

const isAndroidSessionCacheAvailable =
  Platform.OS === 'android' && SessionCacheTurboModule != null;

export const sessionCacheService = {
  async deleteSessionCache(): Promise<void> {
    if (!isAndroidSessionCacheAvailable || !SessionCacheTurboModule) {
      return;
    }

    await SessionCacheTurboModule.deleteSessionCache();
  },
};
