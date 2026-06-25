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
  formula: "[Co(NH₃)₆]Cl₃",
  iupac: "Geksaamminkobalt(III) xlorid",
  tarixiy: "Verner klassikasi — Nobel 1913",
  cas: "10534-89-1",
  molarMass: "267.48 g·mol⁻¹",
  density: "1.71 g·cm⁻³",
  oxidationState: "Co(III), low-spin d⁶ (S = 0)",
  magneticMoment: "Diamagnit (μ_eff = 0)",
  coordinationGeom: "Oktaedrik (CoN₆ yadrosi)",
  pointGroup: "O_h (erkin ion [Co(NH₃)₆]³⁺), S₆ (kristallda P2₁/n)",
  spaceGroup: "P2₁/n (monoklin)",
  conDistance: "1.961 Å (Co−N)",
  
  lazer: "Ar⁺ (λ = 514.5 nm) yoki Nd:YAG (λ = 1064 nm, FT-Raman)",
  power: "30−100 mW (fotoparchalanishga sezgir — past quvvat!)",
  resolution: "2 sm⁻¹",
  spectralRange: "50−4000 sm⁻¹",
  acquisitionTime: "128−256 skan, 15−30 daqiqa",
  detector: "CCD (514 nm) yoki InGaAs (1064 nm)",
  
  peaks: [
    { wavenumber: 72, intensity: 15, fwhm: 8, assignment: "Panjara modi — [Co(NH₃)₆]³⁺ translatsion tebranish (T_g)", symmetry: "T_g (lattice)", polarization: "Qisman qutblangan", category: "lattice", comment: "Kation-anion panjara tebranishi" },
    { wavenumber: 105, intensity: 12, fwhm: 7, assignment: "Panjara modi — Cl⁻···H−N vodorod bog' tebranishi", symmetry: "A_g (lattice)", polarization: "Qutblangan", category: "lattice", comment: "N−H···Cl vodorod bog'lari tarmog'i" },
    { wavenumber: 145, intensity: 20, fwhm: 6, assignment: "Panjara modi — [Co(NH₃)₆]³⁺ libratsiya (R_g)", symmetry: "R_g (lattice)", polarization: "Depolyarizatsiyalangan", category: "lattice", comment: "Kation libratsion harakati" },
    { wavenumber: 325, intensity: 35, fwhm: 5, assignment: "δ(N−Co−N) deformatsion tebranish (T₂g)", symmetry: "T₂g", polarization: "Depolyarizatsiyalangan", category: "deformation", comment: "Oktaedrik burchak deformatsiyasi — N−Co−N" },
    { wavenumber: 440, intensity: 25, fwhm: 4.5, assignment: "ν(Co−N) + δ(N−Co−N) gibrid mod (E_g)", symmetry: "E_g", polarization: "Depolyarizatsiyalangan (ρ ≈ 0.73)", category: "metal-ligand", comment: "E_g simmetriyali aralash mod" },
    { wavenumber: 500, intensity: 100, fwhm: 3.5, assignment: "ν(Co−N) simmetrik valent tebranish — 'nafas olish' modi", symmetry: "A₁g", polarization: "Kuchli qutblangan (ρ ≈ 0.03)", category: "metal-ligand", forceConstant: "k(Co−N) = 2.45 mdyn/Å", comment: "Eng intensiv Raman piki. Co(III)−N mustahkam bog' — kuchsiz π-back-donation" },
    { wavenumber: 530, intensity: 30, fwhm: 6, assignment: "ν(Co−N) antisimmetrik — kristall maydon buzilishi (F₁u sizishi)", symmetry: "F₁u (formally IR)", polarization: "IR-da kuchli (~498 sm⁻¹)", category: "metal-ligand", comment: "Kristall maydon O_h → S₆ buzilishi — F₁u Raman faollik" },
    { wavenumber: 650, intensity: 10, fwhm: 8, assignment: "ρ_r(NH₃) — rocking tebranish (T₁u komponenti)", symmetry: "T₁u", polarization: "Depolyarizatsiyalangan", category: "nh3-rock", comment: "NH₃ ligandlarining rocking harakati" },
    { wavenumber: 820, intensity: 18, fwhm: 7, assignment: "ν(Co−N) + ρ_w(NH₃) kombinatsion mod", symmetry: "E_g", polarization: "Depolyarizatsiyalangan", category: "nh3-wag", comment: "NH₃ wagging + Co−N valent aralashuvi" },
    { wavenumber: 1320, intensity: 22, fwhm: 5, assignment: "δ_s(NH₃) — simmetrik deformatsion tebranish (soyabon)", symmetry: "A₁g", polarization: "Qutblangan (ρ ≈ 0.12)", category: "nh3-deform", comment: "NH₃ soyabon deformatsiyasi — N−H burchak o'zgarishi" },
    { wavenumber: 1410, intensity: 12, fwhm: 6, assignment: "δ_d(NH₃) — degenerativ deformatsion tebranish", symmetry: "E_g", polarization: "Depolyarizatsiyalangan", category: "nh3-deform", comment: "NH₃ degenerativ deformatsiyasi" },
    { wavenumber: 1605, intensity: 15, fwhm: 6.5, assignment: "δ_as(NH₃) — antisimmetrik deformatsion tebranish", symmetry: "T₂g", polarization: "Depolyarizatsiyalangan", category: "nh3-deform", comment: "NH₃ antisimmetrik deformatsiyasi" },
    { wavenumber: 3180, intensity: 45, fwhm: 8, assignment: "ν_s(N−H) — simmetrik valent tebranish", symmetry: "A₁g", polarization: "Qutblangan (ρ ≈ 0.08)", category: "nh-stretch", forceConstant: "k(N−H) = 6.85 mdyn/Å", comment: "Simmetrik N−H cho'zilishi — barcha 6 ta NH₃ sinxron" },
    { wavenumber: 3260, intensity: 35, fwhm: 7, assignment: "ν_as(N−H) — antisimmetrik valent tebranish (E_g)", symmetry: "E_g", polarization: "Depolyarizatsiyalangan", category: "nh-stretch", comment: "Antisimmetrik N−H — IQ da juda kuchli" },
    { wavenumber: 3330, intensity: 18, fwhm: 9, assignment: "ν(N−H) + vodorod bog' siljishi (N−H···Cl)", symmetry: "A₁g (bog'langan)", polarization: "Qutblangan", category: "nh-stretch", comment: "Vodorod bog'i ta'sirida siljigan N−H tebranishi" },
  ],
  
  iqComparison: [
    { vibration: "ν(Co−N) A₁g", raman: "500 (100%)", iq: "— (faol emas)", rule: "Sof Raman — gerade" },
    { vibration: "ν(Co−N) F₁u", raman: "530 (kuchsiz)", iq: "498 (kuchli)", rule: "Asosan IQ — ungerade" },
    { vibration: "δ(N−Co−N)", raman: "325 (kuchsiz)", iq: "280 (o'rtacha)", rule: "Ikkalasida ham faol" },
    { vibration: "δ_s(NH₃) A₁g", raman: "1320 (22%)", iq: "— (faol emas)", rule: "Sof Raman — simmetrik" },
    { vibration: "δ_d(NH₃) E_g", raman: "1410 (12%)", iq: "1370 (kuchsiz)", rule: "Raman da kuchliroq" },
    { vibration: "ν_s(N−H) A₁g", raman: "3180 (45%)", iq: "— (faol emas)", rule: "Sof Raman — simmetrik" },
    { vibration: "ν_as(N−H) F₁u", raman: "3260 (35%)", iq: "3240 (juda kuchli)", rule: "IQ da diagnostik" },
  ],
  
  groupTheory: {
    title: "Oktaedrik [Co(NH₃)₆]³⁺ uchun guruh nazariyasi tahlili",
    pointGroup: "O_h",
    totalModes: "Γ_total = A₁g + E_g + 2T₁g + T₂g + 3T₁u + T₂u + 2A₂u + Γ(NH₃ ichki)",
    ramanActive: "Γ_Raman = A₁g + E_g + T₂g + NH₃ ichki modlar",
    irActive: "Γ_IR = 3T₁u + NH₃ ichki modlar (F₁u)",
    n_atoms: 25,
    formula: "3N − 6 = 69 ichki tebranish darajasi",
    explanation: "[Co(NH₃)₆]³⁺ — 25 atom (1 Co + 6 N + 18 H). 69 tebranish erkinlik darajasi. NH₃ ligandlari qo'shimcha ichki tebranishlarga ega (ν(N−H), δ(NH₃), ρ(NH₃)). Co(III) — d⁶ LS, kuchli oktaedrik maydon — Co−N bog'lari mustahkam, π-back-donation deyarli yo'q.",
  },
  
  correlation: {
    title: "Korrelyatsion analiz: O_h → S₆ (P2₁/n kristall maydoni)",
    splits: [
      { mode: "A₁g (500, 3180)", oh: "A₁g", s6: "A_g", splitting: "Yopiq", consequence: "Pik yo'nalishi saqlanadi" },
      { mode: "E_g (440, 1410)", oh: "E_g", s6: "A_g + A_g (ikki komponent)", splitting: "ΔE ≈ 3-5 sm⁻¹", consequence: "E_g pik 2 ga bo'linadi" },
      { mode: "T₂g (325, 1605)", oh: "T₂g", s6: "A_g + 2A_g (uch komponent)", splitting: "ΔE ≈ 6-10 sm⁻¹", consequence: "Uchli degenerativ mod 3 komponentga ajraladi" },
      { mode: "T₁u (498, 3240)", oh: "T₁u", s6: "A_u + 2A_u", splitting: "IQ-da kuzatiladi", consequence: "F₁u IQ pik 2-3 komponentga bo'linadi" },
    ],
  },
  
  hydrogenBondEffect: {
    title: "N−H···Cl vodorod bog'lari — Raman spektrida namoyon bo'lishi",
    description: "[Co(NH₃)₆]Cl₃ kristalida har bir NH₃ guruhi Cl⁻ ionlari bilan N−H···Cl vodorod bog'lari hosil qiladi. Bu vodorod bog'lari N−H tebranish chastotalariga ta'sir qiladi:",
    freeNH: "Erkin NH₃: ν(N−H) ≈ 3330−3400 sm⁻¹",
    bondedNH: "Bog'langan NH₃: ν(N−H) ≈ 3180−3260 sm⁻¹ (pastroq chastota)",
    explanation: "Vodorod bog'i N−H bog'ini kuchsizlantiradi → kuch konstantasi kamayadi → chastota pastga siljiydi. 3330 sm⁻¹ dagi pik — vodorod bog'iga ega bo'lmagan NH₃ lar, 3180 sm⁻¹ — kuchli vodorod bog'li NH₃ lar.",
    consequence: "N−H tebranish sohasidagi piklarning kengligi (FWHM 7−9 sm⁻¹) — turli kuchdagi vodorod bog'larining mavjudligini ko'rsatadi.",
  },
}

