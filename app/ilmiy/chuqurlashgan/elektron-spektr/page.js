import Link from "next/link"

export default function ElektronSpektr() {
  const bolimlar = [
    {
      href: "/ilmiy/chuqurlashgan/elektron-spektr/term-belgilar",
      icon: "🏷️",
      title: "Term belgilar",
      desc: "Erkin ion termlari. Russell-Saunders bog'lanishi. ²S+¹L holatlar. d¹-d⁹ konfiguratsiyalar uchun asosiy termlar. Mikroholatlar soni va Hund qoidalari.",
      badge: "Asosiy",
      badgeColor: "bg-purple-600/20 text-purple-400 border-purple-600/30",
      rang: "hover:border-purple-400/50",
      rangText: "group-hover:text-purple-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/elektron-spektr/tanlash-qoidalari",
      icon: "📏",
      title: "Tanlash qoidalari",
      desc: "Laport qoidasi (g→g taqiqlangan). Spin qoidasi (ΔS=0). Simmetriya qoidalari. Vibronik bog'lanish mexanizmi. Qoidalarning yengilish holatlari.",
      badge: "Muhim",
      badgeColor: "bg-orange-600/20 text-orange-400 border-orange-600/30",
      rang: "hover:border-orange-400/50",
      rangText: "group-hover:text-orange-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/elektron-spektr/orgel-diagrammalari",
      icon: "📈",
      title: "Orgel diagrammalari",
      desc: "d¹, d⁴, d⁶, d⁹ konfiguratsiyalar uchun. Oktaedrik va tetraedrik maydonlarda. Orgel diagramma tuzilishi va d-d o'tish energiyalari.",
      badge: "Diagramma",
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30",
      rang: "hover:border-green-400/50",
      rangText: "group-hover:text-green-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/elektron-spektr/tanabe-sugano",
      icon: "📉",
      title: "Tanabe-Sugano diagrammalari",
      desc: "d²-d⁸ konfiguratsiyalar uchun to'liq diagrammalar. Δo/B parametr. Yuqori/quyi spin o'tishlari. Diagrammani o'qish va tahlil qilish.",
      badge: "Chuqur",
      badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
      rang: "hover:border-yellow-400/50",
      rangText: "group-hover:text-yellow-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/elektron-spektr/rang",
      icon: "🌈",
      title: "Komplekslarning rangi",
      desc: "Rang nazariyasi asoslari. Yutilish va qaytarish spektrlari. Rang g'ildiragi. d-d, MLCT va LMCT zaryad ko'chishi o'tishlari. Misollar galereyasi.",
      badge: "Amaliy",
      badgeColor: "bg-pink-600/20 text-pink-400 border-pink-600/30",
      rang: "hover:border-pink-400/50",
      rangText: "group-hover:text-pink-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/elektron-spektr/spektr-tahlil",
      icon: "🔍",
      title: "Spektrlarni tahlil qilish",
      desc: "Eksperimental UB-Vis spektrlarni tahlil. Δo ni hisoblash usullari. Racah parametrlari B va C. Nefelauksetrik effekt va β koeffitsiyent.",
      badge: "Hisoblash",
      badgeColor: "bg-cyan-600/20 text-cyan-400 border-cyan-600/30",
      rang: "hover:border-cyan-400/50",
      rangText: "group-hover:text-cyan-400"
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Chuqurlashgan mavzular</Link>
        <div>
          <h1 className="text-2xl font-bold text-pink-400">🎨 Elektron spektrlari va rang</h1>
          <p className="text-purple-400 text-sm">Term belgilar • Tanlash qoidalari • Orgel/Tanabe-Sugano diagrammalari • Rang nazariyasi</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12">
        
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold text-white mb-4">📋 Bu bo'limda nimalarni o'rganasiz?</h2>
          <p className="text-purple-200 leading-relaxed mb-4">
            <strong className="text-yellow-400">Elektron spektrlari</strong> — kompleks birikmalarning elektron tuzilishini 
            o'rganishning eng kuchli eksperimental usulidir. Bu bo'limda siz erkin ion term belgilaridan boshlab, 
            <strong className="text-yellow-400">Tanabe-Sugano diagrammalari</strong>gacha bo'lgan to'liq nazariy asosni, 
            shuningdek komplekslarning <strong className="text-yellow-400">ranglarini tushuntirish</strong> va 
            eksperimental spektrlarni tahlil qilishni o'rganasiz.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="bg-pink-600/20 text-pink-400 border border-pink-600/30 px-3 py-1 rounded-full text-xs">6 ta bo'lim</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Term belgilar</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">Orgel &amp; Tanabe-Sugano</span>
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs">Rang nazariyasi</span>
            <span className="bg-cyan-600/20 text-cyan-400 border border-cyan-600/30 px-3 py-1 rounded-full text-xs">Spektr tahlili</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

        <div className="mt-10 bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-700/50 rounded-2xl p-6 text-center">
          <p className="text-purple-300 text-sm">
            📚 Manba: A.M. Nasimov, X.Sh. Tashpulatov — Noorganik kimyoning tanlangan boblari (VII bob) |
            B.N. Figgis, M.A. Hitchman — Ligand Field Theory and Its Applications
          </p>
        </div>

      </section>
    </main>
  )
}