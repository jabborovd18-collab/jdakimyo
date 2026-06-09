import Link from "next/link"

export default function KimyoviyBoglanish() {
  const bolimlar = [
    {
      href: "/oquv/kimyoviy-boglanish/vb-nazariyasi",
      icon: "🔗",
      title: "Valent bog'lanishlar nazariyasi",
      desc: "Gibridlanish turlari, donor-akseptor bog'lanish, sp, sp², sp³, dsp², d²sp³ gibridlanish. Kompleks birikmalarda VB nazariyasining qo'llanishi.",
      badge: "Asosiy",
      badgeColor: "bg-red-600/20 text-red-400 border-red-600/30",
      rang: "hover:border-red-400/50",
      rangText: "group-hover:text-red-400"
    },
    {
      href: "/oquv/kimyoviy-boglanish/kristall-maydon",
      icon: "💎",
      title: "Kristall maydon nazariyasi",
      desc: "d-orbital ajralishi, Δo va Δt energiyalari, spektrokimyoviy qator, KMBE hisoblash, yuqori va quyi spinli komplekslar.",
      badge: "Muhim",
      badgeColor: "bg-blue-600/20 text-blue-400 border-blue-600/30",
      rang: "hover:border-blue-400/50",
      rangText: "group-hover:text-blue-400"
    },
    {
      href: "/oquv/kimyoviy-boglanish/yan-teller",
      icon: "⚡",
      title: "Yan-Teller effekti",
      desc: "Oktaedrik buzilish mexanizmi, d⁴ va d⁹ konfiguratsiyalar, Cu²⁺ komplekslari misolida statik va dinamik Yan-Teller effekti.",
      badge: "Qiziqarli",
      badgeColor: "bg-purple-600/20 text-purple-400 border-purple-600/30",
      rang: "hover:border-purple-400/50",
      rangText: "group-hover:text-purple-400"
    },
    {
      href: "/oquv/kimyoviy-boglanish/ligand-maydon",
      icon: "🧩",
      title: "Ligand maydon nazariyasi",
      desc: "Molekulyar orbitallar nazariyasi, σ-donor va π-akseptor ligandlar, metall-ligand bog'lanishining MO tavsifi.",
      badge: "Chuqur",
      badgeColor: "bg-pink-600/20 text-pink-400 border-pink-600/30",
      rang: "hover:border-pink-400/50",
      rangText: "group-hover:text-pink-400"
    },
    {
      href: "/ilmiy",
      icon: "🔬",
      title: "Ilmiy tadqiqotlar va chuqur ma'lumotlar",
      desc: "Spektroskopiya (IQ, UB-Vis, YaMR), magnit xossalari, termodinamika va barqarorlik, kinetika, kvant kimyosi asoslari.",
      badge: "Kengaytirilgan",
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30",
      rang: "hover:border-green-400/50",
      rangText: "group-hover:text-green-400"
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← O'quv bo'limi</Link>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">🔗 Kimyoviy bog'lanish</h1>
          <p className="text-purple-400 text-sm">VB nazariyasi • Kristall maydon • Yan-Teller • Ligand maydon — kompleks birikmalarda bog'lanish nazariyalari</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12">
        
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold text-white mb-4">📋 Bu bo'limda nimalarni o'rganasiz?</h2>
          <p className="text-purple-200 leading-relaxed mb-4">
            <strong className="text-yellow-400">Kimyoviy bog'lanish nazariyalari</strong> — kompleks birikmalarning 
            tuzilishi, rang-barangligi, magnit xossalari va reaksion qobiliyatini tushunish uchun 
            <strong className="text-yellow-400"> eng fundamental asos</strong>. 
            Valent bog'lanishlar nazariyasidan tortib, zamonaviy ligand maydon nazariyasigacha —
            barcha asosiy yondashuvlar yoritilgan.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-3 bg-purple-800/20 rounded-xl p-3">
              <span className="text-red-400 mt-0.5">🔗</span>
              <div>
                <strong className="text-white">VB nazariyasi</strong>
                <p className="text-purple-300">Gibridlanish, donor-akseptor bog', kompleks geometriyasi</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-purple-800/20 rounded-xl p-3">
              <span className="text-blue-400 mt-0.5">💎</span>
              <div>
                <strong className="text-white">Kristall maydon nazariyasi</strong>
                <p className="text-purple-300">d-orbital ajralishi, Δo, KMBE, spin holatlari</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-purple-800/20 rounded-xl p-3">
              <span className="text-purple-400 mt-0.5">⚡</span>
              <div>
                <strong className="text-white">Yan-Teller effekti</strong>
                <p className="text-purple-300">Oktaedrik buzilish, d⁴/d⁹ konfiguratsiyalar</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-purple-800/20 rounded-xl p-3">
              <span className="text-pink-400 mt-0.5">🧩</span>
              <div>
                <strong className="text-white">Ligand maydon nazariyasi</strong>
                <p className="text-purple-300">MO yondashuvi, σ-donor/π-akseptor ligandlar</p>
              </div>
            </div>
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
                <h3 className={`text-base font-bold text-white ${b.rangText} transition-colors`}>
                  {b.title}
                </h3>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${b.badgeColor} font-semibold`}>
                  {b.badge}
                </span>
              </div>
              <p className="text-purple-300 text-sm leading-relaxed">{b.desc}</p>
            </Link>
          ))}
        </div>

        <div className="mt-10 bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-6 text-center">
          <p className="text-purple-300 text-sm">
            📚 Manba: A.M. Nasimov, X.Sh. Tashpulatov — Noorganik kimyoning tanlangan boblari (5.5-5.6 bo'limlar)
          </p>
        </div>

      </section>
    </main>
  )
}