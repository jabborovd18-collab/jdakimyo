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
  formula: "[Fe(C₅H₅)₂]",
  iupac: "Bis(siklopentadienil)temir(II)",
  tarixiy: "FERROSEN — birinchi metallotsen",
  cas: "102-54-5",
  molarMass: "186.04 g·mol⁻¹",
  density: "1.49 g·cm⁻³",
  oxidationState: "Fe(II), d⁶ LS (S = 0), 18e⁻ qoidasi",
  magneticMoment: "Diamagnit",
  coordinationGeom: "Sandvich (D₅d — staggered, D₅h — eclipsed)",
  pointGroup: "D₅d (staggered, erkin molekula), C_i (kristallda P2₁/c)",
  spaceGroup: "P2₁/c (monoklin, 293 K), P2₁/n (110 K)",
  feCpDistance: "1.655 Å (Fe−Cp markaz), Fe−C: 2.058 Å",
  
  lazer: "Ar⁺ (λ = 514.5 nm) yoki Nd:YAG (λ = 1064 nm)",
  power: "10−50 mW (fotoparchalanishga juda sezgir — past quvvat!)",
  resolution: "2 sm⁻¹",
  spectralRange: "50−3500 sm⁻¹",
  acquisitionTime: "64−128 skan",
  detector: "CCD (514 nm) yoki InGaAs (1064 nm)",
  
  peaks: [
    { wavenumber: 48, intensity: 15, fwhm: 5, assignment: "Panjara modi — molekulalararo van der Waals tebranish", symmetry: "A_g (lattice)", polarization: "Qutblangan", category: "lattice", comment: "Past chastotali panjara modi — molekulalararo kuchsiz kuchlar" },
    { wavenumber: 85, intensity: 12, fwhm: 4.5, assignment: "Cp halqasi libratsiya — butun halqa tebranishi", symmetry: "E₁g (lattice)", polarization: "Depolyarizatsiyalangan", category: "lattice", comment: "Cp halqalarining libratsion harakati" },
    { wavenumber: 140, intensity: 22, fwhm: 4, assignment: "Cp−Fe−Cp egilish deformatsiyasi", symmetry: "E₁g", polarization: "Depolyarizatsiyalangan", category: "deformation", comment: "Sandvich egilish modi — Cp halqalari parallel emas" },
    { wavenumber: 175, intensity: 18, fwhm: 5, assignment: "Fe−Cp simmetrik nafas olish tebranishi", symmetry: "A₁g", polarization: "Kuchli qutblangan (ρ ≈ 0.04)", category: "metal-ligand", comment: "Ikkala Cp halqasi bir vaqtda Fe dan uzoqlashadi/yaqinlashadi" },
    { wavenumber: 305, intensity: 100, fwhm: 3.2, assignment: "ν(Fe−Cp) simmetrik valent tebranish — 'nafas olish' modi", symmetry: "A₁g", polarization: "Kuchli qutblangan (ρ ≈ 0.02)", category: "metal-ligand", forceConstant: "k(Fe−Cp) = 3.15 mdyn/Å", comment: "Eng intensiv Raman piki. Ikkala Cp halqasi sinxron harakatlanadi — ferrosenning 'tashrif qog'ozi'" },
    { wavenumber: 325, intensity: 30, fwhm: 4.5, assignment: "ν(Fe−Cp) antisimmetrik valent tebranish", symmetry: "E₁g", polarization: "Depolyarizatsiyalangan", category: "metal-ligand", comment: "Cp halqalari antifazada tebranadi" },
    { wavenumber: 390, intensity: 45, fwhm: 3.8, assignment: "Cp halqasi deformatsiyasi — C−C−C burchak o'zgarishi (in-plane)", symmetry: "E₂g", polarization: "Depolyarizatsiyalangan", category: "cp-ring", comment: "Cp halqasi ichki deformatsiyasi — besh burchakli halqa buzilishi" },
    { wavenumber: 600, intensity: 15, fwhm: 5.5, assignment: "Cp halqasi out-of-plane deformatsiya", symmetry: "A₂u", polarization: "—", category: "cp-ring", comment: "Cp halqasi tekislikdan chiqish deformatsiyasi" },
    { wavenumber: 815, intensity: 35, fwhm: 3.5, assignment: "C−H out-of-plane egilish (γ C−H)", symmetry: "A₂u", polarization: "—", category: "ch-bend", comment: "C−H bog'larining Cp tekisligidan chiqishi" },
    { wavenumber: 850, intensity: 25, fwhm: 4, assignment: "Cp halqasi nafas olish (ring breathing)", symmetry: "A₁g", polarization: "Qutblangan (ρ ≈ 0.06)", category: "cp-ring", comment: "Cp halqasi simmetrik kengayishi/qisqarishi" },
    { wavenumber: 1010, intensity: 20, fwhm: 3.8, assignment: "C−H in-plane egilish (δ C−H)", symmetry: "E₁u", polarization: "—", category: "ch-bend", comment: "C−H tekislik ichidagi deformatsiyasi" },
    { wavenumber: 1105, intensity: 80, fwhm: 3, assignment: "Cp halqasi C−C valent tebranish (breathing + stretching)", symmetry: "A₁g", polarization: "Kuchli qutblangan (ρ ≈ 0.03)", category: "cp-ring", forceConstant: "k(C−C) = 5.85 mdyn/Å", comment: "Eng xarakterli Cp tebranishi — aromatik halqa nafas olishi" },
    { wavenumber: 1355, intensity: 28, fwhm: 4.2, assignment: "C−C valent tebranish + C−H egilish (gibrid mod)", symmetry: "E₂g", polarization: "Depolyarizatsiyalangan", category: "cp-ring", comment: "Aralash Cp tebranishi" },
    { wavenumber: 1410, intensity: 18, fwhm: 4.5, assignment: "C−C antisimmetrik valent tebranish", symmetry: "E₁u", polarization: "—", category: "cp-ring", comment: "Cp halqasi C−C bog'larining antifaza tebranishi" },
    { wavenumber: 3085, intensity: 25, fwhm: 5, assignment: "ν(C−H) simmetrik valent tebranish", symmetry: "A₁g", polarization: "Qutblangan (ρ ≈ 0.08)", category: "ch-stretch", forceConstant: "k(C−H) = 5.15 mdyn/Å", comment: "Cp halqasi C−H cho'zilishi — barcha 10 ta C−H sinxron" },
    { wavenumber: 3105, intensity: 15, fwhm: 5.5, assignment: "ν(C−H) antisimmetrik valent tebranish", symmetry: "E₁g", polarization: "Depolyarizatsiyalangan", category: "ch-stretch", comment: "Antisimmetrik C−H cho'zilishi" },
  ],
  
  iqComparison: [
    { vibration: "ν(Fe−Cp) A₁g", raman: "305 (100%)", iq: "— (faol emas)", rule: "Sof Raman — gerade D₅d" },
    { vibration: "ν(Fe−Cp) E₁g", raman: "325 (30%)", iq: "— (faol emas)", rule: "Sof Raman — gerade" },
    { vibration: "Cp breathing A₁g", raman: "1105 (80%)", iq: "— (faol emas)", rule: "Sof Raman — simmetrik" },
    { vibration: "Cp ring E₁u", raman: "— (faol emas)", iq: "1000 (kuchli)", rule: "Sof IQ — ungerade" },
    { vibration: "ν(C−H) A₁g", raman: "3085 (25%)", iq: "— (kuchsiz)", rule: "Raman da kuchliroq" },
    { vibration: "γ(C−H) A₂u", raman: "815 (35%)", iq: "820 (juda kuchli)", rule: "IQ da kuchli — out-of-plane" },
  ],
  
  symmetryNote: {
    title: "D₅d vs D₅h — ferrosen konformatsiyasi",
    staggered: { pointGroup: "D₅d (staggered)", energy: "Eng past energiyali konformatsiya", raman: "Ko'p sonli qutblangan A₁g modlar", note: "Cp halqalari bir-biriga nisbatan 36° ga burilgan" },
    eclipsed: { pointGroup: "D₅h (eclipsed)", energy: "Yuqori energiyali (~4 kJ/mol)", raman: "Boshqa tanlash qoidalari", note: "Cp halqalari bir-biriga parallel joylashgan" },
    barrier: "Cp halqalari aylanishi uchun energetik to'siq ~4 kJ/mol — juda past. Xona haroratida halqalar erkin aylanadi, lekin Raman vaqt shkalasida (~10⁻¹² s) ular 'muzlatilgan' ko'rinadi.",
  },
  
  derivatives: {
    title: "Metallotsenlar oilasi — Raman chastotalari",
    compounds: [
      { name: "Ferrosen [Fe(C₅H₅)₂]", vMCp: 305, vRing: 1105, color: "To'q sariq" },
      { name: "Nikelotsen [Ni(C₅H₅)₂]", vMCp: 355, vRing: 1110, color: "To'q yashil" },
      { name: "Kobaltotsen [Co(C₅H₅)₂]", vMCp: 330, vRing: 1108, color: "To'q binafsha" },
      { name: "Rutenotsen [Ru(C₅H₅)₂]", vMCp: 380, vRing: 1100, color: "Och sariq" },
    ],
    trend: "M−Cp chastotasi metall massasi ortishi bilan o'zgaradi. 3d metallarda: Fe (305) < Co (330) < Ni (355) — bog' kuchi va M−Cp masofasiga bog'liq.",
  },
}

