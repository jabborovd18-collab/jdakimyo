import Link from "next/link"

export default function Izomeriya() {
  const qismlar = [
    {
      href: "/ilmiy/chuqurlashgan/izomeriya/geometrik",
      icon: "📐",
      title: "Geometrik izomeriya",
      desc: "sis/trans, fac/mer, N−M−N burchaklar, KMN energetikasi, dipol momentlari farqi, IQ va Raman orqali farqlash",
      badge: "Asosiy",
      badgeColor: "bg-blue-600/20 text-blue-400 border-blue-600/30"
    },
    {
      href: "/ilmiy/chuqurlashgan/izomeriya/optik",
      icon: "🔄",
      title: "Optik izomeriya (enantiomeriya)",
      desc: "Δ/Λ konfiguratsiyalar, xelat halqasi konformatsiyasi (δ/λ), CD va ORD spektroskopiyasi, absolyut konfiguratsiya",
      badge: "Muhim",
      badgeColor: "bg-purple-600/20 text-purple-400 border-purple-600/30"
    },
    {
      href: "/ilmiy/chuqurlashgan/izomeriya/ionlanish",
      icon: "⚡",
      title: "Ionlanish izomeriyasi",
      desc: "Tashqi va ichki sfera ionlari almashinuvi, konduktometrik farqlash, eritma rangiga ta'siri",
      badge: "Klassik",
      badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30"
    },
    {
      href: "/ilmiy/chuqurlashgan/izomeriya/boglanish",
      icon: "🔗",
      title: "Bog'lanish izomeriyasi",
      desc: "Ambidentat ligandlar (NO₂⁻/ONO⁻, SCN⁻/NCS⁻), donor atom tanlovi, HSAB nazariyasi asosida bashorat",
      badge: "HSAB",
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30"
    },
    {
      href: "/ilmiy/chuqurlashgan/izomeriya/koordinatsion",
      icon: "🔀",
      title: "Koordinatsion izomeriya",
      desc: "Ko'p metalli komplekslarda ligandlar qayta taqsimlanishi, [Pt(NH₃)₄][CuCl₄] vs [Cu(NH₃)₄][PtCl₄]",
      badge: "Ko'p metalli",
      badgeColor: "bg-orange-600/20 text-orange-400 border-orange-600/30"
    },
    {
      href: "/ilmiy/chuqurlashgan/izomeriya/gidrat",
      icon: "💧",
      title: "Gidrat (solvat) izomeriyasi",
      desc: "Kristallanish suvi tashqi vs ichki sferada, CrCl₃·6H₂O klassik misoli, termogravimetrik farqlash",
      badge: "Suv",
      badgeColor: "bg-cyan-600/20 text-cyan-400 border-cyan-600/30"
    },
    {
      href: "/ilmiy/chuqurlashgan/izomeriya/konformatsion",
      icon: "🪑",
      title: "Konformatsion izomeriya",
      desc: "Xelat halqalari konformatsiyasi (δ/λ), 5 a'zoli vs 6 a'zoli xelatlar, energetik barqarorlik",
      badge: "Xelat",
      badgeColor: "bg-pink-600/20 text-pink-400 border-pink-600/30"
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan" className="text-purple-400 hover:text-purple-300 text-lg">← Chuqurlashgan mavzular</Link>
        <div>
          <h1 className="text-2xl font-bold text-rose-400">🔄 Komplekslar izomeriyasi</h1>
          <p className="text-purple-400 text-sm">Geometrik • Optik • Ionlanish • Bog'lanish • Koordinatsion • Gidrat • Konformatsion</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12">
        
        {/* Asosiy ma'lumot */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold text-white mb-4">📋 Izomeriya haqida</h2>
          <p className="text-purple-200 leading-relaxed mb-4">
            <strong className="text-rose-400">Izomeriya</strong> — bir xil molekulyar formulaga ega, lekin 
            <strong className="text-rose-400"> turli tuzilish yoki fazoviy joylashuvga</strong> ega bo'lgan 
            birikmalarning mavjudligi. Kompleks birikmalarda izomeriya ayniqsa boy va xilma-xil — 
            bu Verner nazariyasining to'g'riligini isbotlagan asosiy dalillardan biri.
            Izomerlar <strong>fizik, kimyoviy va biologik xossalariga ko'ra</strong> farq qiladi — 
            masalan, sisplatin (saraton dorisi) faol, trans-izomeri esa nofaol.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="bg-rose-600/20 text-rose-400 border border-rose-600/30 px-3 py-1 rounded-full text-xs">7 ta izomeriya turi</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Verner isboti</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">KMN asosida</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">Spektroskopik farqlash</span>
          </div>
        </div>

        {/* Izomeriya turlari jadvali */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold text-white mb-6">📊 Izomeriya turlari — klassifikatsiya</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Izomeriya turi</th>
                <th className="py-3 px-4 text-purple-300">Farq qiladigan jihati</th>
                <th className="py-3 px-4 text-purple-300">Aniqlash usuli</th>
                <th className="py-3 px-4 text-purple-300">Klassik misol</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Struktura (tuzilish) izomeriyasi", "", "", ""],
                  ["• Ionlanish", "Tashqi/ichki sfera ionlari", "Konduktometriya, AgNO₃ test", "[Co(NH₃)₅Br]SO₄ vs [Co(NH₃)₅SO₄]Br"],
                  ["• Gidrat", "H₂O tashqi/ichki sferada", "TGA, element analiz", "CrCl₃·6H₂O (3 ta izomer)"],
                  ["• Bog'lanish", "Donor atom (ambidentat)", "IQ (ν NO₂ vs ν ONO)", "[Co(NH₃)₅NO₂]²⁺ vs [Co(NH₃)₅ONO]²⁺"],
                  ["• Koordinatsion", "Ligandlar taqsimoti", "Element analiz, UV-Vis", "[Pt(NH₃)₄][CuCl₄] vs [Cu(NH₃)₄][PtCl₄]"],
                  ["Fazoviy (stereo) izomeriya", "", "", ""],
                  ["• Geometrik", "Ligandlar fazoviy joylashuvi", "IQ, Raman, rentgen", "sis/trans-[PtCl₂(NH₃)₂]"],
                  ["• Optik", "Yorug'lik qutblanish tekisligi", "CD, ORD, rentgen", "Δ/Λ-[Co(en)₃]³⁺"],
                  ["• Konformatsion", "Xelat halqasi shakli", "CD, NMR, rentgen", "δ/λ-[Co(en)₃]³⁺"],
                ].map((r, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 ${r[0].startsWith("•") ? "" : "bg-purple-800/20 font-semibold"}`}>
                    <td className={`py-3 px-4 ${r[0].startsWith("•") ? "text-rose-400 pl-8 text-xs" : "text-yellow-400 text-sm"}`}>{r[0]}</td>
                    <td className="py-3 px-4 text-xs">{r[1]}</td>
                    <td className="py-3 px-4 text-xs">{r[2]}</td>
                    <td className="py-3 px-4 font-mono text-xs">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Qismlar ro'yxati */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {qismlar.map((q, i) => (
            <Link 
              key={i}
              href={q.href}
              className="group bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 hover:bg-purple-800/60 hover:border-rose-400/50 transition-all transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl group-hover:scale-110 transition-transform">{q.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-rose-300 transition-colors">{q.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${q.badgeColor} font-semibold`}>{q.badge}</span>
                  </div>
                  <p className="text-purple-300 text-sm leading-relaxed">{q.desc}</p>
                </div>
                <div className="text-rose-400 text-2xl group-hover:translate-x-1 transition-transform">→</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 bg-gradient-to-r from-rose-600/10 to-purple-600/10 border border-rose-500/20 rounded-2xl p-6 text-center">
          <p className="text-purple-300 text-sm">
            🔄 Izomeriya — <strong className="text-rose-400">Verner nazariyasining eng kuchli isboti</strong>. 
            Kompleks birikmalarning tuzilishi va xossalarini tushunish uchun fundamental mavzu.
          </p>
        </div>

      </section>
    </main>
  )
}