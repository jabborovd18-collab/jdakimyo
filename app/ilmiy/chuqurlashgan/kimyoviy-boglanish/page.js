import Link from "next/link"

export default function KimyoviyBoglanish() {
  const bolimlar = [
    {
      href: "/ilmiy/chuqurlashgan/kimyoviy-boglanish/vb-nazariyasi",
      icon: "📐",
      title: "Valent bog'lanish (VB) nazariyasi",
      desc: "Gibridlanish: sp, sp², sp³, dsp², d²sp³, sp³d². Kompleks geometriyasini bashorat qilish.",
      badge: "Asosiy",
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30",
      rang: "hover:border-green-400/50",
      rangText: "group-hover:text-green-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/kimyoviy-boglanish/mo-nazariyasi",
      icon: "🔄",
      title: "Molekulyar orbitallar (MO) nazariyasi",
      desc: "Atom orbitallarining chiziqli kombinatsiyasi. σ va π bog'lovchi va bo'shashtiruvchi MO lar.",
      badge: "Muhim",
      badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
      rang: "hover:border-yellow-400/50",
      rangText: "group-hover:text-yellow-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/kimyoviy-boglanish/sigma-pi-ligandlar",
      icon: "⚡",
      title: "σ-donor va π-akseptor ligandlar",
      desc: "CO, CN⁻, PR₃ — kuchli maydonli ligandlar. Sinergik bog'lanish mexanizmi. π-orbitallar roli.",
      badge: "Chuqur",
      badgeColor: "bg-purple-600/20 text-purple-400 border-purple-600/30",
      rang: "hover:border-purple-400/50",
      rangText: "group-hover:text-purple-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/kimyoviy-boglanish/gibridlanish",
      icon: "💎",
      title: "Gibridlanish va geometriya",
      desc: "sp → chiziqli, sp³ → tetraedrik, dsp² → tekis kvadrat, d²sp³ → oktaedrik. Misollar bilan.",
      badge: "Jadval",
      badgeColor: "bg-blue-600/20 text-blue-400 border-blue-600/30",
      rang: "hover:border-blue-400/50",
      rangText: "group-hover:text-blue-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/kimyoviy-boglanish/mo-diagramma",
      icon: "📊",
      title: "MO diagrammasi — oktaedrik kompleks",
      desc: "6 ta ligand + metall orbitallari. Bog'lovchi, bo'shashtiruvchi, bog'lamaydigan MO lar. 3D model.",
      badge: "3D model",
      badgeColor: "bg-orange-600/20 text-orange-400 border-orange-600/30",
      rang: "hover:border-orange-400/50",
      rangText: "group-hover:text-orange-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/kimyoviy-boglanish/elektron-qoidasi",
      icon: "🧪",
      title: "18 elektron qoidasi",
      desc: "Metall karbonillari va metallosenlar barqarorligi. [Ni(CO)₄], [Fe(CO)₅], ferrosen misolida.",
      badge: "Qoida",
      badgeColor: "bg-red-600/20 text-red-400 border-red-600/30",
      rang: "hover:border-red-400/50",
      rangText: "group-hover:text-red-400"
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Chuqurlashgan mavzular</Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">🔗 Kimyoviy bog'lanish (VB + MO)</h1>
          <p className="text-purple-400 text-sm">Valent bog'lanish va molekulyar orbitallar nazariyalari • 6 ta bo'lim</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12">
        
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold text-white mb-4">📋 Bu bo'limda nimalarni o'rganasiz?</h2>
          <p className="text-purple-200 leading-relaxed mb-4">
            Kimyoviy bog'lanish nazariyalari — kompleks birikmalarning <strong className="text-yellow-400">tuzilishini tushunish</strong> uchun asos.
            VB nazariyasi gibridlanish va geometriyani, MO nazariyasi esa <strong className="text-yellow-400">elektron tuzilish va bog'lanish energiyasini</strong> tushuntiradi.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">6 ta bo'lim</span>
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs">3D model</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">III bob asosida</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Komplekslarga moslangan</span>
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
                <h3 className={`text-base font-bold text-white ${b.rangText} transition-colors`}>{b.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${b.badgeColor} font-semibold`}>{b.badge}</span>
              </div>
              <p className="text-purple-300 text-sm leading-relaxed">{b.desc}</p>
            </Link>
          ))}
        </div>

        <div className="mt-10 bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-6 text-center">
          <p className="text-purple-300 text-sm">
            📚 Manba: Molekulalar tuzilishi va kimyoviy bog'lanish — III bob. Kimyoviy bog'lanish
          </p>
        </div>

      </section>
    </main>
  )
}