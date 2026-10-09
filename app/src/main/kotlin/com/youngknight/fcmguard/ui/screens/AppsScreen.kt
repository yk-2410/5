package com.youngknight.fcmguard.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
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
import com.youngknight.fcmguard.core.FcmAppScanner
import com.youngknight.fcmguard.ui.theme.*

@Composable
fun AppsScreen(
    apps: List<FcmAppScanner.AppItem>,
    onOpenAppSettings: (String) -> Unit,
    onOpenAutostartSettings: () -> Unit
) {
    var searchQuery by remember { mutableStateOf("") }

    val filteredApps = remember(apps, searchQuery) {
        if (searchQuery.isBlank()) apps
        else apps.filter {
            it.label.contains(searchQuery, ignoreCase = true) ||
                    it.packageName.contains(searchQuery, ignoreCase = true)
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BgDarkNavy)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text(
            text = "Quản lý ứng dụng thông báo",
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold,
            color = Color.White
        )

        // Guide Banner
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = SurfaceDarkNavy),
            shape = RoundedCornerShape(14.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF0F3E68))
        ) {
            Column(modifier = Modifier.padding(12.dp)) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Icon(Icons.Default.Info, contentDescription = null, tint = CyanBright, modifier = Modifier.size(18.dp))
                    Text(
                        text = "Hướng dẫn thiết lập nền HyperOS",
                        fontWeight = FontWeight.Bold,
                        color = Color.White,
                        fontSize = 12.sp
                    )
                }
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "Để ứng dụng không bị HyperOS đóng ngầm khi tắt màn hình:\n" +
                            "1. Bật Tự khởi chạy (Autostart)\n" +
                            "2. Đặt Tiết kiệm pin thành \"Không hạn chế\"\n" +
                            "3. Bật thông báo & khóa ứng dụng trong màn hình Đa nhiệm",
                    fontSize = 11.sp,
                    color = TextMuted,
                    lineHeight = 16.sp
                )
                Spacer(modifier = Modifier.height(8.dp))
                Button(
                    onClick = onOpenAutostartSettings,
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF083358)),
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = "Mở Cài đặt Tự khởi chạy (Autostart) >",
                        fontSize = 11.sp,
                        color = CyanBright,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }

        // Search Box
        OutlinedTextField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            placeholder = { Text("Tìm ứng dụng hoặc gói package...", fontSize = 12.sp) },
            leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = TextMuted) },
            singleLine = true,
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedContainerColor = SurfaceDarkNavy,
                unfocusedContainerColor = SurfaceDarkNavy,
                focusedBorderColor = CyanAccent,
                unfocusedBorderColor = Color(0xFF0E3A5F),
                focusedTextColor = Color.White,
                unfocusedTextColor = Color.White
            )
        )

        // Apps List
        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(8.dp),
            modifier = Modifier.fillMaxSize()
        ) {
            items(filteredApps, key = { it.packageName }) { app ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = SurfaceDarkNavy),
                    shape = RoundedCornerShape(12.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF0A223D))
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(10.dp),
                            modifier = Modifier.weight(1f)
                        ) {
                            Text(text = app.iconRes, fontSize = 20.sp)
                            Column {
                                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                    Text(
                                        text = app.label,
                                        fontSize = 13.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = Color.White
                                    )
                                    if (app.isImportant) {
                                        Text(
                                            text = "Ưu tiên",
                                            fontSize = 9.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = CyanBright,
                                            modifier = Modifier
                                                .background(Color(0xFF064E3B), RoundedCornerShape(4.dp))
                                                .padding(horizontal = 4.dp, vertical = 1.dp)
                                        )
                                    }
                                }
                                Text(
                                    text = app.packageName,
                                    fontSize = 10.sp,
                                    color = TextMuted
                                )
                            }
                        }

                        IconButton(
                            onClick = { onOpenAppSettings(app.packageName) },
                            colors = IconButtonDefaults.iconButtonColors(containerColor = Color(0xFF071930))
                        ) {
                            Icon(
                                Icons.Default.Settings,
                                contentDescription = "Cài đặt ứng dụng",
                                tint = CyanBright,
                                modifier = Modifier.size(16.dp)
                            )
                        }
                    }
                }
            }
        }
    }
}
