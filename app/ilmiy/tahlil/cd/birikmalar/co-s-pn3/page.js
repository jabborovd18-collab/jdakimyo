"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. CD SPEKTR SIMULYATORI ([Co(S-pn)₃]³⁺ uchun)
// ============================================================================
function CDSpectrumSimulator() {
  const [diastereomer, setDiastereomer] = useState("lambda-delta")
  const [ee, setEe] = useState(100)

  // S-pn ligand uchun diastereomerlar (R-pn dan teskari!)
  const diastereomers = {
    "lambda-delta": {
      name: "Λ-(δ,δ,δ)",
      desc: "Metall Λ, xelatlar δ — eng barqaror (S-pn bilan)",
      lambda_max: 470,
      delta_epsilon_max: -2.8,
      ligand_band: 230,
      ligand_de: -1.5,
      sign: -1
    },
    "lambda-lambda": {
      name: "Λ-(λ,λ,λ)",
      desc: "Metall Λ, xelatlar λ — kam barqaror",
      lambda_max: 470,
      delta_epsilon_max: -2.2,
      ligand_band: 230,
      ligand_de: 1.2,
      sign: -1
    },
    "delta-delta": {
      name: "Δ-(δ,δ,δ)",
      desc: "Metall Δ, xelatlar δ — kam barqaror",
      lambda_max: 470,
      delta_epsilon_max: 2.2,
      ligand_band: 230,
      ligand_de: 1.2,
      sign: 1
    },
    "delta-lambda": {
      name: "Δ-(λ,λ,λ)",
      desc: "Metall Δ, xelatlar λ — eng barqaror (R-pn bilan)",
      lambda_max: 470,
      delta_epsilon_max: 2.8,
      ligand_band: 230,
      ligand_de: -1.5,
      sign: 1
    }
  }

  const d = diastereomers[diastereomer]
  const eeFactor = ee / 100

  // CD spektri simulyatsiyasi
  const spectrum = useMemo(() => {
    const points = []
    for (let i = 0; i < 400; i++) {
      const lambda = 200 + i * 1.5
      let cotton = 0
      let absorption = 0

      // d-d o'tish
      const x1 = (lambda - d.lambda_max) / 35
      const cotton_dd = d.sign * x1 * Math.exp(-0.5 * x1 * x1) * d.delta_epsilon_max * eeFactor
      const abs_dd = Math.exp(-0.5 * x1 * x1) * 80 * eeFactor
      
      // Ligand xiral band
      const x2 = (lambda - d.ligand_band) / 20
      const cotton_lig = x2 * Math.exp(-0.5 * x2 * x2) * d.ligand_de * eeFactor
      const abs_lig = Math.exp(-0.5 * x2 * x2) * 5000 * eeFactor

      cotton = cotton_dd + cotton_lig
      absorption = abs_dd + abs_lig

      points.push({ lambda, cotton, absorption })
    }
    return points
  }, [diastereomer, ee, d, eeFactor])

  const maxCotton = Math.max(...spectrum.map(p => Math.abs(p.cotton)), 0.1)
  const maxAbs = Math.max(...spectrum.map(p => p.absorption), 0.1)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📊 CD spektr simulyatori — [Co(S-pn)₃]³⁺</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-fuchsia-700/30 space-y-4">
        <div className="bg-fuchsia-600/10 border border-fuchsia-500/30 rounded-lg p-4">
          <p className="text-fuchsia-400 font-bold mb-2">💎 R-pn ning enantiomeri — teskari CD:</p>
          <p className="text-purple-200 text-xs">
            [Co(S-pn)₃]³⁺ — [Co(R-pn)₃]³⁺ ning <strong>enantiomeri</strong>. S-pn ligand
            <strong> R-pn ning ko'zgudagi aksi</strong>. Natijada CD spektri ham <strong>teskari belgiga</strong> ega.
            Eng barqaror diastereomer: <strong>Λ-(δ,δ,δ)</strong> (R-pn da Δ-(λ,λ,λ) edi).
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
                    ? "bg-fuchsia-600/80 text-white shadow-lg" 
                    : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
                }`}>
                <div className="text-xs">{val.name}</div>
                <div className="text-[9px] opacity-70 mt-1">{val.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">ee (%):</span>
            <span className="text-emerald-400 font-mono">{ee}%</span>
          </label>
          <input type="range" min="0" max="100" step="5" value={ee}
            onChange={(e) => setEe(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-fuchsia-500" />
        </div>

        {/* SPEKTR */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-fuchsia-400 font-bold text-xs mb-2">
            CD spektri: {d.name}
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
              fill="none" stroke="#d946ef" strokeWidth="2"
            />

            <text x="280" y="30" fill="#fbbf24" fontSize="8">— Absorbsiya</text>
            <text x="280" y="45" fill="#d946ef" fontSize="8">— CD (Δε)</text>
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          <div className="bg-fuchsia-900/30 border border-fuchsia-500/50 rounded-lg p-3">
            <p className="text-fuchsia-400">Diastereomer</p>
            <p className="text-fuchsia-400 font-bold text-[10px]">{d.name}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">d-d Cotton</p>
            <p className={`font-bold ${d.sign > 0 ? "text-emerald-400" : "text-red-400"}`}>
              {d.sign > 0 ? "+" : "−"}{Math.abs(d.delta_epsilon_max)}
            </p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Ligand CD</p>
            <p className={`font-bold ${d.ligand_de > 0 ? "text-emerald-400" : "text-red-400"}`}>
              {d.ligand_de > 0 ? "+" : "−"}{Math.abs(d.ligand_de)}
            </p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 R-pn vs S-pn farqi:</p>
          <p className="text-purple-200">
            <strong>R-pn</strong> bilan → Δ-(λ,λ,λ) eng barqaror, CD = +2.8
            <br/>
            <strong>S-pn</strong> bilan → Λ-(δ,δ,δ) eng barqaror, CD = −2.8 (teskari!)
            <br/>
            Ikkala kompleksning CD spektri <strong>ko'zgudagi aksi</strong> — bu enantiomerlar xossasi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. S-PN LIGAND STRUKTURASI
// ============================================================================
function SPnLigand() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔗 S-propilendiamin (S-pn) — R-pn ning enantiomeri</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-fuchsia-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-fuchsia-400 font-bold mb-3">S-pn strukturasi:</h4>
            <svg viewBox="0 0 200 180" className="w-full h-44">
              {/* Uglerod zanjiri */}
              <line x1="40" y1="90" x2="80" y2="90" stroke="#a78bfa" strokeWidth="2" />
              <line x1="80" y1="90" x2="120" y2="90" stroke="#a78bfa" strokeWidth="2" />
              <line x1="120" y1="90" x2="160" y2="90" stroke="#a78bfa" strokeWidth="2" />

              {/* Uglerodlar */}
              <circle cx="40" cy="90" r="10" fill="#6b7280" />
              <text x="40" y="93" fill="white" fontSize="8" textAnchor="middle">C</text>

              <circle cx="80" cy="90" r="10" fill="#6b7280" />
              <text x="80" y="93" fill="white" fontSize="8" textAnchor="middle">C</text>

              <circle cx="120" cy="90" r="10" fill="#6b7280" />
              <text x="120" y="93" fill="white" fontSize="8" textAnchor="middle">C</text>

              <circle cx="160" cy="90" r="10" fill="#6b7280" />
              <text x="160" y="93" fill="white" fontSize="8" textAnchor="middle">C</text>

              {/* N atomlari */}
              <line x1="40" y1="90" x2="40" y2="50" stroke="#3b82f6" strokeWidth="2" />
              <circle cx="40" cy="50" r="10" fill="#3b82f6" />
              <text x="40" y="53" fill="white" fontSize="8" textAnchor="middle">N</text>

              <line x1="160" y1="90" x2="160" y2="50" stroke="#3b82f6" strokeWidth="2" />
              <circle cx="160" cy="50" r="10" fill="#3b82f6" />
              <text x="160" y="53" fill="white" fontSize="8" textAnchor="middle">N</text>

              {/* CH₃ guruh (stereomarkaz) */}
              <line x1="80" y1="90" x2="80" y2="130" stroke="#10b981" strokeWidth="2" />
              <text x="80" y="145" fill="#10b981" fontSize="8" textAnchor="middle">CH₃</text>

              {/* Stereomarkaz belgisi */}
              <circle cx="80" cy="90" r="14" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="2,2" />
              <text x="80" y="115" fill="#fbbf24" fontSize="7" textAnchor="middle">*stereomarkaz</text>

              {/* S konfiguratsiya ko'rsatkichi */}
              <path d="M 40 50 Q 80 30 160 50" fill="none" stroke="#d946ef" strokeWidth="1.5" strokeDasharray="3,2" />
              <text x="100" y="25" fill="#d946ef" fontSize="8" textAnchor="middle">S-konfiguratsiya</text>

              <text x="100" y="170" fill="#a78bfa" fontSize="9" textAnchor="middle">
                (S)-1,2-propilendiamin
              </text>
            </svg>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-fuchsia-400 font-bold mb-3">Xususiyatlari:</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Zaryad:</span>
                <span className="text-fuchsia-400 font-bold">0 (neytral)</span>
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
                <span className="text-purple-300">Stereomarkaz:</span>
                <span className="text-fuchsia-400 font-bold">1 ta (C2)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Konfiguratsiya:</span>
                <span className="text-fuchsia-400 font-bold">S</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">R-pn bilan:</span>
                <span className="text-fuchsia-400">Enantiomer</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 R-pn va S-pn farqi:</p>
          <p className="text-purple-200">
            <strong>R-pn</strong> va <strong>S-pn</strong> — <strong>enantiomerlar</strong>.
            Ularning fizik xossalari (erish harorati, eruvchanlik) <strong>bir xil</strong>, lekin:
            <br/>
            • <strong>Optik aylanish</strong> — teskari belgi ([α]<sub>D</sub> = +11° vs −11°)
            <br/>
            • <strong>CD spektri</strong> — teskari belgi
            <br/>
            • <strong>Biologik faollik</strong> — farqli (fermentlar bilan o'zaro ta'sir)
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. R vs S SOLISHTIRISH
// ============================================================================
function RvsSComparison() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 R-pn vs S-pn — to'liq solishtirish</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-fuchsia-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-2 text-yellow-400">Xususiyat</th>
                <th className="text-center py-3 px-2 text-violet-400">[Co(R-pn)₃]³⁺</th>
                <th className="text-center py-3 px-2 text-fuchsia-400">[Co(S-pn)₃]³⁺</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["Ligand konfiguratsiyasi", "R", "S"],
                ["Optik aylanish [α]D", "+11°", "−11°"],
                ["Eng barqaror diastereomer", "Δ-(λ,λ,λ)", "Λ-(δ,δ,δ)"],
                ["d-d Cotton (eng barq.)", "+2.8", "−2.8"],
                ["Ligand CD (eng barq.)", "+1.5", "−1.5"],
                ["Stereoselektivlik", "Δ afzal (70%)", "Λ afzal (70%)"],
                ["Erish harorati", "Bir xil", "Bir xil"],
                ["Eruvchanlik", "Bir xil", "Bir xil"],
                ["CD spektri", "Musbat", "Manfiy (teskari)"],
                ["Biologik faollik", "Farqli", "Farqli"],
              ].map((r, i) => (
                <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-2 px-2 font-bold text-purple-300">{r[0]}</td>
                  <td className="py-2 px-2 text-center text-violet-400">{r[1]}</td>
                  <td className="py-2 px-2 text-center text-fuchsia-400">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 bg-fuchsia-600/10 border border-fuchsia-500/30 rounded-lg p-3 text-xs">
          <p className="text-fuchsia-400 font-bold mb-1">💡 Asosiy qoida:</p>
          <p className="text-purple-200">
            <strong>R-pn</strong> va <strong>S-pn</strong> komplekslarining CD spektrlari <strong>bir-birining ko'zgudagi aksi</strong>.
            <br/>
            R-pn bilan Δ-(λ,λ,λ) barqaror → CD musbat
            <br/>
            S-pn bilan Λ-(δ,δ,δ) barqaror → CD manfiy
            <br/>
            Bu <strong>enantiomerlar qoidasi</strong> — barcha xiral juftliklar uchun amal qiladi.
          </p>
        </div>

        <div className="mt-4 bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-fuchsia-400 font-bold text-xs mb-2">CD spektrlari vizual solishtirish:</h5>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-violet-900/20 border border-violet-500/30 rounded p-3 text-center">
              <svg viewBox="0 0 200 100" className="w-full h-24">
                <line x1="20" y1="50" x2="180" y2="50" stroke="#4c1d95" strokeWidth="1" strokeDasharray="2,2" />
                <polyline
                  points="20,50 60,50 80,40 100,20 120,40 140,50 180,50"
                  fill="none" stroke="#8b5cf6" strokeWidth="2" />
                <text x="100" y="15" fill="#8b5cf6" fontSize="9" textAnchor="middle" fontWeight="bold">
                  [Co(R-pn)₃]³⁺
                </text>
                <text x="100" y="95" fill="#8b5cf6" fontSize="8" textAnchor="middle">
                  Musbat CD (+2.8)
                </text>
              </svg>
            </div>
            <div className="bg-fuchsia-900/20 border border-fuchsia-500/30 rounded p-3 text-center">
              <svg viewBox="0 0 200 100" className="w-full h-24">
                <line x1="20" y1="50" x2="180" y2="50" stroke="#4c1d95" strokeWidth="1" strokeDasharray="2,2" />
                <polyline
                  points="20,50 60,50 80,60 100,80 120,60 140,50 180,50"
                  fill="none" stroke="#d946ef" strokeWidth="2" />
                <text x="100" y="15" fill="#d946ef" fontSize="9" textAnchor="middle" fontWeight="bold">
                  [Co(S-pn)₃]³⁺
                </text>
                <text x="100" y="95" fill="#d946ef" fontSize="8" textAnchor="middle">
                  Manfiy CD (−2.8)
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. DIASTEREOMERLAR
// ============================================================================
function Diastereomers() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔷 Diastereomerlar — S-pn uchun teskari qoida</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-fuchsia-700/30 space-y-4">
        <div className="bg-fuchsia-600/10 border border-fuchsia-500/30 rounded-lg p-4">
          <p className="text-fuchsia-400 font-bold mb-2">💎 S-pn bilan teskari qoida:</p>
          <p className="text-purple-200 text-xs">
            S-pn ligand <strong>δ konformatsiyani afzal ko'radi</strong> (R-pn λ ni afzal ko'rgani kabi).
            δ konformatsiya <strong>Λ metall markazi</strong> bilan mos keladi → Λ-(δ,δ,δ) eng barqaror.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-emerald-900/20 border-2 border-emerald-500/50 rounded-xl p-4">
            <h4 className="text-emerald-400 font-bold mb-2">Λ-(δ,δ,δ) ✓</h4>
            <p className="text-purple-200 text-xs mb-2">Eng barqaror (S-pn bilan)</p>
            <ul className="text-purple-300 text-[10px] space-y-1">
              <li>• Metall: Λ (M-helis)</li>
              <li>• Xelatlar: δ (S-pn afzal)</li>
              <li>• CD: Δε = −2.8 (kuchli)</li>
              <li>• Sterik to'siq: minimal</li>
            </ul>
          </div>

          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
            <h4 className="text-red-400 font-bold mb-2">Λ-(λ,λ,λ) ✗</h4>
            <p className="text-purple-200 text-xs mb-2">Kam barqaror</p>
            <ul className="text-purple-300 text-[10px] space-y-1">
              <li>• Metall: Λ (M-helis)</li>
              <li>• Xelatlar: λ (teskari)</li>
              <li>• CD: Δε = −2.2 (kuchsiz)</li>
              <li>• Sterik to'siq: mavjud</li>
            </ul>
          </div>

          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
            <h4 className="text-red-400 font-bold mb-2">Δ-(δ,δ,δ) ✗</h4>
            <p className="text-purple-200 text-xs mb-2">Kam barqaror</p>
            <ul className="text-purple-300 text-[10px] space-y-1">
              <li>• Metall: Δ (P-helis)</li>
              <li>• Xelatlar: δ (mos emas)</li>
              <li>• CD: Δε = +2.2 (kuchsiz)</li>
              <li>• Sterik to'siq: mavjud</li>
            </ul>
          </div>

          <div className="bg-emerald-900/20 border-2 border-emerald-500/50 rounded-xl p-4">
            <h4 className="text-emerald-400 font-bold mb-2">Δ-(λ,λ,λ) ✓</h4>
            <p className="text-purple-200 text-xs mb-2">Eng barqaror (R-pn bilan)</p>
            <ul className="text-purple-300 text-[10px] space-y-1">
              <li>• Metall: Δ (P-helis)</li>
              <li>• Xelatlar: λ (R-pn afzal)</li>
              <li>• CD: Δε = +2.8 (kuchli)</li>
              <li>• Sterik to'siq: minimal</li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Qoida:</p>
          <p className="text-purple-200">
            <strong>R-pn</strong> → λ konformatsiya → <strong>Δ</strong> metall bilan mos → Δ-(λ,λ,λ) barqaror
            <br/>
            <strong>S-pn</strong> → δ konformatsiya → <strong>Λ</strong> metall bilan mos → Λ-(δ,δ,δ) barqaror
            <br/>
            Bu <strong>"chiral matching"</strong> qoidasi — xiral ligand va metall markazi mos kelishi kerak.
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
      <h3 className="text-white font-semibold">🧪 Stereoselektiv sintez — S-pn bilan</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-fuchsia-700/30 space-y-4">
        <div className="bg-fuchsia-600/10 border border-fuchsia-500/30 rounded-lg p-4">
          <p className="text-fuchsia-400 font-bold mb-2">💎 Teskari stereoselektivlik:</p>
          <p className="text-purple-200 text-xs">
            S-pn ligand bilan sintez qilganda, <strong>Λ-(δ,δ,δ)</strong> diastereomer afzal hosil bo'ladi.
            Bu R-pn bilan olingan Δ-(λ,λ,λ) ning <strong>ko'zgudagi aksi</strong>.
            Natijada CD spektri <strong>teskari belgi</strong>ga ega bo'ladi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-fuchsia-400 font-bold mb-3">Sintez jarayoni:</h4>
            <div className="space-y-2 text-xs">
              <div className="bg-purple-900/50 rounded p-2">
                <p className="text-purple-300">1. Co²⁺ + S-pn → aralashma</p>
              </div>
              <div className="bg-purple-900/50 rounded p-2">
                <p className="text-purple-300">2. Oksidlanish (H₂O₂) → Co³⁺</p>
              </div>
              <div className="bg-fuchsia-900/30 border border-fuchsia-500/30 rounded p-2">
                <p className="text-fuchsia-400 font-bold">3. Λ-(δ,δ,δ) afzal → 70%</p>
              </div>
              <div className="bg-purple-900/50 rounded p-2">
                <p className="text-purple-300">4. Λ-(λ,λ,λ) → 30%</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-fuchsia-400 font-bold mb-3">R-pn vs S-pn sintezi:</h4>
            <div className="space-y-2 text-xs">
              <div className="bg-violet-900/20 border border-violet-500/30 rounded p-2">
                <p className="text-violet-400 font-bold">R-pn bilan:</p>
                <p className="text-purple-200">Δ-(λ,λ,λ) → CD = +2.8</p>
              </div>
              <div className="bg-fuchsia-900/20 border border-fuchsia-500/30 rounded p-2">
                <p className="text-fuchsia-400 font-bold">S-pn bilan:</p>
                <p className="text-purple-200">Λ-(δ,δ,δ) → CD = −2.8</p>
              </div>
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded p-2">
                <p className="text-yellow-400 font-bold">Natija:</p>
                <p className="text-purple-200">CD spektrlari teskari!</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun teskari?</p>
          <p className="text-purple-200">
            S-pn ligand <strong>S-stereomarkazga</strong> ega → u <strong>δ konformatsiyani</strong> afzal ko'radi.
            δ konformatsiya <strong>Λ metall</strong> bilan mos keladi → Λ-(δ,δ,δ) hosil bo'ladi.
            <br/>
            R-pn da λ konformatsiya Δ metall bilan mos → Δ-(λ,λ,λ).
            <br/>
            Bu <strong>enantiomerik ligandlar</strong>ning <strong>teskari stereokimyo</strong>ga olib kelishi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 6. PRAKTIK QO'LLANILISH
// ============================================================================
function AmaliyQollanilish() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🏭 Amaliy qo'llanilishi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-fuchsia-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🔬</div>
            <h4 className="text-fuchsia-400 font-bold mb-2">CD spektroskopiyasi standarti</h4>
            <p className="text-purple-200 text-xs">
              [Co(S-pn)₃]³⁺ va [Co(R-pn)₃]³⁺ — <strong>absolyut konfiguratsiya</strong> aniqlashda
              standart sifatida ishlatiladi. Ularning CD spektrlari <strong>aniq va takrorlanuvchan</strong>.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">⚗️</div>
            <h4 className="text-fuchsia-400 font-bold mb-2">Asymmetrik kataliz</h4>
            <p className="text-purple-200 text-xs">
              Xiral Co komplekslar <strong>asymmetrik sintezda</strong> katalizator sifatida ishlatiladi.
              R-pn va S-pn <strong>teskari enantioselektivlik</strong> beradi.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">💊</div>
            <h4 className="text-fuchsia-400 font-bold mb-2">Farmatsevtika</h4>
            <p className="text-purple-200 text-xs">
              Xiral metall komplekslar <strong>dori vositalari</strong> sifatida o'rganilmoqda.
              R va S enantiomerlar <strong>turli biologik faollikka</strong> ega.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">📚</div>
            <h4 className="text-fuchsia-400 font-bold mb-2">Ta'lim</h4>
            <p className="text-purple-200 text-xs">
              [Co(S-pn)₃]³⁺ — <strong>stereokimyo darsliklarida</strong> klassik misol.
              Enantiomerlar, diastereomerlar, stereoselektivlik tushunchalarini tushuntirish uchun.
            </p>
          </div>
        </div>

        <div className="bg-fuchsia-600/10 border border-fuchsia-500/30 rounded-lg p-4">
          <p className="text-fuchsia-400 font-bold mb-2">🌟 Qiziqarli fakt:</p>
          <p className="text-purple-200 text-xs">
            [Co(R-pn)₃]³⁺ va [Co(S-pn)₃]³⁺ ning <strong>aralashmasi</strong> (ratsemik) CD spektrida
            <strong> hech qanday signal ko'rinmaydi</strong> — chunki ularning CD spektrlari bir-birini
            <strong> to'liq yo'q qiladi</strong>. Bu enantiomerlarning <strong>optik xossasi</strong>ning
            yana bir tasdig'i.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function CoSPn3CD() {
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
          <span className="text-fuchsia-400">[Co(S-pn)₃]³⁺</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-fuchsia-400">🔄 [Co(S-pn)₃]³⁺ — CD tahlili</h1>
          <p className="text-purple-400 text-sm">
            Co³⁺ (d⁶ LS) • S-xiral ligand • Diastereomerlar • R-pn ning enantiomeri
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-fuchsia-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-4xl md:text-5xl font-extrabold font-mono text-fuchsia-400">[Co(S-pn)₃]³⁺</span>
            <div>
              <h2 className="text-xl font-bold text-white">CD tahlili — to'liq profil</h2>
              <p className="text-purple-400">"Tris((S)-propilendiamin)kobalt(III)" — R-pn ning enantiomeri</p>
            </div>
          </div>

          <div className="bg-fuchsia-600/10 border border-fuchsia-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              [Co(S-pn)₃]³⁺ — <strong className="text-fuchsia-400">[Co(R-pn)₃]³⁺ ning enantiomeri</strong>.
              S-pn ligand <strong>R-pn ning ko'zgudagi aksi</strong>. Natijada CD spektri ham <strong>teskari belgi</strong>ga ega.
              Eng barqaror diastereomer: <strong>Λ-(δ,δ,δ)</strong> (R-pn da Δ-(λ,λ,λ) edi).
              Stereoselektiv sintez orqali Λ-(δ,δ,δ) afzal olinadi (70%).
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-fuchsia-400 font-bold text-lg">Co³⁺ (LS)</p>
              <p className="text-purple-300">d⁶, t₂g⁶</p>
              <p className="text-purple-400 mt-1">S = 0</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-fuchsia-400 font-bold text-lg">4 ta diastereomer</p>
              <p className="text-purple-300">Λ-δ, Λ-λ, Δ-δ, Δ-λ</p>
              <p className="text-purple-400 mt-1">murakkab</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-fuchsia-400 font-bold text-lg">λ<sub>max</sub> = 470</p>
              <p className="text-purple-300">nm</p>
              <p className="text-purple-400 mt-1">d-d o'tish</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-fuchsia-400 font-bold text-lg">Δε ≈ ∓2.8</p>
              <p className="text-purple-300">M⁻¹cm⁻¹</p>
              <p className="text-purple-400 mt-1">R-pn dan teskari</p>
            </div>
          </div>
        </div>

        {/* CD SPEKTR SIMULYATORI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <CDSpectrumSimulator />
        </div>

        {/* S-PN LIGAND */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <SPnLigand />
        </div>

        {/* R vs S SOLISHTIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <RvsSComparison />
        </div>

        {/* DIASTEREOMERLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <Diastereomers />
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
        <div className="bg-gradient-to-r from-fuchsia-600/10 to-purple-600/10 border border-fuchsia-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>[Co(S-pn)₃]³⁺ — <strong className="text-fuchsia-400">[Co(R-pn)₃]³⁺ ning enantiomeri</strong></li>
            <li>S-pn — <strong>R-pn ning ko'zgudagi aksi</strong> (S-konfiguratsiya)</li>
            <li><strong>4 ta diastereomer</strong>: Λ-(δ,δ,δ), Λ-(λ,λ,λ), Δ-(δ,δ,δ), Δ-(λ,λ,λ)</li>
            <li>Λ-(δ,δ,δ) — <strong>eng barqaror</strong> (S-pn bilan)</li>
            <li>CD spektri <strong>R-pn dan teskari</strong> — barcha belgilar teskari</li>
            <li>Δ-(λ,λ,λ) (R-pn): CD = +2.8 → Λ-(δ,δ,δ) (S-pn): CD = −2.8</li>
            <li><strong>Stereoselektiv sintez</strong> — Λ-(δ,δ,δ) afzal (70%)</li>
            <li>Ratsemik aralashma → CD = 0 (signallar bir-birini yo'q qiladi)</li>
            <li>CD spektroskopiyasida <strong>absolyut konfiguratsiya standarti</strong></li>
            <li>Asymmetrik kataliz va farmatsevtika uchun muhim</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/cd/birikmalar/co-r-pn3" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← [Co(R-pn)₃]³⁺
          </Link>
          <Link href="/ilmiy/tahlil/cd/birikmalar/co-dchxn3" className="px-6 py-3 bg-fuchsia-600/80 rounded-xl hover:bg-fuchsia-500 text-white font-semibold">
            [Co(dchxn)₃]³⁺ →
          </Link>
        </div>

      </section>
    </main>
  )
}