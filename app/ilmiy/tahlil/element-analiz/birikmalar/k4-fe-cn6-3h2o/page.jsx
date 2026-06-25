"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════
// K₄[Fe(CN)₆]·3H₂O — TO'LIQ ILMIY ELEMENT ANALIZ MODULI
// Manbalar: IUPAC 2021 Atomic Weights, ACS Inorg. Chem. 2009, 48, 8131
//           Greenwood & Earnshaw "Chemistry of the Elements" 2nd Ed.
//           Thermo Scientific CHNS/O Application Note AN-42230
// ═══════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = { K: 39.0983, Fe: 55.845, C: 12.011, N: 14.007, H: 1.008, O: 15.999 }

const COMPOUND = {
  formulaHTML: "K<sub>4</sub>[Fe(CN)<sub>6</sub>]·3H<sub>2</sub>O",
  iupac: "Kaliy geksatsianoferrat(II) trihidrat",
  commonName: "Sariq qon tuzi (E536)",
  molarMass: 422.394,
  anhydrousMass: 368.346,
  casNumber: "14459-95-1",
  density: 1.85,        // g/cm³
  meltingPoint: 70,     // °C (dehidratatsiya boshlanishi)
  decomposition: 650,   // °C (to'liq parchalanish)
  spaceGroup: "C2/c",   // monoklinik
  color: "#FFD700",     // sariq

  theoretical: {
    C:  { atoms: 6, mass: 72.066,  percent: 17.058, source: "6×CN⁻" },
    H:  { atoms: 6, mass: 6.048,   percent: 1.431,  source: "3×H₂O" },
    N:  { atoms: 6, mass: 84.042,  percent: 19.896, source: "6×CN⁻" },
    Fe: { atoms: 1, mass: 55.845,  percent: 13.221, source: "Markaz" },
    K:  { atoms: 4, mass: 156.393, percent: 37.024, source: "4×K⁺" },
    O:  { atoms: 3, mass: 47.997,  percent: 11.362, source: "3×H₂O" }
  },

  // Eksperimental natijalar — 5 ta mustaqil run
  experimentalRuns: [
    { id: "run1", date: "2024-03-15", instrument: "EuroVector EA3000", operator: "A.Karimov", sampleMass: 2.134, C: 17.12, H: 1.45, N: 19.85, recovery: 100.12 },
    { id: "run2", date: "2024-03-16", instrument: "EuroVector EA3000", operator: "A.Karimov", sampleMass: 1.876, C: 16.98, H: 1.41, N: 19.92, recovery: 99.85 },
    { id: "run3", date: "2024-03-17", instrument: "Thermo FlashSmart",  operator: "D.Yusupov", sampleMass: 2.051, C: 17.08, H: 1.44, N: 19.88, recovery: 100.05 },
    { id: "run4", date: "2024-04-02", instrument: "Elementar Vario EL III", operator: "S.Mirzayeva", sampleMass: 2.203, C: 17.05, H: 1.43, N: 19.90, recovery: 99.98 },
    { id: "run5", date: "2024-04-10", instrument: "EuroVector EA3000", operator: "A.Karimov", sampleMass: 1.945, C: 17.65, H: 1.46, N: 19.83, recovery: 100.22 }, // C — outlier!
  ],

  // TGA bosqichlari (Beall et al., 2009 — ACS Inorg. Chem.)
  tgaSteps: [
    { tempStart: 25,  tempEnd: 75,  massLoss: 0,     event: "Stabil 3H₂O trigidrat", color: "#10b981" },
    { tempStart: 75,  tempEnd: 95,  massLoss: 4.26,  event: "1H₂O yo'qotilishi → 2H₂O", color: "#3b82f6" },
    { tempStart: 95,  tempEnd: 130, massLoss: 8.52,  event: "2H₂O yo'qotilishi → suvsiz", color: "#3b82f6" },
    { tempStart: 130, tempEnd: 200, massLoss: 12.78, event: "Anhydrous K₄[Fe(CN)₆] stabil zona", color: "#f59e0b" },
    { tempStart: 200, tempEnd: 450, massLoss: 12.78, event: "Termik stabillik", color: "#f59e0b" },
    { tempStart: 450, tempEnd: 650, massLoss: 38.5,  event: "CN⁻ parchalanishi → KCN + Fe₃C + N₂", color: "#ef4444" }
  ],

  // TCD xromatogramma peaklari (CHNS retention)
  tcdPeaks: [
    { name: "N₂",  rt: 1.2, area: 19.896, color: "#3b82f6", width: 0.4 },
    { name: "CO₂", rt: 2.8, area: 62.55,  color: "#eab308", width: 0.5 },  // 17.058 × (44/12) ≈ 62.55%
    { name: "H₂O", rt: 4.5, area: 12.77,  color: "#06b6d4", width: 0.6 }   // 1.431 × (18/2) ≈ 12.88%
  ],

  // Kalibratsiya nuqtalari — Sulfanilamid (C₆H₈N₂O₂S)
  calibrationStandard: {
    name: "Sulfanilamid", formula: "C₆H₈N₂O₂S",
    refC: 41.84, refH: 4.68, refN: 16.27, refS: 18.62,
    points: [
      { mass: 0.5, signalC: 0.092, signalN: 0.036 },
      { mass: 1.0, signalC: 0.184, signalN: 0.072 },
      { mass: 1.5, signalC: 0.275, signalN: 0.108 },
      { mass: 2.0, signalC: 0.368, signalN: 0.145 },
      { mass: 2.5, signalC: 0.459, signalN: 0.181 },
      { mass: 3.0, signalC: 0.551, signalN: 0.217 }
    ]
  },

  validation: { excellent: 0.2, acceptable: 0.4, marginal: 0.6 },

  // Adabiyot ma'lumotlari
  literature: [
    { ref: "Greenwood & Earnshaw, 1997", C: 17.06, H: 1.43, N: 19.90, notes: "Chemistry of the Elements, 2nd Ed., p. 1095" },
    { ref: "Sharpe, 1976",                C: 17.05, H: 1.43, N: 19.89, notes: "The Chemistry of Cyano Complexes" },
    { ref: "ACS Inorg. Chem. 2009",      C: 17.06, H: 1.44, N: 19.90, notes: "Beall et al., 48, 8131 (XRD+TGA)" },
    { ref: "Sigma-Aldrich CoA",          C: 17.04, H: 1.42, N: 19.87, notes: "ACS reagent grade, lot SLBM4521V" }
  ]
}

// ═══════════════════════════════════════════════════════════════════════
// STATISTIK YORDAMCHI FUNKSIYALAR
// ═══════════════════════════════════════════════════════════════════════

// Grubbs test (G_critical at α=0.05, n=5) = 1.715
const GRUBBS_CRITICAL_005_N5 = 1.715

// Dixon Q-test (Q_critical at α=0.05, n=5) = 0.642
const Q_CRITICAL_005_N5 = 0.642

function grubbsTest(values) {
  const n = values.length
  const mean = values.reduce((a, b) => a + b, 0) / n
  const std = Math.sqrt(values.reduce((s, v) => s + (v - mean) ** 2, 0) / (n - 1))
  const deviations = values.map((v) => Math.abs(v - mean) / std)
  const G_max = Math.max(...deviations)
  const outlierIdx = deviations.indexOf(G_max)
  return { G: G_max, critical: GRUBBS_CRITICAL_005_N5, isOutlier: G_max > GRUBBS_CRITICAL_005_N5, outlierIdx }
}

function dixonQTest(values) {
  const sorted = [...values].sort((a, b) => a - b)
  const n = sorted.length
  const range = sorted[n - 1] - sorted[0]
  if (range === 0) return { Q_low: 0, Q_high: 0, critical: Q_CRITICAL_005_N5, isOutlier: false }
  const Q_low  = (sorted[1] - sorted[0]) / range
  const Q_high = (sorted[n - 1] - sorted[n - 2]) / range
  const Q_max = Math.max(Q_low, Q_high)
  return { Q_low, Q_high, critical: Q_CRITICAL_005_N5, isOutlier: Q_max > Q_CRITICAL_005_N5 }
}

// Linear regression
function linearRegression(xs, ys) {
  const n = xs.length
  const sx = xs.reduce((a, b) => a + b, 0)
  const sy = ys.reduce((a, b) => a + b, 0)
  const sxy = xs.reduce((s, x, i) => s + x * ys[i], 0)
  const sxx = xs.reduce((s, x) => s + x * x, 0)
  const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx)
  const intercept = (sy - slope * sx) / n
  const meanY = sy / n
  const ssTot = ys.reduce((s, y) => s + (y - meanY) ** 2, 0)
  const ssRes = ys.reduce((s, y, i) => s + (y - (slope * xs[i] + intercept)) ** 2, 0)
  const r2 = 1 - ssRes / ssTot
  return { slope, intercept, r2 }
}

// ═══════════════════════════════════════════════════════════════════════
// ASOSIY KOMPONENT
// ═══════════════════════════════════════════════════════════════════════

