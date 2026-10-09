# FCM Guard V2 - Bản Ghi Nâng Cấp Mã Nguồn (Migration Log)

**Tác giả:** YOUNGKNIGHT  
**Tên ứng dụng:** FCM Guard V2  
**Mã gói (Package):** `com.youngknight.fcmguard`  
**Phiên bản:** 2.0.0 (Build 40)  
**Ngày nâng cấp:** 09/10/2026

---

## 1. Phân Tích Mã Nguồn Bản Đầu (FCMGuard-HyperOS)

Mã nguồn ban đầu được viết bằng **Java và XML layouts truyền thống** với các thành phần cốt lõi:
1. `SettingsGuard.java`: Đọc và cố gắng ghi vào `Settings.System` với khóa `MILLET_NO_RESTRICT_APP` để giữ `com.google.android.gms` trong danh sách không bị HyperOS giới hạn chạy ngầm.
2. `GuardService.java`: Dịch vụ chạy ngầm (hỗ trợ Foreground Service) đăng ký `ContentObserver` lắng nghe thay đổi của khóa `MILLET_NO_RESTRICT_APP`. Khi bị hệ thống xóa, dịch vụ gọi `repair()` và gửi tín hiệu heartbeat.
3. `BootReceiver.java`: Nhận sự kiện `BOOT_COMPLETED`, `LOCKED_BOOT_COMPLETED`, `MY_PACKAGE_REPLACED` để tự khởi động lại dịch vụ nếu người dùng đã bật tự động bảo vệ.
4. `FcmReconnect.java`: Gửi broadcast nội bộ `ACTION_GTALK_HEARTBEAT` và `ACTION_MCS_HEARTBEAT` đến `com.google.android.gms` và `com.google.android.gsf`.
5. `HyperOsSettings.java`: Mở trang Cài đặt Xiaomi/HyperOS (Tự khởi chạy `OP_AUTO_START`, quản lý quyền ứng dụng `PermissionsEditorActivity`).
6. `AutostartStatusReader.java`: Đọc AppOps ẩn của HyperOS (`10008: OP_MIUI_AUTOSTART`, `10053: OP_MIUI_AUTOSTART_SWITCH`) ở chế độ chỉ đọc.
7. `FcmAppScanner.java`: Quét các gói ứng dụng khai báo Intent `com.google.firebase.MESSAGING_EVENT` và `com.google.android.c2dm.intent.RECEIVE`.
8. `MainActivity.java` & XML layouts: Giao diện điều khiển tổng hợp hiển thị trạng thái và xử lý người dùng.

---

## 2. Bản Sao Lưu Mã Nguồn Cũ (Backup)
Toàn bộ mã nguồn cũ được lưu trữ nguyên vẹn tại thư mục:
- `legacy_backup/java/` (Chứa toàn bộ 12 file .java gốc)
- `legacy_backup/config/build.gradle` (Cấu hình build gốc)
- `legacy_backup/config/AndroidManifest.xml` (Manifest gốc)

---

## 3. Các Cải Tiến & Nguyên Tắc Trung Thực Trong V2

| Tiêu chí | Bản cũ (V1) | Bản nâng cấp (V2 - YOUNGKNIGHT) |
|---|---|---|
| **Ngôn ngữ & Giao diện** | Java + XML Layouts | **Kotlin + Jetpack Compose**, Material 3, Dark Navy & Electric Cyan |
| **Tính trung thực về Quyền** | Cố gắng gọi `Settings.System.putString()` nhưng nếu chưa được cấp `WRITE_SETTINGS` trên Android mới sẽ bị từ chối | **Kiểm tra minh bạch `Settings.System.canWrite()`**; báo rõ quyền chưa được cấp và hướng dẫn người dùng mở trang cấp quyền, **không giả vờ ghi thành công** |
| **Xác thực kết nối FCM** | Gửi broadcast nhưng không thể chắc chắn trạng thái server FCM | Báo rõ: Kiểm tra trạng thái Google Play Services và broadcast heartbeat là nỗ lực tối đa (best-effort), không tuyên bố sai sự thật |
| **Nhật ký (Logging)** | Chỉ lưu trạng thái trong bộ nhớ hoặc SharedPreferences đơn giản | **Hệ thống Log chuyên dụng**: lưu thời gian chi tiết, loại sự kiện (`FCM`, `GMS`, `Hệ thống`, `Doze`), kết quả và mã lỗi |
| **Kiểm tra trạng thái thiết bị** | Kiểm tra chuỗi string trong Settings | Thêm bộ kiểm tra đa chiều: **Google Play services (phiên bản, kích hoạt)**, **Trạng thái mạng (ConnectivityManager)**, **Chế độ Doze (PowerManager.isDeviceIdleMode)** |
| **Quản lý ứng dụng trọng điểm** | Quét tự động danh sách ứng dụng chung chung | Hỗ trợ danh sách chuyên sâu: **GMS, Messenger, Zalo, Gmail, Ngân hàng (Vietcombank, BIDV...)**, hướng dẫn chi tiết mở cài đặt HyperOS |
| **Tối ưu pin & Giới hạn** | Có thể gây hiểu lầm rằng chặn được 100% việc HyperOS kill app | **Minh bạch hóa**: Giải thích rõ giới hạn của HyperOS và Android; không dùng WakeLock liên tục |

---

## 4. Danh Sách Tệp Tin Trong Phiên Bản V2
1. `app/src/main/kotlin/com/youngknight/fcmguard/MainActivity.kt`: Điểm khởi chạy Jetpack Compose với thanh điều hướng 5 màn hình.
2. `app/src/main/kotlin/com/youngknight/fcmguard/ui/theme/Theme.kt`: Chủ đề Dark Navy `#020914`, Neon Cyan `#06B6D4` và Emerald Green `#10B981`.
3. `app/src/main/kotlin/com/youngknight/fcmguard/ui/screens/HomeScreen.kt`: Màn hình Trang chủ (Trạng thái GMS, Mạng, Doze, Dịch vụ giám sát, nút Kiểm tra ngay).
4. `app/src/main/kotlin/com/youngknight/fcmguard/ui/screens/LogScreen.kt`: Màn hình Nhật ký (Bộ lọc sự kiện, làm mới, xóa nhật ký).
5. `app/src/main/kotlin/com/youngknight/fcmguard/ui/screens/AppsScreen.kt`: Quản lý ứng dụng quan trọng và hướng dẫn cấu hình nền.
6. `app/src/main/kotlin/com/youngknight/fcmguard/ui/screens/SettingsScreen.kt`: Tùy chỉnh giám sát, thông báo và quyền hệ thống.
7. `app/src/main/kotlin/com/youngknight/fcmguard/ui/screens/AboutScreen.kt`: Thông tin FCM Guard V2, tác giả YOUNGKNIGHT, giới hạn kỹ thuật.
8. `app/src/main/kotlin/com/youngknight/fcmguard/service/GuardService.kt`: Dịch vụ Foreground Service giám sát whitelist và nhịp tim.
9. `app/src/main/kotlin/com/youngknight/fcmguard/receiver/BootReceiver.kt`: Nhận sự kiện khởi động máy để tự động kích hoạt lại.
10. `app/src/main/kotlin/com/youngknight/fcmguard/core/*`: Các lớp nghiệp vụ: `SettingsGuard`, `GmsStatusChecker`, `NetworkStatusChecker`, `PowerStatusChecker`, `LogManager`, `HyperOsSettings`, `FcmReconnect`.
