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
  formula: "[Ni(CN)₄]²⁻",
  iupac: "Tetrasiyanonikkolat(II) ioni",
  tarixiy: "",
  cas: "48042-08-6",
  molarMass: "162.78 g·mol⁻¹ (ioni), 240.91 g·mol⁻¹ (K₂ tuzi)",
  density: "1.75 g·cm⁻³ (K₂[Ni(CN)₄])",
  oxidationState: "Ni(II), d⁸ (S = 0)",
  magneticMoment: "Diamagnit",
  coordinationGeom: "Kvadrat planar (NiC₄, D₄h simmetriya)",
  pointGroup: "D₄h (erkin ion)",
  spaceGroup: "P4/mmm (tetragonal)",
  bondDistances: "Ni−C: 1.86 Å, C≡N: 1.15 Å",
  
  lazer: "Ar⁺ (λ = 514.5 nm) yoki Nd:YAG (λ = 1064 nm)",
  power: "30−100 mW",
  resolution: "2 sm⁻¹",
  spectralRange: "50−4000 sm⁻¹",
  acquisitionTime: "64−128 skan",
  detector: "CCD (514 nm) yoki InGaAs (1064 nm)",
  
  peaks: [
    { wavenumber: 65, intensity: 8, fwhm: 5, assignment: "Panjara modi — K⁺···[Ni(CN)₄]²⁻ translatsion tebranish", symmetry: "A₁g (lattice)", polarization: "Qutblangan", category: "lattice", comment: "Past chastotali panjara modi" },
    { wavenumber: 110, intensity: 14, fwhm: 4.5, assignment: "Panjara modi — [Ni(CN)₄]²⁻ libratsiya (E_g)", symmetry: "E_g (lattice)", polarization: "Depolyarizatsiyalangan", category: "lattice", comment: "Anion libratsion harakati" },
    { wavenumber: 185, intensity: 18, fwhm: 4, assignment: "δ(C−Ni−C) — sis burchak deformatsiyasi (B₂g)", symmetry: "B₂g", polarization: "Depolyarizatsiyalangan", category: "deformation", comment: "Kvadrat planar tekislikdagi burchak deformatsiyasi" },
    { wavenumber: 260, intensity: 22, fwhm: 3.8, assignment: "π(NiC₄) — tekislikdan chiqish deformatsiyasi (A₂u)", symmetry: "A₂u", polarization: "—", category: "deformation", comment: "Ni atomi tekislikdan chiqishi — IQ da faol" },
    { wavenumber: 320, intensity: 35, fwhm: 3.5, assignment: "δ(Ni−C≡N) — Ni−C≡N burchak deformatsiyasi (E_g)", symmetry: "E_g", polarization: "Depolyarizatsiyalangan", category: "deformation", comment: "C≡N guruhlarining tekislikdan chiqishi" },
    { wavenumber: 420, intensity: 100, fwhm: 3, assignment: "ν(Ni−C) simmetrik valent tebranish — 'nafas olish' modi", symmetry: "A₁g", polarization: "Kuchli qutblangan (ρ ≈ 0.03)", category: "metal-ligand", forceConstant: "k(Ni−C) = 2.55 mdyn/Å", comment: "Eng intensiv Raman piki. Barcha 4 ta Ni−C sinxron cho'ziladi" },
    { wavenumber: 445, intensity: 28, fwhm: 3.8, assignment: "ν(Ni−C) antisimmetrik valent tebranish (E_u)", symmetry: "E_u", polarization: "—", category: "metal-ligand", comment: "Antisimmetrik Ni−C — IQ da kuchli (~450 sm⁻¹)" },
    { wavenumber: 480, intensity: 15, fwhm: 5, assignment: "ν(Ni−C) + δ(C−Ni−C) kombinatsion mod (B₁g)", symmetry: "B₁g", polarization: "Depolyarizatsiyalangan", category: "metal-ligand", comment: "Aralash Ni−C valent + deformatsion mod" },
    { wavenumber: 2125, intensity: 75, fwhm: 2.8, assignment: "ν(C≡N) simmetrik cho'zilish — barcha 4 ta CN sinxron (A₁g)", symmetry: "A₁g", polarization: "Kuchli qutblangan (ρ ≈ 0.02)", category: "cn-stretch", forceConstant: "k(C≡N) = 17.2 mdyn/Å", comment: "Simmetrik C≡N tebranishi — diagnostik pik" },
    { wavenumber: 2135, intensity: 20, fwhm: 3.5, assignment: "ν(C≡N) antisimmetrik — B₁g komponenti", symmetry: "B₁g", polarization: "Depolyarizatsiyalangan", category: "cn-stretch", comment: "Antisimmetrik C≡N — IQ da juda kuchli (~2128 sm⁻¹)" },
    { wavenumber: 2150, intensity: 8, fwhm: 6, assignment: "Kombinatsion mod: ν(C≡N) + lattice", symmetry: "—", polarization: "Depolyarizatsiyalangan", category: "combination", comment: "Anharmonik kombinatsiya yon-piki" },
  ],
  
  iqComparison: [
    { vibration: "ν(Ni−C) A₁g", raman: "420 (100%)", iq: "— (faol emas)", rule: "Sof Raman — A₁g D₄h" },
    { vibration: "ν(Ni−C) E_u", raman: "445 (kuchsiz)", iq: "450 (kuchli)", rule: "Sof IQ — E_u D₄h" },
    { vibration: "δ(C−Ni−C) B₂g", raman: "185 (18%)", iq: "— (faol emas)", rule: "Sof Raman" },
    { vibration: "π(NiC₄) A₂u", raman: "260 (22%)", iq: "255 (kuchli)", rule: "IQ da kuchli" },
    { vibration: "ν(C≡N) A₁g", raman: "2125 (75%)", iq: "— (faol emas)", rule: "Sof Raman — simmetrik" },
    { vibration: "ν(C≡N) B₁g", raman: "2135 (20%)", iq: "2128 (juda kuchli)", rule: "IQ da diagnostik" },
  ],
  
  symmetryNote: {
    title: "D₄h simmetriya — [Ni(CN)₄]²⁻ uchun guruh nazariyasi",
    pointGroup: "D₄h",
    totalModes: "Γ_total = A₁g + A₂g + B₁g + B₂g + E_g + 2A₂u + B₂u + 3E_u",
    ramanActive: "Γ_Raman = A₁g + B₁g + B₂g + E_g (5 ta Raman faol mod)",
    irActive: "Γ_IR = A₂u + 3E_u (4 ta IQ faol mod)",
    mutualExclusion: "D₄h da inversion markaz mavjud (i) — o'zaro istisno qoidasi qat'iy bajariladi. A₁g, B₁g, B₂g, E_g faqat Raman da faol. A₂u, E_u faqat IQ da faol.",
    n_atoms: 9,
    formula: "3N − 6 = 21 ichki tebranish darajasi",
    explanation: "[Ni(CN)₄]²⁻ — 9 atom (1 Ni + 4 C + 4 N). 21 tebranish erkinlik darajasi. D₄h simmetriya. Ni(II) d⁸ — kvadrat planar geometriya dsp² gibridlanish natijasi.",
  },
  
  comparisonWithNiCl4: {
    title: "[Ni(CN)₄]²⁻ vs [NiCl₄]²⁻ — geometriya farqi Raman orqali",
    cn4: { geometry: "Kvadrat planar (D₄h)", spin: "Diamagnit (S=0)", vNiC: "420 sm⁻¹", vCN: "2125 sm⁻¹", comment: "CN⁻ kuchli maydon ligandi — dsp² gibridlanish" },
    cl4: { geometry: "Tetraedrik (T_d)", spin: "Paramagnit (S=1, μ≈2.83 BM)", vNiCl: "~290 sm⁻¹", vCN: "—", comment: "Cl⁻ kuchsiz maydon ligandi — sp³ gibridlanish" },
    explanation: "CN⁻ spektrokimyoviy qatorda Cl⁻ dan ancha yuqorida. Kuchli maydon d⁸ konfiguratsiyada kvadrat planar geometriyani energetik qulay qiladi — barcha elektronlar juftlashgan (diamagnit). Cl⁻ kuchsiz maydoni tetraedrik geometriyaga olib keladi — 2 ta toq elektron (paramagnit).",
  },
}

