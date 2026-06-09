
"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"

// ── INTERAKTIV PARAMAGNIT SIMULYATSIYA ──────────────────────────────────────
function ParamagnitSimulyatsiya() {
  const [harorat, setHarorat] = useState(298)
  const [maydon, setMaydon] = useState(11.7)
  const canvasRef = useRef(null)

  const mhz = Math.round(maydon * 42.577 / 4.7)
  const baseWidth = 800
  const widthHz = Math.round(baseWidth * (298 / harorat) * (maydon / 11.7))
  const widthPpm = (widthHz / mhz).toFixed(1)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const W = canvas.width, H = canvas.height
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = "#0f0a1a"; ctx.fillRect(0, 0, W, H)

    // Grid
    ctx.strokeStyle = "#2a1f3d"; ctx.lineWidth = 0.5
    for (let ppm = 15; ppm >= -5; ppm -= 2) {
      const x = 50 + ((15 - ppm) / 20) * (W - 100)
      ctx.beginPath(); ctx.moveTo(x, 20); ctx.lineTo(x, H - 40); ctx.stroke()
    }
    ctx.strokeStyle = "#3d2a5c"; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(50, H - 40); ctx.lineTo(W - 50, H - 40); ctx.stroke()

    // Signal — juda keng
    const cx = W / 2
    const sigma = widthPpm * 15

    ctx.beginPath()
    ctx.strokeStyle = "#60a5fa"; ctx.lineWidth = 3; ctx.shadowBlur = 10; ctx.shadowColor = "#60a5fa"
    for (let x = 50; x <= W - 50; x++) {
      const rel = (x - cx) / sigma
      const y = (H - 40) - 60 * Math.exp(-rel * rel / 2)
      x === 50 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.stroke(); ctx.shadowBlur = 0

    // Fill
    ctx.beginPath()
    for (let x = 50; x <= W - 50; x++) {
      const rel = (x - cx) / sigma
      const y = (H - 40) - 60 * Math.exp(-rel * rel / 2)
      x === 50 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.lineTo(W - 50, H - 40); ctx.lineTo(50, H - 40); ctx.closePath()
    ctx.fillStyle = "rgba(96,165,250,0.15)"; ctx.fill()

    // Belgilar
    ctx.fillStyle = "#60a5fa"; ctx.font = "bold 11px monospace"; ctx.textAlign = "center"
    ctx.fillText(`Δν½ ≈ ${widthHz} Hz (${widthPpm} ppm)`, cx, 40)
    ctx.fillText(`T = ${harorat} K, B₀ = ${mhz} MHz`, cx, 58)
    ctx.fillStyle = "#7c6a9e"; ctx.font = "10px sans-serif"
    for (let ppm = 15; ppm >= -5; ppm -= 2) {
      const x = 50 + ((15 - ppm) / 20) * (W - 100)
      ctx.fillText(ppm, x, H - 25)
    }
    ctx.fillText("δ (ppm)", W / 2, H - 8)
    ctx.fillText("Signal deyarli ko'rinmaydi — EPR tavsiya qilinadi!", W / 2, H - 60)

  }, [harorat, maydon, widthHz, widthPpm, mhz])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-sm">
        <span className="text-purple-400">Harorat:</span>
        <input type="range" min="200" max="380" value={harorat} onChange={(e) => setHarorat(+e.target.value)} className="flex-1 h-1.5 bg-purple-800 rounded-full appearance-none cursor-pointer accent-blue-400" />
        <span className="text-purple-300 font-mono w-16 text-right">{harorat} K</span>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <span className="text-purple-400">B₀:</span>
        <input type="range" min="4.7" max="18.8" step="0.1" value={maydon} onChange={(e) => setMaydon(+e.target.value)} className="flex-1 h-1.5 bg-purple-800 rounded-full appearance-none cursor-pointer accent-blue-400" />
        <span className="text-purple-300 font-mono w-16 text-right">{mhz} MHz</span>
      </div>
      <canvas ref={canvasRef} width={700} height={180} className="w-full h-auto rounded-lg border border-purple-700/30" />
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-purple-800/30 rounded-xl p-3 border border-purple-700/30"><div className="text-purple-400 text-xs">Signal kengligi</div><div className="text-white font-mono font-bold">{widthHz} Hz</div></div>
        <div className="bg-purple-800/30 rounded-xl p-3 border border-purple-700/30"><div className="text-purple-400 text-xs">ppm da</div><div className="text-white font-mono font-bold">{widthPpm} ppm</div></div>
        <div className="bg-purple-800/30 rounded-xl p-3 border border-purple-700/30"><div className="text-purple-400 text-xs">T₁ (taxminiy)</div><div className="text-white font-mono font-bold">~{(0.001*(harorat/298)).toFixed(4)} s</div></div>
      </div>
      <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-4 text-center"><p className="text-blue-300 text-xs">Harorat oshishi bilan signal torayadi, lekin baribir juda keng — YaMR uchun yaroqsiz.</p></div>
    </div>
  )
}

