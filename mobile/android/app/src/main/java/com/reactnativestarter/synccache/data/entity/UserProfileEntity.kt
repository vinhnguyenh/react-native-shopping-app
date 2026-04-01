package com.reactnativestarter.synccache.data.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "user_profile")
internal data class UserProfileEntity(
    @PrimaryKey val id: Int = 0,
    val username: String,
    @ColumnInfo(name = "first_name") val firstName: String?,
    @ColumnInfo(name = "last_name") val lastName: String?,
    val email: String?,
    val role: String?,
    val age: Int?,
    @ColumnInfo(name = "created_at") val createdAt: String?,
    @ColumnInfo(name = "updated_at") val updatedAt: String?,
)
