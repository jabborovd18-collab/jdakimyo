"use client"

import Link from "next/link"
import { useState } from "react"

export default function PrussianBlue() {
  const [activeTab, setActiveTab] = useState("overview")
  const [compareMode, setCompareMode] = useState("prussian") // prussian | turnbull

  const tabs = [
    { id: "overview", label: "📋 Umumiy", icon: "📋" },
    { id: "structure", label: "🧬 Kubik panjara", icon: "🧬" },
    { id: "mixedValence", label: "⚛️ Mixed-valence", icon: "⚛️" },
    { id: "color", label: "🎨 Rang mexanizmi", icon: "🎨" },
    { id: "bonding", label: "🔗 Ko'prikli CN⁻", icon: "🔗" },
    { id: "spectroscopy", label: "🔬 Spektroskopiya", icon: "🔬" },
    { id: "applications", label: "🏭 Qo'llanilish", icon: "🏭" },
    { id: "synthesis", label: "⚗️ Sintez", icon: "⚗️" },
    { id: "history", label: "🏆 Tarix (1704)", icon: "🏆" },
  ]

  const compareData = {
    prussian: {
      name: "Prussian Blue",
      formula: "Fe₄[Fe(CN)₆]₃",
      reagents: "Fe³⁺ + [Fe(CN)₆]⁴⁻",
      color: "To'q ko'k",
      year: "1704",
      discoverer: "Diesbach",
      structure: "Fe³⁺−N≡C−Fe²⁺"
    },
    turnbull: {
      name: "Turnbull's Blue",
      formula: "Fe₃[Fe(CN)₆]₂",
      reagents: "Fe²⁺ + [Fe(CN)₆]³⁻",
      color: "To'q ko'k",
      year: "1840",
      discoverer: "Turnbull",
      structure: "Fe²⁺−N≡C−Fe³⁺"
    }
  }

  const current = compareData[compareMode]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white relative overflow-hidden">
      
      {/* ═══ ANIMATED BACKGROUND ═══ */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        {['Fe²⁺', 'Fe³⁺', 'CN⁻', 'kubik', 'IVCT', 'Diesbach 1704', 'mixed-valence', 'Berlin ko\'ki'].map((sym, i) => (
          <div
            key={i}
            className="absolute text-blue-400/5 font-mono font-bold select-none pointer-events-none"
            style={{
              fontSize: `${18 + (i % 3) * 6}px`,
              left: `${8 + (i * 13) % 85}%`,
              top: `${12 + (i * 17) % 75}%`,
              animation: `float ${10 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.7}s`
            }}
          >
            {sym}
          </div>
        ))}
      </div>

      {/* ═══ HEADER ═══ */}
      <header className="relative z-20 border-b border-white/5 backdrop-blur-xl bg-purple-950/80 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <nav className="flex items-center gap-2 text-xs mb-3 text-purple-400 flex-wrap">
            <Link href="/" className="hover:text-purple-300 transition-colors">🏠 Bosh sahifa</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy" className="hover:text-purple-300 transition-colors">Ilmiy bo'lim</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/birikmalar" className="hover:text-purple-300 transition-colors">Birikmalar bazasi</Link>
            <span className="text-purple-600">›</span>
            <span className="text-blue-400 font-semibold">Fe₄[Fe(CN)₆]₃</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 text-[10px] text-blue-300 font-bold uppercase tracking-wider">
                  🎨 Birinchi sintetik pigment
                </span>
                <span className="px-2.5 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-[10px] text-yellow-300 font-semibold">
                  🏆 1704 yil
                </span>
                <span className="px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-[10px] text-purple-300 font-semibold">
                  ⚛️ Mixed-valence
                </span>
                <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-[10px] text-cyan-300 font-semibold">
                  🔗 Ko'prikli CN⁻
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-300 bg-clip-text text-transparent">
                Fe₄[Fe(CN)₆]₃
              </h1>
              <p className="text-purple-300 text-sm mt-1">
                Prussian Blue • Berlin ko'ki • Iron(III) hexacyanoferrate(II)
              </p>
            </div>
            
            {/* COMPARE SWITCHER */}
            <div className="flex gap-2">
              <button
                onClick={() => setCompareMode("prussian")}
                className={`px-4 py-2 rounded-xl border-2 transition-all flex items-center gap-2 ${
                  compareMode === "prussian"
                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                    : 'bg-white/5 border-white/10 text-purple-300 hover:bg-white/10'
                }`}
              >
                <span>🎨</span>
                <span className="hidden sm:inline">Prussian Blue</span>
              </button>
              <button
                onClick={() => setCompareMode("turnbull")}
                className={`px-4 py-2 rounded-xl border-2 transition-all flex items-center gap-2 ${
                  compareMode === "turnbull"
                    ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                    : 'bg-white/5 border-white/10 text-purple-300 hover:bg-white/10'
                }`}
              >
                <span>🔵</span>
                <span className="hidden sm:inline">Turnbull's Blue</span>
              </button>
              <Link 
                href="/ilmiy/birikmalar"
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-semibold transition-all flex items-center gap-2"
              >
                <span>📚</span>
                <span className="hidden sm:inline">Bazaga qaytish</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ═══ QUICK STATS BAR ═══ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Formula", value: current.formula, icon: "🧪", color: "text-blue-400" },
            { label: "M massa", value: "859.2 g/mol", icon: "⚖️", color: "text-indigo-400" },
            { label: "Geometriya", value: "Kubik panjara", icon: "💎", color: "text-purple-400" },
            { label: "Rangi", value: "To'q ko'k", icon: "🎨", color: "text-blue-400" },
            { label: "Valentlik", value: "Mixed (Fe²⁺/Fe³⁺)", icon: "⚛️", color: "text-cyan-400" },
          ].map((stat, i) => (
            <div 
              key={i}
              className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:bg-white/[0.06] hover:border-white/20 transition-all group"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg group-hover:scale-110 transition-transform">{stat.icon}</span>
                <span className="text-[10px] uppercase tracking-wider text-purple-400 font-semibold">{stat.label}</span>
              </div>
              <div className={`text-sm font-bold ${stat.color} font-mono`}>{stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ TAB NAVIGATION ═══ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 mb-8">
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white/5 text-purple-300 border border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-16 space-y-8">

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* OVERVIEW TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "overview" && (
          <>
            <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-blue-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">
                  📋
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Asosiy ma'lumotlar — {current.name}</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  ["CAS raqami", "14038-43-8"],
                  ["Zichlik", "1.80 g/cm³"],
                  ["Sistema", "Kubik"],
                  ["Fazoviy guruh", "Fm3̄m"],
                  ["Eruvchanlik (H₂O)", "Erimaydi"],
                  ["Eruvchanlik (kislota)", "Kuchli kislotalarda eriydi"],
                  ["Barqarorlik", "Yuqori (inert)"],
                  ["Rangi", "To'q ko'k"],
                ].map((item, i) => (
                  <div key={i} className="bg-blue-950/50 rounded-xl p-3 border border-blue-700/30">
                    <div className="text-[10px] uppercase tracking-wider text-blue-400 font-semibold mb-1">{item[0]}</div>
                    <div className="text-white font-semibold text-sm">{item[1]}</div>
                  </div>
                ))}
              </div>

              {/* PRUSSIAN vs TURNBULL */}
              <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-2 border-blue-500/30 rounded-2xl p-5">
                <h3 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
                  <span>🔬</span> Prussian Blue vs Turnbull's Blue — bir xil modda!
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-700/30">
                    <h4 className="text-blue-300 font-bold text-sm mb-2">🎨 Prussian Blue (1704)</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">Formula:</strong> Fe₄[Fe(CN)₆]₃</li>
                      <li>• <strong className="text-white">Reagentlar:</strong> Fe³⁺ + [Fe(CN)₆]⁴⁻</li>
                      <li>• <strong className="text-white">Kashfiyotchi:</strong> Diesbach (1704)</li>
                      <li>• <strong className="text-white">Struktura:</strong> Fe³⁺−N≡C−Fe²⁺</li>
                    </ul>
                  </div>
                  <div className="bg-indigo-900/30 rounded-xl p-4 border border-indigo-700/30">
                    <h4 className="text-indigo-300 font-bold text-sm mb-2">🔵 Turnbull's Blue (1840)</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">Formula:</strong> Fe₃[Fe(CN)₆]₂</li>
                      <li>• <strong className="text-white">Reagentlar:</strong> Fe²⁺ + [Fe(CN)₆]³⁻</li>
                      <li>• <strong className="text-white">Kashfiyotchi:</strong> Turnbull (1840)</li>
                      <li>• <strong className="text-white">Struktura:</strong> Fe²⁺−N≡C−Fe³⁺</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-200 text-sm">
                    <strong className="text-yellow-300">Muhim:</strong> 1970-yillarda rentgen difraksiyasi orqali ikkalasi ham 
                    <strong className="text-white"> bir xil modda</strong> ekanligi isbotlandi! 
                    Reaktsiya paytida Fe²⁺ va Fe³⁺ tez almashinadi → bir xil struktura hosil bo'ladi.
                  </p>
                </div>
              </div>
            </div>

            {/* XULOSA */}
            <div className="bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-cyan-600/10 border border-blue-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>✅</span> Asosiy xulosalar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "🎨 <strong>Birinchi sintetik pigment:</strong> 1704 yilda Diesbach tomonidan tasodifan kashf etilgan",
                  "⚛️ <strong>Mixed-valence:</strong> Fe²⁺ va Fe³⁺ birgalikda — aralash valentli kompleks",
                  "🔗 <strong>Ko'prikli CN⁻:</strong> Fe²⁺−C≡N−Fe³⁺ — uglerod orqali bog'lanish",
                  "🎨 <strong>Rang mexanizmi:</strong> IVCT (Intervalence Charge Transfer) — elektron ko'chishi",
                  "💎 <strong>Kubik panjara:</strong> Fm3̄m simmetriya, 3D tarmoq",
                  "🏭 <strong>Qo'llanilish:</strong> pigment, tibbiyot (Tl/Cs detoksikatsiyasi), elektroxromizm",
                ].map((item, i) => (
                  <div 
                    key={i}
                    className="flex items-start gap-2 p-3 bg-purple-950/40 rounded-xl border border-purple-700/30 text-purple-200 text-sm"
                    dangerouslySetInnerHTML={{ __html: item }}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* STRUCTURE TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "structure" && (
          <>
            <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  🧬
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Kubik panjara strukturasi</h2>
              </div>
              
              <div className="bg-blue-950/60 rounded-xl p-5 font-mono text-sm text-blue-200 border border-blue-700/30 mb-6 text-center">
                <pre className="whitespace-pre">{`        Fe³⁺ --- N≡C --- Fe²⁺
          |                |
          |                |
        Fe²⁺ --- C≡N --- Fe³⁺
          |                |
          |                |
        Fe³⁺ --- N≡C --- Fe²⁺
        
   Kubik panjara: Fe²⁺ va Fe³⁺ navbatma-navbat
   Ko'prikli CN⁻: Fe−C≡N−Fe (uglerod orqali)
   
   Fm3̄m simmetriya (kubik, yuqori simmetriya)`}</pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-purple-400 font-bold text-sm uppercase tracking-wider">Geometrik parametrlar</h3>
                  <div className="space-y-2">
                    {[
                      ["Geometriya", "Kubik panjara"],
                      ["Fazoviy guruh", "Fm3̄m"],
                      ["Fe−C masofa", "1.92 Å (Fe²⁺−C)"],
                      ["Fe−N masofa", "2.03 Å (Fe³⁺−N)"],
                      ["C≡N masofa", "1.15 Å (uch bog')"],
                      ["Fe−Fe masofa", "5.07 Å (panjara parametri)"],
                      ["Koordinatsion son", "6 (har bir Fe uchun)"],
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-purple-800/30">
                        <span className="text-purple-300 text-sm">{item[0]}</span>
                        <span className="text-white font-semibold text-sm font-mono">{item[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-blue-400 font-bold text-sm uppercase tracking-wider">Kubik simmetriya (Fm3̄m)</h3>
                  <div className="space-y-2">
                    {[
                      ["E", "Ayniylik"],
                      ["4C₃", "Kub diagonallari bo'ylab"],
                      ["3C₄", "Kub qirralari bo'ylab"],
                      ["6C₂", "Qirra o'rtalari orqali"],
                      ["i", "Inversiya markazi"],
                      ["3σₕ", "Gorizontal tekisliklar"],
                      ["6σₐ", "Diagonal tekisliklar"],
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-1.5 border-b border-blue-800/30">
                        <span className="text-blue-300 text-sm font-mono font-bold">{item[0]}</span>
                        <span className="text-purple-200 text-xs">{item[1]}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-blue-950/50 rounded-xl p-3 border border-blue-700/30 mt-3">
                    <p className="text-blue-200 text-xs">
                      <strong className="text-blue-400">Jami:</strong> 48 ta simmetriya operatsiyasi — 
                      <strong className="text-yellow-300"> eng yuqori simmetriya!</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* PANJARA TUZILISHI */}
            <div className="bg-gradient-to-br from-indigo-900/40 to-cyan-900/40 border border-indigo-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-xl shadow-lg shadow-indigo-500/30">
                  💎
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">3D panjara tuzilishi</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-indigo-950/50 rounded-xl p-5 border border-indigo-700/30 text-center">
                  <div className="text-4xl mb-2">🔵</div>
                  <div className="text-indigo-400 text-xs uppercase mb-1">Fe²⁺ (temir II)</div>
                  <div className="text-white font-bold text-lg">6 ta C bilan</div>
                  <div className="text-purple-300 text-xs mt-1">Oktaedrik koordinatsiya</div>
                </div>
                <div className="bg-cyan-950/50 rounded-xl p-5 border border-cyan-700/30 text-center">
                  <div className="text-4xl mb-2">🔗</div>
                  <div className="text-cyan-400 text-xs uppercase mb-1">CN⁻ (ko'prik)</div>
                  <div className="text-white font-bold text-lg">Fe−C≡N−Fe</div>
                  <div className="text-purple-300 text-xs mt-1">Uglerod orqali bog'lanish</div>
                </div>
                <div className="bg-blue-950/50 rounded-xl p-5 border border-blue-700/30 text-center">
                  <div className="text-4xl mb-2">🔴</div>
                  <div className="text-blue-400 text-xs uppercase mb-1">Fe³⁺ (temir III)</div>
                  <div className="text-white font-bold text-lg">6 ta N bilan</div>
                  <div className="text-purple-300 text-xs mt-1">Oktaedrik koordinatsiya</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* MIXED VALENCE TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "mixedValence" && (
          <>
            <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  ⚛️
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Mixed-valence (aralash valentli) kompleks</h2>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border-2 border-purple-500/30 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-purple-400">Prussian Blue</strong> — bu 
                  <strong className="text-white"> mixed-valence (aralash valentli)</strong> kompleks.
                  Unda <strong className="text-blue-300">Fe²⁺</strong> va <strong className="text-red-300">Fe³⁺</strong> ionlari 
                  <strong className="text-yellow-300"> birgalikda</strong> mavjud. Bu noyob hodisa — 
                  ko'pchilik komplekslarda faqat bitta oksidlanish darajasi bo'ladi.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-950/50 rounded-xl p-5 border-2 border-blue-500/30">
                  <h3 className="text-blue-400 font-bold mb-3">🔵 Fe²⁺ (temir II)</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Oksidlanish darajasi:</strong> +2</p>
                    <p>• <strong className="text-white">Elektron konfiguratsiya:</strong> [Ar] 3d⁶</p>
                    <p>• <strong className="text-white">Koordinatsiya:</strong> 6 ta C atomi bilan</p>
                    <p>• <strong className="text-white">Bog'lanish:</strong> Fe²⁺−C≡N</p>
                    <p>• <strong className="text-white">Spin holati:</strong> Past spinli (LS)</p>
                    <p>• <strong className="text-white">Magnit:</strong> Diamagnit (t₂g⁶)</p>
                  </div>
                </div>

                <div className="bg-red-950/50 rounded-xl p-5 border-2 border-red-500/30">
                  <h3 className="text-red-400 font-bold mb-3">🔴 Fe³⁺ (temir III)</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Oksidlanish darajasi:</strong> +3</p>
                    <p>• <strong className="text-white">Elektron konfiguratsiya:</strong> [Ar] 3d⁵</p>
                    <p>• <strong className="text-white">Koordinatsiya:</strong> 6 ta N atomi bilan</p>
                    <p>• <strong className="text-white">Bog'lanish:</strong> Fe³⁺−N≡C</p>
                    <p>• <strong className="text-white">Spin holati:</strong> Past spinli (LS)</p>
                    <p>• <strong className="text-white">Magnit:</strong> Paramagnit (t₂g⁵, 1 unpaired e⁻)</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-5">
                <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Nima uchun mixed-valence muhim?
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Elektron ko'chishi:</strong> Fe²⁺ ↔ Fe³⁺ o'rtasida elektron almashinuvi mumkin</p>
                  <p>• <strong className="text-white">IVCT (Intervalence Charge Transfer):</strong> bu ko'chish yorug'lik yutilishiga olib keladi</p>
                  <p>• <strong className="text-yellow-300">Natija:</strong> Prussian Blue ning <strong className="text-blue-300">to'q ko'k rangi</strong></p>
                  <p className="text-xs text-purple-400 mt-2">
                    Bu hodisa <strong className="text-pink-300">Robin-Day tasnifi</strong> bo'yicha 
                    <strong className="text-white"> Class II mixed-valence</strong> kompleks hisoblanadi.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* COLOR TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "color" && (
          <>
            <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">
                  🎨
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Rang mexanizmi — IVCT</h2>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-2 border-blue-500/30 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-blue-400">Prussian Blue</strong> ning 
                  <strong className="text-yellow-300"> to'q ko'k rangi</strong> — bu 
                  <strong className="text-white"> IVCT (Intervalence Charge Transfer)</strong> hodisasi tufayli.
                  Fe²⁺ va Fe³⁺ o'rtasida <strong className="text-pink-300">elektron ko'chishi</strong> sodir bo'ladi,
                  bu esa <strong className="text-white">ko'rinadigan yorug'likni yutadi</strong>.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-950/50 rounded-xl p-5 border border-blue-700/30">
                  <h3 className="text-blue-400 font-bold mb-3">🔵 IVCT mexanizmi</h3>
                  <div className="bg-blue-900/40 rounded-lg p-4 font-mono text-xs text-blue-200 border border-blue-700/30 mb-3">
                    <pre className="whitespace-pre">{`  Fe²⁺ + Fe³⁺ + hν → Fe³⁺ + Fe²⁺
  
  Elektron ko'chishi:
  Fe²⁺ (d⁶) → Fe³⁺ (d⁵)
  
  Yorug'lik yutiladi (680 nm)`}</pre>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Fe²⁺ dan Fe³⁺ ga:</strong> elektron ko'chadi</p>
                    <p>• <strong className="text-white">Energiya:</strong> ~14,700 cm⁻¹ (680 nm)</p>
                    <p>• <strong className="text-white">Yutilish:</strong> qizil nur (680 nm)</p>
                    <p>• <strong className="text-blue-300">Natija:</strong> ko'k rang ko'rinadi</p>
                  </div>
                </div>

                <div className="bg-indigo-950/50 rounded-xl p-5 border border-indigo-700/30">
                  <h3 className="text-indigo-400 font-bold mb-3">🎨 Nima uchun ko'k?</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Yutilish:</strong> 680 nm (qizil nur)</p>
                    <p>• <strong className="text-white">Qo'shimcha rang:</strong> ko'k (qizilning qo'shimchasi)</p>
                    <p>• <strong className="text-white">Ko'rinadigan rang:</strong> to'q ko'k</p>
                    <p>• <strong className="text-white">Intensivlik:</strong> ε ≈ 1000 L·mol⁻¹·cm⁻¹</p>
                    <p className="text-xs text-indigo-300 mt-2">
                      <strong className="text-yellow-300">Muhim:</strong> IVCT — bu 
                      <strong className="text-white"> juda intensiv</strong> yutilish, 
                      shuning uchun Prussian Blue juda to'q ko'k rangda.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-5">
                <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Robin-Day tasnifi
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Class I:</strong> Lokalizatsiyalangan (elektron ko'chishi yo'q)</p>
                  <p>• <strong className="text-yellow-300">Class II:</strong> Qisman delokalizatsiya (Prussian Blue)</p>
                  <p>• <strong className="text-white">Class III:</strong> To'liq delokalizatsiya (metal-metal bog')</p>
                  <p className="text-xs text-purple-400 mt-2">
                    Prussian Blue — <strong className="text-pink-300">Class II mixed-valence</strong> kompleks,
                    ya'ni elektron <strong className="text-white">qisman delokalizatsiyalangan</strong>.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* BONDING TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "bonding" && (
          <>
            <div className="bg-gradient-to-br from-cyan-900/40 to-teal-900/40 border border-cyan-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-xl shadow-lg shadow-cyan-500/30">
                  🔗
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Ko'prikli CN⁻ bog'lanish</h2>
              </div>
              
              <div className="bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border-2 border-cyan-500/30 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-cyan-400">CN⁻ ligandi</strong> — bu 
                  <strong className="text-white"> ko'prikli ligand</strong>. U ikkita metallni 
                  <strong className="text-yellow-300"> bir vaqtda</strong> bog'laydi:
                  <strong className="text-blue-300"> Fe²⁺−C≡N−Fe³⁺</strong>.
                  Uglerod Fe²⁺ bilan, azot Fe³⁺ bilan bog'lanadi.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-cyan-950/50 rounded-xl p-5 border border-cyan-700/30">
                  <h3 className="text-cyan-400 font-bold mb-3">🔗 Fe²⁺−C bog'lanishi</h3>
                  <div className="bg-cyan-900/40 rounded-lg p-4 font-mono text-xs text-cyan-200 border border-cyan-700/30 mb-3">
                    <pre className="whitespace-pre">{`  Fe²⁺ ← C≡N
  
  σ-donatsiya: C → Fe²⁺
  π-backbonding: Fe²⁺ → C
  
  Kuchli bog' (1.92 Å)`}</pre>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Fe²⁺−C masofa:</strong> 1.92 Å</p>
                    <p>• <strong className="text-white">Bog' turi:</strong> σ + π</p>
                    <p>• <strong className="text-white">Bog' kuchi:</strong> kuchli</p>
                  </div>
                </div>

                <div className="bg-teal-950/50 rounded-xl p-5 border border-teal-700/30">
                  <h3 className="text-teal-400 font-bold mb-3">🔗 Fe³⁺−N bog'lanishi</h3>
                  <div className="bg-teal-900/40 rounded-lg p-4 font-mono text-xs text-teal-200 border border-teal-700/30 mb-3">
                    <pre className="whitespace-pre">{`  Fe³⁺ ← N≡C
  
  σ-donatsiya: N → Fe³⁺
  π-backbonding: kuchsiz
  
  O'rta bog' (2.03 Å)`}</pre>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Fe³⁺−N masofa:</strong> 2.03 Å</p>
                    <p>• <strong className="text-white">Bog' turi:</strong> asosan σ</p>
                    <p>• <strong className="text-white">Bog' kuchi:</strong> o'rta</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-5">
                <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Nima uchun C Fe²⁺ bilan, N Fe³⁺ bilan?
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Fe²⁺ (yumshoq kislota):</strong> C (yumshoq asos) bilan bog'lanadi</p>
                  <p>• <strong className="text-white">Fe³⁺ (qattiq kislota):</strong> N (qattiq asos) bilan bog'lanadi</p>
                  <p>• <strong className="text-yellow-300">HSAB prinsipi:</strong> yumshoq-yumshoq, qattiq-qattiq</p>
                  <p className="text-xs text-purple-400 mt-2">
                    Bu <strong className="text-pink-300">linkage izomeriya</strong> emas — 
                    bu <strong className="text-white">termodinamik barqaror</strong> konfiguratsiya.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* SPECTROSCOPY TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "spectroscopy" && (
          <>
            <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-xl shadow-lg shadow-green-500/30">
                  🔬
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Spektroskopik xususiyatlar</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-green-950/50 rounded-xl p-5 border border-green-700/30">
                  <h3 className="text-green-400 font-bold mb-3">🌈 UV-Vis spektroskopiya</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <div className="bg-green-900/40 rounded-lg p-3 border border-green-700/30">
                      <p className="text-green-300 font-bold text-xs mb-1">IVCT cho'qqisi</p>
                      <p className="text-xs">λ<sub>max</sub> = 680 nm (qizil nur)</p>
                      <p className="text-xs text-green-300">ε ≈ 1000 L·mol⁻¹·cm⁻¹</p>
                    </div>
                    <div className="bg-emerald-900/40 rounded-lg p-3 border border-emerald-700/30">
                      <p className="text-emerald-300 font-bold text-xs mb-1">LMCT cho'qqisi</p>
                      <p className="text-xs">λ<sub>max</sub> = 420 nm (ko'k nur)</p>
                      <p className="text-xs text-emerald-300">ε ≈ 500 L·mol⁻¹·cm⁻¹</p>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-950/50 rounded-xl p-5 border border-emerald-700/30">
                  <h3 className="text-emerald-400 font-bold mb-3">📡 IR spektroskopiya</h3>
                  <div className="space-y-2">
                    {[
                      { freq: "2160 cm⁻¹", bond: "ν(C≡N)", desc: "Ko'prikli CN (kuchli)", intensity: "Juda kuchli" },
                      { freq: "2080 cm⁻¹", bond: "ν(C≡N)", desc: "Terminal CN (kuchsiz)", intensity: "O'rta" },
                      { freq: "590 cm⁻¹", bond: "ν(Fe−C)", desc: "Fe²⁺−C bog'", intensity: "Kuchli" },
                      { freq: "510 cm⁻¹", bond: "ν(Fe−N)", desc: "Fe³⁺−N bog'", intensity: "Kuchli" },
                    ].map((item, i) => (
                      <div key={i} className="bg-emerald-900/40 rounded-lg p-2 border border-emerald-700/30">
                        <div className="flex justify-between items-center">
                          <span className="text-emerald-400 font-mono text-xs">{item.freq}</span>
                          <span className="text-white text-xs">{item.bond}</span>
                        </div>
                        <p className="text-purple-300 text-[10px] mt-0.5">{item.desc} • {item.intensity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-5">
                <h3 className="text-green-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Mössbauer spektroskopiya
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">⁵⁷Fe Mössbauer:</strong> Fe²⁺ va Fe³⁺ ni ajratish</p>
                  <p>• <strong className="text-white">Fe²⁺:</strong> δ = 0.05 mm/s, ΔE<sub>Q</sub> = 0.45 mm/s</p>
                  <p>• <strong className="text-white">Fe³⁺:</strong> δ = 0.40 mm/s, ΔE<sub>Q</sub> = 0.15 mm/s</p>
                  <p className="text-xs text-purple-400 mt-2">
                    <strong className="text-yellow-300">Muhim:</strong> Mössbauer — bu 
                    <strong className="text-pink-300"> mixed-valence</strong> ni isbotlashning eng kuchli usuli!
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* APPLICATIONS TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "applications" && (
          <>
            <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 border border-amber-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-xl shadow-lg shadow-amber-500/30">
                  🏭
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Sanoat va ilmiy qo'llanilish</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-amber-950/50 rounded-xl p-5 border border-amber-700/30">
                  <h3 className="text-amber-400 font-bold mb-3">🎨 Pigment</h3>
                  <div className="space-y-3 text-sm text-purple-200">
                    <div className="bg-amber-900/40 rounded-lg p-3 border border-amber-700/30">
                      <p className="text-amber-300 font-bold text-xs mb-1">Tarixiy pigment</p>
                      <p className="text-xs">1704 yildan beri ishlatiladi — birinchi sintetik pigment</p>
                    </div>
                    <div className="bg-amber-900/40 rounded-lg p-3 border border-amber-700/30">
                      <p className="text-amber-300 font-bold text-xs mb-1">Zamonaviy qo'llanilish</p>
                      <p className="text-xs">Bo'yoqlar, siyoh, rangli qog'oz, san'at</p>
                    </div>
                    <div className="bg-amber-900/40 rounded-lg p-3 border border-amber-700/30">
                      <p className="text-amber-300 font-bold text-xs mb-1">Afzalliklari</p>
                      <p className="text-xs">Arzon, barqaror, intensiv rang</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-950/50 rounded-xl p-5 border border-orange-700/30">
                  <h3 className="text-orange-400 font-bold mb-3">⚕️ Tibbiyot</h3>
                  <div className="space-y-3 text-sm text-purple-200">
                    <div className="bg-orange-900/40 rounded-lg p-3 border border-orange-700/30">
                      <p className="text-orange-300 font-bold text-xs mb-1">Radiogardase®</p>
                      <p className="text-xs">Tl va Cs zaharlanishini davolash</p>
                    </div>
                    <div className="bg-orange-900/40 rounded-lg p-3 border border-orange-700/30">
                      <p className="text-orange-300 font-bold text-xs mb-1">Mexanizm</p>
                      <p className="text-xs">Tl⁺ va Cs⁺ ionlarini bog'laydi, chiqarilishini tezlashtiradi</p>
                    </div>
                    <div className="bg-orange-900/40 rounded-lg p-3 border border-orange-700/30">
                      <p className="text-orange-300 font-bold text-xs mb-1">FDA tasdiqlagan</p>
                      <p className="text-xs">2003 yilda tasdiqlangan</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-amber-900/40 rounded-lg p-3 border border-amber-700/30">
                  <p className="text-amber-300 font-bold text-xs mb-1">⚡ Elektroxromizm</p>
                  <p className="text-xs text-purple-200">Smart oynalar, displyelar</p>
                </div>
                <div className="bg-amber-900/40 rounded-lg p-3 border border-amber-700/30">
                  <p className="text-amber-300 font-bold text-xs mb-1">🔋 Batareyalar</p>
                  <p className="text-xs text-purple-200">Litiy-ion batareyalar katodi</p>
                </div>
                <div className="bg-amber-900/40 rounded-lg p-3 border border-amber-700/30">
                  <p className="text-amber-300 font-bold text-xs mb-1">🧲 Magnit materiallar</p>
                  <p className="text-xs text-purple-200">Ferrimagnit xususiyatlar</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* SYNTHESIS TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "synthesis" && (
          <>
            <div className="bg-gradient-to-br from-green-900/40 to-teal-900/40 border border-green-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-xl shadow-lg shadow-green-500/30">
                  ⚗️
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Sintez usullari</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-green-950/50 rounded-2xl p-5 border border-green-700/30">
                  <h3 className="text-green-400 font-bold mb-3">1-usul: Prussian Blue (klassik)</h3>
                  <div className="bg-green-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-green-300 border border-green-700/30">
                    <p>4 Fe³⁺ + 3 [Fe(CN)₆]⁴⁻ → Fe₄[Fe(CN)₆]₃↓</p>
                    <p className="text-green-300 text-xs mt-2">Suvli eritma, xona harorati</p>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Mexanizm:</strong> Fe³⁺ va [Fe(CN)₆]⁴⁻ reaktsiyasi → ko'k cho'kma</p>
                    <p><strong className="text-white">Sharoit:</strong> Suvli eritma, xona harorati</p>
                    <p><strong className="text-white">Vaqt:</strong> Darhol (bir necha soniya)</p>
                    <p><strong className="text-white">Hosildorlik:</strong> 95%+</p>
                    <p><strong className="text-white">Tozalash:</strong> Filtrlash, yuvish, quritish</p>
                  </div>
                </div>

                <div className="bg-green-950/50 rounded-2xl p-5 border border-green-700/30">
                  <h3 className="text-green-400 font-bold mb-3">2-usul: Turnbull's Blue</h3>
                  <div className="bg-green-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-green-300 border border-green-700/30">
                    <p>3 Fe²⁺ + 2 [Fe(CN)₆]³⁻ → Fe₃[Fe(CN)₆]₂↓</p>
                    <p className="text-green-300 text-xs mt-2">Suvli eritma, xona harorati</p>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Mexanizm:</strong> Fe²⁺ va [Fe(CN)₆]³⁻ reaktsiyasi → ko'k cho'kma</p>
                    <p><strong className="text-white">Muhim:</strong> Natija Prussian Blue bilan bir xil!</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* HISTORY TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "history" && (
          <>
            <div className="bg-gradient-to-br from-yellow-900/40 to-amber-900/40 border border-yellow-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center text-xl shadow-lg shadow-yellow-500/30">
                  🏆
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Tasodifiy kashfiyot (1704)</h2>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-2xl p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-yellow-600 to-amber-600 flex items-center justify-center text-6xl flex-shrink-0 shadow-2xl">
                    👨‍🔬
                  </div>
                  <div className="flex-1">
                    <h3 className="text-yellow-400 font-bold text-xl mb-2">Johann Jacob Diesbach (1670-1730)</h3>
                    <p className="text-purple-200 text-sm mb-3 leading-relaxed">
                      <strong className="text-yellow-300">1704 yilda</strong> Berlinlik bo'yoqchi Diesbach 
                      <strong className="text-white"> tasodifan</strong> Prussian Blue ni kashf qildi.
                      U qizil bo'yoq tayyorlayotgan edi, lekin <strong className="text-pink-300">ifloslangan potash</strong> ishlatdi — 
                      natijada <strong className="text-blue-300">ko'k cho'kma</strong> hosil bo'ldi!
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-xs text-yellow-300 font-semibold">
                        📜 1704 yil
                      </span>
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-xs text-amber-300 font-semibold">
                        📍 Berlin
                      </span>
                      <span className="px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-xs text-orange-300 font-semibold">
                        🎨 Birinchi sintetik pigment
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { year: "1704", title: "Diesbach kashfiyoti", desc: "Tasodifan Prussian Blue ni kashf qildi — ifloslangan potash ishlatdi" },
                  { year: "1724", title: "Woodward tahlili", desc: "John Woodward Prussian Blue ni tahlil qildi va temir borligini aniqladi" },
                  { year: "1840", title: "Turnbull's Blue", desc: "Turnbull Fe²⁺ + [Fe(CN)₆]³⁻ reaktsiyasidan ko'k cho'kma oldi" },
                  { year: "1970+", title: "Strukturani aniqlash", desc: "Rentgen difraksiyasi: Prussian Blue va Turnbull's Blue bir xil modda!" },
                  { year: "2003", title: "FDA tasdiqlashi", desc: "Radiogardase® (Prussian Blue) Tl/Cs zaharlanishi uchun tasdiqlandi" },
                ].map((item, i) => (
                  <div key={i} className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-to-br from-yellow-500 to-amber-500 text-black font-bold px-3 py-1 rounded-lg text-sm flex-shrink-0">
                        {item.year}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-yellow-400 font-bold mb-1">{item.title}</h3>
                        <p className="text-purple-200 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* NIMA UCHUN MUHIM */}
              <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-2 border-yellow-500/30 rounded-2xl p-5 mt-6">
                <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                  <span>💡</span> Nima uchun Prussian Blue kimyo tarixida muhim?
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Birinchi sintetik pigment:</strong> tabiiy pigmentlardan farqli o'laroq, sun'iy yaratilgan</p>
                  <p>• <strong className="text-white">Mixed-valence:</strong> Fe²⁺ va Fe³⁺ birgalikda — noyob hodisa</p>
                  <p>• <strong className="text-white">Tasodifiy kashfiyot:</strong> ifloslangan reagentlar tufayli</p>
                  <p>• <strong className="text-white">300+ yillik tarix:</strong> 1704 yildan beri ishlatiladi</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══ NAVIGATSIYA ═══ */}
        <div className="flex flex-col md:flex-row justify-between gap-4 pt-8">
          <Link 
            href="/ilmiy/birikmalar"
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-semibold transition-all flex items-center justify-center gap-2"
          >
            <span>←</span>
            <span>Bazaga qaytish</span>
          </Link>
          
          <div className="flex gap-3">
            <Link 
              href="/ilmiy/birikmares/k4-fe-cn-6"
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold transition-all flex items-center gap-2"
            >
              <span>←</span>
              <span className="hidden sm:inline">K₄[Fe(CN)₆]</span>
            </Link>
            <Link 
              href="/ilmiy/birikmares/k3-fe-cn-6"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white font-bold transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2"
            >
              <span className="hidden sm:inline">K₃[Fe(CN)₆]</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  )
}