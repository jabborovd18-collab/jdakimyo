import Link from "next/link"

export default function Termodinamika() {
  const bolimlar = [
    {
      href: "/ilmiy/chuqurlashgan/termodinamika/barqarorlik-konstantasi",
      icon: "⚖️",
      title: "Barqarorlik konstantasi",
      desc: "Kstab ta'rifi va turlari. Bosqichli (K1, K2...) va umumiy (βn) konstantalar. Barqarorlik konstantalarini o'lchash usullari: potensiometriya, spektrofotometriya.",
      badge: "Asosiy",
      badgeColor: "bg-purple-600/20 text-purple-400 border-purple-600/30",
      rang: "hover:border-purple-400/50",
      rangText: "group-hover:text-purple-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/termodinamika/parametrlar",
      icon: "📐",
      title: "Termodinamik parametrlar: ΔH, ΔG, ΔS",
      desc: "ΔG = −RT ln Kstab. Gibbs energiyasi, entalpiya va entropiya. Kompleks hosil bo'lish energetikasi. Kalorimetrik o'lchashlar va Van't-Goff tenglamasi.",
      badge: "Hisoblash",
      badgeColor: "bg-blue-600/20 text-blue-400 border-blue-600/30",
      rang: "hover:border-blue-400/50",
      rangText: "group-hover:text-blue-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/termodinamika/irving-uilyams",
      icon: "📊",
      title: "Irving-Uilyams qatori",
      desc: "d¹−d¹⁰ barqarorlik tartibi: Mn²⁺ < Fe²⁺ < Co²⁺ < Ni²⁺ < Cu²⁺ > Zn²⁺. KMN asosida tushuntirish. Ion radiusi va KS ta'siri. Misollar jadvali.",
      badge: "Muhim",
      badgeColor: "bg-orange-600/20 text-orange-400 border-orange-600/30",
      rang: "hover:border-orange-400/50",
      rangText: "group-hover:text-orange-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/termodinamika/xelat-effekti",
      icon: "🔗",
      title: "Xelat effekti",
      desc: "Xelat komplekslarning anomal yuqori barqarorligi. Entropik omil (desolvatatsiya). Xelat halqasi kattaligi (5>6>4). EDTA, en, polidentat ligandlar. Makrotsiklik effekt.",
      badge: "Chuqur",
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30",
      rang: "hover:border-green-400/50",
      rangText: "group-hover:text-green-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/termodinamika/omillar",
      icon: "🔬",
      title: "Barqarorlikka ta'sir qiluvchi omillar",
      desc: "Metall ioni: zaryad (z/r), radius, elektron konfiguratsiya. Ligand: asoslik, sterik to'siq, xelat effekti. Erituvchi, pH, ion kuchi. Termodinamik va kinetik barqarorlik farqi.",
      badge: "Tahlil",
      badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
      rang: "hover:border-yellow-400/50",
      rangText: "group-hover:text-yellow-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/termodinamika/bashorat",
      icon: "🧮",
      title: "Barqarorlikni bashorat qilish (HSAB)",
      desc: "Pearsonning HSAB nazariyasi. Qattiq va yumshoq kislota/asoslar. Kompleks barqarorligini oldindan aytish. Klassifikatsiya jadvali va amaliy bashorat misollari.",
      badge: "Nazariya",
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
          <h1 className="text-2xl font-bold text-teal-400">🌡️ Termodinamika va barqarorlik</h1>
          <p className="text-purple-400 text-sm">K<sub>stab</sub> • ΔG, ΔH, ΔS • Irving-Uilyams • Xelat effekti • HSAB nazariyasi</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12">
        
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold text-white mb-4">📋 Bu bo&apos;limda nimalarni o&apos;rganasiz?</h2>
          <p className="text-purple-200 leading-relaxed mb-4">
            <strong className="text-yellow-400">Termodinamika va barqarorlik</strong> — kompleks birikmalarning 
            hosil bo&apos;lish qonuniyatlarini tushunish uchun asosiy bo&apos;lim. Siz 
            <strong className="text-yellow-400"> barqarorlik konstantasi (K<sub>stab</sub>)</strong> tushunchasidan 
            boshlab, <strong className="text-yellow-400">Irving-Uilyams qatori, xelat effekti, HSAB nazariyasi</strong> 
            va <strong className="text-yellow-400">kompleks barqarorligini bashorat qilish</strong>gacha 
            bo&apos;lgan barcha fundamental mavzularni o&apos;rganasiz.
            Termodinamik barqarorlik — kompleksning amaliy qo&apos;llanish imkoniyatlarini belgilaydi.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="bg-teal-600/20 text-teal-400 border border-teal-600/30 px-3 py-1 rounded-full text-xs">6 ta bo&apos;lim</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Kstab</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">ΔG, ΔH, ΔS</span>
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs">Irving-Uilyams</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">Xelat effekti</span>
            <span className="bg-pink-600/20 text-pink-400 border border-pink-600/30 px-3 py-1 rounded-full text-xs">HSAB</span>
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

        <div className="mt-10 bg-gradient-to-r from-purple-900/40 to-teal-900/40 border border-purple-700/50 rounded-2xl p-6 text-center">
          <p className="text-purple-300 text-sm">
            📚 Manba: A.M. Nasimov, X.Sh. Tashpulatov — Noorganik kimyoning tanlangan boblari |
            F. Basolo, R. Pearson — Mechanisms of Inorganic Reactions
          </p>
        </div>

      </section>
    </main>
  )
}