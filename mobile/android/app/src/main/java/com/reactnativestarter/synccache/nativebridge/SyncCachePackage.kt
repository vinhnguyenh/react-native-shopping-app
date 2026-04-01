package com.reactnativestarter.synccache.nativebridge

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class SyncCachePackage : BaseReactPackage() {
  override fun getModule(
      name: String,
      reactContext: ReactApplicationContext,
  ): NativeModule? {
    return when (name) {
      ProductSyncTurboModule.NAME -> ProductSyncTurboModule(reactContext)
      SessionCacheTurboModule.NAME -> SessionCacheTurboModule(reactContext)
      UserProfileSyncTurboModule.NAME -> UserProfileSyncTurboModule(reactContext)
      else -> null
    }
  }

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
    return ReactModuleInfoProvider {
      mapOf(
          ProductSyncTurboModule.NAME to
              ReactModuleInfo(
                  ProductSyncTurboModule.NAME,
                  ProductSyncTurboModule::class.java.name,
                  false,
                  false,
                  false,
                  ReactModuleInfo.classIsTurboModule(ProductSyncTurboModule::class.java),
              ),
          SessionCacheTurboModule.NAME to
              ReactModuleInfo(
                  SessionCacheTurboModule.NAME,
                  SessionCacheTurboModule::class.java.name,
                  false,
                  false,
                  false,
                  ReactModuleInfo.classIsTurboModule(SessionCacheTurboModule::class.java),
              ),
          UserProfileSyncTurboModule.NAME to
              ReactModuleInfo(
                  UserProfileSyncTurboModule.NAME,
                  UserProfileSyncTurboModule::class.java.name,
                  false,
                  false,
                  false,
                  ReactModuleInfo.classIsTurboModule(UserProfileSyncTurboModule::class.java),
              ),
      )
    }
  }
}
