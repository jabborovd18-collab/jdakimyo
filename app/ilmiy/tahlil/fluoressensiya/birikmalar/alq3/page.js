"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. EMISSION SPEKTR SIMULYATORI — Alq₃
// ============================================================================
function EmissionSpectrumSimulator() {
  const [excitation, setExcitation] = useState(390)
  const [intensity, setIntensity] = useState(100)
  const [polymorph, setPolymorph] = useState("alpha")
  const [temperature, setTemperature] = useState(298)

  // Polimorf shakllar turli emissiya beradi
  const polymorphs = {
    "alpha": { lambda: 525, fwhm: 80, desc: "Eng keng tarqalgan, yashil", color: "#22c55e" },
    "beta": { lambda: 510, fwhm: 70, desc: "Ko'k-yashil, barqaror", color: "#10b981" },
    "gamma": { lambda: 540, fwhm: 90, desc: "Sariq-yashil", color: "#84cc16" },
    "delta": { lambda: 520, fwhm: 75, desc: "Amorf shakl", color: "#059669" }
  }

  const p = polymorphs[polymorph]
  const tempFactor = Math.max(0.5, 1 - (temperature - 298) / 400)
  const intFactor = (intensity / 100) * tempFactor

  const peaks = [
    { lambda: p.lambda - 30, intensity: 0.5, assign: "π-π* (vib)" },
    { lambda: p.lambda, intensity: 1.0, assign: "π-π* (max)" },
    { lambda: p.lambda + 40, intensity: 0.6, assign: "π-π* (vib)" },
  ]

  const spectrum = useMemo(() => {
    const points = []
    for (let i = 0; i < 400; i++) {
      const lambda = 400 + i * 0.75
      let emission = 0
      peaks.forEach(peak => {
        const x = (lambda - peak.lambda) / (p.fwhm / 2)
        emission += peak.intensity * Math.exp(-0.5 * x * x) * intFactor
      })
      points.push({ lambda, emission })
    }
    return points
  }, [intensity, polymorph, temperature, intFactor, p])

  const maxEmission = Math.max(...spectrum.map(p => p.emission), 0.1)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">💡 Emission spektr simulyatori — Alq₃</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-green-700/30 space-y-4">
        <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-4">
          <p className="text-green-400 font-bold mb-2">💎 OLED pioneri:</p>
          <p className="text-purple-200 text-xs">
            Alq₃ — <strong>1987 yilda Tang va VanSlyke</strong> tomonidan birinchi OLED da ishlatilgan material.
            <strong> Yashil emissiya</strong> (525 nm) va <strong>Φ ≈ 0.32</strong> — birinchi tijorat OLED materiali.
            Al³⁺ (3s²3p⁰) — <strong>d-elektronlari yo'q</strong>, faqat <strong>ligand ichki π-π*</strong> o'tishlar.
          </p>
        </div>

        {/* POLIMORF SHAKL */}
        <div>
          <label className="text-xs text-yellow-400 font-bold mb-2 block">Polimorf shakl:</label>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(polymorphs).map(([id, data]) => (
              <button key={id} onClick={() => setPolymorph(id)}
                className={`px-2 py-2 rounded-lg text-[10px] font-bold transition-all ${
                  polymorph === id 
                    ? "bg-green-600/80 text-white shadow-lg" 
                    : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
                }`}>
                <div className="text-xs">α-βγδ{"alpha beta gamma delta".indexOf(id === "alpha" ? "alpha" : id === "beta" ? "beta" : id === "gamma" ? "gamma" : "delta") / 5}</div>
                <div className="text-xs uppercase">{id}</div>
                <div className="text-[9px] opacity-70 mt-1">{data.lambda} nm</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-3">
          <p className="text-purple-300 text-xs">{p.desc}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">Qo'zg'alish to'lqin uzunligi:</span>
              <span className="text-emerald-400 font-mono">{excitation} nm</span>
            </label>
            <input type="range" min="300" max="450" step="5" value={excitation}
              onChange={(e) => setExcitation(parseInt(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-green-500" />
            <p className="text-purple-400 text-[10px] mt-1">
              Optimal: 390 nm (π-π* yutish)
            </p>
          </div>
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">Intensivlik:</span>
              <span className="text-emerald-400 font-mono">{intensity}%</span>
            </label>
            <input type="range" min="10" max="100" step="5" value={intensity}
              onChange={(e) => setIntensity(parseInt(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-green-500" />
          </div>
        </div>

        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">Harorat:</span>
            <span className="text-emerald-400 font-mono">{temperature} K</span>
          </label>
          <input type="range" min="100" max="400" step="10" value={temperature}
            onChange={(e) => setTemperature(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-green-500" />
          <div className="flex justify-between text-[10px] text-purple-400 mt-1">
            <span>100 K (sovuq)</span>
            <span>298 K (xona)</span>
            <span>400 K (issiq)</span>
          </div>
        </div>

        {/* SPEKTR */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-green-400 font-bold text-xs mb-2">
            Emission spektri ({polymorph}-Alq₃, {temperature} K, λ<sub>exc</sub> = {excitation} nm)
          </h5>
          <svg viewBox="0 0 400 280" className="w-full h-64">
            <line x1="40" y1="240" x2="380" y2="240" stroke="#4c1d95" strokeWidth="1" />
            <line x1="40" y1="20" x2="40" y2="240" stroke="#4c1d95" strokeWidth="1" />
            
            <text x="210" y="275" fill="#c4b5fd" fontSize="9" textAnchor="middle">λ (nm)</text>
            <text x="40" y="270" fill="#a78bfa" fontSize="8">400</text>
            <text x="380" y="270" fill="#a78bfa" fontSize="8" textAnchor="end">700</text>
            <text x="20" y="130" fill="#a78bfa" fontSize="8" textAnchor="middle" transform="rotate(-90, 20, 130)">
              Intensivlik
            </text>

            {/* λ_max belgilari */}
            {peaks.map((peak, idx) => (
              <g key={idx}>
                <line x1={40 + ((peak.lambda - 400) / 300) * 340} y1="20" 
                  x2={40 + ((peak.lambda - 400) / 300) * 340} y2="240"
                  stroke={peak.intensity === 1.0 ? "#fbbf24" : "#a78bfa"} 
                  strokeWidth="0.5" strokeDasharray="2,2" />
                <text x={40 + ((peak.lambda - 400) / 300) * 340} y="15" 
                  fill={peak.intensity === 1.0 ? "#fbbf24" : "#a78bfa"} 
                  fontSize="7" textAnchor="middle">
                  {peak.lambda} nm
                </text>
                <text x={40 + ((peak.lambda - 400) / 300) * 340} y="25" 
                  fill={peak.intensity === 1.0 ? "#fbbf24" : "#a78bfa"} 
                  fontSize="6" textAnchor="middle">
                  {peak.assign}
                </text>
              </g>
            ))}

            {/* Emission spektri */}
            <polyline
              points={spectrum.map((pt, i) => {
                const x = 40 + (i / 400) * 340
                const y = 240 - (pt.emission / maxEmission) * 210
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke={p.color} strokeWidth="2"
            />

            <text x="200" y="35" fill={p.color} fontSize="9" textAnchor="middle" fontWeight="bold">
              Alq₃ — yashil emissiya ({p.lambda} nm)
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-4 gap-3 text-xs text-center">
          <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-3">
            <p className="text-green-400">Polimorf</p>
            <p className="text-emerald-400 font-bold uppercase">{polymorph}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">λ<sub>em</sub></p>
            <p className="text-emerald-400 font-bold">{p.lambda} nm</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">FWHM</p>
            <p className="text-yellow-400 font-bold">~{p.fwhm} nm</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Harorat</p>
            <p className="text-emerald-400 font-bold">{temperature}K</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun keng spektr?</p>
          <p className="text-purple-200">
            <strong>Alq₃</strong> — organik kompleks, <strong>π-π*</strong> o'tish.
            <br/>
            <strong>Geometriya o'zgarishi</strong> → vibron kengayish → <strong>FWHM ≈ 80 nm</strong>.
            <br/>
            Bu <strong>MLCT (Ir(ppy)₃)</strong> yoki <strong>³π-π* (PtOEP)</strong> dan kengroq.
            <br/>
            Lekin <strong>yashil rang</strong> OLED uchun ideal — ko'zga yoqimli.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. 8-HIDROKSIXINOLIN LIGANDI
// ============================================================================
function QuinLigand() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔗 8-hidroksixinolin (Hq) ligandi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-green-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-green-400 font-bold mb-3">Alq₃ strukturasi:</h4>
            <svg viewBox="0 0 200 200" className="w-full h-48">
              {/* Markaziy Al */}
              <circle cx="100" cy="100" r="15" fill="#22c55e" />
              <text x="100" y="104" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">Al</text>

              {/* 3 ta quin ligand (120° burchakda) */}
              {Array.from({ length: 3 }).map((_, i) => {
                const angle = (i * 120 - 90) * Math.PI / 180
                const x1 = 100 + 50 * Math.cos(angle)
                const y1 = 100 + 50 * Math.sin(angle)
                const x2 = 100 + 70 * Math.cos(angle)
                const y2 = 100 + 70 * Math.sin(angle)
                return (
                  <g key={i}>
                    <line x1="100" y1="100" x2={x1} y2={y1} stroke="#a78bfa" strokeWidth="2" />
                    <circle cx={x1} cy={y1} r="8" fill="#3b82f6" />
                    <text x={x1} y={y1 + 3} fill="white" fontSize="6" textAnchor="middle">N</text>
                    
                    <line x1="100" y1="100" x2={x2} y2={y2} stroke="#a78bfa" strokeWidth="2" />
                    <circle cx={x2} cy={y2} r="8" fill="#ef4444" />
                    <text x={x2} y={y2 + 3} fill="white" fontSize="6" textAnchor="middle">O</text>

                    {/* Xinolin halqasi (soddalashtirilgan) */}
                    <rect x={x2 - 15} y={y2 + 10} width="30" height="20" fill="#a78bfa" opacity="0.3" rx="3" />
                    <text x={x2} y={y2 + 23} fill="#a78bfa" fontSize="7" textAnchor="middle">quin</text>
                  </g>
                )
              })}

              <text x="100" y="175" fill="#a78bfa" fontSize="8" textAnchor="middle">
                Alq₃ — tris(8-hidroksixinolin)alyuminiy
              </text>
              <text x="100" y="190" fill="#22c55e" fontSize="7" textAnchor="middle">
                3 × bidentat (N,O) ligand
              </text>
            </svg>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-green-400 font-bold mb-3">Xususiyatlari:</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Metal:</span>
                <span className="text-green-400 font-bold">Al³⁺ (3s²3p⁰)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">d-elektronlar:</span>
                <span className="text-green-400">Yo'q</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Ligandlar soni:</span>
                <span className="text-green-400">3 ta quin</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Koordinatsion son:</span>
                <span className="text-green-400">6 (oktaedrik)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Geometriya:</span>
                <span className="text-green-400">Oktaedrik</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Molekulyar massa:</span>
                <span className="text-green-400">459.4 g/mol</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Erish harorati:</span>
                <span className="text-green-400">415°C</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Sublimatsiya:</span>
                <span className="text-green-400">Ha (OLED uchun)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun Al³⁺ muhim?</p>
          <p className="text-purple-200">
            <strong>Al³⁺</strong> — yengil metal (Z=13), <strong>d-elektronlari yo'q</strong>.
            <br/>
            Natijada emissiya <strong>faqat ligand ichki</strong> (π-π*) — metall o'tishlari yo'q.
            <br/>
            <strong>Arzon</strong> — yer po'stlog'ida eng ko'p tarqalgan metal.
            <br/>
            <strong>Barqaror</strong> — yuqori erish harorati, sublimatsiya qilish mumkin.
            <br/>
            Bu <strong>OLED uchun ideal</strong> — arzon, barqaror, samarali.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. π-π* MECHANIZMI
// ============================================================================
function PiMechanizmi() {
  const [step, setStep] = useState(0)

  const steps = [
    {
      title: "1. Yorug'lik yutish",
      desc: "Xinolin π-sistemasi yorug'likni yutadi (π-π*)",
      formula: "Alq₃ + hν (390 nm) → Alq₃* (¹π-π*)",
      icon: "💡"
    },
    {
      title: "2. Tebranish relaksatsiyasi",
      desc: "S₁ ning eng past vibron sathiga tushish (~1 ps)",
      formula: "Alq₃* (S₁, yuqori vibron) → Alq₃* (S₁, past vibron)",
      icon: "🔄"
    },
    {
      title: "3. Fluoressensiya",
      desc: "¹π-π* → ¹GS o'tish orqali yashil nurlanish (525 nm)",
      formula: "Alq₃* (S₁) → Alq₃ + hν' (525 nm)",
      icon: "✨"
    }
  ]

  const s = steps[step]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚡ π-π* mexanizmi — ligand ichki fluoressensiya</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-green-700/30 space-y-4">
        <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-4">
          <p className="text-green-400 font-bold mb-2">💎 Faqat ligand ichki o'tish:</p>
          <p className="text-purple-200 text-xs">
            Alq₃ da emissiya <strong>faqat ligand ichki</strong> (π-π*) o'tish.
            <br/>
            <strong>Al³⁺</strong> — d-elektronlari yo'q → metall o'tishlari (MLCT, d-d) mumkin emas.
            <br/>
            <strong>Fluoressensiya</strong> (singlet-singlet) — fosforessensiya emas.
            <br/>
            Natijada <strong>qisqa τ</strong> (15 ns) va <strong>tez javob</strong> — OLED uchun ideal.
          </p>
        </div>

        {/* STEP NAVIGATION */}
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <button key={i} onClick={() => setStep(i)}
              className={`flex-1 px-2 py-2 rounded-lg text-xs font-bold transition-all ${
                step === i 
                  ? "bg-green-600/80 text-white shadow-lg" 
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
            <h4 className="text-green-400 font-bold text-lg">{s.title}</h4>
          </div>
          <p className="text-purple-200 text-sm mb-3">{s.desc}</p>
          <div className="bg-purple-900/50 rounded p-3 font-mono text-xs text-center text-emerald-400">
            {s.formula}
          </div>
        </div>

        {/* VIZUALIZATSIYA */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-green-400 font-bold text-xs mb-3">Jablonski diagrammasi:</h5>
          <svg viewBox="0 0 400 250" className="w-full h-60">
            <line x1="50" y1="230" x2="50" y2="20" stroke="#4c1d95" strokeWidth="1" />
            <text x="30" y="125" fill="#c4b5fd" fontSize="9" textAnchor="middle" transform="rotate(-90, 30, 125)">
              Energiya
            </text>

            {/* S₀ */}
            <rect x="80" y="200" width="80" height="20" fill="#3b82f6" opacity="0.3" />
            <text x="120" y="215" fill="#3b82f6" fontSize="9" textAnchor="middle">S₀ (GS)</text>

            {/* S₁ */}
            <rect x="80" y="60" width="80" height="20" fill="#22c55e" opacity="0.3" />
            <text x="120" y="75" fill="#22c55e" fontSize="9" textAnchor="middle">S₁ (¹π-π*)</text>

            {/* Vibron sathlar */}
            <line x1="80" y1="100" x2="160" y2="100" stroke="#22c55e" strokeWidth="0.5" opacity="0.5" />
            <line x1="80" y1="120" x2="160" y2="120" stroke="#22c55e" strokeWidth="0.5" opacity="0.5" />
            <line x1="80" y1="140" x2="160" y2="140" stroke="#22c55e" strokeWidth="0.5" opacity="0.5" />

            {/* O'tishlar */}
            <line x1="120" y1="200" x2="120" y2="80" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrowY)" />
            <text x="135" y="140" fill="#fbbf24" fontSize="8">hν (390 nm)</text>

            <path d="M 120 100 Q 140 110 120 140" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2,2" />
            <text x="150" y="120" fill="#ef4444" fontSize="7">Vibron relaksatsiya</text>

            <line x1="120" y1="140" x2="120" y2="200" stroke="#22c55e" strokeWidth="2" markerEnd="url(#arrowG)" />
            <text x="135" y="170" fill="#22c55e" fontSize="8">hν' (525 nm)</text>

            <defs>
              <marker id="arrowY" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
                <polygon points="0,0 5,2.5 0,5" fill="#fbbf24" />
              </marker>
              <marker id="arrowG" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
                <polygon points="0,0 5,2.5 0,5" fill="#22c55e" />
              </marker>
            </defs>
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 text-xs">
            <p className="text-green-400 font-bold mb-1">Alq₃ afzalligi:</p>
            <ul className="text-purple-200 space-y-1 list-disc list-inside">
              <li><strong>Tez javob</strong> (τ = 15 ns)</li>
              <li><strong>Samarali</strong> (Φ = 0.32)</li>
              <li><strong>Arzon</strong> va <strong>barqaror</strong></li>
            </ul>
          </div>
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3 text-xs">
            <p className="text-purple-400 font-bold mb-1">Cheklovlar:</p>
            <ul className="text-purple-200 space-y-1 list-disc list-inside">
              <li>Faqat <strong>yashil</strong> rang</li>
              <li><strong>Fosforessensiya yo'q</strong> → 25% maksimal Φ</li>
              <li>Keyinchalik <strong>Ir(ppy)₃</strong> yaxshiroq bo'ldi</li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun Alq₃ OLED da muvaffaqiyatli?</p>
          <p className="text-purple-200">
            <strong>1987 yil</strong> — birinchi OLED yaratildi.
            <br/>
            O'sha paytda <strong>boshqa yaxshi materiallar yo'q edi</strong>.
            <br/>
            Alq₃ <strong>arzon, barqaror, sublimatsiya qilish mumkin</strong> → OLED ishlab chiqarish uchun ideal.
            <br/>
            Hozir ham <strong>ko'p OLED larda</strong> Alq₃ ishlatiladi — ayniqsa <strong>arzon qurilmalarda</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. POLIMORF SHAKLLAR
// ============================================================================
function PolimorfShakllar() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔷 Polimorf shakllar — α, β, γ, δ</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-green-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-2 text-yellow-400">Shakl</th>
                <th className="text-center py-3 px-2 text-yellow-400">λ<sub>em</sub></th>
                <th className="text-center py-3 px-2 text-yellow-400">Φ</th>
                <th className="text-center py-3 px-2 text-yellow-400">Barqarorlik</th>
                <th className="text-center py-3 px-2 text-yellow-400">Qo'llanilish</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["α-Alq₃", "525 nm", "0.32", "O'rtacha", "Eng keng tarqalgan"],
                ["β-Alq₃", "510 nm", "0.35", "Yuqori", "Barqaror OLED"],
                ["γ-Alq₃", "540 nm", "0.28", "Past", "Kam qo'llaniladi"],
                ["δ-Alq₃", "520 nm", "0.30", "Past", "Amorf shakl"],
                ["Amorf Alq₃", "525 nm", "0.30", "O'rtacha", "Standart"],
              ].map((r, i) => (
                <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${i === 0 ? 'bg-green-900/20' : ''}`}>
                  <td className={`py-2 px-2 font-bold ${i === 0 ? 'text-green-400' : 'text-purple-300'}`}>{r[0]}</td>
                  <td className="py-2 px-2 text-center">{r[1]}</td>
                  <td className="py-2 px-2 text-center">{r[2]}</td>
                  <td className="py-2 px-2 text-center">{r[3]}</td>
                  <td className="py-2 px-2 text-center">{r[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 text-xs">
            <p className="text-green-400 font-bold mb-1">α-Alq₃:</p>
            <p className="text-purple-200">
              Eng keng tarqalgan shakl. Xona haroratida barqaror.
              <br/>
              <strong>Yashil emissiya</strong> (525 nm) — standart OLED.
            </p>
          </div>
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3 text-xs">
            <p className="text-purple-400 font-bold mb-1">β-Alq₃:</p>
            <p className="text-purple-200">
              Eng barqaror shakl. Yuqori Φ (0.35).
              <br/>
              <strong>Ko'k-yashil emissiya</strong> (510 nm) — uzoq umr OLED.
            </p>
          </div>
        </div>

        <div className="mt-4 bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun polimorf muhim?</p>
          <p className="text-purple-200">
            <strong>Turli shakllar</strong> — turli emissiya va barqarorlik.
            <br/>
            <strong>OLED ishlab chiqarishda</strong> — qaysi shakl hosil bo'lishi muhim.
            <br/>
            <strong>Sublimatsiya harorati</strong> va <strong>tezligi</strong> shaklni belgilaydi.
            <br/>
            <strong>Nazorat qilinadigan jarayon</strong> — bir xil shakl olish uchun muhim.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. OLED STRUKTURASI
// ============================================================================
function OLEDStrukturasi() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📱 OLED strukturasi — Alq₃ bilan</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-green-700/30 space-y-4">
        <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-4">
          <p className="text-green-400 font-bold mb-2">💎 Birinchi OLED:</p>
          <p className="text-purple-200 text-xs">
            <strong>1987 yilda Tang va VanSlyke</strong> (Eastman Kodak) birinchi OLED ni yaratdilar.
            <br/>
            <strong>Alq₃</strong> — emitting layer (yashil nurlanish).
            <br/>
            <strong>TPD</strong> (triphenylamine) — hole transport layer.
            <br/>
            Bu <strong>ikki qatlamli struktura</strong> OLED texnologiyasining asosi bo'ldi.
          </p>
        </div>

        <div className="bg-purple-950/50 rounded-xl p-5">
          <h4 className="text-green-400 font-bold mb-3">OLED qatlamlari:</h4>
          <svg viewBox="0 0 200 250" className="w-full h-60">
            {/* Cathode */}
            <rect x="20" y="20" width="160" height="25" fill="#6b7280" opacity="0.5" />
            <text x="100" y="35" fill="white" fontSize="9" textAnchor="middle" fontWeight="bold">Cathode (Al/Mg:Ag)</text>

            {/* ETL - Alq₃ */}
            <rect x="20" y="50" width="160" height="30" fill="#22c55e" opacity="0.5" />
            <text x="100" y="65" fill="white" fontSize="9" textAnchor="middle" fontWeight="bold">Alq₃ (ETL + EML)</text>
            <text x="100" y="78" fill="#22c55e" fontSize="7" textAnchor="middle">50-100 nm</text>

            {/* HTL - TPD */}
            <rect x="20" y="85" width="160" height="30" fill="#3b82f6" opacity="0.5" />
            <text x="100" y="100" fill="white" fontSize="9" textAnchor="middle" fontWeight="bold">TPD (HTL)</text>
            <text x="100" y="113" fill="#3b82f6" fontSize="7" textAnchor="middle">50 nm</text>

            {/* Anode */}
            <rect x="20" y="120" width="160" height="25" fill="#a78bfa" opacity="0.5" />
            <text x="100" y="135" fill="white" fontSize="9" textAnchor="middle" fontWeight="bold">Anode (ITO)</text>

            {/* Substrat */}
            <rect x="20" y="150" width="160" height="25" fill="#6b7280" opacity="0.3" />
            <text x="100" y="165" fill="white" fontSize="9" textAnchor="middle">Substrat (shisha)</text>

            {/* Elektron va teskari oqim */}
            <line x1="60" y1="50" x2="60" y2="115" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrowY)" />
            <text x="45" y="85" fill="#fbbf24" fontSize="8" textAnchor="end">e⁻</text>

            <line x1="140" y1="115" x2="140" y2="50" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowB)" />
            <text x="155" y="85" fill="#3b82f6" fontSize="8">h⁺</text>

            {/* Rekombinatsiya */}
            <circle cx="100" cy="65" r="8" fill="#ef4444" />
            <text x="100" y="68" fill="white" fontSize="8" textAnchor="middle" fontWeight="bold">hν</text>

            {/* Nurlanish */}
            <line x1="100" y1="65" x2="100" y2="10" stroke="#22c55e" strokeWidth="2" markerEnd="url(#arrowG)" />
            <text x="115" y="20" fill="#22c55e" fontSize="8">Yashil nur</text>

            <defs>
              <marker id="arrowY" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
                <polygon points="0,0 5,2.5 0,5" fill="#fbbf24" />
              </marker>
              <marker id="arrowB" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
                <polygon points="0,0 5,2.5 0,5" fill="#3b82f6" />
              </marker>
              <marker id="arrowG" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
                <polygon points="0,0 5,2.5 0,5" fill="#22c55e" />
              </marker>
            </defs>
          </svg>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-green-400 font-bold mb-3">Ishlash prinsipi:</h4>
            <ol className="text-purple-200 text-xs space-y-2 list-decimal list-inside">
              <li><strong>Kuchlanish</strong> qo'llaniladi (2-10 V)</li>
              <li><strong>Elektronlar</strong> cathode dan Alq₃ ga kiradi</li>
              <li><strong>Teshiklar</strong> (h⁺) anode dan TPD orqali kiradi</li>
              <li><strong>Rekombinatsiya</strong> — e⁻ + h⁺ → eksiton</li>
              <li><strong>Nurlanish</strong> — eksiton → foton (525 nm)</li>
            </ol>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-green-400 font-bold mb-3">Afzalliklari:</h4>
            <ul className="text-purple-200 text-xs space-y-2 list-disc list-inside">
              <li><strong>Arzon</strong> — Al yer po'stlog'ida ko'p</li>
              <li><strong>Barqaror</strong> — uzoq umr (10,000 soat)</li>
              <li><strong>Sublimatsiya</strong> — toza plyonka hosil qilish</li>
              <li><strong>Yuqori Φ</strong> — samarali yorug'lik</li>
              <li><strong>Yashil rang</strong> — ko'z uchun optimal</li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun Alq₃ ETL va EML vazifasini bajaradi?</p>
          <p className="text-purple-200">
            <strong>Alq₃</strong> — <strong>elektron tashuvchi</strong> (ETL) va <strong>emitting layer</strong> (EML) ikkalasi.
            <br/>
            Bu <strong>soddalashtirilgan struktura</strong> — kamroq qatlam, arzonroq ishlab chiqarish.
            <br/>
            Keyinchalik <strong>alohida ETL va EML</strong> ishlatiladi (yuqori samaradorlik uchun).
            <br/>
            Lekin <strong>Alq₃</strong> hali ham <strong>ko'p OLED larda</strong> ishlatiladi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 6. Φ VA TAU
// ============================================================================
function PhiVaTau() {
  const [temperature, setTemperature] = useState(298)
  const [film, setFilm] = useState("vacuum")

  const filmFactors = {
    "vacuum": { factor: 1.0, desc: "Vakuumda sublimatsiya qilingan" },
    "spin-coat": { factor: 0.85, desc: "Spin-coat plyonka" },
    "crystal": { factor: 0.95, desc: "Kristall shakl" },
    "doped": { factor: 0.90, desc: "Dopant bilan" }
  }
  const filmFactor = filmFactors[film].factor
  const phi = Math.max(0.1, 0.32 * filmFactor * (1 - (temperature - 298) / 500))
  const tau = Math.max(5, 15 * filmFactor * (1 - (temperature - 298) / 500))

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📊 Φ va τ — film turi va harorat ta'siri</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-green-700/30 space-y-4">
        <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-4">
          <p className="text-green-400 font-bold mb-2">💎 Film turi muhim:</p>
          <p className="text-purple-200 text-xs">
            Alq₃ <strong>turli usullarda</strong> plyonka hosil qilish mumkin:
            <br/>
            <strong>Vakuum sublimatsiya</strong> — eng yaxshi (Φ ≈ 0.32).
            <br/>
            <strong>Spin-coat</strong> — oson, lekin past Φ.
            <br/>
            <strong>Kristall</strong> — yuqori barqarorlik.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {Object.entries(filmFactors).map(([id, data]) => (
            <button key={id} onClick={() => setFilm(id)}
              className={`px-2 py-2 rounded-lg text-[10px] font-bold transition-all ${
                film === id ? "bg-green-600/80 text-white shadow-lg" : "bg-purple-800/40 text-purple-300"
              }`}>
              <div>{id}</div>
              <div className="text-[9px] opacity-70 mt-1">×{data.factor}</div>
            </button>
          ))}
        </div>

        <div className="bg-purple-950/50 rounded-lg p-3">
          <p className="text-purple-300 text-xs">{filmFactors[film].desc}</p>
        </div>

        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">Harorat:</span>
            <span className="text-emerald-400 font-mono">{temperature} K</span>
          </label>
          <input type="range" min="100" max="400" step="10" value={temperature}
            onChange={(e) => setTemperature(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-green-500" />
          <div className="flex justify-between text-[10px] text-purple-400 mt-1">
            <span>100 K</span>
            <span>298 K (xona)</span>
            <span>400 K</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-center">
          <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-3">
            <p className="text-green-400">Φ (kvant unumi)</p>
            <p className="text-emerald-400 font-bold font-mono text-2xl">{phi.toFixed(3)}</p>
            <p className="text-purple-400 text-[10px]">{phi > 0.3 ? "✓ Yaxshi" : phi > 0.2 ? "○ O'rtacha" : "✗ Past"}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">τ (ns)</p>
            <p className="text-emerald-400 font-bold font-mono text-2xl">{tau.toFixed(1)}</p>
            <p className="text-purple-400 text-[10px]">{tau > 12 ? "✓ Yaxshi" : tau > 8 ? "○ O'rtacha" : "✗ Qisqa"}</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun vakuum sublimatsiya eng yaxshi?</p>
          <p className="text-purple-200">
            <strong>Vakuumda</strong> — Alq₃ bug'lanadi, toza plyonka hosil bo'ladi.
            <br/>
            <strong>Impurity yo'q</strong> → kamroq kvenching → yuqori Φ.
            <br/>
            <strong>Bir xil qalinlik</strong> → bir xil emissiya.
            <br/>
            Bu <strong>OLED ishlab chiqarishda</strong> standart usul.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 7. SOLISHTIRISH — BOSHQA OLED MATERIALLAR
// ============================================================================
function Solishtirish() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 Boshqa OLED materiallari bilan solishtirish</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-green-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-2 text-yellow-400">Material</th>
                <th className="text-center py-3 px-2 text-yellow-400">Rang</th>
                <th className="text-center py-3 px-2 text-yellow-400">Φ</th>
                <th className="text-center py-3 px-2 text-yellow-400">τ</th>
                <th className="text-center py-3 px-2 text-yellow-400">Narx</th>
                <th className="text-center py-3 px-2 text-yellow-400">Yil</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["Alq₃", "Yashil", "0.32", "15 ns", "Arzon", "1987"],
                ["Ir(ppy)₃", "Yashil", "0.40", "2 μs", "Qimmat", "2000"],
                ["Ir(piq)₃", "Qizil", "0.35", "3 μs", "Qimmat", "2002"],
                ["FIrpic", "Ko'k", "0.25", "4 μs", "Qimmat", "2004"],
                ["Zn(quin)₂", "Ko'k", "0.35", "5 ns", "O'rtacha", "1990"],
                ["Coumarin 6", "Yashil", "0.78", "4 ns", "Arzon", "1995"],
              ].map((r, i) => (
                <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${i === 0 ? 'bg-green-900/20' : ''}`}>
                  <td className={`py-2 px-2 font-bold ${i === 0 ? 'text-green-400' : 'text-purple-300'}`}>{r[0]}</td>
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

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 text-xs">
            <p className="text-green-400 font-bold mb-1">Alq₃ afzalligi:</p>
            <p className="text-purple-200">
              <strong>Eng arzon</strong> — Al ko'p tarqalgan.
              <br/>
              <strong>Birinchi</strong> — OLED texnologiyasining asosi.
              <br/>
              <strong>Barqaror</strong> — uzoq umr.
              <br/>
              <strong>Samarali</strong> — Φ = 0.32 yetarli.
            </p>
          </div>
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3 text-xs">
            <p className="text-purple-400 font-bold mb-1">Ir(ppy)₃ afzalligi:</p>
            <p className="text-purple-200">
              <strong>Yuqori Φ</strong> (0.40) — fosforessensiya.
              <br/>
              <strong>100% ichki kvant unumi</strong> — singlet + triplet.
              <br/>
              <strong>Uzoq τ</strong> — samarali nurlanish.
              <br/>
              Lekin <strong>qimmat</strong> — Ir kam tarqalgan.
            </p>
          </div>
        </div>

        <div className="mt-4 bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Alq₃ hali ham ishlatiladimi?</p>
          <p className="text-purple-200">
            <strong>Ha!</strong> Alq₃ hali ham <strong>ko'p OLED larda</strong> ishlatiladi.
            <br/>
            <strong>Arzon qurilmalar</strong> — smartfonlar, televizorlar.
            <br/>
            <strong>ETL sifatida</strong> — elektron tashuvchi qatlam.
            <br/>
            <strong>Standart material</strong> — tadqiqotlarda solishtirish uchun.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 8. QO'LLANILISH
// ============================================================================
function Qollanilish() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🏭 Amaliy qo'llanilishi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-green-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">📱</div>
            <h4 className="text-green-400 font-bold mb-2">OLED displeylar</h4>
            <p className="text-purple-200 text-xs">
              <strong>Eng keng qo'llanilish</strong>. Smartfon, televizor, soat displeylari.
              <br/>
              <strong>Yashil piksel</strong> — ko'z uchun optimal rang.
              <br/>
              <strong>Arzon</strong> — keng miqyosda ishlab chiqarish.
              <br/>
              Samsung, LG, Apple — barchasi Alq₃ ishlatgan.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">💡</div>
            <h4 className="text-green-400 font-bold mb-2">Yoritish</h4>
            <p className="text-purple-200 text-xs">
              <strong>OLED yoritish panellari</strong> — yumshoq, energiya tejovchi yorug'lik.
              <br/>
              <strong>Uy, ofis, avtomobil</strong> ichki yoritishi.
              <br/>
              <strong>Signal chiroqlari</strong>, indikatorlar.
              <br/>
              <strong>Arzon alternativa</strong> — LED ga qaraganda.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🔬</div>
            <h4 className="text-green-400 font-bold mb-2">Sensorlar</h4>
            <p className="text-purple-200 text-xs">
              <strong>Kimyoviy sensorlar</strong> — Alq₃ turli moddalar bilan o'zaro ta'sir qiladi.
              <br/>
              <strong>Metall ionlari</strong>, pH, harorat sensorlari.
              <br/>
              <strong>Fluoressensiya o'zgarishi</strong> orqali analit aniqlanadi.
              <br/>
              <strong>Arzon</strong> va <strong>oson</strong> ishlatish.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">⚡</div>
            <h4 className="text-green-400 font-bold mb-2">Organik elektronika</h4>
            <p className="text-purple-200 text-xs">
              <strong>Organik tranzistorlar</strong> — Alq₃ yarimo'tkazgich sifatida.
              <br/>
              <strong>Organik quyosh hujayralari</strong> — elektron qabul qiluvchi.
              <br/>
              <strong>Flexible elektronika</strong> — egiluvchan qurilmalar.
              <br/>
              <strong>Kelajak texnologiyasi</strong> — kengayib bormoqda.
            </p>
          </div>
        </div>

        <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-4">
          <p className="text-green-400 font-bold mb-2">🌟 Qiziqarli faktlar:</p>
          <ul className="text-purple-200 text-xs space-y-2">
            <li>
              <strong>1987 yil</strong> — Tang va VanSlyke birinchi OLED ni yaratdilar.
              <br/>
              Bu <strong>organik elektronika inqilobi</strong>ning boshlanishi edi.
            </li>
            <li>
              <strong>2014 yil</strong> — OLED televizorlar bozorga chiqdi.
              <br/>
              LG birinchi <strong>55 dyuymli OLED TV</strong> ni taqdim etdi — $10,000.
            </li>
            <li>
              <strong>2024 yil</strong> — OLED bozori <strong>$50 milliard</strong> dan oshdi.
              <br/>
              Har yili <strong>milliardlab qurilmalar</strong> OLED displeylar bilan ishlab chiqariladi.
            </li>
            <li>
              Alq₃ — <strong>eng ko'p o'rganilgan</strong> organik kompleks.
              <br/>
              <strong>50,000 dan ortiq maqola</strong> chop etilgan.
              <br/>
              Bu <strong>koordinatsion kimyoning</strong> eng muvaffaqiyatli amaliy qo'llanilishi!
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
export default function Alq3Fluoressensiya() {
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
          <span className="text-green-400">Alq₃</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-green-400">💡 Alq₃ — Fluoressensiya tahlili</h1>
          <p className="text-purple-400 text-sm">
            Al³⁺ • π-π* • OLED pioneri • Φ ≈ 0.32 • τ ≈ 15 ns • Yashil emissiya
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        <div className="bg-purple-900/40 border border-green-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-4xl md:text-5xl font-extrabold font-mono text-green-400">Alq₃</span>
            <div>
              <h2 className="text-xl font-bold text-white">Fluoressensiya tahlili — to'liq profil</h2>
              <p className="text-purple-400">"OLED pioneri" — birinchi tijorat OLED materiali</p>
            </div>
          </div>

          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              Alq₃ — <strong className="text-green-400">OLED texnologiyasining pioneri</strong>.
              1987 yilda <strong>Tang va VanSlyke</strong> tomonidan birinchi OLED da ishlatilgan.
              Al³⁺ (3s²3p⁰) <strong>uchta 8-hidroksixinolin</strong> ligand bilan o'ralgan.
              <strong> π-π*</strong> ligand ichki o'tish orqali <strong>yashil emissiya</strong> (525 nm) chiqaradi.
              <strong> Φ ≈ 0.32</strong> va <strong>τ ≈ 15 ns</strong> — OLED uchun ideal.
              Hali ham <strong>milliardlab qurilmalarda</strong> ishlatiladi.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-green-400 font-bold text-lg">Al³⁺ (3s²3p⁰)</p>
              <p className="text-purple-300">d-e⁻ yo'q</p>
              <p className="text-purple-400 mt-1">S = 0</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-green-400 font-bold text-lg">λ<sub>em</sub> = 525</p>
              <p className="text-purple-300">nm</p>
              <p className="text-purple-400 mt-1">yashil</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-green-400 font-bold text-lg">Φ ≈ 0.32</p>
              <p className="text-purple-300">kvant unumi</p>
              <p className="text-purple-400 mt-1">fluoressensiya</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-green-400 font-bold text-lg">τ ≈ 15</p>
              <p className="text-purple-300">ns</p>
              <p className="text-purple-400 mt-1">tez javob</p>
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
          <PiMechanizmi />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <PolimorfShakllar />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <OLEDStrukturasi />
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

        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>Alq₃ — <strong className="text-green-400">OLED texnologiyasining pioneri</strong></li>
            <li>Al³⁺ (3s²3p⁰) — <strong>d-elektronlari yo'q</strong>, faqat ligand ichki o'tishlar</li>
            <li><strong>8-hidroksixinolin</strong> — bidentat (N,O) ligand</li>
            <li><strong>π-π*</strong> ligand ichki o'tish — yashil emissiya (525 nm)</li>
            <li><strong>Φ ≈ 0.32</strong> — fluoressensiya (singlet-singlet)</li>
            <li><strong>τ ≈ 15 ns</strong> — tez javob, OLED uchun ideal</li>
            <li><strong>Polimorf shakllar</strong> — α, β, γ, δ (turli emissiya)</li>
            <li><strong>1987 yil</strong> — birinchi OLED (Tang va VanSlyke)</li>
            <li><strong>Arzon</strong> — Al yer po'stlog'ida ko'p</li>
            <li>Qo'llanilish: <strong>OLED, yoritish, sensorlar, organik elektronika</strong></li>
            <li><strong>$50 milliard</strong> bozor — har yili milliardlab qurilmalar</li>
            <li>Koordinatsion kimyoning <strong>eng muvaffaqiyatli amaliy qo'llanilishi</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/fluoressensiya/birikmalar/zn-quin2" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← [Zn(quin)₂]
          </Link>
          <Link href="/ilmiy/tahlil/fluoressensiya/birikmalar/ru-dppz2-bpy" className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold">
            [Ru(dppz)₂(bpy)]²⁺ →
          </Link>
        </div>
      </section>
    </main>
  )
}