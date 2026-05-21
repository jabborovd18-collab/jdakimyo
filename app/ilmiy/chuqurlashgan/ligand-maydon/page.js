import Link from "next/link"

export default function LigandMaydon() {
  const bolimlar = [
    {
      href: "/ilmiy/chuqurlashgan/ligand-maydon/asoslari",
      icon: "📐",
      title: "LMN asoslari",
      desc: "KMN va MO nazariyalarining birlashmasi. Metall va ligand orbitallarining simmetriya bo'yicha ta'siri. SALC tushunchasi.",
      badge: "Asosiy",
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30",
      rang: "hover:border-green-400/50",
      rangText: "group-hover:text-green-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/ligand-maydon/sigma-boglanish",
      icon: "🔄",
      title: "σ-bog'lanish LMN da",
      desc: "σ-donor ligandlar. Metallning s, p, d orbitallari va ligand SALC lar. Bog'lovchi va bo'shashtiruvchi MO lar.",
      badge: "Bog'lanish",
      badgeColor: "bg-blue-600/20 text-blue-400 border-blue-600/30",
      rang: "hover:border-blue-400/50",
      rangText: "group-hover:text-blue-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/ligand-maydon/pi-boglanish",
      icon: "⚡",
      title: "π-bog'lanish LMN da",
      desc: "π-donor va π-akseptor ligandlarning Δo ga ta'siri. Nega CN⁻ kuchli, F⁻ kuchsiz maydonli ekanligi.",
      badge: "Muhim",
      badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
      rang: "hover:border-yellow-400/50",
      rangText: "group-hover:text-yellow-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/ligand-maydon/mo-diagramma",
      icon: "📊",
      title: "MO energiya diagrammasi",
      desc: "Oktaedrik kompleks uchun to'liq MO diagrammasi. σ va π ta'sirni hisobga olgan holda energiya sathlari.",
      badge: "Diagramma",
      badgeColor: "bg-purple-600/20 text-purple-400 border-purple-600/30",
      rang: "hover:border-purple-400/50",
      rangText: "group-hover:text-purple-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/ligand-maydon/kmn-vs-lmn",
      icon: "🎯",
      title: "KMN vs LMN — taqqoslash",
      desc: "Qaysi holatda qaysi nazariya yaxshiroq? Afzalliklar, kamchiliklar va qo'llanish sohalari.",
      badge: "Taqqoslash",
      badgeColor: "bg-orange-600/20 text-orange-400 border-orange-600/30",
      rang: "hover:border-orange-400/50",
      rangText: "group-hover:text-orange-400"
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Chuqurlashgan mavzular</Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">🧩 Ligand maydon nazariyasi</h1>
          <p className="text-purple-400 text-sm">KMN + MO birlashmasi • σ va π bog'lanish • 5 ta bo'lim</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12">
        
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold text-white mb-4">📋 Bu bo'limda nimalarni o'rganasiz?</h2>
          <p className="text-purple-200 leading-relaxed mb-4">
            <strong className="text-yellow-400">Ligand maydon nazariyasi (LMN)</strong> — kristall maydon nazariyasi va 
            molekulyar orbitallar nazariyasining <strong className="text-yellow-400">birlashmasi</strong>.
            KMN ning soddaligini va MO nazariyasining aniqligini o'zida mujassamlashtirgan.
            LMN komplekslarning <strong className="text-yellow-400">barcha xossalarini</strong> tushuntirib bera oladi.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">5 ta bo'lim</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">KMN + MO</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">σ va π bog'lar</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Diagrammalar</span>
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
            📚 Manba: A.M. Nasimov, X.Sh. Tashpulatov — Noorganik kimyoning tanlangan boblari (5.10-bo'lim)
          </p>
        </div>

      </section>
    </main>
  )
}