import Link from "next/link"

export default function Ilmiy() {
  const bolimlar = [
    {
      href: "/ilmiy/chuqurlashgan",
      icon: "🔬",
      title: "Chuqurlashgan mavzular",
      desc: "Kristall maydon nazariyasi, MO diagrammalari, termodinamik hisob-kitoblar, magnit xossalari",
      badge: "Ilmiy",
      badgeColor: "bg-purple-600/20 text-purple-400 border-purple-600/30",
      rang: "hover:border-purple-400/50",
      rangText: "group-hover:text-purple-400"
    },
    {
      href: "/ilmiy/maqolalar",
      icon: "📝",
      title: "Maqolalar",
      desc: "Yangi chiqqan maqolalar • Maqolalar bazasi • O'z maqolangizni joylashtirish",
      badge: "Yangi",
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30",
      rang: "hover:border-green-400/50",
      rangText: "group-hover:text-green-400"
    },
    {
      href: "/ilmiy/birikmalar",
      icon: "🧪",
      title: "Sizga kerakli kompleks birikmalar",
      desc: "Qidiruv tizimi • 50+ kompleks birikma • Barcha xossalari to'liq yoritilgan",
      badge: "50+ modda",
      badgeColor: "bg-blue-600/20 text-blue-400 border-blue-600/30",
      rang: "hover:border-blue-400/50",
      rangText: "group-hover:text-blue-400"
    },
    {
      href: "/ilmiy/tahlil",
      icon: "📊",
      title: "Tahlil usullari",
      desc: "IQ spektroskopiya • UB-Vis • NMR • Rentgen difraksiyasi • Kompleks birikmalarda qo'llanishi",
      badge: "8 ta usul",
      badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
      rang: "hover:border-yellow-400/50",
      rangText: "group-hover:text-yellow-400"
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Bosh sahifa</Link>
        <div>
          <h1 className="text-2xl font-bold text-green-400">🔬 Ilmiy bo'lim</h1>
          <p className="text-purple-400 text-sm">Chuqurlashgan bilimlar • Maqolalar • Moddalar bazasi • Tahlil usullari</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12">
        
        {/* Kirish */}
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold text-white mb-4">📋 Ilmiy bo'lim haqida</h2>
          <p className="text-purple-200 leading-relaxed">
            Bu bo'lim <strong className="text-yellow-400">ilmiy tadqiqotchilar, magistrantlar va doktorantlar</strong> uchun mo'ljallangan.
            Kompleks birikmalar bo'yicha chuqurlashgan ma'lumotlar, ilmiy maqolalar, moddalarning to'liq xossalari
            va zamonaviy tahlil usullari haqida batafsil ma'lumot olasiz.
          </p>
        </div>

        {/* 4 ta iconka */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bolimlar.map((b, i) => (
            <Link 
              key={i}
              href={b.href}
              className={`group bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 hover:bg-purple-800/60 ${b.rang} transition-all transform hover:-translate-y-2 hover:shadow-xl`}
            >
              <div className="flex items-start gap-5">
                <div className="text-5xl group-hover:scale-110 transition-transform flex-shrink-0">
                  {b.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className={`text-xl font-bold text-white ${b.rangText} transition-colors`}>
                      {b.title}
                    </h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${b.badgeColor} font-semibold`}>
                      {b.badge}
                    </span>
                  </div>
                  <p className="text-purple-300 text-sm leading-relaxed">{b.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Statistika */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 text-center">
            <div className="text-3xl font-extrabold text-green-400">50+</div>
            <div className="text-purple-300 text-sm">Kompleks birikmalar</div>
          </div>
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 text-center">
            <div className="text-3xl font-extrabold text-blue-400">20</div>
            <div className="text-purple-300 text-sm">Tahlil usullari</div>
          </div>
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 text-center">
            <div className="text-3xl font-extrabold text-purple-400">∞</div>
            <div className="text-purple-300 text-sm">Maqolalar bazasi</div>
          </div>
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 text-center">
            <div className="text-3xl font-extrabold text-yellow-400">🔍</div>
            <div className="text-purple-300 text-sm">Qidiruv tizimi</div>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-6 text-center">
          <p className="text-purple-300 text-sm">
            🔬 Ilmiy bo'lim doimiy ravishda yangilanib boriladi • Yangi ma'lumotlar kiritiladi
          </p>
        </div>

      </section>
    </main>
  )
}