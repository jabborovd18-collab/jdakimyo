"use client"

import Link from "next/link"
import { useState } from "react"

export default function TransPtNH32Cl2() {
  const [activeTab, setActiveTab] = useState("overview")

  const tabs = [
    { id: "overview", label: "📋 Umumiy", icon: "📋" },
    { id: "whyNotActive", label: "❓ Nega faol emas?", icon: "❓" },
    { id: "isomers", label: "🔄 Sis-trans taqqoslash", icon: "🔄" },
    { id: "structure", label: "🧬 Tuzilish (D₂ₕ)", icon: "🧬" },
    { id: "electronic", label: "⚛️ Elektron (d⁸)", icon: "⚛️" },
    { id: "spectroscopy", label: "🔬 Spektroskopiya", icon: "🔬" },
    { id: "transEffect", label: "↔️ Trans-effekt", icon: "↔️" },
    { id: "synthesis", label: "⚗️ Sintez", icon: "⚗️" },
    { id: "history", label: "🏆 Tarix", icon: "🏆" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white relative overflow-hidden">
      
      {/* ═══ ANIMATED BACKGROUND ═══ */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(16,185,129,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        {['Pt²⁺', 'd⁸', 'D₂ₕ', 'transplatin', 'μ=0', 'faol emas', 'interstrand', 'Peyrone 1844'].map((sym, i) => (
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
      <header className="relative z-20 border-b border-white/5 backdrop-blur-xl bg-purple-950/80 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <nav className="flex items-center gap-2 text-xs mb-3 text-purple-400 flex-wrap">
            <Link href="/" className="hover:text-purple-300 transition-colors">🏠 Bosh sahifa</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy" className="hover:text-purple-300 transition-colors">Ilmiy bo'lim</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/birikmalar" className="hover:text-purple-300 transition-colors">Birikmalar bazasi</Link>
            <span className="text-purple-600">›</span>
            <span className="text-emerald-400 font-semibold">trans-[Pt(NH₃)₂Cl₂]</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
                  🧬 Struktur-faoliyat klassikasi
                </span>
                <span className="px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-[10px] text-red-300 font-semibold">
                  ❌ Saraton dori EMAS
                </span>
                <span className="px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-[10px] text-purple-300 font-semibold">
                  ⚛️ d⁸ kvadrat-tekis
                </span>
                <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-[10px] text-indigo-300 font-semibold">
                  📜 Peyrone 1844
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-300 bg-clip-text text-transparent">
                trans-[Pt(NH₃)₂Cl₂]
              </h1>
              <p className="text-purple-300 text-sm mt-1">
                Transplatin • trans-Diammindixloroplatina(II) • Transplatin
              </p>
            </div>
            
            <div className="flex gap-2">
              <Link 
                href="/ilmiy/birikmalar/cis-pt-nh3-2-cl2"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 hover:border-yellow-400/60 text-yellow-300 text-sm font-semibold transition-all flex items-center gap-2"
              >
                <span>💛</span>
                <span className="hidden sm:inline">Sisplatinsaraton dori</span>
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
            { label: "Formula", value: "trans-[Pt(NH₃)₂Cl₂]", icon: "🧪", color: "text-emerald-400" },
            { label: "M massa", value: "300.05 g/mol", icon: "⚖️", color: "text-blue-400" },
            { label: "Geometriya", value: "Kvadrat-tekis", icon: "💎", color: "text-purple-400" },
            { label: "Kompleks rangi", value: "Sariq", icon: "🎨", color: "text-yellow-400" },
            { label: "Dipol moment", value: "μ = 0", icon: "⚡", color: "text-pink-400" },
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
            <div className="bg-gradient-to-br from-purple-900/40 to-emerald-900/40 border border-emerald-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-xl shadow-lg shadow-emerald-500/30">
                  📋
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Asosiy ma'lumotlar — Transplatin</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  ["CAS raqami", "14913-33-8"],
                  ["Zichlik", "3.82 g/cm³"],
                  ["Sistema", "Monoklinik"],
                  ["Fazoviy guruh", "P2₁/n"],
                  ["Eruvchanlik (H₂O)", "0.25 mg/mL (25°C)"],
                  ["Eruvchanlik (DMSO)", "Yaxshi eriydi"],
                  ["Barqarorlik", "Yuqori (inert)"],
                  ["Rangi", "Sariq"],
                ].map((item, i) => (
                  <div key={i} className="bg-emerald-950/50 rounded-xl p-3 border border-emerald-700/30">
                    <div className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold mb-1">{item[0]}</div>
                    <div className="text-white font-semibold text-sm">{item[1]}</div>
                  </div>
                ))}
              </div>

              {/* NEYTRAL KOMPLEKS */}
              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-5">
                <h3 className="text-emerald-400 font-bold mb-3 flex items-center gap-2">
                  <span>💎</span> Neytral kompleks — sisplatinning egizagi
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-emerald-900/30 rounded-xl p-4 border border-emerald-700/30">
                    <h4 className="text-emerald-300 font-bold text-sm mb-2">🔒 Kompleks [Pt(NH₃)₂Cl₂]</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-white">Pt²⁺</strong> — markaziy ion (5d⁸)</li>
                      <li>• <strong className="text-white">2 × NH₃</strong> — ammiak ligandlari</li>
                      <li>• <strong className="text-white">2 × Cl⁻</strong> — <span className="text-emerald-300">qarama-qarshi (180°)</span></li>
                      <li>• <strong className="text-yellow-300">Zaryad:</strong> +2 + 0 + 2×(−1) = <strong>0</strong></li>
                      <li>• <strong className="text-pink-300">Neytral kompleks</strong> — tashqi sfera yo'q!</li>
                      <li>• <strong className="text-white">Koordinatsion son:</strong> 4</li>
                    </ul>
                  </div>
                  <div className="bg-red-900/30 rounded-xl p-4 border border-red-700/30">
                    <h4 className="text-red-300 font-bold text-sm mb-2">❌ Tibbiy faolligi</h4>
                    <ul className="text-purple-200 text-xs space-y-1">
                      <li>• <strong className="text-red-300">Saraton dori EMAS</strong></li>
                      <li>• <strong className="text-white">Sabab:</strong> DNA bilan samarali bog'lana olmaydi</li>
                      <li>• <strong className="text-white">Bog'lanish turi:</strong> interstrand crosslink (samarasiz)</li>
                      <li>• <strong className="text-white">DNA egilmaydi:</strong> replikatsiya to'xtamaydi</li>
                      <li>• <strong className="text-white">Qo'llanilishi:</strong> Faqat tadqiqotlar uchun</li>
                      <li>• <strong className="text-white">Sisplatin bilan:</strong> bir xil formula, boshqa faollik</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* XULOSA */}
            <div className="bg-gradient-to-r from-emerald-600/10 via-teal-600/10 to-cyan-600/10 border border-emerald-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>✅</span> Asosiy xulosalar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "💎 <strong>Kvadrat-tekis:</strong> Pt²⁺ (5d⁸) uchun xarakterli geometriya",
                  "⚛️ <strong>dsp² gibridlanish:</strong> 4 ta orbital (1 d + 1 s + 2 p)",
                  "📐 <strong>D₂ₕ simmetriya:</strong> σₕ tekislik va i markazi bor → <strong>axiral</strong>",
                  "⚡ <strong>Dipol moment = 0:</strong> qutbsiz molekula (sis da μ &gt; 0)",
                  "❌ <strong>Saratonga qarshi faol emas:</strong> DNA bilan samarali crosslink hosil qilmaydi",
                  "↔️ <strong>Struktur-faoliyat:</strong> kimyoning eng chiroyli misoli — bir formula, ikki xil ta'sir",
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
        {/* WHY NOT ACTIVE TAB */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === "whyNotActive" && (
          <>
            <div className="bg-gradient-to-br from-red-900/40 to-emerald-900/40 border border-red-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-emerald-500 flex items-center justify-center text-xl shadow-lg shadow-red-500/30">
                  ❓
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Nega transplatin saraton dori emas?</h2>
              </div>
              
              <div className="bg-gradient-to-r from-red-500/10 to-emerald-500/10 border border-red-500/20 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  Bu kimyo tarixidagi <strong className="text-emerald-400">eng chiroyli struktur-faoliyat bog'liqligi</strong> 
                  misollaridan biri. Ikkala izomer <strong className="text-white">bir xil formula</strong>ga, 
                  <strong className="text-white"> bir xil massa</strong>ga, <strong className="text-white">bir xil bog' uzunliklari</strong>ga ega — 
                  lekin <strong className="text-yellow-300">butunlay boshqa biologik faollik</strong>ka ega!
                </p>
              </div>

              {/* ASOSIY SABAB */}
              <div className="bg-red-950/50 rounded-2xl p-5 border border-red-700/30 mb-6">
                <h3 className="text-red-400 font-bold mb-3">🎯 Asosiy sabab: DNA bilan bog'lanish geometriyasi</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-yellow-900/30 rounded-xl p-4 border border-yellow-700/30">
                    <h4 className="text-yellow-300 font-bold text-sm mb-2">💛 cis-izomer (FAOL)</h4>
                    <div className="space-y-2 text-xs text-purple-200">
                      <p>• <strong className="text-white">2 ta Cl⁻ yonma-yon</strong> (90°)</p>
                      <p>• Aquationdan keyin <strong className="text-white">2 ta H₂O yonma-yon</strong></p>
                      <p>• Ikkala Pt−O bog' <strong className="text-yellow-300">qo'shni guaninlar</strong> bilan bog'lanadi</p>
                      <p>• <strong className="text-green-400">1,2-intrastrand crosslink</strong> hosil bo'ladi</p>
                      <p>• DNA <strong className="text-pink-300">30-40° ga egiladi</strong></p>
                      <p>• HMG-domain oqsillari tanib oladi</p>
                      <p>• <strong className="text-green-400">Replikatsiya to'xtaydi</strong> → apoptoz</p>
                    </div>
                  </div>

                  <div className="bg-red-900/30 rounded-xl p-4 border-2 border-red-500/30">
                    <h4 className="text-red-300 font-bold text-sm mb-2">💚 trans-izomer (FAOL EMAS) ← Siz</h4>
                    <div className="space-y-2 text-xs text-purple-200">
                      <p>• <strong className="text-white">2 ta Cl⁻ qarama-qarshi</strong> (180°)</p>
                      <p>• Aquationdan keyin <strong className="text-white">2 ta H₂O qarama-qarshi</strong></p>
                      <p>• Ikkala Pt−O bog' <strong className="text-red-300">qo'shni guaninlar bilan bog'lana olmaydi</strong></p>
                      <p>• Faqat <strong className="text-red-300">interstrand crosslink</strong> (ikki zanjir orasida)</p>
                      <p>• DNA <strong className="text-red-300">egilmaydi</strong></p>
                      <p>• HMG-domain oqsillari tanib olmaydi</p>
                      <p>• <strong className="text-red-300">Replikatsiya davom etadi</strong> → hujayra o'lmaydi</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* VIZUAL TAQQOSLASH */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
                  <h3 className="text-yellow-400 font-bold mb-3">💛 Sisplatin DNA bilan</h3>
                  <div className="bg-yellow-950/50 rounded-lg p-3 font-mono text-xs text-yellow-200 border border-yellow-700/30">
                    <pre className="whitespace-pre">{`       G—G   ← qo'shni guaninlar
       |  |
       Pt—(NH₃)₂
       
   1,2-intrastrand crosslink
   DNA 30-40° ga egiladi
   ✓ Replikatsiya to'xtaydi`}</pre>
                  </div>
                </div>

                <div className="bg-purple-950/50 rounded-xl p-5 border-2 border-red-500/30">
                  <h3 className="text-emerald-400 font-bold mb-3">💚 Transplatin DNA bilan</h3>
                  <div className="bg-emerald-950/50 rounded-lg p-3 font-mono text-xs text-emerald-200 border border-emerald-700/30">
                    <pre className="whitespace-pre">{`   G ····· G   ← uzoq guaninlar
   |       |
   (NH₃)₂—Pt
       (trans)
       
   Interstrand crosslink
   DNA egilmaydi
   ✗ Replikatsiya davom etadi`}</pre>
                  </div>
                </div>
              </div>
            </div>

            {/* QO'SHIMCHA SABABLAR */}
            <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">
                  🔬
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Qo'shimcha sabablar</h2>
              </div>
              
              <div className="space-y-3">
                {[
                  { title: "1. Kinetik sabab", desc: "Trans-izomerda aquation (Cl⁻ ning H₂O bilan almashinishi) sekinroq boradi", icon: "⏱️" },
                  { title: "2. Termodinamik sabab", desc: "Interstrand crosslink energetik jihatdan noqulay (ko'p energiya talab qiladi)", icon: "⚡" },
                  { title: "3. Sterik sabab", desc: "Trans-izomerda 2 ta NH₃ guruhi qo'shni joylashgan, DNA minor groove'ga kirish qiyin", icon: "📐" },
                  { title: "4. Biologik sabab", desc: "HMG-domain oqsillari (High Mobility Group) faqat cis-izomerning egilgan DNA'sini tanib oladi", icon: "🧬" },
                  { title: "5. Hujayra javobi", desc: "Cisplatin-DNA addukti apoptoz signalini ishga tushiradi, transplatin-DNA addukti esa yo'q", icon: "🎯" },
                ].map((item, i) => (
                  <div key={i} className="bg-blue-950/50 rounded-xl p-4 border border-blue-700/30 flex items-start gap-3">
                    <div className="text-2xl flex-shrink-0">{item.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-blue-300 font-bold text-sm">{item.title}</h3>
                      <p className="text-purple-200 text-xs mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AMALIY AHAMIYATI */}
            <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  💡
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Nima uchun transplatin muhim?</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: "🎓 Ta'limda", desc: "Struktur-faoliyat bog'liqligini tushuntirish uchun eng yaxshi misol" },
                  { title: "🔬 Tadqiqotlarda", desc: "Nazorat namunasi sifatida — sisplatinning ta'sirini solishtirish uchun" },
                  { title: "💊 Dori dizaynida", desc: "Qanday geometriya kerakligini ko'rsatadi — dori dizaynining asosi" },
                  { title: "🧬 Molekulyar biologiya", desc: "DNA-protein o'zaro ta'sirini o'rganishda model sifatida" },
                ].map((item, i) => (
                  <div key={i} className="bg-purple-950/50 rounded-xl p-4 border border-purple-700/30">
                    <h3 className="text-purple-300 font-bold text-sm mb-2">{item.title}</h3>
                    <p className="text-purple-200 text-xs">{item.desc}</p>
                  </div>
                ))}
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Sisplatin vs Transplatin — to'liq taqqoslash</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* CIS */}
                <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 rounded-2xl p-6 border border-yellow-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-2xl shadow-lg">
                      💛
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-yellow-300">cis-[Pt(NH₃)₂Cl₂]</h3>
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
                </div>

                {/* TRANS */}
                <div className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 rounded-2xl p-6 border-2 border-emerald-500/40">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-2xl shadow-lg">
                      💚
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-emerald-300">trans-[Pt(NH₃)₂Cl₂] ← Siz</h3>
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
                </div>
              </div>

              {/* TAQQOSLASH JADVALI */}
              <div className="overflow-x-auto">
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
                      <td className="py-3 px-4">CAS raqami</td>
                      <td className="py-3 px-4 font-mono text-xs">15663-27-1</td>
                      <td className="py-3 px-4 font-mono text-xs">14913-33-8</td>
                    </tr>
                    <tr className="border-b border-purple-800/30">
                      <td className="py-3 px-4">Molekulyar massa</td>
                      <td className="py-3 px-4 font-mono">300.05</td>
                      <td className="py-3 px-4 font-mono">300.05</td>
                    </tr>
                    <tr className="border-b border-purple-800/30">
                      <td className="py-3 px-4">Cl−Pt−Cl burchak</td>
                      <td className="py-3 px-4 font-mono">90°</td>
                      <td className="py-3 px-4 font-mono">180°</td>
                    </tr>
                    <tr className="border-b border-purple-800/30">
                      <td className="py-3 px-4">Nuqtali guruh</td>
                      <td className="py-3 px-4 font-mono">C₂ᵥ</td>
                      <td className="py-3 px-4 font-mono font-bold">D₂ₕ</td>
                    </tr>
                    <tr className="border-b border-purple-800/30">
                      <td className="py-3 px-4">Dipol moment</td>
                      <td className="py-3 px-4">μ &gt; 0 (qutbli)</td>
                      <td className="py-3 px-4 font-bold">μ = 0 (qutbsiz)</td>
                    </tr>
                    <tr className="border-b border-purple-800/30">
                      <td className="py-3 px-4">Eruvchanlik (H₂O)</td>
                      <td className="py-3 px-4">1 mg/mL</td>
                      <td className="py-3 px-4">0.25 mg/mL</td>
                    </tr>
                    <tr className="border-b border-purple-800/30">
                      <td className="py-3 px-4">Pt−N masofa</td>
                      <td className="py-3 px-4 font-mono">2.05 Å</td>
                      <td className="py-3 px-4 font-mono">2.05 Å</td>
                    </tr>
                    <tr className="border-b border-purple-800/30">
                      <td className="py-3 px-4">Pt−Cl masofa</td>
                      <td className="py-3 px-4 font-mono">2.32 Å</td>
                      <td className="py-3 px-4 font-mono">2.32 Å</td>
                    </tr>
                    <tr className="border-b border-purple-800/30">
                      <td className="py-3 px-4">DNA bog'lanish turi</td>
                      <td className="py-3 px-4 text-green-400">1,2-intrastrand</td>
                      <td className="py-3 px-4 text-red-400">Interstrand</td>
                    </tr>
                    <tr className="border-b border-purple-800/30">
                      <td className="py-3 px-4">DNA egilishi</td>
                      <td className="py-3 px-4">30-40°</td>
                      <td className="py-3 px-4">Deyarli yo'q</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold">Saraton faolligi</td>
                      <td className="py-3 px-4 text-green-400 font-bold">✓ FAOL</td>
                      <td className="py-3 px-4 text-red-400 font-bold">✗ FAOL EMAS</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/10 to-emerald-500/10 border border-yellow-500/20 rounded-2xl p-5 mt-6">
                <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Diqqatga sazovor
                </h3>
                <p className="text-purple-200 text-sm">
                  <strong className="text-white">Bog' uzunliklari deyarli bir xil!</strong> 
                  Pt−N va Pt−Cl masofalari ikkala izomerda ham bir xil. 
                  Farq faqat <strong className="text-yellow-300">geometriyada</strong> (90° vs 180°) — 
                  va bu kichik farq <strong className="text-pink-300">butunlay boshqa biologik faollik</strong>ka olib keladi.
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
            <div className="bg-gradient-to-br from-purple-900/40 to-emerald-900/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-emerald-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  💎
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Kvadrat-tekis geometriya va D₂ₕ simmetriya</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-purple-400 font-bold text-sm uppercase tracking-wider">Geometrik parametrlar</h3>
                  <div className="space-y-2">
                    {[
                      ["Geometriya", "Kvadrat-tekis (square planar)"],
                      ["Nuqtali guruh", "D₂ₕ (trans)"],
                      ["Pt−N masofa", "2.05 Å (2 ta)"],
                      ["Pt−Cl masofa", "2.32 Å (2 ta)"],
                      ["N−Pt−N burchak", "180° (qarama-qarshi)"],
                      ["Cl−Pt−Cl burchak", "180° (qarama-qarshi)"],
                      ["N−Pt−Cl burchak", "90° (yonma-yon)"],
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
                  <h3 className="text-emerald-400 font-bold text-sm uppercase tracking-wider">D₂ₕ simmetriya elementlari</h3>
                  <div className="space-y-2">
                    {[
                      ["E", "Ayniylik"],
                      ["C₂(z)", "Asosiy o'q (molekula tekisligiga perpendikulyar)"],
                      ["C₂(y)", "N-Pt-N bo'ylab"],
                      ["C₂(x)", "Cl-Pt-Cl bo'ylab"],
                      ["i", "Inversiya markazi (Pt da)"],
                      ["σ(xy)", "Molekula tekisligi (gorizontal)"],
                      ["σ(xz)", "Cl-Pt-Cl orqali vertikal"],
                      ["σ(yz)", "N-Pt-N orqali vertikal"],
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-1.5 border-b border-emerald-800/30">
                        <span className="text-emerald-300 text-sm font-mono font-bold">{item[0]}</span>
                        <span className="text-purple-200 text-xs">{item[1]}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-emerald-950/50 rounded-xl p-3 border border-emerald-700/30 mt-3">
                    <p className="text-emerald-200 text-xs">
                      <strong className="text-emerald-400">Jami:</strong> 8 ta simmetriya operatsiyasi.
                      <strong className="text-red-300"> σₕ va i mavjud</strong> — shuning uchun <strong className="text-yellow-300">axiral</strong> (optik faol emas).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CIS BILAN FARQ */}
            <div className="bg-gradient-to-br from-pink-900/40 to-red-900/40 border border-pink-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center text-xl shadow-lg shadow-pink-500/30">
                  📊
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Simmetriya farqi: C₂ᵥ vs D₂ₕ</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-purple-950/60">
                    <tr>
                      <th className="py-3 px-4 text-purple-300 text-left">Element</th>
                      <th className="py-3 px-4 text-yellow-300 text-left">cis (C₂ᵥ)</th>
                      <th className="py-3 px-4 text-emerald-300 text-left">trans (D₂ₕ)</th>
                    </tr>
                  </thead>
                  <tbody className="text-purple-200">
                    <tr className="border-b border-purple-800/30">
                      <td className="py-2 px-4">E</td>
                      <td className="py-2 px-4 text-center">✓</td>
                      <td className="py-2 px-4 text-center">✓</td>
                    </tr>
                    <tr className="border-b border-purple-800/30">
                      <td className="py-2 px-4">C₂</td>
                      <td className="py-2 px-4 text-center">1 ta</td>
                      <td className="py-2 px-4 text-center">3 ta</td>
                    </tr>
                    <tr className="border-b border-purple-800/30">
                      <td className="py-2 px-4">i (inversiya)</td>
                      <td className="py-2 px-4 text-center text-red-400">✗</td>
                      <td className="py-2 px-4 text-center text-green-400 font-bold">✓</td>
                    </tr>
                    <tr className="border-b border-purple-800/30">
                      <td className="py-2 px-4">σₕ</td>
                      <td className="py-2 px-4 text-center text-red-400">✗</td>
                      <td className="py-2 px-4 text-center text-green-400 font-bold">✓</td>
                    </tr>
                    <tr className="border-b border-purple-800/30">
                      <td className="py-2 px-4">σᵥ</td>
                      <td className="py-2 px-4 text-center">2 ta</td>
                      <td className="py-2 px-4 text-center">2 ta</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 font-bold">Jami operatsiyalar</td>
                      <td className="py-2 px-4 text-center font-bold">4</td>
                      <td className="py-2 px-4 text-center font-bold text-emerald-300">8</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-gradient-to-r from-pink-500/10 to-red-500/10 border border-pink-500/20 rounded-2xl p-5 mt-6">
                <h3 className="text-pink-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Asosiy xulosa
                </h3>
                <p className="text-purple-200 text-sm">
                  <strong className="text-emerald-300">Trans-izomerda</strong> <strong>i (inversiya markazi)</strong> va 
                  <strong> σₕ (gorizontal tekislik)</strong> mavjud — bu molekulani <strong className="text-yellow-300">axiral</strong> qiladi.
                  <strong className="text-yellow-300"> Sis-izomerda</strong> bu elementlar yo'q — lekin u ham axiral (chunki σᵥ bor).
                  Ikkalasi ham <strong className="text-white">optik faol emas</strong>, lekin <strong className="text-pink-300">simmetriya darajasi farqlanadi</strong>.
                </p>
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
                <div className="bg-emerald-950/50 rounded-2xl p-5 border border-emerald-700/30 text-center">
                  <div className="text-4xl mb-2">🟣</div>
                  <div className="text-emerald-400 text-xs uppercase mb-1">Kompleksda</div>
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
                    <strong className="text-yellow-300"> Ikkala izomerda ham bir xil elektron tuzilish!</strong>
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
                  <p>• <strong className="text-white">d<sub>x²-y²</sub>:</strong> eng yuqori energiya (ligandlar x,y o'qlarida) — <strong className="text-red-300">bo'sh</strong></p>
                  <p>• <strong className="text-white">d<sub>xy</sub>:</strong> ikkinchi (ekvatorial tekislikda) — <strong className="text-green-300">↑↓</strong></p>
                  <p>• <strong className="text-white">d<sub>z²</sub>:</strong> uchinchi (z o'qi bo'ylab) — <strong className="text-green-300">↑↓</strong></p>
                  <p>• <strong className="text-white">d<sub>xz</sub>, d<sub>yz</sub>:</strong> eng past (degenerat) — <strong className="text-green-300">↑↓ ↑↓</strong></p>
                  <p className="text-xs text-purple-400 mt-2">
                    <strong className="text-yellow-300">8 ta elektron</strong> quyi 4 ta orbitalni to'ldiradi → 
                    <strong className="text-green-400"> diamagnit</strong>.
                    Bu <strong className="text-white">ikkala izomerda ham bir xil</strong> — geometriya emas, faqat elektron tuzilish.
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
                    <div className="text-white font-mono font-bold text-lg">trans-[Pt(NH₃)₂Cl₂]</div>
                    <div className="text-green-300 text-sm">Transplatin</div>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-center">
                      <div className="text-green-400 text-xs">λ<sub>max</sub></div>
                      <div className="text-white font-mono font-bold text-lg">~290 nm</div>
                    </div>
                    <div className="text-center">
                      <div className="text-green-400 text-xs">Rang</div>
                      <div className="text-yellow-300 font-bold text-lg">Sariq</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { transition: "LMCT (Cl⁻ → Pt²⁺)", wavelength: "290 nm", epsilon: "ε ≈ 180 L·mol⁻¹·cm⁻¹", color: "UB-soha" },
                  { transition: "d-d (¹A₁g → ¹E₉)", wavelength: "380 nm", epsilon: "ε ≈ 60 L·mol⁻¹·cm⁻¹", color: "Binafsha" },
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

              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-5 mt-6">
                <h3 className="text-green-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Sisplatin bilan farqi
                </h3>
                <p className="text-purple-200 text-sm">
                  <strong className="text-yellow-300">Sisplatin:</strong> λ<sub>max</sub> ≈ 300 nm (LMCT) va 400 nm (d-d).
                  <strong className="text-emerald-300"> Transplatin:</strong> λ<sub>max</sub> ≈ 290 nm (LMCT) va 380 nm (d-d).
                  <strong className="text-white"> Farq juda kichik</strong> — UV-Vis spektroskopiya bilan izomerlarni farqlash qiyin.
                  <strong className="text-pink-300"> IQ spektroskopiya</strong> ancha yaxshiroq usul.
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

              <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-2xl p-5 mt-6">
                <h3 className="text-red-400 font-bold mb-2 flex items-center gap-2">
                  <span>🎯</span> Sisplatin bilan farqlash
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">ν(Pt−Cl)</strong> cho'qqisi ikkala izomerda ham <strong>~330 cm⁻¹</strong> da</p>
                  <p>• <strong className="text-yellow-300">Sisplatin:</strong> 2 ta Pt−Cl bog' ekvivalent emas (C₂ᵥ) → cho'qqi biroz kengroq</p>
                  <p>• <strong className="text-emerald-300">Transplatin:</strong> 2 ta Pt−Cl bog' ekvivalent (D₂ₕ) → cho'qqi o'tkirroq</p>
                  <p className="text-xs text-purple-400 mt-2">
                    Bu <strong className="text-white">subtil farq</strong> — tajribali spektroskopistlar aniq farqlaydi.
                  </p>
                </div>
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Trans-effekt — nima uchun trans-izomer hosil bo'ladi?</h2>
              </div>
              
              <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-5 mb-6">
                <p className="text-purple-200 text-sm leading-relaxed">
                  <strong className="text-orange-400">Trans-effekt</strong> — bu bir ligandning qarama-qarshisidagi 
                  (trans pozitsiyadagi) ligandning <strong className="text-white">almashinish tezligini oshirish</strong> qobiliyati.
                  Transplatin sintezida bu hal qiluvchi rol o'ynaydi — <strong className="text-yellow-300">NH₃ ning trans-effekti kuchsiz</strong>,
                  shuning uchun <strong className="text-emerald-300">ikkinchi Cl⁻ birinchi Cl⁻ ning trans-pozitsiyasiga</strong> kiradi.
                </p>
              </div>

              {/* QATOR */}
              <div className="bg-orange-950/50 rounded-xl p-5 border border-orange-700/30 mb-6">
                <h3 className="text-orange-400 font-bold mb-3">Trans-effekt qatori (kuchayish tartibida)</h3>
                <div className="bg-orange-900/60 rounded-lg p-4 font-mono text-xs text-orange-200 border border-orange-700/30 mb-4">
                  H₂O &lt; OH⁻ &lt; <strong className="text-yellow-300">NH₃</strong> &lt; Cl⁻ &lt; Br⁻ &lt; I⁻ &lt; 
                  SCN⁻ &lt; NO₂⁻ &lt; PR₃ &lt; <strong className="text-white">CN⁻ ≈ CO ≈ C₂H₄</strong>
                </div>
                <p className="text-purple-200 text-xs">
                  <strong className="text-yellow-300">NH₃</strong> — kuchsiz trans-effektli ligand.
                  <strong className="text-white"> Cl⁻</strong> — o'rta kuchli trans-effektli.
                  Shuning uchun Cl⁻ ning trans-pozitsiyasidagi ligand tezroq almashinadi.
                </p>
              </div>

              {/* TRANSPLATIN SINTEZI */}
              <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-5">
                <h3 className="text-orange-400 font-bold mb-3 flex items-center gap-2">
                  <span>⚗️</span> Nima uchun trans-izomer hosil bo'ladi?
                </h3>
                <div className="space-y-3 text-sm text-purple-200">
                  <div className="bg-orange-900/40 rounded-lg p-3 border border-orange-700/30">
                    <p className="text-orange-300 font-bold text-xs mb-1">Boshlang'ich: [Pt(NH₃)₄]²⁺</p>
                    <p className="text-xs">4 ta NH₃ kvadrat-tekis (NH₃ ning trans-effekti kuchsiz)</p>
                  </div>
                  <div className="bg-orange-900/40 rounded-lg p-3 border border-orange-700/30">
                    <p className="text-orange-300 font-bold text-xs mb-1">1-bosqich: + Cl⁻</p>
                    <p className="text-xs">[Pt(NH₃)₃Cl]⁺ hosil bo'ladi — Cl⁻ birinchi NH₃ ning o'rnini egallaydi</p>
                  </div>
                  <div className="bg-orange-900/40 rounded-lg p-3 border border-orange-700/30">
                    <p className="text-orange-300 font-bold text-xs mb-1">2-bosqich: + Cl⁻</p>
                    <p className="text-xs">Cl⁻ ning trans-effekti NH₃ dan kuchliroq → <strong className="text-yellow-300">ikkinchi Cl⁻ birinchi Cl⁻ ning qarama-qarshisiga (trans-pozitsiyaga)</strong> kiradi</p>
                  </div>
                  <div className="bg-emerald-900/40 rounded-lg p-3 border-2 border-emerald-500/30">
                    <p className="text-emerald-300 font-bold text-xs mb-1">Natija: trans-[Pt(NH₃)₂Cl₂]</p>
                    <p className="text-xs">Trans-effekt tufayli aynan trans-izomer hosil bo'ladi!</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SIS VS TRANS SINTEZI */}
            <div className="bg-gradient-to-br from-yellow-900/40 to-emerald-900/40 border border-yellow-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-emerald-500 flex items-center justify-center text-xl shadow-lg shadow-yellow-500/30">
                  🔄
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Sisplatin va Transplatin sintezi farqi</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-yellow-950/50 rounded-xl p-5 border border-yellow-700/30">
                  <h3 className="text-yellow-400 font-bold mb-3">💛 Sisplatin sintezi</h3>
                  <div className="space-y-2 text-xs text-purple-200">
                    <p><strong className="text-white">Boshlang'ich:</strong> [PtCl₄]²⁻</p>
                    <p><strong className="text-white">1-bosqich:</strong> + NH₃ → [PtCl₃(NH₃)]⁻</p>
                    <p><strong className="text-white">2-bosqich:</strong> + NH₃</p>
                    <p className="pl-4">Cl⁻ trans-effekti kuchli → ikkinchi NH₃ <strong className="text-yellow-300">Cl⁻ ning qarama-qarshisiga (cis)</strong> kiradi</p>
                    <p className="text-yellow-300 font-bold mt-2">→ cis-[Pt(NH₃)₂Cl₂]</p>
                  </div>
                </div>

                <div className="bg-emerald-950/50 rounded-xl p-5 border-2 border-emerald-500/30">
                  <h3 className="text-emerald-400 font-bold mb-3">💚 Transplatin sintezi ← Siz</h3>
                  <div className="space-y-2 text-xs text-purple-200">
                    <p><strong className="text-white">Boshlang'ich:</strong> [Pt(NH₃)₄]²⁺</p>
                    <p><strong className="text-white">1-bosqich:</strong> + Cl⁻ → [Pt(NH₃)₃Cl]⁺</p>
                    <p><strong className="text-white">2-bosqich:</strong> + Cl⁻</p>
                    <p className="pl-4">NH₃ trans-effekti kuchsiz → ikkinchi Cl⁻ <strong className="text-emerald-300">birinchi Cl⁻ ning qarama-qarshisiga (trans)</strong> kiradi</p>
                    <p className="text-emerald-300 font-bold mt-2">→ trans-[Pt(NH₃)₂Cl₂]</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/10 to-emerald-500/10 border border-yellow-500/20 rounded-2xl p-5 mt-6">
                <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Asosiy xulosa
                </h3>
                <p className="text-purple-200 text-sm">
                  <strong className="text-white">Boshlang'ich materialni</strong> o'zgartirish orqali 
                  <strong className="text-yellow-300"> sis-</strong> yoki <strong className="text-emerald-300">trans-</strong>izomerni 
                  tanlab olish mumkin. Bu <strong className="text-white">trans-effekt</strong>ning amaliy qo'llanilishi — 
                  koordinatsion kimyoning eng muhim qoidalaridan biri.
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
            <div className="bg-gradient-to-br from-green-900/40 to-teal-900/40 border border-green-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-xl shadow-lg shadow-green-500/30">
                  ⚗️
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Sintez usullari</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-green-950/50 rounded-2xl p-5 border border-green-700/30">
                  <h3 className="text-green-400 font-bold mb-3">1-usul: [Pt(NH₃)₄]Cl₂ dan (klassik)</h3>
                  <div className="bg-green-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-green-300 border border-green-700/30">
                    <p>[Pt(NH₃)₄]Cl₂ + 2HCl → trans-[Pt(NH₃)₂Cl₂] + 2NH₄Cl</p>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Mexanizm:</strong> NH₃ ning trans-effekti kuchsiz → ikkinchi Cl⁻ birinchi Cl⁻ ning trans-pozitsiyasiga kiradi</p>
                    <p><strong className="text-white">Sharoit:</strong> 60-70°C, konsentrlangan HCl</p>
                    <p><strong className="text-white">Hosildorlik:</strong> 70-80%</p>
                    <p><strong className="text-white">Afzalligi:</strong> Faqat trans-izomer hosil bo'ladi (trans-effekt tufayli)</p>
                  </div>
                </div>

                <div className="bg-green-950/50 rounded-2xl p-5 border border-green-700/30">
                  <h3 className="text-green-400 font-bold mb-3">2-usul: [Pt(NH₃)₄][PtCl₄] dan</h3>
                  <div className="bg-green-900/60 rounded-xl p-4 mb-4 font-mono text-sm text-green-300 border border-green-700/30">
                    <p>[Pt(NH₃)₄][PtCl₄] + 2HCl → 2 trans-[Pt(NH₃)₂Cl₂]</p>
                  </div>
                  <div className="space-y-2 text-sm text-purple-200">
                    <p><strong className="text-white">Afzalligi:</strong> Bitta reaksiyada ikki marta mahsulot</p>
                    <p><strong className="text-white">Hosildorlik:</strong> 75-85%</p>
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
                  { step: "1", title: "Reagentlar", desc: "[Pt(NH₃)₄]Cl₂ (5 g, 12 mmol), konsentrlangan HCl (20 mL)" },
                  { step: "2", title: "Eritish", desc: "[Pt(NH₃)₄]Cl₂ ni 50 mL suvda eritish, 60°C ga qizdirish" },
                  { step: "3", title: "HCl qo'shish", desc: "Konsentrlangan HCl ni asta-sekin qo'shib, 1 soat qaynatish" },
                  { step: "4", title: "Rang o'zgarishi", desc: "Rangsiz → sariq (trans-[Pt(NH₃)₂Cl₂] hosil bo'ldi)" },
                  { step: "5", title: "Sovutish", desc: "Xona haroratigacha sovutish, keyin muzli suvda" },
                  { step: "6", title: "Filtratsiya", desc: "Sariq kristallarni filtrlash, sovuq suv bilan yuvish" },
                  { step: "7", title: "Quritish", desc: "60°C da quritish, hosildorlik ≈ 75%" },
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
                  <p>• <strong className="text-white">Konsentrlangan HCl</strong> — kuchli kislota, shkaflarda ishlash</p>
                  <p>• <strong className="text-white">Platina birikmalari</strong> — qimmat, ehtiyotkorlik bilan</p>
                  <p>• <strong className="text-red-300">Transplatin zaharli!</strong> — qo'lqop va himoya ko'zoynak kiyish</p>
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
                <h2 className="text-xl md:text-2xl font-bold text-white">Peyrone kashfiyoti (1844)</h2>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-2xl p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-yellow-600 to-amber-600 flex items-center justify-center text-6xl flex-shrink-0 shadow-2xl">
                    👨‍🔬
                  </div>
                  <div className="flex-1">
                    <h3 className="text-yellow-400 font-bold text-xl mb-2">Michele Peyrone (1811-1891)</h3>
                    <p className="text-purple-200 text-sm mb-3 leading-relaxed">
                      <strong className="text-yellow-300">1844 yilda</strong> Italyan kimyogari Peyrone birinchi bo'lib 
                      <strong className="text-white"> [Pt(NH₃)₂Cl₂]</strong> ni sintez qildi. U <strong className="text-white">ikki xil shakl</strong> 
                      (sariq va boshqa sariq) borligini kuzatdi, lekin ularning tabiatini tushuntira olmadi.
                      Faqat <strong className="text-yellow-300">50 yildan keyin</strong> Werner bu hodisani koordinatsion nazariya bilan tushuntirdi.
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-xs text-yellow-300 font-semibold">
                        📜 1844 yil
                      </span>
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-xs text-amber-300 font-semibold">
                        📍 Turin universiteti
                      </span>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-xs text-emerald-300 font-semibold">
                        🔗 Peyrone tuzi
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-2xl p-5">
                <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                  <span>💡</span> Peyrone tuzi vs Cramsalt tuzi
                </h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• <strong className="text-white">Peyrone tuzi</strong> (1844) = cis-[Pt(NH₃)₂Cl₂] — <strong className="text-yellow-300">sariq</strong></p>
                  <p>• <strong className="text-white">Cramsalt tuzi</strong> (1850) = trans-[Pt(NH₃)₂Cl₂] — <strong className="text-emerald-300">sariq</strong></p>
                  <p className="text-xs text-purple-400 mt-2">
                    Ikkalasi ham <strong className="text-white">sariq rangli</strong> — shuning uchun Peyrone ularni farqlay olmadi!
                    Faqat <strong className="text-yellow-300">reaktsiyalardagi farq</strong> orqali ular turli ekanligi aniqlandi.
                  </p>
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
                  { year: "1850", title: "Cramsalt sintezi", desc: "Cramsalt trans-[Pt(NH₃)₂Cl₂] ni sintez qildi (Cramsalt tuzi) — ikkalasi ham sariq!" },
                  { year: "1890", title: "Werner tushuntirishi", desc: "Alfred Werner sis-trans izomeriyani koordinatsion nazariya bilan tushuntirdi" },
                  { year: "1965", title: "Rosenberg kashfiyoti", desc: "Tasodifan faqat cis-izomer saratonga qarshi faol ekanligi aniqlandi" },
                  { year: "1978", title: "FDA tasdiqlashi", desc: "Sisplatin saraton dori sifatida tasdiqlandi, transplatin emas" },
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

            {/* AHAMIYATI */}
            <div className="bg-gradient-to-br from-pink-900/40 to-red-900/40 border border-pink-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center text-xl shadow-lg shadow-pink-500/30">
                  🌍
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Transplatinning ilmiy ahamiyati</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: "🎓", title: "Ta'lim", desc: "Struktur-faoliyat bog'liqligini tushuntirish uchun eng yaxshi misol" },
                  { icon: "🔬", title: "Tadqiqot", desc: "Nazorat namunasi sifatida — sisplatinning ta'sirini solishtirish uchun" },
                  { icon: "💊", title: "Dori dizayni", desc: "Qanday geometriya kerakligini ko'rsatadi" },
                  { icon: "🧬", title: "Molekulyar biologiya", desc: "DNA-protein o'zaro ta'sirini o'rganishda model" },
                ].map((item, i) => (
                  <div key={i} className="bg-pink-950/50 rounded-xl p-5 border border-pink-700/30">
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <h3 className="text-pink-400 font-bold mb-2">{item.title}</h3>
                    <p className="text-purple-200 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-pink-500/10 to-red-500/10 border border-pink-500/20 rounded-2xl p-5 mt-6">
                <h3 className="text-pink-400 font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Kimyo tarixidagi o'rni
                </h3>
                <p className="text-purple-200 text-sm">
                  <strong className="text-white">Transplatin</strong> — bu <strong className="text-yellow-300">struktur-faoliyat bog'liqligi</strong>ning 
                  eng chiroyli misoli. Bir xil formula, bir xil massa, bir xil bog' uzunliklari — lekin 
                  <strong className="text-pink-300"> butunlay boshqa biologik faollik</strong>.
                  Bu hodisa kimyogarlar va farmatsevtlarga <strong className="text-white">geometriyaning ahamiyati</strong>ni ko'rsatdi — 
                  faqat formulani emas, balki <strong className="text-emerald-300">3D tuzilishni</strong> ham hisobga olish kerak.
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
              href="/ilmiy/birikmalar/cis-pt-nh3-2-cl2"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold transition-all shadow-lg shadow-yellow-500/30 flex items-center gap-2"
            >
              <span>💛</span>
              <span className="hidden sm:inline">cis-[Pt(NH₃)₂Cl₂] (Saraton dori)</span>
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