function RamanSpektrGrafik({ lineColor = "#f59e0b" }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [hoveredPeak, setHoveredPeak] = useState(null)
  const [selectedPeak, setSelectedPeak] = useState(null)
  const [canvasSize, setCanvasSize] = useState({ w: 820, h: 380 })
  const [animProgress, setAnimProgress] = useState(0)
  const [laser, setLaser] = useState(514)
  const [zoomRegion, setZoomRegion] = useState("full")
  const [showFit, setShowFit] = useState(true)
  const animRef = useRef(null)
  const startTimeRef = useRef(null)

  const peaks = RAMAN_DATA.peaks
  const ranges = {
    full: { min: 40, max: 3200 },
    low: { min: 40, max: 900 },
    ring: { min: 750, max: 1450 },
    ch: { min: 3000, max: 3150 },
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

    ctx.strokeStyle = "#2a1f3d"; ctx.lineWidth = 0.5
    const step = (wnMax - wnMin) > 2000 ? 500 : (wnMax - wnMin) > 500 ? 100 : 50
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
      const catColor = { "lattice": "#a78bfa", "deformation": "#fbbf24", "metal-ligand": lineColor, "cp-ring": "#38bdf8", "ch-bend": "#34d399", "ch-stretch": "#e879f9" }[p.category] || lineColor

      ctx.beginPath(); ctx.arc(x, y, (isH || isS) ? 7 : 4, 0, Math.PI * 2)
      ctx.fillStyle = catColor; ctx.fill()
      if (isS) { ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2); ctx.fillStyle = catColor + "25"; ctx.fill() }

      if (p.intensity > 20 || isH || isS) {
        ctx.fillStyle = catColor; ctx.font = "bold 9px monospace"; ctx.textAlign = "center"
        ctx.fillText(`${p.wavenumber}`, x, y - 12)
      }
      if (isH || isS) {
        ctx.fillStyle = "#fff"; ctx.font = "bold 11px monospace"
        ctx.fillText(`${p.wavenumber} sm⁻¹`, x, y - 26)
      }
    })

    if (hoveredPeak && !selectedPeak) {
      const p = hoveredPeak; const x = xTo(p.wavenumber), y = yTo(Math.min(p.intensity * laserScale, 100))
      const tx = Math.min(Math.max(x - 110, PAD.l + 5), PAD.l + plotW - 225)
      ctx.fillStyle = "#0f0a1a"; ctx.strokeStyle = lineColor; ctx.lineWidth = 1
      ctx.beginPath(); ctx.roundRect(tx, y - 90, 220, 70, 8); ctx.fill(); ctx.stroke()
      ctx.fillStyle = "#fff"; ctx.font = "bold 10px sans-serif"; ctx.textAlign = "left"
      ctx.fillText(`${p.wavenumber} sm⁻¹ (${p.symmetry})`, tx + 8, y - 72)
      ctx.fillStyle = lineColor; ctx.font = "9px sans-serif"
      ctx.fillText(p.assignment.substring(0, 48), tx + 8, y - 58)
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
          {[514, 633, 1064].map(l => (
            <button key={l} onClick={() => setLaser(l)} className={`px-2 py-1 rounded-lg font-mono ${laser === l ? "bg-yellow-500/30 text-yellow-300 border border-yellow-500/50" : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/40"}`}>{l}nm</button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-purple-400">Zoom:</span>
          {[["full", "To'liq"], ["low", "40−900"], ["ring", "Cp halqa"], ["ch", "C−H"]].map(([k, v]) => (
            <button key={k} onClick={() => setZoomRegion(k)} className={`px-2 py-1 rounded-lg ${zoomRegion === k ? "bg-amber-500/30 text-amber-300 border border-amber-500/50" : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/40"}`}>{v}</button>
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
        {[{ c: "#a78bfa", l: "Lattice" },{ c: "#fbbf24", l: "δ deform" },{ c: "#f59e0b", l: "Fe−Cp" },{ c: "#38bdf8", l: "Cp ring" },{ c: "#34d399", l: "C−H bend" },{ c: "#e879f9", l: "C−H stretch" }].map((it, i) => (
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
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-950 via-orange-900 to-blue-950 border border-amber-700/50 p-8 md:p-12 mb-10">
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl" />
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
            <span className="bg-amber-600/20 text-amber-300 border border-amber-600/30 rounded-full px-3 py-1 text-xs font-semibold">{RAMAN_DATA.tarixiy}</span>
            <span className="bg-orange-600/20 text-orange-300 border border-orange-600/30 rounded-full px-3 py-1 text-xs">d⁶ LS — 18e⁻</span>
            <span className="bg-purple-600/20 text-purple-300 border border-purple-600/30 rounded-full px-3 py-1 text-xs">D₅d simmetriya</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[["ν(Fe−Cp) A₁g","305 sm⁻¹","Eng kuchli pik"],["Cp ring A₁g","1105 sm⁻¹","Halqa nafas olishi"],["k(Fe−Cp)","3.15 mdyn/Å","Mustahkam bog'"],["Aylanish to'sig'i","~4 kJ/mol","Erkin aylanish"]].map(([l,v,s],i)=>(
            <div key={i} className="bg-purple-800/30 border border-purple-700/30 rounded-xl p-3 text-center"><p className="text-purple-400 text-xs mb-1">{l}</p><p className="text-white font-bold text-base">{v}</p><p className="text-purple-500 text-xs mt-0.5">{s}</p></div>
          ))}
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
          <p className="text-yellow-300 text-sm"><strong>Diagnostik xulosa:</strong> ν(Fe−Cp) = <span className="font-mono text-lg font-bold">305 sm⁻¹</span> (A₁g) va Cp ring breathing = <span className="font-mono text-lg font-bold">1105 sm⁻¹</span> (A₁g) — ferrosenning Raman "tashrif qog'ozi".</p>
        </div>
      </div>
    </div>
  )
}

const TABS = [
  { id: "spectrum", label: "Raman spektri", icon: "📊" },
  { id: "iq-comparison", label: "Raman vs IQ", icon: "⚖️" },
  { id: "symmetry", label: "D₅d vs D₅h", icon: "🔣" },
  { id: "derivatives", label: "Metallotsenlar", icon: "🧬" },
  { id: "peaks-table", label: "Piklar jadvali", icon: "📋" },
]

export default function FerrosenRamanPage() {
  const [activeTab, setActiveTab] = useState("spectrum")

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 px-6 py-4 mb-6 border-b border-purple-800/50">
          <Link href="/ilmiy/tahlil/raman/birikmalar" className="hover:bg-purple-800/50 p-2 rounded-xl transition-all border border-purple-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          </Link>
          <h1 className="text-xl font-bold text-white">[Fe(C₅H₅)₂] — Raman spektroskopik tahlil</h1>
        </div>
        <HeroSection />
        <div className="flex flex-wrap gap-1 bg-purple-900/40 border border-purple-700/50 rounded-2xl p-1.5 mb-6">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id ? "bg-amber-600/40 text-white border border-amber-400/50" : "text-purple-400 hover:text-white hover:bg-purple-800/30"}`}><span className="mr-1.5">{tab.icon}</span>{tab.label}</button>
          ))}
        </div>
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          {activeTab === "spectrum" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-amber-400">Interaktiv Raman spektri — Ferrosen</h2>
              <p className="text-purple-300 text-sm">Ar⁺ lazer (514.5 nm), 10−50 mW. D₅d simmetriya — A₁g, E₁g, E₂g modlar Raman faol.</p>
              <RamanSpektrGrafik />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-4">
                  <h3 className="text-amber-300 font-semibold mb-2">🔬 Fe−Cp sohasi</h3>
                  <p className="text-purple-200 text-xs">ν(Fe−Cp) = 305 sm⁻¹ (A₁g, 100%) — eng kuchli pik. k(Fe−Cp) = 3.15 mdyn/Å.</p>
                </div>
                <div className="bg-sky-600/10 border border-sky-500/30 rounded-xl p-4">
                  <h3 className="text-sky-300 font-semibold mb-2">🔬 Cp halqa sohasi</h3>
                  <p className="text-purple-200 text-xs">Ring breathing = 1105 sm⁻¹ (A₁g, 80%). C−C valent = 1355 sm⁻¹ (E₂g).</p>
                </div>
                <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-4">
                  <h3 className="text-pink-300 font-semibold mb-2">🔬 C−H sohasi</h3>
                  <p className="text-purple-200 text-xs">ν(C−H) = 3085 sm⁻¹ (A₁g). γ(C−H) = 815 sm⁻¹ — IQ da juda kuchli.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "iq-comparison" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-amber-400">Raman ↔ IQ — Ferrosen D₅d</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm"><thead><tr className="border-b border-purple-700/50"><th className="text-left py-3 px-3 text-purple-400">Tebranish</th><th className="text-left py-3 px-3 text-amber-400">Raman</th><th className="text-left py-3 px-3 text-blue-400">IQ</th><th className="text-left py-3 px-3 text-purple-400">Tanlash qoidasi</th></tr></thead>
                  <tbody>{RAMAN_DATA.iqComparison.map((r, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-3 text-yellow-400 font-mono text-xs">{r.vibration}</td><td className="py-3 px-3 text-amber-300 text-xs">{r.raman}</td><td className="py-3 px-3 text-blue-300 text-xs">{r.iq}</td><td className="py-3 px-3 text-purple-300 text-xs">{r.rule}</td></tr>
                  ))}</tbody></table>
              </div>
            </div>
          )}

          {activeTab === "symmetry" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-amber-400">{RAMAN_DATA.symmetryNote.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5">
                  <h3 className="text-amber-400 font-semibold mb-3">Staggered (D₅d)</h3>
                  <p className="text-purple-200 text-sm">{RAMAN_DATA.symmetryNote.staggered.note}</p>
                  <p className="text-amber-300 text-xs mt-2 font-semibold">{RAMAN_DATA.symmetryNote.staggered.energy}</p>
                  <p className="text-purple-300 text-xs mt-1">{RAMAN_DATA.symmetryNote.staggered.raman}</p>
                </div>
                <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
                  <h3 className="text-blue-400 font-semibold mb-3">Eclipsed (D₅h)</h3>
                  <p className="text-purple-200 text-sm">{RAMAN_DATA.symmetryNote.eclipsed.note}</p>
                  <p className="text-blue-300 text-xs mt-2 font-semibold">{RAMAN_DATA.symmetryNote.eclipsed.energy}</p>
                  <p className="text-purple-300 text-xs mt-1">{RAMAN_DATA.symmetryNote.eclipsed.raman}</p>
                </div>
              </div>
              <div className="bg-purple-800/30 rounded-xl p-5">
                <h3 className="text-yellow-300 font-semibold mb-2">📚 Energetik to'siq</h3>
                <p className="text-purple-200 text-sm">{RAMAN_DATA.symmetryNote.barrier}</p>
              </div>
            </div>
          )}

          {activeTab === "derivatives" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-amber-400">{RAMAN_DATA.derivatives.title}</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm"><thead><tr className="border-b border-purple-700/50"><th className="text-left py-3 px-3 text-purple-400">Birikma</th><th className="text-left py-3 px-3 text-amber-400">ν(M−Cp) sm⁻¹</th><th className="text-left py-3 px-3 text-sky-400">ν(Cp ring) sm⁻¹</th><th className="text-left py-3 px-3 text-purple-400">Rang</th></tr></thead>
                  <tbody>{RAMAN_DATA.derivatives.compounds.map((r, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-3 text-yellow-400 font-mono text-xs">{r.name}</td><td className="py-3 px-3 text-amber-300 font-mono">{r.vMCp}</td><td className="py-3 px-3 text-sky-300 font-mono">{r.vRing}</td><td className="py-3 px-3 text-purple-200 text-xs">{r.color}</td></tr>
                  ))}</tbody></table>
              </div>
              <div className="bg-purple-800/30 rounded-xl p-5">
                <h3 className="text-yellow-300 font-semibold mb-2">📈 Trend</h3>
                <p className="text-purple-200 text-sm">{RAMAN_DATA.derivatives.trend}</p>
              </div>
            </div>
          )}

          {activeTab === "peaks-table" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-amber-400">To'liq piklar bazasi (16 mod)</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm"><thead><tr className="border-b border-purple-700/50"><th className="text-left py-3 px-3 text-purple-400">ν (sm⁻¹)</th><th className="text-left py-3 px-3 text-purple-400">I (%)</th><th className="text-left py-3 px-3 text-purple-400">FWHM</th><th className="text-left py-3 px-3 text-purple-400">Simmetriya</th><th className="text-left py-3 px-3 text-purple-400">Tebranish turi</th></tr></thead>
                  <tbody>{RAMAN_DATA.peaks.map((p, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-3 font-mono text-amber-400 font-bold">{p.wavenumber}</td><td className="py-3 px-3 text-yellow-400">{p.intensity}%</td><td className="py-3 px-3 text-purple-300 font-mono text-xs">{p.fwhm}</td><td className="py-3 px-3 text-white font-mono text-xs">{p.symmetry}</td><td className="py-3 px-3 text-purple-200 text-xs">{p.assignment}</td></tr>
                  ))}</tbody></table>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-8 pt-6 border-t border-purple-800/50">
          <Link href="/ilmiy/tahlil/raman/birikmalar/sisplatin" className="text-purple-400 hover:text-purple-200 text-sm flex items-center gap-2"><span>←</span> sis-[PtCl₂(NH₃)₂]</Link>
          <Link href="/ilmiy/tahlil/raman/birikmalar/ni-cn4" className="text-purple-400 hover:text-purple-200 text-sm">[Ni(CN)₄]²⁻ →</Link>
        </div>
      </div>
    </div>
  )
}