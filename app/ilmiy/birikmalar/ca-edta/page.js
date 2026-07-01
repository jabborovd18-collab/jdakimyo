"use client"

import Link from "next/link"
import { useState } from "react"

export default function CaEDTA() {
  const [activeTab, setActiveTab] = useState("overview")
  const [activeMetal, setActiveMetal] = useState("Ca") // Ca | Pb | Cd | Hg

  const tabs = [
    { id: "overview", label: "📋 Umumiy", icon: "📋" },
    { id: "edta", label: "🔗 EDTA strukturasi", icon: "🔗" },
    { id: "chelate", label: "💎 Xelat effekti", icon: "💎" },
    { id: "structure", label: "🧬 Tuzilish", icon: "🧬" },
    { id: "electronic", label: "⚛️ Elektron (d⁰)", icon: "⚛️" },
    { id: "stability", label: "⚖️ Barqarorlik (log K)", icon: "⚖️" },
    { id: "spectroscopy", label: "🔬 Spektroskopiya", icon: "🔬" },
    { id: "medical", label: "💊 Tibbiy qo'llanilish", icon: "💊" },
    { id: "synthesis", label: "⚗️ Sintez", icon: "⚗️" },
  ]

  const metalData = {
    Ca: { name: "Ca²⁺", logK: 10.7, color: "text-emerald-400", use: "Detoksikatsiya agenti", charge: "+2", dElectrons: "d⁰", size: "1.00 Å" },
    Pb: { name: "Pb²⁺", logK: 18.0, color: "text-red-400", use: "Qo'rg'oshin zaharlanishi", charge: "+2", dElectrons: "d¹⁰", size: "1.19 Å" },
    Cd: { name: "Cd²⁺", logK: 16.5, color: "text-orange-400", use: "Kadmiy zaharlanishi", charge: "+2", dElectrons: "d¹⁰", size: "0.95 Å" },
    Hg: { name: "Hg²⁺", logK: 21.5, color: "text-pink-400", use: "Simob zaharlanishi", charge: "+2", dElectrons: "d¹⁰", size: "1.02 Å" },
  }

  const currentMetal = metalData[activeMetal]

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0118] via-teal-950/30 to-slate-950 text-white relative overflow-hidden">
      
      {/* ═══ ANIMATED BACKGROUND ═══ */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(20,184,166,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        {['Ca²⁺', 'EDTA⁴⁻', 'geksadentat', 'log K=10.7', 'detoks', 'd⁰', 'chelate'].map((sym, i) => (
          <div
            key={i}
            className="absolute text-teal-400/5 font-mono font-bold select-none pointer-events-none"
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
            <span className="text-teal-400 font-semibold">[Ca(EDTA)]²⁻</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-500/30 text-[10px] text-teal-300 font-bold uppercase tracking-wider">
                  💊 Tibbiy detoksikatsiya
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] text-emerald-300 font-semibold">
                  🔗 Geksadentat xelat
                </span>
                <span className="px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-[10px] text-blue-300 font-semibold">
                  ⚛️ d⁰ konfiguratsiya
                </span>
                <span className="px-2.5 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-[10px] text-yellow-300 font-semibold">
                  ⚖️ log K = 10.7
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-300 bg-clip-text text-transparent">
                [Ca(EDTA)]²⁻
              </h1>
              <p className="text-purple-300 text-sm mt-1">
                Kalsiy etilendiamintetraasetat • Calcium ethylenediaminetetraacetate
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
            { label: "Formula", value: "[Ca(EDTA)]²⁻", icon: "🧪", color: "text-teal-400" },
            { label: "M massa", value: "372.31 g/mol", icon: "⚖️", color: "text-blue-400" },
            { label: "Geometriya", value: "Buzilgan oktaedrik", icon: "💎", color: "text-purple-400" },
            { label: "Ligand turi", value: "Geksadentat (6)", icon: "🔗", color: "text-emerald-400" },
            { label: "d-elektronlar", value: "d⁰ (yo'q!)", icon: "⚛️", color: "text-yellow-400" },
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

      {/* ═══ METAL SWITCHER ═══ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 mb-8">
        <div className="bg-gradient-to-r from-teal-900/30 via-cyan-900/30 to-blue-900/30 border border-teal-500/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">⚖️</span>
            <span className="text-sm font-bold text-white">Metallni tanlang (barqarorlik taqqoslash):</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(metalData).map(([key, data]) => (
              <button
                key={key}
                onClick={() => setActiveMetal(key)}
                className={`relative p-3 rounded-xl border-2 transition-all ${
                  activeMetal === key
                    ? `bg-gradient-to-br ${key === 'Ca' ? 'from-emerald-600/40 to-teal-600/40 border-emerald-400/60' : key === 'Pb' ? 'from-red-600/40 to-orange-600/40 border-red-400/60' : key === 'Cd' ? 'from-orange-600/40 to-yellow-600/40 border-orange-400/60' : 'from-pink-600/40 to-purple-600/40 border-pink-400/60'}`
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                {activeMetal === key && (
                  <div className={`absolute top-1 right-1 w-5 h-5 rounded-full ${key === 'Ca' ? 'bg-emerald-500' : key === 'Pb' ? 'bg-red-500' : key === 'Cd' ? 'bg-orange-500' : 'bg-pink-500'} flex items-center justify-center text-white text-xs font-bold`}>✓</div>
                )}
                <div className="text-center">
                  <div className={`font-bold ${data.color} text-lg font-mono`}>{data.name}</div>
                  <div className="text-[10px] text-purple-300 mt-1">log K = {data.logK}</div>
                  <div className="text-[9px] text-purple-400 mt-1 line-clamp-2">{data.use}</div>
                </div>
              </button>
            ))}
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
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30'
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
            <div className="bg-gradient-to-br from-teal-900/40 to-cyan-900/40 border border-teal-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-xl shadow-lg shadow-teal-500/30">
                  📋
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Asosiy ma'lumotlar</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  ["CAS (Ca-EDTA)", "62-33-9"],
                  ["CAS (Na₂CaEDTA)", "6766-87-6"],
                  ["Zichlik", "~1.80 g/cm³"],
                  ["Sistema", "Monoklinik"],
                  ["Eruvchanlik (H₂O)", "Juda yaxshi (0.5 M)"],
                  ["Eruvchanlik (EtOH)", "Erimaydi"],
                  ["Barqarorlik", "Juda yuqori (log K=10.7)"],
                  ["Rangi", "Rangsiz / oq kristall"],
                ].map((item, i) => (
                  <div key={i} className="bg-teal-950/50 rounded-xl p-3 border border-teal-700/30">
                    <div className="text-[10px] uppercase tracking-wider text-teal-400 font-semibold mb-1">{item[0]}</div>
                    <div className="text-white font-semibold text-sm">{item[1]}</div>
                  </div>
                ))}
              </div>

              {/* TARKIB */}
              <div className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/20 rounded-2xl p-5">
                <h3 className="text-teal-400 font-bold mb-3 flex items-center gap-2">
                  <span>💎</span> Kompleks tarkibi
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-teal-900/30 rounded-xl p-4 border border-teal-700/30">
                    <h4 className="text-teal-300 font-bold text-sm mb-2">🎯 Markaziy ion: Ca²⁺</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">Atom raqami:</strong> Z = 20</li>
                      <li>• <strong className="text-white">Elektron konfiguratsiya:</strong> [Ar] 3d⁰ 4s⁰</li>
                      <li>• <strong className="text-white">d-elektronlar:</strong> <strong className="text-yellow-300">0 ta!</strong></li>
                      <li>• <strong className="text-white">Ion radiusi:</strong> 1.00 Å (6-koordinatsiya)</li>
                      <li>• <strong className="text-white">Magnit:</strong> Diamagnit (barcha elektronlar juftlashgan)</li>
                    </ul>
                  </div>
                  <div className="bg-cyan-900/30 rounded-xl p-4 border border-cyan-700/30">
                    <h4 className="text-cyan-300 font-bold text-sm mb-2">🔗 Ligand: EDTA⁴⁻</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">To'liq nom:</strong> Etilendiamintetraasetat</li>
                      <li>• <strong className="text-white">Turi:</strong> Geksadentat (6 ta donor)</li>
                      <li>• <strong className="text-white">Donor atomlari:</strong> 2 × N + 4 × O</li>
                      <li>• <strong className="text-white">Zaryad:</strong> −4</li>
                      <li>• <strong className="text-white">Halqa:</strong> 5 ta 5 a'zoli xelat halqa</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* XULOSA */}
            <div className="bg-gradient-to-r from-teal-600/10 via-cyan-600/10 to-blue-600/10 border border-teal-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>✅</span> Asosiy xulosalar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "⚛️ <strong>d⁰ konfiguratsiya:</strong> Ca²⁺ da d-elektronlar yo'q → KMBE = 0",
                  "🔗 <strong>Geksadentat ligand:</strong> EDTA⁴⁻ 6 ta donor atomi bilan bog'lanadi",
                  "💎 <strong>5 ta xelat halqa:</strong> har biri 5 a'zoli — yuqori barqarorlik",
                  "⚖️ <strong>log K = 10.7</strong> — yuqori barqarorlik (K = 5×10¹⁰)",
                  "💊 <strong>Tibbiy qo'llanilish:</strong> Pb²⁺, Cd²⁺, Hg²⁺ detoksikatsiyasi",
                  "🔄 <strong>Metallar almashinuvi:</strong> Ca²⁺ → Pb²⁺ (log K: 10.7 → 18.0)",
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
        {/* EDTA TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "edta" && (
          <>
            {/* EDTA STRUKTURASI */}
            <div className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border border-emerald-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-xl shadow-lg shadow-emerald-500/30">
                  🔗
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">EDTA (Etilendiamintetraasetat kislotasi)</h2>
              </div>
              
              <div className="bg-emerald-950/50 rounded-2xl p-6 border border-emerald-700/30 mb-6">
                <h3 className="text-emerald-400 font-bold mb-3">To'liq formula</h3>
                <div className="bg-emerald-900/60 rounded-xl p-4 font-mono text-sm text-emerald-200 border border-emerald-700/30 text-center">
                  <p className="text-lg font-bold">(HOOC−CH₂)₂N−CH₂−CH₂−N(CH₂−COOH)₂</p>
                  <p className="text-emerald-300 text-xs mt-2">H₄EDTA — to'liq protonlangan shakl</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-950/50 rounded-xl p-5 border border-emerald-700/30">
                  <h3 className="text-emerald-400 font-bold mb-3">🎯 6 ta donor atomi</h3>
                  <div className="space-y-2 text-sm">
                    {[
                      { atom: "2 × N (azot)", color: "text-blue-400", role: "Amino guruhlaridan", hybrid: "sp³" },
                      { atom: "4 × O (kislorod)", color: "text-red-400", role: "Karboksilat guruhlaridan", hybrid: "sp²" },
                    ].map((item, i) => (
                      <div key={i} className="bg-emerald-900/40 rounded-lg p-3 border border-emerald-700/30">
                        <div className="flex justify-between items-center">
                          <span className={`font-bold ${item.color}`}>{item.atom}</span>
                          <span className="text-purple-300 text-xs">{item.hybrid}</span>
                        </div>
                        <p className="text-purple-300 text-xs mt-1">{item.role}</p>
                      </div>
                    ))}
                    <div className="bg-yellow-900/40 rounded-lg p-3 border border-yellow-700/30 mt-2">
                      <p className="text-yellow-300 text-xs">
                        <strong>Jami: 6 ta donor</strong> → <strong className="text-white">geksadentat</strong> ligand (eng kuchli xelat agenti)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-teal-950/50 rounded-xl p-5 border border-teal-700/30">
                  <h3 className="text-teal-400 font-bold mb-3">🔬 Kislota dissotsiatsiyasi</h3>
                  <div className="space-y-2 text-xs">
                    {[
                      { step: "pK₁ = 2.0", desc: "H₄EDTA → H₃EDTA⁻ + H⁺", color: "text-red-300" },
                      { step: "pK₂ = 2.7", desc: "H₃EDTA⁻ → H₂EDTA²⁻ + H⁺", color: "text-orange-300" },
                      { step: "pK₃ = 6.2", desc: "H₂EDTA²⁻ → HEDTA³⁻ + H⁺", color: "text-yellow-300" },
                      { step: "pK₄ = 10.3", desc: "HEDTA³⁻ → EDTA⁴⁻ + H⁺", color: "text-green-300" },
                    ].map((item, i) => (
                      <div key={i} className="bg-teal-900/40 rounded-lg p-2 border border-teal-700/30">
                        <div className={`font-mono font-bold ${item.color}`}>{item.step}</div>
                        <div className="text-purple-300 text-[10px] font-mono">{item.desc}</div>
                      </div>
                    ))}
                    <div className="bg-teal-900/60 rounded-lg p-2 mt-2 border border-teal-700/30">
                      <p className="text-teal-300 text-[10px]">
                        <strong>pH &gt; 10.3</strong> da to'liq deprotonlangan <strong className="text-white">EDTA⁴⁻</strong> shakli — eng kuchli kompleks hosil qiladi
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 5 A'ZOLI HALQALAR */}
            <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  🔁
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">5 ta xelat halqa</h2>
              </div>
              
              <div className="bg-purple-950/60 rounded-2xl p-6 border border-purple-700/30 mb-6">
                <pre className="whitespace-pre text-purple-200 text-xs font-mono leading-relaxed">
{`           O                    O
           ||                   ||
        O−C−CH₂              CH₂−C−O
            \\                /
             N−CH₂−CH₂−N
            /                \\
        O−C−CH₂              CH₂−C−O
           ||                   ||
           O                    O
                ↕
               Ca²⁺ (markazda)
    
    5 ta 5 a'zoli xelat halqa:
    • 2 × Ca−N−C−C−N  (diamin halqalar)
    • 4 × Ca−N−C−C−O  (glitsinat halqalar)
    Jami: 5 ta barqaror halqa!`}
                </pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {[
                  { name: "Halqa 1", type: "Ca−N−C−C−N", desc: "Diamin" },
                  { name: "Halqa 2", type: "Ca−N−C−C−N", desc: "Diamin" },
                  { name: "Halqa 3", type: "Ca−N−C−C−O", desc: "Glitsinat" },
                  { name: "Halqa 4", type: "Ca−N−C−C−O", desc: "Glitsinat" },
                  { name: "Halqa 5", type: "Ca−N−C−C−O", desc: "Glitsinat" },
                ].map((ring, i) => (
                  <div key={i} className="bg-purple-900/40 rounded-xl p-3 border border-purple-700/30 text-center">
                    <div className="text-purple-300 text-xs font-bold">{ring.name}</div>
                    <div className="text-white font-mono text-[10px] mt-1">{ring.type}</div>
                    <div className="text-purple-400 text-[10px] mt-1">{ring.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* CHELATE TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "chelate" && (
          <>
            <div className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border border-emerald-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-xl shadow-lg shadow-emerald-500/30">
                  💎
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Xelat effekti — nima uchun shunchalik barqaror?</h2>
              </div>
              
              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-emerald-400">[Ca(EDTA)]²⁻</strong> — bu <strong className="text-white">eng kuchli xelat kompleksi</strong> 
                  hisoblanadi. EDTA ligandi <strong className="text-yellow-300">6 ta donor atomi</strong> bilan bir vaqtda bog'lanib,
                  <strong className="text-white"> 5 ta 5 a'zoli halqa</strong> hosil qiladi. Natijada barqarorlik 
                  <strong className="text-pink-300"> 10¹⁰ marta</strong> oshadi!
                </p>
              </div>

              {/* TAQQOSLASH */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-red-950/50 rounded-2xl p-5 border border-red-700/30">
                  <h3 className="text-red-400 font-bold mb-3">❌ 6 ta monodentat ligand</h3>
                  <div className="bg-red-900/60 rounded-xl p-4 mb-4 font-mono text-xs text-red-200 border border-red-700/30">
                    Ca²⁺ + 6 CH₃COO⁻ ⇌ [Ca(OAc)₆]⁴⁻<br/>
                    <span className="text-red-300">7 zarrachadan → 1 zarracha</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-300">log K:</span>
                      <span className="text-white font-mono font-bold">≈ 2.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">ΔS:</span>
                      <span className="text-red-300 font-bold">Katta manfiy</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Barqarorlik:</span>
                      <span className="text-red-300">Juda past</span>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-950/50 rounded-2xl p-5 border-2 border-emerald-500/30">
                  <h3 className="text-emerald-400 font-bold mb-3">✅ 1 ta geksadentat EDTA ← Siz</h3>
                  <div className="bg-emerald-900/60 rounded-xl p-4 mb-4 font-mono text-xs text-emerald-200 border border-emerald-700/30">
                    Ca²⁺ + EDTA⁴⁻ ⇌ [Ca(EDTA)]²⁻<br/>
                    <span className="text-emerald-300">2 zarrachadan → 1 zarracha</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-300">log K:</span>
                      <span className="text-emerald-300 font-mono font-bold">10.7 ⭐</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">ΔS:</span>
                      <span className="text-emerald-300 font-bold">Musbat!</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Barqarorlik:</span>
                      <span className="text-emerald-300 font-bold">10⁸·⁷ marta ko'proq!</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-5 mt-6">
                <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                  <span>🎯</span> Entropiya hisoblash
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Monodentat:</strong> 7 zarracha → 1 zarracha → ΔS &lt; 0 (noqulay)</p>
                  <p>• <strong className="text-white">EDTA:</strong> 2 zarracha → 1 zarracha + 6 H₂O (erkin) → <strong className="text-yellow-300">ΔS &gt; 0</strong> (juda qulay!)</p>
                  <p className="text-yellow-300 mt-2">
                    <strong>6 ta suv molekulasi</strong> Ca²⁺ atrofidagi gidratatsiya qobig'idan ozod bo'ladi → katta entropiya yutuqi!
                  </p>
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
            <div className="bg-gradient-to-br from-purple-900/40 to-teal-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
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
                      ["Koordinatsion son", "6 (1 ta ligand!)"],
                      ["Ca−N masofa", "2.48 Å (2 ta)"],
                      ["Ca−O masofa", "2.40 Å (4 ta)"],
                      ["N−Ca−O", "≈ 72-85° (halqa cheklovi)"],
                      ["O−Ca−O", "≈ 68-95°"],
                      ["Simmetriya", "C₁ (past)"],
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-purple-800/30">
                        <span className="text-purple-300 text-sm">{item[0]}</span>
                        <span className="text-white font-semibold text-sm font-mono">{item[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-teal-400 font-bold text-sm uppercase tracking-wider">Muhim xususiyatlar</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <div className="bg-teal-950/50 rounded-xl p-4 border border-teal-700/30">
                      <p className="text-teal-300 font-bold text-xs mb-1">💎 Kapsula strukturasi</p>
                      <p className="text-xs">EDTA Ca²⁺ ni to'liq o'rab oladi — metall "kapsula ichida" joylashgan</p>
                    </div>
                    <div className="bg-teal-950/50 rounded-xl p-4 border border-teal-700/30">
                      <p className="text-teal-300 font-bold text-xs mb-1">🔗 Barcha 6 bog' bir liganddan</p>
                      <p className="text-xs">Bitta EDTA⁴⁻ molekulasi 6 ta koordinatsion joyni egallaydi</p>
                    </div>
                    <div className="bg-yellow-950/50 rounded-xl p-4 border border-yellow-700/30">
                      <p className="text-yellow-300 font-bold text-xs mb-1">⚡ Sterik to'liq qoplama</p>
                      <p className="text-xs">Boshqa ligandlar kirishi qiyin — juda barqaror</p>
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Elektron tuzilishi — d⁰ holat!</h2>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-yellow-400">Muhim:</strong> Ca²⁺ — <strong className="text-white">d⁰ konfiguratsiyali</strong> 
                  (d-elektronlar yo'q!). Shuning uchun:
                </p>
                <ul className="text-purple-200 text-sm mt-2 space-y-1 list-disc list-inside">
                  <li>❌ <strong>KMBE = 0</strong> (kristall maydon barqarorlashuv energiyasi yo'q)</li>
                  <li>❌ <strong>d-d o'tishlar yo'q</strong> → rangsiz kompleks</li>
                  <li>❌ <strong>Yuqori spin / past spin</strong> tushunchasi qo'llanilmaydi</li>
                  <li>✅ <strong>Bog'lanish asosan ionli</strong> (elektrostatik)</li>
                  <li>✅ <strong>Diamagnit</strong> (barcha elektronlar juftlashgan)</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-yellow-950/50 rounded-2xl p-5 border border-yellow-700/30 text-center">
                  <div className="text-4xl mb-2">🔵</div>
                  <div className="text-yellow-400 text-xs uppercase mb-1">Erkin Ca atomi</div>
                  <div className="text-white font-mono font-bold">[Ar] 4s²</div>
                  <div className="text-purple-300 text-xs mt-1">Z = 20</div>
                </div>
                <div className="bg-orange-950/50 rounded-2xl p-5 border border-orange-700/30 text-center">
                  <div className="text-4xl mb-2">🟡</div>
                  <div className="text-orange-400 text-xs uppercase mb-1">Ca²⁺ ioni</div>
                  <div className="text-white font-mono font-bold">[Ar] 3d⁰ 4s⁰</div>
                  <div className="text-purple-300 text-xs mt-1">d-elektron yo'q!</div>
                </div>
                <div className="bg-teal-950/50 rounded-2xl p-5 border border-teal-700/30 text-center">
                  <div className="text-4xl mb-2">⚪</div>
                  <div className="text-teal-400 text-xs uppercase mb-1">Kompleksda</div>
                  <div className="text-white font-mono font-bold">d⁰</div>
                  <div className="text-purple-300 text-xs mt-1">Ionli bog'lanish</div>
                </div>
              </div>
            </div>

            {/* BOG'LANISH TABIATI */}
            <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">
                  🔗
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Bog'lanish tabiati</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-950/50 rounded-xl p-5 border border-blue-700/30">
                  <h3 className="text-blue-400 font-bold mb-3">🎯 Bog'lanish turlari</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Ionli (elektrostatik):</strong> Ca²⁺ (+2) va EDTA⁴⁻ (−4) o'rtasida kuchli tortishish</p>
                    <p>• <strong className="text-white">Koordinatsion (donor-akseptor):</strong> 6 ta donor atomi (2N + 4O) → Ca²⁺ bo'sh orbitallariga</p>
                    <p>• <strong className="text-white">Chidamlilik:</strong> 5 ta xelat halqa qo'shimcha barqarorlik beradi</p>
                  </div>
                </div>

                <div className="bg-indigo-950/50 rounded-xl p-5 border border-indigo-700/30">
                  <h3 className="text-indigo-400 font-bold mb-3">⚡ HSAB nazariyasi bo'yicha</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Ca²⁺:</strong> qattiq kislota (hard acid) — kichik, yuqori zaryadli</p>
                    <p>• <strong className="text-white">EDTA⁴⁻:</strong> qattiq asos (hard base) — O va N donorlari</p>
                    <p>• <strong className="text-yellow-300">Qattiq + qattiq</strong> → <strong className="text-green-400">kuchli bog'lanish</strong></p>
                    <p>• Shuning uchun Ca-EDTA barqaror!</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* STABILITY TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "stability" && (
          <>
            <div className="bg-gradient-to-br from-purple-900/40 to-violet-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  ⚖️
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Barqarorlik konstantalari (log K)</h2>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500/10 to-violet-500/10 border border-purple-500/20 rounded-2xl p-5 mb-6">
                <h3 className="text-purple-400 font-bold mb-3 flex items-center gap-2">
                  <span>📊</span> Hozir tanlangan: {currentMetal.name}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-purple-950/60 rounded-xl p-4 border border-purple-700/30">
                    <div className="text-purple-300 text-xs">log K</div>
                    <div className={`text-2xl font-bold font-mono ${currentMetal.color}`}>{currentMetal.logK}</div>
                  </div>
                  <div className="bg-purple-950/60 rounded-xl p-4 border border-purple-700/30">
                    <div className="text-purple-300 text-xs">K</div>
                    <div className="text-white text-lg font-mono">10^{currentMetal.logK}</div>
                  </div>
                  <div className="bg-purple-950/60 rounded-xl p-4 border border-purple-700/30">
                    <div className="text-purple-300 text-xs">O'lcham</div>
                    <div className="text-white font-mono">{currentMetal.size}</div>
                  </div>
                  <div className="bg-purple-950/60 rounded-xl p-4 border border-purple-700/30">
                    <div className="text-purple-300 text-xs">d-elektronlar</div>
                    <div className="text-white font-mono">{currentMetal.dElectrons}</div>
                  </div>
                </div>
              </div>

              {/* TAQQOSLASH JADVALI */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-purple-950/60">
                    <tr>
                      <th className="py-3 px-4 text-purple-300 text-left">Kompleks</th>
                      <th className="py-3 px-4 text-purple-300 text-left">log K</th>
                      <th className="py-3 px-4 text-purple-300 text-left">Nisbiy barqarorlik</th>
                      <th className="py-3 px-4 text-purple-300 text-left">Ahamiyati</th>
                    </tr>
                  </thead>
                  <tbody className="text-purple-200">
                    {[
                      { metal: "Mg²⁺", logK: 8.7, rel: "10⁸·⁷", note: "Ca²⁺ dan kuchsizroq" },
                      { metal: "Ca²⁺ ⭐", logK: 10.7, rel: "10¹⁰·⁷", note: "Detoks agenti", highlight: true },
                      { metal: "Mn²⁺", logK: 13.8, rel: "10¹³·⁸", note: "Ca²⁺ dan kuchliroq" },
                      { metal: "Fe²⁺", logK: 14.3, rel: "10¹⁴·³", note: "Ca²⁺ dan kuchliroq" },
                      { metal: "Co²⁺", logK: 16.3, rel: "10¹⁶·³", note: "Ca²⁺ dan kuchliroq" },
                      { metal: "Cd²⁺", logK: 16.5, rel: "10¹⁶·⁵", note: "Zaharli metall" },
                      { metal: "Zn²⁺", logK: 16.5, rel: "10¹⁶·⁵", note: "Ca²⁺ dan kuchliroq" },
                      { metal: "Pb²⁺", logK: 18.0, rel: "10¹⁸·⁰", note: "Asosiy nishon!" },
                      { metal: "Cu²⁺", logK: 18.8, rel: "10¹⁸·⁸", note: "Ca²⁺ dan kuchliroq" },
                      { metal: "Hg²⁺", logK: 21.5, rel: "10²¹·⁵", note: "Eng kuchli!" },
                      { metal: "Fe³⁺", logK: 25.1, rel: "10²⁵·¹", note: "3 zaryadli" },
                    ].map((row, i) => (
                      <tr key={i} className={`border-b border-purple-800/30 ${row.highlight ? 'bg-teal-900/20' : ''}`}>
                        <td className={`py-3 px-4 font-mono ${row.highlight ? 'text-teal-300 font-bold' : 'text-white'}`}>{row.metal}</td>
                        <td className="py-3 px-4 font-mono text-yellow-300 font-bold">{row.logK}</td>
                        <td className="py-3 px-4 font-mono text-purple-300">{row.rel}</td>
                        <td className={`py-3 px-4 text-xs ${row.highlight ? 'text-teal-300' : 'text-purple-300'}`}>{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-gradient-to-r from-purple-500/10 to-violet-500/10 border border-purple-500/20 rounded-2xl p-5 mt-6">
                <h3 className="text-purple-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Irving-Williams qatori
                </h3>
                <p className="text-purple-200 text-sm">
                  2+ zaryadli metallar uchun barqarorlik qatori: 
                  <strong className="text-white"> Mn²⁺ &lt; Fe²⁺ &lt; Co²⁺ &lt; Ni²⁺ &lt; Cu²⁺ &gt; Zn²⁺</strong>
                </p>
                <p className="text-purple-300 text-xs mt-2">
                  Bu qator barcha xelat ligandlari uchun o'rinli — sababi ion radiusi va kristall maydon effektlari
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
            <div className="bg-gradient-to-br from-red-900/40 to-pink-900/40 border border-red-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-xl shadow-lg shadow-red-500/30">
                  📡
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Spektroskopik xususiyatlari</h2>
              </div>
              
              <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-2xl p-5 mb-6">
                <h3 className="text-red-400 font-bold mb-3 flex items-center gap-2">
                  <span>⚠️</span> Nima uchun rangsiz?
                </h3>
                <p className="text-purple-200 text-sm">
                  Ca²⁺ <strong className="text-yellow-300">d⁰ konfiguratsiyaga</strong> ega — d-elektronlar yo'q.
                  Shuning uchun <strong className="text-white">d-d o'tishlar</strong> bo'la olmaydi va 
                  <strong className="text-green-400"> kompleks rangsiz</strong> (ko'rinadigan nurni yutmaydi).
                </p>
              </div>

              <div className="space-y-3">
                <div className="bg-red-950/50 rounded-xl p-5 border border-red-700/30">
                  <h3 className="text-red-400 font-bold mb-3">🌈 UV-Vis spektroskopiya</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">d-d o'tishlar:</strong> <span className="text-red-300">yo'q</span> (d⁰ konfiguratsiya)</p>
                    <p>• <strong className="text-white">LMCT (ligand → metall):</strong> &lt; 200 nm (vakuum UB, kuzatish qiyin)</p>
                    <p>• <strong className="text-white">IL (ligand ichidagi):</strong> karboksilat π→π* o'tishi ~ 210 nm</p>
                    <p className="text-yellow-300 text-xs mt-2">
                      <strong>Natija:</strong> Kompleks <strong>rangsiz</strong> — ko'rinadigan sohada (400-700 nm) yutilish yo'q
                    </p>
                  </div>
                </div>

                <div className="bg-pink-950/50 rounded-xl p-5 border border-pink-700/30">
                  <h3 className="text-pink-400 font-bold mb-3">📡 IQ spektroskopiya</h3>
                  <div className="space-y-2">
                    {[
                      { freq: "3400-3000 cm⁻¹", bond: "ν(O−H)", desc: "Karboksilik OH (agar protonlangan)", intensity: "Keng, kuchli" },
                      { freq: "2950-2850 cm⁻¹", bond: "ν(C−H)", desc: "CH₂ valent tebranish", intensity: "O'rta" },
                      { freq: "1620-1580 cm⁻¹", bond: "νₐₛ(COO⁻)", desc: "Asimmetrik COO⁻ (KUCHLI)", intensity: "Juda kuchli" },
                      { freq: "1400-1330 cm⁻¹", bond: "νₛ(COO⁻)", desc: "Simmetrik COO⁻ (KUCHLI)", intensity: "Kuchli" },
                      { freq: "1100-1000 cm⁻¹", bond: "ν(C−N)", desc: "C-N valent", intensity: "O'rta" },
                      { freq: "500-400 cm⁻¹", bond: "ν(Ca−O)", desc: "Ca-O koordinatsion bog'", intensity: "Kuchsiz" },
                      { freq: "350-250 cm⁻¹", bond: "ν(Ca−N)", desc: "Ca-N koordinatsion bog'", intensity: "Kuchsiz" },
                    ].map((item, i) => (
                      <div key={i} className="bg-pink-900/40 rounded-lg p-3 border border-pink-700/30">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <span className="text-pink-400 font-mono font-bold text-sm">{item.freq}</span>
                              <span className="text-white font-bold">{item.bond}</span>
                            </div>
                            <p className="text-purple-300 text-xs mt-1">{item.desc}</p>
                          </div>
                          <span className="text-pink-300 text-xs px-2 py-1 bg-pink-900/40 rounded">{item.intensity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
                  <h3 className="text-purple-400 font-bold mb-3">🧲 NMR spektroskopiya</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">¹H NMR (D₂O):</strong></p>
                    <p className="pl-4">δ 3.1 ppm (s, 4H) — N-CH₂-COO⁻</p>
                    <p className="pl-4">δ 2.8 ppm (s, 4H) — N-CH₂-CH₂-N</p>
                    <p>• <strong className="text-white">¹³C NMR:</strong></p>
                    <p className="pl-4">δ 175 ppm (COO⁻)</p>
                    <p className="pl-4">δ 58 ppm (N-CH₂-COO⁻)</p>
                    <p className="pl-4">δ 52 ppm (N-CH₂-CH₂-N)</p>
                    <p>• <strong className="text-white">⁴³Ca NMR:</strong> δ 10-20 ppm (keng signal, I = 7/2)</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* MEDICAL TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "medical" && (
          <>
            <div className="bg-gradient-to-br from-teal-900/40 to-cyan-900/40 border border-teal-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-xl shadow-lg shadow-teal-500/30">
                  💊
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Tibbiy qo'llanilish — Chelatsion terapiya</h2>
              </div>
              
              <div className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/20 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-teal-400">CaNa₂EDTA</strong> (kalsiy dinatriy EDTA) — 
                  <strong className="text-white"> chelatsion terapiyaning asosiy dorisi</strong>.
                  U organizmdan <strong className="text-red-300">og'ir metallarni</strong> (Pb²⁺, Cd²⁺, Hg²⁺) 
                  chiqarish uchun ishlatiladi.
                </p>
              </div>

              {/* MEXANIZM */}
              <div className="bg-teal-950/50 rounded-2xl p-5 border border-teal-700/30 mb-6">
                <h3 className="text-teal-400 font-bold mb-3">⚗️ Detoksikatsiya mexanizmi</h3>
                <div className="bg-teal-900/60 rounded-xl p-4 font-mono text-sm text-teal-200 border border-teal-700/30 mb-4">
                  <p>[Ca(EDTA)]²⁻ + Pb²⁺ → <strong className="text-white">[Pb(EDTA)]²⁻</strong> + Ca²⁺</p>
                  <p className="text-teal-300 text-xs mt-2">
                    log K: 10.7 (Ca) → <strong className="text-white">18.0 (Pb)</strong> = 7.3 birlik farq = 2×10⁷ marta kuchliroq!
                  </p>
                </div>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>1️⃣ <strong className="text-white">CaNa₂EDTA</strong> qon tomiriga yuboriladi</p>
                  <p>2️⃣ Qonda <strong className="text-white">[Ca(EDTA)]²⁻</strong> hosil bo'ladi</p>
                  <p>3️⃣ Zaharli <strong className="text-red-300">Pb²⁺</strong> ionlari bilan to'qnashadi</p>
                  <p>4️⃣ Pb²⁺ ning log K <strong>kattaroq</strong> → Ca²⁺ ni siqib chiqaradi</p>
                  <p>5️⃣ <strong className="text-green-400">[Pb(EDTA)]²⁻</strong> barqaror kompleks hosil bo'ladi</p>
                  <p>6️⃣ Buyrak orqali siydik bilan chiqariladi</p>
                </div>
              </div>

              {/* QO'LLANILISH SOHALARI */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-950/50 rounded-xl p-5 border border-red-700/30">
                  <h3 className="text-red-400 font-bold mb-3">🎯 Asosiy nishonlar</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <div className="bg-red-900/40 rounded-lg p-3 border border-red-700/30">
                      <p className="text-red-300 font-bold text-xs">☠️ Qo'rg'oshin (Pb²⁺) zaharlanishi</p>
                      <p className="text-xs mt-1">Bolalar va sanoat ishchilari uchun eng keng tarqalgan</p>
                      <p className="text-red-300 text-xs mt-1 font-mono">log K = 18.0</p>
                    </div>
                    <div className="bg-orange-900/40 rounded-lg p-3 border border-orange-700/30">
                      <p className="text-orange-300 font-bold text-xs">☠️ Kadmiy (Cd²⁺) zaharlanishi</p>
                      <p className="text-xs mt-1">Batareya sanoati, sigaret tutuni</p>
                      <p className="text-orange-300 text-xs mt-1 font-mono">log K = 16.5</p>
                    </div>
                    <div className="bg-pink-900/40 rounded-lg p-3 border border-pink-700/30">
                      <p className="text-pink-300 font-bold text-xs">☠️ Simob (Hg²⁺) zaharlanishi</p>
                      <p className="text-xs mt-1">Termometrlar, baliq mahsulotlari</p>
                      <p className="text-pink-300 text-xs mt-1 font-mono">log K = 21.5</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-950/50 rounded-xl p-5 border border-green-700/30">
                  <h3 className="text-green-400 font-bold mb-3">⚕️ Qo'llash usullari</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <div className="bg-green-900/40 rounded-lg p-3 border border-green-700/30">
                      <p className="text-green-300 font-bold text-xs">💉 IV inyektsiya</p>
                      <p className="text-xs mt-1">1-2 g kuniga, 5 kun davomida</p>
                      <p className="text-green-300 text-xs mt-1">5% glyukoza yoki fiziologik eritma bilan</p>
                    </div>
                    <div className="bg-green-900/40 rounded-lg p-3 border border-green-700/30">
                      <p className="text-green-300 font-bold text-xs">📋 Dozalash</p>
                      <p className="text-xs mt-1">Kattalar: 50 mg/kg kuni</p>
                      <p className="text-green-300 text-xs mt-1">Bolalar: 25 mg/kg kuni</p>
                    </div>
                    <div className="bg-yellow-900/40 rounded-lg p-3 border border-yellow-700/30">
                      <p className="text-yellow-300 font-bold text-xs">⚠️ Ehtiyot choralar</p>
                      <p className="text-xs mt-1">Buyrak funksiyasini monitoring qilish</p>
                      <p className="text-yellow-300 text-xs mt-1">Mikroelementlar (Zn, Cu) yo'qotilishi mumkin</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* TARIX */}
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-5 mt-6">
                <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                  <span>📜</span> Tarixiy ma'lumot
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">1940-yillar:</strong> Chelatsion terapiya birinchi marta qo'llanilgan</p>
                  <p>• <strong className="text-white">Asl maqsad:</strong> Harbiy dengizchilarni qo'rg'oshin zaharlanishidan davolash</p>
                  <p>• <strong className="text-white">Bugungi kun:</strong> FDA tomonidan tasdiqlangan, 80+ yillik tajriba</p>
                  <p>• <strong className="text-white">Savdo nomlari:</strong> Versenate, Calcium Disodium Versenate</p>
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
                    <p>H₄EDTA + Ca(OH)₂ + 2 NaOH → Na₂[Ca(EDTA)] + 4 H₂O</p>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Bosqichlar:</strong></p>
                    <ol className="list-decimal list-inside space-y-1 pl-2 text-xs">
                      <li>EDTA kislotani suvda suspenziya qilish</li>
                      <li>Ca(OH)₂ qo'shish (kalsiy manbai)</li>
                      <li>NaOH bilan pH ni 7-8 ga ko'tarish</li>
                      <li>Aralashmani qizdirib, to'liq eritish</li>
                      <li>Sovutish, kristallizatsiya</li>
                      <li>Filtrlash, yuvish, quritish</li>
                    </ol>
                  </div>
                </div>

                <div className="bg-green-950/50 rounded-2xl p-5 border border-green-700/30">
                  <h3 className="text-green-400 font-bold mb-3">2-usul: Laboratoriya (kichik miqyos)</h3>
                  <div className="bg-green-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-green-300 border border-green-700/30">
                    <p>Na₂H₂EDTA + CaCl₂ → Na₂[Ca(EDTA)] + 2 HCl</p>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Qo'llash:</strong></p>
                    <ul className="list-disc list-inside space-y-1 pl-2 text-xs">
                      <li>Titratsiya orqali aniq miqdor olish mumkin</li>
                      <li>Analitik kimyoda standart eritma tayyorlash uchun</li>
                      <li>Kompleksometriya tajribalari</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-green-950/50 rounded-2xl p-5 border border-green-700/30">
                  <h3 className="text-green-400 font-bold mb-3">3-usul: To'g'ridan-to'g'ri aralashtirish</h3>
                  <div className="bg-green-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-green-300 border border-green-700/30">
                    <p>EDTA⁴⁻ + Ca²⁺ → [Ca(EDTA)]²⁻ &nbsp; (pH &gt; 10)</p>
                  </div>
                  <p className="text-purple-200 text-sm">
                    <strong className="text-white">Izoh:</strong> pH 10 dan yuqori bo'lganda EDTA to'liq deprotonlanadi 
                    (EDTA⁴⁻ shakli) va Ca²⁺ bilan <strong className="text-yellow-300">darhol</strong> kompleks hosil qiladi.
                    Reaksiya <strong className="text-green-400">soniyalarda</strong> tugaydi!
                  </p>
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
                  { step: "1", title: "Reagentlar", desc: "H₄EDTA (5.84 g, 20 mmol), Ca(OH)₂ (1.48 g, 20 mmol), NaOH (1.6 g, 40 mmol)" },
                  { step: "2", title: "Suspenziya", desc: "H₄EDTA ni 100 mL distillangan suvda suspenziya qilish" },
                  { step: "3", title: "Ca(OH)₂ qo'shish", desc: "Aralashtirib, Ca(OH)₂ qo'shish (oq cho'kma)" },
                  { step: "4", title: "NaOH qo'shish", desc: "NaOH eritmasini sekin qo'shib, pH 7-8 ga yetkazish" },
                  { step: "5", title: "Eritish", desc: "60-70°C da qizdirib, to'liq eritish (rangsiz eritma)" },
                  { step: "6", title: "Filtratsiya", desc: "Issiq eritmani filtrlash (agar noorganik aralashmalar bo'lsa)" },
                  { step: "7", title: "Kristallizatsiya", desc: "Sekin sovutish → rangsiz kristallar cho'kadi" },
                  { step: "8", title: "Yuvish va quritish", desc: "Sovuq etanol bilan yuvish, 60°C da quritish" },
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
                  <span>⚠️</span> Ehtiyot choralar
                </h3>
                <div className="space-y-1 text-sm text-purple-200">
                  <p>• <strong className="text-white">NaOH</strong> — kuchli asos, qo'lqop va ko'zoynak kiyish</p>
                  <p>• <strong className="text-white">H₄EDTA</strong> — kuchsiz kislota, lekin changi nafas yo'llarini qichishtiradi</p>
                  <p>• <strong className="text-white">pH monitoring</strong> — 7-8 oraliqda saqlash (juda yuqori bo'lsa Ca(OH)₂ cho'kadi)</p>
                </div>
              </div>
            </div>

            {/* KOMPLEKSOMETRIYA */}
            <div className="bg-gradient-to-br from-violet-900/40 to-purple-900/40 border border-violet-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-xl shadow-lg shadow-violet-500/30">
                  🧪
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Analitik qo'llanilish: Kompleksometriya</h2>
              </div>
              
              <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-2xl p-5">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-violet-400">EDTA titrlash</strong> — analitik kimyoda eng keng tarqalgan usul.
                  Ca²⁺, Mg²⁺ va boshqa metallarni <strong className="text-white">aniq miqdorini o'lchash</strong> uchun ishlatiladi.
                </p>
                <div className="space-y-2 text-sm text-purple-200 mt-3">
                  <p>• <strong className="text-white">Indikatorlar:</strong> Eriochrome Black T, Calcon</p>
                  <p>• <strong className="text-white">Qattiq suv tahlili:</strong> Ca²⁺ va Mg²⁺ miqdori</p>
                  <p>• <strong className="text-white">Tibbiy tahlillar:</strong> qondagi kalsiy darajasi</p>
                  <p>• <strong className="text-white">Oziq-ovqat sanoati:</strong> mineral moddalar miqdori</p>
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
              href="/ilmiy/birikmares/co-en2-cl2-cl"
              onClick={(e) => { e.preventDefault(); window.history.back(); }}
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold transition-all flex items-center gap-2"
            >
              <span>←</span>
              <span className="hidden sm:inline">[Co(en)₂Cl₂]Cl</span>
            </Link>
            <Link 
              href="/ilmiy/birikmares/creutz-taube"
              onClick={(e) => { e.preventDefault(); alert('Keyingi: Creutz-Taube ioni — mixed-valence klassikasi'); }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-bold transition-all shadow-lg shadow-teal-500/30 flex items-center gap-2"
            >
              <span className="hidden sm:inline">Creutz-Taube ioni</span>
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