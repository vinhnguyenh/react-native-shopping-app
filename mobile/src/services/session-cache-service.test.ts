describe('session-cache-service', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('returns when the native session cache module is unavailable', async () => {
    jest.doMock('react-native', () => ({
      Platform: { OS: 'ios' },
    }));
    jest.doMock('@/native/NativeSessionCache', () => null);

    const { sessionCacheService } = require('@/services/session-cache-service');

    await expect(sessionCacheService.deleteSessionCache()).resolves.toBeUndefined();
  });

  it('deletes the session cache through the native module on android', async () => {
    const nativeModule = {
      deleteSessionCache: jest.fn().mockResolvedValue(undefined),
    };

    jest.doMock('react-native', () => ({
      Platform: { OS: 'android' },
    }));
    jest.doMock('@/native/NativeSessionCache', () => ({
      __esModule: true,
      default: nativeModule,
    }));

    const { sessionCacheService } = require('@/services/session-cache-service');

    await sessionCacheService.deleteSessionCache();

    expect(nativeModule.deleteSessionCache).toHaveBeenCalledTimes(1);
  });
});
