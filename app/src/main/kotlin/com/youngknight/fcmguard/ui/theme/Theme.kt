package com.youngknight.fcmguard.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val BgDarkNavy = Color(0xFF020914)
val SurfaceDarkNavy = Color(0xFF041224)
val SurfaceCard = Color(0xFF071930)
val CyanAccent = Color(0xFF06B6D4)
val CyanBright = Color(0xFF38BDF8)
val EmeraldStatus = Color(0xFF10B981)
val AmberWarning = Color(0xFFF59E0B)
val RoseError = Color(0xFFEF4444)
val TextMuted = Color(0xFF94A3B8)
val TextLight = Color(0xFFF8FAFC)

private val DarkColorScheme = darkColorScheme(
    primary = CyanAccent,
    onPrimary = Color(0xFF020914),
    primaryContainer = Color(0xFF082F49),
    onPrimaryContainer = Color(0xFFBAE6FD),
    secondary = CyanBright,
    onSecondary = Color(0xFF020914),
    background = BgDarkNavy,
    onBackground = TextLight,
    surface = SurfaceDarkNavy,
    onSurface = TextLight,
    surfaceVariant = SurfaceCard,
    onSurfaceVariant = TextMuted,
    outline = Color(0xFF0E3A5F)
)

@Composable
fun FcmGuardTheme(
    darkTheme: Boolean = true, // FCM Guard V2 đặc trưng nền xanh đen - cyan
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        content = content
    )
}
