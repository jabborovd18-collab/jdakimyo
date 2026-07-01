"use client"

import Link from "next/link"
import { useState } from "react"

export default function Xlorofill() {
  const [activeTab, setActiveTab] = useState("overview")
  const [chlorophyllType, setChlorophyllType] = useState("a") // a | b

  const tabs = [
    { id: "overview", label: "📋 Umumiy", icon: "📋" },
    { id: "structure", label: "🧬 Xlorin halqasi", icon: "🧬" },
    { id: "electronic", label: "⚛️ Elektron (d⁰)", icon: "⚛️" },
    { id: "photosynthesis", label: "☀️ Fotosintez", icon: "☀️" },
    { id: "lightAbsorption", label: "🌈 Yorug'lik yutilishi", icon: "🌈" },
    { id: "spectroscopy", label: "🔬 Spektroskopiya", icon: "🔬" },
    { id: "types", label: "🌿 Xlorofill turlari", icon: "🌿" },
    { id: "biosynthesis", label: "🧬 Biosintez", icon: "🧬" },
    { id: "ecology", label: "🌍 Ekologiya", icon: "🌍" },
    { id: "history", label: "🏆 Tarix", icon: "🏆" },
  ]

  const chlorophyllData = {
    a: {
      name: "Xlorofill a",
      formula: "C₅₅H₇₂MgN₄O₅",
      molarMass: "893.5 g/mol",
      color: "Ko'k-yashil",
      absorption: "430 nm, 662 nm",
      prevalence: "Barcha fotosintetik organizmlarda",
      role: "Asosiy pigment, reaktsion markaz"
    },
    b: {
      name: "Xlorofill b",
      formula: "C₅₅H₇₀MgN₄O₆",
      molarMass: "907.5 g/mol",
      color: "Sariq-yashil",
      absorption: "453 nm, 642 nm",
      prevalence: "O'simliklar va yashil suvo'tlar",
      role: "Yordamchi pigment, antenna"
    }
  }

  const current = chlorophyllData[chlorophyllType]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white relative overflow-hidden">
      
      {/* ═══ ANIMATED BACKGROUND ═══ */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-green-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-teal-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(16,185,129,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        {['Mg²⁺', 'Chl', 'd⁰', 'fotosintez', '680 nm', '700 nm', 'Calvin 1961', 'porfirin'].map((sym, i) => (
          <div
            key={i}
            className="absolute text-emerald-400/5 font-mono font-bold select-none pointer-events-none"
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
            <span className="text-emerald-400 font-semibold">[Mg(Chl)]</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
                  ☀️ Fotosintez asosi
                </span>
                <span className="px-2.5 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-[10px] text-yellow-300 font-semibold">
                  🏆 Nobel 1961
                </span>
                <span className="px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-[10px] text-blue-300 font-semibold">
                  🌍 Yer yuzidagi hayot
                </span>
                <span className="px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-[10px] text-purple-300 font-semibold">
                  🌿 Mg²⁺ porfirin
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-emerald-400 via-green-400 to-teal-300 bg-clip-text text-transparent">
                [Mg(Chl)]
              </h1>
              <p className="text-purple-300 text-sm mt-1">
                Xlorofill • Magniy xlorofillin • Chlorophyll
              </p>
            </div>
            
            {/* CHLOROPHYLL TYPE SWITCHER */}
            <div className="flex gap-2">
              <button
                onClick={() => setChlorophyllType(chlorophyllType === "a" ? "b" : "a")}
                className={`px-4 py-2 rounded-xl border-2 transition-all flex items-center gap-2 ${
                  chlorophyllType === "a"
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                    : 'bg-green-500/20 border-green-500/50 text-green-300'
                }`}
              >
                <span className="text-xl">🌿</span>
                <span className="hidden sm:inline">Xlorofill {chlorophyllType === "a" ? "a" : "b"}</span>
                <span className="sm:hidden">Chl {chlorophyllType === "a" ? "a" : "b"}</span>
              </button>
              <Link 
                href="/ilmiy/birikmalar/gemoglobin"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 hover:border-red-400/60 text-red-300 text-sm font-semibold transition-all flex items-center gap-2"
              >
                <span>🩸</span>
                <span className="hidden sm:inline">Gemoglobin</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ═══ QUICK STATS BAR ═══ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Formula", value: current.formula, icon: "🧪", color: "text-emerald-400" },
            { label: "M massa", value: current.molarMass, icon: "⚖️", color: "text-blue-400" },
            { label: "Geometriya", value: "Kvadrat-piramidal", icon: "💎", color: "text-purple-400" },
            { label: "Rangi", value: current.color, icon: "🎨", color: "text-emerald-400" },
            { label: "Yutilish", value: current.absorption, icon: "🌈", color: "text-yellow-400" },
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
                  ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/30'
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
            <div className="bg-gradient-to-br from-purple-900/40 to-emerald-900/40 border border-emerald-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center text-xl shadow-lg shadow-emerald-500/30">
                  📋
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Asosiy ma'lumotlar — {current.name}</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  ["Kimyoviy formula", current.formula],
                  ["Molyar massa", current.molarMass],
                  ["Markaziy ion", "Mg²⁺ (d⁰)"],
                  ["Koordinatsion son", "5 (4N + 1O)"],
                  ["Ligand", "Xlorin (porfirin-simon)"],
                  ["Geometriya", "Kvadrat-piramidal"],
                  ["Joylashuv", "Tilakoid membranasi"],
                  ["Vazifasi", "Yorug'lik yutish"],
                ].map((item, i) => (
                  <div key={i} className="bg-emerald-950/50 rounded-xl p-3 border border-emerald-700/30">
                    <div className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold mb-1">{item[0]}</div>
                    <div className="text-white font-semibold text-sm">{item[1]}</div>
                  </div>
                ))}
              </div>

              {/* FAOL MARKAZ */}
              <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-2xl p-5">
                <h3 className="text-emerald-400 font-bold mb-3 flex items-center gap-2">
                  <span>🎯</span> Xlorofill faol markazi
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-emerald-900/30 rounded-xl p-4 border border-emerald-700/30">
                    <h4 className="text-emerald-300 font-bold text-sm mb-2">🔬 Xlorin halqasi</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">Mg²⁺</strong> — markaziy ion (d⁰)</li>
                      <li>• <strong className="text-white">Xlorin</strong> — porfirin-simon halqa (4 ta N)</li>
                      <li>• <strong className="text-white">Fitol dumi</strong> — uzun uglevodorod zanjiri</li>
                      <li>• <strong className="text-white">Koordinatsion son:</strong> 4 (xlorin) + 1 (oqsil) = <strong>5</strong></li>
                    </ul>
                  </div>
                  <div className="bg-green-900/30 rounded-xl p-4 border border-green-700/30">
                    <h4 className="text-green-300 font-bold text-sm mb-2">☀️ Fotosintez roli</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">Yorug'lik yutish:</strong> 430 nm (ko'k) va 662 nm (qizil)</li>
                      <li>• <strong className="text-white">Energiya uzatish:</strong> ekssiton rezonansi</li>
                      <li>• <strong className="text-white">Elektron ajratish:</strong> P680/P700 reaktsion markaz</li>
                      <li>• <strong className="text-white">Natija:</strong> CO₂ → glukoza + O₂</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* XULOSA */}
            <div className="bg-gradient-to-r from-emerald-600/10 via-green-600/10 to-teal-600/10 border border-emerald-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>✅</span> Asosiy xulosalar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "☀️ <strong>Fotosintez asosi:</strong> Xlorofill yorug'lik energiyasini kimyoviy energiyaga aylantiradi",
                  "⚛️ <strong>Mg²⁺ (d⁰):</strong> d-elektronlar yo'q — faqat ligand-markaz bog'lanish",
                  "🌈 <strong>Yutilish spektri:</strong> 430 nm (ko'k) va 662 nm (qizil) — yashil nur qaytariladi",
                  "🌍 <strong>Global ahamiyat:</strong> Yiliga 100+ mlrd tonna CO₂ ni qayta ishlaydi",
                  "🧬 <strong>Biosintez:</strong> 15+ ferment ishtirokida, glutamatdan boshlanadi",
                  "🏆 <strong>Nobel 1961:</strong> Melvin Calvin — fotosintez mexanizmini aniqladi",
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
            <div className="bg-gradient-to-br from-purple-900/40 to-emerald-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-emerald-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  🧬
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Xlorin halqasi strukturasi</h2>
              </div>
              
              <div className="bg-emerald-950/60 rounded-xl p-5 font-mono text-sm text-emerald-200 border border-emerald-700/30 mb-6 text-center">
                <pre className="whitespace-pre">{`           N
          /   \\
    N — Mg — N    ← Xlorin halqasi (4 ta N)
          \\   /
           N
           |
          O (oqsildan)
           |
        Fitol dumi (C₂₀H₃₉)
        
   Kvadrat-piramidal: Mg²⁺ markazda
   4 ta N (xlorin) + 1 ta O (oqsil) = 5 ligand`}</pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-purple-400 font-bold text-sm uppercase tracking-wider">Geometrik parametrlar</h3>
                  <div className="space-y-2">
                    {[
                      ["Geometriya", "Kvadrat-piramidal (buzilgan)"],
                      ["Mg−N masofa", "2.07 Å (4 ta, ekvatorial)"],
                      ["Mg−O masofa", "2.15 Å (aksial, oqsil)"],
                      ["N−Mg−N burchak", "90° (cis) / 180° (trans)"],
                      ["Xlorin halqasi", "Tekis (planar)"],
                      ["Fitol dumi", "C₂₀H₃₉ (gidrofob)"],
                      ["Simmetriya", "C₄ᵥ (taxminan)"],
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-purple-800/30">
                        <span className="text-purple-300 text-sm">{item[0]}</span>
                        <span className="text-white font-semibold text-sm font-mono">{item[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-emerald-400 font-bold text-sm uppercase tracking-wider">Xlorin vs Porfirin</h3>
                  <div className="space-y-3">
                    <div className="bg-emerald-900/30 rounded-xl p-4 border border-emerald-700/30">
                      <h4 className="text-emerald-300 font-bold text-sm mb-2">🌿 Xlorin (xlorofill)</h4>
                      <div className="space-y-2 text-sm text-purple-200">
                        <p>• <strong className="text-white">II-pirrol halqasi:</strong> qaytarilgan (dihidroporfirin)</p>
                        <p>• <strong className="text-white">Simmetriya:</strong> pastroq (C₄ᵥ)</p>
                        <p>• <strong className="text-white">Yutilish:</strong> 662 nm (qizil)</p>
                      </div>
                    </div>
                    <div className="bg-red-900/30 rounded-xl p-4 border border-red-700/30">
                      <h4 className="text-red-300 font-bold text-sm mb-2">🩸 Porfirin (gemoglobin)</h4>
                      <div className="space-y-2 text-sm text-purple-200">
                        <p>• <strong className="text-white">Barcha pirrollar:</strong> aromatik</p>
                        <p>• <strong className="text-white">Simmetriya:</strong> yuqori (D₄ₕ)</p>
                        <p>• <strong className="text-white">Yutilish:</strong> 400-450 nm (Soret)</p>
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Elektron tuzilishi — Mg²⁺ (d⁰)</h2>
              </div>
              
              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-2 border-emerald-500/30 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-emerald-400">Muhim:</strong> Mg²⁺ — bu <strong className="text-yellow-300">d⁰ konfiguratsiyali</strong> ion.
                  Gemoglobindan farqli o'laroq, xlorofillda <strong className="text-white">d-elektronlar yo'q</strong>.
                  Shuning uchun yorug'lik yutilishi <strong className="text-pink-300">ligand markazli</strong> 
                  (π→π* o'tishlar) — metall markazli emas.
                </p>
              </div>

              {/* ELEKTRON HISOB */}
              <div className="bg-emerald-950/50 rounded-2xl p-6 border border-emerald-700/30 mb-6">
                <h3 className="text-emerald-400 font-bold mb-4">Mg²⁺ elektron konfiguratsiyasi</h3>
                <div className="space-y-3">
                  <div className="bg-emerald-900/40 rounded-xl p-4 border border-emerald-700/30 flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold">Mg atomi</div>
                      <div className="text-purple-300 text-xs mt-1">
                        Konfiguratsiya: [Ne] 3s² → 2 ta valent elektron
                      </div>
                    </div>
                    <div className="text-emerald-300 text-2xl font-bold font-mono">2 e⁻</div>
                  </div>
                  <div className="bg-emerald-900/40 rounded-xl p-4 border border-emerald-700/30 flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold">Mg²⁺ ioni</div>
                      <div className="text-purple-300 text-xs mt-1">
                        2 ta elektron yo'qotilgan → [Ne] konfiguratsiya
                      </div>
                    </div>
                    <div className="text-emerald-300 text-2xl font-bold font-mono">0 e⁻</div>
                  </div>
                  <div className="bg-yellow-900/40 rounded-xl p-4 border-2 border-yellow-500/30 flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold text-lg">Natija</div>
                      <div className="text-yellow-300 text-xs mt-1">
                        d-elektronlar yo'q → faqat ligand π→π* o'tishlar
                      </div>
                    </div>
                    <div className="text-yellow-300 text-3xl font-bold font-mono">d⁰</div>
                  </div>
                </div>
              </div>

              {/* TAQQOSLASH */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-950/50 rounded-xl p-5 border-2 border-emerald-500/30">
                  <h3 className="text-emerald-400 font-bold mb-3">🌿 Xlorofill (Mg²⁺, d⁰)</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">d-elektronlar:</strong> 0 ta</p>
                    <p>• <strong className="text-white">Yutilish:</strong> π→π* (ligand markazli)</p>
                    <p>• <strong className="text-white">λ<sub>max</sub>:</strong> 430 nm, 662 nm</p>
                    <p>• <strong className="text-white">Rang:</strong> yashil (qizil va ko'k yutiladi)</p>
                  </div>
                </div>

                <div className="bg-red-950/50 rounded-xl p-5 border border-red-700/30">
                  <h3 className="text-red-400 font-bold mb-3">🩸 Gemoglobin (Fe²⁺, d⁶)</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">d-elektronlar:</strong> 6 ta</p>
                    <p>• <strong className="text-white">Yutilish:</strong> d-d + LMCT (metall markazli)</p>
                    <p>• <strong className="text-white">λ<sub>max</sub>:</strong> 415 nm, 540 nm, 576 nm</p>
                    <p>• <strong className="text-white">Rang:</strong> qizil (yashil-ko'k yutiladi)</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* PHOTOSYNTHESIS TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "photosynthesis" && (
          <>
            <div className="bg-gradient-to-br from-yellow-900/40 to-emerald-900/40 border border-yellow-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-emerald-500 flex items-center justify-center text-xl shadow-lg shadow-yellow-500/30">
                  ☀️
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Fotosintez mexanizmi</h2>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500/10 to-emerald-500/10 border border-yellow-500/20 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-yellow-400">Fotosintez</strong> — bu <strong className="text-white">yorug'lik energiyasini</strong> 
                  kimyoviy energiyaga aylantirish jarayoni. Xlorofill bu jarayonning 
                  <strong className="text-yellow-300"> asosiy pigmenti</strong> — u yorug'likni yutadi va 
                  energiyani reaktsion markazga uzatadi.
                </p>
              </div>

              {/* UMUMIY TENGLAMA */}
              <div className="bg-yellow-950/50 rounded-2xl p-5 border border-yellow-700/30 mb-6">
                <h3 className="text-yellow-400 font-bold mb-3">Umumiy fotosintez tenglamasi</h3>
                <div className="bg-yellow-900/60 rounded-xl p-4 font-mono text-sm text-yellow-200 border border-yellow-700/30 text-center">
                  <p>6 CO₂ + 6 H₂O + yorug'lik → C₆H₁₂O₆ + 6 O₂</p>
                  <p className="text-yellow-300 text-xs mt-2">Karbonat angidrid + Suv + Energiya → Glukoza + Kislorod</p>
                </div>
              </div>

              {/* IKKI BOSQICH */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-yellow-950/50 rounded-xl p-5 border-2 border-yellow-500/30">
                  <h3 className="text-yellow-400 font-bold mb-3">☀️ Yorug'lik bosqichi</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Joy:</strong> Tilakoid membranasi</p>
                    <p>• <strong className="text-white">Pigmentlar:</strong> Xlorofill a, b, karotinoidlar</p>
                    <p>• <strong className="text-white">Jarayon:</strong></p>
                    <p className="pl-4">1. Xlorofill foton yutadi</p>
                    <p className="pl-4">2. Elektron ajralib chiqadi</p>
                    <p className="pl-4">3. H₂O parchalanadi (fotoliz)</p>
                    <p className="pl-4">4. ATP va NADPH hosil bo'ladi</p>
                    <p>• <strong className="text-white">Natija:</strong> O₂ + ATP + NADPH</p>
                  </div>
                </div>

                <div className="bg-emerald-950/50 rounded-xl p-5 border-2 border-emerald-500/30">
                  <h3 className="text-emerald-400 font-bold mb-3">🌑 Qorong'i bosqich (Calvin sikli)</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Joy:</strong> Stroma</p>
                    <p>• <strong className="text-white">Energiya:</strong> ATP va NADPH</p>
                    <p>• <strong className="text-white">Jarayon:</strong></p>
                    <p className="pl-4">1. CO₂ fiksatsiyasi (RuBisCO)</p>
                    <p className="pl-4">2. 3-PGA hosil bo'ladi</p>
                    <p className="pl-4">3. G3PGa qaytariladi</p>
                    <p className="pl-4">4. Glukoza sintezlanadi</p>
                    <p>• <strong className="text-white">Natija:</strong> C₆H₁₂O₆</p>
                  </div>
                </div>
              </div>

              {/* REAKTSION MARKAZLAR */}
              <div className="bg-gradient-to-r from-yellow-500/10 to-emerald-500/10 border-2 border-yellow-500/30 rounded-2xl p-5">
                <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                  <span>🎯</span> Reaktsion markazlar: P680 va P700
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-yellow-900/40 rounded-lg p-4 border border-yellow-700/30">
                    <h4 className="text-yellow-300 font-bold text-sm mb-2">PSII — P680</h4>
                    <div className="space-y-2 text-sm text-purple-200">
                      <p>• <strong className="text-white">Yutilish:</strong> 680 nm</p>
                      <p>• <strong className="text-white">Vazifasi:</strong> H₂O fotolizi</p>
                      <p>• <strong className="text-white">Natija:</strong> O₂ ajralib chiqadi</p>
                      <p>• <strong className="text-white">Potentsial:</strong> +1.1 V (kuchli oksidlovchi)</p>
                    </div>
                  </div>
                  <div className="bg-emerald-900/40 rounded-lg p-4 border border-emerald-700/30">
                    <h4 className="text-emerald-300 font-bold text-sm mb-2">PSI — P700</h4>
                    <div className="space-y-2 text-sm text-purple-200">
                      <p>• <strong className="text-white">Yutilish:</strong> 700 nm</p>
                      <p>• <strong className="text-white">Vazifasi:</strong> NADP⁺ qaytarish</p>
                      <p>• <strong className="text-white">Natija:</strong> NADPH hosil bo'ladi</p>
                      <p>• <strong className="text-white">Potentsial:</strong> -1.3 V (kuchli qaytaruvchi)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* LIGHT ABSORPTION TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "lightAbsorption" && (
          <>
            <div className="bg-gradient-to-br from-blue-900/40 to-emerald-900/40 border border-blue-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">
                  🌈
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Yorug'lik yutilishi — nima uchun o'simliklar yashil?</h2>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-500/20 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-blue-400">Xlorofill</strong> ko'rinadigan yorug'lik spektrining 
                  <strong className="text-yellow-300"> ko'k (430 nm)</strong> va <strong className="text-red-300">qizil (662 nm)</strong> 
                  qismlarini yutadi. <strong className="text-emerald-300">Yashil nur (500-600 nm)</strong> esa 
                  <strong className="text-white"> qaytariladi</strong> — shuning uchun o'simliklar yashil ko'rinadi!
                </p>
              </div>

              {/* YUTILISH SPEKTRI */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-950/50 rounded-xl p-5 border-2 border-blue-500/30">
                  <h3 className="text-blue-400 font-bold mb-3">🌿 Xlorofill a</h3>
                  <div className="bg-blue-900/60 rounded-lg p-4 h-32 mb-3 flex items-end justify-around">
                    {/* 430 nm - ko'k */}
                    <div className="w-8 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t" style={{height: '90%'}}></div>
                    {/* 500-600 nm - yashil (past) */}
                    <div className="w-8 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t" style={{height: '20%'}}></div>
                    {/* 662 nm - qizil */}
                    <div className="w-8 bg-gradient-to-t from-red-600 to-red-400 rounded-t" style={{height: '85%'}}></div>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-blue-300">Soret cho'qqisi:</strong> 430 nm (ko'k)</p>
                    <p>• <strong className="text-red-300">Q cho'qqisi:</strong> 662 nm (qizil)</p>
                    <p>• <strong className="text-emerald-300">Yashil:</strong> 500-600 nm (qaytariladi)</p>
                  </div>
                </div>

                <div className="bg-green-950/50 rounded-xl p-5 border-2 border-green-500/30">
                  <h3 className="text-green-400 font-bold mb-3">🌱 Xlorofill b</h3>
                  <div className="bg-green-900/60 rounded-lg p-4 h-32 mb-3 flex items-end justify-around">
                    {/* 453 nm - ko'k */}
                    <div className="w-8 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t" style={{height: '80%'}}></div>
                    {/* 500-600 nm - yashil (past) */}
                    <div className="w-8 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t" style={{height: '15%'}}></div>
                    {/* 642 nm - qizil */}
                    <div className="w-8 bg-gradient-to-t from-red-600 to-red-400 rounded-t" style={{height: '70%'}}></div>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-blue-300">Soret cho'qqisi:</strong> 453 nm (ko'k)</p>
                    <p>• <strong className="text-red-300">Q cho'qqisi:</strong> 642 nm (qizil)</p>
                    <p>• <strong className="text-green-300">Vazifasi:</strong> Yordamchi pigment</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-500/20 rounded-2xl p-5">
                <h3 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Nima uchun yashil nur yutilmaydi?
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Evolyutsion sabab:</strong> Erta fotosintetik organizmlar suv ostida yashagan</p>
                  <p>• <strong className="text-white">Suv filtri:</strong> Suv qizil va ko'k nurni yutadi, yashil nur o'tadi</p>
                  <p>• <strong className="text-white">Moslashuv:</strong> Xlorofill suv ostida mavjud bo'lgan nurni (yashil) yutishga moslashmagan</p>
                  <p className="text-xs text-purple-400 mt-2">
                    <strong className="text-yellow-300">Qiziq fakt:</strong> Ba'zi bakteriyalar (masalan, purple bacteria) 
                    yashil nurni yutadi — ular <strong className="text-pink-300">binafsha</strong> rangda ko'rinadi!
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
                      <p className="text-green-300 font-bold text-xs mb-1">🌿 Xlorofill a</p>
                      <p className="text-xs">Soret: 430 nm (ε ≈ 100,000)</p>
                      <p className="text-xs">Q<sub>y</sub>: 662 nm (ε ≈ 80,000)</p>
                      <p className="text-xs">Q<sub>x</sub>: 615 nm (kuchsiz)</p>
                    </div>
                    <div className="bg-emerald-900/40 rounded-lg p-3 border border-emerald-700/30">
                      <p className="text-emerald-300 font-bold text-xs mb-1">🌱 Xlorofill b</p>
                      <p className="text-xs">Soret: 453 nm (ε ≈ 150,000)</p>
                      <p className="text-xs">Q<sub>y</sub>: 642 nm (ε ≈ 50,000)</p>
                      <p className="text-xs">Q<sub>x</sub>: 595 nm (kuchsiz)</p>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-950/50 rounded-xl p-5 border border-emerald-700/30">
                  <h3 className="text-emerald-400 font-bold mb-3">📡 Fluorestsensiya</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <div className="bg-emerald-900/40 rounded-lg p-3 border border-emerald-700/30">
                      <p className="text-emerald-300 font-bold text-xs mb-1">Xlorofill a fluorestsensiyasi</p>
                      <p className="text-xs">λ<sub>em</sub>: 673 nm (qizil)</p>
                      <p className="text-xs">Kvant chiqishi: Φ ≈ 0.3</p>
                      <p className="text-xs">Stokes siljishi: ~11 nm</p>
                    </div>
                    <div className="bg-teal-900/40 rounded-lg p-3 border border-teal-700/30">
                      <p className="text-teal-300 font-bold text-xs mb-1">Qo'llanilishi</p>
                      <p className="text-xs">Fotosintez samaradorligini o'lchash</p>
                      <p className="text-xs">O'simlik stressini aniqlash</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-5">
                <h3 className="text-green-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Nima uchun fluorestsensiya muhim?
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Fotosintez samaradorligi:</strong> Past fluorestsensiya = yuqori samaradorlik</p>
                  <p>• <strong className="text-white">Stress indikatori:</strong> Yuqori fluorestsensiya = o'simlik stressda</p>
                  <p>• <strong className="text-white">Fv/Fm:</strong> Maksimal kvant chiqishi (normal: 0.83)</p>
                  <p className="text-xs text-purple-400 mt-2">
                    <strong className="text-yellow-300">PAM fluometriya</strong> — bu usul qishloq xo'jaligida 
                    keng qo'llaniladi (masalan, qurg'oqchilik stressini aniqlash).
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* TYPES TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "types" && (
          <>
            <div className="bg-gradient-to-br from-emerald-900/40 to-green-900/40 border border-emerald-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center text-xl shadow-lg shadow-emerald-500/30">
                  🌿
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Xlorofill turlari</h2>
              </div>
              
              <div className="space-y-4">
                {[
                  { type: "a", name: "Xlorofill a", color: "Ko'k-yashil", absorption: "430, 662 nm", prevalence: "Barcha fotosintetik organizmlar", role: "Asosiy pigment, reaktsion markaz", icon: "🌿" },
                  { type: "b", name: "Xlorofill b", color: "Sariq-yashil", absorption: "453, 642 nm", prevalence: "O'simliklar, yashil suvo'tlar", role: "Yordamchi pigment, antenna", icon: "🌱" },
                  { type: "c", name: "Xlorofill c", color: "Jigarrang-yashil", absorption: "447, 588 nm", prevalence: "Diatomlar, dinoflagellatlar", role: "Yordamchi pigment", icon: "🟢" },
                  { type: "d", name: "Xlorofill d", color: "Qizil-jigarrang", absorption: "447, 697 nm", prevalence: "Qizil suvo'tlar", role: "Uzoq to'lqin yutilishi", icon: "🔴" },
                  { type: "f", name: "Xlorofill f", color: "Qizil", absorption: "447, 706 nm", prevalence: "Sianobakteriyalar", role: "Infraqizil yaqin yutilish", icon: "🟥" },
                ].map((item, i) => (
                  <div key={i} className="bg-emerald-950/50 rounded-xl p-5 border border-emerald-700/30">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{item.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-emerald-400 font-bold mb-2">{item.name}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-purple-200">
                          <div>
                            <div className="text-[10px] text-emerald-400 uppercase">Rang</div>
                            <div className="font-semibold">{item.color}</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-emerald-400 uppercase">Yutilish</div>
                            <div className="font-semibold font-mono">{item.absorption}</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-emerald-400 uppercase">Tarqalish</div>
                            <div className="font-semibold">{item.prevalence}</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-emerald-400 uppercase">Rol</div>
                            <div className="font-semibold">{item.role}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* BIOSYNTHESIS TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "biosynthesis" && (
          <>
            <div className="bg-gradient-to-br from-purple-900/40 to-emerald-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-emerald-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  🧬
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Xlorofill biosintezi</h2>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500/10 to-emerald-500/10 border border-purple-500/20 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-purple-400">Xlorofill biosintezi</strong> — bu 
                  <strong className="text-white"> 15+ ferment</strong> ishtirokida sodir bo'ladigan murakkab jarayon.
                  U <strong className="text-yellow-300">glutamat</strong> aminokislotasidan boshlanadi va 
                  <strong className="text-pink-300"> xlorofill a</strong> bilan tugaydi.
                </p>
              </div>

              {/* BIOSINTEZ BOSQICHLARI */}
              <div className="space-y-3 mb-6">
                {[
                  { step: "1", title: "Glutamat → δ-aminolevulin kislota (ALA)", desc: "Glutamyl-tRNA reduktaza fermenti orqali. Bu bosqich nazorat qilinadi.", color: "purple" },
                  { step: "2", title: "ALA → Porfobilinogen (PBG)", desc: "ALA dehidrataza fermenti. 2 ta ALA → 1 ta PBG.", color: "blue" },
                  { step: "3", title: "PBG → Gidroximetilbilan", desc: "PBG deaminaza. 4 ta PBG → 1 ta linear tetrapirrol.", color: "cyan" },
                  { step: "4", title: "Gidroximetilbilan → Uroporfirinogen III", desc: "Uroporfirinogen III sintaza. Halqa yopiladi.", color: "emerald" },
                  { step: "5", title: "Uroporfirinogen III → Protoporfirin IX", desc: "Bir necha dekarboksilash va oksidlanish bosqichlari.", color: "green" },
                  { step: "6", title: "Protoporfirin IX → Mg-Protoporfirin IX", desc: "Mg-xelataza fermenti Mg²⁺ ni kiritadi.", color: "yellow" },
                  { step: "7", title: "Mg-Protoporfirin IX → Xlorofill a", desc: "Bir necha qo'shimcha modifikatsiyalar (metillash, siklizatsiya, qaytarish).", color: "orange" },
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

              <div className="bg-gradient-to-r from-purple-500/10 to-emerald-500/10 border border-purple-500/20 rounded-2xl p-5">
                <h3 className="text-purple-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Nima uchun bu muhim?
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Porphyria kasalliklari:</strong> Biosintez fermentlarining nuqsonlari</p>
                  <p>• <strong className="text-white">Herbicides:</strong> Ba'zi o't o'ldiruvchilar biosintezni to'xtatadi</p>
                  <p>• <strong className="text-white">Etiolation:</strong> Qorong'ida o'sgan o'simliklar sariq (xlorofill yo'q)</p>
                  <p className="text-xs text-purple-400 mt-2">
                    <strong className="text-yellow-300">Qiziq fakt:</strong> Xlorofill sintezi <strong>yorug'likka bog'liq</strong> — 
                    shuning uchun qorong'ida o'sgan o'simliklar <strong className="text-pink-300">sariq</strong> bo'ladi.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* ECOLOGY TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "ecology" && (
          <>
            <div className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border border-emerald-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-xl shadow-lg shadow-emerald-500/30">
                  🌍
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Global ekologik ahamiyat</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-emerald-950/50 rounded-xl p-5 border border-emerald-700/30 text-center">
                  <div className="text-4xl mb-2">🌿</div>
                  <div className="text-emerald-400 text-xs uppercase mb-1">Yillik fotosintez</div>
                  <div className="text-white font-bold text-2xl">100+ mlrd</div>
                  <div className="text-purple-300 text-xs mt-1">tonna CO₂</div>
                </div>
                <div className="bg-teal-950/50 rounded-xl p-5 border border-teal-700/30 text-center">
                  <div className="text-4xl mb-2">☀️</div>
                  <div className="text-teal-400 text-xs uppercase mb-1">Energiya konversiyasi</div>
                  <div className="text-white font-bold text-2xl">~3%</div>
                  <div className="text-purple-300 text-xs mt-1">samaradorlik</div>
                </div>
                <div className="bg-green-950/50 rounded-xl p-5 border border-green-700/30 text-center">
                  <div className="text-4xl mb-2">🌬️</div>
                  <div className="text-green-400 text-xs uppercase mb-1">O₂ ishlab chiqarish</div>
                  <div className="text-white font-bold text-2xl">21%</div>
                  <div className="text-purple-300 text-xs mt-1">atmosfera O₂</div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  { title: "1. Karbonat angidrid fiksatsiyasi", desc: "O'simliklar yiliga 100+ mlrd tonna CO₂ ni organik moddalarga aylantiradi", icon: "🌿", color: "emerald" },
                  { title: "2. Kislorod ishlab chiqarish", desc: "Fotosintez natijasida atmosfera O₂ bilan to'yinadi (21%)", icon: "🌬️", color: "teal" },
                  { title: "3. Oziq-ovqat zanjiri asosi", desc: "Barcha heterotrof organizmlar o'simliklar tomonidan yaratilgan organik moddalarga bog'liq", icon: "🔗", color: "green" },
                  { title: "4. Iqlim regulyatsiyasi", desc: "CO₂ yutilishi issiqxona effektini kamaytiradi", icon: "🌡️", color: "blue" },
                  { title: "5. Tuproq hosil qilish", desc: "O'simlik qoldiqlari tuproq organik moddasini yaratadi", icon: "🌱", color: "yellow" },
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

              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-5">
                <h3 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Iqlim o'zgarishi va xlorofill
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">CO₂ ortishi:</strong> Fotosintez tezlashadi (CO₂ fertilizatsiya effekti)</p>
                  <p>• <strong className="text-white">Harorat ortishi:</strong> Ba'zi o'simliklar stressga uchraydi</p>
                  <p>• <strong className="text-white">Qurg'oqchilik:</strong> Fotosintez kamayadi</p>
                  <p className="text-xs text-purple-400 mt-2">
                    <strong className="text-yellow-300">Sun'iy fotosintez</strong> — bu tadqiqot yo'nalishi 
                    xlorofillni taqlid qilib, <strong className="text-pink-300">CO₂ ni yoqilg'iga</strong> aylantirishga harakat qiladi.
                  </p>
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Nobel mukofotlari — Willstätter (1915) va Calvin (1961)</h2>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-2xl p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-yellow-600 to-amber-600 flex items-center justify-center text-6xl flex-shrink-0 shadow-2xl">
                    🏆
                  </div>
                  <div className="flex-1">
                    <h3 className="text-yellow-400 font-bold text-xl mb-2">Richard Willstätter (1915) & Melvin Calvin (1961)</h3>
                    <p className="text-purple-200 text-sm mb-3 leading-relaxed">
                      <strong className="text-yellow-300">1915 yilda</strong> Richard Willstätter 
                      <strong className="text-white"> xlorofill strukturasini</strong> aniqlagani uchun Nobel mukofotini oldi.
                      <strong className="text-yellow-300"> 1961 yilda</strong> Melvin Calvin 
                      <strong className="text-white"> fotosintez mexanizmini</strong> (Calvin sikli) aniqlagani uchun Nobel oldi.
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-xs text-yellow-300 font-semibold">
                        🏆 Nobel 1915
                      </span>
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-xs text-amber-300 font-semibold">
                        🏆 Nobel 1961
                      </span>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-xs text-emerald-300 font-semibold">
                        🌿 Fotosintez mexanizmi
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { year: "1817", title: "Xlorofill kashfiyoti", desc: "Pelletier va Caventou birinchi bo'lib xlorofillni o'simliklardan ajratib oldi" },
                  { year: "1906", title: "Willstätter tadqiqotlari", desc: "Richard Willstätter xlorofill strukturasini o'rganishni boshladi" },
                  { year: "1913", title: "Mg²⁺ aniqlandi", desc: "Willstätter xlorofillda magniy borligini isbotladi" },
                  { year: "1915", title: "Nobel mukofoti", desc: "Willstätter xlorofill va boshqa o'simlik pigmentlari tadqiqoti uchun Nobel oldi" },
                  { year: "1940-1950", title: "Calvin tadqiqotlari", desc: "Melvin Calvin ¹⁴C izotopi yordamida fotosintez yo'lini kuzatdi" },
                  { year: "1957", title: "Calvin sikli", desc: "CO₂ fiksatsiyasi mexanizmi to'liq aniqlandi" },
                  { year: "1961", title: "Nobel mukofoti", desc: "Calvin fotosintez mexanizmini aniqlagani uchun Nobel oldi" },
                  { year: "1980+", title: "Strukturaviy biologiya", desc: "Fotosistema I va II ning kristall strukturasi aniqlandi" },
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
              href="/ilmiy/birikmalar/gemoglobin"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white font-bold transition-all shadow-lg shadow-red-500/30 flex items-center gap-2"
            >
              <span>🩸</span>
              <span className="hidden sm:inline">Gemoglobin</span>
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