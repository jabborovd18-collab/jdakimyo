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
  formula: "sis-[PtCl₂(NH₃)₂]",
  iupac: "sis-Diammindixloroplatina(II)",
  tarixiy: "SISPLATIN — JSST muhim dori vositasi",
  cas: "15663-27-1",
  molarMass: "300.05 g·mol⁻¹",
  density: "3.74 g·cm⁻³",
  oxidationState: "Pt(II), d⁸ (S = 0)",
  magneticMoment: "Diamagnit",
  coordinationGeom: "Kvadrat planar (PtN₂Cl₂)",
  pointGroup: "C₂v (ideal), C₁ (kristallda)",
  spaceGroup: "P2₁/c (monoklin)",
  bondDistances: "Pt−Cl: 2.33 Å, Pt−N: 2.01 Å",
  
  lazer: "Ar⁺ (λ = 514.5 nm) yoki Nd:YAG (λ = 1064 nm)",
  power: "20−80 mW (fotosintezga sezgir — past quvvat!)",
  resolution: "2 sm⁻¹",
  spectralRange: "50−4000 sm⁻¹",
  acquisitionTime: "128−256 skan",
  detector: "CCD (514 nm) yoki InGaAs (1064 nm)",
  
  peaks: [
    { wavenumber: 55, intensity: 10, fwhm: 6, assignment: "Panjara modi — molekulalararo van der Waals tebranish", symmetry: "A_g (lattice)", polarization: "Qutblangan", category: "lattice", comment: "Past chastotali panjara modi" },
    { wavenumber: 95, intensity: 15, fwhm: 5, assignment: "Panjara modi — N−H···Cl vodorod bog' tebranishi", symmetry: "A_g (lattice)", polarization: "Qutblangan", category: "lattice", comment: "Molekulalararo vodorod bog'lari" },
    { wavenumber: 145, intensity: 22, fwhm: 5.5, assignment: "δ(Cl−Pt−Cl) — Cl−Pt−Cl burchak deformatsiyasi", symmetry: "A₁ (C₂v)", polarization: "Qutblangan (ρ ≈ 0.15)", category: "deformation", comment: "Kvadrat planar burchak deformatsiyasi" },
    { wavenumber: 175, intensity: 18, fwhm: 6, assignment: "δ(N−Pt−N) — N−Pt−N burchak deformatsiyasi", symmetry: "A₁ (C₂v)", polarization: "Qutblangan", category: "deformation", comment: "N−Pt−N burchak o'zgarishi" },
    { wavenumber: 255, intensity: 28, fwhm: 4.5, assignment: "δ(Cl−Pt−N) — ligandlararo burchak deformatsiyasi", symmetry: "B₁ (C₂v)", polarization: "Depolyarizatsiyalangan", category: "deformation", comment: "Sis-izomer uchun xarakterli" },
    { wavenumber: 330, intensity: 100, fwhm: 3.2, assignment: "ν(Pt−Cl) simmetrik valent tebranish", symmetry: "A₁ (C₂v)", polarization: "Kuchli qutblangan (ρ ≈ 0.04)", category: "metal-ligand", forceConstant: "k(Pt−Cl) = 1.95 mdyn/Å", comment: "Eng intensiv Raman piki — ikkala Pt−Cl sinxron cho'ziladi" },
    { wavenumber: 345, intensity: 35, fwhm: 4, assignment: "ν(Pt−Cl) antisimmetrik valent tebranish", symmetry: "B₁ (C₂v)", polarization: "Depolyarizatsiyalangan", category: "metal-ligand", comment: "Pt−Cl lar antifazada tebranadi" },
    { wavenumber: 520, intensity: 65, fwhm: 3.5, assignment: "ν(Pt−N) simmetrik valent tebranish", symmetry: "A₁ (C₂v)", polarization: "Kuchli qutblangan (ρ ≈ 0.05)", category: "metal-ligand", forceConstant: "k(Pt−N) = 2.35 mdyn/Å", comment: "Ikkala Pt−N sinxron cho'ziladi — diagnostik pik" },
    { wavenumber: 540, intensity: 25, fwhm: 4.2, assignment: "ν(Pt−N) antisimmetrik valent tebranish", symmetry: "B₁ (C₂v)", polarization: "Depolyarizatsiyalangan", category: "metal-ligand", comment: "Pt−N lar antifazada" },
    { wavenumber: 690, intensity: 12, fwhm: 7, assignment: "ρ_r(NH₃) — rocking tebranish", symmetry: "B₂ (C₂v)", polarization: "Depolyarizatsiyalangan", category: "nh3-rock", comment: "NH₃ rocking harakati" },
    { wavenumber: 810, intensity: 15, fwhm: 6.5, assignment: "ρ_w(NH₃) — wagging tebranish", symmetry: "A₂ (C₂v)", polarization: "Depolyarizatsiyalangan", category: "nh3-wag", comment: "NH₃ wagging harakati" },
    { wavenumber: 1310, intensity: 30, fwhm: 4.5, assignment: "δ_s(NH₃) — simmetrik deformatsion tebranish (soyabon)", symmetry: "A₁ (C₂v)", polarization: "Qutblangan (ρ ≈ 0.10)", category: "nh3-deform", comment: "NH₃ soyabon deformatsiyasi" },
    { wavenumber: 1550, intensity: 18, fwhm: 5.5, assignment: "δ_d(NH₃) — degenerativ deformatsion tebranish", symmetry: "B₁ (C₂v)", polarization: "Depolyarizatsiyalangan", category: "nh3-deform", comment: "NH₃ degenerativ deformatsiyasi" },
    { wavenumber: 3190, intensity: 40, fwhm: 7, assignment: "ν_s(N−H) — simmetrik valent tebranish", symmetry: "A₁ (C₂v)", polarization: "Qutblangan (ρ ≈ 0.07)", category: "nh-stretch", forceConstant: "k(N−H) = 6.75 mdyn/Å", comment: "Simmetrik N−H cho'zilishi" },
    { wavenumber: 3260, intensity: 30, fwhm: 6.5, assignment: "ν_as(N−H) — antisimmetrik valent tebranish", symmetry: "B₁ (C₂v)", polarization: "Depolyarizatsiyalangan", category: "nh-stretch", comment: "Antisimmetrik N−H — IQ da kuchli" },
    { wavenumber: 3310, intensity: 15, fwhm: 8, assignment: "ν(N−H) + vodorod bog' siljishi (N−H···Cl)", symmetry: "A₁ (bog'langan)", polarization: "Qutblangan", category: "nh-stretch", comment: "Vodorod bog'i ta'sirida siljigan" },
  ],
  
  iqComparison: [
    { vibration: "ν(Pt−Cl) A₁", raman: "330 (100%)", iq: "— (kuchsiz)", rule: "Sof Raman — simmetrik" },
    { vibration: "ν(Pt−Cl) B₁", raman: "345 (35%)", iq: "335 (kuchli)", rule: "IQ da kuchli — antisimmetrik" },
    { vibration: "ν(Pt−N) A₁", raman: "520 (65%)", iq: "510 (kuchsiz)", rule: "Raman da diagnostik" },
    { vibration: "ν(Pt−N) B₁", raman: "540 (25%)", iq: "530 (o'rtacha)", rule: "Ikkalasida ham faol" },
    { vibration: "δ_s(NH₃) A₁", raman: "1310 (30%)", iq: "— (faol emas)", rule: "Sof Raman — simmetrik" },
    { vibration: "ν_s(N−H) A₁", raman: "3190 (40%)", iq: "— (faol emas)", rule: "Sof Raman — simmetrik" },
    { vibration: "ν_as(N−H) B₁", raman: "3260 (30%)", iq: "3250 (juda kuchli)", rule: "IQ da diagnostik" },
  ],
  
  sisVsTrans: {
    title: "sis vs trans — Raman orqali farqlash",
    sis: { vPtCl: "330, 345 (ikkita pik)", vPtN: "520, 540 (ikkita pik)", symmetry: "C₂v — barcha modlar Raman faol", rule: "4 ta Pt−L valent pik → sis-izomer" },
    trans: { vPtCl: "~340 (bitta pik)", vPtN: "~530 (bitta pik)", symmetry: "D₂h — o'zaro istisno qoidasi", rule: "2 ta Pt−L valent pik → trans-izomer" },
    explanation: "sis-izomerda (C₂v) barcha 4 ta Pt−L valent tebranish Raman faol. trans-izomerda (D₂h) inversion markaz mavjud — faqat 2 ta Raman faol mod. Bu farq orqali sis- va trans-izomerlarni Raman spektroskopiyasi bilan aniq farqlash mumkin.",
  },
  
  anticancerNote: {
    title: "Sisplatin — saraton terapiyasi va Raman monitoringi",
    description: "Sisplatin DNK bilan o'zaro ta'sirlashganda Pt−Cl bog'lari uziladi va Pt−N(DNK) bog'lari hosil bo'ladi. Bu jarayon Raman spektroskopiyasi orqali real vaqtda kuzatilishi mumkin:",
    before: "Sisplatin (erkin): ν(Pt−Cl) = 330 sm⁻¹ (kuchli), ν(Pt−N) = 520 sm⁻¹",
    after: "DNK bilan bog'langanda: ν(Pt−Cl) yo'qoladi, ν(Pt−N_DNK) ≈ 510−530 sm⁻¹ da yangi piklar paydo bo'ladi",
    application: "Raman mikroskopiyasi yordamida sisplatinning hujayra ichidagi taqsimoti va DNK bilan o'zaro ta'siri kuzatilgan.",
  },
}

