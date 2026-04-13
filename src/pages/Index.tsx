import { useState } from "react";
import Icon from "@/components/ui/icon";

const ADMIN_PASSWORD = "%panelhelpera%";

// ── типы ──────────────────────────────────────────────────────────────────────
type Role = { id: number; name: string; color: string; perms: Record<string, boolean> };
type User = { name: string; roleId: number; status: "online" | "offline"; joined: string };
type AdminTab = "dashboard" | "users" | "actions" | "logs" | "roles" | "settings";
type ForumView = "main" | "section";

const ALL_PERMS: { key: string; label: string }[] = [
  { key: "ban",       label: "Банить игроков" },
  { key: "mute",      label: "Мутить игроков" },
  { key: "kick",      label: "Кикать с сайта" },
  { key: "warn",      label: "Выдавать варны" },
  { key: "unban",     label: "Разбанивать" },
  { key: "unmute",    label: "Размучивать" },
  { key: "unwarn",    label: "Снимать варны" },
  { key: "roles",     label: "Управление ролями" },
  { key: "announce",  label: "Объявления" },
  { key: "settings",  label: "Настройки форума" },
  { key: "logs",      label: "Просмотр логов" },
  { key: "manageUsers", label: "Управление юзерами" },
];

const INIT_ROLES: Role[] = [
  { id: 1, name: "Владелец",      color: "#ff00ff", perms: Object.fromEntries(ALL_PERMS.map(p => [p.key, true])) },
  { id: 2, name: "Администратор", color: "#ff4466", perms: Object.fromEntries(ALL_PERMS.map(p => [p.key, p.key !== "settings"])) },
  { id: 3, name: "Модератор",     color: "#ffdd00", perms: Object.fromEntries(ALL_PERMS.map(p => [p.key, ["ban","mute","kick","warn","unban","unmute","unwarn","logs"].includes(p.key)])) },
  { id: 4, name: "VIP",           color: "#00ffff", perms: Object.fromEntries(ALL_PERMS.map(p => [p.key, false])) },
  { id: 5, name: "Игрок",         color: "#7777aa", perms: Object.fromEntries(ALL_PERMS.map(p => [p.key, false])) },
];

const INIT_USERS: User[] = [
  { name: "CyberHawk",  roleId: 2, status: "online",  joined: "1 янв 2025" },
  { name: "NeonByte",   roleId: 3, status: "online",  joined: "15 фев 2025" },
  { name: "DarkWolf",   roleId: 5, status: "offline", joined: "3 мар 2025" },
  { name: "QuantumZ",   roleId: 5, status: "online",  joined: "22 мар 2025" },
  { name: "SkyRider",   roleId: 4, status: "offline", joined: "5 апр 2025" },
];

const MOD_LOG = [
  { action: "Бан",         target: "SpamUser123", admin: "CyberHawk",  time: "5 мин назад",  icon: "Ban",          color: "#ff4444" },
  { action: "Мут",         target: "ToxicPlayer", admin: "Admin_X",    time: "20 мин назад", icon: "MicOff",       color: "#ff8800" },
  { action: "Разбан",      target: "FairPlayer",  admin: "Admin_X",    time: "2 ч назад",    icon: "CheckCircle",  color: "#00ff88" },
  { action: "Кик",         target: "GlitchUser",  admin: "CyberHawk",  time: "3 ч назад",    icon: "LogOut",       color: "#ff6600" },
];

const FORUM_SECTIONS = [
  { id: 1, title: "Общий",       icon: "MessageSquare", color: "#00ffff", posts: 312, online: 18 },
  { id: 2, title: "Объявления",  icon: "Megaphone",     color: "#ff00ff", posts: 24,  online: 5  },
  { id: 3, title: "Игровой чат", icon: "Gamepad2",      color: "#00ff88", posts: 874, online: 31 },
  { id: 4, title: "Предложения", icon: "Lightbulb",     color: "#ffdd00", posts: 156, online: 7  },
];

const FORUM_TOPICS = [
  { title: "Как повысить свой ранг?",       author: "DarkWolf",  replies: 12, views: 340,  time: "10 мин назад", pinned: true  },
  { title: "Баг с инвентарём",              author: "SkyRider",  replies: 4,  views: 98,   time: "1 ч назад",    pinned: false },
  { title: "Набор в клан [NEON]",           author: "NeonByte",  replies: 27, views: 510,  time: "2 ч назад",    pinned: false },
  { title: "Обновление сервера 2.4.1",      author: "CyberHawk", replies: 44, views: 1200, time: "вчера",        pinned: true  },
  { title: "Правила форума — читать всем",  author: "Admin_X",   replies: 0,  views: 3400, time: "3 дня назад",  pinned: true  },
];

// ── утилиты ──────────────────────────────────────────────────────────────────
const rgbGrad = "linear-gradient(90deg,#ff00ff,#7700ff,#00ffff,#ff00ff)";

