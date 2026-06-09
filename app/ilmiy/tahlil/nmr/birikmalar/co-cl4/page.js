"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"

// ── PARAMAGNIT SIMULYATSIYA ──────────────────────────────────────────────────
function ParamagnitSimulyatsiya() {
  const [harorat, setHarorat] = useState(298)
  const canvasRef = useRef(null)

  const baseWidth = 2500
  const widthHz = Math.round(baseWidth * (298 / harorat))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const W = canvas.width, H = canvas.height
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = "#0f0a1a"; ctx.fillRect(0, 0, W, H)
    ctx.strokeStyle = "#2a1f3d"; ctx.lineWidth = 0.5
    for (let ppm = 20; ppm >= -10; ppm -= 5) {
      const x = 50 + ((20 - ppm) / 30) * (W - 100)
      ctx.beginPath(); ctx.moveTo(x, 20); ctx.lineTo(x, H - 40); ctx.stroke()
    }
    ctx.strokeStyle = "#3d2a5c"; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(50, H - 40); ctx.lineTo(W - 50, H - 40); ctx.stroke()

    const cx = W / 2
    const sigma = (widthHz / 500) * 30

    ctx.beginPath()
    ctx.strokeStyle = "#60a5fa"; ctx.lineWidth = 4; ctx.shadowBlur = 12; ctx.shadowColor = "#60a5fa"
    for (let x = 50; x <= W - 50; x++) {
      const rel = (x - cx) / sigma
      const y = (H - 40) - 40 * Math.exp(-rel * rel / 2)
      x === 50 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.stroke(); ctx.shadowBlur = 0
    ctx.fillStyle = "rgba(96,165,250,0.12)"
    ctx.beginPath()
    for (let x = 50; x <= W - 50; x++) {
      const rel = (x - cx) / sigma
      const y = (H - 40) - 40 * Math.exp(-rel * rel / 2)
      x === 50 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.lineTo(W - 50, H - 40); ctx.lineTo(50, H - 40); ctx.closePath(); ctx.fill()

    ctx.fillStyle = "#60a5fa"; ctx.font = "bold 11px monospace"; ctx.textAlign = "center"
    ctx.fillText(`Δν½ ≈ ${widthHz} Hz (T=${harorat} K)`, cx, 35)
    ctx.fillStyle = "#7c6a9e"; ctx.font = "10px sans-serif"
    for (let ppm = 20; ppm >= -10; ppm -= 5) {
      const x = 50 + ((20 - ppm) / 30) * (W - 100); ctx.fillText(ppm, x, H - 25)
    }
    ctx.fillText("δ (ppm)", W / 2, H - 8)
    ctx.fillText("Signal amalda ko'rinmaydi — EPR tavsiya qilinadi!", W / 2, H - 55)

  }, [harorat, widthHz])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-sm">
        <span className="text-purple-400">Harorat:</span>
        <input type="range" min="200" max="380" value={harorat} onChange={(e) => setHarorat(+e.target.value)} className="flex-1 h-1.5 bg-purple-800 rounded-full appearance-none cursor-pointer accent-blue-400" />
        <span className="text-purple-300 font-mono w-16 text-right">{harorat} K</span>
      </div>
      <canvas ref={canvasRef} width={700} height={180} className="w-full h-auto rounded-lg border border-purple-700/30" />
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="bg-purple-800/30 rounded-xl p-3 border border-purple-700/30"><div className="text-purple-400 text-xs">Signal kengligi</div><div className="text-white font-mono font-bold">{widthHz} Hz</div></div>
        <div className="bg-purple-800/30 rounded-xl p-3 border border-purple-700/30"><div className="text-purple-400 text-xs">T₁e (taxminiy)</div><div className="text-white font-mono font-bold">~10⁻¹² s</div></div>
      </div>
    </div>
  )
}

