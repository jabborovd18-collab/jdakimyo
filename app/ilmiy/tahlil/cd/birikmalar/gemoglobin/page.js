"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. CD SPEKTR SIMULYATORI (Gemoglobin uchun)
// ============================================================================
function CDSpectrumSimulator() {
  const [holat, setHolat] = useState("oksigenlangan")
  const [alphaContent, setAlphaContent] = useState(75)
  const [temperature, setTemperature] = useState(298)

  // Gemoglobin CD spektri xarakteristikalari
  const spektrlar = {
    "oksigenlangan": {
      name: "Oksigenlangan (R holat)",
      desc: "HbO₂ — kislorod bilan to'yingan",
      soret: 415,
      soret_de: -15.0,
      alpha_helix: 222,
      alpha_de: -3.5,
      beta_sheet: 218,
      beta_de: 1.2,
      color: "#ef4444"
    },
    "deoksi": {
      name: "Deoksi (T holat)",
      desc: "Hb — kislorodsiz",
      soret: 430,
      soret_de: -12.0,
      alpha_helix: 222,
      alpha_de: -3.0,
      beta_sheet: 218,
      beta_de: 1.0,
      color: "#8b5cf6"
    },
    "met": {
      name: "Metgemoglobin",
      desc: "MetHb — Fe³⁺ holat",
      soret: 405,
      soret_de: -18.0,
      alpha_helix: 222,
      alpha_de: -2.5,
      beta_sheet: 218,
      beta_de: 0.8,
      color: "#f59e0b"
    },
    "denaturatsiya": {
      name: "Denaturatsiya qilingan",
      desc: "Strukturasi buzilgan",
      soret: 415,
      soret_de: -10.0,
      alpha_helix: 222,
      alpha_de: -0.5,
      beta_sheet: 218,
      beta_de: 0.2,
      color: "#6b7280"
    }
  }

  const s = spektrlar[holat]
  const tempFactor = Math.max(0.5, 1 - (temperature - 298) / 200)

  // CD spektri simulyatsiyasi
  const spectrum = useMemo(() => {
    const points = []
    for (let i = 0; i < 400; i++) {
      const lambda = 190 + i * 1.0 // 190-590 nm
      let cotton = 0
      let absorption = 0

      // Soret bandi (415 nm atrofida)
      const x1 = (lambda - s.soret) / 15
      const cotton_soret = x1 * Math.exp(-0.5 * x1 * x1) * s.soret_de * tempFactor
      const abs_soret = Math.exp(-0.5 * x1 * x1) * 150000 * tempFactor

      // α-spirl (222 nm)
      const alphaFactor = alphaContent / 100
      const x2 = (lambda - s.alpha_helix) / 10
      const cotton_alpha = x2 * Math.exp(-0.5 * x2 * x2) * s.alpha_de * alphaFactor * tempFactor
      const abs_alpha = Math.exp(-0.5 * x2 * x2) * 5000 * alphaFactor * tempFactor

      // β-qavat (218 nm)
      const betaFactor = (1 - alphaFactor) * 0.5
      const x3 = (lambda - s.beta_sheet) / 12
      const cotton_beta = x3 * Math.exp(-0.5 * x3 * x3) * s.beta_de * betaFactor * tempFactor
      const abs_beta = Math.exp(-0.5 * x3 * x3) * 3000 * betaFactor * tempFactor

      cotton = cotton_soret + cotton_alpha + cotton_beta
      absorption = abs_soret + abs_alpha + abs_beta

      points.push({ lambda, cotton, absorption })
    }
    return points
  }, [holat, alphaContent, temperature, s, tempFactor])

  const maxCotton = Math.max(...spectrum.map(p => Math.abs(p.cotton)), 0.1)
  const maxAbs = Math.max(...spectrum.map(p => p.absorption), 0.1)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📊 CD spektr simulyatori — Gemoglobin</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-red-700/30 space-y-4">
        <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400 font-bold mb-2">💎 Biologik kompleks — ikki sohali CD:</p>
          <p className="text-purple-200 text-xs">
            Gemoglobin CD spektri <strong>ikkita muhim sohani</strong> o'z ichiga oladi:
            <br/>
            1. <strong>Uzoq UV</strong> (190-250 nm) — oqsil ikkilamchi strukturasi (α-spirl, β-qavat)
            <br/>
            2. <strong>Ko'rinadigan</strong> (350-450 nm) — gem guruhi (Soret bandi)
            <br/>
            Kislorod bog'lanishi, harorat, pH o'zgarishi CD spektriga <strong>kuchli ta'sir</strong> ko'rsatadi.
          </p>
        </div>

        {/* HOLAT TANLASH */}
        <div>
          <label className="text-xs text-yellow-400 font-bold mb-2 block">Gemoglobin holati:</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(spektrlar).map(([key, val]) => (
              <button key={key} onClick={() => setHolat(key)}
                className={`px-2 py-2 rounded-lg text-[10px] font-bold transition-all ${
                  holat === key 
                    ? "bg-red-600/80 text-white shadow-lg" 
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
            className="w-full h-2 bg-purple-900 rounded accent-red-500" />
          <div className="flex justify-between text-[10px] text-purple-400 mt-1">
            <span>0% (denaturatsiya)</span>
            <span>75% (tabiiy)</span>
            <span>100% (to'liq α)</span>
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
            className="w-full h-2 bg-purple-900 rounded accent-red-500" />
          <div className="flex justify-between text-[10px] text-purple-400 mt-1">
            <span>0°C (muzlash)</span>
            <span>25°C (xona)</span>
            <span>100°C (qaynash)</span>
          </div>
        </div>

        {/* SPEKTR */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-red-400 font-bold text-xs mb-2">
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
            <line x1={40 + ((s.soret - 190) / 400) * 340} y1="20" x2={40 + ((s.soret - 190) / 400) * 340} y2="260"
              stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x={40 + ((s.soret - 190) / 400) * 340} y="15" fill="#fbbf24" fontSize="7" textAnchor="middle">
              Soret ({s.soret} nm)
            </text>

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
          <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3">
            <p className="text-red-400">Holat</p>
            <p className="text-red-400 font-bold text-[10px]">{s.name.split(' ')[0]}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">α-spirl</p>
            <p className="text-emerald-400 font-bold">{alphaContent}%</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Soret CD</p>
            <p className="text-red-400 font-bold">{s.soret_de.toFixed(1)}</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 CD spektri nima ko'rsatadi?</p>
          <p className="text-purple-200">
            <strong>222 nm da manfiy cho'qqi</strong> — α-spirl miqdori (qancha chuqur bo'lsa, shuncha ko'p α-spirl).
            <br/>
            <strong>415 nm da manfiy cho'qqi</strong> — Soret bandi (gem guruhi holati).
            <br/>
            <strong>Harorat oshishi</strong> → denaturatsiya → α-spirl kamayadi → CD kuchsizlanadi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. GEM GURUHI STRUKTURASI
// ============================================================================
function GemGuruhi() {
  const [showOxygen, setShowOxygen] = useState(false)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔗 Gem guruhi — porfirin halqasi + Fe</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-red-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-red-400 font-bold mb-3">
              {showOxygen ? "Oksigenlangan gem (HbO₂)" : "Deoksi gem (Hb)"}
            </h4>
            <svg viewBox="0 0 200 200" className="w-full h-48">
              {/* Porfirin halqasi (soddalashtirilgan) */}
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

              {/* N atomlari (4 ta) */}
              <circle cx="100" cy="60" r="8" fill="#3b82f6" />
              <text x="100" y="63" fill="white" fontSize="7" textAnchor="middle">N</text>
              
              <circle cx="140" cy="100" r="8" fill="#3b82f6" />
              <text x="140" y="103" fill="white" fontSize="7" textAnchor="middle">N</text>
              
              <circle cx="100" cy="140" r="8" fill="#3b82f6" />
              <text x="100" y="143" fill="white" fontSize="7" textAnchor="middle">N</text>
              
              <circle cx="60" cy="100" r="8" fill="#3b82f6" />
              <text x="60" y="103" fill="white" fontSize="7" textAnchor="middle">N</text>

              {/* Markaziy Fe */}
              <circle cx="100" cy="100" r="12" fill="#ef4444" />
              <text x="100" y="104" fill="white" fontSize="9" textAnchor="middle" fontWeight="bold">Fe</text>

              {/* Kislorod (agar bog'langan bo'lsa) */}
              {showOxygen && (
                <>
                  <line x1="100" y1="100" x2="100" y2="170" stroke="#10b981" strokeWidth="2" />
                  <circle cx="100" cy="170" r="8" fill="#10b981" />
                  <text x="100" y="173" fill="white" fontSize="7" textAnchor="middle">O₂</text>
                </>
              )}

              {/* Proksimal His */}
              <line x1="100" y1="100" x2="100" y2="30" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,2" />
              <text x="100" y="20" fill="#f59e0b" fontSize="7" textAnchor="middle">His F8</text>

              <text x="100" y="195" fill="#a78bfa" fontSize="8" textAnchor="middle">
                Gem guruhi (porfirin + Fe)
              </text>
            </svg>

            <button onClick={() => setShowOxygen(!showOxygen)}
              className="w-full mt-2 px-3 py-2 bg-red-600/30 hover:bg-red-600/50 rounded text-xs text-red-400 transition-all">
              {showOxygen ? "💨 O₂ ni olib tashlash" : "💨 O₂ bog'lash"}
            </button>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-red-400 font-bold mb-3">Xususiyatlari:</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Porfirin halqasi:</span>
                <span className="text-red-400 font-bold">4 ta pirrol</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Markaziy metall:</span>
                <span className="text-red-400 font-bold">Fe²⁺ yoki Fe³⁺</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Koordinatsion son:</span>
                <span className="text-emerald-400">6 (oktaedrik)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Proksimal ligand:</span>
                <span className="text-yellow-400">His F8 (imidazol)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Distal pozitsiya:</span>
                <span className="text-emerald-400">O₂ bog'lanadi</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Soret bandi:</span>
                <span className="text-red-400 font-bold">415 nm (kuchli)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Gemoglobin rangi:</p>
          <p className="text-purple-200">
            <strong>Qizil</strong> — oksigenlangan (HbO₂, Fe²⁺-O₂)
            <br/>
            <strong>To'q qizil-binafsha</strong> — deoksi (Hb, Fe²⁺)
            <br/>
            <strong>Jigar rang</strong> — metgemoglobin (MetHb, Fe³⁺)
            <br/>
            Rang o'zgarishi <strong>Soret bandi</strong> va <strong>d-d o'tishlar</strong> bilan bog'liq.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. IKKILAMCHI STRUKTURA — α-SPİRL VA β-QAVAT
// ============================================================================
function IkkilamchiStruktura() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔬 Ikkilamchi struktura — α-spirl va β-qavat</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-red-700/30 space-y-4">
        <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400 font-bold mb-2">💎 Gemoglobin strukturasi:</p>
          <p className="text-purple-200 text-xs">
            Gemoglobin — <strong>4 ta subbirit</strong>dan iborat (2α + 2β).
            Har bir subbirit <strong>~75% α-spirl</strong> strukturaga ega.
            CD spektroskopiyasi <strong>222 nm</strong> da α-spirl miqdorini aniqlaydi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-5">
            <h4 className="text-emerald-400 font-bold mb-3">α-spirl (75%)</h4>
            <svg viewBox="0 0 200 150" className="w-full h-36">
              {/* Spiral */}
              <path 
                d="M 50 130 Q 70 120 80 100 Q 90 80 100 60 Q 110 40 120 20" 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="3"
              />
              
              {/* Vodorod bog'lari */}
              <line x1="70" y1="110" x2="90" y2="90" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2,2" />
              <line x1="90" y1="90" x2="110" y2="70" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2,2" />
              <line x1="110" y1="70" x2="130" y2="50" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2,2" />

              <text x="100" y="145" fill="#10b981" fontSize="8" textAnchor="middle">
                α-spirl (3.6 aa/turn)
              </text>
            </svg>
            <ul className="text-purple-200 text-xs space-y-1 mt-2">
              <li>✓ CD: <strong>222 nm da manfiy</strong> cho'qqi</li>
              <li>✓ CD: <strong>208 nm da manfiy</strong> cho'qqi</li>
              <li>✓ CD: <strong>190 nm da musbat</strong> cho'qqi</li>
              <li>✓ Vodorod bog'lari — barqaror</li>
            </ul>
          </div>

          <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-5">
            <h4 className="text-blue-400 font-bold mb-3">β-qavat (10%)</h4>
            <svg viewBox="0 0 200 150" className="w-full h-36">
              {/* Qavatlar */}
              <line x1="40" y1="40" x2="160" y2="40" stroke="#3b82f6" strokeWidth="3" />
              <line x1="40" y1="70" x2="160" y2="70" stroke="#3b82f6" strokeWidth="3" />
              <line x1="40" y1="100" x2="160" y2="100" stroke="#3b82f6" strokeWidth="3" />
              
              {/* Vodorod bog'lari */}
              <line x1="60" y1="40" x2="60" y2="70" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2,2" />
              <line x1="100" y1="70" x2="100" y2="100" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2,2" />
              <line x1="140" y1="40" x2="140" y2="70" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2,2" />

              <text x="100" y="130" fill="#3b82f6" fontSize="8" textAnchor="middle">
                β-qavat (parallel/antiparallel)
              </text>
            </svg>
            <ul className="text-purple-200 text-xs space-y-1 mt-2">
              <li>✓ CD: <strong>218 nm da manfiy</strong> cho'qqi</li>
              <li>✓ CD: <strong>195 nm da musbat</strong> cho'qqi</li>
              <li>✓ Vodorod bog'lari — barqaror</li>
              <li>✓ Kam miqdorda (10%)</li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 CD orqali ikkilamchi struktura aniqlash:</p>
          <p className="text-purple-200">
            <strong>222 nm / 208 nm nisbati</strong> — α-spirl miqdori ko'rsatkichi.
            <br/>
            <strong>218 nm cho'qqi</strong> — β-qavat miqdori.
            <br/>
            <strong>Denaturatsiya</strong> → α-spirl kamayadi → 222 nm cho'qqi kuchsizlanadi.
            <br/>
            Bu usul <strong>oqsil barqarorligini</strong> o'rganishda keng qo'llaniladi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. T va R HOLATLAR — KONFORMATSION O'ZGARISH
// ============================================================================
function T_RHolatlar() {
  const [holat, setHolat] = useState("T")

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 T va R holatlar — konformatsion o'zgarish</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-red-700/30 space-y-4">
        <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400 font-bold mb-2">💎 Kooperativ bog'lanish:</p>
          <p className="text-purple-200 text-xs">
            Gemoglobin <strong>allosterik oqsil</strong> — birinchi O₂ bog'langanda, qolganlari osonroq bog'lanadi.
            Bu <strong>T (tarang) → R (bo'shashgan)</strong> konformatsion o'zgarish orqali amalga oshadi.
            CD spektroskopiyasi bu o'zgarishni <strong>aniq ko'rsatadi</strong>.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setHolat("T")}
            className={`px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              holat === "T" 
                ? "bg-purple-600/80 text-white shadow-lg" 
                : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
            }`}>
            <div className="text-lg mb-1">🔒</div>
            <div>T holat (Tarang)</div>
            <div className="text-[9px] opacity-70 mt-1">Deoksi, past O₂ affiniti</div>
          </button>

          <button onClick={() => setHolat("R")}
            className={`px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              holat === "R" 
                ? "bg-red-600/80 text-white shadow-lg" 
                : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
            }`}>
            <div className="text-lg mb-1">🔓</div>
            <div>R holat (Bo'shashgan)</div>
            <div className="text-[9px] opacity-70 mt-1">Oksigenlangan, yuqori O₂ affiniti</div>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`rounded-xl p-5 ${holat === "T" ? "bg-purple-900/50 border-2 border-purple-500/50" : "bg-purple-900/20"}`}>
            <h4 className="text-purple-400 font-bold mb-3">T holat xususiyatlari:</h4>
            <ul className="text-purple-200 text-xs space-y-2">
              <li>✓ <strong>Deoksi</strong> — O₂ yo'q</li>
              <li>✓ <strong>Tarang struktura</strong> — ko'p tuzli ko'priklar</li>
              <li>✓ <strong>Past affiniti</strong> — O₂ bog'lanishi qiyin</li>
              <li>✓ <strong>CD spektri</strong> — α-spirl biroz kamroq</li>
              <li>✓ <strong>Soret bandi</strong> — 430 nm (siljigan)</li>
            </ul>
          </div>

          <div className={`rounded-xl p-5 ${holat === "R" ? "bg-red-900/50 border-2 border-red-500/50" : "bg-purple-900/20"}`}>
            <h4 className="text-red-400 font-bold mb-3">R holat xususiyatlari:</h4>
            <ul className="text-purple-200 text-xs space-y-2">
              <li>✓ <strong>Oksigenlangan</strong> — 4 ta O₂ bog'langan</li>
              <li>✓ <strong>Bo'shashgan struktura</strong> — tuzli ko'priklar uzilgan</li>
              <li>✓ <strong>Yuqori affiniti</strong> — O₂ oson bog'lanadi</li>
              <li>✓ <strong>CD spektri</strong> — α-spirl biroz ko'proq</li>
              <li>✓ <strong>Soret bandi</strong> — 415 nm (asosiy)</li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 CD orqali T → R o'tishni kuzatish:</p>
          <p className="text-purple-200">
            <strong>222 nm cho'qqi</strong> — T → R o'tishda biroz o'zgaradi (α-spirl o'zgarishi).
            <br/>
            <strong>Soret bandi</strong> — 430 nm → 415 nm siljiydi (O₂ bog'lanishi).
            <br/>
            Bu o'zgarishlar <strong>kooperativ bog'lanish</strong> mexanizmini tushunishga yordam beradi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. KISLOROD BOG'LANISHI TA'SIRI
// ============================================================================
function KislorodBoglanishi() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">💨 Kislorod bog'lanishi — CD spektriga ta'siri</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-red-700/30 space-y-4">
        <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400 font-bold mb-2">💎 Kislorod ta'siri:</p>
          <p className="text-purple-200 text-xs">
            O₂ bog'langanda gem guruhi <strong>elektron strukturasi o'zgaradi</strong>.
            Bu <strong>Soret bandi</strong> va <strong>d-d o'tishlar</strong>ga ta'sir qiladi.
            CD spektroskopiyasi bu o'zgarishlarni <strong>aniq ko'rsatadi</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-red-400 font-bold mb-3">Soret bandi o'zgarishi:</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Deoksi (Hb):</span>
                <span className="text-red-400 font-mono">430 nm</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Oksigenlangan (HbO₂):</span>
                <span className="text-red-400 font-mono">415 nm</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">MetHb (Fe³⁺):</span>
                <span className="text-red-400 font-mono">405 nm</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Siljish:</span>
                <span className="text-emerald-400">15 nm (ko'k siljish)</span>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-red-400 font-bold mb-3">CD intensivligi o'zgarishi:</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Deoksi Δε:</span>
                <span className="text-red-400 font-mono">−12.0</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Oksigenlangan Δε:</span>
                <span className="text-red-400 font-mono">−15.0</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">MetHb Δε:</span>
                <span className="text-red-400 font-mono">−18.0</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">O'zgarish:</span>
                <span className="text-emerald-400">25% kuchli</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun o'zgaradi?</p>
          <p className="text-purple-200">
            <strong>O₂ bog'lanishi</strong> → Fe²⁺ elektron zichligi o'zgaradi →
            <strong> porfirin halqasi</strong> elektron strukturasi o'zgaradi →
            Soret bandi <strong>ko'k siljish</strong> (430 → 415 nm) va CD <strong>kuchayadi</strong>.
            <br/>
            Bu o'zgarishlar <strong>gemoglobin funksiyasini</strong> kuzatishda muhim.
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

      <div className="bg-purple-800/30 rounded-xl p-5 border border-red-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🏥</div>
            <h4 className="text-red-400 font-bold mb-2">Tibbiy diagnostika</h4>
            <p className="text-purple-200 text-xs">
              CD spektroskopiyasi <strong>gemoglobin kasalliklarini</strong> aniqlashda ishlatiladi:
              <br/>
              • <strong>O'roqsimon hujayra anemiyasi</strong> — HbS strukturasi
              <br/>
              • <strong>Talassemiya</strong> — gemoglobin sintezi buzilishi
              <br/>
              • <strong>Metgemoglobinemiya</strong> — Fe³⁺ miqdori oshishi
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🔬</div>
            <h4 className="text-red-400 font-bold mb-2">Oqsil barqarorligi</h4>
            <p className="text-purple-200 text-xs">
              CD orqali <strong>denaturatsiya darajasi</strong> aniqlanadi:
              <br/>
              • <strong>Harorat denaturatsiyasi</strong> — T<sub>m</sub> aniqlash
              <br/>
              • <strong>pH denaturatsiyasi</strong> — barqarorlik oralig'i
              <br/>
              • <strong>Kimyoviy denaturatsiya</strong> — urea, guanidin ta'siri
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">💊</div>
            <h4 className="text-red-400 font-bold mb-2">Dori vositalari</h4>
            <p className="text-purple-200 text-xs">
              Dori vositalarining <strong>gemoglobin bilan o'zaro ta'siri</strong> o'rganiladi:
              <br/>
              • <strong>CO bog'lanishi</strong> — uglerod monoksit zaharlanishi
              <br/>
              • <strong>Nitritlar</strong> — MetHb hosil qilish
              <br/>
              • <strong>Antimalariyal dori</strong>lar — gemoglobin funksiyasiga ta'siri
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🧬</div>
            <h4 className="text-red-400 font-bold mb-2">Biofizik tadqiqotlar</h4>
            <p className="text-purple-200 text-xs">
              Gemoglobin — <strong>allosterik oqsillar</strong> modeli:
              <br/>
              • <strong>Kooperativ bog'lanish</strong> mexanizmi
              <br/>
              • <strong>T → R o'tish</strong> kinetikasi
              <br/>
              • <strong>Mutant gemoglobinlar</strong> xususiyatlari
            </p>
          </div>
        </div>

        <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400 font-bold mb-2">🌟 Qiziqarli fakt:</p>
          <p className="text-purple-200 text-xs">
            Gemoglobin CD spektri shunchalik <strong>xarakterli</strong>ki, <strong>bir necha soniya</strong> ichida
            qon namunasining <strong>oksigenlangan yoki deoksi</strong> ekanligini aniqlash mumkin.
            Bu <strong>tez tibbiy diagnostika</strong> uchun muhim usul.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function GemoglobinCD() {
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
          <span className="text-red-400">Gemoglobin</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-red-400">🔄 Gemoglobin — CD tahlili</h1>
          <p className="text-purple-400 text-sm">
            Fe²⁺/Fe³⁺ (gem) • α-spirl struktura • Soret bandi • T/R holatlar
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-red-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-4xl md:text-5xl font-extrabold font-mono text-red-400">Gemoglobin</span>
            <div>
              <h2 className="text-xl font-bold text-white">CD tahlili — to'liq profil</h2>
              <p className="text-purple-400">"Kislorod tashuvchi oqsil" — biologik kompleks klassikasi</p>
            </div>
          </div>

          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              Gemoglobin — <strong className="text-red-400">biologik CD spektroskopiyasining klassik namunasi</strong>.
              4 ta subbirit (2α + 2β), har birida <strong>gem guruhi</strong> (Fe²⁺ porfirin halqada).
              CD spektri <strong>ikkita muhim sohani</strong> o'z ichiga oladi:
              <strong> uzoq UV</strong> (190-250 nm, α-spirl struktura) va
              <strong> ko'rinadigan</strong> (350-450 nm, Soret bandi).
              Kislorod bog'lanishi, harorat, pH o'zgarishi CD spektriga <strong>kuchli ta'sir</strong> ko'rsatadi.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-red-400 font-bold text-lg">Fe²⁺ (gem)</p>
              <p className="text-purple-300">porfirin</p>
              <p className="text-purple-400 mt-1">oktaedrik</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-red-400 font-bold text-lg">α-spirl</p>
              <p className="text-purple-300">~75%</p>
              <p className="text-purple-400 mt-1">ikkilamchi str.</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-red-400 font-bold text-lg">Soret</p>
              <p className="text-purple-300">415 nm</p>
              <p className="text-purple-400 mt-1">kuchli band</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-red-400 font-bold text-lg">T ↔ R</p>
              <p className="text-purple-300">holatlar</p>
              <p className="text-purple-400 mt-1">konform. o'zgarish</p>
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

        {/* IKKILAMCHI STRUKTURA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <IkkilamchiStruktura />
        </div>

        {/* T va R HOLATLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <T_RHolatlar />
        </div>

        {/* KISLOROD BOGLANISHI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <KislorodBoglanishi />
        </div>

        {/* AMALIY QO'LLANILISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <AmaliyQollanilish />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-red-600/10 to-purple-600/10 border border-red-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>Gemoglobin — <strong className="text-red-400">biologik CD spektroskopiyasi klassikasi</strong></li>
            <li><strong>Ikki sohali CD</strong>: UV (α-spirl) + ko'rinadigan (Soret)</li>
            <li><strong>α-spirl ~75%</strong> — 222 nm da manfiy cho'qqi</li>
            <li><strong>Soret bandi</strong> — 415 nm (kuchli, ε ≈ 150,000)</li>
            <li><strong>T ↔ R holatlar</strong> — konformatsion o'zgarish</li>
            <li><strong>Kislorod bog'lanishi</strong> → Soret 430 → 415 nm siljiydi</li>
            <li><strong>Denaturatsiya</strong> → α-spirl kamayadi → CD kuchsizlanadi</li>
            <li><strong>Harorat, pH</strong> ta'siri — barqarorlik o'rganish</li>
            <li><strong>Tibbiy diagnostika</strong> — gemoglobin kasalliklari</li>
            <li><strong>Allosterik oqsil</strong> modeli — kooperativ bog'lanish</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/cd/birikmalar/co-dchxn3" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← [Co(dchxn)₃]³⁺
          </Link>
          <Link href="/ilmiy/tahlil/cd/birikmalar/sitoxrom-c" className="px-6 py-3 bg-red-600/80 rounded-xl hover:bg-red-500 text-white font-semibold">
            Sitoxrom c →
          </Link>
        </div>

      </section>
    </main>
  )
}