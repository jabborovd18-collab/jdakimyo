"use client"

import Link from "next/link"
import { useState } from "react"

export default function NiCO4() {
  const [activeTab, setActiveTab] = useState("overview")

  const tabs = [
    { id: "overview", label: "📋 Umumiy", icon: "📋" },
    { id: "safety", label: "☠️ Xavfsizlik", icon: "☠️" },
    { id: "structure", label: "🧬 Tetraedrik (Td)", icon: "🧬" },
    { id: "electronic", label: "⚛️ 18 elektron (d¹⁰)", icon: "⚛️" },
    { id: "bonding", label: "🔗 Ni−C≡O bog'lanish", icon: "🔗" },
    { id: "spectroscopy", label: "🔬 Spektroskopiya", icon: "🔬" },
    { id: "mond", label: "🏭 Mond jarayoni", icon: "🏭" },
    { id: "synthesis", label: "⚗️ Sintez", icon: "⚗️" },
    { id: "history", label: "🏆 Tarix", icon: "🏆" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white relative overflow-hidden">
      
      {/* ═══ ANIMATED BACKGROUND ═══ */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(16,185,129,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        {['Ni⁰', 'd¹⁰', '18 e⁻', 'Td', 'sp³', 'Mond 1890', 'CO', 'LC₅₀=7ppm', 'tetraedrik'].map((sym, i) => (
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
            <span className="text-emerald-400 font-semibold">[Ni(CO)₄]</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
                  🏆 Birinchi metall karbonil (1890)
                </span>
                <span className="px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-[10px] text-red-300 font-semibold">
                  ☠️ Juda zaharli (LC₅₀ = 7 ppm)
                </span>
                <span className="px-2.5 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-[10px] text-yellow-300 font-semibold">
                  ⚛️ 18 elektron qoidasi
                </span>
                <span className="px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-[10px] text-purple-300 font-semibold">
                  🏭 Mond jarayoni
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-300 bg-clip-text text-transparent">
                [Ni(CO)₄]
              </h1>
              <p className="text-purple-300 text-sm mt-1">
                Nikel tetrakarbonil • Nickel tetracarbonyl • Tetrakarbonilnikel(0)
              </p>
            </div>
            
            <div className="flex gap-2">
              <Link 
                href="/ilmiy/birikmalar/fe-co-5"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 hover:border-amber-400/60 text-amber-300 text-sm font-semibold transition-all flex items-center gap-2"
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
            { label: "Formula", value: "[Ni(CO)₄]", icon: "🧪", color: "text-emerald-400" },
            { label: "M massa", value: "170.73 g/mol", icon: "⚖️", color: "text-blue-400" },
            { label: "Geometriya", value: "Tetraedrik (Td)", icon: "💎", color: "text-purple-400" },
            { label: "Holati", value: "Rangsiz suyuqlik", icon: "🎨", color: "text-cyan-400" },
            { label: "Elektronlar", value: "18 e⁻ (qoida)", icon: "⚛️", color: "text-yellow-400" },
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
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30'
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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-xl shadow-lg shadow-emerald-500/30">
                  📋
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Asosiy ma'lumotlar</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  ["CAS raqami", "13463-39-3"],
                  ["Zichlik", "1.318 g/cm³ (22°C)"],
                  ["Qaynash harorati", "43°C"],
                  ["Suyuqlanish harorati", "-19.3°C"],
                  ["Bug' bosimi", "390 mm Hg (22°C)"],
                  ["Dipol moment", "0 D (Td simmetrik)"],
                  ["Simmetriya", "Td (tetraedrik)"],
                  ["Rangi", "Rangsiz"],
                ].map((item, i) => (
                  <div key={i} className="bg-emerald-950/50 rounded-xl p-3 border border-emerald-700/30">
                    <div className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold mb-1">{item[0]}</div>
                    <div className="text-white font-semibold text-sm">{item[1]}</div>
                  </div>
                ))}
              </div>

              {/* ZAHARLIK OGOHLANTIRISH */}
              <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-2 border-red-500/40 rounded-2xl p-5">
                <h3 className="text-red-400 font-bold mb-3 flex items-center gap-2">
                  <span>☠️</span> JUDA ZAHARLI! — Eng yuqori darajadagi xavf
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-red-900/30 rounded-xl p-4 border border-red-700/30">
                    <h4 className="text-red-300 font-bold text-sm mb-2">⚠️ Toksiklik</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">TLV-TWA:</strong> 0.05 ppm (0.12 mg/m³)</li>
                      <li>• <strong className="text-white">LC₅₀:</strong> 7 ppm/30min (kalamush) — juda past!</li>
                      <li>• <strong className="text-white">Ta'sir mexanizmi:</strong> CO ajralib chiqadi → gemoglobin bilan bog'lanadi</li>
                      <li>• <strong className="text-white">Ni²⁺:</strong> kanserogen (IARC Group 1)</li>
                      <li>• <strong className="text-red-300">Himoya:</strong> To'liq himoya kiyimi, respirator</li>
                    </ul>
                  </div>
                  <div className="bg-orange-900/30 rounded-xl p-4 border border-orange-700/30">
                    <h4 className="text-orange-300 font-bold text-sm mb-2">🔥 Fizik xavflar</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">Juda yonuvchan:</strong> alangalanish harorati -22°C</li>
                      <li>• <strong className="text-white">Bug'lari:</strong> havodan og'ir (5.9×), pastga yig'iladi</li>
                      <li>• <strong className="text-white">Portlash:</strong> havo bilan portlovchi aralashma</li>
                      <li>• <strong className="text-white">Parchalanish:</strong> Ni + 4CO (60°C+ da)</li>
                      <li>• <strong className="text-white">Saqlash:</strong> inert atmosferada, sovuq</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* XULOSA */}
            <div className="bg-gradient-to-r from-emerald-600/10 via-teal-600/10 to-cyan-600/10 border border-emerald-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>✅</span> Asosiy xulosalar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "💎 <strong>Tetraedrik geometriya:</strong> Td simmetriya, 4 ta ekvivalent CO",
                  "⚛️ <strong>18 elektron:</strong> Ni⁰ (d¹⁰) + 4×2 = 18 → juda barqaror",
                  "🔗 <strong>Sinergik bog'lanish:</strong> σ-donatsiya + π-backbonding",
                  "🏭 <strong>Mond jarayoni:</strong> Ni tozalash (99.99% sof nikel)",
                  "🔬 <strong>FTIR:</strong> bitta cho'qqi (2057 cm⁻¹) — Td simmetriya",
                  "☠️ <strong>Juda zaharli:</strong> LC₅₀ = 7 ppm — eng xavfli metall karbonil",
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
        {/* SAFETY TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "safety" && (
          <>
            <div className="bg-gradient-to-br from-red-900/40 to-orange-900/40 border-2 border-red-500/40 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-xl shadow-lg shadow-red-500/30">
                  ☠️
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Xavfsizlik — Eng yuqori darajadagi ogohlantirish</h2>
              </div>
              
              <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-red-400">[Ni(CO)₄]</strong> — bu 
                  <strong className="text-white"> eng zaharli metall karbonillardan biri</strong>.
                  Uning zaharliligi <strong className="text-yellow-300">ikki mexanizm</strong> bilan bog'liq:
                  (1) <strong className="text-white">CO ajralib chiqishi</strong> (gemoglobin bilan bog'lanadi → gipoksiya),
                  (2) <strong className="text-white">Ni²⁺ ning hujayralarga kirishi</strong> (fermentlarni ingibitsiya qiladi, DNK shikastlaydi).
                  <strong className="text-red-300"> O'lim xavfi yuqori</strong> — hatto past konsentratsiyalarda ham!
                </p>
              </div>

              {/* TOKSIKLIK JADVALI */}
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead className="bg-red-950/60">
                    <tr>
                      <th className="py-3 px-4 text-red-300 text-left">Parametr</th>
                      <th className="py-3 px-4 text-red-300 text-left">Qiymat</th>
                      <th className="py-3 px-4 text-red-300 text-left">Xavf darajasi</th>
                    </tr>
                  </thead>
                  <tbody className="text-purple-200">
                    <tr className="border-b border-red-800/30 bg-red-900/20">
                      <td className="py-3 px-4 font-bold">LC₅₀ (kalamush, 30 min)</td>
                      <td className="py-3 px-4 font-mono text-red-300 font-bold">7 ppm</td>
                      <td className="py-3 px-4 text-red-300 font-bold">☠️ Juda zaharli</td>
                    </tr>
                    <tr className="border-b border-red-800/30 bg-red-900/20">
                      <td className="py-3 px-4 font-bold">TLV-TWA (8 soat)</td>
                      <td className="py-3 px-4 font-mono text-red-300">0.05 ppm</td>
                      <td className="py-3 px-4 text-red-300">☠️ Juda past limit</td>
                    </tr>
                    <tr className="border-b border-red-800/30">
                      <td className="py-3 px-4">IDLH (darhol xavfli)</td>
                      <td className="py-3 px-4 font-mono">2 ppm</td>
                      <td className="py-3 px-4 text-orange-300">⚠️ O'lim xavfi</td>
                    </tr>
                    <tr className="border-b border-red-800/30">
                      <td className="py-3 px-4">Alangalanish harorati</td>
                      <td className="py-3 px-4 font-mono">-22°C</td>
                      <td className="py-3 px-4 text-orange-300">🔥 Juda yonuvchan</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">IARC tasnifi</td>
                      <td className="py-3 px-4 font-mono">Group 1</td>
                      <td className="py-3 px-4 text-red-300">☠️ Kanserogen</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* TA'SIR MEXANIZMI */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-red-950/50 rounded-xl p-5 border border-red-700/30">
                  <h3 className="text-red-400 font-bold mb-3">1️⃣ CO ta'siri</h3>
                  <div className="bg-red-900/40 rounded-lg p-3 font-mono text-xs text-red-200 border border-red-700/30 mb-3">
                    [Ni(CO)₄] → Ni + 4 CO<br/>
                    CO + Hemoglobin → Karboksigemoglobin
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• CO gemoglobin bilan <strong className="text-white">O₂ dan 200× kuchliroq</strong> bog'lanadi</p>
                    <p>• Natija: <strong className="text-red-300">to'qimalar gipoksiyasi</strong></p>
                    <p>• Belgilar: bosh og'rig'i, ko'ngil aynishi, hushsizlik</p>
                  </div>
                </div>

                <div className="bg-orange-950/50 rounded-xl p-5 border border-orange-700/30">
                  <h3 className="text-orange-400 font-bold mb-3">2️⃣ Ni²⁺ ta'siri</h3>
                  <div className="bg-orange-900/40 rounded-lg p-3 font-mono text-xs text-orange-200 border border-orange-700/30 mb-3">
                    Ni²⁺ + Fermentlar → Ingibitsiya<br/>
                    Ni²⁺ + DNK → Shikastlanish
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• Ni²⁺ <strong className="text-white">tiol guruhlar</strong> (-SH) bilan bog'lanadi</p>
                    <p>• Fermentlar faoliyati to'xtaydi</p>
                    <p>• <strong className="text-red-300">DNK shikastlanishi</strong> → mutatsiyalar, saraton</p>
                  </div>
                </div>
              </div>

              {/* HIMOYA CHORALARI */}
              <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-2 border-red-500/30 rounded-2xl p-5">
                <h3 className="text-red-400 font-bold mb-3 flex items-center gap-2">
                  <span>🛡️</span> Himoya choralari (majburiy!)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-red-900/40 rounded-lg p-3 border border-red-700/30">
                    <p className="text-red-300 font-bold text-xs mb-1">😷 Respirator</p>
                    <p className="text-xs text-purple-200">To'liq yuz niqobi, CO filtri</p>
                  </div>
                  <div className="bg-red-900/40 rounded-lg p-3 border border-red-700/30">
                    <p className="text-red-300 font-bold text-xs mb-1">🧤 Qo'lqop</p>
                    <p className="text-xs text-purple-200">Butyl kauchuk, ikki qatlam</p>
                  </div>
                  <div className="bg-red-900/40 rounded-lg p-3 border border-red-700/30">
                    <p className="text-red-300 font-bold text-xs mb-1">🏭 Shkaf</p>
                    <p className="text-xs text-purple-200">Faqat inert atmosfera ostida</p>
                  </div>
                </div>
              </div>
            </div>

            {/* TARIXIY FALOKATLAR */}
            <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  📜
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Tarixiy falokatlar</h2>
              </div>
              
              <div className="space-y-3">
                {[
                  { year: "1890", event: "Mond'ning laboranti", desc: "Ludwig Mond'ning yordamchisi birinchi marta [Ni(CO)₄] sintezi paytida zaharlandi — bosh og'rig'i, ko'ngil aynishi" },
                  { year: "1930-yillar", event: "Sanoat falokatlari", desc: "Mond jarayoni zavodlarida bir necha ishchi halok bo'ldi" },
                  { year: "1950+", event: "Kanserogenlik aniqlandi", desc: "Ni refineries ishchilarida o'pka va burun saratoni ko'payishi kuzatildi" },
                  { year: "Bugun", event: "Qattiq nazorat", desc: "Zamonaviy zavodlarda to'liq avtomatlashtirilgan — inson aralashuvi minimal" },
                ].map((item, i) => (
                  <div key={i} className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-to-br from-red-500 to-orange-500 text-white font-bold px-3 py-1 rounded-lg text-sm flex-shrink-0">
                        {item.year}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-red-300 font-bold mb-1">{item.event}</h3>
                        <p className="text-purple-200 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  </div>
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
                  💎
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Tetraedrik geometriya (Td)</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-purple-400 font-bold text-sm uppercase tracking-wider">Geometrik parametrlar</h3>
                  <div className="space-y-2">
                    {[
                      ["Geometriya", "Tetraedrik"],
                      ["Nuqtali guruh", "Td"],
                      ["Koordinatsion son", "4"],
                      ["Ni−C masofa", "1.82 Å (4 ta, ekvivalent)"],
                      ["C−O masofa", "1.14 Å (barcha)"],
                      ["C−Ni−C burchak", "109.5° (ideal)"],
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
                  <h3 className="text-emerald-400 font-bold text-sm uppercase tracking-wider">Td simmetriya elementlari</h3>
                  <div className="space-y-2">
                    {[
                      ["E", "Ayniylik"],
                      ["8C₃", "4 ta C₃ o'qi (har biri 120°, 240°)"],
                      ["3C₂", "3 ta C₂ o'qi (x, y, z)"],
                      ["6S₄", "Notekis aylanish (90°)"],
                      ["6σₐ", "Diagonal tekisliklar"],
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-1.5 border-b border-emerald-800/30">
                        <span className="text-emerald-300 text-sm font-mono font-bold">{item[0]}</span>
                        <span className="text-purple-200 text-xs">{item[1]}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-emerald-950/50 rounded-xl p-3 border border-emerald-700/30 mt-3">
                    <p className="text-emerald-200 text-xs">
                      <strong className="text-emerald-400">Jami:</strong> 24 ta simmetriya operatsiyasi.
                      <strong className="text-yellow-300"> σₕ va i yo'q</strong> — lekin σₐ bor, shuning uchun <strong>axiral</strong> (optik faol emas).
                      <strong className="text-white"> Barcha 4 ta CO ekvivalent</strong> — FTIR da bitta cho'qqi!
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Tetraedrik struktura</h2>
              </div>
              
              <div className="bg-amber-950/60 rounded-xl p-5 font-mono text-sm text-amber-200 border border-amber-700/30 mb-6 text-center">
                <pre className="whitespace-pre">{`            CO
            |
            Ni
          / | \\
        CO  CO  CO

   Tetraedrik: Ni markazda, 4 ta CO uchlarida
   C−Ni−C = 109.5° (ideal tetraedr burchagi)
   
   Barcha 4 ta Ni−C bog' ekvivalent (1.82 Å)
   Barcha 4 ta C−O bog' ekvivalent (1.14 Å)`}</pre>
              </div>

              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-5">
                <h3 className="text-amber-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Nega tetraedrik (kvadrat-tekis emas)?
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Ni⁰ = d¹⁰ konfiguratsiya</strong> — barcha d-orbitallar to'lgan</p>
                  <p>• <strong className="text-yellow-300">Kristall maydon barqarorlashuv energiyasi (KMBE) = 0</strong></p>
                  <p>• Shuning uchun <strong className="text-white">sterik omil hal qiluvchi</strong> — 4 ta katta CO ligandi bir-biridan uzoqroq bo'lishi kerak</p>
                  <p>• Tetraedrda burchak <strong className="text-amber-300">109.5°</strong> (kvadrat-tekisda 90°) — <strong className="text-green-400">kamroq sterik to'siq</strong></p>
                  <p className="text-xs text-purple-400 mt-2">
                    <strong className="text-pink-300">Taqqoslash:</strong> d⁸ metallari (Pt²⁺, Pd²⁺, Ni²⁺) kvadrat-tekis, 
                    lekin <strong className="text-white">d¹⁰ (Ni⁰, Pd⁰, Pt⁰)</strong> deyarli har doim <strong>tetraedrik</strong>.
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
                  <strong className="text-emerald-400">18 elektron qoidasi</strong> — organometallik kimyoning 
                  <strong className="text-white"> asosiy qoidasi</strong>. Metallning valent elektronlari va 
                  ligandlardan kelgan elektronlar yig'indisi <strong className="text-yellow-300">18 ga teng</strong> bo'lsa,
                  kompleks <strong className="text-white">juda barqaror</strong> bo'ladi (inert gaz konfiguratsiyasi — [Kr]).
                </p>
              </div>

              {/* ELEKTRON HISOB */}
              <div className="bg-emerald-950/50 rounded-2xl p-6 border border-emerald-700/30 mb-6">
                <h3 className="text-emerald-400 font-bold mb-4">[Ni(CO)₄] uchun elektron hisobi</h3>
                <div className="space-y-3">
                  <div className="bg-emerald-900/40 rounded-xl p-4 border border-emerald-700/30 flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold">Ni⁰ (nikel)</div>
                      <div className="text-purple-300 text-xs mt-1">
                        Konfiguratsiya: [Ar] 3d⁸ 4s² → 10 ta valent elektron
                      </div>
                    </div>
                    <div className="text-emerald-300 text-2xl font-bold font-mono">10 e⁻</div>
                  </div>
                  <div className="bg-emerald-900/40 rounded-xl p-4 border border-emerald-700/30 flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold">4 × CO</div>
                      <div className="text-purple-300 text-xs mt-1">
                        Har bir CO 2 ta elektron beradi (σ-donor)
                      </div>
                    </div>
                    <div className="text-emerald-300 text-2xl font-bold font-mono">4 × 2 = 8 e⁻</div>
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
                  <div className="text-purple-400 text-xs uppercase mb-1">Erkin Ni atomi</div>
                  <div className="text-white font-mono font-bold">[Ar] 3d⁸ 4s²</div>
                  <div className="text-purple-300 text-xs mt-1">Z = 28</div>
                </div>
                <div className="bg-amber-950/50 rounded-xl p-5 border border-amber-700/30 text-center">
                  <div className="text-4xl mb-2">🟡</div>
                  <div className="text-amber-400 text-xs uppercase mb-1">Ni⁰ (formal)</div>
                  <div className="text-white font-mono font-bold">[Ar] 3d¹⁰</div>
                  <div className="text-purple-300 text-xs mt-1">10 valent e⁻</div>
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Gibridlanish: sp³</h2>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-5">
                <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                  <span>💡</span> Tetraedrik geometriya uchun sp³ gibridlanish
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">1 ta 4s orbital</strong></p>
                  <p>• <strong className="text-white">3 ta 4p orbital</strong> (p<sub>x</sub>, p<sub>y</sub>, p<sub>z</sub>)</p>
                  <p>• <strong className="text-yellow-300">Jami:</strong> 4 ta sp³ gibrid orbital → 4 ta σ-bog'</p>
                  <p>• <strong className="text-white">Burchak:</strong> 109.5° (ideal tetraedr)</p>
                  <p className="text-xs text-purple-400 mt-2">
                    Qolgan 10 ta d-elektron <strong className="text-white">to'liq to'lgan</strong> 
                    (5 ta to'liq orbital) → <strong className="text-green-400">diamagnit</strong>. μ_eff = 0 BM.
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Ni−C≡O bog'lanish mexanizmi (sinergik)</h2>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-purple-400">CO ligandi</strong> — <strong className="text-white">sinergik bog'lanish</strong>ning 
                  klassik namunasi. U ikki yo'nalishda ishlaydi:
                  <strong className="text-yellow-300"> σ-donatsiya</strong> (CO → Ni) va 
                  <strong className="text-pink-300"> π-backbonding</strong> (Ni → CO).
                  [Ni(CO)₄] da <strong className="text-white">π-backbonding juda kuchli</strong> — chunki Ni⁰ (d¹⁰) da 
                  to'lgan d-orbitallar ko'p, bu esa <strong>C−O bog'ini sezilarli darajada kuchsizlantiradi</strong>.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
                  <h3 className="text-purple-400 font-bold mb-3">1️⃣ σ-donatsiya (CO → Ni)</h3>
                  <div className="bg-purple-900/40 rounded-lg p-4 font-mono text-xs text-purple-200 border border-purple-700/30 mb-3">
                    <pre className="whitespace-pre">{`  C≡O: → Ni
  (lone pair)
  
  CO ning HOMO (5σ) orbitali
  Ni ning bo'sh sp³ orbitaliga
  elektron juftini beradi`}</pre>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">CO ning 5σ orbitali</strong> — C atomida joylashgan</p>
                    <p>• <strong className="text-white">Ni ning sp³</strong> gibrid orbitaliga donatsiya</p>
                    <p>• Natija: <strong className="text-purple-300">Ni−C σ-bog'</strong> hosil bo'ladi</p>
                  </div>
                </div>

                <div className="bg-pink-950/50 rounded-xl p-5 border border-pink-700/30">
                  <h3 className="text-pink-400 font-bold mb-3">2️⃣ π-backbonding (Ni → CO)</h3>
                  <div className="bg-pink-900/40 rounded-lg p-4 font-mono text-xs text-pink-200 border border-pink-700/30 mb-3">
                    <pre className="whitespace-pre">{`  Ni → C≡O
  (d-elektron)
  
  Ni ning to'lgan d-orbitali
  CO ning bo'sh 2π* orbitaliga
  elektron qaytaradi`}</pre>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Ni ning to'lgan d-orbitallari</strong> (3d¹⁰)</p>
                    <p>• <strong className="text-white">CO ning 2π* orbitaliga</strong> (LUMO) donatsiya</p>
                    <p>• Natija: <strong className="text-pink-300">Ni−C π-bog'</strong> + C−O kuchsizlanadi</p>
                  </div>
                </div>
              </div>

              {/* SINERGIYA */}
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 rounded-2xl p-5">
                <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                  <span>⚡</span> [Ni(CO)₄] da π-backbonding juda kuchli!
                </h3>
                <div className="bg-yellow-950/50 rounded-xl p-4 border border-yellow-700/30 mb-4">
                  <div className="font-mono text-sm text-yellow-200 text-center">
                    <p>Ni⁰ (d¹⁰) → 10 ta d-elektron → <strong>kuchli π-donor</strong></p>
                    <p className="mt-2">π-backbonding ↑ → Fe−C bog' <strong>kuchayadi</strong></p>
                    <p className="mt-1">π-backbonding ↑ → C−O bog' <strong>kuchsizlanadi</strong></p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Erkin CO:</strong> ν(CO) = 2143 cm⁻¹</p>
                  <p>• <strong className="text-white">[Ni(CO)₄] da:</strong> ν(CO) = <strong className="text-pink-300">2057 cm⁻¹</strong> (86 cm⁻¹ ga pasaygan!)</p>
                  <p>• <strong className="text-white">C−O masofa:</strong> 1.128 Å (erkin CO) → <strong className="text-pink-300">1.14 Å</strong> (uzaygan)</p>
                  <p className="text-xs text-purple-400 mt-2">
                    Bu pasayish <strong className="text-white">[Fe(CO)₅]</strong>ga qaraganda kamroq 
                    (Fe: 2022/2000 cm⁻¹) — chunki Fe⁰ (d⁸) kamroq d-elektrong ega.
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
                <h2 className="text-xl md:text-2xl font-bold text-white">FTIR spektroskopiya — bitta cho'qqi!</h2>
              </div>
              
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-green-400">[Ni(CO)₄]</strong> FTIR spektri juda sodda — 
                  <strong className="text-yellow-300"> faqat 1 ta ν(CO) cho'qqisi</strong> kuzatiladi (2057 cm⁻¹).
                  Sababi: <strong className="text-white">Td simmetriya</strong> — barcha 4 ta CO ligandi 
                  <strong className="text-pink-300"> ekvivalent</strong>. Bu tetraedrik geometriyaning 
                  <strong className="text-white"> eng kuchli spektroskopik isboti</strong>.
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
                    <tr className="border-b border-purple-800/30 bg-emerald-900/20">
                      <td className="py-3 px-4 font-mono font-bold text-emerald-300">2057</td>
                      <td className="py-3 px-4">ν(CO) — T₂ simmetriya</td>
                      <td className="py-3 px-4">Juda kuchli</td>
                      <td className="py-3 px-4 text-xs">4 ta ekvivalent CO (bitta cho'qqi!)</td>
                    </tr>
                    <tr className="border-b border-purple-800/30">
                      <td className="py-3 px-4 font-mono">460-420</td>
                      <td className="py-3 px-4">ν(Ni−C)</td>
                      <td className="py-3 px-4">O'rta</td>
                      <td className="py-3 px-4 text-xs">Metall-uglerod bog'i</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono">400-300</td>
                      <td className="py-3 px-4">δ(Ni−C−O)</td>
                      <td className="py-3 px-4">Kuchsiz</td>
                      <td className="py-3 px-4 text-xs">Egilish tebranishlari</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-5">
                <h3 className="text-green-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Nega bitta cho'qqi?
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Erkin CO:</strong> ν(CO) = 2143 cm⁻¹</p>
                  <p>• <strong className="text-white">[Ni(CO)₄]:</strong> ν(CO) = 2057 cm⁻¹ <span className="text-pink-300">(86 cm⁻¹ ga pasaygan)</span></p>
                  <p>• <strong className="text-yellow-300">Sabab:</strong> π-backbonding C−O bog'ini kuchsizlantiradi</p>
                  <p>• <strong className="text-white">Faqat 1 cho'qqi:</strong> Td simmetriya → barcha 4 CO <strong>ekvivalent</strong></p>
                  <p className="text-xs text-purple-400 mt-2">
                    <strong className="text-pink-300">Taqqoslash:</strong> [Fe(CO)₅] da 2 ta cho'qqi (axial va ekvatorial CO farq qiladi), 
                    [Ni(CO)₄] da <strong>1 ta</strong> — tetraedrik simmetriya tufayli.
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
                    <p>• <strong className="text-white">δ:</strong> <span className="text-yellow-300 font-bold">192 ppm</span> (1 ta cho'qqi)</p>
                    <p>• <strong className="text-white">Sabab:</strong> Barcha 4 ta CO ekvivalent</p>
                    <p>• <strong className="text-white">Satellitlar:</strong> ⁶¹Ni bilan bog'lanish (J<sub>Ni-C</sub> ≈ 50 Hz)</p>
                    <p className="text-xs text-purple-400 mt-2">
                      ⁶¹Ni (I = 3/2, 1.14% tabiiy) — kichik satellite cho'qqilar ko'rinadi.
                    </p>
                  </div>
                </div>

                <div className="bg-indigo-950/50 rounded-xl p-5 border border-indigo-700/30">
                  <h3 className="text-indigo-400 font-bold mb-3">Boshqa usullar</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">UV-Vis:</strong> Kuchli yutilish 230 nm da (LMCT)</p>
                    <p>• <strong className="text-white">Raman:</strong> ν(CO) = 2057 cm⁻¹ (A₁ simmetriya)</p>
                    <p>• <strong className="text-white">Mass-spektr:</strong> M⁺ = 170 (Ni⁵⁸, asosiy izotop)</p>
                    <p className="text-xs text-purple-400 mt-2">
                      Fragmentlar: [Ni(CO)₃]⁺, [Ni(CO)₂]⁺, [Ni(CO)]⁺, Ni⁺
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* MOND PROCESS TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "mond" && (
          <>
            <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 border border-amber-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-xl shadow-lg shadow-amber-500/30">
                  🏭
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Mond jarayoni — Ni tozalash (99.99%)</h2>
              </div>
              
              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-amber-400">Mond jarayoni</strong> (yoki <strong>karbonil jarayoni</strong>) — 
                  bu <strong className="text-white">sanoatda nikel tozalash</strong>ning asosiy usuli.
                  1890 yilda Ludwig Mond tomonidan kashf etilgan va bugungi kunda ham 
                  <strong className="text-yellow-300"> 99.99% toza nikel</strong> olish uchun ishlatiladi.
                  Jarayon <strong className="text-white">[Ni(CO)₄]</strong> ning oson hosil bo'lishi va 
                  parchalanishiga asoslangan.
                </p>
              </div>

              {/* JARAYON BOSQICHLARI */}
              <div className="space-y-3 mb-6">
                {[
                  { step: "1", title: "Boshlang'ich material", desc: "Nodir nikel rudasi yoki nikel-mis aralashmasi (50-70% Ni)", color: "amber" },
                  { step: "2", title: "Birinchi bosqich: [Ni(CO)₄] sintezi", desc: "Ni + 4 CO → [Ni(CO)₄] (50-60°C, 1 atm) — gazsimon mahsulot", color: "orange" },
                  { step: "3", title: "Ajratish", desc: "[Ni(CO)₄] gazi boshqa metallardan (Fe, Cu, Co) ajratiladi — ular karbonil hosil qilmaydi", color: "yellow" },
                  { step: "4", title: "Ikkinchi bosqich: Parchalanish", desc: "[Ni(CO)₄] → Ni + 4 CO (200-250°C) — sof Ni cho'kadi, CO qayta ishlatiladi", color: "red" },
                  { step: "5", title: "Natija", desc: "99.99% toza nikel pelletlari (karbonil nikel)", color: "emerald" },
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

              {/* REAKTSIYALAR */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-amber-950/50 rounded-xl p-5 border border-amber-700/30">
                  <h3 className="text-amber-400 font-bold mb-3">1-bosqich: Sintez</h3>
                  <div className="bg-amber-900/60 rounded-lg p-3 font-mono text-xs text-amber-200 border border-amber-700/30 mb-3">
                    Ni(s) + 4 CO(g) → [Ni(CO)₄](g)<br/>
                    <span className="text-amber-300">50-60°C, 1 atm, ekzotermik</span>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">ΔH:</strong> -160 kJ/mol (ekzotermik)</p>
                    <p>• <strong className="text-white">Muvozanat:</strong> past haroratda o'ngga</p>
                    <p>• <strong className="text-white">Kinetics:</strong> sekin (bir necha soat)</p>
                  </div>
                </div>

                <div className="bg-red-950/50 rounded-xl p-5 border border-red-700/30">
                  <h3 className="text-red-400 font-bold mb-3">2-bosqich: Parchalanish</h3>
                  <div className="bg-red-900/60 rounded-lg p-3 font-mono text-xs text-red-200 border border-red-700/30 mb-3">
                    [Ni(CO)₄](g) → Ni(s) + 4 CO(g)<br/>
                    <span className="text-red-300">200-250°C, endotermik</span>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">ΔH:</strong> +160 kJ/mol (endotermik)</p>
                    <p>• <strong className="text-white">Muvozanat:</strong> yuqori haroratda o'ngga</p>
                    <p>• <strong className="text-white">CO:</strong> qayta ishlatiladi (sirkulyatsiya)</p>
                  </div>
                </div>
              </div>

              {/* AFZALLIKLAR */}
              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-5">
                <h3 className="text-amber-400 font-bold mb-3 flex items-center gap-2">
                  <span>💡</span> Nega Mond jarayoni samarali?
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-yellow-300">Selektivlik:</strong> Faqat Ni karbonil hosil qiladi (Fe, Cu, Co — yo'q)</p>
                  <p>• <strong className="text-yellow-300">Tozalik:</strong> 99.99% sof nikel (boshqa usullar: 99.5%)</p>
                  <p>• <strong className="text-yellow-300">Iqtisodiy:</strong> CO qayta ishlatiladi (yopiq sikl)</p>
                  <p>• <strong className="text-yellow-300">Shakl:</strong> Nikel pelletlar (qulay transport)</p>
                  <p className="text-xs text-purple-400 mt-2">
                    <strong className="text-white">Muqobil usul:</strong> Elektrolitik tozalash — 99.95% sof, lekin qimmatroq.
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Sintez usullari (laboratoriya)</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-green-950/50 rounded-2xl p-5 border border-green-700/30">
                  <h3 className="text-green-400 font-bold mb-3">1-usul: To'g'ridan-to'g'ri sintez (klassik)</h3>
                  <div className="bg-green-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-green-300 border border-green-700/30">
                    <p>Ni (reaktiv) + 4 CO → [Ni(CO)₄]</p>
                    <p className="text-green-300 text-xs mt-2">50-60°C, 1 atm CO, 2-4 soat</p>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Sharoit:</strong> Reaktiv Ni kukuni + CO gazi</p>
                    <p><strong className="text-white">Hosildorlik:</strong> 70-80%</p>
                    <p><strong className="text-white">Tozalash:</strong> Distillash (43°C da qaynaydi)</p>
                    <p><strong className="text-red-300">Xavf:</strong> Juda zaharli — faqat shkaflarda!</p>
                  </div>
                </div>

                <div className="bg-green-950/50 rounded-2xl p-5 border border-green-700/30">
                  <h3 className="text-green-400 font-bold mb-3">2-usul: Ni tuzlaridan (kuchsiz sharoit)</h3>
                  <div className="bg-green-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-green-300 border border-green-700/30">
                    <p>NiCl₂ + Na₂S₂O₄ + CO → [Ni(CO)₄] + ...</p>
                    <p className="text-green-300 text-xs mt-2">Na₂S₂O₄ — qaytaruvchi, 25°C, 1 atm CO</p>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Mexanizm:</strong> Ni²⁺ → Ni⁰ qaytariladi</p>
                    <p><strong className="text-white">Afzalligi:</strong> Past harorat, xavfsizroq</p>
                    <p><strong className="text-white">Hosildorlik:</strong> 40-50%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* HOMO SENTEZI */}
            <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  🔬
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Homo-[Ni(CO)₄] (izotopli)</h2>
              </div>
              
              <div className="bg-purple-950/50 rounded-2xl p-5 border border-purple-700/30">
                <p className="text-purple-200 text-sm leading-relaxed mb-3">
                  <strong className="text-purple-400">Izotopli analoglar</strong> spektroskopik tadqiqotlar uchun ishlatiladi:
                </p>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">[Ni(¹³CO)₄]:</strong> ¹³C bilan boyitilgan — NMR tadqiqotlari</p>
                  <p>• <strong className="text-white">[Ni(C¹⁸O)₄]:</strong> ¹⁸O bilan — FTIR da ν(CO) siljishi</p>
                  <p>• <strong className="text-white">[⁶²Ni(CO)₄]:</strong> ⁶²Ni izotop — mass-spektrometriya</p>
                  <p className="text-xs text-purple-400 mt-2">
                    Bu moddalar <strong className="text-yellow-300">fundamental bog'lanish nazariyasini</strong> 
                    o'rganish uchun ishlatiladi.
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Mond, Langer va Quincke kashfiyoti (1890)</h2>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-2xl p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-yellow-600 to-amber-600 flex items-center justify-center text-6xl flex-shrink-0 shadow-2xl">
                    👨‍🔬
                  </div>
                  <div className="flex-1">
                    <h3 className="text-yellow-400 font-bold text-xl mb-2">Ludwig Mond (1839-1909)</h3>
                    <p className="text-purple-200 text-sm mb-3 leading-relaxed">
                      <strong className="text-yellow-300">1890 yilda</strong> Nemis-ingliz kimyogari Ludwig Mond 
                      (yordamchilari Carl Langer va Friedrich Quincke bilan) 
                      <strong className="text-white"> birinchi metall karbonil</strong> — <strong>[Ni(CO)₄]</strong> ni 
                      kashf qildi. Bu <strong className="text-yellow-300">organometallik kimyo</strong> sohasining 
                      <strong className="text-white"> boshlanishi</strong> edi!
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-xs text-yellow-300 font-semibold">
                        📜 1890 yil
                      </span>
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-xs text-amber-300 font-semibold">
                        📍 London
                      </span>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-xs text-emerald-300 font-semibold">
                        🏭 Birinchi metall karbonil
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
                  <p>• <strong className="text-white">Birinchi metall karbonil:</strong> [Ni(CO)₄] — bu sohadagi birinchi birikma</p>
                  <p>• <strong className="text-yellow-300">Sanoat qo'llanilishi:</strong> Mond jarayoni — 99.99% toza Ni</p>
                  <p>• <strong className="text-white">18 elektron qoidasi:</strong> Bu komplekslar qoida yaratishga ilhom berdi</p>
                  <p>• <strong className="text-white">Sinergik bog'lanish:</strong> σ + π tushunchasi rivojlandi</p>
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
                  { year: "1891", title: "[Fe(CO)₅] sintezi", desc: "Mond va Quincke ikkinchi metall karbonilni sintez qildi" },
                  { year: "1899", title: "Mond jarayoni sanoatda", desc: "Birinchi zavod qurildi — Ni tozalash uchun" },
                  { year: "1928", title: "18 elektron qoidasi", desc: "Sidgwick organometallik komplekslar uchun qoidani taklif qildi" },
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