"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. SPIN-ONLY KALKULYATORI (K₄[Fe(CN)₆] uchun maxsus)
// ============================================================================
function SpinOnlyCalc() {
  const [n, setN] = useState(0) // K₄[Fe(CN)₆] uchun 0 toq elektron

  const mu_so = Math.sqrt(n * (n + 2))

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🧮 Spin-only magnit momenti — K₄[Fe(CN)₆]</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-yellow-700/30 space-y-4">
        <div className="bg-purple-950/50 rounded-lg p-4 font-mono text-center">
          <p className="text-purple-400 text-xs mb-2">Formula:</p>
          <p className="text-yellow-400 text-xl">
            μ<sub>so</sub> = √[n(n+2)] μ<sub>B</sub>
          </p>
        </div>

        <div>
          <label className="flex justify-between text-xs mb-2">
            <span className="text-yellow-400 font-bold">Toq elektronlar soni (n):</span>
            <span className="text-emerald-400 font-mono text-lg">{n}</span>
          </label>
          <input
            type="range"
            min="0"
            max="7"
            step="1"
            value={n}
            onChange={(e) => setN(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded-lg appearance-none cursor-pointer accent-yellow-500"
          />
          <div className="flex justify-between text-[10px] text-purple-400 mt-1">
            <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-center">
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Hisoblash</p>
            <p className="text-purple-200 font-mono">√({n}·{n + 2})</p>
          </div>
          <div className="bg-yellow-900/40 border border-yellow-500/40 rounded-lg p-3">
            <p className="text-yellow-400">Natija</p>
            <p className="text-emerald-400 font-bold font-mono text-lg">{mu_so.toFixed(3)} μ<sub>B</sub></p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-2">📋 n bo'yicha qiymatlar:</p>
          <div className="grid grid-cols-8 gap-1 text-center font-mono">
            {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
              <div key={i} className={`rounded p-1 ${i === n ? 'bg-yellow-600/50 text-white' : 'bg-purple-800/30 text-purple-300'}`}>
                <div className="text-[10px]">n={i}</div>
                <div className="font-bold">{Math.sqrt(i * (i + 2)).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-lg p-3 text-xs">
          <p className="text-emerald-400 font-bold mb-1">✅ K₄[Fe(CN)₆] uchun:</p>
          <p className="text-purple-200">
            K₄[Fe(CN)₆] da n=0 (t₂g⁶, S=0), spin-only μ<sub>so</sub> = <strong>0 μ<sub>B</sub></strong>.
            Eksperimental qiymat ham 0 — <strong>ideal moslik</strong>. Hech qanday orbital hissa yo'q,
            chunki ground state ¹A<sub>1g</sub> — sferik simmetrik.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. DIAMAGNETIZM SIMULYATORI (Faraday usuli)
// ============================================================================
function DiamagnetismSimulator() {
  const [H, setH] = useState(1.0) // Tesla
  const [mass, setMass] = useState(0.1) // g
  const [chiDia, setChiDia] = useState(-13.2e-6) // emu/g (K₄[Fe(CN)₆])

  // Faraday kuchi: F = χ · m · H · (dH/dz)
  // dH/dz taxminan H / 0.01 m = H * 100 T/m
  const dHdz = H * 100
  const F = chiDia * mass * H * dHdz // dyne
  const F_mN = F * 1e-5 * 1000 // mN ga o'tkazish

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🎯 Diamagnetizm simulyatori (Faraday usuli)</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-yellow-700/30 space-y-4">
        <div className="bg-purple-950/50 rounded-lg p-4 font-mono text-center">
          <p className="text-purple-400 text-xs mb-1">Faraday formulasi:</p>
          <p className="text-yellow-400 text-lg">F = χ<sub>g</sub> · m · H · (dH/dz)</p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">H (magnit maydoni):</span>
              <span className="text-emerald-400 font-mono">{H.toFixed(2)} T</span>
            </label>
            <input type="range" min="0" max="5" step="0.1" value={H}
              onChange={(e) => setH(parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded-lg appearance-none cursor-pointer accent-yellow-500" />
          </div>
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">m (namuna massasi):</span>
              <span className="text-emerald-400 font-mono">{mass.toFixed(3)} g</span>
            </label>
            <input type="range" min="0.01" max="1" step="0.01" value={mass}
              onChange={(e) => setMass(parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded-lg appearance-none cursor-pointer accent-yellow-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-purple-950/50 rounded-lg p-4 text-center">
            <p className="text-purple-400 text-xs mb-1">χ<sub>g</sub> (K₄[Fe(CN)₆])</p>
            <p className="text-blue-400 font-bold font-mono">{chiDia.toExponential(2)} emu/g</p>
            <p className="text-purple-500 text-[10px] mt-1">Manfiy — diamagnit!</p>
          </div>
          <div className="bg-blue-900/40 border border-blue-500/40 rounded-lg p-4 text-center">
            <p className="text-blue-400 text-xs mb-1">Faraday kuchi</p>
            <p className="text-emerald-400 font-bold font-mono text-lg">{F_mN.toExponential(2)} mN</p>
            <p className="text-purple-400 text-[10px] mt-1">Yo'nalishi: magnitdan uzoqqa ⬆️</p>
          </div>
        </div>

        {/* Vizualizatsiya */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-blue-400 font-bold text-xs mb-3">Faraday tarozisi sxemasi:</h5>
          <svg viewBox="0 0 400 200" className="w-full h-48">
            {/* Magnit */}
            <rect x="50" y="120" width="80" height="60" fill="#dc2626" opacity="0.6" rx="5" />
            <text x="90" y="155" fill="white" fontSize="10" textAnchor="middle">N</text>
            <rect x="270" y="120" width="80" height="60" fill="#2563eb" opacity="0.6" rx="5" />
            <text x="310" y="155" fill="white" fontSize="10" textAnchor="middle">S</text>

            {/* Magnit maydon chiziqlari */}
            {[0, 1, 2, 3, 4].map(i => (
              <path key={i} d={`M 130 ${130 + i*10} Q 200 ${110 + i*5} 270 ${130 + i*10}`}
                stroke="#a78bfa" strokeWidth="0.5" fill="none" opacity="0.4" />
            ))}

            {/* Namuna */}
            <rect x="180" y="70" width="40" height="50" fill="#eab308" opacity="0.8" rx="3" />
            <text x="200" y="100" fill="white" fontSize="9" textAnchor="middle">K₄[Fe(CN)₆]</text>

            {/* Tarozi */}
            <line x1="200" y1="20" x2="200" y2="70" stroke="#a78bfa" strokeWidth="1" />
            <line x1="150" y1="20" x2="250" y2="20" stroke="#a78bfa" strokeWidth="1.5" />
            <circle cx="200" cy="20" r="3" fill="#a78bfa" />

            {/* Kuch strelkasi */}
            <line x1="200" y1="50" x2="200" y2="30" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow)" />
            <defs>
              <marker id="arrow" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
                <polygon points="0,0 5,2.5 0,5" fill="#10b981" />
              </marker>
            </defs>
            <text x="215" y="40" fill="#10b981" fontSize="8">F (itariladi)</text>
          </svg>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Diamagnit moddaning xususiyati:</p>
          <p className="text-purple-200">
            Diamagnit moddalar magnit maydonidan <strong>itariladi</strong> (paramagnitlar — tortiladi).
            Kuch juda kichik (~10⁻⁶ N), shuning uchun sezgir tarozi kerak.
            K₄[Fe(CN)₆] bu hodisani namoyish qilish uchun <strong>ideal namuna</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. PASCAL KONSTANTALARI KALKULYATORI
// ============================================================================
function PascalCalculator() {
  const [formula, setFormula] = useState("K4FeC6N6") // K₄[Fe(CN)₆]

  // Pascal konstantalari (× 10⁻⁶ emu/mol)
  const pascalConstants = {
    'K': -15.0, 'Fe': -13.0, 'C': -6.0, 'N': -5.57, 'H': -2.93,
    'O': -4.61, 'Cl': -23.8, 'Br': -34.3, 'I': -44.6,
    'NH3': -18.0, 'H2O': -13.0, 'CN': -13.0, 'CO': -10.0,
    'benzene': -1.4, 'C=C': +5.5, 'C≡C': +0.8, 'C≡N': +0.8,
  }

  // K₄[Fe(CN)₆] uchun hisoblash
  const calculateChiDia = () => {
    // K₄: 4 × K⁺
    // [Fe(CN)₆]: Fe²⁺ + 6 × CN⁻
    // Bog' tuzatmalari: 6 × C≡N
    const chi_K = 4 * pascalConstants['K']
    const chi_Fe = 1 * pascalConstants['Fe']
    const chi_CN = 6 * pascalConstants['CN']
    const chi_bond = 6 * pascalConstants['C≡N']
    return chi_K + chi_Fe + chi_CN + chi_bond
  }

  const chiDia = calculateChiDia()
  const M = 368.35 // K₄[Fe(CN)₆] molyar massasi

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📝 Paskal konstantalari — diamagnit tuzatma</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-yellow-700/30 space-y-4">
        <p className="text-purple-200 text-xs">
          Har qanday magnit o'lchashda <strong className="text-yellow-400">diamagnit tuzatma</strong>
          (Pascal konstantalari) qo'llaniladi. K₄[Fe(CN)₆] <strong>to'liq diamagnit</strong> bo'lgani uchun,
          bu tuzatma asosiy hisoblanadi.
        </p>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-yellow-400 font-bold text-xs mb-3">K₄[Fe(CN)₆] uchun hisoblash:</h5>
          <div className="font-mono text-xs space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-purple-900/50 rounded p-2">
                <p className="text-purple-400 text-[10px]">4 × K⁺</p>
                <p className="text-emerald-400">4 × (−15.0) = <strong>−60.0</strong></p>
              </div>
              <div className="bg-purple-900/50 rounded p-2">
                <p className="text-purple-400 text-[10px]">1 × Fe²⁺</p>
                <p className="text-emerald-400">1 × (−13.0) = <strong>−13.0</strong></p>
              </div>
              <div className="bg-purple-900/50 rounded p-2">
                <p className="text-purple-400 text-[10px]">6 × CN⁻</p>
                <p className="text-emerald-400">6 × (−13.0) = <strong>−78.0</strong></p>
              </div>
              <div className="bg-purple-900/50 rounded p-2">
                <p className="text-purple-400 text-[10px]">6 × C≡N (bog')</p>
                <p className="text-emerald-400">6 × (+0.8) = <strong>+4.8</strong></p>
              </div>
            </div>
            <div className="border-t border-purple-700/50 pt-2 mt-2">
              <p className="text-yellow-400">
                χ<sub>dia</sub> = −60.0 − 13.0 − 78.0 + 4.8 = <strong>−146.2 × 10⁻⁶ emu/mol</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-center">
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">χ<sub>dia</sub> (mol)</p>
            <p className="text-emerald-400 font-bold font-mono">{chiDia.toFixed(1)} × 10⁻⁶</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">χ<sub>dia</sub> (g)</p>
            <p className="text-emerald-400 font-bold font-mono">{(chiDia / M).toFixed(2)} × 10⁻⁶</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Amaliy ahamiyati:</p>
          <p className="text-purple-200">
            Paramagnit komplekslarda diamagnit tuzatma kichik hissadir. Ammo K₄[Fe(CN)₆] kabi
            <strong> to'liq diamagnit</strong> komplekslarda bu <strong>asosiy signal</strong> hisoblanadi.
            Bu qiymat kalibratsiya standarti sifatida ishlatiladi.
          </p>
        </div>

        <div className="bg-purple-900/50 rounded-lg p-4">
          <h5 className="text-emerald-400 font-bold text-xs mb-3">Ko'p ishlatiladigan Pascal konstantalari:</h5>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2 text-[10px]">
            {Object.entries(pascalConstants).slice(0, 12).map(([atom, val]) => (
              <div key={atom} className="bg-purple-800/30 rounded p-1.5 text-center">
                <p className="text-purple-400">{atom}</p>
                <p className={`font-bold ${val < 0 ? 'text-blue-400' : 'text-red-400'}`}>
                  {val > 0 ? '+' : ''}{val}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. KRISTALL MAYDON NAZARIYASI (chuqur)
// ============================================================================
function CrystalFieldK4() {
  const [Dq, setDq] = useState(33800) // cm⁻¹, K₄[Fe(CN)₆] uchun
  const [P, setP] = useState(20000) // pairing energy

  const deltaO = Dq * 10 / 1000 // kJ/mol ga taxminan
  const spinState = Dq > P ? "Quyi spin (LS)" : "Yuqori spin (HS)"

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔬 Kristall maydon — K₄[Fe(CN)₆]</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-yellow-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-yellow-400 font-bold mb-3">Kristall maydon diagrammasi</h4>
            <div className="font-mono text-xs space-y-3">
              <div className="flex justify-between items-center border-b border-purple-700/30 pb-2">
                <span className="text-red-400">e<sub>g</sub>* (σ*)</span>
                <div className="flex gap-3">
                  <span className="text-purple-500">__</span>
                  <span className="text-purple-500">__</span>
                </div>
                <span className="text-purple-500">bo'sh</span>
              </div>

              <div className="text-center text-purple-400 text-[10px] py-1">
                Δ<sub>o</sub> = {Dq} cm⁻¹ = {(Dq * 1.24e-4 * 1000).toFixed(1)} eV
              </div>

              <div className="flex justify-between items-center border-t border-purple-700/30 pt-2">
                <span className="text-emerald-400">t₂g (π)</span>
                <div className="flex gap-3">
                  <span className="text-yellow-400">↑↓</span>
                  <span className="text-yellow-400">↑↓</span>
                  <span className="text-yellow-400">↑↓</span>
                </div>
                <span className="text-emerald-400">6 e⁻</span>
              </div>

              <div className="bg-purple-900/50 rounded p-2 text-center mt-3">
                <p className="text-purple-300 text-[10px]">Fe²⁺ (d⁶) konfiguratsiyasi</p>
                <p className="text-yellow-400 font-bold">t₂g⁶ e<sub>g</sub>⁰</p>
                <p className="text-emerald-400 text-[10px] mt-1">¹A<sub>1g</sub> ground state</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-yellow-400 font-bold mb-3">Energiya parametrlari</h4>
            <div className="space-y-3">
              <div>
                <label className="flex justify-between text-xs mb-1">
                  <span className="text-yellow-400">Δ<sub>o</sub> (cm⁻¹):</span>
                  <span className="text-emerald-400 font-mono">{Dq}</span>
                </label>
                <input type="range" min="10000" max="50000" step="500" value={Dq}
                  onChange={(e) => setDq(parseInt(e.target.value))}
                  className="w-full h-2 bg-purple-900 rounded accent-yellow-500" />
              </div>
              <div>
                <label className="flex justify-between text-xs mb-1">
                  <span className="text-yellow-400">P (juftlanish energiyasi):</span>
                  <span className="text-emerald-400 font-mono">{P}</span>
                </label>
                <input type="range" min="10000" max="40000" step="500" value={P}
                  onChange={(e) => setP(parseInt(e.target.value))}
                  className="w-full h-2 bg-purple-900 rounded accent-yellow-500" />
              </div>

              <div className={`rounded-lg p-3 text-center ${Dq > P ? 'bg-emerald-900/30 border border-emerald-500/30' : 'bg-red-900/30 border border-red-500/30'}`}>
                <p className="text-xs text-purple-300">Holat:</p>
                <p className={`font-bold ${Dq > P ? 'text-emerald-400' : 'text-red-400'}`}>
                  {spinState}
                </p>
                <p className="text-[10px] text-purple-400 mt-1">
                  Δ<sub>o</sub> {Dq > P ? '>' : '<'} P
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 K₄[Fe(CN)₆] uchun:</p>
          <p className="text-purple-200">
            CN⁻ — spektrokimyoviy qatorda <strong>eng kuchli ligand</strong>. Δ<sub>o</sub> = 33800 cm⁻¹,
            bu P (≈20000 cm⁻¹) dan ancha katta. Shuning uchun 6 ta elektron <strong>t₂g</strong> da
            to'liq juftlashadi, natijada <strong>S = 0</strong> va <strong>diamagnit</strong> holat yuzaga keladi.
          </p>
        </div>

        <div className="bg-purple-900/50 rounded-lg p-4">
          <h5 className="text-emerald-400 font-bold text-xs mb-2">Spektrokimyoviy qator:</h5>
          <div className="font-mono text-[10px] text-purple-200 text-center leading-relaxed">
            I⁻ &lt; Br⁻ &lt; Cl⁻ &lt; F⁻ &lt; OH⁻ &lt; H₂O &lt; NH₃ &lt; en &lt; NO₂⁻ &lt; <span className="text-yellow-400 font-bold">CN⁻</span> &lt; CO
          </div>
          <p className="text-purple-400 text-[10px] text-center mt-2">← Kuchsiz &nbsp;&nbsp;→&nbsp;&nbsp; Kuchli</p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. NMR SIGNAL (diamagnit afzalligi)
// ============================================================================
function NMRDiamagnit() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🧲 NMR — diamagnit kompleksning afzalligi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-yellow-700/30 space-y-4">
        <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-lg p-4">
          <p className="text-emerald-400 font-bold mb-2">✅ K₄[Fe(CN)₆] — NMR uchun ideal!</p>
          <p className="text-purple-200 text-xs">
            Diamagnit bo'lgani uchun K₄[Fe(CN)₆] <strong>oddiy, aniq NMR spektr</strong> beradi.
            Paramagnit K₃[Fe(CN)₆] esa keng, murakkab spektr beradi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-emerald-400 font-bold mb-3">¹³C NMR (K₄[Fe(CN)₆])</h4>
            <div className="bg-purple-900/50 rounded p-4">
              <svg viewBox="0 0 300 100" className="w-full h-24">
                <line x1="20" y1="80" x2="280" y2="80" stroke="#4c1d95" strokeWidth="1" />
                <line x1="20" y1="20" x2="20" y2="80" stroke="#4c1d95" strokeWidth="1" />

                {/* Sharp peak at 165 ppm (CN carbon) */}
                <polyline
                  points={`180,80 185,75 190,40 195,20 200,40 205,75 210,80`}
                  fill="none" stroke="#10b981" strokeWidth="2" />

                <text x="195" y="95" fill="#a78bfa" fontSize="8" textAnchor="middle">165 ppm</text>
                <text x="150" y="15" fill="#c4b5fd" fontSize="8">¹³C (CN)</text>
              </svg>
            </div>
            <p className="text-purple-300 text-[10px] mt-2 text-center">
              Aniq, tor cho'qqi — δ = 165 ppm
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-red-400 font-bold mb-3">¹³C NMR (K₃[Fe(CN)₆] — paramagnit)</h4>
            <div className="bg-purple-900/50 rounded p-4">
              <svg viewBox="0 0 300 100" className="w-full h-24">
                <line x1="20" y1="80" x2="280" y2="80" stroke="#4c1d95" strokeWidth="1" />
                <line x1="20" y1="20" x2="20" y2="80" stroke="#4c1d95" strokeWidth="1" />

                {/* Broad, shifted peak */}
                <polyline
                  points={`100,80 120,75 140,65 160,55 180,50 200,55 220,65 240,75 260,80`}
                  fill="none" stroke="#ef4444" strokeWidth="2" />

                <text x="180" y="95" fill="#a78bfa" fontSize="8" textAnchor="middle">~250 ppm (keng)</text>
                <text x="150" y="15" fill="#c4b5fd" fontSize="8">paramagnit shift</text>
              </svg>
            </div>
            <p className="text-purple-300 text-[10px] mt-2 text-center">
              Keng, siljitilgan — paramagnit effekt
            </p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun bu muhim?</p>
          <p className="text-purple-200">
            K₄[Fe(CN)₆] diamagnit bo'lgani uchun:
            <br/>• ¹³C, ¹H, ¹⁵N, ³¹P NMR <strong>aniq va oson</strong> interpretatsiya qilinadi
            <br/>• 2D NMR (HSQC, HMBC) qilish mumkin
            <br/>• Ligand almashinish kinetikasi o'rganish uchun ideal
            <br/>• <strong>Evans usuli</strong> diamagnitlar uchun <strong>ishlamaydi</strong> (Δf = 0)
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 6. MÖSSBAUER SPEKTROSKOPIYASI
// ============================================================================
function MossbauerK4() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚛️ Mössbauer spektroskopiyasi — ⁵⁷Fe</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-yellow-700/30 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-purple-900/50 rounded-lg p-4 text-center">
            <p className="text-purple-400 text-xs mb-1">Isomer siljish (δ)</p>
            <p className="text-emerald-400 font-bold text-xl font-mono">−0.06 mm/s</p>
            <p className="text-purple-500 text-xs mt-1">vs α-Fe</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-4 text-center">
            <p className="text-purple-400 text-xs mb-1">Kvadrupol ajralish (ΔE<sub>Q</sub>)</p>
            <p className="text-yellow-400 font-bold text-xl font-mono">0.00 mm/s</p>
            <p className="text-purple-500 text-xs mt-1">singlet!</p>
          </div>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-emerald-400 font-bold text-xs mb-2">Mössbauer spektri (sxematik):</h5>
          <svg viewBox="0 0 400 150" className="w-full h-32">
            <line x1="40" y1="120" x2="360" y2="120" stroke="#4c1d95" strokeWidth="1" />
            <text x="200" y="140" fill="#c4b5fd" fontSize="9" textAnchor="middle">Tezlik (mm/s)</text>

            {/* Single sharp peak */}
            <polyline
              points={`180,120 190,110 195,60 200,20 205,60 210,110 220,120`}
              fill="none" stroke="#10b981" strokeWidth="2" />

            <text x="200" y="15" fill="#10b981" fontSize="9" textAnchor="middle">Singlet</text>
          </svg>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun singlet?</p>
          <p className="text-purple-200">
            K₄[Fe(CN)₆] da Fe²⁺ <strong>¹A<sub>1g</sub> ground state</strong>ga ega — sferik simmetrik.
            Shuning uchun <strong>elektr maydon gradienti (EFG) = 0</strong>, kvadrupol ajralish yo'q.
            Bu <strong>ideal oktaedrik simmetriya</strong>ning aniq belgisi.
          </p>
        </div>

        <div className="bg-purple-900/50 rounded-lg p-4">
          <h5 className="text-emerald-400 font-bold text-xs mb-2">K₃[Fe(CN)₆] bilan solishtirish:</h5>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-purple-700/50">
                  <th className="text-left py-1 text-yellow-400">Xususiyat</th>
                  <th className="text-center py-1 text-yellow-400">K₄[Fe(CN)₆]</th>
                  <th className="text-center py-1 text-yellow-400">K₃[Fe(CN)₆]</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                <tr><td>δ (mm/s)</td><td className="text-center">−0.06</td><td className="text-center">−0.12</td></tr>
                <tr><td>ΔE<sub>Q</sub></td><td className="text-center">0.00</td><td className="text-center">0.38</td></tr>
                <tr><td>Spektr turi</td><td className="text-center">Singlet</td><td className="text-center">Dublet</td></tr>
                <tr><td>EFG</td><td className="text-center">= 0</td><td className="text-center">≠ 0</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 7. ELEKTROKIMYO
// ============================================================================
function ElectrochemistryK4() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚡ Elektrokimyoviy xususiyatlar</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-yellow-700/30 space-y-4">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-purple-900/50 rounded-lg p-4">
            <p className="text-purple-400 text-xs">E° ([Fe(CN)₆]³⁻/⁴⁻)</p>
            <p className="text-emerald-400 font-bold font-mono text-lg">+0.358 V</p>
            <p className="text-purple-500 text-[10px]">vs SHE</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-4">
            <p className="text-purple-400 text-xs">Reversivlik</p>
            <p className="text-yellow-400 font-bold text-lg">Ideal</p>
            <p className="text-purple-500 text-[10px]">ΔE<sub>p</sub> ≈ 60 mV</p>
          </div>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-yellow-400 font-bold text-xs mb-2">Siklik voltammogramma (sxematik):</h5>
          <svg viewBox="0 0 400 200" className="w-full h-40">
            <line x1="50" y1="100" x2="350" y2="100" stroke="#4c1d95" strokeWidth="1" />
            <line x1="50" y1="20" x2="50" y2="180" stroke="#4c1d95" strokeWidth="1" />
            <text x="200" y="195" fill="#c4b5fd" fontSize="9" textAnchor="middle">E (V)</text>
            <text x="30" y="100" fill="#c4b5fd" fontSize="8" transform="rotate(-90, 30, 100)">I (μA)</text>

            {/* CV curve */}
            <polyline
              points={`50,100 80,100 100,100 120,80 140,30 160,20 180,30 200,80 220,100 240,100 260,120 280,170 300,180 320,170 340,120 350,100`}
              fill="none" stroke="#eab308" strokeWidth="2" />

            {/* Oxidation peak */}
            <line x1="160" y1="20" x2="160" y2="195" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x="160" y="192" fill="#ef4444" fontSize="8" textAnchor="middle">+0.39 V</text>

            {/* Reduction peak */}
            <line x1="300" y1="180" x2="300" y2="20" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x="300" y="192" fill="#3b82f6" fontSize="8" textAnchor="middle">+0.33 V</text>

            <text x="200" y="15" fill="#eab308" fontSize="8" textAnchor="middle">ΔEp = 60 mV</text>
          </svg>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Elektrokimyoviy standart:</p>
          <p className="text-purple-200">
            [Fe(CN)₆]³⁻/⁴⁻ jufti <strong>elektrokimyoviy standart</strong> sifatida keng ishlatiladi.
            Sabablari:
            <br/>• <strong>Tez kinetika</strong> (outer-sphere electron transfer)
            <br/>• <strong>Yuqori reversivlik</strong> (ΔEp ≈ 60 mV, ideal)
            <br/>• <strong>Past reorganizatsiya energiyasi</strong> (λ ≈ 0.5 eV)
            <br/>• <strong>Kimyoviy barqarorlik</strong> (ikkala holatda ham)
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 8. SOLISHTIRISH JADVALI (K₃ vs K₄)
// ============================================================================
function SolishtirishJadvali() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 K₃[Fe(CN)₆] vs K₄[Fe(CN)₆] — mukammal kontrast</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-yellow-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-3 text-yellow-400">Xususiyat</th>
                <th className="text-left py-3 px-3 text-red-400">K₃[Fe(CN)₆]</th>
                <th className="text-left py-3 px-3 text-yellow-400">K₄[Fe(CN)₆]</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["Fe oksidlanish", "+3", "+2"],
                ["Elektron konfiguratsiya", "d⁵", "d⁶"],
                ["Kristall maydon", "t₂g⁵", "t₂g⁶"],
                ["Spin (S)", "1/2", "0"],
                ["Toq elektron (n)", "1", "0"],
                ["Magnit holat", "Paramagnit", "Diamagnit"],
                ["μ_eff", "~2.3 μB", "0 μB"],
                ["Rang", "To'q qizil", "Sariq"],
                ["Ground state", "²T₂g", "¹A₁g"],
                ["Δo (cm⁻¹)", "35000", "33800"],
                ["Mössbauer δ", "−0.12 mm/s", "−0.06 mm/s"],
                ["Mössbauer ΔEQ", "0.38 mm/s", "0.00 mm/s"],
                ["EPR signali", "Bor (g=2.76,2.20,2.00)", "Yo'q"],
                ["NMR spektri", "Keng, siljitilgan", "Aniq, tor"],
                ["Simmetriya", "Past (buzilgan)", "Yuqori (Oh)"],
                ["Barqarorlik", "O'rtacha", "Yuqori"],
              ].map((r, i) => (
                <tr key={i} className="border-b border-purple-800/30">
                  <td className="py-2 px-3 font-bold text-purple-300">{r[0]}</td>
                  <td className="py-2 px-3 text-red-400">{r[1]}</td>
                  <td className="py-2 px-3 text-yellow-400">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-purple-400 text-xs mt-3">
          * Bu ikki birikma — kompleks birikmalar kimyosida eng ko'p o'rganiladigan juftlik.
          Bitta metall (Fe), bitta ligand (CN⁻), faqat oksidlanish darajasi farqli — lekin
          xossalar <strong>keskin farq qiladi</strong>!
        </p>
      </div>
    </div>
  )
}

// ============================================================================
// 9. TARIXIY KONTEKST
// ============================================================================
function TarixiyKontekst() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📜 Tarixiy kontekst</h3>

      <div className="bg-gradient-to-br from-yellow-900/30 to-purple-900/30 rounded-xl p-5 border border-yellow-500/30 space-y-4">
        <div className="space-y-3">
          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🏛️</div>
              <div>
                <p className="text-yellow-400 font-bold">1752 — birinchi sintez</p>
                <p className="text-purple-200 text-xs mt-1">
                  Pierre-Joseph Macquer tomonidan Prussian Blue (K₄[Fe(CN)₆] ning oldingi shakli)
                  va KOH aralashmasidan olingan.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">⚗️</div>
              <div>
                <p className="text-yellow-400 font-bold">1822 — Leopold Gmelin</p>
                <p className="text-purple-200 text-xs mt-1">
                  K₄[Fe(CN)₆] ni toza holda sintez qildi va "sariq qon tuzi" deb nomladi.
                  Sababi: hayvon qonidan olingan.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🔬</div>
              <div>
                <p className="text-yellow-400 font-bold">1893 — Alfred Werner</p>
                <p className="text-purple-200 text-xs mt-1">
                  Koordinatsion nazariyani yaratishda K₄[Fe(CN)₆] va K₃[Fe(CN)₆]
                  asosiy namunalar bo'ldi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🏆</div>
              <div>
                <p className="text-yellow-400 font-bold">1913 — Nobel mukofoti</p>
                <p className="text-purple-200 text-xs mt-1">
                  Werner koordinatsion kimyo bo'yicha Nobel mukofotini oldi.
                  K₄[Fe(CN)₆] bu kashfiyotning asosiy dalillaridan biri edi.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun "qon tuzi"?</p>
          <p className="text-purple-200">
            Dastlabki sintezlarda hayvon qoni (gemoglobin tarkibidagi temir) ishlatilgan.
            "Qizil" (K₃) va "sariq" (K₄) versiyalar — ikkalasi ham qondan olinganligi uchun
            "qon tuzi" deb nomlangan.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 10. AMALIY QO'LLANILISH
// ============================================================================
function AmaliyQollanilish() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🏭 Amaliy qo'llanilishi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-yellow-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🎨</div>
            <h4 className="text-yellow-400 font-bold mb-2">Prussian Blue sintezi</h4>
            <p className="text-purple-200 text-xs">
              K₄[Fe(CN)₆] + Fe³⁺ → Fe₄[Fe(CN)₆]₃ (Prussian Blue)
              <br/>• Rassomlik bo'yoqlari
              <br/>• Ko'k siyoh
              <br/>• Arxitektura
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🔬</div>
            <h4 className="text-yellow-400 font-bold mb-2">Analitik kimyo</h4>
            <p className="text-purple-200 text-xs">
              Fe³⁺ ni aniqlash uchun reagent:
              <br/>• Fe³⁺ + [Fe(CN)₆]⁴⁻ → ko'k cho'kma
              <br/>• Sifat reaksiyasi
              <br/>• Spektrofotometriya
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">💊</div>
            <h4 className="text-yellow-400 font-bold mb-2">Tibbiyot</h4>
            <p className="text-purple-200 text-xs">
              Radiocesium (¹³⁷Cs) va talliy zaharlanishida:
              <br/>• Prussian Blue sorbent sifatida
              <br/>• Organizmdan og'ir metallarni chiqarish
              <br/>• FDA tasdiqlagan
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🔋</div>
            <h4 className="text-yellow-400 font-bold mb-2">Elektrokimyo</h4>
            <p className="text-purple-200 text-xs">
              Standart redoks juft sifatida:
              <br/>• Elektrod kalibratsiyasi
              <br/>• Sensorlar
              <br/>• Energiya saqlash (Prussian Blue analoglari)
            </p>
          </div>
        </div>

        <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-lg p-4">
          <p className="text-emerald-400 font-bold mb-2">🌟 Hozirgi ilmiy tadqiqotlar:</p>
          <ul className="text-purple-200 text-xs space-y-1">
            <li>• <strong>Suvni tozalash</strong> — Prussian Blue analoglari (Cs⁺, Rb⁺ adsorbsiyasi)</li>
            <li>• <strong>Batareyalar</strong> — Na-ion akkumulyatorlar (katod materiali)</li>
            <li>• <strong>Sensorlar</strong> — H₂O₂, glukoza, biomarkerlar aniqlash</li>
            <li>• <strong>Fotokataliz</strong> — suv parchalash, CO₂ qaytarish</li>
            <li>• <strong>Molekulyar magnitlar</strong> — SMM, informatsiya saqlash</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 11. LMCT VA RANG
// ============================================================================
function LMCTRang() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🌈 Rang sababi — LMCT</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-yellow-700/30 space-y-4">
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <h4 className="text-yellow-400 font-bold mb-2">K₄[Fe(CN)₆] — sariq rang</h4>
          <p className="text-purple-200 text-xs">
            Sariq rang sababi: <strong className="text-yellow-400">LMCT</strong> (Ligand-to-Metal Charge Transfer)
            o'tishlari ~400 nm da (binafsha-ko'k) yutilish → komplementar sariq rang.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h5 className="text-yellow-400 font-bold text-sm mb-3">MO diagramma:</h5>
            <div className="font-mono text-xs text-purple-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-purple-400">σ* (e<sub>g</sub>)</span>
                <span>— — —</span>
                <span className="text-purple-400">bo'sh</span>
              </div>
              <div className="border-t border-purple-700/30 pt-2 flex justify-between items-center">
                <span className="text-emerald-400">t₂g</span>
                <span>— ↑↓ ↑↓ ↑↓ —</span>
                <span className="text-emerald-400">6 e⁻ (LS)</span>
              </div>
              <div className="border-t border-purple-700/30 pt-2 flex justify-between items-center">
                <span className="text-blue-400">π* (CN⁻)</span>
                <span>— — — —</span>
                <span className="text-blue-400">to'lgan</span>
              </div>
            </div>
            <p className="text-purple-400 text-[10px] mt-3 text-center">
              π*(CN⁻) → t₂g(Fe²⁺) — <strong>LMCT</strong>
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h5 className="text-yellow-400 font-bold text-sm mb-3">UV-Vis spektri:</h5>
            <svg viewBox="0 0 300 150" className="w-full h-32">
              <line x1="40" y1="120" x2="280" y2="120" stroke="#4c1d95" strokeWidth="1" />
              <line x1="40" y1="20" x2="40" y2="120" stroke="#4c1d95" strokeWidth="1" />

              {/* Absorption peak at 400 nm */}
              <polyline
                points={`80,120 90,118 100,115 110,100 120,60 130,30 140,60 150,100 160,115 170,118 180,120 280,120`}
                fill="none" stroke="#eab308" strokeWidth="2" />

              <text x="130" y="25" fill="#eab308" fontSize="9" textAnchor="middle">λ = 400 nm</text>
              <text x="160" y="140" fill="#c4b5fd" fontSize="9" textAnchor="middle">λ (nm)</text>
              <text x="15" y="70" fill="#c4b5fd" fontSize="8" transform="rotate(-90, 15, 70)">A</text>
            </svg>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 K₃[Fe(CN)₆] bilan farq:</p>
          <p className="text-purple-200">
            <strong>K₃[Fe(CN)₆]</strong> (Fe³⁺) — <strong className="text-red-400">qizil</strong>, chunki LMCT 420 nm da<br/>
            <strong>K₄[Fe(CN)₆]</strong> (Fe²⁺) — <strong className="text-yellow-400">sariq</strong>, chunki LMCT 400 nm da<br/>
            Fe²⁺ past oksidlanganligi uchun LMCT yuqori energiyada (qisqa λ) bo'ladi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function K4FeCN6Magnit() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">

      <header className="flex flex-col gap-2 px-6 py-4 border-b border-purple-800/50">
        <nav className="flex items-center gap-2 text-sm flex-wrap" aria-label="Breadcrumb">
          <Link href="/" className="text-purple-400 hover:text-purple-300">🏠</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil" className="text-purple-400 hover:text-purple-300">Tahlil</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil/magnit" className="text-purple-400 hover:text-purple-300">Magnit</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil/magnit/birikmalar" className="text-purple-400 hover:text-purple-300">Birikmalar</Link>
          <span className="text-purple-600">›</span>
          <span className="text-yellow-400">K₄[Fe(CN)₆]</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">🧲 K₄[Fe(CN)₆] — Magnit tahlili</h1>
          <p className="text-purple-400 text-sm">
            Fe²⁺ (LS, d⁶, t₂g⁶) • S=0 • Diamagnit • μ<sub>eff</sub> = 0 μ<sub>B</sub> • ¹A<sub>1g</sub> ground state
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-yellow-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-4xl md:text-5xl font-extrabold font-mono text-yellow-400">K₄[Fe(CN)₆]</span>
            <div>
              <h2 className="text-xl font-bold text-white">Magnit tahlili — to'liq profil</h2>
              <p className="text-purple-400">"Sariq qon tuzi" — klassik diamagnit kompleks</p>
            </div>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              K₄[Fe(CN)₆] — <strong className="text-yellow-400">mukammal diamagnit</strong> kompleks.
              Kuchli maydon ligandlari (CN⁻) tufayli <strong>t₂g⁶ konfiguratsiya</strong> hosil bo'ladi —
              barcha 6 ta elektron juftlashgan. <strong>S = 0</strong>, ya'ni hech qanday toq elektron yo'q.
              Bu K₃[Fe(CN)₆] (paramagnit) ning <strong>mukammal kontrast namunasi</strong> hisoblanadi.
              μ<sub>eff</sub> = 0 — magnit tahlil uchun ideal "bo'sh namuna" (blank).
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-yellow-400 font-bold text-lg">S = 0</p>
              <p className="text-purple-300">LS, t₂g⁶</p>
              <p className="text-purple-400 mt-1">Diamagnit</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-yellow-400 font-bold text-lg">μ = 0 μ<sub>B</sub></p>
              <p className="text-purple-300">n = 0</p>
              <p className="text-purple-400 mt-1">spin-only = 0</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-yellow-400 font-bold text-lg">Δ<sub>o</sub> = 33800 cm⁻¹</p>
              <p className="text-purple-300">kuchli maydon</p>
              <p className="text-purple-400 mt-1">P &lt; Δ<sub>o</sub></p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-yellow-400 font-bold text-lg">¹A<sub>1g</sub></p>
              <p className="text-purple-300">ground state</p>
              <p className="text-purple-400 mt-1">sferik simmetrik</p>
            </div>
          </div>
        </div>

        {/* NAZARIY ASOS */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">📚 Nazariy asoslar</h2>

          <div className="space-y-4 text-sm text-purple-200">
            <div className="bg-purple-950/50 rounded-lg p-4">
              <h4 className="text-yellow-400 font-bold mb-2">1. Diamagnetizmning kelib chiqishi</h4>
              <p className="mb-2">Diamagnetizm — barcha moddalarda mavjud, lekin ko'pincha kuchliroq effektlar (paramagnetizm) bilan yashiriladi:</p>
              <div className="bg-purple-900/40 rounded p-3 font-mono text-xs">
                <p>χ<sub>dia</sub> &lt; 0 (har doim manfiy)</p>
                <p className="text-purple-400 mt-1">Sababi: tashqi magnit maydoni elektron orbitallarni o'zgartiradi → qarama-qarshi maydon hosil qiladi (Lenz qonuni)</p>
              </div>
            </div>

            <div className="bg-purple-950/50 rounded-lg p-4">
              <h4 className="text-yellow-400 font-bold mb-2">2. Nima uchun K₄[Fe(CN)₆] diamagnit?</h4>
              <p className="mb-2">Quyidagi 4 ta sabab birlashadi:</p>
              <ul className="text-xs space-y-1 ml-4">
                <li>1. <strong>Kuchli ligand</strong> (CN⁻) → Δ<sub>o</sub> &gt; P</li>
                <li>2. <strong>Quyi spin</strong> holat → barcha elektronlar t₂g da</li>
                <li>3. <strong>To'liq to'lgan t₂g⁶</strong> → S = 0</li>
                <li>4. <strong>¹A<sub>1g</sub> ground state</strong> → orbital moment yo'q (sferik simmetrik)</li>
              </ul>
            </div>

            <div className="bg-purple-950/50 rounded-lg p-4">
              <h4 className="text-yellow-400 font-bold mb-2">3. Faraday kuchi (diamagnit uchun)</h4>
              <p>
                <strong>F = χ<sub>g</sub> · m · H · (dH/dz)</strong>
              </p>
              <p className="mt-2 text-xs">
                K₄[Fe(CN)₆] uchun χ<sub>g</sub> = −13.2 × 10⁻⁶ emu/g → <strong>manfiy kuch</strong>,
                ya'ni namuna magnit maydonidan <strong>itariladi</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* INTERAKTIV KOMPONENTLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <SpinOnlyCalc />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <DiamagnetismSimulator />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <PascalCalculator />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <CrystalFieldK4 />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <NMRDiamagnit />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <MossbauerK4 />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <ElectrochemistryK4 />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <LMCTRang />
        </div>

        {/* SOLISHTIRISH JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <SolishtirishJadvali />
        </div>

        {/* TARIX */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <TarixiyKontekst />
        </div>

        {/* AMALIYOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <AmaliyQollanilish />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-yellow-600/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>K₄[Fe(CN)₆] — <strong className="text-yellow-400">mukammal diamagnit</strong>, barcha elektronlar juftlashgan</li>
            <li>Fe²⁺ (LS, t₂g⁶), <strong>S = 0</strong>, toq elektron yo'q</li>
            <li>μ<sub>eff</sub> = <strong>0 μ<sub>B</sub></strong> — spin-only bilan ideal mos</li>
            <li>Gouy/Faraday usulida magnit maydonidan <strong>itariladi</strong> (χ &lt; 0)</li>
            <li>¹A<sub>1g</sub> ground state — <strong>sferik simmetrik</strong>, orbital moment yo'q</li>
            <li>Mössbauer: <strong>singlet</strong>, δ = −0.06 mm/s, ΔE<sub>Q</sub> = 0.00 mm/s</li>
            <li>NMR: <strong>aniq va tor cho'qqilar</strong> — diamagnit afzalligi</li>
            <li>Δ<sub>o</sub> = 33800 cm⁻¹ — CN⁻ eng kuchli ligand</li>
            <li>Elektrokimyoviy standart (E° = +0.358 V)</li>
            <li>K₃[Fe(CN)₆] bilan <strong>mukammal kontrast</strong> — bitta metall, bitta ligand, faqat oksidlanish darajasi farq</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/magnit/birikmalar/k3-fe-cn6" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← K₃[Fe(CN)₆] (paramagnit)
          </Link>
          <Link href="/ilmiy/tahlil/magnit/birikmalar/co-nh3-6-cl3" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold">
            [Co(NH₃)₆]Cl₃ →
          </Link>
        </div>

      </section>
    </main>
  )
}