import { useState } from "react";
import Icon from "@/components/ui/icon";

const ADMIN_PASSWORD = "%panelhelpera%";

const ROLES_LIST = [
  { name: "Владелец", color: "#ff00ff", count: 1 },
  { name: "Администратор", color: "#ff4466", count: 3 },
  { name: "Модератор", color: "#ffdd00", count: 6 },
  { name: "VIP", color: "#00ffff", count: 24 },
  { name: "Игрок", color: "#7777aa", count: 1214 },
];

const MOD_LOG = [
  { action: "Бан", target: "SpamUser123", admin: "CyberHawk", time: "5 мин назад", icon: "Ban", color: "#ff4444" },
  { action: "Мут", target: "ToxicPlayer", admin: "Admin_X", time: "20 мин назад", icon: "MicOff", color: "#ff8800" },
  { action: "Разбан", target: "FairPlayer", admin: "Admin_X", time: "2 ч назад", icon: "CheckCircle", color: "#00ff88" },
  { action: "Кик", target: "GlitchUser", admin: "CyberHawk", time: "3 ч назад", icon: "LogOut", color: "#ff6600" },
];

const RECENT_USERS = [
  { name: "CyberHawk", role: "Администратор", status: "online", joined: "1 янв 2025" },
  { name: "NeonByte", role: "Модератор", status: "online", joined: "15 фев 2025" },
  { name: "DarkWolf", role: "Игрок", status: "offline", joined: "3 мар 2025" },
  { name: "QuantumZ", role: "Игрок", status: "online", joined: "22 мар 2025" },
  { name: "SkyRider", role: "VIP", status: "offline", joined: "5 апр 2025" },
];

const FORUM_SECTIONS = [
  { id: 1, title: "Общий", icon: "MessageSquare", color: "#00ffff", posts: 312, online: 18 },
  { id: 2, title: "Объявления", icon: "Megaphone", color: "#ff00ff", posts: 24, online: 5 },
  { id: 3, title: "Игровой чат", icon: "Gamepad2", color: "#00ff88", posts: 874, online: 31 },
  { id: 4, title: "Предложения", icon: "Lightbulb", color: "#ffdd00", posts: 156, online: 7 },
];

const FORUM_TOPICS = [
  { title: "Как повысить свой ранг?", author: "DarkWolf", replies: 12, views: 340, time: "10 мин назад", pinned: true },
  { title: "Баг с инвентарём — не сохраняется", author: "SkyRider", replies: 4, views: 98, time: "1 ч назад", pinned: false },
  { title: "Набор в клан [NEON]", author: "NeonByte", replies: 27, views: 510, time: "2 ч назад", pinned: false },
  { title: "Обновление сервера 2.4.1", author: "CyberHawk", replies: 44, views: 1200, time: "вчера", pinned: true },
  { title: "Правила форума — читать всем", author: "Admin_X", replies: 0, views: 3400, time: "3 дня назад", pinned: true },
];

type ForumView = "main" | "section";
type AdminTab = "dashboard" | "users" | "actions" | "logs" | "roles" | "settings";

