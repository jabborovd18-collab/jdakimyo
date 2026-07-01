"use client"

import Link from "next/link"
import { useState } from "react"

export default function Ferrosen() {
  const [activeTab, setActiveTab] = useState("overview")

  const tabs = [
    { id: "overview", label: "📋 Umumiy", icon: "📋" },
    { id: "structure", label: "🥪 Sendvich strukturasi", icon: "🥪" },
    { id: "electronic", label: "⚛️ 18 elektron", icon: "⚛️" },
    { id: "bonding", label: "🔗 η⁵-bog'lanish", icon: "🔗" },
    { id: "aromaticity", label: "🌀 Aromatiklik", icon: "🌀" },
    { id: "spectroscopy", label: "🔬 Spektroskopiya", icon: "🔬" },
    { id: "applications", label: "🏭 Qo'llanilish", icon: "🏭" },
    { id: "synthesis", label: "⚗️ Sintez", icon: "⚗️" },
    { id: "history", label: "🏆 Nobel 1973", icon: "🏆" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white relative overflow-hidden">
      
      {/* ═══ ANIMATED BACKGROUND ═══ */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-yellow-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(245,158,11,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        {['Fe²⁺', 'd⁶', '18 e⁻', 'η⁵', 'D₅ₕ', 'C₅H₅⁻', 'sendvich', 'Nobel 1973', 'aromatik'].map((sym, i) => (
          <div
            key={i}
            className="absolute text-orange-400/5 font-mono font-bold select-none pointer-events-none"
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
            <span className="text-orange-400 font-semibold">[Fe(C₅H₅)₂]</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 text-[10px] text-orange-300 font-bold uppercase tracking-wider">
                  🥪 Birinchi sendvich birikma
                </span>
                <span className="px-2.5 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-[10px] text-yellow-300 font-semibold">
                  🏆 Nobel 1973
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] text-emerald-300 font-semibold">
                  ⚛️ 18 elektron qoidasi
                </span>
                <span className="px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-[10px] text-purple-300 font-semibold">
                  🌀 Aromatik
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-300 bg-clip-text text-transparent">
                [Fe(C₅H₅)₂]
              </h1>
              <p className="text-purple-300 text-sm mt-1">
                Ferrosen • Bis(η⁵-siklopentadienil)temir(II) • Ferrocene
              </p>
            </div>
            
            <div className="flex gap-2">
              <Link 
                href="/ilmiy/birikmalar/fe-co-5"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 hover:border-amber-400/60 text-amber-300 text-sm font-semibold transition-all flex items-center gap-2"
              >
                <span>🟡</span>
                <span className="hidden sm:inline">[Fe(CO)₅]</span>
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
            { label: "Formula", value: "[Fe(η⁵-C₅H₅)₂]", icon: "🧪", color: "text-orange-400" },
            { label: "M massa", value: "186.04 g/mol", icon: "⚖️", color: "text-blue-400" },
            { label: "Geometriya", value: "Sendvich (D₅ₕ)", icon: "🥪", color: "text-purple-400" },
            { label: "Rangi", value: "To'q sariq", icon: "🎨", color: "text-orange-400" },
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
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30'
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
            <div className="bg-gradient-to-br from-purple-900/40 to-orange-900/40 border border-orange-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-xl shadow-lg shadow-orange-500/30">
                  📋
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Asosiy ma'lumotlar</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  ["CAS raqami", "102-54-5"],
                  ["Zichlik", "1.497 g/cm³"],
                  ["Suyuqlanish harorati", "172.5°C"],
                  ["Qaynash harorati", "249°C"],
                  ["Eruvchanlik (H₂O)", "Erimaydi"],
                  ["Eruvchanlik (organik)", "Yaxshi (benzol, efir)"],
                  ["Simmetriya", "D₅ₕ (ekliptik)"],
                  ["Rangi", "To'q sariq kristall"],
                ].map((item, i) => (
                  <div key={i} className="bg-orange-950/50 rounded-xl p-3 border border-orange-700/30">
                    <div className="text-[10px] uppercase tracking-wider text-orange-400 font-semibold mb-1">{item[0]}</div>
                    <div className="text-white font-semibold text-sm">{item[1]}</div>
                  </div>
                ))}
              </div>

              {/* SENDVICH STRUKTURA */}
              <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-2xl p-5">
                <h3 className="text-orange-400 font-bold mb-3 flex items-center gap-2">
                  <span>🥪</span> Sendvich strukturasi — inqilobiy kashfiyot
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-orange-900/30 rounded-xl p-4 border border-orange-700/30">
                    <h4 className="text-orange-300 font-bold text-sm mb-2">🎯 Nima uchun "sendvich"?</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">Fe²⁺</strong> — markaziy ion (ikki "non" orasida)</li>
                      <li>• <strong className="text-white">2 × C₅H₅⁻</strong> — siklopentadienil halqalar</li>
                      <li>• <strong className="text-white">η⁵-bog'lanish:</strong> barcha 5 ta C atomi Fe bilan bog'langan</li>
                      <li>• <strong className="text-yellow-300">Parallel halqalar:</strong> 3.32 Å masofada</li>
                      <li>• <strong className="text-pink-300">Aromatik:</strong> har bir halqa 6π elektron</li>
                    </ul>
                  </div>
                  <div className="bg-amber-900/30 rounded-xl p-4 border border-amber-700/30">
                    <h4 className="text-amber-300 font-bold text-sm mb-2">⚛️ Elektron tuzilishi</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">Fe²⁺:</strong> d⁶ konfiguratsiya (6 ta elektron)</li>
                      <li>• <strong className="text-white">2 × C₅H₅⁻:</strong> har biri 6π elektron beradi</li>
                      <li>• <strong className="text-yellow-300">Jami:</strong> 6 + 2×6 = <strong>18 elektron</strong></li>
                      <li>• <strong className="text-emerald-300">18 elektron qoidasi</strong> bajarildi ✓</li>
                      <li>• <strong className="text-white">Diamagnit:</strong> barcha elektronlar juftlashgan</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* XULOSA */}
            <div className="bg-gradient-to-r from-orange-600/10 via-amber-600/10 to-yellow-600/10 border border-orange-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>✅</span> Asosiy xulosalar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "🥪 <strong>Sendvich strukturasi:</strong> Fe²⁺ ikkita parallel C₅H₅⁻ halqa orasida",
                  "⚛️ <strong>18 elektron:</strong> Fe²⁺ (d⁶) + 2×C₅H₅⁻ (6π) = 18 → juda barqaror",
                  "🔗 <strong>η⁵-bog'lanish:</strong> barcha 5 ta C atomi Fe bilan bog'langan",
                  "🌀 <strong>Aromatik:</strong> har bir C₅H₅⁻ halqa 6π elektron (Hückel qoidasi)",
                  "🏆 <strong>Nobel 1973:</strong> Fischer va Wilkinson organometallik kimyo uchun",
                  "🔬 <strong>Spektroskopiya:</strong> ¹H NMR da bitta cho'qqi (δ = 4.15 ppm) — barcha 10 ta H ekvivalent",
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
            <div className="bg-gradient-to-br from-purple-900/40 to-orange-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  🥪
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Sendvich strukturasi</h2>
              </div>
              
              <div className="bg-orange-950/60 rounded-xl p-5 font-mono text-sm text-orange-200 border border-orange-700/30 mb-6 text-center">
                <pre className="whitespace-pre">{`        C₅H₅⁻ (yuqori halqa)
         _____
        /     \\
       |   •   |   ← 5 ta C atomi (η⁵)
        \\_____/
           |
          Fe²⁺      ← markaziy ion (3.32 Å masofada)
           |
         _____
        /     \\
       |   •   |   ← 5 ta C atomi (η⁵)
        \\_____/
        
        C₅H₅⁻ (pastki halqa)
        
   Sendvich: Fe²⁺ ikkita parallel C₅H₅⁻ halqa orasida
   D₅ₕ simmetriya (ekliptik konformatsiya)`}</pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-purple-400 font-bold text-sm uppercase tracking-wider">Geometrik parametrlar</h3>
                  <div className="space-y-2">
                    {[
                      ["Geometriya", "Sendvich (sandwich)"],
                      ["Nuqtali guruh", "D₅ₕ (ekliptik) / D₅d (staggered)"],
                      ["Fe−C masofa", "2.04 Å (10 ta, ekvivalent)"],
                      ["C−C masofa", "1.40 Å (halqa ichida)"],
                      ["Halqalar orasi", "3.32 Å"],
                      ["C−H masofa", "1.09 Å"],
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
                  <h3 className="text-orange-400 font-bold text-sm uppercase tracking-wider">D₅ₕ simmetriya elementlari</h3>
                  <div className="space-y-2">
                    {[
                      ["E", "Ayniylik"],
                      ["2C₅", "Asosiy o'q bo'ylab (72°, 144°, 216°, 288°)"],
                      ["5C₂", "5 ta C₂ o'qi (halqalar orqali)"],
                      ["σₕ", "Gorizontal tekislik (Fe orqali)"],
                      ["5σᵥ", "Vertikal tekisliklar"],
                      ["2S₅", "Notekis aylanish"],
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-1.5 border-b border-orange-800/30">
                        <span className="text-orange-300 text-sm font-mono font-bold">{item[0]}</span>
                        <span className="text-purple-200 text-xs">{item[1]}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-orange-950/50 rounded-xl p-3 border border-orange-700/30 mt-3">
                    <p className="text-orange-200 text-xs">
                      <strong className="text-orange-400">Jami:</strong> 20 ta simmetriya operatsiyasi.
                      <strong className="text-white"> Barcha 10 ta C va 10 ta H ekvivalent</strong> — ¹H NMR da bitta cho'qqi!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* EKLIPTIK VS STAGGERED */}
            <div className="bg-gradient-to-br from-amber-900/40 to-yellow-900/40 border border-amber-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center text-xl shadow-lg shadow-amber-500/30">
                  🔄
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Ekliptik vs Staggered konformatsiya</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-amber-950/50 rounded-xl p-5 border-2 border-amber-500/30">
                  <h3 className="text-amber-400 font-bold mb-3">🥪 Ekliptik (D₅ₕ) ← Qattiq holatda</h3>
                  <div className="bg-amber-900/60 rounded-lg p-3 font-mono text-xs text-amber-200 border border-amber-700/30 mb-3">
                    <pre className="whitespace-pre">{`    C   C   C   C   C   ← yuqori halqa
     \\ | / \\ | /
      Fe²⁺
     / | \\ / | \\
    C   C   C   C   C   ← pastki halqa
    
    Halqalar ustma-ust (0° burilish)`}</pre>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Simmetriya:</strong> D₅ₕ</p>
                    <p>• <strong className="text-white">Energiya:</strong> biroz yuqori (sterik)</p>
                    <p>• <strong className="text-white">Qattiq holatda:</strong> asosan ekliptik</p>
                  </div>
                </div>

                <div className="bg-yellow-950/50 rounded-xl p-5 border border-yellow-700/30">
                  <h3 className="text-yellow-400 font-bold mb-3">🔄 Staggered (D₅d) ← Gaz fazasida</h3>
                  <div className="bg-yellow-900/60 rounded-lg p-3 font-mono text-xs text-yellow-200 border border-yellow-700/30 mb-3">
                    <pre className="whitespace-pre">{`    C   C   C   C   C   ← yuqori halqa
      \\ | / \\ | /
       Fe²⁺
      / | \\ / | \\
    C   C   C   C   C   ← pastki halqa (36° burilgan)
    
    Halqalar 36° burilgan`}</pre>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Simmetriya:</strong> D₅d</p>
                    <p>• <strong className="text-white">Energiya:</strong> biroz past (kamroq sterik)</p>
                    <p>• <strong className="text-white">Gaz fazasida:</strong> asosan staggered</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 rounded-2xl p-5 mt-6">
                <h3 className="text-amber-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Energiya farqi juda kichik!
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">ΔE ≈ 4 kJ/mol</strong> — juda kichik farq</p>
                  <p>• <strong className="text-white">Xona haroratida:</strong> halqalar erkin aylanadi (rotatsiya)</p>
                  <p>• <strong className="text-white">NMR:</strong> ikkala konformatsiya ham <strong>bitta cho'qqi</strong> beradi</p>
                  <p className="text-xs text-purple-400 mt-2">
                    Bu erkin rotatsiya <strong className="text-yellow-300">ferrosenning noyob xususiyati</strong> — 
                    boshqa sendvich birikmalarda (masalan, [Ru(C₅H₅)₂]) rotatsiya cheklangan.
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
                  <strong className="text-emerald-400">Ferrosen</strong> — bu 
                  <strong className="text-white"> 18 elektron qoidasining</strong> klassik namunasi.
                  Fe²⁺ (d⁶) va 2 ta C₅H₅⁻ (har biri 6π elektron) — jami <strong className="text-yellow-300">18 ta elektron</strong> — 
                  inert gaz (Kr) konfiguratsiyasi. Bu kompleksni <strong className="text-white">juda barqaror</strong> qiladi.
                </p>
              </div>

              {/* ELEKTRON HISOB */}
              <div className="bg-emerald-950/50 rounded-2xl p-6 border border-emerald-700/30 mb-6">
                <h3 className="text-emerald-400 font-bold mb-4">[Fe(C₅H₅)₂] uchun elektron hisobi</h3>
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
                      <div className="text-white font-bold">2 × C₅H₅⁻</div>
                      <div className="text-purple-300 text-xs mt-1">
                        Har bir C₅H₅⁻ 6π elektron beradi (η⁵-bog'lanish)
                      </div>
                    </div>
                    <div className="text-emerald-300 text-2xl font-bold font-mono">2 × 6 = 12 e⁻</div>
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
                  <div className="text-white font-mono font-bold">18 e⁻ (Kr)</div>
                  <div className="text-green-400 text-xs mt-1">Inert gaz konfiguratsiyasi</div>
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
                <h2 className="text-xl md:text-2xl font-bold text-white">η⁵-bog'lanish mexanizmi</h2>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-purple-400">η⁵ (eta-5)</strong> — bu 
                  <strong className="text-white"> barcha 5 ta uglerod atomi</strong> metall bilan bog'langanligini bildiradi.
                  C₅H₅⁻ halqasining <strong className="text-yellow-300">π-elektronlari</strong> Fe²⁺ ning 
                  <strong className="text-pink-300"> d-orbitallari</strong> bilan o'zaro ta'sir qiladi.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
                  <h3 className="text-purple-400 font-bold mb-3">1️⃣ σ-donatsiya (C₅H₅⁻ → Fe²⁺)</h3>
                  <div className="bg-purple-900/40 rounded-lg p-4 font-mono text-xs text-purple-200 border border-purple-700/30 mb-3">
                    <pre className="whitespace-pre">{`  C₅H₅⁻ (π-elektronlar) → Fe²⁺
  
  Halqaning 6 ta π-elektroni
  Fe ning bo'sh d-orbitallariga
  donatsiya qiladi`}</pre>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">C₅H₅⁻ ning π-MO:</strong> a₁ + e₁ + e₂ (simmetriya)</p>
                    <p>• <strong className="text-white">Fe ning d-orbitallari:</strong> d<sub>z²</sub>, d<sub>xz</sub>, d<sub>yz</sub></p>
                    <p>• Natija: <strong className="text-purple-300">σ-bog'lar</strong> hosil bo'ladi</p>
                  </div>
                </div>

                <div className="bg-pink-950/50 rounded-xl p-5 border border-pink-700/30">
                  <h3 className="text-pink-400 font-bold mb-3">2️⃣ π-backbonding (Fe²⁺ → C₅H₅⁻)</h3>
                  <div className="bg-pink-900/40 rounded-lg p-4 font-mono text-xs text-pink-200 border border-pink-700/30 mb-3">
                    <pre className="whitespace-pre">{`  Fe²⁺ → C₅H₅⁻ (π*)
  
  Fe ning to'lgan d-orbitallari
  C₅H₅⁻ ning bo'sh π* orbitallariga
  elektron qaytaradi`}</pre>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Fe ning to'lgan d-orbitallari</strong> (d<sub>xy</sub>, d<sub>x²-y²</sub>)</p>
                    <p>• <strong className="text-white">C₅H₅⁻ ning π* orbitallariga</strong> donatsiya</p>
                    <p>• Natija: <strong className="text-pink-300">π-bog'lar</strong> + bog' kuchayadi</p>
                  </div>
                </div>
              </div>

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
                  <p>• <strong className="text-yellow-300">Natija:</strong> Fe−C₅H₅ bog' <strong>juda kuchli</strong></p>
                  <p>• <strong className="text-white">Bog' energiyasi:</strong> ≈ 150 kJ/mol (har bir halqa uchun)</p>
                  <p>• <strong className="text-white">Barqarorlik:</strong> ferrosen 400°C gacha parchalanmaydi</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* AROMATICITY TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "aromaticity" && (
          <>
            <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  🌀
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Aromatiklik — Hückel qoidasi</h2>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-purple-400">C₅H₅⁻ (siklopentadienid anion)</strong> — bu 
                  <strong className="text-white"> aromatik tizim</strong>.
                  <strong className="text-yellow-300"> Hückel qoidasi</strong> bo'yicha: <strong>4n + 2</strong> π-elektron bo'lsa, 
                  tizim aromatik bo'ladi. C₅H₅⁻ da <strong className="text-pink-300">6 ta π-elektron</strong> bor (n = 1).
                </p>
              </div>

              {/* HÜCKEL QOIDASI */}
              <div className="bg-purple-950/50 rounded-2xl p-5 border border-purple-700/30 mb-6">
                <h3 className="text-purple-400 font-bold mb-3">Hückel qoidasi: 4n + 2</h3>
                <div className="bg-purple-900/60 rounded-xl p-4 font-mono text-sm text-purple-200 border border-purple-700/30 mb-4">
                  <p>C₅H₅⁻ halqasida:</p>
                  <p className="mt-2">• 5 ta C atomi → har biri 1 ta p-orbital</p>
                  <p>• 5 ta p-orbital → 5 ta π-MO</p>
                  <p>• 6 ta π-elektron (5 ta C dan + 1 ta zaryaddan)</p>
                  <p className="mt-2 text-white font-bold">4n + 2 = 6 → n = 1 ✓</p>
                  <p className="text-yellow-300 mt-2">Natija: AROMATIK tizim</p>
                </div>
              </div>

              {/* TAQQOSLASH */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-red-950/50 rounded-xl p-5 border border-red-700/30">
                  <h3 className="text-red-400 font-bold mb-3">C₅H₆ (siklopentadien)</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">π-elektronlar:</strong> 4 ta</p>
                    <p>• <strong className="text-white">4n:</strong> 4 (n = 1)</p>
                    <p>• <strong className="text-red-300">Antiaromatik</strong> (beqaror)</p>
                    <p>• <strong className="text-white">pKₐ:</strong> 15 (kuchli kislota)</p>
                  </div>
                </div>

                <div className="bg-emerald-950/50 rounded-xl p-5 border-2 border-emerald-500/30">
                  <h3 className="text-emerald-400 font-bold mb-3">C₅H₅⁻ (siklopentadienid) ← Ferrosen</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">π-elektronlar:</strong> 6 ta</p>
                    <p>• <strong className="text-white">4n + 2:</strong> 6 (n = 1)</p>
                    <p>• <strong className="text-emerald-300">Aromatik</strong> (barqaror)</p>
                    <p>• <strong className="text-white">η⁵-bog'lanish:</strong> barcha 5 C</p>
                  </div>
                </div>

                <div className="bg-yellow-950/50 rounded-xl p-5 border border-yellow-700/30">
                  <h3 className="text-yellow-400 font-bold mb-3">C₅H₅⁺ (siklopentadienil kation)</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">π-elektronlar:</strong> 4 ta</p>
                    <p>• <strong className="text-white">4n:</strong> 4 (n = 1)</p>
                    <p>• <strong className="text-red-300">Antiaromatik</strong> (juda beqaror)</p>
                    <p>• <strong className="text-white">Kuzatilmaydi</strong></p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-2xl p-5">
                <h3 className="text-purple-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Nega C₅H₆ kuchli kislota?
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">C₅H₆ → C₅H₅⁻ + H⁺</strong></p>
                  <p>• <strong className="text-yellow-300">Sabab:</strong> C₅H₅⁻ aromatik (barqaror), shuning uchun H⁺ oson ajraladi</p>
                  <p>• <strong className="text-white">pKₐ = 15:</strong> suv (pKₐ = 15.7) bilan deyarli bir xil</p>
                  <p>• <strong className="text-white">Kuchli asoslar</strong> (BuLi, NaNH₂) bilan C₅H₅⁻ oson hosil bo'ladi</p>
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
                <h2 className="text-xl md:text-2xl font-bold text-white">¹H NMR — bitta cho'qqi!</h2>
              </div>
              
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-green-400">Ferrosenning ¹H NMR spektri</strong> juda oddiy — 
                  <strong className="text-yellow-300"> faqat 1 ta cho'qqi</strong> (singlet) kuzatiladi.
                  Sababi: <strong className="text-white">D₅ₕ simmetriya</strong> — barcha 10 ta H atomi 
                  <strong className="text-pink-300"> ekvivalent</strong>.
                </p>
              </div>

              {/* NMR JADVALI */}
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead className="bg-purple-950/60">
                    <tr>
                      <th className="py-3 px-4 text-purple-300 text-left">Yadro</th>
                      <th className="py-3 px-4 text-purple-300 text-left">δ (ppm)</th>
                      <th className="py-3 px-4 text-purple-300 text-left">Cho'qqilar soni</th>
                      <th className="py-3 px-4 text-purple-300 text-left">Izoh</th>
                    </tr>
                  </thead>
                  <tbody className="text-purple-200">
                    <tr className="border-b border-purple-800/30 bg-emerald-900/20">
                      <td className="py-3 px-4 font-bold">¹H</td>
                      <td className="py-3 px-4 font-mono text-emerald-300 font-bold">4.15</td>
                      <td className="py-3 px-4">1 (singlet)</td>
                      <td className="py-3 px-4 text-xs">Barcha 10 ta H ekvivalent (D₅ₕ)</td>
                    </tr>
                    <tr className="border-b border-purple-800/30">
                      <td className="py-3 px-4 font-bold">¹³C</td>
                      <td className="py-3 px-4 font-mono">68.5</td>
                      <td className="py-3 px-4">1 (singlet)</td>
                      <td className="py-3 px-4 text-xs">Barcha 10 ta C ekvivalent</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold">⁵⁷Fe</td>
                      <td className="py-3 px-4 font-mono">—</td>
                      <td className="py-3 px-4">—</td>
                      <td className="py-3 px-4 text-xs">Kam sezgir (I = 1/2, 2.2%)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-5">
                <h3 className="text-green-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Nega bitta cho'qqi?
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">D₅ₕ simmetriya:</strong> barcha 10 ta H va 10 ta C ekvivalent</p>
                  <p>• <strong className="text-white">Erkin rotatsiya:</strong> halqalar erkin aylanadi (xona haroratida)</p>
                  <p>• <strong className="text-yellow-300">Natija:</strong> ¹H NMR da <strong>1 ta singlet</strong> (δ = 4.15 ppm)</p>
                  <p className="text-xs text-purple-400 mt-2">
                    Bu <strong className="text-white">ferrosenning eng noyob xususiyati</strong> — 
                    boshqa organometallik birikmalarda (masalan, [Co(C₅H₅)₂]) cho'qqilar ko'proq.
                  </p>
                </div>
              </div>
            </div>

            {/* UV-VIS va IR */}
            <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">
                  🌈
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">UV-Vis va IR spektroskopiya</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-950/50 rounded-xl p-5 border border-blue-700/30">
                  <h3 className="text-blue-400 font-bold mb-3">🌈 UV-Vis</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">λ<sub>max</sub>:</strong> 325 nm (π→π*)</p>
                    <p>• <strong className="text-white">λ<sub>max</sub>:</strong> 440 nm (d-d, kuchsiz)</p>
                    <p>• <strong className="text-white">Rang:</strong> to'q sariq (ko'k yutiladi)</p>
                    <p className="text-xs text-purple-400 mt-2">
                      <strong className="text-yellow-300">Sabab:</strong> 440 nm (ko'k) yutiladi → to'q sariq ko'rinadi
                    </p>
                  </div>
                </div>

                <div className="bg-indigo-950/50 rounded-xl p-5 border border-indigo-700/30">
                  <h3 className="text-indigo-400 font-bold mb-3">📡 IR spektroskopiya</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">ν(C−H):</strong> 3085 cm⁻¹ (aromatik)</p>
                    <p>• <strong className="text-white">ν(C=C):</strong> 1410 cm⁻¹</p>
                    <p>• <strong className="text-white">ν(Fe−C):</strong> 490, 480 cm⁻¹</p>
                    <p>• <strong className="text-white">δ(C−H):</strong> 820 cm⁻¹ (out-of-plane)</p>
                  </div>
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
                  <h3 className="text-yellow-400 font-bold mb-3">🧪 Organik sintez</h3>
                  <div className="space-y-3 text-sm text-purple-200">
                    <div className="bg-yellow-900/40 rounded-lg p-3 border border-yellow-700/30">
                      <p className="text-yellow-300 font-bold text-xs mb-1">Katalizator</p>
                      <p className="text-xs">Ferrosen hosilalari katalizator sifatida ishlatiladi</p>
                    </div>
                    <div className="bg-yellow-900/40 rounded-lg p-3 border border-yellow-700/30">
                      <p className="text-yellow-300 font-bold text-xs mb-1">Ligand dizayni</p>
                      <p className="text-xs">Fosfin ligandlari (dppf) — Pd katalizida</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-950/50 rounded-xl p-5 border border-orange-700/30">
                  <h3 className="text-orange-400 font-bold mb-3">⚗️ Materiallar</h3>
                  <div className="space-y-3 text-sm text-purple-200">
                    <div className="bg-orange-900/40 rounded-lg p-3 border border-orange-700/30">
                      <p className="text-orange-300 font-bold text-xs mb-1">Elektrokimyo</p>
                      <p className="text-xs">Standart redoks juftlik (Fc⁺/Fc, E° = +0.40 V)</p>
                    </div>
                    <div className="bg-orange-900/40 rounded-lg p-3 border border-orange-700/30">
                      <p className="text-orange-300 font-bold text-xs mb-1">Polimerlar</p>
                      <p className="text-xs">Polyferrosenlar — elektroaktiv materiallar</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-yellow-900/40 rounded-lg p-3 border border-yellow-700/30">
                  <p className="text-yellow-300 font-bold text-xs mb-1">💊 Tibbiyot</p>
                  <p className="text-xs text-purple-200">Ferrosifen — saratonga qarshi (tamoksifen analogi)</p>
                </div>
                <div className="bg-yellow-900/40 rounded-lg p-3 border border-yellow-700/30">
                  <p className="text-yellow-300 font-bold text-xs mb-1">🔋 Yoqilg'i</p>
                  <p className="text-xs text-purple-200">Yoqilg'i qo'shimchasi (antiknock)</p>
                </div>
                <div className="bg-yellow-900/40 rounded-lg p-3 border border-yellow-700/30">
                  <p className="text-yellow-300 font-bold text-xs mb-1">🎨 Pigment</p>
                  <p className="text-xs text-purple-200">Ferrosen — to'q sariq pigment</p>
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
                  <h3 className="text-green-400 font-bold mb-3">1-usul: Klassik sintez (asosiy)</h3>
                  <div className="bg-green-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-green-300 border border-green-700/30">
                    <p>2 C₅H₆ + FeCl₂ + 2 KOH → [Fe(C₅H₅)₂] + 2 KCl + 2 H₂O</p>
                    <p className="text-green-300 text-xs mt-2">DMSO erituvchisi, 60-80°C, N₂ atmosferasi</p>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Mexanizm:</strong> KOH C₅H₆ dan H⁺ ni olib, C₅H₅⁻ hosil qiladi</p>
                    <p><strong className="text-white">Keyin:</strong> 2 C₅H₅⁻ + Fe²⁺ → [Fe(C₅H₅)₂]</p>
                    <p><strong className="text-white">Hosildorlik:</strong> 60-80%</p>
                    <p><strong className="text-white">Tozalash:</strong> Sublimatsiya (100°C, vakuum)</p>
                  </div>
                </div>

                <div className="bg-green-950/50 rounded-2xl p-5 border border-green-700/30">
                  <h3 className="text-green-400 font-bold mb-3">2-usul: Na yoki BuLi bilan</h3>
                  <div className="bg-green-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-green-300 border border-green-700/30">
                    <p>2 C₅H₆ + 2 Na → 2 NaC₅H₅ + H₂</p>
                    <p>2 NaC₅H₅ + FeCl₂ → [Fe(C₅H₅)₂] + 2 NaCl</p>
                    <p className="text-green-300 text-xs mt-2">THF erituvchisi, xona harorati</p>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Afzalligi:</strong> Tez va toza</p>
                    <p><strong className="text-white">Hosildorlik:</strong> 70-90%</p>
                    <p><strong className="text-white">Kamchiligi:</strong> Na xavfli (suv bilan portlaydi)</p>
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Nobel mukofoti 1973 — Fischer va Wilkinson</h2>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-2xl p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-yellow-600 to-amber-600 flex items-center justify-center text-6xl flex-shrink-0 shadow-2xl">
                    🏆
                  </div>
                  <div className="flex-1">
                    <h3 className="text-yellow-400 font-bold text-xl mb-2">Ernst Otto Fischer & Geoffrey Wilkinson</h3>
                    <p className="text-purple-200 text-sm mb-3 leading-relaxed">
                      <strong className="text-yellow-300">1973 yilda</strong> nemis kimyogari Ernst Otto Fischer va 
                      ingliz kimyogari Geoffrey Wilkinson 
                      <strong className="text-white"> organometallik kimyo</strong> sohasidagi kashfiyotlari uchun 
                      <strong className="text-yellow-300"> Nobel mukofoti</strong>ni oldi.
                      Ularning ishi <strong className="text-white">ferrosen</strong> va boshqa sendvich birikmalarni 
                      tushuntirishga asoslangan edi.
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-xs text-yellow-300 font-semibold">
                        🏆 Nobel 1973
                      </span>
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-xs text-amber-300 font-semibold">
                        📍 Munich / London
                      </span>
                      <span className="px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-xs text-orange-300 font-semibold">
                        🥪 Organometallik kimyo
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { year: "1951", title: "Ferrosen kashfiyoti", desc: "Pauson va Kealy birinchi bo'lib ferrosenni sintez qildi, lekin strukturasini tushuntira olmadi" },
                  { year: "1952", title: "Strukturani aniqlash", desc: "Wilkinson va Woodward, Fischer va Eiland mustaqil ravishda sendvich strukturani taklif qildi" },
                  { year: "1952-1970", title: "Organometallik inqilob", desc: "Yuzlab yangi sendvich birikmalar sintez qilindi: [Co(C₅H₅)₂], [Ni(C₅H₅)₂], [Ru(C₅H₅)₂], va h.k." },
                  { year: "1973", title: "Nobel mukofoti", desc: "Fischer va Wilkinson organometallik kimyo sohasidagi kashfiyotlari uchun Nobel oldi" },
                  { year: "Bugun", title: "Keng qo'llanilish", desc: "Ferrosen hosilalari kataliz, materiallar, tibbiyotda ishlatiladi" },
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
              href="/ilmiy/birikmares/fe-co-5"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold transition-all shadow-lg shadow-amber-500/30 flex items-center gap-2"
            >
              <span>🟡</span>
              <span className="hidden sm:inline">[Fe(CO)₅]</span>
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