import Link from "next/link"

export default function KopYadroli() {
  const qismlar = [
    {
      href: "/ilmiy/chuqurlashgan/kop-yadroli/mm-boglar",
      icon: "🔗",
      title: "M−M bog'lar",
      desc: "[Re₂Cl₈]²⁻ — quadruple bond (σ²π⁴δ²), bog' tartibi, δ bog'ning aylanish to'sig'i, 3D model, bog' tartibi kalkulyatori",
      badge: "3D + Kalkulyator",
      badgeColor: "bg-blue-600/20 text-blue-400 border-blue-600/30"
    },
    {
      href: "/ilmiy/chuqurlashgan/kop-yadroli/karbonil-klasterlar",
      icon: "🪐",
      title: "Metall karbonil klasterlari",
      desc: "[Fe₃(CO)₁₂], [Co₄(CO)₁₂], Wade qoidalari, PSEPT (Polyhedral Skeletal Electron Pair Theory), interaktiv elektron sanash kalkulyatori",
      badge: "Kalkulyator",
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30"
    },
    {
      href: "/ilmiy/chuqurlashgan/kop-yadroli/magnit-klasterlar",
      icon: "🧲",
      title: "Ko'p yadroli magnit komplekslar",
      desc: "SMM (Single-Molecule Magnets), Mn₁₂, Fe₈, magnit anizotropiya, kvant tunnellash, histerezis — molekulyar darajada",
      badge: "SMM",
      badgeColor: "bg-purple-600/20 text-purple-400 border-purple-600/30"
    },
    {
      href: "/ilmiy/chuqurlashgan/kop-yadroli/aralash-valentli",
      icon: "🔄",
      title: "Aralash valentli komplekslar",
      desc: "Prussiya ko'ki, Creutz-Taube ioni, Robin-Day klassifikatsiyasi (I/II/III sinf), interaktiv klassifikatsiya slayderi, MMCT",
      badge: "Interaktiv",
      badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30"
    },
    {
      href: "/ilmiy/chuqurlashgan/kop-yadroli/bioilhomlantirilgan",
      icon: "🌿",
      title: "Bioilhomlantirilgan ko'p yadroli komplekslar",
      desc: "Mn₄Ca klasteri (fotosintez II), FeMo-koferment (nitrogenaza), Fe₈S₇ klasteri — tabiiy ko'p yadroli tizimlar",
      badge: "Biologik",
      badgeColor: "bg-cyan-600/20 text-cyan-400 border-cyan-600/30"
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan" className="text-purple-400 hover:text-purple-300 text-lg">← Chuqurlashgan mavzular</Link>
        <div>
          <h1 className="text-2xl font-bold text-fuchsia-400">🪐 Ko'p yadroli komplekslar</h1>
          <p className="text-purple-400 text-sm">M−M bog'lar • Karbonil klasterlar • SMM • Aralash valentli • Bioilhomlantirilgan</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12">
        
        {/* Asosiy ma'lumot */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold text-white mb-4">📋 Ko'p yadroli komplekslar haqida</h2>
          <p className="text-purple-200 leading-relaxed mb-4">
            <strong className="text-fuchsia-400">Ko'p yadroli komplekslar</strong> — ikki yoki undan ortiq 
            metall markazini o'z ichiga olgan birikmalar. Metall atomlari <strong className="text-fuchsia-400"> 
            bevosita M−M bog'lar</strong> yoki <strong className="text-fuchsia-400">ko'prik ligandlar</strong> 
            orqali bog'langan bo'lishi mumkin. Bu komplekslar <strong>noyob elektron, magnit va katalitik 
            xossalarga</strong> ega. Tabiatda eng muhim ko'p yadroli tizimlar — fotosintez II ning Mn₄Ca 
            klasteri va nitrogenaza fermentining FeMo-kofermenti.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="bg-fuchsia-600/20 text-fuchsia-400 border border-fuchsia-600/30 px-3 py-1 rounded-full text-xs">5 ta qism</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">3D modellar</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">Interaktiv kalkulyatorlar</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">SMM • Wade qoidalari</span>
          </div>
        </div>

        {/* Klassifikatsiya jadvali */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold text-white mb-6">📊 Ko'p yadroli komplekslar klassifikatsiyasi</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Turi</th>
                <th className="py-3 px-4 text-purple-300">Bog'lanish</th>
                <th className="py-3 px-4 text-purple-300">Klassik misol</th>
                <th className="py-3 px-4 text-purple-300">M−M bog' tartibi</th>
                <th className="py-3 px-4 text-purple-300">Asosiy xossa</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Dinuklear (M₂)","M−M bog' yoki ko'prik ligand","[Re₂Cl₈]²⁻","4 (quadruple)","δ bog' — aylanish to'sig'i"],
                  ["Uchburchak (M₃)","M−M bog'lar (klaster)","[Fe₃(CO)₁₂]","1−2","Wade qoidalari bo'yicha elektron sanash"],
                  ["Tetraedrik (M₄)","M−M bog'lar (klaster)","[Co₄(CO)₁₂]","1","60 CV elektron — PSEPT"],
                  ["Ko'p yadroli (M₆−M₁₂)","M−M + ko'prik ligandlar","Mn₁₂O₁₂ (SMM)","0 (ko'prik O)","Molekulyar magnit — SMM"],
                  ["Aralash valentli","Ko'prik ligand orqali","Prussiya ko'ki (Fe₄[Fe(CN)₆]₃)","0 (CN⁻ ko'prik)","Robin-Day II sinf — IVCT"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-fuchsia-400 text-xs">{r[0]}</td>
                    <td className="py-3 px-4 text-xs">{r[1]}</td>
                    <td className="py-3 px-4 font-mono text-yellow-400 text-xs">{r[2]}</td>
                    <td className="py-3 px-4 text-xs">{r[3]}</td>
                    <td className="py-3 px-4 text-xs">{r[4]}</td>
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
              className="group bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 hover:bg-purple-800/60 hover:border-fuchsia-400/50 transition-all transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl group-hover:scale-110 transition-transform">{q.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-fuchsia-300 transition-colors">{q.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${q.badgeColor} font-semibold`}>{q.badge}</span>
                  </div>
                  <p className="text-purple-300 text-sm leading-relaxed">{q.desc}</p>
                </div>
                <div className="text-fuchsia-400 text-2xl group-hover:translate-x-1 transition-transform">→</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 bg-gradient-to-r from-fuchsia-600/10 to-purple-600/10 border border-fuchsia-500/20 rounded-2xl p-6 text-center">
          <p className="text-purple-300 text-sm">
            🪐 Ko'p yadroli komplekslar — <strong className="text-fuchsia-400">metall-metall bog'lari, 
            klaster kimyosi va molekulyar magnetizm</strong> — noorganik kimyoning eng qiziqarli sohalaridan biri
          </p>
        </div>

      </section>
    </main>
  )
}