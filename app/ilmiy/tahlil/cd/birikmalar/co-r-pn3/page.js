"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. CD SPEKTR SIMULYATORI ([Co(R-pn)₃]³⁺ uchun)
// ============================================================================
function CDSpectrumSimulator() {
  const [diastereomer, setDiastereomer] = useState("delta-lambda")
  const [ee, setEe] = useState(100)

  // Diastereomerlar uchun xarakterli parametrlar
  // R-pn ligand o'zining xiral CD signalini qo'shadi
  const diastereomers = {
    "delta-lambda": {
      name: "Δ-(λ,λ,λ)",
      desc: "Metall Δ, xelatlar λ — eng barqaror",
      lambda_max: 470,
      delta_epsilon_max: 2.8,
      ligand_band: 230,
      ligand_de: 1.5,
      sign: 1
    },
    "delta-delta": {
      name: "Δ-(δ,δ,δ)",
      desc: "Metall Δ, xelatlar δ — kam barqaror",
      lambda_max: 470,
      delta_epsilon_max: 2.2,
      ligand_band: 230,
      ligand_de: -1.2,
      sign: 1
    },
    "lambda-delta": {
      name: "Λ-(δ,δ,δ)",
      desc: "Metall Λ, xelatlar δ — eng barqaror (Λ bilan)",
      lambda_max: 470,
      delta_epsilon_max: -2.8,
      ligand_band: 230,
      ligand_de: 1.5,
      sign: -1
    },
    "lambda-lambda": {
      name: "Λ-(λ,λ,λ)",
      desc: "Metall Λ, xelatlar λ — kam barqaror",
      lambda_max: 470,
      delta_epsilon_max: -2.2,
      ligand_band: 230,
      ligand_de: -1.2,
      sign: -1
    }
  }

  const d = diastereomers[diastereomer]
  const eeFactor = ee / 100

  // CD spektri simulyatsiyasi
  const spectrum = useMemo(() => {
    const points = []
    for (let i = 0; i < 400; i++) {
      const lambda = 200 + i * 1.5 // 200-800 nm
      let cotton = 0
      let absorption = 0

      // d-d o'tish (metall markaz)
      const x1 = (lambda - d.lambda_max) / 35
      const cotton_dd = d.sign * x1 * Math.exp(-0.5 * x1 * x1) * d.delta_epsilon_max * eeFactor
      const abs_dd = Math.exp(-0.5 * x1 * x1) * 80 * eeFactor
      
      // Ligand xiral band (UV sohada)
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
      <h3 className="text-white font-semibold">📊 CD spektr simulyatori — [Co(R-pn)₃]³⁺</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-violet-700/30 space-y-4">
        <div className="bg-violet-600/10 border border-violet-500/30 rounded-lg p-4">
          <p className="text-violet-400 font-bold mb-2">💎 Xiral ligand — murakkab CD spektri:</p>
          <p className="text-purple-200 text-xs">
            R-pn ligand o'zining <strong>xiral CD signalini</strong> qo'shadi. Natijada
            <strong> diastereomerlar</strong> (Δ-λ vs Δ-δ) turli CD spektrlari beradi.
            Metall markazidagi Cotton effekti (470 nm) va ligand xiral bandi (230 nm) birgalikda ko'rinadi.
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
                    ? "bg-violet-600/80 text-white shadow-lg" 
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
            className="w-full h-2 bg-purple-900 rounded accent-violet-500" />
        </div>

        {/* SPEKTR */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-violet-400 font-bold text-xs mb-2">
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
              fill="none" stroke="#8b5cf6" strokeWidth="2"
            />

            {/* Legend */}
            <text x="280" y="30" fill="#fbbf24" fontSize="8">— Absorbsiya</text>
            <text x="280" y="45" fill="#8b5cf6" fontSize="8">— CD (Δε)</text>
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          <div className="bg-violet-900/30 border border-violet-500/50 rounded-lg p-3">
            <p className="text-violet-400">Diastereomer</p>
            <p className="text-violet-400 font-bold text-[10px]">{d.name}</p>
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
          <p className="text-yellow-400 font-bold mb-1">💡 Diastereomerlar farqi:</p>
          <p className="text-purple-200">
            <strong>Δ-(λ,λ,λ)</strong> — eng barqaror, d-d CD = +2.8, ligand CD = +1.5
            <br/>
            <strong>Δ-(δ,δ,δ)</strong> — kam barqaror, d-d CD = +2.2, ligand CD = −1.2 (teskari!)
            <br/>
            Ligand konformatsiyasi CD signalining <strong>belgisini o'zgartirishi</strong> mumkin!
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. R-PN LIGAND STRUKTURASI
// ============================================================================
function RPnLigand() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔗 R-propilendiamin (R-pn) — xiral ligand</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-violet-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-violet-400 font-bold mb-3">R-pn strukturasi:</h4>
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

              {/* R konfiguratsiya ko'rsatkichi */}
              <path d="M 40 50 Q 80 30 160 50" fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="3,2" />
              <text x="100" y="25" fill="#8b5cf6" fontSize="8" textAnchor="middle">R-konfiguratsiya</text>

              <text x="100" y="170" fill="#a78bfa" fontSize="9" textAnchor="middle">
                (R)-1,2-propilendiamin
              </text>
            </svg>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-violet-400 font-bold mb-3">Xususiyatlari:</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Zaryad:</span>
                <span className="text-violet-400 font-bold">0 (neytral)</span>
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
                <span className="text-violet-400 font-bold">1 ta (C2)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Konfiguratsiya:</span>
                <span className="text-violet-400 font-bold">R</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Optik faollik:</span>
                <span className="text-violet-400">Ha ([α] ≠ 0)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 R vs S farqi:</p>
          <p className="text-purple-200">
            <strong>R-pn</strong> — (R)-konfiguratsiya, o'ngga burilgan.
            <br/>
            <strong>S-pn</strong> — (S)-konfiguratsiya, chapga burilgan (enantiomer).
            <br/>
            R-pn va S-pn <strong>bir xil fizik xossalarga</strong> ega, lekin <strong>qutblangan nur</strong> bilan
            o'zaro ta'siri <strong>teskari</strong>. [Co(R-pn)₃]³⁺ va [Co(S-pn)₃]³⁺ — <strong>diastereomerlar</strong> emas,
            ularning har bir diastereomer jufti mavjud.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. DIASTEREOMERLAR
// ============================================================================
function Diastereomers() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔷 Diastereomerlar — Δ/Λ va λ/δ kombinatsiyalari</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-violet-700/30 space-y-4">
        <div className="bg-violet-600/10 border border-violet-500/30 rounded-lg p-4">
          <p className="text-violet-400 font-bold mb-2">💎 4 ta diastereomer:</p>
          <p className="text-purple-200 text-xs">
            Metall markazidagi <strong>Δ/Λ</strong> va xelat halqalaridagi <strong>λ/δ</strong> konformatsiyalari
            birgalikda <strong>4 ta diastereomer</strong> hosil qiladi. Ularning har biri <strong>CD spektri</strong> va
            <strong> barqarorligi</strong> bilan farqlanadi.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-emerald-900/20 border-2 border-emerald-500/50 rounded-xl p-4">
            <h4 className="text-emerald-400 font-bold mb-2">Δ-(λ,λ,λ) ✓</h4>
            <p className="text-purple-200 text-xs mb-2">Eng barqaror</p>
            <ul className="text-purple-300 text-[10px] space-y-1">
              <li>• Metall: Δ (P-helis)</li>
              <li>• Xelatlar: λ (mos keladi)</li>
              <li>• CD: Δε = +2.8 (kuchli)</li>
              <li>• Sterik to'siq: minimal</li>
            </ul>
          </div>

          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
            <h4 className="text-red-400 font-bold mb-2">Δ-(δ,δ,δ) ✗</h4>
            <p className="text-purple-200 text-xs mb-2">Kam barqaror</p>
            <ul className="text-purple-300 text-[10px] space-y-1">
              <li>• Metall: Δ (P-helis)</li>
              <li>• Xelatlar: δ (teskari)</li>
              <li>• CD: Δε = +2.2 (kuchsiz)</li>
              <li>• Sterik to'siq: mavjud</li>
            </ul>
          </div>

          <div className="bg-emerald-900/20 border-2 border-emerald-500/50 rounded-xl p-4">
            <h4 className="text-emerald-400 font-bold mb-2">Λ-(δ,δ,δ) ✓</h4>
            <p className="text-purple-200 text-xs mb-2">Eng barqaror (Λ bilan)</p>
            <ul className="text-purple-300 text-[10px] space-y-1">
              <li>• Metall: Λ (M-helis)</li>
              <li>• Xelatlar: δ (mos keladi)</li>
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
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Qoida:</p>
          <p className="text-purple-200">
            <strong>Δ bilan λ</strong> yoki <strong>Λ bilan δ</strong> — mos keladi (lel konformatsiya) → barqaror.
            <br/>
            <strong>Δ bilan δ</strong> yoki <strong>Λ bilan λ</strong> — teskari (ob konformatsiya) → kam barqaror.
            <br/>
            R-pn ligand <strong>λ konformatsiyani afzal ko'radi</strong> → Δ-(λ,λ,λ) eng barqaror.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. STEREOSELECTIVE SYNTHESIS
// ============================================================================
function StereoselectiveSynthesis() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🧪 Stereoselektiv sintez — qaysi diastereomer afzal?</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-violet-700/30 space-y-4">
        <div className="bg-violet-600/10 border border-violet-500/30 rounded-lg p-4">
          <p className="text-violet-400 font-bold mb-2">💎 Stereoselektivlik:</p>
          <p className="text-purple-200 text-xs">
            R-pn ligand bilan sintez qilganda, <strong>Δ-(λ,λ,λ)</strong> diastereomer <strong>afzal</strong> hosil bo'ladi.
            Sababi: R-pn λ konformatsiyani afzal ko'radi → Δ metall bilan mos keladi.
            Natijada <strong>stereoselektiv sintez</strong> — bir diastereomer ko'proq olinadi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-violet-400 font-bold mb-3">Sintez jarayoni:</h4>
            <div className="space-y-2 text-xs">
              <div className="bg-purple-900/50 rounded p-2">
                <p className="text-purple-300">1. Co²⁺ + R-pn → aralashma</p>
              </div>
              <div className="bg-purple-900/50 rounded p-2">
                <p className="text-purple-300">2. Oksidlanish (H₂O₂) → Co³⁺</p>
              </div>
              <div className="bg-violet-900/30 border border-violet-500/30 rounded p-2">
                <p className="text-violet-400 font-bold">3. Δ-(λ,λ,λ) afzal → 70%</p>
              </div>
              <div className="bg-purple-900/50 rounded p-2">
                <p className="text-purple-300">4. Δ-(δ,δ,δ) → 30%</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-violet-400 font-bold mb-3">Ajratish usullari:</h4>
            <ul className="text-purple-200 text-xs space-y-2">
              <li>✓ <strong>Fraksion kristallizatsiya</strong> — eruvchanlik farqli</li>
              <li>✓ <strong>Xromatografiya</strong> — polarlik farqli</li>
              <li>✓ <strong>CD spektroskopiyasi</strong> — signallar farqli</li>
              <li>✓ <strong>NMR</strong> — diastereomerlar farqlanadi</li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun stereoselektiv?</p>
          <p className="text-purple-200">
            R-pn ligand <strong>o'zining xiral stereomarkazi</strong> tufayli ma'lum bir konformatsiyani afzal ko'radi.
            Δ metall markazi bilan R-pn ning λ konformatsiyasi <strong>sterik jihatdan qulay</strong>.
            Bu <strong>"chiral induction"</strong> deb ataladi — xiral ligand metall markazining konfiguratsiyasini boshqaradi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. CD SPEKTRI TAHLILI
// ============================================================================
function CDSpektrTahlili() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📐 CD spektri tahlili — ligand va markaz hissalarini ajratish</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-violet-700/30 space-y-4">
        <div className="bg-violet-600/10 border border-violet-500/30 rounded-lg p-4">
          <p className="text-violet-400 font-bold mb-2">💎 Ikki komponent:</p>
          <p className="text-purple-200 text-xs">
            [Co(R-pn)₃]³⁺ CD spektri <strong>ikkita komponentdan</strong> iborat:
            <br/>
            1. <strong>Metall markaz</strong> hissasi (d-d o'tishlar, 400-500 nm)
            <br/>
            2. <strong>Ligand xiral</strong> hissasi (π-π*, 200-250 nm)
            <br/>
            Bu ikkala komponentni <strong>ajratish</strong> orqali absolyut konfiguratsiyani aniqlash mumkin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-violet-400 font-bold mb-3">Metall markaz (d-d):</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">λ<sub>max</sub>:</span>
                <span className="text-violet-400 font-mono">~470 nm</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Δε:</span>
                <span className="text-violet-400 font-mono">±2.8</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Belgisi:</span>
                <span className="text-violet-400">Δ → +, Λ → −</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Ma'lumot:</span>
                <span className="text-emerald-400">Δ/Λ konfiguratsiya</span>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-violet-400 font-bold mb-3">Ligand xiral (π-π*):</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">λ<sub>max</sub>:</span>
                <span className="text-violet-400 font-mono">~230 nm</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Δε:</span>
                <span className="text-violet-400 font-mono">±1.5</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Belgisi:</span>
                <span className="text-violet-400">λ → +, δ → −</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Ma'lumot:</span>
                <span className="text-emerald-400">λ/δ konformatsiya</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 To'liq konfiguratsiya aniqlash:</p>
          <p className="text-purple-200">
            <strong>470 nm da +</strong> → Δ metall
            <br/>
            <strong>230 nm da +</strong> → λ xelat
            <br/>
            Natija: <strong>Δ-(λ,λ,λ)</strong> — eng barqaror diastereomer
            <br/>
            Bu usul <strong>absolyut konfiguratsiyani</strong> to'liq aniqlashga imkon beradi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 6. SOLISHTIRISH - en vs R-pn vs S-pn
// ============================================================================
function Solishtirish() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 en vs R-pn vs S-pn — ligand solishtirilishi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-violet-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-2 text-yellow-400">Xususiyat</th>
                <th className="text-center py-3 px-2 text-blue-400">[Co(en)₃]³⁺</th>
                <th className="text-center py-3 px-2 text-violet-400">[Co(R-pn)₃]³⁺</th>
                <th className="text-center py-3 px-2 text-fuchsia-400">[Co(S-pn)₃]³⁺</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["Ligand", "en (axiral)", "R-pn (xiral)", "S-pn (xiral)"],
                ["Stereomarkaz", "Yo'q", "1 ta (R)", "1 ta (S)"],
                ["Diastereomerlar", "2 (Δ/Λ)", "4 (Δ-λ, Δ-δ, Λ-λ, Λ-δ)", "4 (Δ-λ, Δ-δ, Λ-λ, Λ-δ)"],
                ["CD spektri", "Oddiy", "Murakkab", "Murakkab"],
                ["d-d Cotton (Δε)", "±2.0", "±2.8", "±2.8"],
                ["Ligand CD", "Yo'q", "±1.5 (230 nm)", "∓1.5 (230 nm)"],
                ["Stereoselektivlik", "Yo'q", "Ha (Δ-λ afzal)", "Ha (Λ-δ afzal)"],
                ["Barqarorlik", "Bir xil", "Δ-λ > Δ-δ", "Λ-δ > Λ-λ"],
                ["Narx", "Arzon", "Qimmat", "Qimmat"],
              ].map((r, i) => (
                <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-2 px-2 font-bold text-purple-300">{r[0]}</td>
                  <td className="py-2 px-2 text-center text-blue-400">{r[1]}</td>
                  <td className="py-2 px-2 text-center text-violet-400">{r[2]}</td>
                  <td className="py-2 px-2 text-center text-fuchsia-400">{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 bg-violet-600/10 border border-violet-500/30 rounded-lg p-3 text-xs">
          <p className="text-violet-400 font-bold mb-1">💡 Asosiy farqlar:</p>
          <p className="text-purple-200">
            <strong>en</strong> — axiral, faqat Δ/Λ enantiomerlar (2 ta)
            <br/>
            <strong>R-pn</strong> — xiral, Δ/Λ va λ/δ kombinatsiyalari (4 ta diastereomer)
            <br/>
            <strong>S-pn</strong> — R-pn ning enantiomeri, lekin diastereomerlari teskari
            <br/>
            Xiral ligand <strong>stereoselektiv sintez</strong> va <strong>murakkab CD spektri</strong> beradi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 7. TARIXIY KONTEKST
// ============================================================================
function TarixiyKontekst() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🏛️ Tarixiy kontekst — xiral ligandlar kimyosi</h3>

      <div className="bg-gradient-to-br from-violet-900/30 to-purple-900/30 rounded-xl p-5 border border-violet-500/30 space-y-4">
        <div className="space-y-3">
          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">⚗️</div>
              <div>
                <p className="text-yellow-400 font-bold">1920-30 — Xiral ligandlar sintezi</p>
                <p className="text-purple-200 text-xs mt-1">
                  Birinchi marta <strong>xiral aminlar</strong> (R-pn, S-pn) sintez qilindi.
                  Ular koordinatsion kimyoda <strong>stereokimyoviy tadqiqotlar</strong> uchun ishlatila boshladi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🔬</div>
              <div>
                <p className="text-yellow-400 font-bold">1950-60 — Bailar va boshqalar</p>
                <p className="text-purple-200 text-xs mt-1">
                  <strong>John Bailar</strong> va hamkasblari [Co(R-pn)₃]³⁺ ning
                  <strong> diastereomerlarini</strong> ajratdi va CD spektroskopiyasi orqali o'rgandi.
                  Stereoselektiv sintez qoidalari ishlab chiqildi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">📊</div>
              <div>
                <p className="text-yellow-400 font-bold">1970+ — Zamonaviy stereokimyo</p>
                <p className="text-purple-200 text-xs mt-1">
                  Xiral ligandli komplekslar <strong>asymmetrik kataliz</strong>,
                  <strong>farmatsevtika</strong> va <strong>materialshunoslik</strong>da keng qo'llanila boshladi.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 [Co(R-pn)₃]³⁺ ning ahamiyati:</p>
          <ul className="text-purple-200 space-y-1 list-disc list-inside">
            <li><strong>Birinchi xiral ligandli kompleks</strong> — stereokimyo klassikasi</li>
            <li><strong>4 ta diastereomer</strong> — Δ/Λ va λ/δ kombinatsiyalari</li>
            <li><strong>Stereoselektiv sintez</strong> — chiral induction</li>
            <li><strong>CD spektroskopiyasi</strong> — absolyut konfiguratsiya aniqlash</li>
            <li><strong>Asymmetrik kataliz</strong> asoschisi</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function CoRPn3CD() {
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
          <span className="text-violet-400">[Co(R-pn)₃]³⁺</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-violet-400">🔄 [Co(R-pn)₃]³⁺ — CD tahlili</h1>
          <p className="text-purple-400 text-sm">
            Co³⁺ (d⁶ LS) • Xiral ligand • Diastereomerlar • Stereoselektiv sintez
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-violet-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-4xl md:text-5xl font-extrabold font-mono text-violet-400">[Co(R-pn)₃]³⁺</span>
            <div>
              <h2 className="text-xl font-bold text-white">CD tahlili — to'liq profil</h2>
              <p className="text-purple-400">"Tris((R)-propilendiamin)kobalt(III)" — xiral ligand klassikasi</p>
            </div>
          </div>

          <div className="bg-violet-600/10 border border-violet-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              [Co(R-pn)₃]³⁺ — <strong className="text-violet-400">xiral ligandli kompleksning klassik namunasi</strong>.
              R-pn ligand <strong>stereomarkazga</strong> ega → metall markazidagi Δ/Λ bilan birgalikda
              <strong> 4 ta diastereomer</strong> hosil bo'ladi. CD spektri <strong>murakkab</strong> —
              metall markaz (470 nm) va ligand xiral (230 nm) hissalarini o'z ichiga oladi.
              <strong> Stereoselektiv sintez</strong> orqali Δ-(λ,λ,λ) diastereomer afzal olinadi.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-violet-400 font-bold text-lg">Co³⁺ (LS)</p>
              <p className="text-purple-300">d⁶, t₂g⁶</p>
              <p className="text-purple-400 mt-1">S = 0</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-violet-400 font-bold text-lg">4 ta diastereomer</p>
              <p className="text-purple-300">Δ-λ, Δ-δ, Λ-λ, Λ-δ</p>
              <p className="text-purple-400 mt-1">murakkab</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-violet-400 font-bold text-lg">λ<sub>max</sub> = 470</p>
              <p className="text-purple-300">nm</p>
              <p className="text-purple-400 mt-1">d-d o'tish</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-violet-400 font-bold text-lg">Δε ≈ ±2.8</p>
              <p className="text-purple-300">M⁻¹cm⁻¹</p>
              <p className="text-purple-400 mt-1">kuchli CD</p>
            </div>
          </div>
        </div>

        {/* CD SPEKTR SIMULYATORI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <CDSpectrumSimulator />
        </div>

        {/* R-PN LIGAND */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <RPnLigand />
        </div>

        {/* DIASTEREOMERLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <Diastereomers />
        </div>

        {/* STEREOSELECTIVE SYNTHESIS */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <StereoselectiveSynthesis />
        </div>

        {/* CD SPEKTRI TAHLILI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <CDSpektrTahlili />
        </div>

        {/* SOLISHTIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <Solishtirish />
        </div>

        {/* TARIX */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <TarixiyKontekst />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-violet-600/10 to-purple-600/10 border border-violet-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>[Co(R-pn)₃]³⁺ — <strong className="text-violet-400">xiral ligandli kompleks klassikasi</strong></li>
            <li>R-pn — <strong>stereomarkazga ega</strong> (R-konfiguratsiya)</li>
            <li><strong>4 ta diastereomer</strong>: Δ-(λ,λ,λ), Δ-(δ,δ,δ), Λ-(λ,λ,λ), Λ-(δ,δ,δ)</li>
            <li>Δ-(λ,λ,λ) — <strong>eng barqaror</strong> (lel konformatsiya)</li>
            <li>CD spektri <strong>murakkab</strong> — metall (470 nm) + ligand (230 nm)</li>
            <li><strong>Stereoselektiv sintez</strong> — Δ-(λ,λ,λ) afzal (70%)</li>
            <li>Chiral induction — xiral ligand metall konfiguratsiyasini boshqaradi</li>
            <li>CD orqali <strong>absolyut konfiguratsiya</strong> to'liq aniqlanadi</li>
            <li>en (axiral) dan farqli — <strong>4 ta diastereomer</strong> (2 emas)</li>
            <li>Asymmetrik kataliz va farmatsevtika uchun muhim</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/cd/birikmalar/rh-en3" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← [Rh(en)₃]³⁺
          </Link>
          <Link href="/ilmiy/tahlil/cd/birikmalar/co-s-pn3" className="px-6 py-3 bg-violet-600/80 rounded-xl hover:bg-violet-500 text-white font-semibold">
            [Co(S-pn)₃]³⁺ →
          </Link>
        </div>

      </section>
    </main>
  )
}