"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. SPIN-ONLY KALKULYATORI (Fe²⁺ d⁶ LS)
// ============================================================================
function SpinOnlyCalc() {
  const [n, setN] = useState(0)
  const mu_so = Math.sqrt(n * (n + 2))

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🧮 Spin-only magnit momenti</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-amber-700/30 space-y-4">
        <div className="bg-purple-950/50 rounded-lg p-4 font-mono text-center">
          <p className="text-purple-400 text-xs mb-2">Formula:</p>
          <p className="text-yellow-400 text-xl">μ<sub>so</sub> = √[n(n+2)] μ<sub>B</sub></p>
        </div>

        <div>
          <label className="flex justify-between text-xs mb-2">
            <span className="text-yellow-400 font-bold">Toq elektronlar soni (n):</span>
            <span className="text-emerald-400 font-mono text-lg">{n}</span>
          </label>
          <input type="range" min="0" max="7" step="1" value={n}
            onChange={(e) => setN(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded-lg appearance-none cursor-pointer accent-amber-500" />
          <div className="flex justify-between text-[10px] text-purple-400 mt-1">
            <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-center">
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Hisoblash</p>
            <p className="text-purple-200 font-mono">√({n}·{n + 2})</p>
          </div>
          <div className="bg-amber-900/40 border border-amber-500/40 rounded-lg p-3">
            <p className="text-amber-400">Natija</p>
            <p className="text-emerald-400 font-bold font-mono text-lg">{mu_so.toFixed(3)} μ<sub>B</sub></p>
          </div>
        </div>

        <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-lg p-3 text-xs">
          <p className="text-emerald-400 font-bold mb-1">✅ Ferrosen uchun:</p>
          <p className="text-purple-200">
            Fe²⁺ (d⁶) <strong>sandwich strukturasida</strong> barcha 6 ta elektron to'liq juftlashgan.
            <strong> 18 elektronli qoida</strong> bajariladi → <strong>n = 0</strong>, S = 0.
            μ<sub>eff</sub> = <strong>0 μ<sub>B</sub></strong> — <strong>diamagnit</strong>.
            Bu ferrosenning <strong>alohida barqarorligi</strong>ning yana bir isboti.
          </p>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun ferrosen diamagnit, FeCl₂ esa paramagnit?</p>
          <p className="text-purple-200">
            FeCl₂ — ionli birikma, <strong>oktaedrik</strong> (HS), n=4, μ=5.0 μ<sub>B</sub>.
            Ferrosen — <strong>sandwich</strong> strukturasi, kuchli ligand maydon (Cp⁻), quyi spin,
            barcha elektronlar juftlashgan. Bir xil Fe²⁺, lekin butunlay boshqa xossa!
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. SANDWICH STRUKTURASI — ECLIPSED VS STAGGERED
// ============================================================================
function SandwichStruktura() {
  const [konf, setKonf] = useState("staggered")
  const [rotate, setRotate] = useState(0)

  const konflar = {
    eclipsed: {
      name: "Eclipsed (D₅h)",
      angle: 0,
      energy: "+4 kJ/mol",
      izoh: "Yuqori energiya, kam uchraydi"
    },
    staggered: {
      name: "Staggered (D₅d)",
      angle: 36,
      energy: "Eng past",
      izoh: "Kristallda asosiy konformatsiya"
    }
  }

  const k = konflar[konf]
  const effectiveAngle = konf === "eclipsed" ? rotate : 36 + rotate

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🥪 Sandwich strukturasi — ikki siklopentadienil halqa</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-amber-700/30 space-y-4">
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">💎 Noyob struktura:</p>
          <p className="text-purple-200 text-xs">
            Ferrosen — <strong>birinchi sandwich birikma</strong>. Fe²⁺ ikkita parallel
            <strong> siklopentadienil (Cp⁻, C₅H₅⁻)</strong> halqasi orasida joylashgan.
            Barcha 5 ta C atomi Fe ga <strong>η⁵-koordinatsiyada</strong> bog'langan.
            Bu <strong>metallocene</strong> oilasining asoschisi.
          </p>
        </div>

        {/* KONFORMATSIYA TANLASH */}
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(konflar).map(([key, val]) => (
            <button key={key} onClick={() => setKonf(key)}
              className={`px-4 py-3 rounded-xl transition-all ${
                konf === key
                  ? "bg-gradient-to-r from-amber-600/80 to-orange-600/80 text-white shadow-lg"
                  : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
              }`}>
              <div className="text-sm font-bold mb-1">{val.name}</div>
              <div className="text-[10px] opacity-80">{val.energy}</div>
            </button>
          ))}
        </div>

        {/* SVG VIZUALIZATSIYA */}
        <div className="bg-purple-950/50 rounded-xl p-5">
          <h4 className="text-amber-400 font-bold mb-3 text-center">
            {k.name} — tepadan ko'rinish
          </h4>

          <svg viewBox="0 0 400 300" className="w-full h-72">
            {/* Yuqori Cp halqasi */}
            <circle cx="200" cy="150" r="90" fill="none" stroke="#f59e0b" strokeWidth="2" opacity="0.4" />
            {Array.from({ length: 5 }).map((_, i) => {
              const angle = (i * 72 - 90) * Math.PI / 180
              const x = 200 + 90 * Math.cos(angle)
              const y = 150 + 90 * Math.sin(angle)
              return (
                <g key={`top-${i}`}>
                  <circle cx={x} cy={y} r="12" fill="#f59e0b" opacity="0.9" />
                  <text x={x} y={y + 4} fill="white" fontSize="11" textAnchor="middle" fontWeight="bold">C</text>
                </g>
              )
            })}

            {/* Pastki Cp halqasi (aylanuvchi) */}
            <circle cx="200" cy="150" r="70" fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.4" strokeDasharray="3,3" />
            {Array.from({ length: 5 }).map((_, i) => {
              const angle = (i * 72 - 90 + effectiveAngle) * Math.PI / 180
              const x = 200 + 70 * Math.cos(angle)
              const y = 150 + 70 * Math.sin(angle)
              return (
                <g key={`bottom-${i}`}>
                  <circle cx={x} cy={y} r="10" fill="#3b82f6" opacity="0.9" />
                  <text x={x} y={y + 4} fill="white" fontSize="9" textAnchor="middle" fontWeight="bold">C</text>
                </g>
              )
            })}

            {/* Markaziy Fe */}
            <circle cx="200" cy="150" r="18" fill="#ec4899" />
            <text x="200" y="156" fill="white" fontSize="14" textAnchor="middle" fontWeight="bold">Fe²⁺</text>

            {/* Labels */}
            <text x="355" y="50" fill="#f59e0b" fontSize="10" fontWeight="bold">Cp (yuqori)</text>
            <text x="355" y="260" fill="#3b82f6" fontSize="10" fontWeight="bold">Cp (pastki)</text>

            {/* Burchak ko'rsatkichi */}
            <text x="200" y="290" fill="#c4b5fd" fontSize="11" textAnchor="middle">
              Halqalar orasidagi burchak: {effectiveAngle.toFixed(0)}°
            </text>
          </svg>
        </div>

        {/* AYLANISH SLIDERI */}
        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">Pastki halqani aylantirish:</span>
            <span className="text-emerald-400 font-mono">{rotate}°</span>
          </label>
          <input type="range" min="0" max="360" step="1" value={rotate}
            onChange={(e) => setRotate(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-amber-500" />
          <div className="flex justify-between text-[10px] text-purple-400 mt-1">
            <span>0°</span><span>36° (staggered)</span><span>72°</span><span>360°</span>
          </div>
        </div>

        {/* ENERGETIK TAQQOSLASH */}
        <div className="grid grid-cols-2 gap-3 text-xs text-center">
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Fe−C bog' uzunligi</p>
            <p className="text-amber-400 font-bold font-mono">2.04 Å</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">C−C (Cp ichida)</p>
            <p className="text-amber-400 font-bold font-mono">1.40 Å</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Halqalar orasi</p>
            <p className="text-amber-400 font-bold font-mono">3.32 Å</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Simmetriya</p>
            <p className="text-amber-400 font-bold">D₅d (staggered)</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun staggered afzal?</p>
          <p className="text-purple-200">
            <strong>Eclipsed</strong> holatda halqalar orasidagi <strong>sterik to'qnashuv</strong> yuqori.
            <strong> Staggered</strong> holatda bu minimal. Farq atigi <strong>~4 kJ/mol</strong> —
            bu juda kichik, shuning uchun gaz fazida ferrosen <strong>erkin aylanadi</strong>
            (rotation barrier past). Kristallda esa staggered afzal.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. 18 ELEKTRON QOIDASI — MO DIAGRAMMA
// ============================================================================
function MO18Elektron() {
  const [showAll, setShowAll] = useState(true)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔬 Molekulyar orbitallar — 18 elektron qoidasi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-amber-700/30 space-y-4">
        <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-lg p-4">
          <p className="text-emerald-400 font-bold mb-2">✨ 18 elektronli qoida bajariladi!</p>
          <p className="text-purple-200 text-xs">
            Ferrosen — <strong>klassik 18 elektronli kompleks</strong>.
            Fe²⁺: 6 e⁻ + 2 × Cp⁻ (har biri 6 e⁻): 12 e⁻ = <strong>18 e⁻</strong>.
            Barcha bog'lovchi va non-bonding MO lar to'lgan → <strong>alohida barqarorlik</strong>.
          </p>
        </div>

        <div className="flex gap-2 mb-2">
          <button onClick={() => setShowAll(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${showAll ? 'bg-amber-600/80 text-white' : 'bg-purple-800/40 text-purple-300'}`}>
            To'liq MO
          </button>
          <button onClick={() => setShowAll(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${!showAll ? 'bg-amber-600/80 text-white' : 'bg-purple-800/40 text-purple-300'}`}>
            Soddalashtirilgan
          </button>
        </div>

        {/* MO DIAGRAMMA */}
        <div className="bg-purple-950/50 rounded-xl p-5">
          <div className="font-mono text-xs space-y-1">
            {/* Antibonding - bo'sh */}
            <div className="text-center text-purple-500 text-[10px] mb-2">ANTIBONDING (bo'sh)</div>
            {showAll && (
              <>
                <div className="flex justify-between items-center border-b border-purple-800/30 pb-1">
                  <span className="text-red-400 w-20">e<sub>1g</sub>*</span>
                  <div className="flex gap-2">
                    <span className="text-purple-500">__</span>
                    <span className="text-purple-500">__</span>
                  </div>
                  <span className="text-purple-500">bo'sh</span>
                </div>
                <div className="flex justify-between items-center border-b border-purple-800/30 pb-1">
                  <span className="text-red-400 w-20">e<sub>2g</sub>*</span>
                  <div className="flex gap-2">
                    <span className="text-purple-500">__</span>
                    <span className="text-purple-500">__</span>
                  </div>
                  <span className="text-purple-500">bo'sh</span>
                </div>
              </>
            )}

            {/* HOMO */}
            <div className="flex justify-between items-center border-b-2 border-amber-500/50 pb-1 pt-2">
              <span className="text-amber-400 w-20 font-bold">e<sub>2g</sub> (HOMO)</span>
              <div className="flex gap-2">
                <span className="text-yellow-400">↑↓</span>
                <span className="text-yellow-400">↑↓</span>
              </div>
              <span className="text-amber-400">4 e⁻</span>
            </div>

            {/* Non-bonding */}
            <div className="flex justify-between items-center border-b border-purple-800/30 pb-1 pt-1">
              <span className="text-emerald-400 w-20">a<sub>1g</sub></span>
              <div className="flex gap-2">
                <span className="text-yellow-400">↑↓</span>
              </div>
              <span className="text-emerald-400">2 e⁻</span>
            </div>

            <div className="flex justify-between items-center border-b border-purple-800/30 pb-1 pt-1">
              <span className="text-emerald-400 w-20">e<sub>1g</sub></span>
              <div className="flex gap-2">
                <span className="text-yellow-400">↑↓</span>
                <span className="text-yellow-400">↑↓</span>
              </div>
              <span className="text-emerald-400">4 e⁻</span>
            </div>

            {showAll && (
              <>
                <div className="flex justify-between items-center border-b border-purple-800/30 pb-1 pt-1">
                  <span className="text-blue-400 w-20">a<sub>1g</sub>'</span>
                  <div className="flex gap-2">
                    <span className="text-yellow-400">↑↓</span>
                  </div>
                  <span className="text-blue-400">2 e⁻</span>
                </div>
                <div className="flex justify-between items-center border-b border-purple-800/30 pb-1 pt-1">
                  <span className="text-blue-400 w-20">e<sub>1u</sub></span>
                  <div className="flex gap-2">
                    <span className="text-yellow-400">↑↓</span>
                    <span className="text-yellow-400">↑↓</span>
                  </div>
                  <span className="text-blue-400">4 e⁻</span>
                </div>
                <div className="flex justify-between items-center pb-1 pt-1">
                  <span className="text-blue-400 w-20">a<sub>1u</sub></span>
                  <div className="flex gap-2">
                    <span className="text-yellow-400">↑↓</span>
                  </div>
                  <span className="text-blue-400">2 e⁻</span>
                </div>
              </>
            )}
          </div>

          <div className="mt-4 bg-purple-900/40 rounded p-3 text-center">
            <p className="text-purple-300 text-xs">
              <span className="text-amber-400 font-bold">Jami elektronlar:</span>{" "}
              {showAll ? "2+4+2+4+2+4+2 = " : "2+4+4 = "}
              <span className="text-emerald-400 font-bold text-lg">18 e⁻</span>
            </p>
            <p className="text-purple-400 text-[10px] mt-1">
              HOMO-LUMO farqi: ~3.5 eV → ferrosen <strong>barqaror va oksidlanishga moyil</strong>
            </p>
          </div>
        </div>

        {/* 18 ELEKTRON HISOB */}
        <div className="bg-amber-900/30 border border-amber-500/30 rounded-lg p-4">
          <h5 className="text-amber-400 font-bold text-xs mb-2">18 elektron qoidasi hisobi:</h5>
          <div className="font-mono text-xs space-y-1 text-purple-200">
            <p>Fe²⁺ (d⁶): <span className="text-amber-400 font-bold">6 elektron</span></p>
            <p>Cp⁻ (C₅H₅⁻): 6 π-elektron × 2 = <span className="text-amber-400 font-bold">12 elektron</span></p>
            <p className="pt-2 border-t border-purple-700/50">
              Jami: <span className="text-emerald-400 font-bold">18 elektron</span> ✓
            </p>
            <p className="text-purple-400 text-[10px] mt-2">
              * 18 e⁻ = inert gaz (Kr) elektron konfiguratsiyasi → alohida barqarorlik
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-center">
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-purple-400">HOMO</p>
            <p className="text-amber-400 font-bold">e<sub>2g</sub> (d<sub>xy</sub>, d<sub>x²-y²</sub>)</p>
          </div>
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-purple-400">LUMO</p>
            <p className="text-red-400 font-bold">e<sub>1g</sub>*</p>
          </div>
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-purple-400">HOMO-LUMO</p>
            <p className="text-yellow-400 font-bold">~3.5 eV</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. ELEKTROKIMYO — FERROSEN/FERROSENIUM STANDART
// ============================================================================
function Elektrokimyo() {
  const [E, setE] = useState(0.4) // V vs SHE

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚡ Elektrokimyo — Fc/Fc⁻ standart redoks jufti</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-amber-700/30 space-y-4">
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">🏆 Fc/Fc⁺ — elektrokimyoning "oltin standarti"</p>
          <p className="text-purple-200 text-xs">
            Ferrosen (Fc) bir elektronli, <strong>yuqori reversiv</strong> oksidlanish ko'rsatadi →
            ferrosenium (Fc⁺). IUPAC buni <strong>ichki standart</strong> sifatida tavsiya qilgan
            (organik erituvchilarda). E° ≈ +0.40 V vs SHE (suvda).
          </p>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-amber-400 font-bold text-xs mb-2">Siklik voltammogramma (sxematik):</h5>
          <svg viewBox="0 0 400 200" className="w-full h-44">
            <line x1="50" y1="100" x2="350" y2="100" stroke="#4c1d95" strokeWidth="1" />
            <line x1="50" y1="20" x2="50" y2="180" stroke="#4c1d95" strokeWidth="1" />
            <text x="200" y="195" fill="#c4b5fd" fontSize="9" textAnchor="middle">E (V vs SHE)</text>
            <text x="30" y="100" fill="#c4b5fd" fontSize="8" transform="rotate(-90, 30, 100)">I (μA)</text>

            {/* Ideal CV - reversiv */}
            <polyline
              points={`50,100 80,100 100,100 120,95 140,60 155,25 170,60 185,95 200,100 220,100 240,100 260,105 280,140 295,175 310,140 325,105 350,100`}
              fill="none" stroke="#f59e0b" strokeWidth="2" />

            {/* Oxidation peak */}
            <line x1="155" y1="25" x2="155" y2="195" stroke="#10b981" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x="155" y="192" fill="#10b981" fontSize="8" textAnchor="middle">E_pa = 0.43 V</text>

            {/* Reduction peak */}
            <line x1="295" y1="175" x2="295" y2="20" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x="295" y="192" fill="#3b82f6" fontSize="8" textAnchor="middle">E_pc = 0.37 V</text>

            <text x="200" y="15" fill="#f59e0b" fontSize="9" textAnchor="middle" fontWeight="bold">
              ΔEp = 60 mV (ideal reversiv!)
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-purple-400">E° (Fc/Fc⁺)</p>
            <p className="text-amber-400 font-bold font-mono">+0.40 V</p>
            <p className="text-purple-500 text-[10px]">vs SHE</p>
          </div>
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-purple-400">ΔE<sub>p</sub></p>
            <p className="text-emerald-400 font-bold font-mono">60 mV</p>
            <p className="text-purple-500 text-[10px]">bir elektronli</p>
          </div>
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-purple-400">Reversivlik</p>
            <p className="text-emerald-400 font-bold">Ideal</p>
            <p className="text-purple-500 text-[10px]">1000+ marta</p>
          </div>
        </div>

        {/* Oksidlanish reaksiyasi */}
        <div className="bg-purple-950/50 rounded-lg p-4 font-mono text-xs text-center">
          <p className="text-amber-400 font-bold mb-2">Fc ⇌ Fc⁺ + e⁻</p>
          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div className="bg-purple-900/50 rounded p-2">
              <p className="text-purple-400">Fc (ferrosen)</p>
              <p className="text-yellow-400 font-bold">Fe²⁺ (d⁶)</p>
              <p className="text-purple-300">diamagnit, 18 e⁻</p>
              <p className="text-amber-400 mt-1">to'q sariq</p>
            </div>
            <div className="bg-purple-900/50 rounded p-2">
              <p className="text-purple-400">Fc⁺ (ferrosenium)</p>
              <p className="text-blue-400 font-bold">Fe³⁺ (d⁵)</p>
              <p className="text-purple-300">paramagnit, 17 e⁻</p>
              <p className="text-blue-400 mt-1">ko'k</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun Fc/Fc⁺ ideal standart?</p>
          <ul className="text-purple-200 space-y-1 list-disc list-inside">
            <li><strong>Kimyoviy barqaror</strong> — ikkala holatda ham</li>
            <li><strong>Tez kinetika</strong> — outer-sphere electron transfer</li>
            <li><strong>Yuqori reversivlik</strong> — 1000+ tsikl</li>
            <li><strong>Organik erituvchilarda</strong> eriydi (CH₂Cl₂, CH₃CN, THF)</li>
            <li><strong>Solvatoxrom ta'sir kam</strong> — doimiy E°</li>
            <li><strong>Sintez oson</strong>, arzon, toza</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. ¹H NMR — BIR CHO'QQI FENOMENI
// ============================================================================
function ProtonNMR() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🧲 ¹H NMR — barcha 10 ta proton ekvivalent</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-amber-700/30 space-y-4">
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">🎯 Hayratlanarli fakt:</p>
          <p className="text-purple-200 text-xs">
            Ferrosenning ¹H NMR spektrida <strong>faqat BIR CHO'QQI</strong> bor (δ = 4.15 ppm).
            10 ta proton (2 × Cp halqa) — barchasi <strong>kimyoviy ekvivalent</strong>.
            Bu Cp halqalarning <strong>erkin aylanishi</strong> va yuqori simmetriya tufayli.
          </p>
        </div>

        {/* NMR SPEKTRI */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <svg viewBox="0 0 400 180" className="w-full h-40">
            <line x1="40" y1="140" x2="360" y2="140" stroke="#4c1d95" strokeWidth="1" />
            <line x1="40" y1="20" x2="40" y2="140" stroke="#4c1d95" strokeWidth="1" />
            <text x="200" y="170" fill="#c4b5fd" fontSize="9" textAnchor="middle">δ (ppm)</text>
            <text x="15" y="80" fill="#c4b5fd" fontSize="8" transform="rotate(-90, 15, 80)">Intensivlik</text>

            {/* Scale - reversed (10 to 0) */}
            {[0, 2, 4, 6, 8, 10].map((v, i) => (
              <g key={i}>
                <line x1={360 - i * 64} y1="138" x2={360 - i * 64} y2="142" stroke="#a78bfa" strokeWidth="1" />
                <text x={360 - i * 64} y="155" fill="#a78bfa" fontSize="8" textAnchor="middle">{v}</text>
              </g>
            ))}

            {/* Sharp singlet at 4.15 ppm */}
            {(() => {
              const x = 360 - (4.15 / 10) * 320
              return (
                <g>
                  <polyline
                    points={`${x-10},140 ${x-5},130 ${x-2},80 ${x},25 ${x+2},80 ${x+5},130 ${x+10},140`}
                    fill="none" stroke="#f59e0b" strokeWidth="2"
                  />
                  <text x={x} y="18" fill="#f59e0b" fontSize="10" textAnchor="middle" fontWeight="bold">
                    δ = 4.15 ppm
                  </text>
                  <text x={x} y="155" fill="#f59e0b" fontSize="8" textAnchor="middle">
                    10 H (singlet)
                  </text>
                </g>
              )
            })()}
          </svg>
        </div>

        {/* EKVIVALENTLIK TUShUNTIRIShI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-lg p-4">
            <h5 className="text-amber-400 font-bold text-xs mb-2">Nima uchun barcha H ekvivalent?</h5>
            <ul className="text-purple-200 text-xs space-y-2">
              <li>1. <strong>D₅d simmetriya</strong> — 5-tartibli o'q mavjud</li>
              <li>2. <strong>Erkin aylanish</strong> — Cp halqalar Fe atrofida aylanadi</li>
              <li>3. <strong>Aromatiklik</strong> — barcha C−H bog'lar bir xil</li>
              <li>4. <strong>Tez almashinuv</strong> — NMR vaqt shkalasida (ms)</li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <h5 className="text-amber-400 font-bold text-xs mb-2">Taqqoslash:</h5>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Ferrosen</span>
                <span className="text-amber-400 font-mono font-bold">1 cho'qqi</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Metilferrosen</span>
                <span className="text-yellow-400 font-mono">4 cho'qqi</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">1,1'-Dimetilferrosen</span>
                <span className="text-yellow-400 font-mono">2 cho'qqi</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Benzol</span>
                <span className="text-blue-400 font-mono">1 cho'qqi (7.27)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 δ = 4.15 ppm — nimani anglatadi?</p>
          <p className="text-purple-200">
            Benzol H (δ = 7.27 ppm) ga nisbatan <strong>yuqori maydon</strong>da (upfield).
            Sababi: Cp⁻ <strong>anion</strong> (manfiy zaryad) → elektron zichligi yuqori →
            protonlar kuchliroq ekranlangan. Bu Cp ning <strong>aromatik xarakteri</strong>ni
            tasdiqlaydi (6 π-elektron).
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 6. MÖSSBAUER SPEKTROSKOPIYA
// ============================================================================
function Mossbauer() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚛️ Mössbauer spektroskopiyasi — ⁵⁷Fe</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-amber-700/30 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-purple-900/50 rounded-lg p-4 text-center">
            <p className="text-purple-400 text-xs mb-1">Isomer siljish (δ)</p>
            <p className="text-emerald-400 font-bold text-xl font-mono">0.53 mm/s</p>
            <p className="text-purple-500 text-xs mt-1">vs α-Fe</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-4 text-center">
            <p className="text-purple-400 text-xs mb-1">Kvadrupol ajralish (ΔE<sub>Q</sub>)</p>
            <p className="text-yellow-400 font-bold text-xl font-mono">2.40 mm/s</p>
            <p className="text-purple-500 text-xs mt-1">kuchli!</p>
          </div>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-emerald-400 font-bold text-xs mb-2">Mössbauer spektri (sxematik):</h5>
          <svg viewBox="0 0 400 150" className="w-full h-32">
            <line x1="40" y1="120" x2="360" y2="120" stroke="#4c1d95" strokeWidth="1" />
            <text x="200" y="140" fill="#c4b5fd" fontSize="9" textAnchor="middle">Tezlik (mm/s)</text>

            {/* Doublet at 0.53 ± 1.2 */}
            {[0.53 - 1.2, 0.53 + 1.2].map((v, i) => {
              const x = 200 + (v * 50)
              return (
                <g key={i}>
                  <polyline
                    points={`${x-10},120 ${x-5},110 ${x-2},70 ${x},30 ${x+2},70 ${x+5},110 ${x+10},120`}
                    fill="none" stroke="#f59e0b" strokeWidth="2"
                  />
                  <text x={x} y="20" fill="#f59e0b" fontSize="8" textAnchor="middle">
                    {v.toFixed(2)}
                  </text>
                </g>
              )
            })}

            <text x="200" y="15" fill="#c4b5fd" fontSize="9" textAnchor="middle">Dublet — ΔEQ = 2.40</text>
          </svg>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun ΔE<sub>Q</sub> shunchalik katta?</p>
          <p className="text-purple-200">
            δ = 0.53 mm/s — <strong>Fe²⁺ LS</strong> ekanligini ko'rsatadi (Fe³⁺ uchun ~0.3).
            ΔE<sub>Q</sub> = 2.4 mm/s — <strong>katta elektr maydon gradienti (EFG)</strong>.
            Sababi: ferrosenning <strong>anisotrop elektron buluti</strong> — d-elektronlar
            simmetrik emas taqsimlangan (e<sub>2g</sub> to'lgan, e<sub>1g</sub>* bo'sh).
            Bu K₃[Fe(CN)₆] (ΔE<sub>Q</sub> = 0.38) dan ancha katta.
          </p>
        </div>

        {/* Taqqoslash */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-emerald-400 font-bold text-xs mb-2">Fe²⁺ komplekslarini taqqoslash:</h5>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-purple-700/50">
                  <th className="text-left py-1 text-yellow-400">Kompleks</th>
                  <th className="text-center py-1 text-yellow-400">δ (mm/s)</th>
                  <th className="text-center py-1 text-yellow-400">ΔE<sub>Q</sub></th>
                  <th className="text-center py-1 text-yellow-400">Holat</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {[
                  ["Ferrosen", "0.53", "2.40", "LS, sandwich"],
                  ["K₄[Fe(CN)₆]", "−0.06", "0.00", "LS, oktaedr"],
                  ["[Fe(H₂O)₆]²⁺", "1.20", "3.00", "HS, oktaedr"],
                  ["FeCl₂", "1.05", "2.50", "HS, qatlam"],
                ].map((r, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 ${i === 0 ? 'bg-amber-600/10' : ''}`}>
                    <td className="py-1 font-bold text-amber-400">{r[0]}</td>
                    <td className="py-1 text-center font-mono">{r[1]}</td>
                    <td className="py-1 text-center font-mono">{r[2]}</td>
                    <td className="py-1 text-center text-[10px]">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 7. AROMATIK KIMO — FRIEDEL-CRAFTS
// ============================================================================
function AromatikKimo() {
  const [reaksiya, setReaksiya] = useState("acetyl")

  const reaksiyalar = {
    acetyl: {
      name: "Asetillash (Friedel-Crafts)",
      reagent: "CH₃COCl + AlCl₃",
      mahsulot: "Asetilferrosen",
      rang: "To'q sariq",
      formula: "Fc + CH₃COCl → Fc-COCH₃ + HCl"
    },
    lithiation: {
      name: "Litirlash",
      reagent: "n-BuLi (TMEDA bilan)",
      mahsulot: "1,1'-Dilitaloferrosen",
      rang: "Sariq",
      formula: "Fc + 2 n-BuLi → Fc(Li)₂ + 2 BuH"
    },
    formylation: {
      name: "Vilsmeier formillash",
      reagent: "POCl₃ + DMF",
      mahsulot: "Ferrosenkarboksaldegid",
      rang: "Sariq",
      formula: "Fc + DMF → Fc-CHO"
    },
    sulfonation: {
      name: "Sulfonatsiya",
      reagent: "Ac₂O + H₂SO₄",
      mahsulot: "Ferrosensulfon kislota",
      rang: "Sariq (suvda eriydi)",
      formula: "Fc + H₂SO₄ → Fc-SO₃H"
    }
  }

  const r = reaksiyalar[reaksiya]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🌟 Aromatik xossalari — Friedel-Crafts reaksiyalari</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-amber-700/30 space-y-4">
        <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-lg p-4">
          <p className="text-emerald-400 font-bold mb-2">✨ Cp halqa — aromatik!</p>
          <p className="text-purple-200 text-xs">
            Ferrosenning Cp halqalari <strong>benzolga o'xshash aromatik xossalarni</strong> namoyon qiladi.
            Ular <strong>elektrofil aromatik almashinish (EAS)</strong> reaksiyalariga kirishadi.
            Bu Cp ning 6 π-elektronga ega ekanligini yana bir bor isbotlaydi.
          </p>
        </div>

        {/* REAKTSIYA TANLASH */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(reaksiyalar).map(([key, val]) => (
            <button key={key} onClick={() => setReaksiya(key)}
              className={`px-2 py-3 rounded-lg text-[10px] font-bold transition-all ${
                reaksiya === key
                  ? "bg-amber-600/80 text-white shadow-lg"
                  : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
              }`}>
              {val.name.split(" ")[0]}
            </button>
          ))}
        </div>

        {/* REAKTSIYA */}
        <div className="bg-purple-950/50 rounded-xl p-5">
          <h4 className="text-amber-400 font-bold text-center mb-3">{r.name}</h4>

          <div className="bg-purple-900/50 rounded-lg p-3 font-mono text-xs text-center text-emerald-400 mb-3">
            {r.formula}
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs text-center">
            <div className="bg-purple-900/50 rounded p-2">
              <p className="text-purple-400">Reagent</p>
              <p className="text-yellow-400 font-mono text-[10px]">{r.reagent}</p>
            </div>
            <div className="bg-purple-900/50 rounded p-2">
              <p className="text-purple-400">Mahsulot</p>
              <p className="text-emerald-400 font-bold text-[10px]">{r.mahsulot}</p>
            </div>
            <div className="bg-purple-900/50 rounded p-2">
              <p className="text-purple-400">Rang</p>
              <p className="text-amber-400 font-bold text-[10px]">{r.rang}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun ferrosen benzoldan faol?</p>
          <p className="text-purple-200">
            Cp⁻ — <strong>anion</strong> (benzolga nisbatan elektron boy).
            Fe²⁺ <strong>elektron beradi</strong> (back-donation). Natijada ferrosen
            <strong> benzoldan ~10⁶ marta faolroq</strong> EAS da!
            Bu shunchalik faolki, Friedel-Crafts <strong>alkillash</strong> ham oson,
            lekin <strong>polialkillanish</strong> muammo bo'ladi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-emerald-400 font-bold mb-1">✓ Ferrosenda bo'ladigan reaksiyalar:</p>
            <ul className="text-purple-200 space-y-1 list-disc list-inside text-[11px]">
              <li>Friedel-Crafts asillash/alkillash</li>
              <li>Sulfonatsiya, fosforillash</li>
              <li>Metalatsiya (n-BuLi)</li>
              <li>Aminometilash (Mannich)</li>
            </ul>
          </div>
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-red-400 font-bold mb-1">✗ Bo'lmaydigan reaksiyalar:</p>
            <ul className="text-purple-200 space-y-1 list-disc list-inside text-[11px]">
              <li>Nitrlash (HNO₃ Fc⁺ ga oksidlaydi)</li>
              <li>Galogenlanish (Fe ni oksidlaydi)</li>
              <li>Kuchli oksidlovchilar</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 8. TARIXIY KONTEKST — KAShFIYOT VA NOBEL
// ============================================================================
function TarixiyKontekst() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🏛️ Tarixiy kontekst — kimyoni o'zgartirgan kashfiyot</h3>

      <div className="bg-gradient-to-br from-amber-900/30 to-purple-900/30 rounded-xl p-5 border border-amber-500/30 space-y-4">
        <div className="space-y-3">
          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">⚗️</div>
              <div>
                <p className="text-yellow-400 font-bold">1951 — Tasodifiy sintez</p>
                <p className="text-purple-200 text-xs mt-1">
                  <strong>Kealy va Pauson</strong> (Dublin) Grignard reaksiyasi orqali
                  siklopentadienilmagnesium bromid + FeCl₂ reaksiyasini qilishdi.
                  Natija — <strong>hayratlanarli barqaror to'q sariq modda</strong> (400°C gacha!).
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🔬</div>
              <div>
                <p className="text-yellow-400 font-bold">1952 — Struktura taklif etildi</p>
                <p className="text-purple-200 text-xs mt-1">
                  <strong>Robert Woodward</strong>, <strong>Geoffrey Wilkinson</strong> va
                  <strong> Ernst Otto Fischer</strong> mustaqil ravishda <strong>sandwich strukturani</strong>
                  taklif qilishdi. Bu butunlay yangi kimyo turi edi!
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">💎</div>
              <div>
                <p className="text-yellow-400 font-bold">1953-1955 — XRD tasdiqladi</p>
                <p className="text-purple-200 text-xs mt-1">
                  Rentgen strukturaviy tahlil ferrosenning <strong>haqiqatan ham sandwich</strong>
                  ekanligini ko'rsatdi. <strong>Metallocene oilasi</strong> tug'ildi:
                  [Ru(Cp)₂], [Os(Cp)₂], [Co(Cp)₂]⁺, [Ni(Cp)₂] va boshqalar.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🏆</div>
              <div>
                <p className="text-yellow-400 font-bold">1973 — Nobel mukofoti</p>
                <p className="text-purple-200 text-xs mt-1">
                  <strong>Wilkinson va Fischer</strong> "organometallik kimyodagi kashshof ishlari uchun"
                  Nobel mukofotini olishdi. Ferrosen — bu sohaning <strong>ramzi</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">💡 Ferrosen inqilobi:</p>
          <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
            <li><strong>Organometallik kimyo</strong> sohasi yaratildi</li>
            <li><strong>η⁵ (pentahapto)</strong> koordinatsiyasi kashf etildi</li>
            <li>Minglab yangi birikmalar sintez qilindi</li>
            <li><strong>18 elektron qoidasi</strong> qayta tiklandi</li>
            <li>Sanoatda katalizatorlar (Ziegler-Natta) uchun asos</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 9. QO'LLANILISHI
// ============================================================================
function AmaliyQollanilish() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🏭 Amaliy qo'llanilishi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-amber-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">⚗️</div>
            <h4 className="text-amber-400 font-bold mb-2">Elektrokimyoviy standart</h4>
            <p className="text-purple-200 text-xs">
              Fc/Fc⁺ jufti — <strong>ICHKI STANDART</strong> (IUPAC).
              Har bir CV tajribasida ishlatiladi.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">💊</div>
            <h4 className="text-amber-400 font-bold mb-2">Tibbiyot (tadqiqot)</h4>
            <p className="text-purple-200 text-xs">
              <strong>Ferrocifen</strong> — tamoksifen analogi.
              Saraton hujayralariga qarshi.
              Ferroquin (malyariya).
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">⛽</div>
            <h4 className="text-amber-400 font-bold mb-2">Yoqilg'i qo'shimchasi</h4>
            <p className="text-purple-200 text-xs">
              <strong>Butylferrosen</strong> — raketa yoqilg'isida
              yonish katalizatori. Ammoniy perxlorat parchalanishini tezlashtiradi.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🎨</div>
            <h4 className="text-amber-400 font-bold mb-2">Materiallar</h4>
            <p className="text-purple-200 text-xs">
              Polimerlarga qo'shilib, <strong>elektr o'tkazuvchi</strong>,
              magnit yoki optik materiallar yaratiladi.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🔬</div>
            <h4 className="text-amber-400 font-bold mb-2">Sensorlar</h4>
            <p className="text-purple-200 text-xs">
              Glukoza, H₂O₂, biomarkerlar aniqlash uchun
              <strong> elektrochemilyuminestsent</strong> sensorlar.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🏛️</div>
            <h4 className="text-amber-400 font-bold mb-2">Ta'lim</h4>
            <p className="text-purple-200 text-xs">
              Har bir <strong>organometallik kimyo kursi</strong> ferrosendan boshlanadi.
              Laboratoriya tajribasi — sintez va xarakterizatsiya.
            </p>
          </div>
        </div>

        <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-lg p-4">
          <p className="text-emerald-400 font-bold mb-2">🌟 Qiziqarli faktlar:</p>
          <ul className="text-purple-200 text-xs space-y-1">
            <li>• Ferrosen <strong>100°C da sublimatsiya</strong> qiladi (qattiq → gaz)</li>
            <li>• <strong>400°C gacha</strong> termik barqaror (oddiy organik moddalar 200°C da parchalanadi)</li>
            <li>• Kuchli kislotalarda <strong>Fc·H⁺</strong> (protonlangan) hosil bo'ladi</li>
            <li>• Havo va suvga <strong>chidamli</strong> — uzoq saqlanadi</li>
            <li>• <strong>To'q sariq rang</strong> — LMCT va d-d o'tishlar (ε ≈ 100)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 10. METALLOCENE OILASI
// ============================================================================
function MetalloceneOilasi() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🌐 Metallocene oilasi — ferrosenning aka-ukalari</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-amber-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-2 text-yellow-400">Nomi</th>
                <th className="text-center py-3 px-2 text-yellow-400">Formula</th>
                <th className="text-center py-3 px-2 text-yellow-400">Metall</th>
                <th className="text-center py-3 px-2 text-yellow-400">e⁻ soni</th>
                <th className="text-center py-3 px-2 text-yellow-400">Magnit</th>
                <th className="text-left py-3 px-2 text-yellow-400">Xususiyat</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["Ferrosen", "Fe(Cp)₂", "Fe²⁺", "18", "Diamagnit", "Klassik"],
                ["Kobaltsen", "Co(Cp)₂", "Co²⁺", "19", "Paramagnit", "Kuchli qaytaruvchi"],
                ["Nikkelsen", "Ni(Cp)₂", "Ni²⁺", "20", "Paramagnit", "Yashil rang"],
                ["Ruteniytsen", "Ru(Cp)₂", "Ru²⁺", "18", "Diamagnit", "Barqaror"],
                ["Osmiytsen", "Os(Cp)₂", "Os²⁺", "18", "Diamagnit", "Eng barqaror"],
                ["Manganosen", "Mn(Cp)₂", "Mn²⁺", "17", "Paramagnit", "Polimer"],
                ["Xromitsen", "Cr(Cp)₂", "Cr²⁺", "16", "Paramagnit", "Yashil"],
                ["Vanadotsen", "V(Cp)₂", "V²⁺", "15", "Paramagnit", "Binafsha"],
                ["Titanotsen", "Ti(Cp)₂", "Ti²⁺", "14", "Paramagnit", "Qora"],
              ].map((r, i) => (
                <tr key={i} className={`border-b border-purple-800/30 ${i === 0 ? 'bg-amber-600/10' : ''} hover:bg-purple-800/20`}>
                  <td className="py-2 px-2 font-bold text-amber-400">{r[0]}</td>
                  <td className="py-2 px-2 text-center font-mono">{r[1]}</td>
                  <td className="py-2 px-2 text-center">{r[2]}</td>
                  <td className="py-2 px-2 text-center font-mono">{r[3]}</td>
                  <td className={`py-2 px-2 text-center font-bold ${r[4] === 'Diamagnit' ? 'text-blue-400' : 'text-red-400'}`}>
                    {r[4]}
                  </td>
                  <td className="py-2 px-2 text-[11px]">{r[5]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-purple-400 text-xs mt-3">
          * 18 elektronli metallocenlar (Fe, Ru, Os) — eng barqaror, diamagnit.
          Boshqalari 18 e⁻ ga erishish uchun reaksiyaga kirishadi (masalan, Co(Cp)₂ → Co(Cp)₂⁺).
        </p>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function FerrosenMagnit() {
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
          <span className="text-amber-400">Ferrosen</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-amber-400">🧲 Ferrosen — Magnit tahlili</h1>
          <p className="text-purple-400 text-sm">
            [Fe(C₅H₅)₂] • Fe²⁺ (d⁶, LS, 18 e⁻) • S=0 • Diamagnit • Sandwich struktura • Nobel 1973
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-amber-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-2xl md:text-4xl font-extrabold font-mono text-amber-400">[Fe(C₅H₅)₂]</span>
            <div>
              <h2 className="text-xl font-bold text-white">Magnit tahlili — to'liq profil</h2>
              <p className="text-purple-400">"Ferrosen" — organometallik kimyoning ramzi</p>
            </div>
          </div>

          <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-amber-400">Ferrosen</strong> — birinchi <strong>sandwich birikma</strong>,
              organometallik kimyo inqilobining boshlanishi. Fe²⁺ ikkita parallel siklopentadienil
              halqasi orasida joylashgan (η⁵-koordinatsiya). <strong>18 elektron qoidasi</strong> bajariladi:
              Fe²⁺ (6 e⁻) + 2 × Cp⁻ (6 e⁻) = <strong>18 elektron</strong> → <strong>S = 0</strong>,
              <strong> diamagnit</strong>, μ<sub>eff</sub> = 0 μ<sub>B</sub>. 1951 yilda kashf etilgan,
              1973 yilda <strong>Nobel mukofoti</strong> bilan taqdirlangan.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-amber-400 font-bold text-lg">S = 0</p>
              <p className="text-purple-300">d⁶, LS</p>
              <p className="text-purple-400 mt-1">Diamagnit</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-amber-400 font-bold text-lg">18 e⁻</p>
              <p className="text-purple-300">qoida</p>
              <p className="text-purple-400 mt-1">barqaror</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-amber-400 font-bold text-lg">¹H NMR</p>
              <p className="text-purple-300">1 cho'qqi</p>
              <p className="text-purple-400 mt-1">δ = 4.15</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-amber-400 font-bold text-lg">E° = 0.40 V</p>
              <p className="text-purple-300">Fc/Fc⁺</p>
              <p className="text-purple-400 mt-1">standart</p>
            </div>
          </div>
        </div>

        {/* SANDWICH STRUKTURA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <SandwichStruktura />
        </div>

        {/* 18 ELEKTRON MO */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <MO18Elektron />
        </div>

        {/* SPIN-ONLY */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <SpinOnlyCalc />
        </div>

        {/* ELEKTROKIMYO */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <Elektrokimyo />
        </div>

        {/* ¹H NMR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <ProtonNMR />
        </div>

        {/* MÖSSBAUER */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <Mossbauer />
        </div>

        {/* AROMATIK KIMO */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <AromatikKimo />
        </div>

        {/* TARIX */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <TarixiyKontekst />
        </div>

        {/* METALLOCENE OILASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <MetalloceneOilasi />
        </div>

        {/* AMALIYOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <AmaliyQollanilish />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-amber-600/10 to-purple-600/10 border border-amber-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>Ferrosen — <strong className="text-amber-400">diamagnit</strong> (Fe²⁺ d⁶, LS, S=0)</li>
            <li>μ<sub>eff</sub> = <strong>0 μ<sub>B</sub></strong> — barcha elektronlar juftlashgan</li>
            <li><strong className="text-amber-400">18 elektron qoidasi</strong> bajariladi → alohida barqarorlik</li>
            <li><strong>Sandwich struktura</strong> — Fe²⁺ ikkita η⁵-Cp halqasi orasida</li>
            <li>Staggered (D₅d) konformatsiya — eng past energiya</li>
            <li>¹H NMR: <strong>1 cho'qqi</strong> (δ = 4.15 ppm) — 10 H ekvivalent</li>
            <li>Mössbauer: δ = 0.53 mm/s, <strong>ΔE<sub>Q</sub> = 2.40 mm/s</strong> (katta)</li>
            <li>Fc/Fc⁺ — <strong>elektrokimyoviy ichki standart</strong> (E° = +0.40 V)</li>
            <li>Aromatik xossalar — <strong>Friedel-Crafts</strong> reaksiyalari oson</li>
            <li>Tarixiy ahamiyati: <strong>Nobel 1973</strong> (Wilkinson, Fischer) — organometallik kimyo</li>
            <li>Metallocene oilasi asoschisi (Ru, Os, Co, Ni, Mn analoglari)</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/magnit/birikmalar/sisplatin" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← Sisplatin
          </Link>
          <Link href="/ilmiy/tahlil/magnit/birikmalar/ni-cn4" className="px-6 py-3 bg-amber-600/80 rounded-xl hover:bg-amber-500 text-white font-semibold">
            [Ni(CN)₄]²⁻ →
          </Link>
        </div>

      </section>
    </main>
  )
}