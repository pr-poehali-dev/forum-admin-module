import { useState } from "react";
import Icon from "@/components/ui/icon";

const ADMIN_STATS = [
  { label: "Пользователей", value: "1 248", icon: "Users", color: "#ff00ff" },
  { label: "Онлайн", value: "42", icon: "Zap", color: "#00ff88" },
  { label: "Жалоб", value: "4", icon: "AlertTriangle", color: "#ff4466" },
  { label: "Банов сегодня", value: "7", icon: "Ban", color: "#ff6600" },
];

const RECENT_USERS = [
  { name: "CyberHawk", role: "Администратор", status: "online", joined: "1 янв 2025" },
  { name: "NeonByte", role: "Модератор", status: "online", joined: "15 фев 2025" },
  { name: "DarkWolf", role: "Игрок", status: "offline", joined: "3 мар 2025" },
  { name: "QuantumZ", role: "Игрок", status: "online", joined: "22 мар 2025" },
  { name: "SkyRider", role: "VIP", status: "offline", joined: "5 апр 2025" },
];

const MOD_LOG = [
  { action: "Бан", target: "SpamUser123", admin: "CyberHawk", time: "5 мин назад", icon: "Ban", color: "#ff4444" },
  { action: "Мут", target: "ToxicPlayer", admin: "Admin_X", time: "20 мин назад", icon: "MicOff", color: "#ff8800" },
  { action: "Разбан", target: "FairPlayer", admin: "Admin_X", time: "2 ч назад", icon: "CheckCircle", color: "#00ff88" },
  { action: "Кик", target: "GlitchUser", admin: "CyberHawk", time: "3 ч назад", icon: "LogOut", color: "#ff6600" },
];

