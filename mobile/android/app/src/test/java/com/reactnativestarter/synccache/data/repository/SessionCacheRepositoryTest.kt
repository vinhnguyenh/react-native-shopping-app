package com.reactnativestarter.synccache.data.repository

import android.app.Application
import androidx.test.core.app.ApplicationProvider
import com.reactnativestarter.synccache.data.SyncCacheDatabase
import kotlinx.coroutines.test.runTest
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(application = SessionCacheRepositoryTestApplication::class, manifest = Config.NONE, sdk = [35])
class SessionCacheRepositoryTest {
  private lateinit var applicationContext: Application
  private lateinit var sessionCacheRepository: SessionRepository
  private lateinit var userProfileRepository: UserProfileRepository

  @Before
  fun setUp() {
    applicationContext = ApplicationProvider.getApplicationContext()
    resetDatabaseSingleton()
    applicationContext.deleteDatabase("sync-cache.db")
    sessionCacheRepository = SessionRepository(applicationContext)
    userProfileRepository = UserProfileRepository(applicationContext)
  }

  @After
  fun tearDown() {
    if (::applicationContext.isInitialized) {
      resetDatabaseSingleton()
      applicationContext.deleteDatabase("sync-cache.db")
    }
  }

  @Test
  fun `it should delete the session cache database and allow recreation`() = runTest {
    userProfileRepository.setUserProfile("""{"username":"shopper"}""")

    sessionCacheRepository.deleteSessionCache()

    assertTrue(!applicationContext.getDatabasePath("sync-cache.db").exists())
    assertEquals(null, userProfileRepository.getUserProfileJson())

    userProfileRepository.setUserProfile("""{"username":"restored-user"}""")

    assertTrue(applicationContext.getDatabasePath("sync-cache.db").exists())
    assertTrue(userProfileRepository.getUserProfileJson().orEmpty().contains("restored-user"))
  }

  private fun resetDatabaseSingleton() {
    val instanceField = SyncCacheDatabase::class.java.getDeclaredField("instance")
    instanceField.isAccessible = true

    (instanceField.get(null) as? SyncCacheDatabase)?.close()
    instanceField.set(null, null)
  }
}

class SessionCacheRepositoryTestApplication : Application()
