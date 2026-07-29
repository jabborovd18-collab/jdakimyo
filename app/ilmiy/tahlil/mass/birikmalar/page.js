"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// MASS-SPEKTROMETRIYA — BIRIKMALAR KATALOGI (PREMIUM SCIENTIFIC)
// 12 ta kompleks birikma — har biri uchun molekulyar massa, asosiy ion, izotopik
// namuna va metall markaz ma'lumotlari.
// Manbalar:
//   • J. H. Gross — Mass Spectrometry: A Textbook (3rd ed., Springer, 2017)
//   • W. Henderson, J. S. McIndoe — Mass Spectrometry of Inorganic and
//     Organometallic Compounds (Wiley, 2005)
//   • NIST 2021 — Atomic Weights and Isotopic Compositions
// ═══════════════════════════════════════════════════════════════════════════════

const birikmalar = [
  {
    id: "k3-fe-cn6",
    formula: "K₃[Fe(CN)₆]",
    iupac: "kaliy geksasiyanoferrat(III)",
    tarixiy: "Qizil qon tuzi",
    massa: "329.24 g/mol",
    massaNum: 329.24,
    asosiyIon: "[M]⁻ = 329",
    zaryad: "anion",
    metall: "Fe³⁺",
    metallSimbol: "Fe",
    xususiyat: "Fe izotoplari + C izotoplari",
    izotoplar: ["⁵⁴Fe", "⁵⁶Fe", "⁵⁷Fe"],
    klaster: [6.4, 100, 2.3, 0.3],
    href: "/ilmiy/tahlil/mass/birikmalar/k3-fe-cn6"
  },
  {
    id: "k4-fe-cn6",
    formula: "K₄[Fe(CN)₆]",
    iupac: "kaliy geksasiyanoferrat(II)",
    tarixiy: "Sariq qon tuzi",
    massa: "368.35 g/mol",
    massaNum: 368.35,
    asosiyIon: "[M]⁻ = 368",
    zaryad: "anion",
    metall: "Fe²⁺",
    metallSimbol: "Fe",
    xususiyat: "Fe izotoplari — ⁵⁴Fe, ⁵⁶Fe, ⁵⁷Fe",
    izotoplar: ["⁵⁴Fe", "⁵⁶Fe", "⁵⁷Fe"],
    klaster: [6.4, 100, 2.3, 0.3],
    href: "/ilmiy/tahlil/mass/birikmalar/k4-fe-cn6"
  },
  {
    id: "co-nh3-6-cl3",
    formula: "[Co(NH₃)₆]Cl₃",
    iupac: "geksaamminkobalt(III) xlorid",
    tarixiy: "Verner klassikasi",
    massa: "267.48 g/mol",
    massaNum: 267.48,
    asosiyIon: "[M]³⁺ = 53.7 (z=3)",
    zaryad: "kation",
    metall: "Co³⁺",
    metallSimbol: "Co",
    xususiyat: "⁵⁹Co — yagona izotop, Cl⁻ izotoplari",
    izotoplar: ["⁵⁹Co", "³⁵Cl", "³⁷Cl"],
    klaster: [100, 0, 32, 0],
    href: "/ilmiy/tahlil/mass/birikmalar/co-nh3-6-cl3"
  },
  {
    id: "sisplatin",
    formula: "sis-[PtCl₂(NH₃)₂]",
    iupac: "sis-diammindixloroplatina(II)",
    tarixiy: "SISPLATIN",
    massa: "300.05 g/mol",
    massaNum: 300.05,
    asosiyIon: "[M]⁺ = 300",
    zaryad: "neytral",
    metall: "Pt²⁺",
    metallSimbol: "Pt",
    xususiyat: "¹⁹⁵Pt + ³⁵Cl/³⁷Cl — murakkab izotop namunasi",
    izotoplar: ["¹⁹⁴Pt", "¹⁹⁵Pt", "¹⁹⁶Pt", "¹⁹⁸Pt"],
    klaster: [97, 100, 75, 22],
    href: "/ilmiy/tahlil/mass/birikmalar/sisplatin"
  },
  {
    id: "ferrosen",
    formula: "[Fe(C₅H₅)₂]",
    iupac: "bis(siklopentadienil)temir(II)",
    tarixiy: "Ferrosen",
    massa: "186.04 g/mol",
    massaNum: 186.04,
    asosiyIon: "[M]⁺ = 186",
    zaryad: "neytral",
    metall: "Fe²⁺",
    metallSimbol: "Fe",
    xususiyat: "M⁺ = 186 (100%), Fe izotoplari",
    izotoplar: ["⁵⁴Fe", "⁵⁶Fe", "⁵⁷Fe"],
    klaster: [6.4, 100, 2.3, 0.3],
    href: "/ilmiy/tahlil/mass/birikmalar/ferrosen"
  },
  {
    id: "ni-cn4",
    formula: "[Ni(CN)₄]²⁻",
    iupac: "tetrasiyanonikkolat(II) ioni",
    tarixiy: "",
    massa: "162.78 g/mol",
    massaNum: 162.78,
    asosiyIon: "[M]⁻ = 163",
    zaryad: "anion",
    metall: "Ni²⁺",
    metallSimbol: "Ni",
    xususiyat: "⁵⁸Ni (68%), ⁶⁰Ni (26%) — ikkita asosiy izotop",
    izotoplar: ["⁵⁸Ni", "⁶⁰Ni", "⁶²Ni"],
    klaster: [100, 38, 5.3, 0],
    href: "/ilmiy/tahlil/mass/birikmalar/ni-cn4"
  },
  {
    id: "cu-h2o6",
    formula: "[Cu(H₂O)₆]²⁺",
    iupac: "geksaakvamis(II) ioni",
    tarixiy: "",
    massa: "171.66 g/mol",
    massaNum: 171.66,
    asosiyIon: "[M]²⁺ = 86 (z=2)",
    zaryad: "kation",
    metall: "Cu²⁺",
    metallSimbol: "Cu",
    xususiyat: "⁶³Cu/⁶⁵Cu — xarakterli 2:1 nisbat",
    izotoplar: ["⁶³Cu", "⁶⁵Cu"],
    klaster: [100, 0, 45, 0],
    href: "/ilmiy/tahlil/mass/birikmalar/cu-h2o6"
  },
  {
    id: "ag-nh3-2",
    formula: "[Ag(NH₃)₂]⁺",
    iupac: "diamminkumush(I) ioni",
    tarixiy: "Tollens reaktivi",
    massa: "141.94 g/mol",
    massaNum: 141.94,
    asosiyIon: "[M]⁺ = 142",
    zaryad: "kation",
    metall: "Ag⁺",
    metallSimbol: "Ag",
    xususiyat: "¹⁰⁷Ag/¹⁰⁹Ag — klassik ikkita teng pik!",
    izotoplar: ["¹⁰⁷Ag", "¹⁰⁹Ag"],
    klaster: [100, 0, 93, 0],
    href: "/ilmiy/tahlil/mass/birikmalar/ag-nh3-2"
  },
  {
    id: "co-cl4",
    formula: "[CoCl₄]²⁻",
    iupac: "tetraxlorokobaltat(II) ioni",
    tarixiy: "",
    massa: "200.75 g/mol",
    massaNum: 200.75,
    asosiyIon: "[M]⁻ = 201",
    zaryad: "anion",
    metall: "Co²⁺",
    metallSimbol: "Co",
    xususiyat: "⁵⁹Co + ³⁵Cl/³⁷Cl — Cl izotop namunasi",
    izotoplar: ["⁵⁹Co", "³⁵Cl", "³⁷Cl"],
    klaster: [100, 0, 128, 0, 63, 0, 14],
    href: "/ilmiy/tahlil/mass/birikmalar/co-cl4"
  },
  {
    id: "fe-co5",
    formula: "[Fe(CO)₅]",
    iupac: "pentakarboniltemir(0)",
    tarixiy: "",
    massa: "195.90 g/mol",
    massaNum: 195.90,
    asosiyIon: "[M]⁺ = 196",
    zaryad: "neytral",
    metall: "Fe⁰",
    metallSimbol: "Fe",
    xususiyat: "Ketma-ket CO yo'qolishi — 5 ta fragment!",
    izotoplar: ["⁵⁴Fe", "⁵⁶Fe", "⁵⁷Fe"],
    klaster: [6.4, 100, 2.3, 0.3],
    href: "/ilmiy/tahlil/mass/birikmalar/fe-co5"
  },
  {
    id: "zn-oh4",
    formula: "[Zn(OH)₄]²⁻",
    iupac: "tetragidroksosinkat(II) ioni",
    tarixiy: "",
    massa: "133.41 g/mol",
    massaNum: 133.41,
    asosiyIon: "[M]⁻ = 133",
    zaryad: "anion",
    metall: "Zn²⁺",
    metallSimbol: "Zn",
    xususiyat: "⁶⁴Zn, ⁶⁶Zn, ⁶⁸Zn — ko'p izotopli",
    izotoplar: ["⁶⁴Zn", "⁶⁶Zn", "⁶⁷Zn", "⁶⁸Zn"],
    klaster: [100, 0, 57, 8, 38],
    href: "/ilmiy/tahlil/mass/birikmalar/zn-oh4"
  },
  {
    id: "cr-h2o6",
    formula: "[Cr(H₂O)₆]³⁺",
    iupac: "geksaakvaxrom(III) ioni",
    tarixiy: "",
    massa: "160.07 g/mol",
    massaNum: 160.07,
    asosiyIon: "[M]³⁺ = 53.4 (z=3)",
    zaryad: "kation",
    metall: "Cr³⁺",
    metallSimbol: "Cr",
    xususiyat: "⁵²Cr (83.8%) — asosiy izotop",
    izotoplar: ["⁵⁰Cr", "⁵²Cr", "⁵³Cr", "⁵⁴Cr"],
    klaster: [5.2, 0, 100, 11.3, 2.8],
    href: "/ilmiy/tahlil/mass/birikmalar/cr-h2o6"
  }
]

