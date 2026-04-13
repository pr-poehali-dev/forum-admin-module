import { useState } from "react";
import Icon from "@/components/ui/icon";

type Section = "home" | "complaints" | "admin" | "moderation" | "maintenance";

const NAV_ITEMS = [
  { id: "home" as Section, label: "Главная", icon: "Home" },
  { id: "complaints" as Section, label: "Жалобы", icon: "AlertTriangle" },
  { id: "admin" as Section, label: "Встать на админа", icon: "Shield" },
  { id: "moderation" as Section, label: "Модерация", icon: "Eye" },
  { id: "maintenance" as Section, label: "Техработы", icon: "Settings" },
];

const STATS = [
  { label: "Пользователей", value: "1 248", icon: "Users", color: "#ff00ff" },
  { label: "Тем", value: "347", icon: "MessageSquare", color: "#00ffff" },
  { label: "Онлайн", value: "42", icon: "Zap", color: "#00ff88" },
  { label: "Постов", value: "8 921", icon: "FileText", color: "#ff6600" },
];

const COMPLAINTS = [
  { id: 1, title: "Нарушение правил чата", author: "Player_X99", time: "10 мин назад", status: "open", priority: "high" },
  { id: 2, title: "Читерство в игре", author: "DarkWolf", time: "35 мин назад", status: "review", priority: "medium" },
  { id: 3, title: "Оскорбление в личных сообщениях", author: "SkyRider", time: "1 ч назад", status: "closed", priority: "low" },
  { id: 4, title: "Спам в общем чате", author: "NeonByte", time: "2 ч назад", status: "open", priority: "high" },
];

const ADMIN_APPS = [
  { id: 1, author: "CyberHawk", age: "18", exp: "3 года", status: "review" },
  { id: 2, author: "QuantumZ", age: "21", exp: "5 лет", status: "open" },
  { id: 3, author: "NightFrost", age: "20", exp: "2 года", status: "rejected" },
];

const MOD_LOG = [
  { action: "Бан", target: "SpamUser123", admin: "CyberHawk", time: "5 мин назад", icon: "Ban", color: "#ff4444" },
  { action: "Мут", target: "ToxicPlayer", admin: "Admin_X", time: "20 мин назад", icon: "MicOff", color: "#ff8800" },
  { action: "Предупреждение", target: "RuleBreaker", admin: "Moderator1", time: "1 ч назад", icon: "AlertOctagon", color: "#ffdd00" },
  { action: "Разбан", target: "FairPlayer", admin: "Admin_X", time: "2 ч назад", icon: "CheckCircle", color: "#00ff88" },
  { action: "Кик", target: "GlitchUser", admin: "CyberHawk", time: "3 ч назад", icon: "LogOut", color: "#ff6600" },
];

const statusBadge = (status: string) => {
  const map: Record<string, { label: string; color: string }> = {
    open:     { label: "Открыта",  color: "#00ff88" },
    review:   { label: "Проверка", color: "#ffdd00" },
    closed:   { label: "Закрыта",  color: "#888" },
    rejected: { label: "Отклонён", color: "#ff4444" },
  };
  const s = map[status] || { label: status, color: "#aaa" };
  return (
    <span className="text-xs px-2 py-0.5 rounded-full font-montserrat font-semibold"
      style={{ color: s.color, background: s.color + "22", border: `1px solid ${s.color}44` }}>
      {s.label}
    </span>
  );
};

const priorityDot = (p: string) => {
  const colors: Record<string, string> = { high: "#ff4444", medium: "#ffdd00", low: "#00ff88" };
  return (
    <span className="inline-block w-2 h-2 rounded-full mr-2 flex-shrink-0"
      style={{ background: colors[p] || "#aaa", boxShadow: `0 0 6px ${colors[p] || "#aaa"}` }} />
  );
};

