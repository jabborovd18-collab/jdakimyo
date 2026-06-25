"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════
// XPS MA'LUMOTLAR BAZASI — [Fe(H₂O)₆]³⁺
// ═══════════════════════════════════════════════════════════
const xpsPeaks = {
  "Fe 2p": [
    { orbital: "Fe 2p₃/₂", be: 711.5, intensity: 1.0, fwhm: 2.5, assign: "Fe³⁺ (HS)" },
    { orbital: "Fe 2p₁/₂", be: 724.6, intensity: 0.5, fwhm: 2.5, assign: "SO split (Δ=13.1 eV)" },
    { orbital: "Satellite", be: 719.0, intensity: 0.55, fwhm: 3.0, assign: "Shake-up (HS diagnostik)" }
  ],
  "O 1s": [
    { orbital: "O 1s (H₂O)", be: 532.2, intensity: 1.0, fwhm: 1.6, assign: "Koordinatsion H₂O" },
    { orbital: "O 1s (OH⁻)", be: 531.2, intensity: 0.4, fwhm: 1.4, assign: "Gidroliz mahsuloti" },
    { orbital: "O 1s (ads)", be: 533.5, intensity: 0.2, fwhm: 1.8, assign: "Adsorbsion H₂O" }
  ],
  "Cl 2p": [
    { orbital: "Cl 2p₃/₂", be: 198.5, intensity: 1.0, fwhm: 1.3, assign: "Cl⁻ (counterion)" },
    { orbital: "Cl 2p₁/₂", be: 200.1, intensity: 0.5, fwhm: 1.3, assign: "SO split (Δ=1.6 eV)" }
  ]
}

const surveyData = [
  { element: "Fe", orbital: "2p₃/₂", be: 711.5, atomic_percent: 5.9, color: "#ef4444", desc: "Markaziy metal" },
  { element: "O", orbital: "1s", be: 532.2, atomic_percent: 35.3, color: "#f59e0b", desc: "Ligand + sirt" },
  { element: "Cl", orbital: "2p₃/₂", be: 198.5, atomic_percent: 17.6, color: "#10b981", desc: "Counterion" },
  { element: "C", orbital: "1s", be: 285.0, atomic_percent: 29.4, color: "#6b7280", desc: "Sirt iflosligi" },
  { element: "N", orbital: "1s", be: 400.0, atomic_percent: 11.8, color: "#3b82f6", desc: "Atmosfera N₂" }
]

const gidrolizSteps = [
  { formula: "[Fe(H₂O)₆]³⁺", ph: "< 2", rang: "Sariq", charge: "+3" },
  { formula: "[Fe(H₂O)₅(OH)]²⁺", ph: "2-3", rang: "Sariq-jigar", charge: "+2" },
  { formula: "[Fe(H₂O)₄(OH)₂]⁺", ph: "3-4", rang: "Jigar", charge: "+1" },
  { formula: "Fe(OH)₃ ↓", ph: "> 4", rang: "Qizil-jigar cho'kma", charge: "0" }
]

