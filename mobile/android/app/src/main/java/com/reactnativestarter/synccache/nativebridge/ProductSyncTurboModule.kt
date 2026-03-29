package com.reactnativestarter.synccache.nativebridge

import com.facebook.fbreact.specs.NativeProductSyncSpec
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import com.reactnativestarter.synccache.data.repository.ProductCacheRepository

@ReactModule(name = ProductSyncTurboModule.NAME)
class ProductSyncTurboModule(reactContext: ReactApplicationContext) :
    NativeProductSyncSpec(reactContext) {
  private val repository = ProductCacheRepository(reactContext)
  private val executor: ExecutorService = Executors.newSingleThreadExecutor()

  override fun getName(): String = NAME

  override fun configure(configJson: String) {
    repository.configure(configJson)
  }

  override fun syncProducts(promise: Promise) {
    executor.execute {
      runCatching { repository.syncProductsJson() }
          .onSuccess { promise.resolve(it) }
          .onFailure { promise.reject("PRODUCT_SYNC_FAILED", it.message, it) }
    }
  }

  override fun getProducts(promise: Promise) {
    executor.execute {
      runCatching { repository.getProductsJson() }
          .onSuccess { promise.resolve(it) }
          .onFailure { promise.reject("PRODUCT_CACHE_READ_FAILED", it.message, it) }
    }
  }

  override fun clearProducts(promise: Promise) {
    executor.execute {
      runCatching { repository.clearProducts() }
          .onSuccess { promise.resolve(null) }
          .onFailure { promise.reject("PRODUCT_CACHE_CLEAR_FAILED", it.message, it) }
    }
  }

  override fun invalidate() {
    executor.shutdown()
    super.invalidate()
  }

  companion object {
    const val NAME = "ProductSync"
  }
}
