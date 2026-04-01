package com.reactnativestarter.synccache.nativebridge

import com.facebook.fbreact.specs.NativeSessionCacheSpec
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import com.reactnativestarter.synccache.data.repository.SessionRepository

@ReactModule(name = SessionCacheTurboModule.NAME)
class SessionCacheTurboModule(reactContext: ReactApplicationContext) :
    NativeSessionCacheSpec(reactContext) {
  private val sessionRepository = SessionRepository(reactContext)
  private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

  override fun getName(): String = NAME

  override fun deleteSessionCache(promise: Promise) {
    scope.launch {
      runCatching { sessionRepository.deleteSessionCache() }
          .onSuccess { promise.resolve(null) }
          .onFailure { promise.reject("SESSION_CACHE_DELETE_FAILED", it.message, it) }
    }
  }

  override fun invalidate() {
    scope.cancel()
    super.invalidate()
  }

  companion object {
    const val NAME = "SessionCache"
  }
}
