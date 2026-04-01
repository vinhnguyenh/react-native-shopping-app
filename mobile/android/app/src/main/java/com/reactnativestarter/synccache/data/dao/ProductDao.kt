package com.reactnativestarter.synccache.data.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Transaction
import com.reactnativestarter.synccache.data.entity.ProductEntity

@Dao
internal interface ProductDao {
  @Query("SELECT * FROM products ORDER BY id ASC")
  suspend fun getAll(): List<ProductEntity>

  @Insert(onConflict = OnConflictStrategy.REPLACE)
  suspend fun insertAll(products: List<ProductEntity>)

  @Query("DELETE FROM products")
  suspend fun clearAll()

  @Transaction
  suspend fun replaceAll(products: List<ProductEntity>) {
    clearAll()
    if (products.isNotEmpty()) {
      insertAll(products)
    }
  }
}
