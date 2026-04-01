package com.reactnativestarter.synccache.data.repository

import android.content.Context
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import com.reactnativestarter.synccache.data.SyncCacheDatabase

internal class SessionRepository(context: Context) {
  private val applicationContext = context.applicationContext

  suspend fun deleteSessionCache() =
      withContext(Dispatchers.IO) {
        SyncCacheDatabase.deleteInstance(applicationContext)
      }
}
