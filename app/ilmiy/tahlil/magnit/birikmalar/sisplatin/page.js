"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. SPIN-ONLY KALKULYATORI (Pt²⁺ d⁸ kvadrat tekislik)
// ============================================================================
function SpinOnlyCalc() {
  const [n, setN] = useState(0)
  const mu_so = Math.sqrt(n * (n + 2))

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🧮 Spin-only magnit momenti</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-pink-700/30 space-y-4">
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
            className="w-full h-2 bg-purple-900 rounded-lg appearance-none cursor-pointer accent-pink-500" />
          <div className="flex justify-between text-[10px] text-purple-400 mt-1">
            <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-center">
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Hisoblash</p>
            <p className="text-purple-200 font-mono">√({n}·{n + 2})</p>
          </div>
          <div className="bg-pink-900/40 border border-pink-500/40 rounded-lg p-3">
            <p className="text-pink-400">Natija</p>
            <p className="text-emerald-400 font-bold font-mono text-lg">{mu_so.toFixed(3)} μ<sub>B</sub></p>
          </div>
        </div>

        <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-lg p-3 text-xs">
          <p className="text-emerald-400 font-bold mb-1">✅ Sisplatin uchun:</p>
          <p className="text-purple-200">
            Pt²⁺ (d⁸) <strong>kvadrat tekislik</strong> geometriyasida. 4 ta eng past orbital
            (d<sub>xz</sub>, d<sub>yz</sub>, d<sub>z²</sub>, d<sub>xy</sub>) to'liq to'lgan.
            Eng yuqori d<sub>x²-y²</sub> orbitali bo'sh. <strong>n = 0</strong>, S = 0 →
            μ<sub>eff</sub> = <strong>0 μ<sub>B</sub></strong> — <strong>diamagnit</strong>.
          </p>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 d⁸ ionlari har doim diamagnitmi?</p>
          <p className="text-purple-200">
            <strong>Yo'q!</strong> Tetraedrik d⁸ komplekslar (masalan, [NiCl₄]²⁻) <strong>paramagnit</strong> (n=2).
            Sababi: tetraedrik maydon kuchsiz, elektronlar juftlashmaydi.
            Kuchli maydon ligandlari (CN⁻, NH₃) bilan d⁸ → <strong>kvadrat tekislik</strong>, diamagnit.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. KRISTALL MAYDON — KVADRAT TEKISLIK (d⁸)
// ============================================================================
function CrystalFieldSquarePlanar() {
  const [geometry, setGeometry] = useState("square") // square, tetrahedral, octahedral

  const geometries = {
    octahedral: {
      name: "Oktaedrik",
      formula: "[Ni(H₂O)₆]²⁺",
      diagram: {
        eg: [{ label: "d_z²", occ: "↑" }, { label: "d_x²-y²", occ: "↑" }],
        t2g: [{ label: "d_xy", occ: "↑↓" }, { label: "d_xz", occ: "↑↓" }, { label: "d_yz", occ: "↑" }]
      },
      spin: "Yuqori spin",
      n: 2,
      magnit: "Paramagnit",
      active: false
    },
    tetrahedral: {
      name: "Tetraedrik",
      formula: "[NiCl₄]²⁻",
      diagram: {
        t2: [{ label: "d_xy", occ: "↑" }, { label: "d_xz", occ: "↑" }, { label: "d_yz", occ: "↑↓" }],
        e: [{ label: "d_z²", occ: "↑↓" }, { label: "d_x²-y²", occ: "↑↓" }]
      },
      spin: "Yuqori spin",
      n: 2,
      magnit: "Paramagnit",
      active: false
    },
    square: {
      name: "Kvadrat tekislik",
      formula: "cis-[PtCl₂(NH₃)₂]",
      diagram: {
        dx2y2: [{ label: "d_x²-y²", occ: "__" }],
        dxy: [{ label: "d_xy", occ: "↑↓" }],
        dz2: [{ label: "d_z²", occ: "↑↓" }],
        dxz_yz: [{ label: "d_xz", occ: "↑↓" }, { label: "d_yz", occ: "↑↓" }]
      },
      spin: "Quyi spin",
      n: 0,
      magnit: "Diamagnit",
      active: true
    }
  }

  const g = geometries[geometry]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔬 Kristall maydon — d⁸ ionlari geometriyasi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-pink-700/30 space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(geometries).map(([key, val]) => (
            <button key={key} onClick={() => setGeometry(key)}
              className={`px-3 py-3 rounded-lg text-xs font-bold transition-all ${
                geometry === key
                  ? "bg-pink-600/80 text-white shadow-lg"
                  : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
              }`}>
              <div className="text-sm mb-1">{val.name}</div>
              <div className="text-[10px] opacity-70">{val.formula}</div>
            </button>
          ))}
        </div>

        <div className="bg-purple-950/50 rounded-xl p-5">
          <h4 className="text-yellow-400 font-bold mb-3 text-center">{g.name} — {g.formula}</h4>

          {/* KVADRAT TEKISLIK DIAGRAMMASI */}
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
                <p className="text-[10px]">Energiya tartibi: d<sub>xz,yz</sub> &lt; d<sub>z²</sub> &lt; d<sub>xy</sub> &lt;&lt; d<sub>x²-y²</sub></p>
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
                Δ<sub>t</sub> ≈ 4/9 · Δ<sub>o</sub> (kuchsiz!)
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-emerald-400 w-24">e (pastki)</span>
                <div className="flex gap-2">
                  <span className="text-yellow-400">↑↓</span>
                  <span className="text-yellow-400">↑↓</span>
                </div>
                <span className="text-emerald-400">4 e⁻</span>
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
                Δ<sub>o</sub> = 8500 cm⁻¹ (H₂O — kuchsiz)
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-emerald-400 w-24">t₂g</span>
                <div className="flex gap-2">
                  <span className="text-yellow-400">↑↓</span>
                  <span className="text-yellow-400">↑↓</span>
                  <span className="text-yellow-400">↑</span>
                </div>
                <span className="text-emerald-400">6 e⁻</span>
              </div>
            </div>
          )}

          {/* NATIJA */}
          <div className={`rounded p-3 text-center mt-4 ${
            g.magnit === "Diamagnit" 
              ? 'bg-blue-900/30 border border-blue-500/30' 
              : 'bg-red-900/30 border border-red-500/30'
          }`}>
            <p className="text-[10px] text-purple-300">Toq elektron (n):</p>
            <p className={`font-bold text-lg ${g.magnit === "Diamagnit" ? 'text-blue-400' : 'text-red-400'}`}>
              n = {g.n}
            </p>
            <p className="text-[10px] text-purple-300 mt-1">
              μ<sub>eff</sub> = {Math.sqrt(g.n * (g.n + 2)).toFixed(2)} μ<sub>B</sub> →
              <strong className={g.magnit === "Diamagnit" ? 'text-blue-400' : 'text-red-400'}> {g.magnit}</strong>
            </p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun Pt²⁺ doim kvadrat tekislik?</p>
          <p className="text-purple-200">
            <strong>5d metallari</strong> (Pt²⁺, Ir⁺, Au³⁺) — kuchliroq ligand maydoni
            (kattaroq Δ) va kuchliroq <strong>spin-orbital coupling</strong>.
            Natijada <strong>kvadrat tekislik</strong> energetik jihatdan har doim afzal.
            4d metallari (Pd²⁺) ham deyarli doim kvadrat tekislik.
            3d metallari (Ni²⁺) — ligandga bog'liq (H₂O → oktaedr, CN⁻ → kvadrat).
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. CIS-TRANS IZOMERIYA (interaktiv solishtirish)
// ============================================================================
function CisTransIzomeriya() {
  const [selected, setSelected] = useState("cis")

  const isomers = {
    cis: {
      name: "Sisplatin (CIS)",
      formula: "cis-[PtCl₂(NH₃)₂]",
      rang: "Sariq",
      mu: "0 μB",
      bio: "Saraton davolash",
      strukturasi: "Bir xil ligandlar YONMA-YON",
      cl_angle: "90°",
      activity: "Yuqori",
      geometry: [
        { type: "NH₃", x: 200, y: 90, color: "#3b82f6" },
        { type: "NH₃", x: 290, y: 180, color: "#3b82f6" },
        { type: "Cl", x: 200, y: 270, color: "#10b981" },
        { type: "Cl", x: 110, y: 180, color: "#10b981" }
      ]
    },
    trans: {
      name: "Transplatin (TRANS)",
      formula: "trans-[PtCl₂(NH₃)₂]",
      rang: "Sariq-kulrang",
      mu: "0 μB",
      bio: "Faol EMAS",
      strukturasi: "Bir xil ligandlar QARSHI",
      cl_angle: "180°",
      activity: "Yo'q",
      geometry: [
        { type: "NH₃", x: 200, y: 90, color: "#3b82f6" },
        { type: "NH₃", x: 200, y: 270, color: "#3b82f6" },
        { type: "Cl", x: 290, y: 180, color: "#10b981" },
        { type: "Cl", x: 110, y: 180, color: "#10b981" }
      ]
    }
  }

  const iso = isomers[selected]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 Cis-trans izomeriya — biologik faollikdagi ulkan farq</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-pink-700/30 space-y-4">
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">⚠️ Hayratlanarli fakt:</p>
          <p className="text-purple-200 text-xs">
            <strong>Ikki birikma bir xil formulaga ega</strong> — [PtCl₂(NH₃)₂], bir xil magnit xossasi
            (ikkalasi ham diamagnit, μ<sub>eff</sub> = 0), lekin <strong>biologik faolligi butunlay boshqa</strong>!
            Sisplatin — kuchli <strong>saraton dorisi</strong>, transplatin — <strong>faol emas</strong>.
            Bu <strong>geometrik izomeriya</strong>ning klassik namunasi.
          </p>
        </div>

        {/* TANLASH */}
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(isomers).map(([key, val]) => (
            <button key={key} onClick={() => setSelected(key)}
              className={`px-4 py-3 rounded-xl transition-all ${
                selected === key
                  ? "bg-gradient-to-r from-pink-600/80 to-purple-600/80 text-white shadow-lg border-2 border-pink-400"
                  : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50 border-2 border-transparent"
              }`}>
              <div className="text-lg font-bold mb-1">{val.name}</div>
              <div className="text-xs opacity-80">{val.formula}</div>
            </button>
          ))}
        </div>

        {/* SVG STRUKTURA */}
        <div className="bg-purple-950/50 rounded-xl p-5">
          <svg viewBox="0 0 400 360" className="w-full h-80">
            {/* Koordinatsion kvadrat */}
            <rect x="110" y="90" width="180" height="180" fill="none" stroke="#a78bfa" strokeWidth="1" strokeDasharray="4,4" opacity="0.3" />

            {/* Markaziy Pt atomi */}
            <circle cx="200" cy="180" r="22" fill="#ec4899" />
            <text x="200" y="186" fill="white" fontSize="16" textAnchor="middle" fontWeight="bold">Pt²⁺</text>

            {/* Ligandlar */}
            {iso.geometry.map((l, i) => (
              <g key={i}>
                <line x1="200" y1="180" x2={l.x} y2={l.y} stroke="#a78bfa" strokeWidth="2" />
                <circle cx={l.x} cy={l.y} r="18" fill={l.color} opacity="0.9" />
                <text x={l.x} y={l.y + 5} fill="white" fontSize="12" textAnchor="middle" fontWeight="bold">
                  {l.type}
                </text>
              </g>
            ))}

            {/* Burchak ko'rsatkichi */}
            <path
              d={selected === "cis" 
                ? "M 200 150 A 30 30 0 0 1 230 180"
                : "M 200 150 A 30 30 0 1 1 200 210"}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="1.5"
            />
            <text x={selected === "cis" ? "235" : "240"} y={selected === "cis" ? "165" : "180"} fill="#fbbf24" fontSize="11" fontWeight="bold">
              {iso.cl_angle}
            </text>

            {/* Label */}
            <text x="200" y="320" fill={iso.activity === "Yuqori" ? "#10b981" : "#ef4444"} fontSize="14" textAnchor="middle" fontWeight="bold">
              {iso.activity === "Yuqori" ? "✓ SARATON DORISI" : "✗ FAOL EMAS"}
            </text>
            <text x="200" y="345" fill="#c4b5fd" fontSize="10" textAnchor="middle">
              {iso.strukturasi}
            </text>
          </svg>
        </div>

        {/* XUSUSIYATLAR */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-purple-900/50 rounded-lg p-3 text-center">
            <p className="text-purple-400">Rang</p>
            <p className="text-yellow-400 font-bold">{iso.rang}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3 text-center">
            <p className="text-purple-400">μ<sub>eff</sub></p>
            <p className="text-emerald-400 font-bold">{iso.mu}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3 text-center">
            <p className="text-purple-400">Cl−Pt−Cl</p>
            <p className="text-pink-400 font-bold">{iso.cl_angle}</p>
          </div>
          <div className={`rounded-lg p-3 text-center ${iso.activity === "Yuqori" ? 'bg-emerald-900/30 border border-emerald-500/30' : 'bg-red-900/30 border border-red-500/30'}`}>
            <p className="text-purple-400">Bio faollik</p>
            <p className={`font-bold ${iso.activity === "Yuqori" ? 'text-emerald-400' : 'text-red-400'}`}>{iso.activity}</p>
          </div>
        </div>

        <div className="bg-pink-600/10 border border-pink-500/30 rounded-lg p-4 text-xs">
          <p className="text-pink-400 font-bold mb-2">🧬 Nima uchun faqat CIS faol?</p>
          <p className="text-purple-200 mb-2">
            <strong>DNA ga bog'lanish mexanizmi:</strong> Sisplatinda 2 ta Cl⁻ chiqib ketadi va 2 ta
            <strong> bo'sh koordinatsion o'rin</strong> hosil bo'ladi — ular <strong>yonma-yon</strong>
            joylashgan. Bu 2 ta <strong>guanin bazasiga (N7)</strong> bir vaqtda bog'lanishga imkon beradi.
          </p>
          <ul className="text-purple-300 space-y-1 ml-4">
            <li>• <strong className="text-pink-400">Cisplatin</strong> → <strong>1,2-intrastrand crosslink</strong> → DNA egiladi → apoptoz</li>
            <li>• <strong className="text-red-400">Transplatin</strong> → faqat <strong>monofunktsional</strong> yoki 1,3-crosslink (kam samarali)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. DNA BILAN O'ZARO TA'SIR (vizualizatsiya)
// ============================================================================
function DNACrosslink() {
  const [step, setStep] = useState(0)

  const steps = [
    {
      title: "1. Hujayraga kirish",
      desc: "Sisplatin qon orqali saraton hujayrasiga kiradi",
      icon: "💊",
      color: "bg-blue-900/30 border-blue-500/30"
    },
    {
      title: "2. Aquation (suv bilan almashinish)",
      desc: "Cl⁻ ligandlari H₂O bilan almashadi — faol shakl",
      formula: "[PtCl₂(NH₃)₂] + 2H₂O → [Pt(H₂O)₂(NH₃)₂]²⁺ + 2Cl⁻",
      icon: "💧",
      color: "bg-cyan-900/30 border-cyan-500/30"
    },
    {
      title: "3. DNA ga bog'lanish",
      desc: "Aktiv Pt²⁺ 2 ta guanin bazasining N7 atomiga bog'lanadi",
      icon: "🧬",
      color: "bg-pink-900/30 border-pink-500/30"
    },
    {
      title: "4. 1,2-Intrastrand crosslink",
      desc: "Qo'shni G-G yoki A-G bazalari orasida Pt ko'prigi",
      icon: "🔗",
      color: "bg-purple-900/30 border-purple-500/30"
    },
    {
      title: "5. DNA egilishi (~35°)",
      desc: "DNA spiralining strukturasini buzadi",
      icon: "📐",
      color: "bg-orange-900/30 border-orange-500/30"
    },
    {
      title: "6. Apoptoz (hujayra o'limi)",
      desc: "Hujayra replikatsiya qilolmaydi → o'zini o'zi yo'q qiladi",
      icon: "☠️",
      color: "bg-red-900/30 border-red-500/30"
    }
  ]

  const s = steps[step]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🧬 DNA bilan o'zaro ta'sir mexanizmi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-pink-700/30 space-y-4">
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">💊 Saraton dorisi sifatida:</p>
          <p className="text-purple-200 text-xs">
            Sisplatin — <strong>birinchi metall-tarkibli saraton dorisi</strong> (FDA 1978).
            Ayniqsa <strong>testis, ovary, siydik pufagi, bosh va bo'yin</strong> saratonlarida
            juda samarali (testis saratonida 90%+ davolash).
          </p>
        </div>

        {/* STEP NAVIGATION */}
        <div className="flex gap-1 overflow-x-auto pb-2">
          {steps.map((_, i) => (
            <button key={i} onClick={() => setStep(i)}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                step === i
                  ? "bg-pink-600/80 text-white shadow-lg"
                  : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
              }`}>
              {i + 1}
            </button>
          ))}
        </div>

        {/* CURRENT STEP */}
        <div className={`rounded-xl p-5 border ${s.color}`}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{s.icon}</span>
            <h4 className="text-yellow-400 font-bold text-lg">{s.title}</h4>
          </div>
          <p className="text-purple-200 text-sm mb-3">{s.desc}</p>
          {s.formula && (
            <div className="bg-purple-950/50 rounded p-2 font-mono text-xs text-center text-emerald-400">
              {s.formula}
            </div>
          )}
        </div>

        {/* VISUALIZATSIYA */}
        <div className="bg-purple-950/50 rounded-xl p-5">
          <h5 className="text-pink-400 font-bold text-xs mb-3">1,2-Intrastrand crosslink (sxematik):</h5>
          <svg viewBox="0 0 400 280" className="w-full h-64">
            {/* DNA spiral (simplified) */}
            <path d="M 50 40 Q 100 80, 150 40 T 250 40 T 350 40" fill="none" stroke="#3b82f6" strokeWidth="3" opacity="0.5" />
            <path d="M 50 240 Q 100 200, 150 240 T 250 240 T 350 240" fill="none" stroke="#3b82f6" strokeWidth="3" opacity="0.5" />

            {/* Asoslar */}
            {[
              { x: 80, y1: 55, y2: 225, base1: "A", base2: "T", color1: "#ef4444", color2: "#10b981" },
              { x: 140, y1: 45, y2: 235, base1: "G", base2: "C", color1: "#f59e0b", color2: "#3b82f6", pt: true },
              { x: 200, y1: 55, y2: 225, base1: "G", base2: "C", color1: "#f59e0b", color2: "#3b82f6", pt: true },
              { x: 260, y1: 45, y2: 235, base1: "T", base2: "A", color1: "#10b981", color2: "#ef4444" },
              { x: 320, y1: 55, y2: 225, base1: "C", base2: "G", color1: "#3b82f6", color2: "#f59e0b" }
            ].map((b, i) => (
              <g key={i}>
                {/* Hydrogen bonds */}
                <line x1={b.x} y1={b.y1 + 20} x2={b.x} y2={b.y2 - 20} stroke="#a78bfa" strokeWidth="0.5" strokeDasharray="2,2" />
                {/* Bases */}
                <rect x={b.x - 12} y={b.y1} width="24" height="20" fill={b.color1} rx="3" />
                <text x={b.x} y={b.y1 + 14} fill="white" fontSize="11" textAnchor="middle" fontWeight="bold">{b.base1}</text>
                <rect x={b.x - 12} y={b.y2 - 20} width="24" height="20" fill={b.color2} rx="3" />
                <text x={b.x} y={b.y2 - 6} fill="white" fontSize="11" textAnchor="middle" fontWeight="bold">{b.base2}</text>
                {/* Pt bridge */}
                {b.pt && (
                  <>
                    <circle cx={b.x + 25} cy={(b.y1 + b.y2) / 2} r="8" fill="#ec4899" />
                    <text x={b.x + 25} y={(b.y1 + b.y2) / 2 + 3} fill="white" fontSize="8" textAnchor="middle" fontWeight="bold">Pt</text>
                  </>
                )}
              </g>
            ))}

            {/* Pt-N7 bonds */}
            <line x1="165" y1="140" x2="152" y2="65" stroke="#ec4899" strokeWidth="2" />
            <line x1="165" y1="140" x2="212" y2="75" stroke="#ec4899" strokeWidth="2" />
            <line x1="225" y1="140" x2="212" y2="75" stroke="#ec4899" strokeWidth="2" />

            {/* Label */}
            <text x="200" y="270" fill="#ec4899" fontSize="10" textAnchor="middle" fontWeight="bold">
              Pt(G-N7)₂ crosslink — DNA egilishi ~35°
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Bog'lanish</p>
            <p className="text-pink-400 font-bold">N7 (guanin)</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Crosslink turi</p>
            <p className="text-pink-400 font-bold">1,2-intra</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">DNA egilish</p>
            <p className="text-pink-400 font-bold">~35°</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. 195Pt NMR (noyob xususiyat)
// ============================================================================
function Pt195NMR() {
  const [B0, setB0] = useState(9.4) // Tesla

  // 195Pt xususiyatlari
  const gamma = 5.77e7 // rad/(T·s)
  const abundance = 33.8 // %
  const I = 0.5 // spin

  // Larmor chastotasi: ν = γ·B₀/(2π)
  const nu_MHz = (gamma * B0) / (2 * Math.PI * 1e6)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📡 ¹⁹⁵Pt NMR — noyob spektroskopik usul</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-pink-700/30 space-y-4">
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">💎 Pt ning noyob xususiyati:</p>
          <p className="text-purple-200 text-xs">
            <strong>¹⁹⁵Pt</strong> — yagona NMR-faol Pt izotopi (I = 1/2, 33.8% tabiiy).
            Bu metall komplekslar uchun <strong>juda noyob</strong> — ko'p metallar NMR da ko'rinmaydi.
            ¹⁹⁵Pt NMR orqali sisplatin va uning metabolitlarini to'g'ridan-to'g'ri kuzatish mumkin.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-purple-400">I (spin)</p>
            <p className="text-pink-400 font-bold font-mono text-lg">1/2</p>
          </div>
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-purple-400">Tabiiylik</p>
            <p className="text-emerald-400 font-bold font-mono text-lg">33.8%</p>
          </div>
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-purple-400">γ (10⁷ rad/Ts)</p>
            <p className="text-yellow-400 font-bold font-mono">5.77</p>
          </div>
        </div>

        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">B₀ (magnit maydoni):</span>
            <span className="text-emerald-400 font-mono">{B0.toFixed(1)} T</span>
          </label>
          <input type="range" min="1" max="21" step="0.1" value={B0}
            onChange={(e) => setB0(parseFloat(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-pink-500" />
          <div className="flex justify-between text-[10px] text-purple-400 mt-1">
            <span>1 T</span><span>7 T</span><span>14 T</span><span>21 T</span>
          </div>
        </div>

        <div className="bg-pink-900/40 border border-pink-500/40 rounded-lg p-4 text-center">
          <p className="text-pink-400 text-xs mb-1">Larmor chastotasi (ν)</p>
          <p className="text-emerald-400 font-bold font-mono text-2xl">{nu_MHz.toFixed(2)} MHz</p>
          <p className="text-purple-400 text-xs mt-2">
            ν = γ·B₀/(2π) — NMR signalning rezonans chastotasi
          </p>
        </div>

        {/* Kimyoviy siljish */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-emerald-400 font-bold text-xs mb-3">¹⁹⁵Pt kimyoviy siljishlari (δ, ppm):</h5>
          <svg viewBox="0 0 400 180" className="w-full h-40">
            <line x1="30" y1="140" x2="370" y2="140" stroke="#4c1d95" strokeWidth="1" />
            <text x="200" y="170" fill="#c4b5fd" fontSize="9" textAnchor="middle">δ (ppm) — H₂[PtCl₆] standart</text>

            {/* Scale */}
            {[-6000, -4000, -2000, 0, 2000].map((v, i) => (
              <g key={i}>
                <line x1={30 + (i * 85)} y1="135" x2={30 + (i * 85)} y2="145" stroke="#a78bfa" strokeWidth="1" />
                <text x={30 + (i * 85)} y="155" fill="#a78bfa" fontSize="8" textAnchor="middle">{v}</text>
              </g>
            ))}

            {/* Peaks */}
            {[
              { name: "Sisplatin", ppm: -2100, color: "#ec4899" },
              { name: "Transplatin", ppm: -1950, color: "#f59e0b" },
              { name: "[PtCl₄]²⁻", ppm: -1600, color: "#10b981" },
              { name: "[PtCl₆]²⁻", ppm: 0, color: "#3b82f6" },
            ].map((p, i) => {
              const x = 30 + ((p.ppm + 6000) / 8000) * 340
              return (
                <g key={i}>
                  <polyline
                    points={`${x-8},140 ${x-4},130 ${x},70 ${x},30 ${x},70 ${x+4},130 ${x+8},140`}
                    fill="none" stroke={p.color} strokeWidth="2"
                  />
                  <text x={x} y="20" fill={p.color} fontSize="8" textAnchor="middle" fontWeight="bold">
                    {p.name}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Kimyoviy siljish diapazoni:</p>
          <p className="text-purple-200">
            ¹⁹⁵Pt NMR <strong>juda keng diapazon</strong>ga ega (−6000 dan +6000 ppm gacha!).
            ¹H NMR da bu atigi 10-15 ppm. Sababi: Pt ning <strong>katta elektron qutblanishi</strong>
            (paramagnetic shielding). Kichik strukturaviy o'zgarishlar katta δ farq beradi.
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

      <div className="bg-purple-800/30 rounded-xl p-5 border border-pink-700/30 space-y-4">
        <div className="bg-purple-950/50 rounded-lg p-4">
          <svg viewBox="0 0 400 200" className="w-full h-48">
            <line x1="40" y1="170" x2="380" y2="170" stroke="#4c1d95" strokeWidth="1" />
            <line x1="40" y1="20" x2="40" y2="170" stroke="#4c1d95" strokeWidth="1" />
            <text x="210" y="195" fill="#c4b5fd" fontSize="10" textAnchor="middle">λ (nm)</text>
            <text x="15" y="95" fill="#c4b5fd" fontSize="9" transform="rotate(-90, 15, 95)">A</text>

            {[300, 350, 400, 450, 500].map((wl, i) => (
              <text key={i} x={40 + ((wl - 280) / 240) * 340} y="185" fill="#a78bfa" fontSize="8" textAnchor="middle">
                {wl}
              </text>
            ))}

            {/* Spektr egri chizig'i */}
            <polyline
              points={Array.from({ length: 100 }, (_, i) => {
                const wl = 280 + i * 2.4
                const x = 40 + (i / 100) * 340

                // 3 o'tish: ~301, 340, 400 nm
                const p1 = Math.exp(-0.5 * Math.pow((wl - 301) / 12, 2)) * 120
                const p2 = Math.exp(-0.5 * Math.pow((wl - 340) / 15, 2)) * 80
                const p3 = Math.exp(-0.5 * Math.pow((wl - 400) / 25, 2)) * 50

                const y = 170 - (p1 + p2 + p3)
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke="#ec4899" strokeWidth="2" />

            {/* Pik labels */}
            <line x1="69" y1="50" x2="69" y2="25" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x="69" y="20" fill="#f59e0b" fontSize="8" textAnchor="middle">301 nm</text>

            <line x1="125" y1="90" x2="125" y2="30" stroke="#a78bfa" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x="125" y="25" fill="#a78bfa" fontSize="8" textAnchor="middle">340 nm</text>

            <line x1="210" y1="120" x2="210" y2="35" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x="210" y="30" fill="#3b82f6" fontSize="8" textAnchor="middle">400 nm</text>
          </svg>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-yellow-400 font-bold mb-1">301 nm</p>
            <p className="text-purple-200">¹A<sub>1g</sub> → ¹E<sub>g</sub></p>
            <p className="text-purple-400 text-[10px]">d-d o'tish</p>
          </div>
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-yellow-400 font-bold mb-1">340 nm</p>
            <p className="text-purple-200">¹A<sub>1g</sub> → ¹A<sub>2g</sub></p>
            <p className="text-purple-400 text-[10px]">d-d o'tish</p>
          </div>
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-yellow-400 font-bold mb-1">400 nm</p>
            <p className="text-purple-200">LMCT</p>
            <p className="text-purple-400 text-[10px]">Cl → Pt</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun sariq?</p>
          <p className="text-purple-200">
            400 nm (<strong>binafsha-ko'k</strong>) sohasida LMCT yutilish bor.
            Komplementar rang — <strong className="text-yellow-400">sariq</strong>.
            Barcha d-d o'tishlar Laporte-taqiqlangan (markaziy simmetrik kompleks).
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 7. IR SPEKTROSKOPIYA
// ============================================================================
function IRSpektr() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📊 IQ spektri — ligand tebranishlari</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-pink-700/30 space-y-4">
        <div className="bg-purple-950/50 rounded-lg p-4">
          <svg viewBox="0 0 400 200" className="w-full h-48">
            <line x1="40" y1="170" x2="380" y2="170" stroke="#4c1d95" strokeWidth="1" />
            <line x1="40" y1="20" x2="40" y2="170" stroke="#4c1d95" strokeWidth="1" />
            <text x="210" y="195" fill="#c4b5fd" fontSize="10" textAnchor="middle">ν (cm⁻¹)</text>
            <text x="15" y="95" fill="#c4b5fd" fontSize="9" transform="rotate(-90, 15, 95)">T (%)</text>

            {/* Scale (reversed) */}
            {[500, 1000, 1500, 2000, 2500, 3000, 3500].map((v, i) => (
              <text key={i} x={40 + (i * 56.7)} y="185" fill="#a78bfa" fontSize="7" textAnchor="middle">
                {v}
              </text>
            ))}

            {/* Spektr egri chizig'i */}
            <polyline
              points={Array.from({ length: 200 }, (_, i) => {
                const nu = 400 + i * 16
                const x = 40 + (i / 200) * 340

                // Peaks (transmittance drops)
                const p1 = Math.exp(-0.5 * Math.pow((nu - 520) / 20, 2)) * 60   // Pt-Cl
                const p2 = Math.exp(-0.5 * Math.pow((nu - 3280) / 30, 2)) * 70  // NH₃ sym
                const p3 = Math.exp(-0.5 * Math.pow((nu - 3200) / 30, 2)) * 75  // NH₃ asym
                const p4 = Math.exp(-0.5 * Math.pow((nu - 1615) / 20, 2)) * 40  // NH₃ bend
                const p5 = Math.exp(-0.5 * Math.pow((nu - 1300) / 20, 2)) * 30  // NH₃ rock

                const y = 30 + (p1 + p2 + p3 + p4 + p5)
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke="#ec4899" strokeWidth="2" />
          </svg>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-2 px-2 text-yellow-400">ν (cm⁻¹)</th>
                <th className="text-left py-2 px-2 text-yellow-400">Assign</th>
                <th className="text-left py-2 px-2 text-yellow-400">Izoh</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["3280, 3200", "ν(N−H)", "NH₃ sim/asim cho'zilish"],
                ["1615", "δ(H−N−H)", "NH₃ egilish (bending)"],
                ["1300", "ρ(NH₃)", "NH₃ rock tebranish"],
                ["520", "ν(Pt−N)", "Metall-ligand (kuchli)"],
                ["320, 330", "ν(Pt−Cl)", "CIS uchun 2 ta pik (C₂v simmetriya)"],
              ].map((r, i) => (
                <tr key={i} className="border-b border-purple-800/30">
                  <td className="py-2 px-2 font-mono text-pink-400">{r[0]}</td>
                  <td className="py-2 px-2 font-bold text-yellow-400">{r[1]}</td>
                  <td className="py-2 px-2 text-[11px]">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Cis vs Trans farqi IQ da:</p>
          <p className="text-purple-200">
            <strong className="text-pink-400">Cisplatin</strong> — C₂v simmetriya → <strong>2 ta ν(Pt−Cl)</strong> (320, 330 cm⁻¹)<br/>
            <strong className="text-orange-400">Transplatin</strong> — D₂h simmetriya → <strong>1 ta ν(Pt−Cl)</strong> (IR-faol emas, Raman-da ko'rinadi)<br/>
            Bu farq — geometrik izomerlarni IQ orqali farqlashning klassik usuli!
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 8. TARIXIY KONTEKST — ROSENBERG KASHFIYOTI
// ============================================================================
function TarixiyKontekst() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🏛️ Tarixiy kontekst — Rosenberg kashfiyoti</h3>

      <div className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 rounded-xl p-5 border border-pink-500/30 space-y-4">
        <div className="space-y-3">
          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🔬</div>
              <div>
                <p className="text-yellow-400 font-bold">1965 — Tasodifiy kuzatish</p>
                <p className="text-purple-200 text-xs mt-1">
                  <strong>Barnett Rosenberg</strong> (Michigan State University) E. coli bakteriyalarining
                  elektr maydondagi o'sishini o'rganyapti. Pt elektrodlardan ajralgan modda
                  bakteriyalarning bo'linishini to'xtatganini ko'rdi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">⚗️</div>
              <div>
                <p className="text-yellow-400 font-bold">1969 — Modda aniqlandi</p>
                <p className="text-purple-200 text-xs mt-1">
                  Bu modda <strong>cis-[PtCl₂(NH₃)₂]</strong> ekanligi aniqlandi.
                  Transplatin (bir xil formula, boshqa geometriya) — <strong>faol emas</strong>!
                  Bu kashfiyot kimyogarlar uchun hayratlanarli edi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">💊</div>
              <div>
                <p className="text-yellow-400 font-bold">1978 — FDA tasdiqladi</p>
                <p className="text-purple-200 text-xs mt-1">
                  Sisplatin <strong>birinchi metall-tarkibli saraton dorisi</strong> sifatida tasdiqlandi.
                  Ayniqsa <strong>testis saratonida 90%+</strong> muvaffaqiyat!
                  Keyinchalik karboplatin, oksaliplatin kabi analoglar ishlab chiqildi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🏆</div>
              <div>
                <p className="text-yellow-400 font-bold">1984 — Lasker mukofoti</p>
                <p className="text-purple-200 text-xs mt-1">
                  Rosenberg <strong>Albert Lasker Clinical Medical Research Award</strong> oldi.
                  Bu mukofot ko'pincha "American Nobel" deb ataladi.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">💡 Kashfiyotning ahamiyati:</p>
          <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
            <li><strong>Bioanorganik kimyo</strong> sohasining rivojlanishi</li>
            <li><strong>Geometrik izomeriya</strong>ning biologik ahamiyati isbotlandi</li>
            <li>Hozirgi kunda <strong>yillik 2+ million</strong> bemor davolanadi</li>
            <li>Dunyodagi eng ko'p sotiladigan dorilardan biri (1990-larda)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 9. AVVALGI/KEYINGI AVLODLAR
// ============================================================================
function AvlodlarDorilar() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">💊 Sisplatin avlodlari</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-pink-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-2 text-yellow-400">Dori</th>
                <th className="text-center py-3 px-2 text-yellow-400">Avlod</th>
                <th className="text-center py-3 px-2 text-yellow-400">Formula</th>
                <th className="text-center py-3 px-2 text-yellow-400">Afzallik</th>
                <th className="text-left py-3 px-2 text-yellow-400">Qo'llanilishi</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["Sisplatin", "1", "cis-[PtCl₂(NH₃)₂]", "Klassik", "Testis, ovary, siydik"],
                ["Karboplatin", "2", "[Pt(CBDCA)(NH₃)₂]", "Kam toksik", "Ovary, o'pka"],
                ["Oksaliplatin", "3", "[Pt(ox)(dach)]", "Yangi spektr", "Kolorektal"],
                ["Nedaplatin", "2", "[Pt(glycolate)(NH₃)₂]", "Yaponiyada", "Bosh/bo'yin"],
                ["Lobaplatin", "3", "[Pt(CBDCA)(dach)]", "Xitoyda", "Saraton"],
              ].map((r, i) => (
                <tr key={i} className={`border-b border-purple-800/30 ${i === 0 ? 'bg-pink-600/10' : ''}`}>
                  <td className="py-2 px-2 font-bold text-pink-400">{r[0]}</td>
                  <td className="py-2 px-2 text-center">{r[1]}</td>
                  <td className="py-2 px-2 text-center font-mono text-[10px]">{r[2]}</td>
                  <td className="py-2 px-2 text-center text-emerald-400">{r[3]}</td>
                  <td className="py-2 px-2 text-[11px]">{r[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-purple-400 text-xs mt-3">
          * CBDCA = siklobutandikarboksilat, dach = diaminosiklogeksan, ox = oksalat
        </p>
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
      <h3 className="text-white font-semibold">🏭 Klinik qo'llanilishi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-pink-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-5">
            <div className="text-3xl mb-2">✅</div>
            <h4 className="text-emerald-400 font-bold mb-2">Juda samarali (90%+)</h4>
            <ul className="text-purple-200 text-xs space-y-1">
              <li>• Testis saratoni</li>
              <li>• Ovary saratoni</li>
              <li>• Siydik pufagi</li>
            </ul>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-5">
            <div className="text-3xl mb-2">🟡</div>
            <h4 className="text-yellow-400 font-bold mb-2">O'rtacha samarali</h4>
            <ul className="text-purple-200 text-xs space-y-1">
              <li>• Bosh va bo'yin saratoni</li>
              <li>• Kichik hujayrali o'pka</li>
              <li>• Bachadon bo'yni</li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">⚠️</div>
            <h4 className="text-orange-400 font-bold mb-2">Nojo'ya ta'sirlari</h4>
            <ul className="text-purple-200 text-xs space-y-1">
              <li>• <strong>Nefrotoksiklik</strong> (buyrak)</li>
              <li>• <strong>Ototoksiklik</strong> (eshitish)</li>
              <li>• <strong>Neyrotoksiklik</strong> (asab)</li>
              <li>• Ko'ngil aynishi, qusish</li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🔬</div>
            <h4 className="text-blue-400 font-bold mb-2">Rezistentlik muammosi</h4>
            <p className="text-purple-200 text-xs mb-2">
              Ko'p saraton turlari sisplatinga <strong>tabiiy yoki orttirilgan</strong> rezistent.
            </p>
            <ul className="text-purple-300 text-[10px] space-y-1">
              <li>• Glutation (GSH) oshishi</li>
              <li>• DNA ta'mirlash kuchayishi</li>
              <li>• Hujayra kirishining kamayishi</li>
            </ul>
          </div>
        </div>

        <div className="bg-pink-600/10 border border-pink-500/30 rounded-lg p-4">
          <p className="text-pink-400 font-bold mb-2">🌟 Qiziqarli fakt:</p>
          <p className="text-purple-200 text-xs">
            Lance Armstrong — mashhur velosipedchi — 1996 yilda <strong>testis saratoni</strong>
            (III bosqich, metastazlar bilan) bilan kasallangan. Sisplatin asosidagi
            kimyoterapiya bilan <strong>to'liq tuzaldi</strong> va 7 marta Tour de France g'olibi bo'ldi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function SisplatinMagnit() {
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
          <span className="text-pink-400">Sisplatin</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-pink-400">🧲 Sisplatin — Magnit tahlili</h1>
          <p className="text-purple-400 text-sm">
            cis-[PtCl₂(NH₃)₂] • Pt²⁺ (d⁸, kvadrat tekislik) • S=0 • Diamagnit • Saraton dorisi
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-pink-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-2xl md:text-4xl font-extrabold font-mono text-pink-400">cis-[PtCl₂(NH₃)₂]</span>
            <div>
              <h2 className="text-xl font-bold text-white">Magnit tahlili — to'liq profil</h2>
              <p className="text-purple-400">"Saraton dorisi" — bioanorganik kimyo klassikasi</p>
            </div>
          </div>

          <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-pink-400">Sisplatin</strong> — birinchi metall-tarkibli saraton dorisi.
              Pt²⁺ (d⁸) <strong>kvadrat tekislik</strong> geometriyasiga ega. Barcha 8 ta d-elektron
              to'liq juftlashgan — <strong>S = 0</strong>, <strong>diamagnit</strong>.
              μ<sub>eff</sub> = 0 μ<sub>B</sub>. Hayratlanarlisi — <strong>geometrik izomeri</strong>
              (transplatin) bir xil magnit xossasiga ega, lekin <strong>biologik faolligi yo'q</strong>.
              Bu geometrik izomeriyaning klinik ahamiyatini ko'rsatadi.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-pink-400 font-bold text-lg">S = 0</p>
              <p className="text-purple-300">d⁸, kvadrat</p>
              <p className="text-purple-400 mt-1">Diamagnit</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-pink-400 font-bold text-lg">μ = 0 μ<sub>B</sub></p>
              <p className="text-purple-300">n = 0</p>
              <p className="text-purple-400 mt-1">ideal</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-pink-400 font-bold text-lg">¹⁹⁵Pt NMR</p>
              <p className="text-purple-300">δ = −2100</p>
              <p className="text-purple-400 mt-1">I = 1/2</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-pink-400 font-bold text-lg">FDA 1978</p>
              <p className="text-purple-300">saraton</p>
              <p className="text-purple-400 mt-1">90%+ testis</p>
            </div>
          </div>
        </div>

        {/* CIS-TRANS IZOMERIYA — eng muhim! */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <CisTransIzomeriya />
        </div>

        {/* DNA BILAN O'ZARO TA'SIR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <DNACrosslink />
        </div>

        {/* KRISTALL MAYDON */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <CrystalFieldSquarePlanar />
        </div>

        {/* SPIN-ONLY */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <SpinOnlyCalc />
        </div>

        {/* 195Pt NMR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <Pt195NMR />
        </div>

        {/* UV-VIS */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <UVVisSpektr />
        </div>

        {/* IR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <IRSpektr />
        </div>

        {/* TARIX */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <TarixiyKontekst />
        </div>

        {/* AVLODLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <AvlodlarDorilar />
        </div>

        {/* AMALIYOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <AmaliyQollanilish />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-pink-600/10 to-purple-600/10 border border-pink-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>Sisplatin — <strong className="text-pink-400">diamagnit</strong> (Pt²⁺ d⁸, kvadrat tekislik, S=0)</li>
            <li>μ<sub>eff</sub> = <strong>0 μ<sub>B</sub></strong> — barcha d-elektronlar juftlashgan</li>
            <li><strong className="text-pink-400">Cis-trans izomeriya</strong> — bir xil formula, butunlay boshqa biologik faollik</li>
            <li>DNA bilan <strong>1,2-intrastrand crosslink</strong> hosil qiladi → apoptoz</li>
            <li>¹⁹⁵Pt NMR — δ = −2100 ppm (I = 1/2, 33.8% tabiiy)</li>
            <li>IR: <strong>2 ta ν(Pt−Cl)</strong> (320, 330 cm⁻¹) — cis izomerni tasdiqlaydi</li>
            <li>UV-Vis: 301, 340, 400 nm — sariq rang (400 nm komplementar)</li>
            <li>Tarixiy ahamiyati: <strong>birinchi metall saraton dorisi</strong> (Rosenberg, 1965)</li>
            <li>Klinik: testis saratonida <strong>90%+</strong> muvaffaqiyat</li>
            <li>Avlodlari: karboplatin (2), oksaliplatin (3) — toksikligi kamaygan</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/magnit/birikmalar/co-nh3-6-cl3" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← [Co(NH₃)₆]Cl₃
          </Link>
          <Link href="/ilmiy/tahlil/magnit/birikmalar/ferrosen" className="px-6 py-3 bg-pink-600/80 rounded-xl hover:bg-pink-500 text-white font-semibold">
            Ferrosen →
          </Link>
        </div>

      </section>
    </main>
  )
}