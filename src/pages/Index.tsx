import { useState } from "react";
import Icon from "@/components/ui/icon";

const ADMIN_PASSWORD = "%panelhelpera%";

// ── типы ──────────────────────────────────────────────────────────────────────
type Role   = { id: number; name: string; color: string; perms: Record<string, boolean> };
type User   = { id: number; name: string; roleId: number; status: "online"|"offline"; joined: string };
type Topic  = { id: number; sectionId: number; title: string; authorId: number; pinned: boolean; locked: boolean; createdAt: string; views: number };
type Reply  = { id: number; topicId: number; authorId: number; text: string; createdAt: string };
type Section = { id: number; title: string; icon: string; color: string; desc: string };
type ForumView = "main" | "section" | "topic" | "newTopic";
type AdminTab  = "dashboard" | "users" | "actions" | "logs" | "roles" | "settings";

// ── константы ────────────────────────────────────────────────────────────────
const ALL_PERMS = [
  { key: "ban",         label: "Банить игроков"      },
  { key: "mute",        label: "Мутить игроков"      },
  { key: "kick",        label: "Кикать с сайта"      },
  { key: "warn",        label: "Выдавать варны"      },
  { key: "unban",       label: "Разбанивать"         },
  { key: "unmute",      label: "Размучивать"         },
  { key: "unwarn",      label: "Снимать варны"       },
  { key: "roles",       label: "Управление ролями"   },
  { key: "announce",    label: "Объявления"          },
  { key: "settings",    label: "Настройки форума"    },
  { key: "logs",        label: "Просмотр логов"      },
  { key: "manageUsers", label: "Управление юзерами"  },
];

const INIT_ROLES: Role[] = [
  { id:1, name:"Владелец",      color:"#ff00ff", perms: Object.fromEntries(ALL_PERMS.map(p=>[p.key,true])) },
  { id:2, name:"Администратор", color:"#ff4466", perms: Object.fromEntries(ALL_PERMS.map(p=>[p.key,p.key!=="settings"])) },
  { id:3, name:"Модератор",     color:"#ffdd00", perms: Object.fromEntries(ALL_PERMS.map(p=>[p.key,["ban","mute","kick","warn","unban","unmute","unwarn","logs"].includes(p.key)])) },
  { id:4, name:"VIP",           color:"#00ffff", perms: Object.fromEntries(ALL_PERMS.map(p=>[p.key,false])) },
  { id:5, name:"Игрок",         color:"#7777aa", perms: Object.fromEntries(ALL_PERMS.map(p=>[p.key,false])) },
];

const INIT_USERS: User[] = [
  { id:1, name:"CyberHawk", roleId:2, status:"online",  joined:"1 янв 2025"  },
  { id:2, name:"NeonByte",  roleId:3, status:"online",  joined:"15 фев 2025" },
  { id:3, name:"DarkWolf",  roleId:5, status:"offline", joined:"3 мар 2025"  },
  { id:4, name:"QuantumZ",  roleId:5, status:"online",  joined:"22 мар 2025" },
  { id:5, name:"SkyRider",  roleId:4, status:"offline", joined:"5 апр 2025"  },
];

const INIT_SECTIONS: Section[] = [
  { id:1, title:"Общий",       icon:"MessageSquare", color:"#00ffff", desc:"Обсуждения на любые темы"       },
  { id:2, title:"Объявления",  icon:"Megaphone",     color:"#ff00ff", desc:"Официальные новости сервера"    },
  { id:3, title:"Игровой чат", icon:"Gamepad2",      color:"#00ff88", desc:"Всё об игре и сервере"          },
  { id:4, title:"Предложения", icon:"Lightbulb",     color:"#ffdd00", desc:"Ваши идеи для улучшения"        },
];

const INIT_TOPICS: Topic[] = [
  { id:1, sectionId:1, title:"Как повысить свой ранг?",      authorId:3, pinned:true,  locked:false, createdAt:"10 мин назад", views:340  },
  { id:2, sectionId:1, title:"Баг с инвентарём",              authorId:5, pinned:false, locked:false, createdAt:"1 ч назад",    views:98   },
  { id:3, sectionId:3, title:"Набор в клан [NEON]",           authorId:2, pinned:false, locked:false, createdAt:"2 ч назад",    views:510  },
  { id:4, sectionId:2, title:"Обновление сервера 2.4.1",      authorId:1, pinned:true,  locked:true,  createdAt:"вчера",        views:1200 },
  { id:5, sectionId:2, title:"Правила форума — читать всем",  authorId:1, pinned:true,  locked:true,  createdAt:"3 дня назад",  views:3400 },
  { id:6, sectionId:4, title:"Предложение: новые режимы игры",authorId:4, pinned:false, locked:false, createdAt:"5 ч назад",    views:77   },
];

const INIT_REPLIES: Reply[] = [
  { id:1, topicId:1, authorId:2, text:"Нужно выполнять квесты и участвовать в ивентах — это самый быстрый способ!",                 createdAt:"8 мин назад"  },
  { id:2, topicId:1, authorId:1, text:"Согласен с NeonByte. Также донат-ранги дают буст к опыту.",                                   createdAt:"5 мин назад"  },
  { id:3, topicId:2, authorId:4, text:"У меня такая же проблема, инвентарь сбрасывается после перезахода.",                          createdAt:"45 мин назад" },
  { id:4, topicId:3, authorId:2, text:"Требования: 18+, активность каждый день, Discord обязателен. Пишите в ЛС.",                   createdAt:"1 ч назад"    },
];

const MOD_LOG_INIT = [
  { id:1, action:"Бан",    target:"SpamUser123", admin:"CyberHawk", time:"5 мин назад",  icon:"Ban",         color:"#ff4444" },
  { id:2, action:"Мут",    target:"ToxicPlayer", admin:"Admin_X",   time:"20 мин назад", icon:"MicOff",      color:"#ff8800" },
  { id:3, action:"Разбан", target:"FairPlayer",  admin:"Admin_X",   time:"2 ч назад",    icon:"CheckCircle", color:"#00ff88" },
  { id:4, action:"Кик",    target:"GlitchUser",  admin:"CyberHawk", time:"3 ч назад",    icon:"LogOut",      color:"#ff6600" },
];

