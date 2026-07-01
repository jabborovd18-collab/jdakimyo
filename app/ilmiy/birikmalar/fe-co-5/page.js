"use client"

import Link from "next/link"
import { useState } from "react"

export default function FeCO5() {
  const [activeTab, setActiveTab] = useState("overview")
  const [showPseudorotation, setShowPseudorotation] = useState(false)

  const tabs = [
    { id: "overview", label: "📋 Umumiy", icon: "📋" },
    { id: "structure", label: "🧬 Trigonal bipiramida", icon: "🧬" },
    { id: "electronic", label: "⚛️ 18 elektron", icon: "⚛️" },
    { id: "bonding", label: "🔗 Fe−C≡O bog'lanish", icon: "🔗" },
    { id: "pseudorotation", label: "🔄 Berry pseudorotation", icon: "🔄" },
    { id: "spectroscopy", label: "🔬 Spektroskopiya", icon: "🔬" },
    { id: "synthesis", label: "⚗️ Sintez", icon: "⚗️" },
    { id: "applications", label: "🏭 Qo'llanilish", icon: "🏭" },
    { id: "history", label: "🏆 Tarix", icon: "🏆" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white relative overflow-hidden">
      
      {/* ═══ ANIMATED BACKGROUND ═══ */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-yellow-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(245,158,11,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        {['Fe⁰', 'd⁸', '18 e⁻', 'D₃ₕ', 'dsp³', 'Berry', 'CO', 'pseudorotation', 'Mond 1891'].map((sym, i) => (
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
      <header className="relative z-20 border-b border-white/5 backdrop-blur-xl bg-purple-950/80 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <nav className="flex items-center gap-2 text-xs mb-3 text-purple-400 flex-wrap">
            <Link href="/" className="hover:text-purple-300 transition-colors">🏠 Bosh sahifa</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy" className="hover:text-purple-300 transition-colors">Ilmiy bo'lim</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/birikmalar" className="hover:text-purple-300 transition-colors">Birikmalar bazasi</Link>
            <span className="text-purple-600">›</span>
            <span className="text-amber-400 font-semibold">[Fe(CO)₅]</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                  🏭 Organometallik klassika
                </span>
                <span className="px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-[10px] text-red-300 font-semibold">
                  ☠️ Zaharli suyuqlik
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] text-emerald-300 font-semibold">
                  ⚛️ 18 elektron qoidasi
                </span>
                <span className="px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-[10px] text-purple-300 font-semibold">
                  🔄 Berry pseudorotation
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
                [Fe(CO)₅]
              </h1>
              <p className="text-purple-300 text-sm mt-1">
                Temir pentakarbonil • Iron pentacarbonyl • Pentakarboniltemir(0)
              </p>
            </div>
            
            <div className="flex gap-2">
              <Link 
                href="/ilmiy/birikmalar/ni-co-4"
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-semibold transition-all flex items-center gap-2"
              >
                <span>🟢</span>
                <span className="hidden sm:inline">[Ni(CO)₄]</span>
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
            { label: "Formula", value: "[Fe(CO)₅]", icon: "🧪", color: "text-amber-400" },
            { label: "M massa", value: "195.90 g/mol", icon: "⚖️", color: "text-blue-400" },
            { label: "Geometriya", value: "Trigonal bipiramida", icon: "💎", color: "text-purple-400" },
            { label: "Holati", value: "Sariq suyuqlik", icon: "🎨", color: "text-yellow-400" },
            { label: "Elektronlar", value: "18 e⁻ (qoida)", icon: "⚛️", color: "text-emerald-400" },
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
            <div className="bg-gradient-to-br from-purple-900/40 to-amber-900/40 border border-amber-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-xl shadow-lg shadow-amber-500/30">
                  📋
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Asosiy ma'lumotlar</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  ["CAS raqami", "13463-40-6"],
                  ["Zichlik", "1.453 g/cm³ (20°C)"],
                  ["Qaynash harorati", "103°C"],
                  ["Suyuqlanish harorati", "-20°C"],
                  ["Bug' bosimi", "40 mm Hg (20°C)"],
                  ["Dipol moment", "0 D (simmetrik)"],
                  ["Simmetriya", "D₃ₕ"],
                  ["Rangi", "Sariq (och sariq)"],
                ].map((item, i) => (
                  <div key={i} className="bg-amber-950/50 rounded-xl p-3 border border-amber-700/30">
                    <div className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold mb-1">{item[0]}</div>
                    <div className="text-white font-semibold text-sm">{item[1]}</div>
                  </div>
                ))}
              </div>

              {/* XAVFSIZLIK OGohlantirish */}
              <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-2 border-red-500/40 rounded-2xl p-5">
                <h3 className="text-red-400 font-bold mb-3 flex items-center gap-2">
                  <span>☠️</span> Xavfsizlik ogohlantirishi — ZAHARLI!
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-red-900/30 rounded-xl p-4 border border-red-700/30">
                    <h4 className="text-red-300 font-bold text-sm mb-2">⚠️ Toksiklik</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">TLV-TWA:</strong> 0.1 ppm (0.5 mg/m³)</li>
                      <li>• <strong className="text-white">LC₅₀:</strong> 752 ppm/15min (kalamush)</li>
                      <li>• <strong className="text-white">Ta'sir:</strong> CO ajralib chiqadi → gemoglobin bilan bog'lanadi</li>
                      <li>• <strong className="text-white">Belgilar:</strong> bosh og'rig'i, ko'ngil aynishi, hushsizlik</li>
                      <li>• <strong className="text-red-300">Himoya:</strong> Shkaflarda ishlash, gaz detektori</li>
                    </ul>
                  </div>
                  <div className="bg-orange-900/30 rounded-xl p-4 border border-orange-700/30">
                    <h4 className="text-orange-300 font-bold text-sm mb-2">🔥 Fizik xavflar</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">Yonuvchan:</strong> alangalanish harorati 60°C</li>
                      <li>• <strong className="text-white">Bug'lari:</strong> havodan og'ir, pastga yig'iladi</li>
                      <li>• <strong className="text-white">Parchalanish:</strong> Fe₃C + CO (100°C+ da)</li>
                      <li>• <strong className="text-white">Saqlash:</strong> qorong'i, sovuq joyda, inert atmosferada</li>
                      <li>• <strong className="text-white">Yorug'lik:</strong> UV ta'sirida parchalanadi</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* XULOSA */}
            <div className="bg-gradient-to-r from-amber-600/10 via-orange-600/10 to-yellow-600/10 border border-amber-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>✅</span> Asosiy xulosalar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "💎 <strong>Trigonal bipiramida:</strong> D₃ₕ simmetriya, 2 axial + 3 ekvatorial CO",
                  "⚛️ <strong>18 elektron:</strong> Fe⁰ (d⁸) + 5×2 = 18 → juda barqaror",
                  "🔗 <strong>Sinergik bog'lanish:</strong> σ-donatsiya + π-backbonding",
                  "🔄 <strong>Berry pseudorotation:</strong> axial va ekvatorial CO almashinadi",
                  "🔬 <strong>FTIR:</strong> 2 ta cho'qqi (2022 va 2000 cm⁻¹)",
                  "🏭 <strong>Sanoat:</strong> Fe nanopartikullari, katalizatorlar sintezi",
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
            <div className="bg-gradient-to-br from-purple-900/40 to-amber-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-amber-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  💎
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Trigonal bipiramidal geometriya</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-purple-400 font-bold text-sm uppercase tracking-wider">Geometrik parametrlar</h3>
                  <div className="space-y-2">
                    {[
                      ["Geometriya", "Trigonal bipiramida"],
                      ["Nuqtali guruh", "D₃ₕ"],
                      ["Koordinatsion son", "5"],
                      ["Fe−C(axial)", "1.806 Å (2 ta)"],
                      ["Fe−C(ekvatorial)", "1.829 Å (3 ta)"],
                      ["C−O(axial)", "1.146 Å"],
                      ["C−O(ekvatorial)", "1.141 Å"],
                      ["C−Fe−C (eq-eq)", "120°"],
                      ["C−Fe−C (ax-eq)", "90°"],
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-purple-800/30">
                        <span className="text-purple-300 text-sm">{item[0]}</span>
                        <span className="text-white font-semibold text-sm font-mono">{item[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-amber-400 font-bold text-sm uppercase tracking-wider">D₃ₕ simmetriya elementlari</h3>
                  <div className="space-y-2">
                    {[
                      ["E", "Ayniylik"],
                      ["2C₃", "Asosiy o'q bo'ylab (120° va 240°)"],
                      ["3C₂", "Ekvatorial C-Fe-C bo'ylab"],
                      ["σₕ", "Ekvatorial tekislik (3 ta CO)"],
                      ["2S₃", "Notekis aylanish (120°)"],
                      ["3σᵥ", "Vertikal tekisliklar (axial CO orqali)"],
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-1.5 border-b border-amber-800/30">
                        <span className="text-amber-300 text-sm font-mono font-bold">{item[0]}</span>
                        <span className="text-purple-200 text-xs">{item[1]}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-amber-950/50 rounded-xl p-3 border border-amber-700/30 mt-3">
                    <p className="text-amber-200 text-xs">
                      <strong className="text-amber-400">Jami:</strong> 12 ta simmetriya operatsiyasi.
                      <strong className="text-yellow-300"> σₕ mavjud</strong> → molekula <strong>axiral</strong> (optik faol emas).
                      <strong className="text-white"> Dipol moment = 0</strong> (simmetrik).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* AXIAL VS EKVATORIAL */}
            <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 border border-amber-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-xl shadow-lg shadow-amber-500/30">
                  📐
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Axial vs Ekvatorial CO ligandlari</h2>
              </div>
              
              <div className="bg-amber-950/60 rounded-xl p-5 mb-6 font-mono text-sm text-amber-200 border border-amber-700/30 text-center">
                <pre className="whitespace-pre">{`              CO (axial)
              |
              Fe
           /  |  \\
         CO   CO   CO    ← ekvatorial tekislik (120°)
              |
              CO (axial)
              
  Trigonal bipiramida: 2 axial + 3 ekvatorial`}</pre>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-purple-950/60">
                    <tr>
                      <th className="py-3 px-4 text-purple-300 text-left">Xususiyat</th>
                      <th className="py-3 px-4 text-amber-300 text-left">Axial CO (2 ta)</th>
                      <th className="py-3 px-4 text-orange-300 text-left">Ekvatorial CO (3 ta)</th>
                    </tr>
                  </thead>
                  <tbody className="text-purple-200">
                    <tr className="border-b border-purple-800/30">
                      <td className="py-3 px-4">Fe−C masofa</td>
                      <td className="py-3 px-4 font-mono">1.806 Å</td>
                      <td className="py-3 px-4 font-mono">1.829 Å</td>
                    </tr>
                    <tr className="border-b border-purple-800/30">
                      <td className="py-3 px-4">C−O masofa</td>
                      <td className="py-3 px-4 font-mono">1.146 Å</td>
                      <td className="py-3 px-4 font-mono">1.141 Å</td>
                    </tr>
                    <tr className="border-b border-purple-800/30">
                      <td className="py-3 px-4">Burchak (C−Fe−C)</td>
                      <td className="py-3 px-4 font-mono">180° (ax-ax)<br/>90° (ax-eq)</td>
                      <td className="py-3 px-4 font-mono">120° (eq-eq)</td>
                    </tr>
                    <tr className="border-b border-purple-800/30">
                      <td className="py-3 px-4">ν(CO) FTIR</td>
                      <td className="py-3 px-4 font-mono text-amber-300 font-bold">2022 cm⁻¹</td>
                      <td className="py-3 px-4 font-mono text-orange-300 font-bold">2000, 1983 cm⁻¹</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">π-backbonding</td>
                      <td className="py-3 px-4">Kuchliroq</td>
                      <td className="py-3 px-4">Kuchsizroq</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-5 mt-6">
                <h3 className="text-amber-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Nega axial va ekvatorial farqlanadi?
                </h3>
                <p className="text-purple-200 text-sm">
                  <strong className="text-white">Axial CO</strong> ligandlari <strong>3 ta ekvatorial CO</strong> bilan 90° burchak ostida,
                  bu <strong className="text-yellow-300">kuchliroq sterik to'siq</strong>ga olib keladi.
                  Lekin <strong className="text-amber-300">π-backbonding</strong> axial CO da kuchliroq 
                  (chunki kamroq raqobat), shuning uchun <strong className="text-white">Fe−C axial qisqaroq</strong> (1.806 vs 1.829 Å),
                  lekin <strong className="text-white">C−O axial uzunroq</strong> (1.146 vs 1.141 Å) — kuchli backbonding C−O bog'ini kuchsizlantiradi.
                </p>
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
                <h2 className="text-xl md:text-2xl font-bold text-white">18 elektron qoidasi</h2>
              </div>
              
              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-emerald-400">18 elektron qoidasi</strong> — organometallik kimyoning 
                  <strong className="text-white"> asosiy qoidasi</strong>. Metallning valent elektronlari va 
                  ligandlardan kelgan elektronlar yig'indisi <strong className="text-yellow-300">18 ga teng</strong> bo'lsa,
                  kompleks <strong className="text-white">juda barqaror</strong> bo'ladi (inert gaz konfiguratsiyasi).
                </p>
              </div>

              {/* ELEKTRON HISOB */}
              <div className="bg-emerald-950/50 rounded-2xl p-6 border border-emerald-700/30 mb-6">
                <h3 className="text-emerald-400 font-bold mb-4">[Fe(CO)₅] uchun elektron hisobi</h3>
                <div className="space-y-3">
                  <div className="bg-emerald-900/40 rounded-xl p-4 border border-emerald-700/30 flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold">Fe⁰ (temir)</div>
                      <div className="text-purple-300 text-xs mt-1">
                        Konfiguratsiya: [Ar] 3d⁶ 4s² → 8 ta valent elektron
                      </div>
                    </div>
                    <div className="text-emerald-300 text-2xl font-bold font-mono">8 e⁻</div>
                  </div>
                  <div className="bg-emerald-900/40 rounded-xl p-4 border border-emerald-700/30 flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold">5 × CO</div>
                      <div className="text-purple-300 text-xs mt-1">
                        Har bir CO 2 ta elektron beradi (σ-donor)
                      </div>
                    </div>
                    <div className="text-emerald-300 text-2xl font-bold font-mono">5 × 2 = 10 e⁻</div>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30 text-center">
                  <div className="text-4xl mb-2">🔵</div>
                  <div className="text-purple-400 text-xs uppercase mb-1">Erkin Fe atomi</div>
                  <div className="text-white font-mono font-bold">[Ar] 3d⁶ 4s²</div>
                  <div className="text-purple-300 text-xs mt-1">Z = 26</div>
                </div>
                <div className="bg-amber-950/50 rounded-xl p-5 border border-amber-700/30 text-center">
                  <div className="text-4xl mb-2">🟡</div>
                  <div className="text-amber-400 text-xs uppercase mb-1">Fe⁰ (formal)</div>
                  <div className="text-white font-mono font-bold">[Ar] 3d⁸</div>
                  <div className="text-purple-300 text-xs mt-1">8 valent e⁻</div>
                </div>
                <div className="bg-emerald-950/50 rounded-xl p-5 border border-emerald-700/30 text-center">
                  <div className="text-4xl mb-2">🟢</div>
                  <div className="text-emerald-400 text-xs uppercase mb-1">Kompleksda</div>
                  <div className="text-white font-mono font-bold">18 e⁻ (Kr)</div>
                  <div className="text-green-400 text-xs mt-1">Inert gaz konfiguratsiyasi</div>
                </div>
              </div>
            </div>

            {/* GIBRİDLANISH */}
            <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border border-yellow-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-xl shadow-lg shadow-yellow-500/30">
                  🔬
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Gibridlanish: dsp³</h2>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-5">
                <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                  <span>💡</span> Trigonal bipiramida uchun gibridlanish
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">1 ta 3d orbital</strong> (d<sub>z²</sub>)</p>
                  <p>• <strong className="text-white">1 ta 4s orbital</strong></p>
                  <p>• <strong className="text-white">3 ta 4p orbital</strong> (p<sub>x</sub>, p<sub>y</sub>, p<sub>z</sub>)</p>
                  <p>• <strong className="text-yellow-300">Jami:</strong> 5 ta dsp³ gibrid orbital → 5 ta σ-bog'</p>
                  <p className="text-xs text-purple-400 mt-2">
                    Qolgan 4 ta d-elektron <strong className="text-white">juftlashgan</strong> → 
                    <strong className="text-green-400"> diamagnit</strong>. μ_eff = 0 BM.
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
            <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  🔗
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Fe−C≡O bog'lanish mexanizmi (sinergik)</h2>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-purple-400">CO ligandi</strong> — <strong className="text-white">sinergik bog'lanish</strong>ning 
                  klassik namunasi. U ikki yo'nalishda ishlaydi:
                  <strong className="text-yellow-300"> σ-donatsiya</strong> (CO → Fe) va 
                  <strong className="text-pink-300"> π-backbonding</strong> (Fe → CO).
                  Bu ikki jarayon bir-birini <strong className="text-white">kuchaytiradi</strong>.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
                  <h3 className="text-purple-400 font-bold mb-3">1️⃣ σ-donatsiya (CO → Fe)</h3>
                  <div className="bg-purple-900/40 rounded-lg p-4 font-mono text-xs text-purple-200 border border-purple-700/30 mb-3">
                    <pre className="whitespace-pre">{`  C≡O: → Fe
  (lone pair)
  
  CO ning HOMO (5σ) orbitali
  Fe ning bo'sh d-orbitaliga
  elektron juftini beradi`}</pre>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">CO ning 5σ orbitali</strong> — C atomida joylashgan</p>
                    <p>• <strong className="text-white">Fe ning dsp³</strong> gibrid orbitaliga donatsiya</p>
                    <p>• Natija: <strong className="text-purple-300">Fe−C σ-bog'</strong> hosil bo'ladi</p>
                  </div>
                </div>

                <div className="bg-pink-950/50 rounded-xl p-5 border border-pink-700/30">
                  <h3 className="text-pink-400 font-bold mb-3">2️⃣ π-backbonding (Fe → CO)</h3>
                  <div className="bg-pink-900/40 rounded-lg p-4 font-mono text-xs text-pink-200 border border-pink-700/30 mb-3">
                    <pre className="whitespace-pre">{`  Fe → C≡O
  (d-elektron)
  
  Fe ning to'lgan d-orbitali
  CO ning bo'sh 2π* orbitaliga
  elektron qaytaradi`}</pre>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Fe ning to'lgan d-orbitallari</strong> (t₂g)</p>
                    <p>• <strong className="text-white">CO ning 2π* orbitaliga</strong> (LUMO) donatsiya</p>
                    <p>• Natija: <strong className="text-pink-300">Fe−C π-bog'</strong> + C−O kuchsizlanadi</p>
                  </div>
                </div>
              </div>

              {/* SINERGIYA */}
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 rounded-2xl p-5">
                <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                  <span>⚡</span> Sinergik effekt — bir-birini kuchaytirish
                </h3>
                <div className="bg-yellow-950/50 rounded-xl p-4 border border-yellow-700/30 mb-4">
                  <div className="font-mono text-sm text-yellow-200 text-center">
                    <p>σ-donatsiya ↑ → Fe da elektron zichligi ↑ → π-backbonding ↑</p>
                    <p className="mt-2">π-backbonding ↑ → Fe da elektron zichligi ↓ → σ-donatsiya ↑</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-yellow-300">Natija:</strong> Fe−C bog' <strong>kuchayadi</strong>, C−O bog' <strong>kuchsizlanadi</strong></p>
                  <p>• <strong className="text-white">Erkin CO:</strong> ν(CO) = 2143 cm⁻¹</p>
                  <p>• <strong className="text-white">[Fe(CO)₅] da:</strong> ν(CO) = 2022 va 2000 cm⁻¹ <span className="text-pink-300">(pasaygan!)</span></p>
                  <p className="text-xs text-purple-400 mt-2">
                    Bu pasayish <strong className="text-white">π-backbonding</strong> mavjudligini isbotlaydi!
                  </p>
                </div>
              </div>
            </div>

            {/* MO DIAGRAMMA */}
            <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">
                  📊
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Molekulyar orbital diagrammasi (soddalashtirilgan)</h2>
              </div>
              
              <div className="bg-blue-950/50 rounded-2xl p-5 border border-blue-700/30">
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <div className="text-blue-300 font-bold mb-2">Fe (3d)</div>
                    <div className="space-y-1">
                      <div className="bg-blue-900/40 rounded p-2">d<sub>xy</sub>, d<sub>x²-y²</sub></div>
                      <div className="bg-blue-900/40 rounded p-2">d<sub>z²</sub></div>
                      <div className="bg-blue-900/40 rounded p-2">d<sub>xz</sub>, d<sub>yz</sub></div>
                    </div>
                  </div>
                  <div>
                    <div className="text-purple-300 font-bold mb-2">MO</div>
                    <div className="space-y-1">
                      <div className="bg-red-900/40 rounded p-2 text-red-300">e' (σ*) — bo'sh</div>
                      <div className="bg-yellow-900/40 rounded p-2 text-yellow-300">e" (π*) — ↓</div>
                      <div className="bg-green-900/40 rounded p-2 text-green-300">e' (σ) — ↑↓</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-pink-300 font-bold mb-2">5 CO</div>
                    <div className="space-y-1">
                      <div className="bg-pink-900/40 rounded p-2">σ (5 ta)</div>
                      <div className="bg-pink-900/40 rounded p-2">π (10 ta)</div>
                      <div className="bg-pink-900/40 rounded p-2">π* (10 ta)</div>
                    </div>
                  </div>
                </div>
                <p className="text-purple-300 text-xs text-center mt-4">
                  <strong className="text-yellow-300">18 ta valent elektron</strong> bog'lovchi va bog'lanmagan orbitallarni to'ldiradi → 
                  <strong className="text-green-400"> barqaror konfiguratsiya</strong>.
                </p>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* PSEUDOROTATION TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "pseudorotation" && (
          <>
            <div className="bg-gradient-to-br from-amber-900/40 to-pink-900/40 border border-amber-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-pink-500 flex items-center justify-center text-xl shadow-lg shadow-amber-500/30">
                  🔄
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Berry pseudorotation</h2>
              </div>
              
              <div className="bg-gradient-to-r from-amber-500/10 to-pink-500/10 border border-amber-500/20 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-amber-400">Berry pseudorotation</strong> — bu 
                  <strong className="text-white"> trigonal bipiramidal molekulalarda</strong> axial va ekvatorial ligandlarning 
                  <strong className="text-yellow-300"> o'zaro almashinishi</strong> jarayoni. 
                  Bu <strong className="text-white">haqiqiy aylantirish emas</strong> — balki bog' burchaklarining 
                  <strong className="text-pink-300"> uzluksiz o'zgarishi</strong> orqali sodir bo'ladi.
                  [Fe(CO)₅] — bu hodisaning <strong className="text-white">eng klassik namunasi</strong>!
                </p>
              </div>

              {/* INTERAKTIV ANIMATSIYA */}
              <div className="bg-amber-950/50 rounded-2xl p-5 border border-amber-700/30 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-amber-400 font-bold">🎬 Vizualizatsiya</h3>
                  <button
                    onClick={() => setShowPseudorotation(!showPseudorotation)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                      showPseudorotation
                        ? 'bg-red-500 text-white'
                        : 'bg-gradient-to-r from-amber-500 to-pink-500 text-white'
                    }`}
                  >
                    {showPseudorotation ? '⏸️ To\'xtatish' : '▶️ Animatsiya'}
                  </button>
                </div>
                
                <div className="bg-amber-900/40 rounded-xl p-6 font-mono text-xs text-amber-200 border border-amber-700/30">
                  <pre className="whitespace-pre text-center">
{showPseudorotation ? `
        CO(ax)                    CO
         |                       /
         Fe         →          Fe
      /  |  \\                / |  \\
    CO   CO   CO          CO  CO   CO
         |                       \\
        CO(ax)                    CO
   (boshlang'ich)         (oraliq holat)
   
   Ekvatorial → axial    Axial → ekvatorial
   2 ta CO yuqoriga       2 ta CO pastga
   ko'tariladi            tushadi
` : `
        CO
        |
        Fe          ← Trigonal bipiramida
     /  |  \\           (D₃ₕ)
   CO   CO   CO
        |
        CO

  2 ta axial CO (yuqorida/pastda)
  3 ta ekvatorial CO (o'rtada)
  
  [Animatsiyani boshlash]
`}
                  </pre>
                </div>
              </div>

              {/* MEXANIZM BOSQICHLARI */}
              <div className="space-y-3">
                {[
                  { step: "1", title: "Boshlang'ich holat", desc: "Trigonal bipiramida (D₃ₕ): 2 axial CO + 3 ekvatorial CO", color: "amber" },
                  { step: "2", title: "Burchak o'zgarishi boshlanadi", desc: "2 ta ekvatorial CO yuqoriga ko'tariladi (C−Fe−C burchak 120° → 90°)", color: "orange" },
                  { step: "3", title: "Kvadrat piramida oraliq holat", desc: "C₂ᵥ simmetriya orqali o'tish (eng yuqori energiya nuqtasi)", color: "red" },
                  { step: "4", title: "Burchak o'zgarishi davom etadi", desc: "2 ta axial CO pastga tushadi (180° → 120°)", color: "pink" },
                  { step: "5", title: "Yangi trigonal bipiramida", desc: "Oldingi axial CO lar endi ekvatorial, eski ekvatoriallar axial!", color: "emerald" },
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
            </div>

            {/* KINETIKA */}
            <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">
                  ⏱️
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Kinetik va spektroskopik dalillar</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-950/50 rounded-xl p-5 border border-blue-700/30">
                  <h3 className="text-blue-400 font-bold mb-3">🎯 NMR dalillari</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">¹³C NMR (25°C):</strong> <strong className="text-yellow-300">1 ta cho'qqi</strong> (barcha 5 ta CO ekvivalent!)</p>
                    <p>• <strong className="text-white">Sabab:</strong> Pseudorotation juda tez (10⁶ s⁻¹)</p>
                    <p>• <strong className="text-white">Past haroratda (-140°C):</strong> 2 ta cho'qqi (axial va ekvatorial ajraladi)</p>
                    <p className="text-xs text-purple-400 mt-2">
                      Bu hodisa <strong className="text-white">NMR vaqt shkalasi</strong>da 
                      pseudorotation <strong>tez</strong> ekanligini isbotlaydi!
                    </p>
                  </div>
                </div>

                <div className="bg-indigo-950/50 rounded-xl p-5 border border-indigo-700/30">
                  <h3 className="text-indigo-400 font-bold mb-3">⚡ Aktivatsiya energiyasi</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Eₐ ≈ 2-6 kJ/mol</strong> (juda past!)</p>
                    <p>• <strong className="text-white">Tezlik:</strong> 25°C da ~10⁶ marta/sekund</p>
                    <p>• <strong className="text-white">Tezlik:</strong> -140°C da ~10² marta/sekund</p>
                    <p>• <strong className="text-white">ΔG‡:</strong> ~15 kJ/mol</p>
                    <p className="text-xs text-purple-400 mt-2">
                      Bu past to'siq tufayli <strong className="text-yellow-300">axial va ekvatorial CO lar</strong> 
                      tez almashinadi — shuning uchun FTIR da <strong>o'rtacha cho'qqilar</strong> kuzatiladi.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-2xl p-5">
                <h3 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Boshqa trigonal bipiramidal komplekslarda
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">[Fe(CO)₅]</strong> — Berry pseudorotation <strong className="text-yellow-300">tez</strong> (Eₐ ≈ 2 kJ/mol)</p>
                  <p>• <strong className="text-white">[Co(CN)₅]³⁻</strong> — <strong className="text-yellow-300">sekin</strong> (kuchli ligandlar)</p>
                  <p>• <strong className="text-white">PF₅</strong> — <strong className="text-yellow-300">tez</strong> (¹⁹F NMR da 1 cho'qqi)</p>
                  <p className="text-xs text-purple-400 mt-2">
                    <strong className="text-pink-300">R. Stephen Berry</strong> bu mexanizmni 1960 yilda taklif qildi — 
                    shuning uchun uning nomi bilan atalgan.
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
                  📡
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">FTIR spektroskopiya — eng muhim usul</h2>
              </div>
              
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-green-400">FTIR</strong> — [Fe(CO)₅] ni tahlil qilishning 
                  <strong className="text-white"> eng muhim usuli</strong>. ν(CO) cho'qqilari 
                  <strong className="text-yellow-300"> bog'lanish tabiatini</strong> (σ-donatsiya vs π-backbonding) 
                  va <strong className="text-pink-300"> geometriyani</strong> aniqlaydi.
                </p>
              </div>

              {/* FTIR JADVALI */}
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead className="bg-purple-950/60">
                    <tr>
                      <th className="py-3 px-4 text-purple-300 text-left">Chastota (cm⁻¹)</th>
                      <th className="py-3 px-4 text-purple-300 text-left">Bog'lanish turi</th>
                      <th className="py-3 px-4 text-purple-300 text-left">Intensivlik</th>
                      <th className="py-3 px-4 text-purple-300 text-left">Izoh</th>
                    </tr>
                  </thead>
                  <tbody className="text-purple-200">
                    <tr className="border-b border-purple-800/30 bg-amber-900/20">
                      <td className="py-3 px-4 font-mono font-bold text-amber-300">2022</td>
                      <td className="py-3 px-4">ν(CO) axial — A₂"</td>
                      <td className="py-3 px-4">Kuchli</td>
                      <td className="py-3 px-4 text-xs">Axial CO (2 ta)</td>
                    </tr>
                    <tr className="border-b border-purple-800/30 bg-orange-900/20">
                      <td className="py-3 px-4 font-mono font-bold text-orange-300">2000</td>
                      <td className="py-3 px-4">ν(CO) ekvatorial — E'</td>
                      <td className="py-3 px-4">Juda kuchli</td>
                      <td className="py-3 px-4 text-xs">Ekvatorial CO (3 ta)</td>
                    </tr>
                    <tr className="border-b border-purple-800/30 bg-yellow-900/20">
                      <td className="py-3 px-4 font-mono font-bold text-yellow-300">1983</td>
                      <td className="py-3 px-4">ν(CO) ekvatorial — E'</td>
                      <td className="py-3 px-4">Kuchli</td>
                      <td className="py-3 px-4 text-xs">Ekvatorial (kombinatsiya)</td>
                    </tr>
                    <tr className="border-b border-purple-800/30">
                      <td className="py-3 px-4 font-mono">600-500</td>
                      <td className="py-3 px-4">δ(Fe−C−O)</td>
                      <td className="py-3 px-4">O'rta</td>
                      <td className="py-3 px-4 text-xs">Egilish tebranishlari</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono">460-420</td>
                      <td className="py-3 px-4">ν(Fe−C)</td>
                      <td className="py-3 px-4">Kuchsiz</td>
                      <td className="py-3 px-4 text-xs">Metall-uglerod bog'i</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-5">
                <h3 className="text-green-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Nega 2 ta asosiy cho'qqi?
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Erkin CO:</strong> ν(CO) = 2143 cm⁻¹ (bitta cho'qqi)</p>
                  <p>• <strong className="text-white">[Fe(CO)₅]:</strong> ν(CO) = 2022 va 2000 cm⁻¹ <span className="text-pink-300">(pasaygan!)</span></p>
                  <p>• <strong className="text-yellow-300">Sabab:</strong> π-backbonding C−O bog'ini kuchsizlantiradi</p>
                  <p>• <strong className="text-white">Ikki cho'qqi</strong> — axial va ekvatorial CO lar <strong>biroz farq qiladi</strong></p>
                  <p className="text-xs text-purple-400 mt-2">
                    Bu pasayish (~140 cm⁻¹) <strong className="text-white">kuchli π-backbonding</strong> borligini isbotlaydi!
                  </p>
                </div>
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
                  <h3 className="text-purple-400 font-bold mb-3">¹³C NMR</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">25°C:</strong> <span className="text-yellow-300 font-bold">1 ta cho'qqi</span> (δ = 211 ppm)</p>
                    <p>• <strong className="text-white">Sabab:</strong> Berry pseudorotation tez</p>
                    <p>• <strong className="text-white">-140°C:</strong> 2 ta cho'qqi (axial + ekvatorial)</p>
                    <p className="text-xs text-purple-400 mt-2">
                      Haroratga bog'liq NMR — pseudorotation <strong>kinetikasini</strong> o'rganish uchun ishlatiladi.
                    </p>
                  </div>
                </div>

                <div className="bg-indigo-950/50 rounded-xl p-5 border border-indigo-700/30">
                  <h3 className="text-indigo-400 font-bold mb-3">⁵⁷Fe NMR</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">⁵⁷Fe:</strong> I = 1/2, 2.1% tabiiy</p>
                    <p>• <strong className="text-white">δ:</strong> -2000 ppm (nisbatan Fe(CO)₅ standart)</p>
                    <p>• <strong className="text-white">Signal:</strong> singlet (barcha CO ekvivalent)</p>
                    <p className="text-xs text-purple-400 mt-2">
                      ⁵⁷Fe NMR <strong className="text-white">kam sezgir</strong>, lekin 
                      <strong className="text-yellow-300"> metallning elektron holati</strong>ni ko'rsatadi.
                    </p>
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
                  <h3 className="text-green-400 font-bold mb-3">1-usul: Sanoat sintezi (asosiy)</h3>
                  <div className="bg-green-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-green-300 border border-green-700/30">
                    <p>Fe + 5 CO → [Fe(CO)₅]</p>
                    <p className="text-green-300 text-xs mt-2">200°C, 100-200 atm, Fe kukuni + CO gazi</p>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Sharoit:</strong> Yuqori harorat va bosim (BASF jarayoni)</p>
                    <p><strong className="text-white">Katalizator:</strong> Fe ning o'zi (autokatalitik)</p>
                    <p><strong className="text-white">Hosildorlik:</strong> 85-95%</p>
                    <p><strong className="text-white">Tozalash:</strong> Distillash (103°C da qaynaydi)</p>
                  </div>
                </div>

                <div className="bg-green-950/50 rounded-2xl p-5 border border-green-700/30">
                  <h3 className="text-green-400 font-bold mb-3">2-usul: Laboratoriya (kichik miqyos)</h3>
                  <div className="bg-green-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-green-300 border border-green-700/30">
                    <p>FeCl₂ + 2 Na + 5 CO → [Fe(CO)₅] + 2 NaCl</p>
                    <p className="text-green-300 text-xs mt-2">150°C, 100 atm, THF erituvchisi</p>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Mexanizm:</strong> Na Fe²⁺ ni Fe⁰ gacha qaytaradi</p>
                    <p><strong className="text-white">Afzalligi:</strong> Past harorat (sanoatga qaraganda)</p>
                    <p><strong className="text-white">Hosildorlik:</strong> 60-70%</p>
                  </div>
                </div>

                <div className="bg-green-950/50 rounded-2xl p-5 border border-green-700/30">
                  <h3 className="text-green-400 font-bold mb-3">3-usul: Fe₂(CO)₉ dan (foto-kimyoviy)</h3>
                  <div className="bg-green-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-green-300 border border-green-700/30">
                    <p>Fe₂(CO)₉ + hν → [Fe(CO)₅] + Fe(CO)₄</p>
                    <p className="text-green-300 text-xs mt-2">UV yorug'lik, xona harorati</p>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Afzalligi:</strong> Juda yumshoq sharoit</p>
                    <p><strong className="text-white">Kamchiligi:</strong> Past hosildorlik, qo'shimcha mahsulotlar</p>
                  </div>
                </div>
              </div>
            </div>

            {/* LABORATORIYA */}
            <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">
                  🔬
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Laboratoriya protokoli (Fe₂(CO)₉ dan)</h2>
              </div>
              
              <div className="space-y-3">
                {[
                  { step: "1", title: "Tayyorgarlik", desc: "Fe₂(CO)₉ (5 g, 13.6 mmol) ni quruq, inert atmosferada (N₂ yoki Ar) o'lchash" },
                  { step: "2", title: "Eritish", desc: "Quruq THF (50 mL) da eritish — qizil-jigarrang eritma" },
                  { step: "3", title: "Fotoliz", desc: "UV lampa (350-400 nm) bilan 2-3 soat yoritish" },
                  { step: "4", title: "Rang o'zgarishi", desc: "Qizil-jigarrang → sariq (Fe(CO)₅ hosil bo'ldi)" },
                  { step: "5", title: "Filtratsiya", desc: "Qattiq qoldiqlarni filtrlash (Fe(CO)₄ polimer)" },
                  { step: "6", title: "Distillash", desc: "Past bosimda (100 mmHg) distillash, 40°C da" },
                  { step: "7", title: "Saqlash", desc: "Sariq suyuqlikni qorong'i shishada, Ar atmosferada saqlash" },
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
                  <p>• <strong className="text-red-300">Fe(CO)₅ ZAHARLI!</strong> — faqat shkaflarda ishlash</p>
                  <p>• <strong className="text-white">CO gazi ajraladi</strong> — gaz detektori zarur</p>
                  <p>• <strong className="text-white">Yonuvchan</strong> — alangadan uzoq saqlash</p>
                  <p>• <strong className="text-white">UV lampa</strong> — ko'z himoyasi kerak</p>
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
                  <h3 className="text-amber-400 font-bold mb-3">🔬 Sanoat qo'llanilishi</h3>
                  <div className="space-y-3 text-sm text-purple-200">
                    <div className="bg-amber-900/40 rounded-lg p-3 border border-amber-700/30">
                      <p className="text-amber-300 font-bold text-xs mb-1">1. Temir nanopartikullari</p>
                      <p className="text-xs">[Fe(CO)₅] parchalanishi orqali sof Fe nanopartikullari olinadi</p>
                      <p className="text-xs text-amber-300 mt-1">Qo'llanilish: magnit materiallar, katalizatorlar</p>
                    </div>
                    <div className="bg-amber-900/40 rounded-lg p-3 border border-amber-700/30">
                      <p className="text-amber-300 font-bold text-xs mb-1">2. CVD (Chemical Vapor Deposition)</p>
                      <p className="text-xs">Temir plyonkalari va qoplamalari uchun prekursör</p>
                      <p className="text-xs text-amber-300 mt-1">Qo'llanilish: elektronika, magnit yozuv</p>
                    </div>
                    <div className="bg-amber-900/40 rounded-lg p-3 border border-amber-700/30">
                      <p className="text-amber-300 font-bold text-xs mb-1">3. Organometallik sintez</p>
                      <p className="text-xs">Boshqa Fe komplekslarini olish uchun boshlang'ich modda</p>
                      <p className="text-xs text-amber-300 mt-1">Masalan: [Fe(CO)₄]²⁻, Fe₂(CO)₉, Fe₃(CO)₁₂</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-950/50 rounded-xl p-5 border border-orange-700/30">
                  <h3 className="text-orange-400 font-bold mb-3">🧪 Ilmiy qo'llanilish</h3>
                  <div className="space-y-3 text-sm text-purple-200">
                    <div className="bg-orange-900/40 rounded-lg p-3 border border-orange-700/30">
                      <p className="text-orange-300 font-bold text-xs mb-1">1. Kataliz tadqiqotlari</p>
                      <p className="text-xs">Fischer-Tropsch sintezi, gidroformilash reaktsiyalari</p>
                      <p className="text-xs text-orange-300 mt-1">Model kompleks sifatida</p>
                    </div>
                    <div className="bg-orange-900/40 rounded-lg p-3 border border-orange-700/30">
                      <p className="text-orange-300 font-bold text-xs mb-1">2. Bog'lanish nazariyasi</p>
                      <p className="text-xs">Sinergik bog'lanish (σ-donatsiya + π-backbonding) modeli</p>
                      <p className="text-xs text-orange-300 mt-1">Ta'lim: eng klassik misol</p>
                    </div>
                    <div className="bg-orange-900/40 rounded-lg p-3 border border-orange-700/30">
                      <p className="text-orange-300 font-bold text-xs mb-1">3. Dinamik kimyo</p>
                      <p className="text-xs">Berry pseudorotation hodisasini o'rganish</p>
                      <p className="text-xs text-orange-300 mt-1">NMR va FTIR orqali kinetika</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* HOSILALAR */}
              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-5">
                <h3 className="text-amber-400 font-bold mb-3 flex items-center gap-2">
                  <span>🔄</span> [Fe(CO)₅] dan olinadigan hosilalar
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-amber-900/40 rounded-lg p-3 border border-amber-700/30">
                    <p className="text-amber-300 font-bold text-xs">Fe₂(CO)₉</p>
                    <p className="text-xs text-purple-200 mt-1">Fotoliz: 2 [Fe(CO)₅] → Fe₂(CO)₉</p>
                  </div>
                  <div className="bg-amber-900/40 rounded-lg p-3 border border-amber-700/30">
                    <p className="text-amber-300 font-bold text-xs">Fe₃(CO)₁₂</p>
                    <p className="text-xs text-purple-200 mt-1">Termal parchalanish</p>
                  </div>
                  <div className="bg-amber-900/40 rounded-lg p-3 border border-amber-700/30">
                    <p className="text-amber-300 font-bold text-xs">[Fe(CO)₄]²⁻</p>
                    <p className="text-xs text-purple-200 mt-1">Na bilan qaytarish (Collman reagenti)</p>
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Mond va Quincke kashfiyoti (1891)</h2>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-2xl p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-yellow-600 to-amber-600 flex items-center justify-center text-6xl flex-shrink-0 shadow-2xl">
                    👨‍🔬
                  </div>
                  <div className="flex-1">
                    <h3 className="text-yellow-400 font-bold text-xl mb-2">Ludwig Mond (1839-1909) & Carl Quincke</h3>
                    <p className="text-purple-200 text-sm mb-3 leading-relaxed">
                      <strong className="text-yellow-300">1891 yilda</strong> Nemis-ingliz kimyogarlari Ludwig Mond va Carl Quincke 
                      birinchi bo'lib <strong className="text-white">[Fe(CO)₅]</strong> ni sintez qildi. 
                      Bu <strong className="text-white">[Ni(CO)₄]</strong> (1890) kashfiyotidan keyin ikkinchi metall karbonil edi.
                      Bu kashfiyot <strong className="text-yellow-300">organometallik kimyo</strong> sohasining boshlanishi bo'ldi!
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-xs text-yellow-300 font-semibold">
                        📜 1891 yil
                      </span>
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-xs text-amber-300 font-semibold">
                        📍 London
                      </span>
                      <span className="px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-xs text-orange-300 font-semibold">
                        🏭 Organometallik dawn
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
                  <p>• <strong className="text-white">Birinchi metall karbonillar:</strong> [Ni(CO)₄] (1890) va [Fe(CO)₅] (1891)</p>
                  <p>• <strong className="text-yellow-300">18 elektron qoidasi:</strong> bu komplekslar qoida yaratishga ilhom berdi</p>
                  <p>• <strong className="text-white">Sinergik bog'lanish:</strong> σ + π tushunchasi rivojlandi</p>
                  <p>• <strong className="text-white">Sanoat qo'llanilishi:</strong> Mond jarayoni (Ni tozalash), Fischer-Tropsch</p>
                  <p>• <strong className="text-white">Nobel mukofotlari:</strong> Fischer va Wilkinson (1973) — organometallik kimyo</p>
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
                  { year: "1890", title: "[Ni(CO)₄] kashfiyoti", desc: "Mond, Langer va Quincke birinchi metall karbonilni sintez qildi" },
                  { year: "1891", title: "[Fe(CO)₅] sintezi", desc: "Mond va Quincke Fe kukuni + CO gazi → sariq suyuqlik" },
                  { year: "1928", title: "18 elektron qoidasi", desc: "Sidgwick organometallik komplekslar uchun qoidani taklif qildi" },
                  { year: "1960", title: "Berry pseudorotation", desc: "R. Stephen Berry trigonal bipiramidal dinamikani tushuntirdi" },
                  { year: "1973", title: "Nobel mukofoti", desc: "Fischer va Wilkinson organometallik kimyo uchun Nobel oldi" },
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
              href="/ilmiy/birikmares/trans-pt-nh3-2-cl2"
              onClick={(e) => { e.preventDefault(); window.history.back(); }}
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold transition-all flex items-center gap-2"
            >
              <span>←</span>
              <span className="hidden sm:inline">trans-[Pt(NH₃)₂Cl₂]</span>
            </Link>
            <Link 
              href="/ilmiy/birikmares/ni-co-4"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold transition-all shadow-lg shadow-emerald-500/30 flex items-center gap-2"
            >
              <span className="hidden sm:inline">[Ni(CO)₄]</span>
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