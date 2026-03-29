package com.reactnativestarter.synccache.data.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Transaction
import com.reactnativestarter.synccache.data.entity.CachedProductEntity

@Dao
internal interface ProductCacheDao {
  @Query("SELECT * FROM cached_products ORDER BY id ASC")
  fun getAll(): List<CachedProductEntity>

  @Insert(onConflict = OnConflictStrategy.REPLACE)
  fun insertAll(products: List<CachedProductEntity>)

  @Query("DELETE FROM cached_products")
  fun clearAll()

  @Transaction
  fun replaceAll(products: List<CachedProductEntity>) {
    clearAll()
    if (products.isNotEmpty()) {
      insertAll(products)
    }
  }
}
