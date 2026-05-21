import Link from "next/link"

export default function QuizTest() {
  const mavzular = [
    {
      href: "/oquv/video-darsliklar/quiz/nomlanishi",
      icon: "📖",
      title: "Nomlanishi",
      desc: "IUPAC qoidalari, ligandlar, formula yozish",
      savol: "15 ta",
      rang: "hover:border-red-400/50",
      rangText: "group-hover:text-red-400",
      iconRang: "from-red-600 to-orange-600"
    },
    {
      href: "/oquv/video-darsliklar/quiz/klassifikatsiyasi",
      icon: "📊",
      title: "Klassifikatsiyasi",
      desc: "Sinf, ligand, zaryad bo'yicha tasniflash",
      savol: "15 ta",
      rang: "hover:border-blue-400/50",
      rangText: "group-hover:text-blue-400",
      iconRang: "from-blue-600 to-cyan-600"
    },
    {
      href: "/oquv/video-darsliklar/quiz/fazoviy",
      icon: "💎",
      title: "Fazoviy tuzilishi",
      desc: "Geometriya, gibridlanish, koordinatsion son",
      savol: "15 ta",
      rang: "hover:border-purple-400/50",
      rangText: "group-hover:text-purple-400",
      iconRang: "from-purple-600 to-indigo-600"
    },
    {
      href: "/oquv/video-darsliklar/quiz/izomeriya",
      icon: "🔄",
      title: "Izomeriyasi",
      desc: "Tuzilish va stereoizomeriya turlari",
      savol: "15 ta",
      rang: "hover:border-pink-400/50",
      rangText: "group-hover:text-pink-400",
      iconRang: "from-pink-600 to-rose-600"
    },
    {
      href: "/oquv/video-darsliklar/quiz/aralash",
      icon: "🎯",
      title: "Aralash test",
      desc: "Barcha mavzulardan aralash savollar",
      savol: "15 ta",
      rang: "hover:border-yellow-400/50",
      rangText: "group-hover:text-yellow-400",
      iconRang: "from-yellow-500 to-amber-600"
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/video-darsliklar" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Orqaga</Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">📝 Quiz Test</h1>
          <p className="text-purple-400 text-sm">Har bir mavzu bo'yicha 15 tadan test • Bilimingizni sinab ko'ring!</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Kirish */}
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold text-white mb-4">📋 Test haqida</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-purple-800/30 rounded-xl p-4">
              <div className="text-3xl mb-2">📚</div>
              <div className="text-2xl font-bold text-yellow-400">5</div>
              <div className="text-purple-400 text-sm">Mavzu</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4">
              <div className="text-3xl mb-2">📝</div>
              <div className="text-2xl font-bold text-yellow-400">75</div>
              <div className="text-purple-400 text-sm">Savol</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4">
              <div className="text-3xl mb-2">⏱️</div>
              <div className="text-2xl font-bold text-yellow-400">15</div>
              <div className="text-purple-400 text-sm">Daqiqa</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4">
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-2xl font-bold text-yellow-400">70%</div>
              <div className="text-purple-400 text-sm">O'tish bali</div>
            </div>
          </div>
        </div>

        {/* Mavzular */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {mavzular.map((m, i) => (
            <Link 
              key={i}
              href={m.href}
              className={`group bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 hover:bg-purple-800/60 ${m.rang} transition-all transform hover:-translate-y-2 hover:shadow-xl`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${m.iconRang} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform flex-shrink-0`}>
                  {m.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-bold text-white mb-1 ${m.rangText} transition-colors`}>
                    {m.title}
                  </h3>
                  <p className="text-purple-300 text-sm mb-3">{m.desc}</p>
                  <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-2 py-0.5 rounded-full text-xs font-semibold">
                    {m.savol} savol
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pastki ma'lumot */}
        <div className="mt-10 bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-6 text-center">
          <p className="text-purple-300 text-sm">
            📚 Manba: A.M. Nasimov, X.Sh. Tashpulatov — Noorganik kimyoning tanlangan boblari
          </p>
        </div>

      </section>
    </main>
  )
}