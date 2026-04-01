package com.reactnativestarter.synccache.data.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.reactnativestarter.synccache.data.entity.UserProfileEntity

@Dao
internal interface UserProfileDao {
  @Query("SELECT * FROM user_profile WHERE id = 0 LIMIT 1")
  suspend fun getProfile(): UserProfileEntity?

  @Insert(onConflict = OnConflictStrategy.REPLACE)
  suspend fun upsert(profile: UserProfileEntity)

  @Query("DELETE FROM user_profile")
  suspend fun clear()
}
