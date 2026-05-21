import Link from "next/link"

export default function AtomTuzilishi() {
  const bolimlar = [
    {
      href: "/ilmiy/chuqurlashgan/atom-tuzilishi/modellar",
      icon: "🧪",
      title: "Atom tuzilishi modellari",
      desc: "Tomson, Rezerford, Bor modellari. Kvant-mexanik modelga o'tish. Har bir modelning yutug'i va kamchiliklari.",
      badge: "Tarixiy",
      badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
      rang: "hover:border-yellow-400/50",
      rangText: "group-hover:text-yellow-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/atom-tuzilishi/kvant-sonlar",
      icon: "📐",
      title: "Kvant sonlar",
      desc: "Bosh (n), orbital (l), magnit (mₗ), spin (mₛ) kvant sonlari. Har birining fizik ma'nosi va qabul qiladigan qiymatlari.",
      badge: "Asosiy",
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30",
      rang: "hover:border-green-400/50",
      rangText: "group-hover:text-green-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli",
      icon: "🎯",
      title: "d-orbitallarning shakli",
      desc: "5 ta d-orbital (dxy, dxz, dyz, dz², dx²−y²) — shakli, fazoviy yo'nalishi va 3D modeli.",
      badge: "3D model",
      badgeColor: "bg-purple-600/20 text-purple-400 border-purple-600/30",
      rang: "hover:border-purple-400/50",
      rangText: "group-hover:text-purple-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-energiya",
      icon: "⚡",
      title: "d-orbitallarning energiyasi",
      desc: "Erkin ionda degenerat holat. Oktaedrik, tetraedrik va tekis kvadrat maydonlarda energetik ajralish.",
      badge: "Muhim",
      badgeColor: "bg-orange-600/20 text-orange-400 border-orange-600/30",
      rang: "hover:border-orange-400/50",
      rangText: "group-hover:text-orange-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/atom-tuzilishi/elektron-konfig",
      icon: "🔄",
      title: "d-elektron konfiguratsiyalar",
      desc: "d¹ dan d¹⁰ gacha. Xund qoidasi. Yuqori spin va quyi spinli holatlar. Pauli prinsipi.",
      badge: "Konfiguratsiya",
      badgeColor: "bg-blue-600/20 text-blue-400 border-blue-600/30",
      rang: "hover:border-blue-400/50",
      rangText: "group-hover:text-blue-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/atom-tuzilishi/metallar",
      icon: "🧲",
      title: "Kompleks hosil qiluvchi metallar",
      desc: "3d, 4d, 5d elementlari. Qaysilari kompleks hosil qiladi? Ion radiusi, zaryad va elektron konfiguratsiya ta'siri.",
      badge: "Davriy jadval",
      badgeColor: "bg-red-600/20 text-red-400 border-red-600/30",
      rang: "hover:border-red-400/50",
      rangText: "group-hover:text-red-400"
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Chuqurlashgan mavzular</Link>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">🔬 Atom tuzilishi va d-orbitallar</h1>
          <p className="text-purple-400 text-sm">Kompleks birikmalarning elektron asoslari • 6 ta bo'lim</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12">
        
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold text-white mb-4">📋 Bu bo'limda nimalarni o'rganasiz?</h2>
          <p className="text-purple-200 leading-relaxed mb-4">
            Atom tuzilishi va d-orbitallar — kompleks birikmalar kimyosining <strong className="text-yellow-400">fundamental asosi</strong>. 
            d-orbitallarning shakli, energiyasi va elektron konfiguratsiyalari komplekslarning barcha xossalarini belgilaydi.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">6 ta bo'lim</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">3D model</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Tarixiy rivojlanish</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">II bob asosida</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {bolimlar.map((b, i) => (
            <Link 
              key={i}
              href={b.href}
              className={`group bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 hover:bg-purple-800/60 ${b.rang} transition-all transform hover:-translate-y-2 hover:shadow-xl`}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{b.icon}</div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className={`text-base font-bold text-white ${b.rangText} transition-colors`}>{b.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${b.badgeColor} font-semibold`}>{b.badge}</span>
              </div>
              <p className="text-purple-300 text-sm leading-relaxed">{b.desc}</p>
            </Link>
          ))}
        </div>

        <div className="mt-10 bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-6 text-center">
          <p className="text-purple-300 text-sm">
            📚 Manba: Molekulalar tuzilishi va kimyoviy bog'lanish — II bob. Atom tuzilishi
          </p>
        </div>

      </section>
    </main>
  )
}