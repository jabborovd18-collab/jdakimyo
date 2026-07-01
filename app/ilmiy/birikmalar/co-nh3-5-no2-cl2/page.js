"use client"

import Link from "next/link"
import { useState } from "react"

export default function CoNH35NO2Cl2() {
  const [activeTab, setActiveTab] = useState("overview")
  const [activeIsomer, setActiveIsomer] = useState("nitro") // nitro | nitrito

  const tabs = [
    { id: "overview", label: "📋 Umumiy", icon: "📋" },
    { id: "linkage", label: "🔗 Linkage izomeriya", icon: "🔗" },
    { id: "structure", label: "🧬 Tuzilish", icon: "🧬" },
    { id: "electronic", label: "⚛️ Elektron", icon: "⚛️" },
    { id: "spectroscopy", label: "🔬 Spektroskopiya", icon: "🔬" },
    { id: "isomerization", label: "🔄 Izomerlanish", icon: "🔄" },
    { id: "synthesis", label: "⚗️ Sintez", icon: "⚗️" },
    { id: "history", label: "🏆 Tarix", icon: "🏆" },
  ]

  const isomerData = {
    nitro: {
      name: "[Co(NH₃)₅NO₂]²⁺",
      commonName: "Nitrokobalt (sariq)",
      color: "Sariq",
      pointGroup: "C₄ᵥ",
      bonding: "Co−N−O₂ (N orqali)",
      wavelength: "λmax ≈ 490 nm",
      cfse: "-2.4 Δₒ",
      stability: "Termodinamik barqaror"
    },
    nitrito: {
      name: "[Co(NH₃)₅ONO]²⁺",
      commonName: "Nitritokobalt (qizil)",
      color: "Qizil",
      pointGroup: "C₄ᵥ (buzilgan)",
      bonding: "Co−O−N=O (O orqali)",
      wavelength: "λmax ≈ 460 nm",
      cfse: "-2.4 Δₒ",
      stability: "Kinetik mahsulot (metastabil)"
    },
  }

  const current = isomerData[activeIsomer]

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0118] via-amber-950/30 to-slate-950 text-white relative overflow-hidden">
      
      {/* ═══ ANIMATED BACKGROUND ═══ */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(245,158,11,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        {['Co³⁺', 'NO₂⁻', 'ONO⁻', 'linkage', 'ambidentat', 'C₄ᵥ', 'Jørgensen 1894'].map((sym, i) => (
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
            <span className="text-amber-400 font-semibold">[Co(NH₃)₅NO₂]Cl₂</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-red-500/20 border border-amber-500/30 text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                  🔗 Linkage izomeriya
                </span>
                <span className="px-2.5 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-[10px] text-yellow-300 font-semibold">
                  🧪 Ambidentat ligand
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] text-emerald-300 font-semibold">
                  ⚛️ d⁶ quyi spinli
                </span>
                <span className="px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-[10px] text-red-300 font-semibold">
                  📜 Jørgensen 1894
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-amber-400 via-orange-400 to-red-300 bg-clip-text text-transparent">
                [Co(NH₃)₅NO₂]Cl₂
              </h1>
              <p className="text-purple-300 text-sm mt-1">
                Pentaamminnitrokobalt(III) xlorid • Pentaamminenitrocobalt(III) chloride
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
            { label: "Formula", value: "[Co(NH₃)₅NO₂]Cl₂", icon: "🧪", color: "text-amber-400" },
            { label: "M massa", value: "278.44 g/mol", icon: "⚖️", color: "text-blue-400" },
            { label: "Geometriya", value: "Oktaedrik (C₄ᵥ)", icon: "💎", color: "text-purple-400" },
            { label: "Kompleks rangi", value: "Sariq / Qizil", icon: "🎨", color: "text-pink-400" },
            { label: "Ligand turi", value: "Ambidentat", icon: "🔗", color: "text-red-400" },
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

      {/* ═══ ISOMER SWITCHER ═══ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 mb-8">
        <div className="bg-gradient-to-r from-amber-900/30 via-red-900/30 to-amber-900/30 border border-amber-500/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🔗</span>
            <span className="text-sm font-bold text-white">Linkage izomerni tanlang:</span>
            <span className="text-xs text-amber-300 ml-auto">(ambidentat NO₂⁻ ligandi)</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setActiveIsomer("nitro")}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                activeIsomer === "nitro"
                  ? 'bg-gradient-to-br from-amber-600/40 to-yellow-600/40 border-amber-400/60 shadow-lg shadow-amber-500/20'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              {activeIsomer === "nitro" && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold">✓</div>
              )}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center text-2xl shadow-lg">
                  💛
                </div>
                <div className="text-left">
                  <div className="font-bold text-white">Nitro-izomer</div>
                  <div className="text-xs text-amber-300">Co−N−O₂ (N-bog'langan)</div>
                  <div className="text-[10px] text-amber-400 font-mono">Sariq • Barqaror</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setActiveIsomer("nitrito")}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                activeIsomer === "nitrito"
                  ? 'bg-gradient-to-br from-red-600/40 to-orange-600/40 border-red-400/60 shadow-lg shadow-red-500/20'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              {activeIsomer === "nitrito" && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">✓</div>
              )}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-2xl shadow-lg">
                  ❤️
                </div>
                <div className="text-left">
                  <div className="font-bold text-white">Nitrito-izomer</div>
                  <div className="text-xs text-red-300">Co−O−N=O (O-bog'langan)</div>
                  <div className="text-[10px] text-red-400 font-mono">Qizil • Metastabil</div>
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
                  ? 'bg-gradient-to-r from-amber-500 to-red-500 text-white shadow-lg shadow-amber-500/30'
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
            <div className="bg-gradient-to-br from-amber-900/40 to-red-900/40 border border-amber-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-red-500 flex items-center justify-center text-xl shadow-lg shadow-amber-500/30">
                  📋
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Asosiy ma'lumotlar — {current.commonName}</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  ["CAS (nitro)", "14878-56-9"],
                  ["CAS (nitrito)", "14970-14-0"],
                  ["Zichlik", "~1.80 g/cm³"],
                  ["Sistema", "Monoklinik"],
                  ["Eruvchanlik (H₂O)", "Yaxshi eriydi"],
                  ["Eruvchanlik (EtOH)", "Kam eriydi"],
                  ["Barqarorlik", current.stability],
                  ["Rangi", current.color],
                ].map((item, i) => (
                  <div key={i} className="bg-amber-950/50 rounded-xl p-3 border border-amber-700/30">
                    <div className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold mb-1">{item[0]}</div>
                    <div className="text-white font-semibold text-sm">{item[1]}</div>
                  </div>
                ))}
              </div>

              {/* ICHKI/TASHQI SFERA */}
              <div className="bg-gradient-to-r from-amber-500/10 to-red-500/10 border border-amber-500/20 rounded-2xl p-5">
                <h3 className="text-amber-400 font-bold mb-3 flex items-center gap-2">
                  <span>💎</span> Ichki va tashqi sfera
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-amber-900/30 rounded-xl p-4 border border-amber-700/30">
                    <h4 className="text-amber-300 font-bold text-sm mb-2">🔒 Ichki sfera [Co(NH₃)₅NO₂]²⁺</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">Co³⁺</strong> — markaziy ion (d⁶)</li>
                      <li>• <strong className="text-white">5 × NH₃</strong> — ammiak ligandlari</li>
                      <li>• <strong className="text-white">1 × NO₂⁻</strong> — nitrit ioni (ambidentat!)</li>
                      <li>• <strong className="text-yellow-300">Zaryad:</strong> +3 + 0 + (−1) = <strong>+2</strong></li>
                      <li>• <strong className="text-amber-300">Bog'lanish:</strong> {current.bonding}</li>
                    </ul>
                  </div>
                  <div className="bg-red-900/30 rounded-xl p-4 border border-red-700/30">
                    <h4 className="text-red-300 font-bold text-sm mb-2">🔓 Tashqi sfera 2Cl⁻</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">2 × Cl⁻</strong> — counter-ionlar</li>
                      <li>• Ion bog'lar bilan bog'langan</li>
                      <li>• Suvda darhol dissotsilanadi</li>
                      <li>• AgNO₃ bilan <strong className="text-green-400">darhol cho'kadi</strong></li>
                      <li>• <strong className="text-yellow-300">2 mol AgCl</strong> cho'kma</li>
                      <li>• <strong className="text-white">3 ion:</strong> [Co(NH₃)₅NO₂]²⁺ + 2Cl⁻</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* XULOSA */}
            <div className="bg-gradient-to-r from-amber-600/10 via-red-600/10 to-orange-600/10 border border-amber-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>✅</span> Asosiy xulosalar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "🔗 <strong>Linkage izomeriya:</strong> NO₂⁻ N yoki O orqali bog'lanishi mumkin",
                  "🎨 <strong>Ikki xil rang:</strong> nitro = sariq, nitrito = qizil",
                  "⚛️ <strong>d⁶ quyi spinli:</strong> KMBE = −2.4Δₒ, diamagnit",
                  "⚖️ <strong>Termodinamik:</strong> nitro barqaror, nitrito metastabil",
                  "🔄 <strong>Izomerlanish:</strong> UV yorug'lik yoki issiqlik bilan nitrito → nitro",
                  "📜 <strong>Jørgensen 1894:</strong> Birinchi linkage izomer kashfiyoti",
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
        {/* LINKAGE TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "linkage" && (
          <>
            <div className="bg-gradient-to-br from-amber-900/40 to-red-900/40 border border-amber-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-red-500 flex items-center justify-center text-xl shadow-lg shadow-amber-500/30">
                  🔗
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Linkage (bog'lanish) izomeriya</h2>
              </div>
              
              <div className="bg-gradient-to-r from-amber-500/10 to-red-500/10 border border-amber-500/20 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-amber-400">Linkage izomeriya</strong> — bu <strong className="text-white">ambidentat ligand</strong> 
                  (ikki yoki undan ortiq donor atomiga ega ligand) metallga turli atomlar orqali bog'langanda yuzaga keladigan 
                  <strong className="text-yellow-300"> strukturaviy izomeriya</strong> turi.
                  <strong className="text-white"> NO₂⁻</strong> (nitrit) ioni — klassik ambidentat ligand: u 
                  <strong className="text-amber-300"> N</strong> yoki <strong className="text-red-300">O</strong> atomi orqali bog'lanishi mumkin.
                </p>
              </div>

              {/* TAQQOSLASH */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* NITRO */}
                <div className="bg-gradient-to-br from-amber-900/40 to-yellow-900/40 rounded-2xl p-6 border-2 border-amber-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center text-2xl shadow-lg">
                      💛
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-amber-300">Nitro-izomer</h3>
                      <p className="text-amber-400 text-xs">Co−N−O₂ (N orqali)</p>
                    </div>
                  </div>

                  <div className="bg-amber-950/60 rounded-xl p-4 mb-4 font-mono text-xs text-amber-200 border border-amber-700/30">
                    <pre className="whitespace-pre">{`          O
          ||
   Co — N
          \\
           O

  N atomi Co ga bevosita bog'langan
  (nitro guruhi: −NO₂)`}</pre>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-300">Bog'lanish:</span>
                      <span className="text-white font-bold">Co−N (σ + π)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Rang:</span>
                      <span className="text-amber-300 font-bold">Sariq</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Barqarorlik:</span>
                      <span className="text-green-400 font-bold">Termodinamik</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">λ<sub>max</sub>:</span>
                      <span className="text-white font-mono">490 nm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">ν(NO₂):</span>
                      <span className="text-white font-mono">1420, 1310 cm⁻¹</span>
                    </div>
                  </div>
                </div>

                {/* NITRITO */}
                <div className="bg-gradient-to-br from-red-900/40 to-orange-900/40 rounded-2xl p-6 border-2 border-red-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-2xl shadow-lg">
                      ❤️
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-red-300">Nitrito-izomer</h3>
                      <p className="text-red-400 text-xs">Co−O−N=O (O orqali)</p>
                    </div>
                  </div>

                  <div className="bg-red-950/60 rounded-xl p-4 mb-4 font-mono text-xs text-red-200 border border-red-700/30">
                    <pre className="whitespace-pre">{`          N=O
         /
   Co — O

  O atomi Co ga bevosita bog'langan
  (nitrito guruhi: −ONO)`}</pre>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-300">Bog'lanish:</span>
                      <span className="text-white font-bold">Co−O (σ)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Rang:</span>
                      <span className="text-red-300 font-bold">Qizil</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Barqarorlik:</span>
                      <span className="text-red-300 font-bold">Metastabil</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">λ<sub>max</sub>:</span>
                      <span className="text-white font-mono">460 nm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">ν(N=O):</span>
                      <span className="text-white font-mono">1460, 1060 cm⁻¹</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AMBIDENTAT LIGANDLAR */}
            <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  🧪
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Boshqa ambidentat ligandlar</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-purple-950/60">
                    <tr>
                      <th className="py-3 px-4 text-purple-300 text-left">Ligand</th>
                      <th className="py-3 px-4 text-purple-300 text-left">Donor atomlar</th>
                      <th className="py-3 px-4 text-purple-300 text-left">Izomer 1</th>
                      <th className="py-3 px-4 text-purple-300 text-left">Izomer 2</th>
                    </tr>
                  </thead>
                  <tbody className="text-purple-200">
                    <tr className="border-b border-purple-800/30 bg-amber-900/20">
                      <td className="py-3 px-4 font-bold text-amber-300">NO₂⁻ ← Siz</td>
                      <td className="py-3 px-4">N, O</td>
                      <td className="py-3 px-4 text-amber-300">nitro (M−N)</td>
                      <td className="py-3 px-4 text-red-300">nitrito (M−O)</td>
                    </tr>
                    <tr className="border-b border-purple-800/30">
                      <td className="py-3 px-4 font-bold text-white">SCN⁻</td>
                      <td className="py-3 px-4">S, N</td>
                      <td className="py-3 px-4">tiotsianato (M−S)</td>
                      <td className="py-3 px-4">izotiotsianato (M−N)</td>
                    </tr>
                    <tr className="border-b border-purple-800/30">
                      <td className="py-3 px-4 font-bold text-white">CN⁻</td>
                      <td className="py-3 px-4">C, N</td>
                      <td className="py-3 px-4">siano (M−C)</td>
                      <td className="py-3 px-4">izosiano (M−N)</td>
                    </tr>
                    <tr className="border-b border-purple-800/30">
                      <td className="py-3 px-4 font-bold text-white">OCN⁻</td>
                      <td className="py-3 px-4">O, N</td>
                      <td className="py-3 px-4">sianato (M−O)</td>
                      <td className="py-3 px-4">izosianato (M−N)</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-white">S₂O₃²⁻</td>
                      <td className="py-3 px-4">S, O</td>
                      <td className="py-3 px-4">tiosulfato (M−S)</td>
                      <td className="py-3 px-4">O-bog'langan</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-2xl p-5 mt-6">
                <h3 className="text-purple-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> HSAB nazariyasi bo'yicha
                </h3>
                <p className="text-purple-200 text-sm">
                  <strong className="text-white">Qattiq kislotalar</strong> (Co³⁺, Fe³⁺) — <strong className="text-yellow-300">qattiq asoslar</strong> bilan (N, O) bog'lanishni afzal ko'radi.
                  <strong className="text-white"> Yumshoq kislotalar</strong> (Pt²⁺, Pd²⁺) — <strong className="text-yellow-300">yumshoq asoslar</strong> bilan (S, C) bog'lanishni afzal ko'radi.
                </p>
                <p className="text-purple-300 text-xs mt-2">
                  Shuning uchun Co³⁺ bilan <strong className="text-amber-300">nitro (N-bog'langan)</strong> barqaror, 
                  lekin Pt²⁺ bilan <strong className="text-red-300">tiotsianato (S-bog'langan)</strong> barqaror.
                </p>
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
                <h2 className="text-xl md:text-2xl font-bold text-white">{current.name} — Geometriya</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-purple-400 font-bold text-sm uppercase tracking-wider">Geometrik parametrlar</h3>
                  <div className="space-y-2">
                    {[
                      ["Geometriya", "Buzilgan oktaedrik"],
                      ["Nuqtali guruh", "C₄ᵥ"],
                      ["Co−N(NH₃) masofa", "1.94 Å (4 ta)"],
                      ["Co−N(NO₂) masofa", "1.96 Å (nitro)"],
                      ["Co−O(ONO) masofa", "2.05 Å (nitrito)"],
                      ["N−O masofa", "1.21 Å (nitro)"],
                      ["O−N masofa", "1.30 Å (nitrito)"],
                      ["N=O masofa", "1.18 Å (nitrito)"],
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-purple-800/30">
                        <span className="text-purple-300 text-sm">{item[0]}</span>
                        <span className="text-white font-semibold text-sm font-mono">{item[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-amber-400 font-bold text-sm uppercase tracking-wider">C₄ᵥ simmetriya elementlari</h3>
                  <div className="space-y-2">
                    {[
                      ["E", "Ayniylik"],
                      ["2C₄", "Asosiy o'q bo'ylab (90° va 270°)"],
                      ["C₂", "C₄ ning kvadrati (180°)"],
                      ["2σᵥ", "Vertikal tekisliklar"],
                      ["2σₐ", "Diagonal tekisliklar"],
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-1.5 border-b border-amber-800/30">
                        <span className="text-amber-300 text-sm font-mono font-bold">{item[0]}</span>
                        <span className="text-purple-200 text-xs">{item[1]}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-amber-950/50 rounded-xl p-3 border border-amber-700/30 mt-3">
                    <p className="text-amber-200 text-xs">
                      <strong className="text-amber-400">Jami:</strong> 8 ta simmetriya operatsiyasi.
                      <strong className="text-yellow-300"> σₕ va i yo'q</strong> — lekin σᵥ bor, shuning uchun axiral (optik faol emas).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* BOG'LANISH FARQI */}
            <div className="bg-gradient-to-br from-red-900/40 to-orange-900/40 border border-red-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-xl shadow-lg shadow-red-500/30">
                  🔬
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Nitro vs Nitrito — bog'lanish tabiati</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-amber-950/50 rounded-xl p-5 border border-amber-700/30">
                  <h3 className="text-amber-400 font-bold mb-3">💛 Nitro (Co−N−O₂)</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">σ-bog':</strong> N ning sp² orbitali → Co d-orbitaliga</p>
                    <p>• <strong className="text-white">π-bog':</strong> NO₂⁻ ning π* orbitali ← Co d-elektronlari (back-bonding)</p>
                    <p>• <strong className="text-white">Simmetrik:</strong> ikkala N−O bog' ekvivalent (1.21 Å)</p>
                    <p>• <strong className="text-yellow-300">Kuchliroq bog':</strong> σ + π</p>
                  </div>
                </div>

                <div className="bg-red-950/50 rounded-xl p-5 border border-red-700/30">
                  <h3 className="text-red-400 font-bold mb-3">❤️ Nitrito (Co−O−N=O)</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">σ-bog':</strong> O ning sp² orbitali → Co d-orbitaliga</p>
                    <p>• <strong className="text-white">π-bog':</strong> zaif (O kamroq π-akseptor)</p>
                    <p>• <strong className="text-white">Asimmetrik:</strong> O−N (1.30 Å) va N=O (1.18 Å) turli</p>
                    <p>• <strong className="text-red-300">Kuchsizroq bog':</strong> faqat σ</p>
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
                  <div className="text-white font-mono font-bold">t₂g⁶ e₉⁰</div>
                  <div className="text-green-400 text-xs mt-1">Quyi spinli (LS)</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-5">
                <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                  <span>💡</span> Ikkala izomerda ham bir xil elektron tuzilish
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">NO₂⁻</strong> va <strong className="text-white">ONO⁻</strong> — ikkalasi ham o'rta-kuchli maydonli ligand</p>
                  <p>• <strong className="text-white">Co³⁺</strong> uchun Δₒ ≈ 23,000 cm⁻¹ (nitro) yoki 22,500 cm⁻¹ (nitrito)</p>
                  <p>• <strong className="text-yellow-300">Δₒ &gt; P</strong> → <strong className="text-green-400">quyi spinli</strong></p>
                  <p>• Barcha 6 ta elektron t₂g da → <strong className="text-white">diamagnit</strong></p>
                </div>
              </div>
            </div>

            {/* KMBE */}
            <div className="bg-gradient-to-br from-purple-900/40 to-violet-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  📊
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">KMBE hisoblash</h2>
              </div>
              
              <div className="bg-violet-950/50 rounded-2xl p-5 border border-violet-700/30">
                <div className="bg-violet-900/60 rounded-xl p-4 font-mono text-sm text-violet-200 border border-violet-700/30 mb-4">
                  <p>KMBE = 6 × (−0.4Δₒ) + 0 × (+0.6Δₒ)</p>
                  <p className="text-white font-bold text-lg mt-2">KMBE = −2.4Δₒ</p>
                </div>
                <p className="text-purple-300 text-xs">
                  Ikkala izomerda ham bir xil KMBE — farq faqat <strong className="text-white">geometrik tuzilish</strong> va <strong className="text-white">bog'lanish tabiati</strong>da.
                </p>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-amber-950/50 rounded-xl p-5 border border-amber-700/30">
                  <h3 className="text-amber-400 font-bold mb-2">💛 Nitro-izomer</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-300">¹A₁ → ¹T₁g</span>
                      <span className="text-white font-mono">490 nm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">¹A₁ → ¹T₂g</span>
                      <span className="text-white font-mono">360 nm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Rang</span>
                      <span className="text-amber-300 font-bold">Sariq</span>
                    </div>
                  </div>
                </div>

                <div className="bg-red-950/50 rounded-xl p-5 border border-red-700/30">
                  <h3 className="text-red-400 font-bold mb-2">❤️ Nitrito-izomer</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-300">¹A₁ → ¹T₁g</span>
                      <span className="text-white font-mono">460 nm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">¹A₁ → ¹T₂g</span>
                      <span className="text-white font-mono">340 nm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Rang</span>
                      <span className="text-red-300 font-bold">Qizil</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* IQ */}
            <div className="bg-gradient-to-br from-red-900/40 to-pink-900/40 border border-red-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-xl shadow-lg shadow-red-500/30">
                  📡
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">IQ spektroskopiya — asosiy diagnostik usul</h2>
              </div>
              
              <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm">
                  <strong className="text-red-400">IQ spektroskopiya</strong> — linkage izomerlarni aniqlashning <strong className="text-white">eng kuchli usuli</strong>.
                  NO₂⁻ va ONO⁻ guruhlari <strong className="text-yellow-300">butunlay boshqa cho'qqilar</strong> beradi.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-amber-950/50 rounded-xl p-5 border border-amber-700/30">
                  <h3 className="text-amber-400 font-bold mb-3">💛 Nitro-izomer cho'qqilari</h3>
                  <div className="space-y-2">
                    {[
                      { freq: "1420 cm⁻¹", bond: "νₐₛ(NO₂)", desc: "Asimmetrik cho'zilish", intensity: "Kuchli" },
                      { freq: "1310 cm⁻¹", bond: "νₛ(NO₂)", desc: "Simmetrik cho'zilish", intensity: "Kuchli" },
                      { freq: "830 cm⁻¹", bond: "δ(NO₂)", desc: "Egilish (scissoring)", intensity: "O'rta" },
                      { freq: "490 cm⁻¹", bond: "ν(Co−N)", desc: "Co-N(NO₂) bog'", intensity: "O'rta" },
                    ].map((item, i) => (
                      <div key={i} className="bg-amber-900/40 rounded-lg p-2 border border-amber-700/30">
                        <div className="flex justify-between items-center">
                          <span className="text-amber-400 font-mono text-xs">{item.freq}</span>
                          <span className="text-white text-xs">{item.bond}</span>
                        </div>
                        <p className="text-purple-300 text-[10px] mt-0.5">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-red-950/50 rounded-xl p-5 border border-red-700/30">
                  <h3 className="text-red-400 font-bold mb-3">❤️ Nitrito-izomer cho'qqilari</h3>
                  <div className="space-y-2">
                    {[
                      { freq: "1460 cm⁻¹", bond: "ν(N=O)", desc: "N=O cho'zilish", intensity: "Juda kuchli" },
                      { freq: "1060 cm⁻¹", bond: "ν(O−N)", desc: "O-N cho'zilish", intensity: "Kuchli" },
                      { freq: "820 cm⁻¹", bond: "δ(ONO)", desc: "Egilish", intensity: "O'rta" },
                      { freq: "450 cm⁻¹", bond: "ν(Co−O)", desc: "Co-O(ONO) bog'", intensity: "O'rta" },
                    ].map((item, i) => (
                      <div key={i} className="bg-red-900/40 rounded-lg p-2 border border-red-700/30">
                        <div className="flex justify-between items-center">
                          <span className="text-red-400 font-mono text-xs">{item.freq}</span>
                          <span className="text-white text-xs">{item.bond}</span>
                        </div>
                        <p className="text-purple-300 text-[10px] mt-0.5">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-2xl p-5 mt-6">
                <h3 className="text-red-400 font-bold mb-2 flex items-center gap-2">
                  <span>🎯</span> Diagnostik qoida
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-amber-300">Nitro:</strong> ν(NO₂) ≈ 1420 va 1310 cm⁻¹ (ikki yaqin cho'qqi)</p>
                  <p>• <strong className="text-red-300">Nitrito:</strong> ν(N=O) ≈ 1460 va ν(O−N) ≈ 1060 cm⁻¹ (ikki uzoq cho'qqi)</p>
                  <p className="text-xs text-purple-400 mt-2">
                    Bu farq IQ spektrida <strong className="text-white">darhol ko'rinadi</strong> — linkage izomerlarni aniqlashning eng oson usuli.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* ISOMERIZATION TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "isomerization" && (
          <>
            <div className="bg-gradient-to-br from-amber-900/40 to-red-900/40 border border-amber-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-red-500 flex items-center justify-center text-xl shadow-lg shadow-amber-500/30">
                  🔄
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Linkage izomerlanish mexanizmi</h2>
              </div>
              
              <div className="bg-gradient-to-r from-amber-500/10 to-red-500/10 border border-amber-500/20 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-amber-400">Nitrito → nitro</strong> izomerlanishi — bu <strong className="text-white">intramolekulyar jarayon</strong>.
                  NO₂⁻ ligandi metall atrofida <strong className="text-yellow-300">aylanib</strong>, N atomi orqali bog'lanadi.
                  Bu jarayon <strong className="text-white">issiqlik</strong> yoki <strong className="text-white">UV yorug'lik</strong> bilan tezlashadi.
                </p>
              </div>

              {/* REAKSIYA */}
              <div className="bg-amber-950/50 rounded-2xl p-5 border border-amber-700/30 mb-6">
                <h3 className="text-amber-400 font-bold mb-3">Reaksiya</h3>
                <div className="bg-amber-900/60 rounded-xl p-4 font-mono text-sm text-amber-200 border border-amber-700/30 text-center">
                  <p>[Co(NH₃)₅(ONO)]²⁺ → [Co(NH₃)₅(NO₂)]²⁺</p>
                  <p className="text-amber-300 text-xs mt-2">(qizil, metastabil) → (sariq, barqaror)</p>
                </div>
              </div>

              {/* MEXANIZM */}
              <div className="space-y-3">
                {[
                  { step: "1", title: "Boshlang'ich holat", desc: "Co−O−N=O (nitrito) — kinetik mahsulot, metastabil" },
                  { step: "2", title: "Faollanish", desc: "UV yorug'lik (λ < 400 nm) yoki issiqlik (80°C) bilan Co−O bog'i uziladi" },
                  { step: "3", title: "Oraliq holat", desc: "NO₂⁻ erkin aylanadi (Co dan uzoqlashmasdan)" },
                  { step: "4", title: "Qayta bog'lanish", desc: "N atomi Co ga yaqinlashadi va σ-bog' hosil qiladi" },
                  { step: "5", title: "Yakuniy holat", desc: "Co−NO₂ (nitro) — termodinamik barqaror mahsulot" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-red-500 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg">
                      {item.step}
                    </div>
                    <div className="flex-1 bg-amber-950/50 rounded-xl p-4 border border-amber-700/30">
                      <h3 className="text-amber-400 font-bold mb-1">{item.title}</h3>
                      <p className="text-purple-200 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* KINETIKA */}
            <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">
                  ⏱️
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Kinetik ma'lumotlar</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-950/50 rounded-xl p-5 border border-blue-700/30 text-center">
                  <div className="text-3xl mb-2">🌡️</div>
                  <div className="text-blue-400 text-xs uppercase mb-1">Xona harorati (25°C)</div>
                  <div className="text-white font-bold text-lg">t₁/₂ ≈ kunlar</div>
                  <div className="text-purple-300 text-xs mt-1">Sekin izomerlanish</div>
                </div>
                <div className="bg-indigo-950/50 rounded-xl p-5 border border-indigo-700/30 text-center">
                  <div className="text-3xl mb-2">🔥</div>
                  <div className="text-indigo-400 text-xs uppercase mb-1">80°C da</div>
                  <div className="text-white font-bold text-lg">t₁/₂ ≈ soatlar</div>
                  <div className="text-purple-300 text-xs mt-1">Tezlashadi</div>
                </div>
                <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30 text-center">
                  <div className="text-3xl mb-2">☀️</div>
                  <div className="text-purple-400 text-xs uppercase mb-1">UV yorug'lik</div>
                  <div className="text-white font-bold text-lg">t₁/₂ ≈ daqiqalar</div>
                  <div className="text-purple-300 text-xs mt-1">Fotokimyoviy</div>
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
                  <h3 className="text-green-400 font-bold mb-3">1-usul: Nitrito-izomerni olish (kinetik mahsulot)</h3>
                  <div className="bg-green-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-green-300 border border-green-700/30">
                    [Co(NH₃)₅Cl]Cl₂ + NaNO₂ → [Co(NH₃)₅(ONO)]Cl₂ + NaCl
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Sharoit:</strong> 0-5°C (sovuq), qisqa vaqt</p>
                    <p><strong className="text-white">Mexanizm:</strong> Cl⁻ ning o'rnini ONO⁻ egallaydi (tez, kinetik)</p>
                    <p><strong className="text-white">Natija:</strong> <span className="text-red-300 font-bold">Qizil</span> nitrito-izomer</p>
                  </div>
                </div>

                <div className="bg-green-950/50 rounded-2xl p-5 border border-green-700/30">
                  <h3 className="text-green-400 font-bold mb-3">2-usul: Nitro-izomerni olish (termodinamik mahsulot)</h3>
                  <div className="bg-green-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-green-300 border border-green-700/30">
                    [Co(NH₃)₅(ONO)]Cl₂ → [Co(NH₃)₅(NO₂)]Cl₂ (qizdirish)
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Sharoit:</strong> 80°C da 1-2 soat yoki UV yorug'lik</p>
                    <p><strong className="text-white">Mexanizm:</strong> ONO⁻ → NO₂⁻ izomerlanish (sekin, termodinamik)</p>
                    <p><strong className="text-white">Natija:</strong> <span className="text-amber-300 font-bold">Sariq</span> nitro-izomer</p>
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
                  { step: "1", title: "Boshlang'ich modda", desc: "[Co(NH₃)₅Cl]Cl₂ (5 g) ni 50 mL suvda eritish" },
                  { step: "2", title: "Sovutish", desc: "Muzli suvda 0-5°C gacha sovutish (nitrito uchun muhim!)" },
                  { step: "3", title: "NaNO₂ qo'shish", desc: "NaNO₂ (2 g) ni sekin qo'shib, aralashtirish" },
                  { step: "4", title: "Rang kuzatish", desc: "Binafsha → qizil (nitrito hosil bo'ldi)" },
                  { step: "5", title: "Filtratsiya", desc: "Qizil kristallarni tez filtrlash (sovuqda!)" },
                  { step: "6", title: "Izomerlanish", desc: "Qizil kristallarni 80°C da qizdirish → sariq (nitro)" },
                  { step: "7", title: "Tekshirish", desc: "IQ spektr: nitro (1420, 1310) vs nitrito (1460, 1060)" },
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Jørgensen kashfiyoti (1894)</h2>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-2xl p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-yellow-600 to-amber-600 flex items-center justify-center text-6xl flex-shrink-0 shadow-2xl">
                    👨‍🔬
                  </div>
                  <div className="flex-1">
                    <h3 className="text-yellow-400 font-bold text-xl mb-2">Sophus Mads Jørgensen (1840-1914)</h3>
                    <p className="text-purple-200 text-sm mb-3 leading-relaxed">
                      <strong className="text-yellow-300">1894 yilda</strong> Daniyalik kimyogar Jørgensen birinchi bo'lib 
                      <strong className="text-white"> linkage izomeriya</strong>ni kashf qildi. U [Co(NH₃)₅NO₂]²⁺ va 
                      [Co(NH₃)₅ONO]²⁺ ni sintez qildi va ularning <strong className="text-white">turli xil rang va xususiyatlarga</strong> 
                      ega ekanligini ko'rsatdi.
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-xs text-yellow-300 font-semibold">
                        📜 1894 yil
                      </span>
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-xs text-amber-300 font-semibold">
                        📍 Kopengagen
                      </span>
                      <span className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-xs text-red-300 font-semibold">
                        🔗 Birinchi linkage izomer
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-2xl p-5">
                <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                  <span>💡</span> Nima uchun bu muhim?
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• Bu <strong className="text-white">birinchi strukturaviy izomeriya</strong> turi edi — bir xil formula, lekin turli bog'lanish</p>
                  <p>• Werner'ning koordinatsion nazariyasini <strong className="text-yellow-300">tasdiqladi</strong> — ligandlar metallga bevosita bog'langan</p>
                  <p>• <strong className="text-white">Ambidentat ligand</strong> tushunchasini kiritdi — bir ligand turli atomlar orqali bog'lanishi mumkin</p>
                  <p>• Zamonaviy <strong className="text-white">bioinorganik kimyo</strong> uchun asos — gemoglobin, xlorofill va h.k.</p>
                </div>
              </div>
            </div>

            {/* XRONOLOGIYA */}
            <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  📜
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Tarixiy xronologiya</h2>
              </div>
              
              <div className="space-y-3">
                {[
                  { year: "1894", title: "Jørgensen kashfiyoti", desc: "Birinchi linkage izomerlar: [Co(NH₃)₅NO₂]²⁺ (sariq) va [Co(NH₃)₅ONO]²⁺ (qizil)" },
                  { year: "1895", title: "Werner tasdiqlashi", desc: "Werner bu natijalarni o'zining koordinatsion nazariyasi bilan tushuntirdi" },
                  { year: "1907", title: "Boshqa linkage izomerlar", desc: "SCN⁻ (S- yoki N-bog'langan) va CN⁻ (C- yoki N-bog'langan) kashf etildi" },
                  { year: "1960", title: "Mexanizm tushunilishi", desc: "Fotokimyoviy va termal izomerlanish mexanizmlari o'rganildi" },
                  { year: "1980+", title: "Zamonaviy qo'llanilish", desc: "Fotoxromik materiallar, molekulalar switchlar, bioorganometallik kimyo" },
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
              href="/ilmiy/birikmares/ca-edta"
              onClick={(e) => { e.preventDefault(); window.history.back(); }}
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold transition-all flex items-center gap-2"
            >
              <span>←</span>
              <span className="hidden sm:inline">[Ca(EDTA)]²⁻</span>
            </Link>
            <Link 
              href="/ilmiy/birikmares/co-nh3-5-ono-cl2"
              onClick={(e) => { e.preventDefault(); alert('Keyingi: [Co(NH₃)₅ONO]Cl₂ — Nitrito-izomer (linkage izomeriya)'); }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-white font-bold transition-all shadow-lg shadow-amber-500/30 flex items-center gap-2"
            >
              <span className="hidden sm:inline">[Co(NH₃)₅ONO]Cl₂</span>
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