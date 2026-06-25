"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. EMISSION SPEKTR SIMULYATORI ([Tb(dpa)₃]³⁻ uchun)
// ============================================================================
function EmissionSpectrumSimulator() {
  const [excitation, setExcitation] = useState(280)
  const [intensity, setIntensity] = useState(100)
  const [solvent, setSolvent] = useState("suv")
  const [showPeaks, setShowPeaks] = useState(true)

  // Tb³⁺ ning xarakterli emission cho'qqilari
  const peaks = [
    { lambda: 490, intensity: 0.30, assign: "⁵D₄ → ⁷F₆", type: "ko'k-yashil" },
    { lambda: 545, intensity: 1.0, assign: "⁵D₄ → ⁷F₅", type: "yashil (eng kuchli)" },
    { lambda: 585, intensity: 0.40, assign: "⁵D₄ → ⁷F₄", type: "sariq-yashil" },
    { lambda: 620, intensity: 0.20, assign: "⁵D₄ → ⁷F₃", type: "qizil" },
  ]

  // Erituvchi ta'siri
  const solventFactors = {
    "suv": 0.65,
    "metanol": 0.80,
    "asetonitril": 0.90,
    "dmso": 1.0
  }
  const solventFactor = solventFactors[solvent]

  const intFactor = (intensity / 100) * solventFactor

  // Emission spektri
  const spectrum = useMemo(() => {
    const points = []
    for (let i = 0; i < 400; i++) {
      const lambda = 450 + i * 0.625 // 450-700 nm
      let emission = 0

      peaks.forEach(peak => {
        const x = (lambda - peak.lambda) / 2.0
        emission += peak.intensity * Math.exp(-0.5 * x * x) * intFactor
      })

      points.push({ lambda, emission })
    }
    return points
  }, [intensity, solvent, intFactor])

  const maxEmission = Math.max(...spectrum.map(p => p.emission), 0.1)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">💡 Emission spektr simulyatori — [Tb(dpa)₃]³⁻</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-teal-700/30 space-y-4">
        <div className="bg-teal-600/10 border border-teal-500/30 rounded-lg p-4">
          <p className="text-teal-400 font-bold mb-2">💎 Suvda eruvchan yashil emitter:</p>
          <p className="text-purple-200 text-xs">
            [Tb(dpa)₃]³⁻ — <strong>anion kompleks</strong>, suvda yaxshi eriydi.
            Tb³⁺ ning <strong>yashil emissiyasi</strong> (545 nm, ⁵D₄ → ⁷F₅) bioimaging uchun ideal —
            to'qimalarning autofluoressensiyasi bu sohada minimal.
            <strong> Φ ≈ 0.45</strong> va <strong>τ ≈ 0.9 ms</strong> — suvda eruvchan lantanidlar uchun yuqori ko'rsatkichlar.
          </p>
        </div>

        {/* BOSHQARUV */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">Qo'zg'alish to'lqin uzunligi:</span>
              <span className="text-emerald-400 font-mono">{excitation} nm</span>
            </label>
            <input type="range" min="250" max="350" step="5" value={excitation}
              onChange={(e) => setExcitation(parseInt(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-teal-500" />
            <p className="text-purple-400 text-[10px] mt-1">
              Optimal: 280 nm (dpa ligand yutishi)
            </p>
          </div>
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">Intensivlik:</span>
              <span className="text-emerald-400 font-mono">{intensity}%</span>
            </label>
            <input type="range" min="10" max="100" step="5" value={intensity}
              onChange={(e) => setIntensity(parseInt(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-teal-500" />
          </div>
        </div>

        <div>
          <label className="text-xs text-yellow-400 font-bold mb-2 block">Erituvchi:</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: "suv", name: "Suv", factor: "0.65" },
              { id: "metanol", name: "Metanol", factor: "0.80" },
              { id: "asetonitril", name: "CH₃CN", factor: "0.90" },
              { id: "dmso", name: "DMSO", factor: "1.0" }
            ].map(s => (
              <button key={s.id} onClick={() => setSolvent(s.id)}
                className={`px-2 py-2 rounded-lg text-[10px] font-bold transition-all ${
                  solvent === s.id 
                    ? "bg-teal-600/80 text-white shadow-lg" 
                    : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
                }`}>
                <div>{s.name}</div>
                <div className="text-[9px] opacity-70 mt-1">Φ×{s.factor}</div>
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 text-xs cursor-pointer">
          <input type="checkbox" checked={showPeaks}
            onChange={(e) => setShowPeaks(e.target.checked)}
            className="accent-teal-500" />
          <span className="text-purple-300">Cho'qqi belgilarini ko'rsatish</span>
        </label>

        {/* SPEKTR */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-teal-400 font-bold text-xs mb-2">
            Emission spektri ({solvent}, λ<sub>exc</sub> = {excitation} nm)
          </h5>
          <svg viewBox="0 0 400 280" className="w-full h-64">
            <line x1="40" y1="240" x2="380" y2="240" stroke="#4c1d95" strokeWidth="1" />
            <line x1="40" y1="20" x2="40" y2="240" stroke="#4c1d95" strokeWidth="1" />
            
            <text x="210" y="275" fill="#c4b5fd" fontSize="9" textAnchor="middle">λ (nm)</text>
            <text x="40" y="270" fill="#a78bfa" fontSize="8">450</text>
            <text x="380" y="270" fill="#a78bfa" fontSize="8" textAnchor="end">700</text>
            <text x="20" y="130" fill="#a78bfa" fontSize="8" textAnchor="middle" transform="rotate(-90, 20, 130)">
              Intensivlik
            </text>

            {/* λ_max belgilari */}
            {showPeaks && peaks.map((peak, idx) => (
              <g key={idx}>
                <line x1={40 + ((peak.lambda - 450) / 250) * 340} y1="20" 
                  x2={40 + ((peak.lambda - 450) / 250) * 340} y2="240"
                  stroke={peak.type.includes("eng kuchli") ? "#fbbf24" : "#a78bfa"} 
                  strokeWidth="0.5" strokeDasharray="2,2" />
                <text x={40 + ((peak.lambda - 450) / 250) * 340} y="15" 
                  fill={peak.type.includes("eng kuchli") ? "#fbbf24" : "#a78bfa"} 
                  fontSize="7" textAnchor="middle">
                  {peak.lambda} nm
                </text>
                <text x={40 + ((peak.lambda - 450) / 250) * 340} y="25" 
                  fill={peak.type.includes("eng kuchli") ? "#fbbf24" : "#a78bfa"} 
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
              fill="none" stroke="#14b8a6" strokeWidth="2"
            />

            <text x="200" y="35" fill="#14b8a6" fontSize="9" textAnchor="middle" fontWeight="bold">
              Tb³⁺ — yashil emissiya (545 nm)
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          <div className="bg-teal-900/30 border border-teal-500/50 rounded-lg p-3">
            <p className="text-teal-400">Asosiy cho'qqi</p>
            <p className="text-emerald-400 font-bold">545 nm</p>
            <p className="text-purple-400 text-[10px]">⁵D₄ → ⁷F₅</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Erituvchi</p>
            <p className="text-emerald-400 font-bold">{solvent}</p>
            <p className="text-purple-400 text-[10px]">kvenching: ×{solventFactor}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Stokes siljishi</p>
            <p className="text-yellow-400 font-bold">~265 nm</p>
            <p className="text-purple-400 text-[10px]">juda katta</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun yashil emissiya bioimaging uchun ideal?</p>
          <p className="text-purple-200">
            <strong>Biologik to'qimalar</strong>ning autofluoressensiyasi asosan ko'k (400-450 nm) va qizil (600-650 nm) sohada.
            <br/>
            Tb³⁺ ning <strong>yashil emissiyasi</strong> (545 nm) bu sohalar orasida → <strong>fon signali minimal</strong>.
            <br/>
            Bu <strong>yuqori kontrast</strong> va <strong>sezgirlik</strong>ni ta'minlaydi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. DPA LIGAND STRUKTURASI
// ============================================================================
function DpaLigand() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔗 dpa ligand — 2,2'-dipirinilamin</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-teal-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-teal-400 font-bold mb-3">dpa strukturasi:</h4>
            <svg viewBox="0 0 200 200" className="w-full h-48">
              {/* Chap piridin halqasi */}
              <polygon points="30,70 50,60 70,70 70,90 50,100 30,90" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
              
              {/* O'rta N atomi */}
              <circle cx="100" cy="80" r="8" fill="#3b82f6" />
              <text x="100" y="83" fill="white" fontSize="7" textAnchor="middle">N</text>

              {/* O'ng piridin halqasi */}
              <polygon points="130,70 150,60 170,70 170,90 150,100 130,90" fill="none" stroke="#a78bfa" strokeWidth="1.5" />

              {/* Bog'lar */}
              <line x1="70" y1="80" x2="92" y2="80" stroke="#a78bfa" strokeWidth="2" />
              <line x1="108" y1="80" x2="130" y2="80" stroke="#a78bfa" strokeWidth="2" />

              {/* Ichki N atomlari */}
              <circle cx="50" cy="100" r="6" fill="#3b82f6" />
              <text x="50" y="103" fill="white" fontSize="6" textAnchor="middle">N</text>
              
              <circle cx="150" cy="100" r="6" fill="#3b82f6" />
              <text x="150" y="103" fill="white" fontSize="6" textAnchor="middle">N</text>

              {/* Xelat belgisi */}
              <path d="M 50 100 Q 100 130 150 100" fill="none" stroke="#14b8a6" strokeWidth="1.5" strokeDasharray="3,2" />
              <text x="100" y="140" fill="#14b8a6" fontSize="8" textAnchor="middle">
                Tridentat (N,N,N)
              </text>

              <text x="100" y="170" fill="#a78bfa" fontSize="8" textAnchor="middle">
                2,2'-dipirinilamin (dpa)
              </text>
              <text x="100" y="185" fill="#14b8a6" fontSize="7" textAnchor="middle">
                Kengaytirilgan π-sistema, 18 π-e⁻
              </text>
            </svg>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-teal-400 font-bold mb-3">Xususiyatlari:</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Turi:</span>
                <span className="text-teal-400 font-bold">Tridentat (N,N,N)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Xelat atomlari:</span>
                <span className="text-teal-400">3 × N</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Zaryad:</span>
                <span className="text-teal-400">0 (neytral)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">λ<sub>abs</sub>:</span>
                <span className="text-teal-400">~280 nm</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">ε:</span>
                <span className="text-teal-400">~3×10⁴ M⁻¹cm⁻¹</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">T₁ energiya:</span>
                <span className="text-teal-400">~21,000 cm⁻¹</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">π-elektronlar:</span>
                <span className="text-teal-400">18 (uch halqa)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 T₁ energiya va Tb³⁺ mosligi:</p>
          <p className="text-purple-200">
            dpa ning <strong>T₁ ≈ 21,000 cm⁻¹</strong> — Tb³⁺ ⁵D₄ sathidan (<strong>20,500 cm⁻¹</strong>) yuqori →
            <strong> rezonans sharti bajariladi</strong> ✓
            <br/>
            Lekin farq kichik (faqat 500 cm⁻¹) → Eu³⁺ ga nisbatan <strong>samaradorlik biroz past</strong>.
            <br/>
            Shunga qaramay, <strong>3 ta dpa ligand</strong> birgalikda yetarli energiya uzatadi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. ANTENNA EFFEKTI
// ============================================================================
function AntennaEffekti() {
  const [step, setStep] = useState(0)

  const steps = [
    {
      title: "1. dpa yorug'likni yutadi",
      desc: "3 ta dpa ligand UV yorug'likni yutadi (ε ≈ 3×10⁴ M⁻¹cm⁻¹)",
      formula: "3 dpa + hν (280 nm) → 3 dpa* (S₀ → S₁)",
      icon: "💡"
    },
    {
      title: "2. ISC — S₁ → T₁",
      desc: "Og'ir atom effekti (Tb³⁺) tufayli interkombinatsion konversiya tez",
      formula: "dpa* (S₁) → dpa* (T₁)",
      icon: "🔄"
    },
    {
      title: "3. Energiya uzatilishi",
      desc: "3 ta dpa T₁ energiyasi Tb³⁺ ⁵D₄ sathiga uzatiladi",
      formula: "3 dpa* (T₁) + Tb³⁺ → 3 dpa + Tb³⁺* (⁵D₄)",
      icon: "⚡"
    },
    {
      title: "4. Tb³⁺ nurlanishi",
      desc: "Tb³⁺ xarakterli yashil nurlanish chiqaradi (⁵D₄ → ⁷F₅, 545 nm)",
      formula: "Tb³⁺* (⁵D₄) → Tb³⁺ + hν' (545 nm)",
      icon: "✨"
    }
  ]

  const s = steps[step]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📡 Antenna effekti — 3 × dpa → Tb³⁺</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-teal-700/30 space-y-4">
        <div className="bg-teal-600/10 border border-teal-500/30 rounded-lg p-4">
          <p className="text-teal-400 font-bold mb-2">💎 Uchta dpa — kuchli antenna:</p>
          <p className="text-purple-200 text-xs">
            [Tb(dpa)₃]³⁻ da <strong>3 ta dpa ligand</strong> mavjud — har biri xromofor sifatida ishlaydi.
            Har bir dpa <strong>tridentat</strong> (3 ta N atomi orqali bog'lanadi) → Tb³⁺ ning koordinatsion soni 9.
            Kuchli UV yutish va samarali energiya uzatish → <strong>Φ ≈ 0.45</strong> (suvda).
          </p>
        </div>

        {/* STEP NAVIGATION */}
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <button key={i} onClick={() => setStep(i)}
              className={`flex-1 px-2 py-2 rounded-lg text-xs font-bold transition-all ${
                step === i 
                  ? "bg-teal-600/80 text-white shadow-lg" 
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
            <h4 className="text-teal-400 font-bold text-lg">{s.title}</h4>
          </div>
          <p className="text-purple-200 text-sm mb-3">{s.desc}</p>
          <div className="bg-purple-900/50 rounded p-3 font-mono text-xs text-center text-emerald-400">
            {s.formula}
          </div>
        </div>

        {/* VIZUALIZATSIYA */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-teal-400 font-bold text-xs mb-3">Energiya sathlari diagrammasi:</h5>
          <svg viewBox="0 0 400 250" className="w-full h-60">
            <line x1="50" y1="230" x2="50" y2="20" stroke="#4c1d95" strokeWidth="1" />
            <text x="30" y="125" fill="#c4b5fd" fontSize="9" textAnchor="middle" transform="rotate(-90, 30, 125)">
              Energiya
            </text>

            {/* Ligand sathlari */}
            <rect x="80" y="30" width="80" height="20" fill="#3b82f6" opacity="0.3" />
            <text x="120" y="45" fill="#3b82f6" fontSize="9" textAnchor="middle">S₁ (dpa)</text>

            <rect x="80" y="80" width="80" height="20" fill="#8b5cf6" opacity="0.3" />
            <text x="120" y="95" fill="#8b5cf6" fontSize="9" textAnchor="middle">T₁ (dpa)</text>

            <rect x="80" y="200" width="80" height="20" fill="#3b82f6" opacity="0.3" />
            <text x="120" y="215" fill="#3b82f6" fontSize="9" textAnchor="middle">S₀ (dpa)</text>

            {/* Tb³⁺ sathlari */}
            <rect x="240" y="85" width="80" height="20" fill="#14b8a6" opacity="0.3" />
            <text x="280" y="100" fill="#14b8a6" fontSize="9" textAnchor="middle">⁵D₄ (Tb³⁺)</text>

            <rect x="240" y="125" width="80" height="15" fill="#14b8a6" opacity="0.2" />
            <text x="280" y="137" fill="#14b8a6" fontSize="8" textAnchor="middle">⁷F₆</text>

            <rect x="240" y="150" width="80" height="15" fill="#14b8a6" opacity="0.2" />
            <text x="280" y="162" fill="#14b8a6" fontSize="8" textAnchor="middle">⁷F₅</text>

            <rect x="240" y="175" width="80" height="15" fill="#14b8a6" opacity="0.2" />
            <text x="280" y="187" fill="#14b8a6" fontSize="8" textAnchor="middle">⁷F₄</text>

            <rect x="240" y="200" width="80" height="20" fill="#14b8a6" opacity="0.3" />
            <text x="280" y="215" fill="#14b8a6" fontSize="9" textAnchor="middle">⁷F₃</text>

            {/* O'tishlar */}
            <line x1="120" y1="200" x2="120" y2="50" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrowY)" />
            <text x="135" y="125" fill="#fbbf24" fontSize="8">hν (UV)</text>

            <path d="M 160 40 Q 180 60 160 80" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="3,2" />
            <text x="190" y="60" fill="#8b5cf6" fontSize="8">ISC</text>

            <line x1="160" y1="90" x2="240" y2="95" stroke="#14b8a6" strokeWidth="2" markerEnd="url(#arrowG)" />
            <text x="200" y="82" fill="#14b8a6" fontSize="8">Energiya</text>

            <line x1="280" y1="105" x2="280" y2="150" stroke="#14b8a6" strokeWidth="2" markerEnd="url(#arrowG)" />
            <text x="295" y="130" fill="#14b8a6" fontSize="8">hν' (545)</text>

            <defs>
              <marker id="arrowY" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
                <polygon points="0,0 5,2.5 0,5" fill="#fbbf24" />
              </marker>
              <marker id="arrowG" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
                <polygon points="0,0 5,2.5 0,5" fill="#14b8a6" />
              </marker>
            </defs>
          </svg>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Rezonans sharti:</p>
          <p className="text-purple-200">
            <strong>dpa T₁</strong> ≈ 21,000 cm⁻¹ → <strong>Tb³⁺ ⁵D₄</strong> = 20,500 cm⁻¹ → farq = 500 cm⁻¹
            <br/>
            <strong>dpa T₁</strong> ≈ 21,000 cm⁻¹ → <strong>Eu³⁺ ⁵D₀</strong> = 17,250 cm⁻¹ → farq = 3,750 cm⁻¹
            <br/>
            Tb³⁺ uchun farq <strong>kichikroq</strong> → energiya uzatish <strong>biroz kamroq samarali</strong>.
            Lekin 3 ta dpa birgalikda yetarli energiya uzatadi → Φ ≈ 0.45.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. TB³⁺ ENERGIYA SATHLARI
// ============================================================================
function TbEnergyLevels() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚛️ Tb³⁺ energiya sathlari — f-f o'tishlar</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-teal-700/30 space-y-4">
        <div className="bg-teal-600/10 border border-teal-500/30 rounded-lg p-4">
          <p className="text-teal-400 font-bold mb-2">💎 Tb³⁺ — yashil emissiya:</p>
          <p className="text-purple-200 text-xs">
            Tb³⁺ (4f⁸) ning emission spektri <strong>⁵D₄ qo'zg'algan holatidan</strong> boshlanadi.
            Eng kuchli o'tish — <strong>⁵D₄ → ⁷F₅</strong> (545 nm, yashil).
            Bu o'tish <strong>elektr dipol</strong> bo'lib, simmetriyaga sezgir.
          </p>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-teal-400 font-bold text-xs mb-3">Tb³⁺ energiya sathlari:</h5>
          <div className="space-y-2 text-xs">
            <div className="bg-teal-900/20 border border-teal-500/30 rounded p-2">
              <div className="flex justify-between">
                <span className="text-teal-400 font-bold">⁵D₄ → ⁷F₆</span>
                <span className="text-emerald-400 font-mono">490 nm</span>
              </div>
              <p className="text-purple-400 text-[10px] mt-1">Ko'k-yashil, ΔJ = 2, elektr dipol</p>
            </div>
            <div className="bg-teal-900/40 border-2 border-teal-500/70 rounded p-2">
              <div className="flex justify-between">
                <span className="text-teal-400 font-bold">⁵D₄ → ⁷F₅</span>
                <span className="text-emerald-400 font-mono">545 nm</span>
              </div>
              <p className="text-teal-400 text-[10px] mt-1">Eng kuchli, yashil, bioimaging uchun ideal</p>
            </div>
            <div className="bg-purple-900/50 rounded p-2">
              <div className="flex justify-between">
                <span className="text-purple-300 font-bold">⁵D₄ → ⁷F₄</span>
                <span className="text-emerald-400 font-mono">585 nm</span>
              </div>
              <p className="text-purple-400 text-[10px] mt-1">Sariq-yashil, ΔJ = 0</p>
            </div>
            <div className="bg-purple-900/50 rounded p-2">
              <div className="flex justify-between">
                <span className="text-purple-300 font-bold">⁵D₄ → ⁷F₃</span>
                <span className="text-emerald-400 font-mono">620 nm</span>
              </div>
              <p className="text-purple-400 text-[10px] mt-1">Qizil, ΔJ = 1, kuchsiz</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun ⁵D₄ → ⁷F₅ eng kuchli?</p>
          <p className="text-purple-200">
            <strong>ΔJ = 1</strong> — elektr dipol tanlash qoidasiga mos (ΔJ = 0, ±1, lekin 0→0 taqiqlangan).
            <br/>
            <strong>Judd-Ofelt nazariyasi</strong> bo'yicha, Ω₂ parametri katta bo'lganda bu o'tish kuchli.
            <br/>
            [Tb(dpa)₃]³⁻ da past simmetriya → Ω₂ katta → <strong>⁷F₅ o'tishi dominant</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. Φ VA TAU — SUV TA'SIRI
// ============================================================================
function PhiVaTau() {
  const [waterMolecules, setWaterMolecules] = useState(2)

  const phi = Math.max(0.1, 0.45 - waterMolecules * 0.08)
  const tau = Math.max(0.2, 0.9 - waterMolecules * 0.15)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📊 Kvant unumi va yashash vaqti</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-teal-700/30 space-y-4">
        <div className="bg-teal-600/10 border border-teal-500/30 rounded-lg p-4">
          <p className="text-teal-400 font-bold mb-2">💎 Suv ta'siri:</p>
          <p className="text-purple-200 text-xs">
            [Tb(dpa)₃]³⁻ suvda eriydi, lekin suv molekulalari <strong>O-H tebranishlari</strong> orqali
            energiyani o'g'irlaydi. Natijada Φ va τ kamayadi.
            Odatda <strong>2 ta suv molekulasi</strong> koordinatsionlangan.
          </p>
        </div>

        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">Koordinatsionlangan suv molekulalari:</span>
            <span className="text-emerald-400 font-mono">{waterMolecules}</span>
          </label>
          <input type="range" min="0" max="5" step="1" value={waterMolecules}
            onChange={(e) => setWaterMolecules(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-teal-500" />
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-center">
          <div className="bg-teal-900/30 border border-teal-500/50 rounded-lg p-3">
            <p className="text-teal-400">Kvant unumi (Φ)</p>
            <p className="text-emerald-400 font-bold font-mono text-2xl">{phi.toFixed(2)}</p>
            <p className="text-purple-400 text-[10px]">{phi > 0.35 ? "✓ Yaxshi" : phi > 0.2 ? "○ O'rtacha" : "✗ Past"}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Yashash vaqti (τ)</p>
            <p className="text-emerald-400 font-bold font-mono text-2xl">{tau.toFixed(2)} ms</p>
            <p className="text-purple-400 text-[10px]">{tau > 0.7 ? "✓ Uzoq" : tau > 0.4 ? "○ O'rtacha" : "✗ Qisqa"}</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Tb³⁺ vs Eu³⁺ — suv ta'siri:</p>
          <p className="text-purple-200">
            <strong>Tb³⁺</strong> — O-H tebranishlari bilan rezonans <strong>kamroq</strong> → suv ta'siri kamroq
            <br/>
            <strong>Eu³⁺</strong> — O-H tebranishlari bilan rezonans <strong>ko'proq</strong> → suv ta'siri kuchli
            <br/>
            Shuning uchun Tb³⁺ komplekslari <strong>suvda barqarorroq</strong> va Φ yuqoriroq.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 6. EU vs TB dpa SOLISHTIRISH
// ============================================================================
function EuVsTbSolishtirish() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 [Eu(dpa)₃]³⁻ vs [Tb(dpa)₃]³⁻ — solishtirish</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-teal-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-2 text-yellow-400">Xususiyat</th>
                <th className="text-center py-3 px-2 text-rose-400">[Eu(dpa)₃]³⁻</th>
                <th className="text-center py-3 px-2 text-teal-400">[Tb(dpa)₃]³⁻</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["Metal", "Eu³⁺ (4f⁶)", "Tb³⁺ (4f⁸)"],
                ["Asosiy emissiya", "615 nm (qizil)", "545 nm (yashil)"],
                ["O'tish", "⁵D₀ → ⁷F₂", "⁵D₄ → ⁷F₅"],
                ["Φ (suvda)", "0.30", "0.45"],
                ["τ (suvda)", "0.5 ms", "0.9 ms"],
                ["Stokes siljishi", "~335 nm", "~265 nm"],
                ["Suv ta'siri", "Kuchli", "O'rtacha"],
                ["Bioimaging", "Chuqur to'qima", "Yuqori kontrast"],
                ["Autofluoressensiya", "O'rtacha fon", "Minimal fon"],
                ["Qo'llanilish", "DELIA, sensorlar", "TRF, bioimaging"],
              ].map((r, i) => (
                <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-2 px-2 font-bold text-purple-300">{r[0]}</td>
                  <td className="py-2 px-2 text-center text-rose-400">{r[1]}</td>
                  <td className="py-2 px-2 text-center text-teal-400">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-rose-900/20 border border-rose-500/30 rounded-lg p-3 text-xs">
            <p className="text-rose-400 font-bold mb-1">Eu³⁺ afzalligi:</p>
            <p className="text-purple-200">
              Katta Stokes siljishi → o'z-o'zini yutish kam
              <br/>
              Qizil nur → chuqur to'qima o'tishi
            </p>
          </div>
          <div className="bg-teal-900/20 border border-teal-500/30 rounded-lg p-3 text-xs">
            <p className="text-teal-400 font-bold mb-1">Tb³⁺ afzalligi:</p>
            <p className="text-purple-200">
              Yuqori Φ va τ → yuqori sezgirlik
              <br/>
              Yashil emissiya → minimal autofluoressensiya
            </p>
          </div>
        </div>

        <div className="mt-4 bg-teal-600/10 border border-teal-500/30 rounded-lg p-3 text-xs">
          <p className="text-teal-400 font-bold mb-1">💡 Multiplex imaging:</p>
          <p className="text-purple-200">
            [Eu(dpa)₃]³⁻ (qizil) va [Tb(dpa)₃]³⁻ (yashil) bir vaqtda ishlatilsa →
            <strong> ikki rangli tasvir</strong> (multiplex). Bir namuna ichida
            <strong> ikki xil nishonni</strong> bir vaqtda ko'rish mumkin.
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

      <div className="bg-purple-800/30 rounded-xl p-5 border border-teal-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🔬</div>
            <h4 className="text-teal-400 font-bold mb-2">Bioimaging (TRF)</h4>
            <p className="text-purple-200 text-xs">
              Yashil emissiya (545 nm) — autofluoressensiya minimal.
              <br/>
              τ ≈ 0.9 ms — vaqt-ajraladigan tahlil uchun ideal.
              <br/>
              Hujayra va to'qimalarni yuqori kontrast bilan ko'rish.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🧬</div>
            <h4 className="text-teal-400 font-bold mb-2">Multiplex tahlil</h4>
            <p className="text-purple-200 text-xs">
              [Eu(dpa)₃]³⁻ (qizil) + [Tb(dpa)₃]³⁻ (yashil) = ikki rangli tasvir.
              <br/>
              Bir namuna ichida bir nechta nishonni aniqlash.
              <br/>
              Diagnostikada keng qo'llaniladi.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🧪</div>
            <h4 className="text-teal-400 font-bold mb-2">Ion sensorlari</h4>
            <p className="text-purple-200 text-xs">
              Tb³⁺ emissiyasi pH, metall ionlari, anionlarga sezgir.
              <br/>
              Signal o'zgarishi (yoqish/o'chirish) orqali analit aniqlanadi.
              <br/>
              Past konsentratsiyalarda ham ishlaydi.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">📱</div>
            <h4 className="text-teal-400 font-bold mb-2">Yashil OLED</h4>
            <p className="text-purple-200 text-xs">
              Tb³⁺ tor chiziqli spektri → yuqori rang tozaligi.
              <br/>
              Φ ≈ 0.45 → yaxshi samaradorlik.
              <br/>
              NTSC standartiga mos yashil rang.
            </p>
          </div>
        </div>

        <div className="bg-teal-600/10 border border-teal-500/30 rounded-lg p-4">
          <p className="text-teal-400 font-bold mb-2">🌟 Qiziqarli fakt:</p>
          <p className="text-purple-200 text-xs">
            [Tb(dpa)₃]³⁻ ning yashil emissiyasi <strong>ko'zga juda yoqimli</strong> —
            inson ko'zi yashil rangga eng sezgir (555 nm).
            <br/>
            Bu <strong>displey texnologiyalarida</strong> va <strong>biologik tasvirlashda</strong> muhim afzallik.
            <br/>
            UV nur ostida [Tb(dpa)₃]³⁻ <strong>yorqin yashil rangda porlaydi</strong>!
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function TbDpa3Fluoressensiya() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">

      <header className="flex flex-col gap-2 px-6 py-4 border-b border-purple-800/50">
        <nav className="flex items-center gap-2 text-sm flex-wrap" aria-label="Breadcrumb">
          <Link href="/" className="text-purple-400 hover:text-purple-300">🏠</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil" className="text-purple-400 hover:text-purple-300">Tahlil</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil/fluoressensiya" className="text-purple-400 hover:text-purple-300">Fluoressensiya</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil/fluoressensiya/birikmalar" className="text-purple-400 hover:text-purple-300">Birikmalar</Link>
          <span className="text-purple-600">›</span>
          <span className="text-teal-400">[Tb(dpa)₃]³⁻</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-teal-400">💡 [Tb(dpa)₃]³⁻ — Fluoressensiya tahlili</h1>
          <p className="text-purple-400 text-sm">
            Tb³⁺ • Suvda eruvchan • Yashil emissiya • Φ ≈ 0.45 • τ ≈ 0.9 ms • Bioimaging
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-teal-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-4xl md:text-5xl font-extrabold font-mono text-teal-400">[Tb(dpa)₃]³⁻</span>
            <div>
              <h2 className="text-xl font-bold text-white">Fluoressensiya tahlili — to'liq profil</h2>
              <p className="text-purple-400">"Suvda eruvchan yashil emitter" — bioimaging klassikasi</p>
            </div>
          </div>

          <div className="bg-teal-600/10 border border-teal-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              [Tb(dpa)₃]³⁻ — <strong className="text-teal-400">suvda eruvchan lantanid kompleksi</strong>.
              Tb³⁺ (4f⁸) <strong>uchta dpa ligand</strong> bilan o'ralgan — antenna effekti orqali
              energiya Tb³⁺ ga uzatiladi. Natijada <strong>yashil emissiya</strong> (545 nm, ⁵D₄ → ⁷F₅) hosil bo'ladi.
              <strong> Φ ≈ 0.45</strong> va <strong>τ ≈ 0.9 ms</strong> — suvda eruvchan komplekslar uchun yuqori ko'rsatkichlar.
              Yashil emissiya <strong>bioimaging</strong> uchun ideal — autofluoressensiya minimal.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-teal-400 font-bold text-lg">Tb³⁺ (4f⁸)</p>
              <p className="text-purple-300">lantanid</p>
              <p className="text-purple-400 mt-1">S = 3</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-teal-400 font-bold text-lg">λ<sub>em</sub> = 545</p>
              <p className="text-purple-300">nm</p>
              <p className="text-purple-400 mt-1">yashil</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-teal-400 font-bold text-lg">Φ ≈ 0.45</p>
              <p className="text-purple-300">kvant unumi</p>
              <p className="text-purple-400 mt-1">(suvda)</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-teal-400 font-bold text-lg">τ ≈ 0.9</p>
              <p className="text-purple-300">ms</p>
              <p className="text-purple-400 mt-1">TRF uchun</p>
            </div>
          </div>
        </div>

        {/* EMISSION SPEKTR SIMULYATORI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <EmissionSpectrumSimulator />
        </div>

        {/* DPA LIGAND */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <DpaLigand />
        </div>

        {/* ANTENNA EFFEKTI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <AntennaEffekti />
        </div>

        {/* TB ENERGY LEVELS */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <TbEnergyLevels />
        </div>

        {/* PHI VA TAU */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <PhiVaTau />
        </div>

        {/* EU vs TB */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <EuVsTbSolishtirish />
        </div>

        {/* QO'LLANILISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <Qollanilish />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-teal-600/10 to-purple-600/10 border border-teal-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>[Tb(dpa)₃]³⁻ — <strong className="text-teal-400">suvda eruvchan anion kompleks</strong></li>
            <li>Tb³⁺ (4f⁸) — <strong>yashil emissiya</strong> (545 nm, ⁵D₄ → ⁷F₅)</li>
            <li><strong>Antenna effekti</strong> — 3 ta dpa ligand energiya uzatadi</li>
            <li><strong>Φ ≈ 0.45</strong> (suvda) — suvda eruvchan komplekslar uchun yuqori</li>
            <li><strong>τ ≈ 0.9 ms</strong> — vaqt-ajraladigan tahlil uchun ideal</li>
            <li><strong>Yashil emissiya</strong> — bioimaging uchun ideal (autofluoressensiya minimal)</li>
            <li><strong>Suvda kvenching</strong> — Eu³⁺ dan kamroq ta'sir qiladi</li>
            <li><strong>Multiplex</strong> — [Eu(dpa)₃]³⁻ bilan birga ikki rangli tasvir</li>
            <li>Qo'llanilish: bioimaging, TRF, sensorlar, yashil OLED</li>
            <li>Judd-Ofelt nazariyasi — ⁵D₄ → ⁷F₅ dominant o'tish</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/fluoressensiya/birikmalar/eu-dpa3" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← [Eu(dpa)₃]³⁻
          </Link>
          <Link href="/ilmiy/tahlil/fluoressensiya/birikmalar/ru-bpy3" className="px-6 py-3 bg-teal-600/80 rounded-xl hover:bg-teal-500 text-white font-semibold">
            [Ru(bpy)₃]²⁺ →
          </Link>
        </div>

      </section>
    </main>
  )
}