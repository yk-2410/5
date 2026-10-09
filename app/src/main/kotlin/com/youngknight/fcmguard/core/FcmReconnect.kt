package com.youngknight.fcmguard.core

import android.content.Context
import android.content.Intent

/**
 * Gửi Intent Heartbeat tới GMS và GSF.
 * 
 * NGUYÊN TẮC TRUNG THỰC:
 * Đây là hành động phát broadcast cục bộ (best-effort);
 * ứng dụng ghi log rõ ràng là "Đã phát broadcast nhịp tim",
 * không cam đoan máy chủ Google FCM đã nhận được hoặc kết nối thành công 100%.
 */
object FcmReconnect {
    private const val ACTION_GTALK_HEARTBEAT = "com.google.android.intent.action.GTALK_HEARTBEAT"
    private const val ACTION_MCS_HEARTBEAT = "com.google.android.intent.action.MCS_HEARTBEAT"

    private val TARGET_PACKAGES = arrayOf(
        "com.google.android.gms",
        "com.google.android.gsf"
    )

    fun sendHeartbeat(context: Context): Int {
        var count = 0
        for (pkg in TARGET_PACKAGES) {
            try {
                context.sendBroadcast(Intent(ACTION_GTALK_HEARTBEAT).setPackage(pkg))
                context.sendBroadcast(Intent(ACTION_MCS_HEARTBEAT).setPackage(pkg))
                count++
            } catch (ignored: Throwable) {}
        }
        return count
    }
}
