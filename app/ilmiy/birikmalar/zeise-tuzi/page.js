"use client"

import Link from "next/link"
import { useState } from "react"

export default function ZeiseTuzi() {
  const [activeTab, setActiveTab] = useState("overview")
  const [bondingModel, setBondingModel] = useState("dcd") // dcd | simple

  const tabs = [
    { id: "overview", label: "📋 Umumiy", icon: "📋" },
    { id: "structure", label: "🧬 Kvadrat-tekis", icon: "🧬" },
    { id: "electronic", label: "⚛️ Elektron (d⁸)", icon: "⚛️" },
    { id: "bonding", label: "🔗 η²-etilen bog'lanish", icon: "🔗" },
    { id: "dcdModel", label: "🌀 DCD modeli", icon: "🌀" },
    { id: "spectroscopy", label: "🔬 Spektroskopiya", icon: "🔬" },
    { id: "applications", label: "🏭 Qo'llanilish", icon: "🏭" },
    { id: "synthesis", label: "⚗️ Sintez", icon: "⚗️" },
    { id: "history", label: "🏆 Tarix (1827)", icon: "🏆" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white relative overflow-hidden">
      
      {/* ═══ ANIMATED BACKGROUND ═══ */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-yellow-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(245,158,11,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        {['Pt²⁺', 'd⁸', 'η²', 'C₂H₄', 'Zeise 1827', 'Dewar-Chatt', 'kvadrat-tekis', 'organometallik'].map((sym, i) => (
          <div
            key={i}
            className="absolute text-amber-400/5 font-mono font-bold select-none pointer-events-none"
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
            <span className="text-amber-400 font-semibold">K[PtCl₃(C₂H₄)]</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                  🏆 Birinchi organometallik (1827)
                </span>
                <span className="px-2.5 py-1 rounded-full bg-pink-500/20 border border-pink-500/30 text-[10px] text-pink-300 font-semibold">
                  🔗 η²-etilen bog'lanish
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] text-emerald-300 font-semibold">
                  ⚛️ d⁸ kvadrat-tekis
                </span>
                <span className="px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-[10px] text-purple-300 font-semibold">
                  🌀 Dewar-Chatt-Duncanson
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
                K[PtCl₃(C₂H₄)]
              </h1>
              <p className="text-purple-300 text-sm mt-1">
                Zeise tuzi • Kaliy trixloro(etilen)platinat(II) • Zeise&apos;s salt
              </p>
            </div>
            
            <div className="flex gap-2">
              <Link 
                href="/ilmiy/birikmalar/ferrosen"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 hover:border-emerald-400/60 text-emerald-300 text-sm font-semibold transition-all flex items-center gap-2"
              >
                <span>🥪</span>
                <span className="hidden sm:inline">Ferrosen</span>
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
            { label: "Formula", value: "K[PtCl₃(C₂H₄)]", icon: "🧪", color: "text-amber-400" },
            { label: "M massa", value: "367.61 g/mol", icon: "⚖️", color: "text-blue-400" },
            { label: "Geometriya", value: "Kvadrat-tekis", icon: "💎", color: "text-purple-400" },
            { label: "Rangi", value: "Sariq kristall", icon: "🎨", color: "text-yellow-400" },
            { label: "Bog'lanish", value: "η² (etilen)", icon: "🔗", color: "text-pink-400" },
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
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
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
            <div className="bg-gradient-to-br from-purple-900/40 to-amber-900/40 border border-amber-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-xl shadow-lg shadow-amber-500/30">
                  📋
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Asosiy ma&apos;lumotlar — Zeise tuzi</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  ["CAS raqami", "12012-50-9"],
                  ["Zichlik", "2.87 g/cm³"],
                  ["Sistema", "Monoklinik"],
                  ["Fazoviy guruh", "P2₁/c"],
                  ["Eruvchanlik (H₂O)", "Yaxshi eriydi"],
                  ["Eruvchanlik (EtOH)", "Yaxshi eriydi"],
                  ["Barqarorlik", "O'rta (havoda barqaror)"],
                  ["Rangi", "Sariq kristall"],
                ].map((item, i) => (
                  <div key={i} className="bg-amber-950/50 rounded-xl p-3 border border-amber-700/30">
                    <div className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold mb-1">{item[0]}</div>
                    <div className="text-white font-semibold text-sm">{item[1]}</div>
                  </div>
                ))}
              </div>

              {/* ICHKI/TASHQI SFERA */}
              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-5">
                <h3 className="text-amber-400 font-bold mb-3 flex items-center gap-2">
                  <span>💎</span> Ichki va tashqi sfera
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-amber-900/30 rounded-xl p-4 border border-amber-700/30">
                    <h4 className="text-amber-300 font-bold text-sm mb-2">🔒 Ichki sfera [PtCl₃(C₂H₄)]⁻</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">Pt²⁺</strong> — markaziy ion (5d⁸)</li>
                      <li>• <strong className="text-white">3 × Cl⁻</strong> — xlor ligandlari (monodentat)</li>
                      <li>• <strong className="text-white">1 × C₂H₄</strong> — etilen (η²-bidentat)</li>
                      <li>• <strong className="text-yellow-300">Zaryad:</strong> +2 + 3×(−1) + 0 = <strong>−1</strong></li>
                      <li>• <strong className="text-pink-300">Bog'lanish:</strong> η² (ikkala C atomi)</li>
                    </ul>
                  </div>
                  <div className="bg-orange-900/30 rounded-xl p-4 border border-orange-700/30">
                    <h4 className="text-orange-300 font-bold text-sm mb-2">🔓 Tashqi sfera K⁺</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">1 × K⁺</strong> — counter-ion</li>
                      <li>• Ion bog'lar bilan bog'langan</li>
                      <li>• Suvda darhol dissotsilanadi</li>
                      <li>• <strong className="text-white">2 ion:</strong> K⁺ + [PtCl₃(C₂H₄)]⁻</li>
                      <li>• <strong className="text-yellow-300">Tarixiy ahamiyat:</strong> Birinchi organometallik!</li>
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
                  <h2 className="text-xl font-bold text-yellow-300">Organometallik kimyoning tug'ilishi</h2>
                  <p className="text-purple-300 text-xs">1827 yil — kimyo tarixidagi burilish nuqtasi</p>
                </div>
              </div>
              <p className="text-purple-200 text-sm leading-relaxed mb-4">
                <strong className="text-yellow-400">Zeise tuzi</strong> — bu <strong className="text-white">tarixda birinchi bo'lib sintez qilingan organometallik birikma</strong>.
                1827 yilda Daniyalik kimyogar <strong className="text-amber-300">William Christopher Zeise</strong> 
                PtCl₄ va etanol reaktsiyasidan sariq kristall oldi. Bu birikmada 
                <strong className="text-pink-300"> metall to'g'ridan-to'g'ri uglerodga bog'langan</strong> — 
                bu o'sha davrda butunlay kutilmagan hodisa edi!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-yellow-900/30 rounded-lg p-3 border border-yellow-700/30 text-center">
                  <div className="text-2xl font-bold text-yellow-300">1827</div>
                  <div className="text-xs text-purple-300">Kashfiyot yili</div>
                </div>
                <div className="bg-amber-900/30 rounded-lg p-3 border border-amber-700/30 text-center">
                  <div className="text-2xl font-bold text-amber-300">138</div>
                  <div className="text-xs text-purple-300">Tushuntirish uchun yil (1965)</div>
                </div>
                <div className="bg-orange-900/30 rounded-lg p-3 border border-orange-700/30 text-center">
                  <div className="text-2xl font-bold text-orange-300">1973</div>
                  <div className="text-xs text-purple-300">Nobel (Fischer & Wilkinson)</div>
                </div>
              </div>
            </div>

            {/* XULOSA */}
            <div className="bg-gradient-to-r from-amber-600/10 via-orange-600/10 to-purple-600/10 border border-amber-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>✅</span> Asosiy xulosalar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "🏆 <strong>Birinchi organometallik:</strong> Metall-uglerod bog'li birinchi sintez qilingan birikma (1827)",
                  "⚛️ <strong>Pt²⁺ (5d⁸):</strong> kvadrat-tekis geometriya, diamagnit",
                  "🔗 <strong>η²-etilen:</strong> ikkala C atomi Pt bilan bog'langan (side-on)",
                  "🌀 <strong>DCD modeli:</strong> σ-donatsiya + π-backbonding (Dewar-Chatt-Duncanson)",
                  "🔬 <strong>C=C bog'i uzayadi:</strong> 1.34 Å → 1.37 Å (backbonding tufayli)",
                  "🧪 <strong>Sintez:</strong> K₂[PtCl₄] + C₂H₄ → K[PtCl₃(C₂H₄)] + KCl",
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
            <div className="bg-gradient-to-br from-purple-900/40 to-amber-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-amber-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  🧬
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Kvadrat-tekis geometriya</h2>
              </div>
              
              <div className="bg-amber-950/60 rounded-xl p-5 font-mono text-sm text-amber-200 border border-amber-700/30 mb-6 text-center">
                <pre className="whitespace-pre">{`            Cl
            |
   Cl — Pt — C₂H₄ (η²)
            |
            Cl
            
            K⁺ (tashqi sfera)
  
   Kvadrat-tekis: Pt²⁺ markazda, 4 ta ligand
   3 ta Cl⁻ + 1 ta η²-C₂H₄ = koordinatsion son 4`}</pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-purple-400 font-bold text-sm uppercase tracking-wider">Geometrik parametrlar</h3>
                  <div className="space-y-2">
                    {[
                      ["Geometriya", "Kvadrat-tekis (square planar)"],
                      ["Nuqtali guruh", "C₂ᵥ (taxminan)"],
                      ["Pt−Cl masofa", "2.30 Å (3 ta)"],
                      ["Pt−C masofa", "2.13 Å (2 ta)"],
                      ["C=C masofa", "1.37 Å (uzaygan!)"],
                      ["Erkin C=C", "1.34 Å (taqqoslash)"],
                      ["Cl−Pt−Cl burchak", "90° (cis) / 180° (trans)"],
                      ["Pt−C₂H₄ markazi", "2.13 Å"],
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-purple-800/30">
                        <span className="text-purple-300 text-sm">{item[0]}</span>
                        <span className="text-white font-semibold text-sm font-mono">{item[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-amber-400 font-bold text-sm uppercase tracking-wider">Etilen holati</h3>
                  <div className="space-y-3">
                    <div className="bg-amber-900/30 rounded-xl p-4 border border-amber-700/30">
                      <h4 className="text-amber-300 font-bold text-sm mb-2">📐 η²-bog'lanish geometriyasi</h4>
                      <div className="space-y-2 text-sm text-purple-200">
                        <p>• <strong className="text-white">Etilen tekisligi:</strong> Pt-Cl tekisligiga perpendikulyar</p>
                        <p>• <strong className="text-white">C=C o'qi:</strong> Pt ga parallel</p>
                        <p>• <strong className="text-white">Ikkala C atomi:</strong> Pt dan bir xil masofada (2.13 Å)</p>
                        <p>• <strong className="text-yellow-300">η² (eta-2):</strong> ikkala C atomi metall bilan bog'langan</p>
                      </div>
                    </div>
                    <div className="bg-pink-900/30 rounded-xl p-4 border border-pink-700/30">
                      <h4 className="text-pink-300 font-bold text-sm mb-2">⚠️ C=C bog'ining uzayishi</h4>
                      <div className="space-y-2 text-sm text-purple-200">
                        <p>• <strong className="text-white">Erkin etilen:</strong> C=C = 1.34 Å</p>
                        <p>• <strong className="text-white">Zeise tuzida:</strong> C=C = <span className="text-pink-300 font-bold">1.37 Å</span></p>
                        <p>• <strong className="text-yellow-300">Sabab:</strong> π-backbonding C=C bog'ini kuchsizlantiradi</p>
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Elektron tuzilishi — Pt²⁺ (5d⁸)</h2>
              </div>
              
              {/* ELEKTRON HISOB */}
              <div className="bg-emerald-950/50 rounded-2xl p-6 border border-emerald-700/30 mb-6">
                <h3 className="text-emerald-400 font-bold mb-4">[PtCl₃(C₂H₄)]⁻ uchun elektron hisobi</h3>
                <div className="space-y-3">
                  <div className="bg-emerald-900/40 rounded-xl p-4 border border-emerald-700/30 flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold">Pt²⁺ (platina)</div>
                      <div className="text-purple-300 text-xs mt-1">
                        Konfiguratsiya: [Xe] 4f¹⁴ 5d⁸ → 8 ta valent elektron
                      </div>
                    </div>
                    <div className="text-emerald-300 text-2xl font-bold font-mono">8 e⁻</div>
                  </div>
                  <div className="bg-emerald-900/40 rounded-xl p-4 border border-emerald-700/30 flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold">3 × Cl⁻</div>
                      <div className="text-purple-300 text-xs mt-1">
                        Har bir Cl⁻ 2 ta elektron beradi (σ-donor)
                      </div>
                    </div>
                    <div className="text-emerald-300 text-2xl font-bold font-mono">3 × 2 = 6 e⁻</div>
                  </div>
                  <div className="bg-emerald-900/40 rounded-xl p-4 border border-emerald-700/30 flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold">1 × C₂H₄ (η²)</div>
                      <div className="text-purple-300 text-xs mt-1">
                        Etilen π-elektronlari (2 e⁻ σ-donatsiya)
                      </div>
                    </div>
                    <div className="text-emerald-300 text-2xl font-bold font-mono">2 e⁻</div>
                  </div>
                  <div className="bg-emerald-900/40 rounded-xl p-4 border border-emerald-700/30 flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold">Zaryad</div>
                      <div className="text-purple-300 text-xs mt-1">
                        Kompleks zaryadi: −1
                      </div>
                    </div>
                    <div className="text-emerald-300 text-2xl font-bold font-mono">+2 e⁻</div>
                  </div>
                  <div className="bg-yellow-900/40 rounded-xl p-4 border-2 border-yellow-500/30 flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold text-lg">JAMI</div>
                      <div className="text-yellow-300 text-xs mt-1">
                        18 elektron qoidasi bajarildi ✓
                      </div>
                    </div>
                    <div className="text-yellow-300 text-3xl font-bold font-mono">18 e⁻</div>
                  </div>
                </div>
              </div>

              {/* GIBRIDLANISH */}
              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-5 mb-6">
                <h3 className="text-emerald-400 font-bold mb-3 flex items-center gap-2">
                  <span>💡</span> dsp² gibridlanish
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">1 ta 5d orbital</strong> (d<sub>x²-y²</sub>)</p>
                  <p>• <strong className="text-white">1 ta 6s orbital</strong></p>
                  <p>• <strong className="text-white">2 ta 6p orbital</strong> (p<sub>x</sub> va p<sub>y</sub>)</p>
                  <p>• <strong className="text-yellow-300">Jami:</strong> 4 ta dsp² gibrid orbital → 4 ta σ-bog' (kvadrat-tekis)</p>
                  <p className="text-xs text-purple-400 mt-2">
                    Qolgan 8 ta d-elektron <strong className="text-white">to'liq juftlashgan</strong> 
                    (4 ta to'liq orbital) → <strong className="text-green-400">diamagnit</strong>.
                    5d metallari (Pt²⁺, Pd²⁺, Au³⁺) deyarli har doim kvadrat-tekis.
                  </p>
                </div>
              </div>

              {/* d-ORBITAL */}
              <div className="bg-purple-950/50 rounded-2xl p-5 border border-purple-700/30">
                <h3 className="text-purple-400 font-bold mb-3">Kvadrat-tekis d-orbital ajralishi</h3>
                <div className="bg-purple-900/60 rounded-xl p-4 font-mono text-sm text-purple-200 border border-purple-700/30 mb-4">
                  <p>d<sub>x²-y²</sub> &gt; d<sub>xy</sub> &gt; d<sub>z²</sub> &gt; d<sub>xz</sub>, d<sub>yz</sub></p>
                  <p className="mt-2">8 ta elektron → quyi 4 ta orbital to'liq</p>
                  <p className="text-white font-bold mt-2">KMBE = −2.4Δsp (juda barqaror)</p>
                </div>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Magnit:</strong> Diamagnit (μ = 0 BM)</p>
                  <p>• <strong className="text-white">Δsp:</strong> Katta (5d metallari uchun)</p>
                  <p>• <strong className="text-white">Barqarorlik:</strong> 18 elektron qoidasi bajarilgan</p>
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
                <h2 className="text-xl md:text-2xl font-bold text-white">η²-etilen bog'lanish mexanizmi</h2>
              </div>
              
              <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-2 border-pink-500/30 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-pink-400">η² (eta-2)</strong> belgisi etilenning 
                  <strong className="text-white"> ikkala uglerod atomi</strong> metall bilan bog'langanligini bildiradi.
                  Etilen <strong className="text-yellow-300">yon tomondan (side-on)</strong> Pt ga yaqinlashadi — 
                  bu oddiy σ-bog'dan butunlay farq qiladi!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-pink-950/50 rounded-xl p-5 border border-pink-700/30">
                  <h3 className="text-pink-400 font-bold mb-3">1️⃣ σ-donatsiya (C₂H₄ → Pt²⁺)</h3>
                  <div className="bg-pink-900/40 rounded-lg p-4 font-mono text-xs text-pink-200 border border-pink-700/30 mb-3">
                    <pre className="whitespace-pre">{`  C₂H₄ (π-elektronlar) → Pt²⁺
  
  Etilenning π-bog' orbitali
  Pt ning bo'sh dsp² orbitaliga
  elektron juftini beradi`}</pre>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Etilenning π-MO:</strong> to'lgan bonding orbital</p>
                    <p>• <strong className="text-white">Pt ning dsp²:</strong> bo'sh gibrid orbital</p>
                    <p>• Natija: <strong className="text-pink-300">Pt←C₂H₄ σ-bog'</strong></p>
                  </div>
                </div>

                <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
                  <h3 className="text-purple-400 font-bold mb-3">2️⃣ π-backbonding (Pt²⁺ → C₂H₄)</h3>
                  <div className="bg-purple-900/40 rounded-lg p-4 font-mono text-xs text-purple-200 border border-purple-700/30 mb-3">
                    <pre className="whitespace-pre">{`  Pt²⁺ → C₂H₄ (π*)
  
  Pt ning to'lgan d-orbitali
  Etilenning bo'sh π* orbitaliga
  elektron qaytaradi`}</pre>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Pt ning to'lgan d-orbitallari</strong> (d<sub>xz</sub>, d<sub>yz</sub>)</p>
                    <p>• <strong className="text-white">C₂H₄ ning π* orbitaliga</strong> (LUMO) donatsiya</p>
                    <p>• Natija: <strong className="text-purple-300">Pt→C₂H₄ π-bog'</strong></p>
                  </div>
                </div>
              </div>

              {/* NATIJALAR */}
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 rounded-2xl p-5">
                <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                  <span>⚡</span> Sinergik effekt — natijalar
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-yellow-900/30 rounded-lg p-3 border border-yellow-700/30 text-center">
                    <div className="text-amber-300 font-bold text-sm mb-1">C=C uzayadi</div>
                    <div className="text-white font-mono text-lg">1.34 → 1.37 Å</div>
                    <div className="text-xs text-purple-300 mt-1">π-backbonding tufayli</div>
                  </div>
                  <div className="bg-orange-900/30 rounded-lg p-3 border border-orange-700/30 text-center">
                    <div className="text-orange-300 font-bold text-sm mb-1">ν(C=C) pasayadi</div>
                    <div className="text-white font-mono text-lg">1623 → 1516 cm⁻¹</div>
                    <div className="text-xs text-purple-300 mt-1">Bog' kuchsizlanadi</div>
                  </div>
                  <div className="bg-amber-900/30 rounded-lg p-3 border border-amber-700/30 text-center">
                    <div className="text-yellow-300 font-bold text-sm mb-1">Bog' tartibi</div>
                    <div className="text-white font-mono text-lg">2 → ~1.5</div>
                    <div className="text-xs text-purple-300 mt-1">Oraliq xarakter</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* DCD MODEL TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "dcdModel" && (
          <>
            <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  🌀
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Dewar-Chatt-Duncanson (DCD) modeli</h2>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border-2 border-purple-500/30 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-purple-400">DCD modeli</strong> — bu metall-alken bog'lanishini 
                  <strong className="text-white"> ikki komponentli</strong> tushuntirish:
                  (1) <strong className="text-yellow-300">σ-donatsiya</strong> (alken → metall) va 
                  (2) <strong className="text-pink-300">π-backdonatsiya</strong> (metall → alken).
                  Bu model 1950-yillarda Dewar, Chatt va Duncanson tomonidan mustaqil ravishda taklif qilingan.
                </p>
              </div>

              {/* MODEL BOSHQARUV */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setBondingModel("dcd")}
                  className={`flex-1 py-3 rounded-xl border-2 transition-all ${
                    bondingModel === "dcd"
                      ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                      : 'bg-white/5 border-white/10 text-purple-400 hover:bg-white/10'
                  }`}
                >
                  🌀 To'liq DCD modeli
                </button>
                <button
                  onClick={() => setBondingModel("simple")}
                  className={`flex-1 py-3 rounded-xl border-2 transition-all ${
                    bondingModel === "simple"
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                      : 'bg-white/5 border-white/10 text-purple-400 hover:bg-white/10'
                  }`}
                >
                  📐 Oddiy tushuntirish
                </button>
              </div>

              {bondingModel === "dcd" ? (
                <div className="space-y-4">
                  <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
                    <h3 className="text-purple-400 font-bold mb-3">Komponent 1: σ-donatsiya (L → M)</h3>
                    <div className="bg-purple-900/40 rounded-lg p-4 border border-purple-700/30 mb-3">
                      <div className="font-mono text-sm text-purple-200 text-center">
                        <p>Etilen π (HOMO) → Pt dsp² (LUMO)</p>
                        <p className="mt-2 text-purple-300 text-xs">Elektron zichligi: C₂H₄ → Pt</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-purple-200">
                      <p>• Etilenning <strong className="text-white">to'lgan π-bonding orbitali</strong> elektron juftini beradi</p>
                      <p>• Pt ning <strong className="text-white">bo'sh dsp² gibrid orbitali</strong> qabul qiladi</p>
                      <p>• Natija: <strong className="text-yellow-300">Pt da elektron zichligi ortadi</strong></p>
                    </div>
                  </div>

                  <div className="bg-pink-950/50 rounded-xl p-5 border border-pink-700/30">
                    <h3 className="text-pink-400 font-bold mb-3">Komponent 2: π-backdonatsiya (M → L)</h3>
                    <div className="bg-pink-900/40 rounded-lg p-4 border border-pink-700/30 mb-3">
                      <div className="font-mono text-sm text-pink-200 text-center">
                        <p>Pt d<sub>xz</sub>/d<sub>yz</sub> (HOMO) → C₂H₄ π* (LUMO)</p>
                        <p className="mt-2 text-pink-300 text-xs">Elektron zichligi: Pt → C₂H₄</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-purple-200">
                      <p>• Pt ning <strong className="text-white">to'lgan d-orbitallari</strong> (d<sub>xz</sub>, d<sub>yz</sub>)</p>
                      <p>• Etilenning <strong className="text-white">bo'sh π*-antibonding orbitali</strong></p>
                      <p>• Natija: <strong className="text-pink-300">C=C bog' kuchsizlanadi</strong>, Pt−C bog' kuchayadi</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 rounded-2xl p-5">
                    <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                      <span>⚡</span> Sinergik effekt — bir-birini kuchaytirish
                    </h3>
                    <div className="bg-yellow-950/50 rounded-xl p-4 border border-yellow-700/30">
                      <div className="font-mono text-sm text-yellow-200 text-center space-y-2">
                        <p>σ-donatsiya ↑ → Pt da e⁻ zichligi ↑ → π-backdonatsiya ↑</p>
                        <p>π-backdonatsiya ↑ → Pt da e⁻ zichligi ↓ → σ-donatsiya ↑</p>
                        <p className="mt-3 text-yellow-300 font-bold">Natija: Ikkala komponent bir-birini kuchaytiradi!</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-950/50 rounded-xl p-5 border border-amber-700/30">
                  <h3 className="text-amber-400 font-bold mb-3">📐 Oddiy tushuntirish</h3>
                  <div className="space-y-3 text-sm text-purple-200">
                    <div className="bg-amber-900/30 rounded-lg p-3 border border-amber-700/30">
                      <p className="text-amber-300 font-bold text-xs mb-1">1. Etilen elektron beradi</p>
                      <p className="text-xs">C=C qo'sh bog'idagi elektronlar Pt ga o'tadi → σ-bog' hosil bo'ladi</p>
                    </div>
                    <div className="bg-amber-900/30 rounded-lg p-3 border border-amber-700/30">
                      <p className="text-amber-300 font-bold text-xs mb-1">2. Pt elektron qaytaradi</p>
                      <p className="text-xs">Pt ning d-elektronlari etilenning bo'sh orbitaliga o'tadi → π-bog'</p>
                    </div>
                    <div className="bg-amber-900/30 rounded-lg p-3 border border-amber-700/30">
                      <p className="text-amber-300 font-bold text-xs mb-1">3. Natija</p>
                      <p className="text-xs">C=C bog' biroz kuchsizlanadi (1.34 → 1.37 Å), lekin butunlay uzilmaydi</p>
                    </div>
                    <div className="bg-yellow-900/30 rounded-lg p-3 border border-yellow-700/30">
                      <p className="text-yellow-300 font-bold text-xs mb-1">💡 Analogiya</p>
                      <p className="text-xs">Etilen Pt ga &quot;quchoq ochadi&quot; — ikkala qo'li (C atomlari) bilan metallni ushlaydi</p>
                    </div>
                  </div>
                </div>
              )}
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
                      { freq: "1516 cm⁻¹", bond: "ν(C=C)", desc: "Uzaygan C=C (erkin: 1623 cm⁻¹)", intensity: "Kuchli" },
                      { freq: "340 cm⁻¹", bond: "ν(Pt−Cl)", desc: "Pt-Cl valent tebranish", intensity: "Kuchli" },
                      { freq: "405 cm⁻¹", bond: "ν(Pt−C)", desc: "Pt-C valent tebranish", intensity: "O'rta" },
                      { freq: "3010 cm⁻¹", bond: "ν(C−H)", desc: "C-H valent tebranish", intensity: "Kuchli" },
                      { freq: "1410 cm⁻¹", bond: "δ(CH₂)", desc: "CH₂ egilish", intensity: "O'rta" },
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
                      <p className="text-emerald-300 font-bold text-xs mb-1">¹H NMR</p>
                      <p className="text-xs">δ = 4.8 ppm (erkin C₂H₄: 5.4 ppm)</p>
                      <p className="text-xs text-emerald-300">Siljish: Δδ = −0.6 ppm (yuqori maydon)</p>
                    </div>
                    <div className="bg-teal-900/40 rounded-lg p-3 border border-teal-700/30">
                      <p className="text-teal-300 font-bold text-xs mb-1">¹³C NMR</p>
                      <p className="text-xs">δ = 76 ppm (erkin C₂H₄: 123 ppm)</p>
                      <p className="text-xs text-teal-300">Katta siljish: Δδ = −47 ppm</p>
                    </div>
                    <div className="bg-cyan-900/40 rounded-lg p-3 border border-cyan-700/30">
                      <p className="text-cyan-300 font-bold text-xs mb-1">¹⁹⁵Pt NMR</p>
                      <p className="text-xs">δ = −2135 ppm (K₂[PtCl₄] ga nisbatan)</p>
                      <p className="text-xs text-cyan-300">J(Pt-C) ≈ 160 Hz</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-5">
                <h3 className="text-green-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> NMR siljishi — DCD modeli isboti
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">¹H NMR:</strong> Koordinatsiyadan keyin protonlar yuqori maydonga siljiydi (−0.6 ppm)</p>
                  <p>• <strong className="text-white">¹³C NMR:</strong> Uglerodlar kuchli yuqori maydonga siljiydi (−47 ppm)</p>
                  <p>• <strong className="text-yellow-300">Sabab:</strong> π-backbonding C atomlarida elektron zichligini oshiradi → ekranlanish ortadi</p>
                  <p className="text-xs text-purple-400 mt-2">
                    Bu NMR siljishlari <strong className="text-pink-300">DCD modelining eng kuchli eksperimental isboti</strong> — 
                    π-backbonding haqiqatan ham mavjud!
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Qo'llanilish va ahamiyat</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-amber-950/50 rounded-xl p-5 border border-amber-700/30">
                  <h3 className="text-amber-400 font-bold mb-3">🧪 Ilmiy ahamiyat</h3>
                  <div className="space-y-3 text-sm text-purple-200">
                    <div className="bg-amber-900/40 rounded-lg p-3 border border-amber-700/30">
                      <p className="text-amber-300 font-bold text-xs mb-1">Organometallik kimyo asoschisi</p>
                      <p className="text-xs">Metall-uglerod bog'lanishining birinchi namunasi</p>
                    </div>
                    <div className="bg-amber-900/40 rounded-lg p-3 border border-amber-700/30">
                      <p className="text-amber-300 font-bold text-xs mb-1">DCD modeli</p>
                      <p className="text-xs">Metall-alken bog'lanishini tushuntirish uchun asos</p>
                    </div>
                    <div className="bg-amber-900/40 rounded-lg p-3 border border-amber-700/30">
                      <p className="text-amber-300 font-bold text-xs mb-1">Kataliz asosi</p>
                      <p className="text-xs">Olefin metatezisi, gidrogenlash, polimerizatsiya</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-950/50 rounded-xl p-5 border border-orange-700/30">
                  <h3 className="text-orange-400 font-bold mb-3">⚗️ Sanoat qo'llanilish</h3>
                  <div className="space-y-3 text-sm text-purple-200">
                    <div className="bg-orange-900/40 rounded-lg p-3 border border-orange-700/30">
                      <p className="text-orange-300 font-bold text-xs mb-1">Wacker jarayoni</p>
                      <p className="text-xs">Etilen → atsetaldegid (Pd katalizatori, Zeise tuzi analogi)</p>
                    </div>
                    <div className="bg-orange-900/40 rounded-lg p-3 border border-orange-700/30">
                      <p className="text-orange-300 font-bold text-xs mb-1">Ziegler-Natta katalizi</p>
                      <p className="text-xs">Polietilen ishlab chiqarish (olefin koordinatsiyasi)</p>
                    </div>
                    <div className="bg-orange-900/40 rounded-lg p-3 border border-orange-700/30">
                      <p className="text-orange-300 font-bold text-xs mb-1">Platina katalizatorlari</p>
                      <p className="text-xs">Gidrogenlash, gidrosilillash, C−H aktivatsiya</p>
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
                  <h3 className="text-green-400 font-bold mb-3">1-usul: Klassik sintez (Zeise usuli, 1827)</h3>
                  <div className="bg-green-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-green-300 border border-green-700/30">
                    <p>K₂[PtCl₄] + C₂H₅OH → K[PtCl₃(C₂H₄)] + KCl + ...</p>
                    <p className="text-green-300 text-xs mt-2">Qaynatish, etanol ham erituvchi ham reagent</p>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Mexanizm:</strong> Etanol PtCl₄²⁻ bilan reaksiyaga kirishadi, etilen hosil bo'ladi va koordinatsiyalanadi</p>
                    <p><strong className="text-white">Kashfiyot:</strong> Zeise bu reaktsiyani tasodifan kashf qildi!</p>
                  </div>
                </div>

                <div className="bg-green-950/50 rounded-2xl p-5 border border-green-700/30">
                  <h3 className="text-green-400 font-bold mb-3">2-usul: Zamonaviy sintez (asosiy)</h3>
                  <div className="bg-green-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-green-300 border border-green-700/30">
                    <p>K₂[PtCl₄] + C₂H₄ → K[PtCl₃(C₂H₄)] + KCl</p>
                    <p className="text-green-300 text-xs mt-2">Suvli eritma, xona harorati, etilen gazi</p>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Sharoit:</strong> K₂[PtCl₄] eritmasiga etilen gazi puflanadi</p>
                    <p><strong className="text-white">Harorat:</strong> Xona harorati (20-25°C)</p>
                    <p><strong className="text-white">Vaqt:</strong> Bir necha soat</p>
                    <p><strong className="text-white">Hosildorlik:</strong> 80-90%</p>
                    <p><strong className="text-white">Tozalash:</strong> Qayta kristallizatsiya (suvdan)</p>
                  </div>
                </div>

                <div className="bg-green-950/50 rounded-2xl p-5 border border-green-700/30">
                  <h3 className="text-green-400 font-bold mb-3">3-usul: K₂[PtCl₄] + SnCl₂ katalizatori</h3>
                  <div className="bg-green-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-green-300 border border-green-700/30">
                    <p>K₂[PtCl₄] + C₂H₄ → K[PtCl₃(C₂H₄)] + KCl</p>
                    <p className="text-green-300 text-xs mt-2">SnCl₂ katalizator sifatida, tez reaksiya</p>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Afzalligi:</strong> Tezroq reaksiya, yuqori hosildorlik</p>
                    <p><strong className="text-white">Mexanizm:</strong> SnCl₂ Cl⁻ ni almashtiradi, keyin etilen kiradi</p>
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Organometallik kimyoning tug'ilishi (1827)</h2>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-2xl p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-yellow-600 to-amber-600 flex items-center justify-center text-6xl flex-shrink-0 shadow-2xl">
                    👨‍🔬
                  </div>
                  <div className="flex-1">
                    <h3 className="text-yellow-400 font-bold text-xl mb-2">William Christopher Zeise (1789-1847)</h3>
                    <p className="text-purple-200 text-sm mb-3 leading-relaxed">
                      <strong className="text-yellow-300">1827 yilda</strong> Daniyalik kimyogar W.C. Zeise 
                      Kopengagen universitetida PtCl₄ ni etanol bilan qaynatib, <strong className="text-white">sariq kristall</strong> oldi.
                      U bu birikmada <strong className="text-pink-300">etilen metall bilan bog'langan</strong>ligini aniqladi — 
                      bu kimyo tarixida <strong className="text-yellow-300">birinchi organometallik birikma</strong> edi!
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-xs text-yellow-300 font-semibold">
                        📜 1827 yil
                      </span>
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-xs text-amber-300 font-semibold">
                        📍 Kopengagen
                      </span>
                      <span className="px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-xs text-orange-300 font-semibold">
                        🏆 Birinchi organometallik
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { year: "1827", title: "Zeise kashfiyoti", desc: "W.C. Zeise PtCl₄ + etanol reaktsiyasidan sariq kristall oldi — birinchi organometallik birikma" },
                  { year: "1830-1860", title: "Bahs va shubha", desc: "Ko'pchilik kimyogarlar metall-uglerod bog'iga ishonmadi — bu o'sha davr nazariyasiga zid edi" },
                  { year: "1868", title: "Strukturani tasdiqlash", desc: "Birnbaum tahlil orqali Zeise tuzi formulasini tasdiqladi" },
                  { year: "1951", title: "Dewar modeli", desc: "Michael Dewar metall-alken bog'lanishini tushuntirish uchun σ-donatsiya + π-backdonatsiya modelini taklif qildi" },
                  { year: "1953", title: "Chatt va Duncanson", desc: "J. Chatt va L. Duncanson mustaqil ravishda o'xshash modelni taklif qildi (DCD modeli)" },
                  { year: "1965", title: "Rentgen strukturasi", desc: "Zeise tuzi kristall strukturasi to'liq aniqlandi — η²-etilen bog'lanishi isbotlandi" },
                  { year: "1973", title: "Nobel mukofoti", desc: "Fischer va Wilkinson organometallik kimyo uchun Nobel oldi — Zeise kashfiyotining davomi" },
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
                  <span>💡</span> Nima uchun Zeise tuzi kimyo tarixida muhim?
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Paradigmani buzdi:</strong> O'sha davrda metall faqat metall yoki kislorod bilan bog'lanadi deb o'ylangan edi</p>
                  <p>• <strong className="text-white">Yangi soha ochdi:</strong> Organometallik kimyo butunlay yangi soha sifatida paydo bo'ldi</p>
                  <p>• <strong className="text-white">Kataliz asosi:</strong> Bugungi sanoat katalizatorlarining ko'pchiligi metall-alken bog'lanishiga asoslangan</p>
                  <p>• <strong className="text-white">Nobel mukofotlari:</strong> 1973 (Fischer/Wilkinson), 2005 (Chauvin/Grubbs/Schrock) — hammasi Zeise dan boshlangan</p>
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
              href="/ilmiy/birikmares/ferrosen"
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold transition-all flex items-center gap-2"
            >
              <span>←</span>
              <span className="hidden sm:inline">Ferrosen</span>
            </Link>
            <Link 
              href="/ilmiy/birikmares/vitamin-b12"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold transition-all shadow-lg shadow-amber-500/30 flex items-center gap-2"
            >
              <span className="hidden sm:inline">Vitamin B₁₂</span>
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