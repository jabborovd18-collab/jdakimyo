"use client"

import Link from "next/link"
import { useState, useEffect, useRef, useCallback } from "react"

if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    if (typeof r === 'number') r = { tl: r, tr: r, br: r, bl: r }
    this.beginPath()
    this.moveTo(x + r.tl, y)
    this.lineTo(x + w - r.tr, y)
    this.quadraticCurveTo(x + w, y, x + w, y + r.tr)
    this.lineTo(x + w, y + h - r.br)
    this.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h)
    this.lineTo(x + r.bl, y + h)
    this.quadraticCurveTo(x, y + h, x, y + h - r.bl)
    this.lineTo(x, y + r.tl)
    this.quadraticCurveTo(x, y, x + r.tl, y)
    this.closePath()
  }
}

const RAMAN_DATA = {
  formula: "[Zn(OH)₄]²⁻",
  iupac: "Tetragidroksosinkat(II) ioni",
  tarixiy: "",
  cas: "12179-14-5 (ioni)",
  molarMass: "133.41 g·mol⁻¹ (ioni)",
  density: "1.88 g·cm⁻³ (Na₂[Zn(OH)₄])",
  oxidationState: "Zn(II), d¹⁰ (S = 0)",
  magneticMoment: "Diamagnit",
  coordinationGeom: "Tetraedrik (ZnO₄, T_d simmetriya)",
  pointGroup: "T_d (erkin ion), S₄ (kristallda I4̄)",
  bondDistances: "Zn−O: 1.97 Å (4 ta ekvivalent)",
  amfoterNote: "Zn(OH)₂ + 2NaOH → Na₂[Zn(OH)₄] — amfoter xossa, ishqoriy muhitda eriydi",
  
  lazer: "Nd:YAG (λ = 1064 nm, FT-Raman) — rangsiz namuna, 1064 nm afzal",
  power: "50−150 mW",
  resolution: "2 sm⁻¹",
  spectralRange: "50−4000 sm⁻¹",
  acquisitionTime: "128−256 skan",
  detector: "InGaAs (1064 nm) yoki CCD (514 nm)",
  
  peaks: [
    { wavenumber: 58, intensity: 8, fwhm: 5, assignment: "Panjara modi — Na⁺···[Zn(OH)₄]²⁻ translatsion tebranish", symmetry: "A₁ (lattice)", polarization: "Qutblangan", category: "lattice", comment: "Past chastotali panjara modi" },
    { wavenumber: 95, intensity: 12, fwhm: 4.5, assignment: "Panjara modi — O−H···O vodorod bog' tebranishi", symmetry: "A₁ (lattice)", polarization: "Qutblangan", category: "lattice", comment: "Molekulalararo vodorod bog'lari tarmog'i" },
    { wavenumber: 135, intensity: 18, fwhm: 4, assignment: "δ(O−Zn−O) — tetraedrik burchak deformatsiyasi (E)", symmetry: "E", polarization: "Depolyarizatsiyalangan (ρ ≈ 0.73)", category: "deformation", comment: "Tetraedrik burchak deformatsiyasi — O−Zn−O" },
    { wavenumber: 175, intensity: 15, fwhm: 4.5, assignment: "δ(O−Zn−O) antisimmetrik — T₂ komponenti", symmetry: "T₂", polarization: "Depolyarizatsiyalangan", category: "deformation", comment: "T₂ simmetriyali burchak deformatsiyasi" },
    { wavenumber: 260, intensity: 22, fwhm: 3.5, assignment: "δ(Zn−O−H) — Zn−O−H burchak deformatsiyasi", symmetry: "E", polarization: "Depolyarizatsiyalangan", category: "deformation", comment: "Zn−O−H burchak o'zgarishi — IQ da ham faol" },
    { wavenumber: 370, intensity: 30, fwhm: 3.2, assignment: "ν(Zn−O) + δ(O−Zn−O) gibrid mod (T₂)", symmetry: "T₂", polarization: "Depolyarizatsiyalangan", category: "metal-ligand", comment: "Aralash valent + deformatsion tebranish" },
    { wavenumber: 480, intensity: 100, fwhm: 2.8, assignment: "ν(Zn−O) simmetrik valent tebranish — 'nafas olish' modi", symmetry: "A₁", polarization: "Kuchli qutblangan (ρ ≈ 0.04)", category: "metal-ligand", forceConstant: "k(Zn−O) = 2.05 mdyn/Å", comment: "Eng intensiv Raman piki. Barcha 4 ta Zn−O sinxron cho'ziladi" },
    { wavenumber: 510, intensity: 25, fwhm: 3.5, assignment: "ν(Zn−O) antisimmetrik valent tebranish (T₂)", symmetry: "T₂", polarization: "Depolyarizatsiyalangan", category: "metal-ligand", comment: "Antisimmetrik Zn−O — IQ da kuchli (~505 sm⁻¹)" },
    { wavenumber: 720, intensity: 12, fwhm: 6, assignment: "ρ_r(OH) — OH rocking tebranish", symmetry: "T₂", polarization: "Depolyarizatsiyalangan", category: "oh-rock", comment: "OH guruhining rocking harakati" },
    { wavenumber: 890, intensity: 10, fwhm: 6.5, assignment: "ρ_w(OH) — OH wagging tebranish", symmetry: "E", polarization: "Depolyarizatsiyalangan", category: "oh-wag", comment: "OH wagging harakati" },
    { wavenumber: 1050, intensity: 15, fwhm: 5, assignment: "δ(Zn−O−H) + ν(Zn−O) kombinatsion mod", symmetry: "A₁", polarization: "Qutblangan", category: "oh-mixed", comment: "Aralash OH + Zn−O tebranishi" },
    { wavenumber: 1420, intensity: 18, fwhm: 5.5, assignment: "δ(Zn−O−H) — Zn−O−H soyabon deformatsiyasi", symmetry: "A₁", polarization: "Qutblangan (ρ ≈ 0.10)", category: "oh-deform", comment: "Zn−O−H soyabon deformatsiyasi" },
    { wavenumber: 3250, intensity: 30, fwhm: 8, assignment: "ν(O−H) — simmetrik valent tebranish (vodorod bog'li)", symmetry: "A₁", polarization: "Qutblangan (ρ ≈ 0.06)", category: "oh-stretch", forceConstant: "k(O−H) = 7.1 mdyn/Å", comment: "Simmetrik O−H cho'zilishi — keng pik, kuchli vodorod bog'lari" },
    { wavenumber: 3420, intensity: 15, fwhm: 7, assignment: "ν(O−H) — erkin OH tebranishi (vodorod bog'siz)", symmetry: "A₁", polarization: "Qutblangan", category: "oh-stretch", comment: "Vodorod bog'iga ega bo'lmagan OH guruhlari" },
  ],
  
  iqComparison: [
    { vibration: "ν(Zn−O) A₁", raman: "480 (100%)", iq: "— (kuchsiz)", rule: "Raman da diagnostik — A₁" },
    { vibration: "ν(Zn−O) T₂", raman: "510 (25%)", iq: "505 (kuchli)", rule: "IQ da kuchli — T₂ ikkalasida faol" },
    { vibration: "δ(O−Zn−O) E", raman: "135 (18%)", iq: "— (faol emas)", rule: "Sof Raman — E" },
    { vibration: "δ(Zn−O−H) A₁", raman: "1420 (18%)", iq: "1410 (o'rtacha)", rule: "Ikkalasida ham faol" },
    { vibration: "ν(O−H) A₁", raman: "3250 (30%)", iq: "3240 (kuchli)", rule: "Ikkalasida ham faol — keng pik" },
  ],
  
  symmetryNote: {
    title: "T_d simmetriya — tetraedrik [Zn(OH)₄]²⁻",
    pointGroup: "T_d",
    totalModes: "Γ_total = A₁ + E + 2T₂ + OH ichki tebranishlar",
    ramanActive: "Γ_Raman = A₁ + E + T₂ (barcha asosiy modlar Raman faol!)",
    irActive: "Γ_IR = 2T₂",
    noMutualExclusion: "T_d simmetriyada inversion markaz yo'q. T₂ modlar Raman va IQ da bir vaqtda faol. Zn²⁺ (d¹⁰) — ligand maydon stabilizatsiya energiyasi nolga teng, geometriya faqat sterik omillar bilan belgilanadi.",
    n_atoms: 9,
    formula: "3N − 6 = 21 + OH ichki tebranishlar",
    explanation: "[Zn(OH)₄]²⁻ — 9 atom (1 Zn + 4 O + 4 H). OH guruhlari qo'shimcha ichki tebranishlarga ega. Zn²⁺ (d¹⁰) — to'liq to'lgan d-qobiq, rangsiz, diamagnit.",
  },
  
  amfoterEffect: {
    title: "Amfoter xossa — Raman spektrida namoyon bo'lishi",
    description: "Zn(OH)₂ amfoter — ham kislota, ham ishqor bilan reaksiyaga kirishadi. Ishqoriy muhitda [Zn(OH)₄]²⁻ hosil bo'ladi. Raman spektroskopiyasi bu jarayonni kuzatish imkonini beradi.",
    beforeReaction: "Zn(OH)₂ (cho'kma): ν(Zn−O) ~460 sm⁻¹ (keng pik), OH tebranishlari kuchsiz",
    afterReaction: "[Zn(OH)₄]²⁻ (eritma): ν(Zn−O) = 480 sm⁻¹ (tor, intensiv pik), OH tebranishlari kuchli",
    pHdependence: "pH > 10 da [Zn(OH)₄]²⁻ barqaror, pH < 8 da Zn(OH)₂ cho'kmaga tushadi. Raman spektridagi o'zgarishlar pH ga bog'liq.",
  },
}

