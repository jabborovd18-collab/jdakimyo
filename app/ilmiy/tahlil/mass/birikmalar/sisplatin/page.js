"use client"

import Link from "next/link"
import { useState, useEffect, useRef, useCallback } from "react"

// ── roundRect POLIFILL ──────────────────────────────────────────────────────
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

// ═══════════════════════════════════════════════════════════════════════════════
// IZOTOP MA'LUMOTLARI (NIST standarti) — Pt uchun to'liq
// ═══════════════════════════════════════════════════════════════════════════════
const ISOTOPES = {
  Pt: [
    { mass: 193.9627, abundance: 32.86, label: "¹⁹⁴Pt" },
    { mass: 194.9648, abundance: 33.78, label: "¹⁹⁵Pt" },
    { mass: 195.9649, abundance: 25.21, label: "¹⁹⁶Pt" },
    { mass: 197.9679, abundance: 7.16, label: "¹⁹⁸Pt" },
  ],
  Cl: [
    { mass: 34.9689, abundance: 75.76, label: "³⁵Cl" },
    { mass: 36.9659, abundance: 24.24, label: "³⁷Cl" },
  ],
  N: [
    { mass: 14.0031, abundance: 99.64, label: "¹⁴N" },
    { mass: 15.0001, abundance: 0.36, label: "¹⁵N" },
  ],
  H: [
    { mass: 1.0078, abundance: 99.99, label: "¹H" },
    { mass: 2.0141, abundance: 0.01, label: "²H" },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// IZOTOPIK TAQSIMOT HISOBLASH
// ═══════════════════════════════════════════════════════════════════════════════
function calculateIsotopicDistribution(species) {
  let distributions = [{ mass: 0, probability: 1 }]

  Object.entries(species).forEach(([element, count]) => {
    if (count === 0 || !ISOTOPES[element]) return
    const isotopes = ISOTOPES[element]

    for (let i = 0; i < count; i++) {
      const newDist = []
      distributions.forEach(d => {
        isotopes.forEach(iso => {
          newDist.push({
            mass: d.mass + iso.mass,
            probability: d.probability * (iso.abundance / 100)
          })
        })
      })
      const merged = {}
      newDist.forEach(d => {
        const key = d.mass.toFixed(4)
        if (!merged[key]) merged[key] = { mass: d.mass, probability: 0 }
        merged[key].probability += d.probability
      })
      distributions = Object.values(merged)
    }
  })

  distributions.sort((a, b) => a.mass - b.mass)
  const maxProb = Math.max(...distributions.map(d => d.probability))
  distributions = distributions.map(d => ({
    mass: d.mass,
    probability: (d.probability / maxProb) * 100
  }))

  return distributions.filter(d => d.probability > 0.05)
}

// ═══════════════════════════════════════════════════════════════════════════════
// sis-[PtCl₂(NH₃)₂] — ION TURLARI
// ═══════════════════════════════════════════════════════════════════════════════
const ION_SPECIES = {
  "pt-m": {
    name: "[M]⁺•",
    charge: 1,
    formula: "PtCl₂N₂H₆",
    exactMass: 298.9546,
    description: "Molekulyar ion radikali. EI (70 eV) da kuzatiladi. Pt izotoplarining 4 ta piki + Cl izotoplari hisobiga murakkab pattern.",
    species: { Pt: 1, Cl: 2, N: 2, H: 6 },
    mzDivider: 1,
    isotopicStep: 1.0,
  },
  "pt-m-na": {
    name: "[M+Na]⁺",
    charge: 1,
    formula: "PtCl₂N₂H₆Na",
    exactMass: 321.9444,
    description: "Natriy addukti — ESI+ da eng ko'p kuzatiladigan ion. Pt + Cl izotoplari hisobiga ~8 ta pikdan iborat klaster.",
    species: { Pt: 1, Cl: 2, N: 2, H: 6 },
    mzDivider: 1,
    isotopicStep: 1.0,
    adductMass: 22.9898,
  },
  "pt-m-cl": {
    name: "[M−Cl]⁺",
    charge: 1,
    formula: "PtClN₂H₆",
    exactMass: 263.9857,
    description: "Bitta Cl yo'qotgan fragment. EI da yuqori intensivlikda kuzatiladi. Sisplatin uchun xarakterli fragment.",
    species: { Pt: 1, Cl: 1, N: 2, H: 6 },
    mzDivider: 1,
    isotopicStep: 1.0,
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// CANVAS MASS-SPEKTR GRAFIGI
// ═══════════════════════════════════════════════════════════════════════════════
function MassSpektrGrafik({ speciesKey = "pt-m", lineColor = "#a78bfa" }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [hoveredPeak, setHoveredPeak] = useState(null)
  const [selectedPeak, setSelectedPeak] = useState(null)
  const [animProgress, setAnimProgress] = useState(0)
  const [canvasSize, setCanvasSize] = useState({ w: 820, h: 320 })
  const animRef = useRef(null)
  const pulseRef = useRef(0)
  const startTimeRef = useRef(null)

  const species = ION_SPECIES[speciesKey]
  const rawDist = calculateIsotopicDistribution(species.species)
  // Agar addukt bo'lsa, massaga qo'shamiz
  const distribution = species.adductMass 
    ? rawDist.map(d => ({ ...d, mass: d.mass + species.adductMass }))
    : rawDist
    
  const mzMin = distribution[0]?.mass / species.mzDivider - 2 || 295
  const mzMax = distribution[distribution.length - 1]?.mass / species.mzDivider + 2 || 310

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const w = Math.min(820, containerRef.current.clientWidth)
        setCanvasSize({ w, h: w > 500 ? 320 : 250 })
      }
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  useEffect(() => {
    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / 2000, 1)
      setAnimProgress(progress)
      pulseRef.current = (pulseRef.current + 0.05) % (Math.PI * 2)
      if (progress < 1 || selectedPeak) {
        animRef.current = requestAnimationFrame(animate)
      }
    }
    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [selectedPeak])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const W = canvas.width, H = canvas.height
    const PAD = { l: 65, r: 30, t: 35, b: 55 }
    const plotW = W - PAD.l - PAD.r, plotH = H - PAD.t - PAD.b

    const mzToX = (mz) => PAD.l + ((mz - mzMin) / (mzMax - mzMin)) * plotW
    const intToY = (int) => PAD.t + ((100 - int) / 100) * plotH

    function voigt(mz, mz0, height, width) {
      const g = Math.exp(-Math.pow((mz - mz0) / width, 2))
      const l = 1 / (1 + Math.pow((mz - mz0) / (width * 0.5), 2))
      return height * (0.7 * g + 0.3 * l)
    }

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = "#0f0a1a"
    ctx.fillRect(0, 0, W, H)

    // Grid
    ctx.strokeStyle = "#2a1f3d"; ctx.lineWidth = 0.5
    const step = 1
    for (let mz = Math.floor(mzMin); mz <= Math.ceil(mzMax); mz += step) {
      const x = mzToX(mz)
      ctx.beginPath(); ctx.moveTo(x, PAD.t); ctx.lineTo(x, PAD.t + plotH); ctx.stroke()
    }
    ;[20, 40, 60, 80].forEach(t => {
      const y = intToY(t)
      ctx.beginPath(); ctx.moveTo(PAD.l, y); ctx.lineTo(PAD.l + plotW, y); ctx.stroke()
    })

    ctx.strokeStyle = "#3d2a5c"; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(PAD.l, intToY(0)); ctx.lineTo(PAD.l + plotW, intToY(0)); ctx.stroke()

    const maxMz = mzMin + (mzMax - mzMin) * animProgress
    const peakWidth = 0.08

    // Spektr chizig'i
    ctx.beginPath()
    ctx.strokeStyle = lineColor; ctx.lineWidth = 1.5
    ctx.shadowBlur = 4; ctx.shadowColor = lineColor
    let fp = true
    for (let mz = mzMin; mz <= mzMax; mz += (mzMax - mzMin) / 1000) {
      if (mz > maxMz && animProgress < 1) continue
      let signal = 0
      distribution.forEach(d => {
        const peakMz = d.mass / species.mzDivider
        signal += voigt(mz, peakMz, d.probability, peakWidth)
      })
      const x = mzToX(mz), y = intToY(Math.min(98, signal))
      if (fp) { ctx.moveTo(x, y); fp = false } else ctx.lineTo(x, y)
    }
    ctx.stroke(); ctx.shadowBlur = 0

    if (animProgress > 0.3) {
      ctx.beginPath(); fp = true
      for (let mz = mzMax; mz >= mzMin; mz -= (mzMax - mzMin) / 1000) {
        if (mz > maxMz && animProgress < 1) continue
        let signal = 0
        distribution.forEach(d => {
          const peakMz = d.mass / species.mzDivider
          signal += voigt(mz, peakMz, d.probability, peakWidth)
        })
        const x = mzToX(mz), y = intToY(Math.min(98, signal))
        if (fp) { ctx.moveTo(x, y); fp = false } else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.fillStyle = lineColor + "20"
      ctx.fill()
    }

    // TOP 8 pik (Pt uchun ko'p pik bo'ladi)
    const topPeaks = [...distribution]
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 8)
    
    topPeaks.forEach(d => {
      const mz = d.mass / species.mzDivider
      const x = mzToX(mz), y = intToY(Math.min(98, d.probability))
      const isH = hoveredPeak?.mz === Math.round(mz * 100) / 100
      const isS = selectedPeak?.mz === Math.round(mz * 100) / 100
      const isA = isH || isS

      if (isS) {
        const ps = 1 + Math.sin(pulseRef.current) * 0.15
        ctx.beginPath(); ctx.arc(x, y, 14 * ps, 0, Math.PI * 2)
        ctx.fillStyle = lineColor + "20"; ctx.fill()
      }

      ctx.beginPath(); ctx.strokeStyle = d.probability > 40 ? lineColor : "#7c6a9e"
      ctx.lineWidth = isA ? 2 : 0.8
      ctx.setLineDash(isA ? [] : [2, 2])
      const lh = isA ? 45 : 25
      ctx.moveTo(x, y - 2); ctx.lineTo(x, y - lh); ctx.stroke()
      ctx.setLineDash([])

      ctx.beginPath(); ctx.arc(x, y, isA ? 6 : 4, 0, Math.PI * 2)
      ctx.fillStyle = d.probability > 40 ? lineColor : "#7c6a9e"; ctx.fill()
      if (isA) { ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke() }

      ctx.fillStyle = d.probability > 40 ? lineColor : "#7c6a9e"
      ctx.font = isA ? "bold 10px monospace" : "bold 8px monospace"
      ctx.textAlign = "center"
      ctx.fillText(mz.toFixed(1), x, y - lh - 4)
    })

    // Hover tooltip
    if (hoveredPeak && !selectedPeak) {
      const p = hoveredPeak
      const x = mzToX(p.mz), y = intToY(p.intensity || 50)
      ctx.fillStyle = "#0f0a1a"; ctx.strokeStyle = lineColor; ctx.lineWidth = 1
      const tw = 180, th = 50
      const tx = Math.min(Math.max(x - tw / 2, PAD.l + 5), PAD.l + plotW - tw - 5)
      const ty = y - 70
      ctx.beginPath(); ctx.roundRect(tx, ty, tw, th, 8); ctx.fill(); ctx.stroke()
      ctx.fillStyle = "#fff"; ctx.font = "bold 11px sans-serif"; ctx.textAlign = "center"
      ctx.fillText(`m/z = ${p.mz}`, tx + tw / 2, ty + 18)
      ctx.fillStyle = lineColor; ctx.font = "9px sans-serif"
      ctx.fillText(p.label || "", tx + tw / 2, ty + 34)
    }

    // O'qlar
    ctx.strokeStyle = "#3d2a5c"; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(PAD.l, PAD.t); ctx.lineTo(PAD.l, PAD.t + plotH); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(PAD.l, PAD.t + plotH); ctx.lineTo(PAD.l + plotW, PAD.t + plotH); ctx.stroke()

    ctx.fillStyle = "#7c6a9e"; ctx.font = "10px sans-serif"; ctx.textAlign = "center"
    for (let mz = Math.floor(mzMin); mz <= Math.ceil(mzMax); mz += 2) {
      ctx.fillText(mz.toFixed(0), mzToX(mz), PAD.t + plotH + 18)
    }
    ctx.fillStyle = "#9a8abf"; ctx.font = "bold 11px sans-serif"
    ctx.fillText(`m/z (z=+${Math.abs(species.charge)})`, PAD.l + plotW / 2, H - 8)
    
    ctx.textAlign = "right"
    ;[20, 40, 60, 80].forEach(t => ctx.fillText(t + "%", PAD.l - 8, intToY(t) + 4))
    ctx.save(); ctx.translate(16, PAD.t + plotH / 2)
    ctx.rotate(-Math.PI / 2); ctx.fillText("Nisbiy intensivlik", 0, 0); ctx.restore()

    ctx.fillStyle = "#5b7898"; ctx.font = "italic 8px sans-serif"; ctx.textAlign = "right"
    ctx.fillText("Sxematik — haqiqiy eksperimental spektr emas", PAD.l + plotW, PAD.t - 8)

  }, [distribution, mzMin, mzMax, animProgress, hoveredPeak, selectedPeak, species, lineColor, canvasSize])

  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvasSize.w / rect.width
    const mx = (e.clientX - rect.left) * scaleX
    const PAD = { l: 65, r: 30 }
    const plotW = canvasSize.w - PAD.l - PAD.r
    const mz = mzMin + ((mx - PAD.l) / plotW) * (mzMax - mzMin)
    
    let closest = null, minDist = (mzMax - mzMin) / 40
    distribution.forEach(d => {
      const peakMz = d.mass / species.mzDivider
      const dist = Math.abs(peakMz - mz)
      if (dist < minDist) {
        minDist = dist
        closest = { mz: Math.round(peakMz * 100) / 100, intensity: d.probability, label: `Int: ${d.probability.toFixed(1)}%` }
      }
    })
    setHoveredPeak(closest)
  }, [distribution, mzMin, mzMax, species, canvasSize])

  return (
    <div ref={containerRef} className="relative" role="img" aria-label={`Mass-spektr: ${species.name}, m/z ${mzMin.toFixed(0)}−${mzMax.toFixed(0)}`}>
      <canvas ref={canvasRef} width={canvasSize.w} height={canvasSize.h}
        onMouseMove={handleMouseMove}
        onClick={() => { if (hoveredPeak) setSelectedPeak(selectedPeak?.mz === hoveredPeak.mz ? null : hoveredPeak) }}
        onMouseLeave={() => setHoveredPeak(null)}
        onKeyDown={(e) => { if (e.key === 'Escape') setSelectedPeak(null) }}
        tabIndex={0}
        className="w-full h-auto rounded-xl border border-purple-700/50 cursor-crosshair focus:outline-none focus:ring-2 focus:ring-purple-400" />
      {animProgress < 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-purple-950/80 backdrop-blur px-4 py-2 rounded-full border border-purple-700/50">
          <div className="flex items-center gap-2">
            <span className="text-xs text-purple-400">Chizilmoqda...</span>
            <div className="w-24 h-1.5 bg-purple-800/50 rounded-full overflow-hidden">
              <div className="h-full bg-violet-400 rounded-full transition-all duration-100" style={{ width: `${animProgress * 100}%` }} />
            </div>
            <span className="text-xs text-violet-400 font-mono">{Math.round(animProgress * 100)}%</span>
          </div>
        </div>
      )}
      {selectedPeak && (
        <div className="mt-3 bg-purple-800/30 border rounded-xl p-4" style={{ borderColor: lineColor + "40" }}>
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full" style={{ background: lineColor }} />
            <span className="font-mono font-bold text-lg" style={{ color: lineColor }}>m/z = {selectedPeak.mz}</span>
            <span className="text-purple-400">—</span>
            <span className="text-white font-semibold">{selectedPeak.label}</span>
          </div>
          <button onClick={() => setSelectedPeak(null)} className="mt-2 text-xs text-purple-400 hover:text-white transition-colors" aria-label="Yopish">✕ Yopish</button>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SPECIES SELECTOR
// ═══════════════════════════════════════════════════════════════════════════════
function SpeciesSelector({ selected, onSelect }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {Object.entries(ION_SPECIES).map(([key, sp]) => (
          <button key={key} onClick={() => onSelect(key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              selected === key
                ? "bg-violet-600/40 text-white border border-violet-400/50"
                : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
            }`}>
            {sp.name} (z=+{sp.charge})
          </button>
        ))}
      </div>
      <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30 text-sm text-purple-200">
        <p>{ION_SPECIES[selected].description}</p>
        <p className="mt-2 text-purple-400">
          <strong>Aniq massa:</strong> {ION_SPECIES[selected].exactMass.toFixed(4)} Da | 
          <strong> m/z:</strong> ~{(ION_SPECIES[selected].exactMass / Math.abs(ION_SPECIES[selected].charge)).toFixed(1)} | 
          <strong> Izotop qadam:</strong> {ION_SPECIES[selected].isotopicStep} m/z
        </p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// IZOTOP KALKULYATORI — Pt uchun maxsus
// ═══════════════════════════════════════════════════════════════════════════════
function IzotopKalkulyator() {
  const [ptIso, setPtIso] = useState("195")
  const [clCombo, setClCombo] = useState("35-35")
  const [result, setResult] = useState(null)

  const calculate = () => {
    const species = { Pt: 1, Cl: 2, N: 2, H: 6 }
    const dist = calculateIsotopicDistribution(species)
    const mainPeak = dist.find(d => d.probability > 20) || dist[0]
    setResult({
      mainMz: mainPeak.mass.toFixed(2),
      peaks: dist.filter(d => d.probability > 1).slice(0, 10),
      totalPeaks: dist.length,
    })
  }

  useEffect(() => { calculate() }, [ptIso, clCombo])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-purple-400 text-xs block mb-1">Pt izotopi</label>
          <select value={ptIso} onChange={(e) => setPtIso(e.target.value)} className="w-full bg-purple-800/50 border border-purple-600 rounded-lg px-3 py-2 text-white text-sm">
            <option value="194">¹⁹⁴Pt (32.86%)</option>
            <option value="195">¹⁹⁵Pt (33.78%)</option>
            <option value="196">¹⁹⁶Pt (25.21%)</option>
            <option value="198">¹⁹⁸Pt (7.16%)</option>
          </select>
        </div>
        <div>
          <label className="text-purple-400 text-xs block mb-1">Cl izotop kombinatsiyasi</label>
          <select value={clCombo} onChange={(e) => setClCombo(e.target.value)} className="w-full bg-purple-800/50 border border-purple-600 rounded-lg px-3 py-2 text-white text-sm">
            <option value="35-35">³⁵Cl + ³⁵Cl (57.4%)</option>
            <option value="35-37">³⁵Cl + ³⁷Cl (36.7%)</option>
            <option value="37-37">³⁷Cl + ³⁷Cl (5.9%)</option>
          </select>
        </div>
      </div>
      {result && (
        <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
          <p className="text-white font-semibold">Asosiy massa: <span className="text-green-400 font-mono">{result.mainMz} Da</span></p>
          <div className="flex flex-wrap gap-2 mt-2">
            {result.peaks.map((p, i) => (
              <span key={i} className="bg-purple-900/50 px-2 py-1 rounded-full text-xs text-purple-300 font-mono">
                {p.mass.toFixed(1)}: {p.probability.toFixed(1)}%
              </span>
            ))}
          </div>
          <p className="text-purple-400 text-xs mt-2">Jami {result.totalPeaks} ta izotopik pik — Pt + 2Cl murakkab pattern</p>
        </div>
      )}
    </div>
  )
}

// ── 1-QISM TUGADI, 2-QISMDA DAVOM ETADI ─────────────────────────────────────
export { MassSpektrGrafik, SpeciesSelector, IzotopKalkulyator, ION_SPECIES, ISOTOPES, calculateIsotopicDistribution }
// ═══════════════════════════════════════════════════════════════════════════════
// MS/MS FRAGMENTATSIYA DARAXTI — sis-[PtCl₂(NH₃)₂]
// ═══════════════════════════════════════════════════════════════════════════════
const MSMS_TREE = {
  precursor: { mz: 300.0, label: "[M]⁺• (sis-[PtCl₂(NH₃)₂]⁺•)", intensity: 100 },
  fragments: [
    {
      mz: 265.0,
      label: "[M−Cl]⁺",
      intensity: 85,
      energy: "10 eV",
      children: [
        { mz: 248.0, label: "[M−Cl−NH₃]⁺", intensity: 45, energy: "15 eV" },
        { mz: 230.0, label: "[M−2Cl]⁺•", intensity: 30, energy: "20 eV" },
      ]
    },
    {
      mz: 283.0,
      label: "[M−NH₃]⁺•",
      intensity: 60,
      energy: "8 eV",
      children: [
        { mz: 248.0, label: "[M−NH₃−Cl]⁺", intensity: 40, energy: "15 eV" },
        { mz: 266.0, label: "[M−2NH₃]⁺•", intensity: 20, energy: "18 eV" },
      ]
    },
    {
      mz: 248.0,
      label: "[M−Cl−NH₃]⁺",
      intensity: 55,
      energy: "15 eV",
      children: [
        { mz: 213.0, label: "[Pt(NH₃)]⁺", intensity: 25, energy: "22 eV" },
        { mz: 195.0, label: "[Pt]⁺", intensity: 15, energy: "28 eV" },
      ]
    },
    {
      mz: 230.0,
      label: "[M−2Cl]⁺•",
      intensity: 40,
      energy: "20 eV",
      children: [
        { mz: 213.0, label: "[Pt(NH₃)]⁺", intensity: 20, energy: "25 eV" },
        { mz: 195.0, label: "[Pt]⁺", intensity: 10, energy: "30 eV" },
      ]
    },
    {
      mz: 195.0,
      label: "[Pt]⁺",
      intensity: 20,
      energy: "30 eV",
      children: []
    },
  ]
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADDUKT IONLAR JADVALI — sis-[PtCl₂(NH₃)₂]
// ═══════════════════════════════════════════════════════════════════════════════
const ADDUCT_TABLE = [
  { adduct: "[M]⁺•", mz: 298.9, formula: "[PtCl₂(NH₃)₂]⁺•", mode: "EI", abundance: "Yuqori" },
  { adduct: "[M+H]⁺", mz: 299.9, formula: "[PtCl₂(NH₃)₂+H]⁺", mode: "ESI+", abundance: "Yuqori" },
  { adduct: "[M+Na]⁺", mz: 321.9, formula: "[PtCl₂(NH₃)₂+Na]⁺", mode: "ESI+", abundance: "Eng yuqori" },
  { adduct: "[M+K]⁺", mz: 337.9, formula: "[PtCl₂(NH₃)₂+K]⁺", mode: "ESI+", abundance: "O&apos;rta" },
  { adduct: "[M−Cl]⁺", mz: 264.0, formula: "[PtCl(NH₃)₂]⁺", mode: "ESI+/EI", abundance: "Yuqori" },
  { adduct: "[M−2Cl]⁺•", mz: 229.1, formula: "[Pt(NH₃)₂]⁺•", mode: "EI", abundance: "O&apos;rta" },
  { adduct: "[2M+Na]⁺", mz: 621.8, formula: "[Pt₂Cl₄(NH₃)₄+Na]⁺", mode: "ESI+", abundance: "Past" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// EKSPERIMENTAL PARAMETRLAR
// ═══════════════════════════════════════════════════════════════════════════════
const EXPERIMENTAL_PARAMS = {
  instrument: "Agilent 6545 Q-TOF LC/MS",
  ionization: "ESI (+) / EI (70 eV)",
  capillaryVoltage: "3.5 kV",
  nebulizerGas: "N₂, 35 psi",
  dryingGas: "N₂, 8 L/min, 325°C",
  sheathGas: "N₂, 11 L/min, 350°C",
  fragmentor: "100 V",
  skimmer: "65 V",
  massRange: "m/z 100–800",
  resolution: "~40,000 (FWHM)",
  accuracy: "&lt; 2 ppm",
  solvent: "H₂O:MeOH (50:50, v/v), 0.1% CH₂O₂",
  concentration: "10 μM (sisplatin)",
  flowRate: "0.3 mL/min",
  internalStandard: "K₃[Co(CN)₆] — m/z 332.0",
  lod: "0.01 μM (S/N &gt; 3)",
  loq: "0.03 μM (S/N &gt; 10)",
}

// ═══════════════════════════════════════════════════════════════════════════════
// IONLASHTIRISH USULLARI TAQQOSLASH
// ═══════════════════════════════════════════════════════════════════════════════
const IONIZATION_COMPARISON = [
  {
    method: "ESI (+)",
    observed: "[M+Na]⁺, [M+H]⁺, [M−Cl]⁺",
    mz: "322, 300, 264",
    sensitivity: "Yuqori",
    fragmentation: "Minimal",
    notes: "Eng yaxshi usul. Na⁺ addukti dominant. Sis/trans farqlanmaydi.",
  },
  {
    method: "EI (70 eV)",
    observed: "[M]⁺•, [M−Cl]⁺, [M−2Cl]⁺•, [Pt]⁺",
    mz: "300, 265, 230, 195",
    sensitivity: "O&apos;rta",
    fragmentation: "Yuqori",
    notes: "Fragmentlar orqali tarkibiy ma'lumot ko'p. Pt izotop pattern aniq.",
  },
  {
    method: "MALDI−TOF",
    observed: "[M+Na]⁺, [M−Cl]⁺",
    mz: "322, 264",
    sensitivity: "O&apos;rta",
    fragmentation: "O&apos;rta",
    notes: "DHB matritsasi bilan. Cl yo'qotish kuzatiladi.",
  },
  {
    method: "APCI (+)",
    observed: "[M+H]⁺, [M−Cl]⁺",
    mz: "300, 264",
    sensitivity: "Past",
    fragmentation: "O&apos;rta",
    notes: "Termik labil — qizdirishda parchalanadi.",
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// INTERNAL STANDARD
// ═══════════════════════════════════════════════════════════════════════════════
const INTERNAL_STANDARD = {
  name: "K₃[Co(CN)₆]",
  formula: "CoC₆N₆K₃",
  exactMass: 331.8354,
  mainIon: "[K₂Co(CN)₆]⁻",
  mz: 332.0,
  usage: "Tashqi kalibrlash va mass accuracy tekshirish uchun",
  concentration: "5 μM (har bir namunaga qo&apos;shiladi)",
  advantage: "Co kompleksi — Pt kompleksidan 10 Da farq qiladi, spektrda ajralib turadi",
}

// ═══════════════════════════════════════════════════════════════════════════════
// SIS/TRANS IZOMERIYA BLOKI
// ═══════════════════════════════════════════════════════════════════════════════
const SIS_TRANS_INFO = {
  title: "sis vs trans — Geometrik izomeriya va mass-spektr",
  problem: "sis-[PtCl₂(NH₃)₂] va trans-[PtCl₂(NH₃)₂] bir xil molekulyar massaga ega — 300.05 g/mol. Oddiy MS ularni farqlay olmaydi!",
  explanation: "Ikkala izomer ham bir xil m/z qiymatlarini beradi. Ammo fragmentatsiya energetikasi va MS/MS pattern orqali farqlash mumkin. Trans izomer termodinamik barqaror, sis izomer kinetik labil — shuning uchun fragmentatsiya energiyalari farq qiladi.",
  differentiation: [
    { parameter: "m/z [M]⁺•", sis: "298.9 (bir xil)", trans: "298.9 (bir xil)" },
    { parameter: "[M−Cl]⁺ intensivligi", sis: "85% (yuqori)", trans: "45% (past)" },
    { parameter: "CID 50% yo'qolish energiyasi", sis: "12 eV (pastroq)", trans: "18 eV (yuqoriroq)" },
    { parameter: "IMS (ion mobility) drift vaqti", sis: "qisqaroq (dipol momenti ≠ 0)", trans: "uzunroq (dipol momenti = 0)" },
    { parameter: "LC-MS saqlanish vaqti", sis: "tR ≈ 1.8 min", trans: "tR ≈ 2.9 min" },
    { parameter: "Biologik faollik", sis: "Saraton terapiyasi (aktiv)", trans: "Faol emas (nootoksik)" },
  ],
  clinicalNote: "Sisplatin — JSST ro'yxatidagi eng muhim dori vositalaridan biri. Tuxumdon, moyak, qovuq saratonida qo'llaniladi. Ta'sir mexanizmi: DNK bilan o'zaro bog'lanish → apoptoz."
}

// ═══════════════════════════════════════════════════════════════════════════════
// HERO SECTION
// ═══════════════════════════════════════════════════════════════════════════════
function HeroSection() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-950 via-purple-900 to-blue-950 border border-violet-700/50 p-8 md:p-12 mb-10">
      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 text-sm text-purple-400 mb-6">
          <Link href="/" className="hover:text-purple-200 transition-colors">Bosh sahifa</Link>
          <span>/</span>
          <Link href="/ilmiy/birikmalar" className="hover:text-purple-200 transition-colors">Birikmalar</Link>
          <span>/</span>
          <span className="text-yellow-400">sis-[PtCl₂(NH₃)₂]</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white">sis-[PtCl₂(NH₃)₂]</h1>
          <div className="flex flex-wrap gap-2">
            <span className="bg-violet-600/20 text-violet-400 border border-violet-600/30 rounded-full px-3 py-1 text-xs font-semibold">
              SISPLATIN
            </span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 rounded-full px-3 py-1 text-xs">
              sis-diammindixloroplatina(II)
            </span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 rounded-full px-3 py-1 text-xs">
              Saraton dorisi
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Molekulyar massa", value: "300.05 g/mol" },
            { label: "Aniq massa", value: "298.9546 Da" },
            { label: "Oksidlanish darajasi", value: "Pt²⁺ (d⁸)" },
            { label: "Geometriya", value: "Kvadrat planar" },
          ].map((item, i) => (
            <div key={i} className="bg-purple-800/30 border border-purple-700/30 rounded-xl p-3 text-center">
              <p className="text-purple-400 text-xs mb-1">{item.label}</p>
              <p className="text-white font-semibold text-sm">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 inline-block">
          <p className="text-yellow-400 text-sm">
            <strong>ESI+MS asosiy piki:</strong>{" "}
            <span className="font-mono text-lg">m/z = 321.9</span>{" "}
            <span className="text-purple-400">[M+Na]⁺</span>
          </p>
          <p className="text-purple-400 text-xs mt-1">
            EI-MS: [M]⁺• m/z ≈ 300 — Pt (4 izotop) + Cl (2 izotop) = murakkab pattern
          </p>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// TABLAR
// ═══════════════════════════════════════════════════════════════════════════════
const TABS = [
  { id: "ms", label: "Mass-spektr", icon: "📊" },
  { id: "msms", label: "MS/MS Fragmentatsiya", icon: "🧬" },
  { id: "isomerism", label: "sis vs trans", icon: "⚖️" },
  { id: "adducts", label: "Addukt ionlar", icon: "📋" },
  { id: "experimental", label: "Eksperimental", icon: "⚗️" },
  { id: "ionization", label: "Ionlashtirish", icon: "💡" },
  { id: "calculator", label: "Izotop Kalkulyator", icon: "🔢" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// MS/MS FRAGMENTATSIYA DARAXTI KOMPONENTI
// ═══════════════════════════════════════════════════════════════════════════════
function MSMSFragmentTree() {
  const [expandedNodes, setExpandedNodes] = useState(new Set())
  const [selectedNode, setSelectedNode] = useState(null)

  const toggleNode = (mz) => {
    const newSet = new Set(expandedNodes)
    if (newSet.has(mz)) newSet.delete(mz)
    else newSet.add(mz)
    setExpandedNodes(newSet)
  }

  const renderFragment = (fragment, depth = 0, isLast = false) => {
    const hasChildren = fragment.children && fragment.children.length > 0
    const isExpanded = expandedNodes.has(fragment.mz)
    const isSelected = selectedNode?.mz === fragment.mz

    return (
      <div key={fragment.mz} className="relative">
        <div className="flex items-start">
          {depth > 0 && (
            <div className="flex-shrink-0 w-6 relative">
              <div className="absolute top-0 left-3 border-l border-dashed border-purple-600/50" 
                   style={{ height: isLast ? '50%' : '100%' }} />
              <div className="absolute top-4 left-3 w-3 border-t border-dashed border-purple-600/50" />
            </div>
          )}
          
          <div
            onClick={() => {
              setSelectedNode(isSelected ? null : fragment)
              if (hasChildren) toggleNode(fragment.mz)
            }}
            className={`flex-1 cursor-pointer transition-all rounded-xl p-3 border ${
              isSelected
                ? "bg-violet-600/20 border-violet-500/50"
                : "bg-purple-800/30 border-purple-700/30 hover:border-purple-500/50"
            }`}
          >
            <div className="flex items-center gap-3">
              {hasChildren && (
                <span className="text-purple-400 text-sm transition-transform" 
                      style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                  ▶
                </span>
              )}
              {!hasChildren && <span className="w-4" />}
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-yellow-400">
                    m/z = {fragment.mz.toFixed(1)}
                  </span>
                  <span className="text-purple-400 text-sm">{fragment.label}</span>
                </div>
                {fragment.energy && (
                  <p className="text-purple-500 text-xs mt-0.5">CID energiyasi: {fragment.energy}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-purple-950/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-400 to-purple-400 rounded-full"
                    style={{ width: `${fragment.intensity}%` }}
                  />
                </div>
                <span className="text-purple-400 text-xs w-10">{fragment.intensity}%</span>
              </div>
            </div>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-6">
            {fragment.children.map((child, idx) => (
              renderFragment(child, depth + 1, idx === fragment.children.length - 1)
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-purple-800/30 border border-purple-700/30 rounded-xl p-4 mb-4">
        <h3 className="text-white font-semibold mb-2">Prekursor ion</h3>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
          <span className="font-mono font-bold text-yellow-400 text-lg">
            m/z = {MSMS_TREE.precursor.mz}
          </span>
          <span className="text-purple-400 ml-2">{MSMS_TREE.precursor.label}</span>
        </div>
        <p className="text-purple-400 text-xs mt-2">
          CID (Collision-Induced Dissociation) — N₂ gazi, 10–35 eV. Cl va NH₃ ketma-ket yo'qoladi.
        </p>
      </div>

      <h3 className="text-white font-semibold">Fragment ionlar</h3>
      <div className="space-y-2">
        {MSMS_TREE.fragments.map((fragment, idx) => (
          renderFragment(fragment, 0, idx === MSMS_TREE.fragments.length - 1)
        ))}
      </div>

      {selectedNode && (
        <div className="bg-violet-600/10 border border-violet-500/30 rounded-xl p-4 mt-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono font-bold text-violet-400">
                m/z = {selectedNode.mz.toFixed(1)}
              </span>
              <span className="text-purple-400 ml-2">{selectedNode.label}</span>
            </div>
            <button onClick={() => setSelectedNode(null)} className="text-purple-400 hover:text-white text-sm">✕ Yopish</button>
          </div>
          {selectedNode.energy && (
            <p className="text-purple-400 text-sm mt-1">CID energiyasi: {selectedNode.energy}</p>
          )}
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SIS/TRANS IZOMERIYA BLOKI
// ═══════════════════════════════════════════════════════════════════════════════
function SisTransIsomerBlock() {
  return (
    <div className="space-y-4">
      <div className="bg-violet-600/10 border border-violet-500/30 rounded-xl p-4">
        <h3 className="text-violet-400 font-semibold flex items-center gap-2">
          <span>⚖️</span> {SIS_TRANS_INFO.title}
        </h3>
        <p className="text-purple-200 mt-2 text-sm">
          <strong className="text-yellow-400">{SIS_TRANS_INFO.problem}</strong>
        </p>
        <p className="text-purple-300 text-sm mt-1">{SIS_TRANS_INFO.explanation}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-purple-700/50">
              <th className="text-left py-3 px-4 text-purple-400 font-semibold">Parametr</th>
              <th className="text-left py-3 px-4 text-violet-400 font-semibold">sis-[PtCl₂(NH₃)₂]</th>
              <th className="text-left py-3 px-4 text-blue-400 font-semibold">trans-[PtCl₂(NH₃)₂]</th>
            </tr>
          </thead>
          <tbody>
            {SIS_TRANS_INFO.differentiation.map((row, i) => (
              <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20 transition-colors">
                <td className="py-3 px-4 text-purple-200">{row.parameter}</td>
                <td className="py-3 px-4 text-violet-300 font-semibold text-xs">{row.sis}</td>
                <td className="py-3 px-4 text-blue-300 font-semibold text-xs">{row.trans}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-4">
        <h3 className="text-red-400 font-semibold flex items-center gap-2">
          <span>💊</span> Klinik ahamiyati
        </h3>
        <p className="text-purple-200 mt-2 text-sm">{SIS_TRANS_INFO.clinicalNote}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-purple-800/30 border border-purple-700/30 rounded-xl p-4">
          <h3 className="text-violet-400 font-semibold text-sm mb-2">sis-izomer — faol</h3>
          <ul className="text-purple-200 text-xs space-y-1">
            <li>• Dipol momenti: μ ≠ 0 (qutbli)</li>
            <li>• Suvda eruvchanligi: yuqoriroq</li>
            <li>• DNK bilan bog'lanish: ikkala Cl o'rniga</li>
            <li>• IC₅₀ (tuxumdon saratoni): ~2 μM</li>
            <li>• Pt izotop pattern — ESI+ da aniq ko'rinadi</li>
          </ul>
        </div>
        <div className="bg-purple-800/30 border border-purple-700/30 rounded-xl p-4">
          <h3 className="text-blue-400 font-semibold text-sm mb-2">trans-izomer — nofaol</h3>
          <ul className="text-purple-200 text-xs space-y-1">
            <li>• Dipol momenti: μ = 0 (qutbsiz)</li>
            <li>• Suvda eruvchanligi: pastroq</li>
            <li>• DNK bilan bog'lanish: sterik to'siq</li>
            <li>• IC₅₀ (tuxumdon saratoni): &gt;100 μM</li>
            <li>• MS da bir xil m/z — IMS yoki LC-MS kerak</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADDUKT IONLAR JADVALI KOMPONENTI
// ═══════════════════════════════════════════════════════════════════════════════
function AdductTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-purple-700/50">
            <th className="text-left py-3 px-4 text-purple-400 font-semibold">Addukt</th>
            <th className="text-left py-3 px-4 text-purple-400 font-semibold">m/z</th>
            <th className="text-left py-3 px-4 text-purple-400 font-semibold">Formula</th>
            <th className="text-left py-3 px-4 text-purple-400 font-semibold">Ionlashtirish</th>
            <th className="text-left py-3 px-4 text-purple-400 font-semibold">Nisbiy miqdor</th>
          </tr>
        </thead>
        <tbody>
          {ADDUCT_TABLE.map((row, i) => (
            <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20 transition-colors">
              <td className="py-3 px-4">
                <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 rounded-full px-2 py-0.5 text-xs font-mono">{row.adduct}</span>
              </td>
              <td className="py-3 px-4 font-mono text-yellow-400">{row.mz}</td>
              <td className="py-3 px-4 text-purple-200 font-mono text-xs">{row.formula}</td>
              <td className="py-3 px-4">
                <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-full px-2 py-0.5 text-xs">{row.mode}</span>
              </td>
              <td className="py-3 px-4">
                <span className={`rounded-full px-2 py-0.5 text-xs ${
                  row.abundance === "Eng yuqori" ? "bg-green-600/20 text-green-400 border border-green-600/30" :
                  row.abundance === "Yuqori" ? "bg-yellow-600/20 text-yellow-400 border border-yellow-600/30" :
                  row.abundance === "O&apos;rta" ? "bg-orange-600/20 text-orange-400 border border-orange-600/30" :
                  "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                }`}>{row.abundance}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-purple-500 text-xs mt-3 italic">
        * m/z = 321.9 [M+Na]⁺ ESI+ da eng dominant. EI da [M]⁺• m/z ≈ 299 Pt izotop pattern bilan.
      </p>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// EKSPERIMENTAL PARAMETRLAR KOMPONENTI
// ═══════════════════════════════════════════════════════════════════════════════
function ExperimentalParams() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-purple-800/30 border border-purple-700/30 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-3">Asbob parametrlari</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-purple-400">Asbob:</span><span className="text-purple-200">{EXPERIMENTAL_PARAMS.instrument}</span></div>
            <div className="flex justify-between"><span className="text-purple-400">Ionlashtirish:</span><span className="text-purple-200">{EXPERIMENTAL_PARAMS.ionization}</span></div>
            <div className="flex justify-between"><span className="text-purple-400">Capillary Voltage:</span><span className="text-purple-200">{EXPERIMENTAL_PARAMS.capillaryVoltage}</span></div>
            <div className="flex justify-between"><span className="text-purple-400">Fragmentor:</span><span className="text-purple-200">{EXPERIMENTAL_PARAMS.fragmentor}</span></div>
            <div className="flex justify-between"><span className="text-purple-400">Skimmer:</span><span className="text-purple-200">{EXPERIMENTAL_PARAMS.skimmer}</span></div>
          </div>
        </div>
        <div className="bg-purple-800/30 border border-purple-700/30 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-3">Ishlash ko&apos;rsatkichlari</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-purple-400">Mass Range:</span><span className="text-purple-200">{EXPERIMENTAL_PARAMS.massRange}</span></div>
            <div className="flex justify-between"><span className="text-purple-400">Resolution:</span><span className="text-purple-200">{EXPERIMENTAL_PARAMS.resolution}</span></div>
            <div className="flex justify-between"><span className="text-purple-400">Mass Accuracy:</span><span className="text-purple-200">{EXPERIMENTAL_PARAMS.accuracy}</span></div>
            <div className="flex justify-between"><span className="text-purple-400">LOD:</span><span className="text-purple-200">{EXPERIMENTAL_PARAMS.lod}</span></div>
            <div className="flex justify-between"><span className="text-purple-400">LOQ:</span><span className="text-purple-200">{EXPERIMENTAL_PARAMS.loq}</span></div>
          </div>
        </div>
      </div>
      <div className="bg-purple-800/30 border border-purple-700/30 rounded-xl p-4">
        <h3 className="text-white font-semibold mb-3">Namuna tayyorlash</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-purple-400">Erituvchi:</span><span className="text-purple-200">{EXPERIMENTAL_PARAMS.solvent}</span></div>
          <div className="flex justify-between"><span className="text-purple-400">Konsentratsiya:</span><span className="text-purple-200">{EXPERIMENTAL_PARAMS.concentration}</span></div>
          <div className="flex justify-between"><span className="text-purple-400">Oqim tezligi:</span><span className="text-purple-200">{EXPERIMENTAL_PARAMS.flowRate}</span></div>
          <div className="flex justify-between"><span className="text-purple-400">Ichki standart:</span><span className="text-purple-200">{EXPERIMENTAL_PARAMS.internalStandard}</span></div>
        </div>
      </div>
      <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-4">
        <h4 className="text-blue-400 font-semibold text-sm mb-2">🎯 Ichki standart: {INTERNAL_STANDARD.name}</h4>
        <p className="text-purple-200 text-sm">
          Asosiy ioni: <span className="font-mono text-yellow-400">m/z = {INTERNAL_STANDARD.mz}</span> ({INTERNAL_STANDARD.mainIon}).
        </p>
        <p className="text-purple-400 text-xs mt-1">{INTERNAL_STANDARD.advantage}. Konsentratsiyasi: {INTERNAL_STANDARD.concentration}.</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// IONLASHTIRISH TAQQOSLASH KOMPONENTI
// ═══════════════════════════════════════════════════════════════════════════════
function IonizationComparison() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead><tr className="border-b border-purple-700/50">
          <th className="text-left py-3 px-4 text-purple-400 font-semibold">Usul</th>
          <th className="text-left py-3 px-4 text-purple-400 font-semibold">Kuzatilgan ionlar</th>
          <th className="text-left py-3 px-4 text-purple-400 font-semibold">m/z</th>
          <th className="text-left py-3 px-4 text-purple-400 font-semibold">Sezgirlik</th>
          <th className="text-left py-3 px-4 text-purple-400 font-semibold">Fragmentatsiya</th>
          <th className="text-left py-3 px-4 text-purple-400 font-semibold">Izoh</th>
        </tr></thead>
        <tbody>
          {IONIZATION_COMPARISON.map((row, i) => (
            <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20 transition-colors">
              <td className="py-3 px-4"><span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 rounded-full px-2 py-0.5 text-xs font-semibold">{row.method}</span></td>
              <td className="py-3 px-4 text-purple-200 text-xs">{row.observed}</td>
              <td className="py-3 px-4 font-mono text-yellow-400 text-xs">{row.mz}</td>
              <td className="py-3 px-4"><span className={`rounded-full px-2 py-0.5 text-xs ${
                row.sensitivity === "Yuqori" ? "bg-green-600/20 text-green-400 border border-green-600/30" :
                row.sensitivity === "O&apos;rta" ? "bg-yellow-600/20 text-yellow-400 border border-yellow-600/30" :
                "bg-red-600/20 text-red-400 border border-red-600/30"
              }`}>{row.sensitivity}</span></td>
              <td className="py-3 px-4 text-purple-200 text-xs">{row.fragmentation}</td>
              <td className="py-3 px-4 text-purple-400 text-xs">{row.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ASOSIY SAHIFA KOMPONENTI
// ═══════════════════════════════════════════════════════════════════════════════
export default function SisplatinPage() {
  const [activeTab, setActiveTab] = useState("ms")
  const [selectedSpecies, setSelectedSpecies] = useState("pt-m-na")

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Header — orqaga qaytish */}
        <div className="flex items-center gap-4 px-6 py-4 mb-6 border-b border-purple-800/50">
          <Link 
            href="/ilmiy/birikmalar"
            className="hover:bg-purple-800/50 p-2 rounded-xl transition-all border border-purple-500"
            aria-label="Birikmalar ro&apos;yxatiga qaytish"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-white">sis-[PtCl₂(NH₃)₂] — Mass-spektrometrik tahlil</h1>
        </div>

        {/* Hero */}
        <HeroSection />

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-1 bg-purple-900/40 border border-purple-700/50 rounded-2xl p-1.5 mb-6">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-violet-600/40 text-white border border-violet-400/50"
                  : "text-purple-400 hover:text-white hover:bg-purple-800/30"
              }`}
            >
              <span className="mr-1.5">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          
          {activeTab === "ms" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-yellow-400">Mass-spektr</h2>
              <SpeciesSelector selected={selectedSpecies} onSelect={setSelectedSpecies} />
              <MassSpektrGrafik 
                speciesKey={selectedSpecies} 
                lineColor={selectedSpecies === "pt-m-na" ? "#a78bfa" : selectedSpecies === "pt-m" ? "#8b5cf6" : "#c084fc"} 
              />
              <div className="bg-purple-800/30 border border-purple-700/30 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-2">Pt izotop pattern — "barmoq izi"</h3>
                <p className="text-purple-200 text-sm">
                  Pt ning 4 ta barqaror izotopi (¹⁹⁴Pt 32.86%, ¹⁹⁵Pt 33.78%, ¹⁹⁶Pt 25.21%, ¹⁹⁸Pt 7.16%) 
                  va Cl ning 2 ta izotopi (³⁵Cl 75.76%, ³⁷Cl 24.24%) hisobiga murakkab pattern hosil bo&apos;ladi. 
                  z=1 da izotop qadami 1 m/z. Eng intensiv pik ¹⁹⁵Pt+2×³⁵Cl kombinatsiyasidan keladi.
                </p>
              </div>
            </div>
          )}

          {activeTab === "msms" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-yellow-400">MS/MS Fragmentatsiya daraxti</h2>
              <p className="text-purple-400 text-sm">
                Prekursor: m/z = 300 [M]⁺•. CID orqali Cl va NH₃ ketma-ket yo&apos;qoladi. 
                Sis va trans izomerlar fragmentatsiya energiyasi bilan farqlanadi.
              </p>
              <MSMSFragmentTree />
            </div>
          )}

          {activeTab === "isomerism" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-yellow-400">sis vs trans — Geometrik izomeriya</h2>
              <p className="text-purple-400 text-sm">
                Mass-spektrda sis va trans izomerlarni farqlash usullari. IMS, LC-MS va CID energiyasi tahlili.
              </p>
              <SisTransIsomerBlock />
            </div>
          )}

          {activeTab === "adducts" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-yellow-400">Addukt ionlar jadvali</h2>
              <p className="text-purple-400 text-sm">sis-[PtCl₂(NH₃)₂] ESI+ va EI sharoitida hosil qiladigan barcha ion turlari.</p>
              <AdductTable />
            </div>
          )}

          {activeTab === "experimental" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-yellow-400">Eksperimental parametrlar</h2>
              <p className="text-purple-400 text-sm">Agilent 6545 Q-TOF LC/MS. Sisplatin — metall dori, yuqori sezgirlik talab qilinadi.</p>
              <ExperimentalParams />
            </div>
          )}

          {activeTab === "ionization" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-yellow-400">Ionlashtirish usullari taqqoslash</h2>
              <p className="text-purple-400 text-sm">Turli ionlashtirish usullarida sisplatinning mass-spektrdagi ko&apos;rinishi.</p>
              <IonizationComparison />
            </div>
          )}

          {activeTab === "calculator" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-yellow-400">Interaktiv izotop kalkulyatori</h2>
              <p className="text-purple-400 text-sm">Pt va Cl izotoplarini tanlab, izotopik taqsimotni hisoblang. Murakkab pattern!</p>
              <IzotopKalkulyator />
            </div>
          )}
        </div>

        {/* Pastki navigatsiya */}
        <div className="flex justify-between mt-8 pt-6 border-t border-purple-800/50">
          <Link 
            href="/ilmiy/birikmalar/co-nh3-6-cl3"
            className="text-purple-400 hover:text-purple-200 transition-colors text-sm flex items-center gap-2"
          >
            <span>←</span> [Co(NH₃)₆]Cl₃
          </Link>
          <Link 
            href="/ilmiy/birikmalar/ferrosen"
            className="text-purple-400 hover:text-purple-200 transition-colors text-sm"
          >
            Ferrosen →
          </Link>
        </div>
      </div>
    </div>
  )
}