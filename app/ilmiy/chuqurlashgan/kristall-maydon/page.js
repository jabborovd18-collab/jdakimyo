import Link from "next/link"

export default function KristallMaydon() {
  const bolimlar = [
    {
      href: "/ilmiy/chuqurlashgan/kristall-maydon/d-orbital-ajralishi",
      icon: "📐",
      title: "d-orbital ajralishi",
      desc: "Oktaedrik, tetraedrik va tekis kvadrat maydonlarda 5 ta d-orbitalning energetik ajralishi. t₂g va eg.",
      badge: "3D model",
      badgeColor: "bg-purple-600/20 text-purple-400 border-purple-600/30",
      rang: "hover:border-purple-400/50",
      rangText: "group-hover:text-purple-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/kristall-maydon/ajralish-energiyasi",
      icon: "📊",
      title: "Δo — ajralish energiyasi",
      desc: "Δo qiymatiga ta'sir qiluvchi omillar: metall zaryadi, davri, ligand kuchi. Δtet = (4/9)Δokt.",
      badge: "Asosiy",
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30",
      rang: "hover:border-green-400/50",
      rangText: "group-hover:text-green-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/kristall-maydon/spektrokimyoviy-qator",
      icon: "🧪",
      title: "Spektrokimyoviy qator",
      desc: "Ligandlarning maydon kuchi bo'yicha to'liq joylashuvi. I⁻ dan CO gacha. π-donor va π-akseptor ta'siri.",
      badge: "To'liq jadval",
      badgeColor: "bg-blue-600/20 text-blue-400 border-blue-600/30",
      rang: "hover:border-blue-400/50",
      rangText: "group-hover:text-blue-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/kristall-maydon/kmbe-hisoblash",
      icon: "🔢",
      title: "KMBE hisoblash",
      desc: "Kristall maydon barqarorlashish energiyasi. d¹−d¹⁰ konfiguratsiyalar uchun hisoblash usullari.",
      badge: "Hisoblash",
      badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
      rang: "hover:border-yellow-400/50",
      rangText: "group-hover:text-yellow-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/kristall-maydon/yuqori-quyi-spin",
      icon: "🧲",
      title: "Yuqori va quyi spin",
      desc: "Δo vs P — juftlashish energiyasi. Qachon qaysi spin bo'lishi. Magnit xossalar bilan bog'liqligi.",
      badge: "Muhim",
      badgeColor: "bg-orange-600/20 text-orange-400 border-orange-600/30",
      rang: "hover:border-orange-400/50",
      rangText: "group-hover:text-orange-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/kristall-maydon/rang-spektrlar",
      icon: "🎨",
      title: "Rang va spektrlar",
      desc: "d-d o'tishlar. Tanlash qoidalari: Laporta, spin, juftlik. Komplekslarning rangi sababi.",
      badge: "UB-Vis",
      badgeColor: "bg-pink-600/20 text-pink-400 border-pink-600/30",
      rang: "hover:border-pink-400/50",
      rangText: "group-hover:text-pink-400"
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Chuqurlashgan mavzular</Link>
        <div>
          <h1 className="text-2xl font-bold text-green-400">💎 Kristall maydon nazariyasi</h1>
          <p className="text-purple-400 text-sm">d-orbital ajralishi • Δo • Spektrokimyoviy qator • KMBE • Spin • Rang</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12">
        
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold text-white mb-4">📋 Bu bo'limda nimalarni o'rganasiz?</h2>
          <p className="text-purple-200 leading-relaxed mb-4">
            <strong className="text-yellow-400">Kristall maydon nazariyasi (KMN)</strong> — kompleks birikmalarning 
            <strong className="text-yellow-400"> rangi, magnit xossalari va geometriyasini</strong> tushuntirib beradigan eng muhim nazariya.
            VB va MO nazariyalaridan farqli, KMN <strong className="text-yellow-400">elektrostatik yondashuv</strong>ga asoslangan.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">6 ta bo'lim</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">3D model</span>
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs">Hisoblashlar</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">To'liq jadval</span>
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
            📚 Manba: A.M. Nasimov, X.Sh. Tashpulatov — Noorganik kimyoning tanlangan boblari (5.6-bo'lim)
          </p>
        </div>

      </section>
    </main>
  )
}