export default function FeH2O6_3() {
  const [selectedRegion, setSelectedRegion] = useState("Fe 2p")
  const [showSatellite, setShowSatellite] = useState(true)
  const [showSurvey, setShowSurvey] = useState(false)
  const [compareMode, setCompareMode] = useState("none") // none, fe2hs, fe3ls
  const [activeGidroliz, setActiveGidroliz] = useState(0)

  // ═══════════════════════════════════════════════════════════
  // SPEKTR GENERATORI
  // ═══════════════════════════════════════════════════════════
  const generateSpectrum = (region, refMode) => {
    const points = []
    const peaks = xpsPeaks[region]
    if (!peaks) return []

    const minBE = Math.min(...peaks.map(p => p.be)) - 10
    const maxBE = Math.max(...peaks.map(p => p.be)) + 18
    const steps = 250

    for (let i = 0; i <= steps; i++) {
      const be = minBE + (i / steps) * (maxBE - minBE)
      let intensity = 0

      // Asosiy piklar
      peaks.forEach(peak => {
        if (peak.assign.includes("Shake-up") && !showSatellite) return
        const x = (be - peak.be) / peak.fwhm
        intensity += peak.intensity * Math.exp(-0.5 * x * x)
      })

      // Solishtirish rejimlari
      if (refMode === "fe2hs" && region === "Fe 2p") {
        // [Fe(H₂O)₆]²⁺ HS
        const x1 = (be - 710.0) / 2.2
        intensity += 0.85 * Math.exp(-0.5 * x1 * x1)
        const x2 = (be - 723.1) / 2.2
        intensity += 0.42 * Math.exp(-0.5 * x2 * x2)
        if (showSatellite) {
          const xs = (be - 715.0) / 2.5
          intensity += 0.40 * Math.exp(-0.5 * xs * xs)
        }
      } else if (refMode === "fe3ls" && region === "Fe 2p") {
        // K₃[Fe(CN)₆] LS Fe³⁺
        const x1 = (be - 709.8) / 1.6
        intensity += 0.90 * Math.exp(-0.5 * x1 * x1)
        const x2 = (be - 722.9) / 1.6
        intensity += 0.45 * Math.exp(-0.5 * x2 * x2)
      }

      // Multiplet broadening (HS Fe³⁺ uchun xarakterli)
      if (region === "Fe 2p") {
        const xm = (be - 710.5) / 4.0
        intensity += 0.10 * Math.exp(-0.5 * xm * xm)
      }

      // Shirley fon
      const bg = 0.07 * (maxBE - be) / (maxBE - minBE)
      intensity += bg

      points.push({ be, intensity })
    }
    return points
  }

  const spectrum = useMemo(() => 
    generateSpectrum(selectedRegion, compareMode), 
    [selectedRegion, compareMode, showSatellite]
  )

  const maxIntensity = Math.max(...spectrum.map(p => p.intensity), 0.01)

  // ═══════════════════════════════════════════════════════════
  // SURVEY SPEKTRI GENERATORI
  // ═══════════════════════════════════════════════════════════
  const generateSurveySpectrum = () => {
    const points = []
    const allPeaks = [
      { be: 711.5, intensity: 1.0, label: "Fe 2p", color: "#ef4444" },
      { be: 532.2, intensity: 1.5, label: "O 1s", color: "#f59e0b" },
      { be: 400.0, intensity: 0.4, label: "N 1s", color: "#3b82f6" },
      { be: 285.0, intensity: 1.2, label: "C 1s", color: "#6b7280" },
      { be: 198.5, intensity: 0.7, label: "Cl 2p", color: "#10b981" }
    ]
    for (let i = 0; i <= 250; i++) {
      const be = 100 + (i / 250) * 700
      let intensity = 0.06 * (800 - be) / 700
      allPeaks.forEach(peak => {
        const x = (be - peak.be) / 3.5
        intensity += peak.intensity * Math.exp(-0.5 * x * x)
      })
      points.push({ be, intensity })
    }
    return points
  }

  const surveySpectrum = useMemo(() => generateSurveySpectrum(), [])
  const maxSurvey = Math.max(...surveySpectrum.map(p => p.intensity), 0.01)

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* ═════ HEADER ═════ */}
      <header className="border-b border-purple-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 text-sm mb-3 text-purple-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-purple-300">🏠</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/tahlil" className="hover:text-purple-300">Tahlil</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/tahlil/xps" className="hover:text-purple-300">XPS</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/tahlil/xps/birikmalar" className="hover:text-purple-300">Birikmalar</Link>
            <span className="text-purple-600">›</span>
            <span className="text-red-400 font-semibold">[Fe(H₂O)₆]³⁺</span>
          </nav>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-red-400 flex items-center gap-3">
                <span className="text-3xl">🔬</span>
                <span>[Fe(H₂O)₆]³⁺</span>
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                Geksaakvatemir(III) ioni • Fe³⁺ (d⁵ HS) • S=5/2 • Sariq-jigar rang
              </p>
            </div>
            <Link 
              href="/ilmiy/tahlil/xps/birikmalar"
              className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-2 bg-purple-900/40 px-4 py-2 rounded-lg border border-purple-700/50 transition-colors"
            >
              ← Birikmalar
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* ═════ STATISTIKA ═════ */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">Metal</div>
            <div className="text-xl font-bold text-red-400">Fe³⁺</div>
            <div className="text-[10px] text-purple-400">d⁵ (HS)</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">Geometriya</div>
            <div className="text-xl font-bold text-blue-400">Oₕ</div>
            <div className="text-[10px] text-purple-400">Oktaedrik</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">Fe 2p₃/₂ BE</div>
            <div className="text-xl font-bold text-red-400 font-mono">711.5</div>
            <div className="text-[10px] text-purple-400">eV</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">Spin</div>
            <div className="text-xl font-bold text-red-400">S=5/2</div>
            <div className="text-[10px] text-purple-400">5 toq e⁻</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">μ<sub>eff</sub></div>
            <div className="text-xl font-bold text-yellow-400 font-mono">5.92</div>
            <div className="text-[10px] text-purple-400">BM</div>
          </div>
        </div>

        {/* ═════ ASOSIY MA'LUMOT ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>📋</span> Asosiy ma'lumotlar
          </h2>

          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed text-sm">
              <strong className="text-red-400">[Fe(H₂O)₆]³⁺</strong> (geksaakvatemir(III) ioni) — 
              suv eritmasida Fe³⁺ ning asosiy shakli. Oltita H₂O ligand oktaedrik kompleks hosil qiladi.
              H₂O — <strong>kuchsiz maydon ligandi</strong> (spektrokimyoviy qatorda CN⁻ dan ancha past).
              Shuning uchun Fe³⁺ (d⁵) <strong className="text-red-400">yuqori spin (HS)</strong> 
              konfiguratsiyasini qabul qiladi: <strong className="text-red-400">t₂g³ e<sub>g</sub>²</strong>.
              Barcha <strong>5 ta elektron toq</strong> → maksimal paramagnitlik (S = 5/2, μ ≈ 5.92 BM).
              XPS da <strong>kuchli shake-up satellite (~719 eV)</strong> bilan ajralib turadi —
              bu HS Fe³⁺ ning eng muhim diagnostik belgisi. CFSE = 0 — d⁵ HS holatning o'ziga xos xususiyati.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-red-400 font-bold mb-3">🧪 Kimyoviy xususiyatlar</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-purple-400">Molekulyar massa:</span>
                  <span className="font-mono">196.86 g/mol (ion)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Ligand:</span>
                  <span>6 × H₂O (monodentat)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Koordinatsion son:</span>
                  <span className="font-bold">6</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Oksidlanish darajasi:</span>
                  <span className="font-bold text-red-400">+3</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Rang:</span>
                  <span className="text-yellow-400">Sariq-jigar</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Barqarorlik pH:</span>
                  <span>pH &lt; 2 (gidroliz)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Kislotalilik:</span>
                  <span>pK<sub>a</sub> ≈ 2.2</span>
                </li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-red-400 font-bold mb-3">⚛️ Elektron struktura</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-purple-400">Konfiguratsiya:</span>
                  <span className="font-mono">d⁵ (t₂g³ e<sub>g</sub>²)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Spin holat:</span>
                  <span className="text-red-400 font-bold">Yuqori spin (HS)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Umumiy spin:</span>
                  <span className="font-mono">S = 5/2</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Toq elektronlar:</span>
                  <span className="font-mono text-red-400 font-bold">5 ta</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">μ<sub>eff</sub>:</span>
                  <span className="font-mono">~5.92 BM</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Δ<sub>o</sub>:</span>
                  <span className="font-mono">~14,000 cm⁻¹</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">CFSE:</span>
                  <span className="font-mono text-yellow-400 font-bold">0 Δ<sub>o</sub></span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ═════ XPS SPEKTR SIMULYATORI ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>📊</span> XPS spektr simulyatori
          </h2>

          {/* Region selector */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {Object.keys(xpsPeaks).map(region => (
              <button key={region} onClick={() => setSelectedRegion(region)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  selectedRegion === region ? "bg-red-600 text-white shadow-lg" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
                }`}>{region}</button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-3 mb-4">
            {selectedRegion === "Fe 2p" && (
              <>
                <label className="flex items-center gap-2 cursor-pointer bg-purple-800/30 px-3 py-2 rounded-lg border border-purple-700/30">
                  <input type="checkbox" checked={showSatellite} onChange={(e) => setShowSatellite(e.target.checked)} className="accent-red-500" />
                  <span className="text-xs text-purple-300">Shake-up satellite (719 eV)</span>
                </label>
                <div className="flex gap-1">
                  <button onClick={() => setCompareMode("none")}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${compareMode === "none" ? "bg-red-600 text-white" : "bg-purple-900/50 text-purple-300"}`}>
                    Yolg'iz
                  </button>
                  <button onClick={() => setCompareMode("fe2hs")}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${compareMode === "fe2hs" ? "bg-green-600 text-white" : "bg-purple-900/50 text-purple-300"}`}>
                    vs Fe²⁺ HS
                  </button>
                  <button onClick={() => setCompareMode("fe3ls")}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${compareMode === "fe3ls" ? "bg-orange-600 text-white" : "bg-purple-900/50 text-purple-300"}`}>
                    vs Fe³⁺ LS
                  </button>
                </div>
              </>
            )}
            <label className="flex items-center gap-2 cursor-pointer bg-purple-800/30 px-3 py-2 rounded-lg border border-purple-700/30">
              <input type="checkbox" checked={showSurvey} onChange={(e) => setShowSurvey(e.target.checked)} className="accent-red-500" />
              <span className="text-xs text-purple-300">Survey spektr</span>
            </label>
          </div>

          {/* Spektr */}
          <div className="bg-purple-950/50 rounded-xl p-4">
            {!showSurvey ? (
              <svg viewBox="0 0 600 300" className="w-full h-72">
                <line x1="60" y1="250" x2="580" y2="250" stroke="#4c1d95" strokeWidth="1" />
                <line x1="60" y1="30" x2="60" y2="250" stroke="#4c1d95" strokeWidth="1" />
                <text x="320" y="285" fill="#c4b5fd" fontSize="11" textAnchor="middle">Bog'lanish energiyasi (eV) →</text>
                <text x="25" y="140" fill="#c4b5fd" fontSize="10" textAnchor="middle" transform="rotate(-90, 25, 140)">Intensivlik</text>

                {/* X-axis ticks */}
                {(() => {
                  const peaks = xpsPeaks[selectedRegion]?.filter(p => !p.assign.includes("Shake-up") || showSatellite)
                  if (!peaks || peaks.length === 0) return null
                  const minBE = Math.min(...peaks.map(p => p.be)) - 10
                  const maxBE = Math.max(...peaks.map(p => p.be)) + 18
                  const ticks = []
                  for (let be = Math.ceil(minBE / 5) * 5; be <= maxBE; be += 5) {
                    const x = 60 + ((be - minBE) / (maxBE - minBE)) * 520
                    ticks.push(<g key={be}><line x1={x} y1="250" x2={x} y2="255" stroke="#6b7280" strokeWidth="1" /><text x={x} y="268" fill="#9ca3af" fontSize="9" textAnchor="middle">{be}</text></g>)
                  }
                  return ticks
                })()}

                {/* Fill */}
                <polygon points={`60,250 ` + spectrum.map((p, i) => `${60 + (i / 250) * 520},${250 - (p.intensity / maxIntensity) * 210}`).join(' ') + ` 580,250`} fill="#ef4444" opacity="0.12" />
                
                {/* Main curve */}
                <polyline points={spectrum.map((p, i) => `${60 + (i / 250) * 520},${250 - (p.intensity / maxIntensity) * 210}`).join(' ')} fill="none" stroke="#ef4444" strokeWidth="2" />

                {/* Peak labels */}
                {xpsPeaks[selectedRegion]?.filter(p => !p.assign.includes("Shake-up") || showSatellite).map((peak, i) => {
                  const peaks = xpsPeaks[selectedRegion].filter(p => !p.assign.includes("Shake-up") || showSatellite)
                  const minBE = Math.min(...peaks.map(p => p.be)) - 10
                  const maxBE = Math.max(...peaks.map(p => p.be)) + 18
                  const x = 60 + ((peak.be - minBE) / (maxBE - minBE)) * 520
                  const isSat = peak.assign.includes("Shake-up")
                  return (
                    <g key={i}>
                      <line x1={x} y1="30" x2={x} y2="250" stroke={isSat ? "#f59e0b" : "#fbbf24"} strokeWidth="1" strokeDasharray="2,2" opacity="0.5" />
                      <text x={x} y="25" fill={isSat ? "#f59e0b" : "#fbbf24"} fontSize="9" textAnchor="middle" fontWeight="bold">{peak.orbital}</text>
                      <text x={x} y="15" fill={isSat ? "#f59e0b" : "#fbbf24"} fontSize="8" textAnchor="middle">{peak.be} eV</text>
                    </g>
                  )
                })}

                {/* Legend */}
                <text x="500" y="45" fill="#ef4444" fontSize="9" textAnchor="end" fontWeight="bold">[Fe(H₂O)₆]³⁺ (HS Fe³⁺)</text>
                {compareMode === "fe2hs" && <text x="500" y="60" fill="#10b981" fontSize="9" textAnchor="end">[Fe(H₂O)₆]²⁺ (HS Fe²⁺)</text>}
                {compareMode === "fe3ls" && <text x="500" y="60" fill="#f97316" fontSize="9" textAnchor="end">K₃[Fe(CN)₆] (LS Fe³⁺)</text>}
              </svg>
            ) : (
              <svg viewBox="0 0 600 300" className="w-full h-72">
                <line x1="60" y1="250" x2="580" y2="250" stroke="#4c1d95" strokeWidth="1" />
                <line x1="60" y1="30" x2="60" y2="250" stroke="#4c1d95" strokeWidth="1" />
                <text x="320" y="285" fill="#c4b5fd" fontSize="11" textAnchor="middle">Bog'lanish energiyasi (eV)</text>
                <polygon points={`60,250 ` + surveySpectrum.map((p, i) => `${60 + (i / 250) * 520},${250 - (p.intensity / maxSurvey) * 210}`).join(' ') + ` 580,250`} fill="#a855f7" opacity="0.12" />
                <polyline points={surveySpectrum.map((p, i) => `${60 + (i / 250) * 520},${250 - (p.intensity / maxSurvey) * 210}`).join(' ')} fill="none" stroke="#a855f7" strokeWidth="2" />
                {[{ be: 711.5, label: "Fe 2p", color: "#ef4444" }, { be: 532.2, label: "O 1s", color: "#f59e0b" }, { be: 400.0, label: "N 1s", color: "#3b82f6" }, { be: 285.0, label: "C 1s", color: "#6b7280" }, { be: 198.5, label: "Cl 2p", color: "#10b981" }].map((peak, i) => {
                  const x = 60 + ((peak.be - 100) / 700) * 520
                  return (<g key={i}><line x1={x} y1="30" x2={x} y2="250" stroke={peak.color} strokeWidth="1" strokeDasharray="2,2" opacity="0.5" /><text x={x} y="25" fill={peak.color} fontSize="9" textAnchor="middle" fontWeight="bold">{peak.label}</text></g>)
                })}
              </svg>
            )}
          </div>

          {/* Info grid */}
          {!showSurvey && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
              {xpsPeaks[selectedRegion]?.filter(p => !p.assign.includes("Shake-up") || showSatellite).map((peak, i) => (
                <div key={i} className={`rounded-lg p-3 border ${peak.assign.includes("Shake-up") ? "bg-orange-900/20 border-orange-500/30" : "bg-purple-900/50 border-purple-700/30"}`}>
                  <p className="text-purple-400 text-xs mb-1">{peak.orbital}</p>
                  <p className={`${peak.assign.includes("Shake-up") ? "text-orange-400" : "text-red-400"} font-bold font-mono text-lg`}>{peak.be} eV</p>
                  <p className="text-purple-300 text-[10px]">{peak.assign}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ═════ SURVEY TARKIB ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><span>⚛️</span> Elementlar tarkibi (Survey XPS)</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {surveyData.map((el, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
                <div className="flex items-center gap-2 mb-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: el.color }}></div><p className="font-bold text-white">{el.element}</p></div>
                <p className="text-purple-400 text-xs mb-1">{el.orbital}</p>
                <p className="text-red-400 font-bold font-mono text-sm">{el.be} eV</p>
                <p className="text-purple-300 text-xs mt-1">{el.atomic_percent.toFixed(1)} at.%</p>
                <p className="text-purple-500 text-[10px] mt-1">{el.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-red-600/10 border border-red-500/30 rounded-lg p-3 text-xs text-purple-200">
            <p><strong className="text-red-400">💡 Eslatma:</strong> H atomlari XPS da ko'rinmaydi (1s BE ~13.6 eV). C va N signallari — sirt iflosliklari va atmosfera gazlari. Cl⁻ — counterion ([Fe(H₂O)₆]Cl₃).</p>
          </div>
        </div>

        {/* ═════ KRISTALL MAYDON DIAGRAMMASI ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><span>📊</span> Kristall maydon diagrammasi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-950/50 rounded-xl p-5">
              <svg viewBox="0 0 300 380" className="w-full h-96">
                <line x1="40" y1="20" x2="40" y2="320" stroke="#c4b5fd" strokeWidth="2" />
                <text x="18" y="170" fill="#c4b5fd" fontSize="11" textAnchor="middle" transform="rotate(-90, 18, 170)">Energiya</text>

                {/* e_g */}
                <line x1="100" y1="60" x2="220" y2="60" stroke="#ef4444" strokeWidth="3" />
                <line x1="100" y1="80" x2="220" y2="80" stroke="#ef4444" strokeWidth="3" />
                <text x="250" y="70" fill="#ef4444" fontSize="12" fontWeight="bold">e<tspan baselineShift="sub" fontSize="8">g</tspan></text>
                <circle cx="130" cy="70" r="6" fill="#fbbf24" /><circle cx="160" cy="70" r="6" fill="#fbbf24" />
                <text x="128" y="68" fill="#1a1a2e" fontSize="7" textAnchor="middle">↑</text>
                <text x="162" y="68" fill="#1a1a2e" fontSize="7" textAnchor="middle">↑</text>

                {/* Δ_o */}
                <line x1="80" y1="70" x2="80" y2="210" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,3" />
                <text x="72" y="140" fill="#fbbf24" fontSize="11" textAnchor="end">Δ<tspan baselineShift="sub" fontSize="8">o</tspan></text>
                <text x="72" y="155" fill="#fbbf24" fontSize="9" textAnchor="end">14,000</text>
                <text x="72" y="167" fill="#fbbf24" fontSize="8" textAnchor="end">cm⁻¹</text>

                {/* t_2g */}
                <line x1="100" y1="190" x2="220" y2="190" stroke="#10b981" strokeWidth="3" />
                <line x1="100" y1="210" x2="220" y2="210" stroke="#10b981" strokeWidth="3" />
                <line x1="100" y1="230" x2="220" y2="230" stroke="#10b981" strokeWidth="3" />
                <text x="250" y="210" fill="#10b981" fontSize="12" fontWeight="bold">t<tspan baselineShift="sub" fontSize="8">2g</tspan></text>
                <circle cx="130" cy="200" r="6" fill="#fbbf24" /><circle cx="130" cy="220" r="6" fill="#fbbf24" /><circle cx="130" cy="240" r="6" fill="#fbbf24" />
                <text x="128" y="198" fill="#1a1a2e" fontSize="7" textAnchor="middle">↑</text>
                <text x="128" y="218" fill="#1a1a2e" fontSize="7" textAnchor="middle">↑</text>
                <text x="128" y="238" fill="#1a1a2e" fontSize="7" textAnchor="middle">↑</text>

                {/* Labels */}
                <text x="160" y="280" fill="#c4b5fd" fontSize="12" textAnchor="middle" fontWeight="bold">Fe³⁺ (d⁵ HS)</text>
                <text x="160" y="298" fill="#10b981" fontSize="11" textAnchor="middle">t₂g³ e<tspan baselineShift="sub" fontSize="8">g</tspan>²</text>
                <text x="160" y="316" fill="#ef4444" fontSize="11" textAnchor="middle">S = 5/2 (5 toq e⁻)</text>
                <text x="160" y="334" fill="#fbbf24" fontSize="11" textAnchor="middle" fontWeight="bold">CFSE = 0</text>
                <text x="160" y="352" fill="#f59e0b" fontSize="10" textAnchor="middle">μ = 5.92 BM</text>
              </svg>
            </div>

            <div className="space-y-4">
              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-red-400 font-bold mb-3">Nima uchun yuqori spin?</h3>
                <p className="text-purple-200 text-sm leading-relaxed">
                  H₂O — <strong>kuchsiz maydon ligandi</strong>. Δ<sub>o</sub> (14,000 cm⁻¹) pairing energiyasi P dan kichik.
                  Shuning uchun elektronlar e<sub>g</sub> orbitallarga ham joylashadi.
                  d⁵ da HS holatda <strong>barcha 5 elektron toq</strong> → Hund qoidasining ideal namoyishi.
                </p>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-5">
                <h3 className="text-yellow-400 font-bold mb-3">CFSE = 0 — noyob holat!</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-purple-200">CFSE = (n<sub>t₂g</sub> × -0.4 + n<sub>e<sub>g</sub></sub> × 0.6) × Δ<sub>o</sub></p>
                  <p className="text-purple-200">= (3 × -0.4 + 2 × 0.6) × Δ<sub>o</sub></p>
                  <p className="text-purple-200">= (-1.2 + 1.2) × Δ<sub>o</sub></p>
                  <p className="text-yellow-400 font-bold text-lg">= 0 Δ<sub>o</sub></p>
                  <p className="text-purple-300 text-xs mt-2">
                    d⁵ HS — yagona holatki, kristall maydon stabillashuvi <strong>nolga teng</strong>.
                    Bu kompleksning barqarorligi faqat elektrostatik tortishishga bog'liq.
                  </p>
                </div>
              </div>

              <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-5">
                <h3 className="text-red-400 font-bold mb-2">Maksimal paramagnitlik</h3>
                <p className="text-purple-200 text-xs leading-relaxed">
                  5 ta toq elektron → <strong>μ<sub>eff</sub> = √(5×7) = √35 ≈ 5.92 BM</strong>.
                  Bu birinchi qator o'tish metallari orasida <strong>eng yuqori spin-only qiymat</strong>.
                  Faqat Mn²⁺ (d⁵ HS) va Fe³⁺ (d⁵ HS) bu qiymatga ega.
                </p>
              </div>

              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-red-400 font-bold mb-2">XPS bilan bog'liqlik</h3>
                <p className="text-purple-200 text-xs leading-relaxed">
                  5 ta toq elektron → kuchli <strong>multiplet ajralish</strong> → Fe 2p piklari kengaygan (FWHM ≈ 2.5 eV).
                  <strong> Shake-up satellite (719 eV)</strong> — valent elektronning qo'zg'alishi natijasi.
                  LS holatda bu satellite yo'q yoki juda kuchsiz.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ═════ GIDROLIZ BOSQICHLARI ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><span>💧</span> Gidroliz bosqichlari (pH ta'siri)</h2>
          
          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 text-sm leading-relaxed">
              [Fe(H₂O)₆]³⁺ — <strong>kuchli kislota</strong> (pK<sub>a</sub> ≈ 2.2). pH oshishi bilan ketma-ket gidroliz sodir bo'ladi.
              Har bir bosqichda Fe ning kimyoviy muhiti o'zgaradi → <strong>XPS da BE siljishi</strong> kuzatiladi.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {gidrolizSteps.map((step, i) => (
              <button key={i} onClick={() => setActiveGidroliz(i)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  activeGidroliz === i 
                    ? "bg-red-600/30 border-red-500/50 ring-1 ring-red-500/30" 
                    : "bg-purple-800/30 border-purple-700/30 hover:bg-purple-800/50"
                }`}>
                <p className="text-xs text-purple-400 mb-1">pH {step.ph}</p>
                <p className="font-mono text-sm font-bold text-white mb-1">{step.formula}</p>
                <p className="text-xs" style={{ color: step.rang.includes("cho'kma") ? "#f59e0b" : "#e5e7eb" }}>{step.rang}</p>
                <p className="text-[10px] text-purple-500 mt-1">Zaryad: {step.charge}</p>
              </button>
            ))}
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h3 className="text-red-400 font-bold mb-3">
              {gidrolizSteps[activeGidroliz].formula} — XPS xususiyatlari
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-purple-400 text-xs mb-1">Fe 2p₃/₂ BE</p>
                <p className="text-red-400 font-bold font-mono text-lg">
                  {(711.5 + activeGidroliz * 0.5).toFixed(1)} eV
                </p>
                <p className="text-purple-500 text-[10px]">Gidroliz oshishi → BE oshadi</p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-purple-400 text-xs mb-1">O 1s komponentlari</p>
                <p className="text-yellow-400 font-bold">
                  {activeGidroliz === 0 ? "Faqat H₂O (532.2)" : activeGidroliz < 3 ? "H₂O + OH⁻" : "Faqat OH⁻/O²⁻"}
                </p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-purple-400 text-xs mb-1">Satellit</p>
                <p className="text-orange-400 font-bold">
                  {activeGidroliz < 3 ? "719 eV (HS)" : "Yo'qoladi (polimer)"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ═════ FE²⁺ vs FE³⁺ SOLISHTIRISH ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><span>🔄</span> [Fe(H₂O)₆]²⁺ vs [Fe(H₂O)₆]³⁺ — to'liq solishtirish</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-left text-purple-300">Xususiyat</th>
                <th className="py-3 px-4 text-center text-green-400">[Fe(H₂O)₆]²⁺</th>
                <th className="py-3 px-4 text-center text-red-400">[Fe(H₂O)₆]³⁺</th>
                <th className="py-3 px-4 text-center text-yellow-400">Farq</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Oksidlanish darajasi", "+2", "+3", "+1"],
                  ["d-elektronlar", "d⁶", "d⁵", "-1"],
                  ["Konfiguratsiya", "t₂g⁴ e_g²", "t₂g³ e_g²", "—"],
                  ["Spin holat", "HS (S=2)", "HS (S=5/2)", "+½"],
                  ["Toq elektronlar", "4 ta", "5 ta", "+1"],
                  ["μ_eff (BM)", "~4.90", "~5.92", "+1.02"],
                  ["Δ_o (cm⁻¹)", "10,400", "14,000", "+3,600"],
                  ["CFSE", "-0.4 Δ_o", "0 Δ_o", "+0.4 Δ_o"],
                  ["Fe 2p₃/₂ BE (eV)", "710.0", "711.5", "+1.5"],
                  ["Satellit pozitsiyasi", "~715 eV", "~719 eV", "+4 eV"],
                  ["Satellit intensivligi", "Kuchli", "Juda kuchli", "↑"],
                  ["Pik kengligi (FWHM)", "~2.2 eV", "~2.5 eV", "+0.3"],
                  ["Rang", "Och yashil", "Sariq-jigar", "—"],
                  ["pK_a", "~9.5", "~2.2", "-7.3"],
                  ["Gidroliz", "Kuchsiz", "Kuchli", "↑"]
                ].map((r, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 ${i >= 8 && i <= 11 ? 'bg-red-900/10' : ''}`}>
                    <td className="py-2 px-4 font-semibold">{r[0]}</td>
                    <td className="py-2 px-4 text-center">{r[1]}</td>
                    <td className="py-2 px-4 text-center">{r[2]}</td>
                    <td className="py-2 px-4 text-center text-yellow-400 font-mono">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 bg-amber-600/10 border border-amber-500/30 rounded-lg p-4 text-xs text-purple-200">
            <p className="mb-2"><strong className="text-amber-400">💡 XPS diagnostikasi — 3 ta belgi:</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li><strong>BE siljishi:</strong> Fe³⁺ BEsi Fe²⁺ dan ~1.5 eV yuqori</li>
              <li><strong>Satellit pozitsiyasi:</strong> 719 eV (Fe³⁺) vs 715 eV (Fe²⁺) — 4 eV farq</li>
              <li><strong>Pik kengligi:</strong> Fe³⁺ kengroq (multiplet ajralish kuchliroq)</li>
            </ol>
            <p className="mt-2">Uchala parametr birgalikda <strong>aniq identifikatsiya</strong> beradi.</p>
          </div>
        </div>

        {/* ═════ QO'LLANILISH ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><span>🏭</span> Amaliy qo'llanilishi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-3xl mb-3">💧</div>
              <h3 className="text-red-400 font-bold mb-2 text-sm">Suv tozalash</h3>
              <p className="text-purple-200 text-xs leading-relaxed">
                FeCl₃ va Fe₂(SO₄)₃ — <strong>koagulyantlar</strong>. Fe(OH)₃ cho'kmasi iflosliklarni adsorbsiya qiladi.
                Ichimlik suvi va oqova suv tozalashda keng qo'llaniladi.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-3xl mb-3">🧪</div>
              <h3 className="text-red-400 font-bold mb-2 text-sm">Analitik kimyo</h3>
              <p className="text-purple-200 text-xs leading-relaxed">
                SCN⁻ bilan <strong>qizil [Fe(SCN)(H₂O)₅]²⁺</strong> — Fe³⁺ uchun sifat reaksiyasi.
                Kolorimetrik aniqlash, fotometriya. Sezgirlik: 0.1 mg/L gacha.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-3xl mb-3">🏗️</div>
              <h3 className="text-red-400 font-bold mb-2 text-sm">Korroziya tadqiqoti</h3>
              <p className="text-purple-200 text-xs leading-relaxed">
                Temir korroziyasida <strong>Fe²⁺ → Fe³⁺ oksidlanish</strong> bosqichi.
                XPS orqali sirt tarkibini monitoring qilish. Zang (Fe₂O₃·nH₂O) hosil bo'lish mexanizmi.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-3xl mb-3">🧬</div>
              <h3 className="text-red-400 font-bold mb-2 text-sm">Biologik ahamiyat</h3>
              <p className="text-purple-200 text-xs leading-relaxed">
                <strong>Ferritin</strong> — Fe³⁺ HS holatida saqlanadi (4500 tagacha Fe atomi).
                <strong>Transferrin</strong> — Fe³⁺ tashish. Gemoglobin sintezi uchun Fe³⁺ → Fe²⁺ qaytarilishi kerak.
              </p>
            </div>
          </div>
        </div>

        {/* ═════ TARIX ═════ */}
        <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 border border-red-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-red-300 mb-4 flex items-center gap-2"><span>📜</span> Tarixiy kontekst</h2>
          <div className="space-y-3 text-sm text-red-100/90">
            <p><strong className="text-red-300">Qadimdan</strong> — Fe³⁺ tuzlari (temir kuporosi, FeSO₄·7H₂O) bo'yoq, dorivor modda va siyoh sifatida ishlatilgan.</p>
            <p><strong className="text-red-300">1893</strong> — Alfred Werner koordinatsion nazariyasini taklif qildi. [Fe(H₂O)₆]³⁺ klassik misol bo'ldi.</p>
            <p><strong className="text-red-300">1930-yillar</strong> — Pauling va Van Vleck ligand maydon nazariyasini rivojlantirdi. d⁵ HS holati tushuntirildi.</p>
            <p><strong className="text-red-300">1954</strong> — Orgel Tanabe-Sugano diagrammalarini yaratdi. d⁵ HS spektral xususiyatlari to'liq tushuntirildi.</p>
            <p><strong className="text-red-300">1970-yillar</strong> — XPS orqali <strong>719 eV satellite</strong> HS Fe³⁺ ning asosiy diagnostik belgisi sifatida tasdiqlandi.</p>
            <p><strong className="text-red-300">Hozirgi kun</strong> — [Fe(H₂O)₆]³⁺ XPS da <strong>Fe³⁺ standarti</strong>. Korroziya, kataliz, biologiya tadqiqotlarida keng qo'llaniladi.</p>
          </div>
        </div>

        {/* ═════ XULOSA ═════ */}
        <div className="bg-gradient-to-r from-red-600/10 to-purple-600/10 border border-red-500/20 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><span>✅</span> Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>[Fe(H₂O)₆]³⁺ — <strong className="text-red-400">klassik yuqori spinli Fe³⁺ kompleksi</strong></li>
            <li>Fe³⁺ (d⁵) — <strong>t₂g³ e_g²</strong>, S=5/2, 5 ta toq elektron</li>
            <li><strong>Fe 2p₃/₂ BE = 711.5 eV</strong> — HS Fe³⁺ uchun xarakterli</li>
            <li><strong>Kuchli shake-up satellite (719 eV)</strong> — HS ning asosiy diagnostik belgisi</li>
            <li>[Fe(H₂O)₆]²⁺ bilan <strong>BE farqi +1.5 eV</strong>, satellite farqi <strong>+4 eV</strong></li>
            <li><strong>CFSE = 0</strong> — d⁵ HS da kristall maydon stabillashuvi yo'q (noyob!)</li>
            <li>μ<sub>eff</sub> ≈ <strong>5.92 BM</strong> — birinchi qator metallar orasida maksimal</li>
            <li><strong>Gidroliz</strong> — pH &gt; 2 da ketma-ket OH⁻ almashinuvi</li>
            <li>Suv tozalash, analitik kimyo, korroziya, biologiyada muhim</li>
            <li>XPS da <strong>Fe³⁺ standarti</strong> sifatida ishlatiladi</li>
          </ol>
        </div>

        {/* ═════ NAVIGATSIYA ═════ */}
        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/xps/birikmalar/fe-h2o6-2" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 transition-all text-purple-300">← [Fe(H₂O)₆]²⁺</Link>
          <Link href="/ilmiy/tahlil/xps/birikmalar/cu-nh3-4" className="px-6 py-3 bg-red-600/80 rounded-xl hover:bg-red-500 text-white font-semibold">Keyingi: [Cu(NH₃)₄]²⁺ →</Link>
        </div>
      </section>
    </main>
  )
}