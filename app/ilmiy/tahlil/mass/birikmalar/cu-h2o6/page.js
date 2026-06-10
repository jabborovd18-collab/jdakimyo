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
// IZOTOP MA'LUMOTLARI (NIST standarti)
// ═══════════════════════════════════════════════════════════════════════════════
const ISOTOPES = {
  Cu: [
    { mass: 62.9296, abundance: 69.15, label: "⁶³Cu" },
    { mass: 64.9278, abundance: 30.85, label: "⁶⁵Cu" },
  ],
  O: [
    { mass: 15.9949, abundance: 99.76, label: "¹⁶O" },
    { mass: 17.9992, abundance: 0.20, label: "¹⁸O" },
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
// [Cu(H₂O)₆]²⁺ — ION TURLARI
// ═══════════════════════════════════════════════════════════════════════════════
const ION_SPECIES = {
  "cu-h2o6-2": {
    name: "[Cu(H₂O)₆]²⁺",
    charge: 2,
    formula: "CuH₁₂O₆",
    exactMass: 171.0034,
    description: "Ikki zaryadli kation. ESI+ da m/z = 85.5 da kuzatiladi. Cu²⁺ (d⁹), Yahn-Teller effekti tufayli cho'zilgan oktaedrik geometriya. ⁶³Cu/⁶⁵Cu xarakterli ~2.2:1 nisbat.",
    species: { Cu: 1, O: 6, H: 12 },
    mzDivider: 2,
    isotopicStep: 0.5,
  },
  "cu-h2o5-2": {
    name: "[Cu(H₂O)₅]²⁺",
    charge: 2,
    formula: "CuH₁₀O₅",
    exactMass: 152.9829,
    description: "Bitta suv molekulasi yo'qolgan fragment. m/z = 76.5. Yuqori fragmentorda yoki qizdirilganda kuzatiladi.",
    species: { Cu: 1, O: 5, H: 10 },
    mzDivider: 2,
    isotopicStep: 0.5,
  },
  "cu-h2o4-2": {
    name: "[Cu(H₂O)₄]²⁺",
    charge: 2,
    formula: "CuH₈O₄",
    exactMass: 134.9724,
    description: "Ikkita suv molekulasi yo'qolgan. m/z = 67.5. Past bosimda yoki yuqori energiyada kuzatiladi.",
    species: { Cu: 1, O: 4, H: 8 },
    mzDivider: 2,
    isotopicStep: 0.5,
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// CANVAS MASS-SPEKTR GRAFIGI
// ═══════════════════════════════════════════════════════════════════════════════
function MassSpektrGrafik({ speciesKey = "cu-h2o6-2", lineColor = "#4ade80" }) {
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
  const distribution = calculateIsotopicDistribution(species.species)
  const mzMin = distribution[0]?.mass / species.mzDivider - 1 || 80
  const mzMax = distribution[distribution.length - 1]?.mass / species.mzDivider + 1 || 90

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

    ctx.strokeStyle = "#2a1f3d"; ctx.lineWidth = 0.5
    for (let mz = Math.floor(mzMin * 2) / 2; mz <= Math.ceil(mzMax); mz += 0.5) {
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
    const peakWidth = 0.05

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

    const topPeaks = [...distribution]
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 4)
    
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

      ctx.beginPath(); ctx.strokeStyle = d.probability > 50 ? lineColor : "#7c6a9e"
      ctx.lineWidth = isA ? 2 : 0.8
      ctx.setLineDash(isA ? [] : [2, 2])
      const lh = isA ? 45 : 30
      ctx.moveTo(x, y - 2); ctx.lineTo(x, y - lh); ctx.stroke()
      ctx.setLineDash([])

      ctx.beginPath(); ctx.arc(x, y, isA ? 6 : 4, 0, Math.PI * 2)
      ctx.fillStyle = d.probability > 50 ? lineColor : "#7c6a9e"; ctx.fill()
      if (isA) { ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke() }

      ctx.fillStyle = d.probability > 50 ? lineColor : "#7c6a9e"
      ctx.font = isA ? "bold 11px monospace" : "bold 9px monospace"
      ctx.textAlign = "center"
      ctx.fillText(mz.toFixed(1), x, y - lh - 5)
    })

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

    ctx.strokeStyle = "#3d2a5c"; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(PAD.l, PAD.t); ctx.lineTo(PAD.l, PAD.t + plotH); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(PAD.l, PAD.t + plotH); ctx.lineTo(PAD.l + plotW, PAD.t + plotH); ctx.stroke()

    ctx.fillStyle = "#7c6a9e"; ctx.font = "10px sans-serif"; ctx.textAlign = "center"
    for (let mz = Math.floor(mzMin); mz <= Math.ceil(mzMax); mz += 1) {
      ctx.fillText(mz.toFixed(1), mzToX(mz), PAD.t + plotH + 18)
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
              <div className="h-full bg-green-400 rounded-full transition-all duration-100" style={{ width: `${animProgress * 100}%` }} />
            </div>
            <span className="text-xs text-green-400 font-mono">{Math.round(animProgress * 100)}%</span>
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
                ? "bg-green-600/40 text-white border border-green-400/50"
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
// IZOTOP KALKULYATORI
// ═══════════════════════════════════════════════════════════════════════════════
function IzotopKalkulyator() {
  const [cuIso, setCuIso] = useState("63")
  const [h2oCount, setH2oCount] = useState(6)
  const [result, setResult] = useState(null)

  const calculate = () => {
    const species = { Cu: 1, O: h2oCount, H: h2oCount * 2 }
    const dist = calculateIsotopicDistribution(species)
    const mainPeak = dist.find(d => d.probability > 50) || dist[0]
    setResult({
      mainMz: mainPeak.mass.toFixed(2),
      peaks: dist.filter(d => d.probability > 0.5).slice(0, 6),
      totalPeaks: dist.length,
    })
  }

  useEffect(() => { calculate() }, [cuIso, h2oCount])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-purple-400 text-xs block mb-1">Cu izotopi</label>
          <select value={cuIso} onChange={(e) => setCuIso(e.target.value)} className="w-full bg-purple-800/50 border border-purple-600 rounded-lg px-3 py-2 text-white text-sm">
            <option value="63">⁶³Cu (69.15%)</option>
            <option value="65">⁶⁵Cu (30.85%)</option>
          </select>
        </div>
        <div>
          <label className="text-purple-400 text-xs block mb-1">H₂O soni</label>
          <select value={h2oCount} onChange={(e) => setH2oCount(+e.target.value)} className="w-full bg-purple-800/50 border border-purple-600 rounded-lg px-3 py-2 text-white text-sm">
            <option value={6}>6 ta H₂O</option>
            <option value={5}>5 ta H₂O</option>
            <option value={4}>4 ta H₂O</option>
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
          <p className="text-purple-400 text-xs mt-2">Jami {result.totalPeaks} ta izotopik pik — Cu (2 izotop) klassik ~2.2:1 nisbat</p>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MS/MS FRAGMENTATSIYA DARAXTI — [Cu(H₂O)₆]²⁺
// ═══════════════════════════════════════════════════════════════════════════════
const MSMS_TREE = {
  precursor: { mz: 85.5, label: "[Cu(H₂O)₆]²⁺ (z=2)", intensity: 100 },
  fragments: [
    {
      mz: 76.5,
      label: "[Cu(H₂O)₅]²⁺",
      intensity: 55,
      energy: "8 eV",
      children: [
        { mz: 67.5, label: "[Cu(H₂O)₄]²⁺", intensity: 30, energy: "15 eV" },
        { mz: 58.5, label: "[Cu(H₂O)₃]²⁺", intensity: 15, energy: "22 eV" },
      ]
    },
    {
      mz: 67.5,
      label: "[Cu(H₂O)₄]²⁺",
      intensity: 35,
      energy: "15 eV",
      children: [
        { mz: 58.5, label: "[Cu(H₂O)₃]²⁺", intensity: 20, energy: "22 eV" },
        { mz: 49.5, label: "[Cu(H₂O)₂]²⁺", intensity: 8, energy: "28 eV" },
      ]
    },
    {
      mz: 58.5,
      label: "[Cu(H₂O)₃]²⁺",
      intensity: 22,
      energy: "22 eV",
      children: [
        { mz: 49.5, label: "[Cu(H₂O)₂]²⁺", intensity: 12, energy: "28 eV" },
        { mz: 31.5, label: "[Cu]²⁺", intensity: 5, energy: "35 eV" },
      ]
    },
    {
      mz: 171.0,
      label: "[Cu(H₂O)₆]²⁺ (z=1)",
      intensity: 10,
      energy: "3 eV",
      children: []
    },
  ]
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADDUKT IONLAR JADVALI — [Cu(H₂O)₆]²⁺
// ═══════════════════════════════════════════════════════════════════════════════
const ADDUCT_TABLE = [
  { adduct: "[M]²⁺", mz: 85.5, formula: "[Cu(H₂O)₆]²⁺", mode: "ESI+", abundance: "Eng yuqori" },
  { adduct: "[M−H₂O]²⁺", mz: 76.5, formula: "[Cu(H₂O)₅]²⁺", mode: "ESI+", abundance: "Yuqori" },
  { adduct: "[M−2H₂O]²⁺", mz: 67.5, formula: "[Cu(H₂O)₄]²⁺", mode: "ESI+", abundance: "O&apos;rta" },
  { adduct: "[M+Cl]⁺", mz: 206.5, formula: "[Cu(H₂O)₆Cl]⁺", mode: "ESI+", abundance: "O&apos;rta" },
  { adduct: "[M+NO₃]⁺", mz: 233.5, formula: "[Cu(H₂O)₆NO₃]⁺", mode: "ESI+", abundance: "Past" },
  { adduct: "[M+SO₄]⁻", mz: 267.5, formula: "[Cu(H₂O)₆SO₄]⁻", mode: "ESI−", abundance: "Past" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// EKSPERIMENTAL PARAMETRLAR
// ═══════════════════════════════════════════════════════════════════════════════
const EXPERIMENTAL_PARAMS = {
  instrument: "Agilent 6545 Q-TOF LC/MS",
  ionization: "ESI (+)",
  capillaryVoltage: "3.0 kV",
  nebulizerGas: "N₂, 25 psi",
  dryingGas: "N₂, 6 L/min, 280°C",
  sheathGas: "N₂, 8 L/min, 300°C",
  fragmentor: "60 V",
  skimmer: "40 V",
  massRange: "m/z 40–400",
  resolution: "~40,000 (FWHM)",
  accuracy: "&lt; 2 ppm",
  solvent: "H₂O (deionizatsiyalangan), pH ~5",
  concentration: "10 μM (CuSO₄·5H₂O)",
  flowRate: "0.2 mL/min",
  internalStandard: "[Co(NH₃)₆]Cl₃ — m/z 53.7 [M]³⁺",
  lod: "0.02 μM (S/N &gt; 3)",
  loq: "0.08 μM (S/N &gt; 10)",
}

// ═══════════════════════════════════════════════════════════════════════════════
// IONLASHTIRISH USULLARI TAQQOSLASH
// ═══════════════════════════════════════════════════════════════════════════════
const IONIZATION_COMPARISON = [
  {
    method: "ESI (+)",
    observed: "[Cu(H₂O)₆]²⁺, [Cu(H₂O)₅]²⁺",
    mz: "85.5, 76.5",
    sensitivity: "Yuqori",
    fragmentation: "Minimal",
    notes: "Soft ionization. Suvli eritmada bevosita akvakompleks kuzatiladi. Eng yaxshi usul.",
  },
  {
    method: "ESI (+) yuqori fragmentor",
    observed: "[Cu(H₂O)₄]²⁺, [Cu(H₂O)₃]²⁺",
    mz: "67.5, 58.5",
    sensitivity: "O&apos;rta",
    fragmentation: "O&apos;rta",
    notes: "Fragmentor >150 V da suv molekulalari ketma-ket yo'qoladi.",
  },
  {
    method: "MALDI−TOF",
    observed: "[Cu(H₂O)₄]²⁺, [Cu]²⁺",
    mz: "67.5, 31.5",
    sensitivity: "Past",
    fragmentation: "Yuqori",
    notes: "Matritsa ta'sirida suv molekulalari yo'qoladi. Akvakomplekslar uchun noqulay.",
  },
  {
    method: "EI (70 eV)",
    observed: "Cu⁺, Cu²⁺",
    mz: "63, 31.5",
    sensitivity: "Juda past",
    fragmentation: "To'liq",
    notes: "Akvakompleks EI da kuzatilmaydi — suv bug'lanadi.",
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// INTERNAL STANDARD
// ═══════════════════════════════════════════════════════════════════════════════
const INTERNAL_STANDARD = {
  name: "[Co(NH₃)₆]Cl₃",
  formula: "CoH₁₈N₆Cl₃",
  exactMass: 266.0258,
  mainIon: "[Co(NH₃)₆]³⁺",
  mz: 53.7,
  usage: "Tashqi kalibrlash va Cu akvakomplekslari uchun standart",
  concentration: "5 μM (har bir namunaga qo&apos;shiladi)",
  advantage: "Co³⁺ kompleksi — Cu²⁺ kompleksidan farqli zaryad (z=3 vs z=2). Spektrda ajralib turadi.",
}

// ═══════════════════════════════════════════════════════════════════════════════
// YAHN-TELLER EFFEKTI BLOKI
// ═══════════════════════════════════════════════════════════════════════════════
const JAHN_TELLER_INFO = {
  title: "Yahn-Teller effekti — Cu²⁺ (d⁹) oktaedrik komplekslarda",
  explanation: "Cu²⁺ (d⁹) elektron konfiguratsiyasida eg orbitallarda 3 ta elektron — degeneratsiya Yahn-Teller teoremasiga ko'ra bartaraf qilinadi. Oktaedr z o'qi bo'yicha cho'ziladi: 4 ta ekvatorial bog' qisqa (~1.95 Å), 2 ta aksial bog' uzun (~2.30 Å).",
  properties: [
    "Elektron konfiguratsiya: d⁹ — bitta toq elektron, S = 1/2",
    "Geometriya: cho'zilgan oktaedr (D₄h simmetriya)",
    "Ekvatorial Cu−OH₂: ~1.95 Å, Aksial Cu−OH₂: ~2.30 Å",
    "Magnit momenti: μ ≈ 1.73 BM",
    "Rang: ko'k — ²Eg → ²T₂g d−d o'tish",
    "Suv almashinishi tez — kinetik labil",
  ],
  massSpecInsight: "Mass-spektrda Cu izotoplari (⁶³Cu 69%, ⁶⁵Cu 31%) tufayli ikkita pik ~2.2:1 nisbatda kuzatiladi. z=2 da izotop qadami 0.5 m/z — ikkala pik orasidagi farq 1.0 m/z. Cu borligi shubhasiz tasdiqlanadi.",
}

// ═══════════════════════════════════════════════════════════════════════════════
// HERO SECTION
// ═══════════════════════════════════════════════════════════════════════════════
function HeroSection() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-950 via-emerald-900 to-blue-950 border border-green-700/50 p-8 md:p-12 mb-10">
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 text-sm text-purple-400 mb-6">
          <Link href="/" className="hover:text-purple-200 transition-colors">Bosh sahifa</Link>
          <span>/</span>
          <Link href="/ilmiy/birikmalar" className="hover:text-purple-200 transition-colors">Birikmalar</Link>
          <span>/</span>
          <span className="text-yellow-400">[Cu(H₂O)₆]²⁺</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white">[Cu(H₂O)₆]²⁺</h1>
          <div className="flex flex-wrap gap-2">
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 rounded-full px-3 py-1 text-xs font-semibold">
              Akvakompleks
            </span>
            <span className="bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 rounded-full px-3 py-1 text-xs">
              Geksaakvamis(II)
            </span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-full px-3 py-1 text-xs">
              d⁹ — Yahn-Teller
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Molekulyar massa", value: "171.66 g/mol" },
            { label: "Aniq massa", value: "171.0034 Da" },
            { label: "Oksidlanish darajasi", value: "Cu²⁺ (d⁹)" },
            { label: "Geometriya", value: "Cho'zilgan oktaedr" },
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
            <span className="font-mono text-lg">m/z = 85.5</span>{" "}
            <span className="text-purple-400">[Cu(H₂O)₆]²⁺ (z=2)</span>
          </p>
          <p className="text-purple-400 text-xs mt-1">
            Cu izotoplari: ⁶³Cu (69%) va ⁶⁵Cu (31%) — klassik ~2.2:1 nisbat
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
  { id: "jahn-teller", label: "Yahn-Teller effekti", icon: "🔷" },
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
                ? "bg-green-600/20 border-green-500/50"
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
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"
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
          CID (Collision-Induced Dissociation) — N₂ gazi, 3–35 eV. Suv molekulalari ketma-ket yo&apos;qoladi.
        </p>
      </div>

      <h3 className="text-white font-semibold">Fragment ionlar</h3>
      <div className="space-y-2">
        {MSMS_TREE.fragments.map((fragment, idx) => (
          renderFragment(fragment, 0, idx === MSMS_TREE.fragments.length - 1)
        ))}
      </div>

      {selectedNode && (
        <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-4 mt-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono font-bold text-green-400">
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
// YAHN-TELLER EFFEKTI BLOKI
// ═══════════════════════════════════════════════════════════════════════════════
function JahnTellerBlock() {
  return (
    <div className="space-y-4">
      <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-4">
        <h3 className="text-green-400 font-semibold flex items-center gap-2">
          <span>🔷</span> {JAHN_TELLER_INFO.title}
        </h3>
        <p className="text-purple-200 mt-2 text-sm">{JAHN_TELLER_INFO.explanation}</p>
      </div>

      <div className="bg-purple-800/30 border border-purple-700/30 rounded-xl p-4">
        <h3 className="text-white font-semibold mb-3">Xossalari</h3>
        <ul className="text-purple-200 text-sm space-y-2">
          {JAHN_TELLER_INFO.properties.map((point, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-green-400 font-bold">•</span>
              {point}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-purple-800/30 border border-purple-700/30 rounded-xl p-4">
        <h3 className="text-white font-semibold mb-2">Mass-spektrometrik dalil</h3>
        <p className="text-purple-200 text-sm">{JAHN_TELLER_INFO.massSpecInsight}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-4">
          <h3 className="text-green-400 font-semibold text-sm mb-2">[Cu(H₂O)₆]²⁺ — Yahn-Teller faol</h3>
          <ul className="text-purple-200 text-xs space-y-1">
            <li>• d⁹ — eg orbitallar degeneratsiyasi</li>
            <li>• Cho&apos;zilgan oktaedr (D₄h)</li>
            <li>• 4 ta qisqa + 2 ta uzun bog&apos;</li>
            <li>• Ko&apos;k rang — ²Eg → ²T₂g</li>
            <li>• Suv almashinishi tez — labil</li>
          </ul>
        </div>
        <div className="bg-purple-800/30 border border-purple-700/30 rounded-xl p-4">
          <h3 className="text-purple-300 font-semibold text-sm mb-2">[Ni(H₂O)₆]²⁺ — Yahn-Teller nofaol</h3>
          <ul className="text-purple-200 text-xs space-y-1">
            <li>• d⁸ — eg orbitallar simmetrik to&apos;lgan</li>
            <li>• Muntazam oktaedr (Oh)</li>
            <li>• Barcha bog&apos;lar teng</li>
            <li>• Yashil rang</li>
            <li>• Suv almashinishi sekin — inert</li>
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
        * m/z = 85.5 [Cu(H₂O)₆]²⁺ eng dominant (z=2). Cu izotoplari ⁶³Cu/⁶⁵Cu ~2.2:1.
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
export default function CuH2O6Page() {
  const [activeTab, setActiveTab] = useState("ms")
  const [selectedSpecies, setSelectedSpecies] = useState("cu-h2o6-2")

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
          <h1 className="text-xl font-bold text-white">[Cu(H₂O)₆]²⁺ — Mass-spektrometrik tahlil</h1>
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
                  ? "bg-green-600/40 text-white border border-green-400/50"
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
                lineColor={selectedSpecies === "cu-h2o6-2" ? "#4ade80" : selectedSpecies === "cu-h2o5-2" ? "#22c55e" : "#16a34a"} 
              />
              <div className="bg-purple-800/30 border border-purple-700/30 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-2">Cu izotop pattern — klassik 2:1</h3>
                <p className="text-purple-200 text-sm">
                  Cu ning 2 ta barqaror izotopi: ⁶³Cu (69.15%) va ⁶⁵Cu (30.85%). 
                  z=2 da izotop qadami 0.5 m/z — ikkala pik orasidagi farq 1.0 m/z.
                  [Cu(H₂O)₆]²⁺ (m/z=85.5) va [Cu(H₂O)₅]²⁺ (m/z=76.5) asosiy ionlar.
                </p>
              </div>
            </div>
          )}

          {activeTab === "msms" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-yellow-400">MS/MS Fragmentatsiya daraxti</h2>
              <p className="text-purple-400 text-sm">
                Prekursor: m/z = 85.5 [Cu(H₂O)₆]²⁺. CID orqali suv molekulalari ketma-ket yo&apos;qoladi.
              </p>
              <MSMSFragmentTree />
            </div>
          )}

          {activeTab === "jahn-teller" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-yellow-400">Yahn-Teller effekti</h2>
              <p className="text-purple-400 text-sm">
                Cu²⁺ (d⁹) — oktaedrik komplekslarda Yahn-Teller cho&apos;zilishi. [Ni(H₂O)₆]²⁺ bilan taqqoslash.
              </p>
              <JahnTellerBlock />
            </div>
          )}

          {activeTab === "adducts" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-yellow-400">Addukt ionlar jadvali</h2>
              <p className="text-purple-400 text-sm">[Cu(H₂O)₆]²⁺ ESI+ sharoitida hosil qiladigan barcha ion turlari.</p>
              <AdductTable />
            </div>
          )}

          {activeTab === "experimental" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-yellow-400">Eksperimental parametrlar</h2>
              <p className="text-purple-400 text-sm">Agilent 6545 Q-TOF LC/MS. Past fragmentor — suv molekulalari oson yo&apos;qoladi.</p>
              <ExperimentalParams />
            </div>
          )}

          {activeTab === "ionization" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-yellow-400">Ionlashtirish usullari taqqoslash</h2>
              <p className="text-purple-400 text-sm">Turli ionlashtirish usullarida [Cu(H₂O)₆]²⁺ ning mass-spektrdagi ko&apos;rinishi.</p>
              <IonizationComparison />
            </div>
          )}

          {activeTab === "calculator" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-yellow-400">Interaktiv izotop kalkulyatori</h2>
              <p className="text-purple-400 text-sm">Cu izotoplari va H₂O sonini tanlab, izotopik taqsimotni hisoblang.</p>
              <IzotopKalkulyator />
            </div>
          )}
        </div>

        {/* Pastki navigatsiya */}
        <div className="flex justify-between mt-8 pt-6 border-t border-purple-800/50">
          <Link 
            href="/ilmiy/birikmalar/ni-cn4"
            className="text-purple-400 hover:text-purple-200 transition-colors text-sm flex items-center gap-2"
          >
            <span>←</span> [Ni(CN)₄]²⁻
          </Link>
          <Link 
            href="/ilmiy/birikmalar/ag-nh3-2"
            className="text-purple-400 hover:text-purple-200 transition-colors text-sm"
          >
            [Ag(NH₃)₂]⁺ →
          </Link>
        </div>
      </div>
    </div>
  )
}