import { Platform } from 'react-native';

import type { User } from '@/models/user';
import UserProfileTurboModule from '@/native/NativeUserProfileSync';

const isAndroidNativeSyncAvailable =
  Platform.OS === 'android' && UserProfileTurboModule != null;

const parseUserProfile = (profileJson: string | null): User | null => {
  if (!profileJson) {
    return null;
  }

  return JSON.parse(profileJson) as User;
};

export const userProfileSyncService = {
  async setUserProfile(user: User): Promise<void> {
    if (!isAndroidNativeSyncAvailable || !UserProfileTurboModule) {
      return;
    }

    await UserProfileTurboModule.setUserProfile(JSON.stringify(user));
  },

  async getUserProfile(): Promise<User | null> {
    if (!isAndroidNativeSyncAvailable || !UserProfileTurboModule) {
      return null;
    }

    const profileJson = await UserProfileTurboModule.getUserProfile();
    return parseUserProfile(profileJson);
  },

  async clearUserProfile(): Promise<void> {
    if (!isAndroidNativeSyncAvailable || !UserProfileTurboModule) {
      return;
    }

    await UserProfileTurboModule.clearUserProfile();
  },
};
