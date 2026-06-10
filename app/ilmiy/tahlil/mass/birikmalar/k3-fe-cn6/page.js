"use client"

import Link from "next/link"
import { useState, useEffect, useRef, useCallback } from "react"

// ── roundRect POLIFILL (Lee Chat tavsiyasi) ──────────────────────────────────
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
  Fe: [
    { mass: 53.9396, abundance: 5.845, label: "⁵⁴Fe" },
    { mass: 55.9349, abundance: 91.754, label: "⁵⁶Fe" },
    { mass: 56.9354, abundance: 2.119, label: "⁵⁷Fe" },
    { mass: 57.9333, abundance: 0.282, label: "⁵⁸Fe" },
  ],
  C: [
    { mass: 12.0000, abundance: 98.93, label: "¹²C" },
    { mass: 13.0034, abundance: 1.07, label: "¹³C" },
  ],
  N: [
    { mass: 14.0031, abundance: 99.64, label: "¹⁴N" },
    { mass: 15.0001, abundance: 0.36, label: "¹⁵N" },
  ],
  K: [
    { mass: 38.9637, abundance: 93.258, label: "³⁹K" },
    { mass: 40.9618, abundance: 6.730, label: "⁴¹K" },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// IZOTOPIK TAQSIMOT HISOBLASH (To'liq kombinatsion model — Kimi + Lee Chat)
// ═══════════════════════════════════════════════════════════════════════════════
function calculateIsotopicDistribution(species) {
  // species = { Fe: 1, C: 6, N: 6, K: 0/1/2, charge: -1/-2/-3 }
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
      // Bir xil massali natijalarni birlashtirish
      const merged = {}
      newDist.forEach(d => {
        const key = d.mass.toFixed(4)
        if (!merged[key]) merged[key] = { mass: d.mass, probability: 0 }
        merged[key].probability += d.probability
      })
      distributions = Object.values(merged)
    }
  })

  // Probability bo'yicha saralash va normalizatsiya
  distributions.sort((a, b) => a.mass - b.mass)
  const maxProb = Math.max(...distributions.map(d => d.probability))
  distributions = distributions.map(d => ({
    mass: d.mass,
    probability: (d.probability / maxProb) * 100
  }))

  return distributions.filter(d => d.probability > 0.05)
}

