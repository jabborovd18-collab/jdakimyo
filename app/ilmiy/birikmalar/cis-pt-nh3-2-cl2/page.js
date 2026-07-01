"use client"

import Link from "next/link"
import { useState } from "react"

export default function CisPtNH32Cl2() {
  const [activeTab, setActiveTab] = useState("overview")
  const [activeIsomer, setActiveIsomer] = useState("cis") // cis | trans

  const tabs = [
    { id: "overview", label: "📋 Umumiy", icon: "📋" },
    { id: "medical", label: "💊 Saraton dori", icon: "💊" },
    { id: "isomers", label: "🔄 Sis-trans", icon: "🔄" },
    { id: "structure", label: "🧬 Tuzilish", icon: "🧬" },
    { id: "electronic", label: "⚛️ Elektron (d⁸)", icon: "⚛️" },
    { id: "spectroscopy", label: "🔬 Spektroskopiya", icon: "🔬" },
    { id: "transEffect", label: "↔️ Trans-effekt", icon: "↔️" },
    { id: "synthesis", label: "⚗️ Sintez", icon: "⚗️" },
    { id: "history", label: "🏆 Tarix", icon: "🏆" },
  ]

  const isomerData = {
    cis: {
      name: "cis-[Pt(NH₃)₂Cl₂]",
      commonName: "Sisplatin",
      color: "Sariq",
      pointGroup: "C₂ᵥ",
      dipoleMoment: "μ > 0 (qutbli)",
      activity: "Saraton dori (FAOL)",
      dnaBinding: "1,2-intrastrand crosslink",
      fdaApproval: "1978 yil"
    },
    trans: {
      name: "trans-[Pt(NH₃)₂Cl₂]",
      commonName: "Transplatin",
      color: "Sariq",
      pointGroup: "D₂ₕ",
      dipoleMoment: "μ = 0 (qutbsiz)",
      activity: "Faol EMAS",
      dnaBinding: "Interstrand (samarali emas)",
      fdaApproval: "Tasdiqlanmagan"
    }
  }

  const current = isomerData[activeIsomer]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white relative overflow-hidden">
      
      {/* ═══ ANIMATED BACKGROUND ═══ */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(234,179,8,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        {['Pt²⁺', 'd⁸', 'dsp²', 'C₂ᵥ', 'sisplatin', 'saraton', 'DNA', 'FDA 1978'].map((sym, i) => (
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
            <span className="text-yellow-400 font-semibold">cis-[Pt(NH₃)₂Cl₂]</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-[10px] text-yellow-300 font-bold uppercase tracking-wider">
                  💊 Saraton dori
                </span>
                <span className="px-2.5 py-1 rounded-full bg-pink-500/20 border border-pink-500/30 text-[10px] text-pink-300 font-semibold">
                  🔄 Kvadrat-tekis
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] text-emerald-300 font-semibold">
                  ⚛️ d⁸ konfiguratsiya
                </span>
                <span className="px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-[10px] text-red-300 font-semibold">
                  🏆 FDA 1978
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-300 bg-clip-text text-transparent">
                cis-[Pt(NH₃)₂Cl₂]
              </h1>
              <p className="text-purple-300 text-sm mt-1">
                Sisplatin • cis-Diammindixloroplatina(II) • Cisplatin
              </p>
            </div>
            
            <div className="flex gap-2">
              <Link 
                href="/ilmiy/birikmalar/trans-pt-nh3-2-cl2"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 hover:border-emerald-400/60 text-emerald-300 text-sm font-semibold transition-all flex items-center gap-2"
              >
                <span>💚</span>
                <span className="hidden sm:inline">Trans-izomerga o'tish</span>
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
            { label: "Formula", value: "cis-[Pt(NH₃)₂Cl₂]", icon: "🧪", color: "text-yellow-400" },
            { label: "M massa", value: "300.05 g/mol", icon: "⚖️", color: "text-blue-400" },
            { label: "Geometriya", value: "Kvadrat-tekis", icon: "💎", color: "text-purple-400" },
            { label: "Kompleks rangi", value: "Sariq", icon: "🎨", color: "text-yellow-400" },
            { label: "Gibridlanish", value: "dsp²", icon: "⚛️", color: "text-pink-400" },
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
        <div className="bg-gradient-to-r from-yellow-900/30 via-orange-900/30 to-pink-900/30 border border-yellow-500/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🔄</span>
            <span className="text-sm font-bold text-white">Geometrik izomerni tanlang:</span>
            <span className="text-xs text-yellow-300 ml-auto">(sis-trans)</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setActiveIsomer("cis")}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                activeIsomer === "cis"
                  ? 'bg-gradient-to-br from-yellow-600/40 to-orange-600/40 border-yellow-400/60 shadow-lg shadow-yellow-500/20'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              {activeIsomer === "cis" && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xs font-bold">✓</div>
              )}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-2xl shadow-lg">
                  💛
                </div>
                <div className="text-left">
                  <div className="font-bold text-white">cis-izomer</div>
                  <div className="text-xs text-yellow-300">Sisplatin (FAOL)</div>
                  <div className="text-[10px] text-yellow-400 font-mono">C₂ᵥ • FDA 1978</div>
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
                  <div className="text-xs text-emerald-300">Transplatin (faol emas)</div>
                  <div className="text-[10px] text-emerald-400 font-mono">D₂ₕ • Tasdiqlanmagan</div>
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Asosiy ma'lumotlar — {current.commonName}</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  ["CAS raqami", "15663-27-1"],
                  ["Zichlik", "3.84 g/cm³"],
                  ["Sistema", "Rombik"],
                  ["Fazoviy guruh", "P2₁2₁2₁"],
                  ["Eruvchanlik (H₂O)", "1 mg/mL (25°C)"],
                  ["Eruvchanlik (DMSO)", "Yaxshi eriydi"],
                  ["Barqarorlik", "Yuqori (inert)"],
                  ["Rangi", current.color],
                ].map((item, i) => (
                  <div key={i} className="bg-yellow-950/50 rounded-xl p-3 border border-yellow-700/30">
                    <div className="text-[10px] uppercase tracking-wider text-yellow-400 font-semibold mb-1">{item[0]}</div>
                    <div className="text-white font-semibold text-sm">{item[1]}</div>
                  </div>
                ))}
              </div>

              {/* ICHKI SFERA */}
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-5">
                <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                  <span>💎</span> Neytral kompleks (tashqi sfera yo'q!)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-yellow-900/30 rounded-xl p-4 border border-yellow-700/30">
                    <h4 className="text-yellow-300 font-bold text-sm mb-2">🔒 Kompleks [Pt(NH₃)₂Cl₂]</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">Pt²⁺</strong> — markaziy ion (d⁸)</li>
                      <li>• <strong className="text-white">2 × NH₃</strong> — ammiak ligandlari</li>
                      <li>• <strong className="text-white">2 × Cl⁻</strong> — xlor ligandlari</li>
                      <li>• <strong className="text-yellow-300">Zaryad:</strong> +2 + 0 + 2×(−1) = <strong>0</strong></li>
                      <li>• <strong className="text-pink-300">Neytral kompleks</strong> — tashqi sfera yo'q!</li>
                      <li>• <strong className="text-white">Koordinatsion son:</strong> 4</li>
                    </ul>
                  </div>
                  <div className="bg-orange-900/30 rounded-xl p-4 border border-orange-700/30">
                    <h4 className="text-orange-300 font-bold text-sm mb-2">⚕️ Tibbiy ahamiyati</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">FDA tasdiqlagan:</strong> 1978 yil</li>
                      <li>• <strong className="text-white">Saraton turlari:</strong> urug' bezlari, tuxumdon, o'pka, bosh-bo'yin</li>
                      <li>• <strong className="text-white">Mexanizm:</strong> DNA cross-linking</li>
                      <li>• <strong className="text-white">Dozalash:</strong> IV inyektsiya</li>
                      <li>• <strong className="text-white">Savdo nomlari:</strong> Platinol, Cisplatin</li>
                      <li>• <strong className="text-white">Analoglar:</strong> Karboplatin, Oksaliplatin</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* XULOSA */}
            <div className="bg-gradient-to-r from-yellow-600/10 via-orange-600/10 to-pink-600/10 border border-yellow-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>✅</span> Asosiy xulosalar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "💎 <strong>Kvadrat-tekis:</strong> Pt²⁺ (d⁸) uchun xarakterli geometriya",
                  "⚛️ <strong>dsp² gibridlanish:</strong> 4 ta orbital (1 d + 1 s + 2 p)",
                  "💊 <strong>Saraton dori:</strong> DNA bilan cross-link hosil qiladi",
                  "🔄 <strong>Sis-trans izomeriya:</strong> faqat cis-izomer faol",
                  "↔️ <strong>Trans-effekt:</strong> Cl⁻ &gt; NH₃ (sintezda muhim)",
                  "🏆 <strong>Rosenberg 1965:</strong> tasodifiy kashfiyot → Nobel 1978",
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
        {/* MEDICAL TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "medical" && (
          <>
            <div className="bg-gradient-to-br from-pink-900/40 to-red-900/40 border border-pink-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center text-xl shadow-lg shadow-pink-500/30">
                  💊
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Saraton kasalligiga qarshi kurash</h2>
              </div>
              
              <div className="bg-gradient-to-r from-pink-500/10 to-red-500/10 border border-pink-500/20 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-pink-400">Sisplatin</strong> — bu <strong className="text-white">kimyoterapiyaning asosiy dorilaridan biri</strong>.
                  U <strong className="text-yellow-300">1978 yilda FDA</strong> tomonidan tasdiqlangan va bugungi kunda 
                  <strong className="text-white"> 50+ turdagi saraton</strong> kasalligini davolashda ishlatiladi.
                  Ayniqsa <strong className="text-white">urug' bezlari saratoni</strong>da 90%+ samaradorlik ko'rsatadi.
                </p>
              </div>

              {/* MEXANIZM */}
              <div className="bg-pink-950/50 rounded-2xl p-5 border border-pink-700/30 mb-6">
                <h3 className="text-pink-400 font-bold mb-3">⚗️ Ta'sir mexanizmi</h3>
                <div className="bg-pink-900/60 rounded-xl p-4 font-mono text-sm text-pink-200 border border-pink-700/30 mb-4 text-center">
                  <p>cis-[Pt(NH₃)₂Cl₂] → cis-[Pt(NH₃)₂(H₂O)₂]²⁺ + 2Cl⁻ (aquation)</p>
                  <p className="text-pink-300 text-xs mt-2">Hujayra ichida (past Cl⁻ konsentratsiyasi)</p>
                </div>
                <div className="space-y-3 text-sm text-purple-200">
                  <div className="bg-pink-900/40 rounded-lg p-3 border border-pink-700/30">
                    <p className="text-pink-300 font-bold text-xs mb-1">1-bosqich: Aquation</p>
                    <p className="text-xs">Hujayra ichida Cl⁻ konsentratsiyasi past → Cl⁻ H₂O bilan almashinadi</p>
                  </div>
                  <div className="bg-pink-900/40 rounded-lg p-3 border border-pink-700/30">
                    <p className="text-pink-300 font-bold text-xs mb-1">2-bosqich: DNA bilan bog'lanish</p>
                    <p className="text-xs">Pt²⁺ DNA ning <strong className="text-white">guanin (G) asoslari</strong> bilan bog'lanadi</p>
                  </div>
                  <div className="bg-pink-900/40 rounded-lg p-3 border border-pink-700/30">
                    <p className="text-pink-300 font-bold text-xs mb-1">3-bosqich: 1,2-intrastrand crosslink</p>
                    <p className="text-xs">Ikki qo'shni guanin birikadi → DNA egiladi → replikatsiya to'xtaydi</p>
                  </div>
                  <div className="bg-red-900/40 rounded-lg p-3 border border-red-700/30">
                    <p className="text-red-300 font-bold text-xs mb-1">4-bosqich: Apoptoz</p>
                    <p className="text-xs">Saraton hujayralari o'ladi</p>
                  </div>
                </div>
              </div>

              {/* NEGA FAQAT CIS? */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-yellow-950/50 rounded-xl p-5 border-2 border-yellow-500/30">
                  <h3 className="text-yellow-400 font-bold mb-3">✅ Nega cis-izomer faol?</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">2 ta Cl⁻ yonma-yon</strong> (90°)</p>
                    <p>• Aquationdan keyin <strong className="text-white">2 ta H₂O yonma-yon</strong></p>
                    <p>• Ikkala Pt−O bog' <strong className="text-yellow-300">qo'shni guaninlar</strong> bilan bog'lanishi mumkin</p>
                    <p>• <strong className="text-white">1,2-intrastrand crosslink</strong> hosil bo'ladi</p>
                    <p>• DNA <strong className="text-pink-300">30° ga egiladi</strong> → replikatsiya to'xtaydi</p>
                  </div>
                </div>

                <div className="bg-emerald-950/50 rounded-xl p-5 border border-emerald-700/30">
                  <h3 className="text-emerald-400 font-bold mb-3">❌ Nega trans-izomer faol emas?</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">2 ta Cl⁻ qarama-qarshi</strong> (180°)</p>
                    <p>• Aquationdan keyin <strong className="text-white">2 ta H₂O qarama-qarshi</strong></p>
                    <p>• Ikkala Pt−O bog' <strong className="text-red-300">qo'shni guaninlar</strong> bilan bog'lana olmaydi</p>
                    <p>• Faqat <strong className="text-white">interstrand crosslink</strong> (samarali emas)</p>
                    <p>• DNA <strong className="text-emerald-300">egilmaydi</strong> → replikatsiya davom etadi</p>
                  </div>
                </div>
              </div>
            </div>

            {/* QO'LLANILISH */}
            <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">
                  ⚕️
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Klinik qo'llanilishi</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { type: "Urug' bezlari saratoni", success: "90%+", note: "Eng samarali" },
                  { type: "Tuxumdon saratoni", success: "70-80%", note: "Birinchi qator" },
                  { type: "O'pka saratoni", success: "50-60%", note: "Kombinatsiyada" },
                  { type: "Bosh-bo'yin saratoni", success: "60-70%", note: "Radioterapiya bilan" },
                  { type: "Quviq saratoni", success: "50-60%", note: "Karboplatin bilan" },
                  { type: "Limfoma", success: "70-80%", note: "BEACON sxemasi" },
                ].map((item, i) => (
                  <div key={i} className="bg-blue-950/50 rounded-xl p-4 border border-blue-700/30">
                    <div className="text-blue-300 font-bold text-xs mb-1">{item.type}</div>
                    <div className="text-white font-bold text-lg">{item.success}</div>
                    <div className="text-purple-300 text-xs mt-1">{item.note}</div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-2xl p-5 mt-6">
                <h3 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                  <span>⚠️</span> Nojo'ya ta'sirlari
                </h3>
                <div className="space-y-1 text-sm text-purple-200">
                  <p>• <strong className="text-white">Nefrotoksiklik:</strong> buyrak zararlanishi (eng jiddiy)</p>
                  <p>• <strong className="text-white">Neyrotoksiklik:</strong> periferik neyropatiya</p>
                  <p>• <strong className="text-white">Ototoxiklik:</strong> eshitish qobiliyati yo'qolishi</p>
                  <p>• <strong className="text-white">Ko'ngil aynishi:</strong> kuchli emetogen</p>
                  <p className="text-xs text-purple-400 mt-2">
                    Bu nojo'ya ta'sirlar <strong className="text-yellow-300">ikkinchi avlod dorilar</strong> 
                    (karboplatin, oksaliplatin) da kamroq.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* ISOMERS TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "isomers" && (
          <>
            <div className="bg-gradient-to-br from-yellow-900/40 to-emerald-900/40 border border-yellow-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-emerald-500 flex items-center justify-center text-xl shadow-lg shadow-yellow-500/30">
                  🔄
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Sis va Trans izomerlari</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* CIS */}
                <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 rounded-2xl p-6 border-2 border-yellow-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-2xl shadow-lg">
                      💛
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-yellow-300">cis-izomer</h3>
                      <p className="text-yellow-400 text-xs">Sisplatin (FAOL)</p>
                    </div>
                  </div>

                  <div className="bg-yellow-950/60 rounded-xl p-4 mb-4 font-mono text-xs text-yellow-200 border border-yellow-700/30">
                    <pre className="whitespace-pre">{`        NH₃
         |
   Cl — Pt — NH₃
         |
        Cl

  2 ta Cl⁻ yonma-yon (90°)
  C₂ᵥ simmetriya`}</pre>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-300">Simmetriya:</span>
                      <span className="text-white font-mono font-bold">C₂ᵥ</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Dipol moment:</span>
                      <span className="text-white font-bold">μ &gt; 0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Faollik:</span>
                      <span className="text-green-400 font-bold">✓ Saraton dori</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">DNA bog'lanish:</span>
                      <span className="text-yellow-300 font-bold">1,2-intrastrand</span>
                    </div>
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
                      <p className="text-emerald-400 text-xs">Transplatin (faol emas)</p>
                    </div>
                  </div>

                  <div className="bg-emerald-950/60 rounded-xl p-4 mb-4 font-mono text-xs text-emerald-200 border border-emerald-700/30">
                    <pre className="whitespace-pre">{`        NH₃
         |
   Cl — Pt — Cl
         |
        NH₃

  2 ta Cl⁻ qarama-qarshi (180°)
  D₂ₕ simmetriya`}</pre>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-300">Simmetriya:</span>
                      <span className="text-white font-mono font-bold">D₂ₕ</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Dipol moment:</span>
                      <span className="text-white font-bold">μ = 0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Faollik:</span>
                      <span className="text-red-400 font-bold">✗ Faol emas</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">DNA bog'lanish:</span>
                      <span className="text-emerald-300 font-bold">Interstrand (samarasiz)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* FARQLAR JADVALI */}
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-purple-950/60">
                    <tr>
                      <th className="py-3 px-4 text-purple-300 text-left">Xususiyat</th>
                      <th className="py-3 px-4 text-yellow-300 text-left">💛 cis</th>
                      <th className="py-3 px-4 text-emerald-300 text-left">💚 trans</th>
                    </tr>
                  </thead>
                  <tbody className="text-purple-200">
                    <tr className="border-b border-purple-800/30">
                      <td className="py-3 px-4">Cl−Pt−Cl burchak</td>
                      <td className="py-3 px-4 font-mono">90°</td>
                      <td className="py-3 px-4 font-mono">180°</td>
                    </tr>
                    <tr className="border-b border-purple-800/30">
                      <td className="py-3 px-4">Nuqtali guruh</td>
                      <td className="py-3 px-4 font-mono">C₂ᵥ</td>
                      <td className="py-3 px-4 font-mono">D₂ₕ</td>
                    </tr>
                    <tr className="border-b border-purple-800/30">
                      <td className="py-3 px-4">Dipol moment</td>
                      <td className="py-3 px-4">μ &gt; 0 (qutbli)</td>
                      <td className="py-3 px-4">μ = 0 (qutbsiz)</td>
                    </tr>
                    <tr className="border-b border-purple-800/30">
                      <td className="py-3 px-4">Eruvchanlik (H₂O)</td>
                      <td className="py-3 px-4">1 mg/mL</td>
                      <td className="py-3 px-4">0.25 mg/mL</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Saraton faolligi</td>
                      <td className="py-3 px-4 text-green-400 font-bold">✓ Faol</td>
                      <td className="py-3 px-4 text-red-400 font-bold">✗ Faol emas</td>
                    </tr>
                  </tbody>
                </table>
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
                  💎
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Kvadrat-tekis geometriya</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-purple-400 font-bold text-sm uppercase tracking-wider">Geometrik parametrlar</h3>
                  <div className="space-y-2">
                    {[
                      ["Geometriya", "Kvadrat-tekis (square planar)"],
                      ["Nuqtali guruh", "C₂ᵥ (cis) / D₂ₕ (trans)"],
                      ["Pt−N masofa", "2.05 Å (2 ta)"],
                      ["Pt−Cl masofa", "2.32 Å (2 ta)"],
                      ["N−Pt−N burchak", "90° (cis) / 180° (trans)"],
                      ["Cl−Pt−Cl burchak", "90° (cis) / 180° (trans)"],
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
                  <h3 className="text-yellow-400 font-bold text-sm uppercase tracking-wider">C₂ᵥ simmetriya elementlari (cis)</h3>
                  <div className="space-y-2">
                    {[
                      ["E", "Ayniylik"],
                      ["C₂", "Pt orqali o'tuvchi o'q (Cl-Pt-Cl bisector)"],
                      ["σᵥ(xz)", "Molekula tekisligi"],
                      ["σᵥ(yz)", "Cl-Pt-Cl bisector orqali"],
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-1.5 border-b border-yellow-800/30">
                        <span className="text-yellow-300 text-sm font-mono font-bold">{item[0]}</span>
                        <span className="text-purple-200 text-xs">{item[1]}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-yellow-950/50 rounded-xl p-3 border border-yellow-700/30 mt-3">
                    <p className="text-yellow-200 text-xs">
                      <strong className="text-yellow-400">Jami:</strong> 4 ta simmetriya operatsiyasi.
                      <strong className="text-pink-300"> σₕ va i yo'q</strong> — lekin σᵥ bor, shuning uchun axiral (optik faol emas).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* NEGA KVADRAT-TEKIS? */}
            <div className="bg-gradient-to-br from-pink-900/40 to-red-900/40 border border-pink-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center text-xl shadow-lg shadow-pink-500/30">
                  🎯
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Nega kvadrat-tekis? (oktaedrik emas)</h2>
              </div>
              
              <div className="bg-gradient-to-r from-pink-500/10 to-red-500/10 border border-pink-500/20 rounded-2xl p-5">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-pink-400">Pt²⁺</strong> — bu <strong className="text-white">5d⁸</strong> ion. 
                  5d o'tish metallari (Pt²⁺, Pd²⁺, Au³⁺, Ir⁺) deyarli har doim 
                  <strong className="text-yellow-300"> kvadrat-tekis</strong> geometriyani afzal ko'radi.
                  Sababi: <strong className="text-white">katta kristall maydon ajralishi</strong> (Δsp katta) → 
                  <strong className="text-green-400"> past spinli</strong> konfiguratsiya → 8 ta elektron to'liq juftlashgan.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-pink-950/50 rounded-xl p-5 border border-pink-700/30">
                  <h3 className="text-pink-400 font-bold mb-3">Kvadrat-tekis afzalliklari</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">KMBE:</strong> −2.4Δsp (juda katta)</p>
                    <p>• <strong className="text-white">Barqarorlik:</strong> yuqori</p>
                    <p>• <strong className="text-white">Magnit:</strong> diamagnit</p>
                    <p>• <strong className="text-white">Inertlik:</strong> ligand almashinishi sekin</p>
                  </div>
                </div>
                <div className="bg-red-950/50 rounded-xl p-5 border border-red-700/30">
                  <h3 className="text-red-400 font-bold mb-3">5d vs 3d metallari</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">5d (Pt²⁺):</strong> Δsp katta → kvadrat-tekis</p>
                    <p>• <strong className="text-white">4d (Pd²⁺):</strong> Δsp katta → kvadrat-tekis</p>
                    <p>• <strong className="text-white">3d (Ni²⁺):</strong> Δsp kichik → tetraedrik yoki kvadrat-tekis</p>
                    <p>• <strong className="text-yellow-300">Qoida:</strong> 5d metallari deyarli har doim kvadrat-tekis</p>
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Elektron tuzilishi (d⁸)</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-yellow-950/50 rounded-2xl p-5 border border-yellow-700/30 text-center">
                  <div className="text-4xl mb-2">🔵</div>
                  <div className="text-yellow-400 text-xs uppercase mb-1">Erkin Pt atomi</div>
                  <div className="text-white font-mono font-bold">[Xe] 4f¹⁴ 5d⁹ 6s¹</div>
                  <div className="text-purple-300 text-xs mt-1">Z = 78</div>
                </div>
                <div className="bg-orange-950/50 rounded-2xl p-5 border border-orange-700/30 text-center">
                  <div className="text-4xl mb-2">🟡</div>
                  <div className="text-orange-400 text-xs uppercase mb-1">Pt²⁺ ioni</div>
                  <div className="text-white font-mono font-bold">[Xe] 4f¹⁴ 5d⁸</div>
                  <div className="text-purple-300 text-xs mt-1">8 ta d-elektron</div>
                </div>
                <div className="bg-pink-950/50 rounded-2xl p-5 border border-pink-700/30 text-center">
                  <div className="text-4xl mb-2">🟣</div>
                  <div className="text-pink-400 text-xs uppercase mb-1">Kompleksda</div>
                  <div className="text-white font-mono font-bold">dsp² (kvadrat-tekis)</div>
                  <div className="text-green-400 text-xs mt-1">Past spinli</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-5">
                <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                  <span>💡</span> dsp² gibridlanish
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">1 ta 5d orbital</strong> (d<sub>x²-y²</sub>)</p>
                  <p>• <strong className="text-white">1 ta 6s orbital</strong></p>
                  <p>• <strong className="text-white">2 ta 6p orbital</strong> (p<sub>x</sub> va p<sub>y</sub>)</p>
                  <p>• <strong className="text-yellow-300">Jami:</strong> 4 ta gibrid orbital → 4 ta σ-bog' (kvadrat-tekis)</p>
                  <p className="text-xs text-purple-400 mt-2">
                    Qolgan 8 ta d-elektron <strong className="text-white">to'liq juftlashgan</strong> 
                    (4 ta to'liq orbital) → <strong className="text-green-400">diamagnit</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* d-ORBITAL DIAGRAMMA */}
            <div className="bg-gradient-to-br from-purple-900/40 to-violet-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  📊
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Kvadrat-tekis d-orbital ajralishi</h2>
              </div>
              
              <div className="bg-violet-950/50 rounded-2xl p-5 border border-violet-700/30 mb-6">
                <div className="bg-violet-900/60 rounded-xl p-4 font-mono text-sm text-violet-200 border border-violet-700/30 mb-4">
                  <p>Kvadrat-tekis (D₄ₕ) da d-orbitallar 4 ta sathga ajraladi:</p>
                  <p className="text-white font-bold text-lg mt-2">d<sub>x²-y²</sub> &gt; d<sub>xy</sub> &gt; d<sub>z²</sub> &gt; d<sub>xz</sub>, d<sub>yz</sub></p>
                </div>
                <div className="space-y-3 text-sm text-purple-200">
                  <p>• <strong className="text-white">d<sub>x²-y²</sub>:</strong> eng yuqori energiya (ligandlar x,y o'qlarida)</p>
                  <p>• <strong className="text-white">d<sub>xy</sub>:</strong> ikkinchi (ekvatorial tekislikda)</p>
                  <p>• <strong className="text-white">d<sub>z²</sub>:</strong> uchinchi (z o'qi bo'ylab)</p>
                  <p>• <strong className="text-white">d<sub>xz</sub>, d<sub>yz</sub>:</strong> eng past (degenerat)</p>
                  <p className="text-xs text-purple-400 mt-2">
                    <strong className="text-yellow-300">8 ta elektron</strong> quyi 4 ta orbitalni to'ldiradi → 
                    <strong className="text-green-400"> diamagnit</strong>.
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
                  🌈
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">UV-Vis spektroskopiya</h2>
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
                      <div className="text-white font-mono font-bold text-lg">~300 nm</div>
                    </div>
                    <div className="text-center">
                      <div className="text-green-400 text-xs">Rang</div>
                      <div className="text-yellow-300 font-bold text-lg">{current.color}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { transition: "LMCT (Cl⁻ → Pt²⁺)", wavelength: "300 nm", epsilon: "ε ≈ 150 L·mol⁻¹·cm⁻¹", color: "UB-soha" },
                  { transition: "d-d (¹A₁g → ¹E₉)", wavelength: "400 nm", epsilon: "ε ≈ 50 L·mol⁻¹·cm⁻¹", color: "Binafsha" },
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
                          <div className="text-green-400 text-xs">Intensivlik</div>
                          <div className="text-white font-mono text-xs">{item.epsilon}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
                  { freq: "3280-3200 cm⁻¹", bond: "ν(N−H)", desc: "NH₃ valent tebranish", intensity: "Kuchli" },
                  { freq: "1620-1580 cm⁻¹", bond: "δ(NH₃)", desc: "NH₃ egilish", intensity: "O'rta" },
                  { freq: "520-480 cm⁻¹", bond: "ν(Pt−N)", desc: "Pt-N bog'", intensity: "O'rta" },
                  { freq: "340-320 cm⁻¹", bond: "ν(Pt−Cl)", desc: "Pt-Cl bog'", intensity: "Kuchli" },
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
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* TRANS EFFECT TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "transEffect" && (
          <>
            <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 border border-orange-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-xl shadow-lg shadow-orange-500/30">
                  ↔️
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Trans-effekt — sintez uchun muhim</h2>
              </div>
              
              <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-orange-400">Trans-effekt</strong> — bu bir ligandning qarama-qarshisidagi 
                  (trans pozitsiyadagi) ligandning <strong className="text-white">almashinish tezligini oshirish</strong> qobiliyati.
                  Bu hodisa <strong className="text-yellow-300">kvadrat-tekis komplekslarda</strong> ayniqsa kuchli va 
                  sisplatin sintezida hal qiluvchi rol o'ynaydi.
                </p>
              </div>

              {/* QATOR */}
              <div className="bg-orange-950/50 rounded-xl p-5 border border-orange-700/30 mb-6">
                <h3 className="text-orange-400 font-bold mb-3">Trans-effekt qatori (kuchayish tartibida)</h3>
                <div className="bg-orange-900/60 rounded-lg p-4 font-mono text-xs text-orange-200 border border-orange-700/30 mb-4">
                  H₂O &lt; OH⁻ &lt; NH₃ &lt; <strong className="text-white">Cl⁻</strong> &lt; Br⁻ &lt; I⁻ &lt; 
                  SCN⁻ &lt; NO₂⁻ &lt; PR₃ &lt; <strong className="text-yellow-300">CN⁻ ≈ CO ≈ C₂H₄</strong>
                </div>
                <p className="text-purple-200 text-xs">
                  <strong className="text-yellow-300">Kuchli trans-effektli ligandlar</strong> (CN⁻, CO, C₂H₄) 
                  qarama-qarshisidagi ligandni <strong className="text-white">labil</strong> qiladi (tez almashinadi).
                </p>
              </div>

              {/* SISPLATIN SINTEZI */}
              <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-5">
                <h3 className="text-orange-400 font-bold mb-3 flex items-center gap-2">
                  <span>⚗️</span> Nega aynan cis-izomer hosil bo'ladi?
                </h3>
                <div className="space-y-3 text-sm text-purple-200">
                  <div className="bg-orange-900/40 rounded-lg p-3 border border-orange-700/30">
                    <p className="text-orange-300 font-bold text-xs mb-1">Boshlang'ich: [PtCl₄]²⁻</p>
                    <p className="text-xs">4 ta Cl⁻ kvadrat-tekis</p>
                  </div>
                  <div className="bg-orange-900/40 rounded-lg p-3 border border-orange-700/30">
                    <p className="text-orange-300 font-bold text-xs mb-1">1-bosqich: + NH₃</p>
                    <p className="text-xs">[PtCl₃(NH₃)]⁻ hosil bo'ladi — Cl⁻ ning trans-effekti kuchli</p>
                  </div>
                  <div className="bg-orange-900/40 rounded-lg p-3 border border-orange-700/30">
                    <p className="text-orange-300 font-bold text-xs mb-1">2-bosqich: + NH₃</p>
                    <p className="text-xs">Cl⁻ ning trans-effekti tufayli, <strong className="text-yellow-300">ikkinchi NH₃ Cl⁻ ning qarama-qarshisiga</strong> (cis pozitsiyaga) kiradi</p>
                  </div>
                  <div className="bg-yellow-900/40 rounded-lg p-3 border border-yellow-700/30">
                    <p className="text-yellow-300 font-bold text-xs mb-1">Natija: cis-[Pt(NH₃)₂Cl₂]</p>
                    <p className="text-xs">Trans-effekt tufayli aynan cis-izomer hosil bo'ladi!</p>
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
                  <h3 className="text-green-400 font-bold mb-3">1-usul: K₂[PtCl₄] dan (klassik)</h3>
                  <div className="bg-green-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-green-300 border border-green-700/30">
                    <p>K₂[PtCl₄] + 2NH₃ → cis-[Pt(NH₃)₂Cl₂] + 2KCl</p>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Mexanizm:</strong> Trans-effekt tufayli ikkinchi NH₃ birinchi NH₃ ning cis-pozitsiyasiga kiradi</p>
                    <p><strong className="text-white">Sharoit:</strong> 60°C, suvli eritma</p>
                    <p><strong className="text-white">Hosildorlik:</strong> 65-75%</p>
                    <p><strong className="text-white">Afzalligi:</strong> Faqat cis-izomer hosil bo'ladi (trans-effekt tufayli)</p>
                  </div>
                </div>

                <div className="bg-green-950/50 rounded-2xl p-5 border border-green-700/30">
                  <h3 className="text-green-400 font-bold mb-3">2-usul: [Pt(NH₃)₄]²⁺ dan</h3>
                  <div className="bg-green-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-green-300 border border-green-700/30">
                    <p>[Pt(NH₃)₄]²⁺ + 2Cl⁻ → cis-[Pt(NH₃)₂Cl₂] + 2NH₃</p>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Mexanizm:</strong> NH₃ ning trans-effekti kuchsiz → Cl⁻ cis-pozitsiyaga kiradi</p>
                    <p><strong className="text-white">Hosildorlik:</strong> 70-80%</p>
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
                  { step: "1", title: "Reagentlar", desc: "K₂[PtCl₄] (5 g, 12 mmol), NH₃ (kons., 2 mL), HCl (1M)" },
                  { step: "2", title: "Eritish", desc: "K₂[PtCl₄] ni 50 mL suvda eritish, 60°C ga qizdirish" },
                  { step: "3", title: "NH₃ qo'shish", desc: "NH₃ ni asta-sekin qo'shib, 30 daqiqa aralashtirish" },
                  { step: "4", title: "Rang o'zgarishi", desc: "Qizil-jigarrang → sariq (cis-[Pt(NH₃)₂Cl₂] hosil bo'ldi)" },
                  { step: "5", title: "Sovutish", desc: "Xona haroratigacha sovutish, keyin muzli suvda" },
                  { step: "6", title: "Filtratsiya", desc: "Sariq kristallarni filtrlash, sovuq suv bilan yuvish" },
                  { step: "7", title: "Quritish", desc: "60°C da quritish, hosildorlik ≈ 70%" },
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
                  <p>• <strong className="text-white">K₂[PtCl₄]</strong> — qimmat reagent, ehtiyotkorlik bilan</p>
                  <p>• <strong className="text-white">NH₃</strong> — kuchli asos, shkaflarda ishlash</p>
                  <p>• <strong className="text-red-300">Sisplatin zaharli!</strong> — qo'lqop va himoya ko'zoynak kiyish</p>
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Tasodifiy kashfiyot (1965)</h2>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-2xl p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-yellow-600 to-amber-600 flex items-center justify-center text-6xl flex-shrink-0 shadow-2xl">
                    👨‍🔬
                  </div>
                  <div className="flex-1">
                    <h3 className="text-yellow-400 font-bold text-xl mb-2">Barnett Rosenberg (1926-2008)</h3>
                    <p className="text-purple-200 text-sm mb-3 leading-relaxed">
                      <strong className="text-yellow-300">1965 yilda</strong> Michigan universitetida biofizik Barnett Rosenberg 
                      <strong className="text-white"> tasodifan</strong> sisplatinning saratonga qarshi ta'sirini kashf qildi.
                      U <strong className="text-white">E. coli bakteriyalari</strong> ustida elektr maydonining ta'sirini o'rganayotgan edi.
                      Platinum elektrodlardan ajralgan <strong className="text-pink-300">sisplatin</strong> bakteriyalar bo'linishini to'xtatdi!
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-xs text-yellow-300 font-semibold">
                        📜 1965 yil
                      </span>
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-xs text-amber-300 font-semibold">
                        📍 Michigan universiteti
                      </span>
                      <span className="px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/30 text-xs text-pink-300 font-semibold">
                        🏆 FDA 1978
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-2xl p-5">
                <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                  <span>💡</span> Tasodifdan dori
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">1965:</strong> Rosenberg E. coli ustida elektr maydonini sinaydi</p>
                  <p>• <strong className="text-white">Kutilmagan natija:</strong> bakteriyalar bo'linishi to'xtaydi</p>
                  <p>• <strong className="text-white">Sabab:</strong> Pt elektrodlardan sisplatin ajraladi</p>
                  <p>• <strong className="text-white">1969:</strong> Saraton hujayralarida sinov</p>
                  <p>• <strong className="text-white">1978:</strong> <strong className="text-yellow-300">FDA tasdiqlaydi</strong> — birinchi platina asosidagi saraton dori</p>
                  <p>• <strong className="text-white">1980+:</strong> Ikkinchi avlod dorilar (karboplatin, oksaliplatin)</p>
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
                  { year: "1844", title: "Peyrone sintezi", desc: "Michele Peyrone birinchi bo'lib cis-[Pt(NH₃)₂Cl₂] ni sintez qildi (Peyrone tuzi)" },
                  { year: "1890", title: "Werner tushuntirishi", desc: "Alfred Werner sis-trans izomeriyani koordinatsion nazariya bilan tushuntirdi" },
                  { year: "1965", title: "Rosenberg kashfiyoti", desc: "Tasodifan saratonga qarshi ta'siri aniqlandi" },
                  { year: "1969", title: "Klinik sinovlar", desc: "Birinchi klinik sinovlar boshlandi" },
                  { year: "1978", title: "FDA tasdiqlashi", desc: "Sisplatin urug' bezlari saratoni uchun tasdiqlandi" },
                  { year: "1980+", title: "Ikkinchi avlod", desc: "Karboplatin, oksaliplatin kabi kamroq toksik analoglar" },
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

            {/* TA'SIR */}
            <div className="bg-gradient-to-br from-pink-900/40 to-red-900/40 border border-pink-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center text-xl shadow-lg shadow-pink-500/30">
                  🌍
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Global ta'siri</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-pink-950/50 rounded-xl p-5 border border-pink-700/30 text-center">
                  <div className="text-4xl mb-2">💊</div>
                  <div className="text-pink-400 text-xs uppercase mb-1">Yillik ishlatish</div>
                  <div className="text-white font-bold text-2xl">~30 tonna</div>
                  <div className="text-purple-300 text-xs mt-1">Global</div>
                </div>
                <div className="bg-red-950/50 rounded-xl p-5 border border-red-700/30 text-center">
                  <div className="text-4xl mb-2">👥</div>
                  <div className="text-red-400 text-xs uppercase mb-1">Davolangan bemorlar</div>
                  <div className="text-white font-bold text-2xl">1M+</div>
                  <div className="text-purple-300 text-xs mt-1">Har yili</div>
                </div>
                <div className="bg-yellow-950/50 rounded-xl p-5 border border-yellow-700/30 text-center">
                  <div className="text-4xl mb-2">🏆</div>
                  <div className="text-yellow-400 text-xs uppercase mb-1">Eng samarali</div>
                  <div className="text-white font-bold text-2xl">90%+</div>
                  <div className="text-purple-300 text-xs mt-1">Urug' bezlari saratoni</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-pink-500/10 to-red-500/10 border border-pink-500/20 rounded-2xl p-5 mt-6">
                <h3 className="text-pink-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Kimyo tarixidagi eng muhim komplekslardan biri
                </h3>
                <p className="text-purple-200 text-sm">
                  <strong className="text-white">Sisplatin</strong> — bu <strong className="text-yellow-300">tasodifiy kashfiyot</strong> 
                  orqali millionlab hayotlarni saqlab qolgan dori. U <strong className="text-white">bioinorganik kimyo</strong> 
                  sohasining rivojlanishiga turtki berdi va <strong className="text-pink-300">platina asosidagi dorilar</strong> 
                  oilasining boshlanishi bo'ldi.
                </p>
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
              href="/ilmiy/birikmares/co-nh3-5-ono-cl2"
              onClick={(e) => { e.preventDefault(); window.history.back(); }}
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold transition-all flex items-center gap-2"
            >
              <span>←</span>
              <span className="hidden sm:inline">[Co(NH₃)₅ONO]Cl₂</span>
            </Link>
            <Link 
              href="/ilmiy/birikmares/trans-pt-nh3-2-cl2"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold transition-all shadow-lg shadow-emerald-500/30 flex items-center gap-2"
            >
              <span className="hidden sm:inline">trans-[Pt(NH₃)₂Cl₂]</span>
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