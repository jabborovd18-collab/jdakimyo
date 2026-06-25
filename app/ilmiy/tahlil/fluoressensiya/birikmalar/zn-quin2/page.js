"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. EMISSION SPEKTR SIMULYATORI — [Zn(quin)₂]
// ============================================================================
function EmissionSpectrumSimulator() {
  const [excitation, setExcitation] = useState(365)
  const [intensity, setIntensity] = useState(100)
  const [zincBound, setZincBound] = useState(true)
  const [solvent, setSolvent] = useState("etanol")

  // Zn(quin)₂ ning π-π* emission cho'qqilari
  const peaksBound = [
    { lambda: 450, intensity: 0.6, assign: "π-π* (vib)" },
    { lambda: 470, intensity: 1.0, assign: "π-π* (max)" },
    { lambda: 490, intensity: 0.5, assign: "π-π* (vib)" },
  ]

  const peaksFree = [
    { lambda: 510, intensity: 0.3, assign: "π-π* (kuchsiz)" },
  ]

  const peaks = zincBound ? peaksBound : peaksFree

  const solventFactors = {
    "etanol": 1.0,
    "metanol": 0.95,
    "asetonitril": 0.90,
    "dmso": 0.85,
    "suv": 0.3
  }
  const solventFactor = solventFactors[solvent]
  const intFactor = (intensity / 100) * solventFactor

  const spectrum = useMemo(() => {
    const points = []
    for (let i = 0; i < 400; i++) {
      const lambda = 400 + i * 0.5
      let emission = 0
      peaks.forEach(peak => {
        const x = (lambda - peak.lambda) / (zincBound ? 20 : 30)
        emission += peak.intensity * Math.exp(-0.5 * x * x) * intFactor
      })
      points.push({ lambda, emission })
    }
    return points
  }, [intensity, zincBound, solvent, intFactor, peaks])

  const maxEmission = Math.max(...spectrum.map(p => p.emission), 0.1)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">💡 Emission spektr simulyatori — [Zn(quin)₂]</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-blue-700/30 space-y-4">
        <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-blue-400 font-bold mb-2">💎 Chelat effekti (CHEF):</p>
          <p className="text-purple-200 text-xs">
            [Zn(quin)₂] — <strong>chelat effekti</strong>ning klassik namunasi.
            Erkin quin ligandi <strong>juda kuchsiz</strong> fluoressensiya beradi (Φ ≈ 0.001).
            Lekin Zn²⁺ bilan <strong>chelat hosil qilganda</strong> fluoressensiya <strong>350 marta kuchayadi</strong> (Φ ≈ 0.35).
            Bu <strong>CHEF (Chelation Enhanced Fluorescence)</strong> deb ataladi.
          </p>
        </div>

        {/* Zn²⁺ BOG'LANISH TOGGLE */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setZincBound(true)}
            className={`px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              zincBound 
                ? "bg-blue-600/80 text-white shadow-lg" 
                : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
            }`}>
            <div className="text-lg mb-1">✓</div>
            <div>Zn²⁺ bog'langan</div>
            <div className="text-[10px] opacity-70 mt-1">Φ ≈ 0.35 (kuchli)</div>
          </button>
          <button onClick={() => setZincBound(false)}
            className={`px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              !zincBound 
                ? "bg-blue-600/80 text-white shadow-lg" 
                : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
            }`}>
            <div className="text-lg mb-1">✗</div>
            <div>Erkin quin</div>
            <div className="text-[10px] opacity-70 mt-1">Φ ≈ 0.001 (kuchsiz)</div>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">Qo'zg'alish to'lqin uzunligi:</span>
              <span className="text-emerald-400 font-mono">{excitation} nm</span>
            </label>
            <input type="range" min="300" max="400" step="5" value={excitation}
              onChange={(e) => setExcitation(parseInt(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-blue-500" />
            <p className="text-purple-400 text-[10px] mt-1">
              Optimal: 365 nm (π-π* yutish)
            </p>
          </div>
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">Intensivlik:</span>
              <span className="text-emerald-400 font-mono">{intensity}%</span>
            </label>
            <input type="range" min="10" max="100" step="5" value={intensity}
              onChange={(e) => setIntensity(parseInt(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-blue-500" />
          </div>
        </div>

        <div>
          <label className="text-xs text-yellow-400 font-bold mb-2 block">Erituvchi:</label>
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(solventFactors).map(([id, factor]) => (
              <button key={id} onClick={() => setSolvent(id)}
                className={`px-2 py-2 rounded-lg text-[10px] font-bold transition-all ${
                  solvent === id 
                    ? "bg-blue-600/80 text-white shadow-lg" 
                    : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
                }`}>
                <div>{id}</div>
                <div className="text-[9px] opacity-70 mt-1">Φ×{factor}</div>
              </button>
            ))}
          </div>
        </div>

        {/* SPEKTR */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-blue-400 font-bold text-xs mb-2">
            Emission spektri ({zincBound ? 'Zn²⁺ bog\'langan' : 'Erkin quin'}, {solvent}, λ<sub>exc</sub> = {excitation} nm)
          </h5>
          <svg viewBox="0 0 400 280" className="w-full h-64">
            <line x1="40" y1="240" x2="380" y2="240" stroke="#4c1d95" strokeWidth="1" />
            <line x1="40" y1="20" x2="40" y2="240" stroke="#4c1d95" strokeWidth="1" />
            
            <text x="210" y="275" fill="#c4b5fd" fontSize="9" textAnchor="middle">λ (nm)</text>
            <text x="40" y="270" fill="#a78bfa" fontSize="8">400</text>
            <text x="380" y="270" fill="#a78bfa" fontSize="8" textAnchor="end">600</text>
            <text x="20" y="130" fill="#a78bfa" fontSize="8" textAnchor="middle" transform="rotate(-90, 20, 130)">
              Intensivlik
            </text>

            {/* λ_max belgilari */}
            {peaks.map((peak, idx) => (
              <g key={idx}>
                <line x1={40 + ((peak.lambda - 400) / 200) * 340} y1="20" 
                  x2={40 + ((peak.lambda - 400) / 200) * 340} y2="240"
                  stroke={peak.intensity === 1.0 ? "#fbbf24" : "#a78bfa"} 
                  strokeWidth="0.5" strokeDasharray="2,2" />
                <text x={40 + ((peak.lambda - 400) / 200) * 340} y="15" 
                  fill={peak.intensity === 1.0 ? "#fbbf24" : "#a78bfa"} 
                  fontSize="7" textAnchor="middle">
                  {peak.lambda} nm
                </text>
                <text x={40 + ((peak.lambda - 400) / 200) * 340} y="25" 
                  fill={peak.intensity === 1.0 ? "#fbbf24" : "#a78bfa"} 
                  fontSize="6" textAnchor="middle">
                  {peak.assign}
                </text>
              </g>
            ))}

            {/* Emission spektri */}
            <polyline
              points={spectrum.map((p, i) => {
                const x = 40 + (i / 400) * 340
                const y = 240 - (p.emission / maxEmission) * 210
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke={zincBound ? "#3b82f6" : "#6b7280"} strokeWidth="2"
            />

            <text x="200" y="35" fill={zincBound ? "#3b82f6" : "#6b7280"} fontSize="9" textAnchor="middle" fontWeight="bold">
              {zincBound ? '[Zn(quin)₂] — ko\'k emissiya (470 nm)' : 'Erkin quin — kuchsiz emissiya (510 nm)'}
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-4 gap-3 text-xs text-center">
          <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-3">
            <p className="text-blue-400">Holat</p>
            <p className="text-emerald-400 font-bold">{zincBound ? 'Chelat' : 'Erkin'}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">λ<sub>em</sub></p>
            <p className="text-emerald-400 font-bold">{zincBound ? '470 nm' : '510 nm'}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Φ</p>
            <p className="text-emerald-400 font-bold">{zincBound ? '0.35' : '0.001'}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Erituvchi</p>
            <p className="text-emerald-400 font-bold">{solvent}</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 CHEF — Chelation Enhanced Fluorescence:</p>
          <p className="text-purple-200">
            <strong>Erkin quin</strong> — O-H tebranishlari orqali energiya yo'qotiladi → kuchsiz emissiya
            <br/>
            <strong>Zn²⁺ bilan chelat</strong> — O-H bog'i uziladi, O⁻ hosil bo'ladi → tebranish yo'qoladi → kuchli emissiya
            <br/>
            Bu <strong>Zn²⁺ sensori</strong> sifatida ishlatiladi — Zn²⁺ borligida fluoressensiya "yoqiladi".
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. QUIN LIGAND STRUKTURASI — 8-HIDROKSIXINOLIN
// ============================================================================
function QuinLigand() {
  const [showChelat, setShowChelat] = useState(false)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔗 Quin ligand — 8-hidroksixinolin</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-blue-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-blue-400 font-bold mb-3">
              {showChelat ? "Chelat holat (Zn²⁺ bilan)" : "Erkin quin"}
            </h4>
            <svg viewBox="0 0 200 200" className="w-full h-48">
              {/* Xinolin halqasi */}
              <polygon points="60,60 80,50 100,60 100,80 80,90 60,80" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
              <polygon points="100,60 120,50 140,60 140,80 120,90 100,80" fill="none" stroke="#a78bfa" strokeWidth="1.5" />

              {/* N atomi */}
              <circle cx="60" cy="80" r="6" fill="#3b82f6" />
              <text x="60" y="83" fill="white" fontSize="6" textAnchor="middle">N</text>

              {/* O atomi (8-pozitsiya) */}
              <line x1="140" y1="60" x2="160" y2="50" stroke="#ef4444" strokeWidth="2" />
              <circle cx="160" cy="50" r="6" fill="#ef4444" />
              <text x="160" y="53" fill="white" fontSize="6" textAnchor="middle">O</text>

              {/* H atomi (erkin holatda) */}
              {!showChelat && (
                <>
                  <line x1="160" y1="50" x2="175" y2="40" stroke="#10b981" strokeWidth="1" />
                  <text x="180" y="38" fill="#10b981" fontSize="7">H</text>
                </>
              )}

              {/* Zn²⁺ bilan chelat */}
              {showChelat && (
                <>
                  <line x1="160" y1="50" x2="160" y2="120" stroke="#3b82f6" strokeWidth="2" />
                  <line x1="60" y1="80" x2="160" y2="120" stroke="#3b82f6" strokeWidth="2" />
                  <circle cx="160" cy="120" r="10" fill="#3b82f6" />
                  <text x="160" y="124" fill="white" fontSize="8" textAnchor="middle" fontWeight="bold">Zn</text>
                  
                  <text x="160" y="145" fill="#fbbf24" fontSize="7" textAnchor="middle">O⁻ (deprotonatsiya)</text>
                </>
              )}

              <text x="100" y="170" fill="#a78bfa" fontSize="8" textAnchor="middle">
                8-hidroksixinolin (quin)
              </text>
              <text x="100" y="185" fill={showChelat ? "#3b82f6" : "#10b981"} fontSize="7" textAnchor="middle">
                {showChelat ? "Chelat (N,O-bidentat)" : "Erkin (O-H bog'i bor)"}
              </text>
            </svg>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-blue-400 font-bold mb-3">Xususiyatlari:</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Turi:</span>
                <span className="text-blue-400 font-bold">Bidentat (N,O)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Zaryad:</span>
                <span className="text-blue-400">{showChelat ? "1− (anion)" : "0 (neytral)"}</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">π-elektronlar:</span>
                <span className="text-blue-400">10 (aromatik)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">λ<sub>abs</sub>:</span>
                <span className="text-blue-400">~365 nm</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">pK<sub>a</sub>:</span>
                <span className="text-blue-400">9.9 (O-H)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Koordinatsion:</span>
                <span className="text-blue-400">N (piridin) + O (fenol)</span>
              </div>
            </div>
          </div>
        </div>

        <button onClick={() => setShowChelat(!showChelat)}
          className="w-full px-4 py-3 bg-blue-600/30 hover:bg-blue-600/50 rounded-lg text-sm text-blue-400 font-bold transition-all">
          {showChelat ? "Erkin quin ko'rish" : "Chelat holat ko'rish (Zn²⁺ bilan)"}
        </button>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun 8-pozitsiya muhim?</p>
          <p className="text-purple-200">
            <strong>8-gidroksil guruhi</strong> — N atomi bilan birga <strong>5 a'zoli chelat halqasi</strong> hosil qiladi.
            <br/>
            Bu <strong>barqaror chelat</strong> — Zn²⁺ ni mahkam ushlaydi.
            <br/>
            <strong>O-H bog'i</strong> — erkin holatda energiya yo'qotadi (kuchsiz emissiya).
            <br/>
            <strong>Zn²⁺ bilan</strong> — O-H uziladi, O⁻ hosil bo'ladi → emissiya kuchayadi (CHEF).
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. CHEF MEXANIZMI — Chelation Enhanced Fluorescence
// ============================================================================
function CHEFMexanizmi() {
  const [step, setStep] = useState(0)

  const steps = [
    {
      title: "1. Erkin quin — kuchsiz emissiya",
      desc: "O-H tebranishlari orqali energiya yo'qotiladi (nurlanishsiz relaksatsiya)",
      formula: "quin + hν → quin* → issiqlik (Φ ≈ 0.001)",
      icon: "✗",
      color: "#6b7280"
    },
    {
      title: "2. Zn²⁺ bilan chelat hosil bo'lishi",
      desc: "Zn²⁺ quin bilan N va O orqali bog'lanadi, O-H uziladi",
      formula: "Zn²⁺ + 2 quin → [Zn(quin)₂] + 2H⁺",
      icon: "🔗",
      color: "#3b82f6"
    },
    {
      title: "3. O-H tebranishlari yo'qoladi",
      desc: "O⁻ hosil bo'ladi — O-H tebranishlari yo'q → nurlanishsiz yo'qotish kamayadi",
      formula: "[Zn(quin)₂] — O-H yo'q → kamroq yo'qotish",
      icon: "✓",
      color: "#10b981"
    },
    {
      title: "4. Kuchli fluoressensiya",
      desc: "π-π* o'tish orqali ko'k nurlanish (470 nm), Φ ≈ 0.35",
      formula: "[Zn(quin)₂] + hν → [Zn(quin)₂]* → hν' (470 nm)",
      icon: "✨",
      color: "#3b82f6"
    }
  ]

  const s = steps[step]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚡ CHEF mexanizmi — Chelation Enhanced Fluorescence</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-blue-700/30 space-y-4">
        <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-blue-400 font-bold mb-2">💎 CHEF nima?</p>
          <p className="text-purple-200 text-xs">
            <strong>CHEF (Chelation Enhanced Fluorescence)</strong> — chelat hosil bo'lganda fluoressensiya kuchayishi.
            <br/>
            <strong>Erkin quin</strong> — O-H tebranishlari orqali energiya yo'qotiladi → kuchsiz emissiya (Φ ≈ 0.001).
            <br/>
            <strong>Zn²⁺ bilan chelat</strong> — O-H uziladi → tebranish yo'qoladi → kuchli emissiya (Φ ≈ 0.35).
            <br/>
            Bu <strong>350 marta kuchayish</strong>!
          </p>
        </div>

        {/* STEP NAVIGATION */}
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <button key={i} onClick={() => setStep(i)}
              className={`flex-1 px-2 py-2 rounded-lg text-xs font-bold transition-all ${
                step === i 
                  ? "bg-blue-600/80 text-white shadow-lg" 
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
            <h4 className="text-blue-400 font-bold text-lg">{s.title}</h4>
          </div>
          <p className="text-purple-200 text-sm mb-3">{s.desc}</p>
          <div className="bg-purple-900/50 rounded p-3 font-mono text-xs text-center text-emerald-400">
            {s.formula}
          </div>
        </div>

        {/* VIZUALIZATSIYA */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-blue-400 font-bold text-xs mb-3">Energiya diagrammasi:</h5>
          <svg viewBox="0 0 400 250" className="w-full h-60">
            <line x1="50" y1="230" x2="50" y2="20" stroke="#4c1d95" strokeWidth="1" />
            <text x="30" y="125" fill="#c4b5fd" fontSize="9" textAnchor="middle" transform="rotate(-90, 30, 125)">
              Energiya
            </text>

            {/* Erkin quin */}
            <text x="150" y="40" fill="#6b7280" fontSize="9" textAnchor="middle" fontWeight="bold">Erkin quin</text>
            <rect x="100" y="200" width="100" height="20" fill="#6b7280" opacity="0.3" />
            <text x="150" y="215" fill="#6b7280" fontSize="8" textAnchor="middle">GS</text>
            <rect x="100" y="80" width="100" height="20" fill="#6b7280" opacity="0.3" />
            <text x="150" y="95" fill="#6b7280" fontSize="8" textAnchor="middle">S₁</text>

            <line x1="150" y1="200" x2="150" y2="100" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrowY)" />
            <text x="165" y="150" fill="#fbbf24" fontSize="7">hν</text>

            {/* Kuchli nurlanishsiz yo'qotish */}
            <path d="M 150 100 Q 180 130 150 200" fill="none" stroke="#ef4444" strokeWidth="3" />
            <text x="185" y="150" fill="#ef4444" fontSize="7">O-H tebranish</text>
            <text x="185" y="160" fill="#ef4444" fontSize="7">(kuchli yo'qotish)</text>

            {/* Zn(quin)₂ */}
            <text x="300" y="40" fill="#3b82f6" fontSize="9" textAnchor="middle" fontWeight="bold">[Zn(quin)₂]</text>
            <rect x="250" y="200" width="100" height="20" fill="#3b82f6" opacity="0.3" />
            <text x="300" y="215" fill="#3b82f6" fontSize="8" textAnchor="middle">GS</text>
            <rect x="250" y="80" width="100" height="20" fill="#3b82f6" opacity="0.3" />
            <text x="300" y="95" fill="#3b82f6" fontSize="8" textAnchor="middle">S₁</text>

            <line x1="300" y1="200" x2="300" y2="100" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrowY)" />
            <text x="315" y="150" fill="#fbbf24" fontSize="7">hν</text>

            {/* Kuchli emissiya */}
            <line x1="300" y1="100" x2="300" y2="200" stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arrowB)" />
            <text x="315" y="150" fill="#3b82f6" fontSize="7">hν' (470 nm)</text>
            <text x="315" y="160" fill="#3b82f6" fontSize="7">(kuchli emissiya)</text>

            <defs>
              <marker id="arrowY" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
                <polygon points="0,0 5,2.5 0,5" fill="#fbbf24" />
              </marker>
              <marker id="arrowB" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
                <polygon points="0,0 5,2.5 0,5" fill="#3b82f6" />
              </marker>
            </defs>
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 text-xs">
            <p className="text-red-400 font-bold mb-1">Erkin quin (Φ ≈ 0.001):</p>
            <ul className="text-purple-200 space-y-1 list-disc list-inside">
              <li>O-H bog'i bor → kuchli tebranish</li>
              <li>Nurlanishsiz yo'qotish ustun</li>
              <li>Kuchsiz emissiya</li>
            </ul>
          </div>
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 text-xs">
            <p className="text-blue-400 font-bold mb-1">[Zn(quin)₂] (Φ ≈ 0.35):</p>
            <ul className="text-purple-200 space-y-1 list-disc list-inside">
              <li>O-H uzilgan → O⁻ hosil bo'lgan</li>
              <li>Tebranish yo'q → kamroq yo'qotish</li>
              <li>Kuchli emissiya (350×)</li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun O-H muhim?</p>
          <p className="text-purple-200">
            <strong>O-H tebranishlari</strong> — yuqori chastotali (~3600 cm⁻¹).
            <br/>
            Ular <strong>energiyani issiqlikka</strong> aylantiradi (nurlanishsiz relaksatsiya).
            <br/>
            <strong>Zn²⁺ bilan</strong> — O-H uziladi, O⁻ hosil bo'ladi → tebranish chastotasi pasayadi → yo'qotish kamayadi.
            <br/>
            Natijada <strong>fluoressensiya 350 marta kuchayadi</strong>!
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. Zn²⁺ SENSORI — TITRLASH
// ============================================================================
function ZnSensori() {
  const [znConc, setZnConc] = useState(0)
  
  // Binding curve: I = I_max * [Zn] / (K_d + [Zn])
  const K_d = 1.0 // dissociation constant (μM)
  const I_max = 100
  const intensity = I_max * znConc / (K_d + znConc)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔬 Zn²⁺ sensori — titrlash egri chizig'i</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-blue-700/30 space-y-4">
        <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-blue-400 font-bold mb-2">💎 Eng muhim qo'llanilish:</p>
          <p className="text-purple-200 text-xs">
            [Zn(quin)₂] — <strong>Zn²⁺ sensori</strong> sifatida eng ko'p qo'llaniladigan kompleks.
            Zn²⁺ konsentratsiyasi oshishi bilan fluoressensiya <strong>sigmoidal</strong> oshadi.
            <strong> K<sub>d</sub></strong> (dissotsiatsiya konstantasi) orqali sezgirlik aniqlanadi.
          </p>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4 font-mono text-center">
          <p className="text-purple-400 text-xs mb-2">Binding tenglamasi:</p>
          <p className="text-blue-400 text-lg">I = I<sub>max</sub> × [Zn²⁺] / (K<sub>d</sub> + [Zn²⁺])</p>
        </div>

        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">[Zn²⁺] (μM):</span>
            <span className="text-emerald-400 font-mono">{znConc.toFixed(1)}</span>
          </label>
          <input type="range" min="0" max="10" step="0.1" value={znConc}
            onChange={(e) => setZnConc(parseFloat(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-blue-500" />
          <div className="flex justify-between text-[10px] text-purple-400 mt-1">
            <span>0 μM</span>
            <span>K<sub>d</sub> = 1 μM</span>
            <span>10 μM</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-center">
          <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-3">
            <p className="text-blue-400">Intensivlik</p>
            <p className="text-emerald-400 font-bold font-mono text-2xl">{intensity.toFixed(1)}%</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">To'yinganlik</p>
            <p className="text-emerald-400 font-bold font-mono text-2xl">{(intensity / I_max * 100).toFixed(0)}%</p>
          </div>
        </div>

        {/* Titrlash egri chizig'i */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-blue-400 font-bold text-xs mb-2">Titrlash egri chizig'i:</h5>
          <svg viewBox="0 0 400 200" className="w-full h-48">
            <line x1="50" y1="180" x2="380" y2="180" stroke="#4c1d95" strokeWidth="1" />
            <line x1="50" y1="20" x2="50" y2="180" stroke="#4c1d95" strokeWidth="1" />
            
            <text x="215" y="195" fill="#c4b5fd" fontSize="9" textAnchor="middle">[Zn²⁺] (μM)</text>
            <text x="30" y="100" fill="#c4b5fd" fontSize="9" textAnchor="middle" transform="rotate(-90, 30, 100)">
              Intensivlik
            </text>

            {/* Sigmoidal egri chiziq */}
            <polyline
              points={Array.from({ length: 100 }, (_, i) => {
                const zn = (i / 100) * 10
                const I = I_max * zn / (K_d + zn)
                const x = 50 + (zn / 10) * 330
                const y = 180 - (I / I_max) * 150
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke="#3b82f6" strokeWidth="2"
            />

            {/* Joriy nuqta */}
            <circle cx={50 + (znConc / 10) * 330} cy={180 - (intensity / I_max) * 150} r="5" fill="#fbbf24" />

            {/* K_d belgisi */}
            <line x1={50 + (K_d / 10) * 330} y1="20" x2={50 + (K_d / 10) * 330} y2="180"
              stroke="#ef4444" strokeWidth="1" strokeDasharray="2,2" />
            <text x={50 + (K_d / 10) * 330} y="15" fill="#ef4444" fontSize="7" textAnchor="middle">
              K<sub>d</sub> = 1 μM
            </text>

            <text x="50" y="195" fill="#a78bfa" fontSize="7">0</text>
            <text x="380" y="195" fill="#a78bfa" fontSize="7" textAnchor="end">10</text>
            <text x="45" y="180" fill="#a78bfa" fontSize="7" textAnchor="end">0%</text>
            <text x="45" y="30" fill="#a78bfa" fontSize="7" textAnchor="end">100%</text>
          </svg>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun sigmoidal?</p>
          <p className="text-purple-200">
            <strong>Past [Zn²⁺]</strong> — ko'p quin erkin holatda → kuchsiz emissiya
            <br/>
            <strong>[Zn²⁺] ≈ K<sub>d</sub></strong> — yarim to'yingan → emissiya tez oshadi
            <br/>
            <strong>Yuqori [Zn²⁺]</strong> — barcha quin chelat holatda → maksimal emissiya
            <br/>
            <strong>K<sub>d</sub> = 1 μM</strong> — biologik konsentratsiyalar uchun ideal (hujayrada Zn²⁺ ≈ 0.1-1 μM).
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. Φ VA TAU
// ============================================================================
function PhiVaTau() {
  const [temperature, setTemperature] = useState(298)
  const [pH, setPH] = useState(7)

  // Harorat ta'siri
  const tempFactor = Math.max(0.5, 1 - (temperature - 298) / 400)
  
  // pH ta'siri (optimal pH 7-9)
  const pHFactor = pH >= 7 && pH <= 9 ? 1.0 : pH < 7 ? 0.5 : 0.7
  
  const phi = 0.35 * tempFactor * pHFactor
  const tau = 5 * tempFactor * pHFactor

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📊 Φ va τ — harorat va pH ta'siri</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-blue-700/30 space-y-4">
        <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-blue-400 font-bold mb-2">💎 Φ va τ qiymatlari:</p>
          <p className="text-purple-200 text-xs">
            [Zn(quin)₂] — <strong>Φ ≈ 0.35</strong> va <strong>τ ≈ 5 ns</strong> (optimal sharoitda).
            <br/>
            <strong>Harorat</strong> va <strong>pH</strong> ga bog'liq.
            <br/>
            Optimal: <strong>xona harorati</strong> (25°C) va <strong>pH 7-9</strong>.
          </p>
        </div>

        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">Harorat:</span>
            <span className="text-emerald-400 font-mono">{temperature} K</span>
          </label>
          <input type="range" min="250" max="350" step="5" value={temperature}
            onChange={(e) => setTemperature(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-blue-500" />
          <div className="flex justify-between text-[10px] text-purple-400 mt-1">
            <span>250 K (-23°C)</span>
            <span>298 K (25°C)</span>
            <span>350 K (77°C)</span>
          </div>
        </div>

        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">pH:</span>
            <span className="text-emerald-400 font-mono">{pH}</span>
          </label>
          <input type="range" min="4" max="10" step="0.5" value={pH}
            onChange={(e) => setPH(parseFloat(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-blue-500" />
          <div className="flex justify-between text-[10px] text-purple-400 mt-1">
            <span>pH 4 (kislota)</span>
            <span>pH 7 (neytral)</span>
            <span>pH 10 (ishqor)</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-center">
          <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-3">
            <p className="text-blue-400">Φ (kvant unumi)</p>
            <p className="text-emerald-400 font-bold font-mono text-2xl">{phi.toFixed(3)}</p>
            <p className="text-purple-400 text-[10px]">{phi > 0.3 ? "✓ Yaxshi" : phi > 0.2 ? "○ O'rtacha" : "✗ Past"}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">τ (ns)</p>
            <p className="text-emerald-400 font-bold font-mono text-2xl">{tau.toFixed(2)}</p>
            <p className="text-purple-400 text-[10px]">{tau > 4 ? "✓ Yaxshi" : tau > 3 ? "○ O'rtacha" : "✗ Qisqa"}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 text-xs">
            <p className="text-red-400 font-bold mb-1">Harorat ta'siri:</p>
            <p className="text-purple-200">
              Harorat oshishi → <strong>tebranish relaksatsiyasi</strong> kuchayadi → nurlanishsiz yo'qotishlar oshadi.
              <br/>
              Φ va τ <strong>kamayadi</strong>.
            </p>
          </div>
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 text-xs">
            <p className="text-yellow-400 font-bold mb-1">pH ta'siri:</p>
            <p className="text-purple-200">
              <strong>pH &lt; 7</strong> — protonatsiya → chelat buziladi → emissiya kamayadi.
              <br/>
              <strong>pH 7-9</strong> — optimal → maksimal emissiya.
              <br/>
              <strong>pH &gt; 9</strong> — Zn(OH)₂ cho'kadi → emissiya kamayadi.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 6. SOLISHTIRISH — BOSHQA Zn KOMPLEKSLARI
// ============================================================================
function Solishtirish() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 Boshqa Zn²⁺ komplekslari bilan solishtirish</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-blue-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-2 text-yellow-400">Kompleks</th>
                <th className="text-center py-3 px-2 text-yellow-400">Ligand</th>
                <th className="text-center py-3 px-2 text-yellow-400">λ<sub>em</sub></th>
                <th className="text-center py-3 px-2 text-yellow-400">Φ</th>
                <th className="text-center py-3 px-2 text-yellow-400">τ</th>
                <th className="text-center py-3 px-2 text-yellow-400">Rang</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["[Zn(quin)₂]", "quin (8-OH)", "470 nm", "0.35", "5 ns", "Ko'k"],
                ["[Zn(bpy)₂]²⁺", "bpy", "450 nm", "0.20", "3 ns", "Ko'k"],
                ["[Zn(phen)₂]²⁺", "phen", "460 nm", "0.25", "4 ns", "Ko'k"],
                ["[Zn(salen)]", "salen", "520 nm", "0.15", "6 ns", "Yashil"],
                ["[Zn(porphyrin)]", "porphyrin", "600 nm", "0.03", "2 ns", "Qizil"],
                ["[Zn(acac)₂]", "acac", "430 nm", "0.10", "4 ns", "Ko'k-binafsha"],
              ].map((r, i) => (
                <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${i === 0 ? 'bg-blue-900/20' : ''}`}>
                  <td className={`py-2 px-2 font-bold ${i === 0 ? 'text-blue-400' : 'text-purple-300'}`}>{r[0]}</td>
                  <td className="py-2 px-2 text-center">{r[1]}</td>
                  <td className="py-2 px-2 text-center">{r[2]}</td>
                  <td className="py-2 px-2 text-center">{r[3]}</td>
                  <td className="py-2 px-2 text-center">{r[4]}</td>
                  <td className="py-2 px-2 text-center">{r[5]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 bg-blue-600/10 border border-blue-500/30 rounded-lg p-3 text-xs">
          <p className="text-blue-400 font-bold mb-1">💡 Nima uchun [Zn(quin)₂] eng yaxshi?</p>
          <p className="text-purple-200">
            <strong>CHEF effekti</strong> — chelat hosil bo'lganda emissiya 350× kuchayadi.
            <br/>
            <strong>Yuqori Φ</strong> (0.35) — Zn komplekslari orasida eng yuqori.
            <br/>
            <strong>Ko'k emissiya</strong> (470 nm) — OLED uchun ideal.
            <br/>
            <strong>Suvda eruvchan</strong> — bioimaging uchun qulay.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 7. QO'LLANILISH
// ============================================================================
function Qollanilish() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🏭 Amaliy qo'llanilishi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-blue-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🔬</div>
            <h4 className="text-blue-400 font-bold mb-2">Zn²⁺ sensorlari</h4>
            <p className="text-purple-200 text-xs">
              <strong>Eng keng qo'llanilish</strong>. Biologik namunalarda Zn²⁺ aniqlash.
              <br/>
              <strong>Hujayra ichidagi Zn²⁺</strong> — neyronlar, oshqozon osti bezi.
              <br/>
              <strong>Atrof-muhit</strong> — suv, tuproq namunalari.
              <br/>
              <strong>Oziq-ovqat</strong> — Zn²⁺ miqdorini o'lchash.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">📱</div>
            <h4 className="text-blue-400 font-bold mb-2">OLED (ko'k piksel)</h4>
            <p className="text-purple-200 text-xs">
              <strong>Ko'k emissiya</strong> (470 nm) — OLED displeylar uchun ideal.
              <br/>
              <strong>Yuqori Φ</strong> (0.35) — samarali yorug'lik chiqarish.
              <br/>
              <strong>Arzon</strong> — Ir(ppy)₃ dan ancha arzon.
              <br/>
              <strong>Barqaror</strong> — uzoq muddatli ishlash.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🔬</div>
            <h4 className="text-blue-400 font-bold mb-2">Bioimaging</h4>
            <p className="text-purple-200 text-xs">
              <strong>Hujayra va to'qimalarni tasvirlash</strong>.
              <br/>
              <strong>Zn²⁺ xaritasi</strong> — hujayra ichidagi Zn²⁺ taqsimoti.
              <br/>
              <strong>Neyron faolligi</strong> — Zn²⁺ signal uzatishda muhim.
              <br/>
              <strong>Diabet tadqiqoti</strong> — oshqozon osti bezi Zn²⁺.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">💡</div>
            <h4 className="text-blue-400 font-bold mb-2">Yoritish</h4>
            <p className="text-purple-200 text-xs">
              <strong>Fluoressent chiroqlar</strong> — ko'k komponent.
              <br/>
              <strong>Signal chiroqlari</strong>, indikatorlar.
              <br/>
              <strong>Xavfsizlik belgilari</strong> — UV nur ostida ko'k porlaydi.
            </p>
          </div>
        </div>

        <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-blue-400 font-bold mb-2">🌟 Qiziqarli faktlar:</p>
          <ul className="text-purple-200 text-xs space-y-2">
            <li>
              <strong>Zn²⁺</strong> — inson tanasida <strong>ikkinchi eng ko'p</strong> mikroelement (temirdan keyin).
              <br/>
              Neyronlar, oshqozon osti bezi, prostata — barchasida Zn²⁺ yuqori konsentratsiyada.
            </li>
            <li>
              <strong>Altsgeymer kasalligi</strong> — miyada Zn²⁺ taqsimoti buziladi.
              <br/>
              [Zn(quin)₂] sensorlari orqali <strong>erta diagnostika</strong> mumkin.
            </li>
            <li>
              <strong>Diabet</strong> — oshqozon osti bezi β-hujayralarida Zn²⁺ insulin bilan birga saqlanadi.
              <br/>
              [Zn(quin)₂] orqali <strong>insulin sekretsiyasi</strong>ni kuzatish mumkin.
            </li>
            <li>
              [Zn(quin)₂] — <strong>eng arzon va samarali</strong> Zn²⁺ sensori.
              <br/>
              Har yili <strong>millionlab dollar</strong>lik tadqiqotlarda ishlatiladi.
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function ZnQuin2Fluoressensiya() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      <header className="flex flex-col gap-2 px-6 py-4 border-b border-purple-800/50">
        <nav className="flex items-center gap-2 text-sm flex-wrap">
          <Link href="/" className="text-purple-400 hover:text-purple-300">🏠</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil" className="text-purple-400 hover:text-purple-300">Tahlil</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil/fluoressensiya" className="text-purple-400 hover:text-purple-300">Fluoressensiya</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil/fluoressensiya/birikmalar" className="text-purple-400 hover:text-purple-300">Birikmalar</Link>
          <span className="text-purple-600">›</span>
          <span className="text-blue-400">[Zn(quin)₂]</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">💡 [Zn(quin)₂] — Fluoressensiya tahlili</h1>
          <p className="text-purple-400 text-sm">
            Zn²⁺ • CHEF • Zn²⁺ sensori • Φ ≈ 0.35 • τ ≈ 5 ns • Ko'k emissiya
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        <div className="bg-purple-900/40 border border-blue-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-4xl md:text-5xl font-extrabold font-mono text-blue-400">[Zn(quin)₂]</span>
            <div>
              <h2 className="text-xl font-bold text-white">Fluoressensiya tahlili — to'liq profil</h2>
              <p className="text-purple-400">"CHEF klassikasi" — Zn²⁺ sensori</p>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              [Zn(quin)₂] — <strong className="text-blue-400">CHEF (Chelation Enhanced Fluorescence)</strong> ning klassik namunasi.
              Zn²⁺ (3d¹⁰) <strong>ikki ta 8-hidroksixinolin</strong> ligand bilan o'ralgan.
              Erkin quin <strong>kuchsiz</strong> emissiya beradi (Φ ≈ 0.001).
              Lekin Zn²⁺ bilan <strong>chelat hosil qilganda</strong> fluoressensiya <strong>350 marta kuchayadi</strong> (Φ ≈ 0.35).
              <strong> Ko'k emissiya</strong> (470 nm) va <strong>τ ≈ 5 ns</strong>.
              Zn²⁺ sensori va OLED da keng qo'llaniladi.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-blue-400 font-bold text-lg">Zn²⁺ (3d¹⁰)</p>
              <p className="text-purple-300">diamagnit</p>
              <p className="text-purple-400 mt-1">S = 0</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-blue-400 font-bold text-lg">λ<sub>em</sub> = 470</p>
              <p className="text-purple-300">nm</p>
              <p className="text-purple-400 mt-1">ko'k</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-blue-400 font-bold text-lg">Φ ≈ 0.35</p>
              <p className="text-purple-300">kvant unumi</p>
              <p className="text-purple-400 mt-1">(chelat)</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-blue-400 font-bold text-lg">τ ≈ 5</p>
              <p className="text-purple-300">ns</p>
              <p className="text-purple-400 mt-1">fluoressensiya</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <EmissionSpectrumSimulator />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <QuinLigand />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <CHEFMexanizmi />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <ZnSensori />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <PhiVaTau />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <Solishtirish />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <Qollanilish />
        </div>

        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>[Zn(quin)₂] — <strong className="text-blue-400">CHEF effektining klassikasi</strong></li>
            <li>Zn²⁺ (3d¹⁰) — <strong>diamagnit</strong>, S = 0</li>
            <li><strong>8-hidroksixinolin</strong> ligand — bidentat (N,O)</li>
            <li><strong>CHEF</strong> — chelat hosil bo'lganda emissiya 350× kuchayadi</li>
            <li><strong>Φ ≈ 0.35</strong> (chelat) vs <strong>0.001</strong> (erkin)</li>
            <li><strong>τ ≈ 5 ns</strong> — fluoressensiya (π-π* o'tish)</li>
            <li><strong>Ko'k emissiya</strong> (470 nm) — OLED uchun ideal</li>
            <li><strong>Zn²⁺ sensori</strong> — sigmoidal binding curve</li>
            <li><strong>Biologik ahamiyat</strong> — Altsgeymer, diabet tadqiqoti</li>
            <li>Qo'llanilish: <strong>Zn²⁺ sensorlari, OLED, bioimaging, yoritish</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/fluoressensiya/birikmalar/ptoep" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← [PtOEP]
          </Link>
          <Link href="/ilmiy/tahlil/fluoressensiya/birikmalar/alq3" className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 text-white font-semibold">
            Alq₃ →
          </Link>
        </div>
      </section>
    </main>
  )
}