"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════
// XPS MA'LUMOTLAR BAZASI — [Cu(CN)₄]³⁻
// ═══════════════════════════════════════════════════════════
const xpsPeaks = {
  "Cu 2p": [
    { orbital: "Cu 2p₃/₂", be: 932.5, intensity: 1.0, fwhm: 1.4, assign: "Cu⁺ (d¹⁰)" },
    { orbital: "Cu 2p₁/₂", be: 952.3, intensity: 0.5, fwhm: 1.4, assign: "SO split (Δ=19.8 eV)" }
  ],
  "C 1s": [
    { orbital: "C 1s (CN⁻)", be: 285.8, intensity: 1.0, fwhm: 1.2, assign: "Sianid uglerod" },
    { orbital: "C 1s (ads)", be: 284.8, intensity: 0.3, fwhm: 1.0, assign: "Sirt iflosligi" }
  ],
  "N 1s": [
    { orbital: "N 1s (CN⁻)", be: 398.2, intensity: 1.0, fwhm: 1.2, assign: "Sianid azot" },
    { orbital: "N 1s (ads)", be: 400.0, intensity: 0.15, fwhm: 1.4, assign: "Adsorbsion N₂" }
  ]
}

const surveyData = [
  { element: "Cu", orbital: "2p₃/₂", be: 932.5, atomic_percent: 11.1, color: "#ef4444", desc: "Markaziy metal (Cu⁺)" },
  { element: "C", orbital: "1s", be: 285.8, atomic_percent: 44.4, color: "#6b7280", desc: "CN⁻ ligand" },
  { element: "N", orbital: "1s", be: 398.2, atomic_percent: 44.4, color: "#3b82f6", desc: "CN⁻ ligand" },
  { element: "K", orbital: "2p₃/₂", be: 293.0, atomic_percent: 0.0, color: "#a855f7", desc: "Counterion (agar K₃)" },
  { element: "O", orbital: "1s", be: 532.0, atomic_percent: 0.0, color: "#f59e0b", desc: "Sirt iflosligi" }
]

