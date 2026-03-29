package com.reactnativestarter.synccache.data

import android.content.Context
import android.os.Build
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.reactnativestarter.synccache.data.dao.ProductCacheDao
import com.reactnativestarter.synccache.data.dao.SyncMetadataDao
import com.reactnativestarter.synccache.data.entity.CachedProductEntity
import com.reactnativestarter.synccache.data.entity.SyncMetadataEntity

@Database(
    entities = [CachedProductEntity::class, SyncMetadataEntity::class],
    version = 1,
    exportSchema = false,
)
internal abstract class SyncCacheDatabase : RoomDatabase() {
  abstract fun productCacheDao(): ProductCacheDao

  abstract fun syncMetadataDao(): SyncMetadataDao

  companion object {
    private const val DATABASE_NAME = "sync-cache.db"

    @Volatile private var instance: SyncCacheDatabase? = null

    fun getInstance(context: Context): SyncCacheDatabase {
      return instance
          ?: synchronized(this) {
            instance
                ?: Room.databaseBuilder(
                        context.applicationContext,
                        SyncCacheDatabase::class.java,
                        DATABASE_NAME,
                    )
                    .apply {
                      if (Build.FINGERPRINT.contains("robolectric", ignoreCase = true)) {
                        allowMainThreadQueries()
                      }
                    }
                    .fallbackToDestructiveMigration(false)
                    .build()
                    .also { instance = it }
          }
    }
  }
}
