package com.reactnativestarter.synccache.nativebridge

import com.facebook.fbreact.specs.NativeProductSyncSpec
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import com.reactnativestarter.synccache.data.repository.ProductRepository

@ReactModule(name = ProductSyncTurboModule.NAME)
class ProductSyncTurboModule(reactContext: ReactApplicationContext) :
    NativeProductSyncSpec(reactContext) {
  private val productRepository = ProductRepository(reactContext)
  private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

  override fun getName(): String = NAME

  override fun configure(configJson: String) {
    productRepository.configure(configJson)
  }

  override fun syncProducts(promise: Promise) {
    scope.launch {
      runCatching { productRepository.syncProductsJson() }
          .onSuccess { promise.resolve(it) }
          .onFailure { promise.reject("PRODUCT_SYNC_FAILED", it.message, it) }
    }
  }

  override fun getProducts(promise: Promise) {
    scope.launch {
      runCatching { productRepository.getProductsJson() }
          .onSuccess { promise.resolve(it) }
          .onFailure { promise.reject("PRODUCT_READ_FAILED", it.message, it) }
    }
  }

  override fun clearProducts(promise: Promise) {
    scope.launch {
      runCatching { productRepository.clearProducts() }
          .onSuccess { promise.resolve(null) }
          .onFailure { promise.reject("PRODUCT_CLEAR_FAILED", it.message, it) }
    }
  }

  override fun invalidate() {
    scope.cancel()
    super.invalidate()
  }

  companion object {
    const val NAME = "ProductSync"
  }
}
