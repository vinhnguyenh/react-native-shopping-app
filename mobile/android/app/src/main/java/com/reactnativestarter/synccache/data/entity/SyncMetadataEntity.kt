package com.reactnativestarter.synccache.data.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "sync_metadata")
internal data class SyncMetadataEntity(
    @PrimaryKey val key: String,
    val value: String?,
)
