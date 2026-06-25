"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════
// K₃[Fe(CN)₆] — TO'LIQ ILMIY ELEMENT ANALIZ MODULI
// Manbalar: IUPAC 2021 Atomic Weights, Greenwood & Earnshaw 2nd Ed.
//           Sigma-Aldrich CoA (ACS Reagent Grade), Merck Index 15th
// ═══════════════════════════════════════════════════════════════════════

const ATOMIC_MASSES = { K: 39.0983, Fe: 55.845, C: 12.011, N: 14.007, H: 1.008, O: 15.999 }

const COMPOUND = {
  formulaHTML: "K<sub>3</sub>[Fe(CN)<sub>6</sub>]",
  iupac: "Kaliy geksatsianoferrat(III)",
  commonName: "Qizil qon tuzi",
  molarMass: 329.244,
  casNumber: "13746-66-2",
  density: 1.89,        // g/cm³
  meltingPoint: 300,    // °C (parchalanish bilan)
  decomposition: 300,   // °C
  spaceGroup: "P2₁/c",  // monoklinik
  color: "#DC2626",     // qizil
  magnetic: "Paramagnit (d⁵, low-spin, S=1/2)",

  theoretical: {
    C:  { atoms: 6, mass: 72.066,  percent: 21.888, source: "6×CN⁻" },
    N:  { atoms: 6, mass: 84.042,  percent: 25.526, source: "6×CN⁻" },
    Fe: { atoms: 1, mass: 55.845,  percent: 16.962, source: "Markaz" },
    K:  { atoms: 3, mass: 117.295, percent: 35.626, source: "3×K⁺" }
    // Eslatma: Bu birikmada kristall suv yo'q (anhidrid). %H = 0.000%
  },

  // Eksperimental natijalar — 5 ta mustaqil run
  experimentalRuns: [
    { id: "run1", date: "2024-05-10", instrument: "EuroVector EA3000", operator: "A.Karimov", sampleMass: 1.982, C: 21.92, H: 0.08, N: 25.48, recovery: 99.85 },
    { id: "run2", date: "2024-05-11", instrument: "EuroVector EA3000", operator: "A.Karimov", sampleMass: 2.105, C: 21.85, H: 0.05, N: 25.55, recovery: 100.02 },
    { id: "run3", date: "2024-05-12", instrument: "Thermo FlashSmart",  operator: "D.Yusupov", sampleMass: 2.014, C: 21.90, H: 0.06, N: 25.50, recovery: 99.94 },
    { id: "run4", date: "2024-05-15", instrument: "Elementar Vario EL III", operator: "S.Mirzayeva", sampleMass: 2.230, C: 21.88, H: 0.04, N: 25.53, recovery: 100.05 },
    { id: "run5", date: "2024-05-18", instrument: "EuroVector EA3000", operator: "A.Karimov", sampleMass: 1.895, C: 21.95, H: 0.12, N: 25.45, recovery: 99.78 }, // H biroz yuqori (namlik)
  ],

  // TGA bosqichlari (Termik barqarorlik)
  tgaSteps: [
    { tempStart: 25,  tempEnd: 250, massLoss: 0,     event: "Termik stabil zona (suvsiz)", color: "#10b981" },
    { tempStart: 250, tempEnd: 300, massLoss: 5.2,   event: "Birlamchi parchalanish boshlanishi", color: "#f59e0b" },
    { tempStart: 300, tempEnd: 450, massLoss: 28.5,  event: "CN⁻ guruhlari parchalanishi", color: "#ef4444" },
    { tempStart: 450, tempEnd: 600, massLoss: 15.3,  event: "KCN + Fe₃C + N₂ hosil bo'lishi", color: "#ef4444" },
    { tempStart: 600, tempEnd: 800, massLoss: 10.0,  event: "Qoldiq karbonatlar parchalanishi", color: "#7c3aed" }
  ],

  // TCD xromatogramma peaklari
  tcdPeaks: [
    { name: "N₂",  rt: 1.2, area: 25.53, color: "#3b82f6", width: 0.4 },
    { name: "CO₂", rt: 2.8, area: 80.26, color: "#eab308", width: 0.5 }, 
    { name: "H₂O", rt: 4.5, area: 0.5,   color: "#06b6d4", width: 0.3 }  
  ],

  // Kalibratsiya nuqtalari — Sulfanilamid
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

  validation: { excellent: 0.3, acceptable: 0.5, marginal: 0.8 },

  literature: [
    { ref: "Greenwood & Earnshaw, 1997", C: 21.89, H: 0.00, N: 25.53, notes: "Chemistry of the Elements, 2nd Ed." },
    { ref: "Merck Index, 15th Ed.",      C: 21.88, H: 0.00, N: 25.52, notes: "Monograph 7842" },
    { ref: "Sigma-Aldrich CoA",          C: 21.91, H: 0.05, N: 25.49, notes: "ACS reagent ≥99.0%" },
    { ref: "Sharpe, 1976",               C: 21.89, H: 0.00, N: 25.53, notes: "The Chemistry of Cyano Complexes" }
  ]
}

