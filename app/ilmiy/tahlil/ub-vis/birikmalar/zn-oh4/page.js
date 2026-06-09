"use client"

import Link from "next/link"
import { useState } from "react"

export default function ZnOH4_UBVis() {
  const [activeTab, setActiveTab] = useState("sabab")

  const tabs = [
    { id: "sabab",    label: "🔍 Nima uchun rangsiz?" },
    { id: "spektr",   label: "📈 UB-Vis spektri" },
    { id: "taqqos",   label: "⚖️ Barcha d¹⁰ komplekslar" },
    { id: "amfoter",  label: "🔄 Amfoterlik va UB-Vis" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil/ub-vis/birikmalar" className="text-purple-400 hover:text-purple-300 text-lg">← UB-Vis birikmalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-green-400">🌈 [Zn(OH)₄]²⁻ — UB-Vis tahlili</h1>
          <p className="text-purple-400 text-sm">tetragidroksosinkat(II) ioni • RANGSIZ • d¹⁰ • Amfoter kompleks</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── HERO ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs font-semibold">UB-Vis Tahlil</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Tetraedrik</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">d¹⁰</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">Diamagnit</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">KMBE=0</span>
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs">Amfoter</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent" style={{ fontFamily: "'Syne', sans-serif" }}>
              [Zn(OH)₄]²⁻
            </h2>
            <span className="text-purple-400 text-lg">133.41 g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            tetragidroksosinkat(II) ioni — <span className="text-green-400 italic">d¹⁰ amfoter kompleks</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-yellow-400">[Zn(OH)₄]²⁻ — RANGSIZ.</strong> Sababi: Zn²⁺ (d¹⁰) — 
            <strong className="text-yellow-400"> barcha d-orbitallar to'liq to'lgan</strong>. 
            d-d o'tishlar uchun elektron o'tadigan bo'sh orbital yo'q.
            KMBE = 0 — geometriya sterik omillar bilan belgilanadi (tetraedrik, sp³-gibridlanish).
            <strong className="text-yellow-400"> Amfoterlik:</strong> Zn(OH)₂ + 2OH⁻ ⇌ [Zn(OH)₄]²⁻.
            UB-Vis spektroskopiya bu qaytar reaksiyani kuzatish imkonini beradi — 
            cho'kma hosil bo'lishi va erishi natijasida spektr o'zgaradi.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ["Metall", "Zn²⁺"], ["d-konfig", "d¹⁰"], ["KMBE", "0"], ["Rang", "RANGSIZ"],
              ["d-d o'tish", "YO'Q"], ["Geometriya", "Tetraedrik"], ["μ<sub>eff</sub>", "0"], ["UB yutilish", "~210 nm"],
              ["log β₄", "≈15.5"], ["Gibridlanish", "sp³"], ["Bog' burchagi", "109.5°"], ["Zn−O", "~1.97 Å"],
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
                <div className="text-purple-400 text-xs mb-1" dangerouslySetInnerHTML={{ __html: r[0] }} />
                <div className="text-white font-bold">{r[1]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${activeTab === tab.id ? "bg-green-600/40 text-white border border-green-400/50" : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"}`}>{tab.label}</button>
          ))}
        </div>

        {/* ── NIMA UCHUN RANGSIZ ── */}
        {activeTab === "sabab" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">🔍 Nima uchun rangsiz?</h2>
            <div className="space-y-4">
              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-2">1. d¹⁰ konfiguratsiya</h3>
                <p className="text-purple-200 text-sm">Zn²⁺: [Ar] 3d¹⁰. Barcha 10 ta d-elektron juftlashgan, d-orbitallar to'liq to'lgan. d-d o'tish uchun na bo'sh orbital, na o'tish imkoniyati mavjud.</p>
              </div>
              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-2">2. KMBE = 0</h3>
                <p className="text-purple-200 text-sm">Barcha d-orbitallar to'lgan — kristall maydonda barqarorlashish energiyasi nolga teng. Tetraedrik yoki oktaedrik geometriya — barqarorlik farqi yo'q.</p>
              </div>
              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-2">3. UB sohada yutilish</h3>
                <p className="text-purple-200 text-sm">LMCT (OH⁻→Zn²⁺) o'tish UB sohada (~210 nm). Ko'rinadigan sohaga (400−800 nm) tushmaydi — rangsiz. Barcha Zn²⁺ komplekslari rangsiz.</p>
              </div>
            </div>
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <p className="text-green-300 text-sm"><strong>Muhim amaliy ahamiyat:</strong> Zn²⁺ komplekslari rangsiz bo'lgani uchun ularni UB-Vis orqali emas, balki IQ, YaMR yoki atom-absorbsion spektroskopiya orqali tahlil qilinadi.</p>
            </div>
          </div>
        )}

        {/* ── SPEKTR ── */}
        {activeTab === "spektr" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">📈 UB-Vis spektri</h2>
            <p className="text-purple-200 leading-relaxed">UB-Vis spektrida <strong className="text-yellow-400">ko'rinadigan sohada (400−800 nm) hech qanday yutilish yo'q</strong>. Barcha yutilishlar UB sohada (&lt;250 nm).</p>
            <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-purple-700"><th className="py-3 px-4">λ (nm)</th><th className="py-3 px-4">O'tish turi</th><th className="py-3 px-4">Izoh</th></tr></thead><tbody className="text-purple-200">{[["~230","LMCT (OH⁻→Zn²⁺)","UB sohada. Ko'rinadigan rangga ta'sir qilmaydi."],["~200","σ→σ* (OH⁻ ichki)","Chuqur UB. Ligand ichidagi o'tish."]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-mono font-bold text-yellow-400">{r[0]}</td><td className="py-3 px-4 text-sm">{r[1]}</td><td className="py-3 px-4 text-sm">{r[2]}</td></tr>))}</tbody></table></div>
            <div className="bg-purple-800/20 border border-purple-700/30 rounded-xl p-3 text-center"><p className="text-purple-500 text-xs italic">Eslatma: Ko'rinadigan sohada yutilish yo'qligi sababli UB-Vis spektri odatda o'lchanmaydi. Boshqa usullar (IQ, YaMR) tavsiya qilinadi.</p></div>
          </div>
        )}

        {/* ── TAQQOSLASH ── */}
        {activeTab === "taqqos" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">⚖️ Barcha Zn²⁺ komplekslari rangsiz</h2>
            <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-purple-700"><th className="py-3 px-4">Kompleks</th><th className="py-3 px-4">Geometriya</th><th className="py-3 px-4">Rang</th><th className="py-3 px-4">Sabab</th></tr></thead><tbody className="text-purple-200">{[["[Zn(OH)₄]²⁻","Tetraedrik","Rangsiz","d¹⁰"],["[Zn(H₂O)₆]²⁺","Oktaedrik","Rangsiz","d¹⁰"],["[Zn(NH₃)₄]²⁺","Tetraedrik","Rangsiz","d¹⁰"],["[ZnCl₄]²⁻","Tetraedrik","Rangsiz","d¹⁰"],["[Zn(CN)₄]²⁻","Tetraedrik","Rangsiz","d¹⁰"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td><td className="py-3 px-4 text-sm">{r[1]}</td><td className="py-3 px-4">{r[2]}</td><td className="py-3 px-4 text-sm">{r[3]}</td></tr>))}</tbody></table></div>
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5"><p className="text-purple-200 text-sm"><strong>Geometriyani qanday aniqlaymiz?</strong> Barchasi rangsiz bo'lgani uchun UB-Vis yordam bermaydi. IQ spektroskopiya (ν(Zn−L) chastotalari) yoki rentgen difraksiyasi kerak.</p></div>
          </div>
        )}

        {/* ── AMFOTERLIK ── */}
        {activeTab === "amfoter" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">🔄 Amfoterlik va UB-Vis monitoring</h2>
            <p className="text-purple-200 leading-relaxed">Zn(OH)₂ — <strong className="text-yellow-400">amfoter gidroksid</strong>. UB-Vis spektroskopiya cho'kma hosil bo'lishi va erishini kuzatish imkonini beradi (turbidimetrik usul).</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5"><h3 className="text-red-400 font-bold mb-2">Kislotali muhitda</h3><p className="text-purple-200 text-sm"><strong>Zn(OH)₂ + 2H⁺ → Zn²⁺ + 2H₂O</strong><br/>Cho'kma eriydi<br/>Eritma tiniglashadi</p></div>
              <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5"><h3 className="text-green-400 font-bold mb-2">Ishqoriy muhitda</h3><p className="text-purple-200 text-sm"><strong>Zn(OH)₂ + 2OH⁻ → [Zn(OH)₄]²⁻</strong><br/>Cho'kma eriydi<br/>Eritma tiniglashadi</p></div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30"><h3 className="text-yellow-400 font-bold mb-2">UB-Vis monitoring</h3><p className="text-purple-200 text-sm">pH o'zgarishi bilan eritmaning loyqaligi (turbidligi) o'zgaradi. UB-Vis spektrofotometr yordamida 500−600 nm da yorug'lik sochilishini o'lchab, cho'kma miqdorini kuzatish mumkin. Bu — turbidimetrik titrlash usuli.</p></div>
          </div>
        )}

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">d¹⁰ — d-d o'tishlar YO'Q:</strong> barcha d-orbitallar to'lgan</li>
            <li><strong className="text-yellow-400">KMBE=0:</strong> geometriya sterik omillar bilan belgilanadi</li>
            <li><strong className="text-yellow-400">Rangsiz:</strong> yutilish faqat UB sohada (&lt;250 nm)</li>
            <li><strong className="text-yellow-400">Amfoterlik:</strong> UB-Vis turbidimetrik monitoring imkonini beradi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/ub-vis/birikmalar/ag-nh3-2" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← [Ag(NH₃)₂]⁺</Link>
          <Link href="/ilmiy/tahlil/ub-vis/birikmalar" className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold">Barcha birikmalar →</Link>
        </div>

      </section>
    </main>
  )
}