function RamanSpektrGrafik({ lineColor = "#a78bfa" }) {
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
    full: { min: 50, max: 3400 },
    low: { min: 50, max: 600 },
    nh3: { min: 1200, max: 1600 },
    nh: { min: 3100, max: 3400 },
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
      const catColor = { "lattice": "#a78bfa", "deformation": "#fbbf24", "metal-ligand": lineColor, "nh3-rock": "#38bdf8", "nh3-wag": "#34d399", "nh3-deform": "#f97316", "nh-stretch": "#e879f9" }[p.category] || lineColor

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
      ctx.fillText(`${p.wavenumber} sm⁻¹`, tx + 8, y - 72)
      ctx.fillStyle = lineColor; ctx.font = "9px sans-serif"
      ctx.fillText(p.assignment.substring(0, 50), tx + 8, y - 58)
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
          {[["full", "To'liq"], ["low", "50−600"], ["nh3", "NH₃"], ["nh", "N−H"]].map(([k, v]) => (
            <button key={k} onClick={() => setZoomRegion(k)} className={`px-2 py-1 rounded-lg ${zoomRegion === k ? "bg-violet-500/30 text-violet-300 border border-violet-500/50" : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/40"}`}>{v}</button>
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
        {[{ c: "#a78bfa", l: "Lattice" },{ c: "#fbbf24", l: "δ deform" },{ c: "#a78bfa", l: "Pt−Cl/N" },{ c: "#38bdf8", l: "NH₃" },{ c: "#e879f9", l: "N−H" }].map((it, i) => (
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
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-950 via-purple-900 to-blue-950 border border-violet-700/50 p-8 md:p-12 mb-10">
      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
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
            <span className="bg-violet-600/20 text-violet-300 border border-violet-600/30 rounded-full px-3 py-1 text-xs font-semibold">{RAMAN_DATA.tarixiy}</span>
            <span className="bg-purple-600/20 text-purple-300 border border-purple-600/30 rounded-full px-3 py-1 text-xs">d⁸ — kvadrat planar</span>
            <span className="bg-red-600/20 text-red-300 border border-red-600/30 rounded-full px-3 py-1 text-xs">C₂v simmetriya</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[["Eng kuchli pik","330 sm⁻¹","ν(Pt−Cl) A₁"],["ν(Pt−N) A₁","520 sm⁻¹","Diagnostik"],["k(Pt−Cl)","1.95 mdyn/Å","Pt−Cl bog' kuchi"],["Sis vs Trans","4 vs 2 pik","Raman farqi"]].map(([l,v,s],i)=>(
            <div key={i} className="bg-purple-800/30 border border-purple-700/30 rounded-xl p-3 text-center"><p className="text-purple-400 text-xs mb-1">{l}</p><p className="text-white font-bold text-base">{v}</p><p className="text-purple-500 text-xs mt-0.5">{s}</p></div>
          ))}
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
          <p className="text-yellow-300 text-sm"><strong>Diagnostik xulosa:</strong> ν(Pt−Cl) = <span className="font-mono text-lg font-bold">330 sm⁻¹</span> va ν(Pt−N) = <span className="font-mono text-lg font-bold">520 sm⁻¹</span> — sis-izomer uchun xarakterli ikkita Pt−Cl va ikkita Pt−N pik.</p>
        </div>
      </div>
    </div>
  )
}

const TABS = [
  { id: "spectrum", label: "Raman spektri", icon: "📊" },
  { id: "iq-comparison", label: "Raman vs IQ", icon: "⚖️" },
  { id: "sis-vs-trans", label: "sis vs trans", icon: "⚖️" },
  { id: "anticancer", label: "Saraton monitoringi", icon: "💊" },
  { id: "peaks-table", label: "Piklar jadvali", icon: "📋" },
]

export default function SisplatinRamanPage() {
  const [activeTab, setActiveTab] = useState("spectrum")

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 px-6 py-4 mb-6 border-b border-purple-800/50">
          <Link href="/ilmiy/tahlil/raman/birikmalar" className="hover:bg-purple-800/50 p-2 rounded-xl transition-all border border-purple-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          </Link>
          <h1 className="text-xl font-bold text-white">sis-[PtCl₂(NH₃)₂] — Raman spektroskopik tahlil</h1>
        </div>
        <HeroSection />
        <div className="flex flex-wrap gap-1 bg-purple-900/40 border border-purple-700/50 rounded-2xl p-1.5 mb-6">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id ? "bg-violet-600/40 text-white border border-violet-400/50" : "text-purple-400 hover:text-white hover:bg-purple-800/30"}`}><span className="mr-1.5">{tab.icon}</span>{tab.label}</button>
          ))}
        </div>
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          {activeTab === "spectrum" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-violet-400">Interaktiv Raman spektri</h2>
              <p className="text-purple-300 text-sm">Ar⁺ lazer (514.5 nm), 20−80 mW. C₂v simmetriya — barcha modlar Raman faol.</p>
              <RamanSpektrGrafik />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-violet-600/10 border border-violet-500/30 rounded-xl p-4">
                  <h3 className="text-violet-300 font-semibold mb-2">🔬 Pt−L sohasi</h3>
                  <p className="text-purple-200 text-xs">ν(Pt−Cl) = 330, 345 sm⁻¹. ν(Pt−N) = 520, 540 sm⁻¹. 4 ta valent pik — sis-izomer belgisi.</p>
                </div>
                <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-4">
                  <h3 className="text-purple-300 font-semibold mb-2">🔬 NH₃ sohasi</h3>
                  <p className="text-purple-200 text-xs">δ_s(NH₃) = 1310 sm⁻¹. ρ_r, ρ_w = 690, 810 sm⁻¹.</p>
                </div>
                <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-4">
                  <h3 className="text-pink-300 font-semibold mb-2">🔬 N−H sohasi</h3>
                  <p className="text-purple-200 text-xs">ν_s(N−H) = 3190 sm⁻¹. N−H···Cl vodorod bog'lari mavjud.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "iq-comparison" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-violet-400">Raman ↔ IQ — sis-izomer</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm"><thead><tr className="border-b border-purple-700/50"><th className="text-left py-3 px-3 text-purple-400">Tebranish</th><th className="text-left py-3 px-3 text-violet-400">Raman</th><th className="text-left py-3 px-3 text-blue-400">IQ</th><th className="text-left py-3 px-3 text-purple-400">Tanlash qoidasi</th></tr></thead>
                  <tbody>{RAMAN_DATA.iqComparison.map((r, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-3 text-yellow-400 font-mono text-xs">{r.vibration}</td><td className="py-3 px-3 text-violet-300 text-xs">{r.raman}</td><td className="py-3 px-3 text-blue-300 text-xs">{r.iq}</td><td className="py-3 px-3 text-purple-300 text-xs">{r.rule}</td></tr>
                  ))}</tbody></table>
              </div>
            </div>
          )}

          {activeTab === "sis-vs-trans" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-violet-400">{RAMAN_DATA.sisVsTrans.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-violet-600/10 border border-violet-500/30 rounded-xl p-5">
                  <h3 className="text-violet-400 font-semibold mb-3">sis-[PtCl₂(NH₃)₂] — C₂v</h3>
                  <p className="text-purple-200 text-sm">{RAMAN_DATA.sisVsTrans.sis.vPtCl}</p>
                  <p className="text-purple-200 text-sm mt-1">{RAMAN_DATA.sisVsTrans.sis.vPtN}</p>
                  <p className="text-violet-300 text-xs mt-2 font-semibold">{RAMAN_DATA.sisVsTrans.sis.rule}</p>
                </div>
                <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
                  <h3 className="text-blue-400 font-semibold mb-3">trans-[PtCl₂(NH₃)₂] — D₂h</h3>
                  <p className="text-purple-200 text-sm">{RAMAN_DATA.sisVsTrans.trans.vPtCl}</p>
                  <p className="text-purple-200 text-sm mt-1">{RAMAN_DATA.sisVsTrans.trans.vPtN}</p>
                  <p className="text-blue-300 text-xs mt-2 font-semibold">{RAMAN_DATA.sisVsTrans.trans.rule}</p>
                </div>
              </div>
              <div className="bg-purple-800/30 rounded-xl p-5">
                <h3 className="text-yellow-300 font-semibold mb-2">📚 Tushuntirish</h3>
                <p className="text-purple-200 text-sm">{RAMAN_DATA.sisVsTrans.explanation}</p>
              </div>
            </div>
          )}

          {activeTab === "anticancer" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-violet-400">{RAMAN_DATA.anticancerNote.title}</h2>
              <p className="text-purple-200 text-sm">{RAMAN_DATA.anticancerNote.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-violet-600/10 border border-violet-500/30 rounded-xl p-5">
                  <h3 className="text-violet-400 font-semibold mb-2">Sisplatin (erkin)</h3>
                  <p className="text-purple-200 text-sm">{RAMAN_DATA.anticancerNote.before}</p>
                </div>
                <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
                  <h3 className="text-green-400 font-semibold mb-2">DNK bilan bog'langanda</h3>
                  <p className="text-purple-200 text-sm">{RAMAN_DATA.anticancerNote.after}</p>
                </div>
              </div>
              <div className="bg-purple-800/30 rounded-xl p-5">
                <h3 className="text-yellow-300 font-semibold mb-2">💊 Qo'llanish</h3>
                <p className="text-purple-200 text-sm">{RAMAN_DATA.anticancerNote.application}</p>
              </div>
            </div>
          )}

          {activeTab === "peaks-table" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-violet-400">To'liq piklar bazasi (16 mod)</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm"><thead><tr className="border-b border-purple-700/50"><th className="text-left py-3 px-3 text-purple-400">ν (sm⁻¹)</th><th className="text-left py-3 px-3 text-purple-400">I (%)</th><th className="text-left py-3 px-3 text-purple-400">FWHM</th><th className="text-left py-3 px-3 text-purple-400">Simmetriya</th><th className="text-left py-3 px-3 text-purple-400">Tebranish turi</th></tr></thead>
                  <tbody>{RAMAN_DATA.peaks.map((p, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-3 font-mono text-violet-400 font-bold">{p.wavenumber}</td><td className="py-3 px-3 text-yellow-400">{p.intensity}%</td><td className="py-3 px-3 text-purple-300 font-mono text-xs">{p.fwhm}</td><td className="py-3 px-3 text-white font-mono text-xs">{p.symmetry}</td><td className="py-3 px-3 text-purple-200 text-xs">{p.assignment}</td></tr>
                  ))}</tbody></table>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-8 pt-6 border-t border-purple-800/50">
          <Link href="/ilmiy/tahlil/raman/birikmalar/co-nh3-6-cl3" className="text-purple-400 hover:text-purple-200 text-sm flex items-center gap-2"><span>←</span> [Co(NH₃)₆]Cl₃</Link>
          <Link href="/ilmiy/tahlil/raman/birikmalar/ferrosen" className="text-purple-400 hover:text-purple-200 text-sm">[Fe(C₅H₅)₂] →</Link>
        </div>
      </div>
    </div>
  )
}