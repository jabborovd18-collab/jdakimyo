"use client"

import Link from "next/link"
import { useState } from "react"

export default function CoEn3Cl3() {
  const [activeTab, setActiveTab] = useState("overview")
  const [activeIsomer, setActiveIsomer] = useState("delta") // delta | lambda

  const tabs = [
    { id: "overview", label: "📋 Umumiy", icon: "📋" },
    { id: "optical", label: "🔄 Optik izomeriya", icon: "🔄" },
    { id: "chelate", label: "💎 Xelat effekti", icon: "💎" },
    { id: "structure", label: "🧬 Tuzilish", icon: "🧬" },
    { id: "electronic", label: "⚛️ Elektron", icon: "⚛️" },
    { id: "spectroscopy", label: "🔬 Spektroskopiya", icon: "🔬" },
    { id: "synthesis", label: "⚗️ Sintez", icon: "⚗️" },
    { id: "history", label: "🏆 Tarix", icon: "🏆" },
  ]

  const isomerData = {
    delta: {
      name: "Δ-[Co(en)₃]³⁺",
      fullName: "Delta (o'ng qo'l propeller)",
      symbol: "Δ",
      color: "Sariq",
      opticalRotation: "[α]D²⁰ = +89° (suvda)",
      CD_signal: "Musbat Cotton effekti (470 nm da)",
      description: "Propeller soat yo'nalishiga teskari burilgan (right-handed)"
    },
    lambda: {
      name: "Λ-[Co(en)₃]³⁺",
      fullName: "Lambda (chap qo'l propeller)",
      symbol: "Λ",
      color: "Sariq",
      opticalRotation: "[α]D²⁰ = -89° (suvda)",
      CD_signal: "Manfiy Cotton effekti (470 nm da)",
      description: "Propeller soat yo'nalishi bo'yicha burilgan (left-handed)"
    },
  }

  const current = isomerData[activeIsomer]

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0118] via-amber-950/30 to-slate-950 text-white relative overflow-hidden">
      
      {/* ═══ ANIMATED BACKGROUND ═══ */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(217,119,6,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(217,119,6,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        {['Co³⁺', 'en', 'Δ', 'Λ', 'D₃', 'chelate', 'Nobel 1913', 'log β₃=49'].map((sym, i) => (
          <div
            key={i}
            className="absolute text-amber-400/5 font-mono font-bold select-none pointer-events-none"
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
      <header className="relative z-20 border-b border-white/5 backdrop-blur-xl bg-black/20 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <nav className="flex items-center gap-2 text-xs mb-3 text-purple-400 flex-wrap">
            <Link href="/" className="hover:text-purple-300 transition-colors">🏠 Bosh sahifa</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy" className="hover:text-purple-300 transition-colors">Ilmiy bo'lim</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/birikmalar" className="hover:text-purple-300 transition-colors">Birikmalar bazasi</Link>
            <span className="text-purple-600">›</span>
            <span className="text-amber-400 font-semibold">[Co(en)₃]Cl₃</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-violet-500/20 border border-amber-500/30 text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                  🔄 Optik izomeriya
                </span>
                <span className="px-2.5 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-[10px] text-yellow-300 font-semibold">
                  🏆 Nobel 1913
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] text-emerald-300 font-semibold">
                  💎 Xelat
                </span>
                <span className="px-2.5 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-[10px] text-green-300 font-semibold">
                  Inert
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-amber-400 via-yellow-400 to-violet-300 bg-clip-text text-transparent">
                [Co(en)₃]Cl₃
              </h1>
              <p className="text-purple-300 text-sm mt-1">
                Tris(etilendiamin)kobalt(III) xlorid • Tris(ethylenediamine)cobalt(III) chloride
              </p>
            </div>
            
            <div className="flex gap-2">
              <Link 
                href="/ilmiy/birikmares"
                onClick={(e) => { e.preventDefault(); window.history.back(); }}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-semibold transition-all flex items-center gap-2"
              >
                <span>←</span>
                <span className="hidden sm:inline">Orqaga</span>
              </Link>
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
            { label: "Formula", value: "[Co(en)₃]Cl₃", icon: "🧪", color: "text-amber-400" },
            { label: "M massa", value: "345.52 g/mol", icon: "⚖️", color: "text-blue-400" },
            { label: "Geometriya", value: "Oktaedrik (D₃)", icon: "💎", color: "text-purple-400" },
            { label: "Kompleks rangi", value: "Sariq-jigarrang", icon: "🎨", color: "text-amber-400" },
            { label: "Ligand turi", value: "Bidentat (xelat)", icon: "🔗", color: "text-emerald-400" },
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

      {/* ═══ IZOMER SWITCHER ═══ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 mb-8">
        <div className="bg-gradient-to-r from-amber-900/30 via-violet-900/30 to-amber-900/30 border border-amber-500/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🔄</span>
            <span className="text-sm font-bold text-white">Enantiomerni tanlang:</span>
            <span className="text-xs text-amber-300 ml-auto">(Xiral molekulalar!)</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setActiveIsomer("delta")}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                activeIsomer === "delta"
                  ? 'bg-gradient-to-br from-amber-600/40 to-orange-600/40 border-amber-400/60 shadow-lg shadow-amber-500/20'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              {activeIsomer === "delta" && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold">✓</div>
              )}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-2xl font-bold shadow-lg">
                  Δ
                </div>
                <div className="text-left">
                  <div className="font-bold text-white">Delta-izomer</div>
                  <div className="text-xs text-amber-300">O'ng qo'l propeller</div>
                  <div className="text-[10px] text-amber-400 font-mono">[α]D = +89°</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setActiveIsomer("lambda")}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                activeIsomer === "lambda"
                  ? 'bg-gradient-to-br from-violet-600/40 to-purple-600/40 border-violet-400/60 shadow-lg shadow-violet-500/20'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              {activeIsomer === "lambda" && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs font-bold">✓</div>
              )}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-2xl font-bold shadow-lg">
                  Λ
                </div>
                <div className="text-left">
                  <div className="font-bold text-white">Lambda-izomer</div>
                  <div className="text-xs text-violet-300">Chap qo'l propeller</div>
                  <div className="text-[10px] text-violet-400 font-mono">[α]D = -89°</div>
                </div>
              </div>
            </button>
          </div>
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
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
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
            {/* ASOSIY MA'LUMOTLAR */}
            <div className="bg-gradient-to-br from-purple-900/40 to-amber-900/40 border border-amber-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-xl shadow-lg shadow-amber-500/30">
                  📋
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Asosiy ma'lumotlar</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  ["CAS raqami", "14878-55-8"],
                  ["Zichlik", "1.62 g/cm³"],
                  ["Sistema", "Monoklinik"],
                  ["Fazoviy guruh", "P2₁"],
                  ["Eruvchanlik (H₂O)", "Yaxshi eriydi"],
                  ["Eruvchanlik (EtOH)", "Kam eriydi"],
                  ["Barqarorlik", "Juda barqaror (inert)"],
                  ["Rangi", "Sariq-jigarrang"],
                ].map((item, i) => (
                  <div key={i} className="bg-amber-950/50 rounded-xl p-3 border border-amber-700/30">
                    <div className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold mb-1">{item[0]}</div>
                    <div className="text-white font-semibold text-sm">{item[1]}</div>
                  </div>
                ))}
              </div>

              {/* ICHKI/TASHQI SFERA */}
              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-5">
                <h3 className="text-amber-400 font-bold mb-3 flex items-center gap-2">
                  <span>💎</span> Ichki va tashqi sfera
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-amber-900/30 rounded-xl p-4 border border-amber-700/30">
                    <h4 className="text-amber-300 font-bold text-sm mb-2">🔒 Ichki sfera [Co(en)₃]³⁺</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">Co³⁺</strong> — markaziy ion (d⁶)</li>
                      <li>• <strong className="text-white">3 × en</strong> — bidentat ligand</li>
                      <li>• <strong className="text-white">6 × N</strong> — donor atomlar (har bir en 2 ta)</li>
                      <li>• <strong className="text-yellow-300">Zaryad:</strong> +3 + 0 = <strong>+3</strong></li>
                      <li>• <strong className="text-emerald-300">5 a'zoli</strong> xelat halqalar</li>
                    </ul>
                  </div>
                  <div className="bg-orange-900/30 rounded-xl p-4 border border-orange-700/30">
                    <h4 className="text-orange-300 font-bold text-sm mb-2">🔓 Tashqi sfera 3Cl⁻</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">3 × Cl⁻</strong> — counter-ionlar</li>
                      <li>• Ion bog'lar bilan bog'langan</li>
                      <li>• Suvda darhol dissotsilanadi</li>
                      <li>• AgNO₃ bilan <strong className="text-green-400">3 mol AgCl</strong> cho'kadi</li>
                      <li>• <strong className="text-yellow-300">4 ion:</strong> [Co(en)₃]³⁺ + 3Cl⁻</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* XULOSA */}
            <div className="bg-gradient-to-r from-amber-600/10 via-yellow-600/10 to-amber-600/10 border border-amber-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>✅</span> Asosiy xulosalar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "💎 <strong>Bidentat ligand</strong> — 3 ta en = 6 ta donor N atomi",
                  "🔄 <strong>Optik faol</strong> — Δ va Λ enantiomerlari mavjud",
                  "⚡ <strong>Juda barqaror</strong> — log β₃ ≈ 49 (xelat effekti)",
                  "🔒 <strong>Inert</strong> — t₁/₂ > oylar (Co³⁺ d⁶ quyi spin)",
                  "🏆 <strong>Nobel 1913</strong> — Werner'ning hal qiluvchi isboti",
                  "🎨 <strong>Rang:</strong> sariq-jigarrang (λ<sub>max</sub> = 470 nm)",
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
        {/* OPTICAL ISOMERISM TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "optical" && (
          <>
            {/* Δ VA Λ TAQQOSLASH */}
            <div className="bg-gradient-to-br from-amber-900/40 to-violet-900/40 border border-amber-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-violet-500 flex items-center justify-center text-xl shadow-lg shadow-amber-500/30">
                  🔄
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Optik izomeriya — Δ va Λ</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Δ */}
                <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 rounded-2xl p-6 border-2 border-amber-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-3xl font-bold shadow-lg">
                      Δ
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-amber-300">Delta-izomer</h3>
                      <p className="text-amber-400 text-xs">O'ng qo'l propeller (right-handed)</p>
                    </div>
                  </div>

                  <div className="bg-amber-950/60 rounded-xl p-4 mb-4 font-mono text-xs text-amber-200 border border-amber-700/30">
                    <pre className="whitespace-pre">{`        NH₂─CH₂
       /        \\
  N──Co──N      CH₂
   \\/   \\/       |
   ||   ||       NH₂
   CH₂  CH₂
    \\   /
     CH₂
     
  ↻ Soat yo'nalishiga teskari`}</pre>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-300">Simmetriya:</span>
                      <span className="text-white font-mono font-bold">D₃</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">[α]<sub>D</sub>²⁰:</span>
                      <span className="text-amber-300 font-bold font-mono">+89° (suvda)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">CD signal:</span>
                      <span className="text-amber-300 font-bold">Musbat Cotton</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Propeller:</span>
                      <span className="text-white">↻ Right-handed</span>
                    </div>
                  </div>
                </div>

                {/* Λ */}
                <div className="bg-gradient-to-br from-violet-900/40 to-purple-900/40 rounded-2xl p-6 border-2 border-violet-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-3xl font-bold shadow-lg">
                      Λ
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-violet-300">Lambda-izomer</h3>
                      <p className="text-violet-400 text-xs">Chap qo'l propeller (left-handed)</p>
                    </div>
                  </div>

                  <div className="bg-violet-950/60 rounded-xl p-4 mb-4 font-mono text-xs text-violet-200 border border-violet-700/30">
                    <pre className="whitespace-pre">{`        NH₂─CH₂
       /        \\
  N──Co──N      CH₂
   \\/   \\/       |
   ||   ||       NH₂
   CH₂  CH₂
    \\   /
     CH₂
     
  ↺ Soat yo'nalishi bo'yicha`}</pre>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-300">Simmetriya:</span>
                      <span className="text-white font-mono font-bold">D₃</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">[α]<sub>D</sub>²⁰:</span>
                      <span className="text-violet-300 font-bold font-mono">-89° (suvda)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">CD signal:</span>
                      <span className="text-violet-300 font-bold">Manfiy Cotton</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Propeller:</span>
                      <span className="text-white">↺ Left-handed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* NEGA XIRAL? */}
            <div className="bg-gradient-to-br from-pink-900/40 to-rose-900/40 border border-pink-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-xl shadow-lg shadow-pink-500/30">
                  🪞
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Nega bu molekula xiral?</h2>
              </div>
              
              <div className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20 rounded-2xl p-5 mb-6">
                <h3 className="text-pink-400 font-bold mb-3">Xirallik sharti</h3>
                <p className="text-purple-200 text-sm leading-relaxed">
                  Molekula xiral bo'lishi uchun uning <strong className="text-white">ko'zgudagi aksi bilan ustma-ust tushmasligi</strong> kerak.
                  Buning uchun molekulada <strong className="text-pink-300">σ (ko'zgu tekisligi)</strong> va <strong className="text-pink-300">i (inversiya markazi)</strong> bo'lmasligi kerak.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-pink-950/50 rounded-xl p-5 border border-pink-700/30">
                  <h3 className="text-pink-400 font-bold mb-2">✓ Bor</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">C₃ o'qi</strong> — propeller o'qi bo'ylab</p>
                    <p>• <strong className="text-white">3 ta C₂ o'qi</strong> — C₃ ga perpendikulyar</p>
                    <p>• <strong className="text-white">D₃</strong> nuqtali guruh</p>
                  </div>
                </div>
                
                <div className="bg-rose-950/50 rounded-xl p-5 border border-rose-700/30">
                  <h3 className="text-rose-400 font-bold mb-2">✗ Yo'q (muhim!)</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">σ tekislik</strong> — yo'q!</p>
                    <p>• <strong className="text-white">i markazi</strong> — yo'q!</p>
                    <p>• <strong className="text-white">S<sub>n</sub> o'qi</strong> — yo'q!</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-yellow-900/40 to-amber-900/40 rounded-xl p-5 border border-yellow-700/30">
                  <h3 className="text-yellow-400 font-bold mb-2">🎯 Natija</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-yellow-300">XIRAL!</strong></p>
                    <p>• Δ va Λ bir-birining enantiomeri</p>
                    <p>• Optik faol — polyarizatsiyalangan nurni buradi</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AJRATISH */}
            <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">
                  🔬
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Enantiomerlarni ajratish (rezolyutsiya)</h2>
              </div>
              
              <div className="space-y-3">
                {[
                  { step: "1", title: "Racemik aralashmani olish", desc: "Sintezdan keyin Δ va Λ aralashmasi (1:1) hosil bo'ladi — optik faol emas" },
                  { step: "2", title: "Xiral reagent qo'shish", desc: "(+)-tartar kislotasi qo'shiladi → diastereomerik tuzlar hosil bo'ladi" },
                  { step: "3", title: "Diastereomerlar farqi", desc: "Δ-(+) va Λ-(+) tuzlarning eruvchanligi farqlanadi (endi ular diastereomer, enantiomer emas!)" },
                  { step: "4", title: "Fraksion kristallizatsiya", desc: "Sekin sovutish orqali birinchi bir tuz kristallanadi, ikkinchisi eritmada qoladi" },
                  { step: "5", title: "Ajratib olish", desc: "Kristallar filtrlanadi, har biri alohida idishda saqlanadi" },
                  { step: "6", title: "Tozalash", desc: "HCl qo'shib, tartar kislotasi chiqariladi → toza Δ yoki Λ kompleks olinadi" },
                  { step: "7", title: "Tekshirish", desc: "Polyarimetr bilan [α]D o'lchanadi: +89° (Δ) yoki -89° (Λ)" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg">
                      {item.step}
                    </div>
                    <div className="flex-1 bg-blue-950/50 rounded-xl p-4 border border-blue-700/30">
                      <h3 className="text-blue-400 font-bold mb-1">{item.title}</h3>
                      <p className="text-purple-200 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-5 mt-6">
                <h3 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Nima uchun diastereomerlar bilan ishlaymiz?
                </h3>
                <p className="text-purple-200 text-sm">
                  Enantiomerlarning <strong className="text-white">barcha fizik xossalari bir xil</strong> (eruvchanlik, qaynash harorati va h.k.).
                  Lekin <strong className="text-yellow-300">diastereomerlar</strong> turli xil fizik xossalarga ega — shuning uchun ularni 
                  <strong className="text-white"> oddiy kristallizatsiya</strong> bilan ajratish mumkin!
                </p>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* CHELATE EFFECT TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "chelate" && (
          <>
            {/* XELAT EFFEKTI */}
            <div className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border border-emerald-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-xl shadow-lg shadow-emerald-500/30">
                  💎
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Xelat effekti — nima uchun shunchalik barqaror?</h2>
              </div>
              
              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-emerald-400">Xelat effekti</strong> — bu bidentat (yoki polidentat) ligandlar bilan hosil bo'lgan 
                  komplekslarning, ekvivalent monodentat ligandlarga qaraganda <strong className="text-white">juda barqaror</strong> bo'lish hodisasi.
                  Bu asosan <strong className="text-yellow-300">entropiya</strong> bilan bog'liq.
                </p>
              </div>

              {/* TAQQOSLASH */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-red-950/50 rounded-2xl p-5 border border-red-700/30">
                  <h3 className="text-red-400 font-bold mb-3">❌ 6 ta monodentat NH₃</h3>
                  <div className="bg-red-900/60 rounded-xl p-4 mb-4 font-mono text-xs text-red-200 border border-red-700/30">
                    Co³⁺ + 6NH₃ ⇌ [Co(NH₃)₆]³⁺
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-300">log β₆:</span>
                      <span className="text-white font-mono font-bold">≈ 35</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Zarrachalar soni:</span>
                      <span className="text-white">7 → 1</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">ΔS:</span>
                      <span className="text-red-300 font-bold">Katta manfiy</span>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-950/50 rounded-2xl p-5 border-2 border-emerald-500/30">
                  <h3 className="text-emerald-400 font-bold mb-3">✅ 3 ta bidentat en</h3>
                  <div className="bg-emerald-900/60 rounded-xl p-4 mb-4 font-mono text-xs text-emerald-200 border border-emerald-700/30">
                    Co³⁺ + 3en ⇌ [Co(en)₃]³⁺
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-300">log β₃:</span>
                      <span className="text-emerald-300 font-mono font-bold">≈ 49 ⭐</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Zarrachalar soni:</span>
                      <span className="text-white">4 → 1</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">ΔS:</span>
                      <span className="text-emerald-300 font-bold">Kamroq manfiy</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-5 mt-6">
                <h3 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
                  <span>🎯</span> Farq: <span className="font-mono">log β₃(en) - log β₆(NH₃) ≈ 14</span>
                </h3>
                <p className="text-purple-200 text-sm">
                  Bu <strong className="text-white">10¹⁴ marta</strong> barqaror degani! 
                  Xelat kompleksi monodentat kompleksiga qaraganda 
                  <strong className="text-yellow-300"> 100 trillion marta</strong> ko'proq barqaror.
                </p>
              </div>
            </div>

            {/* TERMODINAMIKA */}
            <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border border-yellow-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-xl shadow-lg shadow-yellow-500/30">
                  🌡️
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Termodinamik tahlil</h2>
              </div>
              
              <div className="bg-yellow-950/50 rounded-2xl p-5 border border-yellow-700/30 mb-6">
                <div className="bg-yellow-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-yellow-200 border border-yellow-700/30 text-center">
                  ΔG° = ΔH° - TΔS° &nbsp;&nbsp;&nbsp; va &nbsp;&nbsp;&nbsp; ΔG° = -RT ln K
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-yellow-900/40 rounded-xl p-4 border border-yellow-700/30 text-center">
                    <div className="text-yellow-400 text-xs uppercase mb-2">ΔH° (entalpiya)</div>
                    <div className="text-white text-lg font-mono font-bold">≈ Bir xil</div>
                    <div className="text-yellow-300 text-xs mt-2">Co-N bog'lar soni bir xil (6 ta)</div>
                  </div>
                  <div className="bg-orange-900/40 rounded-xl p-4 border border-orange-700/30 text-center">
                    <div className="text-orange-400 text-xs uppercase mb-2">ΔS° (entropiya)</div>
                    <div className="text-white text-lg font-mono font-bold">Katta farq!</div>
                    <div className="text-orange-300 text-xs mt-2">en: 4 → 1; NH₃: 7 → 1</div>
                  </div>
                  <div className="bg-red-900/40 rounded-xl p-4 border border-red-700/30 text-center">
                    <div className="text-red-400 text-xs uppercase mb-2">ΔG°</div>
                    <div className="text-white text-lg font-mono font-bold">ΔS tufayli</div>
                    <div className="text-red-300 text-xs mt-2">Xelat -80 kJ/mol ga qulay</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-5">
                <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                  <span>💡</span> Entropiya sababi
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">6 ta NH₃ reaksiyada:</strong> 7 ta zarrachadan 1 ta hosil bo'ladi → katta tartibsizlik yo'qotiladi</p>
                  <p>• <strong className="text-white">3 ta en reaksiyada:</strong> 4 ta zarrachadan 1 ta hosil bo'ladi → kamroq tartibsizlik yo'qotiladi</p>
                  <p>• <strong className="text-yellow-300">Natija:</strong> ΔS kamroq manfiy → ΔG ko'proq manfiy → K kattaroq</p>
                </div>
              </div>
            </div>

            {/* HALQA O'LCHAMI */}
            <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  🔗
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">5 a'zoli xelat halqa</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
                  <h3 className="text-purple-400 font-bold mb-3">Etilendiamin strukturasi</h3>
                  <div className="bg-purple-900/60 rounded-xl p-4 mb-4 font-mono text-xs text-purple-200 border border-purple-700/30">
                    <pre className="whitespace-pre">{`    H₂N — CH₂ — CH₂ — NH₂
     ↑                    ↑
   donor              donor
   
   M ─── N ─ C ─ C ─ N ─── M
          ↑___5 a'zo___↑`}</pre>
                  </div>
                  <p className="text-purple-200 text-xs">
                    Har bir <strong className="text-white">en</strong> ligandi metall bilan 
                    <strong className="text-yellow-300"> 5 a'zoli halqa</strong> hosil qiladi: 
                    M, N, C, C, N
                  </p>
                </div>
                
                <div className="bg-indigo-950/50 rounded-xl p-5 border border-indigo-700/30">
                  <h3 className="text-indigo-400 font-bold mb-3">Nega aynan 5 a'zo optimal?</h3>
                  <div className="space-y-2 text-sm">
                    {[
                      ["3 a'zo", "Juda kichik — katta burchak kuchlanishi"],
                      ["4 a'zo", "Kichik — barqaror emas"],
                      ["5 a'zo ⭐", "Optimal — minimal kuchlanish"],
                      ["6 a'zo", "Yaxshi, lekin 5 ga qaraganda kamroq"],
                      ["7+ a'zo", "Entropiya tufayli kamroq barqaror"],
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5 border-b border-indigo-800/30">
                        <span className="text-indigo-300 text-sm font-mono font-bold">{item[0]}</span>
                        <span className="text-purple-200 text-xs">{item[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* STRUCTURE TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "structure" && (
          <>
            <div className="bg-gradient-to-br from-purple-900/40 to-amber-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-amber-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  💎
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Geometriya va simmetriya</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-purple-400 font-bold text-sm uppercase tracking-wider">Geometrik parametrlar</h3>
                  <div className="space-y-2">
                    {[
                      ["Geometriya", "Buzilgan oktaedrik"],
                      ["Nuqtali guruh", "D₃"],
                      ["Co−N masofa", "1.94 Å (6 ta, hammasi teng)"],
                      ["C−N masofa", "1.49 Å"],
                      ["C−C masofa", "1.52 Å"],
                      ["N−Co−N (chelate)", "≈ 85.5° (5 a'zoli halqa)"],
                      ["N−Co−N (trans)", "180°"],
                      ["N−Co−N (cis, turli en)", "≈ 90°"],
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-purple-800/30">
                        <span className="text-purple-300 text-sm">{item[0]}</span>
                        <span className="text-white font-semibold text-sm font-mono">{item[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-amber-400 font-bold text-sm uppercase tracking-wider">D₃ simmetriya elementlari</h3>
                  <div className="space-y-2">
                    {[
                      ["E", "Ayniylik"],
                      ["2C₃", "Propeller o'qi bo'ylab (120° va 240°)"],
                      ["3C₂", "C₃ ga perpendikulyar (Co orqali)"],
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-1.5 border-b border-amber-800/30">
                        <span className="text-amber-300 text-sm font-mono font-bold">{item[0]}</span>
                        <span className="text-purple-200 text-xs">{item[1]}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-amber-950/50 rounded-xl p-3 border border-amber-700/30 mt-3">
                    <p className="text-amber-200 text-xs">
                      <strong className="text-amber-400">Jami:</strong> 6 ta simmetriya operatsiyasi.
                      <strong className="text-yellow-300"> σ tekislik va i markazi yo'q</strong> — shuning uchun xiral!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* PROPPELLER TUZILISHI */}
            <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">
                  🌀
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Propeller tuzilishi</h2>
              </div>
              
              <div className="bg-blue-950/50 rounded-2xl p-6 border border-blue-700/30">
                <div className="bg-blue-900/60 rounded-xl p-5 mb-4 font-mono text-xs text-blue-200 border border-blue-700/30 text-center">
                  <pre className="whitespace-pre">{`           N───N
          /     \\
     N──Co───Co──N
      \\   ↑   /
       N──N──N
   
   3 ta en propeller shaklida
   (tepaga va pastga qaragan)`}</pre>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h3 className="text-blue-400 font-bold mb-2">Propeller shaklining sababi</h3>
                    <p className="text-purple-200 text-xs leading-relaxed">
                      3 ta bidentat ligand oktaedrning 3 ta yonida joylashadi. 
                      Har bir en ligandi <strong className="text-white">2 ta qo'shni pozitsiyani</strong> egallaydi (cis).
                      Natijada, 3 ta xelat halqa bir-biriga nisbatan <strong className="text-yellow-300">burchak ostida</strong> joylashib, 
                      propeller shaklini hosil qiladi.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-blue-400 font-bold mb-2">Sterik to'siqlar</h3>
                    <p className="text-purple-200 text-xs leading-relaxed">
                      Etilendiamin halqalari bir-biriga yaqin joylashgani uchun, ular 
                      <strong className="text-white"> bir-birining ustiga chiqmaydi</strong>. 
                      Propeller shakli bu sterik to'siqlarni minimallashtiradi va 
                      <strong className="text-yellow-300"> barqaror konfiguratsiya</strong> hosil qiladi.
                    </p>
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
            <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border border-yellow-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-xl shadow-lg shadow-yellow-500/30">
                  ⚛️
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Elektron tuzilishi</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-yellow-950/50 rounded-2xl p-5 border border-yellow-700/30 text-center">
                  <div className="text-4xl mb-2">🔵</div>
                  <div className="text-yellow-400 text-xs uppercase mb-1">Erkin Co atomi</div>
                  <div className="text-white font-mono font-bold">[Ar] 3d⁷ 4s²</div>
                  <div className="text-purple-300 text-xs mt-1">Z = 27</div>
                </div>
                <div className="bg-orange-950/50 rounded-2xl p-5 border border-orange-700/30 text-center">
                  <div className="text-4xl mb-2">🟡</div>
                  <div className="text-orange-400 text-xs uppercase mb-1">Co³⁺ ioni</div>
                  <div className="text-white font-mono font-bold">[Ar] 3d⁶</div>
                  <div className="text-purple-300 text-xs mt-1">6 ta d-elektron</div>
                </div>
                <div className="bg-amber-950/50 rounded-2xl p-5 border border-amber-700/30 text-center">
                  <div className="text-4xl mb-2">🟣</div>
                  <div className="text-amber-400 text-xs uppercase mb-1">Kompleksda</div>
                  <div className="text-white font-mono font-bold">t₂g⁶ eg⁰</div>
                  <div className="text-green-400 text-xs mt-1">Quyi spinli (LS)</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-5">
                <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                  <span>💡</span> Nega quyi spinli?
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Etilendiamin</strong> — o'rta-kuchli maydonli ligand (spektrokimyoviy qatorda NH₃ ga yaqin)</p>
                  <p>• <strong className="text-white">Co³⁺</strong> uchun Δₒ ≈ 23,300 cm⁻¹</p>
                  <p>• Juftlashuv energiyasi P ≈ 21,000 cm⁻¹</p>
                  <p>• <strong className="text-yellow-300">Δₒ &gt; P</strong> → <strong className="text-green-400">quyi spinli</strong></p>
                  <p>• Barcha 6 ta elektron t₂g orbitallarda juftlashgan → <strong className="text-white">diamagnit</strong></p>
                </div>
              </div>
            </div>

            {/* d-ORBITAL */}
            <div className="bg-gradient-to-br from-purple-900/40 to-violet-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  📊
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">d-orbital ajralishi</h2>
              </div>
              
              <div className="bg-purple-950/60 rounded-2xl p-6 border border-purple-700/30 mb-6">
                <div className="flex items-center justify-center gap-8">
                  <div className="flex flex-col items-center">
                    <div className="text-purple-400 text-xs mb-2">E</div>
                    <div className="w-0.5 h-48 bg-gradient-to-t from-purple-600 to-purple-300 rounded-full"></div>
                  </div>
                  
                  <div className="flex-1 max-w-md space-y-8">
                    <div>
                      <div className="text-purple-400 text-xs mb-2 font-bold">eg (yuqori energiya)</div>
                      <div className="flex justify-center gap-6">
                        <div className="flex flex-col items-center">
                          <div className="w-20 h-1 bg-purple-400 rounded"></div>
                          <div className="text-purple-300 text-xs mt-1">d<sub>z²</sub></div>
                          <div className="text-purple-500 text-xs">(bo'sh)</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-20 h-1 bg-purple-400 rounded"></div>
                          <div className="text-purple-300 text-xs mt-1">d<sub>x²-y²</sub></div>
                          <div className="text-purple-500 text-xs">(bo'sh)</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-0.5 border-t-2 border-dashed border-yellow-500"></div>
                      <div className="bg-yellow-500/20 px-3 py-1 rounded-lg border border-yellow-500/30">
                        <span className="text-yellow-400 font-bold font-mono">Δₒ = 23,300 cm⁻¹</span>
                      </div>
                      <div className="flex-1 h-0.5 border-t-2 border-dashed border-yellow-500"></div>
                    </div>
                    
                    <div>
                      <div className="text-green-400 text-xs mb-2 font-bold">t₂g (quyi energiya)</div>
                      <div className="flex justify-center gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-1 bg-green-400 rounded"></div>
                          <div className="text-green-300 text-xs mt-1">d<sub>xy</sub></div>
                          <div className="text-green-500 text-xs">↑↓</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-1 bg-green-400 rounded"></div>
                          <div className="text-green-300 text-xs mt-1">d<sub>xz</sub></div>
                          <div className="text-green-500 text-xs">↑↓</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-1 bg-green-400 rounded"></div>
                          <div className="text-green-300 text-xs mt-1">d<sub>yz</sub></div>
                          <div className="text-green-500 text-xs">↑↓</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-violet-950/50 rounded-xl p-4 border border-violet-700/30">
                  <h3 className="text-violet-400 font-bold mb-2">KMBE</h3>
                  <div className="text-purple-200 text-sm space-y-1">
                    <p>KMBE = 6 × (−0.4Δₒ) + 0 × (+0.6Δₒ)</p>
                    <p className="text-white font-bold font-mono">KMBE = −2.4Δₒ</p>
                    <p className="text-xs text-purple-400">≈ −670 kJ/mol</p>
                  </div>
                </div>
                <div className="bg-violet-950/50 rounded-xl p-4 border border-violet-700/30">
                  <h3 className="text-violet-400 font-bold mb-2">Magnit xossalari</h3>
                  <div className="text-purple-200 text-sm space-y-1">
                    <p>Juftlashmagan elektronlar: <strong className="text-white">n = 0</strong></p>
                    <p>μ_eff: <strong className="text-white">0 BM</strong></p>
                    <p className="text-green-400 font-bold">✓ Diamagnit!</p>
                  </div>
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
                  🌈
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">UV-Vis spektroskopiya</h2>
              </div>
              
              <div className="space-y-3">
                {[
                  {
                    transition: "¹A₁ → ¹T₁g",
                    wavelength: "470 nm",
                    energy: "21,280 cm⁻¹",
                    epsilon: "ε ≈ 90 L·mol⁻¹·cm⁻¹",
                    color: "Ko'k nur yutiladi → sariq ko'rinadi"
                  },
                  {
                    transition: "¹A₁ → ¹T₂g",
                    wavelength: "340 nm",
                    energy: "29,400 cm⁻¹",
                    epsilon: "ε ≈ 70 L·mol⁻¹·cm⁻¹",
                    color: "UB-soha (ko'zga ko'rinmaydi)"
                  },
                ].map((item, i) => (
                  <div key={i} className="bg-green-900/40 rounded-xl p-4 border border-green-700/30">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <div className="text-white font-mono font-bold">{item.transition}</div>
                        <div className="text-green-300 text-sm">{item.color}</div>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <div>
                          <div className="text-green-400 text-xs">λ<sub>max</sub></div>
                          <div className="text-white font-mono">{item.wavelength}</div>
                        </div>
                        <div>
                          <div className="text-green-400 text-xs">Energiya</div>
                          <div className="text-white font-mono">{item.energy}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CD SPEKTRI */}
            <div className="bg-gradient-to-br from-pink-900/40 to-rose-900/40 border border-pink-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-xl shadow-lg shadow-pink-500/30">
                  🔄
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Circular Dichroism (CD) — enantiomerlarni aniqlash</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-amber-950/50 rounded-xl p-5 border border-amber-700/30">
                  <h3 className="text-amber-400 font-bold mb-2">Δ-izomer CD spektri</h3>
                  <div className="bg-amber-900/60 rounded-lg p-3 border border-amber-700/30 font-mono text-xs text-amber-200">
                    <pre className="whitespace-pre">{`     Δε
      ↑  +++++
      |  +   +
   ___|_+____+___→ λ
      |       -
      |      --
      
   Musbat Cotton effekti
   (470 nm da)`}</pre>
                  </div>
                  <p className="text-amber-200 text-xs mt-2">
                    <strong className="text-white">Musbat Δε</strong> — chap qo'l polyarizatsiyani ko'proq yutadi
                  </p>
                </div>
                
                <div className="bg-violet-950/50 rounded-xl p-5 border border-violet-700/30">
                  <h3 className="text-violet-400 font-bold mb-2">Λ-izomer CD spektri</h3>
                  <div className="bg-violet-900/60 rounded-lg p-3 border border-violet-700/30 font-mono text-xs text-violet-200">
                    <pre className="whitespace-pre">{`     Δε
      ↑
      |
   ___|_______→ λ
      |  -   -
      |  -----
      
   Manfiy Cotton effekti
   (470 nm da)`}</pre>
                  </div>
                  <p className="text-violet-200 text-xs mt-2">
                    <strong className="text-white">Manfiy Δε</strong> — o'ng qo'l polyarizatsiyani ko'proq yutadi
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20 rounded-2xl p-5">
                <h3 className="text-pink-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> CD nima uchun muhim?
                </h3>
                <p className="text-purple-200 text-sm">
                  <strong className="text-white">Circular Dichroism</strong> — xiral molekulalarni aniqlashning eng kuchli usuli.
                  Δ va Λ enantiomerlari <strong className="text-yellow-300">aynan qarama-qarshi</strong> CD signallar beradi.
                  Bu ularga <strong className="text-white">bir xil UV-Vis spektriga</strong> ega bo'lsa ham, 
                  ularni <strong className="text-green-400">aniq ajratish</strong> imkonini beradi.
                </p>
              </div>
            </div>

            {/* IQ */}
            <div className="bg-gradient-to-br from-red-900/40 to-pink-900/40 border border-red-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-xl shadow-lg shadow-red-500/30">
                  📡
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">IQ spektroskopiya</h2>
              </div>
              
              <div className="space-y-3">
                {[
                  { freq: "3280-3100 cm⁻¹", bond: "ν(N−H)", desc: "NH₂ valent tebranish (simmetrik + asimmetrik)", intensity: "Kuchli" },
                  { freq: "2950-2850 cm⁻¹", bond: "ν(C−H)", desc: "CH₂ valent tebranish", intensity: "O'rta" },
                  { freq: "1580-1620 cm⁻¹", bond: "δ(NH₂)", desc: "NH₂ egilish (scissoring)", intensity: "Kuchli" },
                  { freq: "1460 cm⁻¹", bond: "δ(CH₂)", desc: "CH₂ egilish", intensity: "O'rta" },
                  { freq: "1040-1080 cm⁻¹", bond: "ν(C−N)", desc: "C-N valent tebranish", intensity: "Kuchli" },
                  { freq: "530-560 cm⁻¹", bond: "ν(Co−N)", desc: "Co-N valent (MUHIM!)", intensity: "O'rta" },
                ].map((item, i) => (
                  <div key={i} className="bg-red-950/50 rounded-xl p-4 border border-red-700/30">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-red-400 font-mono font-bold text-sm">{item.freq}</span>
                          <span className="text-white font-bold">{item.bond}</span>
                        </div>
                        <p className="text-purple-300 text-xs mt-1">{item.desc}</p>
                      </div>
                      <span className="text-red-300 text-xs px-2 py-1 bg-red-900/40 rounded">{item.intensity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* NMR */}
            <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  🧲
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">NMR spektroskopiya</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
                  <h3 className="text-purple-400 font-bold mb-2">¹H NMR (D₂O da)</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-300">δ (CH₂)</span>
                      <span className="text-white font-mono">2.8-3.2 ppm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">δ (NH₂)</span>
                      <span className="text-white font-mono">al exchange</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Barcha 12H</span>
                      <span className="text-white">Ekvivalent (D₃)</span>
                    </div>
                    <div className="bg-purple-900/40 rounded p-2 mt-2 border border-purple-700/30">
                      <p className="text-purple-300 text-xs">
                        <strong className="text-yellow-400">Eslatma:</strong> D₃ simmetriya tufayli barcha CH₂ guruhlari ekvivalent
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-indigo-950/50 rounded-xl p-5 border border-indigo-700/30">
                  <h3 className="text-indigo-400 font-bold mb-2">¹³C NMR</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-300">δ (CH₂)</span>
                      <span className="text-white font-mono">45-50 ppm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Signallar soni</span>
                      <span className="text-white">1 (barcha C ekvivalent)</span>
                    </div>
                    <div className="bg-indigo-900/40 rounded p-2 mt-2 border border-indigo-700/30">
                      <p className="text-indigo-300 text-xs">
                        <strong className="text-yellow-400">D₃:</strong> Barcha 6 ta C atomi simmetriya bilan ekvivalent
                      </p>
                    </div>
                  </div>
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
                  <h3 className="text-green-400 font-bold mb-3">1-usul: H₂O₂ bilan oksidlash (eng keng tarqalgan)</h3>
                  <div className="bg-green-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-green-300 border border-green-700/30">
                    2CoCl₂ + 6en + 2HCl + H₂O₂ → 2[Co(en)₃]Cl₃ + 2H₂O
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Mexanizm:</strong> Co²⁺ (labil) tez 3 ta en bilan bog'lanadi → [Co(en)₃]²⁺ → H₂O₂ bilan Co³⁺ gacha oksidlanadi (inert)</p>
                    <p><strong className="text-white">Sharoit:</strong> Xona harorati yoki biroz isitish (40-50°C)</p>
                    <p><strong className="text-white">Hosildorlik:</strong> ≈ 70-80%</p>
                    <p><strong className="text-yellow-300">Natija:</strong> Racemik aralashma (Δ + Λ, 1:1)</p>
                  </div>
                </div>

                <div className="bg-green-950/50 rounded-2xl p-5 border border-green-700/30">
                  <h3 className="text-green-400 font-bold mb-3">2-usul: CoCO₃ dan boshlash</h3>
                  <div className="bg-green-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-green-300 border border-green-700/30">
                    2CoCO₃ + 6en + 6HCl + H₂O₂ → 2[Co(en)₃]Cl₃ + 2CO₂ + 4H₂O
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Afzalligi:</strong> CoCO₃ toza, nam bo'lmagan reagent</p>
                    <p><strong className="text-white">CO₂</strong> gaz sifatida chiqib ketadi — mahsulot toza</p>
                  </div>
                </div>
              </div>
            </div>

            {/* LABORATORIYA PROTSESI */}
            <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">
                  🔬
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Laboratoriya protokoli</h2>
              </div>
              
              <div className="space-y-3">
                {[
                  { step: "1", title: "Reagentlar", desc: "CoCl₂·6H₂O (5 g), en (8 mL, 30% ortiqcha), HCl (kons.), H₂O₂ (30%)" },
                  { step: "2", title: "Eritish", desc: "CoCl₂·6H₂O ni 20 mL suvda eritish, en qo'shish (ehtiyot — ekzotermik!)" },
                  { step: "3", title: "HCl qo'shish", desc: "3 mL konsentrlangan HCl sekin qo'shiladi" },
                  { step: "4", title: "Oksidlash", desc: "H₂O₂ ni asta-sekin qo'shib, 50°C da 30 daqiqa qizdirish" },
                  { step: "5", title: "Rang o'zgarishi", desc: "Qizil-jigarrang (Co²⁺) → Sariq-jigarrang (Co³⁺) — monitoring" },
                  { step: "6", title: "Bug'latish", desc: "Eritmani yarmigacha bug'latish, sovutish" },
                  { step: "7", title: "Kristallizatsiya", desc: "Sariq kristallar cho'kadi — filtrlash, yuvish (sovuq etanol)" },
                  { step: "8", title: "Natija", desc: "Racemik [Co(en)₃]Cl₃ — agar kerak bo'lsa, rezolyutsiya qilinadi" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg">
                      {item.step}
                    </div>
                    <div className="flex-1 bg-blue-950/50 rounded-xl p-4 border border-blue-700/30">
                      <h3 className="text-blue-400 font-bold mb-1">{item.title}</h3>
                      <p className="text-purple-200 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-2xl p-5 mt-6">
                <h3 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                  <span>⚠️</span> Xavfsizlik eslatmalari
                </h3>
                <div className="space-y-1 text-sm text-purple-200">
                  <p>• <strong className="text-white">Etilendiamin</strong> — kuchli asos, teri va ko'zni qichishtiradi</p>
                  <p>• <strong className="text-white">H₂O₂ (30%)</strong> — kuchli oksidlovchi, ehtiyotkorlik bilan</p>
                  <p>• <strong className="text-white">Konsentrlangan HCl</strong> — bug'lari zaharli, shkaflarda ishlash kerak</p>
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
            {/* WERNER NOBEL */}
            <div className="bg-gradient-to-br from-yellow-900/40 to-amber-900/40 border border-yellow-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center text-xl shadow-lg shadow-yellow-500/30">
                  🏆
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Alfred Werner va Nobel mukofoti (1913)</h2>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-2xl p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-yellow-600 to-amber-600 flex items-center justify-center text-6xl flex-shrink-0 shadow-2xl">
                    👨‍🔬
                  </div>
                  <div className="flex-1">
                    <h3 className="text-yellow-400 font-bold text-xl mb-2">Alfred Werner (1866-1919)</h3>
                    <p className="text-purple-200 text-sm mb-3 leading-relaxed">
                      <strong className="text-yellow-300">[Co(en)₃]Cl₃</strong> Werner'ning eng buyuk eksperimental g'alabasi edi.
                      1911 yilda u bu kompleksning <strong className="text-white">optik izomerlarini</strong> birinchi bo'lib ajratdi —
                      bu <strong className="text-white">noorganik birikmalar ham xiral bo'lishi mumkin</strong> degan birinchi isbot edi!
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-xs text-yellow-300 font-semibold">
                        🏆 Nobel 1913
                      </span>
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-xs text-amber-300 font-semibold">
                        📍 Zurich universiteti
                      </span>
                      <span className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-xs text-green-300 font-semibold">
                        🔄 Birinchi noorganik rezolyutsiya
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-2xl p-5">
                <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                  <span>💡</span> Nega bu Nobel uchun hal qiluvchi edi?
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">1893 yildagi nazariya:</strong> Werner koordinatsion nazariyani taklif qildi, lekin 18 yil davomida tanqid qilindi</p>
                  <p>• <strong className="text-white">Jørgensenning e'tirozi:</strong> "Noorganik komplekslar xiral bo'la olmaydi, faqat organik molekulalar xiral"</p>
                  <p>• <strong className="text-yellow-300">1911 yilgi tajriba:</strong> Werner [Co(en)₃]³⁺ ni Δ va Λ izomerlarga ajratdi</p>
                  <p>• <strong className="text-green-400">Natija:</strong> Jørgensen tan oldi → Werner 1913 yilda Nobel oldi</p>
                </div>
              </div>
            </div>

            {/* TARIXIY XRONOLOGIYA */}
            <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  📜
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Tarixiy xronologiya</h2>
              </div>
              
              <div className="space-y-3">
                {[
                  { year: "1893", title: "Werner nazariyasi", desc: "27 yoshli Werner koordinatsion nazariyani e'lon qildi — lekin Jørgensen va boshqalar qarshi chiqdi" },
                  { year: "1890-1910", title: "20 yillik bahs", desc: "Werner vs Jørgensen — butun kimyo olami ikkiga bo'lindi" },
                  { year: "1911", title: "Buyuk tajriba", desc: "Werner va Victor (talaba) [Co(en)₃]³⁺ ni (+) va (-) enantiomerlarga ajratdi — birinchi noorganik rezolyutsiya!" },
                  { year: "1911", title: "Jørgensen tan oldi", desc: "18 yillik raqiblikdan keyin Jørgensen Werner'ning haqligini tan oldi" },
                  { year: "1913", title: "Nobel mukofoti", desc: "\"Kimyodagi xizmatlari uchun, ayniqsa molekulyar tuzilmalar bo'yicha tadqiqotlari uchun\"" },
                  { year: "1914", title: "Ikkinchi g'alaba", desc: "Werner [Co(en)₃]³⁺ va boshqa xiral komplekslarni ham ajratdi" },
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

            {/* REZOLYUTSIYA TAJRIBASI */}
            <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">
                  🔬
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">1911 yilgi rezolyutsiya tajribasi</h2>
              </div>
              
              <div className="bg-blue-950/50 rounded-2xl p-5 border border-blue-700/30 mb-6">
                <h3 className="text-blue-400 font-bold mb-3">Reaksiya sxemasi</h3>
                <div className="bg-blue-900/60 rounded-xl p-4 font-mono text-xs text-blue-200 border border-blue-700/30 space-y-2">
                  <p>1. (±)-[Co(en)₃]Cl₃ + (+)-tartar⁻ → Δ-(+)-tartrat + Λ-(+)-tartrat</p>
                  <p className="text-blue-300">   (racemik) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (diastereomerlar)</p>
                  <p>2. Fraksion kristallizatsiya:</p>
                  <p className="text-blue-300 pl-4">Λ-(+)-tartrat birinchi kristallanadi (kam eruvchan)</p>
                  <p className="text-blue-300 pl-4">Δ-(+)-tartrat eritmada qoladi</p>
                  <p>3. Har birini HCl bilan ishlov berish:</p>
                  <p className="text-blue-300 pl-4">Λ-(+)-tartrat + HCl → Λ-[Co(en)₃]Cl₃ + (+)-tartar kislotasi</p>
                  <p className="text-blue-300 pl-4">Δ-(+)-tartrat + HCl → Δ-[Co(en)₃]Cl₃ + (+)-tartar kislotasi</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-amber-950/50 rounded-xl p-4 border border-amber-700/30 text-center">
                  <div className="text-3xl mb-2">🧪</div>
                  <div className="text-amber-400 text-xs uppercase mb-1">Boshlanish</div>
                  <div className="text-white font-bold text-sm">Racemik aralashma</div>
                  <div className="text-amber-300 text-xs mt-1">(Δ + Λ, [α] = 0)</div>
                </div>
                <div className="bg-yellow-950/50 rounded-xl p-4 border border-yellow-700/30 text-center">
                  <div className="text-3xl mb-2">⚗️</div>
                  <div className="text-yellow-400 text-xs uppercase mb-1">Jarayon</div>
                  <div className="text-white font-bold text-sm">Diastereomerlar</div>
                  <div className="text-yellow-300 text-xs mt-1">Kristallizatsiya</div>
                </div>
                <div className="bg-green-950/50 rounded-xl p-4 border border-green-700/30 text-center">
                  <div className="text-3xl mb-2">✨</div>
                  <div className="text-green-400 text-xs uppercase mb-1">Natija</div>
                  <div className="text-white font-bold text-sm">Δ va Λ sof</div>
                  <div className="text-green-300 text-xs mt-1">[α] = ±89°</div>
                </div>
              </div>
            </div>

            {/* ZAMONAVIY QO'LLANILISH */}
            <div className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border border-emerald-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-xl shadow-lg shadow-emerald-500/30">
                  💡
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Zamonaviy qo'llanilishi</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: "🎓", title: "Ta'lim", desc: "Koordinatsion kimyo darslarida xelat effekti va optik izomeriyani o'rganish uchun klassik namuna" },
                  { icon: "🔬", title: "Tadqiqot", desc: "Stereochemistry va chiral recognition tadqiqotlarida model kompleks" },
                  { icon: "💊", title: "Tibbiyot tadqiqotlari", desc: "Xiral dori moddalarni aniqlashda chiral probe sifatida" },
                  { icon: "📊", title: "Analitik kimyo", desc: "CD spektroskopiyani kalibrlash uchun standart" },
                ].map((item, i) => (
                  <div key={i} className="bg-emerald-950/50 rounded-xl p-5 border border-emerald-700/30">
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <h3 className="text-emerald-400 font-bold mb-1">{item.title}</h3>
                    <p className="text-purple-200 text-sm">{item.desc}</p>
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
              href="/ilmiy/birikmares/co-nh3-4-cl2-cl"
              onClick={(e) => { e.preventDefault(); window.history.back(); }}
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold transition-all flex items-center gap-2"
            >
              <span>←</span>
              <span className="hidden sm:inline">[Co(NH₃)₄Cl₂]Cl</span>
            </Link>
            <Link 
              href="/ilmiy/birikmares/co-en2-cl2-cl"
              onClick={(e) => { e.preventDefault(); alert('Keyingi sahifa: [Co(en)₂Cl₂]Cl'); }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold transition-all shadow-lg shadow-amber-500/30 flex items-center gap-2"
            >
              <span className="hidden sm:inline">[Co(en)₂Cl₂]Cl</span>
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