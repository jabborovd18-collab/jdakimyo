"use client"

import Link from "next/link"
import { useState } from "react"

export default function VitaminB12() {
  const [activeTab, setActiveTab] = useState("overview")
  const [b12Form, setB12Form] = useState("cyano") // cyano | methyl | adenosyl | hydroxo

  const tabs = [
    { id: "overview", label: "📋 Umumiy", icon: "📋" },
    { id: "structure", label: "🧬 Corrin halqasi", icon: "🧬" },
    { id: "electronic", label: "⚛️ Elektron (d⁶)", icon: "⚛️" },
    { id: "forms", label: "💊 B₁₂ shakllari", icon: "💊" },
    { id: "enzymology", label: "🧬 Fermentlar", icon: "🧬" },
    { id: "coBond", label: "🔗 Co−C bog'i", icon: "🔗" },
    { id: "spectroscopy", label: "🔬 Spektroskopiya", icon: "🔬" },
    { id: "medicine", label: "⚕️ Tibbiyot", icon: "⚕️" },
    { id: "biosynthesis", label: "🌿 Biosintez", icon: "🌿" },
    { id: "history", label: "🏆 Tarix", icon: "🏆" },
  ]

  const b12Data = {
    cyano: {
      name: "Sianokobalamin",
      formula: "[Co(Corr)(DMB)(CN)]",
      R: "CN⁻",
      color: "To'q qizil",
      molarMass: "1355.4 g/mol",
      stability: "Eng barqaror (dori shakli)",
      biological: "Faol emas (konvertatsiya kerak)",
      use: "Dori preparatlari, oziq-ovqat qo'shimchalari"
    },
    methyl: {
      name: "Metilkobalamin",
      formula: "[Co(Corr)(DMB)(CH₃)]",
      R: "CH₃⁻",
      color: "Qizil",
      molarMass: "1344.4 g/mol",
      stability: "O'rta (yorug'likda beqaror)",
      biological: "Faol — metiltransferaza kofaktori",
      use: "Metionin sintaza fermenti"
    },
    adenosyl: {
      name: "Adenozilkobalamin",
      formula: "[Co(Corr)(DMB)(5'-dAdo)]",
      R: "5'-deoksiadenozil",
      color: "Qizil-jigarrang",
      molarMass: "1580.6 g/mol",
      stability: "O'rta (yorug'likda beqaror)",
      biological: "Faol — mutaza kofaktori",
      use: "Metilmalonil-CoA mutaza"
    },
    hydroxo: {
      name: "Gidroksokobalamin",
      formula: "[Co(Corr)(DMB)(OH)]",
      R: "OH⁻",
      color: "To'q qizil",
      molarMass: "1346.4 g/mol",
      stability: "Barqaror",
      biological: "Yarim-faol (konvertatsiya kerak)",
      use: "In'ektsiya preparatlari, zaharlanish antidoti"
    }
  }

  const current = b12Data[b12Form]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white relative overflow-hidden">
      
      {/* ═══ ANIMATED BACKGROUND ═══ */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(239,68,68,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        {['Co³⁺', 'Corrin', 'DMB', 'B₁₂', 'd⁶', 'Hodgkin 1964', 'Co−C', 'metilkobalamin'].map((sym, i) => (
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
            <span className="text-red-400 font-semibold">[Co(Corr)(DMB)(R)]</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 text-[10px] text-red-300 font-bold uppercase tracking-wider">
                  💊 Vitamin B₁₂
                </span>
                <span className="px-2.5 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-[10px] text-yellow-300 font-semibold">
                  🏆 Nobel 1964
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] text-emerald-300 font-semibold">
                  🧬 Organometallik
                </span>
                <span className="px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-[10px] text-purple-300 font-semibold">
                  ⚡ Co−C bog'i
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-red-400 via-pink-400 to-purple-300 bg-clip-text text-transparent">
                [Co(Corr)(DMB)(R)]
              </h1>
              <p className="text-purple-300 text-sm mt-1">
                Kobalamin • Vitamin B₁₂ • Cobalamin
              </p>
            </div>
            
            {/* B₁₂ FORM SWITCHER */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setB12Form("cyano")}
                className={`px-3 py-2 rounded-xl border-2 transition-all flex items-center gap-2 ${
                  b12Form === "cyano"
                    ? 'bg-red-500/20 border-red-500/50 text-red-300'
                    : 'bg-white/5 border-white/10 text-purple-300 hover:bg-white/10'
                }`}
              >
                <span className="text-lg">💊</span>
                <span className="hidden sm:inline">CN-Cbl</span>
              </button>
              <button
                onClick={() => setB12Form("methyl")}
                className={`px-3 py-2 rounded-xl border-2 transition-all flex items-center gap-2 ${
                  b12Form === "methyl"
                    ? 'bg-pink-500/20 border-pink-500/50 text-pink-300'
                    : 'bg-white/5 border-white/10 text-purple-300 hover:bg-white/10'
                }`}
              >
                <span className="text-lg">🧬</span>
                <span className="hidden sm:inline">Me-Cbl</span>
              </button>
              <button
                onClick={() => setB12Form("adenosyl")}
                className={`px-3 py-2 rounded-xl border-2 transition-all flex items-center gap-2 ${
                  b12Form === "adenosyl"
                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                    : 'bg-white/5 border-white/10 text-purple-300 hover:bg-white/10'
                }`}
              >
                <span className="text-lg">⚡</span>
                <span className="hidden sm:inline">Ado-Cbl</span>
              </button>
              <button
                onClick={() => setB12Form("hydroxo")}
                className={`px-3 py-2 rounded-xl border-2 transition-all flex items-center gap-2 ${
                  b12Form === "hydroxo"
                    ? 'bg-orange-500/20 border-orange-500/50 text-orange-300'
                    : 'bg-white/5 border-white/10 text-purple-300 hover:bg-white/10'
                }`}
              >
                <span className="text-lg">💧</span>
                <span className="hidden sm:inline">OH-Cbl</span>
              </button>
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
            { label: "Formula", value: current.formula, icon: "🧪", color: "text-red-400" },
            { label: "M massa", value: current.molarMass, icon: "⚖️", color: "text-blue-400" },
            { label: "Geometriya", value: "Oktaedrik (buzilgan)", icon: "💎", color: "text-purple-400" },
            { label: "Rangi", value: current.color, icon: "🎨", color: "text-red-400" },
            { label: "R guruhi", value: current.R, icon: "🔗", color: "text-pink-400" },
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
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/30'
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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-xl shadow-lg shadow-red-500/30">
                  📋
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Asosiy ma'lumotlar — {current.name}</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  ["Kimyoviy formula", current.formula],
                  ["Molyar massa", current.molarMass],
                  ["Markaziy ion", "Co³⁺ (d⁶)"],
                  ["Koordinatsion son", "6"],
                  ["Ligandlar", "Corrin + DMB + R"],
                  ["Geometriya", "Oktaedrik (buzilgan)"],
                  ["Biologik faollik", current.biological],
                  ["Qo'llanilish", current.use],
                ].map((item, i) => (
                  <div key={i} className="bg-red-950/50 rounded-xl p-3 border border-red-700/30">
                    <div className="text-[10px] uppercase tracking-wider text-red-400 font-semibold mb-1">{item[0]}</div>
                    <div className="text-white font-semibold text-sm">{item[1]}</div>
                  </div>
                ))}
              </div>

              {/* VITAMIN B₁₂ STRUKTURASI */}
              <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-2xl p-5">
                <h3 className="text-red-400 font-bold mb-3 flex items-center gap-2">
                  <span>💊</span> Vitamin B₁₂ strukturasi
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-red-900/30 rounded-xl p-4 border border-red-700/30">
                    <h4 className="text-red-300 font-bold text-sm mb-2">🧬 Corrin halqasi</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">Co³⁺</strong> — markaziy ion (d⁶)</li>
                      <li>• <strong className="text-white">Corrin</strong> — porfirin-simon halqa (4 ta N)</li>
                      <li>• <strong className="text-white">Farq:</strong> bitta metin ko'prikchasi yo'q</li>
                      <li>• <strong className="text-white">Simmetriya:</strong> past (C₁)</li>
                    </ul>
                  </div>
                  <div className="bg-pink-900/30 rounded-xl p-4 border border-pink-700/30">
                    <h4 className="text-pink-300 font-bold text-sm mb-2">🔗 Aksial ligandlar</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">DMB</strong> — 5,6-dimetilbenzimidazol (pastki)</li>
                      <li>• <strong className="text-white">R guruhi</strong> — o'zgaruvchan (yuqori)</li>
                      <li>• <strong className="text-pink-300">CN⁻:</strong> sianokobalamin (dori)</li>
                      <li>• <strong className="text-pink-300">CH₃⁻:</strong> metilkobalamin (faol)</li>
                      <li>• <strong className="text-pink-300">5'-dAdo:</strong> adenozilkobalamin (faol)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* XULOSA */}
            <div className="bg-gradient-to-r from-red-600/10 via-pink-600/10 to-purple-600/10 border border-red-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>✅</span> Asosiy xulosalar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "💊 <strong>Vitamin B₁₂:</strong> Hayot uchun zarur — ferment kofaktori",
                  "⚛️ <strong>Co³⁺ (d⁶):</strong> past spinli, diamagnit (sianokobalamin)",
                  "🔗 <strong>Co−C bog'i:</strong> Organometallik kimyoning noyob namunasi (metil- va adenozilkobalamin)",
                  "🧬 <strong>Corrin halqasi:</strong> Porfirin-simon, lekin bitta metin ko'prikchasi yo'q",
                  "⚕️ <strong>Tibbiy ahamiyat:</strong> Pernitsioz anemiya, nerv sistemasi kasalliklari",
                  "🏆 <strong>Nobel 1964:</strong> Dorothy Hodgkin — struktura aniqlash (X-ray)",
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
            <div className="bg-gradient-to-br from-purple-900/40 to-red-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-red-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  🧬
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Corrin halqasi strukturasi</h2>
              </div>
              
              <div className="bg-red-950/60 rounded-xl p-5 font-mono text-sm text-red-200 border border-red-700/30 mb-6 text-center">
                <pre className="whitespace-pre">{`           N
          /   \\
    N — Co — N    ← Corrin halqasi (4 ta N)
          \\   /
           N
           |
          DMB (pastki aksial)
           |
          R (yuqori aksial: CN⁻, CH₃⁻, 5'-dAdo, OH⁻)
          
   Oktaedrik (buzilgan): Co³⁺ markazda
   4 ta N (corrin) + 1 ta N (DMB) + 1 ta R = 6 ligand`}</pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-purple-400 font-bold text-sm uppercase tracking-wider">Geometrik parametrlar</h3>
                  <div className="space-y-2">
                    {[
                      ["Geometriya", "Oktaedrik (buzilgan)"],
                      ["Co−N(Corr) masofa", "1.88-1.95 Å (4 ta)"],
                      ["Co−N(DMB) masofa", "2.05 Å (pastki aksial)"],
                      ["Co−R masofa", "1.99-2.05 Å (yuqori aksial)"],
                      ["Co−C masofa", "1.99 Å (metilkobalamin)"],
                      ["Simmetriya", "C₁ (juda past)"],
                      ["Molekula massasi", current.molarMass],
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-purple-800/30">
                        <span className="text-purple-300 text-sm">{item[0]}</span>
                        <span className="text-white font-semibold text-sm font-mono">{item[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-red-400 font-bold text-sm uppercase tracking-wider">Corrin vs Porfirin</h3>
                  <div className="space-y-3">
                    <div className="bg-red-900/30 rounded-xl p-4 border border-red-700/30">
                      <h4 className="text-red-300 font-bold text-sm mb-2">💎 Corrin (B₁₂)</h4>
                      <div className="space-y-2 text-sm text-purple-200">
                        <p>• <strong className="text-white">Metin ko'prikchasi:</strong> bitta yo'q (C19)</p>
                        <p>• <strong className="text-white">Simmetriya:</strong> past (C₁)</p>
                        <p>• <strong className="text-white">Yon zanjirlar:</strong> ko'p (asetamid, propionamid)</p>
                        <p>• <strong className="text-white">Fleksibillik:</strong> yuqori</p>
                      </div>
                    </div>
                    <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-700/30">
                      <h4 className="text-purple-300 font-bold text-sm mb-2">🩸 Porfirin (gemoglobin)</h4>
                      <div className="space-y-2 text-sm text-purple-200">
                        <p>• <strong className="text-white">Metin ko'prikchalari:</strong> 4 ta (barchasi bor)</p>
                        <p>• <strong className="text-white">Simmetriya:</strong> yuqori (D₄ₕ)</p>
                        <p>• <strong className="text-white">Yon zanjirlar:</strong> kam (metil, vinil, propionat)</p>
                        <p>• <strong className="text-white">Fleksibillik:</strong> past (rigid)</p>
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Elektron tuzilishi — Co³⁺ (d⁶)</h2>
              </div>
              
              <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border-2 border-red-500/30 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-red-400">Vitamin B₁₂</strong>da Co <strong className="text-yellow-300">+3 oksidlanish darajasida</strong> (Co³⁺, d⁶).
                  Sianokobalaminda <strong className="text-white">past spinli</strong> holatda (diamagnit), 
                  lekin metil- va adenozilkobalaminda <strong className="text-pink-300">Co−C bog'i</strong> mavjud — 
                  bu <strong className="text-white">organometallik birikma</strong> hisoblanadi.
                </p>
              </div>

              {/* ELEKTRON HISOB */}
              <div className="bg-emerald-950/50 rounded-2xl p-6 border border-emerald-700/30 mb-6">
                <h3 className="text-emerald-400 font-bold mb-4">[Co(Corr)(DMB)(R)] uchun elektron hisobi</h3>
                <div className="space-y-3">
                  <div className="bg-emerald-900/40 rounded-xl p-4 border border-emerald-700/30 flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold">Co³⁺ (kobalt)</div>
                      <div className="text-purple-300 text-xs mt-1">
                        Konfiguratsiya: [Ar] 3d⁶ → 6 ta valent elektron
                      </div>
                    </div>
                    <div className="text-emerald-300 text-2xl font-bold font-mono">6 e⁻</div>
                  </div>
                  <div className="bg-emerald-900/40 rounded-xl p-4 border border-emerald-700/30 flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold">4 × N (Corrin)</div>
                      <div className="text-purple-300 text-xs mt-1">
                        Har bir N 2 ta elektron beradi (σ-donor)
                      </div>
                    </div>
                    <div className="text-emerald-300 text-2xl font-bold font-mono">4 × 2 = 8 e⁻</div>
                  </div>
                  <div className="bg-emerald-900/40 rounded-xl p-4 border border-emerald-700/30 flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold">1 × N (DMB)</div>
                      <div className="text-purple-300 text-xs mt-1">
                        Benzimidazol N donori (σ-donor)
                      </div>
                    </div>
                    <div className="text-emerald-300 text-2xl font-bold font-mono">2 e⁻</div>
                  </div>
                  <div className="bg-emerald-900/40 rounded-xl p-4 border border-emerald-700/30 flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold">1 × R (CN⁻, CH₃⁻, etc.)</div>
                      <div className="text-purple-300 text-xs mt-1">
                        Aksial ligand (σ-donor + π)
                      </div>
                    </div>
                    <div className="text-emerald-300 text-2xl font-bold font-mono">2 e⁻</div>
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

              {/* B₁₂ SHAKLLARI BO'YICHA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-950/50 rounded-xl p-5 border-2 border-red-500/30">
                  <h3 className="text-red-400 font-bold mb-3">💊 Sianokobalamin (CN-Cbl)</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Co holati:</strong> +3 (past spinli)</p>
                    <p>• <strong className="text-white">Konfiguratsiya:</strong> t₂g⁶ e₉⁰</p>
                    <p>• <strong className="text-white">Magnit:</strong> diamagnit</p>
                    <p>• <strong className="text-white">Barqarorlik:</strong> eng yuqori</p>
                  </div>
                </div>

                <div className="bg-pink-950/50 rounded-xl p-5 border-2 border-pink-500/30">
                  <h3 className="text-pink-400 font-bold mb-3">🧬 Metilkobalamin (Me-Cbl)</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Co holati:</strong> +3 (past spinli)</p>
                    <p>• <strong className="text-white">Konfiguratsiya:</strong> t₂g⁶ e₉⁰</p>
                    <p>• <strong className="text-white">Co−C bog'i:</strong> 1.99 Å</p>
                    <p>• <strong className="text-white">Biologik:</strong> metiltransferaza</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* FORMS TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "forms" && (
          <>
            <div className="bg-gradient-to-br from-red-900/40 to-pink-900/40 border border-red-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-xl shadow-lg shadow-red-500/30">
                  💊
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Vitamin B₁₂ shakllari</h2>
              </div>
              
              <div className="space-y-4">
                {[
                  { form: "cyano", name: "Sianokobalamin", icon: "💊", color: "red", desc: "Dori shakli, eng barqaror" },
                  { form: "methyl", name: "Metilkobalamin", icon: "🧬", color: "pink", desc: "Faol — metiltransferaza kofaktori" },
                  { form: "adenosyl", name: "Adenozilkobalamin", icon: "⚡", color: "purple", desc: "Faol — mutaza kofaktori" },
                  { form: "hydroxo", name: "Gidroksokobalamin", icon: "💧", color: "orange", desc: "In'ektsiya shakli" },
                ].map((item, i) => (
                  <div 
                    key={i} 
                    className={`bg-${item.color}-950/50 rounded-xl p-5 border-2 ${
                      b12Form === item.form ? `border-${item.color}-500/50` : `border-${item.color}-700/30`
                    } cursor-pointer transition-all hover:scale-[1.02]`}
                    onClick={() => setB12Form(item.form)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{item.icon}</div>
                      <div className="flex-1">
                        <h3 className={`text-${item.color}-400 font-bold text-lg mb-2`}>{item.name}</h3>
                        <p className="text-purple-200 text-sm mb-3">{item.desc}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-purple-200">
                          <div>
                            <div className={`text-[10px] text-${item.color}-400 uppercase`}>Formula</div>
                            <div className="font-semibold font-mono">{b12Data[item.form].formula}</div>
                          </div>
                          <div>
                            <div className={`text-[10px] text-${item.color}-400 uppercase`}>R guruhi</div>
                            <div className="font-semibold font-mono">{b12Data[item.form].R}</div>
                          </div>
                          <div>
                            <div className={`text-[10px] text-${item.color}-400 uppercase`}>Barqarorlik</div>
                            <div className="font-semibold">{b12Data[item.form].stability}</div>
                          </div>
                          <div>
                            <div className={`text-[10px] text-${item.color}-400 uppercase`}>Qo'llanilish</div>
                            <div className="font-semibold">{b12Data[item.form].use}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* ENZYMOLOGY TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "enzymology" && (
          <>
            <div className="bg-gradient-to-br from-purple-900/40 to-emerald-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-emerald-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  🧬
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">B₁₂ bog'liq fermentlar</h2>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500/10 to-emerald-500/10 border border-purple-500/20 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-purple-400">Vitamin B₁₂</strong> — bu 
                  <strong className="text-white"> ikkita asosiy ferment sinfining</strong> kofaktori:
                  <strong className="text-yellow-300"> metiltransferazalar</strong> (metilkobalamin bilan) va 
                  <strong className="text-pink-300"> mutazalar</strong> (adenozilkobalamin bilan).
                  Bu fermentlar inson metabolizmida <strong className="text-white">hal qiluvchi rol</strong> o'ynaydi.
                </p>
              </div>

              {/* FERMENTLAR */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-pink-950/50 rounded-xl p-5 border-2 border-pink-500/30">
                  <h3 className="text-pink-400 font-bold mb-3">🧬 Metionin sintaza</h3>
                  <div className="bg-pink-900/60 rounded-lg p-3 font-mono text-xs text-pink-200 border border-pink-700/30 mb-3">
                    <p>Homotsistein + N⁵-metil-THF →</p>
                    <p className="mt-1">Metionin + THF</p>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Kofaktor:</strong> Metilkobalamin (Me-Cbl)</p>
                    <p>• <strong className="text-white">Mexanizm:</strong> Metil guruhi ko'chishi</p>
                    <p>• <strong className="text-white">Ahamiyati:</strong> DNK sintezi, metillanish</p>
                    <p>• <strong className="text-white">Kamchilik:</strong> Giperhomotsisteinemiya</p>
                  </div>
                </div>

                <div className="bg-purple-950/50 rounded-xl p-5 border-2 border-purple-500/30">
                  <h3 className="text-purple-400 font-bold mb-3">⚡ Metilmalonil-CoA mutaza</h3>
                  <div className="bg-purple-900/60 rounded-lg p-3 font-mono text-xs text-purple-200 border border-purple-700/30 mb-3">
                    <p>L-metilmalonil-CoA →</p>
                    <p className="mt-1">Suksinil-CoA</p>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Kofaktor:</strong> Adenozilkobalamin (Ado-Cbl)</p>
                    <p>• <strong className="text-white">Mexanizm:</strong> Radikal qayta joylashuv</p>
                    <p>• <strong className="text-white">Ahamiyati:</strong> Yog' kislotalari metabolizmi</p>
                    <p>• <strong className="text-white">Kamchilik:</strong> Metilmalonik asidemiya</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500/10 to-emerald-500/10 border border-purple-500/20 rounded-2xl p-5">
                <h3 className="text-purple-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Nega bu fermentlar muhim?
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Metionin sintaza:</strong> Homotsisteinni metioninga aylantiradi — yurak-qon tomir kasalliklari oldini oladi</p>
                  <p>• <strong className="text-white">Metilmalonil-CoA mutaza:</strong> Yog' kislotalari va aminokislotalar metabolizmi — energiya ishlab chiqarish</p>
                  <p>• <strong className="text-white">B₁₂ kamchiligi:</strong> Ikkala ferment ham ishlamaydi → anemiya, nerv shikastlanishi</p>
                  <p className="text-xs text-purple-400 mt-2">
                    <strong className="text-yellow-300">Qiziq fakt:</strong> B₁₂ — inson tanasida <strong>Co−C bog'i</strong> mavjud bo'lgan yagona molekula!
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* CO-C BOND TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "coBond" && (
          <>
            <div className="bg-gradient-to-br from-pink-900/40 to-purple-900/40 border border-pink-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-xl shadow-lg shadow-pink-500/30">
                  🔗
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Co−C bog'i — organometallik kimyoning mo''jizasi</h2>
              </div>
              
              <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-2 border-pink-500/30 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-pink-400">Vitamin B₁₂</strong> — bu 
                  <strong className="text-white"> tabiatda uchraydigan kam sonli organometallik birikmalardan biri</strong>.
                  Metil- va adenozilkobalaminda <strong className="text-yellow-300">to'g'ridan-to'g'ri Co−C bog'i</strong> mavjud.
                  Bu bog' <strong className="text-white">fotoliz</strong> (yorug'lik ta'sirida) va 
                  <strong className="text-pink-300"> fermentativ reaktsiyalarda</strong> uziladi.
                </p>
              </div>

              {/* CO-C BOG'I XUSUSIYATLARI */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-pink-950/50 rounded-xl p-5 border border-pink-700/30">
                  <h3 className="text-pink-400 font-bold mb-3">🧬 Metilkobalamin (Me-Cbl)</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Co−C masofa:</strong> 1.99 Å</p>
                    <p>• <strong className="text-white">Bog' energiyasi:</strong> ~125 kJ/mol</p>
                    <p>• <strong className="text-white">Bog' turi:</strong> σ-bog' (Co d<sub>z²</sub> + C sp³)</p>
                    <p>• <strong className="text-white">Reaktsiya:</strong> Heterolitik uzilish</p>
                    <p>• <strong className="text-white">Mexanizm:</strong> Metil kationi (CH₃⁺) ko'chishi</p>
                  </div>
                </div>

                <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
                  <h3 className="text-purple-400 font-bold mb-3">⚡ Adenozilkobalamin (Ado-Cbl)</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Co−C masofa:</strong> 2.05 Å</p>
                    <p>• <strong className="text-white">Bog' energiyasi:</strong> ~125 kJ/mol</p>
                    <p>• <strong className="text-white">Bog' turi:</strong> σ-bog' (Co d<sub>z²</sub> + C sp³)</p>
                    <p>• <strong className="text-white">Reaktsiya:</strong> Gomolitik uzilish</p>
                    <p>• <strong className="text-white">Mexanizm:</strong> Radikal (5'-deoksiadenozil radikal)</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-2xl p-5">
                <h3 className="text-pink-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Nega Co−C bog'i noyob?
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Kobalt:</strong> o'tish metallari orasida Co−C bog'i eng barqaror</p>
                  <p>• <strong className="text-white">Fotoliz:</strong> yorug'lik ta'sirida Co−C bog'i oson uziladi (laboratoriyada qulay)</p>
                  <p>• <strong className="text-white">Fermentlar:</strong> fermentlar Co−C bog'ini nazorat ostida uzadi va qayta hosil qiladi</p>
                  <p className="text-xs text-purple-400 mt-2">
                    <strong className="text-yellow-300">Qiziq fakt:</strong> B₁₂ — inson tanasida <strong>organometallik bog'</strong> mavjud bo'lgan yagona molekula!
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
                  <h3 className="text-green-400 font-bold mb-3">🌈 UV-Vis spektroskopiya</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <div className="bg-green-900/40 rounded-lg p-3 border border-green-700/30">
                      <p className="text-green-300 font-bold text-xs mb-1">💊 Sianokobalamin</p>
                      <p className="text-xs">λ<sub>max</sub>: 361 nm, 525 nm, 550 nm</p>
                      <p className="text-xs">Rang: to'q qizil</p>
                    </div>
                    <div className="bg-pink-900/40 rounded-lg p-3 border border-pink-700/30">
                      <p className="text-pink-300 font-bold text-xs mb-1">🧬 Metilkobalamin</p>
                      <p className="text-xs">λ<sub>max</sub>: 340 nm, 520 nm</p>
                      <p className="text-xs">Rang: qizil</p>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-950/50 rounded-xl p-5 border border-emerald-700/30">
                  <h3 className="text-emerald-400 font-bold mb-3">📡 Boshqa usullar</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <div className="bg-emerald-900/40 rounded-lg p-3 border border-emerald-700/30">
                      <p className="text-emerald-300 font-bold text-xs mb-1">🧲 EPR (ESR)</p>
                      <p className="text-xs">Co²⁺ holatida signal (Co³⁺ diamagnit)</p>
                    </div>
                    <div className="bg-teal-900/40 rounded-lg p-3 border border-teal-700/30">
                      <p className="text-teal-300 font-bold text-xs mb-1">📊 NMR</p>
                      <p className="text-xs">¹H NMR: ko'p cho'qqilar (murakkab struktura)</p>
                      <p className="text-xs">⁵⁹Co NMR: δ ≈ 0 ppm (standart)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-5">
                <h3 className="text-green-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Nega B₁₂ qizil?
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Corrin π→π* o'tishlar:</strong> 361 nm (UB) va 525-550 nm (yashil-sariq)</p>
                  <p>• <strong className="text-white">Yutilish:</strong> yashil-sariq nur yutiladi → qizil ko'rinadi</p>
                  <p>• <strong className="text-white">d-d o'tishlar:</strong> Co³⁺ (past spinli) → kuchsiz, ko'rinmaydigan</p>
                  <p className="text-xs text-purple-400 mt-2">
                    <strong className="text-yellow-300">Qiziq fakt:</strong> B₁₂ ning qizil rangi — bu uning 
                    <strong className="text-pink-300">corrin halqasining</strong> xususiyati, Co ionining emas.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* MEDICINE TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "medicine" && (
          <>
            <div className="bg-gradient-to-br from-red-900/40 to-pink-900/40 border border-red-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-xl shadow-lg shadow-red-500/30">
                  ⚕️
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Tibbiy ahamiyat</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-red-950/50 rounded-xl p-5 border-2 border-red-500/30">
                  <h3 className="text-red-400 font-bold mb-3">🩸 Pernitsioz anemiya</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Sabab:</strong> Oshqozonda ichki omil (intrinsic factor) yo'qligi</p>
                    <p>• <strong className="text-white">Natija:</strong> B₁₂ so'rilishi buziladi → anemiya</p>
                    <p>• <strong className="text-white">Belgilar:</strong> charchoq, kuchsizlik, rangparlik</p>
                    <p>• <strong className="text-white">Davolash:</strong> B₁₂ in'ektsiyalari (gidroksokobalamin)</p>
                  </div>
                </div>

                <div className="bg-pink-950/50 rounded-xl p-5 border border-pink-700/30">
                  <h3 className="text-pink-400 font-bold mb-3">🧠 Nerv sistemasi kasalliklari</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Subakut birikgan degeneratsiya:</strong> orqa miya shikastlanishi</p>
                    <p>• <strong className="text-white">Belgilar:</strong> uvishish, muvozanat buzilishi, eslab qolish muammolari</p>
                    <p>• <strong className="text-white">Mexanizm:</strong> Mielin qobig'i shikastlanishi</p>
                    <p>• <strong className="text-white">Davolash:</strong> B₁₂ qo'shimchalari</p>
                  </div>
                </div>

                <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
                  <h3 className="text-purple-400 font-bold mb-3">💊 Dori preparatlari</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <div className="bg-purple-900/40 rounded-lg p-3 border border-purple-700/30">
                      <p className="text-purple-300 font-bold text-xs mb-1">Sianokobalamin</p>
                      <p className="text-xs">Tabletkalar, oziq-ovqat qo'shimchalari</p>
                    </div>
                    <div className="bg-pink-900/40 rounded-lg p-3 border border-pink-700/30">
                      <p className="text-pink-300 font-bold text-xs mb-1">Gidroksokobalamin</p>
                      <p className="text-xs">In'ektsiyalar, zaharlanish antidoti (CN⁻ bog'laydi)</p>
                    </div>
                    <div className="bg-emerald-900/40 rounded-lg p-3 border border-emerald-700/30">
                      <p className="text-emerald-300 font-bold text-xs mb-1">Metilkobalamin</p>
                      <p className="text-xs">Sublingval tabletkalar (faol shakl)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* BIOSYNTHESIS TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "biosynthesis" && (
          <>
            <div className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border border-emerald-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-xl shadow-lg shadow-emerald-500/30">
                  🌿
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">B₁₂ biosintezi</h2>
              </div>
              
              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-2 border-emerald-500/30 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-emerald-400">Vitamin B₁₂ biosintezi</strong> — bu 
                  <strong className="text-white"> tabiatdagi eng murakkab biosintez yo'llaridan biri</strong>.
                  U <strong className="text-yellow-300">30+ ferment</strong> ishtirokida sodir bo'ladi va 
                  <strong className="text-pink-300"> faqat bakteriyalar</strong> tomonidan amalga oshiriladi.
                  O'simliklar va hayvonlar B₁₂ ni sintez qila olmaydi — ular uni bakteriyalardan olishadi.
                </p>
              </div>

              {/* BIOSINTEZ BOSQICHLARI */}
              <div className="space-y-3 mb-6">
                {[
                  { step: "1", title: "δ-aminolevulin kislotasi (ALA)", desc: "Glutamatdan boshlanadi — porfirin biosintezi bilan bir xil", color: "emerald" },
                  { step: "2", title: "Uroporfirinogen III", desc: "4 ta ALA → porfirin halqasi hosil bo'ladi", color: "teal" },
                  { step: "3", title: "Corrin halqasi", desc: "Metil guruhi qo'shiladi, halqa qisqaradi", color: "green" },
                  { step: "4", title: "Co²⁺ kiritish", desc: "Kobaltoxelataza fermenti Co²⁺ ni halqaga kiritadi", color: "cyan" },
                  { step: "5", title: "DMB biriktirish", desc: "Pastki aksial ligand birikadi", color: "blue" },
                  { step: "6", title: "Adenozillash", desc: "Yuqori aksial ligand (5'-deoksiadenozil) qo'shiladi", color: "indigo" },
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

              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-5">
                <h3 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Nega odamlar B₁₂ ni sintez qila olmaydi?
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Evolyutsion sabab:</strong> B₁₂ biosintezi juda murakkab (30+ ferment) — odamlar bu genlarni yo'qotgan</p>
                  <p>• <strong className="text-white">Bakteriyalar:</strong> ichak mikroflorasi B₁₂ sintez qiladi, lekin so'rilishi cheklangan</p>
                  <p>• <strong className="text-white">Oziq-ovqat:</strong> hayvon mahsulotlari (go'sht, sut, tuxum) — asosiy manba</p>
                  <p className="text-xs text-purple-400 mt-2">
                    <strong className="text-yellow-300">Veganlar uchun:</strong> B₁₂ faqat hayvon mahsulotlarida bo'lgani uchun, 
                    veganlar <strong className="text-pink-300">qo'shimchalar</strong> qabul qilishi kerak.
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Nobel mukofotlari — Minot & Murphy (1934) va Hodgkin (1964)</h2>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-2xl p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-yellow-600 to-amber-600 flex items-center justify-center text-6xl flex-shrink-0 shadow-2xl">
                    🏆
                  </div>
                  <div className="flex-1">
                    <h3 className="text-yellow-400 font-bold text-xl mb-2">Ikki Nobel mukofoti</h3>
                    <p className="text-purple-200 text-sm mb-3 leading-relaxed">
                      <strong className="text-yellow-300">1934 yilda</strong> George Minot va William Murphy 
                      <strong className="text-white"> perntsioz anemiyani</strong> jigar bilan davolashni kashf qilgani uchun Nobel oldi.
                      <strong className="text-yellow-300"> 1964 yilda</strong> Dorothy Hodgkin 
                      <strong className="text-white"> B₁₂ strukturasini</strong> rentgen kristallografiyasi orqali aniqlagani uchun Nobel oldi.
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-xs text-yellow-300 font-semibold">
                        🏆 Nobel 1934
                      </span>
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-xs text-amber-300 font-semibold">
                        🏆 Nobel 1964
                      </span>
                      <span className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-xs text-red-300 font-semibold">
                        💊 Pernitsioz anemiya
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { year: "1855", title: "Pernitsioz anemiya tavsifi", desc: "Thomas Addison birinchi bo'lib perntsioz anemiyani tavsifladi" },
                  { year: "1926", title: "Jigar bilan davolash", desc: "Minot va Murphy jigar iste'moli anemiyani davolashini ko'rsatdi" },
                  { year: "1934", title: "Nobel mukofoti", desc: "Minot va Murphy perntsioz anemiya tadqiqoti uchun Nobel oldi" },
                  { year: "1948", title: "B₁₂ ajratib olindi", desc: "Karl Folkers va boshqalar B₁₂ ni jigar ekstraktidan ajratib oldi" },
                  { year: "1956", title: "Struktura aniqlandi", desc: "Dorothy Hodgkin rentgen kristallografiyasi orqali B₁₂ strukturasini aniqladi" },
                  { year: "1964", title: "Nobel mukofoti", desc: "Hodgkin B₁₂ va boshqa muhim molekulalar strukturasi uchun Nobel oldi" },
                  { year: "1970+", title: "Ferment mexanizmlari", desc: "B₁₂ bog'liq fermentlar mexanizmlari aniqlandi" },
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
              href="/ilmiy/birikmares/xlorofill"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white font-bold transition-all shadow-lg shadow-emerald-500/30 flex items-center gap-2"
            >
              <span>🌿</span>
              <span className="hidden sm:inline">Xlorofill</span>
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