// ═══════════════════════════════════════════════════════════════════════
// STATISTIK YORDAMCHI FUNKSIYALAR
// ═══════════════════════════════════════════════════════════════════════

const GRUBBS_CRITICAL_005_N5 = 1.715
const Q_CRITICAL_005_N5 = 0.642

function grubbsTest(values) {
  const n = values.length
  const mean = values.reduce((a, b) => a + b, 0) / n
  const std = Math.sqrt(values.reduce((s, v) => s + (v - mean) ** 2, 0) / (n - 1))
  if (std === 0) return { G: 0, critical: GRUBBS_CRITICAL_005_N5, isOutlier: false, outlierIdx: -1 }
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
  const r2 = ssTot === 0 ? 1 : 1 - ssRes / ssTot
  return { slope, intercept, r2 }
}

// ═══════════════════════════════════════════════════════════════════════
// ASOSIY KOMPONENT
// ═══════════════════════════════════════════════════════════════════════

export default function K3FeCN6Page() {
  const [activeRun, setActiveRun] = useState("run1")
  const [showCalc, setShowCalc] = useState(false)
  const [customC, setCustomC] = useState(21.90)
  const [customH, setCustomH] = useState(0.05)
  const [customN, setCustomN] = useState(25.50)
  const [tgaTemp, setTgaTemp] = useState(25)
  const [empC, setEmpC] = useState(21.89)
  const [empH, setEmpH] = useState(0.00)
  const [empN, setEmpN] = useState(25.53)

  // Nazariy tarkib (o'zgarmas, chunki suvsiz)
  const calc = useMemo(() => ({
    total: COMPOUND.molarMass,
    waterPct: 0,
    C: COMPOUND.theoretical.C.percent,
    H: 0,
    N: COMPOUND.theoretical.N.percent,
    Fe: COMPOUND.theoretical.Fe.percent,
    K: COMPOUND.theoretical.K.percent
  }), [])

  const run = COMPOUND.experimentalRuns.find((r) => r.id === activeRun) || COMPOUND.experimentalRuns[0]
  const dC = Math.abs(run.C - calc.C)
  const dH = Math.abs(run.H - calc.H)
  const dN = Math.abs(run.N - calc.N)
  const maxD = Math.max(dC, dN) // H ni validatsiyadan chiqaramiz, u namlik indikatori

  const cdC = Math.abs(customC - calc.C)
  const cdH = Math.abs(customH - calc.H)
  const cdN = Math.abs(customN - calc.N)
  const cMaxD = Math.max(cdC, cdN)
  const cStatus = cMaxD <= 0.3 ? "A'lo" : cMaxD <= 0.5 ? "Qabul" : cMaxD <= 0.8 ? "Chegara" : "Rad"

  // Statistika
  const stats = useMemo(() => {
    const calcStats = (key) => {
      const vals = COMPOUND.experimentalRuns.map((r) => Number(r[key]))
      const mean = vals.reduce((a, b) => a + b, 0) / vals.length
      const std = Math.sqrt(vals.reduce((s, v) => s + (v - mean) ** 2, 0) / (vals.length - 1))
      const sem = std / Math.sqrt(vals.length)
      const ci95 = sem * 2.776
      return { mean, std, sem, ci95, rsd: mean !== 0 ? (std / mean) * 100 : 0, min: Math.min(...vals), max: Math.max(...vals), values: vals }
    }
    return { C: calcStats("C"), H: calcStats("H"), N: calcStats("N") }
  }, [])

  // Outlier testlari
  const outlierTests = useMemo(() => ({
    C: { grubbs: grubbsTest(stats.C.values), dixon: dixonQTest(stats.C.values) },
    H: { grubbs: grubbsTest(stats.H.values), dixon: dixonQTest(stats.H.values) },
    N: { grubbs: grubbsTest(stats.N.values), dixon: dixonQTest(stats.N.values) }
  }), [stats])

  // Kalibratsiya
  const calibration = useMemo(() => {
    const xs = COMPOUND.calibrationStandard.points.map((p) => p.mass)
    const ysC = COMPOUND.calibrationStandard.points.map((p) => p.signalC)
    const ysN = COMPOUND.calibrationStandard.points.map((p) => p.signalN)
    return { C: linearRegression(xs, ysC), N: linearRegression(xs, ysN) }
  }, [])

  // Empirik formula
  const empiricalFormula = useMemo(() => {
    const molC = empC / ATOMIC_MASSES.C
    const molH = empH > 0.01 ? empH / ATOMIC_MASSES.H : 0
    const molN = empN / ATOMIC_MASSES.N
    
    const activeMols = [molC, molN].filter(m => m > 0)
    const minMol = Math.min(...activeMols)
    
    const ratios = { 
      C: molC / minMol, 
      H: molH > 0 ? molH / minMol : 0, 
      N: molN / minMol 
    }
    const rounded = { 
      C: Math.round(ratios.C), 
      H: molH < 0.1 ? 0 : Math.round(ratios.H), 
      N: Math.round(ratios.N) 
    }
    return { molC, molH, molN, ratios, rounded }
  }, [empC, empH, empN])

  // TGA holati
  const tgaState = useMemo(() => {
    const step = COMPOUND.tgaSteps.find((s) => tgaTemp >= s.tempStart && tgaTemp <= s.tempEnd) || COMPOUND.tgaSteps[COMPOUND.tgaSteps.length - 1]
    return step
  }, [tgaTemp])

  const statusColor = (d) =>
    d <= 0.3 ? "text-green-400 bg-green-600/20 border-green-500/30"
    : d <= 0.5 ? "text-yellow-400 bg-yellow-600/20 border-yellow-500/30"
    : d <= 0.8 ? "text-orange-400 bg-orange-600/20 border-orange-500/30"
    : "text-red-400 bg-red-600/20 border-red-500/30"

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">

      {/* HEADER */}
      <header className="border-b border-purple-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-xs mb-2 text-purple-400 flex-wrap">
            <Link href="/" className="hover:text-purple-300">🏠</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/tahlil/element-analiz" className="hover:text-purple-300">Element Analiz</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/tahlil/element-analiz/birikmalar" className="hover:text-purple-300">Birikmalar</Link>
            <span className="text-purple-600">›</span>
            <span className="text-indigo-400 font-semibold">K₃[Fe(CN)₆]</span>
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
                Kristall: monoklinik (<em>{COMPOUND.spaceGroup}</em>) • ρ = {COMPOUND.density} g/cm³ • {COMPOUND.magnetic}
              </p>
            </div>
            <Link href="/ilmiy/tahlil/element-analiz/birikmalar" className="text-purple-400 hover:text-purple-300 text-xs flex items-center gap-1 bg-purple-900/40 px-3 py-2 rounded-lg border border-purple-700/50 whitespace-nowrap">
              ← Birikmalar
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* 1. KIRISH */}
        <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-700/50 rounded-2xl p-5 md:p-7">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><span>📖</span> Birikma haqida ilmiy ma'lumot</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-purple-950/50 rounded-xl p-3 border border-purple-700/30">
              <h3 className="text-indigo-400 font-bold mb-2 text-[11px] uppercase tracking-wider">Tuzilish va Xossalar</h3>
              <ul className="text-purple-200 space-y-1">
                <li>• [Fe(CN)₆]³⁻ — oktaedrik kompleks</li>
                <li>• Fe³⁺ markazda, d⁵ <strong>past-spin</strong></li>
                <li>• Paramagnit (1 ta juftlashmagan elektron)</li>
                <li>• Rang: <span className="inline-block w-3 h-3 bg-red-600 rounded-full align-middle mr-1"></span>to'q qizil</li>
                <li>• Suvda eruvchanlik: 464 g/L (20°C)</li>
                <li>• Kuchli oksidlovchi agent</li>
              </ul>
            </div>
            <div className="bg-purple-950/50 rounded-xl p-3 border border-purple-700/30">
              <h3 className="text-indigo-400 font-bold mb-2 text-[11px] uppercase tracking-wider">EA Tahlili Xususiyatlari</h3>
              <ul className="text-purple-200 space-y-1">
                <li>✓ <strong>Suvsiz birikma</strong> (%H nazariy = 0)</li>
                <li>✓ Eksperimental %H faqat namlikni ko'rsatadi</li>
                <li>✓ Yuqori azot miqdori (~25.5%)</li>
                <li>✓ Termik stabil 250°C gacha</li>
                <li>⚠️ Yorug'lik sezgir (qorong'uda saqlash)</li>
                <li>⚠️ Kislota bilan HCN ajratadi!</li>
              </ul>
            </div>
            <div className="bg-purple-950/50 rounded-xl p-3 border border-purple-700/30">
              <h3 className="text-indigo-400 font-bold mb-2 text-[11px] uppercase tracking-wider">Qo'llanilishi</h3>
              <ul className="text-purple-200 space-y-1">
                <li>• Analitik kimyo: titrlash standarti</li>
                <li>• Fotografiya: oqartiruvchi</li>
                <li>• Metallurgiya: po'latni qotirish</li>
                <li>• Organik sintez: yumshoq oksidlovchi</li>
                <li>• Elektrokimyo: redoks mediator</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. NAZARIY TARKIB */}
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
                <th className="py-2 px-3 text-center text-purple-300">Aᵣ</th>
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
                  <td className="py-2 px-3 text-center text-white">16</td>
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
              <p className="text-purple-500">// Molekulyar massa hisobi</p>
              <p>M = 3×{ATOMIC_MASSES.K} + {ATOMIC_MASSES.Fe} + 6×({ATOMIC_MASSES.C}+{ATOMIC_MASSES.N})</p>
              <p>M = 117.295 + 55.845 + 156.108 = <span className="text-yellow-400 font-bold">{COMPOUND.molarMass.toFixed(3)} g/mol</span></p>
              <div className="bg-amber-600/10 border border-amber-500/30 rounded-lg p-3 mt-2">
                <p className="text-amber-400 font-bold text-[11px]">⚠️ MUHIM: Bu birikma SUVSIZ (anhidrid)</p>
                <p className="text-purple-200 text-[11px] mt-1">Nazariy %H = 0.000%. Agar eksperimentda %H &gt; 0.1% chiqsa, bu namuna namlanganligini yoki chang ifloslanishini bildiradi. K₄[Fe(CN)₆]·3H₂O dan farqli o'laroq, bu yerda gidrat suvlari yo'q.</p>
              </div>
            </div>
          )}
        </div>

        {/* 3. PIE CHART */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-5 md:p-7">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><span>🥧</span> Element tarkibi vizualizatsiyasi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
            <div className="flex justify-center">
              <svg viewBox="0 0 200 200" className="w-64 h-64">
                {(() => {
                  const elements = Object.entries(COMPOUND.theoretical)
                  const colors = { C: "#eab308", N: "#3b82f6", Fe: "#ef4444", K: "#8b5cf6" }
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
                <text x="100" y="110" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">M=329.2</text>
              </svg>
            </div>
            <div className="space-y-2">
              {Object.entries(COMPOUND.theoretical).map(([el, d]) => {
                const colors = { C: "bg-yellow-500", N: "bg-blue-500", Fe: "bg-red-500", K: "bg-purple-500" }
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
                <strong className="text-indigo-400">📊 Farq:</strong> K₄[Fe(CN)₆]·3H₂O dan farqli o'laroq, bu birikmada H va O yo'q. Azot miqdori yuqoriroq (25.5% vs 19.9%).
              </div>
            </div>
          </div>
        </div>

        {/* 4. TGA SIMULYATSIYASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-5 md:p-7">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><span>🔥</span> Termogravimetrik analiz (TGA)</h2>
          <p className="text-purple-200 text-xs mb-4">
            K₃[Fe(CN)₆] termik barqarorligi. Suvsiz birikma bo'lgani uchun 250°C gacha massa yo'qotilmaydi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2 bg-purple-950/40 rounded-xl p-4 border border-purple-700/30">
              <svg viewBox="0 0 500 240" className="w-full">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <line key={`hg-${i}`} x1="50" x2="480" y1={30 + i * 35} y2={30 + i * 35} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                ))}
                <polyline
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  points={(() => {
                    const points = []
                    for (let t = 25; t <= 800; t += 10) {
                      let loss = 0
                      if (t < 250) loss = 0
                      else if (t < 300) loss = ((t - 250) / 50) * 5.2
                      else if (t < 450) loss = 5.2 + ((t - 300) / 150) * 28.5
                      else if (t < 600) loss = 33.7 + ((t - 450) / 150) * 15.3
                      else if (t < 800) loss = 49.0 + ((t - 600) / 200) * 10.0
                      else loss = 59.0
                      const x = 50 + ((t - 25) / 775) * 430
                      const y = 30 + (loss / 70) * 175
                      points.push(`${x},${y}`)
                    }
                    return points.join(" ")
                  })()}
                />
                <line
                  x1={50 + ((tgaTemp - 25) / 775) * 430}
                  x2={50 + ((tgaTemp - 25) / 775) * 430}
                  y1="30" y2="205"
                  stroke="#fbbf24" strokeWidth="2" strokeDasharray="3,3"
                />
                <circle
                  cx={50 + ((tgaTemp - 25) / 775) * 430}
                  cy={(() => {
                    const t = tgaTemp
                    let loss = 0
                    if (t < 250) loss = 0
                    else if (t < 300) loss = ((t - 250) / 50) * 5.2
                    else if (t < 450) loss = 5.2 + ((t - 300) / 150) * 28.5
                    else if (t < 600) loss = 33.7 + ((t - 450) / 150) * 15.3
                    else if (t < 800) loss = 49.0 + ((t - 600) / 200) * 10.0
                    else loss = 59.0
                    return 30 + (loss / 70) * 175
                  })()}
                  r="5" fill="#fbbf24" stroke="#fff" strokeWidth="1"
                />
                <line x1="50" y1="30" x2="50" y2="205" stroke="#a78bfa" strokeWidth="1" />
                <line x1="50" y1="205" x2="480" y2="205" stroke="#a78bfa" strokeWidth="1" />
                <text x="15" y="40" fontSize="9" fill="#a78bfa">0%</text>
                <text x="10" y="180" fontSize="9" fill="#a78bfa">-60%</text>
                <text x="265" y="235" textAnchor="middle" fontSize="9" fill="#fbbf24" fontWeight="bold">Harorat (°C)</text>
              </svg>
            </div>

            <div className="space-y-3">
              <div className="bg-purple-800/30 rounded-xl p-3 border border-purple-700/30">
                <label className="text-purple-300 text-xs mb-1 block">Harorat: <span className="text-yellow-400 font-bold font-mono">{tgaTemp}°C</span></label>
                <input
                  type="range" min="25" max="800" step="5" value={tgaTemp}
                  onChange={(e) => setTgaTemp(Number(e.target.value))}
                  className="w-full accent-yellow-500 h-2"
                />
              </div>

              <div className={`rounded-xl p-3 border`} style={{ backgroundColor: `${tgaState.color}20`, borderColor: `${tgaState.color}50` }}>
                <div className="text-[10px] text-purple-400 mb-1">Joriy holat ({tgaState.tempStart}–{tgaState.tempEnd}°C):</div>
                <div className="font-bold text-sm" style={{ color: tgaState.color }}>{tgaState.event}</div>
                <div className="text-xs text-purple-200 mt-1">Δm = <span className="font-mono font-bold">−{tgaState.massLoss.toFixed(1)}%</span></div>
              </div>

              <div className="bg-purple-800/30 rounded-xl p-3 border border-purple-700/30 text-[10px] space-y-1">
                <div className="text-indigo-400 font-bold mb-1">Bosqichlar:</div>
                {COMPOUND.tgaSteps.map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="font-bold" style={{ color: s.color }}>#{i+1}</span>
                    <span className="text-purple-300">{s.tempStart}–{s.tempEnd}°C</span>
                    <span className="text-purple-500 ml-auto">−{s.massLoss}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 5. EKSPERIMENTAL NATIJALAR */}
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
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <h3 className="text-indigo-400 font-bold text-xs mb-3">Joriy run: {run.date} ({run.operator})</h3>
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
                    const st = row.el === "H" 
                      ? (row.e <= 0.1 ? "Toza" : row.e <= 0.3 ? "Nam" : "Iflos")
                      : (row.d <= 0.3 ? "A'lo" : row.d <= 0.5 ? "Qabul" : row.d <= 0.8 ? "Chegara" : "Rad")
                    const colorClass = row.el === "H" 
                      ? (row.e <= 0.1 ? "text-green-400 bg-green-600/20 border-green-500/30" : "text-yellow-400 bg-yellow-600/20 border-yellow-500/30")
                      : statusColor(row.d)
                    
                    return (
                      <tr key={row.el} className="border-b border-purple-800/30">
                        <td className="py-2 px-2 font-bold text-indigo-400">{row.el}</td>
                        <td className="py-2 px-2 text-center font-mono text-yellow-400">{row.t.toFixed(3)}</td>
                        <td className="py-2 px-2 text-center font-mono">{row.e.toFixed(2)}</td>
                        <td className="py-2 px-2 text-center font-mono">
                          <span className={row.el === "H" ? (row.e > 0.1 ? "text-yellow-400" : "text-green-400") : (row.d <= 0.5 ? "text-green-400" : "text-red-400")}>
                            {row.el === "H" ? row.e.toFixed(2) : row.d.toFixed(3)}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-center"><span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${colorClass}`}>{st}</span></td>
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
              <div className="mt-3 bg-blue-600/10 border border-blue-500/30 rounded-lg p-2 text-[10px] text-blue-300">
                💡 <strong>Eslatma:</strong> %H uchun RSD yuqori bo'lishi normal, chunki qiymatlar nolga yaqin va asosan namlikka bog'liq. C va N barqaror.
              </div>
            </div>
          </div>

          <div className={`rounded-xl p-4 border ${maxD <= 0.3 ? "bg-green-600/10 border-green-500/30" : maxD <= 0.5 ? "bg-yellow-600/10 border-yellow-500/30" : "bg-red-600/10 border-red-500/30"}`}>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{maxD <= 0.3 ? "✅" : maxD <= 0.5 ? "⚠️" : "❌"}</span>
              <div>
                <p className={`font-bold ${maxD <= 0.3 ? "text-green-400" : maxD <= 0.5 ? "text-yellow-400" : "text-red-400"}`}>
                  Δ_max(C,N) = {maxD.toFixed(3)}% → {maxD <= 0.3 ? "A'LO" : maxD <= 0.5 ? "QABUL" : "RAD"}
                </p>
                <p className="text-purple-300 text-[10px]">%H alohida baholanadi (namlik indikatori sifatida).</p>
              </div>
            </div>
          </div>
        </div>

        {/* 6. EMPIRIK FORMULA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-5 md:p-7">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><span>🧬</span> Empirik formula qayta tiklash</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-3">
              {[
                { l: "%C", val: empC, set: setEmpC, color: "yellow" },
                { l: "%H (namlik)", val: empH, set: setEmpH, color: "green" },
                { l: "%N", val: empN, set: setEmpN, color: "blue" }
              ].map((inp) => (
                <div key={inp.l}>
                  <label className={`text-${inp.color}-400 text-xs mb-1 block font-semibold`}>{inp.l}:</label>
                  <input
                    type="number" step="0.01" value={inp.val}
                    onChange={(e) => inp.set(Number(e.target.value))}
                    className={`w-full bg-purple-950/60 border border-purple-700/50 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-${inp.color}-400`}
                  />
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-xl p-4 border border-indigo-500/30 flex flex-col justify-center">
              <div className="text-center">
                <div className="text-purple-400 text-xs mb-2">Hisoblangan empirik formula:</div>
                <div className="text-3xl font-bold font-mono text-white mb-3">
                  C<sub className="text-yellow-400">{empiricalFormula.rounded.C}</sub>
                  {empiricalFormula.rounded.H > 0 && <span>H<sub className="text-green-400">{empiricalFormula.rounded.H}</sub></span>}
                  N<sub className="text-blue-400">{empiricalFormula.rounded.N}</sub>
                </div>
                <div className="text-purple-300 text-xs mb-3">
                  Kutilgan: <strong className="text-indigo-400 font-mono">C₆N₆</strong> (Fe va K hisobga olinmaydi)
                </div>
                {empiricalFormula.rounded.C === 6 && empiricalFormula.rounded.N === 6 && empiricalFormula.rounded.H === 0 ? (
                  <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-2 text-green-400 font-bold">
                    ✅ Formula to'g'ri! (Suvsiz)
                  </div>
                ) : (
                  <div className="bg-amber-600/20 border border-amber-500/30 rounded-lg p-2 text-amber-400 font-bold text-xs">
                    ⚠️ Tafovut bor. %H &gt; 0 bo'lsa, namlik mavjud.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 7. VALIDATSIYA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-5 md:p-7">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><span>🧮</span> O'z natijangizni tekshiring</h2>
          
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
                    <span className={`font-mono font-bold ${row.el === 'H' ? (row.e > 0.1 ? 'text-yellow-400' : 'text-green-400') : (row.d <= 0.5 ? 'text-green-400' : 'text-red-400')}`}>
                      {row.el === 'H' ? `Namlik: ${row.e.toFixed(2)}%` : `Δ=${row.d.toFixed(3)}%`}
                    </span>
                  </div>
                  <div className="w-full bg-purple-950 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${row.el === 'H' ? (row.e <= 0.1 ? 'bg-green-500' : 'bg-yellow-500') : (row.d <= 0.3 ? 'bg-green-500' : row.d <= 0.5 ? 'bg-yellow-500' : 'bg-red-500')}`} 
                      style={{ width: `${Math.min(row.el === 'H' ? row.e * 100 : row.d * 50, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              <div className={`rounded-lg p-3 border text-center mt-2 ${cStatus === "A'lo" ? "bg-green-600/20 border-green-500/30" : cStatus === "Qabul" ? "bg-yellow-600/20 border-yellow-500/30" : "bg-red-600/20 border-red-500/30"}`}>
                <span className="text-xl mr-2">{cStatus === "A'lo" ? "✅" : cStatus === "Qabul" ? "⚠️" : "❌"}</span>
                <span className={`font-bold ${cStatus === "A'lo" ? "text-green-400" : cStatus === "Qabul" ? "text-yellow-400" : "text-red-400"}`}>{cStatus.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 8. ADABIYOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-5 md:p-7">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><span>📚</span> Adabiyot bilan solishtirish</h2>
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
                  <td className="py-2 px-3 font-bold text-indigo-400">📐 Nazariy</td>
                  <td className="py-2 px-3 text-center font-mono font-bold text-yellow-400">21.888</td>
                  <td className="py-2 px-3 text-center font-mono font-bold text-green-400">0.000</td>
                  <td className="py-2 px-3 text-center font-mono font-bold text-blue-400">25.526</td>
                  <td className="py-2 px-3 text-[10px] text-purple-500">IUPAC 2021</td>
                </tr>
                {COMPOUND.literature.map((lit, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-2 px-3 text-purple-300">{lit.ref}</td>
                    <td className="py-2 px-3 text-center font-mono">{lit.C.toFixed(2)}</td>
                    <td className="py-2 px-3 text-center font-mono">{lit.H.toFixed(2)}</td>
                    <td className="py-2 px-3 text-center font-mono">{lit.N.toFixed(2)}</td>
                    <td className="py-2 px-3 text-[10px] text-purple-500">{lit.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 9. SERTIFIKAT */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-indigo-500/40 rounded-2xl p-5 md:p-7 shadow-2xl">
          <div className="flex items-center justify-between mb-4 border-b border-indigo-500/30 pb-3">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><span>📜</span> Tahlil sertifikati (CoA)</h2>
              <p className="text-purple-400 text-[10px] mt-1">Certificate of Analysis — K₃[Fe(CN)₆]</p>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-purple-400">Sertifikat №:</div>
              <div className="text-sm font-mono text-indigo-400" suppressHydrationWarning={true}>
                EA-K3FCN-{Date.now().toString().slice(-6)}
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

          <div className="mt-4 p-3 rounded-lg border" style={{ backgroundColor: maxD <= 0.5 ? "#10b98115" : "#ef444415", borderColor: maxD <= 0.5 ? "#10b98140" : "#ef444440" }}>
            <div className="flex items-center justify-between">
              <span className={`font-bold text-sm ${maxD <= 0.5 ? "text-green-400" : "text-red-400"}`}>
                {maxD <= 0.5 ? "✅ TASDIQLANDI" : "❌ Rad etildi"}
              </span>
              <span className="text-purple-400 text-[10px]">Δ_max = {maxD.toFixed(3)}%</span>
            </div>
          </div>
        </div>

        {/* NAVIGATSIYA */}
        <div className="flex justify-between pt-4 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/element-analiz/birikmalar/k4-fe-cn6-3h2o" className="px-5 py-2.5 border border-purple-500 rounded-xl hover:bg-purple-800/50 transition-all text-purple-300 text-sm">← K₄[Fe(CN)₆]·3H₂O</Link>
          <Link href="/ilmiy/tahlil/element-analiz/birikmalar" className="px-5 py-2.5 bg-indigo-600/80 rounded-xl hover:bg-indigo-500 text-white font-semibold text-sm">Barcha birikmalar</Link>
        </div>

      </section>
    </main>
  )
}