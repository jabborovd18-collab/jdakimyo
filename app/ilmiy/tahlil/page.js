import Link from "next/link"

export default function TahlilUsullari() {
  const usullar = [
    {
      href: "/ilmiy/tahlil/ub-vis",
      icon: "🌈",
      title: "UB-Vis spektroskopiya",
      desc: "Ultrabinafsha va ko'rinadigan soha spektroskopiyasi. d-d o'tishlar, zaryad ko'chishi, rang va Δo aniqlash.",
      badge: "Eng ko'p qo'llaniladi",
      badgeColor: "bg-purple-600/20 text-purple-400 border-purple-600/30",
      rang: "hover:border-purple-400/50",
      rangText: "group-hover:text-purple-400"
    },
    {
      href: "/ilmiy/tahlil/iq",
      icon: "📊",
      title: "IQ spektroskopiya",
      desc: "Infraqizil spektroskopiya. Tebranish chastotalari, ligand-metall bog'lanishi, ambidentat ligandlarni farqlash.",
      badge: "Molekulyar barmoq izi",
      badgeColor: "bg-blue-600/20 text-blue-400 border-blue-600/30",
      rang: "hover:border-blue-400/50",
      rangText: "group-hover:text-blue-400"
    },
    {
      href: "/ilmiy/tahlil/nmr",
      icon: "🧲",
      title: "YaMR spektroskopiya",
      desc: "Yadro magnit rezonansi. Kimyoviy siljish, kompleks tuzilishini aniqlash, ligand almashinish kinetikasi.",
      badge: "Tuzilish aniqlash",
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30",
      rang: "hover:border-green-400/50",
      rangText: "group-hover:text-green-400"
    },
    {
      href: "/ilmiy/tahlil/rentgen",
      icon: "💎",
      title: "Rentgen difraksiyasi",
      desc: "Kristall tuzilishini aniqlash. Panjara parametrlari, bog' uzunliklari, burchaklar, fazoviy guruhlar.",
      badge: "Aniq struktura",
      badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
      rang: "hover:border-yellow-400/50",
      rangText: "group-hover:text-yellow-400"
    },
    {
      href: "/ilmiy/tahlil/mass",
      icon: "⚖️",
      title: "Mass-spektrometriya",
      desc: "Molekulyar massa, fragmentlanish, izotop taqsimoti, kompleks tarkibini tasdiqlash.",
      badge: "Molekulyar massa",
      badgeColor: "bg-pink-600/20 text-pink-400 border-pink-600/30",
      rang: "hover:border-pink-400/50",
      rangText: "group-hover:text-pink-400"
    },
    {
      href: "/ilmiy/tahlil/magnit",
      icon: "🧲",
      title: "Magnit o'lchashlar",
      desc: "Magnit qabulqiluvchanlik, μeff hisoblash, yuqori/quyi spin aniqlash, Gui usuli.",
      badge: "Spin holati",
      badgeColor: "bg-orange-600/20 text-orange-400 border-orange-600/30",
      rang: "hover:border-orange-400/50",
      rangText: "group-hover:text-orange-400"
    },
    {
      href: "/ilmiy/tahlil/elektrokimyo",
      icon: "⚡",
      title: "Elektrokimyoviy tahlil",
      desc: "Siklik voltamperometriya, oksidlanish-qaytarilish potensiallari, kompleks barqarorligi.",
      badge: "Redoks xossalari",
      badgeColor: "bg-cyan-600/20 text-cyan-400 border-cyan-600/30",
      rang: "hover:border-cyan-400/50",
      rangText: "group-hover:text-cyan-400"
    },
    {
      href: "/ilmiy/tahlil/termik",
      icon: "🔥",
      title: "Termik tahlil",
      desc: "TGA, DTA, DSC usullari. Termik barqarorlik, suv molekulalarining joylashuvi, parchalanish harorati.",
      badge: "Harorat ta'siri",
      badgeColor: "bg-red-600/20 text-red-400 border-red-600/30",
      rang: "hover:border-red-400/50",
      rangText: "group-hover:text-red-400"
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Ilmiy bo'lim</Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">📊 Tahlil usullari</h1>
          <p className="text-purple-400 text-sm">Kompleks birikmalarni tahlil qilishning zamonaviy fizik-kimyoviy usullari</p>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Kirish */}
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold text-white mb-4">📋 Tahlil usullari haqida</h2>
          <p className="text-purple-200 leading-relaxed mb-4">
            Kompleks birikmalarning tuzilishi, tarkibi va xossalarini aniqlash uchun 
            <strong className="text-yellow-400"> zamonaviy fizik-kimyoviy tahlil usullari</strong> qo'llaniladi.
            Har bir usul kompleksning ma'lum bir xususiyatini aniqlashga xizmat qiladi.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className="bg-purple-800/30 rounded-xl p-3">
              <div className="text-2xl font-extrabold text-yellow-400">8</div>
              <div className="text-purple-400 text-xs">tahlil usuli</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-3">
              <div className="text-2xl font-extrabold text-yellow-400">🧪</div>
              <div className="text-purple-400 text-xs">faqat komplekslar</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-3">
              <div className="text-2xl font-extrabold text-yellow-400">🔬</div>
              <div className="text-purple-400 text-xs">ilmiy asoslangan</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-3">
              <div className="text-2xl font-extrabold text-yellow-400">📖</div>
              <div className="text-purple-400 text-xs">misollar bilan</div>
            </div>
          </div>
        </div>

        {/* 8 ta usul */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {usullar.map((u, i) => (
            <Link 
              key={i}
              href={u.href}
              className={`group bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 hover:bg-purple-800/60 ${u.rang} transition-all transform hover:-translate-y-2 hover:shadow-xl`}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{u.icon}</div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className={`text-lg font-bold text-white ${u.rangText} transition-colors`}>
                  {u.title}
                </h3>
              </div>
              <p className="text-purple-300 text-sm mb-4 leading-relaxed">{u.desc}</p>
              <span className={`inline-block text-xs px-2 py-0.5 rounded-full border ${u.badgeColor} font-semibold`}>
                {u.badge}
              </span>
            </Link>
          ))}
        </div>

        {/* Qo'llanish sxemasi */}
        <div className="mt-10 bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔍 Qaysi usul nimani aniqlaydi?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {[
              ["🌈 UB-Vis", "Rang, d-d o'tishlar, Δo qiymati, geometriya"],
              ["📊 IQ", "Ligand-metall bog'lanishi, ambidentat ligandlar"],
              ["🧲 NMR", "Tuzilish, ligand almashinish, eritma dinamikasi"],
              ["💎 Rentgen", "Kristall panjarasi, bog' uzunliklari, burchaklar"],
              ["⚖️ Mass", "Molekulyar massa, tarkib, izotoplar"],
              ["🧲 Magnit", "Spin holati, toq elektronlar soni, μeff"],
              ["⚡ Elektrokimyo", "Oksidlanish-qaytarilish, barqarorlik"],
              ["🔥 Termik", "Termik barqarorlik, gidrat suvlar, parchalanish"]
            ].map((r, i) => (
              <div key={i} className="flex items-center gap-3 bg-purple-800/20 rounded-xl p-3">
                <span className="text-yellow-400 font-bold min-w-[90px]">{r[0]}</span>
                <span className="text-purple-300">→ {r[1]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 bg-gradient-to-r from-yellow-600/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl p-6 text-center">
          <p className="text-purple-300 text-sm">
            🔬 Har bir tahlil usuli bo'yicha batafsil ma'lumot, kompleks birikmalardagi qo'llanishi va amaliy misollar keltirilgan
          </p>
        </div>

      </section>
    </main>
  )
}