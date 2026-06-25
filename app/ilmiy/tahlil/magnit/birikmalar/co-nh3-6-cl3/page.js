"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. SPIN-ONLY KALKULYATORI (Co³⁺ LS uchun)
// ============================================================================
function SpinOnlyCalc() {
  const [n, setN] = useState(0)
  const mu_so = Math.sqrt(n * (n + 2))

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🧮 Spin-only magnit momenti</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-orange-700/30 space-y-4">
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
            className="w-full h-2 bg-purple-900 rounded-lg appearance-none cursor-pointer accent-orange-500" />
          <div className="flex justify-between text-[10px] text-purple-400 mt-1">
            <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-center">
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Hisoblash</p>
            <p className="text-purple-200 font-mono">√({n}·{n + 2})</p>
          </div>
          <div className="bg-orange-900/40 border border-orange-500/40 rounded-lg p-3">
            <p className="text-orange-400">Natija</p>
            <p className="text-emerald-400 font-bold font-mono text-lg">{mu_so.toFixed(3)} μ<sub>B</sub></p>
          </div>
        </div>

        <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-lg p-3 text-xs">
          <p className="text-emerald-400 font-bold mb-1">✅ [Co(NH₃)₆]Cl₃ uchun:</p>
          <p className="text-purple-200">
            Co³⁺ (d⁶) kuchli maydon ligandi (NH₃) ta'sirida <strong>quyi spinli (LS)</strong> bo'ladi.
            Barcha 6 ta elektron t₂g da juftlashadi: <strong>n = 0</strong>, S = 0.
            Natijada μ<sub>eff</sub> = <strong>0 μ<sub>B</sub></strong> — <strong>diamagnit</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. WERNER KOORDINATSION NAZARIYASI (interaktiv)
// ============================================================================
function WernerNazariyasi() {
  const [step, setStep] = useState(0)

  const steps = [
    {
      title: "1. Kompleks eritiladi",
      desc: "[Co(NH₃)₆]Cl₃ suvda eritilganda to'liq dissotsiatsiyalanadi",
      formula: "[Co(NH₃)₆]Cl₃ → [Co(NH₃)₆]³⁺ + 3 Cl⁻",
      icon: "💧",
      natija: "4 ta ion hosil bo'ladi (1:3 elektrolit)"
    },
    {
      title: "2. AgNO₃ qo'shiladi",
      desc: "Kumush nitrat eritmasi qo'shilganda...",
      formula: "3 Cl⁻ + 3 Ag⁺ → 3 AgCl ↓ (oq cho'kma)",
      icon: "⚗️",
      natija: "3 mol AgCl darhol cho'kadi"
    },
    {
      title: "3. Xulosa",
      desc: "Barcha 3 ta Cl⁻ ionlari TASHQI sferada",
      formula: "[Co(NH₃)₆]³⁺ ichki sfera → Co³⁺ + 6 NH₃ (mustahkam)",
      icon: "🎯",
      natija: "NH₃ ligandlari Co³⁺ bilan mustahkam bog'langan"
    }
  ]

  const s = steps[step]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🏛️ Verner koordinatsion nazariyasi — klassik tajriba</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-orange-700/30 space-y-4">
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">💡 Verner savoli (1893):</p>
          <p className="text-purple-200 text-xs">
            "CoCl₃·6NH₃ formulasi qanday tuzilishga ega? Cl atomlari metallga to'g'ridan-to'g'ri bog'langanmi
            yoki bilvosita? Nega bu birikma suv eritmasida <strong>3 ta Cl⁻ ion</strong> beradi?"
          </p>
        </div>

        {/* STEP NAVIGATION */}
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <button key={i} onClick={() => setStep(i)}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                step === i
                  ? "bg-orange-600/80 text-white shadow-lg"
                  : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
              }`}>
                Qadam {i + 1}
              </button>
          ))}
        </div>

        {/* CURRENT STEP */}
        <div className="bg-purple-950/50 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{s.icon}</span>
            <h4 className="text-yellow-400 font-bold text-lg">{s.title}</h4>
          </div>
          <p className="text-purple-200 text-sm mb-3">{s.desc}</p>
          <div className="bg-purple-900/50 rounded-lg p-3 font-mono text-xs text-center text-emerald-400 mb-3">
            {s.formula}
          </div>
          <div className="bg-orange-900/30 border border-orange-500/30 rounded-lg p-3 text-xs">
            <p className="text-orange-400 font-bold">→ {s.natija}</p>
          </div>
        </div>

        {/* VIZUALIZATSIYA */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-emerald-400 font-bold text-xs mb-3">Struktura sxemasi:</h5>
          <svg viewBox="0 0 400 220" className="w-full h-52">
            <circle cx="200" cy="110" r="90" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="4,4" />
            <text x="200" y="20" fill="#a78bfa" fontSize="10" textAnchor="middle">Ichki sfera</text>

            <circle cx="200" cy="110" r="15" fill="#f97316" />
            <text x="200" y="115" fill="white" fontSize="12" textAnchor="middle" fontWeight="bold">Co³⁺</text>

            {[
              { x: 200, y: 50, label: "NH₃" },
              { x: 200, y: 170, label: "NH₃" },
              { x: 140, y: 110, label: "NH₃" },
              { x: 260, y: 110, label: "NH₃" },
              { x: 160, y: 70, label: "NH₃" },
              { x: 240, y: 150, label: "NH₃" },
            ].map((l, i) => (
              <g key={i}>
                <line x1="200" y1="110" x2={l.x} y2={l.y} stroke="#eab308" strokeWidth="1.5" />
                <circle cx={l.x} cy={l.y} r="12" fill="#3b82f6" />
                <text x={l.x} y={l.y + 4} fill="white" fontSize="8" textAnchor="middle">{l.label}</text>
              </g>
            ))}

            <text x="355" y="60" fill="#ef4444" fontSize="11" fontWeight="bold">Cl⁻</text>
            <text x="355" y="110" fill="#ef4444" fontSize="11" fontWeight="bold">Cl⁻</text>
            <text x="355" y="160" fill="#ef4444" fontSize="11" fontWeight="bold">Cl⁻</text>

            <line x1="295" y1="60" x2="350" y2="60" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="2,2" />
            <line x1="295" y1="110" x2="350" y2="110" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="2,2" />
            <line x1="295" y1="160" x2="350" y2="160" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="2,2" />

            <text x="355" y="30" fill="#ef4444" fontSize="9">Tashqi sfera</text>
            <text x="355" y="195" fill="#ef4444" fontSize="8">(ion bog'lanish)</text>

            <text x="200" y="215" fill="#c4b5fd" fontSize="9" textAnchor="middle">
              [Co(NH₃)₆]³⁺ — ichki kompleks ion
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3 text-center">
            <p className="text-blue-400 font-bold">Ichki sfera</p>
            <p className="text-purple-200 mt-1">Co³⁺ + 6 NH₃</p>
            <p className="text-purple-400 text-[10px]">Kovalent (donor-akseptor)</p>
          </div>
          <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3 text-center">
            <p className="text-red-400 font-bold">Tashqi sfera</p>
            <p className="text-purple-200 mt-1">3 Cl⁻</p>
            <p className="text-purple-400 text-[10px]">Ion bog'lanish</p>
          </div>
          <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3 text-center">
            <p className="text-yellow-400 font-bold">Koordinatsion son</p>
            <p className="text-purple-200 mt-1 font-bold text-lg">6</p>
            <p className="text-purple-400 text-[10px]">Oktaedrik geometriya</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. KRISTALL MAYDON — Co³⁺ (d⁶)
// ============================================================================
function CrystalFieldCo() {
  const [Dq, setDq] = useState(23000)
  const [P, setP] = useState(21000)
  const [ligandField, setLigandField] = useState("nh3")

  const ligandlar = {
    f: { name: "F⁻ (kuchsiz)", dq: 13000, holat: "HS" },
    h2o: { name: "H₂O (o'rtacha)", dq: 18000, holat: "HS/LS" },
    nh3: { name: "NH₃ (kuchli)", dq: 23000, holat: "LS" },
    cn: { name: "CN⁻ (juda kuchli)", dq: 35000, holat: "LS" },
  }

  const current = ligandlar[ligandField]
  const isLS = current.dq > P
  const LFSE = isLS ? -2.4 * current.dq : -0.4 * current.dq

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔬 Kristall maydon — Co³⁺ (d⁶) komplekslari</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-orange-700/30 space-y-4">
        <div>
          <label className="flex justify-between text-xs mb-2">
            <span className="text-yellow-400 font-bold">Ligand maydoni kuchi:</span>
            <span className="text-emerald-400 font-mono">{current.name}</span>
          </label>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(ligandlar).map(([key, val]) => (
              <button key={key} onClick={() => setLigandField(key)}
                className={`px-2 py-2 rounded-lg text-[10px] font-bold transition-all ${
                  ligandField === key
                    ? "bg-orange-600/80 text-white"
                    : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
                }`}>
                {key.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-yellow-400 font-bold mb-3">
              Kristall maydon diagrammasi ({isLS ? "Quyi spin" : "Yuqori spin"})
            </h4>
            <div className="font-mono text-xs space-y-3">
              <div className="flex justify-between items-center border-b border-purple-700/30 pb-2">
                <span className="text-red-400">e<sub>g</sub>*</span>
                <div className="flex gap-2">
                  {isLS ? (
                    <>
                      <span className="text-purple-500">__</span>
                      <span className="text-purple-500">__</span>
                    </>
                  ) : (
                    <>
                      <span className="text-yellow-400">↑</span>
                      <span className="text-yellow-400">↑</span>
                    </>
                  )}
                </div>
                <span className="text-purple-500">{isLS ? "bo'sh" : "2 e⁻"}</span>
              </div>

              <div className="text-center text-purple-400 text-[10px] py-1">
                Δ<sub>o</sub> = {current.dq.toLocaleString()} cm⁻¹
              </div>

              <div className="flex justify-between items-center border-t border-purple-700/30 pt-2">
                <span className="text-emerald-400">t₂g</span>
                <div className="flex gap-2">
                  {isLS ? (
                    <>
                      <span className="text-yellow-400">↑↓</span>
                      <span className="text-yellow-400">↑↓</span>
                      <span className="text-yellow-400">↑↓</span>
                    </>
                  ) : (
                    <>
                      <span className="text-yellow-400">↑↓</span>
                      <span className="text-yellow-400">↑</span>
                      <span className="text-yellow-400">↑</span>
                    </>
                  )}
                </div>
                <span className="text-emerald-400">{isLS ? "6 e⁻" : "4 e⁻"}</span>
              </div>

              <div className={`rounded p-2 text-center mt-3 ${isLS ? 'bg-emerald-900/30 border border-emerald-500/30' : 'bg-red-900/30 border border-red-500/30'}`}>
                <p className="text-[10px] text-purple-300">Konfiguratsiya:</p>
                <p className={`font-bold ${isLS ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isLS ? "t₂g⁶ e_g⁰" : "t₂g⁴ e_g²"}
                </p>
                <p className="text-[10px] text-purple-400 mt-1">
                  S = {isLS ? "0" : "2"} | n = {isLS ? "0" : "4"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5 space-y-3">
            <h4 className="text-yellow-400 font-bold">Energiya tahlili</h4>

            <div className="bg-purple-900/50 rounded-lg p-3 text-xs">
              <div className="flex justify-between">
                <span className="text-purple-400">Δ<sub>o</sub>:</span>
                <span className="text-emerald-400 font-mono">{current.dq.toLocaleString()} cm⁻¹</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-purple-400">P (juftlanish):</span>
                <span className="text-emerald-400 font-mono">{P.toLocaleString()} cm⁻¹</span>
              </div>
              <div className="flex justify-between mt-2 pt-2 border-t border-purple-700/50">
                <span className="text-purple-400">Taqqoslash:</span>
                <span className={`font-bold ${current.dq > P ? 'text-emerald-400' : 'text-red-400'}`}>
                  Δ<sub>o</sub> {current.dq > P ? '>' : '<'} P
                </span>
              </div>
            </div>

            <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3 text-xs">
              <p className="text-yellow-400 font-bold mb-1">LFSE (stabilizatsiya):</p>
              <p className="text-emerald-400 font-mono font-bold text-lg">
                {Math.abs(LFSE).toLocaleString()} cm⁻¹
              </p>
              <p className="text-purple-400 text-[10px] mt-1">
                ≈ {(Math.abs(LFSE) * 1.2e-4 * 96.485).toFixed(1)} kJ/mol
              </p>
            </div>

            <div className="bg-orange-900/30 border border-orange-500/30 rounded-lg p-3 text-xs">
              <p className="text-orange-400 font-bold mb-1">Magnit holat:</p>
              <p className={`font-bold ${isLS ? 'text-blue-400' : 'text-red-400'}`}>
                {isLS ? "DIAMAGNIT" : "PARAMAGNIT"}
              </p>
              <p className="text-purple-400 text-[10px] mt-1">
                μ<sub>eff</sub> = {isLS ? "0" : "4.90"} μ<sub>B</sub>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun [Co(NH₃)₆]³⁺ diamagnit?</p>
          <p className="text-purple-200">
            NH₃ — <strong>o'rtacha-kuchli ligand</strong>. Co³⁺ uchun Δ<sub>o</sub> = 23000 cm⁻¹,
            P (juftlanish energiyasi) = 21000 cm⁻¹. Δ<sub>o</sub> &gt; P bo'lgani uchun
            6 ta elektron <strong>t₂g</strong> da to'liq juftlashadi. Natijada <strong>S = 0</strong>,
            <strong> diamagnit</strong> holat. Ammo [CoF₆]³⁻ (F⁻ — kuchsiz ligand) — <strong>paramagnit</strong> (HS, S=2)!
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. KONDUKTOMETRIYA (1:3 elektrolit)
// ============================================================================
function Konduktometriya() {
  const [T, setT] = useState(25)
  const [c, setC] = useState(0.001)

  const Lambda0 = 430
  const K = 100
  const Lambda_m = Lambda0 - K * Math.sqrt(c)
  const kappa = Lambda_m * c / 1000

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔌 Konduktometriya — elektrolit turini aniqlash</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-orange-700/30 space-y-4">
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">🎯 Verner dalili #1:</p>
          <p className="text-purple-200 text-xs">
            [Co(NH₃)₆]Cl₃ eritmasi <strong>yuqori elektr o'tkazuvchanlik</strong> ko'rsatadi.
            Bu 4 ta ion hosil bo'lishini isbotlaydi: <strong>[Co(NH₃)₆]³⁺ + 3 Cl⁻</strong>
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">Konsentratsiya (c):</span>
              <span className="text-emerald-400 font-mono">{(c * 1000).toFixed(1)} mM</span>
            </label>
            <input type="range" min="0.0001" max="0.01" step="0.0001" value={c}
              onChange={(e) => setC(parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-orange-500" />
          </div>
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">Harorat (T):</span>
              <span className="text-emerald-400 font-mono">{T}°C</span>
            </label>
            <input type="range" min="0" max="80" step="1" value={T}
              onChange={(e) => setT(parseInt(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-orange-500" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-purple-400">Λ<sub>m</sub></p>
            <p className="text-emerald-400 font-bold font-mono">{Lambda_m.toFixed(1)}</p>
            <p className="text-purple-500 text-[10px]">S·cm²/mol</p>
          </div>
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-purple-400">κ</p>
            <p className="text-yellow-400 font-bold font-mono">{kappa.toExponential(2)}</p>
            <p className="text-purple-500 text-[10px]">S/cm</p>
          </div>
          <div className="bg-orange-900/40 border border-orange-500/40 rounded-lg p-3">
            <p className="text-orange-400">Ionlar soni</p>
            <p className="text-white font-bold text-lg">4</p>
            <p className="text-purple-400 text-[10px]">1:3 elektrolit</p>
          </div>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-emerald-400 font-bold text-xs mb-3">Elektrolit turlari — Λ<sub>m</sub> oralig'i:</h5>
          <div className="space-y-2 text-xs">
            {[
              { turi: "1:1 (NaCl)", min: 100, max: 160, ionlar: 2, active: false },
              { turi: "1:2 (BaCl₂)", min: 220, max: 300, ionlar: 3, active: false },
              { turi: "1:3 ([Co(NH₃)₆]Cl₃)", min: 400, max: 460, ionlar: 4, active: true },
              { turi: "1:4 ([Pt(NH₃)₆]Cl₄)", min: 520, max: 580, ionlar: 5, active: false },
            ].map((e, i) => (
              <div key={i} className={`flex items-center gap-3 ${e.active ? 'bg-orange-600/20 rounded p-1.5' : ''}`}>
                <span className="w-48 text-purple-200">{e.turi}</span>
                <div className="flex-1 h-3 bg-purple-900 rounded relative">
                  <div className="absolute h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded"
                    style={{left: `${(e.min / 600) * 100}%`, width: `${((e.max - e.min) / 600) * 100}%`}}></div>
                  {e.active && (
                    <div className="absolute top-0 left-0 right-0 h-full flex items-center justify-center">
                      <span className="text-[10px] font-bold text-white">← {Lambda_m.toFixed(0)} →</span>
                    </div>
                  )}
                </div>
                <span className={`w-16 text-right ${e.active ? 'text-orange-400 font-bold' : 'text-purple-400'}`}>
                  {e.ionlar} ion
                </span>
              </div>
            ))}
          </div>
          <p className="text-purple-400 text-[10px] text-center mt-3">
            Λ<sub>m</sub> qiymatlari 25°C da, suv eritmasida (S·cm²/mol)
          </p>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Xulosa:</p>
          <p className="text-purple-200">
            [Co(NH₃)₆]Cl₃ eritmasining <strong>Λ<sub>m</sub> ≈ 430 S·cm²/mol</strong> — bu
            <strong> 1:3 elektrolit</strong> ekanligini ko'rsatadi. Demak, 3 ta Cl⁻ ionlari
            tashqi sferada va erkin harakatlanadi. NH₃ ligandlari esa Co³⁺ bilan
            mustahkam bog'langan.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. AgNO₃ BILAN CHO'KTIRISH (klassik) — TUZATILGAN
// ============================================================================
function AgNO3Choktirish() {
  const [selected, setSelected] = useState("nh3")

  const birikmalar = {
    nh3: {
      formula: "[Co(NH₃)₆]Cl₃",
      rang: "Sariq-to'q sariq",
      cl_jami: 3,
      cl_chokma: 3,
      cl_ichki: 0,
      izoh: "Barcha Cl⁻ tashqi sferada"
    },
    cl1: {
      formula: "[Co(NH₃)₅Cl]Cl₂",
      rang: "Binafsha",
      cl_jami: 3,
      cl_chokma: 2,
      cl_ichki: 1,
      izoh: "1 ta Cl⁻ ichki sferada (ligand)"
    },
    cl2: {
      formula: "[Co(NH₃)₄Cl₂]Cl",
      rang: "Yashil",
      cl_jami: 3,
      cl_chokma: 1,
      cl_ichki: 2,
      izoh: "2 ta Cl⁻ ichki sferada (ligand)"
    },
    cl3: {
      formula: "[Co(NH₃)₃Cl₃]",
      rang: "Yashil-kulrang",
      cl_jami: 3,
      cl_chokma: 0,
      cl_ichki: 3,
      izoh: "Barcha Cl⁻ ichki sferada (neytral)"
    }
  }

  const b = birikmalar[selected]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚗️ AgNO₃ bilan cho'ktirish — Verner tajribasi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-orange-700/30 space-y-4">
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">🎯 Verner dalili #2:</p>
          <p className="text-purple-200 text-xs">
            Turli Co(III) komplekslarida <strong>Cl⁻ ning faolligi turlicha</strong>.
            AgNO₃ qo'shilganda, faqat <strong>tashqi sfera</strong>dagi Cl⁻ ionlari cho'kadi.
          </p>
        </div>

        {/* TANLASH */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(birikmalar).map(([key, val]) => (
            <button key={key} onClick={() => setSelected(key)}
              className={`px-2 py-3 rounded-lg text-[10px] font-bold transition-all ${
                selected === key
                  ? "bg-orange-600/80 text-white shadow-lg"
                  : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
              }`}>
              <div className="text-xs mb-1">{val.formula}</div>
              <div className="text-[9px] opacity-70">{val.rang}</div>
            </button>
          ))}
        </div>

        {/* TAJRIBA */}
        <div className="bg-purple-950/50 rounded-xl p-5">
          <h4 className="text-yellow-400 font-bold mb-3 text-center">{b.formula}</h4>

          <svg viewBox="0 0 400 200" className="w-full h-48">
            <path d="M 100 40 L 80 180 L 320 180 L 300 40 Z" fill="none" stroke="#a78bfa" strokeWidth="2" />
            <rect x="85" y="120" width="230" height="60" fill="#fbbf24" opacity="0.3" />

            {Array.from({ length: b.cl_chokma * 10 }).map((_, i) => (
              <circle key={i}
                cx={100 + (i * 20) % 200}
                cy={160 + (i % 3) * 5}
                r="2"
                fill="white"
                opacity="0.9"
              />
            ))}

            <line x1="50" y1="30" x2="150" y2="80" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrow2)" />
            <defs>
              <marker id="arrow2" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
                <polygon points="0,0 5,2.5 0,5" fill="#94a3b8" />
              </marker>
            </defs>
            <text x="30" y="20" fill="#94a3b8" fontSize="10" fontWeight="bold">AgNO₃</text>

            <text x="200" y="100" fill="#fbbf24" fontSize="11" textAnchor="middle" fontWeight="bold">
              {b.cl_chokma > 0 ? `${b.cl_chokma} AgCl ↓` : "Cho'kma yo'q!"}
            </text>
            <text x="200" y="195" fill="#c4b5fd" fontSize="9" textAnchor="middle">
              oq cho'kma
            </text>
          </svg>
        </div>

        {/* NATIJALAR JADVALI */}
        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Jami Cl</p>
            <p className="text-yellow-400 font-bold font-mono text-lg">{b.cl_jami}</p>
          </div>
          <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-lg p-3">
            <p className="text-emerald-400">Cho'kadi</p>
            <p className="text-emerald-400 font-bold font-mono text-lg">{b.cl_chokma}</p>
          </div>
          <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3">
            <p className="text-red-400">Ichki sfera</p>
            <p className="text-red-400 font-bold font-mono text-lg">{b.cl_ichki}</p>
          </div>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-3 font-mono text-xs text-center">
          <p className="text-emerald-400">{b.cl_chokma} Cl⁻ + {b.cl_chokma} Ag⁺ → {b.cl_chokma} AgCl ↓</p>
          <p className="text-purple-400 mt-1">{b.izoh}</p>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Tarixiy ahamiyati:</p>
          <p className="text-purple-200">
            Bu tajriba Werner'ga <strong>koordinatsion sfera</strong> tushunchasini yaratishga
            imkon berdi. Agar barcha Cl atomlari Co ga bog'langan bo'lsa (Kekule nazariyasi),
            <strong> hech qanday cho'kma</strong> bo'lmasligi kerak. Ammo 4 xil birikma 4 xil natija
            berdi — bu faqat Verner nazariyasi bilan tushuntiriladi!
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 6. UV-VIS SPEKTRI
// ============================================================================
function UVVisSpektr() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🌈 UV-Vis spektri — d-d o'tishlar</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-orange-700/30 space-y-4">
        <div className="bg-purple-950/50 rounded-lg p-4">
          <svg viewBox="0 0 400 200" className="w-full h-48">
            <line x1="40" y1="170" x2="380" y2="170" stroke="#4c1d95" strokeWidth="1" />
            <line x1="40" y1="20" x2="40" y2="170" stroke="#4c1d95" strokeWidth="1" />
            <text x="210" y="195" fill="#c4b5fd" fontSize="10" textAnchor="middle">λ (nm)</text>
            <text x="15" y="95" fill="#c4b5fd" fontSize="9" transform="rotate(-90, 15, 95)">A</text>

            {[400, 500, 600, 700].map((wl, i) => (
              <text key={i} x={40 + ((wl - 350) / 400) * 340} y="185" fill="#a78bfa" fontSize="8" textAnchor="middle">
                {wl}
              </text>
            ))}

            <polyline
              points={Array.from({ length: 100 }, (_, i) => {
                const wl = 400 + i * 3
                const x = 40 + ((wl - 350) / 400) * 340

                const p1 = Math.exp(-0.5 * Math.pow((wl - 475) / 30, 2)) * 80
                const p2 = Math.exp(-0.5 * Math.pow((wl - 340) / 25, 2)) * 100

                const y = 170 - (p1 + p2)
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke="#f97316" strokeWidth="2" />

            <line x1="160" y1="90" x2="160" y2="20" stroke="#eab308" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x="160" y="15" fill="#eab308" fontSize="8" textAnchor="middle">475 nm (¹T₁g)</text>

            <line x1="52" y1="70" x2="52" y2="25" stroke="#a78bfa" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x="52" y="20" fill="#a78bfa" fontSize="8" textAnchor="middle">340 nm (¹T₂g)</text>
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-yellow-400 font-bold mb-1">¹A<sub>1g</sub> → ¹T<sub>1g</sub></p>
            <p className="text-purple-200">λ<sub>max</sub> = 475 nm</p>
            <p className="text-purple-400 text-[10px]">ε ≈ 60 M⁻¹cm⁻¹ (spin-taqiqlangan)</p>
          </div>
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-yellow-400 font-bold mb-1">¹A<sub>1g</sub> → ¹T<sub>2g</sub></p>
            <p className="text-purple-200">λ<sub>max</sub> = 340 nm</p>
            <p className="text-purple-400 text-[10px]">ε ≈ 50 M⁻¹cm⁻¹ (UV soha)</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun sariq-to'q sariq rang?</p>
          <p className="text-purple-200">
            475 nm da (<strong>ko'k-binafsha</strong>) yutilish mavjud. Komplementar rang —
            <strong className="text-yellow-400"> sariq-to'q sariq</strong>.
            O'tishlar <strong>spin-taqiqlangan</strong> (¹ → ¹ ruxsat, lekin Laporte taqiqi — ε kichik).
          </p>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-emerald-400 font-bold text-xs mb-2">Term symbol tushuntirish:</h5>
          <div className="text-xs space-y-1 text-purple-200">
            <p><strong className="text-yellow-400">¹A<sub>1g</sub></strong> — ground state, singlet, simmetrik</p>
            <p><strong className="text-yellow-400">¹T<sub>1g</sub></strong> — birinchi qo'zg'algan holat</p>
            <p><strong className="text-yellow-400">¹T<sub>2g</sub></strong> — ikkinchi qo'zg'algan holat</p>
            <p className="text-purple-400 text-[10px] mt-2">
              Tanabe-Sugano diagrammasida (d⁶ LS) — 3 ta spin-ruxsat etilgan o'tish
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 7. KINETIK INERTLIK
// ============================================================================
function KinetikInertlik() {
  const [T, setT] = useState(25)

  const A = 1e12
  const Ea = 110
  const R = 8.314e-3
  const k = A * Math.exp(-Ea / (R * (T + 273.15)))
  const t_half = Math.log(2) / k

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⏱️ Kinetik inertlik — Co(III) LS ning o'ziga xosligi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-orange-700/30 space-y-4">
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">💎 [Co(NH₃)₆]³⁺ — kinetik inert!</p>
          <p className="text-purple-200 text-xs">
            Bu kompleks <strong>juda sekin</strong> ligand almashinadi. Suvda yillab
            barqaror turadi. Buning sababi — <strong>d⁶ LS konfiguratsiyasi</strong> va
            yuqori <strong>LFSE</strong> (Ligand Field Stabilization Energy).
          </p>
        </div>

        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">Harorat (T):</span>
            <span className="text-emerald-400 font-mono">{T}°C</span>
          </label>
          <input type="range" min="0" max="100" step="1" value={T}
            onChange={(e) => setT(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-orange-500" />
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-center">
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-purple-400">Tezlik konstantasi (k)</p>
            <p className="text-emerald-400 font-bold font-mono">{k.toExponential(2)} s⁻¹</p>
          </div>
          <div className="bg-orange-900/40 border border-orange-500/40 rounded-lg p-3">
            <p className="text-orange-400">Yarim yemirilish (t<sub>1/2</sub>)</p>
            <p className="text-white font-bold font-mono text-lg">
              {t_half < 60 ? `${t_half.toFixed(1)} s` :
               t_half < 3600 ? `${(t_half / 60).toFixed(1)} min` :
               t_half < 86400 ? `${(t_half / 3600).toFixed(1)} soat` :
               `${(t_half / 86400).toFixed(1)} kun`}
            </p>
          </div>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-emerald-400 font-bold text-xs mb-3">Taqqoslash — ligand almashinish tezligi:</h5>
          <div className="space-y-2 text-xs">
            {[
              { ion: "[Co(NH₃)₆]³⁺ (d⁶ LS)", t12: "~1 kun", barqaror: true },
              { ion: "[Co(H₂O)₆]²⁺ (d⁷ HS)", t12: "~10⁻⁶ s", barqaror: false },
              { ion: "[Fe(H₂O)₆]³⁺ (d⁵ HS)", t12: "~10⁻³ s", barqaror: false },
              { ion: "[Ni(H₂O)₆]²⁺ (d⁸)", t12: "~10⁻⁵ s", barqaror: false },
              { ion: "[Cr(H₂O)₆]³⁺ (d³)", t12: "~10 soat", barqaror: true },
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-44 text-purple-200">{c.ion}</span>
                <span className={`flex-1 text-center font-mono ${c.barqaror ? 'text-emerald-400' : 'text-red-400'}`}>
                  {c.t12}
                </span>
                <span className={c.barqaror ? 'text-emerald-400' : 'text-red-400'}>
                  {c.barqaror ? '🐢 Inert' : '⚡ Labil'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Taube qoidasi (1952):</p>
          <p className="text-purple-200">
            <strong>Inert komplekslar:</strong> t₂g³ (Cr³⁺), t₂g⁶ (Co³⁺ LS), t₂g⁶e<sub>g</sub>² (V²⁺)
            <br/>
            <strong>Labil komplekslar:</strong> t₂gⁿe<sub>g</sub>¹ (Cu²⁺, Cr²⁺), t₂g³e<sub>g</sub>² (Mn²⁺, Fe³⁺ HS)
            <br/>
            Sababi: <strong>e<sub>g</sub>*</strong> orbitali M-L anti-bonding — elektron bo'lsa, bog' kuchsiz, almashinish tez.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 8. SOLISHTIRISH — Co(III) komplekslari
// ============================================================================
function SolishtirishJadvali() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 Co(III) komplekslarining to'liq solishtirilishi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-orange-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-2 text-yellow-400">Kompleks</th>
                <th className="text-center py-3 px-2 text-yellow-400">Ligand</th>
                <th className="text-center py-3 px-2 text-yellow-400">Spin</th>
                <th className="text-center py-3 px-2 text-yellow-400">μ<sub>eff</sub></th>
                <th className="text-center py-3 px-2 text-yellow-400">Rang</th>
                <th className="text-center py-3 px-2 text-yellow-400">Kinetik</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["[Co(NH₃)₆]³⁺", "NH₃ (kuchli)", "LS", "0", "Sariq", "Inert"],
                ["[Co(en)₃]³⁺", "en (kuchli)", "LS", "0", "Sariq", "Inert"],
                ["[Co(CN)₆]³⁻", "CN⁻ (juda kuchli)", "LS", "0", "Rangsiz", "Inert"],
                ["[Co(H₂O)₆]³⁺", "H₂O (o'rtacha)", "LS", "0", "Ko'k-yashil", "O'rtacha"],
                ["[CoF₆]³⁻", "F⁻ (kuchsiz)", "HS", "4.9", "Ko'k", "Labil"],
                ["[CoCl₄]⁻", "Cl⁻ (kuchsiz)", "HS", "4.9", "Ko'k-yashil", "Labil"],
              ].map((r, i) => (
                <tr key={i} className={`border-b border-purple-800/30 ${i === 0 ? 'bg-orange-600/10' : ''} hover:bg-purple-800/20`}>
                  <td className="py-2 px-2 font-bold text-orange-400">{r[0]}</td>
                  <td className="py-2 px-2 text-center">{r[1]}</td>
                  <td className={`py-2 px-2 text-center font-bold ${r[2] === 'LS' ? 'text-blue-400' : 'text-red-400'}`}>
                    {r[2]}
                  </td>
                  <td className="py-2 px-2 text-center font-mono">{r[3]}</td>
                  <td className="py-2 px-2 text-center">{r[4]}</td>
                  <td className={`py-2 px-2 text-center ${r[5] === 'Inert' ? 'text-emerald-400' : r[5] === 'Labil' ? 'text-red-400' : 'text-yellow-400'}`}>
                    {r[5]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-purple-400 text-xs mt-3">
          * Kuchli maydon ligandlari (NH₃, en, CN⁻) → LS, diamagnit, inert
          <br/>
          * Kuchsiz maydon ligandlari (F⁻, Cl⁻) → HS, paramagnit, labil
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
      <h3 className="text-white font-semibold">🏛️ Tarixiy kontekst — Werner inqilobi</h3>

      <div className="bg-gradient-to-br from-orange-900/30 to-purple-900/30 rounded-xl p-5 border border-orange-500/30 space-y-4">
        <div className="space-y-3">
          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🎓</div>
              <div>
                <p className="text-yellow-400 font-bold">1893 — Alfred Werner (26 yoshda!)</p>
                <p className="text-purple-200 text-xs mt-1">
                  "Beiträge zur Theorie der Affinität und Valenz" — koordinatsion nazariya.
                  26 yoshli Shveytsariyalik kimyogar butun kimyoni o'zgartirdi!
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">⚔️</div>
              <div>
                <p className="text-yellow-400 font-bold">1893-1913 — 20 yillik kurash</p>
                <p className="text-purple-200 text-xs mt-1">
                  Kekule va Jorgensen (zamonaviy "kuchli kimyogarlar") Werner'ning nazariyasini
                  rad etishdi. Werner 15 yil davomida 100+ kompleks sintez qilib,
                  har biri uchun tajribalar o'tkazdi.
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
                  "Kimyoda bog'lanish tabiatini o'rganishdagi xizmatlari uchun".
                  [Co(NH₃)₆]Cl₃ va boshqa Co(III) komplekslari asosiy dalillar bo'ldi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🔬</div>
              <div>
                <p className="text-yellow-400 font-bold">1914 — Optik izomerlar</p>
                <p className="text-purple-200 text-xs mt-1">
                  Werner [Co(en)₃]³⁺ ning <strong>optik izomerlarini</strong> (Δ va Λ) ajratdi.
                  Bu uglerodsiz molekulada xirallikni birinchi isboti edi — tanqidchilar jim bo'lishdi.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Werner'ning 4 ta asosiy g'oyasi:</p>
          <ol className="text-purple-200 space-y-1 list-decimal list-inside">
            <li>Metallarning <strong>asosiy</strong> (oksidlanish) va <strong>yordamchi</strong> (koordinatsion) valentligi bor</li>
            <li>Yordamchi valentlik <strong>koordinatsion sfera</strong>ni hosil qiladi</li>
            <li>Koordinatsion son — odatda <strong>4 yoki 6</strong></li>
            <li>Komplekslar <strong>geometrik va optik izomerlarga</strong> ega bo'lishi mumkin</li>
          </ol>
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

      <div className="bg-purple-800/30 rounded-xl p-5 border border-orange-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">📚</div>
            <h4 className="text-yellow-400 font-bold mb-2">Ta'lim — klassik namuna</h4>
            <p className="text-purple-200 text-xs">
              Har bir kimyo talabasi [Co(NH₃)₆]³⁺ ni o'rganadi:
              <br/>• Koordinatsion nazariya tushuntirish
              <br/>• LFSE, kristall maydon
              <br/>• Kinetik inertlik
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🎨</div>
            <h4 className="text-yellow-400 font-bold mb-2">Pigmentlar</h4>
            <p className="text-purple-200 text-xs">
              Co(III) komplekslari barqaror rang beradi:
              <br/>• [Co(NH₃)₆]³⁺ — sariq
              <br/>• [Co(NH₃)₅Cl]²⁺ — binafsha
              <br/>• [Co(NH₃)₄Cl₂]⁺ — yashil
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">⚗️</div>
            <h4 className="text-yellow-400 font-bold mb-2">Kataliz va sintez</h4>
            <p className="text-purple-200 text-xs">
              Co(III) inertligi — "qulf" mexanizmi:
              <br/>• Murakkab ligandlarni "qulflash"
              <br/>• Template sintez
              <br/>• Molekulyar mashinalar
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🔬</div>
            <h4 className="text-yellow-400 font-bold mb-2">Mexanizm tadqiqotlari</h4>
            <p className="text-purple-200 text-xs">
              Inert komplekslar — sekin reaksiyalar:
              <br/>• Kinetikani o'rganish oson
              <br/>• Oraliq mahsulotlarni ushlash
              <br/>• SN1, SN2 mexanizmlarini farqlash
            </p>
          </div>
        </div>

        <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-lg p-4">
          <p className="text-emerald-400 font-bold mb-2">🌟 Vitamin B₁₂ bilan bog'liqlik:</p>
          <p className="text-purple-200 text-xs">
            Vitamin B₁₂ (kobalamin) — tabiatdagi <strong>yagona Co tarkibli molekula</strong>.
            Co(III) ning inertligi B₁₂ ning <strong>barqarorligini</strong> ta'minlaydi.
            Faol shakl — <strong>Co(I)</strong> (super nukleofil), lekin saqlash — Co(III) shaklida.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function CoNH36Cl3Magnit() {
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
          <span className="text-orange-400">[Co(NH₃)₆]Cl₃</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-orange-400">🧲 [Co(NH₃)₆]Cl₃ — Magnit tahlili</h1>
          <p className="text-purple-400 text-sm">
            Co³⁺ (LS, d⁶, t₂g⁶) • S=0 • Diamagnit • Werner klassikasi • Kinetik inert
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-orange-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-3xl md:text-5xl font-extrabold font-mono text-orange-400">[Co(NH₃)₆]Cl₃</span>
            <div>
              <h2 className="text-xl font-bold text-white">Magnit tahlili — to'liq profil</h2>
              <p className="text-purple-400">"Verner klassikasi" — koordinatsion kimyo poydevori</p>
            </div>
          </div>

          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              [Co(NH₃)₆]Cl₃ — <strong className="text-orange-400">Alfred Werner</strong> ning
              koordinatsion nazariyasini isbotlagan <strong>klassik kompleks</strong>.
              Co³⁺ (d⁶) kuchli maydon ligandi (NH₃) ta'sirida <strong>t₂g⁶ konfiguratsiya</strong>ga
              ega — barcha elektronlar juftlashgan. <strong>S = 0</strong>, <strong>diamagnit</strong>.
              Qo'shimcha ravishda, bu kompleks <strong>kinetik inert</strong> — yillab barqaror.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-orange-400 font-bold text-lg">S = 0</p>
              <p className="text-purple-300">LS, t₂g⁶</p>
              <p className="text-purple-400 mt-1">Diamagnit</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-orange-400 font-bold text-lg">μ = 0 μ<sub>B</sub></p>
              <p className="text-purple-300">n = 0</p>
              <p className="text-purple-400 mt-1">ideal mos</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-orange-400 font-bold text-lg">Δ<sub>o</sub> = 23000 cm⁻¹</p>
              <p className="text-purple-300">NH₃ maydon</p>
              <p className="text-purple-400 mt-1">Δ &gt; P</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-orange-400 font-bold text-lg">Inert</p>
              <p className="text-purple-300">kinetik</p>
              <p className="text-purple-400 mt-1">t<sub>1/2</sub> ~ 1 kun</p>
            </div>
          </div>
        </div>

        {/* WERNER NAZARIYASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <WernerNazariyasi />
        </div>

        {/* AGNO3 CHO'KTIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <AgNO3Choktirish />
        </div>

        {/* KONDUKTOMETRIYA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <Konduktometriya />
        </div>

        {/* KRISTALL MAYDON */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <CrystalFieldCo />
        </div>

        {/* SPIN-ONLY */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <SpinOnlyCalc />
        </div>

        {/* UV-VIS */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <UVVisSpektr />
        </div>

        {/* KINETIK INERTLIK */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <KinetikInertlik />
        </div>

        {/* SOLISHTIRISH */}
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
        <div className="bg-gradient-to-r from-orange-600/10 to-purple-600/10 border border-orange-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>[Co(NH₃)₆]Cl₃ — <strong className="text-orange-400">diamagnit</strong> (S=0, t₂g⁶, LS)</li>
            <li>μ<sub>eff</sub> = <strong>0 μ<sub>B</sub></strong> — spin-only bilan ideal mos</li>
            <li>Verner tajribasi: <strong>3 ta Cl⁻ tashqi sferada</strong>, AgNO₃ bilan darhol cho'kadi</li>
            <li>Konduktometriya: <strong>1:3 elektrolit</strong>, Λ<sub>m</sub> ≈ 430 S·cm²/mol</li>
            <li>Kristall maydon: Δ<sub>o</sub> = 23000 cm⁻¹ &gt; P = 21000 cm⁻¹ → LS</li>
            <li>Kinetik <strong className="text-orange-400">inert</strong> — t<sub>1/2</sub> ≈ 1 kun</li>
            <li>UV-Vis: 475 va 340 nm — ¹A<sub>1g</sub> → ¹T<sub>1g</sub>, ¹T<sub>2g</sub> o'tishlar</li>
            <li>Rang: <strong className="text-yellow-400">sariq-to'q sariq</strong> (475 nm komplementar)</li>
            <li>Tarixiy ahamiyati: <strong>Werner'ning koordinatsion nazariyasi</strong> uchun asosiy dalil (Nobel 1913)</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/magnit/birikmalar/k4-fe-cn6" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← K₄[Fe(CN)₆]
          </Link>
          <Link href="/ilmiy/tahlil/magnit/birikmalar/sisplatin" className="px-6 py-3 bg-orange-600/80 rounded-xl hover:bg-orange-500 text-white font-semibold">
            Sisplatin →
          </Link>
        </div>

      </section>
    </main>
  )
}