package com.youngknight.fcmguard.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.youngknight.fcmguard.ui.theme.*

@Composable
fun SettingsScreen(
    isProtectionEnabled: Boolean,
    onToggleProtection: (Boolean) -> Unit,
    usePersistentNotification: Boolean,
    onTogglePersistentNotification: (Boolean) -> Unit,
    hasWriteSettingsPermission: Boolean,
    onRequestWriteSettings: () -> Unit,
    onOpenBatterySettings: () -> Unit,
    onOpenNotificationSettings: () -> Unit,
    onSendManualHeartbeat: () -> Unit
) {
    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BgDarkNavy)
            .verticalScroll(scrollState)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text(
            text = "Cài đặt & Tùy chọn",
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold,
            color = Color.White
        )

        // Section 1: Giám sát cốt lõi
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = SurfaceDarkNavy),
            shape = RoundedCornerShape(16.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF0C2B4E))
        ) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
                Text(
                    text = "Giám sát & Dịch vụ",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = CyanBright
                )

                // Switch 1: Tự động bảo vệ
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "Tự động bảo vệ",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = Color.White
                        )
                        Text(
                            text = "Lắng nghe sự kiện thay đổi whitelist và kiểm tra dự phòng 30 phút/lần",
                            fontSize = 11.sp,
                            color = TextMuted
                        )
                    }
                    Switch(
                        checked = isProtectionEnabled,
                        onCheckedChange = onToggleProtection,
                        colors = SwitchDefaults.colors(
                            checkedThumbColor = Color.White,
                            checkedTrackColor = CyanAccent
                        )
                    )
                }

                Divider(color = Color(0xFF0F355C))

                // Switch 2: Thông báo thường trực
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "Thông báo thường trực (Foreground Service)",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = Color.White
                        )
                        Text(
                            text = "Khuyến nghị BẬT để duy trì dịch vụ bền bỉ, tránh bị HyperOS đóng ngầm",
                            fontSize = 11.sp,
                            color = TextMuted
                        )
                    }
                    Switch(
                        checked = usePersistentNotification,
                        onCheckedChange = onTogglePersistentNotification,
                        colors = SwitchDefaults.colors(
                            checkedThumbColor = Color.White,
                            checkedTrackColor = CyanAccent
                        )
                    )
                }
            }
        }

        // Section 2: Quyền & Hệ thống Android
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = SurfaceDarkNavy),
            shape = RoundedCornerShape(16.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF0C2B4E))
        ) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text(
                    text = "Quyền hệ thống & Tối ưu",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = CyanBright
                )

                // Item 1: Sửa cài đặt hệ thống
                SettingActionRow(
                    title = "Quyền sửa cài đặt hệ thống (WRITE_SETTINGS)",
                    subtitle = if (hasWriteSettingsPermission) "Đã được cấp quyền" else "Chưa được cấp quyền (Cần thiết)",
                    statusColor = if (hasWriteSettingsPermission) EmeraldStatus else AmberWarning,
                    onClick = onRequestWriteSettings
                )

                Divider(color = Color(0xFF0F355C))

                // Item 2: Tối ưu pin
                SettingActionRow(
                    title = "Cài đặt tối ưu hóa pin",
                    subtitle = "Đặt Không hạn chế để dịch vụ giám sát không bị tạm dừng",
                    statusColor = TextMuted,
                    onClick = onOpenBatterySettings
                )

                Divider(color = Color(0xFF0F355C))

                // Item 3: Cài đặt thông báo
                SettingActionRow(
                    title = "Cài đặt thông báo ứng dụng",
                    subtitle = "Quản lý hiển thị thông báo thường trực trên thanh trạng thái",
                    statusColor = TextMuted,
                    onClick = onOpenNotificationSettings
                )
            }
        }

        // Section 3: Công cụ thủ công
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = SurfaceDarkNavy),
            shape = RoundedCornerShape(16.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF0C2B4E))
        ) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text(
                    text = "Công cụ kiểm tra",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = CyanBright
                )

                Button(
                    onClick = onSendManualHeartbeat,
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0C3D66)),
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(Icons.Default.Send, contentDescription = null, tint = CyanBright, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Phát Broadcast nhịp tim FCM (GMS/GSF)",
                        fontSize = 12.sp,
                        color = Color.White,
                        fontWeight = FontWeight.SemiBold
                    )
                }
            }
        }
    }
}

@Composable
fun SettingActionRow(
    title: String,
    subtitle: String,
    statusColor: Color,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = title,
                fontSize = 13.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color.White
            )
            Text(
                text = subtitle,
                fontSize = 11.sp,
                color = statusColor
            )
        }
        TextButton(onClick = onClick) {
            Text(text = "Mở >", color = CyanBright, fontSize = 12.sp, fontWeight = FontWeight.Bold)
        }
    }
}
