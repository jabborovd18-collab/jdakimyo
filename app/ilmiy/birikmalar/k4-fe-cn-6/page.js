"use client"

import Link from "next/link"
import { useState } from "react"

export default function K4FeCN6() {
  const [activeTab, setActiveTab] = useState("overview")

  const tabs = [
    { id: "overview", label: "📋 Umumiy", icon: "📋" },
    { id: "structure", label: "🧬 Oktaedrik (Oₕ)", icon: "🧬" },
    { id: "electronic", label: "⚛️ 18 elektron (d⁶)", icon: "⚛️" },
    { id: "bonding", label: "🔗 Fe−C≡N bog'lanish", icon: "🔗" },
    { id: "spectroscopy", label: "🔬 Spektroskopiya", icon: "🔬" },
    { id: "prussianBlue", label: "🎨 Prussian Blue", icon: "🎨" },
    { id: "applications", label: "🏭 Qo'llanilish", icon: "🏭" },
    { id: "safety", label: "🛡️ Xavfsizlik", icon: "🛡️" },
    { id: "synthesis", label: "⚗️ Sintez", icon: "⚗️" },
    { id: "history", label: "🏆 Tarix", icon: "🏆" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white relative overflow-hidden">
      
      {/* ═══ ANIMATED BACKGROUND ═══ */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(234,179,8,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        {['Fe²⁺', 'd⁶', '18 e⁻', 'Oₕ', 'd²sp³', 'CN⁻', '2044 cm⁻¹', 'Prussian Blue', 'E536'].map((sym, i) => (
          <div
            key={i}
            className="absolute text-yellow-400/5 font-mono font-bold select-none pointer-events-none"
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
            <span className="text-yellow-400 font-semibold">K₄[Fe(CN)₆]</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-blue-500/20 border border-yellow-500/30 text-[10px] text-yellow-300 font-bold uppercase tracking-wider">
                  🎨 Prussian Blue ajdodi
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] text-emerald-300 font-semibold">
                  ⚛️ 18 elektron qoidasi
                </span>
                <span className="px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-[10px] text-blue-300 font-semibold">
                  🏭 Oziq-ovqat E536
                </span>
                <span className="px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-[10px] text-purple-300 font-semibold">
                  📜 1752 yildan beri
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-yellow-400 via-orange-400 to-blue-300 bg-clip-text text-transparent">
                K₄[Fe(CN)₆]
              </h1>
              <p className="text-purple-300 text-sm mt-1">
                Kaliy geksatsianoferrat(II) • Sariq qon tuzi • Potassium ferrocyanide
              </p>
            </div>
            
            <div className="flex gap-2">
              <Link 
                href="/ilmiy/birikmalar/k3-fe-cn-6"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 hover:border-red-400/60 text-red-300 text-sm font-semibold transition-all flex items-center gap-2"
              >
                <span>🔴</span>
                <span className="hidden sm:inline">K₃[Fe(CN)₆]</span>
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
            { label: "Formula", value: "K₄[Fe(CN)₆]", icon: "🧪", color: "text-yellow-400" },
            { label: "M massa", value: "368.35 g/mol", icon: "⚖️", color: "text-blue-400" },
            { label: "Geometriya", value: "Oktaedrik (Oₕ)", icon: "💎", color: "text-purple-400" },
            { label: "Kompleks rangi", value: "Sariq", icon: "🎨", color: "text-yellow-400" },
            { label: "Elektronlar", value: "d⁶ (18 e⁻)", icon: "⚛️", color: "text-emerald-400" },
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
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/30'
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
            <div className="bg-gradient-to-br from-purple-900/40 to-yellow-900/40 border border-yellow-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-xl shadow-lg shadow-yellow-500/30">
                  📋
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Asosiy ma'lumotlar</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  ["CAS raqami", "13943-58-3"],
                  ["Zichlik", "1.85 g/cm³"],
                  ["Suyuqlanish harorati", "69°C (trihidrat)"],
                  ["Qaynash harorati", "Parchalanadi (400°C)"],
                  ["Eruvchanlik (H₂O)", "28.9 g/100mL (20°C)"],
                  ["Eruvchanlik (EtOH)", "Erimaydi"],
                  ["Simmetriya", "Oₕ (oktaedrik)"],
                  ["Rangi", "Och sariq"],
                ].map((item, i) => (
                  <div key={i} className="bg-yellow-950/50 rounded-xl p-3 border border-yellow-700/30">
                    <div className="text-[10px] uppercase tracking-wider text-yellow-400 font-semibold mb-1">{item[0]}</div>
                    <div className="text-white font-semibold text-sm">{item[1]}</div>
                  </div>
                ))}
              </div>

              {/* ICHKI/TASHQI SFERA */}
              <div className="bg-gradient-to-r from-yellow-500/10 to-blue-500/10 border border-yellow-500/20 rounded-2xl p-5">
                <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                  <span>💎</span> Ichki va tashqi sfera
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-yellow-900/30 rounded-xl p-4 border border-yellow-700/30">
                    <h4 className="text-yellow-300 font-bold text-sm mb-2">🔒 Ichki sfera [Fe(CN)₆]⁴⁻</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">Fe²⁺</strong> — markaziy ion (d⁶)</li>
                      <li>• <strong className="text-white">6 × CN⁻</strong> — tsianid ligandlari (kuchli maydon)</li>
                      <li>• <strong className="text-white">6 × C</strong> — donor atomlar (C orqali bog'lanadi)</li>
                      <li>• <strong className="text-yellow-300">Zaryad:</strong> +2 + 6×(−1) = <strong>−4</strong></li>
                      <li>• <strong className="text-pink-300">18 elektron:</strong> 6 + 6×2 = 18 (Kr)</li>
                    </ul>
                  </div>
                  <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-700/30">
                    <h4 className="text-blue-300 font-bold text-sm mb-2">🔓 Tashqi sfera 4K⁺</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">4 × K⁺</strong> — counter-ionlar</li>
                      <li>• Ion bog'lar bilan bog'langan</li>
                      <li>• Suvda darhol dissotsilanadi</li>
                      <li>• <strong className="text-white">5 ion:</strong> [Fe(CN)₆]⁴⁻ + 4K⁺</li>
                      <li>• <strong className="text-white">Elektr o'tkazuvchanlik:</strong> 5-ionli elektrolit</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* XULOSA */}
            <div className="bg-gradient-to-r from-yellow-600/10 via-orange-600/10 to-blue-600/10 border border-yellow-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>✅</span> Asosiy xulosalar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "💎 <strong>Oktaedrik geometriya:</strong> Oₕ simmetriya, 6 ta ekvivalent CN⁻",
                  "⚛️ <strong>18 elektron:</strong> Fe²⁺ (d⁶) + 6×2 = 18 → juda barqaror",
                  "🔗 <strong>Sinergik bog'lanish:</strong> σ-donatsiya (C→Fe) + π-backbonding (Fe→C≡N)",
                  "🎨 <strong>Prussian Blue ajdodi:</strong> Fe³⁺ bilan → Fe₄[Fe(CN)₆]₃ (ko'k pigment)",
                  "🔬 <strong>FTIR:</strong> ν(CN) = 2044 cm⁻¹ (kuchli cho'qqi)",
                  "🛡️ <strong>Past toksiklik:</strong> CN⁻ mustahkam bog'langan (erkin CN⁻ ajralmaydi)",
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
            <div className="bg-gradient-to-br from-purple-900/40 to-yellow-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-yellow-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  💎
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Oktaedrik geometriya (Oₕ)</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-purple-400 font-bold text-sm uppercase tracking-wider">Geometrik parametrlar</h3>
                  <div className="space-y-2">
                    {[
                      ["Geometriya", "Oktaedrik"],
                      ["Nuqtali guruh", "Oₕ"],
                      ["Koordinatsion son", "6"],
                      ["Fe−C masofa", "1.92 Å (6 ta, ekvivalent)"],
                      ["C≡N masofa", "1.14 Å (uch bog')"],
                      ["C−Fe−C burchak", "90° (cis) / 180° (trans)"],
                      ["Dipol moment", "0 D (simmetrik)"],
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-purple-800/30">
                        <span className="text-purple-300 text-sm">{item[0]}</span>
                        <span className="text-white font-semibold text-sm font-mono">{item[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-yellow-400 font-bold text-sm uppercase tracking-wider">Oₕ simmetriya elementlari</h3>
                  <div className="space-y-2">
                    {[
                      ["E", "Ayniylik"],
                      ["8C₃", "4 ta C₃ o'qi (kub diagonallari)"],
                      ["3C₄", "3 ta C₄ o'qi (x, y, z)"],
                      ["6C₂", "6 ta C₂ o'qi (qirralar orqali)"],
                      ["i", "Inversiya markazi (Fe da)"],
                      ["3σₕ", "Gorizontal tekisliklar"],
                      ["6σₐ", "Diagonal tekisliklar"],
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-1.5 border-b border-yellow-800/30">
                        <span className="text-yellow-300 text-sm font-mono font-bold">{item[0]}</span>
                        <span className="text-purple-200 text-xs">{item[1]}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-yellow-950/50 rounded-xl p-3 border border-yellow-700/30 mt-3">
                    <p className="text-yellow-200 text-xs">
                      <strong className="text-yellow-400">Jami:</strong> 48 ta simmetriya operatsiyasi — <strong>eng yuqori simmetriya!</strong>
                      <strong className="text-white"> Barcha 6 ta CN⁻ ekvivalent</strong> — FTIR da bitta ν(CN) cho'qqisi.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3D STRUKTURA */}
            <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 border border-amber-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-xl shadow-lg shadow-amber-500/30">
                  🎯
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Fe−C≡N zanjir strukturasi</h2>
              </div>
              
              <div className="bg-amber-950/60 rounded-xl p-5 font-mono text-sm text-amber-200 border border-amber-700/30 mb-6 text-center">
                <pre className="whitespace-pre">{`            CN
            |
     NC — Fe — CN
          /   \\
        CN     CN
            |
            CN

   Oktaedrik: Fe²⁺ markazda, 6 ta CN⁻ uchlarida
   Fe−C≡N zanjir — chiziqli (180° Fe−C−N burchak)
   
   Barcha 6 ta Fe−C bog' ekvivalent (1.92 Å)
   Barcha 6 ta C≡N bog' ekvivalent (1.14 Å)`}</pre>
              </div>

              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-5">
                <h3 className="text-amber-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Fe−C−N burchak = 180°
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">CN⁻ ligandi chiziqli</strong> — Fe−C−N burchak 180°</p>
                  <p>• <strong className="text-yellow-300">Sabab:</strong> C atomi sp-gibridlangan (2 ta σ-bog' + 2 ta π-bog')</p>
                  <p>• <strong className="text-white">Natija:</strong> Fe−C≡N zanjir to'g'ri chiziq hosil qiladi</p>
                  <p>• <strong className="text-white">Uzunlik:</strong> Fe−C (1.92 Å) + C≡N (1.14 Å) = 3.06 Å</p>
                  <p className="text-xs text-purple-400 mt-2">
                    Bu chiziqli struktura <strong className="text-pink-300">π-backbonding</strong>ni maksimal darajada oshiradi — 
                    Fe ning d-elektronlari C≡N ning π* orbitallariga samarali donatsiya qiladi.
                  </p>
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
                <h2 className="text-xl md:text-2xl font-bold text-white">18 elektron qoidasi</h2>
              </div>
              
              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-emerald-400">[Fe(CN)₆]⁴⁻</strong> — bu 
                  <strong className="text-white"> 18 elektron qoidasining</strong> klassik namunasi.
                  Fe²⁺ (d⁶) va 6 ta CN⁻ (har biri 2 e⁻) — jami <strong className="text-yellow-300">18 ta elektron</strong> — 
                  inert gaz (Kr) konfiguratsiyasi. Bu kompleksni <strong className="text-white">juda barqaror</strong> qiladi.
                </p>
              </div>

              {/* ELEKTRON HISOB */}
              <div className="bg-emerald-950/50 rounded-2xl p-6 border border-emerald-700/30 mb-6">
                <h3 className="text-emerald-400 font-bold mb-4">[Fe(CN)₆]⁴⁻ uchun elektron hisobi</h3>
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
                      <div className="text-white font-bold">6 × CN⁻</div>
                      <div className="text-purple-300 text-xs mt-1">
                        Har bir CN⁻ 2 ta elektron beradi (σ-donor)
                      </div>
                    </div>
                    <div className="text-emerald-300 text-2xl font-bold font-mono">6 × 2 = 12 e⁻</div>
                  </div>
                  <div className="bg-yellow-900/40 rounded-xl p-4 border-2 border-yellow-500/30 flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold text-lg">JAMI</div>
                      <div className="text-yellow-300 text-xs mt-1">
                        18 elektron qoidasi bajarildi ✓ (Kr konfiguratsiyasi)
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
                  <div className="text-amber-400 text-xs uppercase mb-1">Fe²⁺ ioni</div>
                  <div className="text-white font-mono font-bold">[Ar] 3d⁶</div>
                  <div className="text-purple-300 text-xs mt-1">6 ta d-elektron</div>
                </div>
                <div className="bg-emerald-950/50 rounded-xl p-5 border border-emerald-700/30 text-center">
                  <div className="text-4xl mb-2">🟢</div>
                  <div className="text-emerald-400 text-xs uppercase mb-1">Kompleksda</div>
                  <div className="text-white font-mono font-bold">t₂g⁶ e₉⁰</div>
                  <div className="text-green-400 text-xs mt-1">Quyi spinli (LS)</div>
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
              
              <div className="bg-violet-950/50 rounded-2xl p-5 border border-violet-700/30 mb-6">
                <div className="bg-violet-900/60 rounded-xl p-4 font-mono text-sm text-violet-200 border border-violet-700/30 mb-4">
                  <p>KMBE = 6 × (−0.4Δₒ) + 0 × (+0.6Δₒ)</p>
                  <p className="text-white font-bold text-lg mt-2">KMBE = −2.4Δₒ</p>
                  <p className="text-violet-300 text-xs mt-1">Δₒ ≈ 33,000 cm⁻¹ (kuchli maydon)</p>
                  <p className="text-white font-bold mt-2">≈ −950 kJ/mol</p>
                </div>
                <p className="text-purple-300 text-xs">
                  <strong className="text-yellow-300">CN⁻ — eng kuchli maydon ligandi</strong> 
                  (spektrokimyoviy qatorda eng yuqori). Shuning uchun Δₒ juda katta (33,000 cm⁻¹), 
                  bu esa <strong className="text-white">maksimal KMBE</strong> beradi va kompleksni 
                  <strong className="text-green-400"> juda barqaror</strong> qiladi.
                </p>
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Fe−C≡N bog'lanish mexanizmi (sinergik)</h2>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-purple-400">CN⁻ ligandi</strong> — <strong className="text-white">sinergik bog'lanish</strong>ning 
                  eng kuchli namunasi. U ikki yo'nalishda ishlaydi:
                  <strong className="text-yellow-300"> σ-donatsiya</strong> (C → Fe) va 
                  <strong className="text-pink-300"> π-backbonding</strong> (Fe → C≡N).
                  [Fe(CN)₆]⁴⁻ da <strong className="text-white">π-backbonding juda kuchli</strong> — chunki CN⁻ 
                  <strong className="text-pink-300"> kuchli π-akseptor</strong>.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
                  <h3 className="text-purple-400 font-bold mb-3">1️⃣ σ-donatsiya (C → Fe)</h3>
                  <div className="bg-purple-900/40 rounded-lg p-4 font-mono text-xs text-purple-200 border border-purple-700/30 mb-3">
                    <pre className="whitespace-pre">{`  :C≡N:⁻ → Fe²⁺
  (lone pair)
  
  C ning sp orbitali
  Fe ning bo'sh d²sp³ orbitaliga
  elektron juftini beradi`}</pre>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">C ning 5σ orbitali</strong> — C atomida joylashgan</p>
                    <p>• <strong className="text-white">Fe ning d²sp³</strong> gibrid orbitaliga donatsiya</p>
                    <p>• Natija: <strong className="text-purple-300">Fe−C σ-bog'</strong> hosil bo'ladi</p>
                  </div>
                </div>

                <div className="bg-pink-950/50 rounded-xl p-5 border border-pink-700/30">
                  <h3 className="text-pink-400 font-bold mb-3">2️⃣ π-backbonding (Fe → C≡N)</h3>
                  <div className="bg-pink-900/40 rounded-lg p-4 font-mono text-xs text-pink-200 border border-pink-700/30 mb-3">
                    <pre className="whitespace-pre">{`  Fe²⁺ → C≡N
  (d-elektron)
  
  Fe ning to'lgan t₂g orbitali
  C≡N ning bo'sh 2π* orbitaliga
  elektron qaytaradi`}</pre>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Fe ning to'lgan t₂g orbitallari</strong> (6 e⁻)</p>
                    <p>• <strong className="text-white">C≡N ning 2π* orbitaliga</strong> (LUMO) donatsiya</p>
                    <p>• Natija: <strong className="text-pink-300">Fe−C π-bog'</strong> + C≡N kuchsizlanadi</p>
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
                  <p>• <strong className="text-yellow-300">Natija:</strong> Fe−C bog' <strong>kuchayadi</strong>, C≡N bog' <strong>kuchsizlanadi</strong></p>
                  <p>• <strong className="text-white">Erkin CN⁻:</strong> ν(CN) = 2080 cm⁻¹</p>
                  <p>• <strong className="text-white">[Fe(CN)₆]⁴⁻ da:</strong> ν(CN) = <strong className="text-pink-300">2044 cm⁻¹</strong> (36 cm⁻¹ ga pasaygan!)</p>
                  <p>• <strong className="text-white">[Fe(CN)₆]³⁻ da:</strong> ν(CN) = <strong className="text-red-300">2135 cm⁻¹</strong> (Fe³⁺ kamroq π-donor)</p>
                  <p className="text-xs text-purple-400 mt-2">
                    Bu farq <strong className="text-white">oksidlanish darajasi</strong>ga bog'liq — Fe²⁺ kuchliroq π-donor, 
                    shuning uchun ν(CN) pastroq.
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
                <h2 className="text-xl md:text-2xl font-bold text-white">FTIR spektroskopiya</h2>
              </div>
              
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
                    <tr className="border-b border-purple-800/30 bg-yellow-900/20">
                      <td className="py-3 px-4 font-mono font-bold text-yellow-300">2044</td>
                      <td className="py-3 px-4">ν(C≡N) — stretching</td>
                      <td className="py-3 px-4">Juda kuchli</td>
                      <td className="py-3 px-4 text-xs">6 ta ekvivalent CN (bitta cho'qqi!)</td>
                    </tr>
                    <tr className="border-b border-purple-800/30">
                      <td className="py-3 px-4 font-mono">594</td>
                      <td className="py-3 px-4">ν(Fe−C)</td>
                      <td className="py-3 px-4">Kuchli</td>
                      <td className="py-3 px-4 text-xs">Metall-uglerod bog'i</td>
                    </tr>
                    <tr className="border-b border-purple-800/30">
                      <td className="py-3 px-4 font-mono">436</td>
                      <td className="py-3 px-4">δ(Fe−C−N)</td>
                      <td className="py-3 px-4">O'rta</td>
                      <td className="py-3 px-4 text-xs">Egilish tebranishi</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono">2080</td>
                      <td className="py-3 px-4">ν(CN) — erkin CN⁻</td>
                      <td className="py-3 px-4">Kuchli</td>
                      <td className="py-3 px-4 text-xs text-purple-400">Taqqoslash uchun</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-5">
                <h3 className="text-green-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> ν(CN) pasayishi — π-backbonding isboti
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Erkin CN⁻:</strong> ν(CN) = 2080 cm⁻¹</p>
                  <p>• <strong className="text-white">[Fe(CN)₆]⁴⁻:</strong> ν(CN) = 2044 cm⁻¹ <span className="text-pink-300">(36 cm⁻¹ ga pasaygan)</span></p>
                  <p>• <strong className="text-white">[Fe(CN)₆]³⁻:</strong> ν(CN) = 2135 cm⁻¹ <span className="text-red-300">(55 cm⁻¹ ga oshgan!)</span></p>
                  <p className="text-xs text-purple-400 mt-2">
                    <strong className="text-yellow-300">Sabab:</strong> Fe²⁺ (d⁶) kuchliroq π-donor (ko'proq d-elektron), 
                    shuning uchun ν(CN) pastroq. Fe³⁺ (d⁵) kamroq π-donor → ν(CN) yuqoriroq.
                    Bu farq <strong className="text-white">oksidlanish darajasi</strong>ni aniqlash uchun ishlatiladi!
                  </p>
                </div>
              </div>
            </div>

            {/* UV-VIS */}
            <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">
                  🌈
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">UV-Vis spektroskopiya</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-950/50 rounded-xl p-5 border border-blue-700/30">
                  <h3 className="text-blue-400 font-bold mb-3">[Fe(CN)₆]⁴⁻ (sariq)</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">λ<sub>max</sub>:</strong> 305 nm (LMCT)</p>
                    <p>• <strong className="text-white">d-d o'tishlar:</strong> 220 nm da (kuchsiz)</p>
                    <p>• <strong className="text-white">Rang:</strong> och sariq (UB-sohada yutiladi)</p>
                    <p className="text-xs text-purple-400 mt-2">
                      <strong className="text-yellow-300">Sabab:</strong> Katta Δₒ (33,000 cm⁻¹) → 
                      d-d o'tishlar UB-sohada → ko'rinadigan sohada yutilish yo'q → rangsiz/sariq.
                    </p>
                  </div>
                </div>

                <div className="bg-indigo-950/50 rounded-xl p-5 border border-indigo-700/30">
                  <h3 className="text-indigo-400 font-bold mb-3">[Fe(CN)₆]³⁻ (qizil)</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">λ<sub>max</sub>:</strong> 420 nm (LMCT)</p>
                    <p>• <strong className="text-white">d-d o'tishlar:</strong> 320 nm da</p>
                    <p>• <strong className="text-white">Rang:</strong> qizil (ko'k-yashil yutiladi)</p>
                    <p className="text-xs text-purple-400 mt-2">
                      <strong className="text-yellow-300">Sabab:</strong> Fe³⁺ kuchliroq Lewis kislotasi → 
                      LMCT (ligand → metall) ko'rinadigan sohaga siljiydi.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* PRUSSIAN BLUE TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "prussianBlue" && (
          <>
            <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border-2 border-blue-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">
                  🎨
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Prussian Blue — birinchi sintetik pigment</h2>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-blue-400">Prussian Blue</strong> (Berlin ko'ki) — bu 
                  <strong className="text-white"> birinchi sintetik pigment</strong> (1704 yil).
                  U <strong className="text-yellow-300">[Fe(CN)₆]⁴⁻</strong> va <strong className="text-red-300">Fe³⁺</strong> 
                  reaktsiyasidan hosil bo'ladi. Bu reaksiya bugungi kunda ham 
                  <strong className="text-white"> Fe³⁺ ni aniqlash</strong> uchun ishlatiladi.
                </p>
              </div>

              {/* REAKTSIYA */}
              <div className="bg-blue-950/50 rounded-2xl p-5 border border-blue-700/30 mb-6">
                <h3 className="text-blue-400 font-bold mb-3">Reaktsiya</h3>
                <div className="bg-blue-900/60 rounded-xl p-4 font-mono text-sm text-blue-200 border border-blue-700/30 text-center">
                  <p>4 Fe³⁺ + 3 [Fe(CN)₆]⁴⁻ → <strong className="text-blue-300">Fe₄[Fe(CN)₆]₃↓</strong></p>
                  <p className="text-blue-300 text-xs mt-2">Prussian Blue (to'q ko'k cho'kma)</p>
                </div>
              </div>

              {/* STRUKTURA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-950/50 rounded-xl p-5 border border-blue-700/30">
                  <h3 className="text-blue-400 font-bold mb-3">🧬 Struktura</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Kubik panjara:</strong> Fe²⁺ va Fe³⁺ navbatma-navbat</p>
                    <p>• <strong className="text-white">Ko'prikli CN⁻:</strong> Fe²⁺−C≡N−Fe³⁺</p>
                    <p>• <strong className="text-white">Koordinatsion son:</strong> 6 (har bir Fe uchun)</p>
                    <p>• <strong className="text-white">Rang sababi:</strong> IVCT (intervalence charge transfer)</p>
                  </div>
                </div>

                <div className="bg-indigo-950/50 rounded-xl p-5 border border-indigo-700/30">
                  <h3 className="text-indigo-400 font-bold mb-3">🎨 Rang mexanizmi</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">IVCT:</strong> Fe²⁺ → Fe³⁺ elektron uzatish</p>
                    <p>• <strong className="text-white">λ<sub>max</sub>:</strong> ~680 nm (qizil yutiladi)</p>
                    <p>• <strong className="text-white">Natija:</strong> ko'k rang ko'rinadi</p>
                    <p>• <strong className="text-white">Intensivlik:</strong> ε ≈ 1000 L·mol⁻¹·cm⁻¹</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-2xl p-5">
                <h3 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Qo'llanilishi
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Analitik kimyo:</strong> Fe³⁺ ni sifat aniqlash (ko'k cho'kma)</p>
                  <p>• <strong className="text-white">Pigment:</strong> bo'yoqlar, siyoh, rangli qog'oz</p>
                  <p>• <strong className="text-white">Tibbiyot:</strong> Tl va Cs zaharlanishini davolash (Radiogardase)</p>
                  <p>• <strong className="text-white">Elektroxromizm:</strong> smart oynalar, displyelar</p>
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
            <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border border-yellow-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-xl shadow-lg shadow-yellow-500/30">
                  🏭
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Sanoat va ilmiy qo'llanilish</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-yellow-950/50 rounded-xl p-5 border border-yellow-700/30">
                  <h3 className="text-yellow-400 font-bold mb-3">🧪 Analitik kimyo</h3>
                  <div className="space-y-3 text-sm text-purple-200">
                    <div className="bg-yellow-900/40 rounded-lg p-3 border border-yellow-700/30">
                      <p className="text-yellow-300 font-bold text-xs mb-1">Fe³⁺ aniqlash</p>
                      <p className="text-xs">+ Fe³⁺ → Prussian Blue (ko'k cho'kma) — sifat tahlili</p>
                    </div>
                    <div className="bg-yellow-900/40 rounded-lg p-3 border border-yellow-700/30">
                      <p className="text-yellow-300 font-bold text-xs mb-1">Cu²⁺ aniqlash</p>
                      <p className="text-xs">+ Cu²⁺ → Cu₂[Fe(CN)₆] (qizil-jigarrang cho'kma)</p>
                    </div>
                    <div className="bg-yellow-900/40 rounded-lg p-3 border border-yellow-700/30">
                      <p className="text-yellow-300 font-bold text-xs mb-1">Zn²⁺ aniqlash</p>
                      <p className="text-xs">+ Zn²⁺ → K₂Zn₃[Fe(CN)₆]₂ (oq cho'kma)</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-950/50 rounded-xl p-5 border border-orange-700/30">
                  <h3 className="text-orange-400 font-bold mb-3">🍞 Oziq-ovqat sanoati</h3>
                  <div className="space-y-3 text-sm text-purple-200">
                    <div className="bg-orange-900/40 rounded-lg p-3 border border-orange-700/30">
                      <p className="text-orange-300 font-bold text-xs mb-1">E536 — anti-caking agent</p>
                      <p className="text-xs">Tuzda, shakar kukunida — yopishmaslik uchun</p>
                    </div>
                    <div className="bg-orange-900/40 rounded-lg p-3 border border-orange-700/30">
                      <p className="text-orange-300 font-bold text-xs mb-1">Dozasi</p>
                      <p className="text-xs">Maksimal 20 mg/kg (juda past, xavfsiz)</p>
                    </div>
                    <div className="bg-orange-900/40 rounded-lg p-3 border border-orange-700/30">
                      <p className="text-orange-300 font-bold text-xs mb-1">Xavfsizlik</p>
                      <p className="text-xs">CN⁻ mustahkam bog'langan → erkin CN⁻ ajralmaydi</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-yellow-900/40 rounded-lg p-3 border border-yellow-700/30">
                  <p className="text-yellow-300 font-bold text-xs mb-1">🏭 Metallurgiya</p>
                  <p className="text-xs text-purple-200">Au va Ag ekstraksiyasi (sianidlash jarayoni)</p>
                </div>
                <div className="bg-yellow-900/40 rounded-lg p-3 border border-yellow-700/30">
                  <p className="text-yellow-300 font-bold text-xs mb-1">🎨 Pigmentlar</p>
                  <p className="text-xs text-purple-200">Prussian Blue, Turner's Blue</p>
                </div>
                <div className="bg-yellow-900/40 rounded-lg p-3 border border-yellow-700/30">
                  <p className="text-yellow-300 font-bold text-xs mb-1">💊 Tibbiyot</p>
                  <p className="text-xs text-purple-200">Radiogardase (Tl/Cs detoksikatsiyasi)</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* SAFETY TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "safety" && (
          <>
            <div className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border border-emerald-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-xl shadow-lg shadow-emerald-500/30">
                  🛡️
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Xavfsizlik — past toksiklik</h2>
              </div>
              
              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-emerald-400">[Fe(CN)₆]⁴⁻</strong> — bu 
                  <strong className="text-white"> paradoksal birikma</strong>: tarkibida 6 ta zaharli CN⁻ bo'lsa ham,
                  kompleks <strong className="text-yellow-300">juda past toksiklikka</strong> ega.
                  Sababi: <strong className="text-white">CN⁻ ionlari Fe²⁺ bilan shunchalik mustahkam bog'langanki</strong>,
                  ular fiziologik sharoitda <strong className="text-emerald-300">ajralib chiqmaydi</strong>.
                </p>
              </div>

              {/* TAQQOSLASH */}
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead className="bg-purple-950/60">
                    <tr>
                      <th className="py-3 px-4 text-purple-300 text-left">Birikma</th>
                      <th className="py-3 px-4 text-purple-300 text-left">LD₅₀ (kalamush)</th>
                      <th className="py-3 px-4 text-purple-300 text-left">Toksiklik</th>
                      <th className="py-3 px-4 text-purple-300 text-left">CN⁻ ajralishi</th>
                    </tr>
                  </thead>
                  <tbody className="text-purple-200">
                    <tr className="border-b border-purple-800/30 bg-red-900/20">
                      <td className="py-3 px-4 font-bold">NaCN (natriy sianid)</td>
                      <td className="py-3 px-4 font-mono text-red-300 font-bold">6.4 mg/kg</td>
                      <td className="py-3 px-4 text-red-300 font-bold">☠️ Juda zaharli</td>
                      <td className="py-3 px-4">100% (darhol)</td>
                    </tr>
                    <tr className="border-b border-purple-800/30 bg-yellow-900/20">
                      <td className="py-3 px-4 font-bold">K₃[Fe(CN)₆]</td>
                      <td className="py-3 px-4 font-mono text-yellow-300">1600 mg/kg</td>
                      <td className="py-3 px-4 text-yellow-300">⚠️ Kam zaharli</td>
                      <td className="py-3 px-4">Juda kam</td>
                    </tr>
                    <tr className="border-b border-purple-800/30 bg-emerald-900/20">
                      <td className="py-3 px-4 font-bold text-emerald-300">K₄[Fe(CN)₆] ← Siz</td>
                      <td className="py-3 px-4 font-mono text-emerald-300 font-bold">1600-3200 mg/kg</td>
                      <td className="py-3 px-4 text-emerald-300 font-bold">✓ Deyarli xavfsiz</td>
                      <td className="py-3 px-4">Ajralmaydi</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold">NaCl (osh tuzi)</td>
                      <td className="py-3 px-4 font-mono">3000 mg/kg</td>
                      <td className="py-3 px-4">✓ Xavfsiz</td>
                      <td className="py-3 px-4">—</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-950/50 rounded-xl p-5 border border-emerald-700/30">
                  <h3 className="text-emerald-400 font-bold mb-3">✅ Nega xavfsiz?</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">log β₆ ≈ 35</strong> — juda yuqori barqarorlik</p>
                    <p>• <strong className="text-white">K dissotsiatsiya ≈ 10⁻³⁵</strong> — amalda dissotsilanmaydi</p>
                    <p>• <strong className="text-white">pH 1-14 da:</strong> CN⁻ ajralmaydi</p>
                    <p>• <strong className="text-white">Faqat UV + kuchli kislota:</strong> parchalanadi</p>
                  </div>
                </div>

                <div className="bg-red-950/50 rounded-xl p-5 border border-red-700/30">
                  <h3 className="text-red-400 font-bold mb-3">⚠️ Qachon xavfli?</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Kuchli kislota + qizdirish:</strong> HCN ajraladi</p>
                    <p>• <strong className="text-white">UV yorug'lik:</strong> [Fe(CN)₅(H₂O)]³⁻ hosil bo'ladi</p>
                    <p>• <strong className="text-white">400°C+:</strong> KCN + Fe₃C + N₂ (parchalanish)</p>
                    <p className="text-xs text-red-300 mt-2">
                      Shuning uchun <strong className="text-white">qorong'i, quruq joyda</strong> saqlash kerak.
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
                    <p>FeCl₂ + 6 NaCN → Na₄[Fe(CN)₆] + 2 NaCl</p>
                    <p className="mt-2">Na₄[Fe(CN)₆] + 4 KCl → K₄[Fe(CN)₆] + 4 NaCl</p>
                    <p className="text-green-300 text-xs mt-2">60-80°C, suvli eritma, metatez</p>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Mexanizm:</strong> Fe²⁺ + 6CN⁻ → [Fe(CN)₆]⁴⁻ (tez, ekzotermik)</p>
                    <p><strong className="text-white">Hosildorlik:</strong> 85-95%</p>
                    <p><strong className="text-white">Tozalash:</strong> Qayta kristallizatsiya (suvdan)</p>
                  </div>
                </div>

                <div className="bg-green-950/50 rounded-2xl p-5 border border-green-700/30">
                  <h3 className="text-green-400 font-bold mb-3">2-usul: Tarixiy (hayvon qonidan)</h3>
                  <div className="bg-green-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-green-300 border border-green-700/30">
                    <p>Qon + K₂CO₃ + Fe (qizdirish) → K₄[Fe(CN)₆]</p>
                    <p className="text-green-300 text-xs mt-2">800-1000°C, 1752 yilgacha ishlatilgan</p>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Tarix:</strong> Macquer (1752) birinchi marta ajratib oldi</p>
                    <p><strong className="text-white">Nom:</strong> "Sariq qon tuzi" — qondan olingani uchun</p>
                    <p><strong className="text-white">Bugun:</strong> Ishlatilmaydi (sanoat usuli samaraliroq)</p>
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
                <h2 className="text-xl md:text-2xl font-bold text-white">300 yillik tarix</h2>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-2xl p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-yellow-600 to-amber-600 flex items-center justify-center text-6xl flex-shrink-0 shadow-2xl">
                    🎨
                  </div>
                  <div className="flex-1">
                    <h3 className="text-yellow-400 font-bold text-xl mb-2">Prussian Blue → Sariq qon tuzi</h3>
                    <p className="text-purple-200 text-sm mb-3 leading-relaxed">
                      <strong className="text-yellow-300">1704 yilda</strong> Berlinlik bo'yoqchi Diesbach 
                      <strong className="text-white"> tasodifan Prussian Blue</strong> ni sintez qildi.
                      <strong className="text-yellow-300"> 1752 yilda</strong> frantsuz kimyogari Pierre Macquer 
                      Prussian Blue dan <strong className="text-white">K₄[Fe(CN)₆]</strong> ni ajratib oldi va 
                      uni <strong className="text-yellow-300">"sariq qon tuzi"</strong> deb atadi 
                      (chunki hayvon qonidan olingan edi).
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-xs text-yellow-300 font-semibold">
                        📜 1704 yil
                      </span>
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-xs text-amber-300 font-semibold">
                        📍 Berlin
                      </span>
                      <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-xs text-blue-300 font-semibold">
                        🎨 Birinchi sintetik pigment
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { year: "1704", title: "Prussian Blue kashfiyoti", desc: "Diesbach tasodifan Fe(CN)₆³⁻ va Fe³⁺ reaktsiyasidan ko'k pigment oldi" },
                  { year: "1752", title: "Macquer tahlili", desc: "Pierre Macquer Prussian Blue dan K₄[Fe(CN)₆] ni ajratib oldi" },
                  { year: "1782", title: "Formulani aniqlash", desc: "K₄[Fe(CN)₆] formulasi aniqlandi — Fe²⁺ va 6 ta CN⁻" },
                  { year: "1820+", title: "Sanoat sintezi", desc: "FeCl₂ + NaCN → Na₄[Fe(CN)₆] — arzon va samarali" },
                  { year: "1936", title: "Strukturani aniqlash", desc: "Keggin va Llewellyn rentgen difraksiyasi bilan Oₕ simmetriyani isbotladi" },
                  { year: "Bugun", title: "Keng qo'llanilish", desc: "E536 (oziq-ovqat), analitik kimyo, pigment, tibbiyot" },
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
              href="/ilmiy/birikmares/ni-co-4"
              onClick={(e) => { e.preventDefault(); window.history.back(); }}
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold transition-all flex items-center gap-2"
            >
              <span>←</span>
              <span className="hidden sm:inline">[Ni(CO)₄]</span>
            </Link>
            <Link 
              href="/ilmiy/birikmares/k3-fe-cn-6"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-white font-bold transition-all shadow-lg shadow-red-500/30 flex items-center gap-2"
            >
              <span className="hidden sm:inline">K₃[Fe(CN)₆] (Qizil qon tuzi)</span>
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