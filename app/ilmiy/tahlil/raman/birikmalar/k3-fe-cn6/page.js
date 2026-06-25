"use client"

import Link from "next/link"
import { useState, useEffect, useRef, useCallback, useMemo } from "react"

// ============================================================================
// CANVAS POLYFILL
// ============================================================================
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

// ============================================================================
// ILMIY MA'LUMOTLAR BAZASI — K₃[Fe(CN)₆]
// ============================================================================
const RAMAN_DATA = {
  formula: "K₃[Fe(CN)₆]",
  iupac: "Kaliy geksasiyanoferrat(III)",
  tarixiy: "Qizil qon tuzi (Hirschblutlaugensalz)",
  cas: "13746-66-2",
  molarMass: "329.24 g·mol⁻¹",
  density: "1.89 g·cm⁻³",
  oxidationState: "Fe(III), low-spin d⁵ (S = 1/2)",
  magneticMoment: "μ_eff ≈ 2.25 μ_B (300 K)",
  coordinationGeom: "Oktaedrik (FeC₆ yadrosi)",
  pointGroup: "O_h (erkin ion), C_2h (kristallda monoklin)",
  spaceGroup: "P2₁/c (monoklin)",
  fePerCmDistance: "1.93 Å (Fe−C), 1.16 Å (C≡N)",
  
  // Eksperimental parametrlar
  lazer: "Nd:YAG (λ = 1064 nm, FT-Raman) yoki Ar⁺ (λ = 514.5 nm)",
  power: "50−200 mW (fotodissotsiatsiyani oldini olish uchun)",
  resolution: "2 sm⁻¹",
  spectralRange: "50−4000 sm⁻¹",
  acquisitionTime: "64−128 skan, 10−20 daqiqa",
  detector: "InGaAs (1064 nm) yoki CCD (514 nm)",
  
  // To'liq piklar bazasi — 9 ta tebranish modi
  peaks: [
    { wavenumber: 88, intensity: 12, fwhm: 8, assignment: "Panjara modi — K⁺···[Fe(CN)₆]³⁻ translatsion tebranish", symmetry: "T_g (lattice)", polarization: "Qisman qutblangan", category: "lattice", comment: "Past chastotali panjara modlari — kristall qadoqlash energiyasini aks ettiradi" },
    { wavenumber: 128, intensity: 18, fwhm: 6, assignment: "Panjara modi — [Fe(CN)₆]³⁻ libratsiya (R_g)", symmetry: "R_g (lattice)", polarization: "Depolyarizatsiyalangan", category: "lattice", comment: "Anion librayion harakati — kristall maydonning belgisi" },
    { wavenumber: 390, intensity: 100, fwhm: 4.2, assignment: "ν(Fe−C) simmetrik valent tebranish — 'nafas olish' modi", symmetry: "A₁g", polarization: "Qutblangan (ρ ≈ 0.05)", category: "metal-ligand", forceConstant: "k(Fe−C) = 2.21 mdyn/Å", comment: "Eng intensiv Raman piki. Barcha 6 ta Fe−C bog'i bir vaqtda cho'ziladi/qisqaradi" },
    { wavenumber: 416, intensity: 28, fwhm: 5.1, assignment: "ν(Fe−C) + δ(C−Fe−C) gibrid mod (E_g)", symmetry: "E_g", polarization: "Depolyarizatsiyalangan (ρ ≈ 0.75)", category: "metal-ligand", comment: "Ikki tomonlama buzilishli mod — E_g simmetriyali" },
    { wavenumber: 480, intensity: 15, fwhm: 6.8, assignment: "δ(Fe−C≡N) deformatsion tebranish", symmetry: "E_g", polarization: "Depolyarizatsiyalangan (ρ ≈ 0.72)", category: "deformation", comment: "Fe−C≡N chiziqlilikdan og'ish — kuchsiz Raman faol" },
    { wavenumber: 510, intensity: 22, fwhm: 7.5, assignment: "ν(Fe−C) antisimmetrik tebranish — IQ ↔ Raman 'sizish'", symmetry: "F₁u (formally IR)", polarization: "IR-da kuchli (~585 sm⁻¹)", category: "metal-ligand", comment: "Kristall maydon Oh ni C_2h ga buzilishi — F₁u ning kuchsiz Raman faolligi" },
    { wavenumber: 2130, intensity: 75, fwhm: 3.8, assignment: "ν(C≡N) simmetrik cho'zilish — barcha 6 ta CN sinxron", symmetry: "A₁g", polarization: "Kuchli qutblangan (ρ ≈ 0.03)", category: "cn-stretch", forceConstant: "k(C≡N) = 17.4 mdyn/Å", comment: "Diagnostik pik — Fe(III) ni Fe(II) dan ajratish uchun (Δν ≈ 32 sm⁻¹)" },
    { wavenumber: 2135, intensity: 20, fwhm: 5.2, assignment: "ν(C≡N) E_g — ekvatorial CN-lar antifaza", symmetry: "E_g", polarization: "Depolyarizatsiyalangan", category: "cn-stretch", comment: "A₁g pikidan 5 sm⁻¹ yuqorida — kuchaytirilgan ruxsat (≤2 sm⁻¹) bilan ajraladi" },
    { wavenumber: 2160, intensity: 8, fwhm: 9, assignment: "Kombinatsion mod: ν(C≡N) A₁g + lattice (88 sm⁻¹) (yon-pik)", symmetry: "—", polarization: "Depolyarizatsiyalangan", category: "combination", comment: "Anharmonik kombinatsiya — past intensivlikli yon-piklar" },
  ],
  
  // Raman vs IQ taqqoslash
  iqComparison: [
    { vibration: "Lattice T_g/R_g (~88-128)", raman: "88, 128 (kuchsiz)", iq: "— (qiyin kuzatiladi)", rule: "Faqat past chastotali Raman da", category: "lattice" },
    { vibration: "δ(C−Fe−C) T₂g", raman: "364 (juda kuchsiz)", iq: "— (faol emas)", rule: "Raman selektiv — T₂g", category: "metal" },
    { vibration: "ν(Fe−C) A₁g", raman: "390 (100%)", iq: "— (faol emas)", rule: "Sof Raman — markaziy nosimmetrik", category: "metal" },
    { vibration: "ν(Fe−C) E_g", raman: "416 (28%)", iq: "— (qat'iy taqiqlangan)", rule: "Sof Raman — gerade tip", category: "metal" },
    { vibration: "δ(Fe−C≡N) F₂g", raman: "480 (15%)", iq: "— (faol emas)", rule: "Raman faol, IQ kuzatilmaydi", category: "deformation" },
    { vibration: "ν(Fe−C) F₁u", raman: "510 (22%, kristall)", iq: "585 (juda kuchli)", rule: "Asosan IQ — F₁u ungerade", category: "metal" },
    { vibration: "δ(Fe−C≡N) F₁u", raman: "— (faol emas)", iq: "415 (o'rtacha)", rule: "Sof IQ — ungerade", category: "deformation" },
    { vibration: "ν(C≡N) A₁g", raman: "2130 (75%)", iq: "— (faol emas)", rule: "Sof Raman — symmetric stretch", category: "cn" },
    { vibration: "ν(C≡N) E_g", raman: "2135 (20%)", iq: "— (faol emas)", rule: "Sof Raman — gerade", category: "cn" },
    { vibration: "ν(C≡N) F₁u", raman: "— (juda kuchsiz)", iq: "2118 (juda kuchli)", rule: "Diagnostik IQ piki — ungerade", category: "cn" },
  ],
  
  // Guruh nazariyasi
  groupTheory: {
    title: "Oktaedrik [Fe(CN)₆]³⁻ uchun guruh nazariyasi tahlili",
    pointGroup: "O_h",
    totalModes: "Γ_total = A₁g + E_g + 2T₁g + T₂g + 3T₁u + T₂u + 2A₂u",
    ramanActive: "Γ_Raman = A₁g + E_g + T₂g (4 ta Raman faol mod)",
    irActive: "Γ_IR = 3T₁u (3 ta IQ faol mod)",
    silent: "Γ_silent = 2T₁g + T₂u + 2A₂u (5 ta jim mod)",
    n_atoms: 13,
    formula: "3N − 6 = 33 ichki tebranish darajasi",
    explanation: "[Fe(CN)₆]³⁻ — 13 ta atom (1 Fe + 6 C + 6 N) → 3×13 − 6 = 33 erkinlik darajasi. Oh simmetriya tufayli ko'pi degenerativ. Faqat g-tipli (gerade) modlar Raman-da, u-tipli (ungerade) modlar IQ-da faol. Bu o'zaro istisno qoidasi — i (inversion) simmetriya elementi mavjudligining bevosita natijasi.",
  },
  
  // Korrelyatsion diagramma — Oh → C_2h kristall maydoni
  correlation: {
    title: "Korrelyatsion analiz: Oh → C_2h (kristall maydon)",
    splits: [
      { mode: "A₁g (390, 2130)", oh: "A₁g", c2h: "A_g", splitting: "Yopiq — bir komponent", consequence: "Pikning yo'nalishi o'zgarmaydi" },
      { mode: "E_g (416, 2135)", oh: "E_g", c2h: "A_g + B_g", splitting: "ΔE ≈ 4-7 sm⁻¹", consequence: "E_g pik 2 ga bo'linadi — yuqori ruxsatda kuzatiladi" },
      { mode: "T₂g (~364, 480)", oh: "T₂g", c2h: "A_g + 2B_g", splitting: "ΔE ≈ 8-12 sm⁻¹", consequence: "Uchli degenerativ pik 3 komponentga bo'linadi" },
      { mode: "T₁u (585, 2118)", oh: "T₁u", c2h: "A_u + 2B_u", splitting: "IQ-da kuzatiladi", consequence: "F₁u IQ pik — kristallda 2-3 komponentga bo'linadi" },
    ],
  },
  
  // Fe(III) vs Fe(II) taqqoslash
  oxidationStateEffect: {
    title: "Fe(III) vs Fe(II) — π-back-donation effekti",
    fe3: { 
      compound: "K₃[Fe(CN)₆]",
      vFeC: 390, vCN: 2130, kFeC: 2.21, kCN: 17.4,
      effRadius: "0.55 Å (LS)",
      backDonation: "Kuchsiz (d⁵ → π* CN)",
    },
    fe2: { 
      compound: "K₄[Fe(CN)₆]",
      vFeC: 380, vCN: 2098, kFeC: 2.05, kCN: 16.8,
      effRadius: "0.61 Å (LS)",
      backDonation: "Kuchli (d⁶ → π* CN)",
    },
    explanation: "Fe(II) da d⁶ konfiguratsiya t_2g orbitallari to'liq to'lgan → π-back-donation kuchli → CN ning π* orbitaliga elektron zichligi ko'p o'tadi → C≡N bog'i kuchsizlanadi → ν(C≡N) past chastotada (2098 sm⁻¹). Fe(III) da d⁵ — t_2g qisman bo'sh → π-back-donation kuchsiz → C≡N mustahkamroq (2130 sm⁻¹). Bu Δν ≈ 32 sm⁻¹ — Fe oksidlanish darajasini Raman bilan aniqlashning eng aniq usuli.",
  },
}

