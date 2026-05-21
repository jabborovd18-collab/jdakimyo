import Link from "next/link"

export default function Simmetriya() {
  const bolimlar = [
    {
      href: "/ilmiy/chuqurlashgan/simmetriya/elementlar",
      icon: "🪞",
      title: "Simmetriya elementlari va amallari",
      desc: "Aylanish o'qi (Cn), aks tekisligi (σ), inversiya markazi (i), aylanma-aks (Sn). Simmetriya amallari. Kompleks birikmalarda misollar bilan.",
      badge: "Asosiy",
      badgeColor: "bg-purple-600/20 text-purple-400 border-purple-600/30",
      rang: "hover:border-purple-400/50",
      rangText: "group-hover:text-purple-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/simmetriya/nuqtali-guruhlar",
      icon: "🏷️",
      title: "Nuqtali guruhlar",
      desc: "Schoenflies belgilari: Oh, Td, D4h, D3h, C4v, C2v. Guruhni aniqlash algoritmi. Kompleks birikmalar uchun eng muhim guruhlar jadvali.",
      badge: "Muhim",
      badgeColor: "bg-orange-600/20 text-orange-400 border-orange-600/30",
      rang: "hover:border-orange-400/50",
      rangText: "group-hover:text-orange-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/simmetriya/xarakterlar",
      icon: "📊",
      title: "Xarakterlar jadvali",
      desc: "Guruh nazariyasi asoslari. Xarakterlar jadvali tuzilishi. Mulliken belgilari (A, B, E, T). Qaytariluvchan va qaytarilmas tasvirlar. Oh va Td jadvallari.",
      badge: "Nazariya",
      badgeColor: "bg-blue-600/20 text-blue-400 border-blue-600/30",
      rang: "hover:border-blue-400/50",
      rangText: "group-hover:text-blue-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/simmetriya/tebranish",
      icon: "📈",
      title: "Simmetriya va tebranish spektrlari",
      desc: "3N-6 qoidasi. Normal koordinatalar. IQ va Raman faollikni simmetriya orqali aniqlash. Oktaedrik komplekslarda tebranish modlari. [Co(NH3)6]3+ misoli.",
      badge: "Spektr",
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30",
      rang: "hover:border-green-400/50",
      rangText: "group-hover:text-green-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/simmetriya/elektron",
      icon: "🔬",
      title: "Simmetriya va elektron tuzilish",
      desc: "Orbitallarning simmetriya bo'yicha klassifikatsiyasi. d-orbital ajralishi simmetriya asosida. Proyeksion operator. MO energiya diagrammalarini qurish.",
      badge: "Chuqur",
      badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
      rang: "hover:border-yellow-400/50",
      rangText: "group-hover:text-yellow-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/simmetriya/3d",
      icon: "🔮",
      title: "Simmetriya 3D vizualizatsiya",
      desc: "Interaktiv 3D modellar: Oh, Td, D4h, D3h geometriyalar. Simmetriya elementlarini vizual ko'rish. Aylanish o'qlari, aks tekisliklari animatsiyasi.",
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
          <h1 className="text-2xl font-bold text-red-400">⚛️ Molekulalar simmetriyasi</h1>
          <p className="text-purple-400 text-sm">Nuqtali guruhlar • Xarakterlar jadvali • Tebranish spektrlari • 3D vizualizatsiya</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12">
        
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold text-white mb-4">📋 Bu bo&apos;limda nimalarni o&apos;rganasiz?</h2>
          <p className="text-purple-200 leading-relaxed mb-4">
            <strong className="text-yellow-400">Molekulalar simmetriyasi</strong> — kompleks birikmalarning 
            tuzilishini tushunish, spektrlarini tahlil qilish va kimyoviy xossalarini bashorat qilish uchun 
            <strong className="text-yellow-400"> eng fundamental nazariy asosdir</strong>. 
            Bu bo&apos;limda siz simmetriya elementlaridan boshlab, 
            <strong className="text-yellow-400"> nuqtali guruhlar, xarakterlar jadvali, IQ/Raman faollik, 
            MO energiya diagrammalari</strong> va 
            <strong className="text-yellow-400"> 3D interaktiv modellar</strong>gacha bo&apos;lgan 
            barcha muhim mavzularni o&apos;zlashtirasiz. Simmetriya — kompleks kimyosining tili!
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">6 ta bo&apos;lim</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Oh, Td, D4h</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Xarakterlar jadvali</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">IQ/Raman</span>
            <span className="bg-pink-600/20 text-pink-400 border border-pink-600/30 px-3 py-1 rounded-full text-xs">3D modellar</span>
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

        <div className="mt-10 bg-gradient-to-r from-purple-900/40 to-red-900/40 border border-purple-700/50 rounded-2xl p-6 text-center">
          <p className="text-purple-300 text-sm">
            📚 Manba: F.A. Cotton — Chemical Applications of Group Theory | 
            Molekulalar tuzilishi va kimyoviy bog&apos;lanish
          </p>
        </div>

      </section>
    </main>
  )
}