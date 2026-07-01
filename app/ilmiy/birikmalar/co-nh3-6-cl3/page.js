"use client"

import Link from "next/link"
import { useState } from "react"

export default function CoNH36Cl3() {
  const [activeTab, setActiveTab] = useState("overview")

  const tabs = [
    { id: "overview", label: "📋 Umumiy", icon: "📋" },
    { id: "structure", label: "🧬 Oktaedrik (Oₕ)", icon: "🧬" },
    { id: "electronic", label: "⚛️ Elektron (d⁶)", icon: "⚛️" },
    { id: "bonding", label: "🔗 Co−N bog'lanish", icon: "🔗" },
    { id: "spectroscopy", label: "🔬 Spektroskopiya", icon: "🔬" },
    { id: "synthesis", label: "⚗️ Sintez", icon: "⚗️" },
    { id: "werner", label: "🏆 Werner seriyasi", icon: "🏆" },
    { id: "applications", label: "🏭 Qo'llanilish", icon: "🏭" },
    { id: "history", label: "🏆 Nobel 1913", icon: "🏆" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white relative overflow-hidden">
      
      {/* ═══ ANIMATED BACKGROUND ═══ */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(168,85,247,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        {['Co³⁺', 'NH₃', 'Oₕ', 'd⁶', 'd²sp³', 't₂g⁶', 'Werner 1893', 'Nobel 1913', 'koordinatsion'].map((sym, i) => (
          <div
            key={i}
            className="absolute text-purple-400/5 font-mono font-bold select-none pointer-events-none"
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
            <span className="text-purple-400 font-semibold">[Co(NH₃)₆]Cl₃</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 text-[10px] text-purple-300 font-bold uppercase tracking-wider">
                  🏆 Werner klassikasi
                </span>
                <span className="px-2.5 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-[10px] text-yellow-300 font-semibold">
                  🏅 Nobel 1913
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] text-emerald-300 font-semibold">
                  ⚛️ 18 elektron (d⁶)
                </span>
                <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-[10px] text-cyan-300 font-semibold">
                  💎 Oₕ simmetriya
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-300 bg-clip-text text-transparent">
                [Co(NH₃)₆]Cl₃
              </h1>
              <p className="text-purple-300 text-sm mt-1">
                Geksaamminkobalt(III) xlorid • Hexaamminecobalt(III) chloride • Luteo-kobalt
              </p>
            </div>
            
            <div className="flex gap-2">
              <Link 
                href="/ilmiy/birikmalar/co-nh3-5-cl-cl2"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 hover:border-pink-400/60 text-pink-300 text-sm font-semibold transition-all flex items-center gap-2"
              >
                <span>💜</span>
                <span className="hidden sm:inline">[Co(NH₃)₅Cl]Cl₂</span>
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
            { label: "Formula", value: "[Co(NH₃)₆]Cl₃", icon: "🧪", color: "text-purple-400" },
            { label: "M massa", value: "267.48 g/mol", icon: "⚖️", color: "text-blue-400" },
            { label: "Geometriya", value: "Oktaedrik (Oₕ)", icon: "💎", color: "text-cyan-400" },
            { label: "Rangi", value: "Sariq-jigarrang", icon: "🎨", color: "text-yellow-400" },
            { label: "Magnit", value: "Diamagnit", icon: "🧲", color: "text-emerald-400" },
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
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/30'
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
            <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  📋
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Asosiy ma'lumotlar</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  ["CAS raqami", "14695-95-5"],
                  ["Zichlik", "1.71 g/cm³"],
                  ["Sistema", "Monoklinik"],
                  ["Fazoviy guruh", "P2₁/c"],
                  ["Eruvchanlik (H₂O)", "Yaxshi eriydi"],
                  ["Eruvchanlik (EtOH)", "Kam eriydi"],
                  ["Barqarorlik", "Juda barqaror (inert)"],
                  ["Rangi", "Sariq-jigarrang kristall"],
                ].map((item, i) => (
                  <div key={i} className="bg-purple-950/50 rounded-xl p-3 border border-purple-700/30">
                    <div className="text-[10px] uppercase tracking-wider text-purple-400 font-semibold mb-1">{item[0]}</div>
                    <div className="text-white font-semibold text-sm">{item[1]}</div>
                  </div>
                ))}
              </div>

              {/* ICHKI/TASHQI SFERA */}
              <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-2xl p-5">
                <h3 className="text-purple-400 font-bold mb-3 flex items-center gap-2">
                  <span>💎</span> Ichki va tashqi sfera
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-700/30">
                    <h4 className="text-purple-300 font-bold text-sm mb-2">🔒 Ichki sfera [Co(NH₃)₆]³⁺</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">Co³⁺</strong> — markaziy ion (3d⁶)</li>
                      <li>• <strong className="text-white">6 × NH₃</strong> — ammiak ligandlari</li>
                      <li>• <strong className="text-white">6 × N</strong> — donor atomlari</li>
                      <li>• <strong className="text-yellow-300">Zaryad:</strong> +3 + 0 = <strong>+3</strong></li>
                      <li>• <strong className="text-pink-300">Koordinatsion son:</strong> 6 (oktaedrik)</li>
                      <li>• <strong className="text-white">Bog'lanish:</strong> Co−N = 1.96 Å</li>
                    </ul>
                  </div>
                  <div className="bg-indigo-900/30 rounded-xl p-4 border border-indigo-700/30">
                    <h4 className="text-indigo-300 font-bold text-sm mb-2">🔓 Tashqi sfera 3Cl⁻</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">3 × Cl⁻</strong> — counter-ionlar</li>
                      <li>• Ion bog'lar bilan bog'langan</li>
                      <li>• Suvda darhol dissotsilanadi</li>
                      <li>• <strong className="text-white">4 ion:</strong> [Co(NH₃)₆]³⁺ + 3Cl⁻</li>
                      <li>• <strong className="text-white">AgNO₃:</strong> 3 mol AgCl cho'kadi (darhol)</li>
                      <li>• <strong className="text-yellow-300">Elektr o'tkazuvchanlik:</strong> 4-ionli elektrolit</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* TARIXIY AHAMIYATI */}
            <div className="bg-gradient-to-r from-yellow-600/10 via-amber-600/10 to-orange-600/10 border-2 border-yellow-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center text-2xl shadow-lg">
                  🏆
                </div>
                <div>
                  <h2 className="text-xl font-bold text-yellow-300">Koordinatsion kimyoning tug'ilishi</h2>
                  <p className="text-purple-300 text-xs">1893 yil — Alfred Werner inqilobi</p>
                </div>
              </div>
              <p className="text-purple-200 text-sm leading-relaxed mb-4">
                <strong className="text-yellow-400">[Co(NH₃)₆]Cl₃</strong> — bu 
                <strong className="text-white"> koordinatsion kimyoning eng muhim klassik birikmalaridan biri</strong>.
                1893 yilda 27 yoshli <strong className="text-amber-300">Alfred Werner</strong> aynan shu birikma va uning hosilalari 
                asosida o'zining <strong className="text-pink-300">koordinatsion nazariyasini</strong> yaratdi. Bu kashfiyot uchun 
                u 1913 yilda <strong className="text-yellow-300">Nobel mukofoti</strong>ni oldi — noorganik kimyoda birinchi Nobel!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-yellow-900/30 rounded-lg p-3 border border-yellow-700/30 text-center">
                  <div className="text-2xl font-bold text-yellow-300">1893</div>
                  <div className="text-xs text-purple-300">Koordinatsion nazariya</div>
                </div>
                <div className="bg-amber-900/30 rounded-lg p-3 border border-amber-700/30 text-center">
                  <div className="text-2xl font-bold text-amber-300">1913</div>
                  <div className="text-xs text-purple-300">Nobel mukofoti</div>
                </div>
                <div className="bg-orange-900/30 rounded-lg p-3 border border-orange-700/30 text-center">
                  <div className="text-2xl font-bold text-orange-300">130+</div>
                  <div className="text-xs text-purple-300">yillik ta'sir</div>
                </div>
              </div>
            </div>

            {/* XULOSA */}
            <div className="bg-gradient-to-r from-purple-600/10 via-indigo-600/10 to-cyan-600/10 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>✅</span> Asosiy xulosalar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "💎 <strong>Oktaedrik geometriya:</strong> Oₕ simmetriya, 6 ta ekvivalent Co−N bog'",
                  "⚛️ <strong>18 elektron (d⁶):</strong> t₂g⁶ eg⁰ — quyi spinli, diamagnit",
                  "🔗 <strong>σ-donatsiya:</strong> NH₃ → Co³⁺ (NH₃ kuchli σ-donor)",
                  "🎨 <strong>Rang:</strong> sariq-jigarrang (λmax ≈ 475 nm, d-d o'tish)",
                  "🧲 <strong>Diamagnit:</strong> barcha elektronlar juftlashgan (μ = 0 BM)",
                  "🏆 <strong>Werner klassikasi:</strong> koordinatsion kimyo asoschisi (Nobel 1913)",
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
            <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  🧬
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Oktaedrik geometriya (Oₕ simmetriya)</h2>
              </div>
              
              <div className="bg-indigo-950/60 rounded-xl p-5 font-mono text-sm text-indigo-200 border border-indigo-700/30 mb-6 text-center">
                <pre className="whitespace-pre">{`           NH₃
            |
   NH₃ — Co — NH₃      ← Oktaedrik
            |               6 ta ekvivalent Co−N bog'
           NH₃
        (yuqorida/pastda NH₃)
        
   Oₕ simmetriya: 48 ta simmetriya operatsiyasi
   Eng yuqori simmetriya — mukammal oktaedr!`}</pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-purple-400 font-bold text-sm uppercase tracking-wider">Geometrik parametrlar</h3>
                  <div className="space-y-2">
                    {[
                      ["Geometriya", "Oktaedrik"],
                      ["Nuqtali guruh", "Oₕ"],
                      ["Koordinatsion son", "6"],
                      ["Co−N masofa", "1.96 Å (6 ta, ekvivalent)"],
                      ["N−H masofa", "1.01 Å"],
                      ["N−Co−N (cis)", "90° (12 ta)"],
                      ["N−Co−N (trans)", "180° (3 ta)"],
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-purple-800/30">
                        <span className="text-purple-300 text-sm">{item[0]}</span>
                        <span className="text-white font-semibold text-sm font-mono">{item[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-indigo-400 font-bold text-sm uppercase tracking-wider">Oₕ simmetriya elementlari</h3>
                  <div className="space-y-2">
                    {[
                      ["E", "Ayniylik"],
                      ["8C₃", "4 ta C₃ o'qi (kub diagonallari)"],
                      ["3C₄", "3 ta C₄ o'qi (x, y, z)"],
                      ["6C₂", "6 ta C₂ o'qi (qirralar orqali)"],
                      ["i", "Inversiya markazi (Co da)"],
                      ["3σₕ", "Gorizontal tekisliklar"],
                      ["6σ_d", "Diagonal tekisliklar"],
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-1.5 border-b border-indigo-800/30">
                        <span className="text-indigo-300 text-sm font-mono font-bold">{item[0]}</span>
                        <span className="text-purple-200 text-xs">{item[1]}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-indigo-950/50 rounded-xl p-3 border border-indigo-700/30 mt-3">
                    <p className="text-indigo-200 text-xs">
                      <strong className="text-indigo-400">Jami:</strong> 48 ta simmetriya operatsiyasi — 
                      <strong className="text-yellow-300"> eng yuqori simmetriya!</strong>
                    </p>
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Elektron tuzilishi — Co³⁺ (3d⁶)</h2>
              </div>
              
              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-2 border-emerald-500/30 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-emerald-400">Co³⁺</strong> — bu <strong className="text-yellow-300">d⁶</strong> konfiguratsiyali ion.
                  <strong className="text-white"> NH₃ kuchli maydon ligandi</strong> bo'lgani uchun, 
                  Δₒ &gt; P → <strong className="text-pink-300">quyi spinli</strong> holat yuzaga keladi.
                  Barcha 6 ta elektron <strong className="text-white">t₂g</strong> da juftlashgan → 
                  <strong className="text-emerald-300"> diamagnit</strong> (μ = 0 BM).
                </p>
              </div>

              {/* ELEKTRON HISOB */}
              <div className="bg-emerald-950/50 rounded-2xl p-6 border border-emerald-700/30 mb-6">
                <h3 className="text-emerald-400 font-bold mb-4">[Co(NH₃)₆]³⁺ uchun elektron hisobi</h3>
                <div className="space-y-3">
                  <div className="bg-emerald-900/40 rounded-xl p-4 border border-emerald-700/30 flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold">Co³⁺ (kobalt)</div>
                      <div className="text-purple-300 text-xs mt-1">Konfiguratsiya: [Ar] 3d⁶ → 6 ta d-elektron</div>
                    </div>
                    <div className="text-emerald-300 text-2xl font-bold font-mono">6 e⁻</div>
                  </div>
                  <div className="bg-emerald-900/40 rounded-xl p-4 border border-emerald-700/30 flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold">6 × NH₃</div>
                      <div className="text-purple-300 text-xs mt-1">Har bir NH₃ 2 ta elektron beradi (σ-donor)</div>
                    </div>
                    <div className="text-emerald-300 text-2xl font-bold font-mono">6 × 2 = 12 e⁻</div>
                  </div>
                  <div className="bg-yellow-900/40 rounded-xl p-4 border-2 border-yellow-500/30 flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold text-lg">JAMI</div>
                      <div className="text-yellow-300 text-xs mt-1">18 elektron qoidasi bajarildi ✓ (Kr konfiguratsiyasi)</div>
                    </div>
                    <div className="text-yellow-300 text-3xl font-bold font-mono">18 e⁻</div>
                  </div>
                </div>
              </div>

              {/* d-ORBITAL DIAGRAMMA */}
              <div className="bg-gradient-to-br from-purple-900/40 to-violet-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                    📊
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">Kristall maydon d-orbital ajralishi</h2>
                </div>
                
                <div className="bg-violet-950/50 rounded-2xl p-5 border border-violet-700/30 mb-6">
                  <div className="bg-violet-900/60 rounded-xl p-4 font-mono text-sm text-violet-200 border border-violet-700/30 mb-4">
                    <p>Oktaedrik maydonda d-orbitallar ikki guruhga ajraladi:</p>
                    <p className="mt-2"><span className="text-purple-300">t₂g</span> (quyi energiya): d<sub>xy</sub>, d<sub>xz</sub>, d<sub>yz</sub></p>
                    <p><span className="text-yellow-300">e_g</span> (yuqori energiya): d<sub>z²</sub>, d<sub>x²-y²</sub></p>
                    <p className="text-white font-bold mt-3 text-lg">Δₒ = 23,000 cm⁻¹ (NH₃ — kuchli maydon)</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-violet-900/40 rounded-xl p-4 border border-violet-700/30 text-center">
                      <div className="text-violet-300 text-xs uppercase mb-1">Konfiguratsiya</div>
                      <div className="text-white font-mono font-bold text-lg">t₂g⁶ e_g⁰</div>
                    </div>
                    <div className="bg-violet-900/40 rounded-xl p-4 border border-violet-700/30 text-center">
                      <div className="text-violet-300 text-xs uppercase mb-1">Spin holati</div>
                      <div className="text-white font-bold text-lg">Quyi spinli (LS)</div>
                    </div>
                    <div className="bg-violet-900/40 rounded-xl p-4 border border-violet-700/30 text-center">
                      <div className="text-violet-300 text-xs uppercase mb-1">Juftlashmagan e⁻</div>
                      <div className="text-emerald-300 font-bold text-lg">0 (diamagnit)</div>
                    </div>
                  </div>
                </div>

                {/* KMBE */}
                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-5">
                  <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                    <span>💡</span> Kristall maydon barqarorlashuv energiyasi (KMBE)
                  </h3>
                  <div className="bg-yellow-950/50 rounded-xl p-4 border border-yellow-700/30 mb-4">
                    <div className="font-mono text-sm text-yellow-200 space-y-1">
                      <p>KMBE = (t₂g e⁻) × (−0.4Δₒ) + (e_g e⁻) × (+0.6Δₒ)</p>
                      <p className="mt-2">KMBE = 6 × (−0.4Δₒ) + 0 × (+0.6Δₒ)</p>
                      <p className="text-white font-bold mt-2 text-lg">KMBE = −2.4Δₒ</p>
                      <p className="text-yellow-300 mt-2">≈ −662 kJ/mol (juda katta!)</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Maksimal KMBE:</strong> d⁶ quyi spinli uchun −2.4Δₒ — eng katta qiymat</p>
                    <p>• <strong className="text-white">Natija:</strong> [Co(NH₃)₆]³⁺ <strong className="text-yellow-300">juda barqaror</strong> va <strong className="text-pink-300">inert</strong></p>
                    <p>• <strong className="text-white">Ligand almashinishi:</strong> xona haroratida deyarli bormaydi (kunlar/haftalar)</p>
                  </div>
                </div>
              </div>

              {/* GIBRIDLANISH */}
              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-5 mt-6">
                <h3 className="text-cyan-400 font-bold mb-3 flex items-center gap-2">
                  <span>💡</span> d²sp³ gibridlanish
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">2 ta 3d orbital</strong> (bo'sh — t₂g dan)</p>
                  <p>• <strong className="text-white">1 ta 4s orbital</strong></p>
                  <p>• <strong className="text-white">3 ta 4p orbital</strong> (p<sub>x</sub>, p<sub>y</sub>, p<sub>z</sub>)</p>
                  <p>• <strong className="text-yellow-300">Jami:</strong> 6 ta d²sp³ gibrid orbital → 6 ta σ-bog' (oktaedrik)</p>
                  <p className="text-xs text-purple-400 mt-2">
                    Bu <strong className="text-pink-300">ichki orbital kompleksi</strong> — 3d orbitallar ishlatiladi (4d emas).
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Co−N bog'lanish mexanizmi</h2>
              </div>
              
              <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-2 border-pink-500/30 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-pink-400">NH₃ ligandi</strong> — bu 
                  <strong className="text-white"> kuchli σ-donor</strong>. Uning yolg'iz elektron jufti 
                  (N atomida) <strong className="text-yellow-300">Co³⁺ ning bo'sh d²sp³ orbitallariga</strong> donatsiya qiladi.
                  NH₃ kuchsiz π-donor bo'lgani uchun, asosan <strong className="text-pink-300">σ-bog'lanish</strong> sodir bo'ladi.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-pink-950/50 rounded-xl p-5 border border-pink-700/30">
                  <h3 className="text-pink-400 font-bold mb-3">🔵 Co³⁺ (akseptor)</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Oksidlanish darajasi:</strong> +3</p>
                    <p>• <strong className="text-white">Konfiguratsiya:</strong> [Ar] 3d⁶</p>
                    <p>• <strong className="text-white">Bo'sh orbitallar:</strong> 2 ta 3d, 1 ta 4s, 3 ta 4p</p>
                    <p>• <strong className="text-pink-300">Rol:</strong> Lewis kislotasi (akseptor)</p>
                  </div>
                </div>

                <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
                  <h3 className="text-purple-400 font-bold mb-3">🔗 NH₃ (donor)</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">N atomi:</strong> sp³ gibridlangan</p>
                    <p>• <strong className="text-white">Yolg'iz juft:</strong> N da 1 ta</p>
                    <p>• <strong className="text-white">σ-donatsiya:</strong> N → Co</p>
                    <p>• <strong className="text-purple-300">Rol:</strong> Lewis asosi (donor)</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-5">
                <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Bog'lanish xususiyatlari
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Co−N bog' uzunligi:</strong> 1.96 Å (barcha 6 ta ekvivalent)</p>
                  <p>• <strong className="text-white">Bog' energiyasi:</strong> ~200-250 kJ/mol</p>
                  <p>• <strong className="text-white">Bog' tartibi:</strong> 1 (asosan σ-bog')</p>
                  <p>• <strong className="text-yellow-300">Natija:</strong> Kuchli, barqaror bog'lar → inert kompleks</p>
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
                      <p className="text-green-300 font-bold text-xs mb-1">d-d o'tish: ¹A₁g → ¹T₁g</p>
                      <p className="text-xs">λ<sub>max</sub> = 475 nm (ko'k-yashil)</p>
                      <p className="text-xs text-green-300">ε ≈ 80 L·mol⁻¹·cm⁻¹</p>
                    </div>
                    <div className="bg-emerald-900/40 rounded-lg p-3 border border-emerald-700/30">
                      <p className="text-emerald-300 font-bold text-xs mb-1">d-d o'tish: ¹A₁g → ¹T₂g</p>
                      <p className="text-xs">λ<sub>max</sub> = 340 nm (UV)</p>
                      <p className="text-xs text-emerald-300">ε ≈ 60 L·mol⁻¹·cm⁻¹</p>
                    </div>
                  </div>
                  <div className="mt-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-2">
                    <p className="text-yellow-200 text-xs">
                      <strong>Rang:</strong> Sariq-jigarrang (ko'k-yashil yutiladi → qo'shimcha rang ko'rinadi)
                    </p>
                  </div>
                </div>

                <div className="bg-emerald-950/50 rounded-xl p-5 border border-emerald-700/30">
                  <h3 className="text-emerald-400 font-bold mb-3">📡 IR spektroskopiya</h3>
                  <div className="space-y-2">
                    {[
                      { freq: "3300-3200 cm⁻¹", bond: "ν(N−H)", desc: "NH₃ valent tebranish", intensity: "Kuchli" },
                      { freq: "1620-1580 cm⁻¹", bond: "δ(NH₃)", desc: "NH₃ egilish", intensity: "O'rta" },
                      { freq: "~500 cm⁻¹", bond: "ν(Co−N)", desc: "Co-N valent (a₁g)", intensity: "Kuchli" },
                      { freq: "~450 cm⁻¹", bond: "ν(Co−N)", desc: "Co-N valent (t₁u)", intensity: "Kuchli" },
                      { freq: "~320 cm⁻¹", bond: "δ(N-Co-N)", desc: "Egilish (e_g)", intensity: "O'rta" },
                    ].map((item, i) => (
                      <div key={i} className="bg-emerald-900/40 rounded-lg p-2 border border-emerald-700/30">
                        <div className="flex justify-between items-center">
                          <span className="text-emerald-400 font-mono text-xs">{item.freq}</span>
                          <span className="text-white text-xs">{item.bond}</span>
                        </div>
                        <p className="text-purple-300 text-[10px] mt-0.5">{item.desc} • {item.intensity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-teal-950/50 rounded-xl p-5 border border-teal-700/30">
                  <h3 className="text-teal-400 font-bold mb-3">🧲 NMR spektroskopiya</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <div className="bg-teal-900/40 rounded-lg p-3 border border-teal-700/30">
                      <p className="text-teal-300 font-bold text-xs mb-1">⁵⁹Co NMR</p>
                      <p className="text-xs">δ ≈ 8200 ppm (keng signal)</p>
                    </div>
                    <div className="bg-cyan-900/40 rounded-lg p-3 border border-cyan-700/30">
                      <p className="text-cyan-300 font-bold text-xs mb-1">¹H NMR (D₂O)</p>
                      <p className="text-xs">δ = 3.5 ppm (18 ta H ekvivalent)</p>
                    </div>
                  </div>
                </div>

                <div className="bg-cyan-950/50 rounded-xl p-5 border border-cyan-700/30">
                  <h3 className="text-cyan-400 font-bold mb-3">🔬 Boshqa usullar</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <div className="bg-cyan-900/40 rounded-lg p-3 border border-cyan-700/30">
                      <p className="text-cyan-300 font-bold text-xs mb-1">Magnit o'lchovlar</p>
                      <p className="text-xs">μ_eff = 0 BM (diamagnit)</p>
                    </div>
                    <div className="bg-blue-900/40 rounded-lg p-3 border border-blue-700/30">
                      <p className="text-blue-300 font-bold text-xs mb-1">Elektr o'tkazuvchanlik</p>
                      <p className="text-xs">Λ<sub>m</sub> ≈ 430 S·cm²·mol⁻¹ (4-ionli)</p>
                    </div>
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
                  <h3 className="text-green-400 font-bold mb-3">1-usul: Havo kislorodi bilan oksidlash (klassik)</h3>
                  <div className="bg-green-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-green-300 border border-green-700/30">
                    <p>4 CoCl₂ + 4 NH₄Cl + 20 NH₃ + O₂ → 4 [Co(NH₃)₆]Cl₃ + 2 H₂O</p>
                    <p className="text-green-300 text-xs mt-2">Faollangan ko'mir katalizatori, 60°C, havo puflash</p>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Mexanizm:</strong> Co²⁺ → Co³⁺ oksidlanishi (havo O₂ bilan)</p>
                    <p><strong className="text-white">Katalizator:</strong> Faollangan ko'mir</p>
                    <p><strong className="text-white">Hosildorlik:</strong> 70-80%</p>
                    <p><strong className="text-white">Tozalash:</strong> Qayta kristallizatsiya (suvdan)</p>
                  </div>
                </div>

                <div className="bg-green-950/50 rounded-2xl p-5 border border-green-700/30">
                  <h3 className="text-green-400 font-bold mb-3">2-usul: H₂O₂ bilan oksidlash (tezroq)</h3>
                  <div className="bg-green-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-green-300 border border-green-700/30">
                    <p>2 CoCl₂ + 2 NH₄Cl + 10 NH₃ + H₂O₂ → 2 [Co(NH₃)₆]Cl₃ + 2 H₂O</p>
                    <p className="text-green-300 text-xs mt-2">H₂O₂ kuchli oksidlovchi, xona harorati</p>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Afzalligi:</strong> Tezroq, yuqori hosildorlik</p>
                    <p><strong className="text-white">Hosildorlik:</strong> 85-90%</p>
                    <p><strong className="text-white">Vaqt:</strong> 30-60 daqiqa</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* WERNER SERIES TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "werner" && (
          <>
            <div className="bg-gradient-to-br from-yellow-900/40 to-amber-900/40 border border-yellow-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center text-xl shadow-lg shadow-yellow-500/30">
                  🏆
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Werner seriyasi — klassik komplekslar oilasi</h2>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-2 border-yellow-500/30 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-yellow-400">Werner seriyasi</strong> — bu Co³⁺ asosidagi klassik komplekslar oilasi.
                  Har bir kompleksda NH₃ va Cl⁻ ligandlari soni o'zgaradi, natijada 
                  <strong className="text-pink-300"> turli xususiyatlar</strong> yuzaga keladi. Werner aynan shu oila orqali 
                  <strong className="text-white"> koordinatsion nazariyani</strong> isbotladi!
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-yellow-950/60">
                    <tr>
                      <th className="py-3 px-4 text-yellow-300 text-left">Kompleks</th>
                      <th className="py-3 px-4 text-yellow-300 text-left">Ionlar</th>
                      <th className="py-3 px-4 text-yellow-300 text-left">Rang</th>
                      <th className="py-3 px-4 text-yellow-300 text-left">AgCl cho'kma</th>
                      <th className="py-3 px-4 text-yellow-300 text-left">Tarixiy nom</th>
                    </tr>
                  </thead>
                  <tbody className="text-purple-200">
                    <tr className="border-b border-yellow-800/30 bg-yellow-900/20">
                      <td className="py-3 px-4 font-mono text-yellow-300 font-bold">[Co(NH₃)₆]Cl₃ ← Siz</td>
                      <td className="py-3 px-4">4 ion</td>
                      <td className="py-3 px-4">Sariq-jigarrang</td>
                      <td className="py-3 px-4">3 mol AgCl</td>
                      <td className="py-3 px-4 text-yellow-300">Luteo</td>
                    </tr>
                    <tr className="border-b border-yellow-800/30">
                      <td className="py-3 px-4 font-mono">[Co(NH₃)₅Cl]Cl₂</td>
                      <td className="py-3 px-4">3 ion</td>
                      <td className="py-3 px-4">Pushti-binafsha</td>
                      <td className="py-3 px-4">2 mol AgCl</td>
                      <td className="py-3 px-4 text-pink-300">Purpureo</td>
                    </tr>
                    <tr className="border-b border-yellow-800/30">
                      <td className="py-3 px-4 font-mono">[Co(NH₃)₄Cl₂]Cl</td>
                      <td className="py-3 px-4">2 ion</td>
                      <td className="py-3 px-4">Yashil (trans)</td>
                      <td className="py-3 px-4">1 mol AgCl</td>
                      <td className="py-3 px-4 text-emerald-300">Praseo</td>
                    </tr>
                    <tr className="border-b border-yellow-800/30">
                      <td className="py-3 px-4 font-mono">[Co(NH₃)₃Cl₃]</td>
                      <td className="py-3 px-4">0 ion</td>
                      <td className="py-3 px-4">Yashil-kulrang</td>
                      <td className="py-3 px-4">0 mol AgCl</td>
                      <td className="py-3 px-4 text-purple-300">Neytral</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-2xl p-5 mt-6">
                <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Werner isboti
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">AgNO₃ testi:</strong> faqat tashqi sferadagi Cl⁻ cho'kadi</p>
                  <p>• <strong className="text-white">Elektr o'tkazuvchanlik:</strong> ionlar soni bilan bog'liq</p>
                  <p>• <strong className="text-yellow-300">Natija:</strong> koordinatsion son = 6 (doimo!)</p>
                  <p>• <strong className="text-pink-300">Xulosa:</strong> ligandlar ichki sferada, counter-ionlar tashqarida</p>
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Qo'llanilish</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-amber-950/50 rounded-xl p-5 border border-amber-700/30">
                  <h3 className="text-amber-400 font-bold mb-3">🔬 Ilmiy ahamiyat</h3>
                  <div className="space-y-3 text-sm text-purple-200">
                    <div className="bg-amber-900/40 rounded-lg p-3 border border-amber-700/30">
                      <p className="text-amber-300 font-bold text-xs mb-1">Koordinatsion kimyo asosi</p>
                      <p className="text-xs">Werner nazariyasining klassik namunasi</p>
                    </div>
                    <div className="bg-amber-900/40 rounded-lg p-3 border border-amber-700/30">
                      <p className="text-amber-300 font-bold text-xs mb-1">Ta'lim</p>
                      <p className="text-xs">Koordinatsion son, geometriya, magnit xossalar</p>
                    </div>
                    <div className="bg-amber-900/40 rounded-lg p-3 border border-amber-700/30">
                      <p className="text-amber-300 font-bold text-xs mb-1">Model kompleksi</p>
                      <p className="text-xs">Inert komplekslar uchun standart</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-950/50 rounded-xl p-5 border border-orange-700/30">
                  <h3 className="text-orange-400 font-bold mb-3">⚗️ Sanoat qo'llanilish</h3>
                  <div className="space-y-3 text-sm text-purple-200">
                    <div className="bg-orange-900/40 rounded-lg p-3 border border-orange-700/30">
                      <p className="text-orange-300 font-bold text-xs mb-1">Katalizator</p>
                      <p className="text-xs">Organik sintezda prekursör</p>
                    </div>
                    <div className="bg-orange-900/40 rounded-lg p-3 border border-orange-700/30">
                      <p className="text-orange-300 font-bold text-xs mb-1">Pigmentlar</p>
                      <p className="text-xs">Maxsus pigmentlar ishlab chiqarish</p>
                    </div>
                    <div className="bg-orange-900/40 rounded-lg p-3 border border-orange-700/30">
                      <p className="text-orange-300 font-bold text-xs mb-1">Analitik kimyo</p>
                      <p className="text-xs">Standart modda sifatida</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-amber-900/40 rounded-lg p-3 border border-amber-700/30">
                  <p className="text-amber-300 font-bold text-xs mb-1">💊 Tibbiyot</p>
                  <p className="text-xs text-purple-200">Saraton dorilarining modeli</p>
                </div>
                <div className="bg-amber-900/40 rounded-lg p-3 border border-amber-700/30">
                  <p className="text-amber-300 font-bold text-xs mb-1">🔋 Materiallar</p>
                  <p className="text-xs text-purple-200">Kobalt asosidagi materiallar</p>
                </div>
                <div className="bg-amber-900/40 rounded-lg p-3 border border-amber-700/30">
                  <p className="text-amber-300 font-bold text-xs mb-1">🧬 Biologiya</p>
                  <p className="text-xs text-purple-200">B₁₂ vitaminining modeli</p>
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Alfred Werner — koordinatsion kimyo otasi</h2>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-2xl p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-yellow-600 to-amber-600 flex items-center justify-center text-6xl flex-shrink-0 shadow-2xl">
                    👨‍🔬
                  </div>
                  <div className="flex-1">
                    <h3 className="text-yellow-400 font-bold text-xl mb-2">Alfred Werner (1866-1919)</h3>
                    <p className="text-purple-200 text-sm mb-3 leading-relaxed">
                      <strong className="text-yellow-300">1893 yilda</strong> 27 yoshli nemis kimyogari Alfred Werner 
                      <strong className="text-white"> koordinatsion nazariyani</strong> taklif qildi. U 
                      <strong className="text-pink-300"> [Co(NH₃)₆]Cl₃</strong> va boshqa komplekslar asosida 
                      yangi nazariyani yaratdi. 1913 yilda bu kashfiyot uchun 
                      <strong className="text-yellow-300"> Nobel mukofoti</strong>ni oldi — 
                      <strong className="text-white"> noorganik kimyoda birinchi Nobel!</strong>
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-xs text-yellow-300 font-semibold">
                        📜 1893 yil
                      </span>
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-xs text-amber-300 font-semibold">
                        📍 Zurich universiteti
                      </span>
                      <span className="px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-xs text-orange-300 font-semibold">
                        🏆 Nobel 1913
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { year: "1866", title: "Werner tug'ilishi", desc: "Alfred Werner Mulhouse (Fransiya) da tug'ildi" },
                  { year: "1890", title: "Jørgensen ishlari", desc: "Sophus Jørgensen Co³⁺ komplekslarini sintez qildi, lekin noto'g'ri tushuntirdi" },
                  { year: "1893", title: "Koordinatsion nazariya", desc: "27 yoshli Werner yangi nazariyani taklif qildi — koordinatsion son = 6" },
                  { year: "1893-1910", title: "Eksperimental tasdiq", desc: "Ko'plab Co³⁺ komplekslarini sintez qildi va xususiyatlarini o'rgandi" },
                  { year: "1911", title: "Optik izomerlar", desc: "Birinchi marta noorganik komplekslarda optik izomeriyani ko'rsatdi" },
                  { year: "1913", title: "Nobel mukofoti", desc: "\"Kimyodagi xizmatlari uchun, ayniqsa molekulyar tuzilmalar bo'yicha tadqiqotlari uchun\"" },
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
                  <span>💡</span> Nima uchun Werner ishi kimyo tarixida muhim?
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Koordinatsion son:</strong> Werner birinchi bo'lib "koordinatsion son" tushunchasini kiritdi</p>
                  <p>• <strong className="text-white">Ichki/tashqi sfera:</strong> komplekslarning yangi tasnifi</p>
                  <p>• <strong className="text-white">Geometriya:</strong> oktaedrik, kvadrat-tekis va boshqa geometriyalar</p>
                  <p>• <strong className="text-white">Izomeriya:</strong> strukturaviy va optik izomeriya tushunchalari</p>
                  <p>• <strong className="text-yellow-300">Natija:</strong> butun noorganik kimyo qayta yozildi</p>
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
              href="/ilmiy/birikmares/k-crown-6"
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold transition-all flex items-center gap-2"
            >
              <span>←</span>
              <span className="hidden sm:inline">[K(18-crown-6)]⁺</span>
            </Link>
            <Link 
              href="/ilmiy/birikmares/co-nh3-5-cl-cl2"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-bold transition-all shadow-lg shadow-purple-500/30 flex items-center gap-2"
            >
              <span className="hidden sm:inline">[Co(NH₃)₅Cl]Cl₂</span>
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