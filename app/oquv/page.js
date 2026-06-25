"use client"
import Link from "next/link"
import { useState, useEffect } from "react"

const BOLIMLAR = [
  {
    id: "nomlanishi",
    href: "/oquv/nomlanishi",
    icon: "📖",
    title: "Nomlanishi",
    desc: "IUPAC qoidalari, formula yozish, ligandlar",
    color: "from-green-500 to-emerald-500",
    step: 1,
    progress: 0
  },
  {
    id: "klassifikatsiyasi",
    href: "/oquv/klassifikatsiyasi",
    icon: "📊",
    title: "Klassifikatsiyasi",
    desc: "Sinf, ligand, zaryad bo'yicha tasniflash",
    color: "from-blue-500 to-cyan-500",
    step: 2,
    progress: 0
  },
  {
    id: "fazoviy",
    href: "/oquv/fazoviy",
    icon: "💎",
    title: "Fazoviy tuzilishi",
    desc: "Geometrik shakllar va 3D modellar",
    color: "from-yellow-500 to-orange-500",
    step: 3,
    progress: 0
  },
  {
    id: "izomeriyasi",
    href: "/oquv/izomeriyasi",
    icon: "🔄",
    title: "Izomeriyasi",
    desc: "Tuzilish va stereoizomeriya turlari",
    color: "from-pink-500 to-rose-500",
    step: 4,
    progress: 0
  },
  {
    id: "kimyoviy-boglanish",
    href: "/oquv/kimyoviy-boglanish",
    icon: "🔗",
    title: "Kimyoviy bog'lanish",
    desc: "VB nazariyasi, kristall maydon, Yan-Teller",
    color: "from-red-500 to-orange-500",
    step: 5,
    progress: 0
  },
  {
    id: "video-darsliklar",
    href: "/oquv/video-darsliklar",
    icon: "🎬",
    title: "Video darsliklar",
    desc: "Barcha mavzular bo'yicha videolar va testlar",
    color: "from-purple-500 to-pink-500",
    step: 6,
    progress: 0
  }
]