// ── ASOSIY SAHIFA ────────────────────────────────────────────────────────────
export default function CoCl4_YaMR() {
  const [activeTab, setActiveTab] = useState("spektr")

  const tabs = [
    { id: "spektr",      label: "📈 ¹H YaMR Spektri" },
    { id: "interaktiv",  label: "🎮 Interaktiv simulyatsiya" },
    { id: "paramagnit",  label: "🧲 Paramagnit (S=3/2)" },
    { id: "epr",         label: "📡 EPR vs YaMR" },
    { id: "rang",        label: "🎨 Ko'k ↔ Pushti" },
    { id: "taqqos",      label: "⚖️ Co²⁺ komplekslari" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil/nmr/birikmalar" className="text-purple-400 hover:text-purple-300 text-lg">← YaMR birikmalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">🧲 [CoCl₄]²⁻ — YaMR spektri tahlili</h1>
          <p className="text-purple-400 text-sm">tetraxlorokobaltat(II) ioni • Tetraedrik • Paramagnit (S=3/2)</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs font-semibold">¹H YaMR</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">Paramagnit (S=3/2)</span>
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs">d⁷ (YS)</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">T<sub>d</sub></span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">EPR afzal</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">Ko'k rang</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent" style={{ fontFamily: "'Syne', sans-serif" }}>[CoCl₄]²⁻</h2>
            <span className="text-purple-400 text-lg">200.75 g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">tetraxlorokobaltat(II) ioni — <span className="text-blue-400 italic">Tetraedrik, paramagnit</span></p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-yellow-400">YaMR spektri</strong> — Co²⁺ (d⁷, YS, S=3/2) 
            <strong className="text-yellow-400"> kuchli paramagnit</strong>. 3 ta toq elektron —
            T₁e juda qisqa (~10⁻¹² s). <strong className="text-yellow-400">¹H YaMR:</strong> signallar 
            juda keng (bir necha ming Gers), deyarli ko'rinmaydi.
            <strong className="text-yellow-400"> ⁵⁹Co YaMR:</strong> kuzatilmaydi.
            <strong className="text-yellow-400"> EPR:</strong> Co²⁺ uchun informativ — S=3/2, 
            kuchli nolinchi maydon ajralishi (ZFS≈5−15 cm⁻¹).
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[["¹H signal","Juda keng (~2500 Hz)"],["⁵⁹Co","Kuzatilmaydi"],["S","3/2"],["μ<sub>eff</sub>","4.3−4.8 μ<sub>B</sub>"],
              ["T₁e","~10⁻¹² s"],["EPR","Afzal usul"],["Rang","Ko'k"],["T<sub>d</sub>","Tetraedrik"],
            ].map((r,i)=>(<div key={i} className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30"><div className="text-purple-400 text-xs mb-1" dangerouslySetInnerHTML={{__html:r[0]}}/><div className="text-white font-bold text-sm">{r[1]}</div></div>))}
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map(tab=>(<button key={tab.id} onClick={()=>setActiveTab(tab.id)} className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${activeTab===tab.id?"bg-blue-600/40 text-white border border-blue-400/50":"bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"}`}>{tab.label}</button>))}
        </div>

        {activeTab==="spektr"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">📈 ¹H YaMR — deyarli ko'rinmaydi</h2><div className="bg-purple-800/30 rounded-xl p-6 border border-purple-700/30"><div className="text-center"><svg viewBox="0 0 500 100" className="w-96 h-20 mx-auto"><line x1="30" y1="50" x2="470" y2="50" stroke="#3d2a5c" strokeWidth="0.5"/><path d="M 50 50 Q 250 50, 450 50" stroke="#60a5fa" strokeWidth="14" fill="none" opacity="0.3" strokeLinecap="round"/><text x="250" y="28" fill="#60a5fa" fontSize="10" fontFamily="monospace" textAnchor="middle">Δν½ ≈ 2000−3000 Hz</text></svg><p className="text-purple-300 text-sm mt-2">S=3/2 — Cu²⁺ (S=½) dan ham kengroq!</p></div></div></div>)}

        {activeTab==="interaktiv"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">🎮 Interaktiv simulyatsiya</h2><ParamagnitSimulyatsiya /></div>)}

        {activeTab==="paramagnit"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">🧲 Nega S=3/2 Cu²⁺ dan kuchliroq?</h2><div className="space-y-4">{[{t:"S=3/2 vs S=½",d:"Co²⁺ (d⁷, YS) — 3 ta toq elektron (S=3/2). Cu²⁺ (d⁹) — 1 ta toq elektron (S=½). PRE∝S(S+1) — Co²⁺ da 3.75× kuchliroq!"},{t:"T₁e — juda qisqa",d:"Co²⁺ da T₁e≈10⁻¹² s (Cu²⁺ da ~10⁻⁸−10⁻⁹ s). Qisqa T₁e — kuchliroq relaksatsiya — kengroq signallar."},{t:"T<sub>d</sub> simmetriya",d:"Tetraedrik maydonda orbital degeneratlik (T₁ term) — orbital hissa qo'shiladi. Spin-orbit bog'lanish kuchli."}].map((r,i)=>(<div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30"><h3 className="text-yellow-400 font-bold mb-1">{r.t}</h3><p className="text-purple-200 text-sm">{r.d}</p></div>))}</div></div>)}

        {activeTab==="epr"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">📡 EPR — Co²⁺ uchun afzal</h2><p className="text-purple-200 leading-relaxed">Co²⁺ (S=3/2) — EPR da kuchli nolinchi maydon ajralishi (ZFS≈5−15 cm⁻¹) tufayli murakkab, lekin informativ spektr.</p><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-purple-700"><th className="py-3 px-4">Parametr</th><th className="py-3 px-4">¹H YaMR</th><th className="py-3 px-4">EPR</th></tr></thead><tbody className="text-purple-200">{[["Signal","Juda keng (~3000 Hz)","~100−500 G"],["Sezgirlik","Juda past","Yuqori"],["g-faktor","—","g∥≈2.3, g⊥≈2.1"],["ZFS","—","~5−15 cm⁻¹"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td><td className="py-3 px-4 text-sm">{r[1]}</td><td className="py-3 px-4 text-green-400 text-sm">{r[2]}</td></tr>))}</tbody></table></div></div>)}

        {activeTab==="rang"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">🎨 Ko'k ↔ Pushti — YaMR o'zgarishi</h2><p className="text-purple-200 leading-relaxed">[CoCl₄]²⁻ + 6H₂O ⇌ [Co(H₂O)₆]²⁺ + 4Cl⁻. Rang va YaMR signallari o'zgaradi.</p><div className="grid grid-cols-2 gap-4"><div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5"><h3 className="text-blue-400 font-bold mb-2">[CoCl₄]²⁻ (Ko'k)</h3><p className="text-purple-200 text-sm">T<sub>d</sub>, S=3/2<br/>¹H: juda keng<br/>EPR: murakkab</p></div><div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-5"><h3 className="text-pink-400 font-bold mb-2">[Co(H₂O)₆]²⁺ (Pushti)</h3><p className="text-purple-200 text-sm">O<sub>h</sub>, S=3/2<br/>¹H: juda keng<br/>EPR: boshqacha</p></div></div></div>)}

        {activeTab==="taqqos"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">⚖️ Co²⁺ komplekslari YaMR</h2><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-purple-700"><th className="py-3 px-4">Kompleks</th><th className="py-3 px-4">Geometriya</th><th className="py-3 px-4">S</th><th className="py-3 px-4">¹H YaMR</th></tr></thead><tbody className="text-purple-200">{[["[CoCl₄]²⁻","T<sub>d</sub>","3/2","Juda keng"],["[Co(H₂O)₆]²⁺","O<sub>h</sub>","3/2","Juda keng"],["[Co(NH₃)₆]²⁺","O<sub>h</sub>","3/2","Juda keng"],["[Co(CN)₆]⁴⁻","O<sub>h</sub>","½ (QS!)","Keng (lekin torroq)"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-bold text-yellow-400" dangerouslySetInnerHTML={{__html:r[0]}}/><td className="py-3 px-4 text-sm" dangerouslySetInnerHTML={{__html:r[1]}}/><td className="py-3 px-4">{r[2]}</td><td className="py-3 px-4 text-sm">{r[3]}</td></tr>))}</tbody></table></div></div>)}

        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8"><h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2><ol className="space-y-2 text-purple-200 list-decimal list-inside"><li><strong className="text-yellow-400">S=3/2</strong> — Cu²⁺ (S=½) dan kuchliroq paramagnit</li><li><strong className="text-yellow-400">¹H YaMR yaroqsiz</strong> — Δν½≈2000−3000 Hz</li><li><strong className="text-yellow-400">EPR afzal</strong> — ZFS≈5−15 cm⁻¹</li><li><strong className="text-yellow-400">T<sub>d</sub> simmetriya</strong> — orbital hissa qo'shilgan</li></ol></div>

        <div className="flex justify-between pt-6"><Link href="/ilmiy/tahlil/nmr/birikmalar/ag-nh3-2" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← [Ag(NH₃)₂]⁺</Link><Link href="/ilmiy/tahlil/nmr/birikmalar/fe-co5" className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 text-white font-semibold">[Fe(CO)₅] →</Link></div>

      </section>
    </main>
  )
}