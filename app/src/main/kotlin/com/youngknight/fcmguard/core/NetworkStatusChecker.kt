package com.youngknight.fcmguard.core

import android.content.Context
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.os.Build

/**
 * Kiểm tra kết nối mạng thực tế qua ConnectivityManager.
 */
object NetworkStatusChecker {
    data class NetworkStatus(
        val isConnected: Boolean,
        val type: String,
        val isMetered: Boolean,
        val description: String
    )

    fun check(context: Context): NetworkStatus {
        val cm = context.getSystemService(Context.CONNECTIVITY_SERVICE) as? ConnectivityManager
            ?: return NetworkStatus(false, "Không rõ", false, "Không truy cập được ConnectivityManager")

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            val activeNetwork = cm.activeNetwork ?: return NetworkStatus(false, "Không có mạng", false, "Mất kết nối mạng")
            val caps = cm.getNetworkCapabilities(activeNetwork) ?: return NetworkStatus(false, "Không có mạng", false, "Không có khả năng kết nối")

            val type = when {
                caps.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) -> "Wi-Fi"
                caps.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) -> "Di động (LTE/5G)"
                caps.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET) -> "Ethernet"
                else -> "Mạng khác"
            }
            val hasInternet = caps.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET) &&
                    caps.hasCapability(NetworkCapabilities.NET_CAPABILITY_VALIDATED)

            return NetworkStatus(
                isConnected = hasInternet,
                type = type,
                isMetered = !caps.hasCapability(NetworkCapabilities.NET_CAPABILITY_NOT_METERED),
                description = if (hasInternet) "Đã kết nối ($type)" else "Mạng không có Internet"
            )
        } else {
            @Suppress("DEPRECATION")
            val netInfo = cm.activeNetworkInfo
            val isConnected = netInfo?.isConnected == true
            val type = netInfo?.typeName ?: "Không rõ"
            return NetworkStatus(
                isConnected = isConnected,
                type = type,
                isMetered = false,
                description = if (isConnected) "Đã kết nối ($type)" else "Mất kết nối mạng"
            )
        }
    }
}
