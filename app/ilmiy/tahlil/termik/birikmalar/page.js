"use client"

import Link from "next/link"
import { useState, useMemo, useEffect } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// TERMIK TAHLIL — BIRIKMALAR KATALOGI (PREMIUM UI)
// Manbalar: Vogel's Quantitative Chemical Analysis, Wendlandt (Thermal Analysis)
// Xususiyat: 12 ta kompleks birikma — o'zgarishsiz saqlangan
// Dizayn: Animated hero, metal-based cards, sparklines, 3D tilt, modal, filters
// ═══════════════════════════════════════════════════════════════════════════════

const birikmalar = [
  {
    id: "co-nh3-6-cl3",
    slug: "co-nh3-6-cl3",
    formula: "[Co(NH₃)₆]Cl₃",
    iupac: "Geksaamminkobalt(III) xlorid",
    metal: "Co³⁺",
    molarMass: 267.48,
    color: "sariq-to'q sariq",
    type: "Kompleks kation",
    tgaSteps: "NH₃ bosqichli (150-600°C)",
    residue: "CoCl₂",
    notes: "NH₃ bosqichli ajraladi"
  },
  {
    id: "ni-en3-cl2",
    slug: "ni-en3-cl2",
    formula: "[Ni(en)₃]Cl₂",
    iupac: "Tris(etilendiamin)nikel(II) xlorid",
    metal: "Ni²⁺",
    molarMass: 309.90,
    color: "binafsha",
    type: "Xelat kompleks",
    tgaSteps: "en parchalanishi (200-400°C)",
    residue: "NiCl₂",
    notes: "Xelat ligand parchalanishi"
  },
  {
    id: "k3-fe-cn6",
    slug: "k3-fe-cn6",
    formula: "K₃[Fe(CN)₆]",
    iupac: "Kaliy geksatsianoferrat(III)",
    metal: "Fe³⁺",
    molarMass: 329.24,
    color: "qizil",
    type: "Kompleks anion",
    tgaSteps: "CN⁻ parchalanishi (500-700°C)",
    residue: "Fe + KCN",
    notes: "CN⁻ juda barqaror, yuqori T"
  },
  {
    id: "fe-c5h5-2",
    slug: "fe-c5h5-2",
    formula: "[Fe(C₅H₅)₂]",
    iupac: "Bis(η⁵-siklopentadienil)temir(II)",
    metal: "Fe²⁺",
    molarMass: 186.03,
    color: "to'q sariq",
    type: "Metallocen",
    tgaSteps: "Suyuqlanish (173°C), bug'lanish (249°C)",
    residue: "Bug'lanadi",
    notes: "Metallocen — suyuqlanadi va bug'lanadi"
  },
  {
    id: "pt-nh3-2-cl2",
    slug: "pt-nh3-2-cl2",
    formula: "[Pt(NH₃)₂Cl₂]",
    iupac: "Diammindixloroplatina(II)",
    metal: "Pt²⁺",
    molarMass: 300.05,
    color: "sariq (cis) / binafsha (trans)",
    type: "Kvadrat-tekis",
    tgaSteps: "NH₃ + HCl (270-600°C)",
    residue: "Pt",
    notes: "Sisplatin — saraton dori"
  },
  {
    id: "co-en3-cl3",
    slug: "co-en3-cl3",
    formula: "[Co(en)₃]Cl₃",
    iupac: "Tris(etilendiamin)kobalt(III) xlorid",
    metal: "Co³⁺",
    molarMass: 343.52,
    color: "sariq",
    type: "Xelat kompleks",
    tgaSteps: "en parchalanishi (200-500°C)",
    residue: "CoCl₂",
    notes: "Xelat ligand parchalanishi"
  },
  {
    id: "co-nh3-5-cl-cl2",
    slug: "co-nh3-5-cl-cl2",
    formula: "[Co(NH₃)₅Cl]Cl₂",
    iupac: "Pentaamminklorokobalt(III) xlorid",
    metal: "Co³⁺",
    molarMass: 250.44,
    color: "binafsha (purpureo)",
    type: "Verner kompleksi",
    tgaSteps: "2 tashqi Cl⁻ (150°C), ichki Cl⁻ (300°C), NH₃ (400°C)",
    residue: "CoCl₂",
    notes: "Ichki/tashqi sfera Cl farqi"
  },
  {
    id: "cr-h2o-6-cl3",
    slug: "cr-h2o-6-cl3",
    formula: "[Cr(H₂O)₆]Cl₃",
    iupac: "Geksaakvaxrom(III) xlorid",
    metal: "Cr³⁺",
    molarMass: 266.45,
    color: "binafsha",
    type: "Gidrat izomer (6 ichki)",
    tgaSteps: "6 ta ichki H₂O (200-250°C)",
    residue: "CrCl₃",
    notes: "Barcha suv ichki sferada"
  },
  {
    id: "cr-cl-h2o-5-cl2-h2o",
    slug: "cr-cl-h2o-5-cl2-h2o",
    formula: "[CrCl(H₂O)₅]Cl₂·H₂O",
    iupac: "Pentakvaaxloroxrom(III) xlorid monogidrat",
    metal: "Cr³⁺",
    molarMass: 266.45,
    color: "och yashil",
    type: "Gidrat izomer (1 tashqi + 5 ichki)",
    tgaSteps: "1 tashqi H₂O (80°C), 5 ichki H₂O (200°C)",
    residue: "CrCl₃",
    notes: "Gidrat izomer — 1 tashqi + 5 ichki"
  },
  {
    id: "cr-cl2-h2o-4-cl-2h2o",
    slug: "cr-cl2-h2o-4-cl-2h2o",
    formula: "[CrCl₂(H₂O)₄]Cl·2H₂O",
    iupac: "Tetrakvaadixloroxrom(III) xlorid digidrat",
    metal: "Cr³⁺",
    molarMass: 266.45,
    color: "to'q yashil",
    type: "Gidrat izomer (2 tashqi + 4 ichki)",
    tgaSteps: "2 tashqi H₂O (80°C), 4 ichki H₂O (200°C)",
    residue: "CrCl₃",
    notes: "Gidrat izomer — 2 tashqi + 4 ichki"
  },
  {
    id: "ni-h2o-6-so4",
    slug: "ni-h2o-6-so4",
    formula: "[Ni(H₂O)₆]SO₄",
    iupac: "Geksaakvanikel(II) sulfat",
    metal: "Ni²⁺",
    molarMass: 230.79,
    color: "yashil",
    type: "Gidrat kompleks",
    tgaSteps: "6 ta ichki H₂O (200-400°C)",
    residue: "NiSO₄",
    notes: "6 ta ichki suv"
  },
  {
    id: "cu-nh3-4-so4-h2o",
    slug: "cu-nh3-4-so4-h2o",
    formula: "[Cu(NH₃)₄]SO₄·H₂O",
    iupac: "Tetraammismis(II) sulfat monogidrat",
    metal: "Cu²⁺",
    molarMass: 245.75,
    color: "to'q ko'k",
    type: "Kompleks kation",
    tgaSteps: "H₂O (100°C), NH₃ (200°C)",
    residue: "CuO",
    notes: "NH₃ va H₂O parchalanishi"
  }
]