const ROLES = [
  { name: "Владелец", color: "#ff00ff", count: 1 },
  { name: "Администратор", color: "#ff4466", count: 3 },
  { name: "Модератор", color: "#ffdd00", count: 6 },
  { name: "VIP", color: "#00ffff", count: 24 },
  { name: "Игрок", color: "#7777aa", count: 1214 },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "users" | "logs" | "roles">("dashboard");

  const tabs = [
    { id: "dashboard" as const, label: "Обзор", icon: "LayoutDashboard" },
    { id: "users" as const, label: "Пользователи", icon: "Users" },
    { id: "logs" as const, label: "Логи", icon: "ScrollText" },
    { id: "roles" as const, label: "Роли", icon: "Award" },
  ];

  return (
    <div className="min-h-screen gradient-bg font-montserrat">

      {/* Фоновые RGB-пятна */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-10 float-anim"
          style={{ background: "radial-gradient(circle, #ff00ff, transparent 70%)" }} />
        <div className="absolute top-[40%] right-[-20%] w-[500px] h-[500px] rounded-full opacity-10 float-anim"
          style={{ background: "radial-gradient(circle, #00ffff, transparent 70%)", animationDelay: "2s" }} />
        <div className="absolute bottom-[-15%] left-[25%] w-[500px] h-[500px] rounded-full opacity-10 float-anim"
          style={{ background: "radial-gradient(circle, #7700ff, transparent 70%)", animationDelay: "4s" }} />
      </div>

      {/* HEADER */}
      <header className="relative z-20 px-6 py-4 border-b border-white/8"
        style={{ background: "rgba(4,4,14,0.9)", backdropFilter: "blur(24px)" }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center rgb-border"
              style={{ background: "linear-gradient(135deg,#ff00ff18,#7700ff18)" }}>
              <Icon name="Swords" size={22} className="rgb-text" />
            </div>
            <div>
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
              <p className="text-white/30 text-xs tracking-[0.2em] uppercase">Admin Panel</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ background: "#00ff8818", border: "1px solid #00ff8833" }}>
              <span className="inline-block w-2 h-2 rounded-full"
                style={{ background: "#00ff88", boxShadow: "0 0 8px #00ff88", animation: "pulse 2s ease-in-out infinite" }} />
              <span className="text-xs font-semibold" style={{ color: "#00ff88" }}>42 онлайн</span>
            </div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center card-glass">
              <Icon name="Bell" size={16} className="text-white/50" />
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">

        {/* RGB ЗАГОЛОВОК */}
        <div className="mb-8 slide-up">
          <h2 className="font-oswald font-black text-4xl md:text-5xl uppercase tracking-wider mb-2"
            style={{
              background: "linear-gradient(90deg,#ff00ff,#7700ff,#00ffff,#ff6600,#ff00ff)",
              backgroundSize: "400% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "rgb-bg 5s linear infinite",
              filter: "drop-shadow(0 0 20px #ff00ff55)"
            }}>
            ADMIN PANEL
          </h2>
          <p className="text-white/30 text-sm tracking-widest uppercase">Управление сервером</p>
        </div>

        {/* ТАБЫ */}
        <div className="flex gap-1 mb-8 p-1 rounded-2xl slide-up section-delay-1"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300"
              style={activeTab === tab.id ? {
                background: "linear-gradient(135deg,#ff00ff22,#7700ff44,#00ffff22)",
                border: "1px solid #7700ff55",
                boxShadow: "0 0 20px #7700ff33",
                color: "#fff"
              } : { color: "rgba(255,255,255,0.35)" }}>
              <Icon name={tab.icon} size={15} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ===== ОБЗОР ===== */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {ADMIN_STATS.map((s, i) => (
                <div key={s.label} className={`card-glass rounded-2xl p-5 slide-up section-delay-${i + 1}`}
                  style={{ borderColor: s.color + "33" }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: s.color + "22", boxShadow: `0 0 16px ${s.color}33` }}>
                      <Icon name={s.icon} size={18} style={{ color: s.color }} />
                    </div>
                    <Icon name="TrendingUp" size={14} className="text-white/20" />
                  </div>
                  <div className="font-oswald font-black text-3xl"
                    style={{ color: s.color, filter: `drop-shadow(0 0 8px ${s.color}88)` }}>
                    {s.value}
                  </div>
                  <div className="text-white/40 text-xs mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Быстрые действия */}
            <div className="card-glass rounded-2xl p-5 slide-up section-delay-2">
              <h3 className="font-oswald font-bold text-lg mb-4 flex items-center gap-2"
                style={{
                  background: "linear-gradient(90deg,#ff00ff,#00ffff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>
                БЫСТРЫЕ ДЕЙСТВИЯ
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Бан игрока", icon: "Ban", color: "#ff4444" },
                  { label: "Мут", icon: "MicOff", color: "#ff8800" },
                  { label: "Кик", icon: "LogOut", color: "#ffdd00" },
                  { label: "Объявление", icon: "Megaphone", color: "#00ffff" },
                  { label: "Выдать роль", icon: "Award", color: "#7700ff" },
                  { label: "ТП игрока", icon: "Navigation", color: "#ff00ff" },
                  { label: "Очистить чат", icon: "Trash2", color: "#ff6666" },
                  { label: "Перезапуск", icon: "RotateCcw", color: "#00ff88" },
                ].map(a => (
                  <button key={a.label}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all hover:scale-105 active:scale-95"
                    style={{ background: a.color + "12", border: `1px solid ${a.color}28` }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ background: a.color + "22", boxShadow: `0 0 12px ${a.color}44` }}>
                      <Icon name={a.icon} size={17} style={{ color: a.color }} />
                    </div>
                    <span className="text-xs font-semibold text-white/70 text-center leading-tight">{a.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Последние логи */}
            <div className="card-glass rounded-2xl overflow-hidden slide-up section-delay-3">
              <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                <span className="font-oswald font-bold text-white tracking-wide flex items-center gap-2">
                  <Icon name="Activity" size={16} style={{ color: "#00ffff" }} />
                  ПОСЛЕДНИЕ ДЕЙСТВИЯ
                </span>
                <button className="text-xs text-white/30 hover:text-white/60 transition-colors"
                  onClick={() => setActiveTab("logs")}>
                  Все логи →
                </button>
              </div>
              <div className="divide-y divide-white/5">
                {MOD_LOG.map((log, i) => (
                  <div key={i} className="px-5 py-3 flex items-center justify-between hover:bg-white/2 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: log.color + "22" }}>
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

        {/* ===== ПОЛЬЗОВАТЕЛИ ===== */}
        {activeTab === "users" && (
          <div className="space-y-4 slide-up">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-oswald font-bold text-2xl uppercase"
                style={{
                  background: "linear-gradient(90deg,#ff00ff,#7700ff,#00ffff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 10px #ff00ff44)"
                }}>
                ПОЛЬЗОВАТЕЛИ
              </h3>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg,#7700ff,#aa44ff)", boxShadow: "0 0 16px #7700ff44" }}>
                <Icon name="UserPlus" size={15} />
                Добавить
              </button>
            </div>
            <div className="card-glass rounded-2xl overflow-hidden">
              <div className="divide-y divide-white/5">
                {RECENT_USERS.map((u, i) => (
                  <div key={i} className={`px-5 py-4 flex items-center justify-between hover:bg-white/3 transition-colors slide-up section-delay-${i + 1}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center font-oswald font-bold text-sm"
                        style={{ background: "linear-gradient(135deg,#7700ff33,#ff00ff22)", border: "1px solid #7700ff44" }}>
                        <span className="text-white">{u.name[0]}</span>
                      </div>
                      <div>
                        <div className="text-white font-semibold text-sm flex items-center gap-2">
                          {u.name}
                          <span className="inline-block w-1.5 h-1.5 rounded-full"
                            style={{
                              background: u.status === "online" ? "#00ff88" : "#555",
                              boxShadow: u.status === "online" ? "0 0 6px #00ff88" : "none"
                            }} />
                        </div>
                        <div className="text-white/30 text-xs">С {u.joined}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{
                          color: ROLES.find(r => r.name === u.role)?.color || "#aaa",
                          background: (ROLES.find(r => r.name === u.role)?.color || "#aaa") + "22"
                        }}>
                        {u.role}
                      </span>
                      <div className="flex gap-1">
                        <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
                          <Icon name="Edit" size={13} className="text-white/40" />
                        </button>
                        <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-500/20 transition-colors">
                          <Icon name="Ban" size={13} style={{ color: "#ff4444" }} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== ЛОГИ ===== */}
        {activeTab === "logs" && (
          <div className="space-y-4 slide-up">
            <h3 className="font-oswald font-bold text-2xl uppercase"
              style={{
                background: "linear-gradient(90deg,#ff6600,#ffdd00,#00ffff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 10px #ff660044)"
              }}>
              ЖУРНАЛ ДЕЙСТВИЙ
            </h3>
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
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ color: log.color, background: log.color + "18" }}>
                        {log.action}
                      </span>
                      <div className="text-white/20 text-xs mt-1">{log.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== РОЛИ ===== */}
        {activeTab === "roles" && (
          <div className="space-y-4 slide-up">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-oswald font-bold text-2xl uppercase"
                style={{
                  background: "linear-gradient(90deg,#7700ff,#ff00ff,#00ffff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 10px #7700ff44)"
                }}>
                РОЛИ
              </h3>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg,#ff00ff,#7700ff)", boxShadow: "0 0 16px #ff00ff44" }}>
                <Icon name="Plus" size={15} />
                Создать роль
              </button>
            </div>
            <div className="space-y-3">
              {ROLES.map((role, i) => (
                <div key={role.name} className={`card-glass rounded-2xl p-5 flex items-center justify-between slide-up section-delay-${i + 1}`}
                  style={{ borderColor: role.color + "33" }}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: role.color + "18", border: `1px solid ${role.color}44`, boxShadow: `0 0 16px ${role.color}33` }}>
                      <Icon name="Award" size={20} style={{ color: role.color }} />
                    </div>
                    <div>
                      <div className="font-oswald font-bold text-lg"
                        style={{ color: role.color, filter: `drop-shadow(0 0 8px ${role.color}66)` }}>
                        {role.name}
                      </div>
                      <div className="text-white/40 text-xs">{role.count} участников</div>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                    style={{ background: role.color + "22", color: role.color, border: `1px solid ${role.color}33` }}>
                    Изменить
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 mt-16 px-6 py-5 text-center text-white/15 text-xs"
        style={{ background: "rgba(0,0,0,0.4)" }}>
        <span className="font-oswald font-bold tracking-widest"
          style={{
            background: "linear-gradient(90deg,#ff00ff,#7700ff,#00ffff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
          ФОРУМ
        </span>
        <span className="mx-3">·</span>
        Admin Panel © 2026
      </footer>
    </div>
  );
}