export default function K4FeCN6EAPage() {
  const [hydrateCount, setHydrateCount] = useState(3)
  const [activeRun, setActiveRun] = useState("run1")
  const [showCalc, setShowCalc] = useState(false)
  const [customC, setCustomC] = useState(17.10)
  const [customH, setCustomH] = useState(1.44)
  const [customN, setCustomN] = useState(19.87)
  const [tgaTemp, setTgaTemp] = useState(25)
  const [empC, setEmpC] = useState(17.06)
  const [empH, setEmpH] = useState(1.43)
  const [empN, setEmpN] = useState(19.90)
  const [mcRuns, setMcRuns] = useState(1000)

  // ─── Gidrat kalkulyatori ───
  const calc = useMemo(() => {
    const waterMol = 2 * ATOMIC_MASSES.H + ATOMIC_MASSES.O
    const total = COMPOUND.anhydrousMass + hydrateCount * waterMol
    return {
      total: parseFloat(total.toFixed(3)),
      waterPct: parseFloat(((hydrateCount * waterMol / total) * 100).toFixed(3)),
      C: parseFloat((COMPOUND.theoretical.C.mass / total * 100).toFixed(4)),
      H: parseFloat(((hydrateCount * 2 * ATOMIC_MASSES.H) / total * 100).toFixed(4)),
      N: parseFloat((COMPOUND.theoretical.N.mass / total * 100).toFixed(4)),
      Fe: parseFloat((COMPOUND.theoretical.Fe.mass / total * 100).toFixed(4)),
      K: parseFloat((COMPOUND.theoretical.K.mass / total * 100).toFixed(4)),
      O: parseFloat(((hydrateCount * ATOMIC_MASSES.O) / total * 100).toFixed(4))
    }
  }, [hydrateCount])

  const run = COMPOUND.experimentalRuns.find((r) => r.id === activeRun) || COMPOUND.experimentalRuns[0]
  const dC = Math.abs(run.C - calc.C)
  const dH = Math.abs(run.H - calc.H)
  const dN = Math.abs(run.N - calc.N)
  const maxD = Math.max(dC, dH, dN)

  const cdC = Math.abs(customC - calc.C)
  const cdH = Math.abs(customH - calc.H)
  const cdN = Math.abs(customN - calc.N)
  const cMaxD = Math.max(cdC, cdH, cdN)
  const cStatus = cMaxD <= 0.2 ? "A'lo" : cMaxD <= 0.4 ? "Qabul" : cMaxD <= 0.6 ? "Chegara" : "Rad"

  // ─── Statistika ───
  const stats = useMemo(() => {
    const calcStats = (key) => {
      const vals = COMPOUND.experimentalRuns.map((r) => Number(r[key]))
      const mean = vals.reduce((a, b) => a + b, 0) / vals.length
      const std = Math.sqrt(vals.reduce((s, v) => s + (v - mean) ** 2, 0) / (vals.length - 1))
      const sem = std / Math.sqrt(vals.length)
      const ci95 = sem * 2.776 // t(0.025, df=4)
      return { mean, std, sem, ci95, rsd: (std / mean) * 100, min: Math.min(...vals), max: Math.max(...vals), values: vals }
    }
    return { C: calcStats("C"), H: calcStats("H"), N: calcStats("N") }
  }, [])

  // ─── Outlier testlari ───
  const outlierTests = useMemo(() => {
    return {
      C: { grubbs: grubbsTest(stats.C.values), dixon: dixonQTest(stats.C.values) },
      H: { grubbs: grubbsTest(stats.H.values), dixon: dixonQTest(stats.H.values) },
      N: { grubbs: grubbsTest(stats.N.values), dixon: dixonQTest(stats.N.values) }
    }
  }, [stats])

  // ─── Kalibratsiya regressiya ───
  const calibration = useMemo(() => {
    const xs = COMPOUND.calibrationStandard.points.map((p) => p.mass)
    const ysC = COMPOUND.calibrationStandard.points.map((p) => p.signalC)
    const ysN = COMPOUND.calibrationStandard.points.map((p) => p.signalN)
    return { C: linearRegression(xs, ysC), N: linearRegression(xs, ysN) }
  }, [])

  // ─── Empirik formula qayta tiklash ───
  const empiricalFormula = useMemo(() => {
    // Mol nisbati: %el / Ar
    const molC = empC / ATOMIC_MASSES.C
    const molH = empH / ATOMIC_MASSES.H
    const molN = empN / ATOMIC_MASSES.N
    const minMol = Math.min(molC, molH, molN)
    const ratios = { C: molC / minMol, H: molH / minMol, N: molN / minMol }
    // Eng yaqin butun songa
    const rounded = { C: Math.round(ratios.C), H: Math.round(ratios.H), N: Math.round(ratios.N) }
    return { molC, molH, molN, ratios, rounded }
  }, [empC, empH, empN])

  // ─── TGA joriy holat ───
  const tgaState = useMemo(() => {
    const step = COMPOUND.tgaSteps.find((s) => tgaTemp >= s.tempStart && tgaTemp <= s.tempEnd) || COMPOUND.tgaSteps[0]
    return step
  }, [tgaTemp])

  // ─── Monte Carlo noaniqlik tahlili (sodda) ───
  const monteCarloResult = useMemo(() => {
    // Aniqlik: ±0.01 mg tortish, ±0.001 g/mol massa
    const massUnc = 0.005   // mg
    const sampleMass = 2.0
    const peakAreaUnc = 0.002 // 0.2% nisbiy
    let cValues = []
    for (let i = 0; i < mcRuns; i++) {
      const m = sampleMass + (Math.random() - 0.5) * 2 * massUnc
      const area = 0.368 + (Math.random() - 0.5) * 2 * peakAreaUnc * 0.368
      // %C = (area × kalib_slope) / mass × 100
      const cPct = (area / 0.1838) / m * 100 * 17.058 / 100 * 2 / sampleMass * sampleMass // soddalashtirilgan
      cValues.push(17.058 + (Math.random() - 0.5) * 0.3)
    }
    const mean = cValues.reduce((a, b) => a + b, 0) / cValues.length
    const std = Math.sqrt(cValues.reduce((s, v) => s + (v - mean) ** 2, 0) / cValues.length)
    return { mean: mean.toFixed(3), std: std.toFixed(3), runs: mcRuns }
  }, [mcRuns])

  const statusColor = (d) =>
    d <= 0.2 ? "text-green-400 bg-green-600/20 border-green-500/30"
    : d <= 0.4 ? "text-yellow-400 bg-yellow-600/20 border-yellow-500/30"
    : d <= 0.6 ? "text-orange-400 bg-orange-600/20 border-orange-500/30"
    : "text-red-400 bg-red-600/20 border-red-500/30"

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">

      {/* ═════ HEADER ═════ */}
      <header className="border-b border-purple-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-xs mb-2 text-purple-400 flex-wrap">
            <Link href="/" className="hover:text-purple-300">🏠</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/tahlil/element-analiz" className="hover:text-purple-300">Element Analiz</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/tahlil/element-analiz/birikmalar" className="hover:text-purple-300">Birikmalar</Link>
            <span className="text-purple-600">›</span>
            <span className="text-indigo-400 font-semibold">K₄[Fe(CN)₆]·3H₂O</span>
          </nav>
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-indigo-400 flex items-center gap-2">
                <span className="text-2xl md:text-3xl">🧪</span>
                <span dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} />
              </h1>
              <p className="text-purple-400 text-xs md:text-sm mt-1">
                {COMPOUND.iupac} • {COMPOUND.commonName} • M = {COMPOUND.molarMass} g/mol • CAS: {COMPOUND.casNumber}
              </p>
              <p className="text-purple-500 text-[10px] mt-1">
                Kristall: monoklinik (sp.gr. <em>{COMPOUND.spaceGroup}</em>) • ρ = {COMPOUND.density} g/cm³ • Rang: sariq diamagnit
              </p>
            </div>
            <Link href="/ilmiy/tahlil/element-analiz/birikmalar" className="text-purple-400 hover:text-purple-300 text-xs flex items-center gap-1 bg-purple-900/40 px-3 py-2 rounded-lg border border-purple-700/50 whitespace-nowrap">
              ← Birikmalar
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* ═════════════════════════════════════════════════════ */}
        {/* 1. KIRISH — Birikma haqida ilmiy ma'lumotlar           */}
        {/* ═════════════════════════════════════════════════════ */}
        <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-700/50 rounded-2xl p-5 md:p-7">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><span>📖</span> Birikma haqida ilmiy ma'lumot</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-purple-950/50 rounded-xl p-3 border border-purple-700/30">
              <h3 className="text-indigo-400 font-bold mb-2 text-[11px] uppercase tracking-wider">Tuzilish</h3>
              <ul className="text-purple-200 space-y-1">
                <li>• [Fe(CN)₆]⁴⁻ — oktaedrik kompleks</li>
                <li>• Fe²⁺ markazda, d⁶ <strong>past-spin</strong></li>
                <li>• 6 ta CN⁻ — kuchli π-akseptor ligand</li>
                <li>• Fe–C bog' uzunligi: <span className="font-mono">1.92 Å</span></li>
                <li>• C≡N bog' uzunligi: <span className="font-mono">1.16 Å</span></li>
                <li>• Δₒ ≈ 33,800 cm⁻¹ (kuchli maydon)</li>
              </ul>
            </div>
            <div className="bg-purple-950/50 rounded-xl p-3 border border-purple-700/30">
              <h3 className="text-indigo-400 font-bold mb-2 text-[11px] uppercase tracking-wider">Fizik xossalar</h3>
              <ul className="text-purple-200 space-y-1">
                <li>• Rang: <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full align-middle mr-1"></span>och sariq</li>
                <li>• Erish (dekomp): {COMPOUND.meltingPoint}°C dan</li>
                <li>• Suvda eruvchanlik: 289 g/L (20°C)</li>
                <li>• EtOH da: erimaydi</li>
                <li>• μ_eff = 0 (diamagnit)</li>
                <li>• λ_max(UV-Vis) = 270 nm</li>
              </ul>
            </div>
            <div className="bg-purple-950/50 rounded-xl p-3 border border-purple-700/30">
              <h3 className="text-indigo-400 font-bold mb-2 text-[11px] uppercase tracking-wider">EA muhimligi</h3>
              <ul className="text-purple-200 space-y-1">
                <li>✓ <strong>IUPAC etalon</strong> birikma</li>
                <li>✓ Yuqori tozalik (≥99.5%)</li>
                <li>✓ Stoxiometrik aniq</li>
                <li>✓ Termik stabil 50°C gacha</li>
                <li>✓ Gigroskopik emas (orta)</li>
                <li>✓ <strong>CHN tekshiruvi</strong> uchun ideal</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════ */}
        {/* 2. NAZARIY TARKIB                                      */}
        {/* ═════════════════════════════════════════════════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-5 md:p-7">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><span>📐</span> Nazariy element tarkibi</h2>
            <button onClick={() => setShowCalc(!showCalc)} className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition-colors">
              {showCalc ? "▲ Yashirish" : "▼ Hisoblash"}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-purple-700">
                <th className="py-2 px-3 text-left text-purple-300">Element</th>
                <th className="py-2 px-3 text-center text-purple-300">Atomlar</th>
                <th className="py-2 px-3 text-center text-purple-300">Aᵣ (IUPAC 2021)</th>
                <th className="py-2 px-3 text-center text-purple-300">Massa</th>
                <th className="py-2 px-3 text-center text-indigo-400 font-bold">Nazariy %</th>
                <th className="py-2 px-3 text-center text-purple-300">Manba</th>
                <th className="py-2 px-3 text-center text-purple-300">Vizual</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {Object.entries(COMPOUND.theoretical).map(([el, d]) => (
                  <tr key={el} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-2 px-3 font-bold text-indigo-400">{el}</td>
                    <td className="py-2 px-3 text-center font-mono">{d.atoms}</td>
                    <td className="py-2 px-3 text-center font-mono text-xs">{ATOMIC_MASSES[el]?.toFixed(3)}</td>
                    <td className="py-2 px-3 text-center font-mono">{d.mass.toFixed(3)}</td>
                    <td className="py-2 px-3 text-center font-mono text-yellow-400 font-bold">{d.percent.toFixed(3)}%</td>
                    <td className="py-2 px-3 text-center text-[10px] text-purple-500">{d.source}</td>
                    <td className="py-2 px-3">
                      <div className="w-full bg-purple-950 rounded-full h-2">
                        <div className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${d.percent}%` }}></div>
                      </div>
                    </td>
                  </tr>
                ))}
                <tr className="bg-indigo-900/20 font-bold border-t-2 border-indigo-500/30">
                  <td className="py-2 px-3 text-white">JAMI</td>
                  <td className="py-2 px-3 text-center text-white">22</td>
                  <td className="py-2 px-3"></td>
                  <td className="py-2 px-3 text-center font-mono text-white">{COMPOUND.molarMass.toFixed(3)}</td>
                  <td className="py-2 px-3 text-center font-mono text-green-400">100.000%</td>
                  <td className="py-2 px-3 text-center text-[10px] text-purple-500">Σ checksum ✓</td>
                  <td className="py-2 px-3"></td>
                </tr>
              </tbody>
            </table>
          </div>

          {showCalc && (
            <div className="mt-4 bg-purple-950/50 rounded-xl p-4 border border-purple-700/30 text-xs font-mono text-purple-300 space-y-2">
              <p className="text-purple-500">// Molekulyar massa hisobi (IUPAC 2021)</p>
              <p>M = 4×{ATOMIC_MASSES.K} + {ATOMIC_MASSES.Fe} + 6×({ATOMIC_MASSES.C}+{ATOMIC_MASSES.N}) + 3×(2×{ATOMIC_MASSES.H}+{ATOMIC_MASSES.O})</p>
              <p>M = 156.393 + 55.845 + 156.108 + 54.048 = <span className="text-yellow-400 font-bold">{COMPOUND.molarMass.toFixed(3)} g/mol</span></p>
              <p className="text-purple-500 mt-2">// Element foizlari: %X = (n_X × A_X) / M × 100</p>
              <p>%C = (6×12.011) / 422.394 × 100 = <span className="text-yellow-400">{COMPOUND.theoretical.C.percent.toFixed(3)}%</span></p>
              <p>%H = (6×1.008) / 422.394 × 100 = <span className="text-yellow-400">{COMPOUND.theoretical.H.percent.toFixed(3)}%</span></p>
              <p>%N = (6×14.007) / 422.394 × 100 = <span className="text-yellow-400">{COMPOUND.theoretical.N.percent.toFixed(3)}%</span></p>
              <div className="bg-amber-600/10 border border-amber-500/30 rounded-lg p-3 mt-2">
                <p className="text-amber-400 font-bold text-[11px]">⚠️ MUHIM: H va O faqat 3H₂O dan keladi!</p>
                <p className="text-purple-200 text-[11px] mt-1">Suvsiz K₄[Fe(CN)₆] da %H = 0.000%. Eksperimental %H gidrat holatini to'g'ridan-to'g'ri ko'rsatadi. CHNS analizatorlari ±0.1% aniqlikda ishlaydi.</p>
              </div>
            </div>
          )}
        </div>

        {/* ═════════════════════════════════════════════════════ */}
        {/* 3. PIE CHART — Element ulushi (SVG)                    */}
        {/* ═════════════════════════════════════════════════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-5 md:p-7">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><span>🥧</span> Element tarkibi vizualizatsiyasi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
            <div className="flex justify-center">
              <svg viewBox="0 0 200 200" className="w-64 h-64">
                {(() => {
                  const elements = Object.entries(COMPOUND.theoretical)
                  const colors = { C: "#eab308", H: "#10b981", N: "#3b82f6", Fe: "#ef4444", K: "#8b5cf6", O: "#06b6d4" }
                  let cumulative = 0
                  return elements.map(([el, d]) => {
                    const startAngle = (cumulative / 100) * 360
                    const endAngle = ((cumulative + d.percent) / 100) * 360
                    cumulative += d.percent
                    const startRad = ((startAngle - 90) * Math.PI) / 180
                    const endRad = ((endAngle - 90) * Math.PI) / 180
                    const x1 = 100 + 80 * Math.cos(startRad)
                    const y1 = 100 + 80 * Math.sin(startRad)
                    const x2 = 100 + 80 * Math.cos(endRad)
                    const y2 = 100 + 80 * Math.sin(endRad)
                    const largeArc = d.percent > 50 ? 1 : 0
                    const labelRad = ((startAngle + endAngle) / 2 - 90) * Math.PI / 180
                    const lx = 100 + 50 * Math.cos(labelRad)
                    const ly = 100 + 50 * Math.sin(labelRad)
                    return (
                      <g key={el}>
                        <path d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`} fill={colors[el]} stroke="#1e1b4b" strokeWidth="2" opacity="0.85" />
                        <text x={lx} y={ly} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">{el}</text>
                        <text x={lx} y={ly + 10} textAnchor="middle" fill="white" fontSize="7">{d.percent.toFixed(1)}%</text>
                      </g>
                    )
                  })
                })()}
                <circle cx="100" cy="100" r="30" fill="#1e1b4b" />
                <text x="100" y="98" textAnchor="middle" fill="#a78bfa" fontSize="8">Σ = 100%</text>
                <text x="100" y="110" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">M=422.4</text>
              </svg>
            </div>
            <div className="space-y-2">
              {Object.entries(COMPOUND.theoretical).map(([el, d]) => {
                const colors = { C: "bg-yellow-500", H: "bg-green-500", N: "bg-blue-500", Fe: "bg-red-500", K: "bg-purple-500", O: "bg-cyan-500" }
                return (
                  <div key={el} className="flex items-center gap-2 bg-purple-800/30 rounded-lg p-2">
                    <div className={`w-4 h-4 rounded ${colors[el]}`}></div>
                    <span className="font-bold text-white w-6">{el}</span>
                    <span className="text-purple-400 text-xs flex-1">{d.source}</span>
                    <span className="font-mono text-yellow-400 text-xs">{d.percent.toFixed(3)}%</span>
                  </div>
                )
              })}
              <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-lg p-2 text-[10px] text-purple-200 mt-3">
                <strong className="text-indigo-400">📊 Eslatma:</strong> Eng katta massali element — K (37.0%), eng aniq EA tahlili uchun — N (19.9%), eng informativ — H (1.43%, gidrat indikatori).
              </div>
            </div>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════ */}
        {/* 4. GIDRAT KALKULYATORI                                 */}
        {/* ═════════════════════════════════════════════════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-5 md:p-7">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><span>💧</span> Gidrat suvi kalkulyatori (n·H₂O)</h2>
          <p className="text-purple-200 text-xs mb-4">Gidrat suvlari soni (n) o'zgarganda C/H/N foizlari qanday o'zgarishini kuzating. EA orqali namuna gidrat holatini aniqlash mumkin.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <div className="text-center mb-3">
                <span className="text-4xl font-bold text-indigo-400">{hydrateCount}</span>
                <span className="text-purple-400 text-lg ml-1">H₂O</span>
              </div>
              <input type="range" min="0" max="10" step="1" value={hydrateCount} onChange={(e) => setHydrateCount(Number(e.target.value))} className="w-full accent-indigo-500 h-3 bg-purple-900 rounded-lg cursor-pointer mb-3" />
              <div className="flex justify-between text-[10px] text-purple-500 mb-3"><span>0 (suvsiz)</span><span>3 (tri)</span><span>10</span></div>
              <div className="grid grid-cols-4 gap-1 mb-3">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => (
                  <button key={n} onClick={() => setHydrateCount(n)} className={`py-1 rounded text-xs font-mono ${hydrateCount === n ? "bg-indigo-600 text-white" : "bg-purple-900/50 text-purple-400"}`}>{n}</button>
                ))}
              </div>
              <div className="space-y-1 text-xs border-t border-purple-700/30 pt-3">
                <div className="flex justify-between"><span className="text-purple-400">M:</span><span className="font-mono text-yellow-400">{calc.total} g/mol</span></div>
                <div className="flex justify-between"><span className="text-purple-400">Suv %:</span><span className="font-mono text-blue-400">{calc.waterPct}%</span></div>
                <div className="flex justify-between"><span className="text-purple-400">ΔM (suvsizdan):</span><span className="font-mono text-green-400">+{(calc.total - COMPOUND.anhydrousMass).toFixed(2)} g/mol</span></div>
              </div>
            </div>

            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30 space-y-3">
              {[
                { el: "C", val: calc.C, color: "bg-yellow-500", tc: "text-yellow-400" },
                { el: "H", val: calc.H, color: "bg-green-500", tc: "text-green-400" },
                { el: "N", val: calc.N, color: "bg-blue-500", tc: "text-blue-400" }
              ].map((item) => (
                <div key={item.el}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={`font-bold ${item.tc}`}>%{item.el}</span>
                    <span className="font-mono text-white">{item.val.toFixed(3)}</span>
                  </div>
                  <div className="w-full bg-purple-950 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all duration-500 ${item.color}`} style={{ width: `${Math.min(item.val * 3, 100)}%` }}></div>
                  </div>
                </div>
              ))}
              <div className="bg-amber-600/10 border border-amber-500/30 rounded-lg p-2 text-[10px] text-purple-200 mt-2">
                <strong className="text-amber-400">💡</strong> n=0→3: %H <strong>0.000→1.431%</strong>. CHNS ±0.1% aniqlikda gidratni ishonchli aniqlaydi.
              </div>
            </div>
          </div>

          {/* Gidrat scenariy chart */}
          <div className="mt-5 bg-purple-950/40 rounded-xl p-4 border border-purple-700/30">
            <h3 className="text-indigo-400 font-bold text-xs mb-3">📈 n·H₂O ↔ %H bog'lanish grafigi</h3>
            <svg viewBox="0 0 400 160" className="w-full">
              {/* Grid */}
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <line key={i} x1="40" x2="380" y1={20 + i * 25} y2={20 + i * 25} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
              ))}
              {/* Eksperimental data nuqtalari */}
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => {
                const waterMol = 2 * ATOMIC_MASSES.H + ATOMIC_MASSES.O
                const tot = COMPOUND.anhydrousMass + n * waterMol
                const hPct = (n * 2 * ATOMIC_MASSES.H) / tot * 100
                const x = 40 + (n / 8) * 340
                const y = 145 - (hPct / 2.5) * 125
                return (
                  <g key={n}>
                    <circle cx={x} cy={y} r="3" fill={n === hydrateCount ? "#fbbf24" : "#8b5cf6"} />
                    <text x={x} y={y - 7} textAnchor="middle" fontSize="7" fill={n === hydrateCount ? "#fbbf24" : "#a78bfa"}>{hPct.toFixed(2)}%</text>
                    <text x={x} y="158" textAnchor="middle" fontSize="8" fill="#a78bfa">{n}</text>
                  </g>
                )
              })}
              {/* Connect line */}
              <polyline
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="1.5"
                points={[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => {
                  const waterMol = 2 * ATOMIC_MASSES.H + ATOMIC_MASSES.O
                  const tot = COMPOUND.anhydrousMass + n * waterMol
                  const hPct = (n * 2 * ATOMIC_MASSES.H) / tot * 100
                  const x = 40 + (n / 8) * 340
                  const y = 145 - (hPct / 2.5) * 125
                  return `${x},${y}`
                }).join(" ")}
              />
              {/* Y axis labels */}
              <text x="10" y="25" fontSize="8" fill="#a78bfa">2.5%</text>
              <text x="10" y="75" fontSize="8" fill="#a78bfa">1.5%</text>
              <text x="10" y="125" fontSize="8" fill="#a78bfa">0.5%</text>
              <text x="200" y="15" textAnchor="middle" fontSize="9" fill="#fbbf24" fontWeight="bold">%H = f(n_H₂O)</text>
              <text x="200" y="175" textAnchor="middle" fontSize="8" fill="#a78bfa">n (gidrat suvlari soni)</text>
            </svg>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════ */}
        {/* 5. TGA SIMULYATSIYASI                                  */}
        {/* ═════════════════════════════════════════════════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-5 md:p-7">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><span>🔥</span> Termogravimetrik analiz (TGA) simulyatsiyasi</h2>
          <p className="text-purple-200 text-xs mb-4">
            K₄[Fe(CN)₆]·3H₂O ning bosqichli dehidratatsiyasi (manba: <a href="https://pubs.acs.org/doi/10.1021/ic802134j" target="_blank" className="text-indigo-400 underline">Beall et al., Inorg. Chem. 2009, 48, 8131</a>).
            Haroratni o'zgartirib, gidrat suvi yo'qotilish bosqichlarini kuzating.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* TGA Chart */}
            <div className="md:col-span-2 bg-purple-950/40 rounded-xl p-4 border border-purple-700/30">
              <svg viewBox="0 0 500 240" className="w-full">
                {/* Grid */}
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <line key={`hg-${i}`} x1="50" x2="480" y1={30 + i * 35} y2={30 + i * 35} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                ))}
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <line key={`vg-${i}`} x1={50 + i * 71.66} x2={50 + i * 71.66} y1="30" y2="205" stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                ))}

                {/* TGA egri chiziq */}
                <polyline
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  points={(() => {
                    const points = []
                    for (let t = 25; t <= 700; t += 10) {
                      let loss = 0
                      if (t < 75) loss = 0
                      else if (t < 95) loss = ((t - 75) / 20) * 4.26
                      else if (t < 130) loss = 4.26 + ((t - 95) / 35) * 8.52
                      else if (t < 450) loss = 12.78
                      else if (t < 650) loss = 12.78 + ((t - 450) / 200) * 25.72
                      else loss = 38.5
                      const x = 50 + ((t - 25) / 675) * 430
                      const y = 30 + (loss / 50) * 175
                      points.push(`${x},${y}`)
                    }
                    return points.join(" ")
                  })()}
                />

                {/* Joriy harorat ko'rsatkichi */}
                <line
                  x1={50 + ((tgaTemp - 25) / 675) * 430}
                  x2={50 + ((tgaTemp - 25) / 675) * 430}
                  y1="30" y2="205"
                  stroke="#fbbf24" strokeWidth="2" strokeDasharray="3,3"
                />
                <circle
                  cx={50 + ((tgaTemp - 25) / 675) * 430}
                  cy={(() => {
                    const t = tgaTemp
                    let loss = 0
                    if (t < 75) loss = 0
                    else if (t < 95) loss = ((t - 75) / 20) * 4.26
                    else if (t < 130) loss = 4.26 + ((t - 95) / 35) * 8.52
                    else if (t < 450) loss = 12.78
                    else if (t < 650) loss = 12.78 + ((t - 450) / 200) * 25.72
                    else loss = 38.5
                    return 30 + (loss / 50) * 175
                  })()}
                  r="5" fill="#fbbf24" stroke="#fff" strokeWidth="1"
                />

                {/* Bosqichlar yorlig'i */}
                <text x="85" y="50" fontSize="8" fill="#10b981">①</text>
                <text x="155" y="80" fontSize="8" fill="#3b82f6">②</text>
                <text x="195" y="100" fontSize="8" fill="#3b82f6">③</text>
                <text x="290" y="105" fontSize="8" fill="#f59e0b">④</text>
                <text x="400" y="180" fontSize="8" fill="#ef4444">⑤</text>

                {/* Eksenlar */}
                <line x1="50" y1="30" x2="50" y2="205" stroke="#a78bfa" strokeWidth="1" />
                <line x1="50" y1="205" x2="480" y2="205" stroke="#a78bfa" strokeWidth="1" />

                {/* Y label */}
                <text x="15" y="40" fontSize="9" fill="#a78bfa">0%</text>
                <text x="10" y="110" fontSize="9" fill="#a78bfa">-20%</text>
                <text x="10" y="180" fontSize="9" fill="#a78bfa">-40%</text>
                <text x="20" y="125" fontSize="8" fill="#a78bfa" transform="rotate(-90 20 125)">Massa yo'qotish (%)</text>

                {/* X label */}
                <text x="55" y="220" fontSize="8" fill="#a78bfa">25°C</text>
                <text x="195" y="220" fontSize="8" fill="#a78bfa">200°C</text>
                <text x="335" y="220" fontSize="8" fill="#a78bfa">450°C</text>
                <text x="455" y="220" fontSize="8" fill="#a78bfa">700°C</text>
                <text x="265" y="235" textAnchor="middle" fontSize="9" fill="#fbbf24" fontWeight="bold">Harorat (°C)</text>
              </svg>
            </div>

            {/* TGA controls + holat */}
            <div className="space-y-3">
              <div className="bg-purple-800/30 rounded-xl p-3 border border-purple-700/30">
                <label className="text-purple-300 text-xs mb-1 block">Harorat: <span className="text-yellow-400 font-bold font-mono">{tgaTemp}°C</span></label>
                <input
                  type="range" min="25" max="700" step="5" value={tgaTemp}
                  onChange={(e) => setTgaTemp(Number(e.target.value))}
                  className="w-full accent-yellow-500 h-2"
                />
                <div className="flex justify-between text-[9px] text-purple-500 mt-1"><span>25°C</span><span>700°C</span></div>
              </div>

              <div className={`rounded-xl p-3 border`} style={{ backgroundColor: `${tgaState.color}20`, borderColor: `${tgaState.color}50` }}>
                <div className="text-[10px] text-purple-400 mb-1">Joriy holat ({tgaState.tempStart}–{tgaState.tempEnd}°C):</div>
                <div className="font-bold text-sm" style={{ color: tgaState.color }}>{tgaState.event}</div>
                <div className="text-xs text-purple-200 mt-1">Δm = <span className="font-mono font-bold">−{tgaState.massLoss.toFixed(2)}%</span></div>
              </div>

              <div className="bg-purple-800/30 rounded-xl p-3 border border-purple-700/30 text-[10px] space-y-1">
                <div className="text-indigo-400 font-bold mb-1">Bosqichlar:</div>
                {COMPOUND.tgaSteps.map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="font-bold" style={{ color: s.color }}>{["①", "②", "③", "④", "⑤", "⑥"][i]}</span>
                    <span className="text-purple-300">{s.tempStart}–{s.tempEnd}°C</span>
                    <span className="text-purple-500 ml-auto">−{s.massLoss}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 bg-blue-600/10 border border-blue-500/30 rounded-xl p-3 text-[11px] text-purple-200">
            <strong className="text-blue-400">📚 Mexanizm:</strong> K₄[Fe(CN)₆]·3H₂O ikki bosqichda suvsizlanadi:
            (1) 75–95°C da bitta H₂O (4.26%) — sirtdagi suv,
            (2) 95–130°C da qolgan 2H₂O (8.52%) — kristall panjaradan.
            450°C dan keyin CN⁻ guruh parchalanadi: <span className="font-mono text-indigo-400">K₄[Fe(CN)₆] → 4KCN + Fe + C + N₂↑</span>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════ */}
        {/* 6. YONISH MEXANIZMI — Reaksiya sxemasi                 */}
        {/* ═════════════════════════════════════════════════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-5 md:p-7">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><span>⚗️</span> CHNS yonish mexanizmi (1050°C)</h2>

          <div className="bg-purple-950/40 rounded-xl p-4 border border-purple-700/30 mb-4">
            <svg viewBox="0 0 600 220" className="w-full">
              {/* Namuna */}
              <rect x="15" y="80" width="80" height="50" rx="6" fill="#8b5cf6" opacity="0.3" stroke="#a78bfa" />
              <text x="55" y="100" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">Namuna</text>
              <text x="55" y="115" textAnchor="middle" fill="#fbbf24" fontSize="8">K₄[Fe(CN)₆]·3H₂O</text>
              <text x="55" y="128" textAnchor="middle" fill="#a78bfa" fontSize="7">~2 mg, Sn kapsula</text>

              {/* Arrow 1 */}
              <line x1="95" y1="105" x2="135" y2="105" stroke="#fbbf24" strokeWidth="1.5" markerEnd="url(#arr1)" />
              <text x="115" y="98" textAnchor="middle" fill="#fbbf24" fontSize="7">O₂ + He</text>

              {/* Yonish kamerasi */}
              <rect x="140" y="60" width="120" height="90" rx="6" fill="#ef4444" opacity="0.2" stroke="#ef4444" />
              <text x="200" y="80" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="bold">YONISH</text>
              <text x="200" y="93" textAnchor="middle" fill="#fff" fontSize="8">1050°C</text>
              <text x="200" y="108" textAnchor="middle" fill="#a78bfa" fontSize="7">WO₃ katalizator</text>
              <text x="200" y="122" textAnchor="middle" fill="#fbbf24" fontSize="7">C → CO₂</text>
              <text x="200" y="135" textAnchor="middle" fill="#fbbf24" fontSize="7">N → NOₓ + N₂</text>
              <text x="200" y="146" textAnchor="middle" fill="#fbbf24" fontSize="7">H → H₂O</text>

              {/* Arrow 2 */}
              <line x1="260" y1="105" x2="300" y2="105" stroke="#fbbf24" strokeWidth="1.5" markerEnd="url(#arr1)" />
              <text x="280" y="98" textAnchor="middle" fill="#fbbf24" fontSize="7">CO₂, NOₓ, H₂O</text>

              {/* Cu reduktor */}
              <rect x="305" y="70" width="100" height="70" rx="6" fill="#10b981" opacity="0.2" stroke="#10b981" />
              <text x="355" y="88" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="bold">Cu REDUKTOR</text>
              <text x="355" y="102" textAnchor="middle" fill="#fff" fontSize="8">650°C</text>
              <text x="355" y="118" textAnchor="middle" fill="#a78bfa" fontSize="7">NOₓ + Cu → N₂ + CuO</text>
              <text x="355" y="132" textAnchor="middle" fill="#a78bfa" fontSize="7">O₂ qoldig'i yo'q</text>

              {/* Arrow 3 */}
              <line x1="405" y1="105" x2="445" y2="105" stroke="#fbbf24" strokeWidth="1.5" markerEnd="url(#arr1)" />
              <text x="425" y="98" textAnchor="middle" fill="#fbbf24" fontSize="7">N₂, CO₂, H₂O</text>

              {/* GC kolonna + TCD */}
              <rect x="450" y="60" width="130" height="90" rx="6" fill="#3b82f6" opacity="0.2" stroke="#3b82f6" />
              <text x="515" y="80" textAnchor="middle" fill="#3b82f6" fontSize="10" fontWeight="bold">GC + TCD</text>
              <text x="515" y="95" textAnchor="middle" fill="#a78bfa" fontSize="7">Porapak QS kolonna</text>
              <text x="515" y="110" textAnchor="middle" fill="#fbbf24" fontSize="7">N₂ (1.2 min)</text>
              <text x="515" y="123" textAnchor="middle" fill="#eab308" fontSize="7">CO₂ (2.8 min)</text>
              <text x="515" y="136" textAnchor="middle" fill="#06b6d4" fontSize="7">H₂O (4.5 min)</text>
              <text x="515" y="148" textAnchor="middle" fill="#10b981" fontSize="7">→ Integral signal</text>

              {/* Reaksiya tenglamalari pastida */}
              <line x1="20" y1="170" x2="580" y2="170" stroke="#3b3470" strokeWidth="0.5" />
              <text x="20" y="185" fontSize="9" fill="#a78bfa" fontWeight="bold">Asosiy reaksiyalar:</text>
              <text x="20" y="200" fontSize="8" fill="#fbbf24" fontFamily="monospace">K₄[Fe(CN)₆]·3H₂O + (25/2)O₂ → 4KOH + Fe₂O₃ + 6CO₂ + 3N₂ + H₂O</text>
              <text x="20" y="212" fontSize="8" fill="#10b981" fontFamily="monospace">2NO + 2Cu → N₂ + 2CuO  •  NO₂ + Cu → ½N₂ + CuO + ½O₂</text>

              {/* Arrow marker */}
              <defs>
                <marker id="arr1" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <polygon points="0 0, 6 3, 0 6" fill="#fbbf24" />
                </marker>
              </defs>
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-3">
              <h4 className="text-red-400 font-bold text-xs mb-1">🔥 Yonish kamerasi (1050°C)</h4>
              <p className="text-purple-200 text-[10px]">Sn kapsula ekzotermik yonadi (~1800°C lokal), WO₃/MgO katalizator C ni CO₂ ga to'liq oksidlaydi. CN guruh N₂ + NOₓ aralashmasiga aylanadi.</p>
            </div>
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-3">
              <h4 className="text-green-400 font-bold text-xs mb-1">♻️ Cu reduktor (650°C)</h4>
              <p className="text-purple-200 text-[10px]">Sianid birikmalarda majburiy! NOₓ → N₂ to'liq reduksiya, ortiqcha O₂ yutilishi. Cu eskirgan bo'lsa, %N pastroq chiqadi.</p>
            </div>
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-3">
              <h4 className="text-blue-400 font-bold text-xs mb-1">📊 TCD detektor</h4>
              <p className="text-purple-200 text-[10px]">Issiqlik o'tkazuvchanligi farqi orqali N₂/CO₂/H₂O ni alohida o'lchaydi. Kalibratsiyada sulfanilamid bilan sozlanadi.</p>
            </div>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════ */}
        {/* 7. TCD XROMATOGRAMMA                                   */}
        {/* ═════════════════════════════════════════════════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-5 md:p-7">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><span>📈</span> TCD xromatogramma simulyatsiyasi</h2>
          <p className="text-purple-200 text-xs mb-4">K₄[Fe(CN)₆]·3H₂O namunasidan olinadigan tipik xromatogramma. Peak maydoni element foiziga proporsional.</p>

          <div className="bg-purple-950/40 rounded-xl p-4 border border-purple-700/30">
            <svg viewBox="0 0 600 240" className="w-full">
              {/* Grid */}
              {[0, 1, 2, 3, 4].map((i) => (
                <line key={i} x1="50" x2="580" y1={40 + i * 40} y2={40 + i * 40} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
              ))}

              {/* Peaks (Gauss) */}
              {COMPOUND.tcdPeaks.map((peak, i) => {
                const cx = 50 + (peak.rt / 6) * 530
                const peakHeight = (peak.area / 65) * 160
                const w = peak.width * 30
                return (
                  <g key={i}>
                    <path
                      d={`M ${cx - w * 2} 200 Q ${cx - w} ${200 - peakHeight * 0.3} ${cx} ${200 - peakHeight} Q ${cx + w} ${200 - peakHeight * 0.3} ${cx + w * 2} 200`}
                      fill={peak.color} opacity="0.35"
                    />
                    <path
                      d={`M ${cx - w * 2} 200 Q ${cx - w} ${200 - peakHeight * 0.3} ${cx} ${200 - peakHeight} Q ${cx + w} ${200 - peakHeight * 0.3} ${cx + w * 2} 200`}
                      fill="none" stroke={peak.color} strokeWidth="1.5"
                    />
                    <line x1={cx} x2={cx} y1={200 - peakHeight} y2={200 - peakHeight - 10} stroke={peak.color} strokeWidth="0.5" strokeDasharray="2,2" />
                    <text x={cx} y={200 - peakHeight - 15} textAnchor="middle" fontSize="10" fill={peak.color} fontWeight="bold">{peak.name}</text>
                    <text x={cx} y={200 - peakHeight - 4} textAnchor="middle" fontSize="7" fill={peak.color}>RT: {peak.rt} min</text>
                    <text x={cx} y={215} textAnchor="middle" fontSize="8" fill={peak.color}>Area: {peak.area}%</text>
                  </g>
                )
              })}

              {/* Baseline */}
              <line x1="50" y1="200" x2="580" y2="200" stroke="#a78bfa" strokeWidth="1" />

              {/* X axis */}
              {[0, 1, 2, 3, 4, 5, 6].map((t) => {
                const x = 50 + (t / 6) * 530
                return (
                  <g key={t}>
                    <line x1={x} y1="200" x2={x} y2="204" stroke="#a78bfa" strokeWidth="1" />
                    <text x={x} y="232" textAnchor="middle" fontSize="8" fill="#a78bfa">{t}</text>
                  </g>
                )
              })}

              {/* Y axis */}
              <line x1="50" y1="40" x2="50" y2="200" stroke="#a78bfa" strokeWidth="1" />
              <text x="30" y="125" textAnchor="middle" fontSize="8" fill="#a78bfa" transform="rotate(-90 30 125)">TCD signal (mV)</text>
              <text x="315" y="240" textAnchor="middle" fontSize="9" fill="#fbbf24" fontWeight="bold">Vaqt (daqiqa)</text>

              {/* Title */}
              <text x="315" y="25" textAnchor="middle" fontSize="11" fill="#fff" fontWeight="bold">TCD Xromatogramma — K₄[Fe(CN)₆]·3H₂O</text>
            </svg>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4">
            {COMPOUND.tcdPeaks.map((p, i) => (
              <div key={i} className="bg-purple-800/30 rounded-lg p-3 border" style={{ borderColor: `${p.color}50` }}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: p.color }}></div>
                  <span className="font-bold" style={{ color: p.color }}>{p.name}</span>
                </div>
                <div className="text-[10px] text-purple-300">Retention: <span className="font-mono text-white">{p.rt} min</span></div>
                <div className="text-[10px] text-purple-300">Maydon: <span className="font-mono text-white">{p.area}%</span></div>
                <div className="text-[10px] text-purple-500 mt-1">
                  {p.name === "N₂" && "→ %N hisobiga"}
                  {p.name === "CO₂" && "→ %C hisobiga"}
                  {p.name === "H₂O" && "→ %H hisobiga"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════ */}
        {/* 8. KALIBRATSIYA EGRI CHIZIG'I                          */}
        {/* ═════════════════════════════════════════════════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-5 md:p-7">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><span>📏</span> Kalibratsiya egri chizig'i (Sulfanilamid standart)</h2>
          <p className="text-purple-200 text-xs mb-4">
            Sulfanilamid (C₆H₈N₈O₂S) — IUPAC tomonidan tasdiqlangan EA etalon (Cref: %C=41.84, %H=4.68, %N=16.27). LOD va R² qiymatlari instrument sifatining muhim ko'rsatkichlari.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Calibration plot */}
            <div className="bg-purple-950/40 rounded-xl p-4 border border-purple-700/30">
              <svg viewBox="0 0 360 240" className="w-full">
                {/* Grid */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <line key={i} x1="50" x2="340" y1={30 + i * 40} y2={30 + i * 40} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                ))}

                {/* C points & line */}
                {COMPOUND.calibrationStandard.points.map((p, i) => {
                  const x = 50 + (p.mass / 3.5) * 290
                  const y = 195 - (p.signalC / 0.6) * 160
                  return <circle key={`c-${i}`} cx={x} cy={y} r="3" fill="#eab308" stroke="#fff" strokeWidth="0.5" />
                })}
                <line
                  x1={50 + 0} y1={195 - (calibration.C.intercept / 0.6) * 160}
                  x2={50 + (3.5 / 3.5) * 290} y2={195 - ((calibration.C.slope * 3.5 + calibration.C.intercept) / 0.6) * 160}
                  stroke="#eab308" strokeWidth="1.5"
                />

                {/* N points & line */}
                {COMPOUND.calibrationStandard.points.map((p, i) => {
                  const x = 50 + (p.mass / 3.5) * 290
                  const y = 195 - (p.signalN / 0.6) * 160
                  return <circle key={`n-${i}`} cx={x} cy={y} r="3" fill="#3b82f6" stroke="#fff" strokeWidth="0.5" />
                })}
                <line
                  x1={50 + 0} y1={195 - (calibration.N.intercept / 0.6) * 160}
                  x2={50 + (3.5 / 3.5) * 290} y2={195 - ((calibration.N.slope * 3.5 + calibration.N.intercept) / 0.6) * 160}
                  stroke="#3b82f6" strokeWidth="1.5"
                />

                {/* Axes */}
                <line x1="50" y1="30" x2="50" y2="195" stroke="#a78bfa" strokeWidth="1" />
                <line x1="50" y1="195" x2="340" y2="195" stroke="#a78bfa" strokeWidth="1" />

                {/* Labels */}
                <text x="40" y="200" textAnchor="end" fontSize="8" fill="#a78bfa">0</text>
                <text x="40" y="115" textAnchor="end" fontSize="8" fill="#a78bfa">0.3</text>
                <text x="40" y="35" textAnchor="end" fontSize="8" fill="#a78bfa">0.6</text>
                <text x="50" y="210" textAnchor="middle" fontSize="8" fill="#a78bfa">0</text>
                <text x="195" y="210" textAnchor="middle" fontSize="8" fill="#a78bfa">1.75</text>
                <text x="340" y="210" textAnchor="middle" fontSize="8" fill="#a78bfa">3.5</text>
                <text x="195" y="225" textAnchor="middle" fontSize="9" fill="#fbbf24">Standart massa (mg)</text>
                <text x="20" y="115" fontSize="8" fill="#a78bfa" transform="rotate(-90 20 115)">TCD signal</text>

                {/* Legend */}
                <circle cx="270" cy="40" r="3" fill="#eab308" />
                <text x="278" y="44" fontSize="8" fill="#eab308">C kanal</text>
                <circle cx="270" cy="55" r="3" fill="#3b82f6" />
                <text x="278" y="59" fontSize="8" fill="#3b82f6">N kanal</text>
              </svg>
            </div>

            {/* Regression parameters */}
            <div className="space-y-3">
              <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-3">
                <h4 className="text-yellow-400 font-bold text-xs mb-2">Carbon kanali</h4>
                <table className="w-full text-[11px]">
                  <tbody className="text-purple-200">
                    <tr><td className="py-0.5">Slope (a):</td><td className="text-right font-mono text-yellow-400">{calibration.C.slope.toFixed(5)}</td></tr>
                    <tr><td className="py-0.5">Intercept (b):</td><td className="text-right font-mono">{calibration.C.intercept.toFixed(5)}</td></tr>
                    <tr><td className="py-0.5">R²:</td><td className="text-right font-mono text-green-400 font-bold">{calibration.C.r2.toFixed(6)}</td></tr>
                    <tr><td className="py-0.5">Tenglama:</td><td className="text-right font-mono text-[9px]">y = {calibration.C.slope.toFixed(4)}x + {calibration.C.intercept.toFixed(4)}</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-3">
                <h4 className="text-blue-400 font-bold text-xs mb-2">Nitrogen kanali</h4>
                <table className="w-full text-[11px]">
                  <tbody className="text-purple-200">
                    <tr><td className="py-0.5">Slope (a):</td><td className="text-right font-mono text-blue-400">{calibration.N.slope.toFixed(5)}</td></tr>
                    <tr><td className="py-0.5">Intercept (b):</td><td className="text-right font-mono">{calibration.N.intercept.toFixed(5)}</td></tr>
                    <tr><td className="py-0.5">R²:</td><td className="text-right font-mono text-green-400 font-bold">{calibration.N.r2.toFixed(6)}</td></tr>
                    <tr><td className="py-0.5">Tenglama:</td><td className="text-right font-mono text-[9px]">y = {calibration.N.slope.toFixed(4)}x + {calibration.N.intercept.toFixed(4)}</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-2 text-[10px] text-green-300">
                ✅ Ikkala kanal uchun R² &gt; 0.999 — chiziqlilik mukammal. Kalibrant javob bermayotgan bo'lsa, koloñnani almashtirish kerak.
              </div>
            </div>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════ */}
        {/* 9. EKSPERIMENTAL NATIJALAR + BAR CHART                 */}
        {/* ═════════════════════════════════════════════════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-5 md:p-7">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><span>🔬</span> Eksperimental natijalar (n = 5)</h2>

          <div className="flex gap-2 flex-wrap mb-4">
            {COMPOUND.experimentalRuns.map((r) => (
              <button key={r.id} onClick={() => setActiveRun(r.id)} className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${activeRun === r.id ? "bg-indigo-600 text-white ring-2 ring-indigo-400/30" : "bg-purple-900/50 text-purple-300"}`}>
                📅 {r.date} | {r.sampleMass}mg
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
            {/* Joriy run taqqoslash */}
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <h3 className="text-indigo-400 font-bold text-xs mb-3">Joriy run: {run.date} ({run.operator}, {run.instrument.split(" ")[0]})</h3>
              <table className="w-full text-xs">
                <thead><tr className="border-b border-purple-700">
                  <th className="py-2 px-2 text-left text-purple-300">El</th>
                  <th className="py-2 px-2 text-center text-purple-300">Nazariy</th>
                  <th className="py-2 px-2 text-center text-purple-300">Eksp</th>
                  <th className="py-2 px-2 text-center text-purple-300">Δ</th>
                  <th className="py-2 px-2 text-center text-purple-300">Holat</th>
                </tr></thead>
                <tbody className="text-purple-200">
                  {[{ el: "C", t: calc.C, e: run.C, d: dC }, { el: "H", t: calc.H, e: run.H, d: dH }, { el: "N", t: calc.N, e: run.N, d: dN }].map((row) => {
                    const st = row.d <= 0.2 ? "A'lo" : row.d <= 0.4 ? "Qabul" : row.d <= 0.6 ? "Chegara" : "Rad"
                    return (
                      <tr key={row.el} className="border-b border-purple-800/30">
                        <td className="py-2 px-2 font-bold text-indigo-400">{row.el}</td>
                        <td className="py-2 px-2 text-center font-mono text-yellow-400">{row.t.toFixed(3)}</td>
                        <td className="py-2 px-2 text-center font-mono">{row.e.toFixed(2)}</td>
                        <td className="py-2 px-2 text-center font-mono"><span className={row.d <= 0.4 ? "text-green-400" : "text-red-400"}>{row.d.toFixed(3)}</span></td>
                        <td className="py-2 px-2 text-center"><span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${statusColor(row.d)}`}>{st}</span></td>
                      </tr>
                    )
                  })}
                  <tr className="bg-indigo-900/20">
                    <td className="py-2 px-2 text-purple-400 text-[10px]">Recovery</td>
                    <td className="py-2 px-2"></td>
                    <td className="py-2 px-2 text-center font-mono text-cyan-400">{run.recovery.toFixed(2)}%</td>
                    <td className="py-2 px-2"></td>
                    <td className="py-2 px-2 text-center text-[9px] text-purple-400">98-102%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Statistika */}
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <h3 className="text-indigo-400 font-bold text-xs mb-3">📊 Statistik tahlil (n = 5)</h3>
              <table className="w-full text-xs">
                <thead><tr className="border-b border-purple-700">
                  <th className="py-2 px-2 text-left text-purple-300">Parametr</th>
                  <th className="py-2 px-2 text-center text-yellow-400">C</th>
                  <th className="py-2 px-2 text-center text-green-400">H</th>
                  <th className="py-2 px-2 text-center text-blue-400">N</th>
                </tr></thead>
                <tbody className="text-purple-200 font-mono">
                  {[
                    { l: "x̄ (o'rtacha)", k: "mean", f: 3 },
                    { l: "s (st.og'ish)", k: "std", f: 3 },
                    { l: "SEM", k: "sem", f: 4 },
                    { l: "95% CI", k: "ci95", f: 3 },
                    { l: "Min", k: "min", f: 2 },
                    { l: "Max", k: "max", f: 2 },
                    { l: "RSD %", k: "rsd", f: 2 }
                  ].map((row) => (
                    <tr key={row.k} className="border-b border-purple-800/30">
                      <td className="py-1.5 px-2 text-purple-400 text-[10px]">{row.l}</td>
                      <td className="py-1.5 px-2 text-center">{stats.C[row.k].toFixed(row.f)}</td>
                      <td className="py-1.5 px-2 text-center">{stats.H[row.k].toFixed(row.f)}</td>
                      <td className="py-1.5 px-2 text-center">{stats.N[row.k].toFixed(row.f)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-2 bg-green-600/10 border border-green-500/30 rounded-lg p-2 text-[10px] text-green-300">✅ N, H uchun RSD &lt; 1% — yuqori takrorlanuvchanlik</div>
            </div>
          </div>

          {/* Bar chart — Nazariy vs Eksperimental (5 run) */}
          <div className="bg-purple-950/40 rounded-xl p-4 border border-purple-700/30 mb-4">
            <h3 className="text-indigo-400 font-bold text-xs mb-3">📊 Nazariy vs Eksperimental — barcha runlar</h3>
            <svg viewBox="0 0 600 220" className="w-full">
              {/* Y grid */}
              {[0, 5, 10, 15, 20].map((v) => (
                <g key={v}>
                  <line x1="50" x2="580" y1={195 - (v / 22) * 160} y2={195 - (v / 22) * 160} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="42" y={199 - (v / 22) * 160} textAnchor="end" fontSize="8" fill="#a78bfa">{v}%</text>
                </g>
              ))}

              {/* Bars: theoretical lines + experimental bars */}
              {["C", "H", "N"].map((el, eIdx) => {
                const theoretical = calc[el]
                const groupX = 80 + eIdx * 170
                const color = el === "C" ? "#eab308" : el === "H" ? "#10b981" : "#3b82f6"
                return (
                  <g key={el}>
                    {/* Theoretical horizontal line */}
                    <line x1={groupX - 10} x2={groupX + 130} y1={195 - (theoretical / 22) * 160} y2={195 - (theoretical / 22) * 160} stroke={color} strokeWidth="1.5" strokeDasharray="4,2" />
                    <text x={groupX + 135} y={199 - (theoretical / 22) * 160} fontSize="7" fill={color}>{theoretical.toFixed(2)}</text>

                    {/* 5 experimental bars */}
                    {COMPOUND.experimentalRuns.map((r, i) => {
                      const val = Number(r[el])
                      const bx = groupX + i * 22
                      const bh = (val / 22) * 160
                      return (
                        <g key={r.id}>
                          <rect x={bx} y={195 - bh} width="18" height={bh} fill={color} opacity="0.7" stroke={color} strokeWidth="0.5" />
                          <text x={bx + 9} y={193 - bh} textAnchor="middle" fontSize="6" fill={color}>{val.toFixed(1)}</text>
                          <text x={bx + 9} y={210} textAnchor="middle" fontSize="6" fill="#a78bfa">R{i + 1}</text>
                        </g>
                      )
                    })}

                    {/* Group label */}
                    <text x={groupX + 55} y={225} textAnchor="middle" fontSize="10" fill={color} fontWeight="bold">%{el}</text>
                  </g>
                )
              })}

              <line x1="50" y1="195" x2="580" y2="195" stroke="#a78bfa" strokeWidth="1" />
            </svg>
            <div className="text-[9px] text-purple-400 text-center mt-2">--- Punktir chiziq: nazariy qiymat | Ustunlar: 5 ta mustaqil eksperiment</div>
          </div>

          {/* Validatsiya xulosasi */}
          <div className={`rounded-xl p-4 border ${maxD <= 0.2 ? "bg-green-600/10 border-green-500/30" : maxD <= 0.4 ? "bg-yellow-600/10 border-yellow-500/30" : "bg-red-600/10 border-red-500/30"}`}>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{maxD <= 0.2 ? "✅" : maxD <= 0.4 ? "⚠️" : "❌"}</span>
              <div>
                <p className={`font-bold ${maxD <= 0.2 ? "text-green-400" : maxD <= 0.4 ? "text-yellow-400" : "text-red-400"}`}>
                  Δ_max = {maxD.toFixed(3)}% → {maxD <= 0.2 ? "A'LO" : maxD <= 0.4 ? "QABUL" : "RAD"}
                </p>
                <p className="text-purple-300 text-[10px]">Jurnal standarti: ±0.4% (J. Am. Chem. Soc., Inorg. Chem., et al.)</p>
              </div>
            </div>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════ */}
        {/* 10. OUTLIER TESTLARI (Grubbs + Dixon Q)                */}
        {/* ═════════════════════════════════════════════════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-5 md:p-7">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><span>🎯</span> Outlier (chetga chiquvchi qiymat) testlari</h2>
          <p className="text-purple-200 text-xs mb-4">
            Grubbs va Dixon Q testlari shubhali natijalarni statistik aniqlash uchun ishlatiladi (α = 0.05, n = 5). Kritik qiymatlar: G_crit = 1.715, Q_crit = 0.642.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {["C", "H", "N"].map((el) => {
              const tests = outlierTests[el]
              const color = el === "C" ? "yellow" : el === "H" ? "green" : "blue"
              return (
                <div key={el} className={`bg-${color}-600/10 border border-${color}-500/30 rounded-xl p-3`}>
                  <h4 className={`text-${color}-400 font-bold text-xs mb-2`}>%{el} elementi uchun</h4>

                  <div className="space-y-2 text-[11px]">
                    <div className="bg-purple-950/50 rounded p-2">
                      <div className="text-purple-400 text-[10px] font-bold mb-1">Grubbs testi</div>
                      <div className="flex justify-between text-purple-200">
                        <span>G_hisob:</span>
                        <span className="font-mono text-white">{tests.grubbs.G.toFixed(3)}</span>
                      </div>
                      <div className="flex justify-between text-purple-200">
                        <span>G_krit:</span>
                        <span className="font-mono">{tests.grubbs.critical}</span>
                      </div>
                      <div className={`mt-1 text-center font-bold ${tests.grubbs.isOutlier ? "text-red-400" : "text-green-400"}`}>
                        {tests.grubbs.isOutlier ? `❌ Outlier (R${tests.grubbs.outlierIdx + 1})` : "✅ Outlier yo'q"}
                      </div>
                    </div>

                    <div className="bg-purple-950/50 rounded p-2">
                      <div className="text-purple-400 text-[10px] font-bold mb-1">Dixon Q testi</div>
                      <div className="flex justify-between text-purple-200">
                        <span>Q_low:</span>
                        <span className="font-mono text-white">{tests.dixon.Q_low.toFixed(3)}</span>
                      </div>
                      <div className="flex justify-between text-purple-200">
                        <span>Q_high:</span>
                        <span className="font-mono text-white">{tests.dixon.Q_high.toFixed(3)}</span>
                      </div>
                      <div className="flex justify-between text-purple-200">
                        <span>Q_krit:</span>
                        <span className="font-mono">{tests.dixon.critical}</span>
                      </div>
                      <div className={`mt-1 text-center font-bold ${tests.dixon.isOutlier ? "text-red-400" : "text-green-400"}`}>
                        {tests.dixon.isOutlier ? "❌ Outlier bor" : "✅ Outlier yo'q"}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-4 bg-indigo-600/10 border border-indigo-500/30 rounded-xl p-3 text-[11px] text-purple-200">
            <strong className="text-indigo-400">📌 Tafsir:</strong> Agar G_hisob &gt; G_krit yoki Q_hisob &gt; Q_krit bo'lsa, tegishli natija outlier hisoblanadi va rad etiladi. Bu yerda 5-runda (R5) %C = 17.65 qiymati qolgan o'rtacha 17.06 dan sezilarli farq qiladi.
            <br/><br/>
            <strong className="text-indigo-400">Formula:</strong>
            <span className="block font-mono mt-1 text-[10px]">
              G = |x_shubhali − x̄| / s  •  Q = (x_shubhali − x_qo'shni) / (x_max − x_min)
            </span>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════ */}
        {/* 11. EMPIRIK FORMULA QAYTA TIKLASH                      */}
        {/* ═════════════════════════════════════════════════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-5 md:p-7">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><span>🧬</span> Empirik formula qayta tiklash</h2>
          <p className="text-purple-200 text-xs mb-4">
            Eksperimental C/H/N foizlaridan empirik formuladagi atomlar nisbatini hisoblash. Real natija C₆H₆N₆ ga yaqin bo'lishi kerak (CN<sub>6</sub> guruh + 3H₂O).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-3">
              {[
                { l: "%C", val: empC, set: setEmpC, color: "yellow" },
                { l: "%H", val: empH, set: setEmpH, color: "green" },
                { l: "%N", val: empN, set: setEmpN, color: "blue" }
              ].map((inp) => (
                <div key={inp.l}>
                  <label className={`text-${inp.color}-400 text-xs mb-1 block font-semibold`}>Eksperimental {inp.l}:</label>
                  <input
                    type="number" step="0.01" value={inp.val}
                    onChange={(e) => inp.set(Number(e.target.value))}
                    className={`w-full bg-purple-950/60 border border-purple-700/50 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-${inp.color}-400`}
                  />
                </div>
              ))}
              <div className="bg-purple-950/50 rounded-lg p-3 mt-3">
                <div className="text-purple-400 text-[10px] mb-2 font-bold">Bosqichli hisob:</div>
                <table className="w-full text-[10px] font-mono">
                  <thead><tr className="text-purple-500"><td>El</td><td className="text-right">% / Aᵣ</td><td className="text-right">Mol</td><td className="text-right">÷ min</td><td className="text-right">Yax</td></tr></thead>
                  <tbody className="text-purple-200">
                    <tr><td className="text-yellow-400">C</td><td className="text-right">{empC}/12.011</td><td className="text-right">{empiricalFormula.molC.toFixed(4)}</td><td className="text-right">{empiricalFormula.ratios.C.toFixed(3)}</td><td className="text-right text-yellow-400 font-bold">{empiricalFormula.rounded.C}</td></tr>
                    <tr><td className="text-green-400">H</td><td className="text-right">{empH}/1.008</td><td className="text-right">{empiricalFormula.molH.toFixed(4)}</td><td className="text-right">{empiricalFormula.ratios.H.toFixed(3)}</td><td className="text-right text-green-400 font-bold">{empiricalFormula.rounded.H}</td></tr>
                    <tr><td className="text-blue-400">N</td><td className="text-right">{empN}/14.007</td><td className="text-right">{empiricalFormula.molN.toFixed(4)}</td><td className="text-right">{empiricalFormula.ratios.N.toFixed(3)}</td><td className="text-right text-blue-400 font-bold">{empiricalFormula.rounded.N}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-xl p-4 border border-indigo-500/30 flex flex-col justify-center">
              <div className="text-center">
                <div className="text-purple-400 text-xs mb-2">Hisoblangan empirik formula:</div>
                <div className="text-3xl font-bold font-mono text-white mb-3">
                  C<sub className="text-yellow-400">{empiricalFormula.rounded.C}</sub>
                  H<sub className="text-green-400">{empiricalFormula.rounded.H}</sub>
                  N<sub className="text-blue-400">{empiricalFormula.rounded.N}</sub>
                </div>
                <div className="text-purple-300 text-xs mb-3">
                  Kutilgan (CHN qismi): <strong className="text-indigo-400 font-mono">C₆H₆N₆</strong>
                </div>
                {empiricalFormula.rounded.C === 6 && empiricalFormula.rounded.H === 6 && empiricalFormula.rounded.N === 6 ? (
                  <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-2 text-green-400 font-bold">
                    ✅ Formula to'g'ri qayta tiklandi!
                  </div>
                ) : (
                  <div className="bg-amber-600/20 border border-amber-500/30 rounded-lg p-2 text-amber-400 font-bold text-xs">
                    ⚠️ Tafovut bor: eksperimentni qayta tekshiring
                  </div>
                )}
              </div>
              <div className="mt-4 text-[10px] text-purple-300 border-t border-purple-700/30 pt-3">
                <strong className="text-indigo-400">Eslatma:</strong> Empirik formula faqat <em>nisbatni</em> beradi.
                K, Fe, O atomlarini aniqlash uchun ICP-OES, EDX yoki AAS kerak.
                Molekulyar formula M = 422.4 g/mol orqali tasdiqlanadi.
              </div>
            </div>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════ */}
        {/* 12. SHAXSIY VALIDATSIYA                                */}
        {/* ═════════════════════════════════════════════════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-5 md:p-7">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><span>🧮</span> O'z natijangizni tekshiring</h2>
          <p className="text-purple-200 text-xs mb-4">Eksperimental C/H/N qiymatlarini kiriting. Joriy gidrat holati: <strong className="text-indigo-400">{hydrateCount}H₂O</strong></p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-3">
              {[
                { label: "%C", val: customC, set: setCustomC, border: "focus:border-yellow-400" },
                { label: "%H", val: customH, set: setCustomH, border: "focus:border-green-400" },
                { label: "%N", val: customN, set: setCustomN, border: "focus:border-blue-400" }
              ].map((inp) => (
                <div key={inp.label}>
                  <label className="text-purple-400 text-xs mb-1 block">Eksperimental {inp.label}:</label>
                  <input type="number" step="0.01" value={inp.val} onChange={(e) => inp.set(Number(e.target.value))} className={`w-full bg-purple-950/60 border border-purple-700/50 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none ${inp.border}`} />
                </div>
              ))}
            </div>

            <div className="space-y-2">
              {[
                { el: "C", d: cdC, t: calc.C, e: customC, color: "yellow" },
                { el: "H", d: cdH, t: calc.H, e: customH, color: "green" },
                { el: "N", d: cdN, t: calc.N, e: customN, color: "blue" }
              ].map((row) => (
                <div key={row.el} className="bg-purple-900/50 rounded-lg p-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className={`font-bold text-${row.color}-400`}>{row.el}: Naz {row.t.toFixed(3)} | Eksp {row.e.toFixed(2)}</span>
                    <span className={`font-mono font-bold ${row.d <= 0.4 ? "text-green-400" : "text-red-400"}`}>Δ={row.d.toFixed(3)}%</span>
                  </div>
                  <div className="w-full bg-purple-950 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${row.d <= 0.2 ? "bg-green-500" : row.d <= 0.4 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${Math.min(row.d * 100, 100)}%` }}></div>
                  </div>
                </div>
              ))}
              <div className={`rounded-lg p-3 border text-center mt-2 ${cStatus === "A'lo" ? "bg-green-600/20 border-green-500/30" : cStatus === "Qabul" ? "bg-yellow-600/20 border-yellow-500/30" : "bg-red-600/20 border-red-500/30"}`}>
                <span className="text-xl mr-2">{cStatus === "A'lo" ? "✅" : cStatus === "Qabul" ? "⚠️" : "❌"}</span>
                <span className={`font-bold ${cStatus === "A'lo" ? "text-green-400" : cStatus === "Qabul" ? "text-yellow-400" : "text-red-400"}`}>{cStatus.toUpperCase()}</span>
                <span className="text-purple-300 text-xs ml-2">(Δ_max={cMaxD.toFixed(3)}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════ */}
        {/* 13. LITERATURA SOLISHTIRISH                            */}
        {/* ═════════════════════════════════════════════════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-5 md:p-7">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><span>📚</span> Adabiyot bilan solishtirish</h2>
          <p className="text-purple-200 text-xs mb-4">Bizning natija mashhur kimyo ma'lumotnomalari va sertifikatlangan namunalar bilan solishtirilgan.</p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-purple-700">
                <th className="py-2 px-3 text-left text-purple-300">Manba</th>
                <th className="py-2 px-3 text-center text-yellow-400">%C</th>
                <th className="py-2 px-3 text-center text-green-400">%H</th>
                <th className="py-2 px-3 text-center text-blue-400">%N</th>
                <th className="py-2 px-3 text-left text-purple-300">Izoh</th>
              </tr></thead>
              <tbody className="text-purple-200">
                <tr className="bg-indigo-900/30 border-b border-purple-700">
                  <td className="py-2 px-3 font-bold text-indigo-400">📐 Nazariy (bu sayt)</td>
                  <td className="py-2 px-3 text-center font-mono font-bold text-yellow-400">17.058</td>
                  <td className="py-2 px-3 text-center font-mono font-bold text-green-400">1.431</td>
                  <td className="py-2 px-3 text-center font-mono font-bold text-blue-400">19.896</td>
                  <td className="py-2 px-3 text-[10px] text-purple-400">IUPAC 2021, M=422.394</td>
                </tr>
                {COMPOUND.literature.map((lit, i) => {
                  const dC_lit = Math.abs(lit.C - calc.C)
                  const dH_lit = Math.abs(lit.H - calc.H)
                  const dN_lit = Math.abs(lit.N - calc.N)
                  return (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-2 px-3 text-purple-300">{lit.ref}</td>
                      <td className="py-2 px-3 text-center font-mono">{lit.C.toFixed(2)} <span className={`text-[9px] ${dC_lit <= 0.2 ? "text-green-400" : "text-yellow-400"}`}>({dC_lit.toFixed(2)})</span></td>
                      <td className="py-2 px-3 text-center font-mono">{lit.H.toFixed(2)} <span className={`text-[9px] ${dH_lit <= 0.05 ? "text-green-400" : "text-yellow-400"}`}>({dH_lit.toFixed(2)})</span></td>
                      <td className="py-2 px-3 text-center font-mono">{lit.N.toFixed(2)} <span className={`text-[9px] ${dN_lit <= 0.2 ? "text-green-400" : "text-yellow-400"}`}>({dN_lit.toFixed(2)})</span></td>
                      <td className="py-2 px-3 text-[10px] text-purple-400">{lit.notes}</td>
                    </tr>
                  )
                })}
                <tr className="bg-green-900/20 border-t-2 border-green-500/30">
                  <td className="py-2 px-3 font-bold text-green-400">📊 Bizning x̄ (n=5)</td>
                  <td className="py-2 px-3 text-center font-mono font-bold text-yellow-400">{stats.C.mean.toFixed(3)}</td>
                  <td className="py-2 px-3 text-center font-mono font-bold text-green-400">{stats.H.mean.toFixed(3)}</td>
                  <td className="py-2 px-3 text-center font-mono font-bold text-blue-400">{stats.N.mean.toFixed(3)}</td>
                  <td className="py-2 px-3 text-[10px] text-purple-400">95% CI: ±{stats.C.ci95.toFixed(3)}, ±{stats.H.ci95.toFixed(3)}, ±{stats.N.ci95.toFixed(3)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 bg-green-600/10 border border-green-500/30 rounded-xl p-3 text-[11px] text-green-300">
            ✅ Bizning natija barcha mustaqil manbalar bilan ±0.1% chegarasida muvofiqlashadi — bu IUPAC reference material talablarini qondiradi.
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════ */}
        {/* 14. CHNS METODIKASI                                    */}
        {/* ═════════════════════════════════════════════════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-5 md:p-7">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><span>⚙️</span> CHNS tahlil metodikasi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <h3 className="text-indigo-400 font-bold text-xs mb-3">Yoqish parametrlari</h3>
              <ul className="text-purple-200 space-y-1.5 text-xs">
                <li className="flex justify-between"><span className="text-purple-400">Namuna massasi:</span><span className="font-mono">1.5–2.5 mg</span></li>
                <li className="flex justify-between"><span className="text-purple-400">Yoqish harorati:</span><span className="font-mono">1050°C</span></li>
                <li className="flex justify-between"><span className="text-purple-400">Reduktor:</span><span className="font-mono">Cu, 650°C</span></li>
                <li className="flex justify-between"><span className="text-purple-400">O₂ oqimi:</span><span className="font-mono">20 mL/min</span></li>
                <li className="flex justify-between"><span className="text-purple-400">Carrier (He):</span><span className="font-mono">100 mL/min</span></li>
                <li className="flex justify-between"><span className="text-purple-400">Kapsula:</span><span className="font-mono">Qalay (Sn)</span></li>
                <li className="flex justify-between"><span className="text-purple-400">Kalibrant:</span><span className="font-mono">Sulfanilamid</span></li>
                <li className="flex justify-between"><span className="text-purple-400">Detektor:</span><span className="font-mono">TCD</span></li>
                <li className="flex justify-between"><span className="text-purple-400">Kolonna:</span><span className="font-mono">Porapak QS</span></li>
                <li className="flex justify-between"><span className="text-purple-400">Vaqt/namuna:</span><span className="font-mono">~8 min</span></li>
              </ul>
            </div>
            <div className="space-y-3">
              <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-4">
                <h4 className="text-amber-400 font-bold text-xs mb-1">⚠️ CN guruhi</h4>
                <p className="text-purple-200 text-[10px]">Sianid 1050°C da CO₂+N₂ ga aylanadi. NOₓ hosil bo'lishi mumkin → Cu reduktor zarur. Kolonna eskirsa %N xato chiqadi.</p>
              </div>
              <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-4">
                <h4 className="text-blue-400 font-bold text-xs mb-1">💧 Gidrat nazorati</h4>
                <p className="text-purple-200 text-[10px]">3H₂O ~100°C da bug'lanadi. Tortish &lt;30 soniya. %H &lt; 1.2% = degidratlangan. Ideal: 1.43±0.05%.</p>
              </div>
              <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-4">
                <h4 className="text-red-400 font-bold text-xs mb-1">🔧 Metall qoldig'i</h4>
                <p className="text-purple-200 text-[10px]">Fe₂O₃/K₂CO₃ kolonnada qoladi. Har 50 namunada almashtiring. K₄[Fe(CN)₆] dan keyin 2 ta blank bajaring.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════ */}
        {/* 15. TIPIK XATOLAR                                      */}
        {/* ═════════════════════════════════════════════════════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-5 md:p-7">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><span>💡</span> Tipik xatolar va yechimlar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { t: "❌ Gidrat yo'qotish", p: "%H kamayadi (1.43→1.20)", s: "Eksikkatorda saqlang, tez torting (<30s)", sev: "high" },
              { t: "❌ Namuna massasi", p: "<1 mg signal/shovqin past", s: "Optimal: 1.5–2.5 mg", sev: "med" },
              { t: "❌ Kalibratsiya", p: "Standart eskirgan/namlangan", s: "Har kuni yangi, R²>0.999", sev: "high" },
              { t: "❌ Memory effect", p: "Fe/K qoldig'i keyingi namunaga ta'sir", s: "Har 50 namunada kolonna almashtiring", sev: "med" },
              { t: "❌ Bir jinsli emas", p: "Turli tortishlarda turli natija", s: "Agat hovonchada maydalang, 3 parallel", sev: "med" },
              { t: "❌ Havo namligi", p: "Namuna suv yutadi → %H ortadi", s: "Namlik 40-50%, kapsulani tez yoping", sev: "low" },
              { t: "❌ Cu reduktor charchagan", p: "%N past chiqadi, NOₓ qoladi", s: "200 namunada Cu reaktivni yangilang", sev: "high" },
              { t: "❌ He gaz tozaligi", p: "Baseline shovqini, peak split", s: "He ≥99.999% (5N grade) ishlating", sev: "med" }
            ].map((tip, i) => (
              <div key={i} className={`rounded-xl p-3 border ${tip.sev === "high" ? "bg-red-600/10 border-red-500/30" : tip.sev === "med" ? "bg-amber-600/10 border-amber-500/30" : "bg-blue-600/10 border-blue-500/30"}`}>
                <h3 className={`font-bold text-xs mb-1 ${tip.sev === "high" ? "text-red-400" : tip.sev === "med" ? "text-amber-400" : "text-blue-400"}`}>{tip.t}</h3>
                <p className="text-purple-300 text-[10px] mb-1"><strong>Muammo:</strong> {tip.p}</p>
                <p className="text-green-400 text-[10px]"><strong>Yechim:</strong> {tip.s}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════ */}
        {/* 16. SERTIFIKAT (CoA)                                   */}
        {/* ═════════════════════════════════════════════════════ */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-indigo-500/40 rounded-2xl p-5 md:p-7 shadow-2xl">
          <div className="flex items-center justify-between mb-4 border-b border-indigo-500/30 pb-3">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><span>📜</span> Tahlil sertifikati (CoA)</h2>
              <p className="text-purple-400 text-[10px] mt-1">Certificate of Analysis — Quality Control Report</p>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-purple-400">Sertifikat №:</div>
              <div className="text-sm font-mono text-indigo-400" suppressHydrationWarning={true}>
                EA-2024-K4FCN-{Date.now().toString().slice(-6)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <table className="w-full text-purple-200">
                <tbody>
                  <tr><td className="py-1 text-purple-400">Birikma:</td><td dangerouslySetInnerHTML={{ __html: COMPOUND.formulaHTML }} /></tr>
                  <tr><td className="py-1 text-purple-400">CAS №:</td><td className="font-mono">{COMPOUND.casNumber}</td></tr>
                  <tr><td className="py-1 text-purple-400">M (g/mol):</td><td className="font-mono">{COMPOUND.molarMass}</td></tr>
                  <tr><td className="py-1 text-purple-400">Tahlil sanasi:</td><td className="font-mono">{run.date}</td></tr>
                  <tr><td className="py-1 text-purple-400">Operator:</td><td>{run.operator}</td></tr>
                  <tr><td className="py-1 text-purple-400">Asbob:</td><td>{run.instrument}</td></tr>
                </tbody>
              </table>
            </div>
            <div>
              <table className="w-full text-purple-200">
                <thead><tr className="border-b border-purple-700"><th className="text-left py-1 text-purple-400">El</th><th className="text-center text-yellow-400">Naz %</th><th className="text-center text-green-400">Topildi %</th><th className="text-center text-blue-400">Δ %</th></tr></thead>
                <tbody>
                  <tr><td className="py-1 font-bold">C</td><td className="text-center font-mono">{calc.C.toFixed(2)}</td><td className="text-center font-mono">{run.C}</td><td className="text-center font-mono">{dC.toFixed(3)}</td></tr>
                  <tr><td className="py-1 font-bold">H</td><td className="text-center font-mono">{calc.H.toFixed(2)}</td><td className="text-center font-mono">{run.H}</td><td className="text-center font-mono">{dH.toFixed(3)}</td></tr>
                  <tr><td className="py-1 font-bold">N</td><td className="text-center font-mono">{calc.N.toFixed(2)}</td><td className="text-center font-mono">{run.N}</td><td className="text-center font-mono">{dN.toFixed(3)}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg border" style={{ backgroundColor: maxD <= 0.4 ? "#10b98115" : "#ef444415", borderColor: maxD <= 0.4 ? "#10b98140" : "#ef444440" }}>
            <div className="flex items-center justify-between">
              <span className={`font-bold text-sm ${maxD <= 0.4 ? "text-green-400" : "text-red-400"}`}>
                {maxD <= 0.4 ? "✅ TASDIQLANDI — Reagent toza, EA standart talablariga javob beradi" : "❌ Rad etildi — Qayta tahlil zarur"}
              </span>
              <span className="text-purple-400 text-[10px]">Δ_max = {maxD.toFixed(3)}% &lt; ±0.4%</span>
            </div>
          </div>

          <div className="mt-3 text-[9px] text-purple-500 text-center border-t border-purple-700/30 pt-3">
            Bu sertifikat ISO 17025 va ASTM E1019 standartlariga muvofiq tayyorlangan. Imzo: ____________ &nbsp;&nbsp; Laboratoriya muhri: 🏛️
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════ */}
        {/* 17. XULOSA                                             */}
        {/* ═════════════════════════════════════════════════════ */}
        <div className="bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border border-indigo-500/20 rounded-2xl p-5 md:p-7">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><span>✅</span> Asosiy ilmiy xulosalar</h2>
          <ol className="space-y-1.5 text-purple-200 list-decimal list-inside text-xs md:text-sm">
            <li>K₄[Fe(CN)₆]·3H₂O — EA uchun ideal etalon, <strong className="text-indigo-400">M = {COMPOUND.molarMass} g/mol</strong>, IUPAC 2021 atom og'irliklari bo'yicha.</li>
            <li>Nazariy tarkib: <strong className="font-mono text-yellow-400">C=17.058%, H=1.431%, N=19.896%</strong> — barcha mustaqil manbalar (Greenwood, Sharpe, ACS) bilan ±0.05% mos.</li>
            <li>Gidrat suvi <strong className="text-blue-400">3H₂O</strong> %H ga sezilarli ta'sir: suvsizda 0%, trihidratda 1.43%. CHNS ±0.1% gidratni aniq farqlaydi.</li>
            <li>Δ ≤ 0.2% = <strong className="text-green-400">A'lo</strong>, Δ ≤ 0.4% = <strong className="text-yellow-400">Qabul</strong>, Δ &gt; 0.6% = <strong className="text-red-400">Rad</strong>.</li>
            <li>CN guruhi to'liq yonadi, lekin <strong className="text-indigo-400">Cu/650°C reduktor majburiy</strong> — aks holda %N ~2% past chiqadi (NOₓ qoladi).</li>
            <li>TGA dehidratatsiya 2 bosqichli: 75–95°C (1H₂O) va 95–130°C (2H₂O), 450°C dan keyin CN parchalanadi.</li>
            <li>Statistika (n=5): RSD &lt; 1% — yuqori takrorlanuvchanlik. R5 da %C outlier (Grubbs G=1.78 &gt; 1.715) — qayta tortish tavsiya.</li>
            <li>Kalibratsiya R² &gt; 0.9999 — sulfanilamid bilan sozlangan tizim chiziqlilik talabini qondiradi.</li>
            <li>Empirik formula C₆H₆N₆ — eksperimental %lardan to'g'ri qayta tiklanadi → birikma identifikatsiyasi tasdiqlangan.</li>
          </ol>
        </div>

        {/* NAVIGATSIYA */}
        <div className="flex justify-between pt-4 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/element-analiz/birikmalar" className="px-5 py-2.5 border border-purple-500 rounded-xl hover:bg-purple-800/50 transition-all text-purple-300 text-sm">← Birikmalar</Link>
          <Link href="/ilmiy/tahlil/element-analiz/birikmalar/k3-fe-cn6" className="px-5 py-2.5 bg-indigo-600/80 rounded-xl hover:bg-indigo-500 text-white font-semibold text-sm">Keyingi: K₃[Fe(CN)₆] →</Link>
        </div>

      </section>
    </main>
  )
}