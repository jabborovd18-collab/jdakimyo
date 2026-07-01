"use client"

import Link from "next/link"
import { useState } from "react"

export default function CoEn2Cl2Cl() {
  const [activeTab, setActiveTab] = useState("overview")
  const [activeIsomer, setActiveIsomer] = useState("cis") // cis | trans
  const [activeEnantiomer, setActiveEnantiomer] = useState("delta") // delta | lambda

  const tabs = [
    { id: "overview", label: "📋 Umumiy", icon: "📋" },
    { id: "isomers", label: "🔄 Sis-trans", icon: "🔄" },
    { id: "optical", label: "🪞 Optik (cis)", icon: "🪞" },
    { id: "chelate", label: "💎 Xelat", icon: "💎" },
    { id: "structure", label: "🧬 Tuzilish", icon: "🧬" },
    { id: "electronic", label: "⚛️ Elektron", icon: "⚛️" },
    { id: "spectroscopy", label: "🔬 Spektroskopiya", icon: "🔬" },
    { id: "synthesis", label: "⚗️ Sintez", icon: "⚗️" },
    { id: "history", label: "🏆 Tarix", icon: "🏆" },
  ]

  const isomerData = {
    cis: {
      name: "cis-[Co(en)₂Cl₂]⁺",
      commonName: "Violeo-bis(en)",
      color: "Binafsha",
      pointGroup: "C₂ (xiral!)",
      dipoleMoment: "μ > 0 (qutbli)",
      wavelength: "λmax ≈ 540 nm",
      solubility: "Suvda yaxshi eriydi",
      opticalActive: true,
      cfse: "-2.4 Δₒ"
    },
    trans: {
      name: "trans-[Co(en)₂Cl₂]⁺",
      commonName: "Praseo-bis(en)",
      color: "Yashil",
      pointGroup: "C₂ₕ (axiral)",
      dipoleMoment: "μ = 0 (qutbsiz)",
      wavelength: "λmax ≈ 620 nm",
      solubility: "Suvda kamroq eriydi",
      opticalActive: false,
      cfse: "-2.4 Δₒ"
    },
  }

  const current = isomerData[activeIsomer]

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0118] via-violet-950/30 to-slate-950 text-white relative overflow-hidden">
      
      {/* ═══ ANIMATED BACKGROUND ═══ */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        {['Co³⁺', 'en', 'cis', 'trans', 'C₂', 'C₂ₕ', 'Δ/Λ', 'Nobel 1913'].map((sym, i) => (
          <div
            key={i}
            className="absolute text-violet-400/5 font-mono font-bold select-none pointer-events-none"
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
            <span className="text-violet-400 font-semibold">[Co(en)₂Cl₂]Cl</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-violet-500/20 to-emerald-500/20 border border-violet-500/30 text-[10px] text-violet-300 font-bold uppercase tracking-wider">
                  🔄 Sis-trans izomeriya
                </span>
                <span className="px-2.5 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-[10px] text-yellow-300 font-semibold">
                  🏆 Nobel 1913
                </span>
                <span className="px-2.5 py-1 rounded-full bg-pink-500/20 border border-pink-500/30 text-[10px] text-pink-300 font-semibold">
                  🪞 Optik faol (cis)
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] text-emerald-300 font-semibold">
                  💎 Xelat
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-violet-400 via-pink-400 to-emerald-300 bg-clip-text text-transparent">
                [Co(en)₂Cl₂]Cl
              </h1>
              <p className="text-purple-300 text-sm mt-1">
                Bis(etilendiamin)dixlorokobalt(III) xlorid • Bis(ethylenediamine)dichlorocobalt(III) chloride
              </p>
            </div>
            
            <div className="flex gap-2">
              <Link 
                href="/ilmiy/birikmalar/co-en3-cl3"
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-semibold transition-all flex items-center gap-2"
              >
                <span>←</span>
                <span className="hidden sm:inline">[Co(en)₃]Cl₃</span>
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
            { label: "Formula", value: "[Co(en)₂Cl₂]Cl", icon: "🧪", color: "text-violet-400" },
            { label: "M massa", value: "288.47 g/mol", icon: "⚖️", color: "text-blue-400" },
            { label: "Geometriya", value: "Oktaedrik", icon: "💎", color: "text-purple-400" },
            { label: "Kompleks rangi", value: "Binafsha / Yashil", icon: "🎨", color: "text-pink-400" },
            { label: "Ligand turi", value: "Bidentat + Cl⁻", icon: "🔗", color: "text-emerald-400" },
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
        <div className="bg-gradient-to-r from-violet-900/30 via-pink-900/30 to-emerald-900/30 border border-violet-500/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🔄</span>
            <span className="text-sm font-bold text-white">Geometrik izomerni tanlang:</span>
            <span className="text-xs text-violet-300 ml-auto">(sis-trans)</span>
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
                  <div className="text-xs text-violet-300">Violeo-bis(en)</div>
                  <div className="text-[10px] text-violet-400 font-mono">C₂ (xiral!) • Δ va Λ</div>
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
                  <div className="text-xs text-emerald-300">Praseo-bis(en)</div>
                  <div className="text-[10px] text-emerald-400 font-mono">C₂ₕ (axiral)</div>
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
              disabled={tab.id === "optical" && activeIsomer === "trans"}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white shadow-lg shadow-violet-500/30'
                  : tab.id === "optical" && activeIsomer === "trans"
                  ? 'bg-white/5 text-purple-600 border border-white/10 cursor-not-allowed opacity-50'
                  : 'bg-white/5 text-purple-300 border border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
              title={tab.id === "optical" && activeIsomer === "trans" ? "Faqat cis-izomer uchun" : ""}
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
            <div className="bg-gradient-to-br from-purple-900/40 to-violet-900/40 border border-violet-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xl shadow-lg shadow-violet-500/30">
                  📋
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Asosiy ma'lumotlar — {current.commonName}</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  ["CAS (cis)", "14878-55-8"],
                  ["CAS (trans)", "21905-92-0"],
                  ["Zichlik", "~1.75 g/cm³"],
                  ["Sistema", "Monoklinik"],
                  ["Eruvchanlik (H₂O)", current.solubility],
                  ["Eruvchanlik (EtOH)", "Kam eriydi"],
                  ["Barqarorlik", "Yuqori (inert)"],
                  ["Rangi", current.color],
                ].map((item, i) => (
                  <div key={i} className="bg-violet-950/50 rounded-xl p-3 border border-violet-700/30">
                    <div className="text-[10px] uppercase tracking-wider text-violet-400 font-semibold mb-1">{item[0]}</div>
                    <div className="text-white font-semibold text-sm">{item[1]}</div>
                  </div>
                ))}
              </div>

              {/* ICHKI/TASHQI SFERA */}
              <div className="bg-gradient-to-r from-violet-500/10 to-pink-500/10 border border-violet-500/20 rounded-2xl p-5">
                <h3 className="text-violet-400 font-bold mb-3 flex items-center gap-2">
                  <span>💎</span> Ichki va tashqi sfera
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-violet-900/30 rounded-xl p-4 border border-violet-700/30">
                    <h4 className="text-violet-300 font-bold text-sm mb-2">🔒 Ichki sfera [Co(en)₂Cl₂]⁺</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">Co³⁺</strong> — markaziy ion (d⁶)</li>
                      <li>• <strong className="text-white">2 × en</strong> — bidentat ligand (4 ta N donor)</li>
                      <li>• <strong className="text-white">2 × Cl⁻</strong> — monodentat ligand</li>
                      <li>• <strong className="text-yellow-300">Zaryad:</strong> +3 + 0 + 2×(−1) = <strong>+1</strong></li>
                      <li>• <strong className="text-pink-300">2 ta 5 a'zoli</strong> xelat halqa</li>
                      <li>• <strong className="text-white">KS = 6</strong> (4N + 2Cl)</li>
                    </ul>
                  </div>
                  <div className="bg-pink-900/30 rounded-xl p-4 border border-pink-700/30">
                    <h4 className="text-pink-300 font-bold text-sm mb-2">🔓 Tashqi sfera Cl⁻</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">1 × Cl⁻</strong> — counter-ion</li>
                      <li>• Ion bog'lar bilan bog'langan</li>
                      <li>• Suvda darhol dissotsilanadi</li>
                      <li>• AgNO₃ bilan <strong className="text-green-400">darhol cho'kadi</strong></li>
                      <li>• <strong className="text-yellow-300">1 mol AgCl</strong> cho'kma</li>
                      <li>• <strong className="text-white">2 ion:</strong> [Co(en)₂Cl₂]⁺ + Cl⁻</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* WERNER SERIYASI */}
            <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">
                  ⚖️
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Werner seriyasida o'rni</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-blue-950/60">
                    <tr>
                      <th className="py-3 px-4 text-blue-400 text-left">Kompleks</th>
                      <th className="py-3 px-4 text-blue-400 text-left">Ionlar</th>
                      <th className="py-3 px-4 text-blue-400 text-left">AgCl</th>
                      <th className="py-3 px-4 text-blue-400 text-left">Izomeriya</th>
                      <th className="py-3 px-4 text-blue-400 text-left">Optik</th>
                    </tr>
                  </thead>
                  <tbody className="text-purple-200">
                    <tr className="border-b border-blue-800/30">
                      <td className="py-3 px-4 font-mono text-amber-300">[Co(en)₃]³⁺</td>
                      <td className="py-3 px-4">4 ion</td>
                      <td className="py-3 px-4">3 mol</td>
                      <td className="py-3 px-4 text-purple-400">—</td>
                      <td className="py-3 px-4 text-yellow-300">✓ Δ/Λ</td>
                    </tr>
                    <tr className="border-b border-blue-800/30 bg-violet-900/20">
                      <td className="py-3 px-4 font-mono text-violet-300 font-bold">[Co(en)₂Cl₂]⁺ ← Siz</td>
                      <td className="py-3 px-4 font-bold text-white">3 ion</td>
                      <td className="py-3 px-4 font-bold">1 mol</td>
                      <td className="py-3 px-4 text-pink-300 font-bold">cis + trans</td>
                      <td className="py-3 px-4 text-yellow-300 font-bold">✓ faqat cis</td>
                    </tr>
                    <tr className="border-b border-blue-800/30">
                      <td className="py-3 px-4 font-mono text-emerald-300">[Co(en)Cl₄]⁻</td>
                      <td className="py-3 px-4">2 ion</td>
                      <td className="py-3 px-4">0 mol</td>
                      <td className="py-3 px-4 text-purple-400">—</td>
                      <td className="py-3 px-4 text-red-300">✗</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* XULOSA */}
            <div className="bg-gradient-to-r from-violet-600/10 via-pink-600/10 to-emerald-600/10 border border-violet-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>✅</span> Asosiy xulosalar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "🔄 <strong>Geometrik izomeriya:</strong> sis (binafsha) va trans (yashil)",
                  "🪞 <strong>Optik izomeriya:</strong> faqat cis da (Δ va Λ)",
                  "💎 <strong>Xelat effekti:</strong> 2 ta 5 a'zoli halqa → yuqori barqarorlik",
                  "🏆 <strong>Nobel 1913:</strong> Werner bu kompleksda optik faollikni isbotladi",
                  "⚛️ <strong>d⁶ quyi spinli:</strong> KMBE = −2.4Δₒ, diamagnit",
                  "🧪 <strong>AgNO₃ testi:</strong> 1 mol AgCl cho'kadi (faqat tashqi Cl⁻)",
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
        {/* SIS-TRANS TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "isomers" && (
          <>
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
                      <p className="text-violet-400 text-xs">Violeo-bis(en)</p>
                    </div>
                  </div>

                  <div className="bg-violet-950/60 rounded-xl p-4 mb-4 font-mono text-xs text-violet-200 border border-violet-700/30">
                    <pre className="whitespace-pre">{`         en
        /   \\
   Cl—Co——N
       |    \\
   Cl—Co    N
        \\   /
         en
   
  2 ta Cl⁻ yonma-yon (90°)
  2 ta en ekvatorial`}</pre>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-300">Simmetriya:</span>
                      <span className="text-white font-mono font-bold">C₂</span>
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
                      <span className="text-white font-mono">540 nm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Optik faol:</span>
                      <span className="text-yellow-300 font-bold">✓ Ha (Δ/Λ)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Eruvchanlik:</span>
                      <span className="text-white">Yaxshi (qutbli)</span>
                    </div>
                  </div>

                  <div className="mt-4 bg-violet-900/40 rounded-lg p-3 border border-violet-700/30">
                    <p className="text-violet-300 text-xs">
                      <strong className="text-violet-200">Xususiyat:</strong> 2 ta Cl⁻ yonma-yon (90°). 
                      C₂ simmetriya — σ tekislik yo'q, shuning uchun <strong className="text-yellow-300">xiral!</strong>
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
                      <p className="text-emerald-400 text-xs">Praseo-bis(en)</p>
                    </div>
                  </div>

                  <div className="bg-emerald-950/60 rounded-xl p-4 mb-4 font-mono text-xs text-emerald-200 border border-emerald-700/30">
                    <pre className="whitespace-pre">{`         en
        /   \\
   Cl—Co——N
       ||   
   Cl—Co    N
        \\   /
         en
   
  2 ta Cl⁻ qarama-qarshi (180°)
  2 ta en ekvatorial`}</pre>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-300">Simmetriya:</span>
                      <span className="text-white font-mono font-bold">C₂ₕ</span>
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
                      <span className="text-white font-mono">620 nm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Optik faol:</span>
                      <span className="text-red-300 font-bold">✗ Yo'q (σ bor)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Eruvchanlik:</span>
                      <span className="text-white">Kamroq (qutbsiz)</span>
                    </div>
                  </div>

                  <div className="mt-4 bg-emerald-900/40 rounded-lg p-3 border border-emerald-700/30">
                    <p className="text-emerald-300 text-xs">
                      <strong className="text-emerald-200">Xususiyat:</strong> 2 ta Cl⁻ qarama-qarshi (180°).
                      C₂ₕ simmetriya — σₕ tekislik bor, shuning uchun <strong className="text-red-300">axiral.</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* AJRATISH */}
            <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border border-yellow-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-xl shadow-lg shadow-yellow-500/30">
                  🔬
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Izomerlarni ajratish</h2>
              </div>
              
              <div className="space-y-3">
                {[
                  { step: "1", title: "Sintez aralashmasi", desc: "To'g'ridan-to'g'ri sintez → aralashma (cis + trans, taxminan 1:3)" },
                  { step: "2", title: "Eruvchanlik farqi", desc: "cis-izomer suvda yaxshi eriydi (qutbli), trans-izomer kamroq eriydi (qutbsiz)" },
                  { step: "3", title: "Fraksion kristallizatsiya", desc: "Sekin sovutish → trans-izomer birinchi kristallanadi (kamroq eruvchan)" },
                  { step: "4", title: "Filtratsiya", desc: "Yashil trans-kristallarni ajratib olish" },
                  { step: "5", title: "Bug'latish", desc: "Qolgan eritmani bug'latib, binafsha cis-kristallarni olish" },
                  { step: "6", title: "Tekshirish", desc: "UV-Vis: cis = 540 nm, trans = 620 nm; IQ va CD bilan tasdiqlash" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg">
                      {item.step}
                    </div>
                    <div className="flex-1 bg-yellow-950/50 rounded-xl p-4 border border-yellow-700/30">
                      <h3 className="text-yellow-400 font-bold mb-1">{item.title}</h3>
                      <p className="text-purple-200 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TRANS-EFFEKT */}
            <div className="bg-gradient-to-br from-red-900/40 to-orange-900/40 border border-red-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-xl shadow-lg shadow-red-500/30">
                  ↔️
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Trans-effekt</h2>
              </div>
              
              <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-red-400">Trans-effekt</strong> — bir ligandning qarama-qarshisidagi (trans pozitsiyadagi) 
                  ligandning bog'ini kuchsizlantirish qobiliyati. Bu hodisa ayniqsa <strong className="text-white">Pt²⁺ komplekslarida</strong> 
                  kuchli, lekin Co³⁺ da ham kuzatiladi.
                </p>
              </div>

              <div className="bg-red-950/50 rounded-xl p-5 border border-red-700/30">
                <h3 className="text-red-400 font-bold mb-3">Trans-effekt qatori (kuchayish tartibida)</h3>
                <div className="bg-red-900/60 rounded-lg p-4 font-mono text-xs text-red-200 border border-red-700/30 mb-4">
                  H₂O &lt; OH⁻ &lt; NH₃ &lt; en &lt; <strong className="text-white">Cl⁻</strong> &lt; Br⁻ &lt; I⁻ &lt; 
                  SCN⁻ &lt; NO₂⁻ &lt; PR₃ &lt; CN⁻ ≈ CO ≈ C₂H₄
                </div>
                <p className="text-purple-200 text-xs">
                  <strong className="text-yellow-300">Natija:</strong> trans-[Co(en)₂Cl₂]⁺ da har bir Cl⁻ ning qarama-qarshisida 
                  yana bir Cl⁻ bor. Shuning uchun Cl⁻ <strong className="text-white">o'zining trans-pozitsiyasidagi Co−Cl bog'ini</strong> 
                  kuchsizlantiradi va uni ligand almashinish uchun labil qiladi.
                </p>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* OPTICAL TAB (faqat cis) */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "optical" && activeIsomer === "cis" && (
          <>
            {/* Δ VA Λ TAQQOSLASH */}
            <div className="bg-gradient-to-br from-amber-900/40 to-violet-900/40 border border-amber-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-violet-500 flex items-center justify-center text-xl shadow-lg shadow-amber-500/30">
                  🪞
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">Optik izomeriya — Δ va Λ</h2>
                  <p className="text-purple-300 text-xs mt-1">Faqat cis-[Co(en)₂Cl₂]⁺ uchun</p>
                </div>
              </div>

              {/* Enantiomer switcher */}
              <div className="bg-violet-950/60 rounded-2xl p-4 mb-6 border border-violet-700/30">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-bold text-white">🔄 Enantiomerni tanlang:</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setActiveEnantiomer("delta")}
                    className={`relative p-3 rounded-xl border-2 transition-all ${
                      activeEnantiomer === "delta"
                        ? 'bg-gradient-to-br from-amber-600/40 to-orange-600/40 border-amber-400/60'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {activeEnantiomer === "delta" && (
                      <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold">✓</div>
                    )}
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-xl font-bold">Δ</div>
                      <div className="text-left">
                        <div className="font-bold text-white text-sm">Delta</div>
                        <div className="text-[10px] text-amber-300 font-mono">[α]D = +89°</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveEnantiomer("lambda")}
                    className={`relative p-3 rounded-xl border-2 transition-all ${
                      activeEnantiomer === "lambda"
                        ? 'bg-gradient-to-br from-violet-600/40 to-purple-600/40 border-violet-400/60'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {activeEnantiomer === "lambda" && (
                      <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs font-bold">✓</div>
                    )}
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-xl font-bold">Λ</div>
                      <div className="text-left">
                        <div className="font-bold text-white text-sm">Lambda</div>
                        <div className="text-[10px] text-violet-300 font-mono">[α]D = −89°</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Δ */}
                <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 rounded-2xl p-6 border-2 border-amber-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-3xl font-bold shadow-lg">
                      Δ
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-amber-300">Delta-izomer</h3>
                      <p className="text-amber-400 text-xs">O'ng qo'l propeller</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-300">Simmetriya:</span>
                      <span className="text-white font-mono font-bold">C₂</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">[α]<sub>D</sub>²⁰:</span>
                      <span className="text-amber-300 font-bold font-mono">+89° (suvda)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">CD signal:</span>
                      <span className="text-amber-300 font-bold">Musbat Cotton</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Propeller:</span>
                      <span className="text-white">↻ Right-handed</span>
                    </div>
                  </div>
                </div>

                {/* Λ */}
                <div className="bg-gradient-to-br from-violet-900/40 to-purple-900/40 rounded-2xl p-6 border-2 border-violet-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-3xl font-bold shadow-lg">
                      Λ
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-violet-300">Lambda-izomer</h3>
                      <p className="text-violet-400 text-xs">Chap qo'l propeller</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-300">Simmetriya:</span>
                      <span className="text-white font-mono font-bold">C₂</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">[α]<sub>D</sub>²⁰:</span>
                      <span className="text-violet-300 font-bold font-mono">−89° (suvda)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">CD signal:</span>
                      <span className="text-violet-300 font-bold">Manfiy Cotton</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Propeller:</span>
                      <span className="text-white">↺ Left-handed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* NEGA XIRAL? */}
            <div className="bg-gradient-to-br from-pink-900/40 to-rose-900/40 border border-pink-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-xl shadow-lg shadow-pink-500/30">
                  🎯
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Nega faqat cis-izomer xiral?</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-pink-950/50 rounded-xl p-5 border border-pink-700/30">
                  <h3 className="text-pink-400 font-bold mb-3">✓ cis-[Co(en)₂Cl₂]⁺ — XIRAL</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Simmetriya:</strong> C₂ (faqat 1 ta C₂ o'qi)</p>
                    <p>• <strong className="text-yellow-300">σ tekislik:</strong> yo'q!</p>
                    <p>• <strong className="text-yellow-300">i markazi:</strong> yo'q!</p>
                    <p>• <strong className="text-yellow-300">S<sub>n</sub> o'qi:</strong> yo'q!</p>
                    <p className="text-pink-300 font-bold mt-2">→ Molekula ko'zgudagi aksi bilan ustma-ust tushmaydi</p>
                  </div>
                </div>
                
                <div className="bg-emerald-950/50 rounded-xl p-5 border border-emerald-700/30">
                  <h3 className="text-emerald-400 font-bold mb-3">✗ trans-[Co(en)₂Cl₂]⁺ — AXIRAL</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Simmetriya:</strong> C₂ₕ</p>
                    <p>• <strong className="text-red-300">σₕ tekislik:</strong> bor! (gorizontal)</p>
                    <p>• <strong className="text-red-300">i markazi:</strong> bor!</p>
                    <p>• <strong className="text-red-300">S<sub>n</sub> o'qi:</strong> bor!</p>
                    <p className="text-emerald-300 font-bold mt-2">→ Ko'zgudagi aksi bilan ustma-ust tushadi</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20 rounded-2xl p-5">
                <h3 className="text-pink-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Umumiy qoida
                </h3>
                <p className="text-purple-200 text-sm">
                  <strong className="text-white">Oktaedrik [Ma₂b₂c₂] tipidagi</strong> komplekslarda 
                  <strong className="text-yellow-300"> faqat sis-izomerlar</strong> xiral bo'lishi mumkin (agar σ tekislik bo'lmasa).
                  <strong className="text-white"> Trans-izomerlarda</strong> odatda σₕ yoki i mavjud, shuning uchun ular 
                  <strong className="text-red-300"> axiral</strong> (optik faol emas).
                </p>
              </div>
            </div>

            {/* REZOLYUTSIYA */}
            <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">
                  🔬
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Enantiomerlarni ajratish (rezolyutsiya)</h2>
              </div>
              
              <div className="space-y-3">
                {[
                  { step: "1", title: "Racemik aralashma", desc: "(±)-cis-[Co(en)₂Cl₂]Cl — Δ va Λ aralashmasi (1:1), optik faol emas" },
                  { step: "2", title: "Xiral reagent qo'shish", desc: "(+)-tartar kislotasi yoki (+)-antimonil tartarat qo'shiladi" },
                  { step: "3", title: "Diastereomerik tuzlar", desc: "Δ-(+) va Λ-(+) tuzlar hosil bo'ladi — ular endi diastereomer (eruvchanligi farqlanadi!)" },
                  { step: "4", title: "Fraksion kristallizatsiya", desc: "Sekin sovutish — birinchi biri kristallanadi" },
                  { step: "5", title: "Ajratish", desc: "Har birini alohida filtrlab olish" },
                  { step: "6", title: "Tozalash", desc: "HCl qo'shib, xiral reagentni chiqarish → toza Δ yoki Λ kompleks" },
                  { step: "7", title: "Tekshirish", desc: "Polyarimetr: [α]D = +89° (Δ) yoki −89° (Λ)" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg">
                      {item.step}
                    </div>
                    <div className="flex-1 bg-blue-950/50 rounded-xl p-4 border border-blue-700/30">
                      <h3 className="text-blue-400 font-bold mb-1">{item.title}</h3>
                      <p className="text-purple-200 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-5 mt-6">
                <h3 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Werner'ning 1911 yilgi buyuk tajribasi
                </h3>
                <p className="text-purple-200 text-sm">
                  <strong className="text-yellow-300">Alfred Werner</strong> aynan shu kompleksda — 
                  <strong className="text-white"> cis-[Co(en)₂Cl₂]⁺</strong> da — birinchi marta 
                  <strong className="text-pink-300"> noorganik birikmaning optik faolligini</strong> isbotladi.
                  Bu <strong className="text-white">Jørgensen'ning 18 yillik tanqidiga</strong> yakun yasadi va 
                  Werner'ga <strong className="text-yellow-300">1913 yilda Nobel mukofotini</strong> olib keldi!
                </p>
              </div>
            </div>
          </>
        )}

        {/* Agar trans tanlangan bo'lsa va optical tab bosilsa */}
        {activeTab === "optical" && activeIsomer === "trans" && (
          <div className="bg-gradient-to-br from-red-900/40 to-orange-900/40 border border-red-500/20 rounded-3xl p-8 backdrop-blur-xl text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-white mb-3">Optik izomeriya yo'q</h2>
            <p className="text-purple-200 max-w-xl mx-auto mb-6">
              <strong className="text-emerald-300">trans-[Co(en)₂Cl₂]⁺</strong> izomerida 
              <strong className="text-red-300"> σₕ tekislik va i markazi</strong> mavjud, shuning uchun u 
              <strong className="text-white"> axiral</strong> va optik faol emas.
            </p>
            <button
              onClick={() => setActiveIsomer("cis")}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-400 hover:to-pink-400 text-white font-bold transition-all shadow-lg"
            >
              💜 cis-izomerga o'tish
            </button>
          </div>
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Xelat effekti</h2>
              </div>
              
              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-emerald-400">[Co(en)₂Cl₂]⁺</strong> da <strong className="text-white">2 ta bidentat en ligandi</strong> 
                  mavjud. Har bir en <strong className="text-yellow-300">5 a'zoli xelat halqa</strong> hosil qiladi.
                  Bu kompleksni <strong className="text-white">monodentat ekvivalentiga qaraganda</strong> 
                  ancha barqaror qiladi.
                </p>
              </div>

              {/* TAQQOSLASH */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-red-950/50 rounded-2xl p-5 border border-red-700/30">
                  <h3 className="text-red-400 font-bold mb-3">❌ [Co(NH₃)₄Cl₂]⁺ (monodentat)</h3>
                  <div className="bg-red-900/60 rounded-xl p-4 mb-4 font-mono text-xs text-red-200 border border-red-700/30">
                    Co³⁺ + 4NH₃ + 2Cl⁻ ⇌ [Co(NH₃)₄Cl₂]⁺<br/>
                    <span className="text-red-300">7 zarrachadan → 1 zarracha</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-300">log K:</span>
                      <span className="text-white font-mono font-bold">≈ 28</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">ΔS:</span>
                      <span className="text-red-300 font-bold">Katta manfiy</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Barqarorlik:</span>
                      <span className="text-red-300">O'rtacha</span>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-950/50 rounded-2xl p-5 border-2 border-emerald-500/30">
                  <h3 className="text-emerald-400 font-bold mb-3">✅ [Co(en)₂Cl₂]⁺ (bidentat) ← Siz</h3>
                  <div className="bg-emerald-900/60 rounded-xl p-4 mb-4 font-mono text-xs text-emerald-200 border border-emerald-700/30">
                    Co³⁺ + 2en + 2Cl⁻ ⇌ [Co(en)₂Cl₂]⁺<br/>
                    <span className="text-emerald-300">5 zarrachadan → 1 zarracha</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-300">log K:</span>
                      <span className="text-emerald-300 font-mono font-bold">≈ 38 ⭐</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">ΔS:</span>
                      <span className="text-emerald-300 font-bold">Kamroq manfiy</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Barqarorlik:</span>
                      <span className="text-emerald-300 font-bold">10¹⁰ marta ko'proq!</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-5 mt-6">
                <h3 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
                  <span>🎯</span> Farq: log K(en) − log K(NH₃) ≈ 10
                </h3>
                <p className="text-purple-200 text-sm">
                  <strong className="text-white">10¹⁰ marta</strong> — ya'ni <strong className="text-yellow-300">10 milliard marta</strong> 
                  ko'proq barqaror! Bu xelat effektining kuchini ko'rsatadi.
                </p>
              </div>
            </div>

            {/* 5 A'ZOLI HALQA */}
            <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  🔗
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">5 a'zoli xelat halqa</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
                  <h3 className="text-purple-400 font-bold mb-3">Etilendiamin (en) strukturasi</h3>
                  <div className="bg-purple-900/60 rounded-xl p-4 mb-4 font-mono text-xs text-purple-200 border border-purple-700/30">
                    <pre className="whitespace-pre">{`    H₂N — CH₂ — CH₂ — NH₂
     ↑                    ↑
   donor              donor
   
   M ─── N ─ C ─ C ─ N ─── M
          ↑___5 a'zo___↑`}</pre>
                  </div>
                  <p className="text-purple-200 text-xs">
                    Har bir <strong className="text-white">en</strong> ligandi <strong className="text-yellow-300">5 a'zoli halqa</strong> 
                    hosil qiladi: <strong className="text-white">Co, N, C, C, N</strong>
                  </p>
                </div>
                
                <div className="bg-indigo-950/50 rounded-xl p-5 border border-indigo-700/30">
                  <h3 className="text-indigo-400 font-bold mb-3">Nega 5 a'zo optimal?</h3>
                  <div className="space-y-2 text-sm">
                    {[
                      ["3 a'zo", "Juda kichik — katta burchak kuchlanishi"],
                      ["4 a'zo", "Kichik — barqaror emas"],
                      ["5 a'zo ⭐", "Optimal — minimal kuchlanish"],
                      ["6 a'zo", "Yaxshi, lekin 5 ga qaraganda kamroq"],
                      ["7+ a'zo", "Entropiya tufayli kamroq barqaror"],
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5 border-b border-indigo-800/30">
                        <span className="text-indigo-300 text-sm font-mono font-bold">{item[0]}</span>
                        <span className="text-purple-200 text-xs">{item[1]}</span>
                      </div>
                    ))}
                  </div>
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
            <div className="bg-gradient-to-br from-purple-900/40 to-violet-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
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
                      ["Co−N masofa", "1.94 Å (4 ta)"],
                      ["Co−Cl masofa", "2.26 Å (2 ta)"],
                      ["N−Co−N (chelate)", "≈ 85.5° (5 a'zoli halqa)"],
                      ["Cl−Co−Cl", activeIsomer === "cis" ? "≈ 90° (cis)" : "180° (trans)"],
                      ["N−Co−N (trans)", activeIsomer === "trans" ? "180°" : "yo'q"],
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-purple-800/30">
                        <span className="text-purple-300 text-sm">{item[0]}</span>
                        <span className="text-white font-semibold text-sm font-mono">{item[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className={`${activeIsomer === "cis" ? "text-violet-400" : "text-emerald-400"} font-bold text-sm uppercase tracking-wider`}>
                    {current.pointGroup} simmetriya elementlari
                  </h3>
                  <div className="space-y-2">
                    {activeIsomer === "cis" ? (
                      <>
                        {[
                          ["E", "Ayniylik"],
                          ["C₂", "Cl-Co-Cl bisector bo'ylab"],
                        ].map((item, i) => (
                          <div key={i} className="flex justify-between items-center py-1.5 border-b border-violet-800/30">
                            <span className="text-violet-300 text-sm font-mono font-bold">{item[0]}</span>
                            <span className="text-purple-200 text-xs">{item[1]}</span>
                          </div>
                        ))}
                        <div className="bg-violet-950/50 rounded-xl p-3 border border-violet-700/30 mt-3">
                          <p className="text-violet-200 text-xs">
                            <strong className="text-violet-400">Jami:</strong> 2 ta simmetriya operatsiyasi.
                            <strong className="text-yellow-300"> σ tekislik va i markazi yo'q</strong> — shuning uchun xiral!
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        {[
                          ["E", "Ayniylik"],
                          ["C₂", "Asosiy o'q bo'ylab"],
                          ["σₕ", "Gorizontal tekislik (ekvatorial)"],
                          ["i", "Inversiya markazi"],
                        ].map((item, i) => (
                          <div key={i} className="flex justify-between items-center py-1.5 border-b border-emerald-800/30">
                            <span className="text-emerald-300 text-sm font-mono font-bold">{item[0]}</span>
                            <span className="text-purple-200 text-xs">{item[1]}</span>
                          </div>
                        ))}
                        <div className="bg-emerald-950/50 rounded-xl p-3 border border-emerald-700/30 mt-3">
                          <p className="text-emerald-200 text-xs">
                            <strong className="text-emerald-400">Jami:</strong> 4 ta simmetriya operatsiyasi.
                            <strong className="text-red-300"> σₕ va i bor</strong> — shuning uchun axiral!
                          </p>
                        </div>
                      </>
                    )}
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
                <div className="bg-violet-950/50 rounded-2xl p-5 border border-violet-700/30 text-center">
                  <div className="text-4xl mb-2">🟣</div>
                  <div className="text-violet-400 text-xs uppercase mb-1">Kompleksda</div>
                  <div className="text-white font-mono font-bold">t₂g⁶ e₉⁰</div>
                  <div className="text-green-400 text-xs mt-1">Quyi spinli (LS)</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-5">
                <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                  <span>💡</span> Nega quyi spinli?
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Etilendiamin (en)</strong> — o'rta-kuchli maydonli ligand</p>
                  <p>• <strong className="text-white">Cl⁻</strong> — kuchsiz maydonli ligand</p>
                  <p>• 2 ta en (kuchli) dominant — o'rtacha Δₒ ≈ 22,500 cm⁻¹</p>
                  <p>• Juftlashuv energiyasi P ≈ 21,000 cm⁻¹</p>
                  <p>• <strong className="text-yellow-300">Δₒ &gt; P</strong> → <strong className="text-green-400">quyi spinli</strong></p>
                  <p>• Barcha 6 ta elektron t₂g da → <strong className="text-white">diamagnit</strong></p>
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
                  <p>KMBE = (t₂g elektronlar) × (−0.4Δₒ) + (eg elektronlar) × (+0.6Δₒ)</p>
                  <p className="mt-2">KMBE = 6 × (−0.4Δₒ) + 0 × (+0.6Δₒ)</p>
                  <p className="text-white font-bold text-lg mt-2">KMBE = −2.4Δₒ</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-violet-900/40 rounded-xl p-4 border border-violet-700/30">
                    <div className="text-violet-400 text-xs uppercase mb-2">Δₒ</div>
                    <div className="text-white font-bold font-mono text-lg">22,500 cm⁻¹</div>
                  </div>
                  <div className="bg-violet-900/40 rounded-xl p-4 border border-violet-700/30">
                    <div className="text-violet-400 text-xs uppercase mb-2">KMBE (Δₒ)</div>
                    <div className="text-white font-bold font-mono text-lg">−2.40</div>
                  </div>
                  <div className="bg-violet-900/40 rounded-xl p-4 border border-violet-700/30">
                    <div className="text-violet-400 text-xs uppercase mb-2">KMBE (kJ/mol)</div>
                    <div className="text-white font-bold font-mono text-lg">−648</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-violet-950/50 rounded-xl p-4 border border-violet-700/30">
                  <h3 className="text-violet-400 font-bold mb-2">Magnit xossalari</h3>
                  <div className="text-purple-200 text-sm space-y-1">
                    <p>Juftlashmagan elektronlar: <strong className="text-white">n = 0</strong></p>
                    <p>μ_eff: <strong className="text-white">0 BM</strong></p>
                    <p className="text-green-400 font-bold">✓ Diamagnit!</p>
                  </div>
                </div>
                <div className="bg-violet-950/50 rounded-xl p-4 border border-violet-700/30">
                  <h3 className="text-violet-400 font-bold mb-2">Ikkala izomerda ham</h3>
                  <div className="text-purple-200 text-sm space-y-1">
                    <p>Elektron tuzilish: <strong className="text-white">bir xil</strong></p>
                    <p>KMBE: <strong className="text-white">−2.4Δₒ</strong></p>
                    <p>Magnit: <strong className="text-white">diamagnit</strong></p>
                    <p className="text-xs text-purple-400 mt-2">Farq faqat <strong>geometrik</strong> tuzilishda!</p>
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

              <div className="space-y-3">
                {[
                  {
                    transition: "¹A₁ → ¹T₁g",
                    cis_wave: "540 nm",
                    trans_wave: "620 nm",
                    color: activeIsomer === "cis" ? "Yashil-sariq yutiladi → binafsha" : "Qizil yutiladi → yashil"
                  },
                  {
                    transition: "¹A₁ → ¹T₂g",
                    cis_wave: "370 nm",
                    trans_wave: "410 nm",
                    color: "UB-soha"
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
                          <div className="text-green-400 text-xs">cis-λ<sub>max</sub></div>
                          <div className="text-white font-mono">{item.cis_wave}</div>
                        </div>
                        <div>
                          <div className="text-green-400 text-xs">trans-λ<sub>max</sub></div>
                          <div className="text-white font-mono">{item.trans_wave}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-5 mt-6">
                <h3 className="text-green-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Nega rangi farqlanadi?
                </h3>
                <p className="text-purple-200 text-sm">
                  <strong className="text-white">trans-izomer</strong>da 2 ta Cl⁻ (kuchsiz maydon) qarama-qarshi joylashgan, 
                  bu Δₒ ni <strong className="text-yellow-300">kamaytiradi</strong> (past energiya → uzun to'lqin → 620 nm → yashil).
                  <strong className="text-white"> cis-izomer</strong>da 2 ta en (kuchli) ekvatorial, 
                  Δₒ <strong className="text-yellow-300">kattaroq</strong> (yuqori energiya → qisqa to'lqin → 540 nm → binafsha).
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
                  { freq: "3280-3100 cm⁻¹", bond: "ν(N−H)", desc: "NH₂ valent tebranish", intensity: "Kuchli" },
                  { freq: "2950-2850 cm⁻¹", bond: "ν(C−H)", desc: "CH₂ valent", intensity: "O'rta" },
                  { freq: "1580-1620 cm⁻¹", bond: "δ(NH₂)", desc: "NH₂ egilish (scissoring)", intensity: "Kuchli" },
                  { freq: "1040-1080 cm⁻¹", bond: "ν(C−N)", desc: "C-N valent", intensity: "Kuchli" },
                  { freq: "530-560 cm⁻¹", bond: "ν(Co−N)", desc: "Co-N valent (4 ta)", intensity: "O'rta" },
                  { freq: "320-340 cm⁻¹", bond: "ν(Co−Cl)", desc: "Co-Cl valent (2 ta)", intensity: "O'rta" },
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
                  <span>🎯</span> Izomerlarni IQ bilan farqlash
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-violet-300">cis-izomer</strong>: ν(Co−Cl) da <strong>2 ta cho'qqi</strong> (asimmetrik muhit)</p>
                  <p>• <strong className="text-emerald-300">trans-izomer</strong>: ν(Co−Cl) da <strong>1 ta cho'qqi</strong> (simmetrik muhit)</p>
                  <p className="text-xs text-purple-400 mt-2">
                    Bundan tashqari, <strong className="text-white">ν(Co−N)</strong> ham ikkala izomerda biroz farqlanadi.
                  </p>
                </div>
              </div>
            </div>

            {/* CD (faqat cis) */}
            {activeIsomer === "cis" && (
              <div className="bg-gradient-to-br from-pink-900/40 to-rose-900/40 border border-pink-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-xl shadow-lg shadow-pink-500/30">
                    🔄
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white">Circular Dichroism (CD)</h2>
                    <p className="text-purple-300 text-xs mt-1">Faqat cis-izomer uchun (xiral)</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-amber-950/50 rounded-xl p-5 border border-amber-700/30">
                    <h3 className="text-amber-400 font-bold mb-2">Δ-cis CD spektri</h3>
                    <div className="bg-amber-900/60 rounded-lg p-3 border border-amber-700/30 font-mono text-xs text-amber-200">
                      <pre className="whitespace-pre">{`     Δε
      ↑  +++++
      |  +   +
   ___|_+____+___→ λ
      |       -
      |      --
      
   Musbat Cotton (540 nm)`}</pre>
                    </div>
                    <p className="text-amber-200 text-xs mt-2">
                      <strong className="text-white">Musbat Δε</strong> — chap qo'l polyarizatsiyani ko'proq yutadi
                    </p>
                  </div>
                  
                  <div className="bg-violet-950/50 rounded-xl p-5 border border-violet-700/30">
                    <h3 className="text-violet-400 font-bold mb-2">Λ-cis CD spektri</h3>
                    <div className="bg-violet-900/60 rounded-lg p-3 border border-violet-700/30 font-mono text-xs text-violet-200">
                      <pre className="whitespace-pre">{`     Δε
      ↑
      |
   ___|_______→ λ
      |  -   -
      |  -----
      
   Manfiy Cotton (540 nm)`}</pre>
                    </div>
                    <p className="text-violet-200 text-xs mt-2">
                      <strong className="text-white">Manfiy Δε</strong> — o'ng qo'l polyarizatsiyani ko'proq yutadi
                    </p>
                  </div>
                </div>
              </div>
            )}
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
                  <h3 className="text-green-400 font-bold mb-3">1-usul: To'g'ridan-to'g'ri sintez</h3>
                  <div className="bg-green-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-green-300 border border-green-700/30">
                    2CoCl₂ + 4en + 2HCl + H₂O₂ → 2[Co(en)₂Cl₂]Cl + 2H₂O
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Mexanizm:</strong> Co²⁺ + en → [Co(en)₂]²⁺ (labil) → H₂O₂ bilan Co³⁺ gacha oksidlanish</p>
                    <p><strong className="text-white">Sharoit:</strong> Xona harorati yoki biroz isitish</p>
                    <p><strong className="text-white">Hosildorlik:</strong> ≈ 60-70%</p>
                    <p><strong className="text-yellow-300">Natija:</strong> cis + trans aralashmasi (~1:3)</p>
                  </div>
                </div>

                <div className="bg-green-950/50 rounded-2xl p-5 border border-green-700/30">
                  <h3 className="text-green-400 font-bold mb-3">2-usul: [Co(en)₃]³⁺ dan</h3>
                  <div className="bg-green-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-green-300 border border-green-700/30">
                    [Co(en)₃]Cl₃ + 2HCl → [Co(en)₂Cl₂]Cl + en·2HCl
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Mexanizm:</strong> Bitta en ligandi 2 ta Cl⁻ bilan almashinadi</p>
                    <p><strong className="text-white">Sharoit:</strong> 80°C, kons. HCl</p>
                    <p><strong className="text-white">Afzalligi:</strong> Toza trans-izomer olish osonroq</p>
                  </div>
                </div>
              </div>
            </div>

            {/* IZOMER AJRATISH */}
            <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">
                  🔬
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Izomerlarni ajratish protokoli</h2>
              </div>
              
              <div className="space-y-3">
                {[
                  { step: "1", title: "Aralashmani olish", desc: "Sintezdan keyin cis + trans aralashmasi (~1:3) hosil bo'ladi" },
                  { step: "2", title: "Suvda eritish", desc: "Aralashmani minimal suvda eritish (cis yaxshi eriydi, trans yomon)" },
                  { step: "3", title: "Sekin sovutish", desc: "Muzli suvda sekin sovutish → trans birinchi kristallanadi" },
                  { step: "4", title: "Filtratsiya #1", desc: "Yashil trans-kristallarni ajratib olish, filtrlash" },
                  { step: "5", title: "Bug'latish", desc: "Qolgan eritmani yarmigacha bug'latish" },
                  { step: "6", title: "Filtratsiya #2", desc: "Binafsha cis-kristallarni olish" },
                  { step: "7", title: "Tekshirish", desc: "UV-Vis (540 vs 620 nm) va IQ bilan tozalikni tasdiqlash" },
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
                  <span>⚠️</span> Xavfsizlik eslatmalari
                </h3>
                <div className="space-y-1 text-sm text-purple-200">
                  <p>• <strong className="text-white">Etilendiamin</strong> — kuchli asos, teri va ko'zni qichishtiradi, shkaflarda ishlash</p>
                  <p>• <strong className="text-white">H₂O₂ (30%)</strong> — kuchli oksidlovchi, ehtiyotkorlik bilan</p>
                  <p>• <strong className="text-white">Konsentrlangan HCl</strong> — bug'lari zaharli</p>
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Nobel mukofoti (1913) — hal qiluvchi isbot</h2>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-2xl p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-yellow-600 to-amber-600 flex items-center justify-center text-6xl flex-shrink-0 shadow-2xl">
                    👨‍🔬
                  </div>
                  <div className="flex-1">
                    <h3 className="text-yellow-400 font-bold text-xl mb-2">Alfred Werner (1866-1919)</h3>
                    <p className="text-purple-200 text-sm mb-3 leading-relaxed">
                      <strong className="text-yellow-300">[Co(en)₂Cl₂]Cl</strong> Werner uchun <strong className="text-white">eng muhim eksperimental g'alaba</strong> edi.
                      1911 yilda u <strong className="text-pink-300">cis-izomerning optik faol ekanligini</strong> isbotladi —
                      bu <strong className="text-white">noorganik birikmalar ham xiral bo'lishi mumkin</strong> degan birinchi isbot!
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-xs text-yellow-300 font-semibold">
                        🏆 Nobel 1913
                      </span>
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-xs text-amber-300 font-semibold">
                        📍 Zurich universiteti
                      </span>
                      <span className="px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/30 text-xs text-pink-300 font-semibold">
                        🪞 Birinchi noorganik rezolyutsiya
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-2xl p-5">
                <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                  <span>💡</span> Nega bu Nobel uchun hal qiluvchi edi?
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">1893:</strong> Werner koordinatsion nazariyani taklif qildi — lekin 18 yil tanqid qilindi</p>
                  <p>• <strong className="text-white">Jørgensenning e'tirozi:</strong> "Noorganik komplekslar xiral bo'la olmaydi, faqat organiklar xiral"</p>
                  <p>• <strong className="text-yellow-300">1911 yilgi tajriba:</strong> Werner cis-[Co(en)₂Cl₂]⁺ ni (+) va (−) enantiomerlarga ajratdi</p>
                  <p>• <strong className="text-green-400">Natija:</strong> Jørgensen tan oldi → Werner 1913 yilda Nobel oldi</p>
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
                  { year: "1893", title: "Werner nazariyasi", desc: "27 yoshli Werner koordinatsion nazariyani e'lon qildi" },
                  { year: "1890-1910", title: "20 yillik bahs", desc: "Werner vs Jørgensen — butun kimyo olami ikkiga bo'lindi" },
                  { year: "1911", title: "Buyuk tajriba", desc: "Werner cis-[Co(en)₂Cl₂]⁺ ni Δ va Λ enantiomerlarga ajratdi — birinchi noorganik rezolyutsiya!" },
                  { year: "1911", title: "Jørgensen tan oldi", desc: "18 yillik raqiblikdan keyin Jørgensen Werner'ning haqligini tan oldi" },
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
            </div>

            {/* REAKSIYA */}
            <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">
                  🔬
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">1911 yilgi tajriba sxemasi</h2>
              </div>
              
              <div className="bg-blue-950/50 rounded-2xl p-5 border border-blue-700/30 mb-6">
                <h3 className="text-blue-400 font-bold mb-3">Reaksiya sxemasi</h3>
                <div className="bg-blue-900/60 rounded-xl p-4 font-mono text-xs text-blue-200 border border-blue-700/30 space-y-2">
                  <p>1. (±)-cis-[Co(en)₂Cl₂]Cl + (+)-antimonil-tartrat →</p>
                  <p className="text-blue-300 pl-4">Δ-(+)-tartrat + Λ-(+)-tartrat (diastereomerlar!)</p>
                  <p>2. Fraksion kristallizatsiya:</p>
                  <p className="text-blue-300 pl-4">Λ-(+)-tartrat birinchi kristallanadi</p>
                  <p>3. Har birini HCl bilan ishlov berish:</p>
                  <p className="text-blue-300 pl-4">→ Δ-[Co(en)₂Cl₂]Cl  [α]D = +89°</p>
                  <p className="text-blue-300 pl-4">→ Λ-[Co(en)₂Cl₂]Cl  [α]D = −89°</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-violet-950/50 rounded-xl p-4 border border-violet-700/30 text-center">
                  <div className="text-3xl mb-2">🧪</div>
                  <div className="text-violet-400 text-xs uppercase mb-1">Boshlanish</div>
                  <div className="text-white font-bold text-sm">Racemik (±)</div>
                  <div className="text-violet-300 text-xs mt-1">[α]D = 0</div>
                </div>
                <div className="bg-yellow-950/50 rounded-xl p-4 border border-yellow-700/30 text-center">
                  <div className="text-3xl mb-2">⚗️</div>
                  <div className="text-yellow-400 text-xs uppercase mb-1">Jarayon</div>
                  <div className="text-white font-bold text-sm">Diastereomerlar</div>
                  <div className="text-yellow-300 text-xs mt-1">Kristallizatsiya</div>
                </div>
                <div className="bg-green-950/50 rounded-xl p-4 border border-green-700/30 text-center">
                  <div className="text-3xl mb-2">✨</div>
                  <div className="text-green-400 text-xs uppercase mb-1">Natija</div>
                  <div className="text-white font-bold text-sm">Δ va Λ sof</div>
                  <div className="text-green-300 text-xs mt-1">[α]D = ±89°</div>
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
              href="/ilmiy/birikmares/co-en3-cl3"
              onClick={(e) => { e.preventDefault(); window.history.back(); }}
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold transition-all flex items-center gap-2"
            >
              <span>←</span>
              <span className="hidden sm:inline">[Co(en)₃]Cl₃</span>
            </Link>
            <Link 
              href="/ilmiy/birikmares/co-nh3-4-cl2-cl"
              onClick={(e) => { e.preventDefault(); alert('Keyingi: [Co(NH₃)₄Cl₂]Cl — Praseo/Violeo'); }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-400 hover:to-pink-400 text-white font-bold transition-all shadow-lg shadow-violet-500/30 flex items-center gap-2"
            >
              <span className="hidden sm:inline">[Co(NH₃)₄Cl₂]Cl</span>
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