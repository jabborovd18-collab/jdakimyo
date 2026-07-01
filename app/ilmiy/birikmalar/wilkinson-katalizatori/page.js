"use client"

import Link from "next/link"
import { useState } from "react"

export default function WilkinsonKatalizatori() {
  const [activeTab, setActiveTab] = useState("overview")
  const [reactionStep, setReactionStep] = useState(1) // 1-5 katalitik sikl bosqichlari

  const tabs = [
    { id: "overview", label: "📋 Umumiy", icon: "📋" },
    { id: "structure", label: "🧬 Kvadrat-tekis", icon: "🧬" },
    { id: "electronic", label: "⚛️ 16 elektron (d⁸)", icon: "⚛️" },
    { id: "bonding", label: "🔗 PPh₃ ligandlari", icon: "🔗" },
    { id: "catalysis", label: "⚗️ Gidrogenlash", icon: "⚗️" },
    { id: "spectroscopy", label: "🔬 Spektroskopiya", icon: "🔬" },
    { id: "applications", label: "🏭 Qo'llanilish", icon: "🏭" },
    { id: "synthesis", label: "⚗️ Sintez", icon: "⚗️" },
    { id: "history", label: "🏆 Nobel 1973", icon: "🏆" },
  ]

  const catalysisSteps = {
    1: {
      name: "Boshlang'ich kompleks",
      formula: "[RhCl(PPh₃)₃]",
      description: "16 elektronli kvadrat-tekis Rh(I) kompleksi — bo'sh koordinatsion joy bor",
      electronCount: "16 e⁻",
      oxidationState: "Rh(I)",
      geometry: "Kvadrat-tekis"
    },
    2: {
      name: "Ligand dissotsiatsiyasi",
      formula: "[RhCl(PPh₃)₂] + PPh₃",
      description: "Bitta PPh₃ ligandi dissotsiatsiyalanadi — 14 elektronli faol kompleks hosil bo'ladi",
      electronCount: "14 e⁻",
      oxidationState: "Rh(I)",
      geometry: "T-shaklli"
    },
    3: {
      name: "Oksidativ birikish (H₂)",
      formula: "[RhCl(H)₂(PPh₃)₂]",
      description: "H₂ molekulasi oksidativ birikadi — Rh(I) → Rh(III), 16 → 18 e⁻",
      electronCount: "18 e⁻",
      oxidationState: "Rh(III)",
      geometry: "Oktaedrik"
    },
    4: {
      name: "Alken koordinatsiyasi",
      formula: "[RhCl(H)₂(PPh₃)₂(alken)]",
      description: "Alken π-bog' orqali Rh ga koordinatsiyalanadi (η²)",
      electronCount: "18 e⁻",
      oxidationState: "Rh(III)",
      geometry: "Oktaedrik"
    },
    5: {
      name: "Migratsion inseratsiya + eliminatsiya",
      formula: "Alkan + [RhCl(PPh₃)₂]",
      description: "H atomlari alkenga ko'chadi, alkan eliminatsiyalanadi, katalizator qayta tiklanadi",
      electronCount: "16 e⁻",
      oxidationState: "Rh(I)",
      geometry: "Kvadrat-tekis"
    }
  }

  const currentStep = catalysisSteps[reactionStep]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white relative overflow-hidden">
      
      {/* ═══ ANIMATED BACKGROUND ═══ */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(236,72,153,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(236,72,153,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        {['Rh(I)', 'd⁸', '16 e⁻', 'PPh₃', 'Wilkinson 1973', 'gidrogenlash', 'kataliz', 'kvadrat-tekis'].map((sym, i) => (
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
            <span className="text-pink-400 font-semibold">[RhCl(PPh₃)₃]</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-[10px] text-pink-300 font-bold uppercase tracking-wider">
                  ⚗️ Gidrogenlash katalizatori
                </span>
                <span className="px-2.5 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-[10px] text-yellow-300 font-semibold">
                  🏆 Nobel 1973
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] text-emerald-300 font-semibold">
                  ⚛️ 16 elektron (d⁸)
                </span>
                <span className="px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-[10px] text-purple-300 font-semibold">
                  💎 Kvadrat-tekis
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-rose-300 bg-clip-text text-transparent">
                [RhCl(PPh₃)₃]
              </h1>
              <p className="text-purple-300 text-sm mt-1">
                Wilkinson katalizatori • Xlorotris(trifenilfosfin)rodiy(I) • Wilkinson&apos;s catalyst
              </p>
            </div>
            
            <div className="flex gap-2">
              <Link 
                href="/ilmiy/birikmalar/vaska-kompleksi"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 hover:border-amber-400/60 text-amber-300 text-sm font-semibold transition-all flex items-center gap-2"
              >
                <span>⚡</span>
                <span className="hidden sm:inline">Vaska kompleksi</span>
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
            { label: "Formula", value: "[RhCl(PPh₃)₃]", icon: "🧪", color: "text-pink-400" },
            { label: "M massa", value: "925.2 g/mol", icon: "⚖️", color: "text-blue-400" },
            { label: "Geometriya", value: "Kvadrat-tekis", icon: "💎", color: "text-purple-400" },
            { label: "Rangi", value: "Pushti-qizil", icon: "🎨", color: "text-pink-400" },
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
            <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-pink-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-xl shadow-lg shadow-pink-500/30">
                  📋
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Asosiy ma&apos;lumotlar — Wilkinson katalizatori</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  ["CAS raqami", "14694-95-2"],
                  ["Zichlik", "1.38 g/cm³"],
                  ["Sistema", "Monoklinik"],
                  ["Fazoviy guruh", "P2₁/c"],
                  ["Eruvchanlik (benzol)", "Yaxshi eriydi"],
                  ["Eruvchanlik (H₂O)", "Erimaydi"],
                  ["Barqarorlik", "Yuqori (havoda barqaror)"],
                  ["Rangi", "Pushti-qizil kristall"],
                ].map((item, i) => (
                  <div key={i} className="bg-pink-950/50 rounded-xl p-3 border border-pink-700/30">
                    <div className="text-[10px] uppercase tracking-wider text-pink-400 font-semibold mb-1">{item[0]}</div>
                    <div className="text-white font-semibold text-sm">{item[1]}</div>
                  </div>
                ))}
              </div>

              {/* KOMPLEKS STRUKTURASI */}
              <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-2xl p-5">
                <h3 className="text-pink-400 font-bold mb-3 flex items-center gap-2">
                  <span>⚗️</span> Katalitik xususiyatlari
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-pink-900/30 rounded-xl p-4 border border-pink-700/30">
                    <h4 className="text-pink-300 font-bold text-sm mb-2">🧬 Kvadrat-tekis geometriya</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">Rh⁺</strong> — markaziy ion (4d⁸)</li>
                      <li>• <strong className="text-white">1 × Cl⁻</strong> — xlor ligandi</li>
                      <li>• <strong className="text-white">3 × PPh₃</strong> — trifenilfosfin ligandlari</li>
                      <li>• <strong className="text-yellow-300">Koordinatsion son:</strong> 4</li>
                      <li>• <strong className="text-pink-300">16 elektron:</strong> 2 ta elektron kam (18 emas!)</li>
                      <li>• <strong className="text-white">Bo'sh joy:</strong> kichik molekulalar kirishi mumkin</li>
                    </ul>
                  </div>
                  <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-700/30">
                    <h4 className="text-purple-300 font-bold text-sm mb-2">⚗️ Katalitik faollik</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">Gidrogenlash:</strong> alkenlarni alkanlarga aylantirish</li>
                      <li>• <strong className="text-white">Selektivlik:</strong> kamroq to'yingan alkenlar afzal</li>
                      <li>• <strong className="text-white">Sharoit:</strong> xona harorati, 1 atm H₂</li>
                      <li>• <strong className="text-white">Mexanizm:</strong> oksidativ birikish + migratsion inseratsiya</li>
                      <li>• <strong className="text-yellow-300">Katalitik sikl:</strong> 5 bosqich</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* XULOSA */}
            <div className="bg-gradient-to-r from-pink-600/10 via-purple-600/10 to-rose-600/10 border border-pink-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>✅</span> Asosiy xulosalar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "⚗️ <strong>Gidrogenlash katalizatori:</strong> alkenlarni selektiv gidrogenlash uchun klassik katalizator",
                  "⚛️ <strong>16 elektron (d⁸):</strong> kvadrat-tekis, 2 ta elektron kam — bo'sh koordinatsion joy",
                  "💎 <strong>Kvadrat-tekis:</strong> Rh(I), 3 ta PPh₃ + 1 ta Cl⁻ ligandlari",
                  "🔗 <strong>PPh₃ ligandlari:</strong> kuchli σ-donor + kuchsiz π-akseptor",
                  "⚗️ <strong>Katalitik sikl:</strong> 5 bosqich — dissotsiatsiya, oksidativ birikish, inseratsiya, eliminatsiya",
                  "🏆 <strong>Nobel 1973:</strong> Wilkinson (Fischer bilan birga) organometallik kimyo uchun",
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
            <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  🧬
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Kvadrat-tekis geometriya</h2>
              </div>
              
              <div className="bg-pink-950/60 rounded-xl p-5 font-mono text-sm text-pink-200 border border-pink-700/30 mb-6 text-center">
                <pre className="whitespace-pre">{`            PPh₃
            |
   Cl — Rh — PPh₃
            |
            PPh₃
            
   Kvadrat-tekis: Rh⁺ markazda, 4 ta ligand
   1 ta Cl⁻ + 3 ta PPh₃ = koordinatsion son 4`}</pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-purple-400 font-bold text-sm uppercase tracking-wider">Geometrik parametrlar</h3>
                  <div className="space-y-2">
                    {[
                      ["Geometriya", "Kvadrat-tekis (square planar)"],
                      ["Nuqtali guruh", "C₂ᵥ (taxminan)"],
                      ["Rh−Cl masofa", "2.38 Å"],
                      ["Rh−P masofa", "2.21-2.33 Å (3 ta)"],
                      ["P−Rh−P burchak", "90° (cis) / 180° (trans)"],
                      ["Cl−Rh−P burchak", "90° (cis) / 180° (trans)"],
                      ["Koordinatsion son", "4"],
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-purple-800/30">
                        <span className="text-purple-300 text-sm">{item[0]}</span>
                        <span className="text-white font-semibold text-sm font-mono">{item[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-pink-400 font-bold text-sm uppercase tracking-wider">PPh₃ joylashuvi</h3>
                  <div className="space-y-3">
                    <div className="bg-pink-900/30 rounded-xl p-4 border border-pink-700/30">
                      <h4 className="text-pink-300 font-bold text-sm mb-2">📐 Trans effekt</h4>
                      <div className="space-y-2 text-sm text-purple-200">
                        <p>• <strong className="text-white">PPh₃:</strong> kuchli trans effekt (σ-donor)</p>
                        <p>• <strong className="text-white">Cl⁻:</strong> o'rta trans effekt</p>
                        <p>• <strong className="text-yellow-300">Natija:</strong> PPh₃ ning trans-pozitsiyasidagi ligand kuchsizlanadi</p>
                      </div>
                    </div>
                    <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-700/30">
                      <h4 className="text-purple-300 font-bold text-sm mb-2">💎 Sterik effekt</h4>
                      <div className="space-y-2 text-sm text-purple-200">
                        <p>• <strong className="text-white">PPh₃ juda katta:</strong> 3 ta fenil guruhi</p>
                        <p>• <strong className="text-white">Sterik to'siq:</strong> bir PPh₃ dissotsiatsiyalanadi</p>
                        <p>• <strong className="text-yellow-300">Natija:</strong> 14 elektronli faol kompleks</p>
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Elektron tuzilishi — Rh⁺ (4d⁸)</h2>
              </div>
              
              <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-2 border-pink-500/30 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-pink-400">Muhim:</strong> Wilkinson katalizatori <strong className="text-yellow-300">16 elektronli</strong> kompleks — 
                  18 elektron qoidasi <strong className="text-red-300">bajarilmagan</strong>! Bu uning 
                  <strong className="text-white"> katalitik faolligining asosiy sababi</strong> — bo'sh koordinatsion joy bor, 
                  shuning uchun kichik molekulalar (H₂, alkenlar) kirishi mumkin.
                </p>
              </div>

              {/* ELEKTRON HISOB */}
              <div className="bg-emerald-950/50 rounded-2xl p-6 border border-emerald-700/30 mb-6">
                <h3 className="text-emerald-400 font-bold mb-4">[RhCl(PPh₃)₃] uchun elektron hisobi</h3>
                <div className="space-y-3">
                  <div className="bg-emerald-900/40 rounded-xl p-4 border border-emerald-700/30 flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold">Rh⁺ (rodiy)</div>
                      <div className="text-purple-300 text-xs mt-1">
                        Konfiguratsiya: [Kr] 4d⁸ → 8 ta valent elektron
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
                      <div className="text-white font-bold">3 × PPh₃</div>
                      <div className="text-purple-300 text-xs mt-1">
                        Har bir PPh₃ 2 ta elektron beradi (σ-donor)
                      </div>
                    </div>
                    <div className="text-emerald-300 text-2xl font-bold font-mono">3 × 2 = 6 e⁻</div>
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
                  <p>• <strong className="text-white">1 ta 4d orbital</strong> (d<sub>x²-y²</sub>)</p>
                  <p>• <strong className="text-white">1 ta 5s orbital</strong></p>
                  <p>• <strong className="text-white">2 ta 5p orbital</strong> (p<sub>x</sub> va p<sub>y</sub>)</p>
                  <p>• <strong className="text-yellow-300">Jami:</strong> 4 ta dsp² gibrid orbital → 4 ta σ-bog' (kvadrat-tekis)</p>
                  <p className="text-xs text-purple-400 mt-2">
                    Qolgan 8 ta d-elektron <strong className="text-white">to'liq juftlashgan</strong> 
                    (4 ta to'liq orbital) → <strong className="text-green-400">diamagnit</strong>.
                    4d metallari (Rh⁺, Ir⁺, Pd²⁺, Pt²⁺) deyarli har doim kvadrat-tekis.
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
                  <p>• <strong className="text-white">Rh⁺ (d⁸):</strong> 8 ta d-elektron</p>
                  <p>• <strong className="text-yellow-300">Jami:</strong> 8 + 8 = 16 elektron (18 emas!)</p>
                  <p>• <strong className="text-white">Natija:</strong> <strong className="text-red-300">bo'sh koordinatsion joy</strong> — kichik molekulalar (H₂, alkenlar) kirishi mumkin</p>
                  <p className="text-xs text-purple-400 mt-2">
                    Bu <strong className="text-pink-300">katalitik faollikning</strong> asosiy sababi — 
                    Wilkinson katalizatori H₂ va alkenlar bilan reaksiyaga kirishadi!
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
                <h2 className="text-xl md:text-2xl font-bold text-white">PPh₃ ligandlari bog'lanish mexanizmi</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-pink-950/50 rounded-xl p-5 border border-pink-700/30">
                  <h3 className="text-pink-400 font-bold mb-3">1️⃣ σ-donatsiya (P → Rh)</h3>
                  <div className="bg-pink-900/40 rounded-lg p-4 font-mono text-xs text-pink-200 border border-pink-700/30 mb-3">
                    <pre className="whitespace-pre">{`  PPh₃ → Rh⁺
  
  P ning yolg'iz elektron jufti
  Rh ning bo'sh dsp² orbitaliga
  elektron juftini beradi`}</pre>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">P ning yolg'iz jufti:</strong> sp³ gibrid orbital</p>
                    <p>• <strong className="text-white">Rh ning dsp²:</strong> bo'sh gibrid orbital</p>
                    <p>• Natija: <strong className="text-pink-300">Rh←P σ-bog'</strong></p>
                    <p>• <strong className="text-yellow-300">Kuchli σ-donor:</strong> P juda yaxshi donor</p>
                  </div>
                </div>

                <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
                  <h3 className="text-purple-400 font-bold mb-3">2️⃣ π-backbonding (Rh → P)</h3>
                  <div className="bg-purple-900/40 rounded-lg p-4 font-mono text-xs text-purple-200 border border-purple-700/30 mb-3">
                    <pre className="whitespace-pre">{`  Rh⁺ → PPh₃
  
  Rh ning to'lgan d-orbitallari
  P ning bo'sh d-orbitallariga
  elektron qaytaradi (kuchsiz)`}</pre>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Rh ning to'lgan d-orbitallari:</strong> 8 ta d-elektron</p>
                    <p>• <strong className="text-white">P ning bo'sh d-orbitallari:</strong> π-akseptor</p>
                    <p>• Natija: <strong className="text-purple-300">Rh→P π-bog'</strong> (kuchsiz)</p>
                    <p>• <strong className="text-yellow-300">Kuchsiz π-akseptor:</strong> P kuchsiz akseptor</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 rounded-2xl p-5">
                <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                  <span>⚡</span> PPh₃ ning xususiyatlari
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Kuchli σ-donor:</strong> P juda yaxshi elektron donor</p>
                  <p>• <strong className="text-white">Kuchsiz π-akseptor:</strong> P kuchsiz elektron akseptor</p>
                  <p>• <strong className="text-white">Katta sterik:</strong> 3 ta fenil guruhi — sterik to'siq</p>
                  <p>• <strong className="text-yellow-300">Natija:</strong> Bir PPh₃ dissotsiatsiyalanadi → 14 elektronli faol kompleks</p>
                  <p className="text-xs text-purple-400 mt-2">
                    Bu <strong className="text-pink-300">katalitik siklning birinchi bosqichi</strong> — 
                    PPh₃ dissotsiatsiyasi bo'sh koordinatsion joy yaratadi!
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* CATALYSIS TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "catalysis" && (
          <>
            <div className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border border-emerald-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-xl shadow-lg shadow-emerald-500/30">
                  ⚗️
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Gidrogenlash mexanizmi — katalitik sikl</h2>
              </div>
              
              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-2 border-emerald-500/30 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-emerald-400">Wilkinson katalizatori</strong> alkenlarni 
                  <strong className="text-yellow-300"> selektiv gidrogenlash</strong> uchun ishlatiladi.
                  Katalitik sikl <strong className="text-white">5 bosqichdan</strong> iborat:
                  (1) PPh₃ dissotsiatsiyasi, (2) H₂ oksidativ birikishi, (3) alken koordinatsiyasi,
                  (4) migratsion inseratsiya, (5) alkan eliminatsiyasi.
                </p>
              </div>

              {/* KATALITIK SIKL BOSQICHLARI */}
              <div className="flex gap-3 mb-6">
                {[1, 2, 3, 4, 5].map(step => (
                  <button
                    key={step}
                    onClick={() => setReactionStep(step)}
                    className={`flex-1 py-3 rounded-xl border-2 transition-all ${
                      reactionStep === step
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                        : 'bg-white/5 border-white/10 text-purple-300 hover:bg-white/10'
                    }`}
                  >
                    {step}-bosqich
                  </button>
                ))}
              </div>

              {/* JORIY BOSQICH MA'LUMOTLARI */}
              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-2 border-emerald-500/30 rounded-2xl p-5 mb-6">
                <h3 className="text-emerald-400 font-bold mb-3">{reactionStep}-bosqich: {currentStep.name}</h3>
                <div className="bg-emerald-900/40 rounded-lg p-4 font-mono text-sm text-emerald-200 border border-emerald-700/30 mb-4 text-center">
                  <p>{currentStep.formula}</p>
                  <p className="mt-2 text-emerald-300 text-xs">{currentStep.description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-emerald-900/30 rounded-lg p-3 border border-emerald-700/30 text-center">
                    <div className="text-emerald-300 text-xs uppercase mb-1">Elektronlar</div>
                    <div className="text-white font-bold text-lg">{currentStep.electronCount}</div>
                  </div>
                  <div className="bg-emerald-900/30 rounded-lg p-3 border border-emerald-700/30 text-center">
                    <div className="text-emerald-300 text-xs uppercase mb-1">Oksidlanish</div>
                    <div className="text-white font-bold text-lg">{currentStep.oxidationState}</div>
                  </div>
                  <div className="bg-emerald-900/30 rounded-lg p-3 border border-emerald-700/30 text-center">
                    <div className="text-emerald-300 text-xs uppercase mb-1">Geometriya</div>
                    <div className="text-white font-bold text-lg">{currentStep.geometry}</div>
                  </div>
                </div>
              </div>

              {/* MEXANIZM TAFSILOTLARI */}
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-5">
                <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                  <span>💡</span> Katalitik sikl tafsilotlari
                </h3>
                <div className="space-y-3 text-sm text-purple-200">
                  <div className="bg-yellow-900/30 rounded-lg p-3 border border-yellow-700/30">
                    <p className="text-yellow-300 font-bold text-xs mb-1">1. PPh₃ dissotsiatsiyasi</p>
                    <p className="text-xs">[RhCl(PPh₃)₃] → [RhCl(PPh₃)₂] + PPh₃ (16 → 14 e⁻)</p>
                  </div>
                  <div className="bg-yellow-900/30 rounded-lg p-3 border border-yellow-700/30">
                    <p className="text-yellow-300 font-bold text-xs mb-1">2. H₂ oksidativ birikishi</p>
                    <p className="text-xs">[RhCl(PPh₃)₂] + H₂ → [RhCl(H)₂(PPh₃)₂] (14 → 18 e⁻, Rh(I) → Rh(III))</p>
                  </div>
                  <div className="bg-yellow-900/30 rounded-lg p-3 border border-yellow-700/30">
                    <p className="text-yellow-300 font-bold text-xs mb-1">3. Alken koordinatsiyasi</p>
                    <p className="text-xs">[RhCl(H)₂(PPh₃)₂] + alken → [RhCl(H)₂(PPh₃)₂(alken)] (η²-bog'lanish)</p>
                  </div>
                  <div className="bg-yellow-900/30 rounded-lg p-3 border border-yellow-700/30">
                    <p className="text-yellow-300 font-bold text-xs mb-1">4. Migratsion inseratsiya</p>
                    <p className="text-xs">H atomlari alkenga ko'chadi → alkil kompleksi hosil bo'ladi</p>
                  </div>
                  <div className="bg-yellow-900/30 rounded-lg p-3 border border-yellow-700/30">
                    <p className="text-yellow-300 font-bold text-xs mb-1">5. Alkan eliminatsiyasi</p>
                    <p className="text-xs">Alkan eliminatsiyalanadi → [RhCl(PPh₃)₂] qayta tiklanadi (18 → 16 e⁻, Rh(III) → Rh(I))</p>
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
                      { freq: "2040 cm⁻¹", bond: "ν(Rh−H)", desc: "Gidrid cho'qqisi (H₂ birikgandan keyin)", intensity: "Kuchli" },
                      { freq: "305 cm⁻¹", bond: "ν(Rh−Cl)", desc: "Rh-Cl valent tebranish", intensity: "Kuchli" },
                      { freq: "510 cm⁻¹", bond: "ν(Rh−P)", desc: "Rh-P valent tebranish (3 ta)", intensity: "Kuchli" },
                      { freq: "1480 cm⁻¹", bond: "ν(C=C)", desc: "Fenil halqalar (PPh₃)", intensity: "Kuchli" },
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
                      <p className="text-xs">δ = 33 ppm (3 ta ekvivalent P)</p>
                      <p className="text-xs text-emerald-300">J(P-P) = 0 Hz (uzoq)</p>
                    </div>
                    <div className="bg-teal-900/40 rounded-lg p-3 border border-teal-700/30">
                      <p className="text-teal-300 font-bold text-xs mb-1">¹H NMR (PPh₃)</p>
                      <p className="text-xs">δ = 7.2-7.5 ppm (aromatik H)</p>
                      <p className="text-xs text-teal-300">45 ta H (3 × 15 H)</p>
                    </div>
                    <div className="bg-cyan-900/40 rounded-lg p-3 border border-cyan-700/30">
                      <p className="text-cyan-300 font-bold text-xs mb-1">¹H NMR (gidrid)</p>
                      <p className="text-xs">δ = -14 ppm (Rh−H)</p>
                      <p className="text-xs text-cyan-300">J(Rh-H) = 15 Hz</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-5">
                <h3 className="text-green-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> ν(Rh−H) — gidrid indikatori
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Boshlang'ich kompleks:</strong> ν(Rh−H) yo'q (gidrid yo'q)</p>
                  <p>• <strong className="text-white">H₂ birikgandan keyin:</strong> ν(Rh−H) = 2040 cm⁻¹ paydo bo'ladi</p>
                  <p>• <strong className="text-white">¹H NMR:</strong> δ = -14 ppm (yuqori maydon, gidrid)</p>
                  <p className="text-xs text-purple-400 mt-2">
                    <strong className="text-yellow-300">Muhim:</strong> ν(Rh−H) cho'qqisi — 
                    <strong className="text-pink-300"> oksidativ birikish</strong>ning eksperimental isboti!
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Sanoat va ilmiy qo'llanilish</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-amber-950/50 rounded-xl p-5 border border-amber-700/30">
                  <h3 className="text-amber-400 font-bold mb-3">⚗️ Katalitik qo'llanilish</h3>
                  <div className="space-y-3 text-sm text-purple-200">
                    <div className="bg-amber-900/40 rounded-lg p-3 border border-amber-700/30">
                      <p className="text-amber-300 font-bold text-xs mb-1">Alkenlarni gidrogenlash</p>
                      <p className="text-xs">Alkenlarni alkanlarga selektiv aylantirish</p>
                    </div>
                    <div className="bg-amber-900/40 rounded-lg p-3 border border-amber-700/30">
                      <p className="text-amber-300 font-bold text-xs mb-1">Selektivlik</p>
                      <p className="text-xs">Kamroq to'yingan alkenlar afzal (1-alken &gt; 2-alken)</p>
                    </div>
                    <div className="bg-amber-900/40 rounded-lg p-3 border border-amber-700/30">
                      <p className="text-amber-300 font-bold text-xs mb-1">Sharoit</p>
                      <p className="text-xs">Xona harorati, 1 atm H₂, benzol erituvchisi</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-950/50 rounded-xl p-5 border border-orange-700/30">
                  <h3 className="text-orange-400 font-bold mb-3">🧪 Ilmiy qo'llanilish</h3>
                  <div className="space-y-3 text-sm text-purple-200">
                    <div className="bg-orange-900/40 rounded-lg p-3 border border-orange-700/30">
                      <p className="text-orange-300 font-bold text-xs mb-1">Model katalizator</p>
                      <p className="text-xs">Gomogen kataliz mexanizmlarini o'rganish</p>
                    </div>
                    <div className="bg-orange-900/40 rounded-lg p-3 border border-orange-700/30">
                      <p className="text-orange-300 font-bold text-xs mb-1">Katalizator dizayni</p>
                      <p className="text-xs">Yangi katalizatorlar yaratish uchun asos</p>
                    </div>
                    <div className="bg-orange-900/40 rounded-lg p-3 border border-orange-700/30">
                      <p className="text-orange-300 font-bold text-xs mb-1">Organik sintez</p>
                      <p className="text-xs">Murakkab molekulalar sintezi</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-5">
                <h3 className="text-amber-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Nega Wilkinson katalizatori muhim?
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Birinchi gomogen gidrogenlash:</strong> alkenlarni selektiv gidrogenlash</p>
                  <p>• <strong className="text-white">Model katalizator:</strong> oksidativ birikish mexanizmini o'rganish</p>
                  <p>• <strong className="text-white">Sanoat qo'llanilish:</strong> farmatsevtika, organik sintez</p>
                  <p className="text-xs text-purple-400 mt-2">
                    <strong className="text-yellow-300">Qiziq fakt:</strong> Wilkinson katalizatori — bu 
                    <strong className="text-pink-300"> birinchi marta selektiv gidrogenlash</strong> uchun ishlatilgan katalizator!
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
                  <h3 className="text-green-400 font-bold mb-3">1-usul: Klassik sintez (Wilkinson usuli, 1965)</h3>
                  <div className="bg-green-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-green-300 border border-green-700/30">
                    <p>RhCl₃·3H₂O + 4 PPh₃ → [RhCl(PPh₃)₃] + 2 Ph₃P=O + 2 HCl</p>
                    <p className="text-green-300 text-xs mt-2">Etanol, qaynatish, N₂ atmosferasi</p>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Mexanizm:</strong> Rh(III) → Rh(I) qaytarilishi, PPh₃ koordinatsiyasi</p>
                    <p><strong className="text-white">Sharoit:</strong> Etanol erituvchisi, qaynatish (80°C), N₂ atmosferasi</p>
                    <p><strong className="text-white">Vaqt:</strong> 2-3 soat</p>
                    <p><strong className="text-white">Hosildorlik:</strong> 70-80%</p>
                    <p><strong className="text-white">Tozalash:</strong> Qayta kristallizatsiya (benzol/etanol)</p>
                  </div>
                </div>

                <div className="bg-green-950/50 rounded-2xl p-5 border border-green-700/30">
                  <h3 className="text-green-400 font-bold mb-3">2-usul: Zamonaviy sintez (tezroq)</h3>
                  <div className="bg-green-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-green-300 border border-green-700/30">
                    <p>[Rh(COD)Cl]₂ + 6 PPh₃ → 2 [RhCl(PPh₃)₃] + 2 COD</p>
                    <p className="text-green-300 text-xs mt-2">THF, xona harorati</p>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Afzalligi:</strong> Tezroq reaksiya, yuqori hosildorlik</p>
                    <p><strong className="text-white">Sharoit:</strong> THF erituvchisi, xona harorati</p>
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Nobel mukofoti 1973 — Wilkinson va Fischer</h2>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-2xl p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-yellow-600 to-amber-600 flex items-center justify-center text-6xl flex-shrink-0 shadow-2xl">
                    🏆
                  </div>
                  <div className="flex-1">
                    <h3 className="text-yellow-400 font-bold text-xl mb-2">Geoffrey Wilkinson (1921-1996) & Ernst Otto Fischer (1918-2007)</h3>
                    <p className="text-purple-200 text-sm mb-3 leading-relaxed">
                      <strong className="text-yellow-300">1973 yilda</strong> Ingliz kimyogari Geoffrey Wilkinson va 
                      nemis kimyogari Ernst Otto Fischer <strong className="text-white">organometallik kimyo</strong> sohasidagi 
                      kashfiyotlari uchun <strong className="text-yellow-300">Nobel mukofoti</strong>ni oldi.
                      Wilkinson <strong className="text-pink-300">[RhCl(PPh₃)₃]</strong> katalizatorini kashf qildi!
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-xs text-yellow-300 font-semibold">
                        🏆 Nobel 1973
                      </span>
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-xs text-amber-300 font-semibold">
                        📍 London / Munich
                      </span>
                      <span className="px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-xs text-orange-300 font-semibold">
                        ⚗️ Organometallik kimyo
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { year: "1965", title: "Wilkinson kashfiyoti", desc: "Geoffrey Wilkinson [RhCl(PPh₃)₃] ni sintez qildi va uning gidrogenlash katalizatori ekanligini aniqladi" },
                  { year: "1966", title: "Mexanizm tushunilishi", desc: "Katalitik sikl mexanizmi to'liq tushuntirildi — 5 bosqich" },
                  { year: "1970+", title: "Sanoat qo'llanilish", desc: "Wilkinson katalizatori organik sintezda keng qo'llanila boshlandi" },
                  { year: "1973", title: "Nobel mukofoti", desc: "Wilkinson va Fischer organometallik kimyo uchun Nobel oldi" },
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
                  <span>💡</span> Nima uchun Wilkinson katalizatori organometallik kimyoda muhim?
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Birinchi selektiv gidrogenlash:</strong> alkenlarni selektiv gidrogenlash</p>
                  <p>• <strong className="text-white">Model katalizator:</strong> oksidativ birikish mexanizmini o'rganish</p>
                  <p>• <strong className="text-white">Sanoat qo'llanilish:</strong> farmatsevtika, organik sintez</p>
                  <p>• <strong className="text-white">Nobel mukofoti:</strong> organometallik kimyo sohasining rivojlanishi</p>
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
              href="/ilmiy/birikmares/vaska-kompleksi"
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold transition-all flex items-center gap-2"
            >
              <span>←</span>
              <span className="hidden sm:inline">Vaska kompleksi</span>
            </Link>
            <Link 
              href="/ilmiy/birikmares/ferrosen"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white font-bold transition-all shadow-lg shadow-pink-500/30 flex items-center gap-2"
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