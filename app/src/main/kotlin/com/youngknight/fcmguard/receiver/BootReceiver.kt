package com.youngknight.fcmguard.receiver

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import com.youngknight.fcmguard.core.LogManager
import com.youngknight.fcmguard.core.SettingsGuard
import com.youngknight.fcmguard.service.GuardService

/**
 * Tự động khởi động lại dịch vụ sau khi máy khởi động lại (Boot / Update).
 */
class BootReceiver : BroadcastReceiver {
    constructor() : super()

    override fun onReceive(context: Context, intent: Intent) {
        if (!SettingsGuard.isProtectionEnabled(context)) return

        LogManager.addLog(
            context,
            LogManager.LogType.SYSTEM,
            true,
            "Nhận tín hiệu khởi động máy (${intent.action})",
            "Đang tự động khởi chạy lại dịch vụ giám sát"
        )

        val serviceIntent = Intent(context, GuardService::class.java)
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O &&
                SettingsGuard.usePersistentNotification(context)
            ) {
                context.startForegroundService(serviceIntent)
            } else {
                context.startService(serviceIntent)
            }
        } catch (t: Throwable) {
            LogManager.addLog(
                context,
                LogManager.LogType.SYSTEM,
                false,
                "Không thể khởi động dịch vụ sau Boot",
                t.message ?: "",
                t.javaClass.simpleName
            )
        }
    }
}
