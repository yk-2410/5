package com.youngknight.fcmguard.core

import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import java.util.Collections
import java.util.LinkedHashMap
import java.util.Locale

/**
 * Quét các ứng dụng có đăng ký Intent Receiver hoặc Service FCM/GCM tiêu chuẩn.
 */
object FcmAppScanner {
    private const val ACTION_FCM = "com.google.firebase.MESSAGING_EVENT"
    private const val ACTION_GCM_RECEIVE = "com.google.android.c2dm.intent.RECEIVE"

    data class AppItem(
        val packageName: String,
        val label: String,
        val isImportant: Boolean = false,
        val iconRes: String = "📱"
    )

    // Các ứng dụng thông báo phổ biến cần ưu tiên
    val PRIORITY_APPS = listOf(
        "com.google.android.gms" to "Google Play services",
        "com.facebook.orca" to "Messenger",
        "com.zing.zalo" to "Zalo",
        "com.google.android.gm" to "Gmail",
        "com.VCB" to "Vietcombank",
        "com.vnpay.bidv" to "BIDV SmartBanking",
        "com.bPlus.mbMobile" to "MB Bank",
        "com.zhiliaoapp.musically" to "TikTok",
        "com.google.android.youtube" to "YouTube",
        "com.facebook.katana" to "Facebook"
    )

    fun scan(context: Context): List<AppItem> {
        val pm = context.packageManager
        val flags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            PackageManager.MATCH_ALL
        } else {
            0
        }

        val discovered = LinkedHashMap<String, String>()

        // 1. Thêm các ứng dụng phổ biến nếu đã cài đặt
        for ((pkg, defaultLabel) in PRIORITY_APPS) {
            try {
                val appInfo = pm.getApplicationInfo(pkg, 0)
                val label = pm.getApplicationLabel(appInfo).toString().trim().ifEmpty { defaultLabel }
                discovered[pkg] = label
            } catch (ignored: Throwable) {}
        }

        // 2. Quét Intent Services FCM
        try {
            val services = pm.queryIntentServices(Intent(ACTION_FCM), flags)
            for (resolveInfo in services) {
                val pkg = resolveInfo.serviceInfo?.packageName
                if (pkg != null && !discovered.containsKey(pkg)) {
                    try {
                        val appInfo = pm.getApplicationInfo(pkg, 0)
                        if (appInfo.enabled && pm.getLaunchIntentForPackage(pkg) != null) {
                            val label = pm.getApplicationLabel(appInfo).toString().trim().ifEmpty { pkg }
                            discovered[pkg] = label
                        }
                    } catch (ignored: Throwable) {}
                }
            }
        } catch (ignored: Throwable) {}

        // 3. Quét Receivers GCM
        try {
            val receivers = pm.queryBroadcastReceivers(Intent(ACTION_GCM_RECEIVE), flags)
            for (resolveInfo in receivers) {
                val pkg = resolveInfo.activityInfo?.packageName
                if (pkg != null && !discovered.containsKey(pkg)) {
                    try {
                        val appInfo = pm.getApplicationInfo(pkg, 0)
                        if (appInfo.enabled && pm.getLaunchIntentForPackage(pkg) != null) {
                            val label = pm.getApplicationLabel(appInfo).toString().trim().ifEmpty { pkg }
                            discovered[pkg] = label
                        }
                    } catch (ignored: Throwable) {}
                }
            }
        } catch (ignored: Throwable) {}

        val result = mutableListOf<AppItem>()
        for ((pkg, label) in discovered) {
            val isImportant = PRIORITY_APPS.any { it.first == pkg }
            val icon = when {
                pkg.contains("gms") -> "🟢"
                pkg.contains("zalo") -> "🔵"
                pkg.contains("orca") || pkg.contains("messenger") -> "💬"
                pkg.contains("gmail") -> "✉️"
                pkg.contains("vcb") || pkg.contains("bidv") || pkg.contains("mb") -> "🏦"
                pkg.contains("youtube") -> "▶️"
                pkg.contains("tiktok") -> "🎵"
                else -> "📱"
            }
            result.add(AppItem(pkg, label, isImportant, icon))
        }

        result.sortWith(compareByDescending<AppItem> { it.isImportant }.thenBy { it.label.lowercase(Locale.ROOT) })
        return result
    }
}
