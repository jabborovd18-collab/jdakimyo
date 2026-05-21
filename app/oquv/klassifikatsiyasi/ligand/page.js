import Link from "next/link"

export default function LigandTabiatigaKora() {
  const guruhlar = [
    {
      href: "/oquv/klassifikatsiyasi/ligand/akva",
      icon: "💧",
      title: "Akvakomplekslar",
      desc: "Ligand: H₂O (suv). Eng ko'p tarqalgan komplekslar turi.",
      badge: "Asosiy",
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30",
      rang: "hover:border-blue-400/50"
    },
    {
      href: "/oquv/klassifikatsiyasi/ligand/ammin",
      icon: "🧪",
      title: "Ammiakatlar",
      desc: "Ligand: NH₃ (ammiak). Verner klassikasi.",
      badge: "Asosiy",
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30",
      rang: "hover:border-cyan-400/50"
    },
    {
      href: "/oquv/klassifikatsiyasi/ligand/atsido",
      icon: "⚡",
      title: "Atsidokomplekslar",
      desc: "Ligand: kislota qoldig'i anionlari. Eng ko'p sonli guruh.",
      badge: "Asosiy",
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30",
      rang: "hover:border-pink-400/50"
    },
    {
      href: "/oquv/klassifikatsiyasi/ligand/gidrokso",
      icon: "🔬",
      title: "Gidroksokomplekslar",
      desc: "Ligand: OH⁻ (gidroksid). Amfoter metallar uchun xarakterli.",
      badge: "Asosiy",
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30",
      rang: "hover:border-orange-400/50"
    },
    {
      href: "/oquv/klassifikatsiyasi/ligand/karbonil",
      icon: "🫧",
      title: "Karbonil komplekslar",
      desc: "Ligand: CO. Kuchli maydonli ligand. Metall karbonillari.",
      badge: "Qo'shimcha",
      badgeColor: "bg-purple-600/20 text-purple-400 border-purple-600/30",
      rang: "hover:border-purple-400/50"
    },
    {
      href: "/oquv/klassifikatsiyasi/ligand/nitrozil",
      icon: "🔵",
      title: "Nitrozil komplekslar",
      desc: "Ligand: NO. Nitroprussid kabi muhim komplekslar.",
      badge: "Qo'shimcha",
      badgeColor: "bg-purple-600/20 text-purple-400 border-purple-600/30",
      rang: "hover:border-purple-400/50"
    },
    {
      href: "/oquv/klassifikatsiyasi/ligand/sianid",
      icon: "💎",
      title: "Sianid komplekslar",
      desc: "Ligand: CN⁻. Eng barqaror anion komplekslar.",
      badge: "Qo'shimcha",
      badgeColor: "bg-purple-600/20 text-purple-400 border-purple-600/30",
      rang: "hover:border-purple-400/50"
    },
    {
      href: "/oquv/klassifikatsiyasi/ligand/galogenid",
      icon: "🧂",
      title: "Galogenid komplekslar",
      desc: "Ligand: F⁻, Cl⁻, Br⁻, I⁻. Eng sodda anion komplekslar.",
      badge: "Qo'shimcha",
      badgeColor: "bg-purple-600/20 text-purple-400 border-purple-600/30",
      rang: "hover:border-purple-400/50"
    },
    {
      href: "/oquv/klassifikatsiyasi/ligand/nitrit",
      icon: "🟠",
      title: "Nitrit komplekslar",
      desc: "Ligand: NO₂⁻/ONO⁻. Ambidentat ligand.",
      badge: "Qo'shimcha",
      badgeColor: "bg-purple-600/20 text-purple-400 border-purple-600/30",
      rang: "hover:border-purple-400/50"
    },
    {
      href: "/oquv/klassifikatsiyasi/ligand/aralash",
      icon: "🎨",
      title: "Aralash ligandli",
      desc: "Bir necha turdagi ligandlar tutgan komplekslar.",
      badge: "Qo'shimcha",
      badgeColor: "bg-purple-600/20 text-purple-400 border-purple-600/30",
      rang: "hover:border-purple-400/50"
    },
    {
      href: "/oquv/klassifikatsiyasi/ligand/xelat",
      icon: "🦞",
      title: "Xelat komplekslar",
      desc: "Polidentat ligandlar. Yuqori barqarorlik.",
      badge: "Qo'shimcha",
      badgeColor: "bg-purple-600/20 text-purple-400 border-purple-600/30",
      rang: "hover:border-purple-400/50"
    },
    {
      href: "/oquv/klassifikatsiyasi/ligand/metallosen",
      icon: "🥪",
      title: "Metallosenlar",
      desc: "Sendvich birikmalar. Ferrosen — eng mashhuri.",
      badge: "Qo'shimcha",
      badgeColor: "bg-purple-600/20 text-purple-400 border-purple-600/30",
      rang: "hover:border-purple-400/50"
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/klassifikatsiyasi" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Orqaga
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-cyan-400">🧩 Ligandlar tabiatiga ko'ra</h1>
          <p className="text-purple-400 text-sm">Kompleks birikmalarning ligandlar bo'yicha tasnifi • 12 ta guruh</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12">
        
        {/* Kirish */}
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold text-white mb-4">📋 Ligandlar bo'yicha klassifikatsiya</h2>
          <p className="text-purple-200 leading-relaxed mb-4">
            Kompleks birikmalar ligandlarning tabiatiga ko'ra <strong className="text-yellow-400">12 ta guruhga</strong> bo'linadi.
            Bulardan 4 tasi asosiy, 8 tasi qo'shimcha guruhlardir.
          </p>
          <div className="flex gap-4 flex-wrap">
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs font-semibold">4 ta asosiy</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs font-semibold">8 ta qo'shimcha</span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {guruhlar.map((g, i) => (
            <Link 
              key={i}
              href={g.href}
              className={`group bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 hover:bg-purple-800/60 ${g.rang} transition-all transform hover:-translate-y-1`}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{g.icon}</div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {g.title}
                </h3>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${g.badgeColor} font-semibold`}>
                  {g.badge}
                </span>
              </div>
              <p className="text-purple-300 text-sm">{g.desc}</p>
            </Link>
          ))}
        </div>

        {/* Pastki ma'lumot */}
        <div className="mt-10 bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-6 text-center">
          <p className="text-purple-300 text-sm">
            📚 Manba: A.M. Nasimov, X.Sh. Tashpulatov — Noorganik kimyoning tanlangan boblari (5.2-bo'lim)
          </p>
        </div>

      </section>

    </main>
  )
}