// ─── Metallar bo'yicha metadata (rang, kimyoviy nom, atom raqami, dizayn uchun)
const METAL_META = {
  "Co³⁺": { name: "Kobalt",  Z: 27, from: "from-pink-500",    to: "to-rose-600",    ring: "ring-pink-400/50",    text: "text-pink-300",    glow: "shadow-pink-500/40",   config: "[Ar] 3d⁶",  bar: "#ec4899" },
  "Ni²⁺": { name: "Nikel",   Z: 28, from: "from-emerald-500", to: "to-teal-600",    ring: "ring-emerald-400/50", text: "text-emerald-300", glow: "shadow-emerald-500/40",config: "[Ar] 3d⁸",  bar: "#10b981" },
  "Fe³⁺": { name: "Temir",   Z: 26, from: "from-red-500",     to: "to-orange-600",  ring: "ring-red-400/50",     text: "text-red-300",     glow: "shadow-red-500/40",    config: "[Ar] 3d⁵",  bar: "#ef4444" },
  "Fe²⁺": { name: "Temir",   Z: 26, from: "from-orange-500",  to: "to-amber-600",   ring: "ring-orange-400/50",  text: "text-orange-300",  glow: "shadow-orange-500/40", config: "[Ar] 3d⁶",  bar: "#f97316" },
  "Pt²⁺": { name: "Platina", Z: 78, from: "from-slate-400",   to: "to-slate-600",   ring: "ring-slate-300/50",   text: "text-slate-200",   glow: "shadow-slate-400/40",  config: "[Xe] 5d⁸",  bar: "#94a3b8" },
  "Cr³⁺": { name: "Xrom",    Z: 24, from: "from-violet-500",  to: "to-purple-600",  ring: "ring-violet-400/50",  text: "text-violet-300",  glow: "shadow-violet-500/40", config: "[Ar] 3d³",  bar: "#8b5cf6" },
  "Cu²⁺": { name: "Mis",     Z: 29, from: "from-blue-500",    to: "to-cyan-600",    ring: "ring-blue-400/50",    text: "text-blue-300",    glow: "shadow-blue-500/40",   config: "[Ar] 3d⁹",  bar: "#3b82f6" },
}

// ─── Har birikma uchun TGA sparkline nuqtalari (mini simulyatsiya)
// Faqat dizayn uchun — asosiy ma'lumotlar tgaSteps satrida
const SPARKLINE_DATA = {
  "co-nh3-6-cl3":         [100, 100, 100, 92, 82, 70, 58, 50, 42, 38, 38, 38],
  "ni-en3-cl2":           [100, 100, 100, 100, 80, 60, 45, 42, 42, 42, 42, 42],
  "k3-fe-cn6":            [100, 100, 100, 100, 100, 100, 90, 75, 68, 65, 65, 65],
  "fe-c5h5-2":            [100, 100, 100, 95, 70, 40, 20, 5,  0,  0,  0,  0],
  "pt-nh3-2-cl2":         [100, 100, 100, 100, 95, 75, 55, 40, 62, 62, 62, 62],
  "co-en3-cl3":           [100, 100, 100, 100, 85, 65, 50, 40, 38, 38, 38, 38],
  "co-nh3-5-cl-cl2":      [100, 100, 95, 87, 80, 70, 60, 55, 52, 52, 52, 52],
  "cr-h2o-6-cl3":         [100, 100, 100, 85, 60, 45, 40, 40, 40, 40, 40, 40],
  "cr-cl-h2o-5-cl2-h2o":  [100, 95, 90, 80, 60, 45, 40, 40, 40, 40, 40, 40],
  "cr-cl2-h2o-4-cl-2h2o": [100, 90, 85, 78, 60, 45, 40, 40, 40, 40, 40, 40],
  "ni-h2o-6-so4":         [100, 100, 100, 90, 70, 55, 45, 42, 42, 42, 42, 42],
  "cu-nh3-4-so4-h2o":     [100, 95, 90, 78, 60, 45, 35, 32, 32, 32, 32, 32],
}

// ─── Metallar bo'yicha filter chip'lar
const METAL_CHIPS = ["Co³⁺", "Ni²⁺", "Fe³⁺", "Fe²⁺", "Cr³⁺", "Cu²⁺", "Pt²⁺"]

