"use client"

import Link from "next/link"
import { useState } from "react"

export default function CoNH35ClCl2() {
  const [activeTab, setActiveTab] = useState("overview")

  const tabs = [
    { id: "overview", label: "📋 Umumiy", icon: "📋" },
    { id: "structure", label: "🧬 Tuzilish", icon: "🧬" },
    { id: "electronic", label: "⚛️ Elektron", icon: "⚛️" },
    { id: "spectroscopy", label: "🔬 Spektroskopiya", icon: "🔬" },
    { id: "synthesis", label: "⚗️ Sintez", icon: "⚗️" },
    { id: "history", label: "🏆 Tarix", icon: "🏆" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0118] via-purple-950/50 to-slate-950 text-white relative overflow-hidden">
      
      {/* ═══ ANIMATED BACKGROUND ═══ */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(219,39,119,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(219,39,119,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        {['Co³⁺', 'NH₃', 'Cl⁻', 'C₄ᵥ', 't₂g⁶', 'd²sp³', 'Purpureo'].map((sym, i) => (
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
      <header className="relative z-20 border-b border-white/5 backdrop-blur-xl bg-black/20 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <nav className="flex items-center gap-2 text-xs mb-3 text-purple-400 flex-wrap">
            <Link href="/" className="hover:text-purple-300 transition-colors">🏠 Bosh sahifa</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy" className="hover:text-purple-300 transition-colors">Ilmiy bo'lim</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/birikmalar" className="hover:text-purple-300 transition-colors">Birikmalar bazasi</Link>
            <span className="text-purple-600">›</span>
            <span className="text-pink-400 font-semibold">[Co(NH₃)₅Cl]Cl₂</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-[10px] text-pink-300 font-bold uppercase tracking-wider">
                  💎 Purpureo-kobalt
                </span>
                <span className="px-2.5 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-[10px] text-yellow-300 font-semibold">
                  🏆 Werner klassikasi
                </span>
                <span className="px-2.5 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-[10px] text-green-300 font-semibold">
                  Inert
                </span>
                <span className="px-2.5 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-[10px] text-violet-300 font-semibold">
                  Ichki Cl⁻
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-violet-300 bg-clip-text text-transparent">
                [Co(NH₃)₅Cl]Cl₂
              </h1>
              <p className="text-purple-300 text-sm mt-1">
                Pentaamminklorokobalt(III) xlorid • Pentaamminechlorocobalt(III) chloride
              </p>
            </div>
            
            <div className="flex gap-2">
              <Link 
                href="/ilmiy/birikmalar/co-nh3-6-cl3"
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-semibold transition-all flex items-center gap-2"
              >
                <span>←</span>
                <span className="hidden sm:inline">[Co(NH₃)₆]Cl₃</span>
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
            { label: "Formula", value: "[Co(NH₃)₅Cl]Cl₂", icon: "🧪", color: "text-pink-400" },
            { label: "M massa", value: "250.44 g/mol", icon: "⚖️", color: "text-blue-400" },
            { label: "Geometriya", value: "Oktaedrik (C₄ᵥ)", icon: "💎", color: "text-purple-400" },
            { label: "Δₒ", value: "~23,500 cm⁻¹", icon: "⚡", color: "text-yellow-400" },
            { label: "Ionlar", value: "3 ion", icon: "⚡", color: "text-violet-400" },
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
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/30'
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
            <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-pink-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-xl shadow-lg shadow-pink-500/30">
                  📋
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Asosiy ma'lumotlar</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  ["CAS raqami", "14970-14-0"],
                  ["Zichlik", "1.82 g/cm³"],
                  ["Sistema", "Monoklinik"],
                  ["Fazoviy guruh", "P2₁/c"],
                  ["Eruvchanlik (H₂O)", "0.18 M (20°C)"],
                  ["Eruvchanlik (EtOH)", "Erimaydi"],
                  ["Barqarorlik", "Yuqori (inert)"],
                  ["Rangi", "Binafsha-qizil"],
                ].map((item, i) => (
                  <div key={i} className="bg-pink-950/50 rounded-xl p-3 border border-pink-700/30">
                    <div className="text-[10px] uppercase tracking-wider text-pink-400 font-semibold mb-1">{item[0]}</div>
                    <div className="text-white font-semibold text-sm">{item[1]}</div>
                  </div>
                ))}
              </div>

              {/* ICHKI/TASHQI SFERA */}
              <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-2xl p-5">
                <h3 className="text-pink-400 font-bold mb-3 flex items-center gap-2">
                  <span>💎</span> Ichki va tashqi sfera farqi
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-pink-900/30 rounded-xl p-4 border border-pink-700/30">
                    <h4 className="text-pink-300 font-bold text-sm mb-2">🔒 Ichki sfera [Co(NH₃)₅Cl]²⁺</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">Co³⁺</strong> — markaziy ion</li>
                      <li>• <strong className="text-white">5 × NH₃</strong> — ammiak ligandlari</li>
                      <li>• <strong className="text-white">1 × Cl⁻</strong> — xlor ligandi (mustahkam bog'langan)</li>
                      <li>• <strong className="text-yellow-300">Zaryad:</strong> +3 + 0 + (-1) = <strong>+2</strong></li>
                      <li>• AgNO₃ bilan <strong className="text-red-400">cho'kmaydi</strong> (sekin)</li>
                    </ul>
                  </div>
                  <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-700/30">
                    <h4 className="text-purple-300 font-bold text-sm mb-2">🔓 Tashqi sfera 2Cl⁻</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">2 × Cl⁻</strong> — counter-ionlar</li>
                      <li>• Ion bog'lar bilan bog'langan</li>
                      <li>• Suvda darhol dissotsilanadi</li>
                      <li>• AgNO₃ bilan <strong className="text-green-400">darhol cho'kadi</strong></li>
                      <li>• <strong className="text-yellow-300">AgCl</strong> oq cho'kma hosil qiladi</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* TAQQOSLASH */}
            <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">
                  ⚖️
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Werner seriyasida taqqoslash</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-blue-950/60">
                    <tr>
                      <th className="py-3 px-4 text-blue-400 text-left">Kompleks</th>
                      <th className="py-3 px-4 text-blue-400 text-left">Ionlar</th>
                      <th className="py-3 px-4 text-blue-400 text-left">Rang</th>
                      <th className="py-3 px-4 text-blue-400 text-left">AgCl cho'kma</th>
                      <th className="py-3 px-4 text-blue-400 text-left">Tarixiy nom</th>
                    </tr>
                  </thead>
                  <tbody className="text-purple-200">
                    <tr className="border-b border-blue-800/30">
                      <td className="py-3 px-4 font-mono text-blue-300">[Co(NH₃)₆]Cl₃</td>
                      <td className="py-3 px-4">4 ion</td>
                      <td className="py-3 px-4">Sariq</td>
                      <td className="py-3 px-4">3 mol AgCl</td>
                      <td className="py-3 px-4 text-yellow-300">Luteo</td>
                    </tr>
                    <tr className="border-b border-blue-800/30 bg-pink-900/20">
                      <td className="py-3 px-4 font-mono text-pink-300 font-bold">[Co(NH₃)₅Cl]Cl₂ ← Siz</td>
                      <td className="py-3 px-4 font-bold text-white">3 ion</td>
                      <td className="py-3 px-4">Binafsha</td>
                      <td className="py-3 px-4 font-bold">2 mol AgCl</td>
                      <td className="py-3 px-4 text-pink-300 font-bold">Purpureo</td>
                    </tr>
                    <tr className="border-b border-blue-800/30">
                      <td className="py-3 px-4 font-mono text-green-300">[Co(NH₃)₄Cl₂]Cl</td>
                      <td className="py-3 px-4">2 ion</td>
                      <td className="py-3 px-4">Yashil</td>
                      <td className="py-3 px-4">1 mol AgCl</td>
                      <td className="py-3 px-4 text-green-300">Praseo</td>
                    </tr>
                    <tr className="border-b border-blue-800/30">
                      <td className="py-3 px-4 font-mono text-purple-300">[Co(NH₃)₃Cl₃]</td>
                      <td className="py-3 px-4">0 ion</td>
                      <td className="py-3 px-4">Kulrang</td>
                      <td className="py-3 px-4">0 mol AgCl</td>
                      <td className="py-3 px-4 text-purple-300">Neytral</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-5 mt-4">
                <p className="text-purple-200 text-sm">
                  <strong className="text-yellow-400">Werner xulosasi:</strong> Har bir Cl⁻ ichki sferadan tashqi sferaga o'tganda, 
                  ionlar soni 1 taga kamayadi va AgNO₃ bilan cho'kma miqdori 1 mol ga pasayadi. 
                  Bu <strong className="text-white">koordinatsion sfera</strong> tushunchasining to'g'riligini isbotladi.
                </p>
              </div>
            </div>

            {/* XULOSA */}
            <div className="bg-gradient-to-r from-pink-600/10 via-purple-600/10 to-pink-600/10 border border-pink-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>✅</span> Asosiy xulosalar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "🔒 <strong>Ichki sfera:</strong> [Co(NH₃)₅Cl]²⁺ — Cl⁻ ligand",
                  "🔓 <strong>Tashqi sfera:</strong> 2 ta Cl⁻ counter-ionlar",
                  "⚡ <strong>3 ion:</strong> [Co(NH₃)₅Cl]²⁺ + 2Cl⁻",
                  "🧪 <strong>AgNO₃:</strong> 2 mol AgCl cho'kma (darhol)",
                  "💎 <strong>C₄ᵥ</strong> simmetriya (Oₕ emas — buzilgan)",
                  "🏆 Werner nazariyasining <strong>asosiy isboti</strong>",
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
            {/* GEOMETRIYA */}
            <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
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
                      ["Nuqtali guruh", "C₄ᵥ (taxminan)"],
                      ["Co−N masofa", "1.95 Å (5 ta)"],
                      ["Co−Cl masofa", "2.26 Å (uzunroq!)"],
                      ["N−Co−N (cis)", "≈ 90° (8 ta)"],
                      ["N−Co−N (trans)", "≈ 180° (2 ta)"],
                      ["Cl−Co−N", "≈ 90° (4 ta)"],
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-purple-800/30">
                        <span className="text-purple-300 text-sm">{item[0]}</span>
                        <span className="text-white font-semibold text-sm font-mono">{item[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-pink-400 font-bold text-sm uppercase tracking-wider">C₄ᵥ simmetriya elementlari</h3>
                  <div className="space-y-2">
                    {[
                      ["E", "Ayniylik (1 ta)"],
                      ["2C₄", "Asosiy o'q (Co−Cl) bo'ylab"],
                      ["C₂", "C₄ ning kvadrati"],
                      ["2σᵥ", "Cl va 2 ta N orqali"],
                      ["2σₐ", "4 ta N orqali (diagonal)"],
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-1.5 border-b border-pink-800/30">
                        <span className="text-pink-300 text-sm font-mono font-bold">{item[0]}</span>
                        <span className="text-purple-200 text-xs">{item[1]}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-pink-950/50 rounded-xl p-3 border border-pink-700/30">
                    <p className="text-pink-200 text-xs">
                      <strong className="text-pink-400">Eslatma:</strong> Oₕ (48 operatsiya) emas, chunki 1 ta Cl⁻ ligand simmetriyani buzadi.
                      C₄ᵥ guruhida <strong>8 ta</strong> simmetriya operatsiyasi bor.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* KRISTALL */}
            <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">
                  🔷
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Kristall tuzilishi</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  ["Sistema", "Monoklinik"],
                  ["Fazoviy guruh", "P2₁/c"],
                  ["Z", "4"],
                  ["a", "10.36 Å"],
                  ["b", "8.21 Å"],
                  ["c", "11.48 Å"],
                  ["β", "102.5°"],
                  ["V", "953 Å³"],
                ].map((item, i) => (
                  <div key={i} className="bg-blue-950/50 rounded-xl p-3 border border-blue-700/30 text-center">
                    <div className="text-[10px] uppercase tracking-wider text-blue-400 font-semibold">{item[0]}</div>
                    <div className="text-white font-bold font-mono text-sm">{item[1]}</div>
                  </div>
                ))}
              </div>

              <div className="bg-indigo-950/50 rounded-2xl p-5 border border-indigo-700/30">
                <h3 className="text-indigo-400 font-bold mb-3">Vodorod bog'lari</h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">N−H···Cl</strong> vodorod bog'lari kristallni mustahkamlaydi</p>
                  <p>• Har bir NH₃ guruhi tashqi Cl⁻ bilan H-bog' hosil qiladi</p>
                  <p>• <strong className="text-white">Ichki Cl⁻</strong> (Co ga bog'langan) ham H-bog' qabul qiladi, lekin kuchsiz</p>
                  <p>• <strong className="text-white">Trans-effekt:</strong> Cl⁻ qarama-qarshisidagi Co−N bog'i biroz uzunroq (1.97 Å)</p>
                </div>
              </div>
            </div>

            {/* TRANS-EFFEKT */}
            <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 border border-orange-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-xl shadow-lg shadow-orange-500/30">
                  ↔️
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Trans-effekt</h2>
              </div>
              
              <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-orange-400">Trans-effekt</strong> — bir ligandning qarama-qarshisidagi 
                  (trans pozitsiyadagi) ligandning bog'ini kuchsizlantirish qobiliyati. 
                  Cl⁻ kuchli trans-effektga ega — u o'zining trans-pozitsiyasidagi NH₃ ligandini 
                  labil qiladi (almashinishini osonlashtiradi).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-orange-950/50 rounded-xl p-4 border border-orange-700/30">
                  <h3 className="text-orange-400 font-bold mb-2">Trans-effekt qatori</h3>
                  <div className="text-purple-200 text-sm space-y-1 font-mono">
                    <p>CN⁻ ≈ CO ≈ C₂H₄ &gt; PR₃ &gt; H⁻ &gt;</p>
                    <p className="text-orange-300 font-bold">CH₃⁻ &gt; SC(NH₂)₂ &gt; <strong>Cl⁻</strong> &gt;</p>
                    <p>Br⁻ &gt; I⁻ &gt; NH₃ ≈ OH⁻ &gt; H₂O</p>
                  </div>
                </div>
                <div className="bg-red-950/50 rounded-xl p-4 border border-red-700/30">
                  <h3 className="text-red-400 font-bold mb-2">Amaliy natija</h3>
                  <div className="text-purple-200 text-sm space-y-1">
                    <p>• <strong className="text-white">Trans-NH₃</strong> (Cl⁻ ga qarama-qarshi):</p>
                    <p className="pl-3">Co−N = 1.97 Å (uzun)</p>
                    <p className="pl-3">Tezroq almashinadi</p>
                    <p>• <strong className="text-white">Cis-NH₃</strong> (yonidagi):</p>
                    <p className="pl-3">Co−N = 1.95 Å (normal)</p>
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
            {/* ELEKTRON KONFIGURATSIYA */}
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
                  <span>💡</span> Nega quyi spinli? (NH₃ + Cl⁻ aralash maydon)
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">NH₃</strong> — o'rta-kuchli maydonli ligand (spektrokimyoviy qatorda yuqori)</p>
                  <p>• <strong className="text-white">Cl⁻</strong> — kuchsiz maydonli ligand (pastda)</p>
                  <p>• 5 ta NH₃ + 1 ta Cl⁻ aralash maydon hosil qiladi</p>
                  <p>• <strong className="text-white">Co³⁺</strong> uchun o'rtacha Δₒ ≈ 23,500 cm⁻¹</p>
                  <p>• Juftlashuv energiyasi P ≈ 21,000 cm⁻¹</p>
                  <p>• <strong className="text-yellow-300">Δₒ &gt; P</strong> → <strong className="text-green-400">quyi spinli</strong> saqlanadi</p>
                </div>
              </div>
            </div>

            {/* d-ORBITAL DIAGRAMMA */}
            <div className="bg-gradient-to-br from-purple-900/40 to-violet-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  📊
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">d-orbital ajralishi (C₄ᵥ)</h2>
              </div>
              
              <div className="bg-purple-950/60 rounded-2xl p-6 border border-purple-700/30 mb-6">
                <p className="text-purple-300 text-xs mb-4">
                  <strong className="text-pink-400">Eslatma:</strong> C₄ᵥ simmetriya tufayli eg va t₂g sathlar 
                  yanada kichikroq ajralishga uchraydi (lekin soddalashtirilgan diagramma ko'rsatilgan).
                </p>
                <div className="flex items-center justify-center gap-8">
                  <div className="flex flex-col items-center">
                    <div className="text-purple-400 text-xs mb-2">E</div>
                    <div className="w-0.5 h-48 bg-gradient-to-t from-purple-600 to-purple-300 rounded-full"></div>
                  </div>
                  
                  <div className="flex-1 max-w-md space-y-8">
                    <div>
                      <div className="text-purple-400 text-xs mb-2 font-bold">eg (ajralgan: a₁ + b₁)</div>
                      <div className="flex justify-center gap-6">
                        <div className="flex flex-col items-center">
                          <div className="w-20 h-1 bg-purple-400 rounded"></div>
                          <div className="text-purple-300 text-xs mt-1">d<sub>z²</sub> (a₁)</div>
                          <div className="text-purple-500 text-xs">(bo'sh)</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-20 h-1 bg-purple-400 rounded"></div>
                          <div className="text-purple-300 text-xs mt-1">d<sub>x²-y²</sub> (b₁)</div>
                          <div className="text-purple-500 text-xs">(bo'sh)</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-0.5 border-t-2 border-dashed border-yellow-500"></div>
                      <div className="bg-yellow-500/20 px-3 py-1 rounded-lg border border-yellow-500/30">
                        <span className="text-yellow-400 font-bold font-mono text-sm">Δₒ ≈ 23,500 cm⁻¹</span>
                      </div>
                      <div className="flex-1 h-0.5 border-t-2 border-dashed border-yellow-500"></div>
                    </div>
                    
                    <div>
                      <div className="text-green-400 text-xs mb-2 font-bold">t₂g (ajralgan: b₂ + e)</div>
                      <div className="flex justify-center gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-1 bg-green-400 rounded"></div>
                          <div className="text-green-300 text-xs mt-1">d<sub>xy</sub> (b₂)</div>
                          <div className="text-green-500 text-xs">↑↓</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-1 bg-green-400 rounded"></div>
                          <div className="text-green-300 text-xs mt-1">d<sub>xz</sub> (e)</div>
                          <div className="text-green-500 text-xs">↑↓</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-1 bg-green-400 rounded"></div>
                          <div className="text-green-300 text-xs mt-1">d<sub>yz</sub> (e)</div>
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
                    <p className="text-xs text-purple-400">≈ −676 kJ/mol</p>
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

            {/* GIBRİDLANISH */}
            <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">
                  🔗
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Gibridlanish: d²sp³</h2>
              </div>
              
              <div className="bg-blue-950/50 rounded-xl p-5 border border-blue-700/30 space-y-2">
                <p className="text-purple-200 text-sm">• Co³⁺: <span className="font-mono text-white">[Ar] 3d⁶</span></p>
                <p className="text-purple-200 text-sm">• 6 ta ligand (5 NH₃ + 1 Cl⁻) → 6 ta elektron jufti</p>
                <p className="text-purple-200 text-sm">• <strong className="text-white">d²sp³</strong> gibridlanish:</p>
                <p className="text-purple-200 text-sm pl-4">- 2 ta 3d orbital (bo'sh, t₂g dan)</p>
                <p className="text-purple-200 text-sm pl-4">- 1 ta 4s orbital</p>
                <p className="text-purple-200 text-sm pl-4">- 3 ta 4p orbital</p>
                <p className="text-cyan-400 text-sm font-bold">→ 6 ta gibrid orbital = 6 ta σ-bog'</p>
                <div className="bg-blue-900/40 rounded-lg p-3 mt-3 border border-blue-700/30">
                  <p className="text-blue-300 text-xs">
                    <strong>Muhim:</strong> NH₃ (σ-donor) va Cl⁻ (σ-donor + π-donor) ligandlari bir xil 
                    d²sp³ gibrid orbitalarini ishlatadi. Cl⁻ ning π-donor xususiyati Δₒ ni biroz kamaytiradi.
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
            {/* UB-Vis */}
            <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-xl shadow-lg shadow-green-500/30">
                  🌈
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">UB-Vis spektroskopiya</h2>
              </div>
              
              <div className="bg-green-950/50 rounded-2xl p-5 border border-green-700/30 mb-6">
                <h3 className="text-green-400 font-bold mb-3">d-d o'tishlar</h3>
                <div className="space-y-3">
                  {[
                    {
                      transition: "¹A₁ → ¹T₁g (asosiy)",
                      wavelength: "530 nm",
                      energy: "18,870 cm⁻¹",
                      epsilon: "ε ≈ 60 L·mol⁻¹·cm⁻¹",
                      color: "Yashil-sariq yutiladi → Binafsha ko'rinadi"
                    },
                    {
                      transition: "¹A₁ → ¹T₂g",
                      wavelength: "365 nm",
                      energy: "27,400 cm⁻¹",
                      epsilon: "ε ≈ 50 L·mol⁻¹·cm⁻¹",
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
                          <div>
                            <div className="text-green-400 text-xs">Intensivlik</div>
                            <div className="text-white font-mono text-xs">{item.epsilon}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-5">
                <h3 className="text-green-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Nega binafsha rang?
                </h3>
                <p className="text-purple-200 text-sm">
                  [Co(NH₃)₅Cl]²⁺ <strong className="text-white">530 nm</strong> (yashil-sariq) nurni yutadi. 
                  Yutilgan nurning qo'shimcha rangi — <strong className="text-pink-300">binafsha-qizil</strong>. 
                  Shuning uchun kompleks binafsha rangda ko'rinadi (lotincha <em>"purpureo"</em> = binafsha).
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
                  { freq: "3300-3200 cm⁻¹", bond: "ν(N−H)", desc: "Valent tebranish (5 × NH₃)", intensity: "Kuchli, keng" },
                  { freq: "1620-1630 cm⁻¹", bond: "δ(H−N−H)", desc: "Egilish tebranishi", intensity: "O'rta" },
                  { freq: "1310-1330 cm⁻¹", bond: "ω(NH₃)", desc: "Wagging", intensity: "Kuchsiz" },
                  { freq: "820-840 cm⁻¹", bond: "ρ(NH₃)", desc: "Rocking", intensity: "O'rta" },
                  { freq: "490-495 cm⁻¹", bond: "ν(Co−N)", desc: "Metall-ligand (5 ta)", intensity: "O'rta" },
                  { freq: "330-340 cm⁻¹", bond: "ν(Co−Cl)", desc: "Metall-xlor (MUHIM!)", intensity: "Kuchli" },
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

              <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-2xl p-5 mt-6">
                <h3 className="text-red-400 font-bold mb-2 flex items-center gap-2">
                  <span>🎯</span> ν(Co−Cl) cho'qqisi — diagnostik ahamiyati
                </h3>
                <p className="text-purple-200 text-sm">
                  <strong className="text-white">ν(Co−Cl)</strong> cho'qqisi (330-340 cm⁻¹) [Co(NH₃)₅Cl]Cl₂ uchun 
                  <strong className="text-yellow-300"> asosiy diagnostik cho'qqi</strong>dir. U [Co(NH₃)₆]Cl₃ da 
                  ko'rinmaydi, shuning uchun bu ikki kompleksni IQ orqali oson ajratish mumkin.
                </p>
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
                      <span className="text-purple-300">δ (trans-NH₃)</span>
                      <span className="text-white font-mono">3.2 ppm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">δ (cis-NH₃)</span>
                      <span className="text-white font-mono">2.8 ppm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Nisbat</span>
                      <span className="text-white">1:4 (1 trans : 4 cis)</span>
                    </div>
                    <div className="bg-purple-900/40 rounded p-2 mt-2 border border-purple-700/30">
                      <p className="text-purple-300 text-xs">
                        <strong className="text-yellow-400">Eslatma:</strong> Trans-NH₃ Cl⁻ ga qarama-qarshi, 
                        cis-NH₃ lar yonma-yon. Trans-effekt tufayli ularning kimyoviy siljishi farq qiladi!
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-indigo-950/50 rounded-xl p-5 border border-indigo-700/30">
                  <h3 className="text-indigo-400 font-bold mb-2">⁵⁹Co NMR</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-300">δ</span>
                      <span className="text-white font-mono">≈ 7200 ppm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">vs [Co(NH₃)₆]³⁺</span>
                      <span className="text-white font-mono">≈ 8200 ppm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Farq (Δδ)</span>
                      <span className="text-yellow-400 font-mono">-1000 ppm</span>
                    </div>
                    <div className="bg-indigo-900/40 rounded p-2 mt-2 border border-indigo-700/30">
                      <p className="text-indigo-300 text-xs">
                        Cl⁻ ligandi kuchli elektron zichlik beradi (π-donor), 
                        shuning uchun ⁵⁹Co yadrosi ekranlangan bo'ladi (past δ).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* KINETIK */}
            <div className="bg-gradient-to-br from-orange-900/40 to-yellow-900/40 border border-orange-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center text-xl shadow-lg shadow-orange-500/30">
                  ⏱️
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Kinetik inertlik va Aquation</h2>
              </div>
              
              <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-2xl p-5 mb-6">
                <h3 className="text-orange-400 font-bold mb-3 flex items-center gap-2">
                  <span>💧</span> Aquation reaksiyasi (suv bilan almashinuv)
                </h3>
                <div className="bg-orange-900/60 rounded-xl p-4 font-mono text-sm text-orange-200 border border-orange-700/30 mb-3">
                  [Co(NH₃)₅Cl]²⁺ + H₂O → [Co(NH₃)₅(H₂O)]³⁺ + Cl⁻
                </div>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• Bu reaksiya <strong className="text-white">juda sekin</strong> — t₁/₂ ≈ bir necha soat (25°C da)</p>
                  <p>• <strong className="text-white">Kislotali sharoitda</strong> tezlashadi: H⁺ chiquvchi Cl⁻ ni protonlaydi</p>
                  <p>• <strong className="text-white">Hg²⁺ katalizatori</strong> bilan tezlashadi (Hg²⁺ Cl⁻ bilan bog'lanadi)</p>
                  <p>• Natija: [Co(NH₃)₅(H₂O)]³⁺ — <strong className="text-pink-300">Roseo-kobalt</strong> (pushti)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-orange-950/50 rounded-xl p-4 border border-orange-700/30 text-center">
                  <div className="text-3xl mb-2">🧪</div>
                  <div className="text-orange-400 text-xs uppercase mb-1">Boshlanish</div>
                  <div className="text-white font-bold">[Co(NH₃)₅Cl]²⁺</div>
                  <div className="text-pink-300 text-xs mt-1">Binafsha</div>
                </div>
                <div className="bg-yellow-950/50 rounded-xl p-4 border border-yellow-700/30 text-center">
                  <div className="text-3xl mb-2">⚡</div>
                  <div className="text-yellow-400 text-xs uppercase mb-1">O'tish holati</div>
                  <div className="text-white font-bold">5-koordinatsiyali</div>
                  <div className="text-purple-300 text-xs mt-1">t₁/₂ ≈ soat</div>
                </div>
                <div className="bg-pink-950/50 rounded-xl p-4 border border-pink-700/30 text-center">
                  <div className="text-3xl mb-2">💧</div>
                  <div className="text-pink-400 text-xs uppercase mb-1">Mahsulot</div>
                  <div className="text-white font-bold">[Co(NH₃)₅(H₂O)]³⁺</div>
                  <div className="text-pink-300 text-xs mt-1">Pushti (Roseo)</div>
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
            {/* SINTez */}
            <div className="bg-gradient-to-br from-green-900/40 to-teal-900/40 border border-green-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-xl shadow-lg shadow-green-500/30">
                  ⚗️
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Sintez usullari</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-green-950/50 rounded-2xl p-5 border border-green-700/30">
                  <h3 className="text-green-400 font-bold mb-3">1-usul: [Co(NH₃)₆]Cl₃ dan olish (eng keng tarqalgan)</h3>
                  <div className="bg-green-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-green-300 border border-green-700/30">
                    [Co(NH₃)₆]Cl₃ + HCl (kons.) → [Co(NH₃)₅Cl]Cl₂ + NH₄Cl
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Mexanizm:</strong> HCl qaynatilganda, bitta NH₃ ligandi Cl⁻ bilan almashinadi (aquation orqali)</p>
                    <p><strong className="text-white">Sharoit:</strong> 80-90°C da 1-2 soat qaynatish</p>
                    <p><strong className="text-white">Hosildorlik:</strong> ≈ 75-85%</p>
                  </div>
                </div>

                <div className="bg-green-950/50 rounded-2xl p-5 border border-green-700/30">
                  <h3 className="text-green-400 font-bold mb-3">2-usul: To'g'ridan-to'g'ri CoCl₂ dan</h3>
                  <div className="bg-green-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-green-300 border border-green-700/30">
                    2CoCl₂ + 2NH₄Cl + 8NH₃ + H₂O₂ → 2[Co(NH₃)₅Cl]Cl₂ + 2H₂O
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Mexanizm:</strong> Co²⁺ + NH₃ + Cl⁻ + H₂O₂ (oksidlovchi)</p>
                    <p><strong className="text-white">Katalizator:</strong> Faollangan ko'mir (ixtiyoriy)</p>
                    <p><strong className="text-white">Hosildorlik:</strong> ≈ 60-70%</p>
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
                  { step: "1", title: "Reagentlar", desc: "[Co(NH₃)₆]Cl₃ (10 g), konsentrlangan HCl (50 mL)" },
                  { step: "2", title: "Qaynatish", desc: "Aralashmani 80-90°C da 90 daqiqa qaynatish (reflux)" },
                  { step: "3", title: "Rang o'zgarishi", desc: "Zarg'aldoq → binafsha-qizil (monitoring)" },
                  { step: "4", title: "Sovutish", desc: "Xona haroratigacha sovutish, keyin muzli suvda" },
                  { step: "5", title: "Kristallizatsiya", desc: "Binafsha-qizil kristallar cho'kadi" },
                  { step: "6", title: "Filtratsiya", desc: "Büxner voronkasi orqali filtrlash" },
                  { step: "7", title: "Yuvish", desc: "Sovuq etanol bilan yuvish, havoda quritish" },
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
                  <span>🔍</span> Tozalikni tekshirish
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p><strong className="text-white">AgNO₃ testi:</strong> 1 mol [Co(NH₃)₅Cl]Cl₂ + 2AgNO₃ → 2AgCl↓ (darhol)</p>
                  <p><strong className="text-white">IQ spektr:</strong> ν(Co−Cl) cho'qqisi 330-340 cm⁻¹ da ko'rinadi</p>
                  <p><strong className="text-white">UV-Vis:</strong> λmax ≈ 530 nm</p>
                  <p><strong className="text-white">Elemental tahlil:</strong> Co, N, H, Cl foizlari</p>
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
            {/* VERNER ISBOTI */}
            <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border border-yellow-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-xl shadow-lg shadow-yellow-500/30">
                  🏆
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Werner nazariyasining isboti</h2>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-6 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-yellow-400">[Co(NH₃)₅Cl]Cl₂</strong> Werner koordinatsion nazariyasining 
                  <strong className="text-white"> eng muhim eksperimental isbotlaridan biri</strong>dir. 
                  Ushbu kompleks orqali Werner quyidagilarni isbotladi:
                </p>
                <ul className="space-y-2 mt-3 text-sm text-purple-200">
                  <li>• <strong className="text-white">Koordinatsion son</strong> 6 ga teng (Co³⁺ har doim 6 ta ligand bilan bog'lanadi)</li>
                  <li>• <strong className="text-white">Ichki va tashqi sfera</strong> farqlanadi (1 ta Cl ichki, 2 ta Cl tashqi)</li>
                  <li>• <strong className="text-white">Ionlar soni</strong> = 3 (kation + 2 anion)</li>
                  <li>• <strong className="text-white">Ligandlar almashinishi</strong> sekin (inert kompleks)</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-red-950/50 rounded-2xl p-5 border border-red-700/30">
                  <h3 className="text-red-400 font-bold mb-3">❌ Jørgensen (noto'g'ri)</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Zanjir nazariyasi:</strong></p>
                    <p className="font-mono text-xs text-red-300 bg-red-900/40 p-2 rounded">
                      Co−NH₃−NH₃−NH₃−NH₃−NH₃−Cl<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;Cl &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Cl
                    </p>
                    <p className="text-xs text-red-300">
                      Natija: 3 ta Cl⁻ ham tashqi sferada → 3 mol AgCl cho'kishi kerak
                    </p>
                  </div>
                </div>
                
                <div className="bg-green-950/50 rounded-2xl p-5 border border-green-700/30">
                  <h3 className="text-green-400 font-bold mb-3">✅ Werner (to'g'ri)</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Koordinatsion nazariya:</strong></p>
                    <p className="font-mono text-xs text-green-300 bg-green-900/40 p-2 rounded">
                      [Co(NH₃)₅Cl]²⁺ + 2Cl⁻
                    </p>
                    <p className="text-xs text-green-300">
                      Natija: 2 ta Cl⁻ tashqi sferada → 2 mol AgCl cho'kadi ✓
                    </p>
                    <p className="text-xs text-green-300 mt-2">
                      <strong className="text-white">Eksperimental tasdiq:</strong> AgNO₃ qo'shilganda 
                      aynan <strong>2 mol AgCl</strong> cho'kadi!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* AGNO₃ TESTI */}
            <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">
                  🧪
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">AgNO₃ cho'ktirish testi</h2>
              </div>
              
              <div className="bg-blue-950/50 rounded-2xl p-5 border border-blue-700/30 mb-6">
                <h3 className="text-blue-400 font-bold mb-3">Reaksiya</h3>
                <div className="bg-blue-900/60 rounded-xl p-4 font-mono text-sm text-blue-200 border border-blue-700/30">
                  [Co(NH₃)₅Cl]Cl₂ + 2AgNO₃ → [Co(NH₃)₅Cl](NO₃)₂ + <strong className="text-white">2AgCl↓</strong>
                </div>
                <p className="text-purple-200 text-sm mt-3">
                  <strong className="text-yellow-400">Eslatma:</strong> Ichki sferadagi Cl⁻ (Co ga bog'langan) 
                  AgNO₃ bilan <strong>darhol cho'kmaydi</strong>. Faqat tashqi sferadagi 2 ta Cl⁻ cho'kadi. 
                  Uzoq vaqt qaynatilsa, ichki Cl⁻ ham sekin almashinadi va qo'shimcha AgCl hosil bo'ladi.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-blue-950/60">
                    <tr>
                      <th className="py-3 px-4 text-blue-400 text-left">Kompleks</th>
                      <th className="py-3 px-4 text-blue-400 text-left">Tashqi Cl⁻</th>
                      <th className="py-3 px-4 text-blue-400 text-left">AgCl (darhol)</th>
                      <th className="py-3 px-4 text-blue-400 text-left">AgCl (qaynatilsa)</th>
                    </tr>
                  </thead>
                  <tbody className="text-purple-200">
                    <tr className="border-b border-blue-800/30">
                      <td className="py-3 px-4 font-mono">[Co(NH₃)₆]Cl₃</td>
                      <td className="py-3 px-4">3 ta</td>
                      <td className="py-3 px-4 text-yellow-300 font-bold">3 mol</td>
                      <td className="py-3 px-4">3 mol</td>
                    </tr>
                    <tr className="border-b border-blue-800/30 bg-pink-900/20">
                      <td className="py-3 px-4 font-mono text-pink-300 font-bold">[Co(NH₃)₅Cl]Cl₂</td>
                      <td className="py-3 px-4">2 ta</td>
                      <td className="py-3 px-4 text-yellow-300 font-bold">2 mol</td>
                      <td className="py-3 px-4 text-green-300">3 mol</td>
                    </tr>
                    <tr className="border-b border-blue-800/30">
                      <td className="py-3 px-4 font-mono">[Co(NH₃)₄Cl₂]Cl</td>
                      <td className="py-3 px-4">1 ta</td>
                      <td className="py-3 px-4 text-yellow-300 font-bold">1 mol</td>
                      <td className="py-3 px-4 text-green-300">3 mol</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono">[Co(NH₃)₃Cl₃]</td>
                      <td className="py-3 px-4">0 ta</td>
                      <td className="py-3 px-4 text-yellow-300 font-bold">0 mol</td>
                      <td className="py-3 px-4 text-green-300">3 mol</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* TARIXIY MILESTONELAR */}
            <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  📜
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Tarixiy xronologiya</h2>
              </div>
              
              <div className="space-y-3">
                {[
                  { year: "1890", title: "Jørgensen sintezi", desc: "Sophus Jørgensen birinchi bo'lib [Co(NH₃)₅Cl]Cl₂ ni sintez qildi, lekin noto'g'ri strukturani taklif qildi (zanjir nazariyasi)." },
                  { year: "1893", title: "Werner nazariyasi", desc: "Alfred Werner 27 yoshida koordinatsion nazariyani e'lon qildi va [Co(NH₃)₅Cl]Cl₂ ni [Co(NH₃)₅Cl]²⁺ + 2Cl⁻ deb to'g'ri tushuntirdi." },
                  { year: "1894", title: "Eksperimental tasdiq", desc: "Werner elektr o'tkazuvchanlik va AgNO₃ cho'ktirish tajribalari bilan nazariyani isbotladi." },
                  { year: "1907", title: "Optik ajratish", desc: "Werner va uning talabalari [Co(en)₂Cl₂]⁺ ning sis-izomerini optik izomerlarga ajratdi (C₂ simmetriya)." },
                  { year: "1913", title: "Nobel mukofoti", desc: "\"Kimyodagi xizmatlari uchun, ayniqsa molekulyar tuzilmalar bo'yicha tadqiqotlari uchun\" — noorganik kimyoda birinchi Nobel!" },
                ].map((item, i) => (
                  <div key={i} className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-black font-bold px-3 py-1 rounded-lg text-sm flex-shrink-0">
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

            {/* QO'LLANILISH */}
            <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-xl shadow-lg shadow-green-500/30">
                  💡
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Zamonaviy qo'llanilishi</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: "🎓", title: "Ta'lim", desc: "Koordinatsion kimyo darslarida Werner nazariyasini tushuntirish uchun klassik namuna sifatida ishlatiladi" },
                  { icon: "🔬", title: "Tadqiqot", desc: "Ligand almashinuv reaksiyalarini o'rganish uchun model kompleks" },
                  { icon: "⚗️", title: "Sintez prekursori", desc: "Boshqa Co³⁺ komplekslarni olish uchun boshlang'ich modda" },
                  { icon: "📊", title: "Spektroskopiya", desc: "IQ va UV-Vis spektroskopiya usullarini kalibrlash uchun standart" },
                ].map((item, i) => (
                  <div key={i} className="bg-green-950/50 rounded-xl p-5 border border-green-700/30">
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <h3 className="text-green-400 font-bold mb-1">{item.title}</h3>
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
              href="/ilmiy/birikmalar/co-nh3-6-cl3"
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold transition-all flex items-center gap-2"
            >
              <span>←</span>
              <span className="hidden sm:inline">[Co(NH₃)₆]Cl₃</span>
            </Link>
            <Link 
              href="/ilmiy/birikmalar/co-nh3-4-cl2-cl"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white font-bold transition-all shadow-lg shadow-pink-500/30 flex items-center gap-2"
            >
              <span className="hidden sm:inline">[Co(NH₃)₄Cl₂]Cl</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ ANIMATIONS ═══ */}
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