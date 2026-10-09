package com.youngknight.fcmguard.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.youngknight.fcmguard.core.LogManager
import com.youngknight.fcmguard.ui.theme.*

@Composable
fun LogScreen(
    logs: List<LogManager.LogEntry>,
    onRefresh: () -> Unit,
    onClearLogs: () -> Unit
) {
    var selectedFilter by remember { mutableStateOf<LogManager.LogType?>(null) }

    val filteredLogs = remember(logs, selectedFilter) {
        if (selectedFilter == null) logs
        else logs.filter { it.type == selectedFilter }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BgDarkNavy)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // Top Action Bar
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column {
                Text(
                    text = "Nhật ký hoạt động",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
                Text(
                    text = "${filteredLogs.size} sự kiện ghi nhận",
                    fontSize = 11.sp,
                    color = TextMuted
                )
            }

            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                IconButton(
                    onClick = onRefresh,
                    colors = IconButtonDefaults.iconButtonColors(containerColor = SurfaceDarkNavy)
                ) {
                    Icon(Icons.Default.Refresh, contentDescription = "Làm mới", tint = CyanBright)
                }

                IconButton(
                    onClick = onClearLogs,
                    colors = IconButtonDefaults.iconButtonColors(containerColor = SurfaceDarkNavy)
                ) {
                    Icon(Icons.Default.DeleteOutline, contentDescription = "Xóa nhật ký", tint = RoseError)
                }
            }
        }

        // Filter Chips Row
        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            item {
                FilterChip(
                    selected = selectedFilter == null,
                    onClick = { selectedFilter = null },
                    label = { Text("Tất cả (${logs.size})") },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = CyanAccent,
                        selectedLabelColor = Color(0xFF020914)
                    )
                )
            }
            item {
                FilterChip(
                    selected = selectedFilter == LogManager.LogType.FCM,
                    onClick = { selectedFilter = LogManager.LogType.FCM },
                    label = { Text("FCM") },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = CyanAccent,
                        selectedLabelColor = Color(0xFF020914)
                    )
                )
            }
            item {
                FilterChip(
                    selected = selectedFilter == LogManager.LogType.GMS,
                    onClick = { selectedFilter = LogManager.LogType.GMS },
                    label = { Text("GMS") },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = CyanAccent,
                        selectedLabelColor = Color(0xFF020914)
                    )
                )
            }
            item {
                FilterChip(
                    selected = selectedFilter == LogManager.LogType.SYSTEM,
                    onClick = { selectedFilter = LogManager.LogType.SYSTEM },
                    label = { Text("Hệ thống") },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = CyanAccent,
                        selectedLabelColor = Color(0xFF020914)
                    )
                )
            }
            item {
                FilterChip(
                    selected = selectedFilter == LogManager.LogType.DOZE,
                    onClick = { selectedFilter = LogManager.LogType.DOZE },
                    label = { Text("Doze") },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = CyanAccent,
                        selectedLabelColor = Color(0xFF020914)
                    )
                )
            }
        }

        // Logs List
        if (filteredLogs.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(32.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "Chưa có sự kiện nào trong nhật ký.",
                    color = TextMuted,
                    fontSize = 13.sp
                )
            }
        } else {
            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                items(filteredLogs, key = { it.id }) { log ->
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
                            verticalAlignment = Alignment.Top,
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            // Status icon
                            Box(
                                modifier = Modifier
                                    .size(28.dp)
                                    .clip(CircleShape)
                                    .background(if (log.success) Color(0xFF064E3B) else Color(0xFF451A03)),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = if (log.success) Icons.Default.Check else Icons.Default.Warning,
                                    contentDescription = null,
                                    tint = if (log.success) EmeraldStatus else AmberWarning,
                                    modifier = Modifier.size(16.dp)
                                )
                            }

                            Column(modifier = Modifier.weight(1f)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(
                                        text = log.title,
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = Color.White
                                    )
                                    Text(
                                        text = log.timeFormatted,
                                        fontSize = 10.sp,
                                        color = TextMuted
                                    )
                                }

                                if (log.details.isNotBlank()) {
                                    Spacer(modifier = Modifier.height(2.dp))
                                    Text(
                                        text = log.details,
                                        fontSize = 11.sp,
                                        color = Color(0xFFCBD5E1)
                                    )
                                }

                                if (log.errorCode != null) {
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Text(
                                        text = "Mã lỗi: ${log.errorCode}",
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = RoseError
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
