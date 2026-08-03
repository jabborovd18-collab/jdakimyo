"use client"

import Link from "next/link"
import { useState, useEffect } from "react"

const MAVZULAR = [
  {
    id: "verner",
    href: "/oquv/nomlanishi/verner",
    icon: "🏛️",
    title: "Verner nazariyasi",
    desc: "Alfred Verner (1866-1919) • Kompleks tuzilishi • Asosiy valentlik va qo'shimcha valentlik",
    color: "from-purple-500 to-indigo-500",
    borderColor: "border-purple-500/30",
    hoverBorder: "hover:border-purple-400/60",
    stats: ["1893 yil", "Nobel 1913", "Koordinatsion son"],
    step: 1
  },
  {
    id: "formula",
    href: "/oquv/nomlanishi/formula",
    icon: "📝",
    title: "Formula yozish",
    desc: "Ichki va tashqi sfera • Ligandlar ketma-ketligi • Ambientat ligandlar",
    color: "from-blue-500 to-cyan-500",
    borderColor: "border-blue-500/30",
    hoverBorder: "hover:border-blue-400/60",
    stats: ["Markaziy atom", "Ligandlar", "Tashqi sfera"],
    step: 2
  },
  {
    id: "iupac",
    href: "/oquv/nomlanishi/iupac",
    icon: "📖",
    title: "IUPAC nomlanishi",
    desc: "11 ta asosiy qoida • Kation va anion tartibi • Grekcha prefikslar",
    color: "from-yellow-500 to-orange-500",
    borderColor: "border-yellow-500/30",
    hoverBorder: "hover:border-yellow-400/60",
    stats: ["11 qoida", "Prefikslar", "Oksidlanish darajasi"],
    step: 3
  },
  {
    id: "ligandlar",
    href: "/oquv/nomlanishi/ligandlar",
    icon: "🧩",
    title: "Ligandlar",
    desc: "5.3-jadval • Anion va neytral ligandlar • Polidentat ligandlar",
    color: "from-emerald-500 to-teal-500",
    borderColor: "border-emerald-500/30",
    hoverBorder: "hover:border-emerald-400/60",
    stats: ["Anion ligandlar", "Neytral ligandlar", "Xelat"],
    step: 4
  },
  {
    id: "anion",
    href: "/oquv/nomlanishi/anion",
    icon: "⚛️",
    title: "Anion komplekslar",
    desc: "5.4-jadval • Lotincha nomlar • \"at\" qo'shimchasi",
    color: "from-pink-500 to-rose-500",
    borderColor: "border-pink-500/30",
    hoverBorder: "hover:border-pink-400/60",
    stats: ["Lotincha nomlar", "Ferrate", "Cuprate"],
    step: 5
  }
]

const MOTIVATIONAL = [
  "Har bir kimyogar birinchi qadamdan boshlagan! 🌟",
  "Bugun o'rgangan narsangiz ertaga kashfiyotga aylanadi! 🚀",
  "Xato qilish — o'rganishning eng yaxshi usuli! 💪",
  "Koordinatsion kimyo — 130 yillik sarguzasht! 📚",
]

