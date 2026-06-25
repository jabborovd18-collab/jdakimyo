"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. SPIN-ONLY KALKULYATORI (Fe⁰ d⁸)
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
          <p className="text-emerald-400 font-bold mb-1">✅ [Fe(CO)₅] uchun:</p>
          <p className="text-purple-200">
            Fe⁰ — <strong>nol oksidlanish darajasi</strong>! Elektron konfiguratsiya: [Ar] 3d⁶ 4s².
            Kompleksda <strong>18 elektron</strong> to'planganligi sababli, barcha elektronlar juftlashgan.
            <strong> n = 0</strong>, S = 0 → μ<sub>eff</sub> = <strong>0 μ<sub>B</sub></strong> —
            <strong> mukammal diamagnit</strong>.
          </p>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Fe⁰ — noyob holat!</p>
          <p className="text-purple-200">
            Ko'pchilik komplekslarda metall <strong>musbat oksidlanish darajasida</strong> bo'ladi.
            [Fe(CO)₅] da Fe <strong>nol</strong> — bu CO ning <strong>kuchli π-akseptor</strong>
            xususiyati tufayli mumkin. CO elektron zichligini Fe dan o'ziga tortib,
            Fe ni "qaytarilgan" holatda ushlab turadi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. TRIGONAL BIPYRAMIDAL — 3D VIZUALIZATSIYA
