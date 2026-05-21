import Link from "next/link"

export default function Nomlanishi() {
  const mavzular = [
    {
      href: "/oquv/nomlanishi/verner",
      icon: "🏛️",
      title: "Verner nazariyasi",
      desc: "Alfred Verner (1866-1919) • Kompleks tuzilishi • Asosiy valentlik va qo'shimcha valentlik"
    },
    {
      href: "/oquv/nomlanishi/formula",
      icon: "📋",
      title: "Formula yozish qoidalari",
      desc: "Ichki va tashqi sfera • Ligandlar ketma-ketligi • Ambientat ligandlar"
    },
    {
      href: "/oquv/nomlanishi/iupac",
      icon: "📖",
      title: "IUPAC nomlanish qoidalari",
      desc: "11 ta asosiy qoida • Kation va anion tartibi • Grekcha prefikslar"
    },
    {
      href: "/oquv/nomlanishi/ligandlar",
      icon: "🧩",
      title: "Ligandlar nomlanishi",
      desc: "5.3-jadval • Anion va neytral ligandlar • Polidentat ligandlar"
    },
    {
      href: "/oquv/nomlanishi/anion",
      icon: "⚛️",
      title: "Anion komplekslar markazi",
      desc: "5.4-jadval • Lotincha nomlar • \"at\" qo'shimchasi"
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Orqaga
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-red-400">📖 Nomlanishi</h1>
          <p className="text-purple-400 text-sm">Kompleks birikmalarning IUPAC qoidalari asosida nomlanishi</p>
        </div>
      </header>

      {/* Asosiy kontent */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Kirish */}
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold text-white mb-4">📋 Bu bo'limda nimalarni o'rganasiz?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-purple-200">
            <div className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✅</span>
              <span>Kompleks birikmalarni to'g'ri nomlash</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✅</span>
              <span>IUPAC xalqaro qoidalari</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✅</span>
              <span>Formula yozish tartibi</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✅</span>
              <span>Ligandlar va markaziy atom nomlari</span>
            </div>
          </div>
        </div>

        {/* Mavzular ro'yxati */}
        <div className="space-y-4">
          {mavzular.map((m, i) => (
            <Link 
              key={i}
              href={m.href}
              className="flex items-center gap-5 bg-purple-900/40 border border-purple-700/50 rounded-xl p-6 hover:bg-purple-800/60 hover:border-red-400/50 transition-all group"
            >
              <div className="text-4xl group-hover:scale-110 transition-transform">{m.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-purple-500 font-bold">0{i + 1}</span>
                  <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">
                    {m.title}
                  </h3>
                </div>
                <p className="text-purple-300 text-sm">{m.desc}</p>
              </div>
              <span className="text-purple-600 group-hover:text-red-400 transition-colors text-xl">→</span>
            </Link>
          ))}
        </div>

        {/* Pastki ma'lumot */}
        <div className="mt-10 bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-6 text-center">
          <p className="text-purple-300 text-sm">
            📚 Manba: A.M. Nasimov, X.Sh. Tashpulatov — Noorganik kimyoning tanlangan boblari (5.1-5.2 bo'limlar)
          </p>
        </div>

      </section>

    </main>
  )
}