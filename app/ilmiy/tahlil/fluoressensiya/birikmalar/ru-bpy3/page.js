"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. EMISSION SPEKTR SIMULYATORI ([Ru(bpy)₃]²⁺ uchun)
// ============================================================================
function EmissionSpectrumSimulator() {
  const [excitation, setExcitation] = useState(450)
  const [intensity, setIntensity] = useState(100)
  const [solvent, setSolvent] = useState("suv")
  const [oxygen, setOxygen] = useState(0) // % kislorod

  // Ru²⁺ ning MLCT emission cho'qqilari (keng band)
  const peaks = [
    { lambda: 580, intensity: 0.5, assign: "³MLCT" },
    { lambda: 620, intensity: 1.0, assign: "³MLCT (max)" },
    { lambda: 660, intensity: 0.7, assign: "³MLCT" },
    { lambda: 700, intensity: 0.3, assign: "³MLCT" },
  ]

  // Erituvchi va kislorod ta'siri
  const solventFactors = {
    "suv": 0.4,
    "metanol": 0.7,
    "asetonitril": 0.9,
    "dmso": 1.0
  }
  const solventFactor = solventFactors[solvent]
  const oxygenFactor = 1 - (oxygen / 100) * 0.8 // kislorod kvenching

  const intFactor = (intensity / 100) * solventFactor * oxygenFactor

  // Emission spektri (keng band)
  const spectrum = useMemo(() => {
    const points = []
    for (let i = 0; i < 400; i++) {
      const lambda = 500 + i * 0.75 // 500-800 nm
      let emission = 0

      peaks.forEach(peak => {
        // MLCT uchun keng cho'qqilar (FWHM ≈ 80 nm)
        const x = (lambda - peak.lambda) / 40
        emission += peak.intensity * Math.exp(-0.5 * x * x) * intFactor
      })

      points.push({ lambda, emission })
    }
    return points
  }, [intensity, solvent, oxygen, intFactor])

  const maxEmission = Math.max(...spectrum.map(p => p.emission), 0.1)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">💡 Emission spektr simulyatori — [Ru(bpy)₃]²⁺</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-orange-700/30 space-y-4">
        <div className="bg-orange-600/10 border border-orange-500/30 rounded-lg p-4">
          <p className="text-orange-400 font-bold mb-2">💎 MLCT emissiya — keng band:</p>
          <p className="text-purple-200 text-xs">
            [Ru(bpy)₃]²⁺ ning emission spektri <strong>keng band</strong> ko'rinishida (FWHM ≈ 80 nm).
            Bu lantanidlarning <strong>tor chiziqli spektridan</strong> tubdan farq qiladi.
            Sababi: MLCT o'tish <strong>ligand π* orbitaliga</strong> bo'ladi → vibron kengayish kuchli.
            <strong> Φ ≈ 0.04</strong> (suvda) va <strong>τ ≈ 600 ns</strong> — o'tish metallari uchun xarakterli.
          </p>
        </div>

        {/* BOSHQARUV */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">Qo'zg'alish to'lqin uzunligi:</span>
              <span className="text-emerald-400 font-mono">{excitation} nm</span>
            </label>
            <input type="range" min="350" max="500" step="5" value={excitation}
              onChange={(e) => setExcitation(parseInt(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-orange-500" />
            <p className="text-purple-400 text-[10px] mt-1">
              Optimal: 450 nm (MLCT yutish)
            </p>
          </div>
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">Intensivlik:</span>
              <span className="text-emerald-400 font-mono">{intensity}%</span>
            </label>
            <input type="range" min="10" max="100" step="5" value={intensity}
              onChange={(e) => setIntensity(parseInt(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-orange-500" />
          </div>
        </div>

        <div>
          <label className="text-xs text-yellow-400 font-bold mb-2 block">Erituvchi:</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: "suv", name: "Suv", factor: "0.4" },
              { id: "metanol", name: "Metanol", factor: "0.7" },
              { id: "asetonitril", name: "CH₃CN", factor: "0.9" },
              { id: "dmso", name: "DMSO", factor: "1.0" }
            ].map(s => (
              <button key={s.id} onClick={() => setSolvent(s.id)}
                className={`px-2 py-2 rounded-lg text-[10px] font-bold transition-all ${
                  solvent === s.id 
                    ? "bg-orange-600/80 text-white shadow-lg" 
                    : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
                }`}>
                <div>{s.name}</div>
                <div className="text-[9px] opacity-70 mt-1">Φ×{s.factor}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">Kislorod konsentratsiyasi:</span>
            <span className="text-emerald-400 font-mono">{oxygen}%</span>
          </label>
          <input type="range" min="0" max="100" step="5" value={oxygen}
            onChange={(e) => setOxygen(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-orange-500" />
          <p className="text-purple-400 text-[10px] mt-1">
            Kislorod — triplet kvenching (³MLCT ni o'chiradi)
          </p>
        </div>

        {/* SPEKTR */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-orange-400 font-bold text-xs mb-2">
            Emission spektri ({solvent}, O₂={oxygen}%, λ<sub>exc</sub> = {excitation} nm)
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

            {/* λ_max belgisi */}
            <line x1={40 + ((620 - 500) / 300) * 340} y1="20" 
              x2={40 + ((620 - 500) / 300) * 340} y2="240"
              stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x={40 + ((620 - 500) / 300) * 340} y="15" 
              fill="#fbbf24" fontSize="7" textAnchor="middle">
              620 nm (³MLCT max)
            </text>

            {/* Emission spektri */}
            <polyline
              points={spectrum.map((p, i) => {
                const x = 40 + (i / 400) * 340
                const y = 240 - (p.emission / maxEmission) * 210
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke="#f97316" strokeWidth="2"
            />

            <text x="200" y="35" fill="#f97316" fontSize="9" textAnchor="middle" fontWeight="bold">
              Ru²⁺ — qizil MLCT emissiya (620 nm)
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          <div className="bg-orange-900/30 border border-orange-500/50 rounded-lg p-3">
            <p className="text-orange-400">Asosiy cho'qqi</p>
            <p className="text-emerald-400 font-bold">620 nm</p>
            <p className="text-purple-400 text-[10px]">³MLCT</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Erituvchi</p>
            <p className="text-emerald-400 font-bold">{solvent}</p>
            <p className="text-purple-400 text-[10px]">Φ×{solventFactor}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Kislorod</p>
            <p className="text-emerald-400 font-bold">{oxygen}%</p>
            <p className="text-purple-400 text-[10px]">kvenching</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Lantanid vs O'tish metallari:</p>
          <p className="text-purple-200">
            <strong>Lantanidlar</strong> — tor chiziqli spektr (FWHM ≈ 3 nm), f-f o'tishlar
            <br/>
            <strong>Ru²⁺</strong> — keng band (FWHM ≈ 80 nm), MLCT o'tish
            <br/>
            Sababi: MLCT da elektron <strong>ligand π* orbitaliga</strong> o'tadi → vibron kengayish kuchli.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. BPY LIGAND STRUKTURASI
// ============================================================================
function BpyLigand() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔗 bpy ligand — 2,2'-bipiridin</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-orange-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-orange-400 font-bold mb-3">bpy strukturasi:</h4>
            <svg viewBox="0 0 200 180" className="w-full h-44">
              {/* Chap piridin halqasi */}
              <polygon points="40,70 60,60 80,70 80,90 60,100 40,90" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
              
              {/* Bog' */}
              <line x1="80" y1="80" x2="120" y2="80" stroke="#a78bfa" strokeWidth="2" />

              {/* O'ng piridin halqasi */}
              <polygon points="120,70 140,60 160,70 160,90 140,100 120,90" fill="none" stroke="#a78bfa" strokeWidth="1.5" />

              {/* Ichki N atomlari */}
              <circle cx="60" cy="100" r="6" fill="#3b82f6" />
              <text x="60" y="103" fill="white" fontSize="6" textAnchor="middle">N</text>
              
              <circle cx="140" cy="100" r="6" fill="#3b82f6" />
              <text x="140" y="103" fill="white" fontSize="6" textAnchor="middle">N</text>

              {/* Xelat belgisi */}
              <path d="M 60 100 Q 100 130 140 100" fill="none" stroke="#f97316" strokeWidth="1.5" strokeDasharray="3,2" />
              <text x="100" y="140" fill="#f97316" fontSize="8" textAnchor="middle">
                Bidentat (N,N)
              </text>

              <text x="100" y="165" fill="#a78bfa" fontSize="8" textAnchor="middle">
                2,2'-bipiridin (bpy)
              </text>
              <text x="100" y="180" fill="#f97316" fontSize="7" textAnchor="middle">
                12 π-elektron, π-akseptor
              </text>
            </svg>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-orange-400 font-bold mb-3">Xususiyatlari:</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Turi:</span>
                <span className="text-orange-400 font-bold">Bidentat (N,N)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Xelat atomlari:</span>
                <span className="text-orange-400">2 × N</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Zaryad:</span>
                <span className="text-orange-400">0 (neytral)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">λ<sub>abs</sub>:</span>
                <span className="text-orange-400">~285 nm (π-π*)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">MLCT yutish:</span>
                <span className="text-orange-400">~450 nm</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">π-elektronlar:</span>
                <span className="text-orange-400">12 (ikki halqa)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">π-akseptor:</span>
                <span className="text-orange-400">Kuchli</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun bpy π-akseptor?</p>
          <p className="text-purple-200">
            bpy ning <strong>π* orbitallari</strong> past energiyada → Ru²⁺ dan elektron qabul qilishi oson.
            <br/>
            Bu <strong>MLCT o'tishga</strong> imkon beradi: Ru²⁺ (t₂g⁶) → bpy (π*).
            <br/>
            π-akseptor xususiyati <strong>fosforessensiyani</strong> kuchaytiradi — triplet holatni barqarorlashtiradi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. MLCT MECHANIZMI
// ============================================================================
function MLCTMexanizmi() {
  const [step, setStep] = useState(0)

  const steps = [
    {
      title: "1. MLCT yutish",
      desc: "Ru²⁺ dan bpy ga elektron ko'chadi (¹MLCT)",
      formula: "Ru²⁺(t₂g⁶) + hν (450 nm) → Ru³⁺(t₂g⁵)-bpy⁻* (¹MLCT)",
      icon: "💡"
    },
    {
      title: "2. ISC — ¹MLCT → ³MLCT",
      desc: "Og'ir atom effekti (Ru) tufayli interkombinatsion konversiya juda tez (~100 fs)",
      formula: "¹MLCT → ³MLCT",
      icon: "🔄"
    },
    {
      title: "3. ³MLCT holatida yashash",
      desc: "Triplet holatda ~600 ns yashaydi (suvda)",
      formula: "³MLCT — metastabil holat",
      icon: "⏱️"
    },
    {
      title: "4. Fosforessensiya",
      desc: "³MLCT → ¹GS o'tish orqali qizil nurlanish (620 nm)",
      formula: "³MLCT → Ru²⁺(t₂g⁶) + hν' (620 nm)",
      icon: "✨"
    }
  ]

  const s = steps[step]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚡ MLCT mexanizmi — Ru²⁺ → bpy</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-orange-700/30 space-y-4">
        <div className="bg-orange-600/10 border border-orange-500/30 rounded-lg p-4">
          <p className="text-orange-400 font-bold mb-2">💎 MLCT nima?</p>
          <p className="text-purple-200 text-xs">
            <strong>MLCT (Metal-to-Ligand Charge Transfer)</strong> — elektron metall d-orbitalidan
            ligand π* orbitaliga ko'chadi. Bu <strong>to'liq ruxsat etilgan</strong> o'tish →
            yutish intensivligi yuqori (ε ≈ 10⁴ M⁻¹cm⁻¹).
          </p>
        </div>

        {/* STEP NAVIGATION */}
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <button key={i} onClick={() => setStep(i)}
              className={`flex-1 px-2 py-2 rounded-lg text-xs font-bold transition-all ${
                step === i 
                  ? "bg-orange-600/80 text-white shadow-lg" 
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
            <h4 className="text-orange-400 font-bold text-lg">{s.title}</h4>
          </div>
          <p className="text-purple-200 text-sm mb-3">{s.desc}</p>
          <div className="bg-purple-900/50 rounded p-3 font-mono text-xs text-center text-emerald-400">
            {s.formula}
          </div>
        </div>

        {/* VIZUALIZATSIYA */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-orange-400 font-bold text-xs mb-3">Energiya sathlari diagrammasi:</h5>
          <svg viewBox="0 0 400 250" className="w-full h-60">
            <line x1="50" y1="230" x2="50" y2="20" stroke="#4c1d95" strokeWidth="1" />
            <text x="30" y="125" fill="#c4b5fd" fontSize="9" textAnchor="middle" transform="rotate(-90, 30, 125)">
              Energiya
            </text>

            {/* Ground state */}
            <rect x="80" y="200" width="80" height="20" fill="#3b82f6" opacity="0.3" />
            <text x="120" y="215" fill="#3b82f6" fontSize="9" textAnchor="middle">¹GS (Ru²⁺)</text>

            {/* ¹MLCT */}
            <rect x="80" y="60" width="80" height="20" fill="#f59e0b" opacity="0.3" />
            <text x="120" y="75" fill="#f59e0b" fontSize="9" textAnchor="middle">¹MLCT</text>

            {/* ³MLCT */}
            <rect x="80" y="100" width="80" height="20" fill="#ef4444" opacity="0.3" />
            <text x="120" y="115" fill="#ef4444" fontSize="9" textAnchor="middle">³MLCT</text>

            {/* O'tishlar */}
            <line x1="120" y1="200" x2="120" y2="80" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrowY)" />
            <text x="135" y="140" fill="#fbbf24" fontSize="8">hν (450 nm)</text>

            <path d="M 160 70 Q 180 85 160 100" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="3,2" />
            <text x="190" y="85" fill="#8b5cf6" fontSize="8">ISC</text>

            <line x1="120" y1="120" x2="120" y2="200" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowR)" />
            <text x="135" y="160" fill="#ef4444" fontSize="8">hν' (620 nm)</text>

            <text x="250" y="50" fill="#c4b5fd" fontSize="8">Singlet (S=0)</text>
            <text x="250" y="110" fill="#c4b5fd" fontSize="8">Triplet (S=1)</text>

            <defs>
              <marker id="arrowY" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
                <polygon points="0,0 5,2.5 0,5" fill="#fbbf24" />
              </marker>
              <marker id="arrowR" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
                <polygon points="0,0 5,2.5 0,5" fill="#ef4444" />
              </marker>
            </defs>
          </svg>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun fosforessensiya?</p>
          <p className="text-purple-200">
            <strong>³MLCT → ¹GS</strong> — spin taqiqlangan o'tish → sekin (τ ≈ 600 ns).
            <br/>
            Bu <strong>fosforessensiya</strong> deb ataladi (fluoressensiya emas).
            <br/>
            <strong>Og'ir atom effekti</strong> (Ru) → ISC tez → triplet holatga o'tish oson.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. Φ VA TAU — KISLOROD TA'SIRI
// ============================================================================
function PhiVaTau() {
  const [oxygen, setOxygen] = useState(0)

  // kislorod ta'siri
  const phi = Math.max(0.01, 0.04 * (1 - (oxygen / 100) * 0.9))
  const tau = Math.max(50, 600 * (1 - (oxygen / 100) * 0.9))

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📊 Kvant unumi va yashash vaqti — kislorod ta'siri</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-orange-700/30 space-y-4">
        <div className="bg-orange-600/10 border border-orange-500/30 rounded-lg p-4">
          <p className="text-orange-400 font-bold mb-2">💎 Kislorod — eng katta dushman:</p>
          <p className="text-purple-200 text-xs">
            Kislorod <strong>triplet holatda</strong> (³O₂) → ³MLCT bilan energiya almashinadi.
            Natijada <strong>³MLCT o'chadi</strong> (kvenching). Φ va τ kamayadi.
            <br/>
            Bu xususiyatdan <strong>kislorod sensorlari</strong> sifatida foydalanish mumkin!
          </p>
        </div>

        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">Kislorod konsentratsiyasi:</span>
            <span className="text-emerald-400 font-mono">{oxygen}%</span>
          </label>
          <input type="range" min="0" max="100" step="5" value={oxygen}
            onChange={(e) => setOxygen(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-orange-500" />
          <div className="flex justify-between text-[10px] text-purple-400 mt-1">
            <span>0% (inert atmosfera)</span>
            <span>21% (havo)</span>
            <span>100% (toza O₂)</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-center">
          <div className="bg-orange-900/30 border border-orange-500/50 rounded-lg p-3">
            <p className="text-orange-400">Kvant unumi (Φ)</p>
            <p className="text-emerald-400 font-bold font-mono text-2xl">{phi.toFixed(3)}</p>
            <p className="text-purple-400 text-[10px]">{phi > 0.03 ? "✓ Yaxshi" : phi > 0.02 ? "○ O'rtacha" : "✗ Past"}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Yashash vaqti (τ)</p>
            <p className="text-emerald-400 font-bold font-mono text-2xl">{tau.toFixed(0)} ns</p>
            <p className="text-purple-400 text-[10px]">{tau > 400 ? "✓ Uzoq" : tau > 200 ? "○ O'rtacha" : "✗ Qisqa"}</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Stern-Volmer tenglamasi:</p>
          <p className="text-purple-200">
            <strong>τ₀/τ = 1 + K<sub>SV</sub>[O₂]</strong> — kislorod konsentratsiyasini aniqlash
            <br/>
            Bu formula orqali <strong>kislorod sensorlari</strong> ishlaydi.
            <br/>
            [Ru(bpy)₃]²⁺ — <strong>eng keng qo'llaniladigan kislorod sensori</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. LANtanid vs Ru SOLISHTIRISH
// ============================================================================
function LantanidVsRuSolishtirish() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 Lantanid vs [Ru(bpy)₃]²⁺ — solishtirish</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-orange-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-2 text-yellow-400">Xususiyat</th>
                <th className="text-center py-3 px-2 text-rose-400">[Eu(tta)₃(phen)]</th>
                <th className="text-center py-3 px-2 text-orange-400">[Ru(bpy)₃]²⁺</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["Metal", "Eu³⁺ (lantanid)", "Ru²⁺ (o'tish metalli)"],
                ["Emissiya turi", "f-f o'tish", "MLCT o'tish"],
                ["Spektr shakli", "Tor chiziqli", "Keng band"],
                ["FWHM", "~3 nm", "~80 nm"],
                ["λ<sub>em</sub>", "612 nm (qizil)", "620 nm (qizil)"],
                ["Φ (suvda)", "0.65", "0.04"],
                ["τ", "0.8 ms", "600 ns"],
                ["Antenna effekti", "Ha (ligand → Eu)", "Yo'q (to'g'ridan-to'g'ri MLCT)"],
                ["Kislorod ta'siri", "Kuchsiz", "Kuchli (triplet kvenching)"],
                ["Fotokataliz", "Yo'q", "Ha"],
                ["Narx", "Qimmat", "O'rtacha"],
              ].map((r, i) => (
                <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-2 px-2 font-bold text-purple-300">{r[0]}</td>
                  <td className="py-2 px-2 text-center text-rose-400">{r[1]}</td>
                  <td className="py-2 px-2 text-center text-orange-400">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-rose-900/20 border border-rose-500/30 rounded-lg p-3 text-xs">
            <p className="text-rose-400 font-bold mb-1">Lantanid afzalligi:</p>
            <p className="text-purple-200">
              Yuqori Φ va τ
              <br/>
              Tor chiziqli spektr → multiplex
              <br/>
              Kislorod ta'siri kam
            </p>
          </div>
          <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-3 text-xs">
            <p className="text-orange-400 font-bold mb-1">Ru²⁺ afzalligi:</p>
            <p className="text-purple-200">
              Fotokataliz qobiliyati
              <br/>
              Ko'rinadigan yorug'likda yutish
              <br/>
              Arzonroq sintez
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 6. QO'LLANILISH
// ============================================================================
function Qollanilish() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🏭 Amaliy qo'llanilishi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-orange-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">⚡</div>
            <h4 className="text-orange-400 font-bold mb-2">Fotokataliz</h4>
            <p className="text-purple-200 text-xs">
              <strong>Suv parchalash</strong> — vodorod ishlab chiqarish
              <br/>
              <strong>CO₂ qaytarish</strong> — metanol, metan
              <br/>
              <strong>Organik sintez</strong> — fotoredoks kataliz
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🔋</div>
            <h4 className="text-orange-400 font-bold mb-2">DSSC (Solar cells)</h4>
            <p className="text-purple-200 text-xs">
              <strong>Dye-sensitized solar cells</strong> — Grätzel hujayralari
              <br/>
              [Ru(bpy)₃]²⁺ — <strong>birinchi muvaffaqiyatli dye</strong>
              <br/>
              Ko'rinadigan yorug'likni yutadi → elektron uzatadi
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🧪</div>
            <h4 className="text-orange-400 font-bold mb-2">Kislorod sensorlari</h4>
            <p className="text-purple-200 text-xs">
              <strong>τ o'lchash</strong> orqali [O₂] aniqlanadi
              <br/>
              Stern-Volmer tenglamasi
              <br/>
              Sanoat, tibbiyot, atrof-muhit monitoringi
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🔬</div>
            <h4 className="text-orange-400 font-bold mb-2">Bioimaging</h4>
            <p className="text-purple-200 text-xs">
              Hujayra va to'qimalarni tasvirlash
              <br/>
              Uzoq τ — vaqt-ajraladigan tahlil
              <br/>
              Past toksiklik, fotobarqaror
            </p>
          </div>
        </div>

        <div className="bg-orange-600/10 border border-orange-500/30 rounded-lg p-4">
          <p className="text-orange-400 font-bold mb-2">🌟 Qiziqarli fakt:</p>
          <p className="text-purple-200 text-xs">
            [Ru(bpy)₃]²⁺ — <strong>eng ko'p o'rganilgan lyuminestsent kompleks</strong>.
            <br/>
            1970-80 yillarda kashf etilganidan beri <strong>10,000 dan ortiq maqola</strong> chop etilgan.
            <br/>
            U <strong>fotokataliz, solar cells, sensorlar</strong>ning "oltin standarti"ga aylangan.
            <br/>
            Hatto <strong>Mars roverlarida</strong> ham [Ru(bpy)₃]²⁺ asosidagi kislorod sensorlari ishlatilgan!
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function RuBpy3Fluoressensiya() {
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
          <span className="text-orange-400">[Ru(bpy)₃]²⁺</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-orange-400">💡 [Ru(bpy)₃]²⁺ — Fluoressensiya tahlili</h1>
          <p className="text-purple-400 text-sm">
            Ru²⁺ • MLCT • Fosforessensiya • Φ ≈ 0.04 • τ ≈ 600 ns • Fotokataliz klassikasi
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-orange-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-4xl md:text-5xl font-extrabold font-mono text-orange-400">[Ru(bpy)₃]²⁺</span>
            <div>
              <h2 className="text-xl font-bold text-white">Fluoressensiya tahlili — to'liq profil</h2>
              <p className="text-purple-400">"MLCT klassikasi" — fotokataliz va solar cells</p>
            </div>
          </div>

          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              [Ru(bpy)₃]²⁺ — <strong className="text-orange-400">o'tish metallari lyuminestsensiyasining oltin standarti</strong>.
              Ru²⁺ (4d⁶) <strong>uchta bpy ligand</strong> bilan o'ralgan. MLCT (Metal-to-Ligand Charge Transfer)
              orqali <strong>qizil fosforessensiya</strong> (620 nm) chiqaradi. <strong>Φ ≈ 0.04</strong> va
              <strong> τ ≈ 600 ns</strong> — lantanidlardan past, lekin fotokataliz uchun ideal.
              Suv parchalash, CO₂ qaytarish, DSSC va kislorod sensorlarida keng qo'llaniladi.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-orange-400 font-bold text-lg">Ru²⁺ (4d⁶)</p>
              <p className="text-purple-300">o'tish metalli</p>
              <p className="text-purple-400 mt-1">S = 0</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-orange-400 font-bold text-lg">λ<sub>em</sub> = 620</p>
              <p className="text-purple-300">nm</p>
              <p className="text-purple-400 mt-1">qizil</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-orange-400 font-bold text-lg">Φ ≈ 0.04</p>
              <p className="text-purple-300">kvant unumi</p>
              <p className="text-purple-400 mt-1">(suvda)</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-orange-400 font-bold text-lg">τ ≈ 600</p>
              <p className="text-purple-300">ns</p>
              <p className="text-purple-400 mt-1">fosforessensiya</p>
            </div>
          </div>
        </div>

        {/* EMISSION SPEKTR SIMULYATORI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <EmissionSpectrumSimulator />
        </div>

        {/* BPY LIGAND */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <BpyLigand />
        </div>

        {/* MLCT MECHANIZMI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <MLCTMexanizmi />
        </div>

        {/* PHI VA TAU */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <PhiVaTau />
        </div>

        {/* LANTANID vs Ru */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <LantanidVsRuSolishtirish />
        </div>

        {/* QO'LLANILISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <Qollanilish />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-orange-600/10 to-purple-600/10 border border-orange-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>[Ru(bpy)₃]²⁺ — <strong className="text-orange-400">o'tish metallari lyuminestsensiyasining klassikasi</strong></li>
            <li>Ru²⁺ (4d⁶) — <strong>MLCT fosforessensiya</strong> (620 nm, keng band)</li>
            <li><strong>Φ ≈ 0.04</strong> (suvda) — lantanidlardan past</li>
            <li><strong>τ ≈ 600 ns</strong> — triplet holatdan nurlanish</li>
            <li><strong>Kislorod kvenching</strong> — triplet kvenching, sensor sifatida ishlatiladi</li>
            <li><strong>Fotokataliz</strong> — suv parchalash, CO₂ qaytarish</li>
            <li><strong>DSSC</strong> — Grätzel solar cells</li>
            <li><strong>Kislorod sensorlari</strong> — Stern-Volmer tenglamasi</li>
            <li>Lantanidlar vs Ru²⁺ — turli mexanizmlar, turli qo'llanilish</li>
            <li>Eng ko'p o'rganilgan lyuminestsent kompleks</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/fluoressensiya/birikmalar/tb-dpa3" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← [Tb(dpa)₃]³⁻
          </Link>
          <Link href="/ilmiy/tahlil/fluoressensiya/birikmalar/ir-ppy3" className="px-6 py-3 bg-orange-600/80 rounded-xl hover:bg-orange-500 text-white font-semibold">
            [Ir(ppy)₃] →
          </Link>
        </div>

      </section>
    </main>
  )
}