const RgbTitle = ({ children, gradient }: { children: React.ReactNode; gradient: string }) => (
  <h3 className="font-oswald font-bold text-2xl uppercase"
    style={{ background: gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 0 10px rgba(180,0,255,0.3))" }}>
    {children}
  </h3>
);

// ══════════════════════════════════════════════
//  МОДАЛЬНОЕ ОКНО АВТОРИЗАЦИИ В АДМИНКУ
// ══════════════════════════════════════════════
function AdminLoginModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = () => {
    if (password === ADMIN_PASSWORD) {
      onSuccess();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(16px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`w-full max-w-md slide-up ${shake ? "animate-[shake_0.4s_ease]" : ""}`}>
        <div className="card-glass rounded-3xl p-8 space-y-5"
          style={{
            border: error ? "1px solid #ff444455" : "1px solid rgba(119,0,255,0.35)",
            boxShadow: error ? "0 0 40px #ff444422" : "0 0 40px #7700ff33"
          }}>
          <div className="text-center mb-2">
            <div className="inline-flex w-16 h-16 rounded-2xl items-center justify-center mb-3 rgb-border float-anim"
              style={{ background: "linear-gradient(135deg,#ff00ff18,#7700ff18)" }}>
              <Icon name="ShieldCheck" size={30} className="rgb-text" />
            </div>
            <h2 className="font-oswald font-black text-2xl tracking-widest uppercase"
              style={{
                background: "linear-gradient(90deg,#ff00ff,#7700ff,#00ffff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "rgb-bg 4s linear infinite",
                backgroundSize: "300% 100%"
              }}>
              ADMIN PANEL
            </h2>
            <p className="text-white/30 text-xs mt-1 tracking-widest uppercase">Введите пароль для входа</p>
          </div>

          <div>
            <div className="relative">
              <input type="password" value={password}
                onChange={e => { setPassword(e.target.value); setError(false); }}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder="••••••••••••"
                className="w-full bg-white/5 border rounded-xl px-4 py-4 text-white text-sm outline-none transition-all placeholder:text-white/15 pr-12"
                style={{ borderColor: error ? "#ff444466" : "rgba(255,255,255,0.1)" }}
              />
              <Icon name="Lock" size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20" />
            </div>
            {error && (
              <p className="text-xs mt-2 flex items-center gap-1" style={{ color: "#ff4466" }}>
                <Icon name="AlertCircle" size={12} />
                Неверный пароль
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={onClose}
              className="flex-1 py-3 rounded-xl font-bold text-sm text-white/40 hover:text-white/70 transition-colors card-glass">
              Отмена
            </button>
            <button onClick={handleSubmit}
              className="flex-1 py-3 rounded-xl font-oswald font-bold text-sm tracking-widest text-white uppercase transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg,#ff00ff,#7700ff)", boxShadow: "0 0 20px #7700ff55" }}>
              ВОЙТИ
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}`}</style>
    </div>
  );
}

// ══════════════════════════════════════════════
//  АДМИН ПАНЕЛЬ
// ══════════════════════════════════════════════
function AdminPanel({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [actionTarget, setActionTarget] = useState("");
  const [actionReason, setActionReason] = useState("");
  const [actionDuration, setActionDuration] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleColor, setNewRoleColor] = useState("#7700ff");
  const [editRoleIdx, setEditRoleIdx] = useState<number | null>(null);
  const [roles, setRoles] = useState(ROLES_LIST);
  const [toast, setToast] = useState<{ msg: string; color: string } | null>(null);
  const [forumSettings, setForumSettings] = useState({
    forumName: "ФОРУМ",
    maxBanDays: "30",
    muteDuration: "60",
    welcomeMsg: "Добро пожаловать на форум!",
    maintenanceMode: false,
    regOpen: true,
    chatEnabled: true,
    floodProtect: true,
  });

  const showToast = (msg: string, color: string) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  };

  const tabs: { id: AdminTab; label: string; icon: string }[] = [
    { id: "dashboard", label: "Обзор", icon: "LayoutDashboard" },
    { id: "users", label: "Игроки", icon: "Users" },
    { id: "actions", label: "Действия", icon: "Gavel" },
    { id: "logs", label: "Логи", icon: "ScrollText" },
    { id: "roles", label: "Роли", icon: "Award" },
    { id: "settings", label: "Настройки", icon: "Settings" },
  ];

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto" style={{ background: "rgba(4,4,14,0.98)", backdropFilter: "blur(24px)" }}>
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl font-semibold text-sm text-white slide-up flex items-center gap-2"
          style={{ background: toast.color + "ee", boxShadow: `0 0 24px ${toast.color}88`, backdropFilter: "blur(12px)" }}>
          <Icon name="CheckCircle" size={16} />
          {toast.msg}
        </div>
      )}

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-10 float-anim"
          style={{ background: "radial-gradient(circle, #ff00ff, transparent 70%)" }} />
        <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-10 float-anim"
          style={{ background: "radial-gradient(circle, #00ffff, transparent 70%)", animationDelay: "2s" }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 px-6 py-4 border-b border-white/8"
        style={{ background: "rgba(4,4,14,0.95)", backdropFilter: "blur(24px)" }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center rgb-border"
              style={{ background: "linear-gradient(135deg,#ff00ff18,#7700ff18)" }}>
              <Icon name="ShieldCheck" size={20} className="rgb-text" />
            </div>
            <div>
              <h1 className="font-oswald font-black text-xl tracking-widest uppercase"
                style={{
                  background: "linear-gradient(90deg,#ff00ff,#7700ff,#00ffff,#ff00ff)",
                  backgroundSize: "300% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: "rgb-bg 4s linear infinite"
                }}>
                ADMIN PANEL
              </h1>
              <p className="text-white/25 text-xs tracking-widest uppercase">Управление форумом</p>
            </div>
          </div>
          <button onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white/50 hover:text-white transition-colors card-glass">
            <Icon name="ArrowLeft" size={15} />
            На форум
          </button>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Табы */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 mb-8 p-1 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300"
              style={activeTab === tab.id ? {
                background: "linear-gradient(135deg,#ff00ff22,#7700ff44,#00ffff22)",
                border: "1px solid #7700ff55",
                boxShadow: "0 0 20px #7700ff33",
                color: "#fff"
              } : { color: "rgba(255,255,255,0.35)" }}>
              <Icon name={tab.icon} size={15} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── ОБЗОР ── */}
        {activeTab === "dashboard" && (
          <div className="space-y-6 slide-up">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Пользователей", value: "1 248", icon: "Users", color: "#ff00ff" },
                { label: "Онлайн", value: "42", icon: "Zap", color: "#00ff88" },
                { label: "Жалоб", value: "4", icon: "AlertTriangle", color: "#ff4466" },
                { label: "Банов сегодня", value: "7", icon: "Ban", color: "#ff6600" },
              ].map((s, i) => (
                <div key={s.label} className={`card-glass rounded-2xl p-5 section-delay-${i + 1}`}
                  style={{ borderColor: s.color + "33" }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: s.color + "22", boxShadow: `0 0 16px ${s.color}33` }}>
                      <Icon name={s.icon} size={18} style={{ color: s.color }} />
                    </div>
                  </div>
                  <div className="font-oswald font-black text-3xl"
                    style={{ color: s.color, filter: `drop-shadow(0 0 8px ${s.color}88)` }}>{s.value}</div>
                  <div className="text-white/40 text-xs mt-1">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="card-glass rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
                <Icon name="Activity" size={16} style={{ color: "#00ffff" }} />
                <span className="font-oswald font-bold text-white tracking-wide">ПОСЛЕДНИЕ ДЕЙСТВИЯ</span>
              </div>
              <div className="divide-y divide-white/5">
                {MOD_LOG.map((log, i) => (
                  <div key={i} className="px-5 py-3 flex items-center justify-between hover:bg-white/2 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: log.color + "22" }}>
                        <Icon name={log.icon} size={13} style={{ color: log.color }} />
                      </div>
                      <span className="text-white/80 text-sm">
                        <span className="font-semibold">{log.action}</span>
                        <span className="text-white/40"> → </span>
                        <span>{log.target}</span>
                      </span>
                    </div>
                    <span className="text-white/25 text-xs">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── ИГРОКИ ── */}
        {activeTab === "users" && (
          <div className="space-y-4 slide-up">
            <RgbTitle gradient="linear-gradient(90deg,#ff00ff,#7700ff,#00ffff)">ПОЛЬЗОВАТЕЛИ</RgbTitle>
            <div className="card-glass rounded-2xl overflow-hidden">
              <div className="divide-y divide-white/5">
                {RECENT_USERS.map((u, i) => (
                  <div key={i} className="px-5 py-4 flex items-center justify-between hover:bg-white/3 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center font-oswald font-bold"
                        style={{ background: "linear-gradient(135deg,#7700ff33,#ff00ff22)", border: "1px solid #7700ff44" }}>
                        <span className="text-white">{u.name[0]}</span>
                      </div>
                      <div>
                        <div className="text-white font-semibold text-sm flex items-center gap-2">
                          {u.name}
                          <span className="inline-block w-1.5 h-1.5 rounded-full"
                            style={{ background: u.status === "online" ? "#00ff88" : "#555", boxShadow: u.status === "online" ? "0 0 6px #00ff88" : "none" }} />
                        </div>
                        <div className="text-white/30 text-xs">С {u.joined}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{ color: roles.find(r => r.name === u.role)?.color || "#aaa", background: (roles.find(r => r.name === u.role)?.color || "#aaa") + "22" }}>
                        {u.role}
                      </span>
                      <button onClick={() => { setActionTarget(u.name); setActiveTab("actions"); }}
                        className="px-2 py-1 rounded-lg text-xs font-semibold text-white/50 hover:text-white transition-colors card-glass">
                        Действие
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── ДЕЙСТВИЯ ── */}
        {activeTab === "actions" && (
          <div className="space-y-5 slide-up">
            <RgbTitle gradient="linear-gradient(90deg,#ff4444,#ff00ff,#7700ff)">ДЕЙСТВИЯ С ИГРОКОМ</RgbTitle>

            <div className="card-glass rounded-2xl p-5 space-y-4" style={{ borderColor: "#ff00ff33" }}>
              <h4 className="text-white/50 text-xs uppercase tracking-widest">Цель действия</h4>
              <div className="flex gap-3">
                <input value={actionTarget} onChange={e => setActionTarget(e.target.value)}
                  placeholder="Никнейм игрока..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#ff00ff] transition-colors placeholder:text-white/20" />
                <input value={actionDuration} onChange={e => setActionDuration(e.target.value)}
                  placeholder="Срок (мин/ч)"
                  className="w-36 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#ff00ff] transition-colors placeholder:text-white/20" />
              </div>
              <input value={actionReason} onChange={e => setActionReason(e.target.value)}
                placeholder="Причина..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#ff00ff] transition-colors placeholder:text-white/20" />
            </div>

            {/* Наказания */}
            <div className="card-glass rounded-2xl p-5" style={{ borderColor: "#ff444433" }}>
              <h4 className="font-oswald font-bold text-sm uppercase tracking-widest mb-4" style={{ color: "#ff4444" }}>⚠ НАКАЗАНИЯ</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Бан", icon: "Ban", color: "#ff3333", desc: "Полная блокировка" },
                  { label: "Мут", icon: "MicOff", color: "#ff8800", desc: "Запрет сообщений" },
                  { label: "Кик с сайта", icon: "LogOut", color: "#ffdd00", desc: "Принудительный выход" },
                  { label: "Варн", icon: "AlertOctagon", color: "#ff6600", desc: "Предупреждение" },
                ].map(a => (
                  <button key={a.label}
                    onClick={() => showToast(`${a.label} применён к ${actionTarget || "игроку"}`, a.color)}
                    className="flex flex-col items-start gap-3 p-4 rounded-2xl transition-all hover:scale-105 active:scale-95 text-left"
                    style={{ background: a.color + "15", border: `1px solid ${a.color}33` }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: a.color + "25", boxShadow: `0 0 14px ${a.color}44` }}>
                      <Icon name={a.icon} size={20} style={{ color: a.color }} />
                    </div>
                    <div>
                      <div className="font-oswald font-bold text-base" style={{ color: a.color }}>{a.label}</div>
                      <div className="text-white/35 text-xs">{a.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Снятие */}
            <div className="card-glass rounded-2xl p-5" style={{ borderColor: "#00ff8833" }}>
              <h4 className="font-oswald font-bold text-sm uppercase tracking-widest mb-4" style={{ color: "#00ff88" }}>✓ СНЯТИЕ НАКАЗАНИЙ</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { label: "Разбан", icon: "ShieldCheck", color: "#00ff88", desc: "Снять бан" },
                  { label: "Размут", icon: "Mic", color: "#00ffcc", desc: "Снять мут" },
                  { label: "Разварн", icon: "CheckCircle", color: "#aaffaa", desc: "Снять варн" },
                ].map(a => (
                  <button key={a.label}
                    onClick={() => showToast(`${a.label} применён к ${actionTarget || "игроку"}`, a.color)}
                    className="flex flex-col items-start gap-3 p-4 rounded-2xl transition-all hover:scale-105 active:scale-95 text-left"
                    style={{ background: a.color + "15", border: `1px solid ${a.color}33` }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: a.color + "25", boxShadow: `0 0 14px ${a.color}44` }}>
                      <Icon name={a.icon} size={20} style={{ color: a.color }} />
                    </div>
                    <div>
                      <div className="font-oswald font-bold text-base" style={{ color: a.color }}>{a.label}</div>
                      <div className="text-white/35 text-xs">{a.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Роли */}
            <div className="card-glass rounded-2xl p-5" style={{ borderColor: "#7700ff33" }}>
              <h4 className="font-oswald font-bold text-sm uppercase tracking-widest mb-4" style={{ color: "#aa44ff" }}>🎖 УПРАВЛЕНИЕ РОЛЯМИ</h4>
              <div className="flex flex-wrap gap-3 mb-4">
                {[
                  { label: "Выдать роль", icon: "Plus", color: "#7700ff" },
                  { label: "Забрать роль", icon: "Minus", color: "#ff4466" },
                ].map(a => (
                  <button key={a.label}
                    onClick={() => showToast(`${a.label}: ${actionTarget || "игрок"}`, a.color)}
                    className="flex items-center gap-3 px-5 py-3 rounded-2xl transition-all hover:scale-105"
                    style={{ background: a.color + "15", border: `1px solid ${a.color}33` }}>
                    <Icon name={a.icon} size={16} style={{ color: a.color }} />
                    <span className="font-oswald font-bold text-sm" style={{ color: a.color }}>{a.label}</span>
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {roles.map(r => (
                  <button key={r.name} onClick={() => setSelectedRole(r.name)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105"
                    style={{
                      background: selectedRole === r.name ? r.color + "44" : r.color + "18",
                      border: `1px solid ${r.color}${selectedRole === r.name ? "88" : "33"}`,
                      color: r.color,
                      boxShadow: selectedRole === r.name ? `0 0 12px ${r.color}55` : "none"
                    }}>
                    {r.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── ЛОГИ ── */}
        {activeTab === "logs" && (
          <div className="space-y-4 slide-up">
            <RgbTitle gradient="linear-gradient(90deg,#ff6600,#ffdd00,#00ffff)">ЖУРНАЛ ДЕЙСТВИЙ</RgbTitle>
            <div className="card-glass rounded-2xl overflow-hidden">
              <div className="divide-y divide-white/5">
                {[...MOD_LOG, ...MOD_LOG].map((log, i) => (
                  <div key={i} className="px-5 py-4 flex items-center justify-between hover:bg-white/2 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: log.color + "22", boxShadow: `0 0 10px ${log.color}33` }}>
                        <Icon name={log.icon} size={16} style={{ color: log.color }} />
                      </div>
                      <div>
                        <div className="text-white text-sm">
                          <span className="font-bold">{log.action}</span>
                          <span className="text-white/40"> → </span>
                          <span className="text-white/80">{log.target}</span>
                        </div>
                        <div className="text-white/30 text-xs">Администратор: {log.admin}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ color: log.color, background: log.color + "18" }}>{log.action}</span>
                      <div className="text-white/20 text-xs mt-1">{log.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── РОЛИ ── */}
        {activeTab === "roles" && (
          <div className="space-y-4 slide-up">
            <div className="flex items-center justify-between mb-2">
              <RgbTitle gradient="linear-gradient(90deg,#7700ff,#ff00ff,#00ffff)">РОЛИ</RgbTitle>
              <button onClick={() => setEditRoleIdx(-1)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white hover:scale-105 transition-all"
                style={{ background: "linear-gradient(135deg,#ff00ff,#7700ff)", boxShadow: "0 0 16px #ff00ff44" }}>
                <Icon name="Plus" size={15} />Создать роль
              </button>
            </div>

            {editRoleIdx !== null && (
              <div className="card-glass rounded-2xl p-5 space-y-4 slide-up" style={{ borderColor: "#ff00ff33" }}>
                <h4 className="font-oswald font-bold text-lg text-white">
                  {editRoleIdx === -1 ? "Создать роль" : `Изменить: ${roles[editRoleIdx]?.name}`}
                </h4>
                <div className="flex gap-3">
                  <input value={newRoleName} onChange={e => setNewRoleName(e.target.value)}
                    placeholder="Название роли"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#ff00ff] transition-colors placeholder:text-white/20" />
                  <div className="flex items-center gap-2">
                    <label className="text-white/40 text-xs">Цвет</label>
                    <input type="color" value={newRoleColor} onChange={e => setNewRoleColor(e.target.value)}
                      className="w-12 h-12 rounded-xl cursor-pointer border-0 bg-transparent" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => {
                    if (!newRoleName.trim()) return;
                    if (editRoleIdx === -1) {
                      setRoles(r => [...r, { name: newRoleName, color: newRoleColor, count: 0 }]);
                      showToast(`Роль "${newRoleName}" создана`, newRoleColor);
                    } else {
                      setRoles(r => r.map((role, i) => i === editRoleIdx ? { ...role, name: newRoleName, color: newRoleColor } : role));
                      showToast("Роль обновлена", newRoleColor);
                    }
                    setEditRoleIdx(null); setNewRoleName(""); setNewRoleColor("#7700ff");
                  }}
                    className="px-5 py-2 rounded-xl font-bold text-sm text-white hover:scale-105 transition-all"
                    style={{ background: "linear-gradient(135deg,#ff00ff,#7700ff)" }}>
                    Сохранить
                  </button>
                  <button onClick={() => { setEditRoleIdx(null); setNewRoleName(""); setNewRoleColor("#7700ff"); }}
                    className="px-5 py-2 rounded-xl font-bold text-sm text-white/50 hover:text-white transition-colors card-glass">
                    Отмена
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {roles.map((role, i) => (
                <div key={role.name} className="card-glass rounded-2xl p-5 flex items-center justify-between"
                  style={{ borderColor: role.color + "33" }}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: role.color + "18", border: `1px solid ${role.color}44`, boxShadow: `0 0 16px ${role.color}33` }}>
                      <Icon name="Award" size={20} style={{ color: role.color }} />
                    </div>
                    <div>
                      <div className="font-oswald font-bold text-lg" style={{ color: role.color, filter: `drop-shadow(0 0 8px ${role.color}66)` }}>{role.name}</div>
                      <div className="text-white/40 text-xs">{role.count} участников</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditRoleIdx(i); setNewRoleName(role.name); setNewRoleColor(role.color); }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold hover:scale-105 transition-all"
                      style={{ background: role.color + "22", color: role.color, border: `1px solid ${role.color}33` }}>
                      Изменить
                    </button>
                    <button onClick={() => { setRoles(r => r.filter((_, idx) => idx !== i)); showToast("Роль удалена", "#ff4444"); }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:scale-110 transition-all"
                      style={{ background: "#ff444418", border: "1px solid #ff444433" }}>
                      <Icon name="Trash2" size={13} style={{ color: "#ff4444" }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── НАСТРОЙКИ ── */}
        {activeTab === "settings" && (
          <div className="space-y-6 slide-up">
            <RgbTitle gradient="linear-gradient(90deg,#00ffff,#7700ff,#ff00ff)">НАСТРОЙКИ ФОРУМА</RgbTitle>

            <div className="card-glass rounded-2xl p-6 space-y-5" style={{ borderColor: "#00ffff33" }}>
              <h4 className="font-oswald font-bold text-sm uppercase tracking-widest" style={{ color: "#00ffff" }}>Основные</h4>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { key: "forumName" as const, label: "Название форума" },
                  { key: "maxBanDays" as const, label: "Макс. срок бана (дней)" },
                  { key: "muteDuration" as const, label: "Мут по умолчанию (мин)" },
                  { key: "welcomeMsg" as const, label: "Приветственное сообщение" },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">{f.label}</label>
                    <input value={forumSettings[f.key] as string}
                      onChange={e => setForumSettings(s => ({ ...s, [f.key]: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#00ffff] transition-colors" />
                  </div>
                ))}
              </div>
            </div>

            <div className="card-glass rounded-2xl p-6 space-y-3" style={{ borderColor: "#7700ff33" }}>
              <h4 className="font-oswald font-bold text-sm uppercase tracking-widest" style={{ color: "#aa44ff" }}>Управление сервером</h4>
              {[
                { key: "maintenanceMode" as const, label: "Режим техработ", desc: "Скрыть форум для игроков", color: "#ff8800", icon: "Wrench" },
                { key: "regOpen" as const, label: "Регистрация открыта", desc: "Разрешить новых пользователей", color: "#00ff88", icon: "UserPlus" },
                { key: "chatEnabled" as const, label: "Чат включён", desc: "Глобальный чат форума", color: "#00ffff", icon: "MessageSquare" },
                { key: "floodProtect" as const, label: "Защита от флуда", desc: "Ограничение частоты сообщений", color: "#7700ff", icon: "Shield" },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/3 transition-colors"
                  style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: item.color + "22" }}>
                      <Icon name={item.icon} size={16} style={{ color: item.color }} />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{item.label}</div>
                      <div className="text-white/30 text-xs">{item.desc}</div>
                    </div>
                  </div>
                  <button onClick={() => setForumSettings(s => ({ ...s, [item.key]: !s[item.key] }))}
                    className="w-12 h-6 rounded-full relative transition-all duration-300 flex-shrink-0"
                    style={{ background: forumSettings[item.key] ? `linear-gradient(90deg,${item.color}99,${item.color})` : "rgba(255,255,255,0.1)", boxShadow: forumSettings[item.key] ? `0 0 12px ${item.color}66` : "none" }}>
                    <span className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow"
                      style={{ left: forumSettings[item.key] ? "calc(100% - 20px)" : "4px" }} />
                  </button>
                </div>
              ))}
            </div>

            <button onClick={() => showToast("Настройки сохранены!", "#00ff88")}
              className="w-full py-4 rounded-2xl font-oswald font-bold text-sm tracking-widest text-white uppercase hover:scale-[1.01] transition-all"
              style={{ background: "linear-gradient(135deg,#7700ff,#ff00ff,#00ffff)", backgroundSize: "200% 100%", animation: "rgb-bg 5s linear infinite", boxShadow: "0 0 24px #7700ff44" }}>
              СОХРАНИТЬ НАСТРОЙКИ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
//  ФОРУМ (главная страница)
// ══════════════════════════════════════════════
function Forum({ onAdminOpen }: { onAdminOpen: () => void }) {
  const [view, setView] = useState<ForumView>("main");
  const [activeSection, setActiveSection] = useState(FORUM_SECTIONS[0]);

  return (
    <div className="min-h-screen gradient-bg font-montserrat">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-10 float-anim"
          style={{ background: "radial-gradient(circle, #ff00ff, transparent 70%)" }} />
        <div className="absolute top-[40%] right-[-20%] w-[500px] h-[500px] rounded-full opacity-10 float-anim"
          style={{ background: "radial-gradient(circle, #00ffff, transparent 70%)", animationDelay: "2s" }} />
        <div className="absolute bottom-[-15%] left-[25%] w-[500px] h-[500px] rounded-full opacity-10 float-anim"
          style={{ background: "radial-gradient(circle, #7700ff, transparent 70%)", animationDelay: "4s" }} />
      </div>

      {/* Header */}
      <header className="relative z-20 px-6 py-4 border-b border-white/8"
        style={{ background: "rgba(4,4,14,0.9)", backdropFilter: "blur(24px)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView("main")}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center rgb-border"
              style={{ background: "linear-gradient(135deg,#ff00ff18,#7700ff18)" }}>
              <Icon name="Swords" size={20} className="rgb-text" />
            </div>
            <h1 className="font-oswald font-black text-2xl tracking-[0.3em] uppercase"
              style={{
                background: "linear-gradient(90deg,#ff00ff,#7700ff,#00ffff,#ff00ff)",
                backgroundSize: "300% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "rgb-bg 4s linear infinite",
                filter: "drop-shadow(0 0 12px #ff00ff66)"
              }}>
              ФОРУМ
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ background: "#00ff8818", border: "1px solid #00ff8833" }}>
              <span className="inline-block w-2 h-2 rounded-full" style={{ background: "#00ff88", boxShadow: "0 0 8px #00ff88" }} />
              <span className="text-xs font-semibold" style={{ color: "#00ff88" }}>42 онлайн</span>
            </div>
            {/* Кнопка Админ панель */}
            <button onClick={onAdminOpen}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-oswald font-bold text-sm text-white transition-all hover:scale-105 neon-btn"
              style={{
                background: "linear-gradient(135deg,#ff00ff33,#7700ff44)",
                border: "1px solid #7700ff66",
                boxShadow: "0 0 16px #7700ff44"
              }}>
              <Icon name="ShieldCheck" size={15} style={{ color: "#ff00ff" }} />
              <span className="rgb-text">Админ панель</span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8">

        {view === "main" && (
          <div className="space-y-8">
            {/* Hero */}
            <div className="slide-up text-center py-10">
              <p className="text-white/25 font-oswald tracking-[0.5em] text-xs mb-3 uppercase">Добро пожаловать</p>
              <h2 className="font-oswald font-black text-5xl md:text-7xl uppercase mb-4 tracking-wider"
                style={{
                  background: "linear-gradient(90deg,#ff00ff,#7700ff,#00ffff,#ff00ff)",
                  backgroundSize: "300% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: "rgb-bg 5s linear infinite",
                  filter: "drop-shadow(0 0 24px #ff00ff44)"
                }}>
                ФОРУМ
              </h2>
              <p className="text-white/40 text-sm max-w-md mx-auto">Сообщество игроков. Общение, новости, поддержка.</p>
            </div>

            {/* Разделы */}
            <div className="grid md:grid-cols-2 gap-4">
              {FORUM_SECTIONS.map((s, i) => (
                <button key={s.id} onClick={() => { setActiveSection(s); setView("section"); }}
                  className={`card-glass rounded-2xl p-6 text-left group slide-up section-delay-${i + 1}`}
                  style={{ borderColor: s.color + "33" }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ background: s.color + "22", boxShadow: `0 0 20px ${s.color}33` }}>
                      <Icon name={s.icon} size={22} style={{ color: s.color }} />
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold" style={{ color: s.color }}>{s.online} онлайн</div>
                      <div className="text-white/25 text-xs">{s.posts} тем</div>
                    </div>
                  </div>
                  <h3 className="font-oswald font-bold text-xl text-white mb-1">{s.title}</h3>
                  <div className="flex items-center gap-1 mt-3 text-xs font-semibold group-hover:gap-2 transition-all"
                    style={{ color: s.color }}>
                    Открыть <Icon name="ArrowRight" size={13} />
                  </div>
                </button>
              ))}
            </div>

            {/* Последние темы */}
            <div className="card-glass rounded-2xl overflow-hidden slide-up">
              <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
                <Icon name="Flame" size={16} style={{ color: "#ff6600" }} />
                <span className="font-oswald font-bold text-white tracking-wide">ПОСЛЕДНИЕ ТЕМЫ</span>
              </div>
              <div className="divide-y divide-white/5">
                {FORUM_TOPICS.map((t, i) => (
                  <div key={i} className="px-5 py-4 flex items-center justify-between hover:bg-white/3 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3 min-w-0">
                      {t.pinned && <Icon name="Pin" size={13} style={{ color: "#ff00ff", flexShrink: 0 }} />}
                      <div className="min-w-0">
                        <div className="text-white font-semibold text-sm truncate">{t.title}</div>
                        <div className="text-white/30 text-xs">от {t.author} · {t.time}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                      <div className="text-center hidden sm:block">
                        <div className="text-white/60 text-xs font-semibold">{t.replies}</div>
                        <div className="text-white/20 text-xs">ответов</div>
                      </div>
                      <div className="text-center hidden sm:block">
                        <div className="text-white/60 text-xs font-semibold">{t.views}</div>
                        <div className="text-white/20 text-xs">просмотров</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === "section" && (
          <div className="space-y-6 slide-up">
            <div className="flex items-center gap-3">
              <button onClick={() => setView("main")} className="text-white/40 hover:text-white/80 transition-colors">
                <Icon name="ArrowLeft" size={20} />
              </button>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: activeSection.color + "22", boxShadow: `0 0 16px ${activeSection.color}33` }}>
                <Icon name={activeSection.icon} size={18} style={{ color: activeSection.color }} />
              </div>
              <h2 className="font-oswald font-bold text-2xl text-white uppercase">{activeSection.title}</h2>
            </div>

            <div className="card-glass rounded-2xl overflow-hidden" style={{ borderColor: activeSection.color + "33" }}>
              <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                <span className="text-white/40 text-xs uppercase tracking-widest">Темы</span>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white hover:scale-105 transition-all"
                  style={{ background: activeSection.color + "33", border: `1px solid ${activeSection.color}44` }}>
                  <Icon name="Plus" size={14} style={{ color: activeSection.color }} />
                  <span style={{ color: activeSection.color }}>Новая тема</span>
                </button>
              </div>
              <div className="divide-y divide-white/5">
                {FORUM_TOPICS.map((t, i) => (
                  <div key={i} className="px-5 py-4 flex items-center justify-between hover:bg-white/3 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3 min-w-0">
                      {t.pinned && <Icon name="Pin" size={13} style={{ color: activeSection.color, flexShrink: 0 }} />}
                      <div className="min-w-0">
                        <div className="text-white font-semibold text-sm truncate">{t.title}</div>
                        <div className="text-white/30 text-xs">от {t.author} · {t.time}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                      <div className="text-center hidden sm:block">
                        <div className="text-white/60 text-xs font-semibold">{t.replies}</div>
                        <div className="text-white/20 text-xs">ответов</div>
                      </div>
                      <Icon name="ChevronRight" size={16} className="text-white/20" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="relative z-10 border-t border-white/5 mt-12 px-6 py-5 text-center text-white/15 text-xs"
        style={{ background: "rgba(0,0,0,0.4)" }}>
        <span className="font-oswald font-bold tracking-widest"
          style={{ background: "linear-gradient(90deg,#ff00ff,#7700ff,#00ffff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          ФОРУМ
        </span>
        <span className="mx-3">·</span>© 2026
      </footer>
    </div>
  );
}

// ══════════════════════════════════════════════
//  ROOT
// ══════════════════════════════════════════════
export default function Index() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [adminAuthed, setAdminAuthed] = useState(false);

  return (
    <>
      <Forum onAdminOpen={() => setShowLoginModal(true)} />

      {showLoginModal && !adminAuthed && (
        <AdminLoginModal
          onClose={() => setShowLoginModal(false)}
          onSuccess={() => { setAdminAuthed(true); setShowLoginModal(false); }}
        />
      )}

      {adminAuthed && (
        <AdminPanel onClose={() => setAdminAuthed(false)} />
      )}
    </>
  );
}
