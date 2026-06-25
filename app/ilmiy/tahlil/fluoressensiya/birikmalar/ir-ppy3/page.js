"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. EMISSION SPEKTR SIMULYATORI ([Ir(ppy)₃] uchun)
// ============================================================================
function EmissionSpectrumSimulator() {
  const [excitation, setExcitation] = useState(380)
  const [intensity, setIntensity] = useState(100)
  const [film, setFilm] = useState("eritma")

  // Ir³⁺ ning ³MLCT/³LC emission cho'qqilari
  const peaks = [
    { lambda: 480, intensity: 0.5, assign: "³MLCT/³LC" },
    { lambda: 515, intensity: 1.0, assign: "³MLCT/³LC (max)" },
    { lambda: 550, intensity: 0.6, assign: "³MLCT/³LC" },
  ]

  // Film vs eritma ta'siri
  const filmFactors = {
    "eritma": 1.0,
    "spin-coat": 0.85,
    "evaporatsiya": 0.90,
    "host-guest": 0.95
  }
  const filmFactor = film[film]

  const intFactor = (intensity / 100) * filmFactor

  // Emission spektri
  const spectrum = useMemo(() => {
    const points = []
    for (let i = 0; i < 400; i++) {
      const lambda = 400 + i * 0.75 // 400-700 nm
      let emission = 0

      peaks.forEach(peak => {
        // MLCT/LC uchun o'rtacha kenglik (FWHM ≈ 60 nm)
        const x = (lambda - peak.lambda) / 30
        emission += peak.intensity * Math.exp(-0.5 * x * x) * intFactor
      })

      points.push({ lambda, emission })
    }
    return points
  }, [intensity, film, intFactor])

  const maxEmission = Math.max(...spectrum.map(p => p.emission), 0.1)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">💡 Emission spektr simulyatori — [Ir(ppy)₃]</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-lime-700/30 space-y-4">
        <div className="bg-lime-600/10 border border-lime-500/30 rounded-lg p-4">
          <p className="text-lime-400 font-bold mb-2">💎 OLED yulduzi — yuqori samaradorlik:</p>
          <p className="text-purple-200 text-xs">
            [Ir(ppy)₃] — <strong>OLED texnologiyasida eng ko'p qo'llaniladigan kompleks</strong>.
            Ir³⁺ (5d⁶) — <strong>og'ir atom</strong>, kuchli spin-orbital coupling → ISC juda tez →
            <strong> triplet holatdan samarali nurlanish</strong>. <strong>Φ ≈ 0.40</strong> —
            Ru(bpy)₃²⁺ dan <strong>10 marta yuqori</strong>! <strong>τ ≈ 2 μs</strong> — OLED uchun ideal.
          </p>
        </div>

        {/* BOSHQARUV */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">Qo'zg'alish to'lqin uzunligi:</span>
              <span className="text-emerald-400 font-mono">{excitation} nm</span>
            </label>
            <input type="range" min="300" max="450" step="5" value={excitation}
              onChange={(e) => setExcitation(parseInt(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-lime-500" />
            <p className="text-purple-400 text-[10px] mt-1">
              Optimal: 380 nm (MLCT/IL yutish)
            </p>
          </div>
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">Intensivlik:</span>
              <span className="text-emerald-400 font-mono">{intensity}%</span>
            </label>
            <input type="range" min="10" max="100" step="5" value={intensity}
              onChange={(e) => setIntensity(parseInt(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-lime-500" />
          </div>
        </div>

        <div>
          <label className="text-xs text-yellow-400 font-bold mb-2 block">Qo'llanilish shakli:</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: "eritma", name: "Eritma", factor: "1.0" },
              { id: "spin-coat", name: "Spin-coat", factor: "0.85" },
              { id: "evaporatsiya", name: "Evap.", factor: "0.90" },
              { id: "host-guest", name: "Host-guest", factor: "0.95" }
            ].map(s => (
              <button key={s.id} onClick={() => setFilm(s.id)}
                className={`px-2 py-2 rounded-lg text-[10px] font-bold transition-all ${
                  film === s.id 
                    ? "bg-lime-600/80 text-white shadow-lg" 
                    : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
                }`}>
                <div>{s.name}</div>
                <div className="text-[9px] opacity-70 mt-1">Φ×{s.factor}</div>
              </button>
            ))}
          </div>
        </div>

        {/* SPEKTR */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-lime-400 font-bold text-xs mb-2">
            Emission spektri ({film}, λ<sub>exc</sub> = {excitation} nm)
          </h5>
          <svg viewBox="0 0 400 280" className="w-full h-64">
            <line x1="40" y1="240" x2="380" y2="240" stroke="#4c1d95" strokeWidth="1" />
            <line x1="40" y1="20" x2="40" y2="240" stroke="#4c1d95" strokeWidth="1" />
            
            <text x="210" y="275" fill="#c4b5fd" fontSize="9" textAnchor="middle">λ (nm)</text>
            <text x="40" y="270" fill="#a78bfa" fontSize="8">400</text>
            <text x="380" y="270" fill="#a78bfa" fontSize="8" textAnchor="end">700</text>
            <text x="20" y="130" fill="#a78bfa" fontSize="8" textAnchor="middle" transform="rotate(-90, 20, 130)">
              Intensivlik
            </text>

            {/* λ_max belgisi */}
            <line x1={40 + ((515 - 400) / 300) * 340} y1="20" 
              x2={40 + ((515 - 400) / 300) * 340} y2="240"
              stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x={40 + ((515 - 400) / 300) * 340} y="15" 
              fill="#fbbf24" fontSize="7" textAnchor="middle">
              515 nm (³MLCT/³LC max)
            </text>

            {/* Emission spektri */}
            <polyline
              points={spectrum.map((p, i) => {
                const x = 40 + (i / 400) * 340
                const y = 240 - (p.emission / maxEmission) * 210
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke="#84cc16" strokeWidth="2"
            />

            <text x="200" y="35" fill="#84cc16" fontSize="9" textAnchor="middle" fontWeight="bold">
              Ir³⁺ — yashil emissiya (515 nm)
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          <div className="bg-lime-900/30 border border-lime-500/50 rounded-lg p-3">
            <p className="text-lime-400">Asosiy cho'qqi</p>
            <p className="text-emerald-400 font-bold">515 nm</p>
            <p className="text-purple-400 text-[10px]">³MLCT/³LC</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Shakl</p>
            <p className="text-emerald-400 font-bold">{film}</p>
            <p className="text-purple-400 text-[10px]">Φ×{filmFactor}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">FWHM</p>
            <p className="text-yellow-400 font-bold">~60 nm</p>
            <p className="text-purple-400 text-[10px]">o'rtacha kenglik</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun yashil OLED da eng ko'p?</p>
          <p className="text-purple-200">
            Inson ko'zi <strong>yashil rangga eng sezgir</strong> (555 nm).
            <br/>
            [Ir(ppy)₃] ning 515 nm emissiyasi ko'z sezgirligiga yaqin → <strong>yuqori samaradorlik</strong>.
            <br/>
            Bundan tashqari, <strong>NTSC standartiga</strong> mos yashil rang beradi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. PPY LIGAND STRUKTURASI — SIKLOMETALLANGAN
// ============================================================================
function PpyLigand() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔗 ppy ligand — siklometallangan 2-fenilpiridin</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-lime-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-lime-400 font-bold mb-3">ppy strukturasi:</h4>
            <svg viewBox="0 0 200 200" className="w-full h-48">
              {/* Piridin halqasi */}
              <polygon points="60,60 80,50 100,60 100,80 80,90 60,80" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
              
              {/* Fenil halqasi */}
              <polygon points="100,80 120,90 120,110 100,120 80,110 80,90" fill="none" stroke="#a78bfa" strokeWidth="1.5" />

              {/* Bog' */}
              <line x1="100" y1="60" x2="100" y2="80" stroke="#a78bfa" strokeWidth="2" />

              {/* N atomi */}
              <circle cx="60" cy="80" r="6" fill="#3b82f6" />
              <text x="60" y="83" fill="white" fontSize="6" textAnchor="middle">N</text>

              {/* C atomi (siklometallangan) */}
              <circle cx="80" cy="90" r="6" fill="#ef4444" />
              <text x="80" y="93" fill="white" fontSize="6" textAnchor="middle">C</text>

              {/* Ir ga bog'lanish */}
              <line x1="60" y1="80" x2="40" y2="120" stroke="#84cc16" strokeWidth="2" />
              <line x1="80" y1="90" x2="40" y2="120" stroke="#84cc16" strokeWidth="2" />
              
              <circle cx="40" cy="120" r="10" fill="#84cc16" />
              <text x="40" y="124" fill="white" fontSize="8" textAnchor="middle" fontWeight="bold">Ir</text>

              {/* Siklometallash belgisi */}
              <path d="M 60 80 Q 70 85 80 90" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2,2" />
              <text x="90" y="105" fill="#ef4444" fontSize="7">C^N</text>

              <text x="100" y="160" fill="#a78bfa" fontSize="8" textAnchor="middle">
                2-fenilpiridin (ppy)
              </text>
              <text x="100" y="175" fill="#ef4444" fontSize="7" textAnchor="middle">
                Siklometallangan (C^N)
              </text>
              <text x="100" y="190" fill="#84cc16" fontSize="7" textAnchor="middle">
                Bidentat (C,N)
              </text>
            </svg>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-lime-400 font-bold mb-3">Xususiyatlari:</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Turi:</span>
                <span className="text-lime-400 font-bold">Siklometallangan (C^N)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Xelat atomlari:</span>
                <span className="text-lime-400">C + N (bidentat)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Zaryad:</span>
                <span className="text-lime-400">1− (anion)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">λ<sub>abs</sub>:</span>
                <span className="text-lime-400">~280 nm (IL)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">MLCT yutish:</span>
                <span className="text-lime-400">~380 nm</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">π-elektronlar:</span>
                <span className="text-lime-400">10 (ikki halqa)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">σ-donor:</span>
                <span className="text-lime-400">Kuchli (C)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Siklometallash nima?</p>
          <p className="text-purple-200">
            <strong>Siklometallash</strong> — ligandning <strong>C-H bog'i uziladi</strong> va metall bilan <strong>M-C bog'</strong> hosil bo'ladi.
            <br/>
            Natijada ligand <strong>anion</strong> bo'ladi (1− zaryad).
            <br/>
            <strong>C atomi</strong> — kuchli σ-donor → metall d-orbitallarini yuqori energiyaga ko'taradi →
            <strong>MLCT o'tish energiyasi kamayadi</strong> → emissiya ko'rinadigan sohaga siljiydi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. ³MLCT/³LC MECHANIZMI
// ============================================================================
function MLCTLCMexanizmi() {
  const [step, setStep] = useState(0)

  const steps = [
    {
      title: "1. IL/MLCT yutish",
      desc: "Ligand ichki (IL) yoki MLCT o'tish orqali qo'zg'alish",
      formula: "Ir³⁺(ppy)₃ + hν (380 nm) → ¹MLCT/¹LC",
      icon: "💡"
    },
    {
      title: "2. ISC — ¹ → ³ (juda tez)",
      desc: "Og'ir atom effekti (Ir, Z=77) → ISC ~100 fs ichida",
      formula: "¹MLCT/¹LC → ³MLCT/³LC",
      icon: "🔄"
    },
    {
      title: "3. ³MLCT/³LC aralash holat",
      desc: "Triplet holatda ~2 μs yashaydi — aralash xarakter",
      formula: "³MLCT/³LC — metastabil",
      icon: "⏱️"
    },
    {
      title: "4. Fosforessensiya",
      desc: "³MLCT/³LC → ¹GS o'tish → yashil nurlanish (515 nm)",
      formula: "³MLCT/³LC → Ir³⁺(ppy)₃ + hν' (515 nm)",
      icon: "✨"
    }
  ]

  const s = steps[step]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚡ ³MLCT/³LC mexanizmi — aralash xarakter</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-lime-700/30 space-y-4">
        <div className="bg-lime-600/10 border border-lime-500/30 rounded-lg p-4">
          <p className="text-lime-400 font-bold mb-2">💎 Aralash xarakter:</p>
          <p className="text-purple-200 text-xs">
            [Ir(ppy)₃] da emissiya <strong>³MLCT</strong> (metalldan ligandga) va <strong>³LC</strong> (ligand ichki)
            o'tishlarning <strong>aralashmasi</strong>. Bu Ru(bpy)₃²⁺ dan farqli — u faqat ³MLCT.
            <br/>
            Sababi: ppy ning <strong>kengaytirilgan π-sistemasi</strong> → LC o'tishlar past energiyada →
            MLCT bilan aralashadi.
          </p>
        </div>

        {/* STEP NAVIGATION */}
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <button key={i} onClick={() => setStep(i)}
              className={`flex-1 px-2 py-2 rounded-lg text-xs font-bold transition-all ${
                step === i 
                  ? "bg-lime-600/80 text-white shadow-lg" 
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
            <h4 className="text-lime-400 font-bold text-lg">{s.title}</h4>
          </div>
          <p className="text-purple-200 text-sm mb-3">{s.desc}</p>
          <div className="bg-purple-900/50 rounded p-3 font-mono text-xs text-center text-emerald-400">
            {s.formula}
          </div>
        </div>

        {/* VIZUALIZATSIYA */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-lime-400 font-bold text-xs mb-3">Energiya sathlari diagrammasi:</h5>
          <svg viewBox="0 0 400 250" className="w-full h-60">
            <line x1="50" y1="230" x2="50" y2="20" stroke="#4c1d95" strokeWidth="1" />
            <text x="30" y="125" fill="#c4b5fd" fontSize="9" textAnchor="middle" transform="rotate(-90, 30, 125)">
              Energiya
            </text>

            {/* Ground state */}
            <rect x="80" y="200" width="80" height="20" fill="#3b82f6" opacity="0.3" />
            <text x="120" y="215" fill="#3b82f6" fontSize="9" textAnchor="middle">¹GS</text>

            {/* ¹MLCT/¹LC */}
            <rect x="80" y="60" width="80" height="20" fill="#f59e0b" opacity="0.3" />
            <text x="120" y="75" fill="#f59e0b" fontSize="9" textAnchor="middle">¹MLCT/¹LC</text>

            {/* ³MLCT/³LC */}
            <rect x="80" y="100" width="80" height="20" fill="#ef4444" opacity="0.3" />
            <text x="120" y="115" fill="#ef4444" fontSize="9" textAnchor="middle">³MLCT/³LC</text>

            {/* O'tishlar */}
            <line x1="120" y1="200" x2="120" y2="80" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrowY)" />
            <text x="135" y="140" fill="#fbbf24" fontSize="8">hν (380 nm)</text>

            <path d="M 160 70 Q 180 85 160 100" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="3,2" />
            <text x="190" y="85" fill="#8b5cf6" fontSize="8">ISC (~100 fs)</text>

            <line x1="120" y1="120" x2="120" y2="200" stroke="#84cc16" strokeWidth="2" markerEnd="url(#arrowG)" />
            <text x="135" y="160" fill="#84cc16" fontSize="8">hν' (515 nm)</text>

            <text x="250" y="50" fill="#c4b5fd" fontSize="8">Singlet (S=0)</text>
            <text x="250" y="110" fill="#c4b5fd" fontSize="8">Triplet (S=1)</text>

            <defs>
              <marker id="arrowY" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
                <polygon points="0,0 5,2.5 0,5" fill="#fbbf24" />
              </marker>
              <marker id="arrowG" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
                <polygon points="0,0 5,2.5 0,5" fill="#84cc16" />
              </marker>
            </defs>
          </svg>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun Φ yuqori?</p>
          <p className="text-purple-200">
            <strong>Ir (Z=77)</strong> — Ru (Z=44) dan og'irroq → <strong>spin-orbital coupling kuchliroq</strong>
            <br/>
            ISC <strong>~100 fs</strong> ichida → deyarli barcha molekula tripletga o'tadi
            <br/>
            Triplet holatdan <strong>samarali nurlanish</strong> → Φ ≈ 0.40 (Ru dan 10× yuqori)
            <br/>
            Bu <strong>og'ir atom effektining</strong> ajoyib namoyishi!
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. OG'IR ATOM EFFEKTI — Ru vs Ir
// ============================================================================
function OgirAtomEffekti() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚛️ Og'ir atom effekti — Ru vs Ir</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-lime-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-2 text-yellow-400">Xususiyat</th>
                <th className="text-center py-3 px-2 text-orange-400">Ru (Z=44)</th>
                <th className="text-center py-3 px-2 text-lime-400">Ir (Z=77)</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["Atom raqami", "44", "77"],
                ["Atom massasi", "101", "192"],
                ["Spin-orbital coupling", "O'rtacha", "Kuchli"],
                ["ISC tezligi", "~1 ps", "~100 fs"],
                ["Φ (eritmada)", "0.04", "0.40"],
                ["τ", "600 ns", "2 μs"],
                ["Emissiya turi", "³MLCT", "³MLCT/³LC"],
                ["Spektr kengligi", "~80 nm", "~60 nm"],
                ["Kislorod ta'siri", "Kuchli", "O'rtacha"],
                ["Narx", "O'rtacha", "Qimmat"],
              ].map((r, i) => (
                <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-2 px-2 font-bold text-purple-300">{r[0]}</td>
                  <td className="py-2 px-2 text-center text-orange-400">{r[1]}</td>
                  <td className="py-2 px-2 text-center text-lime-400">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 bg-lime-600/10 border border-lime-500/30 rounded-lg p-3 text-xs">
          <p className="text-lime-400 font-bold mb-1">💡 Og'ir atom effekti formulasi:</p>
          <p className="text-purple-200">
            <strong>Spin-orbital coupling ∝ Z⁴</strong> — atom raqamining 4-darajasiga proporsional
            <br/>
            Ir (Z=77) / Ru (Z=44) = (77/44)⁴ ≈ <strong>9.5 marta kuchli</strong>
            <br/>
            Shuning uchun Ir komplekslarida ISC <strong>juda tez</strong> → triplet samaradorligi yuqori → Φ yuqori.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. Φ VA TAU
// ============================================================================
function PhiVaTau() {
  const [temperature, setTemperature] = useState(298)

  // Harorat ta'siri
  const phi = Math.max(0.1, 0.40 * (1 - (temperature - 298) / 500))
  const tau = Math.max(0.5, 2.0 * (1 - (temperature - 298) / 500))

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📊 Kvant unumi va yashash vaqti</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-lime-700/30 space-y-4">
        <div className="bg-lime-600/10 border border-lime-500/30 rounded-lg p-4">
          <p className="text-lime-400 font-bold mb-2">💎 Yuqori samaradorlik:</p>
          <p className="text-purple-200 text-xs">
            [Ir(ppy)₃] — <strong>Φ ≈ 0.40</strong> va <strong>τ ≈ 2 μs</strong>.
            Bu ko'rsatkichlar Ru(bpy)₃²⁺ dan <strong>10 marta yuqori</strong>.
            Sababi: og'ir atom effekti + siklometallangan ligand.
          </p>
        </div>

        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">Harorat:</span>
            <span className="text-emerald-400 font-mono">{temperature} K</span>
          </label>
          <input type="range" min="100" max="400" step="10" value={temperature}
            onChange={(e) => setTemperature(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-lime-500" />
          <div className="flex justify-between text-[10px] text-purple-400 mt-1">
            <span>100 K (suyuq N₂)</span>
            <span>298 K (xona)</span>
            <span>400 K</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-center">
          <div className="bg-lime-900/30 border border-lime-500/50 rounded-lg p-3">
            <p className="text-lime-400">Kvant unumi (Φ)</p>
            <p className="text-emerald-400 font-bold font-mono text-2xl">{phi.toFixed(2)}</p>
            <p className="text-purple-400 text-[10px]">{phi > 0.35 ? "✓ Juda yuqori" : phi > 0.2 ? "○ Yuqori" : "✗ O'rtacha"}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Yashash vaqti (τ)</p>
            <p className="text-emerald-400 font-bold font-mono text-2xl">{tau.toFixed(1)} μs</p>
            <p className="text-purple-400 text-[10px]">{tau > 1.5 ? "✓ Uzoq" : tau > 1.0 ? "○ O'rtacha" : "✗ Qisqa"}</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Harorat ta'siri:</p>
          <p className="text-purple-200">
            Harorat oshishi → <strong>tebranish relaksatsiyasi</strong> kuchayadi → nurlanishsiz yo'qotishlar oshadi
            <br/>
            Φ va τ <strong>kamayadi</strong>.
            <br/>
            OLED qurilmalarida <strong>xona haroratida</strong> ishlashi kerak → yuqori Φ muhim.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 6. OLED QO'LLANILISHI
// ============================================================================
function OLEDQollanilishi() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📱 OLED texnologiyasida [Ir(ppy)₃]</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-lime-700/30 space-y-4">
        <div className="bg-lime-600/10 border border-lime-500/30 rounded-lg p-4">
          <p className="text-lime-400 font-bold mb-2">💎 OLED nima?</p>
          <p className="text-purple-200 text-xs">
            <strong>OLED (Organic Light-Emitting Diode)</strong> — organik materiallar asosida yorug'lik chiqaradigan qurilma.
            [Ir(ppy)₃] — <strong>yashil emissiya</strong> uchun eng ko'p qo'llaniladigan <strong>fosforessent dopant</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-lime-400 font-bold mb-3">OLED strukturasi:</h4>
            <svg viewBox="0 0 200 200" className="w-full h-48">
              {/* Qatlamlar */}
              <rect x="20" y="20" width="160" height="30" fill="#6b7280" opacity="0.5" />
              <text x="100" y="40" fill="white" fontSize="8" textAnchor="middle">Katod (Al)</text>

              <rect x="20" y="50" width="160" height="30" fill="#84cc16" opacity="0.5" />
              <text x="100" y="70" fill="white" fontSize="8" textAnchor="middle">Emitting layer</text>
              <text x="100" y="78" fill="#84cc16" fontSize="7" textAnchor="middle">[Ir(ppy)₃] dopant</text>

              <rect x="20" y="80" width="160" height="30" fill="#3b82f6" opacity="0.5" />
              <text x="100" y="100" fill="white" fontSize="8" textAnchor="middle">HTL</text>

              <rect x="20" y="110" width="160" height="30" fill="#f59e0b" opacity="0.5" />
              <text x="100" y="130" fill="white" fontSize="8" textAnchor="middle">ETL</text>

              <rect x="20" y="140" width="160" height="30" fill="#a78bfa" opacity="0.5" />
              <text x="100" y="160" fill="white" fontSize="8" textAnchor="middle">Anod (ITO)</text>

              <rect x="20" y="170" width="160" height="20" fill="#6b7280" opacity="0.3" />
              <text x="100" y="185" fill="white" fontSize="8" textAnchor="middle">Substrat (shisha)</text>
            </svg>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-lime-400 font-bold mb-3">Afzalliklari:</h4>
            <ul className="text-purple-200 text-xs space-y-2">
              <li>✓ <strong>Ichki kvant unumi 100%</strong> — barcha singlet va triplet ishlatiladi</li>
              <li>✓ <strong>Yuqori samaradorlik</strong> — kam energiya sarfi</li>
              <li>✓ <strong>Uzoq umr</strong> — 10,000 soatdan ortiq</li>
              <li>✓ <strong>Yashil rang</strong> — ko'z uchun optimal</li>
              <li>✓ <strong>Arzon</strong> — keng miqyosda ishlab chiqarish</li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun fosforessensiya muhim?</p>
          <p className="text-purple-200">
            <strong>Fluoressent materiallar</strong> — faqat singlet ishlatadi → maksimal Φ = 25%
            <br/>
            <strong>Fosforessent materiallar</strong> (Ir, Pt) — singlet + triplet ishlatadi → <strong>Φ = 100%</strong>
            <br/>
            [Ir(ppy)₃] — <strong>birinchi tijorat fosforessent OLED materiali</strong> (2000-yillar boshi).
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 7. QO'LLANILISH
// ============================================================================
function Qollanilish() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🏭 Amaliy qo'llanilishi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-lime-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">📱</div>
            <h4 className="text-lime-400 font-bold mb-2">OLED displeylar</h4>
            <p className="text-purple-200 text-xs">
              Samsung, LG, Apple — barchasi [Ir(ppy)₃] asosidagi yashil OLED ishlatadi.
              <br/>
              Smartfon, televizor, soat displeylari.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">💡</div>
            <h4 className="text-lime-400 font-bold mb-2">Yoritish</h4>
            <p className="text-purple-200 text-xs">
              OLED yoritish panellari — <strong>energiya tejovchi</strong>, <strong>yumshoq yorug'lik</strong>.
              <br/>
              Uy, ofis, avtomobil ichki yoritishi.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🔬</div>
            <h4 className="text-lime-400 font-bold mb-2">Sensorlar</h4>
            <p className="text-purple-200 text-xs">
              Kislorod, harorat, pH sensorlari.
              <br/>
              τ o'lchash orqali analit konsentratsiyasi aniqlanadi.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">⚡</div>
            <h4 className="text-lime-400 font-bold mb-2">Fotokataliz</h4>
            <p className="text-purple-200 text-xs">
              Organik sintez — fotoredoks kataliz.
              <br/>
              C-H faollashtirish, cross-coupling reaksiyalari.
            </p>
          </div>
        </div>

        <div className="bg-lime-600/10 border border-lime-500/30 rounded-lg p-4">
          <p className="text-lime-400 font-bold mb-2">🌟 Qiziqarli fakt:</p>
          <p className="text-purple-200 text-xs">
            [Ir(ppy)₃] — <strong>eng muvaffaqiyatli OLED materiali</strong>.
            <br/>
            Har yili <strong>milliardlab dollar</strong>lik OLED mahsulotlarida ishlatiladi.
            <br/>
            Samsung Galaxy, iPhone X dan boshlab barcha premium smartfonlarda [Ir(ppy)₃] asosidagi yashil piksellar bor!
            <br/>
            Bu <strong>koordinatsion kimyoning</strong> kundalik hayotga eng katta ta'siri.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function IrPpy3Fluoressensiya() {
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
          <span className="text-lime-400">[Ir(ppy)₃]</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-lime-400">💡 [Ir(ppy)₃] — Fluoressensiya tahlili</h1>
          <p className="text-purple-400 text-sm">
            Ir³⁺ • Siklometallangan • OLED yulduzi • Φ ≈ 0.40 • τ ≈ 2 μs • Yashil emissiya
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-lime-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-4xl md:text-5xl font-extrabold font-mono text-lime-400">[Ir(ppy)₃]</span>
            <div>
              <h2 className="text-xl font-bold text-white">Fluoressensiya tahlili — to'liq profil</h2>
              <p className="text-purple-400">"OLED yulduzi" — yashil fosforessensiya klassikasi</p>
            </div>
          </div>

          <div className="bg-lime-600/10 border border-lime-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              [Ir(ppy)₃] — <strong className="text-lime-400">OLED texnologiyasining eng muvaffaqiyatli materiali</strong>.
              Ir³⁺ (5d⁶) <strong>uchta siklometallangan ppy ligand</strong> bilan o'ralgan.
              <strong> ³MLCT/³LC</strong> aralash o'tish orqali <strong>yashil fosforessensiya</strong> (515 nm) chiqaradi.
              <strong> Φ ≈ 0.40</strong> va <strong>τ ≈ 2 μs</strong> — Ru(bpy)₃²⁺ dan 10 marta yuqori!
              Og'ir atom effekti (Ir, Z=77) → ISC juda tez → triplet samaradorligi yuqori.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-lime-400 font-bold text-lg">Ir³⁺ (5d⁶)</p>
              <p className="text-purple-300">og'ir atom</p>
              <p className="text-purple-400 mt-1">S = 0</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-lime-400 font-bold text-lg">λ<sub>em</sub> = 515</p>
              <p className="text-purple-300">nm</p>
              <p className="text-purple-400 mt-1">yashil</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-lime-400 font-bold text-lg">Φ ≈ 0.40</p>
              <p className="text-purple-300">kvant unumi</p>
              <p className="text-purple-400 mt-1">10× Ru dan</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-lime-400 font-bold text-lg">τ ≈ 2</p>
              <p className="text-purple-300">μs</p>
              <p className="text-purple-400 mt-1">fosforessensiya</p>
            </div>
          </div>
        </div>

        {/* EMISSION SPEKTR SIMULYATORI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <EmissionSpectrumSimulator />
        </div>

        {/* PPY LIGAND */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <PpyLigand />
        </div>

        {/* MLCT/LC MECHANIZMI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <MLCTLCMexanizmi />
        </div>

        {/* OG'IR ATOM EFFEKTI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <OgirAtomEffekti />
        </div>

        {/* PHI VA TAU */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <PhiVaTau />
        </div>

        {/* OLED QO'LLANILISHI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <OLEDQollanilishi />
        </div>

        {/* QO'LLANILISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <Qollanilish />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-lime-600/10 to-purple-600/10 border border-lime-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>[Ir(ppy)₃] — <strong className="text-lime-400">OLED texnologiyasining yulduzi</strong></li>
            <li>Ir³⁺ (5d⁶) — <strong>og'ir atom</strong>, kuchli spin-orbital coupling</li>
            <li><strong>Siklometallangan ppy</strong> ligand — C^N bidentat</li>
            <li><strong>³MLCT/³LC</strong> aralash o'tish — yashil emissiya (515 nm)</li>
            <li><strong>Φ ≈ 0.40</strong> — Ru(bpy)₃²⁺ dan 10 marta yuqori</li>
            <li><strong>τ ≈ 2 μs</strong> — fosforessensiya uchun ideal</li>
            <li><strong>ISC ~100 fs</strong> — juda tez, triplet samaradorligi yuqori</li>
            <li><strong>Ichki kvant unumi 100%</strong> — singlet + triplet ishlatiladi</li>
            <li>Qo'llanilish: OLED displeylar, yoritish, sensorlar, fotokataliz</li>
            <li>Eng muvaffaqiyatli koordinatsion birikma — milliardlab dollarlik bozor</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/fluoressensiya/birikmalar/ru-bpy3" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← [Ru(bpy)₃]²⁺
          </Link>
          <Link href="/ilmiy/tahlil/fluoressensiya/birikmalar/re-bpy-co3-cl" className="px-6 py-3 bg-lime-600/80 rounded-xl hover:bg-lime-500 text-white font-semibold">
            [Re(bpy)(CO)₃Cl] →
          </Link>
        </div>

      </section>
    </main>
  )
}