function RamanSpektrGrafik({ lineColor = "#a78bfa" }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [hoveredPeak, setHoveredPeak] = useState(null)
  const [selectedPeak, setSelectedPeak] = useState(null)
  const [canvasSize, setCanvasSize] = useState({ w: 820, h: 380 })
  const [animProgress, setAnimProgress] = useState(0)
  const [laser, setLaser] = useState(1064)
  const [zoomRegion, setZoomRegion] = useState("full")
  const [showFit, setShowFit] = useState(true)
  const animRef = useRef(null)
  const startTimeRef = useRef(null)

  const peaks = RAMAN_DATA.peaks
  const ranges = { full: { min: 50, max: 3500 }, low: { min: 50, max: 600 }, oh: { min: 3100, max: 3500 } }
  const { min: wnMin, max: wnMax } = ranges[zoomRegion]

  useEffect(() => {
    const us = () => { if (containerRef.current) { const w = Math.min(820, containerRef.current.clientWidth); setCanvasSize({ w, h: w > 500 ? 380 : 280 }) } }
    us(); window.addEventListener('resize', us); return () => window.removeEventListener('resize', us)
  }, [])

  useEffect(() => {
    startTimeRef.current = null; setAnimProgress(0)
    const anim = (t) => { if (!startTimeRef.current) startTimeRef.current = t; const p = Math.min((t - startTimeRef.current) / 1200, 1); setAnimProgress(p); if (p < 1) animRef.current = requestAnimationFrame(anim) }
    animRef.current = requestAnimationFrame(anim); return () => cancelAnimationFrame(animRef.current)
  }, [zoomRegion, laser])

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext("2d"); const W = canvas.width, H = canvas.height
    const PAD = { l: 70, r: 30, t: 30, b: 60 }; const plotW = W - PAD.l - PAD.r, plotH = H - PAD.t - PAD.b
    const xTo = (v) => PAD.l + ((v - wnMin) / (wnMax - wnMin)) * plotW
    const yTo = (v) => PAD.t + ((105 - v) / 105) * plotH

    const bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#0a0716"); bg.addColorStop(1, "#1a0f2e")
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H)
    ctx.strokeStyle = "#2a1f3d"; ctx.lineWidth = 0.5
    const step = (wnMax - wnMin) > 2000 ? 500 : (wnMax - wnMin) > 500 ? 100 : 50
    for (let w = Math.ceil(wnMin / step) * step; w <= wnMax; w += step) { ctx.beginPath(); ctx.moveTo(xTo(w), PAD.t); ctx.lineTo(xTo(w), PAD.t + plotH); ctx.stroke() }
    ;[20, 40, 60, 80, 100].forEach(v => { ctx.beginPath(); ctx.moveTo(PAD.l, yTo(v)); ctx.lineTo(PAD.l + plotW, yTo(v)); ctx.stroke() })
    ctx.strokeStyle = "#3d2a5c"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(PAD.l, yTo(0)); ctx.lineTo(PAD.l + plotW, yTo(0)); ctx.stroke()

    const ls = laser === 1064 ? 1.0 : laser === 633 ? 2.85 : laser === 514 ? 5.4 : 8.2
    const vis = peaks.filter(p => p.wavenumber >= wnMin && p.wavenumber <= wnMax && p.wavenumber <= wnMin + (wnMax - wnMin) * animProgress)

    if (showFit) {
      ctx.strokeStyle = lineColor; ctx.lineWidth = 2; ctx.beginPath()
      for (let x = PAD.l; x <= PAD.l + plotW; x += 1) {
        const wn = wnMin + ((x - PAD.l) / plotW) * (wnMax - wnMin); let total = 0
        vis.forEach(p => { const g = p.fwhm / 2; total += (p.intensity * ls * g * g) / (Math.pow(wn - p.wavenumber, 2) + g * g) })
        total = Math.min(total, 102)
        if (x === PAD.l) ctx.moveTo(x, yTo(Math.max(0, total))); else ctx.lineTo(x, yTo(Math.max(0, total)))
      }
      ctx.stroke(); ctx.lineTo(PAD.l + plotW, yTo(0)); ctx.lineTo(PAD.l, yTo(0)); ctx.closePath()
      const fg = ctx.createLinearGradient(0, PAD.t, 0, PAD.t + plotH); fg.addColorStop(0, lineColor + "25"); fg.addColorStop(1, lineColor + "05")
      ctx.fillStyle = fg; ctx.fill()
    }

    vis.forEach(p => {
      const x = xTo(p.wavenumber), y = yTo(Math.min(p.intensity * ls, 100))
      const isH = hoveredPeak?.wavenumber === p.wavenumber; const isS = selectedPeak?.wavenumber === p.wavenumber
      const cc = { "lattice": "#a78bfa", "deformation": "#fbbf24", "metal-ligand": lineColor, "oh-rock": "#38bdf8", "oh-wag": "#34d399", "oh-mixed": "#f97316", "oh-deform": "#f97316", "oh-stretch": "#e879f9" }[p.category] || lineColor

      ctx.beginPath(); ctx.arc(x, y, (isH || isS) ? 7 : 4, 0, Math.PI * 2); ctx.fillStyle = cc; ctx.fill()
      if (isS) { ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2); ctx.fillStyle = cc + "25"; ctx.fill() }
      if (p.intensity > 20 || isH || isS) { ctx.fillStyle = cc; ctx.font = "bold 9px monospace"; ctx.textAlign = "center"; ctx.fillText(`${p.wavenumber}`, x, y - 12) }
      if (isH || isS) { ctx.fillStyle = "#fff"; ctx.font = "bold 11px monospace"; ctx.fillText(`${p.wavenumber} sm⁻¹`, x, y - 26) }
    })

    if (hoveredPeak && !selectedPeak) {
      const p = hoveredPeak; const x = xTo(p.wavenumber), y = yTo(Math.min(p.intensity * ls, 100))
      const tx = Math.min(Math.max(x - 110, PAD.l + 5), PAD.l + plotW - 225)
      ctx.fillStyle = "#0f0a1a"; ctx.strokeStyle = lineColor; ctx.lineWidth = 1
      ctx.beginPath(); ctx.roundRect(tx, y - 85, 220, 65, 8); ctx.fill(); ctx.stroke()
      ctx.fillStyle = "#fff"; ctx.font = "bold 10px sans-serif"; ctx.textAlign = "left"
      ctx.fillText(`${p.wavenumber} sm⁻¹`, tx + 8, y - 68)
      ctx.fillStyle = lineColor; ctx.font = "9px sans-serif"; ctx.fillText(p.assignment.substring(0, 48), tx + 8, y - 54)
    }

    ctx.strokeStyle = "#3d2a5c"; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(PAD.l, PAD.t); ctx.lineTo(PAD.l, PAD.t + plotH); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(PAD.l, PAD.t + plotH); ctx.lineTo(PAD.l + plotW, PAD.t + plotH); ctx.stroke()
    ctx.fillStyle = "#7c6a9e"; ctx.font = "10px sans-serif"; ctx.textAlign = "center"
    for (let w = Math.ceil(wnMin / step) * step; w <= wnMax; w += step) ctx.fillText(w, xTo(w), PAD.t + plotH + 16)
    ctx.font = "11px sans-serif"; ctx.fillStyle = "#a78bfa"; ctx.fillText("Raman siljishi (sm⁻¹)", PAD.l + plotW / 2, H - 8)
    ctx.textAlign = "right"; ctx.font = "10px sans-serif"; ctx.fillStyle = "#7c6a9e"
    ;[20, 40, 60, 80, 100].forEach(v => ctx.fillText(v, PAD.l - 8, yTo(v) + 4))
    ctx.fillStyle = "#fbbf24"; ctx.font = "bold 10px monospace"; ctx.textAlign = "right"; ctx.fillText(`λ = ${laser} nm`, PAD.l + plotW - 8, PAD.t + 14)
  }, [peaks, animProgress, hoveredPeak, selectedPeak, lineColor, canvasSize, wnMin, wnMax, laser, showFit])

  const hm = useCallback((e) => {
    const c = canvasRef.current; if (!c) return
    const r = c.getBoundingClientRect(); const sx = canvasSize.w / r.width; const mx = (e.clientX - r.left) * sx
    const P = { l: 70, r: 30 }; const pw = canvasSize.w - P.l - P.r
    const wn = wnMin + ((mx - P.l) / pw) * (wnMax - wnMin); let cl = null, md = (wnMax - wnMin) / 50
    peaks.forEach(p => { const d = Math.abs(p.wavenumber - wn); if (d < md) { md = d; cl = p } }); setHoveredPeak(cl)
  }, [peaks, canvasSize, wnMin, wnMax])

  return (
    <div ref={containerRef} className="relative">
      <div className="bg-purple-900/50 border border-purple-700/50 rounded-xl p-3 mb-3 flex flex-wrap gap-3 items-center text-xs">
        <div className="flex items-center gap-2"><span className="text-purple-400">Lazer:</span>{[1064, 633, 514].map(l => (<button key={l} onClick={() => setLaser(l)} className={`px-2 py-1 rounded-lg font-mono ${laser === l ? "bg-yellow-500/30 text-yellow-300 border border-yellow-500/50" : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/40"}`}>{l}nm</button>))}</div>
        <div className="flex items-center gap-2"><span className="text-purple-400">Zoom:</span>{[["full", "To'liq"], ["low", "50−600"], ["oh", "O−H"]].map(([k, v]) => (<button key={k} onClick={() => setZoomRegion(k)} className={`px-2 py-1 rounded-lg ${zoomRegion === k ? "bg-violet-500/30 text-violet-300 border border-violet-500/50" : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/40"}`}>{v}</button>))}</div>
        <button onClick={() => setShowFit(!showFit)} className={`px-2 py-1 rounded-lg ml-auto ${showFit ? "bg-pink-500/30 text-pink-300 border border-pink-500/50" : "bg-purple-800/40 text-purple-300"}`}>{showFit ? "✓" : "○"} Fit</button>
      </div>
      <canvas ref={canvasRef} width={canvasSize.w} height={canvasSize.h} onMouseMove={hm} onClick={() => { if (hoveredPeak) setSelectedPeak(selectedPeak?.wavenumber === hoveredPeak.wavenumber ? null : hoveredPeak) }} onMouseLeave={() => setHoveredPeak(null)} className="w-full h-auto rounded-xl border border-purple-700/50 cursor-crosshair" />
      <div className="mt-3 flex flex-wrap gap-3 text-xs">
        {[{ c: "#a78bfa", l: "Lattice" },{ c: "#fbbf24", l: "δ" },{ c: "#a78bfa", l: "Zn−O" },{ c: "#38bdf8", l: "OH" },{ c: "#e879f9", l: "O−H" }].map((it, i) => (<div key={i} className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full" style={{ background: it.c }} /><span className="text-purple-300">{it.l}</span></div>))}
      </div>
      {selectedPeak && (
        <div className="mt-3 bg-purple-800/30 border rounded-xl p-4" style={{ borderColor: lineColor + "40" }}>
          <div className="flex items-center gap-3 flex-wrap mb-2"><span className="font-mono font-bold text-lg" style={{ color: lineColor }}>{selectedPeak.wavenumber} sm⁻¹</span><span className="bg-purple-700/50 text-purple-200 rounded-full px-2 py-0.5 text-xs">{selectedPeak.symmetry}</span><span className="bg-yellow-500/20 text-yellow-300 rounded-full px-2 py-0.5 text-xs">FWHM: {selectedPeak.fwhm} sm⁻¹</span></div>
          <p className="text-white text-sm mb-1"><strong>Tebranish:</strong> {selectedPeak.assignment}</p>
          {selectedPeak.forceConstant && <p className="text-green-300 text-xs mb-1"><strong>Kuch konstantasi:</strong> {selectedPeak.forceConstant}</p>}
          <p className="text-purple-400 text-xs mt-2 italic">{selectedPeak.comment}</p>
          <button onClick={() => setSelectedPeak(null)} className="mt-2 text-xs text-purple-400 hover:text-white">✕ Yopish</button>
        </div>
      )}
    </div>
  )
}

function HeroSection() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-950 via-purple-900 to-blue-950 border border-violet-700/50 p-8 md:p-12 mb-10">
      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 text-sm text-purple-400 mb-6"><Link href="/" className="hover:text-purple-200">Bosh sahifa</Link><span>/</span><Link href="/ilmiy/birikmalar" className="hover:text-purple-200">Birikmalar</Link><span>/</span><Link href="/ilmiy/tahlil/raman" className="hover:text-purple-200">Raman</Link><span>/</span><span className="text-yellow-400">{RAMAN_DATA.formula}</span></div>
        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white">{RAMAN_DATA.formula}</h1>
          <div className="flex flex-wrap gap-2">
            <span className="bg-violet-600/20 text-violet-300 border border-violet-600/30 rounded-full px-3 py-1 text-xs font-semibold">Tetraedrik (T_d)</span>
            <span className="bg-purple-600/20 text-purple-300 border border-purple-600/30 rounded-full px-3 py-1 text-xs">d¹⁰ — diamagnit</span>
            <span className="bg-blue-600/20 text-blue-300 border border-blue-600/30 rounded-full px-3 py-1 text-xs">Amfoter</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[["ν(Zn−O) A₁","480 sm⁻¹","Eng kuchli"],["k(Zn−O)","2.05 mdyn/Å","Mustahkam"],["Zn−O masofa","1.97 Å","Tetraedrik"],["Amfoter","pH > 10","Barqaror"]].map(([l,v,s],i)=>(<div key={i} className="bg-purple-800/30 border border-purple-700/30 rounded-xl p-3 text-center"><p className="text-purple-400 text-xs mb-1">{l}</p><p className="text-white font-bold text-base">{v}</p><p className="text-purple-500 text-xs mt-0.5">{s}</p></div>))}
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
          <p className="text-yellow-300 text-sm"><strong>Diagnostik xulosa:</strong> ν(Zn−O) = <span className="font-mono text-lg font-bold">480 sm⁻¹</span> (A₁) — tetraedrik [Zn(OH)₄]²⁻ uchun xarakterli. Amfoter xossa — pH ga bog'liq.</p>
        </div>
      </div>
    </div>
  )
}

