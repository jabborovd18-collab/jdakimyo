"use client"

import Link from "next/link"
import { useState, useEffect, useRef, useCallback, useMemo } from "react"

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
  formula: "K₄[Fe(CN)₆]",
  iupac: "Kaliy geksasiyanoferrat(II)",
  tarixiy: "Sariq qon tuzi (Gelbblutlaugensalz)",
  cas: "13943-58-3",
  molarMass: "368.35 g·mol⁻¹ (suvsiz), 422.39 g·mol⁻¹ (trihidrat)",
  density: "1.85 g·cm⁻³",
  oxidationState: "Fe(II), low-spin d⁶ (S = 0)",
  magneticMoment: "Diamagnit (μ_eff ≈ 0)",
  coordinationGeom: "Oktaedrik (FeC₆ yadrosi)",
  pointGroup: "O_h (erkin ion)",
  spaceGroup: "C2/c (monoklin, trihidrat)",
  fecDistance: "1.91 Å (Fe−C), 1.15 Å (C≡N)",
  
  lazer: "Nd:YAG (λ = 1064 nm, FT-Raman)",
  power: "50−150 mW",
  resolution: "2 sm⁻¹",
  spectralRange: "50−4000 sm⁻¹",
  acquisitionTime: "64−128 skan",
  detector: "InGaAs (1064 nm)",
  
  peaks: [
    { wavenumber: 82, intensity: 10, fwhm: 7, assignment: "Panjara modi — K⁺···[Fe(CN)₆]⁴⁻ translatsion tebranish", symmetry: "T_g (lattice)", polarization: "Qisman qutblangan", category: "lattice", comment: "Past chastotali panjara modlari" },
    { wavenumber: 120, intensity: 15, fwhm: 6, assignment: "Panjara modi — [Fe(CN)₆]⁴⁻ libratsiya (R_g)", symmetry: "R_g (lattice)", polarization: "Depolyarizatsiyalangan", category: "lattice", comment: "Anion libratsion harakati" },
    { wavenumber: 380, intensity: 100, fwhm: 3.8, assignment: "ν(Fe−C) simmetrik valent tebranish — 'nafas olish' modi", symmetry: "A₁g", polarization: "Qutblangan (ρ ≈ 0.04)", category: "metal-ligand", forceConstant: "k(Fe−C) = 2.05 mdyn/Å", comment: "Eng intensiv Raman piki. Fe(II) uchun Fe(III) ga nisbatan 10 sm⁻¹ past" },
    { wavenumber: 405, intensity: 22, fwhm: 4.8, assignment: "ν(Fe−C) + δ(C−Fe−C) gibrid mod (E_g)", symmetry: "E_g", polarization: "Depolyarizatsiyalangan (ρ ≈ 0.74)", category: "metal-ligand", comment: "E_g simmetriyali buzilishli mod" },
    { wavenumber: 470, intensity: 12, fwhm: 6.5, assignment: "δ(Fe−C≡N) deformatsion tebranish", symmetry: "E_g", polarization: "Depolyarizatsiyalangan (ρ ≈ 0.72)", category: "deformation", comment: "Fe−C≡N burchak deformatsiyasi" },
    { wavenumber: 500, intensity: 18, fwhm: 7, assignment: "ν(Fe−C) antisimmetrik — kristall maydon buzilishi", symmetry: "F₁u (IQ da ~578 sm⁻¹)", polarization: "IR-da kuchli", category: "metal-ligand", comment: "Kristall maydon Oh → C_2h buzilishi — Raman faollik" },
    { wavenumber: 2098, intensity: 80, fwhm: 3.2, assignment: "ν(C≡N) simmetrik cho'zilish — barcha 6 ta CN sinxron", symmetry: "A₁g", polarization: "Kuchli qutblangan (ρ ≈ 0.02)", category: "cn-stretch", forceConstant: "k(C≡N) = 16.8 mdyn/Å", comment: "Fe(II) diagnostik piki — Fe(III) dan 32 sm⁻¹ past" },
    { wavenumber: 2104, intensity: 15, fwhm: 4.5, assignment: "ν(C≡N) E_g — ekvatorial CN-lar antifaza", symmetry: "E_g", polarization: "Depolyarizatsiyalangan", category: "cn-stretch", comment: "A₁g pikidan 6 sm⁻¹ yuqorida" },
    { wavenumber: 2125, intensity: 6, fwhm: 8, assignment: "Kombinatsion mod: ν(C≡N) A₁g + lattice", symmetry: "—", polarization: "Depolyarizatsiyalangan", category: "combination", comment: "Anharmonik kombinatsiya yon-piki" },
  ],
  
  iqComparison: [
    { vibration: "ν(Fe−C) A₁g", raman: "380 (100%)", iq: "— (faol emas)", rule: "Sof Raman — gerade" },
    { vibration: "ν(Fe−C) F₁u", raman: "500 (kuchsiz)", iq: "578 (kuchli)", rule: "Asosan IQ — ungerade" },
    { vibration: "δ(Fe−C≡N)", raman: "470 (kuchsiz)", iq: "410 (o'rtacha)", rule: "Ikkalasida ham faol" },
    { vibration: "ν(C≡N) A₁g", raman: "2098 (80%)", iq: "— (faol emas)", rule: "Sof Raman — symmetric stretch" },
    { vibration: "ν(C≡N) F₁u", raman: "— (juda kuchsiz)", iq: "2044 (juda kuchli)", rule: "Diagnostik IQ piki — ungerade" },
  ],
  
  comparisonWithFe3: {
    title: "K₄[Fe(CN)₆] vs K₃[Fe(CN)₆] — Raman chastotalari farqi",
    fe2: { vFeC: 380, vCN: 2098, kFeC: 2.05, kCN: 16.8 },
    fe3: { vFeC: 390, vCN: 2130, kFeC: 2.21, kCN: 17.4 },
    explanation: "Fe(II) — d⁶ LS (t₂g⁶), kuchli π-back-donation: Fe→CN(π*) elektron zichligi yuqori → C≡N bog'i kuchsizlanadi → ν(C≡N) = 2098 sm⁻¹. Fe(III) — d⁵ LS (t₂g⁵), kuchsizroq π-back-donation → C≡N mustahkamroq → ν(C≡N) = 2130 sm⁻¹. Farq Δν = 32 sm⁻¹ — oksidlanish darajasini aniqlashning eng ishonchli Raman mezoni.",
  },
  
  groupTheory: {
    title: "Oktaedrik [Fe(CN)₆]⁴⁻ uchun guruh nazariyasi",
    pointGroup: "O_h",
    totalModes: "Γ_total = A₁g + E_g + 2T₁g + T₂g + 3T₁u + T₂u + 2A₂u",
    ramanActive: "Γ_Raman = A₁g + E_g + T₂g (4 ta Raman faol mod)",
    irActive: "Γ_IR = 3T₁u (3 ta IQ faol mod)",
    n_atoms: 13,
    formula: "3N − 6 = 33 ichki tebranish darajasi",
    explanation: "[Fe(CN)₆]⁴⁻ — Fe(II) markazida 13 atom. Oh simmetriya. Fe(II) da metall-ligand bog'i Fe(III) ga nisbatan kuchsizroq — kuchli π-back-donation hisobiga. Bu barcha Raman chastotalarining pastga siljishiga olib keladi.",
  },
}

