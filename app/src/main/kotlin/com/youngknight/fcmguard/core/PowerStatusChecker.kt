package com.youngknight.fcmguard.core

import android.content.Context
import android.os.Build
import android.os.PowerManager

/**
 * Kiểm tra chế độ Doze và trạng thái tối ưu pin hệ thống Android / HyperOS.
 */
object PowerStatusChecker {
    data class PowerStatus(
        val isDeviceIdle: Boolean,
        val isIgnoringBatteryOptimizations: Boolean,
        val description: String
    )

    fun check(context: Context): PowerStatus {
        val pm = context.getSystemService(Context.POWER_SERVICE) as? PowerManager
            ?: return PowerStatus(false, false, "Không truy cập được PowerManager")

        val isIdle = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            pm.isDeviceIdleMode
        } else {
            false
        }

        val isIgnoringOpt = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            pm.isIgnoringBatteryOptimizations(context.packageName)
        } else {
            true
        }

        val desc = when {
            isIdle -> "Doze đang hoạt động (Thiết bị đang ngủ sâu)"
            !isIgnoringOpt -> "Chưa tắt tối ưu pin (HyperOS có thể hạn chế chạy ngầm)"
            else -> "Bình thường (Đã bật Không hạn chế pin)"
        }

        return PowerStatus(
            isDeviceIdle = isIdle,
            isIgnoringBatteryOptimizations = isIgnoringOpt,
            description = desc
        )
    }
}
