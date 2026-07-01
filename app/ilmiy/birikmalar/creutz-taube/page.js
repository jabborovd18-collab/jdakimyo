"use client"

import Link from "next/link"
import { useState } from "react"

export default function CreutzTaube() {
  const [activeTab, setActiveTab] = useState("overview")
  const [robinDayClass, setRobinDayClass] = useState("II") // I | II | III

  const tabs = [
    { id: "overview", label: "📋 Umumiy", icon: "📋" },
    { id: "structure", label: "🧬 Dimer strukturasi", icon: "🧬" },
    { id: "mixedValence", label: "⚛️ Mixed-valence", icon: "⚛️" },
    { id: "robinDay", label: "📊 Robin-Day tasnifi", icon: "📊" },
    { id: "color", label: "🎨 IVCT rang mexanizmi", icon: "🎨" },
    { id: "bonding", label: "🔗 Pirazin ko'prigi", icon: "🔗" },
    { id: "spectroscopy", label: "🔬 Spektroskopiya", icon: "🔬" },
    { id: "applications", label: "🏭 Qo'llanilish", icon: "🏭" },
    { id: "synthesis", label: "⚗️ Sintez", icon: "⚗️" },
    { id: "history", label: "🏆 Tarix (1969)", icon: "🏆" },
  ]

  const robinDayData = {
    I: {
      name: "Class I — Lokalizatsiyalangan",
      description: "Elektronlar to'liq lokalizatsiyalangan — Ru²⁺ va Ru³⁺ alohida",
      electronicCoupling: "Hab ≈ 0 (elektronik bog'lanish yo'q)",
      ivct: "IVCT yo'q (ko'rinmaydi)",
      examples: "Ko'pchilik mixed-valence komplekslar",
      color: "Kuchsiz rang"
    },
    II: {
      name: "Class II — Qisman delokalizatsiya",
      description: "Elektronlar qisman delokalizatsiyalangan — Creutz-Taube ioni shu yerda!",
      electronicCoupling: "Hab ≈ 500-1000 cm⁻¹ (o'rta bog'lanish)",
      ivct: "IVCT NIR sohada (1000-1500 nm)",
      examples: "Creutz-Taube ioni [(NH₃)₅Ru(pyz)Ru(NH₃)₅]⁵⁺",
      color: "To'q ko'k-binafsha"
    },
    III: {
      name: "Class III — To'liq delokalizatsiya",
      description: "Elektronlar to'liq delokalizatsiyalangan — Ru²·⁵−Ru²·⁵ (aralash valent)",
      electronicCoupling: "Hab > 2000 cm⁻¹ (kuchli bog'lanish)",
      ivct: "Kuchli, keng cho'qqi",
      examples: "Creutz-Taube ioni ba'zi sharoitlarda",
      color: "Juda to'q rang"
    }
  }

  const currentClass = robinDayData[robinDayClass]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white relative overflow-hidden">
      
      {/* ═══ ANIMATED BACKGROUND ═══ */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        {['Ru²⁺', 'Ru³⁺', 'pyz', 'IVCT', 'Creutz-Taube 1969', 'mixed-valence', 'Class II', 'Robin-Day'].map((sym, i) => (
          <div
            key={i}
            className="absolute text-indigo-400/5 font-mono font-bold select-none pointer-events-none"
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
            <span className="text-indigo-400 font-semibold">[(NH₃)₅Ru(pyz)Ru(NH₃)₅]⁵⁺</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 text-[10px] text-indigo-300 font-bold uppercase tracking-wider">
                  ⚛️ Mixed-valence klassikasi
                </span>
                <span className="px-2.5 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-[10px] text-yellow-300 font-semibold">
                  🏆 Creutz & Taube 1969
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] text-emerald-300 font-semibold">
                  📊 Robin-Day Class II/III
                </span>
                <span className="px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-[10px] text-purple-300 font-semibold">
                  🎨 IVCT
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-400 via-violet-400 to-blue-300 bg-clip-text text-transparent">
                [(NH₃)₅Ru(pyz)Ru(NH₃)₅]⁵⁺
              </h1>
              <p className="text-purple-300 text-sm mt-1">
                Creutz-Taube ioni • Bis(pentaamminruteniy)pirazin • Creutz-Taube ion
              </p>
            </div>
            
            <div className="flex gap-2">
              <Link 
                href="/ilmiy/birikmalar/prussian-blue"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 hover:border-blue-400/60 text-blue-300 text-sm font-semibold transition-all flex items-center gap-2"
              >
                <span>🎨</span>
                <span className="hidden sm:inline">Prussian Blue</span>
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
            { label: "Formula", value: "[(NH₃)₅Ru(pyz)Ru(NH₃)₅]⁵⁺", icon: "🧪", color: "text-indigo-400" },
            { label: "M massa", value: "~654 g/mol", icon: "⚖️", color: "text-blue-400" },
            { label: "Geometriya", value: "Dimer (oktaedrik)", icon: "💎", color: "text-purple-400" },
            { label: "Rangi", value: "To'q ko'k-binafsha", icon: "🎨", color: "text-violet-400" },
            { label: "Valentlik", value: "Mixed (Ru²⁺/Ru³⁺)", icon: "⚛️", color: "text-indigo-400" },
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
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/30'
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
            <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-indigo-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-xl shadow-lg shadow-indigo-500/30">
                  📋
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Asosiy ma'lumotlar — Creutz-Taube ioni</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  ["CAS raqami", "20932-65-0"],
                  ["Zaryad", "+5"],
                  ["Simmetriya", "D₂ₕ (taxminan)"],
                  ["Ru−Ru masofa", "~5.5 Å"],
                  ["Ru²⁺ konfiguratsiya", "d⁶ (past spinli)"],
                  ["Ru³⁺ konfiguratsiya", "d⁵ (past spinli)"],
                  ["IVCT cho'qqisi", "~1000-1500 nm"],
                  ["Rang", "To'q ko'k-binafsha"],
                ].map((item, i) => (
                  <div key={i} className="bg-indigo-950/50 rounded-xl p-3 border border-indigo-700/30">
                    <div className="text-[10px] uppercase tracking-wider text-indigo-400 font-semibold mb-1">{item[0]}</div>
                    <div className="text-white font-semibold text-sm">{item[1]}</div>
                  </div>
                ))}
              </div>

              {/* DIMER STRUKTURASI */}
              <div className="bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 rounded-2xl p-5">
                <h3 className="text-indigo-400 font-bold mb-3 flex items-center gap-2">
                  <span>🔗</span> Dimer strukturasi
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-indigo-900/30 rounded-xl p-4 border border-indigo-700/30">
                    <h4 className="text-indigo-300 font-bold text-sm mb-2">⚛️ Chap tomon: Ru²⁺ (d⁶)</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">Ru²⁺</strong> — markaziy ion (4d⁶)</li>
                      <li>• <strong className="text-white">5 × NH₃</strong> — ammiak ligandlari</li>
                      <li>• <strong className="text-white">1 × pyz</strong> — pirazin (ko'prik)</li>
                      <li>• <strong className="text-yellow-300">Koordinatsion son:</strong> 6 (oktaedrik)</li>
                      <li>• <strong className="text-pink-300">Past spinli:</strong> t₂g⁶ (diamagnit)</li>
                    </ul>
                  </div>
                  <div className="bg-violet-900/30 rounded-xl p-4 border border-violet-700/30">
                    <h4 className="text-violet-300 font-bold text-sm mb-2">⚛️ O'ng tomon: Ru³⁺ (d⁵)</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">Ru³⁺</strong> — markaziy ion (4d⁵)</li>
                      <li>• <strong className="text-white">5 × NH₃</strong> — ammiak ligandlari</li>
                      <li>• <strong className="text-white">1 × pyz</strong> — pirazin (ko'prik)</li>
                      <li>• <strong className="text-yellow-300">Koordinatsion son:</strong> 6 (oktaedrik)</li>
                      <li>• <strong className="text-pink-300">Past spinli:</strong> t₂g⁵ (paramagnit, 1 e⁻)</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 bg-purple-900/20 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-200 text-sm">
                    <strong className="text-indigo-300">Muhim:</strong> Pirazin (pyz) ko'prigi orqali 
                    <strong className="text-white"> elektron delokalizatsiyasi</strong> sodir bo'ladi — 
                    bu Creutz-Taube ionini <strong className="text-yellow-300">mixed-valence klassikasi</strong>ga aylantiradi!
                  </p>
                </div>
              </div>
            </div>

            {/* XULOSA */}
            <div className="bg-gradient-to-r from-indigo-600/10 via-violet-600/10 to-purple-600/10 border border-indigo-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>✅</span> Asosiy xulosalar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "⚛️ <strong>Mixed-valence:</strong> Ru²⁺ va Ru³⁺ birgalikda — aralash valentli kompleks",
                  "🔗 <strong>Pirazin ko'prigi:</strong> ikkita Ru atomini bog'laydi va elektron delokalizatsiyasini ta'minlaydi",
                  "📊 <strong>Robin-Day Class II:</strong> qisman delokalizatsiya — Class I va Class III orasida",
                  "🎨 <strong>IVCT (Intervalence Charge Transfer):</strong> Ru²⁺ ↔ Ru³⁺ elektron ko'chishi",
                  "🎨 <strong>Rang:</strong> NIR sohada yutilish (1000-1500 nm) → to'q ko'k-binafsha",
                  "🏆 <strong>Creutz & Taube 1969:</strong> birinchi marta sintez qilingan va mixed-valence kimyosining asosini qo'ydi",
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Dimer strukturasi</h2>
              </div>
              
              <div className="bg-indigo-950/60 rounded-xl p-5 font-mono text-sm text-indigo-200 border border-indigo-700/30 mb-6 text-center">
                <pre className="whitespace-pre">{`        (NH₃)₅          (NH₃)₅
          |                |
        Ru²⁺ --- pyz --- Ru³⁺
          |                |
        (NH₃)₅          (NH₃)₅
        
   Dimer: ikkita oktaedrik Ru kompleksi
   Pirazin (pyz) ko'prigi orqali bog'langan
   Ru−Ru masofa: ~5.5 Å
   
   Mixed-valence: Ru²⁺ (d⁶) va Ru³⁺ (d⁵)`}</pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-purple-400 font-bold text-sm uppercase tracking-wider">Geometrik parametrlar</h3>
                  <div className="space-y-2">
                    {[
                      ["Geometriya", "Dimer (ikki oktaedrik)"],
                      ["Simmetriya", "D₂ₕ (taxminan)"],
                      ["Ru−Ru masofa", "~5.5 Å (pirazin orqali)"],
                      ["Ru−N(NH₃) masofa", "~2.10 Å (10 ta)"],
                      ["Ru−N(pyz) masofa", "~2.05 Å (2 ta)"],
                      ["Pirazin C−C", "1.39 Å (aromatik)"],
                      ["Koordinatsion son", "6 (har bir Ru uchun)"],
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-purple-800/30">
                        <span className="text-purple-300 text-sm">{item[0]}</span>
                        <span className="text-white font-semibold text-sm font-mono">{item[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-indigo-400 font-bold text-sm uppercase tracking-wider">Pirazin (pyz) ligandi</h3>
                  <div className="space-y-3">
                    <div className="bg-indigo-900/30 rounded-xl p-4 border border-indigo-700/30">
                      <h4 className="text-indigo-300 font-bold text-sm mb-2">🔗 Ko'prikli ligand</h4>
                      <div className="space-y-2 text-sm text-purple-200">
                        <p>• <strong className="text-white">Pirazin:</strong> C₄H₄N₂ (aromatik halqa)</p>
                        <p>• <strong className="text-white">Bidentat:</strong> ikkala N atomi orqali bog'lanadi</p>
                        <p>• <strong className="text-white">Ko'prik:</strong> ikkita metallni bog'laydi</p>
                        <p>• <strong className="text-yellow-300">Elektron delokalizatsiya:</strong> π-sistema orqali</p>
                      </div>
                    </div>
                    <div className="bg-violet-900/30 rounded-xl p-4 border border-violet-700/30">
                      <h4 className="text-violet-300 font-bold text-sm mb-2">⚡ Nima uchun pirazin?</h4>
                      <div className="space-y-2 text-sm text-purple-200">
                        <p>• <strong className="text-white">Aromatik:</strong> π-elektronlar delokalizatsiyalangan</p>
                        <p>• <strong className="text-white">Qattiq:</strong> rigd struktura (fleksibil emas)</p>
                        <p>• <strong className="text-white">Yaxshi ko'prik:</strong> Ru−Ru masofani saqlaydi</p>
                        <p>• <strong className="text-yellow-300">Natija:</strong> elektron ko'chishi mumkin</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* MIXED VALENCE TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "mixedValence" && (
          <>
            <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  ⚛️
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Mixed-valence (aralash valentli) kompleks</h2>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border-2 border-purple-500/30 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-purple-400">Creutz-Taube ioni</strong> — bu 
                  <strong className="text-white"> mixed-valence (aralash valentli)</strong> kompleks.
                  Unda <strong className="text-blue-300">Ru²⁺</strong> va <strong className="text-red-300">Ru³⁺</strong> ionlari 
                  <strong className="text-yellow-300"> birgalikda</strong> mavjud. Pirazin ko'prigi orqali 
                  <strong className="text-pink-300"> elektron delokalizatsiyasi</strong> sodir bo'ladi.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-950/50 rounded-xl p-5 border-2 border-blue-500/30">
                  <h3 className="text-blue-400 font-bold mb-3">🔵 Ru²⁺ (ruteniy II)</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Oksidlanish darajasi:</strong> +2</p>
                    <p>• <strong className="text-white">Elektron konfiguratsiya:</strong> [Kr] 4d⁶</p>
                    <p>• <strong className="text-white">Koordinatsiya:</strong> 5 × NH₃ + 1 × pyz (N)</p>
                    <p>• <strong className="text-white">Bog'lanish:</strong> Ru²⁺−N(pyz)</p>
                    <p>• <strong className="text-white">Spin holati:</strong> Past spinli (LS)</p>
                    <p>• <strong className="text-white">Magnit:</strong> Diamagnit (t₂g⁶)</p>
                  </div>
                </div>

                <div className="bg-red-950/50 rounded-xl p-5 border-2 border-red-500/30">
                  <h3 className="text-red-400 font-bold mb-3">🔴 Ru³⁺ (ruteniy III)</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Oksidlanish darajasi:</strong> +3</p>
                    <p>• <strong className="text-white">Elektron konfiguratsiya:</strong> [Kr] 4d⁵</p>
                    <p>• <strong className="text-white">Koordinatsiya:</strong> 5 × NH₃ + 1 × pyz (N)</p>
                    <p>• <strong className="text-white">Bog'lanish:</strong> Ru³⁺−N(pyz)</p>
                    <p>• <strong className="text-white">Spin holati:</strong> Past spinli (LS)</p>
                    <p>• <strong className="text-white">Magnit:</strong> Paramagnit (t₂g⁵, 1 unpaired e⁻)</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-5">
                <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Elektron delokalizatsiyasi
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Ru²⁺ ↔ Ru³⁺:</strong> pirazin orqali elektron ko'chishi</p>
                  <p>• <strong className="text-white">Delokalizatsiya:</strong> elektron ikkala Ru atomida qisman mavjud</p>
                  <p>• <strong className="text-yellow-300">Natija:</strong> Ru²·⁵−Ru²·⁵ (aralash valent)</p>
                  <p>• <strong className="text-white">IVCT:</strong> Intervalence Charge Transfer — bu ko'chish yorug'lik yutilishiga olib keladi</p>
                  <p className="text-xs text-purple-400 mt-2">
                    Bu hodisa <strong className="text-pink-300">Robin-Day tasnifi</strong> bo'yicha 
                    <strong className="text-white"> Class II</strong> (qisman delokalizatsiya) hisoblanadi.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* ROBIN-DAY TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "robinDay" && (
          <>
            <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  📊
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Robin-Day tasnifi (1968)</h2>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border-2 border-purple-500/30 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-purple-400">Robin-Day tasnifi</strong> — bu 
                  <strong className="text-white"> mixed-valence komplekslar</strong>ni uchta sinfga ajratish:
                  <strong className="text-blue-300"> Class I</strong> (lokalizatsiyalangan), 
                  <strong className="text-yellow-300"> Class II</strong> (qisman delokalizatsiya), 
                  <strong className="text-red-300"> Class III</strong> (to'liq delokalizatsiya).
                  Creutz-Taube ioni <strong className="text-yellow-300">Class II</strong> da joylashgan.
                </p>
              </div>

              {/* ROBIN-DAY SWITCHER */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setRobinDayClass("I")}
                  className={`flex-1 py-3 rounded-xl border-2 transition-all ${
                    robinDayClass === "I"
                      ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                      : 'bg-white/5 border-white/10 text-purple-300 hover:bg-white/10'
                  }`}
                >
                  Class I
                </button>
                <button
                  onClick={() => setRobinDayClass("II")}
                  className={`flex-1 py-3 rounded-xl border-2 transition-all ${
                    robinDayClass === "II"
                      ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300'
                      : 'bg-white/5 border-white/10 text-purple-300 hover:bg-white/10'
                  }`}
                >
                  Class II
                </button>
                <button
                  onClick={() => setRobinDayClass("III")}
                  className={`flex-1 py-3 rounded-xl border-2 transition-all ${
                    robinDayClass === "III"
                      ? 'bg-red-500/20 border-red-500/50 text-red-300'
                      : 'bg-white/5 border-white/10 text-purple-300 hover:bg-white/10'
                  }`}
                >
                  Class III
                </button>
              </div>

              {/* JORIY CLASS MA'LUMOTLARI */}
              <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border-2 border-purple-500/30 rounded-2xl p-5 mb-6">
                <h3 className={robinDayClass === "I" ? "text-blue-400 font-bold mb-3" : robinDayClass === "II" ? "text-yellow-400 font-bold mb-3" : "text-red-400 font-bold mb-3"}>
                  {currentClass.name}
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Tavsif:</strong> {currentClass.description}</p>
                  <p>• <strong className="text-white">Elektronik bog'lanish:</strong> {currentClass.electronicCoupling}</p>
                  <p>• <strong className="text-white">IVCT:</strong> {currentClass.ivct}</p>
                  <p>• <strong className="text-white">Misollar:</strong> {currentClass.examples}</p>
                  <p>• <strong className="text-white">Rang:</strong> {currentClass.color}</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-5">
                <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Nima uchun Creutz-Taube Class II?
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Hab ≈ 500-1000 cm⁻¹:</strong> o'rta elektronik bog'lanish</p>
                  <p>• <strong className="text-white">IVCT cho'qqisi:</strong> NIR sohada (1000-1500 nm)</p>
                  <p>• <strong className="text-white">Qisman delokalizatsiya:</strong> elektron ikkala Ru da mavjud, lekin to'liq emas</p>
                  <p className="text-xs text-purple-400 mt-2">
                    <strong className="text-yellow-300">Muhim:</strong> Creutz-Taube ioni Class II va Class III 
                    <strong className="text-white"> chegarasida</strong> joylashgan — ba'zi sharoitlarda Class III xususiyatlari ham kuzatiladi.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* COLOR TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "color" && (
          <>
            <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">
                  🎨
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Rang mexanizmi — IVCT</h2>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-2 border-blue-500/30 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-blue-400">Creutz-Taube ioni</strong>ning 
                  <strong className="text-yellow-300"> to'q ko'k-binafsha rangi</strong> — bu 
                  <strong className="text-white"> IVCT (Intervalence Charge Transfer)</strong> hodisasi tufayli.
                  Ru²⁺ va Ru³⁺ o'rtasida <strong className="text-pink-300">elektron ko'chishi</strong> sodir bo'ladi,
                  bu esa <strong className="text-white">NIR (near-infrared) sohada</strong> yorug'likni yutadi.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-950/50 rounded-xl p-5 border border-blue-700/30">
                  <h3 className="text-blue-400 font-bold mb-3">🔵 IVCT mexanizmi</h3>
                  <div className="bg-blue-900/40 rounded-lg p-4 font-mono text-xs text-blue-200 border border-blue-700/30 mb-3">
                    <pre className="whitespace-pre">{`  Ru²⁺ + Ru³⁺ + hν → Ru³⁺ + Ru²⁺
  
  Elektron ko'chishi:
  Ru²⁺ (d⁶) → Ru³⁺ (d⁵)
  
  Yorug'lik yutiladi (1000-1500 nm)`}</pre>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Ru²⁺ dan Ru³⁺ ga:</strong> elektron ko'chadi</p>
                    <p>• <strong className="text-white">Energiya:</strong> ~6,700-10,000 cm⁻¹ (1000-1500 nm)</p>
                    <p>• <strong className="text-white">Yutilish:</strong> NIR (near-infrared)</p>
                    <p>• <strong className="text-blue-300">Natija:</strong> to'q ko'k-binafsha rang</p>
                  </div>
                </div>

                <div className="bg-indigo-950/50 rounded-xl p-5 border border-indigo-700/30">
                  <h3 className="text-indigo-400 font-bold mb-3">🎨 Nima uchun to'q ko'k?</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">IVCT cho'qqisi:</strong> 1000-1500 nm (NIR)</p>
                    <p>• <strong className="text-white">Qo'shimcha cho'qqilar:</strong> ko'rinadigan sohada</p>
                    <p>• <strong className="text-white">Yutilish:</strong> qizil-sariq nur</p>
                    <p>• <strong className="text-white">Ko'rinadigan rang:</strong> to'q ko'k-binafsha</p>
                    <p className="text-xs text-indigo-300 mt-2">
                      <strong className="text-yellow-300">Muhim:</strong> IVCT — bu 
                      <strong className="text-white"> juda keng cho'qqi</strong>, shuning uchun rang 
                      <strong className="text-pink-300"> to'q</strong> va <strong className="text-white">intensiv</strong>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-5">
                <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Hush teoriyasi (Hush theory)
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Hush teoriyasi:</strong> IVCT cho'qqisining xususiyatlarini tushuntiradi</p>
                  <p>• <strong className="text-white">Hab (elektronik bog'lanish):</strong> cho'qqi kengligidan hisoblanadi</p>
                  <p>• <strong className="text-white">λ<sub>max</sub>:</strong> 1000-1500 nm (NIR)</p>
                  <p>• <strong className="text-white">ε (molyar ekstinksiya):</strong> ~5000-10,000 L·mol⁻¹·cm⁻¹</p>
                  <p className="text-xs text-purple-400 mt-2">
                    <strong className="text-yellow-300">Natija:</strong> Hab ≈ 500-1000 cm⁻¹ — bu 
                    <strong className="text-pink-300"> Class II</strong> mixed-valence ni tasdiqlaydi.
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
            <div className="bg-gradient-to-br from-cyan-900/40 to-teal-900/40 border border-cyan-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-xl shadow-lg shadow-cyan-500/30">
                  🔗
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Pirazin ko'prigi bog'lanishi</h2>
              </div>
              
              <div className="bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border-2 border-cyan-500/30 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-cyan-400">Pirazin (pyz)</strong> — bu 
                  <strong className="text-white"> ko'prikli ligand</strong>. U ikkita ruteniy atomini 
                  <strong className="text-yellow-300"> bir vaqtda</strong> bog'laydi:
                  <strong className="text-blue-300"> Ru²⁺−N≡C−C≡N−Ru³⁺</strong>.
                  Pirazinning <strong className="text-pink-300">π-sistemasi</strong> orqali elektron delokalizatsiyasi sodir bo'ladi.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-cyan-950/50 rounded-xl p-5 border border-cyan-700/30">
                  <h3 className="text-cyan-400 font-bold mb-3">🔗 Ru²⁺−N(pyz) bog'lanishi</h3>
                  <div className="bg-cyan-900/40 rounded-lg p-4 font-mono text-xs text-cyan-200 border border-cyan-700/30 mb-3">
                    <pre className="whitespace-pre">{`  Ru²⁺ ← N(pyz)
  
  σ-donatsiya: N → Ru²⁺
  π-backbonding: Ru²⁺ → N (kuchli)
  
  Kuchli bog' (~2.05 Å)`}</pre>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Ru²⁺−N masofa:</strong> ~2.05 Å</p>
                    <p>• <strong className="text-white">Bog' turi:</strong> σ + π</p>
                    <p>• <strong className="text-white">Bog' kuchi:</strong> kuchli (Ru²⁺ kuchli π-donor)</p>
                  </div>
                </div>

                <div className="bg-teal-950/50 rounded-xl p-5 border border-teal-700/30">
                  <h3 className="text-teal-400 font-bold mb-3">🔗 Ru³⁺−N(pyz) bog'lanishi</h3>
                  <div className="bg-teal-900/40 rounded-lg p-4 font-mono text-xs text-teal-200 border border-teal-700/30 mb-3">
                    <pre className="whitespace-pre">{`  Ru³⁺ ← N(pyz)
  
  σ-donatsiya: N → Ru³⁺
  π-backbonding: Ru³⁺ → N (kuchsiz)
  
  O'rta bog' (~2.05 Å)`}</pre>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p>• <strong className="text-white">Ru³⁺−N masofa:</strong> ~2.05 Å</p>
                    <p>• <strong className="text-white">Bog' turi:</strong> asosan σ</p>
                    <p>• <strong className="text-white">Bog' kuchi:</strong> o'rta (Ru³⁺ kuchsiz π-donor)</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-5">
                <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Pirazin π-sistemasi
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Pirazin:</strong> C₄H₄N₂ (aromatik halqa, 6 π-elektron)</p>
                  <p>• <strong className="text-white">π-delokalizatsiya:</strong> elektronlar halqa bo'ylab tarqalgan</p>
                  <p>• <strong className="text-white">Ko'prik vazifasi:</strong> ikkala Ru atomiga bog'lanadi</p>
                  <p>• <strong className="text-yellow-300">Natija:</strong> Ru²⁺ va Ru³⁺ o'rtasida elektron ko'chishi mumkin</p>
                  <p className="text-xs text-purple-400 mt-2">
                    Bu <strong className="text-pink-300">elektron delokalizatsiyasi</strong> — 
                    <strong className="text-white"> mixed-valence</strong> xususiyatining asosiy sababi.
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
                  <h3 className="text-green-400 font-bold mb-3">🌈 UV-Vis-NIR spektroskopiya</h3>
                  <div className="space-y-2 text-sm text-purple-200">
                    <div className="bg-green-900/40 rounded-lg p-3 border border-green-700/30">
                      <p className="text-green-300 font-bold text-xs mb-1">IVCT cho'qqisi</p>
                      <p className="text-xs">λ<sub>max</sub> = 1000-1500 nm (NIR)</p>
                      <p className="text-xs text-green-300">ε ≈ 5000-10,000 L·mol⁻¹·cm⁻¹</p>
                    </div>
                    <div className="bg-emerald-900/40 rounded-lg p-3 border border-emerald-700/30">
                      <p className="text-emerald-300 font-bold text-xs mb-1">LMCT cho'qqisi</p>
                      <p className="text-xs">λ<sub>max</sub> = 400-500 nm (ko'rinadigan)</p>
                      <p className="text-xs text-emerald-300">ε ≈ 2000-3000 L·mol⁻¹·cm⁻¹</p>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-950/50 rounded-xl p-5 border border-emerald-700/30">
                  <h3 className="text-emerald-400 font-bold mb-3">📡 IR spektroskopiya</h3>
                  <div className="space-y-2">
                    {[
                      { freq: "3300-3200 cm⁻¹", bond: "ν(N−H)", desc: "NH₃ valent tebranish", intensity: "Kuchli" },
                      { freq: "1600 cm⁻¹", bond: "ν(C=C)", desc: "Pirazin C=C (aromatik)", intensity: "Kuchli" },
                      { freq: "1400 cm⁻¹", bond: "ν(C=N)", desc: "Pirazin C=N", intensity: "Kuchli" },
                      { freq: "500-400 cm⁻¹", bond: "ν(Ru−N)", desc: "Ru-N valent tebranish", intensity: "O'rta" },
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

              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-5">
                <h3 className="text-green-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> IVCT cho'qqisining ahamiyati
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">IVCT:</strong> Intervalence Charge Transfer — Ru²⁺ ↔ Ru³⁺ elektron ko'chishi</p>
                  <p>• <strong className="text-white">λ<sub>max</sub> = 1000-1500 nm:</strong> NIR (near-infrared) soha</p>
                  <p>• <strong className="text-white">Keng cho'qqi:</strong> Δν₁/₂ ≈ 3000-5000 cm⁻¹</p>
                  <p>• <strong className="text-yellow-300">Hab hisoblash:</strong> cho'qqi kengligidan elektronik bog'lanish hisoblanadi</p>
                  <p className="text-xs text-purple-400 mt-2">
                    <strong className="text-pink-300">Natija:</strong> Hab ≈ 500-1000 cm⁻¹ — bu 
                    <strong className="text-white"> Class II</strong> mixed-valence ni tasdiqlaydi.
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
                  <h3 className="text-amber-400 font-bold mb-3">🔬 Ilmiy qo'llanilish</h3>
                  <div className="space-y-3 text-sm text-purple-200">
                    <div className="bg-amber-900/40 rounded-lg p-3 border border-amber-700/30">
                      <p className="text-amber-300 font-bold text-xs mb-1">Mixed-valence modeli</p>
                      <p className="text-xs">Elektron delokalizatsiyasini o'rganish uchun klassik model</p>
                    </div>
                    <div className="bg-amber-900/40 rounded-lg p-3 border border-amber-700/30">
                      <p className="text-amber-300 font-bold text-xs mb-1">Robin-Day tasnifi</p>
                      <p className="text-xs">Class II/III chegarasini o'rganish</p>
                    </div>
                    <div className="bg-amber-900/40 rounded-lg p-3 border border-amber-700/30">
                      <p className="text-amber-300 font-bold text-xs mb-1">Elektron ko'chishi</p>
                      <p className="text-xs">IVCT mexanizmini tushuntirish</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-950/50 rounded-xl p-5 border border-orange-700/30">
                  <h3 className="text-orange-400 font-bold mb-3">⚗️ Sanoat qo'llanilish</h3>
                  <div className="space-y-3 text-sm text-purple-200">
                    <div className="bg-orange-900/40 rounded-lg p-3 border border-orange-700/30">
                      <p className="text-orange-300 font-bold text-xs mb-1">Molekulyar elektronika</p>
                      <p className="text-xs">Molekulyar switchlar va transistorlar</p>
                    </div>
                    <div className="bg-orange-900/40 rounded-lg p-3 border border-orange-700/30">
                      <p className="text-orange-300 font-bold text-xs mb-1">Kataliz</p>
                      <p className="text-xs">Redoks katalizatorlar</p>
                    </div>
                    <div className="bg-orange-900/40 rounded-lg p-3 border border-orange-700/30">
                      <p className="text-orange-300 font-bold text-xs mb-1">Sensorlar</p>
                      <p className="text-xs">Kimyoviy sensorlar</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-5">
                <h3 className="text-amber-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Nima uchun Creutz-Taube muhim?
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Birinchi mixed-valence:</strong> Creutz & Taube 1969 yilda birinchi marta sintez qildi</p>
                  <p>• <strong className="text-white">Model kompleksi:</strong> mixed-valence kimyosining asosini qo'ydi</p>
                  <p>• <strong className="text-white">Robin-Day tasnifi:</strong> Class II/III chegarasini aniqlash</p>
                  <p className="text-xs text-purple-400 mt-2">
                    <strong className="text-yellow-300">Qiziq fakt:</strong> Creutz-Taube ioni — bu 
                    <strong className="text-pink-300"> eng ko'p o'rganilgan</strong> mixed-valence kompleks!
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
                  <h3 className="text-green-400 font-bold mb-3">1-usul: Creutz & Taube usuli (1969)</h3>
                  <div className="bg-green-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-green-300 border border-green-700/30">
                    <p>[(NH₃)₅Ru(H₂O)]²⁺ + [(NH₃)₅Ru(pyz)]²⁺ → [(NH₃)₅Ru(pyz)Ru(NH₃)₅]⁴⁺</p>
                    <p className="mt-2">[(NH₃)₅Ru(pyz)Ru(NH₃)₅]⁴⁺ + Ag⁺ → [(NH₃)₅Ru(pyz)Ru(NH₃)₅]⁵⁺ + Ag⁰</p>
                    <p className="text-green-300 text-xs mt-2">Suvli eritma, xona harorati, Ag⁺ oksidlovchi</p>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Mexanizm:</strong> Ru²⁺ + Ru³⁺ → Ru²⁺−pyz−Ru³⁺ (dimer)</p>
                    <p><strong className="text-white">Oksidlanish:</strong> Ag⁺ yordamida 4⁺ → 5⁺</p>
                    <p><strong className="text-white">Vaqt:</strong> Bir necha soat</p>
                    <p><strong className="text-white">Hosildorlik:</strong> 70-80%</p>
                  </div>
                </div>

                <div className="bg-green-950/50 rounded-2xl p-5 border border-green-700/30">
                  <h3 className="text-green-400 font-bold mb-3">2-usul: Zamonaviy sintez</h3>
                  <div className="bg-green-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-green-300 border border-green-700/30">
                    <p>[(NH₃)₅RuCl]²⁺ + pyz → [(NH₃)₅Ru(pyz)]³⁺</p>
                    <p className="mt-2">[(NH₃)₅Ru(pyz)]³⁺ + [(NH₃)₅Ru(H₂O)]²⁺ → [(NH₃)₅Ru(pyz)Ru(NH₃)₅]⁵⁺</p>
                    <p className="text-green-300 text-xs mt-2">Tezroq reaksiya, yuqori hosildorlik</p>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Afzalligi:</strong> Tezroq, toza mahsulot</p>
                    <p><strong className="text-white">Hosildorlik:</strong> 85-90%</p>
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Creutz & Taube kashfiyoti (1969)</h2>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-2xl p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-yellow-600 to-amber-600 flex items-center justify-center text-6xl flex-shrink-0 shadow-2xl">
                    👨‍🔬
                  </div>
                  <div className="flex-1">
                    <h3 className="text-yellow-400 font-bold text-xl mb-2">Carol Creutz & Henry Taube</h3>
                    <p className="text-purple-200 text-sm mb-3 leading-relaxed">
                      <strong className="text-yellow-300">1969 yilda</strong> Carol Creutz va Henry Taube 
                      <strong className="text-white"> birinchi marta</strong> [(NH₃)₅Ru(pyz)Ru(NH₃)₅]⁵⁺ ni sintez qildi.
                      Bu <strong className="text-pink-300">mixed-valence kimyosining</strong> asosini qo'ydi va 
                      <strong className="text-white"> Robin-Day tasnifi</strong>ni eksperimental tasdiqladi.
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-xs text-yellow-300 font-semibold">
                        📜 1969 yil
                      </span>
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-xs text-amber-300 font-semibold">
                        📍 Stanford University
                      </span>
                      <span className="px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-xs text-orange-300 font-semibold">
                        ⚛️ Mixed-valence klassikasi
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { year: "1968", title: "Robin-Day tasnifi", desc: "Robin va Day mixed-valence komplekslarni uchta sinfga ajratdi (Class I, II, III)" },
                  { year: "1969", title: "Creutz & Taube kashfiyoti", desc: "Birinchi marta [(NH₃)₅Ru(pyz)Ru(NH₃)₅]⁵⁺ sintez qilindi" },
                  { year: "1970+", title: "Spektroskopik tahlil", desc: "IVCT cho'qqisi aniqlandi (1000-1500 nm)" },
                  { year: "1980+", title: "Hush teoriyasi", desc: "Noel Hush IVCT cho'qqisining xususiyatlarini tushuntirdi" },
                  { year: "1990+", title: "Zamonaviy tadqiqotlar", desc: "Molekulyar elektronika va katalizda qo'llanilish" },
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
                  <span>💡</span> Nima uchun Creutz-Taube ioni kimyo tarixida muhim?
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Birinchi mixed-valence:</strong> Creutz & Taube birinchi marta sintez qildi</p>
                  <p>• <strong className="text-white">Robin-Day tasnifi:</strong> Class II/III chegarasini aniqlash</p>
                  <p>• <strong className="text-white">IVCT:</strong> Intervalence Charge Transfer mexanizmini tushuntirish</p>
                  <p>• <strong className="text-white">Model kompleksi:</strong> mixed-valence kimyosining asosini qo'ydi</p>
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
              href="/ilmiy/birikmares/prussian-blue"
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold transition-all flex items-center gap-2"
            >
              <span>←</span>
              <span className="hidden sm:inline">Prussian Blue</span>
            </Link>
            <Link 
              href="/ilmiy/birikmares/wilkinson-katalizatori"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 text-white font-bold transition-all shadow-lg shadow-indigo-500/30 flex items-center gap-2"
            >
              <span className="hidden sm:inline">Wilkinson katalizatori</span>
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