export default function OquvPage() {
  const [progress, setProgress] = useState(BOLIMLAR)
  const [hoveredCard, setHoveredCard] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('oquv-progress')
    if (saved) {
      setProgress(JSON.parse(saved))
    }
  }, [])

  const totalProgress = Math.round(
    progress.reduce((sum, b) => sum + b.progress, 0) / progress.length
  )

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 text-white">
      <header className="border-b border-purple-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-xs mb-2 text-purple-400 flex-wrap">
            <Link href="/" className="hover:text-purple-300">🏠 Bosh sahifa</Link>
            <span className="text-purple-600">›</span>
            <span className="text-blue-400 font-semibold">O'quv bo'limi</span>
          </nav>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-blue-400 flex items-center gap-2">
                <span className="text-3xl">📚</span>
                O'quv bo'limi
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                Kompleks birikmalar asoslari — 6 ta bosqich
              </p>
            </div>
            <Link href="/" className="text-xs bg-blue-600/80 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors">
              ← Bosh sahifa
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* HERO */}
        <div className="bg-gradient-to-br from-purple-900/60 to-blue-900/60 border border-purple-700/50 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Kompleks birikmalar
              </span>
              <br />
              <span className="text-white text-2xl md:text-3xl">noldan professionallargacha</span>
            </h2>

            <p className="text-lg text-purple-200 max-w-3xl mb-8 leading-relaxed">
              6 ta bosqich — nomlashdan boshlab kimyoviy bog'lanish nazariyalarigacha.
              Har bir bo'lim interaktiv modellar va amaliy misollar bilan.
            </p>

            {/* Progress bar */}
            <div className="bg-purple-950/50 rounded-2xl p-6 border border-purple-700/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-purple-300 text-sm">Umumiy progress</span>
                <span className="text-2xl font-bold text-blue-400">{totalProgress}%</span>
              </div>
              <div className="w-full h-3 bg-purple-900/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                  style={{ width: `${totalProgress}%` }}
                />
              </div>
              <div className="grid grid-cols-6 gap-1 mt-3">
                {progress.map((b, i) => (
                  <div 
                    key={i}
                    className={`h-2 rounded-full ${b.progress > 0 ? `bg-gradient-to-r ${b.color}` : 'bg-purple-800/50'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BO'LIMLAR */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {progress.map((b, i) => (
            <Link
              key={b.id}
              href={b.href}
              className="group relative bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 hover:border-blue-400/60 transition-all transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20"
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Progress circle */}
              <div className="absolute top-4 right-4">
                <svg className="w-12 h-12 transform -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    className="text-purple-800/50"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 20}`}
                    strokeDashoffset={`${2 * Math.PI * 20 * (1 - b.progress / 100)}`}
                    className={`transition-all duration-500 bg-gradient-to-r ${b.color}`}
                    style={{ stroke: 'url(#gradient)' }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{b.progress}%</span>
                </div>
              </div>

              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${b.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {b.icon}
              </div>

              {/* Step badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-950/50 rounded-full text-xs text-purple-300 mb-3">
                <span className="w-2 h-2 bg-blue-400 rounded-full" />
                Bosqich {b.step}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                {b.title}
              </h3>
              <p className="text-purple-300 text-sm mb-4 leading-relaxed">
                {b.desc}
              </p>

              {/* Arrow */}
              <div className="flex items-center gap-2 text-blue-400 text-sm font-semibold">
                <span>Boshlash</span>
                <span className="group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* QANDAY BOSHLASH */}
        <div className="bg-gradient-to-r from-yellow-600/10 to-orange-600/10 border border-yellow-500/30 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">🚀</span>
            Qanday boshlash kerak?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-yellow-400">📖 Yangi boshlovchilar</h3>
              <ol className="space-y-3 text-sm text-purple-200">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-yellow-500/20 border border-yellow-500/50 flex items-center justify-center text-xs font-bold text-yellow-400 shrink-0">1</span>
                  <span><strong>Nomlanishi</strong> — kimyoning alifbosi</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-yellow-500/20 border border-yellow-500/50 flex items-center justify-center text-xs font-bold text-yellow-400 shrink-0">2</span>
                  <span><strong>Klassifikatsiyasi</strong> — tizimli tushunish</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-yellow-500/20 border border-yellow-500/50 flex items-center justify-center text-xs font-bold text-yellow-400 shrink-0">3</span>
                  <span><strong>Fazoviy tuzilishi</strong> — 3D tasavvur</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-yellow-500/20 border border-yellow-500/50 flex items-center justify-center text-xs font-bold text-yellow-400 shrink-0">4</span>
                  <span>Har bir bo'limdan keyin <strong>testlarni</strong> yeching</span>
                </li>
              </ol>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-yellow-400">💡 Samarali o'rganish</h3>
              <div className="space-y-3">
                <div className="bg-purple-950/50 rounded-xl p-4">
                  <p className="text-yellow-400 font-bold mb-1">📅 Har kuni 30-60 daq</p>
                  <p className="text-purple-300 text-xs">Bir kunda 5 soatdan ko'ra, har kuni 30 daqiqa samaraliroq</p>
                </div>
                <div className="bg-purple-950/50 rounded-xl p-4">
                  <p className="text-yellow-400 font-bold mb-1">✍️ Qo'lda yozing</p>
                  <p className="text-purple-300 text-xs">Formulalar va misollarni qog'ozga yozing</p>
                </div>
                <div className="bg-purple-950/50 rounded-xl p-4">
                  <p className="text-yellow-400 font-bold mb-1">🔄 Takrorlang</p>
                  <p className="text-purple-300 text-xs">1, 3, 7 kun qoidasi</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">🎯 Tayyor? Birinchi bo'limdan boshlaymiz!</h2>
          <p className="text-purple-200 mb-6 max-w-2xl mx-auto">
            <strong className="text-blue-400">Nomlanishi</strong> — kompleks birikmalar kimyosining alifbosi.
          </p>
          <Link
            href="/oquv/nomlanishi"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 rounded-xl text-white font-bold text-lg transition-all transform hover:-translate-y-1 shadow-xl shadow-blue-500/20"
          >
            📖 Nomlanishi — Boshlash
            <span>→</span>
          </Link>
        </div>

        {/* NAVIGATION */}
        <div className="flex flex-col md:flex-row justify-between gap-4 pt-6">
          <Link href="/" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-center">
            ← Bosh sahifa
          </Link>
          <Link href="/ilmiy" className="px-6 py-3 bg-purple-600/60 hover:bg-purple-500/80 border border-purple-500/50 rounded-xl text-white font-semibold">
            🔬 Ilmiy bo'lim →
          </Link>
        </div>
      </section>

      <footer className="border-t border-purple-800/30 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 JDA KIMYO — Koordinatsion kimyo ta'lim portali</p>
          <p className="mt-1">O'quv bo'limi • 6 ta bosqich • 50+ mavzu • 20+ video • 100+ test</p>
        </div>
      </footer>
    </main>
  )
}