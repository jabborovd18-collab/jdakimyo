import Link from "next/link"

export default function FazoviyTuzilishi() {
  const shakllar = [
    {
      href: "/oquv/fazoviy/cpk-ranglar",
      icon: "🎨",
      title: "CPK ranglar jadvali",
      desc: "Atomlarning xalqaro standart ranglari",
      badge: "Asosiy",
      badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
      rang: "hover:border-yellow-400/50",
      rangText: "group-hover:text-yellow-400"
    },
    {
      href: "/oquv/fazoviy/chiziqli",
      icon: "📏",
      title: "Chiziqli",
      desc: "KS=2 • sp gibridlanish • 180°",
      badge: "KS=2",
      badgeColor: "bg-blue-600/20 text-blue-400 border-blue-600/30",
      rang: "hover:border-blue-400/50",
      rangText: "group-hover:text-blue-400"
    },
    {
      href: "/oquv/fazoviy/uchburchak",
      icon: "📐",
      title: "Uchburchak",
      desc: "KS=3 • sp² gibridlanish • 120°",
      badge: "KS=3",
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30",
      rang: "hover:border-green-400/50",
      rangText: "group-hover:text-green-400"
    },
    {
      href: "/oquv/fazoviy/tetraedrik",
      icon: "🔺",
      title: "Tetraedrik",
      desc: "KS=4 • sp³ gibridlanish • 109.5°",
      badge: "KS=4",
      badgeColor: "bg-cyan-600/20 text-cyan-400 border-cyan-600/30",
      rang: "hover:border-cyan-400/50",
      rangText: "group-hover:text-cyan-400"
    },
    {
      href: "/oquv/fazoviy/tekis-kvadrat",
      icon: "◻️",
      title: "Tekis kvadrat",
      desc: "KS=4 • sp²d gibridlanish • 90°",
      badge: "KS=4",
      badgeColor: "bg-pink-600/20 text-pink-400 border-pink-600/30",
      rang: "hover:border-pink-400/50",
      rangText: "group-hover:text-pink-400"
    },
    {
      href: "/oquv/fazoviy/trigonal-bipiramida",
      icon: "🔷",
      title: "Trigonal bipiramida",
      desc: "KS=5 • sp³d gibridlanish • 90°/120°",
      badge: "KS=5",
      badgeColor: "bg-orange-600/20 text-orange-400 border-orange-600/30",
      rang: "hover:border-orange-400/50",
      rangText: "group-hover:text-orange-400"
    },
    {
      href: "/oquv/fazoviy/kvadrat-piramida",
      icon: "🏛️",
      title: "Kvadrat piramida",
      desc: "KS=5 • sp³d gibridlanish • ~90°",
      badge: "KS=5",
      badgeColor: "bg-red-600/20 text-red-400 border-red-600/30",
      rang: "hover:border-red-400/50",
      rangText: "group-hover:text-red-400"
    },
    {
      href: "/oquv/fazoviy/oktaedrik",
      icon: "💎",
      title: "Oktaedrik",
      desc: "KS=6 • sp³d² gibridlanish • 90°",
      badge: "KS=6",
      badgeColor: "bg-purple-600/20 text-purple-400 border-purple-600/30",
      rang: "hover:border-purple-400/50",
      rangText: "group-hover:text-purple-400"
    },
    {
      href: "/oquv/fazoviy/trigonal-prizma",
      icon: "🔶",
      title: "Trigonal prizma",
      desc: "KS=6 • sd⁵ gibridlanish",
      badge: "KS=6",
      badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
      rang: "hover:border-yellow-400/50",
      rangText: "group-hover:text-yellow-400"
    },
    {
      href: "/oquv/fazoviy/pentagonal-bipiramida",
      icon: "⬠",
      title: "Pentagonal bipiramida",
      desc: "KS=7 • sp³d³ gibridlanish",
      badge: "KS=7",
      badgeColor: "bg-blue-600/20 text-blue-400 border-blue-600/30",
      rang: "hover:border-blue-400/50",
      rangText: "group-hover:text-blue-400"
    },
    {
      href: "/oquv/fazoviy/monoyopiq-prizma",
      icon: "🏠",
      title: "Monoyopiq trigonal prizma",
      desc: "KS=7 • sp³d³ gibridlanish",
      badge: "KS=7",
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30",
      rang: "hover:border-green-400/50",
      rangText: "group-hover:text-green-400"
    },
    {
      href: "/oquv/fazoviy/kubsimon",
      icon: "🧊",
      title: "Kubsimon",
      desc: "KS=8 • sp³d³f gibridlanish",
      badge: "KS=8",
      badgeColor: "bg-cyan-600/20 text-cyan-400 border-cyan-600/30",
      rang: "hover:border-cyan-400/50",
      rangText: "group-hover:text-cyan-400"
    },
    {
      href: "/oquv/fazoviy/dodekaedrik",
      icon: "⬡",
      title: "Dodekaedrik",
      desc: "KS=8 • sp³d⁴ gibridlanish",
      badge: "KS=8",
      badgeColor: "bg-pink-600/20 text-pink-400 border-pink-600/30",
      rang: "hover:border-pink-400/50",
      rangText: "group-hover:text-pink-400"
    },
    {
      href: "/oquv/fazoviy/kvadrat-antiprizma",
      icon: "🟦",
      title: "Kvadrat antiprizma",
      desc: "KS=8 • sp³d⁴ gibridlanish",
      badge: "KS=8",
      badgeColor: "bg-purple-600/20 text-purple-400 border-purple-600/30",
      rang: "hover:border-purple-400/50",
      rangText: "group-hover:text-purple-400"
    },
    {
      href: "/oquv/fazoviy/uch-yoqli-prizma",
      icon: "📐",
      title: "Uch yoqli trigonal prizma",
      desc: "KS=9 • sp³d⁵ gibridlanish",
      badge: "KS=9",
      badgeColor: "bg-orange-600/20 text-orange-400 border-orange-600/30",
      rang: "hover:border-orange-400/50",
      rangText: "group-hover:text-orange-400"
    },
    {
      href: "/oquv/fazoviy/ikki-yoqli-antiprizma",
      icon: "🔷",
      title: "Ikki yoqli kvadrat antiprizma",
      desc: "KS=10",
      badge: "KS=10",
      badgeColor: "bg-red-600/20 text-red-400 border-red-600/30",
      rang: "hover:border-red-400/50",
      rangText: "group-hover:text-red-400"
    },
    {
      href: "/oquv/fazoviy/ikosaedrik",
      icon: "🟡",
      title: "Ikosaedrik",
      desc: "KS=12 • 20 ta uchburchak yuz",
      badge: "KS=12",
      badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
      rang: "hover:border-yellow-400/50",
      rangText: "group-hover:text-yellow-400"
    },
    {
      href: "/oquv/fazoviy/sendvich",
      icon: "🥪",
      title: "Sendvich (Ferrosen)",
      desc: "KS=10 • [Fe(C₅H₅)₂] • Metallosen",
      badge: "KS=10",
      badgeColor: "bg-purple-600/20 text-purple-400 border-purple-600/30",
      rang: "hover:border-purple-400/50",
      rangText: "group-hover:text-purple-400"
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Orqaga
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">💎 Fazoviy tuzilishi</h1>
          <p className="text-purple-400 text-sm">Koordinatsion son va gibridlanish asosida • 5.5-jadval • 16 ta geometrik shakl + CPK + Sendvich</p>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Kirish */}
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold text-white mb-4">📋 Bu bo'limda nimalarni o'rganasiz?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-purple-200">
            <div className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✅</span>
              <span>16 ta geometrik shakl</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✅</span>
              <span>CPK xalqaro ranglar standarti</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✅</span>
              <span>Gibridlanish va valent burchaklar</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✅</span>
              <span>Har bir shakl uchun misollar</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✅</span>
              <span>KS=2 dan KS=12 gacha</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✅</span>
              <span>Sendvich birikmalar</span>
            </div>
          </div>
        </div>

        {/* 18 ta iconka */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {shakllar.map((s, i) => (
            <Link 
              key={i}
              href={s.href}
              className={`group bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 hover:bg-purple-800/60 ${s.rang} transition-all transform hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-900/30`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-4xl group-hover:scale-110 transition-transform">{s.icon}</span>
                <span className="bg-purple-600/30 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full text-xs font-bold group-hover:bg-purple-500/50 group-hover:text-white transition-all">
                  3D
                </span>
              </div>
              <h3 className={`text-base font-bold text-white mb-2 ${s.rangText} transition-colors`}>
                {s.title}
              </h3>
              <p className="text-purple-300 text-sm mb-3">{s.desc}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${s.badgeColor} font-semibold`}>
                {s.badge}
              </span>
            </Link>
          ))}
        </div>

        {/* Pastki ma'lumot */}
        <div className="mt-10 bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-6 text-center">
          <p className="text-purple-300 text-sm">
            📚 Manba: A.M. Nasimov, X.Sh. Tashpulatov — Noorganik kimyoning tanlangan boblari (5.3, 5.5-bo'limlar)
          </p>
        </div>

      </section>

    </main>
  )
}