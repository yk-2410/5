package com.youngknight.fcmguard

import android.content.Intent
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.youngknight.fcmguard.core.*
import com.youngknight.fcmguard.service.GuardService
import com.youngknight.fcmguard.ui.screens.*
import com.youngknight.fcmguard.ui.theme.*
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class MainActivity : ComponentActivity() {

    enum class NavTab {
        HOME,
        LOG,
        APPS,
        SETTINGS,
        ABOUT
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            FcmGuardTheme {
                var currentTab by remember { mutableStateOf(NavTab.HOME) }
                var lastCheckedTime by remember {
                    mutableStateOf(SimpleDateFormat("HH:mm:ss dd/MM", Locale.getDefault()).format(Date()))
                }
                var isChecking by remember { mutableStateOf(false) }

                // State
                var gmsStatus by remember { mutableStateOf(GmsStatusChecker.check(this@MainActivity)) }
                var networkStatus by remember { mutableStateOf(NetworkStatusChecker.check(this@MainActivity)) }
                var powerStatus by remember { mutableStateOf(PowerStatusChecker.check(this@MainActivity)) }
                var isProtectionActive by remember { mutableStateOf(SettingsGuard.isProtectionEnabled(this@MainActivity)) }
                var usePersistentNotification by remember { mutableStateOf(SettingsGuard.usePersistentNotification(this@MainActivity)) }
                var whitelistValue by remember { mutableStateOf(SettingsGuard.readWhitelist(this@MainActivity)) }
                var hasWritePermission by remember { mutableStateOf(SettingsGuard.canWriteSettings(this@MainActivity)) }

                var logs by remember { mutableStateOf(LogManager.getLogs(this@MainActivity)) }
                var apps by remember { mutableStateOf(FcmAppScanner.scan(this@MainActivity)) }

                val refreshAll = {
                    gmsStatus = GmsStatusChecker.check(this@MainActivity)
                    networkStatus = NetworkStatusChecker.check(this@MainActivity)
                    powerStatus = PowerStatusChecker.check(this@MainActivity)
                    isProtectionActive = SettingsGuard.isProtectionEnabled(this@MainActivity)
                    usePersistentNotification = SettingsGuard.usePersistentNotification(this@MainActivity)
                    whitelistValue = SettingsGuard.readWhitelist(this@MainActivity)
                    hasWritePermission = SettingsGuard.canWriteSettings(this@MainActivity)
                    logs = LogManager.getLogs(this@MainActivity)
                }

                val runCheckNow = {
                    isChecking = true
                    val result = SettingsGuard.repair(this@MainActivity)
                    FcmReconnect.sendHeartbeat(this@MainActivity)
                    lastCheckedTime = SimpleDateFormat("HH:mm:ss dd/MM", Locale.getDefault()).format(Date())

                    LogManager.addLog(
                        this@MainActivity,
                        if (result.success) LogManager.LogType.GMS else LogManager.LogType.SYSTEM,
                        result.success,
                        if (result.success) "Kiểm tra hoàn tất: GMS an toàn" else "Kiểm tra: Cần cấp quyền",
                        result.message,
                        result.errorCode
                    )
                    refreshAll()
                    isChecking = false
                }

                Scaffold(
                    bottomBar = {
                        NavigationBar(
                            containerColor = SurfaceDarkNavy,
                            contentColor = CyanBright,
                            tonalElevation = 8.dp
                        ) {
                            NavigationBarItem(
                                selected = currentTab == NavTab.HOME,
                                onClick = { currentTab = NavTab.HOME },
                                icon = { Icon(Icons.Default.Shield, contentDescription = "Trang chủ") },
                                label = { Text("Trang chủ", fontSize = 10.sp) },
                                colors = NavigationBarItemDefaults.colors(
                                    selectedIconColor = CyanAccent,
                                    selectedTextColor = CyanAccent,
                                    indicatorColor = Color(0xFF082F49),
                                    unselectedIconColor = TextMuted,
                                    unselectedTextColor = TextMuted
                                )
                            )

                            NavigationBarItem(
                                selected = currentTab == NavTab.LOG,
                                onClick = {
                                    refreshAll()
                                    currentTab = NavTab.LOG
                                },
                                icon = { Icon(Icons.Default.ListAlt, contentDescription = "Nhật ký") },
                                label = { Text("Nhật ký", fontSize = 10.sp) },
                                colors = NavigationBarItemDefaults.colors(
                                    selectedIconColor = CyanAccent,
                                    selectedTextColor = CyanAccent,
                                    indicatorColor = Color(0xFF082F49),
                                    unselectedIconColor = TextMuted,
                                    unselectedTextColor = TextMuted
                                )
                            )

                            NavigationBarItem(
                                selected = currentTab == NavTab.APPS,
                                onClick = {
                                    apps = FcmAppScanner.scan(this@MainActivity)
                                    currentTab = NavTab.APPS
                                },
                                icon = { Icon(Icons.Default.Apps, contentDescription = "Ứng dụng") },
                                label = { Text("Ứng dụng", fontSize = 10.sp) },
                                colors = NavigationBarItemDefaults.colors(
                                    selectedIconColor = CyanAccent,
                                    selectedTextColor = CyanAccent,
                                    indicatorColor = Color(0xFF082F49),
                                    unselectedIconColor = TextMuted,
                                    unselectedTextColor = TextMuted
                                )
                            )

                            NavigationBarItem(
                                selected = currentTab == NavTab.SETTINGS,
                                onClick = { currentTab = NavTab.SETTINGS },
                                icon = { Icon(Icons.Default.Settings, contentDescription = "Cài đặt") },
                                label = { Text("Cài đặt", fontSize = 10.sp) },
                                colors = NavigationBarItemDefaults.colors(
                                    selectedIconColor = CyanAccent,
                                    selectedTextColor = CyanAccent,
                                    indicatorColor = Color(0xFF082F49),
                                    unselectedIconColor = TextMuted,
                                    unselectedTextColor = TextMuted
                                )
                            )

                            NavigationBarItem(
                                selected = currentTab == NavTab.ABOUT,
                                onClick = { currentTab = NavTab.ABOUT },
                                icon = { Icon(Icons.Default.Info, contentDescription = "Giới thiệu") },
                                label = { Text("Giới thiệu", fontSize = 10.sp) },
                                colors = NavigationBarItemDefaults.colors(
                                    selectedIconColor = CyanAccent,
                                    selectedTextColor = CyanAccent,
                                    indicatorColor = Color(0xFF082F49),
                                    unselectedIconColor = TextMuted,
                                    unselectedTextColor = TextMuted
                                )
                            )
                        }
                    }
                ) { innerPadding ->
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(innerPadding)
                            .background(BgDarkNavy)
                    ) {
                        when (currentTab) {
                            NavTab.HOME -> HomeScreen(
                                gmsStatus = gmsStatus,
                                networkStatus = networkStatus,
                                powerStatus = powerStatus,
                                isProtectionActive = isProtectionActive,
                                lastCheckedTime = lastCheckedTime,
                                whitelistValue = whitelistValue,
                                hasWritePermission = hasWritePermission,
                                isChecking = isChecking,
                                onRunCheckNow = runCheckNow,
                                onRequestWritePermission = {
                                    HyperOsSettings.openWriteSettingsPermission(this@MainActivity)
                                }
                            )

                            NavTab.LOG -> LogScreen(
                                logs = logs,
                                onRefresh = { logs = LogManager.getLogs(this@MainActivity) },
                                onClearLogs = {
                                    LogManager.clearLogs(this@MainActivity)
                                    logs = emptyList()
                                }
                            )

                            NavTab.APPS -> AppsScreen(
                                apps = apps,
                                onOpenAppSettings = { pkg ->
                                    HyperOsSettings.openAppDetails(this@MainActivity, pkg)
                                },
                                onOpenAutostartSettings = {
                                    HyperOsSettings.openAutoStartManager(this@MainActivity)
                                }
                            )

                            NavTab.SETTINGS -> SettingsScreen(
                                isProtectionEnabled = isProtectionActive,
                                onToggleProtection = { enabled ->
                                    SettingsGuard.setProtectionEnabled(this@MainActivity, enabled)
                                    isProtectionActive = enabled
                                    val serviceIntent = Intent(this@MainActivity, GuardService::class.java)
                                    if (enabled) {
                                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O &&
                                            SettingsGuard.usePersistentNotification(this@MainActivity)
                                        ) {
                                            startForegroundService(serviceIntent)
                                        } else {
                                            startService(serviceIntent)
                                        }
                                    } else {
                                        stopService(serviceIntent)
                                    }
                                    refreshAll()
                                },
                                usePersistentNotification = usePersistentNotification,
                                onTogglePersistentNotification = { enabled ->
                                    SettingsGuard.setPersistentNotification(this@MainActivity, enabled)
                                    usePersistentNotification = enabled
                                    if (isProtectionActive) {
                                        val serviceIntent = Intent(this@MainActivity, GuardService::class.java)
                                        startService(serviceIntent)
                                    }
                                    refreshAll()
                                },
                                hasWriteSettingsPermission = hasWritePermission,
                                onRequestWriteSettings = {
                                    HyperOsSettings.openWriteSettingsPermission(this@MainActivity)
                                },
                                onOpenBatterySettings = {
                                    HyperOsSettings.openBatteryOptimizationSettings(this@MainActivity)
                                },
                                onOpenNotificationSettings = {
                                    HyperOsSettings.openNotificationSettings(this@MainActivity)
                                },
                                onSendManualHeartbeat = {
                                    val count = FcmReconnect.sendHeartbeat(this@MainActivity)
                                    LogManager.addLog(
                                        this@MainActivity,
                                        LogManager.LogType.FCM,
                                        true,
                                        "Đã phát broadcast nhịp tim",
                                        "Đã gửi tới $count gói dịch vụ Google"
                                    )
                                    refreshAll()
                                }
                            )

                            NavTab.ABOUT -> AboutScreen()
                        }
                    }
                }
            }
        }
    }

    override fun onResume() {
        super.onResume()
        // Cập nhật lại quyền khi người dùng quay lại từ Cài đặt hệ thống
        if (SettingsGuard.isProtectionEnabled(this) &&
            SettingsGuard.usePersistentNotification(this)
        ) {
            val serviceIntent = Intent(this, GuardService::class.java)
            try {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    startForegroundService(serviceIntent)
                } else {
                    startService(serviceIntent)
                }
            } catch (ignored: Throwable) {}
        }
    }
}
