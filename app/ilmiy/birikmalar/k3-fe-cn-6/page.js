"use client"

import Link from "next/link"
import { useState } from "react"

export default function K3FeCN6() {
  const [activeTab, setActiveTab] = useState("overview")

  const tabs = [
    { id: "overview", label: "📋 Umumiy", icon: "📋" },
    { id: "comparison", label: "⚖️ K₃ vs K₄ taqqoslash", icon: "⚖️" },
    { id: "structure", label: "🧬 Oktaedrik (Oₕ)", icon: "🧬" },
    { id: "electronic", label: "⚛️ 17 elektron (d⁵)", icon: "⚛️" },
    { id: "bonding", label: "🔗 Fe−C≡N bog'lanish", icon: "🔗" },
    { id: "magnetism", label: "🧲 Paramagnitlik", icon: "🧲" },
    { id: "spectroscopy", label: "🔬 Spektroskopiya", icon: "🔬" },
    { id: "redox", label: "⚡ Oksidlovchi", icon: "⚡" },
    { id: "turnbull", label: "🎨 Turnbull's Blue", icon: "🎨" },
    { id: "applications", label: "🏭 Qo'llanilish", icon: "🏭" },
    { id: "synthesis", label: "⚗️ Sintez", icon: "⚗️" },
    { id: "history", label: "🏆 Tarix", icon: "🏆" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white relative overflow-hidden">
      
      {/* ═══ ANIMATED BACKGROUND ═══ */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(239,68,68,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        {['Fe³⁺', 'd⁵', '17 e⁻', 'Oₕ', 'd²sp³', 'CN⁻', '2135 cm⁻¹', 'Turnbull Blue', 'Gmelin 1822'].map((sym, i) => (
          <div
            key={i}
            className="absolute text-red-400/5 font-mono font-bold select-none pointer-events-none"
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
            <span className="text-red-400 font-semibold">K₃[Fe(CN)₆]</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 text-[10px] text-red-300 font-bold uppercase tracking-wider">
                  ⚡ Kuchli oksidlovchi
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] text-emerald-300 font-semibold">
                  🧲 Paramagnit (1 e⁻)
                </span>
                <span className="px-2.5 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-[10px] text-yellow-300 font-semibold">
                  🎨 Turnbull's Blue
                </span>
                <span className="px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-[10px] text-purple-300 font-semibold">
                  📜 Gmelin 1822
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-red-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
                K₃[Fe(CN)₆]
              </h1>
              <p className="text-purple-300 text-sm mt-1">
                Kaliy geksatsianoferrat(III) • Qizil qon tuzi • Potassium ferricyanide
              </p>
            </div>
            
            <div className="flex gap-2">
              <Link 
                href="/ilmiy/birikmalar/k4-fe-cn-6"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 hover:border-yellow-400/60 text-yellow-300 text-sm font-semibold transition-all flex items-center gap-2"
              >
                <span>💛</span>
                <span className="hidden sm:inline">K₄[Fe(CN)₆]</span>
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
            { label: "Formula", value: "K₃[Fe(CN)₆]", icon: "🧪", color: "text-red-400" },
            { label: "M massa", value: "329.24 g/mol", icon: "⚖️", color: "text-blue-400" },
            { label: "Geometriya", value: "Oktaedrik (Oₕ)", icon: "💎", color: "text-purple-400" },
            { label: "Kompleks rangi", value: "Qizil", icon: "🎨", color: "text-red-400" },
            { label: "Elektronlar", value: "d⁵ (17 e⁻)", icon: "🧲", color: "text-emerald-400" },
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
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/30'
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
            <div className="bg-gradient-to-br from-purple-900/40 to-red-900/40 border border-red-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-xl shadow-lg shadow-red-500/30">
                  📋
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Asosiy ma'lumotlar</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  ["CAS raqami", "13746-66-2"],
                  ["Zichlik", "1.89 g/cm³"],
                  ["Suyuqlanish harorati", "Parchalanadi (300°C)"],
                  ["Qaynash harorati", "Yo'q"],
                  ["Eruvchanlik (H₂O)", "46 g/100mL (20°C)"],
                  ["Eruvchanlik (EtOH)", "Kam eriydi"],
                  ["Simmetriya", "Oₕ (oktaedrik)"],
                  ["Rangi", "Qizil kristall"],
                ].map((item, i) => (
                  <div key={i} className="bg-red-950/50 rounded-xl p-3 border border-red-700/30">
                    <div className="text-[10px] uppercase tracking-wider text-red-400 font-semibold mb-1">{item[0]}</div>
                    <div className="text-white font-semibold text-sm">{item[1]}</div>
                  </div>
                ))}
              </div>

              {/* ICHKI/TASHQI SFERA */}
              <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl p-5">
                <h3 className="text-red-400 font-bold mb-3 flex items-center gap-2">
                  <span>💎</span> Ichki va tashqi sfera
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-red-900/30 rounded-xl p-4 border border-red-700/30">
                    <h4 className="text-red-300 font-bold text-sm mb-2">🔒 Ichki sfera [Fe(CN)₆]³⁻</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">Fe³⁺</strong> — markaziy ion (d⁵)</li>
                      <li>• <strong className="text-white">6 × CN⁻</strong> — tsianid ligandlari (kuchli maydon)</li>
                      <li>• <strong className="text-white">6 × C</strong> — donor atomlar</li>
                      <li>• <strong className="text-yellow-300">Zaryad:</strong> +3 + 6×(−1) = <strong>−3</strong></li>
                      <li>• <strong className="text-pink-300">17 elektron:</strong> 5 + 6×2 = 17 (1 juftlashmagan)</li>
                    </ul>
                  </div>
                  <div className="bg-orange-900/30 rounded-xl p-4 border border-orange-700/30">
                    <h4 className="text-orange-300 font-bold text-sm mb-2">🔓 Tashqi sfera 3K⁺</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">3 × K⁺</strong> — counter-ionlar</li>
                      <li>• Ion bog'lar bilan bog'langan</li>
                      <li>• Suvda darhol dissotsilanadi</li>
                      <li>• <strong className="text-white">4 ion:</strong> [Fe(CN)₆]³⁻ + 3K⁺</li>
                      <li>• <strong className="text-white">Elektr o'tkazuvchanlik:</strong> 4-ionli elektrolit</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* XULOSA */}
            <div className="bg-gradient-to-r from-red-600/10 via-orange-600/10 to-yellow-600/10 border border-red-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>✅</span> Asosiy xulosalar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "💎 <strong>Oktaedrik geometriya:</strong> Oₕ simmetriya, 6 ta ekvivalent CN⁻",
                  "⚛️ <strong>17 elektron:</strong> Fe³⁺ (d⁵) + 6×2 = 17 → t₂g⁵ e₉⁰ (1 juftlashmagan e⁻)",
                  "🧲 <strong>Paramagnit:</strong> μ_eff ≈ 2.3 BM (1 unpaired electron)",
                  "⚡ <strong>Kuchli oksidlovchi:</strong> E° = +0.36 V ([Fe(CN)₆]³⁻/⁴⁻)",
                  "🎨 <strong>Turnbull's Blue:</strong> Fe²⁺ + [Fe(CN)₆]³⁻ → ko'k cho'kma",
                  "🔬 <strong>FTIR:</strong> ν(CN) = 2135 cm⁻¹ (K₄ da 2044 dan yuqori!)",
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
        {/* COMPARISON TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "comparison" && (
          <>
            <div className="bg-gradient-to-br from-red-900/40 to-yellow-900/40 border-2 border-red-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-yellow-500 flex items-center justify-center text-xl shadow-lg shadow-red-500/30">
                  ⚖️
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">K₃[Fe(CN)₆] vs K₄[Fe(CN)₆] — To'liq taqqoslash</h2>
              </div>
              
              <div className="bg-gradient-to-r from-red-500/10 to-yellow-500/10 border border-red-500/20 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  Bu ikki birikma <strong className="text-white">bir-birining oksidlanish/qaytarilish juftligi</strong> hisoblanadi.
                  Fe²⁺ ↔ Fe³⁺ o'zgarishi <strong className="text-yellow-300">butunlay boshqa xususiyatlar</strong>ga olib keladi —
                  rang, magnitlik, spektroskopik belgilar, kimyoviy faollik.
                </p>
              </div>

              {/* JADVAL */}
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead className="bg-purple-950/60">
                    <tr>
                      <th className="py-3 px-4 text-purple-300 text-left">Xususiyat</th>
                      <th className="py-3 px-4 text-red-300 text-left">🔴 K₃[Fe(CN)₆] ← Siz</th>
                      <th className="py-3 px-4 text-yellow-300 text-left">💛 K₄[Fe(CN)₆]</th>
                    </tr>
                  </thead>
                  <tbody className="text-purple-200">
                    <tr className="border-b border-purple-800/30 bg-red-900/20">
                      <td className="py-3 px-4 font-bold">Nomi</td>
                      <td className="py-3 px-4">Qizil qon tuzi</td>
                      <td className="py-3 px-4">Sariq qon tuzi</td>
                    </tr>
                    <tr className="border-b border-purple-800/30 bg-red-900/20">
                      <td className="py-3 px-4 font-bold">Fe oksidlanish darajasi</td>
                      <td className="py-3 px-4 text-red-300 font-bold">Fe³⁺ (d⁵)</td>
                      <td className="py-3 px-4 text-yellow-300">Fe²⁺ (d⁶)</td>
                    </tr>
                    <tr className="border-b border-purple-800/30">
                      <td className="py-3 px-4">Molekulyar massa</td>
                      <td className="py-3 px-4 font-mono">329.24 g/mol</td>
                      <td className="py-3 px-4 font-mono">368.35 g/mol</td>
                    </tr>
                    <tr className="border-b border-purple-800/30 bg-red-900/20">
                      <td className="py-3 px-4 font-bold">Rang</td>
                      <td className="py-3 px-4 text-red-300 font-bold">Qizil</td>
                      <td className="py-3 px-4 text-yellow-300">Sariq</td>
                    </tr>
                    <tr className="border-b border-purple-800/30 bg-red-900/20">
                      <td className="py-3 px-4 font-bold">Valent elektronlar</td>
                      <td className="py-3 px-4 text-red-300 font-bold">17 (d⁵)</td>
                      <td className="py-3 px-4 text-yellow-300">18 (d⁶)</td>
                    </tr>
                    <tr className="border-b border-purple-800/30">
                      <td className="py-3 px-4">Konfiguratsiya</td>
                      <td className="py-3 px-4 font-mono">t₂g⁵ e₉⁰</td>
                      <td className="py-3 px-4 font-mono">t₂g⁶ e₉⁰</td>
                    </tr>
                    <tr className="border-b border-purple-800/30 bg-red-900/20">
                      <td className="py-3 px-4 font-bold">Magnitlik</td>
                      <td className="py-3 px-4 text-red-300 font-bold">Paramagnit (μ ≈ 2.3 BM)</td>
                      <td className="py-3 px-4 text-yellow-300">Diamagnit (μ = 0)</td>
                    </tr>
                    <tr className="border-b border-purple-800/30">
                      <td className="py-3 px-4">Δₒ (cm⁻¹)</td>
                      <td className="py-3 px-4 font-mono">35,000</td>
                      <td className="py-3 px-4 font-mono">33,000</td>
                    </tr>
                    <tr className="border-b border-purple-800/30 bg-red-900/20">
                      <td className="py-3 px-4 font-bold">ν(CN) (FTIR)</td>
                      <td className="py-3 px-4 text-red-300 font-bold">2135 cm⁻¹</td>
                      <td className="py-3 px-4 text-yellow-300">2044 cm⁻¹</td>
                    </tr>
                    <tr className="border-b border-purple-800/30">
                      <td className="py-3 px-4">E° (V)</td>
                      <td className="py-3 px-4 font-mono">+0.36</td>
                      <td className="py-3 px-4 font-mono">—</td>
                    </tr>
                    <tr className="border-b border-purple-800/30 bg-red-900/20">
                      <td className="py-3 px-4 font-bold">Kimyoviy xususiyat</td>
                      <td className="py-3 px-4 text-red-300 font-bold">Kuchli oksidlovchi</td>
                      <td className="py-3 px-4 text-yellow-300">Qaytaruvchi</td>
                    </tr>
                    <tr className="border-b border-purple-800/30">
                      <td className="py-3 px-4">Fe²⁺ bilan reaksiya</td>
                      <td className="py-3 px-4">Turnbull's Blue (ko'k)</td>
                      <td className="py-3 px-4">—</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Fe³⁺ bilan reaksiya</td>
                      <td className="py-3 px-4">—</td>
                      <td className="py-3 px-4">Prussian Blue (ko'k)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-gradient-to-r from-red-500/10 to-yellow-500/10 border-2 border-yellow-500/30 rounded-2xl p-5">
                <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                  <span>💡</span> Nega ν(CN) farq qiladi?
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-red-300">Fe³⁺</strong> (K₃) — kuchliroq Lewis kislotasi, kamroq π-donor (kam d-elektron)</p>
                  <p>• <strong className="text-yellow-300">Fe²⁺</strong> (K₄) — kuchsizroq Lewis kislotasi, kuchliroq π-donor (ko'p d-elektron)</p>
                  <p>• Natija: <strong className="text-white">K₃ da π-backbonding kuchsiz</strong> → C≡N bog' kamroq kuchsizlanadi → <strong className="text-red-300">ν(CN) yuqori</strong> (2135 cm⁻¹)</p>
                  <p>• K₄ da π-backbonding kuchli → C≡N bog' ko'proq kuchsizlanadi → <strong className="text-yellow-300">ν(CN) past</strong> (2044 cm⁻¹)</p>
                  <p className="text-xs text-purple-400 mt-2">
                    <strong className="text-pink-300">Farq: 91 cm⁻¹!</strong> — Bu FTIR orqali Fe²⁺ va Fe³⁺ ni aniq ajratish imkonini beradi.
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
            <div className="bg-gradient-to-br from-purple-900/40 to-red-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-red-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  💎
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Oktaedrik geometriya (Oₕ)</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-purple-400 font-bold text-sm uppercase tracking-wider">Geometrik parametrlar</h3>
                  <div className="space-y-2">
                    {[
                      ["Geometriya", "Oktaedrik"],
                      ["Nuqtali guruh", "Oₕ"],
                      ["Koordinatsion son", "6"],
                      ["Fe−C masofa", "1.94 Å (6 ta, ekvivalent)"],
                      ["C≡N masofa", "1.14 Å (uch bog')"],
                      ["C−Fe−C burchak", "90° (cis) / 180° (trans)"],
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
                  <h3 className="text-red-400 font-bold text-sm uppercase tracking-wider">Oₕ simmetriya elementlari</h3>
                  <div className="space-y-2">
                    {[
                      ["E", "Ayniylik"],
                      ["8C₃", "4 ta C₃ o'qi (kub diagonallari)"],
                      ["3C₄", "3 ta C₄ o'qi (x, y, z)"],
                      ["6C₂", "6 ta C₂ o'qi (qirralar orqali)"],
                      ["i", "Inversiya markazi (Fe da)"],
                      ["3σₕ", "Gorizontal tekisliklar"],
                      ["6σₐ", "Diagonal tekisliklar"],
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-1.5 border-b border-red-800/30">
                        <span className="text-red-300 text-sm font-mono font-bold">{item[0]}</span>
                        <span className="text-purple-200 text-xs">{item[1]}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-red-950/50 rounded-xl p-3 border border-red-700/30 mt-3">
                    <p className="text-red-200 text-xs">
                      <strong className="text-red-400">Jami:</strong> 48 ta simmetriya operatsiyasi — <strong>eng yuqori simmetriya!</strong>
                      <strong className="text-white"> Barcha 6 ta CN⁻ ekvivalent</strong> — FTIR da bitta ν(CN) cho'qqisi.
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
                <h2 className="text-xl md:text-2xl font-bold text-white">17 elektron — 18 emas!</h2>
              </div>
              
              <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-2 border-red-500/30 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-red-400">Diqqat!</strong> K₃[Fe(CN)₆] da <strong className="text-yellow-300">18 elektron qoidasi buziladi</strong>!
                  Fe³⁺ (d⁵) + 6×2 = <strong className="text-red-300">17 elektron</strong>.
                  Bu kompleks <strong className="text-white">barqaror</strong> bo'lsa ham, 18 emas 17 elektronga ega.
                  Sababi: <strong className="text-pink-300">CN⁻ kuchli maydon ligandi</strong> bo'lsa ham,
                  Fe³⁺ da bitta d-elektron kam — <strong>t₂g⁵</strong> konfiguratsiya.
                </p>
              </div>

              {/* ELEKTRON HISOB */}
              <div className="bg-emerald-950/50 rounded-2xl p-6 border border-emerald-700/30 mb-6">
                <h3 className="text-emerald-400 font-bold mb-4">[Fe(CN)₆]³⁻ uchun elektron hisobi</h3>
                <div className="space-y-3">
                  <div className="bg-emerald-900/40 rounded-xl p-4 border border-emerald-700/30 flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold">Fe³⁺ (temir)</div>
                      <div className="text-purple-300 text-xs mt-1">
                        Konfiguratsiya: [Ar] 3d⁵ → 5 ta valent elektron
                      </div>
                    </div>
                    <div className="text-emerald-300 text-2xl font-bold font-mono">5 e⁻</div>
                  </div>
                  <div className="bg-emerald-900/40 rounded-xl p-4 border border-emerald-700/30 flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold">6 × CN⁻</div>
                      <div className="text-purple-300 text-xs mt-1">
                        Har bir CN⁻ 2 ta elektron beradi (σ-donor)
                      </div>
                    </div>
                    <div className="text-emerald-300 text-2xl font-bold font-mono">6 × 2 = 12 e⁻</div>
                  </div>
                  <div className="bg-red-900/40 rounded-xl p-4 border-2 border-red-500/30 flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold text-lg">JAMI</div>
                      <div className="text-red-300 text-xs mt-1">
                        18 elektron qoidasi buzildi! (1 juftlashmagan e⁻)
                      </div>
                    </div>
                    <div className="text-red-300 text-3xl font-bold font-mono">17 e⁻</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30 text-center">
                  <div className="text-4xl mb-2">🔵</div>
                  <div className="text-purple-400 text-xs uppercase mb-1">Erkin Fe atomi</div>
                  <div className="text-white font-mono font-bold">[Ar] 3d⁶ 4s²</div>
                  <div className="text-purple-300 text-xs mt-1">Z = 26</div>
                </div>
                <div className="bg-red-950/50 rounded-xl p-5 border border-red-700/30 text-center">
                  <div className="text-4xl mb-2">🔴</div>
                  <div className="text-red-400 text-xs uppercase mb-1">Fe³⁺ ioni</div>
                  <div className="text-white font-mono font-bold">[Ar] 3d⁵</div>
                  <div className="text-purple-300 text-xs mt-1">5 ta d-elektron</div>
                </div>
                <div className="bg-orange-950/50 rounded-xl p-5 border border-orange-700/30 text-center">
                  <div className="text-4xl mb-2">🟠</div>
                  <div className="text-orange-400 text-xs uppercase mb-1">Kompleksda</div>
                  <div className="text-white font-mono font-bold">t₂g⁵ e₉⁰</div>
                  <div className="text-red-300 text-xs mt-1">Quyi spinli (1 unpaired)</div>
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
                  <p>KMBE = 5 × (−0.4Δₒ) + 0 × (+0.6Δₒ)</p>
                  <p className="text-white font-bold text-lg mt-2">KMBE = −2.0Δₒ</p>
                  <p className="text-violet-300 text-xs mt-1">Δₒ ≈ 35,000 cm⁻¹ (juda kuchli maydon)</p>
                  <p className="text-white font-bold mt-2">≈ −833 kJ/mol</p>
                </div>
                <p className="text-purple-300 text-xs">
                  <strong className="text-yellow-300">Taqqoslash:</strong> K₄[Fe(CN)₆] da KMBE = −2.4Δₒ (6 e⁻),
                  K₃ da esa <strong className="text-red-300">−2.0Δₒ</strong> (5 e⁻) — biroz kamroq barqaror.
                  Lekin CN⁻ ning kuchli maydoni tufayli ikkalasi ham <strong className="text-white">juda barqaror</strong>.
                </p>
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Fe−C≡N bog'lanish — π-backbonding kamroq</h2>
              </div>
              
              <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-red-400">Fe³⁺</strong> — <strong className="text-white">kuchsizroq π-donor</strong> 
                  (Fe²⁺ ga qaraganda). Sababi: <strong className="text-yellow-300">kamroq d-elektron</strong> (d⁵ vs d⁶).
                  Shuning uchun K₃[Fe(CN)₆] da <strong className="text-pink-300">π-backbonding kuchsizroq</strong>,
                  C≡N bog' kamroq kuchsizlanadi va <strong className="text-red-300">ν(CN) yuqoriroq</strong> (2135 cm⁻¹).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
                  <h3 className="text-purple-400 font-bold mb-3">1️⃣ σ-donatsiya (C → Fe)</h3>
                  <div className="bg-purple-900/40 rounded-lg p-4 font-mono text-xs text-purple-200 border border-purple-700/30 mb-3">
                    <pre className="whitespace-pre">{`  :C≡N:⁻ → Fe³⁺
  (lone pair)
  
  C ning sp orbitali
  Fe ning bo'sh d²sp³ orbitaliga
  elektron juftini beradi`}</pre>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Fe³⁺ kuchliroq Lewis kislotasi</strong> → σ-bog' <strong className="text-green-400">kuchliroq</strong></p>
                    <p>• Natija: Fe−C bog' K₄ ga qaraganda biroz qisqaroq</p>
                  </div>
                </div>

                <div className="bg-pink-950/50 rounded-xl p-5 border border-pink-700/30">
                  <h3 className="text-pink-400 font-bold mb-3">2️⃣ π-backbonding (Fe → C≡N)</h3>
                  <div className="bg-pink-900/40 rounded-lg p-4 font-mono text-xs text-pink-200 border border-pink-700/30 mb-3">
                    <pre className="whitespace-pre">{`  Fe³⁺ → C≡N
  (d-elektron)
  
  Fe ning t₂g orbitali (5 e⁻)
  C≡N ning 2π* orbitaliga
  elektron qaytaradi`}</pre>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Fe³⁺ kuchsizroq π-donor</strong> (5 e⁻ vs 6 e⁻)</p>
                    <p>• π-backbonding <strong className="text-red-300">kuchsizroq</strong></p>
                    <p>• Natija: C≡N bog' <strong className="text-yellow-300">kamroq kuchsizlanadi</strong></p>
                  </div>
                </div>
              </div>

              {/* TAQQOSLASH */}
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 rounded-2xl p-5">
                <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                  <span>⚡</span> K₃ vs K₄ — π-backbonding taqqoslash
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-purple-950/60">
                      <tr>
                        <th className="py-2 px-3 text-purple-300 text-left">Xususiyat</th>
                        <th className="py-2 px-3 text-red-300 text-left">K₃ (Fe³⁺, d⁵)</th>
                        <th className="py-2 px-3 text-yellow-300 text-left">K₄ (Fe²⁺, d⁶)</th>
                      </tr>
                    </thead>
                    <tbody className="text-purple-200">
                      <tr className="border-b border-purple-800/30">
                        <td className="py-2 px-3">t₂g elektronlar</td>
                        <td className="py-2 px-3 font-mono text-red-300">5</td>
                        <td className="py-2 px-3 font-mono text-yellow-300">6</td>
                      </tr>
                      <tr className="border-b border-purple-800/30">
                        <td className="py-2 px-3">π-backbonding kuchi</td>
                        <td className="py-2 px-3 text-red-300">Kuchsizroq</td>
                        <td className="py-2 px-3 text-yellow-300">Kuchliroq</td>
                      </tr>
                      <tr className="border-b border-purple-800/30">
                        <td className="py-2 px-3">C≡N bog' kuchi</td>
                        <td className="py-2 px-3 text-red-300 font-bold">Kuchliroq</td>
                        <td className="py-2 px-3">Kuchsizroq</td>
                      </tr>
                      <tr className="border-b border-purple-800/30 bg-red-900/20">
                        <td className="py-2 px-3 font-bold">ν(CN) (FTIR)</td>
                        <td className="py-2 px-3 font-mono text-red-300 font-bold">2135 cm⁻¹</td>
                        <td className="py-2 px-3 font-mono text-yellow-300">2044 cm⁻¹</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3">Farq</td>
                        <td className="py-2 px-3 text-red-300 font-bold" colSpan={2}>
                          <span className="text-center block">Δν = 91 cm⁻¹ (katta farq!)</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* MAGNETISM TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "magnetism" && (
          <>
            <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  🧲
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Paramagnitlik — 1 juftlashmagan elektron</h2>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-purple-400">K₃[Fe(CN)₆]</strong> — bu 
                  <strong className="text-white"> paramagnit kompleks</strong>.
                  Sababi: <strong className="text-yellow-300">t₂g⁵</strong> konfiguratsiya — 
                  bitta orbitalda <strong className="text-red-300">1 juftlashmagan elektron</strong> bor.
                  Bu K₄[Fe(CN)₆] dan butunlay farq qiladi (u <strong>diamagnit</strong>, chunki t₂g⁶).
                </p>
              </div>

              {/* MAGNIT HISOB */}
              <div className="bg-purple-950/50 rounded-2xl p-5 border border-purple-700/30 mb-6">
                <h3 className="text-purple-400 font-bold mb-3">Magnit moment hisobi</h3>
                <div className="bg-purple-900/60 rounded-xl p-4 font-mono text-sm text-purple-200 border border-purple-700/30 mb-4">
                  <p>μ_eff = √(n(n+2)) BM</p>
                  <p className="mt-2">n = 1 (juftlashmagan elektronlar soni)</p>
                  <p className="mt-2">μ_eff = √(1(1+2)) = √3</p>
                  <p className="text-white font-bold text-lg mt-2">μ_eff ≈ 1.73 BM (spin-only)</p>
                  <p className="text-purple-300 text-xs mt-1">Eksperimental: ≈ 2.3 BM (orbital hissa qo'shiladi)</p>
                </div>
              </div>

              {/* TAQQOSLASH */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-red-950/50 rounded-xl p-5 border-2 border-red-500/30">
                  <h3 className="text-red-400 font-bold mb-3">🔴 K₃[Fe(CN)₆] ← Siz</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Konfiguratsiya:</strong> t₂g⁵ e₉⁰</p>
                    <p>• <strong className="text-white">Juftlashmagan e⁻:</strong> <span className="text-red-300 font-bold">1 ta</span></p>
                    <p>• <strong className="text-white">Magnitlik:</strong> <span className="text-red-300 font-bold">Paramagnit</span></p>
                    <p>• <strong className="text-white">μ_eff:</strong> ≈ 2.3 BM</p>
                    <p>• <strong className="text-white">Gouy tarozi:</strong> namunani tortadi</p>
                  </div>
                </div>

                <div className="bg-yellow-950/50 rounded-xl p-5 border border-yellow-700/30">
                  <h3 className="text-yellow-400 font-bold mb-3">💛 K₄[Fe(CN)₆]</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Konfiguratsiya:</strong> t₂g⁶ e₉⁰</p>
                    <p>• <strong className="text-white">Juftlashmagan e⁻:</strong> <span className="text-yellow-300">0 ta</span></p>
                    <p>• <strong className="text-white">Magnitlik:</strong> <span className="text-yellow-300">Diamagnit</span></p>
                    <p>• <strong className="text-white">μ_eff:</strong> 0 BM</p>
                    <p>• <strong className="text-white">Gouy tarozi:</strong> namunani itaradi</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-2xl p-5">
                <h3 className="text-purple-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Nega eksperimental μ_eff (2.3 BM) &gt; spin-only (1.73 BM)?
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-yellow-300">Orbital angular momentum hissasi:</strong> t₂g⁵ da bitta "teshik" bor</p>
                  <p>• Bu teshik <strong className="text-white">orbital harakat</strong>ga imkon beradi</p>
                  <p>• Natija: <strong className="text-red-300">spin-orbital bog'lanish</strong> μ_eff ni oshiradi</p>
                  <p className="text-xs text-purple-400 mt-2">
                    Bu hodisa <strong className="text-white">t₂g⁵ konfiguratsiyaga xos</strong> — 
                    boshqa quyi spinli d⁵ komplekslarda ham kuzatiladi.
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
                <h2 className="text-xl md:text-2xl font-bold text-white">FTIR spektroskopiya</h2>
              </div>
              
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
                    <tr className="border-b border-purple-800/30 bg-red-900/20">
                      <td className="py-3 px-4 font-mono font-bold text-red-300">2135</td>
                      <td className="py-3 px-4">ν(C≡N) — stretching</td>
                      <td className="py-3 px-4">Juda kuchli</td>
                      <td className="py-3 px-4 text-xs">6 ta ekvivalent CN (bitta cho'qqi!)</td>
                    </tr>
                    <tr className="border-b border-purple-800/30">
                      <td className="py-3 px-4 font-mono">590</td>
                      <td className="py-3 px-4">ν(Fe−C)</td>
                      <td className="py-3 px-4">Kuchli</td>
                      <td className="py-3 px-4 text-xs">Metall-uglerod bog'i</td>
                    </tr>
                    <tr className="border-b border-purple-800/30">
                      <td className="py-3 px-4 font-mono">420</td>
                      <td className="py-3 px-4">δ(Fe−C−N)</td>
                      <td className="py-3 px-4">O'rta</td>
                      <td className="py-3 px-4 text-xs">Egilish tebranishi</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono">2044</td>
                      <td className="py-3 px-4">ν(CN) — K₄ da</td>
                      <td className="py-3 px-4">Kuchli</td>
                      <td className="py-3 px-4 text-xs text-purple-400">Taqqoslash uchun</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-5">
                <h3 className="text-green-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> ν(CN) siljishi — oksidlanish darajasi indikatori
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">K₃[Fe(CN)₆]:</strong> ν(CN) = <span className="text-red-300 font-bold">2135 cm⁻¹</span></p>
                  <p>• <strong className="text-white">K₄[Fe(CN)₆]:</strong> ν(CN) = <span className="text-yellow-300">2044 cm⁻¹</span></p>
                  <p>• <strong className="text-white">Farq:</strong> <span className="text-pink-300 font-bold">91 cm⁻¹</span> — juda katta!</p>
                  <p className="text-xs text-purple-400 mt-2">
                    Bu farq <strong className="text-white">FTIR orqali Fe²⁺ va Fe³⁺ ni aniqlash</strong> uchun ishlatiladi.
                    Aralashmada ikkala cho'qqi ham ko'rinadi — nisbiy miqdorni ham aniqlash mumkin.
                  </p>
                </div>
              </div>
            </div>

            {/* UV-VIS */}
            <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">
                  🌈
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">UV-Vis spektroskopiya</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-950/50 rounded-xl p-5 border-2 border-red-500/30">
                  <h3 className="text-red-400 font-bold mb-3">K₃[Fe(CN)₆] (qizil) ← Siz</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">λ<sub>max</sub>:</strong> <span className="text-red-300 font-bold">420 nm</span> (LMCT)</p>
                    <p>• <strong className="text-white">d-d o'tishlar:</strong> 320 nm da</p>
                    <p>• <strong className="text-white">Rang:</strong> qizil (ko'k-yashil yutiladi)</p>
                    <p className="text-xs text-purple-400 mt-2">
                      <strong className="text-yellow-300">LMCT:</strong> Ligand → Metall Charge Transfer.
                      CN⁻ ning elektronlari Fe³⁺ ga uzatiladi — kuchli yutilish.
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-950/50 rounded-xl p-5 border border-yellow-700/30">
                  <h3 className="text-yellow-400 font-bold mb-3">K₄[Fe(CN)₆] (sariq)</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">λ<sub>max</sub>:</strong> <span className="text-yellow-300">305 nm</span> (LMCT)</p>
                    <p>• <strong className="text-white">d-d o'tishlar:</strong> 220 nm da</p>
                    <p>• <strong className="text-white">Rang:</strong> sariq (UB-sohada yutiladi)</p>
                    <p className="text-xs text-purple-400 mt-2">
                      <strong className="text-yellow-300">Sabab:</strong> Fe²⁺ kuchsizroq Lewis kislotasi → 
                      LMCT yuqori energiyaga siljiydi (UB-sohaga).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* REDOX TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "redox" && (
          <>
            <div className="bg-gradient-to-br from-red-900/40 to-orange-900/40 border-2 border-red-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-xl shadow-lg shadow-red-500/30">
                  ⚡
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Kuchli oksidlovchi — E° = +0.36 V</h2>
              </div>
              
              <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-red-400">[Fe(CN)₆]³⁻</strong> — bu 
                  <strong className="text-white"> kuchli oksidlovchi</strong>.
                  U boshqa moddalardan elektron olib, <strong className="text-yellow-300">[Fe(CN)₆]⁴⁻</strong> ga 
                  qaytariladi. Bu reaksiya <strong className="text-white">analitik kimyoda</strong> keng qo'llaniladi.
                </p>
              </div>

              {/* REDOKS REAKTSIYALAR */}
              <div className="space-y-3 mb-6">
                {[
                  { reaction: "[Fe(CN)₆]³⁻ + e⁻ → [Fe(CN)₆]⁴⁻", E: "+0.36 V", note: "Asosiy redoks juftlik", color: "red" },
                  { reaction: "[Fe(CN)₆]³⁻ + Fe²⁺ → [Fe(CN)₆]⁴⁻ + Fe³⁺", E: "+0.36 − 0.77 = −0.41 V", note: "Fe²⁺ oksidlanadi", color: "orange" },
                  { reaction: "2[Fe(CN)₆]³⁻ + 2I⁻ → 2[Fe(CN)₆]⁴⁻ + I₂", E: "+0.36 − 0.54 = −0.18 V", note: "I⁻ oksidlanadi (sekin)", color: "yellow" },
                  { reaction: "[Fe(CN)₆]³⁻ + V²⁺ → [Fe(CN)₆]⁴⁻ + V³⁺", E: "+0.36 + 0.26 = +0.62 V", note: "V²⁺ kuchli qaytaruvchi", color: "emerald" },
                ].map((item, i) => (
                  <div key={i} className={`bg-${item.color}-950/50 rounded-xl p-4 border border-${item.color}-700/30`}>
                    <div className="bg-${item.color}-900/60 rounded-lg p-3 font-mono text-xs text-${item.color}-200 border border-${item.color}-700/30 mb-2">
                      {item.reaction}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white text-sm font-bold">E° = {item.E}</span>
                      <span className="text-purple-300 text-xs">{item.note}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl p-5">
                <h3 className="text-red-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Nega E° = +0.36 V muhim?
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Mild oksidlovchi:</strong> kuchli emas, lekin yetarli</p>
                  <p>• <strong className="text-white">Selektiv:</strong> faqat ma'lum moddalarni oksidlaydi</p>
                  <p>• <strong className="text-white">Qaytar:</strong> [Fe(CN)₆]⁴⁻ ga aylanadi (sariq rang)</p>
                  <p>• <strong className="text-white">Analitik:</strong> titrlashda indikator sifatida ishlatiladi</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* TURNBULL TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "turnbull" && (
          <>
            <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border-2 border-blue-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">
                  🎨
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Turnbull's Blue — Fe²⁺ ni aniqlash</h2>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-blue-400">Turnbull's Blue</strong> — bu 
                  <strong className="text-white"> Fe²⁺ ni sifat aniqlash</strong> uchun ishlatiladigan reaksiya.
                  K₃[Fe(CN)₆] va Fe²⁺ reaktsiyasidan <strong className="text-blue-300">ko'k cho'kma</strong> hosil bo'ladi.
                  Qizig'i shundaki, bu cho'kma <strong className="text-yellow-300">Prussian Blue bilan bir xil</strong> moddadir!
                </p>
              </div>

              {/* REAKTSIYALAR */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-950/50 rounded-xl p-5 border-2 border-blue-500/30">
                  <h3 className="text-blue-400 font-bold mb-3">🔵 Turnbull's Blue (Fe²⁺ + K₃)</h3>
                  <div className="bg-blue-900/60 rounded-lg p-3 font-mono text-xs text-blue-200 border border-blue-700/30 mb-3">
                    3Fe²⁺ + 2[Fe(CN)₆]³⁻ → <strong className="text-blue-300">Fe₃[Fe(CN)₆]₂↓</strong>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Reagent:</strong> K₃[Fe(CN)₆] (qizil)</p>
                    <p>• <strong className="text-white">Analyt:</strong> Fe²⁺</p>
                    <p>• <strong className="text-white">Mahsulot:</strong> ko'k cho'kma</p>
                  </div>
                </div>

                <div className="bg-indigo-950/50 rounded-xl p-5 border border-indigo-700/30">
                  <h3 className="text-indigo-400 font-bold mb-3">🎨 Prussian Blue (Fe³⁺ + K₄)</h3>
                  <div className="bg-indigo-900/60 rounded-lg p-3 font-mono text-xs text-indigo-200 border border-indigo-700/30 mb-3">
                    4Fe³⁺ + 3[Fe(CN)₆]⁴⁻ → <strong className="text-indigo-300">Fe₄[Fe(CN)₆]₃↓</strong>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Reagent:</strong> K₄[Fe(CN)₆] (sariq)</p>
                    <p>• <strong className="text-white">Analyt:</strong> Fe³⁺</p>
                    <p>• <strong className="text-white">Mahsulot:</strong> ko'k cho'kma</p>
                  </div>
                </div>
              </div>

              {/* SIRR */}
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 rounded-2xl p-5">
                <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                  <span>🤔</span> Sirlar: Ikkalasi ham bir xil modda!
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-red-300">Turnbull's Blue</strong> va <strong className="text-yellow-300">Prussian Blue</strong> — 
                  aslida <strong className="text-white">bir xil modda</strong>: Fe₄[Fe(CN)₆]₃</p>
                  <p>• <strong className="text-white">Sabab:</strong> reaktsiya paytida Fe²⁺ va Fe³⁺ tez almashinadi</p>
                  <p>• <strong className="text-white">Natija:</strong> aralash valentli kompleks (Fe²⁺ va Fe³⁺ birga)</p>
                  <p>• <strong className="text-white">Struktura:</strong> kubik panjara, ko'prikli CN⁻</p>
                  <p className="text-xs text-purple-400 mt-2">
                    <strong className="text-pink-300">Tarixiy qiziq:</strong> 200 yil davomida kimyogarlar 
                    ularni alohida moddalar deb o'ylashgan. Faqat <strong className="text-white">1970-yillarda</strong> 
                    rentgen difraksiyasi orqali bir xilligi isbotlandi!
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
                  <h3 className="text-yellow-400 font-bold mb-3">🧪 Analitik kimyo</h3>
                  <div className="space-y-3 text-sm text-purple-200">
                    <div className="bg-yellow-900/40 rounded-lg p-3 border border-yellow-700/30">
                      <p className="text-yellow-300 font-bold text-xs mb-1">Fe²⁺ aniqlash</p>
                      <p className="text-xs">+ K₃[Fe(CN)₆] → Turnbull's Blue (ko'k cho'kma)</p>
                    </div>
                    <div className="bg-yellow-900/40 rounded-lg p-3 border border-yellow-700/30">
                      <p className="text-yellow-300 font-bold text-xs mb-1">Redoks titrlash</p>
                      <p className="text-xs">Mild oksidlovchi sifatida indikator</p>
                    </div>
                    <div className="bg-yellow-900/40 rounded-lg p-3 border border-yellow-700/30">
                      <p className="text-yellow-300 font-bold text-xs mb-1">Cu²⁺, Zn²⁺ aniqlash</p>
                      <p className="text-xs">Cho'kma hosil qilish reaktsiyalari</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-950/50 rounded-xl p-5 border border-orange-700/30">
                  <h3 className="text-orange-400 font-bold mb-3">🏭 Sanoat</h3>
                  <div className="space-y-3 text-sm text-purple-200">
                    <div className="bg-orange-900/40 rounded-lg p-3 border border-orange-700/30">
                      <p className="text-orange-300 font-bold text-xs mb-1">Fotografiya</p>
                      <p className="text-xs">Cyanotype jarayoni (ko'k nusxalar)</p>
                    </div>
                    <div className="bg-orange-900/40 rounded-lg p-3 border border-orange-700/30">
                      <p className="text-orange-300 font-bold text-xs mb-1">Elektrokimyo</p>
                      <p className="text-xs">Standart redoks juftlik (E° = +0.36 V)</p>
                    </div>
                    <div className="bg-orange-900/40 rounded-lg p-3 border border-orange-700/30">
                      <p className="text-orange-300 font-bold text-xs mb-1">Pigmentlar</p>
                      <p className="text-xs">Prussian Blue sintezi uchun prekursör</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-yellow-900/40 rounded-lg p-3 border border-yellow-700/30">
                  <p className="text-yellow-300 font-bold text-xs mb-1">🔬 Biokimyo</p>
                  <p className="text-xs text-purple-200">Fermentlar faolligini o'rganish</p>
                </div>
                <div className="bg-yellow-900/40 rounded-lg p-3 border border-yellow-700/30">
                  <p className="text-yellow-300 font-bold text-xs mb-1">💊 Tibbiyot</p>
                  <p className="text-xs text-purple-200">Gistologik bo'yash</p>
                </div>
                <div className="bg-yellow-900/40 rounded-lg p-3 border border-yellow-700/30">
                  <p className="text-yellow-300 font-bold text-xs mb-1">⚗️ Organik sintez</p>
                  <p className="text-xs text-purple-200">Mild oksidlovchi sifatida</p>
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
                  <h3 className="text-green-400 font-bold mb-3">1-usul: K₄[Fe(CN)₆] ni oksidlash (asosiy)</h3>
                  <div className="bg-green-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-green-300 border border-green-700/30">
                    2K₄[Fe(CN)₆] + Cl₂ → 2K₃[Fe(CN)₆] + 2KCl
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Mexanizm:</strong> Fe²⁺ → Fe³⁺ oksidlanish (Cl₂ bilan)</p>
                    <p><strong className="text-white">Sharoit:</strong> Xona harorati, suvli eritma</p>
                    <p><strong className="text-white">Hosildorlik:</strong> 85-95%</p>
                    <p><strong className="text-white">Afzalligi:</strong> K₄[Fe(CN)₆] arzon va oson topiladi</p>
                  </div>
                </div>

                <div className="bg-green-950/50 rounded-2xl p-5 border border-green-700/30">
                  <h3 className="text-green-400 font-bold mb-3">2-usul: H₂O₂ bilan oksidlash</h3>
                  <div className="bg-green-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-green-300 border border-green-700/30">
                    2K₄[Fe(CN)₆] + H₂O₂ + 2HCl → 2K₃[Fe(CN)₆] + 2H₂O + 2KCl
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Afzalligi:</strong> H₂O₂ toza oksidlovchi (qo'shimcha mahsulot H₂O)</p>
                    <p><strong className="text-white">Hosildorlik:</strong> 90-98%</p>
                  </div>
                </div>

                <div className="bg-green-950/50 rounded-2xl p-5 border border-green-700/30">
                  <h3 className="text-green-400 font-bold mb-3">3-usul: Elektrokimyoviy oksidlash</h3>
                  <div className="bg-green-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-green-300 border border-green-700/30">
                    [Fe(CN)₆]⁴⁻ → [Fe(CN)₆]³⁻ + e⁻ (anodda)
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Afzalligi:</strong> Kimyoviy reagentlar kerak emas</p>
                    <p><strong className="text-white">Tozalik:</strong> Juda yuqori (99.9%+)</p>
                    <p><strong className="text-white">Kamchilik:</strong> Maxsus uskunalar kerak</p>
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Leopold Gmelin kashfiyoti (1822)</h2>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-2xl p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-yellow-600 to-amber-600 flex items-center justify-center text-6xl flex-shrink-0 shadow-2xl">
                    👨‍🔬
                  </div>
                  <div className="flex-1">
                    <h3 className="text-yellow-400 font-bold text-xl mb-2">Leopold Gmelin (1788-1853)</h3>
                    <p className="text-purple-200 text-sm mb-3 leading-relaxed">
                      <strong className="text-yellow-300">1822 yilda</strong> nemis kimyogari Leopold Gmelin 
                      <strong className="text-white"> K₄[Fe(CN)₆]</strong> ni xlor bilan oksidlab, 
                      <strong className="text-red-300"> K₃[Fe(CN)₆]</strong> ni sintez qildi.
                      U yangi birikmaning <strong className="text-white">qizil rangi</strong> va 
                      <strong className="text-yellow-300"> oksidlovchi xususiyatlari</strong>ni tavsifladi.
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-xs text-yellow-300 font-semibold">
                        📜 1822 yil
                      </span>
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-xs text-amber-300 font-semibold">
                        📍 Heidelberg
                      </span>
                      <span className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-xs text-red-300 font-semibold">
                        ⚡ Birinchi sintez
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { year: "1752", title: "K₄[Fe(CN)₆] kashfiyoti", desc: "Macquer sariq qon tuzini ajratib oldi (Fe²⁺ versiyasi)" },
                  { year: "1822", title: "K₃[Fe(CN)₆] sintezi", desc: "Gmelin K₄ ni Cl₂ bilan oksidlab, qizil birikmani oldi" },
                  { year: "1840", title: "Turnbull's Blue", desc: "Thomas Turnbull Fe²⁺ + K₃ reaktsiyasini tavsifladi" },
                  { year: "1970+", title: "Strukturani aniqlash", desc: "Rentgen difraksiyasi: Turnbull's Blue = Prussian Blue" },
                  { year: "Bugun", title: "Keng qo'llanilish", desc: "Analitik kimyo, elektrokimyo, fotografiya" },
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
              href="/ilmiy/birikmares/k4-fe-cn-6"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold transition-all shadow-lg shadow-yellow-500/30 flex items-center gap-2"
            >
              <span>💛</span>
              <span className="hidden sm:inline">K₄[Fe(CN)₆] (Sariq qon tuzi)</span>
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