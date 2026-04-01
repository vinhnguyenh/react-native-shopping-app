package com.reactnativestarter.synccache.data.repository

import android.app.Application
import androidx.test.core.app.ApplicationProvider
import java.io.IOException
import kotlinx.coroutines.test.runTest
import okhttp3.mockwebserver.MockResponse
import okhttp3.mockwebserver.MockWebServer
import org.json.JSONArray
import org.json.JSONObject
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.fail
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.robolectric.annotation.Config
import org.robolectric.RobolectricTestRunner
import org.junit.runner.RunWith
import com.reactnativestarter.synccache.data.SyncCacheDatabase

@RunWith(RobolectricTestRunner::class)
@Config(application = ProductCacheRepositoryTestApplication::class, manifest = Config.NONE, sdk = [35])
class ProductCacheRepositoryTest {
  private lateinit var server: MockWebServer
  private lateinit var repository: ProductRepository
  private lateinit var applicationContext: Application

  @Before
  fun setUp() {
    server = MockWebServer()
    server.start()

    applicationContext = ApplicationProvider.getApplicationContext()
    resetDatabaseSingleton()
    applicationContext.deleteDatabase("sync-cache.db")
    repository = ProductRepository(applicationContext)
  }

  @After
  fun tearDown() {
    if (::applicationContext.isInitialized) {
      resetDatabaseSingleton()
      applicationContext.deleteDatabase("sync-cache.db")
    }
    server.shutdown()
  }

  @Test
  fun `it should sync products into the cache and return cached json`() = runTest {
    server.enqueue(
        MockResponse()
            .setResponseCode(200)
            .setBody(
                """
                {
                  "data": [
                    {
                      "id": 1,
                      "name": "Apple",
                      "description": "Fresh fruit",
                      "image": "apple.png",
                      "price": 2.5,
                      "priceUnit": "kg",
                      "createdAt": "2026-03-28T10:00:00Z",
                      "updatedAt": null
                    },
                    {
                      "id": 2,
                      "name": "Orange",
                      "description": "Citrus fruit",
                      "image": "orange.png",
                      "price": 3.75,
                      "priceUnit": "bag",
                      "createdAt": null,
                      "updatedAt": "2026-03-28T11:00:00Z"
                    }
                  ]
                }
                """
                    .trimIndent()))

    repository.configure(
        JSONObject()
            .put("apiBaseUrl", server.url("/").toString())
            .put("authToken", "token-123")
            .toString())

    val syncedProducts = JSONArray(repository.syncProductsJson())
    val cachedProducts = JSONArray(repository.getProductsJson())
    val request = server.takeRequest()

    assertEquals("/product", request.path)
    assertEquals("Bearer token-123", request.getHeader("Authorization"))
    assertEquals(2, syncedProducts.length())
    assertEquals(syncedProducts.toString(), cachedProducts.toString())
    assertEquals("Apple", syncedProducts.getJSONObject(0).getString("name"))
    assertNull(syncedProducts.getJSONObject(0).opt("updatedAt"))
    assertEquals("2026-03-28T11:00:00Z", syncedProducts.getJSONObject(1).getString("updatedAt"))
  }

  @Test
  fun `it should clear cached products`() = runTest {
    server.enqueue(
        MockResponse()
            .setResponseCode(200)
            .setBody(
                """
                {
                  "data": [
                    {
                      "id": 10,
                      "name": "Pear",
                      "description": "Green fruit",
                      "image": "pear.png",
                      "price": 1.5,
                      "priceUnit": "piece",
                      "createdAt": null,
                      "updatedAt": null
                    }
                  ]
                }
                """
                    .trimIndent()))

    repository.configure(JSONObject().put("apiBaseUrl", server.url("/").toString()).toString())

    repository.syncProductsJson()
    repository.clearProducts()

    assertTrue(applicationContext.getDatabasePath("sync-cache.db").exists())
    assertEquals("[]", repository.getProductsJson())
  }

  @Test
  fun `it should trim the api base url and skip blank auth tokens`() = runTest {
    server.enqueue(
        MockResponse()
            .setResponseCode(200)
            .setBody(
                """
                {
                  "data": [
                    {
                      "id": 5,
                      "name": "Banana",
                      "description": "Yellow fruit",
                      "image": "banana.png",
                      "price": 4.25,
                      "priceUnit": "bunch",
                      "createdAt": null,
                      "updatedAt": null
                    }
                  ]
                }
                """
                    .trimIndent()))

    repository.configure(
        JSONObject()
            .put("apiBaseUrl", "${server.url("/")}   ")
            .put("authToken", "   ")
            .toString())

    val syncedProducts = JSONArray(repository.syncProductsJson())
    val request = server.takeRequest()

    assertEquals("/product", request.path)
    assertNull(request.getHeader("Authorization"))
    assertEquals(1, syncedProducts.length())
    assertEquals("Banana", syncedProducts.getJSONObject(0).getString("name"))
  }

  @Test
  fun `it should replace stale cached products when the api returns an empty list`() = runTest {
    server.enqueue(
        MockResponse()
            .setResponseCode(200)
            .setBody(
                """
                {
                  "data": [
                    {
                      "id": 11,
                      "name": "Mango",
                      "description": "Sweet fruit",
                      "image": "mango.png",
                      "price": 6.0,
                      "priceUnit": "piece",
                      "createdAt": null,
                      "updatedAt": null
                    }
                  ]
                }
                """
                    .trimIndent()))
    server.enqueue(MockResponse().setResponseCode(200).setBody("""{"data":[]}"""))

    repository.configure(JSONObject().put("apiBaseUrl", server.url("/").toString()).toString())

    repository.syncProductsJson()
    val refreshedProducts = JSONArray(repository.syncProductsJson())

    assertEquals(0, refreshedProducts.length())
    assertEquals("[]", repository.getProductsJson())
  }

  @Test
  fun `it should throw when the api base url is missing`() = runTest {
    val exception =
        try {
          repository.syncProductsJson()
          fail("Expected syncProductsJson to throw when apiBaseUrl is missing.")
          throw IllegalStateException("Unreachable")
        } catch (error: IOException) {
          error
        }

    assertEquals("Native product sync is missing the API base URL.", exception.message)
  }

  @Test
  fun `it should throw the api error response body when sync fails`() = runTest {
    server.enqueue(
        MockResponse().setResponseCode(500).setBody("""{"message":"service unavailable"}"""))

    repository.configure(JSONObject().put("apiBaseUrl", server.url("/").toString()).toString())

    val exception =
        try {
          repository.syncProductsJson()
          fail("Expected syncProductsJson to throw when the API returns an error.")
          throw IllegalStateException("Unreachable")
        } catch (error: IOException) {
          error
        }

    assertTrue(exception.message.orEmpty().contains("""{"message":"service unavailable"}"""))
  }

  private fun resetDatabaseSingleton() {
    val instanceField = SyncCacheDatabase::class.java.getDeclaredField("instance")
    instanceField.isAccessible = true

    (instanceField.get(null) as? SyncCacheDatabase)?.close()
    instanceField.set(null, null)
  }
}

class ProductCacheRepositoryTestApplication : Application()
