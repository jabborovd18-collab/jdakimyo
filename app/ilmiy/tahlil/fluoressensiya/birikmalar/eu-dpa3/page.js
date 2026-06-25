"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. EMISSION SPEKTR SIMULYATORI ([Eu(dpa)₃]³⁻ uchun)
// ============================================================================
function EmissionSpectrumSimulator() {
  const [excitation, setExcitation] = useState(280)
  const [intensity, setIntensity] = useState(100)
  const [solvent, setSolvent] = useState("suv")
  const [showPeaks, setShowPeaks] = useState(true)

  // Eu³⁺ ning xarakterli emission cho'qqilari
  const peaks = [
    { lambda: 580, intensity: 0.20, assign: "⁵D₀ → ⁷F₀", type: "noyob" },
    { lambda: 592, intensity: 0.35, assign: "⁵D₀ → ⁷F₁", type: "magnit dipol" },
    { lambda: 615, intensity: 1.0, assign: "⁵D₀ → ⁷F₂", type: "elektr dipol" },
    { lambda: 652, intensity: 0.25, assign: "⁵D₀ → ⁷F₃", type: "kuchsiz" },
    { lambda: 695, intensity: 0.15, assign: "⁵D₀ → ⁷F₄", type: "kuchsiz" },
  ]

  // Erituvchi ta'siri (suvda kvenching)
  const solventFactors = {
    "suv": 0.6,
    "metanol": 0.8,
    "asetonitril": 0.9,
    "dmso": 1.0
  }
  const solventFactor = solventFactors[solvent]

  const intFactor = (intensity / 100) * solventFactor

  // Emission spektri
  const spectrum = useMemo(() => {
    const points = []
    for (let i = 0; i < 400; i++) {
      const lambda = 500 + i * 0.75 // 500-800 nm
      let emission = 0

      peaks.forEach(peak => {
        // Lantanidlar uchun tor cho'qqilar (FWHM ≈ 4 nm — suvda biroz kengroq)
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
      <h3 className="text-white font-semibold">💡 Emission spektr simulyatori — [Eu(dpa)₃]³⁻</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-rose-700/30 space-y-4">
        <div className="bg-rose-600/10 border border-rose-500/30 rounded-lg p-4">
          <p className="text-rose-400 font-bold mb-2">💎 Suvda eruvchan Eu kompleksi:</p>
          <p className="text-purple-200 text-xs">
            [Eu(dpa)₃]³⁻ — <strong>anion kompleks</strong>, suvda yaxshi eriydi.
            Bu uni <strong>bioimaging</strong> va <strong>biologik tahlillar</strong> uchun ideal qiladi.
            Emission spektri Eu³⁺ ning xarakterli <strong>qizil chiziqli cho'qqilarini</strong> ko'rsatadi,
            lekin suvda kvenching tufayli Φ va τ <strong>Eu(tta)₃(phen)</strong> dan past.
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
              className="w-full h-2 bg-purple-900 rounded accent-rose-500" />
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
              className="w-full h-2 bg-purple-900 rounded accent-rose-500" />
          </div>
        </div>

        <div>
          <label className="text-xs text-yellow-400 font-bold mb-2 block">Erituvchi:</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: "suv", name: "Suv", factor: "0.6" },
              { id: "metanol", name: "Metanol", factor: "0.8" },
              { id: "asetonitril", name: "CH₃CN", factor: "0.9" },
              { id: "dmso", name: "DMSO", factor: "1.0" }
            ].map(s => (
              <button key={s.id} onClick={() => setSolvent(s.id)}
                className={`px-2 py-2 rounded-lg text-[10px] font-bold transition-all ${
                  solvent === s.id 
                    ? "bg-rose-600/80 text-white shadow-lg" 
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
            className="accent-rose-500" />
          <span className="text-purple-300">Cho'qqi belgilarini ko'rsatish</span>
        </label>

        {/* SPEKTR */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-rose-400 font-bold text-xs mb-2">
            Emission spektri ({solvent}, λ<sub>exc</sub> = {excitation} nm)
          </h5>
          <svg viewBox="0 0 400 280" className="w-full h-64">
            <line x1="40" y1="240" x2="380" y2="240" stroke="#4c1d95" strokeWidth="1" />
            <line x1="40" y1="20" x2="40" y2="240" stroke="#4c1d95" strokeWidth="1" />
            
            <text x="210" y="275" fill="#c4b5fd" fontSize="9" textAnchor="middle">λ (nm)</text>
            <text x="40" y="270" fill="#a78bfa" fontSize="8">500</text>
            <text x="380" y="270" fill="#a78bfa" fontSize="8" textAnchor="end">800</text>
            <text x="20" y="130" fill="#a78bfa" fontSize="8" textAnchor="middle" transform="rotate(-90, 20, 130)">
              Intensivlik
            </text>

            {/* λ_max belgilari */}
            {showPeaks && peaks.map((peak, idx) => (
              <g key={idx}>
                <line x1={40 + ((peak.lambda - 500) / 300) * 340} y1="20" 
                  x2={40 + ((peak.lambda - 500) / 300) * 340} y2="240"
                  stroke={peak.type === "elektr dipol" ? "#fbbf24" : "#a78bfa"} 
                  strokeWidth="0.5" strokeDasharray="2,2" />
                <text x={40 + ((peak.lambda - 500) / 300) * 340} y="15" 
                  fill={peak.type === "elektr dipol" ? "#fbbf24" : "#a78bfa"} 
                  fontSize="7" textAnchor="middle">
                  {peak.lambda} nm
                </text>
                <text x={40 + ((peak.lambda - 500) / 300) * 340} y="25" 
                  fill={peak.type === "elektr dipol" ? "#fbbf24" : "#a78bfa"} 
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
              fill="none" stroke="#f43f5e" strokeWidth="2"
            />

            <text x="200" y="35" fill="#f43f5e" fontSize="9" textAnchor="middle" fontWeight="bold">
              Eu³⁺ — qizil emissiya (615 nm)
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          <div className="bg-rose-900/30 border border-rose-500/50 rounded-lg p-3">
            <p className="text-rose-400">Asosiy cho'qqi</p>
            <p className="text-emerald-400 font-bold">615 nm</p>
            <p className="text-purple-400 text-[10px]">⁵D₀ → ⁷F₂</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Erituvchi</p>
            <p className="text-emerald-400 font-bold">{solvent}</p>
            <p className="text-purple-400 text-[10px]">kvenching: ×{solventFactor}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Asimmetriya</p>
            <p className="text-yellow-400 font-bold">I₆₁₅/I₅₉₂</p>
            <p className="text-purple-400 text-[10px]">~2.5</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Erituvchi ta'siri:</p>
          <p className="text-purple-200">
            <strong>Suv</strong> — O-H tebranishlari orqali kvenching → Φ va τ kamayadi
            <br/>
            <strong>DMSO</strong> — O-H yo'q → kvenching minimal → Φ va τ yuqori
            <br/>
            Bu <strong>Horrocks formulasi</strong> orqali suv molekulalari sonini aniqlashga imkon beradi.
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

      <div className="bg-purple-800/30 rounded-xl p-5 border border-rose-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-rose-400 font-bold mb-3">dpa strukturasi:</h4>
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
              <path d="M 50 100 Q 100 130 150 100" fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3,2" />
              <text x="100" y="140" fill="#f43f5e" fontSize="8" textAnchor="middle">
                Tridentat (N,N,N)
              </text>

              <text x="100" y="170" fill="#a78bfa" fontSize="8" textAnchor="middle">
                2,2'-dipirinilamin (dpa)
              </text>
              <text x="100" y="185" fill="#f43f5e" fontSize="7" textAnchor="middle">
                Kengaytirilgan π-sistema, 18 π-e⁻
              </text>
            </svg>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-rose-400 font-bold mb-3">Xususiyatlari:</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Turi:</span>
                <span className="text-rose-400 font-bold">Tridentat (N,N,N)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Xelat atomlari:</span>
                <span className="text-rose-400">3 × N</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Zaryad:</span>
                <span className="text-rose-400">0 (neytral)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">λ<sub>abs</sub>:</span>
                <span className="text-rose-400">~280 nm</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">ε:</span>
                <span className="text-rose-400">~3×10⁴ M⁻¹cm⁻¹</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">T₁ energiya:</span>
                <span className="text-rose-400">~21,000 cm⁻¹</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">π-elektronlar:</span>
                <span className="text-rose-400">18 (uch halqa)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun dpa suvda eruvchan?</p>
          <p className="text-purple-200">
            <strong>3 ta dpa</strong> ligand Eu³⁺ ni to'liq o'rab oladi → <strong>anion kompleks</strong> ([Eu(dpa)₃]³⁻).
            <br/>
            Zaryadlangan kompleks <strong>suvda yaxshi eriydi</strong> (ion-ion o'zaro ta'sir).
            <br/>
            Bundan tashqari, dpa ning <strong>kengaytirilgan π-sistemasi</strong> kuchli UV yutish va samarali antenna effekti beradi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. ANTENNA EFFEKTI — DPA BILAN
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
      desc: "Og'ir atom effekti (Eu³⁺) tufayli interkombinatsion konversiya tez",
      formula: "dpa* (S₁) → dpa* (T₁)",
      icon: "🔄"
    },
    {
      title: "3. Energiya uzatilishi",
      desc: "3 ta dpa T₁ energiyasi Eu³⁺ ⁵D₀ sathiga uzatiladi",
      formula: "3 dpa* (T₁) + Eu³⁺ → 3 dpa + Eu³⁺* (⁵D₀)",
      icon: "⚡"
    },
    {
      title: "4. Eu³⁺ nurlanishi",
      desc: "Eu³⁺ xarakterli qizil nurlanish chiqaradi (⁵D₀ → ⁷F₂, 615 nm)",
      formula: "Eu³⁺* (⁵D₀) → Eu³⁺ + hν' (615 nm)",
      icon: "✨"
    }
  ]

  const s = steps[step]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📡 Antenna effekti — 3 × dpa → Eu³⁺</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-rose-700/30 space-y-4">
        <div className="bg-rose-600/10 border border-rose-500/30 rounded-lg p-4">
          <p className="text-rose-400 font-bold mb-2">💎 Uchta dpa — kuchli antenna:</p>
          <p className="text-purple-200 text-xs">
            [Eu(dpa)₃]³⁻ da <strong>3 ta dpa ligand</strong> mavjud — har biri xromofor sifatida ishlaydi.
            <br/>
            Har bir dpa <strong>tridentat</strong> (3 ta N atomi orqali bog'lanadi) → Eu³⁺ ning koordinatsion soni 9.
            <br/>
            Kuchli UV yutish (ε ≈ 3×10⁴) va samarali energiya uzatish → <strong>Φ ≈ 0.30</strong> (suvda).
          </p>
        </div>

        {/* STEP NAVIGATION */}
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <button key={i} onClick={() => setStep(i)}
              className={`flex-1 px-2 py-2 rounded-lg text-xs font-bold transition-all ${
                step === i 
                  ? "bg-rose-600/80 text-white shadow-lg" 
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
            <h4 className="text-rose-400 font-bold text-lg">{s.title}</h4>
          </div>
          <p className="text-purple-200 text-sm mb-3">{s.desc}</p>
          <div className="bg-purple-900/50 rounded p-3 font-mono text-xs text-center text-emerald-400">
            {s.formula}
          </div>
        </div>

        {/* VIZUALIZATSIYA */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-rose-400 font-bold text-xs mb-3">Kompleks strukturasi:</h5>
          <svg viewBox="0 0 400 250" className="w-full h-60">
            {/* Markaziy Eu³⁺ */}
            <circle cx="200" cy="125" r="25" fill="#f43f5e" />
            <text x="200" y="130" fill="white" fontSize="12" textAnchor="middle" fontWeight="bold">Eu³⁺</text>

            {/* 3 ta dpa ligand */}
            {Array.from({ length: 3 }).map((_, i) => {
              const angle = (i * 120) * Math.PI / 180
              const x = 200 + 80 * Math.cos(angle)
              const y = 125 + 80 * Math.sin(angle)
              return (
                <g key={i}>
                  <line x1="200" y1="125" x2={x} y2={y} stroke="#a78bfa" strokeWidth="2" />
                  <rect x={x-20} y={y-15} width="40" height="30" fill="#3b82f6" opacity="0.3" rx="5" />
                  <text x={x} y={y+5} fill="#3b82f6" fontSize="9" textAnchor="middle" fontWeight="bold">dpa</text>
                </g>
              )
            })}

            {/* Zaryad belgisi */}
            <text x="200" y="230" fill="#f43f5e" fontSize="10" textAnchor="middle" fontWeight="bold">
              [Eu(dpa)₃]³⁻ (anion kompleks)
            </text>

            <text x="200" y="20" fill="#a78bfa" fontSize="9" textAnchor="middle">
              Koordinatsion son = 9 (3 × 3 N)
            </text>
          </svg>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Rezonans sharti:</p>
          <p className="text-purple-200">
            Ligand T₁ energiyasi <strong>Eu³⁺ ⁵D₀ sathidan yuqori</strong> bo'lishi kerak:
            <br/>
            • <strong>Eu³⁺</strong> ⁵D₀ = 17,250 cm⁻¹ (~580 nm)
            <br/>
            • <strong>dpa T₁</strong> ≈ 21,000 cm⁻¹ → rezonans bajariladi ✓
            <br/>
            dpa ning <strong>kengaytirilgan π-sistemasi</strong> (18 π-e⁻) → yuqori T₁ energiya → samarali antenna.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. SUVDA ERUVCHANLIK VA BIOIMAGING
// ============================================================================
function SuvdaEruvchanlik() {
  const [concentration, setConcentration] = useState(10) // μM

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">💧 Suvda eruvchanlik va bioimaging</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-rose-700/30 space-y-4">
        <div className="bg-rose-600/10 border border-rose-500/30 rounded-lg p-4">
          <p className="text-rose-400 font-bold mb-2">💎 Bioimaging uchun ideal:</p>
          <p className="text-purple-200 text-xs">
            [Eu(dpa)₃]³⁻ — <strong>anion kompleks</strong>, suvda yaxshi eriydi (10 mM gacha).
            Bu uni <strong>biologik namunalarda</strong> (hujayra, to'qima, qon) qo'llashga imkon beradi.
            <strong> Past toksiklik</strong>, <strong>fotobarqaror</strong>, <strong>uzoq yashash vaqti</strong> —
            barchasi bioimaging uchun muhim xususiyatlar.
          </p>
        </div>

        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">Konsentratsiya (μM):</span>
            <span className="text-emerald-400 font-mono">{concentration}</span>
          </label>
          <input type="range" min="0.1" max="100" step="0.1" value={concentration}
            onChange={(e) => setConcentration(parseFloat(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-rose-500" />
          <div className="flex justify-between text-[10px] text-purple-400 mt-1">
            <span>0.1 μM (past)</span>
            <span>10 μM (o'rtacha)</span>
            <span>100 μM (yuqori)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-rose-400 font-bold mb-3">Afzalliklari:</h4>
            <ul className="text-purple-200 text-xs space-y-2">
              <li>✓ <strong>Suvda eruvchan</strong> — biologik muhitda ishlatish mumkin</li>
              <li>✓ <strong>Past toksiklik</strong> — hujayralarga zarar yetkazmaydi</li>
              <li>✓ <strong>Fotobarqaror</strong> — uzoq vaqt davomida o'lchash mumkin</li>
              <li>✓ <strong>Tor chiziqli spektr</strong> — bir nechta lantanid bilan multiplex</li>
              <li>✓ <strong>Uzoq τ</strong> — vaqt-ajraladigan tahlil (TRF)</li>
              <li>✓ <strong>Katta Stokes siljishi</strong> — o'z-o'zini yutish kam</li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-rose-400 font-bold mb-3">Kamchiliklari:</h4>
            <ul className="text-purple-200 text-xs space-y-2">
              <li>✗ <strong>Suvda kvenching</strong> — Φ va τ past (Eu(tta)₃(phen) dan)</li>
              <li>✗ <strong>Qisman dissotsiatsiya</strong> — past pH da beqaror</li>
              <li>✗ <strong>Anion kompleks</strong> — musbat zaryadlangan biomolekulalar bilan o'zaro ta'sir</li>
              <li>✗ <strong>Qimmat</strong> — sintezi murakkab</li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Bioimaging protokoli:</p>
          <p className="text-purple-200">
            1. <strong>Hujayralarni</strong> [Eu(dpa)₃]³⁻ (10 μM) bilan 30 daqiqa inkubatsiya
            <br/>
            2. <strong>Yuvish</strong> — ortiqcha kompleksni olib tashlash
            <br/>
            3. <strong>Qo'zg'alish</strong> — 280 nm (UV)
            <br/>
            4. <strong>Kechikish</strong> — 50 μs (autofluoressensiya o'chadi)
            <br/>
            5. <strong>O'lchash</strong> — 615 nm (Eu³⁺ emissiyasi)
            <br/>
            Natija: <strong>yuqori kontrast</strong>, <strong>past fon</strong> tasvir.
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

  // suv molekulalari soniga bog'liq Φ va τ
  const phi = Math.max(0.05, 0.30 - waterMolecules * 0.08)
  const tau = Math.max(0.1, 0.5 - waterMolecules * 0.1)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📊 Kvant unumi va yashash vaqti — suv ta'siri</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-rose-700/30 space-y-4">
        <div className="bg-rose-600/10 border border-rose-500/30 rounded-lg p-4">
          <p className="text-rose-400 font-bold mb-2">💎 Suv — eng katta dushman:</p>
          <p className="text-purple-200 text-xs">
            [Eu(dpa)₃]³⁻ suvda eriydi, lekin suv molekulalari <strong>O-H tebranishlari</strong> orqali
            energiyani o'g'irlaydi (kvenching). Natijada <strong>Φ va τ kamayadi</strong>.
            <br/>
            [Eu(dpa)₃]³⁻ da odatda <strong>2 ta suv molekulasi</strong> koordinatsionlangan → Φ ≈ 0.30, τ ≈ 0.5 ms.
          </p>
        </div>

        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">Koordinatsionlangan suv molekulalari soni:</span>
            <span className="text-emerald-400 font-mono">{waterMolecules}</span>
          </label>
          <input type="range" min="0" max="5" step="1" value={waterMolecules}
            onChange={(e) => setWaterMolecules(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-rose-500" />
          <div className="flex justify-between text-[10px] text-purple-400 mt-1">
            <span>0 (organik erituvchi)</span>
            <span>2 (suvda)</span>
            <span>5 (to'liq gidratlangan)</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-center">
          <div className="bg-rose-900/30 border border-rose-500/50 rounded-lg p-3">
            <p className="text-rose-400">Kvant unumi (Φ)</p>
            <p className="text-emerald-400 font-bold font-mono text-2xl">{phi.toFixed(2)}</p>
            <p className="text-purple-400 text-[10px]">{phi > 0.25 ? "✓ Yaxshi" : phi > 0.15 ? "○ O'rtacha" : "✗ Past"}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Yashash vaqti (τ)</p>
            <p className="text-emerald-400 font-bold font-mono text-2xl">{tau.toFixed(2)} ms</p>
            <p className="text-purple-400 text-[10px]">{tau > 0.4 ? "✓ Yaxshi" : tau > 0.2 ? "○ O'rtacha" : "✗ Qisqa"}</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Horrocks formulasi:</p>
          <p className="text-purple-200">
            <strong>n(H₂O) = 1.05 × (1/τ - 1/τ₀)</strong> — suv molekulalari sonini aniqlash
            <br/>
            Bu formula orqali <strong>kompleks strukturasi</strong> haqida ma'lumot olinadi.
            <br/>
            [Eu(dpa)₃]³⁻ da n(H₂O) ≈ 2 — koordinatsion son 9 (3 × 3 N dan dpa) + 2 H₂O = 11.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 6. SOLISHTIRISH - SUVDA ERUVCHAN EU KOMPLEKSLARI
// ============================================================================
function Solishtirish() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 Suvda eruvchan Eu komplekslari bilan solishtirish</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-rose-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-2 text-yellow-400">Kompleks</th>
                <th className="text-center py-3 px-2 text-yellow-400">Ligandlar</th>
                <th className="text-center py-3 px-2 text-yellow-400">Φ (suv)</th>
                <th className="text-center py-3 px-2 text-yellow-400">τ (ms)</th>
                <th className="text-center py-3 px-2 text-yellow-400">Eruvchanlik</th>
                <th className="text-left py-3 px-2 text-yellow-400">Qo'llanilish</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["[Eu(dpa)₃]³⁻", "dpa (3 ta)", "0.30", "0.5", "Yaxshi", "Bioimaging"],
                ["[Eu(phen)(H₂O)₄]³⁺", "phen + H₂O", "0.05", "0.1", "O'rtacha", "Sensor"],
                ["[Eu(bpy)(NO₃)₃]", "bpy + NO₃", "0.08", "0.15", "Yaxshi", "Tahlil"],
                ["[Eu(tta)₃(phen)]", "tta + phen", "0.65*", "0.8", "Yomon*", "TRF (organik)"],
                ["Eu³⁺ (suvda)", "H₂O (9 ta)", "~0.001", "0.05", "Juda yaxshi", "—"],
              ].map((r, i) => (
                <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${i === 0 ? 'bg-rose-900/20' : ''}`}>
                  <td className={`py-2 px-2 font-bold ${i === 0 ? 'text-rose-400' : 'text-purple-300'}`}>{r[0]}</td>
                  <td className="py-2 px-2 text-center">{r[1]}</td>
                  <td className="py-2 px-2 text-center font-mono text-rose-400">{r[2]}</td>
                  <td className="py-2 px-2 text-center font-mono text-rose-400">{r[3]}</td>
                  <td className="py-2 px-2 text-center text-[10px]">{r[4]}</td>
                  <td className="py-2 px-2 text-[10px]">{r[5]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-purple-400 text-[10px] mt-2">* [Eu(tta)₃(phen)] suvda erimaydi, organik erituvchilarda ishlatiladi</p>

        <div className="mt-4 bg-rose-600/10 border border-rose-500/30 rounded-lg p-3 text-xs">
          <p className="text-rose-400 font-bold mb-1">💡 Nima uchun [Eu(dpa)₃]³⁻ bioimaging uchun eng yaxshi?</p>
          <p className="text-purple-200">
            <strong>Suvda yaxshi eruvchanlik</strong> — biologik muhitda ishlatish mumkin
            <br/>
            <strong>Φ ≈ 0.30</strong> — suvda eruvchan komplekslar orasida eng yuqori
            <br/>
            <strong>τ ≈ 0.5 ms</strong> — vaqt-ajraladigan tahlil uchun yetarli
            <br/>
            <strong>Past toksiklik</strong> — hujayralarga zarar yetkazmaydi
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

      <div className="bg-purple-800/30 rounded-xl p-5 border border-rose-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🔬</div>
            <h4 className="text-rose-400 font-bold mb-2">Bioimaging</h4>
            <p className="text-purple-200 text-xs">
              Hujayra va to'qimalarni <strong>yuqori kontrast</strong> bilan ko'rish.
              <br/>
              Vaqt-ajraladigan tahlil (TRF) — autofluoressensiyani yo'q qilish.
              <br/>
              <strong>Multiplex</strong> — bir nechta lantanid bilan bir vaqtda tasvir.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">⏱️</div>
            <h4 className="text-rose-400 font-bold mb-2">DELIA immunoassay</h4>
            <p className="text-purple-200 text-xs">
              <strong>Dissociation-Enhanced Lanthanide Immunoassay</strong>.
              <br/>
              Oqsillar, gormonlar, viruslarni <strong>yuqori sezgirlik</strong> bilan aniqlash.
              <br/>
              Tibbiy diagnostikada keng qo'llaniladi.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🧪</div>
            <h4 className="text-rose-400 font-bold mb-2">Kimyoviy sensorlar</h4>
            <p className="text-purple-200 text-xs">
              <strong>pH sensorlari</strong> — suv molekulalari soni pH ga bog'liq
              <br/>
              <strong>Metall ion sensorlari</strong> — boshqa metallar bilan almashtirish
              <br/>
              <strong>Anion sensorlari</strong> — koordinatsion o'zgarishlar
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">💊</div>
            <h4 className="text-rose-400 font-bold mb-2">Dori tashish</h4>
            <p className="text-purple-200 text-xs">
              [Eu(dpa)₃]³⁻ ni <strong>dori molekulalari</strong> bilan bog'lash.
              <br/>
              Hujayraga kirishini <strong>fluoressensiya orqali kuzatish</strong>.
              <br/>
              <strong>Teranostik</strong> — diagnostika + terapiya birgalikda.
            </p>
          </div>
        </div>

        <div className="bg-rose-600/10 border border-rose-500/30 rounded-lg p-4">
          <p className="text-rose-400 font-bold mb-2">🌟 Qiziqarli fakt:</p>
          <p className="text-purple-200 text-xs">
            [Eu(dpa)₃]³⁻ ning <strong>qizil emissiyasi</strong> biologik to'qimalardan yaxshi o'tadi
            (qizil nur to'qimalarda kamroq sochiladi).
            <br/>
            Bu <strong>chuqur to'qima bioimaging</strong> uchun muhim afzallik.
            <br/>
            Hattoki <strong>jonivorlarda</strong> (sichqonlar) ham <strong>chuqur joylashgan organlar</strong>ni ko'rish mumkin!
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function EuDpa3Fluoressensiya() {
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
          <span className="text-rose-400">[Eu(dpa)₃]³⁻</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-rose-400">💡 [Eu(dpa)₃]³⁻ — Fluoressensiya tahlili</h1>
          <p className="text-purple-400 text-sm">
            Eu³⁺ • Suvda eruvchan • Bioimaging • Φ ≈ 0.30 • τ ≈ 0.5 ms • Anion kompleks
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-rose-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-4xl md:text-5xl font-extrabold font-mono text-rose-400">[Eu(dpa)₃]³⁻</span>
            <div>
              <h2 className="text-xl font-bold text-white">Fluoressensiya tahlili — to'liq profil</h2>
              <p className="text-purple-400">"Suvda eruvchan Eu kompleksi" — bioimaging klassikasi</p>
            </div>
          </div>

          <div className="bg-rose-600/10 border border-rose-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              [Eu(dpa)₃]³⁻ — <strong className="text-rose-400">suvda eruvchan lantanid kompleksi</strong>.
              Eu³⁺ (4f⁶) <strong>uchta dpa ligand</strong> bilan o'ralgan — antenna effekti orqali
              energiya Eu³⁺ ga uzatiladi. Natijada <strong>qizil emissiya</strong> (615 nm, ⁵D₀ → ⁷F₂) hosil bo'ladi.
              <strong> Φ ≈ 0.30</strong> va <strong>τ ≈ 0.5 ms</strong> — suvda eruvchan komplekslar uchun yaxshi ko'rsatkichlar.
              Bioimaging, DELIA immunoassay va sensorlarda keng qo'llaniladi.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-rose-400 font-bold text-lg">Eu³⁺ (4f⁶)</p>
              <p className="text-purple-300">lantanid</p>
              <p className="text-purple-400 mt-1">S = 3</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-rose-400 font-bold text-lg">λ<sub>em</sub> = 615</p>
              <p className="text-purple-300">nm</p>
              <p className="text-purple-400 mt-1">qizil</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-rose-400 font-bold text-lg">Φ ≈ 0.30</p>
              <p className="text-purple-300">kvant unumi</p>
              <p className="text-purple-400 mt-1">(suvda)</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-rose-400 font-bold text-lg">τ ≈ 0.5</p>
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

        {/* SUVDA ERUVCHANLIK */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <SuvdaEruvchanlik />
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
        <div className="bg-gradient-to-r from-rose-600/10 to-purple-600/10 border border-rose-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>[Eu(dpa)₃]³⁻ — <strong className="text-rose-400">suvda eruvchan anion kompleks</strong></li>
            <li>Eu³⁺ (4f⁶) — <strong>qizil emissiya</strong> (615 nm, ⁵D₀ → ⁷F₂)</li>
            <li><strong>Antenna effekti</strong> — 3 ta dpa ligand energiya uzatadi</li>
            <li><strong>Φ ≈ 0.30</strong> (suvda) — suvda eruvchan komplekslar uchun yaxshi</li>
            <li><strong>τ ≈ 0.5 ms</strong> — vaqt-ajraladigan tahlil (TRF) uchun yetarli</li>
            <li><strong>Tor chiziqli spektr</strong> — f-f o'tishlar (FWHM ≈ 4 nm)</li>
            <li><strong>Suvda kvenching</strong> — Φ va τ ni kamaytiradi</li>
            <li><strong>Bioimaging</strong> uchun ideal — past toksiklik, fotobarqaror</li>
            <li><strong>DELIA immunoassay</strong> — tibbiy diagnostika</li>
            <li>Qo'llanilish: bioimaging, sensorlar, dori tashish, teranostika</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/fluoressensiya/birikmalar/tb-acac3-phen" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← [Tb(acac)₃(phen)]
          </Link>
          <Link href="/ilmiy/tahlil/fluoressensiya/birikmalar/tb-dpa3" className="px-6 py-3 bg-rose-600/80 rounded-xl hover:bg-rose-500 text-white font-semibold">
            [Tb(dpa)₃]³⁻ →
          </Link>
        </div>

      </section>
    </main>
  )
}