function RamanSpektrGrafik({ lineColor = "#22d3ee" }) {
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
    full: { min: 50, max: 2200 },
    low: { min: 50, max: 500 },
    cn: { min: 2100, max: 2160 },
  }
  const { min: wnMin, max: wnMax } = ranges[zoomRegion]

  useEffect(() => {
    const updateSize = () => { 
      if (containerRef.current) { 
        const w = Math.min(820, containerRef.current.clientWidth)
        setCanvasSize({ w, h: w > 500 ? 380 : 280 }) 
      } 
    }
    updateSize(); window.addEventListener('resize', updateSize); return () => window.removeEventListener('resize', updateSize)
  }, [])

  useEffect(() => {
    startTimeRef.current = null; setAnimProgress(0)
    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const progress = Math.min((timestamp - startTimeRef.current) / 1200, 1)
      setAnimProgress(progress)
      if (progress < 1) animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate); return () => cancelAnimationFrame(animRef.current)
  }, [zoomRegion, laser])

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext("2d"); const W = canvas.width, H = canvas.height
    const PAD = { l: 70, r: 30, t: 30, b: 60 }; const plotW = W - PAD.l - PAD.r, plotH = H - PAD.t - PAD.b
    const xTo = (v) => PAD.l + ((v - wnMin) / (wnMax - wnMin)) * plotW
    const yTo = (v) => PAD.t + ((105 - v) / 105) * plotH

    const bg = ctx.createLinearGradient(0, 0, 0, H)
    bg.addColorStop(0, "#0a0716"); bg.addColorStop(1, "#1a0f2e")
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H)

    ctx.strokeStyle = "#2a1f3d"; ctx.lineWidth = 0.5
    const step = (wnMax - wnMin) > 1000 ? 200 : 50
    for (let w = Math.ceil(wnMin / step) * step; w <= wnMax; w += step) {
      ctx.beginPath(); ctx.moveTo(xTo(w), PAD.t); ctx.lineTo(xTo(w), PAD.t + plotH); ctx.stroke()
    }
    ;[20, 40, 60, 80, 100].forEach(v => {
      ctx.beginPath(); ctx.moveTo(PAD.l, yTo(v)); ctx.lineTo(PAD.l + plotW, yTo(v)); ctx.stroke()
    })
    ctx.strokeStyle = "#3d2a5c"; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(PAD.l, yTo(0)); ctx.lineTo(PAD.l + plotW, yTo(0)); ctx.stroke()

    const laserScale = laser === 1064 ? 1.0 : laser === 633 ? 2.85 : laser === 514 ? 5.4 : 8.2
    const visiblePeaks = peaks.filter(p => p.wavenumber >= wnMin && p.wavenumber <= wnMax && p.wavenumber <= wnMin + (wnMax - wnMin) * animProgress)

    if (showFit) {
      ctx.strokeStyle = lineColor; ctx.lineWidth = 2; ctx.beginPath()
      for (let x = PAD.l; x <= PAD.l + plotW; x += 1) {
        const wn = wnMin + ((x - PAD.l) / plotW) * (wnMax - wnMin)
        let total = 0
        visiblePeaks.forEach(p => { const gamma = p.fwhm / 2; total += (p.intensity * laserScale * gamma * gamma) / (Math.pow(wn - p.wavenumber, 2) + gamma * gamma) })
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
      const isH = hoveredPeak?.wavenumber === p.wavenumber; const isS = selectedPeak?.wavenumber === p.wavenumber
      const catColor = { "lattice": "#a78bfa", "deformation": "#fbbf24", "metal-ligand": lineColor, "cn-stretch": "#34d399", "combination": "#f87171" }[p.category] || lineColor

      ctx.beginPath(); ctx.arc(x, y, (isH || isS) ? 7 : 4, 0, Math.PI * 2)
      ctx.fillStyle = catColor; ctx.fill()
      if (isS) { ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2); ctx.fillStyle = catColor + "25"; ctx.fill() }

      if (p.intensity > 20 || isH || isS) { ctx.fillStyle = catColor; ctx.font = "bold 9px monospace"; ctx.textAlign = "center"; ctx.fillText(`${p.wavenumber}`, x, y - 12) }
      if (isH || isS) { ctx.fillStyle = "#fff"; ctx.font = "bold 11px monospace"; ctx.fillText(`${p.wavenumber} sm⁻¹`, x, y - 26) }
    })

    if (hoveredPeak && !selectedPeak) {
      const p = hoveredPeak; const x = xTo(p.wavenumber), y = yTo(Math.min(p.intensity * laserScale, 100))
      const tx = Math.min(Math.max(x - 110, PAD.l + 5), PAD.l + plotW - 225)
      ctx.fillStyle = "#0f0a1a"; ctx.strokeStyle = lineColor; ctx.lineWidth = 1
      ctx.beginPath(); ctx.roundRect(tx, y - 85, 220, 65, 8); ctx.fill(); ctx.stroke()
      ctx.fillStyle = "#fff"; ctx.font = "bold 10px sans-serif"; ctx.textAlign = "left"
      ctx.fillText(`${p.wavenumber} sm⁻¹ (${p.symmetry})`, tx + 8, y - 68)
      ctx.fillStyle = lineColor; ctx.font = "9px sans-serif"
      ctx.fillText(p.assignment.substring(0, 48), tx + 8, y - 54)
    }

    ctx.strokeStyle = "#3d2a5c"; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(PAD.l, PAD.t); ctx.lineTo(PAD.l, PAD.t + plotH); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(PAD.l, PAD.t + plotH); ctx.lineTo(PAD.l + plotW, PAD.t + plotH); ctx.stroke()

    ctx.fillStyle = "#7c6a9e"; ctx.font = "10px sans-serif"; ctx.textAlign = "center"
    for (let w = Math.ceil(wnMin / step) * step; w <= wnMax; w += step) ctx.fillText(w, xTo(w), PAD.t + plotH + 16)
    ctx.font = "11px sans-serif"; ctx.fillStyle = "#a78bfa"; ctx.fillText("Raman siljishi (sm⁻¹)", PAD.l + plotW / 2, H - 8)
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
          {[["full", "To'liq"], ["low", "50−500"], ["cn", "C≡N"]].map(([k, v]) => (
            <button key={k} onClick={() => setZoomRegion(k)} className={`px-2 py-1 rounded-lg ${zoomRegion === k ? "bg-cyan-500/30 text-cyan-300 border border-cyan-500/50" : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/40"}`}>{v}</button>
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
        {[{ c: "#a78bfa", l: "Lattice" },{ c: "#fbbf24", l: "δ deform" },{ c: "#22d3ee", l: "Ni−C" },{ c: "#34d399", l: "C≡N" },{ c: "#f87171", l: "Komb" }].map((it, i) => (
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
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-950 via-blue-900 to-blue-950 border border-cyan-700/50 p-8 md:p-12 mb-10">
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
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
            <span className="bg-cyan-600/20 text-cyan-300 border border-cyan-600/30 rounded-full px-3 py-1 text-xs font-semibold">Kvadrat planar</span>
            <span className="bg-blue-600/20 text-blue-300 border border-blue-600/30 rounded-full px-3 py-1 text-xs">d⁸ — diamagnit</span>
            <span className="bg-purple-600/20 text-purple-300 border border-purple-600/30 rounded-full px-3 py-1 text-xs">D₄h simmetriya</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[["Eng kuchli pik","420 sm⁻¹","ν(Ni−C) A₁g"],["ν(C≡N) A₁g","2125 sm⁻¹","Diagnostik"],["k(Ni−C)","2.55 mdyn/Å","Kuchli bog'"],["Ni−C masofa","1.86 Å","Kvadrat planar"]].map(([l,v,s],i)=>(
            <div key={i} className="bg-purple-800/30 border border-purple-700/30 rounded-xl p-3 text-center"><p className="text-purple-400 text-xs mb-1">{l}</p><p className="text-white font-bold text-base">{v}</p><p className="text-purple-500 text-xs mt-0.5">{s}</p></div>
          ))}
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
          <p className="text-yellow-300 text-sm"><strong>Diagnostik xulosa:</strong> ν(Ni−C) = <span className="font-mono text-lg font-bold">420 sm⁻¹</span> (A₁g) va ν(C≡N) = <span className="font-mono text-lg font-bold">2125 sm⁻¹</span> (A₁g) — kvadrat planar [Ni(CN)₄]²⁻ uchun xarakterli.</p>
        </div>
      </div>
    </div>
  )
}

const TABS = [
  { id: "spectrum", label: "Raman spektri", icon: "📊" },
  { id: "iq-comparison", label: "Raman vs IQ", icon: "⚖️" },
  { id: "symmetry", label: "D₄h simmetriya", icon: "🔣" },
  { id: "vs-nicl4", label: "CN⁻ vs Cl⁻", icon: "⚖️" },
  { id: "peaks-table", label: "Piklar jadvali", icon: "📋" },
]

export default function NiCN4RamanPage() {
  const [activeTab, setActiveTab] = useState("spectrum")

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 px-6 py-4 mb-6 border-b border-purple-800/50">
          <Link href="/ilmiy/tahlil/raman/birikmalar" className="hover:bg-purple-800/50 p-2 rounded-xl transition-all border border-purple-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          </Link>
          <h1 className="text-xl font-bold text-white">[Ni(CN)₄]²⁻ — Raman spektroskopik tahlil</h1>
        </div>
        <HeroSection />
        <div className="flex flex-wrap gap-1 bg-purple-900/40 border border-purple-700/50 rounded-2xl p-1.5 mb-6">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id ? "bg-cyan-600/40 text-white border border-cyan-400/50" : "text-purple-400 hover:text-white hover:bg-purple-800/30"}`}><span className="mr-1.5">{tab.icon}</span>{tab.label}</button>
          ))}
        </div>
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          {activeTab === "spectrum" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-cyan-400">Interaktiv Raman spektri — [Ni(CN)₄]²⁻</h2>
              <p className="text-purple-300 text-sm">Ar⁺ lazer (514.5 nm). D₄h simmetriya — A₁g, B₁g, B₂g, E_g Raman faol.</p>
              <RamanSpektrGrafik />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-4">
                  <h3 className="text-cyan-300 font-semibold mb-2">🔬 Ni−C sohasi</h3>
                  <p className="text-purple-200 text-xs">ν(Ni−C) = 420 sm⁻¹ (A₁g, 100%). k(Ni−C) = 2.55 mdyn/Å — kuchli kovalent bog'.</p>
                </div>
                <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-4">
                  <h3 className="text-green-300 font-semibold mb-2">🔬 C≡N sohasi</h3>
                  <p className="text-purple-200 text-xs">ν(C≡N) = 2125 sm⁻¹ (A₁g, 75%). B₁g komponenti 2135 sm⁻¹ da. k(C≡N) = 17.2 mdyn/Å.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "iq-comparison" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-cyan-400">Raman ↔ IQ — [Ni(CN)₄]²⁻ D₄h</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm"><thead><tr className="border-b border-purple-700/50"><th className="text-left py-3 px-3 text-purple-400">Tebranish</th><th className="text-left py-3 px-3 text-cyan-400">Raman</th><th className="text-left py-3 px-3 text-blue-400">IQ</th><th className="text-left py-3 px-3 text-purple-400">Tanlash qoidasi</th></tr></thead>
                  <tbody>{RAMAN_DATA.iqComparison.map((r, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-3 text-yellow-400 font-mono text-xs">{r.vibration}</td><td className="py-3 px-3 text-cyan-300 text-xs">{r.raman}</td><td className="py-3 px-3 text-blue-300 text-xs">{r.iq}</td><td className="py-3 px-3 text-purple-300 text-xs">{r.rule}</td></tr>
                  ))}</tbody></table>
              </div>
            </div>
          )}

          {activeTab === "symmetry" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-cyan-400">{RAMAN_DATA.symmetryNote.title}</h2>
              <div className="bg-purple-800/30 rounded-xl p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-yellow-300 font-semibold mb-3">⚛️ Erkinlik darajalari</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-purple-300">Atomlar soni:</span><span className="text-white font-mono">{RAMAN_DATA.symmetryNote.n_atoms}</span></div>
                      <div className="flex justify-between"><span className="text-purple-300">Tebranish (3N−6):</span><span className="text-cyan-300 font-mono font-bold">{RAMAN_DATA.symmetryNote.formula}</span></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-yellow-300 font-semibold mb-3">📐 Simmetriya tahlili (D₄h)</h3>
                    <div className="space-y-2 text-xs">
                      <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-2"><p className="text-green-300 font-semibold">🟢 Raman faol:</p><p className="text-purple-200 font-mono mt-1">{RAMAN_DATA.symmetryNote.ramanActive}</p></div>
                      <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-2"><p className="text-blue-300 font-semibold">🔵 IQ faol:</p><p className="text-purple-200 font-mono mt-1">{RAMAN_DATA.symmetryNote.irActive}</p></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-5">
                <h3 className="text-cyan-300 font-semibold mb-2">🚫 O'zaro istisno qoidasi</h3>
                <p className="text-purple-200 text-sm">{RAMAN_DATA.symmetryNote.mutualExclusion}</p>
              </div>
              <div className="bg-purple-800/30 rounded-xl p-5">
                <h3 className="text-yellow-300 font-semibold mb-2">📚 Tushuntirish</h3>
                <p className="text-purple-200 text-sm">{RAMAN_DATA.symmetryNote.explanation}</p>
              </div>
            </div>
          )}

          {activeTab === "vs-nicl4" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-cyan-400">{RAMAN_DATA.comparisonWithNiCl4.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-5">
                  <h3 className="text-cyan-400 font-semibold mb-3">[Ni(CN)₄]²⁻</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-purple-300">Geometriya:</span><span className="text-white">{RAMAN_DATA.comparisonWithNiCl4.cn4.geometry}</span></div>
                    <div className="flex justify-between"><span className="text-purple-300">Spin:</span><span className="text-white">{RAMAN_DATA.comparisonWithNiCl4.cn4.spin}</span></div>
                    <div className="flex justify-between"><span className="text-purple-300">ν(Ni−C):</span><span className="text-cyan-300 font-mono">{RAMAN_DATA.comparisonWithNiCl4.cn4.vNiC}</span></div>
                    <div className="flex justify-between"><span className="text-purple-300">ν(C≡N):</span><span className="text-green-300 font-mono">{RAMAN_DATA.comparisonWithNiCl4.cn4.vCN}</span></div>
                  </div>
                </div>
                <div className="bg-purple-800/30 border border-purple-700/30 rounded-xl p-5">
                  <h3 className="text-purple-300 font-semibold mb-3">[NiCl₄]²⁻</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-purple-300">Geometriya:</span><span className="text-white">{RAMAN_DATA.comparisonWithNiCl4.cl4.geometry}</span></div>
                    <div className="flex justify-between"><span className="text-purple-300">Spin:</span><span className="text-white">{RAMAN_DATA.comparisonWithNiCl4.cl4.spin}</span></div>
                    <div className="flex justify-between"><span className="text-purple-300">ν(Ni−Cl):</span><span className="text-purple-300 font-mono">{RAMAN_DATA.comparisonWithNiCl4.cl4.vNiCl}</span></div>
                  </div>
                </div>
              </div>
              <div className="bg-purple-800/30 rounded-xl p-5">
                <h3 className="text-yellow-300 font-semibold mb-2">📚 Tushuntirish</h3>
                <p className="text-purple-200 text-sm">{RAMAN_DATA.comparisonWithNiCl4.explanation}</p>
              </div>
            </div>
          )}

          {activeTab === "peaks-table" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-cyan-400">To'liq piklar bazasi (11 mod)</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm"><thead><tr className="border-b border-purple-700/50"><th className="text-left py-3 px-3 text-purple-400">ν (sm⁻¹)</th><th className="text-left py-3 px-3 text-purple-400">I (%)</th><th className="text-left py-3 px-3 text-purple-400">FWHM</th><th className="text-left py-3 px-3 text-purple-400">Simmetriya</th><th className="text-left py-3 px-3 text-purple-400">Tebranish turi</th></tr></thead>
                  <tbody>{RAMAN_DATA.peaks.map((p, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-3 font-mono text-cyan-400 font-bold">{p.wavenumber}</td><td className="py-3 px-3 text-yellow-400">{p.intensity}%</td><td className="py-3 px-3 text-purple-300 font-mono text-xs">{p.fwhm}</td><td className="py-3 px-3 text-white font-mono text-xs">{p.symmetry}</td><td className="py-3 px-3 text-purple-200 text-xs">{p.assignment}</td></tr>
                  ))}</tbody></table>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-8 pt-6 border-t border-purple-800/50">
          <Link href="/ilmiy/tahlil/raman/birikmalar/ferrosen" className="text-purple-400 hover:text-purple-200 text-sm flex items-center gap-2"><span>←</span> [Fe(C₅H₅)₂]</Link>
          <Link href="/ilmiy/tahlil/raman/birikmalar/cu-h2o6" className="text-purple-400 hover:text-purple-200 text-sm">[Cu(H₂O)₆]²⁺ →</Link>
        </div>
      </div>
    </div>
  )
}