"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. EMISSION SPEKTR SIMULYATORI ([Tb(acac)₃(phen)] uchun)
// ============================================================================
function EmissionSpectrumSimulator() {
  const [excitation, setExcitation] = useState(300)
  const [intensity, setIntensity] = useState(100)
  const [showPeaks, setShowPeaks] = useState(true)

  // Tb³⁺ ning xarakterli emission cho'qqilari
  const peaks = [
    { lambda: 490, intensity: 0.30, assign: "⁵D₄ → ⁷F₆", type: "ko'k-yashil" },
    { lambda: 545, intensity: 1.0, assign: "⁵D₄ → ⁷F₅", type: "yashil (eng kuchli)" },
    { lambda: 585, intensity: 0.40, assign: "⁵D₄ → ⁷F₄", type: "sariq-yashil" },
    { lambda: 620, intensity: 0.20, assign: "⁵D₄ → ⁷F₃", type: "qizil" },
  ]

  const intFactor = intensity / 100

  // Emission spektri
  const spectrum = useMemo(() => {
    const points = []
    for (let i = 0; i < 400; i++) {
      const lambda = 450 + i * 0.625 // 450-700 nm
      let emission = 0

      peaks.forEach(peak => {
        // Lantanidlar uchun tor cho'qqilar (FWHM ≈ 3 nm)
        const x = (lambda - peak.lambda) / 1.5
        emission += peak.intensity * Math.exp(-0.5 * x * x) * intFactor
      })

      points.push({ lambda, emission })
    }
    return points
  }, [intensity, intFactor])

  const maxEmission = Math.max(...spectrum.map(p => p.emission), 0.1)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">💡 Emission spektr simulyatori — [Tb(acac)₃(phen)]</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-emerald-700/30 space-y-4">
        <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-lg p-4">
          <p className="text-emerald-400 font-bold mb-2">💎 Tb³⁺ — yashil emissiya klassikasi:</p>
          <p className="text-purple-200 text-xs">
            Terbiy(III) komplekslari <strong>yashil emissiya</strong> bilan ajralib turadi.
            Eng kuchli cho'qqi — <strong>⁵D₄ → ⁷F₅</strong> (545 nm). Bu cho'qqi <strong>elektr dipol</strong> o'tishi
            bo'lib, bioimaging uchun ideal — to'qimalarning avtomatik fluoressensiyasi (autofluoressensiya) bu sohada minimal.
          </p>
        </div>

        {/* BOSHQARUV */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">Qo'zg'alish to'lqin uzunligi:</span>
              <span className="text-emerald-400 font-mono">{excitation} nm</span>
            </label>
            <input type="range" min="250" max="400" step="5" value={excitation}
              onChange={(e) => setExcitation(parseInt(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-emerald-500" />
            <p className="text-purple-400 text-[10px] mt-1">
              Optimal: 300 nm (acac ligand yutishi)
            </p>
          </div>
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">Intensivlik:</span>
              <span className="text-emerald-400 font-mono">{intensity}%</span>
            </label>
            <input type="range" min="10" max="100" step="5" value={intensity}
              onChange={(e) => setIntensity(parseInt(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-emerald-500" />
          </div>
        </div>

        <label className="flex items-center gap-2 text-xs cursor-pointer">
          <input type="checkbox" checked={showPeaks}
            onChange={(e) => setShowPeaks(e.target.checked)}
            className="accent-emerald-500" />
          <span className="text-purple-300">Cho'qqi belgilarini ko'rsatish</span>
        </label>

        {/* SPEKTR */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-emerald-400 font-bold text-xs mb-2">
            Emission spektri (λ<sub>exc</sub> = {excitation} nm)
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
              fill="none" stroke="#10b981" strokeWidth="2"
            />

            <text x="200" y="35" fill="#10b981" fontSize="9" textAnchor="middle" fontWeight="bold">
              Tb³⁺ — yashil emissiya (545 nm)
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          <div className="bg-emerald-900/30 border border-emerald-500/50 rounded-lg p-3">
            <p className="text-emerald-400">Asosiy cho'qqi</p>
            <p className="text-emerald-400 font-bold">545 nm</p>
            <p className="text-purple-400 text-[10px]">⁵D₄ → ⁷F₅</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Ikkinchi cho'qqi</p>
            <p className="text-emerald-400 font-bold">490 nm</p>
            <p className="text-purple-400 text-[10px]">⁵D₄ → ⁷F₆</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Uchinchi cho'qqi</p>
            <p className="text-emerald-400 font-bold">585 nm</p>
            <p className="text-purple-400 text-[10px]">⁵D₄ → ⁷F₄</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun yashil emissiya bioimaging uchun ideal?</p>
          <p className="text-purple-200">
            Biologik to'qimalarning <strong>autofluoressensiyasi</strong> asosan <strong>ko'k</strong> (400-450 nm) va
            <strong> qizil</strong> (600-650 nm) sohada.
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
// 2. ANTENNA EFFEKTI — BATAFSIL
// ============================================================================
function AntennaEffekti() {
  const [step, setStep] = useState(0)

  const steps = [
    {
      title: "1. Ligand yorug'likni yutadi",
      desc: "acac va phen ligandlar UV yorug'likni yutadi (ε ≈ 10⁴ M⁻¹cm⁻¹)",
      formula: "L + hν (300 nm) → L* (S₀ → S₁)",
      icon: "💡"
    },
    {
      title: "2. ISC — S₁ → T₁",
      desc: "Og'ir atom effekti (Tb³⁺) tufayli interkombinatsion konversiya tez",
      formula: "L* (S₁) → L* (T₁)",
      icon: "🔄"
    },
    {
      title: "3. Energiya uzatilishi",
      desc: "Ligand T₁ energiyasi Tb³⁺ ⁵D₄ sathiga uzatiladi (rezonans)",
      formula: "L* (T₁) + Tb³⁺ → L + Tb³⁺* (⁵D₄)",
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
      <h3 className="text-white font-semibold">📡 Antenna effekti — acac + phen → Tb³⁺</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-emerald-700/30 space-y-4">
        <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-lg p-4">
          <p className="text-emerald-400 font-bold mb-2">💎 Ikki ligandli antenna:</p>
          <p className="text-purple-200 text-xs">
            [Tb(acac)₃(phen)] da <strong>ikkita xromofor ligand</strong> mavjud:
            <br/>
            • <strong>acac</strong> (atsetilasetonat) — β-diketonat, kuchli UV yutish
            <br/>
            • <strong>phen</strong> (1,10-fenantrolin) — kengaytirilgan π-sistema, qo'shimcha yutish
            <br/>
            Ikkalasi birgalikda Tb³⁺ ga energiya uzatadi — bu <strong>sinergetik antenna effekti</strong>.
          </p>
        </div>

        {/* STEP NAVIGATION */}
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <button key={i} onClick={() => setStep(i)}
              className={`flex-1 px-2 py-2 rounded-lg text-xs font-bold transition-all ${
                step === i 
                  ? "bg-emerald-600/80 text-white shadow-lg" 
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
            <h4 className="text-emerald-400 font-bold text-lg">{s.title}</h4>
          </div>
          <p className="text-purple-200 text-sm mb-3">{s.desc}</p>
          <div className="bg-purple-900/50 rounded p-3 font-mono text-xs text-center text-emerald-400">
            {s.formula}
          </div>
        </div>

        {/* VIZUALIZATSIYA */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-emerald-400 font-bold text-xs mb-3">Energiya sathlari diagrammasi:</h5>
          <svg viewBox="0 0 400 250" className="w-full h-60">
            {/* Energiya o'qi */}
            <line x1="50" y1="230" x2="50" y2="20" stroke="#4c1d95" strokeWidth="1" />
            <text x="30" y="125" fill="#c4b5fd" fontSize="9" textAnchor="middle" transform="rotate(-90, 30, 125)">
              Energiya
            </text>

            {/* Ligand sathlari */}
            <rect x="80" y="30" width="80" height="20" fill="#3b82f6" opacity="0.3" />
            <text x="120" y="45" fill="#3b82f6" fontSize="9" textAnchor="middle">S₁ (ligand)</text>

            <rect x="80" y="80" width="80" height="20" fill="#8b5cf6" opacity="0.3" />
            <text x="120" y="95" fill="#8b5cf6" fontSize="9" textAnchor="middle">T₁ (ligand)</text>

            <rect x="80" y="200" width="80" height="20" fill="#3b82f6" opacity="0.3" />
            <text x="120" y="215" fill="#3b82f6" fontSize="9" textAnchor="middle">S₀ (ligand)</text>

            {/* Tb³⁺ sathlari */}
            <rect x="240" y="70" width="80" height="20" fill="#10b981" opacity="0.3" />
            <text x="280" y="85" fill="#10b981" fontSize="9" textAnchor="middle">⁵D₄ (Tb³⁺)</text>

            <rect x="240" y="120" width="80" height="15" fill="#10b981" opacity="0.2" />
            <text x="280" y="132" fill="#10b981" fontSize="8" textAnchor="middle">⁷F₆</text>

            <rect x="240" y="145" width="80" height="15" fill="#10b981" opacity="0.2" />
            <text x="280" y="157" fill="#10b981" fontSize="8" textAnchor="middle">⁷F₅</text>

            <rect x="240" y="170" width="80" height="15" fill="#10b981" opacity="0.2" />
            <text x="280" y="182" fill="#10b981" fontSize="8" textAnchor="middle">⁷F₄</text>

            <rect x="240" y="200" width="80" height="20" fill="#10b981" opacity="0.3" />
            <text x="280" y="215" fill="#10b981" fontSize="9" textAnchor="middle">⁷F₃</text>

            {/* O'tishlar */}
            <line x1="120" y1="200" x2="120" y2="50" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrowYellow)" />
            <text x="135" y="125" fill="#fbbf24" fontSize="8">hν (UV)</text>

            <path d="M 160 40 Q 180 60 160 80" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="3,2" />
            <text x="190" y="60" fill="#8b5cf6" fontSize="8">ISC</text>

            <line x1="160" y1="90" x2="240" y2="80" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowGreen)" />
            <text x="200" y="75" fill="#10b981" fontSize="8">Energiya</text>

            <line x1="280" y1="90" x2="280" y2="145" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowGreen)" />
            <text x="295" y="120" fill="#10b981" fontSize="8">hν' (545 nm)</text>

            <defs>
              <marker id="arrowYellow" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
                <polygon points="0,0 5,2.5 0,5" fill="#fbbf24" />
              </marker>
              <marker id="arrowGreen" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
                <polygon points="0,0 5,2.5 0,5" fill="#10b981" />
              </marker>
            </defs>
          </svg>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Rezonans sharti:</p>
          <p className="text-purple-200">
            Ligand T₁ energiyasi <strong>Tb³⁺ ⁵D₄ sathidan yuqori</strong> bo'lishi kerak:
            <br/>
            • <strong>Tb³⁺</strong> ⁵D₄ = 20,500 cm⁻¹ (~488 nm)
            <br/>
            • <strong>acac T₁</strong> ≈ 21,000 cm⁻¹ → rezonans bajariladi ✓
            <br/>
            • <strong>phen T₁</strong> ≈ 22,000 cm⁻¹ → rezonans bajariladi ✓
            <br/>
            Eu³⁺ dan farqli o'laroq, Tb³⁺ uchun <strong>yuqoriroq T₁</strong> kerak.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. LIGAND STRUKTURASI
// ============================================================================
function LigandStrukturasi() {
  const [ligand, setLigand] = useState("acac")

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔗 Ligandlar strukturasi — acac va phen</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-emerald-700/30 space-y-4">
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button onClick={() => setLigand("acac")}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              ligand === "acac" 
                ? "bg-emerald-600/80 text-white shadow-lg" 
                : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
            }`}>
            acac (atsetilasetonat)
          </button>
          <button onClick={() => setLigand("phen")}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              ligand === "phen" 
                ? "bg-emerald-600/80 text-white shadow-lg" 
                : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
            }`}>
            phen (1,10-fenantrolin)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-emerald-400 font-bold mb-3">
              {ligand === "acac" ? "acac strukturasi" : "phen strukturasi"}
            </h4>
            <svg viewBox="0 0 200 180" className="w-full h-44">
              {ligand === "acac" ? (
                <>
                  {/* β-diketonat strukturasi */}
                  <line x1="40" y1="90" x2="80" y2="90" stroke="#a78bfa" strokeWidth="2" />
                  <line x1="80" y1="90" x2="120" y2="90" stroke="#a78bfa" strokeWidth="2" />
                  <line x1="120" y1="90" x2="160" y2="90" stroke="#a78bfa" strokeWidth="2" />

                  {/* C atomlari */}
                  <circle cx="40" cy="90" r="6" fill="#6b7280" />
                  <circle cx="80" cy="90" r="6" fill="#6b7280" />
                  <circle cx="120" cy="90" r="6" fill="#6b7280" />
                  <circle cx="160" cy="90" r="6" fill="#6b7280" />

                  {/* O atomlari */}
                  <line x1="80" y1="90" x2="80" y2="50" stroke="#ef4444" strokeWidth="2" />
                  <circle cx="80" cy="50" r="6" fill="#ef4444" />
                  
                  <line x1="120" y1="90" x2="120" y2="50" stroke="#ef4444" strokeWidth="2" />
                  <circle cx="120" cy="50" r="6" fill="#ef4444" />

                  {/* CH₃ guruhlar */}
                  <text x="30" y="80" fill="#10b981" fontSize="7">H₃C</text>
                  <text x="165" y="80" fill="#10b981" fontSize="7">CH₃</text>

                  <text x="100" y="150" fill="#a78bfa" fontSize="8" textAnchor="middle">
                    β-diketonat (O,O-xelat)
                  </text>
                  <text x="100" y="165" fill="#ef4444" fontSize="7" textAnchor="middle">
                    Kuchli xromofor
                  </text>
                </>
              ) : (
                <>
                  {/* Fenantrolin - 3 halqa */}
                  <polygon points="40,70 60,60 80,70 80,90 60,100 40,90" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
                  <polygon points="80,70 100,60 120,70 120,90 100,100 80,90" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
                  <polygon points="120,70 140,60 160,70 160,90 140,100 120,90" fill="none" stroke="#a78bfa" strokeWidth="1.5" />

                  {/* N atomlari */}
                  <circle cx="60" cy="100" r="6" fill="#3b82f6" />
                  <text x="60" y="103" fill="white" fontSize="6" textAnchor="middle">N</text>
                  
                  <circle cx="140" cy="100" r="6" fill="#3b82f6" />
                  <text x="140" y="103" fill="white" fontSize="6" textAnchor="middle">N</text>

                  <text x="100" y="130" fill="#a78bfa" fontSize="8" textAnchor="middle">
                    1,10-fenantrolin (N,N-xelat)
                  </text>
                  <text x="100" y="145" fill="#3b82f6" fontSize="7" textAnchor="middle">
                    Kengaytirilgan π-sistema
                  </text>
                  <text x="100" y="160" fill="#f59e0b" fontSize="7" textAnchor="middle">
                    14 π-elektron
                  </text>
                </>
              )}
            </svg>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-emerald-400 font-bold mb-3">Xususiyatlari:</h4>
            {ligand === "acac" ? (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between bg-purple-900/50 rounded p-2">
                  <span className="text-purple-300">Turi:</span>
                  <span className="text-emerald-400 font-bold">β-diketonat</span>
                </div>
                <div className="flex justify-between bg-purple-900/50 rounded p-2">
                  <span className="text-purple-300">Xelat atomlari:</span>
                  <span className="text-emerald-400">2 × O (O,O)</span>
                </div>
                <div className="flex justify-between bg-purple-900/50 rounded p-2">
                  <span className="text-purple-300">Zaryad:</span>
                  <span className="text-emerald-400">1−</span>
                </div>
                <div className="flex justify-between bg-purple-900/50 rounded p-2">
                  <span className="text-purple-300">λ<sub>abs</sub>:</span>
                  <span className="text-emerald-400">~300 nm</span>
                </div>
                <div className="flex justify-between bg-purple-900/50 rounded p-2">
                  <span className="text-purple-300">ε:</span>
                  <span className="text-emerald-400">~10⁴ M⁻¹cm⁻¹</span>
                </div>
                <div className="flex justify-between bg-purple-900/50 rounded p-2">
                  <span className="text-purple-300">T₁ energiya:</span>
                  <span className="text-emerald-400">~21,000 cm⁻¹</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between bg-purple-900/50 rounded p-2">
                  <span className="text-purple-300">Turi:</span>
                  <span className="text-blue-400 font-bold">Diimin</span>
                </div>
                <div className="flex justify-between bg-purple-900/50 rounded p-2">
                  <span className="text-purple-300">Xelat atomlari:</span>
                  <span className="text-blue-400">2 × N (N,N)</span>
                </div>
                <div className="flex justify-between bg-purple-900/50 rounded p-2">
                  <span className="text-purple-300">Zaryad:</span>
                  <span className="text-blue-400">0 (neytral)</span>
                </div>
                <div className="flex justify-between bg-purple-900/50 rounded p-2">
                  <span className="text-purple-300">λ<sub>abs</sub>:</span>
                  <span className="text-blue-400">~270 nm</span>
                </div>
                <div className="flex justify-between bg-purple-900/50 rounded p-2">
                  <span className="text-purple-300">ε:</span>
                  <span className="text-blue-400">~2×10⁴ M⁻¹cm⁻¹</span>
                </div>
                <div className="flex justify-between bg-purple-900/50 rounded p-2">
                  <span className="text-purple-300">T₁ energiya:</span>
                  <span className="text-blue-400">~22,000 cm⁻¹</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun ikkala ligand kerak?</p>
          <p className="text-purple-200">
            <strong>acac</strong> — kuchli UV yutish, Tb³⁺ ga yaqin joylashgan (3 ta)
            <br/>
            <strong>phen</strong> — qo'shimcha yutish, kompleks barqarorligini oshiradi, suv molekulalarini chetlashtiradi
            <br/>
            <strong>Sinergetik effekt</strong> — ikkalasi birgalikda Φ ni oshiradi.
            <br/>
            phen bo'lmasa, suv molekulalari Tb³⁺ ga yaqinlashib, nurlanishni o'chiradi (kvenching).
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

      <div className="bg-purple-800/30 rounded-xl p-5 border border-emerald-700/30 space-y-4">
        <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-lg p-4">
          <p className="text-emerald-400 font-bold mb-2">💎 f-f o'tishlar — xarakterli chiziqli spektr:</p>
          <p className="text-purple-200 text-xs">
            Tb³⁺ ning 4f elektronlari <strong>5s va 5p qobiqlari</strong> bilan himoyalangan →
            ligand maydoni ta'siri kuchsiz → <strong>tor chiziqli spektr</strong> (FWHM ≈ 3 nm).
            Bu lantanidlar uchun xarakterli xususiyat.
          </p>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-emerald-400 font-bold text-xs mb-3">Tb³⁺ energiya sathlari va o'tishlar:</h5>
          <div className="space-y-2 text-xs">
            <div className="bg-emerald-900/30 border border-emerald-500/50 rounded p-2">
              <div className="flex justify-between">
                <span className="text-emerald-400 font-bold">⁵D₄ → ⁷F₆</span>
                <span className="text-emerald-400 font-mono">490 nm</span>
              </div>
              <p className="text-purple-400 text-[10px] mt-1">Ko'k-yashil o'tish, o'rtacha intensivlik</p>
            </div>
            <div className="bg-emerald-900/40 border-2 border-emerald-500/70 rounded p-2">
              <div className="flex justify-between">
                <span className="text-emerald-400 font-bold">⁵D₄ → ⁷F₅</span>
                <span className="text-emerald-400 font-mono">545 nm</span>
              </div>
              <p className="text-emerald-400 text-[10px] mt-1">Elektr dipol — eng kuchli, yashil emissiya, bioimaging uchun ideal</p>
            </div>
            <div className="bg-purple-900/50 rounded p-2">
              <div className="flex justify-between">
                <span className="text-purple-300 font-bold">⁵D₄ → ⁷F₄</span>
                <span className="text-emerald-400 font-mono">585 nm</span>
              </div>
              <p className="text-purple-400 text-[10px] mt-1">Sariq-yashil o'tish, o'rtacha intensivlik</p>
            </div>
            <div className="bg-purple-900/50 rounded p-2">
              <div className="flex justify-between">
                <span className="text-purple-300 font-bold">⁵D₄ → ⁷F₃</span>
                <span className="text-emerald-400 font-mono">620 nm</span>
              </div>
              <p className="text-purple-400 text-[10px] mt-1">Qizil o'tish, kuchsiz</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Tanlash qoidalari:</p>
          <p className="text-purple-200">
            <strong>⁵D₄ → ⁷F₅</strong> — ΔJ = 1 — elektr dipol o'tishi, simmetriyaga sezgir
            <br/>
            <strong>⁵D₄ → ⁷F₆</strong> — ΔJ = 2 — elektr dipol o'tishi
            <br/>
            [Tb(acac)₃(phen)] da markaziy simmetriya yo'q → <strong>⁷F₅ o'tishi kuchli</strong> → yashil emissiya dominant.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. KVANT UNUMI VA YASHASH VAQTI
// ============================================================================
function PhiVaTau() {
  const [waterMolecules, setWaterMolecules] = useState(0)

  // suv molekulalari soniga bog'liq Φ va τ
  const phi = Math.max(0.2, 0.75 - waterMolecules * 0.12)
  const tau = Math.max(0.3, 1.2 - waterMolecules * 0.18)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📊 Kvant unumi va yashash vaqti — suv ta'siri</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-emerald-700/30 space-y-4">
        <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-lg p-4">
          <p className="text-emerald-400 font-bold mb-2">💎 Eng yuqori Φ lantanid:</p>
          <p className="text-purple-200 text-xs">
            [Tb(acac)₃(phen)] — <strong>lantanidlar orasida eng yuqori kvant unumi</strong> (Φ ≈ 0.75).
            Sababi: acac ligand <strong>yuqori T₁ energiya</strong>ga ega → Tb³⁺ ⁵D₄ sathiga samarali energiya uzatadi.
            phen ligand <strong>suv molekulalarini chetlashtiradi</strong> → kvenching minimal.
          </p>
        </div>

        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">Koordinatsionlangan suv molekulalari soni:</span>
            <span className="text-emerald-400 font-mono">{waterMolecules}</span>
          </label>
          <input type="range" min="0" max="4" step="1" value={waterMolecules}
            onChange={(e) => setWaterMolecules(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-emerald-500" />
          <div className="flex justify-between text-[10px] text-purple-400 mt-1">
            <span>0 (phen bilan to'ldirilgan)</span>
            <span>4 (suvda erigan)</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-center">
          <div className="bg-emerald-900/30 border border-emerald-500/50 rounded-lg p-3">
            <p className="text-emerald-400">Kvant unumi (Φ)</p>
            <p className="text-emerald-400 font-bold font-mono text-2xl">{phi.toFixed(2)}</p>
            <p className="text-purple-400 text-[10px]">{phi > 0.6 ? "✓ Juda yuqori" : phi > 0.4 ? "○ Yuqori" : "✗ O'rtacha"}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Yashash vaqti (τ)</p>
            <p className="text-emerald-400 font-bold font-mono text-2xl">{tau.toFixed(2)} ms</p>
            <p className="text-purple-400 text-[10px]">{tau > 1.0 ? "✓ Juda uzoq" : tau > 0.6 ? "○ Uzoq" : "✗ O'rtacha"}</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun Tb³⁺ Eu³⁺ dan yuqori Φ?</p>
          <p className="text-purple-200">
            <strong>Tb³⁺ ⁵D₄</strong> sathidan pastroq energiyali sathlar yo'q → <strong>ichki konversiya kam</strong>.
            <br/>
            <strong>Eu³⁺ ⁵D₀</strong> sathidan pastroq sathlar bor → ichki konversiya mumkin → Φ pastroq.
            <br/>
            Shuning uchun Tb³⁺ komplekslari <strong>eng yuqori Φ</strong> ga ega.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 6. SOLISHTIRISH - BOSHQA TB KOMPLEKSLARI
// ============================================================================
function Solishtirish() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 Boshqa Tb³⁺ komplekslari bilan solishtirish</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-emerald-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-2 text-yellow-400">Kompleks</th>
                <th className="text-center py-3 px-2 text-yellow-400">Ligandlar</th>
                <th className="text-center py-3 px-2 text-yellow-400">Φ</th>
                <th className="text-center py-3 px-2 text-yellow-400">τ (ms)</th>
                <th className="text-center py-3 px-2 text-yellow-400">n(H₂O)</th>
                <th className="text-left py-3 px-2 text-yellow-400">Izoh</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["[Tb(acac)₃(phen)]", "acac + phen", "0.75", "1.2", "0", "Eng yuqori Φ, antenna effekti"],
                ["[Tb(acac)₃(H₂O)₂]", "acac + H₂O", "0.35", "0.6", "2", "Suv molekulalari kvenching"],
                ["[Tb(dpa)₃]³⁻", "dpa", "0.45", "0.9", "1", "Suvda eruvchan"],
                ["[Tb(bpy)(NO₃)₃]", "bpy + NO₃", "0.20", "0.4", "2", "Kuchsiz antenna"],
                ["[Tb(phen)₂Cl₃]", "phen + Cl", "0.08", "0.2", "3", "Juda kuchsiz"],
                ["Tb³⁺ (suvda)", "H₂O", "~0.002", "0.08", "9", "Antenna yo'q, juda kuchsiz"],
              ].map((r, i) => (
                <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${i === 0 ? 'bg-emerald-900/20' : ''}`}>
                  <td className={`py-2 px-2 font-bold ${i === 0 ? 'text-emerald-400' : 'text-purple-300'}`}>{r[0]}</td>
                  <td className="py-2 px-2 text-center">{r[1]}</td>
                  <td className="py-2 px-2 text-center font-mono text-emerald-400">{r[2]}</td>
                  <td className="py-2 px-2 text-center font-mono text-emerald-400">{r[3]}</td>
                  <td className="py-2 px-2 text-center font-mono">{r[4]}</td>
                  <td className="py-2 px-2 text-[10px]">{r[5]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 bg-emerald-600/10 border border-emerald-500/30 rounded-lg p-3 text-xs">
          <p className="text-emerald-400 font-bold mb-1">💡 Nima uchun [Tb(acac)₃(phen)] eng yaxshi?</p>
          <p className="text-purple-200">
            <strong>acac</strong> — kuchli xromofor, yuqori T₁ energiya → samarali antenna
            <br/>
            <strong>phen</strong> — koordinatsion to'ldiruvchi, suvni chetlashtiradi → kvenching kam
            <br/>
            <strong>Sinergetik effekt</strong> — ikkalasi birgalikda Φ = 0.75 ga yetadi
            <br/>
            Bu <strong>lantanid lyuminestsensiyasining eng yuqori ko'rsatkichi</strong>.
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

      <div className="bg-purple-800/30 rounded-xl p-5 border border-emerald-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🔬</div>
            <h4 className="text-emerald-400 font-bold mb-2">Bioimaging</h4>
            <p className="text-purple-200 text-xs">
              Yashil emissiya (545 nm) — <strong>autofluoressensiya minimal</strong>.
              <br/>
              Hujayra va to'qimalarni <strong>yuqori kontrast</strong> bilan ko'rish.
              <br/>
              τ ≈ 1.2 ms — vaqt-ajraladigan tahlil uchun ideal.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">📱</div>
            <h4 className="text-emerald-400 font-bold mb-2">Yashil OLED</h4>
            <p className="text-purple-200 text-xs">
              Tb³⁺ komplekslari <strong>yashil emissiya</strong> uchun OLED da qo'llaniladi.
              <br/>
              Tor chiziqli spektr → <strong>yuqori rang tozaligi</strong>.
              <br/>
              Φ ≈ 0.75 — yuqori samaradorlik.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🧪</div>
            <h4 className="text-emerald-400 font-bold mb-2">Kimyoviy sensorlar</h4>
            <p className="text-purple-200 text-xs">
              Tb³⁺ komplekslari <strong>pH, metall ionlari, anionlar</strong>ni sezish uchun ishlatiladi.
              <br/>
              Signal o'zgarishi (yoqish/o'chirish) orqali analit aniqlanadi.
              <br/>
              Yuqori sezgirlik — past konsentratsiyalarda ham ishlaydi.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">⏱️</div>
            <h4 className="text-emerald-400 font-bold mb-2">Vaqt-ajraladigan tahlil (TRF)</h4>
            <p className="text-purple-200 text-xs">
              τ ≈ 1.2 ms — <strong>fon signalidan ajratish</strong> oson.
              <br/>
              Biologik namunalarda avtomatik fluoressensiya (τ ≈ 1-10 ns) vaqtda o'chadi,
              Tb³⁺ signali esa kechikishdan keyin o'lchanadi.
              <br/>
              <strong>Yuqori sezgirlik</strong> va <strong>past fon</strong>.
            </p>
          </div>
        </div>

        <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-lg p-4">
          <p className="text-emerald-400 font-bold mb-2">🌟 Qiziqarli fakt:</p>
          <p className="text-purple-200 text-xs">
            [Tb(acac)₃(phen)] ning yashil emissiyasi shunchalik <strong>toza va intensiv</strong>ki,
            u <strong>Yevro banknotlarining</strong> xavfsizlik belgilarida ishlatiladi!
            <br/>
            UV nur ostida banknotlar <strong>yashil rangda porlaydi</strong> — bu qalbakiylikdan himoya.
            <br/>
            Tb³⁺ ning <strong>tor chiziqli spektri</strong> — har bir cho'qqi aniq ajralgan, qalbakiy qilish qiyin.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function TbAcac3PhenFluoressensiya() {
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
          <span className="text-emerald-400">[Tb(acac)₃(phen)]</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-emerald-400">💡 [Tb(acac)₃(phen)] — Fluoressensiya tahlili</h1>
          <p className="text-purple-400 text-sm">
            Tb³⁺ • Antenna effekti • Yashil emissiya • Φ ≈ 0.75 • τ ≈ 1.2 ms • Eng yuqori Φ lantanid
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-emerald-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-4xl md:text-5xl font-extrabold font-mono text-emerald-400">[Tb(acac)₃(phen)]</span>
            <div>
              <h2 className="text-xl font-bold text-white">Fluoressensiya tahlili — to'liq profil</h2>
              <p className="text-purple-400">"Eng yuqori Φ lantanid" — yashil emissiya klassikasi</p>
            </div>
          </div>

          <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              [Tb(acac)₃(phen)] — <strong className="text-emerald-400">lantanidlar orasida eng yuqori kvant unumi</strong>ga ega kompleks.
              Tb³⁺ (4f⁸) <strong>ikkita xromofor ligand</strong> (acac + phen) bilan o'ralgan — antenna effekti orqali
              energiya Tb³⁺ ga uzatiladi. Natijada <strong>yashil emissiya</strong> (545 nm, ⁵D₄ → ⁷F₅) hosil bo'ladi.
              <strong> Φ ≈ 0.75</strong> va <strong>τ ≈ 1.2 ms</strong> — lantanidlar uchun eng yuqori ko'rsatkichlar.
              Bioimaging, yashil OLED va sensorlarda keng qo'llaniladi.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-emerald-400 font-bold text-lg">Tb³⁺ (4f⁸)</p>
              <p className="text-purple-300">lantanid</p>
              <p className="text-purple-400 mt-1">S = 3</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-emerald-400 font-bold text-lg">λ<sub>em</sub> = 545</p>
              <p className="text-purple-300">nm</p>
              <p className="text-purple-400 mt-1">yashil</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-emerald-400 font-bold text-lg">Φ ≈ 0.75</p>
              <p className="text-purple-300">kvant unumi</p>
              <p className="text-purple-400 mt-1">eng yuqori</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-emerald-400 font-bold text-lg">τ ≈ 1.2</p>
              <p className="text-purple-300">ms</p>
              <p className="text-purple-400 mt-1">juda uzoq</p>
            </div>
          </div>
        </div>

        {/* EMISSION SPEKTR SIMULYATORI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <EmissionSpectrumSimulator />
        </div>

        {/* ANTENNA EFFEKTI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <AntennaEffekti />
        </div>

        {/* LIGAND STRUKTURASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <LigandStrukturasi />
        </div>

        {/* TB ENERGY LEVELS */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <TbEnergyLevels />
        </div>

        {/* PHI VA TAU */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <PhiVaTau />
        </div>

        {/* SOLISHTIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <Solishtirish />
        </div>

        {/* QO'LLANILISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <Qollanilish />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-emerald-600/10 to-purple-600/10 border border-emerald-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>[Tb(acac)₃(phen)] — <strong className="text-emerald-400">lantanidlar orasida eng yuqori Φ</strong></li>
            <li>Tb³⁺ (4f⁸) — <strong>yashil emissiya</strong> (545 nm, ⁵D₄ → ⁷F₅)</li>
            <li><strong>Antenna effekti</strong> — acac + phen ligandlar energiya uzatadi</li>
            <li><strong>Φ ≈ 0.75</strong> — lantanidlar uchun eng yuqori kvant unumi</li>
            <li><strong>τ ≈ 1.2 ms</strong> — vaqt-ajraladigan tahlil uchun ideal</li>
            <li><strong>Tor chiziqli spektr</strong> — f-f o'tishlar (FWHM ≈ 3 nm)</li>
            <li><strong>Yashil emissiya</strong> — bioimaging uchun ideal (autofluoressensiya minimal)</li>
            <li><strong>Suv molekulalari</strong> — eng katta dushman (kvenching)</li>
            <li><strong>phen</strong> — koordinatsion to'ldiruvchi, suvni chetlashtiradi</li>
            <li>Qo'llanilish: bioimaging, yashil OLED, sensorlar, TRF, xavfsizlik belgilari</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/fluoressensiya/birikmalar/eu-tta3-phen" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← [Eu(tta)₃(phen)]
          </Link>
          <Link href="/ilmiy/tahlil/fluoressensiya/birikmalar/eu-dpa3" className="px-6 py-3 bg-emerald-600/80 rounded-xl hover:bg-emerald-500 text-white font-semibold">
            [Eu(dpa)₃]³⁻ →
          </Link>
        </div>

      </section>
    </main>
  )
}