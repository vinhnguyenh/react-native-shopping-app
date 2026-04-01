package com.reactnativestarter.synccache.nativebridge

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import com.facebook.fbreact.specs.NativeUserProfileSyncSpec
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import com.reactnativestarter.synccache.data.repository.UserProfileRepository

@ReactModule(name = UserProfileSyncTurboModule.NAME)
class UserProfileSyncTurboModule(reactContext: ReactApplicationContext) :
    NativeUserProfileSyncSpec(reactContext) {
  private val userProfileRepository = UserProfileRepository(reactContext)
  private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

  override fun getName(): String = NAME

  override fun setUserProfile(profileJson: String, promise: Promise) {
    scope.launch {
      runCatching { userProfileRepository.setUserProfile(profileJson) }
          .onSuccess { promise.resolve(null) }
          .onFailure { promise.reject("USER_PROFILE_WRITE_FAILED", it.message, it) }
    }
  }

  override fun getUserProfile(promise: Promise) {
    scope.launch {
      runCatching { userProfileRepository.getUserProfileJson() }
          .onSuccess { promise.resolve(it) }
          .onFailure { promise.reject("USER_PROFILE_READ_FAILED", it.message, it) }
    }
  }

  override fun clearUserProfile(promise: Promise) {
    scope.launch {
      runCatching { userProfileRepository.clearUserProfile() }
          .onSuccess { promise.resolve(null) }
          .onFailure { promise.reject("USER_PROFILE_CLEAR_FAILED", it.message, it) }
    }
  }

  override fun invalidate() {
    scope.cancel()
    super.invalidate()
  }

  companion object {
    const val NAME = "UserProfile"
  }
}
