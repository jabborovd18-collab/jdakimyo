"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. SPIN-ONLY KALKULYATORI (Ni²⁺ d⁸ kvadrat tekislik)
// ============================================================================
function SpinOnlyCalc() {
  const [n, setN] = useState(0)
  const mu_so = Math.sqrt(n * (n + 2))

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🧮 Spin-only magnit momenti</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-emerald-700/30 space-y-4">
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
            className="w-full h-2 bg-purple-900 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
          <div className="flex justify-between text-[10px] text-purple-400 mt-1">
            <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-center">
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Hisoblash</p>
            <p className="text-purple-200 font-mono">√({n}·{n + 2})</p>
          </div>
          <div className="bg-emerald-900/40 border border-emerald-500/40 rounded-lg p-3">
            <p className="text-emerald-400">Natija</p>
            <p className="text-emerald-400 font-bold font-mono text-lg">{mu_so.toFixed(3)} μ<sub>B</sub></p>
          </div>
        </div>

        <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-lg p-3 text-xs">
          <p className="text-emerald-400 font-bold mb-1">✅ [Ni(CN)₄]²⁻ uchun:</p>
          <p className="text-purple-200">
            Ni²⁺ (d⁸) <strong>kvadrat tekislik</strong> geometriyasida. CN⁻ kuchli maydon ligandi
            bo'lgani uchun barcha 8 ta elektron <strong>pastki 4 ta orbitalda</strong> juftlashadi.
            Eng yuqori d<sub>x²-y²</sub> orbitali <strong>bo'sh</strong> qoladi.
            <strong> n = 0</strong>, S = 0 → μ<sub>eff</sub> = <strong>0 μ<sub>B</sub></strong> —
            <strong> mukammal diamagnit</strong>.
          </p>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 d⁸ ionlari — har doim bir xilmi?</p>
          <p className="text-purple-200">
            <strong>Yo'q!</strong> Geometriya va ligand maydoni muhim:
            <br/>• <strong>Kvadrat tekislik</strong> (CN⁻, CO, PR₃) → <span className="text-emerald-400">diamagnit</span> (n=0)
            <br/>• <strong>Tetraedrik</strong> (Cl⁻, Br⁻) → <span className="text-red-400">paramagnit</span> (n=2)
            <br/>• <strong>Oktaedrik</strong> (H₂O) → <span className="text-red-400">paramagnit</span> (n=2)
            <br/>
            Bir xil Ni²⁺ (d⁸), lekin <strong>butunlay boshqa magnit xossasi</strong>!
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. KVADRAT TEKISLIK KRISTALL MAYDON — d⁸
// ============================================================================
function CrystalFieldSquarePlanar() {
  const [geometry, setGeometry] = useState("square")

  const geometries = {
    square: {
      name: "Kvadrat tekislik",
      formula: "[Ni(CN)₄]²⁻",
      ligand: "CN⁻ (kuchli)",
      n: 0,
      magnit: "Diamagnit",
      color: "bg-emerald-900/30 border-emerald-500/30",
      textColor: "text-emerald-400"
    },
    tetrahedral: {
      name: "Tetraedrik",
      formula: "[NiCl₄]²⁻",
      ligand: "Cl⁻ (kuchsiz)",
      n: 2,
      magnit: "Paramagnit",
      color: "bg-red-900/30 border-red-500/30",
      textColor: "text-red-400"
    },
    octahedral: {
      name: "Oktaedrik",
      formula: "[Ni(H₂O)₆]²⁺",
      ligand: "H₂O (o'rtacha)",
      n: 2,
      magnit: "Paramagnit",
      color: "bg-orange-900/30 border-orange-500/30",
      textColor: "text-orange-400"
    }
  }

  const g = geometries[geometry]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔬 Kristall maydon — Ni²⁺ (d⁸) geometriyasi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-emerald-700/30 space-y-4">
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">💎 d⁸ ionlari — geometriyaga bog'liq:</p>
          <p className="text-purple-200 text-xs">
            Ni²⁺ (d⁸) <strong>uch xil geometriyada</strong> bo'lishi mumkin.
            Qaysi geometriya afzalligi <strong>ligand maydoni kuchiga</strong> bog'liq.
            Kuchli ligandlar (CN⁻) → kvadrat tekislik → diamagnit.
            Kuchsiz ligandlar (Cl⁻) → tetraedrik → paramagnit.
          </p>
        </div>

        {/* GEOMETRIYA TANLASH */}
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(geometries).map(([key, val]) => (
            <button key={key} onClick={() => setGeometry(key)}
              className={`px-3 py-3 rounded-lg text-xs font-bold transition-all ${
                geometry === key
                  ? "bg-emerald-600/80 text-white shadow-lg"
                  : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
              }`}>
              <div className="text-sm mb-1">{val.name}</div>
              <div className="text-[10px] opacity-80">{val.formula}</div>
            </button>
          ))}
        </div>

        {/* DIAGRAMMA */}
        <div className="bg-purple-950/50 rounded-xl p-5">
          <h4 className="text-emerald-400 font-bold mb-3 text-center">
            {g.name} — {g.formula} ({g.ligand})
          </h4>

          {/* KVADRAT TEKISLIK */}
          {geometry === "square" && (
            <div className="font-mono text-xs space-y-2">
              <div className="flex justify-between items-center border-b border-purple-700/30 pb-2">
                <span className="text-red-400 w-24">d<sub>x²-y²</sub></span>
                <div className="flex gap-2">
                  <span className="text-purple-500">__</span>
                </div>
                <span className="text-purple-500">bo'sh (σ*)</span>
              </div>

              <div className="flex justify-between items-center border-b border-purple-700/30 pb-2 pt-2">
                <span className="text-orange-400 w-24">d<sub>xy</sub></span>
                <div className="flex gap-2">
                  <span className="text-yellow-400">↑↓</span>
                </div>
                <span className="text-orange-400">non-bonding</span>
              </div>

              <div className="flex justify-between items-center border-b border-purple-700/30 pb-2 pt-2">
                <span className="text-emerald-400 w-24">d<sub>z²</sub></span>
                <div className="flex gap-2">
                  <span className="text-yellow-400">↑↓</span>
                </div>
                <span className="text-emerald-400">zaif σ</span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-blue-400 w-24">d<sub>xz</sub>, d<sub>yz</sub></span>
                <div className="flex gap-2">
                  <span className="text-yellow-400">↑↓</span>
                  <span className="text-yellow-400">↑↓</span>
                </div>
                <span className="text-blue-400">π-bonding</span>
              </div>

              <div className="text-center mt-4 text-purple-300">
                <p className="text-[10px]">Energiya: d<sub>xz,yz</sub> &lt; d<sub>z²</sub> &lt; d<sub>xy</sub> &lt;&lt; d<sub>x²-y²</sub></p>
                <p className="text-[10px] mt-1">Katta Δ<sub>sp</sub> → barcha 8 e⁻ pastda juftlashadi</p>
              </div>
            </div>
          )}

          {/* TETRAEDRIK */}
          {geometry === "tetrahedral" && (
            <div className="font-mono text-xs space-y-2">
              <div className="flex justify-between items-center border-b border-purple-700/30 pb-2">
                <span className="text-red-400 w-24">t₂ (yuqori)</span>
                <div className="flex gap-2">
                  <span className="text-yellow-400">↑</span>
                  <span className="text-yellow-400">↑</span>
                  <span className="text-yellow-400">↑↓</span>
                </div>
                <span className="text-red-400">4 e⁻</span>
              </div>
              <div className="text-center text-purple-400 text-[10px] py-1">
                Δ<sub>t</sub> = kuchsiz (Cl⁻)
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-emerald-400 w-24">e (pastki)</span>
                <div className="flex gap-2">
                  <span className="text-yellow-400">↑↓</span>
                  <span className="text-yellow-400">↑↓</span>
                </div>
                <span className="text-emerald-400">4 e⁻</span>
              </div>
              <div className="text-center mt-4 text-purple-300">
                <p className="text-[10px]">Δ<sub>t</sub> &lt; P → yuqori spin</p>
                <p className="text-[10px] mt-1">2 ta toq elektron → paramagnit</p>
              </div>
            </div>
          )}

          {/* OKTAEDRIK */}
          {geometry === "octahedral" && (
            <div className="font-mono text-xs space-y-2">
              <div className="flex justify-between items-center border-b border-purple-700/30 pb-2">
                <span className="text-red-400 w-24">e<sub>g</sub>*</span>
                <div className="flex gap-2">
                  <span className="text-yellow-400">↑</span>
                  <span className="text-yellow-400">↑</span>
                </div>
                <span className="text-red-400">2 e⁻</span>
              </div>
              <div className="text-center text-purple-400 text-[10px] py-1">
                Δ<sub>o</sub> = 8500 cm⁻¹ (H₂O)
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-emerald-400 w-24">t₂g</span>
                <div className="flex gap-2">
                  <span className="text-yellow-400">↑↓</span>
                  <span className="text-yellow-400">↑↓</span>
                  <span className="text-yellow-400">↑↓</span>
                </div>
                <span className="text-emerald-400">6 e⁻</span>
              </div>
              <div className="text-center mt-4 text-purple-300">
                <p className="text-[10px]">Δ<sub>o</sub> &lt; P → yuqori spin</p>
                <p className="text-[10px] mt-1">2 ta toq elektron → paramagnit</p>
              </div>
            </div>
          )}

          {/* NATIJA */}
          <div className={`rounded p-3 text-center mt-4 ${g.color}`}>
            <p className="text-[10px] text-purple-300">Toq elektron (n):</p>
            <p className={`font-bold text-lg ${g.textColor}`}>
              n = {g.n}
            </p>
            <p className="text-[10px] text-purple-300 mt-1">
              μ<sub>eff</sub> = {Math.sqrt(g.n * (g.n + 2)).toFixed(2)} μ<sub>B</sub> →
              <strong className={g.textColor}> {g.magnit}</strong>
            </p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun [Ni(CN)₄]²⁻ kvadrat tekislik?</p>
          <p className="text-purple-200">
            CN⁻ — <strong>eng kuchli ligandlardan biri</strong> (spektrokimyoviy qatorda).
            Katta Δ<sub>sp</sub> → d<sub>x²-y²</sub> orbitali juda yuqori energiyaga ko'tariladi.
            8 ta elektron <strong>pastki 4 ta orbitalda</strong> joylashadi → <strong>diamagnit</strong>.
            [NiCl₄]²⁻ da Cl⁻ kuchsiz → Δ<sub>t</sub> kichik → tetraedrik → <strong>paramagnit</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. 3D KVADRAT TEKISLIK VIZUALIZATSIYA
// ============================================================================
function SquarePlanar3D() {
  const [rotate, setRotate] = useState(0)

  // 4 ta CN ligand (kvadrat tekislikda)
  const ligands = [
    { x: 1, y: 0, z: 0, label: "CN⁻" },
    { x: -1, y: 0, z: 0, label: "CN⁻" },
    { x: 0, y: 0, z: 1, label: "CN⁻" },
    { x: 0, y: 0, z: -1, label: "CN⁻" }
  ]

  const project = (p, angle) => {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    const x = p.x * cos - p.z * sin
    const z = p.x * sin + p.z * cos
    return {
      x: 200 + x * 80,
      y: 140 + p.y * 80,
      z: z
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📐 Kvadrat tekislik — 3D ko'rinish</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-emerald-700/30 space-y-4">
        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">Aylantirish burchagi:</span>
            <span className="text-emerald-400 font-mono">{rotate}°</span>
          </label>
          <input type="range" min="0" max="360" step="5" value={rotate}
            onChange={(e) => setRotate(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-emerald-500" />
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <svg viewBox="0 0 400 280" className="w-full h-64">
            {/* Tekislik (xy) */}
            <ellipse cx="200" cy="140" rx="100" ry="30" fill="none" stroke="#a78bfa" strokeWidth="1" strokeDasharray="3,3" opacity="0.3" />

            {/* Markaziy Ni */}
            <circle cx="200" cy="140" r="20" fill="#10b981" />
            <text x="200" y="146" fill="white" fontSize="12" textAnchor="middle" fontWeight="bold">Ni²⁺</text>

            {/* 4 ta CN ligand */}
            {ligands.map((l, i) => {
              const proj = project(l, rotate * Math.PI / 180)
              const size = 14 + proj.z * 3
              return (
                <g key={i}>
                  <line x1="200" y1="140" x2={proj.x} y2={proj.y}
                    stroke="#3b82f6" strokeWidth="2" opacity="0.8" />
                  <circle cx={proj.x} cy={proj.y} r={size} fill="#3b82f6" opacity="0.9" />
                  <text x={proj.x} y={proj.y + 4} fill="white" fontSize="9"
                    textAnchor="middle" fontWeight="bold">CN</text>
                </g>
              )
            })}

            {/* Burchak ko'rsatkichi */}
            <path d="M 180 140 A 20 20 0 0 1 200 120" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
            <text x="195" y="125" fill="#fbbf24" fontSize="10" fontWeight="bold">90°</text>

            <text x="200" y="265" fill="#c4b5fd" fontSize="10" textAnchor="middle">
              Barcha ligandlar bitta tekislikda (D₄h simmetriya)
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Koordinatsion son</p>
            <p className="text-emerald-400 font-bold text-lg">4</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Burchak</p>
            <p className="text-emerald-400 font-bold text-lg">90°</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Simmetriya</p>
            <p className="text-emerald-400 font-bold text-lg">D₄h</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Kvadrat tekislikning xususiyatlari:</p>
          <ul className="text-purple-200 space-y-1 list-disc list-inside">
            <li>Barcha 5 ta atom <strong>bitta tekislikda</strong></li>
            <li>Barcha L−M−L burchaklar <strong>90° yoki 180°</strong></li>
            <li><strong>Markaziy simmetriya</strong> bor (D₄h) → Laporte taqiqi kuchli</li>
            <li>d<sub>x²-y²</sub> orbitali <strong>ligandlar tomon yo'nalgan</strong> → eng yuqori energiya</li>
            <li>d<sub>xy</sub>, d<sub>xz</sub>, d<sub>yz</sub>, d<sub>z²</sub> — <strong>past energiya</strong></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. 16 ELEKTRON QOIDASI
// ============================================================================
function ElektronQoidasi() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔢 16 elektron qoidasi — kvadrat tekislik uchun</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-emerald-700/30 space-y-4">
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">💎 16 vs 18 elektron:</p>
          <p className="text-purple-200 text-xs">
            [Ni(CN)₄]²⁻ — <strong>16 elektronli kompleks</strong> (18 emas!).
            Bu kvadrat tekislik d⁸ komplekslariga <strong>xos xususiyat</strong>.
            Sababi: d<sub>x²-y²</sub> orbitali juda yuqori energiyali — elektron qo'shish energetik jihatdan noqulay.
          </p>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-emerald-400 font-bold text-xs mb-3">16 elektron hisobi:</h5>
          <div className="font-mono text-xs space-y-2">
            <div className="flex justify-between bg-purple-900/50 rounded p-2">
              <span className="text-purple-300">Ni²⁺ (d⁸):</span>
              <span className="text-emerald-400 font-bold">8 elektron</span>
            </div>
            <div className="flex justify-between bg-purple-900/50 rounded p-2">
              <span className="text-purple-300">4 × CN⁻ (har biri 2 e⁻):</span>
              <span className="text-emerald-400 font-bold">8 elektron</span>
            </div>
            <div className="flex justify-between bg-emerald-900/30 border border-emerald-500/30 rounded p-2 mt-2">
              <span className="text-emerald-400 font-bold">Jami:</span>
              <span className="text-emerald-400 font-bold text-lg">16 elektron</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-4">
            <p className="text-emerald-400 font-bold mb-2">16 elektronli komplekslar:</p>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li>Kvadrat tekislik d⁸</li>
              <li>Ni²⁺, Pd²⁺, Pt²⁺, Rh⁺, Ir⁺</li>
              <li>Kuchli ligandlar (CN⁻, CO, PR₃)</li>
              <li>Misol: Vaska's complex, Wilkinson katalizatori</li>
            </ul>
          </div>
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-400 font-bold mb-2">18 elektronli komplekslar:</p>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li>Oktaedrik, tetraedrik</li>
              <li>Ko'pchilik o'tish metallari</li>
              <li>Inert gaz konfiguratsiyasi</li>
              <li>Misol: Ferrosen, Cr(CO)₆</li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun 16 elektron barqaror?</p>
          <p className="text-purple-200">
            Kvadrat tekislikda <strong>d<sub>x²-y²</sub> orbitali</strong> ligandlar bilan kuchli
            antibonding o'zaro ta'sirda. Bu orbitalni to'ldirish <strong>juda ko'p energiya</strong> talab qiladi.
            Shuning uchun 16 elektron <strong>energetik jihatdan qulay</strong>.
            Qo'shimcha 2 elektron qo'shilsa, kompleks oktaedrik geometriyaga o'tadi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. UV-VIS SPEKTRI — SARIQ RANG
// ============================================================================
function UVVisSpektr() {
  const [lambdaMax, setLambdaMax] = useState(400)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🌈 UV-Vis spektri — sariq rang sababi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-emerald-700/30 space-y-4">
        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">λ<sub>max</sub>:</span>
            <span className="text-emerald-400 font-mono">{lambdaMax} nm</span>
          </label>
          <input type="range" min="300" max="600" step="5" value={lambdaMax}
            onChange={(e) => setLambdaMax(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-emerald-500" />
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <svg viewBox="0 0 400 200" className="w-full h-48">
            <line x1="40" y1="170" x2="380" y2="170" stroke="#4c1d95" strokeWidth="1" />
            <line x1="40" y1="20" x2="40" y2="170" stroke="#4c1d95" strokeWidth="1" />
            <text x="210" y="195" fill="#c4b5fd" fontSize="10" textAnchor="middle">λ (nm)</text>
            <text x="15" y="95" fill="#c4b5fd" fontSize="9" transform="rotate(-90, 15, 95)">A</text>

            {[300, 400, 500, 600].map((wl, i) => (
              <text key={i} x={40 + ((wl - 280) / 340) * 340} y="185" fill="#a78bfa" fontSize="8" textAnchor="middle">
                {wl}
              </text>
            ))}

            {/* Rang spektri */}
            <defs>
              <linearGradient id="spectrum2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b00ff" />
                <stop offset="25%" stopColor="#0000ff" />
                <stop offset="50%" stopColor="#00ff00" />
                <stop offset="75%" stopColor="#ffff00" />
                <stop offset="100%" stopColor="#ff0000" />
              </linearGradient>
            </defs>
            <rect x="40" y="165" width="340" height="5" fill="url(#spectrum2)" opacity="0.3" />

            {/* Spektr cho'qqilari */}
            <polyline
              points={Array.from({ length: 100 }, (_, i) => {
                const wl = 300 + i * 3
                const x = 40 + ((wl - 280) / 340) * 340
                const p1 = Math.exp(-0.5 * Math.pow((wl - lambdaMax) / 20, 2)) * 80
                const p2 = Math.exp(-0.5 * Math.pow((wl - 330) / 25, 2)) * 60
                const p3 = Math.exp(-0.5 * Math.pow((wl - 500) / 40, 2)) * 30
                const y = 170 - (p1 + p2 + p3)
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke="#10b981" strokeWidth="2" />

            <line x1={40 + ((lambdaMax - 280) / 340) * 340} y1="90" x2={40 + ((lambdaMax - 280) / 340) * 340} y2="25" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x={40 + ((lambdaMax - 280) / 340) * 340} y="20" fill="#f59e0b" fontSize="9" textAnchor="middle" fontWeight="bold">
              {lambdaMax} nm
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-yellow-400 font-bold mb-1">{lambdaMax} nm</p>
            <p className="text-purple-200">¹A₁g → ¹A₂g</p>
            <p className="text-purple-400 text-[10px]">d-d o'tish</p>
          </div>
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-yellow-400 font-bold mb-1">330 nm</p>
            <p className="text-purple-200">¹A₁g → ¹B₁g</p>
            <p className="text-purple-400 text-[10px]">d-d o'tish</p>
          </div>
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-yellow-400 font-bold mb-1">~300 nm</p>
            <p className="text-purple-200">LMCT (CN → Ni)</p>
            <p className="text-purple-400 text-[10px]">zaryad ko'chishi</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun sariq rang?</p>
          <p className="text-purple-200">
            {lambdaMax} nm — <strong>binafsha-ko'k</strong> sohada yutilish.
            Komplementar rang — <strong className="text-yellow-400">sariq</strong>.
            Kvadrat tekislikda <strong>markaziy simmetriya bor</strong> (D₄h) →
            <strong> Laporte taqiqi kuchli</strong> → ε kichik (~10-50 M⁻¹cm⁻¹).
            Shuning uchun rang <strong>och sariq</strong> (tetraedrik [NiCl₄]²⁻ dan farqli).
          </p>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-emerald-400 font-bold text-xs mb-2">Taqqoslash — Ni²⁺ komplekslari:</h5>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-purple-700/50">
                  <th className="text-left py-1 text-yellow-400">Kompleks</th>
                  <th className="text-center py-1 text-yellow-400">Geometriya</th>
                  <th className="text-center py-1 text-yellow-400">λ<sub>max</sub></th>
                  <th className="text-center py-1 text-yellow-400">ε</th>
                  <th className="text-left py-1 text-yellow-400">Rang</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {[
                  ["[Ni(CN)₄]²⁻", "Kvadrat", "400 nm", "~20", "Sariq"],
                  ["[NiCl₄]²⁻", "Tetraedrik", "700 nm", "~500", "Ko'k"],
                  ["[Ni(H₂O)₆]²⁺", "Oktaedrik", "720 nm", "~10", "Yashil"],
                  ["[Ni(en)₃]²⁺", "Oktaedrik", "570 nm", "~15", "Binafsha"],
                ].map((r, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 ${i === 0 ? 'bg-emerald-600/10' : ''}`}>
                    <td className="py-1 font-bold text-emerald-400">{r[0]}</td>
                    <td className="py-1 text-center text-[11px]">{r[1]}</td>
                    <td className="py-1 text-center font-mono">{r[2]}</td>
                    <td className="py-1 text-center font-mono">{r[3]}</td>
                    <td className="py-1">{r[4]}</td>
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
// 6. IR SPEKTRI — ν(CN) SILJISHI
// ============================================================================
function IRSpektr() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📊 IQ spektri — ν(CN) siljishi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-emerald-700/30 space-y-4">
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">💎 CN ligandining diagnostik ahamiyati:</p>
          <p className="text-purple-200 text-xs">
            ν(C≡N) cho'qqisi <strong>metall bilan bog'lanish darajasini</strong> ko'rsatadi.
            Erkin CN⁻ da ν = 2080 cm⁻¹. Koordinatsiyadan keyin <strong>siljiydi</strong> —
            bu <strong>σ-donor va π-akseptor</strong> xususiyatlariga bog'liq.
          </p>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <svg viewBox="0 0 400 200" className="w-full h-48">
            <line x1="40" y1="170" x2="380" y2="170" stroke="#4c1d95" strokeWidth="1" />
            <line x1="40" y1="20" x2="40" y2="170" stroke="#4c1d95" strokeWidth="1" />
            <text x="210" y="195" fill="#c4b5fd" fontSize="10" textAnchor="middle">ν (cm⁻¹)</text>
            <text x="15" y="95" fill="#c4b5fd" fontSize="9" transform="rotate(-90, 15, 95)">T (%)</text>

            {/* Scale */}
            {[1900, 2000, 2100, 2200, 2300].map((v, i) => (
              <text key={i} x={40 + ((v - 1850) / 500) * 340} y="185" fill="#a78bfa" fontSize="8" textAnchor="middle">
                {v}
              </text>
            ))}

            {/* 3 ta cho'qqi */}
            <polyline
              points={Array.from({ length: 200 }, (_, i) => {
                const nu = 1900 + i * 2.5
                const x = 40 + (i / 200) * 340

                // Erkin CN⁻ (2080)
                const p1 = Math.exp(-0.5 * Math.pow((nu - 2080) / 15, 2)) * 50
                // [Ni(CN)₄]²⁻ (2120)
                const p2 = Math.exp(-0.5 * Math.pow((nu - 2120) / 12, 2)) * 70
                // [Fe(CN)₆]⁴⁻ (2045)
                const p3 = Math.exp(-0.5 * Math.pow((nu - 2045) / 15, 2)) * 60

                const y = 30 + (p1 + p2 + p3)
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke="#10b981" strokeWidth="2" />
          </svg>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-2 px-2 text-yellow-400">Kompleks</th>
                <th className="text-center py-2 px-2 text-yellow-400">ν(CN) (cm⁻¹)</th>
                <th className="text-center py-2 px-2 text-yellow-400">Siljish</th>
                <th className="text-left py-2 px-2 text-yellow-400">Izoh</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["Erkin CN⁻", "2080", "—", "Asosiy qiymat"],
                ["[Ni(CN)₄]²⁻", "2120", "+40", "π-back-donation kam"],
                ["[Fe(CN)₆]⁴⁻", "2045", "-35", "π-back-donation kuchli"],
                ["[Fe(CN)₆]³⁻", "2135", "+55", "Fe³⁺ — π-back-donation yo'q"],
              ].map((r, i) => (
                <tr key={i} className={`border-b border-purple-800/30 ${i === 1 ? 'bg-emerald-600/10' : ''}`}>
                  <td className="py-1 px-2 font-bold text-emerald-400">{r[0]}</td>
                  <td className="py-1 px-2 text-center font-mono">{r[1]}</td>
                  <td className="py-1 px-2 text-center font-mono">{r[2]}</td>
                  <td className="py-1 px-2 text-[11px]">{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 ν(CN) nima haqida gapiradi?</p>
          <p className="text-purple-200">
            <strong>Yuqori ν</strong> (2120 cm⁻¹) — <strong>kuchsiz π-back-donation</strong>.
            Ni²⁺ d⁸ — π-back-donation uchun elektronlar kam.
            <br/>
            <strong>Past ν</strong> (2045 cm⁻¹) — <strong>kuchli π-back-donation</strong>.
            Fe²⁺ d⁶ (LS) — t₂g da elektronlar ko'p → CN⁻ ga qaytariladi → C≡N kuchsizlanadi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 7. SOLISHTIRISH - d⁸ IONLARI
// ============================================================================
function SolishtirishJadvali() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 d⁸ ionlari — to'liq solishtirish</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-emerald-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-2 text-yellow-400">Kompleks</th>
                <th className="text-center py-3 px-2 text-yellow-400">Metal</th>
                <th className="text-center py-3 px-2 text-yellow-400">Geometriya</th>
                <th className="text-center py-3 px-2 text-yellow-400">n</th>
                <th className="text-center py-3 px-2 text-yellow-400">Magnit</th>
                <th className="text-left py-3 px-2 text-yellow-400">Rang</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["[Ni(CN)₄]²⁻", "Ni²⁺", "Kvadrat", "0", "Diamagnit", "Sariq"],
                ["[NiCl₄]²⁻", "Ni²⁺", "Tetraedrik", "2", "Paramagnit", "Ko'k"],
                ["[Ni(H₂O)₆]²⁺", "Ni²⁺", "Oktaedrik", "2", "Paramagnit", "Yashil"],
                ["[PdCl₄]²⁻", "Pd²⁺", "Kvadrat", "0", "Diamagnit", "Jigar"],
                ["[PtCl₄]²⁻", "Pt²⁺", "Kvadrat", "0", "Diamagnit", "Qizil"],
                ["Sisplatin", "Pt²⁺", "Kvadrat", "0", "Diamagnit", "Sariq"],
                ["[AuCl₄]⁻", "Au³⁺", "Kvadrat", "0", "Diamagnit", "Sariq"],
                ["[RhCl(PPh₃)₃]", "Rh⁺", "Kvadrat", "0", "Diamagnit", "Sariq"],
              ].map((r, i) => (
                <tr key={i} className={`border-b border-purple-800/30 ${i === 0 ? 'bg-emerald-600/10' : ''} hover:bg-purple-800/20`}>
                  <td className="py-2 px-2 font-bold text-emerald-400">{r[0]}</td>
                  <td className="py-2 px-2 text-center">{r[1]}</td>
                  <td className="py-2 px-2 text-center text-[11px]">{r[2]}</td>
                  <td className="py-2 px-2 text-center font-mono">{r[3]}</td>
                  <td className={`py-2 px-2 text-center font-bold ${r[4] === 'Diamagnit' ? 'text-blue-400' : 'text-red-400'}`}>
                    {r[4]}
                  </td>
                  <td className="py-2 px-2">{r[5]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-purple-400 text-xs mt-3">
          * 4d va 5d metallari (Pd²⁺, Pt²⁺, Au³⁺) <strong>har doim kvadrat tekislik</strong> —
          kuchli spin-orbital coupling va katta Δ.
          3d metallari (Ni²⁺) — <strong>ligandga bog'liq</strong>.
        </p>
      </div>
    </div>
  )
}

// ============================================================================
// 8. TARIXIY KONTEKST — MOND JARAYONI
// ============================================================================
function TarixiyKontekst() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🏛️ Tarixiy kontekst — Mond jarayoni</h3>

      <div className="bg-gradient-to-br from-emerald-900/30 to-purple-900/30 rounded-xl p-5 border border-emerald-500/30 space-y-4">
        <div className="space-y-3">
          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">⚗️</div>
              <div>
                <p className="text-yellow-400 font-bold">1890 — Ludwig Mond</p>
                <p className="text-purple-200 text-xs mt-1">
                  Nemis-ingliz kimyogari <strong>Ludwig Mond</strong> nikkelni tozalashning
                  yangi usulini kashf etdi. Nodonda Ni + 4 CO → <strong>Ni(CO)₄</strong> (gaz),
                  keyin qizdirib → toza Ni + CO. Bu <strong>Mond jarayoni</strong> deb ataladi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🔬</div>
              <div>
                <p className="text-yellow-400 font-bold">1930-50 — Kristall maydon nazariyasi</p>
                <p className="text-purple-200 text-xs mt-1">
                  <strong>Bethe, Van Vleck</strong> va boshqalar kvadrat tekislik komplekslarining
                  elektron tuzilishini tushuntirishdi. [Ni(CN)₄]²⁻ — <strong>klassik namuna</strong>.
                  d⁸ kvadrat tekislik — 16 elektron qoidasi tushunchasi shakllandi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">💎</div>
              <div>
                <p className="text-yellow-400 font-bold">1950-60 — Birgust va Wilkinson</p>
                <p className="text-purple-200 text-xs mt-1">
                  Kvadrat tekislik d⁸ komplekslar <strong>katalizator</strong> sifatida
                  kashf etildi. <strong>Wilkinson katalizatori</strong> [RhCl(PPh₃)₃] —
                  kvadrat tekislik, 16 elektron. Gidrogenlash reaksiyalari uchun Nobel mukofoti (1973).
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🏆</div>
              <div>
                <p className="text-yellow-400 font-bold">1960-70 — Zamonaviy davr</p>
                <p className="text-purple-200 text-xs mt-1">
                  Kvadrat tekislik komplekslar <strong>organik sintez</strong>,
                  <strong>farmatsevtika</strong>, <strong>materiallar</strong>da keng qo'llanila boshladi.
                  [Ni(CN)₄]²⁻ — <strong>ta'lim klassikasi</strong> sifatida o'qitiladi.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 [Ni(CN)₄]²⁻ ning ahamiyati:</p>
          <ul className="text-purple-200 space-y-1 list-disc list-inside">
            <li><strong>Kvadrat tekislik</strong> klassik namunasi</li>
            <li><strong>16 elektron qoidasi</strong> tushuntirish</li>
            <li><strong>Laporte taqiqi</strong> (D₄h simmetriya)</li>
            <li><strong>π-back-donation</strong> o'rganish</li>
            <li><strong>Kataliz</strong> mexanizmlarini tushunish</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 9. AMALIY QO'LLANILISH
// ============================================================================
function AmaliyQollanilish() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🏭 Amaliy qo'llanilishi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-emerald-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">⚗️</div>
            <h4 className="text-emerald-400 font-bold mb-2">Elektrokaplama</h4>
            <p className="text-purple-200 text-xs">
              <strong>Ni(CN)₄]²⁻</strong> eritmalari <strong>nikel qoplashda</strong> ishlatiladi.
              Sifatli, tekis qatlam hosil qiladi.
              Elektronika, avtomobil sanoatida.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">⚙️</div>
            <h4 className="text-emerald-400 font-bold mb-2">Kataliz</h4>
            <p className="text-purple-200 text-xs">
              Kvadrat tekislik Ni komplekslar <strong>organik sintezda</strong> katalizator.
              Cross-coupling reaksiyalari (Suzuki, Heck).
              Polimerizatsiya (Ziegler-Natta).
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🔋</div>
            <h4 className="text-emerald-400 font-bold mb-2">Batareyalar</h4>
            <p className="text-purple-200 text-xs">
              Ni asosidagi batareyalar: <strong>Ni-MH</strong>, <strong>Ni-Cd</strong>.
              Elektr mashinalar, qayta zaryadlanuvchi qurilmalar.
              NiOOH/Ni(OH)₂ redoks jufti.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🧲</div>
            <h4 className="text-emerald-400 font-bold mb-2">Magnit materiallar</h4>
            <p className="text-purple-200 text-xs">
              <strong>Nd₂Fe₁₄B</strong> — eng kuchli doimiy magnit.
              Ni qo'shimcha sifatida — barqarorlikni oshiradi.
              Qattiq disklar, elektr motorlar.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🎨</div>
            <h4 className="text-emerald-400 font-bold mb-2">Pigmentlar</h4>
            <p className="text-purple-200 text-xs">
              Ni pigmentlari — <strong>yashil, sariq</strong> ranglar.
              Keramika, shisha, plastmassalar.
              Titan sariq (Ni-Sb-Ti oksidi).
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">💰</div>
            <h4 className="text-emerald-400 font-bold mb-2">Metallurgiya</h4>
            <p className="text-purple-200 text-xs">
              <strong>Mond jarayoni</strong> — toza nikel olish.
              Zanglamas po'lat (Ni-Cr).
              Superqotishmalar (aviatsiya).
            </p>
          </div>
        </div>

        <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-lg p-4">
          <p className="text-emerald-400 font-bold mb-2">🌟 Qiziqarli faktlar:</p>
          <ul className="text-purple-200 text-xs space-y-1">
            <li>• Nikkel — <strong>Yer yadrosining 5-10%</strong> ini tashkil qiladi</li>
            <li>• <strong>Kanada</strong> — dunyodagi eng katta nikel zaxirasi (Sudbury)</li>
            <li>• Nikkel tangalar — 1881 yildan beri ishlatiladi (AQSh 5 cent)</li>
            <li>• <strong>Allergiya</strong> — nikkel eng kuchli kontakt allergen</li>
            <li>• Meteoritlar — <strong>temir-nikel</strong> qotishmasi</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function NiCN4Magnit() {
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
          <span className="text-emerald-400">[Ni(CN)₄]²⁻</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-emerald-400">🧲 [Ni(CN)₄]²⁻ — Magnit tahlili</h1>
          <p className="text-purple-400 text-sm">
            Ni²⁺ (d⁸, kvadrat tekislik) • S=0 • Diamagnit • 16 elektron • Sariq rang
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-emerald-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-2xl md:text-4xl font-extrabold font-mono text-emerald-400">[Ni(CN)₄]²⁻</span>
            <div>
              <h2 className="text-xl font-bold text-white">Magnit tahlili — to'liq profil</h2>
              <p className="text-purple-400">"Tetrasiyanonikkolat(II)" — kvadrat tekislik klassikasi</p>
            </div>
          </div>

          <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              [Ni(CN)₄]²⁻ — <strong className="text-emerald-400">kvadrat tekislik</strong> geometriyali
              klassik kompleks. Ni²⁺ (d⁸) kuchli maydon ligandi (CN⁻) ta'sirida
              <strong> kvadrat tekislik</strong> geometriyasini oladi. Barcha 8 ta elektron
              pastki 4 ta orbitalda juftlashgan → <strong>S = 0</strong>, <strong>diamagnit</strong>.
              μ<sub>eff</sub> = 0 μ<sub>B</sub>. Bu <strong>16 elektronli kompleks</strong> —
              18 emas! Sababi: d<sub>x²-y²</sub> orbitali juda yuqori energiyali.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-emerald-400 font-bold text-lg">d⁸, S=0</p>
              <p className="text-purple-300">kvadrat tekislik</p>
              <p className="text-purple-400 mt-1">Diamagnit</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-emerald-400 font-bold text-lg">μ = 0 μ<sub>B</sub></p>
              <p className="text-purple-300">n = 0</p>
              <p className="text-purple-400 mt-1">ideal</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-emerald-400 font-bold text-lg">16 e⁻</p>
              <p className="text-purple-300">qoida</p>
              <p className="text-purple-400 mt-1">18 emas!</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-emerald-400 font-bold text-lg">D₄h</p>
              <p className="text-purple-300">simmetriya</p>
              <p className="text-purple-400 mt-1">markaziy</p>
            </div>
          </div>
        </div>

        {/* KVADRAT TEKISLIK 3D */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <SquarePlanar3D />
        </div>

        {/* KRISTALL MAYDON */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <CrystalFieldSquarePlanar />
        </div>

        {/* SPIN-ONLY */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <SpinOnlyCalc />
        </div>

        {/* 16 ELEKTRON */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <ElektronQoidasi />
        </div>

        {/* UV-VIS */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <UVVisSpektr />
        </div>

        {/* IR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <IRSpektr />
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
        <div className="bg-gradient-to-r from-emerald-600/10 to-purple-600/10 border border-emerald-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>Ni²⁺ (d⁸) — <strong className="text-emerald-400">kvadrat tekislik</strong>, diamagnit</li>
            <li>μ<sub>eff</sub> = <strong>0 μ<sub>B</sub></strong> — barcha elektronlar juftlashgan</li>
            <li>Konfiguratsiya: <strong>d<sub>xz,yz</sub>⁴ d<sub>z²</sub>² d<sub>xy</sub>² d<sub>x²-y²</sub>⁰</strong></li>
            <li><strong className="text-emerald-400">16 elektronli kompleks</strong> (18 emas!)</li>
            <li>Sababi: d<sub>x²-y²</sub> — juda yuqori energiyali antibonding</li>
            <li>D₄h simmetriya — <strong>markaziy simmetriya</strong> bor → Laporte taqiqi</li>
            <li>ν(CN) = <strong>2120 cm⁻¹</strong> — π-back-donation kuchsiz</li>
            <li>UV-Vis: λ<sub>max</sub> ≈ 400 nm → <strong>sariq rang</strong></li>
            <li>ε ≈ 20 M⁻¹cm⁻¹ — Laporte taqiqi tufayli kichik</li>
            <li>Sisplatin (Pt²⁺) bilan <strong>bir xil geometriya</strong>, boshqa metall</li>
            <li>Amaliy: elektrokaplama, kataliz, batareyalar, pigmentlar</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/magnit/birikmalar/co-cl4" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← [CoCl₄]²⁻
          </Link>
          <Link href="/ilmiy/tahlil/magnit/birikmalar/fe-co5" className="px-6 py-3 bg-emerald-600/80 rounded-xl hover:bg-emerald-500 text-white font-semibold">
            [Fe(CO)₅] →
          </Link>
        </div>

      </section>
    </main>
  )
}