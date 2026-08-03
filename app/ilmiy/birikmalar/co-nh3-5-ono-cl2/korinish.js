"use client"

import Link from "next/link"
import { useState } from "react"

export default function CoNH35ONOCl2() {
  const [activeTab, setActiveTab] = useState("overview")
  const [compareWith, setCompareWith] = useState("nitro") // nitro bilan taqqoslash

  const tabs = [
    { id: "overview", label: "📋 Umumiy", icon: "📋" },
    { id: "linkage", label: "🔗 Linkage taqqoslash", icon: "🔗" },
    { id: "structure", label: "🧬 Tuzilish", icon: "🧬" },
    { id: "electronic", label: "⚛️ Elektron", icon: "⚛️" },
    { id: "spectroscopy", label: "🔬 Spektroskopiya", icon: "🔬" },
    { id: "isomerization", label: "🔄 Izomerlanish", icon: "🔄" },
    { id: "synthesis", label: "⚗️ Sintez", icon: "⚗️" },
    { id: "history", label: "🏆 Tarix", icon: "🏆" },
  ]

  const nitroData = {
    name: "[Co(NH₃)₅NO₂]²⁺",
    commonName: "Nitrokobalt (sariq)",
    color: "Sariq",
    bonding: "Co−N−O₂ (N orqali)",
    wavelength: "490 nm",
    irPeaks: "1420, 1310 cm⁻¹",
    coLigandDist: "1.96 Å (Co−N)",
    stability: "Termodinamik barqaror"
  }

  const nitritoData = {
    name: "[Co(NH₃)₅ONO]²⁺",
    commonName: "Nitritokobalt (qizil)",
    color: "Qizil",
    bonding: "Co−O−N=O (O orqali)",
    wavelength: "460 nm",
    irPeaks: "1460, 1060 cm⁻¹",
    coLigandDist: "2.05 Å (Co−O)",
    stability: "Kinetik mahsulot (metastabil)"
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white relative overflow-hidden">
      
      {/* ═══ ANIMATED BACKGROUND ═══ */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(219,39,119,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(219,39,119,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        {['Co³⁺', 'ONO⁻', 'O-bog\'langan', 'metastabil', 'qizil', 'Jørgensen 1894', 'linkage'].map((sym, i) => (
          <div
            key={i}
            className="absolute text-pink-400/5 font-mono font-bold select-none pointer-events-none"
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
            <span className="text-pink-400 font-semibold">[Co(NH₃)₅ONO]Cl₂</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-pink-500/20 to-red-500/20 border border-pink-500/30 text-[10px] text-pink-300 font-bold uppercase tracking-wider">
                  🔗 Linkage izomer (nitrito)
                </span>
                <span className="px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-[10px] text-red-300 font-semibold">
                  ❤️ O-bog'langan
                </span>
                <span className="px-2.5 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-[10px] text-yellow-300 font-semibold">
                  ⚡ Metastabil
                </span>
                <span className="px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-[10px] text-purple-300 font-semibold">
                  📜 Jørgensen 1894
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-pink-400 via-red-400 to-purple-300 bg-clip-text text-transparent">
                [Co(NH₃)₅ONO]Cl₂
              </h1>
              <p className="text-purple-300 text-sm mt-1">
                Pentaamminnitritokobalt(III) xlorid • Pentaamminenitritocobalt(III) chloride
              </p>
            </div>
            
            <div className="flex gap-2">
              <Link 
                href="/ilmiy/birikmalar/co-nh3-5-no2-cl2"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 hover:border-amber-400/60 text-amber-300 text-sm font-semibold transition-all flex items-center gap-2"
              >
                <span>💛</span>
                <span className="hidden sm:inline">Nitro-izomerga o'tish</span>
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
            { label: "Formula", value: "[Co(NH₃)₅ONO]Cl₂", icon: "🧪", color: "text-pink-400" },
            { label: "M massa", value: "278.44 g/mol", icon: "⚖️", color: "text-blue-400" },
            { label: "Geometriya", value: "Oktaedrik (C₄ᵥ)", icon: "💎", color: "text-purple-400" },
            { label: "Kompleks rangi", value: "Qizil", icon: "❤️", color: "text-red-400" },
            { label: "Bog'lanish", value: "Co−O−N=O", icon: "🔗", color: "text-pink-400" },
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
                  ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg shadow-pink-500/30'
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
            <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-pink-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center text-xl shadow-lg shadow-pink-500/30">
                  📋
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Asosiy ma'lumotlar — {nitritoData.commonName}</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  ["CAS raqami", "14970-14-0"],
                  ["Zichlik", "~1.78 g/cm³"],
                  ["Sistema", "Monoklinik"],
                  ["Fazoviy guruh", "P2₁/c"],
                  ["Eruvchanlik (H₂O)", "Yaxshi eriydi"],
                  ["Eruvchanlik (EtOH)", "Kam eriydi"],
                  ["Barqarorlik", "Metastabil ⚡"],
                  ["Rangi", "Qizil"],
                ].map((item, i) => (
                  <div key={i} className="bg-pink-950/50 rounded-xl p-3 border border-pink-700/30">
                    <div className="text-[10px] uppercase tracking-wider text-pink-400 font-semibold mb-1">{item[0]}</div>
                    <div className="text-white font-semibold text-sm">{item[1]}</div>
                  </div>
                ))}
              </div>

              {/* ICHKI/TASHQI SFERA */}
              <div className="bg-gradient-to-r from-pink-500/10 to-red-500/10 border border-pink-500/20 rounded-2xl p-5">
                <h3 className="text-pink-400 font-bold mb-3 flex items-center gap-2">
                  <span>💎</span> Ichki va tashqi sfera
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-pink-900/30 rounded-xl p-4 border border-pink-700/30">
                    <h4 className="text-pink-300 font-bold text-sm mb-2">🔒 Ichki sfera [Co(NH₃)₅ONO]²⁺</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">Co³⁺</strong> — markaziy ion (d⁶)</li>
                      <li>• <strong className="text-white">5 × NH₃</strong> — ammiak ligandlari</li>
                      <li>• <strong className="text-white">1 × ONO⁻</strong> — nitrito ioni (ambidentat!)</li>
                      <li>• <strong className="text-yellow-300">Zaryad:</strong> +3 + 0 + (−1) = <strong>+2</strong></li>
                      <li>• <strong className="text-pink-300">Bog'lanish:</strong> Co−O−N=O (O orqali)</li>
                      <li>• <strong className="text-red-300">Co−O masofa:</strong> 2.05 Å (uzun!)</li>
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
                      <li>• <strong className="text-white">3 ion:</strong> [Co(NH₃)₅ONO]²⁺ + 2Cl⁻</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* XULOSA */}
            <div className="bg-gradient-to-r from-pink-600/10 via-red-600/10 to-purple-600/10 border border-pink-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>✅</span> Asosiy xulosalar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "🔗 <strong>Linkage izomer:</strong> NO₂⁻ O orqali bog'langan (nitrito)",
                  "❤️ <strong>Qizil rang:</strong> λmax = 460 nm (nitro: 490 nm dan qisqa)",
                  "⚡ <strong>Metastabil:</strong> vaqt o'tishi bilan nitro-izomerga aylanadi",
                  "⚛️ <strong>d⁶ quyi spinli:</strong> KMBE = −2.4Δₒ, diamagnit",
                  "🔬 <strong>IQ diagnostikasi:</strong> ν(N=O) = 1460, ν(O−N) = 1060 cm⁻¹",
                  "🔄 <strong>Izomerlanish:</strong> UV yoki issiqlik bilan ONO⁻ → NO₂⁻",
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
            {/* TAQQOSLASH */}
            <div className="bg-gradient-to-br from-amber-900/40 to-pink-900/40 border border-amber-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-pink-500 flex items-center justify-center text-xl shadow-lg shadow-amber-500/30">
                  🔗
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Nitro vs Nitrito — to'liq taqqoslash</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* NITRO */}
                <div className="bg-gradient-to-br from-amber-900/40 to-yellow-900/40 rounded-2xl p-6 border border-amber-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center text-2xl shadow-lg">
                      💛
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-amber-300">Nitro-izomer</h3>
                      <p className="text-amber-400 text-xs">Co−N−O₂ (N-bog'langan)</p>
                    </div>
                  </div>

                  <div className="bg-amber-950/60 rounded-xl p-4 mb-4 font-mono text-xs text-amber-200 border border-amber-700/30">
                    <pre className="whitespace-pre">{`          O
          ||
   Co — N
          \\
           O

  N atomi Co ga bevosita bog'langan
  Simmetrik NO₂ guruhi`}</pre>
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
                      <span className="text-green-400 font-bold">Termodinamik ✓</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">λ<sub>max</sub>:</span>
                      <span className="text-white font-mono">490 nm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Co−N masofa:</span>
                      <span className="text-white font-mono">1.96 Å</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">IQ cho'qqilar:</span>
                      <span className="text-white font-mono">1420, 1310</span>
                    </div>
                  </div>
                </div>

                {/* NITRITO — Siz */}
                <div className="bg-gradient-to-br from-pink-900/40 to-red-900/40 rounded-2xl p-6 border-2 border-pink-500/40">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center text-2xl shadow-lg">
                      ❤️
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-pink-300">Nitrito-izomer ← Siz</h3>
                      <p className="text-pink-400 text-xs">Co−O−N=O (O-bog'langan)</p>
                    </div>
                  </div>

                  <div className="bg-pink-950/60 rounded-xl p-4 mb-4 font-mono text-xs text-pink-200 border border-pink-700/30">
                    <pre className="whitespace-pre">{`          N=O
         /
   Co — O

  O atomi Co ga bevosita bog'langan
  Asimmetrik ONO guruhi`}</pre>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-300">Bog'lanish:</span>
                      <span className="text-white font-bold">Co−O (σ)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Rang:</span>
                      <span className="text-pink-300 font-bold">Qizil</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Barqarorlik:</span>
                      <span className="text-red-300 font-bold">Metastabil ⚡</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">λ<sub>max</sub>:</span>
                      <span className="text-white font-mono">460 nm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Co−O masofa:</span>
                      <span className="text-white font-mono">2.05 Å</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">IQ cho'qqilar:</span>
                      <span className="text-white font-mono">1460, 1060</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* FARQLAR JADVALI */}
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-purple-950/60">
                    <tr>
                      <th className="py-3 px-4 text-purple-300 text-left">Xususiyat</th>
                      <th className="py-3 px-4 text-amber-300 text-left">💛 Nitro</th>
                      <th className="py-3 px-4 text-pink-300 text-left">❤️ Nitrito</th>
                      <th className="py-3 px-4 text-purple-300 text-left">Sabab</th>
                    </tr>
                  </thead>
                  <tbody className="text-purple-200">
                    <tr className="border-b border-purple-800/30">
                      <td className="py-3 px-4">Bog'lanish atomi</td>
                      <td className="py-3 px-4 font-mono">N</td>
                      <td className="py-3 px-4 font-mono">O</td>
                      <td className="py-3 px-4 text-xs">Ambidentat NO₂⁻</td>
                    </tr>
                    <tr className="border-b border-purple-800/30">
                      <td className="py-3 px-4">Co−X masofa</td>
                      <td className="py-3 px-4 font-mono">1.96 Å</td>
                      <td className="py-3 px-4 font-mono">2.05 Å</td>
                      <td className="py-3 px-4 text-xs">O katta, zaif π</td>
                    </tr>
                    <tr className="border-b border-purple-800/30">
                      <td className="py-3 px-4">Bog' kuchi</td>
                      <td className="py-3 px-4 text-green-400">Kuchli (σ+π)</td>
                      <td className="py-3 px-4 text-red-400">Kuchsiz (σ)</td>
                      <td className="py-3 px-4 text-xs">π back-bonding</td>
                    </tr>
                    <tr className="border-b border-purple-800/30">
                      <td className="py-3 px-4">Barqarorlik</td>
                      <td className="py-3 px-4 text-green-400">Termodinamik</td>
                      <td className="py-3 px-4 text-red-400">Kinetik</td>
                      <td className="py-3 px-4 text-xs">ΔG: nitro past</td>
                    </tr>
                    <tr className="border-b border-purple-800/30">
                      <td className="py-3 px-4">Rang</td>
                      <td className="py-3 px-4">Sariq (490 nm)</td>
                      <td className="py-3 px-4">Qizil (460 nm)</td>
                      <td className="py-3 px-4 text-xs">Δₒ farqi</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">IQ diagnostik</td>
                      <td className="py-3 px-4 font-mono text-xs">1420, 1310</td>
                      <td className="py-3 px-4 font-mono text-xs">1460, 1060</td>
                      <td className="py-3 px-4 text-xs">NO₂ vs N=O/O−N</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* NEGA NITRITO METASTABIL */}
            <div className="bg-gradient-to-br from-red-900/40 to-purple-900/40 border border-red-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-purple-500 flex items-center justify-center text-xl shadow-lg shadow-red-500/30">
                  ⚡
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Nega nitrito metastabil?</h2>
              </div>
              
              <div className="bg-gradient-to-r from-red-500/10 to-purple-500/10 border border-red-500/20 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-pink-400">Nitrito-izomer</strong> — bu <strong className="text-white">kinetik mahsulot</strong>.
                  Sintezda ONO⁻ tezroq bog'lanadi (O atomi yuqori elektron zichlik), lekin 
                  <strong className="text-yellow-300"> termodinamik jihatdan noqulay</strong>. 
                  Vaqt o'tishi bilan yoki UV/issiqlik ta'sirida u <strong className="text-amber-300">nitro-izomerga</strong> 
                  (termodinamik barqaror) aylanadi.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-pink-950/50 rounded-xl p-5 border border-pink-700/30 text-center">
                  <div className="text-3xl mb-2">⚡</div>
                  <div className="text-pink-400 text-xs uppercase mb-1">Kinetik mahsulot</div>
                  <div className="text-white font-bold">Nitrito (ONO)</div>
                  <div className="text-purple-300 text-xs mt-2">Tez hosil bo'ladi</div>
                  <div className="text-red-300 text-xs mt-1">Lekin beqaror</div>
                </div>
                <div className="bg-yellow-950/50 rounded-xl p-5 border border-yellow-700/30 text-center">
                  <div className="text-3xl mb-2">🔄</div>
                  <div className="text-yellow-400 text-xs uppercase mb-1">Izomerlanish</div>
                  <div className="text-white font-bold">ONO → NO₂</div>
                  <div className="text-purple-300 text-xs mt-2">UV yoki issiqlik</div>
                  <div className="text-yellow-300 text-xs mt-1">t₁/₂ ≈ daqiqalar/soatlar</div>
                </div>
                <div className="bg-amber-950/50 rounded-xl p-5 border border-amber-700/30 text-center">
                  <div className="text-3xl mb-2">💛</div>
                  <div className="text-amber-400 text-xs uppercase mb-1">Termodinamik</div>
                  <div className="text-white font-bold">Nitro (NO₂)</div>
                  <div className="text-purple-300 text-xs mt-2">Sekin hosil bo'ladi</div>
                  <div className="text-green-300 text-xs mt-1">Lekin barqaror</div>
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
            <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  💎
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Geometriya va bog'lanish tuzilishi</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-purple-400 font-bold text-sm uppercase tracking-wider">Geometrik parametrlar</h3>
                  <div className="space-y-2">
                    {[
                      ["Geometriya", "Buzilgan oktaedrik"],
                      ["Nuqtali guruh", "C₄ᵥ (buzilgan)"],
                      ["Co−N(NH₃) masofa", "1.94 Å (4 ta)"],
                      ["Co−O(ONO) masofa", "2.05 Å (uzun!)"],
                      ["O−N masofa", "1.30 Å (yakk bog')"],
                      ["N=O masofa", "1.18 Å (qo'sh bog')"],
                      ["Co−O−N burchak", "≈ 125° (buzilgan)"],
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-purple-800/30">
                        <span className="text-purple-300 text-sm">{item[0]}</span>
                        <span className="text-white font-semibold text-sm font-mono">{item[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-pink-400 font-bold text-sm uppercase tracking-wider">ONO guruhi tuzilishi</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <div className="bg-pink-950/50 rounded-xl p-4 border border-pink-700/30">
                      <p className="text-pink-300 font-bold text-xs mb-2">⚠️ Asimmetrik bog'lanish</p>
                      <p className="text-xs">
                        ONO⁻ ligandida <strong className="text-white">ikki turli bog'</strong> mavjud:
                        <br/>• <strong className="text-red-300">O−N</strong> = 1.30 Å (yakk bog', kuchsiz)
                        <br/>• <strong className="text-pink-300">N=O</strong> = 1.18 Å (qo'sh bog', kuchli)
                      </p>
                    </div>
                    <div className="bg-pink-950/50 rounded-xl p-4 border border-pink-700/30">
                      <p className="text-pink-300 font-bold text-xs mb-2">📐 Co−O−N burchak</p>
                      <p className="text-xs">
                        Co−O−N burchak <strong className="text-white">≈ 125°</strong> — bu NO₂⁻ ning 
                        <strong className="text-yellow-300"> sp² gibridlanishi</strong>ni ko'rsatadi. 
                        Ideal 120° dan buzilgan — koordinatsion cheklovlar tufayli.
                      </p>
                    </div>
                    <div className="bg-yellow-950/50 rounded-xl p-4 border border-yellow-700/30">
                      <p className="text-yellow-300 font-bold text-xs mb-2">📏 Uzun Co−O bog'</p>
                      <p className="text-xs">
                        <strong className="text-white">Co−O = 2.05 Å</strong> — nitro-izomerda Co−N = 1.96 Å dan 
                        <strong className="text-red-300"> uzunroq</strong>. Sababi: O kuchsiz σ-donor va 
                        zaif π-akseptor.
                      </p>
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
                <div className="bg-pink-950/50 rounded-2xl p-5 border border-pink-700/30 text-center">
                  <div className="text-4xl mb-2">🟣</div>
                  <div className="text-pink-400 text-xs uppercase mb-1">Kompleksda</div>
                  <div className="text-white font-mono font-bold">t₂g⁶ e₉⁰</div>
                  <div className="text-green-400 text-xs mt-1">Quyi spinli (LS)</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-5">
                <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                  <span>💡</span> Ikkala izomerda ham bir xil elektron tuzilish
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">ONO⁻</strong> ham <strong className="text-white">NO₂⁻</strong> kabi o'rta-kuchli maydonli ligand</p>
                  <p>• <strong className="text-white">Co³⁺</strong> uchun Δₒ ≈ 22,500 cm⁻¹ (nitro: 23,000 dan biroz kichik)</p>
                  <p>• <strong className="text-yellow-300">Δₒ &gt; P</strong> → <strong className="text-green-400">quyi spinli</strong></p>
                  <p>• Barcha 6 ta elektron t₂g da → <strong className="text-white">diamagnit</strong></p>
                  <p className="text-xs text-purple-400 mt-2">
                    Farq faqat <strong>geometrik tuzilish</strong> va <strong>bog'lanish tabiati</strong>da — elektron konfiguratsiya bir xil!
                  </p>
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
                  Ikkala izomerda ham <strong className="text-white">bir xil KMBE</strong> — lekin nitro-izomerda Δₒ biroz katta (23,000 vs 22,500 cm⁻¹), 
                  shuning uchun nitro-izomer <strong className="text-yellow-300">termodinamik jihatdan barqarorroq</strong>.
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
            {/* UV-Vis */}
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

                <div className="bg-pink-950/50 rounded-xl p-5 border-2 border-pink-500/30">
                  <h3 className="text-pink-400 font-bold mb-2">❤️ Nitrito-izomer ← Siz</h3>
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
                      <span className="text-pink-300 font-bold">Qizil</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-5">
                <h3 className="text-green-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Nega rangi farqlanadi?
                </h3>
                <p className="text-purple-200 text-sm">
                  <strong className="text-pink-300">Nitrito-izomer</strong>da Co−O bog' zaifroq (σ), 
                  bu Δₒ ni <strong className="text-yellow-300">kamaytiradi</strong>. Kichikroq Δₒ = qisqaroq to'lqin uzunligi 
                  (460 nm) = <strong className="text-white">ko'k yutiladi → qizil ko'rinadi</strong>.
                  <strong className="text-amber-300"> Nitro-izomer</strong>da kuchliroq Co−N bog' (σ+π) katta Δₒ beradi 
                  (490 nm) = <strong className="text-white">ko'k-yashil yutiladi → sariq ko'rinadi</strong>.
                </p>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-amber-950/50 rounded-xl p-5 border border-amber-700/30">
                  <h3 className="text-amber-400 font-bold mb-3">💛 Nitro cho'qqilari</h3>
                  <div className="space-y-2">
                    {[
                      { freq: "1420 cm⁻¹", bond: "νₐₛ(NO₂)", desc: "Asimmetrik", intensity: "Kuchli" },
                      { freq: "1310 cm⁻¹", bond: "νₛ(NO₂)", desc: "Simmetrik", intensity: "Kuchli" },
                      { freq: "830 cm⁻¹", bond: "δ(NO₂)", desc: "Egilish", intensity: "O'rta" },
                      { freq: "490 cm⁻¹", bond: "ν(Co−N)", desc: "Co−N(NO₂)", intensity: "O'rta" },
                    ].map((item, i) => (
                      <div key={i} className="bg-amber-900/40 rounded-lg p-2 border border-amber-700/30">
                        <div className="flex justify-between items-center">
                          <span className="text-amber-400 font-mono text-xs">{item.freq}</span>
                          <span className="text-white text-xs">{item.bond}</span>
                        </div>
                        <p className="text-purple-300 text-[10px] mt-0.5">{item.desc} • {item.intensity}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-pink-950/50 rounded-xl p-5 border-2 border-pink-500/30">
                  <h3 className="text-pink-400 font-bold mb-3">❤️ Nitrito cho'qqilari ← Siz</h3>
                  <div className="space-y-2">
                    {[
                      { freq: "1460 cm⁻¹", bond: "ν(N=O)", desc: "Qo'sh bog'", intensity: "Juda kuchli" },
                      { freq: "1060 cm⁻¹", bond: "ν(O−N)", desc: "Yakk bog'", intensity: "Kuchli" },
                      { freq: "820 cm⁻¹", bond: "δ(ONO)", desc: "Egilish", intensity: "O'rta" },
                      { freq: "450 cm⁻¹", bond: "ν(Co−O)", desc: "Co−O(ONO)", intensity: "O'rta" },
                    ].map((item, i) => (
                      <div key={i} className="bg-pink-900/40 rounded-lg p-2 border border-pink-700/30">
                        <div className="flex justify-between items-center">
                          <span className="text-pink-400 font-mono text-xs">{item.freq}</span>
                          <span className="text-white text-xs">{item.bond}</span>
                        </div>
                        <p className="text-purple-300 text-[10px] mt-0.5">{item.desc} • {item.intensity}</p>
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
                  <p>• <strong className="text-amber-300">Nitro (NO₂):</strong> ν(NO₂) ≈ 1420 va 1310 cm⁻¹ — <strong>ikki yaqin cho'qqi</strong> (simmetrik guruh)</p>
                  <p>• <strong className="text-pink-300">Nitrito (ONO):</strong> ν(N=O) ≈ 1460 va ν(O−N) ≈ 1060 cm⁻¹ — <strong>ikki uzoq cho'qqi</strong> (asimmetrik)</p>
                  <p className="text-xs text-purple-400 mt-2">
                    Bu farq IQ spektrida <strong className="text-white">darhol ko'rinadi</strong> — linkage izomerlarni aniqlashning <strong className="text-yellow-300">eng oson usuli</strong>.
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
            <div className="bg-gradient-to-br from-pink-900/40 to-amber-900/40 border border-pink-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-amber-500 flex items-center justify-center text-xl shadow-lg shadow-pink-500/30">
                  🔄
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Nitrito → Nitro izomerlanish mexanizmi</h2>
              </div>
              
              <div className="bg-gradient-to-r from-pink-500/10 to-amber-500/10 border border-pink-500/20 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-pink-400">Nitrito → nitro</strong> izomerlanishi — bu <strong className="text-white">intramolekulyar jarayon</strong>.
                  ONO⁻ ligandi metall atrofida <strong className="text-yellow-300">aylanib</strong>, N atomi orqali bog'lanadi.
                  Bu <strong className="text-white">birinchi tartibli reaksiya</strong> bo'lib, uning tezligi temperatura va yorug'likka bog'liq.
                </p>
              </div>

              {/* REAKSIYA */}
              <div className="bg-pink-950/50 rounded-2xl p-5 border border-pink-700/30 mb-6">
                <h3 className="text-pink-400 font-bold mb-3">Reaksiya</h3>
                <div className="bg-pink-900/60 rounded-xl p-4 font-mono text-sm text-pink-200 border border-pink-700/30 text-center">
                  <p>[Co(NH₃)₅(ONO)]²⁺ → [Co(NH₃)₅(NO₂)]²⁺</p>
                  <p className="text-pink-300 text-xs mt-2">(qizil, metastabil) → (sariq, barqaror)</p>
                </div>
              </div>

              {/* MEXANIZM */}
              <div className="space-y-3">
                {[
                  { step: "1", title: "Boshlang'ich holat", desc: "Co−O−N=O (nitrito) — kinetik mahsulot, metastabil" },
                  { step: "2", title: "Faollanish", desc: "UV yorug'lik (λ < 400 nm) yoki issiqlik (80°C) bilan Co−O bog'i uziladi" },
                  { step: "3", title: "Oraliq holat", desc: "ONO⁻ erkin aylanadi (Co dan uzoqlashmasdan, ion jufti)" },
                  { step: "4", title: "Qayta bog'lanish", desc: "N atomi Co ga yaqinlashadi va kuchli σ+π-bog' hosil qiladi" },
                  { step: "5", title: "Yakuniy holat", desc: "Co−NO₂ (nitro) — termodinamik barqaror mahsulot" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-amber-500 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg">
                      {item.step}
                    </div>
                    <div className="flex-1 bg-pink-950/50 rounded-xl p-4 border border-pink-700/30">
                      <h3 className="text-pink-400 font-bold mb-1">{item.title}</h3>
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

              <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-2xl p-5 mt-6">
                <h3 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                  <span>📈</span> Aktivatsiya energiyasi
                </h3>
                <p className="text-purple-200 text-sm">
                  <strong className="text-white">Eₐ ≈ 95-105 kJ/mol</strong> — bu Co−O bog'ini uzish va NO₂ ni aylantirish uchun zarur bo'lgan energiya.
                  <strong className="text-yellow-300"> UV yorug'lik</strong> bu to'siqdan oson o'tishga yordam beradi.
                </p>
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Sintez — kinetik mahsulotni tutish</h2>
              </div>
              
              <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/20 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-pink-400">Nitrito-izomerni olish</strong> uchun reaksiyani <strong className="text-white">sovuq sharoitda</strong> 
                  (0-5°C) va <strong className="text-white">qisqa vaqt</strong> o'tkazish kerak. Aks holda u nitro-izomerga aylanadi!
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-green-950/50 rounded-2xl p-5 border border-green-700/30">
                  <h3 className="text-green-400 font-bold mb-3">Asosiy reaksiya</h3>
                  <div className="bg-green-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-green-300 border border-green-700/30">
                    [Co(NH₃)₅Cl]Cl₂ + NaNO₂ → [Co(NH₃)₅(ONO)]Cl₂ + NaCl
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Mexanizm:</strong> Cl⁻ ning o'rnini ONO⁻ egallaydi (tez, O orqali — kinetik)</p>
                    <p><strong className="text-white">Sharoit:</strong> 0-5°C (muzli suv), qisqa vaqt (30-60 daqiqa)</p>
                    <p><strong className="text-white">Natija:</strong> <span className="text-pink-300 font-bold">Qizil</span> nitrito-izomer</p>
                  </div>
                </div>

                <div className="bg-yellow-950/50 rounded-2xl p-5 border border-yellow-700/30">
                  <h3 className="text-yellow-400 font-bold mb-3">⚠️ Muhim shartlar</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-red-300">Sovuq harorat:</strong> 0-5°C (nitro-izomerga aylanishni sekinlashtirish)</p>
                    <p>• <strong className="text-red-300">Qisqa vaqt:</strong> reaksiya darhol to'xtatilishi kerak</p>
                    <p>• <strong className="text-red-300">Qorong'i joy:</strong> UV yorug'lik izomerlanishni tezlashtiradi</p>
                    <p>• <strong className="text-white">Tez filtrlash:</strong> qizil kristallarni darhol ajratib olish</p>
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
                  { step: "2", title: "Sovutish", desc: "Muzli suvda 0-5°C gacha sovutish (JUDA MUHIM!)" },
                  { step: "3", title: "NaNO₂ qo'shish", desc: "NaNO₂ (2 g) ni sekin qo'shib, aralashtirish" },
                  { step: "4", title: "Rang kuzatish", desc: "Binafsha → qizil (nitrito hosil bo'ldi) — 30 daqiqa" },
                  { step: "5", title: "Tez filtrlash", desc: "Qizil kristallarni tez filtrlash (sovuqda!)" },
                  { step: "6", title: "Yuvish", desc: "Sovuq etanol bilan yuvish, qorong'i joyda quritish" },
                  { step: "7", title: "Saqlash", desc: "Qorong'i shishada, sovuq joyda (nitro-izomerga aylanmaslik uchun)" },
                  { step: "8", title: "Tekshirish", desc: "IQ spektr: 1460 va 1060 cm⁻¹ cho'qqilar" },
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
                  <p>• <strong className="text-white">NaNO₂</strong> — zaharli, qo'lqop bilan ishlash</p>
                  <p>• <strong className="text-white">Sovuq sharoit</strong> — qo'llarni himoya qilish</p>
                  <p>• <strong className="text-white">Qorong'i joy</strong> — UV yorug'lik izomerlanishni tezlashtiradi</p>
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
                      <strong className="text-white"> ikki xil rangli</strong> [Co(NH₃)₅NO₂]²⁺ komplekslarini sintez qildi:
                      <strong className="text-amber-300"> sariq</strong> va <strong className="text-pink-300"> qizil</strong>.
                      U ularning <strong className="text-white">bir xil formula</strong>ga ega, lekin <strong className="text-white">turli xossalarga</strong> 
                      ega ekanligini ko'rsatdi — bu <strong className="text-yellow-300">linkage izomeriya</strong>ning birinchi kashfiyoti edi!
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-xs text-yellow-300 font-semibold">
                        📜 1894 yil
                      </span>
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-xs text-amber-300 font-semibold">
                        📍 Kopengagen
                      </span>
                      <span className="px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/30 text-xs text-pink-300 font-semibold">
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
                  <p>• Bu <strong className="text-white">birinchi strukturaviy izomeriya</strong> turi — bir xil formula, lekin turli bog'lanish</p>
                  <p>• Werner'ning koordinatsion nazariyasini <strong className="text-yellow-300">tasdiqladi</strong> — ligandlar metallga bevosita bog'langan</p>
                  <p>• <strong className="text-white">Ambidentat ligand</strong> tushunchasini kiritdi — bir ligand turli atomlar orqali bog'lanishi mumkin</p>
                  <p>• <strong className="text-white">Bioinorganik kimyo</strong> uchun asos — SCN⁻ (S/N), OCN⁻ (O/N) va boshqalar</p>
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
                  { year: "1950", title: "Mexanizm tushunilishi", desc: "Fotokimyoviy va termal izomerlanish mexanizmlari o'rganildi (Basolo, Pearson)" },
                  { year: "1960", title: "IQ diagnostikasi", desc: "IR spektroskopiya orqali nitro va nitrito izomerlar aniq farqlanadi" },
                  { year: "1980+", title: "Zamonaviy qo'llanilish", desc: "Fotoxromik materiallar, molekulyar switchlar, bioorganometallik kimyo" },
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
              href="/ilmiy/birikmalar/co-nh3-5-no2-cl2"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-bold transition-all shadow-lg shadow-amber-500/30 flex items-center gap-2"
            >
              <span>💛</span>
              <span className="hidden sm:inline">[Co(NH₃)₅NO₂]Cl₂</span>
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