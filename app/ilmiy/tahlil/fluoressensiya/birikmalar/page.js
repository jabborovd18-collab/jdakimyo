"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

export default function FluoressensiyaBirikmalar() {
  const [qidiruv, setQidiruv] = useState("")
  const [filter, setFilter] = useState("hammasi")
  const [selectedBir, setSelectedBir] = useState(null)
  const [showSpectrum, setShowSpectrum] = useState(true)

  const birikmalar = [
    // ═══════════════════════════════════════════════════════════
    // A. LANTANID KOMPLEKSLARI (4 ta) — Antenna effekti
    // ═══════════════════════════════════════════════════════════
    {
      id: "eu-tta3-phen",
      formula: "[Eu(tta)₃(phen)]",
      iupac: "Tris(thenoyltrifluoroasetonato)(1,10-fenantrolin)evropiy(III)",
      metal: "Eu³⁺",
      guruh: "lantanid",
      emissiya: "612 nm",
      emissiyaColor: "#ef4444",
      emissiyaRang: "Qizil",
      transition: "⁵D₀ → ⁷F₂",
      phi: "0.65",
      tau: "0.8 ms",
      stokes: "250 nm",
      qollanilish: "Vaqt-ajraladigan tahlil, sensorlar",
      antenna: "tta + phen",
      izoh: "Klassik Eu kompleksi — antenna effekti eng yaxshi o'rganilgan misol. tta va phen ligandlar kuchli xromofor.",
      href: "/ilmiy/tahlil/fluoressensiya/birikmalar/eu-tta3-phen",
      rang: "red",
      peaks: [
        { lambda: 590, intensity: 0.3, assign: "⁵D₀→⁷F₁" },
        { lambda: 612, intensity: 1.0, assign: "⁵D₀→⁷F₂" },
        { lambda: 650, intensity: 0.2, assign: "⁵D₀→⁷F₃" },
        { lambda: 690, intensity: 0.1, assign: "⁵D₀→⁷F₄" }
      ]
    },
    {
      id: "tb-acac3-phen",
      formula: "[Tb(acac)₃(phen)]",
      iupac: "Tris(atsetilasetonato)(1,10-fenantrolin)terbiy(III)",
      metal: "Tb³⁺",
      guruh: "lantanid",
      emissiya: "545 nm",
      emissiyaColor: "#10b981",
      emissiyaRang: "Yashil",
      transition: "⁵D₄ → ⁷F₅",
      phi: "0.75",
      tau: "1.2 ms",
      stokes: "230 nm",
      qollanilish: "Eng yuqori Φ lantanid, bioimaging",
      antenna: "acac + phen",
      izoh: "Lantanidlar orasida eng yuqori kvant unumi. Yashil emissiya — bioimaging uchun ideal (to'qima avtomatik fluoressensiyasi kam).",
      href: "/ilmiy/tahlil/fluoressensiya/birikmalar/tb-acac3-phen",
      rang: "emerald",
      peaks: [
        { lambda: 490, intensity: 0.3, assign: "⁵D₄→⁷F₆" },
        { lambda: 545, intensity: 1.0, assign: "⁵D₄→⁷F₅" },
        { lambda: 585, intensity: 0.4, assign: "⁵D₄→⁷F₄" },
        { lambda: 620, intensity: 0.2, assign: "⁵D₄→⁷F₃" }
      ]
    },
    {
      id: "eu-dpa3",
      formula: "[Eu(dpa)₃]³⁻",
      iupac: "Tris(2,2'-dipirinilamin)evropiy(III)",
      metal: "Eu³⁺",
      guruh: "lantanid",
      emissiya: "615 nm",
      emissiyaColor: "#ef4444",
      emissiyaRang: "Qizil",
      transition: "⁵D₀ → ⁷F₂",
      phi: "0.30",
      tau: "0.5 ms",
      stokes: "200 nm",
      qollanilish: "Suvda eruvchan, bioimaging",
      antenna: "dpa (3 ta)",
      izoh: "Anion kompleks — suvda yaxshi eriydi. Bioimaging uchun ideal, past toksiklik.",
      href: "/ilmiy/tahlil/fluoressensiya/birikmalar/eu-dpa3",
      rang: "rose",
      peaks: [
        { lambda: 590, intensity: 0.3, assign: "⁵D₀→⁷F₁" },
        { lambda: 615, intensity: 1.0, assign: "⁵D₀→⁷F₂" },
        { lambda: 650, intensity: 0.2, assign: "⁵D₀→⁷F₃" },
        { lambda: 695, intensity: 0.1, assign: "⁵D₀→⁷F₄" }
      ]
    },
    {
      id: "tb-dpa3",
      formula: "[Tb(dpa)₃]³⁻",
      iupac: "Tris(2,2'-dipirinilamin)terbiy(III)",
      metal: "Tb³⁺",
      guruh: "lantanid",
      emissiya: "545 nm",
      emissiyaColor: "#10b981",
      emissiyaRang: "Yashil",
      transition: "⁵D₄ → ⁷F₅",
      phi: "0.45",
      tau: "0.9 ms",
      stokes: "180 nm",
      qollanilish: "Vaqt-ajraladigan tahlil",
      antenna: "dpa (3 ta)",
      izoh: "Suvda eruvchan Tb kompleksi. Vaqt-ajraladigan fluoressensiya tahlili (TRF) uchun ishlatiladi.",
      href: "/ilmiy/tahlil/fluoressensiya/birikmalar/tb-dpa3",
      rang: "teal",
      peaks: [
        { lambda: 490, intensity: 0.3, assign: "⁵D₄→⁷F₆" },
        { lambda: 545, intensity: 1.0, assign: "⁵D₄→⁷F₅" },
        { lambda: 585, intensity: 0.4, assign: "⁵D₄→⁷F₄" },
        { lambda: 620, intensity: 0.2, assign: "⁵D₄→⁷F₃" }
      ]
    },

    // ═══════════════════════════════════════════════════════════
    // B. O'TISH METALLARI (4 ta) — MLCT, fosforessensiya
    // ═══════════════════════════════════════════════════════════
    {
      id: "ru-bpy3",
      formula: "[Ru(bpy)₃]²⁺",
      iupac: "Tris(2,2'-bipiridin)ruteniy(II)",
      metal: "Ru²⁺",
      guruh: "metal",
      emissiya: "620 nm",
      emissiyaColor: "#f97316",
      emissiyaRang: "To'q sariq",
      transition: "³MLCT → ¹GS",
      phi: "0.04",
      tau: "600 ns",
      stokes: "170 nm",
      qollanilish: "Fotokataliz, sensorlar",
      antenna: "Yo'q (MLCT)",
      izoh: "Eng klassik lyuminestsent kompleks. Fotokataliz va sensorlar uchun standart. MLCT o'tish orqali nurlanadi.",
      href: "/ilmiy/tahlil/fluoressensiya/birikmalar/ru-bpy3",
      rang: "orange",
      peaks: [
        { lambda: 580, intensity: 0.5, assign: "³MLCT" },
        { lambda: 620, intensity: 1.0, assign: "³MLCT" },
        { lambda: 660, intensity: 0.7, assign: "³MLCT" },
        { lambda: 700, intensity: 0.3, assign: "³MLCT" }
      ]
    },
    {
      id: "ir-ppy3",
      formula: "[Ir(ppy)₃]",
      iupac: "Tris(2-fenilpiridin)iridiy(III)",
      metal: "Ir³⁺",
      guruh: "metal",
      emissiya: "515 nm",
      emissiyaColor: "#84cc16",
      emissiyaRang: "Yashil",
      transition: "³MLCT/³LC",
      phi: "0.40",
      tau: "2 μs",
      stokes: "100 nm",
      qollanilish: "OLED (yashil)",
      antenna: "Yo'q (og'ir atom)",
      izoh: "OLED da eng ko'p qo'llaniladigan kompleks. Og'ir atom effekti tufayli yuqori Φ va triplet nurlanish.",
      href: "/ilmiy/tahlil/fluoressensiya/birikmalar/ir-ppy3",
      rang: "lime",
      peaks: [
        { lambda: 480, intensity: 0.5, assign: "³MLCT/³LC" },
        { lambda: 515, intensity: 1.0, assign: "³MLCT/³LC" },
        { lambda: 550, intensity: 0.6, assign: "³MLCT/³LC" }
      ]
    },
    {
      id: "re-bpy-co3-cl",
      formula: "[Re(bpy)(CO)₃Cl]",
      iupac: "Karbonilxloro(2,2'-bipiridin)reniy(I)",
      metal: "Re⁺",
      guruh: "metal",
      emissiya: "550 nm",
      emissiyaColor: "#eab308",
      emissiyaRang: "Sariq-yashil",
      transition: "³MLCT/³IL",
      phi: "0.04",
      tau: "50 ns",
      stokes: "150 nm",
      qollanilish: "CO₂ qaytarish, sensorlar",
      antenna: "Yo'q (MLCT+IL)",
      izoh: "Ikki xil o'tish — MLCT va intraligand. CO₂ ni fotokatalitik qaytarishda qo'llaniladi.",
      href: "/ilmiy/tahlil/fluoressensiya/birikmalar/re-bpy-co3-cl",
      rang: "yellow",
      peaks: [
        { lambda: 520, intensity: 0.6, assign: "³IL" },
        { lambda: 550, intensity: 1.0, assign: "³MLCT" },
        { lambda: 590, intensity: 0.5, assign: "³MLCT" }
      ]
    },
    {
      id: "ptoep",
      formula: "[PtOEP]",
      iupac: "Platina(II) oktaetilporfirin",
      metal: "Pt²⁺",
      guruh: "metal",
      emissiya: "650 nm",
      emissiyaColor: "#dc2626",
      emissiyaRang: "Qizil",
      transition: "³π-π* (porfirin)",
      phi: "0.50",
      tau: "50 μs",
      stokes: "50 nm",
      qollanilish: "Kislorod sensori, fosforessensiya standarti",
      antenna: "Yo'q (porfirin)",
      izoh: "Fosforessensiya standarti. τ ≈ 50 μs — juda uzoq yashash vaqti. Kislorod bilan o'chadi (kvenching).",
      href: "/ilmiy/tahlil/fluoressensiya/birikmalar/ptoep",
      rang: "red",
      peaks: [
        { lambda: 640, intensity: 0.8, assign: "³π-π*" },
        { lambda: 650, intensity: 1.0, assign: "³π-π*" },
        { lambda: 695, intensity: 0.4, assign: "³π-π*" }
      ]
    },

    // ═══════════════════════════════════════════════════════════
    // C. ORGANIK/XIRAL KOMPLEKSLAR (2 ta) — Sensorlar, OLED
    // ═══════════════════════════════════════════════════════════
    {
      id: "zn-quin2",
      formula: "[Zn(quin)₂]",
      iupac: "Bis(8-hidroksixinolin)tsink(II)",
      metal: "Zn²⁺",
      guruh: "organik",
      emissiya: "470 nm",
      emissiyaColor: "#3b82f6",
      emissiyaRang: "Ko'k",
      transition: "π-π* (ligand)",
      phi: "0.35",
      tau: "5 ns",
      stokes: "80 nm",
      qollanilish: "Zn²⁺ sensor, xelat effekti",
      antenna: "Yo'q (ligand)",
      izoh: "Zn²⁺ bilan xelat hosil qiladi. Fluoressensiya 'yoqiladi' — sensor mexanizmi. Ko'k emissiya.",
      href: "/ilmiy/tahlil/fluoressensiya/birikmalar/zn-quin2",
      rang: "blue",
      peaks: [
        { lambda: 450, intensity: 0.6, assign: "π-π*" },
        { lambda: 470, intensity: 1.0, assign: "π-π*" },
        { lambda: 500, intensity: 0.4, assign: "π-π*" }
      ]
    },
    {
      id: "alq3",
      formula: "Alq₃",
      iupac: "Tris(8-hidroksixinolin)alyuminiy(III)",
      metal: "Al³⁺",
      guruh: "organik",
      emissiya: "525 nm",
      emissiyaColor: "#22c55e",
      emissiyaRang: "Yashil",
      transition: "π-π* (ligand)",
      phi: "0.32",
      tau: "15 ns",
      stokes: "90 nm",
      qollanilish: "OLED (birinchi)",
      antenna: "Yo'q (ligand)",
      izoh: "1987 yilda birinchi OLED da ishlatilgan. Yashil emissiya — elektron tashuvchi qatlam. Tarixiy ahamiyat.",
      href: "/ilmiy/tahlil/fluoressensiya/birikmalar/alq3",
      rang: "green",
      peaks: [
        { lambda: 500, intensity: 0.7, assign: "π-π*" },
        { lambda: 525, intensity: 1.0, assign: "π-π*" },
        { lambda: 560, intensity: 0.5, assign: "π-π*" }
      ]
    },

    // ═══════════════════════════════════════════════════════════
    // D. BIOLOGIK QO'LLANILISH (2 ta) — Bioimaging, DNA sensor
    // ═══════════════════════════════════════════════════════════
    {
      id: "ru-dppz2-bpy",
      formula: "[Ru(dppz)₂(bpy)]²⁺",
      iupac: "Bis(dipirido[3,2-a:2',3'-c]fenazin)(2,2'-bipiridin)ruteniy(II)",
      metal: "Ru²⁺",
      guruh: "biologik",
      emissiya: "620 nm",
      emissiyaColor: "#f97316",
      emissiyaRang: "To'q sariq",
      transition: "³MLCT",
      phi: "0.001 (suv) / 0.1 (DNK)",
      tau: "200 ns",
      stokes: "170 nm",
      qollanilish: "DNA light switch",
      antenna: "Yo'q (MLCT)",
      izoh: "'DNA light switch' — suvda fluoressensiya yo'q, DNK bilan bog'langanda kuchli nurlanadi. DNK borligini ko'rsatadi.",
      href: "/ilmiy/tahlil/fluoressensiya/birikmalar/ru-dppz2-bpy",
      rang: "amber",
      peaks: [
        { lambda: 590, intensity: 0.5, assign: "³MLCT" },
        { lambda: 620, intensity: 1.0, assign: "³MLCT" },
        { lambda: 660, intensity: 0.6, assign: "³MLCT" }
      ]
    },
    {
      id: "nayf4-eu-tb",
      formula: "NaYF₄:Eu,Tb",
      iupac: "Evropiy-terbiy bilan doplangan natriy ittriy ftorid nanopartikullari",
      metal: "Eu³⁺/Tb³⁺",
      guruh: "biologik",
      emissiya: "Ko'k + yashil + qizil",
      emissiyaColor: "#a855f7",
      emissiyaRang: "Ko'p rangli",
      transition: "f-f (Eu, Tb)",
      phi: "0.50",
      tau: "1 ms",
      stokes: "300 nm",
      qollanilish: "Bioimaging, multiplex tahlil",
      antenna: "Nanopartikula matritsasi",
      izoh: "Lantanid nanopartikullar — ko'p rangli emissiya. Past toksiklik, yuqori barqarorlik. Bioimaging uchun ideal.",
      href: "/ilmiy/tahlil/fluoressensiya/birikmalar/nayf4-eu-tb",
      rang: "purple",
      peaks: [
        { lambda: 470, intensity: 0.3, assign: "Tb³⁺" },
        { lambda: 545, intensity: 0.7, assign: "Tb³⁺" },
        { lambda: 615, intensity: 1.0, assign: "Eu³⁺" },
        { lambda: 695, intensity: 0.4, assign: "Eu³⁺" }
      ]
    },
  ]

  // Filter va qidiruv
  const filtered = useMemo(() => {
    let results = birikmalar

    if (filter !== "hammasi") {
      results = results.filter(b => b.guruh === filter)
    }

    if (qidiruv.trim()) {
      const q = qidiruv.toLowerCase()
      results = results.filter(b => {
        const formulaClean = b.formula
          .replace(/[₀₁₂₃₄₅₆₇₈₉]/g, m => '₀₁₂₃₄₅₆₇₈₉'.indexOf(m))
          .replace(/[\[\]\(\)\s]/g, '')
          .toLowerCase()
        
        return (
          b.formula.toLowerCase().includes(q) ||
          formulaClean.includes(q) ||
          b.iupac.toLowerCase().includes(q) ||
          b.metal.toLowerCase().includes(q) ||
          b.emissiyaRang.toLowerCase().includes(q) ||
          b.qollanilish.toLowerCase().includes(q)
        )
      })
    }

    return results
  }, [qidiruv, filter])

  // Statistikalar
  const lantanidCount = birikmalar.filter(b => b.guruh === "lantanid").length
  const metalCount = birikmalar.filter(b => b.guruh === "metal").length
  const organikCount = birikmalar.filter(b => b.guruh === "organik").length
  const biologikCount = birikmalar.filter(b => b.guruh === "biologik").length

  // Ranglar xaritasi
  const rangMap = {
    red: "border-red-500/50 hover:border-red-400",
    emerald: "border-emerald-500/50 hover:border-emerald-400",
    rose: "border-rose-500/50 hover:border-rose-400",
    teal: "border-teal-500/50 hover:border-teal-400",
    orange: "border-orange-500/50 hover:border-orange-400",
    lime: "border-lime-500/50 hover:border-lime-400",
    yellow: "border-yellow-500/50 hover:border-yellow-400",
    blue: "border-blue-500/50 hover:border-blue-400",
    green: "border-green-500/50 hover:border-green-400",
    amber: "border-amber-500/50 hover:border-amber-400",
    purple: "border-purple-500/50 hover:border-purple-400",
  }

  const textColorMap = {
    red: "text-red-400",
    emerald: "text-emerald-400",
    rose: "text-rose-400",
    teal: "text-teal-400",
    orange: "text-orange-400",
    lime: "text-lime-400",
    yellow: "text-yellow-400",
    blue: "text-blue-400",
    green: "text-green-400",
    amber: "text-amber-400",
    purple: "text-purple-400",
  }

  // Tanlangan birikma spektri
  const selectedBirData = selectedBir ? birikmalar.find(b => b.id === selectedBir) : birikmalar[0]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil/fluoressensiya" className="text-purple-400 hover:text-purple-300 text-lg">← Fluoressensiya spektroskopiya</Link>
        <div>
          <h1 className="text-2xl font-bold text-amber-400">💡 Birikmalarning fluoressensiya tahlili</h1>
          <p className="text-purple-400 text-sm">Emission spektr • Kvant unumi • Yashash vaqti • Antenna effekti</p>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        
        {/* STATISTIKA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div className="bg-purple-800/30 rounded-xl p-4">
              <div className="text-3xl font-extrabold text-amber-400">{birikmalar.length}</div>
              <div className="text-purple-400 text-xs">jami birikma</div>
            </div>
            <div className="bg-red-600/20 border border-red-600/30 rounded-xl p-4">
              <div className="text-3xl font-extrabold text-red-400">{lantanidCount}</div>
              <div className="text-purple-400 text-xs">Lantanid (Eu, Tb)</div>
            </div>
            <div className="bg-orange-600/20 border border-orange-600/30 rounded-xl p-4">
              <div className="text-3xl font-extrabold text-orange-400">{metalCount}</div>
              <div className="text-purple-400 text-xs">O'tish metallari</div>
            </div>
            <div className="bg-green-600/20 border border-green-600/30 rounded-xl p-4">
              <div className="text-3xl font-extrabold text-green-400">{organikCount}</div>
              <div className="text-purple-400 text-xs">Organik (Zn, Al)</div>
            </div>
            <div className="bg-purple-600/20 border border-purple-600/30 rounded-xl p-4">
              <div className="text-3xl font-extrabold text-purple-400">{biologikCount}</div>
              <div className="text-purple-400 text-xs">Biologik</div>
            </div>
          </div>
        </div>

        {/* INTERAKTIV EMISSION SPEKTR */}
        <div className="bg-gradient-to-br from-amber-900/30 to-purple-900/30 border border-amber-500/30 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">💡 Interaktiv emission spektr — barcha 12 ta birikma</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {birikmalar.map((b) => (
              <button key={b.id} onClick={() => setSelectedBir(b.id)}
                className={`px-2 py-2 rounded-lg text-[10px] font-bold transition-all ${
                  selectedBir === b.id 
                    ? "bg-amber-600/80 text-white shadow-lg" 
                    : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
                }`}>
                <div className="text-xs">{b.formula}</div>
                <div className="text-[9px] opacity-70 mt-1">{b.emissiyaRang}</div>
              </button>
            ))}
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <svg viewBox="0 0 400 250" className="w-full h-60">
              <line x1="40" y1="220" x2="380" y2="220" stroke="#4c1d95" strokeWidth="1" />
              <line x1="40" y1="20" x2="40" y2="220" stroke="#4c1d95" strokeWidth="1" />
              
              <text x="210" y="245" fill="#c4b5fd" fontSize="9" textAnchor="middle">λ (nm)</text>
              <text x="40" y="240" fill="#a78bfa" fontSize="8">400</text>
              <text x="380" y="240" fill="#a78bfa" fontSize="8" textAnchor="end">800</text>
              <text x="20" y="120" fill="#a78bfa" fontSize="8" textAnchor="middle" transform="rotate(-90, 20, 120)">
                Intensivlik
              </text>

              {/* Spektr */}
              {(() => {
                const spectrum = []
                for (let i = 0; i < 400; i++) {
                  const lambda = 400 + i * 1.0
                  let emission = 0
                  selectedBirData.peaks.forEach(peak => {
                    const x = (lambda - peak.lambda) / 10
                    emission += peak.intensity * Math.exp(-0.5 * x * x)
                  })
                  spectrum.push({ lambda, emission })
                }
                const maxE = Math.max(...spectrum.map(p => p.emission), 0.1)

                return (
                  <>
                    <polyline
                      points={spectrum.map((p, i) => {
                        const x = 40 + (i / 400) * 340
                        const y = 220 - (p.emission / maxE) * 190
                        return `${x},${y}`
                      }).join(' ')}
                      fill="none" stroke={selectedBirData.emissiyaColor} strokeWidth="2"
                    />
                    {selectedBirData.peaks.map((peak, idx) => (
                      <g key={idx}>
                        <line x1={40 + ((peak.lambda - 400) / 400) * 340} y1="20" 
                          x2={40 + ((peak.lambda - 400) / 400) * 340} y2="220"
                          stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="2,2" />
                        <text x={40 + ((peak.lambda - 400) / 400) * 340} y="15" 
                          fill="#fbbf24" fontSize="7" textAnchor="middle">
                          {peak.lambda} nm
                        </text>
                      </g>
                    ))}
                  </>
                )
              })()}

              <text x="200" y="30" fill={selectedBirData.emissiyaColor} fontSize="10" textAnchor="middle" fontWeight="bold">
                {selectedBirData.formula} — {selectedBirData.emissiyaRang} emissiya
              </text>
            </svg>
          </div>

          <div className="grid grid-cols-4 gap-3 text-xs text-center mt-4">
            <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-3">
              <p className="text-amber-400">λ<sub>em</sub></p>
              <p className="text-emerald-400 font-bold">{selectedBirData.emissiya}</p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-3">
              <p className="text-purple-400">Φ</p>
              <p className="text-amber-400 font-bold">{selectedBirData.phi}</p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-3">
              <p className="text-purple-400">τ</p>
              <p className="text-amber-400 font-bold">{selectedBirData.tau}</p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-3">
              <p className="text-purple-400">Stokes</p>
              <p className="text-amber-400 font-bold">{selectedBirData.stokes}</p>
            </div>
          </div>
        </div>

        {/* QIDIRUV VA FILTER */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 space-y-4">
          <div className="relative">
            <input 
              type="text"
              value={qidiruv}
              onChange={(e) => setQidiruv(e.target.value)}
              placeholder="Masalan: Eu³⁺, Ru²⁺, qizil, OLED, bioimaging..."
              className="w-full px-6 py-4 pl-14 rounded-xl bg-purple-800/50 border border-purple-600 text-white placeholder-purple-500 focus:outline-none focus:border-amber-400 transition-all"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
            {qidiruv && (
              <button onClick={() => setQidiruv("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white text-xl">✕</button>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            {[
              { id: "hammasi", label: "Hammasi", count: birikmalar.length, icon: "🎯" },
              { id: "lantanid", label: "Lantanid (Eu, Tb)", count: lantanidCount, icon: "🔴" },
              { id: "metal", label: "O'tish metallari", count: metalCount, icon: "🟠" },
              { id: "organik", label: "Organik (Zn, Al)", count: organikCount, icon: "🟢" },
              { id: "biologik", label: "Biologik", count: biologikCount, icon: "🟣" },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  filter === f.id
                    ? "bg-amber-600/80 text-white shadow-lg"
                    : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
                }`}
              >
                {f.icon} {f.label} <span className="opacity-70">({f.count})</span>
              </button>
            ))}
          </div>

          {qidiruv && (
            <p className="text-purple-300 text-sm">
              <span className="text-white font-bold">{filtered.length}</span> ta birikma topildi
            </p>
          )}
        </div>

        {/* BIRIKMALAR GRID */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-purple-900/20 border border-purple-700/30 rounded-2xl">
            <div className="text-7xl mb-4">😔</div>
            <h3 className="text-xl font-bold text-white mb-2">Birikma topilmadi</h3>
            <p className="text-purple-300">Qidiruv so'zini yoki filtrni o'zgartirib ko'ring</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((b) => (
              <Link key={b.id} href={b.href} 
                className={`group bg-purple-900/40 border-2 ${rangMap[b.rang]} rounded-2xl p-6 hover:bg-purple-800/60 transition-all transform hover:-translate-y-1`}>
                
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold font-mono ${textColorMap[b.rang]} group-hover:brightness-125 transition-all`}>
                      {b.formula}
                    </h3>
                    <p className="text-white font-semibold text-sm mt-1">{b.iupac}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-white/20" style={{backgroundColor: b.emissiyaColor}}></div>
                </div>

                {/* Metal va guruh */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-purple-800/50 border border-purple-600/30 px-2 py-0.5 rounded-full text-xs text-purple-300">
                    {b.metal}
                  </span>
                  <span className="bg-amber-800/50 border border-amber-600/30 px-2 py-0.5 rounded-full text-xs text-amber-300">
                    {b.emissiyaRang}
                  </span>
                  <span className="bg-purple-800/50 border border-purple-600/30 px-2 py-0.5 rounded-full text-xs text-purple-300">
                    {b.transition}
                  </span>
                </div>

                {/* Parametrlar */}
                <div className="mt-4 pt-4 border-t border-purple-700/30 space-y-2">
                  <div className="grid grid-cols-3 gap-2 text-xs text-center">
                    <div className="bg-amber-900/30 border border-amber-500/30 rounded p-2">
                      <p className="text-amber-400 text-[10px]">λ<sub>em</sub></p>
                      <p className="text-white font-mono font-bold">{b.emissiya}</p>
                    </div>
                    <div className="bg-purple-900/50 rounded p-2">
                      <p className="text-purple-400 text-[10px]">Φ</p>
                      <p className="text-amber-400 font-mono font-bold">{b.phi}</p>
                    </div>
                    <div className="bg-purple-900/50 rounded p-2">
                      <p className="text-purple-400 text-[10px]">τ</p>
                      <p className="text-amber-400 font-mono font-bold text-[10px]">{b.tau}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-purple-400">Qo'llanilish:</span>
                    <span className="text-amber-400 text-[10px]">{b.qollanilish}</span>
                  </div>
                  
                  <p className="text-purple-300 text-[10px] italic">{b.izoh}</p>
                  
                  <div className="mt-2 pt-2 border-t border-purple-700/30">
                    <span className="text-[10px] text-purple-400">→ Batafsil fluoressensiya tahlili</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* YASHASH VAQTI SOLISHTIRISH */}
        <div className="bg-gradient-to-br from-amber-900/30 to-purple-900/30 border border-amber-500/30 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">⏱️ Yashash vaqti (τ) — logarifmik shkala</h2>
          
          <div className="bg-purple-950/50 rounded-lg p-4">
            <svg viewBox="0 0 400 200" className="w-full h-48">
              <line x1="40" y1="180" x2="380" y2="180" stroke="#4c1d95" strokeWidth="1" />
              <line x1="40" y1="20" x2="40" y2="180" stroke="#4c1d95" strokeWidth="1" />
              
              <text x="210" y="195" fill="#c4b5fd" fontSize="9" textAnchor="middle">Yashash vaqti (τ)</text>
              <text x="20" y="100" fill="#a78bfa" fontSize="8" textAnchor="middle" transform="rotate(-90, 20, 100)">
                Birikma
              </text>

              {/* Logarifmik shkala */}
              <text x="80" y="195" fill="#a78bfa" fontSize="7" textAnchor="middle">1 ns</text>
              <text x="180" y="195" fill="#a78bfa" fontSize="7" textAnchor="middle">1 μs</text>
              <text x="280" y="195" fill="#a78bfa" fontSize="7" textAnchor="middle">1 ms</text>

              {/* Birikmalar */}
              {[
                { name: "Zn(quin)₂", tau: 5, unit: "ns", color: "#3b82f6" },
                { name: "Alq₃", tau: 15, unit: "ns", color: "#22c55e" },
                { name: "Re(bpy)(CO)₃Cl", tau: 50, unit: "ns", color: "#eab308" },
                { name: "Ru(bpy)₃²⁺", tau: 600, unit: "ns", color: "#f97316" },
                { name: "Ru(dppz)₂bpy²⁺", tau: 200, unit: "ns", color: "#f97316" },
                { name: "Ir(ppy)₃", tau: 2000, unit: "ns", color: "#84cc16" },
                { name: "PtOEP", tau: 50000, unit: "ns", color: "#dc2626" },
                { name: "Eu(tta)₃phen", tau: 800000, unit: "ns", color: "#ef4444" },
                { name: "Tb(acac)₃phen", tau: 1200000, unit: "ns", color: "#10b981" },
              ].map((b, i) => {
                const logTau = Math.log10(b.tau)
                const x = 40 + ((logTau - 0) / 7) * 340
                const y = 30 + i * 16
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="4" fill={b.color} />
                    <text x={x + 8} y={y + 3} fill={b.color} fontSize="7">{b.name}</text>
                  </g>
                )
              })}
            </svg>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs text-center mt-4">
            <div className="bg-blue-900/20 border border-blue-500/30 rounded p-3">
              <p className="text-blue-400 font-bold">ns</p>
              <p className="text-purple-300 text-[10px]">Fluoressensiya</p>
              <p className="text-purple-400 text-[10px]">Zn²⁺, Al³⁺</p>
            </div>
            <div className="bg-orange-900/20 border border-orange-500/30 rounded p-3">
              <p className="text-orange-400 font-bold">μs</p>
              <p className="text-purple-300 text-[10px]">Fosforessensiya</p>
              <p className="text-purple-400 text-[10px]">Ru²⁺, Ir³⁺</p>
            </div>
            <div className="bg-red-900/20 border border-red-500/30 rounded p-3">
              <p className="text-red-400 font-bold">ms</p>
              <p className="text-purple-300 text-[10px]">Lantanid fosfor.</p>
              <p className="text-purple-400 text-[10px]">Eu³⁺, Tb³⁺</p>
            </div>
          </div>
        </div>

        {/* TO'LIQ SOLISHTIRISH JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">📋 To'liq solishtirish jadvali</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-purple-700/50">
                  <th className="text-left py-3 px-2 text-yellow-400">Birikma</th>
                  <th className="text-center py-3 px-2 text-yellow-400">Metal</th>
                  <th className="text-center py-3 px-2 text-yellow-400">λ<sub>em</sub></th>
                  <th className="text-center py-3 px-2 text-yellow-400">Φ</th>
                  <th className="text-center py-3 px-2 text-yellow-400">τ</th>
                  <th className="text-left py-3 px-2 text-yellow-400">Qo'llanilish</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {birikmalar.map((b, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className={`py-2 px-2 font-bold ${textColorMap[b.rang]}`}>{b.formula}</td>
                    <td className="py-2 px-2 text-center">{b.metal}</td>
                    <td className="py-2 px-2 text-center font-mono">{b.emissiya}</td>
                    <td className="py-2 px-2 text-center font-mono text-amber-400">{b.phi}</td>
                    <td className="py-2 px-2 text-center font-mono text-amber-400">{b.tau}</td>
                    <td className="py-2 px-2 text-[10px]">{b.qollanilish}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PARAMETRLARNI TALQIN QILISH */}
        <div className="bg-gradient-to-br from-amber-900/30 to-purple-900/30 border border-amber-500/30 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">📐 Parametrlarni talqin qilish</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5">
              <h3 className="text-amber-400 font-bold mb-2">Φ (Kvant unumi)</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>✓ <strong>&gt; 0.5</strong> — yuqori samarador</li>
                <li>✓ <strong>0.1-0.5</strong> — o'rtacha</li>
                <li>✓ <strong>&lt; 0.1</strong> — past samarador</li>
                <li>✓ Φ = k<sub>r</sub>/(k<sub>r</sub>+k<sub>nr</sub>)</li>
              </ul>
            </div>

            <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5">
              <h3 className="text-amber-400 font-bold mb-2">τ (Yashash vaqti)</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>✓ <strong>ns</strong> — fluoressensiya (Zn, Al)</li>
                <li>✓ <strong>μs</strong> — fosforessensiya (Ru, Ir)</li>
                <li>✓ <strong>ms</strong> — lantanid (Eu, Tb)</li>
                <li>✓ Katta τ → vaqt-ajraladigan tahlil</li>
              </ul>
            </div>

            <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5">
              <h3 className="text-amber-400 font-bold mb-2">Stokes siljishi</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>✓ <strong>&gt; 100 nm</strong> — katta (lantanid)</li>
                <li>✓ <strong>50-100 nm</strong> — o'rtacha</li>
                <li>✓ <strong>&lt; 50 nm</strong> — kichik (organik)</li>
                <li>✓ Katta → o'z-o'zini yutish kam</li>
              </ul>
            </div>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-amber-600/10 to-purple-600/10 border border-amber-500/20 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>12 ta birikma — <strong className="text-amber-400">fluoressensiya spektroskopiyasining barcha jihatlarini</strong> qamrab oladi</li>
            <li><strong>4 ta lantanid</strong> (Eu, Tb) — antenna effekti, tor chiziqli spektr, katta τ</li>
            <li><strong>4 ta o'tish metallari</strong> (Ru, Ir, Re, Pt) — MLCT, fosforessensiya, og'ir atom effekti</li>
            <li><strong>2 ta organik</strong> (Zn, Al) — sensorlar, OLED</li>
            <li><strong>2 ta biologik</strong> — bioimaging, DNK sensor</li>
            <li>Yashash vaqti <strong>ns → μs → ms</strong> — 6 daraja farq</li>
            <li>Kvant unumi <strong>0.001 → 0.75</strong> — 750 marta farq</li>
            <li>Antenna effekti — <strong>lantanidlar uchun muhim</strong>, o'tish metallari uchun emas</li>
            <li>Stokes siljishi — <strong>lantanidlarda katta</strong>, organiklarda kichik</li>
            <li>Qo'llanilish: OLED, bioimaging, sensorlar, fotokataliz</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/fluoressensiya" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← Fluoressensiya spektroskopiya
          </Link>
          <Link href="/ilmiy/tahlil/fluoressensiya/birikmalar/eu-tta3-phen" className="px-6 py-3 bg-amber-600/80 rounded-xl hover:bg-amber-500 text-white font-semibold">
            [Eu(tta)₃(phen)] →
          </Link>
        </div>

      </section>
    </main>
  )
}