// ── утилиты ──────────────────────────────────────────────────────────────────
const RgbText = ({ children, size="2xl", extra="" }: { children: React.ReactNode; size?: string; extra?: string }) => (
  <span className={`font-oswald font-black uppercase text-${size} ${extra}`}
    style={{ background:"linear-gradient(90deg,#ff00ff,#7700ff,#00ffff,#ff00ff)", backgroundSize:"300% 100%", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", animation:"rgb-bg 4s linear infinite", filter:"drop-shadow(0 0 12px #ff00ff66)" }}>
    {children}
  </span>
);

const BgOrbs = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-10 float-anim" style={{ background:"radial-gradient(circle,#ff00ff,transparent 70%)" }}/>
    <div className="absolute top-[40%] right-[-20%] w-[500px] h-[500px] rounded-full opacity-10 float-anim" style={{ background:"radial-gradient(circle,#00ffff,transparent 70%)", animationDelay:"2s" }}/>
    <div className="absolute bottom-[-15%] left-[25%] w-[500px] h-[500px] rounded-full opacity-10 float-anim" style={{ background:"radial-gradient(circle,#7700ff,transparent 70%)", animationDelay:"4s" }}/>
  </div>
);

const Toast = ({ msg, color }: { msg: string; color: string }) => (
  <div className="fixed top-6 right-6 z-[200] px-5 py-3 rounded-2xl font-semibold text-sm text-white slide-up flex items-center gap-2"
    style={{ background: color+"dd", boxShadow:`0 0 24px ${color}99`, backdropFilter:"blur(12px)" }}>
    <Icon name="CheckCircle" size={16}/>{msg}
  </div>
);

// ═════════════════════════════════════════════════════════════════════════════
//  МОДАЛ ВХОДА
// ═════════════════════════════════════════════════════════════════════════════
function AdminLoginModal({ onClose, onSuccess }: { onClose:()=>void; onSuccess:()=>void }) {
  const [pw,setPw]=useState(""); const [err,setErr]=useState(false); const [shake,setShake]=useState(false);
  const submit=()=>{ if(pw===ADMIN_PASSWORD){onSuccess();}else{setErr(true);setShake(true);setTimeout(()=>setShake(false),500);} };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background:"rgba(0,0,0,0.88)", backdropFilter:"blur(20px)" }} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className={`w-full max-w-md slide-up ${shake?"animate-[shake_0.4s_ease]":""}`}>
        <div className="card-glass rounded-3xl p-8 space-y-5" style={{ border:err?"1px solid #ff444466":"1px solid #7700ff44", boxShadow:err?"0 0 40px #ff444422":"0 0 40px #7700ff44" }}>
          <div className="text-center">
            <div className="inline-flex w-16 h-16 rounded-2xl items-center justify-center mb-3 rgb-border float-anim" style={{ background:"linear-gradient(135deg,#ff00ff18,#7700ff18)" }}>
              <Icon name="ShieldCheck" size={30} className="rgb-text"/>
            </div>
            <div><RgbText size="2xl">ADMIN PANEL</RgbText></div>
            <p className="text-white/30 text-xs mt-1 tracking-widest uppercase">Введите пароль</p>
          </div>
          <div className="relative">
            <input type="password" value={pw} onChange={e=>{setPw(e.target.value);setErr(false);}} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="••••••••••••"
              className="w-full bg-white/5 border rounded-xl px-4 py-4 text-white text-sm outline-none transition-all placeholder:text-white/15 pr-12"
              style={{ borderColor:err?"#ff444466":"rgba(255,255,255,0.1)" }}/>
            <Icon name="Lock" size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20"/>
            {err&&<p className="text-xs mt-2 flex items-center gap-1" style={{ color:"#ff4466" }}><Icon name="AlertCircle" size={12}/>Неверный пароль</p>}
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-sm text-white/40 hover:text-white/70 transition-colors card-glass">Отмена</button>
            <button onClick={submit} className="flex-1 py-3 rounded-xl font-oswald font-bold text-sm tracking-widest text-white uppercase hover:scale-105 transition-all" style={{ background:"linear-gradient(135deg,#ff00ff,#7700ff)", boxShadow:"0 0 20px #7700ff55" }}>ВОЙТИ</button>
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
function AdminPanel({ onClose }: { onClose:()=>void }) {
  const [tab,setTab]=useState<AdminTab>("dashboard");
  const [roles,setRoles]=useState<Role[]>(INIT_ROLES);
  const [users,setUsers]=useState<User[]>(INIT_USERS);
  const [modLog,setModLog]=useState(MOD_LOG_INIT);
  const [actionTarget,setActionTarget]=useState("");
  const [actionReason,setActionReason]=useState("");
  const [actionDuration,setActionDuration]=useState("");
  const [giveRoleTarget,setGiveRoleTarget]=useState("");
  const [giveRoleId,setGiveRoleId]=useState<number|null>(null);
  const [editingRole,setEditingRole]=useState<Role|null>(null);
  const [editName,setEditName]=useState("");
  const [editColor,setEditColor]=useState("#7700ff");
  const [editPerms,setEditPerms]=useState<Record<string,boolean>>({});
  const [newRoleName,setNewRoleName]=useState("");
  const [newRoleColor,setNewRoleColor]=useState("#7700ff");
  const [showCreateRole,setShowCreateRole]=useState(false);
  const [settings,setSettings]=useState({ forumName:"ФОРУМ", maxBanDays:"30", muteDuration:"60", welcomeMsg:"Добро пожаловать!", maintenanceMode:false, regOpen:true, chatEnabled:true, floodProtect:true });
  const [toast,setToast]=useState<{msg:string;color:string}|null>(null);

  const showToast=(msg:string,color:string)=>{ setToast({msg,color}); setTimeout(()=>setToast(null),2500); };

  const doAction=(action:string,color:string)=>{
    if(!actionTarget.trim()){ showToast("Введите ник игрока",  "#ff4444"); return; }
    setModLog(l=>[{id:Date.now(),action,target:actionTarget,admin:"Вы",time:"только что",icon:color==="#ff4444"?"Ban":color==="#ff8800"?"MicOff":color==="#ffdd00"?"LogOut":color==="#ff6600"?"AlertOctagon":"CheckCircle",color},...l]);
    showToast(`${action} → ${actionTarget}${actionReason?` (${actionReason})`:""}`, color);
    setActionTarget(""); setActionReason(""); setActionDuration("");
  };

  const applyGiveRole=()=>{
    if(!giveRoleTarget.trim()){ showToast("Введите ник",  "#ff4444"); return; }
    if(!giveRoleId){ showToast("Выберите роль",  "#ff4444"); return; }
    const user=users.find(u=>u.name.toLowerCase()===giveRoleTarget.toLowerCase());
    if(!user){ showToast("Игрок не найден",  "#ff4444"); return; }
    const role=roles.find(r=>r.id===giveRoleId);
    setUsers(us=>us.map(u=>u.id===user.id?{...u,roleId:giveRoleId}:u));
    showToast(`Роль "${role?.name}" выдана ${user.name}`, role?.color||"#00ff88");
  };

  const takeRole=()=>{
    if(!giveRoleTarget.trim()){ showToast("Введите ник",  "#ff4444"); return; }
    const user=users.find(u=>u.name.toLowerCase()===giveRoleTarget.toLowerCase());
    if(!user){ showToast("Игрок не найден",  "#ff4444"); return; }
    setUsers(us=>us.map(u=>u.id===user.id?{...u,roleId:5}:u));
    showToast(`Роль снята с ${user.name}`, "#ff4466");
  };

  const openEditRole=(role:Role)=>{ setEditingRole(role); setEditName(role.name); setEditColor(role.color); setEditPerms({...role.perms}); };
  const saveEditRole=()=>{
    if(!editingRole||!editName.trim()) return;
    setRoles(rs=>rs.map(r=>r.id===editingRole.id?{...r,name:editName,color:editColor,perms:editPerms}:r));
    setEditingRole(null);
    showToast(`Роль "${editName}" сохранена`, editColor);
  };
  const createRole=()=>{
    if(!newRoleName.trim()) return;
    const newId=Math.max(...roles.map(r=>r.id))+1;
    setRoles(rs=>[...rs,{id:newId,name:newRoleName,color:newRoleColor,perms:Object.fromEntries(ALL_PERMS.map(p=>[p.key,false]))}]);
    setNewRoleName(""); setNewRoleColor("#7700ff"); setShowCreateRole(false);
    showToast(`Роль "${newRoleName}" создана`, newRoleColor);
  };

  const TABS:[AdminTab,string,string][]=[["dashboard","Обзор","LayoutDashboard"],["users","Игроки","Users"],["actions","Действия","Gavel"],["logs","Логи","ScrollText"],["roles","Роли","Award"],["settings","Настройки","Settings"]];

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto" style={{ background:"rgba(3,3,12,0.98)" }}>
      <BgOrbs/>
      {toast&&<Toast msg={toast.msg} color={toast.color}/>}

      {/* Редактор роли */}
      {editingRole&&(
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" style={{ background:"rgba(0,0,0,0.92)", backdropFilter:"blur(20px)" }}>
          <div className="w-full max-w-xl slide-up">
            <div className="card-glass rounded-3xl p-7 space-y-5" style={{ border:`1px solid ${editingRole.color}55`, boxShadow:`0 0 40px ${editingRole.color}33` }}>
              <div className="flex items-center justify-between">
                <span className="font-oswald font-bold text-xl text-white uppercase tracking-wide">Изменить роль</span>
                <button onClick={()=>setEditingRole(null)} className="text-white/40 hover:text-white transition-colors"><Icon name="X" size={20}/></button>
              </div>
              <div className="flex gap-3 items-center">
                <input value={editName} onChange={e=>setEditName(e.target.value)} placeholder="Название роли"
                  className="flex-1 bg-white/5 border rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors placeholder:text-white/20"
                  style={{ borderColor:editColor+"66" }}/>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-white/30 text-xs uppercase">Цвет</span>
                  <input type="color" value={editColor} onChange={e=>setEditColor(e.target.value)} className="w-14 h-10 rounded-xl cursor-pointer border-0 bg-transparent"/>
                </div>
              </div>
              <div className="px-4 py-2 rounded-xl inline-flex items-center gap-2" style={{ background:editColor+"22", border:`1px solid ${editColor}44` }}>
                <Icon name="Award" size={14} style={{ color:editColor }}/>
                <span className="font-oswald font-bold text-sm" style={{ color:editColor }}>{editName||"Название"}</span>
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Доступы (кликай чтобы вкл/выкл)</p>
                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                  {ALL_PERMS.map(p=>(
                    <button key={p.key} onClick={()=>setEditPerms(pp=>({...pp,[p.key]:!pp[p.key]}))}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left"
                      style={{ background:editPerms[p.key]?editColor+"22":"rgba(255,255,255,0.04)", border:`1px solid ${editPerms[p.key]?editColor+"55":"rgba(255,255,255,0.08)"}`, boxShadow:editPerms[p.key]?`0 0 10px ${editColor}33`:"none" }}>
                      <span className="text-xs font-semibold" style={{ color:editPerms[p.key]?editColor:"rgba(255,255,255,0.4)" }}>{p.label}</span>
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ml-2 transition-all" style={{ background:editPerms[p.key]?editColor:"rgba(255,255,255,0.1)" }}>
                        {editPerms[p.key]&&<Icon name="Check" size={11} style={{ color:"#000" }}/>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={()=>setEditingRole(null)} className="flex-1 py-3 rounded-xl font-bold text-sm text-white/40 hover:text-white transition-colors card-glass">Отмена</button>
                <button onClick={saveEditRole} className="flex-1 py-3 rounded-xl font-oswald font-bold text-sm tracking-wider text-white uppercase hover:scale-105 transition-all" style={{ background:`linear-gradient(135deg,${editColor},${editColor}aa)`, boxShadow:`0 0 20px ${editColor}55` }}>СОХРАНИТЬ</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-30 px-6 py-4 border-b border-white/8" style={{ background:"rgba(3,3,12,0.95)", backdropFilter:"blur(24px)" }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center rgb-border" style={{ background:"linear-gradient(135deg,#ff00ff18,#7700ff18)" }}>
              <Icon name="ShieldCheck" size={20} className="rgb-text"/>
            </div>
            <div>
              <RgbText size="xl" extra="tracking-[0.3em]">ADMIN PANEL</RgbText>
              <p className="text-white/25 text-xs tracking-widest uppercase">Управление форумом</p>
            </div>
          </div>
          <button onClick={onClose} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white/50 hover:text-white transition-colors card-glass">
            <Icon name="ArrowLeft" size={15}/>На форум
          </button>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Табы */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 mb-8 p-1 rounded-2xl" style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)" }}>
          {TABS.map(([id,label,icon])=>(
            <button key={id} onClick={()=>setTab(id)}
              className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300"
              style={tab===id?{ background:"linear-gradient(135deg,#ff00ff22,#7700ff44,#00ffff22)", border:"1px solid #7700ff55", boxShadow:"0 0 20px #7700ff33", color:"#fff" }:{ color:"rgba(255,255,255,0.35)" }}>
              <Icon name={icon} size={15}/><span>{label}</span>
            </button>
          ))}
        </div>

        {/* ── ОБЗОР ── */}
        {tab==="dashboard"&&(
          <div className="space-y-6 slide-up">
            <div className="mb-2"><RgbText size="4xl" extra="tracking-widest">ОБЗОР</RgbText></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {([["Пользователей",String(users.length),"Users","#ff00ff"],["Онлайн",String(users.filter(u=>u.status==="online").length),"Zap","#00ff88"],["Записей в логах",String(modLog.length),"Activity","#ff4466"],["Ролей",String(roles.length),"Award","#ff6600"]] as [string,string,string,string][]).map(([label,value,icon,color],i)=>(
                <div key={label} className={`card-glass rounded-2xl p-5 section-delay-${i+1}`} style={{ borderColor:color+"44" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background:color+"22", boxShadow:`0 0 16px ${color}44` }}>
                    <Icon name={icon} size={18} style={{ color }}/>
                  </div>
                  <div className="font-oswald font-black text-3xl" style={{ color, filter:`drop-shadow(0 0 8px ${color}88)` }}>{value}</div>
                  <div className="text-white/40 text-xs mt-1">{label}</div>
                </div>
              ))}
            </div>
            <div className="card-glass rounded-2xl overflow-hidden" style={{ borderColor:"#00ffff22" }}>
              <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                <span className="font-oswald font-bold text-white tracking-wide flex items-center gap-2"><Icon name="Activity" size={16} style={{ color:"#00ffff" }}/>ПОСЛЕДНИЕ ДЕЙСТВИЯ</span>
                <button onClick={()=>setTab("logs")} className="text-white/30 hover:text-white/60 text-xs transition-colors">Все логи →</button>
              </div>
              <div className="divide-y divide-white/5">
                {modLog.slice(0,5).map((log,i)=>(
                  <div key={i} className="px-5 py-3 flex items-center justify-between hover:bg-white/2 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background:log.color+"22" }}>
                        <Icon name={log.icon} size={13} style={{ color:log.color }}/>
                      </div>
                      <span className="text-white/80 text-sm"><span className="font-semibold" style={{ color:log.color }}>{log.action}</span><span className="text-white/40"> → </span>{log.target}</span>
                    </div>
                    <span className="text-white/25 text-xs">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── ИГРОКИ ── */}
        {tab==="users"&&(
          <div className="space-y-4 slide-up">
            <div className="mb-2"><RgbText size="3xl" extra="tracking-widest">ИГРОКИ</RgbText></div>
            <div className="card-glass rounded-2xl overflow-hidden">
              <div className="divide-y divide-white/5">
                {users.map(u=>{
                  const role=roles.find(r=>r.id===u.roleId);
                  return (
                    <div key={u.id} className="px-5 py-4 flex items-center justify-between hover:bg-white/3 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-oswald font-bold" style={{ background:(role?.color||"#777")+"22", border:`1px solid ${role?.color||"#777"}44` }}>
                          <span style={{ color:role?.color||"#aaa" }}>{u.name[0]}</span>
                        </div>
                        <div>
                          <div className="text-white font-semibold text-sm flex items-center gap-2">
                            {u.name}
                            <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background:u.status==="online"?"#00ff88":"#555", boxShadow:u.status==="online"?"0 0 6px #00ff88":"none" }}/>
                          </div>
                          <div className="text-white/30 text-xs">С {u.joined}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ color:role?.color||"#aaa", background:(role?.color||"#aaa")+"22" }}>{role?.name||"—"}</span>
                        <button onClick={()=>{ setGiveRoleTarget(u.name); setTab("actions"); }}
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

        {/* ── ДЕЙСТВИЯ ── */}
        {tab==="actions"&&(
          <div className="space-y-5 slide-up">
            <div className="mb-2"><RgbText size="3xl" extra="tracking-widest">ДЕЙСТВИЯ</RgbText></div>
            <div className="card-glass rounded-2xl p-5 space-y-3" style={{ borderColor:"#ff00ff33" }}>
              <p className="text-white/40 text-xs uppercase tracking-widest">Цель действия</p>
              <div className="flex gap-3">
                <input value={actionTarget} onChange={e=>setActionTarget(e.target.value)} placeholder="Никнейм игрока..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#ff00ff] transition-colors placeholder:text-white/20"/>
                <input value={actionDuration} onChange={e=>setActionDuration(e.target.value)} placeholder="Срок (мин/ч)"
                  className="w-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#ff00ff] transition-colors placeholder:text-white/20"/>
              </div>
              <input value={actionReason} onChange={e=>setActionReason(e.target.value)} placeholder="Причина..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#ff00ff] transition-colors placeholder:text-white/20"/>
            </div>
            <div className="card-glass rounded-2xl p-5" style={{ borderColor:"#ff444433" }}>
              <p className="font-oswald font-bold text-sm uppercase tracking-widest mb-4" style={{ color:"#ff4444" }}>⚠ НАКАЗАНИЯ</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {([["Бан","Ban","#ff3333","Полная блокировка"],["Мут","MicOff","#ff8800","Запрет сообщений"],["Кик с сайта","LogOut","#ffdd00","Принудительный выход"],["Варн","AlertOctagon","#ff6600","Предупреждение"]] as [string,string,string,string][]).map(([label,icon,color,desc])=>(
                  <button key={label} onClick={()=>doAction(label,color)}
                    className="flex flex-col items-start gap-3 p-4 rounded-2xl transition-all hover:scale-105 active:scale-95 text-left"
                    style={{ background:color+"15", border:`1px solid ${color}33` }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:color+"25", boxShadow:`0 0 14px ${color}44` }}>
                      <Icon name={icon} size={20} style={{ color }}/>
                    </div>
                    <div><div className="font-oswald font-bold text-base" style={{ color }}>{label}</div><div className="text-white/30 text-xs">{desc}</div></div>
                  </button>
                ))}
              </div>
            </div>
            <div className="card-glass rounded-2xl p-5" style={{ borderColor:"#00ff8833" }}>
              <p className="font-oswald font-bold text-sm uppercase tracking-widest mb-4" style={{ color:"#00ff88" }}>✓ СНЯТИЕ НАКАЗАНИЙ</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {([["Разбан","ShieldCheck","#00ff88","Снять бан"],["Размут","Mic","#00ffcc","Снять мут"],["Разварн","CheckCircle","#aaffaa","Снять варн"]] as [string,string,string,string][]).map(([label,icon,color,desc])=>(
                  <button key={label} onClick={()=>doAction(label,color)}
                    className="flex flex-col items-start gap-3 p-4 rounded-2xl transition-all hover:scale-105 active:scale-95 text-left"
                    style={{ background:color+"15", border:`1px solid ${color}33` }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:color+"25", boxShadow:`0 0 14px ${color}44` }}>
                      <Icon name={icon} size={20} style={{ color }}/>
                    </div>
                    <div><div className="font-oswald font-bold text-base" style={{ color }}>{label}</div><div className="text-white/30 text-xs">{desc}</div></div>
                  </button>
                ))}
              </div>
            </div>
            <div className="card-glass rounded-2xl p-5 space-y-4" style={{ borderColor:"#7700ff33" }}>
              <p className="font-oswald font-bold text-sm uppercase tracking-widest" style={{ color:"#aa44ff" }}>🎖 УПРАВЛЕНИЕ РОЛЯМИ</p>
              <input value={giveRoleTarget} onChange={e=>setGiveRoleTarget(e.target.value)} placeholder="Никнейм игрока..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#7700ff] transition-colors placeholder:text-white/20"/>
              <div>
                <p className="text-white/30 text-xs mb-2 uppercase tracking-wider">Выберите роль</p>
                <div className="flex flex-wrap gap-2">
                  {roles.map(r=>(
                    <button key={r.id} onClick={()=>setGiveRoleId(r.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105"
                      style={{ background:giveRoleId===r.id?r.color+"44":r.color+"18", border:`1px solid ${r.color}${giveRoleId===r.id?"88":"33"}`, color:r.color, boxShadow:giveRoleId===r.id?`0 0 12px ${r.color}55`:"none" }}>
                      {r.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={applyGiveRole} className="px-5 py-3 rounded-xl font-oswald font-bold text-sm text-white uppercase tracking-wider hover:scale-105 transition-all" style={{ background:"linear-gradient(135deg,#7700ff,#aa44ff)", boxShadow:"0 0 16px #7700ff44" }}>Выдать роль</button>
                <button onClick={takeRole} className="px-5 py-3 rounded-xl font-oswald font-bold text-sm text-white uppercase tracking-wider hover:scale-105 transition-all" style={{ background:"linear-gradient(135deg,#ff4466,#ff0044)", boxShadow:"0 0 16px #ff446644" }}>Забрать роль</button>
              </div>
            </div>
          </div>
        )}

        {/* ── ЛОГИ ── */}
        {tab==="logs"&&(
          <div className="space-y-4 slide-up">
            <div className="mb-2 flex items-center justify-between">
              <RgbText size="3xl" extra="tracking-widest">ЖУРНАЛ</RgbText>
              <button onClick={()=>{ setModLog([]); showToast("Журнал очищен","#ff4444"); }} className="px-3 py-1.5 rounded-xl text-xs font-bold text-white/40 hover:text-white transition-colors card-glass flex items-center gap-1">
                <Icon name="Trash2" size={12}/>Очистить
              </button>
            </div>
            {modLog.length===0?<div className="card-glass rounded-2xl p-10 text-center text-white/30">Журнал пуст</div>:(
              <div className="card-glass rounded-2xl overflow-hidden">
                <div className="divide-y divide-white/5">
                  {modLog.map((log,i)=>(
                    <div key={i} className="px-5 py-4 flex items-center justify-between hover:bg-white/2 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:log.color+"22", boxShadow:`0 0 10px ${log.color}33` }}>
                          <Icon name={log.icon} size={16} style={{ color:log.color }}/>
                        </div>
                        <div>
                          <div className="text-white text-sm"><span className="font-bold" style={{ color:log.color }}>{log.action}</span><span className="text-white/40"> → </span><span>{log.target}</span></div>
                          <div className="text-white/30 text-xs">Администратор: {log.admin}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ color:log.color, background:log.color+"18" }}>{log.action}</span>
                        <div className="text-white/20 text-xs mt-1">{log.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── РОЛИ ── */}
        {tab==="roles"&&(
          <div className="space-y-4 slide-up">
            <div className="flex items-center justify-between mb-2">
              <RgbText size="3xl" extra="tracking-widest">РОЛИ</RgbText>
              <button onClick={()=>setShowCreateRole(!showCreateRole)} className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white hover:scale-105 transition-all" style={{ background:"linear-gradient(135deg,#ff00ff,#7700ff)", boxShadow:"0 0 16px #ff00ff44" }}>
                <Icon name="Plus" size={15}/>Создать роль
              </button>
            </div>
            {showCreateRole&&(
              <div className="card-glass rounded-2xl p-5 space-y-4 slide-up" style={{ borderColor:"#ff00ff33" }}>
                <p className="font-oswald font-bold text-lg text-white">Новая роль</p>
                <div className="flex gap-3 items-center">
                  <input value={newRoleName} onChange={e=>setNewRoleName(e.target.value)} placeholder="Название роли"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#ff00ff] transition-colors placeholder:text-white/20"/>
                  <input type="color" value={newRoleColor} onChange={e=>setNewRoleColor(e.target.value)} className="w-14 h-12 rounded-xl cursor-pointer border-0 bg-transparent"/>
                </div>
                <div className="flex gap-3">
                  <button onClick={createRole} className="px-5 py-2 rounded-xl font-bold text-sm text-white hover:scale-105 transition-all" style={{ background:"linear-gradient(135deg,#ff00ff,#7700ff)" }}>Создать</button>
                  <button onClick={()=>setShowCreateRole(false)} className="px-5 py-2 rounded-xl font-bold text-sm text-white/40 hover:text-white transition-colors card-glass">Отмена</button>
                </div>
              </div>
            )}
            <div className="space-y-3">
              {roles.map(role=>(
                <div key={role.id} className="card-glass rounded-2xl p-5" style={{ borderColor:role.color+"44", boxShadow:`0 0 20px ${role.color}11` }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background:role.color+"22", border:`1px solid ${role.color}55`, boxShadow:`0 0 16px ${role.color}33` }}>
                        <Icon name="Award" size={20} style={{ color:role.color }}/>
                      </div>
                      <div>
                        <div className="font-oswald font-bold text-lg" style={{ color:role.color, filter:`drop-shadow(0 0 8px ${role.color}88)` }}>{role.name}</div>
                        <div className="text-white/30 text-xs">{Object.values(role.perms).filter(Boolean).length} из {ALL_PERMS.length} доступов</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={()=>openEditRole(role)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold hover:scale-105 transition-all" style={{ background:role.color+"25", color:role.color, border:`1px solid ${role.color}44`, boxShadow:`0 0 12px ${role.color}33` }}>
                        <Icon name="Edit" size={14}/>Изменить
                      </button>
                      <button onClick={()=>{ setRoles(rs=>rs.filter(r=>r.id!==role.id)); showToast("Роль удалена","#ff4444"); }} className="w-9 h-9 rounded-xl flex items-center justify-center hover:scale-110 transition-all" style={{ background:"#ff444418", border:"1px solid #ff444433" }}>
                        <Icon name="Trash2" size={14} style={{ color:"#ff4444" }}/>
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_PERMS.map(p=>(
                      <span key={p.key} className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{ background:role.perms[p.key]?role.color+"22":"rgba(255,255,255,0.05)", color:role.perms[p.key]?role.color:"rgba(255,255,255,0.2)", border:`1px solid ${role.perms[p.key]?role.color+"44":"transparent"}` }}>
                        {p.label}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── НАСТРОЙКИ ── */}
        {tab==="settings"&&(
          <div className="space-y-6 slide-up">
            <div className="mb-2"><RgbText size="3xl" extra="tracking-widest">НАСТРОЙКИ</RgbText></div>
            <div className="card-glass rounded-2xl p-6 space-y-4" style={{ borderColor:"#00ffff33" }}>
              <p className="font-oswald font-bold text-sm uppercase tracking-widest" style={{ color:"#00ffff" }}>Основные</p>
              <div className="grid md:grid-cols-2 gap-4">
                {([{key:"forumName",label:"Название форума"},{key:"maxBanDays",label:"Макс. срок бана (дней)"},{key:"muteDuration",label:"Мут по умолчанию (мин)"},{key:"welcomeMsg",label:"Приветствие"}] as {key:keyof typeof settings;label:string}[]).map(f=>(
                  <div key={f.key}>
                    <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">{f.label}</label>
                    <input value={settings[f.key] as string} onChange={e=>setSettings(s=>({...s,[f.key]:e.target.value}))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#00ffff] transition-colors"/>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-glass rounded-2xl p-6 space-y-3" style={{ borderColor:"#7700ff33" }}>
              <p className="font-oswald font-bold text-sm uppercase tracking-widest" style={{ color:"#aa44ff" }}>Управление</p>
              {([{key:"maintenanceMode",label:"Режим техработ",desc:"Скрыть форум",color:"#ff8800",icon:"Wrench"},{key:"regOpen",label:"Регистрация открыта",desc:"Новые пользователи",color:"#00ff88",icon:"UserPlus"},{key:"chatEnabled",label:"Чат включён",desc:"Глобальный чат",color:"#00ffff",icon:"MessageSquare"},{key:"floodProtect",label:"Защита от флуда",desc:"Лимит сообщений",color:"#7700ff",icon:"Shield"}] as {key:keyof typeof settings;label:string;desc:string;color:string;icon:string}[]).map(item=>(
                <div key={item.key} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/3 transition-colors" style={{ border:"1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background:item.color+"22" }}><Icon name={item.icon} size={16} style={{ color:item.color }}/></div>
                    <div><div className="text-white font-semibold text-sm">{item.label}</div><div className="text-white/30 text-xs">{item.desc}</div></div>
                  </div>
                  <button onClick={()=>setSettings(s=>({...s,[item.key]:!s[item.key]}))}
                    className="w-12 h-6 rounded-full relative transition-all duration-300 flex-shrink-0"
                    style={{ background:(settings[item.key] as boolean)?`linear-gradient(90deg,${item.color}99,${item.color})`:"rgba(255,255,255,0.1)", boxShadow:(settings[item.key] as boolean)?`0 0 12px ${item.color}66`:"none" }}>
                    <span className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow" style={{ left:(settings[item.key] as boolean)?"calc(100% - 20px)":"4px" }}/>
                  </button>
                </div>
              ))}
            </div>
            <button onClick={()=>showToast("Настройки сохранены!","#00ff88")}
              className="w-full py-4 rounded-2xl font-oswald font-bold text-sm tracking-widest text-white uppercase hover:scale-[1.01] transition-all"
              style={{ background:"linear-gradient(135deg,#7700ff,#ff00ff,#00ffff)", backgroundSize:"200% 100%", animation:"rgb-bg 5s linear infinite", boxShadow:"0 0 24px #7700ff44" }}>
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
function Forum({ onAdminOpen }: { onAdminOpen:()=>void }) {
  const [view,setView]=useState<ForumView>("main");
  const [activeSectionId,setActiveSectionId]=useState(1);
  const [activeTopicId,setActiveTopicId]=useState<number|null>(null);
  const [topics,setTopics]=useState<Topic[]>(INIT_TOPICS);
  const [replies,setReplies]=useState<Reply[]>(INIT_REPLIES);
  const [replyText,setReplyText]=useState("");
  const [newTopicTitle,setNewTopicTitle]=useState("");
  const [newTopicText,setNewTopicText]=useState("");
  const [toast,setToast]=useState<{msg:string;color:string}|null>(null);

  const showToast=(msg:string,color:string)=>{ setToast({msg,color}); setTimeout(()=>setToast(null),2500); };

  const activeSection=INIT_SECTIONS.find(s=>s.id===activeSectionId)||INIT_SECTIONS[0];
  const activeTopic=topics.find(t=>t.id===activeTopicId);
  const sectionTopics=topics.filter(t=>t.sectionId===activeSectionId).sort((a,b)=>(b.pinned?1:0)-(a.pinned?1:0));
  const topicReplies=replies.filter(r=>r.topicId===activeTopicId);
  const getUser=(id:number)=>INIT_USERS.find(u=>u.id===id);
  const getRole=(roleId:number)=>INIT_ROLES.find(r=>r.id===roleId);

  const submitReply=()=>{
    if(!replyText.trim()){ showToast("Напишите текст ответа","#ff4444"); return; }
    if(!activeTopicId) return;
    if(activeTopic?.locked){ showToast("Тема закрыта, ответить нельзя","#ff4444"); return; }
    const newReply:Reply={ id:Date.now(), topicId:activeTopicId, authorId:4, text:replyText, createdAt:"только что" };
    setReplies(r=>[...r,newReply]);
    setTopics(ts=>ts.map(t=>t.id===activeTopicId?{...t,views:t.views+1}:t));
    setReplyText("");
    showToast("Ответ опубликован!","#00ff88");
  };

  const submitNewTopic=()=>{
    if(!newTopicTitle.trim()){ showToast("Введите заголовок темы","#ff4444"); return; }
    if(!newTopicText.trim()){ showToast("Напишите текст темы","#ff4444"); return; }
    const newT:Topic={ id:Date.now(), sectionId:activeSectionId, title:newTopicTitle, authorId:4, pinned:false, locked:false, createdAt:"только что", views:0 };
    const firstReply:Reply={ id:Date.now()+1, topicId:newT.id, authorId:4, text:newTopicText, createdAt:"только что" };
    setTopics(ts=>[newT,...ts]);
    setReplies(r=>[...r,firstReply]);
    setNewTopicTitle(""); setNewTopicText("");
    setActiveTopicId(newT.id);
    setView("topic");
    showToast("Тема создана!","#00ff88");
  };

  const openTopic=(topicId:number)=>{
    setActiveTopicId(topicId);
    setTopics(ts=>ts.map(t=>t.id===topicId?{...t,views:t.views+1}:t));
    setView("topic");
  };

  return (
    <div className="min-h-screen gradient-bg font-montserrat">
      <BgOrbs/>
      {toast&&<Toast msg={toast.msg} color={toast.color}/>}

      {/* Header */}
      <header className="relative z-20 px-6 py-4 border-b border-white/8" style={{ background:"rgba(4,4,14,0.9)", backdropFilter:"blur(24px)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={()=>setView("main")}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center rgb-border" style={{ background:"linear-gradient(135deg,#ff00ff18,#7700ff18)" }}>
              <Icon name="Swords" size={20} className="rgb-text"/>
            </div>
            <RgbText size="2xl" extra="tracking-[0.3em]">ФОРУМ</RgbText>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background:"#00ff8818", border:"1px solid #00ff8833" }}>
              <span className="inline-block w-2 h-2 rounded-full" style={{ background:"#00ff88", boxShadow:"0 0 8px #00ff88" }}/>
              <span className="text-xs font-semibold" style={{ color:"#00ff88" }}>{INIT_USERS.filter(u=>u.status==="online").length} онлайн</span>
            </div>
            <button onClick={onAdminOpen} className="flex items-center gap-2 px-4 py-2 rounded-xl font-oswald font-bold text-sm hover:scale-105 transition-all" style={{ background:"linear-gradient(135deg,#ff00ff22,#7700ff44)", border:"1px solid #7700ff66", boxShadow:"0 0 16px #7700ff33" }}>
              <Icon name="ShieldCheck" size={15} style={{ color:"#ff00ff" }}/>
              <span className="rgb-text">Админ панель</span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8">

        {/* ── ГЛАВНАЯ ── */}
        {view==="main"&&(
          <div className="space-y-8">
            <div className="slide-up text-center py-10">
              <p className="text-white/25 font-oswald tracking-[0.5em] text-xs mb-3 uppercase">Добро пожаловать</p>
              <h2 className="font-oswald font-black text-5xl md:text-7xl uppercase mb-4 tracking-wider"
                style={{ background:"linear-gradient(90deg,#ff00ff,#7700ff,#00ffff,#ff6600,#ff00ff)", backgroundSize:"400% 100%", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", animation:"rgb-bg 5s linear infinite", filter:"drop-shadow(0 0 30px #ff00ff55)" }}>
                ФОРУМ
              </h2>
              <p className="text-white/40 text-sm max-w-md mx-auto">Сообщество игроков. Общение, новости, поддержка.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {INIT_SECTIONS.map((s,i)=>(
                <button key={s.id} onClick={()=>{ setActiveSectionId(s.id); setView("section"); }}
                  className={`card-glass rounded-2xl p-6 text-left group slide-up section-delay-${i+1}`} style={{ borderColor:s.color+"44" }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ background:s.color+"22", boxShadow:`0 0 20px ${s.color}44` }}>
                      <Icon name={s.icon} size={22} style={{ color:s.color }}/>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold" style={{ color:s.color }}>{topics.filter(t=>t.sectionId===s.id).length} тем</div>
                      <div className="text-white/25 text-xs">{replies.filter(r=>topics.find(t=>t.id===r.topicId&&t.sectionId===s.id)).length} ответов</div>
                    </div>
                  </div>
                  <h3 className="font-oswald font-bold text-xl text-white mb-1">{s.title}</h3>
                  <p className="text-white/30 text-xs mb-3">{s.desc}</p>
                  <div className="flex items-center gap-1 text-xs font-semibold group-hover:gap-2 transition-all" style={{ color:s.color }}>
                    Открыть <Icon name="ArrowRight" size={13}/>
                  </div>
                </button>
              ))}
            </div>
            {/* Последние темы */}
            <div className="card-glass rounded-2xl overflow-hidden slide-up" style={{ borderColor:"#ff660033" }}>
              <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
                <Icon name="Flame" size={16} style={{ color:"#ff6600" }}/>
                <span className="font-oswald font-bold tracking-wide" style={{ background:"linear-gradient(90deg,#ff6600,#ffdd00)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>ПОСЛЕДНИЕ ТЕМЫ</span>
              </div>
              <div className="divide-y divide-white/5">
                {[...topics].sort((a,b)=>b.id-a.id).slice(0,6).map(t=>{
                  const sec=INIT_SECTIONS.find(s=>s.id===t.sectionId);
                  const author=getUser(t.authorId);
                  return (
                    <button key={t.id} onClick={()=>{ setActiveSectionId(t.sectionId); openTopic(t.id); }}
                      className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/3 transition-colors text-left">
                      <div className="flex items-center gap-3 min-w-0">
                        {t.pinned&&<Icon name="Pin" size={13} style={{ color:"#ff00ff", flexShrink:0 }}/>}
                        {t.locked&&<Icon name="Lock" size={13} style={{ color:"#ff6600", flexShrink:0 }}/>}
                        <div className="min-w-0">
                          <div className="text-white font-semibold text-sm truncate">{t.title}</div>
                          <div className="text-white/30 text-xs">от {author?.name||"?"} · {t.createdAt} · <span style={{ color:sec?.color }}>{sec?.title}</span></div>
                        </div>
                      </div>
                      <div className="hidden sm:flex items-center gap-6 flex-shrink-0 ml-4 text-center">
                        <div><div className="text-white/60 text-xs font-semibold">{replies.filter(r=>r.topicId===t.id).length}</div><div className="text-white/20 text-xs">ответов</div></div>
                        <div><div className="text-white/60 text-xs font-semibold">{t.views}</div><div className="text-white/20 text-xs">просмотров</div></div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── РАЗДЕЛ ── */}
        {view==="section"&&(
          <div className="space-y-6 slide-up">
            {/* Хлебные крошки */}
            <div className="flex items-center gap-2 text-sm">
              <button onClick={()=>setView("main")} className="text-white/40 hover:text-white transition-colors flex items-center gap-1"><Icon name="Home" size={14}/>Главная</button>
              <span className="text-white/20">/</span>
              <span style={{ color:activeSection.color }}>{activeSection.title}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background:activeSection.color+"22", boxShadow:`0 0 16px ${activeSection.color}44` }}>
                  <Icon name={activeSection.icon} size={22} style={{ color:activeSection.color }}/>
                </div>
                <div>
                  <h2 className="font-oswald font-bold text-2xl uppercase" style={{ color:activeSection.color, filter:`drop-shadow(0 0 10px ${activeSection.color}88)` }}>{activeSection.title}</h2>
                  <p className="text-white/30 text-xs">{activeSection.desc}</p>
                </div>
              </div>
              <button onClick={()=>setView("newTopic")} className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm hover:scale-105 transition-all" style={{ background:`linear-gradient(135deg,${activeSection.color}44,${activeSection.color}88)`, border:`1px solid ${activeSection.color}66`, color:"#fff", boxShadow:`0 0 14px ${activeSection.color}44` }}>
                <Icon name="Plus" size={14}/>Новая тема
              </button>
            </div>
            {sectionTopics.length===0?(
              <div className="card-glass rounded-2xl p-12 text-center">
                <Icon name="MessageSquare" size={40} className="mx-auto mb-3 text-white/20"/>
                <p className="text-white/30">Тем пока нет. Будь первым!</p>
                <button onClick={()=>setView("newTopic")} className="mt-4 px-5 py-2 rounded-xl font-bold text-sm text-white hover:scale-105 transition-all" style={{ background:`linear-gradient(135deg,${activeSection.color}55,${activeSection.color}99)` }}>
                  Создать тему
                </button>
              </div>
            ):(
              <div className="card-glass rounded-2xl overflow-hidden" style={{ borderColor:activeSection.color+"33" }}>
                <div className="divide-y divide-white/5">
                  {sectionTopics.map(t=>{
                    const author=getUser(t.authorId);
                    const role=getRole(author?.roleId||5);
                    const repCount=replies.filter(r=>r.topicId===t.id).length;
                    return (
                      <button key={t.id} onClick={()=>openTopic(t.id)} className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/3 transition-colors text-left group">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex flex-col items-center gap-1 flex-shrink-0">
                            {t.pinned&&<Icon name="Pin" size={12} style={{ color:"#ff00ff" }}/>}
                            {t.locked&&<Icon name="Lock" size={12} style={{ color:"#ff6600" }}/>}
                            {!t.pinned&&!t.locked&&<Icon name="MessageCircle" size={16} style={{ color:activeSection.color }}/>}
                          </div>
                          <div className="min-w-0">
                            <div className="text-white font-semibold text-sm group-hover:text-white truncate" style={{ color:t.pinned?activeSection.color:undefined }}>{t.title}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs font-semibold" style={{ color:role?.color }}>{author?.name||"?"}</span>
                              <span className="text-white/20 text-xs">·</span>
                              <span className="text-white/30 text-xs">{t.createdAt}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                          <div className="text-center hidden sm:block"><div className="text-white/60 text-xs font-semibold">{repCount}</div><div className="text-white/20 text-xs">ответов</div></div>
                          <div className="text-center hidden sm:block"><div className="text-white/60 text-xs font-semibold">{t.views}</div><div className="text-white/20 text-xs">просмотров</div></div>
                          <Icon name="ChevronRight" size={16} className="text-white/20"/>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── НОВАЯ ТЕМА ── */}
        {view==="newTopic"&&(
          <div className="space-y-6 slide-up">
            <div className="flex items-center gap-2 text-sm">
              <button onClick={()=>setView("main")} className="text-white/40 hover:text-white transition-colors flex items-center gap-1"><Icon name="Home" size={14}/>Главная</button>
              <span className="text-white/20">/</span>
              <button onClick={()=>setView("section")} style={{ color:activeSection.color }}>{activeSection.title}</button>
              <span className="text-white/20">/</span>
              <span className="text-white/60">Новая тема</span>
            </div>
            <h2 className="font-oswald font-bold text-2xl text-white uppercase">Создать тему</h2>
            <div className="card-glass rounded-2xl p-6 space-y-4" style={{ borderColor:activeSection.color+"33" }}>
              <div>
                <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Заголовок темы</label>
                <input value={newTopicTitle} onChange={e=>setNewTopicTitle(e.target.value)} placeholder="Введите заголовок..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#ff00ff] transition-colors placeholder:text-white/20"/>
              </div>
              <div>
                <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Текст темы</label>
                <textarea value={newTopicText} onChange={e=>setNewTopicText(e.target.value)} placeholder="Опишите подробно..." rows={6}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#ff00ff] transition-colors placeholder:text-white/20 resize-none"/>
              </div>
              <div className="flex gap-3">
                <button onClick={submitNewTopic} className="px-6 py-3 rounded-xl font-oswald font-bold text-sm text-white uppercase tracking-wider hover:scale-105 transition-all" style={{ background:`linear-gradient(135deg,${activeSection.color},${activeSection.color}aa)`, boxShadow:`0 0 20px ${activeSection.color}44` }}>
                  Опубликовать
                </button>
                <button onClick={()=>setView("section")} className="px-6 py-3 rounded-xl font-bold text-sm text-white/40 hover:text-white transition-colors card-glass">Отмена</button>
              </div>
            </div>
          </div>
        )}

        {/* ── ТЕМА ── */}
        {view==="topic"&&activeTopic&&(
          <div className="space-y-6 slide-up">
            {/* Хлебные крошки */}
            <div className="flex items-center gap-2 text-sm flex-wrap">
              <button onClick={()=>setView("main")} className="text-white/40 hover:text-white transition-colors flex items-center gap-1"><Icon name="Home" size={14}/>Главная</button>
              <span className="text-white/20">/</span>
              <button onClick={()=>setView("section")} style={{ color:activeSection.color }}>{activeSection.title}</button>
              <span className="text-white/20">/</span>
              <span className="text-white/60 truncate max-w-xs">{activeTopic.title}</span>
            </div>

            {/* Заголовок темы */}
            <div className="card-glass rounded-2xl p-6" style={{ borderColor:activeSection.color+"44" }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {activeTopic.pinned&&<span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ color:"#ff00ff", background:"#ff00ff22" }}>📌 Закреплено</span>}
                    {activeTopic.locked&&<span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ color:"#ff6600", background:"#ff660022" }}>🔒 Закрыто</span>}
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ color:activeSection.color, background:activeSection.color+"22" }}>{activeSection.title}</span>
                  </div>
                  <h2 className="font-oswald font-bold text-2xl text-white">{activeTopic.title}</h2>
                  <p className="text-white/30 text-xs mt-1">{getUser(activeTopic.authorId)?.name} · {activeTopic.createdAt} · {activeTopic.views} просмотров</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="text-center">
                    <div className="text-white font-bold">{topicReplies.length}</div>
                    <div className="text-white/30 text-xs">ответов</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ответы */}
            <div className="space-y-3">
              {topicReplies.length===0?(
                <div className="card-glass rounded-2xl p-8 text-center text-white/30">Ответов пока нет. Будь первым!</div>
              ):topicReplies.map((rep,i)=>{
                const author=getUser(rep.authorId);
                const role=getRole(author?.roleId||5);
                return (
                  <div key={rep.id} className={`card-glass rounded-2xl p-5 slide-up section-delay-${Math.min(i+1,5)}`} style={{ borderColor:i===0?activeSection.color+"33":"rgba(255,255,255,0.06)" }}>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 text-center">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center font-oswald font-bold text-lg mb-1" style={{ background:(role?.color||"#777")+"22", border:`1px solid ${role?.color||"#777"}44` }}>
                          <span style={{ color:role?.color||"#aaa" }}>{author?.name?.[0]||"?"}</span>
                        </div>
                        <div className="text-xs font-semibold" style={{ color:role?.color||"#aaa" }}>{author?.name||"?"}</div>
                        <div className="text-xs mt-0.5 px-1.5 py-0.5 rounded-full inline-block" style={{ color:role?.color||"#aaa", background:(role?.color||"#aaa")+"18", fontSize:"10px" }}>{role?.name||"?"}</div>
                        <div className="flex justify-center mt-1">
                          <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background:author?.status==="online"?"#00ff88":"#555", boxShadow:author?.status==="online"?"0 0 6px #00ff88":"none" }}/>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{rep.text}</div>
                        <div className="text-white/25 text-xs mt-3">{rep.createdAt}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Форма ответа */}
            {activeTopic.locked?(
              <div className="card-glass rounded-2xl p-5 text-center" style={{ borderColor:"#ff660033" }}>
                <Icon name="Lock" size={20} className="mx-auto mb-2" style={{ color:"#ff6600" }}/>
                <p className="text-white/40 text-sm">Тема закрыта для новых ответов</p>
              </div>
            ):(
              <div className="card-glass rounded-2xl p-5 space-y-3" style={{ borderColor:activeSection.color+"33" }}>
                <p className="text-white/40 text-xs uppercase tracking-widest">Ваш ответ</p>
                <textarea value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder="Напишите ответ..." rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors placeholder:text-white/20 resize-none"
                  style={{ borderColor: replyText?"rgba(255,255,255,0.2)":"rgba(255,255,255,0.08)" }}
                  onFocus={e=>e.currentTarget.style.borderColor=activeSection.color}
                  onBlur={e=>e.currentTarget.style.borderColor=replyText?"rgba(255,255,255,0.2)":"rgba(255,255,255,0.08)"}
                />
                <div className="flex items-center justify-between">
                  <span className="text-white/20 text-xs">{replyText.length} символов</span>
                  <button onClick={submitReply} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-oswald font-bold text-sm text-white uppercase tracking-wider hover:scale-105 transition-all" style={{ background:`linear-gradient(135deg,${activeSection.color}88,${activeSection.color})`, boxShadow:`0 0 16px ${activeSection.color}44` }}>
                    <Icon name="Send" size={14}/>Отправить
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="relative z-10 border-t border-white/5 mt-12 px-6 py-5 text-center" style={{ background:"rgba(0,0,0,0.4)" }}>
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
  const [showLogin,setShowLogin]=useState(false);
  const [adminOpen,setAdminOpen]=useState(false);
  return (
    <>
      <Forum onAdminOpen={()=>setShowLogin(true)}/>
      {showLogin&&!adminOpen&&<AdminLoginModal onClose={()=>setShowLogin(false)} onSuccess={()=>{ setAdminOpen(true); setShowLogin(false); }}/>}
      {adminOpen&&<AdminPanel onClose={()=>setAdminOpen(false)}/>}
    </>
  );
}