// ============================================================================
// RAMAN SPEKTR KOMPONENTI — Kengaytirilgan, zoom + lazer + filter
// ============================================================================
function RamanSpektrGrafik({ lineColor = "#38bdf8" }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [hoveredPeak, setHoveredPeak] = useState(null)
  const [selectedPeak, setSelectedPeak] = useState(null)
  const [canvasSize, setCanvasSize] = useState({ w: 820, h: 380 })
  const [animProgress, setAnimProgress] = useState(0)
  const [laser, setLaser] = useState(1064)
  const [symmetryFilter, setSymmetryFilter] = useState("all")
  const [zoomRegion, setZoomRegion] = useState("full")
  const [showFit, setShowFit] = useState(true)
  const animRef = useRef(null)
  const startTimeRef = useRef(null)

  const allPeaks = RAMAN_DATA.peaks

  // Filtrlash logikasi
  const peaks = useMemo(() => {
    let filtered = allPeaks
    if (symmetryFilter !== "all") {
      filtered = filtered.filter(p => {
        if (symmetryFilter === "a1g") return p.symmetry.includes("A₁g")
        if (symmetryFilter === "eg") return p.symmetry.includes("E_g")
        if (symmetryFilter === "lattice") return p.category === "lattice"
        return true
      })
    }
    return filtered
  }, [symmetryFilter])

  // Zoom diapazonlari
  const ranges = {
    full: { min: 50, max: 2250 },
    low: { min: 50, max: 600 },
    mid: { min: 350, max: 550 },
    cn: { min: 2050, max: 2200 },
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
  }, [zoomRegion, symmetryFilter, laser])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const W = canvas.width, H = canvas.height
    const PAD = { l: 70, r: 30, t: 30, b: 60 }
    const plotW = W - PAD.l - PAD.r, plotH = H - PAD.t - PAD.b
    const xTo = (v) => PAD.l + ((v - wnMin) / (wnMax - wnMin)) * plotW
    const yTo = (v) => PAD.t + ((105 - v) / 105) * plotH

    // Background
    const bg = ctx.createLinearGradient(0, 0, 0, H)
    bg.addColorStop(0, "#0a0716")
    bg.addColorStop(1, "#1a0f2e")
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, W, H)

    // Grid
    ctx.strokeStyle = "#2a1f3d"
    ctx.lineWidth = 0.5
    const step = (wnMax - wnMin) > 1000 ? 200 : (wnMax - wnMin) > 300 ? 50 : 25
    for (let w = Math.ceil(wnMin / step) * step; w <= wnMax; w += step) {
      ctx.beginPath()
      ctx.moveTo(xTo(w), PAD.t)
      ctx.lineTo(xTo(w), PAD.t + plotH)
      ctx.stroke()
    }
    ;[20, 40, 60, 80, 100].forEach(v => {
      ctx.beginPath()
      ctx.moveTo(PAD.l, yTo(v))
      ctx.lineTo(PAD.l + plotW, yTo(v))
      ctx.stroke()
    })
    ctx.strokeStyle = "#3d2a5c"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(PAD.l, yTo(0))
    ctx.lineTo(PAD.l + plotW, yTo(0))
    ctx.stroke()

    // Lazer chastotaga moslashtirilgan intensivlik koeffitsienti
    // I_Raman ∝ (ν_0 - ν)^4 / λ_laser^4 nisbati
    const laserScale = laser === 1064 ? 1.0 : laser === 633 ? 2.85 : laser === 514 ? 5.4 : 8.2

    const visiblePeaks = peaks.filter(p => 
      p.wavenumber >= wnMin && p.wavenumber <= wnMax &&
      p.wavenumber <= wnMin + (wnMax - wnMin) * animProgress
    )

    // Baseline noise
    ctx.strokeStyle = lineColor + "30"
    ctx.lineWidth = 1
    ctx.beginPath()
    for (let x = PAD.l; x < PAD.l + plotW; x += 2) {
      const wn = wnMin + ((x - PAD.l) / plotW) * (wnMax - wnMin)
      let total = 0
      visiblePeaks.forEach(p => {
        const gamma = p.fwhm / 2
        total += (p.intensity * laserScale * gamma * gamma) / 
                 (Math.pow(wn - p.wavenumber, 2) + gamma * gamma)
      })
      total = Math.min(total, 100)
      total += (Math.random() - 0.5) * 1.5 // shovqin
      if (x === PAD.l) ctx.moveTo(x, yTo(Math.max(0, total)))
      else ctx.lineTo(x, yTo(Math.max(0, total)))
    }
    ctx.stroke()

    // Asosiy spektr — Lorentzian sum
    if (showFit) {
      ctx.strokeStyle = lineColor
      ctx.lineWidth = 2
      ctx.beginPath()
      for (let x = PAD.l; x <= PAD.l + plotW; x += 1) {
        const wn = wnMin + ((x - PAD.l) / plotW) * (wnMax - wnMin)
        let total = 0
        visiblePeaks.forEach(p => {
          const gamma = p.fwhm / 2
          total += (p.intensity * laserScale * gamma * gamma) / 
                   (Math.pow(wn - p.wavenumber, 2) + gamma * gamma)
        })
        total = Math.min(total, 102)
        if (x === PAD.l) ctx.moveTo(x, yTo(Math.max(0, total)))
        else ctx.lineTo(x, yTo(Math.max(0, total)))
      }
      ctx.stroke()

      // To'ldirish
      ctx.lineTo(PAD.l + plotW, yTo(0))
      ctx.lineTo(PAD.l, yTo(0))
      ctx.closePath()
      const fillGrad = ctx.createLinearGradient(0, PAD.t, 0, PAD.t + plotH)
      fillGrad.addColorStop(0, lineColor + "30")
      fillGrad.addColorStop(1, lineColor + "05")
      ctx.fillStyle = fillGrad
      ctx.fill()
    }

    // Pik markerlari
    visiblePeaks.forEach(p => {
      const x = xTo(p.wavenumber)
      const adjIntensity = Math.min(p.intensity * laserScale, 100)
      const y = yTo(adjIntensity)
      const isH = hoveredPeak?.wavenumber === p.wavenumber
      const isS = selectedPeak?.wavenumber === p.wavenumber

      // Kategoriya rang
      const catColor = {
        "lattice": "#a78bfa",
        "metal-ligand": "#38bdf8",
        "deformation": "#fbbf24",
        "cn-stretch": "#34d399",
        "combination": "#f87171",
      }[p.category] || lineColor

      ctx.beginPath()
      ctx.arc(x, y, (isH || isS) ? 7 : 4, 0, Math.PI * 2)
      ctx.fillStyle = catColor
      ctx.fill()

      if (isS) {
        ctx.beginPath()
        ctx.arc(x, y, 14, 0, Math.PI * 2)
        ctx.fillStyle = catColor + "25"
        ctx.fill()
      }

      // Label
      ctx.fillStyle = catColor
      ctx.font = "bold 10px monospace"
      ctx.textAlign = "center"
      ctx.fillText(`${p.wavenumber}`, x, y - 12)

      if (isH || isS) {
        ctx.fillStyle = "#fff"
        ctx.font = "bold 11px monospace"
        ctx.fillText(`${p.wavenumber} sm⁻¹`, x, y - 26)
        ctx.font = "9px monospace"
        ctx.fillText(p.symmetry, x, y - 38)
      }
    })

    // Hover tooltip
    if (hoveredPeak && !selectedPeak) {
      const p = hoveredPeak
      const x = xTo(p.wavenumber)
      const y = yTo(Math.min(p.intensity * laserScale, 100))
      const tx = Math.min(Math.max(x - 110, PAD.l + 5), PAD.l + plotW - 225)
      ctx.fillStyle = "#0f0a1a"
      ctx.strokeStyle = lineColor
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.roundRect(tx, y - 110, 220, 85, 8)
      ctx.fill()
      ctx.stroke()
      ctx.fillStyle = "#fff"
      ctx.font = "bold 10px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(`${p.wavenumber} sm⁻¹  (${p.symmetry})`, tx + 8, y - 92)
      ctx.fillStyle = lineColor
      ctx.font = "9px sans-serif"
      const words = p.assignment.split(' ')
      let line = '', yOff = y - 78
      words.forEach(word => {
        if ((line + word).length > 30) {
          ctx.fillText(line, tx + 8, yOff)
          line = word + ' '
          yOff += 11
        } else line += word + ' '
      })
      ctx.fillText(line, tx + 8, yOff)
      ctx.fillStyle = "#fbbf24"
      ctx.font = "9px monospace"
      ctx.fillText(`FWHM: ${p.fwhm} sm⁻¹  |  ρ: ${p.polarization.match(/[\d.]+/)?.[0] || 'N/A'}`, tx + 8, y - 36)
    }

    // O'qlar
    ctx.strokeStyle = "#3d2a5c"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(PAD.l, PAD.t)
    ctx.lineTo(PAD.l, PAD.t + plotH)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(PAD.l, PAD.t + plotH)
    ctx.lineTo(PAD.l + plotW, PAD.t + plotH)
    ctx.stroke()

    // X o'q labellar
    ctx.fillStyle = "#7c6a9e"
    ctx.font = "10px sans-serif"
    ctx.textAlign = "center"
    for (let w = Math.ceil(wnMin / step) * step; w <= wnMax; w += step) {
      ctx.fillText(w, xTo(w), PAD.t + plotH + 16)
    }
    ctx.font = "11px sans-serif"
    ctx.fillStyle = "#a78bfa"
    ctx.fillText("Raman siljishi (sm⁻¹)", PAD.l + plotW / 2, H - 8)

    // Y o'q
    ctx.textAlign = "right"
    ctx.font = "10px sans-serif"
    ctx.fillStyle = "#7c6a9e"
    ;[20, 40, 60, 80, 100].forEach(v => ctx.fillText(v, PAD.l - 8, yTo(v) + 4))
    ctx.save()
    ctx.translate(20, PAD.t + plotH / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.textAlign = "center"
    ctx.fillStyle = "#a78bfa"
    ctx.font = "11px sans-serif"
    ctx.fillText("Intensivlik (norm. %)", 0, 0)
    ctx.restore()

    // Lazer indikator
    ctx.fillStyle = "#fbbf24"
    ctx.font = "bold 10px monospace"
    ctx.textAlign = "right"
    ctx.fillText(`λ = ${laser} nm  (×${laserScale.toFixed(2)})`, PAD.l + plotW - 8, PAD.t + 14)
  }, [peaks, animProgress, hoveredPeak, selectedPeak, lineColor, canvasSize, wnMin, wnMax, laser, showFit])

  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvasSize.w / rect.width
    const mx = (e.clientX - rect.left) * scaleX
    const PAD = { l: 70, r: 30 }
    const plotW = canvasSize.w - PAD.l - PAD.r
    const wn = wnMin + ((mx - PAD.l) / plotW) * (wnMax - wnMin)
    let closest = null, minDist = (wnMax - wnMin) / 50
    peaks.forEach(p => {
      const dist = Math.abs(p.wavenumber - wn)
      if (dist < minDist) { minDist = dist; closest = p }
    })
    setHoveredPeak(closest)
  }, [peaks, canvasSize, wnMin, wnMax])

  return (
    <div ref={containerRef} className="relative">
      {/* Boshqaruv paneli */}
      <div className="bg-purple-900/50 border border-purple-700/50 rounded-xl p-3 mb-3 flex flex-wrap gap-3 items-center text-xs">
        <div className="flex items-center gap-2">
          <span className="text-purple-400">Lazer:</span>
          {[1064, 633, 514, 488].map(l => (
            <button key={l} onClick={() => setLaser(l)}
              className={`px-2 py-1 rounded-lg font-mono ${laser === l ? "bg-yellow-500/30 text-yellow-300 border border-yellow-500/50" : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/40"}`}>
              {l}nm
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-purple-400">Zoom:</span>
          {[["full", "To'liq"], ["low", "Past <600"], ["mid", "Fe−C"], ["cn", "C≡N"]].map(([k, v]) => (
            <button key={k} onClick={() => setZoomRegion(k)}
              className={`px-2 py-1 rounded-lg ${zoomRegion === k ? "bg-sky-500/30 text-sky-300 border border-sky-500/50" : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/40"}`}>
              {v}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-purple-400">Filtr:</span>
          {[["all", "Barchasi"], ["a1g", "A₁g"], ["eg", "E_g"], ["lattice", "Lattice"]].map(([k, v]) => (
            <button key={k} onClick={() => setSymmetryFilter(k)}
              className={`px-2 py-1 rounded-lg ${symmetryFilter === k ? "bg-green-500/30 text-green-300 border border-green-500/50" : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/40"}`}>
              {v}
            </button>
          ))}
        </div>
        <button onClick={() => setShowFit(!showFit)}
          className={`px-2 py-1 rounded-lg ml-auto ${showFit ? "bg-pink-500/30 text-pink-300 border border-pink-500/50" : "bg-purple-800/40 text-purple-300"}`}>
          {showFit ? "✓" : "○"} Lorentzian fit
        </button>
      </div>

      <canvas ref={canvasRef} width={canvasSize.w} height={canvasSize.h}
        onMouseMove={handleMouseMove}
        onClick={() => { if (hoveredPeak) setSelectedPeak(selectedPeak?.wavenumber === hoveredPeak.wavenumber ? null : hoveredPeak) }}
        onMouseLeave={() => setHoveredPeak(null)}
        className="w-full h-auto rounded-xl border border-purple-700/50 cursor-crosshair" />

      {/* Rang legendasi */}
      <div className="mt-3 flex flex-wrap gap-3 text-xs">
        {[
          { c: "#a78bfa", l: "Lattice" },
          { c: "#38bdf8", l: "Fe−C (metal-ligand)" },
          { c: "#fbbf24", l: "Deformatsiya δ" },
          { c: "#34d399", l: "C≡N stretch" },
          { c: "#f87171", l: "Kombinatsion" },
        ].map((it, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ background: it.c }} />
            <span className="text-purple-300">{it.l}</span>
          </div>
        ))}
      </div>

      {selectedPeak && (
        <div className="mt-3 bg-purple-800/30 border rounded-xl p-4" style={{ borderColor: lineColor + "40" }}>
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <span className="w-3 h-3 rounded-full" style={{ background: lineColor }} />
            <span className="font-mono font-bold text-lg" style={{ color: lineColor }}>{selectedPeak.wavenumber} sm⁻¹</span>
            <span className="bg-purple-700/50 text-purple-200 rounded-full px-2 py-0.5 text-xs">{selectedPeak.symmetry}</span>
            <span className="bg-yellow-500/20 text-yellow-300 rounded-full px-2 py-0.5 text-xs">FWHM: {selectedPeak.fwhm} sm⁻¹</span>
          </div>
          <p className="text-white text-sm mb-1"><strong>Tebranish:</strong> {selectedPeak.assignment}</p>
          <p className="text-purple-300 text-xs mb-1"><strong>Qutblanish:</strong> {selectedPeak.polarization}</p>
          {selectedPeak.forceConstant && (
            <p className="text-green-300 text-xs mb-1"><strong>Kuch konstantasi:</strong> {selectedPeak.forceConstant}</p>
          )}
          <p className="text-purple-400 text-xs mt-2 italic">{selectedPeak.comment}</p>
          <button onClick={() => setSelectedPeak(null)} className="mt-2 text-xs text-purple-400 hover:text-white">✕ Yopish</button>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// HERO SECTION
// ============================================================================
function HeroSection() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-950 via-blue-900 to-blue-950 border border-sky-700/50 p-8 md:p-12 mb-10">
      <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl" />
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
            <span className="bg-sky-600/20 text-sky-300 border border-sky-600/30 rounded-full px-3 py-1 text-xs font-semibold">{RAMAN_DATA.tarixiy}</span>
            <span className="bg-blue-600/20 text-blue-300 border border-blue-600/30 rounded-full px-3 py-1 text-xs">{RAMAN_DATA.iupac}</span>
            <span className="bg-purple-600/20 text-purple-300 border border-purple-600/30 rounded-full px-3 py-1 text-xs">d⁵ LS — paramagnit</span>
            <span className="bg-green-600/20 text-green-300 border border-green-600/30 rounded-full px-3 py-1 text-xs">O_h simmetriya</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            ["Eng kuchli pik", "390 sm⁻¹", "ν(Fe−C) A₁g"],
            ["ν(C≡N) A₁g", "2130 sm⁻¹", "Simmetrik"],
            ["k(Fe−C)", "2.21 mdyn/Å", "Bog' kuchi"],
            ["μ_eff", "2.25 μ_B", "LS d⁵"],
          ].map(([l, v, s], i) => (
            <div key={i} className="bg-purple-800/30 border border-purple-700/30 rounded-xl p-3 text-center">
              <p className="text-purple-400 text-xs mb-1">{l}</p>
              <p className="text-white font-bold text-base">{v}</p>
              <p className="text-purple-500 text-xs mt-0.5">{s}</p>
            </div>
          ))}
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
          <p className="text-yellow-300 text-sm">
            <strong>Diagnostik xulosa:</strong> ν(Fe−C) = <span className="font-mono text-lg font-bold">390 sm⁻¹</span> (A₁g) va 
            ν(C≡N) = <span className="font-mono text-lg font-bold">2130 sm⁻¹</span> (A₁g) — 
            bu ikkala pik birgalikda <strong>K₄[Fe(CN)₆]</strong> (Fe(II)) dan <strong>Δν(CN) = 32 sm⁻¹</strong> bilan ajraladi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// TABS
// ============================================================================
const TABS = [
  { id: "spectrum", label: "Raman spektri", icon: "📊" },
  { id: "group-theory", label: "Guruh nazariyasi", icon: "🔣" },
  { id: "iq-comparison", label: "Raman vs IQ", icon: "⚖️" },
  { id: "correlation", label: "Korrelyatsion", icon: "🔗" },
  { id: "oxidation", label: "Fe(III) vs Fe(II)", icon: "🔄" },
  { id: "polarization", label: "Qutblanish", icon: "↗️" },
  { id: "peaks-table", label: "Piklar jadvali", icon: "📋" },
]

// ============================================================================
// QUTBLANISH NISBATI GRAFIGI
// ============================================================================
function PolarizationChart() {
  const peaks = RAMAN_DATA.peaks.filter(p => p.polarization.match(/[\d.]+/))
  const data = peaks.map(p => ({
    wn: p.wavenumber,
    rho: parseFloat(p.polarization.match(/[\d.]+/)[0]),
    sym: p.symmetry,
    color: p.symmetry.includes("A₁g") ? "#38bdf8" : "#fbbf24",
  }))

  return (
    <div className="bg-purple-800/30 rounded-xl p-5">
      <h3 className="text-white font-semibold mb-1">Qutblanish nisbati (ρ) — Raman tanlash qoidasi</h3>
      <p className="text-purple-400 text-xs mb-4">
        ρ = I_⊥ / I_∥. Qutblangan piklar (ρ &lt; 0.75) — totally symmetric (A₁g). Depolyarizatsiyalangan piklar (ρ ≈ 0.75) — degenerativ yoki nosymmetric.
      </p>
      <div className="relative h-44">
        <div className="absolute left-0 top-0 bottom-6 w-full">
          {/* Y axis grid */}
          {[0, 0.25, 0.5, 0.75].map(v => (
            <div key={v} className="absolute w-full border-t border-purple-700/30 flex items-center"
                 style={{ bottom: `${(v / 0.85) * 100}%` }}>
              <span className="text-purple-400 text-xs -ml-1 -mt-2 absolute">{v.toFixed(2)}</span>
            </div>
          ))}
          {/* Threshold line */}
          <div className="absolute w-full border-t-2 border-dashed border-red-500/50 flex items-center"
               style={{ bottom: `${(0.75 / 0.85) * 100}%` }}>
            <span className="text-red-400 text-xs ml-12 -mt-3 bg-purple-950/80 px-1">ρ = 0.75 (depolyarizatsiya chegarasi)</span>
          </div>
          {/* Bars */}
          <div className="absolute inset-0 flex items-end justify-around pl-8">
            {data.map((d, i) => (
              <div key={i} className="flex flex-col items-center" style={{ width: `${80 / data.length}%` }}>
                <div className="text-xs font-mono mb-1" style={{ color: d.color }}>{d.rho.toFixed(2)}</div>
                <div className="w-full rounded-t-md transition-all hover:opacity-80" 
                     style={{ height: `${(d.rho / 0.85) * 100}%`, background: d.color, minHeight: "4px" }} />
                <div className="text-purple-300 text-xs mt-1 font-mono">{d.wn}</div>
                <div className="text-purple-500 text-xs">{d.sym}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function K3FeCN6RamanPage() {
  const [activeTab, setActiveTab] = useState("spectrum")

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 px-6 py-4 mb-6 border-b border-purple-800/50">
          <Link href="/ilmiy/tahlil/raman/birikmalar" className="hover:bg-purple-800/50 p-2 rounded-xl transition-all border border-purple-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-white">K₃[Fe(CN)₆] — Raman spektroskopik chuqur tahlil</h1>
        </div>

        <HeroSection />

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 bg-purple-900/40 border border-purple-700/50 rounded-2xl p-1.5 mb-6">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id ? "bg-sky-600/40 text-white border border-sky-400/50" : "text-purple-400 hover:text-white hover:bg-purple-800/30"}`}>
              <span className="mr-1.5">{tab.icon}</span>{tab.label}
            </button>
          ))}
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          {/* SPEKTR TAB */}
          {activeTab === "spectrum" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-sky-400">Interaktiv Raman spektri</h2>
              <p className="text-purple-300 text-sm">
                Lazer to'lqin uzunligini, zoom diapazonini va simmetriya filtrini o'zgartiring. 
                Spektr Lorentzian fit asosida real vaqtda hisoblanadi: I(ν) = Σᵢ Aᵢ · γᵢ² / [(ν−νᵢ)² + γᵢ²], 
                bu yerda Aᵢ — intensivlik, γᵢ = FWHM/2 — yarim kenglik.
              </p>
              <RamanSpektrGrafik />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-sky-600/10 border border-sky-500/30 rounded-xl p-4">
                  <h3 className="text-sky-300 font-semibold mb-2">🔬 Past chastotali soha (50−600 sm⁻¹)</h3>
                  <p className="text-purple-200 text-xs">
                    Panjara modlari (T_g, R_g ~88-128 sm⁻¹) va Fe−C tebranishlar (A₁g 390, E_g 416, F₂g 480 sm⁻¹). 
                    ν(Fe−C) A₁g — eng kuchli pik (100%), oktaedrik "nafas olish" modi.
                  </p>
                </div>
                <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-4">
                  <h3 className="text-green-300 font-semibold mb-2">🔬 C≡N sohasi (2050−2200 sm⁻¹)</h3>
                  <p className="text-purple-200 text-xs">
                    ν(C≡N) A₁g (2130 sm⁻¹) — diagnostik pik. E_g komponenti (2135 sm⁻¹) yuqori ruxsatda ajraladi. 
                    Anharmonik kombinatsiya yon-piklari (2160 sm⁻¹) past intensivlikda kuzatiladi.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* GUMRUH NAZARIYASI TAB */}
          {activeTab === "group-theory" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-sky-400">{RAMAN_DATA.groupTheory.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-purple-800/30 rounded-xl p-5">
                  <h3 className="text-yellow-300 font-semibold mb-3">⚛️ Erkinlik darajalari hisobi</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-purple-300">Atomlar soni (N):</span><span className="text-white font-mono">{RAMAN_DATA.groupTheory.n_atoms}</span></div>
                    <div className="flex justify-between"><span className="text-purple-300">Umumiy 3N:</span><span className="text-white font-mono">39</span></div>
                    <div className="flex justify-between"><span className="text-purple-300">Translatsiya (T):</span><span className="text-white font-mono">3</span></div>
                    <div className="flex justify-between"><span className="text-purple-300">Rotatsiya (R):</span><span className="text-white font-mono">3</span></div>
                    <div className="border-t border-purple-700/50 pt-2 flex justify-between font-bold"><span className="text-sky-300">Tebranish (3N−6):</span><span className="text-sky-300 font-mono">33</span></div>
                  </div>
                </div>
                <div className="bg-purple-800/30 rounded-xl p-5">
                  <h3 className="text-yellow-300 font-semibold mb-3">📐 Simmetriya tahlili (O_h)</h3>
                  <p className="text-xs text-purple-300 mb-2 font-mono">{RAMAN_DATA.groupTheory.totalModes}</p>
                  <div className="space-y-2 text-xs mt-3">
                    <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-2">
                      <p className="text-green-300 font-semibold">🟢 Raman faol (4 mod):</p>
                      <p className="text-purple-200 font-mono mt-1">{RAMAN_DATA.groupTheory.ramanActive}</p>
                    </div>
                    <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-2">
                      <p className="text-blue-300 font-semibold">🔵 IQ faol (3 mod):</p>
                      <p className="text-purple-200 font-mono mt-1">{RAMAN_DATA.groupTheory.irActive}</p>
                    </div>
                    <div className="bg-gray-600/20 border border-gray-500/30 rounded-lg p-2">
                      <p className="text-gray-300 font-semibold">⚫ Jim modlar (5 mod):</p>
                      <p className="text-purple-200 font-mono mt-1">{RAMAN_DATA.groupTheory.silent}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-sky-600/10 border border-sky-500/30 rounded-xl p-5">
                <h3 className="text-sky-300 font-semibold mb-2">📚 Tushuntirish</h3>
                <p className="text-purple-200 text-sm leading-relaxed">{RAMAN_DATA.groupTheory.explanation}</p>
              </div>

              {/* Selection Rule Tensor Visualizatsiyasi */}
              <div className="bg-purple-800/30 rounded-xl p-5">
                <h3 className="text-yellow-300 font-semibold mb-3">🎯 Tanlash qoidasi: qutblanish tenzori</h3>
                <p className="text-purple-300 text-xs mb-3">
                  Raman intensivligi qutblanish tenzori α'ᵢⱼ ning siljishi orqali aniqlanadi: 
                  <span className="font-mono ml-1">I ∝ |Σ αᵢⱼ|²</span>. 
                  A₁g — diagonal komponentlar (αxx + αyy + αzz), E_g — quadrupol komponentlar.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  {[
                    { sym: "A₁g", tensor: "[xx+yy+zz]", color: "#38bdf8", active: true, desc: "Sferik" },
                    { sym: "E_g", tensor: "[xx−yy, 2zz−xx−yy]", color: "#fbbf24", active: true, desc: "Quadrupol" },
                    { sym: "T₂g", tensor: "[xy, xz, yz]", color: "#34d399", active: true, desc: "Off-diagonal" },
                    { sym: "T₁u", tensor: "[x, y, z]", color: "#f87171", active: false, desc: "Dipol — IQ" },
                  ].map((it, i) => (
                    <div key={i} className="bg-purple-900/50 border rounded-lg p-3" style={{ borderColor: it.color + "40" }}>
                      <div className="font-bold mb-1" style={{ color: it.color }}>{it.sym}</div>
                      <div className="font-mono text-xs text-white">{it.tensor}</div>
                      <div className="text-purple-400 text-xs mt-1">{it.desc}</div>
                      <div className={`text-xs mt-1 font-semibold ${it.active ? "text-green-400" : "text-red-400"}`}>
                        {it.active ? "✓ Raman faol" : "✗ Raman nofaol"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* RAMAN vs IQ TAB */}
          {activeTab === "iq-comparison" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-sky-400">Raman ↔ IQ — o'zaro istisno qoidasi</h2>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                <p className="text-yellow-300 text-sm">
                  <strong>🚫 Rule of Mutual Exclusion:</strong> Inversion markazga (i) ega molekulalarda hech qanday tebranish Raman va IQ da bir vaqtda faol bo'la olmaydi. 
                  [Fe(CN)₆]³⁻ — O_h simmetriya, inversion markazga ega → qoida qat'iy bajariladi.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-purple-700/50">
                    <th className="text-left py-3 px-3 text-purple-400">Tebranish</th>
                    <th className="text-left py-3 px-3 text-sky-400">Raman (sm⁻¹)</th>
                    <th className="text-left py-3 px-3 text-blue-400">IQ (sm⁻¹)</th>
                    <th className="text-left py-3 px-3 text-purple-400">Tanlash qoidasi</th>
                  </tr></thead>
                  <tbody>{RAMAN_DATA.iqComparison.map((r, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-3 px-3 text-yellow-400 font-mono text-xs">{r.vibration}</td>
                      <td className="py-3 px-3 text-sky-300 text-xs">{r.raman}</td>
                      <td className="py-3 px-3 text-blue-300 text-xs">{r.iq}</td>
                      <td className="py-3 px-3 text-purple-300 text-xs">{r.rule}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-4">
                  <h3 className="text-green-400 font-semibold text-sm mb-2">🟢 Raman faol (g ↔ g, parallel)</h3>
                  <ul className="text-purple-200 text-xs space-y-1">
                    <li>• A₁g (390, 2130 sm⁻¹) — totally symmetric</li>
                    <li>• E_g (416, 2135 sm⁻¹) — doubly degenerate</li>
                    <li>• T₂g (~480 sm⁻¹) — triply degenerate</li>
                  </ul>
                  <p className="text-green-300 text-xs mt-2 italic">Qutblanish tenzori α'ᵢⱼ ning siljishi → Raman</p>
                </div>
                <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-4">
                  <h3 className="text-blue-400 font-semibold text-sm mb-2">🔵 IQ faol (g ↔ u, perpendikulyar)</h3>
                  <ul className="text-purple-200 text-xs space-y-1">
                    <li>• T₁u(ν6) ν(C≡N) — 2118 sm⁻¹</li>
                    <li>• T₁u(ν7) ν(Fe−C) — 585 sm⁻¹</li>
                    <li>• T₁u(ν8) δ(Fe−CN) — 415 sm⁻¹</li>
                  </ul>
                  <p className="text-blue-300 text-xs mt-2 italic">Dipol moment μ ning siljishi → IQ</p>
                </div>
              </div>
            </div>
          )}

          {/* KORRELYATSIYA TAB */}
          {activeTab === "correlation" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-sky-400">{RAMAN_DATA.correlation.title}</h2>
              <p className="text-purple-300 text-sm">
                Kristall holatda [Fe(CN)₆]³⁻ ioni O_h simmetriyasini yo'qotadi va kristall maydon C_2h ga buzilishi tufayli 
                degenerativ modlar ajraladi (factor group splitting).
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-purple-700/50">
                    <th className="text-left py-3 px-3 text-purple-400">Asl mod</th>
                    <th className="text-center py-3 px-3 text-yellow-400">O_h</th>
                    <th className="text-center py-3 px-3 text-sky-400">→</th>
                    <th className="text-center py-3 px-3 text-yellow-400">C_2h</th>
                    <th className="text-left py-3 px-3 text-purple-400">Bo'linish</th>
                    <th className="text-left py-3 px-3 text-purple-400">Oqibat</th>
                  </tr></thead>
                  <tbody>{RAMAN_DATA.correlation.splits.map((r, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-3 px-3 text-yellow-300 font-mono text-xs">{r.mode}</td>
                      <td className="py-3 px-3 text-center text-sky-300 font-mono">{r.oh}</td>
                      <td className="py-3 px-3 text-center text-purple-500">→</td>
                      <td className="py-3 px-3 text-center text-green-300 font-mono">{r.c2h}</td>
                      <td className="py-3 px-3 text-purple-200 text-xs">{r.splitting}</td>
                      <td className="py-3 px-3 text-purple-300 text-xs">{r.consequence}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
              <div className="bg-purple-800/30 rounded-xl p-5">
                <h3 className="text-yellow-300 font-semibold mb-2">💡 Eksperimental natija</h3>
                <p className="text-purple-200 text-sm">
                  Kuchaytirilgan ruxsatda (≤1 sm⁻¹) E_g pik 2 komponentga (A_g + B_g), 
                  T₂g pik esa 3 komponentga (A_g + 2B_g) bo'linadi. Bu factor group splitting 
                  kristall maydon kuchini va anion oriyentatsiyasini aniqlashda ishlatiladi. 
                  Past haroratlarda (4 K) bu bo'linish yanada aniqroq kuzatiladi.
                </p>
              </div>
            </div>
          )}

          {/* OKSIDLANISH DARAJASI TAB */}
          {activeTab === "oxidation" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-sky-400">{RAMAN_DATA.oxidationStateEffect.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { data: RAMAN_DATA.oxidationStateEffect.fe3, color: "red", title: "Fe(III) — K₃[Fe(CN)₆]", config: "d⁵ LS (t₂g⁵)" },
                  { data: RAMAN_DATA.oxidationStateEffect.fe2, color: "green", title: "Fe(II) — K₄[Fe(CN)₆]", config: "d⁶ LS (t₂g⁶)" },
                ].map((it, i) => (
                  <div key={i} className={`bg-${it.color}-600/10 border border-${it.color}-500/30 rounded-xl p-5`}>
                    <h3 className={`text-${it.color}-400 font-semibold mb-3 flex items-center gap-2`}>
                      <span>{it.title}</span>
                      <span className="text-xs bg-purple-800/50 px-2 py-0.5 rounded-full">{it.config}</span>
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-purple-300">ν(Fe−C):</span><span className="text-white font-mono">{it.data.vFeC} sm⁻¹</span></div>
                      <div className="flex justify-between"><span className="text-purple-300">ν(C≡N):</span><span className="text-white font-mono">{it.data.vCN} sm⁻¹</span></div>
                      <div className="flex justify-between"><span className="text-purple-300">k(Fe−C):</span><span className="text-white font-mono">{it.data.kFeC} mdyn/Å</span></div>
                      <div className="flex justify-between"><span className="text-purple-300">k(C≡N):</span><span className="text-white font-mono">{it.data.kCN} mdyn/Å</span></div>
                      <div className="flex justify-between"><span className="text-purple-300">Fe ion radius:</span><span className="text-white font-mono">{it.data.effRadius}</span></div>
                      <div className="border-t border-purple-700/30 pt-2"><span className="text-purple-300">π-back-donation:</span><br/><span className="text-yellow-300 text-xs">{it.data.backDonation}</span></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Δν Vizualizatsiyasi */}
              <div className="bg-purple-800/30 rounded-xl p-5">
                <h3 className="text-yellow-300 font-semibold mb-3">📊 Diagnostik Δν taqqoslash</h3>
                <div className="space-y-3">
                  {[
                    { label: "ν(C≡N)", fe3: 2130, fe2: 2098, delta: 32, max: 2200, min: 2050 },
                    { label: "ν(Fe−C)", fe3: 390, fe2: 380, delta: 10, max: 410, min: 360 },
                  ].map((row, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-purple-300">{row.label}</span>
                        <span className="text-yellow-300 font-mono">Δν = {row.delta} sm⁻¹</span>
                      </div>
                      <div className="relative h-8 bg-purple-900/50 rounded-lg overflow-hidden">
                        <div className="absolute top-1/2 -translate-y-1/2 h-2 w-full bg-purple-700/30" />
                        <div className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-red-400 border-2 border-white shadow-lg"
                             style={{ left: `${((row.fe3 - row.min) / (row.max - row.min)) * 100}%`, transform: 'translate(-50%, -50%)' }} 
                             title={`Fe(III): ${row.fe3}`} />
                        <div className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-green-400 border-2 border-white shadow-lg"
                             style={{ left: `${((row.fe2 - row.min) / (row.max - row.min)) * 100}%`, transform: 'translate(-50%, -50%)' }}
                             title={`Fe(II): ${row.fe2}`} />
                        <div className="absolute bottom-0 left-1 text-xs text-purple-500 font-mono">{row.min}</div>
                        <div className="absolute bottom-0 right-1 text-xs text-purple-500 font-mono">{row.max}</div>
                      </div>
                      <div className="flex justify-between text-xs mt-1">
                        <span className="text-red-400">● Fe(III): {row.fe3}</span>
                        <span className="text-green-400">● Fe(II): {row.fe2}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-sky-600/10 border border-sky-500/30 rounded-xl p-5">
                <h3 className="text-sky-300 font-semibold mb-2">🔬 π-back-donation mexanizmi</h3>
                <p className="text-purple-200 text-sm leading-relaxed">{RAMAN_DATA.oxidationStateEffect.explanation}</p>
              </div>
            </div>
          )}

          {/* QUTBLANISH TAB */}
          {activeTab === "polarization" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-sky-400">Qutblanish nisbati (ρ) tahlili</h2>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                <p className="text-yellow-300 text-sm">
                  <strong>Aniqlash:</strong> Qutblanish nisbati ρ = I_⊥ / I_∥ — bu chiziqli qutblangan lazer nuri bilan o'lchanadi.
                  <br/>• <span className="text-sky-300">ρ &lt; 0.75</span> — qutblangan (polarized) — totally symmetric mod (A₁g)
                  <br/>• <span className="text-yellow-300">ρ = 0.75</span> — depolyarizatsiyalangan (depolarized) — degenerativ yoki nosymmetric mod (E_g, T₂g)
                </p>
              </div>
              <PolarizationChart />
              <div className="bg-purple-800/30 rounded-xl p-5">
                <h3 className="text-white font-semibold mb-2">📐 Matematik asos</h3>
                <p className="text-purple-200 text-sm">
                  Qutblanish nisbati invariantlar orqali aniqlanadi:
                </p>
                <div className="bg-purple-900/60 rounded-lg p-3 mt-2 font-mono text-sm text-sky-300">
                  ρ = 3γ² / (45α² + 4γ²)
                </div>
                <p className="text-purple-300 text-xs mt-2">
                  bu yerda α — izotrop qism (trace), γ — anizotrop qism. 
                  Totally symmetric modlar uchun α ≠ 0 va γ ≈ 0 → ρ → 0. 
                  Nosymmetric modlar uchun α = 0 → ρ = 3/4 = 0.75 (maksimal qiymat).
                </p>
              </div>
            </div>
          )}

          {/* PIKLAR JADVALI TAB */}
          {activeTab === "peaks-table" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-sky-400">To'liq piklar bazasi (9 mod)</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-purple-700/50">
                    <th className="text-left py-3 px-3 text-purple-400">ν (sm⁻¹)</th>
                    <th className="text-left py-3 px-3 text-purple-400">I (%)</th>
                    <th className="text-left py-3 px-3 text-purple-400">FWHM</th>
                    <th className="text-left py-3 px-3 text-purple-400">Simmetriya</th>
                    <th className="text-left py-3 px-3 text-purple-400">Kategoriya</th>
                    <th className="text-left py-3 px-3 text-purple-400">Tebranish turi</th>
                    <th className="text-left py-3 px-3 text-purple-400">Qutblanish</th>
                  </tr></thead>
                  <tbody>{RAMAN_DATA.peaks.map((p, i) => {
                    const catColor = {
                      "lattice": "text-purple-300",
                      "metal-ligand": "text-sky-300",
                      "deformation": "text-yellow-300",
                      "cn-stretch": "text-green-300",
                      "combination": "text-red-300",
                    }[p.category]
                    return (
                      <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                        <td className="py-3 px-3 font-mono text-sky-400 font-bold">{p.wavenumber}</td>
                        <td className="py-3 px-3 text-yellow-400">{p.intensity}%</td>
                        <td className="py-3 px-3 text-purple-300 font-mono text-xs">{p.fwhm}</td>
                        <td className="py-3 px-3 text-white font-mono text-xs">{p.symmetry}</td>
                        <td className={`py-3 px-3 text-xs font-semibold ${catColor}`}>{p.category}</td>
                        <td className="py-3 px-3 text-purple-200 text-xs">{p.assignment}</td>
                        <td className="py-3 px-3 text-purple-300 text-xs">{p.polarization}</td>
                      </tr>
                    )
                  })}</tbody>
                </table>
              </div>

              {/* Eksperimental parametrlar */}
              <div className="bg-purple-800/30 rounded-xl p-5 mt-4">
                <h3 className="text-yellow-300 font-semibold mb-3">⚙️ Eksperimental parametrlar</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between"><span className="text-purple-400">Lazer manbai:</span><span className="text-white text-xs">{RAMAN_DATA.lazer}</span></div>
                  <div className="flex justify-between"><span className="text-purple-400">Quvvat:</span><span className="text-white text-xs">{RAMAN_DATA.power}</span></div>
                  <div className="flex justify-between"><span className="text-purple-400">Spektral ruxsat:</span><span className="text-white text-xs">{RAMAN_DATA.resolution}</span></div>
                  <div className="flex justify-between"><span className="text-purple-400">Detektor:</span><span className="text-white text-xs">{RAMAN_DATA.detector}</span></div>
                  <div className="flex justify-between"><span className="text-purple-400">Diapazon:</span><span className="text-white text-xs">{RAMAN_DATA.spectralRange}</span></div>
                  <div className="flex justify-between"><span className="text-purple-400">Yig'ish vaqti:</span><span className="text-white text-xs">{RAMAN_DATA.acquisitionTime}</span></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pastki navigatsiya */}
        <div className="flex justify-between mt-8 pt-6 border-t border-purple-800/50">
          <Link href="/ilmiy/tahlil/raman/birikmalar" className="text-purple-400 hover:text-purple-200 text-sm flex items-center gap-2">
            <span>←</span> Birikmalar ro'yxati
          </Link>
          <Link href="/ilmiy/tahlil/raman/birikmalar/k4-fe-cn6" className="text-purple-400 hover:text-purple-200 text-sm">
            K₄[Fe(CN)₆] →
          </Link>
        </div>
      </div>
    </div>
  )
}
