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
      desc: "Term belgilar, tanlash qoidalari, Orgel va Tanabe-Sugano diagrammalari, d-d o'tishlar, komplekslarning rangi",
      badge: "VII bob",
      badgeColor: "bg-pink-600/20 text-pink-400 border-pink-600/30",
      rang: "hover:border-pink-400/50",
      rangText: "group-hover:text-pink-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/magnit",
      icon: "🧲",
      title: "Magnit xossalari",
      desc: "μeff = √n(n+2), Gui usuli, spin-orbit bog'lanish, diamagnit va paramagnit komplekslar, magnit anizotropiya",
      badge: "VI bob",
      badgeColor: "bg-cyan-600/20 text-cyan-400 border-cyan-600/30",
      rang: "hover:border-cyan-400/50",
      rangText: "group-hover:text-cyan-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/simmetriya",
      icon: "⚛️",
      title: "Molekulalar simmetriyasi",
      desc: "Nuqtali guruhlar (Oh, Td, D4h, D3h), simmetriya elementlari, xarakterlar jadvali, tebranish modlari",
      badge: "VIII bob",
      badgeColor: "bg-red-600/20 text-red-400 border-red-600/30",
      rang: "hover:border-red-400/50",
      rangText: "group-hover:text-red-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/termodinamika",
      icon: "🌡️",
      title: "Termodinamika va barqarorlik",
      desc: "Barqarorlik konstantasi (Kstab), Irving-Uilyams qatori, xelat effekti, ΔH, ΔG, ΔS, HSAB nazariyasi",
      badge: "Hisoblash",
      badgeColor: "bg-teal-600/20 text-teal-400 border-teal-600/30",
      rang: "hover:border-teal-400/50",
      rangText: "group-hover:text-teal-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/kinetika",
      icon: "⏱️",
      title: "Kinetika va ligand almashinish",
      desc: "Inert va labil komplekslar, reaksiya mexanizmlari (D, A, I), Eyring tenglamasi, trans-ta'sir",
      badge: "Mexanizm",
      badgeColor: "bg-indigo-600/20 text-indigo-400 border-indigo-600/30",
      rang: "hover:border-indigo-400/50",
      rangText: "group-hover:text-indigo-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/koordinator-son",
      icon: "🔷",
      title: "Koordinator son va geometriya",
      desc: "KCh 2−12, poliedr modellari (VSEPR), Kepert modeli, trigonal bipiramida, kvadrat antiprizma, ikosaedr",
      badge: "Geometriya",
      badgeColor: "bg-violet-600/20 text-violet-400 border-violet-600/30",
      rang: "hover:border-violet-400/50",
      rangText: "group-hover:text-violet-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/izomeriya",
      icon: "🔄",
      title: "Komplekslar izomeriyasi",
      desc: "Geometrik (sis/trans, fac/mer), optik (Δ/Λ), ionlanish, bog'lanish, koordinatsion, gidrat izomeriyasi",
      badge: "IV bob",
      badgeColor: "bg-rose-600/20 text-rose-400 border-rose-600/30",
      rang: "hover:border-rose-400/50",
      rangText: "group-hover:text-rose-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/elektron-konfiguratsiya",
      icon: "📝",
      title: "Elektron konfiguratsiya va termlar",
      desc: "dⁿ konfiguratsiyalar, Russell-Saunders termlari, Hund qoidasi, asosiy holat, mikroholatlar jadvali",
      badge: "Termlar",
      badgeColor: "bg-amber-600/20 text-amber-400 border-amber-600/30",
      rang: "hover:border-amber-400/50",
      rangText: "group-hover:text-amber-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/zaryad-kochishi",
      icon: "💫",
      title: "Zaryad ko'chishi spektrlari",
      desc: "MLCT (Ru-bipiridin), LMCT (Fe-sianid), MMCT (Prussiya ko'ki), intervalent zaryad ko'chishi (IVCT)",
      badge: "Spektr",
      badgeColor: "bg-lime-600/20 text-lime-400 border-lime-600/30",
      rang: "hover:border-lime-400/50",
      rangText: "group-hover:text-lime-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/fotokimyo",
      icon: "💡",
      title: "Fotokimyo va fotofizika",
      desc: "Qo'zg'algan holat, fluoressensiya/fosforessensiya, [Ru(bpy)₃]²⁺, lantanid komplekslari, fotokataliz",
      badge: "Foton",
      badgeColor: "bg-sky-600/20 text-sky-400 border-sky-600/30",
      rang: "hover:border-sky-400/50",
      rangText: "group-hover:text-sky-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/reaksiyalar",
      icon: "⚗️",
      title: "Komplekslar reaksiyalari",
      desc: "Ligand almashinish, oksidlanish-qaytarilish, oksidlovchi qo'shilish, katalitik sikllar (Monsanto, Wacker)",
      badge: "Reaksiya",
      badgeColor: "bg-emerald-600/20 text-emerald-400 border-emerald-600/30",
      rang: "hover:border-emerald-400/50",
      rangText: "group-hover:text-emerald-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/metall-dorilar",
      icon: "💊",
      title: "Metall dori vositalari",
      desc: "Sisplatin, karboplatin, oksaliplatin (Pt), NAMI-A (Ru), auranofin (Au), ferroquine (Fe) — ta'sir mexanizmlari",
      badge: "Tibbiyot",
      badgeColor: "bg-red-700/20 text-red-300 border-red-700/30",
      rang: "hover:border-red-300/50",
      rangText: "group-hover:text-red-300"
    },
    {
      href: "/ilmiy/chuqurlashgan/supramolekulyar",
      icon: "🏗️",
      title: "Supramolekulyar komplekslar",
      desc: "MOF (metall-organic frameworks), metallosupramolekulyar ansambllar, host-guest kimyosi, molekulyar tanib olish",
      badge: "MOF",
      badgeColor: "bg-stone-600/20 text-stone-400 border-stone-600/30",
      rang: "hover:border-stone-400/50",
      rangText: "group-hover:text-stone-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/kop-yadroli",
      icon: "🪐",
      title: "Ko'p yadroli komplekslar",
      desc: "Metall klasterlar, M−M bog'lar ([Re₂Cl₈]²⁻), karbonil klasterlar, ko'p yadroli magnit komplekslar",
      badge: "Klaster",
      badgeColor: "bg-fuchsia-700/20 text-fuchsia-300 border-fuchsia-700/30",
      rang: "hover:border-fuchsia-300/50",
      rangText: "group-hover:text-fuchsia-300"
    },
    {
      href: "/ilmiy/chuqurlashgan/bioanorganik",
      icon: "🧬",
      title: "Bioanorganik kimyo",
      desc: "Gemoglobin/mioglobin (Fe), B₁₂ koferment (Co), xlorofill (Mg), nitrogenaza (FeMoCo), karbonat angidraza (Zn)",
      badge: "Biologik",
      badgeColor: "bg-green-700/20 text-green-300 border-green-700/30",
      rang: "hover:border-green-300/50",
      rangText: "group-hover:text-green-300"
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Ilmiy bo'lim</Link>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">🔬 Chuqurlashgan mavzular</h1>
          <p className="text-purple-400 text-sm">Kompleks birikmalar kimyosining fundamental asoslari • 22 ta mavzu</p>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Kirish */}
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold text-white mb-4">📋 Chuqurlashgan mavzular haqida</h2>
          <p className="text-purple-200 leading-relaxed mb-4">
            Bu bo'lim kompleks birikmalarning <strong className="text-yellow-400">nazariy asoslarini</strong> chuqur o'rganish uchun mo'ljallangan.
            Har bir mavzu kompleks birikmalarga moslashtirilgan va amaliy misollar bilan boyitilgan.
            Elektron tuzilishdan tortib bioanorganik kimyogacha — barcha fundamental yo'nalishlar qamrab olingan.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">📚 22 ta mavzu</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">🔬 Nazariy asoslar</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">💊 Amaliy qo'llanish</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">📖 Misollar bilan</span>
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs">🧪 Komplekslarga moslangan</span>
          </div>
        </div>

        {/* 22 ta mavzu */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
            Molekulalar tuzilishi va kimyoviy bog'lanish | Kompleks birikmalar kimyosi
          </p>
        </div>

      </section>
    </main>
  )
}