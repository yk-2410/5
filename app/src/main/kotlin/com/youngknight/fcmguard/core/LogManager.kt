package com.youngknight.fcmguard.core

import android.content.Context
import android.content.SharedPreferences
import org.json.JSONArray
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/**
 * Quản lý nhật ký hoạt động có cấu trúc:
 * - Thời gian (Timestamp)
 * - Loại sự kiện (Hệ thống, FCM, GMS, Doze)
 * - Kết quả (Thành công / Cảnh báo / Lỗi)
 * - Chi tiết thông báo và lỗi
 */
object LogManager {
    private const val PREFS = "fcm_guard_logs"
    private const val KEY_ENTRIES = "entries"
    private const val MAX_LOGS = 100

    enum class LogType {
        SYSTEM,
        FCM,
        GMS,
        DOZE
    }

    data class LogEntry(
        val id: String,
        val timestamp: Long,
        val timeFormatted: String,
        val type: LogType,
        val success: Boolean,
        val title: String,
        val details: String = "",
        val errorCode: String? = null
    )

    private val timeFormat = SimpleDateFormat("HH:mm:ss dd/MM", Locale.getDefault())

    fun getLogs(context: Context): List<LogEntry> {
        val prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        val raw = prefs.getString(KEY_ENTRIES, "[]") ?: "[]"
        val list = mutableListOf<LogEntry>()
        try {
            val arr = JSONArray(raw)
            for (i in 0 until arr.length()) {
                val obj = arr.getJSONObject(i)
                list.add(
                    LogEntry(
                        id = obj.optString("id", "${obj.optLong("time")}_$i"),
                        timestamp = obj.optLong("time"),
                        timeFormatted = obj.optString("formatted"),
                        type = LogType.valueOf(obj.optString("type", "SYSTEM")),
                        success = obj.optBoolean("success", true),
                        title = obj.optString("title"),
                        details = obj.optString("details", ""),
                        errorCode = obj.optString("err", null).takeIf { it != "null" && !it.isNullOrBlank() }
                    )
                )
            }
        } catch (t: Throwable) {
            // fallback
        }
        return list
    }

    fun addLog(
        context: Context,
        type: LogType,
        success: Boolean,
        title: String,
        details: String = "",
        errorCode: String? = null
    ) {
        val prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        val existing = getLogs(context).toMutableList()
        val now = System.currentTimeMillis()
        val newEntry = LogEntry(
            id = "${now}_${existing.size}",
            timestamp = now,
            timeFormatted = timeFormat.format(Date(now)),
            type = type,
            success = success,
            title = title,
            details = details,
            errorCode = errorCode
        )
        existing.add(0, newEntry)
        if (existing.size > MAX_LOGS) {
            existing.subList(MAX_LOGS, existing.size).clear()
        }

        val arr = JSONArray()
        for (item in existing) {
            val obj = JSONObject()
            obj.put("id", item.id)
            obj.put("time", item.timestamp)
            obj.put("formatted", item.timeFormatted)
            obj.put("type", item.type.name)
            obj.put("success", item.success)
            obj.put("title", item.title)
            obj.put("details", item.details)
            obj.put("err", item.errorCode)
            arr.put(obj)
        }
        prefs.edit().putString(KEY_ENTRIES, arr.toString()).apply()
    }

    fun clearLogs(context: Context) {
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            .edit().remove(KEY_ENTRIES).apply()
    }
}