// ── PRE FORMULASI ────────────────────────────────────────────────────────────
function PREFormulasi() {
  return (
    <div className="space-y-6">
      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4"><strong className="text-yellow-400">PRE (Paramagnetic Relaxation Enhancement)</strong> — Cu²⁺ (S=½) uchun Solomon-Bloembergen tenglamasi.</p>
        <div className="bg-purple-950/50 border border-purple-700/30 rounded-lg p-4 font-mono text-xs text-green-400 mb-4">R₁<sup>PRE</sup> = (2/15)·(μ₀/4π)²·γ²·g²·μ<sub>B</sub>²·S(S+1)·[7τ<sub>c</sub>/(1+ω<sub>S</sub>²τ<sub>c</sub>²)]·r⁻⁶</div>
        <div className="space-y-2 text-sm">
          {[["S","½ (Cu²⁺)"],["τ<sub>c</sub>","~10⁻⁸−10⁻⁹ s (T₁e)"],["r (Cu−H aksial)","~3.1 Å (uzoqroq — kuchsizroq PRE)"],["r (Cu−H ekvatorial)","~2.8 Å (yaqinroq — kuchliroq PRE)"],["r⁻⁶ ta'siri","Aksial protonlar PRE ekvatorialdan ~2× kuchsiz"]].map((r,i)=>(<div key={i} className="flex justify-between py-1.5 border-b border-purple-700/30"><span className="text-purple-400">{r[0]}</span><span className="text-purple-200 text-right" dangerouslySetInnerHTML={{__html:r[1]}}/></div>))}
        </div>
      </div>
      <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5"><p className="text-yellow-300 text-sm"><strong>Yan-Teller ta'siri:</strong> Aksial va ekvatorial suv protonlari har xil masofada — PRE kuchi har xil. Nazariy jihatdan ikkita har xil kenglikdagi signal kutiladi, lekin tez almashinuv tufayli ular birlashib ketadi.</p></div>
    </div>
  )
}

