"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. JABLONSKI DIAGRAMMASI (interaktiv)
// ============================================================================
function JablonskiDiagrammasi() {
  const [jarayon, setJarayon] = useState("fluorescence")

  const jarayonlar = {
    fluorescence: {
      name: "Fluoressensiya",
      desc: "S₁ → S₀ (tez, ns)",
      color: "#10b981",
      tau: "~1-10 ns"
    },
    phosphorescence: {
      name: "Fosforessensiya",
      desc: "T₁ → S₀ (sekin, μs-ms)",
      color: "#f59e0b",
      tau: "~1 μs - 1 s"
    },
    ic: {
      name: "Ichki konversiya",
      desc: "S₁ → S₀ (nurlanishsiz)",
      color: "#ef4444",
      tau: "~ps"
    },
    isc: {
      name: "Interkombinatsion konversiya",
      desc: "S₁ → T₁ (spin o'zgarishi)",
      color: "#8b5cf6",
      tau: "~ps-ns"
    }
  }

  const j = jarayonlar[jarayon]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📊 Jablonski diagrammasi — lyuminestsensiya mexanizmi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-amber-700/30 space-y-4">
        <div className="bg-amber-600/10 border border-amber-500/30 rounded-lg p-4">
          <p className="text-amber-400 font-bold mb-2">💎 Lyuminestsensiya asoslari:</p>
          <p className="text-purple-200 text-xs">
            <strong>Jablonski diagrammasi</strong> — molekula energetik sathlari va ular orasidagi
            o'tishlarni ko'rsatadi. Fluoressensiya (S₁→S₀) va fosforessensiya (T₁→S₀) —
            ikki xil lyuminestsensiya turi.
          </p>
        </div>

        {/* JARAYON TANLASH */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(jarayonlar).map(([key, val]) => (
            <button key={key} onClick={() => setJarayon(key)}
              className={`px-2 py-2 rounded-lg text-[10px] font-bold transition-all ${
                jarayon === key 
                  ? "bg-amber-600/80 text-white shadow-lg" 
                  : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
              }`}>
              <div className="text-xs">{val.name}</div>
              <div className="text-[9px] opacity-70 mt-1">{val.desc}</div>
            </button>
          ))}
        </div>

        {/* JABLONSKI SVG */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <svg viewBox="0 0 400 300" className="w-full h-72">
            {/* Energiya o'qi */}
            <line x1="50" y1="280" x2="50" y2="20" stroke="#4c1d95" strokeWidth="1" />
            <text x="30" y="150" fill="#c4b5fd" fontSize="9" textAnchor="middle" transform="rotate(-90, 30, 150)">
              Energiya
            </text>

            {/* S₀ */}
            <line x1="80" y1="260" x2="160" y2="260" stroke="#3b82f6" strokeWidth="2" />
            <text x="120" y="275" fill="#3b82f6" fontSize="10" textAnchor="middle" fontWeight="bold">S₀</text>

            {/* S₁ */}
            <line x1="80" y1="140" x2="160" y2="140" stroke="#10b981" strokeWidth="2" />
            <text x="120" y="130" fill="#10b981" fontSize="10" textAnchor="middle" fontWeight="bold">S₁</text>

            {/* S₂ */}
            <line x1="80" y1="60" x2="160" y2="60" stroke="#10b981" strokeWidth="2" />
            <text x="120" y="50" fill="#10b981" fontSize="10" textAnchor="middle" fontWeight="bold">S₂</text>

            {/* T₁ */}
            <line x1="240" y1="180" x2="320" y2="180" stroke="#f59e0b" strokeWidth="2" />
            <text x="280" y="170" fill="#f59e0b" fontSize="10" textAnchor="middle" fontWeight="bold">T₁</text>

            {/* Yutilish (S₀ → S₁) */}
            <line x1="120" y1="260" x2="120" y2="140" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrowYellow)" />
            <text x="135" y="200" fill="#fbbf24" fontSize="8">Yutilish</text>

            {/* Fluoressensiya (S₁ → S₀) */}
            <line x1="140" y1="140" x2="140" y2="260" 
              stroke={jarayon === "fluorescence" ? "#10b981" : "#6b7280"} 
              strokeWidth={jarayon === "fluorescence" ? "3" : "1"} 
              markerEnd="url(#arrowGreen)" 
              opacity={jarayon === "fluorescence" ? "1" : "0.3"} />
            <text x="155" y="200" fill={jarayon === "fluorescence" ? "#10b981" : "#6b7280"} fontSize="8">
              Fluoressensiya
            </text>

            {/* ISC (S₁ → T₁) */}
            <path d="M 160 140 Q 200 160 240 180" 
              fill="none" 
              stroke={jarayon === "isc" ? "#8b5cf6" : "#6b7280"} 
              strokeWidth={jarayon === "isc" ? "3" : "1"} 
              strokeDasharray="3,2"
              opacity={jarayon === "isc" ? "1" : "0.3"} />
            <text x="200" y="150" fill={jarayon === "isc" ? "#8b5cf6" : "#6b7280"} fontSize="8">
              ISC
            </text>

            {/* Fosforessensiya (T₁ → S₀) */}
            <line x1="280" y1="180" x2="280" y2="260" 
              stroke={jarayon === "phosphorescence" ? "#f59e0b" : "#6b7280"} 
              strokeWidth={jarayon === "phosphorescence" ? "3" : "1"} 
              markerEnd="url(#arrowOrange)" 
              opacity={jarayon === "phosphorescence" ? "1" : "0.3"} />
            <text x="295" y="220" fill={jarayon === "phosphorescence" ? "#f59e0b" : "#6b7280"} fontSize="8">
              Fosforessensiya
            </text>

            {/* Ichki konversiya (S₂ → S₁) */}
            <path d="M 100 60 Q 110 100 100 140" 
              fill="none" 
              stroke={jarayon === "ic" ? "#ef4444" : "#6b7280"} 
              strokeWidth={jarayon === "ic" ? "3" : "1"} 
              strokeDasharray="2,2"
              opacity={jarayon === "ic" ? "1" : "0.3"} />
            <text x="85" y="100" fill={jarayon === "ic" ? "#ef4444" : "#6b7280"} fontSize="8">
              IC
            </text>

            {/* Strelkalar */}
            <defs>
              <marker id="arrowYellow" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
                <polygon points="0,0 5,2.5 0,5" fill="#fbbf24" />
              </marker>
              <marker id="arrowGreen" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
                <polygon points="0,0 5,2.5 0,5" fill="#10b981" />
              </marker>
              <marker id="arrowOrange" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
                <polygon points="0,0 5,2.5 0,5" fill="#f59e0b" />
              </marker>
            </defs>

            {/* Joriy jarayon ma'lumoti */}
            <rect x="250" y="30" width="140" height="50" fill={j.color} opacity="0.2" rx="5" />
            <text x="320" y="50" fill={j.color} fontSize="10" textAnchor="middle" fontWeight="bold">
              {j.name}
            </text>
            <text x="320" y="70" fill="#c4b5fd" fontSize="8" textAnchor="middle">
              τ = {j.tau}
            </text>
          </svg>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Farqlar:</p>
          <p className="text-purple-200">
            <strong>Fluoressensiya</strong> — S₁→S₀ (spin ruxsat), tez (ns), katta intensivlik
            <br/>
            <strong>Fosforessensiya</strong> — T₁→S₀ (spin taqiqlangan), sekin (μs-ms), kichik intensivlik
            <br/>
            <strong>Metall komplekslar</strong> — og'ir atom effekti tufayli ISC tez → fosforessensiya kuchli
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. EMISSION SPEKTR SIMULYATORI
// ============================================================================
function EmissionSpectrumSimulator() {
  const [complex, setComplex] = useState("eu")
  const [intensity, setIntensity] = useState(100)

  const complexes = {
    eu: {
      name: "Eu³⁺ (qizil)",
      peaks: [
        { lambda: 590, intensity: 0.3, assign: "⁵D₀→⁷F₁" },
        { lambda: 612, intensity: 1.0, assign: "⁵D₀→⁷F₂" },
        { lambda: 650, intensity: 0.2, assign: "⁵D₀→⁷F₃" },
        { lambda: 690, intensity: 0.1, assign: "⁵D₀→⁷F₄" }
      ],
      color: "#ef4444"
    },
    tb: {
      name: "Tb³⁺ (yashil)",
      peaks: [
        { lambda: 490, intensity: 0.3, assign: "⁵D₄→⁷F₆" },
        { lambda: 545, intensity: 1.0, assign: "⁵D₄→⁷F₅" },
        { lambda: 585, intensity: 0.4, assign: "⁵D₄→⁷F₄" },
        { lambda: 620, intensity: 0.2, assign: "⁵D₄→⁷F₃" }
      ],
      color: "#10b981"
    },
    ru: {
      name: "[Ru(bpy)₃]²⁺ (qizil)",
      peaks: [
        { lambda: 600, intensity: 0.8, assign: "³MLCT" },
        { lambda: 650, intensity: 1.0, assign: "³MLCT" },
        { lambda: 700, intensity: 0.6, assign: "³MLCT" }
      ],
      color: "#f97316"
    },
    ir: {
      name: "[Ir(ppy)₃] (yashil)",
      peaks: [
        { lambda: 470, intensity: 0.6, assign: "³MLCT" },
        { lambda: 510, intensity: 1.0, assign: "³MLCT" },
        { lambda: 550, intensity: 0.7, assign: "³MLCT" }
      ],
      color: "#84cc16"
    }
  }

  const c = complexes[complex]
  const intFactor = intensity / 100

  // Emission spektri
  const spectrum = useMemo(() => {
    const points = []
    for (let i = 0; i < 400; i++) {
      const lambda = 400 + i * 1.0
      let emission = 0

      c.peaks.forEach(peak => {
        const x = (lambda - peak.lambda) / 10
        emission += peak.intensity * Math.exp(-0.5 * x * x) * intFactor
      })

      points.push({ lambda, emission })
    }
    return points
  }, [complex, intensity, c, intFactor])

  const maxEmission = Math.max(...spectrum.map(p => p.emission), 0.1)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">💡 Emission spektr simulyatori</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-amber-700/30 space-y-4">
        <div className="bg-amber-600/10 border border-amber-500/30 rounded-lg p-4">
          <p className="text-amber-400 font-bold mb-2">💎 Lantanid vs o'tish metallari:</p>
          <p className="text-purple-200 text-xs">
            <strong>Lantanidlar</strong> (Eu³⁺, Tb³⁺) — <strong>tor chiziqli spektr</strong> (f-f o'tishlar).
            <br/>
            <strong>O'tish metallari</strong> (Ru²⁺, Ir³⁺) — <strong>keng MLCT bandlari</strong>.
          </p>
        </div>

        {/* KOMPLEKS TANLASH */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(complexes).map(([key, val]) => (
            <button key={key} onClick={() => setComplex(key)}
              className={`px-2 py-2 rounded-lg text-[10px] font-bold transition-all ${
                complex === key 
                  ? "bg-amber-600/80 text-white shadow-lg" 
                  : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
              }`}>
              <div className="text-xs">{val.name}</div>
            </button>
          ))}
        </div>

        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">Intensivlik:</span>
            <span className="text-emerald-400 font-mono">{intensity}%</span>
          </label>
          <input type="range" min="10" max="100" step="5" value={intensity}
            onChange={(e) => setIntensity(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-amber-500" />
        </div>

        {/* SPEKTR */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-amber-400 font-bold text-xs mb-2">
            Emission spektri: {c.name}
          </h5>
          <svg viewBox="0 0 400 250" className="w-full h-60">
            <line x1="40" y1="220" x2="380" y2="220" stroke="#4c1d95" strokeWidth="1" />
            <line x1="40" y1="20" x2="40" y2="220" stroke="#4c1d95" strokeWidth="1" />
            
            <text x="210" y="245" fill="#c4b5fd" fontSize="9" textAnchor="middle">λ (nm)</text>
            <text x="40" y="240" fill="#a78bfa" fontSize="8">400</text>
            <text x="380" y="240" fill="#a78bfa" fontSize="8" textAnchor="end">800</text>
            <text x="20" y="120" fill="#a78bfa" fontSize="8" textAnchor="middle" transform="rotate(-90, 20, 120)">
              Intensivlik
            </text>

            {/* λ_max belgilari */}
            {c.peaks.map((peak, idx) => (
              <g key={idx}>
                <line x1={40 + ((peak.lambda - 400) / 400) * 340} y1="20" 
                  x2={40 + ((peak.lambda - 400) / 400) * 340} y2="220"
                  stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x={40 + ((peak.lambda - 400) / 400) * 340} y="15" 
                  fill="#fbbf24" fontSize="7" textAnchor="middle">
                  {peak.lambda} nm
                </text>
              </g>
            ))}

            {/* Emission spektri */}
            <polyline
              points={spectrum.map((p, i) => {
                const x = 40 + (i / 400) * 340
                const y = 220 - (p.emission / maxEmission) * 190
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke={c.color} strokeWidth="2"
            />

            {/* Cho'qqi belgilari */}
            {c.peaks.map((peak, idx) => (
              <text key={idx} 
                x={40 + ((peak.lambda - 400) / 400) * 340} 
                y={220 - (peak.intensity / 1) * 190 - 5}
                fill={c.color} fontSize="7" textAnchor="middle">
                {peak.assign}
              </text>
            ))}
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-3">
            <p className="text-amber-400">Kompleks</p>
            <p className="text-amber-400 font-bold text-[10px]">{c.name}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">λ<sub>em</sub></p>
            <p className="text-emerald-400 font-bold">{c.peaks[1]?.lambda} nm</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Rang</p>
            <p className="text-amber-400 font-bold">{c.name.split('(')[1]?.replace(')', '')}</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Farq:</p>
          <p className="text-purple-200">
            <strong>Eu³⁺/Tb³⁺</strong> — tor chiziqli cho'qqilar (f-f o'tishlar, taqiqlangan)
            <br/>
            <strong>Ru²⁺/Ir³⁺</strong> — keng MLCT bandlari (ruxsat etilgan o'tishlar)
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. ANTENNA EFFEKTI VIZUALIZATSIYASI
// ============================================================================
function AntennaEffekti() {
  const [step, setStep] = useState(0)

  const steps = [
    {
      title: "1. Ligand yorug'likni yutadi",
      desc: "Xromofor ligand (masalan, β-diketonat) UV yorug'likni yutadi",
      formula: "L + hν → L* (S₀ → S₁)",
      icon: "💡"
    },
    {
      title: "2. Interkombinatsion konversiya",
      desc: "Singlet → triplet o'tish (og'ir atom effekti tufayli tez)",
      formula: "L* (S₁) → L* (T₁)",
      icon: "🔄"
    },
    {
      title: "3. Energiya uzatilishi",
      desc: "Ligand triplet energiyasi Eu³⁺ ga uzatiladi (rezonans)",
      formula: "L* (T₁) + Eu³⁺ → L + Eu³⁺* (⁵D₀)",
      icon: "⚡"
    },
    {
      title: "4. Eu³⁺ nurlanishi",
      desc: "Eu³⁺ xarakterli qizil nurlanish chiqaradi (⁵D₀ → ⁷F₂)",
      formula: "Eu³⁺* (⁵D₀) → Eu³⁺ + hν' (612 nm)",
      icon: "✨"
    }
  ]

  const s = steps[step]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📡 Antenna effekti — lantanid komplekslarida</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-amber-700/30 space-y-4">
        <div className="bg-amber-600/10 border border-amber-500/30 rounded-lg p-4">
          <p className="text-amber-400 font-bold mb-2">💎 Nima uchun antenna kerak?</p>
          <p className="text-purple-200 text-xs">
            Lantanid ionlarining <strong>f-f o'tishlari taqiqlangan</strong> → yorug'likni bevosita kuchsiz yutadi.
            <strong> Xromofor ligandlar</strong> yorug'likni yutib, energiyani metallga uzatadi — bu "antenna effekti".
          </p>
        </div>

        {/* STEP NAVIGATION */}
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <button key={i} onClick={() => setStep(i)}
              className={`flex-1 px-2 py-2 rounded-lg text-xs font-bold transition-all ${
                step === i 
                  ? "bg-amber-600/80 text-white shadow-lg" 
                  : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
              }`}>
              {i + 1}
            </button>
          ))}
        </div>

        {/* CURRENT STEP */}
        <div className="bg-purple-950/50 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{s.icon}</span>
            <h4 className="text-amber-400 font-bold text-lg">{s.title}</h4>
          </div>
          <p className="text-purple-200 text-sm mb-3">{s.desc}</p>
          <div className="bg-purple-900/50 rounded p-3 font-mono text-xs text-center text-emerald-400">
            {s.formula}
          </div>
        </div>

        {/* VIZUALIZATSIYA */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-amber-400 font-bold text-xs mb-3">Antenna effekti sxemasi:</h5>
          <svg viewBox="0 0 400 200" className="w-full h-48">
            {/* Ligand */}
            <rect x="50" y="70" width="80" height="60" fill="#3b82f6" opacity="0.3" rx="5" />
            <text x="90" y="105" fill="#3b82f6" fontSize="10" textAnchor="middle" fontWeight="bold">Ligand</text>

            {/* Eu³⁺ */}
            <circle cx="280" cy="100" r="30" fill="#ef4444" opacity="0.3" />
            <text x="280" y="105" fill="#ef4444" fontSize="12" textAnchor="middle" fontWeight="bold">Eu³⁺</text>

            {/* Energiya oqimi */}
            <line x1="130" y1="100" x2="250" y2="100" stroke="#fbbf24" strokeWidth="3" markerEnd="url(#arrowAntenna)" />
            <text x="190" y="90" fill="#fbbf24" fontSize="9" textAnchor="middle">Energiya</text>

            {/* Yorug'lik */}
            <line x1="90" y1="30" x2="90" y2="70" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrowAntenna)" />
            <text x="90" y="20" fill="#fbbf24" fontSize="8" textAnchor="middle">hν (UV)</text>

            {/* Nurlanish */}
            <line x1="280" y1="130" x2="280" y2="170" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowAntenna)" />
            <text x="280" y="185" fill="#ef4444" fontSize="8" textAnchor="middle">hν' (612 nm)</text>

            <defs>
              <marker id="arrowAntenna" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
                <polygon points="0,0 5,2.5 0,5" fill="#fbbf24" />
              </marker>
            </defs>

            <text x="200" y="195" fill="#c4b5fd" fontSize="8" textAnchor="middle">
              Ligand → Eu³⁺ energiya uzatilishi
            </text>
          </svg>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Rezonans sharti:</p>
          <p className="text-purple-200">
            Ligand triplet energiyasi <strong>metall qabul qiluvchi sathidan yuqori</strong> bo'lishi kerak:
            <br/>
            • <strong>Eu³⁺</strong> uchun: T₁ &gt; 17,250 cm⁻¹ (⁵D₀)
            <br/>
            • <strong>Tb³⁺</strong> uchun: T₁ &gt; 20,500 cm⁻¹ (⁵D₄)
            <br/>
            Aks holda energiya uzatilmaydi → fluoressensiya yo'q.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. STOKES SILJISHI KALKULYATORI
// ============================================================================
function StokesSiljishi() {
  const [lambdaAbs, setLambdaAbs] = useState(350)
  const [lambdaEm, setLambdaEm] = useState(612)

  // Stokes siljishi (nm)
  const stokes = lambdaEm - lambdaAbs

  // Energiya (cm⁻¹)
  const energyAbs = 1e7 / lambdaAbs
  const energyEm = 1e7 / lambdaEm
  const energyLoss = energyAbs - energyEm

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📊 Stokes siljishi kalkulyatori</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-amber-700/30 space-y-4">
        <div className="bg-amber-600/10 border border-amber-500/30 rounded-lg p-4">
          <p className="text-amber-400 font-bold mb-2">💎 Stokes siljishi nima?</p>
          <p className="text-purple-200 text-xs">
            Yutilish va nurlanish maksimumlari orasidagi farq. Qo'zg'algan holatda geometriya
            o'zgarishi va erituvchi relaksatsiyasi tufayli yuzaga keladi.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">λ<sub>abs</sub> (nm):</span>
              <span className="text-emerald-400 font-mono">{lambdaAbs}</span>
            </label>
            <input type="range" min="200" max="600" step="5" value={lambdaAbs}
              onChange={(e) => setLambdaAbs(parseInt(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-amber-500" />
          </div>
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">λ<sub>em</sub> (nm):</span>
              <span className="text-emerald-400 font-mono">{lambdaEm}</span>
            </label>
            <input type="range" min="400" max="800" step="5" value={lambdaEm}
              onChange={(e) => setLambdaEm(parseInt(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-amber-500" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-3">
            <p className="text-amber-400">Stokes (nm)</p>
            <p className="text-emerald-400 font-bold font-mono text-lg">{stokes}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">ΔE (cm⁻¹)</p>
            <p className="text-yellow-400 font-bold font-mono">{energyLoss.toFixed(0)}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">ΔE (eV)</p>
            <p className="text-yellow-400 font-bold font-mono">{(energyLoss * 1.24e-4).toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Katta Stokes siljishi afzalligi:</p>
          <p className="text-purple-200">
            <strong>Lantanid komplekslar</strong> — katta Stokes (150-300 nm) → o'z-o'zini yutish kam
            <br/>
            <strong>Organik fluorofores</strong> — kichik Stokes (20-50 nm) → o'z-o'zini yutish ko'p
            <br/>
            Katta Stokes → <strong>yuqori sezgirlik</strong>, <strong>past fon</strong>
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. KVANT UNUMI KALKULYATORI
// ============================================================================
function KvantUnumi() {
  const [kr, setKr] = useState(1e6) // nurlanish tezligi
  const [knr, setKnr] = useState(1e5) // nurlanishsiz relaksatsiya

  // Φ = kr / (kr + knr)
  const phi = kr / (kr + knr)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📊 Kvant unumi (Φ) kalkulyatori</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-amber-700/30 space-y-4">
        <div className="bg-purple-950/50 rounded-lg p-4 font-mono text-center">
          <p className="text-purple-400 text-xs mb-2">Kvant unumi formulasi:</p>
          <p className="text-amber-400 text-lg">Φ = k<sub>r</sub> / (k<sub>r</sub> + k<sub>nr</sub>)</p>
          <p className="text-purple-400 text-xs mt-2">k<sub>r</sub> — nurlanish, k<sub>nr</sub> — nurlanishsiz</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">k<sub>r</sub> (s⁻¹):</span>
              <span className="text-emerald-400 font-mono">{kr.toExponential(1)}</span>
            </label>
            <input type="range" min="1e4" max="1e8" step="1e4" value={kr}
              onChange={(e) => setKr(parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-amber-500" />
          </div>
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">k<sub>nr</sub> (s⁻¹):</span>
              <span className="text-emerald-400 font-mono">{knr.toExponential(1)}</span>
            </label>
            <input type="range" min="1e3" max="1e8" step="1e3" value={knr}
              onChange={(e) => setKnr(parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-amber-500" />
          </div>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-4 text-center">
          <p className="text-amber-400 text-xs mb-1">Kvant unumi (Φ):</p>
          <p className="text-emerald-400 font-bold font-mono text-3xl">{(phi * 100).toFixed(1)}%</p>
          <p className="text-purple-400 text-xs mt-2">
            {phi > 0.8 ? "✓ Yuqori samaradorlik" : phi > 0.5 ? "○ O'rtacha samaradorlik" : "✗ Past samaradorlik"}
          </p>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Φ ni oshirish usullari:</p>
          <ul className="text-purple-200 space-y-1 list-disc list-inside">
            <li><strong>k<sub>r</sub> oshirish</strong> — og'ir atom effekti (ISC tezlashadi)</li>
            <li><strong>k<sub>nr</sub> kamaytirish</strong> — qattiq matritsa, past harorat</li>
            <li><strong>Antenna effekti</strong> — ligand orqali energiya uzatish</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 6. YASHASH VAQTI VIZUALIZATSIYASI
// ============================================================================
function YashashVaqti() {
  const [tau, setTau] = useState(100) // ns

  // Eksponensial decay
  const decay = useMemo(() => {
    const points = []
    for (let i = 0; i < 100; i++) {
      const t = i * 5 // ns
      const intensity = Math.exp(-t / tau)
      points.push({ t, intensity })
    }
    return points
  }, [tau])

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⏱️ Yashash vaqti (τ) — eksponensial decay</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-amber-700/30 space-y-4">
        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">τ (ns):</span>
            <span className="text-emerald-400 font-mono">{tau}</span>
          </label>
          <input type="range" min="1" max="1000" step="10" value={tau}
            onChange={(e) => setTau(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-amber-500" />
          <div className="flex justify-between text-[10px] text-purple-400 mt-1">
            <span>1 ns (fluoressensiya)</span>
            <span>100 ns</span>
            <span>1000 ns (fosforessensiya)</span>
          </div>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-amber-400 font-bold text-xs mb-2">Decay egri chizig'i:</h5>
          <svg viewBox="0 0 400 200" className="w-full h-48">
            <line x1="40" y1="180" x2="380" y2="180" stroke="#4c1d95" strokeWidth="1" />
            <line x1="40" y1="20" x2="40" y2="180" stroke="#4c1d95" strokeWidth="1" />
            
            <text x="210" y="195" fill="#c4b5fd" fontSize="9" textAnchor="middle">Vaqt (ns)</text>
            <text x="20" y="100" fill="#a78bfa" fontSize="8" textAnchor="middle" transform="rotate(-90, 20, 100)">
              Intensivlik
            </text>

            {/* Decay egri chizig'i */}
            <polyline
              points={decay.map((p, i) => {
                const x = 40 + (i / 100) * 340
                const y = 180 - p.intensity * 150
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke="#f59e0b" strokeWidth="2"
            />

            {/* τ belgisi */}
            <line x1={40 + (tau / 500) * 340} y1="20" x2={40 + (tau / 500) * 340} y2="180"
              stroke="#fbbf24" strokeWidth="1" strokeDasharray="2,2" />
            <text x={40 + (tau / 500) * 340} y="15" fill="#fbbf24" fontSize="8" textAnchor="middle">
              τ = {tau} ns
            </text>

            {/* 1/e belgisi */}
            <line x1="40" y1={180 - (1/Math.E) * 150} x2="380" y2={180 - (1/Math.E) * 150}
              stroke="#ef4444" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x="385" y={180 - (1/Math.E) * 150} fill="#ef4444" fontSize="7">1/e</text>
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-3">
            <p className="text-amber-400">τ</p>
            <p className="text-emerald-400 font-bold font-mono">{tau} ns</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Tur</p>
            <p className="text-amber-400 font-bold">
              {tau < 10 ? "Fluoressensiya" : tau < 100 ? "Tez fosfor." : "Fosforessensiya"}
            </p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">I(τ)</p>
            <p className="text-yellow-400 font-bold font-mono">{(100/Math.E).toFixed(1)}%</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Yashash vaqti ahamiyati:</p>
          <p className="text-purple-200">
            <strong>Katta τ</strong> — vaqt-ajraladigan tahlil (TRF) uchun qulay
            <br/>
            <strong>Lantanidlar</strong> — τ ≈ 0.5-2 ms (juda katta) → fon signalidan ajratish oson
            <br/>
            <strong>O'tish metallari</strong> — τ ≈ 0.1-1 μs (o'rtacha)
            <br/>
            <strong>Organik fluorofores</strong> — τ ≈ 1-10 ns (kichik) → fon bilan aralashadi
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 7. TARIXIY KONTEKST
// ============================================================================
function TarixiyKontekst() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🏛️ Tarixiy kontekst</h3>

      <div className="bg-gradient-to-br from-amber-900/30 to-purple-900/30 rounded-xl p-5 border border-amber-500/30 space-y-4">
        <div className="space-y-3">
          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">💡</div>
              <div>
                <p className="text-yellow-400 font-bold">1852 — G.G. Stokes</p>
                <p className="text-purple-200 text-xs mt-1">
                  <strong>Fluoressensiya</strong> hodisasini birinchi marta tavsifladi.
                  "Stokes siljishi" tushunchasini kiritdi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🔬</div>
              <div>
                <p className="text-yellow-400 font-bold">1900-30 — Lantanid lyuminestsensiyasi</p>
                <p className="text-purple-200 text-xs mt-1">
                  Eu³⁺ va Tb³⁺ komplekslarining kuchli lyuminestsensiyasi kashf etildi.
                  <strong> Antenna effekti</strong> mexanizmi tushuntirildi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">⚗️</div>
              <div>
                <p className="text-yellow-400 font-bold">1950-70 — O'tish metallari komplekslari</p>
                <p className="text-purple-200 text-xs mt-1">
                  [Ru(bpy)₃]²⁺ ning kuchli fosforessensiyasi kashf etildi.
                  Fotokataliz va sensorlar uchun asos bo'ldi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">📱</div>
              <div>
                <p className="text-yellow-400 font-bold">1990-2000 — OLED texnologiyasi</p>
                <p className="text-purple-200 text-xs mt-1">
                  Ir³⁺ va Pt²⁺ komplekslari <strong>OLED qurilmalarida</strong> qo'llanila boshladi.
                  Ichki kvant unumi 100% gacha yetdi.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Fluoressensiya spektroskopiyasining ahamiyati:</p>
          <ul className="text-purple-200 space-y-1 list-disc list-inside">
            <li><strong>Yuqori sezgirlik</strong> — bitta molekula darajasida</li>
            <li><strong>Vaqt-ajraladigan tahlil</strong> — fon signalini yo'q qilish</li>
            <li><strong>Bioimaging</strong> — hujayra va to'qimalarni ko'rish</li>
            <li><strong>Sensorlar</strong> — metall ionlari, pH, harorat</li>
            <li><strong>OLED</strong> — yuqori samarador yoritish</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function FluoressensiyaSpektroskopiya() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil" className="text-purple-400 hover:text-purple-300 text-lg">← Tahlil usullari</Link>
        <div>
          <h1 className="text-2xl font-bold text-amber-400">💡 Fluoressensiya spektroskopiya</h1>
          <p className="text-purple-400 text-sm">Lyuminestsensiya • Kvant unumi • Antenna effekti • Eu/Tb/Ru/Ir komplekslari</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* BIRIKMALAR KARTASI */}
        <Link 
          href="/ilmiy/tahlil/fluoressensiya/birikmalar"
          className="group block bg-gradient-to-r from-amber-900/40 to-purple-900/40 border border-amber-700/50 rounded-2xl p-6 hover:bg-amber-900/60 hover:border-amber-500/60 transition-all transform hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-500/10"
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl group-hover:scale-110 transition-transform duration-300">💡</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-amber-400 group-hover:text-amber-300 transition-colors">
                Birikmalarning fluoressensiya spektroskopik tahlili
              </h3>
              <p className="text-purple-300 text-sm mt-1 group-hover:text-purple-200 transition-colors">
                Kompleks birikmalarning fluoressensiya spektrlari tahlili. Emission va qo'zg'alish spektrlari,
                kvant unumi, yashash vaqti va antenna effekti har bir birikma uchun batafsil.
              </p>
            </div>
            <div className="text-3xl text-amber-400 group-hover:translate-x-1 transition-transform">→</div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="bg-amber-600/20 text-amber-400 border border-amber-600/30 px-3 py-1 rounded-full text-xs">12 ta birikma</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Kvant unumi Φ</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Yashash vaqti τ</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">Antenna effekti</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Stokes siljishi</span>
          </div>
        </Link>

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">📋 Fluoressensiya spektroskopiya haqida</h2>
          <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5 mb-4">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-amber-400">Fluoressensiya spektroskopiyasi</strong> — moddaning yorug'likni
              yutib, <strong>ma'lum vaqtdan so'ng qayta nurlantirishi</strong> (lyuminestsensiya) jarayonini o'rganadi.
              Lantanid (Eu³⁺, Tb³⁺) va o'tish metallari (Ru²⁺, Ir³⁺, Pt²⁺) komplekslari kuchli fluoressensiya
              xossalariga ega.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="bg-purple-800/30 rounded p-3">
              <p className="text-amber-400 font-bold">Φ = k<sub>r</sub>/(k<sub>r</sub>+k<sub>nr</sub>)</p>
              <p className="text-purple-300">Kvant unumi</p>
            </div>
            <div className="bg-purple-800/30 rounded p-3">
              <p className="text-amber-400 font-bold">Δλ = λ<sub>em</sub> - λ<sub>abs</sub></p>
              <p className="text-purple-300">Stokes siljishi</p>
            </div>
            <div className="bg-purple-800/30 rounded p-3">
              <p className="text-amber-400 font-bold">I(t) = I₀·exp(-t/τ)</p>
              <p className="text-purple-300">Yashash vaqti</p>
            </div>
          </div>
        </div>

        {/* JABLONSKI DIAGRAMMASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <JablonskiDiagrammasi />
        </div>

        {/* EMISSION SPEKTR SIMULYATORI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <EmissionSpectrumSimulator />
        </div>

        {/* ANTENNA EFFEKTI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <AntennaEffekti />
        </div>

        {/* STOKES SILJISHI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <StokesSiljishi />
        </div>

        {/* KVANT UNUMI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <KvantUnumi />
        </div>

        {/* YASHASH VAQTI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <YashashVaqti />
        </div>

        {/* TARIX */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <TarixiyKontekst />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-amber-600/10 to-purple-600/10 border border-amber-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>Fluoressensiya — <strong className="text-amber-400">lyuminestsent komplekslarni o'rganishda asosiy usul</strong></li>
            <li>Jablonski diagrammasi — S₀→S₁ (yutilish), S₁→S₀ (fluoressensiya), T₁→S₀ (fosforessensiya)</li>
            <li><strong>Antenna effekti</strong> — lantanid komplekslarida liganddan metallga energiya uzatilishi</li>
            <li>Eu³⁺ (qizil, 612 nm) va Tb³⁺ (yashil, 545 nm) — eng yuqori kvant unumi</li>
            <li><strong>Stokes siljishi</strong> — katta bo'lsa, tahlil sezgirligi yuqori</li>
            <li><strong>Kvant unumi (Φ)</strong> — nurlanish samaradorligi ko'rsatkichi</li>
            <li><strong>Yashash vaqti (τ)</strong> — lantanidlarda katta (ms), vaqt-ajraladigan tahlil uchun qulay</li>
            <li>OLED, bioimaging, sensorlar va fotokatalizda keng qo'llaniladi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/mossbauer" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Mössbauer spektroskopiya</Link>
          <Link href="/ilmiy/tahlil/fluoressensiya/birikmalar" className="px-6 py-3 bg-amber-600/80 rounded-xl hover:bg-amber-500 text-white font-semibold">
            Fluoressensiya birikmalar →
          </Link>
        </div>

      </section>
    </main>
  )
}