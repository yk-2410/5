package com.youngknight.fcmguard.core

import android.content.Context
import android.content.SharedPreferences
import android.provider.Settings
import com.youngknight.fcmguard.R
import java.util.LinkedHashSet

/**
 * Quản lý danh sách whitelist hệ thống MILLET_NO_RESTRICT_APP.
 * 
 * NGUYÊN TẮC TRUNG THỰC:
 * - Kiểm tra chính xác quyền [Settings.System.canWrite].
 * - Nếu không có quyền, trả về lỗi rõ ràng và KHÔNG giả vờ thao tác thành công.
 * - Hướng dẫn người dùng cấp quyền qua Settings.ACTION_MANAGE_WRITE_SETTINGS.
 */
object SettingsGuard {
    const val PREFS = "guard_state"
    const val PREF_ENABLED = "enabled"
    const val PREF_PERSISTENT_NOTIFICATION = "persistent_notification"
    private const val LAST_GOOD_PREFIX = "last_good_"

    const val DEFAULT_KEY = "MILLET_NO_RESTRICT_APP"
    const val DEFAULT_REQUIRED_ITEM = "com.google.android.gms"

    fun getConfiguredKey(context: Context): String {
        return context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            .getString("settings_key", DEFAULT_KEY) ?: DEFAULT_KEY
    }

    fun getConfiguredRequiredItem(context: Context): String {
        return context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            .getString("required_item", DEFAULT_REQUIRED_ITEM) ?: DEFAULT_REQUIRED_ITEM
    }

    fun isProtectionEnabled(context: Context): Boolean {
        return context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            .getBoolean(PREF_ENABLED, false)
    }

    fun setProtectionEnabled(context: Context, enabled: Boolean) {
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            .edit().putBoolean(PREF_ENABLED, enabled).apply()
    }

    fun usePersistentNotification(context: Context): Boolean {
        return context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            .getBoolean(PREF_PERSISTENT_NOTIFICATION, true)
    }

    fun setPersistentNotification(context: Context, enabled: Boolean) {
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            .edit().putBoolean(PREF_PERSISTENT_NOTIFICATION, enabled).apply()
    }

    fun canWriteSettings(context: Context): Boolean {
        return Settings.System.canWrite(context)
    }

    fun readWhitelist(context: Context): String? {
        return try {
            Settings.System.getString(context.contentResolver, getConfiguredKey(context))
        } catch (t: Throwable) {
            null
        }
    }

    fun hasRequiredItem(context: Context, value: String?): Boolean {
        val required = getConfiguredRequiredItem(context).trim()
        if (required.isEmpty() || value.isNullOrBlank()) return false
        return value.split(",").any { it.trim() == required }
    }

    /**
     * Khôi phục hoặc thêm Google Play Services vào danh sách trắng.
     * Trả về kết quả trung thực với trạng thái quyền và chi tiết lỗi.
     */
    @Synchronized
    fun repair(context: Context): RepairResult {
        if (!canWriteSettings(context)) {
            val current = readWhitelist(context)
            return RepairResult(
                success = false,
                changed = false,
                currentValue = current,
                message = "Chưa được cấp quyền sửa cài đặt hệ thống (WRITE_SETTINGS). Cần người dùng cấp quyền trong Cài đặt.",
                errorCode = "PERMISSION_DENIED"
            )
        }

        val key = getConfiguredKey(context)
        val required = getConfiguredRequiredItem(context).trim()
        val current = readWhitelist(context)

        if (hasRequiredItem(context, current)) {
            rememberIfUseful(context, current)
            return RepairResult(
                success = true,
                changed = false,
                currentValue = current,
                message = "Google Play services đã có sẵn trong danh sách trắng ($key).",
                errorCode = null
            )
        }

        val packages = parse(current)
        val prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        if (packages.isEmpty()) {
            packages.addAll(parse(prefs.getString(LAST_GOOD_PREFIX + key, null)))
        }
        if (packages.isEmpty()) {
            packages.add("com.tencent.mm")
            packages.add("com.android.vending")
        }
        if (required.isNotEmpty()) {
            packages.add(required)
        }

        val repaired = join(packages)
        return try {
            val ok = Settings.System.putString(context.contentResolver, key, repaired)
            if (ok) {
                saveLastGoodIfChanged(prefs, key, repaired)
                RepairResult(
                    success = true,
                    changed = true,
                    currentValue = repaired,
                    message = "Đã thêm $required vào danh sách $key thành công.",
                    errorCode = null
                )
            } else {
                RepairResult(
                    success = false,
                    changed = false,
                    currentValue = current,
                    message = "Hệ thống HyperOS từ chối ghi cài đặt (Write rejected).",
                    errorCode = "SYSTEM_REJECTED"
                )
            }
        } catch (t: Throwable) {
            RepairResult(
                success = false,
                changed = false,
                currentValue = current,
                message = "Lỗi khi ghi cài đặt: ${t.javaClass.simpleName} - ${t.message}",
                errorCode = t.javaClass.simpleName
            )
        }
    }

    fun rememberIfUseful(context: Context, current: String?) {
        if (current.isNullOrBlank()) return
        val key = getConfiguredKey(context)
        val packages = parse(current)
        if (packages.isEmpty()) return
        val normalized = join(packages)
        val prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        saveLastGoodIfChanged(prefs, key, normalized)
    }

    private fun saveLastGoodIfChanged(prefs: SharedPreferences, key: String, value: String) {
        val prefKey = LAST_GOOD_PREFIX + key
        val old = prefs.getString(prefKey, null)
        if (value != old) {
            prefs.edit().putString(prefKey, value).apply()
        }
    }

    private fun parse(value: String?): LinkedHashSet<String> {
        val out = LinkedHashSet<String>()
        if (value == null) return out
        for (part in value.split(",")) {
            val p = part.trim()
            if (p.isNotEmpty()) out.add(p)
        }
        return out
    }

    private fun join(items: Set<String>): String {
        return items.joinToString(",")
    }

    data class RepairResult(
        val success: Boolean,
        val changed: Boolean,
        val currentValue: String?,
        val message: String,
        val errorCode: String?
    )
}