// ── ASOSIY SAHIFA ────────────────────────────────────────────────────────────
export default function CuH2O6_YaMR() {
  const [activeTab, setActiveTab] = useState("spektr")

  const tabs = [
    { id: "spektr",      label: "📈 ¹H YaMR Spektri" },
    { id: "interaktiv",  label: "🎮 Interaktiv simulyatsiya" },
    { id: "pre",         label: "📐 PRE formulasi" },
    { id: "paramagnit",  label: "🧲 Paramagnit kengayish" },
    { id: "yanteller",   label: "⚡ Yan-Teller va YaMR" },
    { id: "epr",         label: "📡 EPR vs YaMR" },
    { id: "almashinuv",  label: "💧 Suv almashinuvi" },
    { id: "o17",         label: "🔬 ¹⁷O YaMR" },
    { id: "taqqos",      label: "⚖️ Boshqa Cu²⁺ komplekslari" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil/nmr/birikmalar" className="text-purple-400 hover:text-purple-300 text-lg">← YaMR birikmalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">🧲 [Cu(H₂O)₆]²⁺ — YaMR spektri tahlili</h1>
          <p className="text-purple-400 text-sm">geksaakvamis(II) ioni • Paramagnit • EPR afzal • Yan-Teller • ¹⁷O YaMR</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── HERO ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs font-semibold">¹H + ¹⁷O YaMR</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">Paramagnit (S=½)</span>
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs">d⁹</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Yan-Teller</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">EPR afzal!</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">Suv almashinuvi: 10⁹ s⁻¹</span>
            <span className="bg-cyan-600/20 text-cyan-400 border border-cyan-600/30 px-3 py-1 rounded-full text-xs">PRE effekti</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent" style={{ fontFamily: "'Syne', sans-serif" }}>[Cu(H₂O)₆]²⁺</h2>
            <span className="text-purple-400 text-lg">171.66 g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">geksaakvamis(II) ioni — <span className="text-blue-400 italic">Yan-Teller, paramagnit, eng tez suv almashinuvi</span></p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-yellow-400">YaMR spektri</strong> — Cu²⁺ (d⁹, S=½) paramagnit.
            <strong className="text-yellow-400"> ¹H YaMR:</strong> signal juda keng (500−2000 Hz) — deyarli ko'rinmaydi.
            <strong className="text-yellow-400"> ¹⁷O YaMR:</strong> suv molekulasidagi kislorod orqali kuzatish mumkin —
            paramagnit siljish va kengayish suv almashinish tezligini o'lchash imkonini beradi.
            <strong className="text-yellow-400"> EPR:</strong> Cu²⁺ uchun ideal — g∥≈2.35, g⊥≈2.07,
            ⁶³Cu/⁶⁵Cu gipernozik struktura (I=3/2). <strong className="text-yellow-400">Interaktiv simulyatsiya</strong> —
            harorat va magnit maydon ta'sirini ko'ring!
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[["¹H signal","Juda keng (500−2000 Hz)"],["¹⁷O signal","Keng, informativ"],["Sabab","Paramagnit Cu²⁺ (S=½)"],["EPR","Afzal usul"],
              ["g∥","2.35"],["g⊥","2.07"],["I(⁶³Cu)","3/2"],["μ<sub>eff</sub>","1.7−2.2 μ<sub>B</sub>"],
              ["Suv almashinuvi","4.4×10⁹ s⁻¹"],["t½","160 ps"],["T₁e","~10⁻⁸−10⁻⁹ s"],["Geometriya","Cho'zilgan oktaedr"],
            ].map((r,i)=>(<div key={i} className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30"><div className="text-purple-400 text-xs mb-1" dangerouslySetInnerHTML={{__html:r[0]}}/><div className="text-white font-bold text-sm">{r[1]}</div></div>))}
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map(tab=>(<button key={tab.id} onClick={()=>setActiveTab(tab.id)} className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${activeTab===tab.id?"bg-blue-600/40 text-white border border-blue-400/50":"bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"}`}>{tab.label}</button>))}
        </div>

        {/* ── SPEKTR ── */}
        {activeTab==="spektr"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">📈 ¹H YaMR Spektri — deyarli ko'rinmaydi</h2><div className="bg-purple-800/30 rounded-xl p-6 border border-purple-700/30"><div className="text-center space-y-4"><svg viewBox="0 0 500 100" className="w-96 h-20 mx-auto"><line x1="30" y1="50" x2="470" y2="50" stroke="#3d2a5c" strokeWidth="0.5"/><path d="M 80 50 Q 250 50, 420 50" stroke="#60a5fa" strokeWidth="10" fill="none" opacity="0.35" strokeLinecap="round"/><text x="250" y="28" fill="#60a5fa" fontSize="10" fontFamily="monospace" textAnchor="middle">Δν½ ≈ 500−2000 Hz</text></svg><p className="text-purple-300 text-sm">Signal shu qadar kengki — amalda asosiy chiziqdan farq qilmaydi</p></div></div><div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5"><p className="text-purple-200 text-sm"><strong className="text-yellow-400">Nega YaMR ishlamaydi?</strong> T₁e≈10⁻⁸−10⁻⁹ s — yadro relaksatsiyasini tezlashtiradi. Signal/Shovqin nisbati juda past. EPR yoki ¹⁷O YaMR tavsiya qilinadi.</p></div></div>)}

        {/* ── INTERAKTIV ── */}
        {activeTab==="interaktiv"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">🎮 Interaktiv simulyatsiya</h2><ParamagnitSimulyatsiya /></div>)}

        {/* ── PRE ── */}
        {activeTab==="pre"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">📐 PRE formulasi — Cu²⁺ uchun</h2><PREFormulasi /></div>)}

        {/* ── PARAMAGNIT ── */}
        {activeTab==="paramagnit"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">🧲 Paramagnit kengayish mexanizmi</h2><div className="space-y-4">{[{t:"1. Elektron spin relaksatsiyasi (T₁e)",d:"Cu²⁺ (d⁹, S=½) — T₁e≈10⁻⁸−10⁻⁹ s. Bu — 3d metallar orasida eng sekin T₁e (Cu²⁺ uchun xos). Sekin T₁e — kuchliroq PRE."},{t:"2. Kyuri relaksatsiyasi",d:"Paramagnit moment (μ≈1.7−2.2 μB) tashqi maydonda qutblanadi → mahalliy magnit maydon → signal kengayadi va siljiydi. χ∝1/T — harorat ortganda kamayadi."},{t:"3. r⁻⁶ masofaga bog'liqlik",d:"PRE∝r⁻⁶. Aksial suv (Cu−O=2.28 Å) protonlari uzoqroq — kuchsizroq PRE. Ekvatorial suv (Cu−O=1.97 Å) protonlari yaqinroq — kuchliroq PRE. Yan-Teller farqi ~2×."},{t:"4. Nima uchun Cu²⁺ maxsus?",d:"Cu²⁺ (3d⁹) — T₁e boshqa 3d ionlarga nisbatan sekin (10⁻⁸−10⁻⁹ vs 10⁻¹⁰−10⁻¹² s). Bu — YaMR signallarini biroz ko'rinadigan qiladi (lekin baribir juda keng). Mn²⁺, Fe³⁺ da T₁e juda qisqa — signallar umuman ko'rinmaydi."}].map((r,i)=>(<div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30"><h3 className="text-yellow-400 font-bold mb-1">{r.t}</h3><p className="text-purple-200 text-sm">{r.d}</p></div>))}</div></div>)}

        {/* ── YAN-TELLER ── */}
        {activeTab==="yanteller"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">⚡ Yan-Teller va YaMR — 4+2 geometriya</h2><p className="text-purple-200 leading-relaxed">Cu²⁺ (d⁹, eg³) — Yan-Teller buzilishi: oktaedr cho'zilgan. 4 ta ekvatorial suv (qisqa, 1.97 Å) + 2 ta aksial suv (uzun, 2.28 Å).</p><div className="grid grid-cols-2 gap-4"><div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30"><h3 className="text-blue-400 font-bold mb-2">Ekvatorial suv (×4)</h3><p className="text-purple-200 text-sm">Cu−O: 1.97 Å<br/>Cu−H: ~2.8 Å<br/>PRE: KUCHLI<br/>Signal: Juda keng</p></div><div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30"><h3 className="text-cyan-400 font-bold mb-2">Aksial suv (×2)</h3><p className="text-purple-200 text-sm">Cu−O: 2.28 Å<br/>Cu−H: ~3.1 Å<br/>PRE: KUCHSIZROQ<br/>Signal: Keng (lekin torroq)</p></div></div><div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5"><p className="text-blue-300 text-sm"><strong>Dinamik Yan-Teller:</strong> Xona haroratida cho'zilish o'qi 3 ta yo'nalish orasida tebranadi. YaMR da bu — bitta o'rtacha keng signal ko'rinishida namoyon bo'ladi. Past haroratda (77 K) — ikkita alohida signal kutiladi (lekin baribir juda keng).</p></div></div>)}

        {/* ── EPR ── */}
        {activeTab==="epr"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">📡 EPR — Cu²⁺ uchun ideal usul</h2><p className="text-purple-200 leading-relaxed">Cu²⁺ (d⁹, S=½) — <strong className="text-yellow-400">EPR spektroskopiya uchun eng yaxshi obyektlardan biri</strong>.</p><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-purple-700"><th className="py-3 px-4">Parametr</th><th className="py-3 px-4">¹H YaMR</th><th className="py-3 px-4">¹⁷O YaMR</th><th className="py-3 px-4">EPR</th></tr></thead><tbody className="text-purple-200">{[["Kuzatiladigan obyekt","Yadro spini (¹H)","Yadro spini (¹⁷O)","Elektron spini"],["Signal sifati","Juda past","O'rtacha","Juda yaxshi"],["Signal kengligi","500−2000 Hz","100−500 Hz","10−100 G"],["Sezgirlik","Juda past","Past (¹⁷O 0.04%)","Yuqori (10⁻⁹ M)"],["g-faktor","—","—","g∥≈2.35, g⊥≈2.07"],["Gipernozik","—","—","⁶³Cu (I=3/2): 4 chiziq"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td><td className="py-3 px-4 text-sm">{r[1]}</td><td className="py-3 px-4 text-sm">{r[2]}</td><td className="py-3 px-4 text-green-400 text-sm">{r[3]}</td></tr>))}</tbody></table></div></div>)}

        {/* ── SUV ALMASHINUVI ── */}
        {activeTab==="almashinuv"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">💧 Suv almashinuvi — eng tez!</h2><p className="text-purple-200 leading-relaxed">[Cu(H₂O)₆]²⁺ — <strong className="text-yellow-400">eng tez suv almashinuvchi akva kompleks</strong>. k<sub>H₂O</sub>=4.4×10⁹ s⁻¹ (t½=160 ps).</p><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-purple-700"><th className="py-3 px-4">Ion</th><th className="py-3 px-4">k<sub>H₂O</sub> (s⁻¹)</th><th className="py-3 px-4">t½</th><th className="py-3 px-4">Mexanizm</th><th className="py-3 px-4">YaMR ko'rinishi</th></tr></thead><tbody className="text-purple-200">{[["[Cu(H₂O)₆]²⁺","4.4×10⁹","160 ps","I<sub>d</sub> (tez)","1 ta o'rtacha keng signal"],["[Cr(H₂O)₆]³⁺","2.4×10⁻⁶","80 soat","I<sub>a</sub> (sekin)","Alohida signallar"],["[Ni(H₂O)₆]²⁺","3.2×10⁴","22 μs","I<sub>d</sub>","Oraliq"],["[Co(H₂O)₆]²⁺","3.2×10⁶","220 ns","I<sub>d</sub>","1 ta o'rtacha signal"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td><td className="py-3 px-4 font-mono text-green-400">{r[1]}</td><td className="py-3 px-4 text-sm">{r[2]}</td><td className="py-3 px-4 text-sm">{r[3]}</td><td className="py-3 px-4 text-sm">{r[4]}</td></tr>))}</tbody></table></div></div>)}

        {/* ── ¹⁷O YaMR ── */}
        {activeTab==="o17"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">🔬 ¹⁷O YaMR — suv almashinuvini o'rganish</h2><p className="text-purple-200 leading-relaxed"><strong className="text-yellow-400">¹⁷O</strong> (I=5/2, tabiiy miqdori 0.037%) — suv molekulasidagi kislorod. Paramagnit Cu²⁺ ta'sirida ¹⁷O signali <strong>siljiydi va kengayadi</strong>. Bu siljish va kengayish suv almashinish tezligini hisoblash imkonini beradi.</p><div className="space-y-3">{[["Kuzatiladigan parametr","Paramagnit siljish (Δω) va kengayish (Δν½)"],["Hisoblanadigan kattalik","Suv almashinish tezlik konstantasi (k<sub>ex</sub>)"],["Afzalligi","¹H ga nisbatan torroq signal — yaxshiroq aniqlik"],["Kamchiligi","¹⁷O tabiiy miqdori juda past — boyitish kerak"],["Qo'llanilishi","Suv almashinish kinetikasi, MRI kontrast moddalar"]].map((r,i)=>(<div key={i} className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30"><div className="flex justify-between text-sm"><span className="text-yellow-400 font-bold">{r[0]}</span><span className="text-purple-200">{r[1]}</span></div></div>))}</div></div>)}

        {/* ── TAQQOSLASH ── */}
        {activeTab==="taqqos"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">⚖️ Boshqa Cu²⁺ komplekslari YaMR</h2><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-purple-700"><th className="py-3 px-4">Kompleks</th><th className="py-3 px-4">Geometriya</th><th className="py-3 px-4">Magnit</th><th className="py-3 px-4">¹H YaMR</th><th className="py-3 px-4">EPR</th></tr></thead><tbody className="text-purple-200">{[["[Cu(H₂O)₆]²⁺","Cho'zilgan O<sub>h</sub>","Paramagnit","Juda keng","Yaxshi"],["[Cu(NH₃)₄(H₂O)₂]²⁺","Cho'zilgan O<sub>h</sub>","Paramagnit","Keng","Yaxshi"],["[CuCl₄]²⁻","Tetraedrik","Paramagnit","Keng","Yaxshi"],["[Cu(CN)₄]²⁻","Kvadrat-planar","Diamagnit!","O'tkir!","Signal yo'q"],["[Cu(acac)₂]","Kvadrat-planar","Paramagnit","Keng","Yaxshi"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td><td className="py-3 px-4 text-sm">{r[1]}</td><td className="py-3 px-4">{r[2]}</td><td className="py-3 px-4 text-sm">{r[3]}</td><td className="py-3 px-4 text-sm">{r[4]}</td></tr>))}</tbody></table></div></div>)}

        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8"><h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2><ol className="space-y-2 text-purple-200 list-decimal list-inside"><li><strong className="text-yellow-400">¹H YaMR deyarli yaroqsiz</strong> — paramagnit Cu²⁺ (S=½), Δν½≈500−2000 Hz</li><li><strong className="text-yellow-400">EPR afzal:</strong> g∥≈2.35, g⊥≈2.07, ⁶³Cu gipernozik struktura</li><li><strong className="text-yellow-400">¹⁷O YaMR:</strong> suv almashinuvini o'rganish uchun informativ</li><li><strong className="text-yellow-400">Yan-Teller:</strong> aksial/ekvatorial suvlar — har xil PRE (r⁻⁶)</li><li><strong className="text-yellow-400">Eng tez suv almashinuvi:</strong> 4.4×10⁹ s⁻¹ (t½=160 ps)</li></ol></div>

        <div className="flex justify-between pt-6"><Link href="/ilmiy/tahlil/nmr/birikmalar/ni-cn4" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← [Ni(CN)₄]²⁻</Link><Link href="/ilmiy/tahlil/nmr/birikmalar/ag-nh3-2" className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 text-white font-semibold">[Ag(NH₃)₂]⁺ →</Link></div>

      </section>
    </main>
  )
}