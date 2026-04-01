package com.reactnativestarter.synccache.data.repository

import android.app.Application
import androidx.test.core.app.ApplicationProvider
import com.reactnativestarter.synccache.data.SyncCacheDatabase
import kotlinx.coroutines.test.runTest
import org.json.JSONObject
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(application = UserProfileCacheRepositoryTestApplication::class, manifest = Config.NONE, sdk = [35])
class UserProfileCacheRepositoryTest {
  private lateinit var applicationContext: Application
  private lateinit var repository: UserProfileRepository

  @Before
  fun setUp() {
    applicationContext = ApplicationProvider.getApplicationContext()
    resetDatabaseSingleton()
    applicationContext.deleteDatabase("sync-cache.db")
    repository = UserProfileRepository(applicationContext)
  }

  @After
  fun tearDown() {
    if (::applicationContext.isInitialized) {
      resetDatabaseSingleton()
      applicationContext.deleteDatabase("sync-cache.db")
    }
  }

  @Test
  fun `it should store and read back a normalized user profile`() = runTest {
    repository.setUserProfile(
        """
        {
          "id": 42,
          "username": "  shopper  ",
          "firstName": "Ada",
          "lastName": "",
          "email": "ada@example.com",
          "role": "customer",
          "age": 29,
          "createdAt": "2026-03-31T08:00:00Z",
          "updatedAt": null
        }
        """
            .trimIndent())

    val cachedProfile = JSONObject(repository.getUserProfileJson() ?: error("Expected cached profile."))

    assertEquals(0, cachedProfile.getInt("id"))
    assertEquals("shopper", cachedProfile.getString("username"))
    assertEquals("Ada", cachedProfile.getString("firstName"))
    assertNull(cachedProfile.opt("lastName"))
    assertEquals("ada@example.com", cachedProfile.getString("email"))
    assertEquals("customer", cachedProfile.getString("role"))
    assertEquals(29, cachedProfile.getInt("age"))
    assertEquals("2026-03-31T08:00:00Z", cachedProfile.getString("createdAt"))
    assertNull(cachedProfile.opt("updatedAt"))
  }

  @Test
  fun `it should return null when no user profile is cached`() = runTest {
    assertNull(repository.getUserProfileJson())
  }

  @Test
  fun `it should clear the cached user profile`() = runTest {
    repository.setUserProfile("""{"username":"shopper"}""")

    repository.clearUserProfile()

    assertNull(repository.getUserProfileJson())
  }

  private fun resetDatabaseSingleton() {
    val instanceField = SyncCacheDatabase::class.java.getDeclaredField("instance")
    instanceField.isAccessible = true

    (instanceField.get(null) as? SyncCacheDatabase)?.close()
    instanceField.set(null, null)
  }
}

class UserProfileCacheRepositoryTestApplication : Application()
