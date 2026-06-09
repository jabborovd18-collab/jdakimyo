"use client"

import Link from "next/link"
import { useState } from "react"

export default function AgNH32_UBVis() {
  const [activeTab, setActiveTab] = useState("sabab")

  const tabs = [
    { id: "sabab",    label: "🔍 Nima uchun rangsiz?" },
    { id: "spektr",   label: "📈 UB-Vis spektri" },
    { id: "taqqos",   label: "⚖️ Boshqa d¹⁰ komplekslar" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil/ub-vis/birikmalar" className="text-purple-400 hover:text-purple-300 text-lg">← UB-Vis birikmalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-cyan-400">🌈 [Ag(NH₃)₂]⁺ — UB-Vis tahlili</h1>
          <p className="text-purple-400 text-sm">diamminkumush(I) ioni • RANGSIZ • d¹⁰ • Tollens reaktivi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-cyan-600/20 text-cyan-400 border border-cyan-600/30 px-3 py-1 rounded-full text-xs font-semibold">UB-Vis Tahlil</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Chiziqli</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">d¹⁰</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">Diamagnit</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">KMBE=0</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">d-d YO'Q</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent" style={{ fontFamily: "'Syne', sans-serif" }}>
              [Ag(NH₃)₂]⁺
            </h2>
            <span className="text-purple-400 text-lg">141.94 g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            diamminkumush(I) ioni — <span className="text-cyan-400 italic font-bold">"TOLLENS REAKTIVI"</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-yellow-400">[Ag(NH₃)₂]⁺ — RANGSIZ.</strong> Sababi: Ag⁺ (d¹⁰) — 
            <strong className="text-yellow-400"> barcha d-orbitallar to'liq to'lgan</strong>. 
            d-d o'tishlar uchun na bo'sh joy, na elektron o'tishi mumkin bo'lgan holat mavjud.
            KMBE = 0 — geometriya faqat sterik omillar bilan belgilanadi (chiziqli, sp-gibridlanish).
            <strong className="text-yellow-400"> UB sohada</strong> (~200−250 nm) LMCT va ligand ichidagi o'tishlar kuzatiladi,
            lekin ular ko'rinadigan rangga ta'sir qilmaydi.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ["Metall", "Ag⁺"], ["d-konfig", "d¹⁰"], ["KMBE", "0"], ["Rang", "RANGSIZ"],
              ["d-d o'tish", "YO'Q"], ["Geometriya", "Chiziqli"], ["μ<sub>eff</sub>", "0"], ["UB yutilish", "~220 nm"],
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
                <div className="text-purple-400 text-xs mb-1" dangerouslySetInnerHTML={{ __html: r[0] }} />
                <div className="text-white font-bold">{r[1]}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${activeTab === tab.id ? "bg-cyan-600/40 text-white border border-cyan-400/50" : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"}`}>{tab.label}</button>
          ))}
        </div>

        {activeTab === "sabab" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">🔍 Nima uchun rangsiz?</h2>
            <div className="space-y-4">
              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-2">1. d¹⁰ konfiguratsiya</h3>
                <p className="text-purple-200 text-sm">Ag⁺: [Kr] 4d¹⁰. Barcha 10 ta d-elektron juftlashgan, d-orbitallar to'liq to'lgan. d-d o'tish uchun elektron o'tadigan bo'sh orbital yo'q.</p>
              </div>
              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-2">2. KMBE = 0</h3>
                <p className="text-purple-200 text-sm">Barcha d-orbitallar to'lgan — kristall maydonda barqarorlashish energiyasi nolga teng. Geometriya sterik omillar bilan belgilanadi.</p>
              </div>
              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-2">3. UB sohada yutilish</h3>
                <p className="text-purple-200 text-sm">LMCT (NH₃→Ag⁺) va ligand ichidagi o'tishlar UB sohada (~200−250 nm). Ko'rinadigan sohaga (400−800 nm) tushmaydi — rangsiz.</p>
              </div>
            </div>
            <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-5">
              <p className="text-cyan-300 text-sm"><strong>Xulosa:</strong> Barcha d¹⁰ komplekslar (Cu⁺, Ag⁺, Au⁺, Zn²⁺, Cd²⁺, Hg²⁺) rangsiz bo'ladi — d-d o'tishlar mavjud emas.</p>
            </div>
          </div>
        )}

        {activeTab === "spektr" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">📈 UB-Vis spektri</h2>
            <p className="text-purple-200 leading-relaxed">UB-Vis spektrida <strong className="text-yellow-400">ko'rinadigan sohada (400−800 nm) hech qanday yutilish yo'q</strong>. Barcha yutilishlar UB sohada.</p>
            <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-purple-700"><th className="py-3 px-4">λ (nm)</th><th className="py-3 px-4">O'tish turi</th><th className="py-3 px-4">Izoh</th></tr></thead><tbody className="text-purple-200">{[["~250","LMCT (NH₃→Ag⁺)","UB sohada"],["~210","π→σ* (NH₃ ichki)","Chuqur UB"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-mono font-bold text-yellow-400">{r[0]}</td><td className="py-3 px-4 text-sm">{r[1]}</td><td className="py-3 px-4 text-sm">{r[2]}</td></tr>))}</tbody></table></div>
          </div>
        )}

        {activeTab === "taqqos" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">⚖️ Barcha d¹⁰ komplekslar rangsiz</h2>
            <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-purple-700"><th className="py-3 px-4">Kompleks</th><th className="py-3 px-4">dⁿ</th><th className="py-3 px-4">Rang</th><th className="py-3 px-4">Sabab</th></tr></thead><tbody className="text-purple-200">{[["[Ag(NH₃)₂]⁺","d¹⁰","Rangsiz","d-d yo'q"],["[Zn(H₂O)₆]²⁺","d¹⁰","Rangsiz","d-d yo'q"],["[Cu(NH₃)₂]⁺","d¹⁰","Rangsiz","d-d yo'q"],["[Cd(CN)₄]²⁻","d¹⁰","Rangsiz","d-d yo'q"],["[HgI₄]²⁻","d¹⁰","Rangsiz","d-d yo'q"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td><td className="py-3 px-4">{r[1]}</td><td className="py-3 px-4">{r[2]}</td><td className="py-3 px-4 text-sm">{r[3]}</td></tr>))}</tbody></table></div>
          </div>
        )}

        <div className="bg-gradient-to-r from-cyan-600/10 to-purple-600/10 border border-cyan-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">d¹⁰ — d-d o'tishlar YO'Q</strong></li>
            <li><strong className="text-yellow-400">KMBE=0</strong></li>
            <li><strong className="text-yellow-400">Rangsiz</strong> — yutilish faqat UB sohada</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/ub-vis/birikmalar/cr-h2o6" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← [Cr(H₂O)₆]³⁺</Link>
          <Link href="/ilmiy/tahlil/ub-vis/birikmalar/zn-oh4" className="px-6 py-3 bg-cyan-600/80 rounded-xl hover:bg-cyan-500 text-white font-semibold">[Zn(OH)₄]²⁻ →</Link>
        </div>

      </section>
    </main>
  )
}