"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

export default function KimyoviyBoglanish() {
  const router = useRouter()

  const bolimlar = [
    {
      icon: "🔗",
      title: "Valent bog'lanishlar nazariyasi",
      desc: "Gibridlanish, donor-akseptor bog', sp, sp³, dsp², d²sp³",
      badge: "⭐ Premium",
      badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
      rang: "hover:border-red-400/50",
      rangText: "group-hover:text-red-400",
      iconRang: "from-red-600 to-orange-600",
      href: "/oquv/kimyoviy-boglanish/vb-nazariyasi"
    },
    {
      icon: "💎",
      title: "Kristall maydon nazariyasi",
      desc: "d-orbital ajralishi, Δo, spektrokimyoviy qator, KMBE",
      badge: "⭐ Premium",
      badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
      rang: "hover:border-blue-400/50",
      rangText: "group-hover:text-blue-400",
      iconRang: "from-blue-600 to-cyan-600",
      href: "/oquv/kimyoviy-boglanish/kristall-maydon"
    },
    {
      icon: "⚡",
      title: "Yan-Teller effekti",
      desc: "Oktaedrik buzilish, d⁴ va d⁹ konfiguratsiyalar, Cu²⁺ misoli",
      badge: "⭐ Premium",
      badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
      rang: "hover:border-purple-400/50",
      rangText: "group-hover:text-purple-400",
      iconRang: "from-purple-600 to-indigo-600",
      href: "/oquv/kimyoviy-boglanish/yan-teller"
    },
    {
      icon: "🧩",
      title: "Ligand maydon nazariyasi",
      desc: "MO nazariyasi, π-bog'lar, σ-donor, π-akseptor ligandlar",
      badge: "⭐ Premium",
      badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
      rang: "hover:border-pink-400/50",
      rangText: "group-hover:text-pink-400",
      iconRang: "from-pink-600 to-rose-600",
      href: "/oquv/kimyoviy-boglanish/ligand-maydon"
    },
    {
      icon: "🔬",
      title: "Ilmiy tadqiqotlar va chuqur ma'lumotlar",
      desc: "Spektroskopiya, magnit xossalari, termodinamika, kvant kimyosi",
      badge: "",
      badgeColor: "",
      rang: "hover:border-green-400/50",
      rangText: "group-hover:text-green-400",
      iconRang: "from-green-600 to-emerald-600",
      href: "/ilmiy"
    }
  ]

  const handleClick = (b) => {
    router.push(b.href)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Orqaga</Link>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">🔗 Kimyoviy bog'lanish</h1>
          <p className="text-purple-400 text-sm">5.5-5.6 bo'limlar • Premium va ilmiy kontent</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12">
        
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold text-white mb-4">📋 Bu bo'limda nimalarni o'rganasiz?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-purple-200">
            <div className="flex items-start gap-3"><span className="text-yellow-400 mt-1">⭐</span><span>Valent bog'lanishlar nazariyasi (VB)</span></div>
            <div className="flex items-start gap-3"><span className="text-yellow-400 mt-1">⭐</span><span>Kristall maydon nazariyasi (KMN)</span></div>
            <div className="flex items-start gap-3"><span className="text-yellow-400 mt-1">⭐</span><span>Yan-Teller effekti va oktaedrik buzilish</span></div>
            <div className="flex items-start gap-3"><span className="text-yellow-400 mt-1">⭐</span><span>Ligand maydon nazariyasi (LMN)</span></div>
            <div className="flex items-start gap-3"><span className="text-green-400 mt-1">🔬</span><span>Ilmiy tadqiqotlar va chuqur ma'lumotlar</span></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {bolimlar.map((b, i) => (
            <div 
              key={i}
              onClick={() => handleClick(b)}
              className={`group bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 hover:bg-purple-800/60 ${b.rang} transition-all transform hover:-translate-y-2 hover:shadow-xl cursor-pointer`}
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${b.iconRang} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform mb-4`}>
                {b.icon}
              </div>
              <h3 className={`text-base font-bold text-white mb-2 ${b.rangText} transition-colors`}>
                {b.title}
              </h3>
              <p className="text-purple-300 text-sm mb-3">{b.desc}</p>
              {b.badge && (
                <span className={`inline-block text-xs px-2 py-0.5 rounded-full border ${b.badgeColor} font-semibold`}>
                  {b.badge}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 bg-gradient-to-r from-yellow-600/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3">👑</div>
          <h2 className="text-xl font-bold text-yellow-400 mb-2">Premium kontent</h2>
          <p className="text-purple-300 mb-4">
            Kimyoviy bog'lanish bo'limining asosiy qismi faqat obuna foydalanuvchilar uchun mavjud.
          </p>
          <p className="text-yellow-400 font-bold">Obuna narxi: 99 000 so'm / oy</p>
          <p className="text-purple-400 text-sm mt-2">Bog'lanish: @diyorbek_jabborov</p>
        </div>

        <div className="mt-6 bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-6 text-center">
          <p className="text-purple-300 text-sm">
            📚 Manba: A.M. Nasimov, X.Sh. Tashpulatov — Noorganik kimyoning tanlangan boblari (5.5-5.6 bo'limlar)
          </p>
        </div>

      </section>
    </main>
  )
}