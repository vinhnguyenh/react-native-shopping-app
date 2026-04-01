describe('user-profile-sync-service', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('returns null when native profile sync is unavailable', async () => {
    jest.doMock('react-native', () => ({
      Platform: { OS: 'ios' },
    }));
    jest.doMock('@/native/NativeUserProfileSync', () => null);

    const { userProfileSyncService } = require('@/services/user-profile-sync-service');

    await expect(userProfileSyncService.getUserProfile()).resolves.toBeNull();
    await expect(
      userProfileSyncService.setUserProfile({
        id: 1,
        username: 'ignored',
      }),
    ).resolves.toBeUndefined();
    await expect(userProfileSyncService.clearUserProfile()).resolves.toBeUndefined();
  });

  it('serializes and clears profiles through the native module on android', async () => {
    const nativeModule = {
      setUserProfile: jest.fn().mockResolvedValue(undefined),
      getUserProfile: jest.fn().mockResolvedValue(
        JSON.stringify({
          id: 7,
          username: 'native-user',
          firstName: 'Native',
        }),
      ),
      clearUserProfile: jest.fn().mockResolvedValue(undefined),
    };

    jest.doMock('react-native', () => ({
      Platform: { OS: 'android' },
    }));
    jest.doMock('@/native/NativeUserProfileSync', () => ({
      __esModule: true,
      default: nativeModule,
    }));

    const { userProfileSyncService } = require('@/services/user-profile-sync-service');
    const user = {
      id: 7,
      username: 'native-user',
      firstName: 'Native',
    };

    await userProfileSyncService.setUserProfile(user);
    await expect(userProfileSyncService.getUserProfile()).resolves.toEqual(user);
    await userProfileSyncService.clearUserProfile();

    expect(nativeModule.setUserProfile).toHaveBeenCalledWith(JSON.stringify(user));
    expect(nativeModule.clearUserProfile).toHaveBeenCalledTimes(1);
  });

  it('returns null for an empty native profile payload', async () => {
    const nativeModule = {
      setUserProfile: jest.fn().mockResolvedValue(undefined),
      getUserProfile: jest.fn().mockResolvedValue(null),
      clearUserProfile: jest.fn().mockResolvedValue(undefined),
    };

    jest.doMock('react-native', () => ({
      Platform: { OS: 'android' },
    }));
    jest.doMock('@/native/NativeUserProfileSync', () => ({
      __esModule: true,
      default: nativeModule,
    }));

    const { userProfileSyncService } = require('@/services/user-profile-sync-service');

    await expect(userProfileSyncService.getUserProfile()).resolves.toBeNull();
  });
});