function RamanSpektrGrafik({ lineColor = "#f87171" }) {
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

  const allPeaks = RAMAN_DATA.peaks
  const peaks = allPeaks

  const ranges = {
    full: { min: 50, max: 3400 },
    low: { min: 50, max: 900 },
    nh3: { min: 1250, max: 1700 },
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
        ctx.font = "9px monospace"; ctx.fillText(p.symmetry, x, y - 38)
      }
    })

    if (hoveredPeak && !selectedPeak) {
      const p = hoveredPeak; const x = xTo(p.wavenumber), y = yTo(Math.min(p.intensity * laserScale, 100))
      const tx = Math.min(Math.max(x - 110, PAD.l + 5), PAD.l + plotW - 225)
      ctx.fillStyle = "#0f0a1a"; ctx.strokeStyle = lineColor; ctx.lineWidth = 1
      ctx.beginPath(); ctx.roundRect(tx, y - 100, 220, 75, 8); ctx.fill(); ctx.stroke()
      ctx.fillStyle = "#fff"; ctx.font = "bold 10px sans-serif"; ctx.textAlign = "left"
      ctx.fillText(`${p.wavenumber} sm⁻¹  (${p.symmetry})`, tx + 8, y - 82)
      ctx.fillStyle = lineColor; ctx.font = "9px sans-serif"
      ctx.fillText(p.assignment.substring(0, 48), tx + 8, y - 68)
      ctx.fillStyle = "#fbbf24"; ctx.font = "9px monospace"
      ctx.fillText(`FWHM: ${p.fwhm} sm⁻¹`, tx + 8, y - 55)
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
          {[["full", "To'liq"], ["low", "50−900"], ["nh3", "NH₃"], ["nh", "N−H"]].map(([k, v]) => (
            <button key={k} onClick={() => setZoomRegion(k)} className={`px-2 py-1 rounded-lg ${zoomRegion === k ? "bg-red-500/30 text-red-300 border border-red-500/50" : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/40"}`}>{v}</button>
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
        {[{ c: "#a78bfa", l: "Lattice" },{ c: "#fbbf24", l: "δ deform" },{ c: "#f87171", l: "Co−N" },{ c: "#38bdf8", l: "NH₃ rock" },{ c: "#34d399", l: "NH₃ wag" },{ c: "#f97316", l: "NH₃ deform" },{ c: "#e879f9", l: "N−H stretch" }].map((it, i) => (
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
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-950 via-orange-900 to-blue-950 border border-red-700/50 p-8 md:p-12 mb-10">
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl" />
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
            <span className="bg-red-600/20 text-red-300 border border-red-600/30 rounded-full px-3 py-1 text-xs font-semibold">{RAMAN_DATA.tarixiy}</span>
            <span className="bg-orange-600/20 text-orange-300 border border-orange-600/30 rounded-full px-3 py-1 text-xs">d⁶ LS — diamagnit</span>
            <span className="bg-purple-600/20 text-purple-300 border border-purple-600/30 rounded-full px-3 py-1 text-xs">O_h → S₆</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[["Eng kuchli pik","500 sm⁻¹","ν(Co−N) A₁g"],["ν(N−H) A₁g","3180 sm⁻¹","Simmetrik"],["k(Co−N)","2.45 mdyn/Å","Mustahkam bog'"],["Vodorod bog'lari","N−H···Cl","Tarmoq"]].map(([l,v,s],i)=>(
            <div key={i} className="bg-purple-800/30 border border-purple-700/30 rounded-xl p-3 text-center"><p className="text-purple-400 text-xs mb-1">{l}</p><p className="text-white font-bold text-base">{v}</p><p className="text-purple-500 text-xs mt-0.5">{s}</p></div>
          ))}
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
          <p className="text-yellow-300 text-sm"><strong>Diagnostik xulosa:</strong> ν(Co−N) = <span className="font-mono text-lg font-bold">500 sm⁻¹</span> (A₁g) — Co(III) uchun xarakterli. N−H···Cl vodorod bog'lari ν(N−H) chastotasiga ta'sir qiladi.</p>
        </div>
      </div>
    </div>
  )
}

const TABS = [
  { id: "spectrum", label: "Raman spektri", icon: "📊" },
  { id: "iq-comparison", label: "Raman vs IQ", icon: "⚖️" },
  { id: "group-theory", label: "Guruh nazariyasi", icon: "🔣" },
  { id: "correlation", label: "Korrelyatsion", icon: "🔗" },
  { id: "hbond", label: "Vodorod bog'lari", icon: "💧" },
  { id: "peaks-table", label: "Piklar jadvali", icon: "📋" },
]

export default function CoNH36Cl3RamanPage() {
  const [activeTab, setActiveTab] = useState("spectrum")

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 px-6 py-4 mb-6 border-b border-purple-800/50">
          <Link href="/ilmiy/tahlil/raman/birikmalar" className="hover:bg-purple-800/50 p-2 rounded-xl transition-all border border-purple-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          </Link>
          <h1 className="text-xl font-bold text-white">[Co(NH₃)₆]Cl₃ — Raman spektroskopik tahlil</h1>
        </div>
        <HeroSection />
        <div className="flex flex-wrap gap-1 bg-purple-900/40 border border-purple-700/50 rounded-2xl p-1.5 mb-6">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id ? "bg-red-600/40 text-white border border-red-400/50" : "text-purple-400 hover:text-white hover:bg-purple-800/30"}`}><span className="mr-1.5">{tab.icon}</span>{tab.label}</button>
          ))}
        </div>
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          {activeTab === "spectrum" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-red-400">Interaktiv Raman spektri — [Co(NH₃)₆]Cl₃</h2>
              <p className="text-purple-300 text-sm">Ar⁺ lazer (514.5 nm), 30−100 mW. Co(III) d⁶ LS — diamagnit. NH₃ ligandlari ichki tebranishlarga ega.</p>
              <RamanSpektrGrafik />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-4">
                  <h3 className="text-red-300 font-semibold mb-2">🔬 Co−N sohasi (300−550)</h3>
                  <p className="text-purple-200 text-xs">ν(Co−N) A₁g = 500 sm⁻¹ — eng kuchli pik. k(Co−N) = 2.45 mdyn/Å — Co(III) uchun xarakterli.</p>
                </div>
                <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-4">
                  <h3 className="text-orange-300 font-semibold mb-2">🔬 NH₃ sohasi (1250−1650)</h3>
                  <p className="text-purple-200 text-xs">δ_s(NH₃) = 1320, δ_d = 1410, δ_as = 1605 sm⁻¹. Soyabon va deformatsion tebranishlar.</p>
                </div>
                <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-4">
                  <h3 className="text-pink-300 font-semibold mb-2">🔬 N−H sohasi (3100−3400)</h3>
                  <p className="text-purple-200 text-xs">ν_s(N−H) = 3180 sm⁻¹. N−H···Cl vodorod bog'lari chastotani pasaytiradi.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "iq-comparison" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-red-400">Raman ↔ IQ — [Co(NH₃)₆]³⁺</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm"><thead><tr className="border-b border-purple-700/50"><th className="text-left py-3 px-3 text-purple-400">Tebranish</th><th className="text-left py-3 px-3 text-red-400">Raman</th><th className="text-left py-3 px-3 text-blue-400">IQ</th><th className="text-left py-3 px-3 text-purple-400">Tanlash qoidasi</th></tr></thead>
                  <tbody>{RAMAN_DATA.iqComparison.map((r, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-3 text-yellow-400 font-mono text-xs">{r.vibration}</td><td className="py-3 px-3 text-red-300 text-xs">{r.raman}</td><td className="py-3 px-3 text-blue-300 text-xs">{r.iq}</td><td className="py-3 px-3 text-purple-300 text-xs">{r.rule}</td></tr>
                  ))}</tbody></table>
              </div>
            </div>
          )}

          {activeTab === "group-theory" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-red-400">{RAMAN_DATA.groupTheory.title}</h2>
              <div className="bg-purple-800/30 rounded-xl p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-yellow-300 font-semibold mb-3">⚛️ Erkinlik darajalari</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-purple-300">Atomlar soni:</span><span className="text-white font-mono">{RAMAN_DATA.groupTheory.n_atoms}</span></div>
                      <div className="flex justify-between"><span className="text-purple-300">Tebranish (3N−6):</span><span className="text-red-300 font-mono font-bold">{RAMAN_DATA.groupTheory.formula}</span></div>
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
              <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
                <h3 className="text-red-300 font-semibold mb-2">📚 Tushuntirish</h3>
                <p className="text-purple-200 text-sm leading-relaxed">{RAMAN_DATA.groupTheory.explanation}</p>
              </div>
            </div>
          )}

          {activeTab === "correlation" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-red-400">{RAMAN_DATA.correlation.title}</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm"><thead><tr className="border-b border-purple-700/50"><th className="text-left py-3 px-3 text-purple-400">Asl mod</th><th className="text-center py-3 px-3 text-yellow-400">O_h</th><th className="text-center py-3 px-3 text-red-400">→</th><th className="text-center py-3 px-3 text-yellow-400">S₆</th><th className="text-left py-3 px-3 text-purple-400">Bo'linish</th></tr></thead>
                  <tbody>{RAMAN_DATA.correlation.splits.map((r, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-3 text-yellow-300 font-mono text-xs">{r.mode}</td><td className="py-3 px-3 text-center text-red-300 font-mono">{r.oh}</td><td className="py-3 px-3 text-center text-purple-500">→</td><td className="py-3 px-3 text-center text-green-300 font-mono">{r.s6}</td><td className="py-3 px-3 text-purple-200 text-xs">{r.splitting}</td></tr>
                  ))}</tbody></table>
              </div>
            </div>
          )}

          {activeTab === "hbond" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-red-400">{RAMAN_DATA.hydrogenBondEffect.title}</h2>
              <p className="text-purple-200 text-sm">{RAMAN_DATA.hydrogenBondEffect.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
                  <h3 className="text-blue-400 font-semibold mb-2">Erkin NH₃</h3>
                  <p className="text-white font-mono text-lg">{RAMAN_DATA.hydrogenBondEffect.freeNH}</p>
                </div>
                <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-5">
                  <h3 className="text-pink-400 font-semibold mb-2">Bog'langan NH₃</h3>
                  <p className="text-white font-mono text-lg">{RAMAN_DATA.hydrogenBondEffect.bondedNH}</p>
                </div>
              </div>
              <div className="bg-purple-800/30 rounded-xl p-5">
                <h3 className="text-yellow-300 font-semibold mb-2">📚 Tushuntirish</h3>
                <p className="text-purple-200 text-sm">{RAMAN_DATA.hydrogenBondEffect.explanation}</p>
                <p className="text-purple-300 text-xs mt-2">{RAMAN_DATA.hydrogenBondEffect.consequence}</p>
              </div>
            </div>
          )}

          {activeTab === "peaks-table" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-red-400">To'liq piklar bazasi (15 mod)</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm"><thead><tr className="border-b border-purple-700/50"><th className="text-left py-3 px-3 text-purple-400">ν (sm⁻¹)</th><th className="text-left py-3 px-3 text-purple-400">I (%)</th><th className="text-left py-3 px-3 text-purple-400">FWHM</th><th className="text-left py-3 px-3 text-purple-400">Simmetriya</th><th className="text-left py-3 px-3 text-purple-400">Tebranish turi</th></tr></thead>
                  <tbody>{RAMAN_DATA.peaks.map((p, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-3 font-mono text-red-400 font-bold">{p.wavenumber}</td><td className="py-3 px-3 text-yellow-400">{p.intensity}%</td><td className="py-3 px-3 text-purple-300 font-mono text-xs">{p.fwhm}</td><td className="py-3 px-3 text-white font-mono text-xs">{p.symmetry}</td><td className="py-3 px-3 text-purple-200 text-xs">{p.assignment}</td></tr>
                  ))}</tbody></table>
              </div>
              <div className="bg-purple-800/30 rounded-xl p-5">
                <h3 className="text-yellow-300 font-semibold mb-3">⚙️ Eksperimental parametrlar</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between"><span className="text-purple-400">Lazer:</span><span className="text-white text-xs">{RAMAN_DATA.lazer}</span></div>
                  <div className="flex justify-between"><span className="text-purple-400">Quvvat:</span><span className="text-white text-xs">{RAMAN_DATA.power}</span></div>
                  <div className="flex justify-between"><span className="text-purple-400">Ruxsat:</span><span className="text-white text-xs">{RAMAN_DATA.resolution}</span></div>
                  <div className="flex justify-between"><span className="text-purple-400">Detektor:</span><span className="text-white text-xs">{RAMAN_DATA.detector}</span></div>
                  <div className="flex justify-between"><span className="text-purple-400">Diapazon:</span><span className="text-white text-xs">{RAMAN_DATA.spectralRange}</span></div>
                  <div className="flex justify-between"><span className="text-purple-400">Yig'ish vaqti:</span><span className="text-white text-xs">{RAMAN_DATA.acquisitionTime}</span></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-8 pt-6 border-t border-purple-800/50">
          <Link href="/ilmiy/tahlil/raman/birikmalar/k4-fe-cn6" className="text-purple-400 hover:text-purple-200 text-sm flex items-center gap-2"><span>←</span> K₄[Fe(CN)₆]</Link>
          <Link href="/ilmiy/tahlil/raman/birikmalar/sisplatin" className="text-purple-400 hover:text-purple-200 text-sm">sis-[PtCl₂(NH₃)₂] →</Link>
        </div>
      </div>
    </div>
  )
}