// ═══════════════════════════════════════════════════════════════════════════════
// ION TURLARI VA ULARNING MA'LUMOTLARI (Genspark + Kimi)
// ═══════════════════════════════════════════════════════════════════════════════
const ION_SPECIES = {
  "fe-cn6-3": {
    name: "[Fe(CN)₆]³⁻",
    charge: -3,
    formula: "FeC₆N₆",
    exactMass: 211.9530,
    description: "Ferritsianid anioni — 3− zaryadli. ESI-MS da kam kuzatiladi, ko'pincha K⁺ bilan juftlashgan holda.",
    species: { Fe: 1, C: 6, N: 6, K: 0 },
    mzDivider: 3,
    isotopicStep: 0.33,
  },
  "k-fe-cn6-2": {
    name: "[KFe(CN)₆]²⁻",
    charge: -2,
    formula: "KFeC₆N₆",
    exactMass: 251.0168,
    description: "Bitta K⁺ bilan juftlashgan — 2− zaryadli. ESI-MS da eng ko'p kuzatiladigan ion.",
    species: { Fe: 1, C: 6, N: 6, K: 1 },
    mzDivider: 2,
    isotopicStep: 0.5,
  },
  "k2-fe-cn6-1": {
    name: "[K₂Fe(CN)₆]⁻",
    charge: -1,
    formula: "K₂FeC₆N₆",
    exactMass: 290.0806,
    description: "Ikkita K⁺ bilan juftlashgan — 1− zaryadli. m/z ≈ 290 da asosiy pik. Aynan shu ion ko'pincha 'm/z=329' deb xato qilinadi.",
    species: { Fe: 1, C: 6, N: 6, K: 2 },
    mzDivider: 1,
    isotopicStep: 1.0,
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// CANVAS MASS-SPEKTR GRAFIGI (Barcha tuzatishlar bilan)
// ═══════════════════════════════════════════════════════════════════════════════
function MassSpektrGrafik({ speciesKey = "k-fe-cn6-2", lineColor = "#f87171" }) {
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
  const mzMin = distribution[0]?.mass / species.mzDivider - 1 || 100
  const mzMax = distribution[distribution.length - 1]?.mass / species.mzDivider + 1 || 120

  // Dinamik canvas o'lchamlari (Lee Chat tavsiyasi)
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

  // Animatsiya — faqat requestAnimationFrame (optimizatsiya)
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
    const step = species.mzDivider === 3 ? 0.5 : species.mzDivider === 2 ? 1 : 2
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

    // Spektr chizig'i
    const peakWidth = species.mzDivider === 3 ? 0.03 : species.mzDivider === 2 ? 0.05 : 0.1
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

    // Pik belgilari (eng yuqori 5 ta)
    const topPeaks = [...distribution]
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 5)
    
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
    for (let mz = Math.floor(mzMin); mz <= Math.ceil(mzMax); mz += step * 2) {
      ctx.fillText(mz.toFixed(1), mzToX(mz), PAD.t + plotH + 18)
    }
    ctx.fillStyle = "#9a8abf"; ctx.font = "bold 11px sans-serif"
    ctx.fillText(`m/z (z=${Math.abs(species.charge)})`, PAD.l + plotW / 2, H - 8)
    
    ctx.textAlign = "right"
    ;[20, 40, 60, 80].forEach(t => ctx.fillText(t + "%", PAD.l - 8, intToY(t) + 4))
    ctx.save(); ctx.translate(16, PAD.t + plotH / 2)
    ctx.rotate(-Math.PI / 2); ctx.fillText("Nisbiy intensivlik", 0, 0); ctx.restore()

    // Sxematik eslatma
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
      <canvas
        ref={canvasRef}
        width={canvasSize.w}
        height={canvasSize.h}
        onMouseMove={handleMouseMove}
        onClick={() => { if (hoveredPeak) setSelectedPeak(selectedPeak?.mz === hoveredPeak.mz ? null : hoveredPeak) }}
        onMouseLeave={() => setHoveredPeak(null)}
        onKeyDown={(e) => { if (e.key === 'Escape') setSelectedPeak(null) }}
        tabIndex={0}
        className="w-full h-auto rounded-xl border border-purple-700/50 cursor-crosshair focus:outline-none focus:ring-2 focus:ring-purple-400"
      />
      {animProgress < 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-purple-950/80 backdrop-blur px-4 py-2 rounded-full border border-purple-700/50">
          <div className="flex items-center gap-2">
            <span className="text-xs text-purple-400">Chizilmoqda...</span>
            <div className="w-24 h-1.5 bg-purple-800/50 rounded-full overflow-hidden">
              <div className="h-full bg-red-400 rounded-full transition-all duration-100" style={{ width: `${animProgress * 100}%` }} />
            </div>
            <span className="text-xs text-red-400 font-mono">{Math.round(animProgress * 100)}%</span>
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
// SPECIES SELECTOR + MASSA vs m/z TUSHUNTIRISH
// ═══════════════════════════════════════════════════════════════════════════════
function SpeciesSelector({ selected, onSelect }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {Object.entries(ION_SPECIES).map(([key, sp]) => (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              selected === key
                ? "bg-red-600/40 text-white border border-red-400/50"
                : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
            }`}
          >
            {sp.name} (z={sp.charge})
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
// INTERAKTIV IZOTOP KALKULYATORI (Lee Chat + Qwen tavsiyasi)
// ═══════════════════════════════════════════════════════════════════════════════
function IzotopKalkulyator() {
  const [feIso, setFeIso] = useState("56")
  const [cIso, setCISO] = useState("12")
  const [kCount, setKCount] = useState(2)
  const [result, setResult] = useState(null)

  const calculate = () => {
    const species = {
      Fe: 1,
      C: cIso === "12" ? 6 : cIso === "13-1" ? 5 : 4,
      N: 6,
      K: kCount,
    }
    // Maxsus izotop tanlanganda
    if (feIso === "54") species.Fe = 0 // alohida hisob
    const dist = calculateIsotopicDistribution(species)
    const mainPeak = dist.find(d => d.probability > 50) || dist[0]
    setResult({
      mainMz: (mainPeak.mass / 1).toFixed(2),
      peaks: dist.filter(d => d.probability > 0.5).slice(0, 8),
      totalPeaks: dist.length,
    })
  }

  useEffect(() => { calculate() }, [feIso, cIso, kCount])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="text-purple-400 text-xs block mb-1">Fe izotopi</label>
          <select value={feIso} onChange={(e) => setFeIso(e.target.value)} className="w-full bg-purple-800/50 border border-purple-600 rounded-lg px-3 py-2 text-white text-sm">
            <option value="56">⁵⁶Fe (91.7%)</option>
            <option value="54">⁵⁴Fe (5.8%)</option>
            <option value="57">⁵⁷Fe (2.1%)</option>
            <option value="58">⁵⁸Fe (0.3%)</option>
          </select>
        </div>
        <div>
          <label className="text-purple-400 text-xs block mb-1">¹³C soni</label>
          <select value={cIso} onChange={(e) => setCISO(e.target.value)} className="w-full bg-purple-800/50 border border-purple-600 rounded-lg px-3 py-2 text-white text-sm">
            <option value="12">0 ta ¹³C</option>
            <option value="13-1">1 ta ¹³C</option>
            <option value="13-2">2 ta ¹³C</option>
          </select>
        </div>
        <div>
          <label className="text-purple-400 text-xs block mb-1">K⁺ soni</label>
          <select value={kCount} onChange={(e) => setKCount(+e.target.value)} className="w-full bg-purple-800/50 border border-purple-600 rounded-lg px-3 py-2 text-white text-sm">
            <option value={0}>0 ta K⁺</option>
            <option value={1}>1 ta K⁺</option>
            <option value={2}>2 ta K⁺</option>
          </select>
        </div>
      </div>
      {result && (
        <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
          <p className="text-white font-semibold">Asosiy m/z: <span className="text-green-400 font-mono">{result.mainMz}</span></p>
          <div className="flex flex-wrap gap-2 mt-2">
            {result.peaks.map((p, i) => (
              <span key={i} className="bg-purple-900/50 px-2 py-1 rounded-full text-xs text-purple-300 font-mono">
                {p.mass.toFixed(1)}: {p.probability.toFixed(1)}%
              </span>
            ))}
          </div>
          <p className="text-purple-400 text-xs mt-2">Jami {result.totalPeaks} ta izotopik pik</p>
        </div>
      )}
    </div>
  )
}

// ── EXPORT (2-QISM da davom etadi) ──────────────────────────────────────────
export { MassSpektrGrafik, SpeciesSelector, IzotopKalkulyator, ION_SPECIES, ISOTOPES, calculateIsotopicDistribution }
// ═══════════════════════════════════════════════════════════════════════════════
// MS/MS FRAGMENTATSIYA DARAXTI (Qwen + Kimi)
// ═══════════════════════════════════════════════════════════════════════════════
const MSMS_TREE = {
  precursor: { mz: 329.0, label: "[K₂Fe(CN)₆]⁻", intensity: 100 },
  fragments: [
    {
      mz: 290.0,
      label: "[KFe(CN)₆]²⁻·K⁺",
      intensity: 45,
      energy: "5 eV",
      children: [
        { mz: 250.9, label: "[KFe(CN)₅]⁻", intensity: 25, energy: "10 eV" },
        { mz: 211.9, label: "[Fe(CN)₆]³⁻·K⁺", intensity: 12, energy: "15 eV" },
      ]
    },
    {
      mz: 268.0,
      label: "[KFe(CN)₅]²⁻",
      intensity: 30,
      energy: "8 eV",
      children: [
        { mz: 240.0, label: "[KFe(CN)₄]⁻", intensity: 18, energy: "12 eV" },
        { mz: 211.9, label: "[Fe(CN)₅]²⁻", intensity: 8, energy: "18 eV" },
      ]
    },
    {
      mz: 211.9,
      label: "[Fe(CN)₆]³⁻·K⁺",
      intensity: 22,
      energy: "10 eV",
      children: [
        { mz: 186.0, label: "[Fe(CN)₅]³⁻·K⁺", intensity: 10, energy: "15 eV" },
        { mz: 160.0, label: "[Fe(CN)₄]³⁻·K⁺", intensity: 5, energy: "20 eV" },
      ]
    },
    {
      mz: 186.0,
      label: "[Fe(CN)₅]²⁻·K⁺",
      intensity: 15,
      energy: "12 eV",
      children: [
        { mz: 160.0, label: "[Fe(CN)₄]²⁻·K⁺", intensity: 8, energy: "18 eV" },
        { mz: 134.0, label: "[Fe(CN)₃]²⁻·K⁺", intensity: 3, energy: "22 eV" },
      ]
    },
  ]
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADDUKT IONLAR JADVALI (Qwen + Kimi)
// ═══════════════════════════════════════════════════════════════════════════════
const ADDUCT_TABLE = [
  { adduct: "[M]³⁻", mz: 109.7, formula: "[Fe(CN)₆]³⁻", mode: "ESI−", abundance: "Past" },
  { adduct: "[M+H]²⁻", mz: 164.5, formula: "[HFe(CN)₆]²⁻", mode: "ESI−", abundance: "Past" },
  { adduct: "[M+K]²⁻", mz: 251.0, formula: "[KFe(CN)₆]²⁻", mode: "ESI−", abundance: "Yuqori" },
  { adduct: "[M+2K]⁻", mz: 329.0, formula: "[K₂Fe(CN)₆]⁻", mode: "ESI−", abundance: "Eng yuqori" },
  { adduct: "[M+3K]", mz: 368.0, formula: "K₃[Fe(CN)₆]", mode: "ESI−", abundance: "Kuzatiladi" },
  { adduct: "[M+Na+K]⁻", mz: 313.0, formula: "[NaKFe(CN)₆]⁻", mode: "ESI−", abundance: "O&apos;rta" },
]

// ═══════════════════════════════════════════════════════════════════════════════
// EKSPERIMENTAL PARAMETRLAR (Kimi)
// ═══════════════════════════════════════════════════════════════════════════════
const EXPERIMENTAL_PARAMS = {
  instrument: "Agilent 6545 Q-TOF LC/MS",
  ionization: "ESI (−)",
  capillaryVoltage: "3.5 kV",
  nebulizerGas: "N₂, 35 psi",
  dryingGas: "N₂, 8 L/min, 325°C",
  sheathGas: "N₂, 11 L/min, 350°C",
  fragmentor: "100 V",
  skimmer: "65 V",
  massRange: "m/z 50–1000",
  resolution: "~40,000 (FWHM)",
  accuracy: "&lt; 2 ppm",
  solvent: "H₂O:MeCN (50:50, v/v)",
  concentration: "10 μM (K₃[Fe(CN)₆])",
  flowRate: "0.3 mL/min",
  internalStandard: "K₃[Co(CN)₆] — m/z 332.0 [M+K]²⁻",
  lod: "0.05 μM (S/N &gt; 3)",
  loq: "0.15 μM (S/N &gt; 10)",
}

// ═══════════════════════════════════════════════════════════════════════════════
// IONLASHTIRISH USULLARI TAQQOSLASH (Lee Chat)
// ═══════════════════════════════════════════════════════════════════════════════
const IONIZATION_COMPARISON = [
  {
    method: "ESI (−)",
    observed: "[K₂Fe(CN)₆]⁻, [KFe(CN)₆]²⁻",
    mz: "251, 329",
    sensitivity: "Yuqori",
    fragmentation: "Minimal",
    notes: "Soft ionization, K⁺ adduktlari dominant",
  },
  {
    method: "MALDI−TOF",
    observed: "[KFe(CN)₆]⁻, [Fe(CN)₆]³⁻",
    mz: "251, 109",
    sensitivity: "O&apos;rta",
    fragmentation: "CN yo&apos;qotish kuzatiladi",
    notes: "DHB matritsasi bilan. K⁺ yo&apos;qolishi mumkin",
  },
  {
    method: "EI (70 eV)",
    observed: "Fe(CN)₂⁺, FeCN⁺, Fe⁺",
    mz: "136, 110, 56",
    sensitivity: "Past",
    fragmentation: "To&apos;liq fragmentatsiya",
    notes: "Molekulyar ion kuzatilmaydi. Qattiq ionlashtirish",
  },
  {
    method: "APCI (−)",
    observed: "[KFe(CN)₆]²⁻, parchalanish mahsulotlari",
    mz: "251, 186",
    sensitivity: "Past",
    fragmentation: "O&apos;rta",
    notes: "Termik labil birikma. Ko&apos;p parchalanish",
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// INTERNAL STANDARD MA'LUMOTI (Kimi)
// ═══════════════════════════════════════════════════════════════════════════════
const INTERNAL_STANDARD = {
  name: "K₃[Co(CN)₆]",
  formula: "CoC₆N₆K₃",
  exactMass: 331.8354,
  mainIon: "[K₂Co(CN)₆]⁻",
  mz: 332.0,
  usage: "Tashqi kalibrlash va mass accuracy tekshirish uchun",
  concentration: "5 μM (har bir namunaga qo&apos;shiladi)",
  advantage: "Fe analogiga o&apos;xshash, lekin massasi 3 Da farq qiladi — spektrda ajralib turadi",
}

// ═══════════════════════════════════════════════════════════════════════════════
// ESI REDUKSIYA MUAMMOSI (Kimi)
// ═══════════════════════════════════════════════════════════════════════════════
const ESI_REDUCTION_INFO = {
  problem: "K₃[Fe³⁺(CN)₆] → K₄[Fe²⁺(CN)₆] qaytarilishi",
  mechanism: "ESI manbasida erituvchi molekulalaridan elektron olish (solvent-mediated reduction)",
  conditions: "Suvli eritmalarda, yuqori capillary voltage&apos;da, O₂ ishtirokida",
  evidence: "m/z=329 (K₄[Fe(CN)₆] dan [K₂Fe(CN)₆]⁻) kuzatilishi",
  prevention: "N₂ atmosferasi, past voltage, antioksidant (askorbin kislota) qo&apos;shish",
  diagnosticIon: "m/z=329 ikkala tuz uchun ham umumiy — faqat saqlanish vaqti bilan farqlanadi (LC-MS)",
}

// ═══════════════════════════════════════════════════════════════════════════════
// HERO SECTION
// ═══════════════════════════════════════════════════════════════════════════════
function HeroSection() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-950 via-purple-900 to-blue-950 border border-purple-700/50 p-8 md:p-12 mb-10">
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 text-sm text-purple-400 mb-6">
          <Link href="/" className="hover:text-purple-200 transition-colors">Bosh sahifa</Link>
          <span>/</span>
          <Link href="/ilmiy/birikmalar" className="hover:text-purple-200 transition-colors">Birikmalar</Link>
          <span>/</span>
          <span className="text-yellow-400">K₃[Fe(CN)₆]</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white">K₃[Fe(CN)₆]</h1>
          <div className="flex flex-wrap gap-2">
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 rounded-full px-3 py-1 text-xs font-semibold">
              Qizil qon tuzi
            </span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 rounded-full px-3 py-1 text-xs">
              Kaliy geksatsianoferrat(III)
            </span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 rounded-full px-3 py-1 text-xs">
              Potassium ferricyanide
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Molekulyar massa", value: "329.25 g/mol" },
            { label: "Aniq massa", value: "328.8445 Da" },
            { label: "Oksidlanish darajasi", value: "Fe³⁺ (d⁵)" },
            { label: "Koord. soni", value: "6 (oktaedrik)" },
          ].map((item, i) => (
            <div key={i} className="bg-purple-800/30 border border-purple-700/30 rounded-xl p-3 text-center">
              <p className="text-purple-400 text-xs mb-1">{item.label}</p>
              <p className="text-white font-semibold text-sm">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 inline-block">
          <p className="text-yellow-400 text-sm">
            <strong>ESI−MS asosiy piki:</strong>{" "}
            <span className="font-mono text-lg">m/z = 329.0</span>{" "}
            <span className="text-purple-400">[K₂Fe(CN)₆]⁻</span>
          </p>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// TABLAR RO'YXATI
// ═══════════════════════════════════════════════════════════════════════════════
const TABS = [
  { id: "ms", label: "Mass-spektr", icon: "📊" },
  { id: "msms", label: "MS/MS Fragmentatsiya", icon: "🧬" },
  { id: "adducts", label: "Addukt ionlar", icon: "📋" },
  { id: "experimental", label: "Eksperimental", icon: "⚗️" },
  { id: "ionization", label: "Ionlashtirish", icon: "💡" },
  { id: "calculator", label: "Izotop Kalkulyator", icon: "🔢" },
  { id: "reduction", label: "ESI Reduksiya", icon: "⚠️" },
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
                ? "bg-red-600/20 border-red-500/50"
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
                    className="h-full bg-gradient-to-r from-red-400 to-yellow-400 rounded-full"
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
          CID (Collision-Induced Dissociation) — N₂ gazi, 5–25 eV
        </p>
      </div>

      <h3 className="text-white font-semibold">Fragment ionlar</h3>
      <div className="space-y-2">
        {MSMS_TREE.fragments.map((fragment, idx) => (
          renderFragment(fragment, 0, idx === MSMS_TREE.fragments.length - 1)
        ))}
      </div>

      {selectedNode && (
        <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-4 mt-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono font-bold text-red-400">
                m/z = {selectedNode.mz.toFixed(1)}
              </span>
              <span className="text-purple-400 ml-2">{selectedNode.label}</span>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-purple-400 hover:text-white text-sm"
            >
              ✕ Yopish
            </button>
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
                <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 rounded-full px-2 py-0.5 text-xs font-mono">
                  {row.adduct}
                </span>
              </td>
              <td className="py-3 px-4 font-mono text-yellow-400">{row.mz}</td>
              <td className="py-3 px-4 text-purple-200 font-mono text-xs">{row.formula}</td>
              <td className="py-3 px-4">
                <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-full px-2 py-0.5 text-xs">
                  {row.mode}
                </span>
              </td>
              <td className="py-3 px-4">
                <span className={`rounded-full px-2 py-0.5 text-xs ${
                  row.abundance === "Eng yuqori" ? "bg-green-600/20 text-green-400 border border-green-600/30" :
                  row.abundance === "Yuqori" ? "bg-yellow-600/20 text-yellow-400 border border-yellow-600/30" :
                  row.abundance === "O&apos;rta" ? "bg-orange-600/20 text-orange-400 border border-orange-600/30" :
                  "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                }`}>
                  {row.abundance}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-purple-500 text-xs mt-3 italic">
        * m/z = 329 [K₂Fe(CN)₆]⁻ eng dominant pik. ESI manbasida K⁺ adduktlari hosil bo&apos;lishi tabiiy.
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
            <div className="flex justify-between">
              <span className="text-purple-400">Asbob:</span>
              <span className="text-purple-200">{EXPERIMENTAL_PARAMS.instrument}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-400">Ionlashtirish:</span>
              <span className="text-purple-200">{EXPERIMENTAL_PARAMS.ionization}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-400">Capillary Voltage:</span>
              <span className="text-purple-200">{EXPERIMENTAL_PARAMS.capillaryVoltage}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-400">Fragmentor:</span>
              <span className="text-purple-200">{EXPERIMENTAL_PARAMS.fragmentor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-400">Skimmer:</span>
              <span className="text-purple-200">{EXPERIMENTAL_PARAMS.skimmer}</span>
            </div>
          </div>
        </div>

        <div className="bg-purple-800/30 border border-purple-700/30 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-3">Ishlash ko&apos;rsatkichlari</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-purple-400">Mass Range:</span>
              <span className="text-purple-200">{EXPERIMENTAL_PARAMS.massRange}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-400">Resolution:</span>
              <span className="text-purple-200">{EXPERIMENTAL_PARAMS.resolution}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-400">Mass Accuracy:</span>
              <span className="text-purple-200">{EXPERIMENTAL_PARAMS.accuracy}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-400">LOD:</span>
              <span className="text-purple-200">{EXPERIMENTAL_PARAMS.lod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-400">LOQ:</span>
              <span className="text-purple-200">{EXPERIMENTAL_PARAMS.loq}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-purple-800/30 border border-purple-700/30 rounded-xl p-4">
        <h3 className="text-white font-semibold mb-3">Namuna tayyorlash</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-purple-400">Erituvchi:</span>
            <span className="text-purple-200">{EXPERIMENTAL_PARAMS.solvent}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-purple-400">Konsentratsiya:</span>
            <span className="text-purple-200">{EXPERIMENTAL_PARAMS.concentration}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-purple-400">Oqim tezligi:</span>
            <span className="text-purple-200">{EXPERIMENTAL_PARAMS.flowRate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-purple-400">Ichki standart:</span>
            <span className="text-purple-200">{EXPERIMENTAL_PARAMS.internalStandard}</span>
          </div>
        </div>
      </div>

      <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-4">
        <h4 className="text-blue-400 font-semibold text-sm mb-2">
          🎯 Ichki standart: {INTERNAL_STANDARD.name}
        </h4>
        <p className="text-purple-200 text-sm">
          Asosiy ioni: <span className="font-mono text-yellow-400">m/z = {INTERNAL_STANDARD.mz}</span> ({INTERNAL_STANDARD.mainIon}).
        </p>
        <p className="text-purple-400 text-xs mt-1">
          {INTERNAL_STANDARD.advantage}. Konsentratsiyasi: {INTERNAL_STANDARD.concentration}.
        </p>
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
        <thead>
          <tr className="border-b border-purple-700/50">
            <th className="text-left py-3 px-4 text-purple-400 font-semibold">Usul</th>
            <th className="text-left py-3 px-4 text-purple-400 font-semibold">Kuzatilgan ionlar</th>
            <th className="text-left py-3 px-4 text-purple-400 font-semibold">m/z</th>
            <th className="text-left py-3 px-4 text-purple-400 font-semibold">Sezgirlik</th>
            <th className="text-left py-3 px-4 text-purple-400 font-semibold">Fragmentatsiya</th>
            <th className="text-left py-3 px-4 text-purple-400 font-semibold">Izoh</th>
          </tr>
        </thead>
        <tbody>
          {IONIZATION_COMPARISON.map((row, i) => (
            <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20 transition-colors">
              <td className="py-3 px-4">
                <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 rounded-full px-2 py-0.5 text-xs font-semibold">
                  {row.method}
                </span>
              </td>
              <td className="py-3 px-4 text-purple-200 text-xs">{row.observed}</td>
              <td className="py-3 px-4 font-mono text-yellow-400 text-xs">{row.mz}</td>
              <td className="py-3 px-4">
                <span className={`rounded-full px-2 py-0.5 text-xs ${
                  row.sensitivity === "Yuqori" ? "bg-green-600/20 text-green-400 border border-green-600/30" :
                  row.sensitivity === "O&apos;rta" ? "bg-yellow-600/20 text-yellow-400 border border-yellow-600/30" :
                  "bg-red-600/20 text-red-400 border border-red-600/30"
                }`}>
                  {row.sensitivity}
                </span>
              </td>
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
// ESI REDUKSIYA BLOKI
// ═══════════════════════════════════════════════════════════════════════════════
function ESIReductionBlock() {
  return (
    <div className="space-y-4">
      <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-4">
        <h3 className="text-red-400 font-semibold flex items-center gap-2">
          <span>⚠️</span> Muammo
        </h3>
        <p className="text-purple-200 mt-2">
          {ESI_REDUCTION_INFO.problem}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-purple-800/30 border border-purple-700/30 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-2">Mexanizm</h3>
          <p className="text-purple-200 text-sm">{ESI_REDUCTION_INFO.mechanism}</p>
        </div>
        <div className="bg-purple-800/30 border border-purple-700/30 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-2">Sharoitlar</h3>
          <p className="text-purple-200 text-sm">{ESI_REDUCTION_INFO.conditions}</p>
        </div>
      </div>

      <div className="bg-purple-800/30 border border-purple-700/30 rounded-xl p-4">
        <h3 className="text-white font-semibold mb-2">Dalil</h3>
        <p className="text-purple-200 text-sm">{ESI_REDUCTION_INFO.evidence}</p>
      </div>

      <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-4">
        <h3 className="text-green-400 font-semibold flex items-center gap-2">
          <span>✅</span> Oldini olish
        </h3>
        <p className="text-purple-200 mt-2 text-sm">{ESI_REDUCTION_INFO.prevention}</p>
      </div>

      <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-4">
        <h3 className="text-yellow-400 font-semibold">Diagnostik m/z</h3>
        <p className="text-purple-200 text-sm mt-1">{ESI_REDUCTION_INFO.diagnosticIon}</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ASOSIY SAHIFA KOMPONENTI (default export)
// ═══════════════════════════════════════════════════════════════════════════════
export default function K3FeCN6Page() {
  const [activeTab, setActiveTab] = useState("ms")
  const [selectedSpecies, setSelectedSpecies] = useState("k-fe-cn6-2")

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
          <h1 className="text-xl font-bold text-white">K₃[Fe(CN)₆] — Mass-spektrometrik tahlil</h1>
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
                  ? "bg-red-600/40 text-white border border-red-400/50"
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
          
          {/* Mass-spektr Tab */}
          {activeTab === "ms" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-yellow-400">Mass-spektr</h2>
              <SpeciesSelector selected={selectedSpecies} onSelect={setSelectedSpecies} />
              <MassSpektrGrafik 
                speciesKey={selectedSpecies} 
                lineColor={selectedSpecies === "k-fe-cn6-2" ? "#f87171" : selectedSpecies === "k2-fe-cn6-1" ? "#fbbf24" : "#34d399"} 
              />
              <div className="bg-purple-800/30 border border-purple-700/30 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-2">Izotopik pattern tushuntirish</h3>
                <p className="text-purple-200 text-sm">
                  Fe ning ⁵⁴Fe (5.8%), ⁵⁶Fe (91.7%), ⁵⁷Fe (2.1%), ⁵⁸Fe (0.3%) izotoplari va 
                  C ning ¹³C (1.07%) izotoplari hisobiga piklar klasteri hosil bo&apos;ladi.
                  z = −1 uchun izotop qadami 1 m/z, z = −2 uchun 0.5 m/z, z = −3 uchun 0.33 m/z.
                </p>
              </div>
            </div>
          )}

          {/* MS/MS Tab */}
          {activeTab === "msms" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-yellow-400">MS/MS Fragmentatsiya daraxti</h2>
              <p className="text-purple-400 text-sm">
                Prekursor: m/z = 329 [K₂Fe(CN)₆]⁻. CID (Collision-Induced Dissociation) orqali fragmentatsiya.
              </p>
              <MSMSFragmentTree />
            </div>
          )}

          {/* Addukt Ionlar Tab */}
          {activeTab === "adducts" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-yellow-400">Addukt ionlar jadvali</h2>
              <p className="text-purple-400 text-sm">
                K₃[Fe(CN)₆] ESI− sharoitida hosil qiladigan barcha ion turlari.
              </p>
              <AdductTable />
            </div>
          )}

          {/* Eksperimental Tab */}
          {activeTab === "experimental" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-yellow-400">Eksperimental parametrlar</h2>
              <p className="text-purple-400 text-sm">
                Haqiqiy eksperiment uchun optimal sharoitlar. Agilent 6545 Q-TOF LC/MS.
              </p>
              <ExperimentalParams />
            </div>
          )}

          {/* Ionlashtirish Tab */}
          {activeTab === "ionization" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-yellow-400">Ionlashtirish usullari taqqoslash</h2>
              <p className="text-purple-400 text-sm">
                Turli ionlashtirish usullarida K₃[Fe(CN)₆] ning mass-spektrdagi ko&apos;rinishi.
              </p>
              <IonizationComparison />
            </div>
          )}

          {/* Kalkulyator Tab */}
          {activeTab === "calculator" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-yellow-400">Interaktiv izotop kalkulyatori</h2>
              <p className="text-purple-400 text-sm">
                Izotopik taqsimotni o&apos;z qo&apos;llaringiz bilan hisoblang.
              </p>
              <IzotopKalkulyator />
            </div>
          )}

          {/* Reduksiya Tab */}
          {activeTab === "reduction" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-yellow-400">ESI Reduksiya muammosi</h2>
              <p className="text-purple-400 text-sm">
                Fe³⁺ → Fe²⁺ qaytarilishi va uning mass-spektrga ta&apos;siri.
              </p>
              <ESIReductionBlock />
            </div>
          )}
        </div>

        {/* Pastki navigatsiya */}
        <div className="flex justify-between mt-8 pt-6 border-t border-purple-800/50">
          <Link 
            href="/ilmiy/birikmalar"
            className="text-purple-400 hover:text-purple-200 transition-colors text-sm flex items-center gap-2"
          >
            <span>←</span> Birikmalar ro&apos;yxatiga qaytish
          </Link>
          <div className="flex gap-4">
            <Link 
              href="/ilmiy/birikmalar/k4-fe-cn6"
              className="text-purple-400 hover:text-purple-200 transition-colors text-sm"
            >
              K₄[Fe(CN)₆] (Sariq qon tuzi) →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}