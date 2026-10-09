package com.youngknight.fcmguard.core

import android.content.Context
import android.content.pm.PackageManager

/**
 * Kiểm tra trạng thái Google Play Services (GMS) được phép công khai bởi Android.
 */
object GmsStatusChecker {
    const val GMS_PACKAGE = "com.google.android.gms"

    data class GmsStatus(
        val isInstalled: Boolean,
        val isEnabled: Boolean,
        val versionName: String?,
        val versionCode: Long,
        val description: String
    )

    fun check(context: Context): GmsStatus {
        val pm = context.packageManager
        return try {
            val info = pm.getPackageInfo(GMS_PACKAGE, 0)
            val appInfo = pm.getApplicationInfo(GMS_PACKAGE, 0)
            val isEnabled = appInfo.enabled
            val versionCode = if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.P) {
                info.longVersionCode
            } else {
                @Suppress("DEPRECATION")
                info.versionCode.toLong()
            }

            GmsStatus(
                isInstalled = true,
                isEnabled = isEnabled,
                versionName = info.versionName,
                versionCode = versionCode,
                description = if (isEnabled) "Đang hoạt động (v${info.versionName})" else "Đã bị tắt trong cài đặt"
            )
        } catch (e: PackageManager.NameNotFoundException) {
            GmsStatus(
                isInstalled = false,
                isEnabled = false,
                versionName = null,
                versionCode = 0L,
                description = "Chưa cài đặt Google Play Services"
            )
        } catch (t: Throwable) {
            GmsStatus(
                isInstalled = false,
                isEnabled = false,
                versionName = null,
                versionCode = 0L,
                description = "Không thể kiểm tra: ${t.message}"
            )
        }
    }
}
