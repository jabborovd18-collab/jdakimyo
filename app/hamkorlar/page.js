"use client"

import Link from "next/link"
import { useState } from "react"
import { useSession } from "next-auth/react"
import toast from "react-hot-toast"

const PARTNER_CHANNELS = {
  "allamurodovanazira50@gmail.com": {
    name: "Tushunarli Kimyo",
    type: "Ta'lim kanali",
    color: "yellow",
  },
  "diyorbekjabborov84@gmail.com": {
    name: "Ilmiy Kimyo",
    type: "Ilmiy kanal",
    color: "cyan",
  },
}

const MENU = [
  { id: "overview", label: "Umumiy statistika", icon: "📊" },
  { id: "videos", label: "Video darsliklar", icon: "🎬" },
  { id: "revenue", label: "Daromad statistikasi", icon: "💰" },
  { id: "channel", label: "Kanal sozlamalari", icon: "📢" },
  { id: "subscribers", label: "Kanal obunachilari", icon: "👥" },
  { id: "database", label: "Elektron ma'lumotlar bazasi", icon: "🗂️" },
  { id: "promotions", label: "Aksiya va kuponlar", icon: "🎁" },
]

const demoVideos = [
  { title: "Kompleks birikmalarga kirish", views: "12 480", sales: 48, status: "Faol", price: "35 000 so'm" },
  { title: "Koordinatsion son va geometriya", views: "8 920", sales: 31, status: "Faol", price: "45 000 so'm" },
  { title: "Ligandlar va izomeriya", views: "5 640", sales: 22, status: "Qoralama", price: "30 000 so'm" },
]

export default function HamkorDashboard() {
  const { data: session, status } = useSession()
  const [activeSection, setActiveSection] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const email = session?.user?.email?.toLowerCase()
  const channel = PARTNER_CHANNELS[email]

  if (status === "loading") return <Loading />

  if (!session) {
    return (
      <AccessMessage
        title="Kirish talab qilinadi"
        text="Hamkor dashboardidan foydalanish uchun tizimga kiring."
        href="/login"
        label="Kirish"
      />
    )
  }

  if (!channel) {
    return (
      <AccessMessage
        title="Ruxsat mavjud emas"
        text="Sizda hamkor dashboardidan foydalanish huquqi mavjud emas."
        href="/"
        label="Bosh sahifaga qaytish"
      />
    )
  }

  const activeItem = MENU.find(item => item.id === activeSection)

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 text-white">
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <header className="sticky top-0 z-40 h-16 border-b border-purple-800/50 bg-purple-950/95 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto h-full px-4 md:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(value => !value)}
              className="md:hidden p-2 rounded-lg hover:bg-purple-800/60"
              aria-label="Menyuni ochish"
            >☰</button>
            <Link href="/" className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent whitespace-nowrap">
              JDA KIMYO
            </Link>
            <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-yellow-600/20 border border-yellow-500/30 text-xs text-yellow-300">
              Hamkor dashboard
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold truncate max-w-[180px]">{channel.name}</p>
              <p className="text-xs text-purple-400 truncate max-w-[180px]">{email}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 text-black font-bold flex items-center justify-center">
              {(channel.name[0] || "H").toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto flex">
        <aside className={`fixed md:sticky top-16 left-0 z-40 w-72 h-[calc(100vh-4rem)] bg-purple-950/98 md:bg-transparent border-r border-purple-800/50 transform transition-transform md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="p-4 h-full overflow-y-auto">
            <div className="mb-5 p-4 rounded-2xl bg-gradient-to-br from-yellow-900/40 to-orange-900/20 border border-yellow-600/40">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-2xl">🤝</div>
                <div className="min-w-0">
                  <p className="font-bold text-yellow-300 truncate">{channel.name}</p>
                  <p className="text-xs text-orange-200/70">{channel.type}</p>
                </div>
              </div>
              <div className="mt-3 text-[11px] text-green-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Prototip rejimi
              </div>
            </div>

            <p className="px-3 mb-2 text-[11px] uppercase tracking-wider text-purple-500 font-bold">Boshqaruv</p>
            <nav className="space-y-1">
              {MENU.map(item => (
                <button
                  key={item.id}
                  onClick={() => { setActiveSection(item.id); setSidebarOpen(false) }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left text-sm transition-all ${activeSection === item.id ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold shadow-lg" : "text-purple-200 hover:bg-purple-900/70 hover:text-white"}`}
                >
                  <span className="w-6 text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <Link href="/" className="mt-6 flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-purple-300 hover:bg-purple-900/70 hover:text-white">
              <span>↩️</span> Saytga qaytish
            </Link>
          </div>
        </aside>

        <section className="flex-1 min-w-0 p-4 md:p-6 lg:p-8">
          <div className="mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-yellow-400 mb-1">Hamkorlar markazi / {activeItem?.label}</p>
              <h1 className="text-2xl md:text-3xl font-extrabold">{getHeading(activeSection, channel.name)}</h1>
              <p className="mt-2 text-sm text-purple-300">{getDescription(activeSection)}</p>
            </div>
            <button
              onClick={() => toast("Bu funksiya prototip bosqichida")}
              className="self-start px-4 py-2.5 rounded-xl bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition-colors"
            >
              + Yangi qo‘shish
            </button>
          </div>

          {activeSection === "overview" && <Overview />}
          {activeSection === "videos" && <Videos />}
          {activeSection === "revenue" && <Revenue />}
          {activeSection === "channel" && <ChannelSettings channel={channel} />}
          {activeSection === "subscribers" && <Subscribers />}
          {activeSection === "database" && <Database />}
          {activeSection === "promotions" && <Promotions />}
        </section>
      </div>
    </main>
  )
}

