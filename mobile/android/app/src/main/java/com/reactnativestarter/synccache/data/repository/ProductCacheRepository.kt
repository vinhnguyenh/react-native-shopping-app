package com.reactnativestarter.synccache.data.repository

import android.content.Context
import java.io.BufferedReader
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL
import java.time.Instant
import org.json.JSONArray
import org.json.JSONObject
import com.reactnativestarter.synccache.data.SyncCacheDatabase
import com.reactnativestarter.synccache.data.entity.CachedProductEntity
import com.reactnativestarter.synccache.data.entity.SyncMetadataEntity

internal class ProductCacheRepository(context: Context) {
  private val database = SyncCacheDatabase.getInstance(context)
  private val productCacheDao = database.productCacheDao()
  private val syncMetadataDao = database.syncMetadataDao()
  private var apiBaseUrl: String? = null
  private var authToken: String? = null

  fun configure(configJson: String) {
    val config = JSONObject(configJson)
    apiBaseUrl = config.optString("apiBaseUrl").trim().trimEnd('/')
    authToken = config.optString("authToken").takeIf { it.isNotBlank() }
  }

  fun getProductsJson(): String {
    return JSONArray().apply {
      productCacheDao.getAll().forEach { put(it.toJson()) }
    }.toString()
  }

  fun clearProducts() {
    database.runInTransaction {
      productCacheDao.clearAll()
      syncMetadataDao.clearAll()
    }
  }

  @Throws(IOException::class)
  fun syncProductsJson(): String {
    val baseUrl =
        apiBaseUrl?.takeIf { it.isNotBlank() }
            ?: throw IOException("Native product sync is missing the API base URL.")
    val connection = (URL("$baseUrl/product").openConnection() as HttpURLConnection)

    try {
      connection.requestMethod = "GET"
      connection.setRequestProperty("Accept", "application/json")
      authToken?.let { connection.setRequestProperty("Authorization", "Bearer $it") }
      connection.connectTimeout = NETWORK_TIMEOUT_MS
      connection.readTimeout = NETWORK_TIMEOUT_MS

      val responseCode = connection.responseCode
      val responseBody =
          if (responseCode in 200..299) {
            connection.inputStream.bufferedReader().use(BufferedReader::readText)
          } else {
            connection.errorStream?.bufferedReader()?.use(BufferedReader::readText)
                ?: "HTTP $responseCode"
          }

      if (responseCode !in 200..299) {
        throw IOException("Product sync failed: $responseBody")
      }

      val responseJson = JSONObject(responseBody)
      val productsArray = responseJson.optJSONArray("data") ?: JSONArray()
      val syncedProducts = mutableListOf<CachedProductEntity>()

      for (index in 0 until productsArray.length()) {
        syncedProducts.add(productsArray.getJSONObject(index).toCachedProductEntity())
      }

      val syncedAt = Instant.now().toString()
      database.runInTransaction {
        productCacheDao.replaceAll(syncedProducts)
        syncMetadataDao.upsert(SyncMetadataEntity(key = KEY_LAST_SYNCED_AT, value = syncedAt))
      }

      return JSONArray().apply {
        syncedProducts.forEach { put(it.toJson()) }
      }.toString()
    } finally {
      connection.disconnect()
    }
  }

  private fun JSONObject.toCachedProductEntity(): CachedProductEntity {
    return CachedProductEntity(
        id = getInt("id"),
        name = getString("name"),
        description = getString("description"),
        image = getString("image"),
        price = optDouble("price"),
        priceUnit = getString("priceUnit"),
        createdAt = optNullableString("createdAt"),
        updatedAt = optNullableString("updatedAt"),
    )
  }

  private fun CachedProductEntity.toJson(): JSONObject {
    return JSONObject().apply {
      put("id", id)
      put("name", name)
      put("description", description)
      put("image", image)
      put("price", price)
      put("priceUnit", priceUnit)
      put("createdAt", createdAt)
      put("updatedAt", updatedAt)
    }
  }

  private fun JSONObject.optNullableString(key: String): String? {
    return if (isNull(key)) {
      null
    } else {
      optString(key).takeIf { it.isNotBlank() }
    }
  }

  companion object {
    private const val KEY_LAST_SYNCED_AT = "last_synced_at"
    private const val NETWORK_TIMEOUT_MS = 10_000
  }
}
