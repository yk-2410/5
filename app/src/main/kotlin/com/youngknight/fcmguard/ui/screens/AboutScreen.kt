package com.youngknight.fcmguard.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.youngknight.fcmguard.ui.theme.*

@Composable
fun AboutScreen() {
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
        // Logo & Title
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier
                .size(100.dp)
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
                    fontSize = 30.sp,
                    fontWeight = FontWeight.Black,
                    color = CyanBright
                )
                Text(
                    text = "FCM GUARD",
                    fontSize = 8.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextLight,
                    letterSpacing = 1.sp
                )
            }
        }

        Text(
            text = "FCM Guard V2",
            fontSize = 22.sp,
            fontWeight = FontWeight.ExtraBold,
            color = Color.White
        )

        Text(
            text = "Phiên bản: 2.0.0 (Build 40) • Nâng cấp Jetpack Compose",
            fontSize = 12.sp,
            color = CyanBright,
            fontWeight = FontWeight.Medium
        )

        Text(
            text = "Tác giả: YOUNGKNIGHT",
            fontSize = 13.sp,
            fontWeight = FontWeight.Bold,
            color = Color.White
        )

        // Information Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = SurfaceDarkNavy),
            shape = RoundedCornerShape(16.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF0C2B4E))
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Text(
                    text = "Thông tin & Cam kết an toàn",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = CyanBright
                )

                AboutItemRow(label = "Nền tảng mục tiêu", value = "Xiaomi HyperOS / China ROM & Android")
                AboutItemRow(label = "Yêu cầu quyền", value = "Không Root • Không Shizuku")
                AboutItemRow(label = "Ngôn ngữ phát triển", value = "Kotlin • Jetpack Compose • Material 3")
                AboutItemRow(label = "Kiến trúc", value = "Event-driven ContentObserver + Foreground Service")
            }
        }

        // Transparency & Technical Limitations Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = SurfaceDarkNavy),
            shape = RoundedCornerShape(16.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF0C2B4E))
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Icon(Icons.Default.Info, contentDescription = null, tint = CyanBright, modifier = Modifier.size(18.dp))
                    Text(
                        text = "Tính trung thực & Giới hạn hệ thống",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                }

                Text(
                    text = "• Không có ứng dụng bên thứ ba nào có thể đảm bảo ngăn HyperOS đóng ứng dụng trong mọi trường hợp nếu ROM quyết định giải phóng RAM.\n\n" +
                            "• Ứng dụng không sử dụng API ẩn nguy hiểm hay quyền hệ thống không được cấp phép.\n\n" +
                            "• Mọi thao tác ghi thiết lập (WRITE_SETTINGS) chỉ thực hiện khi người dùng đã cấp quyền rõ ràng trong Cài đặt hệ thống.\n\n" +
                            "• Trạng thái kết nối FCM được giám sát qua các chỉ số hợp lệ (GMS, Network, Doze); ứng dụng không đưa ra khẳng định kết nối sai lệch.",
                    fontSize = 11.sp,
                    color = TextMuted,
                    lineHeight = 16.sp
                )
            }
        }

        // Footer slogan
        Text(
            text = "“Vì những thông báo quan trọng của bạn!” — YOUNGKNIGHT",
            fontSize = 12.sp,
            fontStyle = androidx.compose.ui.text.font.FontStyle.Italic,
            color = CyanBright,
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(vertical = 8.dp)
        )
    }
}

@Composable
fun AboutItemRow(label: String, value: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(text = label, fontSize = 12.sp, color = TextMuted)
        Text(text = value, fontSize = 12.sp, color = Color.White, fontWeight = FontWeight.Medium)
    }
}
