"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"

// ── INTERAKTIV SPEKTR SIMULYATSIYASI ────────────────────────────────────────
function InteraktivSpektr() {
  const [harorat, setHarorat] = useState(298)
  const [maydon, setMaydon] = useState(11.7)
  const canvasRef = useRef(null)

  const mhz = Math.round(maydon * 42.577 / 4.7)
  const baseWidth = 300
  const widthHz = Math.round(baseWidth * (298 / harorat) * (maydon / 11.7))
  const widthPpm = (widthHz / mhz).toFixed(1)
  const t1 = (0.05 * (harorat / 298) * (11.7 / maydon)).toFixed(3)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const W = canvas.width, H = canvas.height
    ctx.clearRect(0, 0, W, H)
    
    // Fon
    ctx.fillStyle = "#0f0a1a"
    ctx.fillRect(0, 0, W, H)

    // Asosiy chiziq
    ctx.strokeStyle = "#3d2a5c"
    ctx.lineWidth = 0.5
    ctx.beginPath(); ctx.moveTo(40, H - 40); ctx.lineTo(W - 40, H - 40); ctx.stroke()

    // X o'qi belgilari
    ctx.fillStyle = "#7c6a9e"; ctx.font = "10px sans-serif"; ctx.textAlign = "center"
    ;[{x: 60, ppm: 200}, {x: 220, ppm: 150}, {x: 380, ppm: 100}, {x: 540, ppm: 50}, {x: 700, ppm: 0}].forEach(p => {
      ctx.fillText(p.ppm, p.x, H - 25)
    })

    // Reference chiziq (δ 135)
    const centerX = 350
    ctx.strokeStyle = "#5a4a7a"; ctx.lineWidth = 0.5; ctx.setLineDash([3, 3])
    ctx.beginPath(); ctx.moveTo(centerX, 20); ctx.lineTo(centerX, H - 40); ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = "#7c6a9e"; ctx.fillText("δ 135", centerX, 16)

    // K₄[Fe(CN)₆] — o'tkir signal (δ 177)
    const sharpX = 230
    ctx.strokeStyle = "#6ea8da"; ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.moveTo(sharpX, H - 40); ctx.lineTo(sharpX, H - 150); ctx.stroke()
    ctx.fillStyle = "#6ea8da"; ctx.font = "9px sans-serif"; ctx.textAlign = "center"
    ctx.fillText("K₄[Fe(CN)₆]", sharpX, H - 158)
    ctx.fillText("δ 177", sharpX, H - 10)

    // K₃[Fe(CN)₆] — keng signal
    const sigma = 40 + (widthHz / 300) * 60
    const height = 120 / (sigma / 40)
    
    ctx.beginPath()
    let firstPoint = true
    for (let x = 60; x <= 700; x += 2) {
      const rel = x - centerX
      const y = (H - 40) - height * Math.exp(-rel * rel / (2 * sigma * sigma))
      if (firstPoint) { ctx.moveTo(x, y); firstPoint = false }
      else ctx.lineTo(x, y)
    }
    ctx.lineTo(700, H - 40)
    ctx.lineTo(60, H - 40)
    ctx.closePath()
    
    ctx.fillStyle = "rgba(220,60,60,0.15)"
    ctx.fill()
    ctx.strokeStyle = "#dc3c3c"
    ctx.lineWidth = 1.2
    ctx.stroke()

    ctx.fillStyle = "#dc3c3c"; ctx.font = "bold 10px sans-serif"; ctx.textAlign = "center"
    ctx.fillText("K₃[Fe(CN)₆]", centerX, H - 155)
    ctx.fillStyle = "#7c6a9e"; ctx.font = "9px sans-serif"
    ctx.fillText(`Kenglik: ${widthHz} Hz`, W - 80, 16)

    // Sarlavha
    ctx.fillStyle = "#9a8abf"; ctx.font = "bold 11px sans-serif"; ctx.textAlign = "left"
    ctx.fillText("¹³C YaMR Simulyatsiyasi", 40, 16)

  }, [harorat, maydon, widthHz])

  return (
    <div className="space-y-6">
      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
        <div className="flex items-center justify-between mb-4">
          <span className="text-white font-semibold text-sm">¹³C YaMR simulyatsiyasi</span>
          <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">Paramagnit</span>
        </div>

        {/* Harorat slayderi */}
        <div className="flex items-center gap-3 mb-3 text-sm">
          <span className="text-purple-400 w-16">Harorat:</span>
          <input type="range" min="200" max="380" value={harorat} onChange={(e) => setHarorat(+e.target.value)}
            className="flex-1 h-1.5 bg-purple-800 rounded-full appearance-none cursor-pointer accent-red-400" />
          <span className="text-purple-300 font-mono w-16 text-right">{harorat} K</span>
        </div>

        {/* Maydon slayderi */}
        <div className="flex items-center gap-3 mb-4 text-sm">
          <span className="text-purple-400 w-16">B₀ maydoni:</span>
          <input type="range" min="4.7" max="18.8" step="0.1" value={maydon} onChange={(e) => setMaydon(+e.target.value)}
            className="flex-1 h-1.5 bg-purple-800 rounded-full appearance-none cursor-pointer accent-red-400" />
          <span className="text-purple-300 font-mono w-16 text-right">{mhz} MHz</span>
        </div>

        <canvas ref={canvasRef} width={780} height={200} className="w-full h-auto rounded-lg" />
      </div>

      {/* Statistikalar */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
          <div className="flex justify-between text-sm py-1.5 border-b border-purple-700/30">
            <span className="text-purple-400">Signal kengligi</span>
            <span className="text-white font-mono">{widthHz} Hz (~{widthPpm} ppm)</span>
          </div>
          <div className="flex justify-between text-sm py-1.5 border-b border-purple-700/30">
            <span className="text-purple-400">δ (¹³C CN⁻)</span>
            <span className="text-white font-mono">~135 ppm</span>
          </div>
          <div className="flex justify-between text-sm py-1.5">
            <span className="text-purple-400">T₁ (taxminiy)</span>
            <span className="text-white font-mono">~{t1} s</span>
          </div>
        </div>
        <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
          <div className="flex justify-between text-sm py-1.5 border-b border-purple-700/30">
            <span className="text-purple-400">S (spin)</span>
            <span className="text-white font-mono">½</span>
          </div>
          <div className="flex justify-between text-sm py-1.5 border-b border-purple-700/30">
            <span className="text-purple-400">μ<sub>eff</sub></span>
            <span className="text-white font-mono">2.20 μ<sub>B</sub></span>
          </div>
          <div className="flex justify-between text-sm py-1.5">
            <span className="text-purple-400">Elektron T₁e</span>
            <span className="text-white font-mono">~10⁻¹¹ s</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── PRE FORMULASI ────────────────────────────────────────────────────────────
function PREFormulasi() {
  return (
    <div className="space-y-6">
      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">PRE (Paramagnetic Relaxation Enhancement)</strong> — 
          paramagnit markazning yadro relaksatsiyasini qanchalik tezlashtirishi.
        </p>
        
        <p className="text-purple-400 text-xs font-semibold mb-2">Solomon-Bloembergen-Morgan tenglamasi:</p>
        <div className="bg-purple-950/50 border border-purple-700/30 rounded-lg p-4 font-mono text-xs text-green-400 mb-4">
          R₁<sup>PRE</sup> = (2/15) · (μ₀/4π)² · γᵢ² · g² · μ<sub>B</sub>² · S(S+1) · [7τ<sub>c</sub>/(1+ω<sub>S</sub>²τ<sub>c</sub>²) + 3τ<sub>c</sub>/(1+ω<sub>I</sub>²τ<sub>c</sub>²)] · r⁻⁶
        </div>

        <div className="space-y-2 text-sm">
          {[
            ["γᵢ", "¹³C giromagnit nisbat (6.73 × 10⁷ rad/T·s)"],
            ["S", "elektron spin (Fe³⁺ uchun S = ½)"],
            ["τ<sub>c</sub>", "korrelyatsiya vaqti (~10⁻¹⁰−10⁻¹² s)"],
            ["r", "Fe–C masofa (CN⁻ da ~2.93 Å)"],
            ["r⁻⁶ ta'siri", "masofa 2× bo'lsa, PRE 64× kamayadi"],
          ].map((r, i) => (
            <div key={i} className="flex justify-between py-1.5 border-b border-purple-700/30">
              <span className="text-purple-400">{r[0]}</span>
              <span className="text-purple-200 text-right" dangerouslySetInnerHTML={{ __html: r[1] }} />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
        <p className="text-blue-300 text-sm">
          <strong>Nima uchun ¹³C kuchli ta'sir ko'radi?</strong> CN⁻ dagi uglerod atomi 
          Fe³⁺ ga juda yaqin (C orqali koordinatsiyalangan). r⁻⁶ bog'liqligi tufayli 
          bu yaqinlik PRE ni kattalashtirib, signalni sezilarli kengaytiradi.
        </p>
      </div>
    </div>
  )
}

// ── CURIE QONUNI ─────────────────────────────────────────────────────────────
function CurieQonuni() {
  const [harorat, setHarorat] = useState(298)
  const canvasRef = useRef(null)

  const chi298 = 1 / 298
  const chi = 1 / harorat
  const rel = (chi / chi298).toFixed(2)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const W = canvas.width, H = canvas.height
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = "#0f0a1a"
    ctx.fillRect(0, 0, W, H)

    // O'qlar
    ctx.strokeStyle = "#3d2a5c"; ctx.lineWidth = 0.5
    ctx.beginPath(); ctx.moveTo(40, H - 40); ctx.lineTo(W - 40, H - 40); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(40, 10); ctx.lineTo(40, H - 40); ctx.stroke()

    // Curie egri chizig'i
    ctx.beginPath()
    ctx.strokeStyle = "#a78bfa"; ctx.lineWidth = 1.5
    let firstPoint = true
    for (let t = 100; t <= 500; t += 5) {
      const x = 40 + (t - 100) * (500 / 400)
      const y = (H - 40) - Math.min(100, (298 / t) * 50)
      if (firstPoint) { ctx.moveTo(x, y); firstPoint = false }
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    // Indikator
    const ix = 40 + (harorat - 100) * (500 / 400)
    const iy = (H - 40) - Math.min(100, (298 / harorat) * 50)
    ctx.strokeStyle = "#5a4a7a"; ctx.lineWidth = 0.5; ctx.setLineDash([3, 3])
    ctx.beginPath(); ctx.moveTo(ix, 10); ctx.lineTo(ix, H - 40); ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = "#a78bfa"; ctx.beginPath(); ctx.arc(ix, iy, 5, 0, Math.PI * 2); ctx.fill()

    // Belgilar
    ctx.fillStyle = "#7c6a9e"; ctx.font = "10px sans-serif"; ctx.textAlign = "center"
    ctx.fillText("100", 40, H - 25); ctx.fillText("300", 280, H - 25); ctx.fillText("500", 500, H - 25)
    ctx.fillText("T (K) →", 500, H - 8)
    ctx.fillStyle = "#a78bfa"; ctx.font = "9px sans-serif"; ctx.textAlign = "left"
    ctx.fillText("χ (a.b.)", 42, 22)
    ctx.fillText(`T = ${harorat} K`, ix + 8, iy - 8)

  }, [harorat])

  return (
    <div className="space-y-6">
      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-400 text-xs font-semibold mb-2">Curie qonuni (paramagnit sezuvchanlik):</p>
        <div className="bg-purple-950/50 border border-purple-700/30 rounded-lg p-4 font-mono text-xs text-green-400 mb-2">
          χ = C / T → C = N·μ₀·μ<sub>eff</sub>² / (3k<sub>B</sub>)
        </div>
        <p className="text-purple-300 text-xs mb-4">Harorat ortganda χ kamayadi → paramagnit kengayish ham kamayadi.</p>

        <div className="bg-purple-950/50 border border-purple-700/30 rounded-lg p-4 font-mono text-xs text-yellow-400 mb-4">
          μ<sub>eff</sub> = g · √(S(S+1)) · μ<sub>B</sub> ≈ 2.20 μ<sub>B</sub> (Fe³⁺, S=½, g≈2.00)
        </div>

        <div className="flex items-center gap-3 mb-4 text-sm">
          <span className="text-purple-400 w-16">Harorat:</span>
          <input type="range" min="100" max="500" value={harorat} onChange={(e) => setHarorat(+e.target.value)}
            className="flex-1 h-1.5 bg-purple-800 rounded-full appearance-none cursor-pointer accent-purple-400" />
          <span className="text-purple-300 font-mono w-16 text-right">{harorat} K</span>
        </div>

        <canvas ref={canvasRef} width={560} height={160} className="w-full h-auto rounded-lg" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
          <div className="text-purple-400 text-xs mb-1">T</div>
          <div className="text-white font-mono font-bold">{harorat} K</div>
        </div>
        <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
          <div className="text-purple-400 text-xs mb-1">χ (nisbiy)</div>
          <div className="text-white font-mono font-bold">{rel}</div>
        </div>
        <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
          <div className="text-purple-400 text-xs mb-1">Signal kengayishi</div>
          <div className="text-white font-mono font-bold">{rel}×</div>
        </div>
      </div>

      <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
        <p className="text-yellow-300 text-sm">
          <strong>Amaliy qo'llanilishi:</strong> Haroratni oshirish paramagnit kengayishni kamaytiradi 
          va signalni biroz aniqroq ko'rish imkonini beradi. Lekin K₃[Fe(CN)₆] da kengayish 
          shu qadar kuchli (<span className="text-red-400">200−500 Hz</span>) bo'ladiki, 
          harorat ta'siri cheklangan.
        </p>
      </div>
    </div>
  )
}

// ── ASOSIY SAHIFA ────────────────────────────────────────────────────────────
export default function K3FeCN6_YaMR() {
  const [activeTab, setActiveTab] = useState("spektr")

  const tabs = [
    { id: "spektr",       label: "📈 ¹³C YaMR Spektri" },
    { id: "interaktiv",   label: "🎮 Interaktiv simulyatsiya" },
    { id: "jadval",       label: "📊 Kimyoviy siljish" },
    { id: "paramagnit",   label: "🧲 Paramagnit effekti" },
    { id: "pre",          label: "📐 PRE formulasi" },
    { id: "curie",        label: "📉 Curie qonuni" },
    { id: "taqqos",       label: "⚖️ Sariq qon tuzi bilan" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil/nmr/birikmalar" className="text-purple-400 hover:text-purple-300 text-lg">← YaMR birikmalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-red-400">🧲 K₃[Fe(CN)₆] — YaMR spektri tahlili</h1>
          <p className="text-purple-400 text-sm">kaliy geksasiyanoferrat(III) • Qizil qon tuzi • ¹³C YaMR • Paramagnit</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── HERO ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs font-semibold">¹³C YaMR</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Paramagnit</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Keng signal</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">d⁵ quyi spin</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">PRE effekti</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent" style={{ fontFamily: "'Syne', sans-serif" }}>K₃[Fe(CN)₆]</h2>
            <span className="text-purple-400 text-lg">329.24 g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">kaliy geksasiyanoferrat(III) — <span className="text-red-400 italic">"Qizil qon tuzi"</span></p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-yellow-400">¹³C YaMR spektri</strong> — Fe³⁺ (d⁵, QS, S=½) 
            <strong className="text-yellow-400"> paramagnit</strong>. 1 ta toq elektron spin relaksatsiyasini 
            tezlashtiradi — signal <strong className="text-yellow-400">kengaygan</strong> (200−500 Hz).
            Diamagnit K₄[Fe(CN)₆] bilan solishtirganda farq yaqqol ko'rinadi.
            Interaktiv slayderlar yordamida harorat va magnit maydon ta'sirini ko'ring!
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ["Yadro", "¹³C"], ["Kimyoviy siljish", "δ ≈ 135 ppm"], ["Signal shakli", "Keng (200−500 Hz)"], ["Sabab", "Paramagnit Fe³⁺ (S=½)"],
              ["μ<sub>eff</sub>", "2.20 μ<sub>B</sub>"], ["T₁", "~0.01−0.1 s"], ["Chastota", "125 MHz (500 MHz ¹H)"], ["Erituvchi", "D₂O"],
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
                <div className="text-purple-400 text-xs mb-1" dangerouslySetInnerHTML={{ __html: r[0] }} />
                <div className="text-white font-bold text-sm">{r[1]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${activeTab === tab.id ? "bg-red-600/40 text-white border border-red-400/50" : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"}`}>{tab.label}</button>
          ))}
        </div>

        {/* ── SPEKTR ── */}
        {activeTab === "spektr" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">📈 ¹³C YaMR Spektri — K₃[Fe(CN)₆]</h2>
            <div className="bg-purple-800/30 rounded-xl p-6 border border-purple-700/30">
              <div className="relative h-48 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="relative w-80 h-16 mx-auto">
                    <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl" />
                    <svg viewBox="0 0 400 80" className="w-full h-full">
                      <path d="M 10 40 Q 200 40, 390 40" stroke="#f87171" strokeWidth="8" fill="none" opacity="0.6" strokeLinecap="round"/>
                      <path d="M 50 40 Q 200 40, 350 40" stroke="#f87171" strokeWidth="4" fill="none" opacity="0.3" strokeLinecap="round"/>
                      <text x="200" y="25" textAnchor="middle" fill="#f87171" fontSize="10" fontFamily="monospace">δ ~135 ppm</text>
                      <text x="200" y="65" textAnchor="middle" fill="#7c6a9e" fontSize="9">KENG SIGNAL (paramagnit)</text>
                    </svg>
                  </div>
                  <p className="text-purple-300 text-sm">Paramagnit Fe³⁺ (d⁵, t₂g⁵) — elektron spin relaksatsiyasi tezlashgan</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-800/20 border border-purple-700/30 rounded-xl p-3 text-center"><p className="text-purple-500 text-xs italic">Grafik sxematik. Interaktiv simulyatsiya uchun "Interaktiv simulyatsiya" tabiga o'ting.</p></div>
          </div>
        )}

        {/* ── INTERAKTIV SIMULYATSIYA ── */}
        {activeTab === "interaktiv" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">🎮 Interaktiv simulyatsiya</h2>
            <InteraktivSpektr />
          </div>
        )}

        {/* ── JADVAL ── */}
        {activeTab === "jadval" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">📊 Kimyoviy siljish va parametrlar</h2>
            <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-purple-700"><th className="py-3 px-4">Parametr</th><th className="py-3 px-4">Qiymat</th><th className="py-3 px-4">Izoh</th></tr></thead><tbody className="text-purple-200">{[["Yadro","¹³C","Tabiiy miqdori 1.1%"],["δ (CN⁻)","~135 ppm (keng)","Erkin CN⁻: ~165 ppm"],["Signal kengligi","~200−500 Hz","Diamagnitda ~1 Hz"],["T₁ (spin-panjara)","~0.01−0.1 s","Juda qisqa!"],["T₂ (spin-spin)","~0.001 s","Juda qisqa"],["Sabab","Paramagnit Fe³⁺ (S=½)","Toq elektron relaksatsiyasi"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td><td className="py-3 px-4 font-mono text-green-400">{r[1]}</td><td className="py-3 px-4 text-sm">{r[2]}</td></tr>))}</tbody></table></div>
          </div>
        )}

        {/* ── PARAMAGNIT ── */}
        {activeTab === "paramagnit" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">🧲 Paramagnit effekti — signallar nega keng?</h2>
            <div className="space-y-4">
              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30"><h3 className="text-yellow-400 font-bold mb-2">1. Elektron spin relaksatsiyasi</h3><p className="text-purple-200 text-sm">Fe³⁺ (d⁵, QS, S=½) — 1 ta toq elektron. Bu elektron juda tez relaksatsiyalanadi (T₁e ~ 10⁻¹⁰−10⁻¹² s). Tez relaksatsiya yadro signallarini kengaytiradi.</p></div>
              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30"><h3 className="text-yellow-400 font-bold mb-2">2. Fermi-kontakt siljishi</h3><p className="text-purple-200 text-sm">Toq elektronning spin zichligi yadroga o'tadi — bu kimyoviy siljishga qo'shimcha hissa qo'shadi. Siljish miqdori metall-yadro masofasiga bog'liq.</p></div>
              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30"><h3 className="text-yellow-400 font-bold mb-2">3. Masofaga bog'liqlik</h3><p className="text-purple-200 text-sm">Paramagnit kengayish miqdori r⁻⁶ ga proporsional. CN⁻ uglerodi Fe³⁺ ga yaqin (1.93 Å) — kuchli kengayish. Uzoqroq yadrolarda kengayish kuchsiz.</p></div>
            </div>
          </div>
        )}

        {/* ── PRE ── */}
        {activeTab === "pre" && <PREFormulasi />}

        {/* ── CURIE ── */}
        {activeTab === "curie" && <CurieQonuni />}

        {/* ── TAQQOSLASH ── */}
        {activeTab === "taqqos" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">⚖️ Qizil vs Sariq qon tuzi — YaMR farqi</h2>
            <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-purple-700"><th className="py-3 px-4">Parametr</th><th className="py-3 px-4">K₃[Fe(CN)₆]</th><th className="py-3 px-4">K₄[Fe(CN)₆]</th></tr></thead><tbody className="text-purple-200">{[["Metall","Fe³⁺ (d⁵, QS)","Fe²⁺ (d⁶, QS)"],["Magnit","Paramagnit (S=½)","Diamagnit (S=0)"],["¹³C signal","Keng (~200−500 Hz)","O'tkir (~1−5 Hz)"],["δ (¹³C)","~135 ppm","~177 ppm"],["T₁","~0.01−0.1 s","~1−10 s"],["Ekvivalentlik","1 ta signal","1 ta signal"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td><td className="py-3 px-4 text-red-300">{r[1]}</td><td className="py-3 px-4 text-yellow-300">{r[2]}</td></tr>))}</tbody></table></div>
          </div>
        )}

        <div className="bg-gradient-to-r from-red-600/10 to-purple-600/10 border border-red-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">¹³C signali keng</strong> — paramagnit Fe³⁺ (S=½) tufayli</li>
            <li><strong className="text-yellow-400">δ ≈ 135 ppm</strong> — erkin CN⁻ dan farq qiladi</li>
            <li><strong className="text-yellow-400">PRE effekti:</strong> r⁻⁶ ga bog'liq — yaqin yadrolar kuchli kengayadi</li>
            <li><strong className="text-yellow-400">Curie qonuni:</strong> harorat ortganda kengayish kamayadi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/nmr/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Birikmalar ro'yxati</Link>
          <Link href="/ilmiy/tahlil/nmr/birikmalar/k4-fe-cn6" className="px-6 py-3 bg-red-600/80 rounded-xl hover:bg-red-500 text-white font-semibold">K₄[Fe(CN)₆] →</Link>
        </div>

      </section>
    </main>
  )
}