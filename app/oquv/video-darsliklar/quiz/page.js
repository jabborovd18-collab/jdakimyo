"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import { getQuizStats } from "./nomlanishi/utils/storage"

export default function QuizTest() {
  const [stats, setStats] = useState({
    nomlanishi: null,
    klassifikatsiyasi: null,
    fazoviy: null,
    izomeriya: null,
    aralash: null
  })

  useEffect(() => {
    // Har bir mavzu uchun statistika olish
    setStats({
      nomlanishi: getQuizStats("nomlanishi"),
      klassifikatsiyasi: getQuizStats("klassifikatsiyasi"),
      fazoviy: getQuizStats("fazoviy"),
      izomeriya: getQuizStats("izomeriya"),
      aralash: getQuizStats("aralash")
    })
  }, [])

  const mavzular = [
    {
      href: "/oquv/video-darsliklar/quiz/nomlanishi",
      icon: "📖",
      title: "Nomlanishi",
      desc: "IUPAC qoidalari, ligandlar, formula yozish",
      savol: "Yirik bazadan, takrorlanmaydi",
      status: stats.nomlanishi ? "completed" : "new",
      stats: stats.nomlanishi,
      rang: "hover:border-red-400/50",
      rangText: "group-hover:text-red-400",
      iconRang: "from-red-600 to-orange-600",
      badge: "Tayyor"
    },
    {
      href: "/oquv/video-darsliklar/quiz/klassifikatsiyasi",
      icon: "📊",
      title: "Klassifikatsiyasi",
      desc: "Sinf, ligand, zaryad bo'yicha tasniflash",
      savol: "Yirik bazadan, takrorlanmaydi",
      status: stats.klassifikatsiyasi ? "completed" : "new",
      stats: stats.klassifikatsiyasi,
      rang: "hover:border-blue-400/50",
      rangText: "group-hover:text-blue-400",
      iconRang: "from-blue-600 to-cyan-600",
      badge: "Tayyor"
    },
    {
      href: "/oquv/video-darsliklar/quiz/fazoviy",
      icon: "💎",
      title: "Fazoviy tuzilishi",
      desc: "Geometriya, gibridlanish, koordinatsion son",
      savol: "Yirik bazadan, takrorlanmaydi",
      status: stats.fazoviy ? "completed" : "new",
      stats: stats.fazoviy,
      rang: "hover:border-purple-400/50",
      rangText: "group-hover:text-purple-400",
      iconRang: "from-purple-600 to-indigo-600",
      badge: "Tayyor"
    },
    {
      href: "/oquv/video-darsliklar/quiz/izomeriya",
      icon: "🔄",
      title: "Izomeriyasi",
      desc: "Tuzilish va stereoizomeriya turlari",
      savol: "Yirik bazadan, takrorlanmaydi",
      status: stats.izomeriya ? "completed" : "new",
      stats: stats.izomeriya,
      rang: "hover:border-pink-400/50",
      rangText: "group-hover:text-pink-400",
      iconRang: "from-pink-600 to-rose-600",
      badge: "Tayyor"
    },
    {
      href: "/oquv/video-darsliklar/quiz/aralash",
      icon: "🎯",
      title: "Aralash test",
      desc: "Barcha mavzulardan aralash savollar",
      savol: "Yirik bazadan, takrorlanmaydi",
      status: stats.aralash ? "completed" : "new",
      stats: stats.aralash,
      rang: "hover:border-yellow-400/50",
      rangText: "group-hover:text-yellow-400",
      iconRang: "from-yellow-500 to-amber-600",
      badge: "Tayyor"
    }
  ]

  // Umumiy statistika
  const totalTests = Object.values(stats).filter(s => s).reduce((sum, s) => sum + (s.totalTests || 0), 0)
  const totalCorrect = Object.values(stats).filter(s => s).reduce((sum, s) => sum + (s.correctAnswers || 0), 0)
  const totalQuestions = Object.values(stats).filter(s => s).reduce((sum, s) => sum + (s.totalQuestions || 0), 0)
  const averageScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 text-white">
      
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50 bg-purple-950/80 backdrop-blur-md sticky top-0 z-40">
        <Link href="/oquv/video-darsliklar" className="text-purple-400 hover:text-purple-300 transition-all text-lg flex items-center gap-2">
          <span>←</span>
          <span>Orqaga</span>
        </Link>
        <div className="h-8 w-px bg-purple-800"></div>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            📝 Quiz Test
          </h1>
          <p className="text-purple-400 text-sm">
            Har bir mavzu bo'yicha 20 tadan test • Bilimingizni sinab ko'ring!
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12">
        
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-purple-900/60 to-blue-900/60 border border-purple-700/50 rounded-3xl p-8 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-4">
              Koordinatsion kimyo bo'yicha bilimingizni sinang
            </h2>
            <p className="text-purple-200 mb-6 max-w-2xl">
              Har bir testda yirik savol bazasidan 20 ta tasodifiy savol tanlanadi. 
              Savollar takrorlanmaydi! PDF natijalar, batafsil tushuntirishlar va progress tracking.
            </p>

            {/* Umumiy statistika */}
            {totalTests > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-purple-950/50 rounded-xl p-4 text-center border border-purple-700/30">
                  <div className="text-3xl mb-2">📝</div>
                  <div className="text-2xl font-bold text-yellow-400">{totalTests}</div>
                  <div className="text-purple-400 text-xs">Jami testlar</div>
                </div>
                <div className="bg-purple-950/50 rounded-xl p-4 text-center border border-purple-700/30">
                  <div className="text-3xl mb-2">✅</div>
                  <div className="text-2xl font-bold text-green-400">{totalCorrect}</div>
                  <div className="text-purple-400 text-xs">To'g'ri javoblar</div>
                </div>
                <div className="bg-purple-950/50 rounded-xl p-4 text-center border border-purple-700/30">
                  <div className="text-3xl mb-2">📊</div>
                  <div className="text-2xl font-bold text-blue-400">{totalQuestions}</div>
                  <div className="text-purple-400 text-xs">Jami savollar</div>
                </div>
                <div className="bg-purple-950/50 rounded-xl p-4 text-center border border-purple-700/30">
                  <div className="text-3xl mb-2">🎯</div>
                  <div className="text-2xl font-bold text-purple-400">{averageScore}%</div>
                  <div className="text-purple-400 text-xs">O'rtacha ball</div>
                </div>
              </div>
            )}

            {totalTests === 0 && (
              <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-xl p-4">
                <p className="text-yellow-200 text-sm">
                  💡 <strong>Maslahat:</strong> Birinchi testni boshlang va natijalaringizni kuzatib boring!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Mavzular */}
        <div className="space-y-4 mb-10">
          <h3 className="text-2xl font-bold text-white mb-6">Mavzularni tanlang</h3>
          
          {mavzular.map((m, i) => (
            <Link 
              key={i}
              href={m.href}
              className={`group block bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 transition-all transform hover:-translate-y-1 hover:shadow-xl ${m.rang} hover:bg-purple-800/60`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${m.iconRang} flex items-center justify-center text-3xl group-hover:scale-110 transition-transform flex-shrink-0`}>
                  {m.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className={`text-xl font-bold text-white ${m.rangText} transition-colors`}>
                      {m.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      m.status === "completed" ? "bg-green-600/20 text-green-400 border border-green-600/30" :
                      "bg-blue-600/20 text-blue-400 border border-blue-600/30"
                    }`}>
                      {m.badge}
                    </span>
                  </div>
                  <p className="text-purple-300 text-sm mb-3">{m.desc}</p>
                  
                  <div className="flex items-center gap-4 text-xs">
                    <span className="bg-purple-800/50 text-purple-300 px-3 py-1 rounded-full">
                      {m.savol}
                    </span>
                    
                    {m.stats && (
                      <>
                        <span className="text-purple-400">•</span>
                        <span className="text-green-400">
                          {m.stats.totalTests} ta test
                        </span>
                        <span className="text-purple-400">•</span>
                        <span className="text-yellow-400">
                          {Math.round(m.stats.averageScore * 100)}% o'rtacha
                        </span>
                      </>
                    )}
                  </div>

                  {/* Progress bar */}
                  {m.stats && m.stats.totalTests > 0 && (
                    <div className="mt-3">
                      <div className="w-full bg-purple-950/50 rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.round(m.stats.averageScore * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-purple-400 group-hover:text-white transition-colors text-2xl">
                  →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Qanday ishlaydi */}
        <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <h3 className="text-2xl font-bold text-white mb-6">🎯 Qanday ishlaydi?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-purple-950/50 rounded-xl p-6 border border-purple-700/30">
              <div className="text-4xl mb-3">1️⃣</div>
              <h4 className="text-lg font-bold text-yellow-400 mb-2">Mavzuni tanlang</h4>
              <p className="text-purple-300 text-sm">
                O'zingizni qiziqtirgan mavzuni tanlang va testni boshlang
              </p>
            </div>

            <div className="bg-purple-950/50 rounded-xl p-6 border border-purple-700/30">
              <div className="text-4xl mb-3">2️⃣</div>
              <h4 className="text-lg font-bold text-yellow-400 mb-2">20 ta savolga javob bering</h4>
              <p className="text-purple-300 text-sm">
                Har bir savolda 4 ta variant, tasdiqlash tugmasi va batafsil tushuntirish
              </p>
            </div>

            <div className="bg-purple-950/50 rounded-xl p-6 border border-purple-700/30">
              <div className="text-4xl mb-3">3️⃣</div>
              <h4 className="text-lg font-bold text-yellow-400 mb-2">PDF natijani yuklab oling</h4>
              <p className="text-purple-300 text-sm">
                Natijalar varaqchasi bilan premium PDF
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-6 text-center">
          <p className="text-purple-300 text-sm mb-2">
            📚 <strong>Manba:</strong> A.M. Nasimov, X.Sh. Tashpulatov — Noorganik kimyoning tanlangan boblari
          </p>
          <p className="text-purple-400 text-xs">
            © 2026 JDA KIMYO • jdakimyo.uz • @diyorbek_jabborov
          </p>
        </div>

      </section>
    </main>
  )
}