function RamanSpektrGrafik({ lineColor = "#34d399" }) {
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

  const allPeaks = RAMAN_DATA.peaks
  const peaks = allPeaks

  const ranges = {
    full: { min: 50, max: 2200 },
    low: { min: 50, max: 600 },
    cn: { min: 2050, max: 2150 },
  }
  const { min: wnMin, max: wnMax } = ranges[zoomRegion]

  useEffect(() => {
    const updateSize = () => { 
      if (containerRef.current) { 
        const w = Math.min(820, containerRef.current.clientWidth)
        setCanvasSize({ w, h: w > 500 ? 380 : 280 }) 
      } 
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  useEffect(() => {
    startTimeRef.current = null
    setAnimProgress(0)
    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const progress = Math.min((timestamp - startTimeRef.current) / 1200, 1)
      setAnimProgress(progress)
      if (progress < 1) animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [zoomRegion, laser])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const W = canvas.width, H = canvas.height
    const PAD = { l: 70, r: 30, t: 30, b: 60 }
    const plotW = W - PAD.l - PAD.r, plotH = H - PAD.t - PAD.b
    const xTo = (v) => PAD.l + ((v - wnMin) / (wnMax - wnMin)) * plotW
    const yTo = (v) => PAD.t + ((105 - v) / 105) * plotH

    const bg = ctx.createLinearGradient(0, 0, 0, H)
    bg.addColorStop(0, "#0a0716")
    bg.addColorStop(1, "#1a0f2e")
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, W, H)

    ctx.strokeStyle = "#2a1f3d"
    ctx.lineWidth = 0.5
    const step = (wnMax - wnMin) > 1000 ? 200 : (wnMax - wnMin) > 300 ? 50 : 25
    for (let w = Math.ceil(wnMin / step) * step; w <= wnMax; w += step) {
      ctx.beginPath(); ctx.moveTo(xTo(w), PAD.t); ctx.lineTo(xTo(w), PAD.t + plotH); ctx.stroke()
    }
    ;[20, 40, 60, 80, 100].forEach(v => {
      ctx.beginPath(); ctx.moveTo(PAD.l, yTo(v)); ctx.lineTo(PAD.l + plotW, yTo(v)); ctx.stroke()
    })
    ctx.strokeStyle = "#3d2a5c"; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(PAD.l, yTo(0)); ctx.lineTo(PAD.l + plotW, yTo(0)); ctx.stroke()

    const laserScale = laser === 1064 ? 1.0 : laser === 633 ? 2.85 : laser === 514 ? 5.4 : 8.2

    const visiblePeaks = peaks.filter(p => 
      p.wavenumber >= wnMin && p.wavenumber <= wnMax &&
      p.wavenumber <= wnMin + (wnMax - wnMin) * animProgress
    )

    if (showFit) {
      ctx.strokeStyle = lineColor; ctx.lineWidth = 2
      ctx.beginPath()
      for (let x = PAD.l; x <= PAD.l + plotW; x += 1) {
        const wn = wnMin + ((x - PAD.l) / plotW) * (wnMax - wnMin)
        let total = 0
        visiblePeaks.forEach(p => {
          const gamma = p.fwhm / 2
          total += (p.intensity * laserScale * gamma * gamma) / (Math.pow(wn - p.wavenumber, 2) + gamma * gamma)
        })
        total = Math.min(total, 102)
        if (x === PAD.l) ctx.moveTo(x, yTo(Math.max(0, total)))
        else ctx.lineTo(x, yTo(Math.max(0, total)))
      }
      ctx.stroke()
      ctx.lineTo(PAD.l + plotW, yTo(0)); ctx.lineTo(PAD.l, yTo(0)); ctx.closePath()
      const fillGrad = ctx.createLinearGradient(0, PAD.t, 0, PAD.t + plotH)
      fillGrad.addColorStop(0, lineColor + "25"); fillGrad.addColorStop(1, lineColor + "05")
      ctx.fillStyle = fillGrad; ctx.fill()
    }

    visiblePeaks.forEach(p => {
      const x = xTo(p.wavenumber), y = yTo(Math.min(p.intensity * laserScale, 100))
      const isH = hoveredPeak?.wavenumber === p.wavenumber
      const isS = selectedPeak?.wavenumber === p.wavenumber
      const catColor = { "lattice": "#a78bfa", "metal-ligand": "#34d399", "deformation": "#fbbf24", "cn-stretch": "#38bdf8", "combination": "#f87171" }[p.category] || lineColor

      ctx.beginPath(); ctx.arc(x, y, (isH || isS) ? 7 : 4, 0, Math.PI * 2)
      ctx.fillStyle = catColor; ctx.fill()
      if (isS) { ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2); ctx.fillStyle = catColor + "25"; ctx.fill() }

      ctx.fillStyle = catColor; ctx.font = "bold 10px monospace"; ctx.textAlign = "center"
      ctx.fillText(`${p.wavenumber}`, x, y - 12)
      if (isH || isS) {
        ctx.fillStyle = "#fff"; ctx.font = "bold 11px monospace"
        ctx.fillText(`${p.wavenumber} sm⁻¹`, x, y - 26)
        ctx.font = "9px monospace"; ctx.fillText(p.symmetry, x, y - 38)
      }
    })

    if (hoveredPeak && !selectedPeak) {
      const p = hoveredPeak; const x = xTo(p.wavenumber), y = yTo(Math.min(p.intensity * laserScale, 100))
      const tx = Math.min(Math.max(x - 110, PAD.l + 5), PAD.l + plotW - 225)
      ctx.fillStyle = "#0f0a1a"; ctx.strokeStyle = lineColor; ctx.lineWidth = 1
      ctx.beginPath(); ctx.roundRect(tx, y - 110, 220, 80, 8); ctx.fill(); ctx.stroke()
      ctx.fillStyle = "#fff"; ctx.font = "bold 10px sans-serif"; ctx.textAlign = "left"
      ctx.fillText(`${p.wavenumber} sm⁻¹  (${p.symmetry})`, tx + 8, y - 92)
      ctx.fillStyle = lineColor; ctx.font = "9px sans-serif"
      ctx.fillText(p.assignment.substring(0, 50), tx + 8, y - 78)
      ctx.fillStyle = "#fbbf24"; ctx.font = "9px monospace"
      ctx.fillText(`FWHM: ${p.fwhm} sm⁻¹`, tx + 8, y - 65)
    }

    ctx.strokeStyle = "#3d2a5c"; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(PAD.l, PAD.t); ctx.lineTo(PAD.l, PAD.t + plotH); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(PAD.l, PAD.t + plotH); ctx.lineTo(PAD.l + plotW, PAD.t + plotH); ctx.stroke()

    ctx.fillStyle = "#7c6a9e"; ctx.font = "10px sans-serif"; ctx.textAlign = "center"
    for (let w = Math.ceil(wnMin / step) * step; w <= wnMax; w += step) ctx.fillText(w, xTo(w), PAD.t + plotH + 16)
    ctx.font = "11px sans-serif"; ctx.fillStyle = "#a78bfa"
    ctx.fillText("Raman siljishi (sm⁻¹)", PAD.l + plotW / 2, H - 8)
    ctx.textAlign = "right"; ctx.font = "10px sans-serif"; ctx.fillStyle = "#7c6a9e"
    ;[20, 40, 60, 80, 100].forEach(v => ctx.fillText(v, PAD.l - 8, yTo(v) + 4))
    ctx.fillStyle = "#fbbf24"; ctx.font = "bold 10px monospace"; ctx.textAlign = "right"
    ctx.fillText(`λ = ${laser} nm`, PAD.l + plotW - 8, PAD.t + 14)
  }, [peaks, animProgress, hoveredPeak, selectedPeak, lineColor, canvasSize, wnMin, wnMax, laser, showFit])

  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current; if (!canvas) return
    const rect = canvas.getBoundingClientRect(); const scaleX = canvasSize.w / rect.width
    const mx = (e.clientX - rect.left) * scaleX
    const PAD = { l: 70, r: 30 }; const plotW = canvasSize.w - PAD.l - PAD.r
    const wn = wnMin + ((mx - PAD.l) / plotW) * (wnMax - wnMin)
    let closest = null, minDist = (wnMax - wnMin) / 50
    peaks.forEach(p => { const dist = Math.abs(p.wavenumber - wn); if (dist < minDist) { minDist = dist; closest = p } })
    setHoveredPeak(closest)
  }, [peaks, canvasSize, wnMin, wnMax])

  return (
    <div ref={containerRef} className="relative">
      <div className="bg-purple-900/50 border border-purple-700/50 rounded-xl p-3 mb-3 flex flex-wrap gap-3 items-center text-xs">
        <div className="flex items-center gap-2">
          <span className="text-purple-400">Lazer:</span>
          {[1064, 633, 514].map(l => (
            <button key={l} onClick={() => setLaser(l)} className={`px-2 py-1 rounded-lg font-mono ${laser === l ? "bg-yellow-500/30 text-yellow-300 border border-yellow-500/50" : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/40"}`}>{l}nm</button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-purple-400">Zoom:</span>
          {[["full", "To'liq"], ["low", "Past <600"], ["cn", "C≡N"]].map(([k, v]) => (
            <button key={k} onClick={() => setZoomRegion(k)} className={`px-2 py-1 rounded-lg ${zoomRegion === k ? "bg-green-500/30 text-green-300 border border-green-500/50" : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/40"}`}>{v}</button>
          ))}
        </div>
        <button onClick={() => setShowFit(!showFit)} className={`px-2 py-1 rounded-lg ml-auto ${showFit ? "bg-pink-500/30 text-pink-300 border border-pink-500/50" : "bg-purple-800/40 text-purple-300"}`}>{showFit ? "✓" : "○"} Fit</button>
      </div>
      <canvas ref={canvasRef} width={canvasSize.w} height={canvasSize.h}
        onMouseMove={handleMouseMove}
        onClick={() => { if (hoveredPeak) setSelectedPeak(selectedPeak?.wavenumber === hoveredPeak.wavenumber ? null : hoveredPeak) }}
        onMouseLeave={() => setHoveredPeak(null)}
        className="w-full h-auto rounded-xl border border-purple-700/50 cursor-crosshair" />
      <div className="mt-3 flex flex-wrap gap-3 text-xs">
        {[{ c: "#a78bfa", l: "Lattice" },{ c: "#34d399", l: "Fe−C" },{ c: "#fbbf24", l: "δ" },{ c: "#38bdf8", l: "C≡N" },{ c: "#f87171", l: "Komb" }].map((it, i) => (
          <div key={i} className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full" style={{ background: it.c }} /><span className="text-purple-300">{it.l}</span></div>
        ))}
      </div>
      {selectedPeak && (
        <div className="mt-3 bg-purple-800/30 border rounded-xl p-4" style={{ borderColor: lineColor + "40" }}>
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <span className="font-mono font-bold text-lg" style={{ color: lineColor }}>{selectedPeak.wavenumber} sm⁻¹</span>
            <span className="bg-purple-700/50 text-purple-200 rounded-full px-2 py-0.5 text-xs">{selectedPeak.symmetry}</span>
            <span className="bg-yellow-500/20 text-yellow-300 rounded-full px-2 py-0.5 text-xs">FWHM: {selectedPeak.fwhm} sm⁻¹</span>
          </div>
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
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950 via-green-900 to-blue-950 border border-emerald-700/50 p-8 md:p-12 mb-10">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-500/10 rounded-full blur-3xl" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 text-sm text-purple-400 mb-6">
          <Link href="/" className="hover:text-purple-200">Bosh sahifa</Link><span>/</span>
          <Link href="/ilmiy/birikmalar" className="hover:text-purple-200">Birikmalar</Link><span>/</span>
          <Link href="/ilmiy/tahlil/raman" className="hover:text-purple-200">Raman</Link><span>/</span>
          <span className="text-yellow-400">{RAMAN_DATA.formula}</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white">{RAMAN_DATA.formula}</h1>
          <div className="flex flex-wrap gap-2">
            <span className="bg-emerald-600/20 text-emerald-300 border border-emerald-600/30 rounded-full px-3 py-1 text-xs font-semibold">{RAMAN_DATA.tarixiy}</span>
            <span className="bg-green-600/20 text-green-300 border border-green-600/30 rounded-full px-3 py-1 text-xs">d⁶ LS — diamagnit</span>
            <span className="bg-purple-600/20 text-purple-300 border border-purple-600/30 rounded-full px-3 py-1 text-xs">O_h simmetriya</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[["Eng kuchli pik","380 sm⁻¹","ν(Fe−C) A₁g"],["ν(C≡N) A₁g","2098 sm⁻¹","Fe(II) diagnostik"],["k(Fe−C)","2.05 mdyn/Å","Fe(III) dan kuchsiz"],["Magnit","Diamagnit","S=0"]].map(([l,v,s],i)=>(
            <div key={i} className="bg-purple-800/30 border border-purple-700/30 rounded-xl p-3 text-center"><p className="text-purple-400 text-xs mb-1">{l}</p><p className="text-white font-bold text-base">{v}</p><p className="text-purple-500 text-xs mt-0.5">{s}</p></div>
          ))}
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
          <p className="text-yellow-300 text-sm"><strong>Diagnostik xulosa:</strong> ν(Fe−C) = <span className="font-mono text-lg font-bold">380 sm⁻¹</span> va ν(C≡N) = <span className="font-mono text-lg font-bold">2098 sm⁻¹</span> — K₃[Fe(CN)₆] (Fe(III)) dan <strong>Δν(CN) = 32 sm⁻¹</strong> past. Bu π-back-donation kuchayganining bevosita dalili.</p>
        </div>
      </div>
    </div>
  )
}

const TABS = [
  { id: "spectrum", label: "Raman spektri", icon: "📊" },
  { id: "iq-comparison", label: "Raman vs IQ", icon: "⚖️" },
  { id: "vs-fe3", label: "Fe(III) vs Fe(II)", icon: "🔄" },
  { id: "group-theory", label: "Guruh nazariyasi", icon: "🔣" },
  { id: "peaks-table", label: "Piklar jadvali", icon: "📋" },
]

export default function K4FeCN6RamanPage() {
  const [activeTab, setActiveTab] = useState("spectrum")

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 px-6 py-4 mb-6 border-b border-purple-800/50">
          <Link href="/ilmiy/tahlil/raman/birikmalar" className="hover:bg-purple-800/50 p-2 rounded-xl transition-all border border-purple-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          </Link>
          <h1 className="text-xl font-bold text-white">K₄[Fe(CN)₆] — Raman spektroskopik tahlil</h1>
        </div>
        <HeroSection />
        <div className="flex flex-wrap gap-1 bg-purple-900/40 border border-purple-700/50 rounded-2xl p-1.5 mb-6">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id ? "bg-emerald-600/40 text-white border border-emerald-400/50" : "text-purple-400 hover:text-white hover:bg-purple-800/30"}`}><span className="mr-1.5">{tab.icon}</span>{tab.label}</button>
          ))}
        </div>
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          {activeTab === "spectrum" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-emerald-400">Interaktiv Raman spektri — K₄[Fe(CN)₆]</h2>
              <p className="text-purple-300 text-sm">Nd:YAG lazer (1064 nm), 50−150 mW. Fe(II) — diamagnit, kuchli π-back-donation.</p>
              <RamanSpektrGrafik />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-xl p-4">
                  <h3 className="text-emerald-300 font-semibold mb-2">🔬 Past chastotali soha</h3>
                  <p className="text-purple-200 text-xs">ν(Fe−C) A₁g = 380 sm⁻¹ — Fe(III) dan 10 sm⁻¹ past. π-back-donation kuchli → Fe−C bog'i kuchsizroq.</p>
                </div>
                <div className="bg-sky-600/10 border border-sky-500/30 rounded-xl p-4">
                  <h3 className="text-sky-300 font-semibold mb-2">🔬 C≡N sohasi</h3>
                  <p className="text-purple-200 text-xs">ν(C≡N) A₁g = 2098 sm⁻¹ — Fe(III) dan 32 sm⁻¹ past. π* CN orbitaliga elektron zichligi ko'p o'tgan.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "iq-comparison" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-emerald-400">Raman ↔ IQ — o'zaro istisno qoidasi</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm"><thead><tr className="border-b border-purple-700/50"><th className="text-left py-3 px-3 text-purple-400">Tebranish</th><th className="text-left py-3 px-3 text-emerald-400">Raman (sm⁻¹)</th><th className="text-left py-3 px-3 text-blue-400">IQ (sm⁻¹)</th><th className="text-left py-3 px-3 text-purple-400">Tanlash qoidasi</th></tr></thead>
                  <tbody>{RAMAN_DATA.iqComparison.map((r, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-3 text-yellow-400 font-mono text-xs">{r.vibration}</td><td className="py-3 px-3 text-emerald-300 text-xs">{r.raman}</td><td className="py-3 px-3 text-blue-300 text-xs">{r.iq}</td><td className="py-3 px-3 text-purple-300 text-xs">{r.rule}</td></tr>
                  ))}</tbody></table>
              </div>
            </div>
          )}

          {activeTab === "vs-fe3" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-emerald-400">{RAMAN_DATA.comparisonWithFe3.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-xl p-5">
                  <h3 className="text-emerald-400 font-semibold mb-3">Fe(II) — K₄[Fe(CN)₆] (d⁶ LS)</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-purple-300">ν(Fe−C):</span><span className="text-white font-mono">{RAMAN_DATA.comparisonWithFe3.fe2.vFeC} sm⁻¹</span></div>
                    <div className="flex justify-between"><span className="text-purple-300">ν(C≡N):</span><span className="text-white font-mono">{RAMAN_DATA.comparisonWithFe3.fe2.vCN} sm⁻¹</span></div>
                    <div className="flex justify-between"><span className="text-purple-300">k(Fe−C):</span><span className="text-white font-mono">{RAMAN_DATA.comparisonWithFe3.fe2.kFeC} mdyn/Å</span></div>
                    <div className="flex justify-between"><span className="text-purple-300">k(C≡N):</span><span className="text-white font-mono">{RAMAN_DATA.comparisonWithFe3.fe2.kCN} mdyn/Å</span></div>
                  </div>
                </div>
                <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
                  <h3 className="text-red-400 font-semibold mb-3">Fe(III) — K₃[Fe(CN)₆] (d⁵ LS)</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-purple-300">ν(Fe−C):</span><span className="text-white font-mono">{RAMAN_DATA.comparisonWithFe3.fe3.vFeC} sm⁻¹</span></div>
                    <div className="flex justify-between"><span className="text-purple-300">ν(C≡N):</span><span className="text-white font-mono">{RAMAN_DATA.comparisonWithFe3.fe3.vCN} sm⁻¹</span></div>
                    <div className="flex justify-between"><span className="text-purple-300">k(Fe−C):</span><span className="text-white font-mono">{RAMAN_DATA.comparisonWithFe3.fe3.kFeC} mdyn/Å</span></div>
                    <div className="flex justify-between"><span className="text-purple-300">k(C≡N):</span><span className="text-white font-mono">{RAMAN_DATA.comparisonWithFe3.fe3.kCN} mdyn/Å</span></div>
                  </div>
                </div>
              </div>
              <div className="bg-purple-800/30 rounded-xl p-5">
                <h3 className="text-yellow-300 font-semibold mb-2">🔬 π-back-donation mexanizmi</h3>
                <p className="text-purple-200 text-sm leading-relaxed">{RAMAN_DATA.comparisonWithFe3.explanation}</p>
              </div>
            </div>
          )}

          {activeTab === "group-theory" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-emerald-400">{RAMAN_DATA.groupTheory.title}</h2>
              <div className="bg-purple-800/30 rounded-xl p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-yellow-300 font-semibold mb-3">⚛️ Erkinlik darajalari</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-purple-300">Atomlar soni:</span><span className="text-white font-mono">{RAMAN_DATA.groupTheory.n_atoms}</span></div>
                      <div className="flex justify-between"><span className="text-purple-300">Tebranish (3N−6):</span><span className="text-emerald-300 font-mono font-bold">{RAMAN_DATA.groupTheory.formula}</span></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-yellow-300 font-semibold mb-3">📐 Simmetriya tahlili</h3>
                    <div className="space-y-2 text-xs">
                      <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-2"><p className="text-green-300 font-semibold">🟢 Raman faol:</p><p className="text-purple-200 font-mono mt-1">{RAMAN_DATA.groupTheory.ramanActive}</p></div>
                      <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-2"><p className="text-blue-300 font-semibold">🔵 IQ faol:</p><p className="text-purple-200 font-mono mt-1">{RAMAN_DATA.groupTheory.irActive}</p></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-xl p-5">
                <h3 className="text-emerald-300 font-semibold mb-2">📚 Tushuntirish</h3>
                <p className="text-purple-200 text-sm leading-relaxed">{RAMAN_DATA.groupTheory.explanation}</p>
              </div>
            </div>
          )}

          {activeTab === "peaks-table" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-emerald-400">To'liq piklar bazasi (9 mod)</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm"><thead><tr className="border-b border-purple-700/50"><th className="text-left py-3 px-3 text-purple-400">ν (sm⁻¹)</th><th className="text-left py-3 px-3 text-purple-400">I (%)</th><th className="text-left py-3 px-3 text-purple-400">FWHM</th><th className="text-left py-3 px-3 text-purple-400">Simmetriya</th><th className="text-left py-3 px-3 text-purple-400">Tebranish turi</th></tr></thead>
                  <tbody>{RAMAN_DATA.peaks.map((p, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-3 font-mono text-emerald-400 font-bold">{p.wavenumber}</td><td className="py-3 px-3 text-yellow-400">{p.intensity}%</td><td className="py-3 px-3 text-purple-300 font-mono text-xs">{p.fwhm}</td><td className="py-3 px-3 text-white font-mono text-xs">{p.symmetry}</td><td className="py-3 px-3 text-purple-200 text-xs">{p.assignment}</td></tr>
                  ))}</tbody></table>
              </div>
              <div className="bg-purple-800/30 rounded-xl p-5">
                <h3 className="text-yellow-300 font-semibold mb-3">⚙️ Eksperimental parametrlar</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between"><span className="text-purple-400">Lazer:</span><span className="text-white text-xs">{RAMAN_DATA.lazer}</span></div>
                  <div className="flex justify-between"><span className="text-purple-400">Quvvat:</span><span className="text-white text-xs">{RAMAN_DATA.power}</span></div>
                  <div className="flex justify-between"><span className="text-purple-400">Ruxsat:</span><span className="text-white text-xs">{RAMAN_DATA.resolution}</span></div>
                  <div className="flex justify-between"><span className="text-purple-400">Detektor:</span><span className="text-white text-xs">{RAMAN_DATA.detector}</span></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-8 pt-6 border-t border-purple-800/50">
          <Link href="/ilmiy/tahlil/raman/birikmalar/k3-fe-cn6" className="text-purple-400 hover:text-purple-200 text-sm flex items-center gap-2"><span>←</span> K₃[Fe(CN)₆]</Link>
          <Link href="/ilmiy/tahlil/raman/birikmalar/co-nh3-6-cl3" className="text-purple-400 hover:text-purple-200 text-sm">[Co(NH₃)₆]Cl₃ →</Link>
        </div>
      </div>
    </div>
  )
}