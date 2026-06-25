"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. CD SPEKTR SIMULYATORI (Sitoxrom c uchun)
// ============================================================================
function CDSpectrumSimulator() {
  const [holat, setHolat] = useState("native")
  const [alphaContent, setAlphaContent] = useState(65)
  const [temperature, setTemperature] = useState(298)

  // Sitoxrom c CD spektri xarakteristikalari
  const spektrlar = {
    "native": {
      name: "Native (Fe³⁺)",
      desc: "Tabiiy holat — elektron tashuvchi",
      soret: 410,
      soret_de: -12.0,
      alpha_helix: 222,
      alpha_de: -3.0,
      beta_sheet: 218,
      beta_de: 0.8,
      color: "#ef4444"
    },
    "reduced": {
      name: "Reduced (Fe²⁺)",
      desc: "Qaytarilgan holat — elektron olgan",
      soret: 415,
      soret_de: -10.0,
      alpha_helix: 222,
      alpha_de: -2.8,
      beta_sheet: 218,
      beta_de: 0.7,
      color: "#8b5cf6"
    },
    "apo": {
      name: "Apoprotein",
      desc: "Gemsiz — faqat oqsil qismi",
      soret: 0,
      soret_de: 0,
      alpha_helix: 222,
      alpha_de: -2.0,
      beta_sheet: 218,
      beta_de: 1.0,
      color: "#f59e0b"
    },
    "denature": {
      name: "Denaturatsiya",
      desc: "Strukturasi buzilgan",
      soret: 410,
      soret_de: -5.0,
      alpha_helix: 222,
      alpha_de: -0.3,
      beta_sheet: 218,
      beta_de: 0.2,
      color: "#6b7280"
    }
  }

  const s = spektrlar[holat]
  const tempFactor = Math.max(0.3, 1 - (temperature - 298) / 150)

  // CD spektri simulyatsiyasi
  const spectrum = useMemo(() => {
    const points = []
    for (let i = 0; i < 400; i++) {
      const lambda = 190 + i * 1.0
      let cotton = 0
      let absorption = 0

      // Soret bandi (agar mavjud bo'lsa)
      if (s.soret > 0) {
        const x1 = (lambda - s.soret) / 15
        const cotton_soret = x1 * Math.exp(-0.5 * x1 * x1) * s.soret_de * tempFactor
        const abs_soret = Math.exp(-0.5 * x1 * x1) * 100000 * tempFactor
        cotton += cotton_soret
        absorption += abs_soret
      }

      // α-spirl (222 nm)
      const alphaFactor = alphaContent / 100
      const x2 = (lambda - s.alpha_helix) / 10
      const cotton_alpha = x2 * Math.exp(-0.5 * x2 * x2) * s.alpha_de * alphaFactor * tempFactor
      const abs_alpha = Math.exp(-0.5 * x2 * x2) * 4000 * alphaFactor * tempFactor

      // β-qavat (218 nm)
      const betaFactor = (1 - alphaFactor) * 0.4
      const x3 = (lambda - s.beta_sheet) / 12
      const cotton_beta = x3 * Math.exp(-0.5 * x3 * x3) * s.beta_de * betaFactor * tempFactor
      const abs_beta = Math.exp(-0.5 * x3 * x3) * 2000 * betaFactor * tempFactor

      cotton += cotton_alpha + cotton_beta
      absorption += abs_alpha + abs_beta

      points.push({ lambda, cotton, absorption })
    }
    return points
  }, [holat, alphaContent, temperature, s, tempFactor])

  const maxCotton = Math.max(...spectrum.map(p => Math.abs(p.cotton)), 0.1)
  const maxAbs = Math.max(...spectrum.map(p => p.absorption), 0.1)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📊 CD spektr simulyatori — Sitoxrom c</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-rose-700/30 space-y-4">
        <div className="bg-rose-600/10 border border-rose-500/30 rounded-lg p-4">
          <p className="text-rose-400 font-bold mb-2">💎 Kichik gemli oqsil — model tizim:</p>
          <p className="text-purple-200 text-xs">
            Sitoxrom c — <strong>104 aminokislotali</strong> kichik oqsil, gem guruhi <strong>kovalent bog'langan</strong>
            (Cys14 va Cys17 orqali). CD spektroskopiyasida <strong>denaturatsiya tadqiqotlari</strong> uchun
            klassik model hisoblanadi. Apoprotein (gemsiz) va goprotein (gemli) farqi CD orqali aniq ko'rinadi.
          </p>
        </div>

        {/* HOLAT TANLASH */}
        <div>
          <label className="text-xs text-yellow-400 font-bold mb-2 block">Sitoxrom c holati:</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(spektrlar).map(([key, val]) => (
              <button key={key} onClick={() => setHolat(key)}
                className={`px-2 py-2 rounded-lg text-[10px] font-bold transition-all ${
                  holat === key 
                    ? "bg-rose-600/80 text-white shadow-lg" 
                    : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
                }`}>
                <div className="text-xs">{val.name}</div>
                <div className="text-[9px] opacity-70 mt-1">{val.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* α-SPİRL MIQDORI */}
        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">α-spirl miqdori:</span>
            <span className="text-emerald-400 font-mono">{alphaContent}%</span>
          </label>
          <input type="range" min="0" max="100" step="5" value={alphaContent}
            onChange={(e) => setAlphaContent(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-rose-500" />
          <div className="flex justify-between text-[10px] text-purple-400 mt-1">
            <span>0% (to'liq denaturatsiya)</span>
            <span>65% (native)</span>
            <span>100%</span>
          </div>
        </div>

        {/* HARORAT */}
        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">Harorat:</span>
            <span className="text-emerald-400 font-mono">{temperature} K</span>
          </label>
          <input type="range" min="273" max="373" step="5" value={temperature}
            onChange={(e) => setTemperature(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-rose-500" />
          <div className="flex justify-between text-[10px] text-purple-400 mt-1">
            <span>0°C</span>
            <span>25°C (xona)</span>
            <span>100°C</span>
          </div>
        </div>

        {/* SPEKTR */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-rose-400 font-bold text-xs mb-2">
            CD spektri: {s.name}
          </h5>
          <svg viewBox="0 0 400 280" className="w-full h-64">
            <line x1="40" y1="140" x2="380" y2="140" stroke="#4c1d95" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="40" y1="20" x2="40" y2="260" stroke="#4c1d95" strokeWidth="1" />
            
            <text x="210" y="275" fill="#c4b5fd" fontSize="9" textAnchor="middle">λ (nm)</text>
            <text x="40" y="270" fill="#a78bfa" fontSize="8">190</text>
            <text x="380" y="270" fill="#a78bfa" fontSize="8" textAnchor="end">590</text>
            <text x="20" y="140" fill="#a78bfa" fontSize="8" textAnchor="middle" transform="rotate(-90, 20, 140)">
              Δε
            </text>

            {/* λ_max belgilari */}
            {s.soret > 0 && (
              <>
                <line x1={40 + ((s.soret - 190) / 400) * 340} y1="20" x2={40 + ((s.soret - 190) / 400) * 340} y2="260"
                  stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x={40 + ((s.soret - 190) / 400) * 340} y="15" fill="#fbbf24" fontSize="7" textAnchor="middle">
                  Soret ({s.soret} nm)
                </text>
              </>
            )}

            <line x1={40 + ((s.alpha_helix - 190) / 400) * 340} y1="20" x2={40 + ((s.alpha_helix - 190) / 400) * 340} y2="260"
              stroke="#10b981" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x={40 + ((s.alpha_helix - 190) / 400) * 340} y="15" fill="#10b981" fontSize="7" textAnchor="middle">
              α-spirl ({s.alpha_helix} nm)
            </text>

            {/* Absorbsiya */}
            <polyline
              points={spectrum.map((p, i) => {
                const x = 40 + (i / 400) * 340
                const y = 260 - (p.absorption / maxAbs) * 110
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke="#fbbf24" strokeWidth="1.5" opacity="0.6"
            />

            {/* CD spektri */}
            <polyline
              points={spectrum.map((p, i) => {
                const x = 40 + (i / 400) * 340
                const y = 140 - (p.cotton / maxCotton) * 110
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke={s.color} strokeWidth="2"
            />

            <text x="280" y="30" fill="#fbbf24" fontSize="8">— Absorbsiya</text>
            <text x="280" y="45" fill={s.color} fontSize="8">— CD (Δε)</text>
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          <div className="bg-rose-900/30 border border-rose-500/50 rounded-lg p-3">
            <p className="text-rose-400">Holat</p>
            <p className="text-rose-400 font-bold text-[10px]">{s.name.split(' ')[0]}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">α-spirl</p>
            <p className="text-emerald-400 font-bold">{alphaContent}%</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">T<sub>m</sub></p>
            <p className="text-rose-400 font-bold">~82°C</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Apoprotein vs Goprotein:</p>
          <p className="text-purple-200">
            <strong>Apoprotein</strong> (gemsiz) — CD spektrida Soret bandi yo'q, α-spirl biroz kam.
            <br/>
            <strong>Goprotein</strong> (gemli) — Soret bandi mavjud, α-spirl ko'proq.
            <br/>
            Gem bog'lanishi oqsil strukturasi <strong>barqarorligini oshiradi</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. GEM GURUHI — KOVALENT BOG'LANISH
// ============================================================================
function GemGuruhi() {
  const [showCov, setShowCov] = useState(true)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔗 Gem guruhi — kovalent bog'lanish (Cys14, Cys17)</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-rose-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-rose-400 font-bold mb-3">
              {showCov ? "Kovalent bog'langan gem" : "Oddiy gem"}
            </h4>
            <svg viewBox="0 0 200 200" className="w-full h-48">
              {/* Porfirin halqasi */}
              <polygon 
                points="100,40 140,60 160,100 140,140 100,160 60,140 40,100 60,60" 
                fill="none" 
                stroke="#a78bfa" 
                strokeWidth="2"
              />
              
              {/* Ichki halqa */}
              <polygon 
                points="100,60 130,75 140,100 130,125 100,140 70,125 60,100 70,75" 
                fill="none" 
                stroke="#a78bfa" 
                strokeWidth="1.5"
              />

              {/* N atomlari */}
              <circle cx="100" cy="60" r="6" fill="#3b82f6" />
              <circle cx="140" cy="100" r="6" fill="#3b82f6" />
              <circle cx="100" cy="140" r="6" fill="#3b82f6" />
              <circle cx="60" cy="100" r="6" fill="#3b82f6" />

              {/* Markaziy Fe */}
              <circle cx="100" cy="100" r="10" fill="#ef4444" />
              <text x="100" y="103" fill="white" fontSize="8" textAnchor="middle" fontWeight="bold">Fe</text>

              {/* His18 */}
              <line x1="100" y1="100" x2="100" y2="30" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,2" />
              <text x="100" y="20" fill="#f59e0b" fontSize="7" textAnchor="middle">His18</text>

              {/* Kovalent bog'lanish (Cys) */}
              {showCov && (
                <>
                  <line x1="60" y1="60" x2="30" y2="40" stroke="#10b981" strokeWidth="2" />
                  <circle cx="30" cy="40" r="7" fill="#10b981" />
                  <text x="30" y="43" fill="white" fontSize="6" textAnchor="middle">Cys14</text>

                  <line x1="140" y1="60" x2="170" y2="40" stroke="#10b981" strokeWidth="2" />
                  <circle cx="170" cy="40" r="7" fill="#10b981" />
                  <text x="170" y="43" fill="white" fontSize="6" textAnchor="middle">Cys17</text>

                  <text x="100" y="185" fill="#10b981" fontSize="7" textAnchor="middle">
                    Kovalent tioefir bog'lar
                  </text>
                </>
              )}

              <text x="100" y="195" fill="#a78bfa" fontSize="7" textAnchor="middle">
                Sitoxrom c gem guruhi
              </text>
            </svg>

            <button onClick={() => setShowCov(!showCov)}
              className="w-full mt-2 px-3 py-2 bg-rose-600/30 hover:bg-rose-600/50 rounded text-xs text-rose-400 transition-all">
              {showCov ? "Kovalent bog'larni yashirish" : "Kovalent bog'larni ko'rsatish"}
            </button>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-rose-400 font-bold mb-3">Xususiyatlari:</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Oqsil o'lchami:</span>
                <span className="text-rose-400 font-bold">104 aminokislota</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Molekulyar massa:</span>
                <span className="text-rose-400 font-bold">12.4 kDa</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Gem bog'lanishi:</span>
                <span className="text-emerald-400">Kovalent (tioefir)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Cys14, Cys17:</span>
                <span className="text-emerald-400">Gem ga bog'langan</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Proksimal ligand:</span>
                <span className="text-yellow-400">His18</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">α-spirl miqdori:</span>
                <span className="text-emerald-400">~65%</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">T<sub>m</sub> (erish):</span>
                <span className="text-rose-400">~82°C</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun kovalent bog'langan?</p>
          <p className="text-purple-200">
            <strong>Kovalent bog'lanish</strong> gemni oqsilga mustahkam biriktiradi →
            elektron tashish jarayonida gem <strong>ajralib ketmaydi</strong>.
            <br/>
            Bu <strong>mitoxondriyal elektron tashish zanjirida</strong> muhim — sitoxrom c
            kompleks III dan kompleks IV ga elektron tashiysi kerak.
            <br/>
            Apoprotein (gemsiz) <strong>beqarorroq</strong> va tez denaturatsiya bo'ladi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. ELEKTRON TASHISH FUNKSIYASI
// ============================================================================
function ElektronTashish() {
  const [step, setStep] = useState(0)

  const steps = [
    {
      title: "1. Kompleks III dan elektron olish",
      desc: "Sitoxrom c reduktaza (Kompleks III) sitoxrom c ga elektron beradi",
      formula: "Cyt c (Fe³⁺) + e⁻ → Cyt c (Fe²⁺)",
      icon: "⚡"
    },
    {
      title: "2. Mitoxondriya membranasi bo'ylab harakat",
      desc: "Sitoxrom c membranalar orasida suzadi (intermembrane space)",
      formula: "Cyt c (Fe²⁺) → harakat",
      icon: "🚶"
    },
    {
      title: "3. Kompleks IV ga bog'lanish",
      desc: "Sitoxrom c oksidaza (Kompleks IV) ga yaqinlashadi",
      formula: "Cyt c (Fe²⁺) + Kompleks IV",
      icon: "🔗"
    },
    {
      title: "4. Elektron berish",
      desc: "Sitoxrom c elektronni kompleks IV ga beradi, o'zi Fe³⁺ ga aylanadi",
      formula: "Cyt c (Fe²⁺) → Cyt c (Fe³⁺) + e⁻",
      icon: "💨"
    },
    {
      title: "5. Kislorodga elektron o'tishi",
      desc: "Oxirida elektron O₂ ga beriladi → H₂O hosil bo'ladi",
      formula: "4e⁻ + 4H⁺ + O₂ → 2H₂O",
      icon: "💧"
    }
  ]

  const s = steps[step]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚡ Elektron tashish funksiyasi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-rose-700/30 space-y-4">
        <div className="bg-rose-600/10 border border-rose-500/30 rounded-lg p-4">
          <p className="text-rose-400 font-bold mb-2">💎 Nafas olish zanjirining bir qismi:</p>
          <p className="text-purple-200 text-xs">
            Sitoxrom c — <strong>mitoxondriyal elektron tashish zanjirida</strong> muhim komponent.
            Kompleks III dan <strong>elektron olib</strong>, kompleks IV ga <strong>tashiysi</strong>.
            Bu jarayon <strong>ATP sintezi</strong> uchun proton gradientini hosil qiladi.
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
          <h5 className="text-rose-400 font-bold text-xs mb-3">Nafas olish zanjiri:</h5>
          <svg viewBox="0 0 400 150" className="w-full h-36">
            {/* Membrana */}
            <rect x="20" y="60" width="360" height="30" fill="#4c1d95" opacity="0.3" />
            <text x="200" y="80" fill="#a78bfa" fontSize="8" textAnchor="middle">Ichki mitoxondrial membrana</text>

            {/* Komplekslar */}
            <rect x="40" y="40" width="50" height="70" fill="#3b82f6" opacity="0.6" rx="5" />
            <text x="65" y="75" fill="white" fontSize="7" textAnchor="middle">Kompl. III</text>

            <rect x="160" y="40" width="50" height="70" fill="#ef4444" opacity="0.6" rx="5" />
            <text x="185" y="75" fill="white" fontSize="7" textAnchor="middle">Cyt c</text>

            <rect x="280" y="40" width="50" height="70" fill="#10b981" opacity="0.6" rx="5" />
            <text x="305" y="75" fill="white" fontSize="7" textAnchor="middle">Kompl. IV</text>

            {/* Elektron oqimi */}
            <line x1="90" y1="75" x2="160" y2="75" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrow)" />
            <line x1="210" y1="75" x2="280" y2="75" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrow)" />
            
            <defs>
              <marker id="arrow" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
                <polygon points="0,0 5,2.5 0,5" fill="#fbbf24" />
              </marker>
            </defs>

            {/* O₂ va H₂O */}
            <text x="340" y="75" fill="#10b981" fontSize="7">O₂ → H₂O</text>

            <text x="200" y="130" fill="#c4b5fd" fontSize="8" textAnchor="middle">
              Elektron tashish → proton gradienti → ATP sintezi
            </text>
          </svg>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 CD orqali kuzatish:</p>
          <p className="text-purple-200">
            Fe³⁺ ↔ Fe²⁺ o'tish <strong>Soret bandi siljishiga</strong> olib keladi (410 → 415 nm).
            <br/>
            CD spektroskopiyasi orqali <strong>qaytarilgan/oksidlangan nisbatni</strong> aniqlash mumkin.
            <br/>
            Bu <strong>mitoxondriyal faoliyatni</strong> o'rganishda muhim.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. DENATURATSIYA TADQIQOTLARI
// ============================================================================
function Denaturatsiya() {
  const [denaturant, setDenaturant] = useState("harorat")
  const [concentration, setConcentration] = useState(0)

  // Denaturatsiya egri chizig'i simulyatsiyasi
  const denatData = useMemo(() => {
    const points = []
    let Tm = denaturant === "harorat" ? 82 : denaturant === "urea" ? 3.5 : 2.0
    
    for (let i = 0; i <= 100; i++) {
      const x = (i / 100) * (denaturant === "harorat" ? 100 : 6)
      // Sigmoidal egri chiziq
      const fraction = 1 / (1 + Math.exp(-5 * (x - Tm)))
      const alpha = 65 * (1 - fraction)
      points.push({ x, alpha })
    }
    return points
  }, [denaturant])

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔥 Denaturatsiya tadqiqotlari — barqarorlik o'lchash</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-rose-700/30 space-y-4">
        <div className="bg-rose-600/10 border border-rose-500/30 rounded-lg p-4">
          <p className="text-rose-400 font-bold mb-2">💎 Sitoxrom c — denaturatsiya modeli:</p>
          <p className="text-purple-200 text-xs">
            Sitoxrom c — <strong>denaturatsiya tadqiqotlari uchun klassik model</strong>.
            Kichik oqsil (12.4 kDa), bir domainli, qaytar denaturatsiya qilish mumkin.
            CD orqali <strong>α-spirl miqdori</strong> kuzatiladi → denaturatsiya darajasi aniqlanadi.
          </p>
        </div>

        {/* DENATURANT TANLASH */}
        <div>
          <label className="text-xs text-yellow-400 font-bold mb-2 block">Denaturatsiya turi:</label>
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => setDenaturant("harorat")}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                denaturant === "harorat" 
                  ? "bg-rose-600/80 text-white shadow-lg" 
                  : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
              }`}>
              🌡️ Harorat
            </button>
            <button onClick={() => setDenaturant("urea")}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                denaturant === "urea" 
                  ? "bg-rose-600/80 text-white shadow-lg" 
                  : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
              }`}>
              ⚗️ Urea
            </button>
            <button onClick={() => setDenaturant("gdn")}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                denaturant === "gdn" 
                  ? "bg-rose-600/80 text-white shadow-lg" 
                  : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
              }`}>
              🧪 Gdn·HCl
            </button>
          </div>
        </div>

        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">
              {denaturant === "harorat" ? "Harorat (°C):" : "Konsentratsiya (M):"}
            </span>
            <span className="text-emerald-400 font-mono">
              {denaturant === "harorat" ? `${concentration}°C` : `${(concentration / 100 * 6).toFixed(1)} M`}
            </span>
          </label>
          <input type="range" min="0" max="100" step="1" value={concentration}
            onChange={(e) => setConcentration(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-rose-500" />
        </div>

        {/* DENATURATSIYA EGRI CHIZIG'I */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-rose-400 font-bold text-xs mb-2">
            Denaturatsiya egri chizig'i (α-spirl miqdori):
          </h5>
          <svg viewBox="0 0 400 200" className="w-full h-48">
            <line x1="40" y1="180" x2="380" y2="180" stroke="#4c1d95" strokeWidth="1" />
            <line x1="40" y1="20" x2="40" y2="180" stroke="#4c1d95" strokeWidth="1" />
            
            <text x="210" y="195" fill="#c4b5fd" fontSize="9" textAnchor="middle">
              {denaturant === "harorat" ? "Harorat (°C)" : "Konsentratsiya (M)"}
            </text>
            <text x="20" y="100" fill="#a78bfa" fontSize="8" textAnchor="middle" transform="rotate(-90, 20, 100)">
              α-spirl (%)
            </text>

            {/* Egri chiziq */}
            <polyline
              points={denatData.map((p, i) => {
                const x = 40 + (p.x / (denaturant === "harorat" ? 100 : 6)) * 340
                const y = 180 - (p.alpha / 65) * 150
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke="#ef4444" strokeWidth="2"
            />

            {/* Tm belgisi */}
            <line x1={40 + ((denaturant === "harorat" ? 82 : denaturant === "urea" ? 3.5 : 2.0) / (denaturant === "harorat" ? 100 : 6)) * 340} y1="20"
              x2={40 + ((denaturant === "harorat" ? 82 : denaturant === "urea" ? 3.5 : 2.0) / (denaturant === "harorat" ? 100 : 6)) * 340} y2="180"
              stroke="#fbbf24" strokeWidth="1" strokeDasharray="2,2" />
            <text x={40 + ((denaturant === "harorat" ? 82 : denaturant === "urea" ? 3.5 : 2.0) / (denaturant === "harorat" ? 100 : 6)) * 340} y="15"
              fill="#fbbf24" fontSize="8" textAnchor="middle">
              T<sub>m</sub>
            </text>

            {/* Joriy nuqta */}
            <circle cx={40 + (concentration / 100) * 340}
              cy={180 - (denatData[Math.round(concentration)]?.alpha / 65) * 150}
              r="5" fill="#10b981" />
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          <div className="bg-rose-900/30 border border-rose-500/50 rounded-lg p-3">
            <p className="text-rose-400">T<sub>m</sub></p>
            <p className="text-rose-400 font-bold">
              {denaturant === "harorat" ? "82°C" : denaturant === "urea" ? "3.5 M" : "2.0 M"}
            </p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">α-spirl (native)</p>
            <p className="text-emerald-400 font-bold">~65%</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">α-spirl (denat.)</p>
            <p className="text-purple-300 font-bold">~10%</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Denaturatsiya qanday sodir bo'ladi?</p>
          <p className="text-purple-200">
            <strong>Harorat oshishi</strong> → vodorod bog'lari uziladi → α-spirl kamayadi.
            <br/>
            <strong>Urea/Gdn·HCl</strong> → oqsil bilan vodorod bog'lari hosil qiladi → struktura buziladi.
            <br/>
            CD orqali <strong>222 nm cho'qqi kuchsizlanishi</strong> kuzatiladi → denaturatsiya darajasi aniqlanadi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. GEM vs APoprotein SOLISHTIRISH
// ============================================================================
function GemVsApo() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 Goprotein vs Apoprotein — gem ta'siri</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-rose-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-2 text-yellow-400">Xususiyat</th>
                <th className="text-center py-3 px-2 text-rose-400">Goprotein (gemli)</th>
                <th className="text-center py-3 px-2 text-amber-400">Apoprotein (gemsiz)</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["Gem mavjudligi", "Ha (kovalent)", "Yo'q"],
                ["α-spirl miqdori", "~65%", "~45%"],
                ["Tm (erish harorati)", "82°C", "55°C"],
                ["CD 222 nm", "−3.0", "−2.0"],
                ["Soret bandi", "410 nm (kuchli)", "Yo'q"],
                ["Barqarorlik", "Yuqori", "Past"],
                ["Funksiya", "Elektron tashish", "Yo'q"],
                ["Denaturatsiya", "Qaytar", "Qaytar"],
                ["Rang", "Qizil-jigar", "Rangsiz"],
                ["Molekulyar massa", "12.4 kDa", "11.8 kDa"],
              ].map((r, i) => (
                <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-2 px-2 font-bold text-purple-300">{r[0]}</td>
                  <td className="py-2 px-2 text-center text-rose-400">{r[1]}</td>
                  <td className="py-2 px-2 text-center text-amber-400">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 bg-rose-600/10 border border-rose-500/30 rounded-lg p-3 text-xs">
          <p className="text-rose-400 font-bold mb-1">💡 Gemning ta'siri:</p>
          <p className="text-purple-200">
            <strong>Gem guruhi</strong> oqsil strukturasi <strong>barqarorligini oshiradi</strong>:
            <br/>
            • α-spirl <strong>20% ko'proq</strong> (65% vs 45%)
            <br/>
            • T<sub>m</sub> <strong>27°C yuqori</strong> (82°C vs 55°C)
            <br/>
            • CD signali <strong>kuchliroq</strong> (−3.0 vs −2.0)
            <br/>
            Bu gemning <strong>"strukturaviy yadro"</strong> vazifasini bajarishini ko'rsatadi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 6. AMALIY QO'LLANILISH
// ============================================================================
function AmaliyQollanilish() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🏭 Amaliy qo'llanilishi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-rose-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🔬</div>
            <h4 className="text-rose-400 font-bold mb-2">Oqsil barqarorligi tadqiqotlari</h4>
            <p className="text-purple-200 text-xs">
              Sitoxrom c — <strong>denaturatsiya modellari</strong> uchun standart.
              Harorat, pH, kimyoviy denaturantlar ta'siri o'rganiladi.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">⚡</div>
            <h4 className="text-rose-400 font-bold mb-2">Mitoxondriyal funksiyasi</h4>
            <p className="text-purple-200 text-xs">
              CD orqali <strong>mitoxondriyal elektron tashish</strong> faoliyati kuzatiladi.
              Fe³⁺/Fe²⁺ nisbati aniqlanadi.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">💊</div>
            <h4 className="text-rose-400 font-bold mb-2">Apoptoz tadqiqotlari</h4>
            <p className="text-purple-200 text-xs">
              Sitoxrom c mitoxondriyadan chiqqanda <strong>apoptoz</strong> boshlanadi.
              CD orqali konformatsion o'zgarishlar kuzatiladi.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🧬</div>
            <h4 className="text-rose-400 font-bold mb-2">Evolutsion tadqiqotlar</h4>
            <p className="text-purple-200 text-xs">
              Turli organizmlardan olingan sitoxrom c <strong>evolyutsiya</strong>ni o'rganishda ishlatiladi.
              CD spektrlari <strong>strukturaviy konservatsiya</strong>ni ko'rsatadi.
            </p>
          </div>
        </div>

        <div className="bg-rose-600/10 border border-rose-500/30 rounded-lg p-4">
          <p className="text-rose-400 font-bold mb-2">🌟 Qiziqarli fakt:</p>
          <p className="text-purple-200 text-xs">
            Sitoxrom c — <strong>eng ko'p o'rganilgan oqsillardan biri</strong>.
            100 yildan ortiq vaqt davomida <strong>10,000 dan ortiq ilmiy maqola</strong> chop etilgan.
            Uning CD spektri shunchalik <strong>xarakterli</strong>ki, <strong>bir necha soniya</strong> ichida
            oqsilning <strong>native yoki denaturatsiya qilingan</strong> ekanligini aniqlash mumkin.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function SitoxromCCD() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">

      <header className="flex flex-col gap-2 px-6 py-4 border-b border-purple-800/50">
        <nav className="flex items-center gap-2 text-sm flex-wrap" aria-label="Breadcrumb">
          <Link href="/" className="text-purple-400 hover:text-purple-300">🏠</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil" className="text-purple-400 hover:text-purple-300">Tahlil</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil/cd" className="text-purple-400 hover:text-purple-300">CD</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil/cd/birikmalar" className="text-purple-400 hover:text-purple-300">Birikmalar</Link>
          <span className="text-purple-600">›</span>
          <span className="text-rose-400">Sitoxrom c</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-rose-400">🔄 Sitoxrom c — CD tahlili</h1>
          <p className="text-purple-400 text-sm">
            Fe²⁺/Fe³⁺ (gem) • Kichik gemli oqsil • Elektron tashish • Denaturatsiya modeli
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-rose-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-4xl md:text-5xl font-extrabold font-mono text-rose-400">Sitoxrom c</span>
            <div>
              <h2 className="text-xl font-bold text-white">CD tahlili — to'liq profil</h2>
              <p className="text-purple-400">"Mitoxondriyal elektron tashuvchi" — biologik model</p>
            </div>
          </div>

          <div className="bg-rose-600/10 border border-rose-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              Sitoxrom c — <strong className="text-rose-400">104 aminokislotali kichik gemli oqsil</strong> (12.4 kDa).
              Gem guruhi <strong>kovalent bog'langan</strong> (Cys14, Cys17 orqali).
              CD spektri <strong>ikkita muhim sohani</strong> o'z ichiga oladi:
              <strong> uzoq UV</strong> (α-spirl struktura, ~65%) va
              <strong> ko'rinadigan</strong> (Soret bandi, 410 nm).
              <strong> Denaturatsiya tadqiqotlari</strong> uchun klassik model hisoblanadi.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-rose-400 font-bold text-lg">Fe²⁺/Fe³⁺</p>
              <p className="text-purple-300">gem (kovalent)</p>
              <p className="text-purple-400 mt-1">oktaedrik</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-rose-400 font-bold text-lg">104 aa</p>
              <p className="text-purple-300">12.4 kDa</p>
              <p className="text-purple-400 mt-1">kichik oqsil</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-rose-400 font-bold text-lg">α-spirl</p>
              <p className="text-purple-300">~65%</p>
              <p className="text-purple-400 mt-1">ikkilamchi str.</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-rose-400 font-bold text-lg">Soret</p>
              <p className="text-purple-300">410 nm</p>
              <p className="text-purple-400 mt-1">kuchli band</p>
            </div>
          </div>
        </div>

        {/* CD SPEKTR SIMULYATORI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <CDSpectrumSimulator />
        </div>

        {/* GEM GURUHI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <GemGuruhi />
        </div>

        {/* ELEKTRON TASHISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <ElektronTashish />
        </div>

        {/* DENATURATSIYA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <Denaturatsiya />
        </div>

        {/* GEM vs APO */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <GemVsApo />
        </div>

        {/* AMALIY QO'LLANILISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <AmaliyQollanilish />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-rose-600/10 to-purple-600/10 border border-rose-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>Sitoxrom c — <strong className="text-rose-400">kichik gemli oqsil</strong> (104 aa, 12.4 kDa)</li>
            <li>Gem guruhi <strong>kovalent bog'langan</strong> (Cys14, Cys17)</li>
            <li><strong>α-spirl ~65%</strong> — 222 nm da manfiy cho'qqi</li>
            <li><strong>Soret bandi</strong> — 410 nm (Fe³⁺), 415 nm (Fe²⁺)</li>
            <li><strong>Elektron tashish</strong> — kompleks III → IV</li>
            <li><strong>Denaturatsiya modeli</strong> — T<sub>m</sub> ≈ 82°C</li>
            <li>Goprotein (gemli) <strong>barqarorroq</strong> apoproteindan</li>
            <li>CD orqali <strong>Fe³⁺/Fe²⁺ nisbati</strong> aniqlanadi</li>
            <li><strong>Apoptoz</strong> tadqiqotlarida muhim</li>
            <li>Evolutsion <strong>strukturaviy konservatsiya</strong> namunasi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/cd/birikmalar/gemoglobin" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← Gemoglobin
          </Link>
          <Link href="/ilmiy/tahlil/cd/birikmalar/oksaliplatin" className="px-6 py-3 bg-rose-600/80 rounded-xl hover:bg-rose-500 text-white font-semibold">
            Oksaliplatin →
          </Link>
        </div>

      </section>
    </main>
  )
}