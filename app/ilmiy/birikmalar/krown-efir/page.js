"use client"

import Link from "next/link"
import { useState } from "react"

export default function KCrown6() {
  const [activeTab, setActiveTab] = useState("overview")
  const [compareIon, setCompareIon] = useState("K") // Li | Na | K | Rb | Cs

  const tabs = [
    { id: "overview", label: "📋 Umumiy", icon: "📋" },
    { id: "structure", label: "🧬 18-crown-6 halqasi", icon: "🧬" },
    { id: "bonding", label: "🔗 Ion-dipol bog'lanish", icon: "🔗" },
    { id: "selectivity", label: "🎯 Selektivlik", icon: "🎯" },
    { id: "spectroscopy", label: "🔬 Spektroskopiya", icon: "🔬" },
    { id: "phaseTransfer", label: "⚗️ Fazalararo kataliz", icon: "⚗️" },
    { id: "applications", label: "🏭 Qo'llanilish", icon: "🏭" },
    { id: "synthesis", label: "⚗️ Sintez", icon: "⚗️" },
    { id: "history", label: "🏆 Nobel 1987", icon: "🏆" },
  ]

  const ionData = {
    Li: { name: "Li⁺", radius: "0.76 Å", cavity: "1.2-1.6 Å", crown: "12-crown-4", fit: "Juda kichik", color: "red" },
    Na: { name: "Na⁺", radius: "1.02 Å", cavity: "1.2-1.6 Å", crown: "15-crown-5", fit: "Kichik", color: "orange" },
    K: { name: "K⁺", radius: "1.38 Å", cavity: "2.6-3.2 Å", crown: "18-crown-6", fit: "Mukammal!", color: "yellow" },
    Rb: { name: "Rb⁺", radius: "1.52 Å", cavity: "2.6-3.2 Å", crown: "18-crown-6", fit: "Biroz katta", color: "purple" },
    Cs: { name: "Cs⁺", radius: "1.67 Å", cavity: "2.6-3.2 Å", crown: "21-crown-7", fit: "Juda katta", color: "pink" }
  }

  const currentIon = ionData[compareIon]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white relative overflow-hidden">
      
      {/* ═══ ANIMATED BACKGROUND ═══ */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(234,179,8,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        {['K⁺', '18-crown-6', 'O', 'supramolekulyar', 'Pedersen 1967', 'Nobel 1987', 'host-guest', 'ion-dipol'].map((sym, i) => (
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
            <span className="text-yellow-400 font-semibold">[K(18-crown-6)]⁺</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-[10px] text-yellow-300 font-bold uppercase tracking-wider">
                  👑 Kraun-efir kompleksi
                </span>
                <span className="px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-[10px] text-purple-300 font-semibold">
                  🏆 Nobel 1987
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] text-emerald-300 font-semibold">
                  🎯 Supramolekulyar
                </span>
                <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-[10px] text-cyan-300 font-semibold">
                  🔗 Host-guest
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-yellow-400 via-orange-400 to-purple-300 bg-clip-text text-transparent">
                [K(18-crown-6)]⁺
              </h1>
              <p className="text-purple-300 text-sm mt-1">
                Kaliy-18-kraun-6 kompleksi • Potassium 18-crown-6 complex • Kraun-efir kompleksi
              </p>
            </div>
            
            {/* ION SWITCHER */}
            <div className="flex gap-2 flex-wrap">
              {["Li", "Na", "K", "Rb", "Cs"].map(ion => (
                <button
                  key={ion}
                  onClick={() => setCompareIon(ion)}
                  className={`px-3 py-2 rounded-xl border-2 transition-all flex items-center gap-2 ${
                    compareIon === ion
                      ? `bg-${ionData[ion].color}-500/20 border-${ionData[ion].color}-500/50 text-${ionData[ion].color}-300`
                      : 'bg-white/5 border-white/10 text-purple-300 hover:bg-white/10'
                  }`}
                >
                  <span className="text-lg">🔵</span>
                  <span className="hidden sm:inline">{ionData[ion].name}</span>
                </button>
              ))}
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
            { label: "Formula", value: "[K(18-crown-6)]⁺", icon: "🧪", color: "text-yellow-400" },
            { label: "M massa", value: "309.4 g/mol", icon: "⚖️", color: "text-blue-400" },
            { label: "Geometriya", value: "Psevdooktaedrik", icon: "💎", color: "text-purple-400" },
            { label: "K⁺ radiusi", value: "1.38 Å", icon: "🎯", color: "text-yellow-400" },
            { label: "Bo'shliq", value: "2.6-3.2 Å", icon: "🔗", color: "text-cyan-400" },
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Asosiy ma'lumotlar — [K(18-crown-6)]⁺</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  ["CAS raqami", "17975-61-0"],
                  ["Zaryad", "+1"],
                  ["Simmetriya", "D₃d (taxminan)"],
                  ["K−O masofa", "2.75-2.85 Å"],
                  ["Koordinatsion son", "6 (6 ta O)"],
                  ["Log K (barqarorlik)", "6.1 (metanol)"],
                  ["Eruvchanlik", "Organik erituvchilarda"],
                  ["Rang", "Rangsiz"],
                ].map((item, i) => (
                  <div key={i} className="bg-yellow-950/50 rounded-xl p-3 border border-yellow-700/30">
                    <div className="text-[10px] uppercase tracking-wider text-yellow-400 font-semibold mb-1">{item[0]}</div>
                    <div className="text-white font-semibold text-sm">{item[1]}</div>
                  </div>
                ))}
              </div>

              {/* KOMPLEKS STRUKTURASI */}
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-5">
                <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                  <span>👑</span> Kraun-efir kompleksi
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-yellow-900/30 rounded-xl p-4 border border-yellow-700/30">
                    <h4 className="text-yellow-300 font-bold text-sm mb-2">🔗 18-crown-6 (host)</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">18 a'zoli halqa:</strong> 6 ta O + 12 ta C</li>
                      <li>• <strong className="text-white">6 ta kislorod:</strong> donor atomlari</li>
                      <li>• <strong className="text-white">Bo'shliq:</strong> 2.6-3.2 Å</li>
                      <li>• <strong className="text-yellow-300">Selektivlik:</strong> K⁺ uchun mukammal</li>
                      <li>• <strong className="text-white">Konformatsiya:</strong> fleksibil</li>
                    </ul>
                  </div>
                  <div className="bg-orange-900/30 rounded-xl p-4 border border-orange-700/30">
                    <h4 className="text-orange-300 font-bold text-sm mb-2">🔵 K⁺ (guest)</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">K⁺ ioni:</strong> markaziy kation</li>
                      <li>• <strong className="text-white">Ion radiusi:</strong> 1.38 Å</li>
                      <li>• <strong className="text-white">Koordinatsiya:</strong> 6 ta O bilan</li>
                      <li>• <strong className="text-orange-300">Moslik:</strong> mukammal (1.38 Å ⊂ 2.6-3.2 Å)</li>
                      <li>• <strong className="text-white">Bog'lanish:</strong> ion-dipol</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 bg-purple-900/20 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-200 text-sm">
                    <strong className="text-yellow-300">Muhim:</strong> 18-crown-6 — bu 
                    <strong className="text-white"> supramolekulyar kimyoning</strong> klassik namunasi.
                    K⁺ ioni halqa bo'shlig'iga <strong className="text-pink-300">mukammal mos keladi</strong> — 
                    bu <strong className="text-white">host-guest kimyosi</strong>ning asosiy prinsipi!
                  </p>
                </div>
              </div>
            </div>

            {/* XULOSA */}
            <div className="bg-gradient-to-r from-yellow-600/10 via-orange-600/10 to-purple-600/10 border border-yellow-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>✅</span> Asosiy xulosalar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "👑 <strong>Kraun-efir:</strong> 18-crown-6 — 18 a'zoli halqa, 6 ta kislorod donor",
                  "🎯 <strong>Selektivlik:</strong> K⁺ uchun mukammal (1.38 Å ⊂ 2.6-3.2 Å)",
                  "🔗 <strong>Ion-dipol bog'lanish:</strong> K⁺ va 6 ta O o'rtasida",
                  "⚗️ <strong>Fazalararo kataliz:</strong> K⁺ ni organik fazaga o'tkazadi",
                  "🏆 <strong>Nobel 1987:</strong> Pedersen, Cram, Lehn — supramolekulyar kimyo",
                  "🧪 <strong>Qo'llanilish:</strong> fazalararo kataliz, ion selektiv elektrodlar",
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
                  🧬
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">18-crown-6 halqasi strukturasi</h2>
              </div>
              
              <div className="bg-yellow-950/60 rounded-xl p-5 font-mono text-sm text-yellow-200 border border-yellow-700/30 mb-6 text-center">
                <pre className="whitespace-pre">{`        O       O
       / \\     / \\
      /   \\   /   \\
     O     O-O     O
      \\   /   \\   /
       \\ /     \\ /
        O       O
        
   18-crown-6: 18 a'zoli halqa
   6 ta O (donor) + 12 ta C
   
   K⁺ ioni markazda (bo'shliqda)
   6 ta K−O bog' (ion-dipol)`}</pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-purple-400 font-bold text-sm uppercase tracking-wider">Geometrik parametrlar</h3>
                  <div className="space-y-2">
                    {[
                      ["Geometriya", "Psevdooktaedrik (buzilgan)"],
                      ["Simmetriya", "D₃d (taxminan)"],
                      ["K−O masofa", "2.75-2.85 Å (6 ta)"],
                      ["C−O masofa", "1.43 Å (halqa ichida)"],
                      ["C−C masofa", "1.50 Å (halqa ichida)"],
                      ["Bo'shliq diametri", "2.6-3.2 Å"],
                      ["Koordinatsion son", "6 (6 ta O)"],
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-purple-800/30">
                        <span className="text-purple-300 text-sm">{item[0]}</span>
                        <span className="text-white font-semibold text-sm font-mono">{item[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-yellow-400 font-bold text-sm uppercase tracking-wider">18-crown-6 xususiyatlari</h3>
                  <div className="space-y-3">
                    <div className="bg-yellow-900/30 rounded-xl p-4 border border-yellow-700/30">
                      <h4 className="text-yellow-300 font-bold text-sm mb-2">📐 Nima uchun "18-crown-6"?</h4>
                      <div className="space-y-2 text-sm text-purple-200">
                        <p>• <strong className="text-white">18:</strong> halqadagi jami atomlar soni (6 O + 12 C)</p>
                        <p>• <strong className="text-white">6:</strong> donor atomlari soni (6 ta O)</p>
                        <p>• <strong className="text-white">Crown:</strong> halqa shakli tojga o'xshaydi</p>
                      </div>
                    </div>
                    <div className="bg-orange-900/30 rounded-xl p-4 border border-orange-700/30">
                      <h4 className="text-orange-300 font-bold text-sm mb-2">🔗 Konformatsiya</h4>
                      <div className="space-y-2 text-sm text-purple-200">
                        <p>• <strong className="text-white">Fleksibil:</strong> halqa bukilishi mumkin</p>
                        <p>• <strong className="text-white">Bo'shliq:</strong> 2.6-3.2 Å (o'zgaruvchan)</p>
                        <p>• <strong className="text-white">K⁺ bilan:</strong> optimal konformatsiya</p>
                      </div>
                    </div>
                  </div>
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
            <div className="bg-gradient-to-br from-cyan-900/40 to-teal-900/40 border border-cyan-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-xl shadow-lg shadow-cyan-500/30">
                  🔗
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Ion-dipol bog'lanish mexanizmi</h2>
              </div>
              
              <div className="bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border-2 border-cyan-500/30 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-cyan-400">[K(18-crown-6)]⁺</strong> kompleksi 
                  <strong className="text-white"> ion-dipol bog'lanish</strong> orqali hosil bo'ladi.
                  K⁺ kationi 18-crown-6 ning <strong className="text-yellow-300">6 ta kislorod atomi</strong> bilan 
                  elektrostatik tortishish orqali bog'lanadi. Bu <strong className="text-pink-300">koordinatsion bog'</strong> emas, 
                  balki <strong className="text-white">supramolekulyar bog'</strong> hisoblanadi.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-cyan-950/50 rounded-xl p-5 border border-cyan-700/30">
                  <h3 className="text-cyan-400 font-bold mb-3">🔵 K⁺ (kation)</h3>
                  <div className="bg-cyan-900/40 rounded-lg p-4 font-mono text-xs text-cyan-200 border border-cyan-700/30 mb-3">
                    <pre className="whitespace-pre">{`  K⁺ (kation)
  
  Zaryad: +1
  Radius: 1.38 Å
  Elektron konfiguratsiya: [Ar]
  
  Lewis kislotasi (akseptor)`}</pre>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">K⁺:</strong> kation (musbat zaryad)</p>
                    <p>• <strong className="text-white">Radius:</strong> 1.38 Å</p>
                    <p>• <strong className="text-white">Lewis kislotasi:</strong> elektron jufti akseptori</p>
                    <p>• <strong className="text-cyan-300">Rol:</strong> guest (mehmon)</p>
                  </div>
                </div>

                <div className="bg-teal-950/50 rounded-xl p-5 border border-teal-700/30">
                  <h3 className="text-teal-400 font-bold mb-3">🔗 18-crown-6 (host)</h3>
                  <div className="bg-teal-900/40 rounded-lg p-4 font-mono text-xs text-teal-200 border border-teal-700/30 mb-3">
                    <pre className="whitespace-pre">{`  18-crown-6 (host)
  
  6 ta O (donor atomlari)
  Har bir O da 2 ta yolg'iz juft
  Bo'shliq: 2.6-3.2 Å
  
  Lewis asosi (donor)`}</pre>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">6 ta O:</strong> donor atomlari</p>
                    <p>• <strong className="text-white">Har bir O:</strong> 2 ta yolg'iz elektron jufti</p>
                    <p>• <strong className="text-white">Lewis asosi:</strong> elektron jufti donori</p>
                    <p>• <strong className="text-teal-300">Rol:</strong> host (xo'jayin)</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-5">
                <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Ion-dipol bog'lanish
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">K⁺ (kation):</strong> musbat zaryad</p>
                  <p>• <strong className="text-white">O (dipol):</strong> manfiy qutb (yolg'iz juftlar)</p>
                  <p>• <strong className="text-white">Tortishish:</strong> elektrostatik (Coulomb qonuni)</p>
                  <p>• <strong className="text-yellow-300">Bog'lanish energiyasi:</strong> ~200-300 kJ/mol (6 ta K−O bog')</p>
                  <p className="text-xs text-purple-400 mt-2">
                    Bu <strong className="text-pink-300">supramolekulyar bog'</strong> — 
                    koordinatsion bog'dan kuchsiz, lekin selektivlik yuqori.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* SELECTIVITY TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "selectivity" && (
          <>
            <div className="bg-gradient-to-br from-purple-900/40 to-yellow-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-yellow-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  🎯
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Ion selektivligi — nima uchun K⁺?</h2>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-yellow-400">18-crown-6</strong> — bu 
                  <strong className="text-white"> K⁺ uchun selektiv</strong> ligand.
                  Sababi: K⁺ ion radiusi (1.38 Å) 18-crown-6 bo'shlig'iga (2.6-3.2 Å) 
                  <strong className="text-pink-300"> mukammal mos keladi</strong>.
                  Boshqa ionlar (Li⁺, Na⁺, Rb⁺, Cs⁺) yoki juda kichik yoki juda katta.
                </p>
              </div>

              {/* ION TAQQOSLASH */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
                {["Li", "Na", "K", "Rb", "Cs"].map(ion => (
                  <div 
                    key={ion}
                    className={`bg-${ionData[ion].color}-950/50 rounded-xl p-4 border-2 ${
                      compareIon === ion ? `border-${ionData[ion].color}-500/50` : `border-${ionData[ion].color}-700/30`
                    } text-center`}
                  >
                    <div className={`text-${ionData[ion].color}-400 text-xs uppercase mb-1`}>{ionData[ion].name}</div>
                    <div className="text-white font-bold text-lg">{ionData[ion].radius}</div>
                    <div className="text-purple-300 text-xs mt-1">{ionData[ion].fit}</div>
                    <div className={`text-${ionData[ion].color}-300 text-[10px] mt-2`}>{ionData[ion].crown}</div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-5 mb-6">
                <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                  <span>🎯</span> Nima uchun K⁺ mukammal?
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">K⁺ radiusi:</strong> 1.38 Å</p>
                  <p>• <strong className="text-white">18-crown-6 bo'shlig'i:</strong> 2.6-3.2 Å</p>
                  <p>• <strong className="text-yellow-300">Moslik:</strong> 1.38 Å ⊂ 2.6-3.2 Å (mukammal!)</p>
                  <p>• <strong className="text-white">Log K (barqarorlik):</strong> 6.1 (metanol)</p>
                  <p className="text-xs text-purple-400 mt-2">
                    <strong className="text-pink-300">Muhim:</strong> Agar ion juda kichik bo'lsa (Li⁺, Na⁺), 
                    u bo'shliqda "suzadi" va bog'lanish kuchsiz bo'ladi.
                    Agar juda katta bo'lsa (Rb⁺, Cs⁺), u bo'shliqqa sig'maydi.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-2xl p-5">
                <h3 className="text-purple-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Boshqa kraun-efirlar
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">12-crown-4:</strong> Li⁺ uchun selektiv (bo'shliq 1.2-1.6 Å)</p>
                  <p>• <strong className="text-white">15-crown-5:</strong> Na⁺ uchun selektiv (bo'shliq 1.7-2.2 Å)</p>
                  <p>• <strong className="text-yellow-300">18-crown-6:</strong> K⁺ uchun selektiv (bo'shliq 2.6-3.2 Å)</p>
                  <p>• <strong className="text-white">21-crown-7:</strong> Cs⁺ uchun selektiv (bo'shliq 3.4-4.3 Å)</p>
                  <p className="text-xs text-purple-400 mt-2">
                    <strong className="text-pink-300">Printsip:</strong> Kraun-efir bo'shlig'i ion radiusiga mos bo'lishi kerak!
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
                  <h3 className="text-green-400 font-bold mb-3">📡 IR spektroskopiya</h3>
                  <div className="space-y-2">
                    {[
                      { freq: "2900-2850 cm⁻¹", bond: "ν(C−H)", desc: "C-H valent tebranish (halqa)", intensity: "Kuchli" },
                      { freq: "1250-1100 cm⁻¹", bond: "ν(C−O−C)", desc: "C-O-C valent tebranish", intensity: "Juda kuchli" },
                      { freq: "950-850 cm⁻¹", bond: "ν(C−O)", desc: "C-O valent tebranish", intensity: "Kuchli" },
                      { freq: "600-500 cm⁻¹", bond: "ν(K−O)", desc: "K-O ion-dipol bog'", intensity: "O'rta" },
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
                      <p className="text-emerald-300 font-bold text-xs mb-1">¹H NMR (CDCl₃)</p>
                      <p className="text-xs">δ = 3.6-3.8 ppm (−CH₂−O−CH₂−)</p>
                      <p className="text-xs text-emerald-300">Barcha 24 ta H ekvivalent</p>
                    </div>
                    <div className="bg-teal-900/40 rounded-lg p-3 border border-teal-700/30">
                      <p className="text-teal-300 font-bold text-xs mb-1">¹³C NMR</p>
                      <p className="text-xs">δ = 70-75 ppm (−CH₂−O−CH₂−)</p>
                      <p className="text-xs text-teal-300">Barcha 12 ta C ekvivalent</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-5">
                <h3 className="text-green-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> NMR da nima o'zgaradi?
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Erkin 18-crown-6:</strong> barcha H va C ekvivalent (D₃d simmetriya)</p>
                  <p>• <strong className="text-white">K⁺ bilan kompleks:</strong> simmetriya saqlanadi, lekin kimyoviy siljish o'zgaradi</p>
                  <p>• <strong className="text-yellow-300">Sabab:</strong> K⁺ bilan bog'lanish elektron zichlikni o'zgartiradi</p>
                  <p className="text-xs text-purple-400 mt-2">
                    <strong className="text-pink-300">Muhim:</strong> NMR orqali kompleks hosil bo'lganligini aniqlash mumkin.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* PHASE TRANSFER TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "phaseTransfer" && (
          <>
            <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 border border-amber-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-xl shadow-lg shadow-amber-500/30">
                  ⚗️
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Fazalararo kataliz (Phase Transfer Catalysis)</h2>
              </div>
              
              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-2 border-amber-500/30 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-amber-400">18-crown-6</strong> — bu 
                  <strong className="text-white"> fazalararo katalizator</strong>.
                  U K⁺ ni suvli fazadan organik fazaga o'tkazadi, bu esa 
                  <strong className="text-pink-300"> reaksiyalarni tezlashtiradi</strong>.
                  Bu <strong className="text-white">organik sintezda</strong> juda muhim!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-amber-950/50 rounded-xl p-5 border border-amber-700/30">
                  <h3 className="text-amber-400 font-bold mb-3">💧 Muammo (katalizatorsiz)</h3>
                  <div className="bg-amber-900/40 rounded-lg p-4 font-mono text-xs text-amber-200 border border-amber-700/30 mb-3">
                    <pre className="whitespace-pre">{`  Suvli faza: KMnO₄ (eriydi)
  Organik faza: alken (eriydi)
  
  Muammo: KMnO₄ organik fazada erimaydi!
  Reaktsiya: juda sekin`}</pre>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">KMnO₄:</strong> suvda eriydi, organik fazada erimaydi</p>
                    <p>• <strong className="text-white">Alken:</strong> organik fazada eriydi</p>
                    <p>• <strong className="text-amber-300">Natija:</strong> ikki faza aralashmaydi → reaktsiya sekin</p>
                  </div>
                </div>

                <div className="bg-orange-950/50 rounded-xl p-5 border border-orange-700/30">
                  <h3 className="text-orange-400 font-bold mb-3">👑 Yechim (18-crown-6 bilan)</h3>
                  <div className="bg-orange-900/40 rounded-lg p-4 font-mono text-xs text-orange-200 border border-orange-700/30 mb-3">
                    <pre className="whitespace-pre">{`  18-crown-6 + K⁺ → [K(18-crown-6)]⁺
  
  [K(18-crown-6)]⁺ organik fazada eriydi!
  MnO₄⁻ ham organik fazaga o'tadi
  
  Reaktsiya: juda tez!`}</pre>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">18-crown-6:</strong> K⁺ bilan kompleks hosil qiladi</p>
                    <p>• <strong className="text-white">[K(18-crown-6)]⁺:</strong> organik fazada eriydi</p>
                    <p>• <strong className="text-orange-300">Natija:</strong> MnO₄⁻ ham organik fazaga o'tadi → reaktsiya tez</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-5">
                <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Fazalararo kataliz mexanizmi
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">1-bosqich:</strong> 18-crown-6 K⁺ bilan kompleks hosil qiladi (suvli fazada)</p>
                  <p>• <strong className="text-white">2-bosqich:</strong> [K(18-crown-6)]⁺ organik fazaga o'tadi (MnO₄⁻ bilan birga)</p>
                  <p>• <strong className="text-white">3-bosqich:</strong> Organik fazada reaktsiya sodir bo'ladi (alken + MnO₄⁻)</p>
                  <p>• <strong className="text-white">4-bosqich:</strong> 18-crown-6 qayta suvli fazaga o'tadi (katalitik sikl)</p>
                  <p className="text-xs text-purple-400 mt-2">
                    <strong className="text-pink-300">Natija:</strong> Reaktsiya tezligi 1000-10000 marta oshadi!
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
            <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border border-yellow-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-xl shadow-lg shadow-yellow-500/30">
                  🏭
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Sanoat va ilmiy qo'llanilish</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-yellow-950/50 rounded-xl p-5 border border-yellow-700/30">
                  <h3 className="text-yellow-400 font-bold mb-3">⚗️ Organik sintez</h3>
                  <div className="space-y-3 text-sm text-purple-200">
                    <div className="bg-yellow-900/40 rounded-lg p-3 border border-yellow-700/30">
                      <p className="text-yellow-300 font-bold text-xs mb-1">Fazalararo kataliz</p>
                      <p className="text-xs">KMnO₄, KF, KCN bilan reaktsiyalar</p>
                    </div>
                    <div className="bg-yellow-900/40 rounded-lg p-3 border border-yellow-700/30">
                      <p className="text-yellow-300 font-bold text-xs mb-1">Nukleofil o'rin almashinish</p>
                      <p className="text-xs">SN2 reaktsiyalarni tezlashtirish</p>
                    </div>
                    <div className="bg-yellow-900/40 rounded-lg p-3 border border-yellow-700/30">
                      <p className="text-yellow-300 font-bold text-xs mb-1">Oksidlanish reaktsiyalari</p>
                      <p className="text-xs">Alkenlarni oksidlash</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-950/50 rounded-xl p-5 border border-orange-700/30">
                  <h3 className="text-orange-400 font-bold mb-3">🔬 Analitik kimyo</h3>
                  <div className="space-y-3 text-sm text-purple-200">
                    <div className="bg-orange-900/40 rounded-lg p-3 border border-orange-700/30">
                      <p className="text-orange-300 font-bold text-xs mb-1">Ion selektiv elektrodlar</p>
                      <p className="text-xs">K⁺ ni aniqlash uchun</p>
                    </div>
                    <div className="bg-orange-900/40 rounded-lg p-3 border border-orange-700/30">
                      <p className="text-orange-300 font-bold text-xs mb-1">Ekstraktsiya</p>
                      <p className="text-xs">K⁺ ni suvli eritmalardan ajratish</p>
                    </div>
                    <div className="bg-orange-900/40 rounded-lg p-3 border border-orange-700/30">
                      <p className="text-orange-300 font-bold text-xs mb-1">Sensorlar</p>
                      <p className="text-xs">K⁺ sensorlari</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-yellow-900/40 rounded-lg p-3 border border-yellow-700/30">
                  <p className="text-yellow-300 font-bold text-xs mb-1">🔋 Batareyalar</p>
                  <p className="text-xs text-purple-200">K⁺ ion o'tkazuvchan elektrolitlar</p>
                </div>
                <div className="bg-yellow-900/40 rounded-lg p-3 border border-yellow-700/30">
                  <p className="text-yellow-300 font-bold text-xs mb-1">💊 Tibbiyot</p>
                  <p className="text-xs text-purple-200">K⁺ transportini o'rganish</p>
                </div>
                <div className="bg-yellow-900/40 rounded-lg p-3 border border-yellow-700/30">
                  <p className="text-yellow-300 font-bold text-xs mb-1">🧬 Biologiya</p>
                  <p className="text-xs text-purple-200">Ion kanallarini modellashtirish</p>
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
                  <h3 className="text-green-400 font-bold mb-3">1-usul: Williamson efir sintezi (klassik)</h3>
                  <div className="bg-green-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-green-300 border border-green-700/30">
                    <p>Trietilen glikol + 1,2-dibrometan → 18-crown-6</p>
                    <p className="text-green-300 text-xs mt-2">NaOH, yuqori harorat, yuqori bosimli</p>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Mexanizm:</strong> Williamson efir sintezi (SN2)</p>
                    <p><strong className="text-white">Sharoit:</strong> NaOH, 150°C, 24 soat</p>
                    <p><strong className="text-white">Hosildorlik:</strong> 40-60%</p>
                    <p><strong className="text-white">Tozalash:</strong> Distillash, qayta kristallizatsiya</p>
                  </div>
                </div>

                <div className="bg-green-950/50 rounded-2xl p-5 border border-green-700/30">
                  <h3 className="text-green-400 font-bold mb-3">2-usul: Template sintezi (K⁺ bilan)</h3>
                  <div className="bg-green-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-green-300 border border-green-700/30">
                    <p>Trietilen glikol + 1,2-dibrometan + KOH → [K(18-crown-6)]⁺</p>
                    <p className="text-green-300 text-xs mt-2">K⁺ template sifatida, yuqori hosildorlik</p>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Afzalligi:</strong> K⁺ template sifatida ishlaydi → yuqori hosildorlik</p>
                    <p><strong className="text-white">Mexanizm:</strong> K⁺ halqa yopilishini yo'naltiradi</p>
                    <p><strong className="text-white">Hosildorlik:</strong> 70-85%</p>
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Nobel mukofoti 1987 — Pedersen, Cram, Lehn</h2>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-2xl p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-yellow-600 to-amber-600 flex items-center justify-center text-6xl flex-shrink-0 shadow-2xl">
                    🏆
                  </div>
                  <div className="flex-1">
                    <h3 className="text-yellow-400 font-bold text-xl mb-2">Charles J. Pedersen (1904-1989)</h3>
                    <p className="text-purple-200 text-sm mb-3 leading-relaxed">
                      <strong className="text-yellow-300">1967 yilda</strong> Amerikalik kimyogar Charles Pedersen 
                      <strong className="text-white"> birinchi kraun-efirni</strong> (dibenzo-18-crown-6) tasodifan kashf qildi.
                      Bu <strong className="text-pink-300">supramolekulyar kimyoning</strong> asosini qo'ydi!
                      1987 yilda Pedersen, Cram va Lehn 
                      <strong className="text-yellow-300"> Nobel mukofoti</strong>ni oldi.
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-xs text-yellow-300 font-semibold">
                        📜 1967 yil
                      </span>
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-xs text-amber-300 font-semibold">
                        🏆 Nobel 1987
                      </span>
                      <span className="px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-xs text-orange-300 font-semibold">
                        👑 Supramolekulyar kimyo
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { year: "1967", title: "Pedersen kashfiyoti", desc: "Charles Pedersen birinchi kraun-efirni (dibenzo-18-crown-6) tasodifan kashf qildi" },
                  { year: "1968", title: "K⁺ selektivligi", desc: "18-crown-6 ning K⁺ uchun selektiv ekanligi aniqlandi" },
                  { year: "1970+", title: "Cram va Lehn ishlari", desc: "Donald Cram va Jean-Marie Lehn boshqa kraun-efirlarni sintez qildi" },
                  { year: "1987", title: "Nobel mukofoti", desc: "Pedersen, Cram, Lehn — supramolekulyar kimyo uchun Nobel oldi" },
                  { year: "1990+", title: "Zamonaviy qo'llanilish", desc: "Fazalararo kataliz, ion selektiv elektrodlar, sensorlar" },
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
                  <span>💡</span> Nima uchun kraun-efirlar kimyo tarixida muhim?
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Supramolekulyar kimyo:</strong> yangi soha ochildi (host-guest kimyosi)</p>
                  <p>• <strong className="text-white">Selektivlik:</strong> ion radiusi va bo'shliq mosligi prinsipi</p>
                  <p>• <strong className="text-white">Fazalararo kataliz:</strong> organik sintezni inqilob qildi</p>
                  <p>• <strong className="text-white">Nobel 1987:</strong> supramolekulyar kimyo sohasining tan olinishi</p>
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
              href="/ilmiy/birikmares/creutz-taube"
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold transition-all flex items-center gap-2"
            >
              <span>←</span>
              <span className="hidden sm:inline">Creutz-Taube ioni</span>
            </Link>
            <Link 
              href="/ilmiy/birikmares/ferrosen"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold transition-all shadow-lg shadow-yellow-500/30 flex items-center gap-2"
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