// Metall rang xaritasi (Periodic Table odat rangi)
const metalColors = {
  Fe: { bg: "from-orange-600/30 to-red-600/20", border: "border-orange-500/50", text: "text-orange-300", dot: "bg-orange-400" },
  Co: { bg: "from-blue-600/30 to-indigo-600/20", border: "border-blue-500/50", text: "text-blue-300", dot: "bg-blue-400" },
  Ni: { bg: "from-emerald-600/30 to-green-600/20", border: "border-emerald-500/50", text: "text-emerald-300", dot: "bg-emerald-400" },
  Cu: { bg: "from-amber-600/30 to-orange-600/20", border: "border-amber-500/50", text: "text-amber-300", dot: "bg-amber-400" },
  Zn: { bg: "from-slate-600/30 to-blue-600/20", border: "border-slate-500/50", text: "text-slate-300", dot: "bg-slate-400" },
  Ag: { bg: "from-gray-400/30 to-slate-500/20", border: "border-gray-400/50", text: "text-gray-200", dot: "bg-gray-300" },
  Pt: { bg: "from-cyan-600/30 to-teal-600/20", border: "border-cyan-500/50", text: "text-cyan-300", dot: "bg-cyan-400" },
  Cr: { bg: "from-teal-600/30 to-cyan-600/20", border: "border-teal-500/50", text: "text-teal-300", dot: "bg-teal-400" },
}

