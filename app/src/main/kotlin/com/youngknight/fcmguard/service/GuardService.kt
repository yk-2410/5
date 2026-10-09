package com.youngknight.fcmguard.service

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.database.ContentObserver
import android.net.Uri
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.provider.Settings
import com.youngknight.fcmguard.MainActivity
import com.youngknight.fcmguard.R
import com.youngknight.fcmguard.core.FcmReconnect
import com.youngknight.fcmguard.core.LogManager
import com.youngknight.fcmguard.core.SettingsGuard

/**
 * Dịch vụ tiền cảnh (Foreground Service) giám sát trạng thái whitelist hệ thống.
 * 
 * NGUYÊN TẮC HOẠT ĐỘNG:
 * - Dựa trên sự kiện ContentObserver (không lặp vô tận tiêu hao pin).
 * - Fallback 30 phút một lần không đánh thức máy (low power).
 * - Thông báo thường trực để duy trì vòng đời hợp lệ theo quy định Android.
 */
class GuardService : Service() {
    companion object {
        const val CHANNEL_ID = "fcm_guard_persistent_v2"
        const val NOTIFICATION_ID = 426
        private const val FALLBACK_INTERVAL_MS = 30L * 60L * 1000L

        fun ensureNotificationChannel(context: Context): Boolean {
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return false
            val nm = context.getSystemService(Context.NOTIFICATION_SERVICE) as? NotificationManager ?: return false
            if (nm.getNotificationChannel(CHANNEL_ID) != null) return false

            val channel = NotificationChannel(
                CHANNEL_ID,
                context.getString(R.string.notification_channel_name),
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = context.getString(R.string.notification_channel_description)
                setShowBadge(false)
                enableVibration(false)
                enableLights(false)
                setSound(null, null)
                lockscreenVisibility = Notification.VISIBILITY_PRIVATE
            }
            nm.createNotificationChannel(channel)
            return true
        }
    }

    private val handler = Handler(Looper.getMainLooper())
    private var observer: ContentObserver? = null
    private var isForeground = false

    private val fallbackCheck = object : Runnable {
        override fun run() {
            performCheck(notifyFailure = false)
            handler.postDelayed(this, FALLBACK_INTERVAL_MS)
        }
    }

    private val repairDebounced = Runnable {
        performCheck(notifyFailure = true)
    }

    override fun onCreate() {
        super.onCreate()
        ensureNotificationChannel(this)
        applyExecutionMode()
        registerObserver()
        SettingsGuard.rememberIfUseful(this, SettingsGuard.readWhitelist(this))
        handler.post(fallbackCheck)
        LogManager.addLog(
            this,
            LogManager.LogType.SYSTEM,
            true,
            "Dịch vụ giám sát khởi động",
            "Đã đăng ký ContentObserver theo dõi MILLET_NO_RESTRICT_APP"
        )
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        SettingsGuard.setProtectionEnabled(this, true)
        registerObserver()
        applyExecutionMode()
        handler.removeCallbacks(fallbackCheck)
        handler.post(fallbackCheck)
        return START_STICKY
    }

    private fun performCheck(notifyFailure: Boolean) {
        val result = SettingsGuard.repair(this)
        if (result.changed) {
            FcmReconnect.sendHeartbeat(this)
            LogManager.addLog(
                this,
                LogManager.LogType.GMS,
                true,
                "Đã khôi phục GMS vào whitelist",
                result.message
            )
            if (isForeground) refreshNotification("Whitelist đã được khôi phục")
        } else if (!result.success) {
            LogManager.addLog(
                this,
                LogManager.LogType.SYSTEM,
                false,
                "Kiểm tra thất bại",
                result.message,
                result.errorCode
            )
            if (notifyFailure && isForeground) {
                refreshNotification(result.message)
            }
        }
    }

    private fun registerObserver() {
        val resolver = contentResolver
        try {
            observer?.let { resolver.unregisterContentObserver(it) }
        } catch (ignored: Throwable) {}

        observer = object : ContentObserver(handler) {
            override fun onChange(selfChange: Boolean, uri: Uri?) {
                handler.removeCallbacks(repairDebounced)
                handler.postDelayed(repairDebounced, 400L)
            }
        }

        try {
            val key = SettingsGuard.getConfiguredKey(this)
            val uri = Settings.System.getUriFor(key)
            if (uri != null) {
                resolver.registerContentObserver(uri, false, observer!!)
            }
        } catch (t: Throwable) {
            LogManager.addLog(
                this,
                LogManager.LogType.SYSTEM,
                false,
                "Không thể đăng ký ContentObserver",
                t.message ?: "",
                t.javaClass.simpleName
            )
        }
    }

    private fun applyExecutionMode() {
        if (SettingsGuard.usePersistentNotification(this)) {
            ensureNotificationChannel(this)
            startForeground(NOTIFICATION_ID, buildNotification(getString(R.string.notification_active)))
            isForeground = true
        } else {
            if (isForeground) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                    stopForeground(STOP_FOREGROUND_REMOVE)
                } else {
                    @Suppress("DEPRECATION")
                    stopForeground(true)
                }
            }
            val nm = getSystemService(NOTIFICATION_SERVICE) as? NotificationManager
            nm?.cancel(NOTIFICATION_ID)
            isForeground = false
        }
    }

    private fun refreshNotification(text: String) {
        if (!isForeground) return
        val nm = getSystemService(NOTIFICATION_SERVICE) as? NotificationManager
        nm?.notify(NOTIFICATION_ID, buildNotification(text))
    }

    private fun buildNotification(text: String): Notification {
        val openIntent = Intent(this, MainActivity::class.java)
        val pi = PendingIntent.getActivity(
            this,
            0,
            openIntent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        val builder = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            Notification.Builder(this, CHANNEL_ID)
        } else {
            @Suppress("DEPRECATION")
            Notification.Builder(this).setPriority(Notification.PRIORITY_LOW)
        }

        return builder
            .setSmallIcon(android.R.drawable.stat_notify_sync_noanim)
            .setContentTitle(getString(R.string.app_name))
            .setContentText(text)
            .setContentIntent(pi)
            .setCategory(Notification.CATEGORY_SERVICE)
            .setVisibility(Notification.VISIBILITY_PRIVATE)
            .setOngoing(true)
            .setOnlyAlertOnce(true)
            .setShowWhen(false)
            .build()
    }

    override fun onDestroy() {
        handler.removeCallbacksAndMessages(null)
        try {
            observer?.let { contentResolver.unregisterContentObserver(it) }
        } catch (ignored: Throwable) {}
        LogManager.addLog(
            this,
            LogManager.LogType.SYSTEM,
            true,
            "Dịch vụ giám sát đã dừng",
            "Tự động bảo vệ tạm dừng"
        )
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
