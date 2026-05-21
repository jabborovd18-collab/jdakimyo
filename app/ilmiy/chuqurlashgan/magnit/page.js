import Link from "next/link"

export default function Magnit() {
  const bolimlar = [
    {
      href: "/ilmiy/chuqurlashgan/magnit/magnit-moment",
      icon: "📐",
      title: "Magnit moment nazariyasi",
      desc: "Magnit moment tushunchasi. Spin va orbital hissalar. μ = √n(n+2) formulasi. Kompleks birikmalarda μeff hisoblash. d¹-d⁹ konfiguratsiyalar uchun nazariy qiymatlar.",
      badge: "Nazariya",
      badgeColor: "bg-purple-600/20 text-purple-400 border-purple-600/30",
      rang: "hover:border-purple-400/50",
      rangText: "group-hover:text-purple-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/magnit/sezgirlik",
      icon: "⚖️",
      title: "Magnit sezgirlik va Gui usuli",
      desc: "Magnit sezgirlik (χ). Gui va Faraday usullari bilan o'lchash. Kyuri va Kyuri-Veys qonunlari. Komplekslarning χM va θ konstantalarini aniqlash.",
      badge: "Eksperiment",
      badgeColor: "bg-blue-600/20 text-blue-400 border-blue-600/30",
      rang: "hover:border-blue-400/50",
      rangText: "group-hover:text-blue-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/magnit/spin-orbit",
      icon: "🔗",
      title: "Spin-orbit bog'lanish",
      desc: "Spin-orbit bog'lanish nazariyasi komplekslarda. ζ konstantasi 3d, 4d, 5d metallar uchun. λ va Δo raqobati. Orbital hissa qo'shilish shartlari.",
      badge: "Chuqur",
      badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
      rang: "hover:border-yellow-400/50",
      rangText: "group-hover:text-yellow-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/magnit/dia-paramagnit",
      icon: "🧲",
      title: "Diamagnit va paramagnit komplekslar",
      desc: "Diamagnit komplekslar: d⁰, d¹⁰, quyi spinli d⁶. Paramagnit komplekslar: juftlanmagan elektronlar soniga ko'ra. Temperaturaga bog'liqlik va Kyuri-Veys qonuni.",
      badge: "Asosiy",
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30",
      rang: "hover:border-green-400/50",
      rangText: "group-hover:text-green-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/magnit/almashinuv",
      icon: "🔴",
      title: "Ko'p yadroli komplekslar magnit xossalari",
      desc: "Almashinuv ta'siri (J). Ferromagnit va antiferromagnit juftliklar. [Cu₂(OAc)₄], okso-ko'prikli Cr³⁺ dimerlar. Magnit tartiblanish turlari.",
      badge: "Murakkab",
      badgeColor: "bg-red-600/20 text-red-400 border-red-600/30",
      rang: "hover:border-red-400/50",
      rangText: "group-hover:text-red-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/magnit/hisoblash",
      icon: "🧮",
      title: "Magnit ma'lumotlardan tahlil",
      desc: "μeff dan n (juftlanmagan e⁻ soni) topish. Spin holatini (YS/QS) aniqlash. Geometriya va oksidlanish darajasini magnit o'lchashlar orqali aniqlash.",
      badge: "Hisoblash",
      badgeColor: "bg-cyan-600/20 text-cyan-400 border-cyan-600/30",
      rang: "hover:border-cyan-400/50",
      rangText: "group-hover:text-cyan-400"
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Chuqurlashgan mavzular</Link>
        <div>
          <h1 className="text-2xl font-bold text-cyan-400">🧲 Magnit xossalari</h1>
          <p className="text-purple-400 text-sm">μeff formulasi • Magnit sezgirlik • Spin-orbit bog&apos;lanish • Ko&apos;p yadroli komplekslar</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12">
        
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold text-white mb-4">📋 Bu bo&apos;limda nimalarni o&apos;rganasiz?</h2>
          <p className="text-purple-200 leading-relaxed mb-4">
            <strong className="text-yellow-400">Magnit xossalari</strong> — kompleks birikmalarning elektron tuzilishi, 
            spin holati va geometriyasini aniqlashning eng ishonchli eksperimental usullaridan biridir. 
            Bu bo&apos;limda siz <strong className="text-yellow-400">magnit moment (μ<sub>eff</sub>)</strong> nazariyasidan boshlab, 
            <strong className="text-yellow-400">Gui usuli</strong> bilan o&apos;lchash, 
            <strong className="text-yellow-400">spin-orbit bog&apos;lanish</strong> ta&apos;siri va 
            <strong className="text-yellow-400">ko&apos;p yadroli komplekslar</strong>ning magnit xossalarigacha 
            bo&apos;lgan barcha muhim mavzularni o&apos;rganasiz.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="bg-cyan-600/20 text-cyan-400 border border-cyan-600/30 px-3 py-1 rounded-full text-xs">6 ta bo&apos;lim</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">μeff formulasi</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Gui usuli</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">Spin-orbit</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">Ko&apos;p yadroli</span>
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

        <div className="mt-10 bg-gradient-to-r from-purple-900/40 to-cyan-900/40 border border-purple-700/50 rounded-2xl p-6 text-center">
          <p className="text-purple-300 text-sm">
            📚 Manba: A.M. Nasimov, X.Sh. Tashpulatov — Noorganik kimyoning tanlangan boblari (VI bob) |
            O. Kahn — Molecular Magnetism | R.L. Carlin — Magnetochemistry
          </p>
        </div>

      </section>
    </main>
  )
}