const TABS = [
  { id: "spectrum", label: "Raman spektri", icon: "📊" },
  { id: "iq-comparison", label: "Raman vs IQ", icon: "⚖️" },
  { id: "amfoter", label: "Amfoter xossa", icon: "⚖️" },
  { id: "symmetry", label: "T_d simmetriya", icon: "🔣" },
  { id: "peaks-table", label: "Piklar jadvali", icon: "📋" },
]

export default function ZnOH4RamanPage() {
  const [activeTab, setActiveTab] = useState("spectrum")
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 px-6 py-4 mb-6 border-b border-purple-800/50">
          <Link href="/ilmiy/tahlil/raman/birikmalar" className="hover:bg-purple-800/50 p-2 rounded-xl transition-all border border-purple-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></Link>
          <h1 className="text-xl font-bold text-white">[Zn(OH)₄]²⁻ — Raman spektroskopik tahlil</h1>
        </div>
        <HeroSection />
        <div className="flex flex-wrap gap-1 bg-purple-900/40 border border-purple-700/50 rounded-2xl p-1.5 mb-6">
          {TABS.map(tab => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id ? "bg-violet-600/40 text-white border border-violet-400/50" : "text-purple-400 hover:text-white hover:bg-purple-800/30"}`}><span className="mr-1.5">{tab.icon}</span>{tab.label}</button>))}
        </div>
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          {activeTab === "spectrum" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-violet-400">Interaktiv Raman spektri — [Zn(OH)₄]²⁻</h2>
              <p className="text-purple-300 text-sm">Nd:YAG lazer (1064 nm), 50−150 mW. T_d simmetriya — A₁, E, T₂ Raman faol.</p>
              <RamanSpektrGrafik />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-violet-600/10 border border-violet-500/30 rounded-xl p-4"><h3 className="text-violet-300 font-semibold mb-2">🔬 Zn−O sohasi</h3><p className="text-purple-200 text-xs">ν(Zn−O) = 480 sm⁻¹ (A₁, 100%). k(Zn−O) = 2.05 mdyn/Å — mustahkam bog'.</p></div>
                <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-4"><h3 className="text-purple-300 font-semibold mb-2">🔬 OH sohasi</h3><p className="text-purple-200 text-xs">δ(Zn−O−H) = 1420 sm⁻¹. ρ_r = 720, ρ_w = 890 sm⁻¹.</p></div>
                <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-4"><h3 className="text-pink-300 font-semibold mb-2">🔬 O−H sohasi</h3><p className="text-purple-200 text-xs">ν(O−H) = 3250 sm⁻¹ (keng). Vodorod bog'lari tarmog'i.</p></div>
              </div>
            </div>
          )}
          {activeTab === "iq-comparison" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-violet-400">Raman ↔ IQ — [Zn(OH)₄]²⁻ T_d</h2>
              <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-purple-700/50"><th className="text-left py-3 px-3 text-purple-400">Tebranish</th><th className="text-left py-3 px-3 text-violet-400">Raman</th><th className="text-left py-3 px-3 text-blue-400">IQ</th><th className="text-left py-3 px-3 text-purple-400">Tanlash qoidasi</th></tr></thead><tbody>{RAMAN_DATA.iqComparison.map((r, i) => (<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-3 text-yellow-400 font-mono text-xs">{r.vibration}</td><td className="py-3 px-3 text-violet-300 text-xs">{r.raman}</td><td className="py-3 px-3 text-blue-300 text-xs">{r.iq}</td><td className="py-3 px-3 text-purple-300 text-xs">{r.rule}</td></tr>))}</tbody></table></div>
            </div>
          )}
          {activeTab === "amfoter" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-violet-400">{RAMAN_DATA.amfoterEffect.title}</h2>
              <p className="text-purple-200 text-sm">{RAMAN_DATA.amfoterEffect.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-purple-800/30 rounded-xl p-5"><h3 className="text-purple-300 font-semibold mb-2">Zn(OH)₂ (cho'kma)</h3><p className="text-purple-200 text-sm">{RAMAN_DATA.amfoterEffect.beforeReaction}</p></div>
                <div className="bg-violet-600/10 border border-violet-500/30 rounded-xl p-5"><h3 className="text-violet-400 font-semibold mb-2">[Zn(OH)₄]²⁻ (eritma)</h3><p className="text-purple-200 text-sm">{RAMAN_DATA.amfoterEffect.afterReaction}</p></div>
              </div>
              <div className="bg-purple-800/30 rounded-xl p-5"><h3 className="text-yellow-300 font-semibold mb-2">📊 pH bog'liqlik</h3><p className="text-purple-200 text-sm">{RAMAN_DATA.amfoterEffect.pHdependence}</p></div>
            </div>
          )}
          {activeTab === "symmetry" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-violet-400">{RAMAN_DATA.symmetryNote.title}</h2>
              <div className="bg-purple-800/30 rounded-xl p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><h3 className="text-yellow-300 font-semibold mb-3">⚛️ Erkinlik darajalari</h3><div className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-purple-300">Atomlar soni:</span><span className="text-white font-mono">{RAMAN_DATA.symmetryNote.n_atoms}</span></div><div className="flex justify-between"><span className="text-purple-300">Tebranish:</span><span className="text-violet-300 font-mono font-bold">{RAMAN_DATA.symmetryNote.formula}</span></div></div></div>
                  <div><h3 className="text-yellow-300 font-semibold mb-3">📐 Simmetriya (T_d)</h3><div className="space-y-2 text-xs"><div className="bg-green-600/20 border border-green-500/30 rounded-lg p-2"><p className="text-green-300 font-semibold">🟢 Raman faol:</p><p className="text-purple-200 font-mono mt-1">{RAMAN_DATA.symmetryNote.ramanActive}</p></div><div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-2"><p className="text-blue-300 font-semibold">🔵 IQ faol:</p><p className="text-purple-200 font-mono mt-1">{RAMAN_DATA.symmetryNote.irActive}</p></div></div></div>
                </div>
              </div>
              <div className="bg-violet-600/10 border border-violet-500/30 rounded-xl p-5"><h3 className="text-violet-300 font-semibold mb-2">📚 Tushuntirish</h3><p className="text-purple-200 text-sm">{RAMAN_DATA.symmetryNote.explanation}</p></div>
            </div>
          )}
          {activeTab === "peaks-table" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-violet-400">To'liq piklar bazasi (14 mod)</h2>
              <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-purple-700/50"><th className="text-left py-3 px-3 text-purple-400">ν (sm⁻¹)</th><th className="text-left py-3 px-3 text-purple-400">I (%)</th><th className="text-left py-3 px-3 text-purple-400">FWHM</th><th className="text-left py-3 px-3 text-purple-400">Simmetriya</th><th className="text-left py-3 px-3 text-purple-400">Tebranish turi</th></tr></thead><tbody>{RAMAN_DATA.peaks.map((p, i) => (<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-3 font-mono text-violet-400 font-bold">{p.wavenumber}</td><td className="py-3 px-3 text-yellow-400">{p.intensity}%</td><td className="py-3 px-3 text-purple-300 font-mono text-xs">{p.fwhm}</td><td className="py-3 px-3 text-white font-mono text-xs">{p.symmetry}</td><td className="py-3 px-3 text-purple-200 text-xs">{p.assignment}</td></tr>))}</tbody></table></div>
            </div>
          )}
        </div>
        <div className="flex justify-between mt-8 pt-6 border-t border-purple-800/50">
          <Link href="/ilmiy/tahlil/raman/birikmalar/fe-co5" className="text-purple-400 hover:text-purple-200 text-sm flex items-center gap-2"><span>←</span> [Fe(CO)₅]</Link>
          <Link href="/ilmiy/tahlil/raman/birikmalar/cr-h2o6" className="text-purple-400 hover:text-purple-200 text-sm">[Cr(H₂O)₆]³⁺ →</Link>
        </div>
      </div>
    </div>
  )
}