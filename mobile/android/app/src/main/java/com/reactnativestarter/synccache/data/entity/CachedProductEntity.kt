package com.reactnativestarter.synccache.data.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "cached_products")
internal data class CachedProductEntity(
    @PrimaryKey val id: Int,
    val name: String,
    val description: String,
    val image: String,
    val price: Double,
    @ColumnInfo(name = "price_unit") val priceUnit: String,
    @ColumnInfo(name = "created_at") val createdAt: String?,
    @ColumnInfo(name = "updated_at") val updatedAt: String?,
)