// ============================================================================
function TrigonalBipyramidal3D() {
  const [rotate, setRotate] = useState(0)

  // 5 ta CO ligand:
  // 2 ta aksial (yuqori/pastki)
  // 3 ta ekvatorial (uchburchak tekislik)
  const ligands = [
    { x: 0, y: -1, z: 0, label: "CO", type: "aksial" },
    { x: 0, y: 1, z: 0, label: "CO", type: "aksial" },
    { x: 1, y: 0, z: 0, label: "CO", type: "ekvatorial" },
    { x: -0.5, y: 0, z: 0.866, label: "CO", type: "ekvatorial" },
    { x: -0.5, y: 0, z: -0.866, label: "CO", type: "ekvatorial" }
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
      <h3 className="text-white font-semibold">📐 Trigonal bipyramidal geometriya — 3D ko'rinish</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-orange-700/30 space-y-4">
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">💎 Noyob geometriya:</p>
          <p className="text-purple-200 text-xs">
            [Fe(CO)₅] — <strong>trigonal bipyramidal</strong> (D₃h simmetriya).
            Koordinatsion son = 5. 2 ta aksial + 3 ta ekvatorial CO.
            Bu geometriya <strong>18 elektronli d⁸</strong> komplekslariga xos.
          </p>
        </div>

        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">Aylantirish burchagi:</span>
            <span className="text-emerald-400 font-mono">{rotate}°</span>
          </label>
          <input type="range" min="0" max="360" step="5" value={rotate}
            onChange={(e) => setRotate(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-orange-500" />
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <svg viewBox="0 0 400 280" className="w-full h-64">
            {/* Ekvatorial tekislik */}
            <ellipse cx="200" cy="140" rx="100" ry="30" fill="none" stroke="#a78bfa" strokeWidth="1" strokeDasharray="3,3" opacity="0.3" />

            {/* Markaziy Fe */}
            <circle cx="200" cy="140" r="22" fill="#f97316" />
            <text x="200" y="146" fill="white" fontSize="12" textAnchor="middle" fontWeight="bold">Fe⁰</text>

            {/* 5 ta CO ligand */}
            {ligands.map((l, i) => {
              const proj = project(l, rotate * Math.PI / 180)
              const size = l.type === "aksial" ? 16 : 14 + proj.z * 3
              const color = l.type === "aksial" ? "#ef4444" : "#3b82f6"
              return (
                <g key={i}>
                  <line x1="200" y1="140" x2={proj.x} y2={proj.y}
                    stroke={color} strokeWidth="2" opacity="0.8" />
                  <circle cx={proj.x} cy={proj.y} r={size} fill={color} opacity="0.9" />
                  <text x={proj.x} y={proj.y + 4} fill="white" fontSize="9"
                    textAnchor="middle" fontWeight="bold">CO</text>
                </g>
              )
            })}

            {/* Labels */}
            <text x="200" y="265" fill="#c4b5fd" fontSize="10" textAnchor="middle">
              D₃h simmetriya — 2 aksial (180°) + 3 ekvatorial (120°)
            </text>

            {/* Burchak ko'rsatkichlari */}
            <text x="240" y="80" fill="#ef4444" fontSize="9">aksial</text>
            <text x="320" y="145" fill="#3b82f6" fontSize="9">ekvatorial</text>
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Koordinatsion son</p>
            <p className="text-orange-400 font-bold text-lg">5</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Aksial burchak</p>
            <p className="text-orange-400 font-bold text-lg">180°</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Ekvatorial</p>
            <p className="text-orange-400 font-bold text-lg">120°</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchan trigonal bipyramidal?</p>
          <p className="text-purple-200">
            5 ta ligand uchun <strong>eng optimal geometriya</strong>.
            Aksial bog'lar <strong>ekvatoriallarga qaraganda uzunroq</strong> (Fe−CO aksial = 1.83 Å,
            ekvatorial = 1.80 Å). Sababi: ekvatorial ligandlar ko'proq joy egallaydi.
            <strong> Berry pseudorotation</strong> orqali aksial va ekvatorial ligandlar
            o'rin almashadi (dinamik jarayon).
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. 18 ELEKTRON QOIDASI
// ============================================================================
function ElektronQoidasi() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔢 18 elektron qoidasi — [Fe(CO)₅] klassikasi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-orange-700/30 space-y-4">
        <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-lg p-4">
          <p className="text-emerald-400 font-bold mb-2">✨ 18 elektron qoidasi bajariladi!</p>
          <p className="text-purple-200 text-xs">
            [Fe(CO)₅] — <strong>18 elektronli kompleks</strong>ning klassik namunasi.
            Bu qoida <strong>organometallik kimyo</strong>ning poydevori hisoblanadi.
            Barcha bog'lovchi va non-bonding MO lar to'lgan → <strong>alohida barqarorlik</strong>.
          </p>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-orange-400 font-bold text-xs mb-3">18 elektron hisobi:</h5>
          <div className="font-mono text-xs space-y-2">
            <div className="flex justify-between bg-purple-900/50 rounded p-2">
              <span className="text-purple-300">Fe⁰ (atom):</span>
              <span className="text-orange-400 font-bold">8 elektron (3d⁶ 4s²)</span>
            </div>
            <div className="flex justify-between bg-purple-900/50 rounded p-2">
              <span className="text-purple-300">5 × CO (har biri 2 e⁻):</span>
              <span className="text-orange-400 font-bold">10 elektron</span>
            </div>
            <div className="flex justify-between bg-purple-900/50 rounded p-2">
              <span className="text-purple-300">Zaryad:</span>
              <span className="text-orange-400 font-bold">0</span>
            </div>
            <div className="flex justify-between bg-emerald-900/30 border border-emerald-500/30 rounded p-2 mt-2">
              <span className="text-emerald-400 font-bold">Jami:</span>
              <span className="text-emerald-400 font-bold text-lg">18 elektron ✓</span>
            </div>
          </div>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-orange-400 font-bold text-xs mb-3">MO diagramma (soddalashtirilgan):</h5>
          <div className="font-mono text-xs space-y-1">
            <div className="text-center text-purple-500 text-[10px] mb-2">ANTIBONDING (bo'sh)</div>

            <div className="flex justify-between items-center border-b border-purple-800/30 pb-1">
              <span className="text-red-400 w-28">σ* (Fe−CO)</span>
              <div className="flex gap-2">
                <span className="text-purple-500">__ __ __ __ __</span>
              </div>
              <span className="text-purple-500">bo'sh</span>
            </div>

            <div className="text-center text-yellow-400 text-[10px] my-2">HOMO-LUMO farqi: ~4 eV</div>

            <div className="flex justify-between items-center border-b-2 border-orange-500/50 pb-1 pt-1">
              <span className="text-orange-400 w-28 font-bold">π* (CO)</span>
              <div className="flex gap-2">
                <span className="text-yellow-400">↑↓ ↑↓ ↑↓ ↑↓ ↑↓</span>
              </div>
              <span className="text-orange-400">10 e⁻ (HOMO)</span>
            </div>

            <div className="flex justify-between items-center border-b border-purple-800/30 pb-1 pt-1">
              <span className="text-emerald-400 w-28">σ (Fe−CO)</span>
              <div className="flex gap-2">
                <span className="text-yellow-400">↑↓ ↑↓ ↑↓ ↑↓ ↑↓</span>
              </div>
              <span className="text-emerald-400">10 e⁻</span>
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-blue-400 w-28">d (Fe, non-bond)</span>
              <div className="flex gap-2">
                <span className="text-yellow-400">↑↓ ↑↓ ↑↓</span>
              </div>
              <span className="text-blue-400">6 e⁻ (t₂g)</span>
            </div>

            <div className="mt-4 bg-purple-900/40 rounded p-3 text-center">
              <p className="text-purple-300 text-xs">
                <span className="text-orange-400 font-bold">Jami elektronlar:</span>{" "}
                6 + 10 + 10 = <span className="text-emerald-400 font-bold text-lg">18 e⁻</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun 18 elektron barqaror?</p>
          <p className="text-purple-200">
            18 elektron = <strong>inert gaz konfiguratsiyasi</strong> (Kr).
            Barcha 9 ta past energiyali MO (1 s + 3 p + 5 d) to'lgan.
            Qo'shimcha elektron qo'shilsa → <strong>antibonding</strong> orbitalga kiradi → beqaror.
            Shuning uchun 18 elektronli komplekslar <strong>alohida barqaror</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. BACK-BONDING (π-KAYTARISH)
// ============================================================================
function BackBonding() {
  const [donation, setDonation] = useState(50)
  const [backDonation, setBackDonation] = useState(70)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 Back-bonding — π-qaytarish mexanizmi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-orange-700/30 space-y-4">
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">💎 [Fe(CO)₅] ning sirli barqarorligi:</p>
          <p className="text-purple-200 text-xs">
            CO <strong>neytral molekula</strong>, lekin Fe bilan juda mustahkam bog'lanadi.
            Sababi: <strong>synergik bog'lanish</strong> — σ-donation + π-back-donation.
            Bu ikki jarayon bir-birini <strong>kuchaytiradi</strong>.
          </p>
        </div>

        {/* VIZUALIZATSIYA */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <svg viewBox="0 0 400 250" className="w-full h-56">
            {/* Fe atomi */}
            <circle cx="100" cy="125" r="30" fill="#f97316" />
            <text x="100" y="130" fill="white" fontSize="14" textAnchor="middle" fontWeight="bold">Fe⁰</text>

            {/* CO molekula */}
            <circle cx="300" cy="125" r="25" fill="#3b82f6" />
            <text x="300" y="130" fill="white" fontSize="12" textAnchor="middle" fontWeight="bold">CO</text>

            {/* σ-donation (Fe ← C) */}
            <defs>
              <marker id="arrowRed" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
                <polygon points="0,0 5,2.5 0,5" fill="#ef4444" />
              </marker>
              <marker id="arrowBlue" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
                <polygon points="0,0 5,2.5 0,5" fill="#3b82f6" />
              </marker>
            </defs>

            {/* σ-donation */}
            <path d="M 270 100 Q 200 80 130 100" fill="none" stroke="#ef4444" strokeWidth="3"
              markerEnd="url(#arrowRed)" opacity={donation/100} />
            <text x="200" y="70" fill="#ef4444" fontSize="10" textAnchor="middle" fontWeight="bold">
              σ-donation
            </text>
            <text x="200" y="85" fill="#ef4444" fontSize="8" textAnchor="middle">
              C: → Fe (d<sub>z²</sub>)
            </text>

            {/* π-back-donation */}
            <path d="M 130 150 Q 200 170 270 150" fill="none" stroke="#3b82f6" strokeWidth="3"
              markerEnd="url(#arrowBlue)" opacity={backDonation/100} />
            <text x="200" y="185" fill="#3b82f6" fontSize="10" textAnchor="middle" fontWeight="bold">
              π-back-donation
            </text>
            <text x="200" y="200" fill="#3b82f6" fontSize="8" textAnchor="middle">
              Fe (t₂g) → π*(CO)
            </text>

            {/* Energiya ko'rsatkichlari */}
            <text x="100" y="230" fill="#f97316" fontSize="9" textAnchor="middle">
              Elektron boyidi
            </text>
            <text x="300" y="230" fill="#3b82f6" fontSize="9" textAnchor="middle">
              C≡N kuchsizlandi
            </text>
          </svg>
        </div>

        {/* SLIDERLAR */}
        <div className="space-y-3">
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-red-400 font-bold">σ-donation kuchi:</span>
              <span className="text-emerald-400 font-mono">{donation}%</span>
            </label>
            <input type="range" min="0" max="100" step="5" value={donation}
              onChange={(e) => setDonation(parseInt(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-red-500" />
          </div>
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-blue-400 font-bold">π-back-donation kuchi:</span>
              <span className="text-emerald-400 font-mono">{backDonation}%</span>
            </label>
            <input type="range" min="0" max="100" step="5" value={backDonation}
              onChange={(e) => setBackDonation(parseInt(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-blue-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400 font-bold mb-2">σ-donation:</p>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li>C ning <strong>juft elektronlari</strong> Fe ga beriladi</li>
              <li>Fe <strong>elektron boyiydi</strong></li>
              <li>CO <strong>musbat zaryadlanadi</strong></li>
              <li>Bog' <strong>mustahkamlanadi</strong></li>
            </ul>
          </div>
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-400 font-bold mb-2">π-back-donation:</p>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li>Fe ning <strong>t₂g elektronlari</strong> CO π* ga qaytariladi</li>
              <li>Fe <strong>elektron yo'qotadi</strong></li>
              <li>CO <strong>manfiy zaryadlanadi</strong></li>
              <li>C≡N bog'i <strong>kuchsizlanadi</strong> (ν(CO) pasayadi)</li>
            </ul>
          </div>
        </div>

        <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-lg p-3 text-xs">
          <p className="text-emerald-400 font-bold mb-1">✨ Synergik effekt:</p>
          <p className="text-purple-200">
            σ-donation va π-back-donation <strong>bir-birini kuchaytiradi</strong>:
            <br/>• σ-donation → Fe elektron boyiydi → π-back-donation osonlashadi
            <br/>• π-back-donation → Fe elektron yo'qotadi → σ-donation osonlashadi
            <br/>
            Natija: <strong>juda mustahkam bog'</strong> (Fe−CO ~ 150 kJ/mol).
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. IR SPEKTRI — ν(CO) SILJISHI
// ============================================================================
function IRSpektr() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📊 IQ spektri — ν(CO) siljishi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-orange-700/30 space-y-4">
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">💎 CO ning diagnostik ahamiyati:</p>
          <p className="text-purple-200 text-xs">
            ν(C≡O) cho'qqisi <strong>back-bonding darajasini</strong> ko'rsatadi.
            Erkin CO da ν = 2143 cm⁻¹. Kompleksda <strong>siljiydi</strong> — qancha pastga siljisa,
            shuncha kuchli π-back-donation.
          </p>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <svg viewBox="0 0 400 200" className="w-full h-48">
            <line x1="40" y1="170" x2="380" y2="170" stroke="#4c1d95" strokeWidth="1" />
            <line x1="40" y1="20" x2="40" y2="170" stroke="#4c1d95" strokeWidth="1" />
            <text x="210" y="195" fill="#c4b5fd" fontSize="10" textAnchor="middle">ν (cm⁻¹)</text>
            <text x="15" y="95" fill="#c4b5fd" fontSize="9" transform="rotate(-90, 15, 95)">T (%)</text>

            {/* Scale */}
            {[1800, 1900, 2000, 2100, 2200].map((v, i) => (
              <text key={i} x={40 + ((v - 1750) / 500) * 340} y="185" fill="#a78bfa" fontSize="8" textAnchor="middle">
                {v}
              </text>
            ))}

            {/* 3 ta cho'qqi */}
            <polyline
              points={Array.from({ length: 200 }, (_, i) => {
                const nu = 1800 + i * 2.5
                const x = 40 + (i / 200) * 340

                // Erkin CO (2143)
                const p1 = Math.exp(-0.5 * Math.pow((nu - 2143) / 10, 2)) * 40
                // [Fe(CO)₅] aksial (2022)
                const p2 = Math.exp(-0.5 * Math.pow((nu - 2022) / 12, 2)) * 70
                // [Fe(CO)₅] ekvatorial (2000)
                const p3 = Math.exp(-0.5 * Math.pow((nu - 2000) / 12, 2)) * 60

                const y = 30 + (p1 + p2 + p3)
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke="#f97316" strokeWidth="2" />
          </svg>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-2 px-2 text-yellow-400">Kompleks</th>
                <th className="text-center py-2 px-2 text-yellow-400">ν(CO) (cm⁻¹)</th>
                <th className="text-center py-2 px-2 text-yellow-400">Siljish</th>
                <th className="text-left py-2 px-2 text-yellow-400">Izoh</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["Erkin CO", "2143", "—", "Asosiy qiymat"],
                ["[Fe(CO)₅] (aksial)", "2022", "-121", "O'rtacha back-donation"],
                ["[Fe(CO)₅] (ekvatorial)", "2000", "-143", "Kuchli back-donation"],
                ["[V(CO)₆]⁻", "1860", "-283", "Juda kuchli back-donation"],
                ["[Ti(CO)₆]²⁻", "1748", "-395", "Eng kuchli back-donation"],
                ["[Mn(CO)₆]⁺", "2090", "-53", "Kuchsiz back-donation"],
              ].map((r, i) => (
                <tr key={i} className={`border-b border-purple-800/30 ${i === 1 || i === 2 ? 'bg-orange-600/10' : ''}`}>
                  <td className="py-1 px-2 font-bold text-orange-400">{r[0]}</td>
                  <td className="py-1 px-2 text-center font-mono">{r[1]}</td>
                  <td className="py-1 px-2 text-center font-mono">{r[2]}</td>
                  <td className="py-1 px-2 text-[11px]">{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 ν(CO) nima haqida gapiradi?</p>
          <p className="text-purple-200">
            <strong>Past ν</strong> → <strong>kuchli π-back-donation</strong>.
            Metall qancha elektron boy bo'lsa (past oksidlanish, ko'p d-elektron),
            shuncha kuchli back-donation.
            <br/>
            [Fe(CO)₅]: Fe⁰ → <strong>o'rtacha back-donation</strong> → ν ≈ 2000-2022 cm⁻¹.
            <br/>
            [Mn(CO)₆]⁺: Mn⁺ → <strong>kuchsiz back-donation</strong> → ν ≈ 2090 cm⁻¹.
          </p>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-orange-400 font-bold text-xs mb-2">[Fe(CO)₅] da 2 ta ν(CO) — nima uchun?</h5>
          <p className="text-purple-200 text-xs">
            <strong>Aksial</strong> va <strong>ekvatorial</strong> CO ligandlari <strong>farqli muhitda</strong>.
            Ekvatorial CO lar ko'proq back-donation oladi (3 ta qo'shni CO bor).
            Shuning uchun <strong>2 ta cho'qqi</strong> ko'rinadi — bu trigonal bipyramidal
            geometriyaning <strong>isboti</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 6. BERRY PSEUDOROTATION
// ============================================================================
function BerryPseudorotation() {
  const [step, setStep] = useState(0)

  const steps = [
    {
      title: "1. Boshlang'ich holat",
      desc: "2 ta aksial (A) + 3 ta ekvatorial (E) CO",
      diagram: "A-E-E-E-A",
      icon: "📐"
    },
    {
      title: "2. E kvadrat tekislikka o'tadi",
      desc: "Bitta E ligand aksial holatga ko'tariladi",
      diagram: "A-A-E-E-E",
      icon: "🔄"
    },
    {
      title: "3. Oraliq piramida",
      desc: "Kvadrat piramidal oraliq holat (C₄v)",
      diagram: "A-E₄",
      icon: "⚡"
    },
    {
      title: "4. O'rin almashinuvi",
      desc: "Aksial va ekvatorial ligandlar o'rni almashdi",
      diagram: "E-A-E-A-E",
      icon: "✨"
    }
  ]

  const s = steps[step]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 Berry pseudorotation — dinamik jarayon</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-orange-700/30 space-y-4">
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">💎 Noyob hodisa:</p>
          <p className="text-purple-200 text-xs">
            [Fe(CO)₅] da <strong>aksial va ekvatorial CO lar tez almashinadi</strong>.
            Bu <strong>Berry pseudorotation</strong> deb ataladi.
            Aktivatsiya energiyasi juda past (~5 kJ/mol) — xona haroratida tez sodir bo'ladi.
            NMR da barcha CO lar <strong>ekvivalent</strong> ko'rinadi!
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
              {i + 1}
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
          <div className="bg-purple-900/50 rounded p-3 font-mono text-xs text-center text-emerald-400">
            {s.diagram}
          </div>
        </div>

        {/* VIZUALIZATSIYA */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-orange-400 font-bold text-xs mb-3">Mexanizm (sxematik):</h5>
          <svg viewBox="0 0 400 200" className="w-full h-44">
            {/* Boshlang'ich TBP */}
            <circle cx="80" cy="100" r="15" fill="#f97316" />
            <text x="80" y="105" fill="white" fontSize="10" textAnchor="middle">Fe</text>
            <circle cx="80" cy="60" r="8" fill="#ef4444" />
            <circle cx="80" cy="140" r="8" fill="#ef4444" />
            <circle cx="50" cy="100" r="8" fill="#3b82f6" />
            <circle cx="110" cy="100" r="8" fill="#3b82f6" />
            <circle cx="95" cy="120" r="8" fill="#3b82f6" />

            {/* Strelka */}
            <line x1="130" y1="100" x2="170" y2="100" stroke="#a78bfa" strokeWidth="2" markerEnd="url(#arrowPurple)" />
            <defs>
              <marker id="arrowPurple" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
                <polygon points="0,0 5,2.5 0,5" fill="#a78bfa" />
              </marker>
            </defs>

            {/* Oraliq SP */}
            <rect x="180" y="85" width="40" height="30" fill="none" stroke="#a78bfa" strokeWidth="1" strokeDasharray="2,2" />
            <circle cx="200" cy="100" r="15" fill="#f97316" />
            <text x="200" y="105" fill="white" fontSize="10" textAnchor="middle">Fe</text>
            <circle cx="200" cy="70" r="8" fill="#ef4444" />
            <circle cx="180" cy="100" r="8" fill="#3b82f6" />
            <circle cx="220" cy="100" r="8" fill="#3b82f6" />
            <circle cx="185" cy="125" r="8" fill="#3b82f6" />
            <circle cx="215" cy="125" r="8" fill="#3b82f6" />

            {/* Strelka */}
            <line x1="230" y1="100" x2="270" y2="100" stroke="#a78bfa" strokeWidth="2" markerEnd="url(#arrowPurple)" />

            {/* Yakuniy TBP (almashgan) */}
            <circle cx="320" cy="100" r="15" fill="#f97316" />
            <text x="320" y="105" fill="white" fontSize="10" textAnchor="middle">Fe</text>
            <circle cx="320" cy="60" r="8" fill="#3b82f6" />
            <circle cx="320" cy="140" r="8" fill="#3b82f6" />
            <circle cx="290" cy="100" r="8" fill="#ef4444" />
            <circle cx="350" cy="100" r="8" fill="#ef4444" />
            <circle cx="305" cy="120" r="8" fill="#3b82f6" />

            <text x="200" y="180" fill="#c4b5fd" fontSize="9" textAnchor="middle">
              TBP → SP → TBP (ligandlar almashdi)
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-center">
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Aktivatsiya energiyasi</p>
            <p className="text-orange-400 font-bold font-mono">~5 kJ/mol</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Tezlik (298 K)</p>
            <p className="text-orange-400 font-bold font-mono">~10⁵ s⁻¹</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 NMR da kuzatish:</p>
          <p className="text-purple-200">
            Berry pseudorotation <strong>juda tez</strong> (10⁵ s⁻¹) bo'lgani uchun,
            NMR da barcha 5 ta CO <strong>ekvivalent</strong> ko'rinadi — bitta ¹³C cho'qqi.
            Past haroratda (−100°C) jarayon sekinlashadi → <strong>2 ta cho'qqi</strong> ko'rinadi
            (aksial va ekvatorial).
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 7. UV-VIS SPEKTRI — RANGSIZ
// ============================================================================
function UVVisSpektr() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🌈 UV-Vis spektri — rangsiz suyuqlik</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-orange-700/30 space-y-4">
        <div className="bg-purple-950/50 rounded-lg p-4">
          <svg viewBox="0 0 400 200" className="w-full h-48">
            <line x1="40" y1="170" x2="380" y2="170" stroke="#4c1d95" strokeWidth="1" />
            <line x1="40" y1="20" x2="40" y2="170" stroke="#4c1d95" strokeWidth="1" />
            <text x="210" y="195" fill="#c4b5fd" fontSize="10" textAnchor="middle">λ (nm)</text>
            <text x="15" y="95" fill="#c4b5fd" fontSize="9" transform="rotate(-90, 15, 95)">A</text>

            {[200, 300, 400, 500, 600].map((wl, i) => (
              <text key={i} x={40 + ((wl - 180) / 440) * 340} y="185" fill="#a78bfa" fontSize="8" textAnchor="middle">
                {wl}
              </text>
            ))}

            {/* Faqat UV da MLCT cho'qqisi */}
            <polyline
              points={Array.from({ length: 100 }, (_, i) => {
                const wl = 200 + i * 4.4
                const x = 40 + (i / 100) * 340
                const p1 = Math.exp(-0.5 * Math.pow((wl - 260) / 20, 2)) * 100
                const y = 170 - p1
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke="#f97316" strokeWidth="2" />

            <text x="280" y="165" fill="#10b981" fontSize="9" textAnchor="middle">
              Ko'rinadigan sohada yutilish yo'q!
            </text>

            <line x1="60" y1="70" x2="60" y2="25" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x="60" y="20" fill="#f59e0b" fontSize="8" textAnchor="middle">260 nm (MLCT)</text>
          </svg>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-yellow-400 font-bold mb-1">260 nm</p>
            <p className="text-purple-200">MLCT (Fe → CO)</p>
            <p className="text-purple-400 text-[10px]">ε ≈ 10000 M⁻¹cm⁻¹</p>
          </div>
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-yellow-400 font-bold mb-1">400-700 nm</p>
            <p className="text-emerald-400">Yutilish YO'Q</p>
            <p className="text-purple-400 text-[10px]">ε &lt; 1</p>
          </div>
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-yellow-400 font-bold mb-1">Natija</p>
            <p className="text-orange-400 font-bold">RANGSIZ</p>
            <p className="text-purple-400 text-[10px]">och sariq suyuqlik</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun rangsiz?</p>
          <p className="text-purple-200">
            <strong>18 elektronli kompleks</strong> — barcha d-orbitallar to'lgan.
            d-d o'tishlar <strong>mumkin emas</strong> (bo'sh d-orbital yo'q).
            Faqat yuqori energiyali <strong>MLCT</strong> (metal-to-ligand charge transfer) bor,
            lekin u <strong>UV sohada</strong> (260 nm). Ko'rinadigan nur to'liq o'tadi → rangsiz.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 8. SOLISHTIRISH - KARBONIL KOMPLEKSLAR
// ============================================================================
function SolishtirishJadvali() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 Binar karbonil komplekslar solishtirilishi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-orange-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-2 text-yellow-400">Kompleks</th>
                <th className="text-center py-3 px-2 text-yellow-400">Metal</th>
                <th className="text-center py-3 px-2 text-yellow-400">Geometriya</th>
                <th className="text-center py-3 px-2 text-yellow-400">e⁻</th>
                <th className="text-center py-3 px-2 text-yellow-400">ν(CO)</th>
                <th className="text-left py-3 px-2 text-yellow-400">Holat</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["[Ni(CO)₄]", "Ni⁰", "Tetraedrik", "18", "2057", "Rangsiz gaz"],
                ["[Fe(CO)₅]", "Fe⁰", "Trig. bipir.", "18", "2022, 2000", "Sariq suyuqlik"],
                ["[Cr(CO)₆]", "Cr⁰", "Oktaedrik", "18", "2000", "Oq qattiq"],
                ["[V(CO)₆]⁻", "V⁻", "Oktaedrik", "18", "1860", "Sariq"],
                ["[Mn(CO)₆]⁺", "Mn⁺", "Oktaedrik", "18", "2090", "Sariq"],
                ["[Co₂(CO)₈]", "Co⁰", "Dimer", "18", "2070, 2020", "To'q sariq"],
                ["[Fe₂(CO)₉]", "Fe⁰", "Dimer", "18", "2030, 1830", "Sariq"],
                ["[Fe₃(CO)₁₂]", "Fe⁰", "Triangular", "18", "2040, 2020", "To'q yashil"],
              ].map((r, i) => (
                <tr key={i} className={`border-b border-purple-800/30 ${i === 1 ? 'bg-orange-600/10' : ''} hover:bg-purple-800/20`}>
                  <td className="py-2 px-2 font-bold text-orange-400">{r[0]}</td>
                  <td className="py-2 px-2 text-center">{r[1]}</td>
                  <td className="py-2 px-2 text-center text-[11px]">{r[2]}</td>
                  <td className="py-2 px-2 text-center font-mono">{r[3]}</td>
                  <td className="py-2 px-2 text-center font-mono text-[10px]">{r[4]}</td>
                  <td className="py-2 px-2 text-[11px]">{r[5]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-purple-400 text-xs mt-3">
          * Barcha binar karbonillar <strong>18 elektronli</strong> — alohida barqaror.
          ν(CO) metallning elektron boylik darajasini ko'rsatadi.
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
      <h3 className="text-white font-semibold">🏛️ Tarixiy kontekst — karbonil kimyosi</h3>

      <div className="bg-gradient-to-br from-orange-900/30 to-purple-900/30 rounded-xl p-5 border border-orange-500/30 space-y-4">
        <div className="space-y-3">
          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">⚗️</div>
              <div>
                <p className="text-yellow-400 font-bold">1868 — Birinchi karbonil</p>
                <p className="text-purple-200 text-xs mt-1">
                  <strong>Paul Schützenberger</strong> birinchi marta [PtCl₂(CO)₂] sintez qildi.
                  Lekin bu <strong>haqiqiy karbonil emas</strong> edi (CO bog'lanmagan).
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🔬</div>
              <div>
                <p className="text-yellow-400 font-bold">1890 — Mond jarayoni</p>
                <p className="text-purple-200 text-xs mt-1">
                  <strong>Ludwig Mond</strong> va <strong>Carl Langer</strong> Ni(CO)₄ ni kashf etdi.
                  Bu <strong>toza nikel olish</strong> usuli sifatida sanoatda qo'llanildi.
                  Birinchi haqiqiy binar karbonil.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">💎</div>
              <div>
                <p className="text-yellow-400 font-bold">1891 — [Fe(CO)₅] sintezi</p>
                <p className="text-purple-200 text-xs mt-1">
                  <strong>Ludwig Mond</strong> temir kukunini CO bilan yuqori bosim va haroratda
                  reaksiyaga kiritib, <strong>[Fe(CO)₅]</strong> ni oldi.
                  Sariq rangli, zaharli suyuqlik.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🏆</div>
              <div>
                <p className="text-yellow-400 font-bold">1930-50 — Hieber va boshqalar</p>
                <p className="text-purple-200 text-xs mt-1">
                  <strong>Walter Hieber</strong> (Germaniya) karbonil kimyosining asoschisi.
                  Yuzlab yangi karbonil komplekslar sintez qildi.
                  <strong>18 elektron qoidasi</strong> va <strong>back-bonding</strong> tushunchalari shakllandi.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 [Fe(CO)₅] ning ahamiyati:</p>
          <ul className="text-purple-200 space-y-1 list-disc list-inside">
            <li><strong>Birinchi temir karbonil</strong> — organometallik kimyo klassikasi</li>
            <li><strong>18 elektron qoidasi</strong> tushuntirish</li>
            <li><strong>Back-bonding</strong> mexanizmi o'rganish</li>
            <li><strong>Trigonal bipyramidal</strong> geometriya namunasi</li>
            <li><strong>Berry pseudorotation</strong> kashfiyoti</li>
          </ul>
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
            <div className="text-3xl mb-2">⚗️</div>
            <h4 className="text-orange-400 font-bold mb-2">Katalizator</h4>
            <p className="text-purple-200 text-xs">
              <strong>Hydroformylation</strong> (okso-sintez):
              alken + CO + H₂ → aldegid.
              [Fe(CO)₅] katalizator sifatida.
              Sanoatda yillik millionlab tonna.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🔬</div>
            <h4 className="text-orange-400 font-bold mb-2">Nanotexnologiya</h4>
            <p className="text-purple-200 text-xs">
              <strong>Temir nanozarralar</strong> olish uchun:
              [Fe(CO)₅] → Fe⁰ + 5 CO (termik parchalanish).
              Magnit materiallar, kataliz, tibbiyot.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🎨</div>
            <h4 className="text-orange-400 font-bold mb-2">CVD qoplamalar</h4>
            <p className="text-purple-200 text-xs">
              <strong>Chemical Vapor Deposition</strong>:
              [Fe(CO)₅] bug'lari → temir qatlami.
              Elektronika, himoya qoplamalari.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">💊</div>
            <h4 className="text-orange-400 font-bold mb-2">Tibbiyot (tadqiqot)</h4>
            <p className="text-purple-200 text-xs">
              <strong>CO donorlari</strong> sifatida:
              [Fe(CO)₅] dan CO ajralib chiqadi →
              qon tomirlarini kengaytiradi.
              Yangi dori vositalari tadqiqoti.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">⚙️</div>
            <h4 className="text-orange-400 font-bold mb-2">Sintez boshlang'ich modda</h4>
            <p className="text-purple-200 text-xs">
              Boshqa temir komplekslarini olish uchun:
              <br/>• [Fe₂(CO)₉]
              <br/>• [Fe₃(CO)₁₂]
              <br/>• Ferrosen va boshqalar
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🔋</div>
            <h4 className="text-orange-400 font-bold mb-2">Yoqilg'i qo'shimchasi</h4>
            <p className="text-purple-200 text-xs">
              <strong>Antiknock agent</strong> (avval):
              [Fe(CO)₅] benzinga qo'shilgan.
              Hozir — atrof-muhit sababli taqiqlangan.
            </p>
          </div>
        </div>

        <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400 font-bold mb-2">⚠️ ZAHARLI!</p>
          <ul className="text-purple-200 text-xs space-y-1">
            <li>• [Fe(CO)₅] — <strong>juda zaharli</strong> (CO ajralib chiqadi)</li>
            <li>• <strong>LD₅₀</strong> = 25 mg/kg (og'iz orqali)</li>
            <li>• <strong>Havo bilan portlovchi</strong> aralashma hosil qiladi</li>
            <li>• Faqat <strong>maxsus sharoitda</strong> ishlatish kerak (inert atmosfera)</li>
            <li>• <strong>Yong'in xavfi</strong> — o'z-o'zidan yonishi mumkin</li>
          </ul>
        </div>

        <div className="bg-orange-600/10 border border-orange-500/30 rounded-lg p-4">
          <p className="text-orange-400 font-bold mb-2">🌟 Qiziqarli faktlar:</p>
          <ul className="text-purple-200 text-xs space-y-1">
            <li>• [Fe(CO)₅] — <strong>och sariq suyuqlik</strong> (xona haroratida)</li>
            <li>• <strong>Qaynash temperaturasi</strong>: 103°C</li>
            <li>• <strong>Suvda parchalanadi</strong> — CO chiqadi</li>
            <li>• <strong>Yorug'likda</strong> parchalanadi — qorong'ida saqlash kerak</li>
            <li>• <strong>Mars</strong> atmosferasida CO bor — kelajakda [Fe(CO)₅] bo'lishi mumkin!</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function FeCO5Magnit() {
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
          <span className="text-orange-400">[Fe(CO)₅]</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-orange-400">🧲 [Fe(CO)₅] — Magnit tahlili</h1>
          <p className="text-purple-400 text-sm">
            Fe⁰ (d⁸, 18e⁻) • S=0 • Diamagnit • Trigonal bipyramidal • Back-bonding klassikasi
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-orange-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-2xl md:text-4xl font-extrabold font-mono text-orange-400">[Fe(CO)₅]</span>
            <div>
              <h2 className="text-xl font-bold text-white">Magnit tahlili — to'liq profil</h2>
              <p className="text-purple-400">"Pentakarboniltemir(0)" — organometallik klassikasi</p>
            </div>
          </div>

          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              [Fe(CO)₅] — <strong className="text-orange-400">organometallik kimyoning klassikasi</strong>.
              Fe⁰ <strong>nol oksidlanish darajasida</strong> — bu CO ning kuchli π-akseptor xususiyati tufayli.
              <strong> 18 elektron qoidasi</strong> bajariladi: Fe⁰ (8 e⁻) + 5 × CO (10 e⁻) = <strong>18 e⁻</strong>.
              Barcha elektronlar juftlashgan → <strong>S = 0</strong>, <strong>diamagnit</strong>.
              μ<sub>eff</sub> = 0 μ<sub>B</sub>. <strong>Trigonal bipyramidal</strong> geometriya (D₃h).
              <strong> Back-bonding</strong> va <strong>Berry pseudorotation</strong> ning eng yaxshi namunasi.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-orange-400 font-bold text-lg">Fe⁰ (d⁸)</p>
              <p className="text-purple-300">18 e⁻</p>
              <p className="text-purple-400 mt-1">Diamagnit</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-orange-400 font-bold text-lg">μ = 0 μ<sub>B</sub></p>
              <p className="text-purple-300">n = 0</p>
              <p className="text-purple-400 mt-1">ideal</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-orange-400 font-bold text-lg">D₃h</p>
              <p className="text-purple-300">trig. bipir.</p>
              <p className="text-purple-400 mt-1">5 koordinatsiya</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-orange-400 font-bold text-lg">ν(CO) ≈ 2000</p>
              <p className="text-purple-300">sm⁻¹</p>
              <p className="text-purple-400 mt-1">back-bonding</p>
            </div>
          </div>
        </div>

        {/* 3D TRIGONAL BIPYRAMIDAL */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <TrigonalBipyramidal3D />
        </div>

        {/* 18 ELEKTRON */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <ElektronQoidasi />
        </div>

        {/* SPIN-ONLY */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <SpinOnlyCalc />
        </div>

        {/* BACK-BONDING */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <BackBonding />
        </div>

        {/* IR SPEKTRI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <IRSpektr />
        </div>

        {/* BERRY PSEUDOROTATION */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <BerryPseudorotation />
        </div>

        {/* UV-VIS */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <UVVisSpektr />
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
            <li>Fe⁰ (d⁸) — <strong className="text-orange-400">nol oksidlanish darajasi</strong>, 18 elektron</li>
            <li>μ<sub>eff</sub> = <strong>0 μ<sub>B</sub></strong> — barcha elektronlar juftlashgan</li>
            <li><strong className="text-orange-400">Trigonal bipyramidal</strong> geometriya (D₃h)</li>
            <li><strong className="text-orange-400">Back-bonding</strong> — synergik bog'lanish (σ + π)</li>
            <li>ν(CO) = <strong>2022, 2000 cm⁻¹</strong> — o'rtacha back-bonding</li>
            <li><strong className="text-orange-400">Berry pseudorotation</strong> — aksial/ekvatorial almashinuvi</li>
            <li>Rangsiz suyuqlik — d-d o'tishlar yo'q (18 e⁻)</li>
            <li>MLCT cho'qqisi 260 nm da (UV sohada)</li>
            <li>Tarixiy ahamiyati: <strong>Mond (1891), Hieber (1930-50)</strong></li>
            <li>Amaliy: kataliz (hydroformylation), nanozarralar, CVD</li>
            <li><strong className="text-red-400">JUDA ZAHARLI</strong> — ehtiyotkorlik bilan ishlash kerak!</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/magnit/birikmalar/ni-cn4" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← [Ni(CN)₄]²⁻
          </Link>
          <Link href="/ilmiy/tahlil/magnit/birikmalar/zn-oh4" className="px-6 py-3 bg-orange-600/80 rounded-xl hover:bg-orange-500 text-white font-semibold">
            [Zn(OH)₄]²⁻ →
          </Link>
        </div>

      </section>
    </main>
  )
}