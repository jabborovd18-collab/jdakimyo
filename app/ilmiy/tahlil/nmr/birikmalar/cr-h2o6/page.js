"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"

// ── PARAMAGNIT SIMULYATSIYA ──────────────────────────────────────────────────
function ParamagnitSimulyatsiya() {
  const [harorat, setHarorat] = useState(298)
  const canvasRef = useRef(null)

  const baseWidth = 1500
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
    const sigma = (widthHz / 300) * 25

    ctx.beginPath()
    ctx.strokeStyle = "#a855f7"; ctx.lineWidth = 3; ctx.shadowBlur = 10; ctx.shadowColor = "#a855f7"
    for (let x = 50; x <= W - 50; x++) {
      const rel = (x - cx) / sigma
      const y = (H - 40) - 50 * Math.exp(-rel * rel / 2)
      x === 50 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.stroke(); ctx.shadowBlur = 0
    ctx.fillStyle = "rgba(168,85,247,0.12)"
    ctx.beginPath()
    for (let x = 50; x <= W - 50; x++) {
      const rel = (x - cx) / sigma
      const y = (H - 40) - 50 * Math.exp(-rel * rel / 2)
      x === 50 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.lineTo(W - 50, H - 40); ctx.lineTo(50, H - 40); ctx.closePath(); ctx.fill()

    ctx.fillStyle = "#a855f7"; ctx.font = "bold 11px monospace"; ctx.textAlign = "center"
    ctx.fillText(`Δν½ ≈ ${widthHz} Hz (T=${harorat} K)`, cx, 35)
    ctx.fillStyle = "#7c6a9e"; ctx.font = "10px sans-serif"
    for (let ppm = 20; ppm >= -10; ppm -= 5) {
      const x = 50 + ((20 - ppm) / 30) * (W - 100); ctx.fillText(ppm, x, H - 25)
    }
    ctx.fillText("δ (ppm)", W / 2, H - 8)
    ctx.fillText("Signal juda keng — EPR tavsiya qilinadi!", W / 2, H - 55)

  }, [harorat, widthHz])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-sm">
        <span className="text-purple-400">Harorat:</span>
        <input type="range" min="200" max="380" value={harorat} onChange={(e) => setHarorat(+e.target.value)} className="flex-1 h-1.5 bg-purple-800 rounded-full appearance-none cursor-pointer accent-purple-400" />
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
export default function CrH2O6_YaMR() {
  const [activeTab, setActiveTab] = useState("spektr")

  const tabs = [
    { id: "spektr",      label: "📈 ¹H YaMR Spektri" },
    { id: "interaktiv",  label: "🎮 Interaktiv simulyatsiya" },
    { id: "paramagnit",  label: "🧲 Paramagnit (S=3/2)" },
    { id: "epr",         label: "📡 EPR vs YaMR" },
    { id: "izomeriya",   label: "🔄 Gidrat izomeriyasi" },
    { id: "inert",       label: "🐢 Kinetik inertlik" },
    { id: "taqqos",      label: "⚖️ Cr³⁺ komplekslari" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil/nmr/birikmalar" className="text-purple-400 hover:text-purple-300 text-lg">← YaMR birikmalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">🧲 [Cr(H₂O)₆]³⁺ — YaMR spektri tahlili</h1>
          <p className="text-purple-400 text-sm">geksaakvaxrom(III) ioni • d³ paramagnit • EPR afzal • Eng inert akva kompleks</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── HERO ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs font-semibold">¹H YaMR</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">Paramagnit (S=3/2)</span>
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs">d³</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">INERT (t½≈80 soat)</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">EPR afzal</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">Gidrat izomeriyasi</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent" style={{ fontFamily: "'Syne', sans-serif" }}>[Cr(H₂O)₆]³⁺</h2>
            <span className="text-purple-400 text-lg">160.07 g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">geksaakvaxrom(III) ioni — <span className="text-purple-400 italic">d³ paramagnit, eng inert akva kompleks</span></p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-yellow-400">YaMR spektri</strong> — Cr³⁺ (d³, S=3/2) 
            <strong className="text-yellow-400"> kuchli paramagnit</strong>. 3 ta toq elektron —
            T₁e juda qisqa (~10⁻¹² s). <strong className="text-yellow-400">¹H YaMR:</strong> signallar 
            juda keng (~1500 Hz), deyarli ko'rinmaydi.
            <strong className="text-yellow-400"> EPR:</strong> Cr³⁺ uchun informativ — g≈1.98 (O<sub>h</sub>),
            kuchsiz nolinchi maydon ajralishi (ZFS≈0.5−1 cm⁻¹).
            <strong className="text-yellow-400"> Gidrat izomeriyasi:</strong> CrCl₃·6H₂O — 3 xil izomer
            (binafsha, och yashil, to'q yashil). YaMR ularni farqlash imkonini beradi!
            <strong className="text-yellow-400"> Inertlik:</strong> t½≈80 soat — eng sekin suv almashinuvi.
            Shu tufayli alohida signallar ko'rish mumkin (sekin almashinuv rejimi).
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[["¹H signal","Juda keng (~1500 Hz)"],["S","3/2"],["μ<sub>eff</sub>","3.87 μ<sub>B</sub>"],["T₁e","~10⁻¹² s"],
              ["KMBE","−1.2Δ<sub>o</sub>"],["t½","~80 soat!"],["EPR","g≈1.98"],["Δ<sub>o</sub>","17,400 cm⁻¹"],
              ["Rang","Binafsha"],["Geometriya","Oktaedrik"],["3 xil izomer","CrCl₃·6H₂O"],["Erituvchi","D₂O"],
            ].map((r,i)=>(<div key={i} className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30"><div className="text-purple-400 text-xs mb-1" dangerouslySetInnerHTML={{__html:r[0]}}/><div className="text-white font-bold text-sm">{r[1]}</div></div>))}
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map(tab=>(<button key={tab.id} onClick={()=>setActiveTab(tab.id)} className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${activeTab===tab.id?"bg-purple-600/40 text-white border border-purple-400/50":"bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"}`}>{tab.label}</button>))}
        </div>

        {/* ── SPEKTR ── */}
        {activeTab==="spektr"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">📈 ¹H YaMR — deyarli ko'rinmaydi</h2><div className="bg-purple-800/30 rounded-xl p-6 border border-purple-700/30"><div className="text-center"><svg viewBox="0 0 500 100" className="w-96 h-20 mx-auto"><line x1="30" y1="50" x2="470" y2="50" stroke="#3d2a5c" strokeWidth="0.5"/><path d="M 50 50 Q 250 50, 450 50" stroke="#a855f7" strokeWidth="10" fill="none" opacity="0.3" strokeLinecap="round"/><text x="250" y="28" fill="#a855f7" fontSize="10" fontFamily="monospace" textAnchor="middle">Δν½ ≈ 1000−2000 Hz</text></svg><p className="text-purple-300 text-sm mt-2">S=3/2, T₁e≈10⁻¹² s — signallar juda keng</p></div></div><div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5"><p className="text-purple-200 text-sm"><strong className="text-yellow-400">Lekin!</strong> Cr³⁺ ning sekin suv almashinuvi (t½≈80 soat) tufayli koordinatsiyalangan va erkin suv signallari alohida ko'rinishi mumkin (sekin almashinuv rejimi). Bu — YaMR uchun noyob imkoniyat!</p></div></div>)}

        {/* ── INTERAKTIV ── */}
        {activeTab==="interaktiv"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">🎮 Interaktiv simulyatsiya</h2><ParamagnitSimulyatsiya /></div>)}

        {/* ── PARAMAGNIT ── */}
        {activeTab==="paramagnit"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">🧲 Cr³⁺ paramagnit xususiyatlari</h2><div className="space-y-4">{[{t:"S=3/2 — 3 ta toq elektron",d:"d³ (t₂g³) — t₂g orbitallar yarim to'lgan. Har bir t₂g orbitalda bittadan elektron (Hund qoidasi). S=3/2."},{t:"T₁e ≈ 10⁻¹² s",d:"Juda qisqa elektron spin relaksatsiyasi. Sababi: t₂g orbitallardagi elektronlar orasidagi almashinuv ta'siri kuchsiz — spin-flip oson."},{t:"KMBE = −1.2Δo",d:"t₂g³ konfiguratsiya — KMBE yuqori. Bu inertlikka sabab. YaMR signal kengligiga bevosita ta'sir qilmaydi, lekin suv almashinuvini sekinlashtiradi."},{t:"A₂g asosiy term",d:"Orbital hissa deyarli yo'q — μeff≈μSO=3.87 μB. EPR da g≈1.98 (izotrop)."}].map((r,i)=>(<div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30"><h3 className="text-yellow-400 font-bold mb-1">{r.t}</h3><p className="text-purple-200 text-sm">{r.d}</p></div>))}</div></div>)}

        {/* ── EPR ── */}
        {activeTab==="epr"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">📡 EPR — Cr³⁺ uchun afzal</h2><p className="text-purple-200 leading-relaxed">Cr³⁺ (S=3/2) — EPR da <strong className="text-yellow-400">kuchsiz nolinchi maydon ajralishi</strong> (ZFS≈0.5−1 cm⁻¹). O<sub>h</sub> simmetriyada g≈1.98.</p><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-purple-700"><th className="py-3 px-4">Parametr</th><th className="py-3 px-4">¹H YaMR</th><th className="py-3 px-4">EPR</th></tr></thead><tbody className="text-purple-200">{[["Signal","Juda keng (~1500 Hz)","~50−200 G"],["Sezgirlik","Juda past","Yuqori"],["g-faktor","—","g≈1.98 (izotrop)"],["ZFS","—","~0.5−1 cm⁻¹"],["⁵³Cr gipernozik","—","I=3/2 (9.5%)"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td><td className="py-3 px-4 text-sm">{r[1]}</td><td className="py-3 px-4 text-green-400 text-sm">{r[2]}</td></tr>))}</tbody></table></div></div>)}

        {/* ── IZOMERIYA ── */}
        {activeTab==="izomeriya"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">🔄 Gidrat izomeriyasi — YaMR farqi</h2><p className="text-purple-200 leading-relaxed">CrCl₃·6H₂O — <strong className="text-yellow-400">gidrat izomeriyasining klassik namunasi</strong>. 3 xil izomer, YaMR ularni farqlaydi.</p><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-purple-700"><th className="py-3 px-4">Izomer</th><th className="py-3 px-4">Tarkibi</th><th className="py-3 px-4">Rangi</th><th className="py-3 px-4">¹H YaMR</th></tr></thead><tbody className="text-purple-200">{[["Binafsha","[Cr(H₂O)₆]Cl₃","Binafsha","Faqat koord. H₂O signali (keng)"],["Och yashil","[Cr(H₂O)₅Cl]Cl₂·H₂O","Och yashil","Koord. H₂O + kristallizatsion H₂O"],["To'q yashil","[Cr(H₂O)₄Cl₂]Cl·2H₂O","To'q yashil","Koord. H₂O + 2× kristallizatsion H₂O"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td><td className="py-3 px-4 text-sm">{r[1]}</td><td className="py-3 px-4">{r[2]}</td><td className="py-3 px-4 text-sm">{r[3]}</td></tr>))}</tbody></table></div><div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5"><p className="text-purple-200 text-sm"><strong>YaMR diagnostikasi:</strong> Binafsha izomerda faqat koordinatsiyalangan suv signali. Yashil izomerlarda qo'shimcha kristallizatsion suv signallari — intensivlik nisbati orqali izomerni aniqlash mumkin.</p></div></div>)}

        {/* ── INERTLIK ── */}
        {activeTab==="inert"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">🐢 Kinetik inertlik — YaMR uchun afzallik!</h2><p className="text-purple-200 leading-relaxed">[Cr(H₂O)₆]³⁺ — <strong className="text-yellow-400">eng inert akva kompleks</strong>. t½≈80 soat. Sekin suv almashinuvi YaMR uchun <strong>noyob imkoniyat</strong> yaratadi!</p><div className="grid grid-cols-2 gap-4"><div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30"><h3 className="text-red-400 font-bold mb-2">Nima uchun inert?</h3><p className="text-purple-200 text-sm">d³ (t₂g³) — yarim to'lgan t₂g. Almashinuv energiyasi qo'shimcha barqarorlik beradi. KMBE=−1.2Δo.</p></div><div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5"><h3 className="text-green-400 font-bold mb-2">YaMR afzalligi</h3><p className="text-purple-200 text-sm">Sekin almashinuv = alohida signallar! Koordinatsiyalangan va erkin suv signallari birlashmaydi — ularni alohida ko'rish mumkin.</p></div></div><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-purple-700"><th className="py-3 px-4">Ion</th><th className="py-3 px-4">k<sub>H₂O</sub></th><th className="py-3 px-4">t½</th><th className="py-3 px-4">YaMR rejimi</th></tr></thead><tbody className="text-purple-200">{[["[Cr(H₂O)₆]³⁺","2.4×10⁻⁶ s⁻¹","~80 soat","Sekin — alohida signallar"],["[Cu(H₂O)₆]²⁺","4.4×10⁹ s⁻¹","160 ps","Tez — o'rtacha signal"],["[Ni(H₂O)₆]²⁺","3.2×10⁴ s⁻¹","22 μs","Oraliq"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td><td className="py-3 px-4 font-mono text-green-400">{r[1]}</td><td className="py-3 px-4 text-sm">{r[2]}</td><td className="py-3 px-4 text-sm">{r[3]}</td></tr>))}</tbody></table></div></div>)}

        {/* ── TAQQOSLASH ── */}
        {activeTab==="taqqos"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">⚖️ Cr³⁺ komplekslari</h2><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-purple-700"><th className="py-3 px-4">Kompleks</th><th className="py-3 px-4">Ligand</th><th className="py-3 px-4">Δo (cm⁻¹)</th><th className="py-3 px-4">¹H YaMR</th></tr></thead><tbody className="text-purple-200">{[["[Cr(H₂O)₆]³⁺","H₂O","17,400","Juda keng"],["[Cr(NH₃)₆]³⁺","NH₃","21,550","Juda keng"],["[Cr(en)₃]³⁺","en","22,300","Juda keng"],["[Cr(CN)₆]³⁻","CN⁻","26,700","Keng (CN⁻ yo'q)"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td><td className="py-3 px-4">{r[1]}</td><td className="py-3 px-4 font-mono text-green-400">{r[2]}</td><td className="py-3 px-4 text-sm">{r[3]}</td></tr>))}</tbody></table></div></div>)}

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-2xl p-8"><h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2><ol className="space-y-2 text-purple-200 list-decimal list-inside"><li><strong className="text-yellow-400">S=3/2 paramagnit</strong> — ¹H YaMR signallari juda keng</li><li><strong className="text-yellow-400">EPR afzal:</strong> g≈1.98, ZFS≈0.5−1 cm⁻¹</li><li><strong className="text-yellow-400">Sekin almashinuv (t½≈80 soat)</strong> — alohida signallar ko'rish mumkin!</li><li><strong className="text-yellow-400">Gidrat izomeriyasi:</strong> 3 xil izomer — YaMR farqi</li></ol></div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6"><Link href="/ilmiy/tahlil/nmr/birikmalar/zn-oh4" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← [Zn(OH)₄]²⁻</Link><Link href="/ilmiy/tahlil/nmr/birikmalar" className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 text-white font-semibold">Barcha birikmalar →</Link></div>

      </section>
    </main>
  )
}