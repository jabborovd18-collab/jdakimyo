"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. CD SPEKTR SIMULYATORI ([Co(dchxn)₃]³⁺ uchun)
// ============================================================================
function CDSpectrumSimulator() {
  const [diastereomer, setDiastereomer] = useState("lambda-delta")
  const [ee, setEe] = useState(100)
  const [ringConf, setRingConf] = useState("chair")

  // (1R,2R)-dchxn uchun diastereomerlar
  const diastereomers = {
    "lambda-delta": {
      name: "Λ-(δ,δ,δ)",
      desc: "Metall Λ, xelatlar δ — eng barqaror",
      lambda_max: 470,
      delta_epsilon_max: -3.5,
      ligand_band: 225,
      ligand_de: -2.0,
      sign: -1
    },
    "lambda-lambda": {
      name: "Λ-(λ,λ,λ)",
      desc: "Metall Λ, xelatlar λ — kam barqaror",
      lambda_max: 470,
      delta_epsilon_max: -2.5,
      ligand_band: 225,
      ligand_de: 1.5,
      sign: -1
    },
    "delta-delta": {
      name: "Δ-(δ,δ,δ)",
      desc: "Metall Δ, xelatlar δ — kam barqaror",
      lambda_max: 470,
      delta_epsilon_max: 2.5,
      ligand_band: 225,
      ligand_de: 1.5,
      sign: 1
    },
    "delta-lambda": {
      name: "Δ-(λ,λ,λ)",
      desc: "Metall Δ, xelatlar λ — eng barqaror (1S,2S bilan)",
      lambda_max: 470,
      delta_epsilon_max: 3.5,
      ligand_band: 225,
      ligand_de: -2.0,
      sign: 1
    }
  }

  const d = diastereomers[diastereomer]
  const eeFactor = ee / 100
  const confFactor = ringConf === "chair" ? 1.0 : 0.6

  // CD spektri simulyatsiyasi
  const spectrum = useMemo(() => {
    const points = []
    for (let i = 0; i < 400; i++) {
      const lambda = 200 + i * 1.5
      let cotton = 0
      let absorption = 0

      // d-d o'tish
      const x1 = (lambda - d.lambda_max) / 35
      const cotton_dd = d.sign * x1 * Math.exp(-0.5 * x1 * x1) * d.delta_epsilon_max * eeFactor * confFactor
      const abs_dd = Math.exp(-0.5 * x1 * x1) * 80 * eeFactor
      
      // Ligand xiral band
      const x2 = (lambda - d.ligand_band) / 20
      const cotton_lig = x2 * Math.exp(-0.5 * x2 * x2) * d.ligand_de * eeFactor * confFactor
      const abs_lig = Math.exp(-0.5 * x2 * x2) * 6000 * eeFactor

      cotton = cotton_dd + cotton_lig
      absorption = abs_dd + abs_lig

      points.push({ lambda, cotton, absorption })
    }
    return points
  }, [diastereomer, ee, ringConf, d, eeFactor, confFactor])

  const maxCotton = Math.max(...spectrum.map(p => Math.abs(p.cotton)), 0.1)
  const maxAbs = Math.max(...spectrum.map(p => p.absorption), 0.1)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📊 CD spektr simulyatori — [Co(dchxn)₃]³⁺</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-teal-700/30 space-y-4">
        <div className="bg-teal-600/10 border border-teal-500/30 rounded-lg p-4">
          <p className="text-teal-400 font-bold mb-2">💎 Halqali xiral ligand — eng kuchli CD:</p>
          <p className="text-purple-200 text-xs">
            dchxn — <strong>siklogeksan halqali</strong> ligand, 2 ta stereomarkazga ega.
            Qattiq struktura tufayli CD signallari <strong>R-pn dan 25% kuchliroq</strong> (Δε ≈ ±3.5 vs ±2.8).
            Chair konformatsiya eng barqaror — boat ga qaraganda CD intensivligi <strong>40% yuqori</strong>.
          </p>
        </div>

        {/* DIASTEREOMER TANLASH */}
        <div>
          <label className="text-xs text-yellow-400 font-bold mb-2 block">Diastereomer:</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(diastereomers).map(([key, val]) => (
              <button key={key} onClick={() => setDiastereomer(key)}
                className={`px-2 py-2 rounded-lg text-[10px] font-bold transition-all ${
                  diastereomer === key 
                    ? "bg-teal-600/80 text-white shadow-lg" 
                    : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
                }`}>
                <div className="text-xs">{val.name}</div>
                <div className="text-[9px] opacity-70 mt-1">{val.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* HALQA KONFORMATSIYASI */}
        <div>
          <label className="text-xs text-yellow-400 font-bold mb-2 block">Siklogeksan konformatsiyasi:</label>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setRingConf("chair")}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                ringConf === "chair" 
                  ? "bg-teal-600/80 text-white shadow-lg" 
                  : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
              }`}>
              🪑 Chair (stul) — eng barqaror
            </button>
            <button onClick={() => setRingConf("boat")}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                ringConf === "boat" 
                  ? "bg-teal-600/80 text-white shadow-lg" 
                  : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
              }`}>
              🚣 Boat (qayiq) — kam barqaror
            </button>
          </div>
        </div>

        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">ee (%):</span>
            <span className="text-emerald-400 font-mono">{ee}%</span>
          </label>
          <input type="range" min="0" max="100" step="5" value={ee}
            onChange={(e) => setEe(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-teal-500" />
        </div>

        {/* SPEKTR */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-teal-400 font-bold text-xs mb-2">
            CD spektri: {d.name} ({ringConf === "chair" ? "chair" : "boat"})
          </h5>
          <svg viewBox="0 0 400 280" className="w-full h-64">
            <line x1="40" y1="140" x2="380" y2="140" stroke="#4c1d95" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="40" y1="20" x2="40" y2="260" stroke="#4c1d95" strokeWidth="1" />
            
            <text x="210" y="275" fill="#c4b5fd" fontSize="9" textAnchor="middle">λ (nm)</text>
            <text x="40" y="270" fill="#a78bfa" fontSize="8">200</text>
            <text x="380" y="270" fill="#a78bfa" fontSize="8" textAnchor="end">800</text>
            <text x="20" y="140" fill="#a78bfa" fontSize="8" textAnchor="middle" transform="rotate(-90, 20, 140)">
              Δε
            </text>

            {/* λ_max belgilari */}
            <line x1={40 + ((d.lambda_max - 200) / 600) * 340} y1="20" x2={40 + ((d.lambda_max - 200) / 600) * 340} y2="260"
              stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x={40 + ((d.lambda_max - 200) / 600) * 340} y="15" fill="#fbbf24" fontSize="7" textAnchor="middle">
              {d.lambda_max} nm (d-d)
            </text>

            <line x1={40 + ((d.ligand_band - 200) / 600) * 340} y1="20" x2={40 + ((d.ligand_band - 200) / 600) * 340} y2="260"
              stroke="#a78bfa" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x={40 + ((d.ligand_band - 200) / 600) * 340} y="15" fill="#a78bfa" fontSize="7" textAnchor="middle">
              {d.ligand_band} nm (ligand)
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
              fill="none" stroke="#14b8a6" strokeWidth="2"
            />

            <text x="280" y="30" fill="#fbbf24" fontSize="8">— Absorbsiya</text>
            <text x="280" y="45" fill="#14b8a6" fontSize="8">— CD (Δε)</text>
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          <div className="bg-teal-900/30 border border-teal-500/50 rounded-lg p-3">
            <p className="text-teal-400">Diastereomer</p>
            <p className="text-teal-400 font-bold text-[10px]">{d.name}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">d-d Cotton</p>
            <p className={`font-bold ${d.sign > 0 ? "text-emerald-400" : "text-red-400"}`}>
              {d.sign > 0 ? "+" : "−"}{Math.abs(d.delta_epsilon_max * confFactor).toFixed(1)}
            </p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Halqa</p>
            <p className="text-teal-400 font-bold">{ringConf === "chair" ? "Chair ✓" : "Boat ✗"}</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun kuchliroq CD?</p>
          <p className="text-purple-200">
            <strong>Siklogeksan halqasi</strong> — qattiq struktura, erkin aylanish cheklangan.
            Bu xiral markazning <strong>konformatsion barqarorligini</strong> oshiradi →
            CD signali <strong>kuchliroq va aniqroq</strong>.
            <br/>
            Chair konformatsiyada barcha vodorodlar <strong>ekvatorial</strong> holatda → sterik to'qnashuv minimal.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. DCHXN LIGAND STRUKTURASI
// ============================================================================
function DchxnLigand() {
  const [showChair, setShowChair] = useState(true)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔗 (1R,2R)-diaminosiklogeksan — halqali xiral ligand</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-teal-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-teal-400 font-bold mb-3">
              {showChair ? "Chair konformatsiya (stul)" : "Boat konformatsiya (qayiq)"}
            </h4>
            <svg viewBox="0 0 200 180" className="w-full h-44">
              {showChair ? (
                <>
                  {/* Chair konformatsiya */}
                  <polygon 
                    points="50,60 80,40 120,40 150,60 150,100 120,120 80,120 50,100" 
                    fill="none" 
                    stroke="#14b8a6" 
                    strokeWidth="2"
                  />
                  
                  {/* Uglerodlar */}
                  <circle cx="50" cy="60" r="8" fill="#6b7280" />
                  <text x="50" y="63" fill="white" fontSize="7" textAnchor="middle">C</text>
                  
                  <circle cx="80" cy="40" r="8" fill="#6b7280" />
                  <text x="80" y="43" fill="white" fontSize="7" textAnchor="middle">C</text>
                  
                  <circle cx="120" cy="40" r="8" fill="#6b7280" />
                  <text x="120" y="43" fill="white" fontSize="7" textAnchor="middle">C</text>
                  
                  <circle cx="150" cy="60" r="8" fill="#6b7280" />
                  <text x="150" y="63" fill="white" fontSize="7" textAnchor="middle">C</text>
                  
                  <circle cx="150" cy="100" r="8" fill="#6b7280" />
                  <text x="150" y="103" fill="white" fontSize="7" textAnchor="middle">C</text>
                  
                  <circle cx="120" cy="120" r="8" fill="#6b7280" />
                  <text x="120" y="123" fill="white" fontSize="7" textAnchor="middle">C</text>

                  {/* N atomlari (stereomarkazlar) */}
                  <line x1="80" y1="40" x2="80" y2="10" stroke="#3b82f6" strokeWidth="2" />
                  <circle cx="80" cy="10" r="8" fill="#3b82f6" />
                  <text x="80" y="13" fill="white" fontSize="7" textAnchor="middle">N</text>
                  
                  <line x1="120" y1="40" x2="120" y2="10" stroke="#3b82f6" strokeWidth="2" />
                  <circle cx="120" cy="10" r="8" fill="#3b82f6" />
                  <text x="120" y="13" fill="white" fontSize="7" textAnchor="middle">N</text>

                  {/* Stereomarkazlar */}
                  <circle cx="80" cy="40" r="12" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="2,2" />
                  <circle cx="120" cy="40" r="12" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="2,2" />
                  <text x="100" y="155" fill="#fbbf24" fontSize="8" textAnchor="middle">2 ta stereomarkaz</text>

                  {/* Ekvatorial H lar */}
                  <line x1="50" y1="60" x2="30" y2="60" stroke="#10b981" strokeWidth="1" />
                  <line x1="150" y1="60" x2="170" y2="60" stroke="#10b981" strokeWidth="1" />
                  <text x="100" y="175" fill="#10b981" fontSize="7" textAnchor="middle">Ekvatorial H lar</text>
                </>
              ) : (
                <>
                  {/* Boat konformatsiya */}
                  <polygon 
                    points="50,80 80,50 120,50 150,80 130,110 70,110" 
                    fill="none" 
                    stroke="#f59e0b" 
                    strokeWidth="2"
                  />
                  
                  {/* Uglerodlar */}
                  <circle cx="50" cy="80" r="8" fill="#6b7280" />
                  <text x="50" y="83" fill="white" fontSize="7" textAnchor="middle">C</text>
                  
                  <circle cx="80" cy="50" r="8" fill="#6b7280" />
                  <text x="80" y="53" fill="white" fontSize="7" textAnchor="middle">C</text>
                  
                  <circle cx="120" cy="50" r="8" fill="#6b7280" />
                  <text x="120" y="53" fill="white" fontSize="7" textAnchor="middle">C</text>
                  
                  <circle cx="150" cy="80" r="8" fill="#6b7280" />
                  <text x="150" y="83" fill="white" fontSize="7" textAnchor="middle">C</text>
                  
                  <circle cx="130" cy="110" r="8" fill="#6b7280" />
                  <text x="130" y="113" fill="white" fontSize="7" textAnchor="middle">C</text>
                  
                  <circle cx="70" cy="110" r="8" fill="#6b7280" />
                  <text x="70" y="113" fill="white" fontSize="7" textAnchor="middle">C</text>

                  {/* N atomlari */}
                  <line x1="80" y1="50" x2="80" y2="20" stroke="#3b82f6" strokeWidth="2" />
                  <circle cx="80" cy="20" r="8" fill="#3b82f6" />
                  <text x="80" y="23" fill="white" fontSize="7" textAnchor="middle">N</text>
                  
                  <line x1="120" y1="50" x2="120" y2="20" stroke="#3b82f6" strokeWidth="2" />
                  <circle cx="120" cy="20" r="8" fill="#3b82f6" />
                  <text x="120" y="23" fill="white" fontSize="7" textAnchor="middle">N</text>

                  {/* Flagpole H lar */}
                  <line x1="70" y1="110" x2="70" y2="140" stroke="#ef4444" strokeWidth="1" />
                  <line x1="130" y1="110" x2="130" y2="140" stroke="#ef4444" strokeWidth="1" />
                  <text x="100" y="155" fill="#ef4444" fontSize="7" textAnchor="middle">Flagpole H lar (sterik)</text>

                  <text x="100" y="175" fill="#f59e0b" fontSize="8" textAnchor="middle">Kam barqaror</text>
                </>
              )}
            </svg>

            <button onClick={() => setShowChair(!showChair)}
              className="w-full mt-2 px-3 py-2 bg-teal-600/30 hover:bg-teal-600/50 rounded text-xs text-teal-400 transition-all">
              {showChair ? "🚣 Boat ko'rish" : "🪑 Chair ko'rish"}
            </button>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-teal-400 font-bold mb-3">Xususiyatlari:</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Zaryad:</span>
                <span className="text-teal-400 font-bold">0 (neytral)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Donor atomlar:</span>
                <span className="text-blue-400 font-bold">2 × N (N,N-xelat)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Xelat halqasi:</span>
                <span className="text-emerald-400">5 a'zoli</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Siklogeksan halqasi:</span>
                <span className="text-teal-400 font-bold">6 a'zoli</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Stereomarkazlar:</span>
                <span className="text-teal-400 font-bold">2 ta (C1, C2)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Konfiguratsiya:</span>
                <span className="text-teal-400 font-bold">(1R,2R)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Eng barqaror:</span>
                <span className="text-emerald-400">Chair konformatsiya</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Chair vs Boat:</p>
          <p className="text-purple-200">
            <strong>Chair</strong> — barcha vodorodlar ekvatorial → sterik to'qnashuv yo'q → <strong>eng barqaror</strong>.
            <br/>
            <strong>Boat</strong> — flagpole vodorodlar → sterik to'qnashuv → <strong>25 kJ/mol beqarorroq</strong>.
            <br/>
            Shuning uchun [Co(dchxn)₃]³⁺ da siklogeksan halqalari <strong>faqat chair</strong> konformatsiyada.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. 2 TA STEREOMARKAZ — (1R,2R) va (1S,2S)
// ============================================================================
function Stereomarkazlar() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔷 2 ta stereomarkaz — (1R,2R) vs (1S,2S)</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-teal-700/30 space-y-4">
        <div className="bg-teal-600/10 border border-teal-500/30 rounded-lg p-4">
          <p className="text-teal-400 font-bold mb-2">💎 Ikki stereomarkaz — murakkabroq stereochemistry:</p>
          <p className="text-purple-200 text-xs">
            dchxn da <strong>2 ta stereomarkaz</strong> bor (C1 va C2).
            <strong> (1R,2R)</strong> va <strong>(1S,2S)</strong> — enantiomerlar (trans-izomerlar).
            <strong> (1R,2S)</strong> va <strong>(1S,2R)</strong> — bir xil (cis-izomer, mezo).
            Koordinatsion kimyoda faqat <strong>trans-izomer</strong> (1R,2R yoki 1S,2S) ishlatiladi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-teal-900/20 border border-teal-500/30 rounded-xl p-5">
            <h4 className="text-teal-400 font-bold mb-3">(1R,2R)-dchxn (trans)</h4>
            <ul className="text-purple-200 text-xs space-y-2">
              <li>✓ <strong>2 ta stereomarkaz</strong> — R,R</li>
              <li>✓ <strong>Trans-izomer</strong> — NH₂ guruhlar qarama-qarshi</li>
              <li>✓ <strong>Xiral</strong> — enantiomeri (1S,2S)</li>
              <li>✓ <strong>Chair konformatsiya</strong> barqaror</li>
              <li>✓ <strong>Koordinatsion kimyoda</strong> keng qo'llaniladi</li>
            </ul>
          </div>

          <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-5">
            <h4 className="text-purple-400 font-bold mb-3">(1R,2S)-dchxn (cis, mezo)</h4>
            <ul className="text-purple-200 text-xs space-y-2">
              <li>✓ <strong>2 ta stereomarkaz</strong> — R,S</li>
              <li>✓ <strong>Cis-izomer</strong> — NH₂ guruhlar bir tomonda</li>
              <li>✓ <strong>Axiral</strong> — mezo birikma (ichki simmetriya)</li>
              <li>✓ <strong>CD spektri yo'q</strong> — optik faol emas</li>
              <li>✓ Koordinatsion kimyoda kam qo'llaniladi</li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun trans-izomer?</p>
          <p className="text-purple-200">
            <strong>Trans-izomer</strong> (1R,2R) da ikkala NH₂ guruhi <strong>ekvatorial</strong> holatda →
            chair konformatsiyada <strong>sterik to'qnashuv minimal</strong>.
            <br/>
            <strong>Cis-izomer</strong> (1R,2S) da bitta NH₂ <strong>aksial</strong>, bitta <strong>ekvatorial</strong> →
            sterik to'qnashuv → kam barqaror.
            <br/>
            Shuning uchun [Co(dchxn)₃]³⁺ da faqat <strong>trans-(1R,2R)</strong> yoki <strong>trans-(1S,2S)</strong> ishlatiladi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. LIGAND SOLISHTIRISH - en vs R-pn vs dchxn
// ============================================================================
function LigandSolishtirish() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 en vs R-pn vs dchxn — ligand solishtirilishi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-teal-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-2 text-yellow-400">Xususiyat</th>
                <th className="text-center py-3 px-2 text-blue-400">en</th>
                <th className="text-center py-3 px-2 text-violet-400">R-pn</th>
                <th className="text-center py-3 px-2 text-teal-400">dchxn</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["Struktura", "CH₂-CH₂", "CH₂-CH(CH₃)", "Siklogeksan"],
                ["Halqa", "Yo'q", "Yo'q", "6 a'zoli"],
                ["Stereomarkazlar", "0", "1", "2"],
                ["Xirallik", "Axiral", "Xiral", "Xiral"],
                ["Konformatsiya", "Erkin", "Cheklangan", "Qattiq (chair)"],
                ["Δε (d-d)", "±2.0", "±2.8", "±3.5"],
                ["Δε (ligand)", "Yo'q", "±1.5", "±2.0"],
                ["CD kuchi", "Eng kuchsiz", "O'rtacha", "Eng kuchli"],
                ["Diastereomerlar", "2", "4", "4"],
                ["Stereoselektivlik", "Yo'q", "Ha", "Juda yuqori"],
                ["Narx", "Arzon", "Qimmat", "Juda qimmat"],
              ].map((r, i) => (
                <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-2 px-2 font-bold text-purple-300">{r[0]}</td>
                  <td className="py-2 px-2 text-center text-blue-400">{r[1]}</td>
                  <td className="py-2 px-2 text-center text-violet-400">{r[2]}</td>
                  <td className="py-2 px-2 text-center text-teal-400">{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 bg-teal-600/10 border border-teal-500/30 rounded-lg p-3 text-xs">
          <p className="text-teal-400 font-bold mb-1">💡 Asosiy tendentsiya:</p>
          <p className="text-purple-200">
            <strong>en → R-pn → dchxn</strong> o'tishda:
            <br/>
            • <strong>Stereomarkazlar soni</strong> oshadi (0 → 1 → 2)
            <br/>
            • <strong>Konformatsion qattiqlik</strong> oshadi (erkin → cheklangan → qattiq)
            <br/>
            • <strong>CD signali kuchi</strong> oshadi (±2.0 → ±2.8 → ±3.5)
            <br/>
            • <strong>Stereoselektivlik</strong> oshadi
            <br/>
            • <strong>Narx</strong> oshadi
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. STEREOSELECTIVE SYNTHESIS
// ============================================================================
function StereoselectiveSynthesis() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🧪 Stereoselektiv sintez — yuqori darajada</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-teal-700/30 space-y-4">
        <div className="bg-teal-600/10 border border-teal-500/30 rounded-lg p-4">
          <p className="text-teal-400 font-bold mb-2">💎 Eng yuqori stereoselektivlik:</p>
          <p className="text-purple-200 text-xs">
            (1R,2R)-dchxn bilan sintez qilganda, <strong>Λ-(δ,δ,δ)</strong> diastereomer
            <strong> 90%+</strong> miqdorda hosil bo'ladi (R-pn da 70% edi).
            Sababi: siklogeksan halqasi <strong>qattiq struktura</strong> → konformatsion erkinlik kam →
            faqat bir diastereomer afzal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-teal-400 font-bold mb-3">Sintez jarayoni:</h4>
            <div className="space-y-2 text-xs">
              <div className="bg-purple-900/50 rounded p-2">
                <p className="text-purple-300">1. Co²⁺ + (1R,2R)-dchxn → aralashma</p>
              </div>
              <div className="bg-purple-900/50 rounded p-2">
                <p className="text-purple-300">2. Oksidlanish (H₂O₂) → Co³⁺</p>
              </div>
              <div className="bg-teal-900/30 border border-teal-500/30 rounded p-2">
                <p className="text-teal-400 font-bold">3. Λ-(δ,δ,δ) afzal → 90%+</p>
              </div>
              <div className="bg-purple-900/50 rounded p-2">
                <p className="text-purple-300">4. Boshqa diastereomerlar → &lt;10%</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-teal-400 font-bold mb-3">Nima uchun 90%?</h4>
            <ul className="text-purple-200 text-xs space-y-2">
              <li>✓ <strong>Qattiq halqa</strong> — konformatsion erkinlik kam</li>
              <li>✓ <strong>2 ta stereomarkaz</strong> — kuchli chiral induction</li>
              <li>✓ <strong>Chair konformatsiya</strong> — faqat bitta yo'l</li>
              <li>✓ <strong>Sterik to'siq</strong> — boshqa diastereomerlar beqaror</li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Afzalligi:</p>
          <p className="text-purple-200">
            Yuqori stereoselektivlik → <strong>ajratish oson</strong> (fraksion kristallizatsiya yetarli).
            <br/>
            CD spektri <strong>juda kuchli</strong> (Δε ≈ ±3.5) → absolyut konfiguratsiya <strong>aniq</strong> aniqlanadi.
            <br/>
            Bu [Co(dchxn)₃]³⁺ ni <strong>CD spektroskopiyasining eng yaxshi standarti</strong>ga aylantiradi.
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

      <div className="bg-purple-800/30 rounded-xl p-5 border border-teal-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">📊</div>
            <h4 className="text-teal-400 font-bold mb-2">CD standarti</h4>
            <p className="text-purple-200 text-xs">
              [Co(dchxn)₃]³⁺ — <strong>eng kuchli CD signali</strong>ga ega kompleks.
              CD spektrometrlarni <strong>kalibrlash</strong> uchun standart sifatida ishlatiladi.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">⚗️</div>
            <h4 className="text-teal-400 font-bold mb-2">Asymmetrik kataliz</h4>
            <p className="text-purple-200 text-xs">
              Yuqori stereoselektivlik → <strong>asymmetrik sintezda</strong> katalizator.
              Enantioselektivlik <strong>90% ee</strong> gacha.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">💊</div>
            <h4 className="text-teal-400 font-bold mb-2">Farmatsevtika</h4>
            <p className="text-purple-200 text-xs">
              Xiral metall komplekslar <strong>dori vositalari</strong> sifatida.
              dchxn ligand <strong>tabiiy mahsulotlarda</strong> ham uchraydi.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🔬</div>
            <h4 className="text-teal-400 font-bold mb-2">Steklo kimyosi</h4>
            <p className="text-purple-200 text-xs">
              dchxn <strong>organik sintezda</strong> xiral building block sifatida.
              Boshqa xiral ligandlar olish uchun <strong>boshlang'ich modda</strong>.
            </p>
          </div>
        </div>

        <div className="bg-teal-600/10 border border-teal-500/30 rounded-lg p-4">
          <p className="text-teal-400 font-bold mb-2">🌟 Qiziqarli fakt:</p>
          <p className="text-purple-200 text-xs">
            [Co(dchxn)₃]³⁺ ning CD spektri shunchalik kuchliki, <strong>oddiz ko'z</strong> bilan ham
            farqlash mumkin — eritma <strong>qizil-norinjgi rangda</strong> ko'rinadi, chunki CD signali
            absorbsiya spektrini <strong>sezilarli o'zgartiradi</strong>.
            Bu hodisa <strong>"circular dichroism color"</strong> deb ataladi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function CoDchxn3CD() {
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
          <span className="text-teal-400">[Co(dchxn)₃]³⁺</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-teal-400">🔄 [Co(dchxn)₃]³⁺ — CD tahlili</h1>
          <p className="text-purple-400 text-sm">
            Co³⁺ (d⁶ LS) • Halqali xiral ligand • 2 stereomarkaz • Eng kuchli CD
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-teal-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-4xl md:text-5xl font-extrabold font-mono text-teal-400">[Co(dchxn)₃]³⁺</span>
            <div>
              <h2 className="text-xl font-bold text-white">CD tahlili — to'liq profil</h2>
              <p className="text-purple-400">"Tris((1R,2R)-diaminosiklogeksan)kobalt(III)" — eng kuchli CD</p>
            </div>
          </div>

          <div className="bg-teal-600/10 border border-teal-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              [Co(dchxn)₃]³⁺ — <strong className="text-teal-400">eng kuchli CD signallaridan biri</strong>.
              dchxn ligand <strong>siklogeksan halqali</strong>, 2 ta stereomarkazga ega (1R,2R).
              Qattiq struktura tufayli CD signali <strong>R-pn dan 25% kuchliroq</strong> (Δε ≈ ±3.5).
              <strong> Chair konformatsiya</strong> eng barqaror. Stereoselektiv sintez orqali
              Λ-(δ,δ,δ) diastereomer <strong>90%+</strong> miqdorda olinadi.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-teal-400 font-bold text-lg">Co³⁺ (LS)</p>
              <p className="text-purple-300">d⁶, t₂g⁶</p>
              <p className="text-purple-400 mt-1">S = 0</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-teal-400 font-bold text-lg">2 stereomarkaz</p>
              <p className="text-purple-300">(1R,2R)</p>
              <p className="text-purple-400 mt-1">trans-izomer</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-teal-400 font-bold text-lg">λ<sub>max</sub> = 470</p>
              <p className="text-purple-300">nm</p>
              <p className="text-purple-400 mt-1">d-d o'tish</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-teal-400 font-bold text-lg">Δε ≈ ±3.5</p>
              <p className="text-purple-300">M⁻¹cm⁻¹</p>
              <p className="text-purple-400 mt-1">eng kuchli</p>
            </div>
          </div>
        </div>

        {/* CD SPEKTR SIMULYATORI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <CDSpectrumSimulator />
        </div>

        {/* DCHXN LIGAND */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <DchxnLigand />
        </div>

        {/* STEREOMARKAZLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <Stereomarkazlar />
        </div>

        {/* LIGAND SOLISHTIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <LigandSolishtirish />
        </div>

        {/* STEREOSELECTIVE SYNTHESIS */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <StereoselectiveSynthesis />
        </div>

        {/* AMALIY QO'LLANILISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <AmaliyQollanilish />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-teal-600/10 to-purple-600/10 border border-teal-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>[Co(dchxn)₃]³⁺ — <strong className="text-teal-400">eng kuchli CD signali</strong>ga ega kompleks</li>
            <li>dchxn — <strong>siklogeksan halqali</strong> ligand, 2 ta stereomarkaz (1R,2R)</li>
            <li><strong>Chair konformatsiya</strong> eng barqaror (boat dan 25 kJ/mol barqarorroq)</li>
            <li>Δε ≈ <strong>±3.5</strong> — R-pn (±2.8) dan 25% kuchli</li>
            <li>Λ-(δ,δ,δ) — <strong>eng barqaror diastereomer</strong> (1R,2R bilan)</li>
            <li><strong>Stereoselektiv sintez</strong> — Λ-(δ,δ,δ) 90%+ miqdorda</li>
            <li>Qattiq struktura → <strong>yuqori stereoselektivlik</strong></li>
            <li>CD spektroskopiyasida <strong>eng yaxshi standart</strong></li>
            <li>Asymmetrik kataliz va farmatsevtika uchun muhim</li>
            <li>Ligandlar: en → R-pn → dchxn → CD kuchi oshadi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/cd/birikmalar/co-s-pn3" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← [Co(S-pn)₃]³⁺
          </Link>
          <Link href="/ilmiy/tahlil/cd/birikmalar/gemoglobin" className="px-6 py-3 bg-teal-600/80 rounded-xl hover:bg-teal-500 text-white font-semibold">
            Gemoglobin →
          </Link>
        </div>

      </section>
    </main>
  )
}