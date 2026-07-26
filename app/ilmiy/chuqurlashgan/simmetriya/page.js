"use client"

import Link from "next/link"
import { useState, useEffect } from "react"

const BOLIMLAR = [
  {
    href: "/ilmiy/chuqurlashgan/simmetriya/elementlar",
    icon: "🪞", num: "01",
    title: "Simmetriya elementlari va amallari",
    desc: "Cₙ, σ, i, Sₙ, E — 5 ta simmetriya elementi. Matematik ifodasi, determinanti, tartibi. Kompleks birikmalarda misollar bilan.",
    badge: "Asosiy", badgeColor: "bg-red-600/20 text-red-400 border-red-600/30",
    level: "boshlangich", levelLabel: "Boshlang'ich", levelColor: "bg-green-600/20 text-green-400 border-green-600/30",
    time: "30 daqiqa"
  },
  {
    href: "/ilmiy/chuqurlashgan/simmetriya/nuqtali-guruhlar",
    icon: "🏷️", num: "02",
    title: "Nuqtali guruhlar",
    desc: "Schoenflies belgilari: O_h (48), T_d (24), D4h (16), D3h (12), C2v (4). Guruhni aniqlash algoritmi. 8 ta muhim guruh jadvali.",
    badge: "Muhim", badgeColor: "bg-orange-600/20 text-orange-400 border-orange-600/30",
    level: "orta", levelLabel: "O'rta", levelColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
    time: "40 daqiqa"
  },
  {
    href: "/ilmiy/chuqurlashgan/simmetriya/xarakterlar",
    icon: "📊", num: "03",
    title: "Xarakterlar jadvali",
    desc: "Mulliken belgilari (A, B, E, T). O_h (10×11) va T_d (5×6) to'liq jadvallari. g/u — gerade/ungerade. IRREPS va ularning ma'nosi.",
    badge: "Nazariya", badgeColor: "bg-blue-600/20 text-blue-400 border-blue-600/30",
    level: "ilgor", levelLabel: "Ilg'or", levelColor: "bg-red-600/20 text-red-400 border-red-600/30",
    time: "50 daqiqa"
  },
  {
    href: "/ilmiy/chuqurlashgan/simmetriya/tebranish",
    icon: "📈", num: "04",
    title: "Simmetriya va tebranish spektrlari",
    desc: "3N−6 qoidasi. Oktaedrik ML₆ uchun 6 tebranish modi (A₁g, E_g, T₁u, T₂g, T₂u). IQ va Raman faollik — seleksiya qoidalari.",
    badge: "Spektr", badgeColor: "bg-green-600/20 text-green-400 border-green-600/30",
    level: "ilgor", levelLabel: "Ilg'or", levelColor: "bg-red-600/20 text-red-400 border-red-600/30",
    time: "45 daqiqa"
  },
  {
    href: "/ilmiy/chuqurlashgan/simmetriya/elektron",
    icon: "🔬", num: "05",
    title: "Simmetriya va elektron tuzilish",
    desc: "d-orbitallarning simmetriya bo'yicha klassifikatsiyasi. MO energiya diagrammalarida simmetriyaning roli. Proyeksion operator.",
    badge: "Chuqur", badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
    level: "ilgor", levelLabel: "Ilg'or", levelColor: "bg-red-600/20 text-red-400 border-red-600/30",
    time: "45 daqiqa"
  },
  {
    href: "/ilmiy/chuqurlashgan/simmetriya/3d",
    icon: "🔮", num: "06",
    title: "Simmetriya 3D vizualizatsiya",
    desc: "O_h, T_d, D4h geometriyalarining canvas vizualizatsiyasi. Simmetriya elementlarini vizual ko'rish. Interaktiv 3D modellar.",
    badge: "3D", badgeColor: "bg-pink-600/20 text-pink-400 border-pink-600/30",
    level: "orta", levelLabel: "O'rta", levelColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
    time: "30 daqiqa"
  }
]

