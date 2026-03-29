package com.reactnativestarter.synccache.data.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.reactnativestarter.synccache.data.entity.SyncMetadataEntity

@Dao
internal interface SyncMetadataDao {
  @Insert(onConflict = OnConflictStrategy.REPLACE)
  fun upsert(metadata: SyncMetadataEntity)

  @Query("DELETE FROM sync_metadata")
  fun clearAll()
}