export default function Nomlanishi() {
  const [activeMavzu, setActiveMavzu] = useState(null)
  const [completedSteps, setCompletedSteps] = useState([])
  const [motivationalIndex, setMotivationalIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
    const saved = localStorage.getItem("nomlanishi-progress")
    if (saved) {
      setCompletedSteps(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setMotivationalIndex((prev) => (prev + 1) % MOTIVATIONAL.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const toggleComplete = (id, e) => {
    e.preventDefault()
    e.stopPropagation()
    setCompletedSteps((prev) => {
      const next = prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
      localStorage.setItem("nomlanishi-progress", JSON.stringify(next))
      return next
    })
  }

  const progressPercent = Math.round((completedSteps.length / MAVZULAR.length) * 100)

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 text-white">
      
      {/* HEADER */}
      <header className="border-b border-purple-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-xs mb-2 text-purple-400 flex-wrap">
            <Link href="/" className="hover:text-purple-300">🏠 Bosh sahifa</Link>
            <span className="text-purple-600">›</span>
            <Link href="/oquv" className="hover:text-purple-300">O'quv bo'limi</Link>
            <span className="text-purple-600">›</span>
            <span className="text-red-400 font-semibold">📖 Nomlanishi</span>
          </nav>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-red-400 flex items-center gap-2">
                <span className="text-3xl">📖</span>
                Nomlanishi
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                Kompleks birikmalarning IUPAC qoidalari asosida nomlanishi • {MAVZULAR.length} ta mavzu
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-purple-900/40 rounded-lg border border-purple-700/50">
                <span className="text-sm text-purple-400">Progress:</span>
                <div className="w-24 h-2 bg-purple-900/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-700"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-blue-400">{progressPercent}%</span>
              </div>
              <Link
                href="/oquv"
                className="text-xs bg-blue-600/80 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"
              >
                ← O'quv
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        
        {/* HERO */}
        <div className={`bg-gradient-to-br from-purple-900/60 to-blue-900/60 border border-purple-700/50 rounded-3xl p-8 md:p-12 relative overflow-hidden transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                Nomlanishi
              </span>
              <br />
              <span className="text-white text-2xl md:text-3xl">kompleks birikmalarni nomlash san'ati</span>
            </h2>

            <p className="text-lg text-purple-200 max-w-3xl mb-8 leading-relaxed">
              Bu bo'limda kompleks birikmalarni <strong className="text-red-400">IUPAC xalqaro qoidalari</strong> asosida to'g'ri nomlashni o'rganasiz.
              Har bir mavzu <strong className="text-yellow-400">qadamma-qadam</strong>, tushunarli va amaliy misollar bilan.
            </p>

            {/* Motivational banner */}
            <div className="bg-purple-950/50 rounded-2xl p-6 border border-purple-700/30">
              <p className="text-purple-300 text-sm font-medium text-center transition-all duration-500" key={motivationalIndex}>
                {MOTIVATIONAL[motivationalIndex]}
              </p>
            </div>
          </div>
        </div>

        {/* MAVZULAR RO'YXATI */}
        <div className="space-y-4">
          {MAVZULAR.map((m, i) => {
            const isCompleted = completedSteps.includes(m.id)
            const isActive = activeMavzu === m.id

            return (
              <div
                key={m.id}
                className={`relative transition-all duration-500 ${isLoaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <Link
                  href={m.href}
                  className={`group relative block bg-purple-900/40 border rounded-2xl p-6 transition-all duration-300 overflow-hidden ${
                    isCompleted
                      ? "border-emerald-500/50 shadow-lg shadow-emerald-500/20"
                      : isActive
                      ? `${m.borderColor} shadow-xl shadow-purple-500/20`
                      : `border-purple-700/50 ${m.hoverBorder} hover:shadow-xl hover:shadow-purple-500/20`
                  }`}
                  onMouseEnter={() => setActiveMavzu(m.id)}
                  onMouseLeave={() => setActiveMavzu(null)}
                >
                  {/* Top gradient bar */}
                  <div className={`h-1.5 bg-gradient-to-r ${m.color} ${isCompleted ? "opacity-100" : "opacity-60 group-hover:opacity-100"} transition-opacity rounded-t-2xl absolute top-0 left-0 right-0`} />

                  <div className="pt-4">
                    <div className="flex items-start gap-4">
                      {/* Step number + icon */}
                      <div className="relative flex-shrink-0">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${m.color} flex items-center justify-center text-2xl shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                          {m.icon}
                        </div>
                        {isCompleted && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs shadow-md">
                            ✓
                          </div>
                        )}
                        <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-purple-900 rounded-full border-2 border-purple-500 flex items-center justify-center text-[10px] font-bold text-purple-300 shadow-sm">
                          {m.step}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                            {m.title}
                          </h3>
                        </div>
                        <p className="text-purple-300 text-sm mb-3">{m.desc}</p>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-2">
                          {m.stats.map((stat, j) => (
                            <span
                              key={j}
                              className={`text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r ${m.color} bg-opacity-20 text-white border ${m.borderColor}`}
                            >
                              {stat}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isCompleted
                            ? "bg-emerald-600 text-white"
                            : "bg-purple-800 text-purple-300 group-hover:bg-blue-600 group-hover:text-white"
                        }`}>
                          {isCompleted ? "✓" : "→"}
                        </div>
                        <button
                          onClick={(e) => toggleComplete(m.id, e)}
                          className={`text-[10px] px-2 py-1 rounded-lg transition-all font-medium ${
                            isCompleted
                              ? "bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600/50"
                              : "bg-purple-800/50 text-purple-400 hover:bg-purple-700/70"
                          }`}
                        >
                          {isCompleted ? "✅ Bajarildi" : "☐ Bajarildi deb belgilash"}
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>

        {/* QANDAY BOSHLASH */}
        <div className={`bg-gradient-to-r from-yellow-600/10 to-orange-600/10 border border-yellow-500/30 rounded-2xl p-8 transition-all duration-1000 delay-200 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
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
                  <span><strong>Verner nazariyasi</strong> — kimyoning alifbosi</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-yellow-500/20 border border-yellow-500/50 flex items-center justify-center text-xs font-bold text-yellow-400 shrink-0">2</span>
                  <span><strong>Formula yozish</strong> — tizimli tushunish</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-yellow-500/20 border border-yellow-500/50 flex items-center justify-center text-xs font-bold text-yellow-400 shrink-0">3</span>
                  <span><strong>IUPAC qoidalari</strong> — xalqaro til</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-yellow-500/20 border border-yellow-500/50 flex items-center justify-center text-xs font-bold text-yellow-400 shrink-0">4</span>
                  <span>Har bir mavzudan keyin <strong>testlarni</strong> yeching</span>
                </li>
              </ol>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-yellow-400">💡 Samarali o'rganish</h3>
              <div className="space-y-3">
                <div className="bg-purple-950/50 rounded-xl p-4 border border-purple-700/30">
                  <p className="text-yellow-400 font-bold mb-1">📅 Har kuni 30-60 daq</p>
                  <p className="text-purple-300 text-xs">Bir kunda 5 soatdan ko'ra, har kuni 30 daqiqa samaraliroq</p>
                </div>
                <div className="bg-purple-950/50 rounded-xl p-4 border border-purple-700/30">
                  <p className="text-yellow-400 font-bold mb-1">✍️ Qo'lda yozing</p>
                  <p className="text-purple-300 text-xs">Formulalar va misollarni qog'ozga yozing</p>
                </div>
                <div className="bg-purple-950/50 rounded-xl p-4 border border-purple-700/30">
                  <p className="text-yellow-400 font-bold mb-1">🔄 Takrorlang</p>
                  <p className="text-purple-300 text-xs">1, 3, 7 kun qoidasi</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MANBALAR */}
        <div className={`bg-purple-900/30 border border-purple-700/50 rounded-2xl p-6 transition-all duration-1000 delay-300 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">📚</span>
            Foydalanilgan manbalar
          </h2>
          <div className="space-y-3">
            {[
              { title: "A.M. Nasimov, X.Sh. Tashpulatov", desc: "Noorganik kimyoning tanlangan boblari (5.1-5.2 bo'limlar)" },
              { title: "IUPAC Recommendations 2005", desc: "Nomenclature of Inorganic Chemistry" },
              { title: "Cotton & Wilkinson", desc: "Advanced Inorganic Chemistry" },
            ].map((item, i) => (
              <div key={i} className="bg-purple-950/50 rounded-xl px-4 py-3 border border-purple-700/30">
                <p className="text-white text-sm font-bold">{item.title}</p>
                <p className="text-purple-400 text-xs mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className={`bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8 text-center transition-all duration-1000 delay-400 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-2xl font-bold text-white mb-4">🎯 Tayyor? Birinchi mavzudan boshlaymiz!</h2>
          <p className="text-purple-200 mb-6 max-w-2xl mx-auto">
            <strong className="text-red-400">Verner nazariyasi</strong> — kompleks birikmalar kimyosining alifbosi.
          </p>
          <Link
            href="/oquv/nomlanishi/verner"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 rounded-xl text-white font-bold text-lg transition-all transform hover:-translate-y-1 shadow-xl shadow-blue-500/20"
          >
            🏛️ Verner nazariyasi — Boshlash
            <span>→</span>
          </Link>
        </div>

        {/* NAVIGATION */}
        <div className="flex flex-col md:flex-row justify-between gap-4 pt-6">
          <Link href="/oquv" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-center">
            ← O'quv bo'lim
          </Link>
          <Link href="/oquv/klassifikatsiyasi" className="px-6 py-3 bg-purple-600/60 hover:bg-purple-500/80 border border-purple-500/50 rounded-xl text-white font-semibold">
            Klassifikatsiyasi →
          </Link>
        </div>
      </section>

      <footer className="border-t border-purple-800/30 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 JDA KIMYO — Koordinatsion kimyo ta'lim portali</p>
          <p className="mt-1">Nomlanishi • 5 ta mavzu • IUPAC qoidalari • 11 ta qoida</p>
        </div>
      </footer>
    </main>
  )
}