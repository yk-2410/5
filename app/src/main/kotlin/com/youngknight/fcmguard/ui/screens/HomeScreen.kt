package com.youngknight.fcmguard.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.youngknight.fcmguard.core.*
import com.youngknight.fcmguard.ui.theme.*

@Composable
fun HomeScreen(
    gmsStatus: GmsStatusChecker.GmsStatus,
    networkStatus: NetworkStatusChecker.NetworkStatus,
    powerStatus: PowerStatusChecker.PowerStatus,
    isProtectionActive: Boolean,
    lastCheckedTime: String,
    whitelistValue: String?,
    hasWritePermission: Boolean,
    isChecking: Boolean,
    onRunCheckNow: () -> Unit,
    onRequestWritePermission: () -> Unit
) {
    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BgDarkNavy)
            .verticalScroll(scrollState)
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Hero Header Card with Status
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = SurfaceDarkNavy),
            shape = RoundedCornerShape(24.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF0C2B4E))
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(20.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Status Badge
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .background(if (isProtectionActive) Color(0xFF064E3B) else Color(0xFF7F1D1D))
                        .padding(horizontal = 12.dp, vertical = 6.dp)
                ) {
                    Icon(
                        imageVector = if (isProtectionActive) Icons.Default.CheckCircle else Icons.Default.Warning,
                        contentDescription = null,
                        tint = if (isProtectionActive) EmeraldStatus else RoseError,
                        modifier = Modifier.size(16.dp)
                    )
                    Text(
                        text = if (isProtectionActive) "Bảo vệ đang hoạt động" else "Chưa bật tự động bảo vệ",
                        color = Color.White,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                // YK Crest Graphic
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier
                        .size(110.dp)
                        .clip(CircleShape)
                        .background(
                            Brush.radialGradient(
                                listOf(Color(0xFF083358), Color(0xFF031428))
                            )
                        )
                        .border(2.dp, CyanAccent, CircleShape)
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "YK",
                            fontSize = 32.sp,
                            fontWeight = FontWeight.Black,
                            color = CyanBright
                        )
                        Text(
                            text = "FCM GUARD",
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextLight,
                            letterSpacing = 1.sp
                        )
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                Text(
                    text = "FCM Guard V2",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = Color.White
                )

                Text(
                    text = "Giữ kết nối FCM – Không lo mất thông báo",
                    fontSize = 12.sp,
                    color = TextMuted,
                    textAlign = TextAlign.Center
                )

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "Lần kiểm tra gần nhất: $lastCheckedTime",
                    fontSize = 11.sp,
                    color = CyanBright,
                    fontWeight = FontWeight.Medium
                )
            }
        }

        // Action Button: Kiểm tra & Sửa ngay
        Button(
            onClick = onRunCheckNow,
            enabled = !isChecking,
            modifier = Modifier
                .fillMaxWidth()
                .height(52.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = CyanAccent,
                contentColor = Color(0xFF020914)
            ),
            shape = RoundedCornerShape(26.dp)
        ) {
            Icon(
                imageVector = Icons.Default.FlashOn,
                contentDescription = null,
                modifier = Modifier.size(20.dp)
            )
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = if (isChecking) "Đang kiểm tra hệ thống..." else "Kiểm tra ngay",
                fontSize = 15.sp,
                fontWeight = FontWeight.Bold
            )
        }

        // Warning banner if WRITE_SETTINGS is missing
        if (!hasWritePermission) {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color(0xFF381E04)),
                shape = RoundedCornerShape(16.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, AmberWarning)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Icon(Icons.Default.Warning, contentDescription = null, tint = AmberWarning)
                        Text(
                            text = "Chưa cấp quyền Sửa Cài Đặt Hệ Thống",
                            fontWeight = FontWeight.Bold,
                            color = Color.White,
                            fontSize = 13.sp
                        )
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Android yêu cầu quyền WRITE_SETTINGS để có thể khôi phục Google Play services vào MILLET_NO_RESTRICT_APP khi bị xóa.",
                        fontSize = 11.sp,
                        color = Color(0xFFFDE68A)
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    TextButton(
                        onClick = onRequestWritePermission,
                        colors = ButtonDefaults.textButtonColors(contentColor = CyanBright)
                    ) {
                        Text(text = "Cấp quyền ngay trong Cài đặt >", fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        // Section Title
        Text(
            text = "Trạng thái các thành phần",
            fontSize = 14.sp,
            fontWeight = FontWeight.Bold,
            color = Color.White,
            modifier = Modifier.fillMaxWidth()
        )

        // 4 Real Status Cards
        // 1. GMS Status
        StatusItemCard(
            title = "Google Play Services (GMS)",
            subtitle = gmsStatus.description,
            isSuccess = gmsStatus.isInstalled && gmsStatus.isEnabled,
            icon = Icons.Default.Android
        )

        // 2. Network Status
        StatusItemCard(
            title = "Kết nối mạng",
            subtitle = networkStatus.description,
            isSuccess = networkStatus.isConnected,
            icon = Icons.Default.Wifi
        )

        // 3. Doze Status
        StatusItemCard(
            title = "Chế độ Doze & Tiết kiệm pin",
            subtitle = powerStatus.description,
            isSuccess = !powerStatus.isDeviceIdle && powerStatus.isIgnoringBatteryOptimizations,
            icon = Icons.Default.BatteryChargingFull
        )

        // 4. Whitelist System Status
        StatusItemCard(
            title = "Danh sách trắng MILLET_NO_RESTRICT_APP",
            subtitle = if (whitelistValue.isNullOrBlank()) "Chưa có dữ liệu" else "Đang chứa: $whitelistValue",
            isSuccess = whitelistValue?.contains("com.google.android.gms") == true,
            icon = Icons.Default.Shield
        )
    }
}

@Composable
fun StatusItemCard(
    title: String,
    subtitle: String,
    isSuccess: Boolean,
    icon: androidx.compose.ui.graphics.vector.ImageVector
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = SurfaceDarkNavy),
        shape = RoundedCornerShape(16.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF0A223D))
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.weight(1f)
            ) {
                Box(
                    modifier = Modifier
                        .size(38.dp)
                        .clip(CircleShape)
                        .background(if (isSuccess) Color(0xFF064E3B) else Color(0xFF451A03)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = icon,
                        contentDescription = null,
                        tint = if (isSuccess) EmeraldStatus else AmberWarning,
                        modifier = Modifier.size(20.dp)
                    )
                }

                Column {
                    Text(
                        text = title,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Color.White
                    )
                    Text(
                        text = subtitle,
                        fontSize = 11.sp,
                        color = TextMuted,
                        maxLines = 2
                    )
                }
            }

            Icon(
                imageVector = if (isSuccess) Icons.Default.Check else Icons.Default.PriorityHigh,
                contentDescription = null,
                tint = if (isSuccess) EmeraldStatus else AmberWarning,
                modifier = Modifier.size(18.dp)
            )
        }
    }
}
