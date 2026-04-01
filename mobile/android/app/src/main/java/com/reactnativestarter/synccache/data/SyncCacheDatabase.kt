package com.reactnativestarter.synccache.data

import android.content.Context
import android.os.Build
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.reactnativestarter.synccache.data.dao.ProductDao
import com.reactnativestarter.synccache.data.dao.SyncMetadataDao
import com.reactnativestarter.synccache.data.dao.UserProfileDao
import com.reactnativestarter.synccache.data.entity.ProductEntity
import com.reactnativestarter.synccache.data.entity.SyncMetadataEntity
import com.reactnativestarter.synccache.data.entity.UserProfileEntity

@Database(
    entities = [ProductEntity::class, SyncMetadataEntity::class, UserProfileEntity::class],
    version = 2,
    exportSchema = false,
)
internal abstract class SyncCacheDatabase : RoomDatabase() {
  abstract fun productCacheDao(): ProductDao

  abstract fun syncMetadataDao(): SyncMetadataDao

  abstract fun userProfileDao(): UserProfileDao

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

    fun deleteInstance(context: Context): Boolean {
      return synchronized(this) {
        instance?.close()
        instance = null
        context.applicationContext.deleteDatabase(DATABASE_NAME)
      }
    }

  }
}
