import React, { useState, useEffect, useRef } from 'react';
import {
  Check,
  CheckCircle2,
  RefreshCw,
  Zap,
  BatteryCharging,
  Wifi,
  Bell,
  Activity,
  Settings,
  Shield,
  Search,
  ArrowLeft,
  ChevronRight,
  Send,
  Trash2,
  AlertTriangle,
  Radio,
  FileCode,
  Smartphone,
  Sparkles,
  Layers,
  Heart,
  Globe2,
  Cpu,
  Lock,
  Unlock,
  Volume2,
  Power,
  RotateCcw,
  Sliders,
  Plus,
  Moon,
  Sun,
  LayoutGrid,
  Play
} from 'lucide-react';

// Custom SVG Logo for YoungKnight Shield
function YkShieldLogo({ size = 48, glow = false }: { size?: number; glow?: boolean }) {
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 ${
        glow ? 'drop-shadow-[0_0_15px_rgba(6,182,212,0.85)]' : ''
      }`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="silverGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
          <linearGradient id="bgPlate" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#031525" />
            <stop offset="100%" stopColor="#020914" />
          </linearGradient>
        </defs>

        <path
          d="M50 4 L88 18 C88 56 68 84 50 96 C32 84 12 56 12 18 Z"
          fill="url(#bgPlate)"
          stroke="url(#shieldGrad)"
          strokeWidth="4"
        />

        <path
          d="M50 10 L81 22 C81 53 64 78 50 88 C36 78 19 53 19 22 Z"
          fill="none"
          stroke="url(#silverGlow)"
          strokeWidth="1.8"
          strokeOpacity="0.85"
        />

        <path
          d="M34 26 L46 44 L46 68 L50 68 L50 44 L60 26 L53 26 L48 37 L43 26 Z"
          fill="#38bdf8"
        />
        <path
          d="M54 36 L68 26 L73 26 L59 44 L74 68 L68 68 L55 49 Z"
          fill="#e0f2fe"
        />
        <circle cx="50" cy="50" r="2.5" fill="#38bdf8" />
      </svg>
    </div>
  );
}

// Data structures
interface LogItem {
  id: string;
  time: string;
  type: 'system' | 'fcm' | 'gms' | 'doze';
  success: boolean;
  title: string;
  desc: string;
}

interface AppItem {
  id: string;
  name: string;
  sub: string;
  icon: string;
  added: boolean;
}

export default function App() {
  // Mode: 'emulator' | 'poster' | 'cicd'
  const [viewMode, setViewMode] = useState<'emulator' | 'poster' | 'cicd'>('emulator');

  // Emulator state
  const [currentScreen, setCurrentScreen] = useState<
    'home' | 'log' | 'settings' | 'apps' | 'status_details' | 'quick_actions' | 'advanced_settings' | 'about'
  >('home');
  const [isLocked, setIsLocked] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(98);
  const [networkType, setNetworkType] = useState<'Wi-Fi' | '5G'>('Wi-Fi');

  // App functional state
  const [isRepairing, setIsRepairing] = useState(false);
  const [repairStep, setRepairStep] = useState<string | null>(null);
  const [lastCheckTime, setLastCheckTime] = useState('10:24 08/10/2026');
  const [fcmConnected, setFcmConnected] = useState(true);
  const [gmsRunning, setGmsRunning] = useState(true);
  const [dozeActive, setDozeActive] = useState(false);
  const [whitelistProtected, setWhitelistProtected] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Settings
  const [autoStart, setAutoStart] = useState(true);
  const [monitorFcm, setMonitorFcm] = useState(true);
  const [screenOffWake, setScreenOffWake] = useState(true);
  const [unlockWake, setUnlockWake] = useState(true);
  const [networkReconnectWake, setNetworkReconnectWake] = useState(true);
  const [appStartWake, setAppStartWake] = useState(true);
  const [persistentNotification, setPersistentNotification] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [checkInterval, setCheckInterval] = useState('15 phút');

  // Filters & Search
  const [logFilter, setLogFilter] = useState<'all' | 'system' | 'fcm' | 'gms' | 'doze'>('all');
  const [appFilter, setAppFilter] = useState<'all' | 'protected' | 'unprotected'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Logs list
  const [logs, setLogs] = useState<LogItem[]>([
    { id: '1', time: '10:22', type: 'fcm', success: true, title: 'Đã kết nối FCM thành công', desc: 'com.google.android.gms' },
    { id: '2', time: '10:22', type: 'system', success: true, title: 'Kiểm tra định kỳ - Không có vấn đề', desc: 'Duy trì kết nối tốt' },
    { id: '3', time: '10:18', type: 'gms', success: false, title: 'Phát hiện GMS bị dừng', desc: 'Đã khởi động lại dịch vụ GMS' },
    { id: '4', time: '10:16', type: 'system', success: false, title: 'Đã thêm com.google.android.gms', desc: 'vào MILLET_NO_RESTRICT_APP' },
    { id: '5', time: '10:12', type: 'fcm', success: true, title: 'Mạng đã kết nối lại', desc: 'Đang gửi tín hiệu đánh thức FCM' },
    { id: '6', time: '10:05', type: 'doze', success: false, title: 'Doze đã được kích hoạt', desc: 'Đang xử lý để duy trì kết nối' },
    { id: '7', time: '09:47', type: 'fcm', success: false, title: 'FCM bị ngắt kết nối', desc: 'Đã tự động khôi phục' },
    { id: '8', time: '09:41', type: 'system', success: true, title: 'Mở khóa màn hình', desc: 'Đánh thức FCM' }
  ]);

  // Apps list
  const [apps, setApps] = useState<AppItem[]>([
    { id: 'gms', name: 'com.google.android.gms', sub: '(Google Play services)', icon: '🟢', added: true },
    { id: 'messenger', name: 'Messenger', sub: 'com.facebook.orca', icon: '💬', added: true },
    { id: 'zalo', name: 'Zalo', sub: 'com.zing.zalo', icon: '🔵', added: true },
    { id: 'gmail', name: 'Gmail', sub: 'com.google.android.gm', icon: '✉️', added: true },
    { id: 'bank', name: 'Ngân hàng (Vietcombank)', sub: 'com.VCB', icon: '🏦', added: true },
    { id: 'tiktok', name: 'TikTok', sub: 'com.zhiliaoapp.musically', icon: '🎵', added: true },
    { id: 'youtube', name: 'YouTube', sub: 'com.google.android.youtube', icon: '▶️', added: true },
    { id: 'facebook', name: 'Facebook', sub: 'com.facebook.katana', icon: '👤', added: true }
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const addLog = (type: LogItem['type'], success: boolean, title: string, desc = '') => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newEntry: LogItem = {
      id: String(Date.now()),
      time,
      type,
      success,
      title,
      desc
    };
    setLogs((prev) => [newEntry, ...prev]);
  };

  // Perform full check and repair
  const runCheckAndRepair = () => {
    if (isRepairing) return;
    setIsRepairing(true);
    setRepairStep('1/4: Đang đọc danh sách trắng MILLET...');

    setTimeout(() => {
      setRepairStep('2/4: Khôi phục com.google.android.gms...');
      setWhitelistProtected(true);
      setGmsRunning(true);
    }, 600);

    setTimeout(() => {
      setRepairStep('3/4: Đánh thức FCM heartbeat...');
      setFcmConnected(true);
      setDozeActive(false);
    }, 1200);

    setTimeout(() => {
      setIsRepairing(false);
      setRepairStep(null);
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} 08/10/2026`;
      setLastCheckTime(timeStr);
      addLog('system', true, 'Kiểm tra & Sửa ngay hoàn tất', 'Tất cả dịch vụ FCM và GMS đang an toàn');
      showToast('Đã sửa xong: FCM & GMS đang hoạt động hoàn hảo!');
    }, 1800);
  };

  // Simulation triggers for testing
  const simulateFcmDrop = () => {
    setFcmConnected(false);
    addLog('fcm', false, 'FCM bị ngắt kết nối', 'Phát hiện tín hiệu heartbeat mất kết nối');
    showToast('⚠️ Mô phỏng: FCM bị ngắt kết nối! Hệ thống đang phát hiện...');
    setTimeout(() => {
      setFcmConnected(true);
      addLog('fcm', true, 'Tự động kết nối lại FCM thành công', 'Đã gửi lệnh khôi phục ngầm');
      showToast('✅ Tự động khôi phục: FCM đã được kết nối lại!');
    }, 1500);
  };

  const simulateDoze = () => {
    setDozeActive(true);
    addLog('doze', false, 'Doze đã được kích hoạt', 'HyperOS chuyển sang chế độ tiết kiệm pin sâu');
    showToast('🌙 Mô phỏng: Thiết bị kích hoạt Doze!');
    setTimeout(() => {
      setDozeActive(false);
      addLog('system', true, 'Đánh thức FCM trong Doze', 'Đã xử lý giữ cổng push thông báo thông minh');
      showToast('⚡ FCM Guard đã đánh thức dịch vụ thành công!');
    }, 1500);
  };

  const simulateWhitelistLoss = () => {
    setWhitelistProtected(false);
    addLog('system', false, 'GMS bị xóa khỏi whitelist', 'MILLET_NO_RESTRICT_APP bị hệ thống ghi đè');
    showToast('⚠️ Mô phỏng: Whitelist bị xóa!');
    setTimeout(() => {
      setWhitelistProtected(true);
      addLog('system', true, 'Tự động thêm lại com.google.android.gms', 'Đã khôi phục vào MILLET_NO_RESTRICT_APP');
      showToast('🛡️ FCM Guard đã tự động khôi phục whitelist!');
    }, 1400);
  };

  const simulateNetworkSwitch = () => {
    const nextNet = networkType === 'Wi-Fi' ? '5G' : 'Wi-Fi';
    setNetworkType(nextNet);
    addLog('system', true, `Mạng chuyển sang ${nextNet}`, 'Kích hoạt thông minh khi mạng reconnect');
    showToast(`📶 Mạng chuyển sang ${nextNet} - FCM đã kiểm tra lại!`);
  };

  const toggleAppProtection = (id: string) => {
    setApps((prev) =>
      prev.map((a) => (a.id === id ? { ...a, added: !a.added } : a))
    );
    const target = apps.find((a) => a.id === id);
    if (target) {
      const newState = !target.added;
      addLog('system', newState, `${newState ? 'Đã thêm' : 'Đã xóa'} ${target.name}`, 'Cập nhật danh sách bảo vệ');
      showToast(`${newState ? 'Đã thêm' : 'Đã bỏ'} ${target.name}`);
    }
  };

  const filteredLogs = logs.filter((item) => {
    if (logFilter === 'all') return true;
    return item.type === logFilter;
  });

  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.sub.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (appFilter === 'protected') return app.added;
    if (appFilter === 'unprotected') return !app.added;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Toast Notice inside Web UI */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#051c36] text-cyan-200 border border-cyan-400/80 shadow-[0_0_25px_rgba(6,182,212,0.8)] px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 backdrop-blur-md animate-bounce">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER & HERO POSTER BRANDING */}
      <header className="relative overflow-hidden bg-gradient-to-b from-[#031528] via-[#020b18] to-[#020617] border-b border-cyan-900/40 pt-7 pb-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5 text-center lg:text-left flex-col lg:flex-row">
            <div className="relative group cursor-pointer" onClick={() => setViewMode('emulator')}>
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition duration-500" />
              <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-[#031222] border-2 border-cyan-400/80 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.5)]">
                <YkShieldLogo size={74} glow={true} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white flex items-center gap-2 drop-shadow-md">
                  FCM GUARD <span className="text-cyan-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.8)]">V2</span>
                </h1>
              </div>

              <p className="text-sm md:text-lg font-medium text-slate-200">
                Giữ kết nối FCM – Không lo mất thông báo
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-0.5">
                <span className="px-3 py-0.5 rounded-full bg-cyan-950/90 border border-cyan-500/60 text-cyan-300 text-xs font-bold">
                  Không cần Shizuku
                </span>
                <span className="text-cyan-500 font-bold">|</span>
                <span className="px-3 py-0.5 rounded-full bg-cyan-950/90 border border-cyan-500/60 text-cyan-300 text-xs font-bold">
                  Không cần Root
                </span>
                <span className="text-xs text-slate-400 ml-2">
                  Dành cho Xiaomi 15 Ultra (<span className="text-cyan-400">HyperOS</span>) &amp; Xiaomi ROM
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-400">By </span>
                <span className="text-sm font-black italic tracking-wide text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
                  YOUNGKNIGHT
                </span>
              </div>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center p-1.5 rounded-2xl bg-[#041224] border border-cyan-800/60 shadow-lg">
            <button
              onClick={() => setViewMode('emulator')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                viewMode === 'emulator'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.6)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              Chạy thử trên giả lập
            </button>

            <button
              onClick={() => setViewMode('poster')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                viewMode === 'poster'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.6)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Bảng thiết kế 9 màn hình
            </button>

            <button
              onClick={() => setViewMode('cicd')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                viewMode === 'cicd'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.6)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCode className="w-4 h-4" />
              Tải APK &amp; GitHub Actions
            </button>
          </div>
        </div>
      </header>

      {/* VIEW 1: INTERACTIVE EMULATOR (CHẠY THỬ TRÊN GIẢ LẬP) */}
      {viewMode === 'emulator' && (
        <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT / CENTER: THE INTERACTIVE XIAOMI PHONE SIMULATOR */}
            <div className="lg:col-span-7 flex flex-col items-center">
              <div className="text-center mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-950/80 border border-cyan-500/60 text-cyan-300">
                  <Sparkles className="w-3.5 h-3.5" /> Giả lập Xiaomi 15 Ultra (HyperOS 2.0 / Android 15)
                </span>
                <p className="text-xs text-slate-400 mt-1">
                  Nhấp trực tiếp vào các nút, chuyển tab, mở màn hình khóa hoặc dùng bảng điều khiển bên phải để thử nghiệm.
                </p>
              </div>

              {/* Realistic Phone Frame */}
              <div className="relative">
                {/* Physical Phone Outer Shell */}
                <div className="w-[360px] h-[720px] rounded-[52px] bg-[#0c1017] p-3 shadow-[0_0_50px_rgba(6,182,212,0.35),_0_20px_50px_rgba(0,0,0,0.9)] border-[4px] border-slate-700/80 relative">
                  {/* Speaker Ear Piece */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full bg-slate-800 z-30" />

                  {/* Volume Buttons (Left side) */}
                  <div className="absolute -left-[7px] top-28 w-[3px] h-12 bg-slate-600 rounded-l" />
                  <div className="absolute -left-[7px] top-44 w-[3px] h-12 bg-slate-600 rounded-l" />

                  {/* Power Button (Right side) */}
                  <button
                    onClick={() => setIsLocked(!isLocked)}
                    title="Nút nguồn: Khóa / Mở màn hình"
                    className="absolute -right-[7px] top-36 w-[3px] h-14 bg-cyan-600 hover:bg-cyan-400 rounded-r transition cursor-pointer"
                  />

                  {/* AMOLED Screen Area */}
                  <div className="w-full h-full rounded-[42px] bg-[#020914] overflow-hidden flex flex-col relative border border-cyan-950">
                    {/* Punch-hole Front Camera */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-black border border-slate-800 z-30 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                    </div>

                    {/* Status Bar */}
                    <div className="px-6 pt-3 pb-1 flex items-center justify-between text-[11px] text-slate-200 font-medium select-none z-20">
                      <span>10:24</span>
                      <div className="flex items-center gap-1.5">
                        <Wifi className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold">{networkType}</span>
                        <div className="w-4 h-2 rounded-xs border border-current flex items-center p-0.5">
                          <div className="h-full w-[80%] bg-current rounded-xs" />
                        </div>
                      </div>
                    </div>

                    {/* LOCKSCREEN MODE */}
                    {isLocked ? (
                      <div className="flex-1 flex flex-col justify-between p-6 relative bg-gradient-to-b from-[#0a192f] via-[#040e1e] to-[#010610]">
                        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 via-indigo-950 to-transparent pointer-events-none" />

                        <div className="pt-12 text-center relative z-10">
                          <div className="text-4xl font-light text-white tracking-wider">10:24</div>
                          <div className="text-xs text-slate-300 font-medium mt-1">Thứ 4, 08 Tháng 10</div>
                        </div>

                        {/* Floating Notification */}
                        {persistentNotification && (
                          <div
                            onClick={() => setIsLocked(false)}
                            className="p-3.5 rounded-2xl bg-[#08182b]/95 border border-cyan-400/60 backdrop-blur-md shadow-2xl relative z-10 space-y-1.5 cursor-pointer hover:border-cyan-300 transition"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1.5 font-bold text-white">
                                <YkShieldLogo size={18} />
                                <span>FCM Guard <span className="text-cyan-400">V2</span></span>
                              </div>
                              <span className="text-[10px] text-slate-400">Vừa xong</span>
                            </div>
                            <div className="text-xs font-semibold text-cyan-300">
                              {fcmConnected ? 'FCM đang kết nối ổn định' : 'Đang khôi phục kết nối FCM...'}
                            </div>
                            <div className="text-[10px] text-slate-300">
                              {whitelistProtected ? 'Tất cả dịch vụ hoạt động tốt!' : 'Đang đồng bộ whitelist...'}
                            </div>
                          </div>
                        )}

                        <div className="text-center relative z-10 pb-4">
                          <button
                            onClick={() => setIsLocked(false)}
                            className="px-4 py-2 rounded-full bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-xs font-bold flex items-center gap-1.5 mx-auto hover:bg-cyan-900 transition"
                          >
                            <Unlock className="w-3.5 h-3.5" /> Vuốt để mở khóa
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* ACTIVE APP SCREEN */
                      <div className="flex-1 flex flex-col justify-between overflow-hidden">
                        {/* SCREEN: HOME */}
                        {currentScreen === 'home' && (
                          <div className="flex-1 px-4 py-2 flex flex-col justify-between overflow-y-auto">
                            {/* App Header */}
                            <div className="flex items-center justify-between pb-1">
                              <div className="flex items-center gap-2">
                                <YkShieldLogo size={24} />
                                <span className="text-xs font-bold text-white tracking-wide">
                                  FCM Guard <span className="text-cyan-400">V2</span>
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setCurrentScreen('quick_actions')}
                                  title="Hành động nhanh"
                                  className="p-1 rounded-lg text-cyan-400 hover:bg-cyan-950/60"
                                >
                                  <Zap className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setCurrentScreen('settings')}
                                  title="Cài đặt"
                                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                                >
                                  <Settings className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Status Card */}
                            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center shrink-0">
                                  <Check className="w-4 h-4 text-emerald-400" />
                                </div>
                                <div>
                                  <div className="text-xs font-bold text-emerald-300">Đang hoạt động</div>
                                  <div className="text-[10px] text-emerald-400/80">Bảo vệ kết nối FCM của bạn</div>
                                </div>
                              </div>
                              <button
                                onClick={() => setCurrentScreen('status_details')}
                                className="text-[10px] text-cyan-300 font-semibold hover:underline"
                              >
                                Chi tiết &gt;
                              </button>
                            </div>

                            {/* Central Glowing Crest */}
                            <div className="my-2 relative flex items-center justify-center">
                              <div className="w-36 h-36 rounded-full border border-cyan-500/20 flex items-center justify-center">
                                <div
                                  className={`w-28 h-28 rounded-full border-2 border-cyan-400/60 shadow-[0_0_25px_rgba(6,182,212,0.5)] flex items-center justify-center bg-[#031526]/90 transition ${
                                    isRepairing ? 'animate-spin' : ''
                                  }`}
                                >
                                  <YkShieldLogo size={62} glow={true} />
                                </div>
                              </div>
                              <div className="absolute -bottom-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#020914] flex items-center justify-center shadow-lg">
                                <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                              </div>
                            </div>

                            {/* 4 Status Rows */}
                            <div className="space-y-1.5">
                              <div
                                onClick={() => setCurrentScreen('status_details')}
                                className="px-3 py-1.5 rounded-lg bg-[#041224] border border-cyan-900/40 flex items-center justify-between text-[11px] cursor-pointer hover:border-cyan-700 transition"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                    <Check className="w-2.5 h-2.5" />
                                  </div>
                                  <div>
                                    <div className="font-semibold text-white">FCM</div>
                                    <div className="text-[9px] text-emerald-400">
                                      {fcmConnected ? 'Đã kết nối' : 'Đang ngắt kết nối'}
                                    </div>
                                  </div>
                                </div>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              </div>

                              <div
                                onClick={() => setCurrentScreen('status_details')}
                                className="px-3 py-1.5 rounded-lg bg-[#041224] border border-cyan-900/40 flex items-center justify-between text-[11px] cursor-pointer hover:border-cyan-700 transition"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                    <Check className="w-2.5 h-2.5" />
                                  </div>
                                  <div>
                                    <div className="font-semibold text-white">GMS (Google Play services)</div>
                                    <div className="text-[9px] text-emerald-400">
                                      {gmsRunning ? 'Đang chạy' : 'Đã dừng'}
                                    </div>
                                  </div>
                                </div>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              </div>

                              <div
                                onClick={() => setCurrentScreen('status_details')}
                                className="px-3 py-1.5 rounded-lg bg-[#041224] border border-cyan-900/40 flex items-center justify-between text-[11px] cursor-pointer hover:border-cyan-700 transition"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                    <Check className="w-2.5 h-2.5" />
                                  </div>
                                  <div>
                                    <div className="font-semibold text-white">Doze</div>
                                    <div className="text-[9px] text-emerald-400">
                                      {dozeActive ? 'Đang hoạt động' : 'Không hoạt động'}
                                    </div>
                                  </div>
                                </div>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              </div>

                              <div
                                onClick={() => setCurrentScreen('status_details')}
                                className="px-3 py-1.5 rounded-lg bg-[#041224] border border-cyan-900/40 flex items-center justify-between text-[11px] cursor-pointer hover:border-cyan-700 transition"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                    <Check className="w-2.5 h-2.5" />
                                  </div>
                                  <div>
                                    <div className="font-semibold text-white">Mạng</div>
                                    <div className="text-[9px] text-emerald-400">Đã kết nối ({networkType})</div>
                                  </div>
                                </div>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              </div>
                            </div>

                            {/* Last Check */}
                            <div className="text-center text-[10px] text-slate-400 pt-1">
                              {repairStep ? (
                                <span className="text-cyan-300 font-bold animate-pulse">{repairStep}</span>
                              ) : (
                                <>
                                  Lần kiểm tra gần nhất: <br />
                                  <span className="text-slate-300 font-mono font-medium">{lastCheckTime}</span>
                                </>
                              )}
                            </div>

                            {/* Action Pill Button */}
                            <button
                              onClick={runCheckAndRepair}
                              disabled={isRepairing}
                              className="w-full py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:brightness-110 text-white font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.6)] flex items-center justify-center gap-1.5 transition active:scale-98 cursor-pointer"
                            >
                              <Zap className={`w-4 h-4 fill-white ${isRepairing ? 'animate-spin' : ''}`} />
                              {isRepairing ? 'Đang kiểm tra...' : 'Kiểm tra & Sửa ngay'}
                            </button>
                          </div>
                        )}

                        {/* SCREEN: LOG */}
                        {currentScreen === 'log' && (
                          <div className="flex-1 px-3 py-2 flex flex-col justify-between overflow-hidden">
                            <div className="flex items-center justify-between pb-1.5 border-b border-cyan-950">
                              <span className="text-xs font-bold text-white">Nhật ký hoạt động</span>
                              <span className="text-[10px] text-cyan-400 font-mono">{logs.length} sự kiện</span>
                            </div>

                            {/* Filters */}
                            <div className="flex items-center gap-1 py-1.5 overflow-x-auto no-scrollbar">
                              {(['all', 'system', 'fcm', 'gms', 'doze'] as const).map((f) => (
                                <button
                                  key={f}
                                  onClick={() => setLogFilter(f)}
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition shrink-0 ${
                                    logFilter === f
                                      ? 'bg-cyan-500 text-slate-950 font-bold'
                                      : 'bg-[#05162a] text-slate-400 hover:text-white border border-cyan-900/50'
                                  }`}
                                >
                                  {f === 'all' ? 'Tất cả' : f === 'system' ? 'Hệ thống' : f.toUpperCase()}
                                </button>
                              ))}
                            </div>

                            {/* Log Items */}
                            <div className="flex-1 space-y-1.5 overflow-y-auto pr-0.5 text-[10px]">
                              {filteredLogs.map((l) => (
                                <div
                                  key={l.id}
                                  className="p-2 rounded-lg bg-[#041224] border border-cyan-950 flex items-start gap-2 hover:border-cyan-800 transition"
                                >
                                  <div className="font-mono text-slate-400 pt-0.5">{l.time}</div>
                                  <div className="pt-0.5">
                                    {l.success ? (
                                      <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                        <Check className="w-2.5 h-2.5" />
                                      </div>
                                    ) : (
                                      <div className="w-3.5 h-3.5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                                        <AlertTriangle className="w-2.5 h-2.5" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-slate-200 truncate">{l.title}</div>
                                    {l.desc && <div className="text-[9px] text-slate-400 truncate">{l.desc}</div>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* SCREEN: SETTINGS */}
                        {currentScreen === 'settings' && (
                          <div className="flex-1 px-3 py-2 space-y-3 overflow-y-auto text-[11px]">
                            <div className="flex items-center gap-2 pb-1 border-b border-cyan-950">
                              <Settings className="w-4 h-4 text-cyan-400" />
                              <span className="text-xs font-bold text-white tracking-wide">Cài đặt</span>
                            </div>

                            <div>
                              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                                Tùy chọn chính
                              </h4>
                              <div className="space-y-1.5">
                                <div className="p-2 rounded-lg bg-[#041224] border border-cyan-950 flex items-center justify-between">
                                  <div>
                                    <div className="font-semibold text-white">Tự khởi động cùng hệ thống</div>
                                    <div className="text-[9px] text-slate-400">Tự động chạy sau khi khởi động máy</div>
                                  </div>
                                  <input
                                    type="checkbox"
                                    checked={autoStart}
                                    onChange={(e) => setAutoStart(e.target.checked)}
                                    className="w-7 h-3.5 rounded-full accent-cyan-500 cursor-pointer"
                                  />
                                </div>

                                <div className="p-2 rounded-lg bg-[#041224] border border-cyan-950 flex items-center justify-between">
                                  <div>
                                    <div className="font-semibold text-white">Giám sát FCM/GMS</div>
                                    <div className="text-[9px] text-slate-400">Kiểm tra và phục hồi khi bị ngắt</div>
                                  </div>
                                  <input
                                    type="checkbox"
                                    checked={monitorFcm}
                                    onChange={(e) => setMonitorFcm(e.target.checked)}
                                    className="w-7 h-3.5 rounded-full accent-cyan-500 cursor-pointer"
                                  />
                                </div>

                                <div
                                  onClick={() => {
                                    const next = checkInterval === '15 phút' ? '30 phút' : '15 phút';
                                    setCheckInterval(next);
                                    showToast(`Tần suất kiểm tra: ${next}`);
                                  }}
                                  className="p-2 rounded-lg bg-[#041224] border border-cyan-950 flex items-center justify-between cursor-pointer hover:border-cyan-800 transition"
                                >
                                  <div>
                                    <div className="font-semibold text-white">Kiểm tra định kỳ</div>
                                    <div className="text-[9px] text-slate-400">Tần suất kiểm tra trạng thái</div>
                                  </div>
                                  <span className="text-[10px] text-cyan-300 font-semibold flex items-center gap-0.5">
                                    {checkInterval} <ChevronRight className="w-3 h-3" />
                                  </span>
                                </div>

                                <div
                                  onClick={() => setCurrentScreen('advanced_settings')}
                                  className="p-2 rounded-lg bg-[#041224] border border-cyan-950 flex items-center justify-between cursor-pointer hover:border-cyan-800 transition"
                                >
                                  <div>
                                    <div className="font-semibold text-white">Wake FCM khi có sự kiện</div>
                                    <div className="text-[9px] text-slate-400">Màn hình, mở khóa, mạng...</div>
                                  </div>
                                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                                Ứng dụng &amp; Thông tin
                              </h4>
                              <div className="space-y-1.5">
                                <div
                                  onClick={() => setCurrentScreen('apps')}
                                  className="p-2 rounded-lg bg-[#041224] border border-cyan-950 flex items-center justify-between cursor-pointer hover:border-cyan-800 transition"
                                >
                                  <div>
                                    <div className="font-semibold text-white">Quản lý danh sách ứng dụng</div>
                                    <div className="text-[9px] text-slate-400">Thêm / xóa ứng dụng bảo vệ</div>
                                  </div>
                                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                                </div>

                                <div
                                  onClick={() => {
                                    showToast('Whitelist hiện tại: com.google.android.gms đã được bảo vệ');
                                  }}
                                  className="p-2 rounded-lg bg-[#041224] border border-cyan-950 flex items-center justify-between cursor-pointer hover:border-cyan-800 transition"
                                >
                                  <div>
                                    <div className="font-semibold text-white">MILLET_NO_RESTRICT_APP</div>
                                    <div className="text-[9px] text-slate-400">Xem / khôi phục whitelist</div>
                                  </div>
                                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                                </div>

                                <div
                                  onClick={() => setCurrentScreen('about')}
                                  className="p-2 rounded-lg bg-[#041224] border border-cyan-950 flex items-center justify-between cursor-pointer hover:border-cyan-800 transition"
                                >
                                  <div>
                                    <div className="font-semibold text-white">Giới thiệu FCM Guard V2</div>
                                    <div className="text-[9px] text-slate-400">Phiên bản 2.0.0 by YOUNGKNIGHT</div>
                                  </div>
                                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* SCREEN: APPS MANAGEMENT */}
                        {currentScreen === 'apps' && (
                          <div className="flex-1 px-3 py-2 flex flex-col justify-between overflow-hidden">
                            <div>
                              <div className="flex items-center gap-2 pb-1.5 border-b border-cyan-950">
                                <button onClick={() => setCurrentScreen('settings')} className="text-slate-400 hover:text-white">
                                  <ArrowLeft className="w-4 h-4" />
                                </button>
                                <span className="text-xs font-bold text-white tracking-wide">Quản lý ứng dụng</span>
                              </div>

                              <div className="flex items-center gap-1.5 py-1.5">
                                <button
                                  onClick={() => setAppFilter('all')}
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition ${
                                    appFilter === 'all' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-[#041224] text-slate-400'
                                  }`}
                                >
                                  Tất cả
                                </button>
                                <button
                                  onClick={() => setAppFilter('protected')}
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition ${
                                    appFilter === 'protected' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-[#041224] text-slate-400'
                                  }`}
                                >
                                  Được bảo vệ
                                </button>
                                <button
                                  onClick={() => setAppFilter('unprotected')}
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition ${
                                    appFilter === 'unprotected' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-[#041224] text-slate-400'
                                  }`}
                                >
                                  Chưa bảo vệ
                                </button>
                              </div>
                            </div>

                            {/* List */}
                            <div className="flex-1 space-y-1.5 overflow-y-auto text-[11px]">
                              {filteredApps.map((app) => (
                                <div
                                  key={app.id}
                                  onClick={() => toggleAppProtection(app.id)}
                                  className="p-2 rounded-lg bg-[#041224] border border-cyan-950 flex items-center justify-between cursor-pointer hover:border-cyan-700 transition"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className="text-base shrink-0">{app.icon}</span>
                                    <div className="min-w-0">
                                      <div className="font-semibold text-white truncate text-[11px]">{app.name}</div>
                                      {app.sub && <div className="text-[9px] text-slate-400 truncate">{app.sub}</div>}
                                    </div>
                                  </div>
                                  <span
                                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ${
                                      app.added
                                        ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-500/50'
                                        : 'text-slate-400 bg-slate-900 border border-slate-800'
                                    }`}
                                  >
                                    {app.added ? (
                                      <>
                                        <Check className="w-2.5 h-2.5" /> Đã thêm
                                      </>
                                    ) : (
                                      '+ Thêm'
                                    )}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* SCREEN: STATUS DETAILS */}
                        {currentScreen === 'status_details' && (
                          <div className="flex-1 px-3 py-2 space-y-2 overflow-y-auto text-[10px]">
                            <div className="flex items-center gap-2 pb-1.5 border-b border-cyan-950">
                              <button onClick={() => setCurrentScreen('home')} className="text-slate-400 hover:text-white">
                                <ArrowLeft className="w-4 h-4" />
                              </button>
                              <span className="text-xs font-bold text-white tracking-wide">Chi tiết trạng thái</span>
                            </div>

                            <div className="p-2 rounded-lg bg-[#041224] border border-cyan-950 space-y-1">
                              <div className="font-bold text-cyan-400 flex items-center gap-1">
                                <Radio className="w-3 h-3" /> FCM
                              </div>
                              <div className="flex justify-between text-slate-300">
                                <span className="text-slate-400">&gt; Trạng thái kết nối</span>
                                <span className="text-emerald-400 font-semibold">{fcmConnected ? 'Đã kết nối' : 'Mất kết nối'}</span>
                              </div>
                              <div className="flex justify-between text-slate-300">
                                <span className="text-slate-400">&gt; IP hiện tại</span>
                                <span className="font-mono text-slate-300">fcm... (ipn 10)</span>
                              </div>
                              <div className="flex justify-between text-slate-300">
                                <span className="text-slate-400">&gt; Thời gian kết nối</span>
                                <span className="font-mono text-slate-300">10:22:37</span>
                              </div>
                            </div>

                            <div className="p-2 rounded-lg bg-[#041224] border border-cyan-950 space-y-1">
                              <div className="font-bold text-cyan-400 flex items-center gap-1">
                                <RefreshCw className="w-3 h-3" /> GMS
                              </div>
                              <div className="flex justify-between text-slate-300">
                                <span className="text-slate-400">&gt; Trạng thái</span>
                                <span className="text-emerald-400 font-semibold">{gmsRunning ? 'Đang chạy' : 'Đã dừng'}</span>
                              </div>
                              <div className="flex justify-between text-slate-300">
                                <span className="text-slate-400">&gt; Phiên bản</span>
                                <span className="font-mono text-slate-300">24.48.14 (xxxx)</span>
                              </div>
                              <div className="flex justify-between text-slate-300">
                                <span className="text-slate-400">&gt; Tiến trình</span>
                                <span className="font-mono text-slate-300 text-[9px]">com.google.android.gms</span>
                              </div>
                            </div>

                            <div className="p-2 rounded-lg bg-[#041224] border border-cyan-950 space-y-1">
                              <div className="font-bold text-cyan-400 flex items-center gap-1">
                                <BatteryCharging className="w-3 h-3" /> Doze
                              </div>
                              <div className="flex justify-between text-slate-300">
                                <span className="text-slate-400">&gt; Trạng thái</span>
                                <span className="text-slate-300 font-semibold">{dozeActive ? 'Đang bật' : 'Không hoạt động'}</span>
                              </div>
                              <div className="flex justify-between text-slate-300">
                                <span className="text-slate-400">&gt; Chế độ tiết kiệm pin</span>
                                <span className="text-slate-400 font-semibold">{dozeActive ? 'Bật' : 'Tắt'}</span>
                              </div>
                            </div>

                            <div className="p-2 rounded-lg bg-[#041224] border border-cyan-950 space-y-1">
                              <div className="font-bold text-cyan-400 flex items-center gap-1">
                                <Wifi className="w-3 h-3" /> Mạng
                              </div>
                              <div className="flex justify-between text-slate-300">
                                <span className="text-slate-400">&gt; Loại kết nối</span>
                                <span className="text-slate-300 font-semibold">{networkType}</span>
                              </div>
                              <div className="flex justify-between text-slate-300">
                                <span className="text-slate-400">&gt; Độ mạnh tín hiệu</span>
                                <span className="text-emerald-400 font-semibold">Tốt</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* SCREEN: QUICK ACTIONS */}
                        {currentScreen === 'quick_actions' && (
                          <div className="flex-1 px-3 py-2 space-y-2 overflow-y-auto">
                            <div className="flex items-center gap-2 pb-1.5 border-b border-cyan-950">
                              <button onClick={() => setCurrentScreen('home')} className="text-slate-400 hover:text-white">
                                <ArrowLeft className="w-4 h-4" />
                              </button>
                              <span className="text-xs font-bold text-white tracking-wide">Hành động nhanh</span>
                            </div>

                            <button
                              onClick={runCheckAndRepair}
                              className="w-full p-2.5 rounded-xl bg-blue-600/30 border border-blue-500 flex items-center gap-3 text-left hover:bg-blue-600/40 transition cursor-pointer"
                            >
                              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-md">
                                <Zap className="w-4 h-4 fill-white" />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-white">Kiểm tra &amp; Sửa ngay</div>
                                <div className="text-[9px] text-blue-200">Đầy đủ quy trình</div>
                              </div>
                            </button>

                            <button
                              onClick={() => {
                                setGmsRunning(true);
                                addLog('gms', true, 'Khởi động lại dịch vụ GMS', 'Google Play Services đã sẵn sàng');
                                showToast('Đã khởi động lại dịch vụ Google Play!');
                              }}
                              className="w-full p-2.5 rounded-xl bg-emerald-600/25 border border-emerald-500 flex items-center gap-3 text-left hover:bg-emerald-600/35 transition cursor-pointer"
                            >
                              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-md">
                                <RefreshCw className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-white">Khởi động lại GMS</div>
                                <div className="text-[9px] text-emerald-200">Sửa lỗi dịch vụ Google</div>
                              </div>
                            </button>

                            <button
                              onClick={() => {
                                addLog('fcm', true, 'Gửi Heartbeat FCM', 'Kích hoạt broadcast ping cổng FCM');
                                showToast('Đã gửi Heartbeat FCM thành công!');
                              }}
                              className="w-full p-2.5 rounded-xl bg-amber-600/25 border border-amber-500 flex items-center gap-3 text-left hover:bg-amber-600/35 transition cursor-pointer"
                            >
                              <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white shrink-0 shadow-md">
                                <Send className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-white">Gửi Heartbeat FCM</div>
                                <div className="text-[9px] text-amber-200">Đánh thức kết nối</div>
                              </div>
                            </button>

                            <button
                              onClick={() => {
                                addLog('fcm', true, 'Xóa cache FCM', 'Làm mới kết nối mạng & DNS');
                                showToast('Đã làm mới bộ nhớ cache FCM!');
                              }}
                              className="w-full p-2.5 rounded-xl bg-purple-600/25 border border-purple-500 flex items-center gap-3 text-left hover:bg-purple-600/35 transition cursor-pointer"
                            >
                              <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white shrink-0 shadow-md">
                                <Trash2 className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-white">Xóa cache FCM</div>
                                <div className="text-[9px] text-purple-200">Làm mới kết nối</div>
                              </div>
                            </button>

                            <button
                              onClick={() => {
                                setWhitelistProtected(true);
                                addLog('system', true, 'Khôi phục whitelist', 'Đã bảo vệ MILLET_NO_RESTRICT_APP');
                                showToast('Đã khôi phục whitelist thành công!');
                              }}
                              className="w-full p-2.5 rounded-xl bg-indigo-600/25 border border-indigo-500 flex items-center gap-3 text-left hover:bg-indigo-600/35 transition cursor-pointer"
                            >
                              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
                                <Layers className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-white">Khôi phục whitelist</div>
                                <div className="text-[9px] text-indigo-200">Thêm GMS vào danh sách</div>
                              </div>
                            </button>
                          </div>
                        )}

                        {/* SCREEN: ADVANCED SETTINGS */}
                        {currentScreen === 'advanced_settings' && (
                          <div className="flex-1 px-3 py-2 space-y-3 overflow-y-auto text-[10px]">
                            <div className="flex items-center gap-2 pb-1.5 border-b border-cyan-950">
                              <button onClick={() => setCurrentScreen('settings')} className="text-slate-400 hover:text-white">
                                <ArrowLeft className="w-4 h-4" />
                              </button>
                              <span className="text-xs font-bold text-white tracking-wide">Cài đặt nâng cao</span>
                            </div>

                            <div>
                              <h5 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                Tùy chọn hóa
                              </h5>
                              <div className="space-y-1">
                                <div className="p-1.5 rounded-lg bg-[#041224] border border-cyan-950 flex items-center justify-between">
                                  <span className="text-slate-200">Kích hoạt khi tắt màn hình</span>
                                  <input
                                    type="checkbox"
                                    checked={screenOffWake}
                                    onChange={(e) => setScreenOffWake(e.target.checked)}
                                    className="w-7 h-3.5 rounded-full accent-cyan-500 cursor-pointer"
                                  />
                                </div>
                                <div className="p-1.5 rounded-lg bg-[#041224] border border-cyan-950 flex items-center justify-between">
                                  <span className="text-slate-200">Kích hoạt khi mở khóa</span>
                                  <input
                                    type="checkbox"
                                    checked={unlockWake}
                                    onChange={(e) => setUnlockWake(e.target.checked)}
                                    className="w-7 h-3.5 rounded-full accent-cyan-500 cursor-pointer"
                                  />
                                </div>
                                <div className="p-1.5 rounded-lg bg-[#041224] border border-cyan-950 flex items-center justify-between">
                                  <span className="text-slate-200">Kích hoạt khi mạng reconnect</span>
                                  <input
                                    type="checkbox"
                                    checked={networkReconnectWake}
                                    onChange={(e) => setNetworkReconnectWake(e.target.checked)}
                                    className="w-7 h-3.5 rounded-full accent-cyan-500 cursor-pointer"
                                  />
                                </div>
                                <div className="p-1.5 rounded-lg bg-[#041224] border border-cyan-950 flex items-center justify-between">
                                  <span className="text-slate-200">Kích hoạt khi khởi động app</span>
                                  <input
                                    type="checkbox"
                                    checked={appStartWake}
                                    onChange={(e) => setAppStartWake(e.target.checked)}
                                    className="w-7 h-3.5 rounded-full accent-cyan-500 cursor-pointer"
                                  />
                                </div>
                              </div>
                            </div>

                            <div>
                              <h5 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                Tùy chọn khác
                              </h5>
                              <div className="space-y-1">
                                <div className="p-1.5 rounded-lg bg-[#041224] border border-cyan-950 flex items-center justify-between">
                                  <span className="text-slate-200">Thông báo thường trực</span>
                                  <input
                                    type="checkbox"
                                    checked={persistentNotification}
                                    onChange={(e) => setPersistentNotification(e.target.checked)}
                                    className="w-7 h-3.5 rounded-full accent-cyan-500 cursor-pointer"
                                  />
                                </div>
                                <div className="p-1.5 rounded-lg bg-[#041224] border border-cyan-950 flex items-center justify-between">
                                  <span className="text-slate-200">Ngôn ngữ</span>
                                  <span className="text-cyan-300 font-semibold">Tiếng Việt</span>
                                </div>
                                <div className="p-1.5 rounded-lg bg-[#041224] border border-cyan-950 flex items-center justify-between">
                                  <span className="text-slate-200">Tác giả</span>
                                  <span className="text-cyan-400 font-mono font-bold">YOUNGKNIGHT</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* SCREEN: ABOUT */}
                        {currentScreen === 'about' && (
                          <div className="flex-1 p-3 flex flex-col justify-between overflow-y-auto text-[10px]">
                            <div className="flex items-center gap-2 pb-1 border-b border-cyan-950">
                              <button onClick={() => setCurrentScreen('settings')} className="text-slate-400 hover:text-white">
                                <ArrowLeft className="w-4 h-4" />
                              </button>
                              <span className="text-xs font-bold text-white tracking-wide">Giới thiệu</span>
                            </div>

                            <div className="flex flex-col items-center text-center py-2">
                              <YkShieldLogo size={52} glow={true} />
                              <h4 className="text-xs font-black text-white mt-2">
                                FCM Guard <span className="text-cyan-400">V2</span>
                              </h4>
                              <p className="text-[9px] text-slate-400 font-mono">Phiên bản: 2.0.0</p>
                              <p className="text-[9px] text-cyan-300 mt-1 font-medium">
                                Giữ kết nối FCM – Không lo mất thông báo
                              </p>
                            </div>

                            <div className="space-y-1.5">
                              <div className="p-1.5 rounded-lg bg-[#041224] border border-cyan-950 flex items-center justify-between">
                                <span className="text-slate-400">👤 Tác giả</span>
                                <span className="text-cyan-400 font-bold">YOUNGKNIGHT</span>
                              </div>
                              <div className="p-1.5 rounded-lg bg-[#041224] border border-cyan-950 flex items-center justify-between">
                                <span className="text-slate-400">📱 Thiết bị hỗ trợ</span>
                                <span className="text-slate-200">Xiaomi 15 Ultra / HyperOS</span>
                              </div>
                              <div className="p-1.5 rounded-lg bg-[#041224] border border-cyan-950 flex items-center justify-between">
                                <span className="text-slate-400">🛡️ Yêu cầu</span>
                                <span className="text-emerald-400">Không cần Shizuku / Root</span>
                              </div>
                            </div>

                            <button
                              onClick={() => showToast('Cảm ơn bạn đã đồng hành cùng YOUNGKNIGHT!')}
                              className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition"
                            >
                              Cảm ơn bạn đã sử dụng!
                            </button>
                          </div>
                        )}

                        {/* PHONE BOTTOM NAVIGATION BAR */}
                        <div className="bg-[#030914]/95 backdrop-blur-md border-t border-cyan-900/40 px-6 py-2 flex items-center justify-around shrink-0">
                          <button
                            onClick={() => setCurrentScreen('home')}
                            className={`flex flex-col items-center gap-1 transition ${
                              currentScreen === 'home' || currentScreen === 'status_details' || currentScreen === 'quick_actions'
                                ? 'text-cyan-400 font-semibold'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <Shield className="w-4 h-4" />
                            <span className="text-[10px]">Trang chủ</span>
                          </button>

                          <button
                            onClick={() => setCurrentScreen('log')}
                            className={`flex flex-col items-center gap-1 transition ${
                              currentScreen === 'log' ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <Activity className="w-4 h-4" />
                            <span className="text-[10px]">Log</span>
                          </button>

                          <button
                            onClick={() => setCurrentScreen('settings')}
                            className={`flex flex-col items-center gap-1 transition ${
                              currentScreen === 'settings' || currentScreen === 'apps' || currentScreen === 'advanced_settings' || currentScreen === 'about'
                                ? 'text-cyan-400 font-semibold'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <Settings className="w-4 h-4" />
                            <span className="text-[10px]">Cài đặt</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Bottom Phone Gesture Bar */}
                    <div className="w-full py-1 flex justify-center bg-[#020914]">
                      <div className="w-24 h-1 rounded-full bg-slate-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: INTERACTIVE CONTROL PANEL & REAL-TIME SIMULATION SUITE */}
            <div className="lg:col-span-5 space-y-4">
              {/* Controls Card */}
              <div className="p-5 rounded-2xl bg-[#041122] border border-cyan-800/60 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-cyan-900/50 pb-3">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white">Bảng Điều Khiển Tình Huống Giả Lập</h3>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                    Interactive Lab
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Bấm các nút dưới đây để kích hoạt các tình huống thực tế của Xiaomi HyperOS và quan sát cách FCM Guard V2 tự động phát hiện, sửa lỗi và ghi log thời gian thực trên màn hình bên cạnh:
                </p>

                {/* Scenario buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    onClick={simulateFcmDrop}
                    className="p-3 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-amber-500 text-left transition flex items-start gap-2.5 hover:bg-slate-800 cursor-pointer"
                  >
                    <Radio className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-slate-200">Mất kết nối FCM</div>
                      <div className="text-[10px] text-slate-400">Kiểm tra tự động kết nối lại</div>
                    </div>
                  </button>

                  <button
                    onClick={simulateDoze}
                    className="p-3 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-cyan-500 text-left transition flex items-start gap-2.5 hover:bg-slate-800 cursor-pointer"
                  >
                    <Moon className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-slate-200">Kích hoạt chế độ Doze</div>
                      <div className="text-[10px] text-slate-400">Thử nghiệm đánh thức FCM</div>
                    </div>
                  </button>

                  <button
                    onClick={simulateWhitelistLoss}
                    className="p-3 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-rose-500 text-left transition flex items-start gap-2.5 hover:bg-slate-800 cursor-pointer"
                  >
                    <Layers className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-slate-200">Mất Whitelist GMS</div>
                      <div className="text-[10px] text-slate-400">Kiểm tra tự phục hồi MILLET</div>
                    </div>
                  </button>

                  <button
                    onClick={simulateNetworkSwitch}
                    className="p-3 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-emerald-500 text-left transition flex items-start gap-2.5 hover:bg-slate-800 cursor-pointer"
                  >
                    <Wifi className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-slate-200">Đổi Wi-Fi / 5G</div>
                      <div className="text-[10px] text-slate-400">Kiểm tra wake khi mạng đổi</div>
                    </div>
                  </button>
                </div>

                {/* Quick Screen Jumps */}
                <div className="pt-2 border-t border-cyan-900/40">
                  <div className="text-xs font-bold text-slate-300 mb-2">Chuyển nhanh màn hình giả lập:</div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => {
                        setIsLocked(false);
                        setCurrentScreen('home');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-cyan-900 text-[11px] text-cyan-300 hover:bg-cyan-950 font-medium cursor-pointer"
                    >
                      Trang chủ
                    </button>
                    <button
                      onClick={() => {
                        setIsLocked(false);
                        setCurrentScreen('log');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-cyan-900 text-[11px] text-cyan-300 hover:bg-cyan-950 font-medium cursor-pointer"
                    >
                      Nhật ký Log
                    </button>
                    <button
                      onClick={() => {
                        setIsLocked(false);
                        setCurrentScreen('apps');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-cyan-900 text-[11px] text-cyan-300 hover:bg-cyan-950 font-medium cursor-pointer"
                    >
                      Quản lý ứng dụng
                    </button>
                    <button
                      onClick={() => {
                        setIsLocked(false);
                        setCurrentScreen('quick_actions');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-cyan-900 text-[11px] text-cyan-300 hover:bg-cyan-950 font-medium cursor-pointer"
                    >
                      Hành động nhanh
                    </button>
                    <button
                      onClick={() => {
                        setIsLocked(false);
                        setCurrentScreen('status_details');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-cyan-900 text-[11px] text-cyan-300 hover:bg-cyan-950 font-medium cursor-pointer"
                    >
                      Chi tiết trạng thái
                    </button>
                    <button
                      onClick={() => setIsLocked(!isLocked)}
                      className="px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-600/60 text-[11px] text-purple-200 hover:bg-purple-900 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Lock className="w-3 h-3" /> {isLocked ? 'Mở màn hình' : 'Khóa màn hình'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Live Telemetry / Diagnostics Box */}
              <div className="p-5 rounded-2xl bg-[#041122] border border-cyan-800/60 shadow-xl space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-white border-b border-cyan-900/50 pb-2">
                  <span>Trạng Thái Hệ Thống Thời Gian Thực</span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Bảo vệ 24/7
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400">Thiết bị mô phỏng:</span>
                    <span className="font-semibold text-slate-200">Xiaomi 15 Ultra (HyperOS China ROM)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400">Dịch vụ nền Google:</span>
                    <span className="font-mono text-cyan-400 font-semibold">com.google.android.gms</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400">Khóa whitelist hệ thống:</span>
                    <span className="font-mono text-emerald-400 font-semibold">MILLET_NO_RESTRICT_APP</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400">Trạng thái quyền:</span>
                    <span className="text-emerald-400 font-semibold">WRITE_SETTINGS (Đã cấp)</span>
                  </div>
                </div>

                <button
                  onClick={runCheckAndRepair}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition active:scale-98"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  Kích hoạt kiểm tra toàn diện ngay
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* VIEW 2: FULL 9-SCREEN POSTER LAYOUT (BẢNG THIẾT KẾ 9 MÀN HÌNH CHUẨN POSTER) */}
      {viewMode === 'poster' && (
        <main className="max-w-[1520px] mx-auto px-4 py-8 space-y-10 flex-1 w-full">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-cyan-400" />
              Toàn Cảnh 9 Màn Hình FCM Guard V2 (Thiết Kế Chuẩn Hình Ảnh)
            </h2>
            <button
              onClick={() => setViewMode('emulator')}
              className="text-xs font-bold text-cyan-300 bg-cyan-950 border border-cyan-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-cyan-900 transition"
            >
              <Smartphone className="w-3.5 h-3.5" /> Chuyển sang Giả Lập Tương Tác
            </button>
          </div>

          {/* Row 1: 4 screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Screen 1: Home */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[310px] h-[610px] rounded-[36px] bg-[#020914] border-[3px] border-cyan-500/70 shadow-[0_0_25px_rgba(6,182,212,0.3)] flex flex-col overflow-hidden relative">
                <div className="px-4 pt-2.5 pb-1 flex items-center justify-between text-[11px] font-medium text-slate-200">
                  <span>10:24</span>
                  <div className="flex items-center gap-1.5">
                    <Wifi className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold">5G</span>
                    <div className="w-4 h-2 rounded-xs border border-current flex items-center p-0.5">
                      <div className="h-full w-full bg-current rounded-xs" />
                    </div>
                  </div>
                </div>

                <div className="px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <YkShieldLogo size={24} />
                    <span className="text-xs font-bold text-white tracking-wide">FCM Guard <span className="text-cyan-400">V2</span></span>
                  </div>
                  <Settings className="w-4 h-4 text-slate-400" />
                </div>

                <div className="flex-1 px-4 py-1.5 flex flex-col justify-between overflow-y-auto">
                  <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-emerald-300">Đang hoạt động</div>
                      <div className="text-[10px] text-emerald-400/80">Bảo vệ kết nối FCM của bạn</div>
                    </div>
                  </div>

                  <div className="my-2 relative flex items-center justify-center">
                    <div className="w-36 h-36 rounded-full border border-cyan-500/20 flex items-center justify-center animate-pulse">
                      <div className="w-28 h-28 rounded-full border-2 border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center bg-[#031526]/80">
                        <YkShieldLogo size={58} glow={true} />
                      </div>
                    </div>
                    <div className="absolute -bottom-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#020914] flex items-center justify-center shadow-lg">
                      <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="px-3 py-1.5 rounded-lg bg-[#041224] border border-cyan-900/40 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">FCM</div>
                          <div className="text-[9px] text-emerald-400">Đã kết nối</div>
                        </div>
                      </div>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    </div>

                    <div className="px-3 py-1.5 rounded-lg bg-[#041224] border border-cyan-900/40 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">GMS (Google Play services)</div>
                          <div className="text-[9px] text-emerald-400">Đang chạy</div>
                        </div>
                      </div>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    </div>

                    <div className="px-3 py-1.5 rounded-lg bg-[#041224] border border-cyan-900/40 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">Doze</div>
                          <div className="text-[9px] text-emerald-400">Không hoạt động</div>
                        </div>
                      </div>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    </div>

                    <div className="px-3 py-1.5 rounded-lg bg-[#041224] border border-cyan-900/40 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">Mạng</div>
                          <div className="text-[9px] text-emerald-400">Đã kết nối (Wi-Fi / LTE)</div>
                        </div>
                      </div>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                  </div>

                  <div className="text-center text-[10px] text-slate-400 pt-1">
                    Lần kiểm tra gần nhất: <br />
                    <span className="text-slate-300 font-mono font-medium">{lastCheckTime}</span>
                  </div>

                  <button
                    onClick={runCheckAndRepair}
                    className="w-full py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:brightness-110 text-white font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.6)] flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    Kiểm tra &amp; Sửa ngay
                  </button>
                </div>
              </div>
              <p className="text-xs font-bold text-cyan-300 mt-2.5 text-center">
                Màn hình chính – Trạng thái tổng quan
              </p>
            </div>

            {/* Screen 2: Logs */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[310px] h-[610px] rounded-[36px] bg-[#020914] border-[3px] border-cyan-500/70 shadow-[0_0_25px_rgba(6,182,212,0.3)] flex flex-col overflow-hidden relative">
                <div className="px-4 pt-2.5 pb-1 flex items-center justify-between text-[11px] font-medium text-slate-200">
                  <span>10:24</span>
                  <div className="flex items-center gap-1.5">
                    <Wifi className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold">5G</span>
                    <div className="w-4 h-2 rounded-xs border border-current flex items-center p-0.5">
                      <div className="h-full w-full bg-current rounded-xs" />
                    </div>
                  </div>
                </div>

                <div className="px-4 py-2 flex items-center justify-between border-b border-cyan-950/80">
                  <div className="flex items-center gap-2">
                    <YkShieldLogo size={22} />
                    <span className="text-xs font-bold text-white tracking-wide">FCM Guard <span className="text-cyan-400">V2</span></span>
                  </div>
                  <Search className="w-4 h-4 text-slate-400" />
                </div>

                <div className="px-3 pt-2.5 pb-2 space-y-2">
                  <h3 className="text-xs font-bold text-white">Nhật ký hoạt động</h3>
                  <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar">
                    {(['all', 'system', 'fcm', 'gms', 'doze'] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setLogFilter(f)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition shrink-0 ${
                          logFilter === f
                            ? 'bg-cyan-500 text-slate-950 font-bold'
                            : 'bg-[#05162a] text-slate-400 border border-cyan-900/50'
                        }`}
                      >
                        {f === 'all' ? 'Tất cả' : f === 'system' ? 'Hệ thống' : f.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 px-3 space-y-2 overflow-y-auto text-[10px]">
                  {filteredLogs.map((l) => (
                    <div
                      key={l.id}
                      className="p-2 rounded-lg bg-[#041224] border border-cyan-950 flex items-start gap-2"
                    >
                      <div className="font-mono text-slate-400 pt-0.5">{l.time}</div>
                      <div className="pt-0.5">
                        {l.success ? (
                          <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                            <AlertTriangle className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-200 truncate">{l.title}</div>
                        {l.desc && <div className="text-[9px] text-slate-400 truncate">{l.desc}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs font-bold text-cyan-300 mt-2.5 text-center">
                Nhật ký chi tiết – Theo dõi realtime
              </p>
            </div>

            {/* Screen 3: Settings */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[310px] h-[610px] rounded-[36px] bg-[#020914] border-[3px] border-cyan-500/70 shadow-[0_0_25px_rgba(6,182,212,0.3)] flex flex-col overflow-hidden relative">
                <div className="px-4 pt-2.5 pb-1 flex items-center justify-between text-[11px] font-medium text-slate-200">
                  <span>10:24</span>
                  <div className="flex items-center gap-1.5">
                    <Wifi className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold">5G</span>
                    <div className="w-4 h-2 rounded-xs border border-current flex items-center p-0.5">
                      <div className="h-full w-full bg-current rounded-xs" />
                    </div>
                  </div>
                </div>

                <div className="px-4 py-2 flex items-center gap-2 border-b border-cyan-950/80">
                  <Settings className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white tracking-wide">Cài đặt</span>
                </div>

                <div className="flex-1 px-3 py-2 space-y-3 overflow-y-auto text-[11px]">
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Tùy chọn chính
                    </h4>
                    <div className="space-y-1.5">
                      <div className="p-2 rounded-lg bg-[#041224] border border-cyan-950 flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-white">Tự khởi động cùng hệ thống</div>
                          <div className="text-[9px] text-slate-400">Tự động chạy lại sau khi khởi động</div>
                        </div>
                        <span className="w-3.5 h-3.5 rounded-full bg-cyan-400" />
                      </div>
                      <div className="p-2 rounded-lg bg-[#041224] border border-cyan-950 flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-white">Giám sát FCM/GMS</div>
                          <div className="text-[9px] text-slate-400">Kiểm tra và phục hồi khi bị ngắt</div>
                        </div>
                        <span className="w-3.5 h-3.5 rounded-full bg-cyan-400" />
                      </div>
                      <div className="p-2 rounded-lg bg-[#041224] border border-cyan-950 flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-white">Kiểm tra định kỳ</div>
                          <div className="text-[9px] text-slate-400">Tần suất kiểm tra trạng thái</div>
                        </div>
                        <span className="text-[10px] text-slate-400">15 phút &gt;</span>
                      </div>
                      <div className="p-2 rounded-lg bg-[#041224] border border-cyan-950 flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-white">Wake FCM khi có sự kiện</div>
                          <div className="text-[9px] text-slate-400">Màn hình, mở khóa, mạng...</div>
                        </div>
                        <span className="text-slate-400">&gt;</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Ứng dụng quan trọng
                    </h4>
                    <div className="space-y-1.5">
                      <div className="p-2 rounded-lg bg-[#041224] border border-cyan-950 flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-white">Quản lý danh sách ứng dụng</div>
                          <div className="text-[9px] text-slate-400">Thêm / xóa ứng dụng bảo vệ</div>
                        </div>
                        <span className="text-slate-400">&gt;</span>
                      </div>
                      <div className="p-2 rounded-lg bg-[#041224] border border-cyan-950 flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-white">MILLET_NO_RESTRICT_APP</div>
                          <div className="text-[9px] text-slate-400">Xem / khôi phục whitelist</div>
                        </div>
                        <span className="text-slate-400">&gt;</span>
                      </div>
                      <div className="p-2 rounded-lg bg-[#041224] border border-cyan-950 flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-white">Tối ưu pin</div>
                          <div className="text-[9px] text-slate-400">Giảm thiểu ảnh hưởng đến pin</div>
                        </div>
                        <span className="text-slate-400">&gt;</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs font-bold text-cyan-300 mt-2.5 text-center">
                Cài đặt – Tùy chỉnh theo nhu cầu
              </p>
            </div>

            {/* Screen 4: App Management */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[310px] h-[610px] rounded-[36px] bg-[#020914] border-[3px] border-cyan-500/70 shadow-[0_0_25px_rgba(6,182,212,0.3)] flex flex-col overflow-hidden relative">
                <div className="px-4 pt-2.5 pb-1 flex items-center justify-between text-[11px] font-medium text-slate-200">
                  <span>10:24</span>
                  <div className="flex items-center gap-1.5">
                    <Wifi className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold">5G</span>
                    <div className="w-4 h-2 rounded-xs border border-current flex items-center p-0.5">
                      <div className="h-full w-full bg-current rounded-xs" />
                    </div>
                  </div>
                </div>

                <div className="px-4 py-2 flex items-center justify-between border-b border-cyan-950/80">
                  <div className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-white tracking-wide">Quản lý ứng dụng</span>
                  </div>
                  <Search className="w-4 h-4 text-slate-400" />
                </div>

                <div className="px-3 pt-2.5 pb-1 flex items-center gap-1.5">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-cyan-500 text-slate-950">
                    Tất cả
                  </span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-[#041224] text-slate-400">
                    Được bảo vệ
                  </span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-[#041224] text-slate-400">
                    Chưa bảo vệ
                  </span>
                </div>

                <div className="flex-1 px-3 py-1.5 space-y-1.5 overflow-y-auto text-[11px]">
                  {apps.map((app) => (
                    <div
                      key={app.id}
                      className="p-2 rounded-lg bg-[#041224] border border-cyan-950 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-base shrink-0">{app.icon}</span>
                        <div className="min-w-0">
                          <div className="font-semibold text-white truncate text-[11px]">{app.name}</div>
                          {app.sub && <div className="text-[9px] text-slate-400 truncate">{app.sub}</div>}
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                        <Check className="w-2.5 h-2.5" /> Đã thêm
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs font-bold text-cyan-300 mt-2.5 text-center">
                Quản lý ứng dụng – Bảo vệ toàn diện
              </p>
            </div>
          </div>

          {/* Row 2: 5 screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 pt-4">
            {/* Screen 5: Status Details */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[280px] h-[580px] rounded-[34px] bg-[#020914] border-[3px] border-cyan-500/70 shadow-[0_0_20px_rgba(6,182,212,0.3)] flex flex-col overflow-hidden relative p-3 text-[10px] space-y-2">
                <div className="font-bold text-white text-xs pb-1 border-b border-cyan-950">
                  &larr; Chi tiết trạng thái
                </div>
                <div className="p-2 rounded-lg bg-[#041224] border border-cyan-950 space-y-1">
                  <div className="font-bold text-cyan-400">FCM</div>
                  <div className="flex justify-between"><span>&gt; Trạng thái kết nối</span><span className="text-emerald-400 font-semibold">Đã kết nối</span></div>
                  <div className="flex justify-between"><span>&gt; IP hiện tại</span><span>fcm... (ipn 10)</span></div>
                  <div className="flex justify-between"><span>&gt; Thời gian kết nối</span><span>10:22:37</span></div>
                </div>
                <div className="p-2 rounded-lg bg-[#041224] border border-cyan-950 space-y-1">
                  <div className="font-bold text-cyan-400">GMS</div>
                  <div className="flex justify-between"><span>&gt; Trạng thái</span><span className="text-emerald-400 font-semibold">Đang chạy</span></div>
                  <div className="flex justify-between"><span>&gt; Phiên bản</span><span>24.48.14 (xxxx)</span></div>
                  <div className="flex justify-between"><span>&gt; Tiến trình</span><span>com.google.android.gms</span></div>
                </div>
                <div className="p-2 rounded-lg bg-[#041224] border border-cyan-950 space-y-1">
                  <div className="font-bold text-cyan-400">Doze</div>
                  <div className="flex justify-between"><span>&gt; Trạng thái</span><span>Không hoạt động</span></div>
                  <div className="flex justify-between"><span>&gt; Chế độ tiết kiệm pin</span><span>Tắt</span></div>
                </div>
                <div className="p-2 rounded-lg bg-[#041224] border border-cyan-950 space-y-1">
                  <div className="font-bold text-cyan-400">Mạng</div>
                  <div className="flex justify-between"><span>&gt; Loại kết nối</span><span>Wi-Fi</span></div>
                  <div className="flex justify-between"><span>&gt; Độ mạnh tín hiệu</span><span className="text-emerald-400 font-semibold">Tốt</span></div>
                </div>
              </div>
              <p className="text-xs font-bold text-cyan-300 mt-2 text-center">Chi tiết trạng thái – Hiểu rõ vấn đề</p>
            </div>

            {/* Screen 6: Quick Actions */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[280px] h-[580px] rounded-[34px] bg-[#020914] border-[3px] border-cyan-500/70 shadow-[0_0_20px_rgba(6,182,212,0.3)] flex flex-col overflow-hidden relative p-3 text-[10px] space-y-2">
                <div className="font-bold text-white text-xs pb-1 border-b border-cyan-950">&larr; Hành động nhanh</div>
                <div className="p-2 rounded-xl bg-blue-600/30 border border-blue-500 flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center font-bold text-white">⚡</div>
                  <div><div className="font-bold text-white">Kiểm tra &amp; Sửa ngay</div><div className="text-[8px] text-blue-200">Đầy đủ quy trình</div></div>
                </div>
                <div className="p-2 rounded-xl bg-emerald-600/25 border border-emerald-500 flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-emerald-600 flex items-center justify-center font-bold text-white">🔄</div>
                  <div><div className="font-bold text-white">Khởi động lại GMS</div><div className="text-[8px] text-emerald-200">Sửa lỗi dịch vụ Google</div></div>
                </div>
                <div className="p-2 rounded-xl bg-amber-600/25 border border-amber-500 flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-amber-600 flex items-center justify-center font-bold text-white">⬆</div>
                  <div><div className="font-bold text-white">Gửi Heartbeat FCM</div><div className="text-[8px] text-amber-200">Đánh thức kết nối</div></div>
                </div>
                <div className="p-2 rounded-xl bg-purple-600/25 border border-purple-500 flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-purple-600 flex items-center justify-center font-bold text-white">🗑</div>
                  <div><div className="font-bold text-white">Xóa cache FCM</div><div className="text-[8px] text-purple-200">Làm mới kết nối</div></div>
                </div>
                <div className="p-2 rounded-xl bg-indigo-600/25 border border-indigo-500 flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-indigo-600 flex items-center justify-center font-bold text-white">⚙</div>
                  <div><div className="font-bold text-white">Khôi phục whitelist</div><div className="text-[8px] text-indigo-200">Thêm GMS vào danh sách</div></div>
                </div>
                <div className="p-2 rounded-xl bg-rose-600/25 border border-rose-500 flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-rose-600 flex items-center justify-center font-bold text-white">📱</div>
                  <div><div className="font-bold text-white">Kiểm tra ứng dụng FCM</div><div className="text-[8px] text-rose-200">Phát hiện ứng dụng bị chặn</div></div>
                </div>
              </div>
              <p className="text-xs font-bold text-cyan-300 mt-2 text-center">Hành động nhanh – Xử lý tức thì</p>
            </div>

            {/* Screen 7: Advanced Settings */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[280px] h-[580px] rounded-[34px] bg-[#020914] border-[3px] border-cyan-500/70 shadow-[0_0_20px_rgba(6,182,212,0.3)] flex flex-col overflow-hidden relative p-3 text-[10px] space-y-2">
                <div className="font-bold text-white text-xs pb-1 border-b border-cyan-950">&larr; Cài đặt nâng cao</div>
                <div className="space-y-1">
                  <div className="text-[9px] font-bold text-slate-400 uppercase">Tùy chọn hóa</div>
                  <div className="p-1.5 rounded-lg bg-[#041224] flex justify-between"><span>Kích hoạt khi tắt màn hình</span><span className="w-3 h-3 rounded-full bg-cyan-400" /></div>
                  <div className="p-1.5 rounded-lg bg-[#041224] flex justify-between"><span>Kích hoạt khi mở khóa</span><span className="w-3 h-3 rounded-full bg-cyan-400" /></div>
                  <div className="p-1.5 rounded-lg bg-[#041224] flex justify-between"><span>Kích hoạt khi mạng reconnect</span><span className="w-3 h-3 rounded-full bg-cyan-400" /></div>
                  <div className="p-1.5 rounded-lg bg-[#041224] flex justify-between"><span>Kích hoạt khi khởi động app</span><span className="w-3 h-3 rounded-full bg-cyan-400" /></div>
                </div>
                <div className="space-y-1 pt-1">
                  <div className="text-[9px] font-bold text-slate-400 uppercase">Tùy chọn khác</div>
                  <div className="p-1.5 rounded-lg bg-[#041224] flex justify-between"><span>Thông báo</span><span>&gt;</span></div>
                  <div className="p-1.5 rounded-lg bg-[#041224] flex justify-between"><span>Chế độ tối</span><span className="w-3 h-3 rounded-full bg-cyan-400" /></div>
                  <div className="p-1.5 rounded-lg bg-[#041224] flex justify-between"><span>Ngôn ngữ</span><span>Tiếng Việt &gt;</span></div>
                  <div className="p-1.5 rounded-lg bg-[#041224] flex justify-between"><span>Phiên bản YOUNGKNIGHT</span><span>2.0.0 &gt;</span></div>
                </div>
              </div>
              <p className="text-xs font-bold text-cyan-300 mt-2 text-center">Cài đặt nâng cao – Linh hoạt, thông minh</p>
            </div>

            {/* Screen 8: Notification */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[280px] h-[580px] rounded-[34px] bg-gradient-to-b from-[#0a192f] via-[#040e1e] to-[#010610] border-[3px] border-cyan-500/70 shadow-[0_0_20px_rgba(6,182,212,0.3)] flex flex-col overflow-hidden relative p-3">
                <div className="pt-10 text-center">
                  <div className="text-3xl font-light text-white">10:24</div>
                  <div className="text-[11px] text-slate-300">Th 4, 08 Th10</div>
                </div>
                <div className="mt-8 p-3 rounded-2xl bg-[#08182b]/90 border border-cyan-400/50 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-white">
                    <div className="flex items-center gap-1"><YkShieldLogo size={16} /> FCM Guard V2</div>
                    <span>&gt;</span>
                  </div>
                  <div className="text-xs font-semibold text-cyan-300">FCM đang kết nối ổn định</div>
                  <div className="text-[10px] text-slate-300">Tất cả dịch vụ hoạt động tốt!</div>
                </div>
                <div className="mt-auto mb-4 text-center text-slate-400">🔒</div>
              </div>
              <p className="text-xs font-bold text-cyan-300 mt-2 text-center">Thông báo – Luôn bên bạn</p>
            </div>

            {/* Screen 9: About */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[280px] h-[580px] rounded-[34px] bg-[#020914] border-[3px] border-cyan-500/70 shadow-[0_0_20px_rgba(6,182,212,0.3)] flex flex-col overflow-hidden relative p-3 text-[10px] justify-between">
                <div>
                  <div className="font-bold text-white text-xs pb-1 border-b border-cyan-950">&larr; Giới thiệu</div>
                  <div className="flex flex-col items-center text-center pt-3">
                    <YkShieldLogo size={48} glow={true} />
                    <h4 className="text-xs font-black text-white mt-1">FCM Guard V2</h4>
                    <p className="text-[9px] text-slate-400">Phiên bản: 2.0.0</p>
                    <p className="text-[9px] text-cyan-300/80 mt-1">Giữ kết nối FCM – Không lo mất thông báo</p>
                  </div>
                  <div className="space-y-1.5 my-3">
                    <div className="p-1.5 rounded-lg bg-[#041224] flex justify-between"><span>👤 Tác giả</span><span className="text-cyan-400 font-bold">YOUNGKNIGHT</span></div>
                    <div className="p-1.5 rounded-lg bg-[#041224] flex justify-between"><span>📱 Thiết bị hỗ trợ</span><span>Xiaomi (HyperOS)</span></div>
                    <div className="p-1.5 rounded-lg bg-[#041224] flex justify-between"><span>🛡️ Yêu cầu</span><span className="text-emerald-400">Không cần Shizuku / Root</span></div>
                    <div className="p-1.5 rounded-lg bg-[#041224] flex justify-between"><span>🌐 Mã nguồn</span><span>Dự án mã nguồn mở</span></div>
                  </div>
                </div>
                <button className="w-full py-2 rounded-xl bg-blue-600 text-white font-bold text-xs">
                  Cảm ơn bạn đã sử dụng!
                </button>
              </div>
              <p className="text-xs font-bold text-cyan-300 mt-2 text-center">Thông tin ứng dụng – Minh bạch, rõ ràng</p>
            </div>
          </div>
        </main>
      )}

      {/* VIEW 3: CI/CD WORKFLOW & ARTIFACT (TẢI APK) */}
      {viewMode === 'cicd' && (
        <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
          <div className="p-6 rounded-2xl bg-[#041122] border border-cyan-800/60 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileCode className="w-5 h-5 text-cyan-400" />
              Quy Trình Tự Động Build APK Android (GitHub Actions)
            </h2>
            <p className="text-xs text-slate-300">
              Dự án đã được tích hợp file <code>.github/workflows/build-apk.yml</code> với Gradle Wrapper 8.7 và cấu hình signing debug tự động.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-cyan-400 font-bold mb-1">Nhánh kích hoạt</div>
                <div className="font-mono text-slate-300">push: main</div>
                <div className="text-[10px] text-slate-400 mt-1">Hỗ trợ chạy thủ công workflow_dispatch</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-cyan-400 font-bold mb-1">Môi trường Java &amp; Gradle</div>
                <div className="text-slate-300">JDK 17 (Temurin) • Gradle 8.7</div>
                <div className="text-[10px] text-slate-400 mt-1">Android Gradle Plugin 8.6.1</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-emerald-400 font-bold mb-1">Tên Artifact tải về</div>
                <div className="font-mono text-emerald-300 font-bold">Xiaomi-Notification-Fix-Debug</div>
                <div className="text-[10px] text-slate-400 mt-1">app/build/outputs/apk/debug/app-debug.apk</div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setViewMode('emulator')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Smartphone className="w-4 h-4" /> Quay lại Giả lập kiểm tra
              </button>
            </div>
          </div>
        </main>
      )}

      {/* FOOTER */}
      <footer className="border-t border-cyan-950 py-4 text-center text-xs text-slate-500 bg-[#020713]">
        FCM Guard V2 (By YOUNGKNIGHT) • Trình giả lập tương tác Xiaomi HyperOS • Phiên bản 2.0.0
      </footer>
    </div>
  );
}