export default function Index() {
  const [section, setSection] = useState<Section>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [complaintForm, setComplaintForm] = useState({ title: "", desc: "", player: "" });
  const [adminForm, setAdminForm] = useState({ age: "", exp: "", reason: "" });

  return (
    <div className="min-h-screen gradient-bg font-montserrat">

      {/* Фоновые RGB-круги */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-10 float-anim"
          style={{ background: "radial-gradient(circle, #ff00ff, transparent 70%)" }} />
        <div className="absolute top-[30%] right-[-15%] w-[400px] h-[400px] rounded-full opacity-10 float-anim"
          style={{ background: "radial-gradient(circle, #00ffff, transparent 70%)", animationDelay: "1.5s" }} />
        <div className="absolute bottom-[-10%] left-[30%] w-[450px] h-[450px] rounded-full opacity-10 float-anim"
          style={{ background: "radial-gradient(circle, #7700ff, transparent 70%)", animationDelay: "3s" }} />
      </div>

      {/* HEADER */}
      <header className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-white/8"
        style={{ background: "rgba(5,5,15,0.85)", backdropFilter: "blur(20px)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center rgb-border"
            style={{ background: "linear-gradient(135deg, #ff00ff22, #7700ff22)" }}>
            <Icon name="Swords" size={20} className="rgb-text" />
          </div>
          <div>
            <h1 className="font-oswald font-bold text-xl tracking-widest rgb-glow uppercase">ФОРУМ</h1>
            <div className="flex items-center gap-1.5 text-xs text-white/40">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400" style={{ boxShadow: "0 0 6px #00ff88" }} />
              <span>42 онлайн</span>
            </div>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <button key={item.id} onClick={() => setSection(item.id)}
              className={`neon-btn flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                section === item.id ? "text-white" : "text-white/50 hover:text-white/80"
              }`}
              style={section === item.id ? {
                background: "linear-gradient(135deg, #ff00ff22, #7700ff33, #00ffff22)",
                border: "1px solid #7700ff66",
                boxShadow: "0 0 16px #7700ff33"
              } : {}}>
              <Icon name={item.icon} size={15} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button className="md:hidden text-white/70" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Icon name={mobileMenuOpen ? "X" : "Menu"} size={22} />
        </button>
      </header>

      {/* Mobile nav */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden" style={{ background: "rgba(0,0,0,0.97)", backdropFilter: "blur(20px)" }}>
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <button className="absolute top-5 right-6 text-white/60" onClick={() => setMobileMenuOpen(false)}>
              <Icon name="X" size={24} />
            </button>
            {NAV_ITEMS.map((item) => (
              <button key={item.id} onClick={() => { setSection(item.id); setMobileMenuOpen(false); }}
                className={`flex items-center gap-3 px-8 py-3 rounded-xl text-lg font-bold transition-all duration-200 w-64 justify-center ${
                  section === item.id ? "text-white rgb-border" : "text-white/50"
                }`}
                style={section === item.id ? { background: "linear-gradient(135deg,#ff00ff22,#7700ff33)" } : {}}>
                <Icon name={item.icon} size={20} />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* MAIN */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8">

        {/* ===== ГЛАВНАЯ ===== */}
        {section === "home" && (
          <div className="space-y-8">
            <div className="slide-up text-center py-12">
              <p className="text-white/30 font-oswald tracking-[0.4em] text-xs mb-4 uppercase">Добро пожаловать</p>
              <h2 className="font-oswald font-black text-5xl md:text-7xl uppercase mb-4 rgb-glow tracking-wider">
                ФОРУМ
              </h2>
              <p className="text-white/50 text-sm max-w-md mx-auto leading-relaxed">
                Сообщество игроков. Жалобы, заявки, обновления — всё здесь.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {STATS.map((s, i) => (
                <div key={s.label} className={`card-glass rounded-2xl p-5 text-center slide-up section-delay-${i + 1}`}
                  style={{ borderColor: s.color + "33" }}>
                  <div className="flex justify-center mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: s.color + "22", boxShadow: `0 0 16px ${s.color}33` }}>
                      <Icon name={s.icon} size={18} style={{ color: s.color }} />
                    </div>
                  </div>
                  <div className="font-oswald font-bold text-2xl" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-white/40 text-xs mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                { id: "complaints" as Section, icon: "AlertTriangle", title: "Жалобы", desc: "Пожаловаться на игрока или нарушение правил", color: "#ff4466", count: "4 открытых" },
                { id: "admin" as Section, icon: "Shield", title: "Встать на админа", desc: "Подать заявку на должность администратора", color: "#7700ff", count: "2 заявки" },
                { id: "moderation" as Section, icon: "Eye", title: "Модерация", desc: "Журнал действий модераторов и администрации", color: "#00ffff", count: "5 действий" },
                { id: "maintenance" as Section, icon: "Settings", title: "Техработы", desc: "Статус серверов и плановые технические работы", color: "#ff8800", count: "1 активная" },
              ].map((item, i) => (
                <button key={item.id} onClick={() => setSection(item.id)}
                  className={`card-glass rounded-2xl p-6 text-left group slide-up section-delay-${i + 1}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ background: item.color + "22", boxShadow: `0 0 20px ${item.color}33` }}>
                      <Icon name={item.icon} size={22} style={{ color: item.color }} />
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full" style={{ color: item.color, background: item.color + "22" }}>
                      {item.count}
                    </span>
                  </div>
                  <h3 className="font-oswald font-bold text-xl text-white mb-1">{item.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
                  <div className="flex items-center gap-1 mt-4 text-xs font-semibold transition-all group-hover:gap-2"
                    style={{ color: item.color }}>
                    Перейти <Icon name="ArrowRight" size={13} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ===== ЖАЛОБЫ ===== */}
        {section === "complaints" && (
          <div className="space-y-6 slide-up">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-oswald font-bold text-3xl text-white uppercase tracking-wide">Жалобы</h2>
                <p className="text-white/40 text-sm mt-1">Сообщите о нарушении правил</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center rgb-border"
                style={{ background: "#ff446622" }}>
                <Icon name="AlertTriangle" size={22} style={{ color: "#ff4466" }} />
              </div>
            </div>

            <div className="card-glass rounded-2xl p-6 space-y-4" style={{ borderColor: "#ff446633" }}>
              <h3 className="font-oswald font-bold text-lg text-white flex items-center gap-2">
                <Icon name="Plus" size={18} style={{ color: "#ff4466" }} />
                Подать жалобу
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/50 text-xs mb-2 uppercase tracking-wider">Ник игрока</label>
                  <input value={complaintForm.player}
                    onChange={e => setComplaintForm(p => ({ ...p, player: e.target.value }))}
                    placeholder="PlayerName123"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#ff4466] transition-colors placeholder:text-white/20" />
                </div>
                <div>
                  <label className="block text-white/50 text-xs mb-2 uppercase tracking-wider">Заголовок</label>
                  <input value={complaintForm.title}
                    onChange={e => setComplaintForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="Кратко о нарушении"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#ff4466] transition-colors placeholder:text-white/20" />
                </div>
              </div>
              <div>
                <label className="block text-white/50 text-xs mb-2 uppercase tracking-wider">Описание</label>
                <textarea value={complaintForm.desc}
                  onChange={e => setComplaintForm(p => ({ ...p, desc: e.target.value }))}
                  placeholder="Подробно опишите нарушение, приложите доказательства..."
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#ff4466] transition-colors placeholder:text-white/20 resize-none" />
              </div>
              <button className="neon-btn px-6 py-3 rounded-xl font-oswald font-bold text-sm tracking-wider text-white transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #ff4466, #ff0044)", boxShadow: "0 0 20px #ff446644" }}>
                ОТПРАВИТЬ ЖАЛОБУ
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="text-white/50 text-xs uppercase tracking-widest">Последние жалобы</h3>
              {COMPLAINTS.map((c, i) => (
                <div key={c.id} className={`card-glass rounded-xl p-4 flex items-center justify-between slide-up section-delay-${i + 1}`}>
                  <div className="flex items-center gap-3">
                    {priorityDot(c.priority)}
                    <div>
                      <div className="text-white font-semibold text-sm">{c.title}</div>
                      <div className="text-white/30 text-xs mt-0.5">от {c.author} · {c.time}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {statusBadge(c.status)}
                    <button className="text-white/20 hover:text-white/60 transition-colors">
                      <Icon name="ChevronRight" size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== ВСТАТЬ НА АДМИНА ===== */}
        {section === "admin" && (
          <div className="space-y-6 slide-up">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-oswald font-bold text-3xl text-white uppercase tracking-wide">Встать на Админа</h2>
                <p className="text-white/40 text-sm mt-1">Подайте заявку на должность</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center rgb-border"
                style={{ background: "#7700ff22" }}>
                <Icon name="Shield" size={22} style={{ color: "#9944ff" }} />
              </div>
            </div>

            <div className="card-glass rounded-2xl p-5 grid md:grid-cols-3 gap-4" style={{ borderColor: "#7700ff33" }}>
              {[
                { icon: "Clock", text: "Минимум 100 часов на сервере", color: "#9944ff" },
                { icon: "Calendar", text: "Возраст от 16 лет", color: "#7700ff" },
                { icon: "Star", text: "Чистый игровой аккаунт", color: "#aa44ff" },
              ].map(r => (
                <div key={r.text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: r.color + "22" }}>
                    <Icon name={r.icon} size={15} style={{ color: r.color }} />
                  </div>
                  <span className="text-white/60 text-xs">{r.text}</span>
                </div>
              ))}
            </div>

            <div className="card-glass rounded-2xl p-6 space-y-4" style={{ borderColor: "#7700ff33" }}>
              <h3 className="font-oswald font-bold text-lg text-white flex items-center gap-2">
                <Icon name="FileEdit" size={18} style={{ color: "#9944ff" }} />
                Заявка на администратора
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/50 text-xs mb-2 uppercase tracking-wider">Ваш возраст</label>
                  <input value={adminForm.age}
                    onChange={e => setAdminForm(p => ({ ...p, age: e.target.value }))}
                    placeholder="18"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#9944ff] transition-colors placeholder:text-white/20" />
                </div>
                <div>
                  <label className="block text-white/50 text-xs mb-2 uppercase tracking-wider">Опыт в модерации</label>
                  <input value={adminForm.exp}
                    onChange={e => setAdminForm(p => ({ ...p, exp: e.target.value }))}
                    placeholder="2 года на другом сервере"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#9944ff] transition-colors placeholder:text-white/20" />
                </div>
              </div>
              <div>
                <label className="block text-white/50 text-xs mb-2 uppercase tracking-wider">Почему вы хотите стать администратором?</label>
                <textarea value={adminForm.reason}
                  onChange={e => setAdminForm(p => ({ ...p, reason: e.target.value }))}
                  placeholder="Расскажите о своих мотивах, опыте и как вы можете помочь серверу..."
                  rows={5}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#9944ff] transition-colors placeholder:text-white/20 resize-none" />
              </div>
              <button className="neon-btn px-6 py-3 rounded-xl font-oswald font-bold text-sm tracking-wider text-white transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #7700ff, #aa44ff)", boxShadow: "0 0 20px #7700ff44" }}>
                ПОДАТЬ ЗАЯВКУ
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="text-white/50 text-xs uppercase tracking-widest">Активные заявки</h3>
              {ADMIN_APPS.map((a, i) => (
                <div key={a.id} className={`card-glass rounded-xl p-4 flex items-center justify-between slide-up section-delay-${i + 1}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: "#7700ff22" }}>
                      <Icon name="User" size={16} style={{ color: "#9944ff" }} />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{a.author}</div>
                      <div className="text-white/30 text-xs mt-0.5">{a.age} лет · Опыт: {a.exp}</div>
                    </div>
                  </div>
                  {statusBadge(a.status)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== МОДЕРАЦИЯ ===== */}
        {section === "moderation" && (
          <div className="space-y-6 slide-up">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-oswald font-bold text-3xl text-white uppercase tracking-wide">Модерация</h2>
                <p className="text-white/40 text-sm mt-1">Журнал действий администрации</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center rgb-border"
                style={{ background: "#00ffff22" }}>
                <Icon name="Eye" size={22} style={{ color: "#00ffff" }} />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Бан", icon: "Ban", color: "#ff4444" },
                { label: "Мут", icon: "MicOff", color: "#ff8800" },
                { label: "Кик", icon: "LogOut", color: "#ffdd00" },
                { label: "Предупреждение", icon: "AlertOctagon", color: "#00ffff" },
              ].map(a => (
                <button key={a.label} className="card-glass rounded-xl p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform"
                  style={{ borderColor: a.color + "33" }}>
                  <Icon name={a.icon} size={22} style={{ color: a.color }} />
                  <span className="text-white/70 text-xs font-semibold">{a.label}</span>
                </button>
              ))}
            </div>

            <div className="card-glass rounded-2xl overflow-hidden" style={{ borderColor: "#00ffff22" }}>
              <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
                <Icon name="ScrollText" size={16} style={{ color: "#00ffff" }} />
                <span className="font-oswald font-bold text-white tracking-wide">ЖУРНАЛ ДЕЙСТВИЙ</span>
              </div>
              <div className="divide-y divide-white/5">
                {MOD_LOG.map((log, i) => (
                  <div key={i} className={`px-5 py-4 flex items-center justify-between hover:bg-white/3 transition-colors slide-up section-delay-${i + 1}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: log.color + "22" }}>
                        <Icon name={log.icon} size={15} style={{ color: log.color }} />
                      </div>
                      <div>
                        <span className="text-white font-semibold text-sm">{log.action}</span>
                        <span className="text-white/40 text-sm"> → </span>
                        <span className="text-white/70 text-sm">{log.target}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white/30 text-xs">{log.admin}</div>
                      <div className="text-white/20 text-xs">{log.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== ТЕХРАБОТЫ ===== */}
        {section === "maintenance" && (
          <div className="space-y-6 slide-up">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-oswald font-bold text-3xl text-white uppercase tracking-wide">Техработы</h2>
                <p className="text-white/40 text-sm mt-1">Статус серверов и плановые работы</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center rgb-border"
                style={{ background: "#ff880022" }}>
                <Icon name="Settings" size={22} style={{ color: "#ff8800" }} />
              </div>
            </div>

            <div className="rounded-2xl p-6 maintenance-stripe"
              style={{ background: "rgba(255,136,0,0.08)", border: "1px solid #ff880033" }}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center float-anim"
                  style={{ background: "#ff880033", boxShadow: "0 0 30px #ff880044" }}>
                  <Icon name="Wrench" size={28} style={{ color: "#ff8800" }} />
                </div>
                <div>
                  <h3 className="font-oswald font-bold text-2xl" style={{ color: "#ff8800" }}>ТЕХРАБОТЫ АКТИВНЫ</h3>
                  <p className="text-white/50 text-sm mt-1">Плановое обновление сервера · Ожидаемое время: 2 часа</p>
                </div>
              </div>
              <div className="mt-4 bg-black/30 rounded-xl h-2 overflow-hidden">
                <div className="h-full rounded-xl" style={{ width: "65%", background: "linear-gradient(90deg, #ff8800, #ffdd00)" }} />
              </div>
              <div className="flex justify-between text-xs text-white/30 mt-1">
                <span>Прогресс</span>
                <span>65%</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                { name: "Основной сервер", status: "maintenance", uptime: "99.2%", icon: "Server" },
                { name: "Веб-сервер форума", status: "online", uptime: "100%", icon: "Globe" },
                { name: "База данных", status: "online", uptime: "99.9%", icon: "Database" },
                { name: "Резервный сервер", status: "offline", uptime: "0%", icon: "HardDrive" },
              ].map((srv, i) => {
                const sColors: Record<string, { color: string; label: string }> = {
                  online:      { color: "#00ff88", label: "Онлайн" },
                  offline:     { color: "#ff4444", label: "Оффлайн" },
                  maintenance: { color: "#ff8800", label: "Техработы" },
                };
                const sc = sColors[srv.status];
                return (
                  <div key={srv.name} className={`card-glass rounded-xl p-5 flex items-center justify-between slide-up section-delay-${i + 1}`}
                    style={{ borderColor: sc.color + "22" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: sc.color + "15" }}>
                        <Icon name={srv.icon} size={18} style={{ color: sc.color }} />
                      </div>
                      <div>
                        <div className="text-white font-semibold text-sm">{srv.name}</div>
                        <div className="text-white/30 text-xs">Uptime: {srv.uptime}</div>
                      </div>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full font-semibold"
                      style={{ color: sc.color, background: sc.color + "22", border: `1px solid ${sc.color}44` }}>
                      {sc.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="card-glass rounded-2xl overflow-hidden" style={{ borderColor: "#ff880022" }}>
              <div className="px-5 py-4 border-b border-white/5">
                <span className="font-oswald font-bold text-white tracking-wide">ИСТОРИЯ ТЕХРАБОТ</span>
              </div>
              <div className="divide-y divide-white/5">
                {[
                  { title: "Обновление античита", date: "10 апр 2026", duration: "45 мин" },
                  { title: "Расширение диска", date: "5 апр 2026", duration: "1.5 ч" },
                  { title: "Патч безопасности", date: "28 мар 2026", duration: "30 мин" },
                ].map((w, i) => (
                  <div key={i} className="px-5 py-4 flex items-center justify-between hover:bg-white/3 transition-colors">
                    <div className="flex items-center gap-3">
                      <Icon name="CheckCircle" size={16} style={{ color: "#00ff88" }} />
                      <div>
                        <div className="text-white text-sm font-semibold">{w.title}</div>
                        <div className="text-white/30 text-xs">{w.date} · {w.duration}</div>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ color: "#00ff88", background: "#00ff8822" }}>
                      Выполнено
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 mt-12 px-6 py-6 text-center text-white/20 text-xs"
        style={{ background: "rgba(0,0,0,0.3)" }}>
        <span className="rgb-text font-oswald font-bold tracking-widest">ФОРУМ</span>
        <span className="mx-3">·</span>
        Все права защищены © 2026
      </footer>
    </div>
  );
}
