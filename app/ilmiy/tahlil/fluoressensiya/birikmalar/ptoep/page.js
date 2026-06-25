"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. EMISSION SPEKTR SIMULYATORI — [PtOEP]
// ============================================================================
function EmissionSpectrumSimulator() {
  const [excitation, setExcitation] = useState(380)
  const [intensity, setIntensity] = useState(100)
  const [oxygen, setOxygen] = useState(0)
  const [temperature, setTemperature] = useState(298)

  const peaks = [
    { lambda: 645, intensity: 0.8, assign: "³π-π* (0-0)" },
    { lambda: 650, intensity: 1.0, assign: "³π-π* (max)" },
    { lambda: 695, intensity: 0.4, assign: "³π-π* (vib)" },
  ]

  const oxygenFactor = 1 - (oxygen / 100) * 0.95
  const tempFactor = Math.max(0.5, 1 - (temperature - 298) / 500)
  const intFactor = (intensity / 100) * oxygenFactor * tempFactor

  const spectrum = useMemo(() => {
    const points = []
    for (let i = 0; i < 400; i++) {
      const lambda = 550 + i * 0.5
      let emission = 0
      peaks.forEach(peak => {
        const x = (lambda - peak.lambda) / 15
        emission += peak.intensity * Math.exp(-0.5 * x * x) * intFactor
      })
      points.push({ lambda, emission })
    }
    return points
  }, [intensity, oxygen, temperature, intFactor])

  const maxEmission = Math.max(...spectrum.map(p => p.emission), 0.1)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">💡 Emission spektr simulyatori — [PtOEP]</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-red-700/30 space-y-4">
        <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400 font-bold mb-2">💎 Qizil fosforessensiya — porfirin kompleksi:</p>
          <p className="text-purple-200 text-xs">
            [PtOEP] — <strong>oktaetilporfirin</strong> ligandli platina kompleksi.
            <strong> ³π-π*</strong> o'tish orqali <strong>qizil fosforessensiya</strong> (650 nm) chiqaradi.
            <strong> Φ ≈ 0.50</strong> (inert atmosfera) va <strong>τ ≈ 50 μs</strong> — porfirinlar orasida eng yuqori.
            Kislorod <strong>triplet kvenching</strong> orqali emissiyani o'chiradi — bu O₂ sensorlarining asosi.
          </p>
        </div>

        {/* BOSHQARUV */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">Qo'zg'alish to'lqin uzunligi:</span>
              <span className="text-emerald-400 font-mono">{excitation} nm</span>
            </label>
            <input type="range" min="300" max="550" step="5" value={excitation}
              onChange={(e) => setExcitation(parseInt(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-red-500" />
            <p className="text-purple-400 text-[10px] mt-1">
              Optimal: 380 nm (Soret bandi) yoki 510 nm (Q-bandi)
            </p>
          </div>
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">Intensivlik:</span>
              <span className="text-emerald-400 font-mono">{intensity}%</span>
            </label>
            <input type="range" min="10" max="100" step="5" value={intensity}
              onChange={(e) => setIntensity(parseInt(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-red-500" />
          </div>
        </div>

        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">Kislorod konsentratsiyasi:</span>
            <span className="text-emerald-400 font-mono">{oxygen}%</span>
          </label>
          <input type="range" min="0" max="100" step="1" value={oxygen}
            onChange={(e) => setOxygen(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-red-500" />
          <div className="flex justify-between text-[10px] text-purple-400 mt-1">
            <span>0% (inert)</span>
            <span>21% (havo)</span>
            <span>100% (toza O₂)</span>
          </div>
        </div>

        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">Harorat:</span>
            <span className="text-emerald-400 font-mono">{temperature} K</span>
          </label>
          <input type="range" min="200" max="400" step="10" value={temperature}
            onChange={(e) => setTemperature(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-red-500" />
          <div className="flex justify-between text-[10px] text-purple-400 mt-1">
            <span>200 K (sovuq)</span>
            <span>298 K (xona)</span>
            <span>400 K (issiq)</span>
          </div>
        </div>

        {/* SPEKTR */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-red-400 font-bold text-xs mb-2">
            Emission spektri (O₂={oxygen}%, T={temperature}K, λ<sub>exc</sub> = {excitation} nm)
          </h5>
          <svg viewBox="0 0 400 280" className="w-full h-64">
            <line x1="40" y1="240" x2="380" y2="240" stroke="#4c1d95" strokeWidth="1" />
            <line x1="40" y1="20" x2="40" y2="240" stroke="#4c1d95" strokeWidth="1" />
            
            <text x="210" y="275" fill="#c4b5fd" fontSize="9" textAnchor="middle">λ (nm)</text>
            <text x="40" y="270" fill="#a78bfa" fontSize="8">550</text>
            <text x="380" y="270" fill="#a78bfa" fontSize="8" textAnchor="end">750</text>
            <text x="20" y="130" fill="#a78bfa" fontSize="8" textAnchor="middle" transform="rotate(-90, 20, 130)">
              Intensivlik
            </text>

            {/* λ_max belgilari */}
            {peaks.map((peak, idx) => (
              <g key={idx}>
                <line x1={40 + ((peak.lambda - 550) / 200) * 340} y1="20" 
                  x2={40 + ((peak.lambda - 550) / 200) * 340} y2="240"
                  stroke={peak.intensity === 1.0 ? "#fbbf24" : "#a78bfa"} 
                  strokeWidth="0.5" strokeDasharray="2,2" />
                <text x={40 + ((peak.lambda - 550) / 200) * 340} y="15" 
                  fill={peak.intensity === 1.0 ? "#fbbf24" : "#a78bfa"} 
                  fontSize="7" textAnchor="middle">
                  {peak.lambda} nm
                </text>
                <text x={40 + ((peak.lambda - 550) / 200) * 340} y="25" 
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
              fill="none" stroke="#dc2626" strokeWidth="2"
            />

            <text x="200" y="35" fill="#dc2626" fontSize="9" textAnchor="middle" fontWeight="bold">
              PtOEP — ³π-π* fosforessensiya (650 nm)
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-4 gap-3 text-xs text-center">
          <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3">
            <p className="text-red-400">Asosiy cho'qqi</p>
            <p className="text-emerald-400 font-bold">650 nm</p>
            <p className="text-purple-400 text-[10px]">³π-π*</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Kislorod</p>
            <p className="text-emerald-400 font-bold">{oxygen}%</p>
            <p className="text-purple-400 text-[10px]">kvenching</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Harorat</p>
            <p className="text-emerald-400 font-bold">{temperature}K</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">FWHM</p>
            <p className="text-yellow-400 font-bold">~30 nm</p>
            <p className="text-purple-400 text-[10px]">tor</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun tor spektr?</p>
          <p className="text-purple-200">
            <strong>Porfirin</strong> — qattiq, planar struktura → tebranish erkinligi cheklangan
            <br/>
            <strong>³π-π*</strong> — ligand ichki o'tish → geometriya o'zgarishi minimal
            <br/>
            Natijada <strong>FWHM ≈ 30 nm</strong> — MLCT (80 nm) dan ancha tor.
            <br/>
            <strong>Vibron struktura</strong> ko'rinadi (645, 650, 695 nm cho'qqilar).
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. PORFIRIN LIGAND STRUKTURASI — OEP
// ============================================================================
function PorfirinStrukturasi() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔗 OEP ligand — oktaetilporfirin</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-red-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-red-400 font-bold mb-3">Porfirin strukturasi:</h4>
            <svg viewBox="0 0 200 200" className="w-full h-48">
              {/* 4 ta pirrol halqasi */}
              <polygon points="100,40 120,50 120,70 100,80 80,70 80,50" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
              <polygon points="140,80 150,100 140,120 120,120 120,100" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
              <polygon points="100,120 120,130 120,150 100,160 80,150 80,130" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
              <polygon points="80,100 80,120 60,120 50,100 60,80 80,80" fill="none" stroke="#a78bfa" strokeWidth="1.5" />

              {/* Bog'lar */}
              <line x1="120" y1="70" x2="120" y2="80" stroke="#a78bfa" strokeWidth="1.5" />
              <line x1="120" y1="120" x2="120" y2="130" stroke="#a78bfa" strokeWidth="1.5" />
              <line x1="80" y1="130" x2="80" y2="120" stroke="#a78bfa" strokeWidth="1.5" />
              <line x1="80" y1="80" x2="80" y2="70" stroke="#a78bfa" strokeWidth="1.5" />

              {/* Ichki N atomlari */}
              <circle cx="100" cy="70" r="5" fill="#3b82f6" />
              <text x="100" y="73" fill="white" fontSize="5" textAnchor="middle">N</text>
              <circle cx="130" cy="100" r="5" fill="#3b82f6" />
              <text x="130" y="103" fill="white" fontSize="5" textAnchor="middle">N</text>
              <circle cx="100" cy="130" r="5" fill="#3b82f6" />
              <text x="100" y="133" fill="white" fontSize="5" textAnchor="middle">N</text>
              <circle cx="70" cy="100" r="5" fill="#3b82f6" />
              <text x="70" y="103" fill="white" fontSize="5" textAnchor="middle">N</text>

              {/* Markaziy Pt */}
              <circle cx="100" cy="100" r="10" fill="#dc2626" />
              <text x="100" y="104" fill="white" fontSize="8" textAnchor="middle" fontWeight="bold">Pt</text>

              <text x="100" y="180" fill="#a78bfa" fontSize="8" textAnchor="middle">
                Porfirin halqasi (4 × pyrrole)
              </text>
              <text x="100" y="195" fill="#dc2626" fontSize="7" textAnchor="middle">
                Tetradentat (N,N,N,N)
              </text>
            </svg>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-red-400 font-bold mb-3">Xususiyatlari:</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Turi:</span>
                <span className="text-red-400 font-bold">Tetradentat (N₄)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Zaryad:</span>
                <span className="text-red-400">2− (dianion)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">π-elektronlar:</span>
                <span className="text-red-400">26 (aromatik)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Geometriya:</span>
                <span className="text-red-400">Kvadrat planar</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Simmetriya:</span>
                <span className="text-red-400">D<sub>4h</sub></span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">OEP o'rinbosarlari:</span>
                <span className="text-red-400">8 × C₂H₅</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-red-400 font-bold text-xs mb-3">Porfirin yutilish spektri:</h5>
          <svg viewBox="0 0 400 150" className="w-full h-36">
            <line x1="40" y1="130" x2="380" y2="130" stroke="#4c1d95" strokeWidth="1" />
            <line x1="40" y1="20" x2="40" y2="130" stroke="#4c1d95" strokeWidth="1" />
            
            <text x="210" y="145" fill="#c4b5fd" fontSize="9" textAnchor="middle">λ (nm)</text>
            <text x="40" y="140" fill="#a78bfa" fontSize="8">300</text>
            <text x="380" y="140" fill="#a78bfa" fontSize="8" textAnchor="end">700</text>

            {/* Soret bandi */}
            <polyline
              points="120,130 140,125 150,100 160,40 170,100 180,125 200,130"
              fill="none" stroke="#a78bfa" strokeWidth="2"
            />
            <text x="160" y="35" fill="#a78bfa" fontSize="8" textAnchor="middle">Soret</text>
            <text x="160" y="145" fill="#a78bfa" fontSize="7" textAnchor="middle">380 nm</text>

            {/* Q-bandlari */}
            <polyline
              points="260,130 270,125 280,110 290,125 300,130"
              fill="none" stroke="#a78bfa" strokeWidth="1.5"
            />
            <polyline
              points="300,130 310,125 320,115 330,125 340,130"
              fill="none" stroke="#a78bfa" strokeWidth="1.5"
            />
            <text x="290" y="105" fill="#a78bfa" fontSize="7" textAnchor="middle">Q-bands</text>
            <text x="290" y="145" fill="#a78bfa" fontSize="7" textAnchor="middle">510, 540 nm</text>
          </svg>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Soret va Q-bandlari:</p>
          <p className="text-purple-200">
            <strong>Soret bandi</strong> (380 nm) — eng kuchli yutish (ε ≈ 200,000 M⁻¹cm⁻¹).
            <br/>
            <strong>Q-bandlari</strong> (510, 540 nm) — kuchsizroq, lekin ko'rinadigan sohada.
            <br/>
            Bu xususiyat <strong>chuqur to'qima bioimaging</strong> uchun muhim — ko'rinadigan yorug'lik to'qimadan yaxshi o'tadi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. ³π-π* MECHANIZMI
// ============================================================================
function PiMechanizmi() {
  const [step, setStep] = useState(0)

  const steps = [
    {
      title: "1. Soret/Q-band yutish",
      desc: "Porfirin π-sistemasi yorug'likni yutadi (¹π-π*)",
      formula: "PtOEP + hν (380 nm) → ¹π-π*",
      icon: "💡"
    },
    {
      title: "2. ISC — ¹π-π* → ³π-π*",
      desc: "Og'ir atom effekti (Pt, Z=78) → ISC juda tez (~100 fs)",
      formula: "¹π-π* → ³π-π*",
      icon: "🔄"
    },
    {
      title: "3. ³π-π* holatida yashash",
      desc: "Triplet holatda ~50 μs yashaydi — juda uzoq!",
      formula: "³π-π* — metastabil holat",
      icon: "⏱️"
    },
    {
      title: "4. Fosforessensiya",
      desc: "³π-π* → ¹GS o'tish → qizil nurlanish (650 nm)",
      formula: "³π-π* → PtOEP + hν' (650 nm)",
      icon: "✨"
    }
  ]

  const s = steps[step]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚡ ³π-π* mexanizmi — fosforessensiya</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-red-700/30 space-y-4">
        <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400 font-bold mb-2">💎 Ligand ichki o'tish:</p>
          <p className="text-purple-200 text-xs">
            [PtOEP] da emissiya <strong>³π-π*</strong> o'tish — bu <strong>ligand ichki</strong> o'tish.
            MLCT emas, chunki porfirin <strong>kuchli xelatlovchi</strong> — elektron zichligi metallga ko'chmaydi.
            <br/>
            Natijada <strong>tor spektr</strong> va <strong>uzoq τ</strong> — geometriya o'zgarishi minimal.
          </p>
        </div>

        {/* STEP NAVIGATION */}
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <button key={i} onClick={() => setStep(i)}
              className={`flex-1 px-2 py-2 rounded-lg text-xs font-bold transition-all ${
                step === i 
                  ? "bg-red-600/80 text-white shadow-lg" 
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
            <h4 className="text-red-400 font-bold text-lg">{s.title}</h4>
          </div>
          <p className="text-purple-200 text-sm mb-3">{s.desc}</p>
          <div className="bg-purple-900/50 rounded p-3 font-mono text-xs text-center text-emerald-400">
            {s.formula}
          </div>
        </div>

        {/* VIZUALIZATSIYA */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-red-400 font-bold text-xs mb-3">Energiya sathlari diagrammasi:</h5>
          <svg viewBox="0 0 400 250" className="w-full h-60">
            <line x1="50" y1="230" x2="50" y2="20" stroke="#4c1d95" strokeWidth="1" />
            <text x="30" y="125" fill="#c4b5fd" fontSize="9" textAnchor="middle" transform="rotate(-90, 30, 125)">
              Energiya
            </text>

            {/* Ground state */}
            <rect x="80" y="200" width="80" height="20" fill="#3b82f6" opacity="0.3" />
            <text x="120" y="215" fill="#3b82f6" fontSize="9" textAnchor="middle">¹GS</text>

            {/* ¹π-π* */}
            <rect x="80" y="60" width="80" height="20" fill="#f59e0b" opacity="0.3" />
            <text x="120" y="75" fill="#f59e0b" fontSize="9" textAnchor="middle">¹π-π*</text>

            {/* ³π-π* */}
            <rect x="80" y="100" width="80" height="20" fill="#ef4444" opacity="0.3" />
            <text x="120" y="115" fill="#ef4444" fontSize="9" textAnchor="middle">³π-π*</text>

            {/* O'tishlar */}
            <line x1="120" y1="200" x2="120" y2="80" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrowY)" />
            <text x="135" y="140" fill="#fbbf24" fontSize="8">hν (380 nm)</text>

            <path d="M 160 70 Q 180 85 160 100" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="3,2" />
            <text x="190" y="85" fill="#8b5cf6" fontSize="8">ISC (~100 fs)</text>

            <line x1="120" y1="120" x2="120" y2="200" stroke="#dc2626" strokeWidth="2" markerEnd="url(#arrowR)" />
            <text x="135" y="160" fill="#dc2626" fontSize="8">hν' (650 nm)</text>

            <text x="250" y="50" fill="#c4b5fd" fontSize="8">Singlet (S=0)</text>
            <text x="250" y="110" fill="#c4b5fd" fontSize="8">Triplet (S=1)</text>

            <defs>
              <marker id="arrowY" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
                <polygon points="0,0 5,2.5 0,5" fill="#fbbf24" />
              </marker>
              <marker id="arrowR" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
                <polygon points="0,0 5,2.5 0,5" fill="#dc2626" />
              </marker>
            </defs>
          </svg>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun τ juda uzoq?</p>
          <p className="text-purple-200">
            <strong>³π-π* → ¹GS</strong> — spin taqiqlangan o'tish → sekin (τ ≈ 50 μs).
            <br/>
            <strong>Pt (Z=78)</strong> — eng og'ir → kuchli spin-orbital → ISC tez, lekin fosforessensiya baribir sekin.
            <br/>
            <strong>Porfirin</strong> — qattiq struktura → tebranish relaksatsiyasi kam → uzoq τ.
            <br/>
            Bu <strong>kislorod sensorlari</strong> uchun ideal — O₂ bilan o'zaro ta'sir uchun vaqt bor!
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. KISLOROD KVENCHING — STERN-VOLMER (BATAFSIL)
// ============================================================================
function O2Kvenching() {
  const [o2, setO2] = useState(0)
  
  // Stern-Volmer: I₀/I = 1 + K_SV[O₂]
  const K_SV = 0.05 // typical value for PtOEP
  const ratio = 1 + K_SV * o2
  const phi = 0.50 / ratio
  const tau = 50 / ratio

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🫁 Kislorod kvenching — Stern-Volmer tahlili</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-red-700/30 space-y-4">
        <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400 font-bold mb-2">💎 Eng muhim xususiyat:</p>
          <p className="text-purple-200 text-xs">
            [PtOEP] — <strong>kislorod sensori</strong> sifatida eng ko'p qo'llaniladigan kompleks.
            O₂ triplet holatda (³Σ<sub>g</sub>) → ³π-π* bilan energiya almashinadi → emissiya o'chadi.
            <strong> Stern-Volmer tenglamasi</strong> orqali [O₂] aniqlanadi.
          </p>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4 font-mono text-center">
          <p className="text-purple-400 text-xs mb-2">Stern-Volmer tenglamasi:</p>
          <p className="text-red-400 text-lg">I₀/I = τ₀/τ = 1 + K<sub>SV</sub>[O₂]</p>
          <p className="text-purple-400 text-xs mt-2">
            I₀, τ₀ — inert atmosferada | I, τ — O₂ borligida | K<sub>SV</sub> — Stern-Volmer konstantasi
          </p>
        </div>

        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">[O₂] (%):</span>
            <span className="text-emerald-400 font-mono">{o2}%</span>
          </label>
          <input type="range" min="0" max="100" step="1" value={o2}
            onChange={(e) => setO2(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-red-500" />
          <div className="flex justify-between text-[10px] text-purple-400 mt-1">
            <span>0% (inert)</span>
            <span>21% (havo)</span>
            <span>100% (toza O₂)</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 text-xs text-center">
          <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3">
            <p className="text-red-400">I₀/I</p>
            <p className="text-emerald-400 font-bold font-mono text-2xl">{ratio.toFixed(2)}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Φ</p>
            <p className="text-emerald-400 font-bold font-mono text-2xl">{phi.toFixed(3)}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">τ (μs)</p>
            <p className="text-emerald-400 font-bold font-mono text-2xl">{tau.toFixed(1)}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Kvenching</p>
            <p className="text-yellow-400 font-bold">{((1 - 1/ratio) * 100).toFixed(0)}%</p>
          </div>
        </div>

        {/* Stern-Volmer grafigi */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-red-400 font-bold text-xs mb-2">Stern-Volmer grafigi:</h5>
          <svg viewBox="0 0 400 200" className="w-full h-48">
            <line x1="50" y1="180" x2="380" y2="180" stroke="#4c1d95" strokeWidth="1" />
            <line x1="50" y1="20" x2="50" y2="180" stroke="#4c1d95" strokeWidth="1" />
            
            <text x="215" y="195" fill="#c4b5fd" fontSize="9" textAnchor="middle">[O₂] (%)</text>
            <text x="30" y="100" fill="#c4b5fd" fontSize="9" textAnchor="middle" transform="rotate(-90, 30, 100)">
              I₀/I
            </text>

            {/* To'g'ri chiziq */}
            <line x1="50" y1="180" x2="380" y2="40" stroke="#dc2626" strokeWidth="2" />

            {/* Joriy nuqta */}
            <circle cx={50 + (o2 / 100) * 330} cy={180 - (ratio - 1) / 5 * 140} r="5" fill="#fbbf24" />

            <text x="50" y="195" fill="#a78bfa" fontSize="7">0</text>
            <text x="380" y="195" fill="#a78bfa" fontSize="7" textAnchor="end">100</text>
            <text x="45" y="180" fill="#a78bfa" fontSize="7" textAnchor="end">1.0</text>
            <text x="45" y="40" fill="#a78bfa" fontSize="7" textAnchor="end">6.0</text>
          </svg>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun [PtOEP] kislorod sensorlari uchun ideal?</p>
          <ul className="text-purple-200 space-y-1 list-disc list-inside">
            <li><strong>Uzoq τ</strong> (50 μs) — o'lchash oson, arzon elektronika yetarli</li>
            <li><strong>Katta K<sub>SV</sub></strong> (0.05 %⁻¹) — yuqori sezgirlik</li>
            <li><strong>Chiziqli javob</strong> — Stern-Volmer to'g'ri chiziq</li>
            <li><strong>Fotobarqaror</strong> — minglab o'lchovlar qilish mumkin</li>
            <li><strong>Qizil emissiya</strong> — to'qimadan yaxshi o'tadi (bioimaging)</li>
            <li><strong>Tez javob</strong> — O₂ diffuziyasi tez (ms darajada)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. Φ VA TAU — MATRITSA VA HARORAT TA'SIRI
// ============================================================================
function PhiVaTau() {
  const [temperature, setTemperature] = useState(298)
  const [matrix, setMatrix] = useState("polimer")

  const matrixFactors = {
    "eritma": { factor: 1.0, desc: "Organik erituvchi (DCM, toluol)" },
    "polimer": { factor: 0.95, desc: "Polimer plyonka (PS, PMMA)" },
    "sol-gel": { factor: 0.90, desc: "Silika sol-gel matritsa" },
    "nanopartikula": { factor: 0.85, desc: "Polimer nanopartikula" }
  }
  const matrixFactor = matrixFactors[matrix].factor
  const phi = Math.max(0.05, 0.50 * matrixFactor * (1 - (temperature - 298) / 500))
  const tau = Math.max(5, 50 * matrixFactor * (1 - (temperature - 298) / 500))

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📊 Φ va τ — matritsa va harorat ta'siri</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-red-700/30 space-y-4">
        <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400 font-bold mb-2">💎 Matritsa muhim:</p>
          <p className="text-purple-200 text-xs">
            [PtOEP] <strong>turli matritsalarda</strong> qo'llaniladi: eritma, polimer plyonka, sol-gel, nanopartikula.
            Har bir matritsa <strong>Φ va τ</strong> ga ta'sir qiladi.
            <br/>
            <strong>Polimer plyonka</strong> — eng ko'p qo'llaniladi (sensorlar uchun).
            <br/>
            <strong>Nanopartikula</strong> — bioimaging uchun.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {Object.entries(matrixFactors).map(([id, data]) => (
            <button key={id} onClick={() => setMatrix(id)}
              className={`px-2 py-2 rounded-lg text-[10px] font-bold transition-all ${
                matrix === id ? "bg-red-600/80 text-white shadow-lg" : "bg-purple-800/40 text-purple-300"
              }`}>
              <div>{id}</div>
              <div className="text-[9px] opacity-70 mt-1">×{data.factor}</div>
            </button>
          ))}
        </div>

        <div className="bg-purple-950/50 rounded-lg p-3">
          <p className="text-purple-300 text-xs">{matrixFactors[matrix].desc}</p>
        </div>

        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">Harorat:</span>
            <span className="text-emerald-400 font-mono">{temperature} K</span>
          </label>
          <input type="range" min="200" max="400" step="10" value={temperature}
            onChange={(e) => setTemperature(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-red-500" />
          <div className="flex justify-between text-[10px] text-purple-400 mt-1">
            <span>200 K (sovuq)</span>
            <span>298 K (xona)</span>
            <span>400 K (issiq)</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-center">
          <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3">
            <p className="text-red-400">Φ (inert)</p>
            <p className="text-emerald-400 font-bold font-mono text-2xl">{phi.toFixed(3)}</p>
            <p className="text-purple-400 text-[10px]">{phi > 0.45 ? "✓ Juda yuqori" : phi > 0.35 ? "○ Yuqori" : "✗ O'rtacha"}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">τ (μs, inert)</p>
            <p className="text-emerald-400 font-bold font-mono text-2xl">{tau.toFixed(1)}</p>
            <p className="text-purple-400 text-[10px]">{tau > 40 ? "✓ Juda uzoq" : tau > 30 ? "○ Uzoq" : "✗ O'rtacha"}</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Harorat ta'siri:</p>
          <p className="text-purple-200">
            Harorat oshishi → <strong>tebranish relaksatsiyasi</strong> kuchayadi → nurlanishsiz yo'qotishlar oshadi.
            <br/>
            Φ va τ <strong>kamayadi</strong>.
            <br/>
            Shuning uchun sensorlar <strong>xona haroratida</strong> kalibrlanadi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 6. SOLISHTIRISH — BOSHQA PORFIRINLAR
// ============================================================================
function Solishtirish() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 Boshqa porfirinlar bilan solishtirish</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-red-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-2 text-yellow-400">Kompleks</th>
                <th className="text-center py-3 px-2 text-yellow-400">Metal</th>
                <th className="text-center py-3 px-2 text-yellow-400">λ<sub>em</sub></th>
                <th className="text-center py-3 px-2 text-yellow-400">Φ</th>
                <th className="text-center py-3 px-2 text-yellow-400">τ</th>
                <th className="text-center py-3 px-2 text-yellow-400">O₂ sezgirlik</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["[PtOEP]", "Pt²⁺ (Z=78)", "650 nm", "0.50", "50 μs", "Juda yuqori"],
                ["[PdOEP]", "Pd²⁺ (Z=46)", "660 nm", "0.30", "300 μs", "Yuqori"],
                ["[ZnTPP]", "Zn²⁺ (Z=30)", "600 nm", "0.03", "2 ns", "Past"],
                ["[H₂TPP]", "Yo'q", "650 nm", "0.11", "12 ns", "Past"],
                ["[RuOEP]", "Ru²⁺ (Z=44)", "620 nm", "0.05", "1 μs", "O'rtacha"],
                ["[PtTPP]", "Pt²⁺ (Z=78)", "650 nm", "0.45", "45 μs", "Juda yuqori"],
              ].map((r, i) => (
                <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${i === 0 ? 'bg-red-900/20' : ''}`}>
                  <td className={`py-2 px-2 font-bold ${i === 0 ? 'text-red-400' : 'text-purple-300'}`}>{r[0]}</td>
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
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 text-xs">
            <p className="text-red-400 font-bold mb-1">Pt²⁺ afzalligi:</p>
            <p className="text-purple-200">
              <strong>Eng og'ir</strong> (Z=78) → kuchli spin-orbital → samarali ISC.
              <br/>
              <strong>Φ = 0.50</strong> — porfirinlar orasida eng yuqori.
              <br/>
              <strong>τ = 50 μs</strong> — O₂ bilan o'zaro ta'sir uchun ideal.
            </p>
          </div>
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3 text-xs">
            <p className="text-purple-400 font-bold mb-1">Pd²⁺ vs Pt²⁺:</p>
            <p className="text-purple-200">
              <strong>PdOEP</strong> — uzoqroq τ (300 μs), lekin past Φ (0.30).
              <br/>
              Uzoq τ → yuqori sezgirlik, lekin past Φ → past signal.
              <br/>
              <strong>PtOEP</strong> — optimal muvozanat: yuqori Φ + yetarli τ.
            </p>
          </div>
        </div>

        <div className="mt-4 bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 OEP vs TPP:</p>
          <p className="text-purple-200">
            <strong>OEP</strong> (oktaetilporfirin) — etil guruhlar → eruvchanlik yaxshi.
            <br/>
            <strong>TPP</strong> (tetrafenilporfirin) — fenil guruhlar → fotobarqarorlik yaxshi.
            <br/>
            Ikkalasi ham ishlatiladi, lekin <strong>OEP</strong> ko'proq (eruvchanlik muhim).
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

      <div className="bg-purple-800/30 rounded-xl p-5 border border-red-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🫁</div>
            <h4 className="text-red-400 font-bold mb-2">Kislorod sensorlari</h4>
            <p className="text-purple-200 text-xs">
              <strong>Eng keng qo'llanilish</strong>. Tibbiyot, sanoat, atrof-muhit monitoringi.
              <br/>
              <strong>Qon O₂</strong> — qon gazlari tahlili (pO₂).
              <br/>
              <strong>Havo O₂</strong> — atmosfera monitoringi.
              <br/>
              <strong>Suv O₂</strong> — suv sifati nazorati.
              <br/>
              Optodlar, fiber-optik sensorlar, planar sensorlar.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🏥</div>
            <h4 className="text-red-400 font-bold mb-2">PDT (Photodynamic Therapy)</h4>
            <p className="text-purple-200 text-xs">
              <strong>Saraton davolash</strong>. Yorug'lik + [PtOEP] + O₂ → singlet kislorod (¹O₂).
              <br/>
              ¹O₂ → saraton hujayralarini o'ldiradi.
              <br/>
              <strong>Qizil emissiya</strong> (650 nm) → chuqur to'qimaga o'tadi (5-10 mm).
              <br/>
              Teri saratoni, o'pka saratoni, bosh-bo'yin saratoni.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🔬</div>
            <h4 className="text-red-400 font-bold mb-2">Bioimaging</h4>
            <p className="text-purple-200 text-xs">
              <strong>Hujayra va to'qimalarni tasvirlash</strong>.
              <br/>
              <strong>Uzoq τ</strong> (50 μs) → vaqt-ajraladigan tahlil (TRF).
              <br/>
              Autofluoressensiya (τ ≈ 1-10 ns) o'chadi → yuqori kontrast.
              <br/>
              <strong>O₂ xaritasi</strong> — hujayra metabolizmini kuzatish.
              <br/>
              Tumor gipoksiyasi (past O₂) aniqlash.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">💡</div>
            <h4 className="text-red-400 font-bold mb-2">Yoritish va displeylar</h4>
            <p className="text-purple-200 text-xs">
              <strong>Qizil fosforessent materiallar</strong>.
              <br/>
              <strong>OLED</strong> da qizil piksel sifatida (kam qo'llaniladi — Ir(ppy)₃ yaxshiroq).
              <br/>
              <strong>Signal chiroqlari</strong>, indikatorlar.
              <br/>
              <strong>Xavfsizlik belgilari</strong> — UV nur ostida qizil porlaydi.
            </p>
          </div>
        </div>

        <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400 font-bold mb-2">🌟 Qiziqarli faktlar:</p>
          <ul className="text-purple-200 text-xs space-y-2">
            <li>
              <strong>Mars roverlarida</strong> ham [PtOEP] asosidagi O₂ sensorlari bor —
              Mars atmosferasini o'lchash uchun!
            </li>
            <li>
              <strong>Xalqaro kosmik stansiyada</strong> (ISS) astronavtlar qonidagi O₂ ni
              [PtOEP] sensorlar bilan o'lchashadi.
            </li>
            <li>
              <strong>Suv tozalash inshootlarida</strong> suvdagi erigan O₂ ni [PtOEP] sensorlar
              bilan uzluksiz monitoring qilishadi.
            </li>
            <li>
              <strong>PDT</strong> — saraton davolashning yangi usuli. Kimyoterapiya va radioterapiya
              o'rniga yoki ular bilan birga ishlatiladi.
            </li>
            <li>
              [PtOEP] — <strong>kislorod sensorlarining "oltin standarti"</strong>.
              Har yili <strong>milliardlab dollar</strong>lik tibbiy va sanoat sensorlarida ishlatiladi.
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
export default function PtOEPFluoressensiya() {
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
          <span className="text-red-400">[PtOEP]</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-red-400">💡 [PtOEP] — Fluoressensiya tahlili</h1>
          <p className="text-purple-400 text-sm">
            Pt²⁺ • Porfirin • Fosforessensiya standarti • Φ ≈ 0.50 • τ ≈ 50 μs • O₂ sensorlari
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        <div className="bg-purple-900/40 border border-red-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-4xl md:text-5xl font-extrabold font-mono text-red-400">[PtOEP]</span>
            <div>
              <h2 className="text-xl font-bold text-white">Fluoressensiya tahlili — to'liq profil</h2>
              <p className="text-purple-400">"Fosforessensiya standarti" — kislorod sensorlari</p>
            </div>
          </div>

          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              [PtOEP] — <strong className="text-red-400">kislorod sensorlarining oltin standarti</strong>.
              Pt²⁺ (5d⁸) <strong>oktaetilporfirin</strong> ligand bilan o'ralgan.
              <strong> ³π-π*</strong> o'tish orqali <strong>qizil fosforessensiya</strong> (650 nm) chiqaradi.
              <strong> Φ ≈ 0.50</strong> (inert) va <strong>τ ≈ 50 μs</strong> — O₂ bilan o'zaro ta'sir uchun ideal.
              Stern-Volmer tenglamasi orqali [O₂] aniqlanadi. PDT va bioimagingda ham qo'llaniladi.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-red-400 font-bold text-lg">Pt²⁺ (5d⁸)</p>
              <p className="text-purple-300">kvadrat planar</p>
              <p className="text-purple-400 mt-1">S = 0</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-red-400 font-bold text-lg">λ<sub>em</sub> = 650</p>
              <p className="text-purple-300">nm</p>
              <p className="text-purple-400 mt-1">qizil</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-red-400 font-bold text-lg">Φ ≈ 0.50</p>
              <p className="text-purple-300">kvant unumi</p>
              <p className="text-purple-400 mt-1">(inert)</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-red-400 font-bold text-lg">τ ≈ 50</p>
              <p className="text-purple-300">μs</p>
              <p className="text-purple-400 mt-1">uzoq</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <EmissionSpectrumSimulator />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <PorfirinStrukturasi />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <PiMechanizmi />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <O2Kvenching />
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

        <div className="bg-gradient-to-r from-red-600/10 to-purple-600/10 border border-red-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>[PtOEP] — <strong className="text-red-400">kislorod sensorlarining oltin standarti</strong></li>
            <li>Pt²⁺ (5d⁸) — <strong>kvadrat planar</strong> geometriya, S = 0</li>
            <li><strong>Porfirin ligand</strong> — tetradentat (N₄), 26 π-elektron, aromatik</li>
            <li><strong>³π-π*</strong> o'tish — ligand ichki, qizil fosforessensiya (650 nm)</li>
            <li><strong>Φ ≈ 0.50</strong> (inert) — porfirinlar orasida eng yuqori</li>
            <li><strong>τ ≈ 50 μs</strong> — O₂ bilan o'zaro ta'sir uchun ideal vaqt</li>
            <li><strong>Stern-Volmer</strong> — chiziqli O₂ javob, I₀/I = 1 + K<sub>SV</sub>[O₂]</li>
            <li><strong>Kislorod kvenching</strong> — triplet-triplet energiya almashinuvi</li>
            <li><strong>Tor spektr</strong> (FWHM ≈ 30 nm) — porfirin qattiq strukturasi</li>
            <li>Qo'llanilish: <strong>O₂ sensorlari, PDT, bioimaging, yoritish</strong></li>
            <li><strong>Mars roverlarida</strong> ham ishlatiladi — atmosfera O₂ o'lchash</li>
            <li>Har yili <strong>milliardlab dollar</strong>lik sensorlarda ishlatiladi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/fluoressensiya/birikmalar/re-bpy-co3-cl" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← [Re(bpy)(CO)₃Cl]
          </Link>
          <Link href="/ilmiy/tahlil/fluoressensiya/birikmalar/zn-quin2" className="px-6 py-3 bg-red-600/80 rounded-xl hover:bg-red-500 text-white font-semibold">
            [Zn(quin)₂] →
          </Link>
        </div>
      </section>
    </main>
  )
}