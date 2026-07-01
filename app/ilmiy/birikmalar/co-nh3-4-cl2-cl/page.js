"use client"

import Link from "next/link"
import { useState } from "react"

export default function CoNH34Cl2Cl() {
  const [activeTab, setActiveTab] = useState("overview")
  const [activeIsomer, setActiveIsomer] = useState("cis") // cis | trans

  const tabs = [
    { id: "overview", label: "📋 Umumiy", icon: "📋" },
    { id: "isomers", label: "🔄 Sis-trans", icon: "🔄" },
    { id: "structure", label: "🧬 Tuzilish", icon: "🧬" },
    { id: "electronic", label: "⚛️ Elektron", icon: "⚛️" },
    { id: "spectroscopy", label: "🔬 Spektroskopiya", icon: "🔬" },
    { id: "synthesis", label: "⚗️ Sintez", icon: "⚗️" },
    { id: "history", label: "🏆 Tarix", icon: "🏆" },
  ]

  const isomerData = {
    cis: {
      name: "cis-[Co(NH₃)₄Cl₂]⁺",
      commonName: "Violeo-kobalt",
      color: "Binafsha",
      pointGroup: "C₂ᵥ",
      dipoleMoment: "μ > 0 (qutbli)",
      solubility: "Suvda yaxshi eriydi",
      wavelength: "λmax ≈ 535 nm",
      cfse: "-2.4 Δₒ",
    },
    trans: {
      name: "trans-[Co(NH₃)₄Cl₂]⁺",
      commonName: "Praseo-kobalt",
      color: "Yashil",
      pointGroup: "D₄ₕ",
      dipoleMoment: "μ = 0 (qutbsiz)",
      solubility: "Suvda kamroq eriydi",
      wavelength: "λmax ≈ 610 nm",
      cfse: "-2.4 Δₒ",
    },
  }

  const current = isomerData[activeIsomer]

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0118] via-purple-950/50 to-slate-950 text-white relative overflow-hidden">
      
      {/* ═══ ANIMATED BACKGROUND ═══ */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(16,185,129,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        {['Co³⁺', 'NH₃', 'Cl⁻', 'C₂ᵥ', 'D₄ₕ', 't₂g⁶', 'cis-trans', 'Werner'].map((sym, i) => (
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
      <header className="relative z-20 border-b border-white/5 backdrop-blur-xl bg-black/20 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <nav className="flex items-center gap-2 text-xs mb-3 text-purple-400 flex-wrap">
            <Link href="/" className="hover:text-purple-300 transition-colors">🏠 Bosh sahifa</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy" className="hover:text-purple-300 transition-colors">Ilmiy bo'lim</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/birikmalar" className="hover:text-purple-300 transition-colors">Birikmalar bazasi</Link>
            <span className="text-purple-600">›</span>
            <span className="text-emerald-400 font-semibold">[Co(NH₃)₄Cl₂]Cl</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
                  🔄 Sis-trans izomeriya
                </span>
                <span className="px-2.5 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-[10px] text-yellow-300 font-semibold">
                  🏆 Werner klassikasi
                </span>
                <span className="px-2.5 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-[10px] text-green-300 font-semibold">
                  Inert
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-emerald-400 via-teal-400 to-violet-300 bg-clip-text text-transparent">
                [Co(NH₃)₄Cl₂]Cl
              </h1>
              <p className="text-purple-300 text-sm mt-1">
                Tetraammindiklorokobalt(III) xlorid • Tetraamminedichlorocobalt(III) chloride
              </p>
            </div>
            
            <div className="flex gap-2">
              <Link 
                href="/ilmiy/birikmalar/co-nh3-5-cl-cl2"
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-semibold transition-all flex items-center gap-2"
              >
                <span>←</span>
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

      {/* ═══ QUICK STATS BAR (O'ZGARTIRILGAN) ═══ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Formula", value: "[Co(NH₃)₄Cl₂]Cl", icon: "🧪", color: "text-emerald-400" },
            { label: "M massa", value: "233.40 g/mol", icon: "⚖️", color: "text-blue-400" },
            { label: "Geometriya", value: "Oktaedrik", icon: "💎", color: "text-purple-400" },
            { label: "Kompleks rangi", value: "Binafsha / Yashil", icon: "🎨", color: "text-pink-400" },
            { label: "Ionlar", value: "2 ion", icon: "⚡", color: "text-yellow-400" },
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

      {/* ═══ IZOMER SWITCHER ═══ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 mb-8">
        <div className="bg-gradient-to-r from-emerald-900/30 via-teal-900/30 to-violet-900/30 border border-emerald-500/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🔄</span>
            <span className="text-sm font-bold text-white">Izomerni tanlang:</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setActiveIsomer("cis")}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                activeIsomer === "cis"
                  ? 'bg-gradient-to-br from-violet-600/40 to-pink-600/40 border-violet-400/60 shadow-lg shadow-violet-500/20'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              {activeIsomer === "cis" && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs font-bold">✓</div>
              )}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-2xl shadow-lg">
                  💜
                </div>
                <div className="text-left">
                  <div className="font-bold text-white">cis-izomer</div>
                  <div className="text-xs text-violet-300">Violeo-kobalt</div>
                  <div className="text-[10px] text-violet-400 font-mono">C₂ᵥ simmetriya</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setActiveIsomer("trans")}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                activeIsomer === "trans"
                  ? 'bg-gradient-to-br from-emerald-600/40 to-teal-600/40 border-emerald-400/60 shadow-lg shadow-emerald-500/20'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              {activeIsomer === "trans" && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">✓</div>
              )}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-2xl shadow-lg">
                  💚
                </div>
                <div className="text-left">
                  <div className="font-bold text-white">trans-izomer</div>
                  <div className="text-xs text-emerald-300">Praseo-kobalt</div>
                  <div className="text-[10px] text-emerald-400 font-mono">D₄ₕ simmetriya</div>
                </div>
              </div>
            </button>
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
            {/* ASOSIY MA'LUMOTLAR */}
            <div className="bg-gradient-to-br from-purple-900/40 to-emerald-900/40 border border-emerald-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-xl shadow-lg shadow-emerald-500/30">
                  📋
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Asosiy ma'lumotlar — {current.commonName}</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  ["CAS (cis)", "14878-61-0"],
                  ["CAS (trans)", "14970-15-1"],
                  ["Zichlik", "~1.80 g/cm³"],
                  ["Sistema", "Monoklinik"],
                  ["Eruvchanlik (H₂O)", "Yaxshi (cis)"],
                  ["Eruvchanlik (EtOH)", "Kam eriydi"],
                  ["Barqarorlik", "Yuqori (inert)"],
                  ["Rangi", current.color],
                ].map((item, i) => (
                  <div key={i} className="bg-emerald-950/50 rounded-xl p-3 border border-emerald-700/30">
                    <div className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold mb-1">{item[0]}</div>
                    <div className="text-white font-semibold text-sm">{item[1]}</div>
                  </div>
                ))}
              </div>

              {/* ICHKI/TASHQI SFERA */}
              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-5">
                <h3 className="text-emerald-400 font-bold mb-3 flex items-center gap-2">
                  <span>💎</span> Ichki va tashqi sfera
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-emerald-900/30 rounded-xl p-4 border border-emerald-700/30">
                    <h4 className="text-emerald-300 font-bold text-sm mb-2">🔒 Ichki sfera [Co(NH₃)₄Cl₂]⁺</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">Co³⁺</strong> — markaziy ion</li>
                      <li>• <strong className="text-white">4 × NH₃</strong> — ammiak ligandlari</li>
                      <li>• <strong className="text-white">2 × Cl⁻</strong> — xlor ligandlari</li>
                      <li>• <strong className="text-yellow-300">Zaryad:</strong> +3 + 0 + 2×(-1) = <strong>+1</strong></li>
                      <li>• <strong className="text-pink-300">Sis</strong>: 2 ta Cl⁻ yonma-yon (90°)</li>
                      <li>• <strong className="text-emerald-300">Trans</strong>: 2 ta Cl⁻ qarama-qarshi (180°)</li>
                    </ul>
                  </div>
                  <div className="bg-teal-900/30 rounded-xl p-4 border border-teal-700/30">
                    <h4 className="text-teal-300 font-bold text-sm mb-2">🔓 Tashqi sfera Cl⁻</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">1 × Cl⁻</strong> — counter-ion</li>
                      <li>• Ion bog'lar bilan bog'langan</li>
                      <li>• Suvda darhol dissotsilanadi</li>
                      <li>• AgNO₃ bilan <strong className="text-green-400">darhol cho'kadi</strong></li>
                      <li>• <strong className="text-yellow-300">1 mol AgCl</strong> cho'kma hosil qiladi</li>
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Werner seriyasida</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-blue-950/60">
                    <tr>
                      <th className="py-3 px-4 text-blue-400 text-left">Kompleks</th>
                      <th className="py-3 px-4 text-blue-400 text-left">Ionlar</th>
                      <th className="py-3 px-4 text-blue-400 text-left">Rang</th>
                      <th className="py-3 px-4 text-blue-400 text-left">AgCl</th>
                      <th className="py-3 px-4 text-blue-400 text-left">Nom</th>
                    </tr>
                  </thead>
                  <tbody className="text-purple-200">
                    <tr className="border-b border-blue-800/30">
                      <td className="py-3 px-4 font-mono text-blue-300">[Co(NH₃)₆]Cl₃</td>
                      <td className="py-3 px-4">4 ion</td>
                      <td className="py-3 px-4">Sariq</td>
                      <td className="py-3 px-4">3 mol</td>
                      <td className="py-3 px-4 text-yellow-300">Luteo</td>
                    </tr>
                    <tr className="border-b border-blue-800/30">
                      <td className="py-3 px-4 font-mono text-pink-300">[Co(NH₃)₅Cl]Cl₂</td>
                      <td className="py-3 px-4">3 ion</td>
                      <td className="py-3 px-4">Binafsha</td>
                      <td className="py-3 px-4">2 mol</td>
                      <td className="py-3 px-4 text-pink-300">Purpureo</td>
                    </tr>
                    <tr className="border-b border-blue-800/30 bg-emerald-900/20">
                      <td className="py-3 px-4 font-mono text-emerald-300 font-bold">[Co(NH₃)₄Cl₂]Cl ← Siz</td>
                      <td className="py-3 px-4 font-bold text-white">2 ion</td>
                      <td className="py-3 px-4">Binafsha/Yashil</td>
                      <td className="py-3 px-4 font-bold">1 mol</td>
                      <td className="py-3 px-4 text-emerald-300 font-bold">Violeo/Praseo</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono text-purple-300">[Co(NH₃)₃Cl₃]</td>
                      <td className="py-3 px-4">0 ion</td>
                      <td className="py-3 px-4">Kulrang</td>
                      <td className="py-3 px-4">0 mol</td>
                      <td className="py-3 px-4 text-purple-300">Neytral</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* ISOMERS TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "isomers" && (
          <>
            {/* SIS-TRANS TAQQOSLASH */}
            <div className="bg-gradient-to-br from-violet-900/40 to-emerald-900/40 border border-violet-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-emerald-500 flex items-center justify-center text-xl shadow-lg shadow-violet-500/30">
                  🔄
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Sis va Trans izomerlari</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* CIS */}
                <div className="bg-gradient-to-br from-violet-900/40 to-pink-900/40 rounded-2xl p-6 border-2 border-violet-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-2xl shadow-lg">
                      💜
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-violet-300">cis-izomer</h3>
                      <p className="text-violet-400 text-xs">Violeo-kobalt</p>
                    </div>
                  </div>

                  <div className="bg-violet-950/60 rounded-xl p-4 mb-4 font-mono text-xs text-violet-200 border border-violet-700/30">
                    <pre className="whitespace-pre">
{`      NH₃
       |
  Cl — Co — NH₃
       |
  Cl   NH₃
  
  (2 ta Cl⁻ yonma-yon, 90°)`}
                    </pre>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-300">Simmetriya:</span>
                      <span className="text-white font-mono font-bold">C₂ᵥ</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Dipol moment:</span>
                      <span className="text-white font-bold">μ &gt; 0 (qutbli)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Rang:</span>
                      <span className="text-violet-300 font-bold">Binafsha</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">λ<sub>max</sub>:</span>
                      <span className="text-white font-mono">535 nm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Eruvchanlik:</span>
                      <span className="text-white">Yaxshi (qutbli)</span>
                    </div>
                  </div>

                  <div className="mt-4 bg-violet-900/40 rounded-lg p-3 border border-violet-700/30">
                    <p className="text-violet-300 text-xs">
                      <strong className="text-violet-200">Xususiyat:</strong> 2 ta Cl⁻ yonma-yon joylashgan. 
                      Dipol momenti bor (simmetrik emas). Suvda yaxshi eriydi.
                    </p>
                  </div>
                </div>

                {/* TRANS */}
                <div className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 rounded-2xl p-6 border-2 border-emerald-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-2xl shadow-lg">
                      💚
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-emerald-300">trans-izomer</h3>
                      <p className="text-emerald-400 text-xs">Praseo-kobalt</p>
                    </div>
                  </div>

                  <div className="bg-emerald-950/60 rounded-xl p-4 mb-4 font-mono text-xs text-emerald-200 border border-emerald-700/30">
                    <pre className="whitespace-pre">
{`      NH₃
       |
  Cl — Co — Cl
       |
      NH₃

  (2 ta Cl⁻ qarama-qarshi, 180°)`}
                    </pre>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-300">Simmetriya:</span>
                      <span className="text-white font-mono font-bold">D₄ₕ</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Dipol moment:</span>
                      <span className="text-white font-bold">μ = 0 (qutbsiz)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Rang:</span>
                      <span className="text-emerald-300 font-bold">Yashil</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">λ<sub>max</sub>:</span>
                      <span className="text-white font-mono">610 nm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Eruvchanlik:</span>
                      <span className="text-white">Kamroq (qutbsiz)</span>
                    </div>
                  </div>

                  <div className="mt-4 bg-emerald-900/40 rounded-lg p-3 border border-emerald-700/30">
                    <p className="text-emerald-300 text-xs">
                      <strong className="text-emerald-200">Xususiyat:</strong> 2 ta Cl⁻ qarama-qarshi joylashgan. 
                      Dipol momenti yo'q (simmetrik). Suvda kamroq eriydi.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* AJRATISH USULLARI */}
            <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border border-yellow-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-xl shadow-lg shadow-yellow-500/30">
                  🔬
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Izomerlarni ajratish usullari</h2>
              </div>
              
              <div className="space-y-4">
                {[
                  {
                    method: "1. Eruvchanlik farqi",
                    desc: "cis-izomer suvda yaxshi eriydi (qutbli), trans-izomer kamroq eriydi (qutbsiz). Qayta kristallizatsiya orqali ajratish mumkin.",
                    color: "yellow"
                  },
                  {
                    method: "2. Rang farqi",
                    desc: "cis = binafsha, trans = yashil. Vizual tekshirish orqali ham ajratish mumkin.",
                    color: "orange"
                  },
                  {
                    method: "3. Ion almashinuv xromatografiyasi",
                    desc: "cis-izomer kuchliroq bog'lanadi (dipol momenti bor), trans-izomer tezroq chiqadi.",
                    color: "red"
                  },
                  {
                    method: "4. UV-Vis spektroskopiya",
                    desc: "cis: λmax = 535 nm, trans: λmax = 610 nm. Spektral tekshirish orqali aniqlash.",
                    color: "pink"
                  },
                ].map((item, i) => (
                  <div key={i} className={`bg-${item.color}-950/50 rounded-xl p-5 border border-${item.color}-700/30`}>
                    <h3 className={`text-${item.color}-400 font-bold mb-2`}>{item.method}</h3>
                    <p className="text-purple-200 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* OPTIK IZOMERIYA */}
            <div className="bg-gradient-to-br from-pink-900/40 to-rose-900/40 border border-pink-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-xl shadow-lg shadow-pink-500/30">
                  🪞
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Optik izomeriya bormi?</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-pink-950/50 rounded-xl p-5 border border-pink-700/30">
                  <h3 className="text-pink-400 font-bold mb-3">cis-[Co(NH₃)₄Cl₂]⁺</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Simmetriya:</strong> C₂ᵥ</p>
                    <p>• <strong className="text-white">σ tekislik:</strong> 2 ta mavjud</p>
                    <p>• <strong className="text-red-400 font-bold">Optik faol emas!</strong></p>
                    <p className="text-xs text-pink-300">
                      Sababi: σ tekisliklar bor → aks etish simmetriyasi → xiral emas
                    </p>
                  </div>
                </div>
                
                <div className="bg-rose-950/50 rounded-xl p-5 border border-rose-700/30">
                  <h3 className="text-rose-400 font-bold mb-3">trans-[Co(NH₃)₄Cl₂]⁺</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Simmetriya:</strong> D₄ₕ</p>
                    <p>• <strong className="text-white">σ tekislik:</strong> Ko'p mavjud</p>
                    <p>• <strong className="text-red-400 font-bold">Optik faol emas!</strong></p>
                    <p className="text-xs text-rose-300">
                      Sababi: Yuqori simmetriya → aks etish tekisliklari → xiral emas
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20 rounded-2xl p-5 mt-4">
                <h3 className="text-pink-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Eslatma
                </h3>
                <p className="text-purple-200 text-sm">
                  <strong className="text-white">[Co(en)₂Cl₂]⁺</strong> (etilendiamin bilan) da <strong className="text-yellow-300">cis-izomer optik faol</strong>!
                  Chunki en ligandi xelat halqa hosil qiladi va σ tekislikni buzadi. 
                  Bu Werner'ning yana bir buyuk kashfiyoti edi.
                </p>
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
            <div className="bg-gradient-to-br from-purple-900/40 to-emerald-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-emerald-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  💎
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">{current.name} — Geometriya</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-purple-400 font-bold text-sm uppercase tracking-wider">Geometrik parametrlar</h3>
                  <div className="space-y-2">
                    {[
                      ["Geometriya", "Buzilgan oktaedrik"],
                      ["Nuqtali guruh", current.pointGroup],
                      ["Co−N masofa", "1.95 Å (4 ta)"],
                      ["Co−Cl masofa", "2.26 Å (2 ta)"],
                      ["N−Co−N (cis)", "≈ 90°"],
                      ["Cl−Co−Cl (cis)", "≈ 90°" + (activeIsomer === "trans" ? " emas" : "")],
                      ["Cl−Co−Cl (trans)", activeIsomer === "trans" ? "180°" : "mavjud emas"],
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-purple-800/30">
                        <span className="text-purple-300 text-sm">{item[0]}</span>
                        <span className="text-white font-semibold text-sm font-mono">{item[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-emerald-400 font-bold text-sm uppercase tracking-wider">
                    {current.pointGroup} simmetriya elementlari
                  </h3>
                  <div className="space-y-2">
                    {activeIsomer === "cis" ? (
                      <>
                        {[
                          ["E", "Ayniylik"],
                          ["C₂", "Cl-Co-Cl bisector bo'ylab"],
                          ["σᵥ(xz)", "2 ta Cl va Co orqali"],
                          ["σᵥ(yz)", "4 ta NH₃ orqali"],
                        ].map((item, i) => (
                          <div key={i} className="flex justify-between items-center py-1.5 border-b border-violet-800/30">
                            <span className="text-violet-300 text-sm font-mono font-bold">{item[0]}</span>
                            <span className="text-purple-200 text-xs">{item[1]}</span>
                          </div>
                        ))}
                        <div className="bg-violet-950/50 rounded-xl p-3 border border-violet-700/30 mt-3">
                          <p className="text-violet-200 text-xs">
                            <strong className="text-violet-400">Jami:</strong> 4 ta simmetriya operatsiyasi
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        {[
                          ["E", "Ayniylik"],
                          ["C₄", "Cl-Co-Cl o'qi bo'ylab"],
                          ["C₂", "C₄ ning kvadrati"],
                          ["2C₂'", "N-Co-N orqali"],
                          ["2C₂\"", "Diagonal"],
                          ["i", "Inversiya markazi"],
                          ["σₕ", "Gorizontal (4 ta NH₃)"],
                          ["2σᵥ", "Vertikal tekisliklar"],
                          ["2σₐ", "Diagonal tekisliklar"],
                        ].map((item, i) => (
                          <div key={i} className="flex justify-between items-center py-1.5 border-b border-emerald-800/30">
                            <span className="text-emerald-300 text-sm font-mono font-bold">{item[0]}</span>
                            <span className="text-purple-200 text-xs">{item[1]}</span>
                          </div>
                        ))}
                        <div className="bg-emerald-950/50 rounded-xl p-3 border border-emerald-700/30 mt-3">
                          <p className="text-emerald-200 text-xs">
                            <strong className="text-emerald-400">Jami:</strong> 16 ta simmetriya operatsiyasi
                          </p>
                        </div>
                      </>
                    )}
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
                  ["Fazoviy guruh", "P2₁/n"],
                  ["Z", "4"],
                  ["a", "~10.3 Å"],
                  ["b", "~8.0 Å"],
                  ["c", "~11.5 Å"],
                  ["β", "~102°"],
                  ["V", "~950 Å³"],
                ].map((item, i) => (
                  <div key={i} className="bg-blue-950/50 rounded-xl p-3 border border-blue-700/30 text-center">
                    <div className="text-[10px] uppercase tracking-wider text-blue-400 font-semibold">{item[0]}</div>
                    <div className="text-white font-bold font-mono text-sm">{item[1]}</div>
                  </div>
                ))}
              </div>

              <div className="bg-indigo-950/50 rounded-2xl p-5 border border-indigo-700/30">
                <h3 className="text-indigo-400 font-bold mb-3">Vodorod bog'lari tarmog'i</h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">N−H···Cl</strong> vodorod bog'lari kristallni mustahkamlaydi</p>
                  <p>• Har bir NH₃ guruhi tashqi Cl⁻ bilan H-bog' hosil qiladi</p>
                  <p>• <strong className="text-yellow-300">3D tarmoq</strong> — har bir [Co(NH₃)₄Cl₂]⁺ 6 ta Cl⁻ bilan bog'langan</p>
                  <p>• <strong className="text-white">cis-izomer:</strong> kamroq simmetrik → zichroq qadoqlanish</p>
                  <p>• <strong className="text-white">trans-izomer:</strong> ko'proq simmetrik → bo'shroq qadoqlanish</p>
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
                <div className="bg-emerald-950/50 rounded-2xl p-5 border border-emerald-700/30 text-center">
                  <div className="text-4xl mb-2">🟣</div>
                  <div className="text-emerald-400 text-xs uppercase mb-1">Kompleksda</div>
                  <div className="text-white font-mono font-bold">t₂g⁶ e₉⁰</div>
                  <div className="text-green-400 text-xs mt-1">Quyi spinli (LS)</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-5">
                <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                  <span>💡</span> Ikkala izomerda ham bir xil elektron tuzilish
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">NH₃</strong> (kuchli) va <strong className="text-white">Cl⁻</strong> (kuchsiz) aralash maydon</p>
                  <p>• 4 ta NH₃ dominant — o'rtacha Δₒ ≈ 22,000 cm⁻¹</p>
                  <p>• <strong className="text-yellow-300">Δₒ &gt; P</strong> → <strong className="text-green-400">quyi spinli</strong> saqlanadi</p>
                  <p>• Ikkala izomerda ham: <strong className="text-white">t₂g⁶ e₉⁰, n = 0, diamagnit</strong></p>
                </div>
              </div>
            </div>

            {/* RANG NIMA UCHUN FARQLANADI */}
            <div className="bg-gradient-to-br from-pink-900/40 to-violet-900/40 border border-pink-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-violet-500 flex items-center justify-center text-xl shadow-lg shadow-pink-500/30">
                  🎨
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Nega rangi farqlanadi?</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-violet-950/50 rounded-xl p-5 border border-violet-700/30">
                  <h3 className="text-violet-400 font-bold mb-2">cis (binafsha)</h3>
                  <p className="text-purple-200 text-sm">λ<sub>max</sub> = <strong className="text-white font-mono">535 nm</strong></p>
                  <p className="text-purple-300 text-xs mt-2">Yashil-sariq nur yutiladi → binafsha ko'rinadi</p>
                  <p className="text-violet-300 text-xs mt-2">Δₒ ≈ <strong className="text-white font-mono">22,000 cm⁻¹</strong></p>
                </div>
                <div className="bg-emerald-950/50 rounded-xl p-5 border border-emerald-700/30">
                  <h3 className="text-emerald-400 font-bold mb-2">trans (yashil)</h3>
                  <p className="text-purple-200 text-sm">λ<sub>max</sub> = <strong className="text-white font-mono">610 nm</strong></p>
                  <p className="text-purple-300 text-xs mt-2">Qizil nur yutiladi → yashil ko'rinadi</p>
                  <p className="text-emerald-300 text-xs mt-2">Δₒ ≈ <strong className="text-white font-mono">19,000 cm⁻¹</strong></p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-pink-500/10 to-violet-500/10 border border-pink-500/20 rounded-2xl p-5">
                <h3 className="text-pink-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Sababi
                </h3>
                <p className="text-purple-200 text-sm">
                  <strong className="text-white">trans-izomer</strong>da 2 ta Cl⁻ (kuchsiz maydon) bir o'qda joylashgan. 
                  Bu Δₒ ni kamaytiradi (past energiya → uzun to'lqin). 
                  <strong className="text-white">cis-izomer</strong>da 4 ta NH₃ (kuchli maydon) ekvatorial tekislikda, 
                  Δₒ kattaroq (yuqori energiya → qisqa to'lqin).
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
            {/* UB-Vis */}
            <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-xl shadow-lg shadow-green-500/30">
                  🌈
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">UV-Vis — {current.name}</h2>
              </div>
              
              <div className="bg-green-950/50 rounded-2xl p-5 border border-green-700/30 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div>
                    <div className="text-white font-mono font-bold text-lg">{current.name}</div>
                    <div className="text-green-300 text-sm">{current.commonName}</div>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-center">
                      <div className="text-green-400 text-xs">λ<sub>max</sub></div>
                      <div className="text-white font-mono font-bold text-lg">{current.wavelength.split(" ")[1]}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-green-400 text-xs">Rang</div>
                      <div className={`font-bold text-lg ${activeIsomer === "cis" ? "text-violet-300" : "text-emerald-300"}`}>
                        {current.color}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* IQ */}
            <div className="bg-gradient-to-br from-red-900/40 to-pink-900/40 border border-red-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-xl shadow-lg shadow-red-500/30">
                  📡
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">IQ spektroskopiya — izomer farqi</h2>
              </div>
              
              <div className="space-y-3">
                <div className="bg-red-950/50 rounded-xl p-4 border border-red-700/30">
                  <h3 className="text-red-400 font-bold mb-2">Umumiy cho'qqilar (ikkalasida)</h3>
                  <div className="space-y-1.5 text-sm">
                    {[
                      ["3300-3200 cm⁻¹", "ν(N−H)", "NH₃ valent tebranish"],
                      ["1620 cm⁻¹", "δ(H−N−H)", "NH₃ egilish"],
                      ["490-500 cm⁻¹", "ν(Co−N)", "Co-N valent (4 ta)"],
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-1 border-b border-red-800/20">
                        <span className="text-red-400 font-mono text-xs">{item[0]}</span>
                        <span className="text-white text-xs">{item[1]}</span>
                        <span className="text-purple-300 text-xs">{item[2]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-violet-950/50 rounded-xl p-4 border border-violet-700/30">
                    <h3 className="text-violet-400 font-bold mb-2">Faqat cis-izomerda</h3>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-violet-400 font-mono text-xs">320-330 cm⁻¹</span>
                        <span className="text-white text-xs">ν(Co−Cl) — 2 xil</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-violet-400 font-mono text-xs">310-320 cm⁻¹</span>
                        <span className="text-white text-xs">(asimmetrik)</span>
                      </div>
                      <p className="text-violet-300 text-xs mt-2 italic">
                        2 ta Co-Cl bog' simmetrik emas → 2 ta cho'qqi
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-emerald-950/50 rounded-xl p-4 border border-emerald-700/30">
                    <h3 className="text-emerald-400 font-bold mb-2">Faqat trans-izomerda</h3>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-emerald-400 font-mono text-xs">325 cm⁻¹</span>
                        <span className="text-white text-xs">ν(Co−Cl) — 1 xil</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-emerald-400 font-mono text-xs">—</span>
                        <span className="text-white text-xs">(simmetrik)</span>
                      </div>
                      <p className="text-emerald-300 text-xs mt-2 italic">
                        2 ta Co-Cl bog' ekvivalent → 1 ta cho'qqi
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-2xl p-5 mt-6">
                <h3 className="text-red-400 font-bold mb-2 flex items-center gap-2">
                  <span>🎯</span> Diagnostik qoida
                </h3>
                <p className="text-purple-200 text-sm">
                  <strong className="text-white">IQ spektri</strong> orqali sis va trans izomerlarni oson ajratish mumkin:
                  <br/>• <strong className="text-violet-300">cis</strong>: ν(Co−Cl) da <strong>2 ta cho'qqi</strong> (320, 330 cm⁻¹)
                  <br/>• <strong className="text-emerald-300">trans</strong>: ν(Co−Cl) da <strong>1 ta cho'qqi</strong> (325 cm⁻¹)
                </p>
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
                  <h3 className="text-green-400 font-bold mb-3">1-usul: [Co(NH₃)₅Cl]Cl₂ dan (eng oson)</h3>
                  <div className="bg-green-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-green-300 border border-green-700/30">
                    [Co(NH₃)₅Cl]Cl₂ + HCl → [Co(NH₃)₄Cl₂]Cl + NH₄Cl
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Mexanizm:</strong> Bitta NH₃ ligandi Cl⁻ bilan almashinadi</p>
                    <p><strong className="text-white">Sharoit:</strong> Konsentrlangan HCl da qaynatish (80°C, 2-3 soat)</p>
                    <p><strong className="text-white">Natija:</strong> Asosan <strong className="text-emerald-300">trans-izomer</strong> (kinetik mahsulot)</p>
                  </div>
                </div>

                <div className="bg-green-950/50 rounded-2xl p-5 border border-green-700/30">
                  <h3 className="text-green-400 font-bold mb-3">2-usul: CoCl₂ dan to'g'ridan-to'g'ri</h3>
                  <div className="bg-green-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-green-300 border border-green-700/30">
                    2CoCl₂ + 2NH₄Cl + 8NH₃ + H₂O₂ → 2[Co(NH₃)₄Cl₂]Cl + 2H₂O
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Mexanizm:</strong> Co²⁺ → Co³⁺ oksidlanish + ligand birikishi</p>
                    <p><strong className="text-white">Katalizator:</strong> Faollangan ko'mir</p>
                    <p><strong className="text-white">Natija:</strong> Aralash izomerlar (sis + trans)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AJRATISH */}
            <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">
                  🔬
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Izomerlarni ajratish</h2>
              </div>
              
              <div className="space-y-3">
                {[
                  { step: "1", title: "Aralashmani olish", desc: "Sintezdan keyin sis va trans aralashmasi hosil bo'ladi" },
                  { step: "2", title: "Qayta kristallizatsiya", desc: "Suvda eritib, sekin sovutish. Trans-izomer birinchi kristallanadi (kam eruvchan)" },
                  { step: "3", title: "Filtratsiya", desc: "Yashil trans-kristallarni ajratib olish" },
                  { step: "4", title: "Bug'latish", desc: "Qolgan eritmani bug'latib, binafsha cis-kristallarni olish" },
                  { step: "5", title: "Tekshirish", desc: "UV-Vis va IQ bilan tozalikni tasdiqlash" },
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
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* HISTORY TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "history" && (
          <>
            {/* WERNER ISBOTI */}
            <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border border-yellow-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-xl shadow-lg shadow-yellow-500/30">
                  🏆
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Werner nazariyasining isboti</h2>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-6 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-yellow-400">[Co(NH₃)₄Cl₂]Cl</strong> Werner nazariyasining 
                  <strong className="text-white"> uchinchi muhim isboti</strong>dir:
                </p>
                <ul className="space-y-2 mt-3 text-sm text-purple-200">
                  <li>• <strong className="text-white">Koordinatsion son = 6</strong> (4 NH₃ + 2 Cl⁻ ichki sfera)</li>
                  <li>• <strong className="text-white">Ichki sfera:</strong> 2 ta Cl⁻ bog'langan (AgNO₃ bilan cho'kmaydi)</li>
                  <li>• <strong className="text-white">Tashqi sfera:</strong> 1 ta Cl⁻ (AgNO₃ bilan 1 mol AgCl cho'kadi)</li>
                  <li>• <strong className="text-white">Sis-trans izomeriya</strong> — faqat Werner modeli tushuntira oladi!</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-red-950/50 rounded-2xl p-5 border border-red-700/30">
                  <h3 className="text-red-400 font-bold mb-3">❌ Jørgensen (noto'g'ri)</h3>
                  <p className="text-purple-200 text-sm mb-3">Zanjir nazariyasi:</p>
                  <div className="font-mono text-xs text-red-300 bg-red-900/40 p-3 rounded">
                    Co−NH₃−NH₃−NH₃−NH₃<br/>
                    &nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<br/>
                    Cl&nbsp;&nbsp;&nbsp;&nbsp;Cl&nbsp;&nbsp;&nbsp;&nbsp;Cl
                  </div>
                  <p className="text-xs text-red-300 mt-2">
                    Natija: 3 ta Cl⁻ ham tashqarida → 3 mol AgCl kerak
                  </p>
                  <p className="text-xs text-red-300 mt-1">
                    <strong>Sis-trans izomeriya tushuntirilmaydi!</strong>
                  </p>
                </div>
                
                <div className="bg-green-950/50 rounded-2xl p-5 border border-green-700/30">
                  <h3 className="text-green-400 font-bold mb-3">✅ Werner (to'g'ri)</h3>
                  <p className="text-purple-200 text-sm mb-3">Koordinatsion nazariya:</p>
                  <div className="font-mono text-xs text-green-300 bg-green-900/40 p-3 rounded">
                    [Co(NH₃)₄Cl₂]⁺ + Cl⁻
                  </div>
                  <p className="text-xs text-green-300 mt-2">
                    Natija: 1 ta Cl⁻ tashqarida → 1 mol AgCl cho'kadi ✓
                  </p>
                  <p className="text-xs text-green-300 mt-1">
                    <strong>Sis va trans izomerlarni tushuntiradi! ✓</strong>
                  </p>
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
                <div className="bg-blue-900/60 rounded-xl p-4 font-mono text-sm text-blue-200 border border-blue-700/30">
                  [Co(NH₃)₄Cl₂]Cl + AgNO₃ → [Co(NH₃)₄Cl₂](NO₃) + <strong className="text-white">AgCl↓</strong>
                </div>
                <p className="text-purple-200 text-sm mt-3">
                  <strong className="text-yellow-400">Natija:</strong> <strong>1 mol AgCl</strong> cho'kadi (faqat tashqi sferadagi Cl⁻)
                </p>
              </div>
            </div>

            {/* TARIXIY XRONOLOGIYA */}
            <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  📜
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Tarixiy xronologiya</h2>
              </div>
              
              <div className="space-y-3">
                {[
                  { year: "1890", title: "Jørgensen sintezi", desc: "Birinchi bo'lib [Co(NH₃)₄Cl₂]Cl ni sintez qildi va 2 ta rang (yashil + binafsha) kuzatdi." },
                  { year: "1893", title: "Werner nazariyasi", desc: "Werner sis-trans izomeriyani tushuntirdi — 2 ta Cl⁻ koordinatsion sferada." },
                  { year: "1894", title: "Eksperimental tasdiq", desc: "AgNO₃ testi: 1 mol AgCl cho'kdi — nazariya to'g'ri!" },
                  { year: "1911", title: "Optik izomerlar", desc: "Werner [Co(en)₂Cl₂]⁺ da optik faol sis-izomerni ajratdi." },
                  { year: "1913", title: "Nobel mukofoti", desc: "Noorganik kimyoda birinchi Nobel!" },
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
              href="/ilmiy/birikmalar/co-nh3-5-cl-cl2"
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold transition-all flex items-center gap-2"
            >
              <span>←</span>
              <span className="hidden sm:inline">[Co(NH₃)₅Cl]Cl₂</span>
            </Link>
            <Link 
              href="/ilmiy/birikmalar/co-nh3-3-cl3"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold transition-all shadow-lg shadow-emerald-500/30 flex items-center gap-2"
            >
              <span className="hidden sm:inline">[Co(NH₃)₃Cl₃]</span>
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