const zaryadColors = {
  kation:  { bg: "bg-pink-600/20",   text: "text-pink-300",   border: "border-pink-600/40",   label: "⊕ Kation" },
  anion:   { bg: "bg-cyan-600/20",   text: "text-cyan-300",   border: "border-cyan-600/40",   label: "⊖ Anion" },
  neytral: { bg: "bg-purple-600/20", text: "text-purple-300", border: "border-purple-600/40", label: "○ Neytral" },
}

export default function MassBirikmalar() {
  const [qidiruv, setQidiruv]         = useState("")
  const [zaryadFilter, setZaryadFilter] = useState("all")
  const [metallFilter, setMetallFilter] = useState("all")
  const [sortKey, setSortKey]         = useState("default")
  const [viewMode, setViewMode]       = useState("grid")

  // Statistika
  const stats = useMemo(() => {
    const metallar = [...new Set(birikmalar.map(b => b.metallSimbol))]
    const zaryadlar = {
      kation: birikmalar.filter(b => b.zaryad === "kation").length,
      anion: birikmalar.filter(b => b.zaryad === "anion").length,
      neytral: birikmalar.filter(b => b.zaryad === "neytral").length,
    }
    const massaOrtacha = (birikmalar.reduce((s, b) => s + b.massaNum, 0) / birikmalar.length).toFixed(2)
    const massaMax = Math.max(...birikmalar.map(b => b.massaNum))
    const massaMin = Math.min(...birikmalar.map(b => b.massaNum))
    return { metallar, zaryadlar, massaOrtacha, massaMax, massaMin, total: birikmalar.length }
  }, [])

  const unikalMetallar = useMemo(() => [...new Set(birikmalar.map(b => b.metallSimbol))], [])

  // Filtrlash + saralash
  const filtered = useMemo(() => {
    let list = [...birikmalar]

    if (qidiruv) {
      const q = qidiruv.toLowerCase()
      list = list.filter(b =>
        b.iupac.toLowerCase().includes(q) ||
        b.formula.toLowerCase().includes(q) ||
        (b.tarixiy && b.tarixiy.toLowerCase().includes(q)) ||
        b.metall.toLowerCase().includes(q) ||
        b.xususiyat.toLowerCase().includes(q)
      )
    }

    if (zaryadFilter !== "all") list = list.filter(b => b.zaryad === zaryadFilter)
    if (metallFilter !== "all") list = list.filter(b => b.metallSimbol === metallFilter)

    if (sortKey === "massa-asc")  list.sort((a, b) => a.massaNum - b.massaNum)
    if (sortKey === "massa-desc") list.sort((a, b) => b.massaNum - a.massaNum)
    if (sortKey === "nom-asc")    list.sort((a, b) => a.iupac.localeCompare(b.iupac))
    if (sortKey === "metall")     list.sort((a, b) => a.metallSimbol.localeCompare(b.metallSimbol))

    return list
  }, [qidiruv, zaryadFilter, metallFilter, sortKey])

  const resetFilters = () => {
    setQidiruv("")
    setZaryadFilter("all")
    setMetallFilter("all")
    setSortKey("default")
  }

  const hasActiveFilter = qidiruv || zaryadFilter !== "all" || metallFilter !== "all" || sortKey !== "default"

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-slate-950 to-blue-950 text-white">

      {/* ═══ HEADER ═══ */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-purple-950/80 border-b border-purple-800/50">
        <div className="max-w-7xl mx-auto flex items-center gap-4 px-6 py-4">
          <Link href="/ilmiy/tahlil/mass" className="text-purple-400 hover:text-purple-300 text-lg transition-colors flex items-center gap-1">
            <span className="text-xl">←</span> Mass-spektrometriya
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
              🔍 Birikmalarning mass-spektr tahlili
            </h1>
            <p className="text-purple-400 text-xs md:text-sm">
              Kompleks birikmalar katalogi • Izotopik cluster • Molekulyar ion • Fragmentatsiya
            </p>
          </div>
          <span className="hidden md:inline-block bg-pink-600/20 text-pink-300 border border-pink-600/40 px-3 py-1 rounded-full text-xs font-mono">
            {birikmalar.length} ta birikma
          </span>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-10 space-y-8">

        {/* ═══ STATISTIKA PANELI ═══ */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-gradient-to-br from-pink-600/20 to-purple-600/20 border border-pink-500/30 rounded-2xl p-4 hover:border-pink-400/60 transition-all">
            <p className="text-pink-300 text-xs uppercase tracking-wider">Jami birikmalar</p>
            <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
            <p className="text-purple-400 text-xs mt-1">bazada mavjud</p>
          </div>
          <div className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-2xl p-4 hover:border-cyan-400/60 transition-all">
            <p className="text-cyan-300 text-xs uppercase tracking-wider">Turli metallar</p>
            <p className="text-3xl font-bold text-white mt-1">{stats.metallar.length}</p>
            <p className="text-purple-400 text-xs mt-1">{stats.metallar.join(", ")}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-600/20 to-green-600/20 border border-emerald-500/30 rounded-2xl p-4 hover:border-emerald-400/60 transition-all">
            <p className="text-emerald-300 text-xs uppercase tracking-wider">O'rtacha massa</p>
            <p className="text-3xl font-bold text-white mt-1">{stats.massaOrtacha}</p>
            <p className="text-purple-400 text-xs mt-1">g/mol</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-2xl p-4 hover:border-yellow-400/60 transition-all">
            <p className="text-yellow-300 text-xs uppercase tracking-wider">Massa diapazoni</p>
            <p className="text-lg font-bold text-white mt-1 font-mono">{stats.massaMin.toFixed(0)} – {stats.massaMax.toFixed(0)}</p>
            <p className="text-purple-400 text-xs mt-1">g/mol</p>
          </div>
          <div className="bg-gradient-to-br from-fuchsia-600/20 to-pink-600/20 border border-fuchsia-500/30 rounded-2xl p-4 hover:border-fuchsia-400/60 transition-all">
            <p className="text-fuchsia-300 text-xs uppercase tracking-wider">Zaryad turlari</p>
            <div className="flex gap-2 mt-1 text-xs font-mono">
              <span className="text-pink-300">⊕{stats.zaryadlar.kation}</span>
              <span className="text-cyan-300">⊖{stats.zaryadlar.anion}</span>
              <span className="text-purple-300">○{stats.zaryadlar.neytral}</span>
            </div>
            <p className="text-purple-400 text-xs mt-2">kation/anion/neytral</p>
          </div>
        </div>

        {/* ═══ QIDIRUV + FILTRLAR ═══ */}
        <div className="bg-gradient-to-br from-purple-900/40 to-slate-900/40 backdrop-blur-sm border border-purple-700/50 rounded-3xl p-6 md:p-8 shadow-2xl shadow-purple-900/20">

          {/* Qidiruv maydoni */}
          <div className="relative mb-5">
            <input
              type="text"
              value={qidiruv}
              onChange={(e) => setQidiruv(e.target.value)}
              placeholder="Formula, IUPAC nom, tarixiy nom, metall yoki xususiyat bo'yicha qidirish..."
              className="w-full px-6 py-5 pl-16 pr-14 rounded-2xl bg-purple-950/60 border-2 border-purple-700/60 text-white placeholder-purple-500 focus:outline-none focus:border-pink-400 focus:shadow-lg focus:shadow-pink-500/20 transition-all text-base"
            />
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
            {qidiruv && (
              <button
                onClick={() => setQidiruv("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white transition-colors bg-purple-800/50 hover:bg-pink-600/50 w-8 h-8 rounded-full flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filtrlar qatori */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

            {/* Zaryad filtri */}
            <div>
              <label className="text-purple-400 text-xs uppercase tracking-wider mb-2 block">🔋 Zaryad turi</label>
              <div className="flex gap-1 bg-purple-950/50 border border-purple-700/40 rounded-xl p-1">
                {[
                  { v: "all", l: "Barchasi" },
                  { v: "kation", l: "⊕" },
                  { v: "anion", l: "⊖" },
                  { v: "neytral", l: "○" },
                ].map(o => (
                  <button
                    key={o.v}
                    onClick={() => setZaryadFilter(o.v)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                      zaryadFilter === o.v
                        ? "bg-pink-600 text-white shadow-md shadow-pink-500/30"
                        : "text-purple-300 hover:bg-purple-800/50"
                    }`}
                  >
                    {o.l}
                  </button>
                ))}
              </div>
            </div>

            {/* Metall filtri */}
            <div>
              <label className="text-purple-400 text-xs uppercase tracking-wider mb-2 block">⚛️ Metall markaz</label>
              <select
                value={metallFilter}
                onChange={(e) => setMetallFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-purple-950/50 border border-purple-700/40 rounded-xl text-white focus:outline-none focus:border-pink-400 transition-all text-sm cursor-pointer"
              >
                <option value="all">Barcha metallar</option>
                {unikalMetallar.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Saralash */}
            <div>
              <label className="text-purple-400 text-xs uppercase tracking-wider mb-2 block">🔃 Saralash</label>
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
                className="w-full px-4 py-2.5 bg-purple-950/50 border border-purple-700/40 rounded-xl text-white focus:outline-none focus:border-pink-400 transition-all text-sm cursor-pointer"
              >
                <option value="default">Standart tartib</option>
                <option value="massa-asc">Massa ↑ (kichikdan katta)</option>
                <option value="massa-desc">Massa ↓ (kattadan kichik)</option>
                <option value="nom-asc">IUPAC nomi (A–Z)</option>
                <option value="metall">Metall (A–Z)</option>
              </select>
            </div>
          </div>

          {/* Faol filtrlarni tozalash + View toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-5 border-t border-purple-800/40">
            <div className="flex items-center gap-3">
              <span className="text-purple-300 text-sm">
                <strong className="text-white text-lg">{filtered.length}</strong>
                <span className="text-purple-400"> / {birikmalar.length}</span> birikma
              </span>
              {hasActiveFilter && (
                <button
                  onClick={resetFilters}
                  className="text-pink-400 hover:text-pink-300 text-xs bg-pink-600/10 hover:bg-pink-600/20 border border-pink-600/30 px-3 py-1 rounded-full transition-all"
                >
                  ✕ Filtrlarni tozalash
                </button>
              )}
            </div>

            <div className="flex gap-1 bg-purple-950/50 border border-purple-700/40 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  viewMode === "grid" ? "bg-purple-600 text-white" : "text-purple-400 hover:bg-purple-800/50"
                }`}
              >
                ▦ Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  viewMode === "list" ? "bg-purple-600 text-white" : "text-purple-400 hover:bg-purple-800/50"
                }`}
              >
                ☰ Ro'yxat
              </button>
            </div>
          </div>
        </div>

        {/* ═══ NATIJALAR ═══ */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-br from-purple-900/30 to-slate-900/30 border border-purple-700/40 rounded-3xl">
            <div className="text-8xl mb-4 opacity-60">🔎</div>
            <h3 className="text-2xl font-bold text-white mb-2">Birikma topilmadi</h3>
            <p className="text-purple-300">Qidiruv yoki filtr shartlarini o'zgartiring</p>
            <button
              onClick={resetFilters}
              className="mt-6 bg-pink-600 hover:bg-pink-500 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-pink-500/30"
            >
              Filtrlarni tozalash
            </button>
          </div>
        ) : viewMode === "grid" ? (
          /* ─── GRID KO'RINISHI ─── */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((b, idx) => {
              const mc = metalColors[b.metallSimbol] || metalColors.Fe
              const zc = zaryadColors[b.zaryad]
              const maxKlaster = Math.max(...b.klaster)
              return (
                <Link
                  key={b.id}
                  href={b.href}
                  className={`group relative bg-gradient-to-br ${mc.bg} backdrop-blur-sm border ${mc.border} rounded-2xl p-5 hover:border-pink-400/70 transition-all transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-pink-500/20 overflow-hidden animate-fadeIn`}
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  {/* Dekorativ metall belgi (background) */}
                  <div className={`absolute top-0 right-0 text-8xl font-bold ${mc.text} opacity-5 select-none pointer-events-none group-hover:opacity-10 transition-opacity`}>
                    {b.metallSimbol}
                  </div>

                  {/* Yuqori qator: metall dot + zaryad */}
                  <div className="relative flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${mc.dot} shadow-lg animate-pulse`}></span>
                      <span className={`text-xs font-bold ${mc.text} font-mono`}>{b.metall}</span>
                    </div>
                    <span className={`${zc.bg} ${zc.text} border ${zc.border} px-2 py-0.5 rounded-full text-xs font-semibold`}>
                      {zc.label}
                    </span>
                  </div>

                  {/* Formula */}
                  <h3 className="relative text-xl md:text-2xl font-bold text-yellow-400 font-mono mb-2 group-hover:text-yellow-300 transition-colors">
                    {b.formula}
                  </h3>

                  {/* IUPAC */}
                  <p className="relative text-white font-semibold text-sm leading-snug mb-1">{b.iupac}</p>

                  {/* Tarixiy nom */}
                  {b.tarixiy && (
                    <p className="relative text-pink-300 text-xs italic mb-3">"{b.tarixiy}"</p>
                  )}

                  {/* Massa + m/z */}
                  <div className="relative grid grid-cols-2 gap-2 mt-3 mb-3">
                    <div className="bg-black/30 backdrop-blur border border-purple-800/40 rounded-lg p-2">
                      <p className="text-purple-400 text-[10px] uppercase tracking-wide">M (g/mol)</p>
                      <p className="text-white font-mono font-bold text-sm">{b.massaNum.toFixed(2)}</p>
                    </div>
                    <div className="bg-black/30 backdrop-blur border border-purple-800/40 rounded-lg p-2">
                      <p className="text-purple-400 text-[10px] uppercase tracking-wide">Asosiy ion</p>
                      <p className="text-cyan-300 font-mono font-bold text-sm">{b.asosiyIon}</p>
                    </div>
                  </div>

                  {/* Izotop cluster mini-preview */}
                  <div className="relative bg-black/40 rounded-lg p-2 mb-3 border border-purple-800/30">
                    <p className="text-purple-400 text-[10px] uppercase tracking-wide mb-1">Izotop cluster</p>
                    <div className="flex items-end gap-0.5 h-10">
                      {b.klaster.map((h, i) => (
                        <div
                          key={i}
                          className={`flex-1 ${h > 0 ? `${mc.dot} opacity-80` : "bg-purple-950/30"} rounded-t transition-all group-hover:opacity-100`}
                          style={{ height: `${(h / maxKlaster) * 100}%`, minHeight: h > 0 ? "2px" : "0" }}
                          title={`M+${i}: ${h}%`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Izotoplar chiplari */}
                  <div className="relative flex flex-wrap gap-1 mb-2">
                    {b.izotoplar.slice(0, 4).map((iso, i) => (
                      <span key={i} className="bg-purple-900/50 text-purple-200 text-[10px] font-mono px-1.5 py-0.5 rounded border border-purple-700/40">
                        {iso}
                      </span>
                    ))}
                  </div>

                  {/* Xususiyat */}
                  <p className="relative text-purple-300 text-xs leading-relaxed">
                    {b.xususiyat}
                  </p>

                  {/* Batafsil strelka */}
                  <div className="relative mt-3 pt-3 border-t border-purple-800/30 flex items-center justify-between">
                    <span className="text-pink-400 text-xs font-semibold group-hover:text-pink-300">
                      Batafsil tahlil
                    </span>
                    <span className="text-pink-400 text-lg group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          /* ─── LIST KO'RINISHI ─── */
          <div className="space-y-2">
            {filtered.map((b, idx) => {
              const mc = metalColors[b.metallSimbol] || metalColors.Fe
              const zc = zaryadColors[b.zaryad]
              return (
                <Link
                  key={b.id}
                  href={b.href}
                  className={`group flex items-center gap-4 bg-gradient-to-r ${mc.bg} backdrop-blur-sm border ${mc.border} rounded-xl p-4 hover:border-pink-400/70 transition-all animate-fadeIn`}
                  style={{ animationDelay: `${idx * 30}ms` }}
                >
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-black/40 border ${mc.border} ${mc.text} font-bold text-lg font-mono flex-shrink-0`}>
                    {b.metallSimbol}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <h3 className="text-lg font-bold text-yellow-400 font-mono group-hover:text-yellow-300 transition-colors">{b.formula}</h3>
                      <span className={`${zc.bg} ${zc.text} border ${zc.border} px-2 py-0.5 rounded-full text-[10px]`}>{zc.label}</span>
                    </div>
                    <p className="text-white text-sm truncate">{b.iupac}</p>
                    {b.tarixiy && <p className="text-pink-300 text-xs italic">"{b.tarixiy}"</p>}
                  </div>
                  <div className="hidden md:block text-right flex-shrink-0">
                    <p className="text-purple-400 text-[10px] uppercase">Massa</p>
                    <p className="text-white font-mono font-bold">{b.massaNum.toFixed(2)}</p>
                  </div>
                  <div className="hidden lg:block text-right flex-shrink-0 min-w-[120px]">
                    <p className="text-purple-400 text-[10px] uppercase">Asosiy ion</p>
                    <p className="text-cyan-300 font-mono text-sm">{b.asosiyIon}</p>
                  </div>
                  <span className="text-pink-400 text-2xl group-hover:translate-x-1 transition-transform flex-shrink-0">→</span>
                </Link>
              )
            })}
          </div>
        )}

        {/* ═══ QO'SHIMCHA: DIAGNOSTIK MASLAHATLAR ═══ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
          <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-700/40 rounded-2xl p-5">
            <div className="text-3xl mb-2">💡</div>
            <h4 className="text-cyan-300 font-bold mb-2">Izotop cluster tanish</h4>
            <p className="text-purple-200 text-xs leading-relaxed">
              Cl → 3:1 dublet, Br → 1:1, Cu → 2.24:1, Ag → deyarli teng, Pt → 4 pik cluster.
              Kartochkadagi mini-grafik shu naqshni ko'rsatadi.
            </p>
          </div>
          <div className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 border border-pink-700/40 rounded-2xl p-5">
            <div className="text-3xl mb-2">⚡</div>
            <h4 className="text-pink-300 font-bold mb-2">Ion zaryadi (z)</h4>
            <p className="text-purple-200 text-xs leading-relaxed">
              m/z hisobida z=2 bo'lsa piklar 0.5 Da masofada bo'ladi.
              Ko'p zaryadli komplekslar ESI da xarakterlidir.
            </p>
          </div>
          <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border border-emerald-700/40 rounded-2xl p-5">
            <div className="text-3xl mb-2">🔬</div>
            <h4 className="text-emerald-300 font-bold mb-2">Fragmentatsiya</h4>
            <p className="text-purple-200 text-xs leading-relaxed">
              Karbonil komplekslarda ketma-ket −28 (CO), Werner tipida −17 (NH₃),
              akvakomplekslarda −18 (H₂O) yo'qolishlari.
            </p>
          </div>
        </div>

        {/* ═══ QUICK JUMP CHIPS (mashhur birikmalar) ═══ */}
        <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/30 border border-purple-700/50 rounded-2xl p-6">
          <h4 className="text-white font-bold mb-3 flex items-center gap-2">
            <span>⭐</span> Mashhur birikmalarga tez o'tish
          </h4>
          <div className="flex flex-wrap gap-2">
            {["ferrosen", "sisplatin", "Qizil qon tuzi", "Sariq qon tuzi", "Tollens", "Verner"].map(kw => (
              <button
                key={kw}
                onClick={() => setQidiruv(kw)}
                className="bg-purple-800/40 hover:bg-pink-600/40 text-purple-200 hover:text-white border border-purple-700/40 hover:border-pink-500/60 px-4 py-1.5 rounded-full text-sm transition-all"
              >
                {kw}
              </button>
            ))}
          </div>
        </div>

      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="max-w-7xl mx-auto px-6 pb-16">
        <div className="bg-gradient-to-r from-pink-600/10 via-fuchsia-600/10 to-purple-600/10 border border-pink-500/20 rounded-2xl p-6 text-center">
          <p className="text-purple-300 text-sm">
            ⚖️ Hozirda bazada <strong className="text-white text-lg">{birikmalar.length}</strong> ta kompleks birikmaning mass-spektr tahlili mavjud.
          </p>
          <p className="text-purple-400 text-xs mt-2">
            NIST 2021 izotopik ma'lumotlari • Henderson & McIndoe metodologiyasi • Gross Mass Spectrometry
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out both;
        }
      `}</style>

    </main>
  )
}
