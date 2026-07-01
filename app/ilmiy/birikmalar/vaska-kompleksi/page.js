"use client"

import Link from "next/link"
import { useState } from "react"

export default function VaskaKompleksi() {
  const [activeTab, setActiveTab] = useState("overview")
  const [reactionType, setReactionType] = useState("o2") // o2 | h2 | ch3i | cl2

  const tabs = [
    { id: "overview", label: "📋 Umumiy", icon: "📋" },
    { id: "structure", label: "🧬 Kvadrat-tekis", icon: "🧬" },
    { id: "electronic", label: "⚛️ 16 elektron (d⁸)", icon: "⚛️" },
    { id: "bonding", label: "🔗 CO va PPh₃", icon: "🔗" },
    { id: "oxidative", label: "⚡ Oksidativ birikish", icon: "⚡" },
    { id: "spectroscopy", label: "🔬 Spektroskopiya", icon: "🔬" },
    { id: "applications", label: "🏭 Kataliz", icon: "🏭" },
    { id: "synthesis", label: "⚗️ Sintez", icon: "⚗️" },
    { id: "history", label: "🏆 Tarix (1961)", icon: "🏆" },
  ]

  const reactionData = {
    o2: {
      name: "O₂ birikishi",
      product: "trans-[IrCl(CO)(PPh₃)₂(O₂)]",
      irBefore: "1967 cm⁻¹",
      irAfter: "1950 cm⁻¹",
      irO2: "1150 cm⁻¹ (ν(O-O))",
      mechanism: "Oksidativ birikish",
      oxidationChange: "Ir(I) → Ir(III)",
      electronChange: "d⁸ → d⁶",
      reversibility: "Qaytar (vakuumda O₂ chiqadi)"
    },
    h2: {
      name: "H₂ birikishi",
      product: "trans-[IrCl(CO)(PPh₃)₂(H)₂]",
      irBefore: "1967 cm⁻¹",
      irAfter: "2000 cm⁻¹",
      irO2: "2100, 2200 cm⁻¹ (ν(Ir-H))",
      mechanism: "Oksidativ birikish",
      oxidationChange: "Ir(I) → Ir(III)",
      electronChange: "d⁸ → d⁶",
      reversibility: "Qaytar"
    },
    ch3i: {
      name: "CH₃I birikishi",
      product: "trans-[IrCl(CO)(PPh₃)₂(CH₃)(I)]",
      irBefore: "1967 cm⁻¹",
      irAfter: "2050 cm⁻¹",
      irO2: "—",
      mechanism: "Oksidativ birikish",
      oxidationChange: "Ir(I) → Ir(III)",
      electronChange: "d⁸ → d⁶",
      reversibility: "Qaytmas"
    },
    cl2: {
      name: "Cl₂ birikishi",
      product: "trans-[IrCl₃(CO)(PPh₃)₂]",
      irBefore: "1967 cm⁻¹",
      irAfter: "2070 cm⁻¹",
      irO2: "—",
      mechanism: "Oksidativ birikish",
      oxidationChange: "Ir(I) → Ir(III)",
      electronChange: "d⁸ → d⁶",
      reversibility: "Qaytmas"
    }
  }

  const currentReaction = reactionData[reactionType]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white relative overflow-hidden">
      
      {/* ═══ ANIMATED BACKGROUND ═══ */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-yellow-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(245,158,11,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        {['Ir(I)', 'd⁸', '16 e⁻', 'kvadrat-tekis', 'Vaska 1961', 'oksidativ birikish', 'PPh₃', 'CO'].map((sym, i) => (
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
            <span className="text-amber-400 font-semibold">trans-[IrCl(CO)(PPh₃)₂]</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                  ⚡ Oksidativ birikish klassikasi
                </span>
                <span className="px-2.5 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-[10px] text-yellow-300 font-semibold">
                  🏆 Vaska 1961
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] text-emerald-300 font-semibold">
                  ⚛️ 16 elektron (d⁸)
                </span>
                <span className="px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-[10px] text-purple-300 font-semibold">
                  💎 Kvadrat-tekis
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
                trans-[IrCl(CO)(PPh₃)₂]
              </h1>
              <p className="text-purple-300 text-sm mt-1">
                Vaska kompleksi • Karbonilxlorobis(trifenilfosfin)iridiy(I) • Vaska&apos;s complex
              </p>
            </div>
            
            <div className="flex gap-2">
              <Link 
                href="/ilmiy/birikmares/zeise-tuzi"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 hover:border-amber-400/60 text-amber-300 text-sm font-semibold transition-all flex items-center gap-2"
              >
                <span>🔗</span>
                <span className="hidden sm:inline">Zeise tuzi</span>
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
            { label: "Formula", value: "trans-[IrCl(CO)(PPh₃)₂]", icon: "🧪", color: "text-amber-400" },
            { label: "M massa", value: "780.3 g/mol", icon: "⚖️", color: "text-blue-400" },
            { label: "Geometriya", value: "Kvadrat-tekis", icon: "💎", color: "text-purple-400" },
            { label: "Rangi", value: "Sariq", icon: "🎨", color: "text-yellow-400" },
            { label: "Elektronlar", value: "16 e⁻ (d⁸)", icon: "⚛️", color: "text-emerald-400" },
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Asosiy ma&apos;lumotlar — Vaska kompleksi</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  ["CAS raqami", "14871-19-7"],
                  ["Zichlik", "1.55 g/cm³"],
                  ["Sistema", "Monoklinik"],
                  ["Fazoviy guruh", "P2₁/n"],
                  ["Eruvchanlik (benzol)", "Yaxshi eriydi"],
                  ["Eruvchanlik (H₂O)", "Erimaydi"],
                  ["Barqarorlik", "Yuqori (inert)"],
                  ["Rangi", "Sariq kristall"],
                ].map((item, i) => (
                  <div key={i} className="bg-amber-950/50 rounded-xl p-3 border border-amber-700/30">
                    <div className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold mb-1">{item[0]}</div>
                    <div className="text-white font-semibold text-sm">{item[1]}</div>
                  </div>
                ))}
              </div>

              {/* ICHKI SFERA */}
              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-5">
                <h3 className="text-amber-400 font-bold mb-3 flex items-center gap-2">
                  <span>💎</span> Kompleks strukturasi
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-amber-900/30 rounded-xl p-4 border border-amber-700/30">
                    <h4 className="text-amber-300 font-bold text-sm mb-2">🔗 Kvadrat-tekis geometriya</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">Ir⁺</strong> — markaziy ion (5d⁸)</li>
                      <li>• <strong className="text-white">1 × Cl⁻</strong> — xlor ligandi</li>
                      <li>• <strong className="text-white">1 × CO</strong> — karbonil ligandi</li>
                      <li>• <strong className="text-white">2 × PPh₃</strong> — trifenilfosfin ligandlari</li>
                      <li>• <strong className="text-yellow-300">Trans:</strong> PPh₃ lar qarama-qarshi (180°)</li>
                      <li>• <strong className="text-pink-300">Koordinatsion son:</strong> 4</li>
                    </ul>
                  </div>
                  <div className="bg-orange-900/30 rounded-xl p-4 border border-orange-700/30">
                    <h4 className="text-orange-300 font-bold text-sm mb-2">⚡ Oksidativ birikish</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">16 elektron:</strong> 2 ta elektron kam (18 emas!)</li>
                      <li>• <strong className="text-white">Bo'sh koordinatsion joy:</strong> kichik molekulalar kirishi mumkin</li>
                      <li>• <strong className="text-white">O₂, H₂, Cl₂, CH₃I</strong> bilan reaksiyaga kirishadi</li>
                      <li>• <strong className="text-yellow-300">Ir(I) → Ir(III):</strong> oksidlanish darajasi +2 ga oshadi</li>
                      <li>• <strong className="text-pink-300">d⁸ → d⁶:</strong> elektron konfiguratsiyasi o'zgaradi</li>
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
                  "⚡ <strong>Oksidativ birikish:</strong> Vaska kompleksi O₂, H₂, Cl₂ bilan reaksiyaga kirishadi — Ir(I) → Ir(III)",
                  "⚛️ <strong>16 elektron (d⁸):</strong> kvadrat-tekis, 2 ta elektron kam (18 emas!) — bo'sh koordinatsion joy",
                  "💎 <strong>Kvadrat-tekis:</strong> trans geometriya, PPh₃ lar qarama-qarshi (180°)",
                  "🔗 <strong>CO bog'lanishi:</strong> σ-donatsiya + π-backbonding (DCD modeli)",
                  "🔬 <strong>IR spektroskopiya:</strong> ν(CO) = 1967 cm⁻¹ (oksidativ birikishdan keyin oshadi)",
                  "🏆 <strong>Vaska 1961:</strong> oksidativ birikish mexanizmini tushuntirish uchun asos",
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
                  🧬
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Kvadrat-tekis geometriya</h2>
              </div>
              
              <div className="bg-amber-950/60 rounded-xl p-5 font-mono text-sm text-amber-200 border border-amber-700/30 mb-6 text-center">
                <pre className="whitespace-pre">{`            PPh₃
            |
   Cl — Ir — CO
            |
            PPh₃
            
   Kvadrat-tekis: Ir⁺ markazda, 4 ta ligand
   trans geometriya: PPh₃ lar qarama-qarshi (180°)`}</pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-purple-400 font-bold text-sm uppercase tracking-wider">Geometrik parametrlar</h3>
                  <div className="space-y-2">
                    {[
                      ["Geometriya", "Kvadrat-tekis (square planar)"],
                      ["Nuqtali guruh", "C₂ᵥ (taxminan)"],
                      ["Ir−Cl masofa", "2.37 Å"],
                      ["Ir−C masofa", "1.83 Å"],
                      ["C−O masofa", "1.14 Å"],
                      ["Ir−P masofa", "2.33 Å (2 ta)"],
                      ["Cl−Ir−CO burchak", "180° (trans)"],
                      ["P−Ir−P burchak", "180° (trans)"],
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-purple-800/30">
                        <span className="text-purple-300 text-sm">{item[0]}</span>
                        <span className="text-white font-semibold text-sm font-mono">{item[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-amber-400 font-bold text-sm uppercase tracking-wider">Trans effekt</h3>
                  <div className="space-y-3">
                    <div className="bg-amber-900/30 rounded-xl p-4 border border-amber-700/30">
                      <h4 className="text-amber-300 font-bold text-sm mb-2">⚡ Trans effekt qatori</h4>
                      <div className="space-y-2 text-sm text-purple-200">
                        <p>• <strong className="text-white">CO:</strong> juda kuchli trans effekt</p>
                        <p>• <strong className="text-white">Cl⁻:</strong> o'rta trans effekt</p>
                        <p>• <strong className="text-white">PPh₃:</strong> kuchli trans effekt</p>
                        <p className="text-xs text-amber-300 mt-2">
                          <strong>Natija:</strong> CO ning trans-pozitsiyasidagi Cl⁻ bog'i kuchsizlanadi — 
                          bu Cl⁻ ni almashtirish reaktsiyalarini osonlashtiradi.
                        </p>
                      </div>
                    </div>
                    <div className="bg-orange-900/30 rounded-xl p-4 border border-orange-700/30">
                      <h4 className="text-orange-300 font-bold text-sm mb-2">💎 Nega trans?</h4>
                      <div className="space-y-2 text-sm text-purple-200">
                        <p>• <strong className="text-white">Sterik sabab:</strong> PPh₃ juda katta ligand (3 ta fenil guruhi)</p>
                        <p>• <strong className="text-white">Trans geometriya:</strong> PPh₃ lar bir-biridan uzoq (180°) — minimal sterik to'siq</p>
                        <p>• <strong className="text-white">Cis geometriya:</strong> PPh₃ lar yonma-yon (90°) — katta sterik to'siq</p>
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Elektron tuzilishi — Ir⁺ (5d⁸)</h2>
              </div>
              
              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-2 border-amber-500/30 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-amber-400">Muhim:</strong> Vaska kompleksi <strong className="text-yellow-300">16 elektronli</strong> kompleks — 
                  18 elektron qoidasi <strong className="text-red-300">bajarilmagan</strong>! Bu uning 
                  <strong className="text-white"> reaktivligining asosiy sababi</strong> — bo'sh koordinatsion joy bor, 
                  shuning uchun kichik molekulalar (O₂, H₂) kirishi mumkin.
                </p>
              </div>

              {/* ELEKTRON HISOB */}
              <div className="bg-emerald-950/50 rounded-2xl p-6 border border-emerald-700/30 mb-6">
                <h3 className="text-emerald-400 font-bold mb-4">[IrCl(CO)(PPh₃)₂] uchun elektron hisobi</h3>
                <div className="space-y-3">
                  <div className="bg-emerald-900/40 rounded-xl p-4 border border-emerald-700/30 flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold">Ir⁺ (iridiy)</div>
                      <div className="text-purple-300 text-xs mt-1">
                        Konfiguratsiya: [Xe] 4f¹⁴ 5d⁸ → 8 ta valent elektron
                      </div>
                    </div>
                    <div className="text-emerald-300 text-2xl font-bold font-mono">8 e⁻</div>
                  </div>
                  <div className="bg-emerald-900/40 rounded-xl p-4 border border-emerald-700/30 flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold">1 × Cl⁻</div>
                      <div className="text-purple-300 text-xs mt-1">
                        Xlor ligandi (σ-donor)
                      </div>
                    </div>
                    <div className="text-emerald-300 text-2xl font-bold font-mono">2 e⁻</div>
                  </div>
                  <div className="bg-emerald-900/40 rounded-xl p-4 border border-emerald-700/30 flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold">1 × CO</div>
                      <div className="text-purple-300 text-xs mt-1">
                        Karbonil ligandi (σ-donor + π-akseptor)
                      </div>
                    </div>
                    <div className="text-emerald-300 text-2xl font-bold font-mono">2 e⁻</div>
                  </div>
                  <div className="bg-emerald-900/40 rounded-xl p-4 border border-emerald-700/30 flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold">2 × PPh₃</div>
                      <div className="text-purple-300 text-xs mt-1">
                        Har bir PPh₃ 2 ta elektron beradi (σ-donor)
                      </div>
                    </div>
                    <div className="text-emerald-300 text-2xl font-bold font-mono">2 × 2 = 4 e⁻</div>
                  </div>
                  <div className="bg-red-900/40 rounded-xl p-4 border-2 border-red-500/30 flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold text-lg">JAMI</div>
                      <div className="text-red-300 text-xs mt-1">
                        18 elektron qoidasi bajarilmagan! (2 ta elektron kam)
                      </div>
                    </div>
                    <div className="text-red-300 text-3xl font-bold font-mono">16 e⁻</div>
                  </div>
                </div>
              </div>

              {/* GIBRIDLANISH */}
              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-5 mb-6">
                <h3 className="text-emerald-400 font-bold mb-3 flex items-center gap-2">
                  <span>💡</span> dsp² gibridlanish
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">1 ta 5d orbital</strong> (d<sub>x²-y²</sub>)</p>
                  <p>• <strong className="text-white">1 ta 6s orbital</strong></p>
                  <p>• <strong className="text-white">2 ta 6p orbital</strong> (p<sub>x</sub> va p<sub>y</sub>)</p>
                  <p>• <strong className="text-yellow-300">Jami:</strong> 4 ta dsp² gibrid orbital → 4 ta σ-bog' (kvadrat-tekis)</p>
                  <p className="text-xs text-purple-400 mt-2">
                    Qolgan 8 ta d-elektron <strong className="text-white">to'liq juftlashgan</strong> 
                    (4 ta to'liq orbital) → <strong className="text-green-400">diamagnit</strong>.
                  </p>
                </div>
              </div>

              {/* 16 vs 18 ELEKTRON */}
              <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-2 border-red-500/30 rounded-2xl p-5">
                <h3 className="text-red-400 font-bold mb-3 flex items-center gap-2">
                  <span>⚠️</span> Nima uchun 16 elektron? (18 emas!)
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Kvadrat-tekis geometriya:</strong> faqat 4 ta ligand → 8 ta elektron ligandlardan</p>
                  <p>• <strong className="text-white">Ir⁺ (d⁸):</strong> 8 ta d-elektron</p>
                  <p>• <strong className="text-yellow-300">Jami:</strong> 8 + 8 = 16 elektron (18 emas!)</p>
                  <p>• <strong className="text-white">Natija:</strong> <strong className="text-red-300">bo'sh koordinatsion joy</strong> — kichik molekulalar (O₂, H₂) kirishi mumkin</p>
                  <p className="text-xs text-purple-400 mt-2">
                    Bu <strong className="text-pink-300">oksidativ birikish</strong> reaktsiyalarining asosiy sababi — 
                    Vaska kompleksi O₂, H₂, Cl₂, CH₃I bilan reaksiyaga kirishadi!
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
            <div className="bg-gradient-to-br from-pink-900/40 to-purple-900/40 border border-pink-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-xl shadow-lg shadow-pink-500/30">
                  🔗
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">CO va PPh₃ bog'lanish mexanizmi</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-pink-950/50 rounded-xl p-5 border border-pink-700/30">
                  <h3 className="text-pink-400 font-bold mb-3">1️⃣ CO bog'lanishi (DCD modeli)</h3>
                  <div className="bg-pink-900/40 rounded-lg p-4 font-mono text-xs text-pink-200 border border-pink-700/30 mb-3">
                    <pre className="whitespace-pre">{`  σ-donatsiya: C → Ir
  π-backbonding: Ir → C
  
  DCD (Dewar-Chatt-Duncanson) modeli`}</pre>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">σ-donatsiya:</strong> CO ning to'lgan 5σ orbitali → Ir ning bo'sh dsp² orbitali</p>
                    <p>• <strong className="text-white">π-backbonding:</strong> Ir ning to'lgan d-orbitallari → CO ning bo'sh π* orbitali</p>
                    <p>• <strong className="text-yellow-300">Natija:</strong> Ir−C bog' kuchayadi, C≡O bog' kuchsizlanadi</p>
                    <p>• <strong className="text-pink-300">IR:</strong> ν(CO) = 1967 cm⁻¹ (erkin CO: 2143 cm⁻¹ dan past)</p>
                  </div>
                </div>

                <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
                  <h3 className="text-purple-400 font-bold mb-3">2️⃣ PPh₃ bog'lanishi</h3>
                  <div className="bg-purple-900/40 rounded-lg p-4 font-mono text-xs text-purple-200 border border-purple-700/30 mb-3">
                    <pre className="whitespace-pre">{`  σ-donatsiya: P → Ir
  π-backbonding: Ir → P (kuchsiz)
  
  Asosan σ-donatsiya`}</pre>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">σ-donatsiya:</strong> P ning yolg'iz elektron jufti → Ir ning bo'sh dsp² orbitali</p>
                    <p>• <strong className="text-white">π-backbonding:</strong> Ir → P (juda kuchsiz, P da bo'sh d-orbitallar bor)</p>
                    <p>• <strong className="text-yellow-300">Natija:</strong> Ir−P bog' asosan σ-xarakterli</p>
                    <p>• <strong className="text-purple-300">Trans effekt:</strong> PPh₃ kuchli trans effektga ega</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 rounded-2xl p-5">
                <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                  <span>⚡</span> Trans effekt — CO vs PPh₃
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">CO:</strong> juda kuchli trans effekt (π-akseptor)</p>
                  <p>• <strong className="text-white">PPh₃:</strong> kuchli trans effekt (σ-donor + kuchsiz π-akseptor)</p>
                  <p>• <strong className="text-white">Cl⁻:</strong> o'rta trans effekt</p>
                  <p>• <strong className="text-yellow-300">Natija:</strong> CO ning trans-pozitsiyasidagi Cl⁻ bog'i kuchsizlanadi</p>
                  <p className="text-xs text-purple-400 mt-2">
                    Bu <strong className="text-pink-300">ligand almashinish</strong> reaktsiyalarini osonlashtiradi — 
                    Cl⁻ ni boshqa ligandlar bilan almashtirish mumkin.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* OXIDATIVE ADDITION TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "oxidative" && (
          <>
            <div className="bg-gradient-to-br from-red-900/40 to-orange-900/40 border border-red-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-xl shadow-lg shadow-red-500/30">
                  ⚡
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Oksidativ birikish — Vaska kompleksining asosiy xususiyati</h2>
              </div>
              
              <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-2 border-red-500/30 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-red-400">Oksidativ birikish</strong> — bu metallning oksidlanish darajasi 
                  <strong className="text-yellow-300"> +2 ga oshishi</strong> va koordinatsion sonning 
                  <strong className="text-pink-300"> +2 ga oshishi</strong> bilan birga sodir bo'ladigan reaktsiya.
                  Vaska kompleksi bu reaktsiyaning <strong className="text-white">klassik namunasi</strong> — 
                  u O₂, H₂, Cl₂, CH₃I bilan reaksiyaga kirishadi!
                </p>
              </div>

              {/* REAKTSIYA TANLASH */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setReactionType("o2")}
                  className={`flex-1 py-3 rounded-xl border-2 transition-all ${
                    reactionType === "o2"
                      ? 'bg-red-500/20 border-red-500/50 text-red-300'
                      : 'bg-white/5 border-white/10 text-purple-300 hover:bg-white/10'
                  }`}
                >
                  🫁 O₂
                </button>
                <button
                  onClick={() => setReactionType("h2")}
                  className={`flex-1 py-3 rounded-xl border-2 transition-all ${
                    reactionType === "h2"
                      ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                      : 'bg-white/5 border-white/10 text-purple-300 hover:bg-white/10'
                  }`}
                >
                  💨 H₂
                </button>
                <button
                  onClick={() => setReactionType("ch3i")}
                  className={`flex-1 py-3 rounded-xl border-2 transition-all ${
                    reactionType === "ch3i"
                      ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                      : 'bg-white/5 border-white/10 text-purple-300 hover:bg-white/10'
                  }`}
                >
                  🧪 CH₃I
                </button>
                <button
                  onClick={() => setReactionType("cl2")}
                  className={`flex-1 py-3 rounded-xl border-2 transition-all ${
                    reactionType === "cl2"
                      ? 'bg-green-500/20 border-green-500/50 text-green-300'
                      : 'bg-white/5 border-white/10 text-purple-300 hover:bg-white/10'
                  }`}
                >
                  ⚗️ Cl₂
                </button>
              </div>

              {/* REAKTSIYA MA'LUMOTLARI */}
              <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-2 border-red-500/30 rounded-2xl p-5 mb-6">
                <h3 className="text-red-400 font-bold mb-3">{currentReaction.name}</h3>
                <div className="bg-red-900/40 rounded-lg p-4 font-mono text-sm text-red-200 border border-red-700/30 mb-4 text-center">
                  <p>trans-[IrCl(CO)(PPh₃)₂] + X₂ → {currentReaction.product}</p>
                  <p className="mt-2 text-red-300 text-xs">{currentReaction.mechanism}: {currentReaction.oxidationChange}, {currentReaction.electronChange}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">IR (oldin):</strong> ν(CO) = {currentReaction.irBefore}</p>
                    <p>• <strong className="text-white">IR (keyin):</strong> ν(CO) = {currentReaction.irAfter}</p>
                    {currentReaction.irO2 !== "—" && (
                      <p>• <strong className="text-white">Yangi cho'qqi:</strong> {currentReaction.irO2}</p>
                    )}
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Qaytarlik:</strong> {currentReaction.reversibility}</p>
                    <p>• <strong className="text-white">Mexanizm:</strong> {currentReaction.mechanism}</p>
                  </div>
                </div>
              </div>

              {/* MEXANIZM */}
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-5">
                <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                  <span>💡</span> Oksidativ birikish mexanizmi
                </h3>
                <div className="space-y-3 text-sm text-purple-200">
                  <div className="bg-yellow-900/30 rounded-lg p-3 border border-yellow-700/30">
                    <p className="text-yellow-300 font-bold text-xs mb-1">1. Koordinatsiya</p>
                    <p className="text-xs">X₂ molekulasi Ir ga yaqinlashadi (bo'sh koordinatsion joy)</p>
                  </div>
                  <div className="bg-yellow-900/30 rounded-lg p-3 border border-yellow-700/30">
                    <p className="text-yellow-300 font-bold text-xs mb-1">2. Bog' uzilishi</p>
                    <p className="text-xs">X−X bog'i uziladi, 2 ta X atomi Ir bilan bog'lanadi</p>
                  </div>
                  <div className="bg-yellow-900/30 rounded-lg p-3 border border-yellow-700/30">
                    <p className="text-yellow-300 font-bold text-xs mb-1">3. Oksidlanish</p>
                    <p className="text-xs">Ir(I) → Ir(III), d⁸ → d⁶, 16 e⁻ → 18 e⁻</p>
                  </div>
                  <div className="bg-yellow-900/30 rounded-lg p-3 border border-yellow-700/30">
                    <p className="text-yellow-300 font-bold text-xs mb-1">4. Geometriya o'zgarishi</p>
                    <p className="text-xs">Kvadrat-tekis → oktaedrik (6 ta ligand)</p>
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
                  🔬
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Spektroskopik xususiyatlar</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-green-950/50 rounded-xl p-5 border border-green-700/30">
                  <h3 className="text-green-400 font-bold mb-3">📡 IR spektroskopiya</h3>
                  <div className="space-y-2">
                    {[
                      { freq: "1967 cm⁻¹", bond: "ν(CO)", desc: "Karbonil cho'qqisi (kuchli)", intensity: "Juda kuchli" },
                      { freq: "305 cm⁻¹", bond: "ν(Ir−Cl)", desc: "Ir-Cl valent tebranish", intensity: "Kuchli" },
                      { freq: "510 cm⁻¹", bond: "ν(Ir−C)", desc: "Ir-C valent tebranish", intensity: "O'rta" },
                      { freq: "280 cm⁻¹", bond: "ν(Ir−P)", desc: "Ir-P valent tebranish (2 ta)", intensity: "Kuchli" },
                    ].map((item, i) => (
                      <div key={i} className="bg-green-900/40 rounded-lg p-2 border border-green-700/30">
                        <div className="flex justify-between items-center">
                          <span className="text-green-400 font-mono text-xs">{item.freq}</span>
                          <span className="text-white text-xs">{item.bond}</span>
                        </div>
                        <p className="text-purple-300 text-[10px] mt-0.5">{item.desc} • {item.intensity}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-emerald-950/50 rounded-xl p-5 border border-emerald-700/30">
                  <h3 className="text-emerald-400 font-bold mb-3">🧲 NMR spektroskopiya</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <div className="bg-emerald-900/40 rounded-lg p-3 border border-emerald-700/30">
                      <p className="text-emerald-300 font-bold text-xs mb-1">³¹P NMR</p>
                      <p className="text-xs">δ = −5.2 ppm (2 ta ekvivalent P)</p>
                      <p className="text-xs text-emerald-300">J(P-P) = 0 Hz (trans, uzoq)</p>
                    </div>
                    <div className="bg-teal-900/40 rounded-lg p-3 border border-teal-700/30">
                      <p className="text-teal-300 font-bold text-xs mb-1">¹H NMR (PPh₃)</p>
                      <p className="text-xs">δ = 7.2-7.5 ppm (aromatik H)</p>
                      <p className="text-xs text-teal-300">30 ta H (2 × 15 H)</p>
                    </div>
                    <div className="bg-cyan-900/40 rounded-lg p-3 border border-cyan-700/30">
                      <p className="text-cyan-300 font-bold text-xs mb-1">¹³C NMR (CO)</p>
                      <p className="text-xs">δ = 180 ppm (karbonil C)</p>
                      <p className="text-xs text-cyan-300">J(C-P) = 10 Hz</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-5">
                <h3 className="text-green-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> ν(CO) siljishi — oksidativ birikish indikatori
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Vaska kompleksi:</strong> ν(CO) = 1967 cm⁻¹</p>
                  <p>• <strong className="text-white">+ O₂:</strong> ν(CO) = 1950 cm⁻¹ (pasayadi)</p>
                  <p>• <strong className="text-white">+ H₂:</strong> ν(CO) = 2000 cm⁻¹ (oshadi)</p>
                  <p>• <strong className="text-white">+ CH₃I:</strong> ν(CO) = 2050 cm⁻¹ (oshadi)</p>
                  <p className="text-xs text-purple-400 mt-2">
                    <strong className="text-yellow-300">Sabab:</strong> Oksidativ birikishdan keyin Ir(III) kuchliroq Lewis kislotasi → 
                    π-backbonding kamayadi → C≡O bog' kuchayadi → ν(CO) oshadi.
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Katalitik qo'llanilish</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-amber-950/50 rounded-xl p-5 border border-amber-700/30">
                  <h3 className="text-amber-400 font-bold mb-3">⚗️ Kataliz asoslari</h3>
                  <div className="space-y-3 text-sm text-purple-200">
                    <div className="bg-amber-900/40 rounded-lg p-3 border border-amber-700/30">
                      <p className="text-amber-300 font-bold text-xs mb-1">Oksidativ birikish</p>
                      <p className="text-xs">Vaska kompleksi X₂ molekulalarini faollashtiradi</p>
                    </div>
                    <div className="bg-amber-900/40 rounded-lg p-3 border border-amber-700/30">
                      <p className="text-amber-300 font-bold text-xs mb-1">Qaytaruvchi eliminatsiya</p>
                      <p className="text-xs">Ir(III) → Ir(I), mahsulot ajralib chiqadi</p>
                    </div>
                    <div className="bg-amber-900/40 rounded-lg p-3 border border-amber-700/30">
                      <p className="text-amber-300 font-bold text-xs mb-1">Katalitik sikl</p>
                      <p className="text-xs">Vaska kompleksi qayta tiklanadi → sikl davom etadi</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-950/50 rounded-xl p-5 border border-orange-700/30">
                  <h3 className="text-orange-400 font-bold mb-3">🧪 Sanoat qo'llanilish</h3>
                  <div className="space-y-3 text-sm text-purple-200">
                    <div className="bg-orange-900/40 rounded-lg p-3 border border-orange-700/30">
                      <p className="text-orange-300 font-bold text-xs mb-1">Gidrogenlash</p>
                      <p className="text-xs">Alkenlarni alkanlarga aylantirish (H₂ qo'shish)</p>
                    </div>
                    <div className="bg-orange-900/40 rounded-lg p-3 border border-orange-700/30">
                      <p className="text-orange-300 font-bold text-xs mb-1">Karbonyllash</p>
                      <p className="text-xs">CO qo'shish reaktsiyalari</p>
                    </div>
                    <div className="bg-orange-900/40 rounded-lg p-3 border border-orange-700/30">
                      <p className="text-orange-300 font-bold text-xs mb-1">C−H aktivatsiya</p>
                      <p className="text-xs">Inert C−H bog'larini faollashtirish</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-5">
                <h3 className="text-amber-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Nega Vaska kompleksi muhim?
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Model kompleksi:</strong> oksidativ birikish mexanizmini o'rganish uchun</p>
                  <p>• <strong className="text-white">Katalizator dizayni:</strong> yangi katalizatorlar yaratish uchun asos</p>
                  <p>• <strong className="text-white">Sanoat qo'llanilish:</strong> gidrogenlash, karbonyllash, C−H aktivatsiya</p>
                  <p className="text-xs text-purple-400 mt-2">
                    <strong className="text-yellow-300">Qiziq fakt:</strong> Vaska kompleksi — bu 
                    <strong className="text-pink-300"> birinchi marta O₂ bilan qaytar reaksiyaga kirishgan</strong> organometallik birikma!
                  </p>
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
                  <h3 className="text-green-400 font-bold mb-3">1-usul: Klassik sintez (Vaska usuli, 1961)</h3>
                  <div className="bg-green-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-green-300 border border-green-700/30">
                    <p>IrCl₃·3H₂O + PPh₃ + CO → trans-[IrCl(CO)(PPh₃)₂]</p>
                    <p className="text-green-300 text-xs mt-2">2-metoksietanol, qaynatish, N₂ atmosferasi</p>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Mexanizm:</strong> Ir(III) → Ir(I) qaytarilishi, PPh₃ va CO koordinatsiyasi</p>
                    <p><strong className="text-white">Sharoit:</strong> 2-metoksietanol erituvchisi, qaynatish (120°C), N₂ atmosferasi</p>
                    <p><strong className="text-white">Vaqt:</strong> 2-3 soat</p>
                    <p><strong className="text-white">Hosildorlik:</strong> 70-80%</p>
                    <p><strong className="text-white">Tozalash:</strong> Qayta kristallizatsiya (benzol/etanol)</p>
                  </div>
                </div>

                <div className="bg-green-950/50 rounded-2xl p-5 border border-green-700/30">
                  <h3 className="text-green-400 font-bold mb-3">2-usul: Zamonaviy sintez (tezroq)</h3>
                  <div className="bg-green-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-green-300 border border-green-700/30">
                    <p>[Ir(COD)Cl]₂ + PPh₃ + CO → 2 trans-[IrCl(CO)(PPh₃)₂]</p>
                    <p className="text-green-300 text-xs mt-2">THF, xona harorati, CO gazi</p>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Afzalligi:</strong> Tezroq reaksiya, yuqori hosildorlik</p>
                    <p><strong className="text-white">Sharoit:</strong> THF erituvchisi, xona harorati, CO gazi</p>
                    <p><strong className="text-white">Vaqt:</strong> 30-60 daqiqa</p>
                    <p><strong className="text-white">Hosildorlik:</strong> 85-95%</p>
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Oksidativ birikish kashfiyoti (1961)</h2>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-2xl p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-yellow-600 to-amber-600 flex items-center justify-center text-6xl flex-shrink-0 shadow-2xl">
                    👨‍🔬
                  </div>
                  <div className="flex-1">
                    <h3 className="text-yellow-400 font-bold text-xl mb-2">Lauri Vaska (1925-2021)</h3>
                    <p className="text-purple-200 text-sm mb-3 leading-relaxed">
                      <strong className="text-yellow-300">1961 yilda</strong> Estoniyalik-Amerikalik kimyogar Lauri Vaska 
                      <strong className="text-white"> trans-[IrCl(CO)(PPh₃)₂]</strong> ni sintez qildi va uning 
                      <strong className="text-pink-300"> O₂, H₂ bilan qaytar reaksiyaga kirishishini</strong> kashf qildi.
                      Bu <strong className="text-white">oksidativ birikish</strong> mexanizmini tushuntirish uchun asos bo'ldi!
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-xs text-yellow-300 font-semibold">
                        📜 1961 yil
                      </span>
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-xs text-amber-300 font-semibold">
                        📍 Iowa State University
                      </span>
                      <span className="px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-xs text-orange-300 font-semibold">
                        ⚡ Oksidativ birikish
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { year: "1961", title: "Vaska kashfiyoti", desc: "Lauri Vaska trans-[IrCl(CO)(PPh₃)₂] ni sintez qildi va O₂ bilan reaksiyasini kuzatdi" },
                  { year: "1962", title: "H₂ bilan reaksiya", desc: "Vaska kompleksi H₂ bilan ham reaksiyaga kirishishi aniqlandi" },
                  { year: "1963", title: "Mexanizm tushunilishi", desc: "Oksidativ birikish mexanizmi to'liq tushuntirildi" },
                  { year: "1965+", title: "Katalitik qo'llanilish", desc: "Vaska kompleksi asosida yangi katalizatorlar yaratildi" },
                  { year: "1970+", title: "Sanoat qo'llanilish", desc: "Gidrogenlash, karbonyllash reaktsiyalarida ishlatildi" },
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
                  <span>💡</span> Nima uchun Vaska kompleksi organometallik kimyoda muhim?
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Birinchi qaytar oksidativ birikish:</strong> O₂ bilan reaksiyaga kirishib, qayta ajralib chiqadi</p>
                  <p>• <strong className="text-white">Mexanizm tushunilishi:</strong> oksidativ birikish va qaytaruvchi eliminatsiya mexanizmlari aniqlandi</p>
                  <p>• <strong className="text-white">Kataliz asosi:</strong> yangi katalizatorlar yaratish uchun model</p>
                  <p>• <strong className="text-white">Sanoat qo'llanilish:</strong> gidrogenlash, karbonyllash, C−H aktivatsiya</p>
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
              href="/ilmiy/birikmares/zeise-tuzi"
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold transition-all flex items-center gap-2"
            >
              <span>←</span>
              <span className="hidden sm:inline">Zeise tuzi</span>
            </Link>
            <Link 
              href="/ilmiy/birikmares/ferrosen"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold transition-all shadow-lg shadow-amber-500/30 flex items-center gap-2"
            >
              <span className="hidden sm:inline">Ferrosen</span>
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