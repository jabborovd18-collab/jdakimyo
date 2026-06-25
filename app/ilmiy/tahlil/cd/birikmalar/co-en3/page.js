"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. CD SPEKTR SIMULYATORI ([Co(en)₃]³⁺ uchun)
// ============================================================================
function CDSpectrumSimulator() {
  const [enantiomer, setEnantiomer] = useState("delta")
  const [ee, setEe] = useState(100)
  const [showSecondBand, setShowSecondBand] = useState(true)

  // [Co(en)₃]³⁺ xarakterli parametrlar
  // ¹A₁g → ¹T₁g: ~470 nm (ko'rinadigan)
  // ¹A₁g → ¹T₂g: ~340 nm (UV)
  const bands = [
    { lambda_max: 470, epsilon: 80, delta_epsilon_max: 2.0, assign: "¹A₁g → ¹T₁g" },
    { lambda_max: 340, epsilon: 5000, delta_epsilon_max: -8.0, assign: "¹A₁g → ¹T₂g" },
  ]

  const sign = enantiomer === "delta" ? 1 : -1
  const eeFactor = ee / 100

  // CD spektri simulyatsiyasi
  const spectrum = useMemo(() => {
    const points = []
    for (let i = 0; i < 400; i++) {
      const lambda = 250 + i * 1.5 // 250-850 nm
      let cotton = 0
      let absorption = 0

      bands.forEach((band, idx) => {
        if (!showSecondBand && idx === 1) return
        
        const x = (lambda - band.lambda_max) / 40
        
        // Cotton effekti (Gaussian derivative)
        const cottonBand = sign * x * Math.exp(-0.5 * x * x) * band.delta_epsilon_max * eeFactor
        
        // Absorbsiya (Gaussian)
        const absBand = Math.exp(-0.5 * x * x) * band.epsilon * eeFactor
        
        cotton += cottonBand
        absorption += absBand
      })

      points.push({ lambda, cotton, absorption })
    }
    return points
  }, [enantiomer, ee, sign, eeFactor, showSecondBand])

  const maxCotton = Math.max(...spectrum.map(p => Math.abs(p.cotton)), 0.1)
  const maxAbs = Math.max(...spectrum.map(p => p.absorption), 0.1)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📊 CD spektr simulyatori — [Co(en)₃]³⁺</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-blue-700/30 space-y-4">
        <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-blue-400 font-bold mb-2">💎 Klassik misol:</p>
          <p className="text-purple-200 text-xs">
            [Co(en)₃]³⁺ — CD spektroskopiyasining <strong>eng klassik namunasi</strong>.
            Δ-izomer birinchi d-d o'tishda (¹A₁g → ¹T₁g, ~470 nm) <strong>musbat Cotton effekti</strong> beradi.
            Λ-izomer esa <strong>manfiy</strong>. Bu empirik qoida barcha oktaedrik tris-xelat Co(III) komplekslari uchun ishlaydi.
          </p>
        </div>

        {/* BOSHQARUV */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-yellow-400 font-bold mb-2 block">Enantiomer:</label>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setEnantiomer("delta")}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  enantiomer === "delta" 
                    ? "bg-blue-600/80 text-white shadow-lg" 
                    : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
                }`}>
                Δ (delta) — P-helis
              </button>
              <button onClick={() => setEnantiomer("lambda")}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  enantiomer === "lambda" 
                    ? "bg-rose-600/80 text-white shadow-lg" 
                    : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
                }`}>
                Λ (lambda) — M-helis
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">ee (%):</span>
                <span className="text-emerald-400 font-mono">{ee}%</span>
              </label>
              <input type="range" min="0" max="100" step="5" value={ee}
                onChange={(e) => setEe(parseInt(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-blue-500" />
            </div>
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input type="checkbox" checked={showSecondBand}
                onChange={(e) => setShowSecondBand(e.target.checked)}
                className="accent-blue-500" />
              <span className="text-purple-300">Ikkinchi o'tishni ko'rsatish (¹T₂g, 340 nm)</span>
            </label>
          </div>
        </div>

        {/* SPEKTR */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-blue-400 font-bold text-xs mb-2">
            CD spektri va absorbsiya: {enantiomer === "delta" ? "Δ" : "Λ"}-[Co(en)₃]³⁺
          </h5>
          <svg viewBox="0 0 400 280" className="w-full h-64">
            {/* O'qlar */}
            <line x1="40" y1="140" x2="380" y2="140" stroke="#4c1d95" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="40" y1="20" x2="40" y2="260" stroke="#4c1d95" strokeWidth="1" />
            
            <text x="210" y="275" fill="#c4b5fd" fontSize="9" textAnchor="middle">λ (nm)</text>
            <text x="40" y="270" fill="#a78bfa" fontSize="8">250</text>
            <text x="380" y="270" fill="#a78bfa" fontSize="8" textAnchor="end">850</text>
            <text x="20" y="140" fill="#a78bfa" fontSize="8" textAnchor="middle" transform="rotate(-90, 20, 140)">
              Δε / ε
            </text>

            {/* λ_max belgilari */}
            {bands.map((band, idx) => {
              if (!showSecondBand && idx === 1) return null
              const x = 40 + ((band.lambda_max - 250) / 600) * 340
              return (
                <g key={idx}>
                  <line x1={x} y1="20" x2={x} y2="260" stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x={x} y="15" fill="#fbbf24" fontSize="7" textAnchor="middle">
                    {band.lambda_max} nm
                  </text>
                </g>
              )
            })}

            {/* Absorbsiya egri chizig'i */}
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
              fill="none" stroke={sign > 0 ? "#3b82f6" : "#f43f5e"} strokeWidth="2"
            />

            {/* Legend */}
            <text x="280" y="30" fill="#fbbf24" fontSize="8">— Absorbsiya (ε)</text>
            <text x="280" y="45" fill={sign > 0 ? "#3b82f6" : "#f43f5e"} fontSize="8">
              — CD (Δε)
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          <div className={`rounded-lg p-3 ${enantiomer === "delta" ? "bg-blue-900/30 border border-blue-500/50" : "bg-purple-900/50"}`}>
            <p className="text-purple-400">Enantiomer</p>
            <p className={`font-bold ${enantiomer === "delta" ? "text-blue-400" : "text-rose-400"}`}>
              {enantiomer === "delta" ? "Δ (delta)" : "Λ (lambda)"}
            </p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Birinchi Cotton</p>
            <p className={`font-bold ${sign > 0 ? "text-emerald-400" : "text-red-400"}`}>
              {sign > 0 ? "Musbat (+)" : "Manfiy (−)"}
            </p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">ee</p>
            <p className="text-yellow-400 font-bold">{ee}%</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Empirik qoida:</p>
          <p className="text-purple-200">
            <strong>Δ-[Co(en)₃]³⁺</strong> — birinchi d-d o'tishda (¹T₁g, ~470 nm) <strong>musbat</strong> Cotton effekti.
            <br/>
            <strong>Λ-[Co(en)₃]³⁺</strong> — birinchi d-d o'tishda <strong>manfiy</strong> Cotton effekti.
            <br/>
            Bu qoida barcha oktaedrik tris-xelat Co(III), Cr(III), Rh(III) komplekslari uchun ishlaydi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. Δ vs Λ 3D VIZUALIZATSIYA
// ============================================================================
function DeltaLambdaVisualization() {
  const [rotate, setRotate] = useState(0)
  const [activeEnantiomer, setActiveEnantiomer] = useState("delta")

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔷 Δ va Λ enantiomerlar — 3D vizualizatsiya</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-blue-700/30 space-y-4">
        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">Aylantirish burchagi:</span>
            <span className="text-emerald-400 font-mono">{rotate}°</span>
          </label>
          <input type="range" min="0" max="360" step="5" value={rotate}
            onChange={(e) => setRotate(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-blue-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Δ */}
          <div 
            onClick={() => setActiveEnantiomer("delta")}
            className={`bg-blue-900/20 border-2 rounded-xl p-4 cursor-pointer transition-all ${
              activeEnantiomer === "delta" ? "border-blue-400 shadow-lg" : "border-blue-500/30"
            }`}>
            <h4 className="text-blue-400 font-bold mb-2 text-center">Δ (delta) — P-helis</h4>
            <svg viewBox="0 0 200 200" className="w-full h-48">
              {/* C₃ o'qi */}
              <line x1="100" y1="20" x2="100" y2="180" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,2" />
              <text x="110" y="15" fill="#fbbf24" fontSize="8">C₃</text>

              {/* Markaziy Co */}
              <circle cx="100" cy="100" r="15" fill="#3b82f6" />
              <text x="100" y="105" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">Co</text>

              {/* 3 ta en ligand (spiral) */}
              {Array.from({ length: 3 }).map((_, i) => {
                const angle = (i * 120 + rotate) * Math.PI / 180
                const x1 = 100 + 40 * Math.cos(angle)
                const y1 = 100 + 40 * Math.sin(angle)
                const x2 = 100 + 70 * Math.cos(angle + 0.4)
                const y2 = 100 + 70 * Math.sin(angle + 0.4)
                return (
                  <g key={i}>
                    <line x1="100" y1="100" x2={x1} y2={y1} stroke="#60a5fa" strokeWidth="2" />
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#60a5fa" strokeWidth="2" />
                    <circle cx={x1} cy={y1} r="5" fill="#60a5fa" />
                    <circle cx={x2} cy={y2} r="5" fill="#60a5fa" />
                    <text x={(x1+x2)/2} y={(y1+y2)/2 - 5} fill="#93c5fd" fontSize="7" textAnchor="middle">en</text>
                  </g>
                )
              })}

              {/* Spiral yo'nalishi */}
              <path d="M 100 50 Q 140 75 145 100 Q 140 125 100 150" 
                fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3,2" />
              <text x="155" y="100" fill="#fbbf24" fontSize="8">O'ng vint →</text>
            </svg>
            <p className="text-blue-400 text-xs text-center mt-2">
              C₃ o'qi bo'ylab o'ngga burilgan
            </p>
          </div>

          {/* Λ */}
          <div 
            onClick={() => setActiveEnantiomer("lambda")}
            className={`bg-rose-900/20 border-2 rounded-xl p-4 cursor-pointer transition-all ${
              activeEnantiomer === "lambda" ? "border-rose-400 shadow-lg" : "border-rose-500/30"
            }`}>
            <h4 className="text-rose-400 font-bold mb-2 text-center">Λ (lambda) — M-helis</h4>
            <svg viewBox="0 0 200 200" className="w-full h-48">
              {/* C₃ o'qi */}
              <line x1="100" y1="20" x2="100" y2="180" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,2" />
              <text x="110" y="15" fill="#fbbf24" fontSize="8">C₃</text>

              {/* Markaziy Co */}
              <circle cx="100" cy="100" r="15" fill="#f43f5e" />
              <text x="100" y="105" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">Co</text>

              {/* 3 ta en ligand (teskari spiral) */}
              {Array.from({ length: 3 }).map((_, i) => {
                const angle = (i * 120 - rotate) * Math.PI / 180
                const x1 = 100 + 40 * Math.cos(angle)
                const y1 = 100 + 40 * Math.sin(angle)
                const x2 = 100 + 70 * Math.cos(angle - 0.4)
                const y2 = 100 + 70 * Math.sin(angle - 0.4)
                return (
                  <g key={i}>
                    <line x1="100" y1="100" x2={x1} y2={y1} stroke="#fb7185" strokeWidth="2" />
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fb7185" strokeWidth="2" />
                    <circle cx={x1} cy={y1} r="5" fill="#fb7185" />
                    <circle cx={x2} cy={y2} r="5" fill="#fb7185" />
                    <text x={(x1+x2)/2} y={(y1+y2)/2 - 5} fill="#fda4af" fontSize="7" textAnchor="middle">en</text>
                  </g>
                )
              })}

              {/* Spiral yo'nalishi */}
              <path d="M 100 50 Q 60 75 55 100 Q 60 125 100 150" 
                fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3,2" />
              <text x="20" y="100" fill="#fbbf24" fontSize="8">← Chap vint</text>
            </svg>
            <p className="text-rose-400 text-xs text-center mt-2">
              C₃ o'qi bo'ylab chapga burilgan
            </p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Enantiomerlar qanday aniqlanadi?</p>
          <p className="text-purple-200">
            Δ va Λ — bir-birining <strong>ko'zgudagi aksi</strong> (enantiomerlar).
            Ularni <strong>CD spektroskopiyasi</strong> orqali farqlash mumkin:
            <br/>• Δ → birinchi d-d o'tishda <strong>musbat</strong> Cotton effekti
            <br/>• Λ → birinchi d-d o'tishda <strong>manfiy</strong> Cotton effekti
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. XELAT HALQASI KONFORMATSIYASI
// ============================================================================
function ChelateConformation() {
  const [conformation, setConformation] = useState("lel")

  const conformations = {
    lel: {
      name: "lel (λ for Δ, δ for Λ)",
      desc: "Metall markazidagi xirallik bilan xelat halqasi konformatsiyasi mos keladi",
      stability: "Eng barqaror",
      energy: "0 kJ/mol",
      color: "#10b981"
    },
    ob: {
      name: "ob (δ for Δ, λ for Λ)",
      desc: "Teskari moslik — sterik to'siq mavjud",
      stability: "Kam barqaror",
      energy: "+4-8 kJ/mol",
      color: "#ef4444"
    }
  }

  const c = conformations[conformation]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔗 Xelat halqasi konformatsiyasi — lel vs ob</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-blue-700/30 space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(conformations).map(([key, val]) => (
            <button key={key} onClick={() => setConformation(key)}
              className={`px-3 py-3 rounded-lg text-xs font-bold transition-all ${
                conformation === key 
                  ? "bg-blue-600/80 text-white shadow-lg" 
                  : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
              }`}>
              <div>{val.name}</div>
              <div className="text-[9px] opacity-70 mt-1">{val.stability}</div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-lg p-4">
            <h5 className="text-blue-400 font-bold text-xs mb-2">en xelat halqasi:</h5>
            <svg viewBox="0 0 200 150" className="w-full h-36">
              {/* 5 a'zoli halqa */}
              <polygon 
                points="100,30 140,60 130,110 70,110 60,60" 
                fill="none" 
                stroke={c.color} 
                strokeWidth="2"
              />
              
              {/* Atomlar */}
              <circle cx="100" cy="30" r="8" fill="#3b82f6" />
              <text x="100" y="34" fill="white" fontSize="8" textAnchor="middle">Co</text>
              
              <circle cx="140" cy="60" r="6" fill="#10b981" />
              <text x="140" y="63" fill="white" fontSize="7" textAnchor="middle">N</text>
              
              <circle cx="130" cy="110" r="6" fill="#6b7280" />
              <text x="130" y="113" fill="white" fontSize="7" textAnchor="middle">C</text>
              
              <circle cx="70" cy="110" r="6" fill="#6b7280" />
              <text x="70" y="113" fill="white" fontSize="7" textAnchor="middle">C</text>
              
              <circle cx="60" cy="60" r="6" fill="#10b981" />
              <text x="60" y="63" fill="white" fontSize="7" textAnchor="middle">N</text>

              {/* Konformatsiya ko'rsatkichi */}
              <text x="100" y="140" fill={c.color} fontSize="10" textAnchor="middle" fontWeight="bold">
                {conformation === "lel" ? "lel konformatsiya" : "ob konformatsiya"}
              </text>
            </svg>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <h5 className="text-blue-400 font-bold text-xs mb-2">Xususiyatlari:</h5>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Konformatsiya:</span>
                <span className="text-emerald-400 font-bold">{c.name}</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Barqarorlik:</span>
                <span className="text-emerald-400">{c.stability}</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Energiya:</span>
                <span className="text-yellow-400 font-mono">{c.energy}</span>
              </div>
              <p className="text-purple-200 text-[10px] mt-2 italic">{c.desc}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun lel barqarorroq?</p>
          <p className="text-purple-200">
            <strong>lel</strong> konformatsiyada xelat halqasining vodorod atomlari bir-biridan 
            <strong> maksimal uzoqda</strong> joylashgan → sterik to'qnashuv minimal.
            <strong> ob</strong> konformatsiyada esa vodorodlar yaqinlashadi → sterik to'siq → kam barqaror.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. ENANTIOMER AJRATISH USULLARI
// ============================================================================
function EnantiomerAjratish() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🧪 Enantiomerlarni ajratish usullari</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-blue-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-5">
            <div className="text-3xl mb-2">🧂</div>
            <h4 className="text-blue-400 font-bold mb-2">1. Klassik usul — diastereomer tuzlar</h4>
            <p className="text-purple-200 text-xs mb-2">
              Ratsemik aralashmaga <strong>xiral qarshi ion</strong> qo'shiladi.
              Δ va Λ enantiomerlar <strong>diastereomer tuzlar</strong> hosil qiladi — 
              ularning eruvchanligi farqli, shuning uchun kristallizatsiya orqali ajratish mumkin.
            </p>
            <div className="bg-purple-900/50 rounded p-2 text-[10px]">
              <p className="text-purple-300">Misol:</p>
              <p className="text-blue-400 font-mono">
                D- (yoki L-) tartarat + [Co(en)₃]³⁺ → diastereomer tuzlar
              </p>
            </div>
          </div>

          <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-5">
            <div className="text-3xl mb-2">🔄</div>
            <h4 className="text-emerald-400 font-bold mb-2">2. Xiral xromatografiya (HPLC)</h4>
            <p className="text-purple-200 text-xs mb-2">
              <strong>Xiral statsionar faza</strong> (masalan, xiral kolonna) orqali HPLC.
              Δ va Λ enantiomerlar kolonna bilan <strong>turlicha o'zaro ta'sir</strong> qiladi →
              turli vaqtda chiqadi.
            </p>
            <div className="bg-purple-900/50 rounded p-2 text-[10px]">
              <p className="text-purple-300">Afzalligi:</p>
              <p className="text-emerald-400">Tez, samarali, analitik miqyosda</p>
            </div>
          </div>

          <div className="bg-violet-900/20 border border-violet-500/30 rounded-xl p-5">
            <div className="text-3xl mb-2">📊</div>
            <h4 className="text-violet-400 font-bold mb-2">3. CD spektroskopiyasi</h4>
            <p className="text-purple-200 text-xs mb-2">
              CD spektri orqali <strong>absolyut konfiguratsiya</strong> aniqlanadi.
              Musbat/manfiy Cotton effekti Δ/Λ ni ko'rsatadi.
              <strong> Enantiomer tozaligi (ee%)</strong> ham aniqlanadi.
            </p>
            <div className="bg-purple-900/50 rounded p-2 text-[10px]">
              <p className="text-purple-300">Afzalligi:</p>
              <p className="text-violet-400">Bevosita, tez, miqdoriy</p>
            </div>
          </div>

          <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-5">
            <div className="text-3xl mb-2">🔬</div>
            <h4 className="text-amber-400 font-bold mb-2">4. Rentgen kristallografiyasi</h4>
            <p className="text-purple-200 text-xs mb-2">
              <strong>Anomalous dispersion</strong> (Flack parametri) orqali absolyut konfiguratsiya
              aniqlanadi. Eng <strong>ishonchli</strong> usul, lekin yaxshi kristall kerak.
            </p>
            <div className="bg-purple-900/50 rounded p-2 text-[10px]">
              <p className="text-purple-300">Afzalligi:</p>
              <p className="text-amber-400">To'liq 3D struktura, absolyut konfiguratsiya</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Tarixiy usul (Verner):</p>
          <p className="text-purple-200">
            Alfred Verner 1911 yilda birinchi marta [Co(en)₃]³⁺ ni ajratgan.
            U <strong>D-bromkamfonsulfonat</strong> (xiral qarshi ion) yordamida diastereomer tuzlar hosil qildi
            va ularni fraksion kristallizatsiya orqali ajratdi. Bu <strong>xiral koordinatsion kimyoning</strong> boshlanishi edi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. TARIXIY KONTEKST
// ============================================================================
function TarixiyKontekst() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🏛️ Tarixiy kontekst — Verner va CD</h3>

      <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-5 border border-blue-500/30 space-y-4">
        <div className="space-y-3">
          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🏆</div>
              <div>
                <p className="text-yellow-400 font-bold">1893 — Alfred Verner (26 yoshda)</p>
                <p className="text-purple-200 text-xs mt-1">
                  Shveytsariyalik kimyogar <strong>koordinatsion nazariyani</strong> yaratdi.
                  Oktaedrik komplekslar <strong>geometrik va optik izomerlarga</strong> ega bo'lishini bashorat qildi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🔬</div>
              <div>
                <p className="text-yellow-400 font-bold">1911 — Birinchi enantiomer ajratish</p>
                <p className="text-purple-200 text-xs mt-1">
                  Verner [Co(en)₃]³⁺ ning Δ va Λ enantiomerlarini birinchi marta ajratdi.
                  Bu <strong>uglerodsiz molekulada xirallikning birinchi isboti</strong> edi — 
                  tanqidchilar jim bo'lishdi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🏅</div>
              <div>
                <p className="text-yellow-400 font-bold">1913 — Nobel mukofoti</p>
                <p className="text-purple-200 text-xs mt-1">
                  Verner "kimyoda bog'lanish tabiatini o'rganishdagi xizmatlari uchun" Nobel mukofotini oldi.
                  [Co(en)₃]³⁺ bu kashfiyotning <strong>asosiy dalili</strong> bo'ldi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">📊</div>
              <div>
                <p className="text-yellow-400 font-bold">1960-70 — CD spektroskopiyasi</p>
                <p className="text-purple-200 text-xs mt-1">
                  CD spektroskopiyasi rivojlanishi bilan [Co(en)₃]³⁺ ning absolyut konfiguratsiyasi
                  <strong>empirik qoida</strong> orqali aniqlandi: Δ → musbat Cotton effekti.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 [Co(en)₃]³⁺ ning ahamiyati:</p>
          <ul className="text-purple-200 space-y-1 list-disc list-inside">
            <li><strong>Koordinatsion kimyo poydevori</strong> — Verner nazariyasi</li>
            <li><strong>Birinchi optik faol kompleks</strong> — uglerodsiz xirallik</li>
            <li><strong>CD spektroskopiyasining standarti</strong> — empirik qoida</li>
            <li><strong>Nobel mukofoti</strong> — 1913 yil</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 6. ELEKTRON KONFIGURATSIYA VA O'TISHLAR
// ============================================================================
function ElektronKonfiguratsiya() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔬 Elektron konfiguratsiya va d-d o'tishlar</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-blue-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-blue-400 font-bold mb-3">Kristall maydon diagrammasi:</h4>
            <div className="font-mono text-xs space-y-3">
              <div className="flex justify-between items-center border-b border-purple-700/30 pb-2">
                <span className="text-red-400 w-24">e<sub>g</sub>*</span>
                <div className="flex gap-2">
                  <span className="text-purple-500">__</span>
                  <span className="text-purple-500">__</span>
                </div>
                <span className="text-purple-500">bo'sh</span>
              </div>

              <div className="text-center text-blue-400 text-[10px] py-1">
                Δ<sub>o</sub> = 22,900 cm⁻¹
              </div>

              <div className="flex justify-between items-center border-t border-purple-700/30 pt-2">
                <span className="text-emerald-400 w-24">t₂g</span>
                <div className="flex gap-2">
                  <span className="text-yellow-400">↑↓</span>
                  <span className="text-yellow-400">↑↓</span>
                  <span className="text-yellow-400">↑↓</span>
                </div>
                <span className="text-emerald-400">6 e⁻</span>
              </div>

              <div className="bg-blue-900/30 border border-blue-500/30 rounded p-2 text-center mt-3">
                <p className="text-[10px] text-purple-300">Konfiguratsiya:</p>
                <p className="text-blue-400 font-bold">t₂g⁶ e<sub>g</sub>⁰</p>
                <p className="text-[10px] text-purple-400 mt-1">¹A₁g ground state</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-blue-400 font-bold mb-3">d-d o'tishlar:</h4>
            <div className="space-y-2 text-xs">
              <div className="bg-purple-900/50 rounded p-2">
                <div className="flex justify-between">
                  <span className="text-blue-400 font-bold">¹A₁g → ¹T₁g</span>
                  <span className="text-emerald-400 font-mono">~470 nm</span>
                </div>
                <p className="text-purple-400 text-[10px] mt-1">Birinchi o'tish — CD da asosiy signal</p>
              </div>
              <div className="bg-purple-900/50 rounded p-2">
                <div className="flex justify-between">
                  <span className="text-blue-400 font-bold">¹A₁g → ¹T₂g</span>
                  <span className="text-emerald-400 font-mono">~340 nm</span>
                </div>
                <p className="text-purple-400 text-[10px] mt-1">Ikkinchi o'tish — UV sohada</p>
              </div>
              <div className="bg-purple-900/50 rounded p-2">
                <div className="flex justify-between">
                  <span className="text-blue-400 font-bold">¹A₁g → ¹A₂g</span>
                  <span className="text-emerald-400 font-mono">~250 nm</span>
                </div>
                <p className="text-purple-400 text-[10px] mt-1">Uchinchi o'tish — kuchsiz</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun CD signal beradi?</p>
          <p className="text-purple-200">
            d-d o'tishlar <strong>Laporte taqiqi</strong> bilan cheklangan (ε kichik), lekin
            <strong> xiral muhitda</strong> chap va o'ng qutblangan nurlar turlicha yutiladi.
            Natijada <strong>CD signali</strong> paydo bo'ladi — bu Δ va Λ ni farqlashga imkon beradi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function CoEn3CD() {
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
          <span className="text-blue-400">[Co(en)₃]³⁺</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">🔄 [Co(en)₃]³⁺ — CD tahlili</h1>
          <p className="text-purple-400 text-sm">
            Co³⁺ (d⁶ LS) • Δ/Λ enantiomerlar • Cotton effekti • Verner klassikasi
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-blue-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-4xl md:text-5xl font-extrabold font-mono text-blue-400">[Co(en)₃]³⁺</span>
            <div>
              <h2 className="text-xl font-bold text-white">CD tahlili — to'liq profil</h2>
              <p className="text-purple-400">"Tris(etilendiamin)kobalt(III)" — Verner klassikasi</p>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              [Co(en)₃]³⁺ — <strong className="text-blue-400">CD spektroskopiyasining eng klassik namunasi</strong>.
              Co³⁺ (d⁶ LS) oktaedrik muhitda <strong>Δ va Λ</strong> enantiomer ko'rinishida mavjud.
              Δ-izomer birinchi d-d o'tishda (¹A₁g → ¹T₁g, ~470 nm) <strong>musbat Cotton effekti</strong> beradi.
              Λ-izomer esa <strong>manfiy</strong>. Bu empirik qoida barcha oktaedrik tris-xelat Co(III) komplekslari uchun ishlaydi.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-blue-400 font-bold text-lg">Co³⁺ (LS)</p>
              <p className="text-purple-300">d⁶, t₂g⁶</p>
              <p className="text-purple-400 mt-1">S = 0</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-blue-400 font-bold text-lg">Δ/Λ</p>
              <p className="text-purple-300">enantiomerlar</p>
              <p className="text-purple-400 mt-1">xiral markaz</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-blue-400 font-bold text-lg">λ<sub>max</sub> = 470</p>
              <p className="text-purple-300">nm</p>
              <p className="text-purple-400 mt-1">¹T₁g o'tish</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-blue-400 font-bold text-lg">Δε ≈ ±2.0</p>
              <p className="text-purple-300">M⁻¹cm⁻¹</p>
              <p className="text-purple-400 mt-1">Cotton effekti</p>
            </div>
          </div>
        </div>

        {/* CD SPEKTR SIMULYATORI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <CDSpectrumSimulator />
        </div>

        {/* Δ vs Λ VIZUALIZATSIYA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <DeltaLambdaVisualization />
        </div>

        {/* ELEKTRON KONFIGURATSIYA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <ElektronKonfiguratsiya />
        </div>

        {/* XELAT KONFORMATSIYA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <ChelateConformation />
        </div>

        {/* ENANTIOMER AJRATISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <EnantiomerAjratish />
        </div>

        {/* TARIX */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <TarixiyKontekst />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>[Co(en)₃]³⁺ — <strong className="text-blue-400">CD spektroskopiyasining klassik namunasi</strong></li>
            <li>Co³⁺ (d⁶ LS, t₂g⁶) — <strong>diamagnit</strong>, S=0</li>
            <li><strong>Δ va Λ</strong> enantiomerlar — ko'zgudagi aksi</li>
            <li>Δ-izomer → birinchi d-d o'tishda <strong>musbat</strong> Cotton effekti</li>
            <li>Λ-izomer → birinchi d-d o'tishda <strong>manfiy</strong> Cotton effekti</li>
            <li>λ<sub>max</sub> ≈ 470 nm (¹A₁g → ¹T₁g), Δε ≈ ±2.0 M⁻¹cm⁻¹</li>
            <li><strong>lel konformatsiya</strong> eng barqaror (Δ-λλλ yoki Λ-δδδ)</li>
            <li>Verner 1911 yilda birinchi marta ajratgan — Nobel mukofoti (1913)</li>
            <li>Empirik qoida barcha tris-xelat Co(III), Cr(III), Rh(III) uchun ishlaydi</li>
            <li>Enantiomerlarni <strong>diastereomer tuzlar, HPLC, CD, XRD</strong> orqali ajratish mumkin</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/cd/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← CD birikmalar
          </Link>
          <Link href="/ilmiy/tahlil/cd/birikmalar/co-ox3" className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 text-white font-semibold">
            [Co(ox)₃]³⁻ →
          </Link>
        </div>

      </section>
    </main>
  )
}