"use client"

import Link from "next/link"
import { useState } from "react"

export default function Gemoglobin() {
  const [activeTab, setActiveTab] = useState("overview")
  const [oxygenated, setOxygenated] = useState(true) // oxy vs deoxy

  const tabs = [
    { id: "overview", label: "📋 Umumiy", icon: "📋" },
    { id: "structure", label: "🧬 Gem strukturasi", icon: "🧬" },
    { id: "electronic", label: "⚛️ Elektron (d⁶)", icon: "⚛️" },
    { id: "binding", label: "🫁 O₂ bog'lanish", icon: "🫁" },
    { id: "cooperative", label: "🔄 Kooperativ bog'lanish", icon: "🔄" },
    { id: "color", label: "🎨 Rang mexanizmi", icon: "🎨" },
    { id: "spectroscopy", label: "🔬 Spektroskopiya", icon: "🔬" },
    { id: "physiology", label: "🏥 Fiziologiya", icon: "🏥" },
    { id: "pathology", label: "⚕️ Kasalliklar", icon: "⚕️" },
    { id: "history", label: "🏆 Tarix", icon: "🏆" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white relative overflow-hidden">
      
      {/* ═══ ANIMATED BACKGROUND ═══ */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(239,68,68,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        {['Fe²⁺', 'Por', 'His', 'O₂', 'd⁶', 'Hemoglobin', 'O₂ transport', 'Perutz 1962', 'kooperativ'].map((sym, i) => (
          <div
            key={i}
            className="absolute text-red-400/5 font-mono font-bold select-none pointer-events-none"
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
            <span className="text-red-400 font-semibold">[Fe(Por)(His)(O₂)]</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 text-[10px] text-red-300 font-bold uppercase tracking-wider">
                  🫁 Hayot uchun zarur
                </span>
                <span className="px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-[10px] text-blue-300 font-semibold">
                  🏆 Nobel 1962
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] text-emerald-300 font-semibold">
                  🧬 Biologik kompleks
                </span>
                <span className="px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-[10px] text-purple-300 font-semibold">
                  🔄 Kooperativ bog'lanish
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-red-400 via-pink-400 to-purple-300 bg-clip-text text-transparent">
                [Fe(Por)(His)(O₂)]
              </h1>
              <p className="text-purple-300 text-sm mt-1">
                Oksigemoglobin • Hemoglobin faol markazi • Oxygenated hemoglobin
              </p>
            </div>
            
            {/* OXY/DEOXY SWITCHER */}
            <div className="flex gap-2">
              <button
                onClick={() => setOxygenated(!oxygenated)}
                className={`px-4 py-2 rounded-xl border-2 transition-all flex items-center gap-2 ${
                  oxygenated
                    ? 'bg-red-500/20 border-red-500/50 text-red-300'
                    : 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                }`}
              >
                <span className="text-xl">{oxygenated ? '🔴' : '🔵'}</span>
                <span className="hidden sm:inline">{oxygenated ? 'Oxyhemoglobin' : 'Deoxyhemoglobin'}</span>
                <span className="sm:hidden">{oxygenated ? 'Oxy' : 'Deoxy'}</span>
              </button>
              <Link 
                href="/ilmiy/birikmalar/k3-fe-cn-6"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 hover:border-red-400/60 text-red-300 text-sm font-semibold transition-all flex items-center gap-2"
              >
                <span>🔴</span>
                <span className="hidden sm:inline">K₃[Fe(CN)₆]</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ═══ QUICK STATS BAR ═══ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Formula", value: "[Fe(Por)(His)(O₂)]", icon: "🧪", color: "text-red-400" },
            { label: "Oqsil massasi", value: "~64,500 Da", icon: "⚖️", color: "text-blue-400" },
            { label: "Geometriya", value: "Oktaedrik (buzilgan)", icon: "💎", color: "text-purple-400" },
            { label: "Rangi", value: oxygenated ? "Qizil (arterial)" : "Ko'k-qizil (venoz)", icon: "🎨", color: oxygenated ? "text-red-400" : "text-blue-400" },
            { label: "Elektronlar", value: "d⁶ (Fe²⁺)", icon: "⚛️", color: "text-emerald-400" },
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
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/30'
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
            <div className="bg-gradient-to-br from-purple-900/40 to-red-900/40 border border-red-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-xl shadow-lg shadow-red-500/30">
                  📋
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Asosiy ma'lumotlar — Gemoglobin</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  ["Oqsil nomi", "Gemoglobin (Hb)"],
                  ["Subbirlar", "α₂β₂ (tetramer)"],
                  ["Har bir subbir", "~16 kDa"],
                  ["Gem guruhlar", "4 ta (har subbirda)"],
                  ["Koordinatsion son", "6 (Fe²⁺ uchun)"],
                  ["Ligandlar", "4N(Por) + 1N(His) + 1O₂"],
                  ["O₂ affinligi", "P₅₀ ≈ 26 mmHg"],
                  ["Hill koeffitsienti", "n ≈ 2.8-3.0"],
                ].map((item, i) => (
                  <div key={i} className="bg-red-950/50 rounded-xl p-3 border border-red-700/30">
                    <div className="text-[10px] uppercase tracking-wider text-red-400 font-semibold mb-1">{item[0]}</div>
                    <div className="text-white font-semibold text-sm">{item[1]}</div>
                  </div>
                ))}
              </div>

              {/* FAOL MARKAZ */}
              <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-2xl p-5">
                <h3 className="text-red-400 font-bold mb-3 flex items-center gap-2">
                  <span>🎯</span> Gemoglobin faol markazi
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-red-900/30 rounded-xl p-4 border border-red-700/30">
                    <h4 className="text-red-300 font-bold text-sm mb-2">🔬 Gem guruhi (porfirin)</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">Fe²⁺</strong> — markaziy ion (d⁶)</li>
                      <li>• <strong className="text-white">Porfirin (Por)</strong> — tetradentat ligand (4 ta N)</li>
                      <li>• <strong className="text-white">Protoporfirin IX</strong> — o'ziga xos halqa</li>
                      <li>• <strong className="text-white">Koordinatsion son:</strong> 4 (porfirin) + 1 (His) + 1 (O₂) = <strong>6</strong></li>
                    </ul>
                  </div>
                  <div className="bg-pink-900/30 rounded-xl p-4 border border-pink-700/30">
                    <h4 className="text-pink-300 font-bold text-sm mb-2">🧬 Oqsil muhiti</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">Proksimal His (F8)</strong> — Fe ga bog'langan (5-pozitsiya)</li>
                      <li>• <strong className="text-white">Distal His (E7)</strong> — O₂ bilan H-bog' hosil qiladi</li>
                      <li>• <strong className="text-white">Oksigenatsiya:</strong> Fe²⁺ + O₂ → Fe²⁺−O₂</li>
                      <li>• <strong className="text-white">O₂ transport:</strong> o'pkadan to'qimalarga</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* XULOSA */}
            <div className="bg-gradient-to-r from-red-600/10 via-pink-600/10 to-purple-600/10 border border-red-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>✅</span> Asosiy xulosalar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "🫁 <strong>O₂ transport:</strong> Gemoglobin o'pkadan to'qimalarga kislorod tashiydi",
                  "⚛️ <strong>Fe²⁺ (d⁶):</strong> Oksigenatsiyada Fe²⁺ saqlanadi (Fe³⁺ emas!)",
                  "🔄 <strong>Kooperativ bog'lanish:</strong> Birinchi O₂ bog'langach, keyingilari osonroq (Hill n ≈ 2.8)",
                  "🎨 <strong>Rang o'zgarishi:</strong> Oxy (qizil) ↔ Deoxy (ko'k-qizil)",
                  "🧬 <strong>T- va R-holatlar:</strong> Deoxy (T, tense) ↔ Oxy (R, relaxed)",
                  "🏆 <strong>Nobel 1962:</strong> Perutz va Kendrew — oqsil strukturasi",
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
            <div className="bg-gradient-to-br from-purple-900/40 to-red-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-red-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  🧬
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Gem strukturasi — porfirin halqasi</h2>
              </div>
              
              <div className="bg-red-950/60 rounded-xl p-5 font-mono text-sm text-red-200 border border-red-700/30 mb-6 text-center">
                <pre className="whitespace-pre">{`           N
          /   \\
    N — Fe — N    ← Porfirin (4 ta N)
          \\   /
           N
           |
          His (F8)  ← Proksimal histidin
           |
          O₂       ← Kislorod (faqat oxy holda)
          
   Oktaedrik: Fe²⁺ markazda, 6 ta ligand
   4 ta N (porfirin) + 1 ta N (His) + 1 ta O₂`}</pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-purple-400 font-bold text-sm uppercase tracking-wider">Geometrik parametrlar</h3>
                  <div className="space-y-2">
                    {[
                      ["Geometriya", "Oktaedrik (buzilgan)"],
                      ["Fe−N(Por) masofa", "2.05 Å (4 ta, ekvatorial)"],
                      ["Fe−N(His) masofa", "2.15 Å (aksial)"],
                      ["Fe−O₂ masofa", "1.8 Å (aksial, oxy)"],
                      ["Fe−O−O burchak", "≈ 120° (egilgan)"],
                      ["Porfirin tekisligi", "Fe 0.4 Å yuqorida (deoxy)"],
                      ["Oqsil massasi", "~64,500 Da (tetramer)"],
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-purple-800/30">
                        <span className="text-purple-300 text-sm">{item[0]}</span>
                        <span className="text-white font-semibold text-sm font-mono">{item[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-red-400 font-bold text-sm uppercase tracking-wider">Oqsil subbirlari</h3>
                  <div className="space-y-3">
                    <div className="bg-red-900/30 rounded-xl p-4 border border-red-700/30">
                      <h4 className="text-red-300 font-bold text-sm mb-2">🧬 Tetramer strukturasi (α₂β₂)</h4>
                      <div className="space-y-2 text-sm text-purple-200">
                        <p>• <strong className="text-white">2 ta α-subbir:</strong> 141 aminokislota har biri</p>
                        <p>• <strong className="text-white">2 ta β-subbir:</strong> 146 aminokislota har biri</p>
                        <p>• <strong className="text-white">Har bir subbirda:</strong> 1 ta gem guruhi</p>
                        <p>• <strong className="text-white">Jami:</strong> 4 ta O₂ bog'lash joyi</p>
                      </div>
                    </div>
                    <div className="bg-pink-900/30 rounded-xl p-4 border border-pink-700/30">
                      <h4 className="text-pink-300 font-bold text-sm mb-2">🔬 Ikki holat</h4>
                      <div className="space-y-2 text-sm text-purple-200">
                        <p>• <strong className="text-blue-300">T-holat (Tense):</strong> Deoxy, past affinlik</p>
                        <p>• <strong className="text-red-300">R-holat (Relaxed):</strong> Oxy, yuqori affinlik</p>
                        <p>• <strong className="text-white">O'tish:</strong> Kooperativ bog'lanish</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* ELECTRONIC TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "electronic" && (
          <>
            <div className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border border-emerald-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-xl shadow-lg shadow-emerald-500/30">
                  ⚛️
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Elektron tuzilishi — Fe²⁺ (d⁶)</h2>
              </div>
              
              <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border-2 border-red-500/30 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-red-400">Muhim:</strong> Gemoglobinda Fe <strong className="text-yellow-300">+2 oksidlanish darajasida</strong> (Fe²⁺, d⁶).
                  Agar Fe³⁺ ga oksidlansa (methemoglobin), O₂ bog'lay olmaydi — bu <strong className="text-red-300">patologik holat</strong>.
                  Oksigenatsiyada Fe²⁺ <strong className="text-white">saqlanadi</strong>, lekin elektron zichligi O₂ ga siljiydi.
                </p>
              </div>

              {/* ELEKTRON HISOB */}
              <div className="bg-emerald-950/50 rounded-2xl p-6 border border-emerald-700/30 mb-6">
                <h3 className="text-emerald-400 font-bold mb-4">[Fe(Por)(His)(O₂)] uchun elektron hisobi</h3>
                <div className="space-y-3">
                  <div className="bg-emerald-900/40 rounded-xl p-4 border border-emerald-700/30 flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold">Fe²⁺ (temir)</div>
                      <div className="text-purple-300 text-xs mt-1">
                        Konfiguratsiya: [Ar] 3d⁶ → 6 ta valent elektron
                      </div>
                    </div>
                    <div className="text-emerald-300 text-2xl font-bold font-mono">6 e⁻</div>
                  </div>
                  <div className="bg-emerald-900/40 rounded-xl p-4 border border-emerald-700/30 flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold">4 × N (porfirin)</div>
                      <div className="text-purple-300 text-xs mt-1">
                        Har bir N 2 ta elektron beradi (σ-donor)
                      </div>
                    </div>
                    <div className="text-emerald-300 text-2xl font-bold font-mono">4 × 2 = 8 e⁻</div>
                  </div>
                  <div className="bg-emerald-900/40 rounded-xl p-4 border border-emerald-700/30 flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold">1 × N (His)</div>
                      <div className="text-purple-300 text-xs mt-1">
                        Histidin N donori (σ-donor)
                      </div>
                    </div>
                    <div className="text-emerald-300 text-2xl font-bold font-mono">2 e⁻</div>
                  </div>
                  <div className="bg-emerald-900/40 rounded-xl p-4 border border-emerald-700/30 flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold">1 × O₂</div>
                      <div className="text-purple-300 text-xs mt-1">
                        O₂ (σ-donor + π-akseptor)
                      </div>
                    </div>
                    <div className="text-emerald-300 text-2xl font-bold font-mono">2 e⁻</div>
                  </div>
                  <div className="bg-yellow-900/40 rounded-xl p-4 border-2 border-yellow-500/30 flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold text-lg">JAMI</div>
                      <div className="text-yellow-300 text-xs mt-1">
                        18 elektron qoidasi bajarildi ✓
                      </div>
                    </div>
                    <div className="text-yellow-300 text-3xl font-bold font-mono">18 e⁻</div>
                  </div>
                </div>
              </div>

              {/* OXY vs DEOXY */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-950/50 rounded-xl p-5 border-2 border-red-500/30">
                  <h3 className="text-red-400 font-bold mb-3">🔴 Oxyhemoglobin</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Fe²⁺ holati:</strong> Past spinli (LS)</p>
                    <p>• <strong className="text-white">Konfiguratsiya:</strong> t₂g⁶ e₉⁰</p>
                    <p>• <strong className="text-white">O₂ bog'lanish:</strong> σ-donatsiya + π-backbonding</p>
                    <p>• <strong className="text-white">Fe−O−O burchak:</strong> ≈ 120° (egilgan)</p>
                    <p>• <strong className="text-white">Magnit:</strong> Diamagnit</p>
                  </div>
                </div>

                <div className="bg-blue-950/50 rounded-xl p-5 border-2 border-blue-500/30">
                  <h3 className="text-blue-400 font-bold mb-3">🔵 Deoxyhemoglobin</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Fe²⁺ holati:</strong> Yuqori spinli (HS)</p>
                    <p>• <strong className="text-white">Konfiguratsiya:</strong> t₂g⁴ e₉²</p>
                    <p>• <strong className="text-white">O₂ bog'lanish:</strong> yo'q</p>
                    <p>• <strong className="text-white">Fe joylashuvi:</strong> porfirin tekisligidan 0.4 Å yuqorida</p>
                    <p>• <strong className="text-white">Magnit:</strong> Paramagnit (4 unpaired e⁻)</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* BINDING TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "binding" && (
          <>
            <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">
                  🫁
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">O₂ bog'lanish mexanizmi</h2>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-blue-400">O₂ bog'lanishi</strong> — bu <strong className="text-white">qaytar jarayon</strong>.
                  O'pkada (yuqori pO₂) gemoglobin O₂ ni bog'laydi, to'qimalarda (past pO₂) esa chiqaradi.
                  Bu <strong className="text-yellow-300">Fe²⁺ ning +3 ga oksidlanishi emas</strong> — faqat koordinatsion bog'lanish.
                </p>
              </div>

              {/* BOG'LANISH BOSQICHLARI */}
              <div className="space-y-3 mb-6">
                {[
                  { step: "1", title: "Deoxy holat (T-holat)", desc: "Fe²⁺ yuqori spinli, porfirin tekisligidan 0.4 Å yuqorida. Proksimal His (F8) bog'langan, lekin O₂ yo'q.", color: "blue" },
                  { step: "2", title: "O₂ yaqinlashadi", desc: "O₂ distal His (E7) orqali kirib, Fe²⁺ ga yaqinlashadi. Distal His H-bog' orqali O₂ ni yo'naltiradi.", color: "cyan" },
                  { step: "3", title: "Fe−O₂ bog'lanish", desc: "O₂ Fe²⁺ bilan σ-donatsiya + π-backbonding orqali bog'lanadi. Fe²⁺ past spinli holatga o'tadi.", color: "emerald" },
                  { step: "4", title: "Fe harakati", desc: "Fe²⁺ porfirin tekisligiga tushadi (0.4 Å → 0 Å). Bu proksimal His ni tortadi.", color: "yellow" },
                  { step: "5", title: "Oqsil konformatsiyasi o'zgaradi", desc: "Proksimal His harakati butun oqsilni T-holatdan R-holatga o'tkazadi (allosterik o'zgarish).", color: "orange" },
                  { step: "6", title: "Kooperativ effekt", desc: "Bir subbirdagi o'zgarish boshqa subbirlarning O₂ affinligini oshiradi (Hill n ≈ 2.8).", color: "red" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-${item.color}-500 to-${item.color}-700 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg`}>
                      {item.step}
                    </div>
                    <div className={`flex-1 bg-${item.color}-950/50 rounded-xl p-4 border border-${item.color}-700/30`}>
                      <h3 className={`text-${item.color}-400 font-bold mb-1`}>{item.title}</h3>
                      <p className="text-purple-200 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* DISTAL HIS ROLI */}
              <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-2 border-blue-500/30 rounded-2xl p-5">
                <h3 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
                  <span>🎯</span> Distal Histidin (E7) ning muhim roli
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Sterik to'siq:</strong> CO (karbon monoksid) kabi kuchli ligandlarning bog'lanishini cheklaydi</p>
                  <p>• <strong className="text-white">H-bog' hosil qilish:</strong> O₂ bilan H-bog' orqali bog'lanishni mustahkamlaydi</p>
                  <p>• <strong className="text-white">Selektivlik:</strong> O₂ ni CO dan afzal ko'rish (20,000× dan 200× gacha kamaytiradi)</p>
                  <p className="text-xs text-purple-400 mt-2">
                    <strong className="text-yellow-300">Muhim:</strong> Agar distal His bo'lmasa, CO affinligi 20,000× oshar edi — 
                    bu esa <strong className="text-red-300">zaharli</strong> bo'lar edi (CO zaharlanishi).
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* COOPERATIVE TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "cooperative" && (
          <>
            <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  🔄
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Kooperativ bog'lanish — Hill tenglamasi</h2>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-purple-400">Kooperativ bog'lanish</strong> — bu gemoglobinining 
                  <strong className="text-white"> eng muhim xususiyati</strong>. Birinchi O₂ bog'langach, 
                  qolgan 3 ta joyning affinligi <strong className="text-yellow-300">oshadi</strong>.
                  Bu <strong className="text-white">sigmoidal (S-shaklli)</strong> oksigenatsiya egri chizig'ini hosil qiladi.
                </p>
              </div>

              {/* HILL TENGLAMASI */}
              <div className="bg-purple-950/50 rounded-2xl p-5 border border-purple-700/30 mb-6">
                <h3 className="text-purple-400 font-bold mb-3">Hill tenglamasi</h3>
                <div className="bg-purple-900/60 rounded-xl p-4 font-mono text-sm text-purple-200 border border-purple-700/30 mb-4 text-center">
                  <p>Y = (pO₂)ⁿ / [P₅₀ⁿ + (pO₂)ⁿ]</p>
                  <p className="mt-2">Y = oksigenatsiya darajasi (0-1)</p>
                  <p>pO₂ = kislorod parsial bosimi</p>
                  <p>P₅₀ = 50% oksigenatsiya uchun pO₂ (≈ 26 mmHg)</p>
                  <p className="text-yellow-300 mt-2 font-bold">n = Hill koeffitsienti (≈ 2.8-3.0)</p>
                </div>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">n = 1:</strong> Kooperativlik yo'q (mioglobin kabi)</p>
                  <p>• <strong className="text-white">n = 4:</strong> Mukammal kooperativlik (nazariy)</p>
                  <p>• <strong className="text-yellow-300">n ≈ 2.8-3.0:</strong> Gemoglobin (haqiqiy)</p>
                </div>
              </div>

              {/* MIOGLOBIN vs GEMOGLOBIN */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-pink-950/50 rounded-xl p-5 border border-pink-700/30">
                  <h3 className="text-pink-400 font-bold mb-3">🦵 Mioglobin (Mb)</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Struktura:</strong> Monomer (1 subbir)</p>
                    <p>• <strong className="text-white">O₂ joylari:</strong> 1 ta</p>
                    <p>• <strong className="text-white">Kooperativlik:</strong> yo'q (n = 1)</p>
                    <p>• <strong className="text-white">P₅₀:</strong> ≈ 2.8 mmHg (yuqori affinlik)</p>
                    <p>• <strong className="text-white">Egri chiziq:</strong> Giperbola</p>
                    <p>• <strong className="text-white">Vazifasi:</strong> O₂ ni saqlash (muskullarda)</p>
                  </div>
                </div>

                <div className="bg-red-950/50 rounded-xl p-5 border-2 border-red-500/30">
                  <h3 className="text-red-400 font-bold mb-3">🩸 Gemoglobin (Hb) ← Siz</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Struktura:</strong> Tetramer (α₂β₂)</p>
                    <p>• <strong className="text-white">O₂ joylari:</strong> 4 ta</p>
                    <p>• <strong className="text-white">Kooperativlik:</strong> ha (n ≈ 2.8)</p>
                    <p>• <strong className="text-white">P₅₀:</strong> ≈ 26 mmHg (past affinlik)</p>
                    <p>• <strong className="text-white">Egri chiziq:</strong> Sigmoidal (S-shaklli)</p>
                    <p>• <strong className="text-white">Vazifasi:</strong> O₂ transport (qonda)</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-5">
                <h3 className="text-purple-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Nega kooperativlik muhim?
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">O'pkada (pO₂ ≈ 100 mmHg):</strong> Hb 98% to'yingan → O₂ ni samarali oladi</p>
                  <p>• <strong className="text-white">To'qimalarda (pO₂ ≈ 40 mmHg):</strong> Hb 75% to'yingan → O₂ ni 23% chiqaradi</p>
                  <p>• <strong className="text-yellow-300">Natija:</strong> Sigmoidal egri chiziq O₂ ni <strong>samarali tashish</strong> imkonini beradi</p>
                  <p className="text-xs text-purple-400 mt-2">
                    Agar Hb mioglobin kabi bo'lsa (giperbola), u O₂ ni samarali chiqara olmas edi — 
                    to'qimalar <strong className="text-red-300">gipoksiya</strong>ga duchor bo'lar edi.
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
            <div className="bg-gradient-to-br from-red-900/40 to-pink-900/40 border border-red-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-xl shadow-lg shadow-red-500/30">
                  🎨
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Rang mexanizmi — nima uchun qon qizil?</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-red-950/50 rounded-xl p-5 border-2 border-red-500/30">
                  <h3 className="text-red-400 font-bold mb-3">🔴 Oxyhemoglobin (arterial qon)</h3>
                  <div className="bg-red-900/60 rounded-lg p-4 h-20 mb-3 flex items-center justify-center">
                    <div className="w-full h-full bg-gradient-to-r from-red-600 to-red-700 rounded"></div>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Rang:</strong> Yorqin qizil</p>
                    <p>• <strong className="text-white">Sabab:</strong> Fe²⁺ past spinli (LS)</p>
                    <p>• <strong className="text-white">λ<sub>max</sub>:</strong> 540 nm va 576 nm</p>
                    <p>• <strong className="text-white">Yutilish:</strong> yashil-ko'k nur → qizil ko'rinadi</p>
                  </div>
                </div>

                <div className="bg-blue-950/50 rounded-xl p-5 border-2 border-blue-500/30">
                  <h3 className="text-blue-400 font-bold mb-3">🔵 Deoxyhemoglobin (venoz qon)</h3>
                  <div className="bg-blue-900/60 rounded-lg p-4 h-20 mb-3 flex items-center justify-center">
                    <div className="w-full h-full bg-gradient-to-r from-blue-800 to-purple-900 rounded"></div>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Rang:</strong> To'q ko'k-qizil</p>
                    <p>• <strong className="text-white">Sabab:</strong> Fe²⁺ yuqori spinli (HS)</p>
                    <p>• <strong className="text-white">λ<sub>max</sub>:</strong> 555 nm</p>
                    <p>• <strong className="text-white">Yutilish:</strong> sariq-yashil nur → ko'k-qizil ko'rinadi</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-5">
                <h3 className="text-purple-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Nega rang o'zgaradi?
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Deoxy (HS):</strong> Fe²⁺ porfirin tekisligidan yuqorida → porfirin halqasi buzilgan → boshqa yutilish</p>
                  <p>• <strong className="text-white">Oxy (LS):</strong> Fe²⁺ tekislikda → porfirin simmetrik → boshqa yutilish</p>
                  <p>• <strong className="text-yellow-300">Natija:</strong> Spin holati o'zgarishi → elektron o'tishlar o'zgaradi → rang o'zgaradi</p>
                  <p className="text-xs text-purple-400 mt-2">
                    Bu hodisa <strong className="text-white">pulse oksimetriya</strong>da ishlatiladi — 
                    qondagi O₂ satursiyasini o'lchash uchun.
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
                      <p className="text-green-300 font-bold text-xs mb-1">🔴 Oxyhemoglobin</p>
                      <p className="text-xs">Soret cho'qqisi: 415 nm</p>
                      <p className="text-xs">Q-cho'qqilar: 540 nm, 576 nm</p>
                    </div>
                    <div className="bg-blue-900/40 rounded-lg p-3 border border-blue-700/30">
                      <p className="text-blue-300 font-bold text-xs mb-1">🔵 Deoxyhemoglobin</p>
                      <p className="text-xs">Soret cho'qqisi: 430 nm</p>
                      <p className="text-xs">Q-cho'qqi: 555 nm</p>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-950/50 rounded-xl p-5 border border-emerald-700/30">
                  <h3 className="text-emerald-400 font-bold mb-3">📡 Boshqa usullar</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <div className="bg-emerald-900/40 rounded-lg p-3 border border-emerald-700/30">
                      <p className="text-emerald-300 font-bold text-xs mb-1">🧲 EPR (ESR)</p>
                      <p className="text-xs">Deoxy: paramagnit (Fe²⁺ HS, S=2)</p>
                      <p className="text-xs">Oxy: diamagnit (Fe²⁺ LS, S=0)</p>
                    </div>
                    <div className="bg-teal-900/40 rounded-lg p-3 border border-teal-700/30">
                      <p className="text-teal-300 font-bold text-xs mb-1">📊 Mössbauer</p>
                      <p className="text-xs">⁵⁷Fe: izomer siljishi, kvadrupol ajralish</p>
                      <p className="text-xs">Fe²⁺ holatini aniqlash</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-5">
                <h3 className="text-green-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Pulse oksimetriya qanday ishlaydi?
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Ikki to'lqin uzunligi:</strong> 660 nm (qizil) va 940 nm (infraqizil)</p>
                  <p>• <strong className="text-white">Oxy:</strong> 940 nm da ko'proq yutadi</p>
                  <p>• <strong className="text-white">Deoxy:</strong> 660 nm da ko'proq yutadi</p>
                  <p>• <strong className="text-yellow-300">Natija:</strong> Ikkala signalning nisbati O₂ satursiyasini beradi</p>
                  <p className="text-xs text-purple-400 mt-2">
                    Normal SpO₂: <strong className="text-green-300">95-100%</strong>. 
                    90% dan past — <strong className="text-red-300">gipoksemiya</strong>.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* PHYSIOLOGY TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "physiology" && (
          <>
            <div className="bg-gradient-to-br from-red-900/40 to-orange-900/40 border border-red-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-xl shadow-lg shadow-red-500/30">
                  🏥
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Fiziologik ahamiyat</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-red-950/50 rounded-xl p-5 border border-red-700/30 text-center">
                  <div className="text-4xl mb-2">🫁</div>
                  <div className="text-red-400 text-xs uppercase mb-1">O'pka</div>
                  <div className="text-white font-bold text-2xl">pO₂ ≈ 100</div>
                  <div className="text-purple-300 text-xs mt-1">mmHg</div>
                  <div className="text-red-300 text-xs mt-2">Hb 98% to'yingan</div>
                </div>
                <div className="bg-orange-950/50 rounded-xl p-5 border border-orange-700/30 text-center">
                  <div className="text-4xl mb-2">🩸</div>
                  <div className="text-orange-400 text-xs uppercase mb-1">Arterial qon</div>
                  <div className="text-white font-bold text-2xl">98%</div>
                  <div className="text-purple-300 text-xs mt-1">SpO₂</div>
                  <div className="text-orange-300 text-xs mt-2">Yorqin qizil</div>
                </div>
                <div className="bg-blue-950/50 rounded-xl p-5 border border-blue-700/30 text-center">
                  <div className="text-4xl mb-2">🦵</div>
                  <div className="text-blue-400 text-xs uppercase mb-1">To'qimalar</div>
                  <div className="text-white font-bold text-2xl">pO₂ ≈ 40</div>
                  <div className="text-purple-300 text-xs mt-1">mmHg</div>
                  <div className="text-blue-300 text-xs mt-2">Hb 75% to'yingan</div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  { title: "1. O'pkada oksigenatsiya", desc: "pO₂ yuqori (100 mmHg) → Hb O₂ ni oladi → arterial qon (98% SpO₂)", icon: "🫁", color: "red" },
                  { title: "2. Arterial transport", desc: "O₂ bilan to'yingan Hb yurakdan butun tanaga tarqaladi", icon: "❤️", color: "orange" },
                  { title: "3. To'qimalarda deoksigenatsiya", desc: "pO₂ past (40 mmHg) → Hb O₂ ni chiqaradi → to'qimalar O₂ oladi", icon: "🦵", color: "yellow" },
                  { title: "4. Venoz qaytish", desc: "Deoxy Hb venoz qon bilan yurakka qaytadi (75% SpO₂)", icon: "🩸", color: "blue" },
                  { title: "5. Qayta oksigenatsiya", desc: "Venoz qon o'pkaga qaytadi → sikl boshidan boshlanadi", icon: "🔄", color: "emerald" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-${item.color}-500 to-${item.color}-700 flex items-center justify-center text-2xl flex-shrink-0 shadow-lg`}>
                      {item.icon}
                    </div>
                    <div className={`flex-1 bg-${item.color}-950/50 rounded-xl p-4 border border-${item.color}-700/30`}>
                      <h3 className={`text-${item.color}-400 font-bold mb-1`}>{item.title}</h3>
                      <p className="text-purple-200 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl p-5">
                <h3 className="text-red-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Bohr effekti
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">CO₂ va H⁺ ko'payganda:</strong> Hb ning O₂ affinligi kamayadi</p>
                  <p>• <strong className="text-white">To'qimalarda:</strong> CO₂ va H⁺ ko'p → Hb O₂ ni oson chiqaradi</p>
                  <p>• <strong className="text-white">O'pkada:</strong> CO₂ chiqariladi → Hb O₂ ni oson oladi</p>
                  <p className="text-xs text-purple-400 mt-2">
                    Bu <strong className="text-yellow-300">allosterik regulyatsiya</strong> — 
                    metabolik faol to'qimalar ko'proq O₂ oladi.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* PATHOLOGY TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "pathology" && (
          <>
            <div className="bg-gradient-to-br from-red-900/40 to-pink-900/40 border border-red-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-xl shadow-lg shadow-red-500/30">
                  ⚕️
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Kasalliklar va patologiyalar</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-red-950/50 rounded-xl p-5 border-2 border-red-500/30">
                  <h3 className="text-red-400 font-bold mb-3">🩸 O'roqsimon hujayrali anemiya</h3>
                  <div className="bg-red-900/40 rounded-lg p-4 font-mono text-xs text-red-200 border border-red-700/30 mb-3">
                    <p>β-globin mutatsiyasi: Glu6Val</p>
                    <p className="mt-2">Normal: ...Pro-Glu-Glu...</p>
                    <p>Mutant: ...Pro-<strong className="text-red-300">Val</strong>-Glu...</p>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Sabab:</strong> β-globinda bitta aminokislota o'zgarishi (Glu → Val)</p>
                    <p>• <strong className="text-white">Natija:</strong> Deoxy Hb polimerlanadi → eritrositlar o'roqsimon shaklga kiradi</p>
                    <p>• <strong className="text-white">Belgilar:</strong> anemiya, og'riq, organ shikastlanishi</p>
                  </div>
                </div>

                <div className="bg-orange-950/50 rounded-xl p-5 border border-orange-700/30">
                  <h3 className="text-orange-400 font-bold mb-3">🔴 Methemoglobinemiya</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Sabab:</strong> Fe²⁺ → Fe³⁺ oksidlanishi</p>
                    <p>• <strong className="text-white">Natija:</strong> Hb O₂ bog'lay olmaydi → gipoksiya</p>
                    <p>• <strong className="text-white">Belgilar:</strong> ko'k teri (sianoz), bosh og'rig'i</p>
                    <p>• <strong className="text-white">Davolash:</strong> metilen ko'ki (Fe³⁺ → Fe²⁺ qaytarish)</p>
                  </div>
                </div>

                <div className="bg-pink-950/50 rounded-xl p-5 border border-pink-700/30">
                  <h3 className="text-pink-400 font-bold mb-3">☠️ CO zaharlanishi</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Sabab:</strong> CO ning Hb ga bog'lanishi (O₂ dan 200× kuchliroq)</p>
                    <p>• <strong className="text-white">Natija:</strong> Karboksigemoglobin (COHb) hosil bo'ladi → O₂ transport to'xtaydi</p>
                    <p>• <strong className="text-white">Belgilar:</strong> bosh og'rig'i, ko'ngil aynishi, hushsizlik, o'lim</p>
                    <p>• <strong className="text-white">Davolash:</strong> 100% O₂, giperbarik oksigenatsiya</p>
                  </div>
                </div>

                <div className="bg-blue-950/50 rounded-xl p-5 border border-blue-700/30">
                  <h3 className="text-blue-400 font-bold mb-3">🧬 Talassemiya</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Sabab:</strong> α- yoki β-globin sintezi kamayishi</p>
                    <p>• <strong className="text-white">Natija:</strong> Hb miqdori kamayadi → anemiya</p>
                    <p>• <strong className="text-white">Turlari:</strong> α-talassemiya, β-talassemiya</p>
                    <p>• <strong className="text-white">Davolash:</strong> qon quyish, temir xelatlash</p>
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Nobel mukofoti 1962 — Perutz va Kendrew</h2>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-2xl p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-yellow-600 to-amber-600 flex items-center justify-center text-6xl flex-shrink-0 shadow-2xl">
                    🏆
                  </div>
                  <div className="flex-1">
                    <h3 className="text-yellow-400 font-bold text-xl mb-2">Max Perutz & John Kendrew</h3>
                    <p className="text-purple-200 text-sm mb-3 leading-relaxed">
                      <strong className="text-yellow-300">1962 yilda</strong> Max Perutz (gemoglobin) va 
                      John Kendrew (mioglobin) <strong className="text-white">oqsil strukturasini</strong> 
                      rentgen kristallografiyasi orqali aniqlagani uchun 
                      <strong className="text-yellow-300"> Nobel mukofoti</strong>ni oldi.
                      Bu <strong className="text-white">birinchi oqsil strukturasi</strong> edi.
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-xs text-yellow-300 font-semibold">
                        🏆 Nobel 1962
                      </span>
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-xs text-amber-300 font-semibold">
                        📍 Cambridge
                      </span>
                      <span className="px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-xs text-orange-300 font-semibold">
                        🧬 Birinchi oqsil strukturasi
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { year: "1851", title: "Gemoglobin kashfiyoti", desc: "Friedrich Ludwig Hünefeld birinchi bo'lib gemoglobinni tavsifladi" },
                  { year: "1920-1930", title: "O₂ bog'lanish tadqiqotlari", desc: "Archibald Hill kooperativ bog'lanishni tavsifladi (Hill tenglamasi)" },
                  { year: "1937", title: "Perutz ish boshladi", desc: "Max Perutz gemoglobin strukturasini aniqlashga kirishdi" },
                  { year: "1958", title: "Mioglobin strukturasi", desc: "John Kendrew mioglobin strukturasini aniqladi (birinchi oqsil)" },
                  { year: "1959", title: "Gemoglobin strukturasi", desc: "Max Perutz gemoglobin strukturasini aniqladi" },
                  { year: "1962", title: "Nobel mukofoti", desc: "Perutz va Kendrew kimyo bo'yicha Nobel mukofotini oldi" },
                  { year: "1970+", title: "Allosterik modellar", desc: "Monod-Wyman-Changeux (MWC) va Koshland-Némethy-Filmer (KNF) modellari" },
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
              href="/ilmiy/birikmares/k3-fe-cn-6"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-white font-bold transition-all shadow-lg shadow-red-500/30 flex items-center gap-2"
            >
              <span>🔴</span>
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