function Overview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon="💰" label="Jami daromad" value="2 450 000" suffix="so'm" color="yellow" trend="+18.4%" />
        <StatCard icon="🎬" label="Video sotuvlari" value="125" suffix="ta" color="blue" trend="+12.8%" />
        <StatCard icon="🗂️" label="Baza sotuvlari" value="83" suffix="ta" color="pink" trend="+9.2%" />
        <StatCard icon="👥" label="Obunachilar" value="12 450" suffix="ta" color="green" trend="+6.7%" />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Panel title="Daromad dinamikasi" className="xl:col-span-2">
          <DemoChart />
        </Panel>
        <Panel title="Mahsulotlar taqsimoti">
          <div className="space-y-5 pt-3">
            <Progress label="Video darsliklar" value="60%" width="60%" color="bg-yellow-400" />
            <Progress label="Elektron bazalar" value="27%" width="27%" color="bg-cyan-400" />
            <Progress label="Boshqa xizmatlar" value="13%" width="13%" color="bg-pink-400" />
          </div>
        </Panel>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Panel title="Eng ko‘p sotilgan videolar"><ProductList /></Panel>
        <Panel title="Oxirgi tranzaksiyalar"><TransactionList /></Panel>
      </div>
    </div>
  )
}

function Videos() {
  return <div className="space-y-6"><div className="grid grid-cols-2 md:grid-cols-4 gap-4"><StatCard icon="🎬" label="Jami videolar" value="18" suffix="ta" color="blue" /><StatCard icon="👁️" label="Ko‘rishlar" value="38 900" suffix="ta" color="cyan" /><StatCard icon="🛒" label="Sotuvlar" value="125" suffix="ta" color="yellow" /><StatCard icon="⭐" label="O‘rtacha reyting" value="4.8" suffix="/ 5" color="purple" /></div><Panel title="Video darsliklar ro‘yxati"><div className="overflow-x-auto"><table className="w-full min-w-[650px] text-sm"><thead><tr className="text-left text-purple-400 border-b border-purple-800/60"><th className="py-3">Video nomi</th><th>Ko‘rishlar</th><th>Sotuvlar</th><th>Narxi</th><th>Holati</th></tr></thead><tbody>{demoVideos.map(video => <tr key={video.title} className="border-b border-purple-900/60"><td className="py-4 font-semibold text-white">{video.title}</td><td className="text-purple-300">{video.views}</td><td className="text-purple-300">{video.sales}</td><td className="text-yellow-300">{video.price}</td><td><span className="px-2 py-1 rounded-full text-xs bg-green-500/15 text-green-300">{video.status}</span></td></tr>)}</tbody></table></div></Panel></div>
}