const RgbText = ({ children, size = "2xl", extra = "" }: { children: React.ReactNode; size?: string; extra?: string }) => (
  <span className={`font-oswald font-black uppercase text-${size} ${extra}`}
    style={{
      background: rgbGrad,
      backgroundSize: "300% 100%",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      animation: "rgb-bg 4s linear infinite",
      filter: "drop-shadow(0 0 12px #ff00ff66)"
    }}>
    {children}
  </span>
);

const BgOrbs = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-10 float-anim"
      style={{ background: "radial-gradient(circle,#ff00ff,transparent 70%)" }} />
    <div className="absolute top-[40%] right-[-20%] w-[500px] h-[500px] rounded-full opacity-10 float-anim"
      style={{ background: "radial-gradient(circle,#00ffff,transparent 70%)", animationDelay: "2s" }} />
    <div className="absolute bottom-[-15%] left-[25%] w-[500px] h-[500px] rounded-full opacity-10 float-anim"
      style={{ background: "radial-gradient(circle,#7700ff,transparent 70%)", animationDelay: "4s" }} />
  </div>
);

// ═════════════════════════════════════════════════════════════════════════════
//  МОДАЛ ВХОДА В АДМИНКУ
// ═════════════════════════════════════════════════════════════════════════════
function AdminLoginModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const [shake, setShake] = useState(false);

  const submit = () => {
    if (pw === ADMIN_PASSWORD) { onSuccess(); }
    else { setErr(true); setShake(true); setTimeout(() => setShake(false), 500); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(20px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`w-full max-w-md slide-up ${shake ? "animate-[shake_0.4s_ease]" : ""}`}>
        <div className="card-glass rounded-3xl p-8 space-y-5"
          style={{ border: err ? "1px solid #ff444466" : "1px solid #7700ff44", boxShadow: err ? "0 0 40px #ff444422" : "0 0 40px #7700ff44" }}>
          <div className="text-center">
            <div className="inline-flex w-16 h-16 rounded-2xl items-center justify-center mb-3 rgb-border float-anim"
              style={{ background: "linear-gradient(135deg,#ff00ff18,#7700ff18)" }}>
              <Icon name="ShieldCheck" size={30} className="rgb-text" />
            </div>
            <div><RgbText size="2xl">ADMIN PANEL</RgbText></div>
            <p className="text-white/30 text-xs mt-1 tracking-widest uppercase">Введите пароль</p>
          </div>
          <div>
            <div className="relative">
              <input type="password" value={pw}
                onChange={e => { setPw(e.target.value); setErr(false); }}
                onKeyDown={e => e.key === "Enter" && submit()}
                placeholder="••••••••••••"
                className="w-full bg-white/5 border rounded-xl px-4 py-4 text-white text-sm outline-none transition-all placeholder:text-white/15 pr-12"
                style={{ borderColor: err ? "#ff444466" : "rgba(255,255,255,0.1)" }} />
              <Icon name="Lock" size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20" />
            </div>
            {err && <p className="text-xs mt-2 flex items-center gap-1" style={{ color: "#ff4466" }}>
              <Icon name="AlertCircle" size={12} />Неверный пароль
            </p>}
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-sm text-white/40 hover:text-white/70 transition-colors card-glass">Отмена</button>
            <button onClick={submit} className="flex-1 py-3 rounded-xl font-oswald font-bold text-sm tracking-widest text-white uppercase transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg,#ff00ff,#7700ff)", boxShadow: "0 0 20px #7700ff55" }}>ВОЙТИ</button>
          </div>
        </div>
      </div>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}`}</style>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
//  ADMIN PANEL
// ═════════════════════════════════════════════════════════════════════════════
function AdminPanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [roles, setRoles] = useState<Role[]>(INIT_ROLES);
  const [users, setUsers] = useState<User[]>(INIT_USERS);

  // ── actions state
  const [actionTarget, setActionTarget] = useState("");
  const [actionReason, setActionReason] = useState("");
  const [actionDuration, setActionDuration] = useState("");
  const [giveRoleTarget, setGiveRoleTarget] = useState("");
  const [giveRoleId, setGiveRoleId] = useState<number | null>(null);

  // ── role editor state
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("#7700ff");
  const [editPerms, setEditPerms] = useState<Record<string, boolean>>({});
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleColor, setNewRoleColor] = useState("#7700ff");
  const [showCreateRole, setShowCreateRole] = useState(false);

  // ── settings
  const [settings, setSettings] = useState({ forumName: "ФОРУМ", maxBanDays: "30", muteDuration: "60", welcomeMsg: "Добро пожаловать!", maintenanceMode: false, regOpen: true, chatEnabled: true, floodProtect: true });

  const [toast, setToast] = useState<{ msg: string; color: string } | null>(null);

  const showToast = (msg: string, color: string) => { setToast({ msg, color }); setTimeout(() => setToast(null), 2500); };

  const openEditRole = (role: Role) => {
    setEditingRole(role);
    setEditName(role.name);
    setEditColor(role.color);
    setEditPerms({ ...role.perms });
  };

  const saveEditRole = () => {
    if (!editingRole || !editName.trim()) return;
    setRoles(rs => rs.map(r => r.id === editingRole.id ? { ...r, name: editName, color: editColor, perms: editPerms } : r));
    setEditingRole(null);
    showToast(`Роль "${editName}" сохранена`, editColor);
  };

  const createRole = () => {
    if (!newRoleName.trim()) return;
    const newId = Math.max(...roles.map(r => r.id)) + 1;
    setRoles(rs => [...rs, { id: newId, name: newRoleName, color: newRoleColor, perms: Object.fromEntries(ALL_PERMS.map(p => [p.key, false])) }]);
    setNewRoleName(""); setNewRoleColor("#7700ff"); setShowCreateRole(false);
    showToast(`Роль "${newRoleName}" создана`, newRoleColor);
  };

  const applyGiveRole = () => {
    if (!giveRoleTarget || !giveRoleId) return;
    const user = users.find(u => u.name.toLowerCase() === giveRoleTarget.toLowerCase());
    if (!user) { showToast("Игрок не найден", "#ff4444"); return; }
    const role = roles.find(r => r.id === giveRoleId);
    setUsers(us => us.map(u => u.name === user.name ? { ...u, roleId: giveRoleId } : u));
    showToast(`Роль "${role?.name}" выдана ${user.name}`, role?.color || "#00ff88");
  };

  const tabs: { id: AdminTab; label: string; icon: string }[] = [
    { id: "dashboard", label: "Обзор",     icon: "LayoutDashboard" },
    { id: "users",     label: "Игроки",    icon: "Users" },
    { id: "actions",   label: "Действия",  icon: "Gavel" },
    { id: "logs",      label: "Логи",      icon: "ScrollText" },
    { id: "roles",     label: "Роли",      icon: "Award" },
    { id: "settings",  label: "Настройки", icon: "Settings" },
  ];

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto" style={{ background: "rgba(3,3,12,0.98)" }}>
      <BgOrbs />

      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl font-semibold text-sm text-white slide-up flex items-center gap-2"
          style={{ background: toast.color + "dd", boxShadow: `0 0 24px ${toast.color}99`, backdropFilter: "blur(12px)" }}>
          <Icon name="CheckCircle" size={16} />
          {toast.msg}
        </div>
      )}

      {/* Редактор роли — полноэкранный оверлей */}
      {editingRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(20px)" }}>
          <div className="w-full max-w-xl slide-up">
            <div className="card-glass rounded-3xl p-7 space-y-5"
              style={{ border: `1px solid ${editingRole.color}55`, boxShadow: `0 0 40px ${editingRole.color}33` }}>
              <div className="flex items-center justify-between">
                <h3 className="font-oswald font-bold text-xl text-white uppercase tracking-wide">Изменить роль</h3>
                <button onClick={() => setEditingRole(null)} className="text-white/40 hover:text-white transition-colors">
                  <Icon name="X" size={20} />
                </button>
              </div>

              {/* Название + цвет */}
              <div className="flex gap-3 items-center">
                <input value={editName} onChange={e => setEditName(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors placeholder:text-white/20"
                  style={{ borderColor: editColor + "66" }}
                  placeholder="Название роли" />
                <div className="flex flex-col items-center gap-1">
                  <label className="text-white/30 text-xs uppercase tracking-wider">Цвет</label>
                  <input type="color" value={editColor} onChange={e => setEditColor(e.target.value)}
                    className="w-14 h-10 rounded-xl cursor-pointer border-0 bg-transparent" />
                </div>
              </div>

              {/* Превью */}
              <div className="px-4 py-2 rounded-xl inline-flex items-center gap-2"
                style={{ background: editColor + "22", border: `1px solid ${editColor}44` }}>
                <Icon name="Award" size={14} style={{ color: editColor }} />
                <span className="font-oswald font-bold text-sm" style={{ color: editColor }}>{editName || "Название"}</span>
              </div>

              {/* Доступы */}
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Доступы</p>
                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                  {ALL_PERMS.map(p => (
                    <button key={p.key} onClick={() => setEditPerms(pp => ({ ...pp, [p.key]: !pp[p.key] }))}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left"
                      style={{
                        background: editPerms[p.key] ? editColor + "22" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${editPerms[p.key] ? editColor + "55" : "rgba(255,255,255,0.08)"}`,
                        boxShadow: editPerms[p.key] ? `0 0 10px ${editColor}33` : "none"
                      }}>
                      <span className="text-xs font-semibold" style={{ color: editPerms[p.key] ? editColor : "rgba(255,255,255,0.4)" }}>
                        {p.label}
                      </span>
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ml-2 transition-all"
                        style={{ background: editPerms[p.key] ? editColor : "rgba(255,255,255,0.1)" }}>
                        {editPerms[p.key] && <Icon name="Check" size={11} style={{ color: "#000" }} />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setEditingRole(null)}
                  className="flex-1 py-3 rounded-xl font-bold text-sm text-white/40 hover:text-white transition-colors card-glass">
                  Отмена
                </button>
                <button onClick={saveEditRole}
                  className="flex-1 py-3 rounded-xl font-oswald font-bold text-sm tracking-wider text-white uppercase transition-all hover:scale-105"
                  style={{ background: `linear-gradient(135deg,${editColor},${editColor}aa)`, boxShadow: `0 0 20px ${editColor}55` }}>
                  СОХРАНИТЬ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-30 px-6 py-4 border-b border-white/8"
        style={{ background: "rgba(3,3,12,0.95)", backdropFilter: "blur(24px)" }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center rgb-border"
              style={{ background: "linear-gradient(135deg,#ff00ff18,#7700ff18)" }}>
              <Icon name="ShieldCheck" size={20} className="rgb-text" />
            </div>
            <div>
              <RgbText size="xl" extra="tracking-[0.3em]">ADMIN PANEL</RgbText>
              <p className="text-white/25 text-xs tracking-widest uppercase">Управление форумом</p>
            </div>
          </div>
          <button onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white/50 hover:text-white transition-colors card-glass">
            <Icon name="ArrowLeft" size={15} />На форум
          </button>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Табы */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 mb-8 p-1 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300"
              style={tab === t.id ? {
                background: "linear-gradient(135deg,#ff00ff22,#7700ff44,#00ffff22)",
                border: "1px solid #7700ff55",
                boxShadow: "0 0 20px #7700ff33",
                color: "#fff"
              } : { color: "rgba(255,255,255,0.35)" }}>
              <Icon name={t.icon} size={15} />
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* ─── ОБЗОР ─── */}
        {tab === "dashboard" && (
          <div className="space-y-6 slide-up">
            <div className="mb-4"><RgbText size="4xl" extra="tracking-widest">ОБЗОР</RgbText></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Пользователей", value: "1 248", icon: "Users",         color: "#ff00ff" },
                { label: "Онлайн",        value: "42",    icon: "Zap",           color: "#00ff88" },
                { label: "Жалоб",         value: "4",     icon: "AlertTriangle", color: "#ff4466" },
                { label: "Банов сегодня", value: "7",     icon: "Ban",           color: "#ff6600" },
              ].map((s, i) => (
                <div key={s.label} className={`card-glass rounded-2xl p-5 section-delay-${i + 1}`}
                  style={{ borderColor: s.color + "44" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: s.color + "22", boxShadow: `0 0 16px ${s.color}44` }}>
                    <Icon name={s.icon} size={18} style={{ color: s.color }} />
                  </div>
                  <div className="font-oswald font-black text-3xl"
                    style={{ color: s.color, filter: `drop-shadow(0 0 8px ${s.color}88)` }}>{s.value}</div>
                  <div className="text-white/40 text-xs mt-1">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="card-glass rounded-2xl overflow-hidden" style={{ borderColor: "#00ffff22" }}>
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
                        <span className="font-semibold" style={{ color: log.color }}>{log.action}</span>
                        <span className="text-white/40"> → </span>{log.target}
                      </span>
                    </div>
                    <span className="text-white/25 text-xs">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── ИГРОКИ ─── */}
        {tab === "users" && (
          <div className="space-y-4 slide-up">
            <div className="mb-4"><RgbText size="3xl" extra="tracking-widest">ИГРОКИ</RgbText></div>
            <div className="card-glass rounded-2xl overflow-hidden">
              <div className="divide-y divide-white/5">
                {users.map((u, i) => {
                  const role = roles.find(r => r.id === u.roleId);
                  return (
                    <div key={i} className="px-5 py-4 flex items-center justify-between hover:bg-white/3 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-oswald font-bold"
                          style={{ background: (role?.color || "#777") + "22", border: `1px solid ${role?.color || "#777"}44` }}>
                          <span style={{ color: role?.color || "#aaa" }}>{u.name[0]}</span>
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
                          style={{ color: role?.color || "#aaa", background: (role?.color || "#aaa") + "22", border: `1px solid ${role?.color || "#aaa"}33` }}>
                          {role?.name || "—"}
                        </span>
                        <button onClick={() => { setGiveRoleTarget(u.name); setTab("actions"); }}
                          className="px-2 py-1 rounded-lg text-xs font-semibold text-white/40 hover:text-white transition-colors card-glass">
                          Действие
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ─── ДЕЙСТВИЯ ─── */}
        {tab === "actions" && (
          <div className="space-y-5 slide-up">
            <div className="mb-4"><RgbText size="3xl" extra="tracking-widest">ДЕЙСТВИЯ</RgbText></div>

            {/* Цель */}
            <div className="card-glass rounded-2xl p-5 space-y-3" style={{ borderColor: "#ff00ff33" }}>
              <p className="text-white/40 text-xs uppercase tracking-widest">Цель действия</p>
              <div className="flex gap-3">
                <input value={actionTarget} onChange={e => setActionTarget(e.target.value)}
                  placeholder="Никнейм игрока..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#ff00ff] transition-colors placeholder:text-white/20" />
                <input value={actionDuration} onChange={e => setActionDuration(e.target.value)}
                  placeholder="Срок (мин/ч)"
                  className="w-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#ff00ff] transition-colors placeholder:text-white/20" />
              </div>
              <input value={actionReason} onChange={e => setActionReason(e.target.value)}
                placeholder="Причина..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#ff00ff] transition-colors placeholder:text-white/20" />
            </div>

            {/* Наказания */}
            <div className="card-glass rounded-2xl p-5" style={{ borderColor: "#ff444433" }}>
              <p className="font-oswald font-bold text-sm uppercase tracking-widest mb-4" style={{ color: "#ff4444" }}>⚠ НАКАЗАНИЯ</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Бан",        icon: "Ban",          color: "#ff3333", desc: "Полная блокировка" },
                  { label: "Мут",        icon: "MicOff",       color: "#ff8800", desc: "Запрет сообщений" },
                  { label: "Кик с сайта",icon: "LogOut",       color: "#ffdd00", desc: "Выкинуть с сайта" },
                  { label: "Варн",       icon: "AlertOctagon", color: "#ff6600", desc: "Предупреждение" },
                ].map(a => (
                  <button key={a.label}
                    onClick={() => showToast(`${a.label} → ${actionTarget || "игрок"}`, a.color)}
                    className="flex flex-col items-start gap-3 p-4 rounded-2xl transition-all hover:scale-105 active:scale-95 text-left"
                    style={{ background: a.color + "15", border: `1px solid ${a.color}33` }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: a.color + "25", boxShadow: `0 0 14px ${a.color}44` }}>
                      <Icon name={a.icon} size={20} style={{ color: a.color }} />
                    </div>
                    <div>
                      <div className="font-oswald font-bold text-base" style={{ color: a.color }}>{a.label}</div>
                      <div className="text-white/30 text-xs">{a.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Снятие наказаний */}
            <div className="card-glass rounded-2xl p-5" style={{ borderColor: "#00ff8833" }}>
              <p className="font-oswald font-bold text-sm uppercase tracking-widest mb-4" style={{ color: "#00ff88" }}>✓ СНЯТИЕ НАКАЗАНИЙ</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { label: "Разбан",  icon: "ShieldCheck", color: "#00ff88", desc: "Снять бан" },
                  { label: "Размут",  icon: "Mic",         color: "#00ffcc", desc: "Снять мут" },
                  { label: "Разварн", icon: "CheckCircle", color: "#aaffaa", desc: "Снять варн" },
                ].map(a => (
                  <button key={a.label}
                    onClick={() => showToast(`${a.label} → ${actionTarget || "игрок"}`, a.color)}
                    className="flex flex-col items-start gap-3 p-4 rounded-2xl transition-all hover:scale-105 active:scale-95 text-left"
                    style={{ background: a.color + "15", border: `1px solid ${a.color}33` }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: a.color + "25", boxShadow: `0 0 14px ${a.color}44` }}>
                      <Icon name={a.icon} size={20} style={{ color: a.color }} />
                    </div>
                    <div>
                      <div className="font-oswald font-bold text-base" style={{ color: a.color }}>{a.label}</div>
                      <div className="text-white/30 text-xs">{a.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Выдать / забрать роль */}
            <div className="card-glass rounded-2xl p-5 space-y-4" style={{ borderColor: "#7700ff33" }}>
              <p className="font-oswald font-bold text-sm uppercase tracking-widest" style={{ color: "#aa44ff" }}>🎖 УПРАВЛЕНИЕ РОЛЯМИ</p>
              <div className="flex gap-3">
                <input value={giveRoleTarget} onChange={e => setGiveRoleTarget(e.target.value)}
                  placeholder="Никнейм игрока..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#7700ff] transition-colors placeholder:text-white/20" />
              </div>
              <div>
                <p className="text-white/30 text-xs mb-2 uppercase tracking-wider">Выберите роль</p>
                <div className="flex flex-wrap gap-2">
                  {roles.map(r => (
                    <button key={r.id} onClick={() => setGiveRoleId(r.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105"
                      style={{
                        background: giveRoleId === r.id ? r.color + "44" : r.color + "18",
                        border: `1px solid ${r.color}${giveRoleId === r.id ? "88" : "33"}`,
                        color: r.color,
                        boxShadow: giveRoleId === r.id ? `0 0 12px ${r.color}55` : "none"
                      }}>
                      {r.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={applyGiveRole}
                  className="px-5 py-3 rounded-xl font-oswald font-bold text-sm text-white uppercase tracking-wider transition-all hover:scale-105"
                  style={{ background: "linear-gradient(135deg,#7700ff,#aa44ff)", boxShadow: "0 0 16px #7700ff44" }}>
                  Выдать роль
                </button>
                <button onClick={() => {
                  const user = users.find(u => u.name.toLowerCase() === giveRoleTarget.toLowerCase());
                  if (!user) { showToast("Игрок не найден", "#ff4444"); return; }
                  setUsers(us => us.map(u => u.name === user.name ? { ...u, roleId: 5 } : u));
                  showToast(`Роль снята с ${user.name}`, "#ff4466");
                }}
                  className="px-5 py-3 rounded-xl font-oswald font-bold text-sm text-white uppercase tracking-wider transition-all hover:scale-105"
                  style={{ background: "linear-gradient(135deg,#ff4466,#ff0044)", boxShadow: "0 0 16px #ff446644" }}>
                  Забрать роль
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── ЛОГИ ─── */}
        {tab === "logs" && (
          <div className="space-y-4 slide-up">
            <div className="mb-4"><RgbText size="3xl" extra="tracking-widest">ЖУРНАЛ</RgbText></div>
            <div className="card-glass rounded-2xl overflow-hidden">
              <div className="divide-y divide-white/5">
                {[...MOD_LOG, ...MOD_LOG].map((log, i) => (
                  <div key={i} className="px-5 py-4 flex items-center justify-between hover:bg-white/2 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: log.color + "22", boxShadow: `0 0 10px ${log.color}33` }}>
                        <Icon name={log.icon} size={16} style={{ color: log.color }} />
                      </div>
                      <div>
                        <div className="text-white text-sm">
                          <span className="font-bold" style={{ color: log.color }}>{log.action}</span>
                          <span className="text-white/40"> → </span>
                          <span>{log.target}</span>
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

        {/* ─── РОЛИ ─── */}
        {tab === "roles" && (
          <div className="space-y-4 slide-up">
            <div className="flex items-center justify-between mb-4">
              <RgbText size="3xl" extra="tracking-widest">РОЛИ</RgbText>
              <button onClick={() => setShowCreateRole(!showCreateRole)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white hover:scale-105 transition-all"
                style={{ background: "linear-gradient(135deg,#ff00ff,#7700ff)", boxShadow: "0 0 16px #ff00ff44" }}>
                <Icon name="Plus" size={15} />Создать роль
              </button>
            </div>

            {/* Форма создания */}
            {showCreateRole && (
              <div className="card-glass rounded-2xl p-5 space-y-4 slide-up" style={{ borderColor: "#ff00ff33" }}>
                <p className="font-oswald font-bold text-lg text-white">Новая роль</p>
                <div className="flex gap-3 items-center">
                  <input value={newRoleName} onChange={e => setNewRoleName(e.target.value)}
                    placeholder="Название роли"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#ff00ff] transition-colors placeholder:text-white/20" />
                  <input type="color" value={newRoleColor} onChange={e => setNewRoleColor(e.target.value)}
                    className="w-14 h-12 rounded-xl cursor-pointer border-0 bg-transparent" />
                </div>
                <div className="flex gap-3">
                  <button onClick={createRole}
                    className="px-5 py-2 rounded-xl font-bold text-sm text-white hover:scale-105 transition-all"
                    style={{ background: "linear-gradient(135deg,#ff00ff,#7700ff)" }}>
                    Создать
                  </button>
                  <button onClick={() => setShowCreateRole(false)}
                    className="px-5 py-2 rounded-xl font-bold text-sm text-white/40 hover:text-white transition-colors card-glass">
                    Отмена
                  </button>
                </div>
              </div>
            )}

            {/* Список ролей */}
            <div className="space-y-3">
              {roles.map((role) => (
                <div key={role.id} className="card-glass rounded-2xl p-5"
                  style={{ borderColor: role.color + "44", boxShadow: `0 0 20px ${role.color}11` }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                        style={{ background: role.color + "22", border: `1px solid ${role.color}55`, boxShadow: `0 0 16px ${role.color}33` }}>
                        <Icon name="Award" size={20} style={{ color: role.color }} />
                      </div>
                      <div>
                        <div className="font-oswald font-bold text-lg"
                          style={{ color: role.color, filter: `drop-shadow(0 0 8px ${role.color}88)` }}>
                          {role.name}
                        </div>
                        <div className="text-white/30 text-xs">
                          {Object.values(role.perms).filter(Boolean).length} из {ALL_PERMS.length} доступов
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openEditRole(role)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105"
                        style={{ background: role.color + "25", color: role.color, border: `1px solid ${role.color}44`, boxShadow: `0 0 12px ${role.color}33` }}>
                        <Icon name="Edit" size={14} />
                        Изменить
                      </button>
                      <button onClick={() => { setRoles(rs => rs.filter(r => r.id !== role.id)); showToast("Роль удалена", "#ff4444"); }}
                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                        style={{ background: "#ff444418", border: "1px solid #ff444433" }}>
                        <Icon name="Trash2" size={14} style={{ color: "#ff4444" }} />
                      </button>
                    </div>
                  </div>
                  {/* Доступы превью */}
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_PERMS.map(p => (
                      <span key={p.key} className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{
                          background: role.perms[p.key] ? role.color + "22" : "rgba(255,255,255,0.05)",
                          color: role.perms[p.key] ? role.color : "rgba(255,255,255,0.2)",
                          border: `1px solid ${role.perms[p.key] ? role.color + "44" : "transparent"}`
                        }}>
                        {p.label}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── НАСТРОЙКИ ─── */}
        {tab === "settings" && (
          <div className="space-y-6 slide-up">
            <div className="mb-4"><RgbText size="3xl" extra="tracking-widest">НАСТРОЙКИ</RgbText></div>

            <div className="card-glass rounded-2xl p-6 space-y-4" style={{ borderColor: "#00ffff33" }}>
              <p className="font-oswald font-bold text-sm uppercase tracking-widest" style={{ color: "#00ffff" }}>Основные</p>
              <div className="grid md:grid-cols-2 gap-4">
                {([
                  { key: "forumName",    label: "Название форума" },
                  { key: "maxBanDays",   label: "Макс. срок бана (дней)" },
                  { key: "muteDuration", label: "Мут по умолчанию (мин)" },
                  { key: "welcomeMsg",   label: "Приветствие" },
                ] as { key: keyof typeof settings; label: string }[]).map(f => (
                  <div key={f.key}>
                    <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">{f.label}</label>
                    <input value={settings[f.key] as string}
                      onChange={e => setSettings(s => ({ ...s, [f.key]: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#00ffff] transition-colors" />
                  </div>
                ))}
              </div>
            </div>

            <div className="card-glass rounded-2xl p-6 space-y-3" style={{ borderColor: "#7700ff33" }}>
              <p className="font-oswald font-bold text-sm uppercase tracking-widest" style={{ color: "#aa44ff" }}>Управление</p>
              {([
                { key: "maintenanceMode", label: "Режим техработ",      desc: "Скрыть форум",         color: "#ff8800", icon: "Wrench"       },
                { key: "regOpen",         label: "Регистрация открыта", desc: "Новые пользователи",   color: "#00ff88", icon: "UserPlus"     },
                { key: "chatEnabled",     label: "Чат включён",         desc: "Глобальный чат",       color: "#00ffff", icon: "MessageSquare"},
                { key: "floodProtect",    label: "Защита от флуда",     desc: "Лимит сообщений",      color: "#7700ff", icon: "Shield"       },
              ] as { key: keyof typeof settings; label: string; desc: string; color: string; icon: string }[]).map(item => (
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
                  <button onClick={() => setSettings(s => ({ ...s, [item.key]: !s[item.key] }))}
                    className="w-12 h-6 rounded-full relative transition-all duration-300 flex-shrink-0"
                    style={{ background: (settings[item.key] as boolean) ? `linear-gradient(90deg,${item.color}99,${item.color})` : "rgba(255,255,255,0.1)", boxShadow: (settings[item.key] as boolean) ? `0 0 12px ${item.color}66` : "none" }}>
                    <span className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow"
                      style={{ left: (settings[item.key] as boolean) ? "calc(100% - 20px)" : "4px" }} />
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

// ═════════════════════════════════════════════════════════════════════════════
//  ФОРУМ
// ═════════════════════════════════════════════════════════════════════════════
function Forum({ onAdminOpen }: { onAdminOpen: () => void }) {
  const [view, setView] = useState<ForumView>("main");
  const [activeSection, setActiveSection] = useState(FORUM_SECTIONS[0]);

  return (
    <div className="min-h-screen gradient-bg font-montserrat">
      <BgOrbs />

      {/* Header */}
      <header className="relative z-20 px-6 py-4 border-b border-white/8"
        style={{ background: "rgba(4,4,14,0.9)", backdropFilter: "blur(24px)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView("main")}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center rgb-border"
              style={{ background: "linear-gradient(135deg,#ff00ff18,#7700ff18)" }}>
              <Icon name="Swords" size={20} className="rgb-text" />
            </div>
            <RgbText size="2xl" extra="tracking-[0.3em]">ФОРУМ</RgbText>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ background: "#00ff8818", border: "1px solid #00ff8833" }}>
              <span className="inline-block w-2 h-2 rounded-full" style={{ background: "#00ff88", boxShadow: "0 0 8px #00ff88" }} />
              <span className="text-xs font-semibold" style={{ color: "#00ff88" }}>42 онлайн</span>
            </div>
            <button onClick={onAdminOpen}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-oswald font-bold text-sm transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg,#ff00ff22,#7700ff44)", border: "1px solid #7700ff66", boxShadow: "0 0 16px #7700ff33" }}>
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
                  background: "linear-gradient(90deg,#ff00ff,#7700ff,#00ffff,#ff6600,#ff00ff)",
                  backgroundSize: "400% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: "rgb-bg 5s linear infinite",
                  filter: "drop-shadow(0 0 30px #ff00ff55)"
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
                  style={{ borderColor: s.color + "44" }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ background: s.color + "22", boxShadow: `0 0 20px ${s.color}44` }}>
                      <Icon name={s.icon} size={22} style={{ color: s.color }} />
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold" style={{ color: s.color, filter: `drop-shadow(0 0 6px ${s.color})` }}>{s.online} онлайн</div>
                      <div className="text-white/25 text-xs">{s.posts} тем</div>
                    </div>
                  </div>
                  <h3 className="font-oswald font-bold text-xl text-white mb-1"
                    style={{ filter: `drop-shadow(0 0 6px ${s.color}44)` }}>{s.title}</h3>
                  <div className="flex items-center gap-1 mt-3 text-xs font-semibold group-hover:gap-2 transition-all"
                    style={{ color: s.color }}>
                    Открыть <Icon name="ArrowRight" size={13} />
                  </div>
                </button>
              ))}
            </div>

            {/* Темы */}
            <div className="card-glass rounded-2xl overflow-hidden slide-up" style={{ borderColor: "#ff660033" }}>
              <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
                <Icon name="Flame" size={16} style={{ color: "#ff6600" }} />
                <span className="font-oswald font-bold tracking-wide"
                  style={{ background: "linear-gradient(90deg,#ff6600,#ffdd00)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  ПОСЛЕДНИЕ ТЕМЫ
                </span>
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
                    <div className="hidden sm:flex items-center gap-6 flex-shrink-0 ml-4 text-center">
                      <div><div className="text-white/60 text-xs font-semibold">{t.replies}</div><div className="text-white/20 text-xs">ответов</div></div>
                      <div><div className="text-white/60 text-xs font-semibold">{t.views}</div><div className="text-white/20 text-xs">просмотров</div></div>
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
                style={{ background: activeSection.color + "22", boxShadow: `0 0 16px ${activeSection.color}44` }}>
                <Icon name={activeSection.icon} size={18} style={{ color: activeSection.color }} />
              </div>
              <h2 className="font-oswald font-bold text-2xl uppercase"
                style={{ color: activeSection.color, filter: `drop-shadow(0 0 10px ${activeSection.color}88)` }}>
                {activeSection.title}
              </h2>
            </div>
            <div className="card-glass rounded-2xl overflow-hidden" style={{ borderColor: activeSection.color + "44" }}>
              <div className="px-5 py-4 border-b border-white/5 flex justify-between items-center">
                <span className="text-white/40 text-xs uppercase tracking-widest">Темы раздела</span>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all hover:scale-105"
                  style={{ background: activeSection.color + "22", border: `1px solid ${activeSection.color}44`, color: activeSection.color }}>
                  <Icon name="Plus" size={14} />Новая тема
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
                    <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                      <div className="hidden sm:block text-center"><div className="text-white/60 text-xs font-semibold">{t.replies}</div><div className="text-white/20 text-xs">ответов</div></div>
                      <Icon name="ChevronRight" size={16} className="text-white/20" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="relative z-10 border-t border-white/5 mt-12 px-6 py-5 text-center"
        style={{ background: "rgba(0,0,0,0.4)" }}>
        <RgbText size="sm" extra="tracking-widest">ФОРУМ</RgbText>
        <span className="text-white/15 text-xs mx-3">·</span>
        <span className="text-white/15 text-xs">© 2026</span>
      </footer>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
//  ROOT
// ═════════════════════════════════════════════════════════════════════════════
export default function Index() {
  const [showLogin, setShowLogin] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  return (
    <>
      <Forum onAdminOpen={() => setShowLogin(true)} />
      {showLogin && !adminOpen && (
        <AdminLoginModal onClose={() => setShowLogin(false)} onSuccess={() => { setAdminOpen(true); setShowLogin(false); }} />
      )}
      {adminOpen && <AdminPanel onClose={() => setAdminOpen(false)} />}
    </>
  );
}