export default function Simmetriya() {
  const [mounted, setMounted] = useState(false)
  const [progress, setProgress] = useState({})

  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem("jda-simmetriya-progress")
      if (saved) setProgress(JSON.parse(saved))
    } catch (e) {}
  }, [])

  const toggleProgress = (href) => {
    const next = { ...progress, [href]: !progress[href] }
    setProgress(next)
    try { localStorage.setItem("jda-simmetriya-progress", JSON.stringify(next)) } catch (e) {}
  }

  const stats = {
    total: BOLIMLAR.length,
    completed: Object.values(progress).filter(Boolean).length,
    totalTime: BOLIMLAR.reduce((s, b) => s + parseInt(b.time), 0)
  }

  const levelColors = {
    boshlangich: { dot: "bg-green-500", text: "text-green-400", bg: "bg-green-600/20" },
    orta: { dot: "bg-yellow-500", text: "text-yellow-400", bg: "bg-yellow-600/20" },
    ilgor: { dot: "bg-red-500", text: "text-red-400", bg: "bg-red-600/20" }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white">

      <header className="sticky top-0 z-30 bg-purple-950/90 backdrop-blur-xl border-b border-purple-800/50 px-4 sm:px-6 py-3">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-purple-400 mb-1 flex-wrap">
            <Link href="/" className="hover:text-purple-300">🏠</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy" className="hover:text-purple-300">Ilmiy</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan" className="hover:text-purple-300">Chuqurlashgan</Link>
            <span className="text-purple-600">›</span>
            <span className="text-red-400">Simmetriya</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-red-400 flex items-center gap-2">
            <span>⚛️</span> Molekulalar simmetriyasi
          </h1>
          <p className="text-[10px] sm:text-xs text-purple-500">Nuqtali guruhlar • Xarakterlar jadvali • IQ/Raman • 3D vizualizatsiya</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-5 sm:space-y-8">

        {/* KIRISH */}
        <div className="bg-gradient-to-br from-purple-900/50 via-indigo-900/30 to-blue-900/30 border border-purple-700/40 rounded-2xl p-4 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h2 className="text-base sm:text-xl font-bold text-white mb-3">📋 Bu bo'limda nimalarni o'rganasiz?</h2>
              <p className="text-xs sm:text-sm text-purple-200 leading-relaxed mb-3">
                <strong className="text-yellow-400">Molekulalar simmetriyasi</strong> — kompleks birikmalarning 
                tuzilishini tushunish, spektrlarini tahlil qilish va kimyoviy xossalarini bashorat qilish uchun 
                eng fundamental nazariy asosdir. Bu bo'limda siz simmetriya elementlaridan boshlab, 
                nuqtali guruhlar, xarakterlar jadvali, IQ/Raman faollik va 3D modellargacha bo'lgan 
                barcha muhim mavzularni o'zlashtirasiz.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-2 py-0.5 rounded-full text-[10px]">{stats.total} ta bo'lim</span>
                <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-2 py-0.5 rounded-full text-[10px]">O_h, T_d, D4h</span>
                <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-2 py-0.5 rounded-full text-[10px]">Xarakterlar jadvali</span>
                <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-2 py-0.5 rounded-full text-[10px]">IQ/Raman</span>
                <span className="bg-pink-600/20 text-pink-400 border border-pink-600/30 px-2 py-0.5 rounded-full text-[10px]">3D modellar</span>
              </div>
            </div>
            <div className="bg-purple-950/60 border border-purple-700/30 rounded-xl p-3 sm:p-4 text-xs space-y-1.5">
              <p className="text-purple-300"><span className="text-red-400 font-bold">🎯 Maqsad:</span> Simmetriya elementlari, nuqtali guruhlar va xarakterlar jadvalidan foydalanishni o'zlashtirish.</p>
              <p className="text-purple-300"><span className="text-red-400 font-bold">⏱️ Vaqt:</span> ~4 soat</p>
              <p className="text-purple-300"><span className="text-red-400 font-bold">📚 Manba:</span> F.A. Cotton — Chemical Applications of Group Theory</p>
              <div className="bg-purple-950/90 rounded p-2 mt-1 text-center border border-purple-700/30">
                <p className="text-red-300 font-mono text-xs font-bold">Simmetriya — kompleks kimyosining tili!</p>
              </div>
            </div>
          </div>
        </div>

        {/* STATISTIKA */}
        <div className={`grid grid-cols-3 gap-3 transition-all duration-700 ${mounted ? "opacity-100" : "opacity-0"}`}>
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/30 border border-purple-700/40 rounded-xl p-3 sm:p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-purple-300">{stats.total}</div>
            <div className="text-[10px] sm:text-xs text-purple-400 mt-1">📚 Bo'limlar</div>
          </div>
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/30 border border-purple-700/40 rounded-xl p-3 sm:p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-300">{stats.completed}</div>
            <div className="text-[10px] sm:text-xs text-emerald-400 mt-1">✅ O'qilgan</div>
          </div>
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/30 border border-purple-700/40 rounded-xl p-3 sm:p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-amber-300">{Math.round(stats.totalTime / 60)} soat</div>
            <div className="text-[10px] sm:text-xs text-amber-400 mt-1">⏱️ Umumiy</div>
          </div>
        </div>

        {/* BO'LIMLAR */}
        <div className="space-y-3 sm:space-y-4">
          {BOLIMLAR.map((b, i) => (
            <div
              key={b.href}
              className={`group relative bg-gradient-to-r from-purple-900/40 to-purple-800/20 border border-purple-700/40 rounded-xl sm:rounded-2xl transition-all duration-500 hover:bg-purple-800/50 hover:scale-[1.005] ${
                progress[b.href] ? "ring-1 ring-emerald-500/30" : ""
              }`}
              style={{ animation: mounted ? `fadeIn 0.5s ease-out ${i * 0.08}s both` : "none" }}
            >
              <Link href={b.href} className="block p-3 sm:p-5">
                <div className="flex items-start gap-3 sm:gap-5">
                  {/* Raqam */}
                  <div className="hidden sm:flex w-10 h-10 rounded-xl bg-purple-800/60 border border-purple-600/40 items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-purple-400">{b.num}</span>
                  </div>

                  {/* Icon */}
                  <div className="text-2xl sm:text-3xl flex-shrink-0 mt-0.5">{b.icon}</div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-red-400 transition-colors">
                        {b.title}
                      </h3>
                      <span className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full border font-semibold whitespace-nowrap ${b.badgeColor}`}>
                        {b.badge}
                      </span>
                      <span className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full border ${b.levelColor} whitespace-nowrap`}>
                        {b.levelLabel}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-purple-300/80 mt-1 leading-relaxed">{b.desc}</p>
                  </div>

                  {/* O'ng: vaqt + progress */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="text-[10px] text-purple-500 whitespace-nowrap">⏱️ {b.time}</span>
                    <span className="text-purple-400 group-hover:translate-x-1 transition-transform text-lg">→</span>
                  </div>
                </div>
              </Link>

              {/* Progress toggle */}
              <button
                onClick={(e) => { e.preventDefault(); toggleProgress(b.href) }}
                className={`absolute top-2 right-2 sm:top-3 sm:right-3 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  progress[b.href]
                    ? "bg-emerald-500 border-emerald-400 text-white"
                    : "border-purple-600/50 hover:border-purple-400 bg-purple-950/50"
                }`}
                title={progress[b.href] ? "O'qilgan" : "O'qildi"}
              >
                {progress[b.href] && (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* XULOSA + MANBA */}
        <div className="bg-gradient-to-r from-red-600/10 to-purple-600/10 border border-red-500/20 rounded-2xl p-4 sm:p-6 text-center">
          <p className="text-xs sm:text-sm text-purple-200 leading-relaxed">
            <strong className="text-yellow-400">Simmetriya</strong> — kompleks birikmalar kimyosining tili. 
            Ushbu bo'limni o'zlashtirganingizdan so'ng, siz istalgan kompleksning nuqtali guruhini aniqlay olasiz, 
            xarakterlar jadvalidan foydalana olasiz va IQ/Raman faollikni bashorat qila olasiz.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            <span className="text-[10px] bg-purple-800/40 text-purple-300 px-2 sm:px-3 py-1 rounded-full border border-purple-700/40">
              ✅ {stats.completed}/{stats.total} o'qildi
            </span>
            <span className="text-[10px] bg-purple-800/40 text-purple-300 px-2 sm:px-3 py-1 rounded-full border border-purple-700/40">
              📚 Cotton — Chemical Applications of Group Theory
            </span>
          </div>
        </div>

        {/* NAVIGATSIYA */}
        <div className="flex justify-between pt-2">
          <Link href="/ilmiy/chuqurlashgan/elektron-konfiguratsiya"
            className="px-3 sm:px-6 py-2 sm:py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-xs sm:text-sm flex items-center gap-2">
            <span>←</span> Elektron konfiguratsiya
          </Link>
          <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish"
            className="px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-red-500/20">
            Kimyoviy bog'lanish <span>→</span>
          </Link>
        </div>

      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  )
}