function Revenue() { return <div className="space-y-6"><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><StatCard icon="💰" label="Jami daromad" value="2 450 000" suffix="so'm" color="yellow" trend="+18.4%" /><StatCard icon="🎬" label="Video darsliklar savdosi" value="1 680 000" suffix="so'm" color="blue" /><StatCard icon="🗂️" label="Elektron bazalar savdosi" value="770 000" suffix="so'm" color="pink" /></div><Panel title="Daromad grafigi"><DemoChart /></Panel><Panel title="Daromad manbalari"><div className="grid md:grid-cols-2 gap-4"><InfoRow icon="🎬" title="Video darsliklar savdosi" value="1 680 000 so'm" /><InfoRow icon="🗂️" title="Elektron ma'lumotlar bazasi" value="770 000 so'm" /><InfoRow icon="📈" title="Platforma komissiyasi" value="245 000 so'm" /><InfoRow icon="✅" title="To‘lanadigan summa" value="2 205 000 so'm" /></div></Panel></div> }

function ChannelSettings({ channel }) { return <Panel title="Kanal ma’lumotlari"><div className="grid md:grid-cols-2 gap-5 max-w-3xl"><Field label="Kanal nomi" value={channel.name} /><Field label="Kanal turi" value={channel.type} /><Field label="Telegram havolasi" value="https://t.me/kimyo_olami" /><Field label="Instagram havolasi" value="@kimyo_olami" /><label className="md:col-span-2"><span className="block text-sm text-purple-300 mb-2">Kanal tavsifi</span><textarea defaultValue="Kimyo faniga oid video darsliklar, elektron ma’lumotlar va foydali materiallar." className="w-full h-28 rounded-xl bg-purple-950/70 border border-purple-700/60 p-3 text-white outline-none focus:border-yellow-400" /></label><button onClick={() => toast("Demo: sozlamalar saqlash funksiyasi tez orada ishlaydi")} className="md:col-span-2 w-fit px-5 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold">Saqlash</button></div></Panel> }

function Subscribers() { return <div className="space-y-6"><div className="grid grid-cols-2 md:grid-cols-3 gap-4"><StatCard icon="👥" label="Jami obunachilar" value="12 450" suffix="ta" color="green" trend="+6.7%" /><StatCard icon="📈" label="Bu oy qo‘shilgan" value="840" suffix="ta" color="cyan" /><StatCard icon="🔥" label="Faol obunachilar" value="8 920" suffix="ta" color="orange" /></div><Panel title="Obunachilar o‘sishi"><DemoChart /></Panel></div> }

function Database() { return <div className="space-y-6"><div className="grid grid-cols-2 md:grid-cols-3 gap-4"><StatCard icon="🗂️" label="Jami bazalar" value="12" suffix="ta" color="pink" /><StatCard icon="🛒" label="Sotuvlar" value="83" suffix="ta" color="yellow" /><StatCard icon="💰" label="Daromad" value="770 000" suffix="so'm" color="green" /></div><Panel title="Elektron ma’lumotlar bazasi"><div className="space-y-3"><InfoRow icon="📘" title="Kompleks birikmalar formulalari" value="42 000 so'm · 34 ta sotuv" /><InfoRow icon="📕" title="Spektral tahlil jadvali" value="55 000 so'm · 27 ta sotuv" /><InfoRow icon="📙" title="Ligandlar ma’lumotnomasi" value="35 000 so'm · 22 ta sotuv" /></div></Panel></div> }

function Promotions() { return <Panel title="Aksiya va kuponlar"><div className="grid md:grid-cols-2 gap-4"><InfoRow icon="🎟️" title="KIMYO20" value="20% chegirma · Faol" /><InfoRow icon="🎟️" title="YANGI10" value="10% chegirma · Faol" /></div></Panel> }

function StatCard({ icon, label, value, suffix, color, trend }) { const colors = { yellow: "from-yellow-900/40 to-orange-900/20 border-yellow-700/50 text-yellow-300", blue: "from-blue-900/40 to-cyan-900/20 border-blue-700/50 text-blue-300", pink: "from-pink-900/40 to-rose-900/20 border-pink-700/50 text-pink-300", green: "from-green-900/40 to-emerald-900/20 border-green-700/50 text-green-300", cyan: "from-cyan-900/40 to-teal-900/20 border-cyan-700/50 text-cyan-300", purple: "from-purple-900/40 to-indigo-900/20 border-purple-700/50 text-purple-300", orange: "from-orange-900/40 to-red-900/20 border-orange-700/50 text-orange-300" }; return <div className={`bg-gradient-to-br ${colors[color]} border rounded-2xl p-5`}><div className="flex justify-between items-start"><span className="text-2xl">{icon}</span>{trend && <span className="text-xs text-green-300">{trend}</span>}</div><p className="mt-4 text-2xl font-extrabold">{value} <span className="text-xs font-normal opacity-80">{suffix}</span></p><p className="mt-1 text-xs text-purple-300">{label}</p></div> }
function Panel({ title, children, className = "" }) { return <div className={`bg-slate-900/45 border border-purple-800/50 rounded-2xl p-5 md:p-6 ${className}`}><h2 className="text-lg font-bold mb-5 flex items-center gap-2"><span className="w-1.5 h-6 rounded-full bg-gradient-to-b from-yellow-400 to-orange-500" />{title}</h2>{children}</div> }
function DemoChart() { const bars = [42, 58, 46, 72, 64, 86, 78, 95, 74, 88, 82, 100]; return <div className="h-56 flex items-end gap-2 md:gap-4 border-b border-l border-purple-800/60 px-3 pb-0">{bars.map((height, i) => <div key={i} className="flex-1 h-full flex items-end"><div title={`${height}%`} className="w-full rounded-t-lg bg-gradient-to-t from-purple-700 to-yellow-400 hover:from-yellow-500 hover:to-orange-400 transition-all" style={{ height: `${height}%` }} /></div>)}</div> }
function Progress({ label, value, width, color }) { return <div><div className="flex justify-between text-sm mb-2"><span className="text-purple-200">{label}</span><span className="text-purple-400">{value}</span></div><div className="h-2 rounded-full bg-purple-950"><div className={`h-full rounded-full ${color}`} style={{ width }} /></div></div> }
function ProductList() { return <div className="space-y-3"><InfoRow icon="🎬" title="Kompleks birikmalarga kirish" value="48 ta sotuv" /><InfoRow icon="🎬" title="Koordinatsion son va geometriya" value="31 ta sotuv" /><InfoRow icon="🎬" title="Ligandlar va izomeriya" value="22 ta sotuv" /></div> }
function TransactionList() { return <div className="space-y-3"><InfoRow icon="✅" title="Video darslik xaridi" value="+45 000 so'm" /><InfoRow icon="✅" title="Elektron baza xaridi" value="+55 000 so'm" /><InfoRow icon="✅" title="Video darslik xaridi" value="+35 000 so'm" /></div> }
function InfoRow({ icon, title, value }) { return <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-950/45 border border-purple-800/40"><span className="text-xl">{icon}</span><div className="flex-1 min-w-0"><p className="text-sm font-semibold truncate">{title}</p><p className="text-xs text-purple-400 mt-1">{value}</p></div><span className="text-purple-500">›</span></div> }
function Field({ label, value }) { return <label><span className="block text-sm text-purple-300 mb-2">{label}</span><input defaultValue={value} className="w-full rounded-xl bg-purple-950/70 border border-purple-700/60 p-3 text-white outline-none focus:border-yellow-400" /></label> }
function getHeading(section, name) { if (section === "overview") return `Xush kelibsiz, ${name}`; return MENU.find(item => item.id === section)?.label || "Hamkor dashboard" }
function getDescription(section) { const values = { overview: "Kanalingiz va mahsulotlaringiz bo‘yicha asosiy ko‘rsatkichlar.", videos: "Video darsliklar, ko‘rishlar va sotuvlar boshqaruvi.", revenue: "Video va elektron ma’lumotlar bazasi savdosidan tushgan daromad.", channel: "Kanal ko‘rinishi va ijtimoiy havolalarni sozlang.", subscribers: "Kanal obunachilari o‘sishi va faolligi.", database: "Elektron ma’lumotlar bazasi mahsulotlarini boshqaring.", promotions: "Mahsulotlaringiz uchun aksiya va kuponlar." }; return values[section] }
function Loading() { return <div className="min-h-screen bg-purple-950 flex items-center justify-center text-purple-300">Dashboard yuklanmoqda...</div> }
function AccessMessage({ title, text, href, label }) { return <div className="min-h-screen bg-gradient-to-b from-purple-950 to-slate-950 flex items-center justify-center p-4 text-white"><div className="max-w-md text-center bg-purple-900/50 border border-purple-700/50 rounded-2xl p-8"><div className="text-5xl mb-4">🔒</div><h1 className="text-2xl font-bold mb-3">{title}</h1><p className="text-purple-300 mb-6">{text}</p><Link href={href} className="inline-block px-5 py-3 rounded-xl bg-yellow-500 text-black font-bold">{label}</Link></div></div> }