export default function CuCN4() {
  const [selectedRegion, setSelectedRegion] = useState("Cu 2p")
  const [showSurvey, setShowSurvey] = useState(false)
  const [compareMode, setCompareMode] = useState("none") // none, cu2, cu0

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

      peaks.forEach(peak => {
        const x = (be - peak.be) / peak.fwhm
        intensity += peak.intensity * Math.exp(-0.5 * x * x)
      })

      // Solishtirish rejimlari
      if (refMode === "cu2" && region === "Cu 2p") {
        // Cu²⁺ (d⁹) — satellite BOR
        const x1 = (be - 934.0) / 2.0
        intensity += 0.85 * Math.exp(-0.5 * x1 * x1)
        const x2 = (be - 953.8) / 2.0
        intensity += 0.42 * Math.exp(-0.5 * x2 * x2)
        // Shake-up satellites
        const xs1 = (be - 941.5) / 2.8
        intensity += 0.40 * Math.exp(-0.5 * xs1 * xs1)
        const xs2 = (be - 944.0) / 2.5
        intensity += 0.25 * Math.exp(-0.5 * xs2 * xs2)
      } else if (refMode === "cu0" && region === "Cu 2p") {
        // Cu⁰ metall
        const x1 = (be - 932.6) / 1.3
        intensity += 0.90 * Math.exp(-0.5 * x1 * x1)
        const x2 = (be - 952.4) / 1.3
        intensity += 0.45 * Math.exp(-0.5 * x2 * x2)
        // Asimmetrik tail
        if (be > 932.6) {
          intensity += 0.10 * Math.exp(-(be - 932.6) / 4)
        }
      }

      // Fon
      const bg = 0.05 * (maxBE - be) / (maxBE - minBE)
      intensity += bg

      points.push({ be, intensity })
    }
    return points
  }

  const spectrum = useMemo(() =>
    generateSpectrum(selectedRegion, compareMode),
    [selectedRegion, compareMode]
  )

  const maxIntensity = Math.max(...spectrum.map(p => p.intensity), 0.01)

  // ═══════════════════════════════════════════════════════════
  // SURVEY SPEKTRI
  // ═══════════════════════════════════════════════════════════
  const generateSurveySpectrum = () => {
    const points = []
    const allPeaks = [
      { be: 932.5, intensity: 1.0, label: "Cu 2p", color: "#ef4444" },
      { be: 532.0, intensity: 0.3, label: "O 1s", color: "#f59e0b" },
      { be: 398.2, intensity: 1.3, label: "N 1s", color: "#3b82f6" },
      { be: 285.8, intensity: 1.3, label: "C 1s", color: "#6b7280" }
    ]
    for (let i = 0; i <= 250; i++) {
      const be = 100 + (i / 250) * 900
      let intensity = 0.04 * (1000 - be) / 900
      allPeaks.forEach(peak => {
        const x = (be - peak.be) / 4
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
            <span className="text-cyan-400 font-semibold">[Cu(CN)₄]³⁻</span>
          </nav>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-cyan-400 flex items-center gap-3">
                <span className="text-3xl">🔬</span>
                <span>[Cu(CN)₄]³⁻</span>
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                Tetratsianokuprat(I) ioni • Cu⁺ (d¹⁰) • Diamagnit • Rangsiz
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
            <div className="text-xl font-bold text-cyan-400">Cu⁺</div>
            <div className="text-[10px] text-purple-400">d¹⁰</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">Geometriya</div>
            <div className="text-xl font-bold text-teal-400">T<sub>d</sub></div>
            <div className="text-[10px] text-purple-400">Tetraedrik</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">Cu 2p₃/₂ BE</div>
            <div className="text-xl font-bold text-cyan-400 font-mono">932.5</div>
            <div className="text-[10px] text-purple-400">eV</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">Spin</div>
            <div className="text-xl font-bold text-green-400">S=0</div>
            <div className="text-[10px] text-purple-400">Diamagnit</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-xs text-purple-400 mb-1">Satellit</div>
            <div className="text-xl font-bold text-green-400">YO'Q</div>
            <div className="text-[10px] text-purple-400">d¹⁰ to'lgan</div>
          </div>
        </div>

        {/* ═════ ASOSIY MA'LUMOT ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>📋</span> Asosiy ma'lumotlar
          </h2>

          <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed text-sm">
              <strong className="text-cyan-400">[Cu(CN)₄]³⁻</strong> (tetratsianokuprat(I) ioni) —
              Cu⁺ ning sianidli kompleksidir. Cu⁺ (d¹⁰) konfiguratsiyasi tufayli
              <strong> barcha d-orbitallar to'lgan</strong> → diamagnit, rangsiz.
              CN⁻ — kuchli maydon ligandi va kuchli π-akseptor → Cu⁺ ni barqarorlashtiradi.
              XPS da <strong>shake-up satellitlar yo'q</strong> — bu d¹⁰ konfiguratsiyasining asosiy belgisi.
              [Cu(NH₃)₄]²⁺ (d⁹) dan farqli o'laroq, bu yerda LMCT mumkin emas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-cyan-400 font-bold mb-3">🧪 Kimyoviy xususiyatlar</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-purple-400">Molekulyar massa:</span>
                  <span className="font-mono">141.64 g/mol (ion)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Ligand:</span>
                  <span>4 × CN⁻</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Koordinatsion son:</span>
                  <span className="font-bold">4 (tetraedrik)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Oksidlanish darajasi:</span>
                  <span className="font-bold text-cyan-400">+1</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Rang:</span>
                  <span className="text-green-400">Rangsiz</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Barqarorlik:</span>
                  <span>log β₄ ≈ 30.3</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Zaharlilik:</span>
                  <span className="text-red-400 font-bold">Juda zaharli (CN⁻)</span>
                </li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-cyan-400 font-bold mb-3">⚛️ Elektron struktura</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-purple-400">Konfiguratsiya:</span>
                  <span className="font-mono">d¹⁰ (to'lgan)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">JT effekt:</span>
                  <span className="text-green-400 font-bold">Yo'q (d¹⁰)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Umumiy spin:</span>
                  <span className="font-mono">S = 0</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">Toq elektronlar:</span>
                  <span className="font-mono text-green-400 font-bold">0 ta</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">μ<sub>eff</sub>:</span>
                  <span className="font-mono">0 BM</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">d-d o'tish:</span>
                  <span className="text-green-400">Mavjud emas</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-purple-400">π-backbonding:</span>
                  <span className="text-cyan-400 font-bold">Kuchli</span>
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
                  selectedRegion === region ? "bg-cyan-600 text-white shadow-lg" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
                }`}>{region}</button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-3 mb-4">
            {selectedRegion === "Cu 2p" && (
              <div className="flex gap-1">
                <button onClick={() => setCompareMode("none")}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${compareMode === "none" ? "bg-cyan-600 text-white" : "bg-purple-900/50 text-purple-300"}`}>
                  Yolg'iz
                </button>
                <button onClick={() => setCompareMode("cu2")}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${compareMode === "cu2" ? "bg-blue-600 text-white" : "bg-purple-900/50 text-purple-300"}`}>
                  vs Cu²⁺ (d⁹)
                </button>
                <button onClick={() => setCompareMode("cu0")}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${compareMode === "cu0" ? "bg-yellow-600 text-white" : "bg-purple-900/50 text-purple-300"}`}>
                  vs Cu⁰ (metall)
                </button>
              </div>
            )}
            <label className="flex items-center gap-2 cursor-pointer bg-purple-800/30 px-3 py-2 rounded-lg border border-purple-700/30">
              <input type="checkbox" checked={showSurvey} onChange={(e) => setShowSurvey(e.target.checked)} className="accent-cyan-500" />
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
                  const peaks = xpsPeaks[selectedRegion]
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
                <polygon points={`60,250 ` + spectrum.map((p, i) => `${60 + (i / 250) * 520},${250 - (p.intensity / maxIntensity) * 210}`).join(' ') + ` 580,250`} fill="#06b6d4" opacity="0.12" />

                {/* Main curve */}
                <polyline points={spectrum.map((p, i) => `${60 + (i / 250) * 520},${250 - (p.intensity / maxIntensity) * 210}`).join(' ')} fill="none" stroke="#06b6d4" strokeWidth="2" />

                {/* Peak labels */}
                {xpsPeaks[selectedRegion]?.map((peak, i) => {
                  const peaks = xpsPeaks[selectedRegion]
                  const minBE = Math.min(...peaks.map(p => p.be)) - 10
                  const maxBE = Math.max(...peaks.map(p => p.be)) + 18
                  const x = 60 + ((peak.be - minBE) / (maxBE - minBE)) * 520
                  return (
                    <g key={i}>
                      <line x1={x} y1="30" x2={x} y2="250" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2,2" opacity="0.5" />
                      <text x={x} y="25" fill="#fbbf24" fontSize="9" textAnchor="middle" fontWeight="bold">{peak.orbital}</text>
                      <text x={x} y="15" fill="#fbbf24" fontSize="8" textAnchor="middle">{peak.be} eV</text>
                    </g>
                  )
                })}

                {/* Legend */}
                <text x="500" y="45" fill="#06b6d4" fontSize="9" textAnchor="end" fontWeight="bold">[Cu(CN)₄]³⁻ (Cu⁺ d¹⁰)</text>
                {compareMode === "cu2" && <text x="500" y="60" fill="#3b82f6" fontSize="9" textAnchor="end">Cu²⁺ (d⁹, satellite bor)</text>}
                {compareMode === "cu0" && <text x="500" y="60" fill="#eab308" fontSize="9" textAnchor="end">Cu⁰ (metall)</text>}

                {/* "No satellite" annotation */}
                {selectedRegion === "Cu 2p" && compareMode === "none" && (
                  <g>
                    <rect x="350" y="80" width="140" height="30" rx="5" fill="#10b981" opacity="0.2" />
                    <text x="420" y="100" fill="#10b981" fontSize="10" textAnchor="middle" fontWeight="bold">✅ Satellite YO'Q</text>
                  </g>
                )}
              </svg>
            ) : (
              <svg viewBox="0 0 600 300" className="w-full h-72">
                <line x1="60" y1="250" x2="580" y2="250" stroke="#4c1d95" strokeWidth="1" />
                <line x1="60" y1="30" x2="60" y2="250" stroke="#4c1d95" strokeWidth="1" />
                <text x="320" y="285" fill="#c4b5fd" fontSize="11" textAnchor="middle">Bog'lanish energiyasi (eV)</text>
                <polygon points={`60,250 ` + surveySpectrum.map((p, i) => `${60 + (i / 250) * 520},${250 - (p.intensity / maxSurvey) * 210}`).join(' ') + ` 580,250`} fill="#a855f7" opacity="0.12" />
                <polyline points={surveySpectrum.map((p, i) => `${60 + (i / 250) * 520},${250 - (p.intensity / maxSurvey) * 210}`).join(' ')} fill="none" stroke="#a855f7" strokeWidth="2" />
                {[{ be: 932.5, label: "Cu 2p", color: "#ef4444" }, { be: 398.2, label: "N 1s", color: "#3b82f6" }, { be: 285.8, label: "C 1s", color: "#6b7280" }].map((peak, i) => {
                  const x = 60 + ((peak.be - 100) / 900) * 520
                  return (<g key={i}><line x1={x} y1="30" x2={x} y2="250" stroke={peak.color} strokeWidth="1" strokeDasharray="2,2" opacity="0.5" /><text x={x} y="25" fill={peak.color} fontSize="9" textAnchor="middle" fontWeight="bold">{peak.label}</text></g>)
                })}
              </svg>
            )}
          </div>

          {/* Info grid */}
          {!showSurvey && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
              {xpsPeaks[selectedRegion]?.map((peak, i) => (
                <div key={i} className="bg-purple-900/50 rounded-lg p-3 border border-purple-700/30">
                  <p className="text-purple-400 text-xs mb-1">{peak.orbital}</p>
                  <p className="text-cyan-400 font-bold font-mono text-lg">{peak.be} eV</p>
                  <p className="text-purple-300 text-[10px]">{peak.assign}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ═════ D¹⁰ vs D⁹ — SATELLIT DIAGNOSTIKASI ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>📡</span> d¹⁰ vs d⁹ — Nima uchun satellite yo'q?
          </h2>

          <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 text-sm leading-relaxed">
              <strong className="text-cyan-400">Shake-up satellite</strong> hosil bo'lishi uchun fotoelektron chiqarilganda
              valent elektron <strong>liganddan metallga ko'chishi</strong> kerak (LMCT: d⁹ → d¹⁰L̄).
              Cu⁺ (d¹⁰) da <strong>d-qobiq allaqachon to'lgan</strong> → qo'shimcha elektron joylasholmaydi →
              LMCT mumkin emas → <strong>satellite yo'q</strong>. Bu d¹⁰ konfiguratsiyasining eng ishonchli XPS belgisi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cu⁺ d¹⁰ */}
            <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-3 flex items-center gap-2">
                <span className="text-2xl">✅</span> Cu⁺ (d¹⁰) — Satellite YO'Q
              </h3>
              <svg viewBox="0 0 280 180" className="w-full h-44">
                {/* d-orbitallar */}
                <text x="140" y="20" fill="#10b981" fontSize="10" textAnchor="middle" fontWeight="bold">d¹⁰ — To'lgan qobiq</text>
                
                {/* 5 ta d-orbital */}
                <line x1="40" y1="60" x2="80" y2="60" stroke="#10b981" strokeWidth="2" />
                <line x1="90" y1="60" x2="130" y2="60" stroke="#10b981" strokeWidth="2" />
                <line x1="140" y1="60" x2="180" y2="60" stroke="#10b981" strokeWidth="2" />
                <line x1="190" y1="60" x2="230" y2="60" stroke="#10b981" strokeWidth="2" />
                <line x1="40" y1="80" x2="80" y2="80" stroke="#10b981" strokeWidth="2" />

                {/* Elektronlar (barcha juftlangan) */}
                <text x="55" y="58" fill="#fbbf24" fontSize="8" textAnchor="middle">↑↓</text>
                <text x="105" y="58" fill="#fbbf24" fontSize="8" textAnchor="middle">↑↓</text>
                <text x="155" y="58" fill="#fbbf24" fontSize="8" textAnchor="middle">↑↓</text>
                <text x="205" y="58" fill="#fbbf24" fontSize="8" textAnchor="middle">↑↓</text>
                <text x="55" y="78" fill="#fbbf24" fontSize="8" textAnchor="middle">↑↓</text>

                {/* LMCT strelka (bloklangan) */}
                <line x1="140" y1="110" x2="140" y2="140" stroke="#ef4444" strokeWidth="2" />
                <line x1="130" y1="130" x2="150" y2="150" stroke="#ef4444" strokeWidth="2" />
                <line x1="150" y1="130" x2="130" y2="150" stroke="#ef4444" strokeWidth="2" />
                <text x="140" y="170" fill="#ef4444" fontSize="9" textAnchor="middle" fontWeight="bold">LMCT BLOKLANGAN</text>
              </svg>
              <div className="mt-2 space-y-1 text-xs text-purple-200">
                <p>• d-qobiq to'lgan → elektron joylasholmaydi</p>
                <p>• Shake-up satellite <strong>yo'q</strong></p>
                <p>• BE ≈ 932.5 eV, tor pik (FWHM ≈ 1.4 eV)</p>
              </div>
            </div>

            {/* Cu²⁺ d⁹ */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
                <span className="text-2xl">📡</span> Cu²⁺ (d⁹) — Satellite BOR
              </h3>
              <svg viewBox="0 0 280 180" className="w-full h-44">
                <text x="140" y="20" fill="#3b82f6" fontSize="10" textAnchor="middle" fontWeight="bold">d⁹ — Bo'sh joy bor</text>
                
                {/* 5 ta d-orbital */}
                <line x1="40" y1="60" x2="80" y2="60" stroke="#3b82f6" strokeWidth="2" />
                <line x1="90" y1="60" x2="130" y2="60" stroke="#3b82f6" strokeWidth="2" />
                <line x1="140" y1="60" x2="180" y2="60" stroke="#3b82f6" strokeWidth="2" />
                <line x1="190" y1="60" x2="230" y2="60" stroke="#3b82f6" strokeWidth="2" />
                <line x1="40" y1="80" x2="80" y2="80" stroke="#3b82f6" strokeWidth="2" />

                {/* Elektronlar (1 ta bo'sh) */}
                <text x="55" y="58" fill="#fbbf24" fontSize="8" textAnchor="middle">↑↓</text>
                <text x="105" y="58" fill="#fbbf24" fontSize="8" textAnchor="middle">↑↓</text>
                <text x="155" y="58" fill="#fbbf24" fontSize="8" textAnchor="middle">↑↓</text>
                <text x="205" y="58" fill="#fbbf24" fontSize="8" textAnchor="middle">↑</text>
                <text x="55" y="78" fill="#fbbf24" fontSize="8" textAnchor="middle">↑↓</text>

                {/* LMCT strelka (ruxsat) */}
                <path d="M 205 50 Q 205 30 220 30" fill="none" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowG)" />
                <text x="205" y="110" fill="#10b981" fontSize="9" textAnchor="middle" fontWeight="bold">LMCT RUXSAT</text>
                <text x="205" y="125" fill="#10b981" fontSize="8" textAnchor="middle">d⁹ → d¹⁰L̄</text>

                <defs>
                  <marker id="arrowG" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
                    <polygon points="0,0 5,2.5 0,5" fill="#10b981" />
                  </marker>
                </defs>
              </svg>
              <div className="mt-2 space-y-1 text-xs text-purple-200">
                <p>• d-qobiqda bo'sh joy → LMCT mumkin</p>
                <p>• Shake-up satellite <strong>941-944 eV</strong></p>
                <p>• BE ≈ 934.0 eV, keng pik (FWHM ≈ 2.0 eV)</p>
              </div>
            </div>
          </div>
        </div>

        {/* ═════ π-BACKBONDING ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>🔗</span> π-backbonding — CN⁻ ning o'ziga xosligi
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-950/50 rounded-xl p-5">
              <svg viewBox="0 0 300 250" className="w-full h-60">
                <text x="150" y="20" fill="#c4b5fd" fontSize="11" textAnchor="middle" fontWeight="bold">σ-donor + π-akseptor</text>

                {/* Cu markazi */}
                <circle cx="150" cy="125" r="20" fill="#06b6d4" />
                <text x="150" y="130" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">Cu⁺</text>
                <text x="150" y="160" fill="#06b6d4" fontSize="9" textAnchor="middle">d¹⁰</text>

                {/* CN⁻ ligandlar */}
                <circle cx="60" cy="125" r="12" fill="#6b7280" />
                <text x="60" y="129" fill="white" fontSize="8" textAnchor="middle">C≡N</text>
                <circle cx="240" cy="125" r="12" fill="#6b7280" />
                <text x="240" y="129" fill="white" fontSize="8" textAnchor="middle">C≡N</text>
                <circle cx="150" cy="50" r="12" fill="#6b7280" />
                <text x="150" y="54" fill="white" fontSize="8" textAnchor="middle">C≡N</text>
                <circle cx="150" cy="200" r="12" fill="#6b7280" />
                <text x="150" y="204" fill="white" fontSize="8" textAnchor="middle">C≡N</text>

                {/* σ-bog'lar (ligand → metal) */}
                <line x1="72" y1="125" x2="130" y2="125" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowSigma)" />
                <line x1="228" y1="125" x2="170" y2="125" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowSigma)" />
                <line x1="150" y1="62" x2="150" y2="105" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowSigma)" />
                <line x1="150" y1="188" x2="150" y2="145" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowSigma)" />

                {/* π-backbonding (metal → ligand) */}
                <path d="M 130 115 Q 100 100 72 115" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,2" markerEnd="url(#arrowPi)" />
                <path d="M 170 115 Q 200 100 228 115" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,2" markerEnd="url(#arrowPi)" />

                {/* Labels */}
                <text x="100" y="140" fill="#10b981" fontSize="8" textAnchor="middle">σ-donor</text>
                <text x="100" y="100" fill="#f59e0b" fontSize="8" textAnchor="middle">π-back</text>

                <defs>
                  <marker id="arrowSigma" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
                    <polygon points="0,0 5,2.5 0,5" fill="#10b981" />
                  </marker>
                  <marker id="arrowPi" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
                    <polygon points="0,0 5,2.5 0,5" fill="#f59e0b" />
                  </marker>
                </defs>
              </svg>
            </div>

            <div className="space-y-4">
              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-cyan-400 font-bold mb-3">Ikki tomonlama bog'lanish</h3>
                <ul className="text-purple-200 space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">→</span>
                    <span><strong>σ-donor:</strong> CN⁻ lone pair → Cu⁺ bo'sh orbital</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-0.5">←</span>
                    <span><strong>π-backbonding:</strong> Cu⁺ d-elektronlar → CN⁻ π* orbital</span>
                  </li>
                </ul>
                <p className="text-purple-300 text-xs mt-3">
                  π-backbonding Cu⁺ (d¹⁰) da ayniqsa kuchli, chunki d-elektronlar to'lgan va
                  CN⁻ π* orbitallari past energiyada. Bu bog'ni mustahkamlaydi.
                </p>
              </div>

              <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-5">
                <h3 className="text-cyan-400 font-bold mb-2">XPS ga ta'siri</h3>
                <p className="text-purple-200 text-xs leading-relaxed">
                  π-backbonding → Cu dan elektron zichligi CN⁻ ga ko'chadi →
                  Cu <strong>qisman musbat zaryad</strong> ortadi → BE biroz oshadi.
                  Lekin d¹⁰ to'lganligi sababli bu effekt cheklangan.
                  Natijada BE ≈ 932.5 eV (Cu⁰ dan ~0.1 eV yuqori).
                </p>
              </div>

              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-cyan-400 font-bold mb-2">Barqarorlik</h3>
                <p className="text-purple-200 text-xs leading-relaxed">
                  log β₄ ≈ <strong>30.3</strong> — juda yuqori barqarorlik konstantasi.
                  π-backbonding + σ-donorlik → Cu⁺ suv eritmasida faqat CN⁻ bilan barqaror.
                  Erkin Cu⁺ suvda disproportionatsiyalanadi: 2Cu⁺ → Cu⁰ + Cu²⁺.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ═════ SURVEY TARKIB ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><span>⚛️</span> Elementlar tarkibi (Survey XPS)</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {surveyData.map((el, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
                <div className="flex items-center gap-2 mb-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: el.color }}></div><p className="font-bold text-white">{el.element}</p></div>
                <p className="text-purple-400 text-xs mb-1">{el.orbital}</p>
                <p className="text-cyan-400 font-bold font-mono text-sm">{el.be} eV</p>
                <p className="text-purple-300 text-xs mt-1">{el.atomic_percent.toFixed(1)} at.%</p>
                <p className="text-purple-500 text-[10px] mt-1">{el.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-cyan-600/10 border border-cyan-500/30 rounded-lg p-3 text-xs text-purple-200">
            <p><strong className="text-cyan-400">💡 Nazariy nisbat:</strong> [Cu(CN)₄]³⁻ da Cu:C:N = 1:4:4. Survey XPS da bu nisbat tasdiqlanadi. C 1s va N 1s BE qiymatlari CN⁻ ligandning koordinatsiyasini tasdiqlaydi.</p>
          </div>
        </div>

        {/* ═════ CU HOLATLARI SOLISHTIRISH ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><span>🔄</span> Cu holatlari — to'liq solishtirish</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-left text-purple-300">Xususiyat</th>
                <th className="py-3 px-4 text-center text-yellow-400">Cu⁰</th>
                <th className="py-3 px-4 text-center text-cyan-400">Cu⁺ (d¹⁰)</th>
                <th className="py-3 px-4 text-center text-blue-400">Cu²⁺ (d⁹)</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Konfiguratsiya", "[Ar]3d¹⁰4s¹", "d¹⁰", "d⁹"],
                  ["2p₃/₂ BE (eV)", "932.6", "932.5", "933.5-935.0"],
                  ["Shake-up satellite", "Yo'q", "Yo'q", "Ha (941-944 eV)"],
                  ["Pik shakli", "Asimmetrik tail", "Simmetrik, tor", "Kengaygan"],
                  ["FWHM (eV)", "~1.3", "~1.4", "~2.0-2.5"],
                  ["Magnit", "Diamagnit", "Diamagnit", "Paramagnit"],
                  ["d-d o'tish", "Yo'q", "Yo'q", "Ha"],
                  ["Rang", "Mis rang", "Rangsiz", "Ko'k/yashil"],
                  ["Geometriya", "FCC", "Tetraedrik/chiziqli", "Tekis kvadrat/JT"],
                  ["Misol", "Cu foil", "[Cu(CN)₄]³⁻", "[Cu(NH₃)₄]²⁺"]
                ].map((r, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 ${i === 2 || i === 3 ? 'bg-cyan-900/10' : ''}`}>
                    <td className="py-2 px-4 font-semibold">{r[0]}</td>
                    <td className="py-2 px-4 text-center">{r[1]}</td>
                    <td className="py-2 px-4 text-center font-bold text-cyan-400">{r[2]}</td>
                    <td className="py-2 px-4 text-center">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 bg-amber-600/10 border border-amber-500/30 rounded-lg p-4 text-xs text-purple-200">
            <p><strong className="text-amber-400">💡 Cu⁺ ni Cu⁰ dan farqlash:</strong> BE deyarli bir xil (~932.5-932.6 eV).
            Farqlash uchun: (1) <strong>Auger parametri</strong> (Cu LMM pik pozitsiyasi),
            (2) <strong>Pik shakli</strong> (Cu⁰ da asimmetrik tail),
            (3) <strong>Ligand signallari</strong> (CN⁻ N 1s, C 1s).</p>
          </div>
        </div>

        {/* ═════ QO'LLANILISH ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><span>🏭</span> Amaliy qo'llanilishi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-3xl mb-3">⛏️</div>
              <h3 className="text-cyan-400 font-bold mb-2 text-sm">Oltin qazib olish</h3>
              <p className="text-purple-200 text-xs leading-relaxed">
                <strong>Sianidlash jarayoni</strong>: Au + 2CN⁻ → [Au(CN)₂]⁻.
                Cu minerallari ham [Cu(CN)₄]³⁻ hosil qiladi → oltindan ajratish qiyinlashadi.
                Shuning uchun mis miqdori nazorat qilinadi.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-3xl mb-3">🔩</div>
              <h3 className="text-cyan-400 font-bold mb-2 text-sm">Galvanotexnika</h3>
              <p className="text-purple-200 text-xs leading-relaxed">
                <strong>Mis qoplash</strong> elektroliti sifatida. [Cu(CN)₄]³⁻ eritmasidan
                silliq, bir tekis mis qatlami hosil bo'ladi. Po'lat, sink detallarni qoplash.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-3xl mb-3">🧪</div>
              <h3 className="text-cyan-400 font-bold mb-2 text-sm">Analitik kimyo</h3>
              <p className="text-purple-200 text-xs leading-relaxed">
                Cu⁺ ni <strong>barqaror holatda saqlash</strong> uchun CN⁻ qo'shiladi.
                Titrlash, gravimetriya, spektrofotometriyada standart eritmalar tayyorlash.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-3xl mb-3">⚗️</div>
              <h3 className="text-cyan-400 font-bold mb-2 text-sm">Organik sintez</h3>
              <p className="text-purple-200 text-xs leading-relaxed">
                <strong>Rosenmund-von Braun reaksiyasi</strong>: aril galogenidlarni
                aril nitrillarga aylantirish. CuCN katalizator sifatida.
              </p>
            </div>
          </div>

          <div className="mt-4 bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-xs text-purple-200">
            <p className="mb-2"><strong className="text-red-400">⚠️ XAVFSIZLIK OGohlantirish:</strong></p>
            <p>CN⁻ — <strong>juda zaharli</strong> (LD₅₀ ≈ 1-3 mg/kg). HCN gazi ajralishi mumkin (pH &lt; 7 da).
            Faqat tortish shkafida, himoya vositalari bilan ishlash kerak.
            Antidot: natriy tiosulfat + amil nitrit.</p>
          </div>
        </div>

        {/* ═════ TARIX ═════ */}
        <div className="bg-gradient-to-br from-cyan-900/30 to-teal-900/30 border border-cyan-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-cyan-300 mb-4 flex items-center gap-2"><span>📜</span> Tarixiy kontekst</h2>
          <div className="space-y-3 text-sm text-cyan-100/90">
            <p><strong className="text-cyan-300">1782</strong> — Carl Wilhelm Scheele HCN ni kashf etdi ("prussik kislota").</p>
            <p><strong className="text-cyan-300">1820-yillar</strong> — Cu-sianid komplekslari birinchi marta sintez qilindi.</p>
            <p><strong className="text-cyan-300">1887</strong> — MacArthur-Forrest sianidlash jarayoni patentlandi. Oltin sanoatida inqilob.</p>
            <p><strong className="text-cyan-300">1930-yillar</strong> — Werner nazariyasi doirasida [Cu(CN)₄]³⁻ strukturasi aniqlandi.</p>
            <p><strong className="text-cyan-300">1970-yillar</strong> — XPS orqali Cu⁺ (d¹⁰) va Cu²⁺ (d⁹) aniq farqlandi. Satellite diagnostikasi standartlashtirildi.</p>
            <p><strong className="text-cyan-300">Hozirgi kun</strong> — [Cu(CN)₄]³⁻ XPS da <strong>Cu⁺ standarti</strong>. Galvanotexnika, oltin qazib olish, organik sintezda keng qo'llaniladi.</p>
          </div>
        </div>

        {/* ═════ XULOSA ═════ */}
        <div className="bg-gradient-to-r from-cyan-600/10 to-purple-600/10 border border-cyan-500/20 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><span>✅</span> Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>[Cu(CN)₄]³⁻ — <strong className="text-cyan-400">klassik d¹⁰ tetraedrik kompleks</strong></li>
            <li>Cu⁺ (d¹⁰) — <strong>barcha d-orbitallar to'lgan</strong>, diamagnit, rangsiz</li>
            <li><strong>Cu 2p₃/₂ BE = 932.5 eV</strong> — Cu⁺ uchun xarakterli</li>
            <li><strong>Shake-up satellite YO'Q</strong> — d¹⁰ ning asosiy diagnostik belgisi</li>
            <li>Cu²⁺ (d⁹) dan farqi: <strong>satellit yo'q + past BE + tor pik</strong></li>
            <li>SO splitting: <strong>19.8 eV</strong> (2p₃/₂ − 2p₁/₂)</li>
            <li>S = 0, μ = <strong>0 BM</strong> — diamagnit</li>
            <li><strong>π-backbonding</strong> kuchli → log β₄ ≈ 30.3</li>
            <li>Oltin qazib olish, galvanotexnika, organik sintezda qo'llaniladi</li>
            <li>XPS da <strong>Cu⁺ standarti</strong> sifatida ishlatiladi</li>
          </ol>
        </div>

        {/* ═════ NAVIGATSIYA ═════ */}
        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/xps/birikmalar/cu-nh3-4" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 transition-all text-purple-300">← [Cu(NH₃)₄]²⁺</Link>
          <Link href="/ilmiy/tahlil/xps/birikmalar/co-nh3-6" className="px-6 py-3 bg-cyan-600/80 rounded-xl hover:bg-cyan-500 text-white font-semibold">Keyingi: [Co(NH₃)₆]³⁺ →</Link>
        </div>
      </section>
    </main>
  )
}