export default function TermikBirikmalar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterMetal, setFilterMetal] = useState("all")
  const [sortBy, setSortBy] = useState("default")
  const [viewMode, setViewMode] = useState("grid")
  const [selectedCompound, setSelectedCompound] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  // Statistika
  const stats = useMemo(() => ({
    total: birikmalar.length,
    metals: new Set(birikmalar.map(b => b.metal)).size,
    hydrates: birikmalar.filter(b => b.type.toLowerCase().includes("gidrat")).length,
    chelates: birikmalar.filter(b => b.type.toLowerCase().includes("xelat")).length,
    avgMass: (birikmalar.reduce((s, b) => s + b.molarMass, 0) / birikmalar.length).toFixed(1),
    tempRange: "80–700°C",
  }), [])

  const filtered = useMemo(() => {
    let result = [...birikmalar]
    if (filterType !== "all") result = result.filter(b => b.type.toLowerCase().includes(filterType))
    if (filterMetal !== "all") result = result.filter(b => b.metal === filterMetal)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(b =>
        b.formula.toLowerCase().includes(q) ||
        b.iupac.toLowerCase().includes(q) ||
        b.metal.toLowerCase().includes(q) ||
        b.notes.toLowerCase().includes(q)
      )
    }
    if (sortBy === "mass-asc")   result.sort((a, b) => a.molarMass - b.molarMass)
    if (sortBy === "mass-desc")  result.sort((a, b) => b.molarMass - a.molarMass)
    if (sortBy === "metal")      result.sort((a, b) => a.metal.localeCompare(b.metal))
    return result
  }, [searchQuery, filterType, filterMetal, sortBy])

  return (
    <main className="relative min-h-screen bg-slate-950 text-white overflow-x-hidden">

      {/* ═══════════════ ANIMATSIYALAR (Global keyframes) ═══════════════ */}
      <style jsx global>{`
        @keyframes float-slow { 0%,100% { transform: translate(0,0) rotate(0); } 50% { transform: translate(30px,-20px) rotate(180deg); } }
        @keyframes float-med  { 0%,100% { transform: translate(0,0) rotate(0); } 50% { transform: translate(-25px,25px) rotate(-180deg); } }
        @keyframes float-fast { 0%,100% { transform: translate(0,0); } 50% { transform: translate(15px,-30px); } }
        @keyframes shine      { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes pulse-glow { 0%,100% { opacity: 0.4; } 50% { opacity: 0.9; } }
        @keyframes fadeInUp   { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes orbit      { 0% { transform: rotate(0) translateX(30px) rotate(0); } 100% { transform: rotate(360deg) translateX(30px) rotate(-360deg); } }
        .animate-float-slow { animation: float-slow 18s ease-in-out infinite; }
        .animate-float-med  { animation: float-med 14s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 10s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .animate-shine      { background-size: 200% 100%; animation: shine 3s linear infinite; }
        .fade-in-up         { animation: fadeInUp 0.6s ease-out both; }
        .card-tilt          { transition: transform 0.3s cubic-bezier(0.2, 0.9, 0.3, 1.4); }
        .card-tilt:hover    { transform: perspective(1000px) rotateX(2deg) rotateY(-2deg) translateY(-6px) scale(1.02); }
      `}</style>

      {/* ═══════════════ FON — animated mesh ═══════════════ */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/10 blur-3xl animate-float-slow" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/10 blur-3xl animate-float-med" />
        <div className="absolute bottom-0 left-1/3 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-cyan-500/15 to-blue-500/10 blur-3xl animate-float-fast" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.03)_1px,transparent_0)] bg-[size:40px_40px]" />
      </div>

      {/* ═══════════════ STICKY HEADER ═══════════════ */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/70 border-b border-red-800/30">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <Link href="/" className="hover:text-red-300 transition">🏠 Bosh</Link>
            <span className="text-slate-600">›</span>
            <Link href="/ilmiy/tahlil" className="hover:text-red-300 transition">Tahlil usullari</Link>
            <span className="text-slate-600">›</span>
            <Link href="/ilmiy/tahlil/termik" className="hover:text-red-300 transition">Termik tahlil</Link>
            <span className="text-slate-600">›</span>
            <span className="text-orange-300 font-semibold">Birikmalar katalogi</span>
          </nav>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 via-orange-500 to-pink-500 flex items-center justify-center text-white font-black shadow-lg shadow-red-500/40">🔥</div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-red-400">Termik moduli • Premium katalog</div>
                <h1 className="text-lg font-black bg-gradient-to-r from-red-200 via-orange-200 to-pink-200 bg-clip-text text-transparent">
                  Kompleks birikmalar
                </h1>
              </div>
            </div>
            <Link href="/ilmiy/tahlil/termik"
              className="hidden md:inline-flex px-4 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-red-800/40 text-red-300 text-xs font-semibold transition">
              ← Nazariya
            </Link>
          </div>
        </div>
      </header>

      <section className="relative max-w-7xl mx-auto px-6 py-10 space-y-12">

        {/* ════════ HERO — animated ════════ */}
        <div className="relative overflow-hidden rounded-[2rem] border border-red-500/30 bg-gradient-to-br from-red-950/60 via-slate-900/70 to-purple-950/60 p-10 md:p-14 shadow-2xl shadow-red-500/10 fade-in-up">
          {/* Floating molekulalar */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 right-20 text-5xl opacity-20 animate-float-slow">⚛️</div>
            <div className="absolute bottom-10 right-40 text-4xl opacity-15 animate-float-med">🔥</div>
            <div className="absolute top-1/2 right-10 text-3xl opacity-20 animate-float-fast">🧪</div>
            <div className="absolute top-20 right-1/3 text-2xl opacity-10 animate-float-med">💧</div>
          </div>

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-xs text-red-200 mb-4 backdrop-blur">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse-glow" />
              Premium ilmiy katalog • 12 birikma
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tight">
              <span className="bg-gradient-to-r from-red-300 via-orange-200 to-pink-300 bg-clip-text text-transparent animate-shine bg-[linear-gradient(90deg,#fca5a5,#fdba74,#f9a8d4,#fca5a5)]">Kompleks</span><br/>
              <span className="text-white">birikmalar</span>
              <span className="text-red-400">.</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-3xl leading-relaxed">
              <strong className="text-orange-300">12 ta klassik koordinatsion birikma</strong> — <em>gidrat izomeriya</em>,
              <em> parchalanish bosqichlari</em> va <em>termik barqarorlik</em>. Har biri Werner
              nazariyasi va termik tahlil oralig'idagi ko'prikni ochib beradi.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              <span className="px-4 py-2 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-400/30 text-red-200 text-xs backdrop-blur">🔥 TGA • DTG • DSC</span>
              <span className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-violet-500/20 border border-purple-400/30 text-purple-200 text-xs backdrop-blur">💧 Gidrat izomeriya</span>
              <span className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 text-emerald-200 text-xs backdrop-blur">🔗 Xelat komplekslar</span>
              <span className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 text-blue-200 text-xs backdrop-blur">⚗️ Werner kompleksi</span>
              <span className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-400/30 text-pink-200 text-xs backdrop-blur">💊 Sisplatin</span>
            </div>
          </div>
        </div>

        {/* ════════ STATISTIKA — 6 ta jonli karta ════════ */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 fade-in-up" style={{ animationDelay: "0.1s" }}>
          <StatCard icon="🧪" value={stats.total} label="Jami birikma" grad="from-red-500 to-orange-500" />
          <StatCard icon="⚛️" value={stats.metals}  label="Metall turi" grad="from-purple-500 to-pink-500" />
          <StatCard icon="💧" value={stats.hydrates} label="Gidrat izomer" grad="from-cyan-500 to-blue-500" />
          <StatCard icon="🔗" value={stats.chelates} label="Xelat kompl." grad="from-emerald-500 to-teal-500" />
          <StatCard icon="⚖️" value={stats.avgMass}  label="O'rt. M (g/mol)" grad="from-yellow-500 to-orange-500" />
          <StatCard icon="🌡️" value={stats.tempRange} label="T oralig'i" grad="from-rose-500 to-red-500" isText />
        </div>

        {/* ════════ QIDIRUV + FILTER PANELI ════════ */}
        <div className="relative bg-slate-900/60 backdrop-blur-md border border-red-800/30 rounded-3xl p-6 space-y-5 fade-in-up" style={{ animationDelay: "0.2s" }}>

          {/* Qidiruv */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1 group">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-pink-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <input
                type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Formula, IUPAC nomi, metall yoki eslatma bo'yicha qidirish..."
                className="relative w-full px-5 py-4 bg-slate-950/70 border border-red-700/30 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-red-500/70 transition text-sm" />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-400 text-lg">✕</button>
              )}
            </div>

            {/* View mode + sort */}
            <div className="flex gap-2">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950/70 border border-red-700/30 text-red-200 text-xs focus:outline-none focus:border-red-500/70">
                <option value="default">Standart tartib</option>
                <option value="mass-asc">Massa ↑</option>
                <option value="mass-desc">Massa ↓</option>
                <option value="metal">Metall bo'yicha</option>
              </select>
              <div className="flex gap-1 bg-slate-950/60 rounded-xl p-1 border border-red-800/30">
                {[{ k:"grid", ic:"▦" }, { k:"table", ic:"≡" }, { k:"compact", ic:"▣" }].map((v) => (
                  <button key={v.k} onClick={() => setViewMode(v.k)}
                    className={`w-9 h-9 rounded-lg text-lg font-bold transition ${viewMode === v.k
                      ? "bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/40"
                      : "text-slate-400 hover:text-red-300"}`}>{v.ic}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Metal chip filter */}
          <div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Metall ioni bo'yicha</div>
            <div className="flex flex-wrap gap-2">
              <FilterChip active={filterMetal === "all"} onClick={() => setFilterMetal("all")} label={`Barcha (${birikmalar.length})`} />
              {METAL_CHIPS.filter(m => birikmalar.some(b => b.metal === m)).map((m) => {
                const meta = METAL_META[m]
                const count = birikmalar.filter(b => b.metal === m).length
                return (
                  <FilterChip key={m} active={filterMetal === m} onClick={() => setFilterMetal(m)}
                    label={<span className="flex items-center gap-1.5"><span className={`w-2 h-2 rounded-full`} style={{ background: meta.bar }} />{m} <span className="opacity-60">({count})</span></span>}
                    activeGrad={`bg-gradient-to-r ${meta.from} ${meta.to}`} />
                )
              })}
            </div>
          </div>

          {/* Type filter */}
          <div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Kompleks turi bo'yicha</div>
            <div className="flex flex-wrap gap-2">
              <FilterChip active={filterType === "all"}      onClick={() => setFilterType("all")}      label={`Barcha (${birikmalar.length})`} />
              <FilterChip active={filterType === "gidrat"}   onClick={() => setFilterType("gidrat")}   label={`💧 Gidrat (${birikmalar.filter(b => b.type.toLowerCase().includes("gidrat")).length})`}   activeGrad="bg-gradient-to-r from-cyan-500 to-blue-500" />
              <FilterChip active={filterType === "xelat"}    onClick={() => setFilterType("xelat")}    label={`🔗 Xelat (${birikmalar.filter(b => b.type.toLowerCase().includes("xelat")).length})`}      activeGrad="bg-gradient-to-r from-emerald-500 to-teal-500" />
              <FilterChip active={filterType === "kation"}   onClick={() => setFilterType("kation")}   label={`🔺 Kation (${birikmalar.filter(b => b.type.toLowerCase().includes("kation")).length})`}   activeGrad="bg-gradient-to-r from-red-500 to-orange-500" />
              <FilterChip active={filterType === "anion"}    onClick={() => setFilterType("anion")}    label={`🔻 Anion (${birikmalar.filter(b => b.type.toLowerCase().includes("anion")).length})`}     activeGrad="bg-gradient-to-r from-purple-500 to-pink-500" />
              <FilterChip active={filterType === "metallocen"} onClick={() => setFilterType("metallocen")} label={`🔹 Metallocen (${birikmalar.filter(b => b.type.toLowerCase().includes("metallocen")).length})`} activeGrad="bg-gradient-to-r from-amber-500 to-orange-500" />
              <FilterChip active={filterType === "verner"}   onClick={() => setFilterType("verner")}   label={`⚗️ Verner (${birikmalar.filter(b => b.type.toLowerCase().includes("verner")).length})`}     activeGrad="bg-gradient-to-r from-violet-500 to-purple-500" />
              <FilterChip active={filterType === "kvadrat"}  onClick={() => setFilterType("kvadrat")}  label={`□ Kvadrat-tekis (${birikmalar.filter(b => b.type.toLowerCase().includes("kvadrat")).length})`} activeGrad="bg-gradient-to-r from-slate-400 to-slate-600" />
            </div>
          </div>

          {/* Natijalar hisoblagichi */}
          <div className="flex items-center justify-between pt-2 border-t border-red-800/20">
            <div className="text-sm text-slate-400">
              Natijalar: <strong className="text-orange-300 text-lg font-mono">{filtered.length}</strong> / {birikmalar.length}
            </div>
            {(searchQuery || filterType !== "all" || filterMetal !== "all" || sortBy !== "default") && (
              <button onClick={() => { setSearchQuery(""); setFilterType("all"); setFilterMetal("all"); setSortBy("default") }}
                className="text-xs text-red-300 hover:text-red-200 underline">Filterlarni tozalash ✕</button>
            )}
          </div>
        </div>

        {/* ════════ NATIJALAR ════════ */}
        {filtered.length === 0 ? (
          <EmptyState onReset={() => { setSearchQuery(""); setFilterType("all"); setFilterMetal("all") }} />
        ) : (
          <>
            {/* GRID VIEW — premium kartalar */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((b, idx) => (
                  <CompoundCard key={b.id} compound={b} idx={idx} onOpen={() => setSelectedCompound(b)} />
                ))}
              </div>
            )}

            {/* COMPACT VIEW — mini kartalar */}
            {viewMode === "compact" && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filtered.map((b, idx) => (
                  <CompactCard key={b.id} compound={b} idx={idx} onOpen={() => setSelectedCompound(b)} />
                ))}
              </div>
            )}

            {/* TABLE VIEW — premium jadval */}
            {viewMode === "table" && (
              <div className="relative rounded-3xl overflow-hidden border border-red-800/30 bg-slate-900/60 backdrop-blur">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gradient-to-r from-red-950/70 via-orange-950/50 to-red-950/70 border-b border-red-800/50">
                        <th className="py-4 px-4 text-xs uppercase tracking-wider text-red-300 font-bold">Formula</th>
                        <th className="py-4 px-4 text-xs uppercase tracking-wider text-red-300 font-bold">IUPAC</th>
                        <th className="py-4 px-4 text-xs uppercase tracking-wider text-red-300 font-bold">Metall</th>
                        <th className="py-4 px-4 text-xs uppercase tracking-wider text-red-300 font-bold">M (g/mol)</th>
                        <th className="py-4 px-4 text-xs uppercase tracking-wider text-red-300 font-bold">Rang</th>
                        <th className="py-4 px-4 text-xs uppercase tracking-wider text-red-300 font-bold">Turi</th>
                        <th className="py-4 px-4 text-xs uppercase tracking-wider text-red-300 font-bold">TGA bosqichi</th>
                        <th className="py-4 px-4 text-xs uppercase tracking-wider text-red-300 font-bold">Qoldiq</th>
                        <th className="py-4 px-4 text-xs uppercase tracking-wider text-red-300 font-bold">TGA egrisi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((b, idx) => {
                        const meta = METAL_META[b.metal] || { bar: "#94a3b8", text: "text-slate-300" }
                        return (
                          <tr key={b.id}
                            onClick={() => setSelectedCompound(b)}
                            className="border-b border-red-900/20 hover:bg-red-950/20 transition cursor-pointer group">
                            <td className="py-3 px-4 font-mono text-red-300 font-bold group-hover:text-orange-300 transition whitespace-nowrap">{b.formula}</td>
                            <td className="py-3 px-4 text-slate-300 text-xs max-w-xs">{b.iupac}</td>
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-mono font-bold" style={{ background: `${meta.bar}22`, color: meta.bar, border: `1px solid ${meta.bar}55` }}>
                                <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.bar }} />{b.metal}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono text-yellow-300 font-bold">{b.molarMass}</td>
                            <td className="py-3 px-4 text-slate-300 text-xs italic">{b.color}</td>
                            <td className="py-3 px-4 text-slate-300 text-xs">{b.type}</td>
                            <td className="py-3 px-4 text-orange-300 text-xs font-mono">{b.tgaSteps}</td>
                            <td className="py-3 px-4 font-mono text-emerald-300 font-bold">{b.residue}</td>
                            <td className="py-3 px-4">
                              <MiniSparkline data={SPARKLINE_DATA[b.id]} color={meta.bar} width={80} height={30} />
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* ════════ GIDRAT IZOMERIYA SHOWCASE — 3D flip ════════ */}
        <div className="relative overflow-hidden rounded-[2rem] border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-blue-950/40 to-slate-950/60 p-8 md:p-12 shadow-2xl shadow-cyan-500/10">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-8 right-10 text-6xl opacity-10 animate-float-slow">💧</div>
            <div className="absolute bottom-10 left-10 text-5xl opacity-10 animate-float-med">⚗️</div>
          </div>
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-xs text-cyan-200 mb-4">
              💧 Werner nazariyasining eksperimental isboti
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
              Gidrat izomeriya: <span className="bg-gradient-to-r from-violet-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent">CrCl₃·6H₂O</span>
            </h2>
            <p className="text-slate-300 max-w-3xl leading-relaxed mb-8">
              Bir xil <strong className="text-yellow-300">brutto formula</strong> — uch xil <strong className="text-cyan-300">termogramma</strong>.
              Ichki (koordinatsion) va tashqi (kristall) suv molekulalari <em>har xil haroratda</em> ajraladi —
              bu koordinatsion kimyoning eng chiroyli eksperimental isboti.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <HydrateIsomerCard
                formula="[Cr(H₂O)₆]Cl₃"
                colorName="Binafsha" hex="#8b5cf6" waterInner={6} waterOuter={0}
                temps="Faqat ≥ 200°C" desc="Barcha 6 ta suv ichki sferada — Cr–O bog' bilan mahkam bog'langan" />
              <HydrateIsomerCard
                formula="[CrCl(H₂O)₅]Cl₂·H₂O"
                colorName="Och yashil" hex="#10b981" waterInner={5} waterOuter={1}
                temps="80°C + 200°C" desc="1 ta tashqi suv past T da, 5 ta ichki suv yuqori T da ajraladi" />
              <HydrateIsomerCard
                formula="[CrCl₂(H₂O)₄]Cl·2H₂O"
                colorName="To'q yashil" hex="#0d9488" waterInner={4} waterOuter={2}
                temps="80°C + 220°C" desc="2 ta tashqi suv past T da, 4 ta ichki suv yuqori T da ajraladi" />
            </div>
          </div>
        </div>

        {/* ════════ NAVIGATSIYA ════════ */}
        <div className="flex flex-col md:flex-row gap-4 pt-6">
          <Link href="/ilmiy/tahlil/termik"
            className="flex-1 group px-6 py-4 rounded-2xl border border-red-800/40 bg-slate-900/60 hover:bg-red-950/40 transition text-center">
            <div className="text-xs text-slate-500 uppercase tracking-widest">Orqaga</div>
            <div className="text-red-300 font-bold group-hover:text-red-200 transition">← Termik tahlil nazariyasi</div>
          </Link>
          <Link href="/ilmiy/tahlil"
            className="flex-1 group px-6 py-4 rounded-2xl bg-gradient-to-r from-red-500 via-orange-500 to-pink-500 hover:from-red-400 hover:via-orange-400 hover:to-pink-400 shadow-lg shadow-red-500/30 transition text-center">
            <div className="text-xs text-red-100 uppercase tracking-widest">Barcha 20 usul</div>
            <div className="text-white font-black text-lg">Tahlil portali →</div>
          </Link>
          <Link href="/ilmiy/tahlil/konduktometriya"
            className="flex-1 group px-6 py-4 rounded-2xl border border-purple-800/40 bg-slate-900/60 hover:bg-purple-950/40 transition text-center">
            <div className="text-xs text-slate-500 uppercase tracking-widest">Keyingi</div>
            <div className="text-purple-300 font-bold group-hover:text-purple-200 transition">Konduktometriya →</div>
          </Link>
        </div>
      </section>

      {/* ══════ COMPOUND MODAL ══════ */}
      {selectedCompound && (
        <CompoundModal compound={selectedCompound} onClose={() => setSelectedCompound(null)} />
      )}

      {/* ══════ FOOTER ══════ */}
      <footer className="relative border-t border-red-800/30 py-8 mt-8 bg-slate-950/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 via-orange-500 to-pink-500 flex items-center justify-center text-white font-black shadow-lg">🔥</div>
              <div>
                <div className="text-xs text-red-400 uppercase tracking-widest">JDA Kimyo • Premium</div>
                <div className="text-orange-300 font-black">Termik birikmalar katalogi</div>
              </div>
            </div>
            <div className="text-xs text-slate-500 text-center md:text-right">
              <p>© 2026 Koordinatsion kimyo tahlil portali</p>
              <p className="text-slate-600 mt-1">12 klassik birikma • Gidrat izomeriya • Termik barqarorlik</p>
            </div>
          </div>
          <div className="pt-4 border-t border-red-900/30 text-[10px] text-slate-600 text-center leading-relaxed">
            <strong className="text-slate-500">Manbalar:</strong> Vogel's Quantitative Chemical Analysis (6th ed.) •
            Wendlandt W. W. — Thermal Methods of Analysis • Brown M. E. — Introduction to Thermal Analysis •
            Housecroft & Sharpe — Inorganic Chemistry (4th ed.)
          </div>
        </div>
      </footer>
    </main>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// KOMPONENTLAR
// ═══════════════════════════════════════════════════════════════════════════════

function StatCard({ icon, value, label, grad, isText }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-4 bg-slate-900/60 border border-red-800/30 hover:border-red-500/50 transition group`}>
      <div className={`absolute -inset-1 bg-gradient-to-br ${grad} opacity-0 group-hover:opacity-20 blur-xl transition`} />
      <div className="relative">
        <div className="text-2xl mb-1">{icon}</div>
        <div className={`${isText ? "text-xl" : "text-3xl"} font-black bg-gradient-to-br ${grad} bg-clip-text text-transparent`}>{value}</div>
        <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{label}</div>
      </div>
    </div>
  )
}

function FilterChip({ active, onClick, label, activeGrad = "bg-gradient-to-r from-red-500 to-orange-500" }) {
  return (
    <button onClick={onClick}
      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${active
        ? `${activeGrad} text-white shadow-lg shadow-red-500/30 border-transparent`
        : "bg-slate-950/50 text-slate-300 border-red-900/30 hover:border-red-500/50 hover:text-red-200"}`}>
      {label}
    </button>
  )
}

// ═══ PREMIUM COMPOUND CARD — metal-based gradient + sparkline + 3D tilt
function CompoundCard({ compound: b, idx, onOpen }) {
  const meta = METAL_META[b.metal] || { from: "from-slate-500", to: "to-slate-700", ring: "ring-slate-400/50", text: "text-slate-300", glow: "shadow-slate-500/30", config: "—", bar: "#94a3b8", name: "—", Z: 0 }
  const isHydrate = b.type.toLowerCase().includes("gidrat")
  const isChelate = b.type.toLowerCase().includes("xelat")

  return (
    <button onClick={onOpen}
      className={`group relative card-tilt fade-in-up text-left w-full rounded-3xl overflow-hidden border border-red-800/30 bg-gradient-to-br from-slate-900/80 via-slate-950/80 to-slate-900/80 hover:border-red-500/50 shadow-xl hover:${meta.glow} transition-all`}
      style={{ animationDelay: `${idx * 0.05}s` }}>

      {/* Ustki gradient chizig'i */}
      <div className={`h-1.5 bg-gradient-to-r ${meta.from} ${meta.to}`} />

      {/* Metal orbital */}
      <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition">
        <MetalOrbital hex={meta.bar} />
      </div>

      <div className="relative p-6">
        {/* Metal badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border`}
                style={{ background: `${meta.bar}22`, borderColor: `${meta.bar}55`, color: meta.bar }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse-glow" style={{ background: meta.bar }} />
                {b.metal}
              </span>
              {isHydrate && <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">💧 gidrat</span>}
              {isChelate && <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">🔗 xelat</span>}
            </div>
            <h3 className="text-2xl font-black text-white font-mono break-all leading-tight">{b.formula}</h3>
            <p className="text-slate-400 text-xs mt-1 italic">{b.iupac}</p>
          </div>
        </div>

        {/* Molyar massa katta ko'rsatkich */}
        <div className="flex items-baseline gap-2 mb-4 pb-4 border-b border-red-900/20">
          <span className="text-xs text-slate-500">M =</span>
          <span className={`text-3xl font-black bg-gradient-to-br ${meta.from} ${meta.to} bg-clip-text text-transparent`}>{b.molarMass}</span>
          <span className="text-xs text-slate-500 font-mono">g/mol</span>
        </div>

        {/* Xususiyatlar grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-slate-950/60 rounded-lg p-2.5 border border-red-900/20">
            <div className="text-[10px] uppercase text-slate-500 tracking-wider">Rang</div>
            <div className="text-xs text-white mt-0.5 truncate" title={b.color}>{b.color}</div>
          </div>
          <div className="bg-slate-950/60 rounded-lg p-2.5 border border-red-900/20">
            <div className="text-[10px] uppercase text-slate-500 tracking-wider">Turi</div>
            <div className="text-xs text-white mt-0.5 truncate" title={b.type}>{b.type}</div>
          </div>
        </div>

        {/* Mini TGA sparkline */}
        <div className="bg-slate-950/60 rounded-xl p-3 mb-3 border border-red-900/20">
          <div className="flex items-center justify-between mb-1">
            <div className="text-[10px] uppercase text-slate-500 tracking-wider">TGA egri chiziq</div>
            <div className="text-[10px] text-orange-400 font-mono">25 → 1000°C</div>
          </div>
          <MiniSparkline data={SPARKLINE_DATA[b.id]} color={meta.bar} width={280} height={44} />
        </div>

        {/* TGA bosqichlari */}
        <div className="bg-gradient-to-br from-red-950/30 to-orange-950/20 rounded-xl p-3 mb-3 border border-red-500/20">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-orange-400">🔥</span>
            <div className="text-[10px] uppercase text-orange-400 tracking-wider font-bold">Parchalanish</div>
          </div>
          <div className="text-orange-100 text-xs font-mono leading-relaxed">{b.tgaSteps}</div>
        </div>

        {/* Qoldiq */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 uppercase tracking-wider text-[10px]">Yakuniy qoldiq</span>
          <span className="font-mono font-bold text-emerald-300 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/30">{b.residue}</span>
        </div>

        {/* Notes */}
        <div className="mt-3 pt-3 border-t border-red-900/20 flex items-center justify-between">
          <p className="text-slate-400 text-[11px] italic flex-1">✨ {b.notes}</p>
          <span className={`ml-2 text-lg ${meta.text} group-hover:translate-x-1 transition-transform`}>→</span>
        </div>
      </div>
    </button>
  )
}

// ═══ COMPACT CARD — mini variant
function CompactCard({ compound: b, idx, onOpen }) {
  const meta = METAL_META[b.metal] || { bar: "#94a3b8", from: "from-slate-500", to: "to-slate-700", text: "text-slate-300" }
  return (
    <button onClick={onOpen}
      className="group relative fade-in-up text-left w-full rounded-2xl overflow-hidden border border-red-800/30 bg-slate-900/60 hover:bg-slate-800/80 hover:border-red-500/50 transition p-4"
      style={{ animationDelay: `${idx * 0.03}s` }}>
      <div className={`h-1 -mx-4 -mt-4 mb-3 bg-gradient-to-r ${meta.from} ${meta.to}`} />
      <div className="flex items-center justify-between mb-2">
        <span className="text-[9px] font-black px-1.5 py-0.5 rounded" style={{ background: `${meta.bar}22`, color: meta.bar }}>{b.metal}</span>
        <span className="text-xs font-mono text-yellow-300">{b.molarMass}</span>
      </div>
      <h4 className="text-sm font-black text-white font-mono break-all leading-tight mb-2">{b.formula}</h4>
      <MiniSparkline data={SPARKLINE_DATA[b.id]} color={meta.bar} width={200} height={28} />
      <div className="mt-2 text-[10px] text-slate-400 truncate">→ {b.residue}</div>
    </button>
  )
}

// ═══ MINI SVG SPARKLINE — TGA egri chizig'i
function MiniSparkline({ data, color, width, height }) {
  if (!data || data.length === 0) return null
  const max = 100, min = 0
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (width - 4) + 2
    const y = height - 2 - ((v - min) / (max - min)) * (height - 4)
    return `${x},${y}`
  }).join(" ")
  const areaPath = `M 2,${height} L ${pts.split(" ").join(" L ")} L ${width - 2},${height} Z`

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      <defs>
        <linearGradient id={`spark-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* baseline chiziq */}
      <line x1="2" y1={height - 2} x2={width - 2} y2={height - 2} stroke="#374151" strokeWidth="0.5" />
      {/* to'ldirilgan maydon */}
      <path d={areaPath} fill={`url(#spark-${color.replace("#", "")})`} />
      {/* asosiy egri */}
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* boshi va oxiri nuqtalari */}
      <circle cx="2" cy={height - 2 - ((data[0] - min) / (max - min)) * (height - 4)} r="2" fill={color} />
      <circle cx={width - 2} cy={height - 2 - ((data[data.length - 1] - min) / (max - min)) * (height - 4)} r="2" fill={color} />
    </svg>
  )
}

// ═══ METAL ORBITAL — kichik SVG
function MetalOrbital({ hex }) {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="6" fill={hex} opacity="0.9" />
      <ellipse cx="32" cy="32" rx="24" ry="9" fill="none" stroke={hex} strokeWidth="1" opacity="0.5" />
      <ellipse cx="32" cy="32" rx="24" ry="9" fill="none" stroke={hex} strokeWidth="1" opacity="0.5" transform="rotate(60 32 32)" />
      <ellipse cx="32" cy="32" rx="24" ry="9" fill="none" stroke={hex} strokeWidth="1" opacity="0.5" transform="rotate(120 32 32)" />
    </svg>
  )
}

// ═══ HYDRATE ISOMER CARD — gidrat izomer showcase
function HydrateIsomerCard({ formula, colorName, hex, waterInner, waterOuter, temps, desc }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-slate-900/70 border transition hover:scale-[1.02]"
      style={{ borderColor: `${hex}44` }}>
      <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${hex}, ${hex}66)` }} />
      <div className="p-5">
        {/* Rang doirasi */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full shadow-lg" style={{ background: hex, boxShadow: `0 0 20px ${hex}55` }} />
          <div>
            <div className="text-xs uppercase tracking-widest text-slate-500">Rangi</div>
            <div className="font-bold text-white">{colorName}</div>
          </div>
        </div>

        <div className="font-mono text-lg font-black text-white mb-4 break-all">{formula}</div>

        {/* Suv taqsimoti — vizual */}
        <div className="bg-slate-950/60 rounded-xl p-3 mb-3">
          <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Suv taqsimoti</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center">
              <div className="flex justify-center gap-0.5 mb-1">
                {Array.from({ length: waterInner }).map((_, i) => <span key={i} className="text-blue-400">💧</span>)}
              </div>
              <div className="text-[10px] text-blue-300">Ichki ({waterInner})</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center gap-0.5 mb-1">
                {waterOuter > 0 ? Array.from({ length: waterOuter }).map((_, i) => <span key={i} className="text-cyan-300 opacity-60">💧</span>) : <span className="text-slate-600">—</span>}
              </div>
              <div className="text-[10px] text-cyan-300">Tashqi ({waterOuter})</div>
            </div>
          </div>
        </div>

        {/* Temperatura */}
        <div className="bg-gradient-to-r from-orange-950/50 to-red-950/50 rounded-xl p-3 mb-3 border border-orange-500/20">
          <div className="text-[10px] uppercase tracking-widest text-orange-400">Ajralish harorati</div>
          <div className="font-mono text-orange-200 font-bold">{temps}</div>
        </div>

        <p className="text-slate-300 text-xs italic leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

// ═══ EMPTY STATE
function EmptyState({ onReset }) {
  return (
    <div className="bg-slate-900/60 border border-red-800/30 rounded-3xl p-12 text-center">
      <div className="text-6xl mb-4 opacity-40">🔍</div>
      <h3 className="text-2xl font-black text-white mb-2">Hech narsa topilmadi</h3>
      <p className="text-slate-400 mb-6">Filter shartlarini o'zgartiring yoki qidiruvni tozalang</p>
      <button onClick={onReset}
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-white font-bold shadow-lg shadow-red-500/30 transition">
        Barcha birikmalarni ko'rsatish
      </button>
    </div>
  )
}

// ═══ COMPOUND MODAL — batafsil ko'rish
function CompoundModal({ compound: b, onClose }) {
  const meta = METAL_META[b.metal] || { from: "from-slate-500", to: "to-slate-700", ring: "ring-slate-400/50", text: "text-slate-300", glow: "shadow-slate-500/30", config: "—", bar: "#94a3b8", name: "—", Z: 0 }

  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", onEsc)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onEsc)
      document.body.style.overflow = ""
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md fade-in-up"
      onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}
        className={`relative max-w-4xl w-full max-h-[92vh] overflow-y-auto rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-red-500/40 shadow-2xl ${meta.glow}`}>

        {/* Top gradient bar */}
        <div className={`h-2 bg-gradient-to-r ${meta.from} ${meta.to}`} />

        {/* Close */}
        <button onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-800/80 hover:bg-red-500/80 border border-red-500/30 text-white text-xl transition z-10">✕</button>

        <div className="p-8 md:p-10">
          {/* Sarlavha */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest border"
                style={{ background: `${meta.bar}22`, borderColor: `${meta.bar}55`, color: meta.bar }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.bar }} />
                {b.metal} • Z = {meta.Z} • {meta.config}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white font-mono break-all leading-tight mb-2">{b.formula}</h2>
            <p className="text-slate-300 italic">{b.iupac}</p>
          </div>

          {/* 3 ta katta parametr */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-slate-950/60 rounded-2xl p-4 border border-red-900/30">
              <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Molyar massa</div>
              <div className={`text-3xl font-black bg-gradient-to-br ${meta.from} ${meta.to} bg-clip-text text-transparent`}>{b.molarMass}</div>
              <div className="text-[10px] text-slate-500 font-mono">g/mol</div>
            </div>
            <div className="bg-slate-950/60 rounded-2xl p-4 border border-red-900/30">
              <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Rang</div>
              <div className="text-sm text-white font-bold mt-2">{b.color}</div>
            </div>
            <div className="bg-slate-950/60 rounded-2xl p-4 border border-red-900/30">
              <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Turi</div>
              <div className="text-sm text-white font-bold mt-2">{b.type}</div>
            </div>
            <div className="bg-slate-950/60 rounded-2xl p-4 border border-emerald-500/30">
              <div className="text-[10px] uppercase tracking-widest text-emerald-400 mb-1">Qoldiq</div>
              <div className="text-lg font-mono font-black text-emerald-300 mt-1">{b.residue}</div>
            </div>
          </div>

          {/* Katta TGA sparkline */}
          <div className="bg-gradient-to-br from-slate-950/80 to-red-950/20 rounded-2xl p-6 border border-red-500/20 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs uppercase tracking-widest text-red-400 font-bold">🔥 TGA termogramma (simulyatsiya)</div>
                <div className="text-slate-500 text-xs mt-1">Massa % ⇔ Harorat</div>
              </div>
              <div className="text-xs text-slate-500 font-mono">25°C → 1000°C</div>
            </div>
            <div className="bg-slate-950/60 rounded-xl p-4">
              <BigSparkline data={SPARKLINE_DATA[b.id]} color={meta.bar} />
            </div>
          </div>

          {/* Parchalanish bosqichlari */}
          <div className="bg-gradient-to-br from-orange-950/30 to-red-950/20 rounded-2xl p-6 border border-orange-500/20 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🔥</span>
              <div>
                <div className="text-xs uppercase tracking-widest text-orange-400 font-bold">Termik parchalanish bosqichlari</div>
              </div>
            </div>
            <div className="text-orange-100 font-mono text-sm leading-relaxed bg-slate-950/60 rounded-xl p-4">{b.tgaSteps}</div>
          </div>

          {/* Eslatma */}
          <div className="bg-gradient-to-br from-purple-950/30 to-blue-950/20 rounded-2xl p-6 border border-purple-500/20">
            <div className="flex items-start gap-3">
              <div className="text-3xl">✨</div>
              <div>
                <div className="text-xs uppercase tracking-widest text-purple-400 font-bold mb-1">Ilmiy eslatma</div>
                <p className="text-slate-200 leading-relaxed">{b.notes}</p>
              </div>
            </div>
          </div>

          {/* Batafsil sahifa havolasi */}
          <div className="mt-6 pt-6 border-t border-red-900/30 flex flex-col md:flex-row gap-3">
            <Link href={`/ilmiy/tahlil/termik/birikmalar/${b.slug}`}
              className={`flex-1 px-6 py-4 rounded-2xl bg-gradient-to-r ${meta.from} ${meta.to} hover:opacity-90 shadow-lg ${meta.glow} text-white font-black text-center transition`}>
              📖 Batafsil sahifaga o'tish →
            </Link>
            <button onClick={onClose}
              className="px-6 py-4 rounded-2xl bg-slate-800/60 hover:bg-slate-700/60 border border-red-800/40 text-slate-300 font-semibold transition">
              Yopish
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══ BIG SPARKLINE — modal uchun katta grafik (bosqich yozuvlari bilan)
function BigSparkline({ data, color }) {
  if (!data || data.length === 0) return null
  const W = 700, H = 200, pad = 30
  const max = 100, min = 0
  const temps = [25, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100]
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (W - 2 * pad)
    const y = pad + (1 - (v - min) / (max - min)) * (H - 2 * pad)
    return { x, y, v, t: temps[i] || 25 + i * 100 }
  })
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")
  const area = `M ${pad},${H - pad} L ${pts.map(p => `${p.x} ${p.y}`).join(" L ")} L ${W - pad},${H - pad} Z`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
      <defs>
        <linearGradient id="bigspark-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* panjara */}
      {[0, 25, 50, 75, 100].map((v, i) => {
        const y = pad + (1 - v / 100) * (H - 2 * pad)
        return (
          <g key={i}>
            <line x1={pad} y1={y} x2={W - pad} y2={y} stroke="#374151" strokeWidth="0.3" strokeDasharray="2,3" />
            <text x={pad - 5} y={y + 4} fill="#64748b" fontSize="10" textAnchor="end">{v}%</text>
          </g>
        )
      })}
      {/* T o'qi */}
      {[0, 3, 6, 9, 11].map((i) => (
        <text key={i} x={pad + (i / (data.length - 1)) * (W - 2 * pad)} y={H - 10} fill="#64748b" fontSize="10" textAnchor="middle">{25 + i * 100}°</text>
      ))}
      {/* asosiy o'qlar */}
      <line x1={pad} y1={pad} x2={pad} y2={H - pad} stroke="#475569" strokeWidth="1" />
      <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="#475569" strokeWidth="1" />
      {/* to'ldirilgan */}
      <path d={area} fill="url(#bigspark-grad)" />
      {/* asosiy egri */}
      <path d={line} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* nuqtalar */}
      {pts.filter((_, i) => i % 2 === 0).map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={color} stroke="#0f172a" strokeWidth="1.5" />
      ))}
      {/* teg */}
      <text x={W / 2} y={20} fill={color} fontSize="11" textAnchor="middle" fontWeight="bold">TGA — massa (%) ↔ harorat (°C)</text>
    </svg>
  )
}
