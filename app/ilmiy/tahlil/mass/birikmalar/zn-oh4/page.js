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

const ISOTOPES = {
  Zn: [
    { mass: 63.9291, abundance: 49.17, label: "⁶⁴Zn" },
    { mass: 65.9260, abundance: 27.73, label: "⁶⁶Zn" },
    { mass: 66.9271, abundance: 4.04, label: "⁶⁷Zn" },
    { mass: 67.9248, abundance: 18.45, label: "⁶⁸Zn" },
    { mass: 69.9253, abundance: 0.61, label: "⁷⁰Zn" },
  ],
  O: [
    { mass: 15.9949, abundance: 99.76, label: "¹⁶O" },
    { mass: 17.9992, abundance: 0.20, label: "¹⁸O" },
  ],
  H: [
    { mass: 1.0078, abundance: 99.99, label: "¹H" },
    { mass: 2.0141, abundance: 0.01, label: "²H" },
  ],
  Na: [
    { mass: 22.9898, abundance: 100, label: "²³Na" },
  ],
}

function calculateIsotopicDistribution(species) {
  let distributions = [{ mass: 0, probability: 1 }]
  Object.entries(species).forEach(([element, count]) => {
    if (count === 0 || !ISOTOPES[element]) return
    const isotopes = ISOTOPES[element]
    for (let i = 0; i < count; i++) {
      const newDist = []
      distributions.forEach(d => {
        isotopes.forEach(iso => {
          newDist.push({ mass: d.mass + iso.mass, probability: d.probability * (iso.abundance / 100) })
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
  distributions = distributions.map(d => ({ mass: d.mass, probability: (d.probability / maxProb) * 100 }))
  return distributions.filter(d => d.probability > 0.05)
}

const ION_SPECIES = {
  "zn-oh4-2": {
    name: "[Zn(OH)₄]²⁻",
    charge: -2,
    formula: "ZnO₄H₄",
    exactMass: 133.9315,
    description: "Ikki zaryadli anion. ESI− da m/z = 67.0 da kuzatiladi. Zn²⁺ (d¹⁰), tetraedrik geometriya. Zn ning 5 ta izotopi tufayli ko'p pikli pattern.",
    species: { Zn: 1, O: 4, H: 4, Na: 0 },
    mzDivider: 2,
    isotopicStep: 0.5,
  },
  "na-zn-oh4-1": {
    name: "[NaZn(OH)₄]⁻",
    charge: -1,
    formula: "NaZnO₄H₄",
    exactMass: 156.9213,
    description: "Bitta Na⁺ bilan juftlashgan — 1− zaryadli. ESI− da m/z ≈ 157 da asosiy pik. Na⁺ addukti tabiiy.",
    species: { Zn: 1, O: 4, H: 4, Na: 1 },
    mzDivider: 1,
    isotopicStep: 1.0,
  },
  "zn-oh3-1": {
    name: "[Zn(OH)₃]⁻",
    charge: -1,
    formula: "ZnO₃H₃",
    exactMass: 116.9146,
    description: "Bitta OH⁻ yo'qolgan fragment. m/z ≈ 117. Tetraedrik → trigonal planar o'tish.",
    species: { Zn: 1, O: 3, H: 3, Na: 0 },
    mzDivider: 1,
    isotopicStep: 1.0,
  },
}

function MassSpektrGrafik({ speciesKey = "zn-oh4-2", lineColor = "#a78bfa" }) {
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
  const mzMin = distribution[0]?.mass / species.mzDivider - 1 || 60
  const mzMax = distribution[distribution.length - 1]?.mass / species.mzDivider + 1 || 75

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
    for (let mz = Math.floor(mzMin); mz <= Math.ceil(mzMax); mz += step * 2) {
      ctx.fillText(mz.toFixed(1), mzToX(mz), PAD.t + plotH + 18)
    }
    ctx.fillStyle = "#9a8abf"; ctx.font = "bold 11px sans-serif"
    ctx.fillText(`m/z (z=${Math.abs(species.charge)})`, PAD.l + plotW / 2, H - 8)
    
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
                ? "bg-violet-600/40 text-white border border-violet-400/50"
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

function IzotopKalkulyator() {
  const [znIso, setZnIso] = useState("64")
  const [naCount, setNaCount] = useState(0)
  const [result, setResult] = useState(null)

  const calculate = () => {
    const species = { Zn: 1, O: 4, H: 4, Na: naCount }
    const dist = calculateIsotopicDistribution(species)
    const mainPeak = dist.find(d => d.probability > 30) || dist[0]
    setResult({ mainMz: mainPeak.mass.toFixed(2), peaks: dist.filter(d => d.probability > 1).slice(0, 8), totalPeaks: dist.length })
  }

  useEffect(() => { calculate() }, [znIso, naCount])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-purple-400 text-xs block mb-1">Zn izotopi</label>
          <select value={znIso} onChange={(e) => setZnIso(e.target.value)} className="w-full bg-purple-800/50 border border-purple-600 rounded-lg px-3 py-2 text-white text-sm">
            <option value="64">⁶⁴Zn (49.2%)</option>
            <option value="66">⁶⁶Zn (27.7%)</option>
            <option value="67">⁶⁷Zn (4.0%)</option>
            <option value="68">⁶⁸Zn (18.5%)</option>
            <option value="70">⁷⁰Zn (0.6%)</option>
          </select>
        </div>
        <div>
          <label className="text-purple-400 text-xs block mb-1">Na⁺ soni</label>
          <select value={naCount} onChange={(e) => setNaCount(+e.target.value)} className="w-full bg-purple-800/50 border border-purple-600 rounded-lg px-3 py-2 text-white text-sm">
            <option value={0}>0 ta Na⁺</option>
            <option value={1}>1 ta Na⁺</option>
            <option value={2}>2 ta Na⁺</option>
          </select>
        </div>
      </div>
      {result && (
        <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
          <p className="text-white font-semibold">Asosiy massa: <span className="text-green-400 font-mono">{result.mainMz} Da</span></p>
          <div className="flex flex-wrap gap-2 mt-2">
            {result.peaks.map((p, i) => (
              <span key={i} className="bg-purple-900/50 px-2 py-1 rounded-full text-xs text-purple-300 font-mono">{p.mass.toFixed(1)}: {p.probability.toFixed(1)}%</span>
            ))}
          </div>
          <p className="text-purple-400 text-xs mt-2">Jami {result.totalPeaks} ta izotopik pik</p>
        </div>
      )}
    </div>
  )
}

export { MassSpektrGrafik, SpeciesSelector, IzotopKalkulyator, ION_SPECIES, ISOTOPES, calculateIsotopicDistribution }

const MSMS_TREE = {
  precursor: { mz: 67.0, label: "[Zn(OH)₄]²⁻ (z=2)", intensity: 100 },
  fragments: [
    {
      mz: 116.9, label: "[Zn(OH)₃]⁻", intensity: 55, energy: "10 eV",
      children: [
        { mz: 99.9, label: "[Zn(OH)₂]", intensity: 25, energy: "18 eV" },
        { mz: 82.9, label: "[Zn(OH)]⁺", intensity: 10, energy: "25 eV" },
      ]
    },
    {
      mz: 82.9, label: "[Zn(OH)]⁺", intensity: 18, energy: "25 eV",
      children: [
        { mz: 63.9, label: "[Zn]⁺", intensity: 10, energy: "35 eV" },
      ]
    },
    { mz: 63.9, label: "[Zn]⁺", intensity: 12, energy: "35 eV", children: [] },
  ]
}

const ADDUCT_TABLE = [
  { adduct: "[M]²⁻", mz: 67.0, formula: "[Zn(OH)₄]²⁻", mode: "ESI−", abundance: "Eng yuqori" },
  { adduct: "[M+Na]⁻", mz: 156.9, formula: "[NaZn(OH)₄]⁻", mode: "ESI−", abundance: "Yuqori" },
  { adduct: "[M−OH]⁻", mz: 116.9, formula: "[Zn(OH)₃]⁻", mode: "ESI−", abundance: "O&apos;rta" },
  { adduct: "[M+K]⁻", mz: 172.9, formula: "[KZn(OH)₄]⁻", mode: "ESI−", abundance: "Past" },
  { adduct: "[Zn(OH)₂]", mz: 99.9, formula: "Zn(OH)₂", mode: "—", abundance: "Cho'kma" },
]

const EXPERIMENTAL_PARAMS = {
  instrument: "Agilent 6545 Q-TOF LC/MS", ionization: "ESI (−)", capillaryVoltage: "3.0 kV",
  nebulizerGas: "N₂, 28 psi", dryingGas: "N₂, 7 L/min, 300°C", sheathGas: "N₂, 9 L/min, 310°C",
  fragmentor: "80 V", skimmer: "50 V", massRange: "m/z 50–300", resolution: "~40,000 (FWHM)",
  accuracy: "&lt; 2 ppm", solvent: "H₂O (pH > 10, NaOH bilan)", concentration: "10 μM (Na₂[Zn(OH)₄])",
  flowRate: "0.2 mL/min", internalStandard: "Na₂[Sn(OH)₆] — m/z 125.5 [Sn(OH)₆]²⁻",
  lod: "0.03 μM (S/N &gt; 3)", loq: "0.10 μM (S/N &gt; 10)",
}

const IONIZATION_COMPARISON = [
  { method: "ESI (−)", observed: "[Zn(OH)₄]²⁻, [Zn(OH)₃]⁻", mz: "67.0, 116.9", sensitivity: "Yuqori", fragmentation: "Minimal", notes: "Soft ionization. [Zn(OH)₄]²⁻ dominant." },
  { method: "ESI (+)", observed: "[Na₂Zn(OH)₄]⁺", mz: "179", sensitivity: "O&apos;rta", fragmentation: "Minimal", notes: "Na⁺ addukti bilan musbat rejimda." },
  { method: "MALDI−TOF", observed: "[Zn(OH)₃]⁻, [Zn(OH)₂]", mz: "117, 100", sensitivity: "Past", fragmentation: "Yuqori", notes: "Matritsa ta'sirida OH⁻ yo'qoladi." },
  { method: "EI (70 eV)", observed: "Zn⁺, ZnO⁺", mz: "64, 80", sensitivity: "Juda past", fragmentation: "To'liq", notes: "Molekulyar ion kuzatilmaydi." },
]

const INTERNAL_STANDARD = {
  name: "Na₂[Sn(OH)₆]", formula: "SnO₆H₆Na₂", exactMass: 250.9078, mainIon: "[Sn(OH)₆]²⁻", mz: 125.5,
  usage: "Tashqi kalibrlash va Zn gidroksokomplekslari uchun standart",
  concentration: "5 μM (har bir namunaga qo&apos;shiladi)",
  advantage: "Sn analogi — Zn dan og&apos;irroq. Spektrda ajralib turadi.",
}

const AMPHOTERIC_INFO = {
  title: "Amfoter xossa — Zn(OH)₂ kislota va ishqorda eriydi",
  explanation: "Zn²⁺ amfoter metall — gidroksidi ham kislota, ham ishqor bilan reaksiyaga kirishadi. Ishqoriy muhitda [Zn(OH)₄]²⁻ hosil bo'ladi. Mass-spektrometriya bu ion mavjudligini bevosita tasdiqlaydi.",
  properties: [
    "Zn(OH)₂ + 2NaOH → Na₂[Zn(OH)₄] (erish)",
    "Zn(OH)₂ + 2HCl → ZnCl₂ + 2H₂O (erish)",
    "Tetraedrik geometriya — Zn²⁺ (d¹⁰)",
    "Rangsiz eritma — d−d o'tishlar yo'q",
    "pH > 10 da barqaror, kislotali muhitda parchalanadi",
  ],
  massSpecInsight: "Zn izotoplari (⁶⁴Zn 49%, ⁶⁶Zn 28%, ⁶⁸Zn 18%) tufayli ko'p pikli pattern. z=2 da izotop qadami 0.5 m/z.",
}

function HeroSection() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-950 via-purple-900 to-blue-950 border border-violet-700/50 p-8 md:p-12 mb-10">
      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 text-sm text-purple-400 mb-6">
          <Link href="/" className="hover:text-purple-200 transition-colors">Bosh sahifa</Link><span>/</span>
          <Link href="/ilmiy/birikmalar" className="hover:text-purple-200 transition-colors">Birikmalar</Link><span>/</span>
          <span className="text-yellow-400">[Zn(OH)₄]²⁻</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white">[Zn(OH)₄]²⁻</h1>
          <div className="flex flex-wrap gap-2">
            <span className="bg-violet-600/20 text-violet-400 border border-violet-600/30 rounded-full px-3 py-1 text-xs font-semibold">Tetraedrik</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 rounded-full px-3 py-1 text-xs">Tetragidroksosinkat(II)</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-full px-3 py-1 text-xs">d¹⁰ — diamagnit</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[["Molekulyar massa","133.41 g/mol"],["Aniq massa","133.9315 Da"],["Oksidlanish darajasi","Zn²⁺ (d¹⁰)"],["Geometriya","Tetraedrik (Td)"]].map(([l,v],i)=>(
            <div key={i} className="bg-purple-800/30 border border-purple-700/30 rounded-xl p-3 text-center"><p className="text-purple-400 text-xs mb-1">{l}</p><p className="text-white font-semibold text-sm">{v}</p></div>
          ))}
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 inline-block">
          <p className="text-yellow-400 text-sm"><strong>ESI−MS asosiy piki:</strong> <span className="font-mono text-lg">m/z = 67.0</span> <span className="text-purple-400">[Zn(OH)₄]²⁻</span></p>
          <p className="text-purple-400 text-xs mt-1">Zn izotoplari: ⁶⁴Zn (49%), ⁶⁶Zn (28%), ⁶⁸Zn (18%) — ko'p pikli pattern</p>
        </div>
      </div>
    </div>
  )
}

const TABS = [
  { id: "ms", label: "Mass-spektr", icon: "📊" }, { id: "msms", label: "MS/MS Fragmentatsiya", icon: "🧬" },
  { id: "amphoteric", label: "Amfoter xossa", icon: "⚖️" }, { id: "adducts", label: "Addukt ionlar", icon: "📋" },
  { id: "experimental", label: "Eksperimental", icon: "⚗️" }, { id: "ionization", label: "Ionlashtirish", icon: "💡" },
  { id: "calculator", label: "Izotop Kalkulyator", icon: "🔢" },
]

function MSMSFragmentTree() {
  const [expandedNodes, setExpandedNodes] = useState(new Set())
  const [selectedNode, setSelectedNode] = useState(null)
  const toggleNode = (mz) => { const ns=new Set(expandedNodes); if(ns.has(mz))ns.delete(mz);else ns.add(mz); setExpandedNodes(ns) }
  const renderFragment = (f, d=0, last=false) => {
    const hasCh=f.children?.length>0, isExp=expandedNodes.has(f.mz), isSel=selectedNode?.mz===f.mz
    return (<div key={f.mz} className="relative"><div className="flex items-start">{d>0&&(<div className="flex-shrink-0 w-6 relative"><div className="absolute top-0 left-3 border-l border-dashed border-purple-600/50" style={{height:last?'50%':'100%'}}/><div className="absolute top-4 left-3 w-3 border-t border-dashed border-purple-600/50"/></div>)}<div onClick={()=>{setSelectedNode(isSel?null:f);if(hasCh)toggleNode(f.mz)}} className={`flex-1 cursor-pointer transition-all rounded-xl p-3 border ${isSel?"bg-violet-600/20 border-violet-500/50":"bg-purple-800/30 border-purple-700/30 hover:border-purple-500/50"}`}><div className="flex items-center gap-3">{hasCh&&<span className="text-purple-400 text-sm transition-transform" style={{transform:isExp?'rotate(90deg)':'rotate(0deg)'}}>▶</span>}{!hasCh&&<span className="w-4"/>}<div className="flex-1"><div className="flex items-center gap-2"><span className="font-mono font-bold text-yellow-400">m/z = {f.mz.toFixed(1)}</span><span className="text-purple-400 text-sm">{f.label}</span></div>{f.energy&&<p className="text-purple-500 text-xs mt-0.5">CID energiyasi: {f.energy}</p>}</div><div className="flex items-center gap-2"><div className="w-16 h-2 bg-purple-950/50 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-violet-400 to-purple-400 rounded-full" style={{width:`${f.intensity}%`}}/></div><span className="text-purple-400 text-xs w-10">{f.intensity}%</span></div></div></div></div>{hasCh&&isExp&&(<div className="ml-6">{f.children.map((c,i)=>renderFragment(c,d+1,i===f.children.length-1))}</div>)}</div>)
  }
  return (<div className="space-y-4"><div className="bg-purple-800/30 border border-purple-700/30 rounded-xl p-4 mb-4"><h3 className="text-white font-semibold mb-2">Prekursor ion</h3><div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3"><span className="font-mono font-bold text-yellow-400 text-lg">m/z = {MSMS_TREE.precursor.mz}</span><span className="text-purple-400 ml-2">{MSMS_TREE.precursor.label}</span></div><p className="text-purple-400 text-xs mt-2">CID — N₂ gazi, 10–35 eV. OH⁻ ionlari ketma-ket yo&apos;qoladi.</p></div><h3 className="text-white font-semibold">Fragment ionlar</h3><div className="space-y-2">{MSMS_TREE.fragments.map((f,i)=>renderFragment(f,0,i===MSMS_TREE.fragments.length-1))}</div>{selectedNode&&(<div className="bg-violet-600/10 border border-violet-500/30 rounded-xl p-4 mt-4"><div className="flex items-center justify-between"><div><span className="font-mono font-bold text-violet-400">m/z = {selectedNode.mz.toFixed(1)}</span><span className="text-purple-400 ml-2">{selectedNode.label}</span></div><button onClick={()=>setSelectedNode(null)} className="text-purple-400 hover:text-white text-sm">✕ Yopish</button></div>{selectedNode.energy&&<p className="text-purple-400 text-sm mt-1">CID energiyasi: {selectedNode.energy}</p>}</div>)}</div>)
}

function AmphotericBlock() {
  return (<div className="space-y-4"><div className="bg-violet-600/10 border border-violet-500/30 rounded-xl p-4"><h3 className="text-violet-400 font-semibold flex items-center gap-2"><span>⚖️</span> {AMPHOTERIC_INFO.title}</h3><p className="text-purple-200 mt-2 text-sm">{AMPHOTERIC_INFO.explanation}</p></div><div className="bg-purple-800/30 border border-purple-700/30 rounded-xl p-4"><h3 className="text-white font-semibold mb-3">Reaksiyalar va xossalar</h3><ul className="text-purple-200 text-sm space-y-2">{AMPHOTERIC_INFO.properties.map((p,i)=>(<li key={i} className="flex items-start gap-2"><span className="text-violet-400 font-bold">•</span>{p}</li>))}</ul></div><div className="bg-purple-800/30 border border-purple-700/30 rounded-xl p-4"><h3 className="text-white font-semibold mb-2">Mass-spektrometrik dalil</h3><p className="text-purple-200 text-sm">{AMPHOTERIC_INFO.massSpecInsight}</p></div></div>)
}

function AdductTable() {
  return (<div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-purple-700/50"><th className="text-left py-3 px-4 text-purple-400 font-semibold">Addukt</th><th className="text-left py-3 px-4 text-purple-400 font-semibold">m/z</th><th className="text-left py-3 px-4 text-purple-400 font-semibold">Formula</th><th className="text-left py-3 px-4 text-purple-400 font-semibold">Ionlashtirish</th><th className="text-left py-3 px-4 text-purple-400 font-semibold">Nisbiy miqdor</th></tr></thead><tbody>{ADDUCT_TABLE.map((r,i)=>(<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4"><span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 rounded-full px-2 py-0.5 text-xs font-mono">{r.adduct}</span></td><td className="py-3 px-4 font-mono text-yellow-400">{r.mz}</td><td className="py-3 px-4 text-purple-200 font-mono text-xs">{r.formula}</td><td className="py-3 px-4"><span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-full px-2 py-0.5 text-xs">{r.mode}</span></td><td className="py-3 px-4"><span className={`rounded-full px-2 py-0.5 text-xs ${r.abundance==="Eng yuqori"?"bg-green-600/20 text-green-400 border-green-600/30":r.abundance==="Yuqori"?"bg-yellow-600/20 text-yellow-400 border-yellow-600/30":r.abundance==="O&apos;rta"?"bg-orange-600/20 text-orange-400 border-orange-600/30":"bg-purple-600/20 text-purple-400 border-purple-600/30"}`}>{r.abundance}</span></td></tr>))}</tbody></table><p className="text-purple-500 text-xs mt-3 italic">* m/z = 67.0 [Zn(OH)₄]²⁻ eng dominant. Zn izotoplari tufayli ko'p pikli pattern.</p></div>)
}

function ExperimentalParams() {
  return (<div className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="bg-purple-800/30 border border-purple-700/30 rounded-xl p-4"><h3 className="text-white font-semibold mb-3">Asbob parametrlari</h3><div className="space-y-2 text-sm">{[["Asbob:",EXPERIMENTAL_PARAMS.instrument],["Ionlashtirish:",EXPERIMENTAL_PARAMS.ionization],["Capillary Voltage:",EXPERIMENTAL_PARAMS.capillaryVoltage],["Fragmentor:",EXPERIMENTAL_PARAMS.fragmentor],["Skimmer:",EXPERIMENTAL_PARAMS.skimmer]].map(([l,v],i)=>(<div key={i} className="flex justify-between"><span className="text-purple-400">{l}</span><span className="text-purple-200">{v}</span></div>))}</div></div><div className="bg-purple-800/30 border border-purple-700/30 rounded-xl p-4"><h3 className="text-white font-semibold mb-3">Ishlash ko&apos;rsatkichlari</h3><div className="space-y-2 text-sm">{[["Mass Range:",EXPERIMENTAL_PARAMS.massRange],["Resolution:",EXPERIMENTAL_PARAMS.resolution],["Mass Accuracy:",EXPERIMENTAL_PARAMS.accuracy],["LOD:",EXPERIMENTAL_PARAMS.lod],["LOQ:",EXPERIMENTAL_PARAMS.loq]].map(([l,v],i)=>(<div key={i} className="flex justify-between"><span className="text-purple-400">{l}</span><span className="text-purple-200">{v}</span></div>))}</div></div></div><div className="bg-purple-800/30 border border-purple-700/30 rounded-xl p-4"><h3 className="text-white font-semibold mb-3">Namuna tayyorlash</h3><div className="space-y-2 text-sm">{[["Erituvchi:",EXPERIMENTAL_PARAMS.solvent],["Konsentratsiya:",EXPERIMENTAL_PARAMS.concentration],["Oqim tezligi:",EXPERIMENTAL_PARAMS.flowRate],["Ichki standart:",EXPERIMENTAL_PARAMS.internalStandard]].map(([l,v],i)=>(<div key={i} className="flex justify-between"><span className="text-purple-400">{l}</span><span className="text-purple-200">{v}</span></div>))}</div></div><div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-4"><h4 className="text-blue-400 font-semibold text-sm mb-2">🎯 Ichki standart: {INTERNAL_STANDARD.name}</h4><p className="text-purple-200 text-sm">Asosiy ioni: <span className="font-mono text-yellow-400">m/z = {INTERNAL_STANDARD.mz}</span> ({INTERNAL_STANDARD.mainIon}).</p><p className="text-purple-400 text-xs mt-1">{INTERNAL_STANDARD.advantage}. Konsentratsiyasi: {INTERNAL_STANDARD.concentration}.</p></div></div>)
}

function IonizationComparison() {
  return (<div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-purple-700/50"><th className="text-left py-3 px-4 text-purple-400 font-semibold">Usul</th><th className="text-left py-3 px-4 text-purple-400 font-semibold">Kuzatilgan ionlar</th><th className="text-left py-3 px-4 text-purple-400 font-semibold">m/z</th><th className="text-left py-3 px-4 text-purple-400 font-semibold">Sezgirlik</th><th className="text-left py-3 px-4 text-purple-400 font-semibold">Fragmentatsiya</th><th className="text-left py-3 px-4 text-purple-400 font-semibold">Izoh</th></tr></thead><tbody>{IONIZATION_COMPARISON.map((r,i)=>(<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4"><span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 rounded-full px-2 py-0.5 text-xs font-semibold">{r.method}</span></td><td className="py-3 px-4 text-purple-200 text-xs">{r.observed}</td><td className="py-3 px-4 font-mono text-yellow-400 text-xs">{r.mz}</td><td className="py-3 px-4"><span className={`rounded-full px-2 py-0.5 text-xs ${r.sensitivity==="Yuqori"?"bg-green-600/20 text-green-400 border-green-600/30":r.sensitivity==="O&apos;rta"?"bg-yellow-600/20 text-yellow-400 border-yellow-600/30":"bg-red-600/20 text-red-400 border-red-600/30"}`}>{r.sensitivity}</span></td><td className="py-3 px-4 text-purple-200 text-xs">{r.fragmentation}</td><td className="py-3 px-4 text-purple-400 text-xs">{r.notes}</td></tr>))}</tbody></table></div>)
}

export default function ZnOH4Page() {
  const [activeTab, setActiveTab] = useState("ms")
  const [selectedSpecies, setSelectedSpecies] = useState("zn-oh4-2")
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 px-6 py-4 mb-6 border-b border-purple-800/50">
          <Link href="/ilmiy/birikmalar" className="hover:bg-purple-800/50 p-2 rounded-xl transition-all border border-purple-500" aria-label="Birikmalar ro&apos;yxatiga qaytish">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          </Link>
          <h1 className="text-xl font-bold text-white">[Zn(OH)₄]²⁻ — Mass-spektrometrik tahlil</h1>
        </div>
        <HeroSection />
        <div className="flex flex-wrap gap-1 bg-purple-900/40 border border-purple-700/50 rounded-2xl p-1.5 mb-6">
          {TABS.map(tab=>(<button key={tab.id} onClick={()=>setActiveTab(tab.id)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab===tab.id?"bg-violet-600/40 text-white border border-violet-400/50":"text-purple-400 hover:text-white hover:bg-purple-800/30"}`}><span className="mr-1.5">{tab.icon}</span>{tab.label}</button>))}
        </div>
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          {activeTab==="ms"&&(<div className="space-y-6"><h2 className="text-xl font-bold text-yellow-400">Mass-spektr</h2><SpeciesSelector selected={selectedSpecies} onSelect={setSelectedSpecies}/><MassSpektrGrafik speciesKey={selectedSpecies} lineColor={selectedSpecies==="zn-oh4-2"?"#a78bfa":selectedSpecies==="na-zn-oh4-1"?"#8b5cf6":"#7c3aed"}/><div className="bg-purple-800/30 border border-purple-700/30 rounded-xl p-4"><h3 className="text-white font-semibold mb-2">Zn izotop pattern</h3><p className="text-purple-200 text-sm">Zn ning 5 ta barqaror izotopi: ⁶⁴Zn (49.2%), ⁶⁶Zn (27.7%), ⁶⁷Zn (4.0%), ⁶⁸Zn (18.5%), ⁷⁰Zn (0.6%). z=2 da izotop qadami 0.5 m/z.</p></div></div>)}
          {activeTab==="msms"&&(<div className="space-y-4"><h2 className="text-xl font-bold text-yellow-400">MS/MS Fragmentatsiya daraxti</h2><p className="text-purple-400 text-sm">Prekursor: m/z = 67.0 [Zn(OH)₄]²⁻. CID orqali OH⁻ ionlari ketma-ket yo&apos;qoladi.</p><MSMSFragmentTree/></div>)}
          {activeTab==="amphoteric"&&(<div className="space-y-4"><h2 className="text-xl font-bold text-yellow-400">Amfoter xossa</h2><p className="text-purple-400 text-sm">Zn(OH)₂ amfoter — kislota va ishqorda eriydi. [Zn(OH)₄]²⁻ ishqoriy muhitda hosil bo&apos;ladi.</p><AmphotericBlock/></div>)}
          {activeTab==="adducts"&&(<div className="space-y-4"><h2 className="text-xl font-bold text-yellow-400">Addukt ionlar jadvali</h2><p className="text-purple-400 text-sm">[Zn(OH)₄]²⁻ ESI− sharoitida hosil qiladigan barcha ion turlari.</p><AdductTable/></div>)}
          {activeTab==="experimental"&&(<div className="space-y-4"><h2 className="text-xl font-bold text-yellow-400">Eksperimental parametrlar</h2><p className="text-purple-400 text-sm">Agilent 6545 Q-TOF LC/MS. Ishqoriy muhit (pH {">"} 10).</p><ExperimentalParams/></div>)}
          {activeTab==="ionization"&&(<div className="space-y-4"><h2 className="text-xl font-bold text-yellow-400">Ionlashtirish usullari taqqoslash</h2><p className="text-purple-400 text-sm">Turli ionlashtirish usullarida [Zn(OH)₄]²⁻ ning mass-spektrdagi ko&apos;rinishi.</p><IonizationComparison/></div>)}
          {activeTab==="calculator"&&(<div className="space-y-4"><h2 className="text-xl font-bold text-yellow-400">Interaktiv izotop kalkulyatori</h2><p className="text-purple-400 text-sm">Zn izotopi va Na⁺ sonini tanlab, izotopik taqsimotni hisoblang.</p><IzotopKalkulyator/></div>)}
        </div>
        <div className="flex justify-between mt-8 pt-6 border-t border-purple-800/50">
          <Link href="/ilmiy/birikmalar/fe-co5" className="text-purple-400 hover:text-purple-200 transition-colors text-sm flex items-center gap-2"><span>←</span> [Fe(CO)₅]</Link>
          <Link href="/ilmiy/birikmalar/cr-h2o6" className="text-purple-400 hover:text-purple-200 transition-colors text-sm">[Cr(H₂O)₆]³⁺ →</Link>
        </div>
      </div>
    </div>
  )
}