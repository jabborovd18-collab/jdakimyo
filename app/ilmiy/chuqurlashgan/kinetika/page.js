import Link from "next/link"

export default function Kinetika() {
  const bolimlar = [
    {
      href: "/ilmiy/chuqurlashgan/kinetika/inert-labil",
      icon: "🐢",
      title: "Inert va labil komplekslar",
      desc: "Taubes klassifikatsiyasi. Inert (t½ > 1 min) va labil (t½ < 1 min) komplekslar. d³, d⁶(QS), d⁸(kv-planar) — inert. KMBE va aktivatsiya energiyasi. Reaksiya tezligiga ta'sir qiluvchi omillar.",
      badge: "Asosiy",
      badgeColor: "bg-purple-600/20 text-purple-400 border-purple-600/30",
      rang: "hover:border-purple-400/50",
      rangText: "group-hover:text-purple-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/kinetika/mexanizmlar",
      icon: "🔄",
      title: "Ligand almashinish mexanizmlari",
      desc: "Dissotsiativ (D), assotsiativ (A), almashinish (I, Id, Ia). Mexanizmlarni farqlash usullari. Aktivatsiya parametrlari (ΔV‡, ΔS‡) orqali diagnostika. Oktaedrik komplekslarda almashinish.",
      badge: "Nazariya",
      badgeColor: "bg-blue-600/20 text-blue-400 border-blue-600/30",
      rang: "hover:border-blue-400/50",
      rangText: "group-hover:text-blue-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/kinetika/oktaedrik",
      icon: "💎",
      title: "Oktaedrik komplekslarda almashinish",
      desc: "[ML₅X] + Y → [ML₅Y] + X. Suv almashinish tezlik konstantalari. d⁸ Ni²⁺ (labil) vs d³ Cr³⁺ (inert). KMBE va Δo ta'siri. Akva komplekslarda almashinish.",
      badge: "Muhim",
      badgeColor: "bg-orange-600/20 text-orange-400 border-orange-600/30",
      rang: "hover:border-orange-400/50",
      rangText: "group-hover:text-orange-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/kinetika/kvadrat-planar",
      icon: "⬛",
      title: "Kvadrat-planar komplekslarda almashinish",
      desc: "Trans-ta'sir qatori: CN⁻ > CO > PR₃ > I⁻ > Cl⁻ > NH₃ > H₂O. Pt²⁺ komplekslarida ligand almashinish mexanizmi. Sintezda selektivlik — sis/trans izomerlarni olish.",
      badge: "Sintez",
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30",
      rang: "hover:border-green-400/50",
      rangText: "group-hover:text-green-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/kinetika/elektron-kochish",
      icon: "⚡",
      title: "Elektron ko'chish reaksiyalari",
      desc: "Tashqi sfera (outer-sphere) va ichki sfera (inner-sphere) mexanizmlar. Markus nazariyasi va qayta tashkil etish energiyasi. [Fe(H₂O)₆]²⁺/[Fe(H₂O)₆]³⁺ — klassik misol.",
      badge: "Chuqur",
      badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
      rang: "hover:border-yellow-400/50",
      rangText: "group-hover:text-yellow-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/kinetika/parametrlar",
      icon: "🧮",
      title: "Kinetik parametrlarni aniqlash",
      desc: "Tezlik konstantasi (k). Aktivatsiya energiyasi (Ea). Eyring tenglamasi: ΔH‡, ΔS‡, ΔG‡. Arrenius va Eyring grafiklari. Stopped-flow va T-jump usullari.",
      badge: "Hisoblash",
      badgeColor: "bg-cyan-600/20 text-cyan-400 border-cyan-600/30",
      rang: "hover:border-cyan-400/50",
      rangText: "group-hover:text-cyan-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/kinetika/3d",
      icon: "🔮",
      title: "Ligand almashinishi 3D vizualizatsiya",
      desc: "Interaktiv 3D modellar. Dissotsiativ va assotsiativ mexanizmlar. Oktaedrik almashinish (Ni²⁺+NH₃). Kvadrat-planar trans-ta'sir (Pt²⁺). Oraliq geometriyalar animatsiyasi.",
      badge: "3D model",
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
          <h1 className="text-2xl font-bold text-indigo-400">⏱️ Kinetika va ligand almashinish</h1>
          <p className="text-purple-400 text-sm">Inert/labil • Mexanizmlar • Trans-ta&apos;sir • Elektron ko&apos;chish • Eyring tenglamasi • 3D</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12">
        
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold text-white mb-4">📋 Bu bo&apos;limda nimalarni o&apos;rganasiz?</h2>
          <p className="text-purple-200 leading-relaxed mb-4">
            <strong className="text-yellow-400">Kinetika va ligand almashinish</strong> — kompleks birikmalarning 
            <strong> dinamik xossalarini</strong> o&apos;rganuvchi fundamental bo&apos;lim. Siz 
            <strong className="text-yellow-400"> Taubes klassifikatsiyasi (inert/labil)</strong>dan boshlab, 
            <strong className="text-yellow-400"> almashinish mexanizmlari (D, A, I), trans-ta&apos;sir, 
            elektron ko&apos;chish reaksiyalari, Eyring tenglamasi</strong> va 
            <strong className="text-yellow-400"> ligand almashinishining 3D modellari</strong>gacha 
            bo&apos;lgan barcha muhim mavzularni o&apos;rganasiz.
            Kinetik barqarorlik — kompleksning amaliy qo&apos;llanish imkoniyatlarini belgilaydigan asosiy omil.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="bg-indigo-600/20 text-indigo-400 border border-indigo-600/30 px-3 py-1 rounded-full text-xs">7 ta bo&apos;lim</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Inert/labil</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Mexanizmlar</span>
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs">Trans-ta&apos;sir</span>
            <span className="bg-cyan-600/20 text-cyan-400 border border-cyan-600/30 px-3 py-1 rounded-full text-xs">Eyring</span>
            <span className="bg-pink-600/20 text-pink-400 border border-pink-600/30 px-3 py-1 rounded-full text-xs">3D model</span>
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

        <div className="mt-10 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-700/50 rounded-2xl p-6 text-center">
          <p className="text-purple-300 text-sm">
            📚 Manba: F. Basolo, R.G. Pearson — Mechanisms of Inorganic Reactions |
            R.G. Wilkins — Kinetics and Mechanism of Reactions of Transition Metal Complexes
          </p>
        </div>

      </section>
    </main>
  )
}