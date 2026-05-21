import Link from "next/link"

export default function Chuqurlashgan() {
  const mavzular = [
    {
      href: "/ilmiy/chuqurlashgan/atom-tuzilishi",
      icon: "🔬",
      title: "Atom tuzilishi va d-orbitallar",
      desc: "Shredinger tenglamasi, kvant sonlar, d-orbitallarning shakli va energiyasi, kompleks hosil qiluvchi metallarning elektron tuzilishi",
      badge: "II bob",
      badgeColor: "bg-purple-600/20 text-purple-400 border-purple-600/30",
      rang: "hover:border-purple-400/50",
      rangText: "group-hover:text-purple-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/kimyoviy-boglanish",
      icon: "🔗",
      title: "Kimyoviy bog'lanish (VB + MO)",
      desc: "Valent bog'lanish va molekulyar orbitallar nazariyalari, d²sp³/sp³d² gibridlanish, Metall-ligand σ va π bog'lar",
      badge: "III bob",
      badgeColor: "bg-blue-600/20 text-blue-400 border-blue-600/30",
      rang: "hover:border-blue-400/50",
      rangText: "group-hover:text-blue-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/kristall-maydon",
      icon: "💎",
      title: "Kristall maydon nazariyasi",
      desc: "d-orbital ajralishi, Δo energiyasi, spektrokimyoviy qator, KMBE hisoblash, yuqori va quyi spinli holatlar",
      badge: "Asosiy",
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30",
      rang: "hover:border-green-400/50",
      rangText: "group-hover:text-green-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/ligand-maydon",
      icon: "🧩",
      title: "Ligand maydon nazariyasi",
      desc: "KMN va MO birlashmasi, σ-donor va π-akseptor ligandlar, MLCT va LMCT zaryad ko'chishi",
      badge: "Chuqur",
      badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
      rang: "hover:border-yellow-400/50",
      rangText: "group-hover:text-yellow-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/yan-teller",
      icon: "⚡",
      title: "Yan-Teller effekti",
      desc: "d⁴ va d⁹ konfiguratsiyalarda oktaedrik buzilish, Cu²⁺ komplekslari misolida, spektroskopik namoyon bo'lishi",
      badge: "Muhim",
      badgeColor: "bg-orange-600/20 text-orange-400 border-orange-600/30",
      rang: "hover:border-orange-400/50",
      rangText: "group-hover:text-orange-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/elektron-spektr",
      icon: "🎨",
      title: "Elektron spektrlari va rang",
      desc: "Term belgilar, tanlash qoidalari, Orgel va Tanabe-Sugano diagrammalari, d-d o'tishlar",
      badge: "VII bob",
      badgeColor: "bg-pink-600/20 text-pink-400 border-pink-600/30",
      rang: "hover:border-pink-400/50",
      rangText: "group-hover:text-pink-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/magnit",
      icon: "🧲",
      title: "Magnit xossalari",
      desc: "μeff = √n(n+2), Gui usuli, spin-orbit bog'lanish, diamagnit va paramagnit komplekslar",
      badge: "VI bob",
      badgeColor: "bg-cyan-600/20 text-cyan-400 border-cyan-600/30",
      rang: "hover:border-cyan-400/50",
      rangText: "group-hover:text-cyan-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/simmetriya",
      icon: "⚛️",
      title: "Molekulalar simmetriyasi",
      desc: "Nuqtali guruhlar (Oh, Td, D4h, D3h), simmetriya elementlari, xarakterlar jadvali",
      badge: "VIII bob",
      badgeColor: "bg-red-600/20 text-red-400 border-red-600/30",
      rang: "hover:border-red-400/50",
      rangText: "group-hover:text-red-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/termodinamika",
      icon: "🌡️",
      title: "Termodinamika va barqarorlik",
      desc: "Barqarorlik konstantasi (Kstab), Irving-Uilyams qatori, xelat effekti, ΔH, ΔG, ΔS",
      badge: "Hisoblash",
      badgeColor: "bg-teal-600/20 text-teal-400 border-teal-600/30",
      rang: "hover:border-teal-400/50",
      rangText: "group-hover:text-teal-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/kinetika",
      icon: "⏱️",
      title: "Kinetika va ligand almashinish",
      desc: "Inert va labil komplekslar, reaksiya mexanizmlari, Eyring tenglamasi, trans-ta'sir",
      badge: "Mexanizm",
      badgeColor: "bg-indigo-600/20 text-indigo-400 border-indigo-600/30",
      rang: "hover:border-indigo-400/50",
      rangText: "group-hover:text-indigo-400"
    },
    {
      href: "/ilmiy/tahlil/iq",
      icon: "📊",
      title: "IQ spektroskopiya komplekslarda",
      desc: "Tebranish chastotalari, metall-ligand bog'lanishi, ambidentat ligandlarni IQ orqali farqlash",
      badge: "Tahlil",
      badgeColor: "bg-blue-600/20 text-blue-400 border-blue-600/30",
      rang: "hover:border-blue-400/50",
      rangText: "group-hover:text-blue-400"
    },
    {
      href: "/ilmiy/tahlil/rentgen",
      icon: "💎",
      title: "Rentgen difraksiyasi komplekslarda",
      desc: "Kristall panjarasi, bog' uzunliklari, burchaklar, fazoviy guruhlar, Bragg qonuni",
      badge: "Tahlil",
      badgeColor: "bg-purple-600/20 text-purple-400 border-purple-600/30",
      rang: "hover:border-purple-400/50",
      rangText: "group-hover:text-purple-400"
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Ilmiy bo'lim</Link>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">🔬 Chuqurlashgan mavzular</h1>
          <p className="text-purple-400 text-sm">Kompleks birikmalar kimyosining fundamental asoslari • 12 ta mavzu</p>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Kirish */}
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold text-white mb-4">📋 Chuqurlashgan mavzular haqida</h2>
          <p className="text-purple-200 leading-relaxed mb-4">
            Bu bo'lim <strong className="text-yellow-400">ikki kitob asosida</strong> tayyorlangan bo'lib,
            kompleks birikmalarning nazariy asoslarini chuqur o'rganish uchun mo'ljallangan.
            Har bir mavzu kompleks birikmalarga moslashtirilgan va amaliy misollar bilan boyitilgan.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">📚 2 ta kitob asosida</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">🔬 10 ta nazariy mavzu</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">🔍 2 ta tahlil usuli</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">📖 Misollar bilan</span>
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs">🧪 Komplekslarga moslangan</span>
          </div>
        </div>

        {/* 12 ta mavzu */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {mavzular.map((m, i) => (
            <Link 
              key={i}
              href={m.href}
              className={`group bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 hover:bg-purple-800/60 ${m.rang} transition-all transform hover:-translate-y-2 hover:shadow-xl`}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{m.icon}</div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className={`text-base font-bold text-white ${m.rangText} transition-colors`}>
                  {m.title}
                </h3>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${m.badgeColor} font-semibold`}>
                  {m.badge}
                </span>
              </div>
              <p className="text-purple-300 text-sm leading-relaxed">{m.desc}</p>
            </Link>
          ))}
        </div>

        {/* Kitob havolasi */}
        <div className="mt-10 bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-6 text-center">
          <p className="text-purple-300 text-sm">
            📚 Manbalar: A.M. Nasimov, X.Sh. Tashpulatov — Noorganik kimyoning tanlangan boblari |
            Molekulalar tuzilishi va kimyoviy bog'lanish
          </p>
        </div>

      </section>
    </main>
  )
}