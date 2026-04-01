package com.reactnativestarter.synccache.data.repository

import android.content.Context
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import com.reactnativestarter.synccache.data.SyncCacheDatabase
import com.reactnativestarter.synccache.data.entity.UserProfileEntity

internal class UserProfileRepository(context: Context) {
  private val applicationContext = context.applicationContext
  private val userProfileDao
    get() = SyncCacheDatabase.getInstance(applicationContext).userProfileDao()

  suspend fun setUserProfile(profileJson: String) =
      withContext(Dispatchers.IO) {
        userProfileDao.upsert(JSONObject(profileJson).toUserProfileEntity())
      }

  suspend fun getUserProfileJson(): String? =
      withContext(Dispatchers.IO) { userProfileDao.getProfile()?.toJson()?.toString() }

  suspend fun clearUserProfile() = withContext(Dispatchers.IO) { userProfileDao.clear() }

  private fun JSONObject.toUserProfileEntity(): UserProfileEntity {
    return UserProfileEntity(
        id = 0,
        username = optString("username").trim(),
        firstName = optNullableString("firstName"),
        lastName = optNullableString("lastName"),
        email = optNullableString("email"),
        role = optNullableString("role"),
        age = if (has("age") && !isNull("age")) optInt("age") else null,
        createdAt = optNullableString("createdAt"),
        updatedAt = optNullableString("updatedAt"),
    )
  }

  private fun UserProfileEntity.toJson(): JSONObject {
    return JSONObject().apply {
      put("id", id)
      put("username", username)
      put("firstName", firstName)
      put("lastName", lastName)
      put("email", email)
      put("role", role)
      put("age", age)
      put("createdAt", createdAt)
      put("updatedAt", updatedAt)
    }
  }

  private fun JSONObject.optNullableString(key: String): String? {
    return if (isNull(key)) {
      null
    } else {
      optString(key).takeIf { it.